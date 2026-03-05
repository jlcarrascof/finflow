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
      name: 'remote_items',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.vue',
      },
      shared: ['vue', 'pinia', 'vue-router']
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5003,
    strictPort: true,
  },
  preview: { 
    port: 5003,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})