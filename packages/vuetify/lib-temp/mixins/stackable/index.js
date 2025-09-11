import { defineComponent } from 'vue';
import { getZIndex } from '../../util/helpers';
/* @vue/component */
export default defineComponent({
    name: 'stackable',
    data() {
        return {
            stackElement: null,
            stackExclude: null,
            stackMinZIndex: 0,
            isActive: false,
        };
    },
    computed: {
        activeZIndex() {
            if (typeof window === 'undefined')
                return 0;
            const content = this.stackElement || this.$refs.content;
            // Return current zindex if not active
            const index = !this.isActive
                ? getZIndex(content)
                : this.getMaxZIndex(this.stackExclude || [content]) + 2;
            if (index == null)
                return index;
            // Return max current z-index (excluding self) + 2
            // (2 to leave room for an overlay below, if needed)
            return parseInt(index);
        },
    },
    methods: {
        getMaxZIndex(exclude = []) {
            const base = this.$el;
            // Start with lowest allowed z-index or z-index of
            // base component's element, whichever is greater
            const zis = [this.stackMinZIndex, getZIndex(base)];
            // Convert the NodeList to an array to
            // prevent an Edge bug with Symbol.iterator
            // https://github.com/vuetifyjs/vuetify/issues/2146
            const activeElements = [
                ...document.getElementsByClassName('v-menu__content--active'),
                ...document.getElementsByClassName('v-dialog__content--active'),
            ];
            // Get z-index for all active dialogs
            for (let index = 0; index < activeElements.length; index++) {
                if (!exclude.includes(activeElements[index])) {
                    zis.push(getZIndex(activeElements[index]));
                }
            }
            return Math.max(...zis);
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3N0YWNrYWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sS0FBSyxDQUFBO0FBRW5DLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQVE5QyxvQkFBb0I7QUFDcEIsZUFBZSxlQUFlLENBQUM7SUFDN0IsSUFBSSxFQUFFLFdBQVc7SUFFakIsSUFBSTtRQUNGLE9BQU87WUFDTCxZQUFZLEVBQUUsSUFBc0I7WUFDcEMsWUFBWSxFQUFFLElBQXdCO1lBQ3RDLGNBQWMsRUFBRSxDQUFDO1lBQ2pCLFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUE7SUFDSCxDQUFDO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsWUFBWTtZQUNWLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVztnQkFBRSxPQUFPLENBQUMsQ0FBQTtZQUUzQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFBO1lBQ3ZELHNDQUFzQztZQUV0QyxNQUFNLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRO2dCQUMxQixDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztnQkFDcEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBRXpELElBQUksS0FBSyxJQUFJLElBQUk7Z0JBQUUsT0FBTyxLQUFLLENBQUE7WUFFL0Isa0RBQWtEO1lBQ2xELG9EQUFvRDtZQUNwRCxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUN4QixDQUFDO0tBQ0Y7SUFDRCxPQUFPLEVBQUU7UUFDUCxZQUFZLENBQUUsVUFBcUIsRUFBRTtZQUNuQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFBO1lBQ3JCLGtEQUFrRDtZQUNsRCxpREFBaUQ7WUFDakQsTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1lBQ2xELHNDQUFzQztZQUN0QywyQ0FBMkM7WUFDM0MsbURBQW1EO1lBQ25ELE1BQU0sY0FBYyxHQUFHO2dCQUNyQixHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyx5QkFBeUIsQ0FBQztnQkFDN0QsR0FBRyxRQUFRLENBQUMsc0JBQXNCLENBQUMsMkJBQTJCLENBQUM7YUFDaEUsQ0FBQTtZQUVELHFDQUFxQztZQUNyQyxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDMUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7b0JBQzVDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7aUJBQzNDO2FBQ0Y7WUFFRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQTtRQUN6QixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2RlZmluZUNvbXBvbmVudH0gZnJvbSAndnVlJ1xuXG5pbXBvcnQgeyBnZXRaSW5kZXggfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgVnVlIHtcbiAgJHJlZnM6IHtcbiAgICBjb250ZW50OiBFbGVtZW50XG4gIH1cbn1cblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XG4gIG5hbWU6ICdzdGFja2FibGUnLFxuXG4gIGRhdGEgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzdGFja0VsZW1lbnQ6IG51bGwgYXMgRWxlbWVudCB8IG51bGwsXG4gICAgICBzdGFja0V4Y2x1ZGU6IG51bGwgYXMgRWxlbWVudFtdIHwgbnVsbCxcbiAgICAgIHN0YWNrTWluWkluZGV4OiAwLFxuICAgICAgaXNBY3RpdmU6IGZhbHNlLFxuICAgIH1cbiAgfSxcbiAgY29tcHV0ZWQ6IHtcbiAgICBhY3RpdmVaSW5kZXggKCk6IG51bWJlciB7XG4gICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiAwXG5cbiAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLnN0YWNrRWxlbWVudCB8fCB0aGlzLiRyZWZzLmNvbnRlbnRcbiAgICAgIC8vIFJldHVybiBjdXJyZW50IHppbmRleCBpZiBub3QgYWN0aXZlXG5cbiAgICAgIGNvbnN0IGluZGV4ID0gIXRoaXMuaXNBY3RpdmVcbiAgICAgICAgPyBnZXRaSW5kZXgoY29udGVudClcbiAgICAgICAgOiB0aGlzLmdldE1heFpJbmRleCh0aGlzLnN0YWNrRXhjbHVkZSB8fCBbY29udGVudF0pICsgMlxuXG4gICAgICBpZiAoaW5kZXggPT0gbnVsbCkgcmV0dXJuIGluZGV4XG5cbiAgICAgIC8vIFJldHVybiBtYXggY3VycmVudCB6LWluZGV4IChleGNsdWRpbmcgc2VsZikgKyAyXG4gICAgICAvLyAoMiB0byBsZWF2ZSByb29tIGZvciBhbiBvdmVybGF5IGJlbG93LCBpZiBuZWVkZWQpXG4gICAgICByZXR1cm4gcGFyc2VJbnQoaW5kZXgpXG4gICAgfSxcbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGdldE1heFpJbmRleCAoZXhjbHVkZTogRWxlbWVudFtdID0gW10pIHtcbiAgICAgIGNvbnN0IGJhc2UgPSB0aGlzLiRlbFxuICAgICAgLy8gU3RhcnQgd2l0aCBsb3dlc3QgYWxsb3dlZCB6LWluZGV4IG9yIHotaW5kZXggb2ZcbiAgICAgIC8vIGJhc2UgY29tcG9uZW50J3MgZWxlbWVudCwgd2hpY2hldmVyIGlzIGdyZWF0ZXJcbiAgICAgIGNvbnN0IHppcyA9IFt0aGlzLnN0YWNrTWluWkluZGV4LCBnZXRaSW5kZXgoYmFzZSldXG4gICAgICAvLyBDb252ZXJ0IHRoZSBOb2RlTGlzdCB0byBhbiBhcnJheSB0b1xuICAgICAgLy8gcHJldmVudCBhbiBFZGdlIGJ1ZyB3aXRoIFN5bWJvbC5pdGVyYXRvclxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Z1ZXRpZnlqcy92dWV0aWZ5L2lzc3Vlcy8yMTQ2XG4gICAgICBjb25zdCBhY3RpdmVFbGVtZW50cyA9IFtcbiAgICAgICAgLi4uZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndi1tZW51X19jb250ZW50LS1hY3RpdmUnKSxcbiAgICAgICAgLi4uZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndi1kaWFsb2dfX2NvbnRlbnQtLWFjdGl2ZScpLFxuICAgICAgXVxuXG4gICAgICAvLyBHZXQgei1pbmRleCBmb3IgYWxsIGFjdGl2ZSBkaWFsb2dzXG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgYWN0aXZlRWxlbWVudHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGlmICghZXhjbHVkZS5pbmNsdWRlcyhhY3RpdmVFbGVtZW50c1tpbmRleF0pKSB7XG4gICAgICAgICAgemlzLnB1c2goZ2V0WkluZGV4KGFjdGl2ZUVsZW1lbnRzW2luZGV4XSkpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIE1hdGgubWF4KC4uLnppcylcbiAgICB9LFxuICB9LFxufSlcbiJdfQ==