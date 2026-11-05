import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Automatic SPA Multi-Route Generator for Vercel / Static Hosting
function generateSpaRoutesPlugin() {
  const routes = [
    'contact',
    'about',
    'sales',
    'sale',
    'new-arrivals',
    'newarrivals',
    'categories',
    'stitched',
    'stitch',
    'unstitched',
    'baby-clothes',
    'babies',
    'kids',
    'baby',
    'cart',
    'wishlist',
    'checkout',
    'quick-view',
    'quickview',
    'product',
    'admin'
  ]

  return {
    name: 'generate-spa-routes',
    closeBundle() {
      try {
        const distDir = path.resolve(__dirname, 'dist')
        const indexPath = path.join(distDir, 'index.html')
        const notFoundPath = path.join(distDir, '404.html')

        if (fs.existsSync(indexPath)) {
          // 1. Create dist/404.html
          fs.copyFileSync(indexPath, notFoundPath)

          // 2. Create static directories and index.html for all SPA routes
          for (const route of routes) {
            const routeDir = path.join(distDir, route)
            if (!fs.existsSync(routeDir)) {
              fs.mkdirSync(routeDir, { recursive: true })
            }
            fs.copyFileSync(indexPath, path.join(routeDir, 'index.html'))
          }
          console.log(`✓ Generated physical index.html for ${routes.length} SPA routes + 404.html fallback`)
        }
      } catch (err) {
        console.warn('Could not generate static SPA routes:', err)
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    generateSpaRoutesPlugin()
  ],
})
