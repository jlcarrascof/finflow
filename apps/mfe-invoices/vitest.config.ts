import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'happy-dom', // Simulador de navegador para Vue
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'], // Reportes de cobertura en consola, HTML y LCOV
        exclude: ['node_modules/', 'src/main.ts', 'dist/'],
      },
    },
  })
)