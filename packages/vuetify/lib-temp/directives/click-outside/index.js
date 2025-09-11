import { attachedRoot } from '../../util/dom';
function defaultConditional() {
    return true;
}
function checkEvent(e, el, binding) {
    // The include element callbacks below can be expensive
    // so we should avoid calling them when we're not active.
    // Explicitly check for false to allow fallback compatibility
    // with non-toggleable components
    if (!e || checkIsActive(e, binding) === false)
        return false;
    // If we're clicking inside the shadowroot, then the app root doesn't get the same
    // level of introspection as to _what_ we're clicking. We want to check to see if
    // our target is the shadowroot parent container, and if it is, ignore.
    const root = attachedRoot(el);
    if (typeof ShadowRoot !== 'undefined' &&
        root instanceof ShadowRoot &&
        root.host === e.target)
        return false;
    // Check if additional elements were passed to be included in check
    // (click must be outside all included elements, if any)
    const elements = ((typeof binding.value === 'object' && binding.value.include) || (() => []))();
    // Add the root element for the component this directive was defined on
    elements.push(el);
    // Check if it's a click outside our elements, and then if our callback returns true.
    // Non-toggleable components should take action in their callback and return falsy.
    // Toggleable can return true if it wants to deactivate.
    // Note that, because we're in the capture phase, this callback will occur before
    // the bubbling click event on any outside elements.
    return !elements.some(el => el.contains(e.target));
}
function checkIsActive(e, binding) {
    const isActive = (typeof binding.value === 'object' && binding.value.closeConditional) || defaultConditional;
    return isActive(e);
}
function directive(e, el, binding) {
    const handler = typeof binding.value === 'function' ? binding.value : binding.value.handler;
    el._clickOutside.lastMousedownWasOutside && checkEvent(e, el, binding) && setTimeout(() => {
        checkIsActive(e, binding) && handler && handler(e);
    }, 0);
}
function handleShadow(el, callback) {
    const root = attachedRoot(el);
    callback(document);
    if (typeof ShadowRoot !== 'undefined' && root instanceof ShadowRoot) {
        callback(root);
    }
}
export const ClickOutside = {
    // [data-app] may not be found
    // if using bind, inserted makes
    // sure that the root element is
    // available, iOS does not support
    // clicks on body
    mounted(el, binding, vnode) {
        const onClick = (e) => directive(e, el, binding);
        const onMousedown = (e) => {
            el._clickOutside.lastMousedownWasOutside = checkEvent(e, el, binding);
        };
        handleShadow(el, (app) => {
            app.addEventListener('click', onClick, true);
            app.addEventListener('mousedown', onMousedown, true);
        });
        if (!el._clickOutside) {
            el._clickOutside = {
                lastMousedownWasOutside: true,
            };
        }
        el._clickOutside[vnode.ctx.uid] = {
            onClick,
            onMousedown,
        };
    },
    unmounted(el, binding, vnode) {
        if (!el._clickOutside)
            return;
        handleShadow(el, (app) => {
            var _a;
            if (!app || !((_a = el._clickOutside) === null || _a === void 0 ? void 0 : _a[vnode.ctx.uid]))
                return;
            const { onClick, onMousedown } = el._clickOutside[vnode.ctx.uid];
            app.removeEventListener('click', onClick, true);
            app.removeEventListener('mousedown', onMousedown, true);
        });
        delete el._clickOutside[vnode.ctx.uid];
    },
};
export default ClickOutside;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9jbGljay1vdXRzaWRlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQWM3QyxTQUFTLGtCQUFrQjtJQUN6QixPQUFPLElBQUksQ0FBQTtBQUNiLENBQUM7QUFFRCxTQUFTLFVBQVUsQ0FBRSxDQUFlLEVBQUUsRUFBZSxFQUFFLE9BQThCO0lBQ25GLHVEQUF1RDtJQUN2RCx5REFBeUQ7SUFDekQsNkRBQTZEO0lBQzdELGlDQUFpQztJQUNqQyxJQUFJLENBQUMsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLEtBQUssS0FBSztRQUFFLE9BQU8sS0FBSyxDQUFBO0lBRTNELGtGQUFrRjtJQUNsRixpRkFBaUY7SUFDakYsdUVBQXVFO0lBQ3ZFLE1BQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUM3QixJQUNFLE9BQU8sVUFBVSxLQUFLLFdBQVc7UUFDakMsSUFBSSxZQUFZLFVBQVU7UUFDMUIsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsTUFBTTtRQUN0QixPQUFPLEtBQUssQ0FBQTtJQUVkLG1FQUFtRTtJQUNuRSx3REFBd0Q7SUFDeEQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLE9BQU8sT0FBTyxDQUFDLEtBQUssS0FBSyxRQUFRLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtJQUMvRix1RUFBdUU7SUFDdkUsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUVqQixxRkFBcUY7SUFDckYsbUZBQW1GO0lBQ25GLHdEQUF3RDtJQUN4RCxpRkFBaUY7SUFDakYsb0RBQW9EO0lBQ3BE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LEVBQUU7O1lBQ3BDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFBLE1BQUEsRUFBRSxDQUFDLGFBQWEsMENBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFBRSxPQUFNO1lBRXRELE1BQU0sRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBRSxDQUFBO1lBRWpFLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFBO1lBQy9DLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQ3pELENBQUMsQ0FBQyxDQUFBO1FBRUYsT0FBTyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDeEMsQ0FBQztDQUNGLENBQUE7QUFFRCxlQUFlLFlBQVksQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF0dGFjaGVkUm9vdCB9IGZyb20gJy4uLy4uL3V0aWwvZG9tJ1xuaW1wb3J0IHsgVk5vZGVEaXJlY3RpdmUgfSBmcm9tICd2dWUvdHlwZXMvdm5vZGUnXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcblxuaW50ZXJmYWNlIENsaWNrT3V0c2lkZUJpbmRpbmdBcmdzIHtcbiAgaGFuZGxlcjogKGU6IEV2ZW50KSA9PiB2b2lkXG4gIGNsb3NlQ29uZGl0aW9uYWw/OiAoZTogRXZlbnQpID0+IGJvb2xlYW5cbiAgaW5jbHVkZT86ICgpID0+IEhUTUxFbGVtZW50W11cbn1cblxuaW50ZXJmYWNlIENsaWNrT3V0c2lkZURpcmVjdGl2ZSBleHRlbmRzIFZOb2RlRGlyZWN0aXZlIHtcbiAgdmFsdWU/OiAoKGU6IEV2ZW50KSA9PiB2b2lkKSB8IENsaWNrT3V0c2lkZUJpbmRpbmdBcmdzXG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRDb25kaXRpb25hbCAoKSB7XG4gIHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIGNoZWNrRXZlbnQgKGU6IFBvaW50ZXJFdmVudCwgZWw6IEhUTUxFbGVtZW50LCBiaW5kaW5nOiBDbGlja091dHNpZGVEaXJlY3RpdmUpOiBib29sZWFuIHtcbiAgLy8gVGhlIGluY2x1ZGUgZWxlbWVudCBjYWxsYmFja3MgYmVsb3cgY2FuIGJlIGV4cGVuc2l2ZVxuICAvLyBzbyB3ZSBzaG91bGQgYXZvaWQgY2FsbGluZyB0aGVtIHdoZW4gd2UncmUgbm90IGFjdGl2ZS5cbiAgLy8gRXhwbGljaXRseSBjaGVjayBmb3IgZmFsc2UgdG8gYWxsb3cgZmFsbGJhY2sgY29tcGF0aWJpbGl0eVxuICAvLyB3aXRoIG5vbi10b2dnbGVhYmxlIGNvbXBvbmVudHNcbiAgaWYgKCFlIHx8IGNoZWNrSXNBY3RpdmUoZSwgYmluZGluZykgPT09IGZhbHNlKSByZXR1cm4gZmFsc2VcblxuICAvLyBJZiB3ZSdyZSBjbGlja2luZyBpbnNpZGUgdGhlIHNoYWRvd3Jvb3QsIHRoZW4gdGhlIGFwcCByb290IGRvZXNuJ3QgZ2V0IHRoZSBzYW1lXG4gIC8vIGxldmVsIG9mIGludHJvc3BlY3Rpb24gYXMgdG8gX3doYXRfIHdlJ3JlIGNsaWNraW5nLiBXZSB3YW50IHRvIGNoZWNrIHRvIHNlZSBpZlxuICAvLyBvdXIgdGFyZ2V0IGlzIHRoZSBzaGFkb3dyb290IHBhcmVudCBjb250YWluZXIsIGFuZCBpZiBpdCBpcywgaWdub3JlLlxuICBjb25zdCByb290ID0gYXR0YWNoZWRSb290KGVsKVxuICBpZiAoXG4gICAgdHlwZW9mIFNoYWRvd1Jvb3QgIT09ICd1bmRlZmluZWQnICYmXG4gICAgcm9vdCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QgJiZcbiAgICByb290Lmhvc3QgPT09IGUudGFyZ2V0XG4gICkgcmV0dXJuIGZhbHNlXG5cbiAgLy8gQ2hlY2sgaWYgYWRkaXRpb25hbCBlbGVtZW50cyB3ZXJlIHBhc3NlZCB0byBiZSBpbmNsdWRlZCBpbiBjaGVja1xuICAvLyAoY2xpY2sgbXVzdCBiZSBvdXRzaWRlIGFsbCBpbmNsdWRlZCBlbGVtZW50cywgaWYgYW55KVxuICBjb25zdCBlbGVtZW50cyA9ICgodHlwZW9mIGJpbmRpbmcudmFsdWUgPT09ICdvYmplY3QnICYmIGJpbmRpbmcudmFsdWUuaW5jbHVkZSkgfHwgKCgpID0+IFtdKSkoKVxuICAvLyBBZGQgdGhlIHJvb3QgZWxlbWVudCBmb3IgdGhlIGNvbXBvbmVudCB0aGlzIGRpcmVjdGl2ZSB3YXMgZGVmaW5lZCBvblxuICBlbGVtZW50cy5wdXNoKGVsKVxuXG4gIC8vIENoZWNrIGlmIGl0J3MgYSBjbGljayBvdXRzaWRlIG91ciBlbGVtZW50cywgYW5kIHRoZW4gaWYgb3VyIGNhbGxiYWNrIHJldHVybnMgdHJ1ZS5cbiAgLy8gTm9uLXRvZ2dsZWFibGUgY29tcG9uZW50cyBzaG91bGQgdGFrZSBhY3Rpb24gaW4gdGhlaXIgY2FsbGJhY2sgYW5kIHJldHVybiBmYWxzeS5cbiAgLy8gVG9nZ2xlYWJsZSBjYW4gcmV0dXJuIHRydWUgaWYgaXQgd2FudHMgdG8gZGVhY3RpdmF0ZS5cbiAgLy8gTm90ZSB0aGF0LCBiZWNhdXNlIHdlJ3JlIGluIHRoZSBjYXB0dXJlIHBoYXNlLCB0aGlzIGNhbGxiYWNrIHdpbGwgb2NjdXIgYmVmb3JlXG4gIC8vIHRoZSBidWJibGluZyBjbGljayBldmVudCBvbiBhbnkgb3V0c2lkZSBlbGVtZW50cy5cbiAgcmV0dXJuICFlbGVtZW50cy5zb21lKGVsID0+IGVsLmNvbnRhaW5zKGUudGFyZ2V0IGFzIE5vZGUpKVxufVxuXG5mdW5jdGlvbiBjaGVja0lzQWN0aXZlIChlOiBQb2ludGVyRXZlbnQsIGJpbmRpbmc6IENsaWNrT3V0c2lkZURpcmVjdGl2ZSk6IGJvb2xlYW4gfCB2b2lkIHtcbiAgY29uc3QgaXNBY3RpdmUgPSAodHlwZW9mIGJpbmRpbmcudmFsdWUgPT09ICdvYmplY3QnICYmIGJpbmRpbmcudmFsdWUuY2xvc2VDb25kaXRpb25hbCkgfHwgZGVmYXVsdENvbmRpdGlvbmFsXG5cbiAgcmV0dXJuIGlzQWN0aXZlKGUpXG59XG5cbmZ1bmN0aW9uIGRpcmVjdGl2ZSAoZTogUG9pbnRlckV2ZW50LCBlbDogSFRNTEVsZW1lbnQsIGJpbmRpbmc6IENsaWNrT3V0c2lkZURpcmVjdGl2ZSkge1xuICBjb25zdCBoYW5kbGVyID0gdHlwZW9mIGJpbmRpbmcudmFsdWUgPT09ICdmdW5jdGlvbicgPyBiaW5kaW5nLnZhbHVlIDogYmluZGluZy52YWx1ZSEuaGFuZGxlclxuXG4gIGVsLl9jbGlja091dHNpZGUhLmxhc3RNb3VzZWRvd25XYXNPdXRzaWRlICYmIGNoZWNrRXZlbnQoZSwgZWwsIGJpbmRpbmcpICYmIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGNoZWNrSXNBY3RpdmUoZSwgYmluZGluZykgJiYgaGFuZGxlciAmJiBoYW5kbGVyKGUpXG4gIH0sIDApXG59XG5cbmZ1bmN0aW9uIGhhbmRsZVNoYWRvdyAoZWw6IEhUTUxFbGVtZW50LCBjYWxsYmFjazogRnVuY3Rpb24pOiB2b2lkIHtcbiAgY29uc3Qgcm9vdCA9IGF0dGFjaGVkUm9vdChlbClcblxuICBjYWxsYmFjayhkb2N1bWVudClcblxuICBpZiAodHlwZW9mIFNoYWRvd1Jvb3QgIT09ICd1bmRlZmluZWQnICYmIHJvb3QgaW5zdGFuY2VvZiBTaGFkb3dSb290KSB7XG4gICAgY2FsbGJhY2socm9vdClcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgQ2xpY2tPdXRzaWRlID0ge1xuICAvLyBbZGF0YS1hcHBdIG1heSBub3QgYmUgZm91bmRcbiAgLy8gaWYgdXNpbmcgYmluZCwgaW5zZXJ0ZWQgbWFrZXNcbiAgLy8gc3VyZSB0aGF0IHRoZSByb290IGVsZW1lbnQgaXNcbiAgLy8gYXZhaWxhYmxlLCBpT1MgZG9lcyBub3Qgc3VwcG9ydFxuICAvLyBjbGlja3Mgb24gYm9keVxuICBtb3VudGVkIChlbDogSFRNTEVsZW1lbnQsIGJpbmRpbmc6IENsaWNrT3V0c2lkZURpcmVjdGl2ZSwgdm5vZGU6IFZOb2RlKSB7XG4gICAgY29uc3Qgb25DbGljayA9IChlOiBFdmVudCkgPT4gZGlyZWN0aXZlKGUgYXMgUG9pbnRlckV2ZW50LCBlbCwgYmluZGluZylcbiAgICBjb25zdCBvbk1vdXNlZG93biA9IChlOiBFdmVudCkgPT4ge1xuICAgICAgZWwuX2NsaWNrT3V0c2lkZSEubGFzdE1vdXNlZG93bldhc091dHNpZGUgPSBjaGVja0V2ZW50KGUgYXMgUG9pbnRlckV2ZW50LCBlbCwgYmluZGluZylcbiAgICB9XG5cbiAgICBoYW5kbGVTaGFkb3coZWwsIChhcHA6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICBhcHAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrLCB0cnVlKVxuICAgICAgYXBwLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2Vkb3duLCB0cnVlKVxuICAgIH0pXG5cbiAgICBpZiAoIWVsLl9jbGlja091dHNpZGUpIHtcbiAgICAgIGVsLl9jbGlja091dHNpZGUgPSB7XG4gICAgICAgIGxhc3RNb3VzZWRvd25XYXNPdXRzaWRlOiB0cnVlLFxuICAgICAgfVxuICAgIH1cblxuICAgIGVsLl9jbGlja091dHNpZGVbdm5vZGUuY3R4LnVpZF0gPSB7XG4gICAgICBvbkNsaWNrLFxuICAgICAgb25Nb3VzZWRvd24sXG4gICAgfVxuICB9LFxuXG4gIHVubW91bnRlZCAoZWw6IEhUTUxFbGVtZW50LCBiaW5kaW5nOiBDbGlja091dHNpZGVEaXJlY3RpdmUsIHZub2RlOiBWTm9kZSkge1xuICAgIGlmICghZWwuX2NsaWNrT3V0c2lkZSkgcmV0dXJuXG5cbiAgICBoYW5kbGVTaGFkb3coZWwsIChhcHA6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICBpZiAoIWFwcCB8fCAhZWwuX2NsaWNrT3V0c2lkZT8uW3Zub2RlLmN0eC51aWRdKSByZXR1cm5cblxuICAgICAgY29uc3QgeyBvbkNsaWNrLCBvbk1vdXNlZG93biB9ID0gZWwuX2NsaWNrT3V0c2lkZVt2bm9kZS5jdHgudWlkXSFcblxuICAgICAgYXBwLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljaywgdHJ1ZSlcbiAgICAgIGFwcC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbk1vdXNlZG93biwgdHJ1ZSlcbiAgICB9KVxuXG4gICAgZGVsZXRlIGVsLl9jbGlja091dHNpZGVbdm5vZGUuY3R4LnVpZF1cbiAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2xpY2tPdXRzaWRlXG4iXX0=