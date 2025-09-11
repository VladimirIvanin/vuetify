"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

require("../../../src/components/VAlert/VAlert.sass");

var _VSheet = _interopRequireDefault(require("../VSheet"));

var _VBtn = _interopRequireDefault(require("../VBtn"));

var _VIcon = _interopRequireDefault(require("../VIcon"));

var _toggleable = _interopRequireDefault(require("../../mixins/toggleable"));

var _themeable = _interopRequireDefault(require("../../mixins/themeable"));

var _transitionable = _interopRequireDefault(require("../../mixins/transitionable"));

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _console = require("../../util/console");

var _helpers = require("../../util/helpers");

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

/* @vue/component */
var _default2 = (0, _mixins.default)(_VSheet.default, _toggleable.default, _transitionable.default).extend({
  name: 'v-alert',
  emits: ['update:modelValue'],
  props: {
    border: {
      type: String,
      validator: function validator(val) {
        return ['top', 'right', 'bottom', 'left'].includes(val);
      }
    },
    closeLabel: {
      type: String,
      default: '$vuetify.close'
    },
    coloredBorder: Boolean,
    dense: Boolean,
    dismissible: Boolean,
    closeIcon: {
      type: String,
      default: '$cancel'
    },
    icon: {
      type: [Boolean, String],
      validator: function validator(val) {
        return typeof val === 'string' || val === false;
      }
    },
    outlined: Boolean,
    prominent: Boolean,
    text: Boolean,
    type: {
      type: String,
      validator: function validator(val) {
        return ['info', 'error', 'success', 'warning'].includes(val);
      }
    },
    modelValue: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    __cachedBorder: function __cachedBorder() {
      if (!this.border) return null;
      var data = {
        class: ['v-alert__border', _defineProperty({}, "v-alert__border--".concat(this.border), true)]
      };

      if (this.coloredBorder) {
        data = this.setBackgroundColor(this.computedColor, data);
        data.class['v-alert__border--has-color'] = true;
      }

      return (0, _vue.h)('div', data);
    },
    __cachedDismissible: function __cachedDismissible() {
      var _this = this;

      if (!this.dismissible) return null;
      var color = this.iconColor;
      return (0, _vue.h)(_VBtn.default, {
        class: 'v-alert__dismissible',
        color: color,
        icon: true,
        small: true,
        'aria-label': this.$vuetify.lang.t(this.closeLabel),
        onClick: function onClick() {
          return _this.isActive = false;
        }
      }, [(0, _vue.h)(_VIcon.default, {
        color: color
      }, {
        default: function _default() {
          return _this.closeIcon;
        }
      })]);
    },
    __cachedIcon: function __cachedIcon() {
      var _this2 = this;

      if (!this.computedIcon) return null;
      return (0, _vue.h)(_VIcon.default, {
        class: 'v-alert__icon',
        color: this.iconColor
      }, {
        default: function _default() {
          return _this2.computedIcon;
        }
      });
    },
    classes: function classes() {
      var classes = _objectSpread(_objectSpread({}, _VSheet.default.computed.classes.call(this)), {}, {
        'v-alert--border': Boolean(this.border),
        'v-alert--dense': this.dense,
        'v-alert--outlined': this.outlined,
        'v-alert--prominent': this.prominent,
        'v-alert--text': this.text
      });

      if (this.border) {
        classes["v-alert--border-".concat(this.border)] = true;
      }

      return classes;
    },
    computedColor: function computedColor() {
      return this.color || this.type;
    },
    computedIcon: function computedIcon() {
      if (this.icon === false) return false;
      if (typeof this.icon === 'string' && this.icon) return this.icon;
      if (!['error', 'info', 'success', 'warning'].includes(this.type)) return false;
      return "$".concat(this.type);
    },
    hasColoredIcon: function hasColoredIcon() {
      return this.hasText || Boolean(this.border) && this.coloredBorder;
    },
    hasText: function hasText() {
      return this.text || this.outlined;
    },
    iconColor: function iconColor() {
      return this.hasColoredIcon ? this.computedColor : undefined;
    },
    isDark: function isDark() {
      if (this.type && !this.coloredBorder && !this.outlined) return true;
      return _themeable.default.computed.isDark.call(this);
    }
  },
  created: function created() {
    var _this3 = this;

    var breakingProps = [['outline', 'outlined'], ['value', 'modelValue'], ['onInput', 'onUpdate:modelValue']];
    /* istanbul ignore next */

    breakingProps.forEach(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          original = _ref3[0],
          replacement = _ref3[1];

      if (_this3.$attrs.hasOwnProperty(original)) (0, _console.breaking)(original, replacement, _this3);
    });
  },
  methods: {
    genWrapper: function genWrapper() {
      var children = [(0, _helpers.getSlot)(this, 'prepend') || this.__cachedIcon, this.genContent(), this.__cachedBorder, (0, _helpers.getSlot)(this, 'append'), this.$slots.close ? this.$slots.close({
        toggle: this.toggle
      }) : this.__cachedDismissible];
      var data = {
        class: 'v-alert__wrapper'
      };
      return (0, _vue.h)('div', data, children);
    },
    genContent: function genContent() {
      return (0, _vue.h)('div', {
        class: 'v-alert__content'
      }, (0, _helpers.getSlot)(this));
    },
    genAlert: function genAlert() {
      var data = _objectSpread(_objectSpread({
        class: ['v-alert', this.classes],
        role: 'alert'
      }, this.listeners$), {}, {
        style: this.styles
      });

      var directives = [[_vue.vShow, this.isActive]];

      if (!this.coloredBorder) {
        var setColor = this.hasText ? this.setTextColor : this.setBackgroundColor;
        data = setColor(this.computedColor, data);
      }

      return (0, _vue.withDirectives)((0, _vue.h)('div', data, [this.genWrapper()]), directives);
    },

    /** @public */
    toggle: function toggle() {
      this.isActive = !this.isActive;
    }
  },
  render: function render() {
    var render = this.genAlert();
    if (!this.transition) return render;
    return (0, _vue.h)(_vue.Transition, {
      name: this.transition,
      origin: this.origin,
      mode: this.mode
    }, [render]);
  }
});

exports.default = _default2;
//# sourceMappingURL=VAlert.js.map