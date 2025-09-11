"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _console = require("../../util/console");

var _vue = require("vue");

/* @vue/component */
var _default = (0, _vue.defineComponent)({
  name: 'mobile',
  props: {
    mobileBreakpoint: {
      type: [Number, String],
      validator: function validator(v) {
        return !isNaN(Number(v)) || ['xs', 'sm', 'md', 'lg', 'xl'].includes(String(v));
      }
    }
  },
  computed: {
    $mobileBreakpoint: function $mobileBreakpoint() {
      return this.mobileBreakpoint || (this.$vuetify ? this.$vuetify.breakpoint.mobileBreakpoint : undefined);
    },
    isMobile: function isMobile() {
      var _this$$vuetify$breakp = this.$vuetify.breakpoint,
          mobile = _this$$vuetify$breakp.mobile,
          width = _this$$vuetify$breakp.width,
          name = _this$$vuetify$breakp.name,
          mobileBreakpoint = _this$$vuetify$breakp.mobileBreakpoint; // Check if local mobileBreakpoint matches
      // the application's mobileBreakpoint

      if (mobileBreakpoint === this.$mobileBreakpoint) return mobile;
      var mobileWidth = parseInt(this.$mobileBreakpoint, 10);
      var isNumber = !isNaN(mobileWidth);
      return isNumber ? width < mobileWidth : name === this.$mobileBreakpoint;
    }
  },
  created: function created() {
    /* istanbul ignore next */
    if (this.$attrs.hasOwnProperty('mobile-break-point')) {
      (0, _console.deprecate)('mobile-break-point', 'mobile-breakpoint', this);
    }
  }
});

exports.default = _default;
//# sourceMappingURL=index.js.map