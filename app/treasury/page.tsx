'use client'

import Link from 'next/link'
import {
  ArrowUpRight,
  BarChart3,
  ChevronLeft,
  GraduationCap,
  Landmark,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react'

const vaults = [
  {
    name: 'USDC Operational Reserve',
    balance: '$94,320.00',
    currency: 'USDC',
    apy: '4.8%',
    monthly: '~$377.28/mo',
    tone: 'cyan',
    icon: '$',
    provider: 'Circle Reserve · Stellar anchor verified',
  },
  {
    name: 'Stellar Lumens Pool',
    balance: '420,000',
    currency: 'XLM ≈ $54,600.45',
    apy: '+3.14% 24h',
    monthly: 'Liquidity pool',
    tone: 'purple',
    icon: '✦',
    provider: 'Operational gas & liquidity',
  },
  {
    name: 'Emergency Fiat Buffer',
    balance: '$0.00',
    currency: 'USD',
    apy: '—',
    monthly: 'Uncommitted',
    tone: 'amber',
    icon: '⚡',
    provider: 'Standard Chartered KE #88390',
  },
]

const recentTransfers = [
  { id: 'TXN-00192', from: 'UNESCO Grant', to: 'USDC Reserve', amount: '+$25,000.00', status: 'Settled', time: '2h ago' },
  { id: 'TXN-00191', from: 'Student #8841', to: 'USDC Reserve', amount: '+$3,400.00', status: 'Settled', time: '5h ago' },
  { id: 'TXN-00190', from: 'Bright Futures', to: 'USDC Reserve', amount: '+$12,750.00', status: 'Settled', time: 'Yesterday' },
  { id: 'TXN-00189', from: 'USDC Reserve', to: 'Standard Chartered', amount: '-$8,000.00', status: 'Pending', time: '2d ago' },
]

export default function TreasuryPage() {
  return (
    <div className="page-shell">
      <div className="page-header">
        <Link href="/" className="back-link">
          <ChevronLeft size={16} /> Overview
        </Link>
        <h1><Wallet size={20} /> Treasury</h1>
        <p>Multi-rail vault management and asset reserves.</p>
      </div>

      <div className="page-stats">
        <div className="page-stat">
          <span>Total reserve value</span>
          <strong>$148,920.45</strong>
        </div>
        <div className="page-stat">
          <span>Monthly yield</span>
          <strong style={{ color: 'var(--green)' }}>+$377.28</strong>
        </div>
        <div className="page-stat">
          <span>Active vaults</span>
          <strong>3</strong>
        </div>
        <div className="page-stat">
          <span>Settlement rail</span>
          <strong>Stellar SEP-0024</strong>
        </div>
      </div>

      <h2 className="section-label">Asset vaults</h2>
      <div className="card-grid">
        {vaults.map((v) => (
          <div className="detail-card" key={v.name}>
            <div className="detail-card-top">
              <span className={`asset-icon ${v.tone}`}>{v.icon}</span>
              <div>
                <h3>{v.name}</h3>
                <p>{v.provider}</p>
              </div>
            </div>
            <div className="detail-card-bottom">
              <div>
                <strong>{v.balance}</strong>
                <small>{v.currency}</small>
              </div>
              <div className="tag-row">
                <span className="tag cyan">{v.apy}</span>
                <span className="tag muted">{v.monthly}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="section-label" style={{ marginTop: 32 }}>Recent transfers</h2>
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tx ID</th>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {recentTransfers.map((tx) => (
              <tr key={tx.id}>
                <td className="mono">{tx.id}</td>
                <td>{tx.from}</td>
                <td>{tx.to}</td>
                <td style={{ color: tx.amount.startsWith('+') ? 'var(--green)' : '#f87171' }}>
                  {tx.amount}
                </td>
                <td>
                  <span className={`status-badge ${tx.status === 'Settled' ? 'green' : 'amber'}`}>
                    {tx.status}
                  </span>
                </td>
                <td className="muted-cell">{tx.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="nav-links">
        <Link href="/grants"><Landmark size={15} /> Grant programs <ArrowUpRight size={13} /></Link>
        <Link href="/payouts"><Send size={15} /> Payouts <ArrowUpRight size={13} /></Link>
      </div>
    </div>
  )
}
