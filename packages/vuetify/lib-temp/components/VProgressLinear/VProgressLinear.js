import { h, withDirectives } from 'vue';
import './VProgressLinear.sass';
// Components
import { VFadeTransition, VSlideXTransition, } from '../transitions';
// Directives
import { Intersect } from '../../directives/intersect';
// Mixins
import Colorable from '../../mixins/colorable';
import { factory as PositionableFactory } from '../../mixins/positionable';
import { factory as ProxyableFactory } from '../../mixins/proxyable';
import Themeable from '../../mixins/themeable';
// Utilities
import { convertToUnit, getSlot } from '../../util/helpers';
import mixins from '../../util/mixins';
const baseMixins = mixins(Colorable, PositionableFactory(['absolute', 'fixed', 'top', 'bottom']), ProxyableFactory('modelValue', 'update:modelValue'), Themeable);
/* @vue/component */
export default baseMixins.extend({
    name: 'v-progress-linear',
    props: {
        active: {
            type: Boolean,
            default: true,
        },
        backgroundColor: {
            type: String,
            default: null,
        },
        backgroundOpacity: {
            type: [Number, String],
            default: null,
        },
        bufferValue: {
            type: [Number, String],
            default: 100,
        },
        color: {
            type: String,
            default: 'primary',
        },
        height: {
            type: [Number, String],
            default: 4,
        },
        indeterminate: Boolean,
        modelValue: {
            type: [Number, String],
            default: 0,
        },
        query: Boolean,
        reverse: Boolean,
        rounded: Boolean,
        stream: Boolean,
        striped: Boolean,
        // Оставляем value для обратной совместимости
        value: {
            type: [Number, String],
            default: 0,
        },
    },
    emits: ['update:modelValue', 'click'],
    data() {
        return {
            internalLazyValue: this.modelValue || this.value || 0,
            isVisible: true,
        };
    },
    computed: {
        __cachedBackground() {
            return h('div', this.setBackgroundColor(this.backgroundColor || this.color, {
                class: 'v-progress-linear__background',
                style: this.backgroundStyle,
            }));
        },
        __cachedBar() {
            return h(this.computedTransition, {}, {
                default: () => [this.__cachedBarType],
            });
        },
        __cachedBarType() {
            return this.indeterminate ? this.__cachedIndeterminate : this.__cachedDeterminate;
        },
        __cachedBuffer() {
            return h('div', {
                class: 'v-progress-linear__buffer',
                style: this.styles,
            });
        },
        __cachedDeterminate() {
            return h('div', this.setBackgroundColor(this.color, {
                class: `v-progress-linear__determinate`,
                style: {
                    width: convertToUnit(this.normalizedValue, '%'),
                },
            }));
        },
        __cachedIndeterminate() {
            return h('div', {
                class: ['v-progress-linear__indeterminate',
                    {
                        'v-progress-linear__indeterminate--active': this.active,
                    },
                ],
            }, [
                this.genProgressBar('long'),
                this.genProgressBar('short'),
            ]);
        },
        __cachedStream() {
            if (!this.stream)
                return null;
            return h('div', this.setTextColor(this.color, {
                class: 'v-progress-linear__stream',
                style: {
                    width: convertToUnit(100 - this.normalizedBuffer, '%'),
                },
            }));
        },
        backgroundStyle() {
            const backgroundOpacity = this.backgroundOpacity == null
                ? (this.backgroundColor ? 1 : 0.3)
                : parseFloat(this.backgroundOpacity);
            return {
                opacity: backgroundOpacity,
                [this.isReversed ? 'right' : 'left']: convertToUnit(this.normalizedValue, '%'),
                width: convertToUnit(Math.max(0, this.normalizedBuffer - this.normalizedValue), '%'),
            };
        },
        classes() {
            return {
                'v-progress-linear--absolute': this.absolute,
                'v-progress-linear--fixed': this.fixed,
                'v-progress-linear--query': this.query,
                'v-progress-linear--reactive': this.reactive,
                'v-progress-linear--reverse': this.isReversed,
                'v-progress-linear--rounded': this.rounded,
                'v-progress-linear--striped': this.striped,
                'v-progress-linear--visible': this.isVisible,
                ...this.themeClasses,
            };
        },
        computedTransition() {
            return this.indeterminate ? VFadeTransition : VSlideXTransition;
        },
        isReversed() {
            return this.$vuetify.rtl !== this.reverse;
        },
        normalizedBuffer() {
            return this.normalize(this.bufferValue);
        },
        normalizedValue() {
            return this.normalize(this.internalLazyValue);
        },
        reactive() {
            return Boolean(this.$listeners.onChange) || Boolean(this.$listeners['onUpdate:modelValue']);
        },
        styles() {
            const styles = {};
            if (!this.active) {
                styles.height = 0;
            }
            if (!this.indeterminate && parseFloat(this.normalizedBuffer) !== 100) {
                styles.width = convertToUnit(this.normalizedBuffer, '%');
            }
            return styles;
        },
    },
    watch: {
        modelValue(val) {
            this.internalLazyValue = val;
        },
        value(val) {
            this.internalLazyValue = val;
        },
    },
    methods: {
        genContent() {
            const slot = getSlot(this, 'default', { value: this.internalLazyValue });
            if (!slot)
                return null;
            return h('div', {
                class: 'v-progress-linear__content',
            }, {
                default: () => slot,
            });
        },
        genListeners() {
            const listeners = this.$listeners;
            if (this.reactive) {
                listeners.onClick = this.onClick;
            }
            return listeners;
        },
        genProgressBar(name) {
            return h('div', this.setBackgroundColor(this.color, {
                class: ['v-progress-linear__indeterminate',
                    {
                        [name]: true,
                    },
                ],
            }));
        },
        onClick(e) {
            if (!this.reactive)
                return;
            const { width } = this.$el.getBoundingClientRect();
            this.internalValue = e.offsetX / width * 100;
        },
        onObserve(entries, observer, isIntersecting) {
            this.isVisible = isIntersecting;
        },
        normalize(value) {
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            if (numValue < 0)
                return 0;
            if (numValue > 100)
                return 100;
            return numValue;
        },
    },
    render() {
        const data = {
            class: ['v-progress-linear', this.classes],
            role: 'progressbar',
            'aria-valuemin': 0,
            'aria-valuemax': this.normalizedBuffer,
            'aria-valuenow': this.indeterminate ? undefined : this.normalizedValue,
            style: {
                bottom: this.bottom ? 0 : undefined,
                height: this.active ? convertToUnit(this.height) : 0,
                top: this.top ? 0 : undefined,
            },
            ...this.genListeners(),
        };
        return withDirectives(h('div', data, [
            this.__cachedStream,
            this.__cachedBackground,
            this.__cachedBuffer,
            this.__cachedBar,
            this.genContent(),
        ]), [
            [
                Intersect,
                this.onObserve,
            ],
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlByb2dyZXNzTGluZWFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlByb2dyZXNzTGluZWFyL1ZQcm9ncmVzc0xpbmVhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxNQUFNLEtBQUssQ0FBQTtBQUN2QyxPQUFPLHdCQUF3QixDQUFBO0FBRS9CLGFBQWE7QUFDYixPQUFPLEVBQ0wsZUFBZSxFQUNmLGlCQUFpQixHQUNsQixNQUFNLGdCQUFnQixDQUFBO0FBRXZCLGFBQWE7QUFDYixPQUFrQixFQUFFLFNBQVMsRUFBRSxNQUFNLDRCQUE0QixDQUFBO0FBRWpFLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLEVBQUUsT0FBTyxJQUFJLG1CQUFtQixFQUFFLE1BQU0sMkJBQTJCLENBQUE7QUFDMUUsT0FBTyxFQUFFLE9BQU8sSUFBSSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFBO0FBQ3BFLE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBRTlDLFlBQVk7QUFDWixPQUFPLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQzNELE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBS3RDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FDdkIsU0FBUyxFQUNULG1CQUFtQixDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFDM0QsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLG1CQUFtQixDQUFDLEVBQ25ELFNBQVMsQ0FDVixDQUFBO0FBRUQsb0JBQW9CO0FBQ3BCLGVBQWUsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUMvQixJQUFJLEVBQUUsbUJBQW1CO0lBR3pCLEtBQUssRUFBRTtRQUNMLE1BQU0sRUFBRTtZQUNOLElBQUks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QUssRUFBRTtnQkFDTCxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO2dCQUNuQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUzthQUM5QjtZQUNELEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRTtTQUN2QixDQUFBO1FBRUQsT0FBTyxjQUFjLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7WUFDbkMsSUFBSSxDQUFDLGNBQWM7WUFDbkIsSUFBSSxDQUFDLGtCQUFrQjtZQUN2QixJQUFJLENBQUMsY0FBYztZQUNuQixJQUFJLENBQUMsV0FBVztZQUNoQixJQUFJLENBQUMsVUFBVSxFQUFFO1NBQ2xCLENBQUMsRUFBRTtZQUNGO2dCQUNFLFNBQVM7Z0JBQ1QsSUFBSSxDQUFDLFNBQVM7YUFDZjtTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoLCB3aXRoRGlyZWN0aXZlcyB9IGZyb20gJ3Z1ZSdcbmltcG9ydCAnLi9WUHJvZ3Jlc3NMaW5lYXIuc2FzcydcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IHtcbiAgVkZhZGVUcmFuc2l0aW9uLFxuICBWU2xpZGVYVHJhbnNpdGlvbixcbn0gZnJvbSAnLi4vdHJhbnNpdGlvbnMnXG5cbi8vIERpcmVjdGl2ZXNcbmltcG9ydCBpbnRlcnNlY3QsIHsgSW50ZXJzZWN0IH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9pbnRlcnNlY3QnXG5cbi8vIE1peGluc1xuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xuaW1wb3J0IHsgZmFjdG9yeSBhcyBQb3NpdGlvbmFibGVGYWN0b3J5IH0gZnJvbSAnLi4vLi4vbWl4aW5zL3Bvc2l0aW9uYWJsZSdcbmltcG9ydCB7IGZhY3RvcnkgYXMgUHJveHlhYmxlRmFjdG9yeSB9IGZyb20gJy4uLy4uL21peGlucy9wcm94eWFibGUnXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IHsgY29udmVydFRvVW5pdCwgZ2V0U2xvdCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgYmFzZU1peGlucyA9IG1peGlucyhcbiAgQ29sb3JhYmxlLFxuICBQb3NpdGlvbmFibGVGYWN0b3J5KFsnYWJzb2x1dGUnLCAnZml4ZWQnLCAndG9wJywgJ2JvdHRvbSddKSxcbiAgUHJveHlhYmxlRmFjdG9yeSgnbW9kZWxWYWx1ZScsICd1cGRhdGU6bW9kZWxWYWx1ZScpLFxuICBUaGVtZWFibGVcbilcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGJhc2VNaXhpbnMuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtcHJvZ3Jlc3MtbGluZWFyJyxcblxuXG4gIHByb3BzOiB7XG4gICAgYWN0aXZlOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB9LFxuICAgIGJhY2tncm91bmRDb2xvcjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICB9LFxuICAgIGJhY2tncm91bmRPcGFjaXR5OiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICB9LFxuICAgIGJ1ZmZlclZhbHVlOiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogMTAwLFxuICAgIH0sXG4gICAgY29sb3I6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdwcmltYXJ5JyxcbiAgICB9LFxuICAgIGhlaWdodDoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDQsXG4gICAgfSxcbiAgICBpbmRldGVybWluYXRlOiBCb29sZWFuLFxuICAgIG1vZGVsVmFsdWU6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgcXVlcnk6IEJvb2xlYW4sXG4gICAgcmV2ZXJzZTogQm9vbGVhbixcbiAgICByb3VuZGVkOiBCb29sZWFuLFxuICAgIHN0cmVhbTogQm9vbGVhbixcbiAgICBzdHJpcGVkOiBCb29sZWFuLFxuICAgIC8vINCe0YHRgtCw0LLQu9GP0LXQvCB2YWx1ZSDQtNC70Y8g0L7QsdGA0LDRgtC90L7QuSDRgdC+0LLQvNC10YHRgtC40LzQvtGB0YLQuFxuICAgIHZhbHVlOiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICB9LFxuXG4gIGVtaXRzOiBbJ3VwZGF0ZTptb2RlbFZhbHVlJywgJ2NsaWNrJ10sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGludGVybmFsTGF6eVZhbHVlOiB0aGlzLm1vZGVsVmFsdWUgfHwgdGhpcy52YWx1ZSB8fCAwLFxuICAgICAgaXNWaXNpYmxlOiB0cnVlLFxuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIF9fY2FjaGVkQmFja2dyb3VuZCAoKTogVk5vZGUge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHRoaXMuc2V0QmFja2dyb3VuZENvbG9yKHRoaXMuYmFja2dyb3VuZENvbG9yIHx8IHRoaXMuY29sb3IsIHtcbiAgICAgICAgY2xhc3M6ICd2LXByb2dyZXNzLWxpbmVhcl9fYmFja2dyb3VuZCcsXG4gICAgICAgIHN0eWxlOiB0aGlzLmJhY2tncm91bmRTdHlsZSxcbiAgICAgIH0pKVxuICAgIH0sXG4gICAgX19jYWNoZWRCYXIgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiBoKHRoaXMuY29tcHV0ZWRUcmFuc2l0aW9uLCB7fSwge1xuICAgICAgICBkZWZhdWx0OiAoKSA9PiBbdGhpcy5fX2NhY2hlZEJhclR5cGVdLFxuICAgICAgfSlcbiAgICB9LFxuICAgIF9fY2FjaGVkQmFyVHlwZSAoKTogVk5vZGUge1xuICAgICAgcmV0dXJuIHRoaXMuaW5kZXRlcm1pbmF0ZSA/IHRoaXMuX19jYWNoZWRJbmRldGVybWluYXRlIDogdGhpcy5fX2NhY2hlZERldGVybWluYXRlXG4gICAgfSxcbiAgICBfX2NhY2hlZEJ1ZmZlciAoKTogVk5vZGUge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6ICd2LXByb2dyZXNzLWxpbmVhcl9fYnVmZmVyJyxcbiAgICAgICAgc3R5bGU6IHRoaXMuc3R5bGVzLFxuICAgICAgfSlcbiAgICB9LFxuICAgIF9fY2FjaGVkRGV0ZXJtaW5hdGUgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiBoKCdkaXYnLCB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmNvbG9yLCB7XG4gICAgICAgIGNsYXNzOiBgdi1wcm9ncmVzcy1saW5lYXJfX2RldGVybWluYXRlYCxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICB3aWR0aDogY29udmVydFRvVW5pdCh0aGlzLm5vcm1hbGl6ZWRWYWx1ZSwgJyUnKSxcbiAgICAgICAgfSxcbiAgICAgIH0pKVxuICAgIH0sXG4gICAgX19jYWNoZWRJbmRldGVybWluYXRlICgpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogWyd2LXByb2dyZXNzLWxpbmVhcl9faW5kZXRlcm1pbmF0ZScsXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ3YtcHJvZ3Jlc3MtbGluZWFyX19pbmRldGVybWluYXRlLS1hY3RpdmUnOiB0aGlzLmFjdGl2ZSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSwgW1xuICAgICAgICB0aGlzLmdlblByb2dyZXNzQmFyKCdsb25nJyksXG4gICAgICAgIHRoaXMuZ2VuUHJvZ3Jlc3NCYXIoJ3Nob3J0JyksXG4gICAgICBdKVxuICAgIH0sXG4gICAgX19jYWNoZWRTdHJlYW0gKCk6IFZOb2RlIHwgbnVsbCB7XG4gICAgICBpZiAoIXRoaXMuc3RyZWFtKSByZXR1cm4gbnVsbFxuXG4gICAgICByZXR1cm4gaCgnZGl2JywgdGhpcy5zZXRUZXh0Q29sb3IodGhpcy5jb2xvciwge1xuICAgICAgICBjbGFzczogJ3YtcHJvZ3Jlc3MtbGluZWFyX19zdHJlYW0nLFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIHdpZHRoOiBjb252ZXJ0VG9Vbml0KDEwMCAtIHRoaXMubm9ybWFsaXplZEJ1ZmZlciwgJyUnKSxcbiAgICAgICAgfSxcbiAgICAgIH0pKVxuICAgIH0sXG4gICAgYmFja2dyb3VuZFN0eWxlICgpOiBvYmplY3Qge1xuICAgICAgY29uc3QgYmFja2dyb3VuZE9wYWNpdHkgPSB0aGlzLmJhY2tncm91bmRPcGFjaXR5ID09IG51bGxcbiAgICAgICAgPyAodGhpcy5iYWNrZ3JvdW5kQ29sb3IgPyAxIDogMC4zKVxuICAgICAgICA6IHBhcnNlRmxvYXQodGhpcy5iYWNrZ3JvdW5kT3BhY2l0eSlcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgb3BhY2l0eTogYmFja2dyb3VuZE9wYWNpdHksXG4gICAgICAgIFt0aGlzLmlzUmV2ZXJzZWQgPyAncmlnaHQnIDogJ2xlZnQnXTogY29udmVydFRvVW5pdCh0aGlzLm5vcm1hbGl6ZWRWYWx1ZSwgJyUnKSxcbiAgICAgICAgd2lkdGg6IGNvbnZlcnRUb1VuaXQoTWF0aC5tYXgoMCwgdGhpcy5ub3JtYWxpemVkQnVmZmVyIC0gdGhpcy5ub3JtYWxpemVkVmFsdWUpLCAnJScpLFxuICAgICAgfVxuICAgIH0sXG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LXByb2dyZXNzLWxpbmVhci0tYWJzb2x1dGUnOiB0aGlzLmFic29sdXRlLFxuICAgICAgICAndi1wcm9ncmVzcy1saW5lYXItLWZpeGVkJzogdGhpcy5maXhlZCxcbiAgICAgICAgJ3YtcHJvZ3Jlc3MtbGluZWFyLS1xdWVyeSc6IHRoaXMucXVlcnksXG4gICAgICAgICd2LXByb2dyZXNzLWxpbmVhci0tcmVhY3RpdmUnOiB0aGlzLnJlYWN0aXZlLFxuICAgICAgICAndi1wcm9ncmVzcy1saW5lYXItLXJldmVyc2UnOiB0aGlzLmlzUmV2ZXJzZWQsXG4gICAgICAgICd2LXByb2dyZXNzLWxpbmVhci0tcm91bmRlZCc6IHRoaXMucm91bmRlZCxcbiAgICAgICAgJ3YtcHJvZ3Jlc3MtbGluZWFyLS1zdHJpcGVkJzogdGhpcy5zdHJpcGVkLFxuICAgICAgICAndi1wcm9ncmVzcy1saW5lYXItLXZpc2libGUnOiB0aGlzLmlzVmlzaWJsZSxcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXMsXG4gICAgICB9XG4gICAgfSxcbiAgICBjb21wdXRlZFRyYW5zaXRpb24gKCk6IGFueSB7XG4gICAgICByZXR1cm4gdGhpcy5pbmRldGVybWluYXRlID8gVkZhZGVUcmFuc2l0aW9uIDogVlNsaWRlWFRyYW5zaXRpb25cbiAgICB9LFxuICAgIGlzUmV2ZXJzZWQgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuJHZ1ZXRpZnkucnRsICE9PSB0aGlzLnJldmVyc2VcbiAgICB9LFxuICAgIG5vcm1hbGl6ZWRCdWZmZXIgKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gdGhpcy5ub3JtYWxpemUodGhpcy5idWZmZXJWYWx1ZSlcbiAgICB9LFxuICAgIG5vcm1hbGl6ZWRWYWx1ZSAoKTogbnVtYmVyIHtcbiAgICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZSh0aGlzLmludGVybmFsTGF6eVZhbHVlKVxuICAgIH0sXG4gICAgcmVhY3RpdmUgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy4kbGlzdGVuZXJzLm9uQ2hhbmdlKSB8fCBCb29sZWFuKHRoaXMuJGxpc3RlbmVyc1snb25VcGRhdGU6bW9kZWxWYWx1ZSddKVxuICAgIH0sXG4gICAgc3R5bGVzICgpOiBvYmplY3Qge1xuICAgICAgY29uc3Qgc3R5bGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge31cblxuICAgICAgaWYgKCF0aGlzLmFjdGl2ZSkge1xuICAgICAgICBzdHlsZXMuaGVpZ2h0ID0gMFxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuaW5kZXRlcm1pbmF0ZSAmJiBwYXJzZUZsb2F0KHRoaXMubm9ybWFsaXplZEJ1ZmZlcikgIT09IDEwMCkge1xuICAgICAgICBzdHlsZXMud2lkdGggPSBjb252ZXJ0VG9Vbml0KHRoaXMubm9ybWFsaXplZEJ1ZmZlciwgJyUnKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3R5bGVzXG4gICAgfSxcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIG1vZGVsVmFsdWUgKHZhbCkge1xuICAgICAgdGhpcy5pbnRlcm5hbExhenlWYWx1ZSA9IHZhbFxuICAgIH0sXG4gICAgdmFsdWUgKHZhbCkge1xuICAgICAgdGhpcy5pbnRlcm5hbExhenlWYWx1ZSA9IHZhbFxuICAgIH0sXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGdlbkNvbnRlbnQgKCkge1xuICAgICAgY29uc3Qgc2xvdCA9IGdldFNsb3QodGhpcywgJ2RlZmF1bHQnLCB7IHZhbHVlOiB0aGlzLmludGVybmFsTGF6eVZhbHVlIH0pXG5cbiAgICAgIGlmICghc2xvdCkgcmV0dXJuIG51bGxcblxuICAgICAgcmV0dXJuIGgoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3M6ICd2LXByb2dyZXNzLWxpbmVhcl9fY29udGVudCcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBkZWZhdWx0OiAoKSA9PiBzbG90LFxuICAgICAgICB9XG4gICAgICApXG4gICAgfSxcbiAgICBnZW5MaXN0ZW5lcnMgKCk6IGFueSB7XG4gICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLiRsaXN0ZW5lcnNcblxuICAgICAgaWYgKHRoaXMucmVhY3RpdmUpIHtcbiAgICAgICAgbGlzdGVuZXJzLm9uQ2xpY2sgPSB0aGlzLm9uQ2xpY2tcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGxpc3RlbmVyc1xuICAgIH0sXG4gICAgZ2VuUHJvZ3Jlc3NCYXIgKG5hbWU6ICdsb25nJyB8ICdzaG9ydCcpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gaCgnZGl2JywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb2xvciwge1xuICAgICAgICBjbGFzczogWyd2LXByb2dyZXNzLWxpbmVhcl9faW5kZXRlcm1pbmF0ZScsXG4gICAgICAgICAge1xuICAgICAgICAgICAgW25hbWVdOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KSlcbiAgICB9LFxuICAgIG9uQ2xpY2sgKGU6IE1vdXNlRXZlbnQpIHtcbiAgICAgIGlmICghdGhpcy5yZWFjdGl2ZSkgcmV0dXJuXG5cbiAgICAgIGNvbnN0IHsgd2lkdGggfSA9IHRoaXMuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICAgIHRoaXMuaW50ZXJuYWxWYWx1ZSA9IGUub2Zmc2V0WCAvIHdpZHRoICogMTAwXG4gICAgfSxcbiAgICBvbk9ic2VydmUgKGVudHJpZXM6IEludGVyc2VjdGlvbk9ic2VydmVyRW50cnlbXSwgb2JzZXJ2ZXI6IEludGVyc2VjdGlvbk9ic2VydmVyLCBpc0ludGVyc2VjdGluZzogYm9vbGVhbikge1xuICAgICAgdGhpcy5pc1Zpc2libGUgPSBpc0ludGVyc2VjdGluZ1xuICAgIH0sXG4gICAgbm9ybWFsaXplICh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgIGNvbnN0IG51bVZhbHVlID0gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IHBhcnNlRmxvYXQodmFsdWUpIDogdmFsdWVcbiAgICAgIGlmIChudW1WYWx1ZSA8IDApIHJldHVybiAwXG4gICAgICBpZiAobnVtVmFsdWUgPiAxMDApIHJldHVybiAxMDBcbiAgICAgIHJldHVybiBudW1WYWx1ZVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgY29uc3QgZGF0YSA9IHtcbiAgICAgIGNsYXNzOiBbJ3YtcHJvZ3Jlc3MtbGluZWFyJywgdGhpcy5jbGFzc2VzXSxcbiAgICAgIHJvbGU6ICdwcm9ncmVzc2JhcicsXG4gICAgICAnYXJpYS12YWx1ZW1pbic6IDAsXG4gICAgICAnYXJpYS12YWx1ZW1heCc6IHRoaXMubm9ybWFsaXplZEJ1ZmZlcixcbiAgICAgICdhcmlhLXZhbHVlbm93JzogdGhpcy5pbmRldGVybWluYXRlID8gdW5kZWZpbmVkIDogdGhpcy5ub3JtYWxpemVkVmFsdWUsXG4gICAgICBzdHlsZToge1xuICAgICAgICBib3R0b206IHRoaXMuYm90dG9tID8gMCA6IHVuZGVmaW5lZCxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLmFjdGl2ZSA/IGNvbnZlcnRUb1VuaXQodGhpcy5oZWlnaHQpIDogMCxcbiAgICAgICAgdG9wOiB0aGlzLnRvcCA/IDAgOiB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgICAgLi4udGhpcy5nZW5MaXN0ZW5lcnMoKSxcbiAgICB9XG5cbiAgICByZXR1cm4gd2l0aERpcmVjdGl2ZXMoaCgnZGl2JywgZGF0YSwgW1xuICAgICAgdGhpcy5fX2NhY2hlZFN0cmVhbSxcbiAgICAgIHRoaXMuX19jYWNoZWRCYWNrZ3JvdW5kLFxuICAgICAgdGhpcy5fX2NhY2hlZEJ1ZmZlcixcbiAgICAgIHRoaXMuX19jYWNoZWRCYXIsXG4gICAgICB0aGlzLmdlbkNvbnRlbnQoKSxcbiAgICBdKSwgW1xuICAgICAgW1xuICAgICAgICBJbnRlcnNlY3QsXG4gICAgICAgIHRoaXMub25PYnNlcnZlLFxuICAgICAgXSxcbiAgICBdKVxuICB9LFxufSlcbiJdfQ==