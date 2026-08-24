import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import vike from 'vike/plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), vike()],
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
