import './_grid.sass';
import './VGrid.sass';
import Grid from './grid';
import mergeData from '../../util/mergeData';
import { defineComponent, h } from 'vue';
/* @vue/component */
export default defineComponent({
    name: 'v-container',
    extends: Grid('container'),
    functional: true,
    props: {
        id: String,
        tag: {
            type: String,
            default: 'div',
        },
        fluid: {
            type: Boolean,
            default: false,
        },
    },
    render() {
        var _a, _b;
        let classes;
        // const { attrs } = data
        const attrs = this.$attrs;
        if (attrs) {
            // reset attrs to extract utility clases like pa-3
            classes = Object.keys(attrs).filter(key => {
                // TODO: Remove once resolved
                // https://github.com/vuejs/vue/issues/7841
                if (key === 'slot')
                    return false;
                const value = attrs[key];
                // add back data attributes like data-test="foo" but do not
                // add them as classes
                if (key.startsWith('data-')) {
                    // data.attrs![key] = value
                    return false;
                }
                return value || typeof value === 'string';
            });
        }
        // if (props.id) {
        //   data.domProps = data.domProps || {}
        //   data.domProps.id = props.id
        // }
        return h(this.tag, mergeData(this.$attrs, {
            class: Array({
                'container--fluid': this.fluid,
            }).concat(classes || []).concat('container'),
        }), (_b = (_a = this.$slots).default) === null || _b === void 0 ? void 0 : _b.call(_a));
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZHcmlkL1ZDb250YWluZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxjQUFjLENBQUE7QUFDckIsT0FBTyxjQUFjLENBQUE7QUFFckIsT0FBTyxJQUFJLE1BQU0sUUFBUSxDQUFBO0FBRXpCLE9BQU8sU0FBUyxNQUFNLHNCQUFzQixDQUFBO0FBQzVDLE9BQU8sRUFBRSxlQUFlLEVBQUUsQ0FBQyxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBRXhDLG9CQUFvQjtBQUNwQixlQUFlLGVBQWUsQ0FBQztJQUM3QixJQUFJLEVBQUUsYUFBYTtJQUNuQixPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixVQUFVLEVBQUUsSUFBSTtJQUNoQixLQUFLLEVBQUU7UUFDTCxFQUFFLEVBQUUsTUFBTTtRQUNWLEdBQUcsRUFBRTtZQUNILElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLEtBQUs7U0FDZjtRQUNELEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLEtBQUs7U0FDZjtLQUNGO0lBQ0QsTUFBTTs7UUFDSixJQUFJLE9BQU8sQ0FBQTtRQUNYLHlCQUF5QjtRQUV6QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFBO1FBRXpCLElBQUksS0FBSyxFQUFFO1lBQ1Qsa0RBQWtEO1lBQ2xELE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDeEMsNkJBQTZCO2dCQUM3QiwyQ0FBMkM7Z0JBQzNDLElBQUksR0FBRyxLQUFLLE1BQU07b0JBQUUsT0FBTyxLQUFLLENBQUE7Z0JBRWhDLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFFeEIsMkRBQTJEO2dCQUMzRCxzQkFBc0I7Z0JBQ3RCLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtvQkFDM0IsMkJBQTJCO29CQUMzQixPQUFPLEtBQUssQ0FBQTtpQkFDYjtnQkFFRCxPQUFPLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUE7WUFDM0MsQ0FBQyxDQUFDLENBQUE7U0FDSDtRQUVELGtCQUFrQjtRQUNsQix3Q0FBd0M7UUFDeEMsZ0NBQWdDO1FBQ2hDLElBQUk7UUFFSixPQUFPLENBQUMsQ0FDTixJQUFJLENBQUMsR0FBRyxFQUNSLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3JCLEtBQUssRUFBRSxLQUFLLENBQU07Z0JBQ2hCLGtCQUFrQixFQUFFLElBQUksQ0FBQyxLQUFLO2FBQy9CLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7U0FDN0MsQ0FBQyxFQUNGLE1BQUEsTUFBQSxJQUFJLENBQUMsTUFBTSxFQUFDLE9BQU8sa0RBQUksQ0FDeEIsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vX2dyaWQuc2FzcydcbmltcG9ydCAnLi9WR3JpZC5zYXNzJ1xuXG5pbXBvcnQgR3JpZCBmcm9tICcuL2dyaWQnXG5cbmltcG9ydCBtZXJnZURhdGEgZnJvbSAnLi4vLi4vdXRpbC9tZXJnZURhdGEnXG5pbXBvcnQgeyBkZWZpbmVDb21wb25lbnQsIGggfSBmcm9tICd2dWUnXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb21wb25lbnQoe1xuICBuYW1lOiAndi1jb250YWluZXInLFxuICBleHRlbmRzOiBHcmlkKCdjb250YWluZXInKSxcbiAgZnVuY3Rpb25hbDogdHJ1ZSxcbiAgcHJvcHM6IHtcbiAgICBpZDogU3RyaW5nLFxuICAgIHRhZzoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ2RpdicsXG4gICAgfSxcbiAgICBmbHVpZDoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG4gIHJlbmRlciAoKSB7XG4gICAgbGV0IGNsYXNzZXNcbiAgICAvLyBjb25zdCB7IGF0dHJzIH0gPSBkYXRhXG5cbiAgICBjb25zdCBhdHRycyA9IHRoaXMuJGF0dHJzXG5cbiAgICBpZiAoYXR0cnMpIHtcbiAgICAgIC8vIHJlc2V0IGF0dHJzIHRvIGV4dHJhY3QgdXRpbGl0eSBjbGFzZXMgbGlrZSBwYS0zXG4gICAgICBjbGFzc2VzID0gT2JqZWN0LmtleXMoYXR0cnMpLmZpbHRlcihrZXkgPT4ge1xuICAgICAgICAvLyBUT0RPOiBSZW1vdmUgb25jZSByZXNvbHZlZFxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdnVlanMvdnVlL2lzc3Vlcy83ODQxXG4gICAgICAgIGlmIChrZXkgPT09ICdzbG90JykgcmV0dXJuIGZhbHNlXG5cbiAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyc1trZXldXG5cbiAgICAgICAgLy8gYWRkIGJhY2sgZGF0YSBhdHRyaWJ1dGVzIGxpa2UgZGF0YS10ZXN0PVwiZm9vXCIgYnV0IGRvIG5vdFxuICAgICAgICAvLyBhZGQgdGhlbSBhcyBjbGFzc2VzXG4gICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aCgnZGF0YS0nKSkge1xuICAgICAgICAgIC8vIGRhdGEuYXR0cnMhW2tleV0gPSB2YWx1ZVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZydcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gaWYgKHByb3BzLmlkKSB7XG4gICAgLy8gICBkYXRhLmRvbVByb3BzID0gZGF0YS5kb21Qcm9wcyB8fCB7fVxuICAgIC8vICAgZGF0YS5kb21Qcm9wcy5pZCA9IHByb3BzLmlkXG4gICAgLy8gfVxuXG4gICAgcmV0dXJuIGgoXG4gICAgICB0aGlzLnRhZyxcbiAgICAgIG1lcmdlRGF0YSh0aGlzLiRhdHRycywge1xuICAgICAgICBjbGFzczogQXJyYXk8YW55Pih7XG4gICAgICAgICAgJ2NvbnRhaW5lci0tZmx1aWQnOiB0aGlzLmZsdWlkLFxuICAgICAgICB9KS5jb25jYXQoY2xhc3NlcyB8fCBbXSkuY29uY2F0KCdjb250YWluZXInKSxcbiAgICAgIH0pLFxuICAgICAgdGhpcy4kc2xvdHMuZGVmYXVsdD8uKClcbiAgICApXG4gIH0sXG59KVxuIl19