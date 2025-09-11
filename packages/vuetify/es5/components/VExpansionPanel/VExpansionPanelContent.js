"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _transitions = require("../transitions");

var _bootable = _interopRequireDefault(require("../../mixins/bootable"));

var _colorable = _interopRequireDefault(require("../../mixins/colorable"));

var _registrable = require("../../mixins/registrable");

var _helpers = require("../../util/helpers");

var _mixins = _interopRequireDefault(require("../../util/mixins"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Mixins
// Utilities
var baseMixins = (0, _mixins.default)(_bootable.default, _colorable.default, (0, _registrable.inject)('expansionPanel', 'v-expansion-panel-content', 'v-expansion-panel'));
/* @vue/component */

var _default = baseMixins.extend({
  name: 'v-expansion-panel-content',
  data: function data() {
    return {
      isActive: false
    };
  },
  computed: {
    parentIsActive: function parentIsActive() {
      return this.expansionPanel.isActive;
    }
  },
  watch: {
    parentIsActive: {
      immediate: true,
      handler: function handler(val, oldVal) {
        var _this = this;

        if (val) this.isBooted = true;
        if (oldVal == null) this.isActive = val;else this.$nextTick(function () {
          return _this.isActive = val;
        });
      }
    }
  },
  created: function created() {
    this.expansionPanel.registerContent(this);
  },
  beforeUnmount: function beforeUnmount() {
    this.expansionPanel.unregisterContent();
  },
  render: function render() {
    var _this2 = this;

    return (0, _vue.h)(_transitions.VExpandTransition, {}, function () {
      return _this2.showLazyContent(function () {
        return [(0, _vue.withDirectives)((0, _vue.h)('div', _this2.setBackgroundColor(_this2.color, {
          class: 'v-expansion-panel-content'
        }), [(0, _vue.h)('div', {
          class: 'v-expansion-panel-content__wrap'
        }, (0, _helpers.getSlot)(_this2, 'default', {
          open: _this2.isActive
        }))]), [[_vue.vShow, _this2.isActive]])];
      });
    });
  }
});

exports.default = _default;
//# sourceMappingURL=VExpansionPanelContent.js.map