import { Download, Loader2, Plus, Search, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const SEARCH_DEBOUNCE_MS = 350

type LeadToolbarProps = {
  search: string
  total: number | null
  exporting: boolean
  onSearch: (search: string) => void
  onAdd: () => void
  onImport: () => void
  onExport: () => void
}

export function LeadToolbar({ search, total, exporting, onSearch, onAdd, onImport, onExport }: LeadToolbarProps) {
  const [draft, setDraft] = useState(search)
  const [syncedSearch, setSyncedSearch] = useState(search)
  const onSearchRef = useRef(onSearch)

  // Keep the box in sync when search changes elsewhere (e.g. "Clear filters").
  if (search !== syncedSearch) {
    setSyncedSearch(search)
    setDraft(search)
  }

  useEffect(() => {
    onSearchRef.current = onSearch
  })

  useEffect(() => {
    const value = draft.trim()
    if (value === syncedSearch) return
    const timer = window.setTimeout(() => onSearchRef.current(value), SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [draft, syncedSearch])

  return (
    <div className="adm-lw-toolbar">
      <label className="adm-input-wrap adm-lw-search">
        <Search size={16} aria-hidden />
        <span className="adm-visually-hidden">Search leads</span>
        <input
          type="search"
          className="adm-input"
          value={draft}
          maxLength={100}
          placeholder="Search business, phone, email, website, city…"
          onChange={(e) => setDraft(e.target.value)}
        />
      </label>
      <span className="adm-lw-count" aria-live="polite">
        {total === null ? '' : `${total.toLocaleString()} ${total === 1 ? 'lead' : 'leads'}`}
      </span>
      <div className="adm-row-actions adm-lw-toolbar-actions">
        <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={onExport} disabled={exporting}>
          {exporting ? <Loader2 size={14} className="adm-spin" aria-hidden /> : <Download size={14} aria-hidden />}
          <span>Export CSV</span>
        </button>
        <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={onImport}>
          <Upload size={14} aria-hidden />
          <span>Import Leads</span>
        </button>
        <button type="button" className="adm-btn adm-btn--primary adm-btn--sm" onClick={onAdd}>
          <Plus size={14} aria-hidden />
          <span>Add Lead</span>
        </button>
      </div>
    </div>
  )
}
