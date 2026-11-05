'use client'

import { useState } from 'react'
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

const inflows = [
  { title: 'Fall 2025 STEM Grant', source: 'UNESCO Global Education Fund', amount: '+$25,000.00', time: '2h ago', icon: Sparkles, tone: 'cyan' },
  { title: 'Term 2 International Tuition', source: 'Student ID #8841 · Japan', amount: '+$3,400.00', time: '5h ago', icon: GraduationCap, tone: 'indigo' },
  { title: 'Scholarship Disbursement', source: 'Bright Futures Foundation', amount: '+$12,750.00', time: 'Yesterday', icon: Landmark, tone: 'amber' },
]

function StatCard({ label, value, detail, positive, icon: Icon }: { label: string; value: string; detail: string; positive?: boolean; icon: typeof Wallet }) {
  return (
    <div className="stat-card">
      <div className="stat-top"><span>{label}</span><span className="stat-icon"><Icon size={16} /></span></div>
      <strong>{value}</strong>
      <div className={positive ? 'stat-detail positive' : 'stat-detail'}>{positive && <TrendingUp size={13} />}{detail}</div>
    </div>
  )
}

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [synced, setSynced] = useState(false)
  const [showInvoice, setShowInvoice] = useState(false)

  const copyAddress = async () => {
    await navigator.clipboard?.writeText('payments*oakridge.edu')
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <main className="app-shell">
      <aside className={sidebarOpen ? 'sidebar open' : 'sidebar'}>
        <div className="brand"><div className="brand-mark"><GraduationCap size={21} /></div><span>EduPay <b>Global</b></span><button className="close-nav" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X size={18} /></button></div>
        <div className="campus-switcher"><span className="eyebrow">CURRENT CAMPUS</span><div>Oakridge International Academy <ChevronDown size={15} /></div><small>Kenya Campus · EA-2049</small></div>
        <nav className="nav"><a className="active"><BarChart3 size={18} />Overview</a><a><Wallet size={18} />Treasury</a><a><GraduationCap size={18} />Student payments<span className="nav-count">12</span></a><a><Landmark size={18} />Grant programs</a><a><Send size={18} />Payouts</a></nav>
        <div className="nav-bottom"><a><ShieldCheck size={18} />Compliance center</a><a><span className="avatar">AM</span>Account settings</a></div>
        <div className="sidebar-footer"><span className="status-dot" />All systems operational <span>v3.2</span></div>
      </aside>
      {sidebarOpen && <button className="scrim" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />}

      <section className="content">
        <header className="topbar"><button className="menu-button" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={21} /></button><div><p className="eyebrow">WEDNESDAY, OCTOBER 16, 2025</p><h1>Good morning, Amina <span>✦</span></h1></div><div className="top-actions"><div className="search"><Search size={16} /><span>Search dashboard</span><kbd>⌘ K</kbd></div><button className="icon-button" aria-label="Notifications"><Bell size={18} /><i /></button><div className="profile">AM</div></div></header>

        <div className="rate-bar"><div><span className="live-dot" />STELLAR ANCHOR FX</div><p><b>1 USDC = 129.40 KES</b><span>|</span> 1,485 NGN <span>|</span> <em>&lt;0.08% spread</em></p><span className="finality">3.2s finality</span></div>

        <div className="content-grid">
          <section className="main-column">
            <div className="hero-card"><div className="glow one" /><div className="glow two" /><div className="hero-heading"><div className="label-with-icon"><span className="small-icon"><Wallet size={15} /></span><span>INSTITUTIONAL TREASURY</span></div><span className="verified"><span className="status-dot" /> Audited vault</span></div><div className="hero-balance">$148,920<span>.45</span></div><div className="balance-caption">USD reserve value <b><TrendingUp size={13} /> +4.2%</b> <small>this month</small></div><div className="hero-bottom"><span><ShieldCheck size={15} /> SEP-0024 compliant</span><button onClick={() => { setSynced(true); setTimeout(() => setSynced(false), 1200) }}><RefreshCw size={14} className={synced ? 'spin' : ''} /> {synced ? 'Synced' : 'Sync balance'}</button></div></div>

            <div className="action-grid"><button className="primary-action" onClick={() => setShowInvoice(true)}><span><Plus size={21} /></span><b>New invoice</b><small>Request payment</small></button><button className="action-card"><span><Landmark size={20} /></span><b>Off-ramp</b><small>Bank transfer</small></button><button className="action-card" onClick={copyAddress}><span><ShieldCheck size={20} /></span><b>Federation</b><small>oakridge.edu</small>{copied && <label><Check size={12} /> Copied</label>}</button></div>

            <div className="section-heading"><div><h2>Asset reserves</h2><p>3 multi-rail vaults</p></div><button>Manage reserves <ArrowUpRight size={14} /></button></div>
            <div className="reserve-grid"><div className="reserve-card"><div className="reserve-title"><span className="asset-icon cyan"><span>$</span></span><div><h3>USDC balance <b>4.8% APY</b></h3><p>Circle Reserve · Stellar anchor verified</p></div><ShieldCheck size={17} /></div><div className="reserve-value"><div><strong>$94,320.00</strong><small>USDC</small></div><span className="earning"><span className="status-dot" /> Earning ~$377.28/mo</span></div></div><div className="reserve-card"><div className="reserve-title"><span className="asset-icon purple"><Sparkles size={19} /></span><div><h3>Stellar Lumens <b className="amber">+3.14% 24h</b></h3><p>Operational gas & liquidity pool</p></div></div><div className="reserve-value"><div><strong>420,000</strong><small>XLM</small><p>≈ $54,600.45 USD</p></div><svg className="sparkline" viewBox="0 0 110 42" fill="none"><path d="M1 34C16 36 18 26 30 29s15-14 28-9 15-8 24-7 17-11 27-11" stroke="#55dcff" strokeWidth="2.5" strokeLinecap="round"/><path d="M1 34C16 36 18 26 30 29s15-14 28-9 15-8 24-7 17-11 27-11v40H1z" fill="url(#g)"/><defs><linearGradient id="g" x1="55" y1="0" x2="55" y2="42"><stop stopColor="#55dcff" stopOpacity=".2"/><stop offset="1" stopColor="#55dcff" stopOpacity="0"/></linearGradient></defs></svg></div></div></div>

            <div className="section-heading recent-heading"><div><h2>Recent global inflows <span className="pulse" /></h2><p>Live settlement activity</p></div><button>View all (48) <ArrowUpRight size={14} /></button></div><div className="inflows">{inflows.map(({ title, source, amount, time, icon: Icon, tone }) => <div className="inflow" key={title}><span className={`inflow-icon ${tone}`}><Icon size={19} /></span><div className="inflow-copy"><b>{title}</b><span>{source} <i>·</i> {time}</span></div><div className="inflow-amount"><b>{amount}</b><span><span className="status-dot" /> Verified</span></div><MoreHorizontal size={18} className="more" /></div>)}</div>
          </section>

          <aside className="right-column"><div className="mini-card"><div className="mini-header"><span>SETTLEMENT PIPELINE</span><span className="live-badge"><span className="live-dot" /> LIVE</span></div><div className="pipeline-value">$8,450.00 <small>incoming</small></div><div className="progress"><span /></div><div className="pipeline-meta"><span>2 transactions resolving</span><b>&lt;15 sec</b></div></div><div className="mini-card federation"><div className="mini-header"><span>SCHOOL FEDERATION ENDPOINT</span><ShieldCheck size={16} /></div><div className="endpoint"><GraduationCap size={17} /><b>payments*oakridge.edu</b><button onClick={copyAddress} aria-label="Copy federation address">{copied ? <Check size={16} /> : <Copy size={16} />}</button></div><p>Linked to Standard Chartered KE <b>#88390</b></p></div><div className="mini-card quick-card"><div className="mini-header"><span>QUICK INSIGHTS</span><Sparkles size={16} /></div><div className="insight"><span className="insight-icon green"><TrendingUp size={17} /></span><div><b>Tuition is up 18.4%</b><span>Compared to last term</span></div><ArrowUpRight size={15} /></div><div className="insight"><span className="insight-icon blue"><GraduationCap size={17} /></span><div><b>12 scholarships funded</b><span>Across 4 programs this week</span></div><ArrowUpRight size={15} /></div></div><div className="help-card"><span><Sparkles size={18} /></span><div><b>Need help moving funds?</b><p>Talk to an education finance specialist.</p><button>Open support chat <ArrowUpRight size={13} /></button></div></div></aside>
        </div>
      </section>
      {showInvoice && <div className="modal-backdrop" onClick={() => setShowInvoice(false)}><div className="modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setShowInvoice(false)}><X size={18} /></button><span className="modal-icon"><Plus size={21} /></span><h2>Create payment request</h2><p>Generate a secure invoice for tuition or a grant disbursement.</p><label>Payment description<input defaultValue="Term 2 international tuition" /></label><label>Amount (USD)<input defaultValue="3400.00" /></label><button className="modal-submit" onClick={() => setShowInvoice(false)}>Generate invoice <ArrowUpRight size={15} /></button></div></div>}
    </main>
  )
}
