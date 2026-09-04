import { useState } from 'react'
import { verifyCertificate } from '../lib/api.js'

export default function Verify() {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState('idle') // idle | checking | found | notfound | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!code.trim()) return
    setStatus('checking')
    setError('')
    try {
      const data = await verifyCertificate(code.trim())
      if (data.found) {
        setResult(data)
        setStatus('found')
      } else {
        setStatus('notfound')
      }
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  return (
    <section className="border-b border-slate-200">
      <div className="mx-auto max-w-xl px-6 py-20">
        <span className="font-mono text-xs text-slate">Verify</span>
        <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-graphite">
          Verify a certificate or record
        </h1>
        <p className="mt-4 text-slate">
          Enter the verification code printed on the document to confirm it
          was issued by ARX Infotech or a partner institution.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex gap-3">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. ARX-2026-004821"
            className="flex-1 border border-slate-200 bg-paper px-3 py-2.5 font-mono text-sm text-graphite outline-none focus:border-ink"
          />
          <button
            type="submit"
            disabled={status === 'checking'}
            className="rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-graphite disabled:opacity-60"
          >
            {status === 'checking' ? 'Checking…' : 'Verify'}
          </button>
        </form>

        {status === 'found' && result && (
          <div className="mt-8 border border-slate-700 bg-ink p-6 font-mono text-sm text-paper">
            <div className="mb-3 flex items-center gap-2 text-amber">
              <span className="h-1.5 w-1.5 rounded-full bg-amber" />
              record verified
            </div>
            <dl className="space-y-2 text-slate-200/80">
              <div className="flex justify-between"><dt>Holder</dt><dd>{result.holder_name}</dd></div>
              <div className="flex justify-between"><dt>Record type</dt><dd>{result.record_type}</dd></div>
              <div className="flex justify-between"><dt>Issued</dt><dd>{result.issued_on}</dd></div>
            </dl>
          </div>
        )}

        {status === 'notfound' && (
          <p className="mt-8 border border-slate-200 p-6 text-sm text-graphite">
            No record found for that code. Double-check it against the printed
            document, or contact us if you believe this is an error.
          </p>
        )}

        {status === 'error' && (
          <p className="mt-8 border border-slate-200 p-6 text-sm text-red-700">{error}</p>
        )}
      </div>
    </section>
  )
}
