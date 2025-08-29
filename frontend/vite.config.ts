import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin' 
import { nodePolyfills } from 'vite-plugin-node-polyfills' 

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(), 
    nodePolyfills({
      protocolImports: true,
    }),
  ],
  define: {
    'global': 'globalThis'
  }
})