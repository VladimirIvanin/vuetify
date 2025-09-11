import "../../../src/components/VDatePicker/VDatePickerYears.sass"; // Mixins

import Colorable from '../../mixins/colorable';
import Localable from '../../mixins/localable'; // Utils

import { createNativeLocaleFormatter } from './util';
import mixins from '../../util/mixins'; // Types

import { h } from 'vue';
export default mixins(Colorable, Localable
/* @vue/component */
).extend({
  name: 'v-date-picker-years',
  props: {
    format: Function,
    min: [Number, String],
    max: [Number, String],
    readonly: Boolean,
    modelValue: [Number, String]
  },

  data() {
    return {
      defaultColor: 'primary'
    };
  },

  computed: {
    formatter() {
      return this.format || createNativeLocaleFormatter(this.currentLocale, {
        year: 'numeric',
        timeZone: 'UTC'
      }, {
        length: 4
      });
    }

  },

  mounted() {
    setTimeout(() => {
      const activeItem = this.$el.getElementsByClassName('active')[0];

      if (activeItem) {
        this.$el.scrollTop = activeItem.offsetTop - this.$el.offsetHeight / 2 + activeItem.offsetHeight / 2;
      } else if (this.min && !this.max) {
        this.$el.scrollTop = this.$el.scrollHeight;
      } else if (!this.min && this.max) {
        this.$el.scrollTop = 0;
      } else {
        this.$el.scrollTop = this.$el.scrollHeight / 2 - this.$el.offsetHeight / 2;
      }
    });
  },

  methods: {
    genYearItem(year) {
      const formatted = this.formatter(`${year}`);
      const active = parseInt(this.modelValue, 10) === year;
      const color = active && (this.color || 'primary');
      return h('li', this.setTextColor(color, {
        key: year,
        class: {
          active
        },
        onClick: () => this.$emit('update:modelValue', year)
      }), formatted);
    },

    genYearItems() {
      const children = [];
      const selectedYear = this.modelValue ? parseInt(this.modelValue, 10) : new Date().getFullYear();
      const maxYear = this.max ? parseInt(this.max, 10) : selectedYear + 100;
      const minYear = Math.min(maxYear, this.min ? parseInt(this.min, 10) : selectedYear - 100);

      for (let year = maxYear; year >= minYear; year--) {
        children.push(this.genYearItem(year));
      }

      return children;
    }

  },

  render() {
    return h('ul', {
      class: 'v-date-picker-years',
      ref: 'years'
    }, this.genYearItems());
  }

});
//# sourceMappingURL=VDatePickerYears.js.map