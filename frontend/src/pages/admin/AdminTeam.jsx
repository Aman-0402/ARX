import { useEffect, useState } from 'react'
import Field from '../../components/admin/Field.jsx'
import {
  fetchAdminTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../../lib/api.js'
import { confirmDelete } from '../../lib/alerts.js'

const emptyForm = { name: '', role: '', bio: '', order: 0, photo: null }

export default function AdminTeam() {
  const [members, setMembers] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  function load() {
    setStatus('loading')
    fetchAdminTeam()
      .then((data) => {
        setMembers(data)
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

  function updateFile(e) {
    setForm((f) => ({ ...f, photo: e.target.files[0] || null }))
  }

  function startEdit(member) {
    setEditingId(member.id)
    setForm({ name: member.name, role: member.role, bio: member.bio || '', order: member.order, photo: null })
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
    formData.set('role', form.role)
    formData.set('bio', form.bio)
    formData.set('order', String(Number(form.order) || 0))
    if (form.photo) formData.set('photo', form.photo)
    try {
      if (editingId) {
        await updateTeamMember(editingId, formData)
      } else {
        await createTeamMember(formData)
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
      await deleteTeamMember(id)
      if (editingId === id) cancelEdit()
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-graphite">Team</h1>
      <p className="mt-1 text-sm text-slate">Leadership shown on the public About page, in order.</p>

      {error && (
        <p className="mt-4 border border-slate-200 p-4 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="font-display text-lg font-semibold text-graphite">
            {editingId ? 'Edit member' : 'New member'}
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
            <Field label="Role" required>
              <input
                required
                type="text"
                placeholder="CEO, CTO, ..."
                value={form.role}
                onChange={update('role')}
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
            <Field label="Bio (optional)">
              <input
                type="text"
                value={form.bio}
                onChange={update('bio')}
                className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
            </Field>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-graphite disabled:opacity-60"
              >
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create member'}
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
          <h2 className="font-display text-lg font-semibold text-graphite">All members</h2>
          {status === 'loading' && <p className="mt-4 text-sm text-slate">Loading…</p>}
          {status === 'ready' && members.length === 0 && (
            <p className="mt-4 text-sm text-slate">No team members yet.</p>
          )}
          <ul className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
            {members.map((member) => (
              <li key={member.id} className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-3">
                  {member.photo ? (
                    <img src={member.photo} alt="" loading="lazy" className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-slate-200" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-graphite">{member.name}</p>
                    <p className="font-mono text-xs text-slate">{member.role} · order {member.order}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-3 text-sm">
                  <button onClick={() => startEdit(member)} className="text-graphite hover:text-ink">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(member.id)} className="text-red-700 hover:text-red-800">
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
