import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('three') || id.includes('@react-three')) return 'three-vendor'
          if (id.includes('framer-motion')) return 'motion-vendor'
          if (id.includes('node_modules/react') || id.includes('react-router')) return 'react-vendor'
        },
      },
    },
  },
})
