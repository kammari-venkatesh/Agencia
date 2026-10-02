import { ArrowLeft, CheckCircle2, ClipboardPaste, FileUp, Loader2, RefreshCw, Upload } from 'lucide-react'
import { useState } from 'react'
import {
  previewLeadImport,
  runLeadImport,
  type ColumnMapping,
  type ImportPreview as ImportPreviewData,
  type ImportRequest,
  type ImportSummary,
  type WorkspaceMeta,
} from '../../api/leadWorkspace'
import { leadWorkspaceUrl } from '../../paths'
import { ColumnMapper } from './ColumnMapper'
import { CsvImport } from './CsvImport'
import { Dialog } from './Dialog'
import { ImportPreview } from './ImportPreview'
import { mappingProblems } from './importMapping'
import { errorMessage, isUnauthorized, matchLabel } from './leadFormat'
import { PasteImport } from './PasteImport'

type Method = 'paste' | 'csv'
type Step = 'choose' | 'input' | 'map' | 'result'

type LeadImportModalProps = {
  meta: WorkspaceMeta | null
  onClose: () => void
  onImported: (summary: ImportSummary) => void
}

const DEFAULT_MAX_CONTENT = 2_000_000

export function LeadImportModal({ meta, onClose, onImported }: LeadImportModalProps) {
  const [step, setStep] = useState<Step>('choose')
  const [method, setMethod] = useState<Method>('paste')
  const [pasted, setPasted] = useState('')
  const [file, setFile] = useState<{ name: string; size: number; content: string } | null>(null)
  const [preview, setPreview] = useState<ImportPreviewData | null>(null)
  const [mapping, setMapping] = useState<ColumnMapping[]>([])
  const [stale, setStale] = useState(false)
  const [duplicateMode, setDuplicateMode] = useState<'skip' | 'update'>('skip')
  const [busy, setBusy] = useState<'preview' | 'import' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<ImportSummary | null>(null)

  const maxContent = meta?.limits.maxContentLength ?? DEFAULT_MAX_CONTENT
  const content = method === 'paste' ? pasted : (file?.content ?? '')
  const baseRequest: ImportRequest = {
    content,
    method,
    ...(method === 'csv' && file ? { fileName: file.name } : {}),
  }
  const problems = preview ? mappingProblems(mapping) : []

  const runPreview = async (request: ImportRequest, nextStep: Step = 'map') => {
    setBusy('preview')
    setError(null)
    try {
      const { data } = await previewLeadImport(request)
      setPreview(data)
      setMapping(data.mapping)
      setStale(false)
      setStep(nextStep)
    } catch (err) {
      if (!isUnauthorized(err)) setError(errorMessage(err, 'Could not read that data.'))
    } finally {
      setBusy(null)
    }
  }

  const runImport = async () => {
    if (!preview) return
    setBusy('import')
    setError(null)
    try {
      const { data } = await runLeadImport({ ...baseRequest, hasHeader: preview.hasHeader, mapping, duplicateMode })
      setSummary(data)
      setStep('result')
      onImported(data)
    } catch (err) {
      if (!isUnauthorized(err)) setError(errorMessage(err, 'The import failed. No rows were changed.'))
    } finally {
      setBusy(null)
    }
  }

  const close = () => {
    if (busy === 'import') return
    if (step !== 'result' && content && !window.confirm('Close the import? Your pasted data will be discarded.')) return
    onClose()
  }

  const contentTooLarge = content.length > maxContent
  const titles: Record<Step, string> = {
    choose: 'Import leads',
    input: method === 'paste' ? 'Paste from spreadsheet' : 'Upload CSV',
    map: 'Map columns and preview',
    result: 'Import complete',
  }
  const descriptions: Record<Step, string> = {
    choose: 'Bring existing leads into the workspace. You will review everything before it is saved.',
    input:
      method === 'paste'
        ? 'Select the cells in Google Sheets or Excel (including headers), copy, and paste them below.'
        : 'Upload a CSV exported from a spreadsheet or another CRM.',
    map: 'Check how each column will be imported. Unmatched columns are kept as custom fields.',
    result: 'Every row is accounted for below.',
  }

  const footer = (() => {
    if (step === 'choose') return null
    if (step === 'input') {
      return (
        <>
          <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setStep('choose')}>
            <ArrowLeft size={14} aria-hidden /> <span>Back</span>
          </button>
          <button
            type="button"
            className="adm-btn adm-btn--primary adm-btn--sm"
            disabled={!content.trim() || contentTooLarge || busy !== null}
            onClick={() => runPreview({ ...baseRequest, hasHeader: 'auto' })}
          >
            {busy === 'preview' ? <Loader2 size={14} className="adm-spin" aria-hidden /> : null}
            <span>Preview</span>
          </button>
        </>
      )
    }
    if (step === 'map') {
      const canImport = !stale && problems.length === 0 && preview?.analysis && busy === null
      const newRows = preview?.analysis?.newRows ?? 0
      const importLabel =
        duplicateMode === 'update'
          ? 'Import and update duplicates'
          : `Import ${newRows.toLocaleString()} new ${newRows === 1 ? 'lead' : 'leads'}`
      return (
        <>
          <button
            type="button"
            className="adm-btn adm-btn--ghost adm-btn--sm"
            disabled={busy !== null}
            onClick={() => setStep('input')}
          >
            <ArrowLeft size={14} aria-hidden /> <span>Back</span>
          </button>
          <button
            type="button"
            className="adm-btn adm-btn--ghost adm-btn--sm"
            disabled={busy !== null || problems.length > 0}
            onClick={() =>
              runPreview({ ...baseRequest, hasHeader: preview?.hasHeader ?? 'auto', mapping, duplicateMode })
            }
          >
            {busy === 'preview' ? (
              <Loader2 size={14} className="adm-spin" aria-hidden />
            ) : (
              <RefreshCw size={14} aria-hidden />
            )}
            <span>Refresh preview</span>
          </button>
          <button
            type="button"
            className="adm-btn adm-btn--primary adm-btn--sm"
            disabled={!canImport}
            onClick={runImport}
          >
            {busy === 'import' ? (
              <Loader2 size={14} className="adm-spin" aria-hidden />
            ) : (
              <Upload size={14} aria-hidden />
            )}
            <span>{importLabel}</span>
          </button>
        </>
      )
    }
    return (
      <button type="button" className="adm-btn adm-btn--primary adm-btn--sm" onClick={onClose}>
        Done
      </button>
    )
  })()

  return (
    <Dialog title={titles[step]} description={descriptions[step]} onClose={close} footer={footer}>
      {error ? (
        <div className="adm-alert adm-alert--danger" role="alert">
          <span>{error}</span>
        </div>
      ) : null}

      {step === 'choose' ? (
        <div className="adm-lw-choice-grid">
          <button
            type="button"
            className="adm-lw-choice"
            onClick={() => {
              setMethod('paste')
              setStep('input')
            }}
          >
            <ClipboardPaste size={22} aria-hidden />
            <strong>Paste from Spreadsheet</strong>
            <span className="adm-muted">Copy rows from Google Sheets or Excel and paste them.</span>
          </button>
          <button
            type="button"
            className="adm-lw-choice"
            onClick={() => {
              setMethod('csv')
              setStep('input')
            }}
          >
            <FileUp size={22} aria-hidden />
            <strong>Upload CSV</strong>
            <span className="adm-muted">Use a .csv file exported from a spreadsheet or CRM.</span>
          </button>
        </div>
      ) : null}

      {step === 'input' && method === 'paste' ? (
        <PasteImport value={pasted} maxLength={maxContent} onChange={setPasted} />
      ) : null}
      {step === 'input' && method === 'csv' ? <CsvImport file={file} maxBytes={maxContent} onLoaded={setFile} /> : null}

      {step === 'map' && preview ? (
        <>
          <ColumnMapper
            preview={preview}
            mapping={mapping}
            fields={meta?.fields ?? []}
            duplicateMode={duplicateMode}
            disabled={busy !== null}
            onMappingChange={(next) => {
              setMapping(next)
              setStale(true)
            }}
            onHeaderChange={(hasHeader) => runPreview({ ...baseRequest, hasHeader })}
            onDuplicateModeChange={setDuplicateMode}
          />
          {problems.length ? (
            <ul className="adm-lw-problems" role="alert">
              {problems.map((problem) => (
                <li key={problem}>{problem}</li>
              ))}
            </ul>
          ) : null}
          <ImportPreview preview={preview} stale={stale} />
        </>
      ) : null}

      {step === 'result' && summary ? <ImportResult summary={summary} /> : null}
    </Dialog>
  )
}

