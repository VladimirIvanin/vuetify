import { h } from 'vue'; // Styles

import "../../../src/components/VTextField/VTextField.sass";
import "../../../src/components/VOtpInput/VOtpInput.sass"; // Extensions

import VInput from '../VInput';
import VTextField from '../VTextField/VTextField'; // Utilities

import { convertToUnit, keyCodes } from '../../util/helpers';
import { breaking } from '../../util/console'; // Types

import mixins from '../../util/mixins';
const baseMixins = mixins(VInput);
/* @vue/component */

export default baseMixins.extend({
  name: 'v-otp-input',
  inheritAttrs: false,
  props: {
    length: {
      type: [Number, String],
      default: 6
    },
    type: {
      type: String,
      default: 'text'
    },
    plain: Boolean
  },
  emits: ['blur', 'focus', 'change', 'keydown', 'finish'],
  data: () => ({
    initialValue: null,
    isBooted: false,
    otp: []
  }),
  computed: {
    outlined() {
      return !this.plain;
    },

    fullWidth() {
      return false;
    },

    prefix() {
      return false;
    },

    isSingle() {
      return true;
    },

    isSolo() {
      return false;
    },

    soloInverted() {
      return false;
    },

    flat() {
      return false;
    },

    filled() {
      return false;
    },

    isEnclosed() {
      return this.outlined;
    },

    reverse() {
      return false;
    },

    placeholder() {
      return '';
    },

    rounded() {
      return false;
    },

    shaped() {
      return false;
    },

    classes() {
      return { ...VInput.computed.classes.call(this),
        ...VTextField.computed.classes.call(this),
        'v-otp-input--plain': this.plain
      };
    }

  },
  watch: {
    isFocused: 'updateValue',

    modelValue(val) {
      this.lazyValue = val;
      this.otp = (val === null || val === void 0 ? void 0 : val.split('')) || [];
    }

  },

  created() {
    var _a;
    /* istanbul ignore next */


    if (this.$attrs.hasOwnProperty('browser-autocomplete')) {
      breaking('browser-autocomplete', 'autocomplete', this);
    }

    this.otp = ((_a = this.internalValue) === null || _a === void 0 ? void 0 : _a.split('')) || [];
  },

  mounted() {
    requestAnimationFrame(() => this.isBooted = true);
  },

  methods: {
    /** @public */
    focus(e, otpIdx) {
      this.onFocus(e, otpIdx || 0);
    },

    genInputSlot(otpIdx) {
      return h('div', this.setBackgroundColor(this.backgroundColor, {
        class: 'v-input__slot',
        style: {
          height: convertToUnit(this.height)
        },
        onClick: () => this.onClick(otpIdx),
        onMousedown: e => this.onMouseDown(e, otpIdx),
        onMouseup: e => this.onMouseUp(e, otpIdx)
      }), [this.genDefaultSlot(otpIdx)]);
    },

    genControl(otpIdx) {
      return h('div', {
        class: 'v-input__control'
      }, [this.genInputSlot(otpIdx)]);
    },

    genDefaultSlot(otpIdx) {
      return [this.genFieldset(), this.genTextFieldSlot(otpIdx)];
    },

    genContent() {
      return Array.from({
        length: +this.length
      }, (_, i) => {
        return h('div', this.setTextColor(this.validationState, {
          class: ['v-input', this.classes]
        }), [this.genControl(i)]);
      });
    },

    genFieldset() {
      return h('fieldset', {
        attrs: {
          'aria-hidden': true
        }
      }, [this.genLegend()]);
    },

    genLegend() {
      const span = h('span', {
        domProps: {
          innerHTML: '&#8203;'
        }
      });
      return h('legend', {
        style: {
          width: '0px'
        }
      }, [span]);
    },

    genInput(otpIdx) {
      const listeners = Object.assign({}, this.listeners$);
      delete listeners.change; // Change should not be bound externally

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
          onInput: e => this.onInput(e, otpIdx),
          onFocus: e => this.onFocus(e, otpIdx),
          onKeydown: this.onKeyDown,
          onKeyup: e => this.onKeyUp(e, otpIdx)
        }),
        ref: 'input',
        refInFor: true
      });
    },

    genTextFieldSlot(otpIdx) {
      return h('div', {
        class: 'v-text-field__slot'
      }, [this.genInput(otpIdx)]);
    },

    onBlur(e) {
      this.isFocused = false;
      e && this.$nextTick(() => this.$emit('blur', e));
    },

    onClick(otpIdx) {
      if (this.isFocused || this.isDisabled || !this.$refs.input[otpIdx]) return;
      this.onFocus(undefined, otpIdx);
    },

    onFocus(e, otpIdx) {
      e === null || e === void 0 ? void 0 : e.preventDefault();
      e === null || e === void 0 ? void 0 : e.stopPropagation();
      const elements = this.$refs.input;
      const ref = this.$refs.input && elements[otpIdx || 0];
      if (!ref) return;

      if (document.activeElement !== ref) {
        ref.focus();
        return ref.select();
      }

      if (!this.isFocused) {
        this.isFocused = true;
        ref.select();
        e && this.$emit('focus', e);
      }
    },

    onInput(e, index) {
      const maxCursor = +this.length - 1;
      const target = e.target;
      const value = target.value;
      const inputDataArray = (value === null || value === void 0 ? void 0 : value.split('')) || [];
      const newOtp = [...this.otp];

      for (let i = 0; i < inputDataArray.length; i++) {
        const appIdx = index + i;
        if (appIdx > maxCursor) break;
        newOtp[appIdx] = inputDataArray[i].toString();
      }

      if (!inputDataArray.length) {
        newOtp.splice(index, 1);
      }

      this.otp = newOtp;
      this.internalValue = this.otp.join('');

      if (index + inputDataArray.length >= +this.length) {
        this.onCompleted();
        this.clearFocus(index);
      } else if (inputDataArray.length) {
        this.changeFocus(index + inputDataArray.length);
      }
    },

    clearFocus(index) {
      const input = this.$refs.input[index];
      input.blur();
    },

    onKeyDown(e) {
      if (e.keyCode === keyCodes.enter) {
        this.$emit('change', this.internalValue);
      }

      this.$emit('keydown', e);
    },

    onMouseDown(e, otpIdx) {
      // Prevent input from being blurred
      if (e.target !== this.$refs.input[otpIdx]) {
        e.preventDefault();
        e.stopPropagation();
      }

      VInput.methods.onMouseDown.call(this, e);
    },

    onMouseUp(e, otpIdx) {
      if (this.hasMouseDown) this.focus(e, otpIdx);
      VInput.methods.onMouseUp.call(this, e);
    },

    changeFocus(index) {
      this.onFocus(undefined, index || 0);
    },

    updateValue(val) {
      // Sets validationState from validatable
      this.hasColor = val;

      if (val) {
        this.initialValue = this.lazyValue;
      } else if (this.initialValue !== this.lazyValue) {
        this.$emit('change', this.lazyValue);
      }
    },

    onKeyUp(event, index) {
      event.preventDefault();
      const eventKey = event.key;

      if (['Tab', 'Shift', 'Meta', 'Control', 'Alt'].includes(eventKey)) {
        return;
      }

      if (['Delete'].includes(eventKey)) {
        return;
      }

      if (eventKey === 'ArrowLeft' || eventKey === 'Backspace' && !this.otp[index]) {
        return index > 0 && this.changeFocus(index - 1);
      }

      if (eventKey === 'ArrowRight') {
        return index + 1 < +this.length && this.changeFocus(index + 1);
      }
    },

    onCompleted() {
      const rsp = this.otp.join('');

      if (rsp.length === +this.length) {
        this.$emit('finish', rsp);
      }
    }

  },

  render() {
    return h('div', {
      class: ['v-otp-input', this.themeClasses]
    }, this.genContent());
  }

});
//# sourceMappingURL=VOtpInput.js.map