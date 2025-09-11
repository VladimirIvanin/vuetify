"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

require("../../../src/components/VProgressCircular/VProgressCircular.sass");

var _intersect = require("../../directives/intersect");

var _colorable = _interopRequireDefault(require("../../mixins/colorable"));

var _helpers = require("../../util/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* @vue/component */
var _default = (0, _vue.defineComponent)({
  name: 'v-progress-circular',
  extends: _colorable.default,
  props: {
    button: Boolean,
    indeterminate: Boolean,
    rotate: {
      type: [Number, String],
      default: 0
    },
    size: {
      type: [Number, String],
      default: 32
    },
    width: {
      type: [Number, String],
      default: 4
    },
    value: {
      type: [Number, String],
      default: 0
    }
  },
  data: function data() {
    return {
      radius: 20,
      isVisible: true
    };
  },
  computed: {
    calculatedSize: function calculatedSize() {
      return Number(this.size) + (this.button ? 8 : 0);
    },
    circumference: function circumference() {
      return 2 * Math.PI * this.radius;
    },
    classes: function classes() {
      return {
        'v-progress-circular--visible': this.isVisible,
        'v-progress-circular--indeterminate': this.indeterminate,
        'v-progress-circular--button': this.button
      };
    },
    normalizedValue: function normalizedValue() {
      var numValue = parseFloat(this.value);

      if (numValue < 0) {
        return 0;
      }

      if (numValue > 100) {
        return 100;
      }

      return numValue;
    },
    strokeDashArray: function strokeDashArray() {
      return Math.round(this.circumference * 1000) / 1000;
    },
    strokeDashOffset: function strokeDashOffset() {
      return (100 - this.normalizedValue) / 100 * this.circumference + 'px';
    },
    strokeWidth: function strokeWidth() {
      return Number(this.width) / +this.size * this.viewBoxSize * 2;
    },
    styles: function styles() {
      return {
        height: (0, _helpers.convertToUnit)(this.calculatedSize),
        width: (0, _helpers.convertToUnit)(this.calculatedSize)
      };
    },
    svgStyles: function svgStyles() {
      return {
        transform: "rotate(".concat(Number(this.rotate), "deg)")
      };
    },
    viewBoxSize: function viewBoxSize() {
      return this.radius / (1 - Number(this.width) / +this.size);
    }
  },
  methods: {
    genCircle: function genCircle(name, offset) {
      return (0, _vue.h)('circle', {
        class: "v-progress-circular__".concat(name),
        fill: 'transparent',
        cx: 2 * this.viewBoxSize,
        cy: 2 * this.viewBoxSize,
        r: this.radius,
        'stroke-width': this.strokeWidth,
        'stroke-dasharray': this.strokeDashArray,
        'stroke-dashoffset': offset
      });
    },
    genSvg: function genSvg() {
      var children = [this.indeterminate || this.genCircle('underlay', 0), this.genCircle('overlay', this.strokeDashOffset)];
      return (0, _vue.h)('svg', {
        style: this.svgStyles,
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: "".concat(this.viewBoxSize, " ").concat(this.viewBoxSize, " ").concat(2 * this.viewBoxSize, " ").concat(2 * this.viewBoxSize)
      }, children);
    },
    genInfo: function genInfo() {
      return (0, _vue.h)('div', {
        class: 'v-progress-circular__info'
      }, (0, _helpers.getSlot)(this));
    },
    onObserve: function onObserve(entries, observer, isIntersecting) {
      this.isVisible = isIntersecting;
    }
  },
  render: function render() {
    return (0, _vue.withDirectives)((0, _vue.h)('div', this.setTextColor(this.color, _objectSpread({
      class: ['v-progress-circular', this.classes],
      role: 'progressbar',
      'aria-valuemin': 0,
      'aria-valuemax': 100,
      'aria-valuenow': this.indeterminate ? undefined : this.normalizedValue,
      style: this.styles
    }, this.$listeners)), [this.genSvg(), this.genInfo()]), [[_intersect.Intersect, this.onObserve]]);
  }
});

exports.default = _default;
//# sourceMappingURL=VProgressCircular.js.map