import { defineComponent } from 'vue';
export default defineComponent({
    name: 'sizeable',
    props: {
        large: Boolean,
        small: Boolean,
        xLarge: Boolean,
        xSmall: Boolean,
    },
    computed: {
        medium() {
            return Boolean(!this.xSmall &&
                !this.small &&
                !this.large &&
                !this.xLarge);
        },
        sizeableClasses() {
            return {
                'v-size--x-small': this.xSmall,
                'v-size--small': this.small,
                'v-size--default': this.medium,
                'v-size--large': this.large,
                'v-size--x-large': this.xLarge,
            };
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3NpemVhYmxlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxLQUFLLENBQUE7QUFFbkMsZUFBZSxlQUFlLENBQUM7SUFDN0IsSUFBSSxFQUFFLFVBQVU7SUFFaEIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFLE9BQU87UUFDZCxLQUFLLEVBQUUsT0FBTztRQUNkLE1BQU0sRUFBRSxPQUFPO1FBQ2YsTUFBTSxFQUFFLE9BQU87S0FDaEI7SUFFRCxRQUFRLEVBQUU7UUFDUixNQUFNO1lBQ0osT0FBTyxPQUFPLENBQ1osQ0FBQyxJQUFJLENBQUMsTUFBTTtnQkFDWixDQUFDLElBQUksQ0FBQyxLQUFLO2dCQUNYLENBQUMsSUFBSSxDQUFDLEtBQUs7Z0JBQ1gsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUNiLENBQUE7UUFDSCxDQUFDO1FBQ0QsZUFBZTtZQUNiLE9BQU87Z0JBQ0wsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQzlCLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDM0IsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQzlCLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDM0IsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLE1BQU07YUFDL0IsQ0FBQTtRQUNILENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZGVmaW5lQ29tcG9uZW50fSBmcm9tICd2dWUnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XG4gIG5hbWU6ICdzaXplYWJsZScsXG5cbiAgcHJvcHM6IHtcbiAgICBsYXJnZTogQm9vbGVhbixcbiAgICBzbWFsbDogQm9vbGVhbixcbiAgICB4TGFyZ2U6IEJvb2xlYW4sXG4gICAgeFNtYWxsOiBCb29sZWFuLFxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgbWVkaXVtICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiBCb29sZWFuKFxuICAgICAgICAhdGhpcy54U21hbGwgJiZcbiAgICAgICAgIXRoaXMuc21hbGwgJiZcbiAgICAgICAgIXRoaXMubGFyZ2UgJiZcbiAgICAgICAgIXRoaXMueExhcmdlXG4gICAgICApXG4gICAgfSxcbiAgICBzaXplYWJsZUNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAndi1zaXplLS14LXNtYWxsJzogdGhpcy54U21hbGwsXG4gICAgICAgICd2LXNpemUtLXNtYWxsJzogdGhpcy5zbWFsbCxcbiAgICAgICAgJ3Ytc2l6ZS0tZGVmYXVsdCc6IHRoaXMubWVkaXVtLFxuICAgICAgICAndi1zaXplLS1sYXJnZSc6IHRoaXMubGFyZ2UsXG4gICAgICAgICd2LXNpemUtLXgtbGFyZ2UnOiB0aGlzLnhMYXJnZSxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxufSlcbiJdfQ==