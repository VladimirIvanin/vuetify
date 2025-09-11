import { h, defineComponent } from 'vue'; // Styles

import "../../../src/components/VColorPicker/VColorPickerPreview.sass"; // Components

import VSlider from '../VSlider/VSlider'; // Utilities

import { RGBtoCSS, RGBAtoCSS } from '../../util/colorUtils';
import { fromHSVA } from './util';
export default defineComponent({
  name: 'v-color-picker-preview',
  props: {
    color: {
      type: Object,
      required: true
    },
    disabled: Boolean,
    hideAlpha: Boolean
  },
  emits: ['update:color'],
  methods: {
    genAlpha() {
      var _a;

      if (!this.color) return h('div');
      return this.genTrack({
        class: 'v-color-picker__alpha',
        thumbColor: 'grey lighten-2',
        hideDetails: true,
        modelValue: this.color.alpha,
        step: 0,
        min: 0,
        max: 1,
        style: {
          backgroundImage: this.disabled ? undefined : `linear-gradient(to ${((_a = this.$vuetify) === null || _a === void 0 ? void 0 : _a.rtl) ? 'left' : 'right'}, transparent, ${RGBtoCSS(this.color.rgba)})`
        },
        'onUpdate:modelValue': val => {
          if (this.color && this.color.alpha !== val) {
            this.$emit('update:color', fromHSVA({ ...this.color.hsva,
              a: val
            }));
          }
        }
      });
    },

    genHue() {
      if (!this.color) return h('div');
      return this.genTrack({
        class: 'v-color-picker__hue',
        thumbColor: 'grey lighten-2',
        hideDetails: true,
        modelValue: this.color.hue,
        step: 0,
        min: 0,
        max: 360,
        'onUpdate:modelValue': val => {
          if (this.color && this.color.hue !== val) {
            this.$emit('update:color', fromHSVA({ ...this.color.hsva,
              h: val
            }));
          }
        }
      });
    },

    genTrack(options) {
      return h(VSlider, {
        class: 'v-color-picker__track',
        disabled: this.disabled,
        ...options
      });
    },

    genSliders() {
      return h('div', {
        class: 'v-color-picker__sliders'
      }, [this.genHue(), !this.hideAlpha && this.genAlpha()]);
    },

    genDot() {
      return h('div', {
        class: 'v-color-picker__dot'
      }, [h('div', {
        style: {
          background: this.color ? RGBAtoCSS(this.color.rgba) : 'transparent'
        }
      })]);
    }

  },

  render() {
    return h('div', {
      class: ['v-color-picker__preview', {
        'v-color-picker__preview--hide-alpha': this.hideAlpha
      }]
    }, [this.genDot(), this.genSliders()]);
  }

});
//# sourceMappingURL=VColorPickerPreview.js.map