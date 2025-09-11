import { h, withDirectives, vShow } from 'vue';
// Styles
import './VBanner.sass';
// Extensions
import VSheet from '../VSheet';
// Components
import VAvatar from '../VAvatar';
import VIcon from '../VIcon';
import { VExpandTransition } from '../transitions';
// Mixins
import Mobile from '../../mixins/mobile';
import Toggleable from '../../mixins/toggleable';
// Utilities
import mixins from '../../util/mixins';
import { convertToUnit, getSlot } from '../../util/helpers';
/* @vue/component */
export default mixins(VSheet, Mobile, Toggleable).extend({
    name: 'v-banner',
    inheritAttrs: false,
    emits: ['update:modelValue', 'click:icon'],
    props: {
        app: Boolean,
        icon: String,
        iconColor: String,
        singleLine: Boolean,
        sticky: Boolean,
        modelValue: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        classes() {
            return {
                ...VSheet.computed.classes.call(this),
                'v-banner--has-icon': this.hasIcon,
                'v-banner--is-mobile': this.isMobile,
                'v-banner--single-line': this.singleLine,
                'v-banner--sticky': this.isSticky,
            };
        },
        hasIcon() {
            return Boolean(this.icon || this.$slots.icon || this.$slots.icon);
        },
        isSticky() {
            return this.sticky || this.app;
        },
        styles() {
            const styles = { ...VSheet.computed.styles.call(this) };
            if (this.isSticky) {
                const top = !this.app
                    ? 0
                    : (this.$vuetify.application.bar + this.$vuetify.application.top);
                styles.top = convertToUnit(top);
                styles.position = 'sticky';
                styles.zIndex = 1;
            }
            return styles;
        },
    },
    methods: {
        /** @public */
        toggle() {
            this.isActive = !this.isActive;
        },
        iconClick(e) {
            this.$emit('click:icon', e);
        },
        genIcon() {
            if (!this.hasIcon)
                return undefined;
            let content;
            if (this.icon) {
                content = h(VIcon, {
                    color: this.iconColor,
                    size: 28
                }, () => [this.icon]);
            }
            else {
                content = getSlot(this, 'icon');
            }
            return h(VAvatar, {
                class: 'v-banner__icon',
                color: this.color,
                size: 40,
                onClick: this.iconClick,
            }, () => [content]);
        },
        genText() {
            return h('div', {
                class: 'v-banner__text',
            }, getSlot(this));
        },
        genActions() {
            const children = getSlot(this, 'actions', {
                dismiss: () => this.isActive = false,
            });
            if (!children)
                return undefined;
            return h('div', {
                class: 'v-banner__actions',
            }, children);
        },
        genContent() {
            return h('div', {
                class: 'v-banner__content',
            }, [
                this.genIcon(),
                this.genText(),
            ]);
        },
        genWrapper() {
            return h('div', {
                class: 'v-banner__wrapper',
            }, [
                this.genContent(),
                this.genActions(),
            ]);
        },
    },
    render() {
        const data = {
            class: ['v-banner', this.classes],
            ...this.$attrs,
            style: this.styles,
        };
        return h(VExpandTransition, {}, () => [
            withDirectives(h('div', this.outlined ? data : this.setBackgroundColor(this.color, data), [this.genWrapper()]), [[vShow, this.isActive]]),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkJhbm5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZCYW5uZXIvVkJhbm5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsTUFBTSxLQUFLLENBQUE7QUFDOUMsU0FBUztBQUNULE9BQU8sZ0JBQWdCLENBQUE7QUFFdkIsYUFBYTtBQUNiLE9BQU8sTUFBTSxNQUFNLFdBQVcsQ0FBQTtBQUU5QixhQUFhO0FBQ2IsT0FBTyxPQUFPLE1BQU0sWUFBWSxDQUFBO0FBQ2hDLE9BQU8sS0FBSyxNQUFNLFVBQVUsQ0FBQTtBQUM1QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUVsRCxTQUFTO0FBQ1QsT0FBTyxNQUFNLE1BQU0scUJBQXFCLENBQUE7QUFDeEMsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFFaEQsWUFBWTtBQUNaLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBQ3RDLE9BQU8sRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFLM0Qsb0JBQW9CO0FBQ3BCLGVBQWUsTUFBTSxDQUNuQixNQUFNLEVBQ04sTUFBTSxFQUNOLFVBQVUsQ0FDWCxDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxVQUFVO0lBRWhCLFlBQVksRUFBRSxLQUFLO0lBRW5CLEtBQUssRUFBRSxDQUFDLG1CQUFtQixFQUFFLFlBQVksQ0FBQztJQUUxQyxLQUFLLEVBQUU7UUFDTCxHQUFHLEVBQUUsT0FBTztRQUNaLElBQUksRUFBRSxNQUFNO1FBQ1osU0FBUyxFQUFFLE1BQU07UUFDakIsVUFBVSxFQUFFLE9BQU87UUFDbkIsTUFBTSxFQUFFLE9BQU87UUFDZixVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxJQUFJO1NBQ2Q7S0FDRjtJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPO2dCQUNMLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDckMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ2xDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUNwQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsVUFBVTtnQkFDeEMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLFFBQVE7YUFDbEMsQ0FBQTtRQUNILENBQUM7UUFDRCxPQUFPO1lBQ0wsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ25FLENBQUM7UUFDRCxRQUFRO1lBQ04sT0FBTyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUE7UUFDaEMsQ0FBQztRQUNELE1BQU07WUFDSixNQUFNLE1BQU0sR0FBd0IsRUFBRSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFBO1lBRTVFLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDakIsTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRztvQkFDbkIsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUVuRSxNQUFNLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDL0IsTUFBTSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7Z0JBQzFCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBO2FBQ2xCO1lBRUQsT0FBTyxNQUFNLENBQUE7UUFDZixDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxjQUFjO1FBQ2QsTUFBTTtZQUNKLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFBO1FBQ2hDLENBQUM7UUFDRCxTQUFTLENBQUUsQ0FBYTtZQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUM3QixDQUFDO1FBQ0QsT0FBTztZQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTztnQkFBRSxPQUFPLFNBQVMsQ0FBQTtZQUVuQyxJQUFJLE9BQU8sQ0FBQTtZQUVYLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDYixPQUFPLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRTtvQkFDakIsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTO29CQUNyQixJQUFJLEVBQUUsRUFBRTtpQkFDVCxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7YUFDdEI7aUJBQU07Z0JBQ0wsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUE7YUFDaEM7WUFFRCxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ2hCLEtBQUssRUFBRSxnQkFBZ0I7Z0JBQ3ZCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDakIsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTO2FBQ3hCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBQ3JCLENBQUM7UUFDRCxPQUFPO1lBQ0wsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO2dCQUNkLEtBQUssRUFBRSxnQkFBZ0I7YUFDeEIsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUNuQixDQUFDO1FBQ0QsVUFBVTtZQUNSLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO2dCQUN4QyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLO2FBQ3JDLENBQUMsQ0FBQTtZQUVGLElBQUksQ0FBQyxRQUFRO2dCQUFFLE9BQU8sU0FBUyxDQUFBO1lBRS9CLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTtnQkFDZCxLQUFLLEVBQUUsbUJBQW1CO2FBQzNCLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFDZCxDQUFDO1FBQ0QsVUFBVTtZQUNSLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTtnQkFDZCxLQUFLLEVBQUUsbUJBQW1CO2FBQzNCLEVBQUU7Z0JBQ0QsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDZCxJQUFJLENBQUMsT0FBTyxFQUFFO2FBQ2YsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELFVBQVU7WUFDUixPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2QsS0FBSyxFQUFFLG1CQUFtQjthQUMzQixFQUFFO2dCQUNELElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxVQUFVLEVBQUU7YUFDbEIsQ0FBQyxDQUFBO1FBQ0osQ0FBQztLQUNGO0lBRUQsTUFBTTtRQUNKLE1BQU0sSUFBSSxHQUFHO1lBQ1gsS0FBSyxFQUFFLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDakMsR0FBRyxJQUFJLENBQUMsTUFBTTtZQUNkLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTTtTQUNuQixDQUFBO1FBRUQsT0FBTyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ3BDLGNBQWMsQ0FDWixDQUFDLENBQ0MsS0FBSyxFQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQ2hFLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQ3BCLEVBQ0QsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FDekI7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCwgd2l0aERpcmVjdGl2ZXMsIHZTaG93IH0gZnJvbSAndnVlJ1xuLy8gU3R5bGVzXG5pbXBvcnQgJy4vVkJhbm5lci5zYXNzJ1xuXG4vLyBFeHRlbnNpb25zXG5pbXBvcnQgVlNoZWV0IGZyb20gJy4uL1ZTaGVldCdcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IFZBdmF0YXIgZnJvbSAnLi4vVkF2YXRhcidcbmltcG9ydCBWSWNvbiBmcm9tICcuLi9WSWNvbidcbmltcG9ydCB7IFZFeHBhbmRUcmFuc2l0aW9uIH0gZnJvbSAnLi4vdHJhbnNpdGlvbnMnXG5cbi8vIE1peGluc1xuaW1wb3J0IE1vYmlsZSBmcm9tICcuLi8uLi9taXhpbnMvbW9iaWxlJ1xuaW1wb3J0IFRvZ2dsZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RvZ2dsZWFibGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IGNvbnZlcnRUb1VuaXQsIGdldFNsb3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcbiAgVlNoZWV0LFxuICBNb2JpbGUsXG4gIFRvZ2dsZWFibGVcbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtYmFubmVyJyxcblxuICBpbmhlcml0QXR0cnM6IGZhbHNlLFxuXG4gIGVtaXRzOiBbJ3VwZGF0ZTptb2RlbFZhbHVlJywgJ2NsaWNrOmljb24nXSxcblxuICBwcm9wczoge1xuICAgIGFwcDogQm9vbGVhbixcbiAgICBpY29uOiBTdHJpbmcsXG4gICAgaWNvbkNvbG9yOiBTdHJpbmcsXG4gICAgc2luZ2xlTGluZTogQm9vbGVhbixcbiAgICBzdGlja3k6IEJvb2xlYW4sXG4gICAgbW9kZWxWYWx1ZToge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5WU2hlZXQuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi1iYW5uZXItLWhhcy1pY29uJzogdGhpcy5oYXNJY29uLFxuICAgICAgICAndi1iYW5uZXItLWlzLW1vYmlsZSc6IHRoaXMuaXNNb2JpbGUsXG4gICAgICAgICd2LWJhbm5lci0tc2luZ2xlLWxpbmUnOiB0aGlzLnNpbmdsZUxpbmUsXG4gICAgICAgICd2LWJhbm5lci0tc3RpY2t5JzogdGhpcy5pc1N0aWNreSxcbiAgICAgIH1cbiAgICB9LFxuICAgIGhhc0ljb24gKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5pY29uIHx8IHRoaXMuJHNsb3RzLmljb24gfHwgdGhpcy4kc2xvdHMuaWNvbilcbiAgICB9LFxuICAgIGlzU3RpY2t5ICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLnN0aWNreSB8fCB0aGlzLmFwcFxuICAgIH0sXG4gICAgc3R5bGVzICgpOiBvYmplY3Qge1xuICAgICAgY29uc3Qgc3R5bGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyAuLi5WU2hlZXQuY29tcHV0ZWQuc3R5bGVzLmNhbGwodGhpcykgfVxuXG4gICAgICBpZiAodGhpcy5pc1N0aWNreSkge1xuICAgICAgICBjb25zdCB0b3AgPSAhdGhpcy5hcHBcbiAgICAgICAgICA/IDBcbiAgICAgICAgICA6ICh0aGlzLiR2dWV0aWZ5LmFwcGxpY2F0aW9uLmJhciArIHRoaXMuJHZ1ZXRpZnkuYXBwbGljYXRpb24udG9wKVxuXG4gICAgICAgIHN0eWxlcy50b3AgPSBjb252ZXJ0VG9Vbml0KHRvcClcbiAgICAgICAgc3R5bGVzLnBvc2l0aW9uID0gJ3N0aWNreSdcbiAgICAgICAgc3R5bGVzLnpJbmRleCA9IDFcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0eWxlc1xuICAgIH0sXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIC8qKiBAcHVibGljICovXG4gICAgdG9nZ2xlICgpIHtcbiAgICAgIHRoaXMuaXNBY3RpdmUgPSAhdGhpcy5pc0FjdGl2ZVxuICAgIH0sXG4gICAgaWNvbkNsaWNrIChlOiBNb3VzZUV2ZW50KSB7XG4gICAgICB0aGlzLiRlbWl0KCdjbGljazppY29uJywgZSlcbiAgICB9LFxuICAgIGdlbkljb24gKCkge1xuICAgICAgaWYgKCF0aGlzLmhhc0ljb24pIHJldHVybiB1bmRlZmluZWRcblxuICAgICAgbGV0IGNvbnRlbnRcblxuICAgICAgaWYgKHRoaXMuaWNvbikge1xuICAgICAgICBjb250ZW50ID0gaChWSWNvbiwge1xuICAgICAgICAgIGNvbG9yOiB0aGlzLmljb25Db2xvcixcbiAgICAgICAgICBzaXplOiAyOFxuICAgICAgICB9LCAoKSA9PiBbdGhpcy5pY29uXSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRlbnQgPSBnZXRTbG90KHRoaXMsICdpY29uJylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGgoVkF2YXRhciwge1xuICAgICAgICBjbGFzczogJ3YtYmFubmVyX19pY29uJyxcbiAgICAgICAgY29sb3I6IHRoaXMuY29sb3IsXG4gICAgICAgIHNpemU6IDQwLFxuICAgICAgICBvbkNsaWNrOiB0aGlzLmljb25DbGljayxcbiAgICAgIH0sICgpID0+IFtjb250ZW50XSlcbiAgICB9LFxuICAgIGdlblRleHQgKCkge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6ICd2LWJhbm5lcl9fdGV4dCcsXG4gICAgICB9LCBnZXRTbG90KHRoaXMpKVxuICAgIH0sXG4gICAgZ2VuQWN0aW9ucyAoKSB7XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IGdldFNsb3QodGhpcywgJ2FjdGlvbnMnLCB7XG4gICAgICAgIGRpc21pc3M6ICgpID0+IHRoaXMuaXNBY3RpdmUgPSBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIGlmICghY2hpbGRyZW4pIHJldHVybiB1bmRlZmluZWRcblxuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6ICd2LWJhbm5lcl9fYWN0aW9ucycsXG4gICAgICB9LCBjaGlsZHJlbilcbiAgICB9LFxuICAgIGdlbkNvbnRlbnQgKCkge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6ICd2LWJhbm5lcl9fY29udGVudCcsXG4gICAgICB9LCBbXG4gICAgICAgIHRoaXMuZ2VuSWNvbigpLFxuICAgICAgICB0aGlzLmdlblRleHQoKSxcbiAgICAgIF0pXG4gICAgfSxcbiAgICBnZW5XcmFwcGVyICgpIHtcbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiAndi1iYW5uZXJfX3dyYXBwZXInLFxuICAgICAgfSwgW1xuICAgICAgICB0aGlzLmdlbkNvbnRlbnQoKSxcbiAgICAgICAgdGhpcy5nZW5BY3Rpb25zKCksXG4gICAgICBdKVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgY29uc3QgZGF0YSA9IHtcbiAgICAgIGNsYXNzOiBbJ3YtYmFubmVyJywgdGhpcy5jbGFzc2VzXSxcbiAgICAgIC4uLnRoaXMuJGF0dHJzLFxuICAgICAgc3R5bGU6IHRoaXMuc3R5bGVzLFxuICAgIH1cblxuICAgIHJldHVybiBoKFZFeHBhbmRUcmFuc2l0aW9uLCB7fSwgKCkgPT4gW1xuICAgICAgd2l0aERpcmVjdGl2ZXMoXG4gICAgICAgIGgoXG4gICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgdGhpcy5vdXRsaW5lZCA/IGRhdGEgOiB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmNvbG9yLCBkYXRhKSxcbiAgICAgICAgICBbdGhpcy5nZW5XcmFwcGVyKCldLFxuICAgICAgICApLFxuICAgICAgICBbW3ZTaG93LCB0aGlzLmlzQWN0aXZlXV0sXG4gICAgICApLFxuICAgIF0pXG4gIH0sXG59KVxuIl19