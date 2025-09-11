import { h } from 'vue';
// Styles
import './VSheet.sass';
// Mixins
import BindsAttrs from '../../mixins/binds-attrs';
import Colorable from '../../mixins/colorable';
import Elevatable from '../../mixins/elevatable';
import Measurable from '../../mixins/measurable';
import Roundable from '../../mixins/roundable';
import Themeable from '../../mixins/themeable';
// Types
import { defineComponent } from 'vue';
/* @vue/component */
export default defineComponent({
    name: 'v-sheet',
    mixins: [
        BindsAttrs,
        Colorable,
        Elevatable,
        Measurable,
        Roundable,
        Themeable
    ],
    props: {
        outlined: Boolean,
        shaped: Boolean,
        tag: {
            type: String,
            default: 'div',
        },
    },
    computed: {
        classes() {
            return {
                'v-sheet': true,
                'v-sheet--outlined': this.outlined,
                'v-sheet--shaped': this.shaped,
                ...this.themeClasses,
                ...this.elevationClasses,
                ...this.roundedClasses,
            };
        },
        styles() {
            return this.measurableStyles;
        },
    },
    render() {
        var _a, _b;
        const data = {
            class: this.classes,
            style: this.styles,
            ...this.listeners$,
        };
        return h(this.tag, this.setBackgroundColor(this.color, data), (_b = (_a = this.$slots).default) === null || _b === void 0 ? void 0 : _b.call(_a));
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNoZWV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlNoZWV0L1ZTaGVldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsQ0FBQyxFQUFDLE1BQU0sS0FBSyxDQUFBO0FBQ3JCLFNBQVM7QUFDVCxPQUFPLGVBQWUsQ0FBQTtBQUV0QixTQUFTO0FBQ1QsT0FBTyxVQUFVLE1BQU0sMEJBQTBCLENBQUE7QUFDakQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFLOUMsUUFBUTtBQUNSLE9BQU8sRUFBUyxlQUFlLEVBQUUsTUFBTSxLQUFLLENBQUE7QUFFNUMsb0JBQW9CO0FBQ3BCLGVBQWUsZUFBZSxDQUFDO0lBQzdCLElBQUksRUFBRSxTQUFTO0lBQ2YsTUFBTSxFQUFFO1FBQ04sVUFBVTtRQUNWLFNBQVM7UUFDVCxVQUFVO1FBQ1YsVUFBVTtRQUNWLFNBQVM7UUFDVCxTQUFTO0tBQ1Y7SUFFRCxLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsT0FBTztRQUNqQixNQUFNLEVBQUUsT0FBTztRQUNmLEdBQUcsRUFBRTtZQUNILElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLEtBQUs7U0FDZjtLQUNGO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wsU0FBUyxFQUFFLElBQUk7Z0JBQ2YsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ2xDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUM5QixHQUFHLElBQUksQ0FBQyxZQUFZO2dCQUNwQixHQUFHLElBQUksQ0FBQyxnQkFBZ0I7Z0JBQ3hCLEdBQUcsSUFBSSxDQUFDLGNBQWM7YUFDdkIsQ0FBQTtRQUNILENBQUM7UUFDRCxNQUFNO1lBQ0osT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUE7UUFDOUIsQ0FBQztLQUNGO0lBRUQsTUFBTTs7UUFDSixNQUFNLElBQUksR0FBRztZQUNYLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTztZQUNuQixLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbEIsR0FBRyxJQUFJLENBQUMsVUFBVTtTQUNuQixDQUFBO1FBRUQsT0FBTyxDQUFDLENBQ04sSUFBSSxDQUFDLEdBQUcsRUFDUixJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFDekMsTUFBQSxNQUFBLElBQUksQ0FBQyxNQUFNLEVBQUMsT0FBTyxrREFBSSxDQUN4QixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aH0gZnJvbSAndnVlJ1xuLy8gU3R5bGVzXG5pbXBvcnQgJy4vVlNoZWV0LnNhc3MnXG5cbi8vIE1peGluc1xuaW1wb3J0IEJpbmRzQXR0cnMgZnJvbSAnLi4vLi4vbWl4aW5zL2JpbmRzLWF0dHJzJ1xuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xuaW1wb3J0IEVsZXZhdGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2VsZXZhdGFibGUnXG5pbXBvcnQgTWVhc3VyYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvbWVhc3VyYWJsZSdcbmltcG9ydCBSb3VuZGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3JvdW5kYWJsZSdcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcblxuLy8gSGVscGVyc1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcblxuLy8gVHlwZXNcbmltcG9ydCB7IFZOb2RlLCBkZWZpbmVDb21wb25lbnQgfSBmcm9tICd2dWUnXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb21wb25lbnQoe1xuICBuYW1lOiAndi1zaGVldCcsXG4gIG1peGluczogW1xuICAgIEJpbmRzQXR0cnMsXG4gICAgQ29sb3JhYmxlLFxuICAgIEVsZXZhdGFibGUsXG4gICAgTWVhc3VyYWJsZSxcbiAgICBSb3VuZGFibGUsXG4gICAgVGhlbWVhYmxlXG4gIF0sXG5cbiAgcHJvcHM6IHtcbiAgICBvdXRsaW5lZDogQm9vbGVhbixcbiAgICBzaGFwZWQ6IEJvb2xlYW4sXG4gICAgdGFnOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnZGl2JyxcbiAgICB9LFxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LXNoZWV0JzogdHJ1ZSxcbiAgICAgICAgJ3Ytc2hlZXQtLW91dGxpbmVkJzogdGhpcy5vdXRsaW5lZCxcbiAgICAgICAgJ3Ytc2hlZXQtLXNoYXBlZCc6IHRoaXMuc2hhcGVkLFxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3NlcyxcbiAgICAgICAgLi4udGhpcy5lbGV2YXRpb25DbGFzc2VzLFxuICAgICAgICAuLi50aGlzLnJvdW5kZWRDbGFzc2VzLFxuICAgICAgfVxuICAgIH0sXG4gICAgc3R5bGVzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHRoaXMubWVhc3VyYWJsZVN0eWxlc1xuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgY29uc3QgZGF0YSA9IHtcbiAgICAgIGNsYXNzOiB0aGlzLmNsYXNzZXMsXG4gICAgICBzdHlsZTogdGhpcy5zdHlsZXMsXG4gICAgICAuLi50aGlzLmxpc3RlbmVycyQsXG4gICAgfVxuXG4gICAgcmV0dXJuIGgoXG4gICAgICB0aGlzLnRhZyxcbiAgICAgIHRoaXMuc2V0QmFja2dyb3VuZENvbG9yKHRoaXMuY29sb3IsIGRhdGEpLFxuICAgICAgdGhpcy4kc2xvdHMuZGVmYXVsdD8uKClcbiAgICApXG4gIH0sXG59KVxuIl19