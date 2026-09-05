import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { submitContact } from '../lib/api.js'
import Reveal from '../components/motion/Reveal.jsx'
import GradientBlobs from '../components/motion/GradientBlobs.jsx'

const initialForm = { name: '', email: '', phone: '', message: '' }

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
      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-20 md:grid-cols-[1fr_1fr]">
        <Reveal>
          <span className="font-mono text-xs text-slate">Contact</span>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-graphite">
            Get a free consultation
          </h1>
          <p className="mt-5 max-w-md text-slate">
            Tell us about your infrastructure, product, or automation need.
            We typically respond within one business day.
          </p>

          <dl className="mt-10 space-y-5 border-t border-slate-200 pt-8 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate">Email</dt>
              <dd><a href="mailto:info@arxinfo.tech" className="text-graphite hover:text-ink">info@arxinfo.tech</a></dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate">Phone</dt>
              <dd><a href="tel:+918317818107" className="text-graphite hover:text-ink">+91 83178 18107</a></dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate">Office</dt>
              <dd className="text-right text-graphite">
                1st Floor, 150, Panchita<br />Bongaon–Bagdh Rd. Street<br />Kolkata, India 743235
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.1} className="rounded-2xl border border-slate-200 bg-paper p-8 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
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
              <Field label="Phone (optional)">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={update('phone')}
                  className="w-full rounded-xl border border-slate-200 bg-paper px-3 py-2.5 text-sm text-graphite outline-none transition-colors focus:border-amber"
                />
              </Field>
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
              className="mt-6 w-full rounded-xl bg-ink px-5 py-3 text-sm font-medium text-paper transition-shadow hover:shadow-lg disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </motion.button>

            <AnimatePresence>
              {status === 'sent' && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 rounded-xl bg-mint/15 px-4 py-3 text-sm text-graphite"
                >
                  Message sent. We'll get back to you within one business day.
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
