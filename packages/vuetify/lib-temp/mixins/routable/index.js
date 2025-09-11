import { defineComponent, resolveComponent } from 'vue';
// Directives
import Ripple from '../../directives/ripple';
// Utilities
import { getObjectValueByPath } from '../../util/helpers';
export default defineComponent({
    name: 'routable',
    directives: {
        Ripple,
    },
    props: {
        activeClass: String,
        append: Boolean,
        disabled: Boolean,
        exact: {
            type: Boolean,
            default: undefined,
        },
        exactPath: Boolean,
        exactActiveClass: String,
        link: Boolean,
        href: [String, Object],
        to: [String, Object],
        nuxt: Boolean,
        replace: Boolean,
        ripple: {
            type: [Boolean, Object],
            default: null,
        },
        tag: String,
        target: String,
        notALink: Boolean
    },
    data: () => ({
        isActive: false,
        proxyClass: '',
    }),
    computed: {
        classes() {
            const classes = {};
            if (this.to)
                return classes;
            const activeClass = this.activeClass || ('$activeClass' in this ? this.$activeClass : undefined);
            // const activeClass = this.activeClass || this.$activeClass
            if (activeClass)
                classes[activeClass] = this.isActive;
            if (this.proxyClass)
                classes[this.proxyClass] = this.isActive;
            return classes;
        },
        computedRipple() {
            var _a;
            return (_a = this.ripple) !== null && _a !== void 0 ? _a : (!this.disabled && this.isClickable);
        },
        isClickable() {
            var _a;
            if (this.notALink)
                return false;
            if (this.disabled)
                return false;
            return Boolean(this.isLink ||
                this.$attrs.onClick ||
                this.$attrs["on!click"] ||
                this.$attrs.tabindex ||
                ((_a = this.$props) === null || _a === void 0 ? void 0 : _a.onClick));
        },
        isLink() {
            return this.to || this.href || this.link;
        },
        styles: () => ({}),
    },
    watch: {
        $route: 'onRouteChange',
    },
    mounted() {
        this.onRouteChange();
    },
    methods: {
        generateRouteLink() {
            let exact = this.exact;
            let tag;
            const directives = [[
                    Ripple,
                    this.computedRipple,
                ]];
            const data = {
                tabindex: 'tabindex' in this.$attrs ? this.$attrs.tabindex : undefined,
                class: this.classes,
                style: this.styles,
                ...this.$listeners,
                ...('click' in this ? { onClick: this.click } : undefined),
                ref: 'link'
            };
            if (typeof this.exact === 'undefined') {
                exact = this.to === '/' ||
                    (this.to === Object(this.to) && this.to.path === '/');
            }
            if (this.to) {
                // Add a special activeClass hook
                // for component level styles
                let activeClass = this.activeClass;
                let exactActiveClass = this.exactActiveClass || activeClass;
                if (this.proxyClass) {
                    activeClass = `${activeClass} ${this.proxyClass}`.trim();
                    exactActiveClass = `${exactActiveClass} ${this.proxyClass}`.trim();
                }
                tag = resolveComponent(this.nuxt ? 'nuxt-link' : 'router-link');
                Object.assign(data, {
                    to: this.to,
                    exact,
                    exactPath: this.exactPath,
                    activeClass,
                    exactActiveClass,
                    append: this.append,
                    replace: this.replace,
                });
            }
            else {
                tag = (this.href && 'a') || this.tag || 'div';
                if (tag === 'a' && this.href)
                    data.href = this.href;
            }
            if (this.target)
                data.target = this.target;
            return { tag, data, directives };
        },
        onRouteChange() {
            if (!this.to || !this.$refs.link || !this.$route)
                return;
            const activeClass = `${this.activeClass || ''} ${this.proxyClass || ''}`.trim();
            const exactActiveClass = `${this.exactActiveClass || ''} ${this.proxyClass || ''}`.trim() || activeClass;
            const path = '_vnode.data.class.' + (this.exact ? exactActiveClass : activeClass);
            this.$nextTick(() => {
                /* istanbul ignore else */
                if (!getObjectValueByPath(this.$refs.link, path) === this.isActive) {
                    this.toggle();
                }
            });
        },
        toggle() {
            this.isActive = !this.isActive;
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3JvdXRhYmxlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBdUIsZUFBZSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sS0FBSyxDQUFBO0FBRTVFLGFBQWE7QUFDYixPQUFPLE1BQXlCLE1BQU0seUJBQXlCLENBQUE7QUFFL0QsWUFBWTtBQUNaLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRXpELGVBQWUsZUFBZSxDQUFDO0lBQzdCLElBQUksRUFBRSxVQUFVO0lBRWhCLFVBQVUsRUFBRTtRQUNWLE1BQU07S0FDUDtJQUVELEtBQUssRUFBRTtRQUNMLFdBQVcsRUFBRSxNQUFNO1FBQ25CLE1BQU0sRUFBRSxPQUFPO1FBQ2YsUUFBUSxFQUFFLE9BQU87UUFDakIsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLE9BQXdDO1lBQzlDLE9BQU8sRUFBRSxTQUFTO1NBQ25CO1FBQ0QsU0FBUyxFQUFFLE9BQU87UUFDbEIsZ0JBQWdCLEVBQUUsTUFBTTtRQUN4QixJQUFJLEVBQUUsT0FBTztRQUNiLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7UUFDdEIsRUFBRSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztRQUNwQixJQUFJLEVBQUUsT0FBTztRQUNiLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7WUFDdkIsT0FBTyxFQUFFLElBQUk7U0FDZDtRQUNELEdBQUcsRUFBRSxNQUFNO1FBQ1gsTUFBTSxFQUFFLE1BQU07UUFDZCxRQUFRLEVBQUUsT0FBTztLQUNsQjtJQUVELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsUUFBUSxFQUFFLEtBQUs7UUFDZixVQUFVLEVBQUUsRUFBRTtLQUNm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QUFJLENBQUMsTUFBTSxDQUFBO1lBRTFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFBO1FBQ2xDLENBQUM7UUFDRCxhQUFhO1lBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNO2dCQUFFLE9BQU07WUFDeEQsTUFBTSxXQUFXLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFBO1lBQy9FLE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksV0FBVyxDQUFBO1lBRXhHLE1BQU0sSUFBSSxHQUFHLG9CQUFvQixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1lBRWpGLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO2dCQUNsQiwwQkFBMEI7Z0JBQzFCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUNsRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7aUJBQ2Q7WUFDSCxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFDRCxNQUFNO1lBQ0osSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUE7UUFDaEMsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVk5vZGVEYXRhLCBQcm9wVHlwZSwgZGVmaW5lQ29tcG9uZW50LCByZXNvbHZlQ29tcG9uZW50IH0gZnJvbSAndnVlJ1xuXG4vLyBEaXJlY3RpdmVzXG5pbXBvcnQgUmlwcGxlLCB7IFJpcHBsZU9wdGlvbnMgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3JpcHBsZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBnZXRPYmplY3RWYWx1ZUJ5UGF0aCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29tcG9uZW50KHtcbiAgbmFtZTogJ3JvdXRhYmxlJyxcblxuICBkaXJlY3RpdmVzOiB7XG4gICAgUmlwcGxlLFxuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgYWN0aXZlQ2xhc3M6IFN0cmluZyxcbiAgICBhcHBlbmQ6IEJvb2xlYW4sXG4gICAgZGlzYWJsZWQ6IEJvb2xlYW4sXG4gICAgZXhhY3Q6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4gYXMgUHJvcFR5cGU8Ym9vbGVhbiB8IHVuZGVmaW5lZD4sXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgfSxcbiAgICBleGFjdFBhdGg6IEJvb2xlYW4sXG4gICAgZXhhY3RBY3RpdmVDbGFzczogU3RyaW5nLFxuICAgIGxpbms6IEJvb2xlYW4sXG4gICAgaHJlZjogW1N0cmluZywgT2JqZWN0XSxcbiAgICB0bzogW1N0cmluZywgT2JqZWN0XSxcbiAgICBudXh0OiBCb29sZWFuLFxuICAgIHJlcGxhY2U6IEJvb2xlYW4sXG4gICAgcmlwcGxlOiB7XG4gICAgICB0eXBlOiBbQm9vbGVhbiwgT2JqZWN0XSxcbiAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgfSxcbiAgICB0YWc6IFN0cmluZyxcbiAgICB0YXJnZXQ6IFN0cmluZyxcbiAgICBub3RBTGluazogQm9vbGVhblxuICB9LFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgaXNBY3RpdmU6IGZhbHNlLFxuICAgIHByb3h5Q2xhc3M6ICcnLFxuICB9KSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICBjb25zdCBjbGFzc2VzOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiA9IHt9XG5cbiAgICAgIGlmICh0aGlzLnRvKSByZXR1cm4gY2xhc3Nlc1xuXG4gICAgICBjb25zdCBhY3RpdmVDbGFzcyA9IHRoaXMuYWN0aXZlQ2xhc3MgfHwgKCckYWN0aXZlQ2xhc3MnIGluIHRoaXMgPyB0aGlzLiRhY3RpdmVDbGFzcyA6IHVuZGVmaW5lZClcbiAgICAgIC8vIGNvbnN0IGFjdGl2ZUNsYXNzID0gdGhpcy5hY3RpdmVDbGFzcyB8fCB0aGlzLiRhY3RpdmVDbGFzc1xuXG4gICAgICBpZiAoYWN0aXZlQ2xhc3MpIGNsYXNzZXNbYWN0aXZlQ2xhc3NdID0gdGhpcy5pc0FjdGl2ZVxuICAgICAgaWYgKHRoaXMucHJveHlDbGFzcykgY2xhc3Nlc1t0aGlzLnByb3h5Q2xhc3NdID0gdGhpcy5pc0FjdGl2ZVxuXG4gICAgICByZXR1cm4gY2xhc3Nlc1xuICAgIH0sXG4gICAgY29tcHV0ZWRSaXBwbGUgKCk6IFJpcHBsZU9wdGlvbnMgfCBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLnJpcHBsZSA/PyAoIXRoaXMuZGlzYWJsZWQgJiYgdGhpcy5pc0NsaWNrYWJsZSlcbiAgICB9LFxuICAgIGlzQ2xpY2thYmxlICgpOiBib29sZWFuIHtcbiAgICAgIGlmKHRoaXMubm90QUxpbmspIHJldHVybiBmYWxzZVxuXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuIGZhbHNlXG5cbiAgICAgIHJldHVybiBCb29sZWFuKFxuICAgICAgICB0aGlzLmlzTGluayB8fFxuICAgICAgICB0aGlzLiRhdHRycy5vbkNsaWNrIHx8XG4gICAgICAgIHRoaXMuJGF0dHJzW1wib24hY2xpY2tcIl0gfHxcbiAgICAgICAgdGhpcy4kYXR0cnMudGFiaW5kZXggfHxcbiAgICAgICAgdGhpcy4kcHJvcHM/Lm9uQ2xpY2tcbiAgICAgICk7XG4gICAgfSxcbiAgICBpc0xpbmsgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMudG8gfHwgdGhpcy5ocmVmIHx8IHRoaXMubGlua1xuICAgIH0sXG4gICAgc3R5bGVzOiAoKSA9PiAoe30pLFxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgJHJvdXRlOiAnb25Sb3V0ZUNoYW5nZScsXG4gIH0sXG5cbiAgbW91bnRlZCAoKSB7XG4gICAgdGhpcy5vblJvdXRlQ2hhbmdlKClcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2VuZXJhdGVSb3V0ZUxpbmsgKCkge1xuICAgICAgbGV0IGV4YWN0ID0gdGhpcy5leGFjdFxuICAgICAgbGV0IHRhZ1xuXG4gICAgICBjb25zdCBkaXJlY3RpdmVzID0gW1tcbiAgICAgICAgUmlwcGxlLFxuICAgICAgICB0aGlzLmNvbXB1dGVkUmlwcGxlLFxuICAgICAgXV1cblxuICAgICAgY29uc3QgZGF0YTogVk5vZGVEYXRhID0ge1xuICAgICAgICB0YWJpbmRleDogJ3RhYmluZGV4JyBpbiB0aGlzLiRhdHRycyA/IHRoaXMuJGF0dHJzLnRhYmluZGV4IDogdW5kZWZpbmVkLFxuICAgICAgICBjbGFzczogdGhpcy5jbGFzc2VzLFxuICAgICAgICBzdHlsZTogdGhpcy5zdHlsZXMsXG4gICAgICAgIC4uLnRoaXMuJGxpc3RlbmVycyxcbiAgICAgICAgLi4uKCdjbGljaycgaW4gdGhpcyA/IHsgb25DbGljazogKHRoaXMgYXMgYW55KS5jbGljayB9IDogdW5kZWZpbmVkKSwgLy8gIzE0NDQ3XG4gICAgICAgIHJlZjogJ2xpbmsnXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5leGFjdCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZXhhY3QgPSB0aGlzLnRvID09PSAnLycgfHxcbiAgICAgICAgICAodGhpcy50byA9PT0gT2JqZWN0KHRoaXMudG8pICYmIHRoaXMudG8ucGF0aCA9PT0gJy8nKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy50bykge1xuICAgICAgICAvLyBBZGQgYSBzcGVjaWFsIGFjdGl2ZUNsYXNzIGhvb2tcbiAgICAgICAgLy8gZm9yIGNvbXBvbmVudCBsZXZlbCBzdHlsZXNcbiAgICAgICAgbGV0IGFjdGl2ZUNsYXNzID0gdGhpcy5hY3RpdmVDbGFzc1xuICAgICAgICBsZXQgZXhhY3RBY3RpdmVDbGFzcyA9IHRoaXMuZXhhY3RBY3RpdmVDbGFzcyB8fCBhY3RpdmVDbGFzc1xuXG4gICAgICAgIGlmICh0aGlzLnByb3h5Q2xhc3MpIHtcbiAgICAgICAgICBhY3RpdmVDbGFzcyA9IGAke2FjdGl2ZUNsYXNzfSAke3RoaXMucHJveHlDbGFzc31gLnRyaW0oKVxuICAgICAgICAgIGV4YWN0QWN0aXZlQ2xhc3MgPSBgJHtleGFjdEFjdGl2ZUNsYXNzfSAke3RoaXMucHJveHlDbGFzc31gLnRyaW0oKVxuICAgICAgICB9XG5cbiAgICAgICAgdGFnID0gcmVzb2x2ZUNvbXBvbmVudCh0aGlzLm51eHQgPyAnbnV4dC1saW5rJyA6ICdyb3V0ZXItbGluaycpXG4gICAgICAgIE9iamVjdC5hc3NpZ24oZGF0YSwge1xuICAgICAgICAgIHRvOiB0aGlzLnRvLFxuICAgICAgICAgIGV4YWN0LFxuICAgICAgICAgIGV4YWN0UGF0aDogdGhpcy5leGFjdFBhdGgsXG4gICAgICAgICAgYWN0aXZlQ2xhc3MsXG4gICAgICAgICAgZXhhY3RBY3RpdmVDbGFzcyxcbiAgICAgICAgICBhcHBlbmQ6IHRoaXMuYXBwZW5kLFxuICAgICAgICAgIHJlcGxhY2U6IHRoaXMucmVwbGFjZSxcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhZyA9ICh0aGlzLmhyZWYgJiYgJ2EnKSB8fCB0aGlzLnRhZyB8fCAnZGl2J1xuXG4gICAgICAgIGlmICh0YWcgPT09ICdhJyAmJiB0aGlzLmhyZWYpIGRhdGEuaHJlZiA9IHRoaXMuaHJlZlxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy50YXJnZXQpIGRhdGEudGFyZ2V0ID0gdGhpcy50YXJnZXRcblxuICAgICAgcmV0dXJuIHsgdGFnLCBkYXRhLCBkaXJlY3RpdmVzIH1cbiAgICB9LFxuICAgIG9uUm91dGVDaGFuZ2UgKCkge1xuICAgICAgaWYgKCF0aGlzLnRvIHx8ICF0aGlzLiRyZWZzLmxpbmsgfHwgIXRoaXMuJHJvdXRlKSByZXR1cm5cbiAgICAgIGNvbnN0IGFjdGl2ZUNsYXNzID0gYCR7dGhpcy5hY3RpdmVDbGFzcyB8fCAnJ30gJHt0aGlzLnByb3h5Q2xhc3MgfHwgJyd9YC50cmltKClcbiAgICAgIGNvbnN0IGV4YWN0QWN0aXZlQ2xhc3MgPSBgJHt0aGlzLmV4YWN0QWN0aXZlQ2xhc3MgfHwgJyd9ICR7dGhpcy5wcm94eUNsYXNzIHx8ICcnfWAudHJpbSgpIHx8IGFjdGl2ZUNsYXNzXG5cbiAgICAgIGNvbnN0IHBhdGggPSAnX3Zub2RlLmRhdGEuY2xhc3MuJyArICh0aGlzLmV4YWN0ID8gZXhhY3RBY3RpdmVDbGFzcyA6IGFjdGl2ZUNsYXNzKVxuXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgIGlmICghZ2V0T2JqZWN0VmFsdWVCeVBhdGgodGhpcy4kcmVmcy5saW5rLCBwYXRoKSA9PT0gdGhpcy5pc0FjdGl2ZSkge1xuICAgICAgICAgIHRoaXMudG9nZ2xlKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LFxuICAgIHRvZ2dsZSAoKSB7XG4gICAgICB0aGlzLmlzQWN0aXZlID0gIXRoaXMuaXNBY3RpdmVcbiAgICB9LFxuICB9LFxufSlcbiJdfQ==