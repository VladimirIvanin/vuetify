function mounted(el, binding, vnode) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const modifiers = binding.modifiers || {};
  const value = binding.value;
  const {
    handler,
    options
  } = typeof value === 'object' && value !== null && 'handler' in value ? value : {
    handler: value,
    options: {}
  };
  if (!handler) return;
  const observer = new IntersectionObserver((entries = [], observer) => {
    var _a;

    const _observe = (_a = el._observe) === null || _a === void 0 ? void 0 : _a[vnode.ctx.uid];

    if (!_observe) return; // Just in case, should never fire

    const isIntersecting = entries.some(entry => entry.isIntersecting); // If is not quiet or has already been
    // initted, invoke the user callback

    if (handler && (!modifiers.quiet || _observe.init) && (!modifiers.once || isIntersecting || _observe.init)) {
      handler(entries, observer, isIntersecting);
    }

    if (isIntersecting && modifiers.once) unmounted(el, binding, vnode);else _observe.init = true;
  }, options);
  el._observe = Object(el._observe);
  el._observe[vnode.ctx.uid] = {
    init: false,
    observer
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

  const observe = (_a = el._observe) === null || _a === void 0 ? void 0 : _a[vnode.ctx.uid];
  if (!observe) return;
  observe.observer.unobserve(el);
  delete el._observe[vnode.ctx.uid];
}

export const Intersect = {
  mounted,
  updated,
  unmounted
};
export default Intersect;
//# sourceMappingURL=index.js.map