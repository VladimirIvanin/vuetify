import { defineComponent } from 'vue';
import { consoleWarn } from '../../util/console';
function generateWarning(child, parent) {
    return () => consoleWarn(`The ${child} component must be used inside a ${parent}`);
}
export function inject(namespace, child, parent) {
    const defaultImpl = child && parent ? {
        register: generateWarning(child, parent),
        unregister: generateWarning(child, parent),
    } : null;
    return defineComponent({
        name: 'registrable-inject',
        inject: {
            [namespace]: {
                default: defaultImpl,
            },
        },
    });
}
export function provide(namespace, self = false) {
    return defineComponent({
        name: 'registrable-provide',
        provide() {
            return {
                [namespace]: self ? this : {
                    register: this.register,
                    unregister: this.unregister,
                },
            };
        },
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3JlZ2lzdHJhYmxlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxLQUFLLENBQUE7QUFFbkMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRWhELFNBQVMsZUFBZSxDQUFFLEtBQWEsRUFBRSxNQUFjO0lBQ3JELE9BQU8sR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLE9BQU8sS0FBSyxvQ0FBb0MsTUFBTSxFQUFFLENBQUMsQ0FBQTtBQUNwRixDQUFDO0FBU0QsTUFBTSxVQUFVLE1BQU0sQ0FFbkIsU0FBWSxFQUFFLEtBQWMsRUFBRSxNQUFlO0lBQzlDLE1BQU0sV0FBVyxHQUFHLEtBQUssSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLFFBQVEsRUFBRSxlQUFlLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztRQUN4QyxVQUFVLEVBQUUsZUFBZSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUM7S0FDM0MsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO0lBRVIsT0FBTyxlQUFlLENBQUM7UUFDckIsSUFBSSxFQUFFLG9CQUFvQjtRQUUxQixNQUFNLEVBQUU7WUFDTixDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUNYLE9BQU8sRUFBRSxXQUFXO2FBQ3JCO1NBQ0Y7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDO0FBRUQsTUFBTSxVQUFVLE9BQU8sQ0FBRSxTQUFpQixFQUFFLElBQUksR0FBRyxLQUFLO0lBQ3RELE9BQU8sZUFBZSxDQUFDO1FBQ3JCLElBQUksRUFBRSxxQkFBcUI7UUFFM0IsT0FBTztZQUNMLE9BQU87Z0JBQ0wsQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLFFBQVEsRUFBRyxJQUFZLENBQUMsUUFBUTtvQkFDaEMsVUFBVSxFQUFHLElBQVksQ0FBQyxVQUFVO2lCQUNyQzthQUNGLENBQUE7UUFDSCxDQUFDO0tBQ0YsQ0FBQyxDQUFBO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZGVmaW5lQ29tcG9uZW50fSBmcm9tICd2dWUnXG5pbXBvcnQgeyBWdWVDb25zdHJ1Y3RvciB9IGZyb20gJ3Z1ZS90eXBlcy92dWUnXG5pbXBvcnQgeyBjb25zb2xlV2FybiB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcblxuZnVuY3Rpb24gZ2VuZXJhdGVXYXJuaW5nIChjaGlsZDogc3RyaW5nLCBwYXJlbnQ6IHN0cmluZykge1xuICByZXR1cm4gKCkgPT4gY29uc29sZVdhcm4oYFRoZSAke2NoaWxkfSBjb21wb25lbnQgbXVzdCBiZSB1c2VkIGluc2lkZSBhICR7cGFyZW50fWApXG59XG5cbmV4cG9ydCB0eXBlIFJlZ2lzdHJhYmxlPFQgZXh0ZW5kcyBzdHJpbmcsIEMgZXh0ZW5kcyBWdWVDb25zdHJ1Y3RvciB8IG51bGwgPSBudWxsPiA9IFZ1ZUNvbnN0cnVjdG9yPFZ1ZSAmIHtcbiAgW0sgaW4gVF06IEMgZXh0ZW5kcyBWdWVDb25zdHJ1Y3RvciA/IEluc3RhbmNlVHlwZTxDPiA6IHtcbiAgICByZWdpc3RlciAoLi4ucHJvcHM6IGFueVtdKTogdm9pZFxuICAgIHVucmVnaXN0ZXIgKHNlbGY6IGFueSk6IHZvaWRcbiAgfVxufT5cblxuZXhwb3J0IGZ1bmN0aW9uIGluamVjdDxcbiAgVCBleHRlbmRzIHN0cmluZywgQyBleHRlbmRzIFZ1ZUNvbnN0cnVjdG9yIHwgbnVsbCA9IG51bGxcbj4gKG5hbWVzcGFjZTogVCwgY2hpbGQ/OiBzdHJpbmcsIHBhcmVudD86IHN0cmluZyk6IFJlZ2lzdHJhYmxlPFQsIEM+IHtcbiAgY29uc3QgZGVmYXVsdEltcGwgPSBjaGlsZCAmJiBwYXJlbnQgPyB7XG4gICAgcmVnaXN0ZXI6IGdlbmVyYXRlV2FybmluZyhjaGlsZCwgcGFyZW50KSxcbiAgICB1bnJlZ2lzdGVyOiBnZW5lcmF0ZVdhcm5pbmcoY2hpbGQsIHBhcmVudCksXG4gIH0gOiBudWxsXG5cbiAgcmV0dXJuIGRlZmluZUNvbXBvbmVudCh7XG4gICAgbmFtZTogJ3JlZ2lzdHJhYmxlLWluamVjdCcsXG5cbiAgICBpbmplY3Q6IHtcbiAgICAgIFtuYW1lc3BhY2VdOiB7XG4gICAgICAgIGRlZmF1bHQ6IGRlZmF1bHRJbXBsLFxuICAgICAgfSxcbiAgICB9LFxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZSAobmFtZXNwYWNlOiBzdHJpbmcsIHNlbGYgPSBmYWxzZSkge1xuICByZXR1cm4gZGVmaW5lQ29tcG9uZW50KHtcbiAgICBuYW1lOiAncmVnaXN0cmFibGUtcHJvdmlkZScsXG5cbiAgICBwcm92aWRlICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgW25hbWVzcGFjZV06IHNlbGYgPyB0aGlzIDoge1xuICAgICAgICAgIHJlZ2lzdGVyOiAodGhpcyBhcyBhbnkpLnJlZ2lzdGVyLFxuICAgICAgICAgIHVucmVnaXN0ZXI6ICh0aGlzIGFzIGFueSkudW5yZWdpc3RlcixcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICB9LFxuICB9KVxufVxuIl19