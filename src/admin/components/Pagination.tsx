import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationProps = {
  page: number
  totalPages: number
  total: number
  label: string
  disabled?: boolean
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, total, label, disabled, onChange }: PaginationProps) {
  if (totalPages <= 1) return null
  return (
    <nav className="adm-pagination" aria-label={`${label} pagination`}>
      <span className="adm-pagination-info">
        Page {page} of {totalPages} · {total} {label}
      </span>
      <div className="adm-pagination-buttons">
        <button
          type="button"
          className="adm-icon-btn"
          onClick={() => onChange(page - 1)}
          disabled={disabled || page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} aria-hidden />
        </button>
        <button
          type="button"
          className="adm-icon-btn"
          onClick={() => onChange(page + 1)}
          disabled={disabled || page >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} aria-hidden />
        </button>
      </div>
    </nav>
  )
}
