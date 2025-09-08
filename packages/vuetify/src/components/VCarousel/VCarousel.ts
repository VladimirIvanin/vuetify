// Styles
import './VCarousel.sass'

// Extensions
import VWindow from '../VWindow/VWindow'

// Components
import VBtn from '../VBtn'
import VIcon from '../VIcon'
import VProgressLinear from '../VProgressLinear'

// Mixins
// TODO: Move this into core components v2.0
import ButtonGroup from '../../mixins/button-group'

// Utilities
import { convertToUnit } from '../../util/helpers'
import { breaking } from '../../util/console'

// Types
import { h, VNode, PropType, defineComponent } from 'vue'

export default defineComponent({
  name: 'v-carousel',
  extends: VWindow,

  // pass down the parent's theme
  provide (): object {
    return {
      parentTheme: this.theme,
    }
  },

  props: {
    continuous: {
      type: Boolean,
      default: true,
    },
    cycle: Boolean,
    delimiterIcon: {
      type: String,
      default: '$delimiter',
    },
    height: {
      type: [Number, String],
      default: 500,
    },
    hideDelimiters: Boolean,
    hideDelimiterBackground: Boolean,
    interval: {
      type: [Number, String],
      default: 6000,
      validator: (value: string | number) => value > 0,
    },
    mandatory: {
      type: Boolean,
      default: true,
    },
    progress: Boolean,
    progressColor: String,
    showArrows: {
      type: Boolean,
      default: true,
    },
    verticalDelimiters: {
      type: String as PropType<'' | 'left' | 'right'>,
      default: undefined,
    },
  },

  emits: [
    'update:modelValue',
    'change',
  ],

  data () {
    return {
      internalHeight: this.height,
      slideTimeout: undefined as number | undefined,
    }
  },

  computed: {
    classes (): object {
      return {
        ...VWindow.computed.classes.call(this),
        'v-carousel': true,
        'v-carousel--hide-delimiter-background': this.hideDelimiterBackground,
        'v-carousel--vertical-delimiters': this.isVertical,
      }
    },
    isDark (): boolean {
      return this.dark || !this.light
    },
    isVertical (): boolean {
      return this.verticalDelimiters != null
    },
  },

  watch: {
    internalValue: 'restartTimeout',
    interval: 'restartTimeout',
    height (val, oldVal) {
      if (val === oldVal || !val) return
      this.internalHeight = val
    },
    cycle (val) {
      if (val) {
        this.restartTimeout()
      } else {
        clearTimeout(this.slideTimeout)
        this.slideTimeout = undefined
      }
    },
  },

  created () {
    /* istanbul ignore next */
    if (this.$attrs.hasOwnProperty('hide-controls')) {
      breaking('hide-controls', ':show-arrows="false"', this)
    }
  },

  mounted () {
    this.startTimeout()
  },

  methods: {
    genControlIcons () {
      if (this.isVertical) return null

      return VWindow.methods.genControlIcons.call(this)
    },
    genDelimiters (): VNode {
      return h('div', {
        class: 'v-carousel__controls',
        style: {
          left: this.verticalDelimiters === 'left' && this.isVertical ? 0 : 'auto',
          right: this.verticalDelimiters === 'right' ? 0 : 'auto',
        },
      }, [this.genItems()])
    },
    genItems (): VNode {
      const length = this.items.length
      const children = []

      for (let i = 0; i < length; i++) {
        const child = h(VBtn, {
          class: 'v-carousel__controls__item',
          'aria-label': this.$vuetify.lang.t('$vuetify.carousel.ariaLabel.delimiter', i + 1, length),
          icon: true,
          small: true,
          value: this.getValue(this.items[i], i),
          key: i,
        }, () => [
          h(VIcon, {
            size: 18
          }, () => this.delimiterIcon),
        ])

        children.push(child)
      }

      return h(ButtonGroup, {
        modelValue: this.internalValue,
        mandatory: this.mandatory,
        onChange: (val: unknown) => {
          this.internalValue = val
        }
      }, () => children)
    },
    genProgress () {
      return h(VProgressLinear, {
        class: 'v-carousel__progress',
        color: this.progressColor,
        value: (this.internalIndex + 1) / this.items.length * 100,
      })
    },
    restartTimeout () {
      this.slideTimeout && clearTimeout(this.slideTimeout)
      this.slideTimeout = undefined

      window.requestAnimationFrame(this.startTimeout)
    },
    startTimeout () {
      if (!this.cycle) return

      this.slideTimeout = window.setTimeout(this.next, +this.interval > 0 ? +this.interval : 6000)
    },
  },

  render (): VNode {
    const render = VWindow.render.call(this, h)

    render.style = `height: ${convertToUnit(this.height)};`

    /* istanbul ignore else */
    if (!this.hideDelimiters) {
      render.children!.push(this.genDelimiters())
    }

    /* istanbul ignore else */
    if (this.progress || this.progressColor) {
      render.children!.push(this.genProgress())
    }

    return render
  },
})
