"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../../../src/styles/components/_selection-controls.sass");

require("../../../src/components/VSwitch/VSwitch.sass");

var _selectable = _interopRequireDefault(require("../../mixins/selectable"));

var _VInput = _interopRequireDefault(require("../VInput"));

var _touch = _interopRequireDefault(require("../../directives/touch"));

var _transitions = require("../transitions");

var _VProgressCircular = _interopRequireDefault(require("../VProgressCircular/VProgressCircular"));

var _helpers = require("../../util/helpers");

var _vue = require("vue");

var _mergeData = _interopRequireDefault(require("../../util/mergeData"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* @vue/component */
var _default = (0, _vue.defineComponent)({
  name: 'v-switch',
  extends: _selectable.default,
  props: {
    inset: Boolean,
    loading: {
      type: [Boolean, String],
      default: false
    },
    flat: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click', 'focus', 'blur'],
  computed: {
    classes: function classes() {
      return _objectSpread(_objectSpread({}, _VInput.default.computed.classes.call(this)), {}, {
        'v-input--selection-controls v-input--switch': true,
        'v-input--switch--flat': this.flat,
        'v-input--switch--inset': this.inset
      });
    },
    attrs: function attrs() {
      return {
        'aria-checked': String(this.isActive),
        'aria-disabled': String(this.isDisabled),
        role: 'switch'
      };
    },
    // Do not return undefined if disabled,
    // according to spec, should still show
    // a color when disabled and active
    validationState: function validationState() {
      if (this.hasError && this.shouldValidate) return 'error';
      if (this.hasSuccess) return 'success';
      if (this.hasColor !== null) return this.computedColor;
      return undefined;
    },
    switchData: function switchData() {
      return this.setTextColor(this.loading ? undefined : this.validationState, {
        class: this.themeClasses
      });
    }
  },
  methods: {
    genDefaultSlot: function genDefaultSlot() {
      return [this.genSwitch(), this.genLabel()];
    },
    genSwitch: function genSwitch() {
      var _this$attrs$ = this.attrs$,
          title = _this$attrs$.title,
          switchAttrs = _objectWithoutProperties(_this$attrs$, ["title"]);

      return (0, _vue.h)('div', {
        class: 'v-input--selection-controls__input'
      }, [this.genInput('checkbox', _objectSpread(_objectSpread({}, this.attrs), switchAttrs)), this.genRipple(this.setTextColor(this.validationState, {
        directives: [[_touch.default, {
          left: this.onSwipeLeft,
          right: this.onSwipeRight
        }]]
      })), (0, _vue.h)('div', (0, _mergeData.default)({
        class: 'v-input--switch__track'
      }, this.switchData)), (0, _vue.h)('div', (0, _mergeData.default)({
        class: 'v-input--switch__thumb'
      }, this.switchData), [this.genProgress()])]);
    },
    genProgress: function genProgress() {
      var _this = this;

      return (0, _vue.h)(_transitions.VFabTransition, {}, function () {
        return [_this.loading === false ? null : (0, _helpers.getSlot)(_this, 'progress') || (0, _vue.h)(_VProgressCircular.default, {
          color: _this.loading === true || _this.loading === '' ? _this.color || 'primary' : _this.loading,
          size: 16,
          width: 2,
          indeterminate: true
        })];
      });
    },
    onSwipeLeft: function onSwipeLeft() {
      if (this.isActive) this.onChange();
    },
    onSwipeRight: function onSwipeRight() {
      if (!this.isActive) this.onChange();
    },
    onKeydown: function onKeydown(e) {
      if (e.keyCode === _helpers.keyCodes.left && this.isActive || e.keyCode === _helpers.keyCodes.right && !this.isActive) this.onChange();
    }
  }
});

exports.default = _default;
//# sourceMappingURL=VSwitch.js.map