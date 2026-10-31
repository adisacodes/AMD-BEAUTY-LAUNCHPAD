import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // The API runs separately: `npm run server`.
    // Keep the browser's Host header so the server's same-origin check matches.
    proxy: { '/api': { target: 'http://localhost:3001', changeOrigin: false } },
  },
})
