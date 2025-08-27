// Styles
import './VLabel.sass'

// Mixins
import Colorable from '../../mixins/colorable'
import Themeable, { functionalThemeClasses } from '../../mixins/themeable'

// Types
import { VNode, h } from 'vue'
import mixins from '../../util/mixins'

// Helpers
import { convertToUnit } from '../../util/helpers'
import mergeData from '../../util/mergeData'

/* @vue/component */
export default mixins(Themeable).extend({
  name: 'v-label',

  functional: true,

  props: {
    absolute: Boolean,
    color: {
      type: String,
      default: 'primary',
    },
    disabled: Boolean,
    focused: Boolean,
    for: String,
    left: {
      type: [Number, String],
      default: 0,
    },
    right: {
      type: [Number, String],
      default: 'auto',
    },
    value: Boolean,
  },

  render (): VNode {
    const data = this.$attrs
    const props = this.$props

    const newData = mergeData({
      class: {
        'v-label': true,
        'v-label--active': this.value,
        'v-label--is-disabled': this.disabled,
        ...functionalThemeClasses(this),
      },
      for: props.for,
      'aria-hidden': !props.for,
      style: {
        left: convertToUnit(props.left),
        right: convertToUnit(props.right),
        position: props.absolute ? 'absolute' : 'relative',
      },
      ref: 'label',
    }, data)

    return h('label', Colorable.methods.setTextColor(props.focused && props.color, newData), {
      default: this.$slots.default
    })
  },
})
