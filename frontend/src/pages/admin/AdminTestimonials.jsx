import { useEffect, useState } from 'react'
import Field from '../../components/admin/Field.jsx'
import Pagination from '../../components/admin/Pagination.jsx'
import SearchBox from '../../components/admin/SearchBox.jsx'
import {
  fetchAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../../lib/api.js'
import { confirmDelete, showError } from '../../lib/alerts.js'
import { useDragReorder } from '../../hooks/use-drag-reorder.js'

const PAGE_SIZE = 5

const emptyForm = { quote: '', name: '', org: '', order: 0, published: true, photo: null, photo_alt: '' }

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([])
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
    fetchAdminTestimonials({ page, search })
      .then((data) => {
        setTestimonials(data.results)
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

  async function handleReordered(newTestimonials) {
    setTestimonials(newTestimonials)
    try {
      await Promise.all(
        newTestimonials.map((t, i) => {
          if (t.order === i) return Promise.resolve()
          const fd = new FormData()
          fd.set('order', String(i))
          return updateTestimonial(t.id, fd)
        })
      )
      load()
    } catch {
      showError('Could not save new order.')
      load()
    }
  }

  const { overIndex, onDragStart, onDragOver, onDrop, onDragEnd } = useDragReorder(testimonials, handleReordered)
  const canReorder = !search

  function update(field) {
    return (e) => {
      const value = field === 'published' ? e.target.checked : e.target.value
      setForm((f) => ({ ...f, [field]: value }))
    }
  }

  function updateFile(e) {
    setForm((f) => ({ ...f, photo: e.target.files[0] || null }))
  }

  function startEdit(t) {
    setEditingId(t.id)
    setForm({
      quote: t.quote, name: t.name, org: t.org || '', order: t.order,
      published: t.published, photo: null, photo_alt: t.photo_alt || '',
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
    formData.set('quote', form.quote)
    formData.set('name', form.name)
    formData.set('org', form.org)
    formData.set('order', String(Number(form.order) || 0))
    formData.set('published', String(form.published))
    if (form.photo) formData.set('photo', form.photo)
    formData.set('photo_alt', form.photo_alt)
    try {
      if (editingId) {
        await updateTestimonial(editingId, formData)
      } else {
        await createTestimonial(formData)
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
      await deleteTestimonial(id)
      if (editingId === id) cancelEdit()
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-graphite">Testimonials</h1>
      <p className="mt-1 text-sm text-slate">Client quotes shown in the running strip on the homepage.</p>

      {error && (
        <p className="mt-4 border border-slate-200 p-4 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="font-display text-lg font-semibold text-graphite">
            {editingId ? 'Edit testimonial' : 'New testimonial'}
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <Field label="Quote" required>
              <textarea
                required
                rows={3}
                value={form.quote}
                onChange={update('quote')}
                className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
            </Field>
            <Field label="Name" required>
              <input
                required
                type="text"
                value={form.name}
                onChange={update('name')}
                className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
            </Field>
            <Field label="Organization (optional)">
              <input
                type="text"
                value={form.org}
                onChange={update('org')}
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
            <Field label="Photo (optional)">
              <input
                type="file"
                accept="image/*"
                onChange={updateFile}
                className="w-full text-sm text-graphite"
              />
            </Field>
            <Field label="Photo alt text (optional)">
              <input
                type="text"
                value={form.photo_alt}
                onChange={update('photo_alt')}
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
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create testimonial'}
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
            <h2 className="font-display text-lg font-semibold text-graphite">All testimonials</h2>
            <SearchBox onSearch={handleSearch} placeholder="Search testimonials…" />
          </div>
          {canReorder && testimonials.length > 1 && (
            <p className="mt-2 text-xs text-slate">Drag rows to reorder.</p>
          )}
          {status === 'loading' && <p className="mt-4 text-sm text-slate">Loading…</p>}
          {status === 'ready' && testimonials.length === 0 && (
            <p className="mt-4 text-sm text-slate">No testimonials found.</p>
          )}
          <ul className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
            {testimonials.map((t, i) => (
              <li
                key={t.id}
                draggable={canReorder}
                onDragStart={canReorder ? onDragStart(i) : undefined}
                onDragOver={canReorder ? onDragOver(i) : undefined}
                onDrop={canReorder ? onDrop(i) : undefined}
                onDragEnd={canReorder ? onDragEnd : undefined}
                className={`flex items-center justify-between gap-4 py-4 ${canReorder ? 'cursor-move' : ''} ${overIndex === i ? 'bg-slate-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  {canReorder && <span className="text-slate-300">⠿</span>}
                  {t.photo ? (
                    <img src={t.photo} alt={t.photo_alt || ''} loading="lazy" className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-slate-200" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-graphite">
                      {t.name}
                      {!t.published && <span className="ml-2 font-mono text-xs text-slate">hidden</span>}
                    </p>
                    <p className="text-xs text-slate">{t.org} · order {t.order}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-3 text-sm">
                  <button onClick={() => startEdit(t)} className="text-graphite hover:text-ink">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="text-red-700 hover:text-red-800">
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
