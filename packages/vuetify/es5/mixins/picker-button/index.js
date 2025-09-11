"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _colorable = _interopRequireDefault(require("../colorable"));

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _helpers = require("../../util/helpers");

var _vue = require("vue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* @vue/component */
var _default = (0, _mixins.default)(_colorable.default).extend({
  methods: {
    genPickerButton: function genPickerButton(prop, value, content) {
      var _this = this;

      var readonly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var staticClass = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
      var active = this[prop] === value;

      var onClick = function onClick(event) {
        event.stopPropagation();

        _this.$emit("update:".concat((0, _helpers.kebabCase)(prop)), value);
      };

      return (0, _vue.h)('div', _objectSpread({
        class: ["v-picker__title__btn ".concat(staticClass).trim(), {
          'v-picker__title__btn--active': active,
          'v-picker__title__btn--readonly': readonly
        }]
      }, active || readonly ? {} : {
        onClick: onClick
      }), Array.isArray(content) ? content : [content]);
    }
  }
});

exports.default = _default;
//# sourceMappingURL=index.js.map