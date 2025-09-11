import { defineComponent, resolveComponent } from 'vue'; // Directives

import Ripple from '../../directives/ripple'; // Utilities

import { getObjectValueByPath } from '../../util/helpers';
export default defineComponent({
  name: 'routable',
  directives: {
    Ripple
  },
  props: {
    activeClass: String,
    append: Boolean,
    disabled: Boolean,
    exact: {
      type: Boolean,
      default: undefined
    },
    exactPath: Boolean,
    exactActiveClass: String,
    link: Boolean,
    href: [String, Object],
    to: [String, Object],
    nuxt: Boolean,
    replace: Boolean,
    ripple: {
      type: [Boolean, Object],
      default: null
    },
    tag: String,
    target: String,
    notALink: Boolean
  },
  data: () => ({
    isActive: false,
    proxyClass: ''
  }),
  computed: {
    classes() {
      const classes = {};
      if (this.to) return classes;
      const activeClass = this.activeClass || ('$activeClass' in this ? this.$activeClass : undefined); // const activeClass = this.activeClass || this.$activeClass

      if (activeClass) classes[activeClass] = this.isActive;
      if (this.proxyClass) classes[this.proxyClass] = this.isActive;
      return classes;
    },

    computedRipple() {
      var _a;

      return (_a = this.ripple) !== null && _a !== void 0 ? _a : !this.disabled && this.isClickable;
    },

    isClickable() {
      var _a;

      if (this.notALink) return false;
      if (this.disabled) return false;
      return Boolean(this.isLink || this.$attrs.onClick || this.$attrs["on!click"] || this.$attrs.tabindex || ((_a = this.$props) === null || _a === void 0 ? void 0 : _a.onClick));
    },

    isLink() {
      return this.to || this.href || this.link;
    },

    styles: () => ({})
  },
  watch: {
    $route: 'onRouteChange'
  },

  mounted() {
    this.onRouteChange();
  },

  methods: {
    generateRouteLink() {
      let exact = this.exact;
      let tag;
      const directives = [[Ripple, this.computedRipple]];
      const data = {
        tabindex: 'tabindex' in this.$attrs ? this.$attrs.tabindex : undefined,
        class: this.classes,
        style: this.styles,
        ...this.$listeners,
        ...('click' in this ? {
          onClick: this.click
        } : undefined),
        ref: 'link'
      };

      if (typeof this.exact === 'undefined') {
        exact = this.to === '/' || this.to === Object(this.to) && this.to.path === '/';
      }

      if (this.to) {
        // Add a special activeClass hook
        // for component level styles
        let activeClass = this.activeClass;
        let exactActiveClass = this.exactActiveClass || activeClass;

        if (this.proxyClass) {
          activeClass = `${activeClass} ${this.proxyClass}`.trim();
          exactActiveClass = `${exactActiveClass} ${this.proxyClass}`.trim();
        }

        tag = resolveComponent(this.nuxt ? 'nuxt-link' : 'router-link');
        Object.assign(data, {
          to: this.to,
          exact,
          exactPath: this.exactPath,
          activeClass,
          exactActiveClass,
          append: this.append,
          replace: this.replace
        });
      } else {
        tag = this.href && 'a' || this.tag || 'div';
        if (tag === 'a' && this.href) data.href = this.href;
      }

      if (this.target) data.target = this.target;
      return {
        tag,
        data,
        directives
      };
    },

    onRouteChange() {
      if (!this.to || !this.$refs.link || !this.$route) return;
      const activeClass = `${this.activeClass || ''} ${this.proxyClass || ''}`.trim();
      const exactActiveClass = `${this.exactActiveClass || ''} ${this.proxyClass || ''}`.trim() || activeClass;
      const path = '_vnode.data.class.' + (this.exact ? exactActiveClass : activeClass);
      this.$nextTick(() => {
        /* istanbul ignore else */
        if (!getObjectValueByPath(this.$refs.link, path) === this.isActive) {
          this.toggle();
        }
      });
    },

    toggle() {
      this.isActive = !this.isActive;
    }

  }
});
//# sourceMappingURL=index.js.map