"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _default = (0, _vue.defineComponent)({
  name: 'localable',
  props: {
    locale: String
  },
  computed: {
    currentLocale: function currentLocale() {
      return this.locale || this.$vuetify.lang.current;
    }
  }
});

exports.default = _default;
//# sourceMappingURL=index.js.map