"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

require("../../../src/components/VDataTable/VEditDialog.sass");

var _returnable = _interopRequireDefault(require("../../mixins/returnable"));

var _themeable = _interopRequireDefault(require("../../mixins/themeable"));

var _helpers = require("../../util/helpers");

var _VBtn = _interopRequireDefault(require("../VBtn"));

var _VMenu = _interopRequireDefault(require("../VMenu"));

var _mixins = _interopRequireDefault(require("../../util/mixins"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* @vue/component */
var _default2 = (0, _mixins.default)(_returnable.default, _themeable.default).extend({
  name: 'v-edit-dialog',
  props: {
    cancelText: {
      default: 'Cancel'
    },
    large: Boolean,
    eager: Boolean,
    persistent: Boolean,
    saveText: {
      default: 'Save'
    },
    transition: {
      type: String,
      default: 'slide-x-reverse-transition'
    }
  },
  emits: ['update:return-value', 'open', 'close', 'cancel', 'save'],
  data: function data() {
    return {// isActive is provided by Returnable mixin
    };
  },
  watch: {
    isActive: function isActive(val) {
      if (val) {
        this.$emit('open');
        setTimeout(this.focus, 50); // Give DOM time to paint
      } else {
        this.$emit('close');
      }
    }
  },
  methods: {
    cancel: function cancel() {
      this.isActive = false;
      this.$emit('cancel');
    },
    focus: function focus() {
      var input = this.$refs.content.querySelector('input');
      input && input.focus();
    },
    genButton: function genButton(fn, text) {
      return (0, _vue.h)(_VBtn.default, {
        text: true,
        color: 'primary',
        light: true,
        onClick: fn
      }, function () {
        return text;
      });
    },
    genActions: function genActions() {
      var _this = this;

      return (0, _vue.h)('div', {
        class: 'v-small-dialog__actions'
      }, [this.genButton(this.cancel, this.cancelText), this.genButton(function () {
        _this.save(_this.returnValue);

        _this.$emit('save');
      }, this.saveText)]);
    },
    genContent: function genContent() {
      var _this2 = this;

      return (0, _vue.h)('div', {
        class: 'v-small-dialog__content',
        onKeydown: function onKeydown(e) {
          e.keyCode === _helpers.keyCodes.esc && _this2.cancel();

          if (e.keyCode === _helpers.keyCodes.enter) {
            _this2.save(_this2.returnValue);

            _this2.$emit('save');
          }
        },
        ref: 'content'
      }, (0, _helpers.getSlot)(this, 'input'));
    }
  },
  render: function render() {
    var _this3 = this;

    return (0, _vue.h)(_VMenu.default, {
      class: ['v-small-dialog', this.themeClasses],
      contentClass: 'v-small-dialog__menu-content',
      transition: this.transition,
      origin: 'top right',
      right: true,
      modelValue: this.isActive,
      closeOnClick: !this.persistent,
      closeOnContentClick: false,
      eager: this.eager,
      light: this.light,
      dark: this.dark,
      'onUpdate:modelValue': function onUpdateModelValue(val) {
        return _this3.isActive = val;
      }
    }, {
      activator: function activator(_ref) {
        var on = _ref.on;
        return (0, _vue.h)('div', _objectSpread({
          class: 'v-small-dialog__activator'
        }, on), [(0, _vue.h)('span', {
          class: 'v-small-dialog__activator__content'
        }, (0, _helpers.getSlot)(_this3))]);
      },
      default: function _default() {
        return [_this3.genContent(), _this3.large ? _this3.genActions() : null];
      }
    });
  }
});

exports.default = _default2;
//# sourceMappingURL=VEditDialog.js.map