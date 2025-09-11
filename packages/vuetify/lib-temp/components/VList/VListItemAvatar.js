// Components
import VAvatar from '../VAvatar';
// Types
import { defineComponent } from 'vue';
/* @vue/component */
export default defineComponent({
    name: 'v-list-item-avatar',
    extends: VAvatar,
    props: {
        horizontal: Boolean,
        size: {
            type: [Number, String],
            default: 40,
        },
    },
    computed: {
        classes() {
            return {
                'v-list-item__avatar--horizontal': this.horizontal,
                ...VAvatar.computed.classes.call(this),
                'v-avatar--tile': this.tile || this.horizontal,
                'v-list-item__avatar': true
            };
        },
    },
    render() {
        return VAvatar.render.call(this);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkxpc3RJdGVtQXZhdGFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkxpc3QvVkxpc3RJdGVtQXZhdGFyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLGFBQWE7QUFDYixPQUFPLE9BQU8sTUFBTSxZQUFZLENBQUE7QUFFaEMsUUFBUTtBQUNSLE9BQU8sRUFBUyxlQUFlLEVBQUUsTUFBTSxLQUFLLENBQUE7QUFFNUMsb0JBQW9CO0FBQ3BCLGVBQWUsZUFBZSxDQUFDO0lBQzdCLElBQUksRUFBRSxvQkFBb0I7SUFDMUIsT0FBTyxFQUFFLE9BQU87SUFFaEIsS0FBSyxFQUFFO1FBQ0wsVUFBVSxFQUFFLE9BQU87UUFDbkIsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsRUFBRTtTQUNaO0tBQ0Y7SUFFRCxRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTztnQkFDTCxpQ0FBaUMsRUFBRSxJQUFJLENBQUMsVUFBVTtnQkFDbEQsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUN0QyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVO2dCQUM5QyxxQkFBcUIsRUFBRSxJQUFJO2FBQzVCLENBQUE7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxNQUFNO1FBQ0osT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtofSBmcm9tICd2dWUnXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgVkF2YXRhciBmcm9tICcuLi9WQXZhdGFyJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUsIGRlZmluZUNvbXBvbmVudCB9IGZyb20gJ3Z1ZSdcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XG4gIG5hbWU6ICd2LWxpc3QtaXRlbS1hdmF0YXInLFxuICBleHRlbmRzOiBWQXZhdGFyLFxuXG4gIHByb3BzOiB7XG4gICAgaG9yaXpvbnRhbDogQm9vbGVhbixcbiAgICBzaXplOiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogNDAsXG4gICAgfSxcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAndi1saXN0LWl0ZW1fX2F2YXRhci0taG9yaXpvbnRhbCc6IHRoaXMuaG9yaXpvbnRhbCxcbiAgICAgICAgLi4uVkF2YXRhci5jb21wdXRlZC5jbGFzc2VzLmNhbGwodGhpcyksXG4gICAgICAgICd2LWF2YXRhci0tdGlsZSc6IHRoaXMudGlsZSB8fCB0aGlzLmhvcml6b250YWwsXG4gICAgICAgICd2LWxpc3QtaXRlbV9fYXZhdGFyJzogdHJ1ZVxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgcmV0dXJuIFZBdmF0YXIucmVuZGVyLmNhbGwodGhpcylcbiAgfSxcbn0pXG4iXX0=