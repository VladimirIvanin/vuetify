import { h, Transition } from 'vue';
import './VDatePickerTitle.sass';
// Components
import VIcon from '../VIcon';
// Mixins
import PickerButton from '../../mixins/picker-button';
// Utils
import mixins from '../../util/mixins';
export default mixins(PickerButton
/* @vue/component */
).extend({
    name: 'v-date-picker-title',
    props: {
        date: {
            type: String,
            default: '',
        },
        disabled: Boolean,
        readonly: Boolean,
        selectingYear: Boolean,
        modelValue: {
            type: String,
        },
        year: {
            type: [Number, String],
            default: '',
        },
        yearIcon: {
            type: String,
        },
    },
    emits: ['update:selecting-year'],
    data: () => ({
        isReversing: false,
    }),
    computed: {
        computedTransition() {
            return this.isReversing ? 'picker-reverse-transition' : 'picker-transition';
        },
    },
    watch: {
        modelValue(val, prev) {
            this.isReversing = val < prev;
        },
    },
    methods: {
        genYearIcon() {
            return h(VIcon, {
                dark: true,
            }, () => this.yearIcon);
        },
        getYearBtn() {
            return this.genPickerButton('selectingYear', true, [
                String(this.year),
                this.yearIcon ? this.genYearIcon() : null,
            ], false, 'v-date-picker-title__year');
        },
        genTitleText() {
            return h(Transition, {
                name: this.computedTransition,
            }, () => [
                h('div', {
                    innerHTML: this.date || '&nbsp;',
                    key: this.modelValue,
                }),
            ]);
        },
        genTitleDate() {
            return this.genPickerButton('selectingYear', false, [this.genTitleText()], false, 'v-date-picker-title__date');
        },
    },
    render() {
        return h('div', {
            class: ['v-date-picker-title', {
                    'v-date-picker-title--disabled': this.disabled,
                }],
        }, [
            this.getYearBtn(),
            this.genTitleDate(),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRhdGVQaWNrZXJUaXRsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZEYXRlUGlja2VyL1ZEYXRlUGlja2VyVGl0bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxLQUFLLENBQUE7QUFDbkMsT0FBTyx5QkFBeUIsQ0FBQTtBQUVoQyxhQUFhO0FBQ2IsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFBO0FBRTVCLFNBQVM7QUFDVCxPQUFPLFlBQVksTUFBTSw0QkFBNEIsQ0FBQTtBQUVyRCxRQUFRO0FBQ1IsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFLdEMsZUFBZSxNQUFNLENBQ25CLFlBQVk7QUFDZCxvQkFBb0I7Q0FDbkIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUscUJBQXFCO0lBRTNCLEtBQUssRUFBRTtRQUNMLElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLEVBQUU7U0FDWjtRQUNELFFBQVEsRUFBRSxPQUFPO1FBQ2pCLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLGFBQWEsRUFBRSxPQUFPO1FBQ3RCLFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxNQUFNO1NBQ2I7UUFDRCxJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxFQUFFO1NBQ1o7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsTUFBTTtTQUNiO0tBQ0Y7SUFFRCxLQUFLLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztJQUVoQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNYLFdBQVcsRUFBRSxLQUFLO0tBQ25CLENBQUM7SUFFRixRQUFRLEVBQUU7UUFDUixrQkFBa0I7WUFDaEIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUE7UUFDN0UsQ0FBQztLQUNGO0lBRUQsS0FBSyxFQUFFO1FBQ0wsVUFBVSxDQUFFLEdBQVcsRUFBRSxJQUFZO1lBQ25DLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQTtRQUMvQixDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxXQUFXO1lBQ1QsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO2dCQUNkLElBQUksRUFBRSxJQUFJO2FBQ1gsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDekIsQ0FBQztRQUNELFVBQVU7WUFDUixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLElBQUksRUFBRTtnQkFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSTthQUMxQyxFQUFFLEtBQUssRUFBRSwyQkFBMkIsQ0FBQyxDQUFBO1FBQ3hDLENBQUM7UUFDRCxZQUFZO1lBQ1YsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFO2dCQUNuQixJQUFJLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjthQUM5QixFQUFFLEdBQUcsRUFBRSxDQUFDO2dCQUNQLENBQUMsQ0FBQyxLQUFLLEVBQUU7b0JBQ1AsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksUUFBUTtvQkFDaEMsR0FBRyxFQUFFLElBQUksQ0FBQyxVQUFVO2lCQUNyQixDQUFDO2FBQ0gsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELFlBQVk7WUFDVixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSwyQkFBMkIsQ0FBQyxDQUFBO1FBQ2hILENBQUM7S0FDRjtJQUVELE1BQU07UUFDSixPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDZCxLQUFLLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRTtvQkFDN0IsK0JBQStCLEVBQUUsSUFBSSxDQUFDLFFBQVE7aUJBQy9DLENBQUM7U0FDSCxFQUFFO1lBQ0QsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNqQixJQUFJLENBQUMsWUFBWSxFQUFFO1NBQ3BCLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoLCBUcmFuc2l0aW9uIH0gZnJvbSAndnVlJ1xuaW1wb3J0ICcuL1ZEYXRlUGlja2VyVGl0bGUuc2FzcydcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IFZJY29uIGZyb20gJy4uL1ZJY29uJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBQaWNrZXJCdXR0b24gZnJvbSAnLi4vLi4vbWl4aW5zL3BpY2tlci1idXR0b24nXG5cbi8vIFV0aWxzXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXG5cbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcbiAgUGlja2VyQnV0dG9uXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuKS5leHRlbmQoe1xuICBuYW1lOiAndi1kYXRlLXBpY2tlci10aXRsZScsXG5cbiAgcHJvcHM6IHtcbiAgICBkYXRlOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJyxcbiAgICB9LFxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxuICAgIHJlYWRvbmx5OiBCb29sZWFuLFxuICAgIHNlbGVjdGluZ1llYXI6IEJvb2xlYW4sXG4gICAgbW9kZWxWYWx1ZToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgIH0sXG4gICAgeWVhcjoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6ICcnLFxuICAgIH0sXG4gICAgeWVhckljb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICB9LFxuICB9LFxuXG4gIGVtaXRzOiBbJ3VwZGF0ZTpzZWxlY3RpbmcteWVhciddLFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgaXNSZXZlcnNpbmc6IGZhbHNlLFxuICB9KSxcblxuICBjb21wdXRlZDoge1xuICAgIGNvbXB1dGVkVHJhbnNpdGlvbiAoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiB0aGlzLmlzUmV2ZXJzaW5nID8gJ3BpY2tlci1yZXZlcnNlLXRyYW5zaXRpb24nIDogJ3BpY2tlci10cmFuc2l0aW9uJ1xuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBtb2RlbFZhbHVlICh2YWw6IHN0cmluZywgcHJldjogc3RyaW5nKSB7XG4gICAgICB0aGlzLmlzUmV2ZXJzaW5nID0gdmFsIDwgcHJldlxuICAgIH0sXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGdlblllYXJJY29uICgpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gaChWSWNvbiwge1xuICAgICAgICBkYXJrOiB0cnVlLFxuICAgICAgfSwgKCkgPT4gdGhpcy55ZWFySWNvbilcbiAgICB9LFxuICAgIGdldFllYXJCdG4gKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiB0aGlzLmdlblBpY2tlckJ1dHRvbignc2VsZWN0aW5nWWVhcicsIHRydWUsIFtcbiAgICAgICAgU3RyaW5nKHRoaXMueWVhciksXG4gICAgICAgIHRoaXMueWVhckljb24gPyB0aGlzLmdlblllYXJJY29uKCkgOiBudWxsLFxuICAgICAgXSwgZmFsc2UsICd2LWRhdGUtcGlja2VyLXRpdGxlX195ZWFyJylcbiAgICB9LFxuICAgIGdlblRpdGxlVGV4dCAoKTogVk5vZGUge1xuICAgICAgcmV0dXJuIGgoVHJhbnNpdGlvbiwge1xuICAgICAgICBuYW1lOiB0aGlzLmNvbXB1dGVkVHJhbnNpdGlvbixcbiAgICAgIH0sICgpID0+IFtcbiAgICAgICAgaCgnZGl2Jywge1xuICAgICAgICAgIGlubmVySFRNTDogdGhpcy5kYXRlIHx8ICcmbmJzcDsnLFxuICAgICAgICAgIGtleTogdGhpcy5tb2RlbFZhbHVlLFxuICAgICAgICB9KSxcbiAgICAgIF0pXG4gICAgfSxcbiAgICBnZW5UaXRsZURhdGUgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiB0aGlzLmdlblBpY2tlckJ1dHRvbignc2VsZWN0aW5nWWVhcicsIGZhbHNlLCBbdGhpcy5nZW5UaXRsZVRleHQoKV0sIGZhbHNlLCAndi1kYXRlLXBpY2tlci10aXRsZV9fZGF0ZScpXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKCk6IFZOb2RlIHtcbiAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgY2xhc3M6IFsndi1kYXRlLXBpY2tlci10aXRsZScsIHtcbiAgICAgICAgJ3YtZGF0ZS1waWNrZXItdGl0bGUtLWRpc2FibGVkJzogdGhpcy5kaXNhYmxlZCxcbiAgICAgIH1dLFxuICAgIH0sIFtcbiAgICAgIHRoaXMuZ2V0WWVhckJ0bigpLFxuICAgICAgdGhpcy5nZW5UaXRsZURhdGUoKSxcbiAgICBdKVxuICB9LFxufSlcbiJdfQ==