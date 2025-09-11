import { defineComponent, h } from 'vue';
import VProgressLinear from '../../components/VProgressLinear';
import { getSlot } from '../../util/helpers';
/**
 * Loadable
 *
 * @mixin
 *
 * Used to add linear progress bar to components
 * Can use a default bar with a specific color
 * or designate a custom progress linear bar
 */
/* @vue/component */
export default defineComponent({
    name: 'loadable',
    props: {
        loading: {
            type: [Boolean, String],
            default: false,
        },
        loaderHeight: {
            type: [Number, String],
            default: 2,
        },
    },
    methods: {
        genProgress() {
            if (this.loading === false)
                return null;
            return getSlot(this, 'progress') || h(VProgressLinear, {
                absolute: true,
                color: (this.loading === true || this.loading === '')
                    ? (this.color || 'primary')
                    : this.loading,
                height: this.loaderHeight,
                indeterminate: true,
            });
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2xvYWRhYmxlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQWMsQ0FBQyxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBQ3BELE9BQU8sZUFBZSxNQUFNLGtDQUFrQyxDQUFBO0FBQzlELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQU01Qzs7Ozs7Ozs7R0FRRztBQUNILG9CQUFvQjtBQUNwQixlQUFlLGVBQWUsQ0FBQztJQUM3QixJQUFJLEVBQUUsVUFBVTtJQUVoQixLQUFLLEVBQUU7UUFDTCxPQUFPLEVBQUU7WUFDUCxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO1lBQ3ZCLE9BQU8sRUFBRSxLQUFLO1NBQ2Y7UUFDRCxZQUFZLEVBQUU7WUFDWixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7S0FDRjtJQUVELE9BQU8sRUFBRTtRQUNQLFdBQVc7WUFDVCxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSztnQkFBRSxPQUFPLElBQUksQ0FBQTtZQUV2QyxPQUFPLE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLGVBQWUsRUFBRTtnQkFDckQsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7b0JBQ25ELENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksU0FBUyxDQUFDO29CQUMzQixDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU87Z0JBQ2hCLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWTtnQkFDekIsYUFBYSxFQUFFLElBQUk7YUFDcEIsQ0FBQyxDQUFBO1FBQ0osQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGVmaW5lQ29tcG9uZW50LCBWTm9kZSwgQXBwLCBoIH0gZnJvbSAndnVlJ1xuaW1wb3J0IFZQcm9ncmVzc0xpbmVhciBmcm9tICcuLi8uLi9jb21wb25lbnRzL1ZQcm9ncmVzc0xpbmVhcidcbmltcG9ydCB7IGdldFNsb3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbmludGVyZmFjZSBjb2xvcmFibGUgZXh0ZW5kcyBBcHAge1xuICBjb2xvcj86IHN0cmluZ1xufVxuXG4vKipcbiAqIExvYWRhYmxlXG4gKlxuICogQG1peGluXG4gKlxuICogVXNlZCB0byBhZGQgbGluZWFyIHByb2dyZXNzIGJhciB0byBjb21wb25lbnRzXG4gKiBDYW4gdXNlIGEgZGVmYXVsdCBiYXIgd2l0aCBhIHNwZWNpZmljIGNvbG9yXG4gKiBvciBkZXNpZ25hdGUgYSBjdXN0b20gcHJvZ3Jlc3MgbGluZWFyIGJhclxuICovXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29tcG9uZW50KHtcbiAgbmFtZTogJ2xvYWRhYmxlJyxcblxuICBwcm9wczoge1xuICAgIGxvYWRpbmc6IHtcbiAgICAgIHR5cGU6IFtCb29sZWFuLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBsb2FkZXJIZWlnaHQ6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAyLFxuICAgIH0sXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGdlblByb2dyZXNzICgpOiBWTm9kZSB8IFZOb2RlW10gfCBudWxsIHtcbiAgICAgIGlmICh0aGlzLmxvYWRpbmcgPT09IGZhbHNlKSByZXR1cm4gbnVsbFxuXG4gICAgICByZXR1cm4gZ2V0U2xvdCh0aGlzLCAncHJvZ3Jlc3MnKSB8fCBoKFZQcm9ncmVzc0xpbmVhciwge1xuICAgICAgICBhYnNvbHV0ZTogdHJ1ZSxcbiAgICAgICAgY29sb3I6ICh0aGlzLmxvYWRpbmcgPT09IHRydWUgfHwgdGhpcy5sb2FkaW5nID09PSAnJylcbiAgICAgICAgICA/ICh0aGlzLmNvbG9yIHx8ICdwcmltYXJ5JylcbiAgICAgICAgICA6IHRoaXMubG9hZGluZyxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLmxvYWRlckhlaWdodCxcbiAgICAgICAgaW5kZXRlcm1pbmF0ZTogdHJ1ZSxcbiAgICAgIH0pXG4gICAgfSxcbiAgfSxcbn0pXG4iXX0=