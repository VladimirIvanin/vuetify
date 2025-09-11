import { h, withDirectives } from 'vue'; // Mixins

import { factory as GroupableFactory } from '../../mixins/groupable';
import Routable from '../../mixins/routable';
import Themeable from '../../mixins/themeable'; // Utilities

import { getSlot, keyCodes } from './../../util/helpers';
import mixins from '../../util/mixins';
const baseMixins = mixins(Routable, // Must be after routable
// to overwrite activeClass
GroupableFactory('tabsBar'), Themeable);
export default baseMixins.extend({
  name: 'v-tab',
  emits: ['change', 'click', 'keydown'],
  props: {
    ripple: {
      type: [Boolean, Object],
      default: true
    },
    tabValue: {
      required: false
    }
  },
  data: () => ({
    proxyClass: 'v-tab--active'
  }),
  computed: {
    classes() {
      return {
        'v-tab': true,
        ...Routable.computed.classes.call(this),
        'v-tab--disabled': this.disabled,
        ...this.groupClasses
      };
    },

    value() {
      if (this.tabValue != null) return this.tabValue;
      let to = this.to || this.href;
      if (to == null) return to;

      if (this.$router && this.to === Object(this.to)) {
        const resolve = this.$router.resolve(this.to, this.$route, this.append);
        to = resolve.href;
      }

      return to.replace('#', '');
    }

  },
  methods: {
    click(e) {
      // Prevent keyboard actions
      // from children elements
      // within disabled tabs
      if (this.disabled) {
        e.preventDefault();
        return;
      } // If user provides an
      // actual link, do not
      // prevent default


      if (this.href && this.href.indexOf('#') > -1) e.preventDefault();
      if (e.detail) this.$el.blur();
      this.$emit('click', e);
      this.to || this.toggle();
    },

    toggle() {
      // VItemGroup treats a change event as a click
      if (!this.isActive || !this.tabsBar.mandatory && !this.to) {
        this.$emit('change');
        this.$emitLegacy('change');
      }
    }

  },

  render() {
    let {
      tag,
      data,
      directives
    } = this.generateRouteLink();
    data = { ...data,
      'aria-selected': String(this.isActive),
      role: 'tab',
      tabindex: this.disabled ? -1 : 0,
      onKeydown: e => {
        if (e.keyCode === keyCodes.enter) this.click(e);
        this.$emit('keydown', e);
      }
    };
    return withDirectives(h(tag, data, getSlot(this)), directives);
  }

});
//# sourceMappingURL=VTab.js.map