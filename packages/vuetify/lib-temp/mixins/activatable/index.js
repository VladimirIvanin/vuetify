// Mixins
import Delayable from '../delayable';
import Toggleable from '../toggleable';
// Utilities
import mixins from '../../util/mixins';
import { getSlot, getSlotType } from '../../util/helpers';
import { consoleError } from '../../util/console';
const baseMixins = mixins(Delayable, Toggleable);
/* @vue/component */
export default baseMixins.extend({
    name: 'activatable',
    props: {
        activator: {
            default: null,
            validator: (val) => {
                return ['string', 'object'].includes(typeof val);
            },
        },
        disabled: Boolean,
        internalActivator: Boolean,
        openOnClick: {
            type: Boolean,
            default: true,
        },
        openOnHover: Boolean,
        openOnFocus: Boolean,
    },
    data: () => ({
        // Do not use this directly, call getActivator() instead
        activatorElement: null,
        activatorNode: [],
        events: ['click', 'mouseenter', 'mouseleave', 'focus'],
        listeners: {},
    }),
    watch: {
        activator: 'resetActivator',
        openOnFocus: 'resetActivator',
        openOnHover: 'resetActivator',
    },
    mounted() {
        const slotType = getSlotType(this, 'activator', true);
        if (slotType && ['v-slot', 'normal'].includes(slotType)) {
            consoleError(`The activator slot must be bound, try '<template v-slot:activator="{ on }"><v-btn v-on="on">'`, this);
        }
        this.addActivatorEvents();
    },
    beforeUnmount() {
        this.removeActivatorEvents();
    },
    computed: {
        isActivatable() {
            return true;
        }
    },
    methods: {
        addActivatorEvents() {
            if (!this.activator ||
                this.disabled ||
                !this.getActivator())
                return;
            this.listeners = this.genActivatorListeners();
            const keys = Object.keys(this.listeners);
            for (const key of keys) {
                this.getActivator().addEventListener(key, this.listeners[key]);
            }
        },
        genActivator() {
            let node = getSlot(this, 'activator', Object.assign(this.getValueProxy(), {
                attrs: {
                    ...this.genActivatorListeners(),
                    ...this.genActivatorAttributes(),
                },
                on: this.genActivatorListeners()
            })) || [];
            node = Array.isArray(node) ? node : [node];
            this.activatorNode = node.flatMap(node => {
                return node.type === Symbol.for('v-fgt') ? node.children : node;
            });
            return node;
        },
        genActivatorAttributes() {
            return {
                role: (this.openOnClick && !this.openOnHover) ? 'button' : undefined,
                'aria-haspopup': true,
                'aria-expanded': String(this.isActive),
            };
        },
        genActivatorListeners() {
            if (this.disabled)
                return {};
            const listeners = {};
            if (this.openOnHover) {
                listeners.onMouseenter = (e) => {
                    this.getActivator(e);
                    this.runDelay('open');
                };
                listeners.onMouseleave = (e) => {
                    this.getActivator(e);
                    this.runDelay('close');
                };
            }
            else if (this.openOnClick) {
                listeners.onClick = (e) => {
                    const activator = this.getActivator(e);
                    if (activator)
                        activator.focus();
                    e.stopPropagation();
                    this.isActive = !this.isActive;
                };
            }
            if (this.openOnFocus) {
                listeners.onFocus = (e) => {
                    this.getActivator(e);
                    e.stopPropagation();
                    this.isActive = !this.isActive;
                };
            }
            return listeners;
        },
        getActivator(e) {
            var _a;
            // If we've already fetched the activator, re-use
            if (this.activatorElement)
                return this.activatorElement;
            let activator = null;
            if (this.activator) {
                const target = this.internalActivator ? this.$el : document;
                if (typeof this.activator === 'string') {
                    // Selector
                    activator = target.querySelector(this.activator);
                }
                else if (this.activator.$el) {
                    // Component (ref)
                    activator = this.activator.$el;
                }
                else {
                    // HTMLElement | Element
                    activator = this.activator;
                }
            }
            else if (this.activatorNode.length === 1 || (this.activatorNode.length && !e)) {
                // Use the contents of the activator slot
                // There's either only one element in it or we
                // don't have a click event to use as a last resort
                const vm = (_a = this.activatorNode[0].component) === null || _a === void 0 ? void 0 : _a.ctx;
                if (vm &&
                    (vm.isActivatable !== undefined || vm.isMenuable !== undefined)) {
                    // Activator is actually another activatible component, use its activator (#8846)
                    activator = vm.getActivator();
                }
                else {
                    activator = this.activatorNode[0].el;
                }
            }
            else if (e) {
                // Activated by a click or focus event
                activator = (e.currentTarget || e.target);
            }
            // The activator should only be a valid element (Ignore comments and text nodes)
            this.activatorElement = (activator === null || activator === void 0 ? void 0 : activator.nodeType) === Node.ELEMENT_NODE ? activator : null;
            return this.activatorElement;
        },
        getContentSlot() {
            return getSlot(this, 'default', this.getValueProxy(), true);
        },
        getValueProxy() {
            const self = this;
            return {
                get value() {
                    return self.isActive;
                },
                set value(isActive) {
                    self.isActive = isActive;
                },
            };
        },
        removeActivatorEvents() {
            if (!this.activator ||
                !this.activatorElement)
                return;
            const keys = Object.keys(this.listeners);
            for (const key of keys) {
                this.activatorElement.removeEventListener(key, this.listeners[key]);
            }
            this.listeners = {};
        },
        resetActivator() {
            this.removeActivatorEvents();
            this.activatorElement = null;
            this.getActivator();
            this.addActivatorEvents();
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2FjdGl2YXRhYmxlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSxjQUFjLENBQUE7QUFDcEMsT0FBTyxVQUFVLE1BQU0sZUFBZSxDQUFBO0FBRXRDLFlBQVk7QUFDWixPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUN0QyxPQUFPLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ3pELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQU9qRCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQ3ZCLFNBQVMsRUFDVCxVQUFVLENBQ1gsQ0FBQTtBQUVELG9CQUFvQjtBQUNwQixlQUFlLFVBQVUsQ0FBQyxNQUFNLENBQUM7SUFDL0IsSUFBSSxFQUFFLGFBQWE7SUFFbkIsS0FBSyxFQUFFO1FBQ0wsU0FBUyxFQUFFO1lBQ1QsT0FBTyxFQUFFLElBQTBFO1lBQ25GLFNBQVMsRUFBRSxDQUFDLEdBQW9CLEVBQUUsRUFBRTtnQkFDbEMsT0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQTtZQUNsRCxDQUFDO1NBQ0Y7UUFDRCxRQUFRLEVBQUUsT0FBTztRQUNqQixpQkFBaUIsRUFBRSxPQUFPO1FBQzFCLFdBQVcsRUFBRTtZQUNYLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLElBQUk7U0FDZDtRQUNELFdBQVcsRUFBRSxPQUFPO1FBQ3BCLFdBQVcsRUFBRSxPQUFPO0tBQ3JCO0lBRUQsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDWCx3REFBd0Q7UUFDeEQsZ0JBQWdCLEVBQUUsSUFBMEI7UUFDNUMsYUFBYSxFQUFFLEVBQWE7UUFDNUIsTUFBTSxFQUFFLENBQUMsT0FB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QUFJLENBQUMsZ0JBQXdCLENBQUMsbUJBQW1CLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTthQUM3RTtZQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFBO1FBQ3JCLENBQUM7UUFDRCxjQUFjO1lBQ1osSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUE7WUFDNUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQTtZQUM1QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7WUFDbkIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUE7UUFDM0IsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTWl4aW5zXG5pbXBvcnQgRGVsYXlhYmxlIGZyb20gJy4uL2RlbGF5YWJsZSdcbmltcG9ydCBUb2dnbGVhYmxlIGZyb20gJy4uL3RvZ2dsZWFibGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IGdldFNsb3QsIGdldFNsb3RUeXBlIH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IHsgY29uc29sZUVycm9yIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUsIFByb3BUeXBlIH0gZnJvbSAndnVlJ1xuXG50eXBlIExpc3RlbmVycyA9IERpY3Rpb25hcnk8KGU6IE1vdXNlRXZlbnQgJiBLZXlib2FyZEV2ZW50ICYgRm9jdXNFdmVudCkgPT4gdm9pZD5cblxuY29uc3QgYmFzZU1peGlucyA9IG1peGlucyhcbiAgRGVsYXlhYmxlLFxuICBUb2dnbGVhYmxlXG4pXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBiYXNlTWl4aW5zLmV4dGVuZCh7XG4gIG5hbWU6ICdhY3RpdmF0YWJsZScsXG5cbiAgcHJvcHM6IHtcbiAgICBhY3RpdmF0b3I6IHtcbiAgICAgIGRlZmF1bHQ6IG51bGwgYXMgdW5rbm93biBhcyBQcm9wVHlwZTxzdHJpbmcgfCBIVE1MRWxlbWVudCB8IFZOb2RlIHwgRWxlbWVudCB8IG51bGw+LFxuICAgICAgdmFsaWRhdG9yOiAodmFsOiBzdHJpbmcgfCBvYmplY3QpID0+IHtcbiAgICAgICAgcmV0dXJuIFsnc3RyaW5nJywgJ29iamVjdCddLmluY2x1ZGVzKHR5cGVvZiB2YWwpXG4gICAgICB9LFxuICAgIH0sXG4gICAgZGlzYWJsZWQ6IEJvb2xlYW4sXG4gICAgaW50ZXJuYWxBY3RpdmF0b3I6IEJvb2xlYW4sXG4gICAgb3Blbk9uQ2xpY2s6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgIH0sXG4gICAgb3Blbk9uSG92ZXI6IEJvb2xlYW4sXG4gICAgb3Blbk9uRm9jdXM6IEJvb2xlYW4sXG4gIH0sXG5cbiAgZGF0YTogKCkgPT4gKHtcbiAgICAvLyBEbyBub3QgdXNlIHRoaXMgZGlyZWN0bHksIGNhbGwgZ2V0QWN0aXZhdG9yKCkgaW5zdGVhZFxuICAgIGFjdGl2YXRvckVsZW1lbnQ6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxuICAgIGFjdGl2YXRvck5vZGU6IFtdIGFzIFZOb2RlW10sXG4gICAgZXZlbnRzOiBbJ2NsaWNrJywgJ21vdXNlZW50ZXInLCAnbW91c2VsZWF2ZScsICdmb2N1cyddLFxuICAgIGxpc3RlbmVyczoge30gYXMgTGlzdGVuZXJzLFxuICB9KSxcblxuICB3YXRjaDoge1xuICAgIGFjdGl2YXRvcjogJ3Jlc2V0QWN0aXZhdG9yJyxcbiAgICBvcGVuT25Gb2N1czogJ3Jlc2V0QWN0aXZhdG9yJyxcbiAgICBvcGVuT25Ib3ZlcjogJ3Jlc2V0QWN0aXZhdG9yJyxcbiAgfSxcblxuICBtb3VudGVkICgpIHtcbiAgICBjb25zdCBzbG90VHlwZSA9IGdldFNsb3RUeXBlKHRoaXMsICdhY3RpdmF0b3InLCB0cnVlKVxuXG4gICAgaWYgKHNsb3RUeXBlICYmIFsndi1zbG90JywgJ25vcm1hbCddLmluY2x1ZGVzKHNsb3RUeXBlKSkge1xuICAgICAgY29uc29sZUVycm9yKGBUaGUgYWN0aXZhdG9yIHNsb3QgbXVzdCBiZSBib3VuZCwgdHJ5ICc8dGVtcGxhdGUgdi1zbG90OmFjdGl2YXRvcj1cInsgb24gfVwiPjx2LWJ0biB2LW9uPVwib25cIj4nYCwgdGhpcylcbiAgICB9XG5cbiAgICB0aGlzLmFkZEFjdGl2YXRvckV2ZW50cygpXG4gIH0sXG5cbiAgYmVmb3JlVW5tb3VudCAoKSB7XG4gICAgdGhpcy5yZW1vdmVBY3RpdmF0b3JFdmVudHMoKVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgaXNBY3RpdmF0YWJsZSgpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBhZGRBY3RpdmF0b3JFdmVudHMgKCkge1xuICAgICAgaWYgKFxuICAgICAgICAhdGhpcy5hY3RpdmF0b3IgfHxcbiAgICAgICAgdGhpcy5kaXNhYmxlZCB8fFxuICAgICAgICAhdGhpcy5nZXRBY3RpdmF0b3IoKVxuICAgICAgKSByZXR1cm5cblxuICAgICAgdGhpcy5saXN0ZW5lcnMgPSB0aGlzLmdlbkFjdGl2YXRvckxpc3RlbmVycygpXG4gICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXModGhpcy5saXN0ZW5lcnMpXG5cbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICAgICAgdGhpcy5nZXRBY3RpdmF0b3IoKSEuYWRkRXZlbnRMaXN0ZW5lcihrZXksIHRoaXMubGlzdGVuZXJzW2tleV0gYXMgYW55KVxuICAgICAgfVxuICAgIH0sXG4gICAgZ2VuQWN0aXZhdG9yICgpIHtcbiAgICAgIGxldCBub2RlID0gZ2V0U2xvdCh0aGlzLCAnYWN0aXZhdG9yJywgT2JqZWN0LmFzc2lnbih0aGlzLmdldFZhbHVlUHJveHkoKSwge1xuICAgICAgICBhdHRyczoge1xuICAgICAgICAgIC4uLnRoaXMuZ2VuQWN0aXZhdG9yTGlzdGVuZXJzKCksXG4gICAgICAgICAgLi4udGhpcy5nZW5BY3RpdmF0b3JBdHRyaWJ1dGVzKCksXG4gICAgICAgIH0sXG4gICAgICAgIG9uOiB0aGlzLmdlbkFjdGl2YXRvckxpc3RlbmVycygpXG4gICAgICB9KSkgfHwgW11cblxuICAgICAgbm9kZSA9IEFycmF5LmlzQXJyYXkobm9kZSkgPyBub2RlIDogW25vZGVdXG5cbiAgICAgIHRoaXMuYWN0aXZhdG9yTm9kZSA9IG5vZGUuZmxhdE1hcChub2RlID0+IHtcbiAgICAgICAgcmV0dXJuIG5vZGUudHlwZSA9PT0gU3ltYm9sLmZvcigndi1mZ3QnKSA/IG5vZGUuY2hpbGRyZW4gOiBub2RlXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gbm9kZVxuICAgIH0sXG4gICAgZ2VuQWN0aXZhdG9yQXR0cmlidXRlcyAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByb2xlOiAodGhpcy5vcGVuT25DbGljayAmJiAhdGhpcy5vcGVuT25Ib3ZlcikgPyAnYnV0dG9uJyA6IHVuZGVmaW5lZCxcbiAgICAgICAgJ2FyaWEtaGFzcG9wdXAnOiB0cnVlLFxuICAgICAgICAnYXJpYS1leHBhbmRlZCc6IFN0cmluZyh0aGlzLmlzQWN0aXZlKSxcbiAgICAgIH1cbiAgICB9LFxuICAgIGdlbkFjdGl2YXRvckxpc3RlbmVycyAoKSB7XG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuIHt9XG5cbiAgICAgIGNvbnN0IGxpc3RlbmVyczogTGlzdGVuZXJzID0ge31cblxuICAgICAgaWYgKHRoaXMub3Blbk9uSG92ZXIpIHtcbiAgICAgICAgbGlzdGVuZXJzLm9uTW91c2VlbnRlciA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgdGhpcy5nZXRBY3RpdmF0b3IoZSlcbiAgICAgICAgICB0aGlzLnJ1bkRlbGF5KCdvcGVuJylcbiAgICAgICAgfVxuICAgICAgICBsaXN0ZW5lcnMub25Nb3VzZWxlYXZlID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICB0aGlzLmdldEFjdGl2YXRvcihlKVxuICAgICAgICAgIHRoaXMucnVuRGVsYXkoJ2Nsb3NlJylcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wZW5PbkNsaWNrKSB7XG4gICAgICAgIGxpc3RlbmVycy5vbkNsaWNrID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBhY3RpdmF0b3IgPSB0aGlzLmdldEFjdGl2YXRvcihlKVxuICAgICAgICAgIGlmIChhY3RpdmF0b3IpIGFjdGl2YXRvci5mb2N1cygpXG5cbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICAgICAgICB0aGlzLmlzQWN0aXZlID0gIXRoaXMuaXNBY3RpdmVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcGVuT25Gb2N1cykge1xuICAgICAgICBsaXN0ZW5lcnMub25Gb2N1cyA9IChlOiBGb2N1c0V2ZW50KSA9PiB7XG4gICAgICAgICAgdGhpcy5nZXRBY3RpdmF0b3IoZSlcblxuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgICAgICAgIHRoaXMuaXNBY3RpdmUgPSAhdGhpcy5pc0FjdGl2ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBsaXN0ZW5lcnNcbiAgICB9LFxuICAgIGdldEFjdGl2YXRvciAoZT86IEV2ZW50KTogSFRNTEVsZW1lbnQgfCBudWxsIHtcbiAgICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZmV0Y2hlZCB0aGUgYWN0aXZhdG9yLCByZS11c2VcbiAgICAgIGlmICh0aGlzLmFjdGl2YXRvckVsZW1lbnQpIHJldHVybiB0aGlzLmFjdGl2YXRvckVsZW1lbnRcblxuICAgICAgbGV0IGFjdGl2YXRvciA9IG51bGxcblxuICAgICAgaWYgKHRoaXMuYWN0aXZhdG9yKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuaW50ZXJuYWxBY3RpdmF0b3IgPyB0aGlzLiRlbCA6IGRvY3VtZW50XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmFjdGl2YXRvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAvLyBTZWxlY3RvclxuICAgICAgICAgIGFjdGl2YXRvciA9IHRhcmdldC5xdWVyeVNlbGVjdG9yKHRoaXMuYWN0aXZhdG9yKVxuICAgICAgICB9IGVsc2UgaWYgKCh0aGlzLmFjdGl2YXRvciBhcyBhbnkpLiRlbCkge1xuICAgICAgICAgIC8vIENvbXBvbmVudCAocmVmKVxuICAgICAgICAgIGFjdGl2YXRvciA9ICh0aGlzLmFjdGl2YXRvciBhcyBhbnkpLiRlbFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEhUTUxFbGVtZW50IHwgRWxlbWVudFxuICAgICAgICAgIGFjdGl2YXRvciA9IHRoaXMuYWN0aXZhdG9yXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5hY3RpdmF0b3JOb2RlLmxlbmd0aCA9PT0gMSB8fCAodGhpcy5hY3RpdmF0b3JOb2RlLmxlbmd0aCAmJiAhZSkpIHtcblxuICAgICAgICAvLyBVc2UgdGhlIGNvbnRlbnRzIG9mIHRoZSBhY3RpdmF0b3Igc2xvdFxuICAgICAgICAvLyBUaGVyZSdzIGVpdGhlciBvbmx5IG9uZSBlbGVtZW50IGluIGl0IG9yIHdlXG4gICAgICAgIC8vIGRvbid0IGhhdmUgYSBjbGljayBldmVudCB0byB1c2UgYXMgYSBsYXN0IHJlc29ydFxuICAgICAgICBjb25zdCB2bSA9IHRoaXMuYWN0aXZhdG9yTm9kZVswXS5jb21wb25lbnQ/LmN0eFxuICAgICAgICBpZiAoXG4gICAgICAgICAgdm0gJiZcbiAgICAgICAgICAodm0uaXNBY3RpdmF0YWJsZSAhPT0gdW5kZWZpbmVkIHx8IHZtLmlzTWVudWFibGUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gQWN0aXZhdG9yIGlzIGFjdHVhbGx5IGFub3RoZXIgYWN0aXZhdGlibGUgY29tcG9uZW50LCB1c2UgaXRzIGFjdGl2YXRvciAoIzg4NDYpXG4gICAgICAgICAgYWN0aXZhdG9yID0gKHZtIGFzIGFueSkuZ2V0QWN0aXZhdG9yKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhY3RpdmF0b3IgPSB0aGlzLmFjdGl2YXRvck5vZGVbMF0uZWwgYXMgSFRNTEVsZW1lbnRcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChlKSB7XG4gICAgICAgIC8vIEFjdGl2YXRlZCBieSBhIGNsaWNrIG9yIGZvY3VzIGV2ZW50XG4gICAgICAgIGFjdGl2YXRvciA9IChlLmN1cnJlbnRUYXJnZXQgfHwgZS50YXJnZXQpIGFzIEhUTUxFbGVtZW50XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBhY3RpdmF0b3Igc2hvdWxkIG9ubHkgYmUgYSB2YWxpZCBlbGVtZW50IChJZ25vcmUgY29tbWVudHMgYW5kIHRleHQgbm9kZXMpXG4gICAgICB0aGlzLmFjdGl2YXRvckVsZW1lbnQgPSBhY3RpdmF0b3I/Lm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSA/IGFjdGl2YXRvciA6IG51bGxcblxuICAgICAgcmV0dXJuIHRoaXMuYWN0aXZhdG9yRWxlbWVudFxuICAgIH0sXG4gICAgZ2V0Q29udGVudFNsb3QgKCkge1xuICAgICAgcmV0dXJuIGdldFNsb3QodGhpcywgJ2RlZmF1bHQnLCB0aGlzLmdldFZhbHVlUHJveHkoKSwgdHJ1ZSlcbiAgICB9LFxuICAgIGdldFZhbHVlUHJveHkgKCk6IG9iamVjdCB7XG4gICAgICBjb25zdCBzZWxmID0gdGhpc1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0IHZhbHVlICgpIHtcbiAgICAgICAgICByZXR1cm4gc2VsZi5pc0FjdGl2ZVxuICAgICAgICB9LFxuICAgICAgICBzZXQgdmFsdWUgKGlzQWN0aXZlOiBib29sZWFuKSB7XG4gICAgICAgICAgc2VsZi5pc0FjdGl2ZSA9IGlzQWN0aXZlXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgfSxcbiAgICByZW1vdmVBY3RpdmF0b3JFdmVudHMgKCkge1xuICAgICAgaWYgKFxuICAgICAgICAhdGhpcy5hY3RpdmF0b3IgfHxcbiAgICAgICAgIXRoaXMuYWN0aXZhdG9yRWxlbWVudFxuICAgICAgKSByZXR1cm5cblxuICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMubGlzdGVuZXJzKVxuXG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7XG4gICAgICAgICh0aGlzLmFjdGl2YXRvckVsZW1lbnQgYXMgYW55KS5yZW1vdmVFdmVudExpc3RlbmVyKGtleSwgdGhpcy5saXN0ZW5lcnNba2V5XSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5saXN0ZW5lcnMgPSB7fVxuICAgIH0sXG4gICAgcmVzZXRBY3RpdmF0b3IgKCkge1xuICAgICAgdGhpcy5yZW1vdmVBY3RpdmF0b3JFdmVudHMoKVxuICAgICAgdGhpcy5hY3RpdmF0b3JFbGVtZW50ID0gbnVsbFxuICAgICAgdGhpcy5nZXRBY3RpdmF0b3IoKVxuICAgICAgdGhpcy5hZGRBY3RpdmF0b3JFdmVudHMoKVxuICAgIH1cbiAgfSxcbn0pXG4iXX0=