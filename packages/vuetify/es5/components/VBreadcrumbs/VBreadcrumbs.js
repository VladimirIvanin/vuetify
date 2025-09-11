"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

require("../../../src/components/VBreadcrumbs/VBreadcrumbs.sass");

var _VBreadcrumbsItem = _interopRequireDefault(require("./VBreadcrumbsItem"));

var _VBreadcrumbsDivider = _interopRequireDefault(require("./VBreadcrumbsDivider"));

var _themeable = _interopRequireDefault(require("../../mixins/themeable"));

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _helpers = require("../../util/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default2 = (0, _mixins.default)(_themeable.default
/* @vue/component */
).extend({
  name: 'v-breadcrumbs',
  props: {
    divider: {
      type: String,
      default: '/'
    },
    items: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    large: Boolean
  },
  computed: {
    classes: function classes() {
      return _objectSpread({
        'v-breadcrumbs--large': this.large
      }, this.themeClasses);
    }
  },
  methods: {
    genDivider: function genDivider() {
      var _this = this;

      return (0, _vue.h)(_VBreadcrumbsDivider.default, {}, function () {
        return _this.$slots.divider ? _this.$slots.divider : _this.divider;
      });
    },
    genItems: function genItems() {
      var _this2 = this;

      var items = [];
      var hasSlot = !!this.$slots.item;
      var keys = [];

      var _loop = function _loop(i) {
        var item = _this2.items[i];
        keys.push(item.text);
        if (hasSlot) items.push(_this2.$slots.item({
          item: item
        }));else items.push((0, _vue.h)(_VBreadcrumbsItem.default, _objectSpread({
          key: keys.join('.')
        }, item), function () {
          return [item.text];
        }));
        if (i < _this2.items.length - 1) items.push(_this2.genDivider());
      };

      for (var i = 0; i < this.items.length; i++) {
        _loop(i);
      }

      return items;
    }
  },
  render: function render() {
    var children = (0, _helpers.getSlot)(this) || this.genItems();
    return (0, _vue.h)('ul', {
      class: ['v-breadcrumbs', this.classes]
    }, children);
  }
});

exports.default = _default2;
//# sourceMappingURL=VBreadcrumbs.js.map