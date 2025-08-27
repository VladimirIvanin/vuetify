import {h, withDirectives} from 'vue'
import './VProgressLinear.sass'

// Components
import {
  VFadeTransition,
  VSlideXTransition,
} from '../transitions'

// Directives
import intersect, { Intersect } from '../../directives/intersect'

// Mixins
import Colorable from '../../mixins/colorable'
import { factory as PositionableFactory } from '../../mixins/positionable'
import { factory as ProxyableFactory } from '../../mixins/proxyable'
import Themeable from '../../mixins/themeable'

// Utilities
import { convertToUnit, getSlot } from '../../util/helpers'
import mixins from '../../util/mixins'

// Types
import { VNode } from 'vue'

const baseMixins = mixins(
  Colorable,
  PositionableFactory(['absolute', 'fixed', 'top', 'bottom']),
  ProxyableFactory('modelValue', 'update:modelValue'),
  Themeable
)

/* @vue/component */
export default baseMixins.extend({
  name: 'v-progress-linear',

  directives: { intersect },

  props: {
    active: {
      type: Boolean,
      default: true,
    },
    backgroundColor: {
      type: String,
      default: null,
    },
    backgroundOpacity: {
      type: [Number, String],
      default: null,
    },
    bufferValue: {
      type: [Number, String],
      default: 100,
    },
    color: {
      type: String,
      default: 'primary',
    },
    height: {
      type: [Number, String],
      default: 4,
    },
    indeterminate: Boolean,
    modelValue: {
      type: [Number, String],
      default: 0,
    },
    query: Boolean,
    reverse: Boolean,
    rounded: Boolean,
    stream: Boolean,
    striped: Boolean,
    // Оставляем value для обратной совместимости
    value: {
      type: [Number, String],
      default: 0,
    },
  },

  data () {
    return {
      internalLazyValue: this.modelValue || this.value || 0,
      isVisible: true,
    }
  },

  computed: {
    __cachedBackground (): VNode {
      return h('div', this.setBackgroundColor(this.backgroundColor || this.color, {
        class: 'v-progress-linear__background',
        style: this.backgroundStyle,
      }))
    },
    __cachedBar (): VNode {
      return h(this.computedTransition, {}, {
        default: () => [this.__cachedBarType]
      })
    },
    __cachedBarType (): VNode {
      return this.indeterminate ? this.__cachedIndeterminate : this.__cachedDeterminate
    },
    __cachedBuffer (): VNode {
      return h('div', {
        class: 'v-progress-linear__buffer',
        style: this.styles,
      })
    },
    __cachedDeterminate (): VNode {
      return h('div', this.setBackgroundColor(this.color, {
        class: `v-progress-linear__determinate`,
        style: {
          width: convertToUnit(this.normalizedValue, '%'),
        },
      }))
    },
    __cachedIndeterminate (): VNode {
      return h('div', {
        class: ['v-progress-linear__indeterminate',
          {
            'v-progress-linear__indeterminate--active': this.active,
          }
        ]
      }, [
        this.genProgressBar('long'),
        this.genProgressBar('short'),
      ])
    },
    __cachedStream (): VNode | null {
      if (!this.stream) return null

      return h('div', this.setTextColor(this.color, {
        class: 'v-progress-linear__stream',
        style: {
          width: convertToUnit(100 - this.normalizedBuffer, '%'),
        },
      }))
    },
    backgroundStyle (): object {
      const backgroundOpacity = this.backgroundOpacity == null
        ? (this.backgroundColor ? 1 : 0.3)
        : parseFloat(this.backgroundOpacity)

      return {
        opacity: backgroundOpacity,
        [this.isReversed ? 'right' : 'left']: convertToUnit(this.normalizedValue, '%'),
        width: convertToUnit(Math.max(0, this.normalizedBuffer - this.normalizedValue), '%'),
      }
    },
    classes (): object {
      return {
        'v-progress-linear--absolute': this.absolute,
        'v-progress-linear--fixed': this.fixed,
        'v-progress-linear--query': this.query,
        'v-progress-linear--reactive': this.reactive,
        'v-progress-linear--reverse': this.isReversed,
        'v-progress-linear--rounded': this.rounded,
        'v-progress-linear--striped': this.striped,
        'v-progress-linear--visible': this.isVisible,
        ...this.themeClasses,
      }
    },
    computedTransition (): any {
      return this.indeterminate ? VFadeTransition : VSlideXTransition
    },
    isReversed (): boolean {
      return this.$vuetify.rtl !== this.reverse
    },
    normalizedBuffer (): number {
      return this.normalize(this.bufferValue)
    },
    normalizedValue (): number {
      return this.normalize(this.internalLazyValue)
    },
    reactive (): boolean {
      return Boolean(this.$listeners.onChange) || Boolean(this.$listeners['onUpdate:modelValue'])
    },
    styles (): object {
      const styles: Record<string, any> = {}

      if (!this.active) {
        styles.height = 0
      }

      if (!this.indeterminate && parseFloat(this.normalizedBuffer) !== 100) {
        styles.width = convertToUnit(this.normalizedBuffer, '%')
      }

      return styles
    },
  },

  watch: {
    modelValue (val) {
      this.internalLazyValue = val
    },
    value (val) {
      this.internalLazyValue = val
    },
  },

  methods: {
    genContent () {
      const slot = getSlot(this, 'default', { value: this.internalLazyValue })

      if (!slot) return null

      return h(
        "div",
        {
          class: "v-progress-linear__content"
        },
        {
          default: () => slot
        }
      );
    },
    genListeners (): any {
      const listeners = this.$listeners

      if (this.reactive) {
        listeners.onClick = this.onClick
      }

      return listeners
    },
    genProgressBar (name: 'long' | 'short'): VNode {
      return h('div', this.setBackgroundColor(this.color, {
        class: ['v-progress-linear__indeterminate',
          {
            [name]: true,
          }
        ]
      }))
    },
    onClick (e: MouseEvent) {
      if (!this.reactive) return

      const { width } = this.$el.getBoundingClientRect()

      this.internalValue = e.offsetX / width * 100
    },
    onObserve (entries: IntersectionObserverEntry[], observer: IntersectionObserver, isIntersecting: boolean) {
      this.isVisible = isIntersecting
    },
    normalize (value: string | number): number {
      const numValue = typeof value === 'string' ? parseFloat(value) : value
      if (numValue < 0) return 0
      if (numValue > 100) return 100
      return numValue
    },
  },

  render (): VNode {
    const data = {
      class: ['v-progress-linear', this.classes],
      role: 'progressbar',
      'aria-valuemin': 0,
      'aria-valuemax': this.normalizedBuffer,
      'aria-valuenow': this.indeterminate ? undefined : this.normalizedValue,
      style: {
        bottom: this.bottom ? 0 : undefined,
        height: this.active ? convertToUnit(this.height) : 0,
        top: this.top ? 0 : undefined,
      },
      ...this.genListeners(),
    }

    return withDirectives(h('div', data, [
      this.__cachedStream,
      this.__cachedBackground,
      this.__cachedBuffer,
      this.__cachedBar,
      this.genContent(),
    ]), [
      [
        Intersect,
        this.onObserve
      ]
    ])
  },
})
