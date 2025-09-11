"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

require("../../../src/components/VSpeedDial/VSpeedDial.sass");

var _toggleable = _interopRequireDefault(require("../../mixins/toggleable"));

var _positionable = _interopRequireDefault(require("../../mixins/positionable"));

var _transitionable = _interopRequireDefault(require("../../mixins/transitionable"));

var _clickOutside = _interopRequireDefault(require("../../directives/click-outside"));

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _helpers = require("../../util/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* @vue/component */
var _default = (0, _mixins.default)(_positionable.default, _toggleable.default, _transitionable.default).extend({
  name: 'v-speed-dial',
  props: {
    direction: {
      type: String,
      default: 'top',
      validator: function validator(val) {
        return ['top', 'right', 'bottom', 'left'].includes(val);
      }
    },
    openOnHover: Boolean,
    transition: {
      type: String,
      default: 'scale-transition'
    }
  },
  emits: ['update:modelValue'],
  computed: {
    classes: function classes() {
      var _ref;

      return _ref = {
        'v-speed-dial': true,
        'v-speed-dial--top': this.top,
        'v-speed-dial--right': this.right,
        'v-speed-dial--bottom': this.bottom,
        'v-speed-dial--left': this.left,
        'v-speed-dial--absolute': this.absolute,
        'v-speed-dial--fixed': this.fixed
      }, _defineProperty(_ref, "v-speed-dial--direction-".concat(this.direction), true), _defineProperty(_ref, 'v-speed-dial--is-active', this.isActive), _ref;
    }
  },
  render: function render() {
    var _this = this;

    var children = [];
    var data = {
      class: this.classes,
      onClick: function onClick() {
        return _this.isActive = !_this.isActive;
      }
    };

    if (this.openOnHover) {
      data.onMouseenter = function () {
        return _this.isActive = true;
      };

      data.onMouseleave = function () {
        return _this.isActive = false;
      };
    }

    if (this.isActive) {
      var btnCount = 0;
      children = ((0, _helpers.getSlot)(this) || []).map(function (b, i) {
        var componentName = b.type && _typeof(b.type) === 'object' && 'name' in b.type ? b.type.name : null;

        if (b.tag && (componentName === 'v-btn' || componentName === 'v-tooltip')) {
          btnCount++;
          return (0, _vue.h)('div', {
            style: {
              transitionDelay: btnCount * 0.05 + 's'
            },
            key: i
          }, [b]);
        } else {
          b.key = i;
          return b;
        }
      });
    }

    var list = (0, _vue.h)(_vue.TransitionGroup, {
      class: 'v-speed-dial__list',
      name: this.transition,
      mode: this.mode,
      origin: this.origin,
      tag: 'div'
    }, children);
    return (0, _vue.withDirectives)((0, _vue.h)('div', data, [(0, _helpers.getSlot)(this, 'activator'), list]), [[_clickOutside.default, function () {
      return _this.isActive = false;
    }]]);
  }
});

exports.default = _default;
//# sourceMappingURL=VSpeedDial.js.map