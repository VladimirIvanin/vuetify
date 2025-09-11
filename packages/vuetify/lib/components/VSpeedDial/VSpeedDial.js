import { TransitionGroup, h, withDirectives } from 'vue'; // Styles

import "../../../src/components/VSpeedDial/VSpeedDial.sass"; // Mixins

import Toggleable from '../../mixins/toggleable';
import Positionable from '../../mixins/positionable';
import Transitionable from '../../mixins/transitionable'; // Directives

import ClickOutside from '../../directives/click-outside'; // Types

import mixins from '../../util/mixins';
import { getSlot } from '../../util/helpers';
/* @vue/component */

export default mixins(Positionable, Toggleable, Transitionable).extend({
  name: 'v-speed-dial',
  props: {
    direction: {
      type: String,
      default: 'top',
      validator: val => {
        return ['top', 'right', 'bottom', 'left'].includes(val);
      }
    },
    openOnHover: Boolean,
    transition: {
      type: String,
      default: 'scale-transition'
    }
  },
  emits: ['update:modelValue'],
  computed: {
    classes() {
      return {
        'v-speed-dial': true,
        'v-speed-dial--top': this.top,
        'v-speed-dial--right': this.right,
        'v-speed-dial--bottom': this.bottom,
        'v-speed-dial--left': this.left,
        'v-speed-dial--absolute': this.absolute,
        'v-speed-dial--fixed': this.fixed,
        [`v-speed-dial--direction-${this.direction}`]: true,
        'v-speed-dial--is-active': this.isActive
      };
    }

  },

  render() {
    let children = [];
    const data = {
      class: this.classes,
      onClick: () => this.isActive = !this.isActive
    };

    if (this.openOnHover) {
      data.onMouseenter = () => this.isActive = true;

      data.onMouseleave = () => this.isActive = false;
    }

    if (this.isActive) {
      let btnCount = 0;
      children = (getSlot(this) || []).map((b, i) => {
        const componentName = b.type && typeof b.type === 'object' && 'name' in b.type ? b.type.name : null;

        if (b.tag && (componentName === 'v-btn' || componentName === 'v-tooltip')) {
          btnCount++;
          return h('div', {
            style: {
              transitionDelay: btnCount * 0.05 + 's'
            },
            key: i
          }, [b]);
        } else {
          b.key = i;
          return b;
        }
      });
    }

    const list = h(TransitionGroup, {
      class: 'v-speed-dial__list',
      name: this.transition,
      mode: this.mode,
      origin: this.origin,
      tag: 'div'
    }, children);
    return withDirectives(h('div', data, [getSlot(this, 'activator'), list]), [[ClickOutside, () => this.isActive = false]]);
  }

});
//# sourceMappingURL=VSpeedDial.js.map