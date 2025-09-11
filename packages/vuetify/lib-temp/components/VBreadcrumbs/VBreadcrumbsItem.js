import { h, withDirectives } from 'vue';
import Routable from '../../mixins/routable';
import mixins from '../../util/mixins';
import { getSlot } from '../../util/helpers';
/* @vue/component */
export default mixins(Routable).extend({
    name: 'v-breadcrumbs-item',
    props: {
        // In a breadcrumb, the currently
        // active item should be dimmed
        activeClass: {
            type: String,
            default: 'v-breadcrumbs__item--disabled',
        },
        ripple: {
            type: [Boolean, Object],
            default: false,
        },
    },
    computed: {
        classes() {
            return {
                'v-breadcrumbs__item': true,
                [this.activeClass]: this.disabled,
            };
        },
    },
    render() {
        const { tag, data, directives } = this.generateRouteLink();
        return withDirectives(h('li', [
            h(tag, {
                ...data,
                'aria-current': this.isActive && this.isLink ? 'page' : undefined,
            }, getSlot(this)),
        ]), directives);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkJyZWFkY3J1bWJzSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZCcmVhZGNydW1icy9WQnJlYWRjcnVtYnNJdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxDQUFDLEVBQUUsY0FBYyxFQUFDLE1BQU0sS0FBSyxDQUFBO0FBQ3JDLE9BQU8sUUFBUSxNQUFNLHVCQUF1QixDQUFBO0FBRTVDLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBQ3RDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUc1QyxvQkFBb0I7QUFDcEIsZUFBZSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ3JDLElBQUksRUFBRSxvQkFBb0I7SUFFMUIsS0FBSyxFQUFFO1FBQ0wsaUNBQWlDO1FBQ2pDLCtCQUErQjtRQUMvQixXQUFXLEVBQUU7WUFDWCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSwrQkFBK0I7U0FDekM7UUFDRCxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO1lBQ3ZCLE9BQU8sRUFBRSxLQUFLO1NBQ2Y7S0FDRjtJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPO2dCQUNMLHFCQUFxQixFQUFFLElBQUk7Z0JBQzNCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRO2FBQ2xDLENBQUE7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxNQUFNO1FBQ0osTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFFMUQsT0FBTyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTtZQUM1QixDQUFDLENBQUMsR0FBRyxFQUFFO2dCQUNMLEdBQUcsSUFBSTtnQkFDUCxjQUFjLEVBQUUsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVM7YUFDbEUsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEIsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFBO0lBQ2pCLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2gsIHdpdGhEaXJlY3RpdmVzfSBmcm9tICd2dWUnXG5pbXBvcnQgUm91dGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3JvdXRhYmxlJ1xuXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuaW1wb3J0IHsgZ2V0U2xvdCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFJvdXRhYmxlKS5leHRlbmQoe1xuICBuYW1lOiAndi1icmVhZGNydW1icy1pdGVtJyxcblxuICBwcm9wczoge1xuICAgIC8vIEluIGEgYnJlYWRjcnVtYiwgdGhlIGN1cnJlbnRseVxuICAgIC8vIGFjdGl2ZSBpdGVtIHNob3VsZCBiZSBkaW1tZWRcbiAgICBhY3RpdmVDbGFzczoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ3YtYnJlYWRjcnVtYnNfX2l0ZW0tLWRpc2FibGVkJyxcbiAgICB9LFxuICAgIHJpcHBsZToge1xuICAgICAgdHlwZTogW0Jvb2xlYW4sIE9iamVjdF0sXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LWJyZWFkY3J1bWJzX19pdGVtJzogdHJ1ZSxcbiAgICAgICAgW3RoaXMuYWN0aXZlQ2xhc3NdOiB0aGlzLmRpc2FibGVkLFxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgY29uc3QgeyB0YWcsIGRhdGEsIGRpcmVjdGl2ZXMgfSA9IHRoaXMuZ2VuZXJhdGVSb3V0ZUxpbmsoKVxuXG4gICAgcmV0dXJuIHdpdGhEaXJlY3RpdmVzKGgoJ2xpJywgW1xuICAgICAgaCh0YWcsIHtcbiAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgJ2FyaWEtY3VycmVudCc6IHRoaXMuaXNBY3RpdmUgJiYgdGhpcy5pc0xpbmsgPyAncGFnZScgOiB1bmRlZmluZWQsXG4gICAgICB9LCBnZXRTbG90KHRoaXMpKSxcbiAgICBdKSwgZGlyZWN0aXZlcylcbiAgfSxcbn0pXG4iXX0=