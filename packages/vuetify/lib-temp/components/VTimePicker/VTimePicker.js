// Components
import VTimePickerTitle from './VTimePickerTitle';
import VTimePickerClock from './VTimePickerClock';
// Mixins
import Picker from '../../mixins/picker';
import PickerButton from '../../mixins/picker-button';
// Utils
import { createRange } from '../../util/helpers';
import pad from '../VDatePicker/util/pad';
import mixins from '../../util/mixins';
// Types
import { h } from 'vue';
import { SelectingTimes } from './SelectingTimes';
const rangeHours24 = createRange(24);
const rangeHours12am = createRange(12);
const rangeHours12pm = rangeHours12am.map(v => v + 12);
const range60 = createRange(60);
const selectingNames = { 1: 'hour', 2: 'minute', 3: 'second' };
export { SelectingTimes };
export default mixins(Picker, PickerButton
/* @vue/component */
).extend({
    name: 'v-time-picker',
    props: {
        activePicker: String,
        allowedHours: [Function, Array],
        allowedMinutes: [Function, Array],
        allowedSeconds: [Function, Array],
        disabled: Boolean,
        format: {
            type: String,
            default: 'ampm',
            validator(val) {
                return ['ampm', '24hr'].includes(val);
            },
        },
        min: String,
        max: String,
        readonly: Boolean,
        scrollable: Boolean,
        useSeconds: Boolean,
        modelValue: null,
        ampmInTitle: Boolean,
    },
    emits: [
        'update:modelValue',
        'change',
        'update:active-picker',
        'update:period',
        'click:hour',
        'click:minute',
        'click:second',
    ],
    data() {
        return {
            inputHour: null,
            inputMinute: null,
            inputSecond: null,
            lazyInputHour: null,
            lazyInputMinute: null,
            lazyInputSecond: null,
            period: 'am',
            selecting: SelectingTimes.Hour,
        };
    },
    computed: {
        selectingHour: {
            get() {
                return this.selecting === SelectingTimes.Hour;
            },
            set(v) {
                this.selecting = SelectingTimes.Hour;
            },
        },
        selectingMinute: {
            get() {
                return this.selecting === SelectingTimes.Minute;
            },
            set(v) {
                this.selecting = SelectingTimes.Minute;
            },
        },
        selectingSecond: {
            get() {
                return this.selecting === SelectingTimes.Second;
            },
            set(v) {
                this.selecting = SelectingTimes.Second;
            },
        },
        isAllowedHourCb() {
            let cb;
            if (this.allowedHours instanceof Array) {
                cb = (val) => this.allowedHours.includes(val);
            }
            else {
                cb = this.allowedHours;
            }
            if (!this.min && !this.max)
                return cb;
            const minHour = this.min ? Number(this.min.split(':')[0]) : 0;
            const maxHour = this.max ? Number(this.max.split(':')[0]) : 23;
            return (val) => {
                return val >= minHour * 1 && val <= maxHour * 1 && (!cb || cb(val));
            };
        },
        isAllowedMinuteCb() {
            let cb;
            const isHourAllowed = !this.isAllowedHourCb ||
                this.inputHour === null ||
                this.isAllowedHourCb(this.inputHour);
            if (this.allowedMinutes instanceof Array) {
                cb = (val) => this.allowedMinutes.includes(val);
            }
            else {
                cb = this.allowedMinutes;
            }
            if (!this.min && !this.max) {
                return isHourAllowed ? cb : () => false;
            }
            const [minHour, minMinute] = this.min
                ? this.min.split(':').map(Number)
                : [0, 0];
            const [maxHour, maxMinute] = this.max
                ? this.max.split(':').map(Number)
                : [23, 59];
            const minTime = minHour * 60 + minMinute * 1;
            const maxTime = maxHour * 60 + maxMinute * 1;
            return (val) => {
                const time = 60 * this.inputHour + val;
                return (time >= minTime &&
                    time <= maxTime &&
                    isHourAllowed &&
                    (!cb || cb(val)));
            };
        },
        isAllowedSecondCb() {
            let cb;
            const isHourAllowed = !this.isAllowedHourCb ||
                this.inputHour === null ||
                this.isAllowedHourCb(this.inputHour);
            const isMinuteAllowed = isHourAllowed &&
                (!this.isAllowedMinuteCb ||
                    this.inputMinute === null ||
                    this.isAllowedMinuteCb(this.inputMinute));
            if (this.allowedSeconds instanceof Array) {
                cb = (val) => this.allowedSeconds.includes(val);
            }
            else {
                cb = this.allowedSeconds;
            }
            if (!this.min && !this.max) {
                return isMinuteAllowed ? cb : () => false;
            }
            const [minHour, minMinute, minSecond] = this.min
                ? this.min.split(':').map(Number)
                : [0, 0, 0];
            const [maxHour, maxMinute, maxSecond] = this.max
                ? this.max.split(':').map(Number)
                : [23, 59, 59];
            const minTime = minHour * 3600 + minMinute * 60 + (minSecond || 0) * 1;
            const maxTime = maxHour * 3600 + maxMinute * 60 + (maxSecond || 0) * 1;
            return (val) => {
                const time = 3600 * this.inputHour + 60 * this.inputMinute + val;
                return (time >= minTime &&
                    time <= maxTime &&
                    isMinuteAllowed &&
                    (!cb || cb(val)));
            };
        },
        isAmPm() {
            return this.format === 'ampm';
        },
    },
    watch: {
        activePicker: 'setPicker',
        selecting: 'emitPicker',
        modelValue: {
            handler: 'setInputData',
            immediate: false
        },
    },
    mounted() {
        this.setInputData(this.modelValue);
        this.$on('update:period', this.setPeriod);
    },
    beforeUnmount() {
        this.$off('update:period', this.setPeriod);
    },
    methods: {
        genValue() {
            if (this.inputHour != null &&
                this.inputMinute != null &&
                (!this.useSeconds || this.inputSecond != null)) {
                return (`${pad(this.inputHour)}:${pad(this.inputMinute)}` +
                    (this.useSeconds ? `:${pad(this.inputSecond)}` : ''));
            }
            return null;
        },
        emitValue() {
            const value = this.genValue();
            if (value !== null)
                this.$emit('update:modelValue', value);
        },
        emitPicker(value) {
            let activePicker = 'HOUR';
            if (value === SelectingTimes.Minute) {
                activePicker = 'MINUTE';
            }
            else if (value === SelectingTimes.Second) {
                activePicker = 'SECOND';
            }
            this.$emit('update:active-picker', activePicker);
        },
        setPicker(picker) {
            if (picker === 'HOUR')
                this.selecting = SelectingTimes.Hour;
            else if (picker === 'MINUTE')
                this.selecting = SelectingTimes.Minute;
            else if (picker === 'SECOND' && this.useSeconds) {
                this.selecting = SelectingTimes.Second;
            }
        },
        setPeriod(period) {
            this.period = period;
            if (this.inputHour != null) {
                const newHour = this.inputHour + (period === 'am' ? -12 : 12);
                this.inputHour = this.firstAllowed('hour', newHour);
                this.emitValue();
            }
        },
        setInputData(value) {
            if (value == null || value === '') {
                this.inputHour = null;
                this.inputMinute = null;
                this.inputSecond = null;
            }
            else if (value instanceof Date) {
                this.inputHour = value.getHours();
                this.inputMinute = value.getMinutes();
                this.inputSecond = value.getSeconds();
            }
            else {
                const match = value
                    .trim()
                    .match(/^(\d+):(\d+)(:(\d+))?\s*([ap]m)?$/i);
                if (match) {
                    const [, hour, minute, , second, period] = match;
                    const normalizedPeriod = period ? period.toLowerCase() : null;
                    this.inputHour = normalizedPeriod
                        ? this.convert12to24(parseInt(hour, 10), normalizedPeriod)
                        : parseInt(hour, 10);
                    this.inputMinute = parseInt(minute, 10);
                    this.inputSecond = parseInt(second || 0, 10);
                    // Устанавливаем период только если он был указан в строке
                    if (normalizedPeriod) {
                        this.period = normalizedPeriod;
                    }
                    else if (this.inputHour != null) {
                        this.period = this.inputHour < 12 ? 'am' : 'pm';
                    }
                }
                else {
                    this.inputHour = null;
                    this.inputMinute = null;
                    this.inputSecond = null;
                }
            }
            // Для Date объектов устанавливаем период на основе 24-часового формата
            if (value instanceof Date && this.inputHour != null) {
                this.period = this.inputHour < 12 ? 'am' : 'pm';
            }
        },
        convert24to12(hour) {
            return hour ? ((hour - 1) % 12) + 1 : 12;
        },
        convert12to24(hour, period) {
            return (hour % 12) + (period === 'pm' ? 12 : 0);
        },
        onInput(value) {
            if (this.selecting === SelectingTimes.Hour) {
                this.inputHour = this.isAmPm
                    ? this.convert12to24(value, this.period)
                    : value;
            }
            else if (this.selecting === SelectingTimes.Minute) {
                this.inputMinute = value;
            }
            else {
                this.inputSecond = value;
            }
            this.emitValue();
        },
        onChange(value) {
            // Сначала обновляем значение через onInput - это ключевой момент!
            this.onInput(value);
            this.$emit(`click:${selectingNames[this.selecting]}`, value);
            const emitChange = this.selecting ===
                (this.useSeconds ? SelectingTimes.Second : SelectingTimes.Minute);
            if (this.selecting === SelectingTimes.Hour) {
                this.selecting = SelectingTimes.Minute;
            }
            else if (this.useSeconds && this.selecting === SelectingTimes.Minute) {
                this.selecting = SelectingTimes.Second;
            }
            if (this.inputHour === this.lazyInputHour &&
                this.inputMinute === this.lazyInputMinute &&
                (!this.useSeconds || this.inputSecond === this.lazyInputSecond)) {
                return;
            }
            const time = this.genValue();
            if (time === null)
                return;
            this.lazyInputHour = this.inputHour;
            this.lazyInputMinute = this.inputMinute;
            this.useSeconds && (this.lazyInputSecond = this.inputSecond);
            emitChange && this.$emit('change', time);
        },
        firstAllowed(type, value) {
            const allowedFn = type === 'hour'
                ? this.isAllowedHourCb
                : type === 'minute'
                    ? this.isAllowedMinuteCb
                    : this.isAllowedSecondCb;
            if (!allowedFn)
                return value;
            // TODO: clean up
            const range = type === 'minute'
                ? range60
                : type === 'second'
                    ? range60
                    : this.isAmPm
                        ? value < 12
                            ? rangeHours12am
                            : rangeHours12pm
                        : rangeHours24;
            const first = range.find(v => allowedFn(((v + value) % range.length) + range[0]));
            return (((first || 0) + value) % range.length) + range[0];
        },
        genClock() {
            return h(VTimePickerClock, {
                allowedValues: this.selecting === SelectingTimes.Hour
                    ? this.isAllowedHourCb
                    : this.selecting === SelectingTimes.Minute
                        ? this.isAllowedMinuteCb
                        : this.isAllowedSecondCb,
                color: this.color,
                dark: this.dark,
                disabled: this.disabled,
                double: this.selecting === SelectingTimes.Hour && !this.isAmPm,
                format: this.selecting === SelectingTimes.Hour
                    ? this.isAmPm
                        ? this.convert24to12
                        : (val) => val
                    : (val) => pad(val, 2),
                light: this.light,
                max: this.selecting === SelectingTimes.Hour
                    ? this.isAmPm && this.period === 'am'
                        ? 11
                        : 23
                    : 59,
                min: this.selecting === SelectingTimes.Hour &&
                    this.isAmPm &&
                    this.period === 'pm'
                    ? 12
                    : 0,
                readonly: this.readonly,
                scrollable: this.scrollable,
                size: Number(this.width) - (!this.fullWidth && this.landscape ? 80 : 20),
                step: this.selecting === SelectingTimes.Hour ? 1 : 5,
                modelValue: this.selecting === SelectingTimes.Hour
                    ? this.inputHour
                    : this.selecting === SelectingTimes.Minute
                        ? this.inputMinute
                        : this.inputSecond,
                onUpdateModelValue: this.onInput,
                onChange: this.onChange,
                ref: 'clock',
            });
        },
        genClockAmPm() {
            return h('div', this.setTextColor(this.color || 'primary', {
                class: 'v-time-picker-clock__ampm',
            }), [
                this.genPickerButton('period', 'am', this.$vuetify.lang.t('$vuetify.timePicker.am'), this.disabled || this.readonly),
                this.genPickerButton('period', 'pm', this.$vuetify.lang.t('$vuetify.timePicker.pm'), this.disabled || this.readonly),
            ]);
        },
        genPickerBody() {
            return h('div', {
                class: 'v-time-picker-clock__container',
                key: this.selecting,
            }, [
                !this.ampmInTitle && this.isAmPm && this.genClockAmPm(),
                this.genClock(),
            ]);
        },
        genPickerTitle() {
            return h(VTimePickerTitle, {
                ampm: this.isAmPm,
                ampmReadonly: this.isAmPm && !this.ampmInTitle,
                disabled: this.disabled,
                hour: this.inputHour,
                minute: this.inputMinute,
                second: this.inputSecond,
                period: this.period,
                readonly: this.readonly,
                useSeconds: this.useSeconds,
                selecting: this.selecting,
                'onUpdate:selecting': (value) => {
                    this.selecting = value;
                },
                'onUpdate:period': (period) => {
                    this.$emit('update:period', period);
                },
                ref: 'title',
            });
        },
    },
    render() {
        return this.genPicker('v-picker--time');
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRpbWVQaWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WVGltZVBpY2tlci9WVGltZVBpY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhO0FBQ2IsT0FBTyxnQkFBZ0IsTUFBTSxvQkFBb0IsQ0FBQTtBQUNqRCxPQUFPLGdCQUFnQixNQUFNLG9CQUFvQixDQUFBO0FBRWpELFNBQVM7QUFDVCxPQUFPLE1BQU0sTUFBTSxxQkFBcUIsQ0FBQTtBQUN4QyxPQUFPLFlBQVksTUFBTSw0QkFBNEIsQ0FBQTtBQUVyRCxRQUFRO0FBQ1IsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2hELE9BQU8sR0FBRyxNQUFNLHlCQUF5QixDQUFBO0FBQ3pDLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBRXRDLFFBQVE7QUFDUixPQUFPLEVBQW1CLENBQUMsRUFBbUIsTUFBTSxLQUFLLENBQUE7QUFDekQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtCQUFrQixDQUFBO0FBRWpELE1BQU0sWUFBWSxHQUFHLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUNwQyxNQUFNLGNBQWMsR0FBRyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDdEMsTUFBTSxjQUFjLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQTtBQUN0RCxNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDL0IsTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFBO0FBQzlELE9BQU8sRUFBRSxjQUFjLEVBQUUsQ0FBQTtBQU16QixlQUFlLE1BQU0sQ0FDbkIsTUFBTSxFQUNOLFlBQVk7QUFDWixv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QUE7Z0JBQ3hCLENBQUM7Z0JBQ0QsaUJBQWlCLEVBQUUsQ0FBQyxNQUFjLEVBQUUsRUFBRTtvQkFDcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDLENBQUE7Z0JBQ3JDLENBQUM7Z0JBQ0QsR0FBRyxFQUFFLE9BQU87YUFDYixDQUFDLENBQUE7UUFDSixDQUFDO0tBQ0Y7SUFFRCxNQUFNO1FBQ0osT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUE7SUFDekMsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvbXBvbmVudHNcbmltcG9ydCBWVGltZVBpY2tlclRpdGxlIGZyb20gJy4vVlRpbWVQaWNrZXJUaXRsZSdcbmltcG9ydCBWVGltZVBpY2tlckNsb2NrIGZyb20gJy4vVlRpbWVQaWNrZXJDbG9jaydcblxuLy8gTWl4aW5zXG5pbXBvcnQgUGlja2VyIGZyb20gJy4uLy4uL21peGlucy9waWNrZXInXG5pbXBvcnQgUGlja2VyQnV0dG9uIGZyb20gJy4uLy4uL21peGlucy9waWNrZXItYnV0dG9uJ1xuXG4vLyBVdGlsc1xuaW1wb3J0IHsgY3JlYXRlUmFuZ2UgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5pbXBvcnQgcGFkIGZyb20gJy4uL1ZEYXRlUGlja2VyL3V0aWwvcGFkJ1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcblxuLy8gVHlwZXNcbmltcG9ydCB7IFZOb2RlLCBQcm9wVHlwZSwgaCwgZGVmaW5lQ29tcG9uZW50IH0gZnJvbSAndnVlJ1xuaW1wb3J0IHsgU2VsZWN0aW5nVGltZXMgfSBmcm9tICcuL1NlbGVjdGluZ1RpbWVzJ1xuXG5jb25zdCByYW5nZUhvdXJzMjQgPSBjcmVhdGVSYW5nZSgyNClcbmNvbnN0IHJhbmdlSG91cnMxMmFtID0gY3JlYXRlUmFuZ2UoMTIpXG5jb25zdCByYW5nZUhvdXJzMTJwbSA9IHJhbmdlSG91cnMxMmFtLm1hcCh2ID0+IHYgKyAxMilcbmNvbnN0IHJhbmdlNjAgPSBjcmVhdGVSYW5nZSg2MClcbmNvbnN0IHNlbGVjdGluZ05hbWVzID0geyAxOiAnaG91cicsIDI6ICdtaW51dGUnLCAzOiAnc2Vjb25kJyB9XG5leHBvcnQgeyBTZWxlY3RpbmdUaW1lcyB9XG5cbnR5cGUgUGVyaW9kID0gJ2FtJyB8ICdwbSdcbnR5cGUgQWxsb3dGdW5jdGlvbiA9ICh2YWw6IG51bWJlcikgPT4gYm9vbGVhblxudHlwZSBBY3RpdmVQaWNrZXIgPSAnSE9VUicgfCAnTUlOVVRFJyB8ICdTRUNPTkQnXG5cbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcbiAgUGlja2VyLFxuICBQaWNrZXJCdXR0b25cbiAgLyogQHZ1ZS9jb21wb25lbnQgKi9cbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtdGltZS1waWNrZXInLFxuXG4gIHByb3BzOiB7XG4gICAgYWN0aXZlUGlja2VyOiBTdHJpbmcgYXMgUHJvcFR5cGU8QWN0aXZlUGlja2VyPixcbiAgICBhbGxvd2VkSG91cnM6IFtGdW5jdGlvbiwgQXJyYXldIGFzIFByb3BUeXBlPEFsbG93RnVuY3Rpb24gfCBudW1iZXJbXT4sXG4gICAgYWxsb3dlZE1pbnV0ZXM6IFtGdW5jdGlvbiwgQXJyYXldIGFzIFByb3BUeXBlPEFsbG93RnVuY3Rpb24gfCBudW1iZXJbXT4sXG4gICAgYWxsb3dlZFNlY29uZHM6IFtGdW5jdGlvbiwgQXJyYXldIGFzIFByb3BUeXBlPEFsbG93RnVuY3Rpb24gfCBudW1iZXJbXT4sXG4gICAgZGlzYWJsZWQ6IEJvb2xlYW4sXG4gICAgZm9ybWF0OiB7XG4gICAgICB0eXBlOiBTdHJpbmcgYXMgUHJvcFR5cGU8J2FtcG0nIHwgJzI0aHInPixcbiAgICAgIGRlZmF1bHQ6ICdhbXBtJyxcbiAgICAgIHZhbGlkYXRvciAodmFsOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIFsnYW1wbScsICcyNGhyJ10uaW5jbHVkZXModmFsKVxuICAgICAgfSxcbiAgICB9LFxuICAgIG1pbjogU3RyaW5nLFxuICAgIG1heDogU3RyaW5nLFxuICAgIHJlYWRvbmx5OiBCb29sZWFuLFxuICAgIHNjcm9sbGFibGU6IEJvb2xlYW4sXG4gICAgdXNlU2Vjb25kczogQm9vbGVhbixcbiAgICBtb2RlbFZhbHVlOiAobnVsbCBhcyBhbnkpIGFzIFByb3BUeXBlPGFueT4sXG4gICAgYW1wbUluVGl0bGU6IEJvb2xlYW4sXG4gIH0sXG4gIGVtaXRzOiBbXG4gICAgJ3VwZGF0ZTptb2RlbFZhbHVlJyxcbiAgICAnY2hhbmdlJyxcbiAgICAndXBkYXRlOmFjdGl2ZS1waWNrZXInLFxuICAgICd1cGRhdGU6cGVyaW9kJyxcbiAgICAnY2xpY2s6aG91cicsXG4gICAgJ2NsaWNrOm1pbnV0ZScsXG4gICAgJ2NsaWNrOnNlY29uZCcsXG4gIF0sXG4gIGRhdGEgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpbnB1dEhvdXI6IG51bGwgYXMgbnVtYmVyIHwgbnVsbCxcbiAgICAgIGlucHV0TWludXRlOiBudWxsIGFzIG51bWJlciB8IG51bGwsXG4gICAgICBpbnB1dFNlY29uZDogbnVsbCBhcyBudW1iZXIgfCBudWxsLFxuICAgICAgbGF6eUlucHV0SG91cjogbnVsbCBhcyBudW1iZXIgfCBudWxsLFxuICAgICAgbGF6eUlucHV0TWludXRlOiBudWxsIGFzIG51bWJlciB8IG51bGwsXG4gICAgICBsYXp5SW5wdXRTZWNvbmQ6IG51bGwgYXMgbnVtYmVyIHwgbnVsbCxcbiAgICAgIHBlcmlvZDogJ2FtJyBhcyBQZXJpb2QsXG4gICAgICBzZWxlY3Rpbmc6IFNlbGVjdGluZ1RpbWVzLkhvdXIsXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgc2VsZWN0aW5nSG91cjoge1xuICAgICAgZ2V0ICgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0aW5nID09PSBTZWxlY3RpbmdUaW1lcy5Ib3VyXG4gICAgICB9LFxuICAgICAgc2V0ICh2OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0aW5nID0gU2VsZWN0aW5nVGltZXMuSG91clxuICAgICAgfSxcbiAgICB9LFxuICAgIHNlbGVjdGluZ01pbnV0ZToge1xuICAgICAgZ2V0ICgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0aW5nID09PSBTZWxlY3RpbmdUaW1lcy5NaW51dGVcbiAgICAgIH0sXG4gICAgICBzZXQgKHY6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5zZWxlY3RpbmcgPSBTZWxlY3RpbmdUaW1lcy5NaW51dGVcbiAgICAgIH0sXG4gICAgfSxcbiAgICBzZWxlY3RpbmdTZWNvbmQ6IHtcbiAgICAgIGdldCAoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGluZyA9PT0gU2VsZWN0aW5nVGltZXMuU2Vjb25kXG4gICAgICB9LFxuICAgICAgc2V0ICh2OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0aW5nID0gU2VsZWN0aW5nVGltZXMuU2Vjb25kXG4gICAgICB9LFxuICAgIH0sXG4gICAgaXNBbGxvd2VkSG91ckNiICgpOiBBbGxvd0Z1bmN0aW9uIHtcbiAgICAgIGxldCBjYjogQWxsb3dGdW5jdGlvblxuXG4gICAgICBpZiAodGhpcy5hbGxvd2VkSG91cnMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICBjYiA9ICh2YWw6IG51bWJlcikgPT4gKHRoaXMuYWxsb3dlZEhvdXJzIGFzIG51bWJlcltdKS5pbmNsdWRlcyh2YWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYiA9IHRoaXMuYWxsb3dlZEhvdXJzXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5taW4gJiYgIXRoaXMubWF4KSByZXR1cm4gY2JcblxuICAgICAgY29uc3QgbWluSG91ciA9IHRoaXMubWluID8gTnVtYmVyKHRoaXMubWluLnNwbGl0KCc6JylbMF0pIDogMFxuICAgICAgY29uc3QgbWF4SG91ciA9IHRoaXMubWF4ID8gTnVtYmVyKHRoaXMubWF4LnNwbGl0KCc6JylbMF0pIDogMjNcblxuICAgICAgcmV0dXJuICh2YWw6IG51bWJlcikgPT4ge1xuICAgICAgICByZXR1cm4gdmFsID49IG1pbkhvdXIgKiAxICYmIHZhbCA8PSBtYXhIb3VyICogMSAmJiAoIWNiIHx8IGNiKHZhbCkpXG4gICAgICB9XG4gICAgfSxcbiAgICBpc0FsbG93ZWRNaW51dGVDYiAoKTogQWxsb3dGdW5jdGlvbiB7XG4gICAgICBsZXQgY2I6IEFsbG93RnVuY3Rpb25cblxuICAgICAgY29uc3QgaXNIb3VyQWxsb3dlZCA9XG4gICAgICAgICF0aGlzLmlzQWxsb3dlZEhvdXJDYiB8fFxuICAgICAgICB0aGlzLmlucHV0SG91ciA9PT0gbnVsbCB8fFxuICAgICAgICB0aGlzLmlzQWxsb3dlZEhvdXJDYih0aGlzLmlucHV0SG91cilcbiAgICAgIGlmICh0aGlzLmFsbG93ZWRNaW51dGVzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgY2IgPSAodmFsOiBudW1iZXIpID0+ICh0aGlzLmFsbG93ZWRNaW51dGVzIGFzIG51bWJlcltdKS5pbmNsdWRlcyh2YWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYiA9IHRoaXMuYWxsb3dlZE1pbnV0ZXNcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLm1pbiAmJiAhdGhpcy5tYXgpIHtcbiAgICAgICAgcmV0dXJuIGlzSG91ckFsbG93ZWQgPyBjYiA6ICgpID0+IGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IFttaW5Ib3VyLCBtaW5NaW51dGVdID0gdGhpcy5taW5cbiAgICAgICAgPyB0aGlzLm1pbi5zcGxpdCgnOicpLm1hcChOdW1iZXIpXG4gICAgICAgIDogWzAsIDBdXG4gICAgICBjb25zdCBbbWF4SG91ciwgbWF4TWludXRlXSA9IHRoaXMubWF4XG4gICAgICAgID8gdGhpcy5tYXguc3BsaXQoJzonKS5tYXAoTnVtYmVyKVxuICAgICAgICA6IFsyMywgNTldXG4gICAgICBjb25zdCBtaW5UaW1lID0gbWluSG91ciAqIDYwICsgbWluTWludXRlICogMVxuICAgICAgY29uc3QgbWF4VGltZSA9IG1heEhvdXIgKiA2MCArIG1heE1pbnV0ZSAqIDFcblxuICAgICAgcmV0dXJuICh2YWw6IG51bWJlcikgPT4ge1xuICAgICAgICBjb25zdCB0aW1lID0gNjAgKiB0aGlzLmlucHV0SG91ciEgKyB2YWxcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICB0aW1lID49IG1pblRpbWUgJiZcbiAgICAgICAgICB0aW1lIDw9IG1heFRpbWUgJiZcbiAgICAgICAgICBpc0hvdXJBbGxvd2VkICYmXG4gICAgICAgICAgKCFjYiB8fCBjYih2YWwpKVxuICAgICAgICApXG4gICAgICB9XG4gICAgfSxcbiAgICBpc0FsbG93ZWRTZWNvbmRDYiAoKTogQWxsb3dGdW5jdGlvbiB7XG4gICAgICBsZXQgY2I6IEFsbG93RnVuY3Rpb25cblxuICAgICAgY29uc3QgaXNIb3VyQWxsb3dlZCA9XG4gICAgICAgICF0aGlzLmlzQWxsb3dlZEhvdXJDYiB8fFxuICAgICAgICB0aGlzLmlucHV0SG91ciA9PT0gbnVsbCB8fFxuICAgICAgICB0aGlzLmlzQWxsb3dlZEhvdXJDYih0aGlzLmlucHV0SG91cilcbiAgICAgIGNvbnN0IGlzTWludXRlQWxsb3dlZCA9XG4gICAgICAgIGlzSG91ckFsbG93ZWQgJiZcbiAgICAgICAgKCF0aGlzLmlzQWxsb3dlZE1pbnV0ZUNiIHx8XG4gICAgICAgICAgdGhpcy5pbnB1dE1pbnV0ZSA9PT0gbnVsbCB8fFxuICAgICAgICAgIHRoaXMuaXNBbGxvd2VkTWludXRlQ2IodGhpcy5pbnB1dE1pbnV0ZSkpXG5cbiAgICAgIGlmICh0aGlzLmFsbG93ZWRTZWNvbmRzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgY2IgPSAodmFsOiBudW1iZXIpID0+ICh0aGlzLmFsbG93ZWRTZWNvbmRzIGFzIG51bWJlcltdKS5pbmNsdWRlcyh2YWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYiA9IHRoaXMuYWxsb3dlZFNlY29uZHNcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLm1pbiAmJiAhdGhpcy5tYXgpIHtcbiAgICAgICAgcmV0dXJuIGlzTWludXRlQWxsb3dlZCA/IGNiIDogKCkgPT4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgY29uc3QgW21pbkhvdXIsIG1pbk1pbnV0ZSwgbWluU2Vjb25kXSA9IHRoaXMubWluXG4gICAgICAgID8gdGhpcy5taW4uc3BsaXQoJzonKS5tYXAoTnVtYmVyKVxuICAgICAgICA6IFswLCAwLCAwXVxuICAgICAgY29uc3QgW21heEhvdXIsIG1heE1pbnV0ZSwgbWF4U2Vjb25kXSA9IHRoaXMubWF4XG4gICAgICAgID8gdGhpcy5tYXguc3BsaXQoJzonKS5tYXAoTnVtYmVyKVxuICAgICAgICA6IFsyMywgNTksIDU5XVxuICAgICAgY29uc3QgbWluVGltZSA9IG1pbkhvdXIgKiAzNjAwICsgbWluTWludXRlICogNjAgKyAobWluU2Vjb25kIHx8IDApICogMVxuICAgICAgY29uc3QgbWF4VGltZSA9IG1heEhvdXIgKiAzNjAwICsgbWF4TWludXRlICogNjAgKyAobWF4U2Vjb25kIHx8IDApICogMVxuXG4gICAgICByZXR1cm4gKHZhbDogbnVtYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IHRpbWUgPSAzNjAwICogdGhpcy5pbnB1dEhvdXIhICsgNjAgKiB0aGlzLmlucHV0TWludXRlISArIHZhbFxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIHRpbWUgPj0gbWluVGltZSAmJlxuICAgICAgICAgIHRpbWUgPD0gbWF4VGltZSAmJlxuICAgICAgICAgIGlzTWludXRlQWxsb3dlZCAmJlxuICAgICAgICAgICghY2IgfHwgY2IodmFsKSlcbiAgICAgICAgKVxuICAgICAgfVxuICAgIH0sXG4gICAgaXNBbVBtICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLmZvcm1hdCA9PT0gJ2FtcG0nXG4gICAgfSxcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIGFjdGl2ZVBpY2tlcjogJ3NldFBpY2tlcicsXG4gICAgc2VsZWN0aW5nOiAnZW1pdFBpY2tlcicsXG4gICAgbW9kZWxWYWx1ZToge1xuICAgICAgaGFuZGxlcjogJ3NldElucHV0RGF0YScsXG4gICAgICBpbW1lZGlhdGU6IGZhbHNlXG4gICAgfSxcbiAgfSxcblxuICBtb3VudGVkICgpIHtcbiAgICB0aGlzLnNldElucHV0RGF0YSh0aGlzLm1vZGVsVmFsdWUpXG4gICAgdGhpcy4kb24oJ3VwZGF0ZTpwZXJpb2QnLCB0aGlzLnNldFBlcmlvZClcbiAgfSxcblxuICBiZWZvcmVVbm1vdW50ICgpIHtcbiAgICB0aGlzLiRvZmYoJ3VwZGF0ZTpwZXJpb2QnLCB0aGlzLnNldFBlcmlvZClcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2VuVmFsdWUgKCkge1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzLmlucHV0SG91ciAhPSBudWxsICYmXG4gICAgICAgIHRoaXMuaW5wdXRNaW51dGUgIT0gbnVsbCAmJlxuICAgICAgICAoIXRoaXMudXNlU2Vjb25kcyB8fCB0aGlzLmlucHV0U2Vjb25kICE9IG51bGwpXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBgJHtwYWQodGhpcy5pbnB1dEhvdXIpfToke3BhZCh0aGlzLmlucHV0TWludXRlKX1gICtcbiAgICAgICAgICAodGhpcy51c2VTZWNvbmRzID8gYDoke3BhZCh0aGlzLmlucHV0U2Vjb25kISl9YCA6ICcnKVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsXG4gICAgfSxcbiAgICBlbWl0VmFsdWUgKCkge1xuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmdlblZhbHVlKClcbiAgICAgIGlmICh2YWx1ZSAhPT0gbnVsbCkgdGhpcy4kZW1pdCgndXBkYXRlOm1vZGVsVmFsdWUnLCB2YWx1ZSlcbiAgICB9LFxuICAgIGVtaXRQaWNrZXIgKHZhbHVlOiBTZWxlY3RpbmdUaW1lcykge1xuICAgICAgbGV0IGFjdGl2ZVBpY2tlciA9ICdIT1VSJ1xuICAgICAgaWYgKHZhbHVlID09PSBTZWxlY3RpbmdUaW1lcy5NaW51dGUpIHtcbiAgICAgICAgYWN0aXZlUGlja2VyID0gJ01JTlVURSdcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IFNlbGVjdGluZ1RpbWVzLlNlY29uZCkge1xuICAgICAgICBhY3RpdmVQaWNrZXIgPSAnU0VDT05EJ1xuICAgICAgfVxuICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOmFjdGl2ZS1waWNrZXInLCBhY3RpdmVQaWNrZXIpXG4gICAgfSxcbiAgICBzZXRQaWNrZXIgKHBpY2tlcjogQWN0aXZlUGlja2VyKSB7XG4gICAgICBpZiAocGlja2VyID09PSAnSE9VUicpIHRoaXMuc2VsZWN0aW5nID0gU2VsZWN0aW5nVGltZXMuSG91clxuICAgICAgZWxzZSBpZiAocGlja2VyID09PSAnTUlOVVRFJykgdGhpcy5zZWxlY3RpbmcgPSBTZWxlY3RpbmdUaW1lcy5NaW51dGVcbiAgICAgIGVsc2UgaWYgKHBpY2tlciA9PT0gJ1NFQ09ORCcgJiYgdGhpcy51c2VTZWNvbmRzKSB7IHRoaXMuc2VsZWN0aW5nID0gU2VsZWN0aW5nVGltZXMuU2Vjb25kIH1cbiAgICB9LFxuICAgIHNldFBlcmlvZCAocGVyaW9kOiBQZXJpb2QpIHtcbiAgICAgIHRoaXMucGVyaW9kID0gcGVyaW9kXG4gICAgICBpZiAodGhpcy5pbnB1dEhvdXIgIT0gbnVsbCkge1xuICAgICAgICBjb25zdCBuZXdIb3VyID0gdGhpcy5pbnB1dEhvdXIhICsgKHBlcmlvZCA9PT0gJ2FtJyA/IC0xMiA6IDEyKVxuICAgICAgICB0aGlzLmlucHV0SG91ciA9IHRoaXMuZmlyc3RBbGxvd2VkKCdob3VyJywgbmV3SG91cilcbiAgICAgICAgdGhpcy5lbWl0VmFsdWUoKVxuICAgICAgfVxuICAgIH0sXG4gICAgc2V0SW5wdXREYXRhICh2YWx1ZTogc3RyaW5nIHwgbnVsbCB8IERhdGUpIHtcbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09PSAnJykge1xuICAgICAgICB0aGlzLmlucHV0SG91ciA9IG51bGxcbiAgICAgICAgdGhpcy5pbnB1dE1pbnV0ZSA9IG51bGxcbiAgICAgICAgdGhpcy5pbnB1dFNlY29uZCA9IG51bGxcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIHRoaXMuaW5wdXRIb3VyID0gdmFsdWUuZ2V0SG91cnMoKVxuICAgICAgICB0aGlzLmlucHV0TWludXRlID0gdmFsdWUuZ2V0TWludXRlcygpXG4gICAgICAgIHRoaXMuaW5wdXRTZWNvbmQgPSB2YWx1ZS5nZXRTZWNvbmRzKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gdmFsdWVcbiAgICAgICAgICAudHJpbSgpXG4gICAgICAgICAgLm1hdGNoKC9eKFxcZCspOihcXGQrKSg6KFxcZCspKT9cXHMqKFthcF1tKT8kL2kpXG5cbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgY29uc3QgWywgaG91ciwgbWludXRlLCAsIHNlY29uZCwgcGVyaW9kXSA9IG1hdGNoXG4gICAgICAgICAgY29uc3Qgbm9ybWFsaXplZFBlcmlvZCA9IHBlcmlvZCA/IHBlcmlvZC50b0xvd2VyQ2FzZSgpIGFzIFBlcmlvZCA6IG51bGxcbiAgICAgICAgICB0aGlzLmlucHV0SG91ciA9IG5vcm1hbGl6ZWRQZXJpb2RcbiAgICAgICAgICAgID8gdGhpcy5jb252ZXJ0MTJ0bzI0KHBhcnNlSW50KGhvdXIsIDEwKSwgbm9ybWFsaXplZFBlcmlvZClcbiAgICAgICAgICAgIDogcGFyc2VJbnQoaG91ciwgMTApXG4gICAgICAgICAgdGhpcy5pbnB1dE1pbnV0ZSA9IHBhcnNlSW50KG1pbnV0ZSwgMTApXG4gICAgICAgICAgdGhpcy5pbnB1dFNlY29uZCA9IHBhcnNlSW50KHNlY29uZCB8fCAwLCAxMClcblxuICAgICAgICAgIC8vINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC8INC/0LXRgNC40L7QtCDRgtC+0LvRjNC60L4g0LXRgdC70Lgg0L7QvSDQsdGL0Lsg0YPQutCw0LfQsNC9INCyINGB0YLRgNC+0LrQtVxuICAgICAgICAgIGlmIChub3JtYWxpemVkUGVyaW9kKSB7XG4gICAgICAgICAgICB0aGlzLnBlcmlvZCA9IG5vcm1hbGl6ZWRQZXJpb2RcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW5wdXRIb3VyICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMucGVyaW9kID0gdGhpcy5pbnB1dEhvdXIgPCAxMiA/ICdhbScgOiAncG0nXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuaW5wdXRIb3VyID0gbnVsbFxuICAgICAgICAgIHRoaXMuaW5wdXRNaW51dGUgPSBudWxsXG4gICAgICAgICAgdGhpcy5pbnB1dFNlY29uZCA9IG51bGxcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyDQlNC70Y8gRGF0ZSDQvtCx0YrQtdC60YLQvtCyINGD0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC8INC/0LXRgNC40L7QtCDQvdCwINC+0YHQvdC+0LLQtSAyNC3Rh9Cw0YHQvtCy0L7Qs9C+INGE0L7RgNC80LDRgtCwXG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBEYXRlICYmIHRoaXMuaW5wdXRIb3VyICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5wZXJpb2QgPSB0aGlzLmlucHV0SG91ciA8IDEyID8gJ2FtJyA6ICdwbSdcbiAgICAgIH1cbiAgICB9LFxuICAgIGNvbnZlcnQyNHRvMTIgKGhvdXI6IG51bWJlcikge1xuICAgICAgcmV0dXJuIGhvdXIgPyAoKGhvdXIgLSAxKSAlIDEyKSArIDEgOiAxMlxuICAgIH0sXG4gICAgY29udmVydDEydG8yNCAoaG91cjogbnVtYmVyLCBwZXJpb2Q6IFBlcmlvZCkge1xuICAgICAgcmV0dXJuIChob3VyICUgMTIpICsgKHBlcmlvZCA9PT0gJ3BtJyA/IDEyIDogMClcbiAgICB9LFxuICAgIG9uSW5wdXQgKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGluZyA9PT0gU2VsZWN0aW5nVGltZXMuSG91cikge1xuICAgICAgICB0aGlzLmlucHV0SG91ciA9IHRoaXMuaXNBbVBtXG4gICAgICAgICAgPyB0aGlzLmNvbnZlcnQxMnRvMjQodmFsdWUsIHRoaXMucGVyaW9kKVxuICAgICAgICAgIDogdmFsdWVcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zZWxlY3RpbmcgPT09IFNlbGVjdGluZ1RpbWVzLk1pbnV0ZSkge1xuICAgICAgICB0aGlzLmlucHV0TWludXRlID0gdmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW5wdXRTZWNvbmQgPSB2YWx1ZVxuICAgICAgfVxuICAgICAgdGhpcy5lbWl0VmFsdWUoKVxuICAgIH0sXG4gICAgb25DaGFuZ2UgKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgIC8vINCh0L3QsNGH0LDQu9CwINC+0LHQvdC+0LLQu9GP0LXQvCDQt9C90LDRh9C10L3QuNC1INGH0LXRgNC10Lcgb25JbnB1dCAtINGN0YLQviDQutC70Y7Rh9C10LLQvtC5INC80L7QvNC10L3RgiFcbiAgICAgIHRoaXMub25JbnB1dCh2YWx1ZSlcblxuICAgICAgdGhpcy4kZW1pdChgY2xpY2s6JHtzZWxlY3RpbmdOYW1lc1t0aGlzLnNlbGVjdGluZ119YCwgdmFsdWUpXG5cbiAgICAgIGNvbnN0IGVtaXRDaGFuZ2UgPVxuICAgICAgICB0aGlzLnNlbGVjdGluZyA9PT1cbiAgICAgICAgKHRoaXMudXNlU2Vjb25kcyA/IFNlbGVjdGluZ1RpbWVzLlNlY29uZCA6IFNlbGVjdGluZ1RpbWVzLk1pbnV0ZSlcblxuICAgICAgaWYgKHRoaXMuc2VsZWN0aW5nID09PSBTZWxlY3RpbmdUaW1lcy5Ib3VyKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0aW5nID0gU2VsZWN0aW5nVGltZXMuTWludXRlXG4gICAgICB9IGVsc2UgaWYgKHRoaXMudXNlU2Vjb25kcyAmJiB0aGlzLnNlbGVjdGluZyA9PT0gU2VsZWN0aW5nVGltZXMuTWludXRlKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0aW5nID0gU2VsZWN0aW5nVGltZXMuU2Vjb25kXG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5pbnB1dEhvdXIgPT09IHRoaXMubGF6eUlucHV0SG91ciAmJlxuICAgICAgICB0aGlzLmlucHV0TWludXRlID09PSB0aGlzLmxhenlJbnB1dE1pbnV0ZSAmJlxuICAgICAgICAoIXRoaXMudXNlU2Vjb25kcyB8fCB0aGlzLmlucHV0U2Vjb25kID09PSB0aGlzLmxhenlJbnB1dFNlY29uZClcbiAgICAgICkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgdGltZSA9IHRoaXMuZ2VuVmFsdWUoKVxuICAgICAgaWYgKHRpbWUgPT09IG51bGwpIHJldHVyblxuXG4gICAgICB0aGlzLmxhenlJbnB1dEhvdXIgPSB0aGlzLmlucHV0SG91clxuICAgICAgdGhpcy5sYXp5SW5wdXRNaW51dGUgPSB0aGlzLmlucHV0TWludXRlXG4gICAgICB0aGlzLnVzZVNlY29uZHMgJiYgKHRoaXMubGF6eUlucHV0U2Vjb25kID0gdGhpcy5pbnB1dFNlY29uZClcblxuICAgICAgZW1pdENoYW5nZSAmJiB0aGlzLiRlbWl0KCdjaGFuZ2UnLCB0aW1lKVxuICAgIH0sXG4gICAgZmlyc3RBbGxvd2VkICh0eXBlOiAnaG91cicgfCAnbWludXRlJyB8ICdzZWNvbmQnLCB2YWx1ZTogbnVtYmVyKSB7XG4gICAgICBjb25zdCBhbGxvd2VkRm4gPVxuICAgICAgICB0eXBlID09PSAnaG91cidcbiAgICAgICAgICA/IHRoaXMuaXNBbGxvd2VkSG91ckNiXG4gICAgICAgICAgOiB0eXBlID09PSAnbWludXRlJ1xuICAgICAgICAgICAgPyB0aGlzLmlzQWxsb3dlZE1pbnV0ZUNiXG4gICAgICAgICAgICA6IHRoaXMuaXNBbGxvd2VkU2Vjb25kQ2JcbiAgICAgIGlmICghYWxsb3dlZEZuKSByZXR1cm4gdmFsdWVcblxuICAgICAgLy8gVE9ETzogY2xlYW4gdXBcbiAgICAgIGNvbnN0IHJhbmdlID1cbiAgICAgICAgdHlwZSA9PT0gJ21pbnV0ZSdcbiAgICAgICAgICA/IHJhbmdlNjBcbiAgICAgICAgICA6IHR5cGUgPT09ICdzZWNvbmQnXG4gICAgICAgICAgICA/IHJhbmdlNjBcbiAgICAgICAgICAgIDogdGhpcy5pc0FtUG1cbiAgICAgICAgICAgICAgPyB2YWx1ZSA8IDEyXG4gICAgICAgICAgICAgICAgPyByYW5nZUhvdXJzMTJhbVxuICAgICAgICAgICAgICAgIDogcmFuZ2VIb3VyczEycG1cbiAgICAgICAgICAgICAgOiByYW5nZUhvdXJzMjRcbiAgICAgIGNvbnN0IGZpcnN0ID0gcmFuZ2UuZmluZCh2ID0+XG4gICAgICAgIGFsbG93ZWRGbigoKHYgKyB2YWx1ZSkgJSByYW5nZS5sZW5ndGgpICsgcmFuZ2VbMF0pXG4gICAgICApXG4gICAgICByZXR1cm4gKCgoZmlyc3QgfHwgMCkgKyB2YWx1ZSkgJSByYW5nZS5sZW5ndGgpICsgcmFuZ2VbMF1cbiAgICB9LFxuICAgIGdlbkNsb2NrICgpIHtcbiAgICAgIHJldHVybiBoKFZUaW1lUGlja2VyQ2xvY2ssIHtcbiAgICAgICAgYWxsb3dlZFZhbHVlczpcbiAgICAgICAgICB0aGlzLnNlbGVjdGluZyA9PT0gU2VsZWN0aW5nVGltZXMuSG91clxuICAgICAgICAgICAgPyB0aGlzLmlzQWxsb3dlZEhvdXJDYlxuICAgICAgICAgICAgOiB0aGlzLnNlbGVjdGluZyA9PT0gU2VsZWN0aW5nVGltZXMuTWludXRlXG4gICAgICAgICAgICAgID8gdGhpcy5pc0FsbG93ZWRNaW51dGVDYlxuICAgICAgICAgICAgICA6IHRoaXMuaXNBbGxvd2VkU2Vjb25kQ2IsXG4gICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLFxuICAgICAgICBkYXJrOiB0aGlzLmRhcmssXG4gICAgICAgIGRpc2FibGVkOiB0aGlzLmRpc2FibGVkLFxuICAgICAgICBkb3VibGU6IHRoaXMuc2VsZWN0aW5nID09PSBTZWxlY3RpbmdUaW1lcy5Ib3VyICYmICF0aGlzLmlzQW1QbSxcbiAgICAgICAgZm9ybWF0OlxuICAgICAgICAgIHRoaXMuc2VsZWN0aW5nID09PSBTZWxlY3RpbmdUaW1lcy5Ib3VyXG4gICAgICAgICAgICA/IHRoaXMuaXNBbVBtXG4gICAgICAgICAgICAgID8gdGhpcy5jb252ZXJ0MjR0bzEyXG4gICAgICAgICAgICAgIDogKHZhbDogbnVtYmVyKSA9PiB2YWxcbiAgICAgICAgICAgIDogKHZhbDogbnVtYmVyKSA9PiBwYWQodmFsLCAyKSxcbiAgICAgICAgbGlnaHQ6IHRoaXMubGlnaHQsXG4gICAgICAgIG1heDpcbiAgICAgICAgICB0aGlzLnNlbGVjdGluZyA9PT0gU2VsZWN0aW5nVGltZXMuSG91clxuICAgICAgICAgICAgPyB0aGlzLmlzQW1QbSAmJiB0aGlzLnBlcmlvZCA9PT0gJ2FtJ1xuICAgICAgICAgICAgICA/IDExXG4gICAgICAgICAgICAgIDogMjNcbiAgICAgICAgICAgIDogNTksXG4gICAgICAgIG1pbjpcbiAgICAgICAgICB0aGlzLnNlbGVjdGluZyA9PT0gU2VsZWN0aW5nVGltZXMuSG91ciAmJlxuICAgICAgICAgIHRoaXMuaXNBbVBtICYmXG4gICAgICAgICAgdGhpcy5wZXJpb2QgPT09ICdwbSdcbiAgICAgICAgICAgID8gMTJcbiAgICAgICAgICAgIDogMCxcbiAgICAgICAgcmVhZG9ubHk6IHRoaXMucmVhZG9ubHksXG4gICAgICAgIHNjcm9sbGFibGU6IHRoaXMuc2Nyb2xsYWJsZSxcbiAgICAgICAgc2l6ZTpcbiAgICAgICAgICBOdW1iZXIodGhpcy53aWR0aCkgLSAoIXRoaXMuZnVsbFdpZHRoICYmIHRoaXMubGFuZHNjYXBlID8gODAgOiAyMCksXG4gICAgICAgIHN0ZXA6IHRoaXMuc2VsZWN0aW5nID09PSBTZWxlY3RpbmdUaW1lcy5Ib3VyID8gMSA6IDUsXG4gICAgICAgIG1vZGVsVmFsdWU6XG4gICAgICAgICAgdGhpcy5zZWxlY3RpbmcgPT09IFNlbGVjdGluZ1RpbWVzLkhvdXJcbiAgICAgICAgICAgID8gdGhpcy5pbnB1dEhvdXJcbiAgICAgICAgICAgIDogdGhpcy5zZWxlY3RpbmcgPT09IFNlbGVjdGluZ1RpbWVzLk1pbnV0ZVxuICAgICAgICAgICAgICA/IHRoaXMuaW5wdXRNaW51dGVcbiAgICAgICAgICAgICAgOiB0aGlzLmlucHV0U2Vjb25kLFxuICAgICAgICBvblVwZGF0ZU1vZGVsVmFsdWU6IHRoaXMub25JbnB1dCxcbiAgICAgICAgb25DaGFuZ2U6IHRoaXMub25DaGFuZ2UsXG4gICAgICAgIHJlZjogJ2Nsb2NrJyxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBnZW5DbG9ja0FtUG0gKCkge1xuICAgICAgcmV0dXJuIGgoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB0aGlzLnNldFRleHRDb2xvcih0aGlzLmNvbG9yIHx8ICdwcmltYXJ5Jywge1xuICAgICAgICAgIGNsYXNzOiAndi10aW1lLXBpY2tlci1jbG9ja19fYW1wbScsXG4gICAgICAgIH0pLFxuICAgICAgICBbXG4gICAgICAgICAgdGhpcy5nZW5QaWNrZXJCdXR0b24oXG4gICAgICAgICAgICAncGVyaW9kJyxcbiAgICAgICAgICAgICdhbScsXG4gICAgICAgICAgICB0aGlzLiR2dWV0aWZ5LmxhbmcudCgnJHZ1ZXRpZnkudGltZVBpY2tlci5hbScpLFxuICAgICAgICAgICAgdGhpcy5kaXNhYmxlZCB8fCB0aGlzLnJlYWRvbmx5XG4gICAgICAgICAgKSxcbiAgICAgICAgICB0aGlzLmdlblBpY2tlckJ1dHRvbihcbiAgICAgICAgICAgICdwZXJpb2QnLFxuICAgICAgICAgICAgJ3BtJyxcbiAgICAgICAgICAgIHRoaXMuJHZ1ZXRpZnkubGFuZy50KCckdnVldGlmeS50aW1lUGlja2VyLnBtJyksXG4gICAgICAgICAgICB0aGlzLmRpc2FibGVkIHx8IHRoaXMucmVhZG9ubHlcbiAgICAgICAgICApLFxuICAgICAgICBdXG4gICAgICApXG4gICAgfSxcbiAgICBnZW5QaWNrZXJCb2R5ICgpIHtcbiAgICAgIHJldHVybiBoKFxuICAgICAgICAnZGl2JyxcbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzOiAndi10aW1lLXBpY2tlci1jbG9ja19fY29udGFpbmVyJyxcbiAgICAgICAgICBrZXk6IHRoaXMuc2VsZWN0aW5nLFxuICAgICAgICB9LFxuICAgICAgICBbXG4gICAgICAgICAgIXRoaXMuYW1wbUluVGl0bGUgJiYgdGhpcy5pc0FtUG0gJiYgdGhpcy5nZW5DbG9ja0FtUG0oKSxcbiAgICAgICAgICB0aGlzLmdlbkNsb2NrKCksXG4gICAgICAgIF1cbiAgICAgIClcbiAgICB9LFxuICAgIGdlblBpY2tlclRpdGxlICgpIHtcbiAgICAgIHJldHVybiBoKFZUaW1lUGlja2VyVGl0bGUsIHtcbiAgICAgICAgYW1wbTogdGhpcy5pc0FtUG0sXG4gICAgICAgIGFtcG1SZWFkb25seTogdGhpcy5pc0FtUG0gJiYgIXRoaXMuYW1wbUluVGl0bGUsXG4gICAgICAgIGRpc2FibGVkOiB0aGlzLmRpc2FibGVkLFxuICAgICAgICBob3VyOiB0aGlzLmlucHV0SG91cixcbiAgICAgICAgbWludXRlOiB0aGlzLmlucHV0TWludXRlLFxuICAgICAgICBzZWNvbmQ6IHRoaXMuaW5wdXRTZWNvbmQsXG4gICAgICAgIHBlcmlvZDogdGhpcy5wZXJpb2QsXG4gICAgICAgIHJlYWRvbmx5OiB0aGlzLnJlYWRvbmx5LFxuICAgICAgICB1c2VTZWNvbmRzOiB0aGlzLnVzZVNlY29uZHMsXG4gICAgICAgIHNlbGVjdGluZzogdGhpcy5zZWxlY3RpbmcsXG4gICAgICAgICdvblVwZGF0ZTpzZWxlY3RpbmcnOiAodmFsdWU6IDEgfCAyIHwgMykgPT4ge1xuICAgICAgICAgIHRoaXMuc2VsZWN0aW5nID0gdmFsdWVcbiAgICAgICAgfSxcbiAgICAgICAgJ29uVXBkYXRlOnBlcmlvZCc6IChwZXJpb2Q6IHN0cmluZykgPT4ge1xuICAgICAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTpwZXJpb2QnLCBwZXJpb2QpXG4gICAgICAgIH0sXG4gICAgICAgIHJlZjogJ3RpdGxlJyxcbiAgICAgIH0pXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKCk6IFZOb2RlIHtcbiAgICByZXR1cm4gdGhpcy5nZW5QaWNrZXIoJ3YtcGlja2VyLS10aW1lJylcbiAgfSxcbn0pXG4iXX0=