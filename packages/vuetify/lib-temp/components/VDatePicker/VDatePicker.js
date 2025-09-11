// Components
import VDatePickerTitle from './VDatePickerTitle';
import VDatePickerHeader from './VDatePickerHeader';
import VDatePickerDateTable from './VDatePickerDateTable';
import VDatePickerMonthTable from './VDatePickerMonthTable';
import VDatePickerYears from './VDatePickerYears';
// Mixins
import Localable from '../../mixins/localable';
import Picker from '../../mixins/picker';
// Utils
import isDateAllowed from './util/isDateAllowed';
import mixins from '../../util/mixins';
import { wrapInArray } from '../../util/helpers';
import { daysInMonth } from '../VCalendar/util/timestamp';
import { consoleWarn } from '../../util/console';
import { createItemTypeListeners, createNativeLocaleFormatter, pad, sanitizeDateString, } from './util';
import { h } from 'vue';
export default mixins(Localable, Picker).extend({
    name: 'v-date-picker',
    props: {
        activePicker: String,
        allowedDates: Function,
        // Function formatting the day in date picker table
        dayFormat: Function,
        disabled: Boolean,
        events: {
            type: [Array, Function, Object],
            default: () => null,
        },
        eventColor: {
            type: [Array, Function, Object, String],
            default: () => 'warning',
        },
        firstDayOfWeek: {
            type: [String, Number],
            default: 0,
        },
        // Function formatting the tableDate in the day/month table header
        headerDateFormat: Function,
        localeFirstDayOfYear: {
            type: [String, Number],
            default: 0,
        },
        max: String,
        min: String,
        // Function formatting month in the months table
        monthFormat: Function,
        multiple: Boolean,
        nextIcon: {
            type: String,
            default: '$next',
        },
        nextMonthAriaLabel: {
            type: String,
            default: '$vuetify.datePicker.nextMonthAriaLabel',
        },
        nextYearAriaLabel: {
            type: String,
            default: '$vuetify.datePicker.nextYearAriaLabel',
        },
        pickerDate: String,
        prevIcon: {
            type: String,
            default: '$prev',
        },
        prevMonthAriaLabel: {
            type: String,
            default: '$vuetify.datePicker.prevMonthAriaLabel',
        },
        prevYearAriaLabel: {
            type: String,
            default: '$vuetify.datePicker.prevYearAriaLabel',
        },
        range: Boolean,
        reactive: Boolean,
        readonly: Boolean,
        scrollable: Boolean,
        showCurrent: {
            type: [Boolean, String],
            default: true,
        },
        selectedItemsText: {
            type: String,
            default: '$vuetify.datePicker.itemsSelected',
        },
        showAdjacentMonths: Boolean,
        showWeek: Boolean,
        // Function formatting currently selected date in the picker title
        titleDateFormat: Function,
        type: {
            type: String,
            default: 'date',
            validator: (type) => ['date', 'month'].includes(type), // TODO: year
        },
        modelValue: [Array, String],
        weekdayFormat: Function,
        // Function formatting the year in table header and pickup title
        yearFormat: Function,
        yearIcon: String,
    },
    data() {
        const now = new Date();
        return {
            internalActivePicker: this.type.toUpperCase(),
            inputDay: null,
            inputMonth: null,
            inputYear: null,
            isReversing: false,
            now,
            // tableDate is a string in 'YYYY' / 'YYYY-M' format (leading zero for month is not required)
            tableDate: (() => {
                if (this.pickerDate) {
                    return this.pickerDate;
                }
                const multipleValue = wrapInArray(this.modelValue);
                const date = multipleValue[multipleValue.length - 1] ||
                    (typeof this.showCurrent === 'string' ? this.showCurrent : `${now.getFullYear()}-${now.getMonth() + 1}`);
                return sanitizeDateString(date, this.type === 'date' ? 'month' : 'year');
            })(),
        };
    },
    computed: {
        multipleValue() {
            return wrapInArray(this.modelValue);
        },
        isMultiple() {
            return this.multiple || this.range;
        },
        lastValue() {
            return this.isMultiple ? this.multipleValue[this.multipleValue.length - 1] : this.modelValue;
        },
        selectedMonths() {
            if (!this.modelValue || this.type === 'month') {
                return this.modelValue;
            }
            else if (this.isMultiple) {
                return this.multipleValue.map(val => val.substr(0, 7));
            }
            else {
                return this.modelValue.substr(0, 7);
            }
        },
        current() {
            if (this.showCurrent === true) {
                return sanitizeDateString(`${this.now.getFullYear()}-${this.now.getMonth() + 1}-${this.now.getDate()}`, this.type);
            }
            return this.showCurrent || null;
        },
        inputDate() {
            return this.type === 'date'
                ? `${this.inputYear}-${pad(this.inputMonth + 1)}-${pad(this.inputDay)}`
                : `${this.inputYear}-${pad(this.inputMonth + 1)}`;
        },
        tableMonth() {
            return Number((this.pickerDate || this.tableDate).split('-')[1]) - 1;
        },
        tableYear() {
            return Number((this.pickerDate || this.tableDate).split('-')[0]);
        },
        minMonth() {
            return this.min ? sanitizeDateString(this.min, 'month') : null;
        },
        maxMonth() {
            return this.max ? sanitizeDateString(this.max, 'month') : null;
        },
        minYear() {
            return this.min ? sanitizeDateString(this.min, 'year') : null;
        },
        maxYear() {
            return this.max ? sanitizeDateString(this.max, 'year') : null;
        },
        formatters() {
            return {
                year: this.yearFormat || createNativeLocaleFormatter(this.currentLocale, { year: 'numeric', timeZone: 'UTC' }, { length: 4 }),
                titleDate: this.titleDateFormat ||
                    (this.isMultiple ? this.defaultTitleMultipleDateFormatter : this.defaultTitleDateFormatter),
            };
        },
        defaultTitleMultipleDateFormatter() {
            return dates => {
                if (!dates.length) {
                    return '-';
                }
                if (dates.length === 1) {
                    return this.defaultTitleDateFormatter(dates[0]);
                }
                return this.$vuetify.lang.t(this.selectedItemsText, dates.length);
            };
        },
        defaultTitleDateFormatter() {
            const titleFormats = {
                year: { year: 'numeric', timeZone: 'UTC' },
                month: { month: 'long', timeZone: 'UTC' },
                date: { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' },
            };
            const titleDateFormatter = createNativeLocaleFormatter(this.currentLocale, titleFormats[this.type], {
                start: 0,
                length: { date: 10, month: 7, year: 4 }[this.type],
            });
            const landscapeFormatter = (date) => titleDateFormatter(date)
                .replace(/([^\d\s])([\d])/g, (match, nonDigit, digit) => `${nonDigit} ${digit}`)
                .replace(', ', ',<br>');
            return this.landscape ? landscapeFormatter : titleDateFormatter;
        },
    },
    watch: {
        internalActivePicker: {
            immediate: true,
            handler(val) {
                this.$emit('update:active-picker', val);
            },
        },
        activePicker(val) {
            this.internalActivePicker = val;
        },
        tableDate(val, prev) {
            // Make a ISO 8601 strings from val and prev for comparision, otherwise it will incorrectly
            // compare for example '2000-9' and '2000-10'
            const sanitizeType = this.type === 'month' ? 'year' : 'month';
            this.isReversing = sanitizeDateString(val, sanitizeType) < sanitizeDateString(prev, sanitizeType);
            this.$emit('update:picker-date', val);
        },
        pickerDate(val) {
            if (val) {
                this.tableDate = val;
            }
            else if (this.lastValue && this.type === 'date') {
                this.tableDate = sanitizeDateString(this.lastValue, 'month');
            }
            else if (this.lastValue && this.type === 'month') {
                this.tableDate = sanitizeDateString(this.lastValue, 'year');
            }
        },
        value(newValue, oldValue) {
            this.checkMultipleProp();
            this.setInputDate();
            if ((!this.isMultiple && this.modelValue && !this.pickerDate) ||
                (this.isMultiple && this.multipleValue.length && (!oldValue || !oldValue.length) && !this.pickerDate)) {
                this.tableDate = sanitizeDateString(this.inputDate, this.type === 'month' ? 'year' : 'month');
            }
        },
        type(type) {
            this.internalActivePicker = type.toUpperCase();
            if (this.modelValue && this.modelValue.length) {
                const output = this.multipleValue
                    .map((val) => sanitizeDateString(val, type))
                    .filter(this.isDateAllowed);
                this.$emit('update:modelValue', this.isMultiple ? output : output[0]);
            }
        },
    },
    created() {
        this.checkMultipleProp();
        if (this.pickerDate !== this.tableDate) {
            this.$emit('update:picker-date', this.tableDate);
        }
        this.setInputDate();
    },
    methods: {
        emitInput(newInput) {
            if (this.range) {
                if (this.multipleValue.length !== 1) {
                    this.$emit('update:modelValue', [newInput]);
                }
                else {
                    const output = [this.multipleValue[0], newInput];
                    this.$emit('update:modelValue', output);
                    this.$emit('change', output);
                }
                return;
            }
            const output = this.multiple
                ? (this.multipleValue.indexOf(newInput) === -1
                    ? this.multipleValue.concat([newInput])
                    : this.multipleValue.filter(x => x !== newInput))
                : newInput;
            this.$emit('update:modelValue', output);
            this.multiple || this.$emit('change', newInput);
        },
        checkMultipleProp() {
            if (this.modelValue == null)
                return;
            const valueType = this.modelValue.constructor.name;
            const expected = this.isMultiple ? 'Array' : 'String';
            if (valueType !== expected) {
                consoleWarn(`Value must be ${this.isMultiple ? 'an' : 'a'} ${expected}, got ${valueType}`, this);
            }
        },
        isDateAllowed(value) {
            return isDateAllowed(value, this.min, this.max, this.allowedDates);
        },
        yearClick(value) {
            this.inputYear = value;
            if (this.type === 'month') {
                this.tableDate = `${value}`;
            }
            else {
                this.tableDate = `${value}-${pad((this.tableMonth || 0) + 1)}`;
            }
            this.internalActivePicker = 'MONTH';
            if (this.reactive && !this.readonly && !this.isMultiple && this.isDateAllowed(this.inputDate)) {
                this.$emit('update:modelValue', this.inputDate);
            }
        },
        monthClick(value) {
            const [year, month] = value.split('-');
            this.inputYear = parseInt(year, 10);
            this.inputMonth = parseInt(month, 10) - 1;
            if (this.type === 'date') {
                if (this.inputDay) {
                    this.inputDay = Math.min(this.inputDay, daysInMonth(this.inputYear, this.inputMonth + 1));
                }
                this.tableDate = value;
                this.internalActivePicker = 'DATE';
                if (this.reactive && !this.readonly && !this.isMultiple && this.isDateAllowed(this.inputDate)) {
                    this.$emit('update:modelValue', this.inputDate);
                }
            }
            else {
                this.emitInput(this.inputDate);
            }
        },
        dateClick(value) {
            const [year, month, day] = value.split('-');
            this.inputYear = parseInt(year, 10);
            this.inputMonth = parseInt(month, 10) - 1;
            this.inputDay = parseInt(day, 10);
            this.emitInput(this.inputDate);
        },
        genPickerTitle() {
            return h(VDatePickerTitle, {
                date: this.modelValue ? this.formatters.titleDate(this.isMultiple ? this.multipleValue : this.modelValue) : '',
                disabled: this.disabled,
                readonly: this.readonly,
                selectingYear: this.internalActivePicker === 'YEAR',
                year: this.formatters.year(this.multipleValue.length ? `${this.inputYear}` : this.tableDate),
                yearIcon: this.yearIcon,
                modelValue: this.multipleValue[0],
                onUpdateSelectingYear: (value) => this.internalActivePicker = value ? 'YEAR' : this.type.toUpperCase(),
            });
        },
        genTableHeader() {
            return h(VDatePickerHeader, {
                nextIcon: this.nextIcon,
                color: this.color,
                dark: this.dark,
                disabled: this.disabled,
                format: this.headerDateFormat,
                light: this.light,
                locale: this.locale,
                min: this.internalActivePicker === 'DATE' ? this.minMonth : this.minYear,
                max: this.internalActivePicker === 'DATE' ? this.maxMonth : this.maxYear,
                nextAriaLabel: this.internalActivePicker === 'DATE' ? this.nextMonthAriaLabel : this.nextYearAriaLabel,
                prevAriaLabel: this.internalActivePicker === 'DATE' ? this.prevMonthAriaLabel : this.prevYearAriaLabel,
                prevIcon: this.prevIcon,
                readonly: this.readonly,
                modelValue: this.internalActivePicker === 'DATE' ? `${pad(this.tableYear, 4)}-${pad(this.tableMonth + 1)}` : `${pad(this.tableYear, 4)}`,
                onToggle: () => this.internalActivePicker = (this.internalActivePicker === 'DATE' ? 'MONTH' : 'YEAR'),
                'onUpdate:modelValue': (value) => this.tableDate = value,
            });
        },
        genDateTable() {
            return h(VDatePickerDateTable, {
                allowedDates: this.allowedDates,
                color: this.color,
                current: this.current,
                dark: this.dark,
                disabled: this.disabled,
                events: this.events,
                eventColor: this.eventColor,
                firstDayOfWeek: this.firstDayOfWeek,
                format: this.dayFormat,
                light: this.light,
                locale: this.locale,
                localeFirstDayOfYear: this.localeFirstDayOfYear,
                min: this.min,
                max: this.max,
                range: this.range,
                readonly: this.readonly,
                scrollable: this.scrollable,
                showAdjacentMonths: this.showAdjacentMonths,
                showWeek: this.showWeek,
                tableDate: `${pad(this.tableYear, 4)}-${pad(this.tableMonth + 1)}`,
                modelValue: this.modelValue,
                weekdayFormat: this.weekdayFormat,
                ref: 'table',
                'onUpdate:modelValue': this.dateClick,
                'onUpdate:table-date': (value) => this.tableDate = value,
                ...createItemTypeListeners(this, ':date'),
            });
        },
        genMonthTable() {
            return h(VDatePickerMonthTable, {
                allowedDates: this.type === 'month' ? this.allowedDates : null,
                color: this.color,
                current: this.current ? sanitizeDateString(this.current, 'month') : null,
                dark: this.dark,
                disabled: this.disabled,
                events: this.type === 'month' ? this.events : null,
                eventColor: this.type === 'month' ? this.eventColor : null,
                format: this.monthFormat,
                light: this.light,
                locale: this.locale,
                min: this.minMonth,
                max: this.maxMonth,
                range: this.range,
                readonly: this.readonly && this.type === 'month',
                scrollable: this.scrollable,
                modelValue: this.selectedMonths,
                tableDate: `${pad(this.tableYear, 4)}`,
                ref: 'table',
                'onUpdate:modelValue': this.monthClick,
                'onUpdate:table-date': (value) => this.tableDate = value,
                ...createItemTypeListeners(this, ':month'),
            });
        },
        genYears() {
            return h(VDatePickerYears, {
                color: this.color,
                format: this.yearFormat,
                locale: this.locale,
                min: this.minYear,
                max: this.maxYear,
                modelValue: this.tableYear,
                'onUpdate:modelValue': this.yearClick,
                ...createItemTypeListeners(this, ':year'),
            });
        },
        genPickerBody() {
            const children = this.internalActivePicker === 'YEAR' ? [
                this.genYears(),
            ] : [
                this.genTableHeader(),
                this.internalActivePicker === 'DATE' ? this.genDateTable() : this.genMonthTable(),
            ];
            return h('div', {
                key: this.internalActivePicker,
            }, children);
        },
        setInputDate() {
            if (this.lastValue) {
                const array = this.lastValue.split('-');
                this.inputYear = parseInt(array[0], 10);
                this.inputMonth = parseInt(array[1], 10) - 1;
                if (this.type === 'date') {
                    this.inputDay = parseInt(array[2], 10);
                }
            }
            else {
                this.inputYear = this.inputYear || this.now.getFullYear();
                this.inputMonth = this.inputMonth == null ? this.inputMonth : this.now.getMonth();
                this.inputDay = this.inputDay || this.now.getDate();
            }
        },
    },
    render() {
        return this.genPicker('v-picker--date');
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRhdGVQaWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WRGF0ZVBpY2tlci9WRGF0ZVBpY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhO0FBQ2IsT0FBTyxnQkFBZ0IsTUFBTSxvQkFBb0IsQ0FBQTtBQUNqRCxPQUFPLGlCQUFpQixNQUFNLHFCQUFxQixDQUFBO0FBQ25ELE9BQU8sb0JBQW9CLE1BQU0sd0JBQXdCLENBQUE7QUFDekQsT0FBTyxxQkFBcUIsTUFBTSx5QkFBeUIsQ0FBQTtBQUMzRCxPQUFPLGdCQUFnQixNQUFNLG9CQUFvQixDQUFBO0FBRWpELFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLE1BQU0sTUFBTSxxQkFBcUIsQ0FBQTtBQUV4QyxRQUFRO0FBQ1IsT0FBTyxhQUFhLE1BQU0sc0JBQXNCLENBQUE7QUFDaEQsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFDdEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQTtBQUN6RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDaEQsT0FBTyxFQUNMLHVCQUF1QixFQUN2QiwyQkFBMkIsRUFDM0IsR0FBRyxFQUNILGtCQUFrQixHQUNuQixNQUFNLFFBQVEsQ0FBQTtBQU9mLE9BQU8sRUFBUyxDQUFDLEVBQUUsTUFBTSxLQUFLLENBQUE7QUFrQjlCLGVBQWUsTUFBTSxDQUNuQixTQUFTLEVBQ1QsTUFBTSxDQUVQLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLGVBQWU7SUFFckIsS0FBSyxFQUFFO1FBQ0wsWUFBWSxFQUFFLE1BQWdDO1FBQzlDLFlBQVksRUFBRSxRQUFnRTtRQUM5RSxtREFBbUQ7UUFDbkQsU0FBUyxFQUFFLFFBQWdFO1FB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LENBQUMsT0FBTyxFQUFFLENBQUE7YUFDcEQ7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxNQUFNO1FBQ0osT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUE7SUFDekMsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvbXBvbmVudHNcbmltcG9ydCBWRGF0ZVBpY2tlclRpdGxlIGZyb20gJy4vVkRhdGVQaWNrZXJUaXRsZSdcbmltcG9ydCBWRGF0ZVBpY2tlckhlYWRlciBmcm9tICcuL1ZEYXRlUGlja2VySGVhZGVyJ1xuaW1wb3J0IFZEYXRlUGlja2VyRGF0ZVRhYmxlIGZyb20gJy4vVkRhdGVQaWNrZXJEYXRlVGFibGUnXG5pbXBvcnQgVkRhdGVQaWNrZXJNb250aFRhYmxlIGZyb20gJy4vVkRhdGVQaWNrZXJNb250aFRhYmxlJ1xuaW1wb3J0IFZEYXRlUGlja2VyWWVhcnMgZnJvbSAnLi9WRGF0ZVBpY2tlclllYXJzJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBMb2NhbGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2xvY2FsYWJsZSdcbmltcG9ydCBQaWNrZXIgZnJvbSAnLi4vLi4vbWl4aW5zL3BpY2tlcidcblxuLy8gVXRpbHNcbmltcG9ydCBpc0RhdGVBbGxvd2VkIGZyb20gJy4vdXRpbC9pc0RhdGVBbGxvd2VkJ1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IHdyYXBJbkFycmF5IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IHsgZGF5c0luTW9udGggfSBmcm9tICcuLi9WQ2FsZW5kYXIvdXRpbC90aW1lc3RhbXAnXG5pbXBvcnQgeyBjb25zb2xlV2FybiB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcbmltcG9ydCB7XG4gIGNyZWF0ZUl0ZW1UeXBlTGlzdGVuZXJzLFxuICBjcmVhdGVOYXRpdmVMb2NhbGVGb3JtYXR0ZXIsXG4gIHBhZCxcbiAgc2FuaXRpemVEYXRlU3RyaW5nLFxufSBmcm9tICcuL3V0aWwnXG5cbi8vIFR5cGVzXG5pbXBvcnQge1xuICBQcm9wVHlwZSxcbiAgUHJvcFZhbGlkYXRvcixcbn0gZnJvbSAndnVlL3R5cGVzL29wdGlvbnMnXG5pbXBvcnQgeyBWTm9kZSwgaCB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7XG4gIERhdGVQaWNrZXJGb3JtYXR0ZXIsXG4gIERhdGVQaWNrZXJNdWx0aXBsZUZvcm1hdHRlcixcbiAgRGF0ZVBpY2tlckFsbG93ZWREYXRlc0Z1bmN0aW9uLFxuICBEYXRlUGlja2VyRXZlbnRDb2xvcnMsXG4gIERhdGVQaWNrZXJFdmVudHMsXG4gIERhdGVQaWNrZXJUeXBlLFxufSBmcm9tICd2dWV0aWZ5L3R5cGVzJ1xuXG50eXBlIERhdGVQaWNrZXJWYWx1ZSA9IHN0cmluZyB8IHN0cmluZ1tdIHwgdW5kZWZpbmVkXG5pbnRlcmZhY2UgRm9ybWF0dGVycyB7XG4gIHllYXI6IERhdGVQaWNrZXJGb3JtYXR0ZXJcbiAgdGl0bGVEYXRlOiBEYXRlUGlja2VyRm9ybWF0dGVyIHwgRGF0ZVBpY2tlck11bHRpcGxlRm9ybWF0dGVyXG59XG5cbnR5cGUgQWN0aXZlUGlja2VyID0gJ0RBVEUnIHwgJ01PTlRIJyB8ICdZRUFSJztcblxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxuICBMb2NhbGFibGUsXG4gIFBpY2tlcixcbi8qIEB2dWUvY29tcG9uZW50ICovXG4pLmV4dGVuZCh7XG4gIG5hbWU6ICd2LWRhdGUtcGlja2VyJyxcblxuICBwcm9wczoge1xuICAgIGFjdGl2ZVBpY2tlcjogU3RyaW5nIGFzIFByb3BUeXBlPEFjdGl2ZVBpY2tlcj4sXG4gICAgYWxsb3dlZERhdGVzOiBGdW5jdGlvbiBhcyBQcm9wVHlwZTxEYXRlUGlja2VyQWxsb3dlZERhdGVzRnVuY3Rpb24gfCB1bmRlZmluZWQ+LFxuICAgIC8vIEZ1bmN0aW9uIGZvcm1hdHRpbmcgdGhlIGRheSBpbiBkYXRlIHBpY2tlciB0YWJsZVxuICAgIGRheUZvcm1hdDogRnVuY3Rpb24gYXMgUHJvcFR5cGU8RGF0ZVBpY2tlckFsbG93ZWREYXRlc0Z1bmN0aW9uIHwgdW5kZWZpbmVkPixcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcbiAgICBldmVudHM6IHtcbiAgICAgIHR5cGU6IFtBcnJheSwgRnVuY3Rpb24sIE9iamVjdF0sXG4gICAgICBkZWZhdWx0OiAoKSA9PiBudWxsLFxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjxEYXRlUGlja2VyRXZlbnRzIHwgbnVsbD4sXG4gICAgZXZlbnRDb2xvcjoge1xuICAgICAgdHlwZTogW0FycmF5LCBGdW5jdGlvbiwgT2JqZWN0LCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogKCkgPT4gJ3dhcm5pbmcnLFxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjxEYXRlUGlja2VyRXZlbnRDb2xvcnM+LFxuICAgIGZpcnN0RGF5T2ZXZWVrOiB7XG4gICAgICB0eXBlOiBbU3RyaW5nLCBOdW1iZXJdLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIC8vIEZ1bmN0aW9uIGZvcm1hdHRpbmcgdGhlIHRhYmxlRGF0ZSBpbiB0aGUgZGF5L21vbnRoIHRhYmxlIGhlYWRlclxuICAgIGhlYWRlckRhdGVGb3JtYXQ6IEZ1bmN0aW9uIGFzIFByb3BUeXBlPERhdGVQaWNrZXJGb3JtYXR0ZXIgfCB1bmRlZmluZWQ+LFxuICAgIGxvY2FsZUZpcnN0RGF5T2ZZZWFyOiB7XG4gICAgICB0eXBlOiBbU3RyaW5nLCBOdW1iZXJdLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIG1heDogU3RyaW5nLFxuICAgIG1pbjogU3RyaW5nLFxuICAgIC8vIEZ1bmN0aW9uIGZvcm1hdHRpbmcgbW9udGggaW4gdGhlIG1vbnRocyB0YWJsZVxuICAgIG1vbnRoRm9ybWF0OiBGdW5jdGlvbiBhcyBQcm9wVHlwZTxEYXRlUGlja2VyRm9ybWF0dGVyIHwgdW5kZWZpbmVkPixcbiAgICBtdWx0aXBsZTogQm9vbGVhbixcbiAgICBuZXh0SWNvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyRuZXh0JyxcbiAgICB9LFxuICAgIG5leHRNb250aEFyaWFMYWJlbDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5LmRhdGVQaWNrZXIubmV4dE1vbnRoQXJpYUxhYmVsJyxcbiAgICB9LFxuICAgIG5leHRZZWFyQXJpYUxhYmVsOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkuZGF0ZVBpY2tlci5uZXh0WWVhckFyaWFMYWJlbCcsXG4gICAgfSxcbiAgICBwaWNrZXJEYXRlOiBTdHJpbmcsXG4gICAgcHJldkljb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckcHJldicsXG4gICAgfSxcbiAgICBwcmV2TW9udGhBcmlhTGFiZWw6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckdnVldGlmeS5kYXRlUGlja2VyLnByZXZNb250aEFyaWFMYWJlbCcsXG4gICAgfSxcbiAgICBwcmV2WWVhckFyaWFMYWJlbDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5LmRhdGVQaWNrZXIucHJldlllYXJBcmlhTGFiZWwnLFxuICAgIH0sXG4gICAgcmFuZ2U6IEJvb2xlYW4sXG4gICAgcmVhY3RpdmU6IEJvb2xlYW4sXG4gICAgcmVhZG9ubHk6IEJvb2xlYW4sXG4gICAgc2Nyb2xsYWJsZTogQm9vbGVhbixcbiAgICBzaG93Q3VycmVudDoge1xuICAgICAgdHlwZTogW0Jvb2xlYW4sIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgIH0sXG4gICAgc2VsZWN0ZWRJdGVtc1RleHQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckdnVldGlmeS5kYXRlUGlja2VyLml0ZW1zU2VsZWN0ZWQnLFxuICAgIH0sXG4gICAgc2hvd0FkamFjZW50TW9udGhzOiBCb29sZWFuLFxuICAgIHNob3dXZWVrOiBCb29sZWFuLFxuICAgIC8vIEZ1bmN0aW9uIGZvcm1hdHRpbmcgY3VycmVudGx5IHNlbGVjdGVkIGRhdGUgaW4gdGhlIHBpY2tlciB0aXRsZVxuICAgIHRpdGxlRGF0ZUZvcm1hdDogRnVuY3Rpb24gYXMgUHJvcFR5cGU8RGF0ZVBpY2tlckZvcm1hdHRlciB8IERhdGVQaWNrZXJNdWx0aXBsZUZvcm1hdHRlciB8IHVuZGVmaW5lZD4sXG4gICAgdHlwZToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ2RhdGUnLFxuICAgICAgdmFsaWRhdG9yOiAodHlwZTogYW55KSA9PiBbJ2RhdGUnLCAnbW9udGgnXS5pbmNsdWRlcyh0eXBlKSwgLy8gVE9ETzogeWVhclxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjxEYXRlUGlja2VyVHlwZT4sXG4gICAgbW9kZWxWYWx1ZTogW0FycmF5LCBTdHJpbmddIGFzIFByb3BUeXBlPERhdGVQaWNrZXJWYWx1ZT4sXG4gICAgd2Vla2RheUZvcm1hdDogRnVuY3Rpb24gYXMgUHJvcFR5cGU8RGF0ZVBpY2tlckZvcm1hdHRlciB8IHVuZGVmaW5lZD4sXG4gICAgLy8gRnVuY3Rpb24gZm9ybWF0dGluZyB0aGUgeWVhciBpbiB0YWJsZSBoZWFkZXIgYW5kIHBpY2t1cCB0aXRsZVxuICAgIHllYXJGb3JtYXQ6IEZ1bmN0aW9uIGFzIFByb3BUeXBlPERhdGVQaWNrZXJGb3JtYXR0ZXIgfCB1bmRlZmluZWQ+LFxuICAgIHllYXJJY29uOiBTdHJpbmcsXG4gIH0sXG5cbiAgZGF0YSAoKSB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKVxuICAgIHJldHVybiB7XG4gICAgICBpbnRlcm5hbEFjdGl2ZVBpY2tlcjogdGhpcy50eXBlLnRvVXBwZXJDYXNlKCksXG4gICAgICBpbnB1dERheTogbnVsbCBhcyBudW1iZXIgfCBudWxsLFxuICAgICAgaW5wdXRNb250aDogbnVsbCBhcyBudW1iZXIgfCBudWxsLFxuICAgICAgaW5wdXRZZWFyOiBudWxsIGFzIG51bWJlciB8IG51bGwsXG4gICAgICBpc1JldmVyc2luZzogZmFsc2UsXG4gICAgICBub3csXG4gICAgICAvLyB0YWJsZURhdGUgaXMgYSBzdHJpbmcgaW4gJ1lZWVknIC8gJ1lZWVktTScgZm9ybWF0IChsZWFkaW5nIHplcm8gZm9yIG1vbnRoIGlzIG5vdCByZXF1aXJlZClcbiAgICAgIHRhYmxlRGF0ZTogKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMucGlja2VyRGF0ZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnBpY2tlckRhdGVcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG11bHRpcGxlVmFsdWUgPSB3cmFwSW5BcnJheSh0aGlzLm1vZGVsVmFsdWUpXG4gICAgICAgIGNvbnN0IGRhdGUgPSBtdWx0aXBsZVZhbHVlW211bHRpcGxlVmFsdWUubGVuZ3RoIC0gMV0gfHxcbiAgICAgICAgICAodHlwZW9mIHRoaXMuc2hvd0N1cnJlbnQgPT09ICdzdHJpbmcnID8gdGhpcy5zaG93Q3VycmVudCA6IGAke25vdy5nZXRGdWxsWWVhcigpfS0ke25vdy5nZXRNb250aCgpICsgMX1gKVxuICAgICAgICByZXR1cm4gc2FuaXRpemVEYXRlU3RyaW5nKGRhdGUgYXMgc3RyaW5nLCB0aGlzLnR5cGUgPT09ICdkYXRlJyA/ICdtb250aCcgOiAneWVhcicpXG4gICAgICB9KSgpLFxuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIG11bHRpcGxlVmFsdWUgKCk6IHN0cmluZ1tdIHtcbiAgICAgIHJldHVybiB3cmFwSW5BcnJheSh0aGlzLm1vZGVsVmFsdWUpXG4gICAgfSxcbiAgICBpc011bHRpcGxlICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLm11bHRpcGxlIHx8IHRoaXMucmFuZ2VcbiAgICB9LFxuICAgIGxhc3RWYWx1ZSAoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgICByZXR1cm4gdGhpcy5pc011bHRpcGxlID8gdGhpcy5tdWx0aXBsZVZhbHVlW3RoaXMubXVsdGlwbGVWYWx1ZS5sZW5ndGggLSAxXSA6ICh0aGlzLm1vZGVsVmFsdWUgYXMgc3RyaW5nIHwgbnVsbClcbiAgICB9LFxuICAgIHNlbGVjdGVkTW9udGhzICgpOiBzdHJpbmcgfCBzdHJpbmdbXSB8IHVuZGVmaW5lZCB7XG4gICAgICBpZiAoIXRoaXMubW9kZWxWYWx1ZSB8fCB0aGlzLnR5cGUgPT09ICdtb250aCcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZWxWYWx1ZVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzTXVsdGlwbGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbGVWYWx1ZS5tYXAodmFsID0+IHZhbC5zdWJzdHIoMCwgNykpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gKHRoaXMubW9kZWxWYWx1ZSBhcyBzdHJpbmcpLnN1YnN0cigwLCA3KVxuICAgICAgfVxuICAgIH0sXG4gICAgY3VycmVudCAoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgICBpZiAodGhpcy5zaG93Q3VycmVudCA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gc2FuaXRpemVEYXRlU3RyaW5nKGAke3RoaXMubm93LmdldEZ1bGxZZWFyKCl9LSR7dGhpcy5ub3cuZ2V0TW9udGgoKSArIDF9LSR7dGhpcy5ub3cuZ2V0RGF0ZSgpfWAsIHRoaXMudHlwZSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuc2hvd0N1cnJlbnQgfHwgbnVsbFxuICAgIH0sXG4gICAgaW5wdXREYXRlICgpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gJ2RhdGUnXG4gICAgICAgID8gYCR7dGhpcy5pbnB1dFllYXJ9LSR7cGFkKHRoaXMuaW5wdXRNb250aCEgKyAxKX0tJHtwYWQodGhpcy5pbnB1dERheSEpfWBcbiAgICAgICAgOiBgJHt0aGlzLmlucHV0WWVhcn0tJHtwYWQodGhpcy5pbnB1dE1vbnRoISArIDEpfWBcbiAgICB9LFxuICAgIHRhYmxlTW9udGggKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gTnVtYmVyKCh0aGlzLnBpY2tlckRhdGUgfHwgdGhpcy50YWJsZURhdGUpLnNwbGl0KCctJylbMV0pIC0gMVxuICAgIH0sXG4gICAgdGFibGVZZWFyICgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIE51bWJlcigodGhpcy5waWNrZXJEYXRlIHx8IHRoaXMudGFibGVEYXRlKS5zcGxpdCgnLScpWzBdKVxuICAgIH0sXG4gICAgbWluTW9udGggKCk6IHN0cmluZyB8IG51bGwge1xuICAgICAgcmV0dXJuIHRoaXMubWluID8gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMubWluLCAnbW9udGgnKSA6IG51bGxcbiAgICB9LFxuICAgIG1heE1vbnRoICgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICAgIHJldHVybiB0aGlzLm1heCA/IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLm1heCwgJ21vbnRoJykgOiBudWxsXG4gICAgfSxcbiAgICBtaW5ZZWFyICgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICAgIHJldHVybiB0aGlzLm1pbiA/IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLm1pbiwgJ3llYXInKSA6IG51bGxcbiAgICB9LFxuICAgIG1heFllYXIgKCk6IHN0cmluZyB8IG51bGwge1xuICAgICAgcmV0dXJuIHRoaXMubWF4ID8gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMubWF4LCAneWVhcicpIDogbnVsbFxuICAgIH0sXG4gICAgZm9ybWF0dGVycyAoKTogRm9ybWF0dGVycyB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB5ZWFyOiB0aGlzLnllYXJGb3JtYXQgfHwgY3JlYXRlTmF0aXZlTG9jYWxlRm9ybWF0dGVyKHRoaXMuY3VycmVudExvY2FsZSwgeyB5ZWFyOiAnbnVtZXJpYycsIHRpbWVab25lOiAnVVRDJyB9LCB7IGxlbmd0aDogNCB9KSxcbiAgICAgICAgdGl0bGVEYXRlOiB0aGlzLnRpdGxlRGF0ZUZvcm1hdCB8fFxuICAgICAgICAgICh0aGlzLmlzTXVsdGlwbGUgPyB0aGlzLmRlZmF1bHRUaXRsZU11bHRpcGxlRGF0ZUZvcm1hdHRlciA6IHRoaXMuZGVmYXVsdFRpdGxlRGF0ZUZvcm1hdHRlciksXG4gICAgICB9XG4gICAgfSxcbiAgICBkZWZhdWx0VGl0bGVNdWx0aXBsZURhdGVGb3JtYXR0ZXIgKCk6IERhdGVQaWNrZXJNdWx0aXBsZUZvcm1hdHRlciB7XG4gICAgICByZXR1cm4gZGF0ZXMgPT4ge1xuICAgICAgICBpZiAoIWRhdGVzLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiAnLSdcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkYXRlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5kZWZhdWx0VGl0bGVEYXRlRm9ybWF0dGVyKGRhdGVzWzBdKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuJHZ1ZXRpZnkubGFuZy50KHRoaXMuc2VsZWN0ZWRJdGVtc1RleHQsIGRhdGVzLmxlbmd0aClcbiAgICAgIH1cbiAgICB9LFxuICAgIGRlZmF1bHRUaXRsZURhdGVGb3JtYXR0ZXIgKCk6IERhdGVQaWNrZXJGb3JtYXR0ZXIge1xuICAgICAgY29uc3QgdGl0bGVGb3JtYXRzID0ge1xuICAgICAgICB5ZWFyOiB7IHllYXI6ICdudW1lcmljJywgdGltZVpvbmU6ICdVVEMnIH0sXG4gICAgICAgIG1vbnRoOiB7IG1vbnRoOiAnbG9uZycsIHRpbWVab25lOiAnVVRDJyB9LFxuICAgICAgICBkYXRlOiB7IHdlZWtkYXk6ICdzaG9ydCcsIG1vbnRoOiAnc2hvcnQnLCBkYXk6ICdudW1lcmljJywgdGltZVpvbmU6ICdVVEMnIH0sXG4gICAgICB9IGFzIGNvbnN0XG5cbiAgICAgIGNvbnN0IHRpdGxlRGF0ZUZvcm1hdHRlciA9IGNyZWF0ZU5hdGl2ZUxvY2FsZUZvcm1hdHRlcih0aGlzLmN1cnJlbnRMb2NhbGUsIHRpdGxlRm9ybWF0c1t0aGlzLnR5cGVdLCB7XG4gICAgICAgIHN0YXJ0OiAwLFxuICAgICAgICBsZW5ndGg6IHsgZGF0ZTogMTAsIG1vbnRoOiA3LCB5ZWFyOiA0IH1bdGhpcy50eXBlXSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGxhbmRzY2FwZUZvcm1hdHRlciA9IChkYXRlOiBzdHJpbmcpID0+IHRpdGxlRGF0ZUZvcm1hdHRlcihkYXRlKVxuICAgICAgICAucmVwbGFjZSgvKFteXFxkXFxzXSkoW1xcZF0pL2csIChtYXRjaCwgbm9uRGlnaXQsIGRpZ2l0KSA9PiBgJHtub25EaWdpdH0gJHtkaWdpdH1gKVxuICAgICAgICAucmVwbGFjZSgnLCAnLCAnLDxicj4nKVxuXG4gICAgICByZXR1cm4gdGhpcy5sYW5kc2NhcGUgPyBsYW5kc2NhcGVGb3JtYXR0ZXIgOiB0aXRsZURhdGVGb3JtYXR0ZXJcbiAgICB9LFxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgaW50ZXJuYWxBY3RpdmVQaWNrZXI6IHtcbiAgICAgIGltbWVkaWF0ZTogdHJ1ZSxcbiAgICAgIGhhbmRsZXIgKHZhbDogQWN0aXZlUGlja2VyKSB7XG4gICAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTphY3RpdmUtcGlja2VyJywgdmFsKVxuICAgICAgfSxcbiAgICB9LFxuICAgIGFjdGl2ZVBpY2tlciAodmFsOiBBY3RpdmVQaWNrZXIpIHtcbiAgICAgIHRoaXMuaW50ZXJuYWxBY3RpdmVQaWNrZXIgPSB2YWxcbiAgICB9LFxuICAgIHRhYmxlRGF0ZSAodmFsOiBzdHJpbmcsIHByZXY6IHN0cmluZykge1xuICAgICAgLy8gTWFrZSBhIElTTyA4NjAxIHN0cmluZ3MgZnJvbSB2YWwgYW5kIHByZXYgZm9yIGNvbXBhcmlzaW9uLCBvdGhlcndpc2UgaXQgd2lsbCBpbmNvcnJlY3RseVxuICAgICAgLy8gY29tcGFyZSBmb3IgZXhhbXBsZSAnMjAwMC05JyBhbmQgJzIwMDAtMTAnXG4gICAgICBjb25zdCBzYW5pdGl6ZVR5cGUgPSB0aGlzLnR5cGUgPT09ICdtb250aCcgPyAneWVhcicgOiAnbW9udGgnXG4gICAgICB0aGlzLmlzUmV2ZXJzaW5nID0gc2FuaXRpemVEYXRlU3RyaW5nKHZhbCwgc2FuaXRpemVUeXBlKSA8IHNhbml0aXplRGF0ZVN0cmluZyhwcmV2LCBzYW5pdGl6ZVR5cGUpXG4gICAgICB0aGlzLiRlbWl0KCd1cGRhdGU6cGlja2VyLWRhdGUnLCB2YWwpXG4gICAgfSxcbiAgICBwaWNrZXJEYXRlICh2YWw6IHN0cmluZyB8IG51bGwpIHtcbiAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgdGhpcy50YWJsZURhdGUgPSB2YWxcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5sYXN0VmFsdWUgJiYgdGhpcy50eXBlID09PSAnZGF0ZScpIHtcbiAgICAgICAgdGhpcy50YWJsZURhdGUgPSBzYW5pdGl6ZURhdGVTdHJpbmcodGhpcy5sYXN0VmFsdWUsICdtb250aCcpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMubGFzdFZhbHVlICYmIHRoaXMudHlwZSA9PT0gJ21vbnRoJykge1xuICAgICAgICB0aGlzLnRhYmxlRGF0ZSA9IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLmxhc3RWYWx1ZSwgJ3llYXInKVxuICAgICAgfVxuICAgIH0sXG4gICAgdmFsdWUgKG5ld1ZhbHVlOiBEYXRlUGlja2VyVmFsdWUsIG9sZFZhbHVlOiBEYXRlUGlja2VyVmFsdWUpIHtcbiAgICAgIHRoaXMuY2hlY2tNdWx0aXBsZVByb3AoKVxuICAgICAgdGhpcy5zZXRJbnB1dERhdGUoKVxuXG4gICAgICBpZiAoXG4gICAgICAgICghdGhpcy5pc011bHRpcGxlICYmIHRoaXMubW9kZWxWYWx1ZSAmJiAhdGhpcy5waWNrZXJEYXRlKSB8fFxuICAgICAgICAodGhpcy5pc011bHRpcGxlICYmIHRoaXMubXVsdGlwbGVWYWx1ZS5sZW5ndGggJiYgKCFvbGRWYWx1ZSB8fCAhb2xkVmFsdWUubGVuZ3RoKSAmJiAhdGhpcy5waWNrZXJEYXRlKVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMudGFibGVEYXRlID0gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMuaW5wdXREYXRlLCB0aGlzLnR5cGUgPT09ICdtb250aCcgPyAneWVhcicgOiAnbW9udGgnKVxuICAgICAgfVxuICAgIH0sXG4gICAgdHlwZSAodHlwZTogRGF0ZVBpY2tlclR5cGUpIHtcbiAgICAgIHRoaXMuaW50ZXJuYWxBY3RpdmVQaWNrZXIgPSB0eXBlLnRvVXBwZXJDYXNlKClcblxuICAgICAgaWYgKHRoaXMubW9kZWxWYWx1ZSAmJiB0aGlzLm1vZGVsVmFsdWUubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IG91dHB1dCA9IHRoaXMubXVsdGlwbGVWYWx1ZVxuICAgICAgICAgIC5tYXAoKHZhbDogc3RyaW5nKSA9PiBzYW5pdGl6ZURhdGVTdHJpbmcodmFsLCB0eXBlKSlcbiAgICAgICAgICAuZmlsdGVyKHRoaXMuaXNEYXRlQWxsb3dlZClcbiAgICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOm1vZGVsVmFsdWUnLCB0aGlzLmlzTXVsdGlwbGUgPyBvdXRwdXQgOiBvdXRwdXRbMF0pXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICBjcmVhdGVkICgpIHtcbiAgICB0aGlzLmNoZWNrTXVsdGlwbGVQcm9wKClcblxuICAgIGlmICh0aGlzLnBpY2tlckRhdGUgIT09IHRoaXMudGFibGVEYXRlKSB7XG4gICAgICB0aGlzLiRlbWl0KCd1cGRhdGU6cGlja2VyLWRhdGUnLCB0aGlzLnRhYmxlRGF0ZSlcbiAgICB9XG4gICAgdGhpcy5zZXRJbnB1dERhdGUoKVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBlbWl0SW5wdXQgKG5ld0lucHV0OiBzdHJpbmcpIHtcbiAgICAgIGlmICh0aGlzLnJhbmdlKSB7XG4gICAgICAgIGlmICh0aGlzLm11bHRpcGxlVmFsdWUubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOm1vZGVsVmFsdWUnLCBbbmV3SW5wdXRdKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IG91dHB1dCA9IFt0aGlzLm11bHRpcGxlVmFsdWVbMF0sIG5ld0lucHV0XVxuICAgICAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTptb2RlbFZhbHVlJywgb3V0cHV0KVxuICAgICAgICAgIHRoaXMuJGVtaXQoJ2NoYW5nZScsIG91dHB1dClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3Qgb3V0cHV0ID0gdGhpcy5tdWx0aXBsZVxuICAgICAgICA/IChcbiAgICAgICAgICB0aGlzLm11bHRpcGxlVmFsdWUuaW5kZXhPZihuZXdJbnB1dCkgPT09IC0xXG4gICAgICAgICAgICA/IHRoaXMubXVsdGlwbGVWYWx1ZS5jb25jYXQoW25ld0lucHV0XSlcbiAgICAgICAgICAgIDogdGhpcy5tdWx0aXBsZVZhbHVlLmZpbHRlcih4ID0+IHggIT09IG5ld0lucHV0KVxuICAgICAgICApXG4gICAgICAgIDogbmV3SW5wdXRcblxuICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOm1vZGVsVmFsdWUnLCBvdXRwdXQpXG4gICAgICB0aGlzLm11bHRpcGxlIHx8IHRoaXMuJGVtaXQoJ2NoYW5nZScsIG5ld0lucHV0KVxuICAgIH0sXG4gICAgY2hlY2tNdWx0aXBsZVByb3AgKCkge1xuICAgICAgaWYgKHRoaXMubW9kZWxWYWx1ZSA9PSBudWxsKSByZXR1cm5cbiAgICAgIGNvbnN0IHZhbHVlVHlwZSA9IHRoaXMubW9kZWxWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lXG4gICAgICBjb25zdCBleHBlY3RlZCA9IHRoaXMuaXNNdWx0aXBsZSA/ICdBcnJheScgOiAnU3RyaW5nJ1xuICAgICAgaWYgKHZhbHVlVHlwZSAhPT0gZXhwZWN0ZWQpIHtcbiAgICAgICAgY29uc29sZVdhcm4oYFZhbHVlIG11c3QgYmUgJHt0aGlzLmlzTXVsdGlwbGUgPyAnYW4nIDogJ2EnfSAke2V4cGVjdGVkfSwgZ290ICR7dmFsdWVUeXBlfWAsIHRoaXMpXG4gICAgICB9XG4gICAgfSxcbiAgICBpc0RhdGVBbGxvd2VkICh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gaXNEYXRlQWxsb3dlZCh2YWx1ZSwgdGhpcy5taW4sIHRoaXMubWF4LCB0aGlzLmFsbG93ZWREYXRlcylcbiAgICB9LFxuICAgIHllYXJDbGljayAodmFsdWU6IG51bWJlcikge1xuICAgICAgdGhpcy5pbnB1dFllYXIgPSB2YWx1ZVxuICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ21vbnRoJykge1xuICAgICAgICB0aGlzLnRhYmxlRGF0ZSA9IGAke3ZhbHVlfWBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudGFibGVEYXRlID0gYCR7dmFsdWV9LSR7cGFkKCh0aGlzLnRhYmxlTW9udGggfHwgMCkgKyAxKX1gXG4gICAgICB9XG4gICAgICB0aGlzLmludGVybmFsQWN0aXZlUGlja2VyID0gJ01PTlRIJ1xuICAgICAgaWYgKHRoaXMucmVhY3RpdmUgJiYgIXRoaXMucmVhZG9ubHkgJiYgIXRoaXMuaXNNdWx0aXBsZSAmJiB0aGlzLmlzRGF0ZUFsbG93ZWQodGhpcy5pbnB1dERhdGUpKSB7XG4gICAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTptb2RlbFZhbHVlJywgdGhpcy5pbnB1dERhdGUpXG4gICAgICB9XG4gICAgfSxcbiAgICBtb250aENsaWNrICh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICBjb25zdCBbeWVhciwgbW9udGhdID0gdmFsdWUuc3BsaXQoJy0nKVxuXG4gICAgICB0aGlzLmlucHV0WWVhciA9IHBhcnNlSW50KHllYXIsIDEwKVxuICAgICAgdGhpcy5pbnB1dE1vbnRoID0gcGFyc2VJbnQobW9udGgsIDEwKSAtIDFcblxuICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ2RhdGUnKSB7XG4gICAgICAgIGlmICh0aGlzLmlucHV0RGF5KSB7XG4gICAgICAgICAgdGhpcy5pbnB1dERheSA9IE1hdGgubWluKHRoaXMuaW5wdXREYXksIGRheXNJbk1vbnRoKHRoaXMuaW5wdXRZZWFyLCB0aGlzLmlucHV0TW9udGggKyAxKSlcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGFibGVEYXRlID0gdmFsdWVcbiAgICAgICAgdGhpcy5pbnRlcm5hbEFjdGl2ZVBpY2tlciA9ICdEQVRFJ1xuICAgICAgICBpZiAodGhpcy5yZWFjdGl2ZSAmJiAhdGhpcy5yZWFkb25seSAmJiAhdGhpcy5pc011bHRpcGxlICYmIHRoaXMuaXNEYXRlQWxsb3dlZCh0aGlzLmlucHV0RGF0ZSkpIHtcbiAgICAgICAgICB0aGlzLiRlbWl0KCd1cGRhdGU6bW9kZWxWYWx1ZScsIHRoaXMuaW5wdXREYXRlKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVtaXRJbnB1dCh0aGlzLmlucHV0RGF0ZSlcbiAgICAgIH1cbiAgICB9LFxuICAgIGRhdGVDbGljayAodmFsdWU6IHN0cmluZykge1xuICAgICAgY29uc3QgW3llYXIsIG1vbnRoLCBkYXldID0gdmFsdWUuc3BsaXQoJy0nKVxuXG4gICAgICB0aGlzLmlucHV0WWVhciA9IHBhcnNlSW50KHllYXIsIDEwKVxuICAgICAgdGhpcy5pbnB1dE1vbnRoID0gcGFyc2VJbnQobW9udGgsIDEwKSAtIDFcbiAgICAgIHRoaXMuaW5wdXREYXkgPSBwYXJzZUludChkYXksIDEwKVxuXG4gICAgICB0aGlzLmVtaXRJbnB1dCh0aGlzLmlucHV0RGF0ZSlcbiAgICB9LFxuICAgIGdlblBpY2tlclRpdGxlICgpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gaChWRGF0ZVBpY2tlclRpdGxlLCB7XG4gICAgICAgIGRhdGU6IHRoaXMubW9kZWxWYWx1ZSA/ICh0aGlzLmZvcm1hdHRlcnMudGl0bGVEYXRlIGFzICh2YWx1ZTogYW55KSA9PiBzdHJpbmcpKHRoaXMuaXNNdWx0aXBsZSA/IHRoaXMubXVsdGlwbGVWYWx1ZSA6IHRoaXMubW9kZWxWYWx1ZSkgOiAnJyxcbiAgICAgICAgZGlzYWJsZWQ6IHRoaXMuZGlzYWJsZWQsXG4gICAgICAgIHJlYWRvbmx5OiB0aGlzLnJlYWRvbmx5LFxuICAgICAgICBzZWxlY3RpbmdZZWFyOiB0aGlzLmludGVybmFsQWN0aXZlUGlja2VyID09PSAnWUVBUicsXG4gICAgICAgIHllYXI6IHRoaXMuZm9ybWF0dGVycy55ZWFyKHRoaXMubXVsdGlwbGVWYWx1ZS5sZW5ndGggPyBgJHt0aGlzLmlucHV0WWVhcn1gIDogdGhpcy50YWJsZURhdGUpLFxuICAgICAgICB5ZWFySWNvbjogdGhpcy55ZWFySWNvbixcbiAgICAgICAgbW9kZWxWYWx1ZTogdGhpcy5tdWx0aXBsZVZhbHVlWzBdLFxuICAgICAgICBvblVwZGF0ZVNlbGVjdGluZ1llYXI6ICh2YWx1ZTogYm9vbGVhbikgPT4gdGhpcy5pbnRlcm5hbEFjdGl2ZVBpY2tlciA9IHZhbHVlID8gJ1lFQVInIDogdGhpcy50eXBlLnRvVXBwZXJDYXNlKCksXG4gICAgICB9KVxuICAgIH0sXG4gICAgZ2VuVGFibGVIZWFkZXIgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiBoKFZEYXRlUGlja2VySGVhZGVyLCB7XG4gICAgICAgIG5leHRJY29uOiB0aGlzLm5leHRJY29uLFxuICAgICAgICBjb2xvcjogdGhpcy5jb2xvcixcbiAgICAgICAgZGFyazogdGhpcy5kYXJrLFxuICAgICAgICBkaXNhYmxlZDogdGhpcy5kaXNhYmxlZCxcbiAgICAgICAgZm9ybWF0OiB0aGlzLmhlYWRlckRhdGVGb3JtYXQsXG4gICAgICAgIGxpZ2h0OiB0aGlzLmxpZ2h0LFxuICAgICAgICBsb2NhbGU6IHRoaXMubG9jYWxlLFxuICAgICAgICBtaW46IHRoaXMuaW50ZXJuYWxBY3RpdmVQaWNrZXIgPT09ICdEQVRFJyA/IHRoaXMubWluTW9udGggOiB0aGlzLm1pblllYXIsXG4gICAgICAgIG1heDogdGhpcy5pbnRlcm5hbEFjdGl2ZVBpY2tlciA9PT0gJ0RBVEUnID8gdGhpcy5tYXhNb250aCA6IHRoaXMubWF4WWVhcixcbiAgICAgICAgbmV4dEFyaWFMYWJlbDogdGhpcy5pbnRlcm5hbEFjdGl2ZVBpY2tlciA9PT0gJ0RBVEUnID8gdGhpcy5uZXh0TW9udGhBcmlhTGFiZWwgOiB0aGlzLm5leHRZZWFyQXJpYUxhYmVsLFxuICAgICAgICBwcmV2QXJpYUxhYmVsOiB0aGlzLmludGVybmFsQWN0aXZlUGlja2VyID09PSAnREFURScgPyB0aGlzLnByZXZNb250aEFyaWFMYWJlbCA6IHRoaXMucHJldlllYXJBcmlhTGFiZWwsXG4gICAgICAgIHByZXZJY29uOiB0aGlzLnByZXZJY29uLFxuICAgICAgICByZWFkb25seTogdGhpcy5yZWFkb25seSxcbiAgICAgICAgbW9kZWxWYWx1ZTogdGhpcy5pbnRlcm5hbEFjdGl2ZVBpY2tlciA9PT0gJ0RBVEUnID8gYCR7cGFkKHRoaXMudGFibGVZZWFyLCA0KX0tJHtwYWQodGhpcy50YWJsZU1vbnRoICsgMSl9YCA6IGAke3BhZCh0aGlzLnRhYmxlWWVhciwgNCl9YCxcbiAgICAgICAgb25Ub2dnbGU6ICgpID0+IHRoaXMuaW50ZXJuYWxBY3RpdmVQaWNrZXIgPSAodGhpcy5pbnRlcm5hbEFjdGl2ZVBpY2tlciA9PT0gJ0RBVEUnID8gJ01PTlRIJyA6ICdZRUFSJyksXG4gICAgICAgICdvblVwZGF0ZTptb2RlbFZhbHVlJzogKHZhbHVlOiBzdHJpbmcpID0+IHRoaXMudGFibGVEYXRlID0gdmFsdWUsXG4gICAgICB9KVxuICAgIH0sXG4gICAgZ2VuRGF0ZVRhYmxlICgpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gaChWRGF0ZVBpY2tlckRhdGVUYWJsZSwge1xuICAgICAgICBhbGxvd2VkRGF0ZXM6IHRoaXMuYWxsb3dlZERhdGVzLFxuICAgICAgICBjb2xvcjogdGhpcy5jb2xvcixcbiAgICAgICAgY3VycmVudDogdGhpcy5jdXJyZW50LFxuICAgICAgICBkYXJrOiB0aGlzLmRhcmssXG4gICAgICAgIGRpc2FibGVkOiB0aGlzLmRpc2FibGVkLFxuICAgICAgICBldmVudHM6IHRoaXMuZXZlbnRzLFxuICAgICAgICBldmVudENvbG9yOiB0aGlzLmV2ZW50Q29sb3IsXG4gICAgICAgIGZpcnN0RGF5T2ZXZWVrOiB0aGlzLmZpcnN0RGF5T2ZXZWVrLFxuICAgICAgICBmb3JtYXQ6IHRoaXMuZGF5Rm9ybWF0LFxuICAgICAgICBsaWdodDogdGhpcy5saWdodCxcbiAgICAgICAgbG9jYWxlOiB0aGlzLmxvY2FsZSxcbiAgICAgICAgbG9jYWxlRmlyc3REYXlPZlllYXI6IHRoaXMubG9jYWxlRmlyc3REYXlPZlllYXIsXG4gICAgICAgIG1pbjogdGhpcy5taW4sXG4gICAgICAgIG1heDogdGhpcy5tYXgsXG4gICAgICAgIHJhbmdlOiB0aGlzLnJhbmdlLFxuICAgICAgICByZWFkb25seTogdGhpcy5yZWFkb25seSxcbiAgICAgICAgc2Nyb2xsYWJsZTogdGhpcy5zY3JvbGxhYmxlLFxuICAgICAgICBzaG93QWRqYWNlbnRNb250aHM6IHRoaXMuc2hvd0FkamFjZW50TW9udGhzLFxuICAgICAgICBzaG93V2VlazogdGhpcy5zaG93V2VlayxcbiAgICAgICAgdGFibGVEYXRlOiBgJHtwYWQodGhpcy50YWJsZVllYXIsIDQpfS0ke3BhZCh0aGlzLnRhYmxlTW9udGggKyAxKX1gLFxuICAgICAgICBtb2RlbFZhbHVlOiB0aGlzLm1vZGVsVmFsdWUsXG4gICAgICAgIHdlZWtkYXlGb3JtYXQ6IHRoaXMud2Vla2RheUZvcm1hdCxcbiAgICAgICAgcmVmOiAndGFibGUnLFxuICAgICAgICAnb25VcGRhdGU6bW9kZWxWYWx1ZSc6IHRoaXMuZGF0ZUNsaWNrLFxuICAgICAgICAnb25VcGRhdGU6dGFibGUtZGF0ZSc6ICh2YWx1ZTogc3RyaW5nKSA9PiB0aGlzLnRhYmxlRGF0ZSA9IHZhbHVlLFxuICAgICAgICAuLi5jcmVhdGVJdGVtVHlwZUxpc3RlbmVycyh0aGlzLCAnOmRhdGUnKSxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBnZW5Nb250aFRhYmxlICgpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gaChWRGF0ZVBpY2tlck1vbnRoVGFibGUsIHtcbiAgICAgICAgYWxsb3dlZERhdGVzOiB0aGlzLnR5cGUgPT09ICdtb250aCcgPyB0aGlzLmFsbG93ZWREYXRlcyA6IG51bGwsXG4gICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLFxuICAgICAgICBjdXJyZW50OiB0aGlzLmN1cnJlbnQgPyBzYW5pdGl6ZURhdGVTdHJpbmcodGhpcy5jdXJyZW50LCAnbW9udGgnKSA6IG51bGwsXG4gICAgICAgIGRhcms6IHRoaXMuZGFyayxcbiAgICAgICAgZGlzYWJsZWQ6IHRoaXMuZGlzYWJsZWQsXG4gICAgICAgIGV2ZW50czogdGhpcy50eXBlID09PSAnbW9udGgnID8gdGhpcy5ldmVudHMgOiBudWxsLFxuICAgICAgICBldmVudENvbG9yOiB0aGlzLnR5cGUgPT09ICdtb250aCcgPyB0aGlzLmV2ZW50Q29sb3IgOiBudWxsLFxuICAgICAgICBmb3JtYXQ6IHRoaXMubW9udGhGb3JtYXQsXG4gICAgICAgIGxpZ2h0OiB0aGlzLmxpZ2h0LFxuICAgICAgICBsb2NhbGU6IHRoaXMubG9jYWxlLFxuICAgICAgICBtaW46IHRoaXMubWluTW9udGgsXG4gICAgICAgIG1heDogdGhpcy5tYXhNb250aCxcbiAgICAgICAgcmFuZ2U6IHRoaXMucmFuZ2UsXG4gICAgICAgIHJlYWRvbmx5OiB0aGlzLnJlYWRvbmx5ICYmIHRoaXMudHlwZSA9PT0gJ21vbnRoJyxcbiAgICAgICAgc2Nyb2xsYWJsZTogdGhpcy5zY3JvbGxhYmxlLFxuICAgICAgICBtb2RlbFZhbHVlOiB0aGlzLnNlbGVjdGVkTW9udGhzLFxuICAgICAgICB0YWJsZURhdGU6IGAke3BhZCh0aGlzLnRhYmxlWWVhciwgNCl9YCxcbiAgICAgICAgcmVmOiAndGFibGUnLFxuICAgICAgICAnb25VcGRhdGU6bW9kZWxWYWx1ZSc6IHRoaXMubW9udGhDbGljayxcbiAgICAgICAgJ29uVXBkYXRlOnRhYmxlLWRhdGUnOiAodmFsdWU6IHN0cmluZykgPT4gdGhpcy50YWJsZURhdGUgPSB2YWx1ZSxcbiAgICAgICAgLi4uY3JlYXRlSXRlbVR5cGVMaXN0ZW5lcnModGhpcywgJzptb250aCcpLFxuICAgICAgfSlcbiAgICB9LFxuICAgIGdlblllYXJzICgpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gaChWRGF0ZVBpY2tlclllYXJzLCB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLFxuICAgICAgICBmb3JtYXQ6IHRoaXMueWVhckZvcm1hdCxcbiAgICAgICAgbG9jYWxlOiB0aGlzLmxvY2FsZSxcbiAgICAgICAgbWluOiB0aGlzLm1pblllYXIsXG4gICAgICAgIG1heDogdGhpcy5tYXhZZWFyLFxuICAgICAgICBtb2RlbFZhbHVlOiB0aGlzLnRhYmxlWWVhcixcbiAgICAgICAgJ29uVXBkYXRlOm1vZGVsVmFsdWUnOiB0aGlzLnllYXJDbGljayxcbiAgICAgICAgLi4uY3JlYXRlSXRlbVR5cGVMaXN0ZW5lcnModGhpcywgJzp5ZWFyJyksXG4gICAgICB9KVxuICAgIH0sXG4gICAgZ2VuUGlja2VyQm9keSAoKTogVk5vZGUge1xuICAgICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLmludGVybmFsQWN0aXZlUGlja2VyID09PSAnWUVBUicgPyBbXG4gICAgICAgIHRoaXMuZ2VuWWVhcnMoKSxcbiAgICAgIF0gOiBbXG4gICAgICAgIHRoaXMuZ2VuVGFibGVIZWFkZXIoKSxcbiAgICAgICAgdGhpcy5pbnRlcm5hbEFjdGl2ZVBpY2tlciA9PT0gJ0RBVEUnID8gdGhpcy5nZW5EYXRlVGFibGUoKSA6IHRoaXMuZ2VuTW9udGhUYWJsZSgpLFxuICAgICAgXVxuXG4gICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICBrZXk6IHRoaXMuaW50ZXJuYWxBY3RpdmVQaWNrZXIsXG4gICAgICB9LCBjaGlsZHJlbilcbiAgICB9LFxuICAgIHNldElucHV0RGF0ZSAoKSB7XG4gICAgICBpZiAodGhpcy5sYXN0VmFsdWUpIHtcbiAgICAgICAgY29uc3QgYXJyYXkgPSB0aGlzLmxhc3RWYWx1ZS5zcGxpdCgnLScpXG4gICAgICAgIHRoaXMuaW5wdXRZZWFyID0gcGFyc2VJbnQoYXJyYXlbMF0sIDEwKVxuICAgICAgICB0aGlzLmlucHV0TW9udGggPSBwYXJzZUludChhcnJheVsxXSwgMTApIC0gMVxuICAgICAgICBpZiAodGhpcy50eXBlID09PSAnZGF0ZScpIHtcbiAgICAgICAgICB0aGlzLmlucHV0RGF5ID0gcGFyc2VJbnQoYXJyYXlbMl0sIDEwKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmlucHV0WWVhciA9IHRoaXMuaW5wdXRZZWFyIHx8IHRoaXMubm93LmdldEZ1bGxZZWFyKClcbiAgICAgICAgdGhpcy5pbnB1dE1vbnRoID0gdGhpcy5pbnB1dE1vbnRoID09IG51bGwgPyB0aGlzLmlucHV0TW9udGggOiB0aGlzLm5vdy5nZXRNb250aCgpXG4gICAgICAgIHRoaXMuaW5wdXREYXkgPSB0aGlzLmlucHV0RGF5IHx8IHRoaXMubm93LmdldERhdGUoKVxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgcmV0dXJuIHRoaXMuZ2VuUGlja2VyKCd2LXBpY2tlci0tZGF0ZScpXG4gIH0sXG59KVxuIl19