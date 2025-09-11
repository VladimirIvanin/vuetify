import { h, withDirectives } from 'vue';
// Styles
import './VTabs.sass';
// Components
import VTabsBar from './VTabsBar';
import VTabsItems from './VTabsItems';
import VTabsSlider from './VTabsSlider';
// Mixins
import Colorable from '../../mixins/colorable';
import Proxyable from '../../mixins/proxyable';
import Themeable from '../../mixins/themeable';
// Directives
import Resize from '../../directives/resize';
// Utilities
import { convertToUnit, getSlot } from '../../util/helpers';
import mixins from '../../util/mixins';
const baseMixins = mixins(Colorable, Proxyable, Themeable);
export default baseMixins.extend({
    name: 'v-tabs',
    props: {
        activeClass: {
            type: String,
            default: '',
        },
        alignWithTitle: Boolean,
        backgroundColor: String,
        centerActive: Boolean,
        centered: Boolean,
        fixedTabs: Boolean,
        grow: Boolean,
        height: {
            type: [Number, String],
            default: undefined,
        },
        hideSlider: Boolean,
        iconsAndText: Boolean,
        mobileBreakpoint: [String, Number],
        nextIcon: {
            type: String,
            default: '$next',
        },
        optional: Boolean,
        prevIcon: {
            type: String,
            default: '$prev',
        },
        right: Boolean,
        showArrows: [Boolean, String],
        sliderColor: String,
        sliderSize: {
            type: [Number, String],
            default: 2,
        },
        vertical: Boolean,
    },
    data() {
        return {
            resizeTimeout: 0,
            slider: {
                height: null,
                left: null,
                right: null,
                top: null,
                width: null,
            },
            transitionTime: 300,
        };
    },
    computed: {
        classes() {
            return {
                'v-tabs--align-with-title': this.alignWithTitle,
                'v-tabs--centered': this.centered,
                'v-tabs--fixed-tabs': this.fixedTabs,
                'v-tabs--grow': this.grow,
                'v-tabs--icons-and-text': this.iconsAndText,
                'v-tabs--right': this.right,
                'v-tabs--vertical': this.vertical,
                ...this.themeClasses,
            };
        },
        isReversed() {
            return this.$vuetify.rtl && this.vertical;
        },
        sliderStyles() {
            return {
                height: convertToUnit(this.slider.height),
                left: this.isReversed ? undefined : convertToUnit(this.slider.left),
                right: this.isReversed ? convertToUnit(this.slider.right) : undefined,
                top: this.vertical ? convertToUnit(this.slider.top) : undefined,
                transition: this.slider.left != null ? null : 'none',
                width: convertToUnit(this.slider.width),
            };
        },
        computedColor() {
            if (this.color)
                return this.color;
            else if (this.isDark && !this.appIsDark)
                return 'white';
            else
                return 'primary';
        },
    },
    watch: {
        alignWithTitle: 'callSlider',
        centered: 'callSlider',
        centerActive: 'callSlider',
        fixedTabs: 'callSlider',
        grow: 'callSlider',
        iconsAndText: 'callSlider',
        right: 'callSlider',
        showArrows: 'callSlider',
        vertical: 'callSlider',
        '$vuetify.application.left': 'onResize',
        '$vuetify.application.right': 'onResize',
        '$vuetify.rtl': 'onResize',
        modelValue(val) {
            this.validateModelValue(val);
        },
    },
    mounted() {
        this.validateModelValue(this.modelValue);
        if (typeof ResizeObserver !== 'undefined') {
            const obs = new ResizeObserver(() => {
                this.onResize();
            });
            obs.observe(this.$el);
            this.$on('hook:destroyed', () => {
                obs.disconnect();
            });
        }
        this.$nextTick(() => {
            window.setTimeout(this.callSlider, 30);
        });
    },
    methods: {
        validateModelValue(val) {
            if (typeof val === 'number' && val < 0) {
                this.internalValue = 0;
            }
        },
        callSlider() {
            if (this.hideSlider ||
                !this.$refs.items ||
                !this.$refs.items.selectedItems.length) {
                this.slider.width = 0;
                return false;
            }
            this.$nextTick(() => {
                // Give screen time to paint
                const activeTab = this.$refs.items.selectedItems[0];
                /* istanbul ignore if */
                if (!activeTab || !activeTab.$el) {
                    this.slider.width = 0;
                    this.slider.left = 0;
                    return;
                }
                const el = activeTab.$el;
                this.slider = {
                    height: !this.vertical ? Number(this.sliderSize) : el.scrollHeight,
                    left: this.vertical ? 0 : el.offsetLeft,
                    right: this.vertical ? 0 : el.offsetLeft + el.offsetWidth,
                    top: el.offsetTop,
                    width: this.vertical ? Number(this.sliderSize) : el.scrollWidth,
                };
            });
            return true;
        },
        genBar(items, slider) {
            const data = {
                style: {
                    height: convertToUnit(this.height),
                },
                activeClass: this.activeClass,
                centerActive: this.centerActive,
                dark: this.dark,
                light: this.light,
                mandatory: !this.optional,
                mobileBreakpoint: this.mobileBreakpoint,
                nextIcon: this.nextIcon,
                prevIcon: this.prevIcon,
                showArrows: this.showArrows,
                modelValue: this.internalValue,
                'onCall:slider': this.callSlider,
                'onUpdate:modelValue': (val) => {
                    this.internalValue = val;
                },
                ref: 'items',
            };
            this.setTextColor(this.computedColor, data);
            this.setBackgroundColor(this.backgroundColor, data);
            return h(VTabsBar, data, () => [
                this.genSlider(slider),
                items,
            ]);
        },
        genItems(items, item) {
            // If user provides items
            // opt to use theirs
            if (items)
                return items;
            // If no tabs are provided
            // render nothing
            if (!item.length)
                return null;
            return h(VTabsItems, {
                modelValue: this.internalValue,
                'onUpdate:modelValue': (val) => {
                    this.internalValue = val;
                },
            }, () => item);
        },
        genSlider(slider) {
            if (this.hideSlider)
                return null;
            if (!slider) {
                slider = h(VTabsSlider, {
                    color: this.sliderColor,
                });
            }
            return h('div', {
                class: 'v-tabs-slider-wrapper',
                style: this.sliderStyles,
            }, [slider]);
        },
        onResize() {
            if (this._isDestroyed)
                return;
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = window.setTimeout(this.callSlider, 0);
        },
        parseNodes() {
            let items = null;
            let slider = null;
            const item = [];
            const tab = [];
            const slot = getSlot(this) || [];
            const length = slot.length;
            for (let i = 0; i < length; i++) {
                const vnode = slot[i];
                if (vnode.type) {
                    switch (vnode.type.name) {
                        case 'v-tabs-slider':
                            slider = vnode;
                            break;
                        case 'v-tabs-items':
                            items = vnode;
                            break;
                        case 'v-tab-item':
                            item.push(vnode);
                            break;
                        // case 'v-tab' - intentionally omitted
                        default: tab.push(vnode);
                    }
                }
                else {
                    tab.push(vnode);
                }
            }
            /**
             * tab: array of `v-tab`
             * slider: single `v-tabs-slider`
             * items: single `v-tabs-items`
             * item: array of `v-tab-item`
             */
            return { tab, slider, items, item };
        },
    },
    render() {
        const { tab, slider, items, item } = this.parseNodes();
        return withDirectives(h('div', {
            class: ['v-tabs', this.classes],
        }, [
            this.genBar(tab, slider),
            this.genItems(items, item),
        ]), [
            [
                Resize,
                this.onResize,
                '',
                { quiet: true },
            ],
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRhYnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WVGFicy9WVGFicy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxNQUFNLEtBQUssQ0FBQTtBQUN2QyxTQUFTO0FBQ1QsT0FBTyxjQUFjLENBQUE7QUFFckIsYUFBYTtBQUNiLE9BQU8sUUFBUSxNQUFNLFlBQVksQ0FBQTtBQUNqQyxPQUFPLFVBQVUsTUFBTSxjQUFjLENBQUE7QUFDckMsT0FBTyxXQUFXLE1BQU0sZUFBZSxDQUFBO0FBRXZDLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0seUJBQXlCLENBQUE7QUFFNUMsWUFBWTtBQUNaLE9BQU8sRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFM0QsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFLdEMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUN2QixTQUFTLEVBQ1QsU0FBUyxFQUNULFNBQVMsQ0FDVixDQUFBO0FBUUQsZUFBZSxVQUFVLENBQUMsTUFBTSxDQUFDO0lBQy9CLElBQUksRUFBRSxRQUFRO0lBRWQsS0FBSyxFQUFFO1FBQ0wsV0FBVyxFQUFFO1lBQ1gsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsRUFBRTtTQUNaO1FBQ0QsY0FBYyxFQUFFLE9BQU87UUFDdkIsZUFBZSxFQUFFLE1BQU07UUFDdkIsWUFBWSxFQUFFLE9BQU87UUFDckIsUUFBUSxFQUFFLE9BQU87UUFDakIsU0FBUyxFQUFFLE9BQU87UUFDbEIsSUFBSSxFQUFFLE9BQU87UUFDYixNQUFNLEVBQUU7WUFDTixJQUFJLEVB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Q0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7aUJBQ2hCO2FBQ0Y7WUFFRDs7Ozs7ZUFLRztZQUNILE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQTtRQUNyQyxDQUFDO0tBQ0Y7SUFFRCxNQUFNO1FBQ0osTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtRQUV0RCxPQUFPLGNBQWMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQzdCLEtBQUssRUFBRSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQ2hDLEVBQUU7WUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUM7WUFDeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO1NBQzNCLENBQUMsRUFBRTtZQUNGO2dCQUNFLE1BQU07Z0JBQ04sSUFBSSxDQUFDLFFBQVE7Z0JBQ2IsRUFBRTtnQkFDRixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7YUFDaEI7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCwgd2l0aERpcmVjdGl2ZXMgfSBmcm9tICd2dWUnXG4vLyBTdHlsZXNcbmltcG9ydCAnLi9WVGFicy5zYXNzJ1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgVlRhYnNCYXIgZnJvbSAnLi9WVGFic0JhcidcbmltcG9ydCBWVGFic0l0ZW1zIGZyb20gJy4vVlRhYnNJdGVtcydcbmltcG9ydCBWVGFic1NsaWRlciBmcm9tICcuL1ZUYWJzU2xpZGVyJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcbmltcG9ydCBQcm94eWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3Byb3h5YWJsZSdcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcblxuLy8gRGlyZWN0aXZlc1xuaW1wb3J0IFJlc2l6ZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3Jlc2l6ZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBjb252ZXJ0VG9Vbml0LCBnZXRTbG90IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IHsgRXh0cmFjdFZ1ZSB9IGZyb20gJy4vLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUvdHlwZXMnXG5cbmNvbnN0IGJhc2VNaXhpbnMgPSBtaXhpbnMoXG4gIENvbG9yYWJsZSxcbiAgUHJveHlhYmxlLFxuICBUaGVtZWFibGVcbilcblxuaW50ZXJmYWNlIG9wdGlvbnMgZXh0ZW5kcyBFeHRyYWN0VnVlPHR5cGVvZiBiYXNlTWl4aW5zPiB7XG4gICRyZWZzOiB7XG4gICAgaXRlbXM6IEluc3RhbmNlVHlwZTx0eXBlb2YgVlRhYnNCYXI+XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZU1peGlucy5leHRlbmQoe1xuICBuYW1lOiAndi10YWJzJyxcblxuICBwcm9wczoge1xuICAgIGFjdGl2ZUNsYXNzOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJyxcbiAgICB9LFxuICAgIGFsaWduV2l0aFRpdGxlOiBCb29sZWFuLFxuICAgIGJhY2tncm91bmRDb2xvcjogU3RyaW5nLFxuICAgIGNlbnRlckFjdGl2ZTogQm9vbGVhbixcbiAgICBjZW50ZXJlZDogQm9vbGVhbixcbiAgICBmaXhlZFRhYnM6IEJvb2xlYW4sXG4gICAgZ3JvdzogQm9vbGVhbixcbiAgICBoZWlnaHQ6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgfSxcbiAgICBoaWRlU2xpZGVyOiBCb29sZWFuLFxuICAgIGljb25zQW5kVGV4dDogQm9vbGVhbixcbiAgICBtb2JpbGVCcmVha3BvaW50OiBbU3RyaW5nLCBOdW1iZXJdLFxuICAgIG5leHRJY29uOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJG5leHQnLFxuICAgIH0sXG4gICAgb3B0aW9uYWw6IEJvb2xlYW4sXG4gICAgcHJldkljb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckcHJldicsXG4gICAgfSxcbiAgICByaWdodDogQm9vbGVhbixcbiAgICBzaG93QXJyb3dzOiBbQm9vbGVhbiwgU3RyaW5nXSxcbiAgICBzbGlkZXJDb2xvcjogU3RyaW5nLFxuICAgIHNsaWRlclNpemU6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAyLFxuICAgIH0sXG4gICAgdmVydGljYWw6IEJvb2xlYW4sXG4gIH0sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc2l6ZVRpbWVvdXQ6IDAsXG4gICAgICBzbGlkZXI6IHtcbiAgICAgICAgaGVpZ2h0OiBudWxsIGFzIG51bGwgfCBudW1iZXIsXG4gICAgICAgIGxlZnQ6IG51bGwgYXMgbnVsbCB8IG51bWJlcixcbiAgICAgICAgcmlnaHQ6IG51bGwgYXMgbnVsbCB8IG51bWJlcixcbiAgICAgICAgdG9wOiBudWxsIGFzIG51bGwgfCBudW1iZXIsXG4gICAgICAgIHdpZHRoOiBudWxsIGFzIG51bGwgfCBudW1iZXIsXG4gICAgICB9LFxuICAgICAgdHJhbnNpdGlvblRpbWU6IDMwMCxcbiAgICB9XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ3YtdGFicy0tYWxpZ24td2l0aC10aXRsZSc6IHRoaXMuYWxpZ25XaXRoVGl0bGUsXG4gICAgICAgICd2LXRhYnMtLWNlbnRlcmVkJzogdGhpcy5jZW50ZXJlZCxcbiAgICAgICAgJ3YtdGFicy0tZml4ZWQtdGFicyc6IHRoaXMuZml4ZWRUYWJzLFxuICAgICAgICAndi10YWJzLS1ncm93JzogdGhpcy5ncm93LFxuICAgICAgICAndi10YWJzLS1pY29ucy1hbmQtdGV4dCc6IHRoaXMuaWNvbnNBbmRUZXh0LFxuICAgICAgICAndi10YWJzLS1yaWdodCc6IHRoaXMucmlnaHQsXG4gICAgICAgICd2LXRhYnMtLXZlcnRpY2FsJzogdGhpcy52ZXJ0aWNhbCxcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXMsXG4gICAgICB9XG4gICAgfSxcbiAgICBpc1JldmVyc2VkICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLiR2dWV0aWZ5LnJ0bCAmJiB0aGlzLnZlcnRpY2FsXG4gICAgfSxcbiAgICBzbGlkZXJTdHlsZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBoZWlnaHQ6IGNvbnZlcnRUb1VuaXQodGhpcy5zbGlkZXIuaGVpZ2h0KSxcbiAgICAgICAgbGVmdDogdGhpcy5pc1JldmVyc2VkID8gdW5kZWZpbmVkIDogY29udmVydFRvVW5pdCh0aGlzLnNsaWRlci5sZWZ0KSxcbiAgICAgICAgcmlnaHQ6IHRoaXMuaXNSZXZlcnNlZCA/IGNvbnZlcnRUb1VuaXQodGhpcy5zbGlkZXIucmlnaHQpIDogdW5kZWZpbmVkLFxuICAgICAgICB0b3A6IHRoaXMudmVydGljYWwgPyBjb252ZXJ0VG9Vbml0KHRoaXMuc2xpZGVyLnRvcCkgOiB1bmRlZmluZWQsXG4gICAgICAgIHRyYW5zaXRpb246IHRoaXMuc2xpZGVyLmxlZnQgIT0gbnVsbCA/IG51bGwgOiAnbm9uZScsXG4gICAgICAgIHdpZHRoOiBjb252ZXJ0VG9Vbml0KHRoaXMuc2xpZGVyLndpZHRoKSxcbiAgICAgIH1cbiAgICB9LFxuICAgIGNvbXB1dGVkQ29sb3IgKCk6IHN0cmluZyB7XG4gICAgICBpZiAodGhpcy5jb2xvcikgcmV0dXJuIHRoaXMuY29sb3JcbiAgICAgIGVsc2UgaWYgKHRoaXMuaXNEYXJrICYmICF0aGlzLmFwcElzRGFyaykgcmV0dXJuICd3aGl0ZSdcbiAgICAgIGVsc2UgcmV0dXJuICdwcmltYXJ5J1xuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBhbGlnbldpdGhUaXRsZTogJ2NhbGxTbGlkZXInLFxuICAgIGNlbnRlcmVkOiAnY2FsbFNsaWRlcicsXG4gICAgY2VudGVyQWN0aXZlOiAnY2FsbFNsaWRlcicsXG4gICAgZml4ZWRUYWJzOiAnY2FsbFNsaWRlcicsXG4gICAgZ3JvdzogJ2NhbGxTbGlkZXInLFxuICAgIGljb25zQW5kVGV4dDogJ2NhbGxTbGlkZXInLFxuICAgIHJpZ2h0OiAnY2FsbFNsaWRlcicsXG4gICAgc2hvd0Fycm93czogJ2NhbGxTbGlkZXInLFxuICAgIHZlcnRpY2FsOiAnY2FsbFNsaWRlcicsXG4gICAgJyR2dWV0aWZ5LmFwcGxpY2F0aW9uLmxlZnQnOiAnb25SZXNpemUnLFxuICAgICckdnVldGlmeS5hcHBsaWNhdGlvbi5yaWdodCc6ICdvblJlc2l6ZScsXG4gICAgJyR2dWV0aWZ5LnJ0bCc6ICdvblJlc2l6ZScsXG4gICAgbW9kZWxWYWx1ZSAodmFsOiBhbnkpIHtcbiAgICAgIHRoaXMudmFsaWRhdGVNb2RlbFZhbHVlKHZhbClcbiAgICB9LFxuICB9LFxuXG4gIG1vdW50ZWQgKCkge1xuICAgIHRoaXMudmFsaWRhdGVNb2RlbFZhbHVlKHRoaXMubW9kZWxWYWx1ZSlcblxuICAgIGlmICh0eXBlb2YgUmVzaXplT2JzZXJ2ZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCBvYnMgPSBuZXcgUmVzaXplT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICB0aGlzLm9uUmVzaXplKClcbiAgICAgIH0pXG4gICAgICBvYnMub2JzZXJ2ZSh0aGlzLiRlbClcbiAgICAgIHRoaXMuJG9uKCdob29rOmRlc3Ryb3llZCcsICgpID0+IHtcbiAgICAgICAgb2JzLmRpc2Nvbm5lY3QoKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dCh0aGlzLmNhbGxTbGlkZXIsIDMwKVxuICAgIH0pXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIHZhbGlkYXRlTW9kZWxWYWx1ZSAodmFsOiBhbnkpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJyAmJiB2YWwgPCAwKSB7XG4gICAgICAgIHRoaXMuaW50ZXJuYWxWYWx1ZSA9IDBcbiAgICAgIH1cbiAgICB9LFxuICAgIGNhbGxTbGlkZXIgKCkge1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzLmhpZGVTbGlkZXIgfHxcbiAgICAgICAgIXRoaXMuJHJlZnMuaXRlbXMgfHxcbiAgICAgICAgIXRoaXMuJHJlZnMuaXRlbXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGhcbiAgICAgICkge1xuICAgICAgICB0aGlzLnNsaWRlci53aWR0aCA9IDBcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgLy8gR2l2ZSBzY3JlZW4gdGltZSB0byBwYWludFxuICAgICAgICBjb25zdCBhY3RpdmVUYWIgPSB0aGlzLiRyZWZzLml0ZW1zLnNlbGVjdGVkSXRlbXNbMF1cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmICghYWN0aXZlVGFiIHx8ICFhY3RpdmVUYWIuJGVsKSB7XG4gICAgICAgICAgdGhpcy5zbGlkZXIud2lkdGggPSAwXG4gICAgICAgICAgdGhpcy5zbGlkZXIubGVmdCA9IDBcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBlbCA9IGFjdGl2ZVRhYi4kZWwgYXMgSFRNTEVsZW1lbnRcblxuICAgICAgICB0aGlzLnNsaWRlciA9IHtcbiAgICAgICAgICBoZWlnaHQ6ICF0aGlzLnZlcnRpY2FsID8gTnVtYmVyKHRoaXMuc2xpZGVyU2l6ZSkgOiBlbC5zY3JvbGxIZWlnaHQsXG4gICAgICAgICAgbGVmdDogdGhpcy52ZXJ0aWNhbCA/IDAgOiBlbC5vZmZzZXRMZWZ0LFxuICAgICAgICAgIHJpZ2h0OiB0aGlzLnZlcnRpY2FsID8gMCA6IGVsLm9mZnNldExlZnQgKyBlbC5vZmZzZXRXaWR0aCxcbiAgICAgICAgICB0b3A6IGVsLm9mZnNldFRvcCxcbiAgICAgICAgICB3aWR0aDogdGhpcy52ZXJ0aWNhbCA/IE51bWJlcih0aGlzLnNsaWRlclNpemUpIDogZWwuc2Nyb2xsV2lkdGgsXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSxcbiAgICBnZW5CYXIgKGl0ZW1zOiBWTm9kZVtdLCBzbGlkZXI6IFZOb2RlIHwgbnVsbCkge1xuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBoZWlnaHQ6IGNvbnZlcnRUb1VuaXQodGhpcy5oZWlnaHQpLFxuICAgICAgICB9LFxuICAgICAgICBhY3RpdmVDbGFzczogdGhpcy5hY3RpdmVDbGFzcyxcbiAgICAgICAgY2VudGVyQWN0aXZlOiB0aGlzLmNlbnRlckFjdGl2ZSxcbiAgICAgICAgZGFyazogdGhpcy5kYXJrLFxuICAgICAgICBsaWdodDogdGhpcy5saWdodCxcbiAgICAgICAgbWFuZGF0b3J5OiAhdGhpcy5vcHRpb25hbCxcbiAgICAgICAgbW9iaWxlQnJlYWtwb2ludDogdGhpcy5tb2JpbGVCcmVha3BvaW50LFxuICAgICAgICBuZXh0SWNvbjogdGhpcy5uZXh0SWNvbixcbiAgICAgICAgcHJldkljb246IHRoaXMucHJldkljb24sXG4gICAgICAgIHNob3dBcnJvd3M6IHRoaXMuc2hvd0Fycm93cyxcbiAgICAgICAgbW9kZWxWYWx1ZTogdGhpcy5pbnRlcm5hbFZhbHVlLFxuICAgICAgICAnb25DYWxsOnNsaWRlcic6IHRoaXMuY2FsbFNsaWRlcixcbiAgICAgICAgJ29uVXBkYXRlOm1vZGVsVmFsdWUnOiAodmFsOiBhbnkpID0+IHtcbiAgICAgICAgICB0aGlzLmludGVybmFsVmFsdWUgPSB2YWxcbiAgICAgICAgfSxcbiAgICAgICAgcmVmOiAnaXRlbXMnLFxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFRleHRDb2xvcih0aGlzLmNvbXB1dGVkQ29sb3IsIGRhdGEpXG4gICAgICB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmJhY2tncm91bmRDb2xvciwgZGF0YSlcblxuICAgICAgcmV0dXJuIGgoVlRhYnNCYXIsIGRhdGEsICgpID0+IFtcbiAgICAgICAgdGhpcy5nZW5TbGlkZXIoc2xpZGVyKSxcbiAgICAgICAgaXRlbXMsXG4gICAgICBdKVxuICAgIH0sXG4gICAgZ2VuSXRlbXMgKGl0ZW1zOiBWTm9kZSB8IG51bGwsIGl0ZW06IFZOb2RlW10pIHtcbiAgICAgIC8vIElmIHVzZXIgcHJvdmlkZXMgaXRlbXNcbiAgICAgIC8vIG9wdCB0byB1c2UgdGhlaXJzXG4gICAgICBpZiAoaXRlbXMpIHJldHVybiBpdGVtc1xuXG4gICAgICAvLyBJZiBubyB0YWJzIGFyZSBwcm92aWRlZFxuICAgICAgLy8gcmVuZGVyIG5vdGhpbmdcbiAgICAgIGlmICghaXRlbS5sZW5ndGgpIHJldHVybiBudWxsXG5cbiAgICAgIHJldHVybiBoKFZUYWJzSXRlbXMsIHtcbiAgICAgICAgbW9kZWxWYWx1ZTogdGhpcy5pbnRlcm5hbFZhbHVlLFxuICAgICAgICAnb25VcGRhdGU6bW9kZWxWYWx1ZSc6ICh2YWw6IGFueSkgPT4ge1xuICAgICAgICAgIHRoaXMuaW50ZXJuYWxWYWx1ZSA9IHZhbFxuICAgICAgICB9LFxuICAgICAgfSwgKCkgPT4gaXRlbSlcbiAgICB9LFxuICAgIGdlblNsaWRlciAoc2xpZGVyOiBWTm9kZSB8IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmhpZGVTbGlkZXIpIHJldHVybiBudWxsXG5cbiAgICAgIGlmICghc2xpZGVyKSB7XG4gICAgICAgIHNsaWRlciA9IGgoVlRhYnNTbGlkZXIsIHtcbiAgICAgICAgICBjb2xvcjogdGhpcy5zbGlkZXJDb2xvcixcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6ICd2LXRhYnMtc2xpZGVyLXdyYXBwZXInLFxuICAgICAgICBzdHlsZTogdGhpcy5zbGlkZXJTdHlsZXMsXG4gICAgICB9LCBbc2xpZGVyXSlcbiAgICB9LFxuICAgIG9uUmVzaXplICgpIHtcbiAgICAgIGlmICh0aGlzLl9pc0Rlc3Ryb3llZCkgcmV0dXJuXG5cbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnJlc2l6ZVRpbWVvdXQpXG4gICAgICB0aGlzLnJlc2l6ZVRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dCh0aGlzLmNhbGxTbGlkZXIsIDApXG4gICAgfSxcbiAgICBwYXJzZU5vZGVzICgpIHtcbiAgICAgIGxldCBpdGVtcyA9IG51bGxcbiAgICAgIGxldCBzbGlkZXIgPSBudWxsXG4gICAgICBjb25zdCBpdGVtID0gW11cbiAgICAgIGNvbnN0IHRhYiA9IFtdXG4gICAgICBjb25zdCBzbG90ID0gZ2V0U2xvdCh0aGlzKSB8fCBbXVxuICAgICAgY29uc3QgbGVuZ3RoID0gc2xvdC5sZW5ndGhcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCB2bm9kZSA9IHNsb3RbaV1cblxuICAgICAgICBpZiAodm5vZGUudHlwZSkge1xuICAgICAgICAgIHN3aXRjaCAodm5vZGUudHlwZS5uYW1lKSB7XG4gICAgICAgICAgICBjYXNlICd2LXRhYnMtc2xpZGVyJzogc2xpZGVyID0gdm5vZGVcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3YtdGFicy1pdGVtcyc6IGl0ZW1zID0gdm5vZGVcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3YtdGFiLWl0ZW0nOiBpdGVtLnB1c2godm5vZGUpXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAvLyBjYXNlICd2LXRhYicgLSBpbnRlbnRpb25hbGx5IG9taXR0ZWRcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRhYi5wdXNoKHZub2RlKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YWIucHVzaCh2bm9kZSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIHRhYjogYXJyYXkgb2YgYHYtdGFiYFxuICAgICAgICogc2xpZGVyOiBzaW5nbGUgYHYtdGFicy1zbGlkZXJgXG4gICAgICAgKiBpdGVtczogc2luZ2xlIGB2LXRhYnMtaXRlbXNgXG4gICAgICAgKiBpdGVtOiBhcnJheSBvZiBgdi10YWItaXRlbWBcbiAgICAgICAqL1xuICAgICAgcmV0dXJuIHsgdGFiLCBzbGlkZXIsIGl0ZW1zLCBpdGVtIH1cbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoKTogVk5vZGUge1xuICAgIGNvbnN0IHsgdGFiLCBzbGlkZXIsIGl0ZW1zLCBpdGVtIH0gPSB0aGlzLnBhcnNlTm9kZXMoKVxuXG4gICAgcmV0dXJuIHdpdGhEaXJlY3RpdmVzKGgoJ2RpdicsIHtcbiAgICAgIGNsYXNzOiBbJ3YtdGFicycsIHRoaXMuY2xhc3Nlc10sXG4gICAgfSwgW1xuICAgICAgdGhpcy5nZW5CYXIodGFiLCBzbGlkZXIpLFxuICAgICAgdGhpcy5nZW5JdGVtcyhpdGVtcywgaXRlbSksXG4gICAgXSksIFtcbiAgICAgIFtcbiAgICAgICAgUmVzaXplLFxuICAgICAgICB0aGlzLm9uUmVzaXplLFxuICAgICAgICAnJyxcbiAgICAgICAgeyBxdWlldDogdHJ1ZSB9LFxuICAgICAgXSxcbiAgICBdKVxuICB9LFxufSlcbiJdfQ==