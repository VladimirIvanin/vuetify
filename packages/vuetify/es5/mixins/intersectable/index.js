"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = intersectable;

var _intersect = _interopRequireDefault(require("../../directives/intersect"));

var _console = require("../../util/console");

var _vue = require("vue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Directives
// Utilities
// Types
function intersectable(options) {
  return (0, _vue.defineComponent)({
    name: 'intersectable',
    data: function data() {
      return {
        isIntersecting: false
      };
    },
    mounted: function mounted() {
      var _getCurrentInstance = (0, _vue.getCurrentInstance)(),
          vnode = _getCurrentInstance.vnode;

      _intersect.default.mounted(this.$el, {
        name: 'intersect',
        value: this.onObserve
      }, vnode);
    },
    unmounted: function unmounted() {
      var _getCurrentInstance2 = (0, _vue.getCurrentInstance)(),
          vnode = _getCurrentInstance2.vnode;

      _intersect.default.unmounted(this.$el, {
        name: 'intersect',
        value: this.onObserve
      }, vnode);
    },
    methods: {
      onObserve: function onObserve(entries, observer, isIntersecting) {
        this.isIntersecting = isIntersecting;
        if (!isIntersecting) return;

        for (var i = 0, length = options.onVisible.length; i < length; i++) {
          var callback = this[options.onVisible[i]];

          if (typeof callback === 'function') {
            callback();
            continue;
          }

          (0, _console.consoleWarn)(options.onVisible[i] + ' method is not available on the instance but referenced in intersectable mixin options');
        }
      }
    }
  });
}
//# sourceMappingURL=index.js.map