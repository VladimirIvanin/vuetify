"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _VProgressLinear = _interopRequireDefault(require("../../components/VProgressLinear"));

var _helpers = require("../../util/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Loadable
 *
 * @mixin
 *
 * Used to add linear progress bar to components
 * Can use a default bar with a specific color
 * or designate a custom progress linear bar
 */

/* @vue/component */
var _default = (0, _vue.defineComponent)({
  name: 'loadable',
  props: {
    loading: {
      type: [Boolean, String],
      default: false
    },
    loaderHeight: {
      type: [Number, String],
      default: 2
    }
  },
  methods: {
    genProgress: function genProgress() {
      if (this.loading === false) return null;
      return (0, _helpers.getSlot)(this, 'progress') || (0, _vue.h)(_VProgressLinear.default, {
        absolute: true,
        color: this.loading === true || this.loading === '' ? this.color || 'primary' : this.loading,
        height: this.loaderHeight,
        indeterminate: true
      });
    }
  }
});

exports.default = _default;
//# sourceMappingURL=index.js.map