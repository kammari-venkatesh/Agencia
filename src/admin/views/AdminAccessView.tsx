import { Copy, Eye, EyeOff, KeyRound, Loader2, RefreshCw, Trash2, UserPlus, Users } from 'lucide-react'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import {
  changeAdminPassword,
  createAdmin,
  listAdmins,
  removeAdmin,
  setAdminDisabled,
  type AdminUser,
} from '../api/admin'
import { ApiRequestError } from '../api/client'
import { useAdminAuth } from '../auth/adminAuthContext'
import { AdminShell } from '../components/AdminShell'
import { StatusBadge } from '../components/StatusBadge'
import { Dialog } from './leadWorkspace/Dialog'

const MIN_PASSWORD = 12
const MAX_PASSWORD = 128
const dateFormatter = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
const formatDate = (iso: string | null | undefined) => (iso ? dateFormatter.format(new Date(iso)) : '—')
const dayFormatter = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' })

const PASSWORD_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*-_'

/** 20 random characters from the browser's cryptographic generator. */
function generatePassword(length = 20) {
  const bytes = new Uint32Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => PASSWORD_CHARS[b % PASSWORD_CHARS.length]).join('')
}

const fieldErrors = (err: unknown): Record<string, string> =>
  err instanceof ApiRequestError && err.details && typeof err.details === 'object'
    ? Object.fromEntries(Object.entries(err.details).map(([k, v]) => [k, String(v)]))
    : {}

const errorText = (err: unknown, fallback: string) => (err instanceof Error ? err.message : fallback)
const isUnauthorized = (err: unknown) => err instanceof ApiRequestError && err.status === 401

const localPasswordError = (password: string, confirm: string) => {
  if (password.length < MIN_PASSWORD) return `Use at least ${MIN_PASSWORD} characters.`
  if (password.length > MAX_PASSWORD) return `Use at most ${MAX_PASSWORD} characters.`
  if (!password.trim()) return 'Password cannot be only spaces.'
  if (password !== confirm) return 'Passwords do not match.'
  return null
}

function PasswordFields({
  password,
  confirm,
  onPassword,
  onConfirm,
  error,
  autoComplete = 'new-password',
}: {
  password: string
  confirm: string
  onPassword: (v: string) => void
  onConfirm: (v: string) => void
  error?: string
  autoComplete?: string
}) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = () => {
    const next = generatePassword()
    onPassword(next)
    onConfirm(next)
    setVisible(true)
    setCopied(false)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <label className="adm-field">
        <span className="adm-field-label">PASSWORD</span>
        <span className="adm-input-wrap" data-invalid={error ? true : undefined}>
          <input
            type={visible ? 'text' : 'password'}
            className="adm-input"
            value={password}
            minLength={MIN_PASSWORD}
            maxLength={MAX_PASSWORD}
            autoComplete={autoComplete}
            onChange={(e) => {
              onPassword(e.target.value)
              setCopied(false)
            }}
          />
          <button
            type="button"
            className="adm-icon-btn adm-acc-inline-btn"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOff size={15} aria-hidden /> : <Eye size={15} aria-hidden />}
          </button>
        </span>
      </label>
      <label className="adm-field">
        <span className="adm-field-label">CONFIRM PASSWORD</span>
        <span className="adm-input-wrap" data-invalid={error ? true : undefined}>
          <input
            type={visible ? 'text' : 'password'}
            className="adm-input"
            value={confirm}
            maxLength={MAX_PASSWORD}
            autoComplete={autoComplete}
            onChange={(e) => onConfirm(e.target.value)}
          />
        </span>
      </label>
      <div className="adm-row-actions">
        <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={generate}>
          <RefreshCw size={13} aria-hidden /> <span>Generate strong password</span>
        </button>
        {password ? (
          <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => void copy()}>
            <Copy size={13} aria-hidden /> <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        ) : null}
      </div>
      <p className={error ? 'adm-field-error' : 'adm-field-hint'}>
        {error ?? `At least ${MIN_PASSWORD} characters. Share it privately; it is never shown again after saving.`}
      </p>
    </>
  )
}

