import { useEffect, useState } from 'react'
import Field from '../../components/admin/Field.jsx'
import Pagination from '../../components/admin/Pagination.jsx'
import SearchBox from '../../components/admin/SearchBox.jsx'
import {
  fetchAdminClients,
  createClient,
  updateClient,
  deleteClient,
} from '../../lib/api.js'
import { confirmDelete, showError } from '../../lib/alerts.js'
import { useDragReorder } from '../../hooks/use-drag-reorder.js'

const PAGE_SIZE = 5

const emptyForm = { name: '', website: '', order: 0, published: true, logo: null, logo_alt: '' }

export default function AdminClients() {
  const [clients, setClients] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  function load() {
    setStatus('loading')
    fetchAdminClients({ page, search })
      .then((data) => {
        setClients(data.results)
        setCount(data.count)
        setStatus('ready')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }

  useEffect(load, [page, search])

  function handleSearch(value) {
    setSearch(value)
    setPage(1)
  }

  async function handleReordered(newClients) {
    setClients(newClients)
    try {
      await Promise.all(
        newClients.map((c, i) => {
          if (c.order === i) return Promise.resolve()
          const fd = new FormData()
          fd.set('order', String(i))
          return updateClient(c.id, fd)
        })
      )
      load()
    } catch {
      showError('Could not save new order.')
      load()
    }
  }

  const { overIndex, onDragStart, onDragOver, onDrop, onDragEnd } = useDragReorder(clients, handleReordered)
  const canReorder = !search

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
    setForm({
      name: c.name, website: c.website || '', order: c.order,
      published: c.published, logo: null, logo_alt: c.logo_alt || '',
    })
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
    formData.set('logo_alt', form.logo_alt)
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
    if (!(await confirmDelete())) return
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
            <Field label="Logo alt text (optional)">
              <input
                type="text"
                value={form.logo_alt}
                onChange={update('logo_alt')}
                className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-graphite">All clients</h2>
            <SearchBox onSearch={handleSearch} placeholder="Search clients…" />
          </div>
          {canReorder && clients.length > 1 && (
            <p className="mt-2 text-xs text-slate">Drag rows to reorder.</p>
          )}
          {status === 'loading' && <p className="mt-4 text-sm text-slate">Loading…</p>}
          {status === 'ready' && clients.length === 0 && (
            <p className="mt-4 text-sm text-slate">No clients found.</p>
          )}
          <ul className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
            {clients.map((c, i) => (
              <li
                key={c.id}
                draggable={canReorder}
                onDragStart={canReorder ? onDragStart(i) : undefined}
                onDragOver={canReorder ? onDragOver(i) : undefined}
                onDrop={canReorder ? onDrop(i) : undefined}
                onDragEnd={canReorder ? onDragEnd : undefined}
                className={`flex items-center justify-between gap-4 py-4 ${canReorder ? 'cursor-move' : ''} ${overIndex === i ? 'bg-slate-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  {canReorder && <span className="text-slate-300">⠿</span>}
                  {c.logo ? (
                    <img src={c.logo} alt={c.logo_alt || ''} loading="lazy" className="h-10 w-10 rounded-sm object-contain" />
                  ) : (
                    <div className="h-10 w-10 rounded-sm bg-slate-200" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-graphite">
                      {c.name}
                      {!c.published && <span className="ml-2 font-mono text-xs text-slate">hidden</span>}
                      {c.website && (
                        <a href={c.website} target="_blank" rel="noreferrer" className="ml-2 inline-flex align-middle text-slate hover:text-ink" title={c.website}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                          </svg>
                        </a>
                      )}
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
          <Pagination page={page} count={count} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </div>
      </div>
    </div>
  )
}
