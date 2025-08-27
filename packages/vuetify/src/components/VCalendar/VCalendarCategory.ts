// Styles
import './VCalendarCategory.sass'

// Types
import { VNode, defineComponent } from 'vue'

// Mixins
import VCalendarDaily from './VCalendarDaily'

// Util
import { convertToUnit, getSlot } from '../../util/helpers'
import { CalendarCategory, CalendarTimestamp } from 'types'
import props from './util/props'
import { getParsedCategories } from './util/parser'

/* @vue/component */
export default defineComponent({
  name: 'v-calendar-category',
  extends: VCalendarDaily,

  props: props.category,

  computed: {
    classes (): object {
      return {
        'v-calendar-daily': true,
        'v-calendar-category': true,
        ...this.themeClasses,
      }
    },
    parsedCategories (): CalendarCategory[] {
      return getParsedCategories(this.categories, this.categoryText)
    },
  },
  methods: {
    genDayHeader (day: CalendarTimestamp, index: number): VNode[] {
      const data = {
        class: 'v-calendar-category__columns',
      }
      const scope = {
        week: this.days, ...day, index,
      }

      const children = this.parsedCategories.map(category => {
        return this.genDayHeaderCategory(day, this.getCategoryScope(scope, category))
      })

      return [h('div', data, children)]
    },
    getCategoryScope (scope: any, category: CalendarCategory) {
      const cat = typeof category === 'object' && category &&
          category.categoryName === this.categoryForInvalid ? null : category
      return {
        ...scope,
        category: cat,
      }
    },
    genDayHeaderCategory (day: CalendarTimestamp, scope: any): VNode {
      const headerTitle = typeof scope.category === 'object' ? scope.category.categoryName : scope.category
      return h('div', {
        class: 'v-calendar-category__column-header',
        on: this.getDefaultMouseEventHandlers(':day-category', e => {
          return this.getCategoryScope(this.getSlotScope(day), scope.category)
        }),
      }, [
        getSlot(this, 'category', scope) || this.genDayHeaderCategoryTitle(headerTitle),
        getSlot(this, 'day-header', scope),
      ])
    },
    genDayHeaderCategoryTitle (categoryName: string | null) {
      return h('div', {
        class: 'v-calendar-category__category',
      }, categoryName === null ? this.categoryForInvalid : categoryName)
    },
    genDays (): VNode[] {
      const days: VNode[] = []
      this.days.forEach((d, j) => {
        const day = new Array(this.parsedCategories.length || 1)
        day.fill(d)
        days.push(...day.map((v, i) => this.genDay(v, j, i)))
      })
      return days
    },
    genDay (day: CalendarTimestamp): VNode {
      return h('div', {
        key: day.date,
        class: {
          'v-calendar-daily__day': true,
          ...this.getRelativeClasses(day),
        },
        on: this.getDefaultMouseEventHandlers(':day', nativeEvent => {
          return { nativeEvent, ...this.getSlotScope(day) }
        }),
      }, [
        this.genDayLabel(day),
        ...this.genDayBody(day),
      ])
    },
    genDayIntervals (index: number, category: CalendarCategory): VNode[] {
      return this.intervals[index].map(v => this.genDayInterval(v, category))
    },
    genDayInterval (interval: CalendarTimestamp, category: CalendarCategory): VNode {
      const height: string | undefined = convertToUnit(this.intervalHeight)
      const styler = this.intervalStyle || this.intervalStyleDefault

      const data = {
        key: interval.time,
        class: 'v-calendar-daily__day-interval',
        style: {
          height,
          ...styler({ ...interval, category }),
        },
      }

      const children = getSlot(this, 'interval', () =>
        this.getCategoryScope(this.getSlotScope(interval), category)
      )

      return h('div', data, children)
    },
    genDayBody (day: CalendarTimestamp, category: CalendarCategory): VNode[] {
      const data = {
        class: 'v-calendar-category__columns',
      }

      const children = [this.genDayBodyCategory(day, category)]

      return [h('div', data, children)]
    },
    genDayBodyCategory (day: CalendarTimestamp, category: CalendarCategory): VNode {
      const data = {
        class: 'v-calendar-category__column',
        on: this.getDefaultMouseEventHandlers(':time-category', e => {
          return this.getCategoryScope(this.getSlotScope(this.getTimestampAtEvent(e, day)), category)
        }),
      }

      const children = getSlot(this, 'day-body', () => this.getCategoryScope(this.getSlotScope(day), category))

      return h('div', data, children)
    },
  },
})
