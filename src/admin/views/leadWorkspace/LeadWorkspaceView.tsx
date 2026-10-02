import { useEffect, useRef, useState } from 'react'
import {
  archiveSalesLead,
  bulkUpdateSalesLeads,
  DEFAULT_LEAD_QUERY,
  exportSalesLeads,
  fetchWorkspaceMeta,
  leadQueryString,
  listSalesLeads,
  type BulkOperation,
  type ImportSummary,
  type LeadQuery,
  type Pagination,
  type SalesLead,
  type WorkspaceMeta,
} from '../../api/leadWorkspace'
import {
  bulkQualifyLeads,
  getLeadQualificationStatuses,
  isQualificationActive,
  type QualificationSummary,
} from '../../api/qualification'
import {
  bulkAnalyzeLeadWebsites,
  getLeadAnalysisStatuses,
  isAnalysisActive,
  type AnalysisSummary,
} from '../../api/websiteAnalysis'
import { AdminShell } from '../../components/AdminShell'
import { usePolling } from '../../hooks/usePolling'
import { ADMIN_PATHS } from '../../paths'
import { BulkActions } from './BulkActions'
import { LeadDetailDrawer, type DrawerTarget } from './LeadDetailDrawer'
import { LeadFilters } from './LeadFilters'
import { LeadGrid, type LeadGridHandle } from './LeadGrid'
import { errorMessage, isUnauthorized, queryFromUrl } from './leadFormat'
import { LeadImportModal } from './LeadImportModal'
import { LeadToolbar } from './LeadToolbar'

type ListResult = { key: string; rows: SalesLead[]; pagination: Pagination | null; error: string | null }
type Notice = {
  id: number
  tone: 'success' | 'danger'
  text: string
  action?: { label: string; run: () => void }
}

const NOTICE_MS = 5000
const UNDO_NOTICE_MS = 8000
const ASCENDING_FIRST = new Set(['businessName', 'category', 'city', 'status', 'source'])
const FILTER_KEYS = ['search', 'status', 'source', 'category', 'city', 'tag', 'service'] as const
const ANALYSIS_POLL_MS = 4000

const initialDrawer = (): DrawerTarget | null => {
  const id = new URLSearchParams(window.location.search).get('lead')
  return id && /^[a-f\d]{24}$/i.test(id) ? { mode: 'view', id } : null
}

const isNewer = (next: SalesLead, current: SalesLead) => new Date(next.updatedAt) >= new Date(current.updatedAt)

