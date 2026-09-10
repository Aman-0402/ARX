import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO.jsx'
import { processStepApi } from '../lib/api.js'
import Reveal from '../components/motion/Reveal.jsx'
import GradientBlobs from '../components/motion/GradientBlobs.jsx'
import { StaggerGrid, StaggerItem } from '../components/motion/StaggerGrid.jsx'

export default function OurProcess() {
  const [status, setStatus] = useState('loading')
  const [steps, setSteps] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    processStepApi.fetchPublic()
      .then((data) => {
        setSteps(data)
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
        path="/process"
        title="Our Process"
        description="How ARX Infotech takes a project from first call to delivery."
      />
      <section className="relative overflow-hidden border-b border-slate-200">
        <GradientBlobs variant="mixed" />
        <div className="mx-auto max-w-[1400px] px-4 py-20">
          <Reveal>
            <h1 className="max-w-3xl font-display text-3xl font-semibold leading-[1.1] text-graphite sm:text-4xl md:text-5xl lg:text-6xl">
              Our{' '}
              <span className="bg-gradient-to-r from-amber via-grape to-coral bg-clip-text text-transparent">
                process
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate">
              How we take a project from first call to delivery.
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
          {status === 'ready' && steps.length === 0 && (
            <p className="rounded-2xl border border-slate-200 p-6 text-sm text-graphite">Nothing here yet.</p>
          )}
          {status === 'ready' && steps.length > 0 && (
            <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <StaggerItem key={step.title}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative h-full rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
                  >
                    <span className="font-display text-5xl font-bold text-slate-200">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-3 font-display text-lg font-semibold text-graphite">{step.title}</h3>
                    {step.description && (
                      <p className="mt-2 text-sm leading-relaxed text-slate">{step.description}</p>
                    )}
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
