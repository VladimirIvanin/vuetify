// Styles
import './VBtn.sass';
// Extensions
import VSheet from '../VSheet';
// Components
import VProgressCircular from '../VProgressCircular';
// Mixins
import { factory as GroupableFactory } from '../../mixins/groupable';
import { factory as ToggleableFactory } from '../../mixins/toggleable';
import Positionable from '../../mixins/positionable';
import Routable from '../../mixins/routable';
import Sizeable from '../../mixins/sizeable';
// Utilities
import mixins from '../../util/mixins';
import { breaking } from '../../util/console';
import { getSlot } from '../../util/helpers';
// Types
import { withDirectives, h } from 'vue';
const baseMixins = mixins(VSheet, Routable, Positionable, Sizeable, GroupableFactory('btnToggle'), ToggleableFactory()
/* @vue/component */
);
export default baseMixins.extend({
    name: 'v-btn',
    props: {
        activeClass: {
            type: String,
        },
        block: Boolean,
        depressed: Boolean,
        fab: Boolean,
        icon: Boolean,
        loading: Boolean,
        outlined: Boolean,
        plain: Boolean,
        retainFocusOnClick: Boolean,
        rounded: Boolean,
        tag: {
            type: String,
            default: 'button',
        },
        text: Boolean,
        tile: Boolean,
        type: {
            type: String,
            default: 'button',
        },
        value: null,
    },
    emits: ['click', 'change', 'update:modelValue'],
    data: () => ({
        proxyClass: 'v-btn--active',
    }),
    computed: {
        classes() {
            return {
                'v-btn': true,
                ...Routable.computed.classes.call(this),
                'v-btn--absolute': this.absolute,
                'v-btn--block': this.block,
                'v-btn--bottom': this.bottom,
                'v-btn--disabled': this.disabled,
                'v-btn--is-elevated': this.isElevated,
                'v-btn--fab': this.fab,
                'v-btn--fixed': this.fixed,
                'v-btn--has-bg': this.hasBg,
                'v-btn--icon': this.icon,
                'v-btn--left': this.left,
                'v-btn--loading': this.loading,
                'v-btn--outlined': this.outlined,
                'v-btn--plain': this.plain,
                'v-btn--right': this.right,
                'v-btn--round': this.isRound,
                'v-btn--rounded': this.rounded,
                'v-btn--router': this.to,
                'v-btn--text': this.text,
                'v-btn--tile': this.tile,
                'v-btn--top': this.top,
                ...this.themeClasses,
                ...this.groupClasses,
                ...this.elevationClasses,
                ...this.sizeableClasses,
            };
        },
        computedElevation() {
            if (this.disabled)
                return undefined;
            return this.elevation;
        },
        computedRipple() {
            var _a;
            const defaultRipple = this.icon || this.fab ? { circle: true } : true;
            if (this.disabled)
                return false;
            else
                return (_a = this.ripple) !== null && _a !== void 0 ? _a : defaultRipple;
        },
        hasBg() {
            return !this.text && !this.plain && !this.outlined && !this.icon;
        },
        isElevated() {
            return Boolean(!this.icon &&
                !this.text &&
                !this.outlined &&
                !this.depressed &&
                !this.disabled &&
                !this.plain &&
                (this.elevation == null || Number(this.elevation) > 0));
        },
        isRound() {
            return Boolean(this.icon ||
                this.fab);
        },
        styles() {
            return {
                ...this.measurableStyles,
            };
        },
    },
    created() {
        const breakingProps = [
            ['flat', 'text'],
            ['outline', 'outlined'],
            ['round', 'rounded'],
        ];
        /* istanbul ignore next */
        breakingProps.forEach(([original, replacement]) => {
            if (this.$attrs.hasOwnProperty(original))
                breaking(original, replacement, this);
        });
    },
    methods: {
        click(e) {
            // TODO: Remove this in v3
            !this.retainFocusOnClick && !this.fab && e.detail && this.$el.blur();
            this.$emit('click', e);
            this.$emitLegacy('click', e);
            this.btnToggle && this.toggle();
        },
        genContent() {
            return h('span', {
                class: 'v-btn__content',
            }, getSlot(this));
        },
        genLoader() {
            return h('span', {
                class: 'v-btn__loader',
            }, getSlot(this, 'loader') || [h(VProgressCircular, {
                    indeterminate: true,
                    size: 23,
                    width: 2,
                })]);
        },
    },
    render() {
        const children = [
            this.genContent(),
            this.loading && this.genLoader(),
        ];
        const { tag, data: linkData, directives } = this.generateRouteLink();
        const setColor = this.hasBg
            ? this.setBackgroundColor
            : this.setTextColor;
        // Merge component classes with routable classes
        const mergedClasses = {
            ...this.classes,
            ...linkData.class,
        };
        if (tag === 'button') {
            linkData.type = this.type;
            linkData.disabled = this.disabled;
        }
        linkData.value = ['string', 'number'].includes(typeof this.value)
            ? this.value
            : JSON.stringify(this.value);
        const data = {
            ...linkData,
            class: mergedClasses,
            style: this.styles,
        };
        // Apply color styling but preserve Vue's automatic attribute inheritance
        const finalData = this.disabled ? data : setColor(this.color, data);
        const vnode = typeof tag === 'string'
            ? h(tag, finalData, children)
            : h(tag, finalData, () => children);
        return withDirectives(vnode, directives);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkJ0bi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZCdG4vVkJ0bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxhQUFhLENBQUE7QUFFcEIsYUFBYTtBQUNiLE9BQU8sTUFBTSxNQUFNLFdBQVcsQ0FBQTtBQUU5QixhQUFhO0FBQ2IsT0FBTyxpQkFBaUIsTUFBTSxzQkFBc0IsQ0FBQTtBQUVwRCxTQUFTO0FBQ1QsT0FBTyxFQUFFLE9BQU8sSUFBSSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFBO0FBQ3BFLE9BQU8sRUFBRSxPQUFPLElBQUksaUJBQWlCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQTtBQUV0RSxPQUFPLFlBQVksTUFBTSwyQkFBMkIsQ0FBQTtBQUNwRCxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUM1QyxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUU1QyxZQUFZO0FBQ1osT0FBTyxNQUFzQixNQUFNLG1CQUFtQixDQUFBO0FBQ3RELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUM3QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFNUMsUUFBUTtBQUNSLE9BQU8sRUFBUyxjQUFjLEVBQUUsQ0FBQyxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBSTlDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FDdkIsTUFBTSxFQUNOLFFBQVEsRUFDUixZQUFZLEVBQ1osUUFBUSxFQUNSLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxFQUM3QixpQkFBaUIsRUFBRTtBQUNuQixvQkFBb0I7Q0FDckIsQ0FBQTtBQUtELGVBQWUsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUMvQixJQUFJLEVBQUUsT0FBTztJQUNiLEtBQUssRUFBRTtRQUNMLFdBQVcsRUFBRTtZQUNYLElBQUksRUFBRSxNQUFNO1NBQ21CO1FBQ2pDLEtBQUss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LENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcbmltcG9ydCAnLi9WQnRuLnNhc3MnXG5cbi8vIEV4dGVuc2lvbnNcbmltcG9ydCBWU2hlZXQgZnJvbSAnLi4vVlNoZWV0J1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgVlByb2dyZXNzQ2lyY3VsYXIgZnJvbSAnLi4vVlByb2dyZXNzQ2lyY3VsYXInXG5cbi8vIE1peGluc1xuaW1wb3J0IHsgZmFjdG9yeSBhcyBHcm91cGFibGVGYWN0b3J5IH0gZnJvbSAnLi4vLi4vbWl4aW5zL2dyb3VwYWJsZSdcbmltcG9ydCB7IGZhY3RvcnkgYXMgVG9nZ2xlYWJsZUZhY3RvcnkgfSBmcm9tICcuLi8uLi9taXhpbnMvdG9nZ2xlYWJsZSdcbmltcG9ydCBFbGV2YXRhYmxlIGZyb20gJy4uLy4uL21peGlucy9lbGV2YXRhYmxlJ1xuaW1wb3J0IFBvc2l0aW9uYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvcG9zaXRpb25hYmxlJ1xuaW1wb3J0IFJvdXRhYmxlIGZyb20gJy4uLy4uL21peGlucy9yb3V0YWJsZSdcbmltcG9ydCBTaXplYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvc2l6ZWFibGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IG1peGlucywgeyBFeHRyYWN0VnVlIH0gZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgeyBicmVha2luZyB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcbmltcG9ydCB7IGdldFNsb3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSwgd2l0aERpcmVjdGl2ZXMsIGggfSBmcm9tICd2dWUnXG5pbXBvcnQgeyBQcm9wVmFsaWRhdG9yLCBQcm9wVHlwZSB9IGZyb20gJ3Z1ZS90eXBlcy9vcHRpb25zJ1xuaW1wb3J0IHsgUmlwcGxlT3B0aW9ucyB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvcmlwcGxlJ1xuXG5jb25zdCBiYXNlTWl4aW5zID0gbWl4aW5zKFxuICBWU2hlZXQsXG4gIFJvdXRhYmxlLFxuICBQb3NpdGlvbmFibGUsXG4gIFNpemVhYmxlLFxuICBHcm91cGFibGVGYWN0b3J5KCdidG5Ub2dnbGUnKSxcbiAgVG9nZ2xlYWJsZUZhY3RvcnkoKVxuICAvKiBAdnVlL2NvbXBvbmVudCAqL1xuKVxuaW50ZXJmYWNlIG9wdGlvbnMgZXh0ZW5kcyBFeHRyYWN0VnVlPHR5cGVvZiBiYXNlTWl4aW5zPiB7XG4gICRlbDogSFRNTEVsZW1lbnRcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZU1peGlucy5leHRlbmQoe1xuICBuYW1lOiAndi1idG4nLFxuICBwcm9wczoge1xuICAgIGFjdGl2ZUNsYXNzOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgfSBhcyBhbnkgYXMgUHJvcFZhbGlkYXRvcjxzdHJpbmc+LFxuICAgIGJsb2NrOiBCb29sZWFuLFxuICAgIGRlcHJlc3NlZDogQm9vbGVhbixcbiAgICBmYWI6IEJvb2xlYW4sXG4gICAgaWNvbjogQm9vbGVhbixcbiAgICBsb2FkaW5nOiBCb29sZWFuLFxuICAgIG91dGxpbmVkOiBCb29sZWFuLFxuICAgIHBsYWluOiBCb29sZWFuLFxuICAgIHJldGFpbkZvY3VzT25DbGljazogQm9vbGVhbixcbiAgICByb3VuZGVkOiBCb29sZWFuLFxuICAgIHRhZzoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ2J1dHRvbicsXG4gICAgfSxcbiAgICB0ZXh0OiBCb29sZWFuLFxuICAgIHRpbGU6IEJvb2xlYW4sXG4gICAgdHlwZToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ2J1dHRvbicsXG4gICAgfSxcbiAgICB2YWx1ZTogbnVsbCBhcyBhbnkgYXMgUHJvcFR5cGU8YW55PixcbiAgfSxcblxuICBlbWl0czogWydjbGljaycsICdjaGFuZ2UnLCAndXBkYXRlOm1vZGVsVmFsdWUnXSxcblxuICBkYXRhOiAoKSA9PiAoe1xuICAgIHByb3h5Q2xhc3M6ICd2LWJ0bi0tYWN0aXZlJyxcbiAgfSksXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjbGFzc2VzICgpOiBhbnkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ3YtYnRuJzogdHJ1ZSxcbiAgICAgICAgLi4uUm91dGFibGUuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi1idG4tLWFic29sdXRlJzogdGhpcy5hYnNvbHV0ZSxcbiAgICAgICAgJ3YtYnRuLS1ibG9jayc6IHRoaXMuYmxvY2ssXG4gICAgICAgICd2LWJ0bi0tYm90dG9tJzogdGhpcy5ib3R0b20sXG4gICAgICAgICd2LWJ0bi0tZGlzYWJsZWQnOiB0aGlzLmRpc2FibGVkLFxuICAgICAgICAndi1idG4tLWlzLWVsZXZhdGVkJzogdGhpcy5pc0VsZXZhdGVkLFxuICAgICAgICAndi1idG4tLWZhYic6IHRoaXMuZmFiLFxuICAgICAgICAndi1idG4tLWZpeGVkJzogdGhpcy5maXhlZCxcbiAgICAgICAgJ3YtYnRuLS1oYXMtYmcnOiB0aGlzLmhhc0JnLFxuICAgICAgICAndi1idG4tLWljb24nOiB0aGlzLmljb24sXG4gICAgICAgICd2LWJ0bi0tbGVmdCc6IHRoaXMubGVmdCxcbiAgICAgICAgJ3YtYnRuLS1sb2FkaW5nJzogdGhpcy5sb2FkaW5nLFxuICAgICAgICAndi1idG4tLW91dGxpbmVkJzogdGhpcy5vdXRsaW5lZCxcbiAgICAgICAgJ3YtYnRuLS1wbGFpbic6IHRoaXMucGxhaW4sXG4gICAgICAgICd2LWJ0bi0tcmlnaHQnOiB0aGlzLnJpZ2h0LFxuICAgICAgICAndi1idG4tLXJvdW5kJzogdGhpcy5pc1JvdW5kLFxuICAgICAgICAndi1idG4tLXJvdW5kZWQnOiB0aGlzLnJvdW5kZWQsXG4gICAgICAgICd2LWJ0bi0tcm91dGVyJzogdGhpcy50byxcbiAgICAgICAgJ3YtYnRuLS10ZXh0JzogdGhpcy50ZXh0LFxuICAgICAgICAndi1idG4tLXRpbGUnOiB0aGlzLnRpbGUsXG4gICAgICAgICd2LWJ0bi0tdG9wJzogdGhpcy50b3AsXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzLFxuICAgICAgICAuLi50aGlzLmdyb3VwQ2xhc3NlcyxcbiAgICAgICAgLi4udGhpcy5lbGV2YXRpb25DbGFzc2VzLFxuICAgICAgICAuLi50aGlzLnNpemVhYmxlQ2xhc3NlcyxcbiAgICAgIH1cbiAgICB9LFxuICAgIGNvbXB1dGVkRWxldmF0aW9uICgpOiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQge1xuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVybiB1bmRlZmluZWRcblxuICAgICAgcmV0dXJuIHRoaXMuZWxldmF0aW9uXG4gICAgfSxcbiAgICBjb21wdXRlZFJpcHBsZSAoKTogUmlwcGxlT3B0aW9ucyB8IGJvb2xlYW4ge1xuICAgICAgY29uc3QgZGVmYXVsdFJpcHBsZSA9IHRoaXMuaWNvbiB8fCB0aGlzLmZhYiA/IHsgY2lyY2xlOiB0cnVlIH0gOiB0cnVlXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuIGZhbHNlXG4gICAgICBlbHNlIHJldHVybiB0aGlzLnJpcHBsZSA/PyBkZWZhdWx0UmlwcGxlXG4gICAgfSxcbiAgICBoYXNCZyAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gIXRoaXMudGV4dCAmJiAhdGhpcy5wbGFpbiAmJiAhdGhpcy5vdXRsaW5lZCAmJiAhdGhpcy5pY29uXG4gICAgfSxcbiAgICBpc0VsZXZhdGVkICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiBCb29sZWFuKFxuICAgICAgICAhdGhpcy5pY29uICYmXG4gICAgICAgICF0aGlzLnRleHQgJiZcbiAgICAgICAgIXRoaXMub3V0bGluZWQgJiZcbiAgICAgICAgIXRoaXMuZGVwcmVzc2VkICYmXG4gICAgICAgICF0aGlzLmRpc2FibGVkICYmXG4gICAgICAgICF0aGlzLnBsYWluICYmXG4gICAgICAgICh0aGlzLmVsZXZhdGlvbiA9PSBudWxsIHx8IE51bWJlcih0aGlzLmVsZXZhdGlvbikgPiAwKVxuICAgICAgKVxuICAgIH0sXG4gICAgaXNSb3VuZCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gQm9vbGVhbihcbiAgICAgICAgdGhpcy5pY29uIHx8XG4gICAgICAgIHRoaXMuZmFiXG4gICAgICApXG4gICAgfSxcbiAgICBzdHlsZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi50aGlzLm1lYXN1cmFibGVTdHlsZXMsXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICBjcmVhdGVkICgpIHtcbiAgICBjb25zdCBicmVha2luZ1Byb3BzID0gW1xuICAgICAgWydmbGF0JywgJ3RleHQnXSxcbiAgICAgIFsnb3V0bGluZScsICdvdXRsaW5lZCddLFxuICAgICAgWydyb3VuZCcsICdyb3VuZGVkJ10sXG4gICAgXVxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBicmVha2luZ1Byb3BzLmZvckVhY2goKFtvcmlnaW5hbCwgcmVwbGFjZW1lbnRdKSA9PiB7XG4gICAgICBpZiAodGhpcy4kYXR0cnMuaGFzT3duUHJvcGVydHkob3JpZ2luYWwpKSBicmVha2luZyhvcmlnaW5hbCwgcmVwbGFjZW1lbnQsIHRoaXMpXG4gICAgfSlcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgY2xpY2sgKGU6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICAgIC8vIFRPRE86IFJlbW92ZSB0aGlzIGluIHYzXG4gICAgICAhdGhpcy5yZXRhaW5Gb2N1c09uQ2xpY2sgJiYgIXRoaXMuZmFiICYmIGUuZGV0YWlsICYmIHRoaXMuJGVsLmJsdXIoKVxuICAgICAgdGhpcy4kZW1pdCgnY2xpY2snLCBlKVxuICAgICAgdGhpcy4kZW1pdExlZ2FjeSgnY2xpY2snLCBlKVxuXG4gICAgICB0aGlzLmJ0blRvZ2dsZSAmJiB0aGlzLnRvZ2dsZSgpXG4gICAgfSxcbiAgICBnZW5Db250ZW50ICgpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gaCgnc3BhbicsIHtcbiAgICAgICAgY2xhc3M6ICd2LWJ0bl9fY29udGVudCcsXG4gICAgICB9LCBnZXRTbG90KHRoaXMpKVxuICAgIH0sXG4gICAgZ2VuTG9hZGVyICgpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gaCgnc3BhbicsIHtcbiAgICAgICAgY2xhc3M6ICd2LWJ0bl9fbG9hZGVyJyxcbiAgICAgIH0sIGdldFNsb3QodGhpcywgJ2xvYWRlcicpIHx8IFtoKFZQcm9ncmVzc0NpcmN1bGFyLCB7XG4gICAgICAgIGluZGV0ZXJtaW5hdGU6IHRydWUsXG4gICAgICAgIHNpemU6IDIzLFxuICAgICAgICB3aWR0aDogMixcbiAgICAgIH0pXSlcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoKTogVk5vZGUge1xuICAgIGNvbnN0IGNoaWxkcmVuID0gW1xuICAgICAgdGhpcy5nZW5Db250ZW50KCksXG4gICAgICB0aGlzLmxvYWRpbmcgJiYgdGhpcy5nZW5Mb2FkZXIoKSxcbiAgICBdXG4gICAgY29uc3QgeyB0YWcsIGRhdGE6IGxpbmtEYXRhLCBkaXJlY3RpdmVzIH0gPSB0aGlzLmdlbmVyYXRlUm91dGVMaW5rKClcbiAgICBjb25zdCBzZXRDb2xvciA9IHRoaXMuaGFzQmdcbiAgICAgID8gdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3JcbiAgICAgIDogdGhpcy5zZXRUZXh0Q29sb3JcblxuICAgIC8vIE1lcmdlIGNvbXBvbmVudCBjbGFzc2VzIHdpdGggcm91dGFibGUgY2xhc3Nlc1xuICAgIGNvbnN0IG1lcmdlZENsYXNzZXMgPSB7XG4gICAgICAuLi50aGlzLmNsYXNzZXMsXG4gICAgICAuLi5saW5rRGF0YS5jbGFzcyxcbiAgICB9XG5cbiAgICBpZiAodGFnID09PSAnYnV0dG9uJykge1xuICAgICAgbGlua0RhdGEudHlwZSA9IHRoaXMudHlwZVxuICAgICAgbGlua0RhdGEuZGlzYWJsZWQgPSB0aGlzLmRpc2FibGVkXG4gICAgfVxuICAgIGxpbmtEYXRhLnZhbHVlID0gWydzdHJpbmcnLCAnbnVtYmVyJ10uaW5jbHVkZXModHlwZW9mIHRoaXMudmFsdWUpXG4gICAgICA/IHRoaXMudmFsdWVcbiAgICAgIDogSlNPTi5zdHJpbmdpZnkodGhpcy52YWx1ZSlcblxuICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAuLi5saW5rRGF0YSxcbiAgICAgIGNsYXNzOiBtZXJnZWRDbGFzc2VzLFxuICAgICAgc3R5bGU6IHRoaXMuc3R5bGVzLFxuICAgIH1cblxuICAgIC8vIEFwcGx5IGNvbG9yIHN0eWxpbmcgYnV0IHByZXNlcnZlIFZ1ZSdzIGF1dG9tYXRpYyBhdHRyaWJ1dGUgaW5oZXJpdGFuY2VcbiAgICBjb25zdCBmaW5hbERhdGEgPSB0aGlzLmRpc2FibGVkID8gZGF0YSA6IHNldENvbG9yKHRoaXMuY29sb3IsIGRhdGEpXG5cbiAgICBjb25zdCB2bm9kZSA9IHR5cGVvZiB0YWcgPT09ICdzdHJpbmcnXG4gICAgICA/IGgodGFnLCBmaW5hbERhdGEsIGNoaWxkcmVuKVxuICAgICAgOiBoKHRhZywgZmluYWxEYXRhLCAoKSA9PiBjaGlsZHJlbilcblxuICAgIHJldHVybiB3aXRoRGlyZWN0aXZlcyhcbiAgICAgIHZub2RlLFxuICAgICAgZGlyZWN0aXZlc1xuICAgIClcbiAgfSxcbn0pXG4iXX0=