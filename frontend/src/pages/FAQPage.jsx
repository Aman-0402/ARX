import { useEffect, useState } from 'react'
import SEO from '../components/SEO.jsx'
import { faqApi } from '../lib/api.js'
import Reveal from '../components/motion/Reveal.jsx'
import GradientBlobs from '../components/motion/GradientBlobs.jsx'

function FAQItem({ faq, open, onToggle }) {
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-display text-lg font-medium text-graphite">{faq.question}</span>
        <span className={`shrink-0 text-2xl text-slate transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] pb-5 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <p className="text-base leading-relaxed text-slate">{faq.answer}</p>
        </div>
      </div>
    </div>
  )
}

export default function FAQPage() {
  const [status, setStatus] = useState('loading')
  const [faqs, setFaqs] = useState([])
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    faqApi.fetchPublic()
      .then((data) => {
        setFaqs(data)
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
        path="/faq"
        title="FAQ"
        description="Frequently asked questions about ARX Infotech's IT services and solutions."
      />
      <section className="relative overflow-hidden border-b border-slate-200">
        <GradientBlobs variant="mixed" />
        <div className="mx-auto max-w-[1400px] px-4 py-20">
          <Reveal>
            <h1 className="max-w-3xl font-display text-3xl font-semibold leading-[1.1] text-graphite sm:text-4xl md:text-5xl lg:text-6xl">
              Frequently asked{' '}
              <span className="bg-gradient-to-r from-amber via-grape to-coral bg-clip-text text-transparent">
                questions
              </span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[900px] px-4 py-20">
          {status === 'loading' && <p className="text-sm text-slate">Loading…</p>}
          {status === 'error' && (
            <p className="rounded-2xl border border-slate-200 p-6 text-sm text-red-700">{error}</p>
          )}
          {status === 'ready' && faqs.length === 0 && (
            <p className="rounded-2xl border border-slate-200 p-6 text-sm text-graphite">Nothing here yet.</p>
          )}
          {status === 'ready' && faqs.length > 0 && (
            <div className="border-t border-slate-200">
              {faqs.map((faq, i) => (
                <FAQItem
                  key={faq.question}
                  faq={faq}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
