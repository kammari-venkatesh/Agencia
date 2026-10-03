import { FlaskConical, Loader2, RefreshCw, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ApiRequestError } from '../../api/client'
import {
  getLeadQualification,
  isQualificationActive,
  qualifyLead,
  type Level,
  type Qualification,
  type QualificationEvidence,
  type QualificationStatus,
  type QualificationSummary,
} from '../../api/qualification'
import { StatusBadge, type BadgeTone } from '../../components/StatusBadge'
import { usePolling } from '../../hooks/usePolling'
import { errorMessage, formatDateTime, isUnauthorized } from './leadFormat'

const POLL_MS = 2500

const BADGE: Record<QualificationStatus, { tone: BadgeTone; label: string }> = {
  NOT_ANALYZED: { tone: 'neutral', label: 'Not qualified' },
  ANALYSIS_REQUIRED: { tone: 'neutral', label: 'Analysis required' },
  QUEUED: { tone: 'info', label: 'Queued' },
  ANALYZING: { tone: 'accent', label: 'Analyzing…' },
  COMPLETED: { tone: 'success', label: 'Qualified' },
  FAILED: { tone: 'danger', label: 'Failed' },
  STALE: { tone: 'warning', label: 'Outdated' },
}

const LEVEL_TONE: Record<Level, BadgeTone> = { HIGH: 'accent', MEDIUM: 'info', LOW: 'neutral' }
const levelLabel = (level: Level) => level.charAt(0) + level.slice(1).toLowerCase()

const toSummary = (q: Qualification): QualificationSummary => ({
  id: q.id ?? undefined,
  status: q.status,
  errorCode: q.errorCode ?? null,
  completedAt: q.completedAt ?? null,
  confidence: q.confidence ?? null,
  serviceIds: q.status === 'COMPLETED' || q.status === 'STALE' ? q.opportunities.map((o) => o.serviceId) : [],
  isTestProvider: q.isTestProvider,
})

/** Compact qualification state for tables. */
export function QualificationBadge({
  summary,
  aiOff = false,
}: {
  summary: QualificationSummary | null | undefined
  aiOff?: boolean
}) {
  const status = summary?.status ?? 'NOT_ANALYZED'
  if (aiOff && (status === 'NOT_ANALYZED' || status === 'ANALYSIS_REQUIRED')) {
    return (
      <span title="AI qualification is turned off on this server">
        <StatusBadge tone="neutral">AI off</StatusBadge>
      </span>
    )
  }
  const { tone, label } = BADGE[status]
  const services = summary?.serviceIds.length ?? 0
  const title =
    status === 'COMPLETED'
      ? `${services} potential service${services === 1 ? '' : 's'}${summary?.isTestProvider ? ' (test provider)' : ''}`
      : status === 'ANALYSIS_REQUIRED'
        ? 'Analyze the website first'
        : (summary?.errorCode ?? undefined)
  return (
    <span title={title}>
      <StatusBadge tone={tone}>
        {isQualificationActive(status) ? <Loader2 size={10} className="adm-spin" aria-hidden /> : null}
        {label}
        {status === 'COMPLETED' && services > 0 ? <span className="adm-aq-count"> · {services}</span> : null}
      </StatusBadge>
    </span>
  )
}

const actionError = (err: unknown) =>
  err instanceof ApiRequestError && [409, 429, 503].includes(err.status)
    ? err.message
    : errorMessage(err, 'Could not start the AI qualification.')

function EvidenceRefs({ refs, byId }: { refs: string[]; byId: Map<string, QualificationEvidence> }) {
  return (
    <ul className="adm-aq-refs">
      {refs.map((ref) => {
        const item = byId.get(ref)
        return item ? (
          <li key={ref}>
            <span className="adm-aq-ref-id">{ref}</span>
            <span>{item.evidence}</span>
          </li>
        ) : null
      })}
    </ul>
  )
}

