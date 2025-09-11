"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bootable = _interopRequireDefault(require("../bootable"));

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _console = require("../../util/console");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function validateAttachTarget(val) {
  var type = _typeof(val);

  if (type === 'boolean' || type === 'string') return true;
  return val.nodeType === Node.ELEMENT_NODE;
}

function removeActivator(activator) {
  activator.forEach(function (node) {
    node.el && node.el.parentNode && node.el.parentNode.removeChild(node.el);
  });
}
/* @vue/component */


var _default = (0, _mixins.default)(_bootable.default).extend({
  name: 'detachable',
  props: {
    attach: {
      default: false,
      validator: validateAttachTarget
    },
    contentClass: {
      type: String,
      default: ''
    }
  },
  data: function data() {
    return {
      activatorNode: null,
      hasDetached: false
    };
  },
  watch: {
    attach: function attach() {
      this.hasDetached = false;
      this.initDetach();
    },
    hasContent: function hasContent() {
      this.$nextTick(this.initDetach);
    }
  },
  beforeMount: function beforeMount() {
    var _this = this;

    this.$nextTick(function () {
      if (_this.activatorNode) {
        var activator = Array.isArray(_this.activatorNode) ? _this.activatorNode : [_this.activatorNode];
        activator.forEach(function (node) {
          if (!node.el) return;
          if (!_this.$el.parentNode) return;
          var target = _this.$el === _this.$el.parentNode.firstChild ? _this.$el : _this.$el.nextSibling;

          _this.$el.parentNode.insertBefore(node.el, target);
        });
      }
    });
  },
  mounted: function mounted() {
    this.hasContent && this.initDetach();
  },
  deactivated: function deactivated() {
    this.isActive = false;
  },
  beforeUnmount: function beforeUnmount() {
    if (this.$refs.content && this.$refs.content.parentNode) {
      this.$refs.content.parentNode.removeChild(this.$refs.content);
    }
  },
  unmounted: function unmounted() {
    var _this2 = this;

    if (this.activatorNode) {
      var activator = Array.isArray(this.activatorNode) ? this.activatorNode : [this.activatorNode];

      if (this.$el.isConnected) {
        // Component has been destroyed but the element still exists, we must be in a transition
        // Wait for the transition to finish before cleaning up the detached activator
        var observer = new MutationObserver(function (list) {
          if (list.some(function (record) {
            return Array.from(record.removedNodes).includes(_this2.$el);
          })) {
            observer.disconnect();
            removeActivator(activator);
          }
        });
        observer.observe(this.$el.parentNode, {
          subtree: false,
          childList: true
        });
      } else {
        removeActivator(activator);
      }
    }
  },
  methods: {
    getScopeIdAttrs: function getScopeIdAttrs() {
      if (!this.$attrs) return {};
      var scopeIdAttrs = {}; // Ищем все data-v- атрибуты в $attrs

      Object.keys(this.$attrs).forEach(function (key) {
        if (key.startsWith('data-v-')) {
          scopeIdAttrs[key] = '';
        }
      });
      return scopeIdAttrs;
    },
    initDetach: function initDetach() {
      if (this._isDestroyed || !this.$refs.content || this.hasDetached || // Leave menu in place if attached
      // and dev has not changed target
      this.attach === '' || // If used as a boolean prop (<v-menu attach>)
      this.attach === true || // If bound to a boolean (<v-menu :attach="true">)
      this.attach === 'attach' // If bound as boolean prop in pug (v-menu(attach))
      ) return;
      var target;

      if (this.attach === false) {
        // Default, detach to app
        target = document.querySelector('[data-app]');
      } else if (typeof this.attach === 'string') {
        // CSS selector
        target = document.querySelector(this.attach);
      } else {
        // DOM Element
        target = this.attach;
      }

      if (!target) {
        (0, _console.consoleWarn)("Unable to locate target ".concat(this.attach || '[data-app]'), this);
        return;
      }

      target.appendChild(this.$refs.content);
      this.hasDetached = true;
    }
  }
});

exports.default = _default;
//# sourceMappingURL=index.js.map