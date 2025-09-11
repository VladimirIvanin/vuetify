// Components
import VInput from '../../components/VInput'; // Mixins

import Rippleable from '../rippleable';
import Comparable from '../comparable'; // Utilities

import mixins from '../../util/mixins';
import { h } from 'vue';
export function prevent(e) {
  e.preventDefault();
}
/* @vue/component */

export default mixins(VInput, Rippleable, Comparable).extend({
  name: 'selectable',
  props: {
    id: String,
    value: null,
    falseValue: null,
    trueValue: null,
    multiple: {
      type: Boolean,
      default: null
    },
    label: String
  },

  data() {
    return {
      hasColor: this.modelValue,
      lazyValue: this.modelValue
    };
  },

  created() {
    this.$_emitChangeEvent = true;
  },

  computed: {
    computedColor() {
      if (!this.isActive) return undefined;
      if (this.color) return this.color;
      if (this.isDark && !this.appIsDark) return 'white';
      return 'primary';
    },

    isMultiple() {
      return this.multiple === true || this.multiple === null && Array.isArray(this.internalValue);
    },

    isActive() {
      const value = this.value;
      const input = this.internalValue;

      if (this.isMultiple) {
        if (!Array.isArray(input)) return false;
        return input.some(item => this.valueComparator(item, value));
      }

      if (this.trueValue === undefined || this.falseValue === undefined) {
        return value ? this.valueComparator(value, input) : Boolean(input);
      }

      return this.valueComparator(input, this.trueValue);
    },

    isDirty() {
      return this.isActive;
    },

    rippleState() {
      return !this.isDisabled && !this.validationState ? undefined : this.validationState;
    }

  },
  watch: {
    modelValue(val) {
      this.lazyValue = val;
      this.hasColor = val;
    }

  },
  methods: {
    genLabel() {
      const label = VInput.methods.genLabel.call(this);
      if (!label) return label; // Label shouldn't cause the input to focus

      label.onClick = this.onClick;
      return label;
    },

    genInput(type, attrs) {
      return h('input', { ...Object.assign({
          'aria-checked': this.isActive.toString(),
          disabled: this.isDisabled,
          id: this.computedId,
          role: type,
          type
        }, attrs),
        value: this.value,
        checked: this.isActive,
        onBlur: this.onBlur,
        onChange: this.onChange,
        onFocus: this.onFocus,
        onKeydown: this.onKeydown,
        onClick: prevent,
        ref: 'input'
      });
    },

    onClick(e) {
      e.preventDefault();
      this.onChange();
      this.$emit('click', e);
    },

    onChange() {
      if (!this.isInteractive) return;
      const value = this.value;
      let input = this.internalValue;

      if (this.isMultiple) {
        if (!Array.isArray(input)) {
          input = [];
        }

        const length = input.length;
        input = input.filter(item => !this.valueComparator(item, value));

        if (input.length === length) {
          input.push(value);
        }
      } else if (this.trueValue !== undefined && this.falseValue !== undefined) {
        input = this.valueComparator(input, this.trueValue) ? this.falseValue : this.trueValue;
      } else if (value) {
        input = this.valueComparator(input, value) ? null : value;
      } else {
        input = !input;
      }

      this.validate(true, input);
      this.internalValue = input;
      this.hasColor = input;
    },

    onFocus(e) {
      this.isFocused = true;
      this.$emit('focus', e);
    },

    onBlur(e) {
      this.isFocused = false;
      this.$emit('blur', e);
    },

    /** @abstract */
    onKeydown(e) {}

  }
});
//# sourceMappingURL=index.js.map