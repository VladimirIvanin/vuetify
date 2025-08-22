import Vuetify from '../src'
import { locales } from '../src/locale'
import '@mdi/font/css/materialdesignicons.css'
import '../src/styles/main.sass'

// Импортируем все компоненты и директивы
import { components } from '../src/components'
import { directives } from '../src/directives'

// Создаем экземпляр Vuetify с правильной конфигурацией
const vuetify = new Vuetify({
  components,
  directives,
  locale: {
    locale: 'en',
    fallback: 'en',
    messages: locales,
  },
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    defaultTheme: 'light'
  }
})

export default vuetify
