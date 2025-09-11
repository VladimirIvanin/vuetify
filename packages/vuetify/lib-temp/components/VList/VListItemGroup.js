// Styles
import './VListItemGroup.sass';
// Extensions
import { BaseItemGroup } from '../VItemGroup/VItemGroup';
// Mixins
import Colorable from '../../mixins/colorable';
// Utilities
import mixins from '../../util/mixins';
export default mixins(BaseItemGroup, Colorable).extend({
    name: 'v-list-item-group',
    provide() {
        return {
            isInGroup: true,
            listItemGroup: this,
        };
    },
    computed: {
        classes() {
            return {
                ...BaseItemGroup.computed.classes.call(this),
                'v-list-item-group': true,
            };
        },
    },
    methods: {
        genData() {
            return this.setTextColor(this.color, {
                ...BaseItemGroup.methods.genData.call(this),
                attrs: {
                    role: 'listbox',
                },
            });
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkxpc3RJdGVtR3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WTGlzdC9WTGlzdEl0ZW1Hcm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyx1QkFBdUIsQ0FBQTtBQUU5QixhQUFhO0FBQ2IsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFBO0FBRXhELFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxZQUFZO0FBQ1osT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFFdEMsZUFBZSxNQUFNLENBQ25CLGFBQWEsRUFDYixTQUFTLENBQ1YsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsbUJBQW1CO0lBRXpCLE9BQU87UUFDTCxPQUFPO1lBQ0wsU0FBUyxFQUFFLElBQUk7WUFDZixhQUFhLEVBQUUsSUFBSTtTQUNwQixDQUFBO0lBQ0gsQ0FBQztJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPO2dCQUNMLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDNUMsbUJBQW1CLEVBQUUsSUFBSTthQUMxQixDQUFBO1FBQ0gsQ0FBQztLQUNGO0lBRUQsT0FBTyxFQUFFO1FBQ1AsT0FBTztZQUNMLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNuQyxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQzNDLEtBQUssRUFBRTtvQkFDTCxJQUFJLEVBQUUsU0FBUztpQkFDaEI7YUFDRixDQUFDLENBQUE7UUFDSixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcbmltcG9ydCAnLi9WTGlzdEl0ZW1Hcm91cC5zYXNzJ1xuXG4vLyBFeHRlbnNpb25zXG5pbXBvcnQgeyBCYXNlSXRlbUdyb3VwIH0gZnJvbSAnLi4vVkl0ZW1Hcm91cC9WSXRlbUdyb3VwJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXG4gIEJhc2VJdGVtR3JvdXAsXG4gIENvbG9yYWJsZVxuKS5leHRlbmQoe1xuICBuYW1lOiAndi1saXN0LWl0ZW0tZ3JvdXAnLFxuXG4gIHByb3ZpZGUgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpc0luR3JvdXA6IHRydWUsXG4gICAgICBsaXN0SXRlbUdyb3VwOiB0aGlzLFxuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5CYXNlSXRlbUdyb3VwLmNvbXB1dGVkLmNsYXNzZXMuY2FsbCh0aGlzKSxcbiAgICAgICAgJ3YtbGlzdC1pdGVtLWdyb3VwJzogdHJ1ZSxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5EYXRhICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0VGV4dENvbG9yKHRoaXMuY29sb3IsIHtcbiAgICAgICAgLi4uQmFzZUl0ZW1Hcm91cC5tZXRob2RzLmdlbkRhdGEuY2FsbCh0aGlzKSxcbiAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICByb2xlOiAnbGlzdGJveCcsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0sXG4gIH0sXG59KVxuIl19