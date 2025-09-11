"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

/**
 * SSRBootable
 *
 * @mixin
 *
 * Used in layout components (drawer, toolbar, content)
 * to avoid an entry animation when using SSR
 */
var _default = (0, _vue.defineComponent)({
  name: 'ssr-bootable',
  data: function data() {
    return {
      isBooted: false
    };
  },
  mounted: function mounted() {
    var _this = this;

    // Use setAttribute instead of dataset
    // because dataset does not work well
    // with unit tests
    window.requestAnimationFrame(function () {
      _this.$el.setAttribute('data-booted', 'true');

      _this.isBooted = true;
    });
  }
});

exports.default = _default;
//# sourceMappingURL=index.js.map