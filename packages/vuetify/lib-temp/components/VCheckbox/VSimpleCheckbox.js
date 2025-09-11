import './VSimpleCheckbox.sass';
import Ripple from '../../directives/ripple';
import { h, defineComponent, withDirectives } from 'vue';
import { VIcon } from '../VIcon';
// Mixins
import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable';
// Utilities
import mergeData from '../../util/mergeData';
import { breaking } from '../../util/console';
export default defineComponent({
    name: 'v-simple-checkbox',
    props: {
        ...Colorable.props,
        ...Themeable.props,
        disabled: Boolean,
        ripple: {
            type: Boolean,
            default: true,
        },
        modelValue: Boolean,
        indeterminate: Boolean,
        indeterminateIcon: {
            type: String,
            default: '$checkboxIndeterminate',
        },
        onIcon: {
            type: String,
            default: '$checkboxOn',
        },
        offIcon: {
            type: String,
            default: '$checkboxOff',
        },
    },
    emits: ['input', 'update:modelValue'],
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
    methods: {
        getIcon() {
            const { indeterminate, modelValue, indeterminateIcon, onIcon, offIcon } = this.$props;
            if (indeterminate)
                return indeterminateIcon;
            if (modelValue)
                return onIcon;
            return offIcon;
        },
        createIcon() {
            const { modelValue, disabled, dark, light, color } = this.$props;
            return h(VIcon, Colorable.methods.setTextColor(modelValue && color, {
                disabled,
                dark,
                light,
            }), () => this.getIcon());
        },
        createRipple() {
            const { ripple, disabled, color } = this.$props;
            if (!ripple || disabled)
                return null;
            return withDirectives(h('div', Colorable.methods.setTextColor(color, {
                class: 'v-input--selection-controls__ripple',
            })), [
                [Ripple, { center: true }],
            ]);
        },
        handleClick(e) {
            e.stopPropagation();
            if (this.$props.disabled)
                return;
            const newValue = !this.modelValue;
            const attrs = this.$attrs;
            this.$emit("input", newValue);
            this.$emit('update:modelValue', newValue);
        },
        createChildren() {
            const children = [this.createIcon()];
            const ripple = this.createRipple();
            if (ripple) {
                children.push(ripple);
            }
            return children;
        },
    },
    render() {
        const { disabled } = this.$props;
        const data = this.$attrs;
        return h('div', mergeData(data, {
            class: {
                'v-simple-checkbox': true,
                'v-simple-checkbox--disabled': disabled,
            },
            onClick: this.handleClick,
        }), [
            h('div', { class: 'v-input--selection-controls__input' }, this.createChildren())
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNpbXBsZUNoZWNrYm94LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkNoZWNrYm94L1ZTaW1wbGVDaGVja2JveC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHdCQUF3QixDQUFBO0FBRS9CLE9BQU8sTUFBTSxNQUFNLHlCQUF5QixDQUFBO0FBRTVDLE9BQU8sRUFBUyxDQUFDLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxNQUFNLEtBQUssQ0FBQTtBQUUvRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFBO0FBRWhDLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxZQUFZO0FBQ1osT0FBTyxTQUFTLE1BQU0sc0JBQXNCLENBQUE7QUFFNUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRTdDLGVBQWUsZUFBZSxDQUFDO0lBQzdCLElBQUksRUFBRSxtQkFBbUI7SUFHekIsS0FBSyxFQUFFO1FBQ0wsR0FBRyxTQUFTLENBQUMsS0FBSztRQUNsQixHQUFHLFNBQVMsQ0FBQyxLQUFLO1FBQ2xCLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLElBQUk7U0FDZDtRQUNELFVBQVUsRUFBRSxPQUFPO1FBQ25CLGFBQWEsRUFBRSxPQUFPO1FBQ3RCLGlCQUFpQixFQUFFO1lBQ2pCLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLHdCQUF3QjtTQUNsQztRQUNELE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLGFBQWE7U0FDdkI7UUFDRCxPQUFPLEVBQUU7WUFDUCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxjQUFjO1NBQ3hCO0tBQ0Y7SUFFRCxL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LENBQUMsTUFBTSxDQUFBO1FBRXhCLE9BQU8sQ0FBQyxDQUNOLEtBQUssRUFDTCxTQUFTLENBQUMsSUFBSSxFQUFFO1lBQ2QsS0FBSyxFQUFFO2dCQUNMLG1CQUFtQixFQUFFLElBQUk7Z0JBQ3pCLDZCQUE2QixFQUFFLFFBQVE7YUFDeEM7WUFDRCxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVc7U0FDMUIsQ0FBQyxFQUNGO1lBQ0UsQ0FBQyxDQUNDLEtBQUssRUFDTCxFQUFFLEtBQUssRUFBRSxvQ0FBb0MsRUFBRSxFQUMvQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQ3RCO1NBQ0YsQ0FDRixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi9WU2ltcGxlQ2hlY2tib3guc2FzcydcblxuaW1wb3J0IFJpcHBsZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3JpcHBsZSdcblxuaW1wb3J0IHsgVk5vZGUsIGgsIGRlZmluZUNvbXBvbmVudCwgd2l0aERpcmVjdGl2ZXMgfSBmcm9tICd2dWUnXG5cbmltcG9ydCB7IFZJY29uIH0gZnJvbSAnLi4vVkljb24nXG5cbi8vIE1peGluc1xuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCBtZXJnZURhdGEgZnJvbSAnLi4vLi4vdXRpbC9tZXJnZURhdGEnXG5pbXBvcnQgeyB3cmFwSW5BcnJheSB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcbmltcG9ydCB7IGJyZWFraW5nIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb21wb25lbnQoe1xuICBuYW1lOiAndi1zaW1wbGUtY2hlY2tib3gnLFxuXG5cbiAgcHJvcHM6IHtcbiAgICAuLi5Db2xvcmFibGUucHJvcHMsXG4gICAgLi4uVGhlbWVhYmxlLnByb3BzLFxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxuICAgIHJpcHBsZToge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgICBtb2RlbFZhbHVlOiBCb29sZWFuLFxuICAgIGluZGV0ZXJtaW5hdGU6IEJvb2xlYW4sXG4gICAgaW5kZXRlcm1pbmF0ZUljb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckY2hlY2tib3hJbmRldGVybWluYXRlJyxcbiAgICB9LFxuICAgIG9uSWNvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyRjaGVja2JveE9uJyxcbiAgICB9LFxuICAgIG9mZkljb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckY2hlY2tib3hPZmYnLFxuICAgIH0sXG4gIH0sXG5cbiAgZW1pdHM6IFsnaW5wdXQnLCAndXBkYXRlOm1vZGVsVmFsdWUnXSxcblxuICBjcmVhdGVkICgpIHtcbiAgICBjb25zdCBicmVha2luZ1Byb3BzID0gW1xuICAgICAgWyd2YWx1ZScsICdtb2RlbFZhbHVlJ10sXG4gICAgICBbJ29uSW5wdXQnLCAnb25VcGRhdGU6bW9kZWxWYWx1ZSddLFxuICAgIF1cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgYnJlYWtpbmdQcm9wcy5mb3JFYWNoKChbb3JpZ2luYWwsIHJlcGxhY2VtZW50XSkgPT4ge1xuICAgICAgaWYgKHRoaXMuJGF0dHJzLmhhc093blByb3BlcnR5KG9yaWdpbmFsKSkgYnJlYWtpbmcob3JpZ2luYWwsIHJlcGxhY2VtZW50LCB0aGlzKVxuICAgIH0pXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGdldEljb24gKCk6IHN0cmluZyB7XG4gICAgICBjb25zdCB7IGluZGV0ZXJtaW5hdGUsIG1vZGVsVmFsdWUsIGluZGV0ZXJtaW5hdGVJY29uLCBvbkljb24sIG9mZkljb24gfSA9IHRoaXMuJHByb3BzXG5cbiAgICAgIGlmIChpbmRldGVybWluYXRlKSByZXR1cm4gaW5kZXRlcm1pbmF0ZUljb25cbiAgICAgIGlmIChtb2RlbFZhbHVlKSByZXR1cm4gb25JY29uXG4gICAgICByZXR1cm4gb2ZmSWNvblxuICAgIH0sXG5cbiAgICBjcmVhdGVJY29uICgpOiBWTm9kZSB7XG4gICAgICBjb25zdCB7IG1vZGVsVmFsdWUsIGRpc2FibGVkLCBkYXJrLCBsaWdodCwgY29sb3IgfSA9IHRoaXMuJHByb3BzXG5cbiAgICAgIHJldHVybiBoKFxuICAgICAgICBWSWNvbixcbiAgICAgICAgQ29sb3JhYmxlLm1ldGhvZHMuc2V0VGV4dENvbG9yKG1vZGVsVmFsdWUgJiYgY29sb3IsIHtcbiAgICAgICAgICBkaXNhYmxlZCxcbiAgICAgICAgICBkYXJrLFxuICAgICAgICAgIGxpZ2h0LFxuICAgICAgICB9KSxcbiAgICAgICAgKCkgPT4gdGhpcy5nZXRJY29uKClcbiAgICAgIClcbiAgICB9LFxuXG4gICAgY3JlYXRlUmlwcGxlICgpOiBWTm9kZSB8IG51bGwge1xuICAgICAgY29uc3QgeyByaXBwbGUsIGRpc2FibGVkLCBjb2xvciB9ID0gdGhpcy4kcHJvcHNcblxuICAgICAgaWYgKCFyaXBwbGUgfHwgZGlzYWJsZWQpIHJldHVybiBudWxsXG5cbiAgICAgIHJldHVybiB3aXRoRGlyZWN0aXZlcyhcbiAgICAgICAgaChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICBDb2xvcmFibGUubWV0aG9kcy5zZXRUZXh0Q29sb3IoY29sb3IsIHtcbiAgICAgICAgICAgIGNsYXNzOiAndi1pbnB1dC0tc2VsZWN0aW9uLWNvbnRyb2xzX19yaXBwbGUnLFxuICAgICAgICAgIH0pXG4gICAgICAgICksXG4gICAgICAgIFtcbiAgICAgICAgICBbUmlwcGxlLCB7IGNlbnRlcjogdHJ1ZSB9XSxcbiAgICAgICAgXVxuICAgICAgKVxuICAgIH0sXG5cbiAgICBoYW5kbGVDbGljayAoZTogTW91c2VFdmVudCk6IHZvaWQge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgICBpZiAodGhpcy4kcHJvcHMuZGlzYWJsZWQpIHJldHVyblxuXG4gICAgICBjb25zdCBuZXdWYWx1ZSA9ICF0aGlzLm1vZGVsVmFsdWVcbiAgICAgIGNvbnN0IGF0dHJzID0gdGhpcy4kYXR0cnNcblxuXG4gICAgICB0aGlzLiRlbWl0KFwiaW5wdXRcIiwgbmV3VmFsdWUpO1xuICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOm1vZGVsVmFsdWUnLCBuZXdWYWx1ZSlcbiAgICB9LFxuXG4gICAgY3JlYXRlQ2hpbGRyZW4gKCk6IFZOb2RlW10ge1xuICAgICAgY29uc3QgY2hpbGRyZW4gPSBbdGhpcy5jcmVhdGVJY29uKCldXG5cbiAgICAgIGNvbnN0IHJpcHBsZSA9IHRoaXMuY3JlYXRlUmlwcGxlKClcbiAgICAgIGlmIChyaXBwbGUpIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaChyaXBwbGUpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjaGlsZHJlblxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgY29uc3QgeyBkaXNhYmxlZCB9ID0gdGhpcy4kcHJvcHNcbiAgICBjb25zdCBkYXRhID0gdGhpcy4kYXR0cnNcblxuICAgIHJldHVybiBoKFxuICAgICAgJ2RpdicsXG4gICAgICBtZXJnZURhdGEoZGF0YSwge1xuICAgICAgICBjbGFzczoge1xuICAgICAgICAgICd2LXNpbXBsZS1jaGVja2JveCc6IHRydWUsXG4gICAgICAgICAgJ3Ytc2ltcGxlLWNoZWNrYm94LS1kaXNhYmxlZCc6IGRpc2FibGVkLFxuICAgICAgICB9LFxuICAgICAgICBvbkNsaWNrOiB0aGlzLmhhbmRsZUNsaWNrLFxuICAgICAgfSksXG4gICAgICBbXG4gICAgICAgIGgoXG4gICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgeyBjbGFzczogJ3YtaW5wdXQtLXNlbGVjdGlvbi1jb250cm9sc19faW5wdXQnIH0sXG4gICAgICAgICAgdGhpcy5jcmVhdGVDaGlsZHJlbigpXG4gICAgICAgIClcbiAgICAgIF1cbiAgICApXG4gIH0sXG59KSJdfQ==