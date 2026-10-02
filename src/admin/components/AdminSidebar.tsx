import { ArrowUpRight, History, KeyRound, LayoutDashboard, Radar, Search, Table2, X } from 'lucide-react'
import type { ComponentType } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { useProviderStatus } from '../hooks/useProviderStatus'
import { ADMIN_PATHS } from '../paths'

type Icon = ComponentType<{ size?: number; 'aria-hidden'?: boolean }>
type NavLink = { label: string; href: string; icon: Icon; badge?: string }
type NavGroup = {
  label: string
  icon: Icon
  badge?: string
  /** Shows "Live" or "Test" depending on the Lead Finder discovery provider. */
  providerBadge?: boolean
  children: NavLink[]
}

const NAV_ITEMS: (NavLink | NavGroup)[] = [
  { label: 'Dashboard', href: ADMIN_PATHS.dashboard, icon: LayoutDashboard },
  {
    label: 'AI Lead Finder',
    icon: Radar,
    providerBadge: true,
    children: [
      { label: 'Discover', href: ADMIN_PATHS.leadFinder, icon: Search },
      { label: 'Jobs', href: ADMIN_PATHS.leadFinderJobs, icon: History },
      {
        label: 'Lead Workspace',
        href: ADMIN_PATHS.leadWorkspace,
        icon: Table2,
      },
    ],
  },
]

const SETTINGS_ITEMS: NavLink[] = [{ label: 'Admin Access', href: ADMIN_PATHS.access, icon: KeyRound }]

type AdminSidebarProps = {
  open: boolean
  onClose: () => void
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const { urlPathname } = usePageContext()
  const live = useProviderStatus()?.providers.apify.available === true
  const isActive = (href: string) => urlPathname === href || urlPathname === href.replace(/\/$/, '')

  const renderLink = ({ label, href, icon: Icon, badge }: NavLink, nested = false) => {
    const active = isActive(href)
    return (
      <a
        key={href}
        href={href}
        className={`adm-nav-item ${nested ? 'adm-nav-item--nested' : ''} ${active ? 'is-active' : ''}`}
        aria-current={active ? 'page' : undefined}
        onClick={onClose}
      >
        <Icon size={nested ? 16 : 18} aria-hidden />
        <span className="adm-nav-text">{label}</span>
        {badge ? <span className="adm-nav-badge">{badge}</span> : null}
      </a>
    )
  }

  return (
    <aside className={`adm-sidebar ${open ? 'is-open' : ''}`} aria-label="Admin navigation">
      <div className="adm-sidebar-top">
        <a href={ADMIN_PATHS.dashboard} className="adm-brand">
          <span className="brand-font adm-brand-name">vridhiō</span>
          <span className="adm-brand-tag">ADMIN</span>
        </a>
        <button
          type="button"
          className="adm-icon-btn adm-sidebar-close"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X size={18} aria-hidden />
        </button>
      </div>

      <nav className="adm-nav">
        <span className="adm-nav-label">WORKSPACE</span>
        {NAV_ITEMS.map((item) =>
          'children' in item ? (
            <div
              key={item.label}
              className="adm-nav-group"
              role="group"
              aria-labelledby={`nav-${item.label.replace(/\W+/g, '-')}`}
            >
              <span id={`nav-${item.label.replace(/\W+/g, '-')}`} className="adm-nav-item adm-nav-group-label">
                <item.icon size={18} aria-hidden />
                <span className="adm-nav-text">{item.label}</span>
                {item.badge ? <span className="adm-nav-badge">{item.badge}</span> : null}
                {item.providerBadge ? (
                  <span className={`adm-nav-badge${live ? ' adm-nav-badge--live' : ''}`}>
                    {live ? 'Real ready' : 'Test'}
                  </span>
                ) : null}
              </span>
              {item.children.map((child) => renderLink(child, true))}
            </div>
          ) : (
            renderLink(item)
          ),
        )}
        <span className="adm-nav-label adm-nav-label--spaced">SETTINGS</span>
        {SETTINGS_ITEMS.map((item) => renderLink(item))}
      </nav>

      <div className="adm-sidebar-footer">
        <a href="/" className="adm-nav-item adm-nav-item--muted" target="_blank" rel="noopener noreferrer">
          <ArrowUpRight size={18} aria-hidden />
          <span className="adm-nav-text">View website</span>
        </a>
      </div>
    </aside>
  )
}
