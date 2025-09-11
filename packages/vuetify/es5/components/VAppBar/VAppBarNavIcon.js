"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _VIcon = _interopRequireDefault(require("../VIcon"));

var _VBtn = _interopRequireDefault(require("../VBtn/VBtn"));

var _vue = require("vue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Components
// Types

/* @vue/component */
var _default = (0, _vue.defineComponent)({
  name: 'v-app-bar-nav-icon',
  functional: true,
  render: function render() {
    var _a, _b;

    var data = this.$attrs;
    var d = Object.assign({}, data, {
      class: "v-app-bar__nav-icon ".concat(data.class || '').trim(),
      icon: true
    });
    var defaultSlot = (_b = (_a = this.$slots).default) === null || _b === void 0 ? void 0 : _b.call(_a);
    return (0, _vue.h)(_VBtn.default, d, defaultSlot || function () {
      return [(0, _vue.h)(_VIcon.default, {}, function () {
        return '$menu';
      })];
    });
  }
});

exports.default = _default;
//# sourceMappingURL=VAppBarNavIcon.js.map