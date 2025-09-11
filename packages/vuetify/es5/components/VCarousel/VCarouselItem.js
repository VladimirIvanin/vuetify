"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _VWindowItem = _interopRequireDefault(require("../VWindow/VWindowItem"));

var _VImg = require("../VImg");

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _helpers = require("../../util/helpers");

var _routable = _interopRequireDefault(require("../../mixins/routable"));

var _vue = require("vue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Types
var baseMixins = (0, _mixins.default)(_VWindowItem.default, _routable.default);
/* @vue/component */

var _default2 = baseMixins.extend({
  name: 'v-carousel-item',
  inject: {
    parentTheme: {
      default: {
        isDark: false
      }
    }
  },
  // pass down the parent's theme
  provide: function provide() {
    return {
      theme: this.parentTheme
    };
  },
  inheritAttrs: false,
  methods: {
    genDefaultSlot: function genDefaultSlot() {
      var _this = this;

      return [(0, _vue.h)(_VImg.VImg, _objectSpread(_objectSpread({
        class: 'v-carousel__item'
      }, this.$attrs), {}, {
        height: this.windowGroup.internalHeight
      }, this.$listeners), {
        default: function _default() {
          return (0, _helpers.getSlot)(_this);
        },
        placeholder: this.$slots.placeholder
      })];
    },
    genWindowItem: function genWindowItem() {
      var _this$generateRouteLi = this.generateRouteLink(),
          tag = _this$generateRouteLi.tag,
          data = _this$generateRouteLi.data,
          directives = _this$generateRouteLi.directives;

      data.class['v-window-item'] = true;
      directives.push([_vue.vShow, this.isActive]);
      return (0, _vue.withDirectives)((0, _vue.h)(tag, data, this.genDefaultSlot()), directives);
    }
  }
});

exports.default = _default2;
//# sourceMappingURL=VCarouselItem.js.map