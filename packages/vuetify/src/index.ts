import * as components from './components'
import * as directives from './directives'
import Vuetify from './framework'

export default Vuetify

// Vue 3 compatibility function
export function createVuetify(options = {}) {
  return new Vuetify(options)
}

const install = Vuetify.install

Vuetify.install = (Vue, args) => {
  install.call(Vuetify, Vue, {
    components,
    directives,
    ...args,
  })
}

// if (typeof window !== 'undefined' && window.Vue) {
//   window.Vue.use(Vuetify)
// }
