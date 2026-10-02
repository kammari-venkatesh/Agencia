import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { fetchCurrentAdmin, loginAdmin, logoutAdmin, type AdminUser } from '../api/admin'
import { ApiRequestError, setUnauthorizedHandler } from '../api/client'
import { AdminAuthContext, type AdminAuthStatus, type AdminAuthValue } from './adminAuthContext'

type AuthState = {
  status: AdminAuthStatus
  admin: AdminUser | null
  sessionExpired: boolean
  error: string | null
}

const SIGNED_OUT: AuthState = { status: 'unauthenticated', admin: null, sessionExpired: false, error: null }

// Backend messages meaning a session cookie existed but is no longer valid (vs. no cookie at all).
const SESSION_ENDED_MESSAGES = ['Session expired', 'Invalid session']

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ ...SIGNED_OUT, status: 'loading' })

  const refresh = useCallback(async () => {
    try {
      const { data } = await fetchCurrentAdmin()
      setState({ status: 'authenticated', admin: data.admin, sessionExpired: false, error: null })
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 401) {
        setState((prev) => ({
          ...SIGNED_OUT,
          sessionExpired: prev.status === 'authenticated' || SESSION_ENDED_MESSAGES.includes(err.message),
        }))
        return
      }
      const message = err instanceof Error ? err.message : 'Unable to verify your session.'
      setState((prev) => ({ ...prev, status: 'error', error: message }))
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  // Any authenticated request that returns 401 means the session has ended.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setState({ ...SIGNED_OUT, sessionExpired: true })
    })
    return () => setUnauthorizedHandler(null)
  }, [])

  // Re-check when the admin returns to the tab, so an expired session is noticed promptly.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible' && state.status === 'authenticated') void refresh()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [refresh, state.status])

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await loginAdmin(email, password)
    setState({ status: 'authenticated', admin: data.admin, sessionExpired: false, error: null })
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutAdmin()
    } finally {
      setState(SIGNED_OUT)
    }
  }, [])

  const value = useMemo<AdminAuthValue>(
    () => ({ ...state, login, logout, refresh }),
    [state, login, logout, refresh],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}
