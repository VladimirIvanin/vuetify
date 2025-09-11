"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../../../src/components/VDatePicker/VDatePickerHeader.sass");

var _VBtn = _interopRequireDefault(require("../VBtn"));

var _VIcon = _interopRequireDefault(require("../VIcon"));

var _colorable = _interopRequireDefault(require("../../mixins/colorable"));

var _localable = _interopRequireDefault(require("../../mixins/localable"));

var _themeable = _interopRequireDefault(require("../../mixins/themeable"));

var _util = require("./util");

var _helpers = require("../../util/helpers");

var _vue = require("vue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _default2 = (0, _vue.defineComponent)({
  name: 'v-date-picker-header',
  mixins: [_colorable.default, _localable.default, _themeable.default],
  props: {
    disabled: Boolean,
    format: Function,
    min: String,
    max: String,
    nextAriaLabel: String,
    nextIcon: {
      type: String,
      default: '$next'
    },
    prevAriaLabel: String,
    prevIcon: {
      type: String,
      default: '$prev'
    },
    readonly: Boolean,
    modelValue: {
      type: [Number, String],
      required: true
    }
  },
  emits: ['update:modelValue', 'toggle'],
  data: function data() {
    return {
      isReversing: false
    };
  },
  computed: {
    formatter: function formatter() {
      if (this.format) {
        return this.format;
      } else if (String(this.modelValue).split('-')[1]) {
        return (0, _util.createNativeLocaleFormatter)(this.currentLocale, {
          month: 'long',
          year: 'numeric',
          timeZone: 'UTC'
        }, {
          length: 7
        });
      } else {
        return (0, _util.createNativeLocaleFormatter)(this.currentLocale, {
          year: 'numeric',
          timeZone: 'UTC'
        }, {
          length: 4
        });
      }
    }
  },
  watch: {
    modelValue: function modelValue(newVal, oldVal) {
      this.isReversing = newVal < oldVal;
    }
  },
  methods: {
    genBtn: function genBtn(change) {
      var _this = this;

      var ariaLabelId = change > 0 ? this.nextAriaLabel : this.prevAriaLabel;
      var ariaLabel = ariaLabelId ? this.$vuetify.lang.t(ariaLabelId) : undefined;
      var disabled = this.disabled || change < 0 && this.min && this.calculateChange(change) < this.min || change > 0 && this.max && this.calculateChange(change) > this.max;
      return (0, _vue.h)(_VBtn.default, {
        'aria-label': ariaLabel,
        dark: this.dark,
        disabled: disabled,
        icon: true,
        light: this.light,
        onClick: function onClick(e) {
          e.stopPropagation();

          _this.$emit('update:modelValue', _this.calculateChange(change));
        }
      }, {
        default: function _default() {
          return [(0, _vue.h)(_VIcon.default, {}, {
            default: function _default() {
              return change < 0 === !_this.$vuetify.rtl ? _this.prevIcon : _this.nextIcon;
            }
          })];
        }
      });
    },
    calculateChange: function calculateChange(sign) {
      var _String$split$map = String(this.modelValue).split('-').map(Number),
          _String$split$map2 = _slicedToArray(_String$split$map, 2),
          year = _String$split$map2[0],
          month = _String$split$map2[1];

      if (month == null) {
        return "".concat(year + sign);
      } else {
        return (0, _util.monthChange)(String(this.modelValue), sign);
      }
    },
    genHeader: function genHeader() {
      var _this2 = this;

      var color = !this.disabled && (this.color || 'accent');
      var header = (0, _vue.h)('div', this.setTextColor(color, {
        key: String(this.modelValue)
      }), {
        default: function _default() {
          return [(0, _vue.h)('button', {
            type: 'button',
            onClick: function onClick() {
              return _this2.$emit('toggle');
            }
          }, {
            default: function _default() {
              return (0, _helpers.getSlot)(_this2) || [_this2.formatter(String(_this2.modelValue))];
            }
          })];
        }
      });
      var transition = (0, _vue.h)(_vue.Transition, {
        name: this.isReversing === !this.$vuetify.rtl ? 'tab-reverse-transition' : 'tab-transition'
      }, {
        default: function _default() {
          return [header];
        }
      });
      return (0, _vue.h)('div', {
        class: ['v-date-picker-header__value', {
          'v-date-picker-header__value--disabled': this.disabled
        }]
      }, {
        default: function _default() {
          return [transition];
        }
      });
    }
  },
  render: function render() {
    var _this3 = this;

    return (0, _vue.h)('div', {
      class: ['v-date-picker-header', _objectSpread({
        'v-date-picker-header--disabled': this.disabled
      }, this.themeClasses)]
    }, {
      default: function _default() {
        return [_this3.genBtn(-1), _this3.genHeader(), _this3.genBtn(+1)];
      }
    });
  }
});

exports.default = _default2;
//# sourceMappingURL=VDatePickerHeader.js.map