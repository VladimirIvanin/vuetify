import './VSlider.sass';
// Components
import VInput from '../VInput';
import { VScaleTransition } from '../transitions';
// Mixins
import mixins from '../../util/mixins';
import Loadable from '../../mixins/loadable';
// Directives
import ClickOutside from '../../directives/click-outside';
// Helpers
import { addOnceEventListener, deepEqual, keyCodes, createRange, convertToUnit, passiveSupported } from '../../util/helpers';
import { consoleWarn } from '../../util/console';
// Types
import { h, withDirectives, vShow } from 'vue';
export default mixins(VInput, Loadable
/* @vue/component */
).extend({
    name: 'v-slider',
    props: {
        disabled: Boolean,
        inverseLabel: Boolean,
        max: {
            type: [Number, String],
            default: 100,
        },
        min: {
            type: [Number, String],
            default: 0,
        },
        step: {
            type: [Number, String],
            default: 1,
        },
        thumbColor: String,
        thumbLabel: {
            type: [Boolean, String],
            default: undefined,
            validator: (v) => typeof v === 'boolean' || v === 'always' || v === undefined,
        },
        thumbSize: {
            type: [Number, String],
            default: 32,
        },
        tickLabels: {
            type: Array,
            default: () => ([]),
        },
        ticks: {
            type: [Boolean, String],
            default: false,
            validator: (v) => typeof v === 'boolean' || v === 'always',
        },
        tickSize: {
            type: [Number, String],
            default: 2,
        },
        trackColor: String,
        trackFillColor: String,
        modelValue: [Number, String],
        vertical: Boolean,
    },
    emits: [
        'update:modelValue',
        'start',
        'end',
        'mouseup',
        'change',
        'focus',
        'blur',
    ],
    data: () => ({
        app: null,
        oldValue: null,
        thumbPressed: false,
        mouseTimeout: -1,
        isFocused: false,
        isActive: false,
        noClick: false,
        startOffset: 0,
    }),
    computed: {
        classes() {
            return {
                ...VInput.computed.classes.call(this),
                'v-input__slider': true,
                'v-input__slider--vertical': this.vertical,
                'v-input__slider--inverse-label': this.inverseLabel,
            };
        },
        internalValue: {
            get() {
                return this.lazyValue;
            },
            set(val) {
                const originalVal = val;
                val = isNaN(val) ? this.minValue : val;
                // Round value to ensure the
                // entire slider range can
                // be selected with step
                let value = this.roundValue(val);
                // Then clamp to min/max
                value = Math.min(Math.max(value, this.minValue), this.maxValue);
                if (value === this.lazyValue)
                    return;
                this.lazyValue = value;
                this.$emit('update:modelValue', value);
            },
        },
        trackTransition() {
            return this.thumbPressed
                ? this.showTicks || this.stepNumeric
                    ? '0.1s cubic-bezier(0.25, 0.8, 0.5, 1)'
                    : 'none'
                : '';
        },
        minValue() {
            return parseFloat(this.min);
        },
        maxValue() {
            return parseFloat(this.max);
        },
        stepNumeric() {
            const step = parseFloat(this.step);
            return step > 0 ? step : 0;
        },
        inputWidth() {
            const inputWidth = (this.roundValue(this.internalValue) - this.minValue) / (this.maxValue - this.minValue) * 100;
            return isNaN(inputWidth) ? 0 : inputWidth;
        },
        trackFillStyles() {
            const startDir = this.vertical ? 'bottom' : 'left';
            const endDir = this.vertical ? 'top' : 'right';
            const valueDir = this.vertical ? 'height' : 'width';
            const start = this.$vuetify.rtl ? 'auto' : '0';
            const end = this.$vuetify.rtl ? '0' : 'auto';
            const value = this.isDisabled ? `calc(${this.inputWidth}% - 10px)` : `${this.inputWidth}%`;
            return {
                transition: this.trackTransition,
                [startDir]: start,
                [endDir]: end,
                [valueDir]: value,
            };
        },
        trackStyles() {
            const startDir = this.vertical ? this.$vuetify.rtl ? 'bottom' : 'top' : this.$vuetify.rtl ? 'left' : 'right';
            const endDir = this.vertical ? 'height' : 'width';
            const start = '0px';
            const end = this.isDisabled ? `calc(${100 - this.inputWidth}% - 10px)` : `calc(${100 - this.inputWidth}%)`;
            return {
                transition: this.trackTransition,
                [startDir]: start,
                [endDir]: end,
            };
        },
        showTicks() {
            return this.tickLabels.length > 0 ||
                !!(!this.isDisabled && this.stepNumeric && this.ticks);
        },
        numTicks() {
            return Math.ceil((this.maxValue - this.minValue) / this.stepNumeric);
        },
        showThumbLabel() {
            return !this.isDisabled && !!(this.thumbLabel ||
                this.$slots['thumb-label']);
        },
        computedTrackColor() {
            if (this.isDisabled)
                return undefined;
            if (this.trackColor)
                return this.trackColor;
            if (this.isDark)
                return this.validationState;
            return this.validationState || 'primary lighten-3';
        },
        computedTrackFillColor() {
            if (this.isDisabled)
                return undefined;
            if (this.trackFillColor)
                return this.trackFillColor;
            return this.validationState || this.computedColor;
        },
        computedThumbColor() {
            if (this.thumbColor)
                return this.thumbColor;
            return this.validationState || this.computedColor;
        },
    },
    watch: {
        min(val) {
            const parsed = parseFloat(val);
            if (parsed > this.internalValue) {
                this.$emit('update:modelValue', parsed);
            }
        },
        max(val) {
            const parsed = parseFloat(val);
            if (parsed < this.internalValue) {
                this.$emit('update:modelValue', parsed);
            }
        },
        modelValue: {
            handler(v) {
                // Use the setter to ensure proper rounding and validation
                this.internalValue = v;
            },
            immediate: true,
        },
    },
    mounted() {
        // Without a v-app, iOS does not work with body selectors
        this.app = document.querySelector('[data-app]') ||
            consoleWarn('Missing v-app or a non-body wrapping element with the [data-app] attribute', this);
    },
    methods: {
        genDefaultSlot() {
            const children = [this.genLabel()];
            const slider = this.genSlider();
            this.inverseLabel
                ? children.unshift(slider)
                : children.push(slider);
            children.push(this.genProgress());
            return children;
        },
        genSlider() {
            return withDirectives(h('div', {
                class: {
                    'v-slider': true,
                    'v-slider--horizontal': !this.vertical,
                    'v-slider--vertical': this.vertical,
                    'v-slider--focused': this.isFocused,
                    'v-slider--active': this.isActive,
                    'v-slider--disabled': this.isDisabled,
                    'v-slider--readonly': this.isReadonly,
                    ...this.themeClasses,
                },
                onClick: this.onSliderClick,
                onMousedown: this.onSliderMouseDown,
                onTouchstart: this.onSliderMouseDown,
            }, this.genChildren()), [
                [ClickOutside, this.onBlur],
            ]);
        },
        genChildren() {
            return [
                this.genInput(),
                this.genTrackContainer(),
                this.genSteps(),
                this.genThumbContainer(this.internalValue, this.inputWidth, this.isActive, this.isFocused, this.onFocus, this.onBlur),
            ];
        },
        genInput() {
            return h('input', {
                value: this.internalValue,
                id: this.computedId,
                disabled: true,
                readonly: true,
                tabindex: -1,
                ...this.$attrs,
                // on: this.genListeners(), // TODO: do we need to attach the listeners to input?
            });
        },
        genTrackContainer() {
            const children = [
                h('div', this.setBackgroundColor(this.computedTrackColor, {
                    class: 'v-slider__track-background',
                    style: this.trackStyles,
                })),
                h('div', this.setBackgroundColor(this.computedTrackFillColor, {
                    class: 'v-slider__track-fill',
                    style: this.trackFillStyles,
                })),
            ];
            return h('div', {
                class: 'v-slider__track-container',
                ref: 'track',
            }, children);
        },
        genSteps() {
            if (!this.step || !this.showTicks)
                return null;
            const tickSize = parseFloat(this.tickSize);
            const range = createRange(this.numTicks + 1);
            const direction = this.vertical ? 'bottom' : (this.$vuetify.rtl ? 'right' : 'left');
            const offsetDirection = this.vertical ? (this.$vuetify.rtl ? 'left' : 'right') : 'top';
            if (this.vertical)
                range.reverse();
            const ticks = range.map(index => {
                const children = [];
                if (this.tickLabels[index]) {
                    children.push(h('div', {
                        class: 'v-slider__tick-label',
                    }, this.tickLabels[index]));
                }
                const width = index * (100 / this.numTicks);
                const filled = this.$vuetify.rtl ? (100 - this.inputWidth) < width : width < this.inputWidth;
                return h('span', {
                    key: index,
                    class: ['v-slider__tick', {
                            'v-slider__tick--filled': filled,
                        }],
                    style: {
                        width: `${tickSize}px`,
                        height: `${tickSize}px`,
                        [direction]: `calc(${width}% - ${tickSize / 2}px)`,
                        [offsetDirection]: `calc(50% - ${tickSize / 2}px)`,
                    },
                }, children);
            });
            return h('div', {
                class: ['v-slider__ticks-container', {
                        'v-slider__ticks-container--always-show': this.ticks === 'always' || this.tickLabels.length > 0,
                    }],
            }, ticks);
        },
        genThumbContainer(value, valueWidth, isActive, isFocused, onFocus, onBlur, ref = 'thumb') {
            const children = [this.genThumb()];
            const thumbLabelContent = this.genThumbLabelContent(value);
            this.showThumbLabel && children.push(this.genThumbLabel(thumbLabelContent));
            return h('div', this.setTextColor(this.computedThumbColor, {
                ref,
                key: ref,
                class: ['v-slider__thumb-container', {
                        'v-slider__thumb-container--active': isActive,
                        'v-slider__thumb-container--focused': isFocused,
                        'v-slider__thumb-container--show-label': this.showThumbLabel,
                    }],
                style: this.getThumbContainerStyles(valueWidth),
                role: 'slider',
                tabindex: this.isDisabled ? -1 : this.$attrs.tabindex ? this.$attrs.tabindex : 0,
                'aria-label': this.$attrs['aria-label'] || this.label,
                'aria-valuemin': this.min,
                'aria-valuemax': this.max,
                'aria-valuenow': this.internalValue,
                'aria-readonly': String(this.isReadonly),
                'aria-orientation': this.vertical ? 'vertical' : 'horizontal',
                onFocus,
                onBlur,
                onKeydown: this.onKeyDown,
            }), children);
        },
        genThumbLabelContent(value) {
            return this.$slots['thumb-label']
                ? this.$slots['thumb-label']({ value })
                : [h('span', [String(value)])];
        },
        genThumbLabel(content) {
            const size = convertToUnit(this.thumbSize);
            const transform = this.vertical
                ? `translateY(20%) translateY(${(Number(this.thumbSize) / 3) - 1}px) translateX(55%) rotate(135deg)`
                : `translateY(-20%) translateY(-12px) translateX(-50%) rotate(45deg)`;
            return h(VScaleTransition, {
                origin: 'bottom center',
            }, () => [
                withDirectives(h('div', {
                    class: 'v-slider__thumb-label-container',
                }, [
                    h('div', this.setBackgroundColor(this.computedThumbColor, {
                        class: 'v-slider__thumb-label',
                        style: {
                            height: size,
                            width: size,
                            transform,
                        },
                    }), [h('div', content)]),
                ]), [
                    [vShow, this.isFocused || this.isActive || this.thumbLabel === 'always'],
                ]),
            ]);
        },
        genThumb() {
            return h('div', this.setBackgroundColor(this.computedThumbColor, {
                class: 'v-slider__thumb',
            }));
        },
        getThumbContainerStyles(width) {
            const direction = this.vertical ? 'top' : 'left';
            let value = this.$vuetify.rtl ? 100 - width : width;
            value = this.vertical ? 100 - value : value;
            return {
                transition: this.trackTransition,
                [direction]: `${value}%`,
            };
        },
        onSliderMouseDown(e) {
            var _a;
            e.preventDefault();
            this.oldValue = this.internalValue;
            this.isActive = true;
            if ((_a = e.target) === null || _a === void 0 ? void 0 : _a.matches('.v-slider__thumb-container, .v-slider__thumb-container *')) {
                this.thumbPressed = true;
                const domRect = e.target.getBoundingClientRect();
                const touch = 'touches' in e ? e.touches[0] : e;
                this.startOffset = this.vertical
                    ? touch.clientY - (domRect.top + domRect.height / 2)
                    : touch.clientX - (domRect.left + domRect.width / 2);
            }
            else {
                this.startOffset = 0;
                window.clearTimeout(this.mouseTimeout);
                this.mouseTimeout = window.setTimeout(() => {
                    this.thumbPressed = true;
                }, 300);
            }
            const mouseUpOptions = passiveSupported ? { passive: true, capture: true } : true;
            const mouseMoveOptions = passiveSupported ? { passive: true } : false;
            const isTouchEvent = 'touches' in e;
            this.onMouseMove(e);
            this.app.addEventListener(isTouchEvent ? 'touchmove' : 'mousemove', this.onMouseMove, mouseMoveOptions);
            addOnceEventListener(this.app, isTouchEvent ? 'touchend' : 'mouseup', this.onSliderMouseUp, mouseUpOptions);
            this.$emit('start', this.internalValue);
        },
        onSliderMouseUp(e) {
            e.stopPropagation();
            window.clearTimeout(this.mouseTimeout);
            this.thumbPressed = false;
            const mouseMoveOptions = passiveSupported ? { passive: true } : false;
            this.app.removeEventListener('touchmove', this.onMouseMove, mouseMoveOptions);
            this.app.removeEventListener('mousemove', this.onMouseMove, mouseMoveOptions);
            this.$emit('mouseup', e);
            this.$emit('end', this.internalValue);
            if (!deepEqual(this.oldValue, this.internalValue)) {
                this.$emit('update:modelValue', this.internalValue);
                this.noClick = true;
            }
            this.isActive = false;
        },
        onMouseMove(e) {
            if (e.type === 'mousemove') {
                this.thumbPressed = true;
            }
            this.internalValue = this.parseMouseMove(e);
        },
        onKeyDown(e) {
            if (!this.isInteractive)
                return;
            const value = this.parseKeyDown(e, this.internalValue);
            if (value == null ||
                value < this.minValue ||
                value > this.maxValue)
                return;
            this.internalValue = value;
            this.$emit('update:modelValue', value);
        },
        onSliderClick(e) {
            if (this.noClick) {
                this.noClick = false;
                return;
            }
            const thumb = this.$refs.thumb;
            thumb.focus();
            this.onMouseMove(e);
            this.$emit('update:modelValue', this.internalValue);
            this.$emit('change', this.internalValue);
        },
        onBlur(e) {
            this.isFocused = false;
            this.$emit('blur', e);
        },
        onFocus(e) {
            this.isFocused = true;
            this.$emit('focus', e);
        },
        parseMouseMove(e) {
            const start = this.vertical ? 'top' : 'left';
            const length = this.vertical ? 'height' : 'width';
            const click = this.vertical ? 'clientY' : 'clientX';
            const { [start]: trackStart, [length]: trackLength, } = this.$refs.track.getBoundingClientRect();
            const clickOffset = 'touches' in e ? e.touches[0][click] : e[click];
            // It is possible for left to be NaN, force to number
            let clickPos = Math.min(Math.max((clickOffset - trackStart - this.startOffset) / trackLength, 0), 1) || 0;
            if (this.vertical)
                clickPos = 1 - clickPos;
            if (this.$vuetify.rtl)
                clickPos = 1 - clickPos;
            return parseFloat(this.min) + clickPos * (this.maxValue - this.minValue);
        },
        parseKeyDown(e, value) {
            if (!this.isInteractive)
                return;
            const { pageup, pagedown, end, home, left, right, down, up } = keyCodes;
            if (![pageup, pagedown, end, home, left, right, down, up].includes(e.keyCode))
                return;
            e.preventDefault();
            const step = this.stepNumeric || 1;
            const steps = (this.maxValue - this.minValue) / step;
            if ([left, right, down, up].includes(e.keyCode)) {
                const increase = this.$vuetify.rtl ? [left, up] : [right, up];
                const direction = increase.includes(e.keyCode) ? 1 : -1;
                const multiplier = e.shiftKey ? 3 : (e.ctrlKey ? 2 : 1);
                value = value + (direction * step * multiplier);
            }
            else if (e.keyCode === home) {
                value = this.minValue;
            }
            else if (e.keyCode === end) {
                value = this.maxValue;
            }
            else {
                const direction = e.keyCode === pagedown ? 1 : -1;
                value = value - (direction * step * (steps > 100 ? steps / 10 : 10));
            }
            return value;
        },
        roundValue(value) {
            if (!this.stepNumeric)
                return value;
            // Format input value using the same number
            // of decimals places as in the step prop
            const trimmedStep = this.step.toString().trim();
            const decimals = trimmedStep.indexOf('.') > -1
                ? (trimmedStep.length - trimmedStep.indexOf('.') - 1)
                : 0;
            const offset = this.minValue % this.stepNumeric;
            const newValue = Math.round((value - offset) / this.stepNumeric) * this.stepNumeric + offset;
            return parseFloat(Math.min(newValue, this.maxValue).toFixed(decimals));
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNsaWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTbGlkZXIvVlNsaWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLGdCQUFnQixDQUFBO0FBRXZCLGFBQWE7QUFDYixPQUFPLE1BQU0sTUFBTSxXQUFXLENBQUE7QUFDOUIsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZ0JBQWdCLENBQUE7QUFFakQsU0FBUztBQUNULE9BQU8sTUFBc0IsTUFBTSxtQkFBbUIsQ0FBQTtBQUN0RCxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUU1QyxhQUFhO0FBQ2IsT0FBTyxZQUFZLE1BQU0sZ0NBQWdDLENBQUE7QUFFekQsVUFBVTtBQUNWLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUM1SCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFaEQsUUFBUTtBQUNSLE9BQU8sRUFBb0MsQ0FBQyxFQUFzQixjQUFjLEVBQUUsS0FBSyxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBU3BHLGVBQWUsTUFBTSxDQVFuQixNQUFNLEVBQ04sUUFBUTtBQUNWLG9CQUFvQjtDQUNuQixDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxVQUFVO0lBR2hCLEtBQUssRUFBRTtRQUNMLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLFlBQVksRUFBRSxPQUFPO1FBQ3JCLEdBQUcsRUFBRTtZQUNILElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLEdBQUc7U0FDYjtRQUNELEdBQUcsRUFBRTtZQUNILElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUNELElBQUks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QUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtRQUN4RSxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vVlNsaWRlci5zYXNzJ1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgVklucHV0IGZyb20gJy4uL1ZJbnB1dCdcbmltcG9ydCB7IFZTY2FsZVRyYW5zaXRpb24gfSBmcm9tICcuLi90cmFuc2l0aW9ucydcblxuLy8gTWl4aW5zXG5pbXBvcnQgbWl4aW5zLCB7IEV4dHJhY3RWdWUgfSBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCBMb2FkYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvbG9hZGFibGUnXG5cbi8vIERpcmVjdGl2ZXNcbmltcG9ydCBDbGlja091dHNpZGUgZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9jbGljay1vdXRzaWRlJ1xuXG4vLyBIZWxwZXJzXG5pbXBvcnQgeyBhZGRPbmNlRXZlbnRMaXN0ZW5lciwgZGVlcEVxdWFsLCBrZXlDb2RlcywgY3JlYXRlUmFuZ2UsIGNvbnZlcnRUb1VuaXQsIHBhc3NpdmVTdXBwb3J0ZWQgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5pbXBvcnQgeyBjb25zb2xlV2FybiB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcblxuLy8gVHlwZXNcbmltcG9ydCB7IGRlZmluZUNvbXBvbmVudCwgVk5vZGUsIFByb3BUeXBlLCBoLCBnZXRDdXJyZW50SW5zdGFuY2UsIHdpdGhEaXJlY3RpdmVzLCB2U2hvdyB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7IFByb3BWYWxpZGF0b3IgfSBmcm9tICd2dWUvdHlwZXMvb3B0aW9ucydcblxuaW50ZXJmYWNlIG9wdGlvbnMge1xuICAkcmVmczoge1xuICAgIHRyYWNrOiBIVE1MRWxlbWVudFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1peGluczxvcHRpb25zICZcbi8qIGVzbGludC1kaXNhYmxlIGluZGVudCAqL1xuICBFeHRyYWN0VnVlPFtcbiAgICB0eXBlb2YgVklucHV0LFxuICAgIHR5cGVvZiBMb2FkYWJsZVxuICBdPlxuLyogZXNsaW50LWVuYWJsZSBpbmRlbnQgKi9cbj4oXG4gIFZJbnB1dCxcbiAgTG9hZGFibGVcbi8qIEB2dWUvY29tcG9uZW50ICovXG4pLmV4dGVuZCh7XG4gIG5hbWU6ICd2LXNsaWRlcicsXG5cblxuICBwcm9wczoge1xuICAgIGRpc2FibGVkOiBCb29sZWFuLFxuICAgIGludmVyc2VMYWJlbDogQm9vbGVhbixcbiAgICBtYXg6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAxMDAsXG4gICAgfSxcbiAgICBtaW46IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgc3RlcDoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDEsXG4gICAgfSxcbiAgICB0aHVtYkNvbG9yOiBTdHJpbmcsXG4gICAgdGh1bWJMYWJlbDoge1xuICAgICAgdHlwZTogW0Jvb2xlYW4sIFN0cmluZ10gYXMgUHJvcFR5cGU8Ym9vbGVhbiB8ICdhbHdheXMnIHwgdW5kZWZpbmVkPixcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIHZhbGlkYXRvcjogKHY6IGFueSkgPT4gdHlwZW9mIHYgPT09ICdib29sZWFuJyB8fCB2ID09PSAnYWx3YXlzJyB8fCB2ID09PSB1bmRlZmluZWQsXG4gICAgfSxcbiAgICB0aHVtYlNpemU6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAzMixcbiAgICB9LFxuICAgIHRpY2tMYWJlbHM6IHtcbiAgICAgIHR5cGU6IEFycmF5LFxuICAgICAgZGVmYXVsdDogKCkgPT4gKFtdKSxcbiAgICB9IGFzIFByb3BWYWxpZGF0b3I8c3RyaW5nW10+LFxuICAgIHRpY2tzOiB7XG4gICAgICB0eXBlOiBbQm9vbGVhbiwgU3RyaW5nXSBhcyBQcm9wVHlwZTxib29sZWFuIHwgJ2Fsd2F5cyc+LFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICB2YWxpZGF0b3I6ICh2OiBhbnkpID0+IHR5cGVvZiB2ID09PSAnYm9vbGVhbicgfHwgdiA9PT0gJ2Fsd2F5cycsXG4gICAgfSxcbiAgICB0aWNrU2l6ZToge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDIsXG4gICAgfSxcbiAgICB0cmFja0NvbG9yOiBTdHJpbmcsXG4gICAgdHJhY2tGaWxsQ29sb3I6IFN0cmluZyxcbiAgICBtb2RlbFZhbHVlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgIHZlcnRpY2FsOiBCb29sZWFuLFxuICB9LFxuXG4gIGVtaXRzOiBbXG4gICAgJ3VwZGF0ZTptb2RlbFZhbHVlJyxcbiAgICAnc3RhcnQnLFxuICAgICdlbmQnLFxuICAgICdtb3VzZXVwJyxcbiAgICAnY2hhbmdlJyxcbiAgICAnZm9jdXMnLFxuICAgICdibHVyJyxcbiAgXSxcblxuICBkYXRhOiAoKSA9PiAoe1xuICAgIGFwcDogbnVsbCBhcyBhbnksXG4gICAgb2xkVmFsdWU6IG51bGwgYXMgYW55LFxuICAgIHRodW1iUHJlc3NlZDogZmFsc2UsXG4gICAgbW91c2VUaW1lb3V0OiAtMSxcbiAgICBpc0ZvY3VzZWQ6IGZhbHNlLFxuICAgIGlzQWN0aXZlOiBmYWxzZSxcbiAgICBub0NsaWNrOiBmYWxzZSwgLy8gUHJldmVudCBjbGljayBldmVudCBpZiBkcmFnZ2luZyB0b29rIHBsYWNlLCBoYWNrIGZvciAjNzkxNVxuICAgIHN0YXJ0T2Zmc2V0OiAwLFxuICB9KSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5WSW5wdXQuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi1pbnB1dF9fc2xpZGVyJzogdHJ1ZSxcbiAgICAgICAgJ3YtaW5wdXRfX3NsaWRlci0tdmVydGljYWwnOiB0aGlzLnZlcnRpY2FsLFxuICAgICAgICAndi1pbnB1dF9fc2xpZGVyLS1pbnZlcnNlLWxhYmVsJzogdGhpcy5pbnZlcnNlTGFiZWwsXG4gICAgICB9XG4gICAgfSxcbiAgICBpbnRlcm5hbFZhbHVlOiB7XG4gICAgICBnZXQgKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmxhenlWYWx1ZVxuICAgICAgfSxcbiAgICAgIHNldCAodmFsOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxWYWwgPSB2YWxcbiAgICAgICAgdmFsID0gaXNOYU4odmFsKSA/IHRoaXMubWluVmFsdWUgOiB2YWxcbiAgICAgICAgLy8gUm91bmQgdmFsdWUgdG8gZW5zdXJlIHRoZVxuICAgICAgICAvLyBlbnRpcmUgc2xpZGVyIHJhbmdlIGNhblxuICAgICAgICAvLyBiZSBzZWxlY3RlZCB3aXRoIHN0ZXBcbiAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5yb3VuZFZhbHVlKHZhbClcbiAgICAgICAgLy8gVGhlbiBjbGFtcCB0byBtaW4vbWF4XG4gICAgICAgIHZhbHVlID0gTWF0aC5taW4oTWF0aC5tYXgodmFsdWUsIHRoaXMubWluVmFsdWUpLCB0aGlzLm1heFZhbHVlKVxuXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5sYXp5VmFsdWUpIHJldHVyblxuXG4gICAgICAgIHRoaXMubGF6eVZhbHVlID0gdmFsdWVcblxuICAgICAgICB0aGlzLiRlbWl0KCd1cGRhdGU6bW9kZWxWYWx1ZScsIHZhbHVlKVxuICAgICAgfSxcbiAgICB9LFxuICAgIHRyYWNrVHJhbnNpdGlvbiAoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiB0aGlzLnRodW1iUHJlc3NlZFxuICAgICAgICA/IHRoaXMuc2hvd1RpY2tzIHx8IHRoaXMuc3RlcE51bWVyaWNcbiAgICAgICAgICA/ICcwLjFzIGN1YmljLWJlemllcigwLjI1LCAwLjgsIDAuNSwgMSknXG4gICAgICAgICAgOiAnbm9uZSdcbiAgICAgICAgOiAnJ1xuICAgIH0sXG4gICAgbWluVmFsdWUgKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gcGFyc2VGbG9hdCh0aGlzLm1pbilcbiAgICB9LFxuICAgIG1heFZhbHVlICgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodGhpcy5tYXgpXG4gICAgfSxcbiAgICBzdGVwTnVtZXJpYyAoKTogbnVtYmVyIHtcbiAgICAgIGNvbnN0IHN0ZXAgPSBwYXJzZUZsb2F0KHRoaXMuc3RlcClcbiAgICAgIHJldHVybiBzdGVwID4gMCA/IHN0ZXAgOiAwXG4gICAgfSxcbiAgICBpbnB1dFdpZHRoICgpOiBudW1iZXIge1xuICAgICAgY29uc3QgaW5wdXRXaWR0aCA9ICh0aGlzLnJvdW5kVmFsdWUodGhpcy5pbnRlcm5hbFZhbHVlKSAtIHRoaXMubWluVmFsdWUpIC8gKHRoaXMubWF4VmFsdWUgLSB0aGlzLm1pblZhbHVlKSAqIDEwMFxuXG4gICAgICByZXR1cm4gaXNOYU4oaW5wdXRXaWR0aCkgPyAwIDogaW5wdXRXaWR0aFxuICAgIH0sXG4gICAgdHJhY2tGaWxsU3R5bGVzICgpOiBQYXJ0aWFsPENTU1N0eWxlRGVjbGFyYXRpb24+IHtcbiAgICAgIGNvbnN0IHN0YXJ0RGlyID0gdGhpcy52ZXJ0aWNhbCA/ICdib3R0b20nIDogJ2xlZnQnXG4gICAgICBjb25zdCBlbmREaXIgPSB0aGlzLnZlcnRpY2FsID8gJ3RvcCcgOiAncmlnaHQnXG4gICAgICBjb25zdCB2YWx1ZURpciA9IHRoaXMudmVydGljYWwgPyAnaGVpZ2h0JyA6ICd3aWR0aCdcblxuICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLiR2dWV0aWZ5LnJ0bCA/ICdhdXRvJyA6ICcwJ1xuICAgICAgY29uc3QgZW5kID0gdGhpcy4kdnVldGlmeS5ydGwgPyAnMCcgOiAnYXV0bydcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5pc0Rpc2FibGVkID8gYGNhbGMoJHt0aGlzLmlucHV0V2lkdGh9JSAtIDEwcHgpYCA6IGAke3RoaXMuaW5wdXRXaWR0aH0lYFxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICB0cmFuc2l0aW9uOiB0aGlzLnRyYWNrVHJhbnNpdGlvbixcbiAgICAgICAgW3N0YXJ0RGlyXTogc3RhcnQsXG4gICAgICAgIFtlbmREaXJdOiBlbmQsXG4gICAgICAgIFt2YWx1ZURpcl06IHZhbHVlLFxuICAgICAgfVxuICAgIH0sXG4gICAgdHJhY2tTdHlsZXMgKCk6IFBhcnRpYWw8Q1NTU3R5bGVEZWNsYXJhdGlvbj4ge1xuICAgICAgY29uc3Qgc3RhcnREaXIgPSB0aGlzLnZlcnRpY2FsID8gdGhpcy4kdnVldGlmeS5ydGwgPyAnYm90dG9tJyA6ICd0b3AnIDogdGhpcy4kdnVldGlmeS5ydGwgPyAnbGVmdCcgOiAncmlnaHQnXG4gICAgICBjb25zdCBlbmREaXIgPSB0aGlzLnZlcnRpY2FsID8gJ2hlaWdodCcgOiAnd2lkdGgnXG5cbiAgICAgIGNvbnN0IHN0YXJ0ID0gJzBweCdcbiAgICAgIGNvbnN0IGVuZCA9IHRoaXMuaXNEaXNhYmxlZCA/IGBjYWxjKCR7MTAwIC0gdGhpcy5pbnB1dFdpZHRofSUgLSAxMHB4KWAgOiBgY2FsYygkezEwMCAtIHRoaXMuaW5wdXRXaWR0aH0lKWBcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHJhbnNpdGlvbjogdGhpcy50cmFja1RyYW5zaXRpb24sXG4gICAgICAgIFtzdGFydERpcl06IHN0YXJ0LFxuICAgICAgICBbZW5kRGlyXTogZW5kLFxuICAgICAgfVxuICAgIH0sXG4gICAgc2hvd1RpY2tzICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLnRpY2tMYWJlbHMubGVuZ3RoID4gMCB8fFxuICAgICAgICAhISghdGhpcy5pc0Rpc2FibGVkICYmIHRoaXMuc3RlcE51bWVyaWMgJiYgdGhpcy50aWNrcylcbiAgICB9LFxuICAgIG51bVRpY2tzICgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIE1hdGguY2VpbCgodGhpcy5tYXhWYWx1ZSAtIHRoaXMubWluVmFsdWUpIC8gdGhpcy5zdGVwTnVtZXJpYylcbiAgICB9LFxuICAgIHNob3dUaHVtYkxhYmVsICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAhdGhpcy5pc0Rpc2FibGVkICYmICEhKFxuICAgICAgICB0aGlzLnRodW1iTGFiZWwgfHxcbiAgICAgICAgdGhpcy4kc2xvdHNbJ3RodW1iLWxhYmVsJ11cbiAgICAgIClcbiAgICB9LFxuICAgIGNvbXB1dGVkVHJhY2tDb2xvciAoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgIGlmICh0aGlzLmlzRGlzYWJsZWQpIHJldHVybiB1bmRlZmluZWRcbiAgICAgIGlmICh0aGlzLnRyYWNrQ29sb3IpIHJldHVybiB0aGlzLnRyYWNrQ29sb3JcbiAgICAgIGlmICh0aGlzLmlzRGFyaykgcmV0dXJuIHRoaXMudmFsaWRhdGlvblN0YXRlXG4gICAgICByZXR1cm4gdGhpcy52YWxpZGF0aW9uU3RhdGUgfHwgJ3ByaW1hcnkgbGlnaHRlbi0zJ1xuICAgIH0sXG4gICAgY29tcHV0ZWRUcmFja0ZpbGxDb2xvciAoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgIGlmICh0aGlzLmlzRGlzYWJsZWQpIHJldHVybiB1bmRlZmluZWRcbiAgICAgIGlmICh0aGlzLnRyYWNrRmlsbENvbG9yKSByZXR1cm4gdGhpcy50cmFja0ZpbGxDb2xvclxuICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGlvblN0YXRlIHx8IHRoaXMuY29tcHV0ZWRDb2xvclxuICAgIH0sXG4gICAgY29tcHV0ZWRUaHVtYkNvbG9yICgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgaWYgKHRoaXMudGh1bWJDb2xvcikgcmV0dXJuIHRoaXMudGh1bWJDb2xvclxuICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGlvblN0YXRlIHx8IHRoaXMuY29tcHV0ZWRDb2xvclxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBtaW4gKHZhbCkge1xuICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VGbG9hdCh2YWwpXG4gICAgICBpZiAocGFyc2VkID4gdGhpcy5pbnRlcm5hbFZhbHVlKSB7XG4gICAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTptb2RlbFZhbHVlJywgcGFyc2VkKVxuICAgICAgfVxuICAgIH0sXG4gICAgbWF4ICh2YWwpIHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlRmxvYXQodmFsKVxuICAgICAgaWYgKHBhcnNlZCA8IHRoaXMuaW50ZXJuYWxWYWx1ZSkge1xuICAgICAgICB0aGlzLiRlbWl0KCd1cGRhdGU6bW9kZWxWYWx1ZScsIHBhcnNlZClcbiAgICAgIH1cbiAgICB9LFxuICAgIG1vZGVsVmFsdWU6IHtcbiAgICAgIGhhbmRsZXIgKHY6IG51bWJlcikge1xuICAgICAgICAvLyBVc2UgdGhlIHNldHRlciB0byBlbnN1cmUgcHJvcGVyIHJvdW5kaW5nIGFuZCB2YWxpZGF0aW9uXG4gICAgICAgIHRoaXMuaW50ZXJuYWxWYWx1ZSA9IHZcbiAgICAgIH0sXG4gICAgICBpbW1lZGlhdGU6IHRydWUsXG4gICAgfSxcbiAgfSxcblxuXG4gIG1vdW50ZWQgKCkge1xuICAgIC8vIFdpdGhvdXQgYSB2LWFwcCwgaU9TIGRvZXMgbm90IHdvcmsgd2l0aCBib2R5IHNlbGVjdG9yc1xuICAgIHRoaXMuYXBwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtYXBwXScpIHx8XG4gICAgICBjb25zb2xlV2FybignTWlzc2luZyB2LWFwcCBvciBhIG5vbi1ib2R5IHdyYXBwaW5nIGVsZW1lbnQgd2l0aCB0aGUgW2RhdGEtYXBwXSBhdHRyaWJ1dGUnLCB0aGlzKVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5EZWZhdWx0U2xvdCAoKTogVk5vZGVbXSB7XG4gICAgICBjb25zdCBjaGlsZHJlbjogVk5vZGVbXSA9IFt0aGlzLmdlbkxhYmVsKCldXG4gICAgICBjb25zdCBzbGlkZXIgPSB0aGlzLmdlblNsaWRlcigpXG4gICAgICB0aGlzLmludmVyc2VMYWJlbFxuICAgICAgICA/IGNoaWxkcmVuLnVuc2hpZnQoc2xpZGVyKVxuICAgICAgICA6IGNoaWxkcmVuLnB1c2goc2xpZGVyKVxuXG4gICAgICBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuUHJvZ3Jlc3MoKSlcblxuICAgICAgcmV0dXJuIGNoaWxkcmVuXG4gICAgfSxcbiAgICBnZW5TbGlkZXIgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiB3aXRoRGlyZWN0aXZlcyhoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiB7XG4gICAgICAgICAgJ3Ytc2xpZGVyJzogdHJ1ZSxcbiAgICAgICAgICAndi1zbGlkZXItLWhvcml6b250YWwnOiAhdGhpcy52ZXJ0aWNhbCxcbiAgICAgICAgICAndi1zbGlkZXItLXZlcnRpY2FsJzogdGhpcy52ZXJ0aWNhbCxcbiAgICAgICAgICAndi1zbGlkZXItLWZvY3VzZWQnOiB0aGlzLmlzRm9jdXNlZCxcbiAgICAgICAgICAndi1zbGlkZXItLWFjdGl2ZSc6IHRoaXMuaXNBY3RpdmUsXG4gICAgICAgICAgJ3Ytc2xpZGVyLS1kaXNhYmxlZCc6IHRoaXMuaXNEaXNhYmxlZCxcbiAgICAgICAgICAndi1zbGlkZXItLXJlYWRvbmx5JzogdGhpcy5pc1JlYWRvbmx5LFxuICAgICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzLFxuICAgICAgICB9LFxuICAgICAgICBvbkNsaWNrOiB0aGlzLm9uU2xpZGVyQ2xpY2ssXG4gICAgICAgIG9uTW91c2Vkb3duOiB0aGlzLm9uU2xpZGVyTW91c2VEb3duLFxuICAgICAgICBvblRvdWNoc3RhcnQ6IHRoaXMub25TbGlkZXJNb3VzZURvd24sXG4gICAgICB9LCB0aGlzLmdlbkNoaWxkcmVuKCkpLCBbXG4gICAgICAgIFtDbGlja091dHNpZGUsIHRoaXMub25CbHVyXSxcbiAgICAgIF0pXG4gICAgfSxcbiAgICBnZW5DaGlsZHJlbiAoKTogVk5vZGVbXSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB0aGlzLmdlbklucHV0KCksXG4gICAgICAgIHRoaXMuZ2VuVHJhY2tDb250YWluZXIoKSxcbiAgICAgICAgdGhpcy5nZW5TdGVwcygpLFxuICAgICAgICB0aGlzLmdlblRodW1iQ29udGFpbmVyKFxuICAgICAgICAgIHRoaXMuaW50ZXJuYWxWYWx1ZSxcbiAgICAgICAgICB0aGlzLmlucHV0V2lkdGgsXG4gICAgICAgICAgdGhpcy5pc0FjdGl2ZSxcbiAgICAgICAgICB0aGlzLmlzRm9jdXNlZCxcbiAgICAgICAgICB0aGlzLm9uRm9jdXMsXG4gICAgICAgICAgdGhpcy5vbkJsdXIsXG4gICAgICAgICksXG4gICAgICBdXG4gICAgfSxcbiAgICBnZW5JbnB1dCAoKTogVk5vZGUge1xuICAgICAgcmV0dXJuIGgoJ2lucHV0Jywge1xuICAgICAgICB2YWx1ZTogdGhpcy5pbnRlcm5hbFZhbHVlLFxuICAgICAgICBpZDogdGhpcy5jb21wdXRlZElkLFxuICAgICAgICBkaXNhYmxlZDogdHJ1ZSxcbiAgICAgICAgcmVhZG9ubHk6IHRydWUsXG4gICAgICAgIHRhYmluZGV4OiAtMSxcbiAgICAgICAgLi4udGhpcy4kYXR0cnMsXG4gICAgICAgIC8vIG9uOiB0aGlzLmdlbkxpc3RlbmVycygpLCAvLyBUT0RPOiBkbyB3ZSBuZWVkIHRvIGF0dGFjaCB0aGUgbGlzdGVuZXJzIHRvIGlucHV0P1xuICAgICAgfSlcbiAgICB9LFxuICAgIGdlblRyYWNrQ29udGFpbmVyICgpOiBWTm9kZSB7XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IFtcbiAgICAgICAgaCgnZGl2JywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb21wdXRlZFRyYWNrQ29sb3IsIHtcbiAgICAgICAgICBjbGFzczogJ3Ytc2xpZGVyX190cmFjay1iYWNrZ3JvdW5kJyxcbiAgICAgICAgICBzdHlsZTogdGhpcy50cmFja1N0eWxlcyxcbiAgICAgICAgfSkpLFxuICAgICAgICBoKCdkaXYnLCB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmNvbXB1dGVkVHJhY2tGaWxsQ29sb3IsIHtcbiAgICAgICAgICBjbGFzczogJ3Ytc2xpZGVyX190cmFjay1maWxsJyxcbiAgICAgICAgICBzdHlsZTogdGhpcy50cmFja0ZpbGxTdHlsZXMsXG4gICAgICAgIH0pKSxcbiAgICAgIF1cblxuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6ICd2LXNsaWRlcl9fdHJhY2stY29udGFpbmVyJyxcbiAgICAgICAgcmVmOiAndHJhY2snLFxuICAgICAgfSwgY2hpbGRyZW4pXG4gICAgfSxcbiAgICBnZW5TdGVwcyAoKTogVk5vZGUgfCBudWxsIHtcbiAgICAgIGlmICghdGhpcy5zdGVwIHx8ICF0aGlzLnNob3dUaWNrcykgcmV0dXJuIG51bGxcblxuICAgICAgY29uc3QgdGlja1NpemUgPSBwYXJzZUZsb2F0KHRoaXMudGlja1NpemUpXG4gICAgICBjb25zdCByYW5nZSA9IGNyZWF0ZVJhbmdlKHRoaXMubnVtVGlja3MgKyAxKVxuICAgICAgY29uc3QgZGlyZWN0aW9uID0gdGhpcy52ZXJ0aWNhbCA/ICdib3R0b20nIDogKHRoaXMuJHZ1ZXRpZnkucnRsID8gJ3JpZ2h0JyA6ICdsZWZ0JylcbiAgICAgIGNvbnN0IG9mZnNldERpcmVjdGlvbiA9IHRoaXMudmVydGljYWwgPyAodGhpcy4kdnVldGlmeS5ydGwgPyAnbGVmdCcgOiAncmlnaHQnKSA6ICd0b3AnXG5cbiAgICAgIGlmICh0aGlzLnZlcnRpY2FsKSByYW5nZS5yZXZlcnNlKClcblxuICAgICAgY29uc3QgdGlja3MgPSByYW5nZS5tYXAoaW5kZXggPT4ge1xuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IFtdXG5cbiAgICAgICAgaWYgKHRoaXMudGlja0xhYmVsc1tpbmRleF0pIHtcbiAgICAgICAgICBjaGlsZHJlbi5wdXNoKGgoJ2RpdicsIHtcbiAgICAgICAgICAgIGNsYXNzOiAndi1zbGlkZXJfX3RpY2stbGFiZWwnLFxuICAgICAgICAgIH0sIHRoaXMudGlja0xhYmVsc1tpbmRleF0pKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgd2lkdGggPSBpbmRleCAqICgxMDAgLyB0aGlzLm51bVRpY2tzKVxuICAgICAgICBjb25zdCBmaWxsZWQgPSB0aGlzLiR2dWV0aWZ5LnJ0bCA/ICgxMDAgLSB0aGlzLmlucHV0V2lkdGgpIDwgd2lkdGggOiB3aWR0aCA8IHRoaXMuaW5wdXRXaWR0aFxuXG4gICAgICAgIHJldHVybiBoKCdzcGFuJywge1xuICAgICAgICAgIGtleTogaW5kZXgsXG4gICAgICAgICAgY2xhc3M6IFsndi1zbGlkZXJfX3RpY2snLCB7XG4gICAgICAgICAgICAndi1zbGlkZXJfX3RpY2stLWZpbGxlZCc6IGZpbGxlZCxcbiAgICAgICAgICB9XSxcbiAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgd2lkdGg6IGAke3RpY2tTaXplfXB4YCxcbiAgICAgICAgICAgIGhlaWdodDogYCR7dGlja1NpemV9cHhgLFxuICAgICAgICAgICAgW2RpcmVjdGlvbl06IGBjYWxjKCR7d2lkdGh9JSAtICR7dGlja1NpemUgLyAyfXB4KWAsXG4gICAgICAgICAgICBbb2Zmc2V0RGlyZWN0aW9uXTogYGNhbGMoNTAlIC0gJHt0aWNrU2l6ZSAvIDJ9cHgpYCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LCBjaGlsZHJlbilcbiAgICAgIH0pXG5cbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiBbJ3Ytc2xpZGVyX190aWNrcy1jb250YWluZXInLCB7XG4gICAgICAgICAgJ3Ytc2xpZGVyX190aWNrcy1jb250YWluZXItLWFsd2F5cy1zaG93JzogdGhpcy50aWNrcyA9PT0gJ2Fsd2F5cycgfHwgdGhpcy50aWNrTGFiZWxzLmxlbmd0aCA+IDAsXG4gICAgICAgIH1dLFxuICAgICAgfSwgdGlja3MpXG4gICAgfSxcbiAgICBnZW5UaHVtYkNvbnRhaW5lciAoXG4gICAgICB2YWx1ZTogbnVtYmVyLFxuICAgICAgdmFsdWVXaWR0aDogbnVtYmVyLFxuICAgICAgaXNBY3RpdmU6IGJvb2xlYW4sXG4gICAgICBpc0ZvY3VzZWQ6IGJvb2xlYW4sXG4gICAgICBvbkZvY3VzOiBGdW5jdGlvbixcbiAgICAgIG9uQmx1cjogRnVuY3Rpb24sXG4gICAgICByZWYgPSAndGh1bWInXG4gICAgKTogVk5vZGUge1xuICAgICAgY29uc3QgY2hpbGRyZW4gPSBbdGhpcy5nZW5UaHVtYigpXVxuXG4gICAgICBjb25zdCB0aHVtYkxhYmVsQ29udGVudCA9IHRoaXMuZ2VuVGh1bWJMYWJlbENvbnRlbnQodmFsdWUpXG4gICAgICB0aGlzLnNob3dUaHVtYkxhYmVsICYmIGNoaWxkcmVuLnB1c2godGhpcy5nZW5UaHVtYkxhYmVsKHRodW1iTGFiZWxDb250ZW50KSlcblxuICAgICAgcmV0dXJuIGgoJ2RpdicsIHRoaXMuc2V0VGV4dENvbG9yKHRoaXMuY29tcHV0ZWRUaHVtYkNvbG9yLCB7XG4gICAgICAgIHJlZixcbiAgICAgICAga2V5OiByZWYsXG4gICAgICAgIGNsYXNzOiBbJ3Ytc2xpZGVyX190aHVtYi1jb250YWluZXInLCB7XG4gICAgICAgICAgJ3Ytc2xpZGVyX190aHVtYi1jb250YWluZXItLWFjdGl2ZSc6IGlzQWN0aXZlLFxuICAgICAgICAgICd2LXNsaWRlcl9fdGh1bWItY29udGFpbmVyLS1mb2N1c2VkJzogaXNGb2N1c2VkLFxuICAgICAgICAgICd2LXNsaWRlcl9fdGh1bWItY29udGFpbmVyLS1zaG93LWxhYmVsJzogdGhpcy5zaG93VGh1bWJMYWJlbCxcbiAgICAgICAgfV0sXG4gICAgICAgIHN0eWxlOiB0aGlzLmdldFRodW1iQ29udGFpbmVyU3R5bGVzKHZhbHVlV2lkdGgpLFxuICAgICAgICByb2xlOiAnc2xpZGVyJyxcbiAgICAgICAgdGFiaW5kZXg6IHRoaXMuaXNEaXNhYmxlZCA/IC0xIDogdGhpcy4kYXR0cnMudGFiaW5kZXggPyB0aGlzLiRhdHRycy50YWJpbmRleCA6IDAsXG4gICAgICAgICdhcmlhLWxhYmVsJzogdGhpcy4kYXR0cnNbJ2FyaWEtbGFiZWwnXSB8fCB0aGlzLmxhYmVsLFxuICAgICAgICAnYXJpYS12YWx1ZW1pbic6IHRoaXMubWluLFxuICAgICAgICAnYXJpYS12YWx1ZW1heCc6IHRoaXMubWF4LFxuICAgICAgICAnYXJpYS12YWx1ZW5vdyc6IHRoaXMuaW50ZXJuYWxWYWx1ZSxcbiAgICAgICAgJ2FyaWEtcmVhZG9ubHknOiBTdHJpbmcodGhpcy5pc1JlYWRvbmx5KSxcbiAgICAgICAgJ2FyaWEtb3JpZW50YXRpb24nOiB0aGlzLnZlcnRpY2FsID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJyxcbiAgICAgICAgb25Gb2N1cyxcbiAgICAgICAgb25CbHVyLFxuICAgICAgICBvbktleWRvd246IHRoaXMub25LZXlEb3duLFxuICAgICAgfSksIGNoaWxkcmVuKVxuICAgIH0sXG4gICAgZ2VuVGh1bWJMYWJlbENvbnRlbnQgKHZhbHVlOiBudW1iZXIgfCBzdHJpbmcpOiBhbnkge1xuICAgICAgcmV0dXJuIHRoaXMuJHNsb3RzWyd0aHVtYi1sYWJlbCddXG4gICAgICAgID8gdGhpcy4kc2xvdHNbJ3RodW1iLWxhYmVsJ10hKHsgdmFsdWUgfSlcbiAgICAgICAgOiBbaCgnc3BhbicsIFtTdHJpbmcodmFsdWUpXSldXG4gICAgfSxcbiAgICBnZW5UaHVtYkxhYmVsIChjb250ZW50OiBhbnkpOiBWTm9kZSB7XG4gICAgICBjb25zdCBzaXplID0gY29udmVydFRvVW5pdCh0aGlzLnRodW1iU2l6ZSlcblxuICAgICAgY29uc3QgdHJhbnNmb3JtID0gdGhpcy52ZXJ0aWNhbFxuICAgICAgICA/IGB0cmFuc2xhdGVZKDIwJSkgdHJhbnNsYXRlWSgkeyhOdW1iZXIodGhpcy50aHVtYlNpemUpIC8gMykgLSAxfXB4KSB0cmFuc2xhdGVYKDU1JSkgcm90YXRlKDEzNWRlZylgXG4gICAgICAgIDogYHRyYW5zbGF0ZVkoLTIwJSkgdHJhbnNsYXRlWSgtMTJweCkgdHJhbnNsYXRlWCgtNTAlKSByb3RhdGUoNDVkZWcpYFxuXG4gICAgICByZXR1cm4gaChWU2NhbGVUcmFuc2l0aW9uLCB7XG4gICAgICAgIG9yaWdpbjogJ2JvdHRvbSBjZW50ZXInLFxuICAgICAgfSwgKCkgPT4gW1xuICAgICAgICB3aXRoRGlyZWN0aXZlcyhoKCdkaXYnLCB7XG4gICAgICAgICAgY2xhc3M6ICd2LXNsaWRlcl9fdGh1bWItbGFiZWwtY29udGFpbmVyJyxcbiAgICAgICAgfSwgW1xuICAgICAgICAgIGgoJ2RpdicsIHRoaXMuc2V0QmFja2dyb3VuZENvbG9yKHRoaXMuY29tcHV0ZWRUaHVtYkNvbG9yLCB7XG4gICAgICAgICAgICBjbGFzczogJ3Ytc2xpZGVyX190aHVtYi1sYWJlbCcsXG4gICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICBoZWlnaHQ6IHNpemUsXG4gICAgICAgICAgICAgIHdpZHRoOiBzaXplLFxuICAgICAgICAgICAgICB0cmFuc2Zvcm0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pLCBbaCgnZGl2JywgY29udGVudCldKSxcbiAgICAgICAgXSksIFtcbiAgICAgICAgICBbdlNob3csIHRoaXMuaXNGb2N1c2VkIHx8IHRoaXMuaXNBY3RpdmUgfHwgdGhpcy50aHVtYkxhYmVsID09PSAnYWx3YXlzJ10sXG4gICAgICAgIF0pLFxuICAgICAgXSlcbiAgICB9LFxuICAgIGdlblRodW1iICgpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gaCgnZGl2JywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb21wdXRlZFRodW1iQ29sb3IsIHtcbiAgICAgICAgY2xhc3M6ICd2LXNsaWRlcl9fdGh1bWInLFxuICAgICAgfSkpXG4gICAgfSxcbiAgICBnZXRUaHVtYkNvbnRhaW5lclN0eWxlcyAod2lkdGg6IG51bWJlcik6IG9iamVjdCB7XG4gICAgICBjb25zdCBkaXJlY3Rpb24gPSB0aGlzLnZlcnRpY2FsID8gJ3RvcCcgOiAnbGVmdCdcbiAgICAgIGxldCB2YWx1ZSA9IHRoaXMuJHZ1ZXRpZnkucnRsID8gMTAwIC0gd2lkdGggOiB3aWR0aFxuICAgICAgdmFsdWUgPSB0aGlzLnZlcnRpY2FsID8gMTAwIC0gdmFsdWUgOiB2YWx1ZVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICB0cmFuc2l0aW9uOiB0aGlzLnRyYWNrVHJhbnNpdGlvbixcbiAgICAgICAgW2RpcmVjdGlvbl06IGAke3ZhbHVlfSVgLFxuICAgICAgfVxuICAgIH0sXG4gICAgb25TbGlkZXJNb3VzZURvd24gKGU6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICAgdGhpcy5vbGRWYWx1ZSA9IHRoaXMuaW50ZXJuYWxWYWx1ZVxuICAgICAgdGhpcy5pc0FjdGl2ZSA9IHRydWVcblxuICAgICAgaWYgKChlLnRhcmdldCBhcyBFbGVtZW50KT8ubWF0Y2hlcygnLnYtc2xpZGVyX190aHVtYi1jb250YWluZXIsIC52LXNsaWRlcl9fdGh1bWItY29udGFpbmVyIConKSkge1xuICAgICAgICB0aGlzLnRodW1iUHJlc3NlZCA9IHRydWVcbiAgICAgICAgY29uc3QgZG9tUmVjdCA9IChlLnRhcmdldCBhcyBFbGVtZW50KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICBjb25zdCB0b3VjaCA9ICd0b3VjaGVzJyBpbiBlID8gZS50b3VjaGVzWzBdIDogZVxuICAgICAgICB0aGlzLnN0YXJ0T2Zmc2V0ID0gdGhpcy52ZXJ0aWNhbFxuICAgICAgICAgID8gdG91Y2guY2xpZW50WSAtIChkb21SZWN0LnRvcCArIGRvbVJlY3QuaGVpZ2h0IC8gMilcbiAgICAgICAgICA6IHRvdWNoLmNsaWVudFggLSAoZG9tUmVjdC5sZWZ0ICsgZG9tUmVjdC53aWR0aCAvIDIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXJ0T2Zmc2V0ID0gMFxuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMubW91c2VUaW1lb3V0KVxuICAgICAgICB0aGlzLm1vdXNlVGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnRodW1iUHJlc3NlZCA9IHRydWVcbiAgICAgICAgfSwgMzAwKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBtb3VzZVVwT3B0aW9ucyA9IHBhc3NpdmVTdXBwb3J0ZWQgPyB7IHBhc3NpdmU6IHRydWUsIGNhcHR1cmU6IHRydWUgfSA6IHRydWVcbiAgICAgIGNvbnN0IG1vdXNlTW92ZU9wdGlvbnMgPSBwYXNzaXZlU3VwcG9ydGVkID8geyBwYXNzaXZlOiB0cnVlIH0gOiBmYWxzZVxuXG4gICAgICBjb25zdCBpc1RvdWNoRXZlbnQgPSAndG91Y2hlcycgaW4gZVxuXG4gICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpXG4gICAgICB0aGlzLmFwcC5hZGRFdmVudExpc3RlbmVyKGlzVG91Y2hFdmVudCA/ICd0b3VjaG1vdmUnIDogJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUsIG1vdXNlTW92ZU9wdGlvbnMpXG4gICAgICBhZGRPbmNlRXZlbnRMaXN0ZW5lcih0aGlzLmFwcCwgaXNUb3VjaEV2ZW50ID8gJ3RvdWNoZW5kJyA6ICdtb3VzZXVwJywgdGhpcy5vblNsaWRlck1vdXNlVXAsIG1vdXNlVXBPcHRpb25zKVxuXG4gICAgICB0aGlzLiRlbWl0KCdzdGFydCcsIHRoaXMuaW50ZXJuYWxWYWx1ZSlcbiAgICB9LFxuICAgIG9uU2xpZGVyTW91c2VVcCAoZTogRXZlbnQpIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5tb3VzZVRpbWVvdXQpXG4gICAgICB0aGlzLnRodW1iUHJlc3NlZCA9IGZhbHNlXG4gICAgICBjb25zdCBtb3VzZU1vdmVPcHRpb25zID0gcGFzc2l2ZVN1cHBvcnRlZCA/IHsgcGFzc2l2ZTogdHJ1ZSB9IDogZmFsc2VcbiAgICAgIHRoaXMuYXBwLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMub25Nb3VzZU1vdmUsIG1vdXNlTW92ZU9wdGlvbnMpXG4gICAgICB0aGlzLmFwcC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlLCBtb3VzZU1vdmVPcHRpb25zKVxuXG4gICAgICB0aGlzLiRlbWl0KCdtb3VzZXVwJywgZSlcbiAgICAgIHRoaXMuJGVtaXQoJ2VuZCcsIHRoaXMuaW50ZXJuYWxWYWx1ZSlcbiAgICAgIGlmICghZGVlcEVxdWFsKHRoaXMub2xkVmFsdWUsIHRoaXMuaW50ZXJuYWxWYWx1ZSkpIHtcbiAgICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOm1vZGVsVmFsdWUnLCB0aGlzLmludGVybmFsVmFsdWUpXG4gICAgICAgIHRoaXMubm9DbGljayA9IHRydWVcbiAgICAgIH1cblxuICAgICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlXG4gICAgfSxcbiAgICBvbk1vdXNlTW92ZSAoZTogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpIHtcbiAgICAgIGlmIChlLnR5cGUgPT09ICdtb3VzZW1vdmUnKSB7XG4gICAgICAgIHRoaXMudGh1bWJQcmVzc2VkID0gdHJ1ZVxuICAgICAgfVxuICAgICAgdGhpcy5pbnRlcm5hbFZhbHVlID0gdGhpcy5wYXJzZU1vdXNlTW92ZShlKVxuICAgIH0sXG4gICAgb25LZXlEb3duIChlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICBpZiAoIXRoaXMuaXNJbnRlcmFjdGl2ZSkgcmV0dXJuXG5cbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5wYXJzZUtleURvd24oZSwgdGhpcy5pbnRlcm5hbFZhbHVlKVxuXG4gICAgICBpZiAoXG4gICAgICAgIHZhbHVlID09IG51bGwgfHxcbiAgICAgICAgdmFsdWUgPCB0aGlzLm1pblZhbHVlIHx8XG4gICAgICAgIHZhbHVlID4gdGhpcy5tYXhWYWx1ZVxuICAgICAgKSByZXR1cm5cblxuICAgICAgdGhpcy5pbnRlcm5hbFZhbHVlID0gdmFsdWVcbiAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTptb2RlbFZhbHVlJywgdmFsdWUpXG4gICAgfSxcbiAgICBvblNsaWRlckNsaWNrIChlOiBNb3VzZUV2ZW50KSB7XG4gICAgICBpZiAodGhpcy5ub0NsaWNrKSB7XG4gICAgICAgIHRoaXMubm9DbGljayA9IGZhbHNlXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgY29uc3QgdGh1bWIgPSB0aGlzLiRyZWZzLnRodW1iIGFzIEhUTUxFbGVtZW50XG4gICAgICB0aHVtYi5mb2N1cygpXG5cbiAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSlcbiAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTptb2RlbFZhbHVlJywgdGhpcy5pbnRlcm5hbFZhbHVlKVxuICAgICAgdGhpcy4kZW1pdCgnY2hhbmdlJywgdGhpcy5pbnRlcm5hbFZhbHVlKVxuICAgIH0sXG4gICAgb25CbHVyIChlOiBFdmVudCkge1xuICAgICAgdGhpcy5pc0ZvY3VzZWQgPSBmYWxzZVxuXG4gICAgICB0aGlzLiRlbWl0KCdibHVyJywgZSlcbiAgICB9LFxuICAgIG9uRm9jdXMgKGU6IEV2ZW50KSB7XG4gICAgICB0aGlzLmlzRm9jdXNlZCA9IHRydWVcblxuICAgICAgdGhpcy4kZW1pdCgnZm9jdXMnLCBlKVxuICAgIH0sXG4gICAgcGFyc2VNb3VzZU1vdmUgKGU6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSB7XG4gICAgICBjb25zdCBzdGFydCA9IHRoaXMudmVydGljYWwgPyAndG9wJyA6ICdsZWZ0J1xuICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy52ZXJ0aWNhbCA/ICdoZWlnaHQnIDogJ3dpZHRoJ1xuICAgICAgY29uc3QgY2xpY2sgPSB0aGlzLnZlcnRpY2FsID8gJ2NsaWVudFknIDogJ2NsaWVudFgnXG5cbiAgICAgIGNvbnN0IHtcbiAgICAgICAgW3N0YXJ0XTogdHJhY2tTdGFydCxcbiAgICAgICAgW2xlbmd0aF06IHRyYWNrTGVuZ3RoLFxuICAgICAgfSA9IHRoaXMuJHJlZnMudHJhY2suZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIGNvbnN0IGNsaWNrT2Zmc2V0ID0gJ3RvdWNoZXMnIGluIGUgPyBlLnRvdWNoZXNbMF1bY2xpY2tdIDogZVtjbGlja11cblxuICAgICAgLy8gSXQgaXMgcG9zc2libGUgZm9yIGxlZnQgdG8gYmUgTmFOLCBmb3JjZSB0byBudW1iZXJcbiAgICAgIGxldCBjbGlja1BvcyA9IE1hdGgubWluKE1hdGgubWF4KChjbGlja09mZnNldCAtIHRyYWNrU3RhcnQgLSB0aGlzLnN0YXJ0T2Zmc2V0KSAvIHRyYWNrTGVuZ3RoLCAwKSwgMSkgfHwgMFxuXG4gICAgICBpZiAodGhpcy52ZXJ0aWNhbCkgY2xpY2tQb3MgPSAxIC0gY2xpY2tQb3NcbiAgICAgIGlmICh0aGlzLiR2dWV0aWZ5LnJ0bCkgY2xpY2tQb3MgPSAxIC0gY2xpY2tQb3NcblxuICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodGhpcy5taW4pICsgY2xpY2tQb3MgKiAodGhpcy5tYXhWYWx1ZSAtIHRoaXMubWluVmFsdWUpXG4gICAgfSxcbiAgICBwYXJzZUtleURvd24gKGU6IEtleWJvYXJkRXZlbnQsIHZhbHVlOiBudW1iZXIpIHtcbiAgICAgIGlmICghdGhpcy5pc0ludGVyYWN0aXZlKSByZXR1cm5cblxuICAgICAgY29uc3QgeyBwYWdldXAsIHBhZ2Vkb3duLCBlbmQsIGhvbWUsIGxlZnQsIHJpZ2h0LCBkb3duLCB1cCB9ID0ga2V5Q29kZXNcblxuICAgICAgaWYgKCFbcGFnZXVwLCBwYWdlZG93biwgZW5kLCBob21lLCBsZWZ0LCByaWdodCwgZG93biwgdXBdLmluY2x1ZGVzKGUua2V5Q29kZSkpIHJldHVyblxuXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGNvbnN0IHN0ZXAgPSB0aGlzLnN0ZXBOdW1lcmljIHx8IDFcbiAgICAgIGNvbnN0IHN0ZXBzID0gKHRoaXMubWF4VmFsdWUgLSB0aGlzLm1pblZhbHVlKSAvIHN0ZXBcbiAgICAgIGlmIChbbGVmdCwgcmlnaHQsIGRvd24sIHVwXS5pbmNsdWRlcyhlLmtleUNvZGUpKSB7XG4gICAgICAgIGNvbnN0IGluY3JlYXNlID0gdGhpcy4kdnVldGlmeS5ydGwgPyBbbGVmdCwgdXBdIDogW3JpZ2h0LCB1cF1cbiAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gaW5jcmVhc2UuaW5jbHVkZXMoZS5rZXlDb2RlKSA/IDEgOiAtMVxuICAgICAgICBjb25zdCBtdWx0aXBsaWVyID0gZS5zaGlmdEtleSA/IDMgOiAoZS5jdHJsS2V5ID8gMiA6IDEpXG5cbiAgICAgICAgdmFsdWUgPSB2YWx1ZSArIChkaXJlY3Rpb24gKiBzdGVwICogbXVsdGlwbGllcilcbiAgICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09PSBob21lKSB7XG4gICAgICAgIHZhbHVlID0gdGhpcy5taW5WYWx1ZVxuICAgICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT09IGVuZCkge1xuICAgICAgICB2YWx1ZSA9IHRoaXMubWF4VmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IGUua2V5Q29kZSA9PT0gcGFnZWRvd24gPyAxIDogLTFcbiAgICAgICAgdmFsdWUgPSB2YWx1ZSAtIChkaXJlY3Rpb24gKiBzdGVwICogKHN0ZXBzID4gMTAwID8gc3RlcHMgLyAxMCA6IDEwKSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfSxcbiAgICByb3VuZFZhbHVlICh2YWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgIGlmICghdGhpcy5zdGVwTnVtZXJpYykgcmV0dXJuIHZhbHVlXG4gICAgICAvLyBGb3JtYXQgaW5wdXQgdmFsdWUgdXNpbmcgdGhlIHNhbWUgbnVtYmVyXG4gICAgICAvLyBvZiBkZWNpbWFscyBwbGFjZXMgYXMgaW4gdGhlIHN0ZXAgcHJvcFxuICAgICAgY29uc3QgdHJpbW1lZFN0ZXAgPSB0aGlzLnN0ZXAudG9TdHJpbmcoKS50cmltKClcbiAgICAgIGNvbnN0IGRlY2ltYWxzID0gdHJpbW1lZFN0ZXAuaW5kZXhPZignLicpID4gLTFcbiAgICAgICAgPyAodHJpbW1lZFN0ZXAubGVuZ3RoIC0gdHJpbW1lZFN0ZXAuaW5kZXhPZignLicpIC0gMSlcbiAgICAgICAgOiAwXG4gICAgICBjb25zdCBvZmZzZXQgPSB0aGlzLm1pblZhbHVlICUgdGhpcy5zdGVwTnVtZXJpY1xuXG4gICAgICBjb25zdCBuZXdWYWx1ZSA9IE1hdGgucm91bmQoKHZhbHVlIC0gb2Zmc2V0KSAvIHRoaXMuc3RlcE51bWVyaWMpICogdGhpcy5zdGVwTnVtZXJpYyArIG9mZnNldFxuXG4gICAgICByZXR1cm4gcGFyc2VGbG9hdChNYXRoLm1pbihuZXdWYWx1ZSwgdGhpcy5tYXhWYWx1ZSkudG9GaXhlZChkZWNpbWFscykpXG4gICAgfSxcbiAgfSxcbn0pXG4iXX0=