import { Inbox, Mail, Phone, RefreshCw, Search } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  fetchInboundLeads,
  updateInboundLeadStatus,
  type InboundLead,
  type InboundLeadStatus,
} from '../api/admin'
import { ApiRequestError } from '../api/client'
import { AdminShell } from '../components/AdminShell'
import { StatusBadge, type BadgeTone } from '../components/StatusBadge'

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; leads: InboundLead[] }

const STATUSES: { value: InboundLeadStatus; label: string; tone: BadgeTone }[] = [
  { value: 'new', label: 'New', tone: 'info' },
  { value: 'contacted', label: 'Contacted', tone: 'warning' },
  { value: 'closed', label: 'Closed', tone: 'success' },
]

const dateFormatter = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' })

const statusMeta = (status: InboundLeadStatus | undefined) => STATUSES.find((item) => item.value === status) ?? STATUSES[0]

const serviceLabel = (value: string) =>
  value
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

export function EnquiriesView() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [reloadKey, setReloadKey] = useState(0)
  const [query, setQuery] = useState('')
  const [service, setService] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | InboundLeadStatus>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetchInboundLeads(controller.signal)
      .then((res) => setState({ status: 'ready', leads: res.data }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        if (err instanceof ApiRequestError && err.status === 401) return
        setState({ status: 'error', message: err instanceof Error ? err.message : 'Failed to load enquiries.' })
      })
    return () => controller.abort()
  }, [reloadKey])

  const reload = useCallback(() => {
    setState({ status: 'loading' })
    setReloadKey((key) => key + 1)
  }, [])

  const leads = useMemo(() => (state.status === 'ready' ? state.leads : []), [state])
  const serviceOptions = useMemo(() => [...new Set(leads.flatMap((lead) => lead.services))].sort(), [leads])
  const filteredLeads = useMemo(() => {
    const q = query.trim().toLowerCase()
    return leads.filter((lead) => {
      if (statusFilter !== 'all' && (lead.status ?? 'new') !== statusFilter) return false
      if (service !== 'all' && !lead.services.includes(service)) return false
      if (!q) return true
      return [lead.name, lead.email, lead.phone, lead.message].some((value) => value.toLowerCase().includes(q))
    })
  }, [leads, query, service, statusFilter])

  const selected = filteredLeads.find((lead) => lead.id === selectedId) ?? filteredLeads[0] ?? null

  const setStatus = async (lead: InboundLead, status: InboundLeadStatus) => {
    if (lead.status === status || saving) return
    setSaving(true)
    setActionError('')
    try {
      const res = await updateInboundLeadStatus(lead.id, status)
      setState((current) =>
        current.status === 'ready'
          ? { status: 'ready', leads: current.leads.map((item) => (item.id === lead.id ? res.data : item)) }
          : current,
      )
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 401) return
      setActionError(err instanceof Error ? err.message : 'Could not update this enquiry.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminShell
      title="Enquiries"
      description="Messages from the website contact form."
      actions={
        <button type="button" className="adm-btn adm-btn--ghost" onClick={reload} disabled={state.status === 'loading'}>
          <RefreshCw size={16} className={state.status === 'loading' ? 'adm-spin' : undefined} aria-hidden />
          <span>Refresh</span>
        </button>
      }
    >
      {state.status === 'error' ? (
        <div className="adm-alert adm-alert--danger" role="alert">
          <span>{state.message}</span>
          <button type="button" className="adm-btn adm-btn--ghost" onClick={reload}>
            Try again
          </button>
        </div>
      ) : null}

      <div className="adm-enq-toolbar">
        <label className="adm-input-wrap">
          <Search size={16} aria-hidden />
          <span className="adm-visually-hidden">Search enquiries</span>
          <input
            type="search"
            className="adm-input"
            placeholder="Search name, email, phone, or message"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label>
          <span className="adm-visually-hidden">Filter by status</span>
          <select
            className="adm-select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | InboundLeadStatus)}
          >
            <option value="all">All statuses</option>
            {STATUSES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="adm-visually-hidden">Filter by service</span>
          <select className="adm-select" value={service} onChange={(event) => setService(event.target.value)}>
            <option value="all">All services</option>
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {serviceLabel(option)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {state.status !== 'loading' && filteredLeads.length === 0 ? (
        <div className="adm-card adm-empty">
          <Inbox size={24} aria-hidden />
          <span>
            {state.status === 'error'
              ? 'Enquiries could not be loaded.'
              : leads.length === 0
                ? 'No enquiries yet.'
                : 'No enquiries match these filters.'}
          </span>
        </div>
      ) : (
        <div className="adm-enq-layout">
          <div className="adm-enq-list" role="list">
            {state.status === 'loading'
              ? Array.from({ length: 4 }, (_, index) => <div key={index} className="adm-skeleton adm-enq-skeleton" />)
              : filteredLeads.map((lead) => {
                  const meta = statusMeta(lead.status)
                  const active = selected?.id === lead.id
                  return (
                    <button
                      key={lead.id}
                      type="button"
                      role="listitem"
                      className={`adm-enq-item ${active ? 'is-selected' : ''}`}
                      onClick={() => setSelectedId(lead.id)}
                      aria-current={active ? 'true' : undefined}
                    >
                      <span className="adm-enq-item-top">
                        <span className="adm-cell-strong">{lead.name}</span>
                        <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                      </span>
                      <span className="adm-cell-sub">{lead.email}</span>
                      <span className="adm-enq-preview">{lead.message}</span>
                      <span className="adm-enq-item-foot">{dateFormatter.format(new Date(lead.createdAt))}</span>
                    </button>
                  )
                })}
          </div>

          {selected ? (
            <article className="adm-card adm-enq-detail" aria-labelledby="enquiry-detail-heading">
              <header className="adm-enq-detail-head">
                <div>
                  <p className="adm-stat-label">WEBSITE ENQUIRY</p>
                  <h2 id="enquiry-detail-heading" className="adm-section-title">
                    {selected.name}
                  </h2>
                  <p className="adm-section-desc">Received {dateFormatter.format(new Date(selected.createdAt))}</p>
                </div>
                <StatusBadge tone={statusMeta(selected.status).tone}>{statusMeta(selected.status).label}</StatusBadge>
              </header>

              <div className="adm-enq-contacts">
                <a className="adm-enq-contact" href={`mailto:${selected.email}`}>
                  <Mail size={16} aria-hidden />
                  <span>{selected.email}</span>
                </a>
                <a className="adm-enq-contact" href={`tel:${selected.phone.replace(/\s+/g, '')}`}>
                  <Phone size={16} aria-hidden />
                  <span>{selected.phone}</span>
                </a>
              </div>

              <div className="adm-enq-block">
                <span className="adm-field-label">SERVICES</span>
                <div className="adm-tag-list">
                  {selected.services.map((item) => (
                    <span key={item} className="adm-tag">
                      {serviceLabel(item)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="adm-enq-block">
                <span className="adm-field-label">MESSAGE</span>
                <p className="adm-enq-message">{selected.message}</p>
              </div>

              <div className="adm-enq-block">
                <span className="adm-field-label">STATUS</span>
                <div className="adm-enq-status" role="group" aria-label="Enquiry status">
                  {STATUSES.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      className={`adm-btn adm-btn--ghost ${(selected.status ?? 'new') === item.value ? 'is-selected' : ''}`}
                      disabled={saving}
                      onClick={() => setStatus(selected, item.value)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                {actionError ? <p className="adm-field-error">{actionError}</p> : null}
              </div>
            </article>
          ) : null}
        </div>
      )}
    </AdminShell>
  )
}
