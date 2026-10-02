import { Activity, Inbox, Radar, RefreshCw, Search, ShieldCheck, Table2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchDashboard, fetchInboundLeads, type DashboardData, type InboundLead } from '../api/admin'
import { ApiRequestError } from '../api/client'
import { AdminShell } from '../components/AdminShell'
import { StatusBadge } from '../components/StatusBadge'
import { useProviderStatus } from '../hooks/useProviderStatus'
import { ADMIN_PATHS } from '../paths'

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; dashboard: DashboardData; leads: InboundLead[] }

const dateFormatter = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' })

export function DashboardView() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [reloadKey, setReloadKey] = useState(0)
  const [query, setQuery] = useState('')
  const [service, setService] = useState('all')
  const providerMode = useProviderStatus()?.mode

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([fetchDashboard(controller.signal), fetchInboundLeads(controller.signal)])
      .then(([dashboard, leads]) => {
        setState({ status: 'ready', dashboard: dashboard.data, leads: leads.data })
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        // 401s are handled globally (redirect to login); show other failures inline.
        if (err instanceof ApiRequestError && err.status === 401) return
        setState({ status: 'error', message: err instanceof Error ? err.message : 'Failed to load dashboard.' })
      })
    return () => controller.abort()
  }, [reloadKey])

  const reload = useCallback(() => {
    setState({ status: 'loading' })
    setReloadKey((k) => k + 1)
  }, [])

  const leads = useMemo(() => (state.status === 'ready' ? state.leads : []), [state])
  const serviceOptions = useMemo(() => [...new Set(leads.flatMap((l) => l.services))].sort(), [leads])
  const filteredLeads = useMemo(() => {
    const q = query.trim().toLowerCase()
    return leads
      .filter((l) => service === 'all' || l.services.includes(service))
      .filter((l) => !q || [l.name, l.email, l.phone].some((v) => v.toLowerCase().includes(q)))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [leads, query, service])

  return (
    <AdminShell
      title="Dashboard"
      description="Overview of inbound enquiries, Lead Finder prospects and the sales lead workspace."
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

      <section className="adm-stat-grid adm-stat-grid--five" aria-label="Summary">
        <article className="adm-card adm-stat">
          <div className="adm-stat-head">
            <span className="adm-stat-label">INBOUND LEADS</span>
            <Inbox size={18} aria-hidden />
          </div>
          {state.status === 'ready' ? (
            <span className="adm-stat-value">{state.dashboard.stats.inboundLeads}</span>
          ) : (
            <span className="adm-skeleton adm-skeleton--value" />
          )}
          <span className="adm-stat-foot">From the website contact form</span>
        </article>

        <article className="adm-card adm-stat">
          <div className="adm-stat-head">
            <span className="adm-stat-label">PROSPECTS</span>
            <Radar size={18} aria-hidden />
          </div>
          {state.status === 'ready' ? (
            <span className="adm-stat-value">{state.dashboard.stats.leadFinder.prospects}</span>
          ) : (
            <span className="adm-skeleton adm-skeleton--value" />
          )}
          <a className="adm-stat-foot adm-link" href={ADMIN_PATHS.leadFinder}>
            {state.status === 'ready' && state.dashboard.stats.leadFinder.activeJobs > 0
              ? `${state.dashboard.stats.leadFinder.activeJobs} active search${state.dashboard.stats.leadFinder.activeJobs === 1 ? '' : 'es'} · Open Lead Finder`
              : providerMode === 'live'
                ? 'Open Lead Finder'
                : 'Open Lead Finder (test data)'}
          </a>
        </article>

        <article className="adm-card adm-stat">
          <div className="adm-stat-head">
            <span className="adm-stat-label">SALES LEADS</span>
            <Table2 size={18} aria-hidden />
          </div>
          {state.status === 'ready' ? (
            <span className="adm-stat-value">{state.dashboard.stats.salesLeads}</span>
          ) : (
            <span className="adm-skeleton adm-skeleton--value" />
          )}
          <a className="adm-stat-foot adm-link" href={ADMIN_PATHS.leadWorkspace}>
            Open Lead Workspace
          </a>
        </article>

        <article className="adm-card adm-stat">
          <div className="adm-stat-head">
            <span className="adm-stat-label">ACCESS</span>
            <ShieldCheck size={18} aria-hidden />
          </div>
          <span className="adm-stat-value adm-stat-value--sm">
            <StatusBadge tone="accent">Admin</StatusBadge>
          </span>
          <span className="adm-stat-foot">Session secured with an httpOnly cookie</span>
        </article>

        <article className="adm-card adm-stat">
          <div className="adm-stat-head">
            <span className="adm-stat-label">API STATUS</span>
            <Activity size={18} aria-hidden />
          </div>
          <span className="adm-stat-value adm-stat-value--sm">
            {state.status === 'ready' ? (
              <StatusBadge tone="success">Connected</StatusBadge>
            ) : state.status === 'error' ? (
              <StatusBadge tone="danger">Unavailable</StatusBadge>
            ) : (
              <StatusBadge tone="neutral">Checking</StatusBadge>
            )}
          </span>
          <span className="adm-stat-foot">
            {state.status === 'ready'
              ? `Server time ${dateFormatter.format(new Date(state.dashboard.serverTime))}`
              : '—'}
          </span>
        </article>
      </section>

      <section className="adm-card adm-table-card" aria-labelledby="inbound-leads-heading">
        <div className="adm-table-toolbar">
          <div>
            <h2 id="inbound-leads-heading" className="adm-section-title">
              Inbound leads
            </h2>
            <p className="adm-section-desc">
              Submissions from the website contact form. Currently held in server memory and cleared on restart.
            </p>
          </div>
          <div className="adm-filters">
            <label className="adm-input-wrap">
              <Search size={16} aria-hidden />
              <span className="adm-visually-hidden">Search leads</span>
              <input
                type="search"
                className="adm-input"
                placeholder="Search name, email, phone"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <label>
              <span className="adm-visually-hidden">Filter by service</span>
              <select className="adm-select" value={service} onChange={(e) => setService(e.target.value)}>
                <option value="all">All services</option>
                {serviceOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="adm-table-scroll">
          <table className="adm-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Contact</th>
                <th scope="col">Services</th>
                <th scope="col">Received</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {state.status === 'loading'
                ? Array.from({ length: 3 }, (_, i) => (
                    <tr key={i} aria-hidden>
                      {Array.from({ length: 5 }, (_, j) => (
                        <td key={j}>
                          <span className="adm-skeleton" />
                        </td>
                      ))}
                    </tr>
                  ))
                : filteredLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <span className="adm-cell-strong">{lead.name}</span>
                        <span className="adm-cell-sub" title={lead.message}>
                          {lead.message}
                        </span>
                      </td>
                      <td>
                        <span className="adm-cell-strong">{lead.email}</span>
                        <span className="adm-cell-sub">{lead.phone}</span>
                      </td>
                      <td>
                        <div className="adm-tag-list">
                          {lead.services.map((s) => (
                            <span key={s} className="adm-tag">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="adm-cell-nowrap">{dateFormatter.format(new Date(lead.createdAt))}</td>
                      <td>
                        <StatusBadge tone="info">New</StatusBadge>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>

          {state.status === 'ready' && filteredLeads.length === 0 ? (
            <div className="adm-empty">
              <Inbox size={24} aria-hidden />
              <span>{leads.length === 0 ? 'No inbound leads yet.' : 'No leads match these filters.'}</span>
            </div>
          ) : null}
        </div>
      </section>
    </AdminShell>
  )
}
