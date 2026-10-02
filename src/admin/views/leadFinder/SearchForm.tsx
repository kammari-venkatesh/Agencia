import {
  Building2,
  Crosshair,
  FlaskConical,
  Loader2,
  MapPin,
  Plus,
  Radar,
  Search,
  Tags,
  TriangleAlert,
  X,
} from 'lucide-react'
import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { ApiRequestError } from '../../api/client'
import {
  createLeadFinderJob,
  formatUsd,
  type JobParams,
  type LeadFinderJob,
  type ProviderStatus,
  type SearchProvider,
} from '../../api/leadFinder'
import { REAL_SEARCH_UNAVAILABLE_COPY } from './jobStatus'

// Mirrors the server limits for instant feedback; the server remains authoritative.
const LIMITS = { maxBusinesses: 100, maxCategories: 10, maxRadiusKm: 50 }
const RADIUS_OPTIONS = [1, 2, 3, 5, 10, 25, 50]
const CATEGORY_SUGGESTIONS = [
  'Gyms',
  'Yoga Studios',
  'Salons',
  'Spas',
  'Restaurants',
  'Cafes',
  'Dental Clinics',
  'Bakeries',
]

type FieldErrors = Partial<Record<keyof JobParams, string>>

const validate = (params: JobParams): FieldErrors => {
  const errors: FieldErrors = {}
  if (params.location.length < 2) errors.location = 'Enter a city, area or neighbourhood.'
  if (!(params.radius > 0 && params.radius <= LIMITS.maxRadiusKm)) {
    errors.radius = `Choose a radius up to ${LIMITS.maxRadiusKm} km.`
  }
  if (params.categories.length === 0) errors.categories = 'Add at least one business category.'
  if (
    !Number.isInteger(params.maxBusinesses) ||
    params.maxBusinesses < 1 ||
    params.maxBusinesses > LIMITS.maxBusinesses
  ) {
    errors.maxBusinesses = `Enter a whole number from 1 to ${LIMITS.maxBusinesses}.`
  }
  return errors
}

type SearchFormProps = {
  onCreated: (job: LeadFinderJob) => void
  mode: SearchProvider
  onModeChange: (mode: SearchProvider) => void
  /** Real search availability from the server; null while loading (real search stays unavailable). */
  realSearch: ProviderStatus['providers']['apify'] | null
}

