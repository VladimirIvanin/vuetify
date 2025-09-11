"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _bootable = _interopRequireDefault(require("../../mixins/bootable"));

var _groupable = require("../../mixins/groupable");

var _helpers = require("../../util/helpers");

var _mixins = _interopRequireDefault(require("../../util/mixins"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var baseMixins = (0, _mixins.default)(_bootable.default, (0, _groupable.factory)('windowGroup', 'v-window-item', 'v-window'));

var _default2 = baseMixins.extend({
  name: 'v-window-item',
  emits: ['change'],
  props: {
    disabled: Boolean,
    reverseTransition: {
      type: [Boolean, String],
      default: undefined
    },
    transition: {
      type: [Boolean, String],
      default: undefined
    },
    value: {
      required: false
    }
  },
  data: function data() {
    return {
      isActive: false,
      inTransition: false
    };
  },
  computed: {
    classes: function classes() {
      return this.groupClasses;
    },
    computedTransition: function computedTransition() {
      if (!this.windowGroup.internalReverse) {
        return typeof this.transition !== 'undefined' ? this.transition || '' : this.windowGroup.computedTransition;
      }

      return typeof this.reverseTransition !== 'undefined' ? this.reverseTransition || '' : this.windowGroup.computedTransition;
    }
  },
  methods: {
    genDefaultSlot: function genDefaultSlot() {
      return (0, _helpers.getSlot)(this);
    },
    genWindowItem: function genWindowItem() {
      return (0, _vue.withDirectives)((0, _vue.h)('div', _objectSpread({
        class: ['v-window-item', this.classes]
      }, this.$listeners), this.genDefaultSlot()), [[_vue.vShow, this.isActive]]);
    },
    onAfterTransition: function onAfterTransition() {
      if (!this.inTransition) {
        return;
      } // Finalize transition state.


      this.inTransition = false;

      if (this.windowGroup.transitionCount > 0) {
        this.windowGroup.transitionCount--; // Remove container height if we are out of transition.

        if (this.windowGroup.transitionCount === 0) {
          this.windowGroup.transitionHeight = undefined;
        }
      }
    },
    onBeforeTransition: function onBeforeTransition() {
      if (this.inTransition) {
        return;
      } // Initialize transition state here.


      this.inTransition = true;

      if (this.windowGroup.transitionCount === 0) {
        // Set initial height for height transition.
        this.windowGroup.transitionHeight = (0, _helpers.convertToUnit)(this.windowGroup.$el.clientHeight);
      }

      this.windowGroup.transitionCount++;
    },
    onTransitionCancelled: function onTransitionCancelled() {
      this.onAfterTransition(); // This should have the same path as normal transition end.
    },
    onEnter: function onEnter(el) {
      var _this = this;

      if (!this.inTransition) {
        return;
      }

      this.$nextTick(function () {
        // Do not set height if no transition or cancelled.
        if (!_this.computedTransition || !_this.inTransition) {
          return;
        } // Set transition target height.


        _this.windowGroup.transitionHeight = (0, _helpers.convertToUnit)(el.clientHeight);
      });
    }
  },
  render: function render() {
    var _this2 = this;

    return (0, _vue.h)(_vue.Transition, {
      name: this.computedTransition,
      // Handlers for enter windows.
      onBeforeEnter: this.onBeforeTransition,
      onAfterEnter: this.onAfterTransition,
      onEnterCancelled: this.onTransitionCancelled,
      // Handlers for leave windows.
      onBeforeLeave: this.onBeforeTransition,
      onAfterLeave: this.onAfterTransition,
      onLeaveCancelled: this.onTransitionCancelled,
      // Enter handler for height transition.
      onEnter: this.onEnter
    }, {
      default: function _default() {
        return _this2.showLazyContent(function () {
          return [_this2.genWindowItem()];
        });
      }
    });
  }
});

exports.default = _default2;
//# sourceMappingURL=VWindowItem.js.map