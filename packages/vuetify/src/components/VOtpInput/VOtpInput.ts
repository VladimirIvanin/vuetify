import {h} from 'vue'
// Styles
import '../VTextField/VTextField.sass'
import './VOtpInput.sass'

// Extensions
import VInput from '../VInput'
import VTextField from '../VTextField/VTextField'
// Directives
import ripple from '../../directives/ripple'

// Utilities
import { convertToUnit, keyCodes } from '../../util/helpers'
import { breaking } from '../../util/console'

// Types
import mixins from '../../util/mixins'
import { VNode } from 'vue'

const baseMixins = mixins(
  VInput,
)

interface options extends InstanceType<typeof baseMixins> {
  $refs: {
    input: HTMLInputElement[]
  }
}

/* @vue/component */
export default baseMixins.extend({
  name: 'v-otp-input',

  directives: {
    ripple,
  },

  inheritAttrs: false,

  props: {
    length: {
      type: [Number, String],
      default: 6,
    },
    type: {
      type: String,
      default: 'text',
    },
    plain: Boolean,
  },

  emits: ['blur', 'focus', 'change', 'keydown', 'finish'],

  data: () => ({
    initialValue: null,
    isBooted: false,
    otp: [] as string[],
  }),

  computed: {
    outlined (): Boolean {
      return !this.plain
    },
    classes (): object {
      return {
        ...VInput.computed.classes.call(this),
        ...VTextField.computed.classes.call(this),
        'v-otp-input--plain': this.plain,
      }
    },
  },

  watch: {
    isFocused: 'updateValue',
    modelValue (val) {
      this.lazyValue = val
      this.otp = val?.split('') || []
    },
  },

  created () {
    /* istanbul ignore next */
    if (this.$attrs.hasOwnProperty('browser-autocomplete')) {
      breaking('browser-autocomplete', 'autocomplete', this)
    }

    this.otp = this.internalValue?.split('') || []
  },

  mounted () {
    requestAnimationFrame(() => (this.isBooted = true))
  },

  methods: {
    /** @public */
    focus (e: Event, otpIdx: number) {
      this.onFocus(e, otpIdx || 0)
    },
    genInputSlot (otpIdx: number) {
      return h('div', this.setBackgroundColor(this.backgroundColor, {
        class: 'v-input__slot',
        style: { height: convertToUnit(this.height) },
        onClick: () => this.onClick(otpIdx),
        onMousedown: (e: Event) => this.onMouseDown(e, otpIdx),
        onMouseup: (e: Event) => this.onMouseUp(e, otpIdx),
      }), [this.genDefaultSlot(otpIdx)])
    },
    genControl (otpIdx: number) {
      return h('div', {
        class: 'v-input__control',
      }, [
        this.genInputSlot(otpIdx),
      ])
    },
    genDefaultSlot (otpIdx: number) {
      return [
        this.genFieldset(),
        this.genTextFieldSlot(otpIdx),
      ]
    },
    genContent () {
      return Array.from({ length: +this.length }, (_, i) => {
        return h('div', this.setTextColor(this.validationState, {
          class: ['v-input', this.classes]
        }), [this.genControl(i)])
      })
    },
    genFieldset () {
      return h('fieldset', {
        attrs: {
          'aria-hidden': true,
        },
      }, [this.genLegend()])
    },
    genLegend () {
      const span = h('span', {
        domProps: { innerHTML: '&#8203;' },
      })

      return h('legend', {
        style: {
          width: '0px',
        },
      }, [span])
    },
    genInput (otpIdx: number) {
      const listeners = Object.assign({}, this.listeners$)
      delete listeners.change // Change should not be bound externally

      return h('input', {
        style: {},
        value: this.otp[otpIdx],
        min: this.type === 'number' ? 0 : null,
        ...this.attrs$,
        autocomplete: 'one-time-code',
        disabled: this.isDisabled,
        readonly: this.isReadonly,
        type: this.type,
        id: `${this.computedId}--${otpIdx}`,
        class: `otp-field-box--${otpIdx}`,
        ...Object.assign(listeners, {
          onBlur: this.onBlur,
          onInput: (e: Event) => this.onInput(e, otpIdx),
          onFocus: (e: Event) => this.onFocus(e, otpIdx),
          onKeydown: this.onKeyDown,
          onKeyup: (e: KeyboardEvent) => this.onKeyUp(e, otpIdx),
        }),
        ref: 'input',
        refInFor: true,
      })
    },
    genTextFieldSlot (otpIdx: number): VNode {
      return h('div', {
        class: 'v-text-field__slot',
      }, [
        this.genInput(otpIdx),
      ])
    },
    onBlur (e?: Event) {
      this.isFocused = false
      e && this.$nextTick(() => this.$emit('blur', e))
    },
    onClick (otpIdx: number) {
      if (this.isFocused || this.isDisabled || !this.$refs.input[otpIdx]) return

      this.onFocus(undefined, otpIdx)
    },
    onFocus (e?: Event, otpIdx?: number) {
      e?.preventDefault()
      e?.stopPropagation()
      const elements = this.$refs.input as HTMLInputElement[]
      const ref = this.$refs.input && elements[otpIdx || 0]
      if (!ref) return

      if (document.activeElement !== ref) {
        ref.focus()
        return ref.select()
      }

      if (!this.isFocused) {
        this.isFocused = true
        ref.select()
        e && this.$emit('focus', e)
      }
    },
    onInput (e: Event, index: number) {
      const maxCursor = +this.length - 1

      const target = e.target as HTMLInputElement
      const value = target.value
      const inputDataArray = value?.split('') || []

      const newOtp: string[] = [...this.otp]
      for (let i = 0; i < inputDataArray.length; i++) {
        const appIdx = index + i
        if (appIdx > maxCursor) break
        newOtp[appIdx] = inputDataArray[i].toString()
      }
      if (!inputDataArray.length) {
        newOtp.splice(index, 1)
      }

      this.otp = newOtp
      this.internalValue = this.otp.join('')

      if (index + inputDataArray.length >= +this.length) {
        this.onCompleted()
        this.clearFocus(index)
      } else if (inputDataArray.length) {
        this.changeFocus(index + inputDataArray.length)
      }
    },
    clearFocus (index: number) {
      const input = this.$refs.input[index] as HTMLInputElement
      input.blur()
    },
    onKeyDown (e: KeyboardEvent) {
      if (e.keyCode === keyCodes.enter) {
        this.$emit('change', this.internalValue)
      }

      this.$emit('keydown', e)
    },
    onMouseDown (e: Event, otpIdx: number) {
      // Prevent input from being blurred
      if (e.target !== this.$refs.input[otpIdx]) {
        e.preventDefault()
        e.stopPropagation()
      }

      VInput.methods.onMouseDown.call(this, e)
    },
    onMouseUp (e: Event, otpIdx: number) {
      if (this.hasMouseDown) this.focus(e, otpIdx)

      VInput.methods.onMouseUp.call(this, e)
    },
    changeFocus (index: number) {
      this.onFocus(undefined, index || 0)
    },
    updateValue (val: boolean) {
      // Sets validationState from validatable
      this.hasColor = val

      if (val) {
        this.initialValue = this.lazyValue
      } else if (this.initialValue !== this.lazyValue) {
        this.$emit('change', this.lazyValue)
      }
    },
    onKeyUp (event: KeyboardEvent, index: number) {
      event.preventDefault()
      const eventKey = event.key
      if (['Tab', 'Shift', 'Meta', 'Control', 'Alt'].includes(eventKey)) {
        return
      }
      if (['Delete'].includes(eventKey)) {
        return
      }
      if (eventKey === 'ArrowLeft' || (eventKey === 'Backspace' && !this.otp[index])) {
        return index > 0 && this.changeFocus(index - 1)
      }
      if (eventKey === 'ArrowRight') {
        return index + 1 < +this.length && this.changeFocus(index + 1)
      }
    },
    onCompleted () {
      const rsp = this.otp.join('')
      if (rsp.length === +this.length) {
        this.$emit('finish', rsp)
      }
    },
  },
  render (): VNode {
    return h('div', {
      class: ['v-otp-input', this.themeClasses],
    }, this.genContent())
  },
})
