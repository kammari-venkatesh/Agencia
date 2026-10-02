import { Archive, ArchiveRestore, ExternalLink, Globe, Loader2, MapPinned, Plus, Save, Trash2 } from 'lucide-react'
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { ApiRequestError } from '../../api/client'
import {
  archiveSalesLead,
  bulkUpdateSalesLeads,
  createSalesLead,
  getSalesLead,
  updateSalesLead,
  type LeadInput,
  type SalesLead,
  type SalesLeadDetail,
  type WorkspaceMeta,
} from '../../api/leadWorkspace'
import type { QualificationSummary } from '../../api/qualification'
import type { AnalysisSummary } from '../../api/websiteAnalysis'
import { leadFinderJobUrl, leadWorkspaceUrl } from '../../paths'
import { AiQualificationPanel } from './AiQualification'
import { Dialog } from './Dialog'
import { HumanReviewPanel } from './HumanReview'
import {
  errorMessage,
  fieldErrors,
  formatDateTime,
  isUnauthorized,
  safeHttpUrl,
  sourceLabel,
  statusLabel,
} from './leadFormat'
import { ServiceSelector } from './ServiceSelector'
import { LeadSourceBadge, LeadStatusBadge } from './StatusBadge'
import { TagEditor } from './TagEditor'
import { WebsiteAnalysisPanel } from './WebsiteAnalysis'

export type DrawerTarget = { mode: 'view'; id: string } | { mode: 'create' }

type LeadDetailDrawerProps = {
  target: DrawerTarget
  meta: WorkspaceMeta | null
  onClose: () => void
  /** Called after any successful write so the list can refresh. */
  onChanged: (lead: SalesLead, change: 'created' | 'updated' | 'archived' | 'restored') => void
  onOpenLead: (id: string) => void
  onAnalysisChange?: (leadId: string, summary: AnalysisSummary | null) => void
  onQualificationChange?: (leadId: string, summary: QualificationSummary) => void
}

type LoadState = { key: string; lead?: SalesLeadDetail; error?: string }

export function LeadDetailDrawer({
  target,
  meta,
  onClose,
  onChanged,
  onOpenLead,
  onAnalysisChange,
  onQualificationChange,
}: LeadDetailDrawerProps) {
  const leadId = target.mode === 'view' ? target.id : null
  const [reloadKey, setReloadKey] = useState(0)
  const [load, setLoad] = useState<LoadState | null>(null)
  const dirtyRef = useRef(false)
  const requestKey = `${leadId}#${reloadKey}`

  useEffect(() => {
    if (!leadId) return
    const controller = new AbortController()
    const key = `${leadId}#${reloadKey}`
    getSalesLead(leadId, controller.signal)
      .then((res) => setLoad({ key, lead: res.data }))
      .catch((err: unknown) => {
        if (controller.signal.aborted || isUnauthorized(err)) return
        setLoad({ key, error: errorMessage(err, 'Could not load this lead.') })
      })
    return () => controller.abort()
  }, [leadId, reloadKey])

  const close = () => {
    if (dirtyRef.current && !window.confirm('Discard unsaved changes?')) return
    onClose()
  }

  const handleChanged = (lead: SalesLead, change: Parameters<typeof onChanged>[1]) => {
    dirtyRef.current = false
    onChanged(lead, change)
    if (change === 'created') onOpenLead(lead.id)
    else setReloadKey((k) => k + 1)
  }

  const current = leadId && load?.key.startsWith(`${leadId}#`) ? load : null
  const lead = current?.lead ?? null
  const loading = leadId !== null && load?.key !== requestKey && !lead

  const title = target.mode === 'create' ? 'Add lead' : (lead?.businessName ?? 'Lead')
  const description =
    target.mode === 'create' ? (
      'Only the business name is required. Duplicates are checked before saving.'
    ) : lead ? (
      <span className="adm-row-actions">
        <LeadStatusBadge status={lead.status} />
        <LeadSourceBadge source={lead.source} />
        {lead.archived ? <span className="adm-tag">Archived</span> : null}
      </span>
    ) : null

  return (
    <Dialog title={title} description={description} variant="drawer" onClose={close}>
      {target.mode === 'create' ? (
        <LeadEditor
          lead={null}
          meta={meta}
          onDirtyChange={(dirty) => (dirtyRef.current = dirty)}
          onChanged={handleChanged}
          onOpenLead={onOpenLead}
        />
      ) : loading ? (
        <div className="adm-lw-drawer-loading">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="adm-skeleton" />
          ))}
        </div>
      ) : current?.error ? (
        <div className="adm-alert adm-alert--danger" role="alert">
          <span>{current.error}</span>
          <button
            type="button"
            className="adm-btn adm-btn--ghost adm-btn--sm"
            onClick={() => setReloadKey((k) => k + 1)}
          >
            Retry
          </button>
        </div>
      ) : lead ? (
        <LeadEditor
          key={`${lead.id}:${lead.updatedAt}`}
          lead={lead}
          meta={meta}
          onDirtyChange={(dirty) => (dirtyRef.current = dirty)}
          onChanged={handleChanged}
          onOpenLead={onOpenLead}
          onAnalysisChange={onAnalysisChange}
          onQualificationChange={onQualificationChange}
        />
      ) : null}
    </Dialog>
  )
}

