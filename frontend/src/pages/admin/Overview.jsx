import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAdminStats } from '../../lib/api.js'

const cards = [
  { key: 'blog_published', label: 'Published posts', to: '/admin/blog' },
  { key: 'blog_draft', label: 'Draft posts', to: '/admin/blog' },
  { key: 'contact_unhandled', label: 'Unhandled contacts', to: '/admin/contact' },
  { key: 'contact_total', label: 'Total contacts', to: '/admin/contact' },
  { key: 'verification_total', label: 'Verification records', to: '/admin/verify' },
  { key: 'service_groups_total', label: 'Service groups', to: '/admin/services' },
  { key: 'team_total', label: 'Team members', to: '/admin/team' },
  { key: 'testimonials_total', label: 'Testimonials', to: '/admin/testimonials' },
]

export default function Overview() {
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [stats, setStats] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAdminStats()
      .then((data) => {
        setStats(data)
        setStatus('ready')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }, [])

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-graphite">Overview</h1>
      <p className="mt-1 text-sm text-slate">Site content at a glance.</p>

      {status === 'loading' && <p className="mt-8 text-sm text-slate">Loading…</p>}
      {status === 'error' && (
        <p className="mt-8 border border-slate-200 p-4 text-sm text-red-700">{error}</p>
      )}

      {status === 'ready' && (
        <div className="mt-8 grid gap-px overflow-hidden border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.key}
              to={card.to}
              className="bg-paper p-6 transition-colors hover:bg-slate-50"
            >
              <div className="font-mono text-3xl font-semibold text-ink">{stats[card.key] ?? '—'}</div>
              <div className="mt-1 text-sm text-slate">{card.label}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
