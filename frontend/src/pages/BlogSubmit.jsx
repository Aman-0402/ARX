import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Reveal from '../components/motion/Reveal.jsx'
import GradientBlobs from '../components/motion/GradientBlobs.jsx'
import RichTextEditor from '../components/RichTextEditor.jsx'
import SEO from '../components/SEO.jsx'
import { submitBlogPost } from '../lib/api.js'

const initialForm = { name: '', email: '', title: '', excerpt: '', content: '', cover_image: null }

function wordCount(html) {
  const text = html.replace(/<[^>]*>/g, ' ').trim()
  return text ? text.split(/\s+/).length : 0
}

export default function BlogSubmit() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function updateFile(e) {
    setForm((f) => ({ ...f, cover_image: e.target.files[0] || null }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    const formData = new FormData()
    formData.set('submitter_name', form.name)
    formData.set('submitter_email', form.email)
    formData.set('title', form.title)
    formData.set('excerpt', form.excerpt)
    formData.set('content', form.content)
    if (form.cover_image) formData.set('cover_image', form.cover_image)
    try {
      await submitBlogPost(formData)
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  if (status === 'sent') {
    return (
      <section className="relative overflow-hidden border-b border-slate-200">
        <GradientBlobs variant="mixed" />
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-32 text-center">
          <Reveal>
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-mint/15 text-3xl text-mint">✓</span>
            <h1 className="mt-6 font-display text-3xl font-semibold text-graphite">Thanks for writing in!</h1>
            <p className="mt-4 text-lg text-slate">
              Your post is in for review. If we publish it, it'll show up on the blog —
              we may reach out first if we have edits or questions.
            </p>
            <Link
              to="/blog"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-medium text-paper transition-all hover:-translate-y-0.5 hover:bg-graphite hover:shadow-lg"
            >
              ← Back to Blog
            </Link>
          </Reveal>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden border-b border-slate-200">
      <SEO
        path="/blog/submit"
        title="Write for the ARX Blog"
        description="Have an idea about systems, software, or automation? Submit a post — our team reviews every submission before it goes live."
      />
      <GradientBlobs variant="mixed" />
      <div className="mx-auto max-w-[1400px] px-4 py-20">
        <Reveal>
          <Link to="/blog" className="font-mono text-xs text-slate transition-colors hover:text-ink">
            ← Blog
          </Link>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-[1.1] text-graphite sm:text-4xl md:text-5xl">
            Write for the{' '}
            <span className="bg-gradient-to-r from-amber via-grape to-coral bg-clip-text text-transparent">
              ARX blog
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate">
            Have an idea about systems, software, or automation? Write it up and
            submit it — our team reviews every submission before it goes live.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={handleSubmit} className="mt-10 space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-md">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-graphite">Your name</span>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={update('name')}
                  className="w-full rounded-xl border border-slate-200 bg-paper px-3 py-2.5 text-sm text-graphite outline-none transition-colors focus:border-amber"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-graphite">Your email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  className="w-full rounded-xl border border-slate-200 bg-paper px-3 py-2.5 text-sm text-graphite outline-none transition-colors focus:border-amber"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-graphite">Post title</span>
              <input
                required
                type="text"
                value={form.title}
                onChange={update('title')}
                className="w-full rounded-xl border border-slate-200 bg-paper px-3 py-2.5 text-sm text-graphite outline-none transition-colors focus:border-amber"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-graphite">Short excerpt</span>
              <input
                required
                type="text"
                maxLength={300}
                value={form.excerpt}
                onChange={update('excerpt')}
                placeholder="One or two sentences that summarize the post"
                className="w-full rounded-xl border border-slate-200 bg-paper px-3 py-2.5 text-sm text-graphite outline-none transition-colors focus:border-amber"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-graphite">Cover image (optional)</span>
              <input
                type="file"
                accept="image/*"
                onChange={updateFile}
                className="w-full text-sm text-graphite"
              />
            </label>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium text-graphite">Your post</span>
                <span className="font-mono text-xs text-slate">{wordCount(form.content)} words</span>
              </div>
              <RichTextEditor
                value={form.content}
                onChange={(html) => setForm((f) => ({ ...f, content: html }))}
                placeholder="Write your post here — use the toolbar for headings, bold, links, and lists…"
              />
            </div>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-xl bg-ink px-5 py-3.5 text-base font-semibold text-paper transition-shadow hover:shadow-lg disabled:opacity-60"
            >
              {status === 'sending' ? 'Submitting…' : 'Submit for review'}
            </motion.button>

            {status === 'error' && (
              <p className="rounded-xl bg-coral/15 px-4 py-3 text-sm text-red-700">{error}</p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  )
}
