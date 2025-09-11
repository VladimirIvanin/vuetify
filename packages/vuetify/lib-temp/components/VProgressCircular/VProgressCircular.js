import { h, withDirectives } from 'vue';
// Styles
import './VProgressCircular.sass';
// Directives
import { Intersect } from '../../directives/intersect';
// Mixins
import Colorable from '../../mixins/colorable';
// Utils
import { convertToUnit, getSlot } from '../../util/helpers';
// Types
import { defineComponent } from 'vue';
/* @vue/component */
export default defineComponent({
    name: 'v-progress-circular',
    extends: Colorable,
    props: {
        button: Boolean,
        indeterminate: Boolean,
        rotate: {
            type: [Number, String],
            default: 0,
        },
        size: {
            type: [Number, String],
            default: 32,
        },
        width: {
            type: [Number, String],
            default: 4,
        },
        value: {
            type: [Number, String],
            default: 0,
        },
    },
    data: () => ({
        radius: 20,
        isVisible: true,
    }),
    computed: {
        calculatedSize() {
            return Number(this.size) + (this.button ? 8 : 0);
        },
        circumference() {
            return 2 * Math.PI * this.radius;
        },
        classes() {
            return {
                'v-progress-circular--visible': this.isVisible,
                'v-progress-circular--indeterminate': this.indeterminate,
                'v-progress-circular--button': this.button,
            };
        },
        normalizedValue() {
            const numValue = parseFloat(this.value);
            if (numValue < 0) {
                return 0;
            }
            if (numValue > 100) {
                return 100;
            }
            return numValue;
        },
        strokeDashArray() {
            return Math.round(this.circumference * 1000) / 1000;
        },
        strokeDashOffset() {
            return ((100 - this.normalizedValue) / 100) * this.circumference + 'px';
        },
        strokeWidth() {
            return Number(this.width) / +this.size * this.viewBoxSize * 2;
        },
        styles() {
            return {
                height: convertToUnit(this.calculatedSize),
                width: convertToUnit(this.calculatedSize),
            };
        },
        svgStyles() {
            return {
                transform: `rotate(${Number(this.rotate)}deg)`,
            };
        },
        viewBoxSize() {
            return this.radius / (1 - Number(this.width) / +this.size);
        },
    },
    methods: {
        genCircle(name, offset) {
            return h('circle', {
                class: `v-progress-circular__${name}`,
                fill: 'transparent',
                cx: 2 * this.viewBoxSize,
                cy: 2 * this.viewBoxSize,
                r: this.radius,
                'stroke-width': this.strokeWidth,
                'stroke-dasharray': this.strokeDashArray,
                'stroke-dashoffset': offset,
            });
        },
        genSvg() {
            const children = [
                this.indeterminate || this.genCircle('underlay', 0),
                this.genCircle('overlay', this.strokeDashOffset),
            ];
            return h('svg', {
                style: this.svgStyles,
                xmlns: 'http://www.w3.org/2000/svg',
                viewBox: `${this.viewBoxSize} ${this.viewBoxSize} ${2 * this.viewBoxSize} ${2 * this.viewBoxSize}`,
            }, children);
        },
        genInfo() {
            return h('div', {
                class: 'v-progress-circular__info',
            }, getSlot(this));
        },
        onObserve(entries, observer, isIntersecting) {
            this.isVisible = isIntersecting;
        },
    },
    render() {
        return withDirectives(h('div', this.setTextColor(this.color, {
            class: ['v-progress-circular', this.classes],
            role: 'progressbar',
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            'aria-valuenow': this.indeterminate ? undefined : this.normalizedValue,
            style: this.styles,
            ...this.$listeners,
        }), [
            this.genSvg(),
            this.genInfo(),
        ]), [
            [
                Intersect,
                this.onObserve
            ]
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlByb2dyZXNzQ2lyY3VsYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WUHJvZ3Jlc3NDaXJjdWxhci9WUHJvZ3Jlc3NDaXJjdWxhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsQ0FBQyxFQUFFLGNBQWMsRUFBQyxNQUFNLEtBQUssQ0FBQTtBQUNyQyxTQUFTO0FBQ1QsT0FBTywwQkFBMEIsQ0FBQTtBQUVqQyxhQUFhO0FBQ2IsT0FBa0IsRUFBRSxTQUFTLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQTtBQUVqRSxTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsUUFBUTtBQUNSLE9BQU8sRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFM0QsUUFBUTtBQUNSLE9BQU8sRUFBcUIsZUFBZSxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBRXhELG9CQUFvQjtBQUNwQixlQUFlLGVBQWUsQ0FBQztJQUM3QixJQUFJLEVBQUUscUJBQXFCO0lBRTNCLE9BQU8sRUFBRSxTQUFTO0lBR2xCLEtBQUssRUFBRTtRQUNMLE1BQU0sRUFBRSxPQUFPO1FBQ2YsYUFBYSxFQUFFLE9BQU87UUFDdEIsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBQ0QsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsRUFBRTtTQUNaO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVB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Q2xCLEdBQUcsSUFBSSxDQUFDLFVBQVU7U0FDbkIsQ0FBQyxFQUFFO1lBQ0YsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNiLElBQUksQ0FBQyxPQUFPLEVBQUU7U0FDZixDQUFDLEVBQUU7WUFDRjtnQkFDRSxTQUFTO2dCQUNULElBQUksQ0FBQyxTQUFTO2FBQ2Y7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtoLCB3aXRoRGlyZWN0aXZlc30gZnJvbSAndnVlJ1xuLy8gU3R5bGVzXG5pbXBvcnQgJy4vVlByb2dyZXNzQ2lyY3VsYXIuc2FzcydcblxuLy8gRGlyZWN0aXZlc1xuaW1wb3J0IGludGVyc2VjdCwgeyBJbnRlcnNlY3QgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL2ludGVyc2VjdCdcblxuLy8gTWl4aW5zXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXG5cbi8vIFV0aWxzXG5pbXBvcnQgeyBjb252ZXJ0VG9Vbml0LCBnZXRTbG90IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUsIFZOb2RlQ2hpbGQsIGRlZmluZUNvbXBvbmVudCB9IGZyb20gJ3Z1ZSdcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XG4gIG5hbWU6ICd2LXByb2dyZXNzLWNpcmN1bGFyJyxcblxuICBleHRlbmRzOiBDb2xvcmFibGUsXG5cblxuICBwcm9wczoge1xuICAgIGJ1dHRvbjogQm9vbGVhbixcbiAgICBpbmRldGVybWluYXRlOiBCb29sZWFuLFxuICAgIHJvdGF0ZToge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBzaXplOiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogMzIsXG4gICAgfSxcbiAgICB3aWR0aDoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDQsXG4gICAgfSxcbiAgICB2YWx1ZToge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgfSxcblxuICBkYXRhOiAoKSA9PiAoe1xuICAgIHJhZGl1czogMjAsXG4gICAgaXNWaXNpYmxlOiB0cnVlLFxuICB9KSxcblxuICBjb21wdXRlZDoge1xuICAgIGNhbGN1bGF0ZWRTaXplICgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIE51bWJlcih0aGlzLnNpemUpICsgKHRoaXMuYnV0dG9uID8gOCA6IDApXG4gICAgfSxcblxuICAgIGNpcmN1bWZlcmVuY2UgKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gMiAqIE1hdGguUEkgKiB0aGlzLnJhZGl1c1xuICAgIH0sXG5cbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ3YtcHJvZ3Jlc3MtY2lyY3VsYXItLXZpc2libGUnOiB0aGlzLmlzVmlzaWJsZSxcbiAgICAgICAgJ3YtcHJvZ3Jlc3MtY2lyY3VsYXItLWluZGV0ZXJtaW5hdGUnOiB0aGlzLmluZGV0ZXJtaW5hdGUsXG4gICAgICAgICd2LXByb2dyZXNzLWNpcmN1bGFyLS1idXR0b24nOiB0aGlzLmJ1dHRvbixcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgbm9ybWFsaXplZFZhbHVlICgpOiBudW1iZXIge1xuICAgICAgY29uc3QgbnVtVmFsdWUgPSBwYXJzZUZsb2F0KHRoaXMudmFsdWUpXG4gICAgICBpZiAobnVtVmFsdWUgPCAwKSB7XG4gICAgICAgIHJldHVybiAwXG4gICAgICB9XG5cbiAgICAgIGlmIChudW1WYWx1ZSA+IDEwMCkge1xuICAgICAgICByZXR1cm4gMTAwXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudW1WYWx1ZVxuICAgIH0sXG5cbiAgICBzdHJva2VEYXNoQXJyYXkgKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gTWF0aC5yb3VuZCh0aGlzLmNpcmN1bWZlcmVuY2UgKiAxMDAwKSAvIDEwMDBcbiAgICB9LFxuXG4gICAgc3Ryb2tlRGFzaE9mZnNldCAoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAoKDEwMCAtIHRoaXMubm9ybWFsaXplZFZhbHVlKSAvIDEwMCkgKiB0aGlzLmNpcmN1bWZlcmVuY2UgKyAncHgnXG4gICAgfSxcblxuICAgIHN0cm9rZVdpZHRoICgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIE51bWJlcih0aGlzLndpZHRoKSAvICt0aGlzLnNpemUgKiB0aGlzLnZpZXdCb3hTaXplICogMlxuICAgIH0sXG5cbiAgICBzdHlsZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBoZWlnaHQ6IGNvbnZlcnRUb1VuaXQodGhpcy5jYWxjdWxhdGVkU2l6ZSksXG4gICAgICAgIHdpZHRoOiBjb252ZXJ0VG9Vbml0KHRoaXMuY2FsY3VsYXRlZFNpemUpLFxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdmdTdHlsZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0cmFuc2Zvcm06IGByb3RhdGUoJHtOdW1iZXIodGhpcy5yb3RhdGUpfWRlZylgLFxuICAgICAgfVxuICAgIH0sXG5cbiAgICB2aWV3Qm94U2l6ZSAoKTogbnVtYmVyIHtcbiAgICAgIHJldHVybiB0aGlzLnJhZGl1cyAvICgxIC0gTnVtYmVyKHRoaXMud2lkdGgpIC8gK3RoaXMuc2l6ZSlcbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5DaXJjbGUgKG5hbWU6IHN0cmluZywgb2Zmc2V0OiBzdHJpbmcgfCBudW1iZXIpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gaCgnY2lyY2xlJywge1xuICAgICAgICBjbGFzczogYHYtcHJvZ3Jlc3MtY2lyY3VsYXJfXyR7bmFtZX1gLFxuICAgICAgICBmaWxsOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICBjeDogMiAqIHRoaXMudmlld0JveFNpemUsXG4gICAgICAgIGN5OiAyICogdGhpcy52aWV3Qm94U2l6ZSxcbiAgICAgICAgcjogdGhpcy5yYWRpdXMsXG4gICAgICAgICdzdHJva2Utd2lkdGgnOiB0aGlzLnN0cm9rZVdpZHRoLFxuICAgICAgICAnc3Ryb2tlLWRhc2hhcnJheSc6IHRoaXMuc3Ryb2tlRGFzaEFycmF5LFxuICAgICAgICAnc3Ryb2tlLWRhc2hvZmZzZXQnOiBvZmZzZXQsXG4gICAgICB9KVxuICAgIH0sXG4gICAgZ2VuU3ZnICgpOiBWTm9kZSB7XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IFtcbiAgICAgICAgdGhpcy5pbmRldGVybWluYXRlIHx8IHRoaXMuZ2VuQ2lyY2xlKCd1bmRlcmxheScsIDApLFxuICAgICAgICB0aGlzLmdlbkNpcmNsZSgnb3ZlcmxheScsIHRoaXMuc3Ryb2tlRGFzaE9mZnNldCksXG4gICAgICBdIGFzIFZOb2RlQ2hpbGRbXVxuXG4gICAgICByZXR1cm4gaCgnc3ZnJywge1xuICAgICAgICBzdHlsZTogdGhpcy5zdmdTdHlsZXMsXG4gICAgICAgIHhtbG5zOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLFxuICAgICAgICB2aWV3Qm94OiBgJHt0aGlzLnZpZXdCb3hTaXplfSAke3RoaXMudmlld0JveFNpemV9ICR7MiAqIHRoaXMudmlld0JveFNpemV9ICR7MiAqIHRoaXMudmlld0JveFNpemV9YCxcbiAgICAgIH0sIGNoaWxkcmVuKVxuICAgIH0sXG4gICAgZ2VuSW5mbyAoKTogVk5vZGUge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6ICd2LXByb2dyZXNzLWNpcmN1bGFyX19pbmZvJyxcbiAgICAgIH0sIGdldFNsb3QodGhpcykpXG4gICAgfSxcbiAgICBvbk9ic2VydmUgKGVudHJpZXM6IEludGVyc2VjdGlvbk9ic2VydmVyRW50cnlbXSwgb2JzZXJ2ZXI6IEludGVyc2VjdGlvbk9ic2VydmVyLCBpc0ludGVyc2VjdGluZzogYm9vbGVhbikge1xuICAgICAgdGhpcy5pc1Zpc2libGUgPSBpc0ludGVyc2VjdGluZ1xuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgcmV0dXJuIHdpdGhEaXJlY3RpdmVzKGgoJ2RpdicsIHRoaXMuc2V0VGV4dENvbG9yKHRoaXMuY29sb3IsIHtcbiAgICAgIGNsYXNzOiBbJ3YtcHJvZ3Jlc3MtY2lyY3VsYXInLCB0aGlzLmNsYXNzZXNdLFxuICAgICAgcm9sZTogJ3Byb2dyZXNzYmFyJyxcbiAgICAgICdhcmlhLXZhbHVlbWluJzogMCxcbiAgICAgICdhcmlhLXZhbHVlbWF4JzogMTAwLFxuICAgICAgJ2FyaWEtdmFsdWVub3cnOiB0aGlzLmluZGV0ZXJtaW5hdGUgPyB1bmRlZmluZWQgOiB0aGlzLm5vcm1hbGl6ZWRWYWx1ZSxcbiAgICAgIHN0eWxlOiB0aGlzLnN0eWxlcyxcbiAgICAgIC4uLnRoaXMuJGxpc3RlbmVycyxcbiAgICB9KSwgW1xuICAgICAgdGhpcy5nZW5TdmcoKSxcbiAgICAgIHRoaXMuZ2VuSW5mbygpLFxuICAgIF0pLCBbXG4gICAgICBbXG4gICAgICAgIEludGVyc2VjdCxcbiAgICAgICAgdGhpcy5vbk9ic2VydmVcbiAgICAgIF1cbiAgICBdKVxuICB9LFxufSlcbiJdfQ==