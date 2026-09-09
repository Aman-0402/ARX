import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { fetchCsrfCookie, fetchMe, login as apiLogin, logout as apiLogout } from '../lib/api.js'

const AuthContext = createContext(null)

const IDLE_TIMEOUT_MS = 20 * 60 * 1000 // 20 minutes
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart']

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading') // loading | anon | authed
  const [timedOut, setTimedOut] = useState(false)
  const idleTimer = useRef(null)

  useEffect(() => {
    ;(async () => {
      await fetchCsrfCookie()
      const me = await fetchMe()
      if (me) {
        setUser(me)
        setStatus('authed')
      } else {
        setStatus('anon')
      }
    })()
  }, [])

  async function login(username, password) {
    const me = await apiLogin(username, password)
    setUser(me)
    setStatus('authed')
    setTimedOut(false)
  }

  async function logout() {
    await apiLogout()
    setUser(null)
    setStatus('anon')
  }

  // Auto sign-out after IDLE_TIMEOUT_MS of no mouse/keyboard/touch activity,
  // so an unattended admin session doesn't stay open indefinitely.
  useEffect(() => {
    if (status !== 'authed') return

    function resetTimer() {
      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => {
        apiLogout().catch(() => {})
        setUser(null)
        setStatus('anon')
        setTimedOut(true)
      }, IDLE_TIMEOUT_MS)
    }

    resetTimer()
    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, resetTimer))

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current)
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, resetTimer))
    }
  }, [status])

  return (
    <AuthContext.Provider value={{ user, status, login, logout, timedOut, clearTimedOut: () => setTimedOut(false) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
