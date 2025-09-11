import "../../../src/components/VDatePicker/VDatePickerHeader.sass"; // Components

import VBtn from '../VBtn';
import VIcon from '../VIcon'; // Mixins

import Colorable from '../../mixins/colorable';
import Localable from '../../mixins/localable';
import Themeable from '../../mixins/themeable'; // Utils

import { createNativeLocaleFormatter, monthChange } from './util';
import { getSlot } from '../../util/helpers'; // Types

import { Transition, h, defineComponent } from 'vue';
export default defineComponent({
  name: 'v-date-picker-header',
  mixins: [Colorable, Localable, Themeable],
  props: {
    disabled: Boolean,
    format: Function,
    min: String,
    max: String,
    nextAriaLabel: String,
    nextIcon: {
      type: String,
      default: '$next'
    },
    prevAriaLabel: String,
    prevIcon: {
      type: String,
      default: '$prev'
    },
    readonly: Boolean,
    modelValue: {
      type: [Number, String],
      required: true
    }
  },
  emits: ['update:modelValue', 'toggle'],

  data() {
    return {
      isReversing: false
    };
  },

  computed: {
    formatter() {
      if (this.format) {
        return this.format;
      } else if (String(this.modelValue).split('-')[1]) {
        return createNativeLocaleFormatter(this.currentLocale, {
          month: 'long',
          year: 'numeric',
          timeZone: 'UTC'
        }, {
          length: 7
        });
      } else {
        return createNativeLocaleFormatter(this.currentLocale, {
          year: 'numeric',
          timeZone: 'UTC'
        }, {
          length: 4
        });
      }
    }

  },
  watch: {
    modelValue(newVal, oldVal) {
      this.isReversing = newVal < oldVal;
    }

  },
  methods: {
    genBtn(change) {
      const ariaLabelId = change > 0 ? this.nextAriaLabel : this.prevAriaLabel;
      const ariaLabel = ariaLabelId ? this.$vuetify.lang.t(ariaLabelId) : undefined;
      const disabled = this.disabled || change < 0 && this.min && this.calculateChange(change) < this.min || change > 0 && this.max && this.calculateChange(change) > this.max;
      return h(VBtn, {
        'aria-label': ariaLabel,
        dark: this.dark,
        disabled,
        icon: true,
        light: this.light,
        onClick: e => {
          e.stopPropagation();
          this.$emit('update:modelValue', this.calculateChange(change));
        }
      }, {
        default: () => [h(VIcon, {}, {
          default: () => change < 0 === !this.$vuetify.rtl ? this.prevIcon : this.nextIcon
        })]
      });
    },

    calculateChange(sign) {
      const [year, month] = String(this.modelValue).split('-').map(Number);

      if (month == null) {
        return `${year + sign}`;
      } else {
        return monthChange(String(this.modelValue), sign);
      }
    },

    genHeader() {
      const color = !this.disabled && (this.color || 'accent');
      const header = h('div', this.setTextColor(color, {
        key: String(this.modelValue)
      }), {
        default: () => [h('button', {
          type: 'button',
          onClick: () => this.$emit('toggle')
        }, {
          default: () => getSlot(this) || [this.formatter(String(this.modelValue))]
        })]
      });
      const transition = h(Transition, {
        name: this.isReversing === !this.$vuetify.rtl ? 'tab-reverse-transition' : 'tab-transition'
      }, {
        default: () => [header]
      });
      return h('div', {
        class: ['v-date-picker-header__value', {
          'v-date-picker-header__value--disabled': this.disabled
        }]
      }, {
        default: () => [transition]
      });
    }

  },

  render() {
    return h('div', {
      class: ['v-date-picker-header', {
        'v-date-picker-header--disabled': this.disabled,
        ...this.themeClasses
      }]
    }, {
      default: () => [this.genBtn(-1), this.genHeader(), this.genBtn(+1)]
    });
  }

});
//# sourceMappingURL=VDatePickerHeader.js.map