const TEXT_FIELDS = [
  'businessName',
  'category',
  'contactName',
  'phone',
  'email',
  'website',
  'address',
  'city',
  'state',
  'country',
  'googleMapsUrl',
] as const
type TextField = (typeof TEXT_FIELDS)[number]

type Draft = Record<TextField, string> & {
  status: string
  potentialServices: string[]
  tags: string[]
  notes: string
  assignedTo: string
  customFields: { id: number; key: string; value: string }[]
}

const toDraft = (lead: SalesLead | null): Draft => ({
  ...(Object.fromEntries(TEXT_FIELDS.map((key) => [key, lead?.[key] ?? ''])) as Record<TextField, string>),
  status: lead?.status ?? 'NEW',
  potentialServices: lead?.potentialServices ?? [],
  tags: lead?.tags ?? [],
  notes: lead?.notes ?? '',
  assignedTo: lead?.assignedTo?.id ?? '',
  customFields: Object.entries(lead?.customFields ?? {}).map(([key, value], id) => ({ id, key, value })),
})

const customFieldsObject = (rows: Draft['customFields']) =>
  Object.fromEntries(rows.filter((row) => row.key.trim()).map((row) => [row.key.trim(), row.value]))

const sameList = (a: string[], b: string[]) => a.length === b.length && a.every((v, i) => v === b[i])

/** Only the fields that differ from the saved lead (everything non-empty when creating). */
const buildPayload = (draft: Draft, base: Draft): LeadInput => {
  const payload: LeadInput = {}
  for (const key of TEXT_FIELDS) {
    const value = draft[key].trim()
    if (value === base[key].trim()) continue
    if (key === 'businessName') payload.businessName = value
    else payload[key] = value || null
  }
  if (draft.status !== base.status) payload.status = draft.status
  if (!sameList(draft.potentialServices, base.potentialServices)) payload.potentialServices = draft.potentialServices
  if (!sameList(draft.tags, base.tags)) payload.tags = draft.tags
  if (draft.notes !== base.notes) payload.notes = draft.notes
  if (draft.assignedTo !== base.assignedTo) payload.assignedTo = draft.assignedTo || null
  const custom = customFieldsObject(draft.customFields)
  if (JSON.stringify(custom) !== JSON.stringify(customFieldsObject(base.customFields))) payload.customFields = custom
  return payload
}

type LeadEditorProps = {
  lead: SalesLeadDetail | null
  meta: WorkspaceMeta | null
  onDirtyChange: (dirty: boolean) => void
  onChanged: (lead: SalesLead, change: 'created' | 'updated' | 'archived' | 'restored') => void
  onOpenLead: (id: string) => void
  onAnalysisChange?: LeadDetailDrawerProps['onAnalysisChange']
  onQualificationChange?: LeadDetailDrawerProps['onQualificationChange']
}

