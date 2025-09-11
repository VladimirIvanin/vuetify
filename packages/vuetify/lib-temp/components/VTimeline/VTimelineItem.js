import { h } from 'vue';
// Types
import mixins from '../../util/mixins';
import VIcon from '../VIcon';
// Mixins
import Themeable from '../../mixins/themeable';
import Colorable from '../../mixins/colorable';
import { getSlot } from '../../util/helpers';
import mergeData from '../../util/mergeData';
const baseMixins = mixins(Colorable, Themeable
/* @vue/component */
);
export default baseMixins.extend({
    name: 'v-timeline-item',
    inject: ['timeline'],
    props: {
        color: {
            type: String,
            default: 'primary',
        },
        fillDot: Boolean,
        hideDot: Boolean,
        icon: String,
        iconColor: String,
        large: Boolean,
        left: Boolean,
        right: Boolean,
        small: Boolean,
    },
    computed: {
        hasIcon() {
            return !!this.icon || !!this.$slots.icon;
        },
    },
    methods: {
        genBody() {
            return h('div', {
                class: 'v-timeline-item__body',
            }, getSlot(this));
        },
        genIcon() {
            return getSlot(this, 'icon') || h(VIcon, {
                color: this.iconColor,
                dark: !this.theme.isDark,
                small: this.small
            }, this.icon);
        },
        genInnerDot() {
            const data = this.setBackgroundColor(this.color);
            return h('div', mergeData({
                class: 'v-timeline-item__inner-dot',
            }, data), [this.hasIcon && this.genIcon()]);
        },
        genDot() {
            return h('div', {
                class: ['v-timeline-item__dot', {
                        'v-timeline-item__dot--small': this.small,
                        'v-timeline-item__dot--large': this.large,
                    }],
            }, [this.genInnerDot()]);
        },
        genDivider() {
            const children = [];
            if (!this.hideDot)
                children.push(this.genDot());
            return h('div', {
                class: 'v-timeline-item__divider',
            }, children);
        },
        genOpposite() {
            return h('div', {
                class: 'v-timeline-item__opposite',
            }, getSlot(this, 'opposite'));
        },
    },
    render() {
        const children = [
            this.genBody(),
            this.genDivider(),
        ];
        if (this.$slots.opposite)
            children.push(this.genOpposite());
        return h('div', {
            class: ['v-timeline-item', {
                    'v-timeline-item--fill-dot': this.fillDot,
                    'v-timeline-item--before': this.timeline.reverse ? this.right : this.left,
                    'v-timeline-item--after': this.timeline.reverse ? this.left : this.right,
                    ...this.themeClasses,
                }],
        }, children);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRpbWVsaW5lSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZUaW1lbGluZS9WVGltZWxpbmVJdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxDQUFDLEVBQUMsTUFBTSxLQUFLLENBQUE7QUFDckIsUUFBUTtBQUNSLE9BQU8sTUFBc0IsTUFBTSxtQkFBbUIsQ0FBQTtBQUt0RCxPQUFPLEtBQUssTUFBTSxVQUFVLENBQUE7QUFFNUIsU0FBUztBQUNULE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUM1QyxPQUFPLFNBQVMsTUFBTSxzQkFBc0IsQ0FBQTtBQUU1QyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQ3ZCLFNBQVMsRUFDVCxTQUFTO0FBQ1gsb0JBQW9CO0NBQ25CLENBQUE7QUFRRCxlQUFlLFVBQVUsQ0FBQyxNQUFNLENBQUM7SUFDL0IsSUFBSSxFQUFFLGlCQUFpQjtJQUV2QixNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFFcEIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsU0FBUztTQUNuQjtRQUNELE9BQU8sRUFBRSxPQUFPO1FBQ2hCLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLElBQUksRUFBRSxNQUFNO1FBQ1osU0FBUyxFQUFFLE1BQU07UUFDakIsS0FBSyxFQUFFLE9BQU87UUFDZCxJQUFJLEVBQUUsT0FBTztRQUNiLEtBQUssRUFBRSxPQUFPO1FBQ2QsS0FBSyxFQUFFLE9BQU87S0FDZjtJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQTtRQUMxQyxDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxPQUFPO1lBQ0wsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO2dCQUNkLEtBQUssRUFBRSx1QkFBdUI7YUFDL0IsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUNuQixDQUFDO1FBQ0QsT0FBTztZQUNMLE9BQU8sT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFO2dCQUN2QyxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVM7Z0JBQ3JCLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtnQkFDeEIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2FBQ2xCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2YsQ0FBQztRQUNELFdBQVc7WUFDVCxNQUFNLElBQUksR0FBYyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBRTNELE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUM7Z0JBQ3hCLEtBQUssRUFBRSw0QkFBNEI7YUFDcEMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUM3QyxDQUFDO1FBQ0QsTUFBTTtZQUNKLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTtnQkFDZCxLQUFLLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRTt3QkFDOUIsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLEtBQUs7d0JBQ3pDLDZCQUE2QixFQUFFLElBQUksQ0FBQyxLQUFLO3FCQUMxQyxDQUFDO2FBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDMUIsQ0FBQztRQUNELFVBQVU7WUFDUixNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUE7WUFFbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPO2dCQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7WUFFL0MsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO2dCQUNkLEtBQUssRUFBRSwwQkFBMEI7YUFDbEMsRUFBRSxRQUFRLENBQUMsQ0FBQTtRQUNkLENBQUM7UUFDRCxXQUFXO1lBQ1QsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO2dCQUNkLEtBQUssRUFBRSwyQkFBMkI7YUFDbkMsRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUE7UUFDL0IsQ0FBQztLQUNGO0lBRUQsTUFBTTtRQUNKLE1BQU0sUUFBUSxHQUFHO1lBQ2YsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLElBQUksQ0FBQyxVQUFVLEVBQUU7U0FDbEIsQ0FBQTtRQUVELElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRO1lBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQTtRQUUzRCxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDZCxLQUFLLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRTtvQkFDekIsMkJBQTJCLEVBQUUsSUFBSSxDQUFDLE9BQU87b0JBQ3pDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSTtvQkFDekUsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLO29CQUN4RSxHQUFHLElBQUksQ0FBQyxZQUFZO2lCQUNyQixDQUFDO1NBQ0gsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUNkLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2h9IGZyb20gJ3Z1ZSdcbi8vIFR5cGVzXG5pbXBvcnQgbWl4aW5zLCB7IEV4dHJhY3RWdWUgfSBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IFZOb2RlLCBWTm9kZURhdGEgfSBmcm9tICd2dWUnXG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCBWVGltZWxpbmUgZnJvbSAnLi9WVGltZWxpbmUnXG5pbXBvcnQgVkljb24gZnJvbSAnLi4vVkljb24nXG5cbi8vIE1peGluc1xuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xuaW1wb3J0IHsgZ2V0U2xvdCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcbmltcG9ydCBtZXJnZURhdGEgZnJvbSAnLi4vLi4vdXRpbC9tZXJnZURhdGEnXG5cbmNvbnN0IGJhc2VNaXhpbnMgPSBtaXhpbnMoXG4gIENvbG9yYWJsZSxcbiAgVGhlbWVhYmxlXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuKVxuXG50eXBlIFZUaW1lbGluZUluc3RhbmNlID0gSW5zdGFuY2VUeXBlPHR5cGVvZiBWVGltZWxpbmU+XG5cbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgRXh0cmFjdFZ1ZTx0eXBlb2YgYmFzZU1peGlucz4ge1xuICB0aW1lbGluZTogVlRpbWVsaW5lSW5zdGFuY2Vcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZU1peGlucy5leHRlbmQoe1xuICBuYW1lOiAndi10aW1lbGluZS1pdGVtJyxcblxuICBpbmplY3Q6IFsndGltZWxpbmUnXSxcblxuICBwcm9wczoge1xuICAgIGNvbG9yOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAncHJpbWFyeScsXG4gICAgfSxcbiAgICBmaWxsRG90OiBCb29sZWFuLFxuICAgIGhpZGVEb3Q6IEJvb2xlYW4sXG4gICAgaWNvbjogU3RyaW5nLFxuICAgIGljb25Db2xvcjogU3RyaW5nLFxuICAgIGxhcmdlOiBCb29sZWFuLFxuICAgIGxlZnQ6IEJvb2xlYW4sXG4gICAgcmlnaHQ6IEJvb2xlYW4sXG4gICAgc21hbGw6IEJvb2xlYW4sXG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBoYXNJY29uICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAhIXRoaXMuaWNvbiB8fCAhIXRoaXMuJHNsb3RzLmljb25cbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5Cb2R5ICgpIHtcbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiAndi10aW1lbGluZS1pdGVtX19ib2R5JyxcbiAgICAgIH0sIGdldFNsb3QodGhpcykpXG4gICAgfSxcbiAgICBnZW5JY29uICgpOiBWTm9kZSB8IFZOb2RlW10ge1xuICAgICAgcmV0dXJuIGdldFNsb3QodGhpcywgJ2ljb24nKSB8fCBoKFZJY29uLCB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmljb25Db2xvcixcbiAgICAgICAgZGFyazogIXRoaXMudGhlbWUuaXNEYXJrLFxuICAgICAgICBzbWFsbDogdGhpcy5zbWFsbFxuICAgICAgfSwgdGhpcy5pY29uKVxuICAgIH0sXG4gICAgZ2VuSW5uZXJEb3QgKCkge1xuICAgICAgY29uc3QgZGF0YTogVk5vZGVEYXRhID0gdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb2xvcilcblxuICAgICAgcmV0dXJuIGgoJ2RpdicsIG1lcmdlRGF0YSh7XG4gICAgICAgIGNsYXNzOiAndi10aW1lbGluZS1pdGVtX19pbm5lci1kb3QnLFxuICAgICAgfSwgZGF0YSksIFt0aGlzLmhhc0ljb24gJiYgdGhpcy5nZW5JY29uKCldKVxuICAgIH0sXG4gICAgZ2VuRG90ICgpIHtcbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiBbJ3YtdGltZWxpbmUtaXRlbV9fZG90Jywge1xuICAgICAgICAgICd2LXRpbWVsaW5lLWl0ZW1fX2RvdC0tc21hbGwnOiB0aGlzLnNtYWxsLFxuICAgICAgICAgICd2LXRpbWVsaW5lLWl0ZW1fX2RvdC0tbGFyZ2UnOiB0aGlzLmxhcmdlLFxuICAgICAgICB9XSxcbiAgICAgIH0sIFt0aGlzLmdlbklubmVyRG90KCldKVxuICAgIH0sXG4gICAgZ2VuRGl2aWRlciAoKSB7XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IFtdXG5cbiAgICAgIGlmICghdGhpcy5oaWRlRG90KSBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuRG90KCkpXG5cbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiAndi10aW1lbGluZS1pdGVtX19kaXZpZGVyJyxcbiAgICAgIH0sIGNoaWxkcmVuKVxuICAgIH0sXG4gICAgZ2VuT3Bwb3NpdGUgKCkge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6ICd2LXRpbWVsaW5lLWl0ZW1fX29wcG9zaXRlJyxcbiAgICAgIH0sIGdldFNsb3QodGhpcywgJ29wcG9zaXRlJykpXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKCk6IFZOb2RlIHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IFtcbiAgICAgIHRoaXMuZ2VuQm9keSgpLFxuICAgICAgdGhpcy5nZW5EaXZpZGVyKCksXG4gICAgXVxuXG4gICAgaWYgKHRoaXMuJHNsb3RzLm9wcG9zaXRlKSBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuT3Bwb3NpdGUoKSlcblxuICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICBjbGFzczogWyd2LXRpbWVsaW5lLWl0ZW0nLCB7XG4gICAgICAgICd2LXRpbWVsaW5lLWl0ZW0tLWZpbGwtZG90JzogdGhpcy5maWxsRG90LFxuICAgICAgICAndi10aW1lbGluZS1pdGVtLS1iZWZvcmUnOiB0aGlzLnRpbWVsaW5lLnJldmVyc2UgPyB0aGlzLnJpZ2h0IDogdGhpcy5sZWZ0LFxuICAgICAgICAndi10aW1lbGluZS1pdGVtLS1hZnRlcic6IHRoaXMudGltZWxpbmUucmV2ZXJzZSA/IHRoaXMubGVmdCA6IHRoaXMucmlnaHQsXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzLFxuICAgICAgfV0sXG4gICAgfSwgY2hpbGRyZW4pXG4gIH0sXG59KVxuIl19