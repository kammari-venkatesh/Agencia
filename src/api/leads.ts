export type LeadSubmission = {
  name: string
  email: string
  phone: string
  services: string[]
  message: string
}

export class LeadSubmitError extends Error {
  readonly details?: Record<string, string>

  constructor(message: string, details?: Record<string, string>) {
    super(message)
    this.name = 'LeadSubmitError'
    this.details = details
  }
}

/** Public contact form. Same-origin /api is proxied to the backend. */
export async function submitLead(lead: LeadSubmission) {
  let response: Response
  try {
    response = await fetch('/api/leads', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    })
  } catch {
    throw new LeadSubmitError('Cannot reach the server. Check your connection and try again.')
  }

  const payload = (await response.json().catch(() => null)) as {
    message?: string
    details?: Record<string, string>
  } | null

  if (!response.ok) {
    throw new LeadSubmitError(payload?.message ?? 'Could not send your message. Please try again.', payload?.details)
  }
}
