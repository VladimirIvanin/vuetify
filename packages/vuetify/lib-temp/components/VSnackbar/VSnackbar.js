import { Transition, h, vShow, withDirectives } from 'vue';
// Styles
import './VSnackbar.sass';
// Components
import VSheet from '../VSheet/VSheet';
// Mixins
import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable';
import Toggleable from '../../mixins/toggleable';
import { factory as PositionableFactory } from '../../mixins/positionable';
// Utilities
import mixins from '../../util/mixins';
import { convertToUnit, getSlot } from '../../util/helpers';
import { deprecate, removed } from '../../util/console';
export default mixins(VSheet, Colorable, Toggleable, PositionableFactory([
    'absolute',
    'bottom',
    'left',
    'right',
    'top',
])
/* @vue/component */
).extend({
    name: 'v-snackbar',
    props: {
        app: Boolean,
        centered: Boolean,
        contentClass: {
            type: String,
            default: '',
        },
        multiLine: Boolean,
        text: Boolean,
        timeout: {
            type: [Number, String],
            default: 5000,
        },
        transition: {
            type: [Boolean, String],
            default: 'v-snack-transition',
            validator: v => typeof v === 'string' || v === false,
        },
        vertical: Boolean,
    },
    emits: ['update:modelValue'],
    data: () => ({
        activeTimeout: -1,
    }),
    computed: {
        classes() {
            return {
                'v-snack--absolute': this.absolute,
                'v-snack--active': this.isActive,
                'v-snack--bottom': this.bottom || !this.top,
                'v-snack--centered': this.centered,
                'v-snack--has-background': this.hasBackground,
                'v-snack--left': this.left,
                'v-snack--multi-line': this.multiLine && !this.vertical,
                'v-snack--right': this.right,
                'v-snack--text': this.text,
                'v-snack--top': this.top,
                'v-snack--vertical': this.vertical,
            };
        },
        // Text and outlined styles both
        // use transparent backgrounds
        hasBackground() {
            return (!this.text &&
                !this.outlined);
        },
        // Snackbar is dark by default
        // override themeable logic.
        isDark() {
            return this.hasBackground
                ? !this.light
                : Themeable.computed.isDark.call(this);
        },
        styles() {
            if (this.absolute || !this.app)
                return {};
            const { bar, bottom, footer, insetFooter, left, right, top, } = this.$vuetify.application;
            return {
                paddingBottom: convertToUnit(bottom + footer + insetFooter),
                paddingLeft: convertToUnit(left),
                paddingRight: convertToUnit(right),
                paddingTop: convertToUnit(bar + top),
            };
        },
    },
    watch: {
        isActive: 'setTimeout',
        timeout: 'setTimeout',
    },
    mounted() {
        if (this.isActive)
            this.setTimeout();
    },
    created() {
        /* istanbul ignore next */
        if (this.$attrs.hasOwnProperty('auto-height')) {
            removed('auto-height', this);
        }
        /* istanbul ignore next */
        // eslint-disable-next-line eqeqeq
        if (this.timeout == 0) {
            deprecate('timeout="0"', '-1', this);
        }
    },
    methods: {
        genActions() {
            return h('div', {
                class: 'v-snack__action ',
            }, [
                getSlot(this, 'action', {
                    attrs: { class: 'v-snack__btn' },
                }),
            ]);
        },
        genContent() {
            return h('div', {
                class: ['v-snack__content', {
                        [this.contentClass]: true,
                    }],
                role: 'status',
                'aria-live': 'polite'
            }, [getSlot(this)]);
        },
        genWrapper() {
            const setColor = this.hasBackground
                ? this.setBackgroundColor
                : this.setTextColor;
            const data = setColor(this.color, {
                class: ['v-snack__wrapper', VSheet.computed.classes.call(this)],
                style: VSheet.computed.styles.call(this),
                onPointerenter: () => window.clearTimeout(this.activeTimeout),
                onPointerleave: this.setTimeout
            });
            const directives = [
                [
                    vShow,
                    this.isActive
                ]
            ];
            return withDirectives(h('div', data, [
                this.genContent(),
                this.genActions(),
            ]), directives);
        },
        genTransition() {
            return h(Transition, {
                name: this.transition,
            }, [this.genWrapper()]);
        },
        setTimeout() {
            window.clearTimeout(this.activeTimeout);
            const timeout = Number(this.timeout);
            if (!this.isActive ||
                // TODO: remove 0 in v3
                [0, -1].includes(timeout)) {
                return;
            }
            this.activeTimeout = window.setTimeout(() => {
                this.isActive = false;
            }, timeout);
        },
    },
    render() {
        return h('div', {
            class: ['v-snack', this.classes],
            style: this.styles,
        }, [
            this.transition !== false
                ? this.genTransition()
                : this.genWrapper(),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNuYWNrYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlNuYWNrYmFyL1ZTbmFja2Jhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFDLE1BQU0sS0FBSyxDQUFBO0FBQ3hELFNBQVM7QUFDVCxPQUFPLGtCQUFrQixDQUFBO0FBRXpCLGFBQWE7QUFDYixPQUFPLE1BQU0sTUFBTSxrQkFBa0IsQ0FBQTtBQUVyQyxTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxFQUFFLE9BQU8sSUFBSSxtQkFBbUIsRUFBRSxNQUFNLDJCQUEyQixDQUFBO0FBRTFFLFlBQVk7QUFDWixPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUN0QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQzNELE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFLdkQsZUFBZSxNQUFNLENBQ25CLE1BQU0sRUFDTixTQUFTLEVBQ1QsVUFBVSxFQUNWLG1CQUFtQixDQUFDO0lBQ2xCLFVBQVU7SUFDVixRQUFRO0lBQ1IsTUFBTTtJQUNOLE9BQU87SUFDUCxLQUFLO0NBQ04sQ0FBQztBQUNKLG9CQUFvQjtDQUNuQixDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxZQUFZO0lBRWxCLEtBQUssRUFBRTtRQUNMLEdBQUcsRUFBRSxPQUFPO1FBQ1osUUFBUSxFQUFFLE9BQU87UUFDakIsWUFBWSxFQUFFO1lBQ1osSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsRUFBRTtTQUNaO1FBQ0QsU0FBUyxF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QUVELE1BQU07UUFDSixPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDZCxLQUFLLEVBQUUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUNoQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07U0FDbkIsRUFBRTtZQUNELElBQUksQ0FBQyxVQUFVLEtBQUssS0FBSztnQkFDdkIsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ3RCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO1NBQ3RCLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1RyYW5zaXRpb24sIGgsIHZTaG93LCB3aXRoRGlyZWN0aXZlc30gZnJvbSAndnVlJ1xuLy8gU3R5bGVzXG5pbXBvcnQgJy4vVlNuYWNrYmFyLnNhc3MnXG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCBWU2hlZXQgZnJvbSAnLi4vVlNoZWV0L1ZTaGVldCdcblxuLy8gTWl4aW5zXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXG5pbXBvcnQgVG9nZ2xlYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdG9nZ2xlYWJsZSdcbmltcG9ydCB7IGZhY3RvcnkgYXMgUG9zaXRpb25hYmxlRmFjdG9yeSB9IGZyb20gJy4uLy4uL21peGlucy9wb3NpdGlvbmFibGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IGNvbnZlcnRUb1VuaXQsIGdldFNsb3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5pbXBvcnQgeyBkZXByZWNhdGUsIHJlbW92ZWQgfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBQcm9wVHlwZSwgVk5vZGUgfSBmcm9tICd2dWUnXG5cbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcbiAgVlNoZWV0LFxuICBDb2xvcmFibGUsXG4gIFRvZ2dsZWFibGUsXG4gIFBvc2l0aW9uYWJsZUZhY3RvcnkoW1xuICAgICdhYnNvbHV0ZScsXG4gICAgJ2JvdHRvbScsXG4gICAgJ2xlZnQnLFxuICAgICdyaWdodCcsXG4gICAgJ3RvcCcsXG4gIF0pXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuKS5leHRlbmQoe1xuICBuYW1lOiAndi1zbmFja2JhcicsXG5cbiAgcHJvcHM6IHtcbiAgICBhcHA6IEJvb2xlYW4sXG4gICAgY2VudGVyZWQ6IEJvb2xlYW4sXG4gICAgY29udGVudENsYXNzOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJyxcbiAgICB9LFxuICAgIG11bHRpTGluZTogQm9vbGVhbixcbiAgICB0ZXh0OiBCb29sZWFuLFxuICAgIHRpbWVvdXQ6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiA1MDAwLFxuICAgIH0sXG4gICAgdHJhbnNpdGlvbjoge1xuICAgICAgdHlwZTogW0Jvb2xlYW4sIFN0cmluZ10gYXMgUHJvcFR5cGU8ZmFsc2UgfCBzdHJpbmc+LFxuICAgICAgZGVmYXVsdDogJ3Ytc25hY2stdHJhbnNpdGlvbicsXG4gICAgICB2YWxpZGF0b3I6IHYgPT4gdHlwZW9mIHYgPT09ICdzdHJpbmcnIHx8IHYgPT09IGZhbHNlLFxuICAgIH0sXG4gICAgdmVydGljYWw6IEJvb2xlYW4sXG4gIH0sXG4gIGVtaXRzOiBbJ3VwZGF0ZTptb2RlbFZhbHVlJ10sXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgYWN0aXZlVGltZW91dDogLTEsXG4gIH0pLFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LXNuYWNrLS1hYnNvbHV0ZSc6IHRoaXMuYWJzb2x1dGUsXG4gICAgICAgICd2LXNuYWNrLS1hY3RpdmUnOiB0aGlzLmlzQWN0aXZlLFxuICAgICAgICAndi1zbmFjay0tYm90dG9tJzogdGhpcy5ib3R0b20gfHwgIXRoaXMudG9wLFxuICAgICAgICAndi1zbmFjay0tY2VudGVyZWQnOiB0aGlzLmNlbnRlcmVkLFxuICAgICAgICAndi1zbmFjay0taGFzLWJhY2tncm91bmQnOiB0aGlzLmhhc0JhY2tncm91bmQsXG4gICAgICAgICd2LXNuYWNrLS1sZWZ0JzogdGhpcy5sZWZ0LFxuICAgICAgICAndi1zbmFjay0tbXVsdGktbGluZSc6IHRoaXMubXVsdGlMaW5lICYmICF0aGlzLnZlcnRpY2FsLFxuICAgICAgICAndi1zbmFjay0tcmlnaHQnOiB0aGlzLnJpZ2h0LFxuICAgICAgICAndi1zbmFjay0tdGV4dCc6IHRoaXMudGV4dCxcbiAgICAgICAgJ3Ytc25hY2stLXRvcCc6IHRoaXMudG9wLFxuICAgICAgICAndi1zbmFjay0tdmVydGljYWwnOiB0aGlzLnZlcnRpY2FsLFxuICAgICAgfVxuICAgIH0sXG4gICAgLy8gVGV4dCBhbmQgb3V0bGluZWQgc3R5bGVzIGJvdGhcbiAgICAvLyB1c2UgdHJhbnNwYXJlbnQgYmFja2dyb3VuZHNcbiAgICBoYXNCYWNrZ3JvdW5kICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgICF0aGlzLnRleHQgJiZcbiAgICAgICAgIXRoaXMub3V0bGluZWRcbiAgICAgIClcbiAgICB9LFxuICAgIC8vIFNuYWNrYmFyIGlzIGRhcmsgYnkgZGVmYXVsdFxuICAgIC8vIG92ZXJyaWRlIHRoZW1lYWJsZSBsb2dpYy5cbiAgICBpc0RhcmsgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuaGFzQmFja2dyb3VuZFxuICAgICAgICA/ICF0aGlzLmxpZ2h0XG4gICAgICAgIDogVGhlbWVhYmxlLmNvbXB1dGVkLmlzRGFyay5jYWxsKHRoaXMpXG4gICAgfSxcbiAgICBzdHlsZXMgKCk6IG9iamVjdCB7XG4gICAgICBpZiAodGhpcy5hYnNvbHV0ZSB8fCAhdGhpcy5hcHApIHJldHVybiB7fVxuXG4gICAgICBjb25zdCB7XG4gICAgICAgIGJhcixcbiAgICAgICAgYm90dG9tLFxuICAgICAgICBmb290ZXIsXG4gICAgICAgIGluc2V0Rm9vdGVyLFxuICAgICAgICBsZWZ0LFxuICAgICAgICByaWdodCxcbiAgICAgICAgdG9wLFxuICAgICAgfSA9IHRoaXMuJHZ1ZXRpZnkuYXBwbGljYXRpb25cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcGFkZGluZ0JvdHRvbTogY29udmVydFRvVW5pdChib3R0b20gKyBmb290ZXIgKyBpbnNldEZvb3RlciksXG4gICAgICAgIHBhZGRpbmdMZWZ0OiBjb252ZXJ0VG9Vbml0KGxlZnQpLFxuICAgICAgICBwYWRkaW5nUmlnaHQ6IGNvbnZlcnRUb1VuaXQocmlnaHQpLFxuICAgICAgICBwYWRkaW5nVG9wOiBjb252ZXJ0VG9Vbml0KGJhciArIHRvcCksXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIGlzQWN0aXZlOiAnc2V0VGltZW91dCcsXG4gICAgdGltZW91dDogJ3NldFRpbWVvdXQnLFxuICB9LFxuXG4gIG1vdW50ZWQgKCkge1xuICAgIGlmICh0aGlzLmlzQWN0aXZlKSB0aGlzLnNldFRpbWVvdXQoKVxuICB9LFxuXG4gIGNyZWF0ZWQgKCkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHRoaXMuJGF0dHJzLmhhc093blByb3BlcnR5KCdhdXRvLWhlaWdodCcpKSB7XG4gICAgICByZW1vdmVkKCdhdXRvLWhlaWdodCcsIHRoaXMpXG4gICAgfVxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG4gICAgaWYgKHRoaXMudGltZW91dCA9PSAwKSB7XG4gICAgICBkZXByZWNhdGUoJ3RpbWVvdXQ9XCIwXCInLCAnLTEnLCB0aGlzKVxuICAgIH1cbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2VuQWN0aW9ucyAoKSB7XG4gICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogJ3Ytc25hY2tfX2FjdGlvbiAnLFxuICAgICAgfSwgW1xuICAgICAgICBnZXRTbG90KHRoaXMsICdhY3Rpb24nLCB7XG4gICAgICAgICAgYXR0cnM6IHsgY2xhc3M6ICd2LXNuYWNrX19idG4nIH0sXG4gICAgICAgIH0pLFxuICAgICAgXSlcbiAgICB9LFxuICAgIGdlbkNvbnRlbnQgKCkge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFsndi1zbmFja19fY29udGVudCcsIHtcbiAgICAgICAgICBbdGhpcy5jb250ZW50Q2xhc3NdOiB0cnVlLFxuICAgICAgICB9XSxcbiAgICAgICAgcm9sZTogJ3N0YXR1cycsXG4gICAgICAgICdhcmlhLWxpdmUnOiAncG9saXRlJ1xuICAgICAgfSwgW2dldFNsb3QodGhpcyldKVxuICAgIH0sXG4gICAgZ2VuV3JhcHBlciAoKSB7XG4gICAgICBjb25zdCBzZXRDb2xvciA9IHRoaXMuaGFzQmFja2dyb3VuZFxuICAgICAgICA/IHRoaXMuc2V0QmFja2dyb3VuZENvbG9yXG4gICAgICAgIDogdGhpcy5zZXRUZXh0Q29sb3JcblxuICAgICAgY29uc3QgZGF0YSA9IHNldENvbG9yKHRoaXMuY29sb3IsIHtcbiAgICAgICAgY2xhc3M6IFsndi1zbmFja19fd3JhcHBlcicsIFZTaGVldC5jb21wdXRlZC5jbGFzc2VzLmNhbGwodGhpcyldLFxuICAgICAgICBzdHlsZTogVlNoZWV0LmNvbXB1dGVkLnN0eWxlcy5jYWxsKHRoaXMpLFxuICAgICAgICBvblBvaW50ZXJlbnRlcjogKCkgPT4gd2luZG93LmNsZWFyVGltZW91dCh0aGlzLmFjdGl2ZVRpbWVvdXQpLFxuICAgICAgICBvblBvaW50ZXJsZWF2ZTogdGhpcy5zZXRUaW1lb3V0XG4gICAgICB9KVxuXG4gICAgICBjb25zdCBkaXJlY3RpdmVzID0gW1xuICAgICAgICBbXG4gICAgICAgICAgdlNob3csXG4gICAgICAgICAgdGhpcy5pc0FjdGl2ZVxuICAgICAgICBdXG4gICAgICBdXG5cbiAgICAgIHJldHVybiB3aXRoRGlyZWN0aXZlcyhoKCdkaXYnLCBkYXRhLCBbXG4gICAgICAgIHRoaXMuZ2VuQ29udGVudCgpLFxuICAgICAgICB0aGlzLmdlbkFjdGlvbnMoKSxcbiAgICAgIF0pLCBkaXJlY3RpdmVzKVxuICAgIH0sXG4gICAgZ2VuVHJhbnNpdGlvbiAoKSB7XG4gICAgICByZXR1cm4gaChUcmFuc2l0aW9uLCB7XG4gICAgICAgIG5hbWU6IHRoaXMudHJhbnNpdGlvbixcbiAgICAgIH0sIFt0aGlzLmdlbldyYXBwZXIoKV0pXG4gICAgfSxcbiAgICBzZXRUaW1lb3V0ICgpIHtcbiAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5hY3RpdmVUaW1lb3V0KVxuXG4gICAgICBjb25zdCB0aW1lb3V0ID0gTnVtYmVyKHRoaXMudGltZW91dClcblxuICAgICAgaWYgKFxuICAgICAgICAhdGhpcy5pc0FjdGl2ZSB8fFxuICAgICAgICAvLyBUT0RPOiByZW1vdmUgMCBpbiB2M1xuICAgICAgICBbMCwgLTFdLmluY2x1ZGVzKHRpbWVvdXQpXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuYWN0aXZlVGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlXG4gICAgICB9LCB0aW1lb3V0KVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgIGNsYXNzOiBbJ3Ytc25hY2snLCB0aGlzLmNsYXNzZXNdLFxuICAgICAgc3R5bGU6IHRoaXMuc3R5bGVzLFxuICAgIH0sIFtcbiAgICAgIHRoaXMudHJhbnNpdGlvbiAhPT0gZmFsc2VcbiAgICAgICAgPyB0aGlzLmdlblRyYW5zaXRpb24oKVxuICAgICAgICA6IHRoaXMuZ2VuV3JhcHBlcigpLFxuICAgIF0pXG4gIH0sXG59KVxuIl19