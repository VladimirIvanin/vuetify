"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

require("../../../src/components/VList/VListGroup.sass");

var _VIcon = _interopRequireDefault(require("../VIcon"));

var _VListItem = _interopRequireDefault(require("./VListItem"));

var _VListItemIcon = _interopRequireDefault(require("./VListItemIcon"));

var _bindsAttrs = _interopRequireDefault(require("../../mixins/binds-attrs"));

var _bootable = _interopRequireDefault(require("../../mixins/bootable"));

var _colorable = _interopRequireDefault(require("../../mixins/colorable"));

var _toggleable = _interopRequireDefault(require("../../mixins/toggleable"));

var _registrable = require("../../mixins/registrable");

var _ripple = require("../../directives/ripple");

var _transitions = require("../transitions");

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _helpers = require("../../util/helpers");

var _console = require("../../util/console");

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

var baseMixins = (0, _mixins.default)(_bindsAttrs.default, _bootable.default, _colorable.default, (0, _registrable.inject)('list'), _toggleable.default);

var _default = baseMixins.extend({
  name: 'v-list-group',
  props: {
    activeClass: {
      type: String,
      default: ''
    },
    appendIcon: {
      type: String,
      default: '$expand'
    },
    color: {
      type: String,
      default: 'primary'
    },
    disabled: Boolean,
    group: [String, RegExp],
    noAction: Boolean,
    prependIcon: String,
    ripple: {
      type: [Boolean, Object],
      default: true
    },
    subGroup: Boolean
  },
  computed: {
    classes: function classes() {
      return {
        'v-list-group--active': this.isActive,
        'v-list-group--disabled': this.disabled,
        'v-list-group--no-action': this.noAction,
        'v-list-group--sub-group': this.subGroup
      };
    }
  },
  created: function created() {
    var _this = this;

    var breakingProps = [['value', 'modelValue'], ['inputValue', 'modelValue'], ['onInput', 'onUpdate:modelValue']];
    /* istanbul ignore next */

    breakingProps.forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          original = _ref2[0],
          replacement = _ref2[1];

      if (_this.$attrs.hasOwnProperty(original)) (0, _console.breaking)(original, replacement, _this);
    });
    this.list && this.list.register(this);

    if (this.group && this.$route && this.modelValue == null) {
      this.isActive = this.matchRoute(this.$route.path);
    }
  },
  watch: {
    isActive: function isActive(val) {
      /* istanbul ignore else */
      if (!this.subGroup && val) {
        this.list && this.list.listClick(this.$.uid);
      }
    },
    $route: 'onRouteChange'
  },
  beforeUnmount: function beforeUnmount() {
    this.list && this.list.unregister(this);
  },
  methods: {
    click: function click(e) {
      var _this2 = this;

      if (this.disabled) return;
      this.isBooted = true;
      this.$emit('click', e);
      this.$nextTick(function () {
        return _this2.isActive = !_this2.isActive;
      });
    },
    genIcon: function genIcon(icon) {
      return (0, _vue.h)(_VIcon.default, {}, function () {
        return icon;
      });
    },
    genAppendIcon: function genAppendIcon() {
      var _this3 = this;

      var icon = !this.subGroup ? this.appendIcon : false;
      var slot = (0, _helpers.getSlot)(this, 'appendIcon');
      if (!icon && !slot) return null;
      return (0, _vue.h)(_VListItemIcon.default, {
        class: 'v-list-group__header__append-icon'
      }, function () {
        return [slot || _this3.genIcon(icon)];
      });
    },
    genHeader: function genHeader() {
      var _this4 = this;

      return (0, _vue.withDirectives)((0, _vue.h)(_VListItem.default, _objectSpread(_objectSpread({
        'aria-expanded': String(this.isActive),
        role: 'button',
        class: _defineProperty({
          'v-list-group__header': true
        }, this.activeClass, this.isActive),
        link: true,
        modelValue: this.isActive
      }, this.listeners$), {}, {
        onClick: this.click
      }), function () {
        return [_this4.genPrependIcon(), (0, _helpers.getSlot)(_this4, 'activator'), _this4.genAppendIcon()];
      }), [[_ripple.Ripple, this.ripple]]);
    },
    genItems: function genItems() {
      var _this5 = this;

      var directives = [[_vue.vShow, this.isActive]];
      return this.showLazyContent(function () {
        return [(0, _vue.withDirectives)((0, _vue.h)('div', {
          class: 'v-list-group__items'
        }, (0, _helpers.getSlot)(_this5)), directives)];
      });
    },
    genPrependIcon: function genPrependIcon() {
      var _this6 = this;

      var icon = this.subGroup && this.prependIcon == null ? '$subgroup' : this.prependIcon;
      var slot = (0, _helpers.getSlot)(this, 'prependIcon');
      if (!icon && !slot) return null;
      return (0, _vue.h)(_VListItemIcon.default, {
        class: 'v-list-group__header__prepend-icon'
      }, function () {
        return [slot || _this6.genIcon(icon)];
      });
    },
    onRouteChange: function onRouteChange(to) {
      /* istanbul ignore if */
      if (!this.group) return;
      var isActive = this.matchRoute(to.path);
      /* istanbul ignore else */

      if (isActive && this.isActive !== isActive) {
        this.list && this.list.listClick(this.$.uid);
      }

      this.isActive = isActive;
    },
    toggle: function toggle(uid) {
      var _this7 = this;

      var isActive = this.$.uid === uid;
      if (isActive) this.isBooted = true;
      this.$nextTick(function () {
        return _this7.isActive = isActive;
      });
    },
    matchRoute: function matchRoute(to) {
      return to.match(this.group) !== null;
    }
  },
  render: function render() {
    var _this8 = this;

    return (0, _vue.h)('div', this.setTextColor(this.isActive && this.color, {
      class: ['v-list-group', this.classes]
    }), [this.genHeader(), (0, _vue.h)(_transitions.VExpandTransition, {}, function () {
      return _this8.genItems();
    })]);
  }
});

exports.default = _default;
//# sourceMappingURL=VListGroup.js.map