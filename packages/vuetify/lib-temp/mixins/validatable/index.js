// Mixins
import Colorable from '../colorable';
import Themeable from '../themeable';
import { inject as RegistrableInject } from '../registrable';
// Utilities
import { deepEqual } from '../../util/helpers';
import { consoleError } from '../../util/console';
import { defineComponent } from 'vue';
/* @vue/component */
export default defineComponent({
    name: 'validatable',
    extends: RegistrableInject('form'),
    mixins: [Colorable, Themeable],
    props: {
        disabled: {
            type: Boolean,
            default: null,
        },
        error: Boolean,
        errorCount: {
            type: [Number, String],
            default: 1,
        },
        errorMessages: {
            type: [String, Array],
            default: () => [],
        },
        messages: {
            type: [String, Array],
            default: () => [],
        },
        readonly: {
            type: Boolean,
            default: null,
        },
        rules: {
            type: Array,
            default: () => [],
        },
        success: Boolean,
        successMessages: {
            type: [String, Array],
            default: () => [],
        },
        validateOnBlur: Boolean,
        modelValue: { required: false },
    },
    data() {
        var _a;
        return {
            errorBucket: [],
            hasColor: false,
            hasFocused: false,
            hasInput: false,
            isFocused: false,
            isResetting: false,
            lazyValue: (_a = this.modelValue) !== null && _a !== void 0 ? _a : null,
            valid: false,
        };
    },
    computed: {
        computedColor() {
            if (this.isDisabled)
                return undefined;
            if (this.color)
                return this.color;
            // It's assumed that if the input is on a
            // dark background, the user will want to
            // have a white color. If the entire app
            // is setup to be dark, then they will
            // like want to use their primary color
            if (this.isDark && !this.appIsDark)
                return 'white';
            else
                return 'primary';
        },
        hasError() {
            return (this.internalErrorMessages.length > 0 ||
                this.errorBucket.length > 0 ||
                this.error);
        },
        // TODO: Add logic that allows the user to enable based
        // upon a good validation
        hasSuccess() {
            return (this.internalSuccessMessages.length > 0 ||
                this.success);
        },
        externalError() {
            return this.internalErrorMessages.length > 0 || this.error;
        },
        hasMessages() {
            return this.validationTarget.length > 0;
        },
        hasState() {
            if (this.isDisabled)
                return false;
            return (this.hasSuccess ||
                (this.shouldValidate && this.hasError));
        },
        internalErrorMessages() {
            return this.genInternalMessages(this.errorMessages);
        },
        internalMessages() {
            return this.genInternalMessages(this.messages);
        },
        internalSuccessMessages() {
            return this.genInternalMessages(this.successMessages);
        },
        internalValue: {
            get() {
                return this.lazyValue;
            },
            set(val) {
                this.lazyValue = val;
                this.$emit('input', val);
                this.$emit('update:modelValue', val);
            },
        },
        isDisabled() {
            var _a;
            return (_a = this.disabled) !== null && _a !== void 0 ? _a : (!!this.form &&
                this.form.disabled);
        },
        isInteractive() {
            return !this.isDisabled && !this.isReadonly;
        },
        isReadonly() {
            var _a;
            return (_a = this.readonly) !== null && _a !== void 0 ? _a : (!!this.form &&
                this.form.readonly);
        },
        shouldValidate() {
            if (this.externalError)
                return true;
            if (this.isResetting)
                return false;
            return this.validateOnBlur
                ? this.hasFocused && !this.isFocused
                : (this.hasInput || this.hasFocused);
        },
        validations() {
            return this.validationTarget.slice(0, Number(this.errorCount));
        },
        validationState() {
            if (this.isDisabled)
                return undefined;
            if (this.hasError && this.shouldValidate)
                return 'error';
            if (this.hasSuccess)
                return 'success';
            if (this.hasColor)
                return this.computedColor;
            return undefined;
        },
        validationTarget() {
            if (this.internalErrorMessages.length > 0) {
                return this.internalErrorMessages;
            }
            else if (this.successMessages && this.successMessages.length > 0) {
                return this.internalSuccessMessages;
            }
            else if (this.messages && this.messages.length > 0) {
                return this.internalMessages;
            }
            else if (this.shouldValidate) {
                return this.errorBucket;
            }
            else
                return [];
        },
    },
    watch: {
        rules: {
            handler(newVal, oldVal) {
                if (deepEqual(newVal, oldVal))
                    return;
                this.validate();
            },
            deep: true,
        },
        internalValue() {
            // If it's the first time we're setting input,
            // mark it with hasInput
            this.hasInput = true;
            this.validateOnBlur || this.$nextTick(this.validate);
        },
        isFocused(val) {
            // Should not check validation
            // if disabled
            if (!val &&
                !this.isDisabled) {
                this.hasFocused = true;
                this.validateOnBlur && this.$nextTick(this.validate);
            }
        },
        isResetting() {
            setTimeout(() => {
                this.hasInput = false;
                this.hasFocused = false;
                this.isResetting = false;
                this.validate();
            }, 0);
        },
        hasError(val) {
            if (this.shouldValidate) {
                this.$emit('update:error', val);
            }
        },
        modelValue(val) {
            this.lazyValue = val;
        },
    },
    beforeMount() {
        this.validate();
    },
    created() {
        this.form && this.form.register(this);
    },
    beforeUnmount() {
        this.form && this.form.unregister(this);
    },
    methods: {
        genInternalMessages(messages) {
            if (!messages)
                return [];
            else if (Array.isArray(messages))
                return messages;
            else
                return [messages];
        },
        /** @public */
        reset() {
            this.isResetting = true;
            this.internalValue = Array.isArray(this.internalValue)
                ? []
                : null;
        },
        /** @public */
        resetValidation() {
            this.isResetting = true;
        },
        /** @public */
        validate(force = false, value) {
            const errorBucket = [];
            value = value || this.internalValue;
            if (force)
                this.hasInput = this.hasFocused = true;
            for (let index = 0; index < this.rules.length; index++) {
                const rule = this.rules[index];
                const valid = typeof rule === 'function' ? rule(value) : rule;
                if (valid === false || typeof valid === 'string') {
                    errorBucket.push(valid || '');
                }
                else if (typeof valid !== 'boolean') {
                    consoleError(`Rules should return a string or boolean, received '${typeof valid}' instead`, this);
                }
            }
            this.errorBucket = errorBucket;
            this.valid = errorBucket.length === 0;
            return this.valid;
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3ZhbGlkYXRhYmxlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSxjQUFjLENBQUE7QUFDcEMsT0FBTyxTQUFTLE1BQU0sY0FBYyxDQUFBO0FBQ3BDLE9BQU8sRUFBRSxNQUFNLElBQUksaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUU1RCxZQUFZO0FBQ1osT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQzlDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUNqRCxPQUFPLEVBQUUsZUFBZSxFQUFZLE1BQU0sS0FBSyxDQUFBO0FBSy9DLG9CQUFvQjtBQUNwQixlQUFlLGVBQWUsQ0FBQztJQUM3QixJQUFJLEVBQUUsYUFBYTtJQUVuQixPQUFPLEVBQUUsaUJBQWlCLENBQWMsTUFBTSxDQUFDO0lBRS9DLE1BQU0sRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUM7SUFFOUIsS0FBSyxFQUFFO1FBQ0wsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsS0FBSyxFQUFFLE9BQU87UUFDZCxVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFDRCxhQUFhLEVBQUU7WUFDYixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFrQztZQUN0RCxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTtTQUNsQjtRQUNELFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQWtDO1lBQ3RELE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFO1NBQ2xCO1FBQ0Qs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QyxDQUFDLENBQUMsSUFBSSxDQUFBO2dCQUU3RCxJQUFJLEtBQUssS0FBSyxLQUFLLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO29CQUNoRCxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQTtpQkFDOUI7cUJBQU0sSUFBSSxPQUFPLEtBQUssS0FBSyxTQUFTLEVBQUU7b0JBQ3JDLFlBQVksQ0FBQyxzREFBc0QsT0FBTyxLQUFLLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQTtpQkFDbEc7YUFDRjtZQUVELElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFBO1lBQzlCLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUE7WUFFckMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBO1FBQ25CLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIE1peGluc1xuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi9jb2xvcmFibGUnXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uL3RoZW1lYWJsZSdcbmltcG9ydCB7IGluamVjdCBhcyBSZWdpc3RyYWJsZUluamVjdCB9IGZyb20gJy4uL3JlZ2lzdHJhYmxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCB7IGRlZXBFcXVhbCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcbmltcG9ydCB7IGNvbnNvbGVFcnJvciB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcbmltcG9ydCB7IGRlZmluZUNvbXBvbmVudCwgUHJvcFR5cGUgfSBmcm9tICd2dWUnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBJbnB1dE1lc3NhZ2UsIElucHV0VmFsaWRhdGlvblJ1bGVzIH0gZnJvbSAndnVldGlmeS90eXBlcydcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XG4gIG5hbWU6ICd2YWxpZGF0YWJsZScsXG5cbiAgZXh0ZW5kczogUmVnaXN0cmFibGVJbmplY3Q8J2Zvcm0nLCBhbnk+KCdmb3JtJyksXG5cbiAgbWl4aW5zOiBbQ29sb3JhYmxlLCBUaGVtZWFibGVdLFxuXG4gIHByb3BzOiB7XG4gICAgZGlzYWJsZWQ6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiBudWxsLFxuICAgIH0sXG4gICAgZXJyb3I6IEJvb2xlYW4sXG4gICAgZXJyb3JDb3VudDoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDEsXG4gICAgfSxcbiAgICBlcnJvck1lc3NhZ2VzOiB7XG4gICAgICB0eXBlOiBbU3RyaW5nLCBBcnJheV0gYXMgUHJvcFR5cGU8SW5wdXRNZXNzYWdlIHwgbnVsbD4sXG4gICAgICBkZWZhdWx0OiAoKSA9PiBbXSxcbiAgICB9LFxuICAgIG1lc3NhZ2VzOiB7XG4gICAgICB0eXBlOiBbU3RyaW5nLCBBcnJheV0gYXMgUHJvcFR5cGU8SW5wdXRNZXNzYWdlIHwgbnVsbD4sXG4gICAgICBkZWZhdWx0OiAoKSA9PiBbXSxcbiAgICB9LFxuICAgIHJlYWRvbmx5OiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICB9LFxuICAgIHJ1bGVzOiB7XG4gICAgICB0eXBlOiBBcnJheSBhcyBQcm9wVHlwZTxJbnB1dFZhbGlkYXRpb25SdWxlcz4sXG4gICAgICBkZWZhdWx0OiAoKSA9PiBbXSxcbiAgICB9LFxuICAgIHN1Y2Nlc3M6IEJvb2xlYW4sXG4gICAgc3VjY2Vzc01lc3NhZ2VzOiB7XG4gICAgICB0eXBlOiBbU3RyaW5nLCBBcnJheV0gYXMgUHJvcFR5cGU8SW5wdXRNZXNzYWdlIHwgbnVsbD4sXG4gICAgICBkZWZhdWx0OiAoKSA9PiBbXSxcbiAgICB9LFxuICAgIHZhbGlkYXRlT25CbHVyOiBCb29sZWFuLFxuICAgIG1vZGVsVmFsdWU6IHsgcmVxdWlyZWQ6IGZhbHNlIH0sXG4gIH0sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVycm9yQnVja2V0OiBbXSBhcyBzdHJpbmdbXSxcbiAgICAgIGhhc0NvbG9yOiBmYWxzZSxcbiAgICAgIGhhc0ZvY3VzZWQ6IGZhbHNlLFxuICAgICAgaGFzSW5wdXQ6IGZhbHNlLFxuICAgICAgaXNGb2N1c2VkOiBmYWxzZSxcbiAgICAgIGlzUmVzZXR0aW5nOiBmYWxzZSxcbiAgICAgIGxhenlWYWx1ZTogdGhpcy5tb2RlbFZhbHVlID8/IG51bGwsXG4gICAgICB2YWxpZDogZmFsc2UsXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY29tcHV0ZWRDb2xvciAoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgIGlmICh0aGlzLmlzRGlzYWJsZWQpIHJldHVybiB1bmRlZmluZWRcbiAgICAgIGlmICh0aGlzLmNvbG9yKSByZXR1cm4gdGhpcy5jb2xvclxuICAgICAgLy8gSXQncyBhc3N1bWVkIHRoYXQgaWYgdGhlIGlucHV0IGlzIG9uIGFcbiAgICAgIC8vIGRhcmsgYmFja2dyb3VuZCwgdGhlIHVzZXIgd2lsbCB3YW50IHRvXG4gICAgICAvLyBoYXZlIGEgd2hpdGUgY29sb3IuIElmIHRoZSBlbnRpcmUgYXBwXG4gICAgICAvLyBpcyBzZXR1cCB0byBiZSBkYXJrLCB0aGVuIHRoZXkgd2lsbFxuICAgICAgLy8gbGlrZSB3YW50IHRvIHVzZSB0aGVpciBwcmltYXJ5IGNvbG9yXG4gICAgICBpZiAodGhpcy5pc0RhcmsgJiYgIXRoaXMuYXBwSXNEYXJrKSByZXR1cm4gJ3doaXRlJ1xuICAgICAgZWxzZSByZXR1cm4gJ3ByaW1hcnknXG4gICAgfSxcbiAgICBoYXNFcnJvciAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICB0aGlzLmludGVybmFsRXJyb3JNZXNzYWdlcy5sZW5ndGggPiAwIHx8XG4gICAgICAgIHRoaXMuZXJyb3JCdWNrZXQubGVuZ3RoID4gMCB8fFxuICAgICAgICB0aGlzLmVycm9yXG4gICAgICApXG4gICAgfSxcbiAgICAvLyBUT0RPOiBBZGQgbG9naWMgdGhhdCBhbGxvd3MgdGhlIHVzZXIgdG8gZW5hYmxlIGJhc2VkXG4gICAgLy8gdXBvbiBhIGdvb2QgdmFsaWRhdGlvblxuICAgIGhhc1N1Y2Nlc3MgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgdGhpcy5pbnRlcm5hbFN1Y2Nlc3NNZXNzYWdlcy5sZW5ndGggPiAwIHx8XG4gICAgICAgIHRoaXMuc3VjY2Vzc1xuICAgICAgKVxuICAgIH0sXG4gICAgZXh0ZXJuYWxFcnJvciAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbEVycm9yTWVzc2FnZXMubGVuZ3RoID4gMCB8fCB0aGlzLmVycm9yXG4gICAgfSxcbiAgICBoYXNNZXNzYWdlcyAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy52YWxpZGF0aW9uVGFyZ2V0Lmxlbmd0aCA+IDBcbiAgICB9LFxuICAgIGhhc1N0YXRlICgpOiBib29sZWFuIHtcbiAgICAgIGlmICh0aGlzLmlzRGlzYWJsZWQpIHJldHVybiBmYWxzZVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICB0aGlzLmhhc1N1Y2Nlc3MgfHxcbiAgICAgICAgKHRoaXMuc2hvdWxkVmFsaWRhdGUgJiYgdGhpcy5oYXNFcnJvcilcbiAgICAgIClcbiAgICB9LFxuICAgIGludGVybmFsRXJyb3JNZXNzYWdlcyAoKTogSW5wdXRWYWxpZGF0aW9uUnVsZXMge1xuICAgICAgcmV0dXJuIHRoaXMuZ2VuSW50ZXJuYWxNZXNzYWdlcyh0aGlzLmVycm9yTWVzc2FnZXMpXG4gICAgfSxcbiAgICBpbnRlcm5hbE1lc3NhZ2VzICgpOiBJbnB1dFZhbGlkYXRpb25SdWxlcyB7XG4gICAgICByZXR1cm4gdGhpcy5nZW5JbnRlcm5hbE1lc3NhZ2VzKHRoaXMubWVzc2FnZXMpXG4gICAgfSxcbiAgICBpbnRlcm5hbFN1Y2Nlc3NNZXNzYWdlcyAoKTogSW5wdXRWYWxpZGF0aW9uUnVsZXMge1xuICAgICAgcmV0dXJuIHRoaXMuZ2VuSW50ZXJuYWxNZXNzYWdlcyh0aGlzLnN1Y2Nlc3NNZXNzYWdlcylcbiAgICB9LFxuICAgIGludGVybmFsVmFsdWU6IHtcbiAgICAgIGdldCAoKTogdW5rbm93biB7XG4gICAgICAgIHJldHVybiB0aGlzLmxhenlWYWx1ZVxuICAgICAgfSxcbiAgICAgIHNldCAodmFsOiBhbnkpIHtcbiAgICAgICAgdGhpcy5sYXp5VmFsdWUgPSB2YWxcblxuICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHZhbClcbiAgICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOm1vZGVsVmFsdWUnLCB2YWwpXG4gICAgICB9LFxuICAgIH0sXG4gICAgaXNEaXNhYmxlZCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/PyAoXG4gICAgICAgICEhdGhpcy5mb3JtICYmXG4gICAgICAgIHRoaXMuZm9ybS5kaXNhYmxlZFxuICAgICAgKVxuICAgIH0sXG4gICAgaXNJbnRlcmFjdGl2ZSAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gIXRoaXMuaXNEaXNhYmxlZCAmJiAhdGhpcy5pc1JlYWRvbmx5XG4gICAgfSxcbiAgICBpc1JlYWRvbmx5ICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWRvbmx5ID8/IChcbiAgICAgICAgISF0aGlzLmZvcm0gJiZcbiAgICAgICAgdGhpcy5mb3JtLnJlYWRvbmx5XG4gICAgICApXG4gICAgfSxcbiAgICBzaG91bGRWYWxpZGF0ZSAoKTogYm9vbGVhbiB7XG4gICAgICBpZiAodGhpcy5leHRlcm5hbEVycm9yKSByZXR1cm4gdHJ1ZVxuICAgICAgaWYgKHRoaXMuaXNSZXNldHRpbmcpIHJldHVybiBmYWxzZVxuXG4gICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZU9uQmx1clxuICAgICAgICA/IHRoaXMuaGFzRm9jdXNlZCAmJiAhdGhpcy5pc0ZvY3VzZWRcbiAgICAgICAgOiAodGhpcy5oYXNJbnB1dCB8fCB0aGlzLmhhc0ZvY3VzZWQpXG4gICAgfSxcbiAgICB2YWxpZGF0aW9ucyAoKTogSW5wdXRWYWxpZGF0aW9uUnVsZXMge1xuICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGlvblRhcmdldC5zbGljZSgwLCBOdW1iZXIodGhpcy5lcnJvckNvdW50KSlcbiAgICB9LFxuICAgIHZhbGlkYXRpb25TdGF0ZSAoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgIGlmICh0aGlzLmlzRGlzYWJsZWQpIHJldHVybiB1bmRlZmluZWRcbiAgICAgIGlmICh0aGlzLmhhc0Vycm9yICYmIHRoaXMuc2hvdWxkVmFsaWRhdGUpIHJldHVybiAnZXJyb3InXG4gICAgICBpZiAodGhpcy5oYXNTdWNjZXNzKSByZXR1cm4gJ3N1Y2Nlc3MnXG4gICAgICBpZiAodGhpcy5oYXNDb2xvcikgcmV0dXJuIHRoaXMuY29tcHV0ZWRDb2xvclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH0sXG4gICAgdmFsaWRhdGlvblRhcmdldCAoKTogSW5wdXRWYWxpZGF0aW9uUnVsZXMge1xuICAgICAgaWYgKHRoaXMuaW50ZXJuYWxFcnJvck1lc3NhZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxFcnJvck1lc3NhZ2VzXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3VjY2Vzc01lc3NhZ2VzICYmIHRoaXMuc3VjY2Vzc01lc3NhZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxTdWNjZXNzTWVzc2FnZXNcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tZXNzYWdlcyAmJiB0aGlzLm1lc3NhZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxNZXNzYWdlc1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnNob3VsZFZhbGlkYXRlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVycm9yQnVja2V0XG4gICAgICB9IGVsc2UgcmV0dXJuIFtdXG4gICAgfSxcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIHJ1bGVzOiB7XG4gICAgICBoYW5kbGVyIChuZXdWYWwsIG9sZFZhbCkge1xuICAgICAgICBpZiAoZGVlcEVxdWFsKG5ld1ZhbCwgb2xkVmFsKSkgcmV0dXJuXG4gICAgICAgIHRoaXMudmFsaWRhdGUoKVxuICAgICAgfSxcbiAgICAgIGRlZXA6IHRydWUsXG4gICAgfSxcbiAgICBpbnRlcm5hbFZhbHVlICgpIHtcbiAgICAgIC8vIElmIGl0J3MgdGhlIGZpcnN0IHRpbWUgd2UncmUgc2V0dGluZyBpbnB1dCxcbiAgICAgIC8vIG1hcmsgaXQgd2l0aCBoYXNJbnB1dFxuICAgICAgdGhpcy5oYXNJbnB1dCA9IHRydWVcbiAgICAgIHRoaXMudmFsaWRhdGVPbkJsdXIgfHwgdGhpcy4kbmV4dFRpY2sodGhpcy52YWxpZGF0ZSlcbiAgICB9LFxuICAgIGlzRm9jdXNlZCAodmFsKSB7XG4gICAgICAvLyBTaG91bGQgbm90IGNoZWNrIHZhbGlkYXRpb25cbiAgICAgIC8vIGlmIGRpc2FibGVkXG4gICAgICBpZiAoXG4gICAgICAgICF2YWwgJiZcbiAgICAgICAgIXRoaXMuaXNEaXNhYmxlZFxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuaGFzRm9jdXNlZCA9IHRydWVcbiAgICAgICAgdGhpcy52YWxpZGF0ZU9uQmx1ciAmJiB0aGlzLiRuZXh0VGljayh0aGlzLnZhbGlkYXRlKVxuICAgICAgfVxuICAgIH0sXG4gICAgaXNSZXNldHRpbmcgKCkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuaGFzSW5wdXQgPSBmYWxzZVxuICAgICAgICB0aGlzLmhhc0ZvY3VzZWQgPSBmYWxzZVxuICAgICAgICB0aGlzLmlzUmVzZXR0aW5nID0gZmFsc2VcbiAgICAgICAgdGhpcy52YWxpZGF0ZSgpXG4gICAgICB9LCAwKVxuICAgIH0sXG4gICAgaGFzRXJyb3IgKHZhbCkge1xuICAgICAgaWYgKHRoaXMuc2hvdWxkVmFsaWRhdGUpIHtcbiAgICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOmVycm9yJywgdmFsKVxuICAgICAgfVxuICAgIH0sXG4gICAgbW9kZWxWYWx1ZSAodmFsKSB7XG4gICAgICB0aGlzLmxhenlWYWx1ZSA9IHZhbFxuICAgIH0sXG4gIH0sXG5cbiAgYmVmb3JlTW91bnQgKCkge1xuICAgIHRoaXMudmFsaWRhdGUoKVxuICB9LFxuXG4gIGNyZWF0ZWQgKCkge1xuICAgIHRoaXMuZm9ybSAmJiB0aGlzLmZvcm0ucmVnaXN0ZXIodGhpcylcbiAgfSxcblxuICBiZWZvcmVVbm1vdW50ICgpIHtcbiAgICB0aGlzLmZvcm0gJiYgdGhpcy5mb3JtLnVucmVnaXN0ZXIodGhpcylcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2VuSW50ZXJuYWxNZXNzYWdlcyAobWVzc2FnZXM6IElucHV0TWVzc2FnZSB8IG51bGwpOiBJbnB1dFZhbGlkYXRpb25SdWxlcyB7XG4gICAgICBpZiAoIW1lc3NhZ2VzKSByZXR1cm4gW11cbiAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkobWVzc2FnZXMpKSByZXR1cm4gbWVzc2FnZXNcbiAgICAgIGVsc2UgcmV0dXJuIFttZXNzYWdlc11cbiAgICB9LFxuICAgIC8qKiBAcHVibGljICovXG4gICAgcmVzZXQgKCkge1xuICAgICAgdGhpcy5pc1Jlc2V0dGluZyA9IHRydWVcbiAgICAgIHRoaXMuaW50ZXJuYWxWYWx1ZSA9IEFycmF5LmlzQXJyYXkodGhpcy5pbnRlcm5hbFZhbHVlKVxuICAgICAgICA/IFtdXG4gICAgICAgIDogbnVsbFxuICAgIH0sXG4gICAgLyoqIEBwdWJsaWMgKi9cbiAgICByZXNldFZhbGlkYXRpb24gKCkge1xuICAgICAgdGhpcy5pc1Jlc2V0dGluZyA9IHRydWVcbiAgICB9LFxuICAgIC8qKiBAcHVibGljICovXG4gICAgdmFsaWRhdGUgKGZvcmNlID0gZmFsc2UsIHZhbHVlPzogYW55KTogYm9vbGVhbiB7XG4gICAgICBjb25zdCBlcnJvckJ1Y2tldCA9IFtdXG4gICAgICB2YWx1ZSA9IHZhbHVlIHx8IHRoaXMuaW50ZXJuYWxWYWx1ZVxuXG4gICAgICBpZiAoZm9yY2UpIHRoaXMuaGFzSW5wdXQgPSB0aGlzLmhhc0ZvY3VzZWQgPSB0cnVlXG5cbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnJ1bGVzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICBjb25zdCBydWxlID0gdGhpcy5ydWxlc1tpbmRleF1cbiAgICAgICAgY29uc3QgdmFsaWQgPSB0eXBlb2YgcnVsZSA9PT0gJ2Z1bmN0aW9uJyA/IHJ1bGUodmFsdWUpIDogcnVsZVxuXG4gICAgICAgIGlmICh2YWxpZCA9PT0gZmFsc2UgfHwgdHlwZW9mIHZhbGlkID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGVycm9yQnVja2V0LnB1c2godmFsaWQgfHwgJycpXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbGlkICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICBjb25zb2xlRXJyb3IoYFJ1bGVzIHNob3VsZCByZXR1cm4gYSBzdHJpbmcgb3IgYm9vbGVhbiwgcmVjZWl2ZWQgJyR7dHlwZW9mIHZhbGlkfScgaW5zdGVhZGAsIHRoaXMpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5lcnJvckJ1Y2tldCA9IGVycm9yQnVja2V0XG4gICAgICB0aGlzLnZhbGlkID0gZXJyb3JCdWNrZXQubGVuZ3RoID09PSAwXG5cbiAgICAgIHJldHVybiB0aGlzLnZhbGlkXG4gICAgfSxcbiAgfSxcbn0pXG4iXX0=