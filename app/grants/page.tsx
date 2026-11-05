'use client'

import Link from 'next/link'
import {
  ArrowUpRight,
  ChevronLeft,
  Landmark,
  Sparkles,
} from 'lucide-react'

const grants = [
  {
    id: 'GRT-001',
    name: 'Fall 2025 STEM Grant',
    donor: 'UNESCO Global Education Fund',
    amount: '$25,000.00',
    disbursed: '$18,750.00',
    remaining: '$6,250.00',
    status: 'Active',
    deadline: 'Dec 31, 2025',
  },
  {
    id: 'GRT-002',
    name: 'Bright Futures Scholarship',
    donor: 'Bright Futures Foundation',
    amount: '$12,750.00',
    disbursed: '$12,750.00',
    remaining: '$0.00',
    status: 'Fully disbursed',
    deadline: 'Oct 1, 2025',
  },
  {
    id: 'GRT-003',
    name: 'Digital Equity Initiative',
    donor: 'Tech4Africa NGO',
    amount: '$8,000.00',
    disbursed: '$0.00',
    remaining: '$8,000.00',
    status: 'Pending',
    deadline: 'Jan 15, 2026',
  },
  {
    id: 'GRT-004',
    name: 'Girls in STEM Bursary',
    donor: 'Kenyan Ministry of Education',
    amount: '$5,500.00',
    disbursed: '$2,750.00',
    remaining: '$2,750.00',
    status: 'Active',
    deadline: 'Mar 31, 2026',
  },
]

const statusColor: Record<string, string> = {
  Active: 'green',
  'Fully disbursed': 'cyan',
  Pending: 'amber',
}

export default function GrantsPage() {
  const totalGranted = grants.reduce(
    (sum, g) => sum + parseFloat(g.amount.replace(/[$,]/g, '')),
    0,
  )
  const totalDisbursed = grants.reduce(
    (sum, g) => sum + parseFloat(g.disbursed.replace(/[$,]/g, '')),
    0,
  )
  const totalRemaining = grants.reduce(
    (sum, g) => sum + parseFloat(g.remaining.replace(/[$,]/g, '')),
    0,
  )

  const fmt = (n: number) =>
    `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`

  return (
    <div className="page-shell">
      <div className="page-header">
        <Link href="/" className="back-link">
          <ChevronLeft size={16} /> Overview
        </Link>
        <h1><Landmark size={20} /> Grant Programs</h1>
        <p>Track donor grants, scholarships, and disbursement status.</p>
      </div>

      <div className="page-stats">
        <div className="page-stat">
          <span>Total grants</span>
          <strong>{grants.length}</strong>
        </div>
        <div className="page-stat">
          <span>Total committed</span>
          <strong>{fmt(totalGranted)}</strong>
        </div>
        <div className="page-stat">
          <span>Disbursed</span>
          <strong style={{ color: 'var(--green)' }}>{fmt(totalDisbursed)}</strong>
        </div>
        <div className="page-stat">
          <span>Remaining</span>
          <strong style={{ color: 'var(--amber)' }}>{fmt(totalRemaining)}</strong>
        </div>
      </div>

      <h2 className="section-label" style={{ marginTop: 28 }}>All grant programs</h2>
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Program</th>
              <th>Donor</th>
              <th>Total</th>
              <th>Disbursed</th>
              <th>Remaining</th>
              <th>Status</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody>
            {grants.map((g) => (
              <tr key={g.id}>
                <td className="mono">{g.id}</td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sparkles size={13} style={{ color: 'var(--cyan)' }} />
                    {g.name}
                  </span>
                </td>
                <td>{g.donor}</td>
                <td>{g.amount}</td>
                <td style={{ color: 'var(--green)' }}>{g.disbursed}</td>
                <td style={{ color: 'var(--amber)' }}>{g.remaining}</td>
                <td>
                  <span className={`status-badge ${statusColor[g.status] ?? 'muted'}`}>
                    {g.status}
                  </span>
                </td>
                <td className="muted-cell">{g.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="nav-links">
        <Link href="/students">Student payments <ArrowUpRight size={13} /></Link>
        <Link href="/payouts">Payouts <ArrowUpRight size={13} /></Link>
      </div>
    </div>
  )
}
