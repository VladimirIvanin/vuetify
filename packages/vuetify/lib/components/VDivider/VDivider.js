import { h } from 'vue'; // Styles

import "../../../src/components/VDivider/VDivider.sass"; // Types

import { defineComponent } from 'vue'; // Mixins

import Themeable from '../../mixins/themeable';
import mergeData from '../../util/mergeData';
export default defineComponent({
  name: 'v-divider',
  extends: Themeable,
  props: {
    inset: Boolean,
    vertical: Boolean
  },

  render() {
    // WAI-ARIA attributes
    let orientation;

    if (!this.$attrs.role || this.$attrs.role === 'separator') {
      orientation = this.vertical ? 'vertical' : 'horizontal';
    }

    return h('hr', mergeData({
      class: {
        'v-divider': true,
        'v-divider--inset': this.inset,
        'v-divider--vertical': this.vertical,
        ...this.themeClasses
      },
      role: 'separator',
      'aria-orientation': orientation,
      ...this.$listeners
    }, this.$attrs));
  }

});
//# sourceMappingURL=VDivider.js.map