import { Globe, Loader2, RefreshCw, ScanSearch } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ApiRequestError } from '../../api/client'
import {
  analyzeLeadWebsite,
  analyzeProspectWebsite,
  getLeadAnalysis,
  getProspectAnalysis,
  isAnalysisActive,
  type AnalysisStatus,
  type AnalysisSummary,
  type AnalyzeResponse,
  type WebsiteAnalysis,
} from '../../api/websiteAnalysis'
import { StatusBadge, type BadgeTone } from '../../components/StatusBadge'
import { usePolling } from '../../hooks/usePolling'
import { displayHost, errorMessage, formatDateTime, isUnauthorized, safeHttpUrl } from './leadFormat'

const POLL_MS = 2500

const BADGE: Record<AnalysisStatus, { tone: BadgeTone; label: string }> = {
  NOT_ANALYZED: { tone: 'neutral', label: 'Not analyzed' },
  QUEUED: { tone: 'info', label: 'Queued' },
  ANALYZING: { tone: 'accent', label: 'Analyzing…' },
  COMPLETED: { tone: 'success', label: 'Analyzed' },
  FAILED: { tone: 'danger', label: 'Failed' },
  SKIPPED: { tone: 'neutral', label: 'No website' },
  CANCELLED: { tone: 'neutral', label: 'Cancelled' },
}

const toSummary = (analysis: WebsiteAnalysis): AnalysisSummary | null =>
  analysis.id
    ? {
        id: analysis.id,
        status: analysis.status,
        analyzedAt: analysis.analyzedAt ?? null,
        errorCode: analysis.errorCode ?? null,
        reachable: analysis.availability?.reachable ?? null,
        httpStatus: analysis.availability?.httpStatus ?? null,
        websiteChanged: analysis.websiteChanged ?? false,
      }
    : null

const badgeTitle = (summary: AnalysisSummary | null | undefined) => {
  if (!summary) return undefined
  if (summary.websiteChanged) return 'The website changed after this analysis'
  if (summary.status === 'FAILED') return summary.errorCode ?? undefined
  if (summary.analyzedAt) return `Analyzed ${formatDateTime(summary.analyzedAt)}`
  return undefined
}

/** Compact analysis state for tables; "No website" when there is nothing to analyse. */
export function AnalysisBadge({
  summary,
  hasWebsite,
}: {
  summary: AnalysisSummary | null | undefined
  hasWebsite: boolean
}) {
  if (!summary) {
    return hasWebsite ? (
      <StatusBadge tone="neutral">Not analyzed</StatusBadge>
    ) : (
      <span className="adm-muted adm-wa-none">No website</span>
    )
  }
  const { tone, label } =
    summary.websiteChanged && !isAnalysisActive(summary.status)
      ? { tone: 'warning' as const, label: 'Website changed' }
      : BADGE[summary.status]
  return (
    <span title={badgeTitle(summary)}>
      <StatusBadge tone={tone}>
        {isAnalysisActive(summary.status) ? <Loader2 size={10} className="adm-spin" aria-hidden /> : null}
        {label}
      </StatusBadge>
    </span>
  )
}

type Subject = { kind: 'lead' | 'prospect'; id: string }

const fetchAnalysis = (subject: Subject, signal?: AbortSignal) =>
  subject.kind === 'lead' ? getLeadAnalysis(subject.id, signal) : getProspectAnalysis(subject.id, signal)
const requestAnalysis = (subject: Subject, refresh: boolean) =>
  subject.kind === 'lead' ? analyzeLeadWebsite(subject.id, refresh) : analyzeProspectWebsite(subject.id, refresh)

const actionError = (err: unknown) =>
  err instanceof ApiRequestError && err.status === 429
    ? err.message
    : errorMessage(err, 'Could not start the website analysis.')

/**
 * Loads, starts and polls one analysis. Starting is disabled while a request or an
 * analysis is in flight, so a double click never queues twice.
 */
