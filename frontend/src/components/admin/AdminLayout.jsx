import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/use-auth.jsx'
import { showError } from '../../lib/alerts.js'

const links = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/blog', label: 'Blog posts' },
  { to: '/admin/contact', label: 'Contact submissions' },
  { to: '/admin/verify', label: 'Verification records' },
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/team', label: 'Team' },
  { to: '/admin/testimonials', label: 'Testimonials' },
  { to: '/admin/clients', label: 'Clients' },
  { to: '/admin/industries', label: 'Industries' },
  { to: '/admin/case-studies', label: 'Case studies' },
  { to: '/admin/tech-stack', label: 'Technology stack' },
  { to: '/admin/process-steps', label: 'Our process' },
  { to: '/admin/faq', label: 'FAQ' },
  { to: '/admin/settings', label: 'Settings' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleSignOut() {
    try {
      await logout()
    } catch (err) {
      showError(err.message)
    }
  }

  return (
    <div className="flex min-h-screen bg-paper">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-ink/40 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-slate-200 bg-paper transition-transform duration-300 md:static md:z-auto md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-2.5 border-b border-slate-200 px-6">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="ARX Infotech" className="h-8 w-8 object-contain" />
            <span className="font-display text-sm font-semibold text-graphite">Dashboard</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate hover:text-ink md:hidden"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-ink text-paper' : 'text-slate hover:bg-slate-100 hover:text-graphite'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate hover:text-ink md:hidden"
              aria-label="Open menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-slate hover:text-ink"
            >
              View site ↗
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm sm:gap-4">
            <span className="hidden text-graphite sm:inline">{user?.username}</span>
            <button onClick={handleSignOut} className="text-slate hover:text-ink">
              Sign out
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
