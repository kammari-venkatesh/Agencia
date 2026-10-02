import { Check, Search } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { splitList } from './gridModel'

type ServicePickerProps = {
  /** Comma-separated selection, as stored in the cell. */
  value: string
  services: string[]
  initialQuery?: string
  label: string
  onChange: (value: string) => void
  onCommit: (move?: 'across' | 'back') => void
  onCancel: () => void
  onClickOutside: () => void
}

const PANEL_MIN_WIDTH = 260
const PANEL_MAX_HEIGHT = 360
const GAP = 4
const EDGE = 8

/** Multi-select dropdown for the Service Needed cell, positioned under its cell. */
export function ServicePicker(props: ServicePickerProps) {
  const { services, value } = props
  const [query, setQuery] = useState(props.initialQuery ?? '')
  const [highlight, setHighlight] = useState(0)
  const anchorRef = useRef<HTMLSpanElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const latest = useRef(props)

  useEffect(() => {
    latest.current = props
  })

  const selected = splitList(value)
  const selectedKeys = new Set(selected.map((s) => s.toLowerCase()))
  const unknown = selected.filter((s) => !services.some((svc) => svc.toLowerCase() === s.toLowerCase()))
  const options = services.filter((s) => s.toLowerCase().includes(query.trim().toLowerCase()))
  const active = Math.min(highlight, Math.max(0, options.length - 1))

  useLayoutEffect(() => {
    const place = () => {
      const cell = anchorRef.current?.closest('td')
      const panel = panelRef.current
      if (!cell || !panel) return
      const rect = cell.getBoundingClientRect()
      const width = Math.max(rect.width, PANEL_MIN_WIDTH)
      const below = window.innerHeight - rect.bottom - GAP - EDGE
      const above = rect.top - GAP - EDGE
      const openUp = below < PANEL_MAX_HEIGHT && above > below
      const height = Math.min(PANEL_MAX_HEIGHT, openUp ? above : below)
      panel.style.maxHeight = `${height}px`
      panel.style.width = `${width}px`
      panel.style.left = `${Math.max(EDGE, Math.min(rect.left, window.innerWidth - width - EDGE))}px`
      panel.style.top = `${openUp ? rect.top - GAP - Math.min(height, panel.scrollHeight) : rect.bottom + GAP}px`
    }
    place()
    const cell = anchorRef.current?.closest('td')
    const observer = new ResizeObserver(place)
    if (cell) observer.observe(cell)
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [])

  useEffect(() => {
    const onDown = (event: MouseEvent) => {
      const target = event.target as Node
      const cell = anchorRef.current?.closest('td')
      if (panelRef.current?.contains(target) || cell?.contains(target)) return
      latest.current.onClickOutside()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const toggle = (service: string) => {
    const on = selectedKeys.has(service.toLowerCase())
    const next = on
      ? selected.filter((s) => s.toLowerCase() !== service.toLowerCase())
      : services.filter((s) => selectedKeys.has(s.toLowerCase()) || s === service).concat(unknown)
    props.onChange(next.join(', '))
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const step = e.key === 'ArrowDown' ? 1 : -1
      setHighlight((options.length + active + step) % Math.max(1, options.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (e.metaKey || e.ctrlKey || options.length === 0) props.onCommit()
      else toggle(options[active])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      props.onCancel()
    } else if (e.key === 'Tab') {
      e.preventDefault()
      props.onCommit(e.shiftKey ? 'back' : 'across')
    }
  }

  return (
    <>
      <span ref={anchorRef} className="adm-lw-picker-anchor" aria-hidden />
      {createPortal(
        <div
          ref={panelRef}
          data-grid-popover=""
          className="adm-lw-picker"
          role="dialog"
          aria-label={props.label}
          onMouseDown={(e) => {
            if (!(e.target instanceof HTMLInputElement)) e.preventDefault()
          }}
        >
          <label className="adm-lw-picker-search">
            <Search size={14} aria-hidden />
            <input
              autoFocus
              value={query}
              placeholder="Search services"
              aria-label="Search services"
              aria-controls="adm-lw-picker-list"
              onChange={(e) => {
                setQuery(e.target.value)
                setHighlight(0)
              }}
              onKeyDown={onKeyDown}
            />
          </label>
          <ul id="adm-lw-picker-list" className="adm-lw-picker-list" role="listbox" aria-multiselectable="true">
            {options.length === 0 ? <li className="adm-lw-picker-empty">No matching service</li> : null}
            {options.map((service, i) => {
              const on = selectedKeys.has(service.toLowerCase())
              return (
                <li
                  key={service}
                  role="option"
                  aria-selected={on}
                  className={`adm-lw-picker-option ${on ? 'is-on' : ''} ${i === active ? 'is-active' : ''}`}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => toggle(service)}
                >
                  <span className="adm-lw-picker-check">
                    {on ? <Check size={12} strokeWidth={3} aria-hidden /> : null}
                  </span>
                  {service}
                </li>
              )
            })}
          </ul>
          <div className="adm-lw-picker-foot">
            <span>{selected.length === 0 ? 'None selected' : `${selected.length} selected`}</span>
            <button
              type="button"
              className="adm-lw-link-btn"
              disabled={selected.length === 0}
              onClick={() => props.onChange('')}
            >
              Clear
            </button>
            <button type="button" className="adm-btn adm-btn--primary adm-btn--sm" onClick={() => props.onCommit()}>
              Done
            </button>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
