export const ADMIN_PATHS = {
  dashboard: '/admin/',
  login: '/admin/login/',
  leadFinder: '/admin/lead-finder/',
  leadFinderJobs: '/admin/lead-finder/jobs/',
  leadWorkspace: '/admin/lead-workspace/',
  access: '/admin/access/',
} as const

export const leadWorkspaceUrl = (leadId?: string) =>
  leadId ? `${ADMIN_PATHS.leadWorkspace}?lead=${encodeURIComponent(leadId)}` : ADMIN_PATHS.leadWorkspace

export const leadFinderJobUrl = (jobId: string) => `${ADMIN_PATHS.leadFinderJobs}?job=${encodeURIComponent(jobId)}`

export const isAdminPath = (pathname: string) => pathname === '/admin' || pathname.startsWith('/admin/')

/** Only allow redirects back into the admin area, never to other origins or the login page. */
export function safeAdminRedirect(next: string | undefined): string {
  if (!next || !next.startsWith('/admin/') || next.startsWith('//') || next.startsWith(ADMIN_PATHS.login)) {
    return ADMIN_PATHS.dashboard
  }
  return next
}

export function loginUrl(next?: string, reason?: 'expired') {
  const params = new URLSearchParams()
  if (next && next !== ADMIN_PATHS.dashboard) params.set('next', next)
  if (reason) params.set('reason', reason)
  const query = params.toString()
  return query ? `${ADMIN_PATHS.login}?${query}` : ADMIN_PATHS.login
}
