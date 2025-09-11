// Styles
import "../../../src/styles/components/_selection-controls.sass";
import "../../../src/components/VRadioGroup/VRadioGroup.sass"; // Extensions

import VInput from '../VInput';
import { BaseItemGroup } from '../VItemGroup/VItemGroup'; // Utilities

import { mergeProps, h } from 'vue';
import mixins from '../../util/mixins';
const baseMixins = mixins(VInput, BaseItemGroup);
/* @vue/component */

export default baseMixins.extend({
  name: 'v-radio-group',

  provide() {
    return {
      radioGroup: this
    };
  },

  props: {
    column: {
      type: Boolean,
      default: true
    },
    height: {
      type: [Number, String],
      default: 'auto'
    },
    name: String,
    row: Boolean,
    // If no value set on VRadio
    // will match valueComparator
    // force default to null
    modelValue: null
  },
  computed: {
    classes() {
      return { ...VInput.computed.classes.call(this),
        'v-input--selection-controls v-input--radio-group': true,
        'v-input--radio-group--column': this.column && !this.row,
        'v-input--radio-group--row': this.row
      };
    }

  },
  methods: {
    genDefaultSlot() {
      return h('div', {
        class: 'v-input--radio-group__input',
        id: this.id,
        role: 'radiogroup',
        'aria-labelledby': this.computedId
      }, VInput.methods.genDefaultSlot.call(this));
    },

    genInputSlot() {
      const render = VInput.methods.genInputSlot.call(this);
      delete render.props.onClick;
      return render;
    },

    genLabel() {
      const label = VInput.methods.genLabel.call(this);
      if (!label) return null;
      label.data.attrs.id = this.computedId; // WAI considers this an orphaned label

      delete label.data.attrs.for;
      label.tag = 'legend';
      return label;
    },

    onClick: BaseItemGroup.methods.onClick
  },

  render() {
    const vnode = VInput.render.call(this);
    vnode.props = mergeProps(vnode.props, this.attrs$);
    return vnode;
  }

});
//# sourceMappingURL=VRadioGroup.js.map