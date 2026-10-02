import { FlaskConical, Radar, TriangleAlert } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiRequestError } from '../api/client'
import {
  cancelLeadFinderJob,
  formatUsd,
  getLeadFinderJob,
  getUsageSummary,
  listLeadFinderJobs,
  type LeadFinderJob,
  type SearchProvider,
  type UsageSummary,
} from '../api/leadFinder'
import { AdminShell } from '../components/AdminShell'
import { StatusBadge } from '../components/StatusBadge'
import { usePolling } from '../hooks/usePolling'
import { useProviderStatus } from '../hooks/useProviderStatus'
import { JobDetail } from './leadFinder/JobDetail'
import { JobsTable, type JobsState } from './leadFinder/JobsTable'
import { isActiveJob, POLL_INTERVAL_MS, REAL_SEARCH_UNAVAILABLE_COPY, shortJobId } from './leadFinder/jobStatus'
import { SearchForm } from './leadFinder/SearchForm'

const JOBS_PER_PAGE = 10

const errorMessage = (err: unknown, fallback: string) => (err instanceof Error ? err.message : fallback)
const isUnauthorized = (err: unknown) => err instanceof ApiRequestError && err.status === 401

type LeadFinderMode = 'discover' | 'jobs'

/** Active searches, and finished ones whose final cost is still being settled. */
const needsRefresh = (job: LeadFinderJob) => isActiveJob(job) || job.cost.status === 'pending'

const spendLine = ({ today }: UsageSummary) => {
  const spent = `Spent today: ${formatUsd(today.spentUsd)}`
  const reserved = today.reservedUsd > 0 ? ` (up to ${formatUsd(today.reservedUsd)} more for searches in progress)` : ''
  const budget = today.budgetUsd === null ? '' : ` of ${formatUsd(today.budgetUsd)} daily budget`
  return `${spent}${budget}${reserved}. Days reset at 00:00 UTC.`
}

const MODE_COPY: Record<LeadFinderMode, { title: string; description: string }> = {
  discover: {
    title: 'Discover',
    description: 'Discover local businesses and collect them as prospects for review.',
  },
  jobs: {
    title: 'Jobs',
    description: 'Every Lead Finder search, its progress and the prospects it found.',
  },
}

