import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO.jsx'
import { fetchServices } from '../lib/api.js'
import Reveal from '../components/motion/Reveal.jsx'
import GradientBlobs from '../components/motion/GradientBlobs.jsx'
import { StaggerGrid, StaggerItem } from '../components/motion/StaggerGrid.jsx'

const accents = [
  { border: 'border-t-amber', ring: 'hover:border-amber', glow: 'hover:shadow-amber/20', chip: 'bg-amber/15 text-amber-dim', tint: 'from-amber/20' },
  { border: 'border-t-coral', ring: 'hover:border-coral', glow: 'hover:shadow-coral/20', chip: 'bg-coral/15 text-coral', tint: 'from-coral/20' },
  { border: 'border-t-mint', ring: 'hover:border-mint', glow: 'hover:shadow-mint/20', chip: 'bg-mint/15 text-mint', tint: 'from-mint/20' },
  { border: 'border-t-sunbeam', ring: 'hover:border-sunbeam', glow: 'hover:shadow-sunbeam/20', chip: 'bg-sunbeam/15 text-amber-dim', tint: 'from-sunbeam/20' },
  { border: 'border-t-grape', ring: 'hover:border-grape', glow: 'hover:shadow-grape/20', chip: 'bg-grape/15 text-grape', tint: 'from-grape/20' },
]

const icons = [
  <path key="1" d="M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm0 10a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4Zm3-8h.01M7 17h.01" />,
  <path key="2" d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10Z" />,
  <path key="3" d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4Z" />,
  <path key="4" d="m8 9-4 3 4 3m8-6 4 3-4 3m-2-9-4 12" />,
  <path key="5" d="M22 10 12 5 2 10l10 5 10-5Zm-5 2.5v4.5c0 1-2.5 2.5-5 2.5s-5-1.5-5-2.5v-4.5M22 10v6" />,
  <path key="6" d="M3 3v18h18M18.5 9 13 14.5 9.5 11 5 15.5" />,
]

export default function Services() {
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [groups, setGroups] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchServices()
      .then((data) => {
        setGroups(data)
        setStatus('ready')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }, [])

  return (
    <>
      <SEO
        path="/services"
        title="Services"
        description="Managed IT services, cloud & infrastructure, cybersecurity, product development, academic automation, and data & AI — complete IT and digital transformation solutions."
      />
      <section className="relative overflow-hidden border-b border-slate-200">
        <GradientBlobs variant="mixed" />
        <div className="mx-auto max-w-[1400px] px-4 py-20">
          <Reveal>
            <h1 className="max-w-3xl font-display text-3xl font-semibold leading-[1.1] text-graphite sm:text-4xl md:text-5xl lg:text-6xl">
              Complete IT and{' '}
              <span className="bg-gradient-to-r from-amber via-grape to-coral bg-clip-text text-transparent">
                digital transformation
              </span>{' '}
              solutions
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate">
              From day-to-day infrastructure support to full product builds and
              academic automation platforms — organized so you can find exactly
              what you need.
            </p>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-4 py-20">
          {status === 'loading' && <p className="text-sm text-slate">Loading…</p>}
          {status === 'error' && (
            <p className="rounded-2xl border border-slate-200 p-6 text-sm text-red-700">{error}</p>
          )}
          {status === 'ready' && (
            <StaggerGrid className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((group, i) => {
                const a = accents[i % accents.length]
                return (
                  <StaggerItem key={group.name}>
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl ${a.glow}`}
                    >
                      {group.image ? (
                        <div className="overflow-hidden">
                          <img
                            src={group.image}
                            alt=""
                            loading="lazy"
                            className="h-36 w-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </div>
                      ) : (
                        <div className={`h-20 bg-gradient-to-br to-white ${a.tint}`} />
                      )}
                      <div className="relative px-7 pb-7">
                        <span className={`absolute -top-7 left-7 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-md ${a.chip}`}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                            {icons[i % icons.length]}
                          </svg>
                        </span>
                        <h2 className="pt-11 font-display text-xl font-semibold text-graphite">{group.name}</h2>
                        <ul className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
                          {group.items.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-sm text-slate">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mt-0.5 h-4 w-4 flex-shrink-0 ${a.chip.split(' ')[1]}`}>
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </StaggerItem>
                )
              })}
            </StaggerGrid>
          )}
        </div>
      </section>
    </>
  )
}