export function LeadWorkspaceView() {
  const [query, setQuery] = useState<LeadQuery>(() => queryFromUrl(window.location.search))
  const [drawer, setDrawer] = useState<DrawerTarget | null>(initialDrawer)
  const [importOpen, setImportOpen] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [list, setList] = useState<ListResult | null>(null)
  const [meta, setMeta] = useState<WorkspaceMeta | null>(null)
  const [metaKey, setMetaKey] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [bulkBusy, setBulkBusy] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [notice, setNotice] = useState<Notice | null>(null)
  const gridRef = useRef<LeadGridHandle>(null)

  const requestKey = `${leadQueryString(query)}#${reloadKey}`
  const loading = list?.key !== requestKey
  const rows = list?.rows ?? []

  useEffect(() => {
    const controller = new AbortController()
    const key = `${leadQueryString(query)}#${reloadKey}`
    listSalesLeads(query, controller.signal)
      .then((res) => setList({ key, rows: res.data, pagination: res.pagination, error: null }))
      .catch((err: unknown) => {
        if (controller.signal.aborted || isUnauthorized(err)) return
        setList((prev) => ({
          key,
          rows: prev?.rows ?? [],
          pagination: prev?.pagination ?? null,
          error: errorMessage(err, 'Could not load leads.'),
        }))
      })
    return () => controller.abort()
  }, [query, reloadKey])

  useEffect(() => {
    const controller = new AbortController()
    fetchWorkspaceMeta(controller.signal)
      .then((res) => setMeta(res.data))
      .catch((err: unknown) => {
        if (controller.signal.aborted || isUnauthorized(err)) return
        setNotice({ id: Date.now(), tone: 'danger', text: errorMessage(err, 'Could not load workspace options.') })
      })
    return () => controller.abort()
  }, [metaKey])

  // Keep the address bar shareable: filters, sort, page and the open lead.
  useEffect(() => {
    const params = new URLSearchParams(leadQueryString(query))
    if (drawer?.mode === 'view') params.set('lead', drawer.id)
    const qs = params.toString()
    window.history.replaceState(
      window.history.state,
      '',
      qs ? `${ADMIN_PATHS.leadWorkspace}?${qs}` : ADMIN_PATHS.leadWorkspace,
    )
  }, [query, drawer])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), notice.action ? UNDO_NOTICE_MS : NOTICE_MS)
    return () => window.clearTimeout(timer)
  }, [notice])

  const notify = (tone: Notice['tone'], text: string, action?: Notice['action']) =>
    setNotice({ id: Date.now(), tone, text, action })
  const reload = () => setReloadKey((k) => k + 1)
  const reloadMeta = () => setMetaKey((k) => k + 1)

  const updateQuery = (patch: Partial<LeadQuery>) => {
    setQuery((q) => ({ ...q, ...patch, page: patch.page ?? 1 }))
    setSelected(new Set())
  }

  const clearFilters = () =>
    updateQuery({ ...Object.fromEntries(FILTER_KEYS.map((key) => [key, ''])), archived: DEFAULT_LEAD_QUERY.archived })

  const onSort = (sortBy: string) =>
    updateQuery(
      query.sortBy === sortBy
        ? { sortOrder: query.sortOrder === 'asc' ? 'desc' : 'asc' }
        : { sortBy, sortOrder: ASCENDING_FIRST.has(sortBy) ? 'asc' : 'desc' },
    )

  const toggle = (id: string) =>
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const toggleAll = (checked: boolean) => setSelected(checked ? new Set(rows.map((lead) => lead.id)) : new Set())

  const replaceRow = (lead: SalesLead) =>
    setList((prev) =>
      prev ? { ...prev, rows: prev.rows.map((r) => (r.id === lead.id && isNewer(lead, r) ? lead : r)) } : prev,
    )

  const applyQualificationSummaries = (summaries: Record<string, QualificationSummary>) =>
    setList((prev) =>
      prev
        ? {
            ...prev,
            rows: prev.rows.map((r) => (r.id in summaries ? { ...r, qualification: summaries[r.id] } : r)),
          }
        : prev,
    )

  // A finished analysis can change a lead's qualification state (e.g. "Analysis required").
  const applyAnalysisSummaries = (summaries: Record<string, AnalysisSummary | null>) => {
    setList((prev) =>
      prev
        ? {
            ...prev,
            rows: prev.rows.map((r) => (r.id in summaries ? { ...r, websiteAnalysis: summaries[r.id] } : r)),
          }
        : prev,
    )
    const finished = Object.keys(summaries).filter((id) => !isAnalysisActive(summaries[id]?.status))
    if (finished.length === 0) return
    getLeadQualificationStatuses(finished)
      .then((res) => applyQualificationSummaries(res.data))
      .catch(() => {})
  }

  // Keep row badges current while any visible analysis is queued or running.
  const activeAnalysisIds = rows.filter((r) => isAnalysisActive(r.websiteAnalysis?.status)).map((r) => r.id)
  usePolling(
    async (signal) => {
      if (activeAnalysisIds.length === 0) return
      applyAnalysisSummaries((await getLeadAnalysisStatuses(activeAnalysisIds, signal)).data)
    },
    activeAnalysisIds.length > 0,
    ANALYSIS_POLL_MS,
  )

  const activeQualificationIds = rows.filter((r) => isQualificationActive(r.qualification?.status)).map((r) => r.id)
  usePolling(
    async (signal) => {
      if (activeQualificationIds.length === 0) return
      applyQualificationSummaries((await getLeadQualificationStatuses(activeQualificationIds, signal)).data)
    },
    activeQualificationIds.length > 0,
    ANALYSIS_POLL_MS,
  )

  const qualifySelected = async () => {
    const ids = [...selected]
    setBulkBusy(true)
    try {
      const { data } = await bulkQualifyLeads(ids)
      const parts = [
        data.queued ? `${data.queued} queued` : '',
        data.reused ? `${data.reused} already qualified or in progress` : '',
        data.analysisRequired ? `${data.analysisRequired} need a website analysis first` : '',
        data.rejected ? `${data.rejected} not started` : '',
        data.skipped ? `${data.skipped} skipped` : '',
      ].filter(Boolean)
      const firstRejection = data.results.find((r) => r.outcome === 'rejected')?.message
      notify(
        data.rejected || data.skipped ? 'danger' : 'success',
        `AI qualification: ${parts.join(', ') || 'nothing to do'}.${firstRejection ? ` ${firstRejection}` : ''}`,
      )
      applyQualificationSummaries((await getLeadQualificationStatuses(ids)).data)
    } catch (err) {
      if (!isUnauthorized(err)) notify('danger', errorMessage(err, 'Could not start the AI qualification.'))
    } finally {
      setBulkBusy(false)
    }
  }

  const analyzeSelected = async () => {
    const ids = [...selected]
    setBulkBusy(true)
    try {
      const { data } = await bulkAnalyzeLeadWebsites(ids)
      const parts = [
        data.queued ? `${data.queued} queued` : '',
        data.reused ? `${data.reused} already analyzed or in progress` : '',
        data.completed ? `${data.completed} without a usable website` : '',
        data.rejected ? `${data.rejected} not started` : '',
      ].filter(Boolean)
      const firstRejection = data.results.find((r) => r.outcome === 'rejected')?.message
      notify(
        data.rejected ? 'danger' : 'success',
        `Website analysis: ${parts.join(', ') || 'nothing to do'}.${firstRejection ? ` ${firstRejection}` : ''}`,
      )
      applyAnalysisSummaries((await getLeadAnalysisStatuses(ids)).data)
    } catch (err) {
      if (!isUnauthorized(err)) notify('danger', errorMessage(err, 'Could not start the website analysis.'))
    } finally {
      setBulkBusy(false)
    }
  }

  const changeTotal = (delta: number) => (pagination: Pagination | null) =>
    pagination ? { ...pagination, total: Math.max(0, pagination.total + delta) } : pagination

  const addRows = (leads: SalesLead[]) => {
    setList((prev) =>
      prev ? { ...prev, rows: [...prev.rows, ...leads], pagination: changeTotal(leads.length)(prev.pagination) } : prev,
    )
    reloadMeta()
  }

  const onLeadSaved = (lead: SalesLead) => {
    replaceRow(lead)
    reloadMeta()
  }

  const restore = async (lead: SalesLead) => {
    try {
      await bulkUpdateSalesLeads([lead.id], 'unarchive')
      notify('success', `${lead.businessName} restored.`)
      reload()
    } catch (err) {
      if (!isUnauthorized(err)) notify('danger', errorMessage(err, 'Could not restore the lead.'))
    }
  }

  const archive = async (lead: SalesLead) => {
    setList((prev) =>
      prev
        ? { ...prev, rows: prev.rows.filter((r) => r.id !== lead.id), pagination: changeTotal(-1)(prev.pagination) }
        : prev,
    )
    setSelected((current) => {
      const next = new Set(current)
      next.delete(lead.id)
      return next
    })
    try {
      await archiveSalesLead(lead.id)
      notify('success', `${lead.businessName} archived.`, { label: 'Undo', run: () => void restore(lead) })
    } catch (err) {
      reload()
      if (!isUnauthorized(err)) notify('danger', errorMessage(err, 'Could not archive the lead.'))
    }
  }

  const applyBulk = async (operation: BulkOperation, value: string | null) => {
    const ids = [...selected]
    setBulkBusy(true)
    try {
      const { data } = await bulkUpdateSalesLeads(ids, operation, value)
      notify('success', `Updated ${data.modified} of ${data.found} selected ${data.found === 1 ? 'lead' : 'leads'}.`)
      setSelected(new Set())
      reload()
      if (operation === 'addTag' || operation === 'removeTag') reloadMeta()
    } catch (err) {
      if (!isUnauthorized(err)) notify('danger', errorMessage(err, 'The bulk update failed.'))
    } finally {
      setBulkBusy(false)
    }
  }

  const runExport = async () => {
    setExporting(true)
    try {
      const { filename, headers } = await exportSalesLeads(query)
      const count = headers.get('X-Export-Count')
      const truncated = headers.get('X-Export-Truncated') === 'true'
      notify(
        'success',
        `${count ? `Exported ${count} leads` : 'Exported'} to ${filename}${truncated ? ' (limit reached — narrow the filters for the rest)' : ''}.`,
      )
    } catch (err) {
      if (!isUnauthorized(err)) notify('danger', errorMessage(err, 'The export failed.'))
    } finally {
      setExporting(false)
    }
  }

  const onImported = (summary: ImportSummary) => {
    reload()
    reloadMeta()
    notify(
      'success',
      `Import finished: ${summary.inserted} inserted, ${summary.updated} updated, ${summary.skipped} skipped, ${summary.errorCount} errors.`,
    )
  }

  const onLeadChanged = (lead: SalesLead, change: 'created' | 'updated' | 'archived' | 'restored') => {
    reload()
    if (change === 'created' || change === 'updated') reloadMeta()
    const verb = { created: 'added', updated: 'saved', archived: 'archived', restored: 'restored' }[change]
    notify('success', `${lead.businessName} ${verb}.`)
  }

  const filtered = FILTER_KEYS.some((key) => query[key]) || query.archived !== 'active'

  return (
    <AdminShell
      title="Lead Workspace"
      description="Every sales lead in one place — discovered, imported or added by hand."
    >
      {notice ? (
        <div key={notice.id} className={`adm-alert adm-alert--${notice.tone} adm-lw-notice`} role="status">
          <span>{notice.text}</span>
          {notice.action ? (
            <button
              type="button"
              className="adm-btn adm-btn--ghost adm-btn--sm"
              onClick={() => {
                notice.action?.run()
                setNotice(null)
              }}
            >
              {notice.action.label}
            </button>
          ) : null}
          <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setNotice(null)}>
            Dismiss
          </button>
        </div>
      ) : null}

      <section className="adm-card adm-table-card adm-lw-card" aria-label="Sales leads">
        <div className="adm-lw-head">
          <LeadToolbar
            search={query.search}
            total={list?.pagination?.total ?? null}
            exporting={exporting}
            onSearch={(search) => updateQuery({ search })}
            onAdd={() => gridRef.current?.addRow()}
            onImport={() => setImportOpen(true)}
            onExport={runExport}
          />
          <LeadFilters query={query} meta={meta} onChange={updateQuery} onClear={clearFilters} />
          {selected.size > 0 ? (
            <BulkActions
              count={selected.size}
              meta={meta}
              busy={bulkBusy}
              onApply={applyBulk}
              onAnalyze={analyzeSelected}
              onQualify={qualifySelected}
              onClear={() => setSelected(new Set())}
            />
          ) : null}
        </div>

        <LeadGrid
          ref={gridRef}
          rows={rows}
          pagination={list?.pagination ?? null}
          initialLoading={list === null}
          loading={loading}
          error={list?.key === requestKey ? list.error : null}
          filtered={filtered}
          query={query}
          statuses={meta?.statuses ?? []}
          services={meta?.services ?? []}
          selected={selected}
          onSort={onSort}
          onToggle={toggle}
          onToggleAll={toggleAll}
          onOpen={(id) => setDrawer({ mode: 'view', id })}
          onPage={(page) => updateQuery({ page })}
          onPageSize={(limit) => updateQuery({ limit })}
          onRetry={reload}
          onClearFilters={clearFilters}
          onLeadSaved={onLeadSaved}
          onLeadsCreated={addRows}
          onArchive={archive}
          onRestore={restore}
          onNotify={notify}
        />
      </section>

      {drawer ? (
        <LeadDetailDrawer
          key={drawer.mode === 'view' ? drawer.id : 'create'}
          target={drawer}
          meta={meta}
          onClose={() => setDrawer(null)}
          onChanged={onLeadChanged}
          onOpenLead={(id) => setDrawer({ mode: 'view', id })}
          onAnalysisChange={(leadId, summary) => applyAnalysisSummaries({ [leadId]: summary })}
          onQualificationChange={(leadId, summary) => applyQualificationSummaries({ [leadId]: summary })}
        />
      ) : null}

      {importOpen ? <LeadImportModal meta={meta} onClose={() => setImportOpen(false)} onImported={onImported} /> : null}
    </AdminShell>
  )
}
