"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

require("../../../src/components/VRating/VRating.sass");

var _VIcon = _interopRequireDefault(require("../VIcon"));

var _colorable = _interopRequireDefault(require("../../mixins/colorable"));

var _delayable = _interopRequireDefault(require("../../mixins/delayable"));

var _sizeable = _interopRequireDefault(require("../../mixins/sizeable"));

var _rippleable = _interopRequireDefault(require("../../mixins/rippleable"));

var _themeable = _interopRequireDefault(require("../../mixins/themeable"));

var _ripple = _interopRequireDefault(require("../../directives/ripple"));

var _helpers = require("../../util/helpers");

var _mixins = _interopRequireDefault(require("../../util/mixins"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* @vue/component */
var _default2 = (0, _mixins.default)(_colorable.default, _delayable.default, _rippleable.default, _sizeable.default, _themeable.default).extend({
  name: 'v-rating',
  props: {
    backgroundColor: {
      type: String,
      default: 'accent'
    },
    color: {
      type: String,
      default: 'primary'
    },
    clearable: Boolean,
    dense: Boolean,
    emptyIcon: {
      type: String,
      default: '$ratingEmpty'
    },
    fullIcon: {
      type: String,
      default: '$ratingFull'
    },
    halfIcon: {
      type: String,
      default: '$ratingHalf'
    },
    halfIncrements: Boolean,
    hover: Boolean,
    length: {
      type: [Number, String],
      default: 5
    },
    readonly: Boolean,
    size: [Number, String],
    modelValue: {
      type: Number,
      default: 0
    },
    iconLabel: {
      type: String,
      default: '$vuetify.rating.ariaLabel.icon'
    }
  },
  emits: ['update:modelValue'],
  data: function data() {
    return {
      hoverIndex: -1,
      internalValue: this.modelValue
    };
  },
  computed: {
    directives: function directives() {
      return [[_ripple.default, {
        circle: true,
        isDirActive: !this.readonly && this.ripple
      }]];
    },
    iconProps: function iconProps() {
      var dark = this.dark,
          large = this.large,
          light = this.light,
          medium = this.medium,
          small = this.small,
          size = this.size,
          xLarge = this.xLarge,
          xSmall = this.xSmall;
      return {
        dark: dark,
        large: large,
        light: light,
        medium: medium,
        size: size,
        small: small,
        xLarge: xLarge,
        xSmall: xSmall
      };
    },
    isHovering: function isHovering() {
      return this.hover && this.hoverIndex >= 0;
    }
  },
  watch: {
    internalValue: function internalValue(val) {
      val !== this.modelValue && this.$emit('update:modelValue', val);
    },
    modelValue: function modelValue(val) {
      this.internalValue = val;
    }
  },
  methods: {
    createClickFn: function createClickFn(i) {
      var _this = this;

      return function (e) {
        if (_this.readonly) return;

        var newValue = _this.genHoverIndex(e, i);

        if (_this.clearable && _this.internalValue === newValue) {
          _this.internalValue = 0;
        } else {
          _this.internalValue = newValue;
        }
      };
    },
    createProps: function createProps(i) {
      var props = {
        index: i,
        value: this.internalValue,
        onClick: this.createClickFn(i),
        isFilled: Math.floor(this.internalValue) > i,
        isHovered: Math.floor(this.hoverIndex) > i
      };

      if (this.halfIncrements) {
        props.isHalfHovered = !props.isHovered && (this.hoverIndex - i) % 1 > 0;
        props.isHalfFilled = !props.isFilled && (this.internalValue - i) % 1 > 0;
      }

      return props;
    },
    genHoverIndex: function genHoverIndex(e, i) {
      var isHalf = this.isHalfEvent(e);

      if (this.halfIncrements && this.$vuetify.rtl) {
        isHalf = !isHalf;
      }

      return i + (isHalf ? 0.5 : 1);
    },
    getIconName: function getIconName(props) {
      var isFull = this.isHovering ? props.isHovered : props.isFilled;
      var isHalf = this.isHovering ? props.isHalfHovered : props.isHalfFilled;
      return isFull ? this.fullIcon : isHalf ? this.halfIcon : this.emptyIcon;
    },
    getColor: function getColor(props) {
      if (this.isHovering) {
        if (props.isHovered || props.isHalfHovered) return this.color;
      } else {
        if (props.isFilled || props.isHalfFilled) return this.color;
      }

      return this.backgroundColor;
    },
    isHalfEvent: function isHalfEvent(e) {
      if (this.halfIncrements) {
        var rect = e.target && e.target.getBoundingClientRect();
        if (rect && e.pageX - rect.left < rect.width / 2) return true;
      }

      return false;
    },
    onMouseEnter: function onMouseEnter(e, i) {
      var _this2 = this;

      this.runDelay('open', function () {
        _this2.hoverIndex = _this2.genHoverIndex(e, i);
      });
    },
    onMouseLeave: function onMouseLeave() {
      var _this3 = this;

      this.runDelay('close', function () {
        return _this3.hoverIndex = -1;
      });
    },
    genItem: function genItem(i) {
      var _this4 = this;

      var props = this.createProps(i);
      if (this.$slots.item) return this.$slots.item(props);
      var listeners = {
        onClick: props.onClick
      };

      if (this.hover) {
        listeners.onMouseenter = function (e) {
          return _this4.onMouseEnter(e, i);
        };

        listeners.onMouseleave = this.onMouseLeave;

        if (this.halfIncrements) {
          listeners.onMousemove = function (e) {
            return _this4.onMouseEnter(e, i);
          };
        }
      }

      return (0, _vue.withDirectives)((0, _vue.h)(_VIcon.default, this.setTextColor(this.getColor(props), _objectSpread(_objectSpread({
        'aria-label': this.$vuetify.lang.t(this.iconLabel, i + 1, Number(this.length))
      }, this.iconProps), listeners)), {
        default: function _default() {
          return [_this4.getIconName(props)];
        }
      }), this.directives);
    }
  },
  render: function render() {
    var _this5 = this;

    // const children = createRange(Number(this.length)).map(i => this.genItem(i))
    return (0, _vue.h)('div', {
      class: ['v-rating', {
        'v-rating--readonly': this.readonly,
        'v-rating--dense': this.dense
      }]
    }, {
      default: function _default() {
        return (0, _helpers.createRange)(Number(_this5.length)).map(function (i) {
          return _this5.genItem(i);
        });
      }
    });
  }
});

exports.default = _default2;
//# sourceMappingURL=VRating.js.map