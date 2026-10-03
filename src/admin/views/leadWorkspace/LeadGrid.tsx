import { ArrowDown, ArrowUp, ArrowUpDown, Check, Loader2, Plus, TriangleAlert } from 'lucide-react'
import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type Ref,
} from 'react'
import {
  createSalesLeadsBatch,
  updateSalesLead,
  type BatchRowResult,
  type LeadFieldKey,
  type LeadQuery,
  type LeadTextInput,
  type Pagination as PaginationInfo,
  type SalesLead,
} from '../../api/leadWorkspace'
import { Pagination } from '../../components/Pagination'
import { GridRow, type CellStatus, type Draft, type RowActions, type RowCellStatus } from './GridRow'
import {
  COLUMN_COUNT,
  detectHeader,
  GRID_COLUMNS,
  leadCellText,
  parseClipboardTable,
  type ColumnKey,
} from './gridModel'
import { errorMessage, fieldErrors, isUnauthorized, matchLabel, PAGE_SIZES } from './leadFormat'

const MIN_ROWS = 5
const SKELETON_ROWS = 6
const MAX_PASTE_ROWS = 1000
const BATCH_SIZE = 500
const PATCH_CONCURRENCY = 4
const ADD_ROW = '__add'
const GHOST_PREFIX = '__ghost:'
const STATUS_COL = GRID_COLUMNS.findIndex((c) => c.key === 'status')
const COLUMN_KEYS = new Set<string>(GRID_COLUMNS.map((c) => c.key))
const ROW_HEAD_WIDTH = 84
const ANALYSIS_WIDTH = 150
const QUALIFICATION_WIDTH = 160
const TABLE_WIDTH = GRID_COLUMNS.reduce(
  (sum, c) => sum + c.width,
  ROW_HEAD_WIDTH + ANALYSIS_WIDTH + QUALIFICATION_WIDTH,
)

type Active = { key: string; col: number }
type Editing = { key: string; col: number; value: string; query?: string }
type Task = () => Promise<void>
type RowRef =
  | { kind: 'lead'; lead: SalesLead }
  | { kind: 'draft'; draft: Draft }
  | { kind: 'ghost'; index: number }
  | { kind: 'add' }
type SaveSummary = { created: number; duplicates: number; invalid: number; failed: number }

export type LeadGridHandle = { addRow: () => void }

type LeadGridProps = {
  ref?: Ref<LeadGridHandle>
  rows: SalesLead[]
  pagination: PaginationInfo | null
  initialLoading: boolean
  loading: boolean
  error: string | null
  filtered: boolean
  query: LeadQuery
  statuses: string[]
  services: string[]
  aiOff: boolean
  selected: Set<string>
  onSort: (sortBy: string) => void
  onToggle: (id: string) => void
  onToggleAll: (checked: boolean) => void
  onOpen: (id: string) => void
  onPage: (page: number) => void
  onPageSize: (limit: number) => void
  onRetry: () => void
  onClearFilters: () => void
  onLeadSaved: (lead: SalesLead) => void
  onLeadsCreated: (leads: SalesLead[]) => void
  onArchive: (lead: SalesLead) => void
  onRestore: (lead: SalesLead) => void
  onNotify: (tone: 'success' | 'danger', text: string) => void
}

let draftCounter = 0
const newDraft = (values: LeadTextInput = {}): Draft => ({
  clientId: `draft-${Date.now().toString(36)}-${++draftCounter}`,
  values,
  rev: 0,
  dirty: true,
  state: 'idle',
})
const hasName = (draft: Draft) => Boolean(draft.values.businessName?.trim())
const isBlank = (draft: Draft) => !Object.values(draft.values).some((v) => v?.trim())
const filled = (values: LeadTextInput) =>
  Object.fromEntries(Object.entries(values).filter(([, v]) => v?.trim())) as LeadTextInput
const omit = <T extends object>(obj: T | undefined, keys: string[]): T =>
  Object.fromEntries(Object.entries(obj ?? {}).filter(([k]) => !keys.includes(k))) as T
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

const buildKeys = (rows: SalesLead[], drafts: Draft[], initialLoading: boolean) => {
  const ghosts = initialLoading ? 0 : Math.max(0, MIN_ROWS - rows.length - drafts.length)
  return [
    ...rows.map((lead) => lead.id),
    ...drafts.map((d) => d.clientId),
    ...Array.from({ length: ghosts }, (_, i) => `${GHOST_PREFIX}${i}`),
    ADD_ROW,
  ]
}

const resetDraftFeedback = (draft: Draft): Draft =>
  draft.state === 'saving'
    ? draft
    : { ...draft, state: 'idle', message: undefined, errors: undefined, existingLeadId: undefined }

const duplicateText = (result: Extract<BatchRowResult, { status: 'duplicate' }>) => {
  if (!result.existingLead) return result.message
  const { businessName, archived } = result.existingLead
  return `Already in the workspace as “${businessName}”${archived ? ' (archived)' : ''} — ${matchLabel(result.matchedOn)}.`
}

