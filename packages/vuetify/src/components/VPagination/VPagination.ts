import {h, withDirectives} from 'vue'
import './VPagination.sass'

import VIcon from '../VIcon'

// Directives
import Resize from '../../directives/resize'

// Mixins
import Colorable from '../../mixins/colorable'
import Intersectable from '../../mixins/intersectable'
import Themeable from '../../mixins/themeable'

// Utilities
import mixins from '../../util/mixins'

// Types
import { VNode, CreateElement, VNodeChildrenArrayContents } from 'vue'

/* @vue/component */
export default mixins(
  Colorable,
  Intersectable({ onVisible: ['init'] }),
  Themeable
).extend({
  name: 'v-pagination',


  props: {
    circle: Boolean,
    disabled: Boolean,
    navigationColor: String,
    navigationTextColor: String,
    length: {
      type: Number,
      default: 0,
      validator: (val: number) => val % 1 === 0,
    },
    nextIcon: {
      type: String,
      default: '$next',
    },
    prevIcon: {
      type: String,
      default: '$prev',
    },
    totalVisible: [Number, String],
    modelValue: {
      type: Number,
      default: 0,
    },
    pageAriaLabel: {
      type: String,
      default: '$vuetify.pagination.ariaLabel.page',
    },
    currentPageAriaLabel: {
      type: String,
      default: '$vuetify.pagination.ariaLabel.currentPage',
    },
    previousAriaLabel: {
      type: String,
      default: '$vuetify.pagination.ariaLabel.previous',
    },
    nextAriaLabel: {
      type: String,
      default: '$vuetify.pagination.ariaLabel.next',
    },
    wrapperAriaLabel: {
      type: String,
      default: '$vuetify.pagination.ariaLabel.wrapper',
    },
  },

  emits: ['update:modelValue', 'next', 'previous'],

  data () {
    return {
      maxButtons: 0,
      selected: null as number | null,
    }
  },

  computed: {
    value() {
      return this.modelValue
    },
    classes (): object {
      return {
        'v-pagination': true,
        'v-pagination--circle': this.circle,
        'v-pagination--disabled': this.disabled,
        ...this.themeClasses,
      }
    },

    items (): (string | number)[] {
      const totalVisible = parseInt(this.totalVisible, 10)

      if (totalVisible === 0 || isNaN(this.length) || this.length > Number.MAX_SAFE_INTEGER) {
        return []
      }

      const maxLength = Math.min(
        Math.max(0, totalVisible) || this.length,
        Math.max(0, this.maxButtons) || this.length,
        this.length
      )

      if (this.length <= maxLength) {
        return this.range(1, this.length)
      }

      const even = maxLength % 2 === 0 ? 1 : 0
      const left = Math.floor(maxLength / 2)
      const right = this.length - left + 1 + even

      if (this.value > left && this.value < right) {
        const firstItem = 1
        const lastItem = this.length
        const start = this.value - left + 2
        const end = this.value + left - 2 - even
        const secondItem = start - 1 === firstItem + 1 ? 2 : '...'
        const beforeLastItem = end + 1 === lastItem - 1 ? end + 1 : '...'

        return [1, secondItem, ...this.range(start, end), beforeLastItem, this.length]
      } else if (this.value === left) {
        const end = this.value + left - 1 - even
        return [...this.range(1, end), '...', this.length]
      } else if (this.value === right) {
        const start = this.value - left + 1
        return [1, '...', ...this.range(start, this.length)]
      } else {
        return [
          ...this.range(1, left),
          '...',
          ...this.range(right, this.length),
        ]
      }
    },
  },

  watch: {
    value () {
      this.init()
    },
  },

  beforeMount () {
    this.init()
  },

  methods: {
    init () {
      this.selected = null

      this.onResize()
      this.$nextTick(this.onResize)
      // TODO: Change this (f75dee3a, cbdf7caa)
      setTimeout(() => (this.selected = this.value), 100)
    },
    onResize () {
      const width = this.$el && this.$el.parentElement
        ? this.$el.parentElement.clientWidth
        : window.innerWidth

      this.maxButtons = Math.floor((width - 96) / 42)
    },
    next (e: Event) {
      e.preventDefault()
      this.$emit('update:modelValue', this.value + 1)
      this.$emit('next')
    },
    previous (e: Event) {
      e.preventDefault()
      this.$emit('update:modelValue', this.value - 1)
      this.$emit('previous')
    },
    range (from: number, to: number) {
      const range = []

      from = from > 0 ? from : 1

      for (let i = from; i <= to; i++) {
        range.push(i)
      }

      return range
    },
    genIcon (h: CreateElement, icon: string, disabled: boolean, fn: EventListener, label: String): VNode {
      return h('li', [
        h('button',
          this.setBackgroundColor(this.navigationColor, {
            class: ['v-pagination__navigation', {
              'v-pagination__navigation--disabled': disabled,
            }],
            disabled,
            type: 'button',
            'aria-label': label,
            ...(disabled ? {} : { onClick: fn }),
          }),
          [h(VIcon, { color: this.navigationTextColor }, () => [icon])]
        ),
      ])
    },
    genItem (h: CreateElement, i: string | number): VNode {
      const color: string | false = (i === this.value) && (this.color || 'primary')
      const isCurrentPage = i === this.value
      const ariaLabel = isCurrentPage ? this.currentPageAriaLabel : this.pageAriaLabel

      return h('button', this.setBackgroundColor(color, {
        class: ['v-pagination__item', {
          'v-pagination__item--active': i === this.value,
        }],
        type: 'button',
        'aria-current': isCurrentPage,
        'aria-label': this.$vuetify.lang.t(ariaLabel, i),
        onClick: () => this.$emit('update:modelValue', i),
      }), [i.toString()])
    },
    genItems (h: CreateElement): VNode[] {
      return this.items.map((i, index) => {
        return h('li', { key: index }, [
          isNaN(Number(i)) ? h('span', { class: 'v-pagination__more' }, [i.toString()]) : this.genItem(h, i),
        ])
      })
    },
    genList (h: CreateElement, children: VNodeChildrenArrayContents): VNode {
      return withDirectives(h('ul', {
        class: this.classes
      }, children), [
        [
          Resize,
          this.onResize,
          '',
          { quiet: true }
        ]
      ])
    },
  },

  render (): VNode {
    const children = [
      this.genIcon(h,
        this.$vuetify.rtl ? this.nextIcon : this.prevIcon,
        this.value <= 1,
        this.previous,
        this.$vuetify.lang.t(this.previousAriaLabel)),
      this.genItems(h),
      this.genIcon(h,
        this.$vuetify.rtl ? this.prevIcon : this.nextIcon,
        this.value >= this.length,
        this.next,
        this.$vuetify.lang.t(this.nextAriaLabel)),
    ]

    return h('nav', {
      role: 'navigation',
      'aria-label': this.$vuetify.lang.t(this.wrapperAriaLabel),
    }, [this.genList(h, children)])
  },
})