export function SearchForm({ onCreated, mode, onModeChange, realSearch }: SearchFormProps) {
  const live = mode === 'apify'
  const realAvailable = realSearch?.available === true
  const [confirmed, setConfirmed] = useState(false)
  const [location, setLocation] = useState('')
  const [radius, setRadius] = useState('10')
  const [categories, setCategories] = useState<string[]>([])
  const [categoryDraft, setCategoryDraft] = useState('')
  const [maxBusinesses, setMaxBusinesses] = useState('25')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const clearFieldError = (field: keyof JobParams) =>
    setFieldErrors((e) => (e[field] ? { ...e, [field]: undefined } : e))

  const addCategory = (raw: string) => {
    const value = raw.trim().replace(/\s+/g, ' ')
    setCategoryDraft('')
    if (value.length < 2) return
    if (categories.some((c) => c.toLowerCase() === value.toLowerCase())) return
    if (categories.length >= LIMITS.maxCategories) {
      setFieldErrors((e) => ({ ...e, categories: `You can add up to ${LIMITS.maxCategories} categories.` }))
      return
    }
    setCategories((list) => [...list, value])
    clearFieldError('categories')
  }

  const onCategoryKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addCategory(categoryDraft)
    } else if (e.key === 'Backspace' && categoryDraft === '' && categories.length > 0) {
      setCategories((list) => list.slice(0, -1))
    }
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const pending = categoryDraft.trim()
    const params: JobParams = {
      location: location.trim(),
      radius: Number(radius),
      categories:
        pending.length >= 2 && !categories.some((c) => c.toLowerCase() === pending.toLowerCase())
          ? [...categories, pending]
          : categories,
      maxBusinesses: Number(maxBusinesses),
    }

    const errors = validate(params)
    setFieldErrors(errors)
    setFormError(null)
    if (Object.keys(errors).length > 0) return
    if (live && (!realAvailable || !confirmed)) return

    setSubmitting(true)
    try {
      const res = await createLeadFinderJob(params, mode, live && confirmed)
      setCategories(params.categories)
      setCategoryDraft('')
      setConfirmed(false)
      onCreated(res.data.job)
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.status === 401) return
        const details = (err.details ?? {}) as FieldErrors & {
          code?: string
          provider?: string
          confirmRealSearch?: string
        }
        const { code, provider, confirmRealSearch, ...fields } = details
        setFieldErrors(fields)
        if (code || provider || confirmRealSearch || Object.keys(fields).length === 0) {
          setFormError(provider ?? confirmRealSearch ?? err.message)
        } else {
          setFormError('Please fix the highlighted fields.')
        }
      } else {
        setFormError('Could not start the search. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const suggestions = CATEGORY_SUGGESTIONS.filter((s) => !categories.some((c) => c.toLowerCase() === s.toLowerCase()))

  return (
    <section className="adm-card" aria-labelledby="lf-search-heading">
      <h2 id="lf-search-heading" className="adm-section-title">
        New search
      </h2>
      <p className="adm-section-desc">Searches run in the background. You can leave this page and come back.</p>

      <form className="adm-form adm-lf-form" onSubmit={onSubmit} noValidate>
        <fieldset className="adm-lf-full adm-lf-mode" aria-describedby="lf-mode-hint">
          <legend className="adm-field-label">SEARCH MODE</legend>
          <div className="adm-lf-mode-grid">
            <label className={`adm-lf-mode-option${mode === 'test' ? ' is-selected' : ''}`}>
              <input
                type="radio"
                name="lf-mode"
                value="test"
                checked={mode === 'test'}
                onChange={() => {
                  onModeChange('test')
                  setConfirmed(false)
                  setFormError(null)
                }}
              />
              <FlaskConical size={18} aria-hidden />
              <span>
                <span className="adm-cell-strong">Test data</span>
                <span className="adm-cell-sub">Built-in sample businesses. No Apify credits are used.</span>
              </span>
            </label>
            <label
              className={`adm-lf-mode-option adm-lf-mode-option--real${mode === 'apify' ? ' is-selected' : ''}`}
              data-disabled={realAvailable ? undefined : true}
            >
              <input
                type="radio"
                name="lf-mode"
                value="apify"
                checked={mode === 'apify'}
                disabled={!realAvailable}
                onChange={() => {
                  onModeChange('apify')
                  setConfirmed(false)
                  setFormError(null)
                }}
              />
              <Radar size={18} aria-hidden />
              <span>
                <span className="adm-cell-strong">Real Apify</span>
                <span className="adm-cell-sub">
                  {realAvailable
                    ? 'Uses Apify credits and real business data.'
                    : realSearch
                      ? (REAL_SEARCH_UNAVAILABLE_COPY[realSearch.unavailableReason ?? ''] ??
                        'Not available on this server.')
                      : 'Checking availability…'}
                </span>
              </span>
            </label>
          </div>
          <span id="lf-mode-hint" className="adm-field-hint">
            Test data is the default. Real searches must be chosen and confirmed every time.
          </span>
        </fieldset>

        <label className="adm-field adm-lf-location">
          <span className="adm-field-label">LOCATION</span>
          <span className="adm-input-wrap" data-invalid={fieldErrors.location ? true : undefined}>
            <MapPin size={16} aria-hidden />
            <input
              className="adm-input"
              placeholder="e.g. Hyderabad, Telangana"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value)
                clearFieldError('location')
              }}
              maxLength={100}
              aria-invalid={fieldErrors.location ? true : undefined}
              aria-describedby="lf-location-hint"
            />
          </span>
          <span id="lf-location-hint" className={fieldErrors.location ? 'adm-field-error' : 'adm-field-hint'}>
            {fieldErrors.location ??
              (live
                ? 'A place name, or coordinates such as “17.385, 78.486” for an exact centre.'
                : 'Any city, area or neighbourhood.')}
          </span>
        </label>

        <label className="adm-field">
          <span className="adm-field-label">RADIUS</span>
          <span className="adm-input-wrap" data-invalid={fieldErrors.radius ? true : undefined}>
            <Crosshair size={16} aria-hidden />
            <select
              className="adm-select adm-select--bare"
              value={radius}
              onChange={(e) => {
                setRadius(e.target.value)
                clearFieldError('radius')
              }}
              aria-describedby="lf-radius-hint"
            >
              {RADIUS_OPTIONS.map((km) => (
                <option key={km} value={km}>
                  {km} km
                </option>
              ))}
            </select>
          </span>
          <span id="lf-radius-hint" className={fieldErrors.radius ? 'adm-field-error' : 'adm-field-hint'}>
            {fieldErrors.radius ??
              (live
                ? 'Maximum distance from the search location.'
                : 'Maximum distance from the search location. Not applied to test data.')}
          </span>
        </label>

        <label className="adm-field">
          <span className="adm-field-label">MAXIMUM BUSINESSES</span>
          <span className="adm-input-wrap" data-invalid={fieldErrors.maxBusinesses ? true : undefined}>
            <Building2 size={16} aria-hidden />
            <input
              className="adm-input"
              type="number"
              inputMode="numeric"
              min={1}
              max={LIMITS.maxBusinesses}
              step={1}
              value={maxBusinesses}
              onChange={(e) => {
                setMaxBusinesses(e.target.value)
                clearFieldError('maxBusinesses')
              }}
              aria-invalid={fieldErrors.maxBusinesses ? true : undefined}
              aria-describedby="lf-max-hint"
            />
          </span>
          <span id="lf-max-hint" className={fieldErrors.maxBusinesses ? 'adm-field-error' : 'adm-field-hint'}>
            {fieldErrors.maxBusinesses ?? `Up to ${LIMITS.maxBusinesses} per search.`}
          </span>
        </label>

        <div className="adm-field adm-lf-categories">
          <label className="adm-field-label" htmlFor="lf-category-input">
            BUSINESS CATEGORIES
          </label>
          <div className="adm-input-wrap adm-chip-input" data-invalid={fieldErrors.categories ? true : undefined}>
            <Tags size={16} aria-hidden />
            {categories.map((c) => (
              <span key={c} className="adm-chip">
                {c}
                <button
                  type="button"
                  className="adm-chip-remove"
                  onClick={() => setCategories((list) => list.filter((x) => x !== c))}
                  aria-label={`Remove ${c}`}
                >
                  <X size={12} aria-hidden />
                </button>
              </span>
            ))}
            <input
              id="lf-category-input"
              className="adm-input"
              placeholder={categories.length === 0 ? 'Type a category and press Enter' : 'Add another'}
              value={categoryDraft}
              onChange={(e) => setCategoryDraft(e.target.value)}
              onKeyDown={onCategoryKeyDown}
              maxLength={60}
              aria-invalid={fieldErrors.categories ? true : undefined}
              aria-describedby="lf-categories-help"
            />
          </div>
          <span id="lf-categories-help" className={fieldErrors.categories ? 'adm-field-error' : 'adm-field-hint'}>
            {fieldErrors.categories ?? `Press Enter to add. Up to ${LIMITS.maxCategories} categories.`}
          </span>
          {suggestions.length > 0 ? (
            <div className="adm-chip-suggestions" aria-label="Suggested categories">
              {suggestions.map((s) => (
                <button key={s} type="button" className="adm-chip-suggestion" onClick={() => addCategory(s)}>
                  <Plus size={12} aria-hidden />
                  {s}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {formError ? (
          <div className="adm-alert adm-alert--danger adm-lf-full" role="alert">
            <span>{formError}</span>
          </div>
        ) : null}

        {live ? (
          <div className="adm-lf-full adm-lf-real-confirm">
            <div className="adm-alert adm-alert--warning" role="note">
              <TriangleAlert size={16} aria-hidden />
              <span>
                Real search uses Apify credits and saves real businesses to the database.
                {realSearch?.maxRunCostUsd != null
                  ? ` Each real search is capped at ${formatUsd(realSearch.maxRunCostUsd)}.`
                  : ''}
              </span>
            </div>
            <label className="adm-lf-check">
              <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
              <span>I understand this uses Apify credits.</span>
            </label>
          </div>
        ) : null}

        <div className="adm-lf-full adm-lf-actions">
          <button
            type="submit"
            className="adm-btn adm-btn--primary"
            disabled={submitting || (live && (!confirmed || !realAvailable))}
          >
            {submitting ? <Loader2 size={16} className="adm-spin" aria-hidden /> : <Search size={16} aria-hidden />}
            <span>{submitting ? 'Starting…' : live ? 'Start Real Search' : 'Start Test Search'}</span>
          </button>
        </div>
      </form>
    </section>
  )
}
