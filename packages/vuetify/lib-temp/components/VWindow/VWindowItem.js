import { h, vShow, withDirectives } from 'vue';
// Mixins
import Bootable from '../../mixins/bootable';
import { factory as GroupableFactory } from '../../mixins/groupable';
// Utilities
import { convertToUnit, getSlot } from '../../util/helpers';
import mixins from '../../util/mixins';
// Types
import { Transition } from 'vue';
const baseMixins = mixins(Bootable, GroupableFactory('windowGroup', 'v-window-item', 'v-window'));
export default baseMixins.extend({
    name: 'v-window-item',
    emits: ['change'],
    props: {
        disabled: Boolean,
        reverseTransition: {
            type: [Boolean, String],
            default: undefined,
        },
        transition: {
            type: [Boolean, String],
            default: undefined,
        },
        value: {
            required: false,
        },
    },
    data() {
        return {
            isActive: false,
            inTransition: false,
        };
    },
    computed: {
        classes() {
            return this.groupClasses;
        },
        computedTransition() {
            if (!this.windowGroup.internalReverse) {
                return typeof this.transition !== 'undefined'
                    ? this.transition || ''
                    : this.windowGroup.computedTransition;
            }
            return typeof this.reverseTransition !== 'undefined'
                ? this.reverseTransition || ''
                : this.windowGroup.computedTransition;
        },
    },
    methods: {
        genDefaultSlot() {
            return getSlot(this);
        },
        genWindowItem() {
            return withDirectives(h('div', {
                class: ['v-window-item', this.classes],
                ...this.$listeners,
            }, this.genDefaultSlot()), [
                [
                    vShow,
                    this.isActive
                ]
            ]);
        },
        onAfterTransition() {
            if (!this.inTransition) {
                return;
            }
            // Finalize transition state.
            this.inTransition = false;
            if (this.windowGroup.transitionCount > 0) {
                this.windowGroup.transitionCount--;
                // Remove container height if we are out of transition.
                if (this.windowGroup.transitionCount === 0) {
                    this.windowGroup.transitionHeight = undefined;
                }
            }
        },
        onBeforeTransition() {
            if (this.inTransition) {
                return;
            }
            // Initialize transition state here.
            this.inTransition = true;
            if (this.windowGroup.transitionCount === 0) {
                // Set initial height for height transition.
                this.windowGroup.transitionHeight = convertToUnit(this.windowGroup.$el.clientHeight);
            }
            this.windowGroup.transitionCount++;
        },
        onTransitionCancelled() {
            this.onAfterTransition(); // This should have the same path as normal transition end.
        },
        onEnter(el) {
            if (!this.inTransition) {
                return;
            }
            this.$nextTick(() => {
                // Do not set height if no transition or cancelled.
                if (!this.computedTransition || !this.inTransition) {
                    return;
                }
                // Set transition target height.
                this.windowGroup.transitionHeight = convertToUnit(el.clientHeight);
            });
        },
    },
    render() {
        return h(Transition, {
            name: this.computedTransition,
            // Handlers for enter windows.
            onBeforeEnter: this.onBeforeTransition,
            onAfterEnter: this.onAfterTransition,
            onEnterCancelled: this.onTransitionCancelled,
            // Handlers for leave windows.
            onBeforeLeave: this.onBeforeTransition,
            onAfterLeave: this.onAfterTransition,
            onLeaveCancelled: this.onTransitionCancelled,
            // Enter handler for height transition.
            onEnter: this.onEnter,
        }, {
            default: () => this.showLazyContent(() => [this.genWindowItem()])
        });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVldpbmRvd0l0ZW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WV2luZG93L1ZXaW5kb3dJdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBQyxNQUFNLEtBQUssQ0FBQTtBQUk1QyxTQUFTO0FBQ1QsT0FBTyxRQUFRLE1BQU0sdUJBQXVCLENBQUE7QUFDNUMsT0FBTyxFQUFFLE9BQU8sSUFBSSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFBO0FBS3BFLFlBQVk7QUFDWixPQUFPLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQzNELE9BQU8sTUFBc0IsTUFBTSxtQkFBbUIsQ0FBQTtBQUV0RCxRQUFRO0FBQ1IsT0FBTyxFQUFTLFVBQVUsRUFBRSxNQUFNLEtBQUssQ0FBQTtBQUV2QyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQ3ZCLFFBQVEsRUFDUixnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsZUFBZSxFQUFFLFVBQVUsQ0FBQyxDQUM3RCxDQUFBO0FBT0QsZUFBZSxVQUFVLENBQUMsTUFBTSxDQUFDO0lBQy9CLElBQUksRUFBRSxlQUFlO0lBRXJCLEtBQUssRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUdqQixLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsT0FBTztRQUNqQixpQkFBaUIsRUFBRTtZQUNqQixJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO1lBQ3ZCLE9BQU8sRUFBRSxTQUFTO1NBQ25CO1FBQ0QsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQztZQUN2QixPQUFPLEVBQUUsU0FBUztTQUNuQjtRQUNELEtBQUssRUFBRTtZQUNMLFFBQVEsRUFBRSxLQUFLO1NBQ2hCO0tBQ0Y7SUFFRCxJQUFJO1FBQ0YsT0FBTztZQUNMLFFBQVEs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O1lBQ3BFLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQztLQUNGO0lBRUQsTUFBTTtRQUNKLE9BQU8sQ0FBQyxDQUFDLFVBQVUsRUFBRTtZQUNuQixJQUFJLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjtZQUM3Qiw4QkFBOEI7WUFDOUIsYUFBYSxFQUFFLElBQUksQ0FBQyxrQkFBa0I7WUFDdEMsWUFBWSxFQUFFLElBQUksQ0FBQyxpQkFBaUI7WUFDcEMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLHFCQUFxQjtZQUU1Qyw4QkFBOEI7WUFDOUIsYUFBYSxFQUFFLElBQUksQ0FBQyxrQkFBa0I7WUFDdEMsWUFBWSxFQUFFLElBQUksQ0FBQyxpQkFBaUI7WUFDcEMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLHFCQUFxQjtZQUU1Qyx1Q0FBdUM7WUFDdkMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1NBQ3RCLEVBQUU7WUFDRCxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1NBQ2xFLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2gsIHZTaG93LCB3aXRoRGlyZWN0aXZlc30gZnJvbSAndnVlJ1xuLy8gQ29tcG9uZW50c1xuaW1wb3J0IFZXaW5kb3cgZnJvbSAnLi9WV2luZG93J1xuXG4vLyBNaXhpbnNcbmltcG9ydCBCb290YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvYm9vdGFibGUnXG5pbXBvcnQgeyBmYWN0b3J5IGFzIEdyb3VwYWJsZUZhY3RvcnkgfSBmcm9tICcuLi8uLi9taXhpbnMvZ3JvdXBhYmxlJ1xuXG4vLyBEaXJlY3RpdmVzXG5pbXBvcnQgVG91Y2ggZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy90b3VjaCdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBjb252ZXJ0VG9Vbml0LCBnZXRTbG90IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IG1peGlucywgeyBFeHRyYWN0VnVlIH0gZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSwgVHJhbnNpdGlvbiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgYmFzZU1peGlucyA9IG1peGlucyhcbiAgQm9vdGFibGUsXG4gIEdyb3VwYWJsZUZhY3RvcnkoJ3dpbmRvd0dyb3VwJywgJ3Ytd2luZG93LWl0ZW0nLCAndi13aW5kb3cnKVxuKVxuXG5pbnRlcmZhY2Ugb3B0aW9ucyBleHRlbmRzIEV4dHJhY3RWdWU8dHlwZW9mIGJhc2VNaXhpbnM+IHtcbiAgJGVsOiBIVE1MRWxlbWVudFxuICB3aW5kb3dHcm91cDogSW5zdGFuY2VUeXBlPHR5cGVvZiBWV2luZG93PlxufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlTWl4aW5zLmV4dGVuZCh7XG4gIG5hbWU6ICd2LXdpbmRvdy1pdGVtJyxcblxuICBlbWl0czogWydjaGFuZ2UnXSxcblxuXG4gIHByb3BzOiB7XG4gICAgZGlzYWJsZWQ6IEJvb2xlYW4sXG4gICAgcmV2ZXJzZVRyYW5zaXRpb246IHtcbiAgICAgIHR5cGU6IFtCb29sZWFuLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgIH0sXG4gICAgdHJhbnNpdGlvbjoge1xuICAgICAgdHlwZTogW0Jvb2xlYW4sIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgfSxcbiAgICB2YWx1ZToge1xuICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzQWN0aXZlOiBmYWxzZSxcbiAgICAgIGluVHJhbnNpdGlvbjogZmFsc2UsXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB0aGlzLmdyb3VwQ2xhc3Nlc1xuICAgIH0sXG4gICAgY29tcHV0ZWRUcmFuc2l0aW9uICgpOiBzdHJpbmcgfCBib29sZWFuIHtcbiAgICAgIGlmICghdGhpcy53aW5kb3dHcm91cC5pbnRlcm5hbFJldmVyc2UpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLnRyYW5zaXRpb24gIT09ICd1bmRlZmluZWQnXG4gICAgICAgICAgPyB0aGlzLnRyYW5zaXRpb24gfHwgJydcbiAgICAgICAgICA6IHRoaXMud2luZG93R3JvdXAuY29tcHV0ZWRUcmFuc2l0aW9uXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0eXBlb2YgdGhpcy5yZXZlcnNlVHJhbnNpdGlvbiAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgPyB0aGlzLnJldmVyc2VUcmFuc2l0aW9uIHx8ICcnXG4gICAgICAgIDogdGhpcy53aW5kb3dHcm91cC5jb21wdXRlZFRyYW5zaXRpb25cbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5EZWZhdWx0U2xvdCAoKSB7XG4gICAgICByZXR1cm4gZ2V0U2xvdCh0aGlzKVxuICAgIH0sXG4gICAgZ2VuV2luZG93SXRlbSAoKSB7XG4gICAgICByZXR1cm4gd2l0aERpcmVjdGl2ZXMoaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogWyd2LXdpbmRvdy1pdGVtJywgdGhpcy5jbGFzc2VzXSxcbiAgICAgICAgLi4udGhpcy4kbGlzdGVuZXJzLFxuICAgICAgfSwgdGhpcy5nZW5EZWZhdWx0U2xvdCgpKSwgW1xuICAgICAgICBbXG4gICAgICAgICAgdlNob3csXG4gICAgICAgICAgdGhpcy5pc0FjdGl2ZVxuICAgICAgICBdXG4gICAgICBdKVxuICAgIH0sXG4gICAgb25BZnRlclRyYW5zaXRpb24gKCkge1xuICAgICAgaWYgKCF0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gRmluYWxpemUgdHJhbnNpdGlvbiBzdGF0ZS5cbiAgICAgIHRoaXMuaW5UcmFuc2l0aW9uID0gZmFsc2VcbiAgICAgIGlmICh0aGlzLndpbmRvd0dyb3VwLnRyYW5zaXRpb25Db3VudCA+IDApIHtcbiAgICAgICAgdGhpcy53aW5kb3dHcm91cC50cmFuc2l0aW9uQ291bnQtLVxuXG4gICAgICAgIC8vIFJlbW92ZSBjb250YWluZXIgaGVpZ2h0IGlmIHdlIGFyZSBvdXQgb2YgdHJhbnNpdGlvbi5cbiAgICAgICAgaWYgKHRoaXMud2luZG93R3JvdXAudHJhbnNpdGlvbkNvdW50ID09PSAwKSB7XG4gICAgICAgICAgdGhpcy53aW5kb3dHcm91cC50cmFuc2l0aW9uSGVpZ2h0ID0gdW5kZWZpbmVkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIG9uQmVmb3JlVHJhbnNpdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIEluaXRpYWxpemUgdHJhbnNpdGlvbiBzdGF0ZSBoZXJlLlxuICAgICAgdGhpcy5pblRyYW5zaXRpb24gPSB0cnVlXG4gICAgICBpZiAodGhpcy53aW5kb3dHcm91cC50cmFuc2l0aW9uQ291bnQgPT09IDApIHtcbiAgICAgICAgLy8gU2V0IGluaXRpYWwgaGVpZ2h0IGZvciBoZWlnaHQgdHJhbnNpdGlvbi5cbiAgICAgICAgdGhpcy53aW5kb3dHcm91cC50cmFuc2l0aW9uSGVpZ2h0ID0gY29udmVydFRvVW5pdCh0aGlzLndpbmRvd0dyb3VwLiRlbC5jbGllbnRIZWlnaHQpXG4gICAgICB9XG4gICAgICB0aGlzLndpbmRvd0dyb3VwLnRyYW5zaXRpb25Db3VudCsrXG4gICAgfSxcbiAgICBvblRyYW5zaXRpb25DYW5jZWxsZWQgKCkge1xuICAgICAgdGhpcy5vbkFmdGVyVHJhbnNpdGlvbigpIC8vIFRoaXMgc2hvdWxkIGhhdmUgdGhlIHNhbWUgcGF0aCBhcyBub3JtYWwgdHJhbnNpdGlvbiBlbmQuXG4gICAgfSxcbiAgICBvbkVudGVyIChlbDogSFRNTEVsZW1lbnQpIHtcbiAgICAgIGlmICghdGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgLy8gRG8gbm90IHNldCBoZWlnaHQgaWYgbm8gdHJhbnNpdGlvbiBvciBjYW5jZWxsZWQuXG4gICAgICAgIGlmICghdGhpcy5jb21wdXRlZFRyYW5zaXRpb24gfHwgIXRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgdHJhbnNpdGlvbiB0YXJnZXQgaGVpZ2h0LlxuICAgICAgICB0aGlzLndpbmRvd0dyb3VwLnRyYW5zaXRpb25IZWlnaHQgPSBjb252ZXJ0VG9Vbml0KGVsLmNsaWVudEhlaWdodClcbiAgICAgIH0pXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKCk6IFZOb2RlIHtcbiAgICByZXR1cm4gaChUcmFuc2l0aW9uLCB7XG4gICAgICBuYW1lOiB0aGlzLmNvbXB1dGVkVHJhbnNpdGlvbixcbiAgICAgIC8vIEhhbmRsZXJzIGZvciBlbnRlciB3aW5kb3dzLlxuICAgICAgb25CZWZvcmVFbnRlcjogdGhpcy5vbkJlZm9yZVRyYW5zaXRpb24sXG4gICAgICBvbkFmdGVyRW50ZXI6IHRoaXMub25BZnRlclRyYW5zaXRpb24sXG4gICAgICBvbkVudGVyQ2FuY2VsbGVkOiB0aGlzLm9uVHJhbnNpdGlvbkNhbmNlbGxlZCxcblxuICAgICAgLy8gSGFuZGxlcnMgZm9yIGxlYXZlIHdpbmRvd3MuXG4gICAgICBvbkJlZm9yZUxlYXZlOiB0aGlzLm9uQmVmb3JlVHJhbnNpdGlvbixcbiAgICAgIG9uQWZ0ZXJMZWF2ZTogdGhpcy5vbkFmdGVyVHJhbnNpdGlvbixcbiAgICAgIG9uTGVhdmVDYW5jZWxsZWQ6IHRoaXMub25UcmFuc2l0aW9uQ2FuY2VsbGVkLFxuXG4gICAgICAvLyBFbnRlciBoYW5kbGVyIGZvciBoZWlnaHQgdHJhbnNpdGlvbi5cbiAgICAgIG9uRW50ZXI6IHRoaXMub25FbnRlcixcbiAgICB9LCB7XG4gICAgICBkZWZhdWx0OiAoKSA9PiB0aGlzLnNob3dMYXp5Q29udGVudCgoKSA9PiBbdGhpcy5nZW5XaW5kb3dJdGVtKCldKVxuICAgIH0pXG4gIH0sXG59KVxuIl19