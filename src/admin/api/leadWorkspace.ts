import { apiDownload, apiRequest } from './client'
import type { QualificationSummary } from './qualification'
import type { AnalysisSummary } from './websiteAnalysis'

export type SalesLead = {
  id: string
  businessName: string
  category: string | null
  contactName: string | null
  phone: string | null
  email: string | null
  website: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  googleMapsUrl: string | null
  source: string
  sourceDetail: string | null
  sourceId: string | null
  prospectId: string | null
  potentialServices: string[]
  status: string
  tags: string[]
  notes: string
  customFields: Record<string, string>
  assignedTo: { id: string; email: string | null } | null
  archived: boolean
  createdAt: string
  updatedAt: string
  /** Website analysis status; null when never analysed. Absent on freshly created rows. */
  websiteAnalysis?: AnalysisSummary | null
  /** AI qualification status. Absent on freshly created rows. */
  qualification?: QualificationSummary
}

export type SalesLeadDetail = SalesLead & { prospect: { id: string; jobId: string } | null }

export type LeadFieldKey =
  | 'businessName'
  | 'category'
  | 'contactName'
  | 'phone'
  | 'email'
  | 'website'
  | 'address'
  | 'city'
  | 'state'
  | 'country'
  | 'googleMapsUrl'
  | 'potentialServices'
  | 'tags'
  | 'status'
  | 'notes'

export type WorkspaceMeta = {
  statuses: string[]
  sources: string[]
  services: string[]
  fields: { key: LeadFieldKey; label: string; required: boolean }[]
  sortFields: string[]
  admins: { id: string; email: string }[]
  facets: { categories: string[]; cities: string[]; tags: string[] }
  limits: {
    maxTags: number
    tagMaxLength: number
    notesMaxLength: number
    maxCustomFields: number
    bulkMaxIds: number
    maxContentLength: number
    maxRows: number
  }
}

export type LeadQuery = {
  page: number
  limit: number
  search: string
  status: string
  source: string
  category: string
  city: string
  tag: string
  service: string
  archived: 'active' | 'only' | 'all'
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export const DEFAULT_LEAD_QUERY: LeadQuery = {
  page: 1,
  limit: 50,
  search: '',
  status: '',
  source: '',
  category: '',
  city: '',
  tag: '',
  service: '',
  archived: 'active',
  sortBy: 'createdAt',
  sortOrder: 'desc',
}

export type Pagination = { page: number; limit: number; total: number; totalPages: number }

export type LeadInput = Partial<
  Pick<
    SalesLead,
    | 'businessName'
    | 'category'
    | 'contactName'
    | 'phone'
    | 'email'
    | 'website'
    | 'address'
    | 'city'
    | 'state'
    | 'country'
    | 'googleMapsUrl'
    | 'potentialServices'
    | 'status'
    | 'tags'
    | 'notes'
    | 'customFields'
  > & { assignedTo: string | null }
>

export type BulkOperation =
  'status' | 'addTag' | 'removeTag' | 'addService' | 'removeService' | 'assign' | 'archive' | 'unarchive'

export type ColumnTarget = LeadFieldKey | 'custom' | 'ignore'
export type ColumnMapping = { target: ColumnTarget; customName?: string }

export type ImportRequest = {
  content: string
  method: 'paste' | 'csv'
  fileName?: string
  hasHeader?: 'auto' | boolean
  mapping?: ColumnMapping[]
  duplicateMode?: 'skip' | 'update'
}

export type PreviewRow = {
  row: number
  status: 'new' | 'duplicate' | 'error'
  message: string | null
  matchedOn: string | null
  existingLead: { id: string; businessName: string; archived: boolean } | null
  duplicateOfRow: number | null
  warnings: string[]
  values: (Partial<Record<LeadFieldKey, string | string[]>> & { customFields?: Record<string, string> }) | null
}

export type ImportPreview = {
  delimiter: 'tab' | 'comma' | 'semicolon'
  hasHeader: boolean
  rowCount: number
  columns: { index: number; header: string; samples: string[] }[]
  suggestedMapping: ColumnMapping[]
  mapping: ColumnMapping[]
  mappingErrors: Record<string, string>
  sampleRows: { row: number; cells: string[] }[]
  warnings: string[]
  analysis: {
    newRows: number
    duplicates: number
    errors: number
    warnings: number
    rows: PreviewRow[]
    issues: PreviewRow[]
  } | null
}

export type ImportSummary = {
  totalRows: number
  inserted: number
  updated: number
  skipped: number
  duplicates: number
  errorCount: number
  errors: { row: number; message: string }[]
  duplicateRows: {
    row: number
    matchedOn: string
    existingLead: { id: string; businessName: string; archived: boolean } | null
    duplicateOfRow: number | null
    action: 'skipped' | 'updated'
  }[]
  warnings: { row: number; message: string }[]
}

/** Raw cell text per field, as typed or pasted; the server parses lists, URLs and statuses. */
export type LeadTextInput = Partial<Record<LeadFieldKey, string>>

export type BatchRowInput = { clientId: string; values: LeadTextInput }

export type BatchRowResult =
  | { clientId: string; status: 'created'; lead: SalesLead }
  | { clientId: string; status: 'invalid'; message: string; errors: Record<string, string> }
  | {
      clientId: string
      status: 'duplicate'
      matchedOn: string
      message: string
      existingLead?: { id: string; businessName: string; archived: boolean }
      duplicateOfClientId?: string
    }

export type BatchCreateResult = { results: BatchRowResult[]; created: number; duplicates: number; invalid: number }

type Envelope<T> = { success: true; data: T }

const LEADS = '/api/admin/leads'
const WORKSPACE = '/api/admin/lead-workspace'
const leadPath = (id: string) => `${LEADS}/${encodeURIComponent(id)}`

/** Query string with only non-default values, so URLs stay short. */
export const leadQueryString = (query: LeadQuery, { includePaging = true } = {}) => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query) as [keyof LeadQuery, LeadQuery[keyof LeadQuery]][]) {
    if (!includePaging && (key === 'page' || key === 'limit')) continue
    if (value !== '' && value !== DEFAULT_LEAD_QUERY[key]) params.set(key, String(value))
  }
  return params.toString()
}

