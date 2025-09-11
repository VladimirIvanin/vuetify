import { h, defineComponent, withDirectives } from 'vue';
// Styles
// import '../../stylus/components/_calendar-daily.styl'
// Directives
import Resize from '../../directives/resize';
// Mixins
import CalendarWithEvents from './mixins/calendar-with-events';
// Util
import props from './util/props';
import { DAYS_IN_MONTH_MAX, DAY_MIN, DAYS_IN_WEEK, parseTimestamp, validateTimestamp, relativeDays, nextDay, prevDay, copyTimestamp, updateFormatted, updateWeekday, updateRelative, getStartOfMonth, getEndOfMonth, timestampToDate, } from './util/timestamp';
// Calendars
import VCalendarMonthly from './VCalendarMonthly';
import VCalendarDaily from './VCalendarDaily';
import VCalendarWeekly from './VCalendarWeekly';
import VCalendarCategory from './VCalendarCategory';
import { getParsedCategories } from './util/parser';
/* @vue/component */
export default defineComponent({
    name: 'v-calendar',
    extends: CalendarWithEvents,
    props: {
        ...props.calendar,
        ...props.weeks,
        ...props.intervals,
        ...props.category,
    },
    emits: ['change', 'update:modelValue', 'moved', 'click:date'],
    data: () => ({
        lastStart: null,
        lastEnd: null,
    }),
    computed: {
        parsedValue() {
            return (validateTimestamp(this.value)
                ? parseTimestamp(this.value, true)
                : (this.parsedStart || this.times.today));
        },
        parsedCategoryDays() {
            return parseInt(this.categoryDays) || 1;
        },
        renderProps() {
            const around = this.parsedValue;
            let component = null;
            let maxDays = this.maxDays;
            let weekdays = this.parsedWeekdays;
            let categories = this.parsedCategories;
            let start = around;
            let end = around;
            switch (this.type) {
                case 'month':
                    component = VCalendarMonthly;
                    start = getStartOfMonth(around);
                    end = getEndOfMonth(around);
                    break;
                case 'week':
                    component = VCalendarDaily;
                    start = this.getStartOfWeek(around);
                    end = this.getEndOfWeek(around);
                    maxDays = 7;
                    break;
                case 'day':
                    component = VCalendarDaily;
                    maxDays = 1;
                    weekdays = [start.weekday];
                    break;
                case '4day':
                    component = VCalendarDaily;
                    end = relativeDays(copyTimestamp(end), nextDay, 3);
                    updateFormatted(end);
                    maxDays = 4;
                    weekdays = [
                        start.weekday,
                        (start.weekday + 1) % 7,
                        (start.weekday + 2) % 7,
                        (start.weekday + 3) % 7,
                    ];
                    break;
                case 'custom-weekly':
                    component = VCalendarWeekly;
                    start = this.parsedStart || around;
                    end = this.parsedEnd;
                    break;
                case 'custom-daily':
                    component = VCalendarDaily;
                    start = this.parsedStart || around;
                    end = this.parsedEnd;
                    break;
                case 'category':
                    const days = this.parsedCategoryDays;
                    component = VCalendarCategory;
                    end = relativeDays(copyTimestamp(end), nextDay, days);
                    updateFormatted(end);
                    maxDays = days;
                    weekdays = [];
                    for (let i = 0; i < days; i++) {
                        weekdays.push((start.weekday + i) % 7);
                    }
                    categories = this.getCategoryList(categories);
                    break;
                default:
                    throw new Error(this.type + ' is not a valid Calendar type');
            }
            return { component, start, end, maxDays, weekdays, categories };
        },
        eventWeekdays() {
            return this.renderProps.weekdays;
        },
        categoryMode() {
            return this.type === 'category';
        },
        title() {
            const { start, end } = this.renderProps;
            const spanYears = start.year !== end.year;
            const spanMonths = spanYears || start.month !== end.month;
            if (spanYears) {
                return this.monthShortFormatter(start, true) + ' ' + start.year + ' - ' + this.monthShortFormatter(end, true) + ' ' + end.year;
            }
            if (spanMonths) {
                return this.monthShortFormatter(start, true) + ' - ' + this.monthShortFormatter(end, true) + ' ' + end.year;
            }
            else {
                return this.monthLongFormatter(start, false) + ' ' + start.year;
            }
        },
        monthLongFormatter() {
            return this.getFormatter({
                timeZone: 'UTC', month: 'long',
            });
        },
        monthShortFormatter() {
            return this.getFormatter({
                timeZone: 'UTC', month: 'short',
            });
        },
        parsedCategories() {
            return getParsedCategories(this.categories, this.categoryText);
        },
    },
    watch: {
        renderProps: 'checkChange',
    },
    mounted() {
        this.updateEventVisibility();
        this.checkChange();
    },
    updated() {
        window.requestAnimationFrame(this.updateEventVisibility);
    },
    methods: {
        checkChange() {
            const { lastStart, lastEnd } = this;
            const { start, end } = this.renderProps;
            if (!lastStart || !lastEnd ||
                start.date !== lastStart.date ||
                end.date !== lastEnd.date) {
                this.lastStart = start;
                this.lastEnd = end;
                this.$emit('change', { start, end });
            }
        },
        move(amount = 1) {
            const moved = copyTimestamp(this.parsedValue);
            const forward = amount > 0;
            const mover = forward ? nextDay : prevDay;
            const limit = forward ? DAYS_IN_MONTH_MAX : DAY_MIN;
            let times = forward ? amount : -amount;
            while (--times >= 0) {
                switch (this.type) {
                    case 'month':
                        moved.day = limit;
                        mover(moved);
                        break;
                    case 'week':
                        relativeDays(moved, mover, DAYS_IN_WEEK);
                        break;
                    case 'day':
                        relativeDays(moved, mover, 1);
                        break;
                    case '4day':
                        relativeDays(moved, mover, 4);
                        break;
                    case 'category':
                        relativeDays(moved, mover, this.parsedCategoryDays);
                        break;
                }
            }
            updateWeekday(moved);
            updateFormatted(moved);
            updateRelative(moved, this.times.now);
            if (this.value instanceof Date) {
                this.$emit('update:modelValue', timestampToDate(moved));
            }
            else if (typeof this.value === 'number') {
                this.$emit('update:modelValue', timestampToDate(moved).getTime());
            }
            else {
                this.$emit('update:modelValue', moved.date);
            }
            this.$emit('moved', moved);
        },
        next(amount = 1) {
            this.move(amount);
        },
        prev(amount = 1) {
            this.move(-amount);
        },
        timeToY(time, clamp = true) {
            const c = this.$refs.calendarChild;
            if (c && c.timeToY) {
                return c.timeToY(time, clamp);
            }
            else {
                return false;
            }
        },
        timeDelta(time) {
            const c = this.$refs.calendarChild;
            if (c && c.timeDelta) {
                return c.timeDelta(time);
            }
            else {
                return false;
            }
        },
        minutesToPixels(minutes) {
            const c = this.$refs.calendarChild;
            if (c && c.minutesToPixels) {
                return c.minutesToPixels(minutes);
            }
            else {
                return -1;
            }
        },
        scrollToTime(time) {
            const c = this.$refs.calendarChild;
            if (c && c.scrollToTime) {
                return c.scrollToTime(time);
            }
            else {
                return false;
            }
        },
        parseTimestamp(input, required) {
            return parseTimestamp(input, required, this.times.now);
        },
        timestampToDate(timestamp) {
            return timestampToDate(timestamp);
        },
        getCategoryList(categories) {
            if (!this.noEvents) {
                const categoryMap = categories.reduce((map, category, index) => {
                    if (typeof category === 'object' && category.categoryName)
                        map[category.categoryName] = { index, count: 0 };
                    else if (typeof category === 'string')
                        map[category] = { index, count: 0 };
                    return map;
                }, {});
                if (!this.categoryHideDynamic || !this.categoryShowAll) {
                    let categoryLength = categories.length;
                    this.parsedEvents.forEach(ev => {
                        let category = ev.category;
                        if (typeof category !== 'string') {
                            category = this.categoryForInvalid;
                        }
                        if (!category) {
                            return;
                        }
                        if (category in categoryMap) {
                            categoryMap[category].count++;
                        }
                        else if (!this.categoryHideDynamic) {
                            categoryMap[category] = {
                                index: categoryLength++,
                                count: 1,
                            };
                        }
                    });
                }
                if (!this.categoryShowAll) {
                    for (const category in categoryMap) {
                        if (categoryMap[category].count === 0) {
                            delete categoryMap[category];
                        }
                    }
                }
                categories = categories.filter((category) => {
                    if (typeof category === 'object' && category.categoryName) {
                        return categoryMap.hasOwnProperty(category.categoryName);
                    }
                    else if (typeof category === 'string') {
                        return categoryMap.hasOwnProperty(category);
                    }
                    return false;
                });
            }
            return categories;
        },
    },
    render() {
        const { start, end, maxDays, component, weekdays, categories } = this.renderProps;
        // Only pass categories prop to VCalendarCategory component
        const props = {
            ref: 'calendarChild',
            class: ['v-calendar', {
                    'v-calendar-events': !this.noEvents,
                }],
            start: start.date,
            end: end.date,
            maxDays,
            weekdays,
            role: 'grid',
            'onClick:date': (day, e) => {
                this.$emit('update:modelValue', day.date);
                this.$emit('click:date', day, e);
            },
        };
        // Only add categories prop for VCalendarCategory component
        if (component.name === 'v-calendar-category') {
            props.categories = categories;
        }
        return withDirectives(h(component, props, this.getScopedSlots()), [
            [Resize, this.updateEventVisibility, '', { quiet: true }],
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNhbGVuZGFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkNhbGVuZGFyL1ZDYWxlbmRhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsQ0FBQyxFQUFFLGVBQWUsRUFBb0IsY0FBYyxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBQzFFLFNBQVM7QUFDVCx3REFBd0Q7QUFFeEQsYUFBYTtBQUNiLE9BQU8sTUFBTSxNQUFNLHlCQUF5QixDQUFBO0FBRTVDLFNBQVM7QUFDVCxPQUFPLGtCQUFrQixNQUFNLCtCQUErQixDQUFBO0FBRTlELE9BQU87QUFDUCxPQUFPLEtBQUssTUFBTSxjQUFjLENBQUE7QUFDaEMsT0FBTyxFQUNMLGlCQUFpQixFQUNqQixPQUFPLEVBQ1AsWUFBWSxFQUNaLGNBQWMsRUFDZCxpQkFBaUIsRUFDakIsWUFBWSxFQUNaLE9BQU8sRUFDUCxPQUFPLEVBQ1AsYUFBYSxFQUNiLGVBQWUsRUFDZixhQUFhLEVBQ2IsY0FBYyxFQUNkLGVBQWUsRUFDZixhQUFhLEVBR2IsZUFBZSxHQUNoQixNQUFNLGtCQUFrQixDQUFBO0FBRXpCLFlBQVk7QUFDWixPQUFPLGdCQUFnQixNQUFNLG9CQUFvQixDQUFBO0FBQ2pELE9BQU8sY0FBYyxNQUFNLGtCQUFrQixDQUFBO0FBQzdDLE9BQU8sZUFBZSxNQUFNLG1CQUFtQixDQUFBO0FBQy9DLE9BQU8saUJBQWlCLE1BQU0scUJBQXFCLENBQUE7QUFFbkQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZUFBZSxDQUFBO0FBWW5ELG9CQUFvQjtBQUNwQixlQUFlLGVBQWUsQ0FBQztJQUM3QixJQUFJLEVBQUUsWUFBWTtJQUdsQixPQUFPLEVBQUUsa0JBQWtCO0lBRTNCLEtBQUssRUFBRTtRQUNMLEdBQUcsS0FBSyxDQUFDLFFBQVE7UUFDakIsR0FBRyxLQUFLLENBQUMsS0FBSztRQUNkLEdBQUcsS0FBSyxDQUFDLFNBQVM7UUFD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QUFFO1lBQzVDLEtBQUssQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO1NBQzlCO1FBRUQsT0FBTyxjQUFjLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQUU7WUFDaEUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQztTQUMxRCxDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCwgZGVmaW5lQ29tcG9uZW50LCBWTm9kZSwgQ29tcG9uZW50LCB3aXRoRGlyZWN0aXZlcyB9IGZyb20gJ3Z1ZSdcbi8vIFN0eWxlc1xuLy8gaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fY2FsZW5kYXItZGFpbHkuc3R5bCdcblxuLy8gRGlyZWN0aXZlc1xuaW1wb3J0IFJlc2l6ZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3Jlc2l6ZSdcblxuLy8gTWl4aW5zXG5pbXBvcnQgQ2FsZW5kYXJXaXRoRXZlbnRzIGZyb20gJy4vbWl4aW5zL2NhbGVuZGFyLXdpdGgtZXZlbnRzJ1xuXG4vLyBVdGlsXG5pbXBvcnQgcHJvcHMgZnJvbSAnLi91dGlsL3Byb3BzJ1xuaW1wb3J0IHtcbiAgREFZU19JTl9NT05USF9NQVgsXG4gIERBWV9NSU4sXG4gIERBWVNfSU5fV0VFSyxcbiAgcGFyc2VUaW1lc3RhbXAsXG4gIHZhbGlkYXRlVGltZXN0YW1wLFxuICByZWxhdGl2ZURheXMsXG4gIG5leHREYXksXG4gIHByZXZEYXksXG4gIGNvcHlUaW1lc3RhbXAsXG4gIHVwZGF0ZUZvcm1hdHRlZCxcbiAgdXBkYXRlV2Vla2RheSxcbiAgdXBkYXRlUmVsYXRpdmUsXG4gIGdldFN0YXJ0T2ZNb250aCxcbiAgZ2V0RW5kT2ZNb250aCxcbiAgVlRpbWUsXG4gIFZUaW1lc3RhbXBJbnB1dCxcbiAgdGltZXN0YW1wVG9EYXRlLFxufSBmcm9tICcuL3V0aWwvdGltZXN0YW1wJ1xuXG4vLyBDYWxlbmRhcnNcbmltcG9ydCBWQ2FsZW5kYXJNb250aGx5IGZyb20gJy4vVkNhbGVuZGFyTW9udGhseSdcbmltcG9ydCBWQ2FsZW5kYXJEYWlseSBmcm9tICcuL1ZDYWxlbmRhckRhaWx5J1xuaW1wb3J0IFZDYWxlbmRhcldlZWtseSBmcm9tICcuL1ZDYWxlbmRhcldlZWtseSdcbmltcG9ydCBWQ2FsZW5kYXJDYXRlZ29yeSBmcm9tICcuL1ZDYWxlbmRhckNhdGVnb3J5J1xuaW1wb3J0IHsgQ2FsZW5kYXJUaW1lc3RhbXAsIENhbGVuZGFyRm9ybWF0dGVyLCBDYWxlbmRhckNhdGVnb3J5IH0gZnJvbSAndnVldGlmeS90eXBlcydcbmltcG9ydCB7IGdldFBhcnNlZENhdGVnb3JpZXMgfSBmcm9tICcuL3V0aWwvcGFyc2VyJ1xuXG4vLyBUeXBlc1xuaW50ZXJmYWNlIFZDYWxlbmRhclJlbmRlclByb3BzIHtcbiAgc3RhcnQ6IENhbGVuZGFyVGltZXN0YW1wXG4gIGVuZDogQ2FsZW5kYXJUaW1lc3RhbXBcbiAgY29tcG9uZW50OiBzdHJpbmcgfCBDb21wb25lbnRcbiAgbWF4RGF5czogbnVtYmVyXG4gIHdlZWtkYXlzOiBudW1iZXJbXVxuICBjYXRlZ29yaWVzOiBDYWxlbmRhckNhdGVnb3J5W11cbn1cblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XG4gIG5hbWU6ICd2LWNhbGVuZGFyJyxcblxuXG4gIGV4dGVuZHM6IENhbGVuZGFyV2l0aEV2ZW50cyxcblxuICBwcm9wczoge1xuICAgIC4uLnByb3BzLmNhbGVuZGFyLFxuICAgIC4uLnByb3BzLndlZWtzLFxuICAgIC4uLnByb3BzLmludGVydmFscyxcbiAgICAuLi5wcm9wcy5jYXRlZ29yeSxcbiAgfSxcblxuICBlbWl0czogWydjaGFuZ2UnLCAndXBkYXRlOm1vZGVsVmFsdWUnLCAnbW92ZWQnLCAnY2xpY2s6ZGF0ZSddLFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgbGFzdFN0YXJ0OiBudWxsIGFzIENhbGVuZGFyVGltZXN0YW1wIHwgbnVsbCxcbiAgICBsYXN0RW5kOiBudWxsIGFzIENhbGVuZGFyVGltZXN0YW1wIHwgbnVsbCxcbiAgfSksXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBwYXJzZWRWYWx1ZSAoKTogQ2FsZW5kYXJUaW1lc3RhbXAge1xuICAgICAgcmV0dXJuICh2YWxpZGF0ZVRpbWVzdGFtcCh0aGlzLnZhbHVlKVxuICAgICAgICA/IHBhcnNlVGltZXN0YW1wKHRoaXMudmFsdWUsIHRydWUpXG4gICAgICAgIDogKHRoaXMucGFyc2VkU3RhcnQgfHwgdGhpcy50aW1lcy50b2RheSkpXG4gICAgfSxcbiAgICBwYXJzZWRDYXRlZ29yeURheXMgKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5jYXRlZ29yeURheXMpIHx8IDFcbiAgICB9LFxuICAgIHJlbmRlclByb3BzICgpOiBWQ2FsZW5kYXJSZW5kZXJQcm9wcyB7XG4gICAgICBjb25zdCBhcm91bmQgPSB0aGlzLnBhcnNlZFZhbHVlXG4gICAgICBsZXQgY29tcG9uZW50OiBhbnkgPSBudWxsXG4gICAgICBsZXQgbWF4RGF5cyA9IHRoaXMubWF4RGF5c1xuICAgICAgbGV0IHdlZWtkYXlzID0gdGhpcy5wYXJzZWRXZWVrZGF5c1xuICAgICAgbGV0IGNhdGVnb3JpZXMgPSB0aGlzLnBhcnNlZENhdGVnb3JpZXNcbiAgICAgIGxldCBzdGFydCA9IGFyb3VuZFxuICAgICAgbGV0IGVuZCA9IGFyb3VuZFxuICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnbW9udGgnOlxuICAgICAgICAgIGNvbXBvbmVudCA9IFZDYWxlbmRhck1vbnRobHlcbiAgICAgICAgICBzdGFydCA9IGdldFN0YXJ0T2ZNb250aChhcm91bmQpXG4gICAgICAgICAgZW5kID0gZ2V0RW5kT2ZNb250aChhcm91bmQpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnd2Vlayc6XG4gICAgICAgICAgY29tcG9uZW50ID0gVkNhbGVuZGFyRGFpbHlcbiAgICAgICAgICBzdGFydCA9IHRoaXMuZ2V0U3RhcnRPZldlZWsoYXJvdW5kKVxuICAgICAgICAgIGVuZCA9IHRoaXMuZ2V0RW5kT2ZXZWVrKGFyb3VuZClcbiAgICAgICAgICBtYXhEYXlzID0gN1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2RheSc6XG4gICAgICAgICAgY29tcG9uZW50ID0gVkNhbGVuZGFyRGFpbHlcbiAgICAgICAgICBtYXhEYXlzID0gMVxuICAgICAgICAgIHdlZWtkYXlzID0gW3N0YXJ0LndlZWtkYXldXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnNGRheSc6XG4gICAgICAgICAgY29tcG9uZW50ID0gVkNhbGVuZGFyRGFpbHlcbiAgICAgICAgICBlbmQgPSByZWxhdGl2ZURheXMoY29weVRpbWVzdGFtcChlbmQpLCBuZXh0RGF5LCAzKVxuICAgICAgICAgIHVwZGF0ZUZvcm1hdHRlZChlbmQpXG4gICAgICAgICAgbWF4RGF5cyA9IDRcbiAgICAgICAgICB3ZWVrZGF5cyA9IFtcbiAgICAgICAgICAgIHN0YXJ0LndlZWtkYXksXG4gICAgICAgICAgICAoc3RhcnQud2Vla2RheSArIDEpICUgNyxcbiAgICAgICAgICAgIChzdGFydC53ZWVrZGF5ICsgMikgJSA3LFxuICAgICAgICAgICAgKHN0YXJ0LndlZWtkYXkgKyAzKSAlIDcsXG4gICAgICAgICAgXVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2N1c3RvbS13ZWVrbHknOlxuICAgICAgICAgIGNvbXBvbmVudCA9IFZDYWxlbmRhcldlZWtseVxuICAgICAgICAgIHN0YXJ0ID0gdGhpcy5wYXJzZWRTdGFydCB8fCBhcm91bmRcbiAgICAgICAgICBlbmQgPSB0aGlzLnBhcnNlZEVuZFxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2N1c3RvbS1kYWlseSc6XG4gICAgICAgICAgY29tcG9uZW50ID0gVkNhbGVuZGFyRGFpbHlcbiAgICAgICAgICBzdGFydCA9IHRoaXMucGFyc2VkU3RhcnQgfHwgYXJvdW5kXG4gICAgICAgICAgZW5kID0gdGhpcy5wYXJzZWRFbmRcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdjYXRlZ29yeSc6XG4gICAgICAgICAgY29uc3QgZGF5cyA9IHRoaXMucGFyc2VkQ2F0ZWdvcnlEYXlzXG5cbiAgICAgICAgICBjb21wb25lbnQgPSBWQ2FsZW5kYXJDYXRlZ29yeVxuICAgICAgICAgIGVuZCA9IHJlbGF0aXZlRGF5cyhjb3B5VGltZXN0YW1wKGVuZCksIG5leHREYXksIGRheXMpXG4gICAgICAgICAgdXBkYXRlRm9ybWF0dGVkKGVuZClcbiAgICAgICAgICBtYXhEYXlzID0gZGF5c1xuICAgICAgICAgIHdlZWtkYXlzID0gW11cblxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF5czsgaSsrKSB7XG4gICAgICAgICAgICB3ZWVrZGF5cy5wdXNoKChzdGFydC53ZWVrZGF5ICsgaSkgJSA3KVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNhdGVnb3JpZXMgPSB0aGlzLmdldENhdGVnb3J5TGlzdChjYXRlZ29yaWVzKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHRoaXMudHlwZSArICcgaXMgbm90IGEgdmFsaWQgQ2FsZW5kYXIgdHlwZScpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7IGNvbXBvbmVudCwgc3RhcnQsIGVuZCwgbWF4RGF5cywgd2Vla2RheXMsIGNhdGVnb3JpZXMgfVxuICAgIH0sXG4gICAgZXZlbnRXZWVrZGF5cyAoKTogbnVtYmVyW10ge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyUHJvcHMud2Vla2RheXNcbiAgICB9LFxuICAgIGNhdGVnb3J5TW9kZSAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy50eXBlID09PSAnY2F0ZWdvcnknXG4gICAgfSxcbiAgICB0aXRsZSAoKTogc3RyaW5nIHtcbiAgICAgIGNvbnN0IHsgc3RhcnQsIGVuZCB9ID0gdGhpcy5yZW5kZXJQcm9wc1xuICAgICAgY29uc3Qgc3BhblllYXJzID0gc3RhcnQueWVhciAhPT0gZW5kLnllYXJcbiAgICAgIGNvbnN0IHNwYW5Nb250aHMgPSBzcGFuWWVhcnMgfHwgc3RhcnQubW9udGggIT09IGVuZC5tb250aFxuXG4gICAgICBpZiAoc3BhblllYXJzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vbnRoU2hvcnRGb3JtYXR0ZXIoc3RhcnQsIHRydWUpICsgJyAnICsgc3RhcnQueWVhciArICcgLSAnICsgdGhpcy5tb250aFNob3J0Rm9ybWF0dGVyKGVuZCwgdHJ1ZSkgKyAnICcgKyBlbmQueWVhclxuICAgICAgfVxuXG4gICAgICBpZiAoc3Bhbk1vbnRocykge1xuICAgICAgICByZXR1cm4gdGhpcy5tb250aFNob3J0Rm9ybWF0dGVyKHN0YXJ0LCB0cnVlKSArICcgLSAnICsgdGhpcy5tb250aFNob3J0Rm9ybWF0dGVyKGVuZCwgdHJ1ZSkgKyAnICcgKyBlbmQueWVhclxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9udGhMb25nRm9ybWF0dGVyKHN0YXJ0LCBmYWxzZSkgKyAnICcgKyBzdGFydC55ZWFyXG4gICAgICB9XG4gICAgfSxcbiAgICBtb250aExvbmdGb3JtYXR0ZXIgKCk6IENhbGVuZGFyRm9ybWF0dGVyIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEZvcm1hdHRlcih7XG4gICAgICAgIHRpbWVab25lOiAnVVRDJywgbW9udGg6ICdsb25nJyxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBtb250aFNob3J0Rm9ybWF0dGVyICgpOiBDYWxlbmRhckZvcm1hdHRlciB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRGb3JtYXR0ZXIoe1xuICAgICAgICB0aW1lWm9uZTogJ1VUQycsIG1vbnRoOiAnc2hvcnQnLFxuICAgICAgfSlcbiAgICB9LFxuICAgIHBhcnNlZENhdGVnb3JpZXMgKCk6IENhbGVuZGFyQ2F0ZWdvcnlbXSB7XG4gICAgICByZXR1cm4gZ2V0UGFyc2VkQ2F0ZWdvcmllcyh0aGlzLmNhdGVnb3JpZXMsIHRoaXMuY2F0ZWdvcnlUZXh0KVxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICByZW5kZXJQcm9wczogJ2NoZWNrQ2hhbmdlJyxcbiAgfSxcblxuICBtb3VudGVkICgpIHtcbiAgICB0aGlzLnVwZGF0ZUV2ZW50VmlzaWJpbGl0eSgpXG4gICAgdGhpcy5jaGVja0NoYW5nZSgpXG4gIH0sXG5cbiAgdXBkYXRlZCAoKSB7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnVwZGF0ZUV2ZW50VmlzaWJpbGl0eSlcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgY2hlY2tDaGFuZ2UgKCk6IHZvaWQge1xuICAgICAgY29uc3QgeyBsYXN0U3RhcnQsIGxhc3RFbmQgfSA9IHRoaXNcbiAgICAgIGNvbnN0IHsgc3RhcnQsIGVuZCB9ID0gdGhpcy5yZW5kZXJQcm9wc1xuICAgICAgaWYgKCFsYXN0U3RhcnQgfHwgIWxhc3RFbmQgfHxcbiAgICAgICAgc3RhcnQuZGF0ZSAhPT0gbGFzdFN0YXJ0LmRhdGUgfHxcbiAgICAgICAgZW5kLmRhdGUgIT09IGxhc3RFbmQuZGF0ZSkge1xuICAgICAgICB0aGlzLmxhc3RTdGFydCA9IHN0YXJ0XG4gICAgICAgIHRoaXMubGFzdEVuZCA9IGVuZFxuICAgICAgICB0aGlzLiRlbWl0KCdjaGFuZ2UnLCB7IHN0YXJ0LCBlbmQgfSlcbiAgICAgIH1cbiAgICB9LFxuICAgIG1vdmUgKGFtb3VudCA9IDEpOiB2b2lkIHtcbiAgICAgIGNvbnN0IG1vdmVkID0gY29weVRpbWVzdGFtcCh0aGlzLnBhcnNlZFZhbHVlKVxuICAgICAgY29uc3QgZm9yd2FyZCA9IGFtb3VudCA+IDBcbiAgICAgIGNvbnN0IG1vdmVyID0gZm9yd2FyZCA/IG5leHREYXkgOiBwcmV2RGF5XG4gICAgICBjb25zdCBsaW1pdCA9IGZvcndhcmQgPyBEQVlTX0lOX01PTlRIX01BWCA6IERBWV9NSU5cbiAgICAgIGxldCB0aW1lcyA9IGZvcndhcmQgPyBhbW91bnQgOiAtYW1vdW50XG5cbiAgICAgIHdoaWxlICgtLXRpbWVzID49IDApIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgICBjYXNlICdtb250aCc6XG4gICAgICAgICAgICBtb3ZlZC5kYXkgPSBsaW1pdFxuICAgICAgICAgICAgbW92ZXIobW92ZWQpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgJ3dlZWsnOlxuICAgICAgICAgICAgcmVsYXRpdmVEYXlzKG1vdmVkLCBtb3ZlciwgREFZU19JTl9XRUVLKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlICdkYXknOlxuICAgICAgICAgICAgcmVsYXRpdmVEYXlzKG1vdmVkLCBtb3ZlciwgMSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSAnNGRheSc6XG4gICAgICAgICAgICByZWxhdGl2ZURheXMobW92ZWQsIG1vdmVyLCA0KVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlICdjYXRlZ29yeSc6XG4gICAgICAgICAgICByZWxhdGl2ZURheXMobW92ZWQsIG1vdmVyLCB0aGlzLnBhcnNlZENhdGVnb3J5RGF5cylcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdXBkYXRlV2Vla2RheShtb3ZlZClcbiAgICAgIHVwZGF0ZUZvcm1hdHRlZChtb3ZlZClcbiAgICAgIHVwZGF0ZVJlbGF0aXZlKG1vdmVkLCB0aGlzLnRpbWVzLm5vdylcblxuICAgICAgaWYgKHRoaXMudmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTptb2RlbFZhbHVlJywgdGltZXN0YW1wVG9EYXRlKG1vdmVkKSlcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMudmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTptb2RlbFZhbHVlJywgdGltZXN0YW1wVG9EYXRlKG1vdmVkKS5nZXRUaW1lKCkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLiRlbWl0KCd1cGRhdGU6bW9kZWxWYWx1ZScsIG1vdmVkLmRhdGUpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuJGVtaXQoJ21vdmVkJywgbW92ZWQpXG4gICAgfSxcbiAgICBuZXh0IChhbW91bnQgPSAxKTogdm9pZCB7XG4gICAgICB0aGlzLm1vdmUoYW1vdW50KVxuICAgIH0sXG4gICAgcHJldiAoYW1vdW50ID0gMSk6IHZvaWQge1xuICAgICAgdGhpcy5tb3ZlKC1hbW91bnQpXG4gICAgfSxcbiAgICB0aW1lVG9ZICh0aW1lOiBWVGltZSwgY2xhbXAgPSB0cnVlKTogbnVtYmVyIHwgZmFsc2Uge1xuICAgICAgY29uc3QgYyA9IHRoaXMuJHJlZnMuY2FsZW5kYXJDaGlsZCBhcyBhbnlcblxuICAgICAgaWYgKGMgJiYgYy50aW1lVG9ZKSB7XG4gICAgICAgIHJldHVybiBjLnRpbWVUb1kodGltZSwgY2xhbXApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICAgIHRpbWVEZWx0YSAodGltZTogVlRpbWUpOiBudW1iZXIgfCBmYWxzZSB7XG4gICAgICBjb25zdCBjID0gdGhpcy4kcmVmcy5jYWxlbmRhckNoaWxkIGFzIGFueVxuXG4gICAgICBpZiAoYyAmJiBjLnRpbWVEZWx0YSkge1xuICAgICAgICByZXR1cm4gYy50aW1lRGVsdGEodGltZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gICAgbWludXRlc1RvUGl4ZWxzIChtaW51dGVzOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgY29uc3QgYyA9IHRoaXMuJHJlZnMuY2FsZW5kYXJDaGlsZCBhcyBhbnlcblxuICAgICAgaWYgKGMgJiYgYy5taW51dGVzVG9QaXhlbHMpIHtcbiAgICAgICAgcmV0dXJuIGMubWludXRlc1RvUGl4ZWxzKG1pbnV0ZXMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gLTFcbiAgICAgIH1cbiAgICB9LFxuICAgIHNjcm9sbFRvVGltZSAodGltZTogVlRpbWUpOiBib29sZWFuIHtcbiAgICAgIGNvbnN0IGMgPSB0aGlzLiRyZWZzLmNhbGVuZGFyQ2hpbGQgYXMgYW55XG5cbiAgICAgIGlmIChjICYmIGMuc2Nyb2xsVG9UaW1lKSB7XG4gICAgICAgIHJldHVybiBjLnNjcm9sbFRvVGltZSh0aW1lKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICBwYXJzZVRpbWVzdGFtcCAoaW5wdXQ6IFZUaW1lc3RhbXBJbnB1dCwgcmVxdWlyZWQ/OiBmYWxzZSk6IENhbGVuZGFyVGltZXN0YW1wIHwgbnVsbCB7XG4gICAgICByZXR1cm4gcGFyc2VUaW1lc3RhbXAoaW5wdXQsIHJlcXVpcmVkLCB0aGlzLnRpbWVzLm5vdylcbiAgICB9LFxuICAgIHRpbWVzdGFtcFRvRGF0ZSAodGltZXN0YW1wOiBDYWxlbmRhclRpbWVzdGFtcCk6IERhdGUge1xuICAgICAgcmV0dXJuIHRpbWVzdGFtcFRvRGF0ZSh0aW1lc3RhbXApXG4gICAgfSxcbiAgICBnZXRDYXRlZ29yeUxpc3QgKGNhdGVnb3JpZXM6IENhbGVuZGFyQ2F0ZWdvcnlbXSk6IENhbGVuZGFyQ2F0ZWdvcnlbXSB7XG4gICAgICBpZiAoIXRoaXMubm9FdmVudHMpIHtcbiAgICAgICAgY29uc3QgY2F0ZWdvcnlNYXA6IGFueSA9IGNhdGVnb3JpZXMucmVkdWNlKChtYXA6IGFueSwgY2F0ZWdvcnksIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjYXRlZ29yeSA9PT0gJ29iamVjdCcgJiYgY2F0ZWdvcnkuY2F0ZWdvcnlOYW1lKSBtYXBbY2F0ZWdvcnkuY2F0ZWdvcnlOYW1lXSA9IHsgaW5kZXgsIGNvdW50OiAwIH1cbiAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgY2F0ZWdvcnkgPT09ICdzdHJpbmcnKSBtYXBbY2F0ZWdvcnldID0geyBpbmRleCwgY291bnQ6IDAgfVxuICAgICAgICAgIHJldHVybiBtYXBcbiAgICAgICAgfSwge30pXG5cbiAgICAgICAgaWYgKCF0aGlzLmNhdGVnb3J5SGlkZUR5bmFtaWMgfHwgIXRoaXMuY2F0ZWdvcnlTaG93QWxsKSB7XG4gICAgICAgICAgbGV0IGNhdGVnb3J5TGVuZ3RoID0gY2F0ZWdvcmllcy5sZW5ndGhcblxuICAgICAgICAgIHRoaXMucGFyc2VkRXZlbnRzLmZvckVhY2goZXYgPT4ge1xuICAgICAgICAgICAgbGV0IGNhdGVnb3J5ID0gZXYuY2F0ZWdvcnlcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYXRlZ29yeSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgY2F0ZWdvcnkgPSB0aGlzLmNhdGVnb3J5Rm9ySW52YWxpZFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWNhdGVnb3J5KSB7XG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnkgaW4gY2F0ZWdvcnlNYXApIHtcbiAgICAgICAgICAgICAgY2F0ZWdvcnlNYXBbY2F0ZWdvcnldLmNvdW50KytcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuY2F0ZWdvcnlIaWRlRHluYW1pYykge1xuICAgICAgICAgICAgICBjYXRlZ29yeU1hcFtjYXRlZ29yeV0gPSB7XG4gICAgICAgICAgICAgICAgaW5kZXg6IGNhdGVnb3J5TGVuZ3RoKyssXG4gICAgICAgICAgICAgICAgY291bnQ6IDEsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmNhdGVnb3J5U2hvd0FsbCkge1xuICAgICAgICAgIGZvciAoY29uc3QgY2F0ZWdvcnkgaW4gY2F0ZWdvcnlNYXApIHtcbiAgICAgICAgICAgIGlmIChjYXRlZ29yeU1hcFtjYXRlZ29yeV0uY291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgZGVsZXRlIGNhdGVnb3J5TWFwW2NhdGVnb3J5XVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzLmZpbHRlcigoY2F0ZWdvcnk6IENhbGVuZGFyQ2F0ZWdvcnkpID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNhdGVnb3J5ID09PSAnb2JqZWN0JyAmJiBjYXRlZ29yeS5jYXRlZ29yeU5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBjYXRlZ29yeU1hcC5oYXNPd25Qcm9wZXJ0eShjYXRlZ29yeS5jYXRlZ29yeU5hbWUpXG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY2F0ZWdvcnkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gY2F0ZWdvcnlNYXAuaGFzT3duUHJvcGVydHkoY2F0ZWdvcnkpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNhdGVnb3JpZXNcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoKTogVk5vZGUge1xuICAgIGNvbnN0IHsgc3RhcnQsIGVuZCwgbWF4RGF5cywgY29tcG9uZW50LCB3ZWVrZGF5cywgY2F0ZWdvcmllcyB9ID0gdGhpcy5yZW5kZXJQcm9wc1xuXG4gICAgLy8gT25seSBwYXNzIGNhdGVnb3JpZXMgcHJvcCB0byBWQ2FsZW5kYXJDYXRlZ29yeSBjb21wb25lbnRcbiAgICBjb25zdCBwcm9wczogYW55ID0ge1xuICAgICAgcmVmOiAnY2FsZW5kYXJDaGlsZCcsXG4gICAgICBjbGFzczogWyd2LWNhbGVuZGFyJywge1xuICAgICAgICAndi1jYWxlbmRhci1ldmVudHMnOiAhdGhpcy5ub0V2ZW50cyxcbiAgICAgIH1dLFxuICAgICAgc3RhcnQ6IHN0YXJ0LmRhdGUsXG4gICAgICBlbmQ6IGVuZC5kYXRlLFxuICAgICAgbWF4RGF5cyxcbiAgICAgIHdlZWtkYXlzLFxuICAgICAgcm9sZTogJ2dyaWQnLFxuICAgICAgJ29uQ2xpY2s6ZGF0ZSc6IChkYXk6IENhbGVuZGFyVGltZXN0YW1wLCBlPzogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiRlbWl0KCd1cGRhdGU6bW9kZWxWYWx1ZScsIGRheS5kYXRlKVxuICAgICAgICB0aGlzLiRlbWl0KCdjbGljazpkYXRlJywgZGF5LCBlKVxuICAgICAgfSxcbiAgICB9XG5cbiAgICAvLyBPbmx5IGFkZCBjYXRlZ29yaWVzIHByb3AgZm9yIFZDYWxlbmRhckNhdGVnb3J5IGNvbXBvbmVudFxuICAgIGlmIChjb21wb25lbnQubmFtZSA9PT0gJ3YtY2FsZW5kYXItY2F0ZWdvcnknKSB7XG4gICAgICBwcm9wcy5jYXRlZ29yaWVzID0gY2F0ZWdvcmllc1xuICAgIH1cblxuICAgIHJldHVybiB3aXRoRGlyZWN0aXZlcyhoKGNvbXBvbmVudCwgcHJvcHMsIHRoaXMuZ2V0U2NvcGVkU2xvdHMoKSksIFtcbiAgICAgIFtSZXNpemUsIHRoaXMudXBkYXRlRXZlbnRWaXNpYmlsaXR5LCAnJywgeyBxdWlldDogdHJ1ZSB9XSxcbiAgICBdKVxuICB9LFxufSlcbiJdfQ==