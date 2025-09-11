import { h, Transition } from 'vue';
import "../../../src/components/VDatePicker/VDatePickerTitle.sass"; // Components

import VIcon from '../VIcon'; // Mixins

import PickerButton from '../../mixins/picker-button'; // Utils

import mixins from '../../util/mixins';
export default mixins(PickerButton
/* @vue/component */
).extend({
  name: 'v-date-picker-title',
  props: {
    date: {
      type: String,
      default: ''
    },
    disabled: Boolean,
    readonly: Boolean,
    selectingYear: Boolean,
    modelValue: {
      type: String
    },
    year: {
      type: [Number, String],
      default: ''
    },
    yearIcon: {
      type: String
    }
  },
  emits: ['update:selecting-year'],
  data: () => ({
    isReversing: false
  }),
  computed: {
    computedTransition() {
      return this.isReversing ? 'picker-reverse-transition' : 'picker-transition';
    }

  },
  watch: {
    modelValue(val, prev) {
      this.isReversing = val < prev;
    }

  },
  methods: {
    genYearIcon() {
      return h(VIcon, {
        dark: true
      }, () => this.yearIcon);
    },

    getYearBtn() {
      return this.genPickerButton('selectingYear', true, [String(this.year), this.yearIcon ? this.genYearIcon() : null], false, 'v-date-picker-title__year');
    },

    genTitleText() {
      return h(Transition, {
        name: this.computedTransition
      }, () => [h('div', {
        innerHTML: this.date || '&nbsp;',
        key: this.modelValue
      })]);
    },

    genTitleDate() {
      return this.genPickerButton('selectingYear', false, [this.genTitleText()], false, 'v-date-picker-title__date');
    }

  },

  render() {
    return h('div', {
      class: ['v-date-picker-title', {
        'v-date-picker-title--disabled': this.disabled
      }]
    }, [this.getYearBtn(), this.genTitleDate()]);
  }

});
//# sourceMappingURL=VDatePickerTitle.js.map