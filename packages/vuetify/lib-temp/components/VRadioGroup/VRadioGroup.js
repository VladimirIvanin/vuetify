// Styles
import '../../styles/components/_selection-controls.sass';
import './VRadioGroup.sass';
// Extensions
import VInput from '../VInput';
import { BaseItemGroup } from '../VItemGroup/VItemGroup';
// Utilities
import { mergeProps, h } from 'vue';
import mixins from '../../util/mixins';
const baseMixins = mixins(VInput, BaseItemGroup);
/* @vue/component */
export default baseMixins.extend({
    name: 'v-radio-group',
    provide() {
        return {
            radioGroup: this,
        };
    },
    props: {
        column: {
            type: Boolean,
            default: true,
        },
        height: {
            type: [Number, String],
            default: 'auto',
        },
        name: String,
        row: Boolean,
        // If no value set on VRadio
        // will match valueComparator
        // force default to null
        modelValue: null,
    },
    computed: {
        classes() {
            return {
                ...VInput.computed.classes.call(this),
                'v-input--selection-controls v-input--radio-group': true,
                'v-input--radio-group--column': this.column && !this.row,
                'v-input--radio-group--row': this.row,
            };
        },
    },
    methods: {
        genDefaultSlot() {
            return h('div', {
                class: 'v-input--radio-group__input',
                id: this.id,
                role: 'radiogroup',
                'aria-labelledby': this.computedId,
            }, VInput.methods.genDefaultSlot.call(this));
        },
        genInputSlot() {
            const render = VInput.methods.genInputSlot.call(this);
            delete render.props.onClick;
            return render;
        },
        genLabel() {
            const label = VInput.methods.genLabel.call(this);
            if (!label)
                return null;
            label.data.attrs.id = this.computedId;
            // WAI considers this an orphaned label
            delete label.data.attrs.for;
            label.tag = 'legend';
            return label;
        },
        onClick: BaseItemGroup.methods.onClick,
    },
    render() {
        const vnode = VInput.render.call(this);
        vnode.props = mergeProps(vnode.props, this.attrs$);
        return vnode;
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlJhZGlvR3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WUmFkaW9Hcm91cC9WUmFkaW9Hcm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxrREFBa0QsQ0FBQTtBQUN6RCxPQUFPLG9CQUFvQixDQUFBO0FBRTNCLGFBQWE7QUFDYixPQUFPLE1BQU0sTUFBTSxXQUFXLENBQUE7QUFDOUIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFBO0FBRXhELFlBQVk7QUFDWixPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxNQUFNLEtBQUssQ0FBQTtBQUNuQyxPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUt0QyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQ3ZCLE1BQU0sRUFDTixhQUFhLENBQ2QsQ0FBQTtBQUVELG9CQUFvQjtBQUNwQixlQUFlLFVBQVUsQ0FBQyxNQUFNLENBQUM7SUFDL0IsSUFBSSxFQUFFLGVBQWU7SUFFckIsT0FBTztRQUNMLE9BQU87WUFDTCxVQUFVLEVBQUUsSUFBSTtTQUNqQixDQUFBO0lBQ0gsQ0FBQztJQUVELEtBQUssRUFBRTtRQUNMLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLElBQUk7U0FDZDtRQUNELE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLE1BQU07U0FDaEI7UUFDRCxJQUFJLEVBQUUsTUFBTTtRQUNaLEdBQUcsRUFBRSxPQUFPO1FBQ1osNEJBQTRCO1FBQzVCLDZCQUE2QjtRQUM3Qix3QkFBd0I7UUFDeEIsVUFBVSxFQUFFLElBQWdDO0tBQzdDO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNyQyxrREFBa0QsRUFBRSxJQUFJO2dCQUN4RCw4QkFBOEIsRUFBRSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUc7Z0JBQ3hELDJCQUEyQixFQUFFLElBQUksQ0FBQyxHQUFHO2FBQ3RDLENBQUE7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxjQUFjO1lBQ1osT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO2dCQUNkLEtBQUssRUFBRSw2QkFBNkI7Z0JBQ3BDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTtnQkFDWCxJQUFJLEVBQUUsWUFBWTtnQkFDbEIsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLFVBQVU7YUFDbkMsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUM5QyxDQUFDO1FBQ0QsWUFBWTtZQUNWLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUVyRCxPQUFPLE1BQU0sQ0FBQyxLQUFNLENBQUMsT0FBTyxDQUFBO1lBRTVCLE9BQU8sTUFBTSxDQUFBO1FBQ2YsQ0FBQztRQUNELFFBQVE7WUFDTixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7WUFFaEQsSUFBSSxDQUFDLEtBQUs7Z0JBQUUsT0FBTyxJQUFJLENBQUE7WUFFdkIsS0FBSyxDQUFDLElBQUssQ0FBQyxLQUFNLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUE7WUFDdkMsdUNBQXVDO1lBQ3ZDLE9BQU8sS0FBSyxDQUFDLElBQUssQ0FBQyxLQUFNLENBQUMsR0FBRyxDQUFBO1lBQzdCLEtBQUssQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFBO1lBRXBCLE9BQU8sS0FBSyxDQUFBO1FBQ2QsQ0FBQztRQUNELE9BQU8sRUFBRSxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU87S0FDdkM7SUFFRCxNQUFNO1FBQ0osTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFdEMsS0FBSyxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFbkQsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXG5pbXBvcnQgJy4uLy4uL3N0eWxlcy9jb21wb25lbnRzL19zZWxlY3Rpb24tY29udHJvbHMuc2FzcydcbmltcG9ydCAnLi9WUmFkaW9Hcm91cC5zYXNzJ1xuXG4vLyBFeHRlbnNpb25zXG5pbXBvcnQgVklucHV0IGZyb20gJy4uL1ZJbnB1dCdcbmltcG9ydCB7IEJhc2VJdGVtR3JvdXAgfSBmcm9tICcuLi9WSXRlbUdyb3VwL1ZJdGVtR3JvdXAnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IHsgbWVyZ2VQcm9wcywgaCB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgdHlwZSB7IFByb3BUeXBlIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBiYXNlTWl4aW5zID0gbWl4aW5zKFxuICBWSW5wdXQsXG4gIEJhc2VJdGVtR3JvdXAsXG4pXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBiYXNlTWl4aW5zLmV4dGVuZCh7XG4gIG5hbWU6ICd2LXJhZGlvLWdyb3VwJyxcblxuICBwcm92aWRlICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmFkaW9Hcm91cDogdGhpcyxcbiAgICB9XG4gIH0sXG5cbiAgcHJvcHM6IHtcbiAgICBjb2x1bW46IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgIH0sXG4gICAgaGVpZ2h0OiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogJ2F1dG8nLFxuICAgIH0sXG4gICAgbmFtZTogU3RyaW5nLFxuICAgIHJvdzogQm9vbGVhbixcbiAgICAvLyBJZiBubyB2YWx1ZSBzZXQgb24gVlJhZGlvXG4gICAgLy8gd2lsbCBtYXRjaCB2YWx1ZUNvbXBhcmF0b3JcbiAgICAvLyBmb3JjZSBkZWZhdWx0IHRvIG51bGxcbiAgICBtb2RlbFZhbHVlOiBudWxsIGFzIHVua25vd24gYXMgUHJvcFR5cGU8YW55PixcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5WSW5wdXQuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi1pbnB1dC0tc2VsZWN0aW9uLWNvbnRyb2xzIHYtaW5wdXQtLXJhZGlvLWdyb3VwJzogdHJ1ZSxcbiAgICAgICAgJ3YtaW5wdXQtLXJhZGlvLWdyb3VwLS1jb2x1bW4nOiB0aGlzLmNvbHVtbiAmJiAhdGhpcy5yb3csXG4gICAgICAgICd2LWlucHV0LS1yYWRpby1ncm91cC0tcm93JzogdGhpcy5yb3csXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2VuRGVmYXVsdFNsb3QgKCkge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6ICd2LWlucHV0LS1yYWRpby1ncm91cF9faW5wdXQnLFxuICAgICAgICBpZDogdGhpcy5pZCxcbiAgICAgICAgcm9sZTogJ3JhZGlvZ3JvdXAnLFxuICAgICAgICAnYXJpYS1sYWJlbGxlZGJ5JzogdGhpcy5jb21wdXRlZElkLFxuICAgICAgfSwgVklucHV0Lm1ldGhvZHMuZ2VuRGVmYXVsdFNsb3QuY2FsbCh0aGlzKSlcbiAgICB9LFxuICAgIGdlbklucHV0U2xvdCAoKSB7XG4gICAgICBjb25zdCByZW5kZXIgPSBWSW5wdXQubWV0aG9kcy5nZW5JbnB1dFNsb3QuY2FsbCh0aGlzKVxuXG4gICAgICBkZWxldGUgcmVuZGVyLnByb3BzIS5vbkNsaWNrXG5cbiAgICAgIHJldHVybiByZW5kZXJcbiAgICB9LFxuICAgIGdlbkxhYmVsICgpIHtcbiAgICAgIGNvbnN0IGxhYmVsID0gVklucHV0Lm1ldGhvZHMuZ2VuTGFiZWwuY2FsbCh0aGlzKVxuXG4gICAgICBpZiAoIWxhYmVsKSByZXR1cm4gbnVsbFxuXG4gICAgICBsYWJlbC5kYXRhIS5hdHRycyEuaWQgPSB0aGlzLmNvbXB1dGVkSWRcbiAgICAgIC8vIFdBSSBjb25zaWRlcnMgdGhpcyBhbiBvcnBoYW5lZCBsYWJlbFxuICAgICAgZGVsZXRlIGxhYmVsLmRhdGEhLmF0dHJzIS5mb3JcbiAgICAgIGxhYmVsLnRhZyA9ICdsZWdlbmQnXG5cbiAgICAgIHJldHVybiBsYWJlbFxuICAgIH0sXG4gICAgb25DbGljazogQmFzZUl0ZW1Hcm91cC5tZXRob2RzLm9uQ2xpY2ssXG4gIH0sXG5cbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCB2bm9kZSA9IFZJbnB1dC5yZW5kZXIuY2FsbCh0aGlzKVxuXG4gICAgdm5vZGUucHJvcHMgPSBtZXJnZVByb3BzKHZub2RlLnByb3BzLCB0aGlzLmF0dHJzJCk7XG5cbiAgICByZXR1cm4gdm5vZGVcbiAgfSxcbn0pXG4iXX0=