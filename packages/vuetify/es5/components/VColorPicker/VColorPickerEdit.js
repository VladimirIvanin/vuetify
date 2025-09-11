"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.modes = void 0;

var _vue = require("vue");

require("../../../src/components/VColorPicker/VColorPickerEdit.sass");

var _VBtn = _interopRequireDefault(require("../VBtn"));

var _VIcon = _interopRequireDefault(require("../VIcon"));

var _colorUtils = require("../../util/colorUtils");

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var modes = {
  rgba: {
    inputs: [['r', 255, 'int'], ['g', 255, 'int'], ['b', 255, 'int'], ['a', 1, 'float']],
    from: _util.fromRGBA
  },
  hsla: {
    inputs: [['h', 360, 'int'], ['s', 1, 'float'], ['l', 1, 'float'], ['a', 1, 'float']],
    from: _util.fromHSLA
  },
  hexa: {
    from: _util.fromHexa
  }
};
exports.modes = modes;

var _default2 = (0, _vue.defineComponent)({
  name: 'v-color-picker-edit',
  props: {
    color: {
      type: Object,
      required: true
    },
    disabled: Boolean,
    hideAlpha: Boolean,
    hideModeSwitch: Boolean,
    mode: {
      type: String,
      default: 'rgba',
      validator: function validator(v) {
        return Object.keys(modes).includes(v);
      }
    }
  },
  emits: ['update:color', 'update:mode'],
  data: function data() {
    return {
      internalMode: this.mode
    };
  },
  computed: {
    currentMode: function currentMode() {
      return modes[this.internalMode];
    }
  },
  watch: {
    mode: function mode(_mode) {
      this.internalMode = _mode;
    }
  },
  methods: {
    getValue: function getValue(v, type) {
      if (type === 'float') return Math.round(v * 100) / 100;else if (type === 'int') return Math.round(v);else return 0;
    },
    parseValue: function parseValue(v, type) {
      if (type === 'float') return parseFloat(v);else if (type === 'int') return parseInt(v, 10) || 0;else return 0;
    },
    changeMode: function changeMode() {
      var modeKeys = Object.keys(modes);
      var index = modeKeys.indexOf(this.internalMode);
      var newMode = modeKeys[(index + 1) % modeKeys.length];
      this.internalMode = newMode;
      this.$emit('update:mode', newMode);
    },
    genInput: function genInput(target, attrs, value, onChange) {
      return (0, _vue.h)('div', {
        class: 'v-color-picker__input'
      }, [(0, _vue.h)('input', _objectSpread(_objectSpread({
        key: target
      }, attrs), {}, {
        value: value,
        onChange: onChange
      })), (0, _vue.h)('span', target.toUpperCase())]);
    },
    genInputs: function genInputs() {
      var _this = this;

      if (this.internalMode === 'hexa') {
        var hex = this.color.hexa;
        var value = this.hideAlpha && hex.endsWith('FF') ? hex.substr(0, 7) : hex;
        return this.genInput('hex', {
          maxlength: this.hideAlpha ? 7 : 9,
          disabled: this.disabled
        }, value, function (e) {
          var el = e.target;

          _this.$emit('update:color', _this.currentMode.from((0, _colorUtils.parseHex)(el.value)));
        });
      } else {
        var inputs = this.hideAlpha ? this.currentMode.inputs.slice(0, -1) : this.currentMode.inputs;
        return inputs.map(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 3),
              target = _ref2[0],
              max = _ref2[1],
              type = _ref2[2];

          var value = _this.color[_this.internalMode];
          return _this.genInput(target, {
            type: 'number',
            min: 0,
            max: max,
            step: type === 'float' ? '0.01' : type === 'int' ? '1' : undefined,
            disabled: _this.disabled
          }, _this.getValue(value[target], type), function (e) {
            var el = e.target;

            var newVal = _this.parseValue(el.value || '0', type);

            _this.$emit('update:color', _this.currentMode.from(Object.assign({}, value, _defineProperty({}, target, newVal)), _this.color.alpha));
          });
        });
      }
    },
    genSwitch: function genSwitch() {
      return (0, _vue.h)(_VBtn.default, {
        small: true,
        icon: true,
        disabled: this.disabled,
        onClick: this.changeMode
      }, {
        default: function _default() {
          return [(0, _vue.h)(_VIcon.default, {}, '$unfold')];
        }
      });
    }
  },
  render: function render() {
    return (0, _vue.h)('div', {
      class: 'v-color-picker__edit'
    }, [this.genInputs(), !this.hideModeSwitch && this.genSwitch()]);
  }
});

exports.default = _default2;
//# sourceMappingURL=VColorPickerEdit.js.map