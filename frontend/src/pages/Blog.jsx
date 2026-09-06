import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEO from '../components/SEO.jsx'
import { fetchBlogPosts } from '../lib/api.js'
import Reveal from '../components/motion/Reveal.jsx'
import GradientBlobs from '../components/motion/GradientBlobs.jsx'
import { StaggerGrid, StaggerItem } from '../components/motion/StaggerGrid.jsx'

const accents = [
  { border: 'border-t-amber', ring: 'hover:border-amber', glow: 'hover:shadow-amber/20', chip: 'bg-amber/15 text-amber-dim', tint: 'from-amber/20' },
  { border: 'border-t-coral', ring: 'hover:border-coral', glow: 'hover:shadow-coral/20', chip: 'bg-coral/15 text-coral', tint: 'from-coral/20' },
  { border: 'border-t-mint', ring: 'hover:border-mint', glow: 'hover:shadow-mint/20', chip: 'bg-mint/15 text-mint', tint: 'from-mint/20' },
  { border: 'border-t-grape', ring: 'hover:border-grape', glow: 'hover:shadow-grape/20', chip: 'bg-grape/15 text-grape', tint: 'from-grape/20' },
]

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
    <>
      <SEO
        path="/blog"
        title="Blog"
        description="Notes on systems, software, and automation from the ARX Infotech team on what we're building and learning."
      />
      <section className="relative overflow-hidden border-b border-slate-200">
        <GradientBlobs variant="blue" />
        <div className="mx-auto max-w-[1400px] px-4 py-20">
          <Reveal>
            <h1 className="max-w-2xl font-display text-3xl font-semibold leading-[1.1] text-graphite sm:text-4xl md:text-5xl">
              Notes on{' '}
              <span className="bg-gradient-to-r from-amber via-grape to-coral bg-clip-text text-transparent">
                systems, software
              </span>
              , and automation
            </h1>
            <p className="mt-5 max-w-md text-lg text-slate">
              Writing from the ARX Infotech team on what we're building and learning.
            </p>
            <Link
              to="/blog/submit"
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-base font-medium text-paper transition-all hover:-translate-y-0.5 hover:bg-graphite hover:shadow-lg"
            >
              Have an idea? Write for us
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-4 py-20">
          {status === 'loading' && (
            <p className="text-sm text-slate">Loading posts…</p>
          )}
          {status === 'error' && (
            <p className="rounded-2xl border border-slate-200 p-6 text-sm text-red-700">{error}</p>
          )}
          {status === 'ready' && posts.length === 0 && (
            <p className="rounded-2xl border border-slate-200 p-6 text-sm text-graphite">
              No posts yet — check back soon.
            </p>
          )}

          {status === 'ready' && posts.length > 0 && (
            <StaggerGrid className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => {
                const a = accents[i % accents.length]
                return (
                  <StaggerItem key={post.slug}>
                    <Link to={`/blog/${post.slug}`}>
                      <motion.div
                        whileHover={{ y: -8, rotate: -0.5 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className={`h-full overflow-hidden rounded-2xl border-2 border-slate-200 border-t-4 bg-white shadow-md transition-all duration-300 hover:shadow-xl ${a.border} ${a.ring} ${a.glow}`}
                      >
                        {post.cover_image ? (
                          <div className="overflow-hidden">
                            <img
                              src={post.cover_image}
                              alt=""
                              loading="lazy"
                              className="h-40 w-full object-cover transition-transform duration-500 hover:scale-110"
                            />
                          </div>
                        ) : (
                          <div className={`flex h-28 items-center justify-center bg-gradient-to-br to-white ${a.tint}`}>
                            <span className={`font-display text-4xl font-bold ${a.chip.split(' ')[1]}`}>
                              {post.title.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="p-6">
                          <span className={`inline-flex rounded-full px-2.5 py-1 font-mono text-xs ${a.chip}`}>
                            {new Date(post.published_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <h2 className="mt-3 font-display text-xl font-semibold text-graphite">
                            {post.title}
                          </h2>
                          <p className="mt-2 text-sm leading-relaxed text-slate">{post.excerpt}</p>
                        </div>
                      </motion.div>
                    </Link>
                  </StaggerItem>
                )
              })}
            </StaggerGrid>
          )}
        </div>
      </section>
    </>
  )
}
