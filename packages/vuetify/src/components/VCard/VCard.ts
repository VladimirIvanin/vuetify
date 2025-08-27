// Styles
import './VCard.sass'

// Extensions
import VSheet from '../VSheet'

// Mixins
import Loadable from '../../mixins/loadable'
import Routable from '../../mixins/routable'

// Helpers
import mixins from '../../util/mixins'
import { getSlot } from '../../util/helpers'

// Types
import { VNode, h, withDirectives } from 'vue'

/* @vue/component */
export default mixins(
  Loadable,
  Routable,
  VSheet
).extend({
  name: 'v-card',

  props: {
    flat: Boolean,
    hover: Boolean,
    img: String,
    link: Boolean,
    loaderHeight: {
      type: [Number, String],
      default: 4,
    },
    raised: Boolean,
  },

  computed: {
    classes (): object {
      return {
        'v-card': true,
        ...Routable.computed.classes.call(this),
        'v-card--flat': this.flat,
        'v-card--hover': this.hover,
        'v-card--link': this.isClickable,
        'v-card--loading': this.loading,
        'v-card--disabled': this.disabled,
        'v-card--raised': this.raised,
        ...VSheet.computed.classes.call(this),
      }
    },
    styles (): object {
      const style: Dictionary<string> = {
        ...VSheet.computed.styles.call(this),
      }

      if (this.img) {
        style.background = `url("${this.img}") center center / cover no-repeat`
      }

      return style
    },
  },

  methods: {
    genProgress () {
      const render = Loadable.methods.genProgress.call(this)

      if (!render) return null

      return h('div', {
        class: 'v-card__progress',
        key: 'progress',
      }, [render])
    },
  },

  render (): VNode {
    const { tag, data, directives } = this.generateRouteLink()

    data.style = this.styles

    if (this.isClickable) {
      data.tabindex = 0
    }

    return withDirectives(h(tag, this.setBackgroundColor(this.color, data), {
      default: () => [this.genProgress(), getSlot(this)]
    }), directives)
  },
})
