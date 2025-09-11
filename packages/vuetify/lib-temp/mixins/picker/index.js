// Components
import VPicker from '../../components/VPicker';
// Mixins
import Colorable from '../colorable';
import Elevatable from '../../mixins/elevatable';
import Themeable from '../themeable';
// Utils
import mixins from '../../util/mixins';
import { getSlot } from '../../util/helpers';
// Types
import { h } from 'vue';
export default mixins(Colorable, Elevatable, Themeable
/* @vue/component */
).extend({
    name: 'picker',
    props: {
        flat: Boolean,
        fullWidth: Boolean,
        headerColor: String,
        landscape: Boolean,
        noTitle: Boolean,
        width: {
            type: [Number, String],
            default: 290,
        },
    },
    methods: {
        genPickerTitle() {
            return null;
        },
        genPickerBody() {
            return null;
        },
        genPickerActionsSlot() {
            return this.$slots.default ? this.$slots.default({
                save: this.save,
                cancel: this.cancel,
            }) : getSlot(this);
        },
        genPicker(staticClass) {
            const children = {};
            if (!this.noTitle) {
                const title = this.genPickerTitle();
                title && (children.title = () => [title]);
            }
            const body = this.genPickerBody();
            body && (children.default = () => [body]);
            children.actions = () => [this.genPickerActionsSlot()];
            return h(VPicker, {
                class: staticClass,
                color: this.headerColor || this.color,
                dark: this.dark,
                elevation: this.elevation,
                flat: this.flat,
                fullWidth: this.fullWidth,
                landscape: this.landscape,
                light: this.light,
                width: this.width,
                noTitle: this.noTitle
            }, children);
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3BpY2tlci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhO0FBQ2IsT0FBTyxPQUFPLE1BQU0sMEJBQTBCLENBQUE7QUFFOUMsU0FBUztBQUNULE9BQU8sU0FBUyxNQUFNLGNBQWMsQ0FBQTtBQUNwQyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFNBQVMsTUFBTSxjQUFjLENBQUE7QUFFcEMsUUFBUTtBQUNSLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBQ3RDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUU1QyxRQUFRO0FBQ1IsT0FBTyxFQUFTLENBQUMsRUFBRSxNQUFNLEtBQUssQ0FBQTtBQUU5QixlQUFlLE1BQU0sQ0FDbkIsU0FBUyxFQUNULFVBQVUsRUFDVixTQUFTO0FBQ1gsb0JBQW9CO0NBQ25CLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLFFBQVE7SUFFZCxLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUUsT0FBTztRQUNiLFNBQVMsRUFBRSxPQUFPO1FBQ2xCLFdBQVcsRUFBRSxNQUFNO1FBQ25CLFNBQVMsRUFBRSxPQUFPO1FBQ2xCLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLEdBQUc7U0FDYjtLQUNGO0lBRUQsT0FBTyxFQUFFO1FBQ1AsY0FBYztZQUNaLE9BQU8sSUFBSSxDQUFBO1FBQ2IsQ0FBQztRQUNELGFBQWE7WUFDWCxPQUFPLElBQUksQ0FBQTtRQUNiLENBQUM7UUFDRCxvQkFBb0I7WUFDbEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7Z0JBQy9DLElBQUksRUFBRyxJQUFZLENBQUMsSUFBSTtnQkFDeEIsTUFBTSxFQUFHLElBQVksQ0FBQyxNQUFNO2FBQzdCLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3BCLENBQUM7UUFDRCxTQUFTLENBQUUsV0FBbUI7WUFDNUIsTUFBTSxRQUFRLEdBQXdCLEVBQUUsQ0FBQTtZQUV4QyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDakIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFBO2dCQUNuQyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTthQUMxQztZQUVELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtZQUNqQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtZQUV6QyxRQUFRLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQTtZQUV0RCxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ2hCLEtBQUssRUFBRSxXQUFXO2dCQUNsQixLQUFLLEVBQUUsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsS0FBSztnQkFDckMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNmLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDekIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNmLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDekIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO2dCQUN6QixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDakIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO2FBQ3RCLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFDZCxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb21wb25lbnRzXG5pbXBvcnQgVlBpY2tlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL1ZQaWNrZXInXG5cbi8vIE1peGluc1xuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi9jb2xvcmFibGUnXG5pbXBvcnQgRWxldmF0YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvZWxldmF0YWJsZSdcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vdGhlbWVhYmxlJ1xuXG4vLyBVdGlsc1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IGdldFNsb3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSwgaCB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxuICBDb2xvcmFibGUsXG4gIEVsZXZhdGFibGUsXG4gIFRoZW1lYWJsZVxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3BpY2tlcicsXG5cbiAgcHJvcHM6IHtcbiAgICBmbGF0OiBCb29sZWFuLFxuICAgIGZ1bGxXaWR0aDogQm9vbGVhbixcbiAgICBoZWFkZXJDb2xvcjogU3RyaW5nLFxuICAgIGxhbmRzY2FwZTogQm9vbGVhbixcbiAgICBub1RpdGxlOiBCb29sZWFuLFxuICAgIHdpZHRoOiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogMjkwLFxuICAgIH0sXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGdlblBpY2tlclRpdGxlICgpOiBWTm9kZSB8IG51bGwge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9LFxuICAgIGdlblBpY2tlckJvZHkgKCk6IFZOb2RlIHwgbnVsbCB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH0sXG4gICAgZ2VuUGlja2VyQWN0aW9uc1Nsb3QgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJHNsb3RzLmRlZmF1bHQgPyB0aGlzLiRzbG90cy5kZWZhdWx0KHtcbiAgICAgICAgc2F2ZTogKHRoaXMgYXMgYW55KS5zYXZlLFxuICAgICAgICBjYW5jZWw6ICh0aGlzIGFzIGFueSkuY2FuY2VsLFxuICAgICAgfSkgOiBnZXRTbG90KHRoaXMpXG4gICAgfSxcbiAgICBnZW5QaWNrZXIgKHN0YXRpY0NsYXNzOiBzdHJpbmcpIHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge31cblxuICAgICAgaWYgKCF0aGlzLm5vVGl0bGUpIHtcbiAgICAgICAgY29uc3QgdGl0bGUgPSB0aGlzLmdlblBpY2tlclRpdGxlKClcbiAgICAgICAgdGl0bGUgJiYgKGNoaWxkcmVuLnRpdGxlID0gKCkgPT4gW3RpdGxlXSlcbiAgICAgIH1cblxuICAgICAgY29uc3QgYm9keSA9IHRoaXMuZ2VuUGlja2VyQm9keSgpXG4gICAgICBib2R5ICYmIChjaGlsZHJlbi5kZWZhdWx0ID0gKCkgPT4gW2JvZHldKVxuXG4gICAgICBjaGlsZHJlbi5hY3Rpb25zID0gKCkgPT4gW3RoaXMuZ2VuUGlja2VyQWN0aW9uc1Nsb3QoKV1cblxuICAgICAgcmV0dXJuIGgoVlBpY2tlciwge1xuICAgICAgICBjbGFzczogc3RhdGljQ2xhc3MsXG4gICAgICAgIGNvbG9yOiB0aGlzLmhlYWRlckNvbG9yIHx8IHRoaXMuY29sb3IsXG4gICAgICAgIGRhcms6IHRoaXMuZGFyayxcbiAgICAgICAgZWxldmF0aW9uOiB0aGlzLmVsZXZhdGlvbixcbiAgICAgICAgZmxhdDogdGhpcy5mbGF0LFxuICAgICAgICBmdWxsV2lkdGg6IHRoaXMuZnVsbFdpZHRoLFxuICAgICAgICBsYW5kc2NhcGU6IHRoaXMubGFuZHNjYXBlLFxuICAgICAgICBsaWdodDogdGhpcy5saWdodCxcbiAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICAgIG5vVGl0bGU6IHRoaXMubm9UaXRsZVxuICAgICAgfSwgY2hpbGRyZW4pXG4gICAgfSxcbiAgfSxcbn0pXG4iXX0=