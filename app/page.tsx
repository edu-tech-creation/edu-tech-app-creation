'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  Copy,
  GraduationCap,
  Landmark,
  Menu,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Activity {
  id: string
  learner_id: string
  course_slug: string
  progress: number
  streak_days: number
  last_active_at: string
}

// ---------------------------------------------------------------------------
// Static stat cards
// ---------------------------------------------------------------------------
function StatCard({
  label,
  value,
  detail,
  positive,
  icon: Icon,
}: {
  label: string
  value: string
  detail: string
  positive?: boolean
  icon: typeof Wallet
}) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className="stat-icon">
          <Icon size={16} />
        </span>
      </div>
      <strong>{value}</strong>
      <div className={positive ? 'stat-detail positive' : 'stat-detail'}>
        {positive && <TrendingUp size={13} />}
        {detail}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function toneForSlug(slug: string): string {
  const tones = ['cyan', 'indigo', 'amber']
  let sum = 0
  for (let i = 0; i < slug.length; i++) sum += slug.charCodeAt(i)
  return tones[sum % tones.length]
}

function iconForSlug(slug: string) {
  const icons = [GraduationCap, Landmark, Sparkles]
  let sum = 0
  for (let i = 0; i < slug.length; i++) sum += slug.charCodeAt(i)
  return icons[sum % icons.length]
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [synced, setSynced] = useState(false)
  const [showInvoice, setShowInvoice] = useState(false)

  // Invoice form state
  const [invoiceDesc, setInvoiceDesc] = useState('Term 2 international tuition')
  const [invoiceAmount, setInvoiceAmount] = useState('3400.00')
  const [invoiceSubmitting, setInvoiceSubmitting] = useState(false)
  const [invoiceError, setInvoiceError] = useState('')

  // Live activity feed
  const [activities, setActivities] = useState<Activity[]>([])
  const [activitiesLoading, setActivitiesLoading] = useState(true)
  const [activitiesError, setActivitiesError] = useState('')

  const fetchActivities = useCallback(async () => {
    setActivitiesLoading(true)
    setActivitiesError('')
    try {
      const res = await fetch('/api/learning')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setActivities(json.activities ?? [])
    } catch (err) {
      setActivitiesError('Could not load activity feed.')
      console.error(err)
    } finally {
      setActivitiesLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  const copyAddress = async () => {
    await navigator.clipboard?.writeText('payments*oakridge.edu')
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const handleSync = () => {
    setSynced(true)
    fetchActivities()
    setTimeout(() => setSynced(false), 1200)
  }

  const handleInvoiceSubmit = async () => {
    setInvoiceSubmitting(true)
    setInvoiceError('')
    try {
      const res = await fetch('/api/learning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          learnerId: `invoice-${Date.now()}`,
          courseSlug: invoiceDesc
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, ''),
          progress: 0,
          streakDays: 0,
        }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? `HTTP ${res.status}`)
      }
      await fetchActivities()
      setShowInvoice(false)
      setInvoiceDesc('Term 2 international tuition')
      setInvoiceAmount('3400.00')
    } catch (err) {
      setInvoiceError(err instanceof Error ? err.message : 'Submission failed.')
    } finally {
      setInvoiceSubmitting(false)
    }
  }

  return (
    <main className="app-shell">
      {/* ------------------------------------------------------------------ */}
      {/* Sidebar                                                              */}
      {/* ------------------------------------------------------------------ */}
      <aside className={sidebarOpen ? 'sidebar open' : 'sidebar'}>
        <div className="brand">
          <div className="brand-mark">
            <GraduationCap size={21} />
          </div>
          <span>
            EduPay <b>Global</b>
          </span>
          <button
            className="close-nav"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="campus-switcher">
          <span className="eyebrow">CURRENT CAMPUS</span>
          <div>
            Oakridge International Academy <ChevronDown size={15} />
          </div>
          <small>Kenya Campus · EA-2049</small>
        </div>

        <nav className="nav">
          <Link href="/" className="active">
            <BarChart3 size={18} />
            Overview
          </Link>
          <Link href="/treasury">
            <Wallet size={18} />
            Treasury
          </Link>
          <Link href="/students">
            <GraduationCap size={18} />
            Student payments
            <span className="nav-count">12</span>
          </Link>
          <Link href="/grants">
            <Landmark size={18} />
            Grant programs
          </Link>
          <Link href="/payouts">
            <Send size={18} />
            Payouts
          </Link>
        </nav>

        <div className="nav-bottom">
          <Link href="/compliance">
            <ShieldCheck size={18} />
            Compliance center
          </Link>
          <Link href="#">
            <span className="avatar">AM</span>
            Account settings
          </Link>
        </div>

        <div className="sidebar-footer">
          <span className="status-dot" />
          All systems operational <span>v3.2</span>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="scrim"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Main content                                                         */}
      {/* ------------------------------------------------------------------ */}
      <section className="content">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={21} />
          </button>
          <div>
            <p className="eyebrow">WEDNESDAY, OCTOBER 16, 2025</p>
            <h1>
              Good morning, Amina <span>✦</span>
            </h1>
          </div>
          <div className="top-actions">
            <div className="search">
              <Search size={16} />
              <span>Search dashboard</span>
              <kbd>⌘ K</kbd>
            </div>
            <button className="icon-button" aria-label="Notifications">
              <Bell size={18} />
              <i />
            </button>
            <div className="profile">AM</div>
          </div>
        </header>

        <div className="rate-bar">
          <div>
            <span className="live-dot" />
            STELLAR ANCHOR FX
          </div>
          <p>
            <b>1 USDC = 129.40 KES</b>
            <span>|</span> 1,485 NGN <span>|</span>{' '}
            <em>&lt;0.08% spread</em>
          </p>
          <span className="finality">3.2s finality</span>
        </div>

        <div className="content-grid">
          {/* --------------------------------------------------------------- */}
          {/* Main column                                                       */}
          {/* --------------------------------------------------------------- */}
          <section className="main-column">
            {/* Hero treasury card */}
            <div className="hero-card">
              <div className="glow one" />
              <div className="glow two" />
              <div className="hero-heading">
                <div className="label-with-icon">
                  <span className="small-icon">
                    <Wallet size={15} />
                  </span>
                  <span>INSTITUTIONAL TREASURY</span>
                </div>
                <span className="verified">
                  <span className="status-dot" /> Audited vault
                </span>
              </div>
              <div className="hero-balance">
                $148,920<span>.45</span>
              </div>
              <div className="balance-caption">
                USD reserve value{' '}
                <b>
                  <TrendingUp size={13} /> +4.2%
                </b>{' '}
                <small>this month</small>
              </div>
              <div className="hero-bottom">
                <span>
                  <ShieldCheck size={15} /> SEP-0024 compliant
                </span>
                <button onClick={handleSync}>
                  <RefreshCw size={14} className={synced ? 'spin' : ''} />{' '}
                  {synced ? 'Synced' : 'Sync balance'}
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="action-grid">
              <button
                className="primary-action"
                onClick={() => setShowInvoice(true)}
              >
                <span>
                  <Plus size={21} />
                </span>
                <b>New invoice</b>
                <small>Request payment</small>
              </button>
              <Link href="/treasury" className="action-card">
                <span>
                  <Landmark size={20} />
                </span>
                <b>Off-ramp</b>
                <small>Bank transfer</small>
              </Link>
              <button className="action-card" onClick={copyAddress}>
                <span>
                  <ShieldCheck size={20} />
                </span>
                <b>Federation</b>
                <small>oakridge.edu</small>
                {copied && (
                  <label>
                    <Check size={12} /> Copied
                  </label>
                )}
              </button>
            </div>

            {/* Asset reserves */}
            <div className="section-heading">
              <div>
                <h2>Asset reserves</h2>
                <p>3 multi-rail vaults</p>
              </div>
              <Link href="/treasury">
                Manage reserves <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="reserve-grid">
              <div className="reserve-card">
                <div className="reserve-title">
                  <span className="asset-icon cyan">
                    <span>$</span>
                  </span>
                  <div>
                    <h3>
                      USDC balance <b>4.8% APY</b>
                    </h3>
                    <p>Circle Reserve · Stellar anchor verified</p>
                  </div>
                  <ShieldCheck size={17} />
                </div>
                <div className="reserve-value">
                  <div>
                    <strong>$94,320.00</strong>
                    <small>USDC</small>
                  </div>
                  <span className="earning">
                    <span className="status-dot" /> Earning ~$377.28/mo
                  </span>
                </div>
              </div>

              <div className="reserve-card">
                <div className="reserve-title">
                  <span className="asset-icon purple">
                    <Sparkles size={19} />
                  </span>
                  <div>
                    <h3>
                      Stellar Lumens{' '}
                      <b className="amber">+3.14% 24h</b>
                    </h3>
                    <p>Operational gas &amp; liquidity pool</p>
                  </div>
                </div>
                <div className="reserve-value">
                  <div>
                    <strong>420,000</strong>
                    <small>XLM</small>
                    <p>≈ $54,600.45 USD</p>
                  </div>
                  <svg
                    className="sparkline"
                    viewBox="0 0 110 42"
                    fill="none"
                  >
                    <path
                      d="M1 34C16 36 18 26 30 29s15-14 28-9 15-8 24-7 17-11 27-11"
                      stroke="#55dcff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M1 34C16 36 18 26 30 29s15-14 28-9 15-8 24-7 17-11 27-11v40H1z"
                      fill="url(#g)"
                    />
                    <defs>
                      <linearGradient
                        id="g"
                        x1="55"
                        y1="0"
                        x2="55"
                        y2="42"
                      >
                        <stop
                          stopColor="#55dcff"
                          stopOpacity=".2"
                        />
                        <stop
                          offset="1"
                          stopColor="#55dcff"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* Recent activity — live from /api/learning                        */}
            {/* ---------------------------------------------------------------- */}
            <div className="section-heading recent-heading">
              <div>
                <h2>
                  Recent global inflows <span className="pulse" />
                </h2>
                <p>Live settlement activity</p>
              </div>
              <Link href="/students">
                View all ({activities.length}) <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="inflows">
              {activitiesLoading && (
                <p style={{ color: 'var(--muted)', fontSize: 11, padding: '12px 14px' }}>
                  Loading activity…
                </p>
              )}
              {activitiesError && (
                <p style={{ color: '#f87171', fontSize: 11, padding: '12px 14px' }}>
                  {activitiesError}
                </p>
              )}
              {!activitiesLoading && !activitiesError && activities.length === 0 && (
                <p style={{ color: 'var(--muted)', fontSize: 11, padding: '12px 14px' }}>
                  No activity yet. Create an invoice to get started.
                </p>
              )}
              {activities.map((act) => {
                const tone = toneForSlug(act.course_slug)
                const Icon = iconForSlug(act.course_slug)
                return (
                  <div className="inflow" key={act.id}>
                    <span className={`inflow-icon ${tone}`}>
                      <Icon size={19} />
                    </span>
                    <div className="inflow-copy">
                      <b>{act.course_slug.replace(/-/g, ' ')}</b>
                      <span>
                        Learner {act.learner_id} <i>·</i>{' '}
                        {relativeTime(act.last_active_at)}
                      </span>
                    </div>
                    <div className="inflow-amount">
                      <b>{act.progress}%</b>
                      <span>
                        <span className="status-dot" /> {act.streak_days}d streak
                      </span>
                    </div>
                    <MoreHorizontal size={18} className="more" />
                  </div>
                )
              })}
            </div>
          </section>

          {/* --------------------------------------------------------------- */}
          {/* Right column                                                      */}
          {/* --------------------------------------------------------------- */}
          <aside className="right-column">
            <div className="mini-card">
              <div className="mini-header">
                <span>SETTLEMENT PIPELINE</span>
                <span className="live-badge">
                  <span className="live-dot" /> LIVE
                </span>
              </div>
              <div className="pipeline-value">
                $8,450.00 <small>incoming</small>
              </div>
              <div className="progress">
                <span />
              </div>
              <div className="pipeline-meta">
                <span>2 transactions resolving</span>
                <b>&lt;15 sec</b>
              </div>
            </div>

            <div className="mini-card federation">
              <div className="mini-header">
                <span>SCHOOL FEDERATION ENDPOINT</span>
                <ShieldCheck size={16} />
              </div>
              <div className="endpoint">
                <GraduationCap size={17} />
                <b>payments*oakridge.edu</b>
                <button
                  onClick={copyAddress}
                  aria-label="Copy federation address"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <p>
                Linked to Standard Chartered KE <b>#88390</b>
              </p>
            </div>

            <div className="mini-card quick-card">
              <div className="mini-header">
                <span>QUICK INSIGHTS</span>
                <Sparkles size={16} />
              </div>
              <div className="insight">
                <span className="insight-icon green">
                  <TrendingUp size={17} />
                </span>
                <div>
                  <b>Tuition is up 18.4%</b>
                  <span>Compared to last term</span>
                </div>
                <ArrowUpRight size={15} />
              </div>
              <div className="insight">
                <span className="insight-icon blue">
                  <GraduationCap size={17} />
                </span>
                <div>
                  <b>12 scholarships funded</b>
                  <span>Across 4 programs this week</span>
                </div>
                <ArrowUpRight size={15} />
              </div>
            </div>

            <div className="help-card">
              <span>
                <Sparkles size={18} />
              </span>
              <div>
                <b>Need help moving funds?</b>
                <p>Talk to an education finance specialist.</p>
                <button>
                  Open support chat <ArrowUpRight size={13} />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* Invoice modal — POSTs to /api/learning                                */}
      {/* -------------------------------------------------------------------- */}
      {showInvoice && (
        <div
          className="modal-backdrop"
          onClick={() => setShowInvoice(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setShowInvoice(false)}
            >
              <X size={18} />
            </button>
            <span className="modal-icon">
              <Plus size={21} />
            </span>
            <h2>Create payment request</h2>
            <p>
              Generate a secure invoice for tuition or a grant disbursement.
            </p>
            <label>
              Payment description
              <input
                value={invoiceDesc}
                onChange={(e) => setInvoiceDesc(e.target.value)}
              />
            </label>
            <label>
              Amount (USD)
              <input
                value={invoiceAmount}
                onChange={(e) => setInvoiceAmount(e.target.value)}
                type="number"
                min="0"
                step="0.01"
              />
            </label>
            {invoiceError && (
              <p style={{ color: '#f87171', fontSize: 11, margin: '8px 0 0' }}>
                {invoiceError}
              </p>
            )}
            <button
              className="modal-submit"
              onClick={handleInvoiceSubmit}
              disabled={invoiceSubmitting}
            >
              {invoiceSubmitting ? 'Generating…' : 'Generate invoice'}{' '}
              {!invoiceSubmitting && <ArrowUpRight size={15} />}
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
