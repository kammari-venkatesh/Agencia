import { LogOut, Menu } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useAdminAuth } from '../auth/adminAuthContext'
import { StatusBadge } from './StatusBadge'

type AdminHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
  onOpenNav: () => void
}

export function AdminHeader({ title, description, actions, onOpenNav }: AdminHeaderProps) {
  const { admin, logout } = useAdminAuth()
  const [signingOut, setSigningOut] = useState(false)

  const handleLogout = async () => {
    setSigningOut(true)
    try {
      await logout()
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <header className="adm-header">
      <div className="adm-header-bar">
        <button type="button" className="adm-icon-btn adm-menu-btn" onClick={onOpenNav} aria-label="Open navigation">
          <Menu size={20} aria-hidden />
        </button>

        <div className="adm-header-user">
          <div className="adm-user-meta">
            <span className="adm-user-email">{admin?.email}</span>
            <StatusBadge tone="accent">{admin?.role ?? 'admin'}</StatusBadge>
          </div>
          <button type="button" className="adm-btn adm-btn--ghost" onClick={handleLogout} disabled={signingOut}>
            <LogOut size={16} aria-hidden />
            <span>{signingOut ? 'Signing out…' : 'Log out'}</span>
          </button>
        </div>
      </div>

      <div className="adm-page-heading">
        <div>
          <h1 className="adm-page-title">{title}</h1>
          {description ? <p className="adm-page-desc">{description}</p> : null}
        </div>
        {actions ? <div className="adm-page-actions">{actions}</div> : null}
      </div>
    </header>
  )
}
