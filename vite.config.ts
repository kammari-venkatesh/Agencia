import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import vike from 'vike/plugin'

// The browser only ever calls its own origin (/api/...), so there is no CORS and the
// SameSite=Strict session cookie stays first-party. Production does the same with the
// rewrite in vercel.json. API_PROXY_TARGET=http://localhost:8000 uses a local backend.
const API_PROXY_TARGET = process.env.API_PROXY_TARGET ?? 'https://vridhio-backend.vercel.app'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), vike()],
  server: {
    proxy: {
      '/api': { target: API_PROXY_TARGET, changeOrigin: true, secure: true },
    },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/ogl')) return 'plasma-webgl'
          if (id.includes('node_modules/framer-motion')) return 'motion'
          if (id.includes('node_modules/lenis')) return 'lenis'
        },
      },
    },
  },
})
