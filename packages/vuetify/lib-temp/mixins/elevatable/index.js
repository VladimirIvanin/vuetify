import { defineComponent } from 'vue';
export default defineComponent({
    name: 'elevatable',
    props: {
        elevation: [Number, String],
    },
    computed: {
        computedElevation() {
            return this.elevation;
        },
        elevationClasses() {
            const elevation = this.computedElevation;
            if (elevation == null)
                return {};
            if (isNaN(parseInt(elevation)))
                return {};
            return { [`elevation-${this.elevation}`]: true };
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2VsZXZhdGFibGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLEtBQUssQ0FBQTtBQUVuQyxlQUFlLGVBQWUsQ0FBQztJQUM3QixJQUFJLEVBQUUsWUFBWTtJQUVsQixLQUFLLEVBQUU7UUFDTCxTQUFTLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO0tBQzVCO0lBRUQsUUFBUSxFQUFFO1FBQ1IsaUJBQWlCO1lBQ2YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFBO1FBQ3ZCLENBQUM7UUFDRCxnQkFBZ0I7WUFDZCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUE7WUFFeEMsSUFBSSxTQUFTLElBQUksSUFBSTtnQkFBRSxPQUFPLEVBQUUsQ0FBQTtZQUNoQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQUUsT0FBTyxFQUFFLENBQUE7WUFDekMsT0FBTyxFQUFFLENBQUMsYUFBYSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQTtRQUNsRCxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2RlZmluZUNvbXBvbmVudH0gZnJvbSAndnVlJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb21wb25lbnQoe1xuICBuYW1lOiAnZWxldmF0YWJsZScsXG5cbiAgcHJvcHM6IHtcbiAgICBlbGV2YXRpb246IFtOdW1iZXIsIFN0cmluZ10sXG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjb21wdXRlZEVsZXZhdGlvbiAoKTogc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgICAgIHJldHVybiB0aGlzLmVsZXZhdGlvblxuICAgIH0sXG4gICAgZWxldmF0aW9uQ2xhc3NlcyAoKTogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4ge1xuICAgICAgY29uc3QgZWxldmF0aW9uID0gdGhpcy5jb21wdXRlZEVsZXZhdGlvblxuXG4gICAgICBpZiAoZWxldmF0aW9uID09IG51bGwpIHJldHVybiB7fVxuICAgICAgaWYgKGlzTmFOKHBhcnNlSW50KGVsZXZhdGlvbikpKSByZXR1cm4ge31cbiAgICAgIHJldHVybiB7IFtgZWxldmF0aW9uLSR7dGhpcy5lbGV2YXRpb259YF06IHRydWUgfVxuICAgIH0sXG4gIH0sXG59KVxuIl19