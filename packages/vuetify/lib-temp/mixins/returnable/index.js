import { defineComponent } from 'vue';
/* @vue/component */
export default defineComponent({
    name: 'returnable',
    props: {
        returnValue: null,
    },
    data: () => ({
        isActive: false,
        originalValue: null,
    }),
    watch: {
        isActive(val) {
            if (val) {
                this.originalValue = this.returnValue;
            }
            else {
                this.$emit('update:return-value', this.originalValue);
            }
        },
    },
    methods: {
        save(value) {
            this.originalValue = value;
            setTimeout(() => {
                this.isActive = false;
            });
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3JldHVybmFibGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLEtBQUssQ0FBQTtBQUVuQyxvQkFBb0I7QUFDcEIsZUFBZSxlQUFlLENBQUM7SUFDN0IsSUFBSSxFQUFFLFlBQVk7SUFFbEIsS0FBSyxFQUFFO1FBQ0wsV0FBVyxFQUFFLElBQVc7S0FDekI7SUFFRCxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNYLFFBQVEsRUFBRSxLQUFLO1FBQ2YsYUFBYSxFQUFFLElBQVc7S0FDM0IsQ0FBQztJQUVGLEtBQUssRUFBRTtRQUNMLFFBQVEsQ0FBRSxHQUFHO1lBQ1gsSUFBSSxHQUFHLEVBQUU7Z0JBQ1AsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFBO2FBQ3RDO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO2FBQ3REO1FBQ0gsQ0FBQztLQUNGO0lBRUQsT0FBTyxFQUFFO1FBQ1AsSUFBSSxDQUFFLEtBQVU7WUFDZCxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQTtZQUMxQixVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO1lBQ3ZCLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtkZWZpbmVDb21wb25lbnR9IGZyb20gJ3Z1ZSdcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XG4gIG5hbWU6ICdyZXR1cm5hYmxlJyxcblxuICBwcm9wczoge1xuICAgIHJldHVyblZhbHVlOiBudWxsIGFzIGFueSxcbiAgfSxcblxuICBkYXRhOiAoKSA9PiAoe1xuICAgIGlzQWN0aXZlOiBmYWxzZSxcbiAgICBvcmlnaW5hbFZhbHVlOiBudWxsIGFzIGFueSxcbiAgfSksXG5cbiAgd2F0Y2g6IHtcbiAgICBpc0FjdGl2ZSAodmFsKSB7XG4gICAgICBpZiAodmFsKSB7XG4gICAgICAgIHRoaXMub3JpZ2luYWxWYWx1ZSA9IHRoaXMucmV0dXJuVmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTpyZXR1cm4tdmFsdWUnLCB0aGlzLm9yaWdpbmFsVmFsdWUpXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgc2F2ZSAodmFsdWU6IGFueSkge1xuICAgICAgdGhpcy5vcmlnaW5hbFZhbHVlID0gdmFsdWVcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2VcbiAgICAgIH0pXG4gICAgfSxcbiAgfSxcbn0pXG4iXX0=