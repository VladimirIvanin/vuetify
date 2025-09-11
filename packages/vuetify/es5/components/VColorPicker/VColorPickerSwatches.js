"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

require("../../../src/components/VColorPicker/VColorPickerSwatches.sass");

var _VIcon = _interopRequireDefault(require("../VIcon"));

var _colors = _interopRequireDefault(require("../../util/colors"));

var _util = require("./util");

var _helpers = require("../../util/helpers");

var _colorUtils = require("../../util/colorUtils");

var _themeable = _interopRequireDefault(require("../../mixins/themeable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Styles
// Components
// Helpers
// Mixins
function parseDefaultColors(colors) {
  return Object.keys(colors).map(function (key) {
    var color = colors[key];
    return color.base ? [color.base, color.darken4, color.darken3, color.darken2, color.darken1, color.lighten1, color.lighten2, color.lighten3, color.lighten4, color.lighten5] : [color.black, color.white, color.transparent];
  });
}

var white = (0, _util.fromHex)('#FFFFFF').rgba;
var black = (0, _util.fromHex)('#000000').rgba;

var _default2 = (0, _vue.defineComponent)({
  name: 'v-color-picker-swatches',
  mixins: [_themeable.default],
  props: {
    swatches: {
      type: Array,
      default: function _default() {
        return parseDefaultColors(_colors.default);
      }
    },
    disabled: Boolean,
    color: {
      type: Object,
      required: true
    },
    maxWidth: [Number, String],
    maxHeight: [Number, String]
  },
  emits: ['update:color'],
  methods: {
    genColor: function genColor(color) {
      var _this = this;

      var content = (0, _vue.h)('div', {
        style: {
          background: color
        }
      }, [(0, _helpers.deepEqual)(this.color, (0, _util.parseColor)(color, null)) && (0, _vue.h)(_VIcon.default, {
        small: true,
        dark: (0, _colorUtils.contrastRatio)(this.color.rgba, white) > 2 && this.color.alpha > 0.5,
        light: (0, _colorUtils.contrastRatio)(this.color.rgba, black) > 2 && this.color.alpha > 0.5
      }, '$success')]);
      return (0, _vue.h)('div', {
        class: 'v-color-picker__color',
        onClick: function onClick() {
          if (!_this.disabled) {
            _this.$emit('update:color', (0, _util.fromHex)(color === 'transparent' ? '#00000000' : color));
          }
        }
      }, [content]);
    },
    genSwatches: function genSwatches() {
      var _this2 = this;

      return this.swatches.map(function (swatch) {
        var colors = swatch.map(_this2.genColor);
        return (0, _vue.h)('div', {
          class: 'v-color-picker__swatch'
        }, colors);
      });
    }
  },
  render: function render() {
    return (0, _vue.h)('div', {
      class: ['v-color-picker__swatches', this.themeClasses],
      style: {
        maxWidth: (0, _helpers.convertToUnit)(this.maxWidth),
        maxHeight: (0, _helpers.convertToUnit)(this.maxHeight)
      }
    }, [(0, _vue.h)('div', this.genSwatches())]);
  }
});

exports.default = _default2;
//# sourceMappingURL=VColorPickerSwatches.js.map