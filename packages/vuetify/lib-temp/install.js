import { reactive } from 'vue';
import { legacyEventsMixin } from './util/legacyEventsMixin';
export function install(Vue, args = {}) {
    // if ((install as any).installed) return
    // (install as any).installed = true
    //   if (OurVue !== Vue) {
    //     consoleError(`Multiple instances of Vue detected
    // See https://github.com/vuetifyjs/vuetify/issues/4068
    // If you're seeing "$attrs is readonly", it's caused by this`)
    //   }
    const components = args.components || {};
    const directives = args.directives || {};
    for (const name in directives) {
        const directive = directives[name];
        Vue.directive(name, directive);
    }
    (function registerComponents(components) {
        if (components) {
            for (const key in components) {
                const component = components[key];
                if (component && !registerComponents(component.$_vuetify_subcomponents)) {
                    Vue.component(key, component);
                }
            }
            return true;
        }
        return false;
    })(components);
    // Used to avoid multiple mixins being setup
    // when in dev mode and hot module reload
    // https://github.com/vuejs/vue/issues/5089#issuecomment-284260111
    if (Vue.$_vuetify_installed)
        return;
    Vue.$_vuetify_installed = true;
    Vue.mixin({
        computed: {
            ...legacyEventsMixin.computed,
        },
        beforeCreate() {
            const options = this.$options;
            if (options.vuetify) {
                options.vuetify.init(this, this.$ssrContext);
                Vue.config.globalProperties.$vuetify = reactive(options.vuetify.framework);
            }
        },
        beforeMount() {
            // @ts-ignore
            if (this.$options.vuetify && this.$el && this.$el.hasAttribute('data-server-rendered')) {
                // @ts-ignore
                this.$vuetify.isHydrating = true;
                // @ts-ignore
                this.$vuetify.breakpoint.update(true);
            }
        },
        mounted() {
            // @ts-ignore
            if (this.$options.vuetify && this.$vuetify.isHydrating) {
                // @ts-ignore
                this.$vuetify.isHydrating = false;
                // @ts-ignore
                this.$vuetify.breakpoint.update();
            }
        },
        methods: {
            ...legacyEventsMixin.methods,
        },
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9pbnN0YWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBYSxRQUFRLEVBQUUsTUFBTSxLQUFLLENBQUE7QUFHekMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMEJBQTBCLENBQUE7QUFFNUQsTUFBTSxVQUFVLE9BQU8sQ0FBRSxHQUFpQyxFQUFFLE9BQTBCLEVBQUU7SUFDdEYseUNBQXlDO0lBQ3pDLG9DQUFvQztJQUVwQywwQkFBMEI7SUFDMUIsdURBQXVEO0lBQ3ZELHVEQUF1RDtJQUV2RCwrREFBK0Q7SUFDL0QsTUFBTTtJQUVOLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFBO0lBQ3hDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFBO0lBRXhDLEtBQUssTUFBTSxJQUFJLElBQUksVUFBVSxFQUFFO1FBQzdCLE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUVsQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQTtLQUMvQjtJQUVELENBQUMsU0FBUyxrQkFBa0IsQ0FBRSxVQUFlO1FBQzNDLElBQUksVUFBVSxFQUFFO1lBQ2QsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUU7Z0JBQzVCLE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDakMsSUFBSSxTQUFTLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsRUFBRTtvQkFDdkUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsU0FBdUIsQ0FBQyxDQUFBO2lCQUM1QzthQUNGO1lBQ0QsT0FBTyxJQUFJLENBQUE7U0FDWjtRQUNELE9BQU8sS0FBSyxDQUFBO0lBQ2QsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUE7SUFFZCw0Q0FBNEM7SUFDNUMseUNBQXlDO0lBQ3pDLGtFQUFrRTtJQUNsRSxJQUFJLEdBQUcsQ0FBQyxtQkFBbUI7UUFBRSxPQUFNO0lBQ25DLEdBQUcsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUE7SUFFOUIsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUNSLFFBQVEsRUFBRTtZQUNSLEdBQUcsaUJBQWlCLENBQUMsUUFBUTtTQUM5QjtRQUNELFlBQVk7WUFDVixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBZSxDQUFBO1lBRXBDLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtnQkFDbkIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtnQkFDNUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7YUFDM0U7UUFDSCxDQUFDO1FBQ0QsV0FBVztZQUNULGFBQWE7WUFDYixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsc0JBQXNCLENBQUMsRUFBRTtnQkFDdEYsYUFBYTtnQkFDYixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUE7Z0JBQ2hDLGFBQWE7Z0JBQ2IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO2FBQ3RDO1FBQ0gsQ0FBQztRQUNELE9BQU87WUFDTCxhQUFhO1lBQ2IsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRTtnQkFDdEQsYUFBYTtnQkFDYixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7Z0JBQ2pDLGFBQWE7Z0JBQ2IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUE7YUFDbEM7UUFDSCxDQUFDO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsR0FBRyxpQkFBaUIsQ0FBQyxPQUFPO1NBQzdCO0tBQ0YsQ0FBQyxDQUFBO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUFwcCwgcmVhY3RpdmUgfSBmcm9tICd2dWUnXG5pbXBvcnQgeyBWdWV0aWZ5VXNlT3B0aW9ucyB9IGZyb20gJ3Z1ZXRpZnkvdHlwZXMnXG5pbXBvcnQgeyBjb25zb2xlRXJyb3IgfSBmcm9tICcuL3V0aWwvY29uc29sZSdcbmltcG9ydCB7IGxlZ2FjeUV2ZW50c01peGluIH0gZnJvbSAnLi91dGlsL2xlZ2FjeUV2ZW50c01peGluJ1xuXG5leHBvcnQgZnVuY3Rpb24gaW5zdGFsbCAoVnVlOiBSZXR1cm5UeXBlPHR5cGVvZiBjcmVhdGVBcHA+LCBhcmdzOiBWdWV0aWZ5VXNlT3B0aW9ucyA9IHt9KSB7XG4gIC8vIGlmICgoaW5zdGFsbCBhcyBhbnkpLmluc3RhbGxlZCkgcmV0dXJuXG4gIC8vIChpbnN0YWxsIGFzIGFueSkuaW5zdGFsbGVkID0gdHJ1ZVxuXG4gIC8vICAgaWYgKE91clZ1ZSAhPT0gVnVlKSB7XG4gIC8vICAgICBjb25zb2xlRXJyb3IoYE11bHRpcGxlIGluc3RhbmNlcyBvZiBWdWUgZGV0ZWN0ZWRcbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS92dWV0aWZ5anMvdnVldGlmeS9pc3N1ZXMvNDA2OFxuXG4gIC8vIElmIHlvdSdyZSBzZWVpbmcgXCIkYXR0cnMgaXMgcmVhZG9ubHlcIiwgaXQncyBjYXVzZWQgYnkgdGhpc2ApXG4gIC8vICAgfVxuXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBhcmdzLmNvbXBvbmVudHMgfHwge31cbiAgY29uc3QgZGlyZWN0aXZlcyA9IGFyZ3MuZGlyZWN0aXZlcyB8fCB7fVxuXG4gIGZvciAoY29uc3QgbmFtZSBpbiBkaXJlY3RpdmVzKSB7XG4gICAgY29uc3QgZGlyZWN0aXZlID0gZGlyZWN0aXZlc1tuYW1lXVxuXG4gICAgVnVlLmRpcmVjdGl2ZShuYW1lLCBkaXJlY3RpdmUpXG4gIH1cblxuICAoZnVuY3Rpb24gcmVnaXN0ZXJDb21wb25lbnRzIChjb21wb25lbnRzOiBhbnkpIHtcbiAgICBpZiAoY29tcG9uZW50cykge1xuICAgICAgZm9yIChjb25zdCBrZXkgaW4gY29tcG9uZW50cykge1xuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzW2tleV1cbiAgICAgICAgaWYgKGNvbXBvbmVudCAmJiAhcmVnaXN0ZXJDb21wb25lbnRzKGNvbXBvbmVudC4kX3Z1ZXRpZnlfc3ViY29tcG9uZW50cykpIHtcbiAgICAgICAgICBWdWUuY29tcG9uZW50KGtleSwgY29tcG9uZW50IGFzIHR5cGVvZiBWdWUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9KShjb21wb25lbnRzKVxuXG4gIC8vIFVzZWQgdG8gYXZvaWQgbXVsdGlwbGUgbWl4aW5zIGJlaW5nIHNldHVwXG4gIC8vIHdoZW4gaW4gZGV2IG1vZGUgYW5kIGhvdCBtb2R1bGUgcmVsb2FkXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92dWVqcy92dWUvaXNzdWVzLzUwODkjaXNzdWVjb21tZW50LTI4NDI2MDExMVxuICBpZiAoVnVlLiRfdnVldGlmeV9pbnN0YWxsZWQpIHJldHVyblxuICBWdWUuJF92dWV0aWZ5X2luc3RhbGxlZCA9IHRydWVcblxuICBWdWUubWl4aW4oe1xuICAgIGNvbXB1dGVkOiB7XG4gICAgICAuLi5sZWdhY3lFdmVudHNNaXhpbi5jb21wdXRlZCxcbiAgICB9LFxuICAgIGJlZm9yZUNyZWF0ZSAoKSB7XG4gICAgICBjb25zdCBvcHRpb25zID0gdGhpcy4kb3B0aW9ucyBhcyBhbnlcblxuICAgICAgaWYgKG9wdGlvbnMudnVldGlmeSkge1xuICAgICAgICBvcHRpb25zLnZ1ZXRpZnkuaW5pdCh0aGlzLCB0aGlzLiRzc3JDb250ZXh0KVxuICAgICAgICBWdWUuY29uZmlnLmdsb2JhbFByb3BlcnRpZXMuJHZ1ZXRpZnkgPSByZWFjdGl2ZShvcHRpb25zLnZ1ZXRpZnkuZnJhbWV3b3JrKVxuICAgICAgfVxuICAgIH0sXG4gICAgYmVmb3JlTW91bnQgKCkge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgaWYgKHRoaXMuJG9wdGlvbnMudnVldGlmeSAmJiB0aGlzLiRlbCAmJiB0aGlzLiRlbC5oYXNBdHRyaWJ1dGUoJ2RhdGEtc2VydmVyLXJlbmRlcmVkJykpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB0aGlzLiR2dWV0aWZ5LmlzSHlkcmF0aW5nID0gdHJ1ZVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHRoaXMuJHZ1ZXRpZnkuYnJlYWtwb2ludC51cGRhdGUodHJ1ZSlcbiAgICAgIH1cbiAgICB9LFxuICAgIG1vdW50ZWQgKCkge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgaWYgKHRoaXMuJG9wdGlvbnMudnVldGlmeSAmJiB0aGlzLiR2dWV0aWZ5LmlzSHlkcmF0aW5nKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpcy4kdnVldGlmeS5pc0h5ZHJhdGluZyA9IGZhbHNlXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpcy4kdnVldGlmeS5icmVha3BvaW50LnVwZGF0ZSgpXG4gICAgICB9XG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICAuLi5sZWdhY3lFdmVudHNNaXhpbi5tZXRob2RzLFxuICAgIH0sXG4gIH0pXG59XG4iXX0=