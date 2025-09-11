"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _colorable = _interopRequireDefault(require("../../mixins/colorable"));

var _core = require("./helpers/core");

var _path = require("./helpers/path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _default2 = (0, _vue.defineComponent)({
  name: 'v-sparkline',
  mixins: [_colorable.default],
  inheritAttrs: false,
  props: {
    autoDraw: Boolean,
    autoDrawDuration: {
      type: Number,
      default: 2000
    },
    autoDrawEasing: {
      type: String,
      default: 'ease'
    },
    autoLineWidth: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'primary'
    },
    fill: {
      type: Boolean,
      default: false
    },
    gradient: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    gradientDirection: {
      type: String,
      validator: function validator(val) {
        return ['top', 'bottom', 'left', 'right'].includes(val);
      },
      default: 'top'
    },
    height: {
      type: [String, Number],
      default: 75
    },
    labels: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    labelSize: {
      type: [Number, String],
      default: 7
    },
    lineWidth: {
      type: [String, Number],
      default: 4
    },
    padding: {
      type: [String, Number],
      default: 8
    },
    showLabels: Boolean,
    smooth: {
      type: [Boolean, Number, String],
      default: false
    },
    type: {
      type: String,
      default: 'trend',
      validator: function validator(val) {
        return ['trend', 'bar'].includes(val);
      }
    },
    value: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    width: {
      type: [Number, String],
      default: 300
    }
  },
  data: function data() {
    return {
      lastLength: 0
    };
  },
  computed: {
    parsedPadding: function parsedPadding() {
      return Number(this.padding);
    },
    parsedWidth: function parsedWidth() {
      return Number(this.width);
    },
    parsedHeight: function parsedHeight() {
      return parseInt(this.height, 10);
    },
    parsedLabelSize: function parsedLabelSize() {
      return parseInt(this.labelSize, 10) || 7;
    },
    totalHeight: function totalHeight() {
      var height = this.parsedHeight;
      if (this.hasLabels) height += parseInt(this.labelSize, 10) * 1.5;
      return height;
    },
    totalWidth: function totalWidth() {
      var width = this.parsedWidth;
      if (this.type === 'bar') width = Math.max(this.value.length * this._lineWidth, width);
      return width;
    },
    totalValues: function totalValues() {
      return this.value.length;
    },
    _lineWidth: function _lineWidth() {
      if (this.autoLineWidth && this.type !== 'trend') {
        var totalPadding = this.parsedPadding * (this.totalValues + 1);
        return (this.parsedWidth - totalPadding) / this.totalValues;
      } else {
        return parseFloat(this.lineWidth) || 4;
      }
    },
    boundary: function boundary() {
      if (this.type === 'bar') return {
        minX: 0,
        maxX: this.totalWidth,
        minY: 0,
        maxY: this.parsedHeight
      };
      var padding = this.parsedPadding;
      return {
        minX: padding,
        maxX: this.totalWidth - padding,
        minY: padding,
        maxY: this.parsedHeight - padding
      };
    },
    hasLabels: function hasLabels() {
      return Boolean(this.showLabels || this.labels.length > 0 || this.$slots.label);
    },
    parsedLabels: function parsedLabels() {
      var labels = [];
      var points = this._values;
      var len = points.length;

      for (var i = 0; labels.length < len; i++) {
        var item = points[i];
        var value = this.labels[i];

        if (!value) {
          value = _typeof(item) === 'object' ? item.value : item;
        }

        labels.push({
          x: item.x,
          value: String(value)
        });
      }

      return labels;
    },
    normalizedValues: function normalizedValues() {
      return this.value.map(function (item) {
        return typeof item === 'number' ? item : item.value;
      });
    },
    _values: function _values() {
      return this.type === 'trend' ? (0, _core.genPoints)(this.normalizedValues, this.boundary) : (0, _core.genBars)(this.normalizedValues, this.boundary);
    },
    textY: function textY() {
      var y = this.parsedHeight;
      if (this.type === 'trend') y -= 4;
      return y;
    },
    _radius: function _radius() {
      return this.smooth === true ? 8 : Number(this.smooth);
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function handler() {
        var _this = this;

        this.$nextTick(function () {
          if (!_this.autoDraw || _this.type === 'bar' || !_this.$refs.path) return;
          var path = _this.$refs.path;
          var length = path.getTotalLength();

          if (!_this.fill) {
            path.style.transition = 'none';
            path.style.strokeDasharray = length + ' ' + length;
            path.style.strokeDashoffset = Math.abs(length - (_this.lastLength || 0)).toString();
            path.getBoundingClientRect();
            path.style.transition = "stroke-dashoffset ".concat(_this.autoDrawDuration, "ms ").concat(_this.autoDrawEasing);
            path.style.strokeDashoffset = '0';
          } else {
            path.style.transformOrigin = 'bottom center';
            path.style.transition = 'none';
            path.style.transform = "scaleY(0)";
            path.getBoundingClientRect();
            path.style.transition = "transform ".concat(_this.autoDrawDuration, "ms ").concat(_this.autoDrawEasing);
            path.style.transform = "scaleY(1)";
          }

          _this.lastLength = length;
        });
      }
    }
  },
  methods: {
    genGradient: function genGradient() {
      var gradientDirection = this.gradientDirection;
      var gradient = this.gradient.slice(); // Pushes empty string to force
      // a fallback to currentColor

      if (!gradient.length) gradient.push('');
      var len = Math.max(gradient.length - 1, 1);
      var stops = gradient.reverse().map(function (color, index) {
        return (0, _vue.h)('stop', {
          offset: index / len,
          'stop-color': color || 'currentColor'
        });
      });
      var instance = (0, _vue.getCurrentInstance)();
      return (0, _vue.h)('defs', [(0, _vue.h)('linearGradient', {
        id: instance === null || instance === void 0 ? void 0 : instance.uid,
        gradientUnits: 'userSpaceOnUse',
        x1: gradientDirection === 'left' ? '100%' : '0',
        y1: gradientDirection === 'top' ? '100%' : '0',
        x2: gradientDirection === 'right' ? '100%' : '0',
        y2: gradientDirection === 'bottom' ? '100%' : '0'
      }, stops)]);
    },
    genG: function genG(children) {
      return (0, _vue.h)('g', {
        style: {
          fontSize: '8',
          textAnchor: 'middle',
          dominantBaseline: 'mathematical',
          fill: 'currentColor'
        }
      }, children);
    },
    genPath: function genPath() {
      var points = (0, _core.genPoints)(this.normalizedValues, this.boundary);
      var instance = (0, _vue.getCurrentInstance)();
      return (0, _vue.h)('path', {
        d: (0, _path.genPath)(points, this._radius, this.fill, this.parsedHeight),
        fill: this.fill ? "url(#".concat(instance === null || instance === void 0 ? void 0 : instance.uid, ")") : 'none',
        stroke: this.fill ? 'none' : "url(#".concat(instance === null || instance === void 0 ? void 0 : instance.uid, ")"),
        ref: 'path'
      });
    },
    genLabels: function genLabels(offsetX) {
      var _this2 = this;

      var children = this.parsedLabels.map(function (item, i) {
        return (0, _vue.h)('text', {
          x: item.x + offsetX + _this2._lineWidth / 2,
          y: _this2.textY + _this2.parsedLabelSize * 0.75,
          'font-size': Number(_this2.labelSize) || 7
        }, [_this2.genLabel(item, i)]);
      });
      return this.genG(children);
    },
    genLabel: function genLabel(item, index) {
      return this.$slots.label ? this.$slots.label({
        index: index,
        value: item.value
      }) : item.value;
    },
    genBars: function genBars() {
      var _a, _b, _c;

      if (!this.value || this.totalValues < 2) return undefined;
      var bars = (0, _core.genBars)(this.normalizedValues, this.boundary);
      var offsetX = (Math.abs(bars[0].x - bars[1].x) - this._lineWidth) / 2;
      return (0, _vue.h)('svg', {
        display: 'block',
        viewBox: "0 0 ".concat(this.totalWidth, " ").concat(this.totalHeight)
      }, [this.genGradient(), this.genClipPath(bars, offsetX, this._lineWidth, 'sparkline-bar-' + ((_a = (0, _vue.getCurrentInstance)()) === null || _a === void 0 ? void 0 : _a.uid)), this.hasLabels ? this.genLabels(offsetX) : undefined, (0, _vue.h)('g', {
        'clip-path': "url(#sparkline-bar-".concat((_b = (0, _vue.getCurrentInstance)()) === null || _b === void 0 ? void 0 : _b.uid, "-clip)"),
        fill: "url(#".concat((_c = (0, _vue.getCurrentInstance)()) === null || _c === void 0 ? void 0 : _c.uid, ")")
      }, [(0, _vue.h)('rect', {
        x: 0,
        y: 0,
        width: this.totalWidth,
        height: this.height
      })])]);
    },
    genClipPath: function genClipPath(bars, offsetX, lineWidth, id) {
      var _this3 = this;

      var rounding = typeof this.smooth === 'number' ? this.smooth : this.smooth ? 2 : 0;
      return (0, _vue.h)('clipPath', {
        id: "".concat(id, "-clip")
      }, bars.map(function (item) {
        return (0, _vue.h)('rect', {
          x: item.x + offsetX,
          y: item.y,
          width: lineWidth,
          height: item.height,
          rx: rounding,
          ry: rounding
        }, [_this3.autoDraw ? (0, _vue.h)('animate', {
          attributeName: 'height',
          from: 0,
          to: item.height,
          dur: "".concat(_this3.autoDrawDuration, "ms"),
          fill: 'freeze'
        }) : undefined]);
      }));
    },
    genTrend: function genTrend() {
      return (0, _vue.h)('svg', this.setTextColor(this.color, _objectSpread(_objectSpread({}, this.$attrs), {}, {
        display: 'block',
        'stroke-width': this._lineWidth || 1,
        viewBox: "0 0 ".concat(this.width, " ").concat(this.totalHeight)
      })), [this.genGradient(), this.hasLabels && this.genLabels(-(this._lineWidth / 2)), this.genPath()]);
    }
  },
  render: function render() {
    if (this.totalValues < 2) return undefined;
    return this.type === 'trend' ? this.genTrend() : this.genBars();
  }
});

exports.default = _default2;
//# sourceMappingURL=VSparkline.js.map