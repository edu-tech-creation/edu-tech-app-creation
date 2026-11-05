import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

// ---------------------------------------------------------------------------
// Lightweight session auth — cookie-based, no external dependency.
// Replace with NextAuth / Clerk / Lucia for production-grade auth.
// ---------------------------------------------------------------------------

const AUTH_COOKIE = "edu_session"
const MAX_AGE = 60 * 60 * 8 // 8 hours

/** Hardcoded demo users — swap for a DB lookup in production */
const DEMO_USERS: Record<string, { name: string; role: string; campus: string }> = {
  "amina@oakridge.edu": {
    name: "Amina",
    role: "finance_admin",
    campus: "Oakridge International Academy",
  },
}

/** POST /api/auth  — sign in */
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const data = body as Record<string, unknown>
  const email =
    typeof data?.email === "string" ? data.email.trim().toLowerCase() : ""
  const password = typeof data?.password === "string" ? data.password : ""

  // Demo: accept any non-empty password for known email addresses
  if (!email || !password || !DEMO_USERS[email]) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 },
    )
  }

  const user = DEMO_USERS[email]

  // Encode a minimal session payload (no sensitive data)
  const payload = Buffer.from(
    JSON.stringify({ email, name: user.name, role: user.role, campus: user.campus }),
  ).toString("base64")

  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE, payload, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
    path: "/",
  })

  return NextResponse.json({ user: { email, ...user } })
}

/** GET /api/auth  — return current session */
export async function GET() {
  const cookieStore = await cookies()
  const raw = cookieStore.get(AUTH_COOKIE)?.value

  if (!raw) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  try {
    const user = JSON.parse(Buffer.from(raw, "base64").toString("utf8"))
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null }, { status: 401 })
  }
}

/** DELETE /api/auth  — sign out */
export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE)
  return NextResponse.json({ ok: true })
}
