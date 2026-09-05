import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/use-auth.jsx'
import {
  fetchAdminPosts,
  createAdminPost,
  updateAdminPost,
  deleteAdminPost,
} from '../../lib/api.js'

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image: '',
  published: true,
  published_at: new Date().toISOString().slice(0, 16),
}

export default function AdminBlog() {
  const { user, logout } = useAuth()
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingSlug, setEditingSlug] = useState(null)
  const [saving, setSaving] = useState(false)

  function load() {
    setStatus('loading')
    fetchAdminPosts()
      .then((data) => {
        setPosts(data)
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

  function startEdit(post) {
    setEditingSlug(post.slug)
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.cover_image || '',
      published: post.published,
      published_at: post.published_at.slice(0, 16),
    })
  }

  function cancelEdit() {
    setEditingSlug(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      published_at: new Date(form.published_at).toISOString(),
    }
    if (!payload.slug) delete payload.slug
    try {
      if (editingSlug) {
        await updateAdminPost(editingSlug, payload)
      } else {
        await createAdminPost(payload)
      }
      cancelEdit()
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(slug) {
    if (!window.confirm('Delete this post?')) return
    try {
      await deleteAdminPost(slug)
      if (editingSlug === slug) cancelEdit()
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-paper px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div>
            <span className="font-mono text-xs text-slate">Admin</span>
            <h1 className="mt-1 font-display text-2xl font-semibold text-graphite">
              Blog posts
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate">
            <span>{user?.username}</span>
            <button onClick={logout} className="text-graphite hover:text-ink">
              Sign out
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-6 border border-slate-200 p-4 text-sm text-red-700">{error}</p>
        )}

        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-display text-lg font-semibold text-graphite">
              {editingSlug ? `Edit "${editingSlug}"` : 'New post'}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <Field label="Title" required>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={update('title')}
                  className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </Field>
              <Field label="Slug (auto-generated if left blank on create)">
                <input
                  type="text"
                  value={form.slug}
                  onChange={update('slug')}
                  disabled={!!editingSlug}
                  className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink disabled:opacity-60"
                />
              </Field>
              <Field label="Excerpt" required>
                <input
                  required
                  type="text"
                  value={form.excerpt}
                  onChange={update('excerpt')}
                  className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </Field>
              <Field label="Content" required>
                <textarea
                  required
                  rows={6}
                  value={form.content}
                  onChange={update('content')}
                  className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </Field>
              <Field label="Cover image URL (optional)">
                <input
                  type="url"
                  value={form.cover_image}
                  onChange={update('cover_image')}
                  className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </Field>
              <Field label="Published at">
                <input
                  required
                  type="datetime-local"
                  value={form.published_at}
                  onChange={update('published_at')}
                  className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </Field>
              <label className="flex items-center gap-2 text-sm text-graphite">
                <input type="checkbox" checked={form.published} onChange={update('published')} />
                Published (visible on the public blog)
              </label>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-graphite disabled:opacity-60"
                >
                  {saving ? 'Saving…' : editingSlug ? 'Save changes' : 'Create post'}
                </button>
                {editingSlug && (
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
            <h2 className="font-display text-lg font-semibold text-graphite">All posts</h2>
            {status === 'loading' && <p className="mt-4 text-sm text-slate">Loading…</p>}
            {status === 'ready' && posts.length === 0 && (
              <p className="mt-4 text-sm text-slate">No posts yet.</p>
            )}
            <ul className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
              {posts.map((post) => (
                <li key={post.slug} className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-graphite">
                      {post.title}
                      {!post.published && (
                        <span className="ml-2 font-mono text-xs text-slate">draft</span>
                      )}
                    </p>
                    <p className="font-mono text-xs text-slate">{post.slug}</p>
                  </div>
                  <div className="flex shrink-0 gap-3 text-sm">
                    <button onClick={() => startEdit(post)} className="text-graphite hover:text-ink">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(post.slug)} className="text-red-700 hover:text-red-800">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-graphite">
        {label}
        {required && <span className="text-amber-dim"> *</span>}
      </span>
      {children}
    </label>
  )
}
