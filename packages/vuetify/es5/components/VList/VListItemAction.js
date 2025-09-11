"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/* @vue/component */
var _default = (0, _vue.defineComponent)({
  name: 'v-list-item-action',
  render: function render() {
    var _a, _b;

    var _this$$attrs = this.$attrs,
        attrClass = _this$$attrs.class,
        otherAttrs = _objectWithoutProperties(_this$$attrs, ["class"]);

    var className = attrClass ? "v-list-item__action ".concat(attrClass) : 'v-list-item__action';
    var children = ((_b = (_a = this.$slots).default) === null || _b === void 0 ? void 0 : _b.call(_a)) || [];
    var filteredChild = children.filter(function (vnode) {
      return (vnode === null || vnode === void 0 ? void 0 : vnode.type) !== _vue.Comment && (vnode === null || vnode === void 0 ? void 0 : vnode.children) !== ' ';
    });
    if (filteredChild.length > 1) className += ' v-list-item__action--stack';
    return (0, _vue.h)('div', _objectSpread(_objectSpread({}, otherAttrs), {}, {
      class: className
    }), children);
  }
});

exports.default = _default;
//# sourceMappingURL=VListItemAction.js.map