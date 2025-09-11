"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _measurable = _interopRequireDefault(require("../../mixins/measurable"));

var _toggleable = _interopRequireDefault(require("../../mixins/toggleable"));

var _intersect = _interopRequireDefault(require("../../directives/intersect"));

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _helpers = require("../../util/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default2 = (0, _mixins.default)(_measurable.default, _toggleable.default).extend({
  name: 'VLazy',
  emits: ['update:modelValue'],
  props: {
    options: {
      type: Object,
      // For more information on types, navigate to:
      // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
      default: function _default() {
        return {
          root: undefined,
          rootMargin: undefined,
          threshold: undefined
        };
      }
    },
    tag: {
      type: String,
      default: 'div'
    },
    transition: {
      type: String,
      default: 'fade-transition'
    }
  },
  computed: {
    styles: function styles() {
      return _objectSpread({}, this.measurableStyles);
    }
  },
  methods: {
    genContent: function genContent() {
      var children = this.isActive && (0, _helpers.getSlot)(this);
      return this.transition ? (0, _vue.h)(_vue.Transition, {
        name: this.transition
      }, children) : children;
    },
    onObserve: function onObserve(entries, observer, isIntersecting) {
      if (this.isActive) return;
      this.isActive = isIntersecting;
    }
  },
  render: function render() {
    return (0, _vue.withDirectives)((0, _vue.h)(this.tag, _objectSpread(_objectSpread({
      class: 'v-lazy'
    }, this.$attrs), {}, {
      style: this.styles
    }), [this.genContent()]), [[_intersect.default, {
      handler: this.onObserve,
      options: this.options
    }]]);
  }
});

exports.default = _default2;
//# sourceMappingURL=VLazy.js.map