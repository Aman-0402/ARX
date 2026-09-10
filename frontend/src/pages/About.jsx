import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO.jsx'
import { fetchTeam } from '../lib/api.js'
import Reveal from '../components/motion/Reveal.jsx'
import GradientBlobs from '../components/motion/GradientBlobs.jsx'
import Counter from '../components/motion/Counter.jsx'
import SectionNav from '../components/SectionNav.jsx'
import { StaggerGrid, StaggerItem } from '../components/motion/StaggerGrid.jsx'

const heroStats = [
  { value: '120', suffix: '+', decimals: 0, static: null, label: 'Businesses served', accent: 'border-amber/40 bg-amber/5' },
  { value: null, static: '24/7', label: 'Support coverage', accent: 'border-coral/40 bg-coral/5' },
  { value: '99.98', suffix: '%', decimals: 2, static: null, label: 'Infrastructure uptime', accent: 'border-mint/40 bg-mint/5' },
]

const values = [
  {
    title: 'Security-first design',
    copy: 'Every system we ship is built to a hardened baseline, not patched after the fact.',
    color: 'amber',
    icon: <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4Z" />,
  },
  {
    title: 'Transparent delivery',
    copy: 'Clients see status, timelines, and decisions as they happen — no black boxes.',
    color: 'coral',
    icon: <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
  },
  {
    title: 'Built to scale',
    copy: 'Architecture decisions account for the client at 10x, not just at launch.',
    color: 'mint',
    icon: <path d="M3 17 9 11l4 4 8-8M21 7v6M21 7h-6" />,
  },
  {
    title: 'Long-term partnership',
    copy: 'We stay on as infrastructure evolves, not just for the initial build.',
    color: 'grape',
    icon: <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3ZM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm8 2c-2.5 0-7.5 1.25-7.5 3.75V19h15v-2.25C23.5 14.25 18.5 13 16 13Zm-8 0c-2.5 0-7.5 1.25-7.5 3.75V19H8" />,
  },
]

const valueClasses = {
  amber: { border: 'border-t-amber', ring: 'hover:border-amber', glow: 'hover:shadow-amber/25', chip: 'bg-amber/20 text-amber-dim' },
  coral: { border: 'border-t-coral', ring: 'hover:border-coral', glow: 'hover:shadow-coral/25', chip: 'bg-coral/20 text-coral' },
  mint: { border: 'border-t-mint', ring: 'hover:border-mint', glow: 'hover:shadow-mint/25', chip: 'bg-mint/20 text-mint' },
  grape: { border: 'border-t-grape', ring: 'hover:border-grape', glow: 'hover:shadow-grape/25', chip: 'bg-grape/20 text-grape' },
}

const ringAccents = ['ring-amber', 'ring-coral', 'ring-mint', 'ring-grape']

