import { Check, ClipboardCheck, Eye, Loader2, X } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { ApiRequestError } from '../../api/client'
import type { SalesLead } from '../../api/leadWorkspace'
import { getLeadQualification, type Qualification, type QualificationEvidence } from '../../api/qualification'
import {
  approveLeadReview,
  getLeadOutreachPreview,
  getLeadReview,
  rejectLeadReview,
  saveLeadReview,
  type OutreachPreview,
  type ReadinessStatus,
  type ReviewDecision,
  type ReviewInput,
  type ReviewState,
  type ServiceDecision,
} from '../../api/review'
import { getLeadAnalysis, type WebsiteAnalysis } from '../../api/websiteAnalysis'
import { StatusBadge, type BadgeTone } from '../../components/StatusBadge'
import { Dialog } from './Dialog'
import { errorMessage, formatDateTime, isUnauthorized, safeHttpUrl, sourceLabel } from './leadFormat'

const LIMITS = { notes: 2000, summary: 600, nextAction: 200 }

const READINESS: Record<ReadinessStatus, { tone: BadgeTone; label: string }> = {
  NOT_REVIEWED: { tone: 'neutral', label: 'Not ready for review' },
  AI_REVIEWED: { tone: 'info', label: 'Awaiting human review' },
  HUMAN_APPROVED: { tone: 'warning', label: 'Approved · needs attention' },
  HUMAN_REJECTED: { tone: 'danger', label: 'Rejected' },
  OUTREACH_READY: { tone: 'success', label: 'Outreach ready' },
}

const DECISION_LABEL: Record<ReviewDecision, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  NEEDS_REVIEW: 'Needs review',
}

const ACTION_LABEL: Record<string, string> = {
  CREATED: 'Review started',
  UPDATED: 'Review saved',
  NEEDS_REVIEW: 'Marked as needing review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  LEAD_UPDATED: 'Approved services added to lead',
}

export function ReadinessBadge({ status }: { status: ReadinessStatus }) {
  const { tone, label } = READINESS[status]
  return <StatusBadge tone={tone}>{label}</StatusBadge>
}

/** One evidence item as stored by the website analysis: "E4 · meta_description → Meta description is missing." */
function EvidenceItem({ item }: { item: QualificationEvidence }) {
  return (
    <li className="adm-hr-evidence">
      <span className="adm-hr-evidence-id">{item.id}</span>
      <span className="adm-hr-evidence-type">{item.type}</span>
      <span aria-hidden>→</span>
      <span>{item.evidence}</span>
    </li>
  )
}

const reviewErrorText = (err: unknown) => {
  if (err instanceof ApiRequestError) {
    const details = Object.entries(err.details ?? {})
      .filter(([key]) => key !== 'code' && key !== 'currentVersion')
      .map(([, value]) => String(value))
    return details.length && err.status === 400 ? details.join(' ') : err.message
  }
  return errorMessage(err, 'Could not save the review.')
}

const isConflict = (err: unknown) => err instanceof ApiRequestError && err.status === 409

/**
 * Human review status for one lead. AI suggestions only become approved services when a
 * reviewer approves them here; nothing on this panel contacts the business.
 */
