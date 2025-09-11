import { TransitionGroup, h, withDirectives } from 'vue';
// Styles
import './VSpeedDial.sass';
// Mixins
import Toggleable from '../../mixins/toggleable';
import Positionable from '../../mixins/positionable';
import Transitionable from '../../mixins/transitionable';
// Directives
import ClickOutside from '../../directives/click-outside';
// Types
import mixins from '../../util/mixins';
import { getSlot } from '../../util/helpers';
/* @vue/component */
export default mixins(Positionable, Toggleable, Transitionable).extend({
    name: 'v-speed-dial',
    props: {
        direction: {
            type: String,
            default: 'top',
            validator: (val) => {
                return ['top', 'right', 'bottom', 'left'].includes(val);
            },
        },
        openOnHover: Boolean,
        transition: {
            type: String,
            default: 'scale-transition',
        },
    },
    emits: ['update:modelValue'],
    computed: {
        classes() {
            return {
                'v-speed-dial': true,
                'v-speed-dial--top': this.top,
                'v-speed-dial--right': this.right,
                'v-speed-dial--bottom': this.bottom,
                'v-speed-dial--left': this.left,
                'v-speed-dial--absolute': this.absolute,
                'v-speed-dial--fixed': this.fixed,
                [`v-speed-dial--direction-${this.direction}`]: true,
                'v-speed-dial--is-active': this.isActive,
            };
        },
    },
    render() {
        let children = [];
        const data = {
            class: this.classes,
            onClick: () => (this.isActive = !this.isActive),
        };
        if (this.openOnHover) {
            data.onMouseenter = () => (this.isActive = true);
            data.onMouseleave = () => (this.isActive = false);
        }
        if (this.isActive) {
            let btnCount = 0;
            children = (getSlot(this) || []).map((b, i) => {
                const componentName = b.type && typeof b.type === 'object' && 'name' in b.type ? b.type.name : null;
                if (b.tag && (componentName === 'v-btn' || componentName === 'v-tooltip')) {
                    btnCount++;
                    return h('div', {
                        style: {
                            transitionDelay: btnCount * 0.05 + 's',
                        },
                        key: i,
                    }, [b]);
                }
                else {
                    b.key = i;
                    return b;
                }
            });
        }
        const list = h(TransitionGroup, {
            class: 'v-speed-dial__list',
            name: this.transition,
            mode: this.mode,
            origin: this.origin,
            tag: 'div',
        }, children);
        return withDirectives(h('div', data, [getSlot(this, 'activator'), list]), [
            [ClickOutside, () => (this.isActive = false)],
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNwZWVkRGlhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTcGVlZERpYWwvVlNwZWVkRGlhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZUFBZSxFQUFFLENBQUMsRUFBb0IsY0FBYyxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBQzFFLFNBQVM7QUFDVCxPQUFPLG1CQUFtQixDQUFBO0FBRTFCLFNBQVM7QUFDVCxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFlBQVksTUFBTSwyQkFBMkIsQ0FBQTtBQUNwRCxPQUFPLGNBQWMsTUFBTSw2QkFBNkIsQ0FBQTtBQUV4RCxhQUFhO0FBQ2IsT0FBTyxZQUFZLE1BQU0sZ0NBQWdDLENBQUE7QUFFekQsUUFBUTtBQUNSLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBR3RDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUU1QyxvQkFBb0I7QUFDcEIsZUFBZSxNQUFNLENBQUMsWUFBWSxFQUFFLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDckUsSUFBSSxFQUFFLGNBQWM7SUFFcEIsS0FBSyxFQUFFO1FBQ0wsU0FBUyxFQUFFO1lBQ1QsSUFBSSxFQUFFLE1BQW1EO1lBQ3pELE9BQU8sRUFBRSxLQUFLO1lBQ2QsU0FBUyxFQUFFLENBQUMsR0FBVyxFQUFFLEVBQUU7Z0JBQ3pCLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDekQsQ0FBQztTQUNGO1FBQ0QsV0FBVyxFQUFFLE9BQU87UUFDcEIsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsa0JBQWtCO1NBQzVCO0tBQ0Y7SUFFRCxLQUFLLEVBQUUsQ0FBQyxtQkFBbUIsQ0FB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LENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxDQUFDO1NBQzlDLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUcmFuc2l0aW9uR3JvdXAsIGgsIFZOb2RlLCBWTm9kZURhdGEsIHdpdGhEaXJlY3RpdmVzIH0gZnJvbSAndnVlJ1xuLy8gU3R5bGVzXG5pbXBvcnQgJy4vVlNwZWVkRGlhbC5zYXNzJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBUb2dnbGVhYmxlIGZyb20gJy4uLy4uL21peGlucy90b2dnbGVhYmxlJ1xuaW1wb3J0IFBvc2l0aW9uYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvcG9zaXRpb25hYmxlJ1xuaW1wb3J0IFRyYW5zaXRpb25hYmxlIGZyb20gJy4uLy4uL21peGlucy90cmFuc2l0aW9uYWJsZSdcblxuLy8gRGlyZWN0aXZlc1xuaW1wb3J0IENsaWNrT3V0c2lkZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL2NsaWNrLW91dHNpZGUnXG5cbi8vIFR5cGVzXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG5pbXBvcnQgeyBQcm9wIH0gZnJvbSAndnVlL3R5cGVzL29wdGlvbnMnXG5pbXBvcnQgeyBnZXRTbG90IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFBvc2l0aW9uYWJsZSwgVG9nZ2xlYWJsZSwgVHJhbnNpdGlvbmFibGUpLmV4dGVuZCh7XG4gIG5hbWU6ICd2LXNwZWVkLWRpYWwnLFxuXG4gIHByb3BzOiB7XG4gICAgZGlyZWN0aW9uOiB7XG4gICAgICB0eXBlOiBTdHJpbmcgYXMgUHJvcDwndG9wJyB8ICdyaWdodCcgfCAnYm90dG9tJyB8ICdsZWZ0Jz4sXG4gICAgICBkZWZhdWx0OiAndG9wJyxcbiAgICAgIHZhbGlkYXRvcjogKHZhbDogc3RyaW5nKSA9PiB7XG4gICAgICAgIHJldHVybiBbJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCddLmluY2x1ZGVzKHZhbClcbiAgICAgIH0sXG4gICAgfSxcbiAgICBvcGVuT25Ib3ZlcjogQm9vbGVhbixcbiAgICB0cmFuc2l0aW9uOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnc2NhbGUtdHJhbnNpdGlvbicsXG4gICAgfSxcbiAgfSxcblxuICBlbWl0czogWyd1cGRhdGU6bW9kZWxWYWx1ZSddLFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LXNwZWVkLWRpYWwnOiB0cnVlLFxuICAgICAgICAndi1zcGVlZC1kaWFsLS10b3AnOiB0aGlzLnRvcCxcbiAgICAgICAgJ3Ytc3BlZWQtZGlhbC0tcmlnaHQnOiB0aGlzLnJpZ2h0LFxuICAgICAgICAndi1zcGVlZC1kaWFsLS1ib3R0b20nOiB0aGlzLmJvdHRvbSxcbiAgICAgICAgJ3Ytc3BlZWQtZGlhbC0tbGVmdCc6IHRoaXMubGVmdCxcbiAgICAgICAgJ3Ytc3BlZWQtZGlhbC0tYWJzb2x1dGUnOiB0aGlzLmFic29sdXRlLFxuICAgICAgICAndi1zcGVlZC1kaWFsLS1maXhlZCc6IHRoaXMuZml4ZWQsXG4gICAgICAgIFtgdi1zcGVlZC1kaWFsLS1kaXJlY3Rpb24tJHt0aGlzLmRpcmVjdGlvbn1gXTogdHJ1ZSxcbiAgICAgICAgJ3Ytc3BlZWQtZGlhbC0taXMtYWN0aXZlJzogdGhpcy5pc0FjdGl2ZSxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoKTogVk5vZGUge1xuICAgIGxldCBjaGlsZHJlbjogVk5vZGVbXSA9IFtdXG4gICAgY29uc3QgZGF0YTogVk5vZGVEYXRhID0ge1xuICAgICAgY2xhc3M6IHRoaXMuY2xhc3NlcyxcbiAgICAgIG9uQ2xpY2s6ICgpID0+ICh0aGlzLmlzQWN0aXZlID0gIXRoaXMuaXNBY3RpdmUpLFxuICAgIH1cblxuICAgIGlmICh0aGlzLm9wZW5PbkhvdmVyKSB7XG4gICAgICBkYXRhLm9uTW91c2VlbnRlciA9ICgpID0+ICh0aGlzLmlzQWN0aXZlID0gdHJ1ZSlcbiAgICAgIGRhdGEub25Nb3VzZWxlYXZlID0gKCkgPT4gKHRoaXMuaXNBY3RpdmUgPSBmYWxzZSlcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0FjdGl2ZSkge1xuICAgICAgbGV0IGJ0bkNvdW50ID0gMFxuICAgICAgY2hpbGRyZW4gPSAoZ2V0U2xvdCh0aGlzKSB8fCBbXSkubWFwKChiLCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudE5hbWUgPSBiLnR5cGUgJiYgdHlwZW9mIGIudHlwZSA9PT0gJ29iamVjdCcgJiYgJ25hbWUnIGluIGIudHlwZSA/IGIudHlwZS5uYW1lIDogbnVsbFxuICAgICAgICBpZiAoYi50YWcgJiYgKGNvbXBvbmVudE5hbWUgPT09ICd2LWJ0bicgfHwgY29tcG9uZW50TmFtZSA9PT0gJ3YtdG9vbHRpcCcpKSB7XG4gICAgICAgICAgYnRuQ291bnQrK1xuICAgICAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uRGVsYXk6IGJ0bkNvdW50ICogMC4wNSArICdzJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBrZXk6IGksXG4gICAgICAgICAgfSwgW2JdKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGIua2V5ID0gaVxuICAgICAgICAgIHJldHVybiBiXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgbGlzdCA9IGgoVHJhbnNpdGlvbkdyb3VwLCB7XG4gICAgICBjbGFzczogJ3Ytc3BlZWQtZGlhbF9fbGlzdCcsXG4gICAgICBuYW1lOiB0aGlzLnRyYW5zaXRpb24sXG4gICAgICBtb2RlOiB0aGlzLm1vZGUsXG4gICAgICBvcmlnaW46IHRoaXMub3JpZ2luLFxuICAgICAgdGFnOiAnZGl2JyxcbiAgICB9LCBjaGlsZHJlbilcblxuICAgIHJldHVybiB3aXRoRGlyZWN0aXZlcyhoKCdkaXYnLCBkYXRhLCBbZ2V0U2xvdCh0aGlzLCAnYWN0aXZhdG9yJyksIGxpc3RdKSwgW1xuICAgICAgW0NsaWNrT3V0c2lkZSwgKCkgPT4gKHRoaXMuaXNBY3RpdmUgPSBmYWxzZSldLFxuICAgIF0pXG4gIH0sXG59KVxuIl19