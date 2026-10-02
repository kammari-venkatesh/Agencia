import { apiRequest } from './client'

export type AnalysisStatus = 'NOT_ANALYZED' | 'QUEUED' | 'ANALYZING' | 'COMPLETED' | 'FAILED' | 'SKIPPED' | 'CANCELLED'

/** Small status summary attached to leads and prospects in lists. */
export type AnalysisSummary = {
  id: string
  status: AnalysisStatus
  analyzedAt: string | null
  errorCode: string | null
  reachable: boolean | null
  httpStatus: number | null
  websiteChanged: boolean
}

export type Evidence = {
  type: string
  severity: 'INFO' | 'NOTICE' | 'WARNING'
  evidence: string
  source: string
}

export type Technology = { name: string; category: string; confidence: 'HIGH' | 'MEDIUM' | 'LOW'; evidence: string }

export type SocialLink = { platform: string; url: string; source: string }

/** Stored facts about a business website. Nothing here is a score or a conclusion. */
export type WebsiteAnalysis = {
  id: string | null
  jobId: string | null
  prospectId: string | null
  salesLeadId: string | null
  status: AnalysisStatus
  queuedAt?: string | null
  startedAt?: string | null
  completedAt?: string | null
  analyzedAt?: string | null
  lastAttemptAt?: string | null
  attemptCount?: number
  errorCode?: string | null
  errorMessage?: string | null
  fresh?: boolean
  websiteChanged?: boolean
  website: {
    websiteUrl: string | null
    normalizedWebsiteUrl: string | null
    hasWebsite: boolean
    websiteSource: string | null
  }
  availability?: {
    reachable: boolean
    httpStatus: number | null
    finalUrl: string | null
    redirectCount: number
    responseTimeMs: number | null
    contentType: string | null
    https: boolean | null
    attempts: number
  }
  page?: {
    title: string | null
    metaDescription: string | null
    canonicalUrl: string | null
    lang: string | null
    viewport: string | null
  }
  content?: {
    hasH1: boolean | null
    h1Count: number
    headingCount: number
    imageCount: number
    imagesWithoutAltCount: number
    internalLinkCount: number
    externalLinkCount: number
  }
  robots?: {
    robotsTxtUrl: string | null
    robotsTxtExists: boolean | null
    robotsTxtStatus: number | null
    robotsDisallowsAll: boolean | null
  }
  sitemap?: {
    sitemapExists: boolean | null
    sitemapUrl: string | null
    sitemapSource: string | null
    sitemapKind: string | null
  }
  structuredData?: {
    hasJsonLd: boolean | null
    jsonLdTypes: string[]
    openGraph: { present: boolean | null; tags: Record<string, string> }
    twitterCard: { present: boolean | null; card: string | null; tags: Record<string, string> }
  }
  mobile?: { hasViewport: boolean | null; viewportStatus: 'viewport_present' | 'viewport_missing' | 'unknown' }
  technologies?: Technology[]
  socialLinks?: SocialLink[]
  evidence?: Evidence[]
  durationMs?: number | null
}

export type AnalyzeOutcome = 'queued' | 'reused' | 'in_progress' | 'completed'

export type AnalyzeResponse = { analysis: WebsiteAnalysis; outcome: AnalyzeOutcome; jobId: string | null }

export type BulkAnalyzeResult = {
  results: { leadId: string; outcome: string; status: AnalysisStatus | null; message?: string }[]
  queued: number
  reused: number
  completed: number
  rejected: number
}

type Envelope<T> = { success: true; data: T }

const LEADS = '/api/admin/leads'
const PROSPECTS = '/api/admin/lead-finder/prospects'
const leadPath = (id: string) => `${LEADS}/${encodeURIComponent(id)}`
const prospectPath = (id: string) => `${PROSPECTS}/${encodeURIComponent(id)}`

/** Matches the server's per-request limit for bulk analysis. */
export const BULK_ANALYZE_MAX = 25

export const ACTIVE_ANALYSIS_STATUSES: AnalysisStatus[] = ['QUEUED', 'ANALYZING']
export const isAnalysisActive = (status: AnalysisStatus | null | undefined) =>
  !!status && ACTIVE_ANALYSIS_STATUSES.includes(status)

export const getLeadAnalysis = (leadId: string, signal?: AbortSignal) =>
  apiRequest<Envelope<WebsiteAnalysis>>(`${leadPath(leadId)}/analysis`, { signal })

export const analyzeLeadWebsite = (leadId: string, refresh = false) =>
  apiRequest<Envelope<AnalyzeResponse>>(`${leadPath(leadId)}/analyze${refresh ? '/refresh' : ''}`, { method: 'POST' })

export const bulkAnalyzeLeadWebsites = (ids: string[]) =>
  apiRequest<Envelope<BulkAnalyzeResult>>(`${LEADS}/analyze/bulk`, { method: 'POST', body: { ids } })

export const getLeadAnalysisStatuses = (ids: string[], signal?: AbortSignal) =>
  apiRequest<Envelope<Record<string, AnalysisSummary | null>>>(
    `${LEADS}/analysis-status?ids=${ids.map(encodeURIComponent).join(',')}`,
    { signal },
  )

export const analyzeProspectWebsite = (prospectId: string, refresh = false) =>
  apiRequest<Envelope<AnalyzeResponse>>(`${prospectPath(prospectId)}/analyze${refresh ? '/refresh' : ''}`, {
    method: 'POST',
  })

export const getProspectAnalysis = (prospectId: string, signal?: AbortSignal) =>
  apiRequest<Envelope<WebsiteAnalysis>>(`${prospectPath(prospectId)}/analysis`, { signal })
