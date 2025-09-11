"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _bindsAttrs = _interopRequireDefault(require("../../mixins/binds-attrs"));

var _registrable = require("../../mixins/registrable");

var _helpers = require("../../util/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* @vue/component */
var _default = (0, _mixins.default)(_bindsAttrs.default, (0, _registrable.provide)('form')
/* @vue/component */
).extend({
  name: 'v-form',
  provide: function provide() {
    return {
      form: this
    };
  },
  inheritAttrs: false,
  props: {
    disabled: Boolean,
    lazyValidation: Boolean,
    readonly: Boolean,
    value: Boolean
  },
  emits: ['input', 'update:modelValue', 'submit'],
  data: function data() {
    return {
      inputs: [],
      watchers: [],
      errorBag: {}
    };
  },
  watch: {
    errorBag: {
      handler: function handler(val) {
        var errors = Object.values(val).includes(true);
        this.$emit('input', !errors);
        this.$emit('update:modelValue', !errors);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getInputUid: function getInputUid(input) {
      return input.$.uid;
    },
    watchInput: function watchInput(input) {
      var _this = this;

      var inputId = this.getInputUid(input);

      var createErrorWatcher = function createErrorWatcher(inputComponent) {
        if (typeof inputComponent.$watch === 'function') {
          return inputComponent.$watch('hasError', function (hasError) {
            _this.errorBag[inputId] = hasError;
          }, {
            immediate: true
          });
        } else {
          // Fallback для Vue 3
          return function () {};
        }
      };

      var watchers = {
        _uid: inputId,
        valid: function valid() {},
        shouldValidate: function shouldValidate() {}
      };

      if (this.lazyValidation) {
        if (typeof input.$watch === 'function') {
          watchers.shouldValidate = input.$watch('shouldValidate', function (shouldValidate) {
            if (!shouldValidate) return;
            if (_this.errorBag.hasOwnProperty(inputId)) return;
            watchers.valid = createErrorWatcher(input);
          });
        }
      } else {
        watchers.valid = createErrorWatcher(input);
      }

      return watchers;
    },

    /** @public */
    validate: function validate() {
      return this.inputs.filter(function (input) {
        return !input.validate(true);
      }).length === 0;
    },

    /** @public */
    reset: function reset() {
      this.inputs.forEach(function (input) {
        return input.reset();
      });
      this.resetErrorBag();
    },
    resetErrorBag: function resetErrorBag() {
      var _this2 = this;

      if (this.lazyValidation) {
        // Account for timeout in validatable
        setTimeout(function () {
          _this2.errorBag = {};
        }, 0);
      }
    },

    /** @public */
    resetValidation: function resetValidation() {
      this.inputs.forEach(function (input) {
        return input.resetValidation();
      });
      this.resetErrorBag();
    },
    register: function register(input) {
      this.inputs.push(input);
      this.watchers.push(this.watchInput(input));
    },
    unregister: function unregister(input) {
      var _this3 = this;

      var inputId = this.getInputUid(input);
      var foundInput = this.inputs.find(function (inputComponent) {
        return _this3.getInputUid(inputComponent) === inputId;
      });
      if (!foundInput) return;
      var inputWatcher = this.watchers.find(function (watcher) {
        return watcher._uid === inputId;
      });

      if (inputWatcher) {
        inputWatcher.valid();
        inputWatcher.shouldValidate();
      }

      this.watchers = this.watchers.filter(function (watcher) {
        return watcher._uid !== inputId;
      });
      this.inputs = this.inputs.filter(function (inputComponent) {
        return _this3.getInputUid(inputComponent) !== inputId;
      });
      delete this.errorBag[inputId];
    }
  },
  render: function render() {
    var _this4 = this;

    return (0, _vue.h)('form', _objectSpread(_objectSpread({
      class: 'v-form',
      novalidate: true
    }, this.attrs$), {}, {
      onSubmit: function onSubmit(e) {
        return _this4.$emit('submit', e);
      }
    }), (0, _helpers.getSlot)(this));
  }
});

exports.default = _default;
//# sourceMappingURL=VForm.js.map