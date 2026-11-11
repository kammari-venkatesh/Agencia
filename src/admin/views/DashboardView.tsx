import { Activity, Inbox, Radar, RefreshCw, ShieldCheck, Table2 } from 'lucide-react'
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
  const realSearchAvailable = useProviderStatus()?.providers.apify.available === true

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

  const recentLeads = useMemo(
    () => (state.status === 'ready' ? [...state.leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : []),
    [state],
  )

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
          <a className="adm-stat-foot adm-link" href={ADMIN_PATHS.enquiries}>
            Open enquiries
          </a>
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
              : realSearchAvailable
                ? 'Open Lead Finder (test or real search)'
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
              Latest enquiries
            </h2>
            <p className="adm-section-desc">Messages submitted from the website contact form.</p>
          </div>
          <a className="adm-btn adm-btn--ghost" href={ADMIN_PATHS.enquiries}>
            View all
          </a>
        </div>

        <div className="adm-enq-recent">
          {state.status === 'loading'
            ? Array.from({ length: 3 }, (_, index) => <div key={index} className="adm-skeleton adm-enq-skeleton" />)
            : recentLeads.slice(0, 4).map((lead) => (
                <a key={lead.id} className="adm-enq-recent-item" href={ADMIN_PATHS.enquiries}>
                  <span className="adm-enq-item-top">
                    <span className="adm-cell-strong">{lead.name}</span>
                    <StatusBadge tone={lead.status === 'closed' ? 'success' : lead.status === 'contacted' ? 'warning' : 'info'}>
                      {lead.status === 'closed' ? 'Closed' : lead.status === 'contacted' ? 'Contacted' : 'New'}
                    </StatusBadge>
                  </span>
                  <span className="adm-cell-sub">
                    {lead.email} · {lead.phone}
                  </span>
                  <span className="adm-enq-preview">{lead.message}</span>
                </a>
              ))}
          {state.status === 'ready' && recentLeads.length === 0 ? (
            <div className="adm-empty">
              <Inbox size={24} aria-hidden />
              <span>No enquiries yet.</span>
            </div>
          ) : null}
        </div>
      </section>
    </AdminShell>
  )
}
