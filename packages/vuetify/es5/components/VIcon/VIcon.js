"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../../../src/components/VIcon/VIcon.sass");

var _bindsAttrs = _interopRequireDefault(require("../../mixins/binds-attrs"));

var _colorable = _interopRequireDefault(require("../../mixins/colorable"));

var _sizeable = _interopRequireDefault(require("../../mixins/sizeable"));

var _themeable = _interopRequireDefault(require("../../mixins/themeable"));

var _helpers = require("../../util/helpers");

var _vue = require("vue");

var _mixins = _interopRequireDefault(require("../../util/mixins"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SIZE_MAP;

(function (SIZE_MAP) {
  SIZE_MAP["xSmall"] = "12px";
  SIZE_MAP["small"] = "16px";
  SIZE_MAP["default"] = "24px";
  SIZE_MAP["medium"] = "28px";
  SIZE_MAP["large"] = "36px";
  SIZE_MAP["xLarge"] = "40px";
})(SIZE_MAP || (SIZE_MAP = {}));

function isFontAwesome5(iconType) {
  return ['fas', 'far', 'fal', 'fab', 'fad', 'fak'].some(function (val) {
    return iconType.includes(val);
  });
}

function isSvgPath(icon) {
  return /^[mzlhvcsqta]\s*[-+.0-9][^mlhvzcsqta]+/i.test(icon) && /[\dz]$/i.test(icon) && icon.length > 4;
}

var VIcon = (0, _mixins.default)(_bindsAttrs.default, _colorable.default, _sizeable.default, _themeable.default
/* @vue/component */
).extend({
  name: 'v-icon',
  props: {
    dense: Boolean,
    disabled: Boolean,
    left: Boolean,
    right: Boolean,
    size: [Number, String],
    tag: {
      type: String,
      required: false,
      default: 'i'
    }
  },
  computed: {
    medium: function medium() {
      return false;
    },
    hasClickListener: function hasClickListener() {
      return Boolean(this.listeners$.onClick);
    }
  },
  methods: {
    getIcon: function getIcon() {
      var iconName = '';

      if (this.$slots.default) {
        var children = this.$slots.default()[0].children;
        if (typeof children === 'string') iconName = this.$slots.default()[0].children.trim();
      }

      return (0, _helpers.remapInternalIcon)(this, iconName);
    },
    getSize: function getSize() {
      var sizes = {
        xSmall: this.xSmall,
        small: this.small,
        medium: this.medium,
        large: this.large,
        xLarge: this.xLarge
      };
      var explicitSize = (0, _helpers.keys)(sizes).find(function (key) {
        return sizes[key];
      });
      return explicitSize && SIZE_MAP[explicitSize] || (0, _helpers.convertToUnit)(this.size);
    },
    // Component data for both font icon and SVG wrapper span
    getDefaultData: function getDefaultData() {
      var data = _objectSpread({
        class: {
          'v-icon--disabled': this.disabled,
          'v-icon--left': this.left,
          'v-icon--link': this.hasClickListener,
          'v-icon--right': this.right,
          'v-icon--dense': this.dense,
          'v-icon': true,
          'notranslate': true
        },
        'aria-hidden': !this.hasClickListener,
        type: this.hasClickListener ? 'button' : undefined
      }, this.listeners$);

      if (this.hasClickListener && this.disabled) {
        data.disabled = true;
      }

      return data;
    },
    getSvgWrapperData: function getSvgWrapperData() {
      var fontSize = this.getSize();

      var wrapperData = _objectSpread(_objectSpread({}, this.getDefaultData()), {}, {
        style: fontSize ? {
          fontSize: fontSize,
          height: fontSize,
          width: fontSize
        } : undefined
      });

      this.applyColors(wrapperData);
      return wrapperData;
    },
    applyColors: function applyColors(data) {
      data.class = _objectSpread(_objectSpread({}, data.class), this.themeClasses);
      this.setTextColor(this.color, data);
    },
    renderFontIcon: function renderFontIcon(icon) {
      var newChildren = [];
      var data = this.getDefaultData();
      var iconType = 'material-icons'; // Material Icon delimiter is _
      // https://material.io/icons/

      var delimiterIndex = icon.indexOf('-');
      var isMaterialIcon = delimiterIndex <= -1;

      if (isMaterialIcon) {
        // Material icon uses ligatures.
        newChildren.push(icon);
      } else {
        iconType = icon.slice(0, delimiterIndex);
        if (isFontAwesome5(iconType)) iconType = '';
      }

      if (typeof data.class === 'string') {
        data.class = data.class.split(' ').reduce(function (classes, className) {
          classes[className] = true;
          return classes;
        }, {});
      }

      data.class[iconType] = true;
      data.class[icon] = !isMaterialIcon;
      var fontSize = this.getSize();
      if (fontSize) data.style = {
        fontSize: fontSize
      };
      this.applyColors(data);
      return (0, _vue.h)(this.hasClickListener ? 'button' : this.tag, (0, _helpers.normalizeAttrs)(data), {
        default: function _default() {
          return newChildren;
        }
      });
    },
    renderSvgIcon: function renderSvgIcon(icon) {
      var svgData = {
        class: 'v-icon__svg',
        attrs: {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 24 24',
          role: 'img',
          'aria-hidden': true
        }
      };
      var size = this.getSize();

      if (size) {
        svgData.style = {
          fontSize: size,
          height: size,
          width: size
        };
      }

      return (0, _vue.h)(this.hasClickListener ? 'button' : 'span', this.getSvgWrapperData(), [(0, _vue.h)('svg', svgData, [(0, _vue.h)('path', {
        attrs: {
          d: icon
        }
      })])]);
    },
    renderSvgIconComponent: function renderSvgIconComponent(icon) {
      var data = {
        class: {
          'v-icon__component': true
        }
      };
      var size = this.getSize();

      if (size) {
        data.style = {
          fontSize: size,
          height: size,
          width: size
        };
      }

      this.applyColors(data);
      var component = icon.component;
      data.props = icon.props;
      data.nativeOn = data.on;
      return (0, _vue.h)(this.hasClickListener ? 'button' : 'span', this.getSvgWrapperData(), {
        default: function _default() {
          return [(0, _vue.h)(component, data)];
        }
      });
    }
  },
  render: function render() {
    var icon = this.getIcon();

    if (typeof icon === 'string') {
      if (isSvgPath(icon)) {
        return this.renderSvgIcon(icon);
      }

      return this.renderFontIcon(icon);
    }

    return this.renderSvgIconComponent(icon);
  }
});

var _default2 = (0, _vue.defineComponent)({
  name: 'v-icon',
  $_wrapperFor: VIcon,
  functional: true,
  mounted: function mounted() {
    this.$el.innerHTML = '';
  },
  render: function render() {
    var _this = this;

    var data = _objectSpread({}, this.$attrs); // console.log(children && children[0]?.children)


    return (0, _vue.h)(VIcon, data, {
      default: function _default() {
        var _a, _b, _c, _d;

        var iconName = ''; // Support usage of v-text and v-html
        // if (data.domProps) {

        if ((_a = _this.$.vnode.props) === null || _a === void 0 ? void 0 : _a.textContent) {
          iconName = _this.$.vnode.props.textContent || _this.$.vnode.props.innerHTML || iconName;
        }

        var children = (_c = (_b = _this.$slots).default) === null || _c === void 0 ? void 0 : _c.call(_b);
        return iconName ? [iconName] : children && ((_d = children[0]) === null || _d === void 0 ? void 0 : _d.children);
      }
    });
  }
});

exports.default = _default2;
//# sourceMappingURL=VIcon.js.map