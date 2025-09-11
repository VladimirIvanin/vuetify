import { h, withDirectives } from 'vue';
// Styles
import './VWindow.sass';
import { defineComponent } from 'vue';
// Directives
import Touch from '../../directives/touch';
// Components
import VBtn from '../VBtn';
import VIcon from '../VIcon';
import { BaseItemGroup } from '../VItemGroup/VItemGroup';
import { getSlot } from '../../util/helpers';
/* @vue/component */
export default defineComponent({
    name: 'v-window',
    extends: BaseItemGroup,
    provide() {
        return {
            windowGroup: this,
        };
    },
    props: {
        activeClass: {
            type: String,
            default: 'v-window-item--active',
        },
        continuous: Boolean,
        mandatory: {
            type: Boolean,
            default: true,
        },
        nextIcon: {
            type: [Boolean, String],
            default: '$next',
        },
        prevIcon: {
            type: [Boolean, String],
            default: '$prev',
        },
        reverse: Boolean,
        showArrows: Boolean,
        showArrowsOnHover: Boolean,
        touch: Object,
        touchless: Boolean,
        modelValue: {
            required: false,
        },
        vertical: Boolean,
    },
    data() {
        return {
            changedByDelimiters: false,
            internalHeight: undefined,
            transitionHeight: undefined,
            transitionCount: 0,
            isBooted: false,
            isReverse: false,
        };
    },
    computed: {
        isActive() {
            return this.transitionCount > 0;
        },
        classes() {
            return {
                ...BaseItemGroup.computed.classes.call(this),
                'v-window--show-arrows-on-hover': this.showArrowsOnHover,
            };
        },
        computedTransition() {
            if (!this.isBooted)
                return '';
            const axis = this.vertical ? 'y' : 'x';
            const reverse = this.internalReverse ? !this.isReverse : this.isReverse;
            const direction = reverse ? '-reverse' : '';
            return `v-window-${axis}${direction}-transition`;
        },
        hasActiveItems() {
            return Boolean(this.items.find(item => !item.disabled));
        },
        hasNext() {
            return this.continuous || this.internalIndex < this.items.length - 1;
        },
        hasPrev() {
            return this.continuous || this.internalIndex > 0;
        },
        internalIndex() {
            return this.items.findIndex((item, i) => {
                return this.internalValue === this.getValue(item, i);
            });
        },
        internalReverse() {
            return this.$vuetify.rtl ? !this.reverse : this.reverse;
        },
    },
    watch: {
        internalIndex(val, oldVal) {
            this.isReverse = this.updateReverse(val, oldVal);
        },
    },
    mounted() {
        window.requestAnimationFrame(() => (this.isBooted = true));
    },
    methods: {
        genDefaultSlot() {
            return getSlot(this);
        },
        genContainer() {
            const children = [this.genDefaultSlot()];
            if (this.showArrows) {
                children.push(this.genControlIcons());
            }
            return h('div', {
                class: ['v-window__container', {
                        'v-window__container--is-active': this.isActive,
                    }],
                style: {
                    height: this.internalHeight || this.transitionHeight,
                },
            }, children);
        },
        genIcon(direction, icon, click) {
            var _a, _b, _c;
            const attrs = {
                'aria-label': this.$vuetify.lang.t(`$vuetify.carousel.${direction}`),
                onClick: (e) => {
                    e.stopPropagation();
                    this.changedByDelimiters = true;
                    click();
                }
            };
            const children = (_c = (_b = (_a = this.$slots)[direction]) === null || _b === void 0 ? void 0 : _b.call(_a, {
                attrs,
            })) !== null && _c !== void 0 ? _c : [h(VBtn, {
                    icon: true,
                    ...attrs,
                }, {
                    default: () => [
                        h(VIcon, {
                            large: true,
                        }, {
                            default: () => icon
                        }),
                    ]
                })];
            return h('div', {
                class: `v-window__${direction}`,
            }, children);
        },
        genControlIcons() {
            const icons = [];
            const prevIcon = this.$vuetify.rtl
                ? this.nextIcon
                : this.prevIcon;
            /* istanbul ignore else */
            if (this.hasPrev &&
                prevIcon &&
                typeof prevIcon === 'string') {
                const icon = this.genIcon('prev', prevIcon, this.prev);
                icon && icons.push(icon);
            }
            const nextIcon = this.$vuetify.rtl
                ? this.prevIcon
                : this.nextIcon;
            /* istanbul ignore else */
            if (this.hasNext &&
                nextIcon &&
                typeof nextIcon === 'string') {
                const icon = this.genIcon('next', nextIcon, this.next);
                icon && icons.push(icon);
            }
            return icons;
        },
        getNextIndex(index) {
            const nextIndex = (index + 1) % this.items.length;
            const item = this.items[nextIndex];
            if (item.disabled)
                return this.getNextIndex(nextIndex);
            return nextIndex;
        },
        getPrevIndex(index) {
            const prevIndex = (index + this.items.length - 1) % this.items.length;
            const item = this.items[prevIndex];
            if (item.disabled)
                return this.getPrevIndex(prevIndex);
            return prevIndex;
        },
        next() {
            /* istanbul ignore if */
            if (!this.hasActiveItems || !this.hasNext)
                return;
            const nextIndex = this.getNextIndex(this.internalIndex);
            const item = this.items[nextIndex];
            this.internalValue = this.getValue(item, nextIndex);
        },
        prev() {
            /* istanbul ignore if */
            if (!this.hasActiveItems || !this.hasPrev)
                return;
            const lastIndex = this.getPrevIndex(this.internalIndex);
            const item = this.items[lastIndex];
            this.internalValue = this.getValue(item, lastIndex);
        },
        updateReverse(val, oldVal) {
            const itemsLength = this.items.length;
            const lastIndex = itemsLength - 1;
            if (itemsLength <= 2)
                return val < oldVal;
            if (val === lastIndex && oldVal === 0) {
                return true;
            }
            else if (val === 0 && oldVal === lastIndex) {
                return false;
            }
            else {
                return val < oldVal;
            }
        },
    },
    render() {
        const directives = [];
        const data = {
            class: ['v-window', this.classes]
        };
        if (!this.touchless) {
            const value = this.touch || {
                left: () => {
                    this.$vuetify.rtl ? this.prev() : this.next();
                },
                right: () => {
                    this.$vuetify.rtl ? this.next() : this.prev();
                },
                end: (e) => {
                    e.stopPropagation();
                },
                start: (e) => {
                    e.stopPropagation();
                },
            };
            directives.push([
                Touch,
                value
            ]);
        }
        return withDirectives(h('div', data, [this.genContainer()]), directives);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVldpbmRvdy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZXaW5kb3cvVldpbmRvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsQ0FBQyxFQUFFLGNBQWMsRUFBQyxNQUFNLEtBQUssQ0FBQTtBQUNyQyxTQUFTO0FBQ1QsT0FBTyxnQkFBZ0IsQ0FBQTtBQUl2QixPQUFPLEVBQVksZUFBZSxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBRy9DLGFBQWE7QUFDYixPQUFPLEtBQUssTUFBTSx3QkFBd0IsQ0FBQTtBQUUxQyxhQUFhO0FBQ2IsT0FBTyxJQUFJLE1BQU0sU0FBUyxDQUFBO0FBQzFCLE9BQU8sS0FBSyxNQUFNLFVBQVUsQ0FBQTtBQUM1QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUE7QUFDeEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRTVDLG9CQUFvQjtBQUNwQixlQUFlLGVBQWUsQ0FBQztJQUM3QixJQUFJLEVBQUUsVUFBVTtJQUNoQixPQUFPLEVBQUUsYUFBYTtJQUd0QixPQUFPO1FBQ0wsT0FBTztZQUNMLFdBQVcsRUFBRSxJQUFJO1NBQ2xCLENBQUE7SUFDSCxDQUFDO0lBRUQsS0FBSyxFQUFFO1FBQ0wsV0FBVyxFQUFFO1lBQ1gsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsdUJBQXVCO1NBQ2pDO1FBQ0QsVUFBVSxFQUFFLE9BQU87UUFDbkIsU0FBUyxFQUFFO1lBQ1QsSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQztZQUN2QixPQUFPLEVBQUUsT0FBTztTQUNqQjtRQUNELFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7WUFDdkIsT0FBTyxF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Q0FBQTtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ25CLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUk7Z0JBQzFCLElBQUksRUFBRSxHQUFHLEVBQUU7b0JBQ1QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO2dCQUMvQyxDQUFDO2dCQUNELEtBQUssRUFBRSxHQUFHLEVBQUU7b0JBQ1YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO2dCQUMvQyxDQUFDO2dCQUNELEdBQUcsRUFBRSxDQUFDLENBQWEsRUFBRSxFQUFFO29CQUNyQixDQUFDLENBQUMsZUFBZSxFQUFFLENBQUE7Z0JBQ3JCLENBQUM7Z0JBQ0QsS0FBSyxFQUFFLENBQUMsQ0FBYSxFQUFFLEVBQUU7b0JBQ3ZCLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtnQkFDckIsQ0FBQzthQUNGLENBQUE7WUFFRCxVQUFVLENBQUMsSUFBSSxDQUFDO2dCQUNkLEtBQUs7Z0JBQ0wsS0FBSzthQUNOLENBQUMsQ0FBQTtTQUNIO1FBRUQsT0FBTyxjQUFjLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFBO0lBQzFFLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2gsIHdpdGhEaXJlY3RpdmVzfSBmcm9tICd2dWUnXG4vLyBTdHlsZXNcbmltcG9ydCAnLi9WV2luZG93LnNhc3MnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSwgVk5vZGVEaXJlY3RpdmUgfSBmcm9tICd2dWUvdHlwZXMvdm5vZGUnXG5pbXBvcnQgeyBQcm9wVHlwZSwgZGVmaW5lQ29tcG9uZW50IH0gZnJvbSAndnVlJ1xuaW1wb3J0IHsgVG91Y2hIYW5kbGVycyB9IGZyb20gJ3Z1ZXRpZnkvdHlwZXMnXG5cbi8vIERpcmVjdGl2ZXNcbmltcG9ydCBUb3VjaCBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3RvdWNoJ1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgVkJ0biBmcm9tICcuLi9WQnRuJ1xuaW1wb3J0IFZJY29uIGZyb20gJy4uL1ZJY29uJ1xuaW1wb3J0IHsgQmFzZUl0ZW1Hcm91cCB9IGZyb20gJy4uL1ZJdGVtR3JvdXAvVkl0ZW1Hcm91cCdcbmltcG9ydCB7IGdldFNsb3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb21wb25lbnQoe1xuICBuYW1lOiAndi13aW5kb3cnLFxuICBleHRlbmRzOiBCYXNlSXRlbUdyb3VwLFxuXG5cbiAgcHJvdmlkZSAoKTogb2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgd2luZG93R3JvdXA6IHRoaXMsXG4gICAgfVxuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgYWN0aXZlQ2xhc3M6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICd2LXdpbmRvdy1pdGVtLS1hY3RpdmUnLFxuICAgIH0sXG4gICAgY29udGludW91czogQm9vbGVhbixcbiAgICBtYW5kYXRvcnk6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgIH0sXG4gICAgbmV4dEljb246IHtcbiAgICAgIHR5cGU6IFtCb29sZWFuLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogJyRuZXh0JyxcbiAgICB9LFxuICAgIHByZXZJY29uOiB7XG4gICAgICB0eXBlOiBbQm9vbGVhbiwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6ICckcHJldicsXG4gICAgfSxcbiAgICByZXZlcnNlOiBCb29sZWFuLFxuICAgIHNob3dBcnJvd3M6IEJvb2xlYW4sXG4gICAgc2hvd0Fycm93c09uSG92ZXI6IEJvb2xlYW4sXG4gICAgdG91Y2g6IE9iamVjdCBhcyBQcm9wVHlwZTxUb3VjaEhhbmRsZXJzPixcbiAgICB0b3VjaGxlc3M6IEJvb2xlYW4sXG4gICAgbW9kZWxWYWx1ZToge1xuICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIH0sXG4gICAgdmVydGljYWw6IEJvb2xlYW4sXG4gIH0sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNoYW5nZWRCeURlbGltaXRlcnM6IGZhbHNlLFxuICAgICAgaW50ZXJuYWxIZWlnaHQ6IHVuZGVmaW5lZCBhcyB1bmRlZmluZWQgfCBzdHJpbmcsIC8vIFRoaXMgY2FuIGJlIGZpeGVkIGJ5IGNoaWxkIGNsYXNzLlxuICAgICAgdHJhbnNpdGlvbkhlaWdodDogdW5kZWZpbmVkIGFzIHVuZGVmaW5lZCB8IHN0cmluZywgLy8gSW50ZXJtZWRpYXRlIGhlaWdodCBkdXJpbmcgdHJhbnNpdGlvbi5cbiAgICAgIHRyYW5zaXRpb25Db3VudDogMCwgLy8gTnVtYmVyIG9mIHdpbmRvd3MgaW4gdHJhbnNpdGlvbiBzdGF0ZS5cbiAgICAgIGlzQm9vdGVkOiBmYWxzZSxcbiAgICAgIGlzUmV2ZXJzZTogZmFsc2UsXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgaXNBY3RpdmUgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNpdGlvbkNvdW50ID4gMFxuICAgIH0sXG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLkJhc2VJdGVtR3JvdXAuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi13aW5kb3ctLXNob3ctYXJyb3dzLW9uLWhvdmVyJzogdGhpcy5zaG93QXJyb3dzT25Ib3ZlcixcbiAgICAgIH1cbiAgICB9LFxuICAgIGNvbXB1dGVkVHJhbnNpdGlvbiAoKTogc3RyaW5nIHtcbiAgICAgIGlmICghdGhpcy5pc0Jvb3RlZCkgcmV0dXJuICcnXG5cbiAgICAgIGNvbnN0IGF4aXMgPSB0aGlzLnZlcnRpY2FsID8gJ3knIDogJ3gnXG4gICAgICBjb25zdCByZXZlcnNlID0gdGhpcy5pbnRlcm5hbFJldmVyc2UgPyAhdGhpcy5pc1JldmVyc2UgOiB0aGlzLmlzUmV2ZXJzZVxuICAgICAgY29uc3QgZGlyZWN0aW9uID0gcmV2ZXJzZSA/ICctcmV2ZXJzZScgOiAnJ1xuXG4gICAgICByZXR1cm4gYHYtd2luZG93LSR7YXhpc30ke2RpcmVjdGlvbn0tdHJhbnNpdGlvbmBcbiAgICB9LFxuICAgIGhhc0FjdGl2ZUl0ZW1zICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiBCb29sZWFuKFxuICAgICAgICB0aGlzLml0ZW1zLmZpbmQoaXRlbSA9PiAhaXRlbS5kaXNhYmxlZClcbiAgICAgIClcbiAgICB9LFxuICAgIGhhc05leHQgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGludW91cyB8fCB0aGlzLmludGVybmFsSW5kZXggPCB0aGlzLml0ZW1zLmxlbmd0aCAtIDFcbiAgICB9LFxuICAgIGhhc1ByZXYgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGludW91cyB8fCB0aGlzLmludGVybmFsSW5kZXggPiAwXG4gICAgfSxcbiAgICBpbnRlcm5hbEluZGV4ICgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIHRoaXMuaXRlbXMuZmluZEluZGV4KChpdGVtLCBpKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmludGVybmFsVmFsdWUgPT09IHRoaXMuZ2V0VmFsdWUoaXRlbSwgaSlcbiAgICAgIH0pXG4gICAgfSxcbiAgICBpbnRlcm5hbFJldmVyc2UgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuJHZ1ZXRpZnkucnRsID8gIXRoaXMucmV2ZXJzZSA6IHRoaXMucmV2ZXJzZVxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBpbnRlcm5hbEluZGV4ICh2YWwsIG9sZFZhbCkge1xuICAgICAgdGhpcy5pc1JldmVyc2UgPSB0aGlzLnVwZGF0ZVJldmVyc2UodmFsLCBvbGRWYWwpXG4gICAgfSxcbiAgfSxcblxuICBtb3VudGVkICgpIHtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+ICh0aGlzLmlzQm9vdGVkID0gdHJ1ZSkpXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGdlbkRlZmF1bHRTbG90ICgpIHtcbiAgICAgIHJldHVybiBnZXRTbG90KHRoaXMpXG4gICAgfSxcbiAgICBnZW5Db250YWluZXIgKCk6IFZOb2RlIHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gW3RoaXMuZ2VuRGVmYXVsdFNsb3QoKV1cblxuICAgICAgaWYgKHRoaXMuc2hvd0Fycm93cykge1xuICAgICAgICBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuQ29udHJvbEljb25zKCkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiBbJ3Ytd2luZG93X19jb250YWluZXInLCB7XG4gICAgICAgICAgJ3Ytd2luZG93X19jb250YWluZXItLWlzLWFjdGl2ZSc6IHRoaXMuaXNBY3RpdmUsXG4gICAgICAgIH1dLFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIGhlaWdodDogdGhpcy5pbnRlcm5hbEhlaWdodCB8fCB0aGlzLnRyYW5zaXRpb25IZWlnaHQsXG4gICAgICAgIH0sXG4gICAgICB9LCBjaGlsZHJlbilcbiAgICB9LFxuICAgIGdlbkljb24gKFxuICAgICAgZGlyZWN0aW9uOiAncHJldicgfCAnbmV4dCcsXG4gICAgICBpY29uOiBzdHJpbmcsXG4gICAgICBjbGljazogKCkgPT4gdm9pZFxuICAgICkge1xuXG4gICAgICBjb25zdCBhdHRycyA9IHtcbiAgICAgICAgJ2FyaWEtbGFiZWwnOiB0aGlzLiR2dWV0aWZ5LmxhbmcudChgJHZ1ZXRpZnkuY2Fyb3VzZWwuJHtkaXJlY3Rpb259YCksXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICB0aGlzLmNoYW5nZWRCeURlbGltaXRlcnMgPSB0cnVlXG4gICAgICAgICAgY2xpY2soKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMuJHNsb3RzW2RpcmVjdGlvbl0/Lih7XG4gICAgICAgIGF0dHJzLFxuICAgICAgfSkgPz8gW2goVkJ0biwge1xuICAgICAgICBpY29uOiB0cnVlLFxuICAgICAgICAuLi5hdHRycyxcbiAgICAgIH0sIHtcbiAgICAgICAgZGVmYXVsdDogKCkgPT4gW1xuICAgICAgICAgIGgoVkljb24sIHtcbiAgICAgICAgICAgIGxhcmdlOiB0cnVlLFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGRlZmF1bHQ6ICgpID0+IGljb25cbiAgICAgICAgICB9KSxcbiAgICAgICAgXVxuICAgICAgfSldXG5cbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiBgdi13aW5kb3dfXyR7ZGlyZWN0aW9ufWAsXG4gICAgICB9LCBjaGlsZHJlbilcbiAgICB9LFxuICAgIGdlbkNvbnRyb2xJY29ucyAoKSB7XG4gICAgICBjb25zdCBpY29ucyA9IFtdXG5cbiAgICAgIGNvbnN0IHByZXZJY29uID0gdGhpcy4kdnVldGlmeS5ydGxcbiAgICAgICAgPyB0aGlzLm5leHRJY29uXG4gICAgICAgIDogdGhpcy5wcmV2SWNvblxuXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzLmhhc1ByZXYgJiZcbiAgICAgICAgcHJldkljb24gJiZcbiAgICAgICAgdHlwZW9mIHByZXZJY29uID09PSAnc3RyaW5nJ1xuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IGljb24gPSB0aGlzLmdlbkljb24oJ3ByZXYnLCBwcmV2SWNvbiwgdGhpcy5wcmV2KVxuICAgICAgICBpY29uICYmIGljb25zLnB1c2goaWNvbilcbiAgICAgIH1cblxuICAgICAgY29uc3QgbmV4dEljb24gPSB0aGlzLiR2dWV0aWZ5LnJ0bFxuICAgICAgICA/IHRoaXMucHJldkljb25cbiAgICAgICAgOiB0aGlzLm5leHRJY29uXG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuaGFzTmV4dCAmJlxuICAgICAgICBuZXh0SWNvbiAmJlxuICAgICAgICB0eXBlb2YgbmV4dEljb24gPT09ICdzdHJpbmcnXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgaWNvbiA9IHRoaXMuZ2VuSWNvbignbmV4dCcsIG5leHRJY29uLCB0aGlzLm5leHQpXG4gICAgICAgIGljb24gJiYgaWNvbnMucHVzaChpY29uKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaWNvbnNcbiAgICB9LFxuICAgIGdldE5leHRJbmRleCAoaW5kZXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgICBjb25zdCBuZXh0SW5kZXggPSAoaW5kZXggKyAxKSAlIHRoaXMuaXRlbXMubGVuZ3RoXG4gICAgICBjb25zdCBpdGVtID0gdGhpcy5pdGVtc1tuZXh0SW5kZXhdXG5cbiAgICAgIGlmIChpdGVtLmRpc2FibGVkKSByZXR1cm4gdGhpcy5nZXROZXh0SW5kZXgobmV4dEluZGV4KVxuXG4gICAgICByZXR1cm4gbmV4dEluZGV4XG4gICAgfSxcbiAgICBnZXRQcmV2SW5kZXggKGluZGV4OiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgY29uc3QgcHJldkluZGV4ID0gKGluZGV4ICsgdGhpcy5pdGVtcy5sZW5ndGggLSAxKSAlIHRoaXMuaXRlbXMubGVuZ3RoXG4gICAgICBjb25zdCBpdGVtID0gdGhpcy5pdGVtc1twcmV2SW5kZXhdXG5cbiAgICAgIGlmIChpdGVtLmRpc2FibGVkKSByZXR1cm4gdGhpcy5nZXRQcmV2SW5kZXgocHJldkluZGV4KVxuXG4gICAgICByZXR1cm4gcHJldkluZGV4XG4gICAgfSxcbiAgICBuZXh0ICgpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKCF0aGlzLmhhc0FjdGl2ZUl0ZW1zIHx8ICF0aGlzLmhhc05leHQpIHJldHVyblxuXG4gICAgICBjb25zdCBuZXh0SW5kZXggPSB0aGlzLmdldE5leHRJbmRleCh0aGlzLmludGVybmFsSW5kZXgpXG4gICAgICBjb25zdCBpdGVtID0gdGhpcy5pdGVtc1tuZXh0SW5kZXhdXG5cbiAgICAgIHRoaXMuaW50ZXJuYWxWYWx1ZSA9IHRoaXMuZ2V0VmFsdWUoaXRlbSwgbmV4dEluZGV4KVxuICAgIH0sXG4gICAgcHJldiAoKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgIGlmICghdGhpcy5oYXNBY3RpdmVJdGVtcyB8fCAhdGhpcy5oYXNQcmV2KSByZXR1cm5cblxuICAgICAgY29uc3QgbGFzdEluZGV4ID0gdGhpcy5nZXRQcmV2SW5kZXgodGhpcy5pbnRlcm5hbEluZGV4KVxuICAgICAgY29uc3QgaXRlbSA9IHRoaXMuaXRlbXNbbGFzdEluZGV4XVxuXG4gICAgICB0aGlzLmludGVybmFsVmFsdWUgPSB0aGlzLmdldFZhbHVlKGl0ZW0sIGxhc3RJbmRleClcbiAgICB9LFxuICAgIHVwZGF0ZVJldmVyc2UgKHZhbDogbnVtYmVyLCBvbGRWYWw6IG51bWJlcikge1xuICAgICAgY29uc3QgaXRlbXNMZW5ndGggPSB0aGlzLml0ZW1zLmxlbmd0aFxuICAgICAgY29uc3QgbGFzdEluZGV4ID0gaXRlbXNMZW5ndGggLSAxXG5cbiAgICAgIGlmIChpdGVtc0xlbmd0aCA8PSAyKSByZXR1cm4gdmFsIDwgb2xkVmFsXG5cbiAgICAgIGlmICh2YWwgPT09IGxhc3RJbmRleCAmJiBvbGRWYWwgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0gZWxzZSBpZiAodmFsID09PSAwICYmIG9sZFZhbCA9PT0gbGFzdEluZGV4KSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHZhbCA8IG9sZFZhbFxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgY29uc3QgZGlyZWN0aXZlcyA9IFtdXG5cbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgY2xhc3M6IFsndi13aW5kb3cnLCB0aGlzLmNsYXNzZXNdXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnRvdWNobGVzcykge1xuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnRvdWNoIHx8IHtcbiAgICAgICAgbGVmdDogKCkgPT4ge1xuICAgICAgICAgIHRoaXMuJHZ1ZXRpZnkucnRsID8gdGhpcy5wcmV2KCkgOiB0aGlzLm5leHQoKVxuICAgICAgICB9LFxuICAgICAgICByaWdodDogKCkgPT4ge1xuICAgICAgICAgIHRoaXMuJHZ1ZXRpZnkucnRsID8gdGhpcy5uZXh0KCkgOiB0aGlzLnByZXYoKVxuICAgICAgICB9LFxuICAgICAgICBlbmQ6IChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICB9LFxuICAgICAgICBzdGFydDogKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIH0sXG4gICAgICB9XG5cbiAgICAgIGRpcmVjdGl2ZXMucHVzaChbXG4gICAgICAgIFRvdWNoLFxuICAgICAgICB2YWx1ZVxuICAgICAgXSlcbiAgICB9XG5cbiAgICByZXR1cm4gd2l0aERpcmVjdGl2ZXMoaCgnZGl2JywgZGF0YSwgW3RoaXMuZ2VuQ29udGFpbmVyKCldKSwgZGlyZWN0aXZlcylcbiAgfSxcbn0pXG4iXX0=