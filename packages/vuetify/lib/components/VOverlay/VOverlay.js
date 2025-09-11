import { h } from 'vue'; // Styles

import "../../../src/components/VOverlay/VOverlay.sass"; // Mixins

import Colorable from './../../mixins/colorable';
import Themeable from '../../mixins/themeable';
import Toggleable from './../../mixins/toggleable'; // Utilities

import mixins from '../../util/mixins';
import { getSlot } from '../../util/helpers';
/* @vue/component */

export default mixins(Colorable, Themeable, Toggleable).extend({
  name: 'v-overlay',
  emits: ['update:modelValue'],
  props: {
    absolute: Boolean,
    color: {
      type: String,
      default: '#212121'
    },
    dark: {
      type: Boolean,
      default: true
    },
    opacity: {
      type: [Number, String],
      default: 0.46
    },
    modelValue: {
      default: true
    },
    zIndex: {
      type: [Number, String],
      default: 5
    }
  },
  computed: {
    __scrim() {
      const data = this.setBackgroundColor(this.color, {
        class: {
          'v-overlay__scrim': true
        },
        style: {
          opacity: this.computedOpacity
        }
      });
      return h('div', data);
    },

    classes() {
      return {
        'v-overlay--absolute': this.absolute,
        'v-overlay--active': this.isActive,
        ...this.themeClasses
      };
    },

    computedOpacity() {
      return Number(this.isActive ? this.opacity : 0);
    },

    styles() {
      return {
        zIndex: this.zIndex
      };
    }

  },
  methods: {
    genContent() {
      return h('div', {
        class: 'v-overlay__content'
      }, getSlot(this));
    }

  },

  render() {
    const children = [this.__scrim];
    if (this.isActive) children.push(this.genContent());
    return h('div', { ...this.$attrs,
      class: ['v-overlay', this.classes],
      style: this.styles
    }, children);
  }

});
//# sourceMappingURL=VOverlay.js.map