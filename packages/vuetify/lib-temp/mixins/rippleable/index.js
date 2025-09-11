// Directives
import ripple from '../../directives/ripple';
// Types
import { defineComponent, withDirectives, h } from 'vue';
export default defineComponent({
    name: 'rippleable',
    directives: { ripple },
    props: {
        ripple: {
            type: [Boolean, Object],
            default: true,
        },
    },
    methods: {
        genRipple(data = {}) {
            if (!this.ripple)
                return null;
            data.class = 'v-input--selection-controls__ripple';
            const node = h('div', data);
            const directives = data.directives || [];
            delete data.directives;
            return withDirectives(node, [
                ...(directives),
                [
                    ripple,
                    { center: true },
                    '',
                    {}
                ]
            ]);
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3JpcHBsZWFibGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsYUFBYTtBQUNiLE9BQU8sTUFBTSxNQUFNLHlCQUF5QixDQUFBO0FBRTVDLFFBQVE7QUFDUixPQUFZLEVBQW9DLGVBQWUsRUFBRSxjQUFjLEVBQUUsQ0FBQyxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBRS9GLGVBQWUsZUFBZSxDQUFDO0lBQzdCLElBQUksRUFBRSxZQUFZO0lBRWxCLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRTtJQUV0QixLQUFLLEVBQUU7UUFDTCxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO1lBQ3ZCLE9BQU8sRUFBRSxJQUFJO1NBQ2Q7S0FDRjtJQUVELE9BQU8sRUFBRTtRQUNQLFNBQVMsQ0FBRSxPQUFrQixFQUFFO1lBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtnQkFBRSxPQUFPLElBQUksQ0FBQTtZQUU3QixJQUFJLENBQUMsS0FBSyxHQUFHLHFDQUFxQyxDQUFBO1lBRWxELE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFFM0IsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUE7WUFDeEMsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFBO1lBRXRCLE9BQU8sY0FBYyxDQUFDLElBQUksRUFBRTtnQkFDMUIsR0FBRyxDQUFDLFVBQVUsQ0FBQztnQkFDZjtvQkFDRSxNQUFNO29CQUNOLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtvQkFDaEIsRUFBRTtvQkFDRixFQUFFO2lCQUNIO2FBQ0YsQ0FBQyxDQUFBO1FBQ0osQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRGlyZWN0aXZlc1xuaW1wb3J0IHJpcHBsZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3JpcHBsZSdcblxuLy8gVHlwZXNcbmltcG9ydCBWdWUsIHsgVk5vZGUsIFZOb2RlRGF0YSwgVk5vZGVEaXJlY3RpdmUsIGRlZmluZUNvbXBvbmVudCwgd2l0aERpcmVjdGl2ZXMsIGggfSBmcm9tICd2dWUnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XG4gIG5hbWU6ICdyaXBwbGVhYmxlJyxcblxuICBkaXJlY3RpdmVzOiB7IHJpcHBsZSB9LFxuXG4gIHByb3BzOiB7XG4gICAgcmlwcGxlOiB7XG4gICAgICB0eXBlOiBbQm9vbGVhbiwgT2JqZWN0XSxcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2VuUmlwcGxlIChkYXRhOiBWTm9kZURhdGEgPSB7fSk6IFZOb2RlIHwgbnVsbCB7XG4gICAgICBpZiAoIXRoaXMucmlwcGxlKSByZXR1cm4gbnVsbFxuXG4gICAgICBkYXRhLmNsYXNzID0gJ3YtaW5wdXQtLXNlbGVjdGlvbi1jb250cm9sc19fcmlwcGxlJ1xuXG4gICAgICBjb25zdCBub2RlID0gaCgnZGl2JywgZGF0YSlcblxuICAgICAgY29uc3QgZGlyZWN0aXZlcyA9IGRhdGEuZGlyZWN0aXZlcyB8fCBbXVxuICAgICAgZGVsZXRlIGRhdGEuZGlyZWN0aXZlc1xuXG4gICAgICByZXR1cm4gd2l0aERpcmVjdGl2ZXMobm9kZSwgW1xuICAgICAgICAuLi4oZGlyZWN0aXZlcyksXG4gICAgICAgIFtcbiAgICAgICAgICByaXBwbGUsXG4gICAgICAgICAgeyBjZW50ZXI6IHRydWUgfSxcbiAgICAgICAgICAnJyxcbiAgICAgICAgICB7fVxuICAgICAgICBdXG4gICAgICBdKVxuICAgIH0sXG4gIH0sXG59KVxuIl19