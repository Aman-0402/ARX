import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchTeam } from '../lib/api.js'
import Reveal from '../components/motion/Reveal.jsx'
import GradientBlobs from '../components/motion/GradientBlobs.jsx'
import Counter from '../components/motion/Counter.jsx'
import { StaggerGrid, StaggerItem } from '../components/motion/StaggerGrid.jsx'

const heroStats = [
  { value: '120', suffix: '+', decimals: 0, static: null, label: 'Businesses served', accent: 'border-amber/40 bg-amber/5' },
  { value: null, static: '24/7', label: 'Support coverage', accent: 'border-coral/40 bg-coral/5' },
  { value: '99.98', suffix: '%', decimals: 2, static: null, label: 'Infrastructure uptime', accent: 'border-mint/40 bg-mint/5' },
]

const values = [
  { title: 'Security-first design', copy: 'Every system we ship is built to a hardened baseline, not patched after the fact.' },
  { title: 'Transparent delivery', copy: 'Clients see status, timelines, and decisions as they happen — no black boxes.' },
  { title: 'Built to scale', copy: 'Architecture decisions account for the client at 10x, not just at launch.' },
  { title: 'Long-term partnership', copy: 'We stay on as infrastructure evolves, not just for the initial build.' },
]

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

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200">
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

      <section className="border-b border-slate-200 bg-paper-dim">
        <div className="mx-auto px-4 py-16">
          <StaggerGrid className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-2">
            <StaggerItem>
              <div className="h-full rounded-2xl border-t-4 border-t-amber bg-paper p-8 shadow-sm">
                <h2 className="font-display text-xl font-semibold text-graphite">What we do</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate">
                  We manage infrastructure and support, build custom software
                  products, and deliver automation platforms for schools and
                  colleges — admissions, attendance, reporting, and LMS
                  integration — under one engineering team.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="h-full rounded-2xl border-t-4 border-t-coral bg-paper p-8 shadow-sm">
                <h2 className="font-display text-xl font-semibold text-graphite">Who we work with</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate">
                  Small and mid-sized businesses that need dependable IT support,
                  and academic institutions modernizing admissions, attendance,
                  and reporting workflows.
                </p>
              </div>
            </StaggerItem>
          </StaggerGrid>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-4 py-20">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-graphite">How we work</h2>
          </Reveal>
          <StaggerGrid className="mt-10 grid gap-5 sm:grid-cols-2">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="h-full rounded-2xl border border-slate-200 bg-paper p-7 shadow-sm"
                >
                  <h3 className="font-display text-base font-semibold text-graphite">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{v.copy}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {teamStatus === 'ready' && team.length > 0 && (
        <section className="border-t border-slate-200">
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
                        alt={member.name}
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
