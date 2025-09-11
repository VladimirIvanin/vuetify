"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prevent = prevent;
exports.default = void 0;

var _VInput = _interopRequireDefault(require("../../components/VInput"));

var _rippleable = _interopRequireDefault(require("../rippleable"));

var _comparable = _interopRequireDefault(require("../comparable"));

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _vue = require("vue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function prevent(e) {
  e.preventDefault();
}
/* @vue/component */


var _default = (0, _mixins.default)(_VInput.default, _rippleable.default, _comparable.default).extend({
  name: 'selectable',
  props: {
    id: String,
    value: null,
    falseValue: null,
    trueValue: null,
    multiple: {
      type: Boolean,
      default: null
    },
    label: String
  },
  data: function data() {
    return {
      hasColor: this.modelValue,
      lazyValue: this.modelValue
    };
  },
  created: function created() {
    this.$_emitChangeEvent = true;
  },
  computed: {
    computedColor: function computedColor() {
      if (!this.isActive) return undefined;
      if (this.color) return this.color;
      if (this.isDark && !this.appIsDark) return 'white';
      return 'primary';
    },
    isMultiple: function isMultiple() {
      return this.multiple === true || this.multiple === null && Array.isArray(this.internalValue);
    },
    isActive: function isActive() {
      var _this = this;

      var value = this.value;
      var input = this.internalValue;

      if (this.isMultiple) {
        if (!Array.isArray(input)) return false;
        return input.some(function (item) {
          return _this.valueComparator(item, value);
        });
      }

      if (this.trueValue === undefined || this.falseValue === undefined) {
        return value ? this.valueComparator(value, input) : Boolean(input);
      }

      return this.valueComparator(input, this.trueValue);
    },
    isDirty: function isDirty() {
      return this.isActive;
    },
    rippleState: function rippleState() {
      return !this.isDisabled && !this.validationState ? undefined : this.validationState;
    }
  },
  watch: {
    modelValue: function modelValue(val) {
      this.lazyValue = val;
      this.hasColor = val;
    }
  },
  methods: {
    genLabel: function genLabel() {
      var label = _VInput.default.methods.genLabel.call(this);

      if (!label) return label; // Label shouldn't cause the input to focus

      label.onClick = this.onClick;
      return label;
    },
    genInput: function genInput(type, attrs) {
      return (0, _vue.h)('input', _objectSpread(_objectSpread({}, Object.assign({
        'aria-checked': this.isActive.toString(),
        disabled: this.isDisabled,
        id: this.computedId,
        role: type,
        type: type
      }, attrs)), {}, {
        value: this.value,
        checked: this.isActive,
        onBlur: this.onBlur,
        onChange: this.onChange,
        onFocus: this.onFocus,
        onKeydown: this.onKeydown,
        onClick: prevent,
        ref: 'input'
      }));
    },
    onClick: function onClick(e) {
      e.preventDefault();
      this.onChange();
      this.$emit('click', e);
    },
    onChange: function onChange() {
      var _this2 = this;

      if (!this.isInteractive) return;
      var value = this.value;
      var input = this.internalValue;

      if (this.isMultiple) {
        if (!Array.isArray(input)) {
          input = [];
        }

        var length = input.length;
        input = input.filter(function (item) {
          return !_this2.valueComparator(item, value);
        });

        if (input.length === length) {
          input.push(value);
        }
      } else if (this.trueValue !== undefined && this.falseValue !== undefined) {
        input = this.valueComparator(input, this.trueValue) ? this.falseValue : this.trueValue;
      } else if (value) {
        input = this.valueComparator(input, value) ? null : value;
      } else {
        input = !input;
      }

      this.validate(true, input);
      this.internalValue = input;
      this.hasColor = input;
    },
    onFocus: function onFocus(e) {
      this.isFocused = true;
      this.$emit('focus', e);
    },
    onBlur: function onBlur(e) {
      this.isFocused = false;
      this.$emit('blur', e);
    },

    /** @abstract */
    onKeydown: function onKeydown(e) {}
  }
});

exports.default = _default;
//# sourceMappingURL=index.js.map