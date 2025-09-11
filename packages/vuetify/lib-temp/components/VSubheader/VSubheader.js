import { h } from 'vue';
// Styles
import './VSubheader.sass';
// Mixins
import Themeable from '../../mixins/themeable';
import mixins from '../../util/mixins';
import { getSlot } from '../../util/helpers';
export default mixins(Themeable
/* @vue/component */
).extend({
    name: 'v-subheader',
    props: {
        inset: Boolean,
    },
    render() {
        return h('div', {
            ...this.$attrs,
            class: ['v-subheader', {
                    'v-subheader--inset': this.inset,
                    ...this.themeClasses,
                }, this.$attrs.class],
            ...this.$listeners
        }, getSlot(this));
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlN1YmhlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTdWJoZWFkZXIvVlN1YmhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsQ0FBQyxFQUFDLE1BQU0sS0FBSyxDQUFBO0FBQ3JCLFNBQVM7QUFDVCxPQUFPLG1CQUFtQixDQUFBO0FBRTFCLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUN0QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFLNUMsZUFBZSxNQUFNLENBQ25CLFNBQVM7QUFDVCxvQkFBb0I7Q0FDckIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsYUFBYTtJQUVuQixLQUFLLEVBQUU7UUFDTCxLQUFLLEVBQUUsT0FBTztLQUNmO0lBRUQsTUFBTTtRQUNKLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUNkLEdBQUcsSUFBSSxDQUFDLE1BQU07WUFDZCxLQUFLLEVBQUUsQ0FBQyxhQUFhLEVBQUU7b0JBQ3JCLG9CQUFvQixFQUFFLElBQUksQ0FBQyxLQUFLO29CQUNoQyxHQUFHLElBQUksQ0FBQyxZQUFZO2lCQUNyQixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ3JCLEdBQUcsSUFBSSxDQUFDLFVBQVU7U0FDbkIsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUNuQixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtofSBmcm9tICd2dWUnXG4vLyBTdHlsZXNcbmltcG9ydCAnLi9WU3ViaGVhZGVyLnNhc3MnXG5cbi8vIE1peGluc1xuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IGdldFNsb3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxuICBUaGVtZWFibGVcbiAgLyogQHZ1ZS9jb21wb25lbnQgKi9cbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3Ytc3ViaGVhZGVyJyxcblxuICBwcm9wczoge1xuICAgIGluc2V0OiBCb29sZWFuLFxuICB9LFxuXG4gIHJlbmRlciAoKTogVk5vZGUge1xuICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAuLi50aGlzLiRhdHRycyxcbiAgICAgIGNsYXNzOiBbJ3Ytc3ViaGVhZGVyJywge1xuICAgICAgICAndi1zdWJoZWFkZXItLWluc2V0JzogdGhpcy5pbnNldCxcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXMsXG4gICAgICB9LCB0aGlzLiRhdHRycy5jbGFzc10sXG4gICAgICAuLi50aGlzLiRsaXN0ZW5lcnNcbiAgICB9LCBnZXRTbG90KHRoaXMpKVxuICB9LFxufSlcbiJdfQ==