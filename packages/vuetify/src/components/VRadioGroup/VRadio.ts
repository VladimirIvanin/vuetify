import {h} from 'vue'
// Styles
import './VRadio.sass'

// Components
import VRadioGroup from './VRadioGroup'
import VLabel from '../VLabel'
import VIcon from '../VIcon'
import VInput from '../VInput'

// Mixins
import BindsAttrs from '../../mixins/binds-attrs'
import Colorable from '../../mixins/colorable'
import { factory as GroupableFactory } from '../../mixins/groupable'
import Rippleable from '../../mixins/rippleable'
import Themeable from '../../mixins/themeable'
import Selectable, { prevent } from '../../mixins/selectable'

// Utilities
import { getSlot } from '../../util/helpers'

// Types
import { VNode, VNodeData } from 'vue'
import mixins from '../../util/mixins'
import { mergeListeners } from '../../util/mergeData'

const baseMixins = mixins(
  BindsAttrs,
  Colorable,
  Rippleable,
  GroupableFactory('radioGroup'),
  Themeable
)

interface options extends InstanceType<typeof baseMixins> {
  radioGroup: InstanceType<typeof VRadioGroup>
}

/* @vue/component */
export default baseMixins.extend({
  name: 'v-radio',

  inheritAttrs: false,

  emits: ['change', 'focus', 'blur'],

  props: {
    disabled: {
      type: Boolean,
      default: null,
    },
    id: String,
    label: String,
    name: String,
    offIcon: {
      type: String,
      default: '$radioOff',
    },
    onIcon: {
      type: String,
      default: '$radioOn',
    },
    readonly: {
      type: Boolean,
      default: null,
    },
    value: {
      default: null,
    },
  },

  data: () => ({
    isFocused: false,
  }),

  computed: {
    classes (): object {
      return {
        'v-radio--is-disabled': this.isDisabled,
        'v-radio--is-focused': this.isFocused,
        ...this.themeClasses,
        ...this.groupClasses,
      }
    },
    computedColor (): string | undefined {
      if (this.isDisabled) return undefined
      return Selectable.computed.computedColor.call(this)
    },
    computedIcon (): string {
      return this.isActive
        ? this.onIcon
        : this.offIcon
    },
    computedId (): string {
      return VInput.computed.computedId.call(this)
    },
    hasLabel: VInput.computed.hasLabel,
    hasState (): boolean {
      return (this.radioGroup || {}).hasState
    },
    isDisabled (): boolean {
      return this.disabled ?? (
        !!this.radioGroup &&
        this.radioGroup.isDisabled
      )
    },
    isReadonly (): boolean {
      return this.readonly ?? (
        !!this.radioGroup &&
        this.radioGroup.isReadonly
      )
    },
    computedName (): string {
      if (this.name || !this.radioGroup) {
        return this.name
      }

      return this.radioGroup.name || `radio-${this.radioGroup.$.uid}`
    },
    rippleState (): string | undefined {
      return Selectable.computed.rippleState.call(this)
    },
    validationState (): string | undefined {
      return (this.radioGroup || {}).validationState || this.computedColor
    },
  },

  methods: {
    genInput (args: any) {
      // We can't actually use the mixin directly because
      // it's made for standalone components, but its
      // genInput method is exactly what we need
      return Selectable.methods.genInput.call(this, 'radio', args)
    },
    genLabel () {
      if (!this.hasLabel) return null

      return h(VLabel, {
        // Label shouldn't cause the input to focus
        onClick: prevent,
        for: this.computedId,
        color: this.validationState,
        focused: this.hasState,
      }, () => getSlot(this, 'label') || this.label)
    },
    genRadio () {
      const { title, ...radioAttrs } = this.attrs$

      return h('div', {
        class: 'v-input--selection-controls__input',
      }, [
        h(VIcon, this.setTextColor(this.validationState, {
          dense: this.radioGroup && this.radioGroup.dense,
        }), () => this.computedIcon),
        this.genInput({
          name: this.computedName,
          value: this.value,
          ...radioAttrs,
        }),
        this.genRipple(this.setTextColor(this.rippleState)),
      ])
    },
    onFocus (e: Event) {
      this.isFocused = true
      this.$emit('focus', e)
    },
    onBlur (e: Event) {
      this.isFocused = false
      this.$emit('blur', e)
    },
    onChange () {
      if (this.isDisabled || this.isReadonly || this.isActive) return

      this.toggle()
    },
    onKeydown: () => {}, // Override default with noop
  },

  render (): VNode {
    const data: VNodeData = {
      class: ['v-radio', this.classes],
      ...mergeListeners({
        onClick: this.onChange,
      }, this.listeners$),
      title: this.attrs$.title
    }

    return h('div', data, [
      this.genRadio(),
      this.genLabel(),
    ])
  },
})
