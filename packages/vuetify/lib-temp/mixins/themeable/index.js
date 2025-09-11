import { defineComponent } from 'vue';
/* @vue/component */
const Themeable = defineComponent({
    name: 'themeable',
    provide() {
        return {
            theme: this.themeableProvide,
        };
    },
    inject: {
        theme: {
            default: {
                isDark: false,
            },
        },
    },
    props: {
        dark: {
            type: Boolean,
            default: null,
        },
        light: {
            type: Boolean,
            default: null,
        },
    },
    data() {
        return {
            themeableProvide: {
                isDark: false,
            },
        };
    },
    computed: {
        appIsDark() {
            return this.$vuetify.theme.dark || false;
        },
        isDark() {
            if (this.dark === true) {
                // explicitly dark
                return true;
            }
            else if (this.light === true) {
                // explicitly light
                return false;
            }
            else {
                // inherit from parent, or default false if there is none
                return this.theme.isDark;
            }
        },
        themeClasses() {
            return {
                'theme--dark': this.isDark,
                'theme--light': !this.isDark,
            };
        },
        /** Used by menus and dialogs, inherits from v-app instead of the parent */
        rootIsDark() {
            if (this.dark === true) {
                // explicitly dark
                return true;
            }
            else if (this.light === true) {
                // explicitly light
                return false;
            }
            else {
                // inherit from v-app
                return this.appIsDark;
            }
        },
        rootThemeClasses() {
            return {
                'theme--dark': this.rootIsDark,
                'theme--light': !this.rootIsDark,
            };
        },
    },
    watch: {
        isDark: {
            handler(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.themeableProvide.isDark = this.isDark;
                }
            },
            immediate: true,
        },
    },
});
export default Themeable;
export function functionalThemeClasses(vm) {
    const isDark = Themeable.computed.isDark.call(vm);
    return Themeable.computed.themeClasses.call({ isDark });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3RoZW1lYWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsZUFBZSxFQUFNLE1BQU0sS0FBSyxDQUFBO0FBU3hDLG9CQUFvQjtBQUNwQixNQUFNLFNBQVMsR0FBRyxlQUFlLENBQUM7SUFDaEMsSUFBSSxFQUFFLFdBQVc7SUFFakIsT0FBTztRQUNMLE9BQU87WUFDTCxLQUFLLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtTQUM3QixDQUFBO0lBQ0gsQ0FBQztJQUVELE1BQU0sRUFBRTtRQUNOLEtBQUssRUFBRTtZQUNMLE9BQU8sRUFBRTtnQkFDUCxNQUFNLEVBQUUsS0FBSzthQUNkO1NBQ0Y7S0FDRjtJQUVELEtBQUssRUFBRTtRQUNMLElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxPQUFtQztZQUN6QyxPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLE9BQW1DO1lBQ3pDLE9BQU8sRUFBRSxJQUFJO1NBQ2Q7S0FDRjtJQUVELElBQUk7UUFDRixPQUFPO1lBQ0wsZ0JBQWdCLEVBQUU7Z0JBQ2hCLE1BQU0sRUFBRSxLQUFLO2FBQ2Q7U0FDRixDQUFBO0lBQ0gsQ0FBQztJQUVELFFBQVEsRUFBRTtRQUNSLFNBQVM7WUFDUCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUE7UUFDMUMsQ0FBQztRQUNELE1BQU07WUFDSixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO2dCQUN0QixrQkFBa0I7Z0JBQ2xCLE9BQU8sSUFBSSxDQUFBO2FBQ1o7aUJBQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksRUFBRTtnQkFDOUIsbUJBQW1CO2dCQUNuQixPQUFPLEtBQUssQ0FBQTthQUNiO2lCQUFNO2dCQUNMLHlEQUF5RDtnQkFDekQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQTthQUN6QjtRQUNILENBQUM7UUFDRCxZQUFZO1lBQ1YsT0FBTztnQkFDTCxhQUFhLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQzFCLGNBQWMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNO2FBQzdCLENBQUE7UUFDSCxDQUFDO1FBQ0QsMkVBQTJFO1FBQzNFLFVBQVU7WUFDUixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO2dCQUN0QixrQkFBa0I7Z0JBQ2xCLE9BQU8sSUFBSSxDQUFBO2FBQ1o7aUJBQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksRUFBRTtnQkFDOUIsbUJBQW1CO2dCQUNuQixPQUFPLEtBQUssQ0FBQTthQUNiO2lCQUFNO2dCQUNMLHFCQUFxQjtnQkFDckIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFBO2FBQ3RCO1FBQ0gsQ0FBQztRQUNELGdCQUFnQjtZQUNkLE9BQU87Z0JBQ0wsYUFBYSxFQUFFLElBQUksQ0FBQyxVQUFVO2dCQUM5QixjQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVTthQUNqQyxDQUFBO1FBQ0gsQ0FBQztLQUNGO0lBRUQsS0FBSyxFQUFFO1FBQ0wsTUFBTSxFQUFFO1lBQ04sT0FBTyxDQUFFLE1BQU0sRUFBRSxNQUFNO2dCQUNyQixJQUFJLE1BQU0sS0FBSyxNQUFNLEVBQUU7b0JBQ3JCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQTtpQkFDM0M7WUFDSCxDQUFDO1lBQ0QsU0FBUyxFQUFFLElBQUk7U0FDaEI7S0FDRjtDQUNGLENBQUMsQ0FBQTtBQUVGLGVBQWUsU0FBUyxDQUFBO0FBRXhCLE1BQU0sVUFBVSxzQkFBc0IsQ0FBRSxFQUFPO0lBQzdDLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNqRCxPQUFPLFNBQVMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7QUFDekQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZGVmaW5lQ29tcG9uZW50LCBBcHB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7IFByb3BUeXBlLCBSZW5kZXJDb250ZXh0IH0gZnJvbSAndnVlL3R5cGVzL29wdGlvbnMnXG5cbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgQXBwIHtcbiAgdGhlbWU6IHtcbiAgICBpc0Rhcms6IGJvb2xlYW5cbiAgfVxufVxuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuY29uc3QgVGhlbWVhYmxlID0gZGVmaW5lQ29tcG9uZW50KHtcbiAgbmFtZTogJ3RoZW1lYWJsZScsXG5cbiAgcHJvdmlkZSAoKTogb2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgdGhlbWU6IHRoaXMudGhlbWVhYmxlUHJvdmlkZSxcbiAgICB9XG4gIH0sXG5cbiAgaW5qZWN0OiB7XG4gICAgdGhlbWU6IHtcbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgaXNEYXJrOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcblxuICBwcm9wczoge1xuICAgIGRhcms6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4gYXMgUHJvcFR5cGU8Ym9vbGVhbiB8IG51bGw+LFxuICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICB9LFxuICAgIGxpZ2h0OiB7XG4gICAgICB0eXBlOiBCb29sZWFuIGFzIFByb3BUeXBlPGJvb2xlYW4gfCBudWxsPixcbiAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgfSxcbiAgfSxcblxuICBkYXRhICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGhlbWVhYmxlUHJvdmlkZToge1xuICAgICAgICBpc0Rhcms6IGZhbHNlLFxuICAgICAgfSxcbiAgICB9XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBhcHBJc0RhcmsgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuJHZ1ZXRpZnkudGhlbWUuZGFyayB8fCBmYWxzZVxuICAgIH0sXG4gICAgaXNEYXJrICgpOiBib29sZWFuIHtcbiAgICAgIGlmICh0aGlzLmRhcmsgPT09IHRydWUpIHtcbiAgICAgICAgLy8gZXhwbGljaXRseSBkYXJrXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGVsc2UgaWYgKHRoaXMubGlnaHQgPT09IHRydWUpIHtcbiAgICAgICAgLy8gZXhwbGljaXRseSBsaWdodFxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGluaGVyaXQgZnJvbSBwYXJlbnQsIG9yIGRlZmF1bHQgZmFsc2UgaWYgdGhlcmUgaXMgbm9uZVxuICAgICAgICByZXR1cm4gdGhpcy50aGVtZS5pc0RhcmtcbiAgICAgIH1cbiAgICB9LFxuICAgIHRoZW1lQ2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd0aGVtZS0tZGFyayc6IHRoaXMuaXNEYXJrLFxuICAgICAgICAndGhlbWUtLWxpZ2h0JzogIXRoaXMuaXNEYXJrLFxuICAgICAgfVxuICAgIH0sXG4gICAgLyoqIFVzZWQgYnkgbWVudXMgYW5kIGRpYWxvZ3MsIGluaGVyaXRzIGZyb20gdi1hcHAgaW5zdGVhZCBvZiB0aGUgcGFyZW50ICovXG4gICAgcm9vdElzRGFyayAoKTogYm9vbGVhbiB7XG4gICAgICBpZiAodGhpcy5kYXJrID09PSB0cnVlKSB7XG4gICAgICAgIC8vIGV4cGxpY2l0bHkgZGFya1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmxpZ2h0ID09PSB0cnVlKSB7XG4gICAgICAgIC8vIGV4cGxpY2l0bHkgbGlnaHRcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpbmhlcml0IGZyb20gdi1hcHBcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwSXNEYXJrXG4gICAgICB9XG4gICAgfSxcbiAgICByb290VGhlbWVDbGFzc2VzICgpOiBEaWN0aW9uYXJ5PGJvb2xlYW4+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd0aGVtZS0tZGFyayc6IHRoaXMucm9vdElzRGFyayxcbiAgICAgICAgJ3RoZW1lLS1saWdodCc6ICF0aGlzLnJvb3RJc0RhcmssXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIGlzRGFyazoge1xuICAgICAgaGFuZGxlciAobmV3VmFsLCBvbGRWYWwpIHtcbiAgICAgICAgaWYgKG5ld1ZhbCAhPT0gb2xkVmFsKSB7XG4gICAgICAgICAgdGhpcy50aGVtZWFibGVQcm92aWRlLmlzRGFyayA9IHRoaXMuaXNEYXJrXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBpbW1lZGlhdGU6IHRydWUsXG4gICAgfSxcbiAgfSxcbn0pXG5cbmV4cG9ydCBkZWZhdWx0IFRoZW1lYWJsZVxuXG5leHBvcnQgZnVuY3Rpb24gZnVuY3Rpb25hbFRoZW1lQ2xhc3NlcyAodm06IGFueSk6IG9iamVjdCB7XG4gIGNvbnN0IGlzRGFyayA9IFRoZW1lYWJsZS5jb21wdXRlZC5pc0RhcmsuY2FsbCh2bSlcbiAgcmV0dXJuIFRoZW1lYWJsZS5jb21wdXRlZC50aGVtZUNsYXNzZXMuY2FsbCh7IGlzRGFyayB9KVxufVxuIl19