function useAnalysis(subject: Subject, onSummary?: (summary: AnalysisSummary | null) => void, autoLoad = true) {
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState<{ tone: 'danger' | 'info'; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const inFlight = useRef(false)
  const [reloadKey, setReloadKey] = useState(0)
  const active = isAnalysisActive(analysis?.status)
  const { kind, id } = subject

  useEffect(() => {
    if (!autoLoad) return
    const controller = new AbortController()
    fetchAnalysis({ kind, id }, controller.signal)
      .then((res) => {
        setAnalysis(res.data)
        setLoadError(null)
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted || isUnauthorized(err)) return
        setLoadError(errorMessage(err, 'Could not load the website analysis.'))
      })
    return () => controller.abort()
  }, [kind, id, reloadKey, autoLoad])

  usePolling(
    async (signal) => {
      const { data } = await fetchAnalysis(subject, signal)
      setAnalysis(data)
      if (!isAnalysisActive(data.status)) onSummary?.(toSummary(data))
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
      const { data }: { data: AnalyzeResponse } = await requestAnalysis(subject, refresh)
      setAnalysis(data.analysis)
      onSummary?.(toSummary(data.analysis))
      if (data.outcome === 'reused') {
        setActionMessage({
          tone: 'info',
          text: data.analysis.analyzedAt
            ? `Showing the result from ${formatDateTime(data.analysis.analyzedAt)}. Use Refresh to check again.`
            : 'Showing the most recent result.',
        })
      }
    } catch (err) {
      if (!isUnauthorized(err)) setActionMessage({ tone: 'danger', text: actionError(err) })
    } finally {
      inFlight.current = false
      setBusy(false)
    }
  }

  return { analysis, loadError, actionMessage, busy, active, start, reload: () => setReloadKey((k) => k + 1) }
}

const yesNo = (value: boolean | null | undefined) => (value === true ? 'Yes' : value === false ? 'No' : 'Unknown')

const SITEMAP_SOURCE: Record<string, string> = {
  ROBOTS: 'listed in robots.txt',
  HTML_LINK: 'linked from the homepage',
  DEFAULT_PATH: 'standard location',
}

