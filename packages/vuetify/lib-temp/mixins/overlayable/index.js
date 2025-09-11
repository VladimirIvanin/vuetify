// Components
import VOverlay from '../../components/VOverlay';
// Utilities
import { keyCodes, addOnceEventListener, addPassiveEventListener, getZIndex, composedPath, } from '../../util/helpers';
// Types
import { defineComponent, createApp, h } from 'vue';
/* @vue/component */
export default defineComponent({
    name: 'overlayable',
    props: {
        hideOverlay: Boolean,
        overlayColor: String,
        overlayOpacity: [Number, String],
    },
    data() {
        return {
            animationFrame: 0,
            overlay: null,
        };
    },
    watch: {
        hideOverlay(value) {
            if (!this.isActive)
                return;
            if (value)
                this.removeOverlay();
            else
                this.genOverlay();
        },
    },
    beforeUnmount() {
        this.removeOverlay();
    },
    methods: {
        createOverlay() {
            // Create a container element
            const container = document.createElement('div');
            const props = {
                absolute: this.absolute,
                color: this.overlayColor,
                opacity: this.overlayOpacity
            };
            const wrapper = {
                data() {
                    return { value: false, zIndex: undefined };
                },
                render() {
                    return h(VOverlay, {
                        modelValue: this.value,
                        zIndex: this.zIndex,
                        ...props
                    });
                }
            };
            // // Create the overlay app
            // const overlayApp = createApp(VOverlay, {
            //   absolute: this.absolute,
            //   value: false,
            //   color: this.overlayColor,
            //   opacity: this.overlayOpacity,
            // });
            const overlayApp = createApp(wrapper);
            // Mount the app to the container
            const overlayInstance = overlayApp.mount(container);
            // Determine the parent element
            const parent = this.absolute
                ? this.$el.parentNode
                : document.querySelector('[data-app]');
            if (parent) {
                parent.insertBefore(container, parent.firstChild);
            }
            this.overlay = overlayInstance;
            this.overlayApp = overlayApp;
        },
        genOverlay() {
            this.hideScroll();
            if (this.hideOverlay)
                return;
            if (!this.overlay)
                this.createOverlay();
            this.animationFrame = requestAnimationFrame(() => {
                if (!this.overlay)
                    return;
                if (this.activeZIndex !== undefined) {
                    this.overlay.zIndex = String(this.activeZIndex - 1);
                }
                else if (this.$el) {
                    this.overlay.zIndex = getZIndex(this.$el);
                }
                this.overlay.value = true;
            });
            return true;
        },
        /** removeOverlay(false) will not restore the scollbar afterwards */
        removeOverlay(showScroll = true) {
            if (this.overlay) {
                addOnceEventListener(this.overlay.$el, 'transitionend', () => {
                    if (!this.overlay ||
                        !this.overlay.$el ||
                        !this.overlay.$el.parentNode ||
                        this.overlay.value ||
                        this.isActive)
                        return;
                    this.overlay.$el.parentNode.removeChild(this.overlay.$el);
                    this.overlayApp.unmount();
                    this.overlayApp = null;
                    this.overlay = null;
                });
                // Cancel animation frame in case
                // overlay is removed before it
                // has finished its animation
                cancelAnimationFrame(this.animationFrame);
                this.overlay.value = false;
            }
            showScroll && this.showScroll();
        },
        scrollListener(e) {
            if ('key' in e) {
                if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) ||
                    // https://github.com/vuetifyjs/vuetify/issues/4715
                    e.target.isContentEditable)
                    return;
                const up = [keyCodes.up, keyCodes.pageup];
                const down = [keyCodes.down, keyCodes.pagedown];
                if (up.includes(e.keyCode)) {
                    e.deltaY = -1;
                }
                else if (down.includes(e.keyCode)) {
                    e.deltaY = 1;
                }
                else {
                    return;
                }
            }
            if (e.target === this.overlay ||
                (e.type !== 'keydown' && e.target === document.body) ||
                this.checkPath(e))
                e.preventDefault();
        },
        hasScrollbar(el) {
            if (!el || el.nodeType !== Node.ELEMENT_NODE)
                return false;
            const style = window.getComputedStyle(el);
            return ((['auto', 'scroll'].includes(style.overflowY) || el.tagName === 'SELECT') && el.scrollHeight > el.clientHeight) ||
                ((['auto', 'scroll'].includes(style.overflowX)) && el.scrollWidth > el.clientWidth);
        },
        shouldScroll(el, e) {
            if (el.hasAttribute('data-app'))
                return false;
            const dir = e.shiftKey || e.deltaX ? 'x' : 'y';
            const delta = dir === 'y' ? e.deltaY : e.deltaX || e.deltaY;
            let alreadyAtStart;
            let alreadyAtEnd;
            if (dir === 'y') {
                alreadyAtStart = el.scrollTop === 0;
                alreadyAtEnd = el.scrollTop + el.clientHeight === el.scrollHeight;
            }
            else {
                alreadyAtStart = el.scrollLeft === 0;
                alreadyAtEnd = el.scrollLeft + el.clientWidth === el.scrollWidth;
            }
            const scrollingUp = delta < 0;
            const scrollingDown = delta > 0;
            if (!alreadyAtStart && scrollingUp)
                return true;
            if (!alreadyAtEnd && scrollingDown)
                return true;
            if ((alreadyAtStart || alreadyAtEnd) && el.parentNode) {
                return this.shouldScroll(el.parentNode, e);
            }
            return false;
        },
        isInside(el, parent) {
            if (el === parent) {
                return true;
            }
            else if (el === null || el === document.body) {
                return false;
            }
            else {
                return this.isInside(el.parentNode, parent);
            }
        },
        checkPath(e) {
            const path = composedPath(e);
            if (e.type === 'keydown' && path[0] === document.body) {
                const dialog = this.$refs.dialog;
                // getSelection returns null in firefox in some edge cases, can be ignored
                const selected = window.getSelection().anchorNode;
                if (dialog && this.hasScrollbar(dialog) && this.isInside(selected, dialog)) {
                    return !this.shouldScroll(dialog, e);
                }
                return true;
            }
            for (let index = 0; index < path.length; index++) {
                const el = path[index];
                if (el === document)
                    return true;
                if (el === document.documentElement)
                    return true;
                if (el === this.$refs.content)
                    return true;
                if (this.hasScrollbar(el))
                    return !this.shouldScroll(el, e);
            }
            return true;
        },
        hideScroll() {
            if (this.$vuetify.breakpoint.smAndDown) {
                document.documentElement.classList.add('overflow-y-hidden');
            }
            else {
                addPassiveEventListener(window, 'wheel', this.scrollListener, { passive: false });
                window.addEventListener('keydown', this.scrollListener);
            }
        },
        showScroll() {
            document.documentElement.classList.remove('overflow-y-hidden');
            window.removeEventListener('wheel', this.scrollListener);
            window.removeEventListener('keydown', this.scrollListener);
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL292ZXJsYXlhYmxlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGFBQWE7QUFDYixPQUFPLFFBQVEsTUFBTSwyQkFBMkIsQ0FBQTtBQUVoRCxZQUFZO0FBQ1osT0FBTyxFQUNMLFFBQVEsRUFDUixvQkFBb0IsRUFDcEIsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxZQUFZLEdBQ2IsTUFBTSxvQkFBb0IsQ0FBQTtBQUUzQixRQUFRO0FBQ1IsT0FBTyxFQUFFLGVBQWUsRUFBTyxTQUFTLEVBQUUsQ0FBQyxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBa0J4RCxvQkFBb0I7QUFDcEIsZUFBZSxlQUFlLENBQUM7SUFDN0IsSUFBSSxFQUFFLGFBQWE7SUFFbkIsS0FBSyxFQUFFO1FBQ0wsV0FBVyxFQUFFLE9BQU87UUFDcEIsWUFBWSxFQUFFLE1BQU07UUFDcEIsY0FBYyxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztLQUNqQztJQUVELElBQUk7UUFDRixPQUFPO1lBQ0wsY0FBYyxFQUFFLENBQUM7WUFDakIsT0FBTyxFQUFFLElBQTRDO1NBQ3RELENBQUE7SUFDSCxDQUFDO0lBRUQsS0FBSyxFQUFFO1FBQ0wsV0FBVyxDQUFFLEtBQUs7WUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO2dCQUFFLE9BQU07WUFFMUIsSUFBSSxLQUFLO2dCQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTs7Z0JBQzFCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtRQUN4QixDQUFDO0tBQ0Y7SUFFRCxhQUFhO1FBQ1gsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO0lBQ3RCLENBQUM7SUFFRCxPQUFPLEVBQUU7UUFDUCxhQUFhO1lBQ1gsNkJBQTZCO1lBQzdCLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFaEQsTUFBTSxLQUFLLEdBQUc7Z0JBQ1osUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN2QixLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVk7Z0JBQ3hCLE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBYzthQUM3QixDQUFBO1lBQ0QsTUFBTSxPQUFPLEdBQUc7Z0JBQ2QsSUFBSTtvQkFDRixPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUE7Z0JBQzVDLENBQUM7Z0JBQ0QsTUFBTTtvQkFDSixPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUU7d0JBQ2pCLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSzt3QkFDdEIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO3dCQUNuQixHQUFHLEtBQUs7cUJBQ1QsQ0FBQyxDQUFBO2dCQUNKLENBQUM7YUFDRixDQUFBO1lBQ0QsNEJBQTRCO1lBQzVCLDJDQUEyQztZQUMzQyw2QkFBNkI7WUFDN0Isa0JBQWtCO1lBQ2xCLDhCQUE4QjtZQUM5QixrQ0FBa0M7WUFDbEMsTUFBTTtZQUVOLE1BQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUVyQyxpQ0FBaUM7WUFDakMsTUFBTSxlQUFlLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUVwRCwrQkFBK0I7WUFDL0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVE7Z0JBQzFCLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVU7Z0JBQ3JCLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRXpDLElBQUksTUFBTSxFQUFFO2dCQUNWLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUNuRDtZQUVELElBQUksQ0FBQyxPQUFPLEdBQUcsZUFBZSxDQUFDO1lBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO1FBQzlCLENBQUM7UUFDRCxVQUFVO1lBQ1IsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO1lBRWpCLElBQUksSUFBSSxDQUFDLFdBQVc7Z0JBQUUsT0FBTTtZQUU1QixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU87Z0JBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO1lBRXZDLElBQUksQ0FBQyxjQUFjLEdBQUcscUJBQXFCLENBQUMsR0FBRyxFQUFFO2dCQUMvQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU87b0JBQUUsT0FBTTtnQkFFekIsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLFNBQVMsRUFBRTtvQkFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUE7aUJBQ3BEO3FCQUFNLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtvQkFDbkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtpQkFDMUM7Z0JBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFBO1lBQzNCLENBQUMsQ0FBQyxDQUFBO1lBRUYsT0FBTyxJQUFJLENBQUE7UUFDYixDQUFDO1FBQ0Qsb0VBQW9FO1FBQ3BFLGFBQWEsQ0FBRSxVQUFVLEdBQUcsSUFBSTtZQUM5QixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2hCLG9CQUFvQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLGVBQWUsRUFBRSxHQUFHLEVBQUU7b0JBQzNELElBQ0UsQ0FBQyxJQUFJLENBQUMsT0FBTzt3QkFDYixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRzt3QkFDakIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVO3dCQUM1QixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUs7d0JBQ2xCLElBQUksQ0FBQyxRQUFRO3dCQUNiLE9BQU07b0JBRVIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO29CQUN6RCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFBO29CQUN6QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQTtvQkFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7Z0JBQ3JCLENBQUMsQ0FBQyxDQUFBO2dCQUVGLGlDQUFpQztnQkFDakMsK0JBQStCO2dCQUMvQiw2QkFBNkI7Z0JBQzdCLG9CQUFvQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtnQkFFekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO2FBQzNCO1lBRUQsVUFBVSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtRQUNqQyxDQUFDO1FBQ0QsY0FBYyxDQUFFLENBQTZCO1lBQzNDLElBQUksS0FBSyxJQUFJLENBQUMsRUFBRTtnQkFDZCxJQUNFLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUUsQ0FBQyxDQUFDLE1BQWtCLENBQUMsT0FBTyxDQUFDO29CQUN2RSxtREFBbUQ7b0JBQ2xELENBQUMsQ0FBQyxNQUFzQixDQUFDLGlCQUFpQjtvQkFDM0MsT0FBTTtnQkFFUixNQUFNLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFBO2dCQUN6QyxNQUFNLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO2dCQUUvQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUN6QixDQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFBO2lCQUN2QjtxQkFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUNsQyxDQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQTtpQkFDdEI7cUJBQU07b0JBQ0wsT0FBTTtpQkFDUDthQUNGO1lBRUQsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxPQUFPO2dCQUMzQixDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDcEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFlLENBQUM7Z0JBQUUsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFBO1FBQ3ZELENBQUM7UUFDRCxZQUFZLENBQUUsRUFBWTtZQUN4QixJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLFlBQVk7Z0JBQUUsT0FBTyxLQUFLLENBQUE7WUFFMUQsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3pDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBVSxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sS0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUM7Z0JBQ3hILENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDdEYsQ0FBQztRQUNELFlBQVksQ0FBRSxFQUFXLEVBQUUsQ0FBYTtZQUN0QyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO2dCQUFFLE9BQU8sS0FBSyxDQUFBO1lBRTdDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUE7WUFDOUMsTUFBTSxLQUFLLEdBQUcsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFBO1lBRTNELElBQUksY0FBdUIsQ0FBQTtZQUMzQixJQUFJLFlBQXFCLENBQUE7WUFDekIsSUFBSSxHQUFHLEtBQUssR0FBRyxFQUFFO2dCQUNmLGNBQWMsR0FBRyxFQUFFLENBQUMsU0FBUyxLQUFLLENBQUMsQ0FBQTtnQkFDbkMsWUFBWSxHQUFHLEVBQUUsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLFlBQVksS0FBSyxFQUFFLENBQUMsWUFBWSxDQUFBO2FBQ2xFO2lCQUFNO2dCQUNMLGNBQWMsR0FBRyxFQUFFLENBQUMsVUFBVSxLQUFLLENBQUMsQ0FBQTtnQkFDcEMsWUFBWSxHQUFHLEVBQUUsQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLFdBQVcsS0FBSyxFQUFFLENBQUMsV0FBVyxDQUFBO2FBQ2pFO1lBRUQsTUFBTSxXQUFXLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQTtZQUM3QixNQUFNLGFBQWEsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFBO1lBRS9CLElBQUksQ0FBQyxjQUFjLElBQUksV0FBVztnQkFBRSxPQUFPLElBQUksQ0FBQTtZQUMvQyxJQUFJLENBQUMsWUFBWSxJQUFJLGFBQWE7Z0JBQUUsT0FBTyxJQUFJLENBQUE7WUFDL0MsSUFBSSxDQUFDLGNBQWMsSUFBSSxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsVUFBVSxFQUFFO2dCQUNyRCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLFVBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUE7YUFDdEQ7WUFFRCxPQUFPLEtBQUssQ0FBQTtRQUNkLENBQUM7UUFDRCxRQUFRLENBQUUsRUFBVyxFQUFFLE1BQWU7WUFDcEMsSUFBSSxFQUFFLEtBQUssTUFBTSxFQUFFO2dCQUNqQixPQUFPLElBQUksQ0FBQTthQUNaO2lCQUFNLElBQUksRUFBRSxLQUFLLElBQUksSUFBSSxFQUFFLEtBQUssUUFBUSxDQUFDLElBQUksRUFBRTtnQkFDOUMsT0FBTyxLQUFLLENBQUE7YUFDYjtpQkFBTTtnQkFDTCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFVBQXFCLEVBQUUsTUFBTSxDQUFDLENBQUE7YUFDdkQ7UUFDSCxDQUFDO1FBQ0QsU0FBUyxDQUFFLENBQWE7WUFDdEIsTUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBRTVCLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUU7Z0JBQ3JELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFBO2dCQUNoQywwRUFBMEU7Z0JBQzFFLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxZQUFZLEVBQUcsQ0FBQyxVQUFxQixDQUFBO2dCQUM3RCxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO29CQUMxRSxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUE7aUJBQ3JDO2dCQUNELE9BQU8sSUFBSSxDQUFBO2FBQ1o7WUFFRCxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDaEQsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUV0QixJQUFJLEVBQUUsS0FBSyxRQUFRO29CQUFFLE9BQU8sSUFBSSxDQUFBO2dCQUNoQyxJQUFJLEVBQUUsS0FBSyxRQUFRLENBQUMsZUFBZTtvQkFBRSxPQUFPLElBQUksQ0FBQTtnQkFDaEQsSUFBSSxFQUFFLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPO29CQUFFLE9BQU8sSUFBSSxDQUFBO2dCQUUxQyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBYSxDQUFDO29CQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQTthQUNsRjtZQUVELE9BQU8sSUFBSSxDQUFBO1FBQ2IsQ0FBQztRQUNELFVBQVU7WUFDUixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRTtnQkFDdEMsUUFBUSxDQUFDLGVBQWdCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO2FBQzdEO2lCQUFNO2dCQUNMLHVCQUF1QixDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO2dCQUNqRixNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTthQUN4RDtRQUNILENBQUM7UUFDRCxVQUFVO1lBQ1IsUUFBUSxDQUFDLGVBQWdCLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1lBQy9ELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO1lBQ3hELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQzVELENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvbXBvbmVudHNcbmltcG9ydCBWT3ZlcmxheSBmcm9tICcuLi8uLi9jb21wb25lbnRzL1ZPdmVybGF5J1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCB7XG4gIGtleUNvZGVzLFxuICBhZGRPbmNlRXZlbnRMaXN0ZW5lcixcbiAgYWRkUGFzc2l2ZUV2ZW50TGlzdGVuZXIsXG4gIGdldFpJbmRleCxcbiAgY29tcG9zZWRQYXRoLFxufSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBkZWZpbmVDb21wb25lbnQsIEFwcCwgY3JlYXRlQXBwLCBoIH0gZnJvbSAndnVlJ1xuXG5pbnRlcmZhY2UgVG9nZ2xlYWJsZSBleHRlbmRzIEFwcCB7XG4gIGlzQWN0aXZlPzogYm9vbGVhblxufVxuXG5pbnRlcmZhY2UgU3RhY2thYmxlIGV4dGVuZHMgQXBwIHtcbiAgYWN0aXZlWkluZGV4OiBudW1iZXJcbn1cblxuaW50ZXJmYWNlIG9wdGlvbnMge1xuICBhYnNvbHV0ZT86IGJvb2xlYW5cbiAgJHJlZnM6IHtcbiAgICBkaWFsb2c/OiBIVE1MRWxlbWVudFxuICAgIGNvbnRlbnQ/OiBIVE1MRWxlbWVudFxuICB9XG59XG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb21wb25lbnQoe1xuICBuYW1lOiAnb3ZlcmxheWFibGUnLFxuXG4gIHByb3BzOiB7XG4gICAgaGlkZU92ZXJsYXk6IEJvb2xlYW4sXG4gICAgb3ZlcmxheUNvbG9yOiBTdHJpbmcsXG4gICAgb3ZlcmxheU9wYWNpdHk6IFtOdW1iZXIsIFN0cmluZ10sXG4gIH0sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFuaW1hdGlvbkZyYW1lOiAwLFxuICAgICAgb3ZlcmxheTogbnVsbCBhcyBJbnN0YW5jZVR5cGU8dHlwZW9mIFZPdmVybGF5PiB8IG51bGwsXG4gICAgfVxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgaGlkZU92ZXJsYXkgKHZhbHVlKSB7XG4gICAgICBpZiAoIXRoaXMuaXNBY3RpdmUpIHJldHVyblxuXG4gICAgICBpZiAodmFsdWUpIHRoaXMucmVtb3ZlT3ZlcmxheSgpXG4gICAgICBlbHNlIHRoaXMuZ2VuT3ZlcmxheSgpXG4gICAgfSxcbiAgfSxcblxuICBiZWZvcmVVbm1vdW50ICgpIHtcbiAgICB0aGlzLnJlbW92ZU92ZXJsYXkoKVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBjcmVhdGVPdmVybGF5ICgpIHtcbiAgICAgIC8vIENyZWF0ZSBhIGNvbnRhaW5lciBlbGVtZW50XG4gICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIGFic29sdXRlOiB0aGlzLmFic29sdXRlLFxuICAgICAgICBjb2xvcjogdGhpcy5vdmVybGF5Q29sb3IsXG4gICAgICAgIG9wYWNpdHk6IHRoaXMub3ZlcmxheU9wYWNpdHlcbiAgICAgIH1cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSB7XG4gICAgICAgIGRhdGEoKSB7XG4gICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IGZhbHNlLCB6SW5kZXg6IHVuZGVmaW5lZCB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICByZXR1cm4gaChWT3ZlcmxheSwge1xuICAgICAgICAgICAgbW9kZWxWYWx1ZTogdGhpcy52YWx1ZSxcbiAgICAgICAgICAgIHpJbmRleDogdGhpcy56SW5kZXgsXG4gICAgICAgICAgICAuLi5wcm9wc1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIC8vIENyZWF0ZSB0aGUgb3ZlcmxheSBhcHBcbiAgICAgIC8vIGNvbnN0IG92ZXJsYXlBcHAgPSBjcmVhdGVBcHAoVk92ZXJsYXksIHtcbiAgICAgIC8vICAgYWJzb2x1dGU6IHRoaXMuYWJzb2x1dGUsXG4gICAgICAvLyAgIHZhbHVlOiBmYWxzZSxcbiAgICAgIC8vICAgY29sb3I6IHRoaXMub3ZlcmxheUNvbG9yLFxuICAgICAgLy8gICBvcGFjaXR5OiB0aGlzLm92ZXJsYXlPcGFjaXR5LFxuICAgICAgLy8gfSk7XG5cbiAgICAgIGNvbnN0IG92ZXJsYXlBcHAgPSBjcmVhdGVBcHAod3JhcHBlcilcblxuICAgICAgLy8gTW91bnQgdGhlIGFwcCB0byB0aGUgY29udGFpbmVyXG4gICAgICBjb25zdCBvdmVybGF5SW5zdGFuY2UgPSBvdmVybGF5QXBwLm1vdW50KGNvbnRhaW5lcik7XG5cbiAgICAgIC8vIERldGVybWluZSB0aGUgcGFyZW50IGVsZW1lbnRcbiAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuYWJzb2x1dGVcbiAgICAgICAgPyB0aGlzLiRlbC5wYXJlbnROb2RlXG4gICAgICAgIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtYXBwXScpO1xuXG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUoY29udGFpbmVyLCBwYXJlbnQuZmlyc3RDaGlsZCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMub3ZlcmxheSA9IG92ZXJsYXlJbnN0YW5jZTtcbiAgICAgIHRoaXMub3ZlcmxheUFwcCA9IG92ZXJsYXlBcHBcbiAgICB9LFxuICAgIGdlbk92ZXJsYXkgKCkge1xuICAgICAgdGhpcy5oaWRlU2Nyb2xsKClcblxuICAgICAgaWYgKHRoaXMuaGlkZU92ZXJsYXkpIHJldHVyblxuXG4gICAgICBpZiAoIXRoaXMub3ZlcmxheSkgdGhpcy5jcmVhdGVPdmVybGF5KClcblxuICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5vdmVybGF5KSByZXR1cm5cblxuICAgICAgICBpZiAodGhpcy5hY3RpdmVaSW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMub3ZlcmxheS56SW5kZXggPSBTdHJpbmcodGhpcy5hY3RpdmVaSW5kZXggLSAxKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuJGVsKSB7XG4gICAgICAgICAgdGhpcy5vdmVybGF5LnpJbmRleCA9IGdldFpJbmRleCh0aGlzLiRlbClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3ZlcmxheS52YWx1ZSA9IHRydWVcbiAgICAgIH0pXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSxcbiAgICAvKiogcmVtb3ZlT3ZlcmxheShmYWxzZSkgd2lsbCBub3QgcmVzdG9yZSB0aGUgc2NvbGxiYXIgYWZ0ZXJ3YXJkcyAqL1xuICAgIHJlbW92ZU92ZXJsYXkgKHNob3dTY3JvbGwgPSB0cnVlKSB7XG4gICAgICBpZiAodGhpcy5vdmVybGF5KSB7XG4gICAgICAgIGFkZE9uY2VFdmVudExpc3RlbmVyKHRoaXMub3ZlcmxheS4kZWwsICd0cmFuc2l0aW9uZW5kJywgKCkgPT4ge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICF0aGlzLm92ZXJsYXkgfHxcbiAgICAgICAgICAgICF0aGlzLm92ZXJsYXkuJGVsIHx8XG4gICAgICAgICAgICAhdGhpcy5vdmVybGF5LiRlbC5wYXJlbnROb2RlIHx8XG4gICAgICAgICAgICB0aGlzLm92ZXJsYXkudmFsdWUgfHxcbiAgICAgICAgICAgIHRoaXMuaXNBY3RpdmVcbiAgICAgICAgICApIHJldHVyblxuXG4gICAgICAgICAgdGhpcy5vdmVybGF5LiRlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMub3ZlcmxheS4kZWwpXG4gICAgICAgICAgdGhpcy5vdmVybGF5QXBwLnVubW91bnQoKVxuICAgICAgICAgIHRoaXMub3ZlcmxheUFwcCA9IG51bGxcbiAgICAgICAgICB0aGlzLm92ZXJsYXkgPSBudWxsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQ2FuY2VsIGFuaW1hdGlvbiBmcmFtZSBpbiBjYXNlXG4gICAgICAgIC8vIG92ZXJsYXkgaXMgcmVtb3ZlZCBiZWZvcmUgaXRcbiAgICAgICAgLy8gaGFzIGZpbmlzaGVkIGl0cyBhbmltYXRpb25cbiAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25GcmFtZSlcblxuICAgICAgICB0aGlzLm92ZXJsYXkudmFsdWUgPSBmYWxzZVxuICAgICAgfVxuXG4gICAgICBzaG93U2Nyb2xsICYmIHRoaXMuc2hvd1Njcm9sbCgpXG4gICAgfSxcbiAgICBzY3JvbGxMaXN0ZW5lciAoZTogV2hlZWxFdmVudCB8IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgIGlmICgna2V5JyBpbiBlKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBbJ0lOUFVUJywgJ1RFWFRBUkVBJywgJ1NFTEVDVCddLmluY2x1ZGVzKChlLnRhcmdldCBhcyBFbGVtZW50KS50YWdOYW1lKSB8fFxuICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92dWV0aWZ5anMvdnVldGlmeS9pc3N1ZXMvNDcxNVxuICAgICAgICAgIChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuaXNDb250ZW50RWRpdGFibGVcbiAgICAgICAgKSByZXR1cm5cblxuICAgICAgICBjb25zdCB1cCA9IFtrZXlDb2Rlcy51cCwga2V5Q29kZXMucGFnZXVwXVxuICAgICAgICBjb25zdCBkb3duID0gW2tleUNvZGVzLmRvd24sIGtleUNvZGVzLnBhZ2Vkb3duXVxuXG4gICAgICAgIGlmICh1cC5pbmNsdWRlcyhlLmtleUNvZGUpKSB7XG4gICAgICAgICAgKGUgYXMgYW55KS5kZWx0YVkgPSAtMVxuICAgICAgICB9IGVsc2UgaWYgKGRvd24uaW5jbHVkZXMoZS5rZXlDb2RlKSkge1xuICAgICAgICAgIChlIGFzIGFueSkuZGVsdGFZID0gMVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcy5vdmVybGF5IHx8XG4gICAgICAgIChlLnR5cGUgIT09ICdrZXlkb3duJyAmJiBlLnRhcmdldCA9PT0gZG9jdW1lbnQuYm9keSkgfHxcbiAgICAgICAgdGhpcy5jaGVja1BhdGgoZSBhcyBXaGVlbEV2ZW50KSkgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfSxcbiAgICBoYXNTY3JvbGxiYXIgKGVsPzogRWxlbWVudCkge1xuICAgICAgaWYgKCFlbCB8fCBlbC5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpIHJldHVybiBmYWxzZVxuXG4gICAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKVxuICAgICAgcmV0dXJuICgoWydhdXRvJywgJ3Njcm9sbCddLmluY2x1ZGVzKHN0eWxlLm92ZXJmbG93WSEpIHx8IGVsLnRhZ05hbWUgPT09ICdTRUxFQ1QnKSAmJiBlbC5zY3JvbGxIZWlnaHQgPiBlbC5jbGllbnRIZWlnaHQpIHx8XG4gICAgICAoKFsnYXV0bycsICdzY3JvbGwnXS5pbmNsdWRlcyhzdHlsZS5vdmVyZmxvd1ghKSkgJiYgZWwuc2Nyb2xsV2lkdGggPiBlbC5jbGllbnRXaWR0aClcbiAgICB9LFxuICAgIHNob3VsZFNjcm9sbCAoZWw6IEVsZW1lbnQsIGU6IFdoZWVsRXZlbnQpOiBib29sZWFuIHtcbiAgICAgIGlmIChlbC5oYXNBdHRyaWJ1dGUoJ2RhdGEtYXBwJykpIHJldHVybiBmYWxzZVxuXG4gICAgICBjb25zdCBkaXIgPSBlLnNoaWZ0S2V5IHx8IGUuZGVsdGFYID8gJ3gnIDogJ3knXG4gICAgICBjb25zdCBkZWx0YSA9IGRpciA9PT0gJ3knID8gZS5kZWx0YVkgOiBlLmRlbHRhWCB8fCBlLmRlbHRhWVxuXG4gICAgICBsZXQgYWxyZWFkeUF0U3RhcnQ6IGJvb2xlYW5cbiAgICAgIGxldCBhbHJlYWR5QXRFbmQ6IGJvb2xlYW5cbiAgICAgIGlmIChkaXIgPT09ICd5Jykge1xuICAgICAgICBhbHJlYWR5QXRTdGFydCA9IGVsLnNjcm9sbFRvcCA9PT0gMFxuICAgICAgICBhbHJlYWR5QXRFbmQgPSBlbC5zY3JvbGxUb3AgKyBlbC5jbGllbnRIZWlnaHQgPT09IGVsLnNjcm9sbEhlaWdodFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxyZWFkeUF0U3RhcnQgPSBlbC5zY3JvbGxMZWZ0ID09PSAwXG4gICAgICAgIGFscmVhZHlBdEVuZCA9IGVsLnNjcm9sbExlZnQgKyBlbC5jbGllbnRXaWR0aCA9PT0gZWwuc2Nyb2xsV2lkdGhcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2Nyb2xsaW5nVXAgPSBkZWx0YSA8IDBcbiAgICAgIGNvbnN0IHNjcm9sbGluZ0Rvd24gPSBkZWx0YSA+IDBcblxuICAgICAgaWYgKCFhbHJlYWR5QXRTdGFydCAmJiBzY3JvbGxpbmdVcCkgcmV0dXJuIHRydWVcbiAgICAgIGlmICghYWxyZWFkeUF0RW5kICYmIHNjcm9sbGluZ0Rvd24pIHJldHVybiB0cnVlXG4gICAgICBpZiAoKGFscmVhZHlBdFN0YXJ0IHx8IGFscmVhZHlBdEVuZCkgJiYgZWwucGFyZW50Tm9kZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zaG91bGRTY3JvbGwoZWwucGFyZW50Tm9kZSBhcyBFbGVtZW50LCBlKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9LFxuICAgIGlzSW5zaWRlIChlbDogRWxlbWVudCwgcGFyZW50OiBFbGVtZW50KTogYm9vbGVhbiB7XG4gICAgICBpZiAoZWwgPT09IHBhcmVudCkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBlbHNlIGlmIChlbCA9PT0gbnVsbCB8fCBlbCA9PT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzSW5zaWRlKGVsLnBhcmVudE5vZGUgYXMgRWxlbWVudCwgcGFyZW50KVxuICAgICAgfVxuICAgIH0sXG4gICAgY2hlY2tQYXRoIChlOiBXaGVlbEV2ZW50KSB7XG4gICAgICBjb25zdCBwYXRoID0gY29tcG9zZWRQYXRoKGUpXG5cbiAgICAgIGlmIChlLnR5cGUgPT09ICdrZXlkb3duJyAmJiBwYXRoWzBdID09PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICAgIGNvbnN0IGRpYWxvZyA9IHRoaXMuJHJlZnMuZGlhbG9nXG4gICAgICAgIC8vIGdldFNlbGVjdGlvbiByZXR1cm5zIG51bGwgaW4gZmlyZWZveCBpbiBzb21lIGVkZ2UgY2FzZXMsIGNhbiBiZSBpZ25vcmVkXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkID0gd2luZG93LmdldFNlbGVjdGlvbigpIS5hbmNob3JOb2RlIGFzIEVsZW1lbnRcbiAgICAgICAgaWYgKGRpYWxvZyAmJiB0aGlzLmhhc1Njcm9sbGJhcihkaWFsb2cpICYmIHRoaXMuaXNJbnNpZGUoc2VsZWN0ZWQsIGRpYWxvZykpIHtcbiAgICAgICAgICByZXR1cm4gIXRoaXMuc2hvdWxkU2Nyb2xsKGRpYWxvZywgZSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgcGF0aC5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgY29uc3QgZWwgPSBwYXRoW2luZGV4XVxuXG4gICAgICAgIGlmIChlbCA9PT0gZG9jdW1lbnQpIHJldHVybiB0cnVlXG4gICAgICAgIGlmIChlbCA9PT0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSByZXR1cm4gdHJ1ZVxuICAgICAgICBpZiAoZWwgPT09IHRoaXMuJHJlZnMuY29udGVudCkgcmV0dXJuIHRydWVcblxuICAgICAgICBpZiAodGhpcy5oYXNTY3JvbGxiYXIoZWwgYXMgRWxlbWVudCkpIHJldHVybiAhdGhpcy5zaG91bGRTY3JvbGwoZWwgYXMgRWxlbWVudCwgZSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9LFxuICAgIGhpZGVTY3JvbGwgKCkge1xuICAgICAgaWYgKHRoaXMuJHZ1ZXRpZnkuYnJlYWtwb2ludC5zbUFuZERvd24pIHtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IS5jbGFzc0xpc3QuYWRkKCdvdmVyZmxvdy15LWhpZGRlbicpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZGRQYXNzaXZlRXZlbnRMaXN0ZW5lcih3aW5kb3csICd3aGVlbCcsIHRoaXMuc2Nyb2xsTGlzdGVuZXIsIHsgcGFzc2l2ZTogZmFsc2UgfSlcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLnNjcm9sbExpc3RlbmVyKVxuICAgICAgfVxuICAgIH0sXG4gICAgc2hvd1Njcm9sbCAoKSB7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQhLmNsYXNzTGlzdC5yZW1vdmUoJ292ZXJmbG93LXktaGlkZGVuJylcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMuc2Nyb2xsTGlzdGVuZXIpXG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuc2Nyb2xsTGlzdGVuZXIpXG4gICAgfSxcbiAgfSxcbn0pXG4iXX0=