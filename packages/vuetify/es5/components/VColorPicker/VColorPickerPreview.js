"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

require("../../../src/components/VColorPicker/VColorPickerPreview.sass");

var _VSlider = _interopRequireDefault(require("../VSlider/VSlider"));

var _colorUtils = require("../../util/colorUtils");

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = (0, _vue.defineComponent)({
  name: 'v-color-picker-preview',
  props: {
    color: {
      type: Object,
      required: true
    },
    disabled: Boolean,
    hideAlpha: Boolean
  },
  emits: ['update:color'],
  methods: {
    genAlpha: function genAlpha() {
      var _this = this;

      var _a;

      if (!this.color) return (0, _vue.h)('div');
      return this.genTrack({
        class: 'v-color-picker__alpha',
        thumbColor: 'grey lighten-2',
        hideDetails: true,
        modelValue: this.color.alpha,
        step: 0,
        min: 0,
        max: 1,
        style: {
          backgroundImage: this.disabled ? undefined : "linear-gradient(to ".concat(((_a = this.$vuetify) === null || _a === void 0 ? void 0 : _a.rtl) ? 'left' : 'right', ", transparent, ").concat((0, _colorUtils.RGBtoCSS)(this.color.rgba), ")")
        },
        'onUpdate:modelValue': function onUpdateModelValue(val) {
          if (_this.color && _this.color.alpha !== val) {
            _this.$emit('update:color', (0, _util.fromHSVA)(_objectSpread(_objectSpread({}, _this.color.hsva), {}, {
              a: val
            })));
          }
        }
      });
    },
    genHue: function genHue() {
      var _this2 = this;

      if (!this.color) return (0, _vue.h)('div');
      return this.genTrack({
        class: 'v-color-picker__hue',
        thumbColor: 'grey lighten-2',
        hideDetails: true,
        modelValue: this.color.hue,
        step: 0,
        min: 0,
        max: 360,
        'onUpdate:modelValue': function onUpdateModelValue(val) {
          if (_this2.color && _this2.color.hue !== val) {
            _this2.$emit('update:color', (0, _util.fromHSVA)(_objectSpread(_objectSpread({}, _this2.color.hsva), {}, {
              h: val
            })));
          }
        }
      });
    },
    genTrack: function genTrack(options) {
      return (0, _vue.h)(_VSlider.default, _objectSpread({
        class: 'v-color-picker__track',
        disabled: this.disabled
      }, options));
    },
    genSliders: function genSliders() {
      return (0, _vue.h)('div', {
        class: 'v-color-picker__sliders'
      }, [this.genHue(), !this.hideAlpha && this.genAlpha()]);
    },
    genDot: function genDot() {
      return (0, _vue.h)('div', {
        class: 'v-color-picker__dot'
      }, [(0, _vue.h)('div', {
        style: {
          background: this.color ? (0, _colorUtils.RGBAtoCSS)(this.color.rgba) : 'transparent'
        }
      })]);
    }
  },
  render: function render() {
    return (0, _vue.h)('div', {
      class: ['v-color-picker__preview', {
        'v-color-picker__preview--hide-alpha': this.hideAlpha
      }]
    }, [this.genDot(), this.genSliders()]);
  }
});

exports.default = _default;
//# sourceMappingURL=VColorPickerPreview.js.map