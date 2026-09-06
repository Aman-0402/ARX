import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Reveal from '../components/motion/Reveal.jsx'
import GradientBlobs from '../components/motion/GradientBlobs.jsx'
import SEO from '../components/SEO.jsx'
import { fetchBlogPost } from '../lib/api.js'

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

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
    <section className="relative overflow-hidden border-b border-slate-200">
      {status === 'ready' && post && (
        <SEO
          path={`/blog/${slug}`}
          title={post.title}
          description={post.excerpt || stripHtml(post.content).slice(0, 160)}
          type="article"
          image={post.cover_image || '/logo.png'}
          jsonLd={{
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            image: post.cover_image || undefined,
            datePublished: post.published_at,
            author: { '@type': 'Organization', name: 'ARX Infotech' },
          }}
        />
      )}
      <GradientBlobs variant="blue" />
      <div className="mx-auto max-w-[1400px] px-4 py-20">
        <Link
          to="/blog"
          className="group inline-flex items-center gap-1.5 font-mono text-xs text-slate transition-colors hover:text-ink"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span> Blog
        </Link>

        {status === 'loading' && (
          <p className="mt-10 text-sm text-slate">Loading…</p>
        )}
        {status === 'notfound' && (
          <p className="mt-10 rounded-2xl border border-slate-200 p-6 text-sm text-graphite">
            Post not found.
          </p>
        )}
        {status === 'error' && (
          <p className="mt-10 rounded-2xl border border-slate-200 p-6 text-sm text-red-700">{error}</p>
        )}

        {status === 'ready' && post && (
          <Reveal as="article" className="mt-6">
            {post.cover_image && (
              <img
                src={post.cover_image}
                alt={post.title}
                className="mb-8 h-64 w-full rounded-2xl object-cover shadow-md"
              />
            )}
            <span className="inline-flex rounded-full bg-amber/15 px-2.5 py-1 font-mono text-xs text-amber-dim">
              {new Date(post.published_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <h1 className="mt-4 font-display text-3xl font-semibold leading-[1.1] text-graphite sm:text-4xl md:text-5xl">
              {post.title}
            </h1>
            <div
              className="rich-content mt-6 max-w-3xl text-lg leading-relaxed text-slate"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </Reveal>
        )}
      </div>
    </section>
  )
}
