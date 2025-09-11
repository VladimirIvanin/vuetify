import './VBottomSheet.sass';
// Extensions
import VDialog from '../VDialog/VDialog';
import { defineComponent } from 'vue';
/* @vue/component */
export default defineComponent({
    name: 'v-bottom-sheet',
    extends: VDialog,
    props: {
        inset: Boolean,
        maxWidth: [String, Number],
        transition: {
            type: String,
            default: 'bottom-sheet-transition',
        },
    },
    computed: {
        classes() {
            return {
                ...VDialog.computed.classes.call(this),
                'v-bottom-sheet': true,
                'v-bottom-sheet--inset': this.inset,
            };
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkJvdHRvbVNoZWV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkJvdHRvbVNoZWV0L1ZCb3R0b21TaGVldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHFCQUFxQixDQUFBO0FBRTVCLGFBQWE7QUFDYixPQUFPLE9BQU8sTUFBTSxvQkFBb0IsQ0FBQTtBQUN4QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBRXJDLG9CQUFvQjtBQUNwQixlQUFlLGVBQWUsQ0FBQztJQUM3QixJQUFJLEVBQUUsZ0JBQWdCO0lBQ3RCLE9BQU8sRUFBRSxPQUFPO0lBRWhCLEtBQUssRUFBRTtRQUNMLEtBQUssRUFBRSxPQUFPO1FBQ2QsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztRQUMxQixVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSx5QkFBeUI7U0FDbkM7S0FDRjtJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPO2dCQUNMLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDdEMsZ0JBQWdCLEVBQUUsSUFBSTtnQkFDdEIsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLEtBQUs7YUFDcEMsQ0FBQTtRQUNILENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi9WQm90dG9tU2hlZXQuc2FzcydcblxuLy8gRXh0ZW5zaW9uc1xuaW1wb3J0IFZEaWFsb2cgZnJvbSAnLi4vVkRpYWxvZy9WRGlhbG9nJ1xuaW1wb3J0IHsgZGVmaW5lQ29tcG9uZW50IH0gZnJvbSAndnVlJ1xuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29tcG9uZW50KHtcbiAgbmFtZTogJ3YtYm90dG9tLXNoZWV0JyxcbiAgZXh0ZW5kczogVkRpYWxvZyxcblxuICBwcm9wczoge1xuICAgIGluc2V0OiBCb29sZWFuLFxuICAgIG1heFdpZHRoOiBbU3RyaW5nLCBOdW1iZXJdLFxuICAgIHRyYW5zaXRpb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdib3R0b20tc2hlZXQtdHJhbnNpdGlvbicsXG4gICAgfSxcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5WRGlhbG9nLmNvbXB1dGVkLmNsYXNzZXMuY2FsbCh0aGlzKSxcbiAgICAgICAgJ3YtYm90dG9tLXNoZWV0JzogdHJ1ZSxcbiAgICAgICAgJ3YtYm90dG9tLXNoZWV0LS1pbnNldCc6IHRoaXMuaW5zZXQsXG4gICAgICB9XG4gICAgfSxcbiAgfSxcbn0pXG4iXX0=