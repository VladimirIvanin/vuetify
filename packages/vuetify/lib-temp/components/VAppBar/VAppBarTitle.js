import { h } from 'vue';
// Mixins
import { inject } from '../../mixins/registrable';
// Utilities
import { convertToUnit, getSlot } from '../../util/helpers';
import { easeInOutCubic } from '../../services/goto/easing-patterns';
const base = inject('VAppBar', 'v-app-bar-title', 'v-app-bar');
export default {
    name: 'v-app-bar-title',
    extends: base,
    data: () => ({
        contentWidth: 0,
        left: 0,
        width: 0,
    }),
    watch: {
        '$vuetify.breakpoint.width': 'updateDimensions',
    },
    computed: {
        styles() {
            if (!this.contentWidth)
                return {};
            const min = this.width;
            const max = this.contentWidth;
            const ratio = easeInOutCubic(Math.min(1, this.VAppBar.scrollRatio * 1.5));
            return {
                width: convertToUnit(min + (max - min) * ratio),
                visibility: this.VAppBar.scrollRatio ? 'visible' : 'hidden',
            };
        },
    },
    mounted() {
        this.updateDimensions();
    },
    methods: {
        updateDimensions() {
            const dimensions = this.$refs.placeholder.getBoundingClientRect();
            this.width = dimensions.width;
            this.left = dimensions.left;
            this.contentWidth = this.$refs.content.scrollWidth;
        },
    },
    render() {
        return h('div', {
            class: 'v-toolbar__title v-app-bar-title',
        }, [
            h('div', {
                class: 'v-app-bar-title__content',
                style: this.styles,
                ref: 'content',
            }, getSlot(this)),
            h('div', {
                class: 'v-app-bar-title__placeholder',
                style: {
                    visibility: this.VAppBar.scrollRatio ? 'hidden' : 'visible',
                },
                ref: 'placeholder',
            }, getSlot(this)),
        ]);
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkFwcEJhclRpdGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkFwcEJhci9WQXBwQmFyVGl0bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLENBQUMsRUFBQyxNQUFNLEtBQUssQ0FBQTtBQUNyQixTQUFTO0FBQ1QsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLDBCQUEwQixDQUFBO0FBT2pELFlBQVk7QUFDWixPQUFPLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQzNELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQTtBQUVwRSxNQUFNLElBQUksR0FBRyxNQUFNLENBQTRCLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxXQUFXLENBQUMsQ0FBQTtBQVN6RixlQUFlO0lBQ2IsSUFBSSxFQUFFLGlCQUFpQjtJQUN2QixPQUFPLEVBQUUsSUFBSTtJQUViLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsWUFBWSxFQUFFLENBQUM7UUFDZixJQUFJLEVBQUUsQ0FBQztRQUNQLEtBQUssRUFBRSxDQUFDO0tBQ1QsQ0FBQztJQUVGLEtBQUssRUFBRTtRQUNMLDJCQUEyQixFQUFFLGtCQUFrQjtLQUNoRDtJQUVELFFBQVEsRUFBRTtRQUNSLE1BQU07WUFDSixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVk7Z0JBQUUsT0FBTyxFQUFFLENBQUE7WUFFakMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQTtZQUN0QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFBO1lBQzdCLE1BQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFBO1lBQ3pFLE9BQU87Z0JBQ0wsS0FBSyxFQUFFLGFBQWEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO2dCQUMvQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUTthQUM1RCxDQUFBO1FBQ0gsQ0FBQztLQUNGO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO0lBQ3pCLENBQUM7SUFFRCxPQUFPLEVBQUU7UUFDUCxnQkFBZ0I7WUFDZCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO1lBQ2pFLElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQTtZQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUE7WUFDM0IsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUE7UUFDcEQsQ0FBQztLQUNGO0lBRUQsTUFBTTtRQUNKLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUNkLEtBQUssRUFBRSxrQ0FBa0M7U0FDMUMsRUFBRTtZQUNELENBQUMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ1AsS0FBSyxFQUFFLDBCQUEwQjtnQkFDakMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNsQixHQUFHLEVBQUUsU0FBUzthQUNmLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pCLENBQUMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ1AsS0FBSyxFQUFFLDhCQUE4QjtnQkFDckMsS0FBSyxFQUFFO29CQUNMLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTO2lCQUM1RDtnQkFDRCxHQUFHLEVBQUUsYUFBYTthQUNuQixFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNsQixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aH0gZnJvbSAndnVlJ1xuLy8gTWl4aW5zXG5pbXBvcnQgeyBpbmplY3QgfSBmcm9tICcuLi8uLi9taXhpbnMvcmVnaXN0cmFibGUnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7IEV4dHJhY3RWdWUgfSBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCBWQXBwQmFyIGZyb20gJy4vVkFwcEJhcidcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBjb252ZXJ0VG9Vbml0LCBnZXRTbG90IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IHsgZWFzZUluT3V0Q3ViaWMgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9nb3RvL2Vhc2luZy1wYXR0ZXJucydcblxuY29uc3QgYmFzZSA9IGluamVjdDwnVkFwcEJhcicsIHR5cGVvZiBWQXBwQmFyPignVkFwcEJhcicsICd2LWFwcC1iYXItdGl0bGUnLCAndi1hcHAtYmFyJylcblxuaW50ZXJmYWNlIG9wdGlvbnMgZXh0ZW5kcyBFeHRyYWN0VnVlPHR5cGVvZiBiYXNlPiB7XG4gICRyZWZzOiB7XG4gICAgY29udGVudDogRWxlbWVudFxuICAgIHBsYWNlaG9sZGVyOiBFbGVtZW50XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAndi1hcHAtYmFyLXRpdGxlJyxcbiAgZXh0ZW5kczogYmFzZSxcblxuICBkYXRhOiAoKSA9PiAoe1xuICAgIGNvbnRlbnRXaWR0aDogMCxcbiAgICBsZWZ0OiAwLFxuICAgIHdpZHRoOiAwLFxuICB9KSxcblxuICB3YXRjaDoge1xuICAgICckdnVldGlmeS5icmVha3BvaW50LndpZHRoJzogJ3VwZGF0ZURpbWVuc2lvbnMnLFxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgc3R5bGVzICgpOiBvYmplY3Qge1xuICAgICAgaWYgKCF0aGlzLmNvbnRlbnRXaWR0aCkgcmV0dXJuIHt9XG5cbiAgICAgIGNvbnN0IG1pbiA9IHRoaXMud2lkdGhcbiAgICAgIGNvbnN0IG1heCA9IHRoaXMuY29udGVudFdpZHRoXG4gICAgICBjb25zdCByYXRpbyA9IGVhc2VJbk91dEN1YmljKE1hdGgubWluKDEsIHRoaXMuVkFwcEJhci5zY3JvbGxSYXRpbyAqIDEuNSkpXG4gICAgICByZXR1cm4ge1xuICAgICAgICB3aWR0aDogY29udmVydFRvVW5pdChtaW4gKyAobWF4IC0gbWluKSAqIHJhdGlvKSxcbiAgICAgICAgdmlzaWJpbGl0eTogdGhpcy5WQXBwQmFyLnNjcm9sbFJhdGlvID8gJ3Zpc2libGUnIDogJ2hpZGRlbicsXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICBtb3VudGVkICgpIHtcbiAgICB0aGlzLnVwZGF0ZURpbWVuc2lvbnMoKVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICB1cGRhdGVEaW1lbnNpb25zICgpOiB2b2lkIHtcbiAgICAgIGNvbnN0IGRpbWVuc2lvbnMgPSB0aGlzLiRyZWZzLnBsYWNlaG9sZGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICB0aGlzLndpZHRoID0gZGltZW5zaW9ucy53aWR0aFxuICAgICAgdGhpcy5sZWZ0ID0gZGltZW5zaW9ucy5sZWZ0XG4gICAgICB0aGlzLmNvbnRlbnRXaWR0aCA9IHRoaXMuJHJlZnMuY29udGVudC5zY3JvbGxXaWR0aFxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgIGNsYXNzOiAndi10b29sYmFyX190aXRsZSB2LWFwcC1iYXItdGl0bGUnLFxuICAgIH0sIFtcbiAgICAgIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6ICd2LWFwcC1iYXItdGl0bGVfX2NvbnRlbnQnLFxuICAgICAgICBzdHlsZTogdGhpcy5zdHlsZXMsXG4gICAgICAgIHJlZjogJ2NvbnRlbnQnLFxuICAgICAgfSwgZ2V0U2xvdCh0aGlzKSksXG4gICAgICBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiAndi1hcHAtYmFyLXRpdGxlX19wbGFjZWhvbGRlcicsXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgdmlzaWJpbGl0eTogdGhpcy5WQXBwQmFyLnNjcm9sbFJhdGlvID8gJ2hpZGRlbicgOiAndmlzaWJsZScsXG4gICAgICAgIH0sXG4gICAgICAgIHJlZjogJ3BsYWNlaG9sZGVyJyxcbiAgICAgIH0sIGdldFNsb3QodGhpcykpLFxuICAgIF0pXG4gIH0sXG59XG4iXX0=