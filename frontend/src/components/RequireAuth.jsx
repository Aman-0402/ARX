import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth.jsx'

export default function RequireAuth({ children }) {
  const { status } = useAuth()

  if (status === 'loading') {
    return <p className="p-10 text-sm text-slate">Loading…</p>
  }
  if (status === 'anon') {
    return <Navigate to="/login" replace />
  }
  return children
}