export default function About() {
  const [team, setTeam] = useState([])
  const [teamStatus, setTeamStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    fetchTeam()
      .then((data) => {
        setTeam(data)
        setTeamStatus('ready')
      })
      .catch(() => setTeamStatus('error'))
  }, [])

  const navSections = [
    { id: 'hero', label: 'Intro' },
    { id: 'what-we-do', label: 'What we do' },
    { id: 'how-we-work', label: 'How we work' },
    ...(team.length > 0 ? [{ id: 'leadership', label: 'Leadership' }] : []),
  ]

  return (
    <>
      <SEO
        path="/about"
        title="About Us"
        description="ARX Infotech works with businesses and educational institutions across infrastructure, software, and security — one accountable engineering team, not a handful of vendors."
      />
      <SectionNav sections={navSections} />

      <section id="hero" className="relative overflow-hidden border-b border-slate-200">
        <GradientBlobs variant="blue" />
        <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-8">
          <Reveal>
            <h1 className="max-w-3xl font-display text-3xl font-semibold leading-[1.1] text-graphite sm:text-4xl md:text-5xl lg:text-6xl">
              IT services and{' '}
              <span className="bg-gradient-to-r from-amber via-grape to-coral bg-clip-text text-transparent">
                academic automation
              </span>
              , built by people who run the systems they design
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate">
              ARX Infotech works with businesses and educational institutions across
              infrastructure, software, and security — combining managed IT services
              with product engineering so clients get one accountable partner
              instead of a handful of vendors.
            </p>
            <StaggerGrid className="mt-10 flex flex-wrap gap-4">
              {heroStats.map((stat) => (
                <StaggerItem key={stat.label}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`rounded-2xl border-2 px-6 py-5 shadow-sm ${stat.accent}`}
                  >
                    <div className="font-display text-3xl font-semibold text-graphite">
                      {stat.static ?? (
                        <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                      )}
                    </div>
                    <div className="mt-1 text-sm text-slate">{stat.label}</div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </Reveal>
        </div>
      </section>

      <section id="what-we-do" className="border-b border-slate-200 bg-paper-dim">
        <div className="mx-auto px-4 py-16">
          <StaggerGrid className="mx-auto grid max-w-[1400px] gap-6 md:grid-cols-2">
            <StaggerItem>
              <motion.div
                whileHover={{ y: -10, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative h-full overflow-hidden rounded-2xl border-2 border-slate-200 border-t-4 border-t-amber bg-white p-8 shadow-md transition-all duration-300 hover:border-amber hover:shadow-2xl hover:shadow-amber/20"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <motion.span
                  whileHover={{ rotate: 8, scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber/25 to-amber/5 text-amber-dim shadow-sm"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                    <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm0 10a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4Zm4-8h.01M7 17h.01" />
                  </svg>
                </motion.span>
                <h2 className="relative mt-5 font-display text-xl font-semibold text-graphite">What we do</h2>
                <p className="relative mt-3 text-sm leading-relaxed text-slate">
                  We manage <span className="font-semibold text-amber-dim">infrastructure and support</span>, build{' '}
                  <span className="font-semibold text-amber-dim">custom software products</span>, and deliver{' '}
                  <span className="font-semibold text-amber-dim">automation platforms</span> for schools and
                  colleges — admissions, attendance, reporting, and LMS
                  integration — under one engineering team.
                </p>
                <div className="relative mt-5 flex flex-wrap gap-2">
                  {['Infrastructure', 'Software', 'Automation'].map((tag) => (
                    <span key={tag} className="rounded-full bg-amber/10 px-3 py-1 text-xs font-medium text-amber-dim">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </StaggerItem>
            <StaggerItem>
              <motion.div
                whileHover={{ y: -10, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative h-full overflow-hidden rounded-2xl border-2 border-slate-200 border-t-4 border-t-coral bg-white p-8 shadow-md transition-all duration-300 hover:border-coral hover:shadow-2xl hover:shadow-coral/20"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-coral/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <motion.span
                  whileHover={{ rotate: 8, scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-coral/25 to-coral/5 text-coral shadow-sm"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm12 10v-2a4 4 0 0 0-3-3.87M15 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </motion.span>
                <h2 className="relative mt-5 font-display text-xl font-semibold text-graphite">Who we work with</h2>
                <p className="relative mt-3 text-sm leading-relaxed text-slate">
                  <span className="font-semibold text-coral">Small and mid-sized businesses</span> that need
                  dependable IT support, and{' '}
                  <span className="font-semibold text-coral">academic institutions</span> modernizing
                  admissions, attendance, and reporting workflows.
                </p>
                <div className="relative mt-5 flex flex-wrap gap-2">
                  {['SMBs', 'Schools & Colleges'].map((tag) => (
                    <span key={tag} className="rounded-full bg-coral/10 px-3 py-1 text-xs font-medium text-coral">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </StaggerItem>
          </StaggerGrid>
        </div>
      </section>

      <section id="how-we-work" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 animate-drift bg-[radial-gradient(rgba(21,34,56,0.08)_1px,transparent_1px)] bg-[length:22px_22px]" />
        <div className="mx-auto max-w-[1400px] px-4 py-20">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-graphite">How we work</h2>
          </Reveal>
          <StaggerGrid className="mt-10 grid gap-5 sm:grid-cols-2">
            {values.map((v, i) => {
              const c = valueClasses[v.color]
              return (
                <StaggerItem key={v.title}>
                  <motion.div
                    whileHover={{ y: -8, rotate: -0.5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`relative h-full overflow-hidden rounded-2xl border-2 border-slate-200 border-t-4 bg-white p-7 shadow-md transition-shadow duration-300 hover:shadow-xl ${c.border} ${c.ring} ${c.glow}`}
                  >
                    <span className="absolute -right-2 -top-4 font-display text-8xl font-bold text-slate-200/40">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`relative inline-flex h-11 w-11 items-center justify-center rounded-xl ${c.chip}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        {v.icon}
                      </svg>
                    </span>
                    <h3 className="relative mt-4 font-display text-base font-semibold text-graphite">{v.title}</h3>
                    <p className="relative mt-2 text-sm leading-relaxed text-slate">{v.copy}</p>
                  </motion.div>
                </StaggerItem>
              )
            })}
          </StaggerGrid>
        </div>
      </section>

      {teamStatus === 'ready' && team.length > 0 && (
        <section id="leadership" className="border-t border-slate-200">
          <div className="mx-auto max-w-[1400px] px-4 py-20">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold text-graphite">Leadership</h2>
            </Reveal>
            <StaggerGrid className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member, i) => (
                <StaggerItem key={member.name}>
                  <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.photo_alt || member.name}
                        loading="lazy"
                        className={`h-40 w-40 rounded-full object-cover ring-4 ring-offset-4 ring-offset-paper transition-transform hover:scale-105 ${
                          ringAccents[i % ringAccents.length]
                        }`}
                      />
                    ) : (
                      <div
                        className={`h-40 w-40 rounded-full bg-slate-200 ring-4 ring-offset-4 ring-offset-paper ${
                          ringAccents[i % ringAccents.length]
                        }`}
                      />
                    )}
                    <h3 className="mt-4 font-display text-base font-semibold text-graphite">
                      {member.name}
                    </h3>
                    <p className="font-mono text-xs text-slate">{member.role}</p>
                    {member.bio && (
                      <p className="mt-2 text-sm leading-relaxed text-slate">{member.bio}</p>
                    )}
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </section>
      )}
    </>
  )
}
