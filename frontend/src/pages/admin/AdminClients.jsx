import { useEffect, useState } from 'react'
import Field from '../../components/admin/Field.jsx'
import {
  fetchAdminClients,
  createClient,
  updateClient,
  deleteClient,
} from '../../lib/api.js'

const emptyForm = { name: '', website: '', order: 0, published: true, logo: null }

export default function AdminClients() {
  const [clients, setClients] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  function load() {
    setStatus('loading')
    fetchAdminClients()
      .then((data) => {
        setClients(data)
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
      const value = field === 'published' ? e.target.checked : e.target.value
      setForm((f) => ({ ...f, [field]: value }))
    }
  }

  function updateFile(e) {
    setForm((f) => ({ ...f, logo: e.target.files[0] || null }))
  }

  function startEdit(c) {
    setEditingId(c.id)
    setForm({ name: c.name, website: c.website || '', order: c.order, published: c.published, logo: null })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const formData = new FormData()
    formData.set('name', form.name)
    formData.set('website', form.website)
    formData.set('order', String(Number(form.order) || 0))
    formData.set('published', String(form.published))
    if (form.logo) formData.set('logo', form.logo)
    try {
      if (editingId) {
        await updateClient(editingId, formData)
      } else {
        await createClient(formData)
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
    if (!window.confirm('Delete this client?')) return
    try {
      await deleteClient(id)
      if (editingId === id) cancelEdit()
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-graphite">Clients</h1>
      <p className="mt-1 text-sm text-slate">Client logos shown in the "Trusted by" strip on the homepage.</p>

      {error && (
        <p className="mt-4 border border-slate-200 p-4 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="font-display text-lg font-semibold text-graphite">
            {editingId ? 'Edit client' : 'New client'}
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <Field label="Name" required>
              <input
                required
                type="text"
                value={form.name}
                onChange={update('name')}
                className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
            </Field>
            <Field label="Logo" required={!editingId}>
              <input
                required={!editingId}
                type="file"
                accept="image/*"
                onChange={updateFile}
                className="w-full text-sm text-graphite"
              />
            </Field>
            <Field label="Website (optional)">
              <input
                type="url"
                placeholder="https://example.com"
                value={form.website}
                onChange={update('website')}
                className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
            </Field>
            <Field label="Order" required>
              <input
                required
                type="number"
                value={form.order}
                onChange={update('order')}
                className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-graphite">
              <input type="checkbox" checked={form.published} onChange={update('published')} />
              Published (visible on the homepage)
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-graphite disabled:opacity-60"
              >
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create client'}
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
          <h2 className="font-display text-lg font-semibold text-graphite">All clients</h2>
          {status === 'loading' && <p className="mt-4 text-sm text-slate">Loading…</p>}
          {status === 'ready' && clients.length === 0 && (
            <p className="mt-4 text-sm text-slate">No clients yet.</p>
          )}
          <ul className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
            {clients.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-3">
                  {c.logo ? (
                    <img src={c.logo} alt="" loading="lazy" className="h-10 w-10 rounded-sm object-contain" />
                  ) : (
                    <div className="h-10 w-10 rounded-sm bg-slate-200" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-graphite">
                      {c.name}
                      {!c.published && <span className="ml-2 font-mono text-xs text-slate">hidden</span>}
                    </p>
                    <p className="text-xs text-slate">order {c.order}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-3 text-sm">
                  <button onClick={() => startEdit(c)} className="text-graphite hover:text-ink">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-700 hover:text-red-800">
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
