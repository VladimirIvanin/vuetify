// Directives
import Intersect from '../../directives/intersect';
// Utilities
import { consoleWarn } from '../../util/console';
// Types
import { defineComponent, getCurrentInstance } from 'vue';
export default function intersectable(options) {
    return defineComponent({
        name: 'intersectable',
        data: () => ({
            isIntersecting: false,
        }),
        mounted() {
            const { vnode } = getCurrentInstance();
            Intersect.mounted(this.$el, {
                name: 'intersect',
                value: this.onObserve,
            }, vnode);
        },
        unmounted() {
            const { vnode } = getCurrentInstance();
            Intersect.unmounted(this.$el, {
                name: 'intersect',
                value: this.onObserve,
            }, vnode);
        },
        methods: {
            onObserve(entries, observer, isIntersecting) {
                this.isIntersecting = isIntersecting;
                if (!isIntersecting)
                    return;
                for (let i = 0, length = options.onVisible.length; i < length; i++) {
                    const callback = this[options.onVisible[i]];
                    if (typeof callback === 'function') {
                        callback();
                        continue;
                    }
                    consoleWarn(options.onVisible[i] + ' method is not available on the instance but referenced in intersectable mixin options');
                }
            },
        },
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2ludGVyc2VjdGFibGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsYUFBYTtBQUNiLE9BQU8sU0FBUyxNQUFNLDRCQUE0QixDQUFBO0FBRWxELFlBQVk7QUFDWixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFaEQsUUFBUTtBQUNSLE9BQU8sRUFBQyxlQUFlLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxLQUFLLENBQUE7QUFFdkQsTUFBTSxDQUFDLE9BQU8sVUFBVSxhQUFhLENBQUUsT0FBZ0M7SUFDckUsT0FBTyxlQUFlLENBQUM7UUFDckIsSUFBSSxFQUFFLGVBQWU7UUFFckIsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDWCxjQUFjLEVBQUUsS0FBSztTQUN0QixDQUFDO1FBRUYsT0FBTztZQUNMLE1BQU0sRUFBQyxLQUFLLEVBQUMsR0FBRyxrQkFBa0IsRUFBRSxDQUFBO1lBQ3BDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQWtCLEVBQUU7Z0JBQ3pDLElBQUksRUFBRSxXQUFXO2dCQUNqQixLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVM7YUFDdEIsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUNYLENBQUM7UUFFRCxTQUFTO1lBQ1AsTUFBTSxFQUFDLEtBQUssRUFBQyxHQUFHLGtCQUFrQixFQUFFLENBQUE7WUFFcEMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBa0IsRUFBRTtnQkFDM0MsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUzthQUN0QixFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQ1gsQ0FBQztRQUVELE9BQU8sRUFBRTtZQUNQLFNBQVMsQ0FBRSxPQUFvQyxFQUFFLFFBQThCLEVBQUUsY0FBdUI7Z0JBQ3RHLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFBO2dCQUVwQyxJQUFJLENBQUMsY0FBYztvQkFBRSxPQUFNO2dCQUUzQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDbEUsTUFBTSxRQUFRLEdBQUksSUFBWSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFFcEQsSUFBSSxPQUFPLFFBQVEsS0FBSyxVQUFVLEVBQUU7d0JBQ2xDLFFBQVEsRUFBRSxDQUFBO3dCQUNWLFNBQVE7cUJBQ1Q7b0JBRUQsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsd0ZBQXdGLENBQUMsQ0FBQTtpQkFDN0g7WUFDSCxDQUFDO1NBQ0Y7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRGlyZWN0aXZlc1xuaW1wb3J0IEludGVyc2VjdCBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL2ludGVyc2VjdCdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBjb25zb2xlV2FybiB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcblxuLy8gVHlwZXNcbmltcG9ydCB7ZGVmaW5lQ29tcG9uZW50LCBnZXRDdXJyZW50SW5zdGFuY2V9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW50ZXJzZWN0YWJsZSAob3B0aW9uczogeyBvblZpc2libGU6IHN0cmluZ1tdIH0pIHtcbiAgcmV0dXJuIGRlZmluZUNvbXBvbmVudCh7XG4gICAgbmFtZTogJ2ludGVyc2VjdGFibGUnLFxuXG4gICAgZGF0YTogKCkgPT4gKHtcbiAgICAgIGlzSW50ZXJzZWN0aW5nOiBmYWxzZSxcbiAgICB9KSxcblxuICAgIG1vdW50ZWQgKCkge1xuICAgICAgY29uc3Qge3Zub2RlfSA9IGdldEN1cnJlbnRJbnN0YW5jZSgpXG4gICAgICBJbnRlcnNlY3QubW91bnRlZCh0aGlzLiRlbCBhcyBIVE1MRWxlbWVudCwge1xuICAgICAgICBuYW1lOiAnaW50ZXJzZWN0JyxcbiAgICAgICAgdmFsdWU6IHRoaXMub25PYnNlcnZlLFxuICAgICAgfSwgdm5vZGUpXG4gICAgfSxcblxuICAgIHVubW91bnRlZCAoKSB7XG4gICAgICBjb25zdCB7dm5vZGV9ID0gZ2V0Q3VycmVudEluc3RhbmNlKClcblxuICAgICAgSW50ZXJzZWN0LnVubW91bnRlZCh0aGlzLiRlbCBhcyBIVE1MRWxlbWVudCwge1xuICAgICAgICBuYW1lOiAnaW50ZXJzZWN0JyxcbiAgICAgICAgdmFsdWU6IHRoaXMub25PYnNlcnZlLFxuICAgICAgfSwgdm5vZGUpXG4gICAgfSxcblxuICAgIG1ldGhvZHM6IHtcbiAgICAgIG9uT2JzZXJ2ZSAoZW50cmllczogSW50ZXJzZWN0aW9uT2JzZXJ2ZXJFbnRyeVtdLCBvYnNlcnZlcjogSW50ZXJzZWN0aW9uT2JzZXJ2ZXIsIGlzSW50ZXJzZWN0aW5nOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuaXNJbnRlcnNlY3RpbmcgPSBpc0ludGVyc2VjdGluZ1xuXG4gICAgICAgIGlmICghaXNJbnRlcnNlY3RpbmcpIHJldHVyblxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBvcHRpb25zLm9uVmlzaWJsZS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gKHRoaXMgYXMgYW55KVtvcHRpb25zLm9uVmlzaWJsZVtpXV1cblxuICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc29sZVdhcm4ob3B0aW9ucy5vblZpc2libGVbaV0gKyAnIG1ldGhvZCBpcyBub3QgYXZhaWxhYmxlIG9uIHRoZSBpbnN0YW5jZSBidXQgcmVmZXJlbmNlZCBpbiBpbnRlcnNlY3RhYmxlIG1peGluIG9wdGlvbnMnKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0sXG4gIH0pXG59XG4iXX0=