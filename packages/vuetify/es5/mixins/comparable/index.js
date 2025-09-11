"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _helpers = require("../../util/helpers");

var _default = (0, _vue.defineComponent)({
  name: 'comparable',
  props: {
    valueComparator: {
      type: Function,
      default: _helpers.deepEqual
    }
  }
});

exports.default = _default;
//# sourceMappingURL=index.js.map