import { h, withDirectives, VNode, PropType, PropValidator } from 'vue'
// Styles
import './VListItem.sass'

// Mixins
import Colorable from '../../mixins/colorable'
import Routable from '../../mixins/routable'
import { factory as GroupableFactory } from '../../mixins/groupable'
import Themeable from '../../mixins/themeable'
import { factory as ToggleableFactory } from '../../mixins/toggleable'

// Directives
import Ripple from '../../directives/ripple'

// Utilities
import { getSlot, keyCodes } from './../../util/helpers'
import mergeData, { mergeClasses } from './../../util/mergeData'
import { ExtractVue } from './../../util/mixins'
import { removed, breaking } from '../../util/console'

// Types
import mixins from '../../util/mixins'

const baseMixins = mixins(
  Colorable,
  Routable,
  Themeable,
  GroupableFactory('listItemGroup'),
  ToggleableFactory('modelValue')
)

interface options extends ExtractVue<typeof baseMixins> {
  $el: HTMLElement
  isInGroup: boolean
  isInList: boolean
  isInMenu: boolean
  isInNav: boolean
}

/* @vue/component */
export default baseMixins.extend({
  name: 'v-list-item',

  inject: {
    isInGroup: {
      default: false,
    },
    isInList: {
      default: false,
    },
    isInMenu: {
      default: false,
    },
    isInNav: {
      default: false,
    },
  },

  inheritAttrs: false,

  props: {
    activeClass: {
      type: String,
    } as any as PropValidator<string>,
    dense: Boolean,
    inactive: Boolean,
    onClick: Function as PropType<(e: MouseEvent) => void>,
    link: Boolean,
    selectable: {
      type: Boolean,
    },
    tag: {
      type: String,
      default: 'div',
    },
    threeLine: Boolean,
    twoLine: Boolean,
    modelValue: null as any as PropType<any>,
  },

  emits: [
    'click',
    'keydown',
    'change',
    'update:modelValue',
  ],

  data: () => ({
    proxyClass: 'v-list-item--active',
  }),

  computed: {
    $activeClass () {
      if (this.activeClass) return this.activeClass
      if (!this.listItemGroup) return ''

      return this.listItemGroup.activeClass
    },
    classes (): object {
      return {
        'v-list-item': true,
        ...Routable.computed.classes.call(this),
        'v-list-item--dense': this.dense,
        'v-list-item--disabled': this.disabled,
        'v-list-item--link': this.isClickable && !this.inactive,
        'v-list-item--selectable': this.selectable,
        'v-list-item--three-line': this.threeLine,
        'v-list-item--two-line': this.twoLine,
        ...this.themeClasses,
      }
    },
    isClickable (): boolean {
      return Boolean(
        Routable.computed.isClickable.call(this) ||
        this.listItemGroup
      )
    },
  },

  created () {
    const breakingProps = [
      ['value', 'modelValue'],
    ]

    /* istanbul ignore next */
    breakingProps.forEach(([original, replacement]) => {
      if (this.$attrs.hasOwnProperty(original)) breaking(original, replacement, this)
    })

    /* istanbul ignore next */
    if (this.$attrs.hasOwnProperty('avatar')) {
      removed('avatar', this)
    }
  },

  methods: {
    click (e: MouseEvent | KeyboardEvent) {
      if (e.detail) this.$el.blur()

      this.$emit('click', e)

      this.to || this.toggle()
    },
    genAttrs () {
      const { class: _, ...otherAttrs } = this.$attrs
      const attrs: Record<string, any> = {
        ...otherAttrs,
        'aria-disabled': this.disabled ? true : undefined,
        tabindex: this.isClickable && !this.disabled ? 0 : -1,
      }

      if (this.$attrs.hasOwnProperty('role')) {
        // do nothing, role already provided
      } else if (this.isInNav) {
        // do nothing, role is inherit
      } else if (this.isInGroup) {
        attrs.role = 'option'
        attrs['aria-selected'] = String(this.isActive)
      } else if (this.isInMenu) {
        attrs.role = this.isClickable ? 'menuitem' : undefined
        attrs.id = attrs.id || `list-item-${this.$.uid}`
      } else if (this.isInList) {
        attrs.role = 'listitem'
      }

      return attrs
    },
    toggle () {
      if (this.to && this.modelValue === undefined) {
        this.isActive = !this.isActive
      }
      this.$emit('change')
      this.$emitLegacy('change')
    },
  },

  render (): VNode {
    let { tag, data, directives } = this.generateRouteLink()
    const attrs = this.genAttrs()

    data = mergeData(
      data,
      attrs
    )

    data = {
      ...data,
      onKeydown: (e: KeyboardEvent) => {
        if (!this.disabled) {
          /* istanbul ignore else */
          if (e.keyCode === keyCodes.enter) this.click(e)

          this.$emit('keydown', e)
        }
      },
      // Ensure our attrs take precedence over routable
      ...attrs,
    }

    if (this.inactive) tag = 'div'
    // if (this.inactive && this.to) {
    //   data.on = data.nativeOn
    //   delete data.nativeOn
    // }

    const slotProps = {
      active: this.isActive,
      toggle: this.toggle,
    }

    const children = [
      getSlot(this, 'prepend', slotProps),
      getSlot(this, 'default', slotProps),
      getSlot(this, 'append', slotProps),
    ].filter(Boolean)

    const nodeData = this.isActive ? this.setTextColor(this.color, data) : data

    const attrsClasses = this.$attrs.class
    if (attrsClasses) {
      nodeData.class = [this.classes, attrsClasses]
    } else {
      nodeData.class = this.classes
    }

    const node = typeof tag === 'string'
      ? h(tag, nodeData, children)
      : h(tag, nodeData, () => children)

    return withDirectives(node, directives)
  },
})