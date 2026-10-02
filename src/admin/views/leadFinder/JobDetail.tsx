import {
  ArrowUpRight,
  Ban,
  Check,
  ExternalLink,
  Globe,
  Loader2,
  MapPinned,
  Plus,
  RefreshCw,
  Store,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { ApiRequestError } from '../../api/client'
import {
  formatUsd,
  listJobProspects,
  promoteProspect,
  type JobCost,
  type LeadFinderJob,
  type Paginated,
  type Prospect,
} from '../../api/leadFinder'
import { Pagination } from '../../components/Pagination'
import { StatusBadge } from '../../components/StatusBadge'
import { leadWorkspaceUrl } from '../../paths'
import { ProspectAnalysis } from '../leadWorkspace/WebsiteAnalysis'
import { JobProgress } from './JobProgress'
import { dateTimeFormatter, displayHost, isActiveJob, safeHttpUrl, shortJobId, STATUS_META } from './jobStatus'

const PROSPECTS_PER_PAGE = 25
const COLUMNS = ['Business', 'Category', 'Website', 'Phone', 'Address', 'Status', 'Website Analysis', 'Lead Workspace']

type ProspectsResult = { key: string; data?: Paginated<Prospect>; error?: string }

type JobDetailProps = {
  job: LeadFinderJob
  cancelling: boolean
  onCancel: (job: LeadFinderJob) => void
  onClose: () => void
}

const STATUS_NOTE: Record<LeadFinderJob['status'], string> = {
  queued: 'Waiting for the background worker to pick up this search.',
  running: 'Discovering businesses. Prospects appear here as they are saved.',
  completed: 'Search finished.',
  failed: 'This search failed.',
  cancelled: 'This search was cancelled. Prospects saved before cancellation are kept.',
}

const costLabel = (cost: JobCost, active: boolean) => {
  if (cost.status === 'recorded' && cost.totalUsd !== null) return formatUsd(cost.totalUsd)
  if (cost.status === 'pending') return active ? 'Shown when the search finishes' : 'Finalising (about a minute)'
  if (cost.status === 'none') return 'No charge (no paid run started)'
  return 'Cost unavailable'
}

const emptyMessage = (job: LeadFinderJob) => {
  if (job.status === 'queued') return 'No prospects yet — the search has not started.'
  if (job.status === 'running') return 'No prospects saved yet.'
  if (job.status === 'completed') {
    return job.progress.outsideRadius > 0
      ? 'No businesses were found within the radius. Try a larger radius or a more central location.'
      : 'No businesses were found for this search.'
  }
  return 'No prospects were saved for this search.'
}

export function JobDetail({ job, cancelling, onCancel, onClose }: JobDetailProps) {
  const [page, setPage] = useState(1)
  const [retryKey, setRetryKey] = useState(0)
  const [result, setResult] = useState<ProspectsResult | null>(null)
  const requestKey = `${job.id}:${page}`

  // Refetch as the worker saves more prospects or the job finishes.
  useEffect(() => {
    const controller = new AbortController()
    listJobProspects(job.id, page, PROSPECTS_PER_PAGE, controller.signal)
      .then((res) => setResult({ key: requestKey, data: res.data }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        if (err instanceof ApiRequestError && err.status === 401) return
        setResult({ key: requestKey, error: err instanceof Error ? err.message : 'Failed to load prospects.' })
      })
    return () => controller.abort()
  }, [job.id, page, requestKey, job.status, job.progress.processed, retryKey])

  const current = result?.key === requestKey ? result : null
  const loading = !current
  const prospects = current?.data?.items ?? []
  const meta = STATUS_META[job.status]
  const { progress } = job

  const radiusEnforced = job.searchArea.radiusEnforced
  const unusable = [
    progress.invalid ? `${progress.invalid} invalid` : '',
    progress.closed ? `${progress.closed} permanently closed` : '',
  ].filter(Boolean)
  const stats = [
    { label: 'FOUND', value: progress.total, hint: 'Records returned' },
    {
      label: 'VALID',
      value: progress.total - progress.invalid,
      hint: progress.invalid ? `${progress.invalid} invalid records skipped` : 'Usable records',
    },
    radiusEnforced
      ? {
          label: 'WITHIN RADIUS',
          value: progress.discovered,
          hint: `Unique, open, within ${job.params.radius} km`,
        }
      : {
          label: 'UNIQUE',
          value: progress.discovered,
          hint: unusable.length ? `After removing duplicates · ${unusable.join(' · ')}` : 'After removing duplicates',
        },
    ...(radiusEnforced
      ? [
          {
            label: 'OUTSIDE RADIUS',
            value: progress.outsideRadius,
            hint: progress.missingCoordinates
              ? `Excluded · ${progress.missingCoordinates} more without a location`
              : 'Excluded, not saved',
          },
        ]
      : []),
    { label: 'SAVED', value: progress.processed, hint: 'Stored as prospects' },
    { label: 'NEW', value: progress.newProspects, hint: 'Not seen in earlier searches' },
    { label: 'QUALIFIED', value: null, hint: 'Analysis not available yet' },
  ]

  const facts: { label: string; value: string }[] = [
    { label: 'Provider Mode', value: job.providerMode === 'live' ? 'Live (Apify)' : 'Test data' },
    {
      label: 'Location',
      value:
        radiusEnforced && job.searchArea.label && job.searchArea.label !== job.params.location
          ? `${job.params.location} (${job.searchArea.label})`
          : job.params.location,
    },
    {
      label: 'Requested Radius',
      value: radiusEnforced ? `${job.params.radius} km` : `${job.params.radius} km (not applied to test data)`,
    },
    { label: 'Businesses Requested', value: String(job.params.maxBusinesses) },
    ...(radiusEnforced && progress.closed
      ? [{ label: 'Permanently Closed', value: `${progress.closed} excluded` }]
      : []),
    ...(radiusEnforced && progress.invalid ? [{ label: 'Invalid', value: `${progress.invalid} records` }] : []),
    ...(job.providerMode === 'live' ? [{ label: 'Discovery Cost', value: costLabel(job.cost, isActiveJob(job)) }] : []),
    ...(job.cost.perNewProspectUsd !== null
      ? [{ label: 'Cost / New Prospect', value: formatUsd(job.cost.perNewProspectUsd) }]
      : []),
  ]

  return (
    <section className="adm-card adm-table-card" aria-labelledby="lf-detail-heading">
      <div className="adm-table-toolbar adm-lf-detail-head">
        <div>
          <div className="adm-lf-detail-title">
            <h2 id="lf-detail-heading" className="adm-section-title">
              {job.params.location}
            </h2>
            <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
          </div>
          <p className="adm-section-desc">
            Job #{shortJobId(job.id)} · {job.params.radius} km · {job.params.categories.join(', ')} · created{' '}
            {dateTimeFormatter.format(new Date(job.createdAt))}
            {job.finishedAt ? ` · finished ${dateTimeFormatter.format(new Date(job.finishedAt))}` : ''}
          </p>
        </div>
        <div className="adm-row-actions">
          {isActiveJob(job) ? (
            <button
              type="button"
              className="adm-btn adm-btn--ghost adm-btn--danger"
              onClick={() => onCancel(job)}
              disabled={cancelling}
            >
              {cancelling ? <Loader2 size={14} className="adm-spin" aria-hidden /> : <Ban size={14} aria-hidden />}
              <span>Cancel search</span>
            </button>
          ) : null}
          <button type="button" className="adm-icon-btn" onClick={onClose} aria-label="Close job details">
            <X size={16} aria-hidden />
          </button>
        </div>
      </div>

      <div className="adm-lf-detail-body">
        <div className="adm-lf-status-row" aria-live="polite">
          {isActiveJob(job) ? <Loader2 size={16} className="adm-spin" aria-hidden /> : null}
          <span>{STATUS_NOTE[job.status]}</span>
        </div>
        <JobProgress job={job} />

        {job.status === 'failed' && job.error ? (
          <div className="adm-alert adm-alert--danger" role="alert">
            <span>{job.error}</span>
          </div>
        ) : null}

        <dl className="adm-lf-stats">
          {stats.map((s) => (
            <div key={s.label} className="adm-lf-stat">
              <dt className="adm-stat-label">{s.label}</dt>
              <dd className="adm-lf-stat-value">{s.value ?? '—'}</dd>
              <dd className="adm-lf-stat-hint">{s.hint}</dd>
            </div>
          ))}
        </dl>

        <dl className="adm-lf-facts">
          {facts.map((f) => (
            <div key={f.label} className="adm-lf-fact">
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {current?.error ? (
        <div className="adm-table-message">
          <div className="adm-alert adm-alert--danger" role="alert">
            <span>{current.error}</span>
            <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setRetryKey((k) => k + 1)}>
              <RefreshCw size={14} aria-hidden />
              <span>Try again</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="adm-table-scroll">
          <table className="adm-table" aria-label="Prospects">
            <thead>
              <tr>
                {COLUMNS.map((c) => (
                  <th key={c} scope="col">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 3 }, (_, i) => (
                    <tr key={i} aria-hidden>
                      {COLUMNS.map((c) => (
                        <td key={c}>
                          <span className="adm-skeleton" />
                        </td>
                      ))}
                    </tr>
                  ))
                : prospects.map((p) => <ProspectRow key={p.id} prospect={p} />)}
            </tbody>
          </table>

          {!loading && prospects.length === 0 ? (
            <div className="adm-empty">
              <Store size={24} aria-hidden />
              <span>{emptyMessage(job)}</span>
            </div>
          ) : null}
        </div>
      )}

      {current?.data ? (
        <Pagination
          page={current.data.page}
          totalPages={current.data.totalPages}
          total={current.data.total}
          label="prospects"
          onChange={setPage}
        />
      ) : null}
    </section>
  )
}

function ProspectRow({ prospect: p }: { prospect: Prospect }) {
  const website = safeHttpUrl(p.website)
  const mapsUrl = safeHttpUrl(p.googleMapsUrl)

  return (
    <tr>
      <td>
        <span className="adm-cell-strong">{p.businessName}</span>
        {mapsUrl ? (
          <a className="adm-cell-sub adm-link" href={mapsUrl} target="_blank" rel="noopener noreferrer nofollow">
            <MapPinned size={12} aria-hidden /> View on map
          </a>
        ) : null}
      </td>
      <td>
        <span className="adm-cell-strong adm-cell-normal">{p.category}</span>
        {p.categories.length > 1 ? (
          <span className="adm-cell-sub">{p.categories.filter((c) => c !== p.category).join(', ')}</span>
        ) : null}
      </td>
      <td className="adm-cell-nowrap">
        {website ? (
          <a className="adm-link adm-inline-link" href={website} target="_blank" rel="noopener noreferrer nofollow">
            <Globe size={14} aria-hidden />
            {displayHost(website)}
            <ExternalLink size={12} aria-hidden />
          </a>
        ) : (
          <StatusBadge tone="warning">No website</StatusBadge>
        )}
      </td>
      <td className="adm-cell-nowrap">{p.phone ?? <span className="adm-muted">Not listed</span>}</td>
      <td>
        <span className="adm-cell-sub adm-cell-sub--wrap adm-lf-address">{p.address ?? '—'}</span>
      </td>
      <td>
        <StatusBadge tone="info">New</StatusBadge>
      </td>
      <td className="adm-cell-nowrap">
        <ProspectAnalysis prospectId={p.id} website={website} summary={p.websiteAnalysis} />
      </td>
      <td className="adm-cell-nowrap">
        <AddToLeads prospect={p} />
      </td>
    </tr>
  )
}

/** Explicitly promotes one prospect into the Lead Workspace; discovery never does this automatically. */
function AddToLeads({ prospect }: { prospect: Prospect }) {
  const [promotedId, setPromotedId] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const leadId = promotedId ?? prospect.salesLeadId

  const promote = async () => {
    setPending(true)
    setError(null)
    try {
      setPromotedId((await promoteProspect(prospect.id)).data.lead.id)
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 401) return
      setError(err instanceof Error ? err.message : 'Could not add this lead.')
    } finally {
      setPending(false)
    }
  }

  if (leadId) {
    return (
      <div className="adm-row-actions">
        <StatusBadge tone="success">
          <Check size={10} aria-hidden /> Added
        </StatusBadge>
        <a className="adm-link adm-inline-link" href={leadWorkspaceUrl(leadId)}>
          Open Lead <ArrowUpRight size={12} aria-hidden />
        </a>
      </div>
    )
  }
  return (
    <div className="adm-row-actions">
      <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={promote} disabled={pending}>
        {pending ? <Loader2 size={14} className="adm-spin" aria-hidden /> : <Plus size={14} aria-hidden />}
        <span>Add to Leads</span>
      </button>
      {error ? (
        <span className="adm-field-error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  )
}
