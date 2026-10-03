import { Loader2, ScanSearch, Sparkles, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import type { BulkOperation, WorkspaceMeta } from '../../api/leadWorkspace'
import { BULK_QUALIFY_MAX } from '../../api/qualification'
import { BULK_ANALYZE_MAX } from '../../api/websiteAnalysis'
import { statusLabel } from './leadFormat'

const OPERATIONS: { value: BulkOperation; label: string }[] = [
  { value: 'status', label: 'Change status' },
  { value: 'addTag', label: 'Add tag' },
  { value: 'removeTag', label: 'Remove tag' },
  { value: 'addService', label: 'Add service' },
  { value: 'removeService', label: 'Remove service' },
  { value: 'assign', label: 'Assign to' },
  { value: 'archive', label: 'Archive' },
  { value: 'unarchive', label: 'Restore from archive' },
]

type BulkActionsProps = {
  count: number
  meta: WorkspaceMeta | null
  busy: boolean
  aiOff: boolean
  onApply: (operation: BulkOperation, value: string | null) => void
  onAnalyze: () => void
  onQualify: () => void
  onClear: () => void
}

export function BulkActions({ count, meta, busy, aiOff, onApply, onAnalyze, onQualify, onClear }: BulkActionsProps) {
  const [operation, setOperation] = useState<BulkOperation>('status')
  const [value, setValue] = useState('')

  const valueOptions: string[] | null =
    operation === 'status'
      ? (meta?.statuses ?? [])
      : operation === 'addService' || operation === 'removeService'
        ? (meta?.services ?? [])
        : null
  const needsText = operation === 'addTag' || operation === 'removeTag'
  const needsAdmin = operation === 'assign'
  const needsValue = valueOptions !== null || needsText
  const ready = !busy && (!needsValue || value.trim() !== '')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!ready) return
    if (operation === 'archive' && !window.confirm(`Archive ${count} selected lead${count === 1 ? '' : 's'}?`)) return
    onApply(operation, needsValue || needsAdmin ? value.trim() || null : null)
  }

  return (
    <form className="adm-lw-bulk" onSubmit={submit} aria-label="Bulk actions">
      <strong className="adm-lw-bulk-count">{count} selected</strong>
      <select
        className="adm-select adm-lw-select"
        aria-label="Bulk action"
        value={operation}
        onChange={(e) => {
          setOperation(e.target.value as BulkOperation)
          setValue('')
        }}
      >
        {OPERATIONS.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
      {valueOptions ? (
        <select
          className="adm-select adm-lw-select"
          aria-label="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          <option value="">Choose…</option>
          {valueOptions.map((v) => (
            <option key={v} value={v}>
              {operation === 'status' ? statusLabel(v) : v}
            </option>
          ))}
        </select>
      ) : null}
      {needsText ? (
        <label className="adm-input-wrap adm-lw-bulk-input">
          <span className="adm-visually-hidden">Tag</span>
          <input
            className="adm-input"
            value={value}
            maxLength={meta?.limits.tagMaxLength ?? 40}
            placeholder="Tag name"
            onChange={(e) => setValue(e.target.value)}
          />
        </label>
      ) : null}
      {needsAdmin ? (
        <select
          className="adm-select adm-lw-select"
          aria-label="Admin"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          <option value="">Unassigned</option>
          {(meta?.admins ?? []).map((admin) => (
            <option key={admin.id} value={admin.id}>
              {admin.email}
            </option>
          ))}
        </select>
      ) : null}
      <button type="submit" className="adm-btn adm-btn--primary adm-btn--sm" disabled={!ready}>
        {busy ? <Loader2 size={14} className="adm-spin" aria-hidden /> : null}
        <span>Apply</span>
      </button>
      <button
        type="button"
        className="adm-btn adm-btn--ghost adm-btn--sm"
        onClick={onAnalyze}
        disabled={busy || count > BULK_ANALYZE_MAX}
        title={
          count > BULK_ANALYZE_MAX
            ? `Select up to ${BULK_ANALYZE_MAX} leads to analyze at once`
            : 'Check the websites of the selected leads'
        }
      >
        <ScanSearch size={14} aria-hidden />
        <span>Analyze websites</span>
      </button>
      <button
        type="button"
        className="adm-btn adm-btn--ghost adm-btn--sm"
        onClick={onQualify}
        disabled={busy || aiOff || count > BULK_QUALIFY_MAX}
        title={
          aiOff
            ? 'AI qualification is turned off on this server'
            : count > BULK_QUALIFY_MAX
              ? `Select up to ${BULK_QUALIFY_MAX} leads to qualify at once`
              : 'Run AI qualification for the selected leads (uses the AI budget)'
        }
      >
        <Sparkles size={14} aria-hidden />
        <span>Qualify with AI</span>
      </button>
      <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={onClear} disabled={busy}>
        <X size={12} aria-hidden />
        <span>Clear selection</span>
      </button>
    </form>
  )
}
