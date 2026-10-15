import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icono.svg'],
      manifest: {
        name: 'Panamá Seguro',
        short_name: 'Panamá Seguro',
        description: 'Reportes de afectaciones y respuesta ante desastres en Panamá',
        lang: 'es-PA',
        theme_color: '#0b5394',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [{ src: 'icono.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
      workbox: {
        // La interfaz funciona sin conexión; las llamadas a la API nunca se sirven desde caché.
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
  server: {
    // En desarrollo las APIs se alcanzan a través del nginx de compose.
    proxy: { '/api': 'http://localhost:8080' },
  },
})
