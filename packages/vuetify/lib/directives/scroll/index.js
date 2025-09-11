function mounted(el, binding, vnode) {
  const {
    self = false
  } = binding.modifiers || {};
  const value = binding.value;
  const options = typeof value === 'object' && value.options || {
    passive: true
  };
  const handler = typeof value === 'function' || 'handleEvent' in value ? value : value.handler;
  const target = self ? el : binding.arg ? document.querySelector(binding.arg) : window;
  if (!target) return;
  target.addEventListener('scroll', handler, options);
  el._onScroll = Object(el._onScroll); // В Vue 3 используем vnode.ctx.uid вместо vnode.context._uid

  el._onScroll[vnode.ctx.uid] = {
    handler,
    options,
    // Don't reference self
    target: self ? undefined : target
  };
}

function unmounted(el, binding, vnode) {
  var _a;

  if (!((_a = el._onScroll) === null || _a === void 0 ? void 0 : _a[vnode.ctx.uid])) return;
  const {
    handler,
    options,
    target = el
  } = el._onScroll[vnode.ctx.uid];
  target.removeEventListener('scroll', handler, options);
  delete el._onScroll[vnode.ctx.uid];
}

export const Scroll = {
  mounted,
  unmounted
};
export default Scroll;
//# sourceMappingURL=index.js.map