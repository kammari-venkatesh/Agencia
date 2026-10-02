import type { ReactNode } from 'react'

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'accent' | 'info'

export function StatusBadge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span className={`adm-badge adm-badge--${tone}`}>
      <span className="adm-badge-dot" aria-hidden />
      {children}
    </span>
  )
}
