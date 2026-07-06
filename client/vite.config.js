import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
    configureServer(server) {
      // SPA fallback: any non-API, non-static GET should return index.html.
      // Without this, refreshing a client-side route like /dashboard or
      // /admin/dashboard returns Vite's 404 page ("Cannot GET /dashboard").
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET') return next();
        if (req.url.includes('.')) return next(); // static assets

        const indexPath = path.resolve(process.cwd(), 'dist/index.html')
        if (!fs.existsSync(indexPath)) return next()

        res.sendFile(indexPath)
      })
    },
  },
});
