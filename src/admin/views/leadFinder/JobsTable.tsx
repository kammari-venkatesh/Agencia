import { Ban, Eye, History, Loader2, RefreshCw } from 'lucide-react'
import type { LeadFinderJob, Paginated } from '../../api/leadFinder'
import { Pagination } from '../../components/Pagination'
import { StatusBadge } from '../../components/StatusBadge'
import { JobProgress } from './JobProgress'
import { ProviderBadge } from './ProviderBadge'
import { dateTimeFormatter, isActiveJob, shortJobId, STATUS_META } from './jobStatus'

export type JobsState =
  { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; data: Paginated<LeadFinderJob> }

type JobsTableProps = {
  state: JobsState
  selectedId: string | null
  cancellingId: string | null
  onSelect: (job: LeadFinderJob) => void
  onCancel: (job: LeadFinderJob) => void
  onPageChange: (page: number) => void
  onRetry: () => void
}

const COLUMNS = ['Job', 'Location', 'Categories', 'Status', 'Progress', 'Created', 'Actions']

export function JobsTable({
  state,
  selectedId,
  cancellingId,
  onSelect,
  onCancel,
  onPageChange,
  onRetry,
}: JobsTableProps) {
  const jobs = state.status === 'ready' ? state.data.items : []

  return (
    <section className="adm-card adm-table-card" aria-labelledby="lf-jobs-heading">
      <div className="adm-table-toolbar">
        <div>
          <h2 id="lf-jobs-heading" className="adm-section-title">
            Job history
          </h2>
          <p className="adm-section-desc">Active searches update automatically.</p>
        </div>
      </div>

      {state.status === 'error' ? (
        <div className="adm-table-message">
          <div className="adm-alert adm-alert--danger" role="alert">
            <span>{state.message}</span>
            <button type="button" className="adm-btn adm-btn--ghost" onClick={onRetry}>
              <RefreshCw size={14} aria-hidden />
              <span>Try again</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="adm-table-scroll">
          <table className="adm-table">
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
              {state.status === 'loading'
                ? Array.from({ length: 3 }, (_, i) => (
                    <tr key={i} aria-hidden>
                      {COLUMNS.map((c) => (
                        <td key={c}>
                          <span className="adm-skeleton" />
                        </td>
                      ))}
                    </tr>
                  ))
                : jobs.map((job) => {
                    const meta = STATUS_META[job.status]
                    const selected = job.id === selectedId
                    return (
                      <tr key={job.id} className={selected ? 'is-selected' : undefined}>
                        <td className="adm-cell-nowrap">
                          <span className="adm-cell-strong adm-mono">#{shortJobId(job.id)}</span>
                          <span className="adm-cell-sub">
                            <ProviderBadge provider={job.provider} />
                          </span>
                        </td>
                        <td>
                          <span className="adm-cell-strong">{job.params.location}</span>
                          <span className="adm-cell-sub">
                            {job.params.radius} km · up to {job.params.maxBusinesses}
                          </span>
                        </td>
                        <td>
                          <div className="adm-tag-list">
                            {job.params.categories.map((c) => (
                              <span key={c} className="adm-tag">
                                {c}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                        </td>
                        <td className="adm-lf-progress-cell">
                          <JobProgress job={job} />
                        </td>
                        <td className="adm-cell-nowrap">{dateTimeFormatter.format(new Date(job.createdAt))}</td>
                        <td>
                          <div className="adm-row-actions">
                            <button
                              type="button"
                              className="adm-btn adm-btn--ghost adm-btn--sm"
                              onClick={() => onSelect(job)}
                              aria-pressed={selected}
                            >
                              <Eye size={14} aria-hidden />
                              <span>View Prospects</span>
                            </button>
                            {isActiveJob(job) ? (
                              <button
                                type="button"
                                className="adm-btn adm-btn--ghost adm-btn--sm adm-btn--danger"
                                onClick={() => onCancel(job)}
                                disabled={cancellingId === job.id}
                              >
                                {cancellingId === job.id ? (
                                  <Loader2 size={14} className="adm-spin" aria-hidden />
                                ) : (
                                  <Ban size={14} aria-hidden />
                                )}
                                <span>Cancel</span>
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
            </tbody>
          </table>

          {state.status === 'ready' && jobs.length === 0 ? (
            <div className="adm-empty">
              <History size={24} aria-hidden />
              <span>No searches yet. Start one above.</span>
            </div>
          ) : null}
        </div>
      )}

      {state.status === 'ready' ? (
        <Pagination
          page={state.data.page}
          totalPages={state.data.totalPages}
          total={state.data.total}
          label="jobs"
          onChange={onPageChange}
        />
      ) : null}
    </section>
  )
}
