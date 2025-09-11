// Styles
import './calendar-with-events.sass';
// Types
import { defineComponent, h, withDirectives } from 'vue';
// Directives
import ripple from '../../../directives/ripple';
// Mixins
import CalendarBase from './calendar-base';
// Util
import props from '../util/props';
import { CalendarEventOverlapModes, } from '../modes';
import { getDayIdentifier, diffMinutes, } from '../util/timestamp';
import { parseEvent, isEventStart, isEventOn, isEventOverlapping, isEventHiddenOn, } from '../util/events';
const WIDTH_FULL = 100;
const WIDTH_START = 95;
const MINUTES_IN_DAY = 1440;
/* @vue/component */
export default defineComponent({
    name: 'calendar-with-events',
    extends: CalendarBase,
    props: {
        ...props.events,
        ...props.calendar,
        ...props.category,
    },
    computed: {
        noEvents() {
            return this.events.length === 0;
        },
        parsedEvents() {
            return this.events.map(this.parseEvent);
        },
        parsedEventOverlapThreshold() {
            return parseInt(this.eventOverlapThreshold);
        },
        eventTimedFunction() {
            return typeof this.eventTimed === 'function'
                ? this.eventTimed
                : event => !!event[this.eventTimed];
        },
        eventCategoryFunction() {
            return typeof this.eventCategory === 'function'
                ? this.eventCategory
                : event => event[this.eventCategory];
        },
        eventTextColorFunction() {
            return typeof this.eventTextColor === 'function'
                ? this.eventTextColor
                : () => this.eventTextColor;
        },
        eventNameFunction() {
            return typeof this.eventName === 'function'
                ? this.eventName
                : (event, timedEvent) => event.input[this.eventName] || '';
        },
        eventModeFunction() {
            return typeof this.eventOverlapMode === 'function'
                ? this.eventOverlapMode
                : CalendarEventOverlapModes[this.eventOverlapMode];
        },
        eventWeekdays() {
            return this.parsedWeekdays;
        },
        categoryMode() {
            return this.type === 'category';
        },
    },
    methods: {
        eventColorFunction(e) {
            return typeof this.eventColor === 'function'
                ? this.eventColor(e)
                : e.color || this.eventColor;
        },
        parseEvent(input, index = 0) {
            return parseEvent(input, index, this.eventStart, this.eventEnd, this.eventTimedFunction(input), this.categoryMode ? this.eventCategoryFunction(input) : false);
        },
        formatTime(withTime, ampm) {
            const formatter = this.getFormatter({
                timeZone: 'UTC',
                hour: 'numeric',
                minute: withTime.minute > 0 ? 'numeric' : undefined,
            });
            return formatter(withTime, true);
        },
        updateEventVisibility() {
            if (this.noEvents || !this.eventMore) {
                return;
            }
            const eventHeight = this.eventHeight;
            const eventsMap = this.getEventsMap();
            for (const date in eventsMap) {
                const { parent, events, more } = eventsMap[date];
                if (!more) {
                    break;
                }
                const parentBounds = parent.getBoundingClientRect();
                const last = events.length - 1;
                const eventsSorted = events.map(event => ({
                    event,
                    bottom: event.getBoundingClientRect().bottom,
                })).sort((a, b) => a.bottom - b.bottom);
                let hidden = 0;
                for (let i = 0; i <= last; i++) {
                    const bottom = eventsSorted[i].bottom;
                    const hide = i === last
                        ? (bottom > parentBounds.bottom)
                        : (bottom + eventHeight > parentBounds.bottom);
                    if (hide) {
                        eventsSorted[i].event.style.display = 'none';
                        hidden++;
                    }
                }
                if (hidden) {
                    more.style.display = '';
                    more.innerHTML = this.$vuetify.lang.t(this.eventMoreText, hidden);
                }
                else {
                    more.style.display = 'none';
                }
            }
        },
        getEventsMap() {
            const eventsMap = {};
            const elements = this.$refs.events;
            if (!elements || !elements.forEach) {
                return eventsMap;
            }
            elements.forEach(el => {
                const date = el.getAttribute('data-date');
                if (el.parentElement && date) {
                    if (!(date in eventsMap)) {
                        eventsMap[date] = {
                            parent: el.parentElement,
                            more: null,
                            events: [],
                        };
                    }
                    if (el.getAttribute('data-more')) {
                        eventsMap[date].more = el;
                    }
                    else {
                        eventsMap[date].events.push(el);
                        el.style.display = '';
                    }
                }
            });
            return eventsMap;
        },
        genDayEvent({ event }, day) {
            const eventHeight = this.eventHeight;
            const eventMarginBottom = this.eventMarginBottom;
            const dayIdentifier = getDayIdentifier(day);
            const week = day.week;
            const start = dayIdentifier === event.startIdentifier;
            let end = dayIdentifier === event.endIdentifier;
            let width = WIDTH_START;
            if (!this.categoryMode) {
                for (let i = day.index + 1; i < week.length; i++) {
                    const weekdayIdentifier = getDayIdentifier(week[i]);
                    if (event.endIdentifier >= weekdayIdentifier) {
                        width += WIDTH_FULL;
                        end = end || weekdayIdentifier === event.endIdentifier;
                    }
                    else {
                        end = true;
                        break;
                    }
                }
            }
            const scope = { eventParsed: event, day, start, end, timed: false };
            return this.genEvent(event, scope, false, {
                class: ['v-event', {
                        'v-event-start': start,
                        'v-event-end': end,
                    }],
                style: {
                    height: `${eventHeight}px`,
                    width: `${width}%`,
                    'margin-bottom': `${eventMarginBottom}px`,
                },
                'data-date': day.date,
                key: event.index,
                ref: 'events',
            });
        },
        genTimedEvent({ event, left, width }, day) {
            if (day.timeDelta(event.end) < 0 || day.timeDelta(event.start) >= 1 || isEventHiddenOn(event, day)) {
                return false;
            }
            const dayIdentifier = getDayIdentifier(day);
            const start = event.startIdentifier >= dayIdentifier;
            const end = event.endIdentifier > dayIdentifier;
            const top = start ? day.timeToY(event.start) : 0;
            const bottom = end ? day.timeToY(MINUTES_IN_DAY) : day.timeToY(event.end);
            const height = Math.max(this.eventHeight, bottom - top);
            const scope = { eventParsed: event, day, start, end, timed: true };
            return this.genEvent(event, scope, true, {
                class: 'v-event-timed',
                style: {
                    top: `${top}px`,
                    height: `${height}px`,
                    left: `${left}%`,
                    width: `${width}%`,
                },
            });
        },
        genEvent(event, scopeInput, timedEvent, data) {
            var _a;
            const slot = this.$slots.event;
            const text = this.eventTextColorFunction(event.input);
            const background = this.eventColorFunction(event.input);
            const overlapsNoon = event.start.hour < 12 && event.end.hour >= 12;
            const singline = diffMinutes(event.start, event.end) <= this.parsedEventOverlapThreshold;
            const formatTime = this.formatTime;
            const timeSummary = () => formatTime(event.start, overlapsNoon) + ' - ' + formatTime(event.end, true);
            const eventSummary = () => {
                const name = this.eventNameFunction(event, timedEvent);
                if (event.start.hasTime) {
                    if (timedEvent) {
                        const time = timeSummary();
                        const delimiter = singline ? ', ' : h('br');
                        return h('span', { class: 'v-event-summary' }, [
                            h('strong', [name]),
                            delimiter,
                            time,
                        ]);
                    }
                    else {
                        const time = formatTime(event.start, true);
                        return h('span', { class: 'v-event-summary' }, [
                            h('strong', [time]),
                            ' ',
                            name,
                        ]);
                    }
                }
                return h('span', { class: 'v-event-summary' }, [name]);
            };
            const scope = {
                ...scopeInput,
                event: event.input,
                outside: scopeInput.day.outside,
                singline,
                overlapsNoon,
                formatTime,
                timeSummary,
                eventSummary,
            };
            return withDirectives(h('div', this.setTextColor(text, this.setBackgroundColor(background, {
                ...this.getDefaultMouseEventHandlers(':event', nativeEvent => ({ ...scope, nativeEvent })),
                ...data,
            })), slot
                ? slot(scope)
                : [this.genName(eventSummary)]), [
                [ripple, (_a = this.eventRipple) !== null && _a !== void 0 ? _a : true],
            ]);
        },
        genName(eventSummary) {
            return h('div', {
                class: 'pl-1',
            }, [eventSummary()]);
        },
        genPlaceholder(day) {
            const height = this.eventHeight + this.eventMarginBottom;
            return h('div', {
                style: {
                    height: `${height}px`,
                },
                'data-date': day.date,
                ref: 'events',
            });
        },
        genMore(day) {
            var _a;
            const eventHeight = this.eventHeight;
            const eventMarginBottom = this.eventMarginBottom;
            return withDirectives(h('div', {
                class: ['v-event-more pl-1', {
                        'v-outside': day.outside,
                    }],
                'data-date': day.date,
                'data-more': 1,
                ...this.getDefaultMouseEventHandlers(':more', nativeEvent => {
                    return { nativeEvent, ...day };
                }),
                style: {
                    display: 'none',
                    height: `${eventHeight}px`,
                    'margin-bottom': `${eventMarginBottom}px`,
                },
                ref: 'events',
            }), [
                [ripple, (_a = this.eventRipple) !== null && _a !== void 0 ? _a : true],
            ]);
        },
        getVisibleEvents() {
            const start = getDayIdentifier(this.days[0]);
            const end = getDayIdentifier(this.days[this.days.length - 1]);
            return this.parsedEvents.filter(event => isEventOverlapping(event, start, end));
        },
        isEventForCategory(event, category) {
            return !this.categoryMode ||
                (typeof category === 'object' && category.categoryName &&
                    category.categoryName === event.category) ||
                (typeof event.category === 'string' && category === event.category) ||
                (typeof event.category !== 'string' && category === null);
        },
        getEventsForDay(day) {
            const identifier = getDayIdentifier(day);
            const firstWeekday = this.eventWeekdays[0];
            return this.parsedEvents.filter(event => isEventStart(event, day, identifier, firstWeekday));
        },
        getEventsForDayAll(day) {
            const identifier = getDayIdentifier(day);
            const firstWeekday = this.eventWeekdays[0];
            return this.parsedEvents.filter(event => event.allDay &&
                (this.categoryMode ? isEventOn(event, identifier) : isEventStart(event, day, identifier, firstWeekday)) &&
                this.isEventForCategory(event, day.category));
        },
        getEventsForDayTimed(day) {
            const identifier = getDayIdentifier(day);
            return this.parsedEvents.filter(event => !event.allDay &&
                isEventOn(event, identifier) &&
                this.isEventForCategory(event, day.category));
        },
        getScopedSlots() {
            if (this.noEvents) {
                return { ...this.$slots };
            }
            const mode = this.eventModeFunction(this.parsedEvents, this.eventWeekdays[0], this.parsedEventOverlapThreshold);
            const isNode = (input) => !!input;
            const getSlotChildren = (day, getter, mapper, timed) => {
                const events = getter(day);
                const visuals = mode(day, events, timed, this.categoryMode);
                if (timed) {
                    return visuals.map(visual => mapper(visual, day)).filter(isNode);
                }
                const children = [];
                visuals.forEach((visual, index) => {
                    while (children.length < visual.column) {
                        children.push(this.genPlaceholder(day));
                    }
                    const mapped = mapper(visual, day);
                    if (mapped) {
                        children.push(mapped);
                    }
                });
                return children;
            };
            const slots = this.$slots;
            const slotDay = slots.day;
            const slotDayHeader = slots['day-header'];
            const slotDayBody = slots['day-body'];
            return {
                ...slots,
                day: (day) => {
                    let children = getSlotChildren(day, this.getEventsForDay, this.genDayEvent, false);
                    if (children && children.length > 0 && this.eventMore) {
                        children.push(this.genMore(day));
                    }
                    if (slotDay) {
                        const slot = slotDay(day);
                        if (slot) {
                            children = children ? children.concat(slot) : slot;
                        }
                    }
                    return children;
                },
                'day-header': (day) => {
                    let children = getSlotChildren(day, this.getEventsForDayAll, this.genDayEvent, false);
                    if (slotDayHeader) {
                        const slot = slotDayHeader(day);
                        if (slot) {
                            children = children ? children.concat(slot) : slot;
                        }
                    }
                    return children;
                },
                'day-body': (day) => {
                    const events = getSlotChildren(day, this.getEventsForDayTimed, this.genTimedEvent, true);
                    let children = [
                        h('div', {
                            class: 'v-event-timed-container',
                        }, events),
                    ];
                    if (slotDayBody) {
                        const slot = slotDayBody(day);
                        if (slot) {
                            children = children.concat(slot);
                        }
                    }
                    return children;
                },
            };
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItd2l0aC1ldmVudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WQ2FsZW5kYXIvbWl4aW5zL2NhbGVuZGFyLXdpdGgtZXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLDZCQUE2QixDQUFBO0FBRXBDLFFBQVE7QUFDUixPQUFPLEVBQW9CLGVBQWUsRUFBRSxDQUFDLEVBQUUsY0FBYyxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBRTFFLGFBQWE7QUFDYixPQUFPLE1BQU0sTUFBTSw0QkFBNEIsQ0FBQTtBQUUvQyxTQUFTO0FBQ1QsT0FBTyxZQUFZLE1BQU0saUJBQWlCLENBQUE7QUFFMUMsT0FBTztBQUNQLE9BQU8sS0FBSyxNQUFNLGVBQWUsQ0FBQTtBQUNqQyxPQUFPLEVBQ0wseUJBQXlCLEdBQzFCLE1BQU0sVUFBVSxDQUFBO0FBQ2pCLE9BQU8sRUFDTCxnQkFBZ0IsRUFBRSxXQUFXLEdBQzlCLE1BQU0sbUJBQW1CLENBQUE7QUFDMUIsT0FBTyxFQUNMLFVBQVUsRUFDVixZQUFZLEVBQ1osU0FBUyxFQUNULGtCQUFrQixFQUNsQixlQUFlLEdBQ2hCLE1BQU0sZ0JBQWdCLENBQUE7QUEyQ3ZCLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQTtBQUN0QixNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUE7QUFDdEIsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFBO0FBRTNCLG9CQUFvQjtBQUNwQixlQUFlLGVBQWUsQ0FBQztJQUM3QixJQUFJLEVBQUUsc0JBQXNCO0lBRzVCLE9BQU8sRUFBRSxZQUFZO0lBRXJCLEtBQUssRUFBRTtRQUNMLEdBQUcsS0FBSyxDQUFDLE1BQU07UUFDZixHQUFHLEtBQUssQ0FBQyxRQUFRO1FBQ2pCLEdBQUcsS0FBSyxDQUFDLFFBQVE7S0FDbEI7SUFFRCxRQUFRLEVBQUU7UUFDUixRQUFRO1lBQ04sT0FBTyxJQUFJLENBQUMs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Q0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXG5pbXBvcnQgJy4vY2FsZW5kYXItd2l0aC1ldmVudHMuc2FzcydcblxuLy8gVHlwZXNcbmltcG9ydCB7IFZOb2RlLCBWTm9kZURhdGEsIGRlZmluZUNvbXBvbmVudCwgaCwgd2l0aERpcmVjdGl2ZXMgfSBmcm9tICd2dWUnXG5cbi8vIERpcmVjdGl2ZXNcbmltcG9ydCByaXBwbGUgZnJvbSAnLi4vLi4vLi4vZGlyZWN0aXZlcy9yaXBwbGUnXG5cbi8vIE1peGluc1xuaW1wb3J0IENhbGVuZGFyQmFzZSBmcm9tICcuL2NhbGVuZGFyLWJhc2UnXG5cbi8vIFV0aWxcbmltcG9ydCBwcm9wcyBmcm9tICcuLi91dGlsL3Byb3BzJ1xuaW1wb3J0IHtcbiAgQ2FsZW5kYXJFdmVudE92ZXJsYXBNb2Rlcyxcbn0gZnJvbSAnLi4vbW9kZXMnXG5pbXBvcnQge1xuICBnZXREYXlJZGVudGlmaWVyLCBkaWZmTWludXRlcyxcbn0gZnJvbSAnLi4vdXRpbC90aW1lc3RhbXAnXG5pbXBvcnQge1xuICBwYXJzZUV2ZW50LFxuICBpc0V2ZW50U3RhcnQsXG4gIGlzRXZlbnRPbixcbiAgaXNFdmVudE92ZXJsYXBwaW5nLFxuICBpc0V2ZW50SGlkZGVuT24sXG59IGZyb20gJy4uL3V0aWwvZXZlbnRzJ1xuaW1wb3J0IHtcbiAgQ2FsZW5kYXJUaW1lc3RhbXAsXG4gIENhbGVuZGFyRXZlbnRQYXJzZWQsXG4gIENhbGVuZGFyRXZlbnRWaXN1YWwsXG4gIENhbGVuZGFyRXZlbnRDb2xvckZ1bmN0aW9uLFxuICBDYWxlbmRhckV2ZW50TmFtZUZ1bmN0aW9uLFxuICBDYWxlbmRhckV2ZW50VGltZWRGdW5jdGlvbixcbiAgQ2FsZW5kYXJEYXlTbG90U2NvcGUsXG4gIENhbGVuZGFyRGF5Qm9keVNsb3RTY29wZSxcbiAgQ2FsZW5kYXJFdmVudE92ZXJsYXBNb2RlLFxuICBDYWxlbmRhckV2ZW50LFxuICBDYWxlbmRhckV2ZW50Q2F0ZWdvcnlGdW5jdGlvbixcbiAgQ2FsZW5kYXJDYXRlZ29yeSxcbn0gZnJvbSAndnVldGlmeS90eXBlcydcblxuLy8gVHlwZXNcbnR5cGUgVkV2ZW50R2V0dGVyPEQ+ID0gKGRheTogRCkgPT4gQ2FsZW5kYXJFdmVudFBhcnNlZFtdXG5cbnR5cGUgVkV2ZW50VmlzdWFsVG9Ob2RlPEQ+ID0gKHZpc3VhbDogQ2FsZW5kYXJFdmVudFZpc3VhbCwgZGF5OiBEKSA9PiBWTm9kZSB8IGZhbHNlXG5cbnR5cGUgVkV2ZW50c1RvTm9kZXMgPSA8RCBleHRlbmRzIENhbGVuZGFyRGF5U2xvdFNjb3BlPihcbiAgZGF5OiBELFxuICBnZXR0ZXI6IFZFdmVudEdldHRlcjxEPixcbiAgbWFwcGVyOiBWRXZlbnRWaXN1YWxUb05vZGU8RD4sXG4gIHRpbWVkOiBib29sZWFuKSA9PiBWTm9kZVtdIHwgdW5kZWZpbmVkXG5cbnR5cGUgVkRhaWx5RXZlbnRzTWFwID0ge1xuICBbZGF0ZTogc3RyaW5nXToge1xuICAgIHBhcmVudDogSFRNTEVsZW1lbnRcbiAgICBtb3JlOiBIVE1MRWxlbWVudCB8IG51bGxcbiAgICBldmVudHM6IEhUTUxFbGVtZW50W11cbiAgfVxufVxuXG5pbnRlcmZhY2UgVkV2ZW50U2NvcGVJbnB1dCB7XG4gIGV2ZW50UGFyc2VkOiBDYWxlbmRhckV2ZW50UGFyc2VkXG4gIGRheTogQ2FsZW5kYXJEYXlTbG90U2NvcGVcbiAgc3RhcnQ6IGJvb2xlYW5cbiAgZW5kOiBib29sZWFuXG4gIHRpbWVkOiBib29sZWFuXG59XG5cbmNvbnN0IFdJRFRIX0ZVTEwgPSAxMDBcbmNvbnN0IFdJRFRIX1NUQVJUID0gOTVcbmNvbnN0IE1JTlVURVNfSU5fREFZID0gMTQ0MFxuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29tcG9uZW50KHtcbiAgbmFtZTogJ2NhbGVuZGFyLXdpdGgtZXZlbnRzJyxcblxuXG4gIGV4dGVuZHM6IENhbGVuZGFyQmFzZSxcblxuICBwcm9wczoge1xuICAgIC4uLnByb3BzLmV2ZW50cyxcbiAgICAuLi5wcm9wcy5jYWxlbmRhcixcbiAgICAuLi5wcm9wcy5jYXRlZ29yeSxcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIG5vRXZlbnRzICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLmV2ZW50cy5sZW5ndGggPT09IDBcbiAgICB9LFxuICAgIHBhcnNlZEV2ZW50cyAoKTogQ2FsZW5kYXJFdmVudFBhcnNlZFtdIHtcbiAgICAgIHJldHVybiB0aGlzLmV2ZW50cy5tYXAodGhpcy5wYXJzZUV2ZW50KVxuICAgIH0sXG4gICAgcGFyc2VkRXZlbnRPdmVybGFwVGhyZXNob2xkICgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMuZXZlbnRPdmVybGFwVGhyZXNob2xkKVxuICAgIH0sXG4gICAgZXZlbnRUaW1lZEZ1bmN0aW9uICgpOiBDYWxlbmRhckV2ZW50VGltZWRGdW5jdGlvbiB7XG4gICAgICByZXR1cm4gdHlwZW9mIHRoaXMuZXZlbnRUaW1lZCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICA/IHRoaXMuZXZlbnRUaW1lZFxuICAgICAgICA6IGV2ZW50ID0+ICEhZXZlbnRbdGhpcy5ldmVudFRpbWVkIGFzIHN0cmluZ11cbiAgICB9LFxuICAgIGV2ZW50Q2F0ZWdvcnlGdW5jdGlvbiAoKTogQ2FsZW5kYXJFdmVudENhdGVnb3J5RnVuY3Rpb24ge1xuICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLmV2ZW50Q2F0ZWdvcnkgPT09ICdmdW5jdGlvbidcbiAgICAgICAgPyB0aGlzLmV2ZW50Q2F0ZWdvcnlcbiAgICAgICAgOiBldmVudCA9PiBldmVudFt0aGlzLmV2ZW50Q2F0ZWdvcnkgYXMgc3RyaW5nXVxuICAgIH0sXG4gICAgZXZlbnRUZXh0Q29sb3JGdW5jdGlvbiAoKTogQ2FsZW5kYXJFdmVudENvbG9yRnVuY3Rpb24ge1xuICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLmV2ZW50VGV4dENvbG9yID09PSAnZnVuY3Rpb24nXG4gICAgICAgID8gdGhpcy5ldmVudFRleHRDb2xvclxuICAgICAgICA6ICgpID0+IHRoaXMuZXZlbnRUZXh0Q29sb3IgYXMgc3RyaW5nXG4gICAgfSxcbiAgICBldmVudE5hbWVGdW5jdGlvbiAoKTogQ2FsZW5kYXJFdmVudE5hbWVGdW5jdGlvbiB7XG4gICAgICByZXR1cm4gdHlwZW9mIHRoaXMuZXZlbnROYW1lID09PSAnZnVuY3Rpb24nXG4gICAgICAgID8gdGhpcy5ldmVudE5hbWVcbiAgICAgICAgOiAoZXZlbnQsIHRpbWVkRXZlbnQpID0+IGV2ZW50LmlucHV0W3RoaXMuZXZlbnROYW1lIGFzIHN0cmluZ10gYXMgc3RyaW5nIHx8ICcnXG4gICAgfSxcbiAgICBldmVudE1vZGVGdW5jdGlvbiAoKTogQ2FsZW5kYXJFdmVudE92ZXJsYXBNb2RlIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdGhpcy5ldmVudE92ZXJsYXBNb2RlID09PSAnZnVuY3Rpb24nXG4gICAgICAgID8gdGhpcy5ldmVudE92ZXJsYXBNb2RlXG4gICAgICAgIDogQ2FsZW5kYXJFdmVudE92ZXJsYXBNb2Rlc1t0aGlzLmV2ZW50T3ZlcmxhcE1vZGVdXG4gICAgfSxcbiAgICBldmVudFdlZWtkYXlzICgpOiBudW1iZXJbXSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZWRXZWVrZGF5c1xuICAgIH0sXG4gICAgY2F0ZWdvcnlNb2RlICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLnR5cGUgPT09ICdjYXRlZ29yeSdcbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBldmVudENvbG9yRnVuY3Rpb24gKGU6IENhbGVuZGFyRXZlbnQpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLmV2ZW50Q29sb3IgPT09ICdmdW5jdGlvbidcbiAgICAgICAgPyB0aGlzLmV2ZW50Q29sb3IoZSlcbiAgICAgICAgOiBlLmNvbG9yIHx8IHRoaXMuZXZlbnRDb2xvclxuICAgIH0sXG4gICAgcGFyc2VFdmVudCAoaW5wdXQ6IENhbGVuZGFyRXZlbnQsIGluZGV4ID0gMCk6IENhbGVuZGFyRXZlbnRQYXJzZWQge1xuICAgICAgcmV0dXJuIHBhcnNlRXZlbnQoXG4gICAgICAgIGlucHV0LFxuICAgICAgICBpbmRleCxcbiAgICAgICAgdGhpcy5ldmVudFN0YXJ0LFxuICAgICAgICB0aGlzLmV2ZW50RW5kLFxuICAgICAgICB0aGlzLmV2ZW50VGltZWRGdW5jdGlvbihpbnB1dCksXG4gICAgICAgIHRoaXMuY2F0ZWdvcnlNb2RlID8gdGhpcy5ldmVudENhdGVnb3J5RnVuY3Rpb24oaW5wdXQpIDogZmFsc2UsXG4gICAgICApXG4gICAgfSxcbiAgICBmb3JtYXRUaW1lICh3aXRoVGltZTogQ2FsZW5kYXJUaW1lc3RhbXAsIGFtcG06IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgY29uc3QgZm9ybWF0dGVyID0gdGhpcy5nZXRGb3JtYXR0ZXIoe1xuICAgICAgICB0aW1lWm9uZTogJ1VUQycsXG4gICAgICAgIGhvdXI6ICdudW1lcmljJyxcbiAgICAgICAgbWludXRlOiB3aXRoVGltZS5taW51dGUgPiAwID8gJ251bWVyaWMnIDogdW5kZWZpbmVkLFxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIGZvcm1hdHRlcih3aXRoVGltZSwgdHJ1ZSlcbiAgICB9LFxuICAgIHVwZGF0ZUV2ZW50VmlzaWJpbGl0eSAoKSB7XG4gICAgICBpZiAodGhpcy5ub0V2ZW50cyB8fCAhdGhpcy5ldmVudE1vcmUpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGV2ZW50SGVpZ2h0ID0gdGhpcy5ldmVudEhlaWdodFxuICAgICAgY29uc3QgZXZlbnRzTWFwID0gdGhpcy5nZXRFdmVudHNNYXAoKVxuXG4gICAgICBmb3IgKGNvbnN0IGRhdGUgaW4gZXZlbnRzTWFwKSB7XG4gICAgICAgIGNvbnN0IHsgcGFyZW50LCBldmVudHMsIG1vcmUgfSA9IGV2ZW50c01hcFtkYXRlXVxuICAgICAgICBpZiAoIW1vcmUpIHtcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGFyZW50Qm91bmRzID0gcGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgIGNvbnN0IGxhc3QgPSBldmVudHMubGVuZ3RoIC0gMVxuICAgICAgICBjb25zdCBldmVudHNTb3J0ZWQgPSBldmVudHMubWFwKGV2ZW50ID0+ICh7XG4gICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgYm90dG9tOiBldmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b20sXG4gICAgICAgIH0pKS5zb3J0KChhLCBiKSA9PiBhLmJvdHRvbSAtIGIuYm90dG9tKVxuICAgICAgICBsZXQgaGlkZGVuID0gMFxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IGxhc3Q7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGJvdHRvbSA9IGV2ZW50c1NvcnRlZFtpXS5ib3R0b21cbiAgICAgICAgICBjb25zdCBoaWRlID0gaSA9PT0gbGFzdFxuICAgICAgICAgICAgPyAoYm90dG9tID4gcGFyZW50Qm91bmRzLmJvdHRvbSlcbiAgICAgICAgICAgIDogKGJvdHRvbSArIGV2ZW50SGVpZ2h0ID4gcGFyZW50Qm91bmRzLmJvdHRvbSlcblxuICAgICAgICAgIGlmIChoaWRlKSB7XG4gICAgICAgICAgICBldmVudHNTb3J0ZWRbaV0uZXZlbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICAgICAgaGlkZGVuKytcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGlkZGVuKSB7XG4gICAgICAgICAgbW9yZS5zdHlsZS5kaXNwbGF5ID0gJydcbiAgICAgICAgICBtb3JlLmlubmVySFRNTCA9IHRoaXMuJHZ1ZXRpZnkubGFuZy50KHRoaXMuZXZlbnRNb3JlVGV4dCwgaGlkZGVuKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1vcmUuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXRFdmVudHNNYXAgKCk6IFZEYWlseUV2ZW50c01hcCB7XG4gICAgICBjb25zdCBldmVudHNNYXA6IFZEYWlseUV2ZW50c01hcCA9IHt9XG4gICAgICBjb25zdCBlbGVtZW50cyA9IHRoaXMuJHJlZnMuZXZlbnRzIGFzIEhUTUxFbGVtZW50W11cblxuICAgICAgaWYgKCFlbGVtZW50cyB8fCAhZWxlbWVudHMuZm9yRWFjaCkge1xuICAgICAgICByZXR1cm4gZXZlbnRzTWFwXG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBjb25zdCBkYXRlID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWRhdGUnKVxuICAgICAgICBpZiAoZWwucGFyZW50RWxlbWVudCAmJiBkYXRlKSB7XG4gICAgICAgICAgaWYgKCEoZGF0ZSBpbiBldmVudHNNYXApKSB7XG4gICAgICAgICAgICBldmVudHNNYXBbZGF0ZV0gPSB7XG4gICAgICAgICAgICAgIHBhcmVudDogZWwucGFyZW50RWxlbWVudCxcbiAgICAgICAgICAgICAgbW9yZTogbnVsbCxcbiAgICAgICAgICAgICAgZXZlbnRzOiBbXSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1tb3JlJykpIHtcbiAgICAgICAgICAgIGV2ZW50c01hcFtkYXRlXS5tb3JlID0gZWxcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXZlbnRzTWFwW2RhdGVdLmV2ZW50cy5wdXNoKGVsKVxuICAgICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9ICcnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gZXZlbnRzTWFwXG4gICAgfSxcbiAgICBnZW5EYXlFdmVudCAoeyBldmVudCB9OiBDYWxlbmRhckV2ZW50VmlzdWFsLCBkYXk6IENhbGVuZGFyRGF5U2xvdFNjb3BlKTogVk5vZGUge1xuICAgICAgY29uc3QgZXZlbnRIZWlnaHQgPSB0aGlzLmV2ZW50SGVpZ2h0XG4gICAgICBjb25zdCBldmVudE1hcmdpbkJvdHRvbSA9IHRoaXMuZXZlbnRNYXJnaW5Cb3R0b21cbiAgICAgIGNvbnN0IGRheUlkZW50aWZpZXIgPSBnZXREYXlJZGVudGlmaWVyKGRheSlcbiAgICAgIGNvbnN0IHdlZWsgPSBkYXkud2Vla1xuICAgICAgY29uc3Qgc3RhcnQgPSBkYXlJZGVudGlmaWVyID09PSBldmVudC5zdGFydElkZW50aWZpZXJcbiAgICAgIGxldCBlbmQgPSBkYXlJZGVudGlmaWVyID09PSBldmVudC5lbmRJZGVudGlmaWVyXG4gICAgICBsZXQgd2lkdGggPSBXSURUSF9TVEFSVFxuXG4gICAgICBpZiAoIXRoaXMuY2F0ZWdvcnlNb2RlKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSBkYXkuaW5kZXggKyAxOyBpIDwgd2Vlay5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IHdlZWtkYXlJZGVudGlmaWVyID0gZ2V0RGF5SWRlbnRpZmllcih3ZWVrW2ldKVxuICAgICAgICAgIGlmIChldmVudC5lbmRJZGVudGlmaWVyID49IHdlZWtkYXlJZGVudGlmaWVyKSB7XG4gICAgICAgICAgICB3aWR0aCArPSBXSURUSF9GVUxMXG4gICAgICAgICAgICBlbmQgPSBlbmQgfHwgd2Vla2RheUlkZW50aWZpZXIgPT09IGV2ZW50LmVuZElkZW50aWZpZXJcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW5kID0gdHJ1ZVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHNjb3BlID0geyBldmVudFBhcnNlZDogZXZlbnQsIGRheSwgc3RhcnQsIGVuZCwgdGltZWQ6IGZhbHNlIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZ2VuRXZlbnQoZXZlbnQsIHNjb3BlLCBmYWxzZSwge1xuICAgICAgICBjbGFzczogWyd2LWV2ZW50Jywge1xuICAgICAgICAgICd2LWV2ZW50LXN0YXJ0Jzogc3RhcnQsXG4gICAgICAgICAgJ3YtZXZlbnQtZW5kJzogZW5kLFxuICAgICAgICB9XSxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBoZWlnaHQ6IGAke2V2ZW50SGVpZ2h0fXB4YCxcbiAgICAgICAgICB3aWR0aDogYCR7d2lkdGh9JWAsXG4gICAgICAgICAgJ21hcmdpbi1ib3R0b20nOiBgJHtldmVudE1hcmdpbkJvdHRvbX1weGAsXG4gICAgICAgIH0sXG4gICAgICAgICdkYXRhLWRhdGUnOiBkYXkuZGF0ZSxcbiAgICAgICAga2V5OiBldmVudC5pbmRleCxcbiAgICAgICAgcmVmOiAnZXZlbnRzJyxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBnZW5UaW1lZEV2ZW50ICh7IGV2ZW50LCBsZWZ0LCB3aWR0aCB9OiBDYWxlbmRhckV2ZW50VmlzdWFsLCBkYXk6IENhbGVuZGFyRGF5Qm9keVNsb3RTY29wZSk6IFZOb2RlIHwgZmFsc2Uge1xuICAgICAgaWYgKGRheS50aW1lRGVsdGEoZXZlbnQuZW5kKSA8IDAgfHwgZGF5LnRpbWVEZWx0YShldmVudC5zdGFydCkgPj0gMSB8fCBpc0V2ZW50SGlkZGVuT24oZXZlbnQsIGRheSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRheUlkZW50aWZpZXIgPSBnZXREYXlJZGVudGlmaWVyKGRheSlcbiAgICAgIGNvbnN0IHN0YXJ0ID0gZXZlbnQuc3RhcnRJZGVudGlmaWVyID49IGRheUlkZW50aWZpZXJcbiAgICAgIGNvbnN0IGVuZCA9IGV2ZW50LmVuZElkZW50aWZpZXIgPiBkYXlJZGVudGlmaWVyXG4gICAgICBjb25zdCB0b3AgPSBzdGFydCA/IGRheS50aW1lVG9ZKGV2ZW50LnN0YXJ0KSA6IDBcbiAgICAgIGNvbnN0IGJvdHRvbSA9IGVuZCA/IGRheS50aW1lVG9ZKE1JTlVURVNfSU5fREFZKSA6IGRheS50aW1lVG9ZKGV2ZW50LmVuZClcbiAgICAgIGNvbnN0IGhlaWdodCA9IE1hdGgubWF4KHRoaXMuZXZlbnRIZWlnaHQsIGJvdHRvbSAtIHRvcClcbiAgICAgIGNvbnN0IHNjb3BlID0geyBldmVudFBhcnNlZDogZXZlbnQsIGRheSwgc3RhcnQsIGVuZCwgdGltZWQ6IHRydWUgfVxuXG4gICAgICByZXR1cm4gdGhpcy5nZW5FdmVudChldmVudCwgc2NvcGUsIHRydWUsIHtcbiAgICAgICAgY2xhc3M6ICd2LWV2ZW50LXRpbWVkJyxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICB0b3A6IGAke3RvcH1weGAsXG4gICAgICAgICAgaGVpZ2h0OiBgJHtoZWlnaHR9cHhgLFxuICAgICAgICAgIGxlZnQ6IGAke2xlZnR9JWAsXG4gICAgICAgICAgd2lkdGg6IGAke3dpZHRofSVgLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9LFxuICAgIGdlbkV2ZW50IChldmVudDogQ2FsZW5kYXJFdmVudFBhcnNlZCwgc2NvcGVJbnB1dDogVkV2ZW50U2NvcGVJbnB1dCwgdGltZWRFdmVudDogYm9vbGVhbiwgZGF0YTogVk5vZGVEYXRhKTogVk5vZGUge1xuICAgICAgY29uc3Qgc2xvdCA9IHRoaXMuJHNsb3RzLmV2ZW50XG4gICAgICBjb25zdCB0ZXh0ID0gdGhpcy5ldmVudFRleHRDb2xvckZ1bmN0aW9uKGV2ZW50LmlucHV0KVxuICAgICAgY29uc3QgYmFja2dyb3VuZCA9IHRoaXMuZXZlbnRDb2xvckZ1bmN0aW9uKGV2ZW50LmlucHV0KVxuICAgICAgY29uc3Qgb3ZlcmxhcHNOb29uID0gZXZlbnQuc3RhcnQuaG91ciA8IDEyICYmIGV2ZW50LmVuZC5ob3VyID49IDEyXG4gICAgICBjb25zdCBzaW5nbGluZSA9IGRpZmZNaW51dGVzKGV2ZW50LnN0YXJ0LCBldmVudC5lbmQpIDw9IHRoaXMucGFyc2VkRXZlbnRPdmVybGFwVGhyZXNob2xkXG4gICAgICBjb25zdCBmb3JtYXRUaW1lID0gdGhpcy5mb3JtYXRUaW1lXG4gICAgICBjb25zdCB0aW1lU3VtbWFyeSA9ICgpID0+IGZvcm1hdFRpbWUoZXZlbnQuc3RhcnQsIG92ZXJsYXBzTm9vbikgKyAnIC0gJyArIGZvcm1hdFRpbWUoZXZlbnQuZW5kLCB0cnVlKVxuICAgICAgY29uc3QgZXZlbnRTdW1tYXJ5ID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5ldmVudE5hbWVGdW5jdGlvbihldmVudCwgdGltZWRFdmVudClcbiAgICAgICAgaWYgKGV2ZW50LnN0YXJ0Lmhhc1RpbWUpIHtcbiAgICAgICAgICBpZiAodGltZWRFdmVudCkge1xuICAgICAgICAgICAgY29uc3QgdGltZSA9IHRpbWVTdW1tYXJ5KClcbiAgICAgICAgICAgIGNvbnN0IGRlbGltaXRlciA9IHNpbmdsaW5lID8gJywgJyA6IGgoJ2JyJylcblxuICAgICAgICAgICAgcmV0dXJuIGgoJ3NwYW4nLCB7IGNsYXNzOiAndi1ldmVudC1zdW1tYXJ5JyB9LCBbXG4gICAgICAgICAgICAgIGgoJ3N0cm9uZycsIFtuYW1lXSksXG4gICAgICAgICAgICAgIGRlbGltaXRlcixcbiAgICAgICAgICAgICAgdGltZSxcbiAgICAgICAgICAgIF0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHRpbWUgPSBmb3JtYXRUaW1lKGV2ZW50LnN0YXJ0LCB0cnVlKVxuXG4gICAgICAgICAgICByZXR1cm4gaCgnc3BhbicsIHsgY2xhc3M6ICd2LWV2ZW50LXN1bW1hcnknIH0sIFtcbiAgICAgICAgICAgICAgaCgnc3Ryb25nJywgW3RpbWVdKSxcbiAgICAgICAgICAgICAgJyAnLFxuICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgXSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaCgnc3BhbicsIHsgY2xhc3M6ICd2LWV2ZW50LXN1bW1hcnknIH0sIFtuYW1lXSlcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2NvcGUgPSB7XG4gICAgICAgIC4uLnNjb3BlSW5wdXQsXG4gICAgICAgIGV2ZW50OiBldmVudC5pbnB1dCxcbiAgICAgICAgb3V0c2lkZTogc2NvcGVJbnB1dC5kYXkub3V0c2lkZSxcbiAgICAgICAgc2luZ2xpbmUsXG4gICAgICAgIG92ZXJsYXBzTm9vbixcbiAgICAgICAgZm9ybWF0VGltZSxcbiAgICAgICAgdGltZVN1bW1hcnksXG4gICAgICAgIGV2ZW50U3VtbWFyeSxcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHdpdGhEaXJlY3RpdmVzKGgoJ2RpdicsXG4gICAgICAgIHRoaXMuc2V0VGV4dENvbG9yKHRleHQsXG4gICAgICAgICAgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IoYmFja2dyb3VuZCwge1xuICAgICAgICAgICAgLi4udGhpcy5nZXREZWZhdWx0TW91c2VFdmVudEhhbmRsZXJzKCc6ZXZlbnQnLCBuYXRpdmVFdmVudCA9PiAoeyAuLi5zY29wZSwgbmF0aXZlRXZlbnQgfSkpLFxuICAgICAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgICB9KVxuICAgICAgICApLCBzbG90XG4gICAgICAgICAgPyBzbG90KHNjb3BlKVxuICAgICAgICAgIDogW3RoaXMuZ2VuTmFtZShldmVudFN1bW1hcnkpXVxuICAgICAgKSwgW1xuICAgICAgICBbcmlwcGxlLCB0aGlzLmV2ZW50UmlwcGxlID8/IHRydWVdLFxuICAgICAgXSlcbiAgICB9LFxuICAgIGdlbk5hbWUgKGV2ZW50U3VtbWFyeTogKCkgPT4gc3RyaW5nIHwgVk5vZGUpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogJ3BsLTEnLFxuICAgICAgfSwgW2V2ZW50U3VtbWFyeSgpXSlcbiAgICB9LFxuICAgIGdlblBsYWNlaG9sZGVyIChkYXk6IENhbGVuZGFyVGltZXN0YW1wKTogVk5vZGUge1xuICAgICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5ldmVudEhlaWdodCArIHRoaXMuZXZlbnRNYXJnaW5Cb3R0b21cblxuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBoZWlnaHQ6IGAke2hlaWdodH1weGAsXG4gICAgICAgIH0sXG4gICAgICAgICdkYXRhLWRhdGUnOiBkYXkuZGF0ZSxcbiAgICAgICAgcmVmOiAnZXZlbnRzJyxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBnZW5Nb3JlIChkYXk6IENhbGVuZGFyRGF5U2xvdFNjb3BlKTogVk5vZGUge1xuICAgICAgY29uc3QgZXZlbnRIZWlnaHQgPSB0aGlzLmV2ZW50SGVpZ2h0XG4gICAgICBjb25zdCBldmVudE1hcmdpbkJvdHRvbSA9IHRoaXMuZXZlbnRNYXJnaW5Cb3R0b21cblxuICAgICAgcmV0dXJuIHdpdGhEaXJlY3RpdmVzKGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFsndi1ldmVudC1tb3JlIHBsLTEnLCB7XG4gICAgICAgICAgJ3Ytb3V0c2lkZSc6IGRheS5vdXRzaWRlLFxuICAgICAgICB9XSxcbiAgICAgICAgJ2RhdGEtZGF0ZSc6IGRheS5kYXRlLFxuICAgICAgICAnZGF0YS1tb3JlJzogMSxcbiAgICAgICAgLi4udGhpcy5nZXREZWZhdWx0TW91c2VFdmVudEhhbmRsZXJzKCc6bW9yZScsIG5hdGl2ZUV2ZW50ID0+IHtcbiAgICAgICAgICByZXR1cm4geyBuYXRpdmVFdmVudCwgLi4uZGF5IH1cbiAgICAgICAgfSksXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgZGlzcGxheTogJ25vbmUnLFxuICAgICAgICAgIGhlaWdodDogYCR7ZXZlbnRIZWlnaHR9cHhgLFxuICAgICAgICAgICdtYXJnaW4tYm90dG9tJzogYCR7ZXZlbnRNYXJnaW5Cb3R0b219cHhgLFxuICAgICAgICB9LFxuICAgICAgICByZWY6ICdldmVudHMnLFxuICAgICAgfSksIFtcbiAgICAgICAgW3JpcHBsZSwgdGhpcy5ldmVudFJpcHBsZSA/PyB0cnVlXSxcbiAgICAgIF0pXG4gICAgfSxcbiAgICBnZXRWaXNpYmxlRXZlbnRzICgpOiBDYWxlbmRhckV2ZW50UGFyc2VkW10ge1xuICAgICAgY29uc3Qgc3RhcnQgPSBnZXREYXlJZGVudGlmaWVyKHRoaXMuZGF5c1swXSlcbiAgICAgIGNvbnN0IGVuZCA9IGdldERheUlkZW50aWZpZXIodGhpcy5kYXlzW3RoaXMuZGF5cy5sZW5ndGggLSAxXSlcblxuICAgICAgcmV0dXJuIHRoaXMucGFyc2VkRXZlbnRzLmZpbHRlcihcbiAgICAgICAgZXZlbnQgPT4gaXNFdmVudE92ZXJsYXBwaW5nKGV2ZW50LCBzdGFydCwgZW5kKVxuICAgICAgKVxuICAgIH0sXG4gICAgaXNFdmVudEZvckNhdGVnb3J5IChldmVudDogQ2FsZW5kYXJFdmVudFBhcnNlZCwgY2F0ZWdvcnk6IENhbGVuZGFyQ2F0ZWdvcnkpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAhdGhpcy5jYXRlZ29yeU1vZGUgfHxcbiAgICAgICAgKHR5cGVvZiBjYXRlZ29yeSA9PT0gJ29iamVjdCcgJiYgY2F0ZWdvcnkuY2F0ZWdvcnlOYW1lICYmXG4gICAgICAgIGNhdGVnb3J5LmNhdGVnb3J5TmFtZSA9PT0gZXZlbnQuY2F0ZWdvcnkpIHx8XG4gICAgICAgICh0eXBlb2YgZXZlbnQuY2F0ZWdvcnkgPT09ICdzdHJpbmcnICYmIGNhdGVnb3J5ID09PSBldmVudC5jYXRlZ29yeSkgfHxcbiAgICAgICAgKHR5cGVvZiBldmVudC5jYXRlZ29yeSAhPT0gJ3N0cmluZycgJiYgY2F0ZWdvcnkgPT09IG51bGwpXG4gICAgfSxcbiAgICBnZXRFdmVudHNGb3JEYXkgKGRheTogQ2FsZW5kYXJEYXlTbG90U2NvcGUpOiBDYWxlbmRhckV2ZW50UGFyc2VkW10ge1xuICAgICAgY29uc3QgaWRlbnRpZmllciA9IGdldERheUlkZW50aWZpZXIoZGF5KVxuICAgICAgY29uc3QgZmlyc3RXZWVrZGF5ID0gdGhpcy5ldmVudFdlZWtkYXlzWzBdXG5cbiAgICAgIHJldHVybiB0aGlzLnBhcnNlZEV2ZW50cy5maWx0ZXIoXG4gICAgICAgIGV2ZW50ID0+IGlzRXZlbnRTdGFydChldmVudCwgZGF5LCBpZGVudGlmaWVyLCBmaXJzdFdlZWtkYXkpXG4gICAgICApXG4gICAgfSxcbiAgICBnZXRFdmVudHNGb3JEYXlBbGwgKGRheTogQ2FsZW5kYXJEYXlTbG90U2NvcGUpOiBDYWxlbmRhckV2ZW50UGFyc2VkW10ge1xuICAgICAgY29uc3QgaWRlbnRpZmllciA9IGdldERheUlkZW50aWZpZXIoZGF5KVxuICAgICAgY29uc3QgZmlyc3RXZWVrZGF5ID0gdGhpcy5ldmVudFdlZWtkYXlzWzBdXG5cbiAgICAgIHJldHVybiB0aGlzLnBhcnNlZEV2ZW50cy5maWx0ZXIoXG4gICAgICAgIGV2ZW50ID0+IGV2ZW50LmFsbERheSAmJlxuICAgICAgICAgICh0aGlzLmNhdGVnb3J5TW9kZSA/IGlzRXZlbnRPbihldmVudCwgaWRlbnRpZmllcikgOiBpc0V2ZW50U3RhcnQoZXZlbnQsIGRheSwgaWRlbnRpZmllciwgZmlyc3RXZWVrZGF5KSkgJiZcbiAgICAgICAgICB0aGlzLmlzRXZlbnRGb3JDYXRlZ29yeShldmVudCwgZGF5LmNhdGVnb3J5KVxuICAgICAgKVxuICAgIH0sXG4gICAgZ2V0RXZlbnRzRm9yRGF5VGltZWQgKGRheTogQ2FsZW5kYXJEYXlTbG90U2NvcGUpOiBDYWxlbmRhckV2ZW50UGFyc2VkW10ge1xuICAgICAgY29uc3QgaWRlbnRpZmllciA9IGdldERheUlkZW50aWZpZXIoZGF5KVxuICAgICAgcmV0dXJuIHRoaXMucGFyc2VkRXZlbnRzLmZpbHRlcihcbiAgICAgICAgZXZlbnQgPT4gIWV2ZW50LmFsbERheSAmJlxuICAgICAgICAgIGlzRXZlbnRPbihldmVudCwgaWRlbnRpZmllcikgJiZcbiAgICAgICAgICB0aGlzLmlzRXZlbnRGb3JDYXRlZ29yeShldmVudCwgZGF5LmNhdGVnb3J5KVxuICAgICAgKVxuICAgIH0sXG4gICAgZ2V0U2NvcGVkU2xvdHMgKCkge1xuICAgICAgaWYgKHRoaXMubm9FdmVudHMpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4udGhpcy4kc2xvdHMgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBtb2RlID0gdGhpcy5ldmVudE1vZGVGdW5jdGlvbihcbiAgICAgICAgdGhpcy5wYXJzZWRFdmVudHMsXG4gICAgICAgIHRoaXMuZXZlbnRXZWVrZGF5c1swXSxcbiAgICAgICAgdGhpcy5wYXJzZWRFdmVudE92ZXJsYXBUaHJlc2hvbGRcbiAgICAgIClcblxuICAgICAgY29uc3QgaXNOb2RlID0gKGlucHV0OiBWTm9kZSB8IGZhbHNlKTogaW5wdXQgaXMgVk5vZGUgPT4gISFpbnB1dFxuICAgICAgY29uc3QgZ2V0U2xvdENoaWxkcmVuOiBWRXZlbnRzVG9Ob2RlcyA9IChkYXksIGdldHRlciwgbWFwcGVyLCB0aW1lZCkgPT4ge1xuICAgICAgICBjb25zdCBldmVudHMgPSBnZXR0ZXIoZGF5KVxuICAgICAgICBjb25zdCB2aXN1YWxzID0gbW9kZShkYXksIGV2ZW50cywgdGltZWQsIHRoaXMuY2F0ZWdvcnlNb2RlKVxuXG4gICAgICAgIGlmICh0aW1lZCkge1xuICAgICAgICAgIHJldHVybiB2aXN1YWxzLm1hcCh2aXN1YWwgPT4gbWFwcGVyKHZpc3VhbCwgZGF5KSkuZmlsdGVyKGlzTm9kZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNoaWxkcmVuOiBWTm9kZVtdID0gW11cblxuICAgICAgICB2aXN1YWxzLmZvckVhY2goKHZpc3VhbCwgaW5kZXgpID0+IHtcbiAgICAgICAgICB3aGlsZSAoY2hpbGRyZW4ubGVuZ3RoIDwgdmlzdWFsLmNvbHVtbikge1xuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaCh0aGlzLmdlblBsYWNlaG9sZGVyKGRheSkpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgbWFwcGVkID0gbWFwcGVyKHZpc3VhbCwgZGF5KVxuICAgICAgICAgIGlmIChtYXBwZWQpIHtcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gobWFwcGVkKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gY2hpbGRyZW5cbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2xvdHMgPSB0aGlzLiRzbG90c1xuICAgICAgY29uc3Qgc2xvdERheSA9IHNsb3RzLmRheVxuICAgICAgY29uc3Qgc2xvdERheUhlYWRlciA9IHNsb3RzWydkYXktaGVhZGVyJ11cbiAgICAgIGNvbnN0IHNsb3REYXlCb2R5ID0gc2xvdHNbJ2RheS1ib2R5J11cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc2xvdHMsXG4gICAgICAgIGRheTogKGRheTogQ2FsZW5kYXJEYXlTbG90U2NvcGUpID0+IHtcbiAgICAgICAgICBsZXQgY2hpbGRyZW4gPSBnZXRTbG90Q2hpbGRyZW4oZGF5LCB0aGlzLmdldEV2ZW50c0ZvckRheSwgdGhpcy5nZW5EYXlFdmVudCwgZmFsc2UpXG4gICAgICAgICAgaWYgKGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aCA+IDAgJiYgdGhpcy5ldmVudE1vcmUpIHtcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2godGhpcy5nZW5Nb3JlKGRheSkpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzbG90RGF5KSB7XG4gICAgICAgICAgICBjb25zdCBzbG90ID0gc2xvdERheShkYXkpXG4gICAgICAgICAgICBpZiAoc2xvdCkge1xuICAgICAgICAgICAgICBjaGlsZHJlbiA9IGNoaWxkcmVuID8gY2hpbGRyZW4uY29uY2F0KHNsb3QpIDogc2xvdFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY2hpbGRyZW5cbiAgICAgICAgfSxcbiAgICAgICAgJ2RheS1oZWFkZXInOiAoZGF5OiBDYWxlbmRhckRheVNsb3RTY29wZSkgPT4ge1xuICAgICAgICAgIGxldCBjaGlsZHJlbiA9IGdldFNsb3RDaGlsZHJlbihkYXksIHRoaXMuZ2V0RXZlbnRzRm9yRGF5QWxsLCB0aGlzLmdlbkRheUV2ZW50LCBmYWxzZSlcblxuICAgICAgICAgIGlmIChzbG90RGF5SGVhZGVyKSB7XG4gICAgICAgICAgICBjb25zdCBzbG90ID0gc2xvdERheUhlYWRlcihkYXkpXG4gICAgICAgICAgICBpZiAoc2xvdCkge1xuICAgICAgICAgICAgICBjaGlsZHJlbiA9IGNoaWxkcmVuID8gY2hpbGRyZW4uY29uY2F0KHNsb3QpIDogc2xvdFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY2hpbGRyZW5cbiAgICAgICAgfSxcbiAgICAgICAgJ2RheS1ib2R5JzogKGRheTogQ2FsZW5kYXJEYXlCb2R5U2xvdFNjb3BlKSA9PiB7XG4gICAgICAgICAgY29uc3QgZXZlbnRzID0gZ2V0U2xvdENoaWxkcmVuKGRheSwgdGhpcy5nZXRFdmVudHNGb3JEYXlUaW1lZCwgdGhpcy5nZW5UaW1lZEV2ZW50LCB0cnVlKVxuICAgICAgICAgIGxldCBjaGlsZHJlbjogVk5vZGVbXSA9IFtcbiAgICAgICAgICAgIGgoJ2RpdicsIHtcbiAgICAgICAgICAgICAgY2xhc3M6ICd2LWV2ZW50LXRpbWVkLWNvbnRhaW5lcicsXG4gICAgICAgICAgICB9LCBldmVudHMpLFxuICAgICAgICAgIF1cblxuICAgICAgICAgIGlmIChzbG90RGF5Qm9keSkge1xuICAgICAgICAgICAgY29uc3Qgc2xvdCA9IHNsb3REYXlCb2R5KGRheSlcbiAgICAgICAgICAgIGlmIChzbG90KSB7XG4gICAgICAgICAgICAgIGNoaWxkcmVuID0gY2hpbGRyZW4uY29uY2F0KHNsb3QpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjaGlsZHJlblxuICAgICAgICB9LFxuICAgICAgfVxuICAgIH0sXG4gIH0sXG59KVxuIl19