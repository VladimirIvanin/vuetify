/* eslint-disable max-len, import/export, no-use-before-define */
export default function mixins(...args) {
    return {
        extend(options) {
            return {
                mixins: args,
                ...options
            };
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4aW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwvbWl4aW5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGlFQUFpRTtBQUNqRSxNQUFNLENBQUMsT0FBTyxVQUFVLE1BQU0sQ0FBRSxHQUFHLElBQUk7SUFDckMsT0FBTztRQUNMLE1BQU0sQ0FBQyxPQUFPO1lBQ1osT0FBTztnQkFDTCxNQUFNLEVBQUUsSUFBSTtnQkFDWixHQUFHLE9BQU87YUFDWCxDQUFBO1FBQ0gsQ0FBQztLQUNGLENBQUE7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiwgaW1wb3J0L2V4cG9ydCwgbm8tdXNlLWJlZm9yZS1kZWZpbmUgKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1peGlucyAoLi4uYXJncyl7XG4gIHJldHVybiB7XG4gICAgZXh0ZW5kKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1peGluczogYXJncyxcbiAgICAgICAgLi4ub3B0aW9uc1xuICAgICAgfVxuICAgIH1cbiAgfVxufSJdfQ==