export function HumanReviewPanel({
  lead,
  refreshStamp,
  onLeadUpdated,
}: {
  lead: SalesLead
  refreshStamp?: string
  /** Called when an approval added services to this lead. Returns false if the lead could not be reloaded. */
  onLeadUpdated?: () => Promise<boolean>
}) {
  const [state, setState] = useState<ReviewState | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [open, setOpen] = useState<'review' | 'preview' | null>(null)
  const [note, setNote] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    getLeadReview(lead.id, controller.signal)
      .then((res) => {
        setState(res.data)
        setLoadError(null)
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted || isUnauthorized(err)) return
        setLoadError(errorMessage(err, 'Could not load the review.'))
      })
    return () => controller.abort()
  }, [lead.id, refreshStamp, reloadKey])

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
  if (!state) {
    return (
      <div className="adm-lw-drawer-loading">
        <span className="adm-skeleton" />
      </div>
    )
  }

  const { review, readiness } = state
  const handleSaved = async (next: ReviewState, approvedNow: boolean) => {
    setState(next)
    if (approvedNow && next.review?.leadUpdate?.addedServices.length && onLeadUpdated) {
      const reloaded = await onLeadUpdated()
      setNote(
        reloaded
          ? null
          : 'Approved services were added to this lead. Save or discard your unsaved edits, then reopen the lead to see them.',
      )
    }
  }

  return (
    <div className="adm-wa-panel" aria-live="polite">
      <div className="adm-wa-head">
        <ReadinessBadge status={readiness.status} />
        <span className="adm-row-actions">
          <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setOpen('preview')}>
            <Eye size={14} aria-hidden /> <span>Outreach preview</span>
          </button>
          <button type="button" className="adm-btn adm-btn--primary adm-btn--sm" onClick={() => setOpen('review')}>
            <ClipboardCheck size={14} aria-hidden /> <span>{review ? 'Open review' : 'Start review'}</span>
          </button>
        </span>
      </div>

      {review ? (
        <dl className="adm-lw-meta">
          <dt>Decision</dt>
          <dd>{DECISION_LABEL[review.decision]}</dd>
          <dt>Approved</dt>
          <dd>
            {review.approvedServices.length ? review.approvedServices.map((s) => s.serviceName).join(', ') : 'None'}
          </dd>
          {review.reviewedAt ? (
            <>
              <dt>Reviewed</dt>
              <dd>
                {review.reviewer.email ?? 'Admin'} · {formatDateTime(review.reviewedAt)}
              </dd>
            </>
          ) : null}
        </dl>
      ) : (
        <p className="adm-muted adm-lw-hint">
          AI suggestions are not used until a person reviews and approves them. Nothing is sent from here.
        </p>
      )}

      {readiness.status !== 'OUTREACH_READY' && review && readiness.problems.length ? (
        <ul className="adm-aq-list adm-muted">
          {readiness.problems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      ) : null}
      {note ? <p className="adm-wa-note is-warning">{note}</p> : null}

      {open === 'review' ? (
        <ReviewDialog lead={lead} state={state} onClose={() => setOpen(null)} onSaved={handleSaved} />
      ) : null}
      {open === 'preview' ? <OutreachPreviewDialog leadId={lead.id} onClose={() => setOpen(null)} /> : null}
    </div>
  )
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt>{label}</dt>
      <dd className="adm-wa-break">{children ?? <span className="adm-muted">Not collected</span>}</dd>
    </>
  )
}

const yesNo = (value: boolean | null | undefined, yes = 'Yes', no = 'No') =>
  value == null ? null : value ? yes : <strong>{no}</strong>