function QualificationResult({ q }: { q: Qualification }) {
  const byId = new Map(q.evidence.map((e) => [e.id, e]))
  const dropped = q.validation?.droppedOpportunities ?? 0
  const usage = q.usage
  return (
    <>
      {q.isTestProvider ? (
        <p className="adm-wa-note is-warning">
          <FlaskConical size={13} aria-hidden /> Produced by the test provider, not a real AI model.
        </p>
      ) : null}
      {q.summary ? <p className="adm-aq-summary">{q.summary}</p> : null}
      {q.confidence ? (
        <p className="adm-muted adm-aq-meta">
          Evidence strength: <strong>{levelLabel(q.confidence)}</strong>
        </p>
      ) : null}

      <div>
        <h4 className="adm-aq-heading">Potential services</h4>
        {q.opportunities.length === 0 ? (
          <p className="adm-muted adm-lw-hint">
            The analysis did not show enough evidence to suggest a specific service.
          </p>
        ) : (
          <ul className="adm-aq-opps">
            {q.opportunities.map((o) => (
              <li key={o.serviceId} className="adm-aq-opp">
                <div className="adm-aq-opp-head">
                  <strong>{o.serviceName}</strong>
                  <span className="adm-aq-opp-levels">
                    <StatusBadge tone={LEVEL_TONE[o.priority]}>{levelLabel(o.priority)} priority</StatusBadge>
                    <span className="adm-muted">{levelLabel(o.confidence)} confidence</span>
                  </span>
                </div>
                <p className="adm-aq-reason">{o.reason}</p>
                <EvidenceRefs refs={o.evidenceReferences} byId={byId} />
              </li>
            ))}
          </ul>
        )}
        {dropped > 0 ? (
          <p className="adm-muted adm-aq-meta">
            {dropped} suggestion{dropped === 1 ? ' was' : 's were'} discarded because{' '}
            {dropped === 1 ? 'it was' : 'they were'} not supported by the evidence.
          </p>
        ) : null}
      </div>

      {q.missingInformation.length ? (
        <div>
          <h4 className="adm-aq-heading">Missing information</h4>
          <ul className="adm-aq-list">
            {q.missingInformation.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {q.recommendedNextAction ? (
        <div>
          <h4 className="adm-aq-heading">Recommended next action</h4>
          <p className="adm-aq-reason">{q.recommendedNextAction}</p>
        </div>
      ) : null}

      <p className="adm-muted adm-aq-meta">
        {[
          q.model,
          q.promptVersion ? `prompt ${q.promptVersion}` : null,
          usage?.totalTokens != null ? `${usage.totalTokens.toLocaleString()} tokens` : null,
          usage
            ? usage.costStatus === 'NONE'
              ? 'no cost'
              : usage.costUsd != null
                ? `$${usage.costUsd.toFixed(usage.costUsd < 0.01 ? 5 : 2)}`
                : usage.costStatus === 'UNAVAILABLE'
                  ? 'cost unavailable'
                  : null
            : null,
          q.completedAt ? formatDateTime(q.completedAt) : null,
        ]
          .filter(Boolean)
          .join(' · ')}
      </p>
    </>
  )
}

/**
 * AI qualification for one sales lead: interprets the stored website analysis into
 * evidence-backed service opportunities. Nothing runs until the admin clicks Qualify.
 * `analysisStamp` changes whenever the website analysis in the drawer changes.
 */
export function AiQualificationPanel({
  leadId,
  analysisStamp,
  onSummary,
}: {
  leadId: string
  analysisStamp?: string
  onSummary?: (summary: QualificationSummary) => void
}) {
  const [q, setQ] = useState<Qualification | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState<{ tone: 'danger' | 'info'; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const inFlight = useRef(false)
  const [reloadKey, setReloadKey] = useState(0)
  const active = isQualificationActive(q?.status)

  useEffect(() => {
    const controller = new AbortController()
    getLeadQualification(leadId, controller.signal)
      .then((res) => {
        setQ(res.data)
        setLoadError(null)
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted || isUnauthorized(err)) return
        setLoadError(errorMessage(err, 'Could not load the AI qualification.'))
      })
    return () => controller.abort()
  }, [leadId, reloadKey, analysisStamp])

  usePolling(
    async (signal) => {
      const { data } = await getLeadQualification(leadId, signal)
      setQ(data)
      if (!isQualificationActive(data.status)) onSummary?.(toSummary(data))
    },
    active,
    POLL_MS,
  )

  const start = async (refresh: boolean) => {
    if (inFlight.current || active) return
    inFlight.current = true
    setBusy(true)
    setActionMessage(null)
    try {
      const { data } = await qualifyLead(leadId, refresh)
      setQ(data.qualification)
      onSummary?.(toSummary(data.qualification))
      if (data.outcome === 'reused') {
        setActionMessage({
          tone: 'info',
          text:
            data.qualification.status === 'FAILED'
              ? 'The last attempt failed recently. Use Refresh to try again.'
              : 'Showing the current qualification. Use Refresh to run it again.',
        })
      }
    } catch (err) {
      if (!isUnauthorized(err)) setActionMessage({ tone: 'danger', text: actionError(err) })
    } finally {
      inFlight.current = false
      setBusy(false)
    }
  }

  if (loadError) {
    return (
      <div className="adm-alert adm-alert--danger" role="alert">
        <span>{loadError}</span>
        <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setReloadKey((k) => k + 1)}>
          Retry
        </button>
      </div>
    )
  }
  if (!q) {
    return (
      <div className="adm-lw-drawer-loading">
        <span className="adm-skeleton" />
        <span className="adm-skeleton" />
      </div>
    )
  }

  const aiOff = q.ai.mode === 'disabled' || q.ai.mode === 'unconfigured'
  const needsAnalysis = q.status === 'ANALYSIS_REQUIRED'
  const hasResult = q.id !== null && !active
  const disabled = busy || active || aiOff || needsAnalysis
  const showResult = q.status === 'COMPLETED' || q.status === 'STALE'

  return (
    <div className="adm-wa-panel" aria-live="polite">
      <div className="adm-wa-head">
        <QualificationBadge summary={toSummary(q)} />
        <button
          type="button"
          className="adm-btn adm-btn--ghost adm-btn--sm"
          disabled={disabled}
          title={
            aiOff
              ? 'AI qualification is not enabled on this server'
              : needsAnalysis
                ? 'Analyze the website first'
                : undefined
          }
          onClick={() => void start(hasResult)}
        >
          {busy || active ? (
            <Loader2 size={14} className="adm-spin" aria-hidden />
          ) : hasResult ? (
            <RefreshCw size={14} aria-hidden />
          ) : (
            <Sparkles size={14} aria-hidden />
          )}
          <span>{active ? 'Analyzing…' : hasResult ? 'Refresh' : 'Qualify with AI'}</span>
        </button>
      </div>

      {actionMessage ? (
        <p className={`adm-wa-note ${actionMessage.tone === 'danger' ? 'is-danger' : ''}`} role="status">
          {actionMessage.text}
        </p>
      ) : null}

      {aiOff && !hasResult ? (
        <p className="adm-muted adm-lw-hint">
          {q.ai.mode === 'unconfigured'
            ? 'AI qualification is not fully configured on this server.'
            : 'AI qualification is turned off on this server.'}
        </p>
      ) : needsAnalysis ? (
        <p className="adm-muted adm-lw-hint">
          Run the website analysis above first. AI qualification only interprets facts that have been collected.
        </p>
      ) : q.status === 'NOT_ANALYZED' ? (
        <p className="adm-muted adm-lw-hint">
          Suggests services that the website analysis supports, citing the evidence for each. Nothing runs until you
          click Qualify.
        </p>
      ) : active ? (
        <p className="adm-wa-progress">
          <Loader2 size={14} className="adm-spin" aria-hidden />
          {q.status === 'QUEUED' ? 'Waiting to start…' : 'Interpreting the website analysis…'}
        </p>
      ) : null}

      {q.status === 'STALE' && q.staleReason ? (
        <p className="adm-wa-note is-warning">{q.staleReason} Refresh to qualify again.</p>
      ) : null}

      {q.status === 'FAILED' && q.errorMessage ? (
        <div className="adm-alert adm-alert--danger" role="alert">
          <span>{q.errorMessage}</span>
        </div>
      ) : null}

      {showResult ? <QualificationResult q={q} /> : null}
    </div>
  )
}
