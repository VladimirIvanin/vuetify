"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

require("../../../src/components/VNavigationDrawer/VNavigationDrawer.sass");

var _VImg = _interopRequireDefault(require("../VImg/VImg"));

var _applicationable = _interopRequireDefault(require("../../mixins/applicationable"));

var _colorable = _interopRequireDefault(require("../../mixins/colorable"));

var _dependent = _interopRequireDefault(require("../../mixins/dependent"));

var _mobile = _interopRequireDefault(require("../../mixins/mobile"));

var _overlayable = _interopRequireDefault(require("../../mixins/overlayable"));

var _ssrBootable = _interopRequireDefault(require("../../mixins/ssr-bootable"));

var _themeable = _interopRequireDefault(require("../../mixins/themeable"));

var _clickOutside = _interopRequireDefault(require("../../directives/click-outside"));

var _touch = _interopRequireDefault(require("../../directives/touch"));

var _helpers = require("../../util/helpers");

var _console = require("../../util/console");

var _mixins = _interopRequireDefault(require("../../util/mixins"));

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

var baseMixins = (0, _mixins.default)((0, _applicationable.default)('left', ['isActive', 'isMobile', 'miniVariant', 'expandOnHover', 'permanent', 'right', 'temporary', 'width']), _colorable.default, _dependent.default, _mobile.default, _overlayable.default, _ssrBootable.default, _themeable.default);
/* @vue/component */

