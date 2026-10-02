import { ChevronDown, ExternalLink, Loader2, PanelRightOpen, RotateCcw, Trash2, TriangleAlert, X } from 'lucide-react'
import { memo } from 'react'
import type { LeadTextInput, SalesLead } from '../../api/leadWorkspace'
import {
  COLUMN_COUNT,
  GRID_COLUMNS,
  NEED_TO_KNOW,
  leadCellText,
  splitList,
  type ColumnKey,
  type GridColumn,
} from './gridModel'
import { displayHost, safeHttpUrl, STATUS_TONE, statusLabel } from './leadFormat'
import { ServicePicker } from './ServicePicker'
import { QualificationBadge } from './AiQualification'
import { AnalysisBadge } from './WebsiteAnalysis'

export type Draft = {
  clientId: string
  values: LeadTextInput
  /** Incremented on every edit, so a save can tell whether the row changed while in flight. */
  rev: number
  dirty: boolean
  state: 'idle' | 'saving' | 'duplicate' | 'invalid' | 'error'
  message?: string
  errors?: Record<string, string>
  existingLeadId?: string
}

export type CellStatus = { state: 'saving' } | { state: 'error'; message: string }
export type RowCellStatus = Partial<Record<ColumnKey, CellStatus>>

export type RowActions = {
  editChange: (value: string) => void
  editBlur: () => void
  editCommit: (move?: 'across' | 'back') => void
  editCancel: () => void
  statusChange: (key: string, status: string) => void
  toggle: (id: string) => void
  open: (id: string) => void
  remove: (key: string) => void
  restore: (id: string) => void
  retry: (key: string) => void
}

type GridRowProps = {
  rowKey: string
  kind: 'lead' | 'draft' | 'ghost'
  lead?: SalesLead
  draft?: Draft
  overrides?: LeadTextInput
  status?: RowCellStatus
  activeCol: number
  editing: { col: number; value: string; query?: string } | null
  selected: boolean
  statuses: string[]
  services: string[]
  actions: RowActions
}

const SOURCE_MARK: Record<string, string> = { AI_DISCOVERY: 'AI', CSV_IMPORT: 'Import' }
const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(' ')

