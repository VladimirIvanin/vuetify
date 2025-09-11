"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

require("../../../src/components/VList/VListItem.sass");

var _colorable = _interopRequireDefault(require("../../mixins/colorable"));

var _routable = _interopRequireDefault(require("../../mixins/routable"));

var _groupable = require("../../mixins/groupable");

var _themeable = _interopRequireDefault(require("../../mixins/themeable"));

var _toggleable = require("../../mixins/toggleable");

var _helpers = require("./../../util/helpers");

var _mergeData = _interopRequireDefault(require("./../../util/mergeData"));

var _console = require("../../util/console");

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

var baseMixins = (0, _mixins.default)(_colorable.default, _routable.default, _themeable.default, (0, _groupable.factory)('listItemGroup'), (0, _toggleable.factory)('modelValue'));
/* @vue/component */

var _default = baseMixins.extend({
  name: 'v-list-item',
  inject: {
    isInGroup: {
      default: false
    },
    isInList: {
      default: false
    },
    isInMenu: {
      default: false
    },
    isInNav: {
      default: false
    }
  },
  inheritAttrs: false,
  props: {
    activeClass: {
      type: String
    },
    dense: Boolean,
    inactive: Boolean,
    onClick: Function,
    link: Boolean,
    selectable: {
      type: Boolean
    },
    tag: {
      type: String,
      default: 'div'
    },
    threeLine: Boolean,
    twoLine: Boolean,
    modelValue: null
  },
  emits: ['click', 'keydown', 'change', 'update:modelValue'],
  data: function data() {
    return {
      proxyClass: 'v-list-item--active'
    };
  },
  computed: {
    $activeClass: function $activeClass() {
      if (this.activeClass) return this.activeClass;
      if (!this.listItemGroup) return '';
      return this.listItemGroup.activeClass;
    },
    classes: function classes() {
      return _objectSpread(_objectSpread({
        'v-list-item': true
      }, _routable.default.computed.classes.call(this)), {}, {
        'v-list-item--dense': this.dense,
        'v-list-item--disabled': this.disabled,
        'v-list-item--link': this.isClickable && !this.inactive,
        'v-list-item--selectable': this.selectable,
        'v-list-item--three-line': this.threeLine,
        'v-list-item--two-line': this.twoLine
      }, this.themeClasses);
    },
    isClickable: function isClickable() {
      return Boolean(_routable.default.computed.isClickable.call(this) || this.listItemGroup);
    }
  },
  created: function created() {
    var _this = this;

    var breakingProps = [['value', 'modelValue']];
    /* istanbul ignore next */

    breakingProps.forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          original = _ref2[0],
          replacement = _ref2[1];

      if (_this.$attrs.hasOwnProperty(original)) (0, _console.breaking)(original, replacement, _this);
    });
    /* istanbul ignore next */

    if (this.$attrs.hasOwnProperty('avatar')) {
      (0, _console.removed)('avatar', this);
    }
  },
  methods: {
    click: function click(e) {
      if (e.detail) this.$el.blur();
      this.$emit('click', e);
      this.to || this.toggle();
    },
    genAttrs: function genAttrs() {
      var _this$$attrs = this.$attrs,
          _ = _this$$attrs.class,
          otherAttrs = _objectWithoutProperties(_this$$attrs, ["class"]);

      var attrs = _objectSpread(_objectSpread({}, otherAttrs), {}, {
        'aria-disabled': this.disabled ? true : undefined,
        tabindex: this.isClickable && !this.disabled ? 0 : -1
      });

      if (this.$attrs.hasOwnProperty('role')) {// do nothing, role already provided
      } else if (this.isInNav) {// do nothing, role is inherit
      } else if (this.isInGroup) {
        attrs.role = 'option';
        attrs['aria-selected'] = String(this.isActive);
      } else if (this.isInMenu) {
        attrs.role = this.isClickable ? 'menuitem' : undefined;
        attrs.id = attrs.id || "list-item-".concat(this.$.uid);
      } else if (this.isInList) {
        attrs.role = 'listitem';
      }

      return attrs;
    },
    toggle: function toggle() {
      if (this.to && this.modelValue === undefined) {
        this.isActive = !this.isActive;
      }

      this.$emit('change');
      this.$emitLegacy('change');
    }
  },
  render: function render() {
    var _this2 = this;

    var _this$generateRouteLi = this.generateRouteLink(),
        tag = _this$generateRouteLi.tag,
        data = _this$generateRouteLi.data,
        directives = _this$generateRouteLi.directives;

    var attrs = this.genAttrs();
    data = (0, _mergeData.default)(data, attrs);
    data = _objectSpread(_objectSpread({}, data), {}, {
      onKeydown: function onKeydown(e) {
        if (!_this2.disabled) {
          /* istanbul ignore else */
          if (e.keyCode === _helpers.keyCodes.enter) _this2.click(e);

          _this2.$emit('keydown', e);
        }
      }
    }, attrs);
    if (this.inactive) tag = 'div'; // if (this.inactive && this.to) {
    //   data.on = data.nativeOn
    //   delete data.nativeOn
    // }

    var slotProps = {
      active: this.isActive,
      toggle: this.toggle
    };
    var children = [(0, _helpers.getSlot)(this, 'prepend', slotProps), (0, _helpers.getSlot)(this, 'default', slotProps), (0, _helpers.getSlot)(this, 'append', slotProps)].filter(Boolean);
    var nodeData = this.isActive ? this.setTextColor(this.color, data) : data;
    var attrsClasses = this.$attrs.class;

    if (attrsClasses) {
      nodeData.class = [this.classes, attrsClasses];
    } else {
      nodeData.class = this.classes;
    }

    var node = typeof tag === 'string' ? (0, _vue.h)(tag, nodeData, children) : (0, _vue.h)(tag, nodeData, function () {
      return children;
    });
    return (0, _vue.withDirectives)(node, directives);
  }
});

exports.default = _default;
//# sourceMappingURL=VListItem.js.map