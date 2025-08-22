import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import pkg from './package.json'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      vuetify: resolve(__dirname, 'src'),
      vue: 'vue/dist/vue.runtime.esm-browser.js',
    },
  },
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: `@import "${resolve(__dirname, 'src/styles/settings/_variables.scss')}"\n`,
      },
    },
  },
  server: {
    port: 8080,
    host: 'localhost',
    open: true,
    hmr: true, // Hot Module Replacement для лучшего dev experience
  },
  root: resolve(__dirname, 'dev'),
  publicDir: false, // Отключаем publicDir так как статические файлы в dev папке
  optimizeDeps: {
    include: ['vue', 'vue-router'], // Предварительная оптимизация зависимостей
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('development'),
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    __VUETIFY_VERSION__: JSON.stringify(pkg.version),
  },
})
