import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchBlogPosts } from '../lib/api.js'
import Reveal from '../components/motion/Reveal.jsx'
import GradientBlobs from '../components/motion/GradientBlobs.jsx'
import { StaggerGrid, StaggerItem } from '../components/motion/StaggerGrid.jsx'

const chipAccents = ['bg-amber/15 text-amber-dim', 'bg-coral/15 text-coral', 'bg-mint/15 text-mint', 'bg-grape/15 text-grape']

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
    <section className="relative overflow-hidden border-b border-slate-200">
      <GradientBlobs variant="blue" />
      <div className="mx-auto max-w-4xl px-4 py-20">
        <Reveal>
          <span className="font-mono text-xs text-slate">Blog</span>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-graphite">
            Notes on systems, software, and automation
          </h1>
          <p className="mt-5 max-w-md text-slate">
            Writing from the ARX Infotech team on what we're building and learning.
          </p>
        </Reveal>

        {status === 'loading' && (
          <p className="mt-10 text-sm text-slate">Loading posts…</p>
        )}
        {status === 'error' && (
          <p className="mt-10 rounded-2xl border border-slate-200 p-6 text-sm text-red-700">{error}</p>
        )}
        {status === 'ready' && posts.length === 0 && (
          <p className="mt-10 rounded-2xl border border-slate-200 p-6 text-sm text-graphite">
            No posts yet — check back soon.
          </p>
        )}

        {status === 'ready' && posts.length > 0 && (
          <StaggerGrid className="mt-10 flex flex-col gap-4">
            {posts.map((post, i) => (
              <StaggerItem key={post.slug}>
                <Link to={`/blog/${post.slug}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="rounded-2xl border border-slate-200 bg-paper p-6 shadow-sm transition-colors hover:border-slate-700/30"
                  >
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 font-mono text-xs ${
                        chipAccents[i % chipAccents.length]
                      }`}
                    >
                      {new Date(post.published_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <h2 className="mt-3 font-display text-xl font-semibold text-graphite">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-slate">{post.excerpt}</p>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </div>
    </section>
  )
}
