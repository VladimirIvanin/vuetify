"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _VItemGroup = require("../../components/VItemGroup/VItemGroup");

// Extensions

/* @vue/component */
var _default = (0, _vue.defineComponent)({
  name: 'button-group',
  extends: _VItemGroup.BaseItemGroup,
  provide: function provide() {
    return {
      btnToggle: this
    };
  },
  computed: {
    classes: function classes() {
      return _VItemGroup.BaseItemGroup.computed.classes.call(this);
    }
  },
  methods: {
    // Isn't being passed down through types
    genData: _VItemGroup.BaseItemGroup.methods.genData
  }
});

exports.default = _default;
//# sourceMappingURL=index.js.map