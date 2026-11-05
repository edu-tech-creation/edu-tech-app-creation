'use client'

import Link from 'next/link'
import {
  ArrowUpRight,
  ChevronLeft,
  Send,
} from 'lucide-react'

const payouts = [
  {
    id: 'PAY-0091',
    recipient: 'Prof. Halima Osei',
    type: 'Faculty salary',
    amount: '$3,200.00',
    method: 'M-Pesa',
    status: 'Completed',
    date: 'Oct 15, 2025',
  },
  {
    id: 'PAY-0090',
    recipient: 'IT Infrastructure Ltd',
    type: 'Vendor payment',
    amount: '$1,540.00',
    method: 'Bank transfer',
    status: 'Completed',
    date: 'Oct 14, 2025',
  },
  {
    id: 'PAY-0089',
    recipient: 'Scholarship Fund #4',
    type: 'Scholarship disbursement',
    amount: '$2,750.00',
    method: 'USDC on-chain',
    status: 'Pending',
    date: 'Oct 16, 2025',
  },
  {
    id: 'PAY-0088',
    recipient: 'Campus Maintenance Co.',
    type: 'Operations',
    amount: '$820.00',
    method: 'Bank transfer',
    status: 'Completed',
    date: 'Oct 12, 2025',
  },
  {
    id: 'PAY-0087',
    recipient: 'Student Bursary #8841',
    type: 'Bursary',
    amount: '$500.00',
    method: 'USDC on-chain',
    status: 'Failed',
    date: 'Oct 11, 2025',
  },
]

const statusColor: Record<string, string> = {
  Completed: 'green',
  Pending: 'amber',
  Failed: 'red',
}

export default function PayoutsPage() {
  const total = payouts
    .filter((p) => p.status === 'Completed')
    .reduce((sum, p) => sum + parseFloat(p.amount.replace(/[$,]/g, '')), 0)

  const fmt = (n: number) =>
    `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`

  return (
    <div className="page-shell">
      <div className="page-header">
        <Link href="/" className="back-link">
          <ChevronLeft size={16} /> Overview
        </Link>
        <h1><Send size={20} /> Payouts</h1>
        <p>Outbound payments to faculty, vendors, and scholarship recipients.</p>
      </div>

      <div className="page-stats">
        <div className="page-stat">
          <span>Total payouts</span>
          <strong>{payouts.length}</strong>
        </div>
        <div className="page-stat">
          <span>Completed</span>
          <strong style={{ color: 'var(--green)' }}>{fmt(total)}</strong>
        </div>
        <div className="page-stat">
          <span>Pending</span>
          <strong style={{ color: 'var(--amber)' }}>
            {fmt(
              payouts
                .filter((p) => p.status === 'Pending')
                .reduce((s, p) => s + parseFloat(p.amount.replace(/[$,]/g, '')), 0),
            )}
          </strong>
        </div>
        <div className="page-stat">
          <span>Failed</span>
          <strong style={{ color: '#f87171' }}>
            {payouts.filter((p) => p.status === 'Failed').length}
          </strong>
        </div>
      </div>

      <h2 className="section-label" style={{ marginTop: 28 }}>Payout history</h2>
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Recipient</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p) => (
              <tr key={p.id}>
                <td className="mono">{p.id}</td>
                <td>{p.recipient}</td>
                <td>{p.type}</td>
                <td>{p.amount}</td>
                <td className="muted-cell">{p.method}</td>
                <td>
                  <span
                    className={`status-badge ${statusColor[p.status] ?? 'muted'}`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="muted-cell">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="nav-links">
        <Link href="/treasury">Treasury <ArrowUpRight size={13} /></Link>
        <Link href="/compliance">Compliance center <ArrowUpRight size={13} /></Link>
      </div>
    </div>
  )
}
