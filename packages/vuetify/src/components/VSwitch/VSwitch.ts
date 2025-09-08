// Styles
import '../../styles/components/_selection-controls.sass'
import './VSwitch.sass'

// Mixins
import Selectable from '../../mixins/selectable'
import VInput from '../VInput'

// Directives
import Touch from '../../directives/touch'

// Components
import { VFabTransition } from '../transitions'
import VProgressCircular from '../VProgressCircular/VProgressCircular'

// Helpers
import { getSlot, keyCodes } from '../../util/helpers'

// Types
import { defineComponent, VNode, VNodeData, h } from 'vue'
import mergeData from '../../util/mergeData'

/* @vue/component */
export default defineComponent({
  name: 'v-switch',

  directives: { Touch },

  extends: Selectable,

  props: {
    inset: Boolean,
    loading: {
      type: [Boolean, String],
      default: false,
    },
    flat: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['click', 'focus', 'blur'],

  computed: {
    classes (): object {
      return {
        ...VInput.computed.classes.call(this),
        'v-input--selection-controls v-input--switch': true,
        'v-input--switch--flat': this.flat,
        'v-input--switch--inset': this.inset,
      }
    },
    attrs (): object {
      return {
        'aria-checked': String(this.isActive),
        'aria-disabled': String(this.isDisabled),
        role: 'switch',
      }
    },
    // Do not return undefined if disabled,
    // according to spec, should still show
    // a color when disabled and active
    validationState (): string | undefined {
      if (this.hasError && this.shouldValidate) return 'error'
      if (this.hasSuccess) return 'success'
      if (this.hasColor !== null) return this.computedColor
      return undefined
    },
    switchData (): VNodeData {
      return this.setTextColor(this.loading ? undefined : this.validationState, {
        class: this.themeClasses,
      })
    },
  },

  methods: {
    genDefaultSlot (): (VNode | null)[] {
      return [
        this.genSwitch(),
        this.genLabel(),
      ]
    },
    genSwitch (): VNode {
      const { title, ...switchAttrs } = this.attrs$

      return h('div', {
        class: 'v-input--selection-controls__input',
      }, [
        this.genInput('checkbox', {
          ...this.attrs,
          ...switchAttrs,
        }),
        this.genRipple(this.setTextColor(this.validationState, {
          directives: [[
            Touch,
            {
              left: this.onSwipeLeft,
              right: this.onSwipeRight,
            },
          ]],
        })),

        h('div', mergeData({ class: 'v-input--switch__track' },
          this.switchData,
        )),
        h('div', mergeData({ class: 'v-input--switch__thumb' },
          this.switchData,
        ), [this.genProgress()]),
      ])
    },
    genProgress (): VNode {
      return h(VFabTransition, {}, () => [
        this.loading === false
          ? null
          : getSlot(this, 'progress') || h(VProgressCircular, {
            color: (this.loading === true || this.loading === '')
              ? (this.color || 'primary')
              : this.loading,
            size: 16,
            width: 2,
            indeterminate: true,
          }),
      ])
    },
    onSwipeLeft () {
      if (this.isActive) this.onChange()
    },
    onSwipeRight () {
      if (!this.isActive) this.onChange()
    },
    onKeydown (e: KeyboardEvent) {
      if (
        (e.keyCode === keyCodes.left && this.isActive) ||
        (e.keyCode === keyCodes.right && !this.isActive)
      ) this.onChange()
    },
  },
})
