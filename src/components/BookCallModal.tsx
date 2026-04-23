import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
} from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { ensureCalEmbedScript, preloadCalEmbed } from '../lib/ensureCalEmbedScript'

const CAL_LINK = 'venkatesh-k-k2eoyp/consultation-call'

type EmbedStatus = 'idle' | 'loading' | 'ready' | 'error'

let calInitApplied = false
let calLinkReadyBound = false

function focusableSelector(): string {
  return [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ')
}

function getFocusable(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(focusableSelector())].filter(
    (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'),
  )
}

export function BookCallButton({
  className = '',
  children = 'Book a call',
  onPointerEnter,
  onFocus,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  // Warm the Cal embed on intent signals (hover / keyboard focus / touch hover)
  // so by the time click fires, embed.js is cached and Cal('init') has run.
  const warm = () => {
    void preloadCalEmbed()
  }
  return (
    <button
      type="button"
      className={['book-call-btn', className].filter(Boolean).join(' ')}
      onPointerEnter={(e) => {
        warm()
        onPointerEnter?.(e)
      }}
      onFocus={(e) => {
        warm()
        onFocus?.(e)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

type BookCallModalProps = {
  isOpen: boolean
  onClose: () => void
  /** Set true from the open click handler so the portal (and Cal host) stay mounted after close. */
  persistShell: boolean
}

export function BookCallModal({ isOpen, onClose, persistShell }: BookCallModalProps) {
  const reduceMotion = useReducedMotion()
  const keepPortalMounted = persistShell || isOpen

  const dialogRef = useRef<HTMLDivElement>(null)
  const calMountRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const inlineDoneRef = useRef(false)

  const [embedStatus, setEmbedStatus] = useState<EmbedStatus>('idle')
  const [retryNonce, setRetryNonce] = useState(0)

  useLayoutEffect(() => {
    if (!isOpen) return
    previousFocusRef.current = document.activeElement as HTMLElement | null
    queueMicrotask(() => {
      closeBtnRef.current?.focus()
    })
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      previousFocusRef.current?.focus?.()
      previousFocusRef.current = null
    }
  }, [isOpen])

  useEffect(() => {
    if (!keepPortalMounted) return

    let cancelled = false

    const run = async () => {
      setEmbedStatus((prev) => (prev === 'ready' && inlineDoneRef.current ? prev : 'loading'))

      try {
        await ensureCalEmbedScript()
        if (cancelled || !calMountRef.current) return

        const Cal = window.Cal
        if (typeof Cal !== 'function') {
          setEmbedStatus('error')
          return
        }

        if (!calInitApplied) {
          Cal('init', { origin: 'https://cal.com' })
          calInitApplied = true
        }

        // Flip to "ready" once Cal's iframe has actually loaded the link.
        // Firing earlier caused the scheduler to render with a zero-size
        // ResizeObserver measurement, leaving broken layout until a scroll.
        if (!calLinkReadyBound) {
          Cal('on', {
            action: 'linkReady',
            callback: () => {
              if (!cancelled) setEmbedStatus('ready')
            },
          })
          calLinkReadyBound = true
        }

        const mount = calMountRef.current
        if (mount && mount.childNodes.length > 0) {
          inlineDoneRef.current = true
          if (!cancelled) setEmbedStatus('ready')
          return
        }

        if (!inlineDoneRef.current && calMountRef.current) {
          // Cal's month_view is desktop-only; phones get a cramped calendar
          // unless we explicitly ask for the mobile layout.
          const isSmall =
            typeof window !== 'undefined' &&
            window.matchMedia?.('(max-width: 640px)').matches
          Cal('inline', {
            calLink: CAL_LINK,
            elementOrSelector: calMountRef.current,
            config: {
              theme: 'dark',
              layout: isSmall ? 'mobile' : 'month_view',
            },
          })
          inlineDoneRef.current = true
        }
      } catch {
        if (!cancelled) setEmbedStatus('error')
      }
    }

    const raf = requestAnimationFrame(() => {
      void run()
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [keepPortalMounted, retryNonce])

  const onKeyDownTrap = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return

      const nodes = getFocusable(dialogRef.current)
      if (nodes.length === 0) return

      const first = nodes[0]
      const last = nodes[nodes.length - 1]

      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    },
    [isOpen, onClose],
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', onKeyDownTrap, true)
    return () => document.removeEventListener('keydown', onKeyDownTrap, true)
  }, [isOpen, onKeyDownTrap])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  const transition = reduceMotion
    ? { duration: 0.01 }
    : { type: 'spring' as const, damping: 32, stiffness: 300, mass: 0.8 }

  const portal = keepPortalMounted
    ? createPortal(
        <div
          className={[
            'fixed inset-0 z-[200] flex items-stretch sm:items-center justify-center sm:p-6',
            isOpen ? 'pointer-events-auto' : 'pointer-events-none',
          ].join(' ')}
          aria-hidden={!isOpen}
        >
          <motion.div
            role="presentation"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={false}
            animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
            transition={transition}
            onClick={onClose}
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal={isOpen ? true : undefined}
            aria-label="Book a consultation call"
            aria-hidden={!isOpen}
            inert={!isOpen ? true : undefined}
            className={[
              'relative z-10 flex w-full max-w-4xl flex-col overflow-hidden bg-[#0a0a0a] shadow-2xl shadow-black/50',
              'rounded-none ring-0 sm:rounded-2xl sm:ring-1 sm:ring-white/10',
              isOpen ? 'pointer-events-auto' : 'pointer-events-none',
            ].join(' ')}
            initial={false}
            animate={
              isOpen
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: reduceMotion ? 0 : 40 }
            }
            transition={transition}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close booking dialog"
              className="absolute top-[max(env(safe-area-inset-top),12px)] right-3 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/80 text-white ring-1 ring-white/20 shadow-lg backdrop-blur-md transition active:scale-95 hover:bg-black/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 sm:top-3 sm:h-10 sm:w-10"
            >
              <X size={18} strokeWidth={2.25} aria-hidden />
            </button>

            <div
              className="relative w-full flex-1 bg-[#050505] h-[100dvh] max-h-[100dvh] pt-[max(env(safe-area-inset-top),8px)] sm:pt-10 sm:h-[82dvh] sm:max-h-[820px] sm:min-h-[640px]"
              data-lenis-prevent
            >
              <div
                ref={calMountRef}
                className="cal-embed-host relative h-full w-full"
              />

              {/* Branding mask: anchored to the bottom of the modal body, NOT
                  the scroll container. pointer-events:none so it never blocks
                  scroll or clicks on the iframe beneath. Covers Cal's "Cal.com"
                  watermark row when it scrolls into view. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-12 bg-[#050505] sm:h-14"
              />

              {(embedStatus === 'loading' || embedStatus === 'idle') ? (
                <div
                  className="pointer-events-none absolute inset-0 z-[2] flex flex-col gap-3 bg-[#050505] p-6 pt-16 transition-opacity duration-300"
                  aria-hidden
                >
                  <div className="h-4 w-1/3 animate-pulse rounded-md bg-white/10" />
                  <div className="h-[60vh] w-full animate-pulse rounded-xl bg-white/[0.06]" />
                </div>
              ) : null}

              {embedStatus === 'error' ? (
                <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-4 bg-[#050505] px-6 text-center">
                  <p className="text-sm text-white/70">We couldn&apos;t load the scheduler. Please try again.</p>
                  <button
                    type="button"
                    className="rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
                    onClick={() => setRetryNonce((n) => n + 1)}
                  >
                    Retry
                  </button>
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>,
        document.body,
      )
    : null

  return portal
}
