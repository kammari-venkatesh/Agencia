import type { LeadFinderJob } from '../../api/leadFinder'
import { progressPercent } from './jobStatus'

const progressLabel = (job: LeadFinderJob, percent: number | null) => {
  if (job.status === 'queued') return 'Waiting to start'
  if (percent === null) return job.status === 'running' ? 'Discovering businesses…' : 'No businesses processed'
  return `${job.progress.processed} of ${job.progress.discovered} saved`
}

export function JobProgress({ job }: { job: LeadFinderJob }) {
  const percent = progressPercent(job)
  const label = progressLabel(job, percent)
  const indeterminate = job.status === 'running' && percent === null

  return (
    <div className="adm-progress-wrap">
      <div
        className={`adm-progress adm-progress--${job.status}${indeterminate ? ' is-indeterminate' : ''}`}
        role="progressbar"
        aria-label="Search progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent ?? undefined}
        aria-valuetext={label}
      >
        <span className="adm-progress-fill" style={{ width: indeterminate ? undefined : `${percent ?? 0}%` }} />
      </div>
      <span className="adm-progress-label">{label}</span>
    </div>
  )
}
