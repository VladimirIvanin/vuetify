// Extensions
import VWindowItem from '../VWindow/VWindowItem'; // Components

import { VImg } from '../VImg'; // Utilities

import mixins from '../../util/mixins';
import { getSlot } from '../../util/helpers';
import Routable from '../../mixins/routable';
import { vShow, withDirectives, h } from 'vue'; // Types

const baseMixins = mixins(VWindowItem, Routable);
/* @vue/component */

export default baseMixins.extend({
  name: 'v-carousel-item',
  inject: {
    parentTheme: {
      default: {
        isDark: false
      }
    }
  },

  // pass down the parent's theme
  provide() {
    return {
      theme: this.parentTheme
    };
  },

  inheritAttrs: false,
  methods: {
    genDefaultSlot() {
      return [h(VImg, {
        class: 'v-carousel__item',
        ...this.$attrs,
        height: this.windowGroup.internalHeight,
        ...this.$listeners
      }, {
        default: () => getSlot(this),
        placeholder: this.$slots.placeholder
      })];
    },

    genWindowItem() {
      const {
        tag,
        data,
        directives
      } = this.generateRouteLink();
      data.class['v-window-item'] = true;
      directives.push([vShow, this.isActive]);
      return withDirectives(h(tag, data, this.genDefaultSlot()), directives);
    }

  }
});
//# sourceMappingURL=VCarouselItem.js.map