import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin' // <-- BƯỚC 1: THÊM DÒNG NÀY

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(), 
  ],
  define: {
    'global': 'globalThis'
  }
})