var _default = baseMixins.extend({
  name: 'v-navigation-drawer',
  provide: function provide() {
    return {
      isInNav: this.$tag === 'nav'
    };
  },
  props: {
    bottom: Boolean,
    clipped: Boolean,
    disableResizeWatcher: Boolean,
    disableRouteWatcher: Boolean,
    expandOnHover: Boolean,
    floating: Boolean,
    height: {
      type: [Number, String]
    },
    miniVariant: Boolean,
    miniVariantWidth: {
      type: [Number, String],
      default: 56
    },
    permanent: Boolean,
    right: Boolean,
    src: {
      type: [String, Object],
      default: ''
    },
    stateless: Boolean,
    tag: {
      type: String
    },
    temporary: Boolean,
    touchless: Boolean,
    width: {
      type: [Number, String],
      default: 256
    },
    modelValue: null
  },
  emits: ['update:modelValue', 'transitionend', 'update:mini-variant'],
  data: function data() {
    return {
      isMouseover: false,
      touchArea: {
        left: 0,
        right: 0
      },
      stackMinZIndex: 6
    };
  },
  computed: {
    $tag: function $tag() {
      return this.tag || this.app ? 'nav' : 'aside';
    },
    $height: function $height() {
      return this.height || (this.app ? '100vh' : '100%');
    },

    /**
     * Used for setting an app value from a dynamic
     * property. Called from applicationable.js
     */
    applicationProperty: function applicationProperty() {
      return this.right ? 'right' : 'left';
    },
    classes: function classes() {
      return _objectSpread({
        'v-navigation-drawer': true,
        'v-navigation-drawer--absolute': this.absolute,
        'v-navigation-drawer--bottom': this.bottom,
        'v-navigation-drawer--clipped': this.clipped,
        'v-navigation-drawer--close': !this.isActive,
        'v-navigation-drawer--fixed': !this.absolute && (this.app || this.fixed),
        'v-navigation-drawer--floating': this.floating,
        'v-navigation-drawer--is-mobile': this.isMobile,
        'v-navigation-drawer--is-mouseover': this.isMouseover,
        'v-navigation-drawer--mini-variant': this.isMiniVariant,
        'v-navigation-drawer--custom-mini-variant': Number(this.miniVariantWidth) !== 56,
        'v-navigation-drawer--open': this.isActive,
        'v-navigation-drawer--open-on-hover': this.expandOnHover,
        'v-navigation-drawer--right': this.right,
        'v-navigation-drawer--temporary': this.temporary
      }, this.themeClasses);
    },
    computedMaxHeight: function computedMaxHeight() {
      if (!this.hasApp) return null;
      var computedMaxHeight = this.$vuetify.application.bottom + this.$vuetify.application.footer + this.$vuetify.application.bar;
      if (!this.clipped) return computedMaxHeight;
      return computedMaxHeight + this.$vuetify.application.top;
    },
    computedTop: function computedTop() {
      if (!this.hasApp) return 0;
      var computedTop = this.$vuetify.application.bar;
      computedTop += this.clipped ? this.$vuetify.application.top : 0;
      return computedTop;
    },
    computedTransform: function computedTransform() {
      if (this.isActive) return 0;
      if (this.isBottom) return 100;
      return this.right ? 100 : -100;
    },
    computedWidth: function computedWidth() {
      return this.isMiniVariant ? this.miniVariantWidth : this.width;
    },
    hasApp: function hasApp() {
      return this.app && !this.isMobile && !this.temporary;
    },
    isBottom: function isBottom() {
      return this.bottom && this.isMobile;
    },
    isMiniVariant: function isMiniVariant() {
      return !this.expandOnHover && this.miniVariant || this.expandOnHover && !this.isMouseover;
    },
    isMobile: function isMobile() {
      return !this.stateless && !this.permanent && _mobile.default.computed.isMobile.call(this);
    },
    reactsToClick: function reactsToClick() {
      return !this.stateless && !this.permanent && (this.isMobile || this.temporary);
    },
    reactsToMobile: function reactsToMobile() {
      return this.app && !this.disableResizeWatcher && !this.permanent && !this.stateless && !this.temporary;
    },
    reactsToResize: function reactsToResize() {
      return !this.disableResizeWatcher && !this.stateless;
    },
    reactsToRoute: function reactsToRoute() {
      return !this.disableRouteWatcher && !this.stateless && (this.temporary || this.isMobile);
    },
    showOverlay: function showOverlay() {
      return !this.hideOverlay && this.isActive && (this.isMobile || this.temporary);
    },
    styles: function styles() {
      var translate = this.isBottom ? 'translateY' : 'translateX';
      return {
        height: (0, _helpers.convertToUnit)(this.$height),
        top: !this.isBottom ? (0, _helpers.convertToUnit)(this.computedTop) : 'auto',
        maxHeight: this.computedMaxHeight != null ? "calc(100% - ".concat((0, _helpers.convertToUnit)(this.computedMaxHeight), ")") : undefined,
        transform: "".concat(translate, "(").concat((0, _helpers.convertToUnit)(this.computedTransform, '%'), ")"),
        width: (0, _helpers.convertToUnit)(this.computedWidth)
      };
    }
  },
  watch: {
    $route: 'onRouteChange',
    isActive: function isActive(val) {
      this.$emit('update:modelValue', val);
    },

    /**
     * When mobile changes, adjust the active state
     * only when there has been a previous value
     */
    isMobile: function isMobile(val, prev) {
      !val && this.isActive && !this.temporary && this.removeOverlay();
      if (prev == null || !this.reactsToResize || !this.reactsToMobile) return;
      this.isActive = !val;
    },
    permanent: function permanent(val) {
      // If enabling prop enable the drawer
      if (val) this.isActive = true;
    },
    showOverlay: function showOverlay(val) {
      if (val) this.genOverlay();else this.removeOverlay();
    },
    modelValue: function modelValue(val) {
      if (this.permanent) return;

      if (val == null) {
        this.init();
        return;
      }

      if (val !== this.isActive) this.isActive = val;
    },
    expandOnHover: 'updateMiniVariant',
    isMouseover: function isMouseover(val) {
      this.updateMiniVariant(!val);
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
  },
  beforeMount: function beforeMount() {
    this.init();
  },
  methods: {
    calculateTouchArea: function calculateTouchArea() {
      var parent = this.$el.parentNode;
      if (!parent) return;
      var parentRect = parent.getBoundingClientRect();
      this.touchArea = {
        left: parentRect.left + 50,
        right: parentRect.right - 50
      };
    },
    closeConditional: function closeConditional() {
      return this.isActive && !this._isDestroyed && this.reactsToClick;
    },
    genAppend: function genAppend() {
      return this.genPosition('append');
    },
    genBackground: function genBackground() {
      var props = {
        height: '100%',
        width: '100%',
        src: this.src
      };
      var image = this.$slots.img ? this.$slots.img(props) : (0, _vue.h)(_VImg.default, {
        props: props
      });
      return (0, _vue.h)('div', {
        class: 'v-navigation-drawer__image'
      }, [image]);
    },
    genDirectives: function genDirectives() {
      var _this2 = this;

      return [[_clickOutside.default, {
        handler: function handler() {
          _this2.isActive = false;
        },
        closeConditional: this.closeConditional,
        include: this.getOpenDependentElements
      }], [_touch.default, {
        parent: true,
        left: this.swipeLeft,
        right: this.swipeRight,
        isDirActive: !this.touchless && !this.stateless
      }]];
    },
    genListeners: function genListeners() {
      var _this3 = this;

      var on = {
        onMouseenter: function onMouseenter() {
          return _this3.isMouseover = true;
        },
        onMouseleave: function onMouseleave() {
          return _this3.isMouseover = false;
        },
        onTransitionend: function onTransitionend(e) {
          if (e.target !== e.currentTarget) return;

          _this3.$emit('transitionend', e); // IE11 does not support new Event('resize')


          var resizeEvent = document.createEvent('UIEvents');
          resizeEvent.initUIEvent('resize', true, false, window, 0);
          window.dispatchEvent(resizeEvent);
        }
      };

      if (this.miniVariant) {
        on.onClick = function () {
          return _this3.$emit('update:mini-variant', false);
        };
      }

      return on;
    },
    genPosition: function genPosition(name) {
      var slot = (0, _helpers.getSlot)(this, name);
      if (!slot) return slot;
      return (0, _vue.h)('div', {
        class: "v-navigation-drawer__".concat(name)
      }, slot);
    },
    genPrepend: function genPrepend() {
      return this.genPosition('prepend');
    },
    genContent: function genContent() {
      return (0, _vue.h)('div', {
        class: 'v-navigation-drawer__content'
      }, (0, _helpers.getSlot)(this));
    },
    genBorder: function genBorder() {
      return (0, _vue.h)('div', {
        class: 'v-navigation-drawer__border'
      });
    },
    init: function init() {
      if (this.permanent) {
        this.isActive = true;
      } else if (this.stateless || this.modelValue != null) {
        this.isActive = this.modelValue;
      } else if (!this.temporary) {
        this.isActive = !this.isMobile;
      }
    },
    onRouteChange: function onRouteChange() {
      if (this.reactsToRoute && this.closeConditional()) {
        this.isActive = false;
      }
    },
    swipeLeft: function swipeLeft(e) {
      if (this.isActive && this.right) return;
      this.calculateTouchArea();
      if (Math.abs(e.touchendX - e.touchstartX) < 100) return;
      if (this.right && e.touchstartX >= this.touchArea.right) this.isActive = true;else if (!this.right && this.isActive) this.isActive = false;
    },
    swipeRight: function swipeRight(e) {
      if (this.isActive && !this.right) return;
      this.calculateTouchArea();
      if (Math.abs(e.touchendX - e.touchstartX) < 100) return;
      if (!this.right && e.touchstartX <= this.touchArea.left) this.isActive = true;else if (this.right && this.isActive) this.isActive = false;
    },

    /**
     * Update the application layout
     */
    updateApplication: function updateApplication() {
      if (!this.isActive || this.isMobile || this.temporary || !this.$el) return 0;
      var width = Number(this.miniVariant ? this.miniVariantWidth : this.width);
      return isNaN(width) ? this.$el.clientWidth : width;
    },
    updateMiniVariant: function updateMiniVariant(val) {
      if (this.expandOnHover && this.miniVariant !== val) this.$emit('update:mini-variant', val);
    }
  },
  render: function render() {
    var children = [this.genPrepend(), this.genContent(), this.genAppend(), this.genBorder()];
    if (this.src || (0, _helpers.getSlot)(this, 'img')) children.unshift(this.genBackground());
    var node = (0, _vue.h)(this.$tag, this.setBackgroundColor(this.color, _objectSpread({
      class: this.classes,
      style: this.styles
    }, this.genListeners())), children);
    return (0, _vue.withDirectives)(node, this.genDirectives());
  }
});

exports.default = _default;
//# sourceMappingURL=VNavigationDrawer.js.map