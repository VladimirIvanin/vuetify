// Mixins
import { inject as RegistrableInject } from '../registrable';
export function factory(namespace, child, parent) {
    return {
        name: 'groupable',
        extends: RegistrableInject(namespace, child, parent),
        props: {
            activeClass: {
                type: String,
            },
            disabled: Boolean,
        },
        data() {
            return {
                isActive: false,
            };
        },
        computed: {
            $activeClass() {
                if (this.activeClass)
                    return this.activeClass;
                if (!this[namespace])
                    return undefined;
                return this[namespace].activeClass;
            },
            groupClasses() {
                if (!this.$activeClass)
                    return {};
                return {
                    [this.$activeClass]: this.isActive,
                };
            },
        },
        created() {
            this[namespace] && this[namespace].register(this);
        },
        beforeUnmount() {
            this[namespace] && this[namespace].unregister(this);
        },
        methods: {
            toggle(e) {
                if (this.disabled && e) {
                    // Prevent keyboard actions
                    // from children elements
                    // within disabled tabs
                    e.preventDefault();
                    return;
                }
                this.$emit('change');
                this.$emitLegacy('change');
            },
        },
    };
}
/* eslint-disable-next-line @typescript-eslint/no-redeclare */
const Groupable = factory('itemGroup');
export default Groupable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2dyb3VwYWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxFQUFlLE1BQU0sSUFBSSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBZXpFLE1BQU0sVUFBVSxPQUFPLENBQ3JCLFNBQVksRUFDWixLQUFjLEVBQ2QsTUFBZTtJQUVmLE9BQU87UUFDTCxJQUFJLEVBQUUsV0FBVztRQUVqQixPQUFPLEVBQUUsaUJBQWlCLENBQU8sU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUM7UUFDMUQsS0FBSyxFQUFFO1lBQ0wsV0FBVyxFQUFFO2dCQUNYLElBQUksRUFBRSxNQUFNO2FBQ21CO1lBQ2pDLFFBQVEsRUFBRSxPQUFPO1NBQ2xCO1FBRUQsSUFBSTtZQUNGLE9BQU87Z0JBQ0wsUUFBUSxFQUFFLEtBQUs7YUFDaEIsQ0FBQTtRQUNILENBQUM7UUFFRCxRQUFRLEVBQUU7WUFDUixZQUFZO2dCQUNWLElBQUcsSUFBSSxDQUFDLFdBQVc7b0JBQUUsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFBO2dCQUU1QyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztvQkFBRSxPQUFPLFNBQVMsQ0FBQTtnQkFFdEMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFBO1lBQ3BDLENBQUM7WUFDRCxZQUFZO2dCQUNWLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWTtvQkFBRSxPQUFPLEVBQUUsQ0FBQTtnQkFFakMsT0FBTztvQkFDTCxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUTtpQkFDbkMsQ0FBQTtZQUNILENBQUM7U0FDRjtRQUVELE9BQU87WUFDTCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUssSUFBSSxDQUFDLFNBQVMsQ0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUM1RCxDQUFDO1FBRUQsYUFBYTtZQUNYLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSyxJQUFJLENBQUMsU0FBUyxDQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzlELENBQUM7UUFFRCxPQUFPLEVBQUU7WUFDUCxNQUFNLENBQUUsQ0FBUztnQkFDZixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxFQUFFO29CQUN0QiwyQkFBMkI7b0JBQzNCLHlCQUF5QjtvQkFDekIsdUJBQXVCO29CQUN2QixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUE7b0JBQ2xCLE9BQU07aUJBQ1A7Z0JBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQTtnQkFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUM1QixDQUFDO1NBQ0Y7S0FDRixDQUFBO0FBQ0gsQ0FBQztBQUVELDhEQUE4RDtBQUM5RCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7QUFFdEMsZUFBZSxTQUFTLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBNaXhpbnNcbmltcG9ydCB7IFJlZ2lzdHJhYmxlLCBpbmplY3QgYXMgUmVnaXN0cmFibGVJbmplY3QgfSBmcm9tICcuLi9yZWdpc3RyYWJsZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBFeHRyYWN0VnVlIH0gZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgeyBWdWVDb25zdHJ1Y3RvciB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7IFByb3BWYWxpZGF0b3IgfSBmcm9tICd2dWUvdHlwZXMvb3B0aW9ucydcblxuZXhwb3J0IHR5cGUgR3JvdXBhYmxlPFQgZXh0ZW5kcyBzdHJpbmcsIEMgZXh0ZW5kcyBWdWVDb25zdHJ1Y3RvciB8IG51bGwgPSBudWxsPiA9IFZ1ZUNvbnN0cnVjdG9yPEV4dHJhY3RWdWU8UmVnaXN0cmFibGU8VCwgQz4+ICYge1xuICBhY3RpdmVDbGFzczogc3RyaW5nXG4gIGlzQWN0aXZlOiBib29sZWFuXG4gIGRpc2FibGVkOiBib29sZWFuXG4gIGdyb3VwQ2xhc3Nlczogb2JqZWN0XG4gIHRvZ2dsZSAoZT86IEV2ZW50KTogdm9pZFxufT5cblxuZXhwb3J0IGZ1bmN0aW9uIGZhY3Rvcnk8VCBleHRlbmRzIHN0cmluZywgQyBleHRlbmRzIFZ1ZUNvbnN0cnVjdG9yIHwgbnVsbCA9IG51bGw+IChcbiAgbmFtZXNwYWNlOiBULFxuICBjaGlsZD86IHN0cmluZyxcbiAgcGFyZW50Pzogc3RyaW5nXG4pOiBHcm91cGFibGU8VCwgQz4ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdncm91cGFibGUnLFxuXG4gICAgZXh0ZW5kczogUmVnaXN0cmFibGVJbmplY3Q8VCwgQz4obmFtZXNwYWNlLCBjaGlsZCwgcGFyZW50KSxcbiAgICBwcm9wczoge1xuICAgICAgYWN0aXZlQ2xhc3M6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgfSBhcyBhbnkgYXMgUHJvcFZhbGlkYXRvcjxzdHJpbmc+LFxuICAgICAgZGlzYWJsZWQ6IEJvb2xlYW4sXG4gICAgfSxcblxuICAgIGRhdGEgKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNBY3RpdmU6IGZhbHNlLFxuICAgICAgfVxuICAgIH0sXG5cbiAgICBjb21wdXRlZDoge1xuICAgICAgJGFjdGl2ZUNsYXNzKCkge1xuICAgICAgICBpZih0aGlzLmFjdGl2ZUNsYXNzKSByZXR1cm4gdGhpcy5hY3RpdmVDbGFzc1xuXG4gICAgICAgIGlmICghdGhpc1tuYW1lc3BhY2VdKSByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgICAgcmV0dXJuIHRoaXNbbmFtZXNwYWNlXS5hY3RpdmVDbGFzc1xuICAgICAgfSxcbiAgICAgIGdyb3VwQ2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgICAgaWYgKCF0aGlzLiRhY3RpdmVDbGFzcykgcmV0dXJuIHt9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBbdGhpcy4kYWN0aXZlQ2xhc3NdOiB0aGlzLmlzQWN0aXZlLFxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0sXG5cbiAgICBjcmVhdGVkICgpIHtcbiAgICAgIHRoaXNbbmFtZXNwYWNlXSAmJiAodGhpc1tuYW1lc3BhY2VdIGFzIGFueSkucmVnaXN0ZXIodGhpcylcbiAgICB9LFxuXG4gICAgYmVmb3JlVW5tb3VudCAoKSB7XG4gICAgICB0aGlzW25hbWVzcGFjZV0gJiYgKHRoaXNbbmFtZXNwYWNlXSBhcyBhbnkpLnVucmVnaXN0ZXIodGhpcylcbiAgICB9LFxuXG4gICAgbWV0aG9kczoge1xuICAgICAgdG9nZ2xlIChlPzogRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgJiYgZSkge1xuICAgICAgICAgIC8vIFByZXZlbnQga2V5Ym9hcmQgYWN0aW9uc1xuICAgICAgICAgIC8vIGZyb20gY2hpbGRyZW4gZWxlbWVudHNcbiAgICAgICAgICAvLyB3aXRoaW4gZGlzYWJsZWQgdGFic1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHRoaXMuJGVtaXQoJ2NoYW5nZScpXG4gICAgICAgIHRoaXMuJGVtaXRMZWdhY3koJ2NoYW5nZScpXG4gICAgICB9LFxuICAgIH0sXG4gIH1cbn1cblxuLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZWRlY2xhcmUgKi9cbmNvbnN0IEdyb3VwYWJsZSA9IGZhY3RvcnkoJ2l0ZW1Hcm91cCcpXG5cbmV4cG9ydCBkZWZhdWx0IEdyb3VwYWJsZVxuIl19