// Styles
import './VMessages.sass'

// Mixins
import Colorable from '../../mixins/colorable'
import Themeable from '../../mixins/themeable'

// Types
import { TransitionGroup, VNode, h } from 'vue'
import { PropValidator } from 'vue/types/options'
import mixins from '../../util/mixins'

// Utilities
import { getSlot } from '../../util/helpers'

/* @vue/component */
export default mixins(Colorable, Themeable).extend({
  name: 'v-messages',

  props: {
    value: {
      type: Array,
      default: () => ([]),
    } as PropValidator<string[]>,
  },

  methods: {
    genChildren () {
      return h(TransitionGroup, {
        class: 'v-messages__wrapper',
        name: 'message-transition',
        tag: 'div',
      }, {
        default: () => this.value.map(this.genMessage)
      })
    },
    genMessage (message: string, key: number) {
      const slotContent = getSlot(this, 'default', { message, key })
      return h('div', {
        class: 'v-messages__message',
        key,
      }, {
        default: slotContent ? () => slotContent : () => message
      })
    },
  },

  render (): VNode {
    return h('div', this.setTextColor(this.color, {
      class: ['v-messages', this.themeClasses],
    }), {
      default: () => [this.genChildren()]
    })
  },
})
