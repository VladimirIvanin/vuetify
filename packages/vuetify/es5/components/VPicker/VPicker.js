"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

require("../../../src/components/VPicker/VPicker.sass");

require("../../../src/components/VCard/VCard.sass");

var _colorable = _interopRequireDefault(require("../../mixins/colorable"));

var _elevatable = _interopRequireDefault(require("../../mixins/elevatable"));

var _themeable = _interopRequireDefault(require("../../mixins/themeable"));

var _helpers = require("../../util/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* @vue/component */
var _default = (0, _vue.defineComponent)({
  name: 'v-picker',
  mixins: [_colorable.default, _elevatable.default, _themeable.default],
  props: {
    flat: Boolean,
    fullWidth: Boolean,
    landscape: Boolean,
    noTitle: Boolean,
    transition: {
      type: String,
      default: 'fade-transition'
    },
    width: {
      type: [Number, String],
      default: 290
    }
  },
  computed: {
    computedTitleColor: function computedTitleColor() {
      var defaultTitleColor = this.isDark ? false : this.color || 'primary';
      return this.color || defaultTitleColor;
    }
  },
  methods: {
    genTitle: function genTitle() {
      return (0, _vue.h)('div', this.setBackgroundColor(this.computedTitleColor, {
        class: ['v-picker__title', {
          'v-picker__title--landscape': this.landscape
        }]
      }), (0, _helpers.getSlot)(this, 'title'));
    },
    genBodyTransition: function genBodyTransition() {
      var _this = this;

      return (0, _vue.h)(_vue.Transition, {
        name: this.transition
      }, function () {
        return (0, _helpers.getSlot)(_this);
      });
    },
    genBody: function genBody() {
      return (0, _vue.h)('div', {
        class: ['v-picker__body', _objectSpread({
          'v-picker__body--no-title': this.noTitle
        }, this.themeClasses)],
        style: this.fullWidth ? undefined : {
          width: (0, _helpers.convertToUnit)(this.width)
        }
      }, [this.genBodyTransition()]);
    },
    genActions: function genActions() {
      return (0, _vue.h)('div', {
        class: ['v-picker__actions v-card__actions', {
          'v-picker__actions--no-title': this.noTitle
        }]
      }, (0, _helpers.getSlot)(this, 'actions'));
    }
  },
  render: function render() {
    return (0, _vue.h)('div', {
      class: ['v-picker v-card', _objectSpread(_objectSpread({
        'v-picker--flat': this.flat,
        'v-picker--landscape': this.landscape,
        'v-picker--full-width': this.fullWidth
      }, this.themeClasses), this.elevationClasses)]
    }, [this.$slots.title ? this.genTitle() : null, this.genBody(), this.$slots.actions ? this.genActions() : null]);
  }
});

exports.default = _default;
//# sourceMappingURL=VPicker.js.map