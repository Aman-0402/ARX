import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth.jsx'
import SEO from '../components/SEO.jsx'
import PasswordInput from '../components/PasswordInput.jsx'
import LoginBackground from '../components/LoginBackground.jsx'

export default function Login() {
  const { status, login } = useAuth()
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
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-4">
      <SEO path="/login" title="Sign in" noindex />
      <LoginBackground />
      <div className="relative z-10 w-full max-w-sm">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1.5 font-mono text-xs text-slate transition-colors hover:text-ink"
        >
          ← Back to site
        </Link>
        <form onSubmit={handleSubmit} className="border border-slate-200 bg-paper/90 p-8 shadow-xl shadow-ink/5 backdrop-blur-sm">
          <span className="font-mono text-xs text-slate">Admin</span>
        <h1 className="mt-2 font-display text-2xl font-semibold text-graphite">Sign in</h1>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-graphite">Username</span>
            <input
              required
              type="text"
              value={form.username}
              onChange={update('username')}
              className="w-full border border-slate-200 bg-paper px-3 py-2.5 text-sm text-graphite outline-none focus:border-ink"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-graphite">Password</span>
            <PasswordInput
              required
              value={form.password}
              onChange={update('password')}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-graphite disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>

          {error && (
            <p className="mt-4 border-t border-slate-200 pt-4 text-sm text-red-700">{error}</p>
          )}
        </form>
      </div>
    </div>
  )
}
