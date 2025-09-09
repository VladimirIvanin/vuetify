import { h, withDirectives, vShow } from 'vue'
// Styles
import './VBanner.sass'

// Extensions
import VSheet from '../VSheet'

// Components
import VAvatar from '../VAvatar'
import VIcon from '../VIcon'
import { VExpandTransition } from '../transitions'

// Mixins
import Mobile from '../../mixins/mobile'
import Toggleable from '../../mixins/toggleable'

// Utilities
import mixins from '../../util/mixins'
import { convertToUnit, getSlot } from '../../util/helpers'

// Types
import { VNode } from 'vue'

/* @vue/component */
export default mixins(
  VSheet,
  Mobile,
  Toggleable
).extend({
  name: 'v-banner',

  inheritAttrs: false,

  emits: ['update:modelValue', 'click:icon'],

  props: {
    app: Boolean,
    icon: String,
    iconColor: String,
    singleLine: Boolean,
    sticky: Boolean,
    modelValue: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    classes (): object {
      return {
        ...VSheet.computed.classes.call(this),
        'v-banner--has-icon': this.hasIcon,
        'v-banner--is-mobile': this.isMobile,
        'v-banner--single-line': this.singleLine,
        'v-banner--sticky': this.isSticky,
      }
    },
    hasIcon (): boolean {
      return Boolean(this.icon || this.$slots.icon || this.$slots.icon)
    },
    isSticky (): boolean {
      return this.sticky || this.app
    },
    styles (): object {
      const styles: Record<string, any> = { ...VSheet.computed.styles.call(this) }

      if (this.isSticky) {
        const top = !this.app
          ? 0
          : (this.$vuetify.application.bar + this.$vuetify.application.top)

        styles.top = convertToUnit(top)
        styles.position = 'sticky'
        styles.zIndex = 1
      }

      return styles
    },
  },

  methods: {
    /** @public */
    toggle () {
      this.isActive = !this.isActive
    },
    iconClick (e: MouseEvent) {
      this.$emit('click:icon', e)
    },
    genIcon () {
      if (!this.hasIcon) return undefined

      let content

      if (this.icon) {
        content = h(VIcon, {
          color: this.iconColor,
          size: 28
        }, () => [this.icon])
      } else {
        content = getSlot(this, 'icon')
      }

      return h(VAvatar, {
        class: 'v-banner__icon',
        color: this.color,
        size: 40,
        onClick: this.iconClick,
      }, () => [content])
    },
    genText () {
      return h('div', {
        class: 'v-banner__text',
      }, getSlot(this))
    },
    genActions () {
      const children = getSlot(this, 'actions', {
        dismiss: () => this.isActive = false,
      })

      if (!children) return undefined

      return h('div', {
        class: 'v-banner__actions',
      }, children)
    },
    genContent () {
      return h('div', {
        class: 'v-banner__content',
      }, [
        this.genIcon(),
        this.genText(),
      ])
    },
    genWrapper () {
      return h('div', {
        class: 'v-banner__wrapper',
      }, [
        this.genContent(),
        this.genActions(),
      ])
    },
  },

  render (): VNode {
    const data = {
      class: ['v-banner', this.classes],
      ...this.$attrs,
      style: this.styles,
    }

    return h(VExpandTransition, {}, () => [
      withDirectives(
        h(
          'div',
          this.outlined ? data : this.setBackgroundColor(this.color, data),
          [this.genWrapper()],
        ),
        [[vShow, this.isActive]],
      ),
    ])
  },
})
