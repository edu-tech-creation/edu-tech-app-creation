'use client'

import Link from 'next/link'
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  Clock,
  ShieldCheck,
} from 'lucide-react'

const checks = [
  {
    id: 'CMP-001',
    title: 'SEP-0024 KYC/AML compliance',
    description: 'All student payment corridors verified via Stellar anchor.',
    status: 'Passed',
    lastChecked: 'Oct 16, 2025',
    severity: 'info',
  },
  {
    id: 'CMP-002',
    title: 'FATF travel rule — cross-border transfers',
    description: 'Originator / beneficiary data attached to all transfers > $1,000.',
    status: 'Passed',
    lastChecked: 'Oct 15, 2025',
    severity: 'info',
  },
  {
    id: 'CMP-003',
    title: 'Annual external audit',
    description: 'PwC Kenya audit scheduled for Q4 2025.',
    status: 'Pending',
    lastChecked: 'Oct 1, 2025',
    severity: 'warn',
  },
  {
    id: 'CMP-004',
    title: 'GDPR learner data retention',
    description: 'Learner PII purge cycle — 2 records flagged for review.',
    status: 'Action required',
    lastChecked: 'Oct 14, 2025',
    severity: 'error',
  },
  {
    id: 'CMP-005',
    title: 'Smart contract audit — EduCredential',
    description: 'On-chain credential contract pending third-party security audit.',
    status: 'Pending',
    lastChecked: 'Oct 10, 2025',
    severity: 'warn',
  },
  {
    id: 'CMP-006',
    title: 'ISO 27001 information security',
    description: 'Certification renewed Oct 2025, valid through Oct 2026.',
    status: 'Passed',
    lastChecked: 'Oct 3, 2025',
    severity: 'info',
  },
]

const severityIcon = {
  info: <CheckCircle2 size={17} style={{ color: 'var(--green)' }} />,
  warn: <Clock size={17} style={{ color: 'var(--amber)' }} />,
  error: <AlertTriangle size={17} style={{ color: '#f87171' }} />,
}

const statusColor: Record<string, string> = {
  Passed: 'green',
  Pending: 'amber',
  'Action required': 'red',
}

export default function CompliancePage() {
  const passed = checks.filter((c) => c.status === 'Passed').length
  const pending = checks.filter((c) => c.status === 'Pending').length
  const actions = checks.filter((c) => c.status === 'Action required').length

  return (
    <div className="page-shell">
      <div className="page-header">
        <Link href="/" className="back-link">
          <ChevronLeft size={16} /> Overview
        </Link>
        <h1><ShieldCheck size={20} /> Compliance Center</h1>
        <p>Regulatory checks, audit trails, and policy status across all campuses.</p>
      </div>

      <div className="page-stats">
        <div className="page-stat">
          <span>Total checks</span>
          <strong>{checks.length}</strong>
        </div>
        <div className="page-stat">
          <span>Passed</span>
          <strong style={{ color: 'var(--green)' }}>{passed}</strong>
        </div>
        <div className="page-stat">
          <span>Pending</span>
          <strong style={{ color: 'var(--amber)' }}>{pending}</strong>
        </div>
        <div className="page-stat">
          <span>Action required</span>
          <strong style={{ color: '#f87171' }}>{actions}</strong>
        </div>
      </div>

      <h2 className="section-label" style={{ marginTop: 28 }}>Compliance checks</h2>
      <div className="compliance-list">
        {checks.map((c) => (
          <div className="compliance-item" key={c.id}>
            <div className="compliance-icon">{severityIcon[c.severity as keyof typeof severityIcon]}</div>
            <div className="compliance-body">
              <div className="compliance-top">
                <b>{c.title}</b>
                <span className={`status-badge ${statusColor[c.status] ?? 'muted'}`}>
                  {c.status}
                </span>
              </div>
              <p>{c.description}</p>
              <small>Last checked: {c.lastChecked}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="nav-links">
        <Link href="/treasury">Treasury <ArrowUpRight size={13} /></Link>
        <Link href="/">Back to overview <ArrowUpRight size={13} /></Link>
      </div>
    </div>
  )
}
