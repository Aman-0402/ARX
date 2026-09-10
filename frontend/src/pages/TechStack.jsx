import { useEffect, useState } from 'react'
import SEO from '../components/SEO.jsx'
import { techStackApi } from '../lib/api.js'
import Reveal from '../components/motion/Reveal.jsx'
import GradientBlobs from '../components/motion/GradientBlobs.jsx'
import { StaggerGrid, StaggerItem } from '../components/motion/StaggerGrid.jsx'

export default function TechStack() {
  const [status, setStatus] = useState('loading')
  const [techStack, setTechStack] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    techStackApi.fetchPublic()
      .then((data) => {
        setTechStack(data)
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
        path="/technology"
        title="Technology Stack"
        description="The tools and platforms ARX Infotech builds on."
      />
      <section className="relative overflow-hidden border-b border-slate-200">
        <GradientBlobs variant="mixed" />
        <div className="mx-auto max-w-[1400px] px-4 py-20">
          <Reveal>
            <h1 className="max-w-3xl font-display text-3xl font-semibold leading-[1.1] text-graphite sm:text-4xl md:text-5xl lg:text-6xl">
              Our{' '}
              <span className="bg-gradient-to-r from-amber via-grape to-coral bg-clip-text text-transparent">
                technology stack
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate">
              The tools and platforms we build on.
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
          {status === 'ready' && techStack.length === 0 && (
            <p className="rounded-2xl border border-slate-200 p-6 text-sm text-graphite">Nothing here yet.</p>
          )}
          {status === 'ready' && techStack.length > 0 && (
            <StaggerGrid className="flex flex-wrap items-center justify-center gap-x-16 gap-y-10">
              {techStack.map((t) => (
                <StaggerItem key={t.name}>
                  <img
                    src={t.logo}
                    alt={t.logo_alt || t.name}
                    loading="lazy"
                    className="h-14 max-w-[160px] object-contain grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
                  />
                </StaggerItem>
              ))}
            </StaggerGrid>
          )}
        </div>
      </section>
    </>
  )
}
