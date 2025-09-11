import { h, withDirectives } from 'vue';
import Routable from '../../mixins/routable';
import mixins from '../../util/mixins';
import { getSlot } from '../../util/helpers';
/* @vue/component */

export default mixins(Routable).extend({
  name: 'v-breadcrumbs-item',
  props: {
    // In a breadcrumb, the currently
    // active item should be dimmed
    activeClass: {
      type: String,
      default: 'v-breadcrumbs__item--disabled'
    },
    ripple: {
      type: [Boolean, Object],
      default: false
    }
  },
  computed: {
    classes() {
      return {
        'v-breadcrumbs__item': true,
        [this.activeClass]: this.disabled
      };
    }

  },

  render() {
    const {
      tag,
      data,
      directives
    } = this.generateRouteLink();
    return withDirectives(h('li', [h(tag, { ...data,
      'aria-current': this.isActive && this.isLink ? 'page' : undefined
    }, getSlot(this))]), directives);
  }

});
//# sourceMappingURL=VBreadcrumbsItem.js.map