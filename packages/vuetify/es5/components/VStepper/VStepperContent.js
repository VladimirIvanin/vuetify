"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _transitions = require("../transitions");

var _registrable = require("../../mixins/registrable");

var _helpers = require("../../util/helpers");

var _mixins = _interopRequireDefault(require("../../util/mixins"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var baseMixins = (0, _mixins.default)((0, _registrable.inject)('stepper', 'v-stepper-content', 'v-stepper'));
/* @vue/component */

var _default = baseMixins.extend({
  name: 'v-stepper-content',
  inject: {
    isVerticalProvided: {
      from: 'isVertical'
    }
  },
  props: {
    step: {
      type: [Number, String],
      required: true
    }
  },
  data: function data() {
    return {
      height: 0,
      // Must be null to allow
      // previous comparison
      isActive: null,
      isReverse: false,
      isVertical: this.isVerticalProvided
    };
  },
  computed: {
    computedTransition: function computedTransition() {
      // Fix for #8978
      var reverse = this.$vuetify.rtl ? !this.isReverse : this.isReverse;
      return reverse ? _transitions.VTabReverseTransition : _transitions.VTabTransition;
    },
    styles: function styles() {
      if (!this.isVertical) return {};
      return {
        height: (0, _helpers.convertToUnit)(this.height)
      };
    }
  },
  watch: {
    isActive: function isActive(current, previous) {
      // If active and the previous state
      // was null, is just booting up
      if (current && previous == null) {
        this.height = 'auto';
        return;
      }

      if (!this.isVertical) return;
      if (this.isActive) this.enter();else this.leave();
    }
  },
  mounted: function mounted() {
    this.$refs.wrapper.addEventListener('transitionend', this.onTransition, false);
    this.stepper && this.stepper.register(this);
  },
  beforeUnmount: function beforeUnmount() {
    this.$refs.wrapper.removeEventListener('transitionend', this.onTransition, false);
    this.stepper && this.stepper.unregister(this);
  },
  methods: {
    onTransition: function onTransition(e) {
      if (!this.isActive || e.propertyName !== 'height') return;
      this.height = 'auto';
    },
    enter: function enter() {
      var _this = this;

      var scrollHeight = 0; // Render bug with height

      requestAnimationFrame(function () {
        scrollHeight = _this.$refs.wrapper.scrollHeight;
      });
      this.height = 0; // Give the collapsing element time to collapse

      setTimeout(function () {
        return _this.isActive && (_this.height = scrollHeight || 'auto');
      }, 450);
    },
    leave: function leave() {
      var _this2 = this;

      this.height = this.$refs.wrapper.clientHeight;
      setTimeout(function () {
        return _this2.height = 0;
      }, 10);
    },
    toggle: function toggle(step, reverse) {
      this.isActive = step.toString() === this.step.toString();
      this.isReverse = reverse;
    }
  },
  render: function render() {
    var contentData = {
      class: 'v-stepper__content'
    };
    var wrapperData = {
      class: 'v-stepper__wrapper',
      style: this.styles,
      ref: 'wrapper'
    };

    if (!this.isVertical) {
      contentData.directives = [{
        name: 'show',
        value: this.isActive
      }];
    }

    var wrapper = (0, _vue.h)('div', wrapperData, (0, _helpers.getSlot)(this));
    var content = (0, _vue.withDirectives)((0, _vue.h)('div', contentData, [wrapper]), this.isVertical ? [] : [[_vue.vShow, this.isActive]]);
    return (0, _vue.h)(this.computedTransition, _objectSpread({}, this.$listeners), function () {
      return [content];
    });
  }
});

exports.default = _default;
//# sourceMappingURL=VStepperContent.js.map