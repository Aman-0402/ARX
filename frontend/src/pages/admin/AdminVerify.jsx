import { useEffect, useState } from 'react'
import Field from '../../components/admin/Field.jsx'
import {
  fetchAdminVerifyRecords,
  createVerifyRecord,
  updateVerifyRecord,
  deleteVerifyRecord,
} from '../../lib/api.js'
import { confirmDelete } from '../../lib/alerts.js'

const RECORD_TYPES = [
  ['certificate', 'Training certificate'],
  ['internship', 'Internship completion'],
  ['project', 'Project delivery'],
]

const emptyForm = {
  code: '',
  holder_name: '',
  record_type: 'certificate',
  issued_on: new Date().toISOString().slice(0, 10),
  notes: '',
}

export default function AdminVerify() {
  const [records, setRecords] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingCode, setEditingCode] = useState(null)
  const [saving, setSaving] = useState(false)

  function load() {
    setStatus('loading')
    fetchAdminVerifyRecords()
      .then((data) => {
        setRecords(data)
        setStatus('ready')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }

  useEffect(load, [])

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function startEdit(record) {
    setEditingCode(record.code)
    setForm({
      code: record.code,
      holder_name: record.holder_name,
      record_type: record.record_type,
      issued_on: record.issued_on,
      notes: record.notes || '',
    })
  }

  function cancelEdit() {
    setEditingCode(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingCode) {
        await updateVerifyRecord(editingCode, form)
      } else {
        await createVerifyRecord(form)
      }
      cancelEdit()
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(code) {
    if (!(await confirmDelete())) return
    try {
      await deleteVerifyRecord(code)
      if (editingCode === code) cancelEdit()
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-graphite">Verification records</h1>

      {error && (
        <p className="mt-4 border border-slate-200 p-4 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="font-display text-lg font-semibold text-graphite">
            {editingCode ? `Edit "${editingCode}"` : 'New record'}
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <Field label="Code" required>
              <input
                required
                type="text"
                value={form.code}
                onChange={update('code')}
                disabled={!!editingCode}
                className="w-full border border-slate-200 bg-paper px-3 py-2.5 font-mono text-sm outline-none focus:border-ink disabled:opacity-60"
              />
            </Field>
            <Field label="Holder name" required>
              <input
                required
                type="text"
                value={form.holder_name}
                onChange={update('holder_name')}
                className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
            </Field>
            <Field label="Record type" required>
              <select
                value={form.record_type}
                onChange={update('record_type')}
                className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
              >
                {RECORD_TYPES.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </Field>
            <Field label="Issued on" required>
              <input
                required
                type="date"
                value={form.issued_on}
                onChange={update('issued_on')}
                className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
            </Field>
            <Field label="Notes (optional)">
              <input
                type="text"
                value={form.notes}
                onChange={update('notes')}
                className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
            </Field>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-graphite disabled:opacity-60"
              >
                {saving ? 'Saving…' : editingCode ? 'Save changes' : 'Create record'}
              </button>
              {editingCode && (
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
          <h2 className="font-display text-lg font-semibold text-graphite">All records</h2>
          {status === 'loading' && <p className="mt-4 text-sm text-slate">Loading…</p>}
          {status === 'ready' && records.length === 0 && (
            <p className="mt-4 text-sm text-slate">No records yet.</p>
          )}
          <ul className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
            {records.map((record) => (
              <li key={record.code} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-sm font-medium text-graphite">{record.holder_name}</p>
                  <p className="font-mono text-xs text-slate">{record.code} · {record.record_type}</p>
                </div>
                <div className="flex shrink-0 gap-3 text-sm">
                  <button onClick={() => startEdit(record)} className="text-graphite hover:text-ink">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(record.code)} className="text-red-700 hover:text-red-800">
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
