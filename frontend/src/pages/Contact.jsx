import { useState } from 'react'
import { submitContact } from '../lib/api.js'

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
    <section className="border-b border-slate-200">
      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-20 md:grid-cols-[1fr_1fr]">
        <div>
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
        </div>

        <form onSubmit={handleSubmit} className="border border-slate-200 p-8">
          <div className="space-y-5">
            <Field label="Full name" required>
              <input
                required
                type="text"
                value={form.name}
                onChange={update('name')}
                className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm text-graphite outline-none focus:border-ink"
              />
            </Field>
            <Field label="Email" required>
              <input
                required
                type="email"
                value={form.email}
                onChange={update('email')}
                className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm text-graphite outline-none focus:border-ink"
              />
            </Field>
            <Field label="Phone (optional)">
              <input
                type="tel"
                value={form.phone}
                onChange={update('phone')}
                className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm text-graphite outline-none focus:border-ink"
              />
            </Field>
            <Field label="How can we help?" required>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={update('message')}
                className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm text-graphite outline-none focus:border-ink"
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="mt-6 w-full rounded-sm bg-ink px-5 py-3 text-sm font-medium text-paper hover:bg-graphite disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>

          {status === 'sent' && (
            <p className="mt-4 border-t border-slate-200 pt-4 text-sm text-graphite">
              Message sent. We'll get back to you within one business day.
            </p>
          )}
          {status === 'error' && (
            <p className="mt-4 border-t border-slate-200 pt-4 text-sm text-red-700">{error}</p>
          )}
        </form>
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
