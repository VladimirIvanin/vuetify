import { defineComponent } from 'vue';
/**
 * This mixin provides `attrs$` and `listeners$` to work around
 * vue bug https://github.com/vuejs/vue/issues/10115
 */
function makeWatcher(property) {
    return function (val, oldVal) {
        for (const attr in oldVal) {
            if (!Object.prototype.hasOwnProperty.call(val, attr)) {
                delete this.$data[property][attr];
            }
        }
        for (const attr in val) {
            this.$data[property][attr] = val[attr];
        }
    };
}
export default defineComponent({
    data: () => ({
        attrs$: {},
        listeners$: {},
    }),
    created() {
        // Work around unwanted re-renders: https://github.com/vuejs/vue/issues/10115
        // Make sure to use `attrs$` instead of `$attrs` (confusing right?)
        this.$watch('$attrs', makeWatcher('attrs$'), { immediate: true });
        this.$watch('$listeners', makeWatcher('listeners$'), { immediate: true });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2JpbmRzLWF0dHJzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxLQUFLLENBQUE7QUFFbkM7OztHQUdHO0FBRUgsU0FBUyxXQUFXLENBQUUsUUFBZ0I7SUFDcEMsT0FBTyxVQUFxQixHQUFHLEVBQUUsTUFBTTtRQUNyQyxLQUFLLE1BQU0sSUFBSSxJQUFJLE1BQU0sRUFBRTtZQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRTtnQkFDcEQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO2FBQ2xDO1NBQ0Y7UUFDRCxLQUFLLE1BQU0sSUFBSSxJQUFJLEdBQUcsRUFBRTtZQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUN2QztJQUNILENBQUMsQ0FBQTtBQUNILENBQUM7QUFFRCxlQUFlLGVBQWUsQ0FBQztJQUM3QixJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNYLE1BQU0sRUFBRSxFQUF3QjtRQUNoQyxVQUFVLEVBQUUsRUFBdUM7S0FDcEQsQ0FBQztJQUVGLE9BQU87UUFDTCw2RUFBNkU7UUFDN0UsbUVBQW1FO1FBQ25FLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBQ2pFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0lBQzNFLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2RlZmluZUNvbXBvbmVudH0gZnJvbSAndnVlJ1xuXG4vKipcbiAqIFRoaXMgbWl4aW4gcHJvdmlkZXMgYGF0dHJzJGAgYW5kIGBsaXN0ZW5lcnMkYCB0byB3b3JrIGFyb3VuZFxuICogdnVlIGJ1ZyBodHRwczovL2dpdGh1Yi5jb20vdnVlanMvdnVlL2lzc3Vlcy8xMDExNVxuICovXG5cbmZ1bmN0aW9uIG1ha2VXYXRjaGVyIChwcm9wZXJ0eTogc3RyaW5nKTogVGhpc1R5cGU8VnVlPiAmICgodmFsOiBhbnksIG9sZFZhbDogYW55KSA9PiB2b2lkKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGhpczogVnVlLCB2YWwsIG9sZFZhbCkge1xuICAgIGZvciAoY29uc3QgYXR0ciBpbiBvbGRWYWwpIHtcbiAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbCwgYXR0cikpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuJGRhdGFbcHJvcGVydHldW2F0dHJdXG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgYXR0ciBpbiB2YWwpIHtcbiAgICAgIHRoaXMuJGRhdGFbcHJvcGVydHldW2F0dHJdID0gdmFsW2F0dHJdXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XG4gIGRhdGE6ICgpID0+ICh7XG4gICAgYXR0cnMkOiB7fSBhcyBEaWN0aW9uYXJ5PHN0cmluZz4sXG4gICAgbGlzdGVuZXJzJDoge30gYXMgRGljdGlvbmFyeTxGdW5jdGlvbiB8IEZ1bmN0aW9uW10+LFxuICB9KSxcblxuICBjcmVhdGVkICgpIHtcbiAgICAvLyBXb3JrIGFyb3VuZCB1bndhbnRlZCByZS1yZW5kZXJzOiBodHRwczovL2dpdGh1Yi5jb20vdnVlanMvdnVlL2lzc3Vlcy8xMDExNVxuICAgIC8vIE1ha2Ugc3VyZSB0byB1c2UgYGF0dHJzJGAgaW5zdGVhZCBvZiBgJGF0dHJzYCAoY29uZnVzaW5nIHJpZ2h0PylcbiAgICB0aGlzLiR3YXRjaCgnJGF0dHJzJywgbWFrZVdhdGNoZXIoJ2F0dHJzJCcpLCB7IGltbWVkaWF0ZTogdHJ1ZSB9KVxuICAgIHRoaXMuJHdhdGNoKCckbGlzdGVuZXJzJywgbWFrZVdhdGNoZXIoJ2xpc3RlbmVycyQnKSwgeyBpbW1lZGlhdGU6IHRydWUgfSlcbiAgfSxcbn0pXG4iXX0=