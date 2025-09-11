// Types
import { defineComponent, h, Comment } from 'vue';
/* @vue/component */
export default defineComponent({
    name: 'v-list-item-action',
    render() {
        var _a, _b;
        const { class: attrClass, ...otherAttrs } = this.$attrs;
        let className = attrClass ? `v-list-item__action ${attrClass}` : 'v-list-item__action';
        const children = ((_b = (_a = this.$slots).default) === null || _b === void 0 ? void 0 : _b.call(_a)) || [];
        const filteredChild = children.filter((vnode) => {
            return (vnode === null || vnode === void 0 ? void 0 : vnode.type) !== Comment && (vnode === null || vnode === void 0 ? void 0 : vnode.children) !== ' ';
        });
        if (filteredChild.length > 1)
            className += ' v-list-item__action--stack';
        return h('div', {
            ...otherAttrs,
            class: className
        }, children);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkxpc3RJdGVtQWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkxpc3QvVkxpc3RJdGVtQWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFFBQVE7QUFDUixPQUFPLEVBQUUsZUFBZSxFQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxLQUFLLENBQUE7QUFFeEQsb0JBQW9CO0FBQ3BCLGVBQWUsZUFBZSxDQUFDO0lBQzdCLElBQUksRUFBRSxvQkFBb0I7SUFFMUIsTUFBTTs7UUFDSixNQUFNLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxHQUFHLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7UUFDdkQsSUFBSSxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFBO1FBQ3RGLE1BQU0sUUFBUSxHQUFHLENBQUEsTUFBQSxNQUFBLElBQUksQ0FBQyxNQUFNLEVBQUMsT0FBTyxrREFBSSxLQUFJLEVBQUUsQ0FBQTtRQUU5QyxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBVSxFQUFFLEVBQUU7WUFDbkQsT0FBTyxDQUFBLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxJQUFJLE1BQUssT0FBTyxJQUFJLENBQUEsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLFFBQVEsTUFBSyxHQUFHLENBQUE7UUFDM0QsQ0FBQyxDQUFDLENBQUE7UUFDRixJQUFJLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUFFLFNBQVMsSUFBSSw2QkFBNkIsQ0FBQTtRQUV4RSxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDZCxHQUFHLFVBQVU7WUFDYixLQUFLLEVBQUUsU0FBUztTQUNqQixFQUFFLFFBQVEsQ0FBQyxDQUFBO0lBQ2QsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFR5cGVzXG5pbXBvcnQgeyBkZWZpbmVDb21wb25lbnQsIFZOb2RlLCBoLCBDb21tZW50IH0gZnJvbSAndnVlJ1xuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29tcG9uZW50KHtcbiAgbmFtZTogJ3YtbGlzdC1pdGVtLWFjdGlvbicsXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgY29uc3QgeyBjbGFzczogYXR0ckNsYXNzLCAuLi5vdGhlckF0dHJzIH0gPSB0aGlzLiRhdHRyc1xuICAgIGxldCBjbGFzc05hbWUgPSBhdHRyQ2xhc3MgPyBgdi1saXN0LWl0ZW1fX2FjdGlvbiAke2F0dHJDbGFzc31gIDogJ3YtbGlzdC1pdGVtX19hY3Rpb24nXG4gICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLiRzbG90cy5kZWZhdWx0Py4oKSB8fCBbXVxuXG4gICAgY29uc3QgZmlsdGVyZWRDaGlsZCA9IGNoaWxkcmVuLmZpbHRlcigodm5vZGU6IGFueSkgPT4ge1xuICAgICAgcmV0dXJuIHZub2RlPy50eXBlICE9PSBDb21tZW50ICYmIHZub2RlPy5jaGlsZHJlbiAhPT0gJyAnXG4gICAgfSlcbiAgICBpZiAoZmlsdGVyZWRDaGlsZC5sZW5ndGggPiAxKSBjbGFzc05hbWUgKz0gJyB2LWxpc3QtaXRlbV9fYWN0aW9uLS1zdGFjaydcblxuICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAuLi5vdGhlckF0dHJzLFxuICAgICAgY2xhc3M6IGNsYXNzTmFtZVxuICAgIH0sIGNoaWxkcmVuKVxuICB9LFxufSlcbiJdfQ==