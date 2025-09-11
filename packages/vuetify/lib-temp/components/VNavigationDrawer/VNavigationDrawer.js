import { h, withDirectives } from 'vue';
// Styles
import './VNavigationDrawer.sass';
// Components
import VImg from '../VImg/VImg';
// Mixins
import Applicationable from '../../mixins/applicationable';
import Colorable from '../../mixins/colorable';
import Dependent from '../../mixins/dependent';
import Mobile from '../../mixins/mobile';
import Overlayable from '../../mixins/overlayable';
import SSRBootable from '../../mixins/ssr-bootable';
import Themeable from '../../mixins/themeable';
// Directives
import ClickOutside from '../../directives/click-outside';
import Touch from '../../directives/touch';
// Utilities
import { convertToUnit, getSlot } from '../../util/helpers';
import { breaking } from '../../util/console';
import mixins from '../../util/mixins';
const baseMixins = mixins(Applicationable('left', [
    'isActive',
    'isMobile',
    'miniVariant',
    'expandOnHover',
    'permanent',
    'right',
    'temporary',
    'width',
]), Colorable, Dependent, Mobile, Overlayable, SSRBootable, Themeable);
/* @vue/component */
export default baseMixins.extend({
    name: 'v-navigation-drawer',
    provide() {
        return {
            isInNav: this.$tag === 'nav',
        };
    },
    props: {
        bottom: Boolean,
        clipped: Boolean,
        disableResizeWatcher: Boolean,
        disableRouteWatcher: Boolean,
        expandOnHover: Boolean,
        floating: Boolean,
        height: {
            type: [Number, String],
        },
        miniVariant: Boolean,
        miniVariantWidth: {
            type: [Number, String],
            default: 56,
        },
        permanent: Boolean,
        right: Boolean,
        src: {
            type: [String, Object],
            default: '',
        },
        stateless: Boolean,
        tag: {
            type: String,
        },
        temporary: Boolean,
        touchless: Boolean,
        width: {
            type: [Number, String],
            default: 256,
        },
        modelValue: null,
    },
    emits: ['update:modelValue', 'transitionend', 'update:mini-variant'],
    data: () => ({
        isMouseover: false,
        touchArea: {
            left: 0,
            right: 0,
        },
        stackMinZIndex: 6,
    }),
    computed: {
        $tag() {
            return this.tag || this.app ? 'nav' : 'aside';
        },
        $height() {
            return this.height || (this.app ? '100vh' : '100%');
        },
        /**
         * Used for setting an app value from a dynamic
         * property. Called from applicationable.js
         */
        applicationProperty() {
            return this.right ? 'right' : 'left';
        },
        classes() {
            return {
                'v-navigation-drawer': true,
                'v-navigation-drawer--absolute': this.absolute,
                'v-navigation-drawer--bottom': this.bottom,
                'v-navigation-drawer--clipped': this.clipped,
                'v-navigation-drawer--close': !this.isActive,
                'v-navigation-drawer--fixed': !this.absolute && (this.app || this.fixed),
                'v-navigation-drawer--floating': this.floating,
                'v-navigation-drawer--is-mobile': this.isMobile,
                'v-navigation-drawer--is-mouseover': this.isMouseover,
                'v-navigation-drawer--mini-variant': this.isMiniVariant,
                'v-navigation-drawer--custom-mini-variant': Number(this.miniVariantWidth) !== 56,
                'v-navigation-drawer--open': this.isActive,
                'v-navigation-drawer--open-on-hover': this.expandOnHover,
                'v-navigation-drawer--right': this.right,
                'v-navigation-drawer--temporary': this.temporary,
                ...this.themeClasses,
            };
        },
        computedMaxHeight() {
            if (!this.hasApp)
                return null;
            const computedMaxHeight = (this.$vuetify.application.bottom +
                this.$vuetify.application.footer +
                this.$vuetify.application.bar);
            if (!this.clipped)
                return computedMaxHeight;
            return computedMaxHeight + this.$vuetify.application.top;
        },
        computedTop() {
            if (!this.hasApp)
                return 0;
            let computedTop = this.$vuetify.application.bar;
            computedTop += this.clipped
                ? this.$vuetify.application.top
                : 0;
            return computedTop;
        },
        computedTransform() {
            if (this.isActive)
                return 0;
            if (this.isBottom)
                return 100;
            return this.right ? 100 : -100;
        },
        computedWidth() {
            return this.isMiniVariant ? this.miniVariantWidth : this.width;
        },
        hasApp() {
            return (this.app &&
                (!this.isMobile && !this.temporary));
        },
        isBottom() {
            return this.bottom && this.isMobile;
        },
        isMiniVariant() {
            return (!this.expandOnHover &&
                this.miniVariant) || (this.expandOnHover &&
                !this.isMouseover);
        },
        isMobile() {
            return (!this.stateless &&
                !this.permanent &&
                Mobile.computed.isMobile.call(this));
        },
        reactsToClick() {
            return (!this.stateless &&
                !this.permanent &&
                (this.isMobile || this.temporary));
        },
        reactsToMobile() {
            return (this.app &&
                !this.disableResizeWatcher &&
                !this.permanent &&
                !this.stateless &&
                !this.temporary);
        },
        reactsToResize() {
            return !this.disableResizeWatcher && !this.stateless;
        },
        reactsToRoute() {
            return (!this.disableRouteWatcher &&
                !this.stateless &&
                (this.temporary || this.isMobile));
        },
        showOverlay() {
            return (!this.hideOverlay &&
                this.isActive &&
                (this.isMobile || this.temporary));
        },
        styles() {
            const translate = this.isBottom ? 'translateY' : 'translateX';
            return {
                height: convertToUnit(this.$height),
                top: !this.isBottom ? convertToUnit(this.computedTop) : 'auto',
                maxHeight: this.computedMaxHeight != null
                    ? `calc(100% - ${convertToUnit(this.computedMaxHeight)})`
                    : undefined,
                transform: `${translate}(${convertToUnit(this.computedTransform, '%')})`,
                width: convertToUnit(this.computedWidth),
            };
        },
    },
    watch: {
        $route: 'onRouteChange',
        isActive(val) {
            this.$emit('update:modelValue', val);
        },
        /**
         * When mobile changes, adjust the active state
         * only when there has been a previous value
         */
        isMobile(val, prev) {
            !val &&
                this.isActive &&
                !this.temporary &&
                this.removeOverlay();
            if (prev == null ||
                !this.reactsToResize ||
                !this.reactsToMobile)
                return;
            this.isActive = !val;
        },
        permanent(val) {
            // If enabling prop enable the drawer
            if (val)
                this.isActive = true;
        },
        showOverlay(val) {
            if (val)
                this.genOverlay();
            else
                this.removeOverlay();
        },
        modelValue(val) {
            if (this.permanent)
                return;
            if (val == null) {
                this.init();
                return;
            }
            if (val !== this.isActive)
                this.isActive = val;
        },
        expandOnHover: 'updateMiniVariant',
        isMouseover(val) {
            this.updateMiniVariant(!val);
        },
    },
    created() {
        const breakingProps = [
            ['value', 'modelValue'],
            ['onInput', 'onUpdate:modelValue'],
        ];
        /* istanbul ignore next */
        breakingProps.forEach(([original, replacement]) => {
            if (this.$attrs.hasOwnProperty(original))
                breaking(original, replacement, this);
        });
    },
    beforeMount() {
        this.init();
    },
    methods: {
        calculateTouchArea() {
            const parent = this.$el.parentNode;
            if (!parent)
                return;
            const parentRect = parent.getBoundingClientRect();
            this.touchArea = {
                left: parentRect.left + 50,
                right: parentRect.right - 50,
            };
        },
        closeConditional() {
            return this.isActive && !this._isDestroyed && this.reactsToClick;
        },
        genAppend() {
            return this.genPosition('append');
        },
        genBackground() {
            const props = {
                height: '100%',
                width: '100%',
                src: this.src,
            };
            const image = this.$slots.img
                ? this.$slots.img(props)
                : h(VImg, { props });
            return h('div', {
                class: 'v-navigation-drawer__image',
            }, [image]);
        },
        genDirectives() {
            return [
                [
                    ClickOutside,
                    {
                        handler: () => { this.isActive = false; },
                        closeConditional: this.closeConditional,
                        include: this.getOpenDependentElements,
                    },
                ],
                [
                    Touch,
                    {
                        parent: true,
                        left: this.swipeLeft,
                        right: this.swipeRight,
                        isDirActive: !this.touchless && !this.stateless,
                    },
                ],
            ];
        },
        genListeners() {
            const on = {
                onMouseenter: () => (this.isMouseover = true),
                onMouseleave: () => (this.isMouseover = false),
                onTransitionend: (e) => {
                    if (e.target !== e.currentTarget)
                        return;
                    this.$emit('transitionend', e);
                    // IE11 does not support new Event('resize')
                    const resizeEvent = document.createEvent('UIEvents');
                    resizeEvent.initUIEvent('resize', true, false, window, 0);
                    window.dispatchEvent(resizeEvent);
                },
            };
            if (this.miniVariant) {
                on.onClick = () => this.$emit('update:mini-variant', false);
            }
            return on;
        },
        genPosition(name) {
            const slot = getSlot(this, name);
            if (!slot)
                return slot;
            return h('div', {
                class: `v-navigation-drawer__${name}`,
            }, slot);
        },
        genPrepend() {
            return this.genPosition('prepend');
        },
        genContent() {
            return h('div', {
                class: 'v-navigation-drawer__content',
            }, getSlot(this));
        },
        genBorder() {
            return h('div', {
                class: 'v-navigation-drawer__border',
            });
        },
        init() {
            if (this.permanent) {
                this.isActive = true;
            }
            else if (this.stateless ||
                this.modelValue != null) {
                this.isActive = this.modelValue;
            }
            else if (!this.temporary) {
                this.isActive = !this.isMobile;
            }
        },
        onRouteChange() {
            if (this.reactsToRoute && this.closeConditional()) {
                this.isActive = false;
            }
        },
        swipeLeft(e) {
            if (this.isActive && this.right)
                return;
            this.calculateTouchArea();
            if (Math.abs(e.touchendX - e.touchstartX) < 100)
                return;
            if (this.right &&
                e.touchstartX >= this.touchArea.right)
                this.isActive = true;
            else if (!this.right && this.isActive)
                this.isActive = false;
        },
        swipeRight(e) {
            if (this.isActive && !this.right)
                return;
            this.calculateTouchArea();
            if (Math.abs(e.touchendX - e.touchstartX) < 100)
                return;
            if (!this.right &&
                e.touchstartX <= this.touchArea.left)
                this.isActive = true;
            else if (this.right && this.isActive)
                this.isActive = false;
        },
        /**
         * Update the application layout
         */
        updateApplication() {
            if (!this.isActive ||
                this.isMobile ||
                this.temporary ||
                !this.$el)
                return 0;
            const width = Number(this.miniVariant ? this.miniVariantWidth : this.width);
            return isNaN(width) ? this.$el.clientWidth : width;
        },
        updateMiniVariant(val) {
            if (this.expandOnHover && this.miniVariant !== val)
                this.$emit('update:mini-variant', val);
        },
    },
    render() {
        const children = [
            this.genPrepend(),
            this.genContent(),
            this.genAppend(),
            this.genBorder(),
        ];
        if (this.src || getSlot(this, 'img'))
            children.unshift(this.genBackground());
        const node = h(this.$tag, this.setBackgroundColor(this.color, {
            class: this.classes,
            style: this.styles,
            ...this.genListeners(),
        }), children);
        return withDirectives(node, this.genDirectives());
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVk5hdmlnYXRpb25EcmF3ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WTmF2aWdhdGlvbkRyYXdlci9WTmF2aWdhdGlvbkRyYXdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxNQUFNLEtBQUssQ0FBQTtBQUN2QyxTQUFTO0FBQ1QsT0FBTywwQkFBMEIsQ0FBQTtBQUVqQyxhQUFhO0FBQ2IsT0FBTyxJQUFtQixNQUFNLGNBQWMsQ0FBQTtBQUU5QyxTQUFTO0FBQ1QsT0FBTyxlQUFlLE1BQU0sOEJBQThCLENBQUE7QUFDMUQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxNQUFNLE1BQU0scUJBQXFCLENBQUE7QUFDeEMsT0FBTyxXQUFXLE1BQU0sMEJBQTBCLENBQUE7QUFDbEQsT0FBTyxXQUFXLE1BQU0sMkJBQTJCLENBQUE7QUFDbkQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsYUFBYTtBQUNiLE9BQU8sWUFBWSxNQUFNLGdDQUFnQyxDQUFBO0FBRXpELE9BQU8sS0FBSyxNQUFNLHdCQUF3QixDQUFBO0FBRTFDLFlBQVk7QUFDWixPQUFPLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQzNELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUM3QyxPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQU10QyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQ3ZCLGVBQWUsQ0FBQyxNQUFNLEVBQUU7SUFDdEIsVUFBVTtJQUNWLFVBQVU7SUFDVixhQUFhO0lBQ2IsZUFBZTtJQUNmLFdBQVc7SUFDWCxPQUFPO0lBQ1AsV0FBVztJQUNYLE9BQU87Q0FDUixDQUFDLEVBQ0YsU0FBUyxFQUNULFNBQVMsRUFDVCxNQUFNLEVBQ04sV0FBVyxFQUNYLFdBQVcsRUFDWCxTQUFTLENBQ1YsQ0FBQTtBQUVELG9CQUFvQjtBQUNwQixlQUFlLFVBQVUsQ0FBQyxNQUFNLENBQUM7SUFDL0IsSUFBSSxFQUFFLHFCQUFxQjtJQUUzQixPQUFPO1FBQ0wsT0FBTztZQUNMLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUs7U0FDN0IsQ0FBQTtJQUNILENBQUM7SUFFRCxLQUFLLEVBQUU7UUFDTCxNQUFNLEVBQUUsT0FBTztRQUNmLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLG9CQUFvQixFQUFFLE9BQU87UUFDN0IsbUJBQW1CLEVBQUUsT0FBTztRQUM1QixhQUFhLEVBQUUsT0FBTztRQUN0QixRQUFRLEVBQUUsT0FBTztRQUNqQixNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1NBQ3ZCO1FBQ0QsV0FBVyxFQUFFLE9BQU87UUFDcEIsZ0JBQWdCLEVBQUU7WUFDaEIsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsRUFBRTtTQUNaO1FBQ0QsU0FBUyxFQUFFLE9BQU87UUFDbEIsS0FBSyxFQUFFLE9BQU87UUFDZCxHQUFHLEVBQUU7WUFDSCxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFpQztZQUN0RCxPQUFPLEVBQUUsRUFBRTtTQUNaO1FBQ0QsU0FBUyxFQUFFLE9BQU87UUFDbEIsR0FBRyxFQUFFO1lBQ0gsSUFBSSxFQUFFLE1BQU07U0FDYjtRQUNELFNBQVMsRUFBRSxPQUFPO1FBQ2xCLFNBQVMsRUFBRSxPQUFPO1FBQ2xCLEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLEdBQUc7U0FDYjtRQUNELFVBQVUsRUFBRSxJQUFnQztLQUM3QztJQUVELEtBQUssRUFBRSxDQUFDLG1CQUFtQixFQUFFLGVBQWUsRUFBRSxxQkFBcUIsQ0FBQztJQUVwRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNYLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLFNBQVMsRUFBRTtZQUNULElBQUksRUFBRSxDQUFDO1lBQ1AsS0FBSyxFQUFFLENBQUM7U0FDVDtRQUNELGNBQWMsRUFBRSxDQUFDO0tBQ2xCLENBQUM7SUFFRixRQUFRLEVBQUU7UUFDUixJQUFJO1lBQ0YsT0FBTyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1FBQy9DLENBQUM7UUFDRCxPQUFPO1lBQ0wsT0FBTyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNyRCxDQUFDO1FBQ0Q7OztXQUdHO1FBQ0gsbUJBQW1CO1lBQ2pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUE7UUFDdEMsQ0FBQztRQUNELE9BQU87WUFDTCxPQUFPO2dCQUNMLHFCQUFxQixFQUFFLElBQUk7Z0JBQzNCLCtCQUErQixFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUM5Qyw2QkFBNkIsRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDMUMsOEJBQThCLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQzVDLDRCQUE0QixFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVE7Z0JBQzVDLDRCQUE0QixFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDeEUsK0JBQStCLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQzlDLGdDQUFnQyxFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUMvQyxtQ0FBbUMsRUFBRSxJQUFJLENBQUMsV0FBVztnQkFDckQsbUNBQW1DLEVBQUUsSUFBSSxDQUFDLGFBQWE7Z0JBQ3ZELDBDQUEwQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFO2dCQUNoRiwyQkFBMkIsRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDMUMsb0NBQW9DLEVBQUUsSUFBSSxDQUFDLGFBQWE7Z0JBQ3hELDRCQUE0QixFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUN4QyxnQ0FBZ0MsRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDaEQsR0FBRyxJQUFJLENBQUMsWUFBWTthQUNyQixDQUFBO1FBQ0gsQ0FBQztRQUNELGlCQUFpQjtZQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtnQkFBRSxPQUFPLElBQUksQ0FBQTtZQUU3QixNQUFNLGlCQUFpQixHQUFHLENBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU07Z0JBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU07Z0JBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FDOUIsQ0FBQTtZQUVELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTztnQkFBRSxPQUFPLGlCQUFpQixDQUFBO1lBRTNDLE9BQU8saUJBQWlCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFBO1FBQzFELENBQUM7UUFDRCxXQUFXO1lBQ1QsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNO2dCQUFFLE9BQU8sQ0FBQyxDQUFBO1lBRTFCLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQTtZQUUvQyxXQUFXLElBQUksSUFBSSxDQUFDLE9BQU87Z0JBQ3pCLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFHO2dCQUMvQixDQUFDLENBQUMsQ0FBQyxDQUFBO1lBRUwsT0FBTyxXQUFXLENBQUE7UUFDcEIsQ0FBQztRQUNELGlCQUFpQjtZQUNmLElBQUksSUFBSSxDQUFDLFFBQVE7Z0JBQUUsT0FBTyxDQUFDLENBQUE7WUFDM0IsSUFBSSxJQUFJLENBQUMsUUFBUTtnQkFBRSxPQUFPLEdBQUcsQ0FBQTtZQUM3QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUE7UUFDaEMsQ0FBQztRQUNELGFBQWE7WUFDWCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQTtRQUNoRSxDQUFDO1FBQ0QsTUFBTTtZQUNKLE9BQU8sQ0FDTCxJQUFJLENBQUMsR0FBRztnQkFDUixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FDcEMsQ0FBQTtRQUNILENBQUM7UUFDRCxRQUFRO1lBQ04sT0FBTyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUE7UUFDckMsQ0FBQztRQUNELGFBQWE7WUFDWCxPQUFPLENBQ0wsQ0FBQyxJQUFJLENBQUMsYUFBYTtnQkFDbkIsSUFBSSxDQUFDLFdBQVcsQ0FDakIsSUFBSSxDQUNILElBQUksQ0FBQyxhQUFhO2dCQUNsQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQ2xCLENBQUE7UUFDSCxDQUFDO1FBQ0QsUUFBUTtZQUNOLE9BQU8sQ0FDTCxDQUFDLElBQUksQ0FBQyxTQUFTO2dCQUNmLENBQUMsSUFBSSxDQUFDLFNBQVM7Z0JBQ2YsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUNwQyxDQUFBO1FBQ0gsQ0FBQztRQUNELGFBQWE7WUFDWCxPQUFPLENBQ0wsQ0FBQyxJQUFJLENBQUMsU0FBUztnQkFDZixDQUFDLElBQUksQ0FBQyxTQUFTO2dCQUNmLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQ2xDLENBQUE7UUFDSCxDQUFDO1FBQ0QsY0FBYztZQUNaLE9BQU8sQ0FDTCxJQUFJLENBQUMsR0FBRztnQkFDUixDQUFDLElBQUksQ0FBQyxvQkFBb0I7Z0JBQzFCLENBQUMsSUFBSSxDQUFDLFNBQVM7Z0JBQ2YsQ0FBQyxJQUFJLENBQUMsU0FBUztnQkFDZixDQUFDLElBQUksQ0FBQyxTQUFTLENBQ2hCLENBQUE7UUFDSCxDQUFDO1FBQ0QsY0FBYztZQUNaLE9BQU8sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFBO1FBQ3RELENBQUM7UUFDRCxhQUFhO1lBQ1gsT0FBTyxDQUNMLENBQUMsSUFBSSxDQUFDLG1CQUFtQjtnQkFDekIsQ0FBQyxJQUFJLENBQUMsU0FBUztnQkFDZixDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUNsQyxDQUFBO1FBQ0gsQ0FBQztRQUNELFdBQVc7WUFDVCxPQUFPLENBQ0wsQ0FBQyxJQUFJLENBQUMsV0FBVztnQkFDakIsSUFBSSxDQUFDLFFBQVE7Z0JBQ2IsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FDbEMsQ0FBQTtRQUNILENBQUM7UUFDRCxNQUFNO1lBQ0osTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUE7WUFDN0QsT0FBTztnQkFDTCxNQUFNLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ25DLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU07Z0JBQzlELFNBQVMsRUFBRSxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSTtvQkFDdkMsQ0FBQyxDQUFDLGVBQWUsYUFBYSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHO29CQUN6RCxDQUFDLENBQUMsU0FBUztnQkFDYixTQUFTLEVBQUUsR0FBRyxTQUFTLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQUMsR0FBRztnQkFDeEUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO2FBQ3pDLENBQUE7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxLQUFLLEVBQUU7UUFDTCxNQUFNLEVBQUUsZUFBZTtRQUN2QixRQUFRLENBQUUsR0FBRztZQUNYLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDdEMsQ0FBQztRQUNEOzs7V0FHRztRQUNILFFBQVEsQ0FBRSxHQUFHLEVBQUUsSUFBSTtZQUNqQixDQUFDLEdBQUc7Z0JBQ0YsSUFBSSxDQUFDLFFBQVE7Z0JBQ2IsQ0FBQyxJQUFJLENBQUMsU0FBUztnQkFDZixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7WUFFdEIsSUFBSSxJQUFJLElBQUksSUFBSTtnQkFDZCxDQUFDLElBQUksQ0FBQyxjQUFjO2dCQUNwQixDQUFDLElBQUksQ0FBQyxjQUFjO2dCQUNwQixPQUFNO1lBRVIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQTtRQUN0QixDQUFDO1FBQ0QsU0FBUyxDQUFFLEdBQUc7WUFDWixxQ0FBcUM7WUFDckMsSUFBSSxHQUFHO2dCQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO1FBQy9CLENBQUM7UUFDRCxXQUFXLENBQUUsR0FBRztZQUNkLElBQUksR0FBRztnQkFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7O2dCQUNyQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7UUFDM0IsQ0FBQztRQUNELFVBQVUsQ0FBRSxHQUFHO1lBQ2IsSUFBSSxJQUFJLENBQUMsU0FBUztnQkFBRSxPQUFNO1lBRTFCLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtnQkFDZixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7Z0JBQ1gsT0FBTTthQUNQO1lBRUQsSUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLFFBQVE7Z0JBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUE7UUFDaEQsQ0FBQztRQUNELGFBQWEsRUFBRSxtQkFBbUI7UUFDbEMsV0FBVyxDQUFFLEdBQUc7WUFDZCxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUM5QixDQUFDO0tBQ0Y7SUFFRCxPQUFPO1FBQ0wsTUFBTSxhQUFhLEdBQUc7WUFDcEIsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDO1lBQ3ZCLENBQUMsU0FBUyxFQUFFLHFCQUFxQixDQUFDO1NBQ25DLENBQUE7UUFFRCwwQkFBMEI7UUFDMUIsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxFQUFFLEVBQUU7WUFDaEQsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUM7Z0JBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDakYsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUNiLENBQUM7SUFFRCxPQUFPLEVBQUU7UUFDUCxrQkFBa0I7WUFDaEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFxQixDQUFBO1lBRTdDLElBQUksQ0FBQyxNQUFNO2dCQUFFLE9BQU07WUFFbkIsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUE7WUFFakQsSUFBSSxDQUFDLFNBQVMsR0FBRztnQkFDZixJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUksR0FBRyxFQUFFO2dCQUMxQixLQUFLLEVBQUUsVUFBVSxDQUFDLEtBQUssR0FBRyxFQUFFO2FBQzdCLENBQUE7UUFDSCxDQUFDO1FBQ0QsZ0JBQWdCO1lBQ2QsT0FBTyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFBO1FBQ2xFLENBQUM7UUFDRCxTQUFTO1lBQ1AsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ25DLENBQUM7UUFDRCxhQUFhO1lBQ1gsTUFBTSxLQUFLLEdBQUc7Z0JBQ1osTUFBTSxFQUFFLE1BQU07Z0JBQ2QsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO2FBQ2QsQ0FBQTtZQUVELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRztnQkFDM0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztnQkFDeEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO1lBRXRCLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTtnQkFDZCxLQUFLLEVBQUUsNEJBQTRCO2FBQ3BDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO1FBQ2IsQ0FBQztRQUNELGFBQWE7WUFDWCxPQUFPO2dCQUNMO29CQUNFLFlBQVk7b0JBQ1o7d0JBQ0UsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBLENBQUMsQ0FBQzt3QkFDeEMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjt3QkFDdkMsT0FBTyxFQUFFLElBQUksQ0FBQyx3QkFBd0I7cUJBQ3ZDO2lCQUNGO2dCQUNEO29CQUNFLEtBQUs7b0JBQ0w7d0JBQ0UsTUFBTSxFQUFFLElBQUk7d0JBQ1osSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTO3dCQUNwQixLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVU7d0JBQ3RCLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUztxQkFDaEQ7aUJBQ0Y7YUFDRixDQUFBO1FBQ0gsQ0FBQztRQUNELFlBQVk7WUFDVixNQUFNLEVBQUUsR0FBdUM7Z0JBQzdDLFlBQVksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO2dCQUM3QyxZQUFZLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztnQkFDOUMsZUFBZSxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUU7b0JBQzVCLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsYUFBYTt3QkFBRSxPQUFNO29CQUN4QyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQTtvQkFFOUIsNENBQTRDO29CQUM1QyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFBO29CQUNwRCxXQUFXLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQTtvQkFDekQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQTtnQkFDbkMsQ0FBQzthQUNGLENBQUE7WUFFRCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3BCLEVBQUUsQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLENBQUMsQ0FBQTthQUM1RDtZQUVELE9BQU8sRUFBRSxDQUFBO1FBQ1gsQ0FBQztRQUNELFdBQVcsQ0FBRSxJQUEwQjtZQUNyQyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFBO1lBRWhDLElBQUksQ0FBQyxJQUFJO2dCQUFFLE9BQU8sSUFBSSxDQUFBO1lBRXRCLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTtnQkFDZCxLQUFLLEVBQUUsd0JBQXdCLElBQUksRUFBRTthQUN0QyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQ1YsQ0FBQztRQUNELFVBQVU7WUFDUixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDcEMsQ0FBQztRQUNELFVBQVU7WUFDUixPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2QsS0FBSyxFQUFFLDhCQUE4QjthQUN0QyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBQ25CLENBQUM7UUFDRCxTQUFTO1lBQ1AsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO2dCQUNkLEtBQUssRUFBRSw2QkFBNkI7YUFDckMsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELElBQUk7WUFDRixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO2FBQ3JCO2lCQUFNLElBQUksSUFBSSxDQUFDLFNBQVM7Z0JBQ3ZCLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxFQUN2QjtnQkFDQSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUE7YUFDaEM7aUJBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFBO2FBQy9CO1FBQ0gsQ0FBQztRQUNELGFBQWE7WUFDWCxJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFLEVBQUU7Z0JBQ2pELElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO2FBQ3RCO1FBQ0gsQ0FBQztRQUNELFNBQVMsQ0FBRSxDQUFlO1lBQ3hCLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSztnQkFBRSxPQUFNO1lBQ3ZDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFBO1lBRXpCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxHQUFHO2dCQUFFLE9BQU07WUFDdkQsSUFBSSxJQUFJLENBQUMsS0FBSztnQkFDWixDQUFDLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSztnQkFDckMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7aUJBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxRQUFRO2dCQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO1FBQzlELENBQUM7UUFDRCxVQUFVLENBQUUsQ0FBZTtZQUN6QixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztnQkFBRSxPQUFNO1lBQ3hDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFBO1lBRXpCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxHQUFHO2dCQUFFLE9BQU07WUFDdkQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLO2dCQUNiLENBQUMsQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJO2dCQUNwQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtpQkFDakIsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxRQUFRO2dCQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO1FBQzdELENBQUM7UUFDRDs7V0FFRztRQUNILGlCQUFpQjtZQUNmLElBQ0UsQ0FBQyxJQUFJLENBQUMsUUFBUTtnQkFDZCxJQUFJLENBQUMsUUFBUTtnQkFDYixJQUFJLENBQUMsU0FBUztnQkFDZCxDQUFDLElBQUksQ0FBQyxHQUFHO2dCQUNULE9BQU8sQ0FBQyxDQUFBO1lBRVYsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBRTNFLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBO1FBQ3BELENBQUM7UUFDRCxpQkFBaUIsQ0FBRSxHQUFZO1lBQzdCLElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLEdBQUc7Z0JBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUM1RixDQUFDO0tBQ0Y7SUFFRCxNQUFNO1FBQ0osTUFBTSxRQUFRLEdBQUc7WUFDZixJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDakIsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNoQixJQUFJLENBQUMsU0FBUyxFQUFFO1NBQ2pCLENBQUE7UUFFRCxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7WUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFBO1FBRTVFLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQzVELEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTztZQUNuQixLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbEIsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFO1NBQ3ZCLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQTtRQUViLE9BQU8sY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCwgd2l0aERpcmVjdGl2ZXMgfSBmcm9tICd2dWUnXG4vLyBTdHlsZXNcbmltcG9ydCAnLi9WTmF2aWdhdGlvbkRyYXdlci5zYXNzJ1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgVkltZywgeyBzcmNPYmplY3QgfSBmcm9tICcuLi9WSW1nL1ZJbWcnXG5cbi8vIE1peGluc1xuaW1wb3J0IEFwcGxpY2F0aW9uYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvYXBwbGljYXRpb25hYmxlJ1xuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xuaW1wb3J0IERlcGVuZGVudCBmcm9tICcuLi8uLi9taXhpbnMvZGVwZW5kZW50J1xuaW1wb3J0IE1vYmlsZSBmcm9tICcuLi8uLi9taXhpbnMvbW9iaWxlJ1xuaW1wb3J0IE92ZXJsYXlhYmxlIGZyb20gJy4uLy4uL21peGlucy9vdmVybGF5YWJsZSdcbmltcG9ydCBTU1JCb290YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvc3NyLWJvb3RhYmxlJ1xuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xuXG4vLyBEaXJlY3RpdmVzXG5pbXBvcnQgQ2xpY2tPdXRzaWRlIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvY2xpY2stb3V0c2lkZSdcbmltcG9ydCBSZXNpemUgZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9yZXNpemUnXG5pbXBvcnQgVG91Y2ggZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy90b3VjaCdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBjb252ZXJ0VG9Vbml0LCBnZXRTbG90IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IHsgYnJlYWtpbmcgfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUsIFZOb2RlRGlyZWN0aXZlLCBQcm9wVHlwZSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7IFRvdWNoV3JhcHBlciB9IGZyb20gJ3Z1ZXRpZnkvdHlwZXMnXG5cbmNvbnN0IGJhc2VNaXhpbnMgPSBtaXhpbnMoXG4gIEFwcGxpY2F0aW9uYWJsZSgnbGVmdCcsIFtcbiAgICAnaXNBY3RpdmUnLFxuICAgICdpc01vYmlsZScsXG4gICAgJ21pbmlWYXJpYW50JyxcbiAgICAnZXhwYW5kT25Ib3ZlcicsXG4gICAgJ3Blcm1hbmVudCcsXG4gICAgJ3JpZ2h0JyxcbiAgICAndGVtcG9yYXJ5JyxcbiAgICAnd2lkdGgnLFxuICBdKSxcbiAgQ29sb3JhYmxlLFxuICBEZXBlbmRlbnQsXG4gIE1vYmlsZSxcbiAgT3ZlcmxheWFibGUsXG4gIFNTUkJvb3RhYmxlLFxuICBUaGVtZWFibGVcbilcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGJhc2VNaXhpbnMuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtbmF2aWdhdGlvbi1kcmF3ZXInLFxuXG4gIHByb3ZpZGUgKCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzSW5OYXY6IHRoaXMuJHRhZyA9PT0gJ25hdicsXG4gICAgfVxuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgYm90dG9tOiBCb29sZWFuLFxuICAgIGNsaXBwZWQ6IEJvb2xlYW4sXG4gICAgZGlzYWJsZVJlc2l6ZVdhdGNoZXI6IEJvb2xlYW4sXG4gICAgZGlzYWJsZVJvdXRlV2F0Y2hlcjogQm9vbGVhbixcbiAgICBleHBhbmRPbkhvdmVyOiBCb29sZWFuLFxuICAgIGZsb2F0aW5nOiBCb29sZWFuLFxuICAgIGhlaWdodDoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICB9LFxuICAgIG1pbmlWYXJpYW50OiBCb29sZWFuLFxuICAgIG1pbmlWYXJpYW50V2lkdGg6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiA1NixcbiAgICB9LFxuICAgIHBlcm1hbmVudDogQm9vbGVhbixcbiAgICByaWdodDogQm9vbGVhbixcbiAgICBzcmM6IHtcbiAgICAgIHR5cGU6IFtTdHJpbmcsIE9iamVjdF0gYXMgUHJvcFR5cGU8c3RyaW5nIHwgc3JjT2JqZWN0PixcbiAgICAgIGRlZmF1bHQ6ICcnLFxuICAgIH0sXG4gICAgc3RhdGVsZXNzOiBCb29sZWFuLFxuICAgIHRhZzoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgIH0sXG4gICAgdGVtcG9yYXJ5OiBCb29sZWFuLFxuICAgIHRvdWNobGVzczogQm9vbGVhbixcbiAgICB3aWR0aDoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDI1NixcbiAgICB9LFxuICAgIG1vZGVsVmFsdWU6IG51bGwgYXMgdW5rbm93biBhcyBQcm9wVHlwZTxhbnk+LFxuICB9LFxuXG4gIGVtaXRzOiBbJ3VwZGF0ZTptb2RlbFZhbHVlJywgJ3RyYW5zaXRpb25lbmQnLCAndXBkYXRlOm1pbmktdmFyaWFudCddLFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgaXNNb3VzZW92ZXI6IGZhbHNlLFxuICAgIHRvdWNoQXJlYToge1xuICAgICAgbGVmdDogMCxcbiAgICAgIHJpZ2h0OiAwLFxuICAgIH0sXG4gICAgc3RhY2tNaW5aSW5kZXg6IDYsXG4gIH0pLFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgJHRhZyAoKSB7XG4gICAgICByZXR1cm4gdGhpcy50YWcgfHwgdGhpcy5hcHAgPyAnbmF2JyA6ICdhc2lkZSdcbiAgICB9LFxuICAgICRoZWlnaHQgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0IHx8ICh0aGlzLmFwcCA/ICcxMDB2aCcgOiAnMTAwJScpXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBVc2VkIGZvciBzZXR0aW5nIGFuIGFwcCB2YWx1ZSBmcm9tIGEgZHluYW1pY1xuICAgICAqIHByb3BlcnR5LiBDYWxsZWQgZnJvbSBhcHBsaWNhdGlvbmFibGUuanNcbiAgICAgKi9cbiAgICBhcHBsaWNhdGlvblByb3BlcnR5ICgpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuIHRoaXMucmlnaHQgPyAncmlnaHQnIDogJ2xlZnQnXG4gICAgfSxcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ3YtbmF2aWdhdGlvbi1kcmF3ZXInOiB0cnVlLFxuICAgICAgICAndi1uYXZpZ2F0aW9uLWRyYXdlci0tYWJzb2x1dGUnOiB0aGlzLmFic29sdXRlLFxuICAgICAgICAndi1uYXZpZ2F0aW9uLWRyYXdlci0tYm90dG9tJzogdGhpcy5ib3R0b20sXG4gICAgICAgICd2LW5hdmlnYXRpb24tZHJhd2VyLS1jbGlwcGVkJzogdGhpcy5jbGlwcGVkLFxuICAgICAgICAndi1uYXZpZ2F0aW9uLWRyYXdlci0tY2xvc2UnOiAhdGhpcy5pc0FjdGl2ZSxcbiAgICAgICAgJ3YtbmF2aWdhdGlvbi1kcmF3ZXItLWZpeGVkJzogIXRoaXMuYWJzb2x1dGUgJiYgKHRoaXMuYXBwIHx8IHRoaXMuZml4ZWQpLFxuICAgICAgICAndi1uYXZpZ2F0aW9uLWRyYXdlci0tZmxvYXRpbmcnOiB0aGlzLmZsb2F0aW5nLFxuICAgICAgICAndi1uYXZpZ2F0aW9uLWRyYXdlci0taXMtbW9iaWxlJzogdGhpcy5pc01vYmlsZSxcbiAgICAgICAgJ3YtbmF2aWdhdGlvbi1kcmF3ZXItLWlzLW1vdXNlb3Zlcic6IHRoaXMuaXNNb3VzZW92ZXIsXG4gICAgICAgICd2LW5hdmlnYXRpb24tZHJhd2VyLS1taW5pLXZhcmlhbnQnOiB0aGlzLmlzTWluaVZhcmlhbnQsXG4gICAgICAgICd2LW5hdmlnYXRpb24tZHJhd2VyLS1jdXN0b20tbWluaS12YXJpYW50JzogTnVtYmVyKHRoaXMubWluaVZhcmlhbnRXaWR0aCkgIT09IDU2LFxuICAgICAgICAndi1uYXZpZ2F0aW9uLWRyYXdlci0tb3Blbic6IHRoaXMuaXNBY3RpdmUsXG4gICAgICAgICd2LW5hdmlnYXRpb24tZHJhd2VyLS1vcGVuLW9uLWhvdmVyJzogdGhpcy5leHBhbmRPbkhvdmVyLFxuICAgICAgICAndi1uYXZpZ2F0aW9uLWRyYXdlci0tcmlnaHQnOiB0aGlzLnJpZ2h0LFxuICAgICAgICAndi1uYXZpZ2F0aW9uLWRyYXdlci0tdGVtcG9yYXJ5JzogdGhpcy50ZW1wb3JhcnksXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzLFxuICAgICAgfVxuICAgIH0sXG4gICAgY29tcHV0ZWRNYXhIZWlnaHQgKCk6IG51bWJlciB8IG51bGwge1xuICAgICAgaWYgKCF0aGlzLmhhc0FwcCkgcmV0dXJuIG51bGxcblxuICAgICAgY29uc3QgY29tcHV0ZWRNYXhIZWlnaHQgPSAoXG4gICAgICAgIHRoaXMuJHZ1ZXRpZnkuYXBwbGljYXRpb24uYm90dG9tICtcbiAgICAgICAgdGhpcy4kdnVldGlmeS5hcHBsaWNhdGlvbi5mb290ZXIgK1xuICAgICAgICB0aGlzLiR2dWV0aWZ5LmFwcGxpY2F0aW9uLmJhclxuICAgICAgKVxuXG4gICAgICBpZiAoIXRoaXMuY2xpcHBlZCkgcmV0dXJuIGNvbXB1dGVkTWF4SGVpZ2h0XG5cbiAgICAgIHJldHVybiBjb21wdXRlZE1heEhlaWdodCArIHRoaXMuJHZ1ZXRpZnkuYXBwbGljYXRpb24udG9wXG4gICAgfSxcbiAgICBjb21wdXRlZFRvcCAoKTogbnVtYmVyIHtcbiAgICAgIGlmICghdGhpcy5oYXNBcHApIHJldHVybiAwXG5cbiAgICAgIGxldCBjb21wdXRlZFRvcCA9IHRoaXMuJHZ1ZXRpZnkuYXBwbGljYXRpb24uYmFyXG5cbiAgICAgIGNvbXB1dGVkVG9wICs9IHRoaXMuY2xpcHBlZFxuICAgICAgICA/IHRoaXMuJHZ1ZXRpZnkuYXBwbGljYXRpb24udG9wXG4gICAgICAgIDogMFxuXG4gICAgICByZXR1cm4gY29tcHV0ZWRUb3BcbiAgICB9LFxuICAgIGNvbXB1dGVkVHJhbnNmb3JtICgpOiBudW1iZXIge1xuICAgICAgaWYgKHRoaXMuaXNBY3RpdmUpIHJldHVybiAwXG4gICAgICBpZiAodGhpcy5pc0JvdHRvbSkgcmV0dXJuIDEwMFxuICAgICAgcmV0dXJuIHRoaXMucmlnaHQgPyAxMDAgOiAtMTAwXG4gICAgfSxcbiAgICBjb21wdXRlZFdpZHRoICgpOiBzdHJpbmcgfCBudW1iZXIge1xuICAgICAgcmV0dXJuIHRoaXMuaXNNaW5pVmFyaWFudCA/IHRoaXMubWluaVZhcmlhbnRXaWR0aCA6IHRoaXMud2lkdGhcbiAgICB9LFxuICAgIGhhc0FwcCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICB0aGlzLmFwcCAmJlxuICAgICAgICAoIXRoaXMuaXNNb2JpbGUgJiYgIXRoaXMudGVtcG9yYXJ5KVxuICAgICAgKVxuICAgIH0sXG4gICAgaXNCb3R0b20gKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuYm90dG9tICYmIHRoaXMuaXNNb2JpbGVcbiAgICB9LFxuICAgIGlzTWluaVZhcmlhbnQgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgIXRoaXMuZXhwYW5kT25Ib3ZlciAmJlxuICAgICAgICB0aGlzLm1pbmlWYXJpYW50XG4gICAgICApIHx8IChcbiAgICAgICAgdGhpcy5leHBhbmRPbkhvdmVyICYmXG4gICAgICAgICF0aGlzLmlzTW91c2VvdmVyXG4gICAgICApXG4gICAgfSxcbiAgICBpc01vYmlsZSAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICAhdGhpcy5zdGF0ZWxlc3MgJiZcbiAgICAgICAgIXRoaXMucGVybWFuZW50ICYmXG4gICAgICAgIE1vYmlsZS5jb21wdXRlZC5pc01vYmlsZS5jYWxsKHRoaXMpXG4gICAgICApXG4gICAgfSxcbiAgICByZWFjdHNUb0NsaWNrICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgICF0aGlzLnN0YXRlbGVzcyAmJlxuICAgICAgICAhdGhpcy5wZXJtYW5lbnQgJiZcbiAgICAgICAgKHRoaXMuaXNNb2JpbGUgfHwgdGhpcy50ZW1wb3JhcnkpXG4gICAgICApXG4gICAgfSxcbiAgICByZWFjdHNUb01vYmlsZSAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICB0aGlzLmFwcCAmJlxuICAgICAgICAhdGhpcy5kaXNhYmxlUmVzaXplV2F0Y2hlciAmJlxuICAgICAgICAhdGhpcy5wZXJtYW5lbnQgJiZcbiAgICAgICAgIXRoaXMuc3RhdGVsZXNzICYmXG4gICAgICAgICF0aGlzLnRlbXBvcmFyeVxuICAgICAgKVxuICAgIH0sXG4gICAgcmVhY3RzVG9SZXNpemUgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuICF0aGlzLmRpc2FibGVSZXNpemVXYXRjaGVyICYmICF0aGlzLnN0YXRlbGVzc1xuICAgIH0sXG4gICAgcmVhY3RzVG9Sb3V0ZSAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICAhdGhpcy5kaXNhYmxlUm91dGVXYXRjaGVyICYmXG4gICAgICAgICF0aGlzLnN0YXRlbGVzcyAmJlxuICAgICAgICAodGhpcy50ZW1wb3JhcnkgfHwgdGhpcy5pc01vYmlsZSlcbiAgICAgIClcbiAgICB9LFxuICAgIHNob3dPdmVybGF5ICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgICF0aGlzLmhpZGVPdmVybGF5ICYmXG4gICAgICAgIHRoaXMuaXNBY3RpdmUgJiZcbiAgICAgICAgKHRoaXMuaXNNb2JpbGUgfHwgdGhpcy50ZW1wb3JhcnkpXG4gICAgICApXG4gICAgfSxcbiAgICBzdHlsZXMgKCk6IG9iamVjdCB7XG4gICAgICBjb25zdCB0cmFuc2xhdGUgPSB0aGlzLmlzQm90dG9tID8gJ3RyYW5zbGF0ZVknIDogJ3RyYW5zbGF0ZVgnXG4gICAgICByZXR1cm4ge1xuICAgICAgICBoZWlnaHQ6IGNvbnZlcnRUb1VuaXQodGhpcy4kaGVpZ2h0KSxcbiAgICAgICAgdG9wOiAhdGhpcy5pc0JvdHRvbSA/IGNvbnZlcnRUb1VuaXQodGhpcy5jb21wdXRlZFRvcCkgOiAnYXV0bycsXG4gICAgICAgIG1heEhlaWdodDogdGhpcy5jb21wdXRlZE1heEhlaWdodCAhPSBudWxsXG4gICAgICAgICAgPyBgY2FsYygxMDAlIC0gJHtjb252ZXJ0VG9Vbml0KHRoaXMuY29tcHV0ZWRNYXhIZWlnaHQpfSlgXG4gICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIHRyYW5zZm9ybTogYCR7dHJhbnNsYXRlfSgke2NvbnZlcnRUb1VuaXQodGhpcy5jb21wdXRlZFRyYW5zZm9ybSwgJyUnKX0pYCxcbiAgICAgICAgd2lkdGg6IGNvbnZlcnRUb1VuaXQodGhpcy5jb21wdXRlZFdpZHRoKSxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgJHJvdXRlOiAnb25Sb3V0ZUNoYW5nZScsXG4gICAgaXNBY3RpdmUgKHZhbCkge1xuICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOm1vZGVsVmFsdWUnLCB2YWwpXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBXaGVuIG1vYmlsZSBjaGFuZ2VzLCBhZGp1c3QgdGhlIGFjdGl2ZSBzdGF0ZVxuICAgICAqIG9ubHkgd2hlbiB0aGVyZSBoYXMgYmVlbiBhIHByZXZpb3VzIHZhbHVlXG4gICAgICovXG4gICAgaXNNb2JpbGUgKHZhbCwgcHJldikge1xuICAgICAgIXZhbCAmJlxuICAgICAgICB0aGlzLmlzQWN0aXZlICYmXG4gICAgICAgICF0aGlzLnRlbXBvcmFyeSAmJlxuICAgICAgICB0aGlzLnJlbW92ZU92ZXJsYXkoKVxuXG4gICAgICBpZiAocHJldiA9PSBudWxsIHx8XG4gICAgICAgICF0aGlzLnJlYWN0c1RvUmVzaXplIHx8XG4gICAgICAgICF0aGlzLnJlYWN0c1RvTW9iaWxlXG4gICAgICApIHJldHVyblxuXG4gICAgICB0aGlzLmlzQWN0aXZlID0gIXZhbFxuICAgIH0sXG4gICAgcGVybWFuZW50ICh2YWwpIHtcbiAgICAgIC8vIElmIGVuYWJsaW5nIHByb3AgZW5hYmxlIHRoZSBkcmF3ZXJcbiAgICAgIGlmICh2YWwpIHRoaXMuaXNBY3RpdmUgPSB0cnVlXG4gICAgfSxcbiAgICBzaG93T3ZlcmxheSAodmFsKSB7XG4gICAgICBpZiAodmFsKSB0aGlzLmdlbk92ZXJsYXkoKVxuICAgICAgZWxzZSB0aGlzLnJlbW92ZU92ZXJsYXkoKVxuICAgIH0sXG4gICAgbW9kZWxWYWx1ZSAodmFsKSB7XG4gICAgICBpZiAodGhpcy5wZXJtYW5lbnQpIHJldHVyblxuXG4gICAgICBpZiAodmFsID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5pbml0KClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmICh2YWwgIT09IHRoaXMuaXNBY3RpdmUpIHRoaXMuaXNBY3RpdmUgPSB2YWxcbiAgICB9LFxuICAgIGV4cGFuZE9uSG92ZXI6ICd1cGRhdGVNaW5pVmFyaWFudCcsXG4gICAgaXNNb3VzZW92ZXIgKHZhbCkge1xuICAgICAgdGhpcy51cGRhdGVNaW5pVmFyaWFudCghdmFsKVxuICAgIH0sXG4gIH0sXG5cbiAgY3JlYXRlZCAoKSB7XG4gICAgY29uc3QgYnJlYWtpbmdQcm9wcyA9IFtcbiAgICAgIFsndmFsdWUnLCAnbW9kZWxWYWx1ZSddLFxuICAgICAgWydvbklucHV0JywgJ29uVXBkYXRlOm1vZGVsVmFsdWUnXSxcbiAgICBdXG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGJyZWFraW5nUHJvcHMuZm9yRWFjaCgoW29yaWdpbmFsLCByZXBsYWNlbWVudF0pID0+IHtcbiAgICAgIGlmICh0aGlzLiRhdHRycy5oYXNPd25Qcm9wZXJ0eShvcmlnaW5hbCkpIGJyZWFraW5nKG9yaWdpbmFsLCByZXBsYWNlbWVudCwgdGhpcylcbiAgICB9KVxuICB9LFxuXG4gIGJlZm9yZU1vdW50ICgpIHtcbiAgICB0aGlzLmluaXQoKVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBjYWxjdWxhdGVUb3VjaEFyZWEgKCkge1xuICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy4kZWwucGFyZW50Tm9kZSBhcyBFbGVtZW50XG5cbiAgICAgIGlmICghcGFyZW50KSByZXR1cm5cblxuICAgICAgY29uc3QgcGFyZW50UmVjdCA9IHBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgICB0aGlzLnRvdWNoQXJlYSA9IHtcbiAgICAgICAgbGVmdDogcGFyZW50UmVjdC5sZWZ0ICsgNTAsXG4gICAgICAgIHJpZ2h0OiBwYXJlbnRSZWN0LnJpZ2h0IC0gNTAsXG4gICAgICB9XG4gICAgfSxcbiAgICBjbG9zZUNvbmRpdGlvbmFsICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzQWN0aXZlICYmICF0aGlzLl9pc0Rlc3Ryb3llZCAmJiB0aGlzLnJlYWN0c1RvQ2xpY2tcbiAgICB9LFxuICAgIGdlbkFwcGVuZCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZW5Qb3NpdGlvbignYXBwZW5kJylcbiAgICB9LFxuICAgIGdlbkJhY2tncm91bmQgKCkge1xuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICBzcmM6IHRoaXMuc3JjLFxuICAgICAgfVxuXG4gICAgICBjb25zdCBpbWFnZSA9IHRoaXMuJHNsb3RzLmltZ1xuICAgICAgICA/IHRoaXMuJHNsb3RzLmltZyhwcm9wcylcbiAgICAgICAgOiBoKFZJbWcsIHsgcHJvcHMgfSlcblxuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6ICd2LW5hdmlnYXRpb24tZHJhd2VyX19pbWFnZScsXG4gICAgICB9LCBbaW1hZ2VdKVxuICAgIH0sXG4gICAgZ2VuRGlyZWN0aXZlcyAoKTogVk5vZGVEaXJlY3RpdmVbXSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICBbXG4gICAgICAgICAgQ2xpY2tPdXRzaWRlLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGhhbmRsZXI6ICgpID0+IHsgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlIH0sXG4gICAgICAgICAgICBjbG9zZUNvbmRpdGlvbmFsOiB0aGlzLmNsb3NlQ29uZGl0aW9uYWwsXG4gICAgICAgICAgICBpbmNsdWRlOiB0aGlzLmdldE9wZW5EZXBlbmRlbnRFbGVtZW50cyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgVG91Y2gsXG4gICAgICAgICAge1xuICAgICAgICAgICAgcGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zd2lwZUxlZnQsXG4gICAgICAgICAgICByaWdodDogdGhpcy5zd2lwZVJpZ2h0LFxuICAgICAgICAgICAgaXNEaXJBY3RpdmU6ICF0aGlzLnRvdWNobGVzcyAmJiAhdGhpcy5zdGF0ZWxlc3MsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIF1cbiAgICB9LFxuICAgIGdlbkxpc3RlbmVycyAoKSB7XG4gICAgICBjb25zdCBvbjogUmVjb3JkPHN0cmluZywgKGU6IEV2ZW50KSA9PiB2b2lkPiA9IHtcbiAgICAgICAgb25Nb3VzZWVudGVyOiAoKSA9PiAodGhpcy5pc01vdXNlb3ZlciA9IHRydWUpLFxuICAgICAgICBvbk1vdXNlbGVhdmU6ICgpID0+ICh0aGlzLmlzTW91c2VvdmVyID0gZmFsc2UpLFxuICAgICAgICBvblRyYW5zaXRpb25lbmQ6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGlmIChlLnRhcmdldCAhPT0gZS5jdXJyZW50VGFyZ2V0KSByZXR1cm5cbiAgICAgICAgICB0aGlzLiRlbWl0KCd0cmFuc2l0aW9uZW5kJywgZSlcblxuICAgICAgICAgIC8vIElFMTEgZG9lcyBub3Qgc3VwcG9ydCBuZXcgRXZlbnQoJ3Jlc2l6ZScpXG4gICAgICAgICAgY29uc3QgcmVzaXplRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnVUlFdmVudHMnKVxuICAgICAgICAgIHJlc2l6ZUV2ZW50LmluaXRVSUV2ZW50KCdyZXNpemUnLCB0cnVlLCBmYWxzZSwgd2luZG93LCAwKVxuICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KHJlc2l6ZUV2ZW50KVxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5taW5pVmFyaWFudCkge1xuICAgICAgICBvbi5vbkNsaWNrID0gKCkgPT4gdGhpcy4kZW1pdCgndXBkYXRlOm1pbmktdmFyaWFudCcsIGZhbHNlKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gb25cbiAgICB9LFxuICAgIGdlblBvc2l0aW9uIChuYW1lOiAncHJlcGVuZCcgfCAnYXBwZW5kJykge1xuICAgICAgY29uc3Qgc2xvdCA9IGdldFNsb3QodGhpcywgbmFtZSlcblxuICAgICAgaWYgKCFzbG90KSByZXR1cm4gc2xvdFxuXG4gICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogYHYtbmF2aWdhdGlvbi1kcmF3ZXJfXyR7bmFtZX1gLFxuICAgICAgfSwgc2xvdClcbiAgICB9LFxuICAgIGdlblByZXBlbmQgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2VuUG9zaXRpb24oJ3ByZXBlbmQnKVxuICAgIH0sXG4gICAgZ2VuQ29udGVudCAoKSB7XG4gICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogJ3YtbmF2aWdhdGlvbi1kcmF3ZXJfX2NvbnRlbnQnLFxuICAgICAgfSwgZ2V0U2xvdCh0aGlzKSlcbiAgICB9LFxuICAgIGdlbkJvcmRlciAoKSB7XG4gICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogJ3YtbmF2aWdhdGlvbi1kcmF3ZXJfX2JvcmRlcicsXG4gICAgICB9KVxuICAgIH0sXG4gICAgaW5pdCAoKSB7XG4gICAgICBpZiAodGhpcy5wZXJtYW5lbnQpIHtcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IHRydWVcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZWxlc3MgfHxcbiAgICAgICAgdGhpcy5tb2RlbFZhbHVlICE9IG51bGxcbiAgICAgICkge1xuICAgICAgICB0aGlzLmlzQWN0aXZlID0gdGhpcy5tb2RlbFZhbHVlXG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLnRlbXBvcmFyeSkge1xuICAgICAgICB0aGlzLmlzQWN0aXZlID0gIXRoaXMuaXNNb2JpbGVcbiAgICAgIH1cbiAgICB9LFxuICAgIG9uUm91dGVDaGFuZ2UgKCkge1xuICAgICAgaWYgKHRoaXMucmVhY3RzVG9Sb3V0ZSAmJiB0aGlzLmNsb3NlQ29uZGl0aW9uYWwoKSkge1xuICAgICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICAgIHN3aXBlTGVmdCAoZTogVG91Y2hXcmFwcGVyKSB7XG4gICAgICBpZiAodGhpcy5pc0FjdGl2ZSAmJiB0aGlzLnJpZ2h0KSByZXR1cm5cbiAgICAgIHRoaXMuY2FsY3VsYXRlVG91Y2hBcmVhKClcblxuICAgICAgaWYgKE1hdGguYWJzKGUudG91Y2hlbmRYIC0gZS50b3VjaHN0YXJ0WCkgPCAxMDApIHJldHVyblxuICAgICAgaWYgKHRoaXMucmlnaHQgJiZcbiAgICAgICAgZS50b3VjaHN0YXJ0WCA+PSB0aGlzLnRvdWNoQXJlYS5yaWdodFxuICAgICAgKSB0aGlzLmlzQWN0aXZlID0gdHJ1ZVxuICAgICAgZWxzZSBpZiAoIXRoaXMucmlnaHQgJiYgdGhpcy5pc0FjdGl2ZSkgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlXG4gICAgfSxcbiAgICBzd2lwZVJpZ2h0IChlOiBUb3VjaFdyYXBwZXIpIHtcbiAgICAgIGlmICh0aGlzLmlzQWN0aXZlICYmICF0aGlzLnJpZ2h0KSByZXR1cm5cbiAgICAgIHRoaXMuY2FsY3VsYXRlVG91Y2hBcmVhKClcblxuICAgICAgaWYgKE1hdGguYWJzKGUudG91Y2hlbmRYIC0gZS50b3VjaHN0YXJ0WCkgPCAxMDApIHJldHVyblxuICAgICAgaWYgKCF0aGlzLnJpZ2h0ICYmXG4gICAgICAgIGUudG91Y2hzdGFydFggPD0gdGhpcy50b3VjaEFyZWEubGVmdFxuICAgICAgKSB0aGlzLmlzQWN0aXZlID0gdHJ1ZVxuICAgICAgZWxzZSBpZiAodGhpcy5yaWdodCAmJiB0aGlzLmlzQWN0aXZlKSB0aGlzLmlzQWN0aXZlID0gZmFsc2VcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSB0aGUgYXBwbGljYXRpb24gbGF5b3V0XG4gICAgICovXG4gICAgdXBkYXRlQXBwbGljYXRpb24gKCkge1xuICAgICAgaWYgKFxuICAgICAgICAhdGhpcy5pc0FjdGl2ZSB8fFxuICAgICAgICB0aGlzLmlzTW9iaWxlIHx8XG4gICAgICAgIHRoaXMudGVtcG9yYXJ5IHx8XG4gICAgICAgICF0aGlzLiRlbFxuICAgICAgKSByZXR1cm4gMFxuXG4gICAgICBjb25zdCB3aWR0aCA9IE51bWJlcih0aGlzLm1pbmlWYXJpYW50ID8gdGhpcy5taW5pVmFyaWFudFdpZHRoIDogdGhpcy53aWR0aClcblxuICAgICAgcmV0dXJuIGlzTmFOKHdpZHRoKSA/IHRoaXMuJGVsLmNsaWVudFdpZHRoIDogd2lkdGhcbiAgICB9LFxuICAgIHVwZGF0ZU1pbmlWYXJpYW50ICh2YWw6IGJvb2xlYW4pIHtcbiAgICAgIGlmICh0aGlzLmV4cGFuZE9uSG92ZXIgJiYgdGhpcy5taW5pVmFyaWFudCAhPT0gdmFsKSB0aGlzLiRlbWl0KCd1cGRhdGU6bWluaS12YXJpYW50JywgdmFsKVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBbXG4gICAgICB0aGlzLmdlblByZXBlbmQoKSxcbiAgICAgIHRoaXMuZ2VuQ29udGVudCgpLFxuICAgICAgdGhpcy5nZW5BcHBlbmQoKSxcbiAgICAgIHRoaXMuZ2VuQm9yZGVyKCksXG4gICAgXVxuXG4gICAgaWYgKHRoaXMuc3JjIHx8IGdldFNsb3QodGhpcywgJ2ltZycpKSBjaGlsZHJlbi51bnNoaWZ0KHRoaXMuZ2VuQmFja2dyb3VuZCgpKVxuXG4gICAgY29uc3Qgbm9kZSA9IGgodGhpcy4kdGFnLCB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmNvbG9yLCB7XG4gICAgICBjbGFzczogdGhpcy5jbGFzc2VzLFxuICAgICAgc3R5bGU6IHRoaXMuc3R5bGVzLFxuICAgICAgLi4udGhpcy5nZW5MaXN0ZW5lcnMoKSxcbiAgICB9KSwgY2hpbGRyZW4pXG5cbiAgICByZXR1cm4gd2l0aERpcmVjdGl2ZXMobm9kZSwgdGhpcy5nZW5EaXJlY3RpdmVzKCkpXG4gIH0sXG59KSJdfQ==