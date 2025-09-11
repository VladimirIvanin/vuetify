import { h, vShow, withDirectives } from 'vue';
import { VExpandTransition } from '../transitions';
// Mixins
import Bootable from '../../mixins/bootable';
import Colorable from '../../mixins/colorable';
import { inject as RegistrableInject } from '../../mixins/registrable';
// Utilities
import { getSlot } from '../../util/helpers';
import mixins from '../../util/mixins';
const baseMixins = mixins(Bootable, Colorable, RegistrableInject('expansionPanel', 'v-expansion-panel-content', 'v-expansion-panel'));
/* @vue/component */
export default baseMixins.extend({
    name: 'v-expansion-panel-content',
    data: () => ({
        isActive: false,
    }),
    computed: {
        parentIsActive() {
            return this.expansionPanel.isActive;
        },
    },
    watch: {
        parentIsActive: {
            immediate: true,
            handler(val, oldVal) {
                if (val)
                    this.isBooted = true;
                if (oldVal == null)
                    this.isActive = val;
                else
                    this.$nextTick(() => this.isActive = val);
            },
        },
    },
    created() {
        this.expansionPanel.registerContent(this);
    },
    beforeUnmount() {
        this.expansionPanel.unregisterContent();
    },
    render() {
        return h(VExpandTransition, {}, () => this.showLazyContent(() => [
            withDirectives(h('div', this.setBackgroundColor(this.color, {
                class: 'v-expansion-panel-content'
            }), [
                h('div', { class: 'v-expansion-panel-content__wrap' }, getSlot(this, 'default', { open: this.isActive })),
            ]), [
                [
                    vShow,
                    this.isActive
                ]
            ]),
        ]));
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkV4cGFuc2lvblBhbmVsQ29udGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZFeHBhbnNpb25QYW5lbC9WRXhwYW5zaW9uUGFuZWxDb250ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBQyxNQUFNLEtBQUssQ0FBQTtBQUc1QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUVsRCxTQUFTO0FBQ1QsT0FBTyxRQUFRLE1BQU0sdUJBQXVCLENBQUE7QUFDNUMsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxFQUFFLE1BQU0sSUFBSSxpQkFBaUIsRUFBRSxNQUFNLDBCQUEwQixDQUFBO0FBRXRFLFlBQVk7QUFDWixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDNUMsT0FBTyxNQUFzQixNQUFNLG1CQUFtQixDQUFBO0FBS3RELE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FDdkIsUUFBUSxFQUNSLFNBQVMsRUFDVCxpQkFBaUIsQ0FBd0MsZ0JBQWdCLEVBQUUsMkJBQTJCLEVBQUUsbUJBQW1CLENBQUMsQ0FDN0gsQ0FBQTtBQU1ELG9CQUFvQjtBQUNwQixlQUFlLFVBQVUsQ0FBQyxNQUFNLENBQUM7SUFDL0IsSUFBSSxFQUFFLDJCQUEyQjtJQUVqQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNYLFFBQVEsRUFBRSxLQUFLO0tBQ2hCLENBQUM7SUFFRixRQUFRLEVBQUU7UUFDUixjQUFjO1lBQ1osT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQTtRQUNyQyxDQUFDO0tBQ0Y7SUFFRCxLQUFLLEVBQUU7UUFDTCxjQUFjLEVBQUU7WUFDZCxTQUFTLEVBQUUsSUFBSTtZQUNmLE9BQU8sQ0FBRSxHQUFHLEVBQUUsTUFBTTtnQkFDbEIsSUFBSSxHQUFHO29CQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO2dCQUU3QixJQUFJLE1BQU0sSUFBSSxJQUFJO29CQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFBOztvQkFDbEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFBO1lBQ2hELENBQUM7U0FDRjtLQUNGO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzNDLENBQUM7SUFFRCxhQUFhO1FBQ1gsSUFBSSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0lBQ3pDLENBQUM7SUFFRCxNQUFNO1FBQ0osT0FBTyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDL0QsY0FBYyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQzFELEtBQUssRUFBRSwyQkFBMkI7YUFDbkMsQ0FBQyxFQUFFO2dCQUNGLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsaUNBQWlDLEVBQUUsRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQzthQUMxRyxDQUFDLEVBQUU7Z0JBQ0Y7b0JBQ0UsS0FBSztvQkFDTCxJQUFJLENBQUMsUUFBUTtpQkFDZDthQUNGLENBQUM7U0FDSCxDQUFDLENBQUMsQ0FBQTtJQUNMLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2gsIHZTaG93LCB3aXRoRGlyZWN0aXZlc30gZnJvbSAndnVlJ1xuLy8gQ29tcG9uZW50c1xuaW1wb3J0IFZFeHBhbnNpb25QYW5lbCBmcm9tICcuL1ZFeHBhbnNpb25QYW5lbCdcbmltcG9ydCB7IFZFeHBhbmRUcmFuc2l0aW9uIH0gZnJvbSAnLi4vdHJhbnNpdGlvbnMnXG5cbi8vIE1peGluc1xuaW1wb3J0IEJvb3RhYmxlIGZyb20gJy4uLy4uL21peGlucy9ib290YWJsZSdcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcbmltcG9ydCB7IGluamVjdCBhcyBSZWdpc3RyYWJsZUluamVjdCB9IGZyb20gJy4uLy4uL21peGlucy9yZWdpc3RyYWJsZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBnZXRTbG90IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IG1peGlucywgeyBFeHRyYWN0VnVlIH0gZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgVnVlLCB7IFZOb2RlLCBWdWVDb25zdHJ1Y3RvciB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgYmFzZU1peGlucyA9IG1peGlucyhcbiAgQm9vdGFibGUsXG4gIENvbG9yYWJsZSxcbiAgUmVnaXN0cmFibGVJbmplY3Q8J2V4cGFuc2lvblBhbmVsJywgVnVlQ29uc3RydWN0b3I8VnVlPj4oJ2V4cGFuc2lvblBhbmVsJywgJ3YtZXhwYW5zaW9uLXBhbmVsLWNvbnRlbnQnLCAndi1leHBhbnNpb24tcGFuZWwnKVxuKVxuXG5pbnRlcmZhY2Ugb3B0aW9ucyBleHRlbmRzIEV4dHJhY3RWdWU8dHlwZW9mIGJhc2VNaXhpbnM+IHtcbiAgZXhwYW5zaW9uUGFuZWw6IEluc3RhbmNlVHlwZTx0eXBlb2YgVkV4cGFuc2lvblBhbmVsPlxufVxuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgYmFzZU1peGlucy5leHRlbmQoe1xuICBuYW1lOiAndi1leHBhbnNpb24tcGFuZWwtY29udGVudCcsXG5cbiAgZGF0YTogKCkgPT4gKHtcbiAgICBpc0FjdGl2ZTogZmFsc2UsXG4gIH0pLFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgcGFyZW50SXNBY3RpdmUgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuZXhwYW5zaW9uUGFuZWwuaXNBY3RpdmVcbiAgICB9LFxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgcGFyZW50SXNBY3RpdmU6IHtcbiAgICAgIGltbWVkaWF0ZTogdHJ1ZSxcbiAgICAgIGhhbmRsZXIgKHZhbCwgb2xkVmFsKSB7XG4gICAgICAgIGlmICh2YWwpIHRoaXMuaXNCb290ZWQgPSB0cnVlXG5cbiAgICAgICAgaWYgKG9sZFZhbCA9PSBudWxsKSB0aGlzLmlzQWN0aXZlID0gdmFsXG4gICAgICAgIGVsc2UgdGhpcy4kbmV4dFRpY2soKCkgPT4gdGhpcy5pc0FjdGl2ZSA9IHZhbClcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcblxuICBjcmVhdGVkICgpIHtcbiAgICB0aGlzLmV4cGFuc2lvblBhbmVsLnJlZ2lzdGVyQ29udGVudCh0aGlzKVxuICB9LFxuXG4gIGJlZm9yZVVubW91bnQgKCkge1xuICAgIHRoaXMuZXhwYW5zaW9uUGFuZWwudW5yZWdpc3RlckNvbnRlbnQoKVxuICB9LFxuXG4gIHJlbmRlciAoKTogVk5vZGUge1xuICAgIHJldHVybiBoKFZFeHBhbmRUcmFuc2l0aW9uLCB7fSwgKCkgPT4gdGhpcy5zaG93TGF6eUNvbnRlbnQoKCkgPT4gW1xuICAgICAgd2l0aERpcmVjdGl2ZXMoaCgnZGl2JywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb2xvciwge1xuICAgICAgICBjbGFzczogJ3YtZXhwYW5zaW9uLXBhbmVsLWNvbnRlbnQnXG4gICAgICB9KSwgW1xuICAgICAgICBoKCdkaXYnLCB7IGNsYXNzOiAndi1leHBhbnNpb24tcGFuZWwtY29udGVudF9fd3JhcCcgfSwgZ2V0U2xvdCh0aGlzLCAnZGVmYXVsdCcsIHsgb3BlbjogdGhpcy5pc0FjdGl2ZSB9KSksXG4gICAgICBdKSwgW1xuICAgICAgICBbXG4gICAgICAgICAgdlNob3csXG4gICAgICAgICAgdGhpcy5pc0FjdGl2ZVxuICAgICAgICBdXG4gICAgICBdKSxcbiAgICBdKSlcbiAgfSxcbn0pXG4iXX0=