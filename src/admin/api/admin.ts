import { apiRequest } from './client'

export type AdminUser = {
  id: string
  email: string
  role: 'admin'
  disabled?: boolean
  createdBy?: { id: string; email: string | null } | null
  lastLoginAt?: string | null
  passwordChangedAt?: string | null
  createdAt: string
  updatedAt: string
}

export type DashboardData = {
  admin: AdminUser
  stats: { inboundLeads: number; salesLeads: number; leadFinder: { activeJobs: number; prospects: number } }
  modules: { key: string; name: string; status: 'coming_soon' | 'active' }[]
  serverTime: string
}

export type InboundLead = {
  id: string
  name: string
  email: string
  phone: string
  services: string[]
  message: string
  createdAt: string
}

type Envelope<T> = { success: true; data: T }

export const loginAdmin = (email: string, password: string) =>
  apiRequest<Envelope<{ admin: AdminUser }>>('/api/admin/auth/login', {
    method: 'POST',
    body: { email, password },
    skipUnauthorizedHandler: true,
  })

export const logoutAdmin = () =>
  apiRequest<{ success: true }>('/api/admin/auth/logout', {
    method: 'POST',
    skipUnauthorizedHandler: true,
  })

export const fetchCurrentAdmin = () =>
  apiRequest<Envelope<{ admin: AdminUser }>>('/api/admin/auth/me', { skipUnauthorizedHandler: true })

export const fetchDashboard = (signal?: AbortSignal) =>
  apiRequest<Envelope<DashboardData>>('/api/admin/dashboard', { signal })

const adminPath = (id: string) => `/api/admin/admins/${encodeURIComponent(id)}`

export const listAdmins = (signal?: AbortSignal) => apiRequest<Envelope<AdminUser[]>>('/api/admin/admins', { signal })

export const createAdmin = (email: string, password: string) =>
  apiRequest<Envelope<AdminUser>>('/api/admin/admins', { method: 'POST', body: { email, password } })

export const setAdminDisabled = (id: string, disabled: boolean) =>
  apiRequest<Envelope<AdminUser>>(adminPath(id), { method: 'PATCH', body: { disabled } })

/** `currentPassword` is required when changing your own password. */
export const changeAdminPassword = (id: string, password: string, currentPassword?: string) =>
  apiRequest<Envelope<AdminUser>>(`${adminPath(id)}/password`, {
    method: 'POST',
    body: currentPassword === undefined ? { password } : { password, currentPassword },
  })

export const removeAdmin = (id: string) => apiRequest<Envelope<{ id: string }>>(adminPath(id), { method: 'DELETE' })

export const fetchInboundLeads = (signal?: AbortSignal) =>
  apiRequest<Envelope<InboundLead[]> & { count: number }>('/api/leads', { signal })
