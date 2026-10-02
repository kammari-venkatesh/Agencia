import { StatusBadge } from '../../components/StatusBadge'
import { sourceLabel, STATUS_TONE, statusLabel } from './leadFormat'

export function LeadStatusBadge({ status }: { status: string }) {
  return <StatusBadge tone={STATUS_TONE[status] ?? 'neutral'}>{statusLabel(status)}</StatusBadge>
}

export function LeadSourceBadge({ source }: { source: string }) {
  return <span className={`adm-tag adm-lw-source adm-lw-source--${source.toLowerCase()}`}>{sourceLabel(source)}</span>
}
