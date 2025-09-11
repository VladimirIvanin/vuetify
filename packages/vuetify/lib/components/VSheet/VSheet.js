import { h } from 'vue'; // Styles

import "../../../src/components/VSheet/VSheet.sass"; // Mixins

import BindsAttrs from '../../mixins/binds-attrs';
import Colorable from '../../mixins/colorable';
import Elevatable from '../../mixins/elevatable';
import Measurable from '../../mixins/measurable';
import Roundable from '../../mixins/roundable';
import Themeable from '../../mixins/themeable'; // Types

import { defineComponent } from 'vue';
/* @vue/component */

export default defineComponent({
  name: 'v-sheet',
  mixins: [BindsAttrs, Colorable, Elevatable, Measurable, Roundable, Themeable],
  props: {
    outlined: Boolean,
    shaped: Boolean,
    tag: {
      type: String,
      default: 'div'
    }
  },
  computed: {
    classes() {
      return {
        'v-sheet': true,
        'v-sheet--outlined': this.outlined,
        'v-sheet--shaped': this.shaped,
        ...this.themeClasses,
        ...this.elevationClasses,
        ...this.roundedClasses
      };
    },

    styles() {
      return this.measurableStyles;
    }

  },

  render() {
    var _a, _b;

    const data = {
      class: this.classes,
      style: this.styles,
      ...this.listeners$
    };
    return h(this.tag, this.setBackgroundColor(this.color, data), (_b = (_a = this.$slots).default) === null || _b === void 0 ? void 0 : _b.call(_a));
  }

});
//# sourceMappingURL=VSheet.js.map