function WebsiteFacts({ analysis }: { analysis: WebsiteAnalysis | null }) {
  if (!analysis || analysis.status !== 'COMPLETED') {
    return <p className="adm-muted adm-lw-hint">No completed website analysis.</p>
  }
  const a = analysis
  const og = a.structuredData?.openGraph
  return (
    <dl className="adm-lw-meta adm-wa-facts">
      <Fact label="HTTP status">{a.availability?.httpStatus ?? null}</Fact>
      <Fact label="HTTPS">{yesNo(a.availability?.https)}</Fact>
      <Fact label="Title">{a.page?.title || (a.page ? <strong>Missing</strong> : null)}</Fact>
      <Fact label="Meta description">{a.page?.metaDescription || (a.page ? <strong>Missing</strong> : null)}</Fact>
      <Fact label="Canonical">{a.page?.canonicalUrl || (a.page ? <strong>Missing</strong> : null)}</Fact>
      <Fact label="H1 headings">{a.content ? a.content.h1Count : null}</Fact>
      <Fact label="Images">
        {a.content ? `${a.content.imageCount} (${a.content.imagesWithoutAltCount} without alt text)` : null}
      </Fact>
      <Fact label="Sitemap">{yesNo(a.sitemap?.sitemapExists, 'Found', 'Not found')}</Fact>
      <Fact label="robots.txt">
        {a.robots?.robotsTxtExists == null
          ? null
          : a.robots.robotsTxtExists
            ? a.robots.robotsDisallowsAll
              ? 'Blocks all crawlers'
              : 'Found'
            : 'Not found'}
      </Fact>
      <Fact label="Structured data">
        {a.structuredData?.hasJsonLd == null
          ? null
          : a.structuredData.hasJsonLd
            ? a.structuredData.jsonLdTypes.join(', ') || 'JSON-LD present'
            : 'None found'}
      </Fact>
      <Fact label="OpenGraph">{yesNo(og?.present, 'Present', 'Not found')}</Fact>
      <Fact label="Social links">
        {a.socialLinks ? (a.socialLinks.length ? a.socialLinks.map((s) => s.platform).join(', ') : 'None found') : null}
      </Fact>
      <Fact label="Technology">
        {a.technologies
          ? a.technologies.length
            ? a.technologies.map((t) => t.name).join(', ')
            : 'None detected'
          : null}
      </Fact>
      {a.analyzedAt ? <Fact label="Analysed">{formatDateTime(a.analyzedAt)}</Fact> : null}
    </dl>
  )
}

function BusinessInfo({ lead }: { lead: SalesLead }) {
  const website = safeHttpUrl(lead.website)
  const maps = safeHttpUrl(lead.googleMapsUrl)
  const location = [lead.city, lead.state, lead.country].filter(Boolean).join(', ')
  return (
    <dl className="adm-lw-meta">
      <Fact label="Name">{lead.businessName}</Fact>
      <Fact label="Category">{lead.category}</Fact>
      <Fact label="Location">{location || null}</Fact>
      <Fact label="Website">
        {website ? (
          <a className="adm-link" href={website} target="_blank" rel="noopener noreferrer nofollow">
            {lead.website}
          </a>
        ) : null}
      </Fact>
      <Fact label="Phone">{lead.phone}</Fact>
      <Fact label="Maps">
        {maps ? (
          <a className="adm-link" href={maps} target="_blank" rel="noopener noreferrer nofollow">
            Open in Google Maps
          </a>
        ) : null}
      </Fact>
      <Fact label="Source">{sourceLabel(lead.source)}</Fact>
    </dl>
  )
}

type Action = 'save' | 'needsReview' | 'approve' | 'reject'

