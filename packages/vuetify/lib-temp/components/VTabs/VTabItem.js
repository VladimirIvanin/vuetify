// Extensions
import { defineComponent } from 'vue';
import VWindowItem from '../VWindow/VWindowItem';
/* @vue/component */
export default defineComponent({
    name: 'v-tab-item',
    extends: VWindowItem,
    props: {
        id: String,
    },
    methods: {
        genWindowItem() {
            const item = VWindowItem.methods.genWindowItem.call(this);
            item.id = this.id || this.value;
            return item;
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRhYkl0ZW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WVGFicy9WVGFiSXRlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhO0FBQ2IsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLEtBQUssQ0FBQTtBQUNyQyxPQUFPLFdBQVcsTUFBTSx3QkFBd0IsQ0FBQTtBQUVoRCxvQkFBb0I7QUFDcEIsZUFBZSxlQUFlLENBQUM7SUFDN0IsSUFBSSxFQUFFLFlBQVk7SUFFbEIsT0FBTyxFQUFFLFdBQVc7SUFFcEIsS0FBSyxFQUFFO1FBQ0wsRUFBRSxFQUFFLE1BQU07S0FDWDtJQUVELE9BQU8sRUFBRTtRQUNQLGFBQWE7WUFDWCxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7WUFFekQsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUE7WUFFL0IsT0FBTyxJQUFJLENBQUE7UUFDYixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBFeHRlbnNpb25zXG5pbXBvcnQgeyBkZWZpbmVDb21wb25lbnQgfSBmcm9tICd2dWUnXG5pbXBvcnQgVldpbmRvd0l0ZW0gZnJvbSAnLi4vVldpbmRvdy9WV2luZG93SXRlbSdcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XG4gIG5hbWU6ICd2LXRhYi1pdGVtJyxcblxuICBleHRlbmRzOiBWV2luZG93SXRlbSxcblxuICBwcm9wczoge1xuICAgIGlkOiBTdHJpbmcsXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGdlbldpbmRvd0l0ZW0gKCkge1xuICAgICAgY29uc3QgaXRlbSA9IFZXaW5kb3dJdGVtLm1ldGhvZHMuZ2VuV2luZG93SXRlbS5jYWxsKHRoaXMpXG5cbiAgICAgIGl0ZW0uaWQgPSB0aGlzLmlkIHx8IHRoaXMudmFsdWVcblxuICAgICAgcmV0dXJuIGl0ZW1cbiAgICB9LFxuICB9LFxufSlcbiJdfQ==