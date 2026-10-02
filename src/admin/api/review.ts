import { apiRequest } from './client'
import type { QualificationEvidence } from './qualification'

export type ReviewDecision = 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW'
export type ServiceDecision = 'APPROVED' | 'REJECTED'
export type ReadinessStatus = 'NOT_REVIEWED' | 'AI_REVIEWED' | 'HUMAN_APPROVED' | 'HUMAN_REJECTED' | 'OUTREACH_READY'

export type ServiceRef = { serviceId: string; serviceName: string }

export type ReviewHistoryEntry = {
  at: string
  action: 'CREATED' | 'UPDATED' | 'NEEDS_REVIEW' | 'APPROVED' | 'REJECTED' | 'LEAD_UPDATED'
  reviewer: { id: string; email: string | null }
  previousDecision: ReviewDecision | null
  newDecision: ReviewDecision
  approvedServices: string[]
  rejectedServices: string[]
  addedLeadServices: string[]
  notes: string | null
}

/** A human reviewer's decision about one business. AI suggestions are never approved automatically. */
export type ProspectReview = {
  id: string
  prospectId: string | null
  salesLeadId: string | null
  qualificationId: string
  qualificationCompletedAt: string
  outdated: boolean
  decision: ReviewDecision
  serviceDecisions: (ServiceRef & { decision: ServiceDecision })[]
  approvedServices: ServiceRef[]
  rejectedServices: ServiceRef[]
  reviewNotes: string | null
  reviewerEditedSummary: string | null
  reviewerEditedNextAction: string | null
  evidenceAcknowledged: boolean
  reviewer: { id: string; email: string | null }
  reviewedAt: string | null
  version: number
  leadUpdate: { appliedAt: string; addedServices: string[] } | null
  history: ReviewHistoryEntry[]
  createdAt: string
  updatedAt: string
}

export type Readiness = { status: ReadinessStatus; problems: string[] }

export type ReviewState = { review: ProspectReview | null; readiness: Readiness }

export type ReviewInput = {
  serviceDecisions?: { serviceId: string; decision: ServiceDecision | 'UNDECIDED' }[]
  reviewNotes?: string | null
  reviewerEditedSummary?: string | null
  reviewerEditedNextAction?: string | null
  evidenceAcknowledged?: boolean
}

export type OutreachPreview = {
  readiness: Readiness
  business: {
    name: string | null
    category: string | null
    phone: string | null
    website: string | null
    location: string | null
    googleMapsUrl: string | null
  }
  approvedServices: (ServiceRef & { aiReason: string | null; evidence: QualificationEvidence[] })[]
  summary: { text: string; source: 'REVIEWER' | 'AI' } | null
  nextAction: { text: string; source: 'REVIEWER' | 'AI' } | null
  reviewerNotes: string | null
  reviewedBy: string | null
  reviewedAt: string | null
  draftMessage: null
  sending: { available: false; note: string }
}

type Envelope<T> = { success: true; data: T }

const reviewPath = (leadId: string) => `/api/admin/leads/${encodeURIComponent(leadId)}/review`

export const getLeadReview = (leadId: string, signal?: AbortSignal) =>
  apiRequest<Envelope<ReviewState>>(reviewPath(leadId), { signal })

/** Creates the review (version 0) or saves changes to it; `needsReview` also marks it for more review. */
export const saveLeadReview = async (leadId: string, version: number, input: ReviewInput, needsReview = false) => {
  let current = version
  if (current === 0) {
    const created = await apiRequest<Envelope<ReviewState>>(reviewPath(leadId), { method: 'POST', body: input })
    if (!needsReview) return created
    current = created.data.review?.version ?? 1
  }
  return apiRequest<Envelope<ReviewState>>(reviewPath(leadId), {
    method: 'PATCH',
    body: { ...input, expectedVersion: current, ...(needsReview ? { decision: 'NEEDS_REVIEW' } : {}) },
  })
}

export const approveLeadReview = (leadId: string, version: number, input: ReviewInput) =>
  apiRequest<Envelope<ReviewState>>(`${reviewPath(leadId)}/approve`, {
    method: 'POST',
    body: { ...input, expectedVersion: version },
  })

export const rejectLeadReview = (leadId: string, version: number, input: ReviewInput) =>
  apiRequest<Envelope<ReviewState>>(`${reviewPath(leadId)}/reject`, {
    method: 'POST',
    body: { ...input, expectedVersion: version },
  })

export const getLeadOutreachPreview = (leadId: string, signal?: AbortSignal) =>
  apiRequest<Envelope<OutreachPreview>>(`/api/admin/leads/${encodeURIComponent(leadId)}/outreach-preview`, { signal })
