import { h } from 'vue'; // Styles

import "../../../src/components/VSubheader/VSubheader.sass"; // Mixins

import Themeable from '../../mixins/themeable';
import mixins from '../../util/mixins';
import { getSlot } from '../../util/helpers';
export default mixins(Themeable
/* @vue/component */
).extend({
  name: 'v-subheader',
  props: {
    inset: Boolean
  },

  render() {
    return h('div', { ...this.$attrs,
      class: ['v-subheader', {
        'v-subheader--inset': this.inset,
        ...this.themeClasses
      }, this.$attrs.class],
      ...this.$listeners
    }, getSlot(this));
  }

});
//# sourceMappingURL=VSubheader.js.map