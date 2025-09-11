import { h } from 'vue';
// Extensions
import { BaseSlideGroup } from '../VSlideGroup/VSlideGroup';
// Mixins
import Themeable from '../../mixins/themeable';
import SSRBootable from '../../mixins/ssr-bootable';
// Utilities
import mixins from '../../util/mixins';
export default mixins(BaseSlideGroup, SSRBootable, Themeable
/* @vue/component */
).extend({
    name: 'v-tabs-bar',
    provide() {
        return {
            tabsBar: this,
        };
    },
    computed: {
        classes() {
            return {
                ...BaseSlideGroup.computed.classes.call(this),
                'v-tabs-bar': true,
                'v-tabs-bar--is-mobile': this.isMobile,
                // TODO: Remove this and move to v-slide-group
                'v-tabs-bar--show-arrows': this.showArrows,
                ...this.themeClasses,
            };
        },
    },
    watch: {
        items: 'callSlider',
        internalValue: 'callSlider',
        $route: 'onRouteChange',
    },
    methods: {
        callSlider() {
            if (!this.isBooted)
                return;
            this.$emit('call:slider');
        },
        genContent() {
            const render = BaseSlideGroup.methods.genContent.call(this);
            render.props.class += ' v-tabs-bar__content';
            return render;
        },
        onRouteChange(val, oldVal) {
            /* istanbul ignore next */
            if (this.mandatory)
                return;
            const items = this.items;
            const newPath = val.path;
            const oldPath = oldVal.path;
            let hasNew = false;
            let hasOld = false;
            for (const item of items) {
                if (item.to === oldPath)
                    hasOld = true;
                else if (item.to === newPath)
                    hasNew = true;
                if (hasNew && hasOld)
                    break;
            }
            // If we have an old item and not a new one
            // it's assumed that the user navigated to
            // a path that is not present in the items
            if (!hasNew && hasOld)
                this.internalValue = undefined;
        },
    },
    render() {
        const render = BaseSlideGroup.render.call(this, h);
        render.role = 'tablist';
        return render;
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRhYnNCYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WVGFicy9WVGFic0Jhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsQ0FBQyxFQUFTLE1BQU0sS0FBSyxDQUFBO0FBQzlCLGFBQWE7QUFDYixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNEJBQTRCLENBQUE7QUFLM0QsU0FBUztBQUNULE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sV0FBVyxNQUFNLDJCQUEyQixDQUFBO0FBRW5ELFlBQVk7QUFDWixPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQU90QyxlQUFlLE1BQU0sQ0FDbkIsY0FBYyxFQUNkLFdBQVcsRUFDWCxTQUFTO0FBQ1Qsb0JBQW9CO0NBQ3JCLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLFlBQVk7SUFFbEIsT0FBTztRQUNMLE9BQU87WUFDTCxPQUFPLEVBQUUsSUFBSTtTQUNkLENBQUE7SUFDSCxDQUFDO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUM3QyxZQUFZLEVBQUUsSUFBSTtnQkFDbEIsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ3RDLDhDQUE4QztnQkFDOUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLFVBQVU7Z0JBQzFDLEdBQUcsSUFBSSxDQUFDLFlBQVk7YUFDckIsQ0FBQTtRQUNILENBQUM7S0FDRjtJQUVELEtBQUssRUFBRTtRQUNMLEtBQUssRUFBRSxZQUFZO1FBQ25CLGFBQWEsRUFBRSxZQUFZO1FBQzNCLE1BQU0sRUFBRSxlQUFlO0tBQ3hCO0lBRUQsT0FBTyxFQUFFO1FBQ1AsVUFBVTtZQUNSLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTtnQkFBRSxPQUFNO1lBRTFCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUE7UUFDM0IsQ0FBQztRQUNELFVBQVU7WUFDUixNQUFNLE1BQU0sR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7WUFFM0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksc0JBQXNCLENBQUE7WUFFNUMsT0FBTyxNQUFNLENBQUE7UUFDZixDQUFDO1FBQ0QsYUFBYSxDQUNYLEdBQTRCLEVBQzVCLE1BQStCO1lBRS9CLDBCQUEwQjtZQUMxQixJQUFJLElBQUksQ0FBQyxTQUFTO2dCQUFFLE9BQU07WUFFMUIsTUFBTSxLQUFLLEdBQUksSUFBSSxDQUFDLEtBQW1DLENBQUE7WUFDdkQsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQTtZQUN4QixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFBO1lBRTNCLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQTtZQUNsQixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUE7WUFFbEIsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7Z0JBQ3hCLElBQUksSUFBSSxDQUFDLEVBQUUsS0FBSyxPQUFPO29CQUFFLE1BQU0sR0FBRyxJQUFJLENBQUE7cUJBQ2pDLElBQUksSUFBSSxDQUFDLEVBQUUsS0FBSyxPQUFPO29CQUFFLE1BQU0sR0FBRyxJQUFJLENBQUE7Z0JBRTNDLElBQUksTUFBTSxJQUFJLE1BQU07b0JBQUUsTUFBSzthQUM1QjtZQUVELDJDQUEyQztZQUMzQywwQ0FBMEM7WUFDMUMsMENBQTBDO1lBQzFDLElBQUksQ0FBQyxNQUFNLElBQUksTUFBTTtnQkFBRSxJQUFJLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQTtRQUN2RCxDQUFDO0tBQ0Y7SUFFRCxNQUFNO1FBQ0osTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBRWxELE1BQU0sQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFBO1FBRXZCLE9BQU8sTUFBTSxDQUFBO0lBQ2YsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGgsIFZOb2RlIH0gZnJvbSAndnVlJ1xuLy8gRXh0ZW5zaW9uc1xuaW1wb3J0IHsgQmFzZVNsaWRlR3JvdXAgfSBmcm9tICcuLi9WU2xpZGVHcm91cC9WU2xpZGVHcm91cCdcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IFZUYWIgZnJvbSAnLi9WVGFiJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcbmltcG9ydCBTU1JCb290YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvc3NyLWJvb3RhYmxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBSb3V0ZUxvY2F0aW9uTm9ybWFsaXplZCB9IGZyb20gJ3Z1ZS1yb3V0ZXInXG5cbnR5cGUgVlRhYkluc3RhbmNlID0gSW5zdGFuY2VUeXBlPHR5cGVvZiBWVGFiPlxuXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXG4gIEJhc2VTbGlkZUdyb3VwLFxuICBTU1JCb290YWJsZSxcbiAgVGhlbWVhYmxlXG4gIC8qIEB2dWUvY29tcG9uZW50ICovXG4pLmV4dGVuZCh7XG4gIG5hbWU6ICd2LXRhYnMtYmFyJyxcblxuICBwcm92aWRlICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGFic0JhcjogdGhpcyxcbiAgICB9XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjbGFzc2VzICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLkJhc2VTbGlkZUdyb3VwLmNvbXB1dGVkLmNsYXNzZXMuY2FsbCh0aGlzKSxcbiAgICAgICAgJ3YtdGFicy1iYXInOiB0cnVlLFxuICAgICAgICAndi10YWJzLWJhci0taXMtbW9iaWxlJzogdGhpcy5pc01vYmlsZSxcbiAgICAgICAgLy8gVE9ETzogUmVtb3ZlIHRoaXMgYW5kIG1vdmUgdG8gdi1zbGlkZS1ncm91cFxuICAgICAgICAndi10YWJzLWJhci0tc2hvdy1hcnJvd3MnOiB0aGlzLnNob3dBcnJvd3MsXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzLFxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBpdGVtczogJ2NhbGxTbGlkZXInLFxuICAgIGludGVybmFsVmFsdWU6ICdjYWxsU2xpZGVyJyxcbiAgICAkcm91dGU6ICdvblJvdXRlQ2hhbmdlJyxcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgY2FsbFNsaWRlciAoKSB7XG4gICAgICBpZiAoIXRoaXMuaXNCb290ZWQpIHJldHVyblxuXG4gICAgICB0aGlzLiRlbWl0KCdjYWxsOnNsaWRlcicpXG4gICAgfSxcbiAgICBnZW5Db250ZW50ICgpIHtcbiAgICAgIGNvbnN0IHJlbmRlciA9IEJhc2VTbGlkZUdyb3VwLm1ldGhvZHMuZ2VuQ29udGVudC5jYWxsKHRoaXMpXG5cbiAgICAgIHJlbmRlci5wcm9wcy5jbGFzcyArPSAnIHYtdGFicy1iYXJfX2NvbnRlbnQnXG5cbiAgICAgIHJldHVybiByZW5kZXJcbiAgICB9LFxuICAgIG9uUm91dGVDaGFuZ2UgKFxuICAgICAgdmFsOiBSb3V0ZUxvY2F0aW9uTm9ybWFsaXplZCxcbiAgICAgIG9sZFZhbDogUm91dGVMb2NhdGlvbk5vcm1hbGl6ZWRcbiAgICApIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICBpZiAodGhpcy5tYW5kYXRvcnkpIHJldHVyblxuXG4gICAgICBjb25zdCBpdGVtcyA9ICh0aGlzLml0ZW1zIGFzIHVua25vd24pIGFzIFZUYWJJbnN0YW5jZVtdXG4gICAgICBjb25zdCBuZXdQYXRoID0gdmFsLnBhdGhcbiAgICAgIGNvbnN0IG9sZFBhdGggPSBvbGRWYWwucGF0aFxuXG4gICAgICBsZXQgaGFzTmV3ID0gZmFsc2VcbiAgICAgIGxldCBoYXNPbGQgPSBmYWxzZVxuXG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICAgICAgaWYgKGl0ZW0udG8gPT09IG9sZFBhdGgpIGhhc09sZCA9IHRydWVcbiAgICAgICAgZWxzZSBpZiAoaXRlbS50byA9PT0gbmV3UGF0aCkgaGFzTmV3ID0gdHJ1ZVxuXG4gICAgICAgIGlmIChoYXNOZXcgJiYgaGFzT2xkKSBicmVha1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB3ZSBoYXZlIGFuIG9sZCBpdGVtIGFuZCBub3QgYSBuZXcgb25lXG4gICAgICAvLyBpdCdzIGFzc3VtZWQgdGhhdCB0aGUgdXNlciBuYXZpZ2F0ZWQgdG9cbiAgICAgIC8vIGEgcGF0aCB0aGF0IGlzIG5vdCBwcmVzZW50IGluIHRoZSBpdGVtc1xuICAgICAgaWYgKCFoYXNOZXcgJiYgaGFzT2xkKSB0aGlzLmludGVybmFsVmFsdWUgPSB1bmRlZmluZWRcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoKTogVk5vZGUge1xuICAgIGNvbnN0IHJlbmRlciA9IEJhc2VTbGlkZUdyb3VwLnJlbmRlci5jYWxsKHRoaXMsIGgpXG5cbiAgICByZW5kZXIucm9sZSA9ICd0YWJsaXN0J1xuXG4gICAgcmV0dXJuIHJlbmRlclxuICB9LFxufSlcbiJdfQ==