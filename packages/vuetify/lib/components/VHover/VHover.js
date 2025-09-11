// Mixins
import Delayable from '../../mixins/delayable';
import Toggleable from '../../mixins/toggleable'; // Utilities

import mixins from '../../util/mixins';
import { consoleWarn } from '../../util/console';
export default mixins(Delayable, Toggleable
/* @vue/component */
).extend({
  name: 'v-hover',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: undefined
    }
  },
  emits: ['update:modelValue'],
  methods: {
    onMouseEnter() {
      this.runDelay('open');
    },

    onMouseLeave() {
      this.runDelay('close');
    }

  },

  render() {
    if (!this.$slots.default && this.value === undefined) {
      consoleWarn('v-hover is missing a default scopedSlot or bound value', this);
      return null;
    }

    let element;
    /* istanbul ignore else */

    if (this.$slots.default) {
      element = this.$slots.default({
        hover: this.isActive
      });
    }

    if (Array.isArray(element) && element.length === 1) {
      element = element[0];
    }

    if (!element || Array.isArray(element) || !element.tag) {
      consoleWarn('v-hover should only contain a single element', this);
      return element;
    }

    if (!this.disabled) {
      element.data = element.data || {};

      this._g(element.data, {
        mouseenter: this.onMouseEnter,
        mouseleave: this.onMouseLeave
      });
    }

    return element;
  }

});
//# sourceMappingURL=VHover.js.map