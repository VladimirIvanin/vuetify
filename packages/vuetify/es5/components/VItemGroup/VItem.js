"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BaseItem = void 0;

require("../../../src/components/VItemGroup/VItem.sass");

var _groupable = require("../../mixins/groupable");

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _console = require("../../util/console");

var _vue = require("vue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* @vue/component */
var BaseItem = (0, _vue.defineComponent)({
  props: {
    activeClass: String,
    value: {
      required: false
    },
    disabled: Boolean
  },
  data: function data() {
    return {
      isActive: false
    };
  },
  methods: {
    toggle: function toggle() {
      this.isActive = !this.isActive;
    }
  },
  render: function render() {
    var _class;

    if (!this.$slots.default) {
      (0, _console.consoleWarn)('v-item is missing a default scopedSlot', this);
      return null;
    }

    var slotContent = this.$slots.default({
      active: this.isActive,
      toggle: this.toggle
    });

    if (!slotContent || slotContent.length === 0) {
      (0, _console.consoleWarn)('v-item slot returned empty content', this);
      return null;
    }

    var element = slotContent[0];

    if (!element) {
      (0, _console.consoleWarn)('v-item should contain at least one element', this);
      return null;
    }

    if (!element.type) {
      (0, _console.consoleWarn)('v-item should only contain valid VNode elements', this);
      return element;
    }

    element.props = (0, _vue.mergeProps)(element.props || {}, {
      class: (_class = {}, _defineProperty(_class, this.activeClass, this.isActive), _defineProperty(_class, "v-item--disabled", this.disabled), _class)
    });

    if (this.disabled) {
      element.props = (0, _vue.mergeProps)(element.props || {}, {
        tabindex: -1
      });
    }

    return element;
  }
});
exports.BaseItem = BaseItem;

var _default = (0, _mixins.default)(BaseItem, (0, _groupable.factory)('itemGroup', 'v-item', 'v-item-group')).extend({
  name: 'v-item',
  emits: ['change']
});

exports.default = _default;
//# sourceMappingURL=VItem.js.map