function ExternalUrl({ url, exact = false }: { url: string | null | undefined; exact?: boolean }) {
  const safe = safeHttpUrl(url)
  if (!url) return <span className="adm-muted">—</span>
  if (!safe) return <span className="adm-wa-break">{url}</span>
  return (
    <a className="adm-link adm-wa-break" href={safe} target="_blank" rel="noopener noreferrer nofollow">
      {exact ? safe.replace(/^https?:\/\//, '').replace(/\/$/, '') : displayHost(safe)}
    </a>
  )
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </>
  )
}

function AnalysisFacts({ analysis: a }: { analysis: WebsiteAnalysis }) {
  const av = a.availability
  const page = a.page
  const sd = a.structuredData
  const reached = av?.reachable === true
  const finalDiffers = av?.finalUrl && av.finalUrl !== a.website.normalizedWebsiteUrl
  const viewport =
    a.mobile?.viewportStatus === 'viewport_present'
      ? `Present${page?.viewport ? ` (${page.viewport})` : ''}`
      : a.mobile?.viewportStatus === 'viewport_missing'
        ? 'Missing'
        : 'Unknown'
  const robots = a.robots
  const robotsText =
    robots?.robotsTxtExists === true
      ? `Found${robots.robotsDisallowsAll ? ' — blocks all crawlers' : ''}`
      : robots?.robotsTxtExists === false
        ? 'Not found'
        : 'Could not be checked'
  const sitemap = a.sitemap
  const sdParts = [
    sd?.hasJsonLd ? `JSON-LD${sd.jsonLdTypes.length ? `: ${sd.jsonLdTypes.join(', ')}` : ''}` : null,
    sd?.openGraph.present ? 'Open Graph' : null,
    sd?.twitterCard.present ? `Twitter card${sd.twitterCard.card ? ` (${sd.twitterCard.card})` : ''}` : null,
  ].filter(Boolean)

  return (
    <dl className="adm-lw-meta adm-wa-facts">
      <Fact label="Website">
        <ExternalUrl url={a.website.websiteUrl} />
      </Fact>
      {finalDiffers ? (
        <Fact label="Led to">
          <ExternalUrl url={av?.finalUrl} exact />
          {av && av.redirectCount > 0 ? (
            <span className="adm-muted">
              {' '}
              · {av.redirectCount} redirect{av.redirectCount === 1 ? '' : 's'}
            </span>
          ) : null}
        </Fact>
      ) : null}
      <Fact label="Reachable">{yesNo(av?.reachable)}</Fact>
      <Fact label="HTTP">
        {av?.httpStatus ?? '—'}
        {av?.responseTimeMs != null ? <span className="adm-muted"> · {av.responseTimeMs} ms</span> : null}
      </Fact>
      <Fact label="HTTPS">{yesNo(av?.https)}</Fact>
      {reached ? (
        <>
          <Fact label="Page title">{page?.title || <span className="adm-muted">Missing</span>}</Fact>
          <Fact label="Meta description">{page?.metaDescription || <span className="adm-muted">Missing</span>}</Fact>
          <Fact label="Viewport">{viewport}</Fact>
          <Fact label="H1 headings">{a.content?.h1Count ?? 0}</Fact>
          {a.content && a.content.imageCount > 0 ? (
            <Fact label="Images without alt">
              {a.content.imagesWithoutAltCount} of {a.content.imageCount}
            </Fact>
          ) : null}
          <Fact label="Robots.txt">{robotsText}</Fact>
          <Fact label="Sitemap">
            {sitemap?.sitemapExists ? (
              <>
                <ExternalUrl url={sitemap.sitemapUrl} />
                {sitemap.sitemapSource ? (
                  <span className="adm-muted"> · {SITEMAP_SOURCE[sitemap.sitemapSource] ?? sitemap.sitemapSource}</span>
                ) : null}
              </>
            ) : sitemap?.sitemapExists === false ? (
              'Not found'
            ) : (
              'Not checked'
            )}
          </Fact>
          <Fact label="Structured data">{sdParts.length ? sdParts.join(' · ') : 'None found'}</Fact>
          <Fact label="Technologies">
            {a.technologies?.length ? (
              <span className="adm-wa-chips">
                {a.technologies.map((t) => (
                  <span key={t.name} className="adm-tag" title={`${t.confidence} confidence — ${t.evidence}`}>
                    {t.name}
                    {t.confidence !== 'HIGH' ? (
                      <span className="adm-muted"> ({t.confidence.toLowerCase()})</span>
                    ) : null}
                  </span>
                ))}
              </span>
            ) : (
              'None detected'
            )}
          </Fact>
          <Fact label="Social links">
            {a.socialLinks?.length ? (
              <span className="adm-wa-chips">
                {a.socialLinks.map((s) => {
                  const href = safeHttpUrl(s.url)
                  return href ? (
                    <a
                      key={s.url}
                      className="adm-tag adm-link"
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                    >
                      {s.platform}
                    </a>
                  ) : null
                })}
              </span>
            ) : (
              'None found on the website'
            )}
          </Fact>
        </>
      ) : null}
      {a.analyzedAt ? (
        <Fact label="Analyzed">
          {formatDateTime(a.analyzedAt)}
          {a.durationMs != null ? (
            <span className="adm-muted"> · took {(a.durationMs / 1000).toFixed(1)} s</span>
          ) : null}
        </Fact>
      ) : null}
    </dl>
  )
}

/** Website facts for one sales lead, with an explicit Analyze / Refresh action. No AI involved. */
export function WebsiteAnalysisPanel({
  leadId,
  onSummary,
}: {
  leadId: string
  onSummary?: (summary: AnalysisSummary | null) => void
}) {
  const { analysis, loadError, actionMessage, busy, active, start, reload } = useAnalysis(
    { kind: 'lead', id: leadId },
    onSummary,
  )

  if (loadError) {
    return (
      <div className="adm-alert adm-alert--danger" role="alert">
        <span>{loadError}</span>
        <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={reload}>
          Retry
        </button>
      </div>
    )
  }
  if (!analysis) {
    return (
      <div className="adm-lw-drawer-loading">
        <span className="adm-skeleton" />
        <span className="adm-skeleton" />
      </div>
    )
  }

  const changed = analysis.websiteChanged === true
  const hasStored = analysis.id !== null && analysis.status !== 'CANCELLED'
  const refresh = hasStored && !changed
  const noWebsite = !analysis.website.hasWebsite && !changed
  const summary = toSummary(analysis)

  return (
    <div className="adm-wa-panel" aria-live="polite">
      <div className="adm-wa-head">
        <AnalysisBadge summary={summary} hasWebsite={analysis.website.hasWebsite} />
        <button
          type="button"
          className="adm-btn adm-btn--ghost adm-btn--sm"
          disabled={busy || active || noWebsite}
          title={noWebsite ? 'Add a website to this lead first' : undefined}
          onClick={() => void start(refresh)}
        >
          {busy || active ? (
            <Loader2 size={14} className="adm-spin" aria-hidden />
          ) : refresh ? (
            <RefreshCw size={14} aria-hidden />
          ) : (
            <ScanSearch size={14} aria-hidden />
          )}
          <span>
            {active ? 'Analyzing…' : refresh ? 'Refresh' : changed ? 'Analyze new website' : 'Analyze website'}
          </span>
        </button>
      </div>

      {actionMessage ? (
        <p className={`adm-wa-note ${actionMessage.tone === 'danger' ? 'is-danger' : ''}`} role="status">
          {actionMessage.text}
        </p>
      ) : null}

      {changed ? (
        <p className="adm-wa-note is-warning">
          The website was changed after this analysis. Analyze again to check the new address.
        </p>
      ) : null}

      {analysis.status === 'NOT_ANALYZED' || analysis.status === 'CANCELLED' ? (
        <p className="adm-muted adm-lw-hint">
          {noWebsite
            ? 'This lead has no website to analyze.'
            : 'Checks the homepage, robots.txt and sitemap and records what it finds. Nothing runs until you click Analyze.'}
        </p>
      ) : analysis.status === 'SKIPPED' ? (
        <p className="adm-muted adm-lw-hint">No website was recorded when this lead was checked.</p>
      ) : active ? (
        <p className="adm-wa-progress">
          <Loader2 size={14} className="adm-spin" aria-hidden />
          {analysis.status === 'QUEUED' ? 'Waiting to start…' : 'Checking the website…'}
        </p>
      ) : null}

      {analysis.status === 'FAILED' && analysis.errorMessage ? (
        <div className="adm-alert adm-alert--danger" role="alert">
          <span>{analysis.errorMessage}</span>
        </div>
      ) : null}

      {analysis.status === 'COMPLETED' || analysis.status === 'FAILED' || (active && analysis.analyzedAt) ? (
        <AnalysisFacts analysis={analysis} />
      ) : null}

      {analysis.evidence?.length && !active ? (
        <details className="adm-wa-evidence">
          <summary>Observations ({analysis.evidence.length})</summary>
          <ul>
            {analysis.evidence.map((e, i) => (
              <li key={`${e.type}-${i}`} className={`is-${e.severity.toLowerCase()}`}>
                <span className="adm-wa-evidence-source">{e.source}</span>
                <span>{e.evidence}</span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  )
}

/** Status plus an explicit "Analyze website" action for one discovered prospect. */
export function ProspectAnalysis({
  prospectId,
  website,
  summary: initial,
}: {
  prospectId: string
  website: string | null
  summary: AnalysisSummary | null | undefined
}) {
  const [local, setLocal] = useState<AnalysisSummary | null | undefined>(undefined)
  const { analysis, actionMessage, busy, active, start } = useAnalysis(
    { kind: 'prospect', id: prospectId },
    setLocal,
    isAnalysisActive(initial?.status),
  )
  const shown = analysis ? toSummary(analysis) : local !== undefined ? local : (initial ?? null)
  const running = active || isAnalysisActive(shown?.status)

  return (
    <div className="adm-row-actions adm-wa-prospect">
      <AnalysisBadge summary={shown} hasWebsite={Boolean(website)} />
      {website && !running && !shown ? (
        <button
          type="button"
          className="adm-btn adm-btn--ghost adm-btn--sm"
          onClick={() => void start(false)}
          disabled={busy}
        >
          {busy ? <Loader2 size={14} className="adm-spin" aria-hidden /> : <Globe size={14} aria-hidden />}
          <span>Analyze</span>
        </button>
      ) : null}
      {actionMessage?.tone === 'danger' ? (
        <span className="adm-field-error" role="alert">
          {actionMessage.text}
        </span>
      ) : null}
    </div>
  )
}