function ReviewDialog({
  lead,
  state,
  onClose,
  onSaved,
}: {
  lead: SalesLead
  state: ReviewState
  onClose: () => void
  onSaved: (next: ReviewState, approvedNow: boolean) => void | Promise<void>
}) {
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null)
  const [q, setQ] = useState<Qualification | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [current, setCurrent] = useState(state)
  const review = current.review
  const [decisions, setDecisions] = useState<Record<string, ServiceDecision>>(() =>
    Object.fromEntries((state.review?.serviceDecisions ?? []).map((d) => [d.serviceId, d.decision])),
  )
  const [notes, setNotes] = useState(state.review?.reviewNotes ?? '')
  const [summary, setSummary] = useState(state.review?.reviewerEditedSummary ?? '')
  const [nextAction, setNextAction] = useState(state.review?.reviewerEditedNextAction ?? '')
  const [acknowledged, setAcknowledged] = useState(state.review?.evidenceAcknowledged ?? false)
  const [busy, setBusy] = useState<Action | null>(null)
  const [message, setMessage] = useState<{ tone: 'danger' | 'info'; text: string; conflict?: boolean } | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([getLeadAnalysis(lead.id, controller.signal), getLeadQualification(lead.id, controller.signal)])
      .then(([a, qual]) => {
        setAnalysis(a.data)
        setQ(qual.data)
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted || isUnauthorized(err)) return
        setLoadError(errorMessage(err, 'Could not load the analysis and qualification.'))
      })
    return () => controller.abort()
  }, [lead.id])

  const qualified = q?.status === 'COMPLETED'
  const opportunities = q && (q.status === 'COMPLETED' || q.status === 'STALE') ? q.opportunities : []
  const evidenceById = new Map((q?.evidence ?? []).map((e) => [e.id, e]))
  const approvedCount = opportunities.filter((o) => decisions[o.serviceId] === 'APPROVED').length

  const input = (): ReviewInput => ({
    serviceDecisions: qualified
      ? opportunities.map((o) => ({ serviceId: o.serviceId, decision: decisions[o.serviceId] ?? 'UNDECIDED' }))
      : undefined,
    reviewNotes: notes.trim() || null,
    reviewerEditedSummary: summary.trim() || null,
    reviewerEditedNextAction: nextAction.trim() || null,
    evidenceAcknowledged: acknowledged,
  })

  const run = async (action: Action) => {
    if (busy) return
    if (action === 'reject' && !window.confirm(`Reject “${lead.businessName}”? The AI qualification is kept.`)) return
    setBusy(action)
    setMessage(null)
    const version = review?.version ?? 0
    try {
      const body = input()
      const res =
        action === 'approve'
          ? await approveLeadReview(lead.id, version, body)
          : action === 'reject'
            ? await rejectLeadReview(lead.id, version, body)
            : await saveLeadReview(lead.id, version, body, action === 'needsReview')
      setCurrent(res.data)
      await onSaved(res.data, action === 'approve')
      const added = res.data.review?.leadUpdate?.addedServices ?? []
      setMessage({
        tone: 'info',
        text:
          action === 'approve'
            ? added.length && res.data.review?.salesLeadId
              ? `Approved. Added to the lead's potential services: ${added.join(', ')}.`
              : 'Approved.'
            : action === 'reject'
              ? 'Rejected. The AI qualification was kept.'
              : action === 'needsReview'
                ? 'Marked as needing more review.'
                : 'Review saved.',
      })
    } catch (err) {
      if (isUnauthorized(err)) return
      setMessage({ tone: 'danger', text: reviewErrorText(err), conflict: isConflict(err) })
    } finally {
      setBusy(null)
    }
  }

  const reload = async () => {
    try {
      const { data } = await getLeadReview(lead.id)
      setCurrent(data)
      setDecisions(Object.fromEntries((data.review?.serviceDecisions ?? []).map((d) => [d.serviceId, d.decision])))
      setNotes(data.review?.reviewNotes ?? '')
      setSummary(data.review?.reviewerEditedSummary ?? '')
      setNextAction(data.review?.reviewerEditedNextAction ?? '')
      setAcknowledged(data.review?.evidenceAcknowledged ?? false)
      setMessage({ tone: 'info', text: 'Loaded the latest review.' })
    } catch (err) {
      if (!isUnauthorized(err)) setMessage({ tone: 'danger', text: errorMessage(err, 'Could not reload the review.') })
    }
  }

  const toggle = (serviceId: string, decision: ServiceDecision) =>
    setDecisions((d) => {
      const next = { ...d }
      if (next[serviceId] === decision) delete next[serviceId]
      else next[serviceId] = decision
      return next
    })

  const spinner = (action: Action) => (busy === action ? <Loader2 size={14} className="adm-spin" aria-hidden /> : null)
  const disabled = busy !== null || !q || !!loadError

  return (
    <Dialog
      title={`Review: ${lead.businessName}`}
      description={
        <span className="adm-row-actions">
          <ReadinessBadge status={current.readiness.status} />
          {review ? <span className="adm-muted">{DECISION_LABEL[review.decision]}</span> : null}
        </span>
      }
      onClose={onClose}
      footer={
        <div className="adm-hr-actions">
          <button
            type="button"
            className="adm-btn adm-btn--ghost adm-btn--sm"
            disabled={disabled}
            onClick={() => void run('save')}
          >
            {spinner('save')} <span>Save review</span>
          </button>
          <button
            type="button"
            className="adm-btn adm-btn--ghost adm-btn--sm"
            disabled={disabled}
            onClick={() => void run('needsReview')}
          >
            {spinner('needsReview')} <span>Mark needs review</span>
          </button>
          <button
            type="button"
            className="adm-btn adm-btn--danger adm-btn--sm"
            disabled={disabled || (!qualified && q?.status !== 'STALE')}
            onClick={() => void run('reject')}
          >
            {spinner('reject')} <span>Reject</span>
          </button>
          <button
            type="button"
            className="adm-btn adm-btn--primary adm-btn--sm"
            disabled={disabled || !qualified || !acknowledged || approvedCount === 0}
            title={
              !qualified
                ? 'Needs a current, completed AI qualification'
                : !acknowledged
                  ? 'Confirm that you checked the evidence'
                  : approvedCount === 0
                    ? 'Approve at least one service'
                    : undefined
            }
            onClick={() => void run('approve')}
          >
            {spinner('approve')} <span>Approve</span>
          </button>
        </div>
      }
    >
      <div className="adm-hr">
        {message ? (
          <div
            className={`adm-alert ${message.tone === 'danger' ? 'adm-alert--danger' : 'adm-alert--success'}`}
            role="status"
          >
            <span>{message.text}</span>
            {message.conflict ? (
              <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => void reload()}>
                Reload review
              </button>
            ) : null}
          </div>
        ) : null}
        {review?.outdated ? (
          <p className="adm-wa-note is-warning">
            The AI qualification changed after this review was saved. Check the services again before approving.
          </p>
        ) : null}
        {loadError ? (
          <div className="adm-alert adm-alert--danger" role="alert">
            <span>{loadError}</span>
          </div>
        ) : null}

        <div className="adm-hr-columns">
          <section className="adm-hr-block">
            <h3 className="adm-aq-heading">Business information</h3>
            <BusinessInfo lead={lead} />
          </section>
          <section className="adm-hr-block">
            <h3 className="adm-aq-heading">Website facts (collected by the analysis)</h3>
            {q ? <WebsiteFacts analysis={analysis} /> : <span className="adm-skeleton" />}
          </section>
        </div>

        <section className="adm-hr-block">
          <h3 className="adm-aq-heading">AI qualification (suggestions, not facts)</h3>
          {!q ? (
            <span className="adm-skeleton" />
          ) : q.status !== 'COMPLETED' && q.status !== 'STALE' ? (
            <p className="adm-muted adm-lw-hint">Run the website analysis and AI qualification before reviewing.</p>
          ) : (
            <>
              {q.status === 'STALE' ? (
                <p className="adm-wa-note is-warning">
                  {q.staleReason ?? 'This qualification is outdated.'} It can be rejected, but qualify again before
                  approving.
                </p>
              ) : null}
              {q.isTestProvider ? <p className="adm-wa-note is-warning">Produced by the test provider.</p> : null}
              {q.summary ? <p className="adm-aq-summary">{q.summary}</p> : null}
              <p className="adm-muted adm-aq-meta">
                {q.confidence ? `Evidence strength: ${q.confidence.toLowerCase()}` : null}
                {q.completedAt ? ` · ${formatDateTime(q.completedAt)}` : null}
              </p>
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
                <p className="adm-aq-reason">
                  <span className="adm-muted">Suggested next action: </span>
                  {q.recommendedNextAction}
                </p>
              ) : null}
            </>
          )}
        </section>

        {opportunities.length ? (
          <section className="adm-hr-block">
            <h3 className="adm-aq-heading">Recommended services: approve or reject each</h3>
            <ul className="adm-aq-opps">
              {opportunities.map((o) => {
                const decision = decisions[o.serviceId]
                const evidence = o.evidenceReferences.map((ref) => evidenceById.get(ref))
                return (
                  <li
                    key={o.serviceId}
                    className={`adm-aq-opp adm-hr-service${decision ? ` is-${decision.toLowerCase()}` : ''}`}
                  >
                    <div className="adm-aq-opp-head">
                      <strong>{o.serviceName}</strong>
                      <span className="adm-hr-toggle" role="group" aria-label={`Decision for ${o.serviceName}`}>
                        <button
                          type="button"
                          className={`adm-btn adm-btn--sm ${decision === 'APPROVED' ? 'adm-btn--primary' : 'adm-btn--ghost'}`}
                          aria-pressed={decision === 'APPROVED'}
                          disabled={!qualified || busy !== null}
                          onClick={() => toggle(o.serviceId, 'APPROVED')}
                        >
                          <Check size={13} aria-hidden /> <span>Approve</span>
                        </button>
                        <button
                          type="button"
                          className={`adm-btn adm-btn--sm ${decision === 'REJECTED' ? 'adm-btn--danger' : 'adm-btn--ghost'}`}
                          aria-pressed={decision === 'REJECTED'}
                          disabled={!qualified || busy !== null}
                          onClick={() => toggle(o.serviceId, 'REJECTED')}
                        >
                          <X size={13} aria-hidden /> <span>Reject</span>
                        </button>
                      </span>
                    </div>
                    <p className="adm-aq-reason">
                      <span className="adm-muted">AI reason: </span>
                      {o.reason}
                    </p>
                    <div>
                      <span className="adm-muted adm-aq-meta">Supporting evidence</span>
                      <ul className="adm-hr-evidence-list">
                        {evidence.map((item, i) =>
                          item ? (
                            <EvidenceItem key={item.id} item={item} />
                          ) : (
                            <li key={o.evidenceReferences[i]} className="adm-hr-evidence is-missing">
                              <span className="adm-hr-evidence-id">{o.evidenceReferences[i]}</span>
                              <span>Not found in the stored analysis evidence</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        ) : null}

        <section className="adm-hr-block adm-hr-form">
          <h3 className="adm-aq-heading">Reviewer</h3>
          <label className="adm-field">
            <span className="adm-field-label">Review notes</span>
            <textarea
              className="adm-lw-textarea"
              rows={3}
              maxLength={LIMITS.notes}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
          <label className="adm-field">
            <span className="adm-field-label">Summary (optional, replaces the AI summary in the preview)</span>
            <textarea
              className="adm-lw-textarea"
              rows={2}
              maxLength={LIMITS.summary}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </label>
          <label className="adm-field">
            <span className="adm-field-label">Next action (optional)</span>
            <input
              className="adm-lw-plain-input"
              maxLength={LIMITS.nextAction}
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
            />
          </label>
          <label className="adm-hr-check">
            <input type="checkbox" checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} />
            <span>I checked the supporting evidence for the services I approve.</span>
          </label>
        </section>

        {review?.history.length ? (
          <details className="adm-wa-evidence">
            <summary>History ({review.history.length})</summary>
            <ul>
              {review.history.map((h, i) => (
                <li key={`${h.at}-${i}`}>
                  <span className="adm-wa-evidence-source">{formatDateTime(h.at)}</span>
                  <span>
                    {ACTION_LABEL[h.action] ?? h.action} by {h.reviewer.email ?? 'admin'}
                    {h.previousDecision && h.previousDecision !== h.newDecision
                      ? ` (${DECISION_LABEL[h.previousDecision]} → ${DECISION_LABEL[h.newDecision]})`
                      : ''}
                    {h.addedLeadServices.length ? `: ${h.addedLeadServices.join(', ')}` : ''}
                    {h.notes ? ` · “${h.notes}”` : ''}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </div>
    </Dialog>
  )
}

/** Read-only summary of what a person approved. There is no draft and no way to send from here. */
function OutreachPreviewDialog({ leadId, onClose }: { leadId: string; onClose: () => void }) {
  const [preview, setPreview] = useState<OutreachPreview | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    getLeadOutreachPreview(leadId, controller.signal)
      .then((res) => setPreview(res.data))
      .catch((err: unknown) => {
        if (controller.signal.aborted || isUnauthorized(err)) return
        setError(errorMessage(err, 'Could not load the outreach preview.'))
      })
    return () => controller.abort()
  }, [leadId])

  const textSource = (source: 'REVIEWER' | 'AI') => (source === 'AI' ? 'AI-generated' : 'Reviewer')

  return (
    <Dialog
      title="Outreach preview"
      description="Read-only. Nothing is generated or sent from this screen."
      onClose={onClose}
      footer={
        <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={onClose}>
          Close
        </button>
      }
    >
      {error ? (
        <div className="adm-alert adm-alert--danger" role="alert">
          <span>{error}</span>
        </div>
      ) : !preview ? (
        <div className="adm-lw-drawer-loading">
          <span className="adm-skeleton" />
          <span className="adm-skeleton" />
        </div>
      ) : (
        <div className="adm-hr">
          <div className="adm-wa-head">
            <ReadinessBadge status={preview.readiness.status} />
          </div>
          {preview.readiness.status !== 'OUTREACH_READY' ? (
            <div className="adm-wa-note is-warning">
              <strong>Not outreach-ready.</strong>
              <ul className="adm-aq-list">
                {preview.readiness.problems.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <section className="adm-hr-block">
            <h3 className="adm-aq-heading">Business</h3>
            <dl className="adm-lw-meta">
              <Fact label="Name">{preview.business.name}</Fact>
              <Fact label="Category">{preview.business.category}</Fact>
              <Fact label="Location">{preview.business.location}</Fact>
              <Fact label="Website">{preview.business.website}</Fact>
              <Fact label="Phone">{preview.business.phone}</Fact>
            </dl>
          </section>

          <section className="adm-hr-block">
            <h3 className="adm-aq-heading">Approved services</h3>
            {preview.approvedServices.length === 0 ? (
              <p className="adm-muted adm-lw-hint">No services have been approved by a reviewer.</p>
            ) : (
              <ul className="adm-aq-opps">
                {preview.approvedServices.map((s) => (
                  <li key={s.serviceId} className="adm-aq-opp">
                    <strong>{s.serviceName}</strong>
                    {s.aiReason ? (
                      <p className="adm-aq-reason">
                        <span className="adm-muted">AI reason: </span>
                        {s.aiReason}
                      </p>
                    ) : null}
                    <ul className="adm-hr-evidence-list">
                      {s.evidence.map((e) => (
                        <EvidenceItem key={e.id} item={e} />
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="adm-hr-block">
            <dl className="adm-lw-meta">
              <Fact label="Summary">
                {preview.summary ? (
                  <>
                    {preview.summary.text} <span className="adm-tag">{textSource(preview.summary.source)}</span>
                  </>
                ) : null}
              </Fact>
              <Fact label="Next action">
                {preview.nextAction ? (
                  <>
                    {preview.nextAction.text} <span className="adm-tag">{textSource(preview.nextAction.source)}</span>
                  </>
                ) : null}
              </Fact>
              <Fact label="Reviewer notes">{preview.reviewerNotes}</Fact>
              <Fact label="Reviewed by">
                {preview.reviewedBy
                  ? `${preview.reviewedBy}${preview.reviewedAt ? ` · ${formatDateTime(preview.reviewedAt)}` : ''}`
                  : null}
              </Fact>
            </dl>
          </section>

          <p className="adm-wa-note">
            <strong>Draft message:</strong> none. {preview.sending.note}
          </p>
        </div>
      )}
    </Dialog>
  )
}
