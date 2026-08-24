import type { Config } from 'vike/types'

export default {
  title: 'Page not found — Vridhio',
  description: 'The page you requested does not exist.',
  // Ensure unknown / error URLs are not treated as indexable homepage clones.
  // robots meta for _error is set in +Head.tsx
} satisfies Config
