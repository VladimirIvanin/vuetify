"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../../../src/components/VMessages/VMessages.sass");

var _colorable = _interopRequireDefault(require("../../mixins/colorable"));

var _themeable = _interopRequireDefault(require("../../mixins/themeable"));

var _vue = require("vue");

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _helpers = require("../../util/helpers");

var _console = require("../../util/console");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/* @vue/component */
var _default2 = (0, _mixins.default)(_colorable.default, _themeable.default).extend({
  name: 'v-messages',
  props: {
    modelValue: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  },
  created: function created() {
    var _this = this;

    var breakingProps = [['value', 'modelValue']];
    /* istanbul ignore next */

    breakingProps.forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          original = _ref2[0],
          replacement = _ref2[1];

      if (_this.$attrs.hasOwnProperty(original)) (0, _console.breaking)(original, replacement, _this);
    });
  },
  methods: {
    genChildren: function genChildren() {
      var _this2 = this;

      return (0, _vue.h)(_vue.TransitionGroup, {
        class: 'v-messages__wrapper',
        name: 'message-transition',
        tag: 'div'
      }, function () {
        return _this2.modelValue.map(_this2.genMessage);
      });
    },
    genMessage: function genMessage(message, key) {
      return (0, _vue.h)('div', {
        class: 'v-messages__message',
        key: key
      }, (0, _helpers.getSlot)(this, 'default', {
        message: message,
        key: key
      }) || [message]);
    }
  },
  render: function render() {
    return (0, _vue.h)('div', this.setTextColor(this.color, {
      class: ['v-messages', this.themeClasses]
    }), [this.genChildren()]);
  }
});

exports.default = _default2;
//# sourceMappingURL=VMessages.js.map