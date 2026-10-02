import { useEffect, useState, type ReactNode } from 'react'
import { navigate } from 'vike/client/router'
import { usePageContext } from 'vike-react/usePageContext'
import { useAdminAuth } from '../auth/adminAuthContext'
import { loginUrl } from '../paths'
import { AdminHeader } from './AdminHeader'
import { AdminSidebar } from './AdminSidebar'
import { AdminStateScreen } from './AdminStateScreen'

type AdminShellProps = {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

/** Layout for every protected admin page; redirects to login when there is no valid session. */
export function AdminShell({ title, description, actions, children }: AdminShellProps) {
  const { status, sessionExpired, error, refresh } = useAdminAuth()
  const { urlPathname } = usePageContext()
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      void navigate(loginUrl(urlPathname, sessionExpired ? 'expired' : undefined))
    }
  }, [status, sessionExpired, urlPathname])

  if (status === 'error') {
    return <AdminStateScreen kind="error" message={error ?? 'Unable to verify your session.'} onRetry={refresh} />
  }
  if (status !== 'authenticated') {
    return <AdminStateScreen kind="loading" message={status === 'unauthenticated' ? 'Redirecting to sign in…' : undefined} />
  }

  return (
    <div className="adm-app">
      <AdminSidebar open={navOpen} onClose={() => setNavOpen(false)} />
      {navOpen ? <div className="adm-scrim" onClick={() => setNavOpen(false)} aria-hidden /> : null}
      <div className="adm-main">
        <AdminHeader title={title} description={description} actions={actions} onOpenNav={() => setNavOpen(true)} />
        <main className="adm-content">{children}</main>
      </div>
    </div>
  )
}
