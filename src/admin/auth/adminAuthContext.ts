import { createContext, useContext } from 'react'
import type { AdminUser } from '../api/admin'

export type AdminAuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error'

export type AdminAuthValue = {
  status: AdminAuthStatus
  admin: AdminUser | null
  /** True when an existing session ended (expired or revoked), so login can explain why. */
  sessionExpired: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

export const AdminAuthContext = createContext<AdminAuthValue | null>(null)

export function useAdminAuth(): AdminAuthValue {
  const value = useContext(AdminAuthContext)
  if (!value) throw new Error('useAdminAuth must be used inside <AdminAuthProvider>')
  return value
}
