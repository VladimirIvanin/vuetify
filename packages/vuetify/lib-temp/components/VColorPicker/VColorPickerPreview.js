import { h, defineComponent } from 'vue';
// Styles
import './VColorPickerPreview.sass';
// Components
import VSlider from '../VSlider/VSlider';
// Utilities
import { RGBtoCSS, RGBAtoCSS } from '../../util/colorUtils';
import { fromHSVA } from './util';
export default defineComponent({
    name: 'v-color-picker-preview',
    props: {
        color: {
            type: Object,
            required: true,
        },
        disabled: Boolean,
        hideAlpha: Boolean,
    },
    emits: ['update:color'],
    methods: {
        genAlpha() {
            var _a;
            if (!this.color)
                return h('div');
            return this.genTrack({
                class: 'v-color-picker__alpha',
                thumbColor: 'grey lighten-2',
                hideDetails: true,
                modelValue: this.color.alpha,
                step: 0,
                min: 0,
                max: 1,
                style: {
                    backgroundImage: this.disabled
                        ? undefined
                        : `linear-gradient(to ${((_a = this.$vuetify) === null || _a === void 0 ? void 0 : _a.rtl) ? 'left' : 'right'}, transparent, ${RGBtoCSS(this.color.rgba)})`,
                },
                'onUpdate:modelValue': (val) => {
                    if (this.color && this.color.alpha !== val) {
                        this.$emit('update:color', fromHSVA({ ...this.color.hsva, a: val }));
                    }
                },
            });
        },
        genHue() {
            if (!this.color)
                return h('div');
            return this.genTrack({
                class: 'v-color-picker__hue',
                thumbColor: 'grey lighten-2',
                hideDetails: true,
                modelValue: this.color.hue,
                step: 0,
                min: 0,
                max: 360,
                'onUpdate:modelValue': (val) => {
                    if (this.color && this.color.hue !== val) {
                        this.$emit('update:color', fromHSVA({ ...this.color.hsva, h: val }));
                    }
                },
            });
        },
        genTrack(options) {
            return h(VSlider, {
                class: 'v-color-picker__track',
                disabled: this.disabled,
                ...options,
            });
        },
        genSliders() {
            return h('div', {
                class: 'v-color-picker__sliders',
            }, [
                this.genHue(),
                !this.hideAlpha && this.genAlpha(),
            ]);
        },
        genDot() {
            return h('div', {
                class: 'v-color-picker__dot',
            }, [
                h('div', {
                    style: {
                        background: this.color ? RGBAtoCSS(this.color.rgba) : 'transparent',
                    },
                }),
            ]);
        },
    },
    render() {
        return h('div', {
            class: ['v-color-picker__preview', {
                    'v-color-picker__preview--hide-alpha': this.hideAlpha,
                }],
        }, [
            this.genDot(),
            this.genSliders(),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNvbG9yUGlja2VyUHJldmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZDb2xvclBpY2tlci9WQ29sb3JQaWNrZXJQcmV2aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxDQUFDLEVBQUUsZUFBZSxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBRXhDLFNBQVM7QUFDVCxPQUFPLDRCQUE0QixDQUFBO0FBRW5DLGFBQWE7QUFDYixPQUFPLE9BQU8sTUFBTSxvQkFBb0IsQ0FBQTtBQUV4QyxZQUFZO0FBQ1osT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQTtBQUszRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sUUFBUSxDQUFBO0FBRWpDLGVBQWUsZUFBZSxDQUFDO0lBQzdCLElBQUksRUFBRSx3QkFBd0I7SUFFOUIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLE1BQXFDO1lBQzNDLFFBQVEsRUFBRSxJQUFJO1NBQ2Y7UUFDRCxRQUFRLEVBQUUsT0FBTztRQUNqQixTQUFTLEVBQUUsT0FBTztLQUNuQjtJQUVELEtBQUssRUFBRSxDQUFDLGNBQWMsQ0FBQztJQUV2QixPQUFPLEVBQUU7UUFDUCxRQUFROztZQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztnQkFBRSxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNoQyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ25CLEtBQUssRUFBRSx1QkFBdUI7Z0JBQzlCLFVBQVUsRUFBRSxnQkFBZ0I7Z0JBQzVCLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLO2dCQUM1QixJQUFJLEVBQUUsQ0FBQztnQkFDUCxHQUFHLEVBQUUsQ0FBQztnQkFDTixHQUFHLEVBQUUsQ0FBQztnQkFDTixLQUFLLEVB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YixJQUFJLENBQUMsVUFBVSxFQUFFO1NBQ2xCLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoLCBkZWZpbmVDb21wb25lbnQgfSBmcm9tICd2dWUnXG5cbi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZDb2xvclBpY2tlclByZXZpZXcuc2FzcydcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IFZTbGlkZXIgZnJvbSAnLi4vVlNsaWRlci9WU2xpZGVyJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCB7IFJHQnRvQ1NTLCBSR0JBdG9DU1MgfSBmcm9tICcuLi8uLi91dGlsL2NvbG9yVXRpbHMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgdHlwZSB7IFZOb2RlLCBQcm9wVHlwZSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB0eXBlIHsgVkNvbG9yUGlja2VyQ29sb3IgfSBmcm9tICcuL3V0aWwnXG5pbXBvcnQgeyBmcm9tSFNWQSB9IGZyb20gJy4vdXRpbCdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29tcG9uZW50KHtcbiAgbmFtZTogJ3YtY29sb3ItcGlja2VyLXByZXZpZXcnLFxuXG4gIHByb3BzOiB7XG4gICAgY29sb3I6IHtcbiAgICAgIHR5cGU6IE9iamVjdCBhcyBQcm9wVHlwZTxWQ29sb3JQaWNrZXJDb2xvcj4sXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICB9LFxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxuICAgIGhpZGVBbHBoYTogQm9vbGVhbixcbiAgfSxcblxuICBlbWl0czogWyd1cGRhdGU6Y29sb3InXSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2VuQWxwaGEgKCk6IFZOb2RlIHtcbiAgICAgIGlmICghdGhpcy5jb2xvcikgcmV0dXJuIGgoJ2RpdicpXG4gICAgICByZXR1cm4gdGhpcy5nZW5UcmFjayh7XG4gICAgICAgIGNsYXNzOiAndi1jb2xvci1waWNrZXJfX2FscGhhJyxcbiAgICAgICAgdGh1bWJDb2xvcjogJ2dyZXkgbGlnaHRlbi0yJyxcbiAgICAgICAgaGlkZURldGFpbHM6IHRydWUsXG4gICAgICAgIG1vZGVsVmFsdWU6IHRoaXMuY29sb3IuYWxwaGEsXG4gICAgICAgIHN0ZXA6IDAsXG4gICAgICAgIG1pbjogMCxcbiAgICAgICAgbWF4OiAxLFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIGJhY2tncm91bmRJbWFnZTogdGhpcy5kaXNhYmxlZFxuICAgICAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgICAgIDogYGxpbmVhci1ncmFkaWVudCh0byAke3RoaXMuJHZ1ZXRpZnk/LnJ0bCA/ICdsZWZ0JyA6ICdyaWdodCd9LCB0cmFuc3BhcmVudCwgJHtSR0J0b0NTUyh0aGlzLmNvbG9yLnJnYmEpfSlgLFxuICAgICAgICB9LFxuICAgICAgICAnb25VcGRhdGU6bW9kZWxWYWx1ZSc6ICh2YWw6IG51bWJlcikgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmNvbG9yICYmIHRoaXMuY29sb3IuYWxwaGEgIT09IHZhbCkge1xuICAgICAgICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOmNvbG9yJywgZnJvbUhTVkEoeyAuLi50aGlzLmNvbG9yLmhzdmEsIGE6IHZhbCB9KSlcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBnZW5IdWUgKCk6IFZOb2RlIHtcbiAgICAgIGlmICghdGhpcy5jb2xvcikgcmV0dXJuIGgoJ2RpdicpXG4gICAgICByZXR1cm4gdGhpcy5nZW5UcmFjayh7XG4gICAgICAgIGNsYXNzOiAndi1jb2xvci1waWNrZXJfX2h1ZScsXG4gICAgICAgIHRodW1iQ29sb3I6ICdncmV5IGxpZ2h0ZW4tMicsXG4gICAgICAgIGhpZGVEZXRhaWxzOiB0cnVlLFxuICAgICAgICBtb2RlbFZhbHVlOiB0aGlzLmNvbG9yLmh1ZSxcbiAgICAgICAgc3RlcDogMCxcbiAgICAgICAgbWluOiAwLFxuICAgICAgICBtYXg6IDM2MCxcbiAgICAgICAgJ29uVXBkYXRlOm1vZGVsVmFsdWUnOiAodmFsOiBudW1iZXIpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5jb2xvciAmJiB0aGlzLmNvbG9yLmh1ZSAhPT0gdmFsKSB7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCd1cGRhdGU6Y29sb3InLCBmcm9tSFNWQSh7IC4uLnRoaXMuY29sb3IuaHN2YSwgaDogdmFsIH0pKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIGdlblRyYWNrIChvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogVk5vZGUge1xuICAgICAgcmV0dXJuIGgoVlNsaWRlciwge1xuICAgICAgICBjbGFzczogJ3YtY29sb3ItcGlja2VyX190cmFjaycsXG4gICAgICAgIGRpc2FibGVkOiB0aGlzLmRpc2FibGVkLFxuICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgZ2VuU2xpZGVycyAoKTogVk5vZGUge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6ICd2LWNvbG9yLXBpY2tlcl9fc2xpZGVycycsXG4gICAgICB9LCBbXG4gICAgICAgIHRoaXMuZ2VuSHVlKCksXG4gICAgICAgICF0aGlzLmhpZGVBbHBoYSAmJiB0aGlzLmdlbkFscGhhKCksXG4gICAgICBdKVxuICAgIH0sXG5cbiAgICBnZW5Eb3QgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiAndi1jb2xvci1waWNrZXJfX2RvdCcsXG4gICAgICB9LCBbXG4gICAgICAgIGgoJ2RpdicsIHtcbiAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdGhpcy5jb2xvciA/IFJHQkF0b0NTUyh0aGlzLmNvbG9yLnJnYmEpIDogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIF0pXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKCk6IFZOb2RlIHtcbiAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgY2xhc3M6IFsndi1jb2xvci1waWNrZXJfX3ByZXZpZXcnLCB7XG4gICAgICAgICd2LWNvbG9yLXBpY2tlcl9fcHJldmlldy0taGlkZS1hbHBoYSc6IHRoaXMuaGlkZUFscGhhLFxuICAgICAgfV0sXG4gICAgfSwgW1xuICAgICAgdGhpcy5nZW5Eb3QoKSxcbiAgICAgIHRoaXMuZ2VuU2xpZGVycygpLFxuICAgIF0pXG4gIH0sXG59KVxuIl19