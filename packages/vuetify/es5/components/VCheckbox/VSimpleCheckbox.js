"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../../../src/components/VCheckbox/VSimpleCheckbox.sass");

var _ripple = _interopRequireDefault(require("../../directives/ripple"));

var _vue = require("vue");

var _VIcon = require("../VIcon");

var _colorable = _interopRequireDefault(require("../../mixins/colorable"));

var _themeable = _interopRequireDefault(require("../../mixins/themeable"));

var _mergeData = _interopRequireDefault(require("../../util/mergeData"));

var _console = require("../../util/console");

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

var _default = (0, _vue.defineComponent)({
  name: 'v-simple-checkbox',
  props: _objectSpread(_objectSpread(_objectSpread({}, _colorable.default.props), _themeable.default.props), {}, {
    disabled: Boolean,
    ripple: {
      type: Boolean,
      default: true
    },
    modelValue: Boolean,
    indeterminate: Boolean,
    indeterminateIcon: {
      type: String,
      default: '$checkboxIndeterminate'
    },
    onIcon: {
      type: String,
      default: '$checkboxOn'
    },
    offIcon: {
      type: String,
      default: '$checkboxOff'
    }
  }),
  emits: ['input', 'update:modelValue'],
  created: function created() {
    var _this = this;

    var breakingProps = [['value', 'modelValue'], ['onInput', 'onUpdate:modelValue']];
    /* istanbul ignore next */

    breakingProps.forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          original = _ref2[0],
          replacement = _ref2[1];

      if (_this.$attrs.hasOwnProperty(original)) (0, _console.breaking)(original, replacement, _this);
    });
  },
  methods: {
    getIcon: function getIcon() {
      var _this$$props = this.$props,
          indeterminate = _this$$props.indeterminate,
          modelValue = _this$$props.modelValue,
          indeterminateIcon = _this$$props.indeterminateIcon,
          onIcon = _this$$props.onIcon,
          offIcon = _this$$props.offIcon;
      if (indeterminate) return indeterminateIcon;
      if (modelValue) return onIcon;
      return offIcon;
    },
    createIcon: function createIcon() {
      var _this2 = this;

      var _this$$props2 = this.$props,
          modelValue = _this$$props2.modelValue,
          disabled = _this$$props2.disabled,
          dark = _this$$props2.dark,
          light = _this$$props2.light,
          color = _this$$props2.color;
      return (0, _vue.h)(_VIcon.VIcon, _colorable.default.methods.setTextColor(modelValue && color, {
        disabled: disabled,
        dark: dark,
        light: light
      }), function () {
        return _this2.getIcon();
      });
    },
    createRipple: function createRipple() {
      var _this$$props3 = this.$props,
          ripple = _this$$props3.ripple,
          disabled = _this$$props3.disabled,
          color = _this$$props3.color;
      if (!ripple || disabled) return null;
      return (0, _vue.withDirectives)((0, _vue.h)('div', _colorable.default.methods.setTextColor(color, {
        class: 'v-input--selection-controls__ripple'
      })), [[_ripple.default, {
        center: true
      }]]);
    },
    handleClick: function handleClick(e) {
      e.stopPropagation();
      if (this.$props.disabled) return;
      var newValue = !this.modelValue;
      var attrs = this.$attrs;
      this.$emit("input", newValue);
      this.$emit('update:modelValue', newValue);
    },
    createChildren: function createChildren() {
      var children = [this.createIcon()];
      var ripple = this.createRipple();

      if (ripple) {
        children.push(ripple);
      }

      return children;
    }
  },
  render: function render() {
    var disabled = this.$props.disabled;
    var data = this.$attrs;
    return (0, _vue.h)('div', (0, _mergeData.default)(data, {
      class: {
        'v-simple-checkbox': true,
        'v-simple-checkbox--disabled': disabled
      },
      onClick: this.handleClick
    }), [(0, _vue.h)('div', {
      class: 'v-input--selection-controls__input'
    }, this.createChildren())]);
  }
});

exports.default = _default;
//# sourceMappingURL=VSimpleCheckbox.js.map