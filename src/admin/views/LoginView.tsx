import { Lock, LoaderCircle, Mail } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { navigate } from 'vike/client/router'
import { usePageContext } from 'vike-react/usePageContext'
import { ApiRequestError } from '../api/client'
import { useAdminAuth } from '../auth/adminAuthContext'
import { safeAdminRedirect } from '../paths'

export function LoginView() {
  const { status, sessionExpired, login } = useAdminAuth()
  const { urlParsed } = usePageContext()
  const redirectTo = safeAdminRedirect(urlParsed.search.next)
  const showExpired = sessionExpired || urlParsed.search.reason === 'expired'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated') void navigate(redirectTo)
  }, [status, redirectTo])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Enter your email or username and password.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await login(email.trim(), password)
    } catch (err) {
      setError(err instanceof ApiRequestError || err instanceof Error ? err.message : 'Sign in failed.')
      setPassword('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="adm-login">
      <div className="adm-login-panel">
        <div className="adm-login-brand">
          <span className="brand-font adm-login-logo">vridhiō</span>
          <span className="adm-brand-tag">ADMIN</span>
        </div>

        <h1 className="adm-login-title">Sign in</h1>
        <p className="adm-login-sub">Restricted area. Authorised Vridhio team members only.</p>

        {showExpired && !error ? (
          <div className="adm-alert adm-alert--warning" role="status">
            Your session has ended. Please sign in again.
          </div>
        ) : null}
        {error ? (
          <div className="adm-alert adm-alert--danger" role="alert">
            {error}
          </div>
        ) : null}

        <form className="adm-form" onSubmit={handleSubmit} noValidate>
          <label className="adm-field">
            <span className="adm-field-label">EMAIL OR USERNAME</span>
            <span className="adm-input-wrap">
              <Mail size={16} aria-hidden />
              <input
                type="text"
                autoCapitalize="none"
                spellCheck={false}
                className="adm-input"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                required
              />
            </span>
          </label>

          <label className="adm-field">
            <span className="adm-field-label">PASSWORD</span>
            <span className="adm-input-wrap">
              <Lock size={16} aria-hidden />
              <input
                type="password"
                className="adm-input"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                required
              />
            </span>
          </label>

          <button type="submit" className="adm-btn adm-btn--primary adm-btn--block" disabled={submitting || status === 'loading'}>
            {submitting ? <LoaderCircle size={16} className="adm-spin" aria-hidden /> : null}
            <span>{submitting ? 'Signing in…' : 'Sign in'}</span>
          </button>
        </form>
      </div>
    </div>
  )
}
