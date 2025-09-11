"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.factory = factory;
exports.default = void 0;

var _vue = require("vue");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function factory() {
  var prop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'modelValue';
  var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'update:modelValue';
  return (0, _vue.defineComponent)({
    name: 'proxyable',
    props: _defineProperty({}, prop, {
      required: false
    }),
    data: function data() {
      return {
        internalLazyValue: this[prop]
      };
    },
    computed: {
      internalValue: {
        get: function get() {
          return this.internalLazyValue;
        },
        set: function set(val) {
          if (val === this.internalLazyValue) return;
          this.internalLazyValue = val;
          this.$emit(event, val);
        }
      }
    },
    watch: _defineProperty({}, prop, function (val) {
      this.internalLazyValue = val;
    })
  });
}
/* eslint-disable-next-line @typescript-eslint/no-redeclare */


var Proxyable = factory();
var _default = Proxyable;
exports.default = _default;
//# sourceMappingURL=index.js.map