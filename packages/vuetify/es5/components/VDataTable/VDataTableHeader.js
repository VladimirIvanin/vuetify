"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../../../src/components/VDataTable/VDataTableHeader.sass");

var _VDataTableHeaderMobile = _interopRequireDefault(require("./VDataTableHeaderMobile"));

var _VDataTableHeaderDesktop = _interopRequireDefault(require("./VDataTableHeaderDesktop"));

var _header = _interopRequireDefault(require("./mixins/header"));

var _vue = require("vue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* @vue/component */
var _default = (0, _vue.defineComponent)({
  name: 'v-data-table-header',
  props: _objectSpread(_objectSpread({}, _header.default.props), {}, {
    mobile: Boolean
  }),
  render: function render() {
    var props = this.$props;

    var data = _objectSpread(_objectSpread({}, this.$attrs), props); // dedupeModelListeners(data)


    if (props.mobile) {
      return (0, _vue.h)(_VDataTableHeaderMobile.default, data, this.$slots);
    } else {
      return (0, _vue.h)(_VDataTableHeaderDesktop.default, data, this.$slots);
    }
  }
});

exports.default = _default;
//# sourceMappingURL=VDataTableHeader.js.map