import { Transition, h, vShow, withDirectives } from 'vue';
// Styles
import './VDialog.sass';
// Components
import { VThemeProvider } from '../VThemeProvider';
// Mixins
import Activatable from '../../mixins/activatable';
import Dependent from '../../mixins/dependent';
import Detachable from '../../mixins/detachable';
import Overlayable from '../../mixins/overlayable';
import Returnable from '../../mixins/returnable';
import Stackable from '../../mixins/stackable';
// Directives
import ClickOutside from '../../directives/click-outside';
// Helpers
import mixins from '../../util/mixins';
import { removed } from '../../util/console';
import { convertToUnit, keyCodes, } from '../../util/helpers';
const baseMixins = mixins(Dependent, Detachable, Overlayable, Returnable, Stackable, Activatable);
/* @vue/component */
export default baseMixins.extend({
    name: 'v-dialog',
    props: {
        dark: Boolean,
        disabled: Boolean,
        fullscreen: Boolean,
        light: Boolean,
        maxWidth: [String, Number],
        noClickAnimation: Boolean,
        origin: {
            type: String,
            default: 'center center',
        },
        persistent: Boolean,
        retainFocus: {
            type: Boolean,
            default: true,
        },
        scrollable: Boolean,
        transition: {
            type: [String, Boolean],
            default: 'dialog-transition',
        },
        width: [String, Number],
    },
    emits: ['click:outside', 'keydown'],
    data() {
        return {
            activatedBy: null,
            animate: false,
            animateTimeout: -1,
            stackMinZIndex: 200,
            previousActiveElement: null,
        };
    },
    computed: {
        classes() {
            return {
                [(`v-dialog ${this.contentClass}`).trim()]: true,
                'v-dialog--active': this.isActive,
                'v-dialog--persistent': this.persistent,
                'v-dialog--fullscreen': this.fullscreen,
                'v-dialog--scrollable': this.scrollable,
                'v-dialog--animated': this.animate,
            };
        },
        contentClasses() {
            return {
                'v-dialog__content': true,
                'v-dialog__content--active': this.isActive,
            };
        },
        hasActivator() {
            return Boolean(!!this.$slots.activator ||
                !!this.$slots.activator);
        },
    },
    watch: {
        isActive(val) {
            var _a;
            if (val) {
                this.show();
                this.hideScroll();
            }
            else {
                this.removeOverlay();
                this.unbind();
                (_a = this.previousActiveElement) === null || _a === void 0 ? void 0 : _a.focus();
            }
        },
        fullscreen(val) {
            if (!this.isActive)
                return;
            if (val) {
                this.hideScroll();
                this.removeOverlay(false);
            }
            else {
                this.showScroll();
                this.genOverlay();
            }
        },
    },
    created() {
        /* istanbul ignore next */
        if (this.$attrs.hasOwnProperty('full-width')) {
            removed('full-width', this);
        }
    },
    beforeMount() {
        this.$nextTick(() => {
            this.isBooted = this.isActive;
            this.isActive && this.show();
        });
    },
    beforeUnmount() {
        if (typeof window !== 'undefined')
            this.unbind();
    },
    methods: {
        animateClick() {
            this.animate = false;
            // Needed for when clicking very fast
            // outside of the dialog
            this.$nextTick(() => {
                this.animate = true;
                window.clearTimeout(this.animateTimeout);
                this.animateTimeout = window.setTimeout(() => (this.animate = false), 150);
            });
        },
        closeConditional(e) {
            const target = e.target;
            // Ignore the click if the dialog is closed or destroyed,
            // if it was on an element inside the content,
            // if it was dragged onto the overlay (#6969),
            // or if this isn't the topmost dialog (#9907)
            return !(this._isDestroyed ||
                !this.isActive ||
                this.$refs.content.contains(target) ||
                (this.overlay && target && !this.overlay.$el.contains(target))) && this.activeZIndex >= this.getMaxZIndex();
        },
        hideScroll() {
            if (this.fullscreen) {
                document.documentElement.classList.add('overflow-y-hidden');
            }
            else {
                Overlayable.methods.hideScroll.call(this);
            }
        },
        show() {
            !this.fullscreen && !this.hideOverlay && this.genOverlay();
            // Double nextTick to wait for lazy content to be generated
            this.$nextTick(() => {
                this.$nextTick(() => {
                    var _a, _b;
                    if (!((_a = this.$refs.dialog) === null || _a === void 0 ? void 0 : _a.contains(document.activeElement))) {
                        this.previousActiveElement = document.activeElement;
                        (_b = this.$refs.dialog) === null || _b === void 0 ? void 0 : _b.focus();
                    }
                    this.bind();
                });
            });
        },
        bind() {
            window.addEventListener('focusin', this.onFocusin);
        },
        unbind() {
            window.removeEventListener('focusin', this.onFocusin);
        },
        onClickOutside(e) {
            this.$emit('click:outside', e);
            if (this.persistent) {
                this.noClickAnimation || this.animateClick();
            }
            else {
                this.isActive = false;
            }
        },
        onKeydown(e) {
            if (e.keyCode === keyCodes.esc && !this.getOpenDependents().length) {
                if (!this.persistent) {
                    this.isActive = false;
                    const activator = this.getActivator();
                    this.$nextTick(() => activator && activator.focus());
                }
                else if (!this.noClickAnimation) {
                    this.animateClick();
                }
            }
            this.$emit('keydown', e);
        },
        // On focus change, wrap focus to stay inside the dialog
        // https://github.com/vuetifyjs/vuetify/issues/6892
        onFocusin(e) {
            if (!e || !this.retainFocus)
                return;
            const target = e.target;
            if (!!target &&
                this.$refs.dialog &&
                // It isn't the document or the dialog body
                ![document, this.$refs.dialog].includes(target) &&
                // It isn't inside the dialog body
                !this.$refs.dialog.contains(target) &&
                // We're the topmost dialog
                this.activeZIndex >= this.getMaxZIndex() &&
                // It isn't inside a dependent element (like a menu)
                !this.getOpenDependentElements().some(el => el.contains(target))
            // So we must have focused something outside the dialog and its children
            ) {
                // Find and focus the first available element inside the dialog
                const focusable = this.$refs.dialog.querySelectorAll('button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])');
                const el = [...focusable].find(el => !el.hasAttribute('disabled') && !el.matches('[tabindex="-1"]'));
                el && el.focus();
            }
        },
        genContent() {
            return this.showLazyContent(() => [
                h(VThemeProvider, {
                    root: true,
                    light: this.light,
                    dark: this.dark
                }, () => [
                    h('div', {
                        class: this.contentClasses,
                        role: 'dialog',
                        'aria-modal': this.hideOverlay ? undefined : 'true',
                        ...this.getScopeIdAttrs(),
                        onKeydown: this.onKeydown,
                        style: { zIndex: this.activeZIndex },
                        ref: 'content',
                    }, [this.genTransition()]),
                ]),
            ]);
        },
        genTransition() {
            const content = this.genInnerContent();
            if (!this.transition)
                return content;
            return h(Transition, {
                name: this.transition,
                origin: this.origin,
                appear: true
            }, () => [content]);
        },
        genInnerContent() {
            const directives = [
                [
                    ClickOutside,
                    {
                        handler: this.onClickOutside,
                        closeConditional: this.closeConditional,
                        include: this.getOpenDependentElements,
                    },
                ],
                [
                    vShow,
                    this.isActive,
                ],
            ];
            const data = {
                class: this.classes,
                tabindex: this.isActive ? 0 : undefined,
                ref: 'dialog',
                style: {
                    transformOrigin: this.origin,
                },
            };
            if (!this.fullscreen) {
                data.style = {
                    ...data.style,
                    maxWidth: convertToUnit(this.maxWidth),
                    width: convertToUnit(this.width),
                };
            }
            return withDirectives(h('div', data, this.getContentSlot()), directives);
        },
    },
    render() {
        return h('div', {
            class: ['v-dialog__container', {
                    'v-dialog__container--attached': this.attach === '' ||
                        this.attach === true ||
                        this.attach === 'attach',
                }],
        }, [
            this.genActivator(),
            this.genContent(),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZEaWFsb2cvVkRpYWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBQzFELFNBQVM7QUFDVCxPQUFPLGdCQUFnQixDQUFBO0FBRXZCLGFBQWE7QUFDYixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUE7QUFFbEQsU0FBUztBQUNULE9BQU8sV0FBVyxNQUFNLDBCQUEwQixDQUFBO0FBQ2xELE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBQ2hELE9BQU8sV0FBVyxNQUFNLDBCQUEwQixDQUFBO0FBQ2xELE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBQ2hELE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBRTlDLGFBQWE7QUFDYixPQUFPLFlBQVksTUFBTSxnQ0FBZ0MsQ0FBQTtBQUV6RCxVQUFVO0FBQ1YsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFDdEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQzVDLE9BQU8sRUFDTCxhQUFhLEVBQ2IsUUFBUSxHQUNULE1BQU0sb0JBQW9CLENBQUE7QUFLM0IsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLFdBQVcsRUFDWCxVQUFVLEVBQ1YsU0FBUyxFQUNULFdBQVcsQ0FDWixDQUFBO0FBRUQsb0JBQW9CO0FBQ3BCLGVBQWUsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUMvQixJQUFJLEVBQUUsVUFBVTtJQUVoQixLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUUsT0FBTztRQUNiLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLFVB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LENBQUMsT0FBTztnQkFDbkIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztnQkFDdkMsR0FBRyxFQUFFLFFBQVE7Z0JBQ2IsS0FBSyxFQUFFO29CQUNMLGVBQWUsRUFBRSxJQUFJLENBQUMsTUFBTTtpQkFDN0I7YUFDRixDQUFBO1lBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUc7b0JBQ1gsR0FBRyxJQUFJLENBQUMsS0FBZTtvQkFDdkIsUUFBUSxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO29CQUN0QyxLQUFLLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7aUJBQ2pDLENBQUE7YUFDRjtZQUVELE9BQU8sY0FBYyxDQUNuQixDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsRUFDckMsVUFBVSxDQUNYLENBQUE7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxNQUFNO1FBQ0osT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQ2QsS0FBSyxFQUFFLENBQUMscUJBQXFCLEVBQUU7b0JBQzdCLCtCQUErQixFQUM3QixJQUFJLENBQUMsTUFBTSxLQUFLLEVBQUU7d0JBQ2xCLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSTt3QkFDcEIsSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRO2lCQUMzQixDQUFDO1NBQ0gsRUFBRTtZQUNELElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFVBQVUsRUFBRTtTQUNsQixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVHJhbnNpdGlvbiwgaCwgdlNob3csIHdpdGhEaXJlY3RpdmVzIH0gZnJvbSAndnVlJ1xuLy8gU3R5bGVzXG5pbXBvcnQgJy4vVkRpYWxvZy5zYXNzJ1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgeyBWVGhlbWVQcm92aWRlciB9IGZyb20gJy4uL1ZUaGVtZVByb3ZpZGVyJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBBY3RpdmF0YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvYWN0aXZhdGFibGUnXG5pbXBvcnQgRGVwZW5kZW50IGZyb20gJy4uLy4uL21peGlucy9kZXBlbmRlbnQnXG5pbXBvcnQgRGV0YWNoYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvZGV0YWNoYWJsZSdcbmltcG9ydCBPdmVybGF5YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvb3ZlcmxheWFibGUnXG5pbXBvcnQgUmV0dXJuYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvcmV0dXJuYWJsZSdcbmltcG9ydCBTdGFja2FibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3N0YWNrYWJsZSdcblxuLy8gRGlyZWN0aXZlc1xuaW1wb3J0IENsaWNrT3V0c2lkZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL2NsaWNrLW91dHNpZGUnXG5cbi8vIEhlbHBlcnNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgeyByZW1vdmVkIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xuaW1wb3J0IHtcbiAgY29udmVydFRvVW5pdCxcbiAga2V5Q29kZXMsXG59IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcblxuLy8gVHlwZXNcbmltcG9ydCB7IFZOb2RlLCBWTm9kZURhdGEgfSBmcm9tICd2dWUnXG5cbmNvbnN0IGJhc2VNaXhpbnMgPSBtaXhpbnMoXG4gIERlcGVuZGVudCxcbiAgRGV0YWNoYWJsZSxcbiAgT3ZlcmxheWFibGUsXG4gIFJldHVybmFibGUsXG4gIFN0YWNrYWJsZSxcbiAgQWN0aXZhdGFibGUsXG4pXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBiYXNlTWl4aW5zLmV4dGVuZCh7XG4gIG5hbWU6ICd2LWRpYWxvZycsXG5cbiAgcHJvcHM6IHtcbiAgICBkYXJrOiBCb29sZWFuLFxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxuICAgIGZ1bGxzY3JlZW46IEJvb2xlYW4sXG4gICAgbGlnaHQ6IEJvb2xlYW4sXG4gICAgbWF4V2lkdGg6IFtTdHJpbmcsIE51bWJlcl0sXG4gICAgbm9DbGlja0FuaW1hdGlvbjogQm9vbGVhbixcbiAgICBvcmlnaW46IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdjZW50ZXIgY2VudGVyJyxcbiAgICB9LFxuICAgIHBlcnNpc3RlbnQ6IEJvb2xlYW4sXG4gICAgcmV0YWluRm9jdXM6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgIH0sXG4gICAgc2Nyb2xsYWJsZTogQm9vbGVhbixcbiAgICB0cmFuc2l0aW9uOiB7XG4gICAgICB0eXBlOiBbU3RyaW5nLCBCb29sZWFuXSxcbiAgICAgIGRlZmF1bHQ6ICdkaWFsb2ctdHJhbnNpdGlvbicsXG4gICAgfSxcbiAgICB3aWR0aDogW1N0cmluZywgTnVtYmVyXSxcbiAgfSxcblxuICBlbWl0czogWydjbGljazpvdXRzaWRlJywgJ2tleWRvd24nXSxcblxuICBkYXRhICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWN0aXZhdGVkQnk6IG51bGwgYXMgRXZlbnRUYXJnZXQgfCBudWxsLFxuICAgICAgYW5pbWF0ZTogZmFsc2UsXG4gICAgICBhbmltYXRlVGltZW91dDogLTEsXG4gICAgICBzdGFja01pblpJbmRleDogMjAwLFxuICAgICAgcHJldmlvdXNBY3RpdmVFbGVtZW50OiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcbiAgICB9XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgWyhgdi1kaWFsb2cgJHt0aGlzLmNvbnRlbnRDbGFzc31gKS50cmltKCldOiB0cnVlLFxuICAgICAgICAndi1kaWFsb2ctLWFjdGl2ZSc6IHRoaXMuaXNBY3RpdmUsXG4gICAgICAgICd2LWRpYWxvZy0tcGVyc2lzdGVudCc6IHRoaXMucGVyc2lzdGVudCxcbiAgICAgICAgJ3YtZGlhbG9nLS1mdWxsc2NyZWVuJzogdGhpcy5mdWxsc2NyZWVuLFxuICAgICAgICAndi1kaWFsb2ctLXNjcm9sbGFibGUnOiB0aGlzLnNjcm9sbGFibGUsXG4gICAgICAgICd2LWRpYWxvZy0tYW5pbWF0ZWQnOiB0aGlzLmFuaW1hdGUsXG4gICAgICB9XG4gICAgfSxcbiAgICBjb250ZW50Q2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LWRpYWxvZ19fY29udGVudCc6IHRydWUsXG4gICAgICAgICd2LWRpYWxvZ19fY29udGVudC0tYWN0aXZlJzogdGhpcy5pc0FjdGl2ZSxcbiAgICAgIH1cbiAgICB9LFxuICAgIGhhc0FjdGl2YXRvciAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gQm9vbGVhbihcbiAgICAgICAgISF0aGlzLiRzbG90cy5hY3RpdmF0b3IgfHxcbiAgICAgICAgISF0aGlzLiRzbG90cy5hY3RpdmF0b3JcbiAgICAgIClcbiAgICB9LFxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgaXNBY3RpdmUgKHZhbCkge1xuICAgICAgaWYgKHZhbCkge1xuICAgICAgICB0aGlzLnNob3coKVxuICAgICAgICB0aGlzLmhpZGVTY3JvbGwoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZW1vdmVPdmVybGF5KClcbiAgICAgICAgdGhpcy51bmJpbmQoKVxuICAgICAgICB0aGlzLnByZXZpb3VzQWN0aXZlRWxlbWVudD8uZm9jdXMoKVxuICAgICAgfVxuICAgIH0sXG4gICAgZnVsbHNjcmVlbiAodmFsKSB7XG4gICAgICBpZiAoIXRoaXMuaXNBY3RpdmUpIHJldHVyblxuXG4gICAgICBpZiAodmFsKSB7XG4gICAgICAgIHRoaXMuaGlkZVNjcm9sbCgpXG4gICAgICAgIHRoaXMucmVtb3ZlT3ZlcmxheShmYWxzZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2hvd1Njcm9sbCgpXG4gICAgICAgIHRoaXMuZ2VuT3ZlcmxheSgpXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICBjcmVhdGVkICgpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmICh0aGlzLiRhdHRycy5oYXNPd25Qcm9wZXJ0eSgnZnVsbC13aWR0aCcpKSB7XG4gICAgICByZW1vdmVkKCdmdWxsLXdpZHRoJywgdGhpcylcbiAgICB9XG4gIH0sXG5cbiAgYmVmb3JlTW91bnQgKCkge1xuICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgIHRoaXMuaXNCb290ZWQgPSB0aGlzLmlzQWN0aXZlXG4gICAgICB0aGlzLmlzQWN0aXZlICYmIHRoaXMuc2hvdygpXG4gICAgfSlcbiAgfSxcblxuICBiZWZvcmVVbm1vdW50ICgpIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHRoaXMudW5iaW5kKClcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgYW5pbWF0ZUNsaWNrICgpIHtcbiAgICAgIHRoaXMuYW5pbWF0ZSA9IGZhbHNlXG4gICAgICAvLyBOZWVkZWQgZm9yIHdoZW4gY2xpY2tpbmcgdmVyeSBmYXN0XG4gICAgICAvLyBvdXRzaWRlIG9mIHRoZSBkaWFsb2dcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgdGhpcy5hbmltYXRlID0gdHJ1ZVxuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuYW5pbWF0ZVRpbWVvdXQpXG4gICAgICAgIHRoaXMuYW5pbWF0ZVRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiAodGhpcy5hbmltYXRlID0gZmFsc2UpLCAxNTApXG4gICAgICB9KVxuICAgIH0sXG4gICAgY2xvc2VDb25kaXRpb25hbCAoZTogRXZlbnQpIHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50XG4gICAgICAvLyBJZ25vcmUgdGhlIGNsaWNrIGlmIHRoZSBkaWFsb2cgaXMgY2xvc2VkIG9yIGRlc3Ryb3llZCxcbiAgICAgIC8vIGlmIGl0IHdhcyBvbiBhbiBlbGVtZW50IGluc2lkZSB0aGUgY29udGVudCxcbiAgICAgIC8vIGlmIGl0IHdhcyBkcmFnZ2VkIG9udG8gdGhlIG92ZXJsYXkgKCM2OTY5KSxcbiAgICAgIC8vIG9yIGlmIHRoaXMgaXNuJ3QgdGhlIHRvcG1vc3QgZGlhbG9nICgjOTkwNylcbiAgICAgIHJldHVybiAhKFxuICAgICAgICB0aGlzLl9pc0Rlc3Ryb3llZCB8fFxuICAgICAgICAhdGhpcy5pc0FjdGl2ZSB8fFxuICAgICAgICB0aGlzLiRyZWZzLmNvbnRlbnQuY29udGFpbnModGFyZ2V0KSB8fFxuICAgICAgICAodGhpcy5vdmVybGF5ICYmIHRhcmdldCAmJiAhdGhpcy5vdmVybGF5LiRlbC5jb250YWlucyh0YXJnZXQpKVxuICAgICAgKSAmJiB0aGlzLmFjdGl2ZVpJbmRleCA+PSB0aGlzLmdldE1heFpJbmRleCgpXG4gICAgfSxcbiAgICBoaWRlU2Nyb2xsICgpIHtcbiAgICAgIGlmICh0aGlzLmZ1bGxzY3JlZW4pIHtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ292ZXJmbG93LXktaGlkZGVuJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIE92ZXJsYXlhYmxlLm1ldGhvZHMuaGlkZVNjcm9sbC5jYWxsKHRoaXMpXG4gICAgICB9XG4gICAgfSxcbiAgICBzaG93ICgpIHtcbiAgICAgICF0aGlzLmZ1bGxzY3JlZW4gJiYgIXRoaXMuaGlkZU92ZXJsYXkgJiYgdGhpcy5nZW5PdmVybGF5KClcbiAgICAgIC8vIERvdWJsZSBuZXh0VGljayB0byB3YWl0IGZvciBsYXp5IGNvbnRlbnQgdG8gYmUgZ2VuZXJhdGVkXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICBpZiAoIXRoaXMuJHJlZnMuZGlhbG9nPy5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xuICAgICAgICAgICAgdGhpcy5wcmV2aW91c0FjdGl2ZUVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50XG4gICAgICAgICAgICB0aGlzLiRyZWZzLmRpYWxvZz8uZm9jdXMoKVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmJpbmQoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9LFxuICAgIGJpbmQgKCkge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzaW4nLCB0aGlzLm9uRm9jdXNpbilcbiAgICB9LFxuICAgIHVuYmluZCAoKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsIHRoaXMub25Gb2N1c2luKVxuICAgIH0sXG4gICAgb25DbGlja091dHNpZGUgKGU6IEV2ZW50KSB7XG4gICAgICB0aGlzLiRlbWl0KCdjbGljazpvdXRzaWRlJywgZSlcblxuICAgICAgaWYgKHRoaXMucGVyc2lzdGVudCkge1xuICAgICAgICB0aGlzLm5vQ2xpY2tBbmltYXRpb24gfHwgdGhpcy5hbmltYXRlQ2xpY2soKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICBvbktleWRvd24gKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IGtleUNvZGVzLmVzYyAmJiAhdGhpcy5nZXRPcGVuRGVwZW5kZW50cygpLmxlbmd0aCkge1xuICAgICAgICBpZiAoIXRoaXMucGVyc2lzdGVudCkge1xuICAgICAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZVxuICAgICAgICAgIGNvbnN0IGFjdGl2YXRvciA9IHRoaXMuZ2V0QWN0aXZhdG9yKClcbiAgICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiBhY3RpdmF0b3IgJiYgKGFjdGl2YXRvciBhcyBIVE1MRWxlbWVudCkuZm9jdXMoKSlcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5ub0NsaWNrQW5pbWF0aW9uKSB7XG4gICAgICAgICAgdGhpcy5hbmltYXRlQ2xpY2soKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLiRlbWl0KCdrZXlkb3duJywgZSlcbiAgICB9LFxuICAgIC8vIE9uIGZvY3VzIGNoYW5nZSwgd3JhcCBmb2N1cyB0byBzdGF5IGluc2lkZSB0aGUgZGlhbG9nXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Z1ZXRpZnlqcy92dWV0aWZ5L2lzc3Vlcy82ODkyXG4gICAgb25Gb2N1c2luIChlOiBFdmVudCkge1xuICAgICAgaWYgKCFlIHx8ICF0aGlzLnJldGFpbkZvY3VzKSByZXR1cm5cblxuICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnRcblxuICAgICAgaWYgKFxuICAgICAgICAhIXRhcmdldCAmJlxuICAgICAgICB0aGlzLiRyZWZzLmRpYWxvZyAmJlxuICAgICAgICAvLyBJdCBpc24ndCB0aGUgZG9jdW1lbnQgb3IgdGhlIGRpYWxvZyBib2R5XG4gICAgICAgICFbZG9jdW1lbnQsIHRoaXMuJHJlZnMuZGlhbG9nXS5pbmNsdWRlcyh0YXJnZXQpICYmXG4gICAgICAgIC8vIEl0IGlzbid0IGluc2lkZSB0aGUgZGlhbG9nIGJvZHlcbiAgICAgICAgIXRoaXMuJHJlZnMuZGlhbG9nLmNvbnRhaW5zKHRhcmdldCkgJiZcbiAgICAgICAgLy8gV2UncmUgdGhlIHRvcG1vc3QgZGlhbG9nXG4gICAgICAgIHRoaXMuYWN0aXZlWkluZGV4ID49IHRoaXMuZ2V0TWF4WkluZGV4KCkgJiZcbiAgICAgICAgLy8gSXQgaXNuJ3QgaW5zaWRlIGEgZGVwZW5kZW50IGVsZW1lbnQgKGxpa2UgYSBtZW51KVxuICAgICAgICAhdGhpcy5nZXRPcGVuRGVwZW5kZW50RWxlbWVudHMoKS5zb21lKGVsID0+IGVsLmNvbnRhaW5zKHRhcmdldCkpXG4gICAgICAgIC8vIFNvIHdlIG11c3QgaGF2ZSBmb2N1c2VkIHNvbWV0aGluZyBvdXRzaWRlIHRoZSBkaWFsb2cgYW5kIGl0cyBjaGlsZHJlblxuICAgICAgKSB7XG4gICAgICAgIC8vIEZpbmQgYW5kIGZvY3VzIHRoZSBmaXJzdCBhdmFpbGFibGUgZWxlbWVudCBpbnNpZGUgdGhlIGRpYWxvZ1xuICAgICAgICBjb25zdCBmb2N1c2FibGUgPSB0aGlzLiRyZWZzLmRpYWxvZy5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24sIFtocmVmXSwgaW5wdXQ6bm90KFt0eXBlPVwiaGlkZGVuXCJdKSwgc2VsZWN0LCB0ZXh0YXJlYSwgW3RhYmluZGV4XTpub3QoW3RhYmluZGV4PVwiLTFcIl0pJylcbiAgICAgICAgY29uc3QgZWwgPSBbLi4uZm9jdXNhYmxlXS5maW5kKGVsID0+ICFlbC5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykgJiYgIWVsLm1hdGNoZXMoJ1t0YWJpbmRleD1cIi0xXCJdJykpIGFzIEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkXG4gICAgICAgIGVsICYmIGVsLmZvY3VzKClcbiAgICAgIH1cbiAgICB9LFxuICAgIGdlbkNvbnRlbnQgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2hvd0xhenlDb250ZW50KCgpID0+IFtcbiAgICAgICAgaChWVGhlbWVQcm92aWRlciwge1xuICAgICAgICAgIHJvb3Q6IHRydWUsXG4gICAgICAgICAgbGlnaHQ6IHRoaXMubGlnaHQsXG4gICAgICAgICAgZGFyazogdGhpcy5kYXJrXG4gICAgICAgIH0sICgpID0+IFtcbiAgICAgICAgICBoKCdkaXYnLCB7XG4gICAgICAgICAgICBjbGFzczogdGhpcy5jb250ZW50Q2xhc3NlcyxcbiAgICAgICAgICAgIHJvbGU6ICdkaWFsb2cnLFxuICAgICAgICAgICAgJ2FyaWEtbW9kYWwnOiB0aGlzLmhpZGVPdmVybGF5ID8gdW5kZWZpbmVkIDogJ3RydWUnLFxuICAgICAgICAgICAgLi4udGhpcy5nZXRTY29wZUlkQXR0cnMoKSxcbiAgICAgICAgICAgIG9uS2V5ZG93bjogdGhpcy5vbktleWRvd24sXG4gICAgICAgICAgICBzdHlsZTogeyB6SW5kZXg6IHRoaXMuYWN0aXZlWkluZGV4IH0sXG4gICAgICAgICAgICByZWY6ICdjb250ZW50JyxcbiAgICAgICAgICB9LCBbdGhpcy5nZW5UcmFuc2l0aW9uKCldKSxcbiAgICAgICAgXSksXG4gICAgICBdKVxuICAgIH0sXG4gICAgZ2VuVHJhbnNpdGlvbiAoKSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gdGhpcy5nZW5Jbm5lckNvbnRlbnQoKVxuXG4gICAgICBpZiAoIXRoaXMudHJhbnNpdGlvbikgcmV0dXJuIGNvbnRlbnRcblxuICAgICAgcmV0dXJuIGgoVHJhbnNpdGlvbiwge1xuICAgICAgICBuYW1lOiB0aGlzLnRyYW5zaXRpb24sXG4gICAgICAgIG9yaWdpbjogdGhpcy5vcmlnaW4sXG4gICAgICAgIGFwcGVhcjogdHJ1ZVxuICAgICAgfSwgKCkgPT4gW2NvbnRlbnRdKVxuICAgIH0sXG4gICAgZ2VuSW5uZXJDb250ZW50ICgpIHtcbiAgICAgIGNvbnN0IGRpcmVjdGl2ZXMgPSBbXG4gICAgICAgIFtcbiAgICAgICAgICBDbGlja091dHNpZGUsXG4gICAgICAgICAge1xuICAgICAgICAgICAgaGFuZGxlcjogdGhpcy5vbkNsaWNrT3V0c2lkZSxcbiAgICAgICAgICAgIGNsb3NlQ29uZGl0aW9uYWw6IHRoaXMuY2xvc2VDb25kaXRpb25hbCxcbiAgICAgICAgICAgIGluY2x1ZGU6IHRoaXMuZ2V0T3BlbkRlcGVuZGVudEVsZW1lbnRzLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICB2U2hvdyxcbiAgICAgICAgICB0aGlzLmlzQWN0aXZlLFxuICAgICAgICBdLFxuICAgICAgXVxuICAgICAgY29uc3QgZGF0YTogVk5vZGVEYXRhID0ge1xuICAgICAgICBjbGFzczogdGhpcy5jbGFzc2VzLFxuICAgICAgICB0YWJpbmRleDogdGhpcy5pc0FjdGl2ZSA/IDAgOiB1bmRlZmluZWQsXG4gICAgICAgIHJlZjogJ2RpYWxvZycsXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgdHJhbnNmb3JtT3JpZ2luOiB0aGlzLm9yaWdpbixcbiAgICAgICAgfSxcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmZ1bGxzY3JlZW4pIHtcbiAgICAgICAgZGF0YS5zdHlsZSA9IHtcbiAgICAgICAgICAuLi5kYXRhLnN0eWxlIGFzIG9iamVjdCxcbiAgICAgICAgICBtYXhXaWR0aDogY29udmVydFRvVW5pdCh0aGlzLm1heFdpZHRoKSxcbiAgICAgICAgICB3aWR0aDogY29udmVydFRvVW5pdCh0aGlzLndpZHRoKSxcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gd2l0aERpcmVjdGl2ZXMoXG4gICAgICAgIGgoJ2RpdicsIGRhdGEsIHRoaXMuZ2V0Q29udGVudFNsb3QoKSksXG4gICAgICAgIGRpcmVjdGl2ZXNcbiAgICAgIClcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoKTogVk5vZGUge1xuICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICBjbGFzczogWyd2LWRpYWxvZ19fY29udGFpbmVyJywge1xuICAgICAgICAndi1kaWFsb2dfX2NvbnRhaW5lci0tYXR0YWNoZWQnOlxuICAgICAgICAgIHRoaXMuYXR0YWNoID09PSAnJyB8fFxuICAgICAgICAgIHRoaXMuYXR0YWNoID09PSB0cnVlIHx8XG4gICAgICAgICAgdGhpcy5hdHRhY2ggPT09ICdhdHRhY2gnLFxuICAgICAgfV0sXG4gICAgfSwgW1xuICAgICAgdGhpcy5nZW5BY3RpdmF0b3IoKSxcbiAgICAgIHRoaXMuZ2VuQ29udGVudCgpLFxuICAgIF0pXG4gIH0sXG59KVxuIl19