export const fetchWorkspaceMeta = (signal?: AbortSignal) =>
  apiRequest<Envelope<WorkspaceMeta>>(`${WORKSPACE}/meta`, { signal })

export const listSalesLeads = (query: LeadQuery, signal?: AbortSignal) => {
  const qs = leadQueryString(query)
  return apiRequest<Envelope<SalesLead[]> & { pagination: Pagination }>(qs ? `${LEADS}?${qs}` : LEADS, { signal })
}

export const getSalesLead = (id: string, signal?: AbortSignal) =>
  apiRequest<Envelope<SalesLeadDetail>>(leadPath(id), { signal })

export const createSalesLead = (input: LeadInput) =>
  apiRequest<Envelope<SalesLead>>(LEADS, { method: 'POST', body: input })

/** Creates several leads at once (rows typed or pasted into the table); duplicates are skipped. */
export const createSalesLeadsBatch = (rows: BatchRowInput[]) =>
  apiRequest<Envelope<BatchCreateResult>>(`${LEADS}/batch`, { method: 'POST', body: { rows } })

export const updateSalesLead = (id: string, input: LeadInput | LeadTextInput) =>
  apiRequest<Envelope<SalesLead>>(leadPath(id), { method: 'PATCH', body: input })

export const archiveSalesLead = (id: string) => apiRequest<Envelope<SalesLead>>(leadPath(id), { method: 'DELETE' })

export const bulkUpdateSalesLeads = (ids: string[], operation: BulkOperation, value?: string | null) =>
  apiRequest<Envelope<{ requested: number; found: number; matched: number; modified: number }>>(`${LEADS}/bulk`, {
    method: 'PATCH',
    body: { ids, operation, value },
  })

export const exportSalesLeads = (query: LeadQuery) => {
  const qs = leadQueryString(query, { includePaging: false })
  return apiDownload(qs ? `${LEADS}/export?${qs}` : `${LEADS}/export`, 'sales-leads.csv')
}

export const previewLeadImport = (request: ImportRequest) =>
  apiRequest<Envelope<ImportPreview>>(`${WORKSPACE}/import/preview`, { method: 'POST', body: request })

export const runLeadImport = (request: ImportRequest & { mapping: ColumnMapping[] }) =>
  apiRequest<Envelope<ImportSummary>>(`${WORKSPACE}/import`, { method: 'POST', body: request })
