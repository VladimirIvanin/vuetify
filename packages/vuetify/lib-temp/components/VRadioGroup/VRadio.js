import { h } from 'vue';
// Styles
import './VRadio.sass';
import VLabel from '../VLabel';
import VIcon from '../VIcon';
import VInput from '../VInput';
// Mixins
import BindsAttrs from '../../mixins/binds-attrs';
import Colorable from '../../mixins/colorable';
import { factory as GroupableFactory } from '../../mixins/groupable';
import Rippleable from '../../mixins/rippleable';
import Themeable from '../../mixins/themeable';
import Selectable, { prevent } from '../../mixins/selectable';
// Utilities
import { getSlot } from '../../util/helpers';
import mixins from '../../util/mixins';
import { mergeListeners } from '../../util/mergeData';
const baseMixins = mixins(BindsAttrs, Colorable, Rippleable, GroupableFactory('radioGroup'), Themeable);
/* @vue/component */
export default baseMixins.extend({
    name: 'v-radio',
    inheritAttrs: false,
    emits: ['change', 'focus', 'blur'],
    props: {
        disabled: {
            type: Boolean,
            default: null,
        },
        id: String,
        label: String,
        name: String,
        offIcon: {
            type: String,
            default: '$radioOff',
        },
        onIcon: {
            type: String,
            default: '$radioOn',
        },
        readonly: {
            type: Boolean,
            default: null,
        },
        value: {
            default: null,
        },
    },
    data: () => ({
        isFocused: false,
    }),
    computed: {
        classes() {
            return {
                'v-radio--is-disabled': this.isDisabled,
                'v-radio--is-focused': this.isFocused,
                ...this.themeClasses,
                ...this.groupClasses,
            };
        },
        computedColor() {
            if (this.isDisabled)
                return undefined;
            return Selectable.computed.computedColor.call(this);
        },
        computedIcon() {
            return this.isActive
                ? this.onIcon
                : this.offIcon;
        },
        computedId() {
            return VInput.computed.computedId.call(this);
        },
        hasLabel: VInput.computed.hasLabel,
        hasState() {
            return (this.radioGroup || {}).hasState;
        },
        isDisabled() {
            var _a;
            return (_a = this.disabled) !== null && _a !== void 0 ? _a : (!!this.radioGroup &&
                this.radioGroup.isDisabled);
        },
        isReadonly() {
            var _a;
            return (_a = this.readonly) !== null && _a !== void 0 ? _a : (!!this.radioGroup &&
                this.radioGroup.isReadonly);
        },
        computedName() {
            if (this.name || !this.radioGroup) {
                return this.name;
            }
            return this.radioGroup.name || `radio-${this.radioGroup.$.uid}`;
        },
        rippleState() {
            return Selectable.computed.rippleState.call(this);
        },
        validationState() {
            return (this.radioGroup || {}).validationState || this.computedColor;
        },
    },
    methods: {
        genInput(args) {
            // We can't actually use the mixin directly because
            // it's made for standalone components, but its
            // genInput method is exactly what we need
            return Selectable.methods.genInput.call(this, 'radio', args);
        },
        genLabel() {
            if (!this.hasLabel)
                return null;
            return h(VLabel, {
                // Label shouldn't cause the input to focus
                onClick: prevent,
                for: this.computedId,
                color: this.validationState,
                focused: this.hasState,
            }, () => getSlot(this, 'label') || this.label);
        },
        genRadio() {
            const { title, ...radioAttrs } = this.attrs$;
            return h('div', {
                class: 'v-input--selection-controls__input',
            }, [
                h(VIcon, this.setTextColor(this.validationState, {
                    dense: this.radioGroup && this.radioGroup.dense,
                }), () => this.computedIcon),
                this.genInput({
                    name: this.computedName,
                    value: this.value,
                    ...radioAttrs,
                }),
                this.genRipple(this.setTextColor(this.rippleState)),
            ]);
        },
        onFocus(e) {
            this.isFocused = true;
            this.$emit('focus', e);
        },
        onBlur(e) {
            this.isFocused = false;
            this.$emit('blur', e);
        },
        onChange() {
            if (this.isDisabled || this.isReadonly || this.isActive)
                return;
            this.toggle();
        },
        onKeydown: () => { }, // Override default with noop
    },
    render() {
        const data = {
            class: ['v-radio', this.classes],
            ...mergeListeners({
                onClick: this.onChange,
            }, this.listeners$),
            title: this.attrs$.title
        };
        return h('div', data, [
            this.genRadio(),
            this.genLabel(),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlJhZGlvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlJhZGlvR3JvdXAvVlJhZGlvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxDQUFDLEVBQUMsTUFBTSxLQUFLLENBQUE7QUFDckIsU0FBUztBQUNULE9BQU8sZUFBZSxDQUFBO0FBSXRCLE9BQU8sTUFBTSxNQUFNLFdBQVcsQ0FBQTtBQUM5QixPQUFPLEtBQUssTUFBTSxVQUFVLENBQUE7QUFDNUIsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFBO0FBRTlCLFNBQVM7QUFDVCxPQUFPLFVBQVUsTUFBTSwwQkFBMEIsQ0FBQTtBQUNqRCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLEVBQUUsT0FBTyxJQUFJLGdCQUFnQixFQUFFLE1BQU0sd0JBQXdCLENBQUE7QUFDcEUsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxVQUFVLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQTtBQUU3RCxZQUFZO0FBQ1osT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBSTVDLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBQ3RDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQTtBQUVyRCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQ3ZCLFVBQVUsRUFDVixTQUFTLEVBQ1QsVUFBVSxFQUNWLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxFQUM5QixTQUFTLENBQ1YsQ0FBQTtBQU1ELG9CQUFvQjtBQUNwQixlQUFlLFVBQVUsQ0FBQyxNQUFNLENBQUM7SUFDL0IsSUFBSSxFQUFFLFNBQVM7SUFFZixZQUFZLEVBQUUsS0FBSztJQUVuQixLQUFLLEVBQUUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxF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QVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDcEQsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELE9BQU8sQ0FBRSxDQUFRO1lBQ2YsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUE7WUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDeEIsQ0FBQztRQUNELE1BQU0sQ0FBRSxDQUFRO1lBQ2QsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUE7WUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDdkIsQ0FBQztRQUNELFFBQVE7WUFDTixJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsUUFBUTtnQkFBRSxPQUFNO1lBRS9ELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUNmLENBQUM7UUFDRCxTQUFTLEVBQUUsR0FBRyxFQUFFLEdBQUUsQ0FBQyxFQUFFLDZCQUE2QjtLQUNuRDtJQUVELE1BQU07UUFDSixNQUFNLElBQUksR0FBYztZQUN0QixLQUFLLEVBQUUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUNoQyxHQUFHLGNBQWMsQ0FBQztnQkFDaEIsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRO2FBQ3ZCLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNuQixLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLO1NBQ3pCLENBQUE7UUFFRCxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixJQUFJLENBQUMsUUFBUSxFQUFFO1NBQ2hCLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2h9IGZyb20gJ3Z1ZSdcbi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZSYWRpby5zYXNzJ1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgVlJhZGlvR3JvdXAgZnJvbSAnLi9WUmFkaW9Hcm91cCdcbmltcG9ydCBWTGFiZWwgZnJvbSAnLi4vVkxhYmVsJ1xuaW1wb3J0IFZJY29uIGZyb20gJy4uL1ZJY29uJ1xuaW1wb3J0IFZJbnB1dCBmcm9tICcuLi9WSW5wdXQnXG5cbi8vIE1peGluc1xuaW1wb3J0IEJpbmRzQXR0cnMgZnJvbSAnLi4vLi4vbWl4aW5zL2JpbmRzLWF0dHJzJ1xuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xuaW1wb3J0IHsgZmFjdG9yeSBhcyBHcm91cGFibGVGYWN0b3J5IH0gZnJvbSAnLi4vLi4vbWl4aW5zL2dyb3VwYWJsZSdcbmltcG9ydCBSaXBwbGVhYmxlIGZyb20gJy4uLy4uL21peGlucy9yaXBwbGVhYmxlJ1xuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xuaW1wb3J0IFNlbGVjdGFibGUsIHsgcHJldmVudCB9IGZyb20gJy4uLy4uL21peGlucy9zZWxlY3RhYmxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCB7IGdldFNsb3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSwgVk5vZGVEYXRhIH0gZnJvbSAndnVlJ1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IG1lcmdlTGlzdGVuZXJzIH0gZnJvbSAnLi4vLi4vdXRpbC9tZXJnZURhdGEnXG5cbmNvbnN0IGJhc2VNaXhpbnMgPSBtaXhpbnMoXG4gIEJpbmRzQXR0cnMsXG4gIENvbG9yYWJsZSxcbiAgUmlwcGxlYWJsZSxcbiAgR3JvdXBhYmxlRmFjdG9yeSgncmFkaW9Hcm91cCcpLFxuICBUaGVtZWFibGVcbilcblxuaW50ZXJmYWNlIG9wdGlvbnMgZXh0ZW5kcyBJbnN0YW5jZVR5cGU8dHlwZW9mIGJhc2VNaXhpbnM+IHtcbiAgcmFkaW9Hcm91cDogSW5zdGFuY2VUeXBlPHR5cGVvZiBWUmFkaW9Hcm91cD5cbn1cblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGJhc2VNaXhpbnMuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtcmFkaW8nLFxuXG4gIGluaGVyaXRBdHRyczogZmFsc2UsXG5cbiAgZW1pdHM6IFsnY2hhbmdlJywgJ2ZvY3VzJywgJ2JsdXInXSxcblxuICBwcm9wczoge1xuICAgIGRpc2FibGVkOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICB9LFxuICAgIGlkOiBTdHJpbmcsXG4gICAgbGFiZWw6IFN0cmluZyxcbiAgICBuYW1lOiBTdHJpbmcsXG4gICAgb2ZmSWNvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyRyYWRpb09mZicsXG4gICAgfSxcbiAgICBvbkljb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckcmFkaW9PbicsXG4gICAgfSxcbiAgICByZWFkb25seToge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgfSxcbiAgICB2YWx1ZToge1xuICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICB9LFxuICB9LFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgaXNGb2N1c2VkOiBmYWxzZSxcbiAgfSksXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ3YtcmFkaW8tLWlzLWRpc2FibGVkJzogdGhpcy5pc0Rpc2FibGVkLFxuICAgICAgICAndi1yYWRpby0taXMtZm9jdXNlZCc6IHRoaXMuaXNGb2N1c2VkLFxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3NlcyxcbiAgICAgICAgLi4udGhpcy5ncm91cENsYXNzZXMsXG4gICAgICB9XG4gICAgfSxcbiAgICBjb21wdXRlZENvbG9yICgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgaWYgKHRoaXMuaXNEaXNhYmxlZCkgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgcmV0dXJuIFNlbGVjdGFibGUuY29tcHV0ZWQuY29tcHV0ZWRDb2xvci5jYWxsKHRoaXMpXG4gICAgfSxcbiAgICBjb21wdXRlZEljb24gKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gdGhpcy5pc0FjdGl2ZVxuICAgICAgICA/IHRoaXMub25JY29uXG4gICAgICAgIDogdGhpcy5vZmZJY29uXG4gICAgfSxcbiAgICBjb21wdXRlZElkICgpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuIFZJbnB1dC5jb21wdXRlZC5jb21wdXRlZElkLmNhbGwodGhpcylcbiAgICB9LFxuICAgIGhhc0xhYmVsOiBWSW5wdXQuY29tcHV0ZWQuaGFzTGFiZWwsXG4gICAgaGFzU3RhdGUgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuICh0aGlzLnJhZGlvR3JvdXAgfHwge30pLmhhc1N0YXRlXG4gICAgfSxcbiAgICBpc0Rpc2FibGVkICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID8/IChcbiAgICAgICAgISF0aGlzLnJhZGlvR3JvdXAgJiZcbiAgICAgICAgdGhpcy5yYWRpb0dyb3VwLmlzRGlzYWJsZWRcbiAgICAgIClcbiAgICB9LFxuICAgIGlzUmVhZG9ubHkgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZG9ubHkgPz8gKFxuICAgICAgICAhIXRoaXMucmFkaW9Hcm91cCAmJlxuICAgICAgICB0aGlzLnJhZGlvR3JvdXAuaXNSZWFkb25seVxuICAgICAgKVxuICAgIH0sXG4gICAgY29tcHV0ZWROYW1lICgpOiBzdHJpbmcge1xuICAgICAgaWYgKHRoaXMubmFtZSB8fCAhdGhpcy5yYWRpb0dyb3VwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWVcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucmFkaW9Hcm91cC5uYW1lIHx8IGByYWRpby0ke3RoaXMucmFkaW9Hcm91cC4kLnVpZH1gXG4gICAgfSxcbiAgICByaXBwbGVTdGF0ZSAoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgIHJldHVybiBTZWxlY3RhYmxlLmNvbXB1dGVkLnJpcHBsZVN0YXRlLmNhbGwodGhpcylcbiAgICB9LFxuICAgIHZhbGlkYXRpb25TdGF0ZSAoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgIHJldHVybiAodGhpcy5yYWRpb0dyb3VwIHx8IHt9KS52YWxpZGF0aW9uU3RhdGUgfHwgdGhpcy5jb21wdXRlZENvbG9yXG4gICAgfSxcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2VuSW5wdXQgKGFyZ3M6IGFueSkge1xuICAgICAgLy8gV2UgY2FuJ3QgYWN0dWFsbHkgdXNlIHRoZSBtaXhpbiBkaXJlY3RseSBiZWNhdXNlXG4gICAgICAvLyBpdCdzIG1hZGUgZm9yIHN0YW5kYWxvbmUgY29tcG9uZW50cywgYnV0IGl0c1xuICAgICAgLy8gZ2VuSW5wdXQgbWV0aG9kIGlzIGV4YWN0bHkgd2hhdCB3ZSBuZWVkXG4gICAgICByZXR1cm4gU2VsZWN0YWJsZS5tZXRob2RzLmdlbklucHV0LmNhbGwodGhpcywgJ3JhZGlvJywgYXJncylcbiAgICB9LFxuICAgIGdlbkxhYmVsICgpIHtcbiAgICAgIGlmICghdGhpcy5oYXNMYWJlbCkgcmV0dXJuIG51bGxcblxuICAgICAgcmV0dXJuIGgoVkxhYmVsLCB7XG4gICAgICAgIC8vIExhYmVsIHNob3VsZG4ndCBjYXVzZSB0aGUgaW5wdXQgdG8gZm9jdXNcbiAgICAgICAgb25DbGljazogcHJldmVudCxcbiAgICAgICAgZm9yOiB0aGlzLmNvbXB1dGVkSWQsXG4gICAgICAgIGNvbG9yOiB0aGlzLnZhbGlkYXRpb25TdGF0ZSxcbiAgICAgICAgZm9jdXNlZDogdGhpcy5oYXNTdGF0ZSxcbiAgICAgIH0sICgpID0+IGdldFNsb3QodGhpcywgJ2xhYmVsJykgfHwgdGhpcy5sYWJlbClcbiAgICB9LFxuICAgIGdlblJhZGlvICgpIHtcbiAgICAgIGNvbnN0IHsgdGl0bGUsIC4uLnJhZGlvQXR0cnMgfSA9IHRoaXMuYXR0cnMkXG5cbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiAndi1pbnB1dC0tc2VsZWN0aW9uLWNvbnRyb2xzX19pbnB1dCcsXG4gICAgICB9LCBbXG4gICAgICAgIGgoVkljb24sIHRoaXMuc2V0VGV4dENvbG9yKHRoaXMudmFsaWRhdGlvblN0YXRlLCB7XG4gICAgICAgICAgZGVuc2U6IHRoaXMucmFkaW9Hcm91cCAmJiB0aGlzLnJhZGlvR3JvdXAuZGVuc2UsXG4gICAgICAgIH0pLCAoKSA9PiB0aGlzLmNvbXB1dGVkSWNvbiksXG4gICAgICAgIHRoaXMuZ2VuSW5wdXQoe1xuICAgICAgICAgIG5hbWU6IHRoaXMuY29tcHV0ZWROYW1lLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgICAgIC4uLnJhZGlvQXR0cnMsXG4gICAgICAgIH0pLFxuICAgICAgICB0aGlzLmdlblJpcHBsZSh0aGlzLnNldFRleHRDb2xvcih0aGlzLnJpcHBsZVN0YXRlKSksXG4gICAgICBdKVxuICAgIH0sXG4gICAgb25Gb2N1cyAoZTogRXZlbnQpIHtcbiAgICAgIHRoaXMuaXNGb2N1c2VkID0gdHJ1ZVxuICAgICAgdGhpcy4kZW1pdCgnZm9jdXMnLCBlKVxuICAgIH0sXG4gICAgb25CbHVyIChlOiBFdmVudCkge1xuICAgICAgdGhpcy5pc0ZvY3VzZWQgPSBmYWxzZVxuICAgICAgdGhpcy4kZW1pdCgnYmx1cicsIGUpXG4gICAgfSxcbiAgICBvbkNoYW5nZSAoKSB7XG4gICAgICBpZiAodGhpcy5pc0Rpc2FibGVkIHx8IHRoaXMuaXNSZWFkb25seSB8fCB0aGlzLmlzQWN0aXZlKSByZXR1cm5cblxuICAgICAgdGhpcy50b2dnbGUoKVxuICAgIH0sXG4gICAgb25LZXlkb3duOiAoKSA9PiB7fSwgLy8gT3ZlcnJpZGUgZGVmYXVsdCB3aXRoIG5vb3BcbiAgfSxcblxuICByZW5kZXIgKCk6IFZOb2RlIHtcbiAgICBjb25zdCBkYXRhOiBWTm9kZURhdGEgPSB7XG4gICAgICBjbGFzczogWyd2LXJhZGlvJywgdGhpcy5jbGFzc2VzXSxcbiAgICAgIC4uLm1lcmdlTGlzdGVuZXJzKHtcbiAgICAgICAgb25DbGljazogdGhpcy5vbkNoYW5nZSxcbiAgICAgIH0sIHRoaXMubGlzdGVuZXJzJCksXG4gICAgICB0aXRsZTogdGhpcy5hdHRycyQudGl0bGVcbiAgICB9XG5cbiAgICByZXR1cm4gaCgnZGl2JywgZGF0YSwgW1xuICAgICAgdGhpcy5nZW5SYWRpbygpLFxuICAgICAgdGhpcy5nZW5MYWJlbCgpLFxuICAgIF0pXG4gIH0sXG59KVxuIl19