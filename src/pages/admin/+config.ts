import type { Config } from 'vike/types'

// Admin pages render only in the browser: no admin markup or data is ever produced at build time.
export default {
  ssr: false,
  prerender: false,
  title: 'Admin — Vridhio',
  description: 'Vridhio admin area.',
} satisfies Config
