import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/use-auth.jsx'

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

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-paper">
        <div className="flex h-16 items-center gap-2.5 border-b border-slate-200 px-6">
          <img src="/logo.png" alt="ARX Infotech" className="h-8 w-8 object-contain" />
          <span className="font-display text-sm font-semibold text-graphite">Dashboard</span>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
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

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-slate hover:text-ink"
          >
            View site ↗
          </a>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-graphite">{user?.username}</span>
            <button onClick={logout} className="text-slate hover:text-ink">
              Sign out
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
