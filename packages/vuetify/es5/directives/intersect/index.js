"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Intersect = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function mounted(el, binding, vnode) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  var modifiers = binding.modifiers || {};
  var value = binding.value;

  var _ref = _typeof(value) === 'object' && value !== null && 'handler' in value ? value : {
    handler: value,
    options: {}
  },
      handler = _ref.handler,
      options = _ref.options;

  if (!handler) return;
  var observer = new IntersectionObserver(function () {
    var entries = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var observer = arguments.length > 1 ? arguments[1] : undefined;

    var _a;

    var _observe = (_a = el._observe) === null || _a === void 0 ? void 0 : _a[vnode.ctx.uid];

    if (!_observe) return; // Just in case, should never fire

    var isIntersecting = entries.some(function (entry) {
      return entry.isIntersecting;
    }); // If is not quiet or has already been
    // initted, invoke the user callback

    if (handler && (!modifiers.quiet || _observe.init) && (!modifiers.once || isIntersecting || _observe.init)) {
      handler(entries, observer, isIntersecting);
    }

    if (isIntersecting && modifiers.once) unmounted(el, binding, vnode);else _observe.init = true;
  }, options);
  el._observe = Object(el._observe);
  el._observe[vnode.ctx.uid] = {
    init: false,
    observer: observer
  };
  observer.observe(el);
}

function updated(el, binding, vnode) {
  // Если значение изменилось, пересоздаем observer
  if (binding.value !== binding.oldValue) {
    unmounted(el, binding, vnode);
    mounted(el, binding, vnode);
  }
}

function unmounted(el, binding, vnode) {
  var _a;

  var observe = (_a = el._observe) === null || _a === void 0 ? void 0 : _a[vnode.ctx.uid];
  if (!observe) return;
  observe.observer.unobserve(el);
  delete el._observe[vnode.ctx.uid];
}

var Intersect = {
  mounted: mounted,
  updated: updated,
  unmounted: unmounted
};
exports.Intersect = Intersect;
var _default = Intersect;
exports.default = _default;
//# sourceMappingURL=index.js.map