import { h, withDirectives } from 'vue';
// Styles
import './VListItem.sass';
// Mixins
import Colorable from '../../mixins/colorable';
import Routable from '../../mixins/routable';
import { factory as GroupableFactory } from '../../mixins/groupable';
import Themeable from '../../mixins/themeable';
import { factory as ToggleableFactory } from '../../mixins/toggleable';
// Utilities
import { getSlot, keyCodes } from './../../util/helpers';
import mergeData from './../../util/mergeData';
import { removed, breaking } from '../../util/console';
// Types
import mixins from '../../util/mixins';
const baseMixins = mixins(Colorable, Routable, Themeable, GroupableFactory('listItemGroup'), ToggleableFactory('modelValue'));
/* @vue/component */
export default baseMixins.extend({
    name: 'v-list-item',
    inject: {
        isInGroup: {
            default: false,
        },
        isInList: {
            default: false,
        },
        isInMenu: {
            default: false,
        },
        isInNav: {
            default: false,
        },
    },
    inheritAttrs: false,
    props: {
        activeClass: {
            type: String,
        },
        dense: Boolean,
        inactive: Boolean,
        onClick: Function,
        link: Boolean,
        selectable: {
            type: Boolean,
        },
        tag: {
            type: String,
            default: 'div',
        },
        threeLine: Boolean,
        twoLine: Boolean,
        modelValue: null,
    },
    emits: [
        'click',
        'keydown',
        'change',
        'update:modelValue',
    ],
    data: () => ({
        proxyClass: 'v-list-item--active',
    }),
    computed: {
        $activeClass() {
            if (this.activeClass)
                return this.activeClass;
            if (!this.listItemGroup)
                return '';
            return this.listItemGroup.activeClass;
        },
        classes() {
            return {
                'v-list-item': true,
                ...Routable.computed.classes.call(this),
                'v-list-item--dense': this.dense,
                'v-list-item--disabled': this.disabled,
                'v-list-item--link': this.isClickable && !this.inactive,
                'v-list-item--selectable': this.selectable,
                'v-list-item--three-line': this.threeLine,
                'v-list-item--two-line': this.twoLine,
                ...this.themeClasses,
            };
        },
        isClickable() {
            return Boolean(Routable.computed.isClickable.call(this) ||
                this.listItemGroup);
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
        /* istanbul ignore next */
        if (this.$attrs.hasOwnProperty('avatar')) {
            removed('avatar', this);
        }
    },
    methods: {
        click(e) {
            if (e.detail)
                this.$el.blur();
            this.$emit('click', e);
            this.to || this.toggle();
        },
        genAttrs() {
            const { class: _, ...otherAttrs } = this.$attrs;
            const attrs = {
                ...otherAttrs,
                'aria-disabled': this.disabled ? true : undefined,
                tabindex: this.isClickable && !this.disabled ? 0 : -1,
            };
            if (this.$attrs.hasOwnProperty('role')) {
                // do nothing, role already provided
            }
            else if (this.isInNav) {
                // do nothing, role is inherit
            }
            else if (this.isInGroup) {
                attrs.role = 'option';
                attrs['aria-selected'] = String(this.isActive);
            }
            else if (this.isInMenu) {
                attrs.role = this.isClickable ? 'menuitem' : undefined;
                attrs.id = attrs.id || `list-item-${this.$.uid}`;
            }
            else if (this.isInList) {
                attrs.role = 'listitem';
            }
            return attrs;
        },
        toggle() {
            if (this.to && this.modelValue === undefined) {
                this.isActive = !this.isActive;
            }
            this.$emit('change');
            this.$emitLegacy('change');
        },
    },
    render() {
        let { tag, data, directives } = this.generateRouteLink();
        const attrs = this.genAttrs();
        data = mergeData(data, attrs);
        data = {
            ...data,
            onKeydown: (e) => {
                if (!this.disabled) {
                    /* istanbul ignore else */
                    if (e.keyCode === keyCodes.enter)
                        this.click(e);
                    this.$emit('keydown', e);
                }
            },
            // Ensure our attrs take precedence over routable
            ...attrs,
        };
        if (this.inactive)
            tag = 'div';
        // if (this.inactive && this.to) {
        //   data.on = data.nativeOn
        //   delete data.nativeOn
        // }
        const slotProps = {
            active: this.isActive,
            toggle: this.toggle,
        };
        const children = [
            getSlot(this, 'prepend', slotProps),
            getSlot(this, 'default', slotProps),
            getSlot(this, 'append', slotProps),
        ].filter(Boolean);
        const nodeData = this.isActive ? this.setTextColor(this.color, data) : data;
        const attrsClasses = this.$attrs.class;
        if (attrsClasses) {
            nodeData.class = [this.classes, attrsClasses];
        }
        else {
            nodeData.class = this.classes;
        }
        const node = typeof tag === 'string'
            ? h(tag, nodeData, children)
            : h(tag, nodeData, () => children);
        return withDirectives(node, directives);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkxpc3RJdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkxpc3QvVkxpc3RJdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxDQUFDLEVBQUUsY0FBYyxFQUFrQyxNQUFNLEtBQUssQ0FBQTtBQUN2RSxTQUFTO0FBQ1QsT0FBTyxrQkFBa0IsQ0FBQTtBQUV6QixTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxRQUFRLE1BQU0sdUJBQXVCLENBQUE7QUFDNUMsT0FBTyxFQUFFLE9BQU8sSUFBSSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFBO0FBQ3BFLE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sRUFBRSxPQUFPLElBQUksaUJBQWlCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQTtBQUt0RSxZQUFZO0FBQ1osT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQTtBQUN4RCxPQUFPLFNBQTJCLE1BQU0sd0JBQXdCLENBQUE7QUFFaEUsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUV0RCxRQUFRO0FBQ1IsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFFdEMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUN2QixTQUFTLEVBQ1QsUUFBUSxFQUNSLFNBQVMsRUFDVCxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsRUFDakMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQ2hDLENBQUE7QUFVRCxvQkFBb0I7QUFDcEIsZUFBZSxVQUFVLENBQUMsTUFBTSxDQUFDO0lBQy9CLElBQUksRUFBRSxhQUFhO0lBRW5CLE1BQU0sRUFBRTtRQUNOLFNBQVMsRUFBRTtZQUNULE9BQU8sRUFBRSxLQUFLO1NBQ2Y7UUFDRCxRQUFRLEVBQUU7WUFDUixPQUFPLEVBQUUs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YWxpZGF0b3IgfSBmcm9tICd2dWUnXG4vLyBTdHlsZXNcbmltcG9ydCAnLi9WTGlzdEl0ZW0uc2FzcydcblxuLy8gTWl4aW5zXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXG5pbXBvcnQgUm91dGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3JvdXRhYmxlJ1xuaW1wb3J0IHsgZmFjdG9yeSBhcyBHcm91cGFibGVGYWN0b3J5IH0gZnJvbSAnLi4vLi4vbWl4aW5zL2dyb3VwYWJsZSdcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcbmltcG9ydCB7IGZhY3RvcnkgYXMgVG9nZ2xlYWJsZUZhY3RvcnkgfSBmcm9tICcuLi8uLi9taXhpbnMvdG9nZ2xlYWJsZSdcblxuLy8gRGlyZWN0aXZlc1xuaW1wb3J0IFJpcHBsZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3JpcHBsZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBnZXRTbG90LCBrZXlDb2RlcyB9IGZyb20gJy4vLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IG1lcmdlRGF0YSwgeyBtZXJnZUNsYXNzZXMgfSBmcm9tICcuLy4uLy4uL3V0aWwvbWVyZ2VEYXRhJ1xuaW1wb3J0IHsgRXh0cmFjdFZ1ZSB9IGZyb20gJy4vLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgeyByZW1vdmVkLCBicmVha2luZyB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcblxuLy8gVHlwZXNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbmNvbnN0IGJhc2VNaXhpbnMgPSBtaXhpbnMoXG4gIENvbG9yYWJsZSxcbiAgUm91dGFibGUsXG4gIFRoZW1lYWJsZSxcbiAgR3JvdXBhYmxlRmFjdG9yeSgnbGlzdEl0ZW1Hcm91cCcpLFxuICBUb2dnbGVhYmxlRmFjdG9yeSgnbW9kZWxWYWx1ZScpXG4pXG5cbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgRXh0cmFjdFZ1ZTx0eXBlb2YgYmFzZU1peGlucz4ge1xuICAkZWw6IEhUTUxFbGVtZW50XG4gIGlzSW5Hcm91cDogYm9vbGVhblxuICBpc0luTGlzdDogYm9vbGVhblxuICBpc0luTWVudTogYm9vbGVhblxuICBpc0luTmF2OiBib29sZWFuXG59XG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBiYXNlTWl4aW5zLmV4dGVuZCh7XG4gIG5hbWU6ICd2LWxpc3QtaXRlbScsXG5cbiAgaW5qZWN0OiB7XG4gICAgaXNJbkdyb3VwOiB7XG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIGlzSW5MaXN0OiB7XG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIGlzSW5NZW51OiB7XG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIGlzSW5OYXY6IHtcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG5cbiAgaW5oZXJpdEF0dHJzOiBmYWxzZSxcblxuICBwcm9wczoge1xuICAgIGFjdGl2ZUNsYXNzOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgfSBhcyBhbnkgYXMgUHJvcFZhbGlkYXRvcjxzdHJpbmc+LFxuICAgIGRlbnNlOiBCb29sZWFuLFxuICAgIGluYWN0aXZlOiBCb29sZWFuLFxuICAgIG9uQ2xpY2s6IEZ1bmN0aW9uIGFzIFByb3BUeXBlPChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkPixcbiAgICBsaW5rOiBCb29sZWFuLFxuICAgIHNlbGVjdGFibGU6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgfSxcbiAgICB0YWc6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdkaXYnLFxuICAgIH0sXG4gICAgdGhyZWVMaW5lOiBCb29sZWFuLFxuICAgIHR3b0xpbmU6IEJvb2xlYW4sXG4gICAgbW9kZWxWYWx1ZTogbnVsbCBhcyBhbnkgYXMgUHJvcFR5cGU8YW55PixcbiAgfSxcblxuICBlbWl0czogW1xuICAgICdjbGljaycsXG4gICAgJ2tleWRvd24nLFxuICAgICdjaGFuZ2UnLFxuICAgICd1cGRhdGU6bW9kZWxWYWx1ZScsXG4gIF0sXG5cbiAgZGF0YTogKCkgPT4gKHtcbiAgICBwcm94eUNsYXNzOiAndi1saXN0LWl0ZW0tLWFjdGl2ZScsXG4gIH0pLFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgJGFjdGl2ZUNsYXNzICgpIHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZUNsYXNzKSByZXR1cm4gdGhpcy5hY3RpdmVDbGFzc1xuICAgICAgaWYgKCF0aGlzLmxpc3RJdGVtR3JvdXApIHJldHVybiAnJ1xuXG4gICAgICByZXR1cm4gdGhpcy5saXN0SXRlbUdyb3VwLmFjdGl2ZUNsYXNzXG4gICAgfSxcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ3YtbGlzdC1pdGVtJzogdHJ1ZSxcbiAgICAgICAgLi4uUm91dGFibGUuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi1saXN0LWl0ZW0tLWRlbnNlJzogdGhpcy5kZW5zZSxcbiAgICAgICAgJ3YtbGlzdC1pdGVtLS1kaXNhYmxlZCc6IHRoaXMuZGlzYWJsZWQsXG4gICAgICAgICd2LWxpc3QtaXRlbS0tbGluayc6IHRoaXMuaXNDbGlja2FibGUgJiYgIXRoaXMuaW5hY3RpdmUsXG4gICAgICAgICd2LWxpc3QtaXRlbS0tc2VsZWN0YWJsZSc6IHRoaXMuc2VsZWN0YWJsZSxcbiAgICAgICAgJ3YtbGlzdC1pdGVtLS10aHJlZS1saW5lJzogdGhpcy50aHJlZUxpbmUsXG4gICAgICAgICd2LWxpc3QtaXRlbS0tdHdvLWxpbmUnOiB0aGlzLnR3b0xpbmUsXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzLFxuICAgICAgfVxuICAgIH0sXG4gICAgaXNDbGlja2FibGUgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIEJvb2xlYW4oXG4gICAgICAgIFJvdXRhYmxlLmNvbXB1dGVkLmlzQ2xpY2thYmxlLmNhbGwodGhpcykgfHxcbiAgICAgICAgdGhpcy5saXN0SXRlbUdyb3VwXG4gICAgICApXG4gICAgfSxcbiAgfSxcblxuICBjcmVhdGVkICgpIHtcbiAgICBjb25zdCBicmVha2luZ1Byb3BzID0gW1xuICAgICAgWyd2YWx1ZScsICdtb2RlbFZhbHVlJ10sXG4gICAgXVxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBicmVha2luZ1Byb3BzLmZvckVhY2goKFtvcmlnaW5hbCwgcmVwbGFjZW1lbnRdKSA9PiB7XG4gICAgICBpZiAodGhpcy4kYXR0cnMuaGFzT3duUHJvcGVydHkob3JpZ2luYWwpKSBicmVha2luZyhvcmlnaW5hbCwgcmVwbGFjZW1lbnQsIHRoaXMpXG4gICAgfSlcblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHRoaXMuJGF0dHJzLmhhc093blByb3BlcnR5KCdhdmF0YXInKSkge1xuICAgICAgcmVtb3ZlZCgnYXZhdGFyJywgdGhpcylcbiAgICB9XG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGNsaWNrIChlOiBNb3VzZUV2ZW50IHwgS2V5Ym9hcmRFdmVudCkge1xuICAgICAgaWYgKGUuZGV0YWlsKSB0aGlzLiRlbC5ibHVyKClcblxuICAgICAgdGhpcy4kZW1pdCgnY2xpY2snLCBlKVxuXG4gICAgICB0aGlzLnRvIHx8IHRoaXMudG9nZ2xlKClcbiAgICB9LFxuICAgIGdlbkF0dHJzICgpIHtcbiAgICAgIGNvbnN0IHsgY2xhc3M6IF8sIC4uLm90aGVyQXR0cnMgfSA9IHRoaXMuJGF0dHJzXG4gICAgICBjb25zdCBhdHRyczogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgICAgLi4ub3RoZXJBdHRycyxcbiAgICAgICAgJ2FyaWEtZGlzYWJsZWQnOiB0aGlzLmRpc2FibGVkID8gdHJ1ZSA6IHVuZGVmaW5lZCxcbiAgICAgICAgdGFiaW5kZXg6IHRoaXMuaXNDbGlja2FibGUgJiYgIXRoaXMuZGlzYWJsZWQgPyAwIDogLTEsXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLiRhdHRycy5oYXNPd25Qcm9wZXJ0eSgncm9sZScpKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmcsIHJvbGUgYWxyZWFkeSBwcm92aWRlZFxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzSW5OYXYpIHtcbiAgICAgICAgLy8gZG8gbm90aGluZywgcm9sZSBpcyBpbmhlcml0XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNJbkdyb3VwKSB7XG4gICAgICAgIGF0dHJzLnJvbGUgPSAnb3B0aW9uJ1xuICAgICAgICBhdHRyc1snYXJpYS1zZWxlY3RlZCddID0gU3RyaW5nKHRoaXMuaXNBY3RpdmUpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNJbk1lbnUpIHtcbiAgICAgICAgYXR0cnMucm9sZSA9IHRoaXMuaXNDbGlja2FibGUgPyAnbWVudWl0ZW0nIDogdW5kZWZpbmVkXG4gICAgICAgIGF0dHJzLmlkID0gYXR0cnMuaWQgfHwgYGxpc3QtaXRlbS0ke3RoaXMuJC51aWR9YFxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzSW5MaXN0KSB7XG4gICAgICAgIGF0dHJzLnJvbGUgPSAnbGlzdGl0ZW0nXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhdHRyc1xuICAgIH0sXG4gICAgdG9nZ2xlICgpIHtcbiAgICAgIGlmICh0aGlzLnRvICYmIHRoaXMubW9kZWxWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSAhdGhpcy5pc0FjdGl2ZVxuICAgICAgfVxuICAgICAgdGhpcy4kZW1pdCgnY2hhbmdlJylcbiAgICAgIHRoaXMuJGVtaXRMZWdhY3koJ2NoYW5nZScpXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKCk6IFZOb2RlIHtcbiAgICBsZXQgeyB0YWcsIGRhdGEsIGRpcmVjdGl2ZXMgfSA9IHRoaXMuZ2VuZXJhdGVSb3V0ZUxpbmsoKVxuICAgIGNvbnN0IGF0dHJzID0gdGhpcy5nZW5BdHRycygpXG5cbiAgICBkYXRhID0gbWVyZ2VEYXRhKFxuICAgICAgZGF0YSxcbiAgICAgIGF0dHJzXG4gICAgKVxuXG4gICAgZGF0YSA9IHtcbiAgICAgIC4uLmRhdGEsXG4gICAgICBvbktleWRvd246IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0ga2V5Q29kZXMuZW50ZXIpIHRoaXMuY2xpY2soZSlcblxuICAgICAgICAgIHRoaXMuJGVtaXQoJ2tleWRvd24nLCBlKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gRW5zdXJlIG91ciBhdHRycyB0YWtlIHByZWNlZGVuY2Ugb3ZlciByb3V0YWJsZVxuICAgICAgLi4uYXR0cnMsXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaW5hY3RpdmUpIHRhZyA9ICdkaXYnXG4gICAgLy8gaWYgKHRoaXMuaW5hY3RpdmUgJiYgdGhpcy50bykge1xuICAgIC8vICAgZGF0YS5vbiA9IGRhdGEubmF0aXZlT25cbiAgICAvLyAgIGRlbGV0ZSBkYXRhLm5hdGl2ZU9uXG4gICAgLy8gfVxuXG4gICAgY29uc3Qgc2xvdFByb3BzID0ge1xuICAgICAgYWN0aXZlOiB0aGlzLmlzQWN0aXZlLFxuICAgICAgdG9nZ2xlOiB0aGlzLnRvZ2dsZSxcbiAgICB9XG5cbiAgICBjb25zdCBjaGlsZHJlbiA9IFtcbiAgICAgIGdldFNsb3QodGhpcywgJ3ByZXBlbmQnLCBzbG90UHJvcHMpLFxuICAgICAgZ2V0U2xvdCh0aGlzLCAnZGVmYXVsdCcsIHNsb3RQcm9wcyksXG4gICAgICBnZXRTbG90KHRoaXMsICdhcHBlbmQnLCBzbG90UHJvcHMpLFxuICAgIF0uZmlsdGVyKEJvb2xlYW4pXG5cbiAgICBjb25zdCBub2RlRGF0YSA9IHRoaXMuaXNBY3RpdmUgPyB0aGlzLnNldFRleHRDb2xvcih0aGlzLmNvbG9yLCBkYXRhKSA6IGRhdGFcblxuICAgIGNvbnN0IGF0dHJzQ2xhc3NlcyA9IHRoaXMuJGF0dHJzLmNsYXNzXG4gICAgaWYgKGF0dHJzQ2xhc3Nlcykge1xuICAgICAgbm9kZURhdGEuY2xhc3MgPSBbdGhpcy5jbGFzc2VzLCBhdHRyc0NsYXNzZXNdXG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGVEYXRhLmNsYXNzID0gdGhpcy5jbGFzc2VzXG4gICAgfVxuXG4gICAgY29uc3Qgbm9kZSA9IHR5cGVvZiB0YWcgPT09ICdzdHJpbmcnXG4gICAgICA/IGgodGFnLCBub2RlRGF0YSwgY2hpbGRyZW4pXG4gICAgICA6IGgodGFnLCBub2RlRGF0YSwgKCkgPT4gY2hpbGRyZW4pXG5cbiAgICByZXR1cm4gd2l0aERpcmVjdGl2ZXMobm9kZSwgZGlyZWN0aXZlcylcbiAgfSxcbn0pIl19