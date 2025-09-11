"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

require("../../../src/components/VResponsive/VResponsive.sass");

var _measurable = _interopRequireDefault(require("../../mixins/measurable"));

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _helpers = require("../../util/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Mixins
// Utils

/* @vue/component */
var _default = (0, _mixins.default)(_measurable.default).extend({
  name: 'v-responsive',
  props: {
    aspectRatio: [String, Number],
    contentClass: String
  },
  computed: {
    computedAspectRatio: function computedAspectRatio() {
      return Number(this.aspectRatio);
    },
    aspectStyle: function aspectStyle() {
      return this.computedAspectRatio ? {
        paddingBottom: 1 / this.computedAspectRatio * 100 + '%'
      } : undefined;
    },
    __cachedSizer: function __cachedSizer() {
      if (!this.aspectStyle) return [];
      return (0, _vue.h)('div', {
        style: this.aspectStyle,
        class: 'v-responsive__sizer'
      });
    }
  },
  methods: {
    genContent: function genContent() {
      return (0, _vue.h)('div', {
        class: ['v-responsive__content', this.contentClass]
      }, (0, _helpers.getSlot)(this));
    }
  },
  render: function render() {
    return (0, _vue.h)('div', (0, _vue.mergeProps)({
      class: 'v-responsive',
      style: this.measurableStyles
    }, this.$attrs), [this.__cachedSizer, this.genContent()]);
  }
});

exports.default = _default;
//# sourceMappingURL=VResponsive.js.map