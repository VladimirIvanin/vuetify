"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

require("../../../src/components/VTooltip/VTooltip.sass");

var _activatable = _interopRequireDefault(require("../../mixins/activatable"));

var _colorable = _interopRequireDefault(require("../../mixins/colorable"));

var _delayable = _interopRequireDefault(require("../../mixins/delayable"));

var _dependent = _interopRequireDefault(require("../../mixins/dependent"));

var _menuable = _interopRequireDefault(require("../../mixins/menuable"));

var _helpers = require("../../util/helpers");

var _console = require("../../util/console");

var _mixins = _interopRequireDefault(require("../../util/mixins"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* @vue/component */
var _default = (0, _mixins.default)(_colorable.default, _delayable.default, _dependent.default, _menuable.default).extend({
  name: 'v-tooltip',
  props: {
    closeDelay: {
      type: [Number, String],
      default: 0
    },
    disabled: Boolean,
    openDelay: {
      type: [Number, String],
      default: 0
    },
    openOnHover: {
      type: Boolean,
      default: true
    },
    openOnFocus: {
      type: Boolean,
      default: true
    },
    tag: {
      type: String,
      default: 'span'
    },
    transition: String
  },
  data: function data() {
    return {
      calculatedMinWidth: 0,
      closeDependents: false
    };
  },
  computed: {
    calculatedLeft: function calculatedLeft() {
      var _this$dimensions = this.dimensions,
          activator = _this$dimensions.activator,
          content = _this$dimensions.content;
      var unknown = !this.bottom && !this.left && !this.top && !this.right;
      var activatorLeft = this.attach !== false ? activator.offsetLeft : activator.left;
      var left = 0;

      if (this.top || this.bottom || unknown) {
        left = activatorLeft + activator.width / 2 - content.width / 2;
      } else if (this.left || this.right) {
        left = activatorLeft + (this.right ? activator.width : -content.width) + (this.right ? 10 : -10);
      }

      if (this.nudgeLeft) left -= parseInt(this.nudgeLeft);
      if (this.nudgeRight) left += parseInt(this.nudgeRight);
      return "".concat(this.calcXOverflow(left, this.dimensions.content.width), "px");
    },
    calculatedTop: function calculatedTop() {
      var _this$dimensions2 = this.dimensions,
          activator = _this$dimensions2.activator,
          content = _this$dimensions2.content;
      var activatorTop = this.attach !== false ? activator.offsetTop : activator.top;
      var top = 0;

      if (this.top || this.bottom) {
        top = activatorTop + (this.bottom ? activator.height : -content.height) + (this.bottom ? 10 : -10);
      } else if (this.left || this.right) {
        top = activatorTop + activator.height / 2 - content.height / 2;
      }

      if (this.nudgeTop) top -= parseInt(this.nudgeTop);
      if (this.nudgeBottom) top += parseInt(this.nudgeBottom);
      if (this.attach === false) top += this.pageYOffset;
      return "".concat(this.calcYOverflow(top), "px");
    },
    classes: function classes() {
      return {
        'v-tooltip--top': this.top,
        'v-tooltip--right': this.right,
        'v-tooltip--bottom': this.bottom,
        'v-tooltip--left': this.left,
        'v-tooltip--attached': this.attach === '' || this.attach === true || this.attach === 'attach'
      };
    },
    computedTransition: function computedTransition() {
      if (this.transition) return this.transition;
      return this.isActive ? 'scale-transition' : 'fade-transition';
    },
    offsetY: function offsetY() {
      return this.top || this.bottom;
    },
    offsetX: function offsetX() {
      return this.left || this.right;
    },
    styles: function styles() {
      return {
        left: this.calculatedLeft,
        maxWidth: (0, _helpers.convertToUnit)(this.maxWidth),
        minWidth: (0, _helpers.convertToUnit)(this.minWidth),
        top: this.calculatedTop,
        zIndex: this.zIndex || this.activeZIndex
      };
    }
  },
  beforeMount: function beforeMount() {
    var _this = this;

    this.$nextTick(function () {
      _this.modelValue && _this.callActivate();
    });
  },
  mounted: function mounted() {
    if ((0, _helpers.getSlotType)(this, 'activator', true) === 'v-slot') {
      (0, _console.consoleError)("v-tooltip's activator slot must be bound, try '<template #activator=\"data\"><v-btn v-on=\"data.on>'", this);
    }
  },
  methods: {
    activate: function activate() {
      // Update coordinates and dimensions of menu
      // and its activator
      this.updateDimensions(); // Start the transition

      requestAnimationFrame(this.startTransition);
    },
    deactivate: function deactivate() {
      this.runDelay('close');
    },
    genActivatorListeners: function genActivatorListeners() {
      var _this2 = this;

      var listeners = _activatable.default.methods.genActivatorListeners.call(this);

      if (this.openOnFocus) {
        listeners.onFocus = function (e) {
          _this2.getActivator(e);

          _this2.runDelay('open');
        };

        listeners.onBlur = function (e) {
          _this2.getActivator(e);

          _this2.runDelay('close');
        };
      }

      listeners.onKeydown = function (e) {
        if (e.keyCode === _helpers.keyCodes.esc) {
          _this2.getActivator(e);

          _this2.runDelay('close');
        }
      };

      return listeners;
    },
    genActivatorAttributes: function genActivatorAttributes() {
      return {
        'aria-haspopup': true,
        'aria-expanded': String(this.isActive)
      };
    },
    genTransition: function genTransition() {
      var content = this.genContent();
      if (!this.computedTransition) return content;
      return (0, _vue.h)(_vue.Transition, {
        name: this.computedTransition
      }, function () {
        return [content];
      });
    },
    genContent: function genContent() {
      var _ref;

      return (0, _vue.withDirectives)((0, _vue.h)('div', this.setBackgroundColor(this.color, _objectSpread(_objectSpread({}, this.getScopeIdAttrs()), {}, {
        class: ['v-tooltip__content', (_ref = {}, _defineProperty(_ref, this.contentClass, true), _defineProperty(_ref, "menuable__content__active", this.isActive), _defineProperty(_ref, 'v-tooltip__content--fixed', this.activatorFixed), _ref)],
        style: this.styles,
        ref: 'content'
      })), this.getContentSlot()), [[_vue.vShow, this.isContentActive]]);
    }
  },
  render: function render() {
    var _this3 = this;

    return (0, _vue.h)(this.tag, {
      class: ['v-tooltip', this.classes]
    }, [this.showLazyContent(function () {
      return [_this3.genTransition()];
    }), this.genActivator()]);
  }
});

exports.default = _default;
//# sourceMappingURL=VTooltip.js.map