// Mixins
import Delayable from '../../mixins/delayable';
import Toggleable from '../../mixins/toggleable';
// Utilities
import mixins from '../../util/mixins';
import { consoleWarn } from '../../util/console';
export default mixins(Delayable, Toggleable
/* @vue/component */
).extend({
    name: 'v-hover',
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        value: {
            type: Boolean,
            default: undefined,
        },
    },
    emits: ['update:modelValue'],
    methods: {
        onMouseEnter() {
            this.runDelay('open');
        },
        onMouseLeave() {
            this.runDelay('close');
        },
    },
    render() {
        if (!this.$slots.default && this.value === undefined) {
            consoleWarn('v-hover is missing a default scopedSlot or bound value', this);
            return null;
        }
        let element;
        /* istanbul ignore else */
        if (this.$slots.default) {
            element = this.$slots.default({ hover: this.isActive });
        }
        if (Array.isArray(element) && element.length === 1) {
            element = element[0];
        }
        if (!element || Array.isArray(element) || !element.tag) {
            consoleWarn('v-hover should only contain a single element', this);
            return element;
        }
        if (!this.disabled) {
            element.data = element.data || {};
            this._g(element.data, {
                mouseenter: this.onMouseEnter,
                mouseleave: this.onMouseLeave,
            });
        }
        return element;
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkhvdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkhvdmVyL1ZIb3Zlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFFaEQsWUFBWTtBQUNaLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBQ3RDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUtoRCxlQUFlLE1BQU0sQ0FDbkIsU0FBUyxFQUNULFVBQVU7QUFDVixvQkFBb0I7Q0FDckIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsU0FBUztJQUVmLEtBQUssRUFBRTtRQUNMLFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLEtBQUs7U0FDZjtRQUNELEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLFNBQVM7U0FDbkI7S0FDRjtJQUVELEtBQUssRUFBRSxDQUFDLG1CQUFtQixDQUFDO0lBRTVCLE9BQU8sRUFBRTtRQUNQLFlBQVk7WUFDVixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3ZCLENBQUM7UUFDRCxZQUFZO1lBQ1YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN4QixDQUFDO0tBQ0Y7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ3BELFdBQVcsQ0FBQyx3REFBd0QsRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUUzRSxPQUFPLElBQVcsQ0FBQTtTQUNuQjtRQUVELElBQUksT0FBbUMsQ0FBQTtRQUV2QywwQkFBMEI7UUFDMUIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtZQUN2QixPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7U0FDeEQ7UUFFRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDbEQsT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUNyQjtRQUVELElBQUksQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUU7WUFDdEQsV0FBVyxDQUFDLDhDQUE4QyxFQUFFLElBQUksQ0FBQyxDQUFBO1lBRWpFLE9BQU8sT0FBYyxDQUFBO1NBQ3RCO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsT0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQTtZQUNqQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUU7Z0JBQ3BCLFVBQVUsRUFBRSxJQUFJLENBQUMsWUFBWTtnQkFDN0IsVUFBVSxFQUFFLElBQUksQ0FBQyxZQUFZO2FBQzlCLENBQUMsQ0FBQTtTQUNIO1FBRUQsT0FBTyxPQUFPLENBQUE7SUFDaEIsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIE1peGluc1xuaW1wb3J0IERlbGF5YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvZGVsYXlhYmxlJ1xuaW1wb3J0IFRvZ2dsZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RvZ2dsZWFibGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IGNvbnNvbGVXYXJuIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUsIFNjb3BlZFNsb3RDaGlsZHJlbiB9IGZyb20gJ3Z1ZS90eXBlcy92bm9kZSdcblxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxuICBEZWxheWFibGUsXG4gIFRvZ2dsZWFibGVcbiAgLyogQHZ1ZS9jb21wb25lbnQgKi9cbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtaG92ZXInLFxuXG4gIHByb3BzOiB7XG4gICAgZGlzYWJsZWQ6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIHZhbHVlOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgIH0sXG4gIH0sXG5cbiAgZW1pdHM6IFsndXBkYXRlOm1vZGVsVmFsdWUnXSxcblxuICBtZXRob2RzOiB7XG4gICAgb25Nb3VzZUVudGVyICgpIHtcbiAgICAgIHRoaXMucnVuRGVsYXkoJ29wZW4nKVxuICAgIH0sXG4gICAgb25Nb3VzZUxlYXZlICgpIHtcbiAgICAgIHRoaXMucnVuRGVsYXkoJ2Nsb3NlJylcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoKTogVk5vZGUge1xuICAgIGlmICghdGhpcy4kc2xvdHMuZGVmYXVsdCAmJiB0aGlzLnZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGVXYXJuKCd2LWhvdmVyIGlzIG1pc3NpbmcgYSBkZWZhdWx0IHNjb3BlZFNsb3Qgb3IgYm91bmQgdmFsdWUnLCB0aGlzKVxuXG4gICAgICByZXR1cm4gbnVsbCBhcyBhbnlcbiAgICB9XG5cbiAgICBsZXQgZWxlbWVudDogVk5vZGUgfCBTY29wZWRTbG90Q2hpbGRyZW5cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgaWYgKHRoaXMuJHNsb3RzLmRlZmF1bHQpIHtcbiAgICAgIGVsZW1lbnQgPSB0aGlzLiRzbG90cy5kZWZhdWx0KHsgaG92ZXI6IHRoaXMuaXNBY3RpdmUgfSlcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShlbGVtZW50KSAmJiBlbGVtZW50Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgZWxlbWVudCA9IGVsZW1lbnRbMF1cbiAgICB9XG5cbiAgICBpZiAoIWVsZW1lbnQgfHwgQXJyYXkuaXNBcnJheShlbGVtZW50KSB8fCAhZWxlbWVudC50YWcpIHtcbiAgICAgIGNvbnNvbGVXYXJuKCd2LWhvdmVyIHNob3VsZCBvbmx5IGNvbnRhaW4gYSBzaW5nbGUgZWxlbWVudCcsIHRoaXMpXG5cbiAgICAgIHJldHVybiBlbGVtZW50IGFzIGFueVxuICAgIH1cblxuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgZWxlbWVudC5kYXRhID0gZWxlbWVudC5kYXRhIHx8IHt9XG4gICAgICB0aGlzLl9nKGVsZW1lbnQuZGF0YSwge1xuICAgICAgICBtb3VzZWVudGVyOiB0aGlzLm9uTW91c2VFbnRlcixcbiAgICAgICAgbW91c2VsZWF2ZTogdGhpcy5vbk1vdXNlTGVhdmUsXG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50XG4gIH0sXG59KVxuIl19