import { defineComponent } from 'vue';
/**
 * Delayable
 *
 * @mixin
 *
 * Changes the open or close delay time for elements
 */
export default defineComponent({
    name: 'delayable',
    props: {
        openDelay: {
            type: [Number, String],
            default: 0,
        },
        closeDelay: {
            type: [Number, String],
            default: 0,
        },
    },
    data: () => ({
        openTimeout: undefined,
        closeTimeout: undefined,
    }),
    methods: {
        /**
         * Clear any pending delay timers from executing
         */
        clearDelay() {
            clearTimeout(this.openTimeout);
            clearTimeout(this.closeTimeout);
        },
        /**
         * Runs callback after a specified delay
         */
        runDelay(type, cb) {
            this.clearDelay();
            const delay = parseInt(this[`${type}Delay`], 10);
            this[`${type}Timeout`] = setTimeout(cb || (() => {
                this.isActive = { open: true, close: false }[type];
            }), delay);
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2RlbGF5YWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sS0FBSyxDQUFBO0FBRW5DOzs7Ozs7R0FNRztBQUNILGVBQWUsZUFBZSxDQUFDO0lBQzdCLElBQUksRUFBRSxXQUFXO0lBRWpCLEtBQUssRUFBRTtRQUNMLFNBQVMsRUFBRTtZQUNULElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUNELFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLENBQUM7U0FDWDtLQUNGO0lBRUQsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDWCxXQUFXLEVBQUUsU0FBK0I7UUFDNUMsWUFBWSxFQUFFLFNBQStCO0tBQzlDLENBQUM7SUFFRixPQUFPLEVBQUU7UUFDUDs7V0FFRztRQUNILFVBQVU7WUFDUixZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1lBQzlCLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7UUFDakMsQ0FBQztRQUNEOztXQUVHO1FBQ0gsUUFBUSxDQUFFLElBQXNCLEVBQUUsRUFBZTtZQUMvQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7WUFFakIsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFFLElBQVksQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBRXhEO1lBQUMsSUFBWSxDQUFDLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxVQUFVLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUN4RCxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDcEQsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDWixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2RlZmluZUNvbXBvbmVudH0gZnJvbSAndnVlJ1xuXG4vKipcbiAqIERlbGF5YWJsZVxuICpcbiAqIEBtaXhpblxuICpcbiAqIENoYW5nZXMgdGhlIG9wZW4gb3IgY2xvc2UgZGVsYXkgdGltZSBmb3IgZWxlbWVudHNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29tcG9uZW50KHtcbiAgbmFtZTogJ2RlbGF5YWJsZScsXG5cbiAgcHJvcHM6IHtcbiAgICBvcGVuRGVsYXk6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgY2xvc2VEZWxheToge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgfSxcblxuICBkYXRhOiAoKSA9PiAoe1xuICAgIG9wZW5UaW1lb3V0OiB1bmRlZmluZWQgYXMgbnVtYmVyIHwgdW5kZWZpbmVkLFxuICAgIGNsb3NlVGltZW91dDogdW5kZWZpbmVkIGFzIG51bWJlciB8IHVuZGVmaW5lZCxcbiAgfSksXG5cbiAgbWV0aG9kczoge1xuICAgIC8qKlxuICAgICAqIENsZWFyIGFueSBwZW5kaW5nIGRlbGF5IHRpbWVycyBmcm9tIGV4ZWN1dGluZ1xuICAgICAqL1xuICAgIGNsZWFyRGVsYXkgKCk6IHZvaWQge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMub3BlblRpbWVvdXQpXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5jbG9zZVRpbWVvdXQpXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBSdW5zIGNhbGxiYWNrIGFmdGVyIGEgc3BlY2lmaWVkIGRlbGF5XG4gICAgICovXG4gICAgcnVuRGVsYXkgKHR5cGU6ICdvcGVuJyB8ICdjbG9zZScsIGNiPzogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgdGhpcy5jbGVhckRlbGF5KClcblxuICAgICAgY29uc3QgZGVsYXkgPSBwYXJzZUludCgodGhpcyBhcyBhbnkpW2Ake3R5cGV9RGVsYXlgXSwgMTApXG5cbiAgICAgIDsodGhpcyBhcyBhbnkpW2Ake3R5cGV9VGltZW91dGBdID0gc2V0VGltZW91dChjYiB8fCAoKCkgPT4ge1xuICAgICAgICB0aGlzLmlzQWN0aXZlID0geyBvcGVuOiB0cnVlLCBjbG9zZTogZmFsc2UgfVt0eXBlXVxuICAgICAgfSksIGRlbGF5KVxuICAgIH0sXG4gIH0sXG59KVxuIl19