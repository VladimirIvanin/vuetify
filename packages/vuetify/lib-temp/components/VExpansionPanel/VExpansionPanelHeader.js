import { h, vShow, withDirectives } from 'vue';
// Components
import { VFadeTransition } from '../transitions';
import VIcon from '../VIcon';
// Mixins
import Colorable from '../../mixins/colorable';
import { inject as RegistrableInject } from '../../mixins/registrable';
// Directives
import { Ripple } from '../../directives/ripple';
// Utilities
import { getSlot } from '../../util/helpers';
import mixins from '../../util/mixins';
const baseMixins = mixins(Colorable, RegistrableInject('expansionPanel', 'v-expansion-panel-header', 'v-expansion-panel'));
export default baseMixins.extend({
    name: 'v-expansion-panel-header',
    props: {
        disableIconRotate: Boolean,
        expandIcon: {
            type: String,
            default: '$expand',
        },
        hideActions: Boolean,
        ripple: {
            type: [Boolean, Object],
            default: false,
        },
    },
    data: () => ({
        hasMousedown: false,
    }),
    computed: {
        classes() {
            return {
                'v-expansion-panel-header--active': this.isActive,
                'v-expansion-panel-header--mousedown': this.hasMousedown,
            };
        },
        isActive() {
            return this.expansionPanel.isActive;
        },
        isDisabled() {
            return this.expansionPanel.isDisabled;
        },
        isReadonly() {
            return this.expansionPanel.isReadonly;
        },
    },
    created() {
        this.expansionPanel.registerHeader(this);
    },
    beforeUnmount() {
        this.expansionPanel.unregisterHeader();
    },
    methods: {
        onClick(e) {
            this.$emit('click', e);
            this.$emitLegacy('click', e);
        },
        genIcon() {
            const icon = getSlot(this, 'actions', { open: this.isActive }) ||
                [h(VIcon, {}, () => this.expandIcon)];
            return h(VFadeTransition, {}, () => [
                withDirectives(h('div', {
                    class: ['v-expansion-panel-header__icon', {
                            'v-expansion-panel-header__icon--disable-rotate': this.disableIconRotate,
                        }]
                }, icon), [
                    [
                        vShow,
                        !this.isDisabled
                    ]
                ]),
            ]);
        },
    },
    render() {
        const directives = [
            [
                Ripple,
                this.ripple
            ]
        ];
        return withDirectives(h('button', this.setBackgroundColor(this.color, {
            class: ['v-expansion-panel-header', this.classes],
            tabindex: this.isDisabled ? -1 : null,
            type: 'button',
            'aria-expanded': this.isActive,
            ...this.$listeners,
            onClick: this.onClick,
            onMousedown: () => (this.hasMousedown = true),
            onMouseup: () => (this.hasMousedown = false)
        }), [
            getSlot(this, 'default', { open: this.isActive }, true),
            this.hideActions || this.genIcon(),
        ]), directives);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkV4cGFuc2lvblBhbmVsSGVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkV4cGFuc2lvblBhbmVsL1ZFeHBhbnNpb25QYW5lbEhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUMsTUFBTSxLQUFLLENBQUE7QUFDNUMsYUFBYTtBQUNiLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUVoRCxPQUFPLEtBQUssTUFBTSxVQUFVLENBQUE7QUFFNUIsU0FBUztBQUNULE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sRUFBRSxNQUFNLElBQUksaUJBQWlCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQTtBQUV0RSxhQUFhO0FBQ2IsT0FBZSxFQUFFLE1BQU0sRUFBRSxNQUFNLHlCQUF5QixDQUFBO0FBRXhELFlBQVk7QUFDWixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDNUMsT0FBTyxNQUFzQixNQUFNLG1CQUFtQixDQUFBO0FBS3RELE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FDdkIsU0FBUyxFQUNULGlCQUFpQixDQUF3QyxnQkFBZ0IsRUFBRSwwQkFBMEIsRUFBRSxtQkFBbUIsQ0FBQyxDQUM1SCxDQUFBO0FBT0QsZUFBZSxVQUFVLENBQUMsTUFBTSxDQUFDO0lBQy9CLElBQUksRUFBRSwwQkFBMEI7SUFHaEMsS0FBSyxFQUFFO1FBQ0wsaUJBQWlCLEVBQUUsT0FBTztRQUMxQixVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxTQUFTO1NBQ25CO1FBQ0QsV0FBVyxFQUFFLE9BQU87UUFDcEIsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQztZQUN2QixPQUFPLEVBQUUsS0FBSztT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QVcsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1NBQ25DLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQTtJQUNqQixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtoLCB2U2hvdywgd2l0aERpcmVjdGl2ZXN9IGZyb20gJ3Z1ZSdcbi8vIENvbXBvbmVudHNcbmltcG9ydCB7IFZGYWRlVHJhbnNpdGlvbiB9IGZyb20gJy4uL3RyYW5zaXRpb25zJ1xuaW1wb3J0IFZFeHBhbnNpb25QYW5lbCBmcm9tICcuL1ZFeHBhbnNpb25QYW5lbCdcbmltcG9ydCBWSWNvbiBmcm9tICcuLi9WSWNvbidcblxuLy8gTWl4aW5zXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXG5pbXBvcnQgeyBpbmplY3QgYXMgUmVnaXN0cmFibGVJbmplY3QgfSBmcm9tICcuLi8uLi9taXhpbnMvcmVnaXN0cmFibGUnXG5cbi8vIERpcmVjdGl2ZXNcbmltcG9ydCByaXBwbGUsIHsgUmlwcGxlIH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9yaXBwbGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IHsgZ2V0U2xvdCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcbmltcG9ydCBtaXhpbnMsIHsgRXh0cmFjdFZ1ZSB9IGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IFZ1ZSwgeyBWTm9kZSwgVnVlQ29uc3RydWN0b3IgfSBmcm9tICd2dWUnXG5cbmNvbnN0IGJhc2VNaXhpbnMgPSBtaXhpbnMoXG4gIENvbG9yYWJsZSxcbiAgUmVnaXN0cmFibGVJbmplY3Q8J2V4cGFuc2lvblBhbmVsJywgVnVlQ29uc3RydWN0b3I8VnVlPj4oJ2V4cGFuc2lvblBhbmVsJywgJ3YtZXhwYW5zaW9uLXBhbmVsLWhlYWRlcicsICd2LWV4cGFuc2lvbi1wYW5lbCcpXG4pXG5cbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgRXh0cmFjdFZ1ZTx0eXBlb2YgYmFzZU1peGlucz4ge1xuICAkZWw6IEhUTUxFbGVtZW50XG4gIGV4cGFuc2lvblBhbmVsOiBJbnN0YW5jZVR5cGU8dHlwZW9mIFZFeHBhbnNpb25QYW5lbD5cbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZU1peGlucy5leHRlbmQoe1xuICBuYW1lOiAndi1leHBhbnNpb24tcGFuZWwtaGVhZGVyJyxcblxuXG4gIHByb3BzOiB7XG4gICAgZGlzYWJsZUljb25Sb3RhdGU6IEJvb2xlYW4sXG4gICAgZXhwYW5kSWNvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyRleHBhbmQnLFxuICAgIH0sXG4gICAgaGlkZUFjdGlvbnM6IEJvb2xlYW4sXG4gICAgcmlwcGxlOiB7XG4gICAgICB0eXBlOiBbQm9vbGVhbiwgT2JqZWN0XSxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG5cbiAgZGF0YTogKCkgPT4gKHtcbiAgICBoYXNNb3VzZWRvd246IGZhbHNlLFxuICB9KSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAndi1leHBhbnNpb24tcGFuZWwtaGVhZGVyLS1hY3RpdmUnOiB0aGlzLmlzQWN0aXZlLFxuICAgICAgICAndi1leHBhbnNpb24tcGFuZWwtaGVhZGVyLS1tb3VzZWRvd24nOiB0aGlzLmhhc01vdXNlZG93bixcbiAgICAgIH1cbiAgICB9LFxuICAgIGlzQWN0aXZlICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLmV4cGFuc2lvblBhbmVsLmlzQWN0aXZlXG4gICAgfSxcbiAgICBpc0Rpc2FibGVkICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLmV4cGFuc2lvblBhbmVsLmlzRGlzYWJsZWRcbiAgICB9LFxuICAgIGlzUmVhZG9ubHkgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuZXhwYW5zaW9uUGFuZWwuaXNSZWFkb25seVxuICAgIH0sXG4gIH0sXG5cbiAgY3JlYXRlZCAoKSB7XG4gICAgdGhpcy5leHBhbnNpb25QYW5lbC5yZWdpc3RlckhlYWRlcih0aGlzKVxuICB9LFxuXG4gIGJlZm9yZVVubW91bnQgKCkge1xuICAgIHRoaXMuZXhwYW5zaW9uUGFuZWwudW5yZWdpc3RlckhlYWRlcigpXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIG9uQ2xpY2sgKGU6IE1vdXNlRXZlbnQpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ2NsaWNrJywgZSlcbiAgICAgIHRoaXMuJGVtaXRMZWdhY3koJ2NsaWNrJywgZSlcbiAgICB9LFxuICAgIGdlbkljb24gKCkge1xuICAgICAgY29uc3QgaWNvbiA9IGdldFNsb3QodGhpcywgJ2FjdGlvbnMnLCB7IG9wZW46IHRoaXMuaXNBY3RpdmUgfSkgfHxcbiAgICAgICAgW2goVkljb24sIHt9LCAoKSA9PiB0aGlzLmV4cGFuZEljb24pXVxuXG4gICAgICByZXR1cm4gaChWRmFkZVRyYW5zaXRpb24sIHt9LCAoKSA9PiBbXG4gICAgICAgIHdpdGhEaXJlY3RpdmVzKGgoJ2RpdicsIHtcbiAgICAgICAgICBjbGFzczogWyd2LWV4cGFuc2lvbi1wYW5lbC1oZWFkZXJfX2ljb24nLCB7XG4gICAgICAgICAgICAndi1leHBhbnNpb24tcGFuZWwtaGVhZGVyX19pY29uLS1kaXNhYmxlLXJvdGF0ZSc6IHRoaXMuZGlzYWJsZUljb25Sb3RhdGUsXG4gICAgICAgICAgfV1cbiAgICAgICAgfSwgaWNvbiksIFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICB2U2hvdyxcbiAgICAgICAgICAgICF0aGlzLmlzRGlzYWJsZWRcbiAgICAgICAgICBdXG4gICAgICAgIF0pLFxuICAgICAgXSlcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoKTogVk5vZGUge1xuICAgIGNvbnN0IGRpcmVjdGl2ZXMgPSBbXG4gICAgICBbXG4gICAgICAgIFJpcHBsZSxcbiAgICAgICAgdGhpcy5yaXBwbGVcbiAgICAgIF1cbiAgICBdXG5cbiAgICByZXR1cm4gd2l0aERpcmVjdGl2ZXMoaCgnYnV0dG9uJywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb2xvciwge1xuICAgICAgY2xhc3M6IFsndi1leHBhbnNpb24tcGFuZWwtaGVhZGVyJywgdGhpcy5jbGFzc2VzXSxcbiAgICAgIHRhYmluZGV4OiB0aGlzLmlzRGlzYWJsZWQgPyAtMSA6IG51bGwsXG4gICAgICB0eXBlOiAnYnV0dG9uJyxcbiAgICAgICdhcmlhLWV4cGFuZGVkJzogdGhpcy5pc0FjdGl2ZSxcbiAgICAgIC4uLnRoaXMuJGxpc3RlbmVycyxcbiAgICAgIG9uQ2xpY2s6IHRoaXMub25DbGljayxcbiAgICAgIG9uTW91c2Vkb3duOiAoKSA9PiAodGhpcy5oYXNNb3VzZWRvd24gPSB0cnVlKSxcbiAgICAgIG9uTW91c2V1cDogKCkgPT4gKHRoaXMuaGFzTW91c2Vkb3duID0gZmFsc2UpXG4gICAgfSksIFtcbiAgICAgIGdldFNsb3QodGhpcywgJ2RlZmF1bHQnLCB7IG9wZW46IHRoaXMuaXNBY3RpdmUgfSwgdHJ1ZSksXG4gICAgICB0aGlzLmhpZGVBY3Rpb25zIHx8IHRoaXMuZ2VuSWNvbigpLFxuICAgIF0pLCBkaXJlY3RpdmVzKVxuICB9LFxufSlcbiJdfQ==