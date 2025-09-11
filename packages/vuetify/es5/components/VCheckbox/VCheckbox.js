"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../../../src/components/VCheckbox/VCheckbox.sass");

require("../../../src/styles/components/_selection-controls.sass");

var _VIcon = _interopRequireDefault(require("../VIcon"));

var _VInput = _interopRequireDefault(require("../VInput"));

var _selectable = _interopRequireDefault(require("../../mixins/selectable"));

var _console = require("../../util/console");

var _vue = require("vue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* @vue/component */
var _default = (0, _vue.defineComponent)({
  name: 'v-checkbox',
  extends: _selectable.default,
  props: {
    indeterminate: Boolean,
    indeterminateIcon: {
      type: String,
      default: '$checkboxIndeterminate'
    },
    offIcon: {
      type: String,
      default: '$checkboxOff'
    },
    onIcon: {
      type: String,
      default: '$checkboxOn'
    }
  },
  emits: ['click', 'focus', 'blur', 'update:indeterminate'],
  data: function data() {
    return {
      inputIndeterminate: this.indeterminate
    };
  },
  computed: {
    classes: function classes() {
      return _objectSpread(_objectSpread({}, _VInput.default.computed.classes.call(this)), {}, {
        'v-input--selection-controls': true,
        'v-input--checkbox': true,
        'v-input--indeterminate': this.inputIndeterminate
      });
    },
    computedIcon: function computedIcon() {
      if (this.inputIndeterminate) {
        return this.indeterminateIcon;
      } else if (this.isActive) {
        return this.onIcon;
      } else {
        return this.offIcon;
      }
    },
    // Do not return undefined if disabled,
    // according to spec, should still show
    // a color when disabled and active
    validationState: function validationState() {
      if (this.isDisabled && !this.inputIndeterminate) return undefined;
      if (this.hasError && this.shouldValidate) return 'error';
      if (this.hasSuccess) return 'success';
      if (this.hasColor !== null) return this.computedColor;
      return undefined;
    }
  },
  watch: {
    indeterminate: function indeterminate(val) {
      var _this = this;

      // https://github.com/vuetifyjs/vuetify/issues/8270
      this.$nextTick(function () {
        return _this.inputIndeterminate = val;
      });
    },
    inputIndeterminate: function inputIndeterminate(val) {
      this.$emit('update:indeterminate', val);
    },
    isActive: function isActive() {
      if (!this.indeterminate) return;
      this.inputIndeterminate = false;
    }
  },
  created: function created() {
    var _this2 = this;

    var breakingProps = [['inputValue', 'model-value'], ['input-value', 'model-value']];
    /* istanbul ignore next */

    breakingProps.forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          original = _ref2[0],
          replacement = _ref2[1];

      if (_this2.$attrs.hasOwnProperty(original)) (0, _console.breaking)(original, replacement, _this2);
    });
  },
  methods: {
    genCheckbox: function genCheckbox() {
      var _this3 = this;

      var _this$attrs$ = this.attrs$,
          title = _this$attrs$.title,
          checkboxAttrs = _objectWithoutProperties(_this$attrs$, ["title"]);

      return (0, _vue.h)('div', {
        class: 'v-input--selection-controls__input'
      }, [(0, _vue.h)(_VIcon.default, this.setTextColor(this.validationState, {
        dense: this.dense,
        dark: this.dark,
        light: this.light
      }), function () {
        return _this3.computedIcon;
      }), this.genInput('checkbox', _objectSpread(_objectSpread({}, checkboxAttrs), {}, {
        'aria-checked': this.inputIndeterminate ? 'mixed' : this.isActive.toString()
      })), this.genRipple(this.setTextColor(this.rippleState))]);
    },
    genDefaultSlot: function genDefaultSlot() {
      return [this.genCheckbox(), this.genLabel()];
    }
  }
});

exports.default = _default;
//# sourceMappingURL=VCheckbox.js.map