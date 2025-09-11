import "../../../src/components/VCheckbox/VSimpleCheckbox.sass";
import Ripple from '../../directives/ripple';
import { h, defineComponent, withDirectives } from 'vue';
import { VIcon } from '../VIcon'; // Mixins

import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable'; // Utilities

import mergeData from '../../util/mergeData';
import { breaking } from '../../util/console';
export default defineComponent({
  name: 'v-simple-checkbox',
  props: { ...Colorable.props,
    ...Themeable.props,
    disabled: Boolean,
    ripple: {
      type: Boolean,
      default: true
    },
    modelValue: Boolean,
    indeterminate: Boolean,
    indeterminateIcon: {
      type: String,
      default: '$checkboxIndeterminate'
    },
    onIcon: {
      type: String,
      default: '$checkboxOn'
    },
    offIcon: {
      type: String,
      default: '$checkboxOff'
    }
  },
  emits: ['input', 'update:modelValue'],

  created() {
    const breakingProps = [['value', 'modelValue'], ['onInput', 'onUpdate:modelValue']];
    /* istanbul ignore next */

    breakingProps.forEach(([original, replacement]) => {
      if (this.$attrs.hasOwnProperty(original)) breaking(original, replacement, this);
    });
  },

  methods: {
    getIcon() {
      const {
        indeterminate,
        modelValue,
        indeterminateIcon,
        onIcon,
        offIcon
      } = this.$props;
      if (indeterminate) return indeterminateIcon;
      if (modelValue) return onIcon;
      return offIcon;
    },

    createIcon() {
      const {
        modelValue,
        disabled,
        dark,
        light,
        color
      } = this.$props;
      return h(VIcon, Colorable.methods.setTextColor(modelValue && color, {
        disabled,
        dark,
        light
      }), () => this.getIcon());
    },

    createRipple() {
      const {
        ripple,
        disabled,
        color
      } = this.$props;
      if (!ripple || disabled) return null;
      return withDirectives(h('div', Colorable.methods.setTextColor(color, {
        class: 'v-input--selection-controls__ripple'
      })), [[Ripple, {
        center: true
      }]]);
    },

    handleClick(e) {
      e.stopPropagation();
      if (this.$props.disabled) return;
      const newValue = !this.modelValue;
      const attrs = this.$attrs;
      this.$emit("input", newValue);
      this.$emit('update:modelValue', newValue);
    },

    createChildren() {
      const children = [this.createIcon()];
      const ripple = this.createRipple();

      if (ripple) {
        children.push(ripple);
      }

      return children;
    }

  },

  render() {
    const {
      disabled
    } = this.$props;
    const data = this.$attrs;
    return h('div', mergeData(data, {
      class: {
        'v-simple-checkbox': true,
        'v-simple-checkbox--disabled': disabled
      },
      onClick: this.handleClick
    }), [h('div', {
      class: 'v-input--selection-controls__input'
    }, this.createChildren())]);
  }

});
//# sourceMappingURL=VSimpleCheckbox.js.map