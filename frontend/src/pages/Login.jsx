import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/use-auth.jsx'
import SEO from '../components/SEO.jsx'
import PasswordInput from '../components/PasswordInput.jsx'
import LoginBackground from '../components/LoginBackground.jsx'
import GlowCursor from '../components/GlowCursor.jsx'

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

export default function Login() {
  const { status, login, timedOut, clearTimedOut } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (status === 'authed') {
    return <Navigate to="/admin" replace />
  }

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await login(form.username, form.password)
      clearTimedOut()
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <GlowCursor
      color="#2EC4B6"
      secondaryColor="#8B5CF6"
      trailLength={40}
      trailWidth={8}
      trailTaper={0.8}
      followSpeed={0.16}
      glowIntensity={1.9}
      glowSpread={1.2}
      hotspot={0.65}
      brightness={1.25}
      opacity={1}
      pulseSpeed={1.1}
      noiseStrength={0.035}
      idleFade
      idleTimeout={700}
      fadeDuration={900}
      blendMode="screen"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-4"
    >
      <SEO path="/login" title="Sign in" noindex />
      <LoginBackground />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="relative z-10 w-full max-w-sm"
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-1.5 font-mono text-xs text-slate-300 transition-colors hover:text-paper"
          >
            ← Back to site
          </Link>
        </motion.div>

        <div className="shadow-xl shadow-ink/10">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-paper/85 p-8"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.15 }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber/10 text-amber"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <rect x="4" y="10" width="16" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
            </motion.div>
            <h1 className="mt-3 font-display text-2xl font-semibold text-graphite">Sign in</h1>
            <p className="mt-1 font-mono text-xs text-slate">Admin console access</p>

            {timedOut && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 border border-amber/30 bg-amber/10 px-3 py-2.5 text-sm text-amber-dim"
              >
                You were signed out due to inactivity. Please sign in again.
              </motion.p>
            )}

            <motion.div
              initial="hidden"
              animate="show"
              transition={{ staggerChildren: 0.08, delayChildren: 0.35 }}
              className="mt-6 space-y-4"
            >
              <motion.label variants={fieldVariants} transition={{ duration: 0.35 }} className="block">
                <span className="mb-1.5 block text-sm font-medium text-graphite">Username</span>
                <input
                  required
                  type="text"
                  value={form.username}
                  onChange={update('username')}
                  className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm text-graphite outline-none transition-colors focus:border-amber"
                />
              </motion.label>
              <motion.label variants={fieldVariants} transition={{ duration: 0.35 }} className="block">
                <span className="mb-1.5 block text-sm font-medium text-graphite">Password</span>
                <PasswordInput
                  required
                  value={form.password}
                  onChange={update('password')}
                />
              </motion.label>
            </motion.div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="group relative isolate mt-6 w-full overflow-hidden rounded-lg bg-ink px-5 py-3 text-sm font-medium text-paper shadow-lg shadow-ink/20 disabled:opacity-60"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-amber to-coral transition-transform duration-300 ease-out group-hover:scale-x-100" />
              <span className="relative">{submitting ? 'Signing in…' : 'Sign in'}</span>
            </motion.button>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 border-t border-slate-200 pt-4 text-sm text-red-700"
              >
                {error}
              </motion.p>
            )}
          </form>
        </div>
      </motion.div>
    </GlowCursor>
  )
}