export function LeadFinderView({ mode = 'discover' }: { mode?: LeadFinderMode }) {
  const [jobsPage, setJobsPage] = useState(1)
  const [jobsState, setJobsState] = useState<JobsState>({ status: 'loading' })
  const [reloadKey, setReloadKey] = useState(0)
  const [selected, setSelected] = useState<LeadFinderJob | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [pollError, setPollError] = useState<string | null>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const realSearch = useProviderStatus()?.providers.apify ?? null
  const realAvailable = realSearch?.available === true
  const [searchMode, setSearchMode] = useState<SearchProvider>('test')
  const live = searchMode === 'apify' && realAvailable
  const [usage, setUsage] = useState<UsageSummary | null>(null)
  const unsettledJobCount = (jobsState.status === 'ready' ? jobsState.data.items : []).filter(needsRefresh).length

  // Refreshed when searches start, finish or have their final cost settled, since that is when spend changes.
  useEffect(() => {
    if (!realAvailable) return
    const controller = new AbortController()
    getUsageSummary(controller.signal)
      .then((res) => setUsage(res.data))
      .catch(() => {})
    return () => controller.abort()
  }, [realAvailable, reloadKey, unsettledJobCount])

  useEffect(() => {
    const controller = new AbortController()
    listLeadFinderJobs(jobsPage, JOBS_PER_PAGE, controller.signal)
      .then((res) => setJobsState({ status: 'ready', data: res.data }))
      .catch((err: unknown) => {
        if (controller.signal.aborted || isUnauthorized(err)) return
        setJobsState({
          status: 'error',
          message: errorMessage(err, 'Failed to load searches.'),
        })
      })
    return () => controller.abort()
  }, [jobsPage, reloadKey])

  // Deep link from the Lead Workspace: ?job=<id> opens that job's prospects.
  useEffect(() => {
    const jobId = new URLSearchParams(window.location.search).get('job')
    if (!jobId) return
    const controller = new AbortController()
    getLeadFinderJob(jobId, controller.signal)
      .then((res) => {
        setSelected(res.data)
        requestAnimationFrame(() => detailRef.current?.scrollIntoView({ block: 'start' }))
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted || isUnauthorized(err)) return
        setActionError(errorMessage(err, 'Could not open that search.'))
      })
    return () => controller.abort()
  }, [])

  /** Applies a fresh copy of a job from the server everywhere it is shown. */
  const applyJob = useCallback((job: LeadFinderJob) => {
    setJobsState((state) =>
      state.status === 'ready'
        ? {
            ...state,
            data: {
              ...state.data,
              items: state.data.items.map((j) => (j.id === job.id ? job : j)),
            },
          }
        : state,
    )
    setSelected((current) => (current?.id === job.id ? job : current))
  }, [])

  const listedJobs = jobsState.status === 'ready' ? jobsState.data.items : []
  const shouldPoll = listedJobs.some(needsRefresh) || (selected !== null && needsRefresh(selected))

  usePolling(
    async (signal) => {
      try {
        const list = await listLeadFinderJobs(jobsPage, JOBS_PER_PAGE, signal)
        setJobsState({ status: 'ready', data: list.data })
        const listedSelected = selected && list.data.items.find((j) => j.id === selected.id)
        if (listedSelected) {
          applyJob(listedSelected)
        } else if (selected && needsRefresh(selected)) {
          applyJob((await getLeadFinderJob(selected.id, signal)).data)
        }
        setPollError(null)
      } catch (err) {
        if (signal.aborted || isUnauthorized(err)) return
        setPollError(errorMessage(err, 'Could not refresh search status.'))
      }
    },
    shouldPoll,
    POLL_INTERVAL_MS,
  )

  const showJob = (job: LeadFinderJob) => {
    setSelected(job)
    setActionError(null)
    requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const onCreated = (job: LeadFinderJob) => {
    setJobsState((state) =>
      state.status === 'ready' && jobsPage === 1
        ? {
            ...state,
            data: {
              ...state.data,
              items: [job, ...state.data.items.filter((j) => j.id !== job.id)].slice(0, JOBS_PER_PAGE),
              total: state.data.total + 1,
            },
          }
        : state,
    )
    setJobsPage(1)
    setReloadKey((k) => k + 1)
    showJob(job)
  }

  const onCancel = async (job: LeadFinderJob) => {
    if (!window.confirm(`Cancel the search for "${job.params.location}" (#${shortJobId(job.id)})?`)) return
    setCancellingId(job.id)
    setActionError(null)
    try {
      applyJob((await cancelLeadFinderJob(job.id)).data)
    } catch (err) {
      if (isUnauthorized(err)) return
      setActionError(errorMessage(err, 'Could not cancel the search.'))
      // The job may have finished in the meantime; show its real status.
      getLeadFinderJob(job.id).then(
        (res) => applyJob(res.data),
        () => {},
      )
    } finally {
      setCancellingId(null)
    }
  }

  const changeJobsPage = (page: number) => {
    setJobsState({ status: 'loading' })
    setJobsPage(page)
  }

  const retryJobs = () => {
    setJobsState({ status: 'loading' })
    setReloadKey((k) => k + 1)
  }

  return (
    <AdminShell
      title={`AI Lead Finder · ${MODE_COPY[mode].title}`}
      description={MODE_COPY[mode].description}
      actions={
        mode === 'discover' && live ? (
          <StatusBadge tone="accent">REAL APIFY</StatusBadge>
        ) : (
          <StatusBadge tone="info">TEST MODE</StatusBadge>
        )
      }
    >
      {mode === 'discover' ? (
        <>
          {live ? (
            <section className="adm-card adm-notice adm-notice--real">
              <Radar size={24} aria-hidden className="adm-notice-icon" />
              <div>
                <h2 className="adm-section-title">REAL APIFY</h2>
                <p className="adm-section-desc">
                  Uses Apify credits and real business data. Searches look up real businesses from public map listings
                  within the chosen radius and save them as prospects in the main database, so start with a small number
                  of businesses.
                </p>
                {usage ? <p className="adm-section-desc adm-spend-line">{spendLine(usage)}</p> : null}
              </div>
            </section>
          ) : (
            <section className="adm-card adm-notice">
              <FlaskConical size={24} aria-hidden className="adm-notice-icon" />
              <div>
                <h2 className="adm-section-title">TEST MODE</h2>
                <p className="adm-section-desc">
                  Using built-in test data. No Apify credits are used. Searches run through the real job pipeline, but
                  businesses come from a fixed local dataset (with .example websites) and the radius is not applied. Use
                  the location “Simulate Failure” to see how a failed search looks.
                </p>
                {realSearch && !realAvailable ? (
                  <p className="adm-section-desc adm-lf-real-off">
                    <TriangleAlert size={14} aria-hidden />{' '}
                    {REAL_SEARCH_UNAVAILABLE_COPY[realSearch.unavailableReason ?? ''] ??
                      'Real Apify search is not available.'}
                  </p>
                ) : null}
              </div>
            </section>
          )}

          <SearchForm onCreated={onCreated} mode={searchMode} onModeChange={setSearchMode} realSearch={realSearch} />
        </>
      ) : null}

      {actionError ? (
        <div className="adm-alert adm-alert--danger" role="alert">
          <span>{actionError}</span>
          <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setActionError(null)}>
            Dismiss
          </button>
        </div>
      ) : null}

      {pollError ? (
        <div className="adm-alert adm-alert--warning" role="status">
          <span>Live updates interrupted: {pollError} Retrying automatically.</span>
        </div>
      ) : null}

      <JobsTable
        state={jobsState}
        selectedId={selected?.id ?? null}
        cancellingId={cancellingId}
        onSelect={showJob}
        onCancel={onCancel}
        onPageChange={changeJobsPage}
        onRetry={retryJobs}
      />

      <div ref={detailRef} className="adm-scroll-anchor">
        {selected ? (
          <JobDetail
            key={selected.id}
            job={selected}
            cancelling={cancellingId === selected.id}
            onCancel={onCancel}
            onClose={() => setSelected(null)}
          />
        ) : null}
      </div>
    </AdminShell>
  )
}
