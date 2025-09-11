"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _VWindowItem = _interopRequireDefault(require("../VWindow/VWindowItem"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Extensions

/* @vue/component */
var _default = (0, _vue.defineComponent)({
  name: 'v-tab-item',
  extends: _VWindowItem.default,
  props: {
    id: String
  },
  methods: {
    genWindowItem: function genWindowItem() {
      var item = _VWindowItem.default.methods.genWindowItem.call(this);

      item.id = this.id || this.value;
      return item;
    }
  }
});

exports.default = _default;
//# sourceMappingURL=VTabItem.js.map