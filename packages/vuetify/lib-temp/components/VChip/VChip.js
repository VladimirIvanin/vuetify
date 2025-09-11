import { h, vShow, withDirectives } from 'vue';
// Styles
import './VChip.sass';
import mixins from '../../util/mixins';
// Components
import { VExpandXTransition } from '../transitions';
import VIcon from '../VIcon';
// Mixins
import Colorable from '../../mixins/colorable';
import { factory as GroupableFactory } from '../../mixins/groupable';
import Themeable from '../../mixins/themeable';
import { factory as ToggleableFactory } from '../../mixins/toggleable';
import Routable from '../../mixins/routable';
import Sizeable from '../../mixins/sizeable';
// Utilities
import { breaking } from '../../util/console';
import { getSlot } from '../../util/helpers';
/* @vue/component */
export default mixins(Colorable, Sizeable, Routable, Themeable, GroupableFactory('chipGroup'), ToggleableFactory()).extend({
    name: 'v-chip',
    emits: ['update:modelValue', 'click:close', 'click', 'change'],
    props: {
        active: {
            type: Boolean,
            default: true,
        },
        activeClass: {
            type: String,
        },
        close: Boolean,
        onClick: Function,
        closeIcon: {
            type: String,
            default: '$delete',
        },
        closeLabel: {
            type: String,
            default: '$vuetify.close',
        },
        disabled: Boolean,
        draggable: Boolean,
        filter: Boolean,
        filterIcon: {
            type: String,
            default: '$complete',
        },
        label: Boolean,
        link: Boolean,
        outlined: Boolean,
        pill: Boolean,
        tag: {
            type: String,
            default: 'span',
        },
        textColor: String,
        modelValue: null,
    },
    data: () => ({
        proxyClass: 'v-chip--active',
    }),
    computed: {
        $activeClass() {
            if (this.activeClass) {
                return this.activeClass;
            }
            if (!this.chipGroup)
                return '';
            return this.chipGroup.activeClass;
        },
        classes() {
            return {
                'v-chip': true,
                ...Routable.computed.classes.call(this),
                'v-chip--clickable': this.isClickable,
                'v-chip--disabled': this.disabled,
                'v-chip--draggable': this.draggable,
                'v-chip--label': this.label,
                'v-chip--link': this.isLink,
                'v-chip--no-color': !this.color,
                'v-chip--outlined': this.outlined,
                'v-chip--pill': this.pill,
                'v-chip--removable': this.hasClose,
                ...this.themeClasses,
                ...this.sizeableClasses,
                ...this.groupClasses,
            };
        },
        hasClose() {
            return Boolean(this.close);
        },
        isClickable() {
            return Boolean(Routable.computed.isClickable.call(this) ||
                this.chipGroup);
        },
    },
    created() {
        const breakingProps = [
            ['outline', 'outlined'],
            ['selected', 'input-value'],
            ['value', 'modelValue'],
            ['onInput', 'onUpdate:modelValue'],
        ];
        /* istanbul ignore next */
        breakingProps.forEach(([original, replacement]) => {
            if (this.$attrs.hasOwnProperty(original))
                breaking(original, replacement, this);
        });
    },
    methods: {
        click(e) {
            this.$emit('click', e);
            if (this.chipGroup) {
                this.toggle();
                this.$emit('update:modelValue', this.isActive);
            }
        },
        genFilter() {
            const children = [];
            if (this.isActive) {
                children.push(h(VIcon, {
                    class: 'v-chip__filter',
                    left: true,
                }, this.filterIcon));
            }
            return h(VExpandXTransition, children);
        },
        genClose() {
            return h(VIcon, {
                class: 'v-chip__close',
                right: true,
                size: 18,
                'aria-label': this.$vuetify.lang.t(this.closeLabel),
                onClick: (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$emit('click:close');
                    this.$emit('update:modelValue', false);
                },
            }, this.closeIcon);
        },
        genContent() {
            return h('span', {
                class: 'v-chip__content',
            }, [
                this.filter && this.genFilter(),
                getSlot(this),
                this.hasClose && this.genClose(),
            ]);
        },
    },
    render() {
        const children = [this.genContent()];
        let { tag, data, directives } = this.generateRouteLink();
        data = {
            ...data,
            draggable: this.draggable ? 'true' : undefined,
            tabindex: this.chipGroup && !this.disabled ? 0 : data.tabindex,
        };
        directives.push([
            vShow,
            this.active,
        ]);
        data = this.setBackgroundColor(this.color, data);
        const color = this.textColor || (this.outlined && this.color);
        return withDirectives(h(tag, this.setTextColor(color, data), children), directives);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNoaXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WQ2hpcC9WQ2hpcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQVMsTUFBTSxLQUFLLENBQUE7QUFDckQsU0FBUztBQUNULE9BQU8sY0FBYyxDQUFBO0FBQ3JCLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBRXRDLGFBQWE7QUFDYixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUNuRCxPQUFPLEtBQUssTUFBTSxVQUFVLENBQUE7QUFFNUIsU0FBUztBQUNULE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sRUFBRSxPQUFPLElBQUksZ0JBQWdCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQTtBQUNwRSxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLEVBQUUsT0FBTyxJQUFJLGlCQUFpQixFQUFFLE1BQU0seUJBQXlCLENBQUE7QUFDdEUsT0FBTyxRQUFRLE1BQU0sdUJBQXVCLENBQUE7QUFDNUMsT0FBTyxRQUFRLE1BQU0sdUJBQXVCLENBQUE7QUFFNUMsWUFBWTtBQUNaLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUM3QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFLNUMsb0JBQW9CO0FBQ3BCLGVBQWUsTUFBTSxDQUNuQixTQUFTLEVBQ1QsUUFBUSxFQUNSLFFBQVEsRUFDUixTQUFTLEVBQ1QsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLEVBQzdCLGlCQUFpQixFQUFFLENBQ3BCLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLFFBQVE7SUFFZCxLQUFLLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQztJ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RWhELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUU3RCxPQUFPLGNBQWMsQ0FDbkIsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxRQUFRLENBQUMsRUFDaEQsVUFBVSxDQUNYLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCwgdlNob3csIHdpdGhEaXJlY3RpdmVzLCBWTm9kZSB9IGZyb20gJ3Z1ZSdcbi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZDaGlwLnNhc3MnXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgeyBWRXhwYW5kWFRyYW5zaXRpb24gfSBmcm9tICcuLi90cmFuc2l0aW9ucydcbmltcG9ydCBWSWNvbiBmcm9tICcuLi9WSWNvbidcblxuLy8gTWl4aW5zXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXG5pbXBvcnQgeyBmYWN0b3J5IGFzIEdyb3VwYWJsZUZhY3RvcnkgfSBmcm9tICcuLi8uLi9taXhpbnMvZ3JvdXBhYmxlJ1xuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xuaW1wb3J0IHsgZmFjdG9yeSBhcyBUb2dnbGVhYmxlRmFjdG9yeSB9IGZyb20gJy4uLy4uL21peGlucy90b2dnbGVhYmxlJ1xuaW1wb3J0IFJvdXRhYmxlIGZyb20gJy4uLy4uL21peGlucy9yb3V0YWJsZSdcbmltcG9ydCBTaXplYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvc2l6ZWFibGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IHsgYnJlYWtpbmcgfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXG5pbXBvcnQgeyBnZXRTbG90IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgUHJvcFZhbGlkYXRvciwgUHJvcFR5cGUgfSBmcm9tICd2dWUvdHlwZXMvb3B0aW9ucydcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcbiAgQ29sb3JhYmxlLFxuICBTaXplYWJsZSxcbiAgUm91dGFibGUsXG4gIFRoZW1lYWJsZSxcbiAgR3JvdXBhYmxlRmFjdG9yeSgnY2hpcEdyb3VwJyksXG4gIFRvZ2dsZWFibGVGYWN0b3J5KClcbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtY2hpcCcsXG5cbiAgZW1pdHM6IFsndXBkYXRlOm1vZGVsVmFsdWUnLCAnY2xpY2s6Y2xvc2UnLCAnY2xpY2snLCAnY2hhbmdlJ10sXG5cbiAgcHJvcHM6IHtcbiAgICBhY3RpdmU6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgIH0sXG4gICAgYWN0aXZlQ2xhc3M6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICB9IGFzIGFueSBhcyBQcm9wVmFsaWRhdG9yPHN0cmluZz4sXG4gICAgY2xvc2U6IEJvb2xlYW4sXG4gICAgb25DbGljazogRnVuY3Rpb24gYXMgUHJvcFR5cGU8KGU6IE1vdXNlRXZlbnQpID0+IHZvaWQ+LFxuICAgIGNsb3NlSWNvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyRkZWxldGUnLFxuICAgIH0sXG4gICAgY2xvc2VMYWJlbDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5LmNsb3NlJyxcbiAgICB9LFxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxuICAgIGRyYWdnYWJsZTogQm9vbGVhbixcbiAgICBmaWx0ZXI6IEJvb2xlYW4sXG4gICAgZmlsdGVySWNvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyRjb21wbGV0ZScsXG4gICAgfSxcbiAgICBsYWJlbDogQm9vbGVhbixcbiAgICBsaW5rOiBCb29sZWFuLFxuICAgIG91dGxpbmVkOiBCb29sZWFuLFxuICAgIHBpbGw6IEJvb2xlYW4sXG4gICAgdGFnOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnc3BhbicsXG4gICAgfSxcbiAgICB0ZXh0Q29sb3I6IFN0cmluZyxcbiAgICBtb2RlbFZhbHVlOiBudWxsIGFzIGFueSBhcyBQcm9wVHlwZTxhbnk+LFxuICB9LFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgcHJveHlDbGFzczogJ3YtY2hpcC0tYWN0aXZlJyxcbiAgfSksXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICAkYWN0aXZlQ2xhc3MgKCkge1xuICAgICAgaWYgKHRoaXMuYWN0aXZlQ2xhc3MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZlQ2xhc3NcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5jaGlwR3JvdXApIHJldHVybiAnJ1xuXG4gICAgICByZXR1cm4gdGhpcy5jaGlwR3JvdXAuYWN0aXZlQ2xhc3NcbiAgICB9LFxuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAndi1jaGlwJzogdHJ1ZSxcbiAgICAgICAgLi4uUm91dGFibGUuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi1jaGlwLS1jbGlja2FibGUnOiB0aGlzLmlzQ2xpY2thYmxlLFxuICAgICAgICAndi1jaGlwLS1kaXNhYmxlZCc6IHRoaXMuZGlzYWJsZWQsXG4gICAgICAgICd2LWNoaXAtLWRyYWdnYWJsZSc6IHRoaXMuZHJhZ2dhYmxlLFxuICAgICAgICAndi1jaGlwLS1sYWJlbCc6IHRoaXMubGFiZWwsXG4gICAgICAgICd2LWNoaXAtLWxpbmsnOiB0aGlzLmlzTGluayxcbiAgICAgICAgJ3YtY2hpcC0tbm8tY29sb3InOiAhdGhpcy5jb2xvcixcbiAgICAgICAgJ3YtY2hpcC0tb3V0bGluZWQnOiB0aGlzLm91dGxpbmVkLFxuICAgICAgICAndi1jaGlwLS1waWxsJzogdGhpcy5waWxsLFxuICAgICAgICAndi1jaGlwLS1yZW1vdmFibGUnOiB0aGlzLmhhc0Nsb3NlLFxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3NlcyxcbiAgICAgICAgLi4udGhpcy5zaXplYWJsZUNsYXNzZXMsXG4gICAgICAgIC4uLnRoaXMuZ3JvdXBDbGFzc2VzLFxuICAgICAgfVxuICAgIH0sXG4gICAgaGFzQ2xvc2UgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5jbG9zZSlcbiAgICB9LFxuICAgIGlzQ2xpY2thYmxlICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiBCb29sZWFuKFxuICAgICAgICBSb3V0YWJsZS5jb21wdXRlZC5pc0NsaWNrYWJsZS5jYWxsKHRoaXMpIHx8XG4gICAgICAgIHRoaXMuY2hpcEdyb3VwXG4gICAgICApXG4gICAgfSxcbiAgfSxcblxuICBjcmVhdGVkICgpIHtcbiAgICBjb25zdCBicmVha2luZ1Byb3BzID0gW1xuICAgICAgWydvdXRsaW5lJywgJ291dGxpbmVkJ10sXG4gICAgICBbJ3NlbGVjdGVkJywgJ2lucHV0LXZhbHVlJ10sXG4gICAgICBbJ3ZhbHVlJywgJ21vZGVsVmFsdWUnXSxcbiAgICAgIFsnb25JbnB1dCcsICdvblVwZGF0ZTptb2RlbFZhbHVlJ10sXG4gICAgXVxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBicmVha2luZ1Byb3BzLmZvckVhY2goKFtvcmlnaW5hbCwgcmVwbGFjZW1lbnRdKSA9PiB7XG4gICAgICBpZiAodGhpcy4kYXR0cnMuaGFzT3duUHJvcGVydHkob3JpZ2luYWwpKSBicmVha2luZyhvcmlnaW5hbCwgcmVwbGFjZW1lbnQsIHRoaXMpXG4gICAgfSlcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgY2xpY2sgKGU6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICAgIHRoaXMuJGVtaXQoJ2NsaWNrJywgZSlcblxuICAgICAgaWYgKHRoaXMuY2hpcEdyb3VwKSB7XG4gICAgICAgIHRoaXMudG9nZ2xlKClcbiAgICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOm1vZGVsVmFsdWUnLCB0aGlzLmlzQWN0aXZlKVxuICAgICAgfVxuICAgIH0sXG4gICAgZ2VuRmlsdGVyICgpOiBWTm9kZSB7XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IFtdXG5cbiAgICAgIGlmICh0aGlzLmlzQWN0aXZlKSB7XG4gICAgICAgIGNoaWxkcmVuLnB1c2goXG4gICAgICAgICAgaChWSWNvbiwge1xuICAgICAgICAgICAgY2xhc3M6ICd2LWNoaXBfX2ZpbHRlcicsXG4gICAgICAgICAgICBsZWZ0OiB0cnVlLFxuICAgICAgICAgIH0sIHRoaXMuZmlsdGVySWNvbilcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaChWRXhwYW5kWFRyYW5zaXRpb24sIGNoaWxkcmVuKVxuICAgIH0sXG4gICAgZ2VuQ2xvc2UgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiBoKFZJY29uLCB7XG4gICAgICAgIGNsYXNzOiAndi1jaGlwX19jbG9zZScsXG4gICAgICAgIHJpZ2h0OiB0cnVlLFxuICAgICAgICBzaXplOiAxOCxcbiAgICAgICAgJ2FyaWEtbGFiZWwnOiB0aGlzLiR2dWV0aWZ5LmxhbmcudCh0aGlzLmNsb3NlTGFiZWwpLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAgICAgICB0aGlzLiRlbWl0KCdjbGljazpjbG9zZScpXG4gICAgICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOm1vZGVsVmFsdWUnLCBmYWxzZSlcbiAgICAgICAgfSxcbiAgICAgIH0sIHRoaXMuY2xvc2VJY29uKVxuICAgIH0sXG4gICAgZ2VuQ29udGVudCAoKTogVk5vZGUge1xuICAgICAgcmV0dXJuIGgoJ3NwYW4nLCB7XG4gICAgICAgIGNsYXNzOiAndi1jaGlwX19jb250ZW50JyxcbiAgICAgIH0sIFtcbiAgICAgICAgdGhpcy5maWx0ZXIgJiYgdGhpcy5nZW5GaWx0ZXIoKSxcbiAgICAgICAgZ2V0U2xvdCh0aGlzKSxcbiAgICAgICAgdGhpcy5oYXNDbG9zZSAmJiB0aGlzLmdlbkNsb3NlKCksXG4gICAgICBdKVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBbdGhpcy5nZW5Db250ZW50KCldXG4gICAgbGV0IHsgdGFnLCBkYXRhLCBkaXJlY3RpdmVzIH0gPSB0aGlzLmdlbmVyYXRlUm91dGVMaW5rKClcblxuICAgIGRhdGEgPSB7XG4gICAgICAuLi5kYXRhLFxuICAgICAgZHJhZ2dhYmxlOiB0aGlzLmRyYWdnYWJsZSA/ICd0cnVlJyA6IHVuZGVmaW5lZCxcbiAgICAgIHRhYmluZGV4OiB0aGlzLmNoaXBHcm91cCAmJiAhdGhpcy5kaXNhYmxlZCA/IDAgOiBkYXRhLnRhYmluZGV4LFxuICAgIH1cblxuICAgIGRpcmVjdGl2ZXMhLnB1c2goW1xuICAgICAgdlNob3csXG4gICAgICB0aGlzLmFjdGl2ZSxcbiAgICBdKVxuXG4gICAgZGF0YSA9IHRoaXMuc2V0QmFja2dyb3VuZENvbG9yKHRoaXMuY29sb3IsIGRhdGEpXG5cbiAgICBjb25zdCBjb2xvciA9IHRoaXMudGV4dENvbG9yIHx8ICh0aGlzLm91dGxpbmVkICYmIHRoaXMuY29sb3IpXG5cbiAgICByZXR1cm4gd2l0aERpcmVjdGl2ZXMoXG4gICAgICBoKHRhZywgdGhpcy5zZXRUZXh0Q29sb3IoY29sb3IsIGRhdGEpLCBjaGlsZHJlbiksXG4gICAgICBkaXJlY3RpdmVzXG4gICAgKVxuICB9LFxufSlcbiJdfQ==