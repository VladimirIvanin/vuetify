// Styles
import './VTextField.sass';
// Extensions
import VInput from '../VInput';
// Components
import VCounter from '../VCounter';
import VLabel from '../VLabel';
// Mixins
import Intersectable from '../../mixins/intersectable';
import Loadable from '../../mixins/loadable';
import Validatable from '../../mixins/validatable';
// Directives
import resize from '../../directives/resize';
// Utilities
import { attachedRoot } from '../../util/dom';
import { convertToUnit, getSlot, keyCodes } from '../../util/helpers';
import { breaking, consoleWarn } from '../../util/console';
// Types
import mixins from '../../util/mixins';
import { withDirectives, h } from 'vue';
const baseMixins = mixins(VInput, Intersectable({
    onVisible: [
        'onResize',
        'tryAutofocus',
    ],
}), Loadable);
const dirtyTypes = ['color', 'file', 'time', 'date', 'datetime-local', 'week', 'month'];
/* @vue/component */
export default baseMixins.extend({
    name: 'v-text-field',
    props: {
        appendOuterIcon: String,
        autofocus: Boolean,
        clearable: Boolean,
        clearIcon: {
            type: String,
            default: '$clear',
        },
        counter: [Boolean, Number, String],
        counterValue: Function,
        filled: Boolean,
        flat: Boolean,
        fullWidth: Boolean,
        label: String,
        outlined: Boolean,
        placeholder: String,
        prefix: String,
        prependInnerIcon: String,
        persistentPlaceholder: Boolean,
        reverse: Boolean,
        rounded: Boolean,
        shaped: Boolean,
        singleLine: Boolean,
        solo: Boolean,
        soloInverted: Boolean,
        suffix: String,
        type: {
            type: String,
            default: 'text',
        },
    },
    emits: ['update:modelValue', 'blur', 'focus', 'keydown'],
    data: () => ({
        badInput: false,
        labelWidth: 0,
        prefixWidth: 0,
        prependWidth: 0,
        initialValue: null,
        isBooted: false,
        isClearing: false,
    }),
    computed: {
        classes() {
            return {
                ...VInput.computed.classes.call(this),
                'v-text-field': true,
                'v-text-field--full-width': this.fullWidth,
                'v-text-field--prefix': this.prefix,
                'v-text-field--single-line': this.isSingle,
                'v-text-field--solo': this.isSolo,
                'v-text-field--solo-inverted': this.soloInverted,
                'v-text-field--solo-flat': this.flat,
                'v-text-field--filled': this.filled,
                'v-text-field--is-booted': this.isBooted,
                'v-text-field--enclosed': this.isEnclosed,
                'v-text-field--reverse': this.reverse,
                'v-text-field--outlined': this.outlined,
                'v-text-field--placeholder': this.placeholder,
                'v-text-field--rounded': this.rounded,
                'v-text-field--shaped': this.shaped,
            };
        },
        computedColor() {
            const computedColor = Validatable.computed.computedColor.call(this);
            if (!this.soloInverted || !this.isFocused)
                return computedColor;
            return this.color || 'primary';
        },
        computedCounterValue() {
            if (typeof this.counterValue === 'function') {
                return this.counterValue(this.internalValue);
            }
            return [...(this.internalValue || '').toString()].length;
        },
        hasCounter() {
            return this.counter !== false && this.counter != null;
        },
        hasDetails() {
            return VInput.computed.hasDetails.call(this) || this.hasCounter;
        },
        internalValue: {
            get() {
                return this.lazyValue;
            },
            set(val) {
                this.lazyValue = val;
                this.$emit('update:modelValue', this.lazyValue);
            },
        },
        isDirty() {
            var _a;
            return ((_a = this.lazyValue) === null || _a === void 0 ? void 0 : _a.toString().length) > 0 || this.badInput;
        },
        isEnclosed() {
            return (this.filled ||
                this.isSolo ||
                this.outlined);
        },
        isLabelActive() {
            return this.isDirty || dirtyTypes.includes(this.type);
        },
        isSingle() {
            return (this.isSolo ||
                this.singleLine ||
                this.fullWidth ||
                // https://material.io/components/text-fields/#filled-text-field
                (this.filled && !this.hasLabel));
        },
        isSolo() {
            return this.solo || this.soloInverted;
        },
        labelPosition() {
            let offset = (this.prefix && !this.labelValue) ? this.prefixWidth : 0;
            if (this.labelValue && this.prependWidth)
                offset -= this.prependWidth;
            return (this.$vuetify.rtl === this.reverse) ? {
                left: offset,
                right: 'auto',
            } : {
                left: 'auto',
                right: offset,
            };
        },
        showLabel() {
            return this.hasLabel && !(this.isSingle && this.labelValue);
        },
        labelValue() {
            return this.isFocused || this.isLabelActive || this.persistentPlaceholder;
        },
    },
    watch: {
        // labelValue: 'setLabelWidth', // moved to mounted, see #11533
        outlined: 'setLabelWidth',
        label() {
            this.$nextTick(this.setLabelWidth);
        },
        prefix() {
            this.$nextTick(this.setPrefixWidth);
        },
        isFocused: 'updateValue',
        modelValue(val) {
            this.lazyValue = val;
        },
    },
    created() {
        const breakingProps = [
            ['value', 'modelValue'],
            ['onInput', 'onUpdate:modelValue'],
        ];
        /* istanbul ignore next */
        breakingProps.forEach(([original, replacement]) => {
            if (this.$attrs.hasOwnProperty(original))
                breaking(original, replacement, this);
        });
        /* istanbul ignore if */
        if (this.shaped && !(this.filled || this.outlined || this.isSolo)) {
            consoleWarn('shaped should be used with either filled or outlined', this);
        }
    },
    mounted() {
        // #11533
        this.$watch(() => this.labelValue, this.setLabelWidth);
        this.autofocus && this.tryAutofocus();
        requestAnimationFrame(() => {
            this.isBooted = true;
            requestAnimationFrame(() => {
                if (!this.isIntersecting) {
                    this.onResize();
                }
            });
        });
    },
    methods: {
        /** @public */
        focus() {
            this.onFocus();
        },
        /** @public */
        blur(e) {
            // https://github.com/vuetifyjs/vuetify/issues/5913
            // Safari tab order gets broken if called synchronous
            window.requestAnimationFrame(() => {
                this.$refs.input && this.$refs.input.blur();
            });
        },
        clearableCallback() {
            this.$refs.input && this.$refs.input.focus();
            this.$nextTick(() => this.internalValue = null);
        },
        genAppendSlot() {
            const slot = [];
            if (this.$slots['append-outer']) {
                slot.push(this.$slots['append-outer']);
            }
            else if (this.appendOuterIcon) {
                slot.push(this.genIcon('appendOuter'));
            }
            return this.genSlot('append', 'outer', slot);
        },
        genPrependInnerSlot() {
            const slot = [];
            if (this.$slots['prepend-inner']) {
                slot.push(this.$slots['prepend-inner']());
            }
            else if (this.prependInnerIcon) {
                slot.push(this.genIcon('prependInner'));
            }
            return this.genSlot('prepend', 'inner', slot);
        },
        genIconSlot() {
            const slot = [];
            if (this.$slots.append) {
                slot.push(this.$slots.append);
            }
            else if (this.appendIcon) {
                slot.push(this.genIcon('append'));
            }
            return this.genSlot('append', 'inner', slot);
        },
        genInputSlot() {
            const input = VInput.methods.genInputSlot.call(this);
            const prepend = this.genPrependInnerSlot();
            if (prepend) {
                input.children = input.children || [];
                input.children.unshift(prepend);
            }
            return input;
        },
        genClearIcon() {
            if (!this.clearable)
                return null;
            // if the text field has no content then don't display the clear icon.
            // We add an empty div because other controls depend on a ref to append inner
            if (!this.isDirty) {
                return this.genSlot('append', 'inner', [
                    h('div'),
                ]);
            }
            return this.genSlot('append', 'inner', [
                this.genIcon('clear', this.clearableCallback),
            ]);
        },
        genCounter() {
            var _a, _b, _c;
            if (!this.hasCounter)
                return null;
            const max = this.counter === true ? this.attrs$.maxlength : this.counter;
            const props = {
                dark: this.dark,
                light: this.light,
                max,
                value: this.computedCounterValue,
            };
            return (_c = (_b = (_a = this.$slots).counter) === null || _b === void 0 ? void 0 : _b.call(_a, { props })) !== null && _c !== void 0 ? _c : h(VCounter, props);
        },
        genControl() {
            return VInput.methods.genControl.call(this);
        },
        genDefaultSlot() {
            return [
                this.genFieldset(),
                this.genTextFieldSlot(),
                this.genClearIcon(),
                this.genIconSlot(),
                this.genProgress(),
            ];
        },
        genFieldset() {
            if (!this.outlined)
                return null;
            return h('fieldset', {
                'aria-hidden': true
            }, [this.genLegend()]);
        },
        genLabel() {
            if (!this.showLabel)
                return null;
            const data = {
                ref: "label",
                absolute: true,
                color: this.validationState,
                dark: this.dark,
                disabled: this.isDisabled,
                focused: !this.isSingle && (this.isFocused || !!this.validationState),
                for: this.computedId,
                left: this.labelPosition.left,
                light: this.light,
                right: this.labelPosition.right,
                value: this.labelValue
            };
            return h(VLabel, data, () => getSlot(this, 'label') || this.label);
        },
        genLegend() {
            const width = !this.singleLine && (this.labelValue || this.isDirty) ? this.labelWidth : 0;
            const span = h('span', {
                innerHTML: '&#8203;',
                class: 'notranslate',
            });
            return h('legend', {
                style: {
                    width: !this.isSingle ? convertToUnit(width) : undefined,
                },
            }, [span]);
        },
        genInput() {
            const listeners = Object.assign({}, this.listeners$);
            delete listeners.change; // Change should not be bound externally
            const { title, ...inputAttrs } = this.attrs$;
            const node = h('input', {
                style: {},
                value: (this.type === 'number' && Object.is(this.lazyValue, -0)) ? '-0' : this.lazyValue,
                ...inputAttrs,
                autofocus: this.autofocus,
                disabled: this.isDisabled,
                id: this.computedId,
                placeholder: this.persistentPlaceholder || this.isFocused || !this.hasLabel ? this.placeholder : undefined,
                readonly: this.isReadonly,
                type: this.type,
                onBlur: this.onBlur,
                onInput: this.onInput,
                onFocus: this.onFocus,
                onKeydown: this.onKeyDown,
                ...listeners,
                ref: 'input'
            });
            return withDirectives(node, [
                [
                    resize,
                    this.onResize,
                    '',
                    { quiet: true }
                ]
            ]);
        },
        genMessages() {
            if (!this.showDetails)
                return null;
            const messagesNode = VInput.methods.genMessages.call(this);
            const counterNode = this.genCounter();
            return h('div', {
                class: 'v-text-field__details',
            }, [
                messagesNode,
                counterNode,
            ]);
        },
        genTextFieldSlot() {
            return h('div', {
                class: 'v-text-field__slot',
            }, [
                this.genLabel(),
                this.prefix ? this.genAffix('prefix') : null,
                this.genInput(),
                this.suffix ? this.genAffix('suffix') : null,
            ]);
        },
        genAffix(type) {
            return h('div', {
                class: `v-text-field__${type}`,
                ref: type,
            }, this[type]);
        },
        onBlur(e) {
            this.isFocused = false;
            e && this.$nextTick(() => this.$emit('blur', e));
        },
        onClick() {
            if (this.isFocused || this.isDisabled || !this.$refs.input)
                return;
            this.$refs.input.focus();
        },
        onFocus(e) {
            if (!this.$refs.input)
                return;
            const root = attachedRoot(this.$el);
            if (!root)
                return;
            if (root.activeElement !== this.$refs.input) {
                return this.$refs.input.focus();
            }
            if (!this.isFocused) {
                this.isFocused = true;
                e && this.$emit('focus', e);
            }
        },
        onInput(e) {
            const target = e.target;
            this.internalValue = target.value;
            this.badInput = target.validity && target.validity.badInput;
        },
        onKeyDown(e) {
            if (e.keyCode === keyCodes.enter &&
                this.lazyValue !== this.initialValue) {
                this.initialValue = this.lazyValue;
                this.$emit('update:modelValue', this.initialValue);
            }
            this.$emit('keydown', e);
        },
        onMouseDown(e) {
            // Prevent input from being blurred
            if (e.target !== this.$refs.input) {
                e.preventDefault();
                e.stopPropagation();
            }
            VInput.methods.onMouseDown.call(this, e);
        },
        onMouseUp(e) {
            if (this.hasMouseDown)
                this.focus();
            VInput.methods.onMouseUp.call(this, e);
        },
        setLabelWidth() {
            var _a, _b, _c, _d;
            if (!this.outlined)
                return;
            this.labelWidth = ((_b = (_a = this.$refs) === null || _a === void 0 ? void 0 : _a.label) === null || _b === void 0 ? void 0 : _b.$el)
                ? Math.min(((_d = (_c = this.$refs) === null || _c === void 0 ? void 0 : _c.label) === null || _d === void 0 ? void 0 : _d.$el.scrollWidth) * 0.75 + 6, this.$el.offsetWidth - 24)
                : 0;
        },
        setPrefixWidth() {
            if (!this.$refs.prefix)
                return;
            this.prefixWidth = this.$refs.prefix.offsetWidth;
        },
        setPrependWidth() {
            if (!this.outlined || !this.$refs['prepend-inner'])
                return;
            this.prependWidth = this.$refs['prepend-inner'].offsetWidth;
        },
        tryAutofocus() {
            if (!this.autofocus ||
                typeof document === 'undefined' ||
                !this.$refs.input)
                return false;
            const root = attachedRoot(this.$el);
            if (!root || root.activeElement === this.$refs.input)
                return false;
            this.$refs.input.focus();
            return true;
        },
        updateValue(val) {
            // Sets validationState from validatable
            this.hasColor = val;
            if (val) {
                this.initialValue = this.lazyValue;
            }
            else if (this.initialValue !== this.lazyValue) {
                this.$emit('update:modelValue', this.lazyValue);
            }
        },
        onResize() {
            this.setLabelWidth();
            this.setPrefixWidth();
            this.setPrependWidth();
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRleHRGaWVsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZUZXh0RmllbGQvVlRleHRGaWVsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxtQkFBbUIsQ0FBQTtBQUUxQixhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFBO0FBRTlCLGFBQWE7QUFDYixPQUFPLFFBQVEsTUFBTSxhQUFhLENBQUE7QUFDbEMsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFBO0FBRTlCLFNBQVM7QUFDVCxPQUFPLGFBQWEsTUFBTSw0QkFBNEIsQ0FBQTtBQUN0RCxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUM1QyxPQUFPLFdBQVcsTUFBTSwwQkFBMEIsQ0FBQTtBQUVsRCxhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0seUJBQXlCLENBQUE7QUFHNUMsWUFBWTtBQUNaLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUM3QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUNyRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRTFELFFBQVE7QUFDUixPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUV0QyxPQUFPLEVBQUUsY0FBYyxFQUFFLENBQUMsRUFBRSxNQUFNLEtBQUssQ0FBQTtBQUV2QyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQ3ZCLE1BQU0sRUFDTixhQUFhLENBQUM7SUFDWixTQUFTLEVBQUU7UUFDVCxVQUFVO1FBQ1YsY0FBYztLQUNmO0NBQ0YsQ0FBQyxFQUNGLFFBQVEsQ0FDVCxDQUFBO0FBV0QsTUFBTSxVQUFVLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsTUFB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QUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO2FBQ2hEO1FBQ0gsQ0FBQztRQUNELFFBQVE7WUFDTixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7WUFDcEIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFBO1lBQ3JCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQTtRQUN4QixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcbmltcG9ydCAnLi9WVGV4dEZpZWxkLnNhc3MnXG5cbi8vIEV4dGVuc2lvbnNcbmltcG9ydCBWSW5wdXQgZnJvbSAnLi4vVklucHV0J1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgVkNvdW50ZXIgZnJvbSAnLi4vVkNvdW50ZXInXG5pbXBvcnQgVkxhYmVsIGZyb20gJy4uL1ZMYWJlbCdcblxuLy8gTWl4aW5zXG5pbXBvcnQgSW50ZXJzZWN0YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvaW50ZXJzZWN0YWJsZSdcbmltcG9ydCBMb2FkYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvbG9hZGFibGUnXG5pbXBvcnQgVmFsaWRhdGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3ZhbGlkYXRhYmxlJ1xuXG4vLyBEaXJlY3RpdmVzXG5pbXBvcnQgcmVzaXplIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvcmVzaXplJ1xuaW1wb3J0IHJpcHBsZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3JpcHBsZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBhdHRhY2hlZFJvb3QgfSBmcm9tICcuLi8uLi91dGlsL2RvbSdcbmltcG9ydCB7IGNvbnZlcnRUb1VuaXQsIGdldFNsb3QsIGtleUNvZGVzIH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IHsgYnJlYWtpbmcsIGNvbnNvbGVXYXJuIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IFZOb2RlLCBQcm9wVHlwZSB9IGZyb20gJ3Z1ZS90eXBlcydcbmltcG9ydCB7IHdpdGhEaXJlY3RpdmVzLCBoIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBiYXNlTWl4aW5zID0gbWl4aW5zKFxuICBWSW5wdXQsXG4gIEludGVyc2VjdGFibGUoe1xuICAgIG9uVmlzaWJsZTogW1xuICAgICAgJ29uUmVzaXplJyxcbiAgICAgICd0cnlBdXRvZm9jdXMnLFxuICAgIF0sXG4gIH0pLFxuICBMb2FkYWJsZSxcbilcbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgSW5zdGFuY2VUeXBlPHR5cGVvZiBiYXNlTWl4aW5zPiB7XG4gICRyZWZzOiB7XG4gICAgbGFiZWw6IEhUTUxFbGVtZW50XG4gICAgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnRcbiAgICAncHJlcGVuZC1pbm5lcic6IEhUTUxFbGVtZW50XG4gICAgcHJlZml4OiBIVE1MRWxlbWVudFxuICAgIHN1ZmZpeDogSFRNTEVsZW1lbnRcbiAgfVxufVxuXG5jb25zdCBkaXJ0eVR5cGVzID0gWydjb2xvcicsICdmaWxlJywgJ3RpbWUnLCAnZGF0ZScsICdkYXRldGltZS1sb2NhbCcsICd3ZWVrJywgJ21vbnRoJ11cblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGJhc2VNaXhpbnMuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtdGV4dC1maWVsZCcsXG5cbiAgcHJvcHM6IHtcbiAgICBhcHBlbmRPdXRlckljb246IFN0cmluZyxcbiAgICBhdXRvZm9jdXM6IEJvb2xlYW4sXG4gICAgY2xlYXJhYmxlOiBCb29sZWFuLFxuICAgIGNsZWFySWNvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyRjbGVhcicsXG4gICAgfSxcbiAgICBjb3VudGVyOiBbQm9vbGVhbiwgTnVtYmVyLCBTdHJpbmddLFxuICAgIGNvdW50ZXJWYWx1ZTogRnVuY3Rpb24gYXMgUHJvcFR5cGU8KHZhbHVlOiBhbnkpID0+IG51bWJlcj4sXG4gICAgZmlsbGVkOiBCb29sZWFuLFxuICAgIGZsYXQ6IEJvb2xlYW4sXG4gICAgZnVsbFdpZHRoOiBCb29sZWFuLFxuICAgIGxhYmVsOiBTdHJpbmcsXG4gICAgb3V0bGluZWQ6IEJvb2xlYW4sXG4gICAgcGxhY2Vob2xkZXI6IFN0cmluZyxcbiAgICBwcmVmaXg6IFN0cmluZyxcbiAgICBwcmVwZW5kSW5uZXJJY29uOiBTdHJpbmcsXG4gICAgcGVyc2lzdGVudFBsYWNlaG9sZGVyOiBCb29sZWFuLFxuICAgIHJldmVyc2U6IEJvb2xlYW4sXG4gICAgcm91bmRlZDogQm9vbGVhbixcbiAgICBzaGFwZWQ6IEJvb2xlYW4sXG4gICAgc2luZ2xlTGluZTogQm9vbGVhbixcbiAgICBzb2xvOiBCb29sZWFuLFxuICAgIHNvbG9JbnZlcnRlZDogQm9vbGVhbixcbiAgICBzdWZmaXg6IFN0cmluZyxcbiAgICB0eXBlOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAndGV4dCcsXG4gICAgfSxcbiAgfSxcblxuICBlbWl0czogWyd1cGRhdGU6bW9kZWxWYWx1ZScsICdibHVyJywgJ2ZvY3VzJywgJ2tleWRvd24nXSxcblxuICBkYXRhOiAoKSA9PiAoe1xuICAgIGJhZElucHV0OiBmYWxzZSxcbiAgICBsYWJlbFdpZHRoOiAwLFxuICAgIHByZWZpeFdpZHRoOiAwLFxuICAgIHByZXBlbmRXaWR0aDogMCxcbiAgICBpbml0aWFsVmFsdWU6IG51bGwsXG4gICAgaXNCb290ZWQ6IGZhbHNlLFxuICAgIGlzQ2xlYXJpbmc6IGZhbHNlLFxuICB9KSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5WSW5wdXQuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi10ZXh0LWZpZWxkJzogdHJ1ZSxcbiAgICAgICAgJ3YtdGV4dC1maWVsZC0tZnVsbC13aWR0aCc6IHRoaXMuZnVsbFdpZHRoLFxuICAgICAgICAndi10ZXh0LWZpZWxkLS1wcmVmaXgnOiB0aGlzLnByZWZpeCxcbiAgICAgICAgJ3YtdGV4dC1maWVsZC0tc2luZ2xlLWxpbmUnOiB0aGlzLmlzU2luZ2xlLFxuICAgICAgICAndi10ZXh0LWZpZWxkLS1zb2xvJzogdGhpcy5pc1NvbG8sXG4gICAgICAgICd2LXRleHQtZmllbGQtLXNvbG8taW52ZXJ0ZWQnOiB0aGlzLnNvbG9JbnZlcnRlZCxcbiAgICAgICAgJ3YtdGV4dC1maWVsZC0tc29sby1mbGF0JzogdGhpcy5mbGF0LFxuICAgICAgICAndi10ZXh0LWZpZWxkLS1maWxsZWQnOiB0aGlzLmZpbGxlZCxcbiAgICAgICAgJ3YtdGV4dC1maWVsZC0taXMtYm9vdGVkJzogdGhpcy5pc0Jvb3RlZCxcbiAgICAgICAgJ3YtdGV4dC1maWVsZC0tZW5jbG9zZWQnOiB0aGlzLmlzRW5jbG9zZWQsXG4gICAgICAgICd2LXRleHQtZmllbGQtLXJldmVyc2UnOiB0aGlzLnJldmVyc2UsXG4gICAgICAgICd2LXRleHQtZmllbGQtLW91dGxpbmVkJzogdGhpcy5vdXRsaW5lZCxcbiAgICAgICAgJ3YtdGV4dC1maWVsZC0tcGxhY2Vob2xkZXInOiB0aGlzLnBsYWNlaG9sZGVyLFxuICAgICAgICAndi10ZXh0LWZpZWxkLS1yb3VuZGVkJzogdGhpcy5yb3VuZGVkLFxuICAgICAgICAndi10ZXh0LWZpZWxkLS1zaGFwZWQnOiB0aGlzLnNoYXBlZCxcbiAgICAgIH1cbiAgICB9LFxuICAgIGNvbXB1dGVkQ29sb3IgKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICBjb25zdCBjb21wdXRlZENvbG9yID0gVmFsaWRhdGFibGUuY29tcHV0ZWQuY29tcHV0ZWRDb2xvci5jYWxsKHRoaXMpXG5cbiAgICAgIGlmICghdGhpcy5zb2xvSW52ZXJ0ZWQgfHwgIXRoaXMuaXNGb2N1c2VkKSByZXR1cm4gY29tcHV0ZWRDb2xvclxuXG4gICAgICByZXR1cm4gdGhpcy5jb2xvciB8fCAncHJpbWFyeSdcbiAgICB9LFxuICAgIGNvbXB1dGVkQ291bnRlclZhbHVlICgpOiBudW1iZXIge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLmNvdW50ZXJWYWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gdGhpcy5jb3VudGVyVmFsdWUodGhpcy5pbnRlcm5hbFZhbHVlKVxuICAgICAgfVxuICAgICAgcmV0dXJuIFsuLi4odGhpcy5pbnRlcm5hbFZhbHVlIHx8ICcnKS50b1N0cmluZygpXS5sZW5ndGhcbiAgICB9LFxuICAgIGhhc0NvdW50ZXIgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuY291bnRlciAhPT0gZmFsc2UgJiYgdGhpcy5jb3VudGVyICE9IG51bGxcbiAgICB9LFxuICAgIGhhc0RldGFpbHMgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIFZJbnB1dC5jb21wdXRlZC5oYXNEZXRhaWxzLmNhbGwodGhpcykgfHwgdGhpcy5oYXNDb3VudGVyXG4gICAgfSxcbiAgICBpbnRlcm5hbFZhbHVlOiB7XG4gICAgICBnZXQgKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxhenlWYWx1ZVxuICAgICAgfSxcbiAgICAgIHNldCAodmFsOiBhbnkpIHtcbiAgICAgICAgdGhpcy5sYXp5VmFsdWUgPSB2YWxcbiAgICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOm1vZGVsVmFsdWUnLCB0aGlzLmxhenlWYWx1ZSlcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpc0RpcnR5ICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLmxhenlWYWx1ZT8udG9TdHJpbmcoKS5sZW5ndGggPiAwIHx8IHRoaXMuYmFkSW5wdXRcbiAgICB9LFxuICAgIGlzRW5jbG9zZWQgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgdGhpcy5maWxsZWQgfHxcbiAgICAgICAgdGhpcy5pc1NvbG8gfHxcbiAgICAgICAgdGhpcy5vdXRsaW5lZFxuICAgICAgKVxuICAgIH0sXG4gICAgaXNMYWJlbEFjdGl2ZSAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5pc0RpcnR5IHx8IGRpcnR5VHlwZXMuaW5jbHVkZXModGhpcy50eXBlKVxuICAgIH0sXG4gICAgaXNTaW5nbGUgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgdGhpcy5pc1NvbG8gfHxcbiAgICAgICAgdGhpcy5zaW5nbGVMaW5lIHx8XG4gICAgICAgIHRoaXMuZnVsbFdpZHRoIHx8XG4gICAgICAgIC8vIGh0dHBzOi8vbWF0ZXJpYWwuaW8vY29tcG9uZW50cy90ZXh0LWZpZWxkcy8jZmlsbGVkLXRleHQtZmllbGRcbiAgICAgICAgKHRoaXMuZmlsbGVkICYmICF0aGlzLmhhc0xhYmVsKVxuICAgICAgKVxuICAgIH0sXG4gICAgaXNTb2xvICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLnNvbG8gfHwgdGhpcy5zb2xvSW52ZXJ0ZWRcbiAgICB9LFxuICAgIGxhYmVsUG9zaXRpb24gKCk6IFJlY29yZDwnbGVmdCcgfCAncmlnaHQnLCBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQ+IHtcbiAgICAgIGxldCBvZmZzZXQgPSAodGhpcy5wcmVmaXggJiYgIXRoaXMubGFiZWxWYWx1ZSkgPyB0aGlzLnByZWZpeFdpZHRoIDogMFxuXG4gICAgICBpZiAodGhpcy5sYWJlbFZhbHVlICYmIHRoaXMucHJlcGVuZFdpZHRoKSBvZmZzZXQgLT0gdGhpcy5wcmVwZW5kV2lkdGhcblxuICAgICAgcmV0dXJuICh0aGlzLiR2dWV0aWZ5LnJ0bCA9PT0gdGhpcy5yZXZlcnNlKSA/IHtcbiAgICAgICAgbGVmdDogb2Zmc2V0LFxuICAgICAgICByaWdodDogJ2F1dG8nLFxuICAgICAgfSA6IHtcbiAgICAgICAgbGVmdDogJ2F1dG8nLFxuICAgICAgICByaWdodDogb2Zmc2V0LFxuICAgICAgfVxuICAgIH0sXG4gICAgc2hvd0xhYmVsICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLmhhc0xhYmVsICYmICEodGhpcy5pc1NpbmdsZSAmJiB0aGlzLmxhYmVsVmFsdWUpXG4gICAgfSxcbiAgICBsYWJlbFZhbHVlICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLmlzRm9jdXNlZCB8fCB0aGlzLmlzTGFiZWxBY3RpdmUgfHwgdGhpcy5wZXJzaXN0ZW50UGxhY2Vob2xkZXJcbiAgICB9LFxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgLy8gbGFiZWxWYWx1ZTogJ3NldExhYmVsV2lkdGgnLCAvLyBtb3ZlZCB0byBtb3VudGVkLCBzZWUgIzExNTMzXG4gICAgb3V0bGluZWQ6ICdzZXRMYWJlbFdpZHRoJyxcbiAgICBsYWJlbCAoKSB7XG4gICAgICB0aGlzLiRuZXh0VGljayh0aGlzLnNldExhYmVsV2lkdGgpXG4gICAgfSxcbiAgICBwcmVmaXggKCkge1xuICAgICAgdGhpcy4kbmV4dFRpY2sodGhpcy5zZXRQcmVmaXhXaWR0aClcbiAgICB9LFxuICAgIGlzRm9jdXNlZDogJ3VwZGF0ZVZhbHVlJyxcbiAgICBtb2RlbFZhbHVlICh2YWwpIHtcbiAgICAgIHRoaXMubGF6eVZhbHVlID0gdmFsXG4gICAgfSxcbiAgfSxcblxuICBjcmVhdGVkICgpIHtcbiAgICBjb25zdCBicmVha2luZ1Byb3BzID0gW1xuICAgICAgWyd2YWx1ZScsICdtb2RlbFZhbHVlJ10sXG4gICAgICBbJ29uSW5wdXQnLCAnb25VcGRhdGU6bW9kZWxWYWx1ZSddLFxuICAgIF1cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgYnJlYWtpbmdQcm9wcy5mb3JFYWNoKChbb3JpZ2luYWwsIHJlcGxhY2VtZW50XSkgPT4ge1xuICAgICAgaWYgKHRoaXMuJGF0dHJzLmhhc093blByb3BlcnR5KG9yaWdpbmFsKSkgYnJlYWtpbmcob3JpZ2luYWwsIHJlcGxhY2VtZW50LCB0aGlzKVxuICAgIH0pXG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAodGhpcy5zaGFwZWQgJiYgISh0aGlzLmZpbGxlZCB8fCB0aGlzLm91dGxpbmVkIHx8IHRoaXMuaXNTb2xvKSkge1xuICAgICAgY29uc29sZVdhcm4oJ3NoYXBlZCBzaG91bGQgYmUgdXNlZCB3aXRoIGVpdGhlciBmaWxsZWQgb3Igb3V0bGluZWQnLCB0aGlzKVxuICAgIH1cbiAgfSxcblxuICBtb3VudGVkICgpIHtcbiAgICAvLyAjMTE1MzNcbiAgICB0aGlzLiR3YXRjaCgoKSA9PiB0aGlzLmxhYmVsVmFsdWUsIHRoaXMuc2V0TGFiZWxXaWR0aClcbiAgICB0aGlzLmF1dG9mb2N1cyAmJiB0aGlzLnRyeUF1dG9mb2N1cygpXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHRoaXMuaXNCb290ZWQgPSB0cnVlXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuaXNJbnRlcnNlY3RpbmcpIHtcbiAgICAgICAgICB0aGlzLm9uUmVzaXplKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICAvKiogQHB1YmxpYyAqL1xuICAgIGZvY3VzICgpIHtcbiAgICAgIHRoaXMub25Gb2N1cygpXG4gICAgfSxcbiAgICAvKiogQHB1YmxpYyAqL1xuICAgIGJsdXIgKGU/OiBFdmVudCkge1xuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Z1ZXRpZnlqcy92dWV0aWZ5L2lzc3Vlcy81OTEzXG4gICAgICAvLyBTYWZhcmkgdGFiIG9yZGVyIGdldHMgYnJva2VuIGlmIGNhbGxlZCBzeW5jaHJvbm91c1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuJHJlZnMuaW5wdXQgJiYgdGhpcy4kcmVmcy5pbnB1dC5ibHVyKClcbiAgICAgIH0pXG4gICAgfSxcbiAgICBjbGVhcmFibGVDYWxsYmFjayAoKSB7XG4gICAgICB0aGlzLiRyZWZzLmlucHV0ICYmIHRoaXMuJHJlZnMuaW5wdXQuZm9jdXMoKVxuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4gdGhpcy5pbnRlcm5hbFZhbHVlID0gbnVsbClcbiAgICB9LFxuICAgIGdlbkFwcGVuZFNsb3QgKCkge1xuICAgICAgY29uc3Qgc2xvdCA9IFtdXG5cbiAgICAgIGlmICh0aGlzLiRzbG90c1snYXBwZW5kLW91dGVyJ10pIHtcbiAgICAgICAgc2xvdC5wdXNoKHRoaXMuJHNsb3RzWydhcHBlbmQtb3V0ZXInXSBhcyBWTm9kZVtdKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmFwcGVuZE91dGVySWNvbikge1xuICAgICAgICBzbG90LnB1c2godGhpcy5nZW5JY29uKCdhcHBlbmRPdXRlcicpKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5nZW5TbG90KCdhcHBlbmQnLCAnb3V0ZXInLCBzbG90KVxuICAgIH0sXG4gICAgZ2VuUHJlcGVuZElubmVyU2xvdCAoKSB7XG4gICAgICBjb25zdCBzbG90ID0gW11cblxuICAgICAgaWYgKHRoaXMuJHNsb3RzWydwcmVwZW5kLWlubmVyJ10pIHtcbiAgICAgICAgc2xvdC5wdXNoKHRoaXMuJHNsb3RzWydwcmVwZW5kLWlubmVyJ10oKSBhcyBWTm9kZVtdKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXBlbmRJbm5lckljb24pIHtcbiAgICAgICAgc2xvdC5wdXNoKHRoaXMuZ2VuSWNvbigncHJlcGVuZElubmVyJykpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmdlblNsb3QoJ3ByZXBlbmQnLCAnaW5uZXInLCBzbG90KVxuICAgIH0sXG4gICAgZ2VuSWNvblNsb3QgKCkge1xuICAgICAgY29uc3Qgc2xvdCA9IFtdXG5cbiAgICAgIGlmICh0aGlzLiRzbG90cy5hcHBlbmQpIHtcbiAgICAgICAgc2xvdC5wdXNoKHRoaXMuJHNsb3RzLmFwcGVuZCBhcyBWTm9kZVtdKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmFwcGVuZEljb24pIHtcbiAgICAgICAgc2xvdC5wdXNoKHRoaXMuZ2VuSWNvbignYXBwZW5kJykpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmdlblNsb3QoJ2FwcGVuZCcsICdpbm5lcicsIHNsb3QpXG4gICAgfSxcbiAgICBnZW5JbnB1dFNsb3QgKCkge1xuICAgICAgY29uc3QgaW5wdXQgPSBWSW5wdXQubWV0aG9kcy5nZW5JbnB1dFNsb3QuY2FsbCh0aGlzKVxuXG4gICAgICBjb25zdCBwcmVwZW5kID0gdGhpcy5nZW5QcmVwZW5kSW5uZXJTbG90KClcblxuICAgICAgaWYgKHByZXBlbmQpIHtcbiAgICAgICAgaW5wdXQuY2hpbGRyZW4gPSBpbnB1dC5jaGlsZHJlbiB8fCBbXVxuICAgICAgICBpbnB1dC5jaGlsZHJlbi51bnNoaWZ0KHByZXBlbmQpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpbnB1dFxuICAgIH0sXG4gICAgZ2VuQ2xlYXJJY29uICgpIHtcbiAgICAgIGlmICghdGhpcy5jbGVhcmFibGUpIHJldHVybiBudWxsXG5cbiAgICAgIC8vIGlmIHRoZSB0ZXh0IGZpZWxkIGhhcyBubyBjb250ZW50IHRoZW4gZG9uJ3QgZGlzcGxheSB0aGUgY2xlYXIgaWNvbi5cbiAgICAgIC8vIFdlIGFkZCBhbiBlbXB0eSBkaXYgYmVjYXVzZSBvdGhlciBjb250cm9scyBkZXBlbmQgb24gYSByZWYgdG8gYXBwZW5kIGlubmVyXG4gICAgICBpZiAoIXRoaXMuaXNEaXJ0eSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZW5TbG90KCdhcHBlbmQnLCAnaW5uZXInLCBbXG4gICAgICAgICAgaCgnZGl2JyksXG4gICAgICAgIF0pXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmdlblNsb3QoJ2FwcGVuZCcsICdpbm5lcicsIFtcbiAgICAgICAgdGhpcy5nZW5JY29uKCdjbGVhcicsIHRoaXMuY2xlYXJhYmxlQ2FsbGJhY2spLFxuICAgICAgXSlcbiAgICB9LFxuICAgIGdlbkNvdW50ZXIgKCkge1xuICAgICAgaWYgKCF0aGlzLmhhc0NvdW50ZXIpIHJldHVybiBudWxsXG5cbiAgICAgIGNvbnN0IG1heCA9IHRoaXMuY291bnRlciA9PT0gdHJ1ZSA/IHRoaXMuYXR0cnMkLm1heGxlbmd0aCA6IHRoaXMuY291bnRlclxuXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgZGFyazogdGhpcy5kYXJrLFxuICAgICAgICBsaWdodDogdGhpcy5saWdodCxcbiAgICAgICAgbWF4LFxuICAgICAgICB2YWx1ZTogdGhpcy5jb21wdXRlZENvdW50ZXJWYWx1ZSxcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuJHNsb3RzLmNvdW50ZXI/Lih7IHByb3BzIH0pID8/IGgoVkNvdW50ZXIsIHByb3BzKVxuICAgIH0sXG4gICAgZ2VuQ29udHJvbCAoKSB7XG4gICAgICByZXR1cm4gVklucHV0Lm1ldGhvZHMuZ2VuQ29udHJvbC5jYWxsKHRoaXMpXG4gICAgfSxcbiAgICBnZW5EZWZhdWx0U2xvdCAoKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB0aGlzLmdlbkZpZWxkc2V0KCksXG4gICAgICAgIHRoaXMuZ2VuVGV4dEZpZWxkU2xvdCgpLFxuICAgICAgICB0aGlzLmdlbkNsZWFySWNvbigpLFxuICAgICAgICB0aGlzLmdlbkljb25TbG90KCksXG4gICAgICAgIHRoaXMuZ2VuUHJvZ3Jlc3MoKSxcbiAgICAgIF1cbiAgICB9LFxuICAgIGdlbkZpZWxkc2V0ICgpIHtcbiAgICAgIGlmICghdGhpcy5vdXRsaW5lZCkgcmV0dXJuIG51bGxcblxuICAgICAgcmV0dXJuIGgoJ2ZpZWxkc2V0Jywge1xuICAgICAgICAnYXJpYS1oaWRkZW4nOiB0cnVlXG4gICAgICB9LCBbdGhpcy5nZW5MZWdlbmQoKV0pXG4gICAgfSxcbiAgICBnZW5MYWJlbCAoKSB7XG4gICAgICBpZiAoIXRoaXMuc2hvd0xhYmVsKSByZXR1cm4gbnVsbFxuXG4gICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICByZWY6IFwibGFiZWxcIixcbiAgICAgICAgYWJzb2x1dGU6IHRydWUsXG4gICAgICAgIGNvbG9yOiB0aGlzLnZhbGlkYXRpb25TdGF0ZSxcbiAgICAgICAgZGFyazogdGhpcy5kYXJrLFxuICAgICAgICBkaXNhYmxlZDogdGhpcy5pc0Rpc2FibGVkLFxuICAgICAgICBmb2N1c2VkOiAhdGhpcy5pc1NpbmdsZSAmJiAodGhpcy5pc0ZvY3VzZWQgfHwgISF0aGlzLnZhbGlkYXRpb25TdGF0ZSksXG4gICAgICAgIGZvcjogdGhpcy5jb21wdXRlZElkLFxuICAgICAgICBsZWZ0OiB0aGlzLmxhYmVsUG9zaXRpb24ubGVmdCxcbiAgICAgICAgbGlnaHQ6IHRoaXMubGlnaHQsXG4gICAgICAgIHJpZ2h0OiB0aGlzLmxhYmVsUG9zaXRpb24ucmlnaHQsXG4gICAgICAgIHZhbHVlOiB0aGlzLmxhYmVsVmFsdWVcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGgoVkxhYmVsLCBkYXRhLCAoKSA9PiBnZXRTbG90KHRoaXMsICdsYWJlbCcpIHx8IHRoaXMubGFiZWwpXG4gICAgfSxcbiAgICBnZW5MZWdlbmQgKCkge1xuICAgICAgY29uc3Qgd2lkdGggPSAhdGhpcy5zaW5nbGVMaW5lICYmICh0aGlzLmxhYmVsVmFsdWUgfHwgdGhpcy5pc0RpcnR5KSA/IHRoaXMubGFiZWxXaWR0aCA6IDBcbiAgICAgIGNvbnN0IHNwYW4gPSBoKCdzcGFuJywge1xuICAgICAgICBpbm5lckhUTUw6ICcmIzgyMDM7JyxcbiAgICAgICAgY2xhc3M6ICdub3RyYW5zbGF0ZScsXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gaCgnbGVnZW5kJywge1xuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIHdpZHRoOiAhdGhpcy5pc1NpbmdsZSA/IGNvbnZlcnRUb1VuaXQod2lkdGgpIDogdW5kZWZpbmVkLFxuICAgICAgICB9LFxuICAgICAgfSwgW3NwYW5dKVxuICAgIH0sXG4gICAgZ2VuSW5wdXQgKCkge1xuICAgICAgY29uc3QgbGlzdGVuZXJzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5saXN0ZW5lcnMkKVxuICAgICAgZGVsZXRlIGxpc3RlbmVycy5jaGFuZ2UgLy8gQ2hhbmdlIHNob3VsZCBub3QgYmUgYm91bmQgZXh0ZXJuYWxseVxuICAgICAgY29uc3QgeyB0aXRsZSwgLi4uaW5wdXRBdHRycyB9ID0gdGhpcy5hdHRycyRcblxuICAgICAgY29uc3Qgbm9kZSA9IGgoJ2lucHV0Jywge1xuICAgICAgICBzdHlsZToge30sXG4gICAgICAgIHZhbHVlOiAodGhpcy50eXBlID09PSAnbnVtYmVyJyAmJiBPYmplY3QuaXModGhpcy5sYXp5VmFsdWUsIC0wKSkgPyAnLTAnIDogdGhpcy5sYXp5VmFsdWUsXG4gICAgICAgIC4uLmlucHV0QXR0cnMsXG4gICAgICAgIGF1dG9mb2N1czogdGhpcy5hdXRvZm9jdXMsXG4gICAgICAgIGRpc2FibGVkOiB0aGlzLmlzRGlzYWJsZWQsXG4gICAgICAgIGlkOiB0aGlzLmNvbXB1dGVkSWQsXG4gICAgICAgIHBsYWNlaG9sZGVyOiB0aGlzLnBlcnNpc3RlbnRQbGFjZWhvbGRlciB8fCB0aGlzLmlzRm9jdXNlZCB8fCAhdGhpcy5oYXNMYWJlbCA/IHRoaXMucGxhY2Vob2xkZXIgOiB1bmRlZmluZWQsXG4gICAgICAgIHJlYWRvbmx5OiB0aGlzLmlzUmVhZG9ubHksXG4gICAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgICAgb25CbHVyOiB0aGlzLm9uQmx1cixcbiAgICAgICAgb25JbnB1dDogdGhpcy5vbklucHV0LFxuICAgICAgICBvbkZvY3VzOiB0aGlzLm9uRm9jdXMsXG4gICAgICAgIG9uS2V5ZG93bjogdGhpcy5vbktleURvd24sXG4gICAgICAgIC4uLmxpc3RlbmVycyxcbiAgICAgICAgcmVmOiAnaW5wdXQnXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gd2l0aERpcmVjdGl2ZXMobm9kZSwgW1xuICAgICAgICBbXG4gICAgICAgICAgcmVzaXplLFxuICAgICAgICAgIHRoaXMub25SZXNpemUsXG4gICAgICAgICAgJycsXG4gICAgICAgICAgeyBxdWlldDogdHJ1ZSB9XG4gICAgICAgIF1cbiAgICAgIF0pXG4gICAgfSxcbiAgICBnZW5NZXNzYWdlcyAoKSB7XG4gICAgICBpZiAoIXRoaXMuc2hvd0RldGFpbHMpIHJldHVybiBudWxsXG5cbiAgICAgIGNvbnN0IG1lc3NhZ2VzTm9kZSA9IFZJbnB1dC5tZXRob2RzLmdlbk1lc3NhZ2VzLmNhbGwodGhpcylcbiAgICAgIGNvbnN0IGNvdW50ZXJOb2RlID0gdGhpcy5nZW5Db3VudGVyKClcblxuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6ICd2LXRleHQtZmllbGRfX2RldGFpbHMnLFxuICAgICAgfSwgW1xuICAgICAgICBtZXNzYWdlc05vZGUsXG4gICAgICAgIGNvdW50ZXJOb2RlLFxuICAgICAgXSlcbiAgICB9LFxuICAgIGdlblRleHRGaWVsZFNsb3QgKCkge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6ICd2LXRleHQtZmllbGRfX3Nsb3QnLFxuICAgICAgfSwgW1xuICAgICAgICB0aGlzLmdlbkxhYmVsKCksXG4gICAgICAgIHRoaXMucHJlZml4ID8gdGhpcy5nZW5BZmZpeCgncHJlZml4JykgOiBudWxsLFxuICAgICAgICB0aGlzLmdlbklucHV0KCksXG4gICAgICAgIHRoaXMuc3VmZml4ID8gdGhpcy5nZW5BZmZpeCgnc3VmZml4JykgOiBudWxsLFxuICAgICAgXSlcbiAgICB9LFxuICAgIGdlbkFmZml4ICh0eXBlOiAncHJlZml4JyB8ICdzdWZmaXgnKSB7XG4gICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogYHYtdGV4dC1maWVsZF9fJHt0eXBlfWAsXG4gICAgICAgIHJlZjogdHlwZSxcbiAgICAgIH0sIHRoaXNbdHlwZV0pXG4gICAgfSxcbiAgICBvbkJsdXIgKGU/OiBFdmVudCkge1xuICAgICAgdGhpcy5pc0ZvY3VzZWQgPSBmYWxzZVxuICAgICAgZSAmJiB0aGlzLiRuZXh0VGljaygoKSA9PiB0aGlzLiRlbWl0KCdibHVyJywgZSkpXG4gICAgfSxcbiAgICBvbkNsaWNrICgpIHtcbiAgICAgIGlmICh0aGlzLmlzRm9jdXNlZCB8fCB0aGlzLmlzRGlzYWJsZWQgfHwgIXRoaXMuJHJlZnMuaW5wdXQpIHJldHVyblxuXG4gICAgICB0aGlzLiRyZWZzLmlucHV0LmZvY3VzKClcbiAgICB9LFxuICAgIG9uRm9jdXMgKGU/OiBFdmVudCkge1xuICAgICAgaWYgKCF0aGlzLiRyZWZzLmlucHV0KSByZXR1cm5cblxuICAgICAgY29uc3Qgcm9vdCA9IGF0dGFjaGVkUm9vdCh0aGlzLiRlbClcbiAgICAgIGlmICghcm9vdCkgcmV0dXJuXG5cbiAgICAgIGlmIChyb290LmFjdGl2ZUVsZW1lbnQgIT09IHRoaXMuJHJlZnMuaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJHJlZnMuaW5wdXQuZm9jdXMoKVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuaXNGb2N1c2VkKSB7XG4gICAgICAgIHRoaXMuaXNGb2N1c2VkID0gdHJ1ZVxuICAgICAgICBlICYmIHRoaXMuJGVtaXQoJ2ZvY3VzJywgZSlcbiAgICAgIH1cbiAgICB9LFxuICAgIG9uSW5wdXQgKGU6IEV2ZW50KSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50XG4gICAgICB0aGlzLmludGVybmFsVmFsdWUgPSB0YXJnZXQudmFsdWVcbiAgICAgIHRoaXMuYmFkSW5wdXQgPSB0YXJnZXQudmFsaWRpdHkgJiYgdGFyZ2V0LnZhbGlkaXR5LmJhZElucHV0XG4gICAgfSxcbiAgICBvbktleURvd24gKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgIGlmIChcbiAgICAgICAgZS5rZXlDb2RlID09PSBrZXlDb2Rlcy5lbnRlciAmJlxuICAgICAgICB0aGlzLmxhenlWYWx1ZSAhPT0gdGhpcy5pbml0aWFsVmFsdWVcbiAgICAgICkge1xuICAgICAgICB0aGlzLmluaXRpYWxWYWx1ZSA9IHRoaXMubGF6eVZhbHVlXG4gICAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTptb2RlbFZhbHVlJywgdGhpcy5pbml0aWFsVmFsdWUpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuJGVtaXQoJ2tleWRvd24nLCBlKVxuICAgIH0sXG4gICAgb25Nb3VzZURvd24gKGU6IEV2ZW50KSB7XG4gICAgICAvLyBQcmV2ZW50IGlucHV0IGZyb20gYmVpbmcgYmx1cnJlZFxuICAgICAgaWYgKGUudGFyZ2V0ICE9PSB0aGlzLiRyZWZzLmlucHV0KSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICB9XG5cbiAgICAgIFZJbnB1dC5tZXRob2RzLm9uTW91c2VEb3duLmNhbGwodGhpcywgZSlcbiAgICB9LFxuICAgIG9uTW91c2VVcCAoZTogRXZlbnQpIHtcbiAgICAgIGlmICh0aGlzLmhhc01vdXNlRG93bikgdGhpcy5mb2N1cygpXG5cbiAgICAgIFZJbnB1dC5tZXRob2RzLm9uTW91c2VVcC5jYWxsKHRoaXMsIGUpXG4gICAgfSxcbiAgICBzZXRMYWJlbFdpZHRoICgpIHtcbiAgICAgIGlmICghdGhpcy5vdXRsaW5lZCkgcmV0dXJuXG5cbiAgICAgIHRoaXMubGFiZWxXaWR0aCA9IHRoaXMuJHJlZnM/LmxhYmVsPy4kZWxcbiAgICAgICAgPyBNYXRoLm1pbih0aGlzLiRyZWZzPy5sYWJlbD8uJGVsLnNjcm9sbFdpZHRoICogMC43NSArIDYsICh0aGlzLiRlbCBhcyBIVE1MRWxlbWVudCkub2Zmc2V0V2lkdGggLSAyNClcbiAgICAgICAgOiAwXG4gICAgfSxcbiAgICBzZXRQcmVmaXhXaWR0aCAoKSB7XG4gICAgICBpZiAoIXRoaXMuJHJlZnMucHJlZml4KSByZXR1cm5cblxuICAgICAgdGhpcy5wcmVmaXhXaWR0aCA9IHRoaXMuJHJlZnMucHJlZml4Lm9mZnNldFdpZHRoXG4gICAgfSxcbiAgICBzZXRQcmVwZW5kV2lkdGggKCkge1xuICAgICAgaWYgKCF0aGlzLm91dGxpbmVkIHx8ICF0aGlzLiRyZWZzWydwcmVwZW5kLWlubmVyJ10pIHJldHVyblxuXG4gICAgICB0aGlzLnByZXBlbmRXaWR0aCA9IHRoaXMuJHJlZnNbJ3ByZXBlbmQtaW5uZXInXS5vZmZzZXRXaWR0aFxuICAgIH0sXG4gICAgdHJ5QXV0b2ZvY3VzICgpIHtcbiAgICAgIGlmIChcbiAgICAgICAgIXRoaXMuYXV0b2ZvY3VzIHx8XG4gICAgICAgIHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcgfHxcbiAgICAgICAgIXRoaXMuJHJlZnMuaW5wdXQpIHJldHVybiBmYWxzZVxuXG4gICAgICBjb25zdCByb290ID0gYXR0YWNoZWRSb290KHRoaXMuJGVsKVxuICAgICAgaWYgKCFyb290IHx8IHJvb3QuYWN0aXZlRWxlbWVudCA9PT0gdGhpcy4kcmVmcy5pbnB1dCkgcmV0dXJuIGZhbHNlXG5cbiAgICAgIHRoaXMuJHJlZnMuaW5wdXQuZm9jdXMoKVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0sXG4gICAgdXBkYXRlVmFsdWUgKHZhbDogYm9vbGVhbikge1xuICAgICAgLy8gU2V0cyB2YWxpZGF0aW9uU3RhdGUgZnJvbSB2YWxpZGF0YWJsZVxuICAgICAgdGhpcy5oYXNDb2xvciA9IHZhbFxuXG4gICAgICBpZiAodmFsKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbFZhbHVlID0gdGhpcy5sYXp5VmFsdWVcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pbml0aWFsVmFsdWUgIT09IHRoaXMubGF6eVZhbHVlKSB7XG4gICAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTptb2RlbFZhbHVlJywgdGhpcy5sYXp5VmFsdWUpXG4gICAgICB9XG4gICAgfSxcbiAgICBvblJlc2l6ZSAoKSB7XG4gICAgICB0aGlzLnNldExhYmVsV2lkdGgoKVxuICAgICAgdGhpcy5zZXRQcmVmaXhXaWR0aCgpXG4gICAgICB0aGlzLnNldFByZXBlbmRXaWR0aCgpXG4gICAgfSxcbiAgfSxcbn0pXG4iXX0=