function AddAdminForm({ onCreated }: { onCreated: (admin: AdminUser) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (busy) return
    const next: Record<string, string> = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email address.'
    const pwError = localPasswordError(password, confirm)
    if (pwError) next.password = pwError
    setErrors(next)
    setFormError(null)
    if (Object.keys(next).length) return
    setBusy(true)
    try {
      const { data } = await createAdmin(email.trim(), password)
      onCreated(data)
      setEmail('')
      setPassword('')
      setConfirm('')
    } catch (err) {
      if (isUnauthorized(err)) return
      setErrors(fieldErrors(err))
      setFormError(errorText(err, 'Could not create the admin.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="adm-card adm-acc-form-card" aria-labelledby="add-admin-heading">
      <h2 id="add-admin-heading" className="adm-section-title">
        Add admin
      </h2>
      <p className="adm-section-desc">New admins get full access to the admin panel.</p>
      <form className="adm-form adm-acc-form" onSubmit={submit} noValidate>
        {formError ? (
          <div className="adm-alert adm-alert--danger" role="alert">
            <span>{formError}</span>
          </div>
        ) : null}
        <label className="adm-field">
          <span className="adm-field-label">EMAIL</span>
          <span className="adm-input-wrap" data-invalid={errors.email ? true : undefined}>
            <input
              type="email"
              className="adm-input"
              value={email}
              maxLength={254}
              autoComplete="off"
              placeholder="teammate@company.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </span>
          {errors.email ? <span className="adm-field-error">{errors.email}</span> : null}
        </label>
        <PasswordFields
          password={password}
          confirm={confirm}
          onPassword={setPassword}
          onConfirm={setConfirm}
          error={errors.password}
        />
        <button type="submit" className="adm-btn adm-btn--primary" disabled={busy}>
          {busy ? <Loader2 size={16} className="adm-spin" aria-hidden /> : <UserPlus size={16} aria-hidden />}
          <span>Create admin</span>
        </button>
      </form>
    </section>
  )
}

function PasswordDialog({
  target,
  self,
  onClose,
  onDone,
}: {
  target: AdminUser
  self: boolean
  onClose: () => void
  onDone: (message: string) => void
}) {
  const [current, setCurrent] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (event?: FormEvent) => {
    event?.preventDefault()
    if (busy) return
    const pwError = localPasswordError(password, confirm)
    const next: Record<string, string> = {}
    if (pwError) next.password = pwError
    if (self && !current) next.currentPassword = 'Enter your current password.'
    setErrors(next)
    setFormError(null)
    if (Object.keys(next).length) return
    setBusy(true)
    try {
      await changeAdminPassword(target.id, password, self ? current : undefined)
      onDone(
        self
          ? 'Your password was changed. Your other sessions were signed out.'
          : `Password reset for ${target.email}. They were signed out everywhere.`,
      )
    } catch (err) {
      if (isUnauthorized(err)) return
      const details = fieldErrors(err)
      setErrors(details)
      setFormError(details.currentPassword ? null : errorText(err, 'Could not change the password.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog
      title={self ? 'Change your password' : `Reset password`}
      description={self ? undefined : target.email}
      onClose={onClose}
      footer={
        <div className="adm-row-actions">
          <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="adm-btn adm-btn--primary adm-btn--sm"
            disabled={busy}
            onClick={() => void submit()}
          >
            {busy ? <Loader2 size={14} className="adm-spin" aria-hidden /> : <KeyRound size={14} aria-hidden />}
            <span>{self ? 'Change password' : 'Reset password'}</span>
          </button>
        </div>
      }
    >
      <form className="adm-form" onSubmit={submit} noValidate>
        {formError ? (
          <div className="adm-alert adm-alert--danger" role="alert">
            <span>{formError}</span>
          </div>
        ) : null}
        {self ? (
          <label className="adm-field">
            <span className="adm-field-label">CURRENT PASSWORD</span>
            <span className="adm-input-wrap" data-invalid={errors.currentPassword ? true : undefined}>
              <input
                type="password"
                className="adm-input"
                value={current}
                maxLength={MAX_PASSWORD}
                autoComplete="current-password"
                onChange={(e) => setCurrent(e.target.value)}
              />
            </span>
            {errors.currentPassword ? <span className="adm-field-error">{errors.currentPassword}</span> : null}
          </label>
        ) : (
          <p className="adm-section-desc">Setting a new password signs this admin out of every device.</p>
        )}
        <PasswordFields
          password={password}
          confirm={confirm}
          onPassword={setPassword}
          onConfirm={setConfirm}
          error={errors.password}
        />
        <button type="submit" hidden aria-hidden />
      </form>
    </Dialog>
  )
}

type LoadState = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; admins: AdminUser[] }

export function AdminAccessView() {
  const { admin: me } = useAdminAuth()
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [reloadKey, setReloadKey] = useState(0)
  const [notice, setNotice] = useState<{ tone: 'success' | 'danger'; text: string } | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [passwordFor, setPasswordFor] = useState<AdminUser | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    listAdmins(controller.signal)
      .then((res) => setState({ status: 'ready', admins: res.data }))
      .catch((err: unknown) => {
        if (controller.signal.aborted || isUnauthorized(err)) return
        setState({ status: 'error', message: errorText(err, 'Could not load admins.') })
      })
    return () => controller.abort()
  }, [reloadKey])

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])
  const admins = state.status === 'ready' ? state.admins : []
  const activeCount = admins.filter((a) => !a.disabled).length

  const replace = (updated: AdminUser) =>
    setState((s) =>
      s.status === 'ready' ? { ...s, admins: s.admins.map((a) => (a.id === updated.id ? updated : a)) } : s,
    )

  const toggle = async (target: AdminUser) => {
    const disabling = !target.disabled
    if (disabling && !window.confirm(`Deactivate ${target.email}? They will be signed out and unable to sign in.`))
      return
    setBusyId(target.id)
    setNotice(null)
    try {
      const { data } = await setAdminDisabled(target.id, disabling)
      replace(data)
      setNotice({ tone: 'success', text: `${target.email} ${disabling ? 'deactivated' : 'reactivated'}.` })
    } catch (err) {
      if (!isUnauthorized(err)) setNotice({ tone: 'danger', text: errorText(err, 'Could not update this admin.') })
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (target: AdminUser) => {
    if (!window.confirm(`Permanently remove ${target.email}? Leads assigned to them become unassigned.`)) return
    setBusyId(target.id)
    setNotice(null)
    try {
      await removeAdmin(target.id)
      setState((s) => (s.status === 'ready' ? { ...s, admins: s.admins.filter((a) => a.id !== target.id) } : s))
      setNotice({ tone: 'success', text: `${target.email} removed.` })
    } catch (err) {
      if (!isUnauthorized(err)) setNotice({ tone: 'danger', text: errorText(err, 'Could not remove this admin.') })
    } finally {
      setBusyId(null)
    }
  }

  return (
    <AdminShell
      title="Admin Access"
      description="Create and manage the accounts that can sign in to this admin panel."
      actions={
        <button type="button" className="adm-btn adm-btn--ghost" onClick={reload} disabled={state.status === 'loading'}>
          <RefreshCw size={16} aria-hidden />
          <span>Refresh</span>
        </button>
      }
    >
      {notice ? (
        <div
          className={`adm-alert ${notice.tone === 'success' ? 'adm-alert--success' : 'adm-alert--danger'}`}
          role="status"
        >
          <span>{notice.text}</span>
          <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setNotice(null)}>
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="adm-acc-layout">
        <section className="adm-card adm-table-card" aria-labelledby="admins-heading">
          <div className="adm-table-toolbar">
            <div>
              <h2 id="admins-heading" className="adm-section-title">
                Admins
              </h2>
              <p className="adm-section-desc">
                {state.status === 'ready' ? `${activeCount} active of ${admins.length}` : 'Loading…'} · Deactivated
                admins cannot sign in.
              </p>
            </div>
          </div>

          {state.status === 'error' ? (
            <div className="adm-alert adm-alert--danger" role="alert">
              <span>{state.message}</span>
              <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={reload}>
                Try again
              </button>
            </div>
          ) : (
            <div className="adm-table-scroll">
              <table className="adm-table adm-acc-table">
                <thead>
                  <tr>
                    <th scope="col">Admin</th>
                    <th scope="col">Status</th>
                    <th scope="col">
                      <span className="adm-visually-hidden">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {state.status === 'loading'
                    ? Array.from({ length: 2 }, (_, i) => (
                        <tr key={i} aria-hidden>
                          {Array.from({ length: 3 }, (_, j) => (
                            <td key={j}>
                              <span className="adm-skeleton" />
                            </td>
                          ))}
                        </tr>
                      ))
                    : admins.map((a) => {
                        const self = a.id === me?.id
                        const busy = busyId === a.id
                        return (
                          <tr key={a.id}>
                            <td>
                              <span className="adm-cell-strong">
                                {a.email} {self ? <span className="adm-tag">You</span> : null}
                              </span>
                              <span className="adm-cell-sub">
                                Added {dayFormatter.format(new Date(a.createdAt))}{' '}
                                {a.createdBy?.email
                                  ? `by ${a.createdBy.email}`
                                  : a.createdBy
                                    ? 'by a removed admin'
                                    : 'during initial setup'}
                              </span>
                            </td>
                            <td>
                              {a.disabled ? (
                                <StatusBadge tone="neutral">Deactivated</StatusBadge>
                              ) : (
                                <StatusBadge tone="success">Active</StatusBadge>
                              )}
                              <span className="adm-cell-sub">
                                {a.lastLoginAt ? `Last sign-in ${formatDate(a.lastLoginAt)}` : 'Never signed in'}
                              </span>
                            </td>
                            <td>
                              <div className="adm-row-actions adm-acc-actions">
                                <button
                                  type="button"
                                  className="adm-btn adm-btn--ghost adm-btn--sm"
                                  disabled={busy || a.disabled}
                                  onClick={() => setPasswordFor(a)}
                                  aria-label={self ? 'Change your password' : `Reset password for ${a.email}`}
                                  title={self ? 'Change your password' : 'Reset password'}
                                >
                                  <KeyRound size={13} aria-hidden />
                                  <span>Password</span>
                                </button>
                                {self ? null : (
                                  <button
                                    type="button"
                                    className="adm-btn adm-btn--ghost adm-btn--sm"
                                    disabled={busy}
                                    onClick={() => void toggle(a)}
                                  >
                                    {busy ? <Loader2 size={13} className="adm-spin" aria-hidden /> : null}
                                    <span>{a.disabled ? 'Reactivate' : 'Deactivate'}</span>
                                  </button>
                                )}
                                {!self && a.disabled ? (
                                  <button
                                    type="button"
                                    className="adm-btn adm-btn--danger adm-btn--sm"
                                    disabled={busy}
                                    onClick={() => void remove(a)}
                                  >
                                    <Trash2 size={13} aria-hidden /> <span>Remove</span>
                                  </button>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                </tbody>
              </table>
              {state.status === 'ready' && admins.length === 0 ? (
                <div className="adm-empty">
                  <Users size={24} aria-hidden />
                  <span>No admins found.</span>
                </div>
              ) : null}
            </div>
          )}
        </section>

        <AddAdminForm
          onCreated={(created) => {
            setState((s) => (s.status === 'ready' ? { ...s, admins: [...s.admins, created] } : s))
            setNotice({
              tone: 'success',
              text: `${created.email} can now sign in. Share the password privately; it won't be shown again.`,
            })
          }}
        />
      </div>

      {passwordFor ? (
        <PasswordDialog
          target={passwordFor}
          self={passwordFor.id === me?.id}
          onClose={() => setPasswordFor(null)}
          onDone={(message) => {
            setPasswordFor(null)
            setNotice({ tone: 'success', text: message })
            reload()
          }}
        />
      ) : null}
    </AdminShell>
  )
}
