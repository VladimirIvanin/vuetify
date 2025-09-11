// Styles
import "../../../src/components/VMessages/VMessages.sass"; // Mixins

import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable'; // Types

import { TransitionGroup, h } from 'vue';
import mixins from '../../util/mixins'; // Utilities

import { getSlot } from '../../util/helpers';
import { breaking } from '../../util/console';
/* @vue/component */

export default mixins(Colorable, Themeable).extend({
  name: 'v-messages',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },

  created() {
    const breakingProps = [['value', 'modelValue']];
    /* istanbul ignore next */

    breakingProps.forEach(([original, replacement]) => {
      if (this.$attrs.hasOwnProperty(original)) breaking(original, replacement, this);
    });
  },

  methods: {
    genChildren() {
      return h(TransitionGroup, {
        class: 'v-messages__wrapper',
        name: 'message-transition',
        tag: 'div'
      }, () => this.modelValue.map(this.genMessage));
    },

    genMessage(message, key) {
      return h('div', {
        class: 'v-messages__message',
        key
      }, getSlot(this, 'default', {
        message,
        key
      }) || [message]);
    }

  },

  render() {
    return h('div', this.setTextColor(this.color, {
      class: ['v-messages', this.themeClasses]
    }), [this.genChildren()]);
  }

});
//# sourceMappingURL=VMessages.js.map