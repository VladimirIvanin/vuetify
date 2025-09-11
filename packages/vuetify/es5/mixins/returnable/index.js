"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

/* @vue/component */
var _default = (0, _vue.defineComponent)({
  name: 'returnable',
  props: {
    returnValue: null
  },
  data: function data() {
    return {
      isActive: false,
      originalValue: null
    };
  },
  watch: {
    isActive: function isActive(val) {
      if (val) {
        this.originalValue = this.returnValue;
      } else {
        this.$emit('update:return-value', this.originalValue);
      }
    }
  },
  methods: {
    save: function save(value) {
      var _this = this;

      this.originalValue = value;
      setTimeout(function () {
        _this.isActive = false;
      });
    }
  }
});

exports.default = _default;
//# sourceMappingURL=index.js.map