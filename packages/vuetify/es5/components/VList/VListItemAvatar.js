"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _VAvatar = _interopRequireDefault(require("../VAvatar"));

var _vue = require("vue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* @vue/component */
var _default = (0, _vue.defineComponent)({
  name: 'v-list-item-avatar',
  extends: _VAvatar.default,
  props: {
    horizontal: Boolean,
    size: {
      type: [Number, String],
      default: 40
    }
  },
  computed: {
    classes: function classes() {
      return _objectSpread(_objectSpread({
        'v-list-item__avatar--horizontal': this.horizontal
      }, _VAvatar.default.computed.classes.call(this)), {}, {
        'v-avatar--tile': this.tile || this.horizontal,
        'v-list-item__avatar': true
      });
    }
  },
  render: function render() {
    return _VAvatar.default.render.call(this);
  }
});

exports.default = _default;
//# sourceMappingURL=VListItemAvatar.js.map