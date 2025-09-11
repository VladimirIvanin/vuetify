import { h } from 'vue';
// Styles
import './VDivider.sass';
// Types
import { defineComponent } from 'vue';
// Mixins
import Themeable from '../../mixins/themeable';
import mergeData from '../../util/mergeData';
export default defineComponent({
    name: 'v-divider',
    extends: Themeable,
    props: {
        inset: Boolean,
        vertical: Boolean,
    },
    render() {
        // WAI-ARIA attributes
        let orientation;
        if (!this.$attrs.role || this.$attrs.role === 'separator') {
            orientation = this.vertical ? 'vertical' : 'horizontal';
        }
        return h('hr', mergeData({
            class: {
                'v-divider': true,
                'v-divider--inset': this.inset,
                'v-divider--vertical': this.vertical,
                ...this.themeClasses,
            },
            role: 'separator',
            'aria-orientation': orientation,
            ...this.$listeners
        }, this.$attrs));
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRpdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WRGl2aWRlci9WRGl2aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsQ0FBQyxFQUFDLE1BQU0sS0FBSyxDQUFBO0FBQ3JCLFNBQVM7QUFDVCxPQUFPLGlCQUFpQixDQUFBO0FBRXhCLFFBQVE7QUFDUixPQUFPLEVBQVMsZUFBZSxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBRTVDLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSxzQkFBc0IsQ0FBQTtBQUc1QyxlQUFlLGVBQWUsQ0FBQztJQUM3QixJQUFJLEVBQUUsV0FBVztJQUNqQixPQUFPLEVBQUUsU0FBUztJQUVsQixLQUFLLEVBQUU7UUFDTCxLQUFLLEVBQUUsT0FBTztRQUNkLFFBQVEsRUFBRSxPQUFPO0tBQ2xCO0lBRUQsTUFBTTtRQUNKLHNCQUFzQjtRQUN0QixJQUFJLFdBQVcsQ0FBQTtRQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxXQUFXLEVBQUU7WUFDekQsV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFBO1NBQ3hEO1FBQ0QsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQztZQUN2QixLQUFLLEVBQUU7Z0JBQ0wsV0FBVyxFQUFFLElBQUk7Z0JBQ2pCLGtCQUFrQixFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUM5QixxQkFBcUIsRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDcEMsR0FBRyxJQUFJLENBQUMsWUFBWTthQUNyQjtZQUNELElBQUksRUFBRSxXQUFXO1lBQ2pCLGtCQUFrQixFQUFFLFdBQVc7WUFDL0IsR0FBRyxJQUFJLENBQUMsVUFBVTtTQUNuQixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0lBQ2xCLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2h9IGZyb20gJ3Z1ZSdcbi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZEaXZpZGVyLnNhc3MnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSwgZGVmaW5lQ29tcG9uZW50IH0gZnJvbSAndnVlJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcbmltcG9ydCBtZXJnZURhdGEgZnJvbSAnLi4vLi4vdXRpbC9tZXJnZURhdGEnXG5cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29tcG9uZW50KHtcbiAgbmFtZTogJ3YtZGl2aWRlcicsXG4gIGV4dGVuZHM6IFRoZW1lYWJsZSxcblxuICBwcm9wczoge1xuICAgIGluc2V0OiBCb29sZWFuLFxuICAgIHZlcnRpY2FsOiBCb29sZWFuLFxuICB9LFxuXG4gIHJlbmRlciAoKTogVk5vZGUge1xuICAgIC8vIFdBSS1BUklBIGF0dHJpYnV0ZXNcbiAgICBsZXQgb3JpZW50YXRpb25cbiAgICBpZiAoIXRoaXMuJGF0dHJzLnJvbGUgfHwgdGhpcy4kYXR0cnMucm9sZSA9PT0gJ3NlcGFyYXRvcicpIHtcbiAgICAgIG9yaWVudGF0aW9uID0gdGhpcy52ZXJ0aWNhbCA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCdcbiAgICB9XG4gICAgcmV0dXJuIGgoJ2hyJywgbWVyZ2VEYXRhKHtcbiAgICAgIGNsYXNzOiB7XG4gICAgICAgICd2LWRpdmlkZXInOiB0cnVlLFxuICAgICAgICAndi1kaXZpZGVyLS1pbnNldCc6IHRoaXMuaW5zZXQsXG4gICAgICAgICd2LWRpdmlkZXItLXZlcnRpY2FsJzogdGhpcy52ZXJ0aWNhbCxcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXMsXG4gICAgICB9LFxuICAgICAgcm9sZTogJ3NlcGFyYXRvcicsXG4gICAgICAnYXJpYS1vcmllbnRhdGlvbic6IG9yaWVudGF0aW9uLFxuICAgICAgLi4udGhpcy4kbGlzdGVuZXJzXG4gICAgfSwgdGhpcy4kYXR0cnMpKVxuICB9LFxufSlcbiJdfQ==