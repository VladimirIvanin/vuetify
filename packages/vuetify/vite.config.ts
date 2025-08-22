import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

const version = process.env.VERSION || require('./package.json').version

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      vuetify: resolve(__dirname, 'src'),
      vue: 'vue/dist/vue.runtime.esm-browser.js',
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Vuetify',
      fileName: (format) => `vuetify.${format === 'es' ? 'js' : 'min.js'}`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'vuetify.css'
          }
          return assetInfo.name
        },
      },
    },
    minify: 'esbuild',
    sourcemap: true,
    emptyOutDir: true,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  server: {
    port: 8080,
    host: 'localhost',
  },
})
