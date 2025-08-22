import { createApp, h } from 'vue'
import InstantSearch from 'vue-instantsearch'

// Bootstrap
import { registerPlugins } from './plugins'
import { createVuetifyInstance } from '@/vuetify'
import { createStore } from '@/store'
import { createRouter } from '@/router'
import { createI18n } from '@/i18n'
import { sync } from 'vuex-router-sync'

// Application
import App from './App.vue'

// Globals
import { IS_PROD } from '@/util/globals'

// Create app instance
const app = createApp({
  render: () => h(App),
})

// Create store and router instances
const store = createStore()
const i18n = createI18n()
const vuetify = createVuetifyInstance(store)
const router = createRouter(vuetify, store, i18n)

// Sync the router with the vuex store
sync(store, router)

// Use plugins
app.use(vuetify)
app.use(store)
app.use(router)
app.use(i18n)

// Global properties
app.config.globalProperties.$vuetify = vuetify
app.config.globalProperties.$createElement = h

// Global mixin
app.mixin({
  methods: {
    $load(urls) {
      urls = urls instanceof Array ? urls : [urls]
      urls.forEach(url => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = url
        document.head.appendChild(link)
      })
    }
  }
})

// Register plugins
registerPlugins(app)

// Mount the app
app.mount('#app')
