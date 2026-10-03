/**
 * Admin API client. The session lives in an httpOnly cookie set by the backend,
 * so requests only need `credentials: 'include'` — no token is ever handled here.
 */
// Empty by default: same-origin /api requests, forwarded to the backend by the dev-server
// proxy (vite.config.ts) and the production rewrite (vercel.json).
const API_BASE_URL = ((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '').replace(/\/+$/, '')

export class ApiRequestError extends Error {
  readonly status: number
  readonly details?: Record<string, string>

  constructor(status: number, message: string, details?: Record<string, string>) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.details = details
  }
}

type UnauthorizedHandler = (error: ApiRequestError) => void
let unauthorizedHandler: UnauthorizedHandler | null = null

/** Called whenever an authenticated request comes back 401 (expired or revoked session). */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  signal?: AbortSignal
  /** Skip the global 401 handler (used by login and the initial session check). */
  skipUnauthorizedHandler?: boolean
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal, skipUnauthorizedHandler = false } = options

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    throw new ApiRequestError(0, 'Cannot reach the server. Check your connection and try again.')
  }

  const payload = (await response.json().catch(() => null)) as {
    message?: string
    details?: Record<string, string>
  } | null

  if (!response.ok) {
    const error = new ApiRequestError(
      response.status,
      payload?.message ?? `Request failed (${response.status})`,
      payload?.details,
    )
    if (response.status === 401 && !skipUnauthorizedHandler) unauthorizedHandler?.(error)
    throw error
  }

  return payload as T
}

/** Downloads a file from an authenticated endpoint and saves it via a temporary link. */
export async function apiDownload(path: string, fallbackName: string): Promise<{ filename: string; headers: Headers }> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { credentials: 'include' })
  } catch {
    throw new ApiRequestError(0, 'Cannot reach the server. Check your connection and try again.')
  }
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null
    const error = new ApiRequestError(response.status, payload?.message ?? `Download failed (${response.status})`)
    if (response.status === 401) unauthorizedHandler?.(error)
    throw error
  }

  const disposition = response.headers.get('Content-Disposition') ?? ''
  const filename = /filename="([^"]+)"/.exec(disposition)?.[1] ?? fallbackName
  const url = URL.createObjectURL(await response.blob())
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return { filename, headers: response.headers }
}
