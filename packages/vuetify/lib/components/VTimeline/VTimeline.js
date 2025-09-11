import { h } from 'vue'; // Styles

import "../../../src/components/VTimeline/VTimeline.sass";
import mixins from '../../util/mixins'; // Mixins

import Themeable from '../../mixins/themeable';
import { getSlot } from '../../util/helpers';
export default mixins(Themeable
/* @vue/component */
).extend({
  name: 'v-timeline',

  provide() {
    return {
      timeline: this
    };
  },

  props: {
    alignTop: Boolean,
    dense: Boolean,
    reverse: Boolean
  },
  computed: {
    classes() {
      return {
        'v-timeline--align-top': this.alignTop,
        'v-timeline--dense': this.dense,
        'v-timeline--reverse': this.reverse,
        ...this.themeClasses
      };
    }

  },

  render() {
    return h('div', {
      class: ['v-timeline', this.classes]
    }, getSlot(this));
  }

});
//# sourceMappingURL=VTimeline.js.map