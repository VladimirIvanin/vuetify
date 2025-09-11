"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = VGrid;

var _vue = require("vue");

// Types
function VGrid(name) {
  /* @vue/component */
  return (0, _vue.defineComponent)({
    name: "v-".concat(name),
    functional: true,
    props: {
      id: String,
      tag: {
        type: String,
        default: 'div'
      }
    },
    render: function render() {
      var data = this.$attrs;
      var children = this.$slots.default();
      var props = this.$props;
      data.staticClass = "".concat(name, " ").concat(data.staticClass || '').trim();
      var attrs = data.attrs;

      if (attrs) {
        // reset attrs to extract utility clases like pa-3
        data.attrs = {};
        var classes = Object.keys(attrs).filter(function (key) {
          // TODO: Remove once resolved
          // https://github.com/vuejs/vue/issues/7841
          if (key === 'slot') return false;
          var value = attrs[key]; // add back data attributes like data-test="foo" but do not
          // add them as classes

          if (key.startsWith('data-')) {
            data.attrs[key] = value;
            return false;
          }

          return value || typeof value === 'string';
        });
        if (classes.length) data.staticClass += " ".concat(classes.join(' '));
      }

      if (props.id) {
        data.domProps = data.domProps || {};
        data.domProps.id = props.id;
      }

      return (0, _vue.h)(props.tag, data, children);
    }
  });
}
//# sourceMappingURL=grid.js.map