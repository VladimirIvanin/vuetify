import { h, vShow, withDirectives, VNode } from 'vue'
// Styles
import './VChip.sass'
import mixins from '../../util/mixins'

// Components
import { VExpandXTransition } from '../transitions'
import VIcon from '../VIcon'

// Mixins
import Colorable from '../../mixins/colorable'
import { factory as GroupableFactory } from '../../mixins/groupable'
import Themeable from '../../mixins/themeable'
import { factory as ToggleableFactory } from '../../mixins/toggleable'
import Routable from '../../mixins/routable'
import Sizeable from '../../mixins/sizeable'

// Utilities
import { breaking } from '../../util/console'
import { getSlot } from '../../util/helpers'

// Types
import { PropValidator, PropType } from 'vue/types/options'

/* @vue/component */
export default mixins(
  Colorable,
  Sizeable,
  Routable,
  Themeable,
  GroupableFactory('chipGroup'),
  ToggleableFactory()
).extend({
  name: 'v-chip',

  emits: ['update:modelValue', 'click:close', 'click', 'change'],

  props: {
    active: {
      type: Boolean,
      default: true,
    },
    activeClass: {
      type: String,
    } as any as PropValidator<string>,
    close: Boolean,
    closeIcon: {
      type: String,
      default: '$delete',
    },
    closeLabel: {
      type: String,
      default: '$vuetify.close',
    },
    disabled: Boolean,
    draggable: Boolean,
    filter: Boolean,
    filterIcon: {
      type: String,
      default: '$complete',
    },
    label: Boolean,
    link: Boolean,
    outlined: Boolean,
    pill: Boolean,
    tag: {
      type: String,
      default: 'span',
    },
    textColor: String,
    modelValue: null as any as PropType<any>,
  },

  data: () => ({
    proxyClass: 'v-chip--active',
  }),

  computed: {
    $activeClass () {
      if (this.activeClass) {
        return this.activeClass
      }
      if (!this.chipGroup) return ''

      return this.chipGroup.activeClass
    },
    classes (): object {
      return {
        'v-chip': true,
        ...Routable.computed.classes.call(this),
        'v-chip--clickable': this.isClickable,
        'v-chip--disabled': this.disabled,
        'v-chip--draggable': this.draggable,
        'v-chip--label': this.label,
        'v-chip--link': this.isLink,
        'v-chip--no-color': !this.color,
        'v-chip--outlined': this.outlined,
        'v-chip--pill': this.pill,
        'v-chip--removable': this.hasClose,
        ...this.themeClasses,
        ...this.sizeableClasses,
        ...this.groupClasses,
      }
    },
    hasClose (): boolean {
      return Boolean(this.close)
    },
    isClickable (): boolean {
      return Boolean(
        Routable.computed.isClickable.call(this) ||
        this.chipGroup
      )
    },
  },

  created () {
    const breakingProps = [
      ['outline', 'outlined'],
      ['selected', 'input-value'],
      ['value', 'modelValue'],
      ['@input', '@update:modelValue'],
    ]

    /* istanbul ignore next */
    breakingProps.forEach(([original, replacement]) => {
      if (this.$attrs.hasOwnProperty(original)) breaking(original, replacement, this)
    })
  },

  methods: {
    click (e: MouseEvent): void {
      this.$emit('click', e)

      if (this.chipGroup) {
        this.toggle()
        this.$emit('update:modelValue', this.isActive)
      }
    },
    genFilter (): VNode {
      const children = []

      if (this.isActive) {
        children.push(
          h(VIcon, {
            class: 'v-chip__filter',
            left: true,
          }, this.filterIcon)
        )
      }

      return h(VExpandXTransition, children)
    },
    genClose (): VNode {
      return h(VIcon, {
        class: 'v-chip__close',
        right: true,
        size: 18,
        'aria-label': this.$vuetify.lang.t(this.closeLabel),
        onClick: (e: Event) => {
          e.stopPropagation()
          e.preventDefault()

          this.$emit('click:close')
          this.$emit('update:modelValue', false)
        }
      }, this.closeIcon)
    },
    genContent (): VNode {
      return h('span', {
        class: 'v-chip__content',
      }, [
        this.filter && this.genFilter(),
        getSlot(this),
        this.hasClose && this.genClose(),
      ])
    },
  },

  render (): VNode {
    const children = [this.genContent()]
    let { tag, data, directives } = this.generateRouteLink()

    data = {
      ...data,
      draggable: this.draggable ? 'true' : undefined,
      tabindex: this.chipGroup && !this.disabled ? 0 : data.tabindex,
    }

    directives!.push([
      vShow,
      this.active,
    ])

    data = this.setBackgroundColor(this.color, data)

    const color = this.textColor || (this.outlined && this.color)

    return withDirectives(
      h(tag, this.setTextColor(color, data), children),
      directives
    )
  },
})
