// Styles
import './VInput.sass'

// Components
import VIcon from '../VIcon'
import VLabel from '../VLabel'
import VMessages from '../VMessages'

// Mixins
import BindsAttrs from '../../mixins/binds-attrs'
import Validatable from '../../mixins/validatable'

// Utilities
import {
  convertToUnit,
  getSlot,
  kebabCase,
  normalizeClasses,
} from '../../util/helpers'
import mergeData from '../../util/mergeData'

// Types
import { VNode, VNodeData, PropType, h, getCurrentInstance } from 'vue'
import mixins from '../../util/mixins'
import { InputValidationRule } from 'vuetify/types'

const baseMixins = mixins(
  BindsAttrs,
  Validatable,
)

interface options extends InstanceType<typeof baseMixins> {
  /* eslint-disable-next-line camelcase */
  $_modelEvent: string
}

/* @vue/component */
export default baseMixins.extend({
  name: 'v-input',

  inheritAttrs: false,

  props: {
    appendIcon: String,
    backgroundColor: {
      type: String,
      default: '',
    },
    dense: Boolean,
    height: [Number, String],
    hideDetails: [Boolean, String] as PropType<boolean | 'auto'>,
    hideSpinButtons: Boolean,
    hint: String,
    id: String,
    label: String,
    loading: Boolean,
    persistentHint: Boolean,
    prependIcon: String,
    modelValue: null as any as PropType<any>,
  },

  data () {
    return {
      lazyValue: this.modelValue,
      hasMouseDown: false,
    }
  },

  computed: {
    classes (): object {
      return {
        'v-input--has-state': this.hasState,
        'v-input--hide-details': !this.showDetails,
        'v-input--is-label-active': this.isLabelActive,
        'v-input--is-dirty': this.isDirty,
        'v-input--is-disabled': this.isDisabled,
        'v-input--is-focused': this.isFocused,
        // <v-switch loading>.loading === '' so we can't just cast to boolean
        'v-input--is-loading': this.loading !== false && this.loading != null,
        'v-input--is-readonly': this.isReadonly,
        'v-input--dense': this.dense,
        'v-input--hide-spin-buttons': this.hideSpinButtons,
        ...this.themeClasses,
      }
    },
    computedId (): string {
      return this.id || `input-${this.$.uid}`
    },
    hasDetails (): boolean {
      return this.messagesToDisplay.length > 0
    },
    hasHint (): boolean {
      return !this.hasMessages &&
        !!this.hint &&
        (this.persistentHint || this.isFocused)
    },
    hasLabel (): boolean {
      return !!(getSlot(this, 'label') || this.label)
    },
    // Proxy for `lazyValue`
    // This allows an input
    // to function without
    // a provided model
    internalValue: {
      get (): any {
        return this.lazyValue
      },
      set (val: any) {
        this.lazyValue = val
        this.$emit(this.$_modelEvent, val)
      },
    },
    isDirty (): boolean {
      return !!this.lazyValue
    },
    isLabelActive (): boolean {
      return this.isDirty
    },
    messagesToDisplay (): string[] {
      if (this.hasHint) return [this.hint]

      if (!this.hasMessages) return []

      return this.validations.map((validation: string | InputValidationRule) => {
        if (typeof validation === 'string') return validation

        const validationResult = validation(this.internalValue)

        return typeof validationResult === 'string' ? validationResult : ''
      }).filter(message => message !== '')
    },
    showDetails (): boolean {
      return this.hideDetails === false || (this.hideDetails === 'auto' && this.hasDetails)
    },
  },

  watch: {
    modelValue (val) {
      this.lazyValue = val
    },
  },

  beforeCreate () {
    // v-radio-group needs to emit a different event
    // https://github.com/vuetifyjs/vuetify/issues/4752
    this.$_modelEvent = /*(this.$options.model && this.$options.model.event) ||*/ 'update:modelValue'
  },

  methods: {
    genContent () {
      return [
        this.genPrependSlot(),
        this.genControl(),
        this.genAppendSlot(),
      ]
    },
    genControl () {
      return h('div', {
        class: 'v-input__control',
        title: this.attrs$.title,
      }, {
        default: () => [
          this.genInputSlot(),
          this.genMessages(),
        ]
      })
    },
    genDefaultSlot () {
      return [
        this.genLabel(),
        getSlot(this),
      ]
    },
    genIcon (
      type: string,
      cb?: (e: Event) => void,
      extraData: VNodeData = {}
    ) {
      const icon = (this as any)[`${type}Icon`]
      const eventName = `click:${kebabCase(type)}`
      const hasListener = !!(this.listeners$[eventName] || cb)

      const localeKey = {
        prepend: 'prependAction',
        prependInner: 'prependAction',
        append: 'appendAction',
        appendOuter: 'appendAction',
        clear: 'clear',
      }[type]
      const label = hasListener && localeKey
        ? this.$vuetify.lang.t(`$vuetify.input.${localeKey}`, this.label ?? '')
        : undefined

      const data = mergeData({
        'aria-label': label,
        color: this.validationState,
        dark: this.dark,
        disabled: this.isDisabled,
        light: this.light,
        tabindex: type === 'clear' ? -1 : undefined,
        ...(!hasListener
          ? {}
          : {
            onClick: (e: Event) => {
              e.preventDefault()
              e.stopPropagation()

              this.$emit(eventName, e)
              cb && cb(e)
            },
            // Container has g event that will
            // trigger menu open if enclosed
            onMouseup: (e: Event) => {
              e.preventDefault()
              e.stopPropagation()
            },
          }),
      }, extraData)

      return h('div', {
        class: {
          'v-input__icon': true,
          [`v-input__icon--${kebabCase(type)}`]: type
        },
      }, {
        default: () => [
          h(
            VIcon,
            data,
            {
              default: () => icon
            }
          ),
        ]
      })
    },
    genInputSlot () {
      return h('div', this.setBackgroundColor(this.backgroundColor, {
        class: {'v-input__slot': true},
        style: { height: convertToUnit(this.height) },
        onClick: this.onClick,
        onMousedown: this.onMouseDown,
        onMouseup: this.onMouseUp,
        ref: 'input-slot',
      }), {
        default: () => this.genDefaultSlot()
      })
    },
    genLabel () {
      if (!this.hasLabel) return null

      const slotContent = getSlot(this, 'label')

      return h(VLabel, {
        color: this.validationState,
        dark: this.dark,
        disabled: this.isDisabled,
        focused: this.hasState,
        for: this.computedId,
        light: this.light,
      }, {
        default: slotContent ? () => slotContent : () => this.label
      })
    },
    genMessages () {
      if (!this.showDetails) return null

      return h(VMessages, {
        color: this.hasHint ? '' : this.validationState,
        dark: this.dark,
        light: this.light,
        value: this.messagesToDisplay,
        role: this.hasMessages ? 'alert' : null,
      }, {default: getSlot(this, 'message') })
    },
    genSlot (
      type: string,
      location: string,
      slot: (VNode | VNode[])[]
    ) {
      if (!slot.length) return null

      const ref = `${type}-${location}`

      slot = slot.map(child => child instanceof Function ? child() : child)

      return h('div', {
        class: `v-input__${ref}`,
        ref,
      }, {
        default: () => slot
      })
    },
    genPrependSlot () {
      const slot = []

      const prependSlot = getSlot(this, 'prepend')
      if (prependSlot) {
        slot.push(prependSlot)
      } else if (this.prependIcon) {
        slot.push(this.genIcon('prepend'))
      }

      return this.genSlot('prepend', 'outer', slot)
    },
    genAppendSlot () {
      const slot = []

      // Append icon for text field was really
      // an appended inner icon, v-text-field
      // will overwrite this method in order to obtain
      // backwards compat
      const appendSlot = getSlot(this, 'append')
      if (appendSlot) {
        slot.push(appendSlot)
      } else if (this.appendIcon) {
        slot.push(this.genIcon('append'))
      }

      return this.genSlot('append', 'outer', slot)
    },
    onClick (e: Event) {
      this.$emit('click', e)
    },
    onMouseDown (e: Event) {
      this.hasMouseDown = true
      this.$emit('mousedown', e)
    },
    onMouseUp (e: Event) {
      this.hasMouseDown = false
      this.$emit('mouseup', e)
    },
  },

  render (): VNode {
    const { class: additionalClasses, ...restAttrs } = this.attrs$ as Record<string, any>

    return h('div', this.setTextColor(this.validationState, {
      class: {'v-input': true, ...this.classes, ...normalizeClasses(additionalClasses)},
      ...restAttrs
    }), {
      default: () => this.genContent()
    })
  },
})
