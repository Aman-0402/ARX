import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { submitContact } from '../lib/api.js'
import Reveal from '../components/motion/Reveal.jsx'
import GradientBlobs from '../components/motion/GradientBlobs.jsx'
import { StaggerGrid, StaggerItem } from '../components/motion/StaggerGrid.jsx'

const initialForm = { name: '', email: '', phone: '', message: '' }

const infoCards = [
  {
    label: 'Email us',
    value: 'info@arxinfo.tech',
    href: 'mailto:info@arxinfo.tech',
    accent: 'border-t-amber',
    ring: 'hover:border-amber',
    glow: 'hover:shadow-amber/20',
    chip: 'bg-amber/15 text-amber-dim',
    icon: <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2 8 6 8-6" />,
  },
  {
    label: 'Call us',
    value: '+91 83178 18107',
    href: 'tel:+918317818107',
    accent: 'border-t-coral',
    ring: 'hover:border-coral',
    glow: 'hover:shadow-coral/20',
    chip: 'bg-coral/15 text-coral',
    icon: <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02z" />,
  },
  {
    label: 'Visit us',
    value: '1st Floor, 150, Panchita, Bongaon–Bagdh Rd. Street, Kolkata, India 743235',
    href: null,
    accent: 'border-t-mint',
    ring: 'hover:border-mint',
    glow: 'hover:shadow-mint/20',
    chip: 'bg-mint/15 text-mint',
    icon: <path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13Zm0-9.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />,
  },
]

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      await submitContact(form)
      setStatus('sent')
      setForm(initialForm)
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  return (
    <section className="relative overflow-hidden border-b border-slate-200">
      <GradientBlobs variant="warm" />
      <div className="mx-auto max-w-[1400px] px-4 py-20">
        <Reveal>
          <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.1] text-graphite sm:text-5xl md:text-6xl">
            Let's talk{' '}
            <span className="text-amber underline decoration-amber/30 decoration-8 underline-offset-4">
              about your project
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate">
            Tell us about your infrastructure, product, or automation need.
            We typically respond within one business day.
          </p>
        </Reveal>

        <StaggerGrid className="mt-10 grid gap-5 sm:grid-cols-3">
          {infoCards.map((card) => {
            const Wrapper = card.href ? 'a' : 'div'
            return (
              <StaggerItem key={card.label}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`h-full rounded-2xl border-2 border-slate-200 border-t-4 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl ${card.accent} ${card.ring} ${card.glow}`}
                >
                  <Wrapper {...(card.href ? { href: card.href } : {})} className="block">
                    <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${card.chip}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        {card.icon}
                      </svg>
                    </span>
                    <h3 className="mt-4 text-sm font-medium text-slate">{card.label}</h3>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-graphite">{card.value}</p>
                  </Wrapper>
                </motion.div>
              </StaggerItem>
            )
          })}
        </StaggerGrid>

        <Reveal delay={0.15} className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md md:mt-14">
          <form onSubmit={handleSubmit} className="grid gap-10 p-8 md:grid-cols-[1fr_1.2fr] md:p-12">
            <div>
              <h2 className="font-display text-2xl font-semibold text-graphite">Send us a message</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate">
                Fill out the form and our team will get back to you within
                one business day. For anything urgent, call or WhatsApp us directly.
              </p>
              <div className="mt-8 flex items-center gap-3 rounded-xl bg-mint/10 px-4 py-3">
                <span className="h-2 w-2 shrink-0 rounded-full bg-mint" />
                <span className="text-sm text-graphite">Average response time: under 24 hours</span>
              </div>
            </div>

            <div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" required>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={update('name')}
                    className="w-full rounded-xl border border-slate-200 bg-paper px-3 py-2.5 text-sm text-graphite outline-none transition-colors focus:border-amber"
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    className="w-full rounded-xl border border-slate-200 bg-paper px-3 py-2.5 text-sm text-graphite outline-none transition-colors focus:border-amber"
                  />
                </Field>
              </div>
              <div className="mt-5">
                <Field label="Phone (optional)">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    className="w-full rounded-xl border border-slate-200 bg-paper px-3 py-2.5 text-sm text-graphite outline-none transition-colors focus:border-amber"
                  />
                </Field>
              </div>
              <div className="mt-5">
                <Field label="How can we help?" required>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={update('message')}
                    className="w-full rounded-xl border border-slate-200 bg-paper px-3 py-2.5 text-sm text-graphite outline-none transition-colors focus:border-amber"
                  />
                </Field>
              </div>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={status === 'sending'}
                className="group relative isolate mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-ink bg-ink px-5 py-3.5 text-base font-semibold text-paper transition-all duration-300 hover:shadow-lg disabled:opacity-60"
              >
                <span className="absolute inset-0 origin-right scale-x-0 bg-paper transition-transform duration-300 ease-out group-hover:scale-x-100" />
                <span className="relative transition-colors duration-300 group-hover:text-ink">
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </span>
                <span className="relative transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </motion.button>

              <AnimatePresence>
                {status === 'sent' && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex items-center gap-2 rounded-xl bg-mint/15 px-4 py-3 text-sm text-graphite"
                  >
                    <span className="text-mint">✓</span> Message sent. We'll get back to you within one business day.
                  </motion.p>
                )}
                {status === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 rounded-xl bg-coral/15 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-graphite">
        {label}{required && <span className="text-amber-dim"> *</span>}
      </span>
      {children}
    </label>
  )
}
