// Styles
import './VInput.sass';
// Components
import VIcon from '../VIcon';
import VLabel from '../VLabel';
import VMessages from '../VMessages';
// Mixins
import BindsAttrs from '../../mixins/binds-attrs';
import Validatable from '../../mixins/validatable';
// Utilities
import { convertToUnit, getSlot, kebabCase, normalizeClasses, } from '../../util/helpers';
import mergeData from '../../util/mergeData';
import { breaking } from '../../util/console';
// Types
import { h } from 'vue';
import mixins from '../../util/mixins';
const baseMixins = mixins(BindsAttrs, Validatable);
/* @vue/component */
export default baseMixins.extend({
    name: 'v-input',
    inheritAttrs: false,
    props: {
        appendIcon: String,
        backgroundColor: {
            type: String,
            default: '',
        },
        dense: Boolean,
        height: [Number, String],
        hideDetails: [Boolean, String],
        hideSpinButtons: Boolean,
        hint: String,
        id: String,
        label: String,
        loading: Boolean,
        persistentHint: Boolean,
        prependIcon: String,
        modelValue: null,
    },
    emits: ['click', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'update:error'],
    data() {
        return {
            lazyValue: this.modelValue,
            hasMouseDown: false,
        };
    },
    computed: {
        classes() {
            return {
                'v-input--has-state': this.hasState,
                'v-input--hide-details': !this.showDetails,
                'v-input--is-label-active': this.isLabelActive,
                'v-input--is-dirty': this.isDirty,
                'v-input--is-disabled': this.isDisabled,
                'v-input--is-focused': this.isFocused,
                // <v-switch loading>.loading === '' so we can't just cast to boolean
                'v-input--is-loading': this.loading !== false && this.loading != null,
                'v-input--is-readonly': this.isReadonly,
                'v-input--dense': this.dense,
                'v-input--hide-spin-buttons': this.hideSpinButtons,
                ...this.themeClasses,
            };
        },
        computedId() {
            return this.id || `input-${this.$.uid}`;
        },
        hasDetails() {
            return this.messagesToDisplay.length > 0;
        },
        hasHint() {
            return !this.hasMessages &&
                !!this.hint &&
                (this.persistentHint || this.isFocused);
        },
        hasLabel() {
            return !!(this.$slots.label || this.label);
        },
        // Proxy for `lazyValue`
        // This allows an input
        // to function without
        // a provided model
        internalValue: {
            get() {
                return this.lazyValue;
            },
            set(val) {
                this.lazyValue = val;
                this.$emit(this.$_modelEvent, val);
                if ('$_emitChangeEvent' in this) {
                    this.$emit('change', val);
                }
            },
        },
        isDirty() {
            return !!this.lazyValue;
        },
        isLabelActive() {
            return this.isDirty;
        },
        messagesToDisplay() {
            if (this.hasHint)
                return [this.hint];
            if (!this.hasMessages)
                return [];
            return this.validations.map((validation) => {
                if (typeof validation === 'string')
                    return validation;
                const validationResult = validation(this.internalValue);
                return typeof validationResult === 'string' ? validationResult : '';
            }).filter(message => message !== '');
        },
        showDetails() {
            return this.hideDetails === false || (this.hideDetails === 'auto' && this.hasDetails);
        },
    },
    watch: {
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
    },
    beforeCreate() {
        // v-radio-group needs to emit a different event
        // https://github.com/vuetifyjs/vuetify/issues/4752
        this.$_modelEvent = /*(this.$options.model && this.$options.model.event) ||*/ 'update:modelValue';
    },
    methods: {
        genContent() {
            return [
                this.genPrependSlot(),
                this.genControl(),
                this.genAppendSlot(),
            ];
        },
        genControl() {
            return h('div', {
                class: 'v-input__control',
                title: this.attrs$.title,
            }, [
                this.genInputSlot(),
                this.genMessages(),
            ]);
        },
        genDefaultSlot() {
            return [
                this.genLabel(),
                getSlot(this),
            ];
        },
        genIcon(type, cb, extraData = {}) {
            var _a;
            const icon = this[`${type}Icon`];
            const eventName = `click:${kebabCase(type)}`;
            const hasListener = !!(this.listeners$[eventName] || cb);
            const localeKey = {
                prepend: 'prependAction',
                prependInner: 'prependAction',
                append: 'appendAction',
                appendOuter: 'appendAction',
                clear: 'clear',
            }[type];
            const label = hasListener && localeKey
                ? this.$vuetify.lang.t(`$vuetify.input.${localeKey}`, (_a = this.label) !== null && _a !== void 0 ? _a : '')
                : undefined;
            const data = mergeData({
                'aria-label': label,
                color: this.validationState,
                dark: this.dark,
                disabled: this.isDisabled,
                light: this.light,
                tabindex: type === 'clear' ? -1 : undefined,
                ...(!hasListener
                    ? {}
                    : {
                        onClick: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.$emit(eventName, e);
                            cb && cb(e);
                        },
                        // Container has g event that will
                        // trigger menu open if enclosed
                        onMouseup: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        },
                    }),
            }, extraData);
            return h('div', {
                class: {
                    'v-input__icon': true,
                    [`v-input__icon--${kebabCase(type)}`]: type
                },
            }, [
                h(VIcon, data, () => icon),
            ]);
        },
        genInputSlot() {
            return h('div', this.setBackgroundColor(this.backgroundColor, {
                class: { 'v-input__slot': true },
                style: { height: convertToUnit(this.height) },
                onClick: this.onClick,
                onMousedown: this.onMouseDown,
                onMouseup: this.onMouseUp,
                ref: 'input-slot',
            }), [this.genDefaultSlot()]);
        },
        genLabel() {
            if (!this.hasLabel)
                return null;
            return h(VLabel, {
                color: this.validationState,
                dark: this.dark,
                disabled: this.isDisabled,
                focused: this.hasState,
                for: this.computedId,
                light: this.light,
            }, () => getSlot(this, 'label') || this.label);
        },
        genMessages() {
            if (!this.showDetails)
                return null;
            return h(VMessages, {
                color: this.hasHint ? '' : this.validationState,
                dark: this.dark,
                light: this.light,
                modelValue: this.messagesToDisplay,
                role: this.hasMessages ? 'alert' : null,
            }, { default: getSlot(this, 'message') });
        },
        genSlot(type, location, slot) {
            if (!slot.length)
                return null;
            const ref = `${type}-${location}`;
            slot = slot.map(child => child instanceof Function ? child() : child);
            return h('div', {
                class: `v-input__${ref}`,
                ref,
            }, slot);
        },
        genPrependSlot() {
            const slot = [];
            if (this.$slots.prepend) {
                slot.push(this.$slots.prepend);
            }
            else if (this.prependIcon) {
                slot.push(this.genIcon('prepend'));
            }
            return this.genSlot('prepend', 'outer', slot);
        },
        genAppendSlot() {
            const slot = [];
            // Append icon for text field was really
            // an appended inner icon, v-text-field
            // will overwrite this method in order to obtain
            // backwards compat
            if (this.$slots.append) {
                slot.push(this.$slots.append);
            }
            else if (this.appendIcon) {
                slot.push(this.genIcon('append'));
            }
            return this.genSlot('append', 'outer', slot);
        },
        onClick(e) {
            this.$emit('click', e);
        },
        onMouseDown(e) {
            this.hasMouseDown = true;
            this.$emit('mousedown', e);
        },
        onMouseUp(e) {
            this.hasMouseDown = false;
            this.$emit('mouseup', e);
        },
    },
    render() {
        const { class: additionalClasses, ...restAttrs } = this.$attrs;
        return h('div', this.setTextColor(this.validationState, {
            class: { 'v-input': true, ...this.classes, ...normalizeClasses(additionalClasses) },
            ...restAttrs,
        }), {
            default: () => this.genContent(),
        });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVklucHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVklucHV0L1ZJbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxlQUFlLENBQUE7QUFFdEIsYUFBYTtBQUNiLE9BQU8sS0FBSyxNQUFNLFVBQVUsQ0FBQTtBQUM1QixPQUFPLE1BQU0sTUFBTSxXQUFXLENBQUE7QUFDOUIsT0FBTyxTQUFTLE1BQU0sY0FBYyxDQUFBO0FBRXBDLFNBQVM7QUFDVCxPQUFPLFVBQVUsTUFBTSwwQkFBMEIsQ0FBQTtBQUNqRCxPQUFPLFdBQVcsTUFBTSwwQkFBMEIsQ0FBQTtBQUVsRCxZQUFZO0FBQ1osT0FBTyxFQUNMLGFBQWEsRUFDYixPQUFPLEVBQ1AsU0FBUyxFQUNULGdCQUFnQixHQUNqQixNQUFNLG9CQUFvQixDQUFBO0FBQzNCLE9BQU8sU0FBUyxNQUFNLHNCQUFzQixDQUFBO0FBQzVDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUU3QyxRQUFRO0FBQ1IsT0FBTyxFQUE4QixDQUFDLEVBQXNCLE1BQU0sS0FBSyxDQUFBO0FBQ3ZFLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBR3RDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FDdkIsVUFBVSxFQUNWLFdBQVcsQ0FDWixDQUFBO0FBT0Qsb0JBQW9CO0FBQ3BCLGVBQWUsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUMvQixJQUFJLEVBQUUsU0FBUztJQUVmLFlBQVksRUFBRSxLQUFLO0lBRW5CLEtBQUssRUFBRTtRQUNMLFVBQVUsRUFBRSxNQUFNO1FBQ2xCLGVBQWUsRUFBRTtZQUNmLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLEVBQUU7U0FDWjtRQUNELEtBQUssRUFBRSxPQUFPO1FBQ2QsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztRQUN4QixXQUFXLEVBQUUsQ0FB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QixDQUFDO1FBQ0QsU0FBUyxDQUFFLENBQVE7WUFDakIsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUE7WUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDMUIsQ0FBQztLQUNGO0lBRUQsTUFBTTtRQUNKLE1BQU0sRUFBRSxLQUFLLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBNkIsQ0FBQTtRQUVyRixPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3RELEtBQUssRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsRUFBRTtZQUNuRixHQUFHLFNBQVM7U0FDYixDQUFDLEVBQUU7WUFDRixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtTQUNqQyxDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXG5pbXBvcnQgJy4vVklucHV0LnNhc3MnXG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCBWSWNvbiBmcm9tICcuLi9WSWNvbidcbmltcG9ydCBWTGFiZWwgZnJvbSAnLi4vVkxhYmVsJ1xuaW1wb3J0IFZNZXNzYWdlcyBmcm9tICcuLi9WTWVzc2FnZXMnXG5cbi8vIE1peGluc1xuaW1wb3J0IEJpbmRzQXR0cnMgZnJvbSAnLi4vLi4vbWl4aW5zL2JpbmRzLWF0dHJzJ1xuaW1wb3J0IFZhbGlkYXRhYmxlIGZyb20gJy4uLy4uL21peGlucy92YWxpZGF0YWJsZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQge1xuICBjb252ZXJ0VG9Vbml0LFxuICBnZXRTbG90LFxuICBrZWJhYkNhc2UsXG4gIG5vcm1hbGl6ZUNsYXNzZXMsXG59IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcbmltcG9ydCBtZXJnZURhdGEgZnJvbSAnLi4vLi4vdXRpbC9tZXJnZURhdGEnXG5pbXBvcnQgeyBicmVha2luZyB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcblxuLy8gVHlwZXNcbmltcG9ydCB7IFZOb2RlLCBWTm9kZURhdGEsIFByb3BUeXBlLCBoLCBnZXRDdXJyZW50SW5zdGFuY2UgfSBmcm9tICd2dWUnXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuaW1wb3J0IHsgSW5wdXRWYWxpZGF0aW9uUnVsZSB9IGZyb20gJ3Z1ZXRpZnkvdHlwZXMnXG5cbmNvbnN0IGJhc2VNaXhpbnMgPSBtaXhpbnMoXG4gIEJpbmRzQXR0cnMsXG4gIFZhbGlkYXRhYmxlLFxuKVxuXG5pbnRlcmZhY2Ugb3B0aW9ucyBleHRlbmRzIEluc3RhbmNlVHlwZTx0eXBlb2YgYmFzZU1peGlucz4ge1xuICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlICovXG4gICRfbW9kZWxFdmVudDogc3RyaW5nXG59XG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBiYXNlTWl4aW5zLmV4dGVuZCh7XG4gIG5hbWU6ICd2LWlucHV0JyxcblxuICBpbmhlcml0QXR0cnM6IGZhbHNlLFxuXG4gIHByb3BzOiB7XG4gICAgYXBwZW5kSWNvbjogU3RyaW5nLFxuICAgIGJhY2tncm91bmRDb2xvcjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJycsXG4gICAgfSxcbiAgICBkZW5zZTogQm9vbGVhbixcbiAgICBoZWlnaHQ6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgaGlkZURldGFpbHM6IFtCb29sZWFuLCBTdHJpbmddIGFzIFByb3BUeXBlPGJvb2xlYW4gfCAnYXV0byc+LFxuICAgIGhpZGVTcGluQnV0dG9uczogQm9vbGVhbixcbiAgICBoaW50OiBTdHJpbmcsXG4gICAgaWQ6IFN0cmluZyxcbiAgICBsYWJlbDogU3RyaW5nLFxuICAgIGxvYWRpbmc6IEJvb2xlYW4sXG4gICAgcGVyc2lzdGVudEhpbnQ6IEJvb2xlYW4sXG4gICAgcHJlcGVuZEljb246IFN0cmluZyxcbiAgICBtb2RlbFZhbHVlOiBudWxsIGFzIGFueSBhcyBQcm9wVHlwZTxhbnk+LFxuICB9LFxuXG4gIGVtaXRzOiBbJ2NsaWNrJywgJ21vdXNlZG93bicsICdtb3VzZXVwJywgJ3RvdWNoc3RhcnQnLCAndG91Y2hlbmQnLCAndXBkYXRlOmVycm9yJ10sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhenlWYWx1ZTogdGhpcy5tb2RlbFZhbHVlLFxuICAgICAgaGFzTW91c2VEb3duOiBmYWxzZSxcbiAgICB9XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ3YtaW5wdXQtLWhhcy1zdGF0ZSc6IHRoaXMuaGFzU3RhdGUsXG4gICAgICAgICd2LWlucHV0LS1oaWRlLWRldGFpbHMnOiAhdGhpcy5zaG93RGV0YWlscyxcbiAgICAgICAgJ3YtaW5wdXQtLWlzLWxhYmVsLWFjdGl2ZSc6IHRoaXMuaXNMYWJlbEFjdGl2ZSxcbiAgICAgICAgJ3YtaW5wdXQtLWlzLWRpcnR5JzogdGhpcy5pc0RpcnR5LFxuICAgICAgICAndi1pbnB1dC0taXMtZGlzYWJsZWQnOiB0aGlzLmlzRGlzYWJsZWQsXG4gICAgICAgICd2LWlucHV0LS1pcy1mb2N1c2VkJzogdGhpcy5pc0ZvY3VzZWQsXG4gICAgICAgIC8vIDx2LXN3aXRjaCBsb2FkaW5nPi5sb2FkaW5nID09PSAnJyBzbyB3ZSBjYW4ndCBqdXN0IGNhc3QgdG8gYm9vbGVhblxuICAgICAgICAndi1pbnB1dC0taXMtbG9hZGluZyc6IHRoaXMubG9hZGluZyAhPT0gZmFsc2UgJiYgdGhpcy5sb2FkaW5nICE9IG51bGwsXG4gICAgICAgICd2LWlucHV0LS1pcy1yZWFkb25seSc6IHRoaXMuaXNSZWFkb25seSxcbiAgICAgICAgJ3YtaW5wdXQtLWRlbnNlJzogdGhpcy5kZW5zZSxcbiAgICAgICAgJ3YtaW5wdXQtLWhpZGUtc3Bpbi1idXR0b25zJzogdGhpcy5oaWRlU3BpbkJ1dHRvbnMsXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzLFxuICAgICAgfVxuICAgIH0sXG4gICAgY29tcHV0ZWRJZCAoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiB0aGlzLmlkIHx8IGBpbnB1dC0ke3RoaXMuJC51aWR9YFxuICAgIH0sXG4gICAgaGFzRGV0YWlscyAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5tZXNzYWdlc1RvRGlzcGxheS5sZW5ndGggPiAwXG4gICAgfSxcbiAgICBoYXNIaW50ICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAhdGhpcy5oYXNNZXNzYWdlcyAmJlxuICAgICAgICAhIXRoaXMuaGludCAmJlxuICAgICAgICAodGhpcy5wZXJzaXN0ZW50SGludCB8fCB0aGlzLmlzRm9jdXNlZClcbiAgICB9LFxuICAgIGhhc0xhYmVsICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAhISh0aGlzLiRzbG90cy5sYWJlbCB8fCB0aGlzLmxhYmVsKVxuICAgIH0sXG4gICAgLy8gUHJveHkgZm9yIGBsYXp5VmFsdWVgXG4gICAgLy8gVGhpcyBhbGxvd3MgYW4gaW5wdXRcbiAgICAvLyB0byBmdW5jdGlvbiB3aXRob3V0XG4gICAgLy8gYSBwcm92aWRlZCBtb2RlbFxuICAgIGludGVybmFsVmFsdWU6IHtcbiAgICAgIGdldCAoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGF6eVZhbHVlXG4gICAgICB9LFxuICAgICAgc2V0ICh2YWw6IGFueSkge1xuICAgICAgICB0aGlzLmxhenlWYWx1ZSA9IHZhbFxuICAgICAgICB0aGlzLiRlbWl0KHRoaXMuJF9tb2RlbEV2ZW50LCB2YWwpXG5cbiAgICAgICAgaWYgKCckX2VtaXRDaGFuZ2VFdmVudCcgaW4gdGhpcykge1xuICAgICAgICAgIHRoaXMuJGVtaXQoJ2NoYW5nZScsIHZhbClcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9LFxuICAgIGlzRGlydHkgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuICEhdGhpcy5sYXp5VmFsdWVcbiAgICB9LFxuICAgIGlzTGFiZWxBY3RpdmUgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuaXNEaXJ0eVxuICAgIH0sXG4gICAgbWVzc2FnZXNUb0Rpc3BsYXkgKCk6IHN0cmluZ1tdIHtcbiAgICAgIGlmICh0aGlzLmhhc0hpbnQpIHJldHVybiBbdGhpcy5oaW50XVxuXG4gICAgICBpZiAoIXRoaXMuaGFzTWVzc2FnZXMpIHJldHVybiBbXVxuXG4gICAgICByZXR1cm4gdGhpcy52YWxpZGF0aW9ucy5tYXAoKHZhbGlkYXRpb246IHN0cmluZyB8IElucHV0VmFsaWRhdGlvblJ1bGUpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWxpZGF0aW9uID09PSAnc3RyaW5nJykgcmV0dXJuIHZhbGlkYXRpb25cblxuICAgICAgICBjb25zdCB2YWxpZGF0aW9uUmVzdWx0ID0gdmFsaWRhdGlvbih0aGlzLmludGVybmFsVmFsdWUpXG5cbiAgICAgICAgcmV0dXJuIHR5cGVvZiB2YWxpZGF0aW9uUmVzdWx0ID09PSAnc3RyaW5nJyA/IHZhbGlkYXRpb25SZXN1bHQgOiAnJ1xuICAgICAgfSkuZmlsdGVyKG1lc3NhZ2UgPT4gbWVzc2FnZSAhPT0gJycpXG4gICAgfSxcbiAgICBzaG93RGV0YWlscyAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5oaWRlRGV0YWlscyA9PT0gZmFsc2UgfHwgKHRoaXMuaGlkZURldGFpbHMgPT09ICdhdXRvJyAmJiB0aGlzLmhhc0RldGFpbHMpXG4gICAgfSxcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIG1vZGVsVmFsdWUgKHZhbCkge1xuICAgICAgdGhpcy5sYXp5VmFsdWUgPSB2YWxcbiAgICB9LFxuICB9LFxuXG4gIGNyZWF0ZWQgKCkge1xuICAgIGNvbnN0IGJyZWFraW5nUHJvcHMgPSBbXG4gICAgICBbJ3ZhbHVlJywgJ21vZGVsVmFsdWUnXSxcbiAgICAgIFsnb25JbnB1dCcsICdvblVwZGF0ZTptb2RlbFZhbHVlJ10sXG4gICAgXVxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBicmVha2luZ1Byb3BzLmZvckVhY2goKFtvcmlnaW5hbCwgcmVwbGFjZW1lbnRdKSA9PiB7XG4gICAgICBpZiAodGhpcy4kYXR0cnMuaGFzT3duUHJvcGVydHkob3JpZ2luYWwpKSBicmVha2luZyhvcmlnaW5hbCwgcmVwbGFjZW1lbnQsIHRoaXMpXG4gICAgfSlcbiAgfSxcblxuICBiZWZvcmVDcmVhdGUgKCkge1xuICAgIC8vIHYtcmFkaW8tZ3JvdXAgbmVlZHMgdG8gZW1pdCBhIGRpZmZlcmVudCBldmVudFxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92dWV0aWZ5anMvdnVldGlmeS9pc3N1ZXMvNDc1MlxuICAgIHRoaXMuJF9tb2RlbEV2ZW50ID0gLyoodGhpcy4kb3B0aW9ucy5tb2RlbCAmJiB0aGlzLiRvcHRpb25zLm1vZGVsLmV2ZW50KSB8fCovICd1cGRhdGU6bW9kZWxWYWx1ZSdcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2VuQ29udGVudCAoKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB0aGlzLmdlblByZXBlbmRTbG90KCksXG4gICAgICAgIHRoaXMuZ2VuQ29udHJvbCgpLFxuICAgICAgICB0aGlzLmdlbkFwcGVuZFNsb3QoKSxcbiAgICAgIF1cbiAgICB9LFxuICAgIGdlbkNvbnRyb2wgKCkge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6ICd2LWlucHV0X19jb250cm9sJyxcbiAgICAgICAgdGl0bGU6IHRoaXMuYXR0cnMkLnRpdGxlLFxuICAgICAgfSwgW1xuICAgICAgICB0aGlzLmdlbklucHV0U2xvdCgpLFxuICAgICAgICB0aGlzLmdlbk1lc3NhZ2VzKCksXG4gICAgICBdKVxuICAgIH0sXG4gICAgZ2VuRGVmYXVsdFNsb3QgKCkge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgdGhpcy5nZW5MYWJlbCgpLFxuICAgICAgICBnZXRTbG90KHRoaXMpLFxuICAgICAgXVxuICAgIH0sXG4gICAgZ2VuSWNvbiAoXG4gICAgICB0eXBlOiBzdHJpbmcsXG4gICAgICBjYj86IChlOiBFdmVudCkgPT4gdm9pZCxcbiAgICAgIGV4dHJhRGF0YTogVk5vZGVEYXRhID0ge31cbiAgICApIHtcbiAgICAgIGNvbnN0IGljb24gPSAodGhpcyBhcyBhbnkpW2Ake3R5cGV9SWNvbmBdXG4gICAgICBjb25zdCBldmVudE5hbWUgPSBgY2xpY2s6JHtrZWJhYkNhc2UodHlwZSl9YFxuICAgICAgY29uc3QgaGFzTGlzdGVuZXIgPSAhISh0aGlzLmxpc3RlbmVycyRbZXZlbnROYW1lXSB8fCBjYilcblxuICAgICAgY29uc3QgbG9jYWxlS2V5ID0ge1xuICAgICAgICBwcmVwZW5kOiAncHJlcGVuZEFjdGlvbicsXG4gICAgICAgIHByZXBlbmRJbm5lcjogJ3ByZXBlbmRBY3Rpb24nLFxuICAgICAgICBhcHBlbmQ6ICdhcHBlbmRBY3Rpb24nLFxuICAgICAgICBhcHBlbmRPdXRlcjogJ2FwcGVuZEFjdGlvbicsXG4gICAgICAgIGNsZWFyOiAnY2xlYXInLFxuICAgICAgfVt0eXBlXVxuICAgICAgY29uc3QgbGFiZWwgPSBoYXNMaXN0ZW5lciAmJiBsb2NhbGVLZXlcbiAgICAgICAgPyB0aGlzLiR2dWV0aWZ5LmxhbmcudChgJHZ1ZXRpZnkuaW5wdXQuJHtsb2NhbGVLZXl9YCwgdGhpcy5sYWJlbCA/PyAnJylcbiAgICAgICAgOiB1bmRlZmluZWRcblxuICAgICAgY29uc3QgZGF0YSA9IG1lcmdlRGF0YSh7XG4gICAgICAgICdhcmlhLWxhYmVsJzogbGFiZWwsXG4gICAgICAgIGNvbG9yOiB0aGlzLnZhbGlkYXRpb25TdGF0ZSxcbiAgICAgICAgZGFyazogdGhpcy5kYXJrLFxuICAgICAgICBkaXNhYmxlZDogdGhpcy5pc0Rpc2FibGVkLFxuICAgICAgICBsaWdodDogdGhpcy5saWdodCxcbiAgICAgICAgdGFiaW5kZXg6IHR5cGUgPT09ICdjbGVhcicgPyAtMSA6IHVuZGVmaW5lZCxcbiAgICAgICAgLi4uKCFoYXNMaXN0ZW5lclxuICAgICAgICAgID8ge31cbiAgICAgICAgICA6IHtcbiAgICAgICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnROYW1lLCBlKVxuICAgICAgICAgICAgICBjYiAmJiBjYihlKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIENvbnRhaW5lciBoYXMgZyBldmVudCB0aGF0IHdpbGxcbiAgICAgICAgICAgIC8vIHRyaWdnZXIgbWVudSBvcGVuIGlmIGVuY2xvc2VkXG4gICAgICAgICAgICBvbk1vdXNldXA6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSxcbiAgICAgIH0sIGV4dHJhRGF0YSlcblxuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IHtcbiAgICAgICAgICAndi1pbnB1dF9faWNvbic6IHRydWUsXG4gICAgICAgICAgW2B2LWlucHV0X19pY29uLS0ke2tlYmFiQ2FzZSh0eXBlKX1gXTogdHlwZVxuICAgICAgICB9LFxuICAgICAgfSwgW1xuICAgICAgICBoKFxuICAgICAgICAgIFZJY29uLFxuICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgKCkgPT4gaWNvblxuICAgICAgICApLFxuICAgICAgXSlcbiAgICB9LFxuICAgIGdlbklucHV0U2xvdCAoKSB7XG4gICAgICByZXR1cm4gaCgnZGl2JywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5iYWNrZ3JvdW5kQ29sb3IsIHtcbiAgICAgICAgY2xhc3M6IHsgJ3YtaW5wdXRfX3Nsb3QnOiB0cnVlIH0sXG4gICAgICAgIHN0eWxlOiB7IGhlaWdodDogY29udmVydFRvVW5pdCh0aGlzLmhlaWdodCkgfSxcbiAgICAgICAgb25DbGljazogdGhpcy5vbkNsaWNrLFxuICAgICAgICBvbk1vdXNlZG93bjogdGhpcy5vbk1vdXNlRG93bixcbiAgICAgICAgb25Nb3VzZXVwOiB0aGlzLm9uTW91c2VVcCxcbiAgICAgICAgcmVmOiAnaW5wdXQtc2xvdCcsXG4gICAgICB9KSwgW3RoaXMuZ2VuRGVmYXVsdFNsb3QoKV0pXG4gICAgfSxcbiAgICBnZW5MYWJlbCAoKSB7XG4gICAgICBpZiAoIXRoaXMuaGFzTGFiZWwpIHJldHVybiBudWxsXG5cbiAgICAgIHJldHVybiBoKFZMYWJlbCwge1xuICAgICAgICBjb2xvcjogdGhpcy52YWxpZGF0aW9uU3RhdGUsXG4gICAgICAgIGRhcms6IHRoaXMuZGFyayxcbiAgICAgICAgZGlzYWJsZWQ6IHRoaXMuaXNEaXNhYmxlZCxcbiAgICAgICAgZm9jdXNlZDogdGhpcy5oYXNTdGF0ZSxcbiAgICAgICAgZm9yOiB0aGlzLmNvbXB1dGVkSWQsXG4gICAgICAgIGxpZ2h0OiB0aGlzLmxpZ2h0LFxuICAgICAgfSwgKCkgPT4gZ2V0U2xvdCh0aGlzLCAnbGFiZWwnKSB8fCB0aGlzLmxhYmVsKVxuICAgIH0sXG4gICAgZ2VuTWVzc2FnZXMgKCkge1xuICAgICAgaWYgKCF0aGlzLnNob3dEZXRhaWxzKSByZXR1cm4gbnVsbFxuXG4gICAgICByZXR1cm4gaChWTWVzc2FnZXMsIHtcbiAgICAgICAgY29sb3I6IHRoaXMuaGFzSGludCA/ICcnIDogdGhpcy52YWxpZGF0aW9uU3RhdGUsXG4gICAgICAgIGRhcms6IHRoaXMuZGFyayxcbiAgICAgICAgbGlnaHQ6IHRoaXMubGlnaHQsXG4gICAgICAgIG1vZGVsVmFsdWU6IHRoaXMubWVzc2FnZXNUb0Rpc3BsYXksXG4gICAgICAgIHJvbGU6IHRoaXMuaGFzTWVzc2FnZXMgPyAnYWxlcnQnIDogbnVsbCxcbiAgICAgIH0sIHsgZGVmYXVsdDogZ2V0U2xvdCh0aGlzLCAnbWVzc2FnZScpIH0pXG4gICAgfSxcbiAgICBnZW5TbG90IChcbiAgICAgIHR5cGU6IHN0cmluZyxcbiAgICAgIGxvY2F0aW9uOiBzdHJpbmcsXG4gICAgICBzbG90OiAoVk5vZGUgfCBWTm9kZVtdKVtdXG4gICAgKSB7XG4gICAgICBpZiAoIXNsb3QubGVuZ3RoKSByZXR1cm4gbnVsbFxuXG4gICAgICBjb25zdCByZWYgPSBgJHt0eXBlfS0ke2xvY2F0aW9ufWBcblxuICAgICAgc2xvdCA9IHNsb3QubWFwKGNoaWxkID0+IGNoaWxkIGluc3RhbmNlb2YgRnVuY3Rpb24gPyBjaGlsZCgpIDogY2hpbGQpXG5cbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiBgdi1pbnB1dF9fJHtyZWZ9YCxcbiAgICAgICAgcmVmLFxuICAgICAgfSwgc2xvdClcbiAgICB9LFxuICAgIGdlblByZXBlbmRTbG90ICgpIHtcbiAgICAgIGNvbnN0IHNsb3QgPSBbXVxuXG4gICAgICBpZiAodGhpcy4kc2xvdHMucHJlcGVuZCkge1xuICAgICAgICBzbG90LnB1c2godGhpcy4kc2xvdHMucHJlcGVuZClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmVwZW5kSWNvbikge1xuICAgICAgICBzbG90LnB1c2godGhpcy5nZW5JY29uKCdwcmVwZW5kJykpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmdlblNsb3QoJ3ByZXBlbmQnLCAnb3V0ZXInLCBzbG90KVxuICAgIH0sXG4gICAgZ2VuQXBwZW5kU2xvdCAoKSB7XG4gICAgICBjb25zdCBzbG90ID0gW11cblxuICAgICAgLy8gQXBwZW5kIGljb24gZm9yIHRleHQgZmllbGQgd2FzIHJlYWxseVxuICAgICAgLy8gYW4gYXBwZW5kZWQgaW5uZXIgaWNvbiwgdi10ZXh0LWZpZWxkXG4gICAgICAvLyB3aWxsIG92ZXJ3cml0ZSB0aGlzIG1ldGhvZCBpbiBvcmRlciB0byBvYnRhaW5cbiAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXRcbiAgICAgIGlmICh0aGlzLiRzbG90cy5hcHBlbmQpIHtcbiAgICAgICAgc2xvdC5wdXNoKHRoaXMuJHNsb3RzLmFwcGVuZClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5hcHBlbmRJY29uKSB7XG4gICAgICAgIHNsb3QucHVzaCh0aGlzLmdlbkljb24oJ2FwcGVuZCcpKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5nZW5TbG90KCdhcHBlbmQnLCAnb3V0ZXInLCBzbG90KVxuICAgIH0sXG4gICAgb25DbGljayAoZTogRXZlbnQpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ2NsaWNrJywgZSlcbiAgICB9LFxuICAgIG9uTW91c2VEb3duIChlOiBFdmVudCkge1xuICAgICAgdGhpcy5oYXNNb3VzZURvd24gPSB0cnVlXG4gICAgICB0aGlzLiRlbWl0KCdtb3VzZWRvd24nLCBlKVxuICAgIH0sXG4gICAgb25Nb3VzZVVwIChlOiBFdmVudCkge1xuICAgICAgdGhpcy5oYXNNb3VzZURvd24gPSBmYWxzZVxuICAgICAgdGhpcy4kZW1pdCgnbW91c2V1cCcsIGUpXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKCk6IFZOb2RlIHtcbiAgICBjb25zdCB7IGNsYXNzOiBhZGRpdGlvbmFsQ2xhc3NlcywgLi4ucmVzdEF0dHJzIH0gPSB0aGlzLiRhdHRycyBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+XG5cbiAgICByZXR1cm4gaCgnZGl2JywgdGhpcy5zZXRUZXh0Q29sb3IodGhpcy52YWxpZGF0aW9uU3RhdGUsIHtcbiAgICAgIGNsYXNzOiB7ICd2LWlucHV0JzogdHJ1ZSwgLi4udGhpcy5jbGFzc2VzLCAuLi5ub3JtYWxpemVDbGFzc2VzKGFkZGl0aW9uYWxDbGFzc2VzKSB9LFxuICAgICAgLi4ucmVzdEF0dHJzLFxuICAgIH0pLCB7XG4gICAgICBkZWZhdWx0OiAoKSA9PiB0aGlzLmdlbkNvbnRlbnQoKSxcbiAgICB9KVxuICB9LFxufSlcbiJdfQ==