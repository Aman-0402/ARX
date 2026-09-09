import { useEffect, useState } from 'react'
import Field from '../../components/admin/Field.jsx'
import Pagination from '../../components/admin/Pagination.jsx'
import SearchBox from '../../components/admin/SearchBox.jsx'
import RichTextEditor from '../../components/RichTextEditor.jsx'
import {
  fetchAdminPosts,
  createAdminPost,
  updateAdminPost,
  deleteAdminPost,
} from '../../lib/api.js'
import { confirmDelete } from '../../lib/alerts.js'

const PAGE_SIZE = 5

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  photo: null,
  photo_alt: '',
  published: true,
  published_at: new Date().toISOString().slice(0, 16),
}

export default function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingSlug, setEditingSlug] = useState(null)
  const [editingSubmitter, setEditingSubmitter] = useState(null)
  const [saving, setSaving] = useState(false)

  function load() {
    setStatus('loading')
    fetchAdminPosts({ page, search })
      .then((data) => {
        setPosts(data.results)
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
      const value = field === 'published' ? e.target.checked : e.target.value
      setForm((f) => ({ ...f, [field]: value }))
    }
  }

  function updateFile(e) {
    setForm((f) => ({ ...f, photo: e.target.files[0] || null }))
  }

  function startEdit(post) {
    setEditingSlug(post.slug)
    setEditingSubmitter(post.submitter_name ? { name: post.submitter_name, email: post.submitter_email } : null)
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      photo: null,
      photo_alt: post.cover_image_alt || '',
      published: post.published,
      published_at: post.published_at.slice(0, 16),
    })
  }

  function cancelEdit() {
    setEditingSlug(null)
    setEditingSubmitter(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const formData = new FormData()
    formData.set('title', form.title)
    if (form.slug) formData.set('slug', form.slug)
    formData.set('excerpt', form.excerpt)
    formData.set('content', form.content)
    formData.set('published', String(form.published))
    formData.set('published_at', new Date(form.published_at).toISOString())
    if (form.photo) formData.set('cover_image', form.photo)
    formData.set('cover_image_alt', form.photo_alt)
    try {
      if (editingSlug) {
        await updateAdminPost(editingSlug, formData)
      } else {
        await createAdminPost(formData)
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
    if (!(await confirmDelete())) return
    try {
      await deleteAdminPost(slug)
      if (editingSlug === slug) cancelEdit()
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const pending = posts.filter((p) => !p.published && p.submitter_name)

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-graphite">Blog posts</h1>

      {error && (
        <p className="mt-4 border border-slate-200 p-4 text-sm text-red-700">{error}</p>
      )}

      {pending.length > 0 && (
        <div className="mt-6 rounded-xl border border-amber/40 bg-amber/10 p-4">
          <p className="text-sm font-medium text-amber-dim">
            {pending.length} submission{pending.length > 1 ? 's' : ''} pending review
          </p>
          <ul className="mt-2 space-y-1 text-sm text-graphite">
            {pending.map((p) => (
              <li key={p.slug}>
                <button onClick={() => startEdit(p)} className="underline decoration-dotted hover:text-ink">
                  {p.title}
                </button>
                {' — '}submitted by {p.submitter_name} ({p.submitter_email})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="font-display text-lg font-semibold text-graphite">
            {editingSlug ? `Edit "${editingSlug}"` : 'New post'}
          </h2>
          {editingSubmitter && (
            <p className="mt-1 text-xs text-slate">
              Submitted by {editingSubmitter.name} ({editingSubmitter.email})
            </p>
          )}
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
              <RichTextEditor
                value={form.content}
                onChange={(html) => setForm((f) => ({ ...f, content: html }))}
                placeholder="Write the post…"
              />
            </Field>
            <Field label="Cover image (optional)">
              <input
                type="file"
                accept="image/*"
                onChange={updateFile}
                className="w-full text-sm text-graphite"
              />
            </Field>
            <Field label="Cover image alt text (optional)">
              <input
                type="text"
                value={form.photo_alt}
                onChange={update('photo_alt')}
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-graphite">All posts</h2>
            <SearchBox onSearch={handleSearch} placeholder="Search posts…" />
          </div>
          {status === 'loading' && <p className="mt-4 text-sm text-slate">Loading…</p>}
          {status === 'ready' && posts.length === 0 && (
            <p className="mt-4 text-sm text-slate">No posts found.</p>
          )}
          <ul className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
            {posts.map((post) => (
              <li key={post.slug} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-sm font-medium text-graphite">
                    {post.title}
                    {!post.published && (
                      <span className="ml-2 font-mono text-xs text-slate">
                        {post.submitter_name ? 'pending review' : 'draft'}
                      </span>
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
          <Pagination page={page} count={count} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </div>
      </div>
    </div>
  )
}
