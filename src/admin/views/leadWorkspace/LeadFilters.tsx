import { X } from 'lucide-react'
import type { LeadQuery, WorkspaceMeta } from '../../api/leadWorkspace'
import { sourceLabel, statusLabel } from './leadFormat'

type FilterKey = 'status' | 'source' | 'category' | 'city' | 'service' | 'tag'

type LeadFiltersProps = {
  query: LeadQuery
  meta: WorkspaceMeta | null
  onChange: (patch: Partial<LeadQuery>) => void
  onClear: () => void
}

const options = (values: string[], current: string) =>
  current && !values.includes(current) ? [current, ...values] : values

export function LeadFilters({ query, meta, onChange, onClear }: LeadFiltersProps) {
  const filters: { key: FilterKey; label: string; all: string; values: string[]; format?: (v: string) => string }[] = [
    { key: 'status', label: 'Status', all: 'All statuses', values: meta?.statuses ?? [], format: statusLabel },
    { key: 'source', label: 'Source', all: 'All sources', values: meta?.sources ?? [], format: sourceLabel },
    { key: 'service', label: 'Service', all: 'All services', values: meta?.services ?? [] },
    { key: 'category', label: 'Category', all: 'All categories', values: meta?.facets.categories ?? [] },
    { key: 'city', label: 'City', all: 'All cities', values: meta?.facets.cities ?? [] },
    { key: 'tag', label: 'Tag', all: 'All tags', values: meta?.facets.tags ?? [] },
  ]
  const active = filters.some(({ key }) => query[key]) || query.archived !== 'active' || query.search

  return (
    <div className="adm-lw-filters" role="group" aria-label="Filter leads">
      {filters.map(({ key, label, all, values, format }) => (
        <label key={key} className="adm-lw-filter">
          <span className="adm-visually-hidden">{label}</span>
          <select
            className={`adm-select adm-lw-select ${query[key] ? 'is-active' : ''}`}
            value={query[key]}
            onChange={(e) => onChange({ [key]: e.target.value })}
          >
            <option value="">{all}</option>
            {options(values, query[key]).map((value) => (
              <option key={value} value={value}>
                {format ? format(value) : value}
              </option>
            ))}
          </select>
        </label>
      ))}
      <label className="adm-lw-filter">
        <span className="adm-visually-hidden">Archived</span>
        <select
          className={`adm-select adm-lw-select ${query.archived !== 'active' ? 'is-active' : ''}`}
          value={query.archived}
          onChange={(e) => onChange({ archived: e.target.value as LeadQuery['archived'] })}
        >
          <option value="active">Active leads</option>
          <option value="only">Archived only</option>
          <option value="all">Active + archived</option>
        </select>
      </label>
      {active ? (
        <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={onClear}>
          <X size={12} aria-hidden />
          <span>Clear</span>
        </button>
      ) : null}
    </div>
  )
}
