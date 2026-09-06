import { Link } from 'react-router-dom'
import GradientBlobs from './motion/GradientBlobs.jsx'
import Reveal from './motion/Reveal.jsx'
import { StaggerGrid, StaggerItem } from './motion/StaggerGrid.jsx'

const quickLinks = [
  { to: '/', label: 'Home', hover: 'hover:text-amber' },
  { to: '/about', label: 'About', hover: 'hover:text-coral' },
  { to: '/services', label: 'Services', hover: 'hover:text-mint' },
  { to: '/blog', label: 'Blog', hover: 'hover:text-sunbeam' },
  { to: '/contact', label: 'Contact', hover: 'hover:text-grape' },
]

const serviceLinks = [
  { label: 'Managed IT Services', hover: 'hover:text-amber' },
  { label: 'Product Development', hover: 'hover:text-coral' },
  { label: 'Cybersecurity', hover: 'hover:text-mint' },
  { label: 'Academic Automation', hover: 'hover:text-grape' },
]

const socials = [
  { label: 'LinkedIn', href: '#', path: <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3-.02-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21h-4V9Z" /> },
  { label: 'X', href: '#', path: <path d="M18.24 3H21l-6.6 7.54L22 21h-6.32l-4.95-6.47L4.98 21H2.2l7.07-8.08L2 3h6.48l4.47 5.9L18.24 3Zm-1.1 16.2h1.75L7.94 4.7H6.06l11.08 14.5Z" /> },
  { label: 'GitHub', href: '#', path: <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.9-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /> },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-700 bg-ink text-paper">
      <GradientBlobs variant="mixed" />

      <Reveal className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 border-b border-slate-700/60 px-4 py-10 md:flex-row md:items-center">
        <h3 className="font-display text-2xl font-semibold md:text-3xl">
          Ready to build something great?
        </h3>
        <Link
          to="/contact"
          className="group relative isolate inline-flex items-center gap-2 overflow-hidden rounded-xl border-2 border-amber bg-amber px-6 py-3 text-sm font-semibold text-ink shadow-lg shadow-amber/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber/40"
        >
          <span className="absolute inset-0 origin-right scale-x-0 bg-paper transition-transform duration-300 ease-out group-hover:scale-x-100" />
          <span className="relative">Get a free consultation</span>
          <span className="relative transition-transform duration-300 group-hover:translate-x-1.5">→</span>
        </Link>
      </Reveal>

      <div className="mx-auto max-w-[1400px] px-4 py-14">
        <StaggerGrid className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <StaggerItem>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber font-mono text-sm font-bold text-ink">
                A
              </span>
              <span className="font-display text-lg font-semibold">ARX Infotech</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-200/70">
              Technology-driven IT services and academic automation for businesses and
              institutions — secure systems, scalable software, cloud infrastructure,
              and automation platforms built for long-term growth.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber hover:text-amber"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    {s.path}
                  </svg>
                </a>
              ))}
            </div>
          </StaggerItem>

          <StaggerItem>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-paper">Quick links</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-200/70">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={`inline-block transition-all duration-200 hover:translate-x-1 ${link.hover}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-paper">Services</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-200/70">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link to="/services" className={`inline-block transition-all duration-200 hover:translate-x-1 ${link.hover}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-paper">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-200/70">
              <li>
                <a href="mailto:info@arxinfo.tech" className="transition-colors hover:text-amber">info@arxinfo.tech</a>
              </li>
              <li>
                <a href="tel:+918317818107" className="transition-colors hover:text-amber">+91 83178 18107</a>
              </li>
              <li className="leading-relaxed">
                1st Floor, 150, Panchita<br />
                Bongaon–Bagdh Rd. Street<br />
                Kolkata, India 743235
              </li>
            </ul>
          </StaggerItem>
        </StaggerGrid>
      </div>

      <div className="border-t border-slate-700/60 px-4 py-5">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 text-xs text-slate-200/50 sm:flex-row">
          <p>© {new Date().getFullYear()} ARX Infotech. All rights reserved.</p>
          <p>Built with care in Kolkata, India.</p>
        </div>
      </div>
    </footer>
  )
}
