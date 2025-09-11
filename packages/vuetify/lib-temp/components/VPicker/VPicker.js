import { h, Transition, defineComponent } from 'vue';
import './VPicker.sass';
import '../VCard/VCard.sass';
// Mixins
import Colorable from '../../mixins/colorable';
import Elevatable from '../../mixins/elevatable';
import Themeable from '../../mixins/themeable';
// Helpers
import { convertToUnit, getSlot } from '../../util/helpers';
/* @vue/component */
export default defineComponent({
    name: 'v-picker',
    mixins: [
        Colorable,
        Elevatable,
        Themeable,
    ],
    props: {
        flat: Boolean,
        fullWidth: Boolean,
        landscape: Boolean,
        noTitle: Boolean,
        transition: {
            type: String,
            default: 'fade-transition',
        },
        width: {
            type: [Number, String],
            default: 290,
        },
    },
    computed: {
        computedTitleColor() {
            const defaultTitleColor = this.isDark ? false : (this.color || 'primary');
            return this.color || defaultTitleColor;
        },
    },
    methods: {
        genTitle() {
            return h('div', this.setBackgroundColor(this.computedTitleColor, {
                class: ['v-picker__title', {
                        'v-picker__title--landscape': this.landscape,
                    }],
            }), getSlot(this, 'title'));
        },
        genBodyTransition() {
            return h(Transition, {
                name: this.transition,
            }, () => getSlot(this));
        },
        genBody() {
            return h('div', {
                class: ['v-picker__body', {
                        'v-picker__body--no-title': this.noTitle,
                        ...this.themeClasses,
                    }],
                style: this.fullWidth ? undefined : {
                    width: convertToUnit(this.width),
                },
            }, [
                this.genBodyTransition(),
            ]);
        },
        genActions() {
            return h('div', {
                class: ['v-picker__actions v-card__actions', {
                        'v-picker__actions--no-title': this.noTitle,
                    }],
            }, getSlot(this, 'actions'));
        },
    },
    render() {
        return h('div', {
            class: ['v-picker v-card', {
                    'v-picker--flat': this.flat,
                    'v-picker--landscape': this.landscape,
                    'v-picker--full-width': this.fullWidth,
                    ...this.themeClasses,
                    ...this.elevationClasses,
                }],
        }, [
            this.$slots.title ? this.genTitle() : null,
            this.genBody(),
            this.$slots.actions ? this.genActions() : null,
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlBpY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZQaWNrZXIvVlBpY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsTUFBTSxLQUFLLENBQUE7QUFFcEQsT0FBTyxnQkFBZ0IsQ0FBQTtBQUN2QixPQUFPLHFCQUFxQixDQUFBO0FBRTVCLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxVQUFVO0FBQ1YsT0FBTyxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUUzRCxvQkFBb0I7QUFDcEIsZUFBZSxlQUFlLENBQUM7SUFDN0IsSUFBSSxFQUFFLFVBQVU7SUFDaEIsTUFBTSxFQUFFO1FBQ04sU0FBUztRQUNULFVBQVU7UUFDVixTQUFTO0tBQ1Y7SUFFRCxLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUUsT0FBTztRQUNiLFNBQVMsRUFBRSxPQUFPO1FBQ2xCLFNBQVMsRUFBRSxPQUFPO1FBQ2xCLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLGlCQUFpQjtTQUMzQjtRQUNELEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLEdBQUc7U0FDYjtLQUNGO0lBRUQsUUFBUSxFQUFFO1FBQ1Isa0JBQWtCO1lBQ2hCLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksU0FBUyxDQUFDLENBQUE7WUFDekUsT0FBTyxJQUFJLENBQUMsS0FBSyxJQUFJLGlCQUFpQixDQUFBO1FBQ3hDLENBQUM7S0FDRjtJQUVELE9BQU8sRUFBRTtRQUNQLFFBQVE7WUFDTixPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtnQkFDL0QsS0FBSyxFQUFFLENBQUMsaUJBQWlCLEVBQUU7d0JBQ3pCLDRCQUE0QixFQUFFLElBQUksQ0FBQyxTQUFTO3FCQUM3QyxDQUFDO2FBQ0gsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQTtRQUM3QixDQUFDO1FBQ0QsaUJBQWlCO1lBQ2YsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFO2dCQUNuQixJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVU7YUFDdEIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUN6QixDQUFDO1FBQ0QsT0FBTztZQUNMLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTtnQkFDZCxLQUFLLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRTt3QkFDeEIsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLE9BQU87d0JBQ3hDLEdBQUcsSUFBSSxDQUFDLFlBQVk7cUJBQ3JCLENBQUM7Z0JBQ0YsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLEtBQUssRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztpQkFDakM7YUFDRixFQUFFO2dCQUNELElBQUksQ0FBQyxpQkFBaUIsRUFBRTthQUN6QixDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsVUFBVTtZQUNSLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTtnQkFDZCxLQUFLLEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRTt3QkFDM0MsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLE9BQU87cUJBQzVDLENBQUM7YUFDSCxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQTtRQUM5QixDQUFDO0tBQ0Y7SUFFRCxNQUFNO1FBQ0osT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQ2QsS0FBSyxFQUFFLENBQUMsaUJBQWlCLEVBQUU7b0JBQ3pCLGdCQUFnQixFQUFFLElBQUksQ0FBQyxJQUFJO29CQUMzQixxQkFBcUIsRUFBRSxJQUFJLENBQUMsU0FBUztvQkFDckMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLFNBQVM7b0JBQ3RDLEdBQUcsSUFBSSxDQUFDLFlBQVk7b0JBQ3BCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQjtpQkFDekIsQ0FBQztTQUNILEVBQUU7WUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJO1lBQzFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJO1NBQy9DLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoLCBUcmFuc2l0aW9uLCBkZWZpbmVDb21wb25lbnQgfSBmcm9tICd2dWUnXG5pbXBvcnQgdHlwZSB7IFZOb2RlIH0gZnJvbSAndnVlJ1xuaW1wb3J0ICcuL1ZQaWNrZXIuc2FzcydcbmltcG9ydCAnLi4vVkNhcmQvVkNhcmQuc2FzcydcblxuLy8gTWl4aW5zXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXG5pbXBvcnQgRWxldmF0YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvZWxldmF0YWJsZSdcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcblxuLy8gSGVscGVyc1xuaW1wb3J0IHsgY29udmVydFRvVW5pdCwgZ2V0U2xvdCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XG4gIG5hbWU6ICd2LXBpY2tlcicsXG4gIG1peGluczogW1xuICAgIENvbG9yYWJsZSxcbiAgICBFbGV2YXRhYmxlLFxuICAgIFRoZW1lYWJsZSxcbiAgXSxcblxuICBwcm9wczoge1xuICAgIGZsYXQ6IEJvb2xlYW4sXG4gICAgZnVsbFdpZHRoOiBCb29sZWFuLFxuICAgIGxhbmRzY2FwZTogQm9vbGVhbixcbiAgICBub1RpdGxlOiBCb29sZWFuLFxuICAgIHRyYW5zaXRpb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdmYWRlLXRyYW5zaXRpb24nLFxuICAgIH0sXG4gICAgd2lkdGg6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAyOTAsXG4gICAgfSxcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNvbXB1dGVkVGl0bGVDb2xvciAoKTogc3RyaW5nIHwgZmFsc2Uge1xuICAgICAgY29uc3QgZGVmYXVsdFRpdGxlQ29sb3IgPSB0aGlzLmlzRGFyayA/IGZhbHNlIDogKHRoaXMuY29sb3IgfHwgJ3ByaW1hcnknKVxuICAgICAgcmV0dXJuIHRoaXMuY29sb3IgfHwgZGVmYXVsdFRpdGxlQ29sb3JcbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5UaXRsZSAoKSB7XG4gICAgICByZXR1cm4gaCgnZGl2JywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb21wdXRlZFRpdGxlQ29sb3IsIHtcbiAgICAgICAgY2xhc3M6IFsndi1waWNrZXJfX3RpdGxlJywge1xuICAgICAgICAgICd2LXBpY2tlcl9fdGl0bGUtLWxhbmRzY2FwZSc6IHRoaXMubGFuZHNjYXBlLFxuICAgICAgICB9XSxcbiAgICAgIH0pLCBnZXRTbG90KHRoaXMsICd0aXRsZScpKVxuICAgIH0sXG4gICAgZ2VuQm9keVRyYW5zaXRpb24gKCkge1xuICAgICAgcmV0dXJuIGgoVHJhbnNpdGlvbiwge1xuICAgICAgICBuYW1lOiB0aGlzLnRyYW5zaXRpb24sXG4gICAgICB9LCAoKSA9PiBnZXRTbG90KHRoaXMpKVxuICAgIH0sXG4gICAgZ2VuQm9keSAoKSB7XG4gICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogWyd2LXBpY2tlcl9fYm9keScsIHtcbiAgICAgICAgICAndi1waWNrZXJfX2JvZHktLW5vLXRpdGxlJzogdGhpcy5ub1RpdGxlLFxuICAgICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzLFxuICAgICAgICB9XSxcbiAgICAgICAgc3R5bGU6IHRoaXMuZnVsbFdpZHRoID8gdW5kZWZpbmVkIDoge1xuICAgICAgICAgIHdpZHRoOiBjb252ZXJ0VG9Vbml0KHRoaXMud2lkdGgpLFxuICAgICAgICB9LFxuICAgICAgfSwgW1xuICAgICAgICB0aGlzLmdlbkJvZHlUcmFuc2l0aW9uKCksXG4gICAgICBdKVxuICAgIH0sXG4gICAgZ2VuQWN0aW9ucyAoKSB7XG4gICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogWyd2LXBpY2tlcl9fYWN0aW9ucyB2LWNhcmRfX2FjdGlvbnMnLCB7XG4gICAgICAgICAgJ3YtcGlja2VyX19hY3Rpb25zLS1uby10aXRsZSc6IHRoaXMubm9UaXRsZSxcbiAgICAgICAgfV0sXG4gICAgICB9LCBnZXRTbG90KHRoaXMsICdhY3Rpb25zJykpXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKCk6IFZOb2RlIHtcbiAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgY2xhc3M6IFsndi1waWNrZXIgdi1jYXJkJywge1xuICAgICAgICAndi1waWNrZXItLWZsYXQnOiB0aGlzLmZsYXQsXG4gICAgICAgICd2LXBpY2tlci0tbGFuZHNjYXBlJzogdGhpcy5sYW5kc2NhcGUsXG4gICAgICAgICd2LXBpY2tlci0tZnVsbC13aWR0aCc6IHRoaXMuZnVsbFdpZHRoLFxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3NlcyxcbiAgICAgICAgLi4udGhpcy5lbGV2YXRpb25DbGFzc2VzLFxuICAgICAgfV0sXG4gICAgfSwgW1xuICAgICAgdGhpcy4kc2xvdHMudGl0bGUgPyB0aGlzLmdlblRpdGxlKCkgOiBudWxsLFxuICAgICAgdGhpcy5nZW5Cb2R5KCksXG4gICAgICB0aGlzLiRzbG90cy5hY3Rpb25zID8gdGhpcy5nZW5BY3Rpb25zKCkgOiBudWxsLFxuICAgIF0pXG4gIH0sXG59KVxuIl19