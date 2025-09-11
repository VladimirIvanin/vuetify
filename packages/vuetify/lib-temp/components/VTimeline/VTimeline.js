import { h } from 'vue';
// Styles
import './VTimeline.sass';
import mixins from '../../util/mixins';
// Mixins
import Themeable from '../../mixins/themeable';
import { getSlot } from '../../util/helpers';
export default mixins(Themeable
/* @vue/component */
).extend({
    name: 'v-timeline',
    provide() {
        return { timeline: this };
    },
    props: {
        alignTop: Boolean,
        dense: Boolean,
        reverse: Boolean,
    },
    computed: {
        classes() {
            return {
                'v-timeline--align-top': this.alignTop,
                'v-timeline--dense': this.dense,
                'v-timeline--reverse': this.reverse,
                ...this.themeClasses,
            };
        },
    },
    render() {
        return h('div', {
            class: ['v-timeline', this.classes],
        }, getSlot(this));
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRpbWVsaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlRpbWVsaW5lL1ZUaW1lbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsQ0FBQyxFQUFDLE1BQU0sS0FBSyxDQUFBO0FBQ3JCLFNBQVM7QUFDVCxPQUFPLGtCQUFrQixDQUFBO0FBSXpCLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBRXRDLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFNUMsZUFBZSxNQUFNLENBQ25CLFNBQVM7QUFDWCxvQkFBb0I7Q0FDbkIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsWUFBWTtJQUVsQixPQUFPO1FBQ0wsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQTtJQUMzQixDQUFDO0lBRUQsS0FBSyxFQUFFO1FBQ0wsUUFBUSxFQUFFLE9BQU87UUFDakIsS0FBSyxFQUFFLE9BQU87UUFDZCxPQUFPLEVBQUUsT0FBTztLQUNqQjtJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPO2dCQUNMLHVCQUF1QixFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN0QyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDL0IscUJBQXFCLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ25DLEdBQUcsSUFBSSxDQUFDLFlBQVk7YUFDckIsQ0FBQTtRQUNILENBQUM7S0FDRjtJQUVELE1BQU07UUFDSixPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDZCxLQUFLLEVBQUUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUNwQyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBQ25CLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2h9IGZyb20gJ3Z1ZSdcbi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZUaW1lbGluZS5zYXNzJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcbmltcG9ydCB7IGdldFNsb3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcbiAgVGhlbWVhYmxlXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuKS5leHRlbmQoe1xuICBuYW1lOiAndi10aW1lbGluZScsXG5cbiAgcHJvdmlkZSAoKTogb2JqZWN0IHtcbiAgICByZXR1cm4geyB0aW1lbGluZTogdGhpcyB9XG4gIH0sXG5cbiAgcHJvcHM6IHtcbiAgICBhbGlnblRvcDogQm9vbGVhbixcbiAgICBkZW5zZTogQm9vbGVhbixcbiAgICByZXZlcnNlOiBCb29sZWFuLFxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKToge30ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ3YtdGltZWxpbmUtLWFsaWduLXRvcCc6IHRoaXMuYWxpZ25Ub3AsXG4gICAgICAgICd2LXRpbWVsaW5lLS1kZW5zZSc6IHRoaXMuZGVuc2UsXG4gICAgICAgICd2LXRpbWVsaW5lLS1yZXZlcnNlJzogdGhpcy5yZXZlcnNlLFxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3NlcyxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoKTogVk5vZGUge1xuICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICBjbGFzczogWyd2LXRpbWVsaW5lJywgdGhpcy5jbGFzc2VzXSxcbiAgICB9LCBnZXRTbG90KHRoaXMpKVxuICB9LFxufSlcbiJdfQ==