import { h, vShow, withDirectives } from 'vue';
// Styles
import './VAlert.sass';
// Extensions
import VSheet from '../VSheet';
// Components
import VBtn from '../VBtn';
import VIcon from '../VIcon';
// Mixins
import Toggleable from '../../mixins/toggleable';
import Themeable from '../../mixins/themeable';
import Transitionable from '../../mixins/transitionable';
// Utilities
import mixins from '../../util/mixins';
import { breaking } from '../../util/console';
import { getSlot } from '../../util/helpers';
// Types
import { Transition } from 'vue';
/* @vue/component */
export default mixins(VSheet, Toggleable, Transitionable).extend({
    name: 'v-alert',
    emits: ['update:modelValue'],
    props: {
        border: {
            type: String,
            validator(val) {
                return [
                    'top',
                    'right',
                    'bottom',
                    'left',
                ].includes(val);
            },
        },
        closeLabel: {
            type: String,
            default: '$vuetify.close',
        },
        coloredBorder: Boolean,
        dense: Boolean,
        dismissible: Boolean,
        closeIcon: {
            type: String,
            default: '$cancel',
        },
        icon: {
            type: [Boolean, String],
            validator(val) {
                return typeof val === 'string' || val === false;
            },
        },
        outlined: Boolean,
        prominent: Boolean,
        text: Boolean,
        type: {
            type: String,
            validator(val) {
                return [
                    'info',
                    'error',
                    'success',
                    'warning',
                ].includes(val);
            },
        },
        modelValue: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        __cachedBorder() {
            if (!this.border)
                return null;
            let data = {
                class: ['v-alert__border', {
                        [`v-alert__border--${this.border}`]: true,
                    }]
            };
            if (this.coloredBorder) {
                data = this.setBackgroundColor(this.computedColor, data);
                data.class['v-alert__border--has-color'] = true;
            }
            return h('div', data);
        },
        __cachedDismissible() {
            if (!this.dismissible)
                return null;
            const color = this.iconColor;
            return h(VBtn, {
                class: 'v-alert__dismissible',
                color,
                icon: true,
                small: true,
                'aria-label': this.$vuetify.lang.t(this.closeLabel),
                onClick: () => (this.isActive = false),
            }, [
                h(VIcon, {
                    color,
                }, {
                    default: () => this.closeIcon
                }),
            ]);
        },
        __cachedIcon() {
            if (!this.computedIcon)
                return null;
            return h(VIcon, {
                class: 'v-alert__icon',
                color: this.iconColor,
            }, {
                default: () => this.computedIcon
            });
        },
        classes() {
            const classes = {
                ...VSheet.computed.classes.call(this),
                'v-alert--border': Boolean(this.border),
                'v-alert--dense': this.dense,
                'v-alert--outlined': this.outlined,
                'v-alert--prominent': this.prominent,
                'v-alert--text': this.text,
            };
            if (this.border) {
                classes[`v-alert--border-${this.border}`] = true;
            }
            return classes;
        },
        computedColor() {
            return this.color || this.type;
        },
        computedIcon() {
            if (this.icon === false)
                return false;
            if (typeof this.icon === 'string' && this.icon)
                return this.icon;
            if (!['error', 'info', 'success', 'warning'].includes(this.type))
                return false;
            return `$${this.type}`;
        },
        hasColoredIcon() {
            return (this.hasText ||
                (Boolean(this.border) && this.coloredBorder));
        },
        hasText() {
            return this.text || this.outlined;
        },
        iconColor() {
            return this.hasColoredIcon ? this.computedColor : undefined;
        },
        isDark() {
            if (this.type &&
                !this.coloredBorder &&
                !this.outlined)
                return true;
            return Themeable.computed.isDark.call(this);
        },
    },
    created() {
        const breakingProps = [
            ['outline', 'outlined'],
            ['value', 'modelValue'],
            ['onInput', 'onUpdate:modelValue'],
        ];
        /* istanbul ignore next */
        breakingProps.forEach(([original, replacement]) => {
            if (this.$attrs.hasOwnProperty(original))
                breaking(original, replacement, this);
        });
    },
    methods: {
        genWrapper() {
            const children = [
                getSlot(this, 'prepend') || this.__cachedIcon,
                this.genContent(),
                this.__cachedBorder,
                getSlot(this, 'append'),
                this.$slots.close
                    ? this.$slots.close({ toggle: this.toggle })
                    : this.__cachedDismissible,
            ];
            const data = {
                class: 'v-alert__wrapper',
            };
            return h('div', data, children);
        },
        genContent() {
            return h('div', {
                class: 'v-alert__content',
            }, getSlot(this));
        },
        genAlert() {
            let data = {
                class: ['v-alert', this.classes],
                role: 'alert',
                ...this.listeners$,
                style: this.styles
            };
            const directives = [
                [
                    vShow,
                    this.isActive
                ]
            ];
            if (!this.coloredBorder) {
                const setColor = this.hasText ? this.setTextColor : this.setBackgroundColor;
                data = setColor(this.computedColor, data);
            }
            return withDirectives(h('div', data, [this.genWrapper()]), directives);
        },
        /** @public */
        toggle() {
            this.isActive = !this.isActive;
        },
    },
    render() {
        const render = this.genAlert();
        if (!this.transition)
            return render;
        return h(Transition, {
            name: this.transition,
            origin: this.origin,
            mode: this.mode
        }, [render]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkFsZXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkFsZXJ0L1ZBbGVydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUMsTUFBTSxLQUFLLENBQUE7QUFDNUMsU0FBUztBQUNULE9BQU8sZUFBZSxDQUFBO0FBRXRCLGFBQWE7QUFDYixPQUFPLE1BQU0sTUFBTSxXQUFXLENBQUE7QUFFOUIsYUFBYTtBQUNiLE9BQU8sSUFBSSxNQUFNLFNBQVMsQ0FBQTtBQUMxQixPQUFPLEtBQUssTUFBTSxVQUFVLENBQUE7QUFFNUIsU0FBUztBQUNULE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBQ2hELE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sY0FBYyxNQUFNLDZCQUE2QixDQUFBO0FBRXhELFlBQVk7QUFDWixPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUN0QyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDN0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRTVDLFFBQVE7QUFDUixPQUFPLEVBQWEsVUFBVSxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBRzNDLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FDbkIsTUFBTSxFQUNOLFVBQVUsRUFDVixjQUFjLENBQ2YsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsU0FBUztJQUVmLEtBQUssRUFBRSxDQUFDLG1CQUFtQixDQUFDO0lBRTVCLEtBQUssRUFBRTtRQUNMLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxNQUFNO1lBQ1osU0FBUyxDQUFFLEdBQVc7Z0JBQ3BCLE9BQU87b0JBQ0wsS0FBSztvQkFDTCxPQUFPO29CQUNQLFFBQVE7b0JBQ1IsTUFBTTtpQkFDUCxDQUFDLFFBQVEsQ0FBQyxH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O1lBRUQsT0FBTyxjQUFjLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFBO1FBQ3hFLENBQUM7UUFDRCxjQUFjO1FBQ2QsTUFBTTtZQUNKLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFBO1FBQ2hDLENBQUM7S0FDRjtJQUVELE1BQU07UUFDSixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7UUFFOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVO1lBQUUsT0FBTyxNQUFNLENBQUE7UUFFbkMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFO1lBQ25CLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVTtZQUNyQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbkIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1NBQ2hCLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0lBQ2QsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aCwgdlNob3csIHdpdGhEaXJlY3RpdmVzfSBmcm9tICd2dWUnXG4vLyBTdHlsZXNcbmltcG9ydCAnLi9WQWxlcnQuc2FzcydcblxuLy8gRXh0ZW5zaW9uc1xuaW1wb3J0IFZTaGVldCBmcm9tICcuLi9WU2hlZXQnXG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCBWQnRuIGZyb20gJy4uL1ZCdG4nXG5pbXBvcnQgVkljb24gZnJvbSAnLi4vVkljb24nXG5cbi8vIE1peGluc1xuaW1wb3J0IFRvZ2dsZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RvZ2dsZWFibGUnXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXG5pbXBvcnQgVHJhbnNpdGlvbmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RyYW5zaXRpb25hYmxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgeyBicmVha2luZyB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcbmltcG9ydCB7IGdldFNsb3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZURhdGEsIFRyYW5zaXRpb24gfSBmcm9tICd2dWUnXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZS90eXBlcydcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcbiAgVlNoZWV0LFxuICBUb2dnbGVhYmxlLFxuICBUcmFuc2l0aW9uYWJsZVxuKS5leHRlbmQoe1xuICBuYW1lOiAndi1hbGVydCcsXG5cbiAgZW1pdHM6IFsndXBkYXRlOm1vZGVsVmFsdWUnXSxcblxuICBwcm9wczoge1xuICAgIGJvcmRlcjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgdmFsaWRhdG9yICh2YWw6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICd0b3AnLFxuICAgICAgICAgICdyaWdodCcsXG4gICAgICAgICAgJ2JvdHRvbScsXG4gICAgICAgICAgJ2xlZnQnLFxuICAgICAgICBdLmluY2x1ZGVzKHZhbClcbiAgICAgIH0sXG4gICAgfSxcbiAgICBjbG9zZUxhYmVsOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkuY2xvc2UnLFxuICAgIH0sXG4gICAgY29sb3JlZEJvcmRlcjogQm9vbGVhbixcbiAgICBkZW5zZTogQm9vbGVhbixcbiAgICBkaXNtaXNzaWJsZTogQm9vbGVhbixcbiAgICBjbG9zZUljb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckY2FuY2VsJyxcbiAgICB9LFxuICAgIGljb246IHtcbiAgICAgIHR5cGU6IFtCb29sZWFuLCBTdHJpbmddLFxuICAgICAgdmFsaWRhdG9yICh2YWw6IGJvb2xlYW4gfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnIHx8IHZhbCA9PT0gZmFsc2VcbiAgICAgIH0sXG4gICAgfSxcbiAgICBvdXRsaW5lZDogQm9vbGVhbixcbiAgICBwcm9taW5lbnQ6IEJvb2xlYW4sXG4gICAgdGV4dDogQm9vbGVhbixcbiAgICB0eXBlOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICB2YWxpZGF0b3IgKHZhbDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgJ2luZm8nLFxuICAgICAgICAgICdlcnJvcicsXG4gICAgICAgICAgJ3N1Y2Nlc3MnLFxuICAgICAgICAgICd3YXJuaW5nJyxcbiAgICAgICAgXS5pbmNsdWRlcyh2YWwpXG4gICAgICB9LFxuICAgIH0sXG4gICAgbW9kZWxWYWx1ZToge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIF9fY2FjaGVkQm9yZGVyICgpOiBWTm9kZSB8IG51bGwge1xuICAgICAgaWYgKCF0aGlzLmJvcmRlcikgcmV0dXJuIG51bGxcblxuICAgICAgbGV0IGRhdGE6IFZOb2RlRGF0YSA9IHtcbiAgICAgICAgY2xhc3M6IFsndi1hbGVydF9fYm9yZGVyJywge1xuICAgICAgICAgIFtgdi1hbGVydF9fYm9yZGVyLS0ke3RoaXMuYm9yZGVyfWBdOiB0cnVlLFxuICAgICAgICB9XVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jb2xvcmVkQm9yZGVyKSB7XG4gICAgICAgIGRhdGEgPSB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmNvbXB1dGVkQ29sb3IsIGRhdGEpXG4gICAgICAgIGRhdGEuY2xhc3NbJ3YtYWxlcnRfX2JvcmRlci0taGFzLWNvbG9yJ10gPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoKCdkaXYnLCBkYXRhKVxuICAgIH0sXG4gICAgX19jYWNoZWREaXNtaXNzaWJsZSAoKTogVk5vZGUgfCBudWxsIHtcbiAgICAgIGlmICghdGhpcy5kaXNtaXNzaWJsZSkgcmV0dXJuIG51bGxcblxuICAgICAgY29uc3QgY29sb3IgPSB0aGlzLmljb25Db2xvclxuXG4gICAgICByZXR1cm4gaChWQnRuLCB7XG4gICAgICAgIGNsYXNzOiAndi1hbGVydF9fZGlzbWlzc2libGUnLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgaWNvbjogdHJ1ZSxcbiAgICAgICAgc21hbGw6IHRydWUsXG4gICAgICAgICdhcmlhLWxhYmVsJzogdGhpcy4kdnVldGlmeS5sYW5nLnQodGhpcy5jbG9zZUxhYmVsKSxcbiAgICAgICAgb25DbGljazogKCkgPT4gKHRoaXMuaXNBY3RpdmUgPSBmYWxzZSksXG4gICAgICB9LCBbXG4gICAgICAgIGgoVkljb24sIHtcbiAgICAgICAgICBjb2xvcixcbiAgICAgICAgfSwge1xuICAgICAgICAgIGRlZmF1bHQ6ICgpID0+IHRoaXMuY2xvc2VJY29uXG4gICAgICAgIH0pLFxuICAgICAgXSlcbiAgICB9LFxuICAgIF9fY2FjaGVkSWNvbiAoKTogVk5vZGUgfCBudWxsIHtcbiAgICAgIGlmICghdGhpcy5jb21wdXRlZEljb24pIHJldHVybiBudWxsXG5cbiAgICAgIHJldHVybiBoKFZJY29uLCB7XG4gICAgICAgIGNsYXNzOiAndi1hbGVydF9faWNvbicsXG4gICAgICAgIGNvbG9yOiB0aGlzLmljb25Db2xvcixcbiAgICAgIH0sIHtcbiAgICAgICAgZGVmYXVsdDogKCkgPT4gdGhpcy5jb21wdXRlZEljb25cbiAgICAgIH0pXG4gICAgfSxcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xuICAgICAgY29uc3QgY2xhc3NlczogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4gPSB7XG4gICAgICAgIC4uLlZTaGVldC5jb21wdXRlZC5jbGFzc2VzLmNhbGwodGhpcyksXG4gICAgICAgICd2LWFsZXJ0LS1ib3JkZXInOiBCb29sZWFuKHRoaXMuYm9yZGVyKSxcbiAgICAgICAgJ3YtYWxlcnQtLWRlbnNlJzogdGhpcy5kZW5zZSxcbiAgICAgICAgJ3YtYWxlcnQtLW91dGxpbmVkJzogdGhpcy5vdXRsaW5lZCxcbiAgICAgICAgJ3YtYWxlcnQtLXByb21pbmVudCc6IHRoaXMucHJvbWluZW50LFxuICAgICAgICAndi1hbGVydC0tdGV4dCc6IHRoaXMudGV4dCxcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuYm9yZGVyKSB7XG4gICAgICAgIGNsYXNzZXNbYHYtYWxlcnQtLWJvcmRlci0ke3RoaXMuYm9yZGVyfWBdID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2xhc3Nlc1xuICAgIH0sXG4gICAgY29tcHV0ZWRDb2xvciAoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbG9yIHx8IHRoaXMudHlwZVxuICAgIH0sXG4gICAgY29tcHV0ZWRJY29uICgpOiBzdHJpbmcgfCBib29sZWFuIHtcbiAgICAgIGlmICh0aGlzLmljb24gPT09IGZhbHNlKSByZXR1cm4gZmFsc2VcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5pY29uID09PSAnc3RyaW5nJyAmJiB0aGlzLmljb24pIHJldHVybiB0aGlzLmljb25cbiAgICAgIGlmICghWydlcnJvcicsICdpbmZvJywgJ3N1Y2Nlc3MnLCAnd2FybmluZyddLmluY2x1ZGVzKHRoaXMudHlwZSkpIHJldHVybiBmYWxzZVxuXG4gICAgICByZXR1cm4gYCQke3RoaXMudHlwZX1gXG4gICAgfSxcbiAgICBoYXNDb2xvcmVkSWNvbiAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICB0aGlzLmhhc1RleHQgfHxcbiAgICAgICAgKEJvb2xlYW4odGhpcy5ib3JkZXIpICYmIHRoaXMuY29sb3JlZEJvcmRlcilcbiAgICAgIClcbiAgICB9LFxuICAgIGhhc1RleHQgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dCB8fCB0aGlzLm91dGxpbmVkXG4gICAgfSxcbiAgICBpY29uQ29sb3IgKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICByZXR1cm4gdGhpcy5oYXNDb2xvcmVkSWNvbiA/IHRoaXMuY29tcHV0ZWRDb2xvciA6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgaXNEYXJrICgpOiBib29sZWFuIHtcbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy50eXBlICYmXG4gICAgICAgICF0aGlzLmNvbG9yZWRCb3JkZXIgJiZcbiAgICAgICAgIXRoaXMub3V0bGluZWRcbiAgICAgICkgcmV0dXJuIHRydWVcblxuICAgICAgcmV0dXJuIFRoZW1lYWJsZS5jb21wdXRlZC5pc0RhcmsuY2FsbCh0aGlzKVxuICAgIH0sXG4gIH0sXG5cbiAgY3JlYXRlZCAoKSB7XG4gICAgY29uc3QgYnJlYWtpbmdQcm9wcyA9IFtcbiAgICAgIFsnb3V0bGluZScsICdvdXRsaW5lZCddLFxuICAgICAgWyd2YWx1ZScsICdtb2RlbFZhbHVlJ10sXG4gICAgICBbJ29uSW5wdXQnLCAnb25VcGRhdGU6bW9kZWxWYWx1ZSddLFxuICAgIF1cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgYnJlYWtpbmdQcm9wcy5mb3JFYWNoKChbb3JpZ2luYWwsIHJlcGxhY2VtZW50XSkgPT4ge1xuICAgICAgaWYgKHRoaXMuJGF0dHJzLmhhc093blByb3BlcnR5KG9yaWdpbmFsKSkgYnJlYWtpbmcob3JpZ2luYWwsIHJlcGxhY2VtZW50LCB0aGlzKVxuICAgIH0pXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGdlbldyYXBwZXIgKCk6IFZOb2RlIHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gW1xuICAgICAgICBnZXRTbG90KHRoaXMsICdwcmVwZW5kJykgfHwgdGhpcy5fX2NhY2hlZEljb24sXG4gICAgICAgIHRoaXMuZ2VuQ29udGVudCgpLFxuICAgICAgICB0aGlzLl9fY2FjaGVkQm9yZGVyLFxuICAgICAgICBnZXRTbG90KHRoaXMsICdhcHBlbmQnKSxcbiAgICAgICAgdGhpcy4kc2xvdHMuY2xvc2VcbiAgICAgICAgICA/IHRoaXMuJHNsb3RzLmNsb3NlKHsgdG9nZ2xlOiB0aGlzLnRvZ2dsZSB9KVxuICAgICAgICAgIDogdGhpcy5fX2NhY2hlZERpc21pc3NpYmxlLFxuICAgICAgXVxuXG4gICAgICBjb25zdCBkYXRhOiBWTm9kZURhdGEgPSB7XG4gICAgICAgIGNsYXNzOiAndi1hbGVydF9fd3JhcHBlcicsXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoKCdkaXYnLCBkYXRhLCBjaGlsZHJlbilcbiAgICB9LFxuICAgIGdlbkNvbnRlbnQgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiAndi1hbGVydF9fY29udGVudCcsXG4gICAgICB9LCBnZXRTbG90KHRoaXMpKVxuICAgIH0sXG4gICAgZ2VuQWxlcnQgKCk6IFZOb2RlIHtcbiAgICAgIGxldCBkYXRhOiBWTm9kZURhdGEgPSB7XG4gICAgICAgIGNsYXNzOiBbJ3YtYWxlcnQnLCB0aGlzLmNsYXNzZXNdLFxuICAgICAgICByb2xlOiAnYWxlcnQnLFxuICAgICAgICAuLi50aGlzLmxpc3RlbmVycyQsXG4gICAgICAgIHN0eWxlOiB0aGlzLnN0eWxlc1xuICAgICAgfVxuXG4gICAgICBjb25zdCBkaXJlY3RpdmVzID0gW1xuICAgICAgICBbXG4gICAgICAgICAgdlNob3csXG4gICAgICAgICAgdGhpcy5pc0FjdGl2ZVxuICAgICAgICBdXG4gICAgICBdXG5cbiAgICAgIGlmICghdGhpcy5jb2xvcmVkQm9yZGVyKSB7XG4gICAgICAgIGNvbnN0IHNldENvbG9yID0gdGhpcy5oYXNUZXh0ID8gdGhpcy5zZXRUZXh0Q29sb3IgOiB0aGlzLnNldEJhY2tncm91bmRDb2xvclxuICAgICAgICBkYXRhID0gc2V0Q29sb3IodGhpcy5jb21wdXRlZENvbG9yLCBkYXRhKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gd2l0aERpcmVjdGl2ZXMoaCgnZGl2JywgZGF0YSwgW3RoaXMuZ2VuV3JhcHBlcigpXSksIGRpcmVjdGl2ZXMpXG4gICAgfSxcbiAgICAvKiogQHB1YmxpYyAqL1xuICAgIHRvZ2dsZSAoKSB7XG4gICAgICB0aGlzLmlzQWN0aXZlID0gIXRoaXMuaXNBY3RpdmVcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoKTogVk5vZGUge1xuICAgIGNvbnN0IHJlbmRlciA9IHRoaXMuZ2VuQWxlcnQoKVxuXG4gICAgaWYgKCF0aGlzLnRyYW5zaXRpb24pIHJldHVybiByZW5kZXJcblxuICAgIHJldHVybiBoKFRyYW5zaXRpb24sIHtcbiAgICAgIG5hbWU6IHRoaXMudHJhbnNpdGlvbixcbiAgICAgIG9yaWdpbjogdGhpcy5vcmlnaW4sXG4gICAgICBtb2RlOiB0aGlzLm1vZGVcbiAgICB9LCBbcmVuZGVyXSlcbiAgfSxcbn0pIl19