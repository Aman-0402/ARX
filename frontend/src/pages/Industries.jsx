import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO.jsx'
import { industryApi } from '../lib/api.js'
import Reveal from '../components/motion/Reveal.jsx'
import GradientBlobs from '../components/motion/GradientBlobs.jsx'
import { StaggerGrid, StaggerItem } from '../components/motion/StaggerGrid.jsx'

const cardAccents = [
  { border: 'border-t-amber', ring: 'hover:border-amber', glow: 'hover:shadow-amber/20', chip: 'bg-amber/15 text-amber-dim' },
  { border: 'border-t-coral', ring: 'hover:border-coral', glow: 'hover:shadow-coral/20', chip: 'bg-coral/15 text-coral' },
  { border: 'border-t-mint', ring: 'hover:border-mint', glow: 'hover:shadow-mint/20', chip: 'bg-mint/15 text-mint' },
  { border: 'border-t-sunbeam', ring: 'hover:border-sunbeam', glow: 'hover:shadow-sunbeam/20', chip: 'bg-sunbeam/15 text-amber-dim' },
  { border: 'border-t-grape', ring: 'hover:border-grape', glow: 'hover:shadow-grape/20', chip: 'bg-grape/15 text-grape' },
]

export default function Industries() {
  const [status, setStatus] = useState('loading')
  const [industries, setIndustries] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    industryApi.fetchPublic()
      .then((data) => {
        setIndustries(data)
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
        path="/industries"
        title="Industries"
        description="Industries and sectors ARX Infotech serves, with solutions tailored to each."
      />
      <section className="relative overflow-hidden border-b border-slate-200">
        <GradientBlobs variant="mixed" />
        <div className="mx-auto max-w-[1400px] px-4 py-20">
          <Reveal>
            <h1 className="max-w-3xl font-display text-3xl font-semibold leading-[1.1] text-graphite sm:text-4xl md:text-5xl lg:text-6xl">
              Industries{' '}
              <span className="bg-gradient-to-r from-amber via-grape to-coral bg-clip-text text-transparent">
                we serve
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate">
              Solutions tailored to the sectors we work with most.
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
          {status === 'ready' && industries.length === 0 && (
            <p className="rounded-2xl border border-slate-200 p-6 text-sm text-graphite">Nothing here yet.</p>
          )}
          {status === 'ready' && industries.length > 0 && (
            <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {industries.map((ind, i) => {
                const a = cardAccents[i % cardAccents.length]
                const isEmojiIcon = ind.icon && [...ind.icon].length <= 2
                return (
                  <StaggerItem key={ind.name}>
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`h-full rounded-2xl border-2 border-slate-200 border-t-4 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-xl ${a.border} ${a.ring} ${a.glow}`}
                    >
                      {ind.icon && (
                        isEmojiIcon ? (
                          <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${a.chip}`}>
                            {ind.icon}
                          </span>
                        ) : (
                          <span className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${a.chip}`}>
                            {ind.icon}
                          </span>
                        )
                      )}
                      <h3 className="mt-4 font-display text-xl font-semibold text-graphite">{ind.name}</h3>
                      {ind.description && (
                        <p className="mt-2 text-sm leading-relaxed text-slate">{ind.description}</p>
                      )}
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
