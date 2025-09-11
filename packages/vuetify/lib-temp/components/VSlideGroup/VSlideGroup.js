import { h, withDirectives } from 'vue';
// Styles
import './VSlideGroup.sass';
// Components
import VIcon from '../VIcon';
import { VFadeTransition } from '../transitions';
// Extensions
import { BaseItemGroup } from '../VItemGroup/VItemGroup';
// Mixins
import Mobile from '../../mixins/mobile';
// Directives
import Resize from '../../directives/resize';
import Touch from '../../directives/touch';
// Utilities
import mixins from '../../util/mixins';
// Types
import { defineComponent } from 'vue';
import { composedPath, getSlot } from '../../util/helpers';
function bias(val) {
    const c = 0.501;
    const x = Math.abs(val);
    return Math.sign(val) * (x / ((1 / c - 2) * (1 - x) + 1));
}
export function calculateUpdatedOffset(selectedElement, widths, rtl, currentScrollOffset) {
    const clientWidth = selectedElement.clientWidth;
    const offsetLeft = rtl
        ? (widths.content - selectedElement.offsetLeft - clientWidth)
        : selectedElement.offsetLeft;
    if (rtl) {
        currentScrollOffset = -currentScrollOffset;
    }
    const totalWidth = widths.wrapper + currentScrollOffset;
    const itemOffset = clientWidth + offsetLeft;
    const additionalOffset = clientWidth * 0.4;
    if (offsetLeft <= currentScrollOffset) {
        currentScrollOffset = Math.max(offsetLeft - additionalOffset, 0);
    }
    else if (totalWidth <= itemOffset) {
        currentScrollOffset = Math.min(currentScrollOffset - (totalWidth - itemOffset - additionalOffset), widths.content - widths.wrapper);
    }
    return rtl ? -currentScrollOffset : currentScrollOffset;
}
export function calculateCenteredOffset(selectedElement, widths, rtl) {
    const { offsetLeft, clientWidth } = selectedElement;
    if (rtl) {
        const offsetCentered = widths.content - offsetLeft - clientWidth / 2 - widths.wrapper / 2;
        return -Math.min(widths.content - widths.wrapper, Math.max(0, offsetCentered));
    }
    else {
        const offsetCentered = offsetLeft + clientWidth / 2 - widths.wrapper / 2;
        return Math.min(widths.content - widths.wrapper, Math.max(0, offsetCentered));
    }
}
export const BaseSlideGroup = mixins(BaseItemGroup, Mobile).extend({
    name: 'base-slide-group',
    props: {
        activeClass: {
            type: String,
            default: 'v-slide-item--active',
        },
        centerActive: Boolean,
        nextIcon: {
            type: String,
            default: '$next',
        },
        prevIcon: {
            type: String,
            default: '$prev',
        },
        showArrows: {
            type: [Boolean, String],
            validator: (v) => (typeof v === 'boolean' || [
                'always',
                'never',
                'desktop',
                'mobile',
            ].includes(v)),
        },
    },
    emits: ['click:prev', 'click:next'],
    data: () => ({
        isOverflowing: false,
        resizeTimeout: 0,
        startX: 0,
        isSwipingHorizontal: false,
        isSwiping: false,
        scrollOffset: 0,
        widths: {
            content: 0,
            wrapper: 0,
        },
    }),
    computed: {
        canTouch() {
            return typeof window !== 'undefined';
        },
        __cachedNext() {
            return this.genTransition('next');
        },
        __cachedPrev() {
            return this.genTransition('prev');
        },
        classes() {
            return {
                ...BaseItemGroup.computed.classes.call(this),
                'v-slide-group': true,
                'v-slide-group--has-affixes': this.hasAffixes,
                'v-slide-group--is-overflowing': this.isOverflowing,
            };
        },
        hasAffixes() {
            switch (this.showArrows) {
                // Always show arrows on desktop & mobile
                case 'always': return true;
                // Always show arrows on desktop
                case 'desktop': return !this.isMobile;
                // Show arrows on mobile when overflowing.
                // This matches the default 2.2 behavior
                case true: return this.isOverflowing || Math.abs(this.scrollOffset) > 0;
                // Always show on mobile
                case 'mobile': return (this.isMobile ||
                    (this.isOverflowing || Math.abs(this.scrollOffset) > 0));
                // Always hide arrows
                case 'never': return false;
                // https://material.io/components/tabs#scrollable-tabs
                // Always show arrows when
                // overflowed on desktop
                default: return (!this.isMobile &&
                    (this.isOverflowing || Math.abs(this.scrollOffset) > 0));
            }
        },
        hasNext() {
            if (!this.hasAffixes)
                return false;
            const { content, wrapper } = this.widths;
            // Check one scroll ahead to know the width of right-most item
            return content > Math.abs(this.scrollOffset) + wrapper;
        },
        hasPrev() {
            return this.hasAffixes && this.scrollOffset !== 0;
        },
    },
    watch: {
        internalValue: 'setWidths',
        // When overflow changes, the arrows alter
        // the widths of the content and wrapper
        // and need to be recalculated
        isOverflowing: 'setWidths',
        scrollOffset(val) {
            if (this.$vuetify.rtl)
                val = -val;
            let scroll = val <= 0
                ? bias(-val)
                : val > this.widths.content - this.widths.wrapper
                    ? -(this.widths.content - this.widths.wrapper) + bias(this.widths.content - this.widths.wrapper - val)
                    : -val;
            if (this.$vuetify.rtl)
                scroll = -scroll;
            this.$refs.content.style.transform = `translateX(${scroll}px)`;
        },
    },
    mounted() {
        if (typeof ResizeObserver !== 'undefined') {
            const obs = new ResizeObserver(() => {
                this.onResize();
            });
            obs.observe(this.$el);
            obs.observe(this.$refs.content);
            this.$on('hook:destroyed', () => {
                obs.disconnect();
            });
        }
        else {
            let itemsLength = 0;
            this.$on('hook:beforeUpdate', () => {
                var _a;
                itemsLength = (((_a = this.$refs.content) === null || _a === void 0 ? void 0 : _a.children) || []).length;
            });
            this.$on('hook:updated', () => {
                var _a;
                if (itemsLength === (((_a = this.$refs.content) === null || _a === void 0 ? void 0 : _a.children) || []).length)
                    return;
                this.setWidths();
            });
        }
    },
    methods: {
        onScroll() {
            this.$refs.wrapper.scrollLeft = 0;
        },
        onFocusin(e) {
            if (!this.isOverflowing)
                return;
            // Focused element is likely to be the root of an item, so a
            // breadth-first search will probably find it in the first iteration
            for (const el of composedPath(e)) {
                for (const vm of this.items) {
                    if (vm.$el === el) {
                        this.scrollOffset = calculateUpdatedOffset(vm.$el, this.widths, this.$vuetify.rtl, this.scrollOffset);
                        return;
                    }
                }
            }
        },
        // Always generate next for scrollable hint
        genNext() {
            const slot = this.$slots.next
                ? this.$slots.next({})
                : getSlot(this, 'next') || this.__cachedNext;
            return h('div', {
                class: ['v-slide-group__next', {
                        'v-slide-group__next--disabled': !this.hasNext,
                    }],
                onClick: () => this.onAffixClick('next'),
                key: 'next',
            }, [slot]);
        },
        genContent() {
            return h('div', {
                class: 'v-slide-group__content',
                ref: 'content',
                onFocusin: this.onFocusin,
            }, getSlot(this));
        },
        genData() {
            return {
                class: this.classes
            };
        },
        genIcon(location) {
            let icon = location;
            if (this.$vuetify.rtl && location === 'prev') {
                icon = 'next';
            }
            else if (this.$vuetify.rtl && location === 'next') {
                icon = 'prev';
            }
            const upperLocation = `${location[0].toUpperCase()}${location.slice(1)}`;
            const hasAffix = this[`has${upperLocation}`];
            if (!this.showArrows &&
                !hasAffix)
                return null;
            return h(VIcon, () => ({
                disabled: !hasAffix,
            }, this[`${icon}Icon`]));
        },
        // Always generate prev for scrollable hint
        genPrev() {
            const slot = this.$slots.prev
                ? this.$slots.prev({})
                : getSlot(this, 'prev') || this.__cachedPrev;
            return h('div', {
                class: ['v-slide-group__prev', {
                        'v-slide-group__prev--disabled': !this.hasPrev,
                    }],
                onClick: () => this.onAffixClick('prev'),
                key: 'prev',
            }, [slot]);
        },
        genTransition(location) {
            return h(VFadeTransition, () => [this.genIcon(location)]);
        },
        genWrapper() {
            return withDirectives(h('div', {
                class: 'v-slide-group__wrapper',
                ref: 'wrapper',
                onScroll: this.onScroll,
            }, [this.genContent()]), [
                [
                    Touch,
                    {
                        start: (e) => this.overflowCheck(e, this.onTouchStart),
                        move: (e) => this.overflowCheck(e, this.onTouchMove),
                        end: (e) => this.overflowCheck(e, this.onTouchEnd),
                    }
                ]
            ]);
        },
        calculateNewOffset(direction, widths, rtl, currentScrollOffset) {
            const sign = rtl ? -1 : 1;
            const newAbosluteOffset = sign * currentScrollOffset +
                (direction === 'prev' ? -1 : 1) * widths.wrapper;
            return sign * Math.max(Math.min(newAbosluteOffset, widths.content - widths.wrapper), 0);
        },
        onAffixClick(location) {
            this.$emit(`click:${location}`);
            this.scrollTo(location);
        },
        onResize() {
            /* istanbul ignore next */
            if (this._isDestroyed)
                return;
            this.setWidths();
        },
        onTouchStart(e) {
            const { content } = this.$refs;
            this.startX = this.scrollOffset + e.touchstartX;
            content.style.setProperty('transition', 'none');
            content.style.setProperty('willChange', 'transform');
        },
        onTouchMove(e) {
            if (!this.canTouch)
                return;
            if (!this.isSwiping) {
                // only calculate disableSwipeHorizontal during the first onTouchMove invoke
                // in order to ensure disableSwipeHorizontal value is consistent between onTouchStart and onTouchEnd
                const diffX = e.touchmoveX - e.touchstartX;
                const diffY = e.touchmoveY - e.touchstartY;
                this.isSwipingHorizontal = Math.abs(diffX) > Math.abs(diffY);
                this.isSwiping = true;
            }
            if (this.isSwipingHorizontal) {
                // sliding horizontally
                this.scrollOffset = this.startX - e.touchmoveX;
                // temporarily disable window vertical scrolling
                document.documentElement.style.overflowY = 'hidden';
            }
        },
        onTouchEnd() {
            if (!this.canTouch)
                return;
            const { content, wrapper } = this.$refs;
            const maxScrollOffset = content.clientWidth - wrapper.clientWidth;
            content.style.setProperty('transition', null);
            content.style.setProperty('willChange', null);
            if (this.$vuetify.rtl) {
                /* istanbul ignore else */
                if (this.scrollOffset > 0 || !this.isOverflowing) {
                    this.scrollOffset = 0;
                }
                else if (this.scrollOffset <= -maxScrollOffset) {
                    this.scrollOffset = -maxScrollOffset;
                }
            }
            else {
                /* istanbul ignore else */
                if (this.scrollOffset < 0 || !this.isOverflowing) {
                    this.scrollOffset = 0;
                }
                else if (this.scrollOffset >= maxScrollOffset) {
                    this.scrollOffset = maxScrollOffset;
                }
            }
            this.isSwiping = false;
            // rollback whole page scrolling to default
            document.documentElement.style.removeProperty('overflow-y');
        },
        overflowCheck(e, fn) {
            e.stopPropagation();
            this.isOverflowing && fn(e);
        },
        scrollIntoView /* istanbul ignore next */() {
            if (!this.selectedItem && this.items.length) {
                const lastItemPosition = this.items[this.items.length - 1].$el.getBoundingClientRect();
                const wrapperPosition = this.$refs.wrapper.getBoundingClientRect();
                if ((this.$vuetify.rtl && wrapperPosition.right < lastItemPosition.right) ||
                    (!this.$vuetify.rtl && wrapperPosition.left > lastItemPosition.left)) {
                    this.scrollTo('prev');
                }
            }
            if (!this.selectedItem) {
                return;
            }
            if (this.selectedIndex === 0 ||
                (!this.centerActive && !this.isOverflowing)) {
                this.scrollOffset = 0;
            }
            else if (this.centerActive) {
                this.scrollOffset = calculateCenteredOffset(this.selectedItem.$el, this.widths, this.$vuetify.rtl);
            }
            else if (this.isOverflowing) {
                this.scrollOffset = calculateUpdatedOffset(this.selectedItem.$el, this.widths, this.$vuetify.rtl, this.scrollOffset);
            }
        },
        scrollTo /* istanbul ignore next */(location) {
            this.scrollOffset = this.calculateNewOffset(location, {
                // Force reflow
                content: this.$refs.content ? this.$refs.content.clientWidth : 0,
                wrapper: this.$refs.wrapper ? this.$refs.wrapper.clientWidth : 0,
            }, this.$vuetify.rtl, this.scrollOffset);
        },
        setWidths() {
            window.requestAnimationFrame(() => {
                if (this._isDestroyed)
                    return;
                const { content, wrapper } = this.$refs;
                this.widths = {
                    content: content ? content.clientWidth : 0,
                    wrapper: wrapper ? wrapper.clientWidth : 0,
                };
                // https://github.com/vuetifyjs/vuetify/issues/13212
                // We add +1 to the wrappers width to prevent an issue where the `clientWidth`
                // gets calculated wrongly by the browser if using a different zoom-level.
                this.isOverflowing = this.widths.wrapper + 1 < this.widths.content;
                this.scrollIntoView();
            });
        },
    },
    render() {
        return withDirectives(h('div', this.genData(), [
            this.genPrev(),
            this.genWrapper(),
            this.genNext(),
        ]), [
            [
                Resize,
                this.onResize
            ]
        ]);
    },
});
export default defineComponent({
    name: 'v-slide-group',
    extends: BaseSlideGroup,
    provide() {
        return {
            slideGroup: this,
        };
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNsaWRlR3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WU2xpZGVHcm91cC9WU2xpZGVHcm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsQ0FBQyxFQUFFLGNBQWMsRUFBQyxNQUFNLEtBQUssQ0FBQTtBQUNyQyxTQUFTO0FBQ1QsT0FBTyxvQkFBb0IsQ0FBQTtBQUUzQixhQUFhO0FBQ2IsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFBO0FBQzVCLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUVoRCxhQUFhO0FBQ2IsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFBO0FBRXhELFNBQVM7QUFDVCxPQUFPLE1BQU0sTUFBTSxxQkFBcUIsQ0FBQTtBQUV4QyxhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0seUJBQXlCLENBQUE7QUFDNUMsT0FBTyxLQUFLLE1BQU0sd0JBQXdCLENBQUE7QUFFMUMsWUFBWTtBQUNaLE9BQU8sTUFBc0IsTUFBTSxtQkFBbUIsQ0FBQTtBQUV0RCxRQUFRO0FBQ1IsT0FBWSxFQUFTLGVBQWUsRUFBRSxNQUFNLEtBQUssQ0FBQTtBQUNqRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBc0IxRCxTQUFTLElBQUksQ0FBRSxHQUFXO0lBQ3hCLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQTtJQUNmLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDdkIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFD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O1lBQzdDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDZCxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxPQUFPLEVBQUU7U0FDZixDQUFDLEVBQUU7WUFDRjtnQkFDRSxNQUFNO2dCQUNOLElBQUksQ0FBQyxRQUFRO2FBQ2Q7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBO0FBRUYsZUFBZSxlQUFlLENBQUM7SUFDN0IsSUFBSSxFQUFFLGVBQWU7SUFFckIsT0FBTyxFQUFFLGNBQWM7SUFFdkIsT0FBTztRQUNMLE9BQU87WUFDTCxVQUFVLEVBQUUsSUFBSTtTQUNqQixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aCwgd2l0aERpcmVjdGl2ZXN9IGZyb20gJ3Z1ZSdcbi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZTbGlkZUdyb3VwLnNhc3MnXG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCBWSWNvbiBmcm9tICcuLi9WSWNvbidcbmltcG9ydCB7IFZGYWRlVHJhbnNpdGlvbiB9IGZyb20gJy4uL3RyYW5zaXRpb25zJ1xuXG4vLyBFeHRlbnNpb25zXG5pbXBvcnQgeyBCYXNlSXRlbUdyb3VwIH0gZnJvbSAnLi4vVkl0ZW1Hcm91cC9WSXRlbUdyb3VwJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBNb2JpbGUgZnJvbSAnLi4vLi4vbWl4aW5zL21vYmlsZSdcblxuLy8gRGlyZWN0aXZlc1xuaW1wb3J0IFJlc2l6ZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3Jlc2l6ZSdcbmltcG9ydCBUb3VjaCBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3RvdWNoJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCBtaXhpbnMsIHsgRXh0cmFjdFZ1ZSB9IGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IFZ1ZSwgeyBWTm9kZSwgZGVmaW5lQ29tcG9uZW50IH0gZnJvbSAndnVlJ1xuaW1wb3J0IHsgY29tcG9zZWRQYXRoLCBnZXRTbG90IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuXG5pbnRlcmZhY2UgVG91Y2hFdmVudCB7XG4gIHRvdWNoc3RhcnRYOiBudW1iZXJcbiAgdG91Y2hzdGFydFk6IG51bWJlclxuICB0b3VjaG1vdmVYOiBudW1iZXJcbiAgdG91Y2htb3ZlWTogbnVtYmVyXG4gIHN0b3BQcm9wYWdhdGlvbjogRnVuY3Rpb25cbn1cblxuaW50ZXJmYWNlIFdpZHRocyB7XG4gIGNvbnRlbnQ6IG51bWJlclxuICB3cmFwcGVyOiBudW1iZXJcbn1cblxuaW50ZXJmYWNlIG9wdGlvbnMgZXh0ZW5kcyBWdWUge1xuICAkcmVmczoge1xuICAgIGNvbnRlbnQ6IEhUTUxFbGVtZW50XG4gICAgd3JhcHBlcjogSFRNTEVsZW1lbnRcbiAgfVxufVxuXG5mdW5jdGlvbiBiaWFzICh2YWw6IG51bWJlcikge1xuICBjb25zdCBjID0gMC41MDFcbiAgY29uc3QgeCA9IE1hdGguYWJzKHZhbClcbiAgcmV0dXJuIE1hdGguc2lnbih2YWwpICogKHggLyAoKDEgLyBjIC0gMikgKiAoMSAtIHgpICsgMSkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYWxjdWxhdGVVcGRhdGVkT2Zmc2V0IChcbiAgc2VsZWN0ZWRFbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgd2lkdGhzOiBXaWR0aHMsXG4gIHJ0bDogYm9vbGVhbixcbiAgY3VycmVudFNjcm9sbE9mZnNldDogbnVtYmVyXG4pOiBudW1iZXIge1xuICBjb25zdCBjbGllbnRXaWR0aCA9IHNlbGVjdGVkRWxlbWVudC5jbGllbnRXaWR0aFxuICBjb25zdCBvZmZzZXRMZWZ0ID0gcnRsXG4gICAgPyAod2lkdGhzLmNvbnRlbnQgLSBzZWxlY3RlZEVsZW1lbnQub2Zmc2V0TGVmdCAtIGNsaWVudFdpZHRoKVxuICAgIDogc2VsZWN0ZWRFbGVtZW50Lm9mZnNldExlZnRcblxuICBpZiAocnRsKSB7XG4gICAgY3VycmVudFNjcm9sbE9mZnNldCA9IC1jdXJyZW50U2Nyb2xsT2Zmc2V0XG4gIH1cblxuICBjb25zdCB0b3RhbFdpZHRoID0gd2lkdGhzLndyYXBwZXIgKyBjdXJyZW50U2Nyb2xsT2Zmc2V0XG4gIGNvbnN0IGl0ZW1PZmZzZXQgPSBjbGllbnRXaWR0aCArIG9mZnNldExlZnRcbiAgY29uc3QgYWRkaXRpb25hbE9mZnNldCA9IGNsaWVudFdpZHRoICogMC40XG5cbiAgaWYgKG9mZnNldExlZnQgPD0gY3VycmVudFNjcm9sbE9mZnNldCkge1xuICAgIGN1cnJlbnRTY3JvbGxPZmZzZXQgPSBNYXRoLm1heChvZmZzZXRMZWZ0IC0gYWRkaXRpb25hbE9mZnNldCwgMClcbiAgfSBlbHNlIGlmICh0b3RhbFdpZHRoIDw9IGl0ZW1PZmZzZXQpIHtcbiAgICBjdXJyZW50U2Nyb2xsT2Zmc2V0ID0gTWF0aC5taW4oY3VycmVudFNjcm9sbE9mZnNldCAtICh0b3RhbFdpZHRoIC0gaXRlbU9mZnNldCAtIGFkZGl0aW9uYWxPZmZzZXQpLCB3aWR0aHMuY29udGVudCAtIHdpZHRocy53cmFwcGVyKVxuICB9XG5cbiAgcmV0dXJuIHJ0bCA/IC1jdXJyZW50U2Nyb2xsT2Zmc2V0IDogY3VycmVudFNjcm9sbE9mZnNldFxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FsY3VsYXRlQ2VudGVyZWRPZmZzZXQgKFxuICBzZWxlY3RlZEVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICB3aWR0aHM6IFdpZHRocyxcbiAgcnRsOiBib29sZWFuXG4pOiBudW1iZXIge1xuICBjb25zdCB7IG9mZnNldExlZnQsIGNsaWVudFdpZHRoIH0gPSBzZWxlY3RlZEVsZW1lbnRcblxuICBpZiAocnRsKSB7XG4gICAgY29uc3Qgb2Zmc2V0Q2VudGVyZWQgPSB3aWR0aHMuY29udGVudCAtIG9mZnNldExlZnQgLSBjbGllbnRXaWR0aCAvIDIgLSB3aWR0aHMud3JhcHBlciAvIDJcbiAgICByZXR1cm4gLU1hdGgubWluKHdpZHRocy5jb250ZW50IC0gd2lkdGhzLndyYXBwZXIsIE1hdGgubWF4KDAsIG9mZnNldENlbnRlcmVkKSlcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBvZmZzZXRDZW50ZXJlZCA9IG9mZnNldExlZnQgKyBjbGllbnRXaWR0aCAvIDIgLSB3aWR0aHMud3JhcHBlciAvIDJcbiAgICByZXR1cm4gTWF0aC5taW4od2lkdGhzLmNvbnRlbnQgLSB3aWR0aHMud3JhcHBlciwgTWF0aC5tYXgoMCwgb2Zmc2V0Q2VudGVyZWQpKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBCYXNlU2xpZGVHcm91cCA9IG1peGluczxvcHRpb25zICZcbi8qIGVzbGludC1kaXNhYmxlIGluZGVudCAqL1xuICBFeHRyYWN0VnVlPFtcbiAgICB0eXBlb2YgQmFzZUl0ZW1Hcm91cCxcbiAgICB0eXBlb2YgTW9iaWxlLFxuICBdPlxuLyogZXNsaW50LWVuYWJsZSBpbmRlbnQgKi9cbj4oXG4gIEJhc2VJdGVtR3JvdXAsXG4gIE1vYmlsZSxcbiAgLyogQHZ1ZS9jb21wb25lbnQgKi9cbikuZXh0ZW5kKHtcbiAgbmFtZTogJ2Jhc2Utc2xpZGUtZ3JvdXAnLFxuXG5cbiAgcHJvcHM6IHtcbiAgICBhY3RpdmVDbGFzczoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ3Ytc2xpZGUtaXRlbS0tYWN0aXZlJyxcbiAgICB9LFxuICAgIGNlbnRlckFjdGl2ZTogQm9vbGVhbixcbiAgICBuZXh0SWNvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyRuZXh0JyxcbiAgICB9LFxuICAgIHByZXZJY29uOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJHByZXYnLFxuICAgIH0sXG4gICAgc2hvd0Fycm93czoge1xuICAgICAgdHlwZTogW0Jvb2xlYW4sIFN0cmluZ10sXG4gICAgICB2YWxpZGF0b3I6ICh2OiBhbnkpID0+IChcbiAgICAgICAgdHlwZW9mIHYgPT09ICdib29sZWFuJyB8fCBbXG4gICAgICAgICAgJ2Fsd2F5cycsXG4gICAgICAgICAgJ25ldmVyJyxcbiAgICAgICAgICAnZGVza3RvcCcsXG4gICAgICAgICAgJ21vYmlsZScsXG4gICAgICAgIF0uaW5jbHVkZXModilcbiAgICAgICksXG4gICAgfSxcbiAgfSxcblxuICBlbWl0czogWydjbGljazpwcmV2JywgJ2NsaWNrOm5leHQnXSxcblxuICBkYXRhOiAoKSA9PiAoe1xuICAgIGlzT3ZlcmZsb3dpbmc6IGZhbHNlLFxuICAgIHJlc2l6ZVRpbWVvdXQ6IDAsXG4gICAgc3RhcnRYOiAwLFxuICAgIGlzU3dpcGluZ0hvcml6b250YWw6IGZhbHNlLFxuICAgIGlzU3dpcGluZzogZmFsc2UsXG4gICAgc2Nyb2xsT2Zmc2V0OiAwLFxuICAgIHdpZHRoczoge1xuICAgICAgY29udGVudDogMCxcbiAgICAgIHdyYXBwZXI6IDAsXG4gICAgfSxcbiAgfSksXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjYW5Ub3VjaCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICB9LFxuICAgIF9fY2FjaGVkTmV4dCAoKTogVk5vZGUge1xuICAgICAgcmV0dXJuIHRoaXMuZ2VuVHJhbnNpdGlvbignbmV4dCcpXG4gICAgfSxcbiAgICBfX2NhY2hlZFByZXYgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiB0aGlzLmdlblRyYW5zaXRpb24oJ3ByZXYnKVxuICAgIH0sXG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLkJhc2VJdGVtR3JvdXAuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi1zbGlkZS1ncm91cCc6IHRydWUsXG4gICAgICAgICd2LXNsaWRlLWdyb3VwLS1oYXMtYWZmaXhlcyc6IHRoaXMuaGFzQWZmaXhlcyxcbiAgICAgICAgJ3Ytc2xpZGUtZ3JvdXAtLWlzLW92ZXJmbG93aW5nJzogdGhpcy5pc092ZXJmbG93aW5nLFxuICAgICAgfVxuICAgIH0sXG4gICAgaGFzQWZmaXhlcyAoKTogQm9vbGVhbiB7XG4gICAgICBzd2l0Y2ggKHRoaXMuc2hvd0Fycm93cykge1xuICAgICAgICAvLyBBbHdheXMgc2hvdyBhcnJvd3Mgb24gZGVza3RvcCAmIG1vYmlsZVxuICAgICAgICBjYXNlICdhbHdheXMnOiByZXR1cm4gdHJ1ZVxuXG4gICAgICAgIC8vIEFsd2F5cyBzaG93IGFycm93cyBvbiBkZXNrdG9wXG4gICAgICAgIGNhc2UgJ2Rlc2t0b3AnOiByZXR1cm4gIXRoaXMuaXNNb2JpbGVcblxuICAgICAgICAvLyBTaG93IGFycm93cyBvbiBtb2JpbGUgd2hlbiBvdmVyZmxvd2luZy5cbiAgICAgICAgLy8gVGhpcyBtYXRjaGVzIHRoZSBkZWZhdWx0IDIuMiBiZWhhdmlvclxuICAgICAgICBjYXNlIHRydWU6IHJldHVybiB0aGlzLmlzT3ZlcmZsb3dpbmcgfHwgTWF0aC5hYnModGhpcy5zY3JvbGxPZmZzZXQpID4gMFxuXG4gICAgICAgIC8vIEFsd2F5cyBzaG93IG9uIG1vYmlsZVxuICAgICAgICBjYXNlICdtb2JpbGUnOiByZXR1cm4gKFxuICAgICAgICAgIHRoaXMuaXNNb2JpbGUgfHxcbiAgICAgICAgICAodGhpcy5pc092ZXJmbG93aW5nIHx8IE1hdGguYWJzKHRoaXMuc2Nyb2xsT2Zmc2V0KSA+IDApXG4gICAgICAgIClcblxuICAgICAgICAvLyBBbHdheXMgaGlkZSBhcnJvd3NcbiAgICAgICAgY2FzZSAnbmV2ZXInOiByZXR1cm4gZmFsc2VcblxuICAgICAgICAvLyBodHRwczovL21hdGVyaWFsLmlvL2NvbXBvbmVudHMvdGFicyNzY3JvbGxhYmxlLXRhYnNcbiAgICAgICAgLy8gQWx3YXlzIHNob3cgYXJyb3dzIHdoZW5cbiAgICAgICAgLy8gb3ZlcmZsb3dlZCBvbiBkZXNrdG9wXG4gICAgICAgIGRlZmF1bHQ6IHJldHVybiAoXG4gICAgICAgICAgIXRoaXMuaXNNb2JpbGUgJiZcbiAgICAgICAgICAodGhpcy5pc092ZXJmbG93aW5nIHx8IE1hdGguYWJzKHRoaXMuc2Nyb2xsT2Zmc2V0KSA+IDApXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9LFxuICAgIGhhc05leHQgKCk6IGJvb2xlYW4ge1xuICAgICAgaWYgKCF0aGlzLmhhc0FmZml4ZXMpIHJldHVybiBmYWxzZVxuXG4gICAgICBjb25zdCB7IGNvbnRlbnQsIHdyYXBwZXIgfSA9IHRoaXMud2lkdGhzXG5cbiAgICAgIC8vIENoZWNrIG9uZSBzY3JvbGwgYWhlYWQgdG8ga25vdyB0aGUgd2lkdGggb2YgcmlnaHQtbW9zdCBpdGVtXG4gICAgICByZXR1cm4gY29udGVudCA+IE1hdGguYWJzKHRoaXMuc2Nyb2xsT2Zmc2V0KSArIHdyYXBwZXJcbiAgICB9LFxuICAgIGhhc1ByZXYgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuaGFzQWZmaXhlcyAmJiB0aGlzLnNjcm9sbE9mZnNldCAhPT0gMFxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBpbnRlcm5hbFZhbHVlOiAnc2V0V2lkdGhzJyxcbiAgICAvLyBXaGVuIG92ZXJmbG93IGNoYW5nZXMsIHRoZSBhcnJvd3MgYWx0ZXJcbiAgICAvLyB0aGUgd2lkdGhzIG9mIHRoZSBjb250ZW50IGFuZCB3cmFwcGVyXG4gICAgLy8gYW5kIG5lZWQgdG8gYmUgcmVjYWxjdWxhdGVkXG4gICAgaXNPdmVyZmxvd2luZzogJ3NldFdpZHRocycsXG4gICAgc2Nyb2xsT2Zmc2V0ICh2YWwpIHtcbiAgICAgIGlmICh0aGlzLiR2dWV0aWZ5LnJ0bCkgdmFsID0gLXZhbFxuXG4gICAgICBsZXQgc2Nyb2xsID1cbiAgICAgICAgdmFsIDw9IDBcbiAgICAgICAgICA/IGJpYXMoLXZhbClcbiAgICAgICAgICA6IHZhbCA+IHRoaXMud2lkdGhzLmNvbnRlbnQgLSB0aGlzLndpZHRocy53cmFwcGVyXG4gICAgICAgICAgICA/IC0odGhpcy53aWR0aHMuY29udGVudCAtIHRoaXMud2lkdGhzLndyYXBwZXIpICsgYmlhcyh0aGlzLndpZHRocy5jb250ZW50IC0gdGhpcy53aWR0aHMud3JhcHBlciAtIHZhbClcbiAgICAgICAgICAgIDogLXZhbFxuXG4gICAgICBpZiAodGhpcy4kdnVldGlmeS5ydGwpIHNjcm9sbCA9IC1zY3JvbGxcblxuICAgICAgdGhpcy4kcmVmcy5jb250ZW50LnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7c2Nyb2xsfXB4KWBcbiAgICB9LFxuICB9LFxuXG4gIG1vdW50ZWQgKCkge1xuICAgIGlmICh0eXBlb2YgUmVzaXplT2JzZXJ2ZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCBvYnMgPSBuZXcgUmVzaXplT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICB0aGlzLm9uUmVzaXplKClcbiAgICAgIH0pXG4gICAgICBvYnMub2JzZXJ2ZSh0aGlzLiRlbClcbiAgICAgIG9icy5vYnNlcnZlKHRoaXMuJHJlZnMuY29udGVudClcbiAgICAgIHRoaXMuJG9uKCdob29rOmRlc3Ryb3llZCcsICgpID0+IHtcbiAgICAgICAgb2JzLmRpc2Nvbm5lY3QoKVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGl0ZW1zTGVuZ3RoID0gMFxuICAgICAgdGhpcy4kb24oJ2hvb2s6YmVmb3JlVXBkYXRlJywgKCkgPT4ge1xuICAgICAgICBpdGVtc0xlbmd0aCA9ICh0aGlzLiRyZWZzLmNvbnRlbnQ/LmNoaWxkcmVuIHx8IFtdKS5sZW5ndGhcbiAgICAgIH0pXG4gICAgICB0aGlzLiRvbignaG9vazp1cGRhdGVkJywgKCkgPT4ge1xuICAgICAgICBpZiAoaXRlbXNMZW5ndGggPT09ICh0aGlzLiRyZWZzLmNvbnRlbnQ/LmNoaWxkcmVuIHx8IFtdKS5sZW5ndGgpIHJldHVyblxuICAgICAgICB0aGlzLnNldFdpZHRocygpXG4gICAgICB9KVxuICAgIH1cbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgb25TY3JvbGwgKCkge1xuICAgICAgdGhpcy4kcmVmcy53cmFwcGVyLnNjcm9sbExlZnQgPSAwXG4gICAgfSxcbiAgICBvbkZvY3VzaW4gKGU6IEZvY3VzRXZlbnQpIHtcbiAgICAgIGlmICghdGhpcy5pc092ZXJmbG93aW5nKSByZXR1cm5cblxuICAgICAgLy8gRm9jdXNlZCBlbGVtZW50IGlzIGxpa2VseSB0byBiZSB0aGUgcm9vdCBvZiBhbiBpdGVtLCBzbyBhXG4gICAgICAvLyBicmVhZHRoLWZpcnN0IHNlYXJjaCB3aWxsIHByb2JhYmx5IGZpbmQgaXQgaW4gdGhlIGZpcnN0IGl0ZXJhdGlvblxuICAgICAgZm9yIChjb25zdCBlbCBvZiBjb21wb3NlZFBhdGgoZSkpIHtcbiAgICAgICAgZm9yIChjb25zdCB2bSBvZiB0aGlzLml0ZW1zKSB7XG4gICAgICAgICAgaWYgKHZtLiRlbCA9PT0gZWwpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsT2Zmc2V0ID0gY2FsY3VsYXRlVXBkYXRlZE9mZnNldChcbiAgICAgICAgICAgICAgdm0uJGVsIGFzIEhUTUxFbGVtZW50LFxuICAgICAgICAgICAgICB0aGlzLndpZHRocyxcbiAgICAgICAgICAgICAgdGhpcy4kdnVldGlmeS5ydGwsXG4gICAgICAgICAgICAgIHRoaXMuc2Nyb2xsT2Zmc2V0XG4gICAgICAgICAgICApXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIC8vIEFsd2F5cyBnZW5lcmF0ZSBuZXh0IGZvciBzY3JvbGxhYmxlIGhpbnRcbiAgICBnZW5OZXh0ICgpOiBWTm9kZSB8IG51bGwge1xuICAgICAgY29uc3Qgc2xvdCA9IHRoaXMuJHNsb3RzLm5leHRcbiAgICAgICAgPyB0aGlzLiRzbG90cy5uZXh0KHt9KVxuICAgICAgICA6IGdldFNsb3QodGhpcywgJ25leHQnKSB8fCB0aGlzLl9fY2FjaGVkTmV4dFxuXG4gICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogWyd2LXNsaWRlLWdyb3VwX19uZXh0Jywge1xuICAgICAgICAgICd2LXNsaWRlLWdyb3VwX19uZXh0LS1kaXNhYmxlZCc6ICF0aGlzLmhhc05leHQsXG4gICAgICAgIH1dLFxuICAgICAgICBvbkNsaWNrOiAoKSA9PiB0aGlzLm9uQWZmaXhDbGljaygnbmV4dCcpLFxuICAgICAgICBrZXk6ICduZXh0JyxcbiAgICAgIH0sIFtzbG90XSlcbiAgICB9LFxuICAgIGdlbkNvbnRlbnQgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiAndi1zbGlkZS1ncm91cF9fY29udGVudCcsXG4gICAgICAgIHJlZjogJ2NvbnRlbnQnLFxuICAgICAgICBvbkZvY3VzaW46IHRoaXMub25Gb2N1c2luLFxuICAgICAgfSwgZ2V0U2xvdCh0aGlzKSlcbiAgICB9LFxuICAgIGdlbkRhdGEgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjbGFzczogdGhpcy5jbGFzc2VzXG4gICAgICB9XG4gICAgfSxcbiAgICBnZW5JY29uIChsb2NhdGlvbjogJ3ByZXYnIHwgJ25leHQnKTogVk5vZGUgfCBudWxsIHtcbiAgICAgIGxldCBpY29uID0gbG9jYXRpb25cblxuICAgICAgaWYgKHRoaXMuJHZ1ZXRpZnkucnRsICYmIGxvY2F0aW9uID09PSAncHJldicpIHtcbiAgICAgICAgaWNvbiA9ICduZXh0J1xuICAgICAgfSBlbHNlIGlmICh0aGlzLiR2dWV0aWZ5LnJ0bCAmJiBsb2NhdGlvbiA9PT0gJ25leHQnKSB7XG4gICAgICAgIGljb24gPSAncHJldidcbiAgICAgIH1cblxuICAgICAgY29uc3QgdXBwZXJMb2NhdGlvbiA9IGAke2xvY2F0aW9uWzBdLnRvVXBwZXJDYXNlKCl9JHtsb2NhdGlvbi5zbGljZSgxKX1gXG4gICAgICBjb25zdCBoYXNBZmZpeCA9ICh0aGlzIGFzIGFueSlbYGhhcyR7dXBwZXJMb2NhdGlvbn1gXVxuXG4gICAgICBpZiAoXG4gICAgICAgICF0aGlzLnNob3dBcnJvd3MgJiZcbiAgICAgICAgIWhhc0FmZml4XG4gICAgICApIHJldHVybiBudWxsXG5cbiAgICAgIHJldHVybiBoKFZJY29uLCAoKSA9PiAoe1xuICAgICAgICBkaXNhYmxlZDogIWhhc0FmZml4LFxuICAgICAgfSwgKHRoaXMgYXMgYW55KVtgJHtpY29ufUljb25gXSkpXG4gICAgfSxcbiAgICAvLyBBbHdheXMgZ2VuZXJhdGUgcHJldiBmb3Igc2Nyb2xsYWJsZSBoaW50XG4gICAgZ2VuUHJldiAoKTogVk5vZGUgfCBudWxsIHtcbiAgICAgIGNvbnN0IHNsb3QgPSB0aGlzLiRzbG90cy5wcmV2XG4gICAgICAgID8gdGhpcy4kc2xvdHMucHJldih7fSlcbiAgICAgICAgOiBnZXRTbG90KHRoaXMsICdwcmV2JykgfHwgdGhpcy5fX2NhY2hlZFByZXZcblxuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFsndi1zbGlkZS1ncm91cF9fcHJldicsIHtcbiAgICAgICAgICAndi1zbGlkZS1ncm91cF9fcHJldi0tZGlzYWJsZWQnOiAhdGhpcy5oYXNQcmV2LFxuICAgICAgICB9XSxcbiAgICAgICAgb25DbGljazogKCkgPT4gdGhpcy5vbkFmZml4Q2xpY2soJ3ByZXYnKSxcbiAgICAgICAga2V5OiAncHJldicsXG4gICAgICB9LCBbc2xvdF0pXG4gICAgfSxcbiAgICBnZW5UcmFuc2l0aW9uIChsb2NhdGlvbjogJ3ByZXYnIHwgJ25leHQnKSB7XG4gICAgICByZXR1cm4gaChWRmFkZVRyYW5zaXRpb24sICgpID0+IFt0aGlzLmdlbkljb24obG9jYXRpb24pXSlcbiAgICB9LFxuICAgIGdlbldyYXBwZXIgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiB3aXRoRGlyZWN0aXZlcyhoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiAndi1zbGlkZS1ncm91cF9fd3JhcHBlcicsXG4gICAgICAgIHJlZjogJ3dyYXBwZXInLFxuICAgICAgICBvblNjcm9sbDogdGhpcy5vblNjcm9sbCxcbiAgICAgIH0sIFt0aGlzLmdlbkNvbnRlbnQoKV0pLCBbXG4gICAgICAgIFtcbiAgICAgICAgICBUb3VjaCxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFydDogKGU6IFRvdWNoRXZlbnQpID0+IHRoaXMub3ZlcmZsb3dDaGVjayhlLCB0aGlzLm9uVG91Y2hTdGFydCksXG4gICAgICAgICAgICBtb3ZlOiAoZTogVG91Y2hFdmVudCkgPT4gdGhpcy5vdmVyZmxvd0NoZWNrKGUsIHRoaXMub25Ub3VjaE1vdmUpLFxuICAgICAgICAgICAgZW5kOiAoZTogVG91Y2hFdmVudCkgPT4gdGhpcy5vdmVyZmxvd0NoZWNrKGUsIHRoaXMub25Ub3VjaEVuZCksXG4gICAgICAgICAgfVxuICAgICAgICBdXG5cbiAgICAgIF0pXG4gICAgfSxcbiAgICBjYWxjdWxhdGVOZXdPZmZzZXQgKGRpcmVjdGlvbjogJ3ByZXYnIHwgJ25leHQnLCB3aWR0aHM6IFdpZHRocywgcnRsOiBib29sZWFuLCBjdXJyZW50U2Nyb2xsT2Zmc2V0OiBudW1iZXIpIHtcbiAgICAgIGNvbnN0IHNpZ24gPSBydGwgPyAtMSA6IDFcbiAgICAgIGNvbnN0IG5ld0Fib3NsdXRlT2Zmc2V0ID0gc2lnbiAqIGN1cnJlbnRTY3JvbGxPZmZzZXQgK1xuICAgICAgICAoZGlyZWN0aW9uID09PSAncHJldicgPyAtMSA6IDEpICogd2lkdGhzLndyYXBwZXJcblxuICAgICAgcmV0dXJuIHNpZ24gKiBNYXRoLm1heChNYXRoLm1pbihuZXdBYm9zbHV0ZU9mZnNldCwgd2lkdGhzLmNvbnRlbnQgLSB3aWR0aHMud3JhcHBlciksIDApXG4gICAgfSxcbiAgICBvbkFmZml4Q2xpY2sgKGxvY2F0aW9uOiAncHJldicgfCAnbmV4dCcpIHtcbiAgICAgIHRoaXMuJGVtaXQoYGNsaWNrOiR7bG9jYXRpb259YClcbiAgICAgIHRoaXMuc2Nyb2xsVG8obG9jYXRpb24pXG4gICAgfSxcbiAgICBvblJlc2l6ZSAoKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgaWYgKHRoaXMuX2lzRGVzdHJveWVkKSByZXR1cm5cblxuICAgICAgdGhpcy5zZXRXaWR0aHMoKVxuICAgIH0sXG4gICAgb25Ub3VjaFN0YXJ0IChlOiBUb3VjaEV2ZW50KSB7XG4gICAgICBjb25zdCB7IGNvbnRlbnQgfSA9IHRoaXMuJHJlZnNcblxuICAgICAgdGhpcy5zdGFydFggPSB0aGlzLnNjcm9sbE9mZnNldCArIGUudG91Y2hzdGFydFggYXMgbnVtYmVyXG5cbiAgICAgIGNvbnRlbnQuc3R5bGUuc2V0UHJvcGVydHkoJ3RyYW5zaXRpb24nLCAnbm9uZScpXG4gICAgICBjb250ZW50LnN0eWxlLnNldFByb3BlcnR5KCd3aWxsQ2hhbmdlJywgJ3RyYW5zZm9ybScpXG4gICAgfSxcbiAgICBvblRvdWNoTW92ZSAoZTogVG91Y2hFdmVudCkge1xuICAgICAgaWYgKCF0aGlzLmNhblRvdWNoKSByZXR1cm5cblxuICAgICAgaWYgKCF0aGlzLmlzU3dpcGluZykge1xuICAgICAgICAvLyBvbmx5IGNhbGN1bGF0ZSBkaXNhYmxlU3dpcGVIb3Jpem9udGFsIGR1cmluZyB0aGUgZmlyc3Qgb25Ub3VjaE1vdmUgaW52b2tlXG4gICAgICAgIC8vIGluIG9yZGVyIHRvIGVuc3VyZSBkaXNhYmxlU3dpcGVIb3Jpem9udGFsIHZhbHVlIGlzIGNvbnNpc3RlbnQgYmV0d2VlbiBvblRvdWNoU3RhcnQgYW5kIG9uVG91Y2hFbmRcbiAgICAgICAgY29uc3QgZGlmZlggPSBlLnRvdWNobW92ZVggLSBlLnRvdWNoc3RhcnRYXG4gICAgICAgIGNvbnN0IGRpZmZZID0gZS50b3VjaG1vdmVZIC0gZS50b3VjaHN0YXJ0WVxuICAgICAgICB0aGlzLmlzU3dpcGluZ0hvcml6b250YWwgPSBNYXRoLmFicyhkaWZmWCkgPiBNYXRoLmFicyhkaWZmWSlcbiAgICAgICAgdGhpcy5pc1N3aXBpbmcgPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmlzU3dpcGluZ0hvcml6b250YWwpIHtcbiAgICAgICAgLy8gc2xpZGluZyBob3Jpem9udGFsbHlcbiAgICAgICAgdGhpcy5zY3JvbGxPZmZzZXQgPSB0aGlzLnN0YXJ0WCAtIGUudG91Y2htb3ZlWFxuICAgICAgICAvLyB0ZW1wb3JhcmlseSBkaXNhYmxlIHdpbmRvdyB2ZXJ0aWNhbCBzY3JvbGxpbmdcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLm92ZXJmbG93WSA9ICdoaWRkZW4nXG4gICAgICB9XG4gICAgfSxcbiAgICBvblRvdWNoRW5kICgpIHtcbiAgICAgIGlmICghdGhpcy5jYW5Ub3VjaCkgcmV0dXJuXG5cbiAgICAgIGNvbnN0IHsgY29udGVudCwgd3JhcHBlciB9ID0gdGhpcy4kcmVmc1xuICAgICAgY29uc3QgbWF4U2Nyb2xsT2Zmc2V0ID0gY29udGVudC5jbGllbnRXaWR0aCAtIHdyYXBwZXIuY2xpZW50V2lkdGhcblxuICAgICAgY29udGVudC5zdHlsZS5zZXRQcm9wZXJ0eSgndHJhbnNpdGlvbicsIG51bGwpXG4gICAgICBjb250ZW50LnN0eWxlLnNldFByb3BlcnR5KCd3aWxsQ2hhbmdlJywgbnVsbClcblxuICAgICAgaWYgKHRoaXMuJHZ1ZXRpZnkucnRsKSB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgIGlmICh0aGlzLnNjcm9sbE9mZnNldCA+IDAgfHwgIXRoaXMuaXNPdmVyZmxvd2luZykge1xuICAgICAgICAgIHRoaXMuc2Nyb2xsT2Zmc2V0ID0gMFxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc2Nyb2xsT2Zmc2V0IDw9IC1tYXhTY3JvbGxPZmZzZXQpIHtcbiAgICAgICAgICB0aGlzLnNjcm9sbE9mZnNldCA9IC1tYXhTY3JvbGxPZmZzZXRcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsT2Zmc2V0IDwgMCB8fCAhdGhpcy5pc092ZXJmbG93aW5nKSB7XG4gICAgICAgICAgdGhpcy5zY3JvbGxPZmZzZXQgPSAwXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5zY3JvbGxPZmZzZXQgPj0gbWF4U2Nyb2xsT2Zmc2V0KSB7XG4gICAgICAgICAgdGhpcy5zY3JvbGxPZmZzZXQgPSBtYXhTY3JvbGxPZmZzZXRcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmlzU3dpcGluZyA9IGZhbHNlXG4gICAgICAvLyByb2xsYmFjayB3aG9sZSBwYWdlIHNjcm9sbGluZyB0byBkZWZhdWx0XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ292ZXJmbG93LXknKVxuICAgIH0sXG4gICAgb3ZlcmZsb3dDaGVjayAoZTogVG91Y2hFdmVudCwgZm46IChlOiBUb3VjaEV2ZW50KSA9PiB2b2lkKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICB0aGlzLmlzT3ZlcmZsb3dpbmcgJiYgZm4oZSlcbiAgICB9LFxuICAgIHNjcm9sbEludG9WaWV3IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovICgpIHtcbiAgICAgIGlmICghdGhpcy5zZWxlY3RlZEl0ZW0gJiYgdGhpcy5pdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgbGFzdEl0ZW1Qb3NpdGlvbiA9IHRoaXMuaXRlbXNbdGhpcy5pdGVtcy5sZW5ndGggLSAxXS4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgY29uc3Qgd3JhcHBlclBvc2l0aW9uID0gdGhpcy4kcmVmcy53cmFwcGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICh0aGlzLiR2dWV0aWZ5LnJ0bCAmJiB3cmFwcGVyUG9zaXRpb24ucmlnaHQgPCBsYXN0SXRlbVBvc2l0aW9uLnJpZ2h0KSB8fFxuICAgICAgICAgICghdGhpcy4kdnVldGlmeS5ydGwgJiYgd3JhcHBlclBvc2l0aW9uLmxlZnQgPiBsYXN0SXRlbVBvc2l0aW9uLmxlZnQpXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMuc2Nyb2xsVG8oJ3ByZXYnKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5zZWxlY3RlZEl0ZW0pIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID09PSAwIHx8XG4gICAgICAgICghdGhpcy5jZW50ZXJBY3RpdmUgJiYgIXRoaXMuaXNPdmVyZmxvd2luZylcbiAgICAgICkge1xuICAgICAgICB0aGlzLnNjcm9sbE9mZnNldCA9IDBcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jZW50ZXJBY3RpdmUpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxPZmZzZXQgPSBjYWxjdWxhdGVDZW50ZXJlZE9mZnNldChcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbS4kZWwgYXMgSFRNTEVsZW1lbnQsXG4gICAgICAgICAgdGhpcy53aWR0aHMsXG4gICAgICAgICAgdGhpcy4kdnVldGlmeS5ydGxcbiAgICAgICAgKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzT3ZlcmZsb3dpbmcpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxPZmZzZXQgPSBjYWxjdWxhdGVVcGRhdGVkT2Zmc2V0KFxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtLiRlbCBhcyBIVE1MRWxlbWVudCxcbiAgICAgICAgICB0aGlzLndpZHRocyxcbiAgICAgICAgICB0aGlzLiR2dWV0aWZ5LnJ0bCxcbiAgICAgICAgICB0aGlzLnNjcm9sbE9mZnNldFxuICAgICAgICApXG4gICAgICB9XG4gICAgfSxcbiAgICBzY3JvbGxUbyAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyAobG9jYXRpb246ICdwcmV2JyB8ICduZXh0Jykge1xuICAgICAgdGhpcy5zY3JvbGxPZmZzZXQgPSB0aGlzLmNhbGN1bGF0ZU5ld09mZnNldChsb2NhdGlvbiwge1xuICAgICAgICAvLyBGb3JjZSByZWZsb3dcbiAgICAgICAgY29udGVudDogdGhpcy4kcmVmcy5jb250ZW50ID8gdGhpcy4kcmVmcy5jb250ZW50LmNsaWVudFdpZHRoIDogMCxcbiAgICAgICAgd3JhcHBlcjogdGhpcy4kcmVmcy53cmFwcGVyID8gdGhpcy4kcmVmcy53cmFwcGVyLmNsaWVudFdpZHRoIDogMCxcbiAgICAgIH0sIHRoaXMuJHZ1ZXRpZnkucnRsLCB0aGlzLnNjcm9sbE9mZnNldClcbiAgICB9LFxuICAgIHNldFdpZHRocyAoKSB7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX2lzRGVzdHJveWVkKSByZXR1cm5cblxuICAgICAgICBjb25zdCB7IGNvbnRlbnQsIHdyYXBwZXIgfSA9IHRoaXMuJHJlZnNcblxuICAgICAgICB0aGlzLndpZHRocyA9IHtcbiAgICAgICAgICBjb250ZW50OiBjb250ZW50ID8gY29udGVudC5jbGllbnRXaWR0aCA6IDAsXG4gICAgICAgICAgd3JhcHBlcjogd3JhcHBlciA/IHdyYXBwZXIuY2xpZW50V2lkdGggOiAwLFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Z1ZXRpZnlqcy92dWV0aWZ5L2lzc3Vlcy8xMzIxMlxuICAgICAgICAvLyBXZSBhZGQgKzEgdG8gdGhlIHdyYXBwZXJzIHdpZHRoIHRvIHByZXZlbnQgYW4gaXNzdWUgd2hlcmUgdGhlIGBjbGllbnRXaWR0aGBcbiAgICAgICAgLy8gZ2V0cyBjYWxjdWxhdGVkIHdyb25nbHkgYnkgdGhlIGJyb3dzZXIgaWYgdXNpbmcgYSBkaWZmZXJlbnQgem9vbS1sZXZlbC5cbiAgICAgICAgdGhpcy5pc092ZXJmbG93aW5nID0gdGhpcy53aWR0aHMud3JhcHBlciArIDEgPCB0aGlzLndpZHRocy5jb250ZW50XG5cbiAgICAgICAgdGhpcy5zY3JvbGxJbnRvVmlldygpXG4gICAgICB9KVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgcmV0dXJuIHdpdGhEaXJlY3RpdmVzKGgoJ2RpdicsIHRoaXMuZ2VuRGF0YSgpLCBbXG4gICAgICB0aGlzLmdlblByZXYoKSxcbiAgICAgIHRoaXMuZ2VuV3JhcHBlcigpLFxuICAgICAgdGhpcy5nZW5OZXh0KCksXG4gICAgXSksIFtcbiAgICAgIFtcbiAgICAgICAgUmVzaXplLFxuICAgICAgICB0aGlzLm9uUmVzaXplXG4gICAgICBdXG4gICAgXSlcbiAgfSxcbn0pXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XG4gIG5hbWU6ICd2LXNsaWRlLWdyb3VwJyxcblxuICBleHRlbmRzOiBCYXNlU2xpZGVHcm91cCxcblxuICBwcm92aWRlICgpOiBvYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICBzbGlkZUdyb3VwOiB0aGlzLFxuICAgIH1cbiAgfSxcbn0pXG4iXX0=