function LeadEditor({
  lead,
  meta,
  onDirtyChange,
  onChanged,
  onOpenLead,
  onAnalysisChange,
  onQualificationChange,
}: LeadEditorProps) {
  const [base] = useState(() => toDraft(lead))
  const [draft, setDraft] = useState(base)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<{ message: string; existingLeadId?: string } | null>(null)
  const [busy, setBusy] = useState<'save' | 'archive' | null>(null)
  // Changes when the website analysis finishes, so the AI section re-reads its state.
  const [analysisStamp, setAnalysisStamp] = useState('')
  // Changes when the AI qualification finishes, so the review section re-reads readiness.
  const [qualificationStamp, setQualificationStamp] = useState('')
  const nextCustomId = useRef(draft.customFields.length)

  const payload = buildPayload(draft, base)
  const dirty = Object.keys(payload).length > 0
  const limits = meta?.limits

  useEffect(() => {
    onDirtyChange(dirty)
  }, [dirty, onDirtyChange])

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }))
    if (errors[key]) {
      setErrors((current) => {
        const next = { ...current }
        delete next[key]
        return next
      })
    }
  }

  const save = async (event: FormEvent) => {
    event.preventDefault()
    if (!draft.businessName.trim()) {
      setErrors({ businessName: 'Business name is required.' })
      return
    }
    if (!dirty) return
    setBusy('save')
    setFormError(null)
    try {
      if (lead) onChanged((await updateSalesLead(lead.id, payload)).data, 'updated')
      else onChanged((await createSalesLead(payload)).data, 'created')
    } catch (err) {
      if (isUnauthorized(err)) return
      setErrors(fieldErrors(err))
      const existingLeadId =
        err instanceof ApiRequestError && err.status === 409 ? err.details?.existingLeadId : undefined
      setFormError({ message: errorMessage(err, 'Could not save this lead.'), existingLeadId })
    } finally {
      setBusy(null)
    }
  }

  const toggleArchive = async () => {
    if (!lead) return
    if (!lead.archived && !window.confirm(`Archive “${lead.businessName}”? It will be hidden from the workspace.`))
      return
    setBusy('archive')
    setFormError(null)
    try {
      if (lead.archived) {
        await bulkUpdateSalesLeads([lead.id], 'unarchive')
        onChanged({ ...lead, archived: false }, 'restored')
      } else {
        onChanged((await archiveSalesLead(lead.id)).data, 'archived')
      }
    } catch (err) {
      if (isUnauthorized(err)) return
      setFormError({ message: errorMessage(err, 'Could not update this lead.') })
    } finally {
      setBusy(null)
    }
  }

  const text = (key: TextField, label: string, opts: { type?: string; maxLength: number; required?: boolean }) => (
    <TextInput
      label={label}
      value={draft[key]}
      error={errors[key]}
      type={opts.type}
      maxLength={opts.maxLength}
      required={opts.required}
      onChange={(value) => set(key, value)}
    />
  )

  const website = safeHttpUrl(lead?.website)
  const maps = safeHttpUrl(lead?.googleMapsUrl)
  const statuses = meta?.statuses ?? [draft.status]

  return (
    <form className="adm-lw-editor" onSubmit={save} noValidate>
      {formError ? (
        <div className="adm-alert adm-alert--danger" role="alert">
          <span>{formError.message}</span>
          {formError.existingLeadId ? (
            <a
              className="adm-btn adm-btn--ghost adm-btn--sm"
              href={leadWorkspaceUrl(formError.existingLeadId)}
              onClick={(e) => {
                e.preventDefault()
                onOpenLead(formError.existingLeadId as string)
              }}
            >
              Open existing lead
            </a>
          ) : null}
        </div>
      ) : null}

      <Section title="Business">
        <div className="adm-lw-grid">
          {text('businessName', 'Business name', { maxLength: 200, required: true })}
          {text('category', 'Category', { maxLength: 100 })}
          {text('website', 'Website', { type: 'url', maxLength: 500 })}
          {text('googleMapsUrl', 'Google Maps URL', { type: 'url', maxLength: 1000 })}
          <div className="adm-lw-span">{text('address', 'Address', { maxLength: 300 })}</div>
          {text('city', 'City', { maxLength: 100 })}
          {text('state', 'State', { maxLength: 100 })}
          {text('country', 'Country', { maxLength: 100 })}
        </div>
      </Section>

      <Section title="Contact">
        <div className="adm-lw-grid">
          {text('contactName', 'Contact name', { maxLength: 120 })}
          {text('phone', 'Phone', { type: 'tel', maxLength: 40 })}
          <div className="adm-lw-span">{text('email', 'Email', { type: 'email', maxLength: 254 })}</div>
        </div>
      </Section>

      <Section title="Sales">
        <div className="adm-lw-grid">
          <SelectInput label="Status" value={draft.status} error={errors.status} onChange={(v) => set('status', v)}>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {statusLabel(status)}
              </option>
            ))}
          </SelectInput>
          <SelectInput
            label="Assigned to"
            value={draft.assignedTo}
            error={errors.assignedTo}
            onChange={(v) => set('assignedTo', v)}
          >
            <option value="">Unassigned</option>
            {(meta?.admins ?? []).map((admin) => (
              <option key={admin.id} value={admin.id}>
                {admin.email}
              </option>
            ))}
          </SelectInput>
        </div>
        <ServiceSelector
          services={meta?.services ?? draft.potentialServices}
          value={draft.potentialServices}
          onChange={(v) => set('potentialServices', v)}
        />
        {errors.potentialServices ? <p className="adm-field-error">{errors.potentialServices}</p> : null}
        <TagEditor
          value={draft.tags}
          onChange={(v) => set('tags', v)}
          suggestions={meta?.facets.tags}
          max={limits?.maxTags ?? 20}
          maxLength={limits?.tagMaxLength ?? 40}
        />
        {errors.tags ? <p className="adm-field-error">{errors.tags}</p> : null}
      </Section>

      {lead ? (
        <Section title="Source">
          <dl className="adm-lw-meta">
            <dt>Source</dt>
            <dd>{sourceLabel(lead.source)}</dd>
            {lead.sourceDetail ? (
              <>
                <dt>Detail</dt>
                <dd>{lead.sourceDetail}</dd>
              </>
            ) : null}
            {lead.sourceId ? (
              <>
                <dt>Source ID</dt>
                <dd className="adm-mono">{lead.sourceId}</dd>
              </>
            ) : null}
            {lead.prospect ? (
              <>
                <dt>Prospect</dt>
                <dd>
                  <a className="adm-link adm-inline-link" href={leadFinderJobUrl(lead.prospect.jobId)}>
                    View discovery search <ExternalLink size={12} aria-hidden />
                  </a>
                </dd>
              </>
            ) : null}
            <dt>Added</dt>
            <dd>{formatDateTime(lead.createdAt)}</dd>
            <dt>Updated</dt>
            <dd>{formatDateTime(lead.updatedAt)}</dd>
          </dl>
        </Section>
      ) : null}

      <Section title="Notes">
        <NotesInput
          value={draft.notes}
          max={limits?.notesMaxLength ?? 5000}
          error={errors.notes}
          onChange={(v) => set('notes', v)}
        />
      </Section>

      <Section title="Custom Fields">
        {draft.customFields.length === 0 ? (
          <p className="adm-muted adm-lw-hint">
            No custom fields. Imported columns that don't match a standard field appear here.
          </p>
        ) : (
          <div className="adm-lw-custom-list">
            {draft.customFields.map((row) => (
              <div key={row.id} className="adm-lw-custom-row">
                <input
                  className="adm-lw-plain-input"
                  aria-label="Field name"
                  placeholder="Field name"
                  value={row.key}
                  maxLength={60}
                  onChange={(e) =>
                    set(
                      'customFields',
                      draft.customFields.map((r) => (r.id === row.id ? { ...r, key: e.target.value } : r)),
                    )
                  }
                />
                <input
                  className="adm-lw-plain-input"
                  aria-label={`Value for ${row.key || 'field'}`}
                  placeholder="Value"
                  value={row.value}
                  maxLength={1000}
                  onChange={(e) =>
                    set(
                      'customFields',
                      draft.customFields.map((r) => (r.id === row.id ? { ...r, value: e.target.value } : r)),
                    )
                  }
                />
                <button
                  type="button"
                  className="adm-icon-btn"
                  aria-label={`Remove ${row.key || 'field'}`}
                  onClick={() =>
                    set(
                      'customFields',
                      draft.customFields.filter((r) => r.id !== row.id),
                    )
                  }
                >
                  <Trash2 size={14} aria-hidden />
                </button>
              </div>
            ))}
          </div>
        )}
        {errors.customFields ? <p className="adm-field-error">{errors.customFields}</p> : null}
        <button
          type="button"
          className="adm-btn adm-btn--ghost adm-btn--sm adm-lw-self-start"
          disabled={draft.customFields.length >= (limits?.maxCustomFields ?? 30)}
          onClick={() =>
            set('customFields', [...draft.customFields, { id: nextCustomId.current++, key: '', value: '' }])
          }
        >
          <Plus size={12} aria-hidden /> <span>Add field</span>
        </button>
      </Section>

      {lead ? (
        <Section title="Website Analysis">
          <WebsiteAnalysisPanel
            leadId={lead.id}
            onSummary={(summary) => {
              setAnalysisStamp(summary ? `${summary.id}:${summary.status}:${summary.analyzedAt}` : '')
              onAnalysisChange?.(lead.id, summary)
            }}
          />
        </Section>
      ) : null}

      {lead ? (
        <Section title="AI Qualification">
          <AiQualificationPanel
            leadId={lead.id}
            analysisStamp={analysisStamp}
            onSummary={(summary) => {
              setQualificationStamp(`${summary.id}:${summary.status}:${summary.completedAt}`)
              onQualificationChange?.(lead.id, summary)
            }}
          />
        </Section>
      ) : null}

      {lead ? (
        <Section title="Human Review">
          <HumanReviewPanel
            lead={lead}
            refreshStamp={`${analysisStamp}|${qualificationStamp}`}
            onLeadUpdated={async () => {
              if (dirty) return false
              onChanged((await getSalesLead(lead.id)).data, 'updated')
              return true
            }}
          />
        </Section>
      ) : null}

      <div className="adm-lw-editor-actions">
        <button
          type="submit"
          className="adm-btn adm-btn--primary adm-btn--sm"
          disabled={busy !== null || (!!lead && !dirty)}
        >
          {busy === 'save' ? <Loader2 size={14} className="adm-spin" aria-hidden /> : <Save size={14} aria-hidden />}
          <span>{lead ? 'Save changes' : 'Create lead'}</span>
        </button>
        {website ? (
          <a
            className="adm-btn adm-btn--ghost adm-btn--sm"
            href={website}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <Globe size={14} aria-hidden /> <span>Website</span>
          </a>
        ) : null}
        {maps ? (
          <a
            className="adm-btn adm-btn--ghost adm-btn--sm"
            href={maps}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <MapPinned size={14} aria-hidden /> <span>Google Maps</span>
          </a>
        ) : null}
        {lead ? (
          <button
            type="button"
            className={`adm-btn adm-btn--ghost adm-btn--sm ${lead.archived ? '' : 'adm-btn--danger'} adm-lw-push-end`}
            onClick={toggleArchive}
            disabled={busy !== null}
          >
            {busy === 'archive' ? (
              <Loader2 size={14} className="adm-spin" aria-hidden />
            ) : lead.archived ? (
              <ArchiveRestore size={14} aria-hidden />
            ) : (
              <Archive size={14} aria-hidden />
            )}
            <span>{lead.archived ? 'Restore' : 'Archive'}</span>
          </button>
        ) : null}
      </div>
    </form>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="adm-lw-section">
      <h3 className="adm-lw-section-title">{title}</h3>
      {children}
    </section>
  )
}

