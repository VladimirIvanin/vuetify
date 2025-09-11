import { h, defineComponent } from 'vue'; // Styles

import "../../../src/components/VCalendar/VCalendarCategory.sass"; // Mixins

import VCalendarDaily from './VCalendarDaily'; // Util

import { convertToUnit, getSlot } from '../../util/helpers';
import props from './util/props';
import { getParsedCategories } from './util/parser';
/* @vue/component */

export default defineComponent({
  name: 'v-calendar-category',
  extends: VCalendarDaily,
  props: props.category,
  computed: {
    classes() {
      return {
        'v-calendar-daily': true,
        'v-calendar-category': true,
        ...this.themeClasses
      };
    },

    parsedCategories() {
      return getParsedCategories(this.categories, this.categoryText);
    }

  },
  methods: {
    genDayHeader(day, index) {
      const data = {
        class: 'v-calendar-category__columns'
      };
      const scope = {
        week: this.days,
        ...day,
        index
      };
      const children = this.parsedCategories.map(category => {
        return this.genDayHeaderCategory(day, this.getCategoryScope(scope, category));
      });
      return [h('div', data, children)];
    },

    getCategoryScope(scope, category) {
      const cat = typeof category === 'object' && category && category.categoryName === this.categoryForInvalid ? null : category;
      return { ...scope,
        category: cat
      };
    },

    genDayHeaderCategory(day, scope) {
      const headerTitle = typeof scope.category === 'object' ? scope.category.categoryName : scope.category;
      return h('div', {
        class: 'v-calendar-category__column-header',
        ...this.getDefaultMouseEventHandlers(':day-category', e => {
          return this.getCategoryScope(this.getSlotScope(day), scope.category);
        })
      }, [getSlot(this, 'category', scope) || this.genDayHeaderCategoryTitle(headerTitle), getSlot(this, 'day-header', scope)]);
    },

    genDayHeaderCategoryTitle(categoryName) {
      return h('div', {
        class: 'v-calendar-category__category'
      }, categoryName === null ? this.categoryForInvalid : categoryName);
    },

    genDays() {
      const days = [];
      this.days.forEach((d, j) => {
        const day = new Array(this.parsedCategories.length || 1);
        day.fill(d);
        days.push(...day.map((v, i) => this.genDay(v, j, i)));
      });
      return days;
    },

    genDay(day, index, categoryIndex) {
      const category = this.parsedCategories[categoryIndex];
      return h('div', {
        key: day.date + '-' + categoryIndex,
        class: ['v-calendar-daily__day', this.getRelativeClasses(day)],
        ...this.getDefaultMouseEventHandlers(':time', e => {
          return this.getSlotScope(this.getTimestampAtEvent(e, day));
        })
      }, [...this.genDayIntervals(index, category), ...this.genDayBody(day, category)]);
    },

    genDayIntervals(index, category) {
      return this.intervals[index].map(v => this.genDayInterval(v, category));
    },

    genDayInterval(interval, category) {
      const height = convertToUnit(this.intervalHeight);
      const styler = this.intervalStyle || this.intervalStyleDefault;
      const data = {
        key: interval.time,
        class: 'v-calendar-daily__day-interval',
        style: {
          height,
          ...styler({ ...interval,
            category
          })
        }
      };
      const children = getSlot(this, 'interval', this.getCategoryScope(this.getSlotScope(interval), category));
      return h('div', data, children);
    },

    genDayBody(day, category) {
      const data = {
        class: 'v-calendar-category__columns'
      };
      const children = [this.genDayBodyCategory(day, category)];
      return [h('div', data, children)];
    },

    genDayBodyCategory(day, category) {
      const data = {
        class: 'v-calendar-category__column',
        ...this.getDefaultMouseEventHandlers(':time-category', e => {
          return this.getCategoryScope(this.getSlotScope(this.getTimestampAtEvent(e, day)), category);
        })
      };
      const children = getSlot(this, 'day-body', this.getCategoryScope(this.getSlotScope(day), category));
      return h('div', data, children);
    }

  }
});
//# sourceMappingURL=VCalendarCategory.js.map