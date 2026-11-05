import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, learner_id, course_slug, progress, streak_days, last_active_at
       FROM learning_activity
       ORDER BY last_active_at DESC
       LIMIT 50`,
    )
    return NextResponse.json({ activities: result.rows })
  } catch (err) {
    console.error("[GET /api/learning]", err)
    return NextResponse.json(
      { error: "Failed to fetch learning activities" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const data = body as Record<string, unknown>
  const learnerId =
    typeof data?.learnerId === "string" ? data.learnerId.trim() : ""
  const courseSlug =
    typeof data?.courseSlug === "string" ? data.courseSlug.trim() : ""
  const progress = Number(data?.progress)
  const streakDays = Number(data?.streakDays ?? 0)

  if (
    !learnerId ||
    !courseSlug ||
    !Number.isInteger(progress) ||
    progress < 0 ||
    progress > 100
  ) {
    return NextResponse.json(
      {
        error:
          "learnerId, courseSlug, and progress (0–100 integer) are required",
      },
      { status: 400 },
    )
  }

  if (!Number.isInteger(streakDays) || streakDays < 0 || streakDays > 3650) {
    return NextResponse.json(
      { error: "streakDays must be a non-negative integer ≤ 3650" },
      { status: 400 },
    )
  }

  try {
    const id = `${learnerId}:${courseSlug}`
    const result = await pool.query(
      `INSERT INTO learning_activity (id, learner_id, course_slug, progress, streak_days, last_active_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (id) DO UPDATE SET
         progress        = EXCLUDED.progress,
         streak_days     = EXCLUDED.streak_days,
         last_active_at  = NOW()
       RETURNING id, learner_id, course_slug, progress, streak_days, last_active_at`,
      [id, learnerId, courseSlug, progress, streakDays],
    )
    return NextResponse.json({ activity: result.rows[0] }, { status: 201 })
  } catch (err) {
    console.error("[POST /api/learning]", err)
    return NextResponse.json(
      { error: "Failed to save learning activity" },
      { status: 500 },
    )
  }
}
