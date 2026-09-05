import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchBlogPost } from '../lib/api.js'

export default function BlogPost() {
  const { slug } = useParams()
  const [status, setStatus] = useState('loading') // loading | ready | notfound | error
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setStatus('loading')
    fetchBlogPost(slug)
      .then((data) => {
        if (!data) {
          setStatus('notfound')
          return
        }
        setPost(data)
        setStatus('ready')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }, [slug])

  return (
    <section className="border-b border-slate-200">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <Link to="/blog" className="font-mono text-xs text-slate hover:text-ink">
          ← Blog
        </Link>

        {status === 'loading' && (
          <p className="mt-10 text-sm text-slate">Loading…</p>
        )}
        {status === 'notfound' && (
          <p className="mt-10 border border-slate-200 p-6 text-sm text-graphite">
            Post not found.
          </p>
        )}
        {status === 'error' && (
          <p className="mt-10 border border-slate-200 p-6 text-sm text-red-700">{error}</p>
        )}

        {status === 'ready' && post && (
          <article className="mt-6">
            <span className="font-mono text-xs text-slate">
              {new Date(post.published_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-graphite">
              {post.title}
            </h1>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-slate">
              {post.content}
            </p>
          </article>
        )}
      </div>
    </section>
  )
}
