// Styles
import './VCarousel.sass';
// Extensions
import VWindow from '../VWindow/VWindow';
// Components
import VBtn from '../VBtn';
import VIcon from '../VIcon';
import VProgressLinear from '../VProgressLinear';
// Mixins
// TODO: Move this into core components v2.0
import ButtonGroup from '../../mixins/button-group';
// Utilities
import { convertToUnit } from '../../util/helpers';
import { breaking } from '../../util/console';
// Types
import { h, defineComponent } from 'vue';
export default defineComponent({
    name: 'v-carousel',
    extends: VWindow,
    // pass down the parent's theme
    provide() {
        return {
            parentTheme: this.theme,
        };
    },
    props: {
        continuous: {
            type: Boolean,
            default: true,
        },
        cycle: Boolean,
        delimiterIcon: {
            type: String,
            default: '$delimiter',
        },
        height: {
            type: [Number, String],
            default: 500,
        },
        hideDelimiters: Boolean,
        hideDelimiterBackground: Boolean,
        interval: {
            type: [Number, String],
            default: 6000,
            validator: (value) => value > 0,
        },
        mandatory: {
            type: Boolean,
            default: true,
        },
        progress: Boolean,
        progressColor: String,
        showArrows: {
            type: Boolean,
            default: true,
        },
        verticalDelimiters: {
            type: String,
            default: undefined,
        },
    },
    emits: [
        'update:modelValue',
        'change',
    ],
    data() {
        return {
            internalHeight: this.height,
            slideTimeout: undefined,
        };
    },
    computed: {
        classes() {
            return {
                ...VWindow.computed.classes.call(this),
                'v-carousel': true,
                'v-carousel--hide-delimiter-background': this.hideDelimiterBackground,
                'v-carousel--vertical-delimiters': this.isVertical,
            };
        },
        isDark() {
            return this.dark || !this.light;
        },
        isVertical() {
            return this.verticalDelimiters != null;
        },
    },
    watch: {
        internalValue: 'restartTimeout',
        interval: 'restartTimeout',
        height(val, oldVal) {
            if (val === oldVal || !val)
                return;
            this.internalHeight = val;
        },
        cycle(val) {
            if (val) {
                this.restartTimeout();
            }
            else {
                clearTimeout(this.slideTimeout);
                this.slideTimeout = undefined;
            }
        },
    },
    created() {
        /* istanbul ignore next */
        if (this.$attrs.hasOwnProperty('hide-controls')) {
            breaking('hide-controls', ':show-arrows="false"', this);
        }
    },
    mounted() {
        this.startTimeout();
    },
    methods: {
        genControlIcons() {
            if (this.isVertical)
                return null;
            return VWindow.methods.genControlIcons.call(this);
        },
        genDelimiters() {
            return h('div', {
                class: 'v-carousel__controls',
                style: {
                    left: this.verticalDelimiters === 'left' && this.isVertical ? 0 : 'auto',
                    right: this.verticalDelimiters === 'right' ? 0 : 'auto',
                },
            }, [this.genItems()]);
        },
        genItems() {
            const length = this.items.length;
            const children = [];
            for (let i = 0; i < length; i++) {
                const child = h(VBtn, {
                    class: 'v-carousel__controls__item',
                    'aria-label': this.$vuetify.lang.t('$vuetify.carousel.ariaLabel.delimiter', i + 1, length),
                    icon: true,
                    small: true,
                    value: this.getValue(this.items[i], i),
                    key: i,
                }, () => [
                    h(VIcon, {
                        size: 18
                    }, () => this.delimiterIcon),
                ]);
                children.push(child);
            }
            return h(ButtonGroup, {
                modelValue: this.internalValue,
                mandatory: this.mandatory,
                onChange: (val) => {
                    this.internalValue = val;
                }
            }, () => children);
        },
        genProgress() {
            return h(VProgressLinear, {
                class: 'v-carousel__progress',
                color: this.progressColor,
                value: (this.internalIndex + 1) / this.items.length * 100,
            });
        },
        restartTimeout() {
            this.slideTimeout && clearTimeout(this.slideTimeout);
            this.slideTimeout = undefined;
            window.requestAnimationFrame(this.startTimeout);
        },
        startTimeout() {
            if (!this.cycle)
                return;
            this.slideTimeout = window.setTimeout(this.next, +this.interval > 0 ? +this.interval : 6000);
        },
    },
    render() {
        const render = VWindow.render.call(this, h);
        render.style = `height: ${convertToUnit(this.height)};`;
        /* istanbul ignore else */
        if (!this.hideDelimiters) {
            render.children.push(this.genDelimiters());
        }
        /* istanbul ignore else */
        if (this.progress || this.progressColor) {
            render.children.push(this.genProgress());
        }
        return render;
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNhcm91c2VsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkNhcm91c2VsL1ZDYXJvdXNlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxrQkFBa0IsQ0FBQTtBQUV6QixhQUFhO0FBQ2IsT0FBTyxPQUFPLE1BQU0sb0JBQW9CLENBQUE7QUFFeEMsYUFBYTtBQUNiLE9BQU8sSUFBSSxNQUFNLFNBQVMsQ0FBQTtBQUMxQixPQUFPLEtBQUssTUFBTSxVQUFVLENBQUE7QUFDNUIsT0FBTyxlQUFlLE1BQU0sb0JBQW9CLENBQUE7QUFFaEQsU0FBUztBQUNULDRDQUE0QztBQUM1QyxPQUFPLFdBQVcsTUFBTSwyQkFBMkIsQ0FBQTtBQUVuRCxZQUFZO0FBQ1osT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2xELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUU3QyxRQUFRO0FBQ1IsT0FBTyxFQUFFLENBQUMsRUFBbUIsZUFBZSxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBRXpELGVBQWUsZUFBZSxDQUFDO0lBQzdCLElBQUksRUFBRSxZQUFZO0lBQ2xCLE9BQU8sRUFBRSxPQUFPO0lBRWhCLCtCQUErQjtJQUMvQixPQUFPO1FBQ0wsT0FBTztZQUNMLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSztTQUN4QixDQUFBO0lBQ0gsQ0FBQztJQUVELEtBQUssRUFBRTtRQUNMLFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLElBQUk7U0FDZDtRQUNELEtBQUssRUFBRSxPQUFPO1FBQ2QsYUFBYSxFQUFFO1lBQ2IsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsWUFBWTtTQUN0QjtRQUNELE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxF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LENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQTtRQUV2RCwwQkFBMEI7UUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDeEIsTUFBTSxDQUFDLFFBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUE7U0FDNUM7UUFFRCwwQkFBMEI7UUFDMUIsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdkMsTUFBTSxDQUFDLFFBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUE7U0FDMUM7UUFFRCxPQUFPLE1BQU0sQ0FBQTtJQUNmLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcbmltcG9ydCAnLi9WQ2Fyb3VzZWwuc2FzcydcblxuLy8gRXh0ZW5zaW9uc1xuaW1wb3J0IFZXaW5kb3cgZnJvbSAnLi4vVldpbmRvdy9WV2luZG93J1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgVkJ0biBmcm9tICcuLi9WQnRuJ1xuaW1wb3J0IFZJY29uIGZyb20gJy4uL1ZJY29uJ1xuaW1wb3J0IFZQcm9ncmVzc0xpbmVhciBmcm9tICcuLi9WUHJvZ3Jlc3NMaW5lYXInXG5cbi8vIE1peGluc1xuLy8gVE9ETzogTW92ZSB0aGlzIGludG8gY29yZSBjb21wb25lbnRzIHYyLjBcbmltcG9ydCBCdXR0b25Hcm91cCBmcm9tICcuLi8uLi9taXhpbnMvYnV0dG9uLWdyb3VwJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCB7IGNvbnZlcnRUb1VuaXQgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5pbXBvcnQgeyBicmVha2luZyB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcblxuLy8gVHlwZXNcbmltcG9ydCB7IGgsIFZOb2RlLCBQcm9wVHlwZSwgZGVmaW5lQ29tcG9uZW50IH0gZnJvbSAndnVlJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb21wb25lbnQoe1xuICBuYW1lOiAndi1jYXJvdXNlbCcsXG4gIGV4dGVuZHM6IFZXaW5kb3csXG5cbiAgLy8gcGFzcyBkb3duIHRoZSBwYXJlbnQncyB0aGVtZVxuICBwcm92aWRlICgpOiBvYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICBwYXJlbnRUaGVtZTogdGhpcy50aGVtZSxcbiAgICB9XG4gIH0sXG5cbiAgcHJvcHM6IHtcbiAgICBjb250aW51b3VzOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB9LFxuICAgIGN5Y2xlOiBCb29sZWFuLFxuICAgIGRlbGltaXRlckljb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckZGVsaW1pdGVyJyxcbiAgICB9LFxuICAgIGhlaWdodDoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDUwMCxcbiAgICB9LFxuICAgIGhpZGVEZWxpbWl0ZXJzOiBCb29sZWFuLFxuICAgIGhpZGVEZWxpbWl0ZXJCYWNrZ3JvdW5kOiBCb29sZWFuLFxuICAgIGludGVydmFsOiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogNjAwMCxcbiAgICAgIHZhbGlkYXRvcjogKHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpID0+IHZhbHVlID4gMCxcbiAgICB9LFxuICAgIG1hbmRhdG9yeToge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgICBwcm9ncmVzczogQm9vbGVhbixcbiAgICBwcm9ncmVzc0NvbG9yOiBTdHJpbmcsXG4gICAgc2hvd0Fycm93czoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgICB2ZXJ0aWNhbERlbGltaXRlcnM6IHtcbiAgICAgIHR5cGU6IFN0cmluZyBhcyBQcm9wVHlwZTwnJyB8ICdsZWZ0JyB8ICdyaWdodCc+LFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgIH0sXG4gIH0sXG5cbiAgZW1pdHM6IFtcbiAgICAndXBkYXRlOm1vZGVsVmFsdWUnLFxuICAgICdjaGFuZ2UnLFxuICBdLFxuXG4gIGRhdGEgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpbnRlcm5hbEhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICBzbGlkZVRpbWVvdXQ6IHVuZGVmaW5lZCBhcyBudW1iZXIgfCB1bmRlZmluZWQsXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLlZXaW5kb3cuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi1jYXJvdXNlbCc6IHRydWUsXG4gICAgICAgICd2LWNhcm91c2VsLS1oaWRlLWRlbGltaXRlci1iYWNrZ3JvdW5kJzogdGhpcy5oaWRlRGVsaW1pdGVyQmFja2dyb3VuZCxcbiAgICAgICAgJ3YtY2Fyb3VzZWwtLXZlcnRpY2FsLWRlbGltaXRlcnMnOiB0aGlzLmlzVmVydGljYWwsXG4gICAgICB9XG4gICAgfSxcbiAgICBpc0RhcmsgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuZGFyayB8fCAhdGhpcy5saWdodFxuICAgIH0sXG4gICAgaXNWZXJ0aWNhbCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy52ZXJ0aWNhbERlbGltaXRlcnMgIT0gbnVsbFxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBpbnRlcm5hbFZhbHVlOiAncmVzdGFydFRpbWVvdXQnLFxuICAgIGludGVydmFsOiAncmVzdGFydFRpbWVvdXQnLFxuICAgIGhlaWdodCAodmFsLCBvbGRWYWwpIHtcbiAgICAgIGlmICh2YWwgPT09IG9sZFZhbCB8fCAhdmFsKSByZXR1cm5cbiAgICAgIHRoaXMuaW50ZXJuYWxIZWlnaHQgPSB2YWxcbiAgICB9LFxuICAgIGN5Y2xlICh2YWwpIHtcbiAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgdGhpcy5yZXN0YXJ0VGltZW91dCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5zbGlkZVRpbWVvdXQpXG4gICAgICAgIHRoaXMuc2xpZGVUaW1lb3V0ID0gdW5kZWZpbmVkXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICBjcmVhdGVkICgpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmICh0aGlzLiRhdHRycy5oYXNPd25Qcm9wZXJ0eSgnaGlkZS1jb250cm9scycpKSB7XG4gICAgICBicmVha2luZygnaGlkZS1jb250cm9scycsICc6c2hvdy1hcnJvd3M9XCJmYWxzZVwiJywgdGhpcylcbiAgICB9XG4gIH0sXG5cbiAgbW91bnRlZCAoKSB7XG4gICAgdGhpcy5zdGFydFRpbWVvdXQoKVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5Db250cm9sSWNvbnMgKCkge1xuICAgICAgaWYgKHRoaXMuaXNWZXJ0aWNhbCkgcmV0dXJuIG51bGxcblxuICAgICAgcmV0dXJuIFZXaW5kb3cubWV0aG9kcy5nZW5Db250cm9sSWNvbnMuY2FsbCh0aGlzKVxuICAgIH0sXG4gICAgZ2VuRGVsaW1pdGVycyAoKTogVk5vZGUge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6ICd2LWNhcm91c2VsX19jb250cm9scycsXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgbGVmdDogdGhpcy52ZXJ0aWNhbERlbGltaXRlcnMgPT09ICdsZWZ0JyAmJiB0aGlzLmlzVmVydGljYWwgPyAwIDogJ2F1dG8nLFxuICAgICAgICAgIHJpZ2h0OiB0aGlzLnZlcnRpY2FsRGVsaW1pdGVycyA9PT0gJ3JpZ2h0JyA/IDAgOiAnYXV0bycsXG4gICAgICAgIH0sXG4gICAgICB9LCBbdGhpcy5nZW5JdGVtcygpXSlcbiAgICB9LFxuICAgIGdlbkl0ZW1zICgpOiBWTm9kZSB7XG4gICAgICBjb25zdCBsZW5ndGggPSB0aGlzLml0ZW1zLmxlbmd0aFxuICAgICAgY29uc3QgY2hpbGRyZW4gPSBbXVxuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkID0gaChWQnRuLCB7XG4gICAgICAgICAgY2xhc3M6ICd2LWNhcm91c2VsX19jb250cm9sc19faXRlbScsXG4gICAgICAgICAgJ2FyaWEtbGFiZWwnOiB0aGlzLiR2dWV0aWZ5LmxhbmcudCgnJHZ1ZXRpZnkuY2Fyb3VzZWwuYXJpYUxhYmVsLmRlbGltaXRlcicsIGkgKyAxLCBsZW5ndGgpLFxuICAgICAgICAgIGljb246IHRydWUsXG4gICAgICAgICAgc21hbGw6IHRydWUsXG4gICAgICAgICAgdmFsdWU6IHRoaXMuZ2V0VmFsdWUodGhpcy5pdGVtc1tpXSwgaSksXG4gICAgICAgICAga2V5OiBpLFxuICAgICAgICB9LCAoKSA9PiBbXG4gICAgICAgICAgaChWSWNvbiwge1xuICAgICAgICAgICAgc2l6ZTogMThcbiAgICAgICAgICB9LCAoKSA9PiB0aGlzLmRlbGltaXRlckljb24pLFxuICAgICAgICBdKVxuXG4gICAgICAgIGNoaWxkcmVuLnB1c2goY2hpbGQpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoKEJ1dHRvbkdyb3VwLCB7XG4gICAgICAgIG1vZGVsVmFsdWU6IHRoaXMuaW50ZXJuYWxWYWx1ZSxcbiAgICAgICAgbWFuZGF0b3J5OiB0aGlzLm1hbmRhdG9yeSxcbiAgICAgICAgb25DaGFuZ2U6ICh2YWw6IHVua25vd24pID0+IHtcbiAgICAgICAgICB0aGlzLmludGVybmFsVmFsdWUgPSB2YWxcbiAgICAgICAgfVxuICAgICAgfSwgKCkgPT4gY2hpbGRyZW4pXG4gICAgfSxcbiAgICBnZW5Qcm9ncmVzcyAoKSB7XG4gICAgICByZXR1cm4gaChWUHJvZ3Jlc3NMaW5lYXIsIHtcbiAgICAgICAgY2xhc3M6ICd2LWNhcm91c2VsX19wcm9ncmVzcycsXG4gICAgICAgIGNvbG9yOiB0aGlzLnByb2dyZXNzQ29sb3IsXG4gICAgICAgIHZhbHVlOiAodGhpcy5pbnRlcm5hbEluZGV4ICsgMSkgLyB0aGlzLml0ZW1zLmxlbmd0aCAqIDEwMCxcbiAgICAgIH0pXG4gICAgfSxcbiAgICByZXN0YXJ0VGltZW91dCAoKSB7XG4gICAgICB0aGlzLnNsaWRlVGltZW91dCAmJiBjbGVhclRpbWVvdXQodGhpcy5zbGlkZVRpbWVvdXQpXG4gICAgICB0aGlzLnNsaWRlVGltZW91dCA9IHVuZGVmaW5lZFxuXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuc3RhcnRUaW1lb3V0KVxuICAgIH0sXG4gICAgc3RhcnRUaW1lb3V0ICgpIHtcbiAgICAgIGlmICghdGhpcy5jeWNsZSkgcmV0dXJuXG5cbiAgICAgIHRoaXMuc2xpZGVUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQodGhpcy5uZXh0LCArdGhpcy5pbnRlcnZhbCA+IDAgPyArdGhpcy5pbnRlcnZhbCA6IDYwMDApXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKCk6IFZOb2RlIHtcbiAgICBjb25zdCByZW5kZXIgPSBWV2luZG93LnJlbmRlci5jYWxsKHRoaXMsIGgpXG5cbiAgICByZW5kZXIuc3R5bGUgPSBgaGVpZ2h0OiAke2NvbnZlcnRUb1VuaXQodGhpcy5oZWlnaHQpfTtgXG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmICghdGhpcy5oaWRlRGVsaW1pdGVycykge1xuICAgICAgcmVuZGVyLmNoaWxkcmVuIS5wdXNoKHRoaXMuZ2VuRGVsaW1pdGVycygpKVxuICAgIH1cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgaWYgKHRoaXMucHJvZ3Jlc3MgfHwgdGhpcy5wcm9ncmVzc0NvbG9yKSB7XG4gICAgICByZW5kZXIuY2hpbGRyZW4hLnB1c2godGhpcy5nZW5Qcm9ncmVzcygpKVxuICAgIH1cblxuICAgIHJldHVybiByZW5kZXJcbiAgfSxcbn0pXG4iXX0=