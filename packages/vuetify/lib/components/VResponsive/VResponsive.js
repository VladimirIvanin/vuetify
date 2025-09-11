import { h, mergeProps } from 'vue';
import "../../../src/components/VResponsive/VResponsive.sass"; // Mixins

import Measurable from '../../mixins/measurable'; // Utils

import mixins from '../../util/mixins';
import { getSlot } from '../../util/helpers';
/* @vue/component */

export default mixins(Measurable).extend({
  name: 'v-responsive',
  props: {
    aspectRatio: [String, Number],
    contentClass: String
  },
  computed: {
    computedAspectRatio() {
      return Number(this.aspectRatio);
    },

    aspectStyle() {
      return this.computedAspectRatio ? {
        paddingBottom: 1 / this.computedAspectRatio * 100 + '%'
      } : undefined;
    },

    __cachedSizer() {
      if (!this.aspectStyle) return [];
      return h('div', {
        style: this.aspectStyle,
        class: 'v-responsive__sizer'
      });
    }

  },
  methods: {
    genContent() {
      return h('div', {
        class: ['v-responsive__content', this.contentClass]
      }, getSlot(this));
    }

  },

  render() {
    return h('div', mergeProps({
      class: 'v-responsive',
      style: this.measurableStyles
    }, this.$attrs), [this.__cachedSizer, this.genContent()]);
  }

});
//# sourceMappingURL=VResponsive.js.map