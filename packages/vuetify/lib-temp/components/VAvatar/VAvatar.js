import { h } from 'vue';
import './VAvatar.sass';
// Mixins
import Colorable from '../../mixins/colorable';
import Measurable from '../../mixins/measurable';
import Roundable from '../../mixins/roundable';
// Utilities
import { convertToUnit, getSlot } from '../../util/helpers';
import mixins from '../../util/mixins';
export default mixins(Colorable, Measurable, Roundable).extend({
    name: 'v-avatar',
    props: {
        left: Boolean,
        right: Boolean,
        size: {
            type: [Number, String],
            default: 48,
        },
    },
    computed: {
        classes() {
            return {
                'v-avatar--left': this.left,
                'v-avatar--right': this.right,
                ...this.roundedClasses,
            };
        },
        styles() {
            return {
                height: convertToUnit(this.size),
                minWidth: convertToUnit(this.size),
                width: convertToUnit(this.size),
                ...this.measurableStyles,
            };
        },
    },
    render() {
        const data = {
            class: ['v-avatar', this.classes],
            style: this.styles,
            ...this.$listeners,
        };
        return h('div', this.setBackgroundColor(this.color, data), getSlot(this));
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkF2YXRhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZBdmF0YXIvVkF2YXRhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsQ0FBQyxFQUFDLE1BQU0sS0FBSyxDQUFBO0FBQ3JCLE9BQU8sZ0JBQWdCLENBQUE7QUFFdkIsU0FBUztBQUNULE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBQ2hELE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBRTlDLFlBQVk7QUFDWixPQUFPLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBSTNELE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBRXRDLGVBQWUsTUFBTSxDQUNuQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFNBQVMsQ0FFVixDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxVQUFVO0lBRWhCLEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxPQUFPO1FBQ2IsS0FBSyxFQUFFLE9BQU87UUFDZCxJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxFQUFFO1NBQ1o7S0FDRjtJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPO2dCQUNMLGdCQUFnQixFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUMzQixpQkFBaUIsRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDN0IsR0FBRyxJQUFJLENBQUMsY0FBYzthQUN2QixDQUFBO1FBQ0gsQ0FBQztRQUNELE1BQU07WUFDSixPQUFPO2dCQUNMLE1BQU0sRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDaEMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNsQyxLQUFLLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQy9CLEdBQUcsSUFBSSxDQUFDLGdCQUFnQjthQUN6QixDQUFBO1FBQ0gsQ0FBQztLQUNGO0lBRUQsTUFBTTtRQUNKLE1BQU0sSUFBSSxHQUFHO1lBQ1gsS0FBSyxFQUFFLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDakMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ2xCLEdBQUcsSUFBSSxDQUFDLFVBQVU7U0FDbkIsQ0FBQTtRQUVELE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUMzRSxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtofSBmcm9tICd2dWUnXG5pbXBvcnQgJy4vVkF2YXRhci5zYXNzJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcbmltcG9ydCBNZWFzdXJhYmxlIGZyb20gJy4uLy4uL21peGlucy9tZWFzdXJhYmxlJ1xuaW1wb3J0IFJvdW5kYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvcm91bmRhYmxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCB7IGNvbnZlcnRUb1VuaXQsIGdldFNsb3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcbiAgQ29sb3JhYmxlLFxuICBNZWFzdXJhYmxlLFxuICBSb3VuZGFibGUsXG4gIC8qIEB2dWUvY29tcG9uZW50ICovXG4pLmV4dGVuZCh7XG4gIG5hbWU6ICd2LWF2YXRhcicsXG5cbiAgcHJvcHM6IHtcbiAgICBsZWZ0OiBCb29sZWFuLFxuICAgIHJpZ2h0OiBCb29sZWFuLFxuICAgIHNpemU6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiA0OCxcbiAgICB9LFxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LWF2YXRhci0tbGVmdCc6IHRoaXMubGVmdCxcbiAgICAgICAgJ3YtYXZhdGFyLS1yaWdodCc6IHRoaXMucmlnaHQsXG4gICAgICAgIC4uLnRoaXMucm91bmRlZENsYXNzZXMsXG4gICAgICB9XG4gICAgfSxcbiAgICBzdHlsZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBoZWlnaHQ6IGNvbnZlcnRUb1VuaXQodGhpcy5zaXplKSxcbiAgICAgICAgbWluV2lkdGg6IGNvbnZlcnRUb1VuaXQodGhpcy5zaXplKSxcbiAgICAgICAgd2lkdGg6IGNvbnZlcnRUb1VuaXQodGhpcy5zaXplKSxcbiAgICAgICAgLi4udGhpcy5tZWFzdXJhYmxlU3R5bGVzLFxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgY29uc3QgZGF0YSA9IHtcbiAgICAgIGNsYXNzOiBbJ3YtYXZhdGFyJywgdGhpcy5jbGFzc2VzXSxcbiAgICAgIHN0eWxlOiB0aGlzLnN0eWxlcyxcbiAgICAgIC4uLnRoaXMuJGxpc3RlbmVycyxcbiAgICB9XG5cbiAgICByZXR1cm4gaCgnZGl2JywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb2xvciwgZGF0YSksIGdldFNsb3QodGhpcykpXG4gIH0sXG59KVxuIl19