import { Link } from 'react-router-dom'
import GradientBlobs from './motion/GradientBlobs.jsx'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-700 bg-ink text-paper">
      <GradientBlobs variant="mixed" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-amber font-mono text-sm text-ink">
              A
            </span>
            <span className="font-display text-lg font-semibold">ARX Infotech</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-200/70">
            Technology-driven IT services and academic automation for businesses and
            institutions — secure systems, scalable software, cloud infrastructure,
            and automation platforms built for long-term growth.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold text-paper">Quick links</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-200/70">
            <li><Link to="/" className="transition-colors hover:text-amber">Home</Link></li>
            <li><Link to="/about" className="transition-colors hover:text-coral">About</Link></li>
            <li><Link to="/services" className="transition-colors hover:text-mint">Services</Link></li>
            <li><Link to="/blog" className="transition-colors hover:text-sunbeam">Blog</Link></li>
            <li><Link to="/contact" className="transition-colors hover:text-grape">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold text-paper">Contact</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-200/70">
            <li><a href="mailto:info@arxinfo.tech" className="hover:text-amber">info@arxinfo.tech</a></li>
            <li><a href="tel:+918317818107" className="hover:text-amber">+91 83178 18107</a></li>
            <li className="leading-relaxed">
              1st Floor, 150, Panchita<br />
              Bongaon–Bagdh Rd. Street<br />
              Kolkata, India 743235
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-700/60 px-4 py-5">
        <p className="mx-auto max-w-6xl text-xs text-slate-200/50">
          © {new Date().getFullYear()} ARX Infotech. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
