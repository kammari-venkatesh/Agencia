import type { JobStatus, LeadFinderJob } from '../../api/leadFinder'
import type { BadgeTone } from '../../components/StatusBadge'

export const POLL_INTERVAL_MS = 3000

export const STATUS_META: Record<JobStatus, { label: string; tone: BadgeTone }> = {
  queued: { label: 'Queued', tone: 'neutral' },
  running: { label: 'Running', tone: 'info' },
  completed: { label: 'Completed', tone: 'success' },
  failed: { label: 'Failed', tone: 'danger' },
  cancelled: { label: 'Cancelled', tone: 'warning' },
}

export const isActiveJob = (job: Pick<LeadFinderJob, 'status'>) => job.status === 'queued' || job.status === 'running'

/** Percentage of unique businesses saved, or null while the total is still unknown. */
export const progressPercent = (job: LeadFinderJob): number | null => {
  if (job.status === 'completed') return 100
  const { discovered, processed } = job.progress
  if (discovered === 0) return null
  return Math.min(100, Math.round((processed / discovered) * 100))
}

export const shortJobId = (id: string) => id.slice(-6).toUpperCase()

export const dateTimeFormatter = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' })

/** Only http(s) URLs are ever rendered as links. */
export const safeHttpUrl = (value: string | null) => {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

export const displayHost = (url: string) => new URL(url).host.replace(/^www\./, '')
