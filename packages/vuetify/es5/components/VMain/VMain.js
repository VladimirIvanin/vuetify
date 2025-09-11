"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../../../src/components/VMain/VMain.sass");

var _ssrBootable = _interopRequireDefault(require("../../mixins/ssr-bootable"));

var _helpers = require("../../util/helpers");

var _vue = require("vue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Styles
// Mixins
// Types

/* @vue/component */
var _default = (0, _vue.defineComponent)({
  name: 'v-main',
  extends: _ssrBootable.default,
  props: {
    tag: {
      type: String,
      default: 'main'
    }
  },
  computed: {
    styles: function styles() {
      var _this$$vuetify$applic = this.$vuetify.application,
          bar = _this$$vuetify$applic.bar,
          top = _this$$vuetify$applic.top,
          right = _this$$vuetify$applic.right,
          footer = _this$$vuetify$applic.footer,
          insetFooter = _this$$vuetify$applic.insetFooter,
          bottom = _this$$vuetify$applic.bottom,
          left = _this$$vuetify$applic.left;
      return {
        paddingTop: "".concat(top + bar, "px"),
        paddingRight: "".concat(right, "px"),
        paddingBottom: "".concat(footer + insetFooter + bottom, "px"),
        paddingLeft: "".concat(left, "px")
      };
    }
  },
  render: function render() {
    var data = {
      class: 'v-main',
      style: this.styles,
      ref: 'main'
    };
    return (0, _vue.h)(this.tag, data, [(0, _vue.h)('div', {
      class: 'v-main__wrap'
    }, (0, _helpers.getSlot)(this))]);
  }
});

exports.default = _default;
//# sourceMappingURL=VMain.js.map