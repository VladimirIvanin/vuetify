import { h, defineComponent, withDirectives } from 'vue'; // Styles

import "../../../src/components/VCalendar/VCalendarDaily.sass"; // Directives

import Resize from '../../directives/resize'; // Components

import VBtn from '../VBtn'; // Mixins

import CalendarWithIntervals from './mixins/calendar-with-intervals'; // Util

import { convertToUnit, getSlot } from '../../util/helpers';
/* @vue/component */

export default defineComponent({
  name: 'v-calendar-daily',
  extends: CalendarWithIntervals,
  data: () => ({
    scrollPush: 0
  }),
  computed: {
    classes() {
      return {
        'v-calendar-daily': true,
        ...this.themeClasses
      };
    }

  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.$nextTick(this.onResize);
    },

    onResize() {
      this.scrollPush = this.getScrollPush();
    },

    getScrollPush() {
      const area = this.$refs.scrollArea;
      const pane = this.$refs.pane;
      return area && pane ? area.offsetWidth - pane.offsetWidth : 0;
    },

    genHead() {
      return h('div', {
        class: 'v-calendar-daily__head',
        style: {
          marginRight: this.scrollPush + 'px'
        }
      }, [this.genHeadIntervals(), ...this.genHeadDays()]);
    },

    genHeadIntervals() {
      const width = convertToUnit(this.intervalWidth);
      return h('div', {
        class: 'v-calendar-daily__intervals-head',
        style: {
          width
        }
      }, getSlot(this, 'interval-header'));
    },

    genHeadDays() {
      return this.days.map(this.genHeadDay);
    },

    genHeadDay(day, index) {
      return h('div', {
        key: day.date,
        class: ['v-calendar-daily_head-day', this.getRelativeClasses(day)],
        ...this.getDefaultMouseEventHandlers(':day', nativeEvent => {
          return {
            nativeEvent,
            ...this.getSlotScope(day)
          };
        })
      }, [this.genHeadWeekday(day), this.genHeadDayLabel(day), ...this.genDayHeader(day, index)]);
    },

    genDayHeader(day, index) {
      return getSlot(this, 'day-header', {
        week: this.days,
        ...day,
        index
      }) || [];
    },

    genHeadWeekday(day) {
      const color = day.present ? this.color : undefined;
      return h('div', this.setTextColor(color, {
        class: 'v-calendar-daily_head-weekday'
      }), this.weekdayFormatter(day, this.shortWeekdays));
    },

    genHeadDayLabel(day) {
      return h('div', {
        class: 'v-calendar-daily_head-day-label'
      }, getSlot(this, 'day-label-header', day) || [this.genHeadDayButton(day)]);
    },

    genHeadDayButton(day) {
      const color = day.present ? this.color : 'transparent';
      return h(VBtn, {
        color,
        fab: true,
        depressed: true,
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
        }, nativeEvent => {
          return {
            nativeEvent,
            ...day
          };
        })
      }, {
        default: () => this.dayFormatter(day, false)
      });
    },

    genBody() {
      return h('div', {
        class: 'v-calendar-daily__body'
      }, [this.genScrollArea()]);
    },

    genScrollArea() {
      return h('div', {
        ref: 'scrollArea',
        class: 'v-calendar-daily__scroll-area'
      }, [this.genPane()]);
    },

    genPane() {
      return h('div', {
        ref: 'pane',
        class: 'v-calendar-daily__pane',
        style: {
          height: convertToUnit(this.bodyHeight)
        }
      }, [this.genDayContainer()]);
    },

    genDayContainer() {
      return h('div', {
        class: 'v-calendar-daily__day-container'
      }, [this.genBodyIntervals(), ...this.genDays()]);
    },

    genDays() {
      return this.days.map(this.genDay);
    },

    genDay(day, index) {
      return h('div', {
        key: day.date,
        class: ['v-calendar-daily__day', this.getRelativeClasses(day)],
        ...this.getDefaultMouseEventHandlers(':time', nativeEvent => {
          return {
            nativeEvent,
            ...this.getSlotScope(this.getTimestampAtEvent(nativeEvent, day))
          };
        })
      }, [...this.genDayIntervals(index), ...this.genDayBody(day)]);
    },

    genDayBody(day) {
      return getSlot(this, 'day-body', this.getSlotScope(day)) || [];
    },

    genDayIntervals(index) {
      return this.intervals[index].map(this.genDayInterval);
    },

    genDayInterval(interval) {
      const height = convertToUnit(this.intervalHeight);
      const styler = this.intervalStyle || this.intervalStyleDefault;
      const data = {
        key: interval.time,
        class: 'v-calendar-daily__day-interval',
        style: {
          height,
          ...styler(interval)
        }
      };
      const children = getSlot(this, 'interval', this.getSlotScope(interval));
      return h('div', data, children);
    },

    genBodyIntervals() {
      const width = convertToUnit(this.intervalWidth);
      const data = {
        class: 'v-calendar-daily__intervals-body',
        style: {
          width
        },
        ...this.getDefaultMouseEventHandlers(':interval', nativeEvent => {
          return {
            nativeEvent,
            ...this.getTimestampAtEvent(nativeEvent, this.parsedStart)
          };
        })
      };
      return h('div', data, this.genIntervalLabels());
    },

    genIntervalLabels() {
      if (!this.intervals.length) return null;
      return this.intervals[0].map(this.genIntervalLabel);
    },

    genIntervalLabel(interval) {
      const height = convertToUnit(this.intervalHeight);
      const short = this.shortIntervals;
      const shower = this.showIntervalLabel || this.showIntervalLabelDefault;
      const show = shower(interval);
      const label = show ? this.intervalFormatter(interval, short) : undefined;
      return h('div', {
        key: interval.time,
        class: 'v-calendar-daily__interval',
        style: {
          height
        }
      }, [h('div', {
        class: 'v-calendar-daily__interval-text'
      }, label)]);
    }

  },

  render() {
    return withDirectives(h('div', {
      class: this.classes,
      onDragstart: e => {
        e.preventDefault();
      }
    }, [!this.hideHeader ? this.genHead() : '', this.genBody()]), [[Resize, this.onResize, '', {
      quiet: true
    }]]);
  }

});
//# sourceMappingURL=VCalendarDaily.js.map