import { createContext, useContext, useEffect, useState } from 'react'
import { fetchCsrfCookie, fetchMe, login as apiLogin, logout as apiLogout } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading') // loading | anon | authed

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
  }

  async function logout() {
    await apiLogout()
    setUser(null)
    setStatus('anon')
  }

  return (
    <AuthContext.Provider value={{ user, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
