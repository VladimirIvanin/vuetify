"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _transitions = require("../transitions");

var _VIcon = _interopRequireDefault(require("../VIcon"));

var _colorable = _interopRequireDefault(require("../../mixins/colorable"));

var _registrable = require("../../mixins/registrable");

var _ripple = require("../../directives/ripple");

var _helpers = require("../../util/helpers");

var _mixins = _interopRequireDefault(require("../../util/mixins"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var baseMixins = (0, _mixins.default)(_colorable.default, (0, _registrable.inject)('expansionPanel', 'v-expansion-panel-header', 'v-expansion-panel'));

var _default = baseMixins.extend({
  name: 'v-expansion-panel-header',
  props: {
    disableIconRotate: Boolean,
    expandIcon: {
      type: String,
      default: '$expand'
    },
    hideActions: Boolean,
    ripple: {
      type: [Boolean, Object],
      default: false
    }
  },
  data: function data() {
    return {
      hasMousedown: false
    };
  },
  computed: {
    classes: function classes() {
      return {
        'v-expansion-panel-header--active': this.isActive,
        'v-expansion-panel-header--mousedown': this.hasMousedown
      };
    },
    isActive: function isActive() {
      return this.expansionPanel.isActive;
    },
    isDisabled: function isDisabled() {
      return this.expansionPanel.isDisabled;
    },
    isReadonly: function isReadonly() {
      return this.expansionPanel.isReadonly;
    }
  },
  created: function created() {
    this.expansionPanel.registerHeader(this);
  },
  beforeUnmount: function beforeUnmount() {
    this.expansionPanel.unregisterHeader();
  },
  methods: {
    onClick: function onClick(e) {
      this.$emit('click', e);
      this.$emitLegacy('click', e);
    },
    genIcon: function genIcon() {
      var _this = this;

      var icon = (0, _helpers.getSlot)(this, 'actions', {
        open: this.isActive
      }) || [(0, _vue.h)(_VIcon.default, {}, function () {
        return _this.expandIcon;
      })];
      return (0, _vue.h)(_transitions.VFadeTransition, {}, function () {
        return [(0, _vue.withDirectives)((0, _vue.h)('div', {
          class: ['v-expansion-panel-header__icon', {
            'v-expansion-panel-header__icon--disable-rotate': _this.disableIconRotate
          }]
        }, icon), [[_vue.vShow, !_this.isDisabled]])];
      });
    }
  },
  render: function render() {
    var _this2 = this;

    var directives = [[_ripple.Ripple, this.ripple]];
    return (0, _vue.withDirectives)((0, _vue.h)('button', this.setBackgroundColor(this.color, _objectSpread(_objectSpread({
      class: ['v-expansion-panel-header', this.classes],
      tabindex: this.isDisabled ? -1 : null,
      type: 'button',
      'aria-expanded': this.isActive
    }, this.$listeners), {}, {
      onClick: this.onClick,
      onMousedown: function onMousedown() {
        return _this2.hasMousedown = true;
      },
      onMouseup: function onMouseup() {
        return _this2.hasMousedown = false;
      }
    })), [(0, _helpers.getSlot)(this, 'default', {
      open: this.isActive
    }, true), this.hideActions || this.genIcon()]), directives);
  }
});

exports.default = _default;
//# sourceMappingURL=VExpansionPanelHeader.js.map