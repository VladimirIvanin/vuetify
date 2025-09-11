"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _helpers = require("../../util/helpers");

var _console = require("../../util/console");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _default = (0, _vue.defineComponent)({
  name: 'row-group',
  props: {
    modelValue: {
      type: Boolean,
      default: true
    },
    headerClass: {
      type: String,
      default: 'v-row-group__header'
    },
    contentClass: String,
    summaryClass: {
      type: String,
      default: 'v-row-group__summary'
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
  render: function render() {
    var props = this.$props;
    var children = [];
    var columnHeaderSlot = (0, _helpers.getSlot)(this, 'column.header');
    var rowHeaderSlot = (0, _helpers.getSlot)(this, 'row.header');
    var rowContentSlot = (0, _helpers.getSlot)(this, 'row.content');
    var columnSummarySlot = (0, _helpers.getSlot)(this, 'column.summary');
    var rowSummarySlot = (0, _helpers.getSlot)(this, 'row.summary');

    if (columnHeaderSlot) {
      children.push((0, _vue.h)('tr', {
        class: props.headerClass
      }, columnHeaderSlot));
    } else if (rowHeaderSlot) {
      children.push.apply(children, _toConsumableArray(Array.isArray(rowHeaderSlot) ? rowHeaderSlot : [rowHeaderSlot]));
    }

    if (rowContentSlot && props.modelValue) {
      children.push.apply(children, _toConsumableArray(Array.isArray(rowContentSlot) ? rowContentSlot : [rowContentSlot]));
    }

    if (columnSummarySlot) {
      children.push((0, _vue.h)('tr', {
        class: props.summaryClass
      }, columnSummarySlot));
    } else if (rowSummarySlot) {
      children.push.apply(children, _toConsumableArray(Array.isArray(rowSummarySlot) ? rowSummarySlot : [rowSummarySlot]));
    }

    return (0, _vue.h)(_vue.Fragment, children);
  }
});

exports.default = _default;
//# sourceMappingURL=RowGroup.js.map