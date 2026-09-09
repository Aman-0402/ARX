import { useEffect, useState } from 'react'
import Field from './Field.jsx'
import { confirmDelete } from '../../lib/alerts.js'

/**
 * Generic list+form admin CRUD page for simple resources (Industry, CaseStudy,
 * TechStackItem, ProcessStep, FAQ) that all share the same shape: a handful of
 * text/number/checkbox/file fields, an "order" for display ordering, and a
 * "published" toggle. Config-driven so each resource page is just a fields list.
 *
 * fields: [{ key, label, type: 'text'|'textarea'|'number'|'checkbox'|'file', required }]
 */
export default function SimpleCrudPage({ title, description, api, fields, itemLabel, imageField }) {
  const emptyForm = Object.fromEntries(
    fields.map((f) => [f.key, f.type === 'checkbox' ? true : f.type === 'number' ? 0 : f.type === 'file' ? null : ''])
  )
  const hasFile = fields.some((f) => f.type === 'file')

  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  function load() {
    setStatus('loading')
    api.fetchAdmin()
      .then((data) => {
        setItems(data)
        setStatus('ready')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }

  useEffect(load, [])

  function update(field) {
    return (e) => {
      const value = field.type === 'checkbox' ? e.target.checked : field.type === 'file' ? e.target.files[0] || null : e.target.value
      setForm((f) => ({ ...f, [field.key]: value }))
    }
  }

  function startEdit(item) {
    setEditingId(item.id)
    const next = { ...emptyForm }
    for (const f of fields) {
      if (f.type === 'file') continue
      next[f.key] = item[f.key] ?? next[f.key]
    }
    setForm(next)
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    let body
    if (hasFile) {
      body = new FormData()
      for (const f of fields) {
        if (f.type === 'file') {
          if (form[f.key]) body.set(f.key, form[f.key])
        } else if (f.type === 'number') {
          body.set(f.key, String(Number(form[f.key]) || 0))
        } else {
          body.set(f.key, String(form[f.key]))
        }
      }
    } else {
      body = {}
      for (const f of fields) {
        body[f.key] = f.type === 'number' ? Number(form[f.key]) || 0 : form[f.key]
      }
    }
    try {
      if (editingId) {
        await api.update(editingId, body)
      } else {
        await api.create(body)
      }
      cancelEdit()
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!(await confirmDelete())) return
    try {
      await api.remove(id)
      if (editingId === id) cancelEdit()
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-graphite">{title}</h1>
      {description && <p className="mt-1 text-sm text-slate">{description}</p>}

      {error && (
        <p className="mt-4 border border-slate-200 p-4 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="font-display text-lg font-semibold text-graphite">
            {editingId ? 'Edit entry' : 'New entry'}
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {fields.map((f) =>
              f.type === 'checkbox' ? (
                <label key={f.key} className="flex items-center gap-2 text-sm text-graphite">
                  <input type="checkbox" checked={form[f.key]} onChange={update(f)} />
                  {f.label}
                </label>
              ) : (
              <Field key={f.key} label={f.label} required={f.required && !(f.type === 'file' && editingId)}>
                {f.type === 'textarea' ? (
                  <textarea
                    required={f.required}
                    rows={3}
                    value={form[f.key]}
                    onChange={update(f)}
                    className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
                  />
                ) : f.type === 'file' ? (
                  <input
                    type="file"
                    accept="image/*"
                    required={f.required && !editingId}
                    onChange={update(f)}
                    className="w-full text-sm text-graphite"
                  />
                ) : (
                  <input
                    required={f.required}
                    type={f.type === 'number' ? 'number' : 'text'}
                    value={form[f.key]}
                    onChange={update(f)}
                    className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
                  />
                )}
              </Field>
              )
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-graphite disabled:opacity-60"
              >
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-sm border border-slate-200 px-5 py-2.5 text-sm font-medium text-graphite hover:border-ink"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold text-graphite">All entries</h2>
          {status === 'loading' && <p className="mt-4 text-sm text-slate">Loading…</p>}
          {status === 'ready' && items.length === 0 && (
            <p className="mt-4 text-sm text-slate">Nothing yet.</p>
          )}
          <ul className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-3">
                  {imageField && (
                    item[imageField] ? (
                      <img src={item[imageField]} alt="" loading="lazy" className="h-10 w-10 rounded-sm object-contain" />
                    ) : (
                      <div className="h-10 w-10 rounded-sm bg-slate-200" />
                    )
                  )}
                  <div>
                    <p className="text-sm font-medium text-graphite">
                      {itemLabel(item)}
                      {!item.published && <span className="ml-2 font-mono text-xs text-slate">hidden</span>}
                    </p>
                    <p className="text-xs text-slate">order {item.order}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-3 text-sm">
                  <button onClick={() => startEdit(item)} className="text-graphite hover:text-ink">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-700 hover:text-red-800">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
