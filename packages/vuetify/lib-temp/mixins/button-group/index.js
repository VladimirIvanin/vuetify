// Extensions
import { defineComponent } from 'vue';
import { BaseItemGroup } from '../../components/VItemGroup/VItemGroup';
/* @vue/component */
export default defineComponent({
    name: 'button-group',
    extends: BaseItemGroup,
    provide() {
        return {
            btnToggle: this,
        };
    },
    computed: {
        classes() {
            return BaseItemGroup.computed.classes.call(this);
        },
    },
    methods: {
        // Isn't being passed down through types
        genData: BaseItemGroup.methods.genData,
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2J1dHRvbi1ncm91cC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhO0FBQ2IsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLEtBQUssQ0FBQTtBQUNyQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0NBQXdDLENBQUE7QUFFdEUsb0JBQW9CO0FBQ3BCLGVBQWUsZUFBZSxDQUFDO0lBQzdCLElBQUksRUFBRSxjQUFjO0lBQ3BCLE9BQU8sRUFBRSxhQUFhO0lBRXRCLE9BQU87UUFDTCxPQUFPO1lBQ0wsU0FBUyxFQUFFLElBQUk7U0FDaEIsQ0FBQTtJQUNILENBQUM7SUFFRCxRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTyxhQUFhLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDbEQsQ0FBQztLQUNGO0lBRUQsT0FBTyxFQUFFO1FBQ1Asd0NBQXdDO1FBQ3hDLE9BQU8sRUFBRSxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU87S0FDdkM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBFeHRlbnNpb25zXG5pbXBvcnQgeyBkZWZpbmVDb21wb25lbnQgfSBmcm9tICd2dWUnXG5pbXBvcnQgeyBCYXNlSXRlbUdyb3VwIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9WSXRlbUdyb3VwL1ZJdGVtR3JvdXAnXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb21wb25lbnQoe1xuICBuYW1lOiAnYnV0dG9uLWdyb3VwJyxcbiAgZXh0ZW5kczogQmFzZUl0ZW1Hcm91cCxcblxuICBwcm92aWRlICgpOiBvYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICBidG5Ub2dnbGU6IHRoaXMsXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiBCYXNlSXRlbUdyb3VwLmNvbXB1dGVkLmNsYXNzZXMuY2FsbCh0aGlzKVxuICAgIH0sXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIC8vIElzbid0IGJlaW5nIHBhc3NlZCBkb3duIHRocm91Z2ggdHlwZXNcbiAgICBnZW5EYXRhOiBCYXNlSXRlbUdyb3VwLm1ldGhvZHMuZ2VuRGF0YSxcbiAgfSxcbn0pXG4iXX0=