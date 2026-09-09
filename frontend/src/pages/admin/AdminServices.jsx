import { useEffect, useState } from 'react'
import Field from '../../components/admin/Field.jsx'
import Pagination from '../../components/admin/Pagination.jsx'
import SearchBox from '../../components/admin/SearchBox.jsx'
import {
  fetchAdminServiceGroups,
  createServiceGroup,
  updateServiceGroup,
  deleteServiceGroup,
} from '../../lib/api.js'
import { confirmDelete, showError } from '../../lib/alerts.js'
import { useDragReorder } from '../../hooks/use-drag-reorder.js'

const PAGE_SIZE = 5

const emptyForm = { name: '', order: 0, items: '', photo: null, image_alt: '' }

export default function AdminServices() {
  const [groups, setGroups] = useState([])
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
    fetchAdminServiceGroups({ page, search })
      .then((data) => {
        setGroups(data.results)
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

  async function handleReordered(newGroups) {
    setGroups(newGroups)
    try {
      await Promise.all(
        newGroups.map((g, i) => {
          if (g.order === i) return Promise.resolve()
          const fd = new FormData()
          fd.set('order', String(i))
          return updateServiceGroup(g.id, fd)
        })
      )
      load()
    } catch {
      showError('Could not save new order.')
      load()
    }
  }

  const { overIndex, onDragStart, onDragOver, onDrop, onDragEnd } = useDragReorder(groups, handleReordered)
  const canReorder = !search

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function updateFile(e) {
    setForm((f) => ({ ...f, photo: e.target.files[0] || null }))
  }

  function startEdit(group) {
    setEditingId(group.id)
    setForm({ name: group.name, order: group.order, items: group.items, photo: null, image_alt: group.image_alt || '' })
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
    formData.set('order', String(Number(form.order) || 0))
    formData.set('items', form.items)
    if (form.photo) formData.set('image', form.photo)
    formData.set('image_alt', form.image_alt)
    try {
      if (editingId) {
        await updateServiceGroup(editingId, formData)
      } else {
        await createServiceGroup(formData)
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
      await deleteServiceGroup(id)
      if (editingId === id) cancelEdit()
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-graphite">Services</h1>
      <p className="mt-1 text-sm text-slate">Groups shown on the public Services page, in order.</p>

      {error && (
        <p className="mt-4 border border-slate-200 p-4 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="font-display text-lg font-semibold text-graphite">
            {editingId ? 'Edit group' : 'New group'}
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
            <Field label="Order" required>
              <input
                required
                type="number"
                value={form.order}
                onChange={update('order')}
                className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
            </Field>
            <Field label="Image (optional)">
              <input
                type="file"
                accept="image/*"
                onChange={updateFile}
                className="w-full text-sm text-graphite"
              />
            </Field>
            <Field label="Image alt text (optional)">
              <input
                type="text"
                value={form.image_alt}
                onChange={update('image_alt')}
                className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
            </Field>
            <Field label="Items (one per line)">
              <textarea
                rows={6}
                value={form.items}
                onChange={update('items')}
                className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
            </Field>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-graphite disabled:opacity-60"
              >
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create group'}
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
            <h2 className="font-display text-lg font-semibold text-graphite">All groups</h2>
            <SearchBox onSearch={handleSearch} placeholder="Search groups…" />
          </div>
          {canReorder && groups.length > 1 && (
            <p className="mt-2 text-xs text-slate">Drag rows to reorder.</p>
          )}
          {status === 'loading' && <p className="mt-4 text-sm text-slate">Loading…</p>}
          {status === 'ready' && groups.length === 0 && (
            <p className="mt-4 text-sm text-slate">No groups found.</p>
          )}
          <ul className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
            {groups.map((group, i) => (
              <li
                key={group.id}
                draggable={canReorder}
                onDragStart={canReorder ? onDragStart(i) : undefined}
                onDragOver={canReorder ? onDragOver(i) : undefined}
                onDrop={canReorder ? onDrop(i) : undefined}
                onDragEnd={canReorder ? onDragEnd : undefined}
                className={`flex items-center justify-between gap-4 py-4 ${canReorder ? 'cursor-move' : ''} ${overIndex === i ? 'bg-slate-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  {canReorder && <span className="text-slate-300">⠿</span>}
                  {group.image && (
                    <img src={group.image} alt={group.image_alt || ''} loading="lazy" className="h-10 w-10 rounded-sm object-cover" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-graphite">{group.name}</p>
                    <p className="font-mono text-xs text-slate">order {group.order}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-3 text-sm">
                  <button onClick={() => startEdit(group)} className="text-graphite hover:text-ink">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(group.id)} className="text-red-700 hover:text-red-800">
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
