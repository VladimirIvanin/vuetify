import { Transition, h, withDirectives } from 'vue';
// Mixins
import Measurable from '../../mixins/measurable';
import Toggleable from '../../mixins/toggleable';
// Directives
import intersect from '../../directives/intersect';
// Utilities
import mixins from '../../util/mixins';
import { getSlot } from '../../util/helpers';
export default mixins(Measurable, Toggleable).extend({
    name: 'VLazy',
    emits: ['update:modelValue'],
    props: {
        options: {
            type: Object,
            // For more information on types, navigate to:
            // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
            default: () => ({
                root: undefined,
                rootMargin: undefined,
                threshold: undefined,
            }),
        },
        tag: {
            type: String,
            default: 'div',
        },
        transition: {
            type: String,
            default: 'fade-transition',
        },
    },
    computed: {
        styles() {
            return {
                ...this.measurableStyles,
            };
        },
    },
    methods: {
        genContent() {
            const children = this.isActive && getSlot(this);
            return this.transition
                ? h(Transition, {
                    name: this.transition,
                }, children)
                : children;
        },
        onObserve(entries, observer, isIntersecting) {
            if (this.isActive)
                return;
            this.isActive = isIntersecting;
        },
    },
    render() {
        return withDirectives(h(this.tag, {
            class: 'v-lazy',
            ...this.$attrs,
            style: this.styles,
        }, [this.genContent()]), [
            [intersect, {
                    handler: this.onObserve,
                    options: this.options,
                }]
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkxhenkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WTGF6eS9WTGF6eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxjQUFjLEVBQW1CLE1BQU0sS0FBSyxDQUFBO0FBQ3BFLFNBQVM7QUFDVCxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUVoRCxhQUFhO0FBQ2IsT0FBTyxTQUFTLE1BQU0sNEJBQTRCLENBQUE7QUFFbEQsWUFBWTtBQUNaLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBQ3RDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQU01QyxlQUFlLE1BQU0sQ0FDbkIsVUFBVSxFQUNWLFVBQVUsQ0FDWCxDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxPQUFPO0lBRWIsS0FBSyxFQUFFLENBQUMsbUJBQW1CLENBQUM7SUFHNUIsS0FBSyxFQUFFO1FBQ0wsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLE1BQU07WUFDWiw4Q0FBOEM7WUFDOUMsNkVBQTZFO1lBQzdFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUNkLElBQUksRUFBRSxTQUFTO2dCQUNmLFVBQVUsRUFBRSxTQUFTO2dCQUNyQixTQUFTLEVBQUUsU0FBUzthQUNyQixDQUFDO1NBQ3dDO1FBQzVDLEdBQUcsRUFBRTtZQUNILElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLEtBQUs7U0FDZjtRQUNELFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLGlCQUFpQjtTQUMzQjtLQUNGO0lBRUQsUUFBUSxFQUFFO1FBQ1IsTUFBTTtZQUNKLE9BQU87Z0JBQ0wsR0FBRyxJQUFJLENBQUMsZ0JBQWdCO2FBQ3pCLENBQUE7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxVQUFVO1lBQ1IsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7WUFFL0MsT0FBTyxJQUFJLENBQUMsVUFBVTtnQkFDcEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUU7b0JBQ2QsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVO2lCQUN0QixFQUFFLFFBQVEsQ0FBQztnQkFDWixDQUFDLENBQUMsUUFBUSxDQUFBO1FBQ2QsQ0FBQztRQUNELFNBQVMsQ0FDUCxPQUFvQyxFQUNwQyxRQUE4QixFQUM5QixjQUF1QjtZQUV2QixJQUFJLElBQUksQ0FBQyxRQUFRO2dCQUFFLE9BQU07WUFFekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxjQUFjLENBQUE7UUFDaEMsQ0FBQztLQUNGO0lBRUQsTUFBTTtRQUNKLE9BQU8sY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ2hDLEtBQUssRUFBRSxRQUFRO1lBQ2YsR0FBRyxJQUFJLENBQUMsTUFBTTtZQUNkLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTTtTQUNuQixFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRTtZQUN2QixDQUFDLFNBQVMsRUFBRTtvQkFDVixPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVM7b0JBQ3ZCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztpQkFDdEIsQ0FBQztTQUNILENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUcmFuc2l0aW9uLCBoLCB3aXRoRGlyZWN0aXZlcywgZGVmaW5lQ29tcG9uZW50IH0gZnJvbSAndnVlJ1xuLy8gTWl4aW5zXG5pbXBvcnQgTWVhc3VyYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvbWVhc3VyYWJsZSdcbmltcG9ydCBUb2dnbGVhYmxlIGZyb20gJy4uLy4uL21peGlucy90b2dnbGVhYmxlJ1xuXG4vLyBEaXJlY3RpdmVzXG5pbXBvcnQgaW50ZXJzZWN0IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvaW50ZXJzZWN0J1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgeyBnZXRTbG90IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXG5pbXBvcnQgeyBQcm9wVmFsaWRhdG9yIH0gZnJvbSAndnVlL3R5cGVzL29wdGlvbnMnXG5cbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcbiAgTWVhc3VyYWJsZSxcbiAgVG9nZ2xlYWJsZVxuKS5leHRlbmQoe1xuICBuYW1lOiAnVkxhenknLFxuXG4gIGVtaXRzOiBbJ3VwZGF0ZTptb2RlbFZhbHVlJ10sXG5cblxuICBwcm9wczoge1xuICAgIG9wdGlvbnM6IHtcbiAgICAgIHR5cGU6IE9iamVjdCxcbiAgICAgIC8vIEZvciBtb3JlIGluZm9ybWF0aW9uIG9uIHR5cGVzLCBuYXZpZ2F0ZSB0bzpcbiAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9JbnRlcnNlY3Rpb25fT2JzZXJ2ZXJfQVBJXG4gICAgICBkZWZhdWx0OiAoKSA9PiAoe1xuICAgICAgICByb290OiB1bmRlZmluZWQsXG4gICAgICAgIHJvb3RNYXJnaW46IHVuZGVmaW5lZCxcbiAgICAgICAgdGhyZXNob2xkOiB1bmRlZmluZWQsXG4gICAgICB9KSxcbiAgICB9IGFzIFByb3BWYWxpZGF0b3I8SW50ZXJzZWN0aW9uT2JzZXJ2ZXJJbml0PixcbiAgICB0YWc6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdkaXYnLFxuICAgIH0sXG4gICAgdHJhbnNpdGlvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ2ZhZGUtdHJhbnNpdGlvbicsXG4gICAgfSxcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIHN0eWxlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnRoaXMubWVhc3VyYWJsZVN0eWxlcyxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5Db250ZW50ICgpIHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5pc0FjdGl2ZSAmJiBnZXRTbG90KHRoaXMpXG5cbiAgICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb25cbiAgICAgICAgPyBoKFRyYW5zaXRpb24sIHtcbiAgICAgICAgICBuYW1lOiB0aGlzLnRyYW5zaXRpb24sXG4gICAgICAgIH0sIGNoaWxkcmVuKVxuICAgICAgICA6IGNoaWxkcmVuXG4gICAgfSxcbiAgICBvbk9ic2VydmUgKFxuICAgICAgZW50cmllczogSW50ZXJzZWN0aW9uT2JzZXJ2ZXJFbnRyeVtdLFxuICAgICAgb2JzZXJ2ZXI6IEludGVyc2VjdGlvbk9ic2VydmVyLFxuICAgICAgaXNJbnRlcnNlY3Rpbmc6IGJvb2xlYW4sXG4gICAgKSB7XG4gICAgICBpZiAodGhpcy5pc0FjdGl2ZSkgcmV0dXJuXG5cbiAgICAgIHRoaXMuaXNBY3RpdmUgPSBpc0ludGVyc2VjdGluZ1xuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgcmV0dXJuIHdpdGhEaXJlY3RpdmVzKGgodGhpcy50YWcsIHtcbiAgICAgIGNsYXNzOiAndi1sYXp5JyxcbiAgICAgIC4uLnRoaXMuJGF0dHJzLFxuICAgICAgc3R5bGU6IHRoaXMuc3R5bGVzLFxuICAgIH0sIFt0aGlzLmdlbkNvbnRlbnQoKV0pLCBbXG4gICAgICBbaW50ZXJzZWN0LCB7XG4gICAgICAgIGhhbmRsZXI6IHRoaXMub25PYnNlcnZlLFxuICAgICAgICBvcHRpb25zOiB0aGlzLm9wdGlvbnMsXG4gICAgICB9XVxuICAgIF0pXG4gIH0sXG59KVxuIl19