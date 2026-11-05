import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  const result = await pool.query(
    `SELECT id, learner_id, course_slug, progress, streak_days, last_active_at
     FROM learning_activity
     ORDER BY last_active_at DESC
     LIMIT 50`,
  )

  return NextResponse.json({ activities: result.rows })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const learnerId = typeof body?.learnerId === "string" ? body.learnerId.trim() : ""
  const courseSlug = typeof body?.courseSlug === "string" ? body.courseSlug.trim() : ""
  const progress = Number(body?.progress)
  const streakDays = Number(body?.streakDays ?? 0)

  if (!learnerId || !courseSlug || !Number.isInteger(progress) || progress < 0 || progress > 100) {
    return NextResponse.json({ error: "learnerId, courseSlug, and progress (0-100) are required" }, { status: 400 })
  }

  if (!Number.isInteger(streakDays) || streakDays < 0 || streakDays > 3650) {
    return NextResponse.json({ error: "streakDays must be a non-negative integer" }, { status: 400 })
  }

  const id = `${learnerId}:${courseSlug}`
  const result = await pool.query(
    `INSERT INTO learning_activity (id, learner_id, course_slug, progress, streak_days, last_active_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     ON CONFLICT (id) DO UPDATE SET
       progress = EXCLUDED.progress,
       streak_days = EXCLUDED.streak_days,
       last_active_at = NOW()
     RETURNING id, learner_id, course_slug, progress, streak_days, last_active_at`,
    [id, learnerId, courseSlug, progress, streakDays],
  )

  return NextResponse.json({ activity: result.rows[0] }, { status: 201 })
}
