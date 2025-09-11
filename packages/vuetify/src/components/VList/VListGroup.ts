import { h, withDirectives, vShow, VNode } from 'vue'
// Styles
import './VListGroup.sass'

// Components
import VIcon from '../VIcon'
import VList from './VList'
import VListItem from './VListItem'
import VListItemIcon from './VListItemIcon'

// Mixins
import BindsAttrs from '../../mixins/binds-attrs'
import Bootable from '../../mixins/bootable'
import Colorable from '../../mixins/colorable'
import Toggleable from '../../mixins/toggleable'
import { inject as RegistrableInject } from '../../mixins/registrable'

// Directives
import ripple, { Ripple } from '../../directives/ripple'

// Transitions
import { VExpandTransition } from '../transitions'

// Utils
import mixins, { ExtractVue } from '../../util/mixins'
import { getSlot } from '../../util/helpers'
import { breaking } from '../../util/console'

// Types
import { Route } from 'vue-router'

const baseMixins = mixins(
  BindsAttrs,
  Bootable,
  Colorable,
  RegistrableInject('list'),
  Toggleable
)

type VListInstance = InstanceType<typeof VList>

interface options extends ExtractVue<typeof baseMixins> {
  list: VListInstance
  $refs: {
    group: HTMLElement
  }
  $route: Route
}

export default baseMixins.extend({
  name: 'v-list-group',


  props: {
    activeClass: {
      type: String,
      default: '',
    },
    appendIcon: {
      type: String,
      default: '$expand',
    },
    color: {
      type: String,
      default: 'primary',
    },
    disabled: Boolean,
    group: [String, RegExp],
    noAction: Boolean,
    prependIcon: String,
    ripple: {
      type: [Boolean, Object],
      default: true,
    },
    subGroup: Boolean,
  },

  computed: {
    classes (): object {
      return {
        'v-list-group--active': this.isActive,
        'v-list-group--disabled': this.disabled,
        'v-list-group--no-action': this.noAction,
        'v-list-group--sub-group': this.subGroup,
      }
    },
  },

  created () {
    const breakingProps = [
      ['value', 'modelValue'],
      ['inputValue', 'modelValue'],
      ['onInput', 'onUpdate:modelValue'],
    ]

    /* istanbul ignore next */
    breakingProps.forEach(([original, replacement]) => {
      if (this.$attrs.hasOwnProperty(original)) breaking(original, replacement, this)
    })

    this.list && this.list.register(this)

    if (this.group &&
      this.$route &&
      this.modelValue == null
    ) {
      this.isActive = this.matchRoute(this.$route.path)
    }
  },

  watch: {
    isActive (val: boolean) {
      /* istanbul ignore else */
      if (!this.subGroup && val) {
        this.list && this.list.listClick(this.$.uid)
      }
    },
    $route: 'onRouteChange',
  },

  beforeUnmount () {
    this.list && this.list.unregister(this)
  },

  methods: {
    click (e: Event) {
      if (this.disabled) return

      this.isBooted = true

      this.$emit('click', e)
      this.$nextTick(() => (this.isActive = !this.isActive))
    },
    genIcon (icon: string | false): VNode {
      return h(VIcon, {}, () => icon)
    },
    genAppendIcon (): VNode | null {
      const icon = !this.subGroup ? this.appendIcon : false
      const slot = getSlot(this, 'appendIcon')

      if (!icon && !slot) return null

      return h(VListItemIcon, {
        class: 'v-list-group__header__append-icon',
      }, () => [
        slot || this.genIcon(icon),
      ])
    },
    genHeader (): VNode {
      return withDirectives(h(VListItem, {
        'aria-expanded': String(this.isActive),
        role: 'button',
        class: {
          'v-list-group__header': true,
          [this.activeClass]: this.isActive,
        },
        link: true,
        modelValue: this.isActive,
        ...this.listeners$,
        onClick: this.click
      }, () => [
        this.genPrependIcon(),
        getSlot(this, 'activator'),
        this.genAppendIcon(),
      ]),
      [
        [Ripple, this.ripple],
      ])
    },
    genItems (): VNode[] {
      const directives = [[
        vShow,
        this.isActive,
      ]]

      return this.showLazyContent(() => [
        withDirectives(h('div', {
          class: 'v-list-group__items',
        }, getSlot(this)), directives),
      ])
    },
    genPrependIcon (): VNode | null {
      const icon = this.subGroup && this.prependIcon == null
        ? '$subgroup'
        : this.prependIcon
      const slot = getSlot(this, 'prependIcon')

      if (!icon && !slot) return null

      return h(VListItemIcon, {
        class: 'v-list-group__header__prepend-icon',
      }, () => [
        slot || this.genIcon(icon),
      ])
    },
    onRouteChange (to: Route) {
      /* istanbul ignore if */
      if (!this.group) return

      const isActive = this.matchRoute(to.path)

      /* istanbul ignore else */
      if (isActive && this.isActive !== isActive) {
        this.list && this.list.listClick(this.$.uid)
      }

      this.isActive = isActive
    },
    toggle (uid: number) {
      const isActive = this.$.uid === uid

      if (isActive) this.isBooted = true
      this.$nextTick(() => (this.isActive = isActive))
    },
    matchRoute (to: string) {
      return to.match(this.group) !== null
    },
  },

  render (): VNode {
    return h('div', this.setTextColor(this.isActive && this.color, {
      class: ['v-list-group', this.classes],
    }), [
      this.genHeader(),
      h(VExpandTransition, {}, () => this.genItems()),
    ])
  },
})