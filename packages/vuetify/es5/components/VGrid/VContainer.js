"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../../../src/components/VGrid/_grid.sass");

require("../../../src/components/VGrid/VGrid.sass");

var _grid2 = _interopRequireDefault(require("./grid"));

var _mergeData = _interopRequireDefault(require("../../util/mergeData"));

var _vue = require("vue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* @vue/component */
var _default = (0, _vue.defineComponent)({
  name: 'v-container',
  extends: (0, _grid2.default)('container'),
  functional: true,
  props: {
    id: String,
    tag: {
      type: String,
      default: 'div'
    },
    fluid: {
      type: Boolean,
      default: false
    }
  },
  render: function render() {
    var _a, _b;

    var classes; // const { attrs } = data

    var attrs = this.$attrs;

    if (attrs) {
      // reset attrs to extract utility clases like pa-3
      classes = Object.keys(attrs).filter(function (key) {
        // TODO: Remove once resolved
        // https://github.com/vuejs/vue/issues/7841
        if (key === 'slot') return false;
        var value = attrs[key]; // add back data attributes like data-test="foo" but do not
        // add them as classes

        if (key.startsWith('data-')) {
          // data.attrs![key] = value
          return false;
        }

        return value || typeof value === 'string';
      });
    } // if (props.id) {
    //   data.domProps = data.domProps || {}
    //   data.domProps.id = props.id
    // }


    return (0, _vue.h)(this.tag, (0, _mergeData.default)(this.$attrs, {
      class: Array({
        'container--fluid': this.fluid
      }).concat(classes || []).concat('container')
    }), (_b = (_a = this.$slots).default) === null || _b === void 0 ? void 0 : _b.call(_a));
  }
});

exports.default = _default;
//# sourceMappingURL=VContainer.js.map