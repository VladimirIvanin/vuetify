"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.factory = factory;
exports.default = void 0;

var _vue = require("vue");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function factory() {
  var _watch;

  var prop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'modelValue';
  var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'update:modelValue';
  return (0, _vue.defineComponent)({
    name: 'toggleable',
    props: _defineProperty({}, prop, {
      required: false
    }),
    data: function data() {
      return {
        isActive: !!this[prop]
      };
    },
    watch: (_watch = {}, _defineProperty(_watch, prop, function (val) {
      this.isActive = !!val;
    }), _defineProperty(_watch, "isActive", function isActive(val) {
      !!val !== this[prop] && this.$emit(event, val);
    }), _watch)
  });
}
/* eslint-disable-next-line @typescript-eslint/no-redeclare */


var Toggleable = factory();
var _default = Toggleable;
exports.default = _default;
//# sourceMappingURL=index.js.map