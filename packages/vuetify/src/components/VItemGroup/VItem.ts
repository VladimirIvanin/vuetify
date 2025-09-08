// Styles
import './VItem.sass'

// Mixins
import { factory as GroupableFactory } from '../../mixins/groupable'

// Utilities
import mixins from '../../util/mixins'
import { consoleWarn } from '../../util/console'
import { defineComponent, mergeProps } from "vue"

import type { VNode } from 'vue'

/* @vue/component */
export const BaseItem = defineComponent({
  props: {
    activeClass: String,
    value: {
      required: false,
    },
    disabled: Boolean,
  },

  data: () => ({
    isActive: false,
  }),

  methods: {
    toggle () {
      this.isActive = !this.isActive
    },
  },

  render (): VNode | null {
    if (!this.$slots.default) {
      consoleWarn('v-item is missing a default scopedSlot', this)
      return null
    }

    const slotContent = this.$slots.default({
      active: this.isActive,
      toggle: this.toggle,
    })

    if (!slotContent || slotContent.length === 0) {
      consoleWarn('v-item slot returned empty content', this)
      return null
    }

    let element = slotContent[0]

    if (!element) {
      consoleWarn('v-item should contain at least one element', this)
      return null
    }

    if (!element.type) {
      consoleWarn('v-item should only contain valid VNode elements', this)
      return element
    }

    element.props = mergeProps(element.props || {}, {
      class: {
        [this.activeClass]: this.isActive,
        "v-item--disabled": this.disabled
      }
    })

    if (this.disabled) {
      element.props = mergeProps(element.props || {}, {
        tabindex: -1
      })
    }

    return element
  },
})

export default mixins(
  BaseItem,
  GroupableFactory('itemGroup', 'v-item', 'v-item-group')
).extend({
  name: 'v-item',

  emits: [
    'change',
  ],
})
