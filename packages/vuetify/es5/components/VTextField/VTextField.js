"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../../../src/components/VTextField/VTextField.sass");

var _VInput = _interopRequireDefault(require("../VInput"));

var _VCounter = _interopRequireDefault(require("../VCounter"));

var _VLabel = _interopRequireDefault(require("../VLabel"));

var _intersectable = _interopRequireDefault(require("../../mixins/intersectable"));

var _loadable = _interopRequireDefault(require("../../mixins/loadable"));

var _validatable = _interopRequireDefault(require("../../mixins/validatable"));

var _resize = _interopRequireDefault(require("../../directives/resize"));

var _dom = require("../../util/dom");

var _helpers = require("../../util/helpers");

var _console = require("../../util/console");

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _vue = require("vue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var baseMixins = (0, _mixins.default)(_VInput.default, (0, _intersectable.default)({
  onVisible: ['onResize', 'tryAutofocus']
}), _loadable.default);
var dirtyTypes = ['color', 'file', 'time', 'date', 'datetime-local', 'week', 'month'];
/* @vue/component */

var _default = baseMixins.extend({
  name: 'v-text-field',
  props: {
    appendOuterIcon: String,
    autofocus: Boolean,
    clearable: Boolean,
    clearIcon: {
      type: String,
      default: '$clear'
    },
    counter: [Boolean, Number, String],
    counterValue: Function,
    filled: Boolean,
    flat: Boolean,
    fullWidth: Boolean,
    label: String,
    outlined: Boolean,
    placeholder: String,
    prefix: String,
    prependInnerIcon: String,
    persistentPlaceholder: Boolean,
    reverse: Boolean,
    rounded: Boolean,
    shaped: Boolean,
    singleLine: Boolean,
    solo: Boolean,
    soloInverted: Boolean,
    suffix: String,
    type: {
      type: String,
      default: 'text'
    }
  },
  emits: ['update:modelValue', 'blur', 'focus', 'keydown'],
  data: function data() {
    return {
      badInput: false,
      labelWidth: 0,
      prefixWidth: 0,
      prependWidth: 0,
      initialValue: null,
      isBooted: false,
      isClearing: false
    };
  },
  computed: {
    classes: function classes() {
      return _objectSpread(_objectSpread({}, _VInput.default.computed.classes.call(this)), {}, {
        'v-text-field': true,
        'v-text-field--full-width': this.fullWidth,
        'v-text-field--prefix': this.prefix,
        'v-text-field--single-line': this.isSingle,
        'v-text-field--solo': this.isSolo,
        'v-text-field--solo-inverted': this.soloInverted,
        'v-text-field--solo-flat': this.flat,
        'v-text-field--filled': this.filled,
        'v-text-field--is-booted': this.isBooted,
        'v-text-field--enclosed': this.isEnclosed,
        'v-text-field--reverse': this.reverse,
        'v-text-field--outlined': this.outlined,
        'v-text-field--placeholder': this.placeholder,
        'v-text-field--rounded': this.rounded,
        'v-text-field--shaped': this.shaped
      });
    },
    computedColor: function computedColor() {
      var computedColor = _validatable.default.computed.computedColor.call(this);

      if (!this.soloInverted || !this.isFocused) return computedColor;
      return this.color || 'primary';
    },
    computedCounterValue: function computedCounterValue() {
      if (typeof this.counterValue === 'function') {
        return this.counterValue(this.internalValue);
      }

      return _toConsumableArray((this.internalValue || '').toString()).length;
    },
    hasCounter: function hasCounter() {
      return this.counter !== false && this.counter != null;
    },
    hasDetails: function hasDetails() {
      return _VInput.default.computed.hasDetails.call(this) || this.hasCounter;
    },
    internalValue: {
      get: function get() {
        return this.lazyValue;
      },
      set: function set(val) {
        this.lazyValue = val;
        this.$emit('update:modelValue', this.lazyValue);
      }
    },
    isDirty: function isDirty() {
      var _a;

      return ((_a = this.lazyValue) === null || _a === void 0 ? void 0 : _a.toString().length) > 0 || this.badInput;
    },
    isEnclosed: function isEnclosed() {
      return this.filled || this.isSolo || this.outlined;
    },
    isLabelActive: function isLabelActive() {
      return this.isDirty || dirtyTypes.includes(this.type);
    },
    isSingle: function isSingle() {
      return this.isSolo || this.singleLine || this.fullWidth || // https://material.io/components/text-fields/#filled-text-field
      this.filled && !this.hasLabel;
    },
    isSolo: function isSolo() {
      return this.solo || this.soloInverted;
    },
    labelPosition: function labelPosition() {
      var offset = this.prefix && !this.labelValue ? this.prefixWidth : 0;
      if (this.labelValue && this.prependWidth) offset -= this.prependWidth;
      return this.$vuetify.rtl === this.reverse ? {
        left: offset,
        right: 'auto'
      } : {
        left: 'auto',
        right: offset
      };
    },
    showLabel: function showLabel() {
      return this.hasLabel && !(this.isSingle && this.labelValue);
    },
    labelValue: function labelValue() {
      return this.isFocused || this.isLabelActive || this.persistentPlaceholder;
    }
  },
  watch: {
    // labelValue: 'setLabelWidth', // moved to mounted, see #11533
    outlined: 'setLabelWidth',
    label: function label() {
      this.$nextTick(this.setLabelWidth);
    },
    prefix: function prefix() {
      this.$nextTick(this.setPrefixWidth);
    },
    isFocused: 'updateValue',
    modelValue: function modelValue(val) {
      this.lazyValue = val;
    }
  },
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
    /* istanbul ignore if */

    if (this.shaped && !(this.filled || this.outlined || this.isSolo)) {
      (0, _console.consoleWarn)('shaped should be used with either filled or outlined', this);
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    // #11533
    this.$watch(function () {
      return _this2.labelValue;
    }, this.setLabelWidth);
    this.autofocus && this.tryAutofocus();
    requestAnimationFrame(function () {
      _this2.isBooted = true;
      requestAnimationFrame(function () {
        if (!_this2.isIntersecting) {
          _this2.onResize();
        }
      });
    });
  },
  methods: {
    /** @public */
    focus: function focus() {
      this.onFocus();
    },

    /** @public */
    blur: function blur(e) {
      var _this3 = this;

      // https://github.com/vuetifyjs/vuetify/issues/5913
      // Safari tab order gets broken if called synchronous
      window.requestAnimationFrame(function () {
        _this3.$refs.input && _this3.$refs.input.blur();
      });
    },
    clearableCallback: function clearableCallback() {
      var _this4 = this;

      this.$refs.input && this.$refs.input.focus();
      this.$nextTick(function () {
        return _this4.internalValue = null;
      });
    },
    genAppendSlot: function genAppendSlot() {
      var slot = [];

      if (this.$slots['append-outer']) {
        slot.push(this.$slots['append-outer']);
      } else if (this.appendOuterIcon) {
        slot.push(this.genIcon('appendOuter'));
      }

      return this.genSlot('append', 'outer', slot);
    },
    genPrependInnerSlot: function genPrependInnerSlot() {
      var slot = [];

      if (this.$slots['prepend-inner']) {
        slot.push(this.$slots['prepend-inner']());
      } else if (this.prependInnerIcon) {
        slot.push(this.genIcon('prependInner'));
      }

      return this.genSlot('prepend', 'inner', slot);
    },
    genIconSlot: function genIconSlot() {
      var slot = [];

      if (this.$slots.append) {
        slot.push(this.$slots.append);
      } else if (this.appendIcon) {
        slot.push(this.genIcon('append'));
      }

      return this.genSlot('append', 'inner', slot);
    },
    genInputSlot: function genInputSlot() {
      var input = _VInput.default.methods.genInputSlot.call(this);

      var prepend = this.genPrependInnerSlot();

      if (prepend) {
        input.children = input.children || [];
        input.children.unshift(prepend);
      }

      return input;
    },
    genClearIcon: function genClearIcon() {
      if (!this.clearable) return null; // if the text field has no content then don't display the clear icon.
      // We add an empty div because other controls depend on a ref to append inner

      if (!this.isDirty) {
        return this.genSlot('append', 'inner', [(0, _vue.h)('div')]);
      }

      return this.genSlot('append', 'inner', [this.genIcon('clear', this.clearableCallback)]);
    },
    genCounter: function genCounter() {
      var _a, _b, _c;

      if (!this.hasCounter) return null;
      var max = this.counter === true ? this.attrs$.maxlength : this.counter;
      var props = {
        dark: this.dark,
        light: this.light,
        max: max,
        value: this.computedCounterValue
      };
      return (_c = (_b = (_a = this.$slots).counter) === null || _b === void 0 ? void 0 : _b.call(_a, {
        props: props
      })) !== null && _c !== void 0 ? _c : (0, _vue.h)(_VCounter.default, props);
    },
    genControl: function genControl() {
      return _VInput.default.methods.genControl.call(this);
    },
    genDefaultSlot: function genDefaultSlot() {
      return [this.genFieldset(), this.genTextFieldSlot(), this.genClearIcon(), this.genIconSlot(), this.genProgress()];
    },
    genFieldset: function genFieldset() {
      if (!this.outlined) return null;
      return (0, _vue.h)('fieldset', {
        'aria-hidden': true
      }, [this.genLegend()]);
    },
    genLabel: function genLabel() {
      var _this5 = this;

      if (!this.showLabel) return null;
      var data = {
        ref: "label",
        absolute: true,
        color: this.validationState,
        dark: this.dark,
        disabled: this.isDisabled,
        focused: !this.isSingle && (this.isFocused || !!this.validationState),
        for: this.computedId,
        left: this.labelPosition.left,
        light: this.light,
        right: this.labelPosition.right,
        value: this.labelValue
      };
      return (0, _vue.h)(_VLabel.default, data, function () {
        return (0, _helpers.getSlot)(_this5, 'label') || _this5.label;
      });
    },
    genLegend: function genLegend() {
      var width = !this.singleLine && (this.labelValue || this.isDirty) ? this.labelWidth : 0;
      var span = (0, _vue.h)('span', {
        innerHTML: '&#8203;',
        class: 'notranslate'
      });
      return (0, _vue.h)('legend', {
        style: {
          width: !this.isSingle ? (0, _helpers.convertToUnit)(width) : undefined
        }
      }, [span]);
    },
    genInput: function genInput() {
      var listeners = Object.assign({}, this.listeners$);
      delete listeners.change; // Change should not be bound externally

      var _this$attrs$ = this.attrs$,
          title = _this$attrs$.title,
          inputAttrs = _objectWithoutProperties(_this$attrs$, ["title"]);

      var node = (0, _vue.h)('input', _objectSpread(_objectSpread(_objectSpread({
        style: {},
        value: this.type === 'number' && Object.is(this.lazyValue, -0) ? '-0' : this.lazyValue
      }, inputAttrs), {}, {
        autofocus: this.autofocus,
        disabled: this.isDisabled,
        id: this.computedId,
        placeholder: this.persistentPlaceholder || this.isFocused || !this.hasLabel ? this.placeholder : undefined,
        readonly: this.isReadonly,
        type: this.type,
        onBlur: this.onBlur,
        onInput: this.onInput,
        onFocus: this.onFocus,
        onKeydown: this.onKeyDown
      }, listeners), {}, {
        ref: 'input'
      }));
      return (0, _vue.withDirectives)(node, [[_resize.default, this.onResize, '', {
        quiet: true
      }]]);
    },
    genMessages: function genMessages() {
      if (!this.showDetails) return null;

      var messagesNode = _VInput.default.methods.genMessages.call(this);

      var counterNode = this.genCounter();
      return (0, _vue.h)('div', {
        class: 'v-text-field__details'
      }, [messagesNode, counterNode]);
    },
    genTextFieldSlot: function genTextFieldSlot() {
      return (0, _vue.h)('div', {
        class: 'v-text-field__slot'
      }, [this.genLabel(), this.prefix ? this.genAffix('prefix') : null, this.genInput(), this.suffix ? this.genAffix('suffix') : null]);
    },
    genAffix: function genAffix(type) {
      return (0, _vue.h)('div', {
        class: "v-text-field__".concat(type),
        ref: type
      }, this[type]);
    },
    onBlur: function onBlur(e) {
      var _this6 = this;

      this.isFocused = false;
      e && this.$nextTick(function () {
        return _this6.$emit('blur', e);
      });
    },
    onClick: function onClick() {
      if (this.isFocused || this.isDisabled || !this.$refs.input) return;
      this.$refs.input.focus();
    },
    onFocus: function onFocus(e) {
      if (!this.$refs.input) return;
      var root = (0, _dom.attachedRoot)(this.$el);
      if (!root) return;

      if (root.activeElement !== this.$refs.input) {
        return this.$refs.input.focus();
      }

      if (!this.isFocused) {
        this.isFocused = true;
        e && this.$emit('focus', e);
      }
    },
    onInput: function onInput(e) {
      var target = e.target;
      this.internalValue = target.value;
      this.badInput = target.validity && target.validity.badInput;
    },
    onKeyDown: function onKeyDown(e) {
      if (e.keyCode === _helpers.keyCodes.enter && this.lazyValue !== this.initialValue) {
        this.initialValue = this.lazyValue;
        this.$emit('update:modelValue', this.initialValue);
      }

      this.$emit('keydown', e);
    },
    onMouseDown: function onMouseDown(e) {
      // Prevent input from being blurred
      if (e.target !== this.$refs.input) {
        e.preventDefault();
        e.stopPropagation();
      }

      _VInput.default.methods.onMouseDown.call(this, e);
    },
    onMouseUp: function onMouseUp(e) {
      if (this.hasMouseDown) this.focus();

      _VInput.default.methods.onMouseUp.call(this, e);
    },
    setLabelWidth: function setLabelWidth() {
      var _a, _b, _c, _d;

      if (!this.outlined) return;
      this.labelWidth = ((_b = (_a = this.$refs) === null || _a === void 0 ? void 0 : _a.label) === null || _b === void 0 ? void 0 : _b.$el) ? Math.min(((_d = (_c = this.$refs) === null || _c === void 0 ? void 0 : _c.label) === null || _d === void 0 ? void 0 : _d.$el.scrollWidth) * 0.75 + 6, this.$el.offsetWidth - 24) : 0;
    },
    setPrefixWidth: function setPrefixWidth() {
      if (!this.$refs.prefix) return;
      this.prefixWidth = this.$refs.prefix.offsetWidth;
    },
    setPrependWidth: function setPrependWidth() {
      if (!this.outlined || !this.$refs['prepend-inner']) return;
      this.prependWidth = this.$refs['prepend-inner'].offsetWidth;
    },
    tryAutofocus: function tryAutofocus() {
      if (!this.autofocus || typeof document === 'undefined' || !this.$refs.input) return false;
      var root = (0, _dom.attachedRoot)(this.$el);
      if (!root || root.activeElement === this.$refs.input) return false;
      this.$refs.input.focus();
      return true;
    },
    updateValue: function updateValue(val) {
      // Sets validationState from validatable
      this.hasColor = val;

      if (val) {
        this.initialValue = this.lazyValue;
      } else if (this.initialValue !== this.lazyValue) {
        this.$emit('update:modelValue', this.lazyValue);
      }
    },
    onResize: function onResize() {
      this.setLabelWidth();
      this.setPrefixWidth();
      this.setPrependWidth();
    }
  }
});

exports.default = _default;
//# sourceMappingURL=VTextField.js.map