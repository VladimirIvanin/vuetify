function mounted(el, binding, vnode) {
  const callback = binding.value;
  const options = binding.options || {
    passive: true
  };
  window.addEventListener('resize', callback, options);
  el._onResize = Object(el._onResize);
  el._onResize[vnode.ctx.uid] = {
    callback,
    options
  };

  if (!binding.modifiers || !binding.modifiers.quiet) {
    callback();
  }
}

function unmounted(el, binding, vnode) {
  var _a;

  if (!((_a = el._onResize) === null || _a === void 0 ? void 0 : _a[vnode.ctx.uid])) return;
  const {
    callback,
    options
  } = el._onResize[vnode.ctx.uid];
  window.removeEventListener('resize', callback, options);
  delete el._onResize[vnode.ctx.uid];
}

export const Resize = {
  mounted,
  unmounted
};
export default Resize;
//# sourceMappingURL=index.js.map