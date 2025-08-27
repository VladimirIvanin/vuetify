import {h, withDirectives} from 'vue'
// Styles
import './VProgressCircular.sass'

// Directives
import intersect, { Intersect } from '../../directives/intersect'

// Mixins
import Colorable from '../../mixins/colorable'

// Utils
import { convertToUnit, getSlot } from '../../util/helpers'

// Types
import { VNode, VNodeChild, defineComponent } from 'vue'

/* @vue/component */
export default defineComponent({
  name: 'v-progress-circular',

  extends: Colorable,

  directives: { intersect },

  props: {
    button: Boolean,
    indeterminate: Boolean,
    rotate: {
      type: [Number, String],
      default: 0,
    },
    size: {
      type: [Number, String],
      default: 32,
    },
    width: {
      type: [Number, String],
      default: 4,
    },
    value: {
      type: [Number, String],
      default: 0,
    },
  },

  data: () => ({
    radius: 20,
    isVisible: true,
  }),

  computed: {
    calculatedSize (): number {
      return Number(this.size) + (this.button ? 8 : 0)
    },

    circumference (): number {
      return 2 * Math.PI * this.radius
    },

    classes (): object {
      return {
        'v-progress-circular--visible': this.isVisible,
        'v-progress-circular--indeterminate': this.indeterminate,
        'v-progress-circular--button': this.button,
      }
    },

    normalizedValue (): number {
      const numValue = parseFloat(this.value)
      if (numValue < 0) {
        return 0
      }

      if (numValue > 100) {
        return 100
      }

      return numValue
    },

    strokeDashArray (): number {
      return Math.round(this.circumference * 1000) / 1000
    },

    strokeDashOffset (): string {
      return ((100 - this.normalizedValue) / 100) * this.circumference + 'px'
    },

    strokeWidth (): number {
      return Number(this.width) / +this.size * this.viewBoxSize * 2
    },

    styles (): object {
      return {
        height: convertToUnit(this.calculatedSize),
        width: convertToUnit(this.calculatedSize),
      }
    },

    svgStyles (): object {
      return {
        transform: `rotate(${Number(this.rotate)}deg)`,
      }
    },

    viewBoxSize (): number {
      return this.radius / (1 - Number(this.width) / +this.size)
    },
  },

  methods: {
    genCircle (name: string, offset: string | number): VNode {
      return h('circle', {
        class: `v-progress-circular__${name}`,
        fill: 'transparent',
        cx: 2 * this.viewBoxSize,
        cy: 2 * this.viewBoxSize,
        r: this.radius,
        'stroke-width': this.strokeWidth,
        'stroke-dasharray': this.strokeDashArray,
        'stroke-dashoffset': offset,
      })
    },
    genSvg (): VNode {
      const children = [
        this.indeterminate || this.genCircle('underlay', 0),
        this.genCircle('overlay', this.strokeDashOffset),
      ] as VNodeChild[]

      return h('svg', {
        style: this.svgStyles,
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: `${this.viewBoxSize} ${this.viewBoxSize} ${2 * this.viewBoxSize} ${2 * this.viewBoxSize}`,
      }, children)
    },
    genInfo (): VNode {
      return h('div', {
        class: 'v-progress-circular__info',
      }, getSlot(this))
    },
    onObserve (entries: IntersectionObserverEntry[], observer: IntersectionObserver, isIntersecting: boolean) {
      this.isVisible = isIntersecting
    },
  },

  render (): VNode {
    return withDirectives(h('div', this.setTextColor(this.color, {
      class: ['v-progress-circular', this.classes],
      role: 'progressbar',
      'aria-valuemin': 0,
      'aria-valuemax': 100,
      'aria-valuenow': this.indeterminate ? undefined : this.normalizedValue,
      style: this.styles,
      ...this.$listeners,
    }), [
      this.genSvg(),
      this.genInfo(),
    ]), [
      [
        Intersect,
        this.onObserve
      ]
    ])
  },
})
