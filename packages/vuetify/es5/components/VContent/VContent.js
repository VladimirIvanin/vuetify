"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _VMain = _interopRequireDefault(require("../VMain/VMain"));

var _console = require("../../util/console");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Types
// Extensions

/* @vue/component */
var _default = (0, _vue.defineComponent)({
  name: 'v-main',
  extends: _VMain.default,
  created: function created() {
    (0, _console.deprecate)('v-content', 'v-main', this);
  },
  render: function render() {
    // Add the legacy class names
    var node = _VMain.default.render.call(this, _vue.h);

    node.data.staticClass += ' v-content';
    node.children[0].data.staticClass += ' v-content__wrap';
    return (0, _vue.h)(node.tag, node.data, node.children);
  }
});

exports.default = _default;
//# sourceMappingURL=VContent.js.map