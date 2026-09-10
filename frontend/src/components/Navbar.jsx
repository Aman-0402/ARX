import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', accent: 'bg-amber' },
  { to: '/about', label: 'About', accent: 'bg-coral' },
  { to: '/services', label: 'Services', accent: 'bg-mint' },
  { to: '/blog', label: 'Blog', accent: 'bg-sunbeam' },
  { to: '/contact', label: 'Contact', accent: 'bg-grape' },
]

const solutionsLinks = [
  { to: '/industries', label: 'Industries' },
  { to: '/case-studies', label: 'Case Studies' },
  { to: '/technology', label: 'Technology Stack' },
  { to: '/process', label: 'Our Process' },
  { to: '/faq', label: 'FAQ' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div
        className={`mx-auto max-w-[1400px] rounded-2xl border transition-all duration-300 ${
          scrolled || open
            ? 'border-slate-200 bg-paper/90 shadow-lg shadow-ink/5 backdrop-blur-md'
            : 'border-slate-200/70 bg-paper/70 shadow-md shadow-ink/[0.03] backdrop-blur-md'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <NavLink to="/" className="group flex items-center" onClick={() => setOpen(false)}>
            <img
              src="/logo-full.png"
              alt="ARX Infotech — AI Powered Smart Innovation Company"
              className="h-9 object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex">
            {links.slice(0, 3).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `group relative px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-ink' : 'text-slate hover:text-graphite'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`pointer-events-none absolute inset-x-3 -bottom-[1px] h-0.5 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 ${link.accent} ${
                        isActive ? 'scale-x-100' : ''
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}

            <div
              className="relative"
              onMouseEnter={() => setSolutionsOpen(true)}
              onMouseLeave={() => setSolutionsOpen(false)}
            >
              <button
                className="group relative flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate transition-colors hover:text-graphite"
                onClick={() => setSolutionsOpen((v) => !v)}
                aria-expanded={solutionsOpen}
              >
                Solutions
                <svg
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${solutionsOpen ? 'rotate-180' : ''}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <div
                className={`absolute left-1/2 top-full w-56 -translate-x-1/2 pt-2 transition-all duration-200 ${
                  solutionsOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
                }`}
              >
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-paper shadow-lg shadow-ink/10">
                  {solutionsLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setSolutionsOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2.5 text-sm font-medium transition-colors ${
                          isActive ? 'bg-slate-100 text-ink' : 'text-slate hover:bg-slate-50 hover:text-graphite'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>

            {links.slice(3).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `group relative px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-ink' : 'text-slate hover:text-graphite'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`pointer-events-none absolute inset-x-3 -bottom-[1px] h-0.5 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 ${link.accent} ${
                        isActive ? 'scale-x-100' : ''
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}

            <NavLink
              to="/login"
              className="ml-3 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-all duration-200 hover:-translate-y-0.5 hover:bg-graphite hover:shadow-md"
            >
              Login
            </NavLink>
          </nav>

          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span
              className={`absolute block h-0.5 w-5 bg-graphite transition-all duration-300 ${
                open ? 'rotate-45' : '-translate-y-1.5'
              }`}
            />
            <span
              className={`absolute block h-0.5 w-5 bg-graphite transition-all duration-300 ${
                open ? '-rotate-45' : 'translate-y-1.5'
              }`}
            />
          </button>
        </div>

        <nav
          className={`grid overflow-hidden transition-all duration-300 ease-out md:hidden ${
            open ? 'grid-rows-[1fr] border-t border-slate-200 opacity-100' : 'grid-rows-[0fr] border-t-0 opacity-0'
          }`}
        >
          <div className="flex flex-col overflow-hidden px-4">
            {links.slice(0, 3).map((link, i) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }}
                className={({ isActive }) =>
                  `border-b border-slate-200/70 py-3 text-sm font-medium transition-all duration-300 ${
                    open ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
                  } ${isActive ? 'text-ink' : 'text-slate'}`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <p
              className="mt-3 pb-1 font-mono text-xs uppercase tracking-wide text-slate/70"
              style={{ transitionDelay: open ? '120ms' : '0ms' }}
            >
              Solutions
            </p>
            {solutionsLinks.map((link, i) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${(i + 3) * 40}ms` : '0ms' }}
                className={({ isActive }) =>
                  `border-b border-slate-200/70 py-3 pl-2 text-sm font-medium transition-all duration-300 ${
                    open ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
                  } ${isActive ? 'text-ink' : 'text-slate'}`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {links.slice(3).map((link, i) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${(i + 8) * 40}ms` : '0ms' }}
                className={({ isActive }) =>
                  `border-b border-slate-200/70 py-3 text-sm font-medium transition-all duration-300 ${
                    open ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
                  } ${isActive ? 'text-ink' : 'text-slate'}`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <NavLink
              to="/login"
              onClick={() => setOpen(false)}
              className="my-3 rounded-full bg-ink px-4 py-2.5 text-center text-sm font-medium text-paper"
            >
              Login
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  )
}