type TextInputProps = {
  label: string
  value: string
  error?: string
  type?: string
  maxLength: number
  required?: boolean
  onChange: (value: string) => void
}

function TextInput({ label, value, error, type = 'text', maxLength, required, onChange }: TextInputProps) {
  const id = useId()
  return (
    <div className="adm-field">
      <label className="adm-field-label" htmlFor={id}>
        {label.toUpperCase()}
        {required ? ' *' : ''}
      </label>
      <div className="adm-input-wrap">
        <input
          id={id}
          className="adm-input"
          type={type}
          value={value}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {error ? (
        <p id={`${id}-error`} className="adm-field-error">
          {error}
        </p>
      ) : null}
    </div>
  )
}

type SelectInputProps = {
  label: string
  value: string
  error?: string
  onChange: (v: string) => void
  children: ReactNode
}

function SelectInput({ label, value, error, onChange, children }: SelectInputProps) {
  const id = useId()
  return (
    <div className="adm-field">
      <label className="adm-field-label" htmlFor={id}>
        {label.toUpperCase()}
      </label>
      <select id={id} className="adm-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
      {error ? <p className="adm-field-error">{error}</p> : null}
    </div>
  )
}

function NotesInput({
  value,
  max,
  error,
  onChange,
}: {
  value: string
  max: number
  error?: string
  onChange: (v: string) => void
}) {
  const id = useId()
  return (
    <div className="adm-field">
      <label className="adm-visually-hidden" htmlFor={id}>
        Notes
      </label>
      <textarea
        id={id}
        className="adm-lw-textarea"
        rows={5}
        value={value}
        maxLength={max}
        placeholder="Call notes, context, next steps…"
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="adm-field-hint adm-lw-counter">
        {value.length.toLocaleString()} / {max.toLocaleString()}
      </span>
      {error ? <p className="adm-field-error">{error}</p> : null}
    </div>
  )
}
