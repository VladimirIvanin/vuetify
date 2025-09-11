import { h } from 'vue';
// Styles
import './VSystemBar.sass';
// Mixins
import Applicationable from '../../mixins/applicationable';
import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable';
// Utilities
import mixins from '../../util/mixins';
import { convertToUnit, getSlot } from '../../util/helpers';
export default mixins(Applicationable('bar', [
    'height',
    'window',
]), Colorable, Themeable
/* @vue/component */
).extend({
    name: 'v-system-bar',
    props: {
        height: [Number, String],
        lightsOut: Boolean,
        window: Boolean,
    },
    computed: {
        classes() {
            return {
                'v-system-bar--lights-out': this.lightsOut,
                'v-system-bar--absolute': this.absolute,
                'v-system-bar--fixed': !this.absolute && (this.app || this.fixed),
                'v-system-bar--window': this.window,
                ...this.themeClasses,
            };
        },
        computedHeight() {
            if (this.height) {
                return isNaN(parseInt(this.height)) ? this.height : parseInt(this.height);
            }
            return this.window ? 32 : 24;
        },
        styles() {
            return {
                height: convertToUnit(this.computedHeight),
            };
        },
    },
    methods: {
        updateApplication() {
            return this.$el
                ? this.$el.clientHeight
                : this.computedHeight;
        },
    },
    render() {
        const data = {
            class: 'v-system-bar',
            class: this.classes,
            style: this.styles,
            on: this.$listeners,
        };
        return h('div', this.setBackgroundColor(this.color, data), getSlot(this));
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlN5c3RlbUJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTeXN0ZW1CYXIvVlN5c3RlbUJhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsQ0FBQyxFQUFDLE1BQU0sS0FBSyxDQUFBO0FBQ3JCLFNBQVM7QUFDVCxPQUFPLG1CQUFtQixDQUFBO0FBRTFCLFNBQVM7QUFDVCxPQUFPLGVBQWUsTUFBTSw4QkFBOEIsQ0FBQTtBQUMxRCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxZQUFZO0FBQ1osT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFDdEMsT0FBTyxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUszRCxlQUFlLE1BQU0sQ0FDbkIsZUFBZSxDQUFDLEtBQUssRUFBRTtJQUNyQixRQUFRO0lBQ1IsUUFBUTtDQUNULENBQUMsRUFDRixTQUFTLEVBQ1QsU0FBUztBQUNYLG9CQUFvQjtDQUNuQixDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxjQUFjO0lBRXBCLEtBQUssRUFBRTtRQUNMLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7UUFDeEIsU0FBUyxFQUFFLE9BQU87UUFDbEIsTUFBTSxFQUFFLE9BQU87S0FDaEI7SUFFRCxRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTztnQkFDTCwwQkFBMEIsRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDMUMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ3ZDLHFCQUFxQixFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDakUsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ25DLEdBQUcsSUFBSSxDQUFDLFlBQVk7YUFDckIsQ0FBQTtRQUNILENBQUM7UUFDRCxjQUFjO1lBQ1osSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNmLE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTthQUMxRTtZQUVELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7UUFDOUIsQ0FBQztRQUNELE1BQU07WUFDSixPQUFPO2dCQUNMLE1BQU0sRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQzthQUMzQyxDQUFBO1FBQ0gsQ0FBQztLQUNGO0lBRUQsT0FBTyxFQUFFO1FBQ1AsaUJBQWlCO1lBQ2YsT0FBTyxJQUFJLENBQUMsR0FBRztnQkFDYixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZO2dCQUN2QixDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQTtRQUN6QixDQUFDO0tBQ0Y7SUFFRCxNQUFNO1FBQ0osTUFBTSxJQUFJLEdBQUc7WUFDWCxLQUFLLEVBQUUsY0FBYztZQUNyQixLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDbkIsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ2xCLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVTtTQUNwQixDQUFBO1FBRUQsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBQzNFLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2h9IGZyb20gJ3Z1ZSdcbi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZTeXN0ZW1CYXIuc2FzcydcblxuLy8gTWl4aW5zXG5pbXBvcnQgQXBwbGljYXRpb25hYmxlIGZyb20gJy4uLy4uL21peGlucy9hcHBsaWNhdGlvbmFibGUnXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IGNvbnZlcnRUb1VuaXQsIGdldFNsb3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZS90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxuICBBcHBsaWNhdGlvbmFibGUoJ2JhcicsIFtcbiAgICAnaGVpZ2h0JyxcbiAgICAnd2luZG93JyxcbiAgXSksXG4gIENvbG9yYWJsZSxcbiAgVGhlbWVhYmxlXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuKS5leHRlbmQoe1xuICBuYW1lOiAndi1zeXN0ZW0tYmFyJyxcblxuICBwcm9wczoge1xuICAgIGhlaWdodDogW051bWJlciwgU3RyaW5nXSxcbiAgICBsaWdodHNPdXQ6IEJvb2xlYW4sXG4gICAgd2luZG93OiBCb29sZWFuLFxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LXN5c3RlbS1iYXItLWxpZ2h0cy1vdXQnOiB0aGlzLmxpZ2h0c091dCxcbiAgICAgICAgJ3Ytc3lzdGVtLWJhci0tYWJzb2x1dGUnOiB0aGlzLmFic29sdXRlLFxuICAgICAgICAndi1zeXN0ZW0tYmFyLS1maXhlZCc6ICF0aGlzLmFic29sdXRlICYmICh0aGlzLmFwcCB8fCB0aGlzLmZpeGVkKSxcbiAgICAgICAgJ3Ytc3lzdGVtLWJhci0td2luZG93JzogdGhpcy53aW5kb3csXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzLFxuICAgICAgfVxuICAgIH0sXG4gICAgY29tcHV0ZWRIZWlnaHQgKCk6IG51bWJlciB8IHN0cmluZyB7XG4gICAgICBpZiAodGhpcy5oZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuIGlzTmFOKHBhcnNlSW50KHRoaXMuaGVpZ2h0KSkgPyB0aGlzLmhlaWdodCA6IHBhcnNlSW50KHRoaXMuaGVpZ2h0KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy53aW5kb3cgPyAzMiA6IDI0XG4gICAgfSxcbiAgICBzdHlsZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBoZWlnaHQ6IGNvbnZlcnRUb1VuaXQodGhpcy5jb21wdXRlZEhlaWdodCksXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgdXBkYXRlQXBwbGljYXRpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJGVsXG4gICAgICAgID8gdGhpcy4kZWwuY2xpZW50SGVpZ2h0XG4gICAgICAgIDogdGhpcy5jb21wdXRlZEhlaWdodFxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgY29uc3QgZGF0YSA9IHtcbiAgICAgIGNsYXNzOiAndi1zeXN0ZW0tYmFyJyxcbiAgICAgIGNsYXNzOiB0aGlzLmNsYXNzZXMsXG4gICAgICBzdHlsZTogdGhpcy5zdHlsZXMsXG4gICAgICBvbjogdGhpcy4kbGlzdGVuZXJzLFxuICAgIH1cblxuICAgIHJldHVybiBoKCdkaXYnLCB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmNvbG9yLCBkYXRhKSwgZ2V0U2xvdCh0aGlzKSlcbiAgfSxcbn0pXG4iXX0=