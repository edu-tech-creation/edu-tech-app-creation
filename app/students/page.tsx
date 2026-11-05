'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  ChevronLeft,
  GraduationCap,
  RefreshCw,
} from 'lucide-react'

interface Activity {
  id: string
  learner_id: string
  course_slug: string
  progress: number
  streak_days: number
  last_active_at: string
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function StudentsPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/learning')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setActivities(json.activities ?? [])
    } catch (err) {
      setError('Could not load student data.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  return (
    <div className="page-shell">
      <div className="page-header">
        <Link href="/" className="back-link">
          <ChevronLeft size={16} /> Overview
        </Link>
        <h1><GraduationCap size={20} /> Student Payments</h1>
        <p>Track learner progress and course activity across all campuses.</p>
      </div>

      <div className="page-stats">
        <div className="page-stat">
          <span>Total learners</span>
          <strong>{activities.length}</strong>
        </div>
        <div className="page-stat">
          <span>Avg. progress</span>
          <strong>
            {activities.length
              ? Math.round(activities.reduce((s, a) => s + a.progress, 0) / activities.length)
              : 0}%
          </strong>
        </div>
        <div className="page-stat">
          <span>Avg. streak</span>
          <strong>
            {activities.length
              ? Math.round(activities.reduce((s, a) => s + a.streak_days, 0) / activities.length)
              : 0}d
          </strong>
        </div>
        <div className="page-stat">
          <span>Active courses</span>
          <strong>{new Set(activities.map((a) => a.course_slug)).size}</strong>
        </div>
      </div>

      <div className="section-heading" style={{ marginTop: 28 }}>
        <h2 className="section-label" style={{ margin: 0 }}>All activity</h2>
        <button className="refresh-btn" onClick={fetchData} aria-label="Refresh">
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {loading && (
        <p className="state-msg">Loading…</p>
      )}
      {error && (
        <p className="state-msg error">{error}</p>
      )}
      {!loading && !error && activities.length === 0 && (
        <p className="state-msg">No student activity recorded yet.</p>
      )}

      {!loading && activities.length > 0 && (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Learner ID</th>
                <th>Course</th>
                <th>Progress</th>
                <th>Streak</th>
                <th>Last active</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a) => (
                <tr key={a.id}>
                  <td className="mono">{a.learner_id}</td>
                  <td>{a.course_slug.replace(/-/g, ' ')}</td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar">
                        <span style={{ width: `${a.progress}%` }} />
                      </div>
                      <span>{a.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <span className="tag cyan">{a.streak_days}d</span>
                  </td>
                  <td className="muted-cell">{relativeTime(a.last_active_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="nav-links">
        <Link href="/grants">Grant programs <ArrowUpRight size={13} /></Link>
        <Link href="/payouts">Payouts <ArrowUpRight size={13} /></Link>
      </div>
    </div>
  )
}
