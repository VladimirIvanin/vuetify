import { h, defineComponent } from 'vue'; // Styles

import "../../../src/components/VColorPicker/VColorPickerEdit.sass"; // Components

import VBtn from '../VBtn';
import VIcon from '../VIcon'; // Helpers

import { parseHex } from '../../util/colorUtils';
import { fromRGBA, fromHexa, fromHSLA } from './util';
export const modes = {
  rgba: {
    inputs: [['r', 255, 'int'], ['g', 255, 'int'], ['b', 255, 'int'], ['a', 1, 'float']],
    from: fromRGBA
  },
  hsla: {
    inputs: [['h', 360, 'int'], ['s', 1, 'float'], ['l', 1, 'float'], ['a', 1, 'float']],
    from: fromHSLA
  },
  hexa: {
    from: fromHexa
  }
};
export default defineComponent({
  name: 'v-color-picker-edit',
  props: {
    color: {
      type: Object,
      required: true
    },
    disabled: Boolean,
    hideAlpha: Boolean,
    hideModeSwitch: Boolean,
    mode: {
      type: String,
      default: 'rgba',
      validator: v => Object.keys(modes).includes(v)
    }
  },
  emits: ['update:color', 'update:mode'],

  data() {
    return {
      internalMode: this.mode
    };
  },

  computed: {
    currentMode() {
      return modes[this.internalMode];
    }

  },
  watch: {
    mode(mode) {
      this.internalMode = mode;
    }

  },
  methods: {
    getValue(v, type) {
      if (type === 'float') return Math.round(v * 100) / 100;else if (type === 'int') return Math.round(v);else return 0;
    },

    parseValue(v, type) {
      if (type === 'float') return parseFloat(v);else if (type === 'int') return parseInt(v, 10) || 0;else return 0;
    },

    changeMode() {
      const modeKeys = Object.keys(modes);
      const index = modeKeys.indexOf(this.internalMode);
      const newMode = modeKeys[(index + 1) % modeKeys.length];
      this.internalMode = newMode;
      this.$emit('update:mode', newMode);
    },

    genInput(target, attrs, value, onChange) {
      return h('div', {
        class: 'v-color-picker__input'
      }, [h('input', {
        key: target,
        ...attrs,
        value,
        onChange
      }), h('span', target.toUpperCase())]);
    },

    genInputs() {
      if (this.internalMode === 'hexa') {
        const hex = this.color.hexa;
        const value = this.hideAlpha && hex.endsWith('FF') ? hex.substr(0, 7) : hex;
        return this.genInput('hex', {
          maxlength: this.hideAlpha ? 7 : 9,
          disabled: this.disabled
        }, value, e => {
          const el = e.target;
          this.$emit('update:color', this.currentMode.from(parseHex(el.value)));
        });
      } else {
        const inputs = this.hideAlpha ? this.currentMode.inputs.slice(0, -1) : this.currentMode.inputs;
        return inputs.map(([target, max, type]) => {
          const value = this.color[this.internalMode];
          return this.genInput(target, {
            type: 'number',
            min: 0,
            max,
            step: type === 'float' ? '0.01' : type === 'int' ? '1' : undefined,
            disabled: this.disabled
          }, this.getValue(value[target], type), e => {
            const el = e.target;
            const newVal = this.parseValue(el.value || '0', type);
            this.$emit('update:color', this.currentMode.from(Object.assign({}, value, {
              [target]: newVal
            }), this.color.alpha));
          });
        });
      }
    },

    genSwitch() {
      return h(VBtn, {
        small: true,
        icon: true,
        disabled: this.disabled,
        onClick: this.changeMode
      }, {
        default: () => [h(VIcon, {}, '$unfold')]
      });
    }

  },

  render() {
    return h('div', {
      class: 'v-color-picker__edit'
    }, [this.genInputs(), !this.hideModeSwitch && this.genSwitch()]);
  }

});
//# sourceMappingURL=VColorPickerEdit.js.map