const pasteSummary = ({ created, duplicates, invalid, failed }: SaveSummary) =>
  [
    created ? `Added ${created} ${created === 1 ? 'lead' : 'leads'}.` : 'No new leads were added.',
    duplicates ? `${duplicates} ${duplicates === 1 ? 'duplicate was' : 'duplicates were'} skipped.` : '',
    invalid ? `${invalid} ${invalid === 1 ? 'row needs' : 'rows need'} fixing.` : '',
    failed ? `${failed} could not be saved.` : '',
  ]
    .filter(Boolean)
    .join(' ')

export function LeadGrid({ ref, ...props }: LeadGridProps) {
  const { rows, query, selected, initialLoading } = props
  const [drafts, setDraftState] = useState<Draft[]>([])
  const draftsRef = useRef<Draft[]>([])
  const [overrides, setOverrides] = useState<Record<string, LeadTextInput>>({})
  const [cellStatus, setCellStatus] = useState<Record<string, RowCellStatus>>({})
  const [active, setActiveState] = useState<Active>({ key: '', col: 0 })
  const activeRef = useRef<Active>({ key: '', col: 0 })
  const [editing, setEditingState] = useState<Editing | null>(null)
  const editingRef = useRef<Editing | null>(null)
  const [lastError, setLastError] = useState<string | null>(null)
  const [savedOnce, setSavedOnce] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const pendingFocus = useRef<'cell' | 'select' | null>(null)
  const cellSeq = useRef(new Map<string, number>())
  const seq = useRef(0)

  const keys = buildKeys(rows, drafts, initialLoading)
  const activeKey = keys.includes(active.key) ? active.key : keys[0]
  const activeCol = active.col

  // ---- state helpers (event handlers only) -------------------------------------------
  const changeDrafts = (fn: (list: Draft[]) => Draft[]) => {
    draftsRef.current = fn(draftsRef.current)
    setDraftState(draftsRef.current)
  }
  const setActive = (next: Active) => {
    activeRef.current = next
    setActiveState(next)
  }
  const setEditing = (next: Editing | null) => {
    editingRef.current = next
    setEditingState(next)
  }
  const currentKeys = () => buildKeys(rows, draftsRef.current, initialLoading)
  const currentKey = () => {
    const list = currentKeys()
    return list.includes(activeRef.current.key) ? activeRef.current.key : list[0]
  }

  const rowAt = (key: string): RowRef => {
    if (key.startsWith(GHOST_PREFIX)) return { kind: 'ghost', index: Number(key.slice(GHOST_PREFIX.length)) }
    const draft = draftsRef.current.find((d) => d.clientId === key)
    if (draft) return { kind: 'draft', draft }
    const lead = rows.find((l) => l.id === key)
    return lead ? { kind: 'lead', lead } : { kind: 'add' }
  }

  const textOf = (key: string, col: ColumnKey) => {
    const row = rowAt(key)
    if (row.kind === 'lead') return overrides[row.lead.id]?.[col] ?? leadCellText(row.lead, col)
    if (row.kind === 'draft') return row.draft.values[col] ?? ''
    return ''
  }

  // ---- saving existing leads (optimistic, rolled back on failure) ----------------------
  const settle = (lead: SalesLead, cols: ColumnKey[], token: number, err: unknown) => {
    const mine = cols.filter((c) => cellSeq.current.get(`${lead.id}:${c}`) === token)
    mine.forEach((c) => cellSeq.current.delete(`${lead.id}:${c}`))
    if (mine.length === 0) return
    setOverrides((o) => ({ ...o, [lead.id]: omit(o[lead.id], mine) }))
    if (!err || isUnauthorized(err)) {
      setCellStatus((s) => ({ ...s, [lead.id]: omit(s[lead.id], mine) }))
      return
    }
    const byField = fieldErrors(err)
    const fallback = errorMessage(err, 'Could not save this change.')
    const failed = Object.fromEntries(
      mine.map((c) => [c, { state: 'error', message: byField[c] ?? fallback } satisfies CellStatus]),
    )
    setCellStatus((s) => ({ ...s, [lead.id]: { ...omit(s[lead.id], mine), ...failed } }))
    const label = GRID_COLUMNS.find((c) => c.key === mine[0])?.label
    setLastError(`${lead.businessName} — ${label}: ${byField[mine[0]] ?? fallback} The previous value was restored.`)
  }

  /** Shows the new values immediately and returns the request that saves them. */
  const prepareLeadPatch = (lead: SalesLead, fields: LeadTextInput): Task | null => {
    const shown = overrides[lead.id] ?? {}
    const patch: LeadTextInput = {}
    for (const [key, raw] of Object.entries(fields) as [LeadFieldKey, string][]) {
      const value = raw ?? ''
      const current = (shown as LeadTextInput)[key] ?? leadCellText(lead, key)
      if (value.trim() === current.trim()) continue
      if (key === 'status' && !value.trim()) continue
      if (key === 'businessName' && !value.trim()) {
        setCellStatus((s) => ({
          ...s,
          [lead.id]: { ...s[lead.id], businessName: { state: 'error', message: 'Business name is required.' } },
        }))
        continue
      }
      patch[key] = value
    }
    const fieldKeys = Object.keys(patch)
    if (fieldKeys.length === 0) return null
    const cols = fieldKeys.filter((k) => COLUMN_KEYS.has(k)) as ColumnKey[]
    const token = ++seq.current
    cols.forEach((c) => cellSeq.current.set(`${lead.id}:${c}`, token))
    const visible = Object.fromEntries(cols.map((c) => [c, patch[c]]))
    const saving = Object.fromEntries(cols.map((c) => [c, { state: 'saving' } satisfies CellStatus]))
    setOverrides((o) => ({ ...o, [lead.id]: { ...o[lead.id], ...visible } }))
    setCellStatus((s) => ({ ...s, [lead.id]: { ...s[lead.id], ...saving } }))

    return async () => {
      try {
        const { data } = await updateSalesLead(lead.id, patch)
        settle(lead, cols, token, null)
        props.onLeadSaved(data)
        setSavedOnce(true)
      } catch (err) {
        settle(lead, cols, token, err)
      }
    }
  }

  const runTasks = async (tasks: (Task | null)[]) => {
    const queue = tasks.filter((t): t is Task => t !== null)
    const worker = async () => {
      for (let task = queue.shift(); task; task = queue.shift()) await task()
    }
    await Promise.all(Array.from({ length: Math.min(PATCH_CONCURRENCY, queue.length) }, worker))
  }

  // ---- saving new rows ------------------------------------------------------------------
  const applyBatchResults = (results: BatchRowResult[], sent: Map<string, Draft>, summary: SaveSummary) => {
    const byId = new Map(results.map((r) => [r.clientId, r]))
    const created: SalesLead[] = []
    const renamed = new Map<string, string>()
    const followUps: (Task | null)[] = []
    const next: Draft[] = []

    for (const draft of draftsRef.current) {
      const result = byId.get(draft.clientId)
      const sentDraft = sent.get(draft.clientId)
      if (!result || !sentDraft) {
        next.push(draft)
        continue
      }
      const editedSince = draft.rev !== sentDraft.rev
      if (result.status === 'created') {
        summary.created++
        created.push(result.lead)
        renamed.set(draft.clientId, result.lead.id)
        if (editedSince) {
          const changed = Object.fromEntries(
            Object.entries(draft.values).filter(([k, v]) => (v ?? '') !== (sentDraft.values[k as LeadFieldKey] ?? '')),
          )
          followUps.push(prepareLeadPatch(result.lead, changed))
        }
        continue
      }
      if (result.status === 'duplicate') {
        summary.duplicates++
        next.push({
          ...draft,
          dirty: editedSince,
          state: editedSince ? 'idle' : 'duplicate',
          message: duplicateText(result),
          existingLeadId: result.existingLead?.id,
        })
      } else {
        summary.invalid++
        next.push({
          ...draft,
          dirty: editedSince,
          state: editedSince ? 'idle' : 'invalid',
          errors: result.errors,
          message: `Not saved: ${Object.values(result.errors).join(' ')}`,
        })
      }
    }

    changeDrafts(() => next)
    if (created.length > 0) {
      props.onLeadsCreated(created)
      setSavedOnce(true)
    }
    const activeRename = renamed.get(activeRef.current.key)
    if (activeRename) setActive({ ...activeRef.current, key: activeRename })
    const editRename = editingRef.current && renamed.get(editingRef.current.key)
    if (editRename && editingRef.current) setEditing({ ...editingRef.current, key: editRename })
    void runTasks(followUps)
  }

  const saveDrafts = async (ids: string[], { flagNameless = true } = {}): Promise<SaveSummary> => {
    const summary: SaveSummary = { created: 0, duplicates: 0, invalid: 0, failed: 0 }
    const targets = draftsRef.current.filter((d) => ids.includes(d.clientId))
    const nameless = new Set(
      targets.filter((d) => flagNameless && d.dirty && !hasName(d) && !isBlank(d)).map((d) => d.clientId),
    )
    if (nameless.size > 0) {
      summary.invalid += nameless.size
      changeDrafts((list) =>
        list.map((d) =>
          nameless.has(d.clientId)
            ? {
                ...d,
                state: 'invalid',
                errors: { businessName: 'Business name is required.' },
                message: 'Add a business name to save this row.',
              }
            : d,
        ),
      )
    }

    const ready = targets.filter((d) => d.dirty && hasName(d) && d.state !== 'saving')
    if (ready.length === 0) return summary
    const sent = new Map(ready.map((d) => [d.clientId, d]))
    changeDrafts((list) =>
      list.map((d) =>
        sent.has(d.clientId) ? { ...d, state: 'saving', dirty: false, message: undefined, errors: undefined } : d,
      ),
    )

    for (let i = 0; i < ready.length; i += BATCH_SIZE) {
      const chunk = ready.slice(i, i + BATCH_SIZE)
      try {
        const { data } = await createSalesLeadsBatch(
          chunk.map((d) => ({ clientId: d.clientId, values: filled(d.values) })),
        )
        applyBatchResults(data.results, sent, summary)
      } catch (err) {
        summary.failed += chunk.length
        const message = isUnauthorized(err)
          ? 'Your session ended — sign in again, then retry.'
          : errorMessage(err, 'Could not save this row.')
        const failed = new Set(chunk.map((d) => d.clientId))
        changeDrafts((list) =>
          list.map((d) => (failed.has(d.clientId) ? { ...d, state: 'error', dirty: true, message } : d)),
        )
        setLastError(message)
      }
    }
    return summary
  }

  const leaveRow = (key: string) => {
    const draft = draftsRef.current.find((d) => d.clientId === key)
    if (!draft) return
    if (isBlank(draft)) {
      if (rows.length + draftsRef.current.length > MIN_ROWS) changeDrafts((list) => list.filter((d) => d !== draft))
      return
    }
    if (draft.dirty) void saveDrafts([key])
  }

  // ---- editing -------------------------------------------------------------------------
  const updateDraft = (clientId: string, values: LeadTextInput) =>
    changeDrafts((list) =>
      list.map((d) =>
        d.clientId === clientId
          ? { ...resetDraftFeedback(d), values: { ...d.values, ...values }, rev: d.rev + 1, dirty: true }
          : d,
      ),
    )

  const draftForGhost = (index: number, values: LeadTextInput) => {
    const created = Array.from({ length: index + 1 }, (_, i) => newDraft(i === index ? values : {}))
    changeDrafts((list) => [...list, ...created])
    return created[index].clientId
  }

  /** Applies a value to a cell; returns the row's key afterwards (a blank row becomes a draft). */
  const commitCell = (key: string, col: ColumnKey, value: string): string => {
    const row = rowAt(key)
    if (row.kind === 'lead') {
      void runTasks([prepareLeadPatch(row.lead, { [col]: value })])
    } else if (row.kind === 'draft') {
      if ((row.draft.values[col] ?? '') !== value) updateDraft(key, { [col]: value })
    } else if (row.kind === 'ghost' && value.trim()) {
      return draftForGhost(row.index, { [col]: value })
    }
    return key
  }

  const goTo = (key: string, col: number, focus = true) => {
    const previous = currentKey()
    setActive({ key, col: clamp(col, 0, COLUMN_COUNT - 1) })
    if (focus) pendingFocus.current = 'cell'
    if (previous !== key) leaveRow(previous)
  }

  const moveBy = (dRow: number, dCol: number) => {
    const list = currentKeys()
    const index = clamp(list.indexOf(currentKey()) + dRow, 0, list.length - 1)
    goTo(list[index], activeRef.current.col + dCol)
  }

  /** Tab order: across the row, then on to the next row. Returns false at either end. */
  const moveAcross = (backwards: boolean) => {
    const list = currentKeys()
    let index = list.indexOf(currentKey())
    let col = activeRef.current.col + (backwards ? -1 : 1)
    if (list[index] === ADD_ROW) col = backwards ? -1 : COLUMN_COUNT
    if (col >= COLUMN_COUNT) [index, col] = [index + 1, 0]
    else if (col < 0) [index, col] = [index - 1, COLUMN_COUNT - 1]
    if (index < 0 || index >= list.length) return false
    goTo(list[index], col)
    return true
  }

  const startEdit = (key: string, col: number, initial?: string) => {
    if (key === ADD_ROW) return addRow(initial)
    if (GRID_COLUMNS[col].kind === 'status') {
      const row = rowAt(key)
      if (row.kind === 'ghost') setActive({ key: draftForGhost(row.index, {}), col })
      pendingFocus.current = 'select'
      setActive({ ...activeRef.current })
      return
    }
    if (GRID_COLUMNS[col].key === 'potentialServices') {
      setEditing({ key, col, value: textOf(key, 'potentialServices'), query: initial?.trim() ?? '' })
      return
    }
    setEditing({ key, col, value: initial ?? textOf(key, GRID_COLUMNS[col].key) })
  }

  type Move = { rows: number } | { across: boolean }
  const finishEdit = (commit: boolean, move?: Move, { refocus = true } = {}) => {
    const current = editingRef.current
    if (!current) return
    setEditing(null)
    if (commit) {
      const key = commitCell(current.key, GRID_COLUMNS[current.col].key, current.value)
      if (activeRef.current.key === current.key) setActive({ ...activeRef.current, key })
    }
    if (move && 'rows' in move) moveBy(move.rows, 0)
    else if (move) moveAcross(move.across)
    else if (refocus) pendingFocus.current = 'cell'
  }

  const addRow = (initial = '') => {
    if (editingRef.current) finishEdit(true, undefined, { refocus: false })
    const draft = newDraft()
    draft.dirty = false
    changeDrafts((list) => [...list, draft])
    goTo(draft.clientId, 0, false)
    setEditing({ key: draft.clientId, col: 0, value: initial })
  }

  const typeStatus = (key: string, char: string) => {
    const matches = props.statuses.filter((s) => s.startsWith(char.toUpperCase()))
    if (matches.length === 0) return
    const current = textOf(key, 'status') || 'NEW'
    const next = matches[(matches.indexOf(current) + 1) % matches.length]
    setActive({ ...activeRef.current, key: commitCell(key, 'status', next) })
  }

  // ---- paste -----------------------------------------------------------------------------
  const pasteTable = (table: string[][]) => {
    if (table.length === 0) return
    const header = table.length > 1 ? detectHeader(table[0]) : null
    const body = header ? table.slice(1) : table
    if (body.length > MAX_PASTE_ROWS) {
      props.onNotify(
        'danger',
        `Paste up to ${MAX_PASTE_ROWS.toLocaleString()} rows at a time — use Import Leads for larger files.`,
      )
      return
    }
    const key = currentKey()
    const leadCount = rows.length
    const existingDrafts = draftsRef.current
    const draftEnd = leadCount + existingDrafts.length
    const start = key === ADD_ROW ? draftEnd : currentKeys().indexOf(key)
    const startCol = header || key === ADD_ROW ? 0 : activeRef.current.col

    const toFields = (cells: string[]) => {
      const values: LeadTextInput = {}
      cells.forEach((cell, i) => {
        const field = header ? header[i] : GRID_COLUMNS[startCol + i]?.key
        if (field) values[field] = cell
      })
      return values
    }

    const overwritten = body.filter((_, i) => start + i < leadCount).length
    if (overwritten > 1 && !window.confirm(`Replace values in ${overwritten} existing leads with the pasted data?`)) {
      return
    }

    const patches: (Task | null)[] = []
    const draftUpdates = new Map<string, LeadTextInput>()
    const fresh: Draft[] = Array.from({ length: Math.max(0, start - draftEnd) }, () => ({
      ...newDraft(),
      dirty: false,
    }))
    body.forEach((cells, i) => {
      const target = start + i
      const values = toFields(cells)
      if (target < leadCount) patches.push(prepareLeadPatch(rows[target], values))
      else if (target < draftEnd) draftUpdates.set(existingDrafts[target - leadCount].clientId, values)
      else fresh.push(newDraft(values))
    })

    changeDrafts((list) => [
      ...list.map((d) =>
        draftUpdates.has(d.clientId)
          ? {
              ...resetDraftFeedback(d),
              values: { ...d.values, ...draftUpdates.get(d.clientId) },
              rev: d.rev + 1,
              dirty: true,
            }
          : d,
      ),
      ...fresh,
    ])
    const firstKey = buildKeys(rows, draftsRef.current, initialLoading)[start] ?? key
    setActive({ key: firstKey, col: startCol })
    pendingFocus.current = 'cell'

    void runTasks(patches)
    const draftIds = [...draftUpdates.keys(), ...fresh.map((d) => d.clientId)]
    if (draftIds.length > 0) {
      void saveDrafts(draftIds, { flagNameless: body.length > 1 }).then((summary) => {
        if (body.length > 1)
          props.onNotify(summary.invalid || summary.failed ? 'danger' : 'success', pasteSummary(summary))
      })
    }
  }

  // ---- event handlers (delegated from the scroll container) -----------------------------
  const onEditorKey = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      finishEdit(true, { rows: e.shiftKey ? -1 : 1 })
    } else if (e.key === 'Tab') {
      e.preventDefault()
      finishEdit(true, { across: e.shiftKey })
    } else if (e.key === 'Escape') {
      e.preventDefault()
      finishEdit(false)
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      finishEdit(true, { rows: e.key === 'ArrowUp' ? -1 : 1 })
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (target.dataset.gridEditor !== undefined) return onEditorKey(e)
    if (target.tagName === 'SELECT') {
      if (e.key === 'Escape') {
        e.preventDefault()
        goTo(currentKey(), activeRef.current.col)
      } else if (e.key === 'Tab' && moveAcross(e.shiftKey)) {
        e.preventDefault()
      }
      return
    }
    if (target.dataset.gridFocus === undefined) return

    const key = currentKey()
    const col = activeRef.current.col
    const mod = e.metaKey || e.ctrlKey
    const row = rowAt(key)
    const handled = () => e.preventDefault()

    switch (e.key) {
      case 'ArrowUp':
        handled()
        return mod ? goTo(currentKeys()[0], col) : moveBy(-1, 0)
      case 'ArrowDown':
        handled()
        return mod ? goTo(ADD_ROW, col) : moveBy(1, 0)
      case 'ArrowLeft':
        handled()
        return mod ? goTo(key, 0) : moveBy(0, -1)
      case 'ArrowRight':
        handled()
        return mod ? goTo(key, COLUMN_COUNT - 1) : moveBy(0, 1)
      case 'Home':
        handled()
        return goTo(mod ? currentKeys()[0] : key, 0)
      case 'End':
        handled()
        return goTo(mod ? ADD_ROW : key, COLUMN_COUNT - 1)
      case 'Tab':
        if (moveAcross(e.shiftKey)) handled()
        return
      case 'Enter':
        handled()
        if (mod) return row.kind === 'lead' ? props.onOpen(row.lead.id) : undefined
        return startEdit(key, col)
      case 'F2':
        handled()
        return startEdit(key, col)
      case 'Delete':
      case 'Backspace':
        handled()
        if (key !== ADD_ROW && GRID_COLUMNS[col].kind !== 'status') commitCell(key, GRID_COLUMNS[col].key, '')
        return
      case 'Escape':
        return
      default:
        break
    }
    if (e.key === ' ' && e.shiftKey && row.kind === 'lead') {
      handled()
      return props.onToggle(row.lead.id)
    }
    if (mod && e.key.toLowerCase() === 'c' && key !== ADD_ROW) {
      // Copy is handled by onCopy; keep the hidden field's selection intact for it.
      return
    }
    if (e.key.length === 1 && !mod && !e.altKey) {
      handled()
      if (key !== ADD_ROW && GRID_COLUMNS[col].kind === 'status') return typeStatus(key, e.key)
      startEdit(key, col, e.key)
    }
  }

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const cell = target.closest<HTMLElement>('[data-key]')
    if (!cell || e.button !== 0) return
    const key = cell.dataset.key ?? ''
    const col = Number(cell.dataset.col ?? 0)
    const current = editingRef.current
    if (current && current.key === key && current.col === col) return
    const interactive = target.closest('a, button, input, select, textarea') !== null
    if (!interactive) e.preventDefault()
    if (key === ADD_ROW) return addRow()

    const index = currentKeys().indexOf(key)
    if (current) finishEdit(true, undefined, { refocus: false })
    const resolved = currentKeys()[index] ?? key
    goTo(resolved, col, !interactive)
    if (!interactive && GRID_COLUMNS[col]?.key === 'potentialServices') startEdit(resolved, col)
  }

  const onDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-key]')
    if (!cell || editingRef.current || (e.target as HTMLElement).closest('a, button, select')) return
    startEdit(currentKey(), activeRef.current.col)
  }

  const onPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const inEditor = target.dataset.gridEditor !== undefined
    if (!inEditor && target.dataset.gridFocus === undefined) return
    const text = e.clipboardData.getData('text/plain')
    if (!text) return
    if (inEditor && !/[\t\n]/.test(text.replace(/[\r\n]+$/, ''))) return
    e.preventDefault()
    if (inEditor) finishEdit(false)
    pasteTable(parseClipboardTable(text))
  }

  const onCopy = (e: ClipboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (target.dataset.gridFocus === undefined) return
    const key = currentKey()
    if (key === ADD_ROW) return
    e.preventDefault()
    e.clipboardData.setData('text/plain', textOf(key, GRID_COLUMNS[activeRef.current.col].key))
  }

  const focusInGrid = () => {
    const el = document.activeElement
    return Boolean(scrollRef.current?.contains(el) || el?.closest('[data-grid-popover]'))
  }
  const leaveIfOutside = () =>
    window.setTimeout(() => {
      if (!focusInGrid()) leaveRow(currentKey())
    }, 0)

  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (
      e.relatedTarget instanceof Element &&
      (scrollRef.current?.contains(e.relatedTarget) || e.relatedTarget.closest('[data-grid-popover]'))
    )
      return
    leaveIfOutside()
  }

  const discardDraft = (key: string) => changeDrafts((list) => list.filter((d) => d.clientId !== key))

  // ---- stable callbacks for memoised rows ---------------------------------------------
  const latest = useRef<RowActions & { addRow: () => void }>(null)
  useEffect(() => {
    latest.current = {
      addRow: () => addRow(),
      editChange: (value) => {
        if (editingRef.current) setEditing({ ...editingRef.current, value })
      },
      editBlur: () => {
        finishEdit(true, undefined, { refocus: false })
        leaveIfOutside()
      },
      editCommit: (move) => finishEdit(true, move ? { across: move === 'back' } : undefined),
      editCancel: () => finishEdit(false),
      statusChange: (key, status) => {
        const nextKey = commitCell(key, 'status', status)
        setActive({ key: nextKey, col: STATUS_COL })
        pendingFocus.current = 'cell'
      },
      toggle: (id) => props.onToggle(id),
      open: (id) => props.onOpen(id),
      remove: (key) => {
        const row = rowAt(key)
        if (row.kind === 'lead') props.onArchive(row.lead)
        else if (row.kind === 'draft') discardDraft(key)
      },
      restore: (id) => {
        const lead = rows.find((l) => l.id === id)
        if (lead) props.onRestore(lead)
      },
      retry: (key) => {
        changeDrafts((list) => list.map((d) => (d.clientId === key ? { ...d, dirty: true } : d)))
        void saveDrafts([key])
      },
    }
  })
  const actions = useMemo<RowActions>(
    () => ({
      editChange: (value) => latest.current?.editChange(value),
      editBlur: () => latest.current?.editBlur(),
      editCommit: (move) => latest.current?.editCommit(move),
      editCancel: () => latest.current?.editCancel(),
      statusChange: (key, status) => latest.current?.statusChange(key, status),
      toggle: (id) => latest.current?.toggle(id),
      open: (id) => latest.current?.open(id),
      remove: (key) => latest.current?.remove(key),
      restore: (id) => latest.current?.restore(id),
      retry: (key) => latest.current?.retry(key),
    }),
    [],
  )
  useImperativeHandle(ref, () => ({ addRow: () => latest.current?.addRow() }), [])

  // Move keyboard focus to the active cell after navigation re-renders.
  useEffect(() => {
    const want = pendingFocus.current
    if (!want) return
    pendingFocus.current = null
    const root = scrollRef.current
    if (!root) return
    if (want === 'select') {
      const select = root.querySelector<HTMLSelectElement>(`[data-key="${CSS.escape(activeKey)}"] select`)
      if (select) {
        select.focus()
        try {
          select.showPicker()
        } catch {
          // Older browsers: the select is focused and opens with Space or Alt+Down.
        }
        return
      }
    }
    root.querySelector<HTMLElement>('[data-grid-focus]')?.focus()
  })

  const unsaved =
    drafts.some((d) => hasName(d) && (d.dirty || d.state === 'saving')) ||
    Object.values(cellStatus).some((row) => Object.values(row).some((s) => s?.state === 'saving'))
  useEffect(() => {
    if (!unsaved) return
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [unsaved])

  // ---- render ------------------------------------------------------------------------------
  const savingCount =
    drafts.filter((d) => d.state === 'saving').length +
    Object.values(cellStatus).reduce((n, row) => n + Object.values(row).filter((s) => s?.state === 'saving').length, 0)
  const duplicateDrafts = drafts.filter((d) => d.state === 'duplicate').length
  const allSelected = rows.length > 0 && rows.every((lead) => selected.has(lead.id))
  const someSelected = !allSelected && rows.some((lead) => selected.has(lead.id))
  const ghostCount = keys.length - 1 - rows.length - drafts.length
  const editingRow = editing && keys.includes(editing.key) ? editing : null

  const sortIcon = (sort?: string) => {
    if (!sort) return null
    if (query.sortBy !== sort) return <ArrowUpDown size={11} aria-hidden className="adm-lw-sort-idle" />
    return query.sortOrder === 'asc' ? <ArrowUp size={11} aria-hidden /> : <ArrowDown size={11} aria-hidden />
  }

  const rowProps = (key: string) => ({
    rowKey: key,
    activeCol: key === activeKey ? activeCol : -1,
    editing: editingRow?.key === key ? editingRow : null,
    statuses: props.statuses,
    services: props.services,
    aiOff: props.aiOff,
    actions,
  })

  return (
    <>
      {props.error ? (
        <div className="adm-lw-grid-banner is-danger" role="alert">
          <TriangleAlert size={14} aria-hidden />
          <span>{props.error}</span>
          <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={props.onRetry}>
            Retry
          </button>
        </div>
      ) : !props.loading && rows.length === 0 && props.filtered ? (
        <div className="adm-lw-grid-banner">
          <span>No leads match these filters.</span>
          <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={props.onClearFilters}>
            Clear filters
          </button>
        </div>
      ) : null}

      <div
        ref={scrollRef}
        className={`adm-lw-grid-scroll ${props.loading && !initialLoading ? 'is-loading' : ''}`}
        aria-busy={props.loading}
        onKeyDown={onKeyDown}
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
        onPaste={onPaste}
        onCopy={onCopy}
        onBlur={onBlur}
      >
        <table
          className="adm-lw-sheet"
          role="grid"
          aria-label="Sales leads"
          aria-rowcount={keys.length}
          style={{ width: TABLE_WIDTH }}
        >
          <colgroup>
            <col style={{ width: ROW_HEAD_WIDTH }} />
            {GRID_COLUMNS.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
            <col style={{ width: ANALYSIS_WIDTH }} />
            <col style={{ width: QUALIFICATION_WIDTH }} />
          </colgroup>
          <thead>
            <tr>
              <th className="adm-lw-grid-rowhead adm-lw-grid-corner" scope="col">
                <input
                  type="checkbox"
                  tabIndex={-1}
                  aria-label="Select all leads on this page"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected
                  }}
                  disabled={rows.length === 0}
                  onChange={(e) => props.onToggleAll(e.target.checked)}
                />
              </th>
              {GRID_COLUMNS.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={c.key === 'businessName' ? 'adm-lw-grid-sticky' : undefined}
                  title={c.key === 'potentialServices' ? `Choose from: ${props.services.join(', ')}` : undefined}
                  aria-sort={
                    c.sort && query.sortBy === c.sort
                      ? query.sortOrder === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  {c.sort ? (
                    <button type="button" tabIndex={-1} className="adm-lw-sort" onClick={() => props.onSort(c.sort!)}>
                      {c.label} {sortIcon(c.sort)}
                    </button>
                  ) : (
                    c.label
                  )}
                </th>
              ))}
              <th scope="col" title="Facts checked on the business website. Open a lead to analyze it.">
                Website Analysis
              </th>
              <th scope="col" title="AI interpretation of the website analysis. Open a lead to qualify it.">
                AI Qualification
              </th>
            </tr>
          </thead>
          <tbody>
            {initialLoading
              ? Array.from({ length: SKELETON_ROWS }, (_, i) => (
                  <tr key={i} aria-hidden className="adm-lw-grid-skeleton">
                    <th className="adm-lw-grid-rowhead" />
                    {GRID_COLUMNS.map((c) => (
                      <td key={c.key} className={c.key === 'businessName' ? 'adm-lw-grid-sticky' : undefined}>
                        <span className="adm-skeleton" />
                      </td>
                    ))}
                    <td>
                      <span className="adm-skeleton" />
                    </td>
                    <td>
                      <span className="adm-skeleton" />
                    </td>
                  </tr>
                ))
              : null}
            {rows.map((lead) => (
              <GridRow
                key={lead.id}
                {...rowProps(lead.id)}
                kind="lead"
                lead={lead}
                overrides={overrides[lead.id]}
                status={cellStatus[lead.id]}
                selected={selected.has(lead.id)}
              />
            ))}
            {drafts.map((draft) => (
              <GridRow key={draft.clientId} {...rowProps(draft.clientId)} kind="draft" draft={draft} selected={false} />
            ))}
            {Array.from({ length: Math.max(0, ghostCount) }, (_, i) => (
              <GridRow key={`${GHOST_PREFIX}${i}`} {...rowProps(`${GHOST_PREFIX}${i}`)} kind="ghost" selected={false} />
            ))}
            {initialLoading ? null : (
              <tr className="adm-lw-grid-add">
                <td
                  colSpan={COLUMN_COUNT + 3}
                  data-key={ADD_ROW}
                  data-col={0}
                  className={activeKey === ADD_ROW ? 'is-active' : undefined}
                >
                  <span className="adm-lw-grid-add-label">
                    <Plus size={14} aria-hidden /> Add row
                    <span className="adm-lw-grid-add-hint">
                      or paste rows copied from Excel, Google Sheets or Notion
                    </span>
                  </span>
                  {activeKey === ADD_ROW && !editingRow ? (
                    <textarea
                      data-grid-focus=""
                      className="adm-lw-grid-focus"
                      rows={1}
                      value=""
                      onChange={() => {}}
                      aria-label="Add row. Press Enter or start typing to add a lead, or paste rows from a spreadsheet."
                    />
                  ) : null}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="adm-lw-grid-status" aria-live="polite">
        <span className={`adm-lw-save-state ${lastError ? 'is-error' : ''}`}>
          {savingCount > 0 ? (
            <>
              <Loader2 size={13} className="adm-spin" aria-hidden /> Saving…
            </>
          ) : lastError ? (
            <>
              <TriangleAlert size={13} aria-hidden /> <span>{lastError}</span>
              <button type="button" className="adm-lw-link-btn" onClick={() => setLastError(null)}>
                Dismiss
              </button>
            </>
          ) : savedOnce ? (
            <>
              <Check size={13} aria-hidden /> All changes saved
            </>
          ) : null}
        </span>
        {duplicateDrafts > 0 ? (
          <button
            type="button"
            className="adm-lw-link-btn"
            onClick={() => changeDrafts((list) => list.filter((d) => d.state !== 'duplicate'))}
          >
            Discard {duplicateDrafts} duplicate {duplicateDrafts === 1 ? 'row' : 'rows'}
          </button>
        ) : null}
        <span className="adm-lw-grid-keys">
          Enter to edit · Tab / arrows to move · Esc to cancel · Shift+Space to select · ⌘/Ctrl+Enter for details
        </span>
      </div>

      <div className="adm-lw-table-foot">
        <label className="adm-lw-page-size">
          <span>Rows per page</span>
          <select
            className="adm-select adm-select--bare"
            value={query.limit}
            onChange={(e) => props.onPageSize(Number(e.target.value))}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        {props.pagination ? (
          <Pagination
            page={props.pagination.page}
            totalPages={props.pagination.totalPages}
            total={props.pagination.total}
            label="leads"
            disabled={props.loading}
            onChange={props.onPage}
          />
        ) : null}
      </div>
    </>
  )
}
