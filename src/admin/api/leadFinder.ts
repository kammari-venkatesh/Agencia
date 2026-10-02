import { apiRequest } from './client'
import type { AnalysisSummary } from './websiteAnalysis'

export type JobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'

/** "test": built-in sample data, no cost. "apify": real businesses through Apify, uses credits. */
export type SearchProvider = 'test' | 'apify'

export type JobParams = {
  location: string
  radius: number
  categories: string[]
  maxBusinesses: number
}

/**
 * "test": sample data, no cost; "pending": run in progress; "recorded": provider-reported cost;
 * "unavailable": a paid run happened but its cost could not be retrieved; "none": no paid run started.
 */
export type JobCost = {
  status: 'test' | 'pending' | 'recorded' | 'unavailable' | 'none'
  totalUsd: number | null
  perNewProspectUsd: number | null
}

export type LeadFinderJob = {
  id: string
  status: JobStatus
  /** The provider stored on the job; the worker runs exactly this provider. */
  provider: SearchProvider | 'unknown'
  providerMode: 'live' | 'test'
  params: JobParams
  /** Resolved search centre; radiusEnforced is false for test data. */
  searchArea: {
    label: string | null
    latitude: number | null
    longitude: number | null
    radiusEnforced: boolean
  }
  progress: {
    /** Raw records returned by the provider, including duplicates. */
    total: number
    /** Raw records rejected as malformed (missing name or stable ID). */
    invalid: number
    /** Unique businesses excluded as permanently closed. */
    closed: number
    /** Unique businesses farther than the radius from the search centre. */
    outsideRadius: number
    /** Unique businesses excluded because their location is unknown. */
    missingCoordinates: number
    /** Unique businesses kept after de-duplication and the closed and radius filters. */
    discovered: number
    processed: number
    newProspects: number
    qualified: number
  }
  cost: JobCost
  error: string | null
  createdAt: string
  updatedAt: string
  startedAt: string | null
  finishedAt: string | null
}

export type Prospect = {
  id: string
  businessName: string
  category: string
  categories: string[]
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  phone: string | null
  website: string | null
  googleMapsUrl: string | null
  latitude: number | null
  longitude: number | null
  source: string
  status: 'new'
  createdAt: string
  /** Set when the prospect has been added to the Lead Workspace. */
  salesLeadId: string | null
  websiteAnalysis?: AnalysisSummary | null
}

export type Paginated<T> = {
  items: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

type Envelope<T> = { success: true; data: T }

export type RealSearchUnavailableReason = 'REAL_APIFY_DISABLED' | 'REAL_APIFY_NOT_CONFIGURED'

/** Search modes this server can run. Test is always available and the default. */
export type ProviderStatus = {
  defaultProvider: SearchProvider
  providers: {
    test: { available: true }
    apify: {
      available: boolean
      unavailableReason: RealSearchUnavailableReason | null
      /** The most one real search may cost (Apify spending cap), when available. */
      maxRunCostUsd: number | null
    }
  }
  dailyBudgetConfigured: boolean
  monthlyBudgetConfigured: boolean
}

export const providerLabel = (provider: LeadFinderJob['provider']) =>
  provider === 'apify' ? 'APIFY — REAL' : provider === 'test' ? 'TEST DATA' : 'UNKNOWN'

export const getProviderStatus = (signal?: AbortSignal) =>
  apiRequest<Envelope<ProviderStatus>>('/api/admin/lead-finder/provider-status', { signal })

type SpendPeriod = { spentUsd: number; reservedUsd: number; budgetUsd: number | null }

/** Discovery spend of jobs created today / this month (UTC). reservedUsd covers running or unpriced runs. */
export type UsageSummary = { timezone: 'UTC'; today: SpendPeriod; month: SpendPeriod }

export const getUsageSummary = (signal?: AbortSignal) =>
  apiRequest<Envelope<UsageSummary>>('/api/admin/lead-finder/usage', { signal })

/** USD with enough precision for sub-cent amounts: $0.0252, $0.00504, $1.20. */
export const formatUsd = (value: number) => {
  if (value === 0) return '$0'
  if (value >= 1) return `$${value.toFixed(2)}`
  return `$${Number(value.toPrecision(3))}`
}

const JOBS = '/api/admin/lead-finder/jobs'
const jobPath = (jobId: string) => `${JOBS}/${encodeURIComponent(jobId)}`

/** The server decides whether the requested provider may run; a real search also needs explicit confirmation. */
export const createLeadFinderJob = (params: JobParams, provider: SearchProvider, confirmRealSearch = false) =>
  apiRequest<Envelope<{ jobId: string; status: JobStatus; job: LeadFinderJob }>>(JOBS, {
    method: 'POST',
    body: provider === 'apify' ? { ...params, provider, confirmRealSearch } : { ...params, provider },
  })

export const listLeadFinderJobs = (page: number, limit: number, signal?: AbortSignal) =>
  apiRequest<Envelope<Paginated<LeadFinderJob>>>(`${JOBS}?page=${page}&limit=${limit}`, { signal })

export const getLeadFinderJob = (jobId: string, signal?: AbortSignal) =>
  apiRequest<Envelope<LeadFinderJob>>(jobPath(jobId), { signal })

export const listJobProspects = (jobId: string, page: number, limit: number, signal?: AbortSignal) =>
  apiRequest<Envelope<Paginated<Prospect>>>(`${jobPath(jobId)}/prospects?page=${page}&limit=${limit}`, { signal })

export const promoteProspect = (prospectId: string) =>
  apiRequest<Envelope<{ lead: { id: string }; created: boolean; matchedOn: string | null }>>(
    `/api/admin/lead-finder/prospects/${encodeURIComponent(prospectId)}/promote`,
    { method: 'POST' },
  )

export const cancelLeadFinderJob = (jobId: string) =>
  apiRequest<Envelope<LeadFinderJob>>(`${jobPath(jobId)}/cancel`, { method: 'POST' })
