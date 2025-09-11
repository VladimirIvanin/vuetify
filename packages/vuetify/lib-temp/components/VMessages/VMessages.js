// Styles
import './VMessages.sass';
// Mixins
import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable';
// Types
import { TransitionGroup, h } from 'vue';
import mixins from '../../util/mixins';
// Utilities
import { getSlot } from '../../util/helpers';
import { breaking } from '../../util/console';
/* @vue/component */
export default mixins(Colorable, Themeable).extend({
    name: 'v-messages',
    props: {
        modelValue: {
            type: Array,
            default: () => ([]),
        },
    },
    created() {
        const breakingProps = [
            ['value', 'modelValue'],
        ];
        /* istanbul ignore next */
        breakingProps.forEach(([original, replacement]) => {
            if (this.$attrs.hasOwnProperty(original))
                breaking(original, replacement, this);
        });
    },
    methods: {
        genChildren() {
            return h(TransitionGroup, {
                class: 'v-messages__wrapper',
                name: 'message-transition',
                tag: 'div',
            }, () => this.modelValue.map(this.genMessage));
        },
        genMessage(message, key) {
            return h('div', {
                class: 'v-messages__message',
                key,
            }, getSlot(this, 'default', { message, key }) || [message]);
        },
    },
    render() {
        return h('div', this.setTextColor(this.color, {
            class: ['v-messages', this.themeClasses],
        }), [this.genChildren()]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVk1lc3NhZ2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVk1lc3NhZ2VzL1ZNZXNzYWdlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxrQkFBa0IsQ0FBQTtBQUV6QixTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsUUFBUTtBQUNSLE9BQU8sRUFBRSxlQUFlLEVBQVMsQ0FBQyxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBQy9DLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBRXRDLFlBQVk7QUFDWixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDNUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRTdDLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ2pELElBQUksRUFBRSxZQUFZO0lBRWxCLEtBQUssRUFBRTtRQUNMLFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxLQUFLO1lBQ1gsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO1NBQ3BCO0tBQ0Y7SUFFRCxPQUFPO1FBQ0wsTUFBTSxhQUFhLEdBQUc7WUFDcEIsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDO1NBQ3hCLENBQUE7UUFFRCwwQkFBMEI7UUFDMUIsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxFQUFFLEVBQUU7WUFDaEQsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUM7Z0JBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDakYsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsT0FBTyxFQUFFO1FBQ1AsV0FBVztZQUNULE9BQU8sQ0FBQyxDQUFDLGVBQWUsRUFBRTtnQkFDeEIsS0FBSyxFQUFFLHFCQUFxQjtnQkFDNUIsSUFBSSxFQUFFLG9CQUFvQjtnQkFDMUIsR0FBRyxFQUFFLEtBQUs7YUFDWCxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFBO1FBQ2hELENBQUM7UUFDRCxVQUFVLENBQUUsT0FBZSxFQUFFLEdBQVc7WUFDdEMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO2dCQUNkLEtBQUssRUFBRSxxQkFBcUI7Z0JBQzVCLEdBQUc7YUFDSixFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBQzdELENBQUM7S0FDRjtJQUVELE1BQU07UUFDSixPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQzVDLEtBQUssRUFBRSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDO1NBQ3pDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDM0IsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZNZXNzYWdlcy5zYXNzJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcblxuLy8gVHlwZXNcbmltcG9ydCB7IFRyYW5zaXRpb25Hcm91cCwgVk5vZGUsIGggfSBmcm9tICd2dWUnXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCB7IGdldFNsb3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5pbXBvcnQgeyBicmVha2luZyB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IG1peGlucyhDb2xvcmFibGUsIFRoZW1lYWJsZSkuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtbWVzc2FnZXMnLFxuXG4gIHByb3BzOiB7XG4gICAgbW9kZWxWYWx1ZToge1xuICAgICAgdHlwZTogQXJyYXksXG4gICAgICBkZWZhdWx0OiAoKSA9PiAoW10pLFxuICAgIH0sXG4gIH0sXG5cbiAgY3JlYXRlZCAoKSB7XG4gICAgY29uc3QgYnJlYWtpbmdQcm9wcyA9IFtcbiAgICAgIFsndmFsdWUnLCAnbW9kZWxWYWx1ZSddLFxuICAgIF1cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgYnJlYWtpbmdQcm9wcy5mb3JFYWNoKChbb3JpZ2luYWwsIHJlcGxhY2VtZW50XSkgPT4ge1xuICAgICAgaWYgKHRoaXMuJGF0dHJzLmhhc093blByb3BlcnR5KG9yaWdpbmFsKSkgYnJlYWtpbmcob3JpZ2luYWwsIHJlcGxhY2VtZW50LCB0aGlzKVxuICAgIH0pXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGdlbkNoaWxkcmVuICgpIHtcbiAgICAgIHJldHVybiBoKFRyYW5zaXRpb25Hcm91cCwge1xuICAgICAgICBjbGFzczogJ3YtbWVzc2FnZXNfX3dyYXBwZXInLFxuICAgICAgICBuYW1lOiAnbWVzc2FnZS10cmFuc2l0aW9uJyxcbiAgICAgICAgdGFnOiAnZGl2JyxcbiAgICAgIH0sICgpID0+IHRoaXMubW9kZWxWYWx1ZS5tYXAodGhpcy5nZW5NZXNzYWdlKSlcbiAgICB9LFxuICAgIGdlbk1lc3NhZ2UgKG1lc3NhZ2U6IHN0cmluZywga2V5OiBudW1iZXIpIHtcbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiAndi1tZXNzYWdlc19fbWVzc2FnZScsXG4gICAgICAgIGtleSxcbiAgICAgIH0sIGdldFNsb3QodGhpcywgJ2RlZmF1bHQnLCB7IG1lc3NhZ2UsIGtleSB9KSB8fCBbbWVzc2FnZV0pXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKCk6IFZOb2RlIHtcbiAgICByZXR1cm4gaCgnZGl2JywgdGhpcy5zZXRUZXh0Q29sb3IodGhpcy5jb2xvciwge1xuICAgICAgY2xhc3M6IFsndi1tZXNzYWdlcycsIHRoaXMudGhlbWVDbGFzc2VzXSxcbiAgICB9KSwgW3RoaXMuZ2VuQ2hpbGRyZW4oKV0pXG4gIH0sXG59KVxuIl19