function ImportResult({ summary }: { summary: ImportSummary }) {
  const counts: [string, number, string][] = [
    ['Inserted', summary.inserted, 'is-new'],
    ['Updated', summary.updated, 'is-duplicate'],
    ['Skipped', summary.skipped, ''],
    ['Duplicates', summary.duplicates, 'is-duplicate'],
    ['Errors', summary.errorCount, 'is-error'],
  ]
  return (
    <div className="adm-lw-result">
      <p className="adm-lw-result-head">
        <CheckCircle2 size={18} aria-hidden /> Processed {summary.totalRows.toLocaleString()}{' '}
        {summary.totalRows === 1 ? 'row' : 'rows'}.
      </p>
      <div className="adm-lw-preview-stats">
        {counts.map(([label, value, className]) => (
          <span key={label} className={`adm-lw-pill ${className}`}>
            <strong>{value.toLocaleString()}</strong> {label.toLowerCase()}
          </span>
        ))}
      </div>
      {summary.errors.length ? (
        <details className="adm-lw-issues" open>
          <summary>Rows not imported because of errors</summary>
          <ul>
            {summary.errors.map((e) => (
              <li key={e.row}>
                Row {e.row}: {e.message}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
      {summary.duplicateRows.length ? (
        <details className="adm-lw-issues">
          <summary>Duplicate rows ({summary.duplicateRows.length})</summary>
          <ul>
            {summary.duplicateRows.map((d) => (
              <li key={d.row}>
                Row {d.row} {d.action} —{' '}
                {d.existingLead ? (
                  <a className="adm-link" href={leadWorkspaceUrl(d.existingLead.id)}>
                    {d.existingLead.businessName}
                  </a>
                ) : (
                  `repeats row ${d.duplicateOfRow}`
                )}{' '}
                ({matchLabel(d.matchedOn)})
              </li>
            ))}
          </ul>
        </details>
      ) : null}
      {summary.warnings.length ? (
        <details className="adm-lw-issues">
          <summary>Warnings ({summary.warnings.length})</summary>
          <ul>
            {summary.warnings.map((w, i) => (
              <li key={`${w.row}-${i}`}>
                Row {w.row}: {w.message}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  )
}
