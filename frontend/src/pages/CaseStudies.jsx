import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEO from '../components/SEO.jsx'
import { caseStudyApi } from '../lib/api.js'
import Reveal from '../components/motion/Reveal.jsx'
import GradientBlobs from '../components/motion/GradientBlobs.jsx'
import { StaggerGrid, StaggerItem } from '../components/motion/StaggerGrid.jsx'

const cardAccents = [
  { border: 'border-t-amber', glow: 'hover:shadow-amber/20', chip: 'bg-amber/15 text-amber-dim' },
  { border: 'border-t-coral', glow: 'hover:shadow-coral/20', chip: 'bg-coral/15 text-coral' },
  { border: 'border-t-mint', glow: 'hover:shadow-mint/20', chip: 'bg-mint/15 text-mint' },
  { border: 'border-t-sunbeam', glow: 'hover:shadow-sunbeam/20', chip: 'bg-sunbeam/15 text-amber-dim' },
  { border: 'border-t-grape', glow: 'hover:shadow-grape/20', chip: 'bg-grape/15 text-grape' },
]

export default function CaseStudies() {
  const [status, setStatus] = useState('loading')
  const [caseStudies, setCaseStudies] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    caseStudyApi.fetchPublic()
      .then((data) => {
        setCaseStudies(data)
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
        path="/case-studies"
        title="Case Studies"
        description="Real outcomes from real engagements — case studies from ARX Infotech's IT services and product development work."
      />
      <section className="relative overflow-hidden border-b border-slate-200">
        <GradientBlobs variant="mixed" />
        <div className="mx-auto max-w-[1400px] px-4 py-20">
          <Reveal>
            <h1 className="max-w-3xl font-display text-3xl font-semibold leading-[1.1] text-graphite sm:text-4xl md:text-5xl lg:text-6xl">
              Case{' '}
              <span className="bg-gradient-to-r from-amber via-grape to-coral bg-clip-text text-transparent">
                studies
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate">
              Real outcomes from real engagements.
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
          {status === 'ready' && caseStudies.length === 0 && (
            <p className="rounded-2xl border border-slate-200 p-6 text-sm text-graphite">Nothing here yet.</p>
          )}
          {status === 'ready' && caseStudies.length > 0 && (
            <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {caseStudies.map((cs, i) => {
                const a = cardAccents[i % cardAccents.length]
                return (
                  <StaggerItem key={cs.slug}>
                    <Link to={`/case-studies/${cs.slug}`}>
                      <motion.div
                        whileHover={{ y: -6 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className={`h-full overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl ${a.glow}`}
                      >
                        {cs.image ? (
                          <img src={cs.image} alt={cs.image_alt || cs.title} loading="lazy" className="h-40 w-full object-cover" />
                        ) : (
                          <div className={`h-2 ${a.border.replace('border-t-', 'bg-')}`} />
                        )}
                        <div className="p-7">
                          {cs.client_name && (
                            <p className="text-xs font-medium uppercase tracking-wide text-slate">{cs.client_name}</p>
                          )}
                          <h3 className="mt-1 font-display text-xl font-semibold text-graphite">{cs.title}</h3>
                          <p className="mt-3 text-sm leading-relaxed text-slate">{cs.summary}</p>
                          {cs.result && (
                            <span className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-semibold ${a.chip}`}>
                              {cs.result}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    </Link>
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
