import { defineComponent } from 'vue';
import { upperFirst } from '../../util/helpers';
function mapEventName(str) {
    return `on${upperFirst(str)}`;
}
export default defineComponent({
    name: 'mouse',
    methods: {
        getDefaultMouseEventHandlers(suffix, getData, eventFirst = false) {
            const listeners = Object.keys(this.$attrs)
                .filter(key => key.endsWith(suffix))
                .reduce((acc, key) => {
                const eventName = suffix ? key.slice(0, -suffix.length) : key;
                const cleanEventName = eventName.startsWith('on') ? eventName.slice(2).toLowerCase() : eventName.toLowerCase();
                acc[cleanEventName] = { event: cleanEventName, originalKey: key };
                return acc;
            }, {});
            return this.getMouseEventHandlers({
                ...listeners,
                ['contextmenu' + suffix]: { event: 'contextmenu', prevent: true, result: false },
            }, getData, eventFirst);
        },
        getMouseEventHandlers(events, getData, eventFirst = false) {
            const on = {};
            for (const event in events) {
                const eventOptions = events[event];
                const attrName = eventOptions.originalKey || (event.includes(':') ? event : mapEventName(event));
                if (!this.$attrs[attrName])
                    continue;
                // TODO somehow pull in modifiers
                const prefix = eventOptions.passive ? '&' : ((eventOptions.once ? '~' : '') + (eventOptions.capture ? '!' : ''));
                const key = prefix + eventOptions.event;
                const handler = e => {
                    var _a, _b;
                    const mouseEvent = e;
                    if (eventOptions.button === undefined || (mouseEvent.buttons > 0 && mouseEvent.button === eventOptions.button)) {
                        if (eventOptions.prevent) {
                            e.preventDefault();
                        }
                        if (eventOptions.stop) {
                            e.stopPropagation();
                        }
                        // Due to TouchEvent target always returns the element that is first placed
                        // Even if touch point has since moved outside the interactive area of that element
                        // Ref: https://developer.mozilla.org/en-US/docs/Web/API/Touch/target
                        // This block of code aims to make sure touchEvent is always dispatched from the element that is being pointed at
                        if (e && 'touches' in e) {
                            const classSeparator = ' ';
                            const eventTargetClasses = (_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.className.split(classSeparator);
                            const currentTargets = document.elementsFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                            // Get "the same kind" current hovering target by checking
                            // If element has the same class of initial touch start element (which has touch event listener registered)
                            const currentTarget = currentTargets.find(t => t.className.split(classSeparator).some(c => eventTargetClasses.includes(c)));
                            if (currentTarget &&
                                !((_b = e.target) === null || _b === void 0 ? void 0 : _b.isSameNode(currentTarget))) {
                                currentTarget.dispatchEvent(new TouchEvent(e.type, {
                                    changedTouches: e.changedTouches,
                                    targetTouches: e.targetTouches,
                                    touches: e.touches,
                                }));
                                return;
                            }
                        }
                        // TODO: VCalendar emits the calendar event as the first argument,
                        // but it really should be the native event instead so modifiers can be used
                        if (eventFirst) {
                            this.$emit(event, e, getData(e));
                        }
                        else {
                            this.$emit(event, getData(e), e);
                        }
                    }
                    return eventOptions.result;
                };
                if (key in on) {
                    /* istanbul ignore next */
                    if (Array.isArray(on[key])) {
                        on[key].push(handler);
                    }
                    else {
                        on[key] = [on[key], handler];
                    }
                }
                else {
                    on[key] = handler;
                }
            }
            return on;
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL21vdXNlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxLQUFLLENBQUE7QUFDckMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBc0IvQyxTQUFTLFlBQVksQ0FBRSxHQUFXO0lBQ2hDLE9BQU8sS0FBSyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQTtBQUMvQixDQUFDO0FBRUQsZUFBZSxlQUFlLENBQUM7SUFDN0IsSUFBSSxFQUFFLE9BQU87SUFFYixPQUFPLEVBQUU7UUFDUCw0QkFBNEIsQ0FBRSxNQUFjLEVBQUUsT0FBcUIsRUFBRSxVQUFVLEdBQUcsS0FBSztZQUNyRixNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7aUJBQ3ZDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ25DLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtnQkFDbkIsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFBO2dCQUM3RCxNQUFNLGNBQWMsR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUE7Z0JBQzlHLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxjQUFj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QUFHLENBQUMsR0FBRyxPQUFPLENBQUE7aUJBQ2xCO2FBQ0Y7WUFFRCxPQUFPLEVBQUUsQ0FBQTtRQUNYLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRlZmluZUNvbXBvbmVudCB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7IHVwcGVyRmlyc3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbmV4cG9ydCB0eXBlIE1vdXNlSGFuZGxlciA9IChlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkgPT4gYW55XG5cbmV4cG9ydCB0eXBlIE1vdXNlRXZlbnRzID0ge1xuICBbZXZlbnQ6IHN0cmluZ106IHtcbiAgICBldmVudDogc3RyaW5nXG4gICAgcGFzc2l2ZT86IGJvb2xlYW5cbiAgICBjYXB0dXJlPzogYm9vbGVhblxuICAgIG9uY2U/OiBib29sZWFuXG4gICAgc3RvcD86IGJvb2xlYW5cbiAgICBwcmV2ZW50PzogYm9vbGVhblxuICAgIGJ1dHRvbj86IG51bWJlclxuICAgIHJlc3VsdD86IGFueVxuICAgIG9yaWdpbmFsS2V5Pzogc3RyaW5nXG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgTW91c2VFdmVudHNNYXAgPSB7XG4gIFtldmVudDogc3RyaW5nXTogTW91c2VIYW5kbGVyIHwgTW91c2VIYW5kbGVyW11cbn1cblxuZnVuY3Rpb24gbWFwRXZlbnROYW1lIChzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBgb24ke3VwcGVyRmlyc3Qoc3RyKX1gXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XG4gIG5hbWU6ICdtb3VzZScsXG5cbiAgbWV0aG9kczoge1xuICAgIGdldERlZmF1bHRNb3VzZUV2ZW50SGFuZGxlcnMgKHN1ZmZpeDogc3RyaW5nLCBnZXREYXRhOiBNb3VzZUhhbmRsZXIsIGV2ZW50Rmlyc3QgPSBmYWxzZSk6IE1vdXNlRXZlbnRzTWFwIHtcbiAgICAgIGNvbnN0IGxpc3RlbmVycyA9IE9iamVjdC5rZXlzKHRoaXMuJGF0dHJzKVxuICAgICAgICAuZmlsdGVyKGtleSA9PiBrZXkuZW5kc1dpdGgoc3VmZml4KSlcbiAgICAgICAgLnJlZHVjZSgoYWNjLCBrZXkpID0+IHtcbiAgICAgICAgICBjb25zdCBldmVudE5hbWUgPSBzdWZmaXggPyBrZXkuc2xpY2UoMCwgLXN1ZmZpeC5sZW5ndGgpIDoga2V5XG4gICAgICAgICAgY29uc3QgY2xlYW5FdmVudE5hbWUgPSBldmVudE5hbWUuc3RhcnRzV2l0aCgnb24nKSA/IGV2ZW50TmFtZS5zbGljZSgyKS50b0xvd2VyQ2FzZSgpIDogZXZlbnROYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICBhY2NbY2xlYW5FdmVudE5hbWVdID0geyBldmVudDogY2xlYW5FdmVudE5hbWUsIG9yaWdpbmFsS2V5OiBrZXkgfVxuICAgICAgICAgIHJldHVybiBhY2NcbiAgICAgICAgfSwge30gYXMgTW91c2VFdmVudHMpXG5cbiAgICAgIHJldHVybiB0aGlzLmdldE1vdXNlRXZlbnRIYW5kbGVycyh7XG4gICAgICAgIC4uLmxpc3RlbmVycyxcbiAgICAgICAgWydjb250ZXh0bWVudScgKyBzdWZmaXhdOiB7IGV2ZW50OiAnY29udGV4dG1lbnUnLCBwcmV2ZW50OiB0cnVlLCByZXN1bHQ6IGZhbHNlIH0sXG4gICAgICB9LCBnZXREYXRhLCBldmVudEZpcnN0KVxuICAgIH0sXG4gICAgZ2V0TW91c2VFdmVudEhhbmRsZXJzIChldmVudHM6IE1vdXNlRXZlbnRzLCBnZXREYXRhOiBNb3VzZUhhbmRsZXIsIGV2ZW50Rmlyc3QgPSBmYWxzZSk6IE1vdXNlRXZlbnRzTWFwIHtcbiAgICAgIGNvbnN0IG9uOiBNb3VzZUV2ZW50c01hcCA9IHt9XG5cbiAgICAgIGZvciAoY29uc3QgZXZlbnQgaW4gZXZlbnRzKSB7XG4gICAgICAgIGNvbnN0IGV2ZW50T3B0aW9ucyA9IGV2ZW50c1tldmVudF1cblxuICAgICAgICBjb25zdCBhdHRyTmFtZSA9IGV2ZW50T3B0aW9ucy5vcmlnaW5hbEtleSB8fCAoZXZlbnQuaW5jbHVkZXMoJzonKSA/IGV2ZW50IDogbWFwRXZlbnROYW1lKGV2ZW50KSlcbiAgICAgICAgaWYgKCF0aGlzLiRhdHRyc1thdHRyTmFtZV0pIGNvbnRpbnVlXG5cbiAgICAgICAgLy8gVE9ETyBzb21laG93IHB1bGwgaW4gbW9kaWZpZXJzXG5cbiAgICAgICAgY29uc3QgcHJlZml4ID0gZXZlbnRPcHRpb25zLnBhc3NpdmUgPyAnJicgOiAoKGV2ZW50T3B0aW9ucy5vbmNlID8gJ34nIDogJycpICsgKGV2ZW50T3B0aW9ucy5jYXB0dXJlID8gJyEnIDogJycpKVxuICAgICAgICBjb25zdCBrZXkgPSBwcmVmaXggKyBldmVudE9wdGlvbnMuZXZlbnRcblxuICAgICAgICBjb25zdCBoYW5kbGVyOiBNb3VzZUhhbmRsZXIgPSBlID0+IHtcbiAgICAgICAgICBjb25zdCBtb3VzZUV2ZW50OiBNb3VzZUV2ZW50ID0gZSBhcyBNb3VzZUV2ZW50XG4gICAgICAgICAgaWYgKGV2ZW50T3B0aW9ucy5idXR0b24gPT09IHVuZGVmaW5lZCB8fCAobW91c2VFdmVudC5idXR0b25zID4gMCAmJiBtb3VzZUV2ZW50LmJ1dHRvbiA9PT0gZXZlbnRPcHRpb25zLmJ1dHRvbikpIHtcbiAgICAgICAgICAgIGlmIChldmVudE9wdGlvbnMucHJldmVudCkge1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChldmVudE9wdGlvbnMuc3RvcCkge1xuICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIER1ZSB0byBUb3VjaEV2ZW50IHRhcmdldCBhbHdheXMgcmV0dXJucyB0aGUgZWxlbWVudCB0aGF0IGlzIGZpcnN0IHBsYWNlZFxuICAgICAgICAgICAgLy8gRXZlbiBpZiB0b3VjaCBwb2ludCBoYXMgc2luY2UgbW92ZWQgb3V0c2lkZSB0aGUgaW50ZXJhY3RpdmUgYXJlYSBvZiB0aGF0IGVsZW1lbnRcbiAgICAgICAgICAgIC8vIFJlZjogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1RvdWNoL3RhcmdldFxuICAgICAgICAgICAgLy8gVGhpcyBibG9jayBvZiBjb2RlIGFpbXMgdG8gbWFrZSBzdXJlIHRvdWNoRXZlbnQgaXMgYWx3YXlzIGRpc3BhdGNoZWQgZnJvbSB0aGUgZWxlbWVudCB0aGF0IGlzIGJlaW5nIHBvaW50ZWQgYXRcbiAgICAgICAgICAgIGlmIChlICYmICd0b3VjaGVzJyBpbiBlKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNsYXNzU2VwYXJhdG9yID0gJyAnXG5cbiAgICAgICAgICAgICAgY29uc3QgZXZlbnRUYXJnZXRDbGFzc2VzID0gKGUuY3VycmVudFRhcmdldCBhcyBIVE1MRWxlbWVudCk/LmNsYXNzTmFtZS5zcGxpdChjbGFzc1NlcGFyYXRvcilcbiAgICAgICAgICAgICAgY29uc3QgY3VycmVudFRhcmdldHMgPSBkb2N1bWVudC5lbGVtZW50c0Zyb21Qb2ludChlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFgsIGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSlcblxuICAgICAgICAgICAgICAvLyBHZXQgXCJ0aGUgc2FtZSBraW5kXCIgY3VycmVudCBob3ZlcmluZyB0YXJnZXQgYnkgY2hlY2tpbmdcbiAgICAgICAgICAgICAgLy8gSWYgZWxlbWVudCBoYXMgdGhlIHNhbWUgY2xhc3Mgb2YgaW5pdGlhbCB0b3VjaCBzdGFydCBlbGVtZW50ICh3aGljaCBoYXMgdG91Y2ggZXZlbnQgbGlzdGVuZXIgcmVnaXN0ZXJlZClcbiAgICAgICAgICAgICAgY29uc3QgY3VycmVudFRhcmdldCA9IGN1cnJlbnRUYXJnZXRzLmZpbmQodCA9PiB0LmNsYXNzTmFtZS5zcGxpdChjbGFzc1NlcGFyYXRvcikuc29tZShjID0+IGV2ZW50VGFyZ2V0Q2xhc3Nlcy5pbmNsdWRlcyhjKSkpXG5cbiAgICAgICAgICAgICAgaWYgKGN1cnJlbnRUYXJnZXQgJiZcbiAgICAgICAgICAgICAgICAhKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KT8uaXNTYW1lTm9kZShjdXJyZW50VGFyZ2V0KVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50VGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IFRvdWNoRXZlbnQoZS50eXBlLCB7XG4gICAgICAgICAgICAgICAgICBjaGFuZ2VkVG91Y2hlczogZS5jaGFuZ2VkVG91Y2hlcyBhcyB1bmtub3duIGFzIFRvdWNoW10sXG4gICAgICAgICAgICAgICAgICB0YXJnZXRUb3VjaGVzOiBlLnRhcmdldFRvdWNoZXMgYXMgdW5rbm93biBhcyBUb3VjaFtdLFxuICAgICAgICAgICAgICAgICAgdG91Y2hlczogZS50b3VjaGVzIGFzIHVua25vd24gYXMgVG91Y2hbXSxcbiAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUT0RPOiBWQ2FsZW5kYXIgZW1pdHMgdGhlIGNhbGVuZGFyIGV2ZW50IGFzIHRoZSBmaXJzdCBhcmd1bWVudCxcbiAgICAgICAgICAgIC8vIGJ1dCBpdCByZWFsbHkgc2hvdWxkIGJlIHRoZSBuYXRpdmUgZXZlbnQgaW5zdGVhZCBzbyBtb2RpZmllcnMgY2FuIGJlIHVzZWRcbiAgICAgICAgICAgIGlmIChldmVudEZpcnN0KSB7XG4gICAgICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnQsIGUsIGdldERhdGEoZSkpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50LCBnZXREYXRhKGUpLCBlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBldmVudE9wdGlvbnMucmVzdWx0XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoa2V5IGluIG9uKSB7XG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvbltrZXldKSkge1xuICAgICAgICAgICAgKG9uW2tleV0gYXMgTW91c2VIYW5kbGVyW10pLnB1c2goaGFuZGxlcilcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb25ba2V5XSA9IFtvbltrZXldLCBoYW5kbGVyXSBhcyBNb3VzZUhhbmRsZXJbXVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvbltrZXldID0gaGFuZGxlclxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvblxuICAgIH0sXG4gIH0sXG59KVxuIl19