import { useEffect, useState } from 'react'
import { fetchServices } from '../lib/api.js'

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
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <span className="font-mono text-xs text-slate">Services</span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight text-graphite">
            Complete IT and digital transformation solutions
          </h1>
          <p className="mt-6 max-w-2xl text-slate">
            From day-to-day infrastructure support to full product builds and
            academic automation platforms — organized so you can find exactly
            what you need.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-16">
          {status === 'loading' && <p className="text-sm text-slate">Loading…</p>}
          {status === 'error' && (
            <p className="border border-slate-200 p-6 text-sm text-red-700">{error}</p>
          )}
          {status === 'ready' && (
            <div className="grid gap-px overflow-hidden border border-slate-200 bg-slate-200 md:grid-cols-2">
              {groups.map((group) => (
                <div key={group.name} className="bg-paper p-8">
                  {group.image && (
                    <img
                      src={group.image}
                      alt=""
                      className="mb-5 h-40 w-full rounded-sm object-cover"
                    />
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
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
