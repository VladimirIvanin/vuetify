"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _helpers = require("../../util/helpers");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = (0, _vue.defineComponent)({
  name: 'row',
  functional: true,
  props: {
    headers: Array,
    hideDefaultHeader: Boolean,
    index: Number,
    item: Object,
    rtl: Boolean
  },
  render: function render() {
    var props = this.$props;
    var data = this.$attrs;
    var computedSlots = this.$slots;
    var columns = props.headers.map(function (header) {
      var classes = {
        'v-data-table__mobile-row': true
      };
      var children = [];
      var value = (0, _helpers.getObjectValueByPath)(props.item, header.value);
      var slotName = header.value;
      var regularSlot = computedSlots.hasOwnProperty(slotName) && computedSlots[slotName];

      if (regularSlot) {
        children.push(regularSlot({
          item: props.item,
          isMobile: true,
          header: header,
          index: props.index,
          value: value
        }));
      } else {
        children.push(value == null ? value : String(value));
      }

      var mobileRowChildren = [(0, _vue.h)('div', {
        class: 'v-data-table__mobile-row__cell'
      }, children)];

      if (header.value !== 'dataTableSelect' && !props.hideDefaultHeader) {
        mobileRowChildren.unshift((0, _vue.h)('div', {
          class: 'v-data-table__mobile-row__header'
        }, [header.text]));
      }

      return (0, _vue.h)('td', {
        class: classes
      }, mobileRowChildren);
    });
    return (0, _vue.h)('tr', _objectSpread(_objectSpread({}, data), {}, {
      class: 'v-data-table__mobile-table-row'
    }), columns);
  }
});

exports.default = _default;
//# sourceMappingURL=MobileRow.js.map