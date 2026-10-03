import type { Config } from 'vike/types'

// Admin pages render only in the browser: no admin markup or data is ever produced at build time.
// Prerendering with ssr: false emits an empty HTML shell per route, which static hosting
// (Vercel) needs to serve /admin/* at all.
export default {
  ssr: false,
  prerender: true,
  title: 'Admin — Vridhio',
  description: 'Vridhio admin area.',
} satisfies Config
