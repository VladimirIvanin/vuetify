// Directives
import { Scroll } from '../../directives';
// Utilities
import { consoleWarn } from '../../util/console';
// Types
import { defineComponent } from 'vue';
/**
 * Scrollable
 *
 * Used for monitoring scrolling and
 * invoking functions based upon
 * scrolling thresholds being
 * met.
 */
/* @vue/component */
export default defineComponent({
    name: 'scrollable',
    directives: { Scroll },
    props: {
        scrollTarget: String,
        scrollThreshold: [String, Number],
    },
    data: () => ({
        currentScroll: 0,
        currentThreshold: 0,
        isActive: false,
        isScrollingUp: false,
        previousScroll: 0,
        savedScroll: 0,
        target: null,
    }),
    computed: {
        /**
         * A computed property that returns
         * whether scrolling features are
         * enabled or disabled
         */
        canScroll() {
            return typeof window !== 'undefined';
        },
        /**
         * The threshold that must be met before
         * thresholdMet function is invoked
         */
        computedScrollThreshold() {
            return this.scrollThreshold
                ? Number(this.scrollThreshold)
                : 300;
        },
    },
    watch: {
        isScrollingUp() {
            this.savedScroll = this.savedScroll || this.currentScroll;
        },
        isActive() {
            this.savedScroll = 0;
        },
    },
    mounted() {
        if (this.scrollTarget) {
            this.target = document.querySelector(this.scrollTarget);
            if (!this.target) {
                consoleWarn(`Unable to locate element with identifier ${this.scrollTarget}`, this);
            }
        }
    },
    methods: {
        onScroll() {
            if (!this.canScroll)
                return;
            this.previousScroll = this.currentScroll;
            this.currentScroll = this.target
                ? this.target.scrollTop
                : window.pageYOffset;
            this.isScrollingUp = this.currentScroll < this.previousScroll;
            this.currentThreshold = Math.abs(this.currentScroll - this.computedScrollThreshold);
            this.$nextTick(() => {
                if (Math.abs(this.currentScroll - this.savedScroll) >
                    this.computedScrollThreshold)
                    this.thresholdMet();
            });
        },
        /**
         * The method invoked when
         * scrolling in any direction
         * has exceeded the threshold
         */
        thresholdMet() { },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3Njcm9sbGFibGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsYUFBYTtBQUNiLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQTtBQUV6QyxZQUFZO0FBQ1osT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRWhELFFBQVE7QUFDUixPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sS0FBSyxDQUFBO0FBRW5DOzs7Ozs7O0dBT0c7QUFDSCxvQkFBb0I7QUFDcEIsZUFBZSxlQUFlLENBQUM7SUFDN0IsSUFBSSxFQUFFLFlBQVk7SUFFbEIsVUFBVSxFQUFFLEVBQUUsTUFBTSxFQUFFO0lBRXRCLEtBQUssRUFBRTtRQUNMLFlBQVksRUFBRSxNQUFNO1FBQ3BCLGVBQWUsRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7S0FDbEM7SUFFRCxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNYLGFBQWEsRUFBRSxDQUFDO1FBQ2hCLGdCQUFnQixFQUFFLENBQUM7UUFDbkIsUUFBUSxFQUFFLEtBQUs7UUFDZixhQUFhLEVBQUUsS0FBSztRQUNwQixjQUFjLEVBQUUsQ0FBQztRQUNqQixXQUFXLEVBQUUsQ0FBQztRQUNkLE1BQU0sRUFBRSxJQUFzQjtLQUMvQixDQUFDO0lBRUYsUUFBUSxFQUFFO1FBQ1I7Ozs7V0FJRztRQUNILFNBQVM7WUFDUCxPQUFPLE9BQU8sTUFBTSxLQUFLLFdBQVcsQ0FBQTtRQUN0QyxDQUFDO1FBQ0Q7OztXQUdHO1FBQ0gsdUJBQXVCO1lBQ3JCLE9BQU8sSUFBSSxDQUFDLGVBQWU7Z0JBQ3pCLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztnQkFDOUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQTtRQUNULENBQUM7S0FDRjtJQUVELEtBQUssRUFBRTtRQUNMLGFBQWE7WUFDWCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQTtRQUMzRCxDQUFDO1FBQ0QsUUFBUTtZQUNOLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFBO1FBQ3RCLENBQUM7S0FDRjtJQUVELE9BQU87UUFDTCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtZQUV2RCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDaEIsV0FBVyxDQUFDLDRDQUE0QyxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7YUFDbkY7U0FDRjtJQUNILENBQUM7SUFFRCxPQUFPLEVBQUU7UUFDUCxRQUFRO1lBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTO2dCQUFFLE9BQU07WUFFM0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFBO1lBQ3hDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU07Z0JBQzlCLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVM7Z0JBQ3ZCLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFBO1lBRXRCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFBO1lBQzdELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUE7WUFFbkYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2xCLElBQ0UsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7b0JBQy9DLElBQUksQ0FBQyx1QkFBdUI7b0JBQzVCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtZQUN2QixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFDRDs7OztXQUlHO1FBQ0gsWUFBWSxLQUFpQixDQUFDO0tBQy9CO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRGlyZWN0aXZlc1xuaW1wb3J0IHsgU2Nyb2xsIH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcydcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBjb25zb2xlV2FybiB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcblxuLy8gVHlwZXNcbmltcG9ydCB7ZGVmaW5lQ29tcG9uZW50fSBmcm9tICd2dWUnXG5cbi8qKlxuICogU2Nyb2xsYWJsZVxuICpcbiAqIFVzZWQgZm9yIG1vbml0b3Jpbmcgc2Nyb2xsaW5nIGFuZFxuICogaW52b2tpbmcgZnVuY3Rpb25zIGJhc2VkIHVwb25cbiAqIHNjcm9sbGluZyB0aHJlc2hvbGRzIGJlaW5nXG4gKiBtZXQuXG4gKi9cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb21wb25lbnQoe1xuICBuYW1lOiAnc2Nyb2xsYWJsZScsXG5cbiAgZGlyZWN0aXZlczogeyBTY3JvbGwgfSxcblxuICBwcm9wczoge1xuICAgIHNjcm9sbFRhcmdldDogU3RyaW5nLFxuICAgIHNjcm9sbFRocmVzaG9sZDogW1N0cmluZywgTnVtYmVyXSxcbiAgfSxcblxuICBkYXRhOiAoKSA9PiAoe1xuICAgIGN1cnJlbnRTY3JvbGw6IDAsXG4gICAgY3VycmVudFRocmVzaG9sZDogMCxcbiAgICBpc0FjdGl2ZTogZmFsc2UsXG4gICAgaXNTY3JvbGxpbmdVcDogZmFsc2UsXG4gICAgcHJldmlvdXNTY3JvbGw6IDAsXG4gICAgc2F2ZWRTY3JvbGw6IDAsXG4gICAgdGFyZ2V0OiBudWxsIGFzIEVsZW1lbnQgfCBudWxsLFxuICB9KSxcblxuICBjb21wdXRlZDoge1xuICAgIC8qKlxuICAgICAqIEEgY29tcHV0ZWQgcHJvcGVydHkgdGhhdCByZXR1cm5zXG4gICAgICogd2hldGhlciBzY3JvbGxpbmcgZmVhdHVyZXMgYXJlXG4gICAgICogZW5hYmxlZCBvciBkaXNhYmxlZFxuICAgICAqL1xuICAgIGNhblNjcm9sbCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFRoZSB0aHJlc2hvbGQgdGhhdCBtdXN0IGJlIG1ldCBiZWZvcmVcbiAgICAgKiB0aHJlc2hvbGRNZXQgZnVuY3Rpb24gaXMgaW52b2tlZFxuICAgICAqL1xuICAgIGNvbXB1dGVkU2Nyb2xsVGhyZXNob2xkICgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIHRoaXMuc2Nyb2xsVGhyZXNob2xkXG4gICAgICAgID8gTnVtYmVyKHRoaXMuc2Nyb2xsVGhyZXNob2xkKVxuICAgICAgICA6IDMwMFxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBpc1Njcm9sbGluZ1VwICgpIHtcbiAgICAgIHRoaXMuc2F2ZWRTY3JvbGwgPSB0aGlzLnNhdmVkU2Nyb2xsIHx8IHRoaXMuY3VycmVudFNjcm9sbFxuICAgIH0sXG4gICAgaXNBY3RpdmUgKCkge1xuICAgICAgdGhpcy5zYXZlZFNjcm9sbCA9IDBcbiAgICB9LFxuICB9LFxuXG4gIG1vdW50ZWQgKCkge1xuICAgIGlmICh0aGlzLnNjcm9sbFRhcmdldCkge1xuICAgICAgdGhpcy50YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuc2Nyb2xsVGFyZ2V0KVxuXG4gICAgICBpZiAoIXRoaXMudGFyZ2V0KSB7XG4gICAgICAgIGNvbnNvbGVXYXJuKGBVbmFibGUgdG8gbG9jYXRlIGVsZW1lbnQgd2l0aCBpZGVudGlmaWVyICR7dGhpcy5zY3JvbGxUYXJnZXR9YCwgdGhpcylcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIG9uU2Nyb2xsICgpIHtcbiAgICAgIGlmICghdGhpcy5jYW5TY3JvbGwpIHJldHVyblxuXG4gICAgICB0aGlzLnByZXZpb3VzU2Nyb2xsID0gdGhpcy5jdXJyZW50U2Nyb2xsXG4gICAgICB0aGlzLmN1cnJlbnRTY3JvbGwgPSB0aGlzLnRhcmdldFxuICAgICAgICA/IHRoaXMudGFyZ2V0LnNjcm9sbFRvcFxuICAgICAgICA6IHdpbmRvdy5wYWdlWU9mZnNldFxuXG4gICAgICB0aGlzLmlzU2Nyb2xsaW5nVXAgPSB0aGlzLmN1cnJlbnRTY3JvbGwgPCB0aGlzLnByZXZpb3VzU2Nyb2xsXG4gICAgICB0aGlzLmN1cnJlbnRUaHJlc2hvbGQgPSBNYXRoLmFicyh0aGlzLmN1cnJlbnRTY3JvbGwgLSB0aGlzLmNvbXB1dGVkU2Nyb2xsVGhyZXNob2xkKVxuXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBNYXRoLmFicyh0aGlzLmN1cnJlbnRTY3JvbGwgLSB0aGlzLnNhdmVkU2Nyb2xsKSA+XG4gICAgICAgICAgdGhpcy5jb21wdXRlZFNjcm9sbFRocmVzaG9sZFxuICAgICAgICApIHRoaXMudGhyZXNob2xkTWV0KClcbiAgICAgIH0pXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBUaGUgbWV0aG9kIGludm9rZWQgd2hlblxuICAgICAqIHNjcm9sbGluZyBpbiBhbnkgZGlyZWN0aW9uXG4gICAgICogaGFzIGV4Y2VlZGVkIHRoZSB0aHJlc2hvbGRcbiAgICAgKi9cbiAgICB0aHJlc2hvbGRNZXQgKCkgeyAvKiBub29wICovIH0sXG4gIH0sXG59KVxuIl19