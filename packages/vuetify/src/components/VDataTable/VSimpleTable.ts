import { h, VNode } from 'vue'
import './VSimpleTable.sass'

import { convertToUnit, getSlot } from '../../util/helpers'
import Themeable from '../../mixins/themeable'
import mixins from '../../util/mixins'

export default mixins(Themeable).extend({
  name: 'v-simple-table',

  props: {
    dense: Boolean,
    fixedHeader: Boolean,
    height: [Number, String],
  },

  computed: {
    classes (): Record<string, boolean> {
      return {
        'v-data-table--dense': this.dense,
        'v-data-table--fixed-height': !!this.height && !this.fixedHeader,
        'v-data-table--fixed-header': this.fixedHeader,
        'v-data-table--has-top': !!getSlot(this, 'top'),
        'v-data-table--has-bottom': !!getSlot(this, 'bottom'),
        ...this.themeClasses,
      }
    },
  },

  methods: {
    genWrapper () {
      const wrapperSlot = getSlot(this, 'wrapper')
      return wrapperSlot ? wrapperSlot() : h('div', {
        class: 'v-data-table__wrapper',
        style: {
          height: convertToUnit(this.height),
        },
      }, [
        h('table', getSlot(this) ? getSlot(this)() : undefined),
      ])
    },
  },

  render (): VNode {
    const children = []
    const topSlot = getSlot(this, 'top')
    if (topSlot) {
      children.push(topSlot())
    }
    children.push(this.genWrapper())
    const bottomSlot = getSlot(this, 'bottom')
    if (bottomSlot) {
      children.push(bottomSlot())
    }

    return h('div', {
      class: ['v-data-table', this.classes],
    }, children.filter(Boolean))
  },
})
