// Types
import { defineComponent, h } from 'vue';
export default function VGrid(name) {
    /* @vue/component */
    return defineComponent({
        name: `v-${name}`,
        functional: true,
        props: {
            id: String,
            tag: {
                type: String,
                default: 'div',
            },
        },
        render() {
            const data = this.$attrs;
            const children = this.$slots.default();
            const props = this.$props;
            data.staticClass = (`${name} ${data.staticClass || ''}`).trim();
            const { attrs } = data;
            if (attrs) {
                // reset attrs to extract utility clases like pa-3
                data.attrs = {};
                const classes = Object.keys(attrs).filter(key => {
                    // TODO: Remove once resolved
                    // https://github.com/vuejs/vue/issues/7841
                    if (key === 'slot')
                        return false;
                    const value = attrs[key];
                    // add back data attributes like data-test="foo" but do not
                    // add them as classes
                    if (key.startsWith('data-')) {
                        data.attrs[key] = value;
                        return false;
                    }
                    return value || typeof value === 'string';
                });
                if (classes.length)
                    data.staticClass += ` ${classes.join(' ')}`;
            }
            if (props.id) {
                data.domProps = data.domProps || {};
                data.domProps.id = props.id;
            }
            return h(props.tag, data, children);
        },
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZHcmlkL2dyaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsUUFBUTtBQUNSLE9BQU8sRUFBRSxlQUFlLEVBQVMsQ0FBQyxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBRS9DLE1BQU0sQ0FBQyxPQUFPLFVBQVUsS0FBSyxDQUFFLElBQVk7SUFDekMsb0JBQW9CO0lBQ3BCLE9BQU8sZUFBZSxDQUFDO1FBQ3JCLElBQUksRUFBRSxLQUFLLElBQUksRUFBRTtRQUVqQixVQUFVLEVBQUUsSUFBSTtRQUVoQixLQUFLLEVBQUU7WUFDTCxFQUFFLEVBQUUsTUFBTTtZQUNWLEdBQUcsRUFBRTtnQkFDSCxJQUFJLEVBQUUsTUFBTTtnQkFDWixPQUFPLEVBQUUsS0FBSzthQUNmO1NBQ0Y7UUFFRCxNQUFNO1lBQ0osTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQTtZQUN4QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO1lBQ3RDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7WUFFekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtZQUUvRCxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFBO1lBQ3RCLElBQUksS0FBSyxFQUFFO2dCQUNULGtEQUFrRDtnQkFDbEQsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUE7Z0JBQ2YsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQzlDLDZCQUE2QjtvQkFDN0IsMkNBQTJDO29CQUMzQyxJQUFJLEdBQUcsS0FBSyxNQUFNO3dCQUFFLE9BQU8sS0FBSyxDQUFBO29CQUVoQyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7b0JBRXhCLDJEQUEyRDtvQkFDM0Qsc0JBQXNCO29CQUN0QixJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7d0JBQzNCLElBQUksQ0FBQyxLQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFBO3dCQUN4QixPQUFPLEtBQUssQ0FBQTtxQkFDYjtvQkFFRCxPQUFPLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUE7Z0JBQzNDLENBQUMsQ0FBQyxDQUFBO2dCQUVGLElBQUksT0FBTyxDQUFDLE1BQU07b0JBQUUsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQTthQUNoRTtZQUVELElBQUksS0FBSyxDQUFDLEVBQUUsRUFBRTtnQkFDWixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFBO2dCQUNuQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFBO2FBQzVCO1lBRUQsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFDckMsQ0FBQztLQUNGLENBQUMsQ0FBQTtBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUeXBlc1xuaW1wb3J0IHsgZGVmaW5lQ29tcG9uZW50LCBWTm9kZSwgaCB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVkdyaWQgKG5hbWU6IHN0cmluZykge1xuICAvKiBAdnVlL2NvbXBvbmVudCAqL1xuICByZXR1cm4gZGVmaW5lQ29tcG9uZW50KHtcbiAgICBuYW1lOiBgdi0ke25hbWV9YCxcblxuICAgIGZ1bmN0aW9uYWw6IHRydWUsXG5cbiAgICBwcm9wczoge1xuICAgICAgaWQ6IFN0cmluZyxcbiAgICAgIHRhZzoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIGRlZmF1bHQ6ICdkaXYnLFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgICBjb25zdCBkYXRhID0gdGhpcy4kYXR0cnNcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy4kc2xvdHMuZGVmYXVsdCgpXG4gICAgICBjb25zdCBwcm9wcyA9IHRoaXMuJHByb3BzXG5cbiAgICAgIGRhdGEuc3RhdGljQ2xhc3MgPSAoYCR7bmFtZX0gJHtkYXRhLnN0YXRpY0NsYXNzIHx8ICcnfWApLnRyaW0oKVxuXG4gICAgICBjb25zdCB7IGF0dHJzIH0gPSBkYXRhXG4gICAgICBpZiAoYXR0cnMpIHtcbiAgICAgICAgLy8gcmVzZXQgYXR0cnMgdG8gZXh0cmFjdCB1dGlsaXR5IGNsYXNlcyBsaWtlIHBhLTNcbiAgICAgICAgZGF0YS5hdHRycyA9IHt9XG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSBPYmplY3Qua2V5cyhhdHRycykuZmlsdGVyKGtleSA9PiB7XG4gICAgICAgICAgLy8gVE9ETzogUmVtb3ZlIG9uY2UgcmVzb2x2ZWRcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdnVlanMvdnVlL2lzc3Vlcy83ODQxXG4gICAgICAgICAgaWYgKGtleSA9PT0gJ3Nsb3QnKSByZXR1cm4gZmFsc2VcblxuICAgICAgICAgIGNvbnN0IHZhbHVlID0gYXR0cnNba2V5XVxuXG4gICAgICAgICAgLy8gYWRkIGJhY2sgZGF0YSBhdHRyaWJ1dGVzIGxpa2UgZGF0YS10ZXN0PVwiZm9vXCIgYnV0IGRvIG5vdFxuICAgICAgICAgIC8vIGFkZCB0aGVtIGFzIGNsYXNzZXNcbiAgICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoJ2RhdGEtJykpIHtcbiAgICAgICAgICAgIGRhdGEuYXR0cnMhW2tleV0gPSB2YWx1ZVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHZhbHVlIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZydcbiAgICAgICAgfSlcblxuICAgICAgICBpZiAoY2xhc3Nlcy5sZW5ndGgpIGRhdGEuc3RhdGljQ2xhc3MgKz0gYCAke2NsYXNzZXMuam9pbignICcpfWBcbiAgICAgIH1cblxuICAgICAgaWYgKHByb3BzLmlkKSB7XG4gICAgICAgIGRhdGEuZG9tUHJvcHMgPSBkYXRhLmRvbVByb3BzIHx8IHt9XG4gICAgICAgIGRhdGEuZG9tUHJvcHMuaWQgPSBwcm9wcy5pZFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaChwcm9wcy50YWcsIGRhdGEsIGNoaWxkcmVuKVxuICAgIH0sXG4gIH0pXG59XG4iXX0=