import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Reveal from '../components/motion/Reveal.jsx'
import GradientBlobs from '../components/motion/GradientBlobs.jsx'
import SEO from '../components/SEO.jsx'
import { fetchCaseStudy } from '../lib/api.js'

export default function CaseStudyDetail() {
  const { slug } = useParams()
  const [status, setStatus] = useState('loading') // loading | ready | notfound | error
  const [caseStudy, setCaseStudy] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setStatus('loading')
    fetchCaseStudy(slug)
      .then((data) => {
        if (!data) {
          setStatus('notfound')
          return
        }
        setCaseStudy(data)
        setStatus('ready')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }, [slug])

  return (
    <section className="relative overflow-hidden border-b border-slate-200">
      {status === 'ready' && caseStudy && (
        <SEO
          path={`/case-studies/${slug}`}
          title={caseStudy.title}
          description={caseStudy.summary}
          type="article"
          image={caseStudy.image || '/logo.png'}
        />
      )}
      <GradientBlobs variant="blue" />
      <div className="mx-auto max-w-[1400px] px-4 py-20">
        <Link
          to="/"
          className="group inline-flex items-center gap-1.5 font-mono text-xs text-slate transition-colors hover:text-ink"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span> Home
        </Link>

        {status === 'loading' && (
          <p className="mt-10 text-sm text-slate">Loading…</p>
        )}
        {status === 'notfound' && (
          <p className="mt-10 rounded-2xl border border-slate-200 p-6 text-sm text-graphite">
            Case study not found.
          </p>
        )}
        {status === 'error' && (
          <p className="mt-10 rounded-2xl border border-slate-200 p-6 text-sm text-red-700">{error}</p>
        )}

        {status === 'ready' && caseStudy && (
          <Reveal as="article" className="mt-6 max-w-3xl">
            {caseStudy.image && (
              <img
                src={caseStudy.image}
                alt={caseStudy.image_alt || caseStudy.title}
                className="mb-8 h-64 w-full rounded-2xl object-cover shadow-md"
              />
            )}
            {caseStudy.client_name && (
              <span className="inline-flex rounded-full bg-amber/15 px-2.5 py-1 font-mono text-xs text-amber-dim">
                {caseStudy.client_name}
              </span>
            )}
            <h1 className="mt-4 font-display text-3xl font-semibold leading-[1.1] text-graphite sm:text-4xl md:text-5xl">
              {caseStudy.title}
            </h1>
            {caseStudy.result && (
              <span className="mt-4 inline-block rounded-full bg-mint/15 px-3 py-1 text-sm font-semibold text-mint">
                {caseStudy.result}
              </span>
            )}
            <p className="mt-6 text-lg leading-relaxed text-slate">{caseStudy.summary}</p>
            {caseStudy.content && (
              <div className="mt-6 whitespace-pre-line text-base leading-relaxed text-graphite">
                {caseStudy.content}
              </div>
            )}
          </Reveal>
        )}
      </div>
    </section>
  )
}
