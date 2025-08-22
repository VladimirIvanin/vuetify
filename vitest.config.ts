import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./packages/vuetify/test/vitest-setup.ts'],
    include: [
      'packages/vuetify/src/**/*.{test,spec}.{js,ts}',
      'packages/vuetify/test/**/*.{test,spec}.{js,ts}'
    ],
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'packages/vuetify/src/**/*.{js,ts}',
        '!packages/vuetify/src/**/*.d.ts'
      ]
    }
  },
  esbuild: {
    target: 'node22'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './packages/vuetify/src'),
      '@test': resolve(__dirname, './packages/vuetify/test')
    }
  },
  define: {
    // Для совместимости с CSS модулями
    'process.env': process.env
  },
  css: {
    modules: {
      // Эмуляция identity-obj-proxy для CSS модулей
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
  }
})
