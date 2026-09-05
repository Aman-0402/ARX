import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchBlogPosts } from '../lib/api.js'

export default function Blog() {
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [posts, setPosts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBlogPosts()
      .then((data) => {
        setPosts(data)
        setStatus('ready')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }, [])

  return (
    <section className="border-b border-slate-200">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <span className="font-mono text-xs text-slate">Blog</span>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-graphite">
          Notes on systems, software, and automation
        </h1>
        <p className="mt-5 max-w-md text-slate">
          Writing from the ARX Infotech team on what we're building and learning.
        </p>

        {status === 'loading' && (
          <p className="mt-10 text-sm text-slate">Loading posts…</p>
        )}
        {status === 'error' && (
          <p className="mt-10 border border-slate-200 p-6 text-sm text-red-700">{error}</p>
        )}
        {status === 'ready' && posts.length === 0 && (
          <p className="mt-10 border border-slate-200 p-6 text-sm text-graphite">
            No posts yet — check back soon.
          </p>
        )}

        {status === 'ready' && posts.length > 0 && (
          <ul className="mt-10 divide-y divide-slate-200 border-t border-slate-200">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col gap-2 py-8 transition-colors hover:text-ink"
                >
                  <span className="font-mono text-xs text-slate">
                    {new Date(post.published_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <h2 className="font-display text-xl font-semibold text-graphite group-hover:text-ink">
                    {post.title}
                  </h2>
                  <p className="text-sm text-slate">{post.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
