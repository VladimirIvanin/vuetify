// Components
import VIcon from '../VIcon'
import VBtn from '../VBtn/VBtn'

// Types
import {defineComponent, h} from 'vue'
import { getSlot } from '../../util/helpers'

/* @vue/component */
export default defineComponent({
  name: 'v-app-bar-nav-icon',

  render () {
    const data = this.$attrs

    const d = Object.assign({}, data, {
      class: (`v-app-bar__nav-icon ${data.class || ''}`).trim(),
      icon: true,
    })

    const defaultSlot = getSlot(this)

    return h(VBtn, d, {
      default: () => defaultSlot || [h(VIcon, {}, { default: () => '$menu' })]
    })
  },
})
