import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    host: 'localhost'
  },
  resolve: {
    alias: {
      '@crwd/ui': '../../packages/ui/src',
      '@crwd/utils': '../../packages/utils/src'
    }
  }
})
