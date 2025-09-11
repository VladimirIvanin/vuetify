import { h, defineComponent } from 'vue'; // Styles

import "../../../src/components/VColorPicker/VColorPicker.sass"; // Components

import VSheet from '../VSheet/VSheet';
import VColorPickerPreview from './VColorPickerPreview';
import VColorPickerCanvas from './VColorPickerCanvas';
import VColorPickerEdit, { modes } from './VColorPickerEdit';
import VColorPickerSwatches from './VColorPickerSwatches'; // Helpers

import { parseColor, fromRGBA, extractColor, hasAlpha } from './util';
import { deepEqual } from '../../util/helpers'; // Mixins

import Elevatable from '../../mixins/elevatable';
import Themeable from '../../mixins/themeable';
export default defineComponent({
  name: 'v-color-picker',
  mixins: [Elevatable, Themeable],
  props: {
    canvasHeight: {
      type: [String, Number],
      default: 150
    },
    disabled: Boolean,
    dotSize: {
      type: [Number, String],
      default: 10
    },
    flat: Boolean,
    hideCanvas: Boolean,
    hideSliders: Boolean,
    hideInputs: Boolean,
    hideModeSwitch: Boolean,
    mode: {
      type: String,
      default: 'rgba',
      validator: v => Object.keys(modes).includes(v)
    },
    showSwatches: Boolean,
    swatches: Array,
    swatchesMaxHeight: {
      type: [Number, String],
      default: 150
    },
    modelValue: {
      type: [Object, String]
    },
    width: {
      type: [Number, String],
      default: 300
    }
  },
  emits: ['update:modelValue', 'update:color', 'update:mode'],

  data() {
    return {
      internalValue: fromRGBA({
        r: 255,
        g: 0,
        b: 0,
        a: 1
      })
    };
  },

  computed: {
    hideAlpha() {
      if (!this.modelValue) return false;
      return !hasAlpha(this.modelValue);
    }

  },
  watch: {
    modelValue: {
      handler(color) {
        this.updateColor(parseColor(color, this.internalValue));
      },

      immediate: true
    }
  },
  methods: {
    updateColor(color) {
      this.internalValue = color;
      const value = extractColor(this.internalValue, this.modelValue);

      if (!deepEqual(value, this.modelValue)) {
        this.$emit('update:modelValue', value);
        this.$emit('update:color', this.internalValue);
      }
    },

    genCanvas() {
      return h(VColorPickerCanvas, {
        color: this.internalValue,
        disabled: this.disabled,
        dotSize: this.dotSize,
        width: this.width,
        height: this.canvasHeight,
        'onUpdate:color': this.updateColor
      });
    },

    genControls() {
      return h('div', {
        class: 'v-color-picker__controls'
      }, [!this.hideSliders && this.genPreview(), !this.hideInputs && this.genEdit()]);
    },

    genEdit() {
      return h(VColorPickerEdit, {
        color: this.internalValue,
        disabled: this.disabled,
        hideAlpha: this.hideAlpha,
        hideModeSwitch: this.hideModeSwitch,
        mode: this.mode,
        'onUpdate:color': this.updateColor,
        'onUpdate:mode': v => this.$emit('update:mode', v)
      });
    },

    genPreview() {
      return h(VColorPickerPreview, {
        color: this.internalValue,
        disabled: this.disabled,
        hideAlpha: this.hideAlpha,
        'onUpdate:color': this.updateColor
      });
    },

    genSwatches() {
      return h(VColorPickerSwatches, {
        disabled: this.disabled,
        swatches: this.swatches,
        color: this.internalValue,
        maxHeight: this.swatchesMaxHeight,
        'onUpdate:color': this.updateColor
      });
    }

  },

  render() {
    return h(VSheet, {
      class: ['v-color-picker', {
        'v-color-picker--flat': this.flat,
        ...this.themeClasses,
        ...this.elevationClasses
      }],
      maxWidth: this.width
    }, [!this.hideCanvas && this.genCanvas(), (!this.hideSliders || !this.hideInputs) && this.genControls(), this.showSwatches && this.genSwatches()]);
  }

});
//# sourceMappingURL=VColorPicker.js.map