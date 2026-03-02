import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import federation from '@originjs/vite-plugin-federation'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    federation({
      name: 'shell',
      // Aquí mapearemos los MFEs remotos a medida que los vayamos creando
      remotes: {},
      // Compartimos las librerías core para que no se descarguen múltiples veces
      shared: ['vue', 'pinia', 'vue-router']
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5000,
    strictPort: true,
  },
  build: {
    // Top-level await es necesario para Module Federation en Vite
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})