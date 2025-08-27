import {h} from 'vue'
// Styles
import './VColorPicker.sass'

// Components
import VSheet from '../VSheet/VSheet'
import VColorPickerPreview from './VColorPickerPreview'
import VColorPickerCanvas from './VColorPickerCanvas'
import VColorPickerEdit, { Mode, modes } from './VColorPickerEdit'
import VColorPickerSwatches from './VColorPickerSwatches'

// Helpers
import { VColorPickerColor, parseColor, fromRGBA, extractColor, hasAlpha } from './util'
import mixins from '../../util/mixins'
import { deepEqual } from '../../util/helpers'

// Mixins
import Elevatable from '../../mixins/elevatable'
import Themeable from '../../mixins/themeable'

// Types
import { VNode, PropType } from 'vue'

export default mixins(Elevatable, Themeable).extend({
  name: 'v-color-picker',

  props: {
    canvasHeight: {
      type: [String, Number],
      default: 150,
    },
    disabled: Boolean,
    dotSize: {
      type: [Number, String],
      default: 10,
    },
    flat: Boolean,
    hideCanvas: Boolean,
    hideSliders: Boolean,
    hideInputs: Boolean,
    hideModeSwitch: Boolean,
    mode: {
      type: String,
      default: 'rgba',
      validator: (v: string) => Object.keys(modes).includes(v),
    },
    showSwatches: Boolean,
    swatches: Array as PropType<string[][]>,
    swatchesMaxHeight: {
      type: [Number, String],
      default: 150,
    },
    modelValue: {
      type: [Object, String],
    },
    width: {
      type: [Number, String],
      default: 300,
    },
  },

  data: () => ({
    internalValue: fromRGBA({ r: 255, g: 0, b: 0, a: 1 }),
  }),

  computed: {
    hideAlpha (): boolean {
      if (!this.modelValue) return false

      return !hasAlpha(this.modelValue)
    },
  },

  watch: {
    value: {
      handler (color: any) {
        this.updateColor(parseColor(color, this.internalValue))
      },
      immediate: true,
    },
  },

  methods: {
    updateColor (color: VColorPickerColor) {
      this.internalValue = color
      const value = extractColor(this.internalValue, this.modelValue)

      if (!deepEqual(value, this.modelValue)) {
        this.$emit('update:modelValue', value)
        this.$emit('update:color', this.internalValue)
      }
    },
    genCanvas (): VNode {
      return h(VColorPickerCanvas, {
        color: this.internalValue,
        disabled: this.disabled,
        dotSize: this.dotSize,
        width: this.width,
        height: this.canvasHeight,
        'onUpdate:color': this.updateColor
      })
    },
    genControls (): VNode {
      return h('div', {
        class: 'v-color-picker__controls',
      }, [
        !this.hideSliders && this.genPreview(),
        !this.hideInputs && this.genEdit(),
      ])
    },
    genEdit (): VNode {
      return h(VColorPickerEdit, {
        color: this.internalValue,
        disabled: this.disabled,
        hideAlpha: this.hideAlpha,
        hideModeSwitch: this.hideModeSwitch,
        mode: this.mode,
        'onUpdate:color': this.updateColor,
        'onUpdate:mode': (v: Mode) => this.$emit('update:mode', v),
      })
    },
    genPreview (): VNode {
      return h(VColorPickerPreview, {
        props: {
          color: this.internalValue,
          disabled: this.disabled,
          hideAlpha: this.hideAlpha,
        },
        on: {
          'update:color': this.updateColor,
        },
      })
    },
    genSwatches (): VNode {
      return h(VColorPickerSwatches, {
        props: {
          dark: this.dark,
          light: this.light,
          disabled: this.disabled,
          swatches: this.swatches,
          color: this.internalValue,
          maxHeight: this.swatchesMaxHeight,
        },
        on: {
          'update:color': this.updateColor,
        },
      })
    },
  },

  render (): VNode {
    return h(VSheet, {
      class: {
        'v-color-picker': true,
        'v-color-picker--flat': this.flat,
        ...this.themeClasses,
        ...this.elevationClasses,
      },
      props: {
        maxWidth: this.width,
      },
    }, [
      !this.hideCanvas && this.genCanvas(),
      (!this.hideSliders || !this.hideInputs) && this.genControls(),
      this.showSwatches && this.genSwatches(),
    ])
  },
})
