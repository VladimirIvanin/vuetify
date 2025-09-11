import { h, defineComponent } from 'vue'; // Styles

import "../../../src/components/VCalendar/VCalendarWeekly.sass"; // Components

import VBtn from '../VBtn'; // Mixins

import CalendarBase from './mixins/calendar-base'; // Util

import { getSlot } from '../../util/helpers';
import { weekNumber } from '../../util/dateTimeUtils';
import props from './util/props';
import { createDayList, getDayIdentifier, createNativeLocaleFormatter } from './util/timestamp';
/* @vue/component */

export default defineComponent({
  name: 'v-calendar-weekly',
  extends: CalendarBase,
  props: props.weeks,
  computed: {
    staticClass() {
      return 'v-calendar-weekly';
    },

    classes() {
      return this.themeClasses;
    },

    parsedMinWeeks() {
      return parseInt(this.minWeeks);
    },

    days() {
      const minDays = this.parsedMinWeeks * this.parsedWeekdays.length;
      const start = this.getStartOfWeek(this.parsedStart);
      const end = this.getEndOfWeek(this.parsedEnd);
      return createDayList(start, end, this.times.today, this.weekdaySkips, Number.MAX_SAFE_INTEGER, minDays);
    },

    todayWeek() {
      const today = this.times.today;
      const start = this.getStartOfWeek(today);
      const end = this.getEndOfWeek(today);
      return createDayList(start, end, today, this.weekdaySkips, this.parsedWeekdays.length, this.parsedWeekdays.length);
    },

    monthFormatter() {
      if (this.monthFormat) {
        return this.monthFormat;
      }

      const longOptions = {
        timeZone: 'UTC',
        month: 'long'
      };
      const shortOptions = {
        timeZone: 'UTC',
        month: 'short'
      };
      return createNativeLocaleFormatter(this.currentLocale, (_tms, short) => short ? shortOptions : longOptions);
    }

  },
  methods: {
    isOutside(day) {
      const dayIdentifier = getDayIdentifier(day);
      return dayIdentifier < getDayIdentifier(this.parsedStart) || dayIdentifier > getDayIdentifier(this.parsedEnd);
    },

    genHead() {
      return h('div', {
        class: 'v-calendar-weekly__head',
        role: 'row'
      }, this.genHeadDays());
    },

    genHeadDays() {
      const header = this.todayWeek.map(this.genHeadDay);

      if (this.showWeek) {
        header.unshift(h('div', {
          class: 'v-calendar-weekly__head-weeknumber'
        }));
      }

      return header;
    },

    genHeadDay(day, index) {
      const outside = this.isOutside(this.days[index]);
      const color = day.present ? this.color : undefined;
      return h('div', this.setTextColor(color, {
        key: day.date,
        class: ['v-calendar-weekly__head-weekday', this.getRelativeClasses(day, outside)],
        role: 'columnheader'
      }), this.weekdayFormatter(day, this.shortWeekdays));
    },

    genWeeks() {
      const days = this.days;
      const weekDays = this.parsedWeekdays.length;
      const weeks = [];

      for (let i = 0; i < days.length; i += weekDays) {
        weeks.push(this.genWeek(days.slice(i, i + weekDays), this.getWeekNumber(days[i])));
      }

      return weeks;
    },

    genWeek(week, weekNumber) {
      const weekNodes = week.map((day, index) => this.genDay(day, index, week));

      if (this.showWeek) {
        weekNodes.unshift(this.genWeekNumber(weekNumber));
      }

      return h('div', {
        key: week[0].date,
        class: 'v-calendar-weekly__week',
        role: 'row'
      }, weekNodes);
    },

    getWeekNumber(determineDay) {
      return weekNumber(determineDay.year, determineDay.month - 1, determineDay.day, this.parsedWeekdays[0], parseInt(this.localeFirstDayOfYear));
    },

    genWeekNumber(weekNumber) {
      return h('div', {
        class: 'v-calendar-weekly__weeknumber'
      }, [h('small', String(weekNumber))]);
    },

    genDay(day, index, week) {
      const outside = this.isOutside(day);
      return h('div', {
        key: day.date,
        class: ['v-calendar-weekly__day', this.getRelativeClasses(day, outside)],
        role: 'cell',
        ...this.getDefaultMouseEventHandlers(':day', nativeEvent => {
          return {
            nativeEvent,
            ...day
          };
        })
      }, [this.genDayLabel(day), ...(getSlot(this, 'day', {
        outside,
        index,
        week,
        ...day
      }) || [])]);
    },

    genDayLabel(day) {
      return h('div', {
        class: 'v-calendar-weekly__day-label'
      }, getSlot(this, 'day-label', day) || [this.genDayLabelButton(day)]);
    },

    genDayLabelButton(day) {
      const color = day.present ? this.color : 'transparent';
      const hasMonth = day.day === 1 && this.showMonthOnFirst;
      return h(VBtn, {
        color,
        fab: true,
        depressed: true,
        small: true,
        ...this.getMouseEventHandlers({
          'click:date': {
            event: 'click',
            stop: true
          },
          'contextmenu:date': {
            event: 'contextmenu',
            stop: true,
            prevent: true,
            result: false
          }
        }, nativeEvent => ({
          nativeEvent,
          ...day
        }))
      }, {
        default: () => hasMonth ? this.monthFormatter(day, this.shortMonths) + ' ' + this.dayFormatter(day, false) : this.dayFormatter(day, false)
      });
    },

    genDayMonth(day) {
      const color = day.present ? this.color : undefined;
      return h('div', this.setTextColor(color, {
        class: 'v-calendar-weekly__day-month'
      }), getSlot(this, 'day-month', day) || this.monthFormatter(day, this.shortMonths));
    }

  },

  render() {
    return h('div', {
      class: [this.staticClass, this.classes],
      onDragstart: e => {
        e.preventDefault();
      }
    }, [!this.hideHeader ? this.genHead() : '', ...this.genWeeks()]);
  }

});
//# sourceMappingURL=VCalendarWeekly.js.map