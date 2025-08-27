import { DirectiveBinding, ObjectDirective, VNode } from 'vue'

interface ResizeDirectiveBinding extends DirectiveBinding {
  value: () => void
  options?: boolean | AddEventListenerOptions
}

declare global {
  interface HTMLElement {
    _onResize?: Record<
      number,
      {
        callback: () => void
        options: boolean | AddEventListenerOptions
      }
    >
  }
}

function mounted (
  el: HTMLElement,
  binding: ResizeDirectiveBinding,
  vnode: VNode
) {
  if (!vnode.ctx?.uid) {
    return
  }

  const callback = binding.value
  const options = binding.options || { passive: true }
  const uid = vnode.ctx.uid

  window.addEventListener('resize', callback, options)

  el._onResize = Object(el._onResize)
  el._onResize![uid] = {
    callback,
    options,
  }

  if (!binding.modifiers || !binding.modifiers.quiet) {
    callback()
  }
}

function unmounted (
  el: HTMLElement,
  binding: ResizeDirectiveBinding,
  vnode: VNode
) {
  if (!vnode.ctx?.uid) {
    return
  }

  const uid = vnode.ctx.uid

  if (!el._onResize?.[uid]) return

  const { callback, options } = el._onResize[uid]!

  window.removeEventListener('resize', callback, options)

  delete el._onResize[uid]
}

export const Resize: ObjectDirective = {
  mounted,
  unmounted,
}

export default Resize
