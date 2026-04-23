const CAL_EMBED_SRC = 'https://app.cal.com/embed/embed.js'

let loadPromise: Promise<void> | null = null
let prewarmPromise: Promise<void> | null = null
let calInitDone = false

/**
 * Pre-initializes window.Cal as a queue stub (official Cal.com embed pattern).
 * embed.js expects this stub to already exist when it runs — it reads Cal.q
 * to replay buffered calls. Without this, embed.js throws "Cal is not defined".
 */
function initCalStub(): void {
  if (typeof window === 'undefined' || typeof window.Cal === 'function') return

  type CalQueue = ((...args: unknown[]) => void) & {
    q: unknown[][]
    loaded: boolean
    ns: Record<string, unknown>
  }

  const cal = function (...args: unknown[]) {
    ;(cal as unknown as CalQueue).q.push(args)
  } as unknown as CalQueue

  cal.q = []
  cal.loaded = false
  cal.ns = {}
  window.Cal = cal as unknown as (...args: unknown[]) => void
}

/**
 * Loads Cal.com embed.js once. Dedupes concurrent calls and reuses an existing script tag.
 */
export function ensureCalEmbedScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve()
  }

  // Always ensure the stub exists before we do anything else
  initCalStub()

  if (loadPromise) {
    return loadPromise
  }

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${CAL_EMBED_SRC}"], script[src*="app.cal.com/embed/embed.js"]`,
    )

    const onReady = () => {
      resolve()
    }

    const onFail = () => {
      loadPromise = null
      reject(new Error('Failed to load Cal.com embed script'))
    }

    if (existing) {
      if (typeof window.Cal === 'function') {
        onReady()
        return
      }
      existing.addEventListener('load', onReady, { once: true })
      existing.addEventListener('error', onFail, { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = CAL_EMBED_SRC
    script.async = true
    script.dataset.calEmbed = 'true'
    script.addEventListener('load', onReady, { once: true })
    script.addEventListener('error', onFail, { once: true })
    document.head.appendChild(script)
  })

  return loadPromise
}

/**
 * Warm the Cal embed before the user opens the modal: downloads embed.js and
 * runs Cal('init') once. Safe to call repeatedly — subsequent calls are no-ops.
 * Used on idle after first paint, and on Book-call button hover/focus, so the
 * first real Cal('inline', …) only has to wait for Cal's iframe to render.
 */
export function preloadCalEmbed(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (prewarmPromise) return prewarmPromise

  prewarmPromise = ensureCalEmbedScript()
    .then(() => {
      if (calInitDone) return
      const Cal = window.Cal
      if (typeof Cal === 'function') {
        Cal('init', { origin: 'https://cal.com' })
        calInitDone = true
      }
    })
    .catch(() => {
      // Let BookCallModal's own flow retry on real open; don't cache the failure.
      prewarmPromise = null
    })

  return prewarmPromise
}
