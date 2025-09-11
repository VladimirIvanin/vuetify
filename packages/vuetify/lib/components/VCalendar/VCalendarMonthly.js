import { defineComponent } from 'vue'; // Styles

import "../../../src/components/VCalendar/VCalendarWeekly.sass"; // Mixins

import VCalendarWeekly from './VCalendarWeekly'; // Util

import { parseTimestamp, getStartOfMonth, getEndOfMonth } from './util/timestamp';
/* @vue/component */

export default defineComponent({
  name: 'v-calendar-monthly',
  extends: VCalendarWeekly,
  computed: {
    staticClass() {
      return 'v-calendar-monthly v-calendar-weekly';
    },

    parsedStart() {
      return getStartOfMonth(parseTimestamp(this.start, true));
    },

    parsedEnd() {
      return getEndOfMonth(parseTimestamp(this.end, true));
    }

  }
});
//# sourceMappingURL=VCalendarMonthly.js.map