export const GridRow = memo(function GridRow(props: GridRowProps) {
  const { rowKey, kind, lead, draft, actions } = props
  const valueOf = (key: ColumnKey) => {
    if (lead) return props.overrides?.[key] ?? leadCellText(lead, key)
    return draft?.values[key] ?? ''
  }
  const name = valueOf('businessName')
  const rowLabel = name || (kind === 'lead' ? 'lead' : 'new row')
  const showMessage =
    draft?.message && (draft.state === 'duplicate' || draft.state === 'invalid' || draft.state === 'error')

  return (
    <>
      <tr
        className={cx(
          'adm-lw-grid-row',
          `is-${kind}`,
          props.selected && 'is-selected',
          lead?.archived && 'is-archived',
          draft && `is-${draft.state}`,
        )}
      >
        <th scope="row" className="adm-lw-grid-rowhead">
          <span className="adm-lw-rowhead">
            {lead ? (
              <input
                type="checkbox"
                tabIndex={-1}
                aria-label={`Select ${rowLabel}`}
                checked={props.selected}
                onChange={() => actions.toggle(lead.id)}
              />
            ) : (
              <DraftMark draft={draft} />
            )}
            {lead ? (
              <button
                type="button"
                tabIndex={-1}
                className="adm-lw-rowhead-btn"
                title="Open details"
                aria-label={`Open details for ${rowLabel}`}
                onClick={() => actions.open(lead.id)}
              >
                <PanelRightOpen size={14} aria-hidden />
              </button>
            ) : null}
            {lead?.archived ? (
              <button
                type="button"
                tabIndex={-1}
                className="adm-lw-rowhead-btn adm-lw-rowhead-btn--reveal"
                title="Restore lead"
                aria-label={`Restore ${rowLabel}`}
                onClick={() => actions.restore(lead.id)}
              >
                <RotateCcw size={13} aria-hidden />
              </button>
            ) : kind !== 'ghost' ? (
              <button
                type="button"
                tabIndex={-1}
                className="adm-lw-rowhead-btn adm-lw-rowhead-btn--reveal adm-lw-rowhead-btn--danger"
                title={lead ? 'Archive lead' : 'Discard row'}
                aria-label={lead ? `Archive ${rowLabel}` : 'Discard this row'}
                onClick={() => actions.remove(rowKey)}
              >
                {lead ? <Trash2 size={13} aria-hidden /> : <X size={13} aria-hidden />}
              </button>
            ) : null}
          </span>
        </th>

        {GRID_COLUMNS.map((col, c) => {
          const status = props.status?.[col.key]
          const error = status?.state === 'error' ? status.message : draft?.errors?.[col.key]
          const isActive = props.activeCol === c
          const isEditing = props.editing?.col === c
          const value = valueOf(col.key)
          return (
            <td
              key={col.key}
              data-key={rowKey}
              data-col={c}
              className={cx(
                'adm-lw-cell',
                `adm-lw-cell--${col.kind}`,
                `adm-lw-cell--${col.key}`,
                col.key === 'businessName' && 'adm-lw-grid-sticky',
                isActive && 'is-active',
                isEditing && 'is-editing',
                status?.state === 'saving' && 'is-saving',
                error && 'is-error',
              )}
              title={error || undefined}
              aria-invalid={error ? true : undefined}
            >
              {isEditing && props.editing && col.key === 'potentialServices' ? (
                <>
                  <CellView
                    col={col}
                    value={props.editing.value}
                    kind="draft"
                    rowKey={rowKey}
                    rowLabel={rowLabel}
                    statuses={props.statuses}
                    actions={actions}
                  />
                  <ServicePicker
                    value={props.editing.value}
                    services={props.services}
                    initialQuery={props.editing.query}
                    label={`Service needed for ${rowLabel}`}
                    onChange={actions.editChange}
                    onCommit={actions.editCommit}
                    onCancel={actions.editCancel}
                    onClickOutside={actions.editBlur}
                  />
                </>
              ) : isEditing && props.editing ? (
                <input
                  data-grid-editor=""
                  className="adm-lw-cell-input"
                  autoFocus
                  value={props.editing.value}
                  placeholder={col.placeholder}
                  aria-label={`${col.label}, ${rowLabel}`}
                  onFocus={(e) => {
                    const end = e.target.value.length
                    e.target.setSelectionRange(end, end)
                  }}
                  onChange={(e) => actions.editChange(e.target.value)}
                  onBlur={actions.editBlur}
                />
              ) : (
                <CellView
                  col={col}
                  value={value}
                  kind={kind}
                  lead={lead}
                  rowKey={rowKey}
                  rowLabel={rowLabel}
                  statuses={props.statuses}
                  actions={actions}
                />
              )}
              {isActive && !isEditing ? (
                <textarea
                  data-grid-focus=""
                  className="adm-lw-grid-focus"
                  rows={1}
                  value={value}
                  onChange={() => {}}
                  onFocus={(e) => e.target.select()}
                  aria-label={`${col.label}: ${value || 'empty'}. ${rowLabel}.${error ? ` Error: ${error}` : ''}`}
                />
              ) : null}
            </td>
          )
        })}
        <td className="adm-lw-cell adm-lw-cell--analysis">
          {lead ? (
            <button
              type="button"
              tabIndex={-1}
              className="adm-lw-analysis-btn"
              aria-label={`Website analysis for ${rowLabel}`}
              onClick={() => actions.open(lead.id)}
            >
              <AnalysisBadge summary={lead.websiteAnalysis} hasWebsite={Boolean(valueOf('website').trim())} />
            </button>
          ) : null}
        </td>
        <td className="adm-lw-cell adm-lw-cell--analysis">
          {lead ? (
            <button
              type="button"
              tabIndex={-1}
              className="adm-lw-analysis-btn"
              aria-label={`AI qualification for ${rowLabel}`}
              onClick={() => actions.open(lead.id)}
            >
              <QualificationBadge summary={lead.qualification} />
            </button>
          ) : null}
        </td>
      </tr>

      {showMessage && draft ? (
        <tr className={`adm-lw-grid-msg is-${draft.state}`}>
          <td colSpan={COLUMN_COUNT + 3}>
            <span className="adm-lw-grid-msg-body" role={draft.state === 'error' ? 'alert' : undefined}>
              <TriangleAlert size={13} aria-hidden />
              <span>{draft.message}</span>
              {draft.existingLeadId ? (
                <button type="button" className="adm-lw-link-btn" onClick={() => actions.open(draft.existingLeadId!)}>
                  Open existing lead
                </button>
              ) : null}
              {draft.state === 'error' ? (
                <button type="button" className="adm-lw-link-btn" onClick={() => actions.retry(rowKey)}>
                  Retry
                </button>
              ) : null}
              <button type="button" className="adm-lw-link-btn" onClick={() => actions.remove(rowKey)}>
                Discard row
              </button>
            </span>
          </td>
        </tr>
      ) : null}
    </>
  )
})

function DraftMark({ draft }: { draft?: Draft }) {
  if (!draft) return <span className="adm-lw-rowhead-mark" aria-hidden />
  if (draft.state === 'saving') {
    return (
      <span className="adm-lw-rowhead-mark" title="Saving…">
        <Loader2 size={13} className="adm-spin" aria-label="Saving" />
      </span>
    )
  }
  if (draft.state === 'duplicate' || draft.state === 'invalid' || draft.state === 'error') {
    return (
      <span className="adm-lw-rowhead-mark is-warning" title={draft.message}>
        <TriangleAlert size={13} aria-label="Not saved" />
      </span>
    )
  }
  if (draft.dirty && draft.values.businessName?.trim()) {
    return (
      <span className="adm-lw-rowhead-mark" title="Not saved yet — saves when you leave the row">
        <span className="adm-lw-unsaved-dot" aria-label="Not saved yet" />
      </span>
    )
  }
  return <span className="adm-lw-rowhead-mark" aria-hidden />
}

type CellViewProps = {
  col: GridColumn
  value: string
  kind: GridRowProps['kind']
  lead?: SalesLead
  rowKey: string
  rowLabel: string
  statuses: string[]
  actions: RowActions
}

function CellView({ col, value, kind, lead, rowKey, rowLabel, statuses, actions }: CellViewProps) {
  if (kind === 'ghost') return null

  if (col.kind === 'status') {
    const current = value || 'NEW'
    return (
      <select
        tabIndex={-1}
        className={`adm-lw-status-select adm-badge adm-badge--${STATUS_TONE[current] ?? 'neutral'}`}
        aria-label={`Status for ${rowLabel}`}
        value={current}
        onChange={(e) => actions.statusChange(rowKey, e.target.value)}
      >
        {(statuses.includes(current) ? statuses : [current, ...statuses]).map((status) => (
          <option key={status} value={status}>
            {statusLabel(status)}
          </option>
        ))}
      </select>
    )
  }

  if (col.kind === 'list') {
    const items = splitList(value)
    const picker = col.key === 'potentialServices'
    if (items.length === 0) {
      return picker ? (
        <span className="adm-lw-cell-select">
          <span className="adm-lw-cell-placeholder">Select services</span>
          <ChevronDown size={14} aria-hidden className="adm-lw-cell-chevron" />
        </span>
      ) : null
    }
    return (
      <span className={picker ? 'adm-lw-cell-select' : undefined}>
        <span className="adm-lw-cell-chips" title={items.join(', ')}>
          {items.map((item) => (
            <span key={item} className={`adm-tag adm-lw-tag${item === NEED_TO_KNOW ? ' is-unsure' : ''}`}>
              {item}
            </span>
          ))}
        </span>
        {picker ? <ChevronDown size={14} aria-hidden className="adm-lw-cell-chevron" /> : null}
      </span>
    )
  }

  if (col.key === 'businessName') {
    if (!value) return kind === 'draft' ? <span className="adm-lw-cell-placeholder">Business name</span> : null
    const mark = lead ? SOURCE_MARK[lead.source] : undefined
    return (
      <span className="adm-lw-cell-name">
        <span className="adm-lw-cell-text adm-lw-cell-strong">{value}</span>
        {lead?.archived ? <span className="adm-lw-cell-mark is-archived">Archived</span> : null}
        {mark ? <span className={`adm-lw-cell-mark is-${lead!.source.toLowerCase()}`}>{mark}</span> : null}
      </span>
    )
  }

  if (col.key === 'website') {
    const url = lead ? safeHttpUrl(value) : null
    return (
      <span className="adm-lw-cell-link">
        <span className="adm-lw-cell-text">{url ? displayHost(url) : value}</span>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            tabIndex={-1}
            className="adm-lw-cell-open"
            aria-label={`Open ${displayHost(url)} in a new tab`}
          >
            <ExternalLink size={12} aria-hidden />
          </a>
        ) : null}
      </span>
    )
  }

  return <span className="adm-lw-cell-text">{value}</span>
}
