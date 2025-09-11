// Styles
import './VCheckbox.sass';
import '../../styles/components/_selection-controls.sass';
// Components
import VIcon from '../VIcon';
import VInput from '../VInput';
// Mixins
import Selectable from '../../mixins/selectable';
// Utilities
import { breaking } from '../../util/console';
import { defineComponent, h } from 'vue';
/* @vue/component */
export default defineComponent({
    name: 'v-checkbox',
    extends: Selectable,
    props: {
        indeterminate: Boolean,
        indeterminateIcon: {
            type: String,
            default: '$checkboxIndeterminate',
        },
        offIcon: {
            type: String,
            default: '$checkboxOff',
        },
        onIcon: {
            type: String,
            default: '$checkboxOn',
        },
    },
    emits: ['click', 'focus', 'blur', 'update:indeterminate'],
    data() {
        return {
            inputIndeterminate: this.indeterminate,
        };
    },
    computed: {
        classes() {
            return {
                ...VInput.computed.classes.call(this),
                'v-input--selection-controls': true,
                'v-input--checkbox': true,
                'v-input--indeterminate': this.inputIndeterminate,
            };
        },
        computedIcon() {
            if (this.inputIndeterminate) {
                return this.indeterminateIcon;
            }
            else if (this.isActive) {
                return this.onIcon;
            }
            else {
                return this.offIcon;
            }
        },
        // Do not return undefined if disabled,
        // according to spec, should still show
        // a color when disabled and active
        validationState() {
            if (this.isDisabled && !this.inputIndeterminate)
                return undefined;
            if (this.hasError && this.shouldValidate)
                return 'error';
            if (this.hasSuccess)
                return 'success';
            if (this.hasColor !== null)
                return this.computedColor;
            return undefined;
        },
    },
    watch: {
        indeterminate(val) {
            // https://github.com/vuetifyjs/vuetify/issues/8270
            this.$nextTick(() => (this.inputIndeterminate = val));
        },
        inputIndeterminate(val) {
            this.$emit('update:indeterminate', val);
        },
        isActive() {
            if (!this.indeterminate)
                return;
            this.inputIndeterminate = false;
        },
    },
    created() {
        const breakingProps = [
            ['inputValue', 'model-value'],
            ['input-value', 'model-value'],
        ];
        /* istanbul ignore next */
        breakingProps.forEach(([original, replacement]) => {
            if (this.$attrs.hasOwnProperty(original))
                breaking(original, replacement, this);
        });
    },
    methods: {
        genCheckbox() {
            const { title, ...checkboxAttrs } = this.attrs$;
            return h('div', {
                class: 'v-input--selection-controls__input',
            }, [
                h(VIcon, this.setTextColor(this.validationState, {
                    dense: this.dense,
                    dark: this.dark,
                    light: this.light,
                }), () => this.computedIcon),
                this.genInput('checkbox', {
                    ...checkboxAttrs,
                    'aria-checked': this.inputIndeterminate
                        ? 'mixed'
                        : this.isActive.toString(),
                }),
                this.genRipple(this.setTextColor(this.rippleState)),
            ]);
        },
        genDefaultSlot() {
            return [
                this.genCheckbox(),
                this.genLabel(),
            ];
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNoZWNrYm94LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkNoZWNrYm94L1ZDaGVja2JveC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxrQkFBa0IsQ0FBQTtBQUN6QixPQUFPLGtEQUFrRCxDQUFBO0FBRXpELGFBQWE7QUFDYixPQUFPLEtBQUssTUFBTSxVQUFVLENBQUE7QUFDNUIsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFBO0FBRTlCLFNBQVM7QUFDVCxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUVoRCxZQUFZO0FBQ1osT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRTdDLE9BQU8sRUFBRSxlQUFlLEVBQUUsQ0FBQyxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBRXhDLG9CQUFvQjtBQUNwQixlQUFlLGVBQWUsQ0FBQztJQUM3QixJQUFJLEVBQUUsWUFBWTtJQUNsQixPQUFPLEVBQUUsVUFBVTtJQUVuQixLQUFLLEVBQUU7UUFDTCxhQUFhLEVBQUUsT0FBTztRQUN0QixpQkFBaUIsRUFBRTtZQUNqQixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSx3QkFBd0I7U0FDbEM7UUFDRCxPQUFPLEVBQUU7WUFDUCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxjQUFjO1NBQ3hCO1FBQ0QsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsYUFBYTtTQUN2QjtLQUNGO0lBRUQsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsc0JBQXNCLENBQUM7SUFFekQsSUFBSTtRQUNGLE9BQU87WUFDTCxrQkFBa0IsRUFBRSxJQUFJLENBQUMsYUFBYTtTQUN2QyxDQUFBO0lBQ0gsQ0FBQztJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPO2dCQUNMLEdBQUcsTUFB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QWtCO3dCQUNyQyxDQUFDLENBQUMsT0FBTzt3QkFDVCxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7aUJBQzdCLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUNwRCxDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsY0FBYztZQUNaLE9BQU87Z0JBQ0wsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLFFBQVEsRUFBRTthQUNoQixDQUFBO1FBQ0gsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXG5pbXBvcnQgJy4vVkNoZWNrYm94LnNhc3MnXG5pbXBvcnQgJy4uLy4uL3N0eWxlcy9jb21wb25lbnRzL19zZWxlY3Rpb24tY29udHJvbHMuc2FzcydcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IFZJY29uIGZyb20gJy4uL1ZJY29uJ1xuaW1wb3J0IFZJbnB1dCBmcm9tICcuLi9WSW5wdXQnXG5cbi8vIE1peGluc1xuaW1wb3J0IFNlbGVjdGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3NlbGVjdGFibGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IHsgYnJlYWtpbmcgfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXG5cbmltcG9ydCB7IGRlZmluZUNvbXBvbmVudCwgaCB9IGZyb20gJ3Z1ZSdcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XG4gIG5hbWU6ICd2LWNoZWNrYm94JyxcbiAgZXh0ZW5kczogU2VsZWN0YWJsZSxcblxuICBwcm9wczoge1xuICAgIGluZGV0ZXJtaW5hdGU6IEJvb2xlYW4sXG4gICAgaW5kZXRlcm1pbmF0ZUljb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckY2hlY2tib3hJbmRldGVybWluYXRlJyxcbiAgICB9LFxuICAgIG9mZkljb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckY2hlY2tib3hPZmYnLFxuICAgIH0sXG4gICAgb25JY29uOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJGNoZWNrYm94T24nLFxuICAgIH0sXG4gIH0sXG5cbiAgZW1pdHM6IFsnY2xpY2snLCAnZm9jdXMnLCAnYmx1cicsICd1cGRhdGU6aW5kZXRlcm1pbmF0ZSddLFxuXG4gIGRhdGEgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpbnB1dEluZGV0ZXJtaW5hdGU6IHRoaXMuaW5kZXRlcm1pbmF0ZSxcbiAgICB9XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uVklucHV0LmNvbXB1dGVkLmNsYXNzZXMuY2FsbCh0aGlzKSxcbiAgICAgICAgJ3YtaW5wdXQtLXNlbGVjdGlvbi1jb250cm9scyc6IHRydWUsXG4gICAgICAgICd2LWlucHV0LS1jaGVja2JveCc6IHRydWUsXG4gICAgICAgICd2LWlucHV0LS1pbmRldGVybWluYXRlJzogdGhpcy5pbnB1dEluZGV0ZXJtaW5hdGUsXG4gICAgICB9XG4gICAgfSxcbiAgICBjb21wdXRlZEljb24gKCk6IHN0cmluZyB7XG4gICAgICBpZiAodGhpcy5pbnB1dEluZGV0ZXJtaW5hdGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXRlcm1pbmF0ZUljb25cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0FjdGl2ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vbkljb25cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9mZkljb25cbiAgICAgIH1cbiAgICB9LFxuICAgIC8vIERvIG5vdCByZXR1cm4gdW5kZWZpbmVkIGlmIGRpc2FibGVkLFxuICAgIC8vIGFjY29yZGluZyB0byBzcGVjLCBzaG91bGQgc3RpbGwgc2hvd1xuICAgIC8vIGEgY29sb3Igd2hlbiBkaXNhYmxlZCBhbmQgYWN0aXZlXG4gICAgdmFsaWRhdGlvblN0YXRlICgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgaWYgKHRoaXMuaXNEaXNhYmxlZCAmJiAhdGhpcy5pbnB1dEluZGV0ZXJtaW5hdGUpIHJldHVybiB1bmRlZmluZWRcbiAgICAgIGlmICh0aGlzLmhhc0Vycm9yICYmIHRoaXMuc2hvdWxkVmFsaWRhdGUpIHJldHVybiAnZXJyb3InXG4gICAgICBpZiAodGhpcy5oYXNTdWNjZXNzKSByZXR1cm4gJ3N1Y2Nlc3MnXG4gICAgICBpZiAodGhpcy5oYXNDb2xvciAhPT0gbnVsbCkgcmV0dXJuIHRoaXMuY29tcHV0ZWRDb2xvclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBpbmRldGVybWluYXRlICh2YWwpIHtcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92dWV0aWZ5anMvdnVldGlmeS9pc3N1ZXMvODI3MFxuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4gKHRoaXMuaW5wdXRJbmRldGVybWluYXRlID0gdmFsKSlcbiAgICB9LFxuICAgIGlucHV0SW5kZXRlcm1pbmF0ZSAodmFsKSB7XG4gICAgICB0aGlzLiRlbWl0KCd1cGRhdGU6aW5kZXRlcm1pbmF0ZScsIHZhbClcbiAgICB9LFxuICAgIGlzQWN0aXZlICgpIHtcbiAgICAgIGlmICghdGhpcy5pbmRldGVybWluYXRlKSByZXR1cm5cbiAgICAgIHRoaXMuaW5wdXRJbmRldGVybWluYXRlID0gZmFsc2VcbiAgICB9LFxuICB9LFxuXG4gIGNyZWF0ZWQgKCkge1xuICAgIGNvbnN0IGJyZWFraW5nUHJvcHMgPSBbXG4gICAgICBbJ2lucHV0VmFsdWUnLCAnbW9kZWwtdmFsdWUnXSxcbiAgICAgIFsnaW5wdXQtdmFsdWUnLCAnbW9kZWwtdmFsdWUnXSxcbiAgICBdXG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGJyZWFraW5nUHJvcHMuZm9yRWFjaCgoW29yaWdpbmFsLCByZXBsYWNlbWVudF0pID0+IHtcbiAgICAgIGlmICh0aGlzLiRhdHRycy5oYXNPd25Qcm9wZXJ0eShvcmlnaW5hbCkpIGJyZWFraW5nKG9yaWdpbmFsLCByZXBsYWNlbWVudCwgdGhpcylcbiAgICB9KVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5DaGVja2JveCAoKSB7XG4gICAgICBjb25zdCB7IHRpdGxlLCAuLi5jaGVja2JveEF0dHJzIH0gPSB0aGlzLmF0dHJzJFxuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6ICd2LWlucHV0LS1zZWxlY3Rpb24tY29udHJvbHNfX2lucHV0JyxcbiAgICAgIH0sIFtcbiAgICAgICAgaChWSWNvbiwgdGhpcy5zZXRUZXh0Q29sb3IodGhpcy52YWxpZGF0aW9uU3RhdGUsIHtcbiAgICAgICAgICBkZW5zZTogdGhpcy5kZW5zZSxcbiAgICAgICAgICBkYXJrOiB0aGlzLmRhcmssXG4gICAgICAgICAgbGlnaHQ6IHRoaXMubGlnaHQsXG4gICAgICAgIH0pLCAoKSA9PiB0aGlzLmNvbXB1dGVkSWNvbiksXG4gICAgICAgIHRoaXMuZ2VuSW5wdXQoJ2NoZWNrYm94Jywge1xuICAgICAgICAgIC4uLmNoZWNrYm94QXR0cnMsXG4gICAgICAgICAgJ2FyaWEtY2hlY2tlZCc6IHRoaXMuaW5wdXRJbmRldGVybWluYXRlXG4gICAgICAgICAgICA/ICdtaXhlZCdcbiAgICAgICAgICAgIDogdGhpcy5pc0FjdGl2ZS50b1N0cmluZygpLFxuICAgICAgICB9KSxcbiAgICAgICAgdGhpcy5nZW5SaXBwbGUodGhpcy5zZXRUZXh0Q29sb3IodGhpcy5yaXBwbGVTdGF0ZSkpLFxuICAgICAgXSlcbiAgICB9LFxuICAgIGdlbkRlZmF1bHRTbG90ICgpIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHRoaXMuZ2VuQ2hlY2tib3goKSxcbiAgICAgICAgdGhpcy5nZW5MYWJlbCgpLFxuICAgICAgXVxuICAgIH0sXG4gIH0sXG59KVxuIl19