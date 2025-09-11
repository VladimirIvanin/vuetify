"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.factory = factory;
exports.default = void 0;

var _registrable = require("../registrable");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function factory(namespace, child, parent) {
  return {
    name: 'groupable',
    extends: (0, _registrable.inject)(namespace, child, parent),
    props: {
      activeClass: {
        type: String
      },
      disabled: Boolean
    },
    data: function data() {
      return {
        isActive: false
      };
    },
    computed: {
      $activeClass: function $activeClass() {
        if (this.activeClass) return this.activeClass;
        if (!this[namespace]) return undefined;
        return this[namespace].activeClass;
      },
      groupClasses: function groupClasses() {
        if (!this.$activeClass) return {};
        return _defineProperty({}, this.$activeClass, this.isActive);
      }
    },
    created: function created() {
      this[namespace] && this[namespace].register(this);
    },
    beforeUnmount: function beforeUnmount() {
      this[namespace] && this[namespace].unregister(this);
    },
    methods: {
      toggle: function toggle(e) {
        if (this.disabled && e) {
          // Prevent keyboard actions
          // from children elements
          // within disabled tabs
          e.preventDefault();
          return;
        }

        this.$emit('change');
        this.$emitLegacy('change');
      }
    }
  };
}
/* eslint-disable-next-line @typescript-eslint/no-redeclare */


var Groupable = factory('itemGroup');
var _default = Groupable;
exports.default = _default;
//# sourceMappingURL=index.js.map