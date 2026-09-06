import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchServices } from '../lib/api.js'
import Reveal from '../components/motion/Reveal.jsx'
import GradientBlobs from '../components/motion/GradientBlobs.jsx'
import { StaggerGrid, StaggerItem } from '../components/motion/StaggerGrid.jsx'

const accents = ['border-t-amber', 'border-t-coral', 'border-t-mint', 'border-t-sunbeam', 'border-t-grape']

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
      <section className="relative overflow-hidden border-b border-slate-200">
        <GradientBlobs variant="mixed" />
        <div className="mx-auto max-w-[1400px] px-4 py-20">
          <Reveal>
            <span className="font-mono text-xs text-slate">Services</span>
            <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight text-graphite">
              Complete IT and digital transformation solutions
            </h1>
            <p className="mt-6 max-w-2xl text-slate">
              From day-to-day infrastructure support to full product builds and
              academic automation platforms — organized so you can find exactly
              what you need.
            </p>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-4 py-16">
          {status === 'loading' && <p className="text-sm text-slate">Loading…</p>}
          {status === 'error' && (
            <p className="rounded-2xl border border-slate-200 p-6 text-sm text-red-700">{error}</p>
          )}
          {status === 'ready' && (
            <StaggerGrid className="grid gap-5 md:grid-cols-2">
              {groups.map((group, i) => (
                <StaggerItem key={group.name}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`h-full overflow-hidden rounded-2xl border-t-4 bg-paper p-8 shadow-sm ${
                      accents[i % accents.length]
                    }`}
                  >
                    {group.image && (
                      <div className="mb-5 -mt-2 overflow-hidden rounded-xl">
                        <img
                          src={group.image}
                          alt=""
                          className="h-40 w-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                    )}
                    <h2 className="font-display text-lg font-semibold text-graphite">{group.name}</h2>
                    <ul className="mt-4 space-y-2">
                      {group.items.map((item) => (
                        <li key={item} className="flex gap-3 border-t border-slate-200 pt-2 text-sm text-slate first:border-t-0 first:pt-0">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          )}
        </div>
      </section>
    </>
  )
}
