import { h, vShow, withDirectives } from 'vue';
// Components
import { VTabTransition, VTabReverseTransition, } from '../transitions';
// Mixins
import { inject as RegistrableInject } from '../../mixins/registrable';
// Helpers
import { convertToUnit, getSlot } from '../../util/helpers';
// Utilities
import mixins from '../../util/mixins';
const baseMixins = mixins(RegistrableInject('stepper', 'v-stepper-content', 'v-stepper'));
/* @vue/component */
export default baseMixins.extend({
    name: 'v-stepper-content',
    inject: {
        isVerticalProvided: {
            from: 'isVertical',
        },
    },
    props: {
        step: {
            type: [Number, String],
            required: true,
        },
    },
    data() {
        return {
            height: 0,
            // Must be null to allow
            // previous comparison
            isActive: null,
            isReverse: false,
            isVertical: this.isVerticalProvided,
        };
    },
    computed: {
        computedTransition() {
            // Fix for #8978
            const reverse = this.$vuetify.rtl ? !this.isReverse : this.isReverse;
            return reverse
                ? VTabReverseTransition
                : VTabTransition;
        },
        styles() {
            if (!this.isVertical)
                return {};
            return {
                height: convertToUnit(this.height),
            };
        },
    },
    watch: {
        isActive(current, previous) {
            // If active and the previous state
            // was null, is just booting up
            if (current && previous == null) {
                this.height = 'auto';
                return;
            }
            if (!this.isVertical)
                return;
            if (this.isActive)
                this.enter();
            else
                this.leave();
        },
    },
    mounted() {
        this.$refs.wrapper.addEventListener('transitionend', this.onTransition, false);
        this.stepper && this.stepper.register(this);
    },
    beforeUnmount() {
        this.$refs.wrapper.removeEventListener('transitionend', this.onTransition, false);
        this.stepper && this.stepper.unregister(this);
    },
    methods: {
        onTransition(e) {
            if (!this.isActive ||
                e.propertyName !== 'height')
                return;
            this.height = 'auto';
        },
        enter() {
            let scrollHeight = 0;
            // Render bug with height
            requestAnimationFrame(() => {
                scrollHeight = this.$refs.wrapper.scrollHeight;
            });
            this.height = 0;
            // Give the collapsing element time to collapse
            setTimeout(() => this.isActive && (this.height = (scrollHeight || 'auto')), 450);
        },
        leave() {
            this.height = this.$refs.wrapper.clientHeight;
            setTimeout(() => (this.height = 0), 10);
        },
        toggle(step, reverse) {
            this.isActive = step.toString() === this.step.toString();
            this.isReverse = reverse;
        },
    },
    render() {
        const contentData = {
            class: 'v-stepper__content',
        };
        const wrapperData = {
            class: 'v-stepper__wrapper',
            style: this.styles,
            ref: 'wrapper',
        };
        if (!this.isVertical) {
            contentData.directives = [{
                    name: 'show',
                    value: this.isActive,
                }];
        }
        const wrapper = h('div', wrapperData, getSlot(this));
        const content = withDirectives(h('div', contentData, [wrapper]), this.isVertical ? [] :
            [
                [
                    vShow,
                    this.isActive
                ]
            ]);
        return h(this.computedTransition, {
            ...this.$listeners,
        }, () => [content]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlN0ZXBwZXJDb250ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlN0ZXBwZXIvVlN0ZXBwZXJDb250ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBQyxNQUFNLEtBQUssQ0FBQTtBQUM1QyxhQUFhO0FBQ2IsT0FBTyxFQUNMLGNBQWMsRUFDZCxxQkFBcUIsR0FDdEIsTUFBTSxnQkFBZ0IsQ0FBQTtBQUV2QixTQUFTO0FBQ1QsT0FBTyxFQUFFLE1BQU0sSUFBSSxpQkFBaUIsRUFBRSxNQUFNLDBCQUEwQixDQUFBO0FBRXRFLFVBQVU7QUFDVixPQUFPLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRTNELFlBQVk7QUFDWixPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUt0QyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQ3ZCLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxtQkFBbUIsRUFBRSxXQUFXLENBQUMsQ0FDL0QsQ0FBQTtBQVNELG9CQUFvQjtBQUNwQixlQUFlLFVBQVUsQ0FBQyxNQUFNLENBQUM7SUFDL0IsSUFBSSxFQUFFLG1CQUFtQjtJQUV6QixNQUFNLEVBQUU7UUFDTixrQkFBa0IsRUFBRTtZQUNsQixJQUFJLEVBQUUsWUFBWTtTQUNuQjtLQUNGO0lBRUQsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixRQUFRLEVBQUUsSUFBSTtTQUNmO0tBQ0Y7SUFFRCxJQUFJO1FBQ0YsT0FBTztZQUNMLE1BQU0sRUFBRSxDQUFvQjtZQUM1Qix3QkFBd0I7WUFDeEIsc0JBQXNCO1lBQ3RCLFFBQVEsRUFBRSxJQUFzQjtZQUNoQyxTQUFTLEVBQUUsS0FBSztZQUNoQixVQUFVLEVBQUUsSUFBSSxDQUFDLGtC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aERpcmVjdGl2ZXN9IGZyb20gJ3Z1ZSdcbi8vIENvbXBvbmVudHNcbmltcG9ydCB7XG4gIFZUYWJUcmFuc2l0aW9uLFxuICBWVGFiUmV2ZXJzZVRyYW5zaXRpb24sXG59IGZyb20gJy4uL3RyYW5zaXRpb25zJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCB7IGluamVjdCBhcyBSZWdpc3RyYWJsZUluamVjdCB9IGZyb20gJy4uLy4uL21peGlucy9yZWdpc3RyYWJsZSdcblxuLy8gSGVscGVyc1xuaW1wb3J0IHsgY29udmVydFRvVW5pdCwgZ2V0U2xvdCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUsIEZ1bmN0aW9uYWxDb21wb25lbnRPcHRpb25zLCBWTm9kZURhdGEgfSBmcm9tICd2dWUnXG5cbmNvbnN0IGJhc2VNaXhpbnMgPSBtaXhpbnMoXG4gIFJlZ2lzdHJhYmxlSW5qZWN0KCdzdGVwcGVyJywgJ3Ytc3RlcHBlci1jb250ZW50JywgJ3Ytc3RlcHBlcicpXG4pXG5cbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgSW5zdGFuY2VUeXBlPHR5cGVvZiBiYXNlTWl4aW5zPiB7XG4gICRyZWZzOiB7XG4gICAgd3JhcHBlcjogSFRNTEVsZW1lbnRcbiAgfVxuICBpc1ZlcnRpY2FsUHJvdmlkZWQ6IGJvb2xlYW5cbn1cblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGJhc2VNaXhpbnMuZXh0ZW5kKHtcbiAgbmFtZTogJ3Ytc3RlcHBlci1jb250ZW50JyxcblxuICBpbmplY3Q6IHtcbiAgICBpc1ZlcnRpY2FsUHJvdmlkZWQ6IHtcbiAgICAgIGZyb206ICdpc1ZlcnRpY2FsJyxcbiAgICB9LFxuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgc3RlcDoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIH0sXG4gIH0sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogMCBhcyBudW1iZXIgfCBzdHJpbmcsXG4gICAgICAvLyBNdXN0IGJlIG51bGwgdG8gYWxsb3dcbiAgICAgIC8vIHByZXZpb3VzIGNvbXBhcmlzb25cbiAgICAgIGlzQWN0aXZlOiBudWxsIGFzIGJvb2xlYW4gfCBudWxsLFxuICAgICAgaXNSZXZlcnNlOiBmYWxzZSxcbiAgICAgIGlzVmVydGljYWw6IHRoaXMuaXNWZXJ0aWNhbFByb3ZpZGVkLFxuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNvbXB1dGVkVHJhbnNpdGlvbiAoKTogRnVuY3Rpb25hbENvbXBvbmVudE9wdGlvbnMge1xuICAgICAgLy8gRml4IGZvciAjODk3OFxuICAgICAgY29uc3QgcmV2ZXJzZSA9IHRoaXMuJHZ1ZXRpZnkucnRsID8gIXRoaXMuaXNSZXZlcnNlIDogdGhpcy5pc1JldmVyc2VcblxuICAgICAgcmV0dXJuIHJldmVyc2VcbiAgICAgICAgPyBWVGFiUmV2ZXJzZVRyYW5zaXRpb25cbiAgICAgICAgOiBWVGFiVHJhbnNpdGlvblxuICAgIH0sXG4gICAgc3R5bGVzICgpOiBvYmplY3Qge1xuICAgICAgaWYgKCF0aGlzLmlzVmVydGljYWwpIHJldHVybiB7fVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBoZWlnaHQ6IGNvbnZlcnRUb1VuaXQodGhpcy5oZWlnaHQpLFxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBpc0FjdGl2ZSAoY3VycmVudCwgcHJldmlvdXMpIHtcbiAgICAgIC8vIElmIGFjdGl2ZSBhbmQgdGhlIHByZXZpb3VzIHN0YXRlXG4gICAgICAvLyB3YXMgbnVsbCwgaXMganVzdCBib290aW5nIHVwXG4gICAgICBpZiAoY3VycmVudCAmJiBwcmV2aW91cyA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gJ2F1dG8nXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuaXNWZXJ0aWNhbCkgcmV0dXJuXG5cbiAgICAgIGlmICh0aGlzLmlzQWN0aXZlKSB0aGlzLmVudGVyKClcbiAgICAgIGVsc2UgdGhpcy5sZWF2ZSgpXG4gICAgfSxcbiAgfSxcblxuICBtb3VudGVkICgpIHtcbiAgICB0aGlzLiRyZWZzLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICd0cmFuc2l0aW9uZW5kJyxcbiAgICAgIHRoaXMub25UcmFuc2l0aW9uLFxuICAgICAgZmFsc2VcbiAgICApXG4gICAgdGhpcy5zdGVwcGVyICYmIHRoaXMuc3RlcHBlci5yZWdpc3Rlcih0aGlzKVxuICB9LFxuXG4gIGJlZm9yZVVubW91bnQgKCkge1xuICAgIHRoaXMuJHJlZnMud3JhcHBlci5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgdGhpcy5vblRyYW5zaXRpb24sXG4gICAgICBmYWxzZVxuICAgIClcbiAgICB0aGlzLnN0ZXBwZXIgJiYgdGhpcy5zdGVwcGVyLnVucmVnaXN0ZXIodGhpcylcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgb25UcmFuc2l0aW9uIChlOiBUcmFuc2l0aW9uRXZlbnQpIHtcbiAgICAgIGlmICghdGhpcy5pc0FjdGl2ZSB8fFxuICAgICAgICBlLnByb3BlcnR5TmFtZSAhPT0gJ2hlaWdodCdcbiAgICAgICkgcmV0dXJuXG5cbiAgICAgIHRoaXMuaGVpZ2h0ID0gJ2F1dG8nXG4gICAgfSxcbiAgICBlbnRlciAoKSB7XG4gICAgICBsZXQgc2Nyb2xsSGVpZ2h0ID0gMFxuXG4gICAgICAvLyBSZW5kZXIgYnVnIHdpdGggaGVpZ2h0XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBzY3JvbGxIZWlnaHQgPSB0aGlzLiRyZWZzLndyYXBwZXIuc2Nyb2xsSGVpZ2h0XG4gICAgICB9KVxuXG4gICAgICB0aGlzLmhlaWdodCA9IDBcblxuICAgICAgLy8gR2l2ZSB0aGUgY29sbGFwc2luZyBlbGVtZW50IHRpbWUgdG8gY29sbGFwc2VcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5pc0FjdGl2ZSAmJiAodGhpcy5oZWlnaHQgPSAoc2Nyb2xsSGVpZ2h0IHx8ICdhdXRvJykpLCA0NTApXG4gICAgfSxcbiAgICBsZWF2ZSAoKSB7XG4gICAgICB0aGlzLmhlaWdodCA9IHRoaXMuJHJlZnMud3JhcHBlci5jbGllbnRIZWlnaHRcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gKHRoaXMuaGVpZ2h0ID0gMCksIDEwKVxuICAgIH0sXG4gICAgdG9nZ2xlIChzdGVwOiBzdHJpbmcgfCBudW1iZXIsIHJldmVyc2U6IGJvb2xlYW4pIHtcbiAgICAgIHRoaXMuaXNBY3RpdmUgPSBzdGVwLnRvU3RyaW5nKCkgPT09IHRoaXMuc3RlcC50b1N0cmluZygpXG4gICAgICB0aGlzLmlzUmV2ZXJzZSA9IHJldmVyc2VcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoKTogVk5vZGUge1xuICAgIGNvbnN0IGNvbnRlbnREYXRhID0ge1xuICAgICAgY2xhc3M6ICd2LXN0ZXBwZXJfX2NvbnRlbnQnLFxuICAgIH0gYXMgVk5vZGVEYXRhXG4gICAgY29uc3Qgd3JhcHBlckRhdGEgPSB7XG4gICAgICBjbGFzczogJ3Ytc3RlcHBlcl9fd3JhcHBlcicsXG4gICAgICBzdHlsZTogdGhpcy5zdHlsZXMsXG4gICAgICByZWY6ICd3cmFwcGVyJyxcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaXNWZXJ0aWNhbCkge1xuICAgICAgY29udGVudERhdGEuZGlyZWN0aXZlcyA9IFt7XG4gICAgICAgIG5hbWU6ICdzaG93JyxcbiAgICAgICAgdmFsdWU6IHRoaXMuaXNBY3RpdmUsXG4gICAgICB9XVxuICAgIH1cblxuICAgIGNvbnN0IHdyYXBwZXIgPSBoKCdkaXYnLCB3cmFwcGVyRGF0YSwgZ2V0U2xvdCh0aGlzKSlcbiAgICBjb25zdCBjb250ZW50ID0gd2l0aERpcmVjdGl2ZXMoXG4gICAgICBoKCdkaXYnLCBjb250ZW50RGF0YSwgW3dyYXBwZXJdKSwgdGhpcy5pc1ZlcnRpY2FsID8gW10gOlxuICAgICAgW1xuICAgICAgICBbXG4gICAgICAgICAgdlNob3csXG4gICAgICAgICAgdGhpcy5pc0FjdGl2ZVxuICAgICAgICBdXG4gICAgICBdKVxuXG4gICAgcmV0dXJuIGgodGhpcy5jb21wdXRlZFRyYW5zaXRpb24sIHtcbiAgICAgIC4uLnRoaXMuJGxpc3RlbmVycyxcbiAgICB9LCAoKSA9PiBbY29udGVudF0pXG4gIH0sXG59KVxuIl19