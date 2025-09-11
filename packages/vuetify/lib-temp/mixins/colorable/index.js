import { defineComponent } from 'vue';
import { consoleError } from '../../util/console';
import { isCssColor } from '../../util/colorUtils';
export default defineComponent({
    name: 'colorable',
    props: {
        color: String,
    },
    methods: {
        setBackgroundColor(color, data = {}) {
            if (typeof data.style === 'string') {
                // istanbul ignore next
                consoleError('style must be an object', this);
                // istanbul ignore next
                return data;
            }
            if (typeof data.class === 'string') {
                data.class = {
                    [data.class]: true
                };
                // istanbul ignore next
                // consoleError('class must be an object', this)
                // istanbul ignore next
                // return data
            }
            if (data.class instanceof Array) {
                data.class = data.class.reduce((classes, current) => {
                    if (typeof current === 'string') {
                        classes[current] = true;
                    }
                    if (typeof current === 'object') {
                        classes = {
                            ...classes,
                            ...current
                        };
                    }
                    return classes;
                }, {});
            }
            if (isCssColor(color)) {
                data.style = {
                    ...data.style,
                    'background-color': `${color}`,
                    'border-color': `${color}`,
                };
            }
            else if (color) {
                data.class = {
                    ...data.class,
                    [color]: true,
                };
            }
            return data;
        },
        setTextColor(color, data = {}) {
            if (typeof data.style === 'string') {
                // istanbul ignore next
                consoleError('style must be an object', this);
                // istanbul ignore next
                return data;
            }
            if (typeof data.class === 'string') {
                data.class = {
                    [data.class]: true
                };
                // istanbul ignore next
                // consoleError('class must be an object', this)
                // istanbul ignore next
                // return data
            }
            if (data.class instanceof Array) {
                data.class = data.class.reduce((classes, current) => {
                    if (typeof current === 'string') {
                        classes[current] = true;
                    }
                    else if (typeof current === 'object') {
                        classes = {
                            ...classes,
                            ...current
                        };
                    }
                    else {
                        console.error(`Unknown type of class ${typeof current}`);
                    }
                    return classes;
                }, {});
            }
            if (isCssColor(color)) {
                data.style = {
                    ...data.style,
                    color: `${color}`,
                    'caret-color': `${color}`,
                };
            }
            else if (color) {
                const [colorName, colorModifier] = color.toString().trim().split(' ', 2);
                data.class = {
                    ...data.class,
                    [colorName + '--text']: true,
                };
                if (colorModifier) {
                    data.class['text--' + colorModifier] = true;
                }
            }
            return data;
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2NvbG9yYWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sS0FBSyxDQUFBO0FBRW5DLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUNqRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sdUJBQXVCLENBQUE7QUFFbEQsZUFBZSxlQUFlLENBQUM7SUFDN0IsSUFBSSxFQUFFLFdBQVc7SUFFakIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFLE1BQU07S0FDZDtJQUVELE9BQU8sRUFBRTtRQUNQLGtCQUFrQixDQUFFLEtBQXNCLEVBQUUsT0FBa0IsRUFBRTtZQUM5RCxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRLEVBQUU7Z0JBQ2xDLHVCQUF1QjtnQkFDdkIsWUFBWSxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxDQUFBO2dCQUM3Qyx1QkFBdUI7Z0JBQ3ZCLE9BQU8sSUFBSSxDQUFBO2FBQ1o7WUFDRCxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRLEVBQUU7Z0JBQ2xDLElBQUksQ0FBQyxLQUFLLEdBQUc7b0JBQ1gsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSTtpQkFDbkIsQ0FBQTtnQkFDRCx1QkFBdUI7Z0JBQ3ZCLGdEQUFnRDtnQkFDaEQsdUJBQXVCO2dCQUN2QixjQUFjO2FBQ2Y7WUFFRCxJQUFHLElBQUksQ0FBQyxLQUFLLFlBQVksS0FBSyxFQUFFO2dCQUM5QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxFQUFFO29CQUNsRCxJQUFHLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTt3QkFDOUIsT0FBTyxDQUFDLE9BQU8s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R0FBRyxJQUFJLENBQUE7aUJBQzVDO2FBQ0Y7WUFFRCxPQUFPLElBQUksQ0FBQTtRQUNiLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZGVmaW5lQ29tcG9uZW50fSBmcm9tICd2dWUnXG5pbXBvcnQgeyBWTm9kZURhdGEgfSBmcm9tICd2dWUvdHlwZXMvdm5vZGUnXG5pbXBvcnQgeyBjb25zb2xlRXJyb3IgfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXG5pbXBvcnQgeyBpc0Nzc0NvbG9yIH0gZnJvbSAnLi4vLi4vdXRpbC9jb2xvclV0aWxzJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb21wb25lbnQoe1xuICBuYW1lOiAnY29sb3JhYmxlJyxcblxuICBwcm9wczoge1xuICAgIGNvbG9yOiBTdHJpbmcsXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIHNldEJhY2tncm91bmRDb2xvciAoY29sb3I/OiBzdHJpbmcgfCBmYWxzZSwgZGF0YTogVk5vZGVEYXRhID0ge30pOiBWTm9kZURhdGEge1xuICAgICAgaWYgKHR5cGVvZiBkYXRhLnN0eWxlID09PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBjb25zb2xlRXJyb3IoJ3N0eWxlIG11c3QgYmUgYW4gb2JqZWN0JywgdGhpcylcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgcmV0dXJuIGRhdGFcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgZGF0YS5jbGFzcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgZGF0YS5jbGFzcyA9IHtcbiAgICAgICAgICBbZGF0YS5jbGFzc106IHRydWVcbiAgICAgICAgfVxuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICAvLyBjb25zb2xlRXJyb3IoJ2NsYXNzIG11c3QgYmUgYW4gb2JqZWN0JywgdGhpcylcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgLy8gcmV0dXJuIGRhdGFcbiAgICAgIH1cblxuICAgICAgaWYoZGF0YS5jbGFzcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIGRhdGEuY2xhc3MgPSBkYXRhLmNsYXNzLnJlZHVjZSgoY2xhc3NlcywgY3VycmVudCkgPT4ge1xuICAgICAgICAgIGlmKHR5cGVvZiBjdXJyZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY2xhc3Nlc1tjdXJyZW50XSA9IHRydWVcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZih0eXBlb2YgY3VycmVudCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGNsYXNzZXMgPSB7XG4gICAgICAgICAgICAgIC4uLmNsYXNzZXMsXG4gICAgICAgICAgICAgIC4uLmN1cnJlbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gY2xhc3Nlc1xuICAgICAgICB9LCB7fSlcbiAgICAgIH1cblxuICAgICAgaWYgKGlzQ3NzQ29sb3IoY29sb3IpKSB7XG4gICAgICAgIGRhdGEuc3R5bGUgPSB7XG4gICAgICAgICAgLi4uZGF0YS5zdHlsZSBhcyBvYmplY3QsXG4gICAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiBgJHtjb2xvcn1gLFxuICAgICAgICAgICdib3JkZXItY29sb3InOiBgJHtjb2xvcn1gLFxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGNvbG9yKSB7XG4gICAgICAgIGRhdGEuY2xhc3MgPSB7XG4gICAgICAgICAgLi4uZGF0YS5jbGFzcyxcbiAgICAgICAgICBbY29sb3JdOiB0cnVlLFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkYXRhXG4gICAgfSxcblxuICAgIHNldFRleHRDb2xvciAoY29sb3I/OiBzdHJpbmcgfCBmYWxzZSwgZGF0YTogVk5vZGVEYXRhID0ge30pOiBWTm9kZURhdGEge1xuICAgICAgaWYgKHR5cGVvZiBkYXRhLnN0eWxlID09PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBjb25zb2xlRXJyb3IoJ3N0eWxlIG11c3QgYmUgYW4gb2JqZWN0JywgdGhpcylcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgcmV0dXJuIGRhdGFcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgZGF0YS5jbGFzcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgZGF0YS5jbGFzcyA9IHtcbiAgICAgICAgICBbZGF0YS5jbGFzc106IHRydWVcbiAgICAgICAgfVxuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICAvLyBjb25zb2xlRXJyb3IoJ2NsYXNzIG11c3QgYmUgYW4gb2JqZWN0JywgdGhpcylcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgLy8gcmV0dXJuIGRhdGFcbiAgICAgIH1cblxuICAgICAgaWYgKGRhdGEuY2xhc3MgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICBkYXRhLmNsYXNzID0gZGF0YS5jbGFzcy5yZWR1Y2UoKGNsYXNzZXMsIGN1cnJlbnQpID0+IHtcbiAgICAgICAgICBpZih0eXBlb2YgY3VycmVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNsYXNzZXNbY3VycmVudF0gPSB0cnVlXG4gICAgICAgICAgfSBlbHNlIGlmKHR5cGVvZiBjdXJyZW50ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgY2xhc3NlcyA9IHtcbiAgICAgICAgICAgICAgLi4uY2xhc3NlcyxcbiAgICAgICAgICAgICAgLi4uY3VycmVudFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBVbmtub3duIHR5cGUgb2YgY2xhc3MgJHt0eXBlb2YgY3VycmVudH1gKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBjbGFzc2VzXG4gICAgICAgIH0sIHt9KVxuICAgICAgfVxuXG4gICAgICBpZiAoaXNDc3NDb2xvcihjb2xvcikpIHtcbiAgICAgICAgZGF0YS5zdHlsZSA9IHtcbiAgICAgICAgICAuLi5kYXRhLnN0eWxlIGFzIG9iamVjdCxcbiAgICAgICAgICBjb2xvcjogYCR7Y29sb3J9YCxcbiAgICAgICAgICAnY2FyZXQtY29sb3InOiBgJHtjb2xvcn1gLFxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGNvbG9yKSB7XG4gICAgICAgIGNvbnN0IFtjb2xvck5hbWUsIGNvbG9yTW9kaWZpZXJdID0gY29sb3IudG9TdHJpbmcoKS50cmltKCkuc3BsaXQoJyAnLCAyKSBhcyAoc3RyaW5nIHwgdW5kZWZpbmVkKVtdXG4gICAgICAgIGRhdGEuY2xhc3MgPSB7XG4gICAgICAgICAgLi4uZGF0YS5jbGFzcyxcbiAgICAgICAgICBbY29sb3JOYW1lICsgJy0tdGV4dCddOiB0cnVlLFxuICAgICAgICB9XG4gICAgICAgIGlmIChjb2xvck1vZGlmaWVyKSB7XG4gICAgICAgICAgZGF0YS5jbGFzc1sndGV4dC0tJyArIGNvbG9yTW9kaWZpZXJdID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkYXRhXG4gICAgfSxcbiAgfSxcbn0pXG4iXX0=