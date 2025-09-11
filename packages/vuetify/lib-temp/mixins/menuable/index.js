// Mixins
import Stackable from '../stackable';
import { factory as positionableFactory } from '../positionable';
import Activatable from '../activatable';
import Detachable from '../detachable';
// Utilities
import mixins from '../../util/mixins';
import { convertToUnit } from '../../util/helpers';
const baseMixins = mixins(Stackable, positionableFactory(['top', 'right', 'bottom', 'left', 'absolute']), Activatable, Detachable);
/* @vue/component */
export default baseMixins.extend({
    name: 'menuable',
    props: {
        allowOverflow: Boolean,
        light: Boolean,
        dark: Boolean,
        maxWidth: {
            type: [Number, String],
            default: 'auto',
        },
        minWidth: [Number, String],
        nudgeBottom: {
            type: [Number, String],
            default: 0,
        },
        nudgeLeft: {
            type: [Number, String],
            default: 0,
        },
        nudgeRight: {
            type: [Number, String],
            default: 0,
        },
        nudgeTop: {
            type: [Number, String],
            default: 0,
        },
        nudgeWidth: {
            type: [Number, String],
            default: 0,
        },
        offsetOverflow: Boolean,
        positionX: {
            type: Number,
            default: null,
        },
        positionY: {
            type: Number,
            default: null,
        },
        zIndex: {
            type: [Number, String],
            default: null,
        },
    },
    data: () => ({
        activatorNode: [],
        absoluteX: 0,
        absoluteY: 0,
        activatedBy: null,
        activatorFixed: false,
        dimensions: {
            activator: {
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                width: 0,
                height: 0,
                offsetTop: 0,
                scrollHeight: 0,
                offsetLeft: 0,
            },
            content: {
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                width: 0,
                height: 0,
                offsetTop: 0,
                scrollHeight: 0,
            },
        },
        relativeYOffset: 0,
        hasJustFocused: false,
        hasWindow: false,
        inputActivator: false,
        isContentActive: false,
        pageWidth: 0,
        pageYOffset: 0,
        stackClass: 'v-menu__content--active',
        stackMinZIndex: 6,
    }),
    computed: {
        isMenuable() {
            return true;
        },
        computedLeft() {
            const a = this.dimensions.activator;
            const c = this.dimensions.content;
            const activatorLeft = (this.attach !== false ? a.offsetLeft : a.left) || 0;
            const minWidth = Math.max(a.width, c.width);
            let left = 0;
            left += activatorLeft;
            if (this.left || (this.$vuetify.rtl && !this.right))
                left -= (minWidth - a.width);
            if (this.offsetX) {
                const maxWidth = isNaN(Number(this.maxWidth))
                    ? a.width
                    : Math.min(a.width, Number(this.maxWidth));
                left += this.left ? -maxWidth : a.width;
            }
            if (this.nudgeLeft)
                left -= parseInt(this.nudgeLeft);
            if (this.nudgeRight)
                left += parseInt(this.nudgeRight);
            return left;
        },
        computedTop() {
            const a = this.dimensions.activator;
            const c = this.dimensions.content;
            let top = 0;
            if (this.top)
                top += a.height - c.height;
            if (this.attach !== false)
                top += a.offsetTop;
            else
                top += a.top + this.pageYOffset;
            if (this.offsetY)
                top += this.top ? -a.height : a.height;
            if (this.nudgeTop)
                top -= parseInt(this.nudgeTop);
            if (this.nudgeBottom)
                top += parseInt(this.nudgeBottom);
            return top;
        },
        hasActivator() {
            return !!this.$slots.activator || !!this.$slots.activator || !!this.activator || !!this.inputActivator;
        },
        absoluteYOffset() {
            return this.pageYOffset - this.relativeYOffset;
        },
    },
    watch: {
        disabled(val) {
            val && this.callDeactivate();
        },
        isActive(val) {
            if (this.disabled)
                return;
            val ? this.callActivate() : this.callDeactivate();
        },
        positionX: 'updateDimensions',
        positionY: 'updateDimensions',
    },
    beforeMount() {
        this.hasWindow = typeof window !== 'undefined';
        if (this.hasWindow) {
            window.addEventListener('resize', this.updateDimensions, false);
        }
    },
    beforeUnmount() {
        if (this.hasWindow) {
            window.removeEventListener('resize', this.updateDimensions, false);
        }
    },
    methods: {
        absolutePosition() {
            return {
                offsetTop: this.positionY || this.absoluteY,
                offsetLeft: this.positionX || this.absoluteX,
                scrollHeight: 0,
                top: this.positionY || this.absoluteY,
                bottom: this.positionY || this.absoluteY,
                left: this.positionX || this.absoluteX,
                right: this.positionX || this.absoluteX,
                height: 0,
                width: 0,
            };
        },
        activate() { },
        calcLeft(menuWidth) {
            return convertToUnit(this.attach !== false
                ? this.computedLeft
                : this.calcXOverflow(this.computedLeft, menuWidth));
        },
        calcTop() {
            return convertToUnit(this.attach !== false
                ? this.computedTop
                : this.calcYOverflow(this.computedTop));
        },
        calcXOverflow(left, menuWidth) {
            const xOverflow = left + menuWidth - this.pageWidth + 12;
            if ((!this.left || this.right) && xOverflow > 0) {
                left = Math.max(left - xOverflow, 0);
            }
            else {
                left = Math.max(left, 12);
            }
            return left + this.getOffsetLeft();
        },
        calcYOverflow(top) {
            const documentHeight = this.getInnerHeight();
            const toTop = this.absoluteYOffset + documentHeight;
            const activator = this.dimensions.activator;
            const contentHeight = this.dimensions.content.height;
            const totalHeight = top + contentHeight;
            const isOverflowing = toTop < totalHeight;
            // If overflowing bottom and offset
            // TODO: set 'bottom' position instead of 'top'
            if (isOverflowing &&
                this.offsetOverflow &&
                // If we don't have enough room to offset
                // the overflow, don't offset
                activator.top > contentHeight) {
                top = this.pageYOffset + (activator.top - contentHeight);
                // If overflowing bottom
            }
            else if (isOverflowing && !this.allowOverflow) {
                top = toTop - contentHeight - 12;
                // If overflowing top
            }
            else if (top < this.absoluteYOffset && !this.allowOverflow) {
                top = this.absoluteYOffset + 12;
            }
            return top < 12 ? 12 : top;
        },
        callActivate() {
            if (!this.hasWindow)
                return;
            this.activate();
        },
        callDeactivate() {
            this.isContentActive = false;
            this.deactivate();
        },
        checkForPageYOffset() {
            if (this.hasWindow) {
                this.pageYOffset = this.activatorFixed ? 0 : this.getOffsetTop();
            }
        },
        checkActivatorFixed() {
            if (this.attach !== false) {
                this.activatorFixed = false;
                return;
            }
            let el = this.getActivator();
            while (el) {
                if (window.getComputedStyle(el).position === 'fixed') {
                    this.activatorFixed = true;
                    return;
                }
                el = el.offsetParent;
            }
            this.activatorFixed = false;
        },
        deactivate() { },
        genActivatorListeners() {
            const listeners = Activatable.methods.genActivatorListeners.call(this);
            const onClick = listeners.onClick;
            if (onClick) {
                listeners.onClick = (e) => {
                    if (this.openOnClick) {
                        onClick && onClick(e);
                    }
                    this.absoluteX = e.clientX;
                    this.absoluteY = e.clientY;
                };
            }
            return listeners;
        },
        getInnerHeight() {
            if (!this.hasWindow)
                return 0;
            return window.innerHeight ||
                document.documentElement.clientHeight;
        },
        getOffsetLeft() {
            if (!this.hasWindow)
                return 0;
            return window.pageXOffset ||
                document.documentElement.scrollLeft;
        },
        getOffsetTop() {
            if (!this.hasWindow)
                return 0;
            return window.pageYOffset ||
                document.documentElement.scrollTop;
        },
        getRoundedBoundedClientRect(el) {
            const rect = el.getBoundingClientRect();
            return {
                top: Math.round(rect.top),
                left: Math.round(rect.left),
                bottom: Math.round(rect.bottom),
                right: Math.round(rect.right),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
            };
        },
        measure(el) {
            if (!el || !this.hasWindow)
                return null;
            const rect = this.getRoundedBoundedClientRect(el);
            // Account for activator margin
            if (this.attach !== false) {
                const style = window.getComputedStyle(el);
                rect.left = parseInt(style.marginLeft);
                rect.top = parseInt(style.marginTop);
            }
            return rect;
        },
        sneakPeek(cb) {
            requestAnimationFrame(() => {
                const el = this.$refs.content;
                if (!el || el.style.display !== 'none') {
                    cb();
                    return;
                }
                el.style.display = 'inline-block';
                cb();
                el.style.display = 'none';
            });
        },
        startTransition() {
            return new Promise(resolve => requestAnimationFrame(() => {
                this.isContentActive = this.hasJustFocused = this.isActive;
                resolve();
            }));
        },
        updateDimensions() {
            this.hasWindow = typeof window !== 'undefined';
            this.checkActivatorFixed();
            this.checkForPageYOffset();
            this.pageWidth = document.documentElement.clientWidth;
            const dimensions = {
                activator: { ...this.dimensions.activator },
                content: { ...this.dimensions.content },
            };
            // Activator should already be shown
            if (!this.hasActivator || this.absolute) {
                dimensions.activator = this.absolutePosition();
            }
            else {
                const activator = this.getActivator();
                if (!activator)
                    return;
                dimensions.activator = this.measure(activator);
                dimensions.activator.offsetLeft = activator.offsetLeft;
                if (this.attach !== false) {
                    // account for css padding causing things to not line up
                    // this is mostly for v-autocomplete, hopefully it won't break anything
                    dimensions.activator.offsetTop = activator.offsetTop;
                }
                else {
                    dimensions.activator.offsetTop = 0;
                }
            }
            // Display and hide to get dimensions
            this.sneakPeek(() => {
                if (this.$refs.content) {
                    if (this.$refs.content.offsetParent) {
                        const offsetRect = this.getRoundedBoundedClientRect(this.$refs.content.offsetParent);
                        this.relativeYOffset = window.pageYOffset + offsetRect.top;
                        dimensions.activator.top -= this.relativeYOffset;
                        dimensions.activator.left -= window.pageXOffset + offsetRect.left;
                    }
                    dimensions.content = this.measure(this.$refs.content);
                }
                this.dimensions = dimensions;
            });
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL21lbnVhYmxlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSxjQUFjLENBQUE7QUFDcEMsT0FBTyxFQUFFLE9BQU8sSUFBSSxtQkFBbUIsRUFBRSxNQUFNLGlCQUFpQixDQUFBO0FBQ2hFLE9BQU8sV0FBVyxNQUFNLGdCQUFnQixDQUFBO0FBQ3hDLE9BQU8sVUFBVSxNQUFNLGVBQWUsQ0FBQTtBQUV0QyxZQUFZO0FBQ1osT0FBTyxNQUFzQixNQUFNLG1CQUFtQixDQUFBO0FBQ3RELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUtsRCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQ3ZCLFNBQVMsRUFDVCxtQkFBbUIsQ0FBQyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUNuRSxXQUFXLEVBQ1gsVUFBVSxDQUNYLENBQUE7QUE0QkQsb0JBQW9CO0FBQ3BCLGVBQWUsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUMvQixJQUFJLEVBQUUsVUFBVTtJQUVoQixLQUFLLEVBQUU7UUFDTCxhQUFhLEVBQUUsT0FBTztRQUN0QixLQUFLLEVBQUUsT0FBTztRQUNkLElBQUksRUFBRSxPQUFPO1FBQ2IsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsTUFBTTtTQUNoQjtRQUNELFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7UUFDMUIsV0FBVyxFQUFFO1lBQ1gsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBQ0QsU0FBUyxFQUFFO1lBQ1QsSUFBSSxFQUFFLENBQUMsTUFBTSxF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LENBQUMsWUFBWSxFQUFFO3dCQUNuQyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7d0JBRXBGLElBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFBO3dCQUMxRCxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFBO3dCQUNoRCxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUE7cUJBQ2xFO29CQUVELFVBQVUsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO2lCQUN0RDtnQkFFRCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtZQUM5QixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIE1peGluc1xuaW1wb3J0IFN0YWNrYWJsZSBmcm9tICcuLi9zdGFja2FibGUnXG5pbXBvcnQgeyBmYWN0b3J5IGFzIHBvc2l0aW9uYWJsZUZhY3RvcnkgfSBmcm9tICcuLi9wb3NpdGlvbmFibGUnXG5pbXBvcnQgQWN0aXZhdGFibGUgZnJvbSAnLi4vYWN0aXZhdGFibGUnXG5pbXBvcnQgRGV0YWNoYWJsZSBmcm9tICcuLi9kZXRhY2hhYmxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCBtaXhpbnMsIHsgRXh0cmFjdFZ1ZSB9IGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuaW1wb3J0IHsgY29udmVydFRvVW5pdCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcblxuLy8gVHlwZXNcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBiYXNlTWl4aW5zID0gbWl4aW5zKFxuICBTdGFja2FibGUsXG4gIHBvc2l0aW9uYWJsZUZhY3RvcnkoWyd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnLCAnYWJzb2x1dGUnXSksXG4gIEFjdGl2YXRhYmxlLFxuICBEZXRhY2hhYmxlLFxuKVxuXG5pbnRlcmZhY2UgZGltZW5zaW9ucyB7XG4gIHRvcDogbnVtYmVyXG4gIGxlZnQ6IG51bWJlclxuICBib3R0b206IG51bWJlclxuICByaWdodDogbnVtYmVyXG4gIHdpZHRoOiBudW1iZXJcbiAgaGVpZ2h0OiBudW1iZXJcbiAgb2Zmc2V0VG9wOiBudW1iZXJcbiAgc2Nyb2xsSGVpZ2h0OiBudW1iZXJcbiAgb2Zmc2V0TGVmdDogbnVtYmVyXG59XG5cbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgRXh0cmFjdFZ1ZTx0eXBlb2YgYmFzZU1peGlucz4ge1xuICBhdHRhY2g6IGJvb2xlYW4gfCBzdHJpbmcgfCBFbGVtZW50XG4gIG9mZnNldFk6IGJvb2xlYW5cbiAgb2Zmc2V0WDogYm9vbGVhblxuICBkaW1lbnNpb25zOiB7XG4gICAgYWN0aXZhdG9yOiBkaW1lbnNpb25zXG4gICAgY29udGVudDogZGltZW5zaW9uc1xuICB9XG4gICRyZWZzOiB7XG4gICAgY29udGVudDogSFRNTEVsZW1lbnRcbiAgICBhY3RpdmF0b3I6IEhUTUxFbGVtZW50XG4gIH1cbn1cblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGJhc2VNaXhpbnMuZXh0ZW5kKHtcbiAgbmFtZTogJ21lbnVhYmxlJyxcblxuICBwcm9wczoge1xuICAgIGFsbG93T3ZlcmZsb3c6IEJvb2xlYW4sXG4gICAgbGlnaHQ6IEJvb2xlYW4sXG4gICAgZGFyazogQm9vbGVhbixcbiAgICBtYXhXaWR0aDoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6ICdhdXRvJyxcbiAgICB9LFxuICAgIG1pbldpZHRoOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgIG51ZGdlQm90dG9tOiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIG51ZGdlTGVmdDoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBudWRnZVJpZ2h0OiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIG51ZGdlVG9wOiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIG51ZGdlV2lkdGg6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgb2Zmc2V0T3ZlcmZsb3c6IEJvb2xlYW4sXG4gICAgcG9zaXRpb25YOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiBudWxsLFxuICAgIH0sXG4gICAgcG9zaXRpb25ZOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiBudWxsLFxuICAgIH0sXG4gICAgekluZGV4OiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICB9LFxuICB9LFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgYWN0aXZhdG9yTm9kZTogW10gYXMgVk5vZGVbXSxcbiAgICBhYnNvbHV0ZVg6IDAsXG4gICAgYWJzb2x1dGVZOiAwLFxuICAgIGFjdGl2YXRlZEJ5OiBudWxsIGFzIEV2ZW50VGFyZ2V0IHwgbnVsbCxcbiAgICBhY3RpdmF0b3JGaXhlZDogZmFsc2UsXG4gICAgZGltZW5zaW9uczoge1xuICAgICAgYWN0aXZhdG9yOiB7XG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICByaWdodDogMCxcbiAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgb2Zmc2V0VG9wOiAwLFxuICAgICAgICBzY3JvbGxIZWlnaHQ6IDAsXG4gICAgICAgIG9mZnNldExlZnQ6IDAsXG4gICAgICB9LFxuICAgICAgY29udGVudDoge1xuICAgICAgICB0b3A6IDAsXG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgIHdpZHRoOiAwLFxuICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgIG9mZnNldFRvcDogMCxcbiAgICAgICAgc2Nyb2xsSGVpZ2h0OiAwLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHJlbGF0aXZlWU9mZnNldDogMCxcbiAgICBoYXNKdXN0Rm9jdXNlZDogZmFsc2UsXG4gICAgaGFzV2luZG93OiBmYWxzZSxcbiAgICBpbnB1dEFjdGl2YXRvcjogZmFsc2UsXG4gICAgaXNDb250ZW50QWN0aXZlOiBmYWxzZSxcbiAgICBwYWdlV2lkdGg6IDAsXG4gICAgcGFnZVlPZmZzZXQ6IDAsXG4gICAgc3RhY2tDbGFzczogJ3YtbWVudV9fY29udGVudC0tYWN0aXZlJyxcbiAgICBzdGFja01pblpJbmRleDogNixcbiAgfSksXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBpc01lbnVhYmxlKCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9LFxuICAgIGNvbXB1dGVkTGVmdCAoKSB7XG4gICAgICBjb25zdCBhID0gdGhpcy5kaW1lbnNpb25zLmFjdGl2YXRvclxuICAgICAgY29uc3QgYyA9IHRoaXMuZGltZW5zaW9ucy5jb250ZW50XG4gICAgICBjb25zdCBhY3RpdmF0b3JMZWZ0ID0gKHRoaXMuYXR0YWNoICE9PSBmYWxzZSA/IGEub2Zmc2V0TGVmdCA6IGEubGVmdCkgfHwgMFxuICAgICAgY29uc3QgbWluV2lkdGggPSBNYXRoLm1heChhLndpZHRoLCBjLndpZHRoKVxuICAgICAgbGV0IGxlZnQgPSAwXG4gICAgICBsZWZ0ICs9IGFjdGl2YXRvckxlZnRcbiAgICAgIGlmICh0aGlzLmxlZnQgfHwgKHRoaXMuJHZ1ZXRpZnkucnRsICYmICF0aGlzLnJpZ2h0KSkgbGVmdCAtPSAobWluV2lkdGggLSBhLndpZHRoKVxuICAgICAgaWYgKHRoaXMub2Zmc2V0WCkge1xuICAgICAgICBjb25zdCBtYXhXaWR0aCA9IGlzTmFOKE51bWJlcih0aGlzLm1heFdpZHRoKSlcbiAgICAgICAgICA/IGEud2lkdGhcbiAgICAgICAgICA6IE1hdGgubWluKGEud2lkdGgsIE51bWJlcih0aGlzLm1heFdpZHRoKSlcblxuICAgICAgICBsZWZ0ICs9IHRoaXMubGVmdCA/IC1tYXhXaWR0aCA6IGEud2lkdGhcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm51ZGdlTGVmdCkgbGVmdCAtPSBwYXJzZUludCh0aGlzLm51ZGdlTGVmdClcbiAgICAgIGlmICh0aGlzLm51ZGdlUmlnaHQpIGxlZnQgKz0gcGFyc2VJbnQodGhpcy5udWRnZVJpZ2h0KVxuXG4gICAgICByZXR1cm4gbGVmdFxuICAgIH0sXG4gICAgY29tcHV0ZWRUb3AgKCkge1xuICAgICAgY29uc3QgYSA9IHRoaXMuZGltZW5zaW9ucy5hY3RpdmF0b3JcbiAgICAgIGNvbnN0IGMgPSB0aGlzLmRpbWVuc2lvbnMuY29udGVudFxuICAgICAgbGV0IHRvcCA9IDBcblxuICAgICAgaWYgKHRoaXMudG9wKSB0b3AgKz0gYS5oZWlnaHQgLSBjLmhlaWdodFxuICAgICAgaWYgKHRoaXMuYXR0YWNoICE9PSBmYWxzZSkgdG9wICs9IGEub2Zmc2V0VG9wXG4gICAgICBlbHNlIHRvcCArPSBhLnRvcCArIHRoaXMucGFnZVlPZmZzZXRcbiAgICAgIGlmICh0aGlzLm9mZnNldFkpIHRvcCArPSB0aGlzLnRvcCA/IC1hLmhlaWdodCA6IGEuaGVpZ2h0XG4gICAgICBpZiAodGhpcy5udWRnZVRvcCkgdG9wIC09IHBhcnNlSW50KHRoaXMubnVkZ2VUb3ApXG4gICAgICBpZiAodGhpcy5udWRnZUJvdHRvbSkgdG9wICs9IHBhcnNlSW50KHRoaXMubnVkZ2VCb3R0b20pXG5cbiAgICAgIHJldHVybiB0b3BcbiAgICB9LFxuICAgIGhhc0FjdGl2YXRvciAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gISF0aGlzLiRzbG90cy5hY3RpdmF0b3IgfHwgISF0aGlzLiRzbG90cy5hY3RpdmF0b3IgfHwgISF0aGlzLmFjdGl2YXRvciB8fCAhIXRoaXMuaW5wdXRBY3RpdmF0b3JcbiAgICB9LFxuICAgIGFic29sdXRlWU9mZnNldCAoKTogbnVtYmVyIHtcbiAgICAgIHJldHVybiB0aGlzLnBhZ2VZT2Zmc2V0IC0gdGhpcy5yZWxhdGl2ZVlPZmZzZXRcbiAgICB9LFxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgZGlzYWJsZWQgKHZhbCkge1xuICAgICAgdmFsICYmIHRoaXMuY2FsbERlYWN0aXZhdGUoKVxuICAgIH0sXG4gICAgaXNBY3RpdmUgKHZhbCkge1xuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVyblxuXG4gICAgICB2YWwgPyB0aGlzLmNhbGxBY3RpdmF0ZSgpIDogdGhpcy5jYWxsRGVhY3RpdmF0ZSgpXG4gICAgfSxcbiAgICBwb3NpdGlvblg6ICd1cGRhdGVEaW1lbnNpb25zJyxcbiAgICBwb3NpdGlvblk6ICd1cGRhdGVEaW1lbnNpb25zJyxcbiAgfSxcblxuICBiZWZvcmVNb3VudCAoKSB7XG4gICAgdGhpcy5oYXNXaW5kb3cgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuXG4gICAgaWYgKHRoaXMuaGFzV2luZG93KSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy51cGRhdGVEaW1lbnNpb25zLCBmYWxzZSlcbiAgICB9XG4gIH0sXG5cbiAgYmVmb3JlVW5tb3VudCAoKSB7XG4gICAgaWYgKHRoaXMuaGFzV2luZG93KSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy51cGRhdGVEaW1lbnNpb25zLCBmYWxzZSlcbiAgICB9XG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGFic29sdXRlUG9zaXRpb24gKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgb2Zmc2V0VG9wOiB0aGlzLnBvc2l0aW9uWSB8fCB0aGlzLmFic29sdXRlWSxcbiAgICAgICAgb2Zmc2V0TGVmdDogdGhpcy5wb3NpdGlvblggfHwgdGhpcy5hYnNvbHV0ZVgsXG4gICAgICAgIHNjcm9sbEhlaWdodDogMCxcbiAgICAgICAgdG9wOiB0aGlzLnBvc2l0aW9uWSB8fCB0aGlzLmFic29sdXRlWSxcbiAgICAgICAgYm90dG9tOiB0aGlzLnBvc2l0aW9uWSB8fCB0aGlzLmFic29sdXRlWSxcbiAgICAgICAgbGVmdDogdGhpcy5wb3NpdGlvblggfHwgdGhpcy5hYnNvbHV0ZVgsXG4gICAgICAgIHJpZ2h0OiB0aGlzLnBvc2l0aW9uWCB8fCB0aGlzLmFic29sdXRlWCxcbiAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICB3aWR0aDogMCxcbiAgICAgIH1cbiAgICB9LFxuICAgIGFjdGl2YXRlICgpIHt9LFxuICAgIGNhbGNMZWZ0IChtZW51V2lkdGg6IG51bWJlcikge1xuICAgICAgcmV0dXJuIGNvbnZlcnRUb1VuaXQodGhpcy5hdHRhY2ggIT09IGZhbHNlXG4gICAgICAgID8gdGhpcy5jb21wdXRlZExlZnRcbiAgICAgICAgOiB0aGlzLmNhbGNYT3ZlcmZsb3codGhpcy5jb21wdXRlZExlZnQsIG1lbnVXaWR0aCkpXG4gICAgfSxcbiAgICBjYWxjVG9wICgpIHtcbiAgICAgIHJldHVybiBjb252ZXJ0VG9Vbml0KHRoaXMuYXR0YWNoICE9PSBmYWxzZVxuICAgICAgICA/IHRoaXMuY29tcHV0ZWRUb3BcbiAgICAgICAgOiB0aGlzLmNhbGNZT3ZlcmZsb3codGhpcy5jb21wdXRlZFRvcCkpXG4gICAgfSxcbiAgICBjYWxjWE92ZXJmbG93IChsZWZ0OiBudW1iZXIsIG1lbnVXaWR0aDogbnVtYmVyKSB7XG4gICAgICBjb25zdCB4T3ZlcmZsb3cgPSBsZWZ0ICsgbWVudVdpZHRoIC0gdGhpcy5wYWdlV2lkdGggKyAxMlxuXG4gICAgICBpZiAoKCF0aGlzLmxlZnQgfHwgdGhpcy5yaWdodCkgJiYgeE92ZXJmbG93ID4gMCkge1xuICAgICAgICBsZWZ0ID0gTWF0aC5tYXgobGVmdCAtIHhPdmVyZmxvdywgMClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnQgPSBNYXRoLm1heChsZWZ0LCAxMilcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGxlZnQgKyB0aGlzLmdldE9mZnNldExlZnQoKVxuICAgIH0sXG4gICAgY2FsY1lPdmVyZmxvdyAodG9wOiBudW1iZXIpIHtcbiAgICAgIGNvbnN0IGRvY3VtZW50SGVpZ2h0ID0gdGhpcy5nZXRJbm5lckhlaWdodCgpXG4gICAgICBjb25zdCB0b1RvcCA9IHRoaXMuYWJzb2x1dGVZT2Zmc2V0ICsgZG9jdW1lbnRIZWlnaHRcbiAgICAgIGNvbnN0IGFjdGl2YXRvciA9IHRoaXMuZGltZW5zaW9ucy5hY3RpdmF0b3JcbiAgICAgIGNvbnN0IGNvbnRlbnRIZWlnaHQgPSB0aGlzLmRpbWVuc2lvbnMuY29udGVudC5oZWlnaHRcbiAgICAgIGNvbnN0IHRvdGFsSGVpZ2h0ID0gdG9wICsgY29udGVudEhlaWdodFxuICAgICAgY29uc3QgaXNPdmVyZmxvd2luZyA9IHRvVG9wIDwgdG90YWxIZWlnaHRcblxuICAgICAgLy8gSWYgb3ZlcmZsb3dpbmcgYm90dG9tIGFuZCBvZmZzZXRcbiAgICAgIC8vIFRPRE86IHNldCAnYm90dG9tJyBwb3NpdGlvbiBpbnN0ZWFkIG9mICd0b3AnXG4gICAgICBpZiAoaXNPdmVyZmxvd2luZyAmJlxuICAgICAgICB0aGlzLm9mZnNldE92ZXJmbG93ICYmXG4gICAgICAgIC8vIElmIHdlIGRvbid0IGhhdmUgZW5vdWdoIHJvb20gdG8gb2Zmc2V0XG4gICAgICAgIC8vIHRoZSBvdmVyZmxvdywgZG9uJ3Qgb2Zmc2V0XG4gICAgICAgIGFjdGl2YXRvci50b3AgPiBjb250ZW50SGVpZ2h0XG4gICAgICApIHtcbiAgICAgICAgdG9wID0gdGhpcy5wYWdlWU9mZnNldCArIChhY3RpdmF0b3IudG9wIC0gY29udGVudEhlaWdodClcbiAgICAgIC8vIElmIG92ZXJmbG93aW5nIGJvdHRvbVxuICAgICAgfSBlbHNlIGlmIChpc092ZXJmbG93aW5nICYmICF0aGlzLmFsbG93T3ZlcmZsb3cpIHtcbiAgICAgICAgdG9wID0gdG9Ub3AgLSBjb250ZW50SGVpZ2h0IC0gMTJcbiAgICAgIC8vIElmIG92ZXJmbG93aW5nIHRvcFxuICAgICAgfSBlbHNlIGlmICh0b3AgPCB0aGlzLmFic29sdXRlWU9mZnNldCAmJiAhdGhpcy5hbGxvd092ZXJmbG93KSB7XG4gICAgICAgIHRvcCA9IHRoaXMuYWJzb2x1dGVZT2Zmc2V0ICsgMTJcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRvcCA8IDEyID8gMTIgOiB0b3BcbiAgICB9LFxuICAgIGNhbGxBY3RpdmF0ZSAoKSB7XG4gICAgICBpZiAoIXRoaXMuaGFzV2luZG93KSByZXR1cm5cblxuICAgICAgdGhpcy5hY3RpdmF0ZSgpXG4gICAgfSxcbiAgICBjYWxsRGVhY3RpdmF0ZSAoKSB7XG4gICAgICB0aGlzLmlzQ29udGVudEFjdGl2ZSA9IGZhbHNlXG5cbiAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpXG4gICAgfSxcbiAgICBjaGVja0ZvclBhZ2VZT2Zmc2V0ICgpIHtcbiAgICAgIGlmICh0aGlzLmhhc1dpbmRvdykge1xuICAgICAgICB0aGlzLnBhZ2VZT2Zmc2V0ID0gdGhpcy5hY3RpdmF0b3JGaXhlZCA/IDAgOiB0aGlzLmdldE9mZnNldFRvcCgpXG4gICAgICB9XG4gICAgfSxcbiAgICBjaGVja0FjdGl2YXRvckZpeGVkICgpIHtcbiAgICAgIGlmICh0aGlzLmF0dGFjaCAhPT0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5hY3RpdmF0b3JGaXhlZCA9IGZhbHNlXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgbGV0IGVsID0gdGhpcy5nZXRBY3RpdmF0b3IoKVxuICAgICAgd2hpbGUgKGVsKSB7XG4gICAgICAgIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkucG9zaXRpb24gPT09ICdmaXhlZCcpIHtcbiAgICAgICAgICB0aGlzLmFjdGl2YXRvckZpeGVkID0gdHJ1ZVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGVsID0gZWwub2Zmc2V0UGFyZW50IGFzIEhUTUxFbGVtZW50XG4gICAgICB9XG4gICAgICB0aGlzLmFjdGl2YXRvckZpeGVkID0gZmFsc2VcbiAgICB9LFxuICAgIGRlYWN0aXZhdGUgKCkge30sXG4gICAgZ2VuQWN0aXZhdG9yTGlzdGVuZXJzICgpIHtcbiAgICAgIGNvbnN0IGxpc3RlbmVycyA9IEFjdGl2YXRhYmxlLm1ldGhvZHMuZ2VuQWN0aXZhdG9yTGlzdGVuZXJzLmNhbGwodGhpcylcblxuICAgICAgY29uc3Qgb25DbGljayA9IGxpc3RlbmVycy5vbkNsaWNrXG5cbiAgICAgIGlmIChvbkNsaWNrKSB7XG4gICAgICAgIGxpc3RlbmVycy5vbkNsaWNrID0gKGU6IE1vdXNlRXZlbnQgJiBLZXlib2FyZEV2ZW50ICYgRm9jdXNFdmVudCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLm9wZW5PbkNsaWNrKSB7XG4gICAgICAgICAgICBvbkNsaWNrICYmIG9uQ2xpY2soZSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmFic29sdXRlWCA9IGUuY2xpZW50WFxuICAgICAgICAgIHRoaXMuYWJzb2x1dGVZID0gZS5jbGllbnRZXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGxpc3RlbmVyc1xuICAgIH0sXG4gICAgZ2V0SW5uZXJIZWlnaHQgKCkge1xuICAgICAgaWYgKCF0aGlzLmhhc1dpbmRvdykgcmV0dXJuIDBcblxuICAgICAgcmV0dXJuIHdpbmRvdy5pbm5lckhlaWdodCB8fFxuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG4gICAgfSxcbiAgICBnZXRPZmZzZXRMZWZ0ICgpIHtcbiAgICAgIGlmICghdGhpcy5oYXNXaW5kb3cpIHJldHVybiAwXG5cbiAgICAgIHJldHVybiB3aW5kb3cucGFnZVhPZmZzZXQgfHxcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnRcbiAgICB9LFxuICAgIGdldE9mZnNldFRvcCAoKSB7XG4gICAgICBpZiAoIXRoaXMuaGFzV2luZG93KSByZXR1cm4gMFxuXG4gICAgICByZXR1cm4gd2luZG93LnBhZ2VZT2Zmc2V0IHx8XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3BcbiAgICB9LFxuICAgIGdldFJvdW5kZWRCb3VuZGVkQ2xpZW50UmVjdCAoZWw6IEVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdG9wOiBNYXRoLnJvdW5kKHJlY3QudG9wKSxcbiAgICAgICAgbGVmdDogTWF0aC5yb3VuZChyZWN0LmxlZnQpLFxuICAgICAgICBib3R0b206IE1hdGgucm91bmQocmVjdC5ib3R0b20pLFxuICAgICAgICByaWdodDogTWF0aC5yb3VuZChyZWN0LnJpZ2h0KSxcbiAgICAgICAgd2lkdGg6IE1hdGgucm91bmQocmVjdC53aWR0aCksXG4gICAgICAgIGhlaWdodDogTWF0aC5yb3VuZChyZWN0LmhlaWdodCksXG4gICAgICB9XG4gICAgfSxcbiAgICBtZWFzdXJlIChlbDogSFRNTEVsZW1lbnQpIHtcbiAgICAgIGlmICghZWwgfHwgIXRoaXMuaGFzV2luZG93KSByZXR1cm4gbnVsbFxuXG4gICAgICBjb25zdCByZWN0ID0gdGhpcy5nZXRSb3VuZGVkQm91bmRlZENsaWVudFJlY3QoZWwpXG5cbiAgICAgIC8vIEFjY291bnQgZm9yIGFjdGl2YXRvciBtYXJnaW5cbiAgICAgIGlmICh0aGlzLmF0dGFjaCAhPT0gZmFsc2UpIHtcbiAgICAgICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbClcblxuICAgICAgICByZWN0LmxlZnQgPSBwYXJzZUludChzdHlsZS5tYXJnaW5MZWZ0ISlcbiAgICAgICAgcmVjdC50b3AgPSBwYXJzZUludChzdHlsZS5tYXJnaW5Ub3AhKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVjdFxuICAgIH0sXG4gICAgc25lYWtQZWVrIChjYjogKCkgPT4gdm9pZCkge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgY29uc3QgZWwgPSB0aGlzLiRyZWZzLmNvbnRlbnRcblxuICAgICAgICBpZiAoIWVsIHx8IGVsLnN0eWxlLmRpc3BsYXkgIT09ICdub25lJykge1xuICAgICAgICAgIGNiKClcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJ1xuICAgICAgICBjYigpXG4gICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgIH0pXG4gICAgfSxcbiAgICBzdGFydFRyYW5zaXRpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KHJlc29sdmUgPT4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgdGhpcy5pc0NvbnRlbnRBY3RpdmUgPSB0aGlzLmhhc0p1c3RGb2N1c2VkID0gdGhpcy5pc0FjdGl2ZVxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH0pKVxuICAgIH0sXG4gICAgdXBkYXRlRGltZW5zaW9ucyAoKSB7XG4gICAgICB0aGlzLmhhc1dpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgICB0aGlzLmNoZWNrQWN0aXZhdG9yRml4ZWQoKVxuICAgICAgdGhpcy5jaGVja0ZvclBhZ2VZT2Zmc2V0KClcbiAgICAgIHRoaXMucGFnZVdpZHRoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoXG5cbiAgICAgIGNvbnN0IGRpbWVuc2lvbnM6IGFueSA9IHtcbiAgICAgICAgYWN0aXZhdG9yOiB7IC4uLnRoaXMuZGltZW5zaW9ucy5hY3RpdmF0b3IgfSxcbiAgICAgICAgY29udGVudDogeyAuLi50aGlzLmRpbWVuc2lvbnMuY29udGVudCB9LFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RpdmF0b3Igc2hvdWxkIGFscmVhZHkgYmUgc2hvd25cbiAgICAgIGlmICghdGhpcy5oYXNBY3RpdmF0b3IgfHwgdGhpcy5hYnNvbHV0ZSkge1xuICAgICAgICBkaW1lbnNpb25zLmFjdGl2YXRvciA9IHRoaXMuYWJzb2x1dGVQb3NpdGlvbigpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBhY3RpdmF0b3IgPSB0aGlzLmdldEFjdGl2YXRvcigpXG4gICAgICAgIGlmICghYWN0aXZhdG9yKSByZXR1cm5cblxuICAgICAgICBkaW1lbnNpb25zLmFjdGl2YXRvciA9IHRoaXMubWVhc3VyZShhY3RpdmF0b3IpXG4gICAgICAgIGRpbWVuc2lvbnMuYWN0aXZhdG9yLm9mZnNldExlZnQgPSBhY3RpdmF0b3Iub2Zmc2V0TGVmdFxuICAgICAgICBpZiAodGhpcy5hdHRhY2ggIT09IGZhbHNlKSB7XG4gICAgICAgICAgLy8gYWNjb3VudCBmb3IgY3NzIHBhZGRpbmcgY2F1c2luZyB0aGluZ3MgdG8gbm90IGxpbmUgdXBcbiAgICAgICAgICAvLyB0aGlzIGlzIG1vc3RseSBmb3Igdi1hdXRvY29tcGxldGUsIGhvcGVmdWxseSBpdCB3b24ndCBicmVhayBhbnl0aGluZ1xuICAgICAgICAgIGRpbWVuc2lvbnMuYWN0aXZhdG9yLm9mZnNldFRvcCA9IGFjdGl2YXRvci5vZmZzZXRUb3BcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkaW1lbnNpb25zLmFjdGl2YXRvci5vZmZzZXRUb3AgPSAwXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gRGlzcGxheSBhbmQgaGlkZSB0byBnZXQgZGltZW5zaW9uc1xuICAgICAgdGhpcy5zbmVha1BlZWsoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy4kcmVmcy5jb250ZW50KSB7XG4gICAgICAgICAgaWYgKHRoaXMuJHJlZnMuY29udGVudC5vZmZzZXRQYXJlbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldFJlY3QgPSB0aGlzLmdldFJvdW5kZWRCb3VuZGVkQ2xpZW50UmVjdCh0aGlzLiRyZWZzLmNvbnRlbnQub2Zmc2V0UGFyZW50KVxuXG4gICAgICAgICAgICB0aGlzLnJlbGF0aXZlWU9mZnNldCA9IHdpbmRvdy5wYWdlWU9mZnNldCArIG9mZnNldFJlY3QudG9wXG4gICAgICAgICAgICBkaW1lbnNpb25zLmFjdGl2YXRvci50b3AgLT0gdGhpcy5yZWxhdGl2ZVlPZmZzZXRcbiAgICAgICAgICAgIGRpbWVuc2lvbnMuYWN0aXZhdG9yLmxlZnQgLT0gd2luZG93LnBhZ2VYT2Zmc2V0ICsgb2Zmc2V0UmVjdC5sZWZ0XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGltZW5zaW9ucy5jb250ZW50ID0gdGhpcy5tZWFzdXJlKHRoaXMuJHJlZnMuY29udGVudClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGltZW5zaW9ucyA9IGRpbWVuc2lvbnNcbiAgICAgIH0pXG4gICAgfSxcbiAgfSxcbn0pXG4iXX0=