import { useEffect, useState } from 'react'
import Field from './Field.jsx'
import Pagination from './Pagination.jsx'
import SearchBox from './SearchBox.jsx'
import { confirmDelete, showError } from '../../lib/alerts.js'
import { useDragReorder } from '../../hooks/use-drag-reorder.js'

const PAGE_SIZE = 5

/**
 * Generic list+form admin CRUD page for simple resources (Industry, CaseStudy,
 * TechStackItem, ProcessStep, FAQ) that all share the same shape: a handful of
 * text/number/checkbox/file fields, an "order" for display ordering, and a
 * "published" toggle. Config-driven so each resource page is just a fields list.
 *
 * fields: [{ key, label, type: 'text'|'textarea'|'number'|'checkbox'|'file', required }]
 * reorderable: true if the list supports drag-drop reordering (needs an `order` field)
 */
export default function SimpleCrudPage({ title, description, api, fields, itemLabel, imageField, reorderable = true }) {
  const emptyForm = Object.fromEntries(
    fields.map((f) => [f.key, f.type === 'checkbox' ? true : f.type === 'number' ? 0 : f.type === 'file' ? null : ''])
  )
  const hasFile = fields.some((f) => f.type === 'file')

  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  function load() {
    setStatus('loading')
    api.fetchAdmin({ page, search })
      .then((data) => {
        setItems(data.results)
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

  function buildBody(source) {
    if (hasFile) {
      const body = new FormData()
      for (const f of fields) {
        if (f.type === 'file') {
          if (source[f.key]) body.set(f.key, source[f.key])
        } else if (f.type === 'number') {
          body.set(f.key, String(Number(source[f.key]) || 0))
        } else {
          body.set(f.key, String(source[f.key]))
        }
      }
      return body
    }
    const body = {}
    for (const f of fields) {
      body[f.key] = f.type === 'number' ? Number(source[f.key]) || 0 : source[f.key]
    }
    return body
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) {
        await api.update(editingId, buildBody(form))
      } else {
        await api.create(buildBody(form))
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

  async function handleReordered(newItems) {
    setItems(newItems)
    try {
      await Promise.all(
        newItems.map((item, i) => {
          const newOrder = i
          if (item.order === newOrder) return Promise.resolve()
          return api.update(item.id, fields.some((f) => f.type === 'file') ? (() => {
            const fd = new FormData()
            fd.set('order', String(newOrder))
            return fd
          })() : { order: newOrder })
        })
      )
      load()
    } catch (err) {
      showError('Could not save new order.')
      load()
    }
  }

  const { overIndex, onDragStart, onDragOver, onDrop, onDragEnd } = useDragReorder(items, handleReordered)
  const canReorder = reorderable && !search && fields.some((f) => f.key === 'order')

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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-graphite">All entries</h2>
            <SearchBox onSearch={handleSearch} placeholder="Search…" />
          </div>
          {canReorder && items.length > 1 && (
            <p className="mt-2 text-xs text-slate">Drag rows to reorder.</p>
          )}
          {status === 'loading' && <p className="mt-4 text-sm text-slate">Loading…</p>}
          {status === 'ready' && items.length === 0 && (
            <p className="mt-4 text-sm text-slate">Nothing found.</p>
          )}
          <ul className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
            {items.map((item, i) => (
              <li
                key={item.id}
                draggable={canReorder}
                onDragStart={canReorder ? onDragStart(i) : undefined}
                onDragOver={canReorder ? onDragOver(i) : undefined}
                onDrop={canReorder ? onDrop(i) : undefined}
                onDragEnd={canReorder ? onDragEnd : undefined}
                className={`flex items-center justify-between gap-4 py-4 ${canReorder ? 'cursor-move' : ''} ${overIndex === i ? 'bg-slate-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  {canReorder && <span className="text-slate-300">⠿</span>}
                  {imageField && (
                    item[imageField] ? (
                      <img src={item[imageField]} alt={item[`${imageField}_alt`] || ''} loading="lazy" className="h-10 w-10 rounded-sm object-contain" />
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
          <Pagination page={page} count={count} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </div>
      </div>
    </div>
  )
}
