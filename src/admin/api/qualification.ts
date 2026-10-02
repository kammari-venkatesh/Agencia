import { apiRequest } from './client'

export type QualificationStatus =
  'NOT_ANALYZED' | 'ANALYSIS_REQUIRED' | 'QUEUED' | 'ANALYZING' | 'COMPLETED' | 'FAILED' | 'STALE'

export type Level = 'HIGH' | 'MEDIUM' | 'LOW'

export type AiMode = 'live' | 'test' | 'disabled' | 'unconfigured'

/** Small status summary attached to leads in lists. */
export type QualificationSummary = {
  id?: string
  status: QualificationStatus
  errorCode?: string | null
  completedAt?: string | null
  confidence?: Level | null
  serviceIds: string[]
  isTestProvider?: boolean
}

export type QualificationEvidence = {
  id: string
  type: string
  severity: string | null
  evidence: string
  source: string | null
}

export type Opportunity = {
  serviceId: string
  serviceName: string
  priority: Level
  confidence: Level
  reason: string
  evidenceReferences: string[]
}

/** An AI interpretation of stored website facts. Every opportunity cites evidence IDs. */
export type Qualification = {
  id: string | null
  prospectId: string | null
  salesLeadId: string | null
  analysisId: string | null
  status: QualificationStatus
  staleReason?: string | null
  fresh?: boolean
  requestedAt?: string | null
  startedAt?: string | null
  completedAt?: string | null
  failedAt?: string | null
  errorCode?: string | null
  errorMessage?: string | null
  provider?: string | null
  model?: string | null
  promptVersion?: string | null
  isTestProvider?: boolean
  summary?: string | null
  confidence?: Level | null
  opportunities: Opportunity[]
  evidenceReferences?: string[]
  evidence: QualificationEvidence[]
  missingInformation: string[]
  recommendedNextAction?: string | null
  validation?: { droppedOpportunities: number; droppedReferences: number; notes: string[] } | null
  usage?: {
    inputTokens: number | null
    outputTokens: number | null
    totalTokens: number | null
    costUsd: number | null
    costStatus: 'SETTLED' | 'UNAVAILABLE' | 'NONE'
  } | null
  durationMs?: number | null
  ai: { provider: string; mode: AiMode; model: string | null }
}

export type QualifyOutcome = 'queued' | 'reused' | 'in_progress'

export type QualifyResponse = { qualification: Qualification; outcome: QualifyOutcome }

export type BulkQualifyResult = {
  results: { leadId: string; outcome: string; status: QualificationStatus | null; message?: string }[]
  queued: number
  reused: number
  analysisRequired: number
  rejected: number
  skipped: number
}

type Envelope<T> = { success: true; data: T }

const LEADS = '/api/admin/leads'
const leadPath = (id: string) => `${LEADS}/${encodeURIComponent(id)}`

/** Matches the server's per-request limit for bulk qualification. */
export const BULK_QUALIFY_MAX = 10

export const isQualificationActive = (status: QualificationStatus | null | undefined) =>
  status === 'QUEUED' || status === 'ANALYZING'

export const getLeadQualification = (leadId: string, signal?: AbortSignal) =>
  apiRequest<Envelope<Qualification>>(`${leadPath(leadId)}/qualification`, { signal })

export const qualifyLead = (leadId: string, refresh = false) =>
  apiRequest<Envelope<QualifyResponse>>(`${leadPath(leadId)}/qualify${refresh ? '/refresh' : ''}`, { method: 'POST' })

export const bulkQualifyLeads = (ids: string[]) =>
  apiRequest<Envelope<BulkQualifyResult>>(`${LEADS}/qualification/bulk`, { method: 'POST', body: { ids } })

export const getLeadQualificationStatuses = (ids: string[], signal?: AbortSignal) =>
  apiRequest<Envelope<Record<string, QualificationSummary>>>(
    `${LEADS}/qualification-status?ids=${ids.map(encodeURIComponent).join(',')}`,
    { signal },
  )
