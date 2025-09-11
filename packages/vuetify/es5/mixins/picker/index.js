"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _VPicker = _interopRequireDefault(require("../../components/VPicker"));

var _colorable = _interopRequireDefault(require("../colorable"));

var _elevatable = _interopRequireDefault(require("../../mixins/elevatable"));

var _themeable = _interopRequireDefault(require("../themeable"));

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _helpers = require("../../util/helpers");

var _vue = require("vue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Components
// Mixins
// Utils
// Types
var _default = (0, _mixins.default)(_colorable.default, _elevatable.default, _themeable.default
/* @vue/component */
).extend({
  name: 'picker',
  props: {
    flat: Boolean,
    fullWidth: Boolean,
    headerColor: String,
    landscape: Boolean,
    noTitle: Boolean,
    width: {
      type: [Number, String],
      default: 290
    }
  },
  methods: {
    genPickerTitle: function genPickerTitle() {
      return null;
    },
    genPickerBody: function genPickerBody() {
      return null;
    },
    genPickerActionsSlot: function genPickerActionsSlot() {
      return this.$slots.default ? this.$slots.default({
        save: this.save,
        cancel: this.cancel
      }) : (0, _helpers.getSlot)(this);
    },
    genPicker: function genPicker(staticClass) {
      var _this = this;

      var children = {};

      if (!this.noTitle) {
        var title = this.genPickerTitle();
        title && (children.title = function () {
          return [title];
        });
      }

      var body = this.genPickerBody();
      body && (children.default = function () {
        return [body];
      });

      children.actions = function () {
        return [_this.genPickerActionsSlot()];
      };

      return (0, _vue.h)(_VPicker.default, {
        class: staticClass,
        color: this.headerColor || this.color,
        dark: this.dark,
        elevation: this.elevation,
        flat: this.flat,
        fullWidth: this.fullWidth,
        landscape: this.landscape,
        light: this.light,
        width: this.width,
        noTitle: this.noTitle
      }, children);
    }
  }
});

exports.default = _default;
//# sourceMappingURL=index.js.map