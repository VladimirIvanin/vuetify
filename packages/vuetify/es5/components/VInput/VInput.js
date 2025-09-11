"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../../../src/components/VInput/VInput.sass");

var _VIcon = _interopRequireDefault(require("../VIcon"));

var _VLabel = _interopRequireDefault(require("../VLabel"));

var _VMessages = _interopRequireDefault(require("../VMessages"));

var _bindsAttrs = _interopRequireDefault(require("../../mixins/binds-attrs"));

var _validatable = _interopRequireDefault(require("../../mixins/validatable"));

var _helpers = require("../../util/helpers");

var _mergeData = _interopRequireDefault(require("../../util/mergeData"));

var _console = require("../../util/console");

var _vue = require("vue");

var _mixins = _interopRequireDefault(require("../../util/mixins"));

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

var baseMixins = (0, _mixins.default)(_bindsAttrs.default, _validatable.default);
/* @vue/component */

var _default2 = baseMixins.extend({
  name: 'v-input',
  inheritAttrs: false,
  props: {
    appendIcon: String,
    backgroundColor: {
      type: String,
      default: ''
    },
    dense: Boolean,
    height: [Number, String],
    hideDetails: [Boolean, String],
    hideSpinButtons: Boolean,
    hint: String,
    id: String,
    label: String,
    loading: Boolean,
    persistentHint: Boolean,
    prependIcon: String,
    modelValue: null
  },
  emits: ['click', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'update:error'],
  data: function data() {
    return {
      lazyValue: this.modelValue,
      hasMouseDown: false
    };
  },
  computed: {
    classes: function classes() {
      return _objectSpread({
        'v-input--has-state': this.hasState,
        'v-input--hide-details': !this.showDetails,
        'v-input--is-label-active': this.isLabelActive,
        'v-input--is-dirty': this.isDirty,
        'v-input--is-disabled': this.isDisabled,
        'v-input--is-focused': this.isFocused,
        // <v-switch loading>.loading === '' so we can't just cast to boolean
        'v-input--is-loading': this.loading !== false && this.loading != null,
        'v-input--is-readonly': this.isReadonly,
        'v-input--dense': this.dense,
        'v-input--hide-spin-buttons': this.hideSpinButtons
      }, this.themeClasses);
    },
    computedId: function computedId() {
      return this.id || "input-".concat(this.$.uid);
    },
    hasDetails: function hasDetails() {
      return this.messagesToDisplay.length > 0;
    },
    hasHint: function hasHint() {
      return !this.hasMessages && !!this.hint && (this.persistentHint || this.isFocused);
    },
    hasLabel: function hasLabel() {
      return !!(this.$slots.label || this.label);
    },
    // Proxy for `lazyValue`
    // This allows an input
    // to function without
    // a provided model
    internalValue: {
      get: function get() {
        return this.lazyValue;
      },
      set: function set(val) {
        this.lazyValue = val;
        this.$emit(this.$_modelEvent, val);

        if ('$_emitChangeEvent' in this) {
          this.$emit('change', val);
        }
      }
    },
    isDirty: function isDirty() {
      return !!this.lazyValue;
    },
    isLabelActive: function isLabelActive() {
      return this.isDirty;
    },
    messagesToDisplay: function messagesToDisplay() {
      var _this = this;

      if (this.hasHint) return [this.hint];
      if (!this.hasMessages) return [];
      return this.validations.map(function (validation) {
        if (typeof validation === 'string') return validation;
        var validationResult = validation(_this.internalValue);
        return typeof validationResult === 'string' ? validationResult : '';
      }).filter(function (message) {
        return message !== '';
      });
    },
    showDetails: function showDetails() {
      return this.hideDetails === false || this.hideDetails === 'auto' && this.hasDetails;
    }
  },
  watch: {
    modelValue: function modelValue(val) {
      this.lazyValue = val;
    }
  },
  created: function created() {
    var _this2 = this;

    var breakingProps = [['value', 'modelValue'], ['onInput', 'onUpdate:modelValue']];
    /* istanbul ignore next */

    breakingProps.forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          original = _ref2[0],
          replacement = _ref2[1];

      if (_this2.$attrs.hasOwnProperty(original)) (0, _console.breaking)(original, replacement, _this2);
    });
  },
  beforeCreate: function beforeCreate() {
    // v-radio-group needs to emit a different event
    // https://github.com/vuetifyjs/vuetify/issues/4752
    this.$_modelEvent =
    /*(this.$options.model && this.$options.model.event) ||*/
    'update:modelValue';
  },
  methods: {
    genContent: function genContent() {
      return [this.genPrependSlot(), this.genControl(), this.genAppendSlot()];
    },
    genControl: function genControl() {
      return (0, _vue.h)('div', {
        class: 'v-input__control',
        title: this.attrs$.title
      }, [this.genInputSlot(), this.genMessages()]);
    },
    genDefaultSlot: function genDefaultSlot() {
      return [this.genLabel(), (0, _helpers.getSlot)(this)];
    },
    genIcon: function genIcon(type, cb) {
      var _this3 = this;

      var extraData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var _a;

      var icon = this["".concat(type, "Icon")];
      var eventName = "click:".concat((0, _helpers.kebabCase)(type));
      var hasListener = !!(this.listeners$[eventName] || cb);
      var localeKey = {
        prepend: 'prependAction',
        prependInner: 'prependAction',
        append: 'appendAction',
        appendOuter: 'appendAction',
        clear: 'clear'
      }[type];
      var label = hasListener && localeKey ? this.$vuetify.lang.t("$vuetify.input.".concat(localeKey), (_a = this.label) !== null && _a !== void 0 ? _a : '') : undefined;
      var data = (0, _mergeData.default)(_objectSpread({
        'aria-label': label,
        color: this.validationState,
        dark: this.dark,
        disabled: this.isDisabled,
        light: this.light,
        tabindex: type === 'clear' ? -1 : undefined
      }, !hasListener ? {} : {
        onClick: function onClick(e) {
          e.preventDefault();
          e.stopPropagation();

          _this3.$emit(eventName, e);

          cb && cb(e);
        },
        // Container has g event that will
        // trigger menu open if enclosed
        onMouseup: function onMouseup(e) {
          e.preventDefault();
          e.stopPropagation();
        }
      }), extraData);
      return (0, _vue.h)('div', {
        class: _defineProperty({
          'v-input__icon': true
        }, "v-input__icon--".concat((0, _helpers.kebabCase)(type)), type)
      }, [(0, _vue.h)(_VIcon.default, data, function () {
        return icon;
      })]);
    },
    genInputSlot: function genInputSlot() {
      return (0, _vue.h)('div', this.setBackgroundColor(this.backgroundColor, {
        class: {
          'v-input__slot': true
        },
        style: {
          height: (0, _helpers.convertToUnit)(this.height)
        },
        onClick: this.onClick,
        onMousedown: this.onMouseDown,
        onMouseup: this.onMouseUp,
        ref: 'input-slot'
      }), [this.genDefaultSlot()]);
    },
    genLabel: function genLabel() {
      var _this4 = this;

      if (!this.hasLabel) return null;
      return (0, _vue.h)(_VLabel.default, {
        color: this.validationState,
        dark: this.dark,
        disabled: this.isDisabled,
        focused: this.hasState,
        for: this.computedId,
        light: this.light
      }, function () {
        return (0, _helpers.getSlot)(_this4, 'label') || _this4.label;
      });
    },
    genMessages: function genMessages() {
      if (!this.showDetails) return null;
      return (0, _vue.h)(_VMessages.default, {
        color: this.hasHint ? '' : this.validationState,
        dark: this.dark,
        light: this.light,
        modelValue: this.messagesToDisplay,
        role: this.hasMessages ? 'alert' : null
      }, {
        default: (0, _helpers.getSlot)(this, 'message')
      });
    },
    genSlot: function genSlot(type, location, slot) {
      if (!slot.length) return null;
      var ref = "".concat(type, "-").concat(location);
      slot = slot.map(function (child) {
        return child instanceof Function ? child() : child;
      });
      return (0, _vue.h)('div', {
        class: "v-input__".concat(ref),
        ref: ref
      }, slot);
    },
    genPrependSlot: function genPrependSlot() {
      var slot = [];

      if (this.$slots.prepend) {
        slot.push(this.$slots.prepend);
      } else if (this.prependIcon) {
        slot.push(this.genIcon('prepend'));
      }

      return this.genSlot('prepend', 'outer', slot);
    },
    genAppendSlot: function genAppendSlot() {
      var slot = []; // Append icon for text field was really
      // an appended inner icon, v-text-field
      // will overwrite this method in order to obtain
      // backwards compat

      if (this.$slots.append) {
        slot.push(this.$slots.append);
      } else if (this.appendIcon) {
        slot.push(this.genIcon('append'));
      }

      return this.genSlot('append', 'outer', slot);
    },
    onClick: function onClick(e) {
      this.$emit('click', e);
    },
    onMouseDown: function onMouseDown(e) {
      this.hasMouseDown = true;
      this.$emit('mousedown', e);
    },
    onMouseUp: function onMouseUp(e) {
      this.hasMouseDown = false;
      this.$emit('mouseup', e);
    }
  },
  render: function render() {
    var _this5 = this;

    var _this$$attrs = this.$attrs,
        additionalClasses = _this$$attrs.class,
        restAttrs = _objectWithoutProperties(_this$$attrs, ["class"]);

    return (0, _vue.h)('div', this.setTextColor(this.validationState, _objectSpread({
      class: _objectSpread(_objectSpread({
        'v-input': true
      }, this.classes), (0, _helpers.normalizeClasses)(additionalClasses))
    }, restAttrs)), {
      default: function _default() {
        return _this5.genContent();
      }
    });
  }
});

exports.default = _default2;
//# sourceMappingURL=VInput.js.map