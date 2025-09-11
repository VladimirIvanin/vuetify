"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

require("../../../src/components/VBadge/VBadge.sass");

var _VIcon = _interopRequireDefault(require("../VIcon/VIcon"));

var _colorable = _interopRequireDefault(require("../../mixins/colorable"));

var _themeable = _interopRequireDefault(require("../../mixins/themeable"));

var _toggleable = require("../../mixins/toggleable");

var _transitionable = _interopRequireDefault(require("../../mixins/transitionable"));

var _positionable = require("../../mixins/positionable");

var _mergeData = _interopRequireDefault(require("../../util/mergeData"));

var _helpers = require("../../util/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Toggleable = (0, _toggleable.factory)('modelValue', 'update:modelValue');

var _default2 = (0, _vue.defineComponent)({
  name: 'v-badge',
  mixins: [_colorable.default, (0, _positionable.factory)(['left', 'bottom']), _themeable.default, Toggleable, _transitionable.default],
  props: {
    avatar: Boolean,
    bordered: Boolean,
    color: {
      type: String,
      default: 'primary'
    },
    content: {
      required: false
    },
    dot: Boolean,
    label: {
      type: String,
      default: '$vuetify.badge'
    },
    icon: String,
    inline: Boolean,
    offsetX: [Number, String],
    offsetY: [Number, String],
    overlap: Boolean,
    tile: Boolean,
    transition: {
      type: String,
      default: 'scale-rotate-transition'
    },
    modelValue: {
      default: true
    }
  },
  emits: ['update:modelValue'],
  computed: {
    classes: function classes() {
      return _objectSpread({
        'v-badge--avatar': this.avatar,
        'v-badge--bordered': this.bordered,
        'v-badge--bottom': this.bottom,
        'v-badge--dot': this.dot,
        'v-badge--icon': this.icon != null,
        'v-badge--inline': this.inline,
        'v-badge--left': this.left,
        'v-badge--overlap': this.overlap,
        'v-badge--tile': this.tile
      }, this.themeClasses);
    },
    computedBottom: function computedBottom() {
      return this.bottom ? 'auto' : this.computedYOffset;
    },
    computedLeft: function computedLeft() {
      if (this.isRtl) {
        return this.left ? this.computedXOffset : 'auto';
      }

      return this.left ? 'auto' : this.computedXOffset;
    },
    computedRight: function computedRight() {
      if (this.isRtl) {
        return this.left ? 'auto' : this.computedXOffset;
      }

      return !this.left ? 'auto' : this.computedXOffset;
    },
    computedTop: function computedTop() {
      return this.bottom ? this.computedYOffset : 'auto';
    },
    computedXOffset: function computedXOffset() {
      return this.calcPosition(this.offsetX);
    },
    computedYOffset: function computedYOffset() {
      return this.calcPosition(this.offsetY);
    },
    isRtl: function isRtl() {
      return this.$vuetify.rtl;
    },
    // Default fallback if offsetX
    // or offsetY are undefined.
    offset: function offset() {
      if (this.overlap) return this.dot ? 8 : 12;
      return this.dot ? 2 : 4;
    },
    styles: function styles() {
      if (this.inline) return {};
      return {
        bottom: this.computedBottom,
        left: this.computedLeft,
        right: this.computedRight,
        top: this.computedTop
      };
    }
  },
  methods: {
    calcPosition: function calcPosition(offset) {
      return "calc(100% - ".concat((0, _helpers.convertToUnit)(offset || this.offset), ")");
    },
    genBadge: function genBadge() {
      var lang = this.$vuetify.lang;
      var label = this.$attrs['aria-label'] || lang.t(this.label);
      var data = this.setBackgroundColor(this.color, {
        class: 'v-badge__badge',
        style: this.styles,
        'aria-atomic': this.$attrs['aria-atomic'] || 'true',
        'aria-label': label,
        'aria-live': this.$attrs['aria-live'] || 'polite',
        title: this.$attrs.title,
        role: this.$attrs.role || 'status'
      });
      var badge = (0, _vue.withDirectives)((0, _vue.h)('span', data, [this.genBadgeContent()]), [[_vue.vShow, this.isActive]]);
      if (!this.transition) return badge;
      return (0, _vue.h)(_vue.Transition, {
        name: this.transition,
        origin: this.origin,
        mode: this.mode
      }, {
        default: function _default() {
          return [badge];
        }
      });
    },
    genBadgeContent: function genBadgeContent() {
      // Dot prop shows no content
      if (this.dot) return undefined;
      var slot = (0, _helpers.getSlot)(this, 'badge');
      if (slot) return slot;
      if (this.content) return String(this.content);
      if (this.icon) return (0, _vue.h)(_VIcon.default, {
        icon: this.icon
      });
      return undefined;
    },
    genBadgeWrapper: function genBadgeWrapper() {
      return (0, _vue.h)('span', {
        class: 'v-badge__wrapper'
      }, [this.genBadge()]);
    }
  },
  render: function render() {
    var badge = [this.genBadgeWrapper()];
    var children = [(0, _helpers.getSlot)(this)];

    var _this$$attrs = this.$attrs,
        _x = _this$$attrs['aria-atomic'],
        _y = _this$$attrs['aria-label'],
        _z = _this$$attrs['aria-live'],
        role = _this$$attrs.role,
        title = _this$$attrs.title,
        attrs = _objectWithoutProperties(_this$$attrs, ["aria-atomic", "aria-label", "aria-live", "role", "title"]);

    if (this.inline && this.left) children.unshift(badge);else children.push(badge);
    return (0, _vue.h)('span', (0, _mergeData.default)({
      class: ['v-badge', this.classes]
    }, attrs), children);
  }
});

exports.default = _default2;
//# sourceMappingURL=VBadge.js.map