import { AlertTriangle, CheckCircle2, Copy, XCircle } from 'lucide-react'
import type { ImportPreview as ImportPreviewData, PreviewRow } from '../../api/leadWorkspace'
import { leadWorkspaceUrl } from '../../paths'
import { matchLabel } from './leadFormat'

const ROW_STATUS = {
  new: { label: 'New', icon: CheckCircle2, className: 'is-new' },
  duplicate: { label: 'Duplicate', icon: Copy, className: 'is-duplicate' },
  error: { label: 'Error', icon: XCircle, className: 'is-error' },
} as const

const text = (value: string | string[] | undefined) => (Array.isArray(value) ? value.join(', ') : (value ?? ''))

function rowNote(row: PreviewRow) {
  if (row.status === 'error') return row.message
  if (row.status === 'duplicate') {
    const reason = matchLabel(row.matchedOn)
    if (row.existingLead) {
      return (
        <>
          Matches{' '}
          <a
            className="adm-link"
            href={leadWorkspaceUrl(row.existingLead.id)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {row.existingLead.businessName}
          </a>
          {row.existingLead.archived ? ' (archived)' : ''} · {reason}
        </>
      )
    }
    return `Repeats row ${row.duplicateOfRow} · ${reason}`
  }
  return row.warnings.length ? row.warnings.join(' ') : null
}

function PreviewRows({ rows }: { rows: PreviewRow[] }) {
  return (
    <div className="adm-lw-table-scroll adm-lw-preview-scroll">
      <table className="adm-table adm-lw-preview-table">
        <thead>
          <tr>
            <th scope="col">Row</th>
            <th scope="col">Result</th>
            <th scope="col">Business</th>
            <th scope="col">Phone</th>
            <th scope="col">Website</th>
            <th scope="col">City</th>
            <th scope="col">Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const meta = ROW_STATUS[row.status]
            const Icon = meta.icon
            return (
              <tr key={row.row}>
                <td className="adm-mono">{row.row}</td>
                <td className="adm-cell-nowrap">
                  <span className={`adm-lw-row-status ${meta.className}`}>
                    <Icon size={12} aria-hidden /> {meta.label}
                  </span>
                </td>
                <td>{text(row.values?.businessName) || <span className="adm-muted">—</span>}</td>
                <td className="adm-cell-nowrap">{text(row.values?.phone)}</td>
                <td className="adm-cell-nowrap">{text(row.values?.website)}</td>
                <td>{text(row.values?.city)}</td>
                <td className="adm-lw-preview-note">
                  {rowNote(row)}
                  {row.status !== 'new' && row.warnings.length ? (
                    <span className="adm-cell-sub adm-cell-sub--wrap">{row.warnings.join(' ')}</span>
                  ) : null}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function ImportPreview({ preview, stale }: { preview: ImportPreviewData; stale: boolean }) {
  const { analysis } = preview
  if (!analysis) return null
  const sampleRowNumbers = new Set(analysis.rows.map((r) => r.row))
  const otherIssues = analysis.issues.filter((r) => !sampleRowNumbers.has(r.row))

  return (
    <div className={`adm-lw-preview ${stale ? 'is-stale' : ''}`}>
      <div className="adm-lw-preview-stats" aria-live="polite">
        <span className="adm-lw-pill is-new">
          <strong>{analysis.newRows.toLocaleString()}</strong> new
        </span>
        <span className="adm-lw-pill is-duplicate">
          <strong>{analysis.duplicates.toLocaleString()}</strong> duplicates
        </span>
        <span className="adm-lw-pill is-error">
          <strong>{analysis.errors.toLocaleString()}</strong> errors
        </span>
        {analysis.warnings ? (
          <span className="adm-lw-pill">
            <AlertTriangle size={12} aria-hidden /> <strong>{analysis.warnings.toLocaleString()}</strong> warnings
          </span>
        ) : null}
        {stale ? <span className="adm-muted">Mapping changed — refresh the preview before importing.</span> : null}
      </div>

      {preview.warnings.length ? (
        <ul className="adm-lw-warning-list">
          {preview.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      ) : null}

      <p className="adm-lw-hint adm-muted">
        First {analysis.rows.length} of {preview.rowCount.toLocaleString()} rows. Nothing is saved until you import.
      </p>
      <PreviewRows rows={analysis.rows} />

      {otherIssues.length ? (
        <details className="adm-lw-issues">
          <summary>
            {otherIssues.length} more duplicate or error {otherIssues.length === 1 ? 'row' : 'rows'} further down
          </summary>
          <PreviewRows rows={otherIssues} />
        </details>
      ) : null}
    </div>
  )
}
