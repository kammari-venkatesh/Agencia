import { ApiRequestError } from '../../api/client'
import type { BadgeTone } from '../../components/StatusBadge'
import { DEFAULT_LEAD_QUERY, type LeadQuery } from '../../api/leadWorkspace'

export const STATUS_TONE: Record<string, BadgeTone> = {
  NEW: 'info',
  REVIEWED: 'neutral',
  CONTACTED: 'accent',
  REPLIED: 'accent',
  INTERESTED: 'warning',
  MEETING: 'warning',
  PROPOSAL: 'warning',
  WON: 'success',
  LOST: 'danger',
}

export const SOURCE_LABEL: Record<string, string> = {
  AI_DISCOVERY: 'AI Discovery',
  MANUAL: 'Manual',
  CSV_IMPORT: 'Import',
  OTHER: 'Other',
}

/** "PROPOSAL" -> "Proposal" */
export const statusLabel = (status: string) => status.charAt(0) + status.slice(1).toLowerCase()
export const sourceLabel = (source: string) => SOURCE_LABEL[source] ?? source

export const SORT_LABELS: Record<string, string> = {
  createdAt: 'Date added',
  updatedAt: 'Last updated',
  businessName: 'Business name',
  category: 'Category',
  city: 'City',
  status: 'Status',
  source: 'Source',
}

export const PAGE_SIZES = [25, 50, 100] as const

const MATCH_LABELS: Record<string, string> = {
  prospect: 'same prospect',
  sourceId: 'same source ID',
  website: 'same website',
  phone: 'same phone',
  'businessName+city': 'same name and city',
  businessName: 'same business name',
}
/** Human wording for the server's duplicate `matchedOn` keys. */
export const matchLabel = (matchedOn: string | null) => (matchedOn ? (MATCH_LABELS[matchedOn] ?? matchedOn) : '')

export const errorMessage = (err: unknown, fallback: string) => (err instanceof Error ? err.message : fallback)
export const isUnauthorized = (err: unknown) => err instanceof ApiRequestError && err.status === 401

/** Field-level messages from a 400 "Validation failed" response, if any. */
export const fieldErrors = (err: unknown): Record<string, string> => {
  if (!(err instanceof ApiRequestError) || !err.details || typeof err.details !== 'object') return {}
  return Object.fromEntries(
    Object.entries(err.details as Record<string, unknown>).filter(([, v]) => typeof v === 'string'),
  ) as Record<string, string>
}

const dateFormatter = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
const dateTimeFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' })
export const formatDate = (iso: string) => dateFormatter.format(new Date(iso))
export const formatDateTime = (iso: string) => dateTimeFormatter.format(new Date(iso))

/** Only http(s) URLs are ever rendered as links. */
export const safeHttpUrl = (raw: string | null | undefined) => {
  if (!raw) return null
  try {
    const url = new URL(raw)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}
export const displayHost = (url: string) => {
  try {
    const { hostname, pathname } = new URL(url)
    const host = hostname.replace(/^www\./, '')
    return pathname && pathname !== '/' ? `${host}${pathname.replace(/\/$/, '')}` : host
  } catch {
    return url
  }
}
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`

const ARCHIVED_VALUES: LeadQuery['archived'][] = ['active', 'only', 'all']
const TEXT_KEYS = ['search', 'status', 'source', 'category', 'city', 'tag', 'service', 'sortBy'] as const

/** Reads list state from the address bar; the server still validates every value. */
export const queryFromUrl = (search: string): LeadQuery => {
  const params = new URLSearchParams(search)
  const query: LeadQuery = { ...DEFAULT_LEAD_QUERY }
  for (const key of TEXT_KEYS) {
    const value = params.get(key)?.trim()
    if (value) query[key] = value.slice(0, 100)
  }
  const page = Number(params.get('page'))
  if (Number.isInteger(page) && page > 1) query.page = page
  const limit = Number(params.get('limit'))
  if ((PAGE_SIZES as readonly number[]).includes(limit)) query.limit = limit
  const archived = params.get('archived') as LeadQuery['archived']
  if (ARCHIVED_VALUES.includes(archived)) query.archived = archived
  if (params.get('sortOrder') === 'asc') query.sortOrder = 'asc'
  return query
}
