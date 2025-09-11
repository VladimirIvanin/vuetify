import { camelize, wrapInArray } from './helpers';
const pattern = {
    styleList: /;(?![^(]*\))/g,
    styleProp: /:(.*)/,
};
function parseStyle(style) {
    const styleMap = {};
    for (const s of style.split(pattern.styleList)) {
        let [key, val] = s.split(pattern.styleProp);
        key = key.trim();
        if (!key) {
            continue;
        }
        // May be undefined if the `key: value` pair is incomplete.
        if (typeof val === 'string') {
            val = val.trim();
        }
        styleMap[camelize(key)] = val;
    }
    return styleMap;
}
export default function mergeData() {
    const mergeTarget = {};
    let i = arguments.length;
    let prop;
    // Allow for variadic argument length.
    while (i--) {
        // Iterate through the data properties and execute merge strategies
        // Object.keys eliminates need for hasOwnProperty call
        for (prop of Object.keys(arguments[i])) {
            switch (prop) {
                // Array merge strategy (array concatenation)
                case 'class':
                case 'directives':
                    if (arguments[i][prop]) {
                        mergeTarget[prop] = mergeClasses(mergeTarget[prop], arguments[i][prop]);
                    }
                    break;
                case 'style':
                    if (arguments[i][prop]) {
                        mergeTarget[prop] = mergeStyles(mergeTarget[prop], arguments[i][prop]);
                    }
                    break;
                // Space delimited string concatenation strategy
                case 'class':
                    if (!arguments[i][prop]) {
                        break;
                    }
                    if (mergeTarget[prop] === undefined) {
                        mergeTarget[prop] = '';
                    }
                    if (mergeTarget[prop]) {
                        // Not an empty string, so concatenate
                        mergeTarget[prop] += ' ';
                    }
                    mergeTarget[prop] += arguments[i][prop].trim();
                    break;
                // Object, the properties of which to merge via array merge strategy (array concatenation).
                // Callback merge strategy merges callbacks to the beginning of the array,
                // so that the last defined callback will be invoked first.
                // This is done since to mimic how Object.assign merging
                // uses the last given value to assign.
                case 'on':
                case 'nativeOn':
                    if (arguments[i][prop]) {
                        mergeTarget[prop] = mergeListeners(mergeTarget[prop], arguments[i][prop]);
                    }
                    break;
                // Object merge strategy
                case 'attrs':
                case 'props':
                case 'domProps':
                case 'scopedSlots':
                case 'staticStyle':
                case 'hook':
                case 'transition':
                    if (!arguments[i][prop]) {
                        break;
                    }
                    if (!mergeTarget[prop]) {
                        mergeTarget[prop] = {};
                    }
                    mergeTarget[prop] = { ...arguments[i][prop], ...mergeTarget[prop] };
                    break;
                // Reassignment strategy (no merge)
                default: // slot, key, ref, tag, show, keepAlive
                    if (!mergeTarget[prop]) {
                        mergeTarget[prop] = arguments[i][prop];
                    }
            }
        }
    }
    return mergeTarget;
}
export function mergeStyles(target, source) {
    if (!target)
        return source;
    if (!source)
        return target;
    target = wrapInArray(typeof target === 'string' ? parseStyle(target) : target);
    return target.concat(typeof source === 'string' ? parseStyle(source) : source);
}
export function mergeClasses(target, source) {
    if (!source)
        return target;
    if (!target)
        return source;
    return target ? wrapInArray(target).concat(source) : source;
}
export function mergeListeners(...args) {
    if (!args[0])
        return args[1];
    if (!args[1])
        return args[0];
    const dest = {};
    for (let i = 2; i--;) {
        const arg = args[i];
        for (const event in arg) {
            if (!arg[event])
                continue;
            if (dest[event]) {
                // Merge current listeners before (because we are iterating backwards).
                // Note that neither "target" or "source" must be altered.
                dest[event] = [].concat(arg[event], dest[event]);
            }
            else {
                // Straight assign.
                dest[event] = arg[event];
            }
        }
    }
    return dest;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVyZ2VEYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwvbWVyZ2VEYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sV0FBVyxDQUFBO0FBRWpELE1BQU0sT0FBTyxHQUFHO0lBQ2QsU0FBUyxFQUFFLGVBQWU7SUFDMUIsU0FBUyxFQUFFLE9BQU87Q0FDVixDQUFBO0FBRVYsU0FBUyxVQUFVLENBQUUsS0FBYTtJQUNoQyxNQUFNLFFBQVEsR0FBb0IsRUFBRSxDQUFBO0lBRXBDLEtBQUssTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFDOUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUMzQyxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFBO1FBQ2hCLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDUixTQUFRO1NBQ1Q7UUFDRCwyREFBMkQ7UUFDM0QsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7WUFDM0IsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtTQUNqQjtRQUNELFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUE7S0FDOUI7SUFFRCxPQUFPLFFBQVEsQ0FBQTtBQUNqQixDQUFDO0FBUUQsTUFBTSxDQUFDLE9BQU8sVUFBVSxTQUFTO0lBQy9CLE1BQU0sV0FBVyxHQUFnQyxFQUFFLENBQUE7SUFDbkQsSUFBSSxDQUFDLEdBQVcsU0FBUyxDQUFDLE1BQU0sQ0FBQTtJQUNoQyxJQUFJLElBQVksQ0FBQTtJQUVoQixzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEVBQUUsRUFBRTtRQUNWLG1FQUFtRTtRQUNuRSxzREFBc0Q7UUFDdEQsS0FBSyxJQUFJLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN0QyxRQUFRLElBQUksRUFBRTtnQkFDWiw2Q0FBNkM7Z0JBQzdDLEtBQUssT0FBTyxDQUFDO2dCQUNiLEtBQUssWUFBWTtvQkFDZixJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDdEIsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLFlBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7cUJBQ3hFO29CQUNELE1BQUs7Z0JBQ1AsS0FBSyxPQUFPO29CQUNWLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFO3dCQUN0QixXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtxQkFDdkU7b0JBQ0QsTUFBSztnQkFDUCxnREFBZ0Q7Z0JBQ2hELEtBQUssT0FBTztvQkFDVixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFO3dCQUN2QixNQUFLO3FCQUNOO29CQUNELElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsRUFBRTt3QkFDbkMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQTtxQkFDdkI7b0JBQ0QsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUU7d0JBQ3JCLHNDQUFzQzt3QkFDdEMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQTtxQkFDekI7b0JBQ0QsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtvQkFDOUMsTUFBSztnQkFDUCwyRkFBMkY7Z0JBQzNGLDBFQUEwRTtnQkFDMUUsMkRBQTJEO2dCQUMzRCx3REFBd0Q7Z0JBQ3hELHVDQUF1QztnQkFDdkMsS0FBSyxJQUFJLENBQUM7Z0JBQ1YsS0FBSyxVQUFVO29CQUNiLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFO3dCQUN0QixXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtxQkFDMUU7b0JBQ0QsTUFBSztnQkFDUCx3QkFBd0I7Z0JBQ3hCLEtBQUssT0FBTyxDQUFDO2dCQUNiLEtBQUssT0FBTyxDQUFDO2dCQUNiLEtBQUssVUFBVSxDQUFDO2dCQUNoQixLQUFLLGFBQWEsQ0FBQztnQkFDbkIsS0FBSyxhQUFhLENBQUM7Z0JBQ25CLEtBQUssTUFBTSxDQUFDO2dCQUNaLEtBQUssWUFBWTtvQkFDZixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFO3dCQUN2QixNQUFLO3FCQUNOO29CQUNELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUU7d0JBQ3RCLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7cUJBQ3ZCO29CQUNELFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUE7b0JBQ25FLE1BQUs7Z0JBQ1AsbUNBQW1DO2dCQUNuQyxTQUFTLHVDQUF1QztvQkFDOUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDdEIsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtxQkFDdkM7YUFDSjtTQUNGO0tBQ0Y7SUFFRCxPQUFPLFdBQVcsQ0FBQTtBQUNwQixDQUFDO0FBRUQsTUFBTSxVQUFVLFdBQVcsQ0FDekIsTUFBOEMsRUFDOUMsTUFBOEM7SUFFOUMsSUFBSSxDQUFDLE1BQU07UUFBRSxPQUFPLE1BQU0sQ0FBQTtJQUMxQixJQUFJLENBQUMsTUFBTTtRQUFFLE9BQU8sTUFBTSxDQUFBO0lBRTFCLE1BQU0sR0FBRyxXQUFXLENBQUMsT0FBTyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBRTlFLE9BQVEsTUFBbUIsQ0FBQyxNQUFNLENBQUMsT0FBTyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzlGLENBQUM7QUFFRCxNQUFNLFVBQVUsWUFBWSxDQUFFLE1BQVcsRUFBRSxNQUFXO0lBQ3BELElBQUksQ0FBQyxNQUFNO1FBQUUsT0FBTyxNQUFNLENBQUE7SUFDMUIsSUFBSSxDQUFDLE1BQU07UUFBRSxPQUFPLE1BQU0sQ0FBQTtJQUUxQixPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFBO0FBQzdELENBQUM7QUFFRCxNQUFNLFVBQVUsY0FBYyxDQUFFLEdBQUcsSUFHbEM7SUFDQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFFNUIsTUFBTSxJQUFJLEdBQTZDLEVBQUUsQ0FBQTtJQUV6RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRztRQUNwQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkIsS0FBSyxNQUFNLEtBQUssSUFBSSxHQUFHLEVBQUU7WUFDdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7Z0JBQUUsU0FBUTtZQUV6QixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDZix1RUFBdUU7Z0JBQ3ZFLDBEQUEwRDtnQkFDMUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFJLEVBQWlCLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTthQUNqRTtpQkFBTTtnQkFDTCxtQkFBbUI7Z0JBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7YUFDekI7U0FDRjtLQUNGO0lBRUQsT0FBTyxJQUFJLENBQUE7QUFDYixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAY29weXJpZ2h0IDIwMTcgQWxleCBSZWdhblxuICogQGxpY2Vuc2UgTUlUXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbGV4c2FzaGFyZWdhbi92dWUtZnVuY3Rpb25hbC1kYXRhLW1lcmdlXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG1heC1zdGF0ZW1lbnRzICovXG5pbXBvcnQgeyBWTm9kZURhdGEgfSBmcm9tICd2dWUnXG5pbXBvcnQgeyBjYW1lbGl6ZSwgd3JhcEluQXJyYXkgfSBmcm9tICcuL2hlbHBlcnMnXG5cbmNvbnN0IHBhdHRlcm4gPSB7XG4gIHN0eWxlTGlzdDogLzsoPyFbXihdKlxcKSkvZyxcbiAgc3R5bGVQcm9wOiAvOiguKikvLFxufSBhcyBjb25zdFxuXG5mdW5jdGlvbiBwYXJzZVN0eWxlIChzdHlsZTogc3RyaW5nKSB7XG4gIGNvbnN0IHN0eWxlTWFwOiBEaWN0aW9uYXJ5PGFueT4gPSB7fVxuXG4gIGZvciAoY29uc3QgcyBvZiBzdHlsZS5zcGxpdChwYXR0ZXJuLnN0eWxlTGlzdCkpIHtcbiAgICBsZXQgW2tleSwgdmFsXSA9IHMuc3BsaXQocGF0dGVybi5zdHlsZVByb3ApXG4gICAga2V5ID0ga2V5LnRyaW0oKVxuICAgIGlmICgha2V5KSB7XG4gICAgICBjb250aW51ZVxuICAgIH1cbiAgICAvLyBNYXkgYmUgdW5kZWZpbmVkIGlmIHRoZSBga2V5OiB2YWx1ZWAgcGFpciBpcyBpbmNvbXBsZXRlLlxuICAgIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgICAgdmFsID0gdmFsLnRyaW0oKVxuICAgIH1cbiAgICBzdHlsZU1hcFtjYW1lbGl6ZShrZXkpXSA9IHZhbFxuICB9XG5cbiAgcmV0dXJuIHN0eWxlTWFwXG59XG5cbi8qKlxuICogSW50ZWxsaWdlbnRseSBtZXJnZXMgZGF0YSBmb3IgY3JlYXRlRWxlbWVudC5cbiAqIE1lcmdlcyBhcmd1bWVudHMgbGVmdCB0byByaWdodCwgcHJlZmVycmluZyB0aGUgcmlnaHQgYXJndW1lbnQuXG4gKiBSZXR1cm5zIG5ldyBWTm9kZURhdGEgb2JqZWN0LlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtZXJnZURhdGEgKC4uLnZOb2RlRGF0YTogVk5vZGVEYXRhW10pOiBWTm9kZURhdGFcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1lcmdlRGF0YSAoKTogVk5vZGVEYXRhIHtcbiAgY29uc3QgbWVyZ2VUYXJnZXQ6IFZOb2RlRGF0YSAmIERpY3Rpb25hcnk8YW55PiA9IHt9XG4gIGxldCBpOiBudW1iZXIgPSBhcmd1bWVudHMubGVuZ3RoXG4gIGxldCBwcm9wOiBzdHJpbmdcblxuICAvLyBBbGxvdyBmb3IgdmFyaWFkaWMgYXJndW1lbnQgbGVuZ3RoLlxuICB3aGlsZSAoaS0tKSB7XG4gICAgLy8gSXRlcmF0ZSB0aHJvdWdoIHRoZSBkYXRhIHByb3BlcnRpZXMgYW5kIGV4ZWN1dGUgbWVyZ2Ugc3RyYXRlZ2llc1xuICAgIC8vIE9iamVjdC5rZXlzIGVsaW1pbmF0ZXMgbmVlZCBmb3IgaGFzT3duUHJvcGVydHkgY2FsbFxuICAgIGZvciAocHJvcCBvZiBPYmplY3Qua2V5cyhhcmd1bWVudHNbaV0pKSB7XG4gICAgICBzd2l0Y2ggKHByb3ApIHtcbiAgICAgICAgLy8gQXJyYXkgbWVyZ2Ugc3RyYXRlZ3kgKGFycmF5IGNvbmNhdGVuYXRpb24pXG4gICAgICAgIGNhc2UgJ2NsYXNzJzpcbiAgICAgICAgY2FzZSAnZGlyZWN0aXZlcyc6XG4gICAgICAgICAgaWYgKGFyZ3VtZW50c1tpXVtwcm9wXSkge1xuICAgICAgICAgICAgbWVyZ2VUYXJnZXRbcHJvcF0gPSBtZXJnZUNsYXNzZXMobWVyZ2VUYXJnZXRbcHJvcF0sIGFyZ3VtZW50c1tpXVtwcm9wXSlcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnc3R5bGUnOlxuICAgICAgICAgIGlmIChhcmd1bWVudHNbaV1bcHJvcF0pIHtcbiAgICAgICAgICAgIG1lcmdlVGFyZ2V0W3Byb3BdID0gbWVyZ2VTdHlsZXMobWVyZ2VUYXJnZXRbcHJvcF0sIGFyZ3VtZW50c1tpXVtwcm9wXSlcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgLy8gU3BhY2UgZGVsaW1pdGVkIHN0cmluZyBjb25jYXRlbmF0aW9uIHN0cmF0ZWd5XG4gICAgICAgIGNhc2UgJ2NsYXNzJzpcbiAgICAgICAgICBpZiAoIWFyZ3VtZW50c1tpXVtwcm9wXSkge1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG1lcmdlVGFyZ2V0W3Byb3BdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG1lcmdlVGFyZ2V0W3Byb3BdID0gJydcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG1lcmdlVGFyZ2V0W3Byb3BdKSB7XG4gICAgICAgICAgICAvLyBOb3QgYW4gZW1wdHkgc3RyaW5nLCBzbyBjb25jYXRlbmF0ZVxuICAgICAgICAgICAgbWVyZ2VUYXJnZXRbcHJvcF0gKz0gJyAnXG4gICAgICAgICAgfVxuICAgICAgICAgIG1lcmdlVGFyZ2V0W3Byb3BdICs9IGFyZ3VtZW50c1tpXVtwcm9wXS50cmltKClcbiAgICAgICAgICBicmVha1xuICAgICAgICAvLyBPYmplY3QsIHRoZSBwcm9wZXJ0aWVzIG9mIHdoaWNoIHRvIG1lcmdlIHZpYSBhcnJheSBtZXJnZSBzdHJhdGVneSAoYXJyYXkgY29uY2F0ZW5hdGlvbikuXG4gICAgICAgIC8vIENhbGxiYWNrIG1lcmdlIHN0cmF0ZWd5IG1lcmdlcyBjYWxsYmFja3MgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGUgYXJyYXksXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGxhc3QgZGVmaW5lZCBjYWxsYmFjayB3aWxsIGJlIGludm9rZWQgZmlyc3QuXG4gICAgICAgIC8vIFRoaXMgaXMgZG9uZSBzaW5jZSB0byBtaW1pYyBob3cgT2JqZWN0LmFzc2lnbiBtZXJnaW5nXG4gICAgICAgIC8vIHVzZXMgdGhlIGxhc3QgZ2l2ZW4gdmFsdWUgdG8gYXNzaWduLlxuICAgICAgICBjYXNlICdvbic6XG4gICAgICAgIGNhc2UgJ25hdGl2ZU9uJzpcbiAgICAgICAgICBpZiAoYXJndW1lbnRzW2ldW3Byb3BdKSB7XG4gICAgICAgICAgICBtZXJnZVRhcmdldFtwcm9wXSA9IG1lcmdlTGlzdGVuZXJzKG1lcmdlVGFyZ2V0W3Byb3BdLCBhcmd1bWVudHNbaV1bcHJvcF0pXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIC8vIE9iamVjdCBtZXJnZSBzdHJhdGVneVxuICAgICAgICBjYXNlICdhdHRycyc6XG4gICAgICAgIGNhc2UgJ3Byb3BzJzpcbiAgICAgICAgY2FzZSAnZG9tUHJvcHMnOlxuICAgICAgICBjYXNlICdzY29wZWRTbG90cyc6XG4gICAgICAgIGNhc2UgJ3N0YXRpY1N0eWxlJzpcbiAgICAgICAgY2FzZSAnaG9vayc6XG4gICAgICAgIGNhc2UgJ3RyYW5zaXRpb24nOlxuICAgICAgICAgIGlmICghYXJndW1lbnRzW2ldW3Byb3BdKSB7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIW1lcmdlVGFyZ2V0W3Byb3BdKSB7XG4gICAgICAgICAgICBtZXJnZVRhcmdldFtwcm9wXSA9IHt9XG4gICAgICAgICAgfVxuICAgICAgICAgIG1lcmdlVGFyZ2V0W3Byb3BdID0geyAuLi5hcmd1bWVudHNbaV1bcHJvcF0sIC4uLm1lcmdlVGFyZ2V0W3Byb3BdIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICAvLyBSZWFzc2lnbm1lbnQgc3RyYXRlZ3kgKG5vIG1lcmdlKVxuICAgICAgICBkZWZhdWx0OiAvLyBzbG90LCBrZXksIHJlZiwgdGFnLCBzaG93LCBrZWVwQWxpdmVcbiAgICAgICAgICBpZiAoIW1lcmdlVGFyZ2V0W3Byb3BdKSB7XG4gICAgICAgICAgICBtZXJnZVRhcmdldFtwcm9wXSA9IGFyZ3VtZW50c1tpXVtwcm9wXVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWVyZ2VUYXJnZXRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlU3R5bGVzIChcbiAgdGFyZ2V0OiB1bmRlZmluZWQgfCBzdHJpbmcgfCBvYmplY3RbXSB8IG9iamVjdCxcbiAgc291cmNlOiB1bmRlZmluZWQgfCBzdHJpbmcgfCBvYmplY3RbXSB8IG9iamVjdFxuKSB7XG4gIGlmICghdGFyZ2V0KSByZXR1cm4gc291cmNlXG4gIGlmICghc291cmNlKSByZXR1cm4gdGFyZ2V0XG5cbiAgdGFyZ2V0ID0gd3JhcEluQXJyYXkodHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycgPyBwYXJzZVN0eWxlKHRhcmdldCkgOiB0YXJnZXQpXG5cbiAgcmV0dXJuICh0YXJnZXQgYXMgb2JqZWN0W10pLmNvbmNhdCh0eXBlb2Ygc291cmNlID09PSAnc3RyaW5nJyA/IHBhcnNlU3R5bGUoc291cmNlKSA6IHNvdXJjZSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlQ2xhc3NlcyAodGFyZ2V0OiBhbnksIHNvdXJjZTogYW55KSB7XG4gIGlmICghc291cmNlKSByZXR1cm4gdGFyZ2V0XG4gIGlmICghdGFyZ2V0KSByZXR1cm4gc291cmNlXG5cbiAgcmV0dXJuIHRhcmdldCA/IHdyYXBJbkFycmF5KHRhcmdldCkuY29uY2F0KHNvdXJjZSkgOiBzb3VyY2Vcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlTGlzdGVuZXJzICguLi5hcmdzOiBbXG4gIHsgW2tleTogc3RyaW5nXTogRnVuY3Rpb24gfCBGdW5jdGlvbltdIH0gfCB1bmRlZmluZWQsXG4gIHsgW2tleTogc3RyaW5nXTogRnVuY3Rpb24gfCBGdW5jdGlvbltdIH0gfCB1bmRlZmluZWRcbl0pIHtcbiAgaWYgKCFhcmdzWzBdKSByZXR1cm4gYXJnc1sxXVxuICBpZiAoIWFyZ3NbMV0pIHJldHVybiBhcmdzWzBdXG5cbiAgY29uc3QgZGVzdDogeyBba2V5OiBzdHJpbmddOiBGdW5jdGlvbiB8IEZ1bmN0aW9uW10gfSA9IHt9XG5cbiAgZm9yIChsZXQgaSA9IDI7IGktLTspIHtcbiAgICBjb25zdCBhcmcgPSBhcmdzW2ldXG4gICAgZm9yIChjb25zdCBldmVudCBpbiBhcmcpIHtcbiAgICAgIGlmICghYXJnW2V2ZW50XSkgY29udGludWVcblxuICAgICAgaWYgKGRlc3RbZXZlbnRdKSB7XG4gICAgICAgIC8vIE1lcmdlIGN1cnJlbnQgbGlzdGVuZXJzIGJlZm9yZSAoYmVjYXVzZSB3ZSBhcmUgaXRlcmF0aW5nIGJhY2t3YXJkcykuXG4gICAgICAgIC8vIE5vdGUgdGhhdCBuZWl0aGVyIFwidGFyZ2V0XCIgb3IgXCJzb3VyY2VcIiBtdXN0IGJlIGFsdGVyZWQuXG4gICAgICAgIGRlc3RbZXZlbnRdID0gKFtdIGFzIEZ1bmN0aW9uW10pLmNvbmNhdChhcmdbZXZlbnRdLCBkZXN0W2V2ZW50XSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFN0cmFpZ2h0IGFzc2lnbi5cbiAgICAgICAgZGVzdFtldmVudF0gPSBhcmdbZXZlbnRdXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRlc3Rcbn1cbiJdfQ==