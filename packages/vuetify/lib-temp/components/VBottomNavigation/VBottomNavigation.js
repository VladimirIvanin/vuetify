import { h } from 'vue';
// Styles
import './VBottomNavigation.sass';
// Mixins
import Applicationable from '../../mixins/applicationable';
import ButtonGroup from '../../mixins/button-group';
import Colorable from '../../mixins/colorable';
import Measurable from '../../mixins/measurable';
import Proxyable from '../../mixins/proxyable';
import Scrollable from '../../mixins/scrollable';
import Themeable from '../../mixins/themeable';
import { factory as ToggleableFactory } from '../../mixins/toggleable';
// Utilities
import mixins from '../../util/mixins';
import { breaking } from '../../util/console';
import { getSlot } from '../../util/helpers';
export default mixins(Applicationable('bottom', [
    'height',
    'modelValue',
]), Colorable, Measurable, ToggleableFactory(), Proxyable, Scrollable, Themeable
/* @vue/component */
).extend({
    name: 'v-bottom-navigation',
    props: {
        activeClass: {
            type: String,
            default: 'v-btn--active',
        },
        backgroundColor: String,
        grow: Boolean,
        height: {
            type: [Number, String],
            default: 56,
        },
        hideOnScroll: Boolean,
        horizontal: Boolean,
        modelValue: {
            type: Boolean,
            default: true,
        },
        mandatory: Boolean,
        shift: Boolean,
        tag: {
            type: String,
            default: 'div',
        },
    },
    emits: ['update:modelValue', 'change'],
    data() {
        return {
            isActive: this.modelValue,
        };
    },
    computed: {
        canScroll() {
            return (Scrollable.computed.canScroll.call(this) &&
                (this.hideOnScroll ||
                    !this.modelValue));
        },
        classes() {
            return {
                'v-bottom-navigation--absolute': this.absolute,
                'v-bottom-navigation--grow': this.grow,
                'v-bottom-navigation--fixed': !this.absolute && (this.app || this.fixed),
                'v-bottom-navigation--horizontal': this.horizontal,
                'v-bottom-navigation--shift': this.shift,
            };
        },
        styles() {
            return {
                ...this.measurableStyles,
                transform: this.isActive ? 'none' : 'translateY(100%)',
            };
        },
    },
    watch: {
        canScroll: 'onScroll',
    },
    created() {
        /* istanbul ignore next */
        if (this.$attrs.hasOwnProperty('active')) {
            breaking('active.sync', 'value or v-model', this);
        }
    },
    methods: {
        thresholdMet() {
            if (this.hideOnScroll) {
                this.isActive = !this.isScrollingUp ||
                    this.currentScroll > this.computedScrollThreshold;
                this.$emit('update:modelValue', this.isActive);
            }
            if (this.currentThreshold < this.computedScrollThreshold)
                return;
            this.savedScroll = this.currentScroll;
        },
        updateApplication() {
            return this.$el
                ? this.$el.clientHeight
                : 0;
        },
        updateValue(val) {
            this.$emit('change', val);
        },
    },
    render() {
        const data = this.setBackgroundColor(this.backgroundColor, {
            class: ['v-bottom-navigation', this.classes],
            style: this.styles,
            activeClass: this.activeClass,
            mandatory: Boolean(this.mandatory ||
                this.modelValue !== undefined),
            tag: this.tag,
            modelValue: this.internalValue,
            onChange: this.updateValue
        });
        if (this.canScroll) {
            data.directives = data.directives || [];
            data.directives.push({
                arg: this.scrollTarget,
                name: 'scroll',
                value: this.onScroll,
            });
        }
        return h(ButtonGroup, this.setTextColor(this.color, data), getSlot(this));
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkJvdHRvbU5hdmlnYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WQm90dG9tTmF2aWdhdGlvbi9WQm90dG9tTmF2aWdhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsQ0FBQyxFQUFDLE1BQU0sS0FBSyxDQUFBO0FBQ3JCLFNBQVM7QUFDVCxPQUFPLDBCQUEwQixDQUFBO0FBRWpDLFNBQVM7QUFDVCxPQUFPLGVBQWUsTUFBTSw4QkFBOEIsQ0FBQTtBQUMxRCxPQUFPLFdBQVcsTUFBTSwyQkFBMkIsQ0FBQTtBQUNuRCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLEVBQUUsT0FBTyxJQUFJLGlCQUFpQixFQUFFLE1BQU0seUJBQXlCLENBQUE7QUFFdEUsWUFBWTtBQUNaLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBQ3RDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUM3QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFLNUMsZUFBZSxNQUFNLENBQ25CLGVBQWUsQ0FBQyxRQUFRLEVBQUU7SUFDeEIsUUFBUTtJQUNSLFlBQVk7Q0FDYixDQUFDLEVBQ0YsU0FBUyxFQUNULFVBQVUsRUFDVixpQkFBaUIsRUFBRSxFQUNuQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFNBQVM7QUFDVCxvQkFBb0I7Q0FDckIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUscUJBQXFCO0lBRTNCLEtBQUssRUFBRTtRQUNMLFdBQVcsRUFBRTtZQUNYLElBQUksRUFBRSxN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TUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDekQsS0FBSyxFQUFFLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUM1QyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbEIsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQzdCLFNBQVMsRUFBRSxPQUFPLENBQ2hCLElBQUksQ0FBQyxTQUFTO2dCQUNkLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUM5QjtZQUNELEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztZQUNiLFVBQVUsRUFBRSxJQUFJLENBQUMsYUFBYTtZQUM5QixRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVc7U0FDM0IsQ0FBQyxDQUFBO1FBRUYsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUE7WUFFdkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7Z0JBQ25CLEdBQUcsRUFBRSxJQUFJLENBQUMsWUFBWTtnQkFDdEIsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRO2FBQ3JCLENBQUMsQ0FBQTtTQUNIO1FBRUQsT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUMzRSxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtofSBmcm9tICd2dWUnXG4vLyBTdHlsZXNcbmltcG9ydCAnLi9WQm90dG9tTmF2aWdhdGlvbi5zYXNzJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBBcHBsaWNhdGlvbmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2FwcGxpY2F0aW9uYWJsZSdcbmltcG9ydCBCdXR0b25Hcm91cCBmcm9tICcuLi8uLi9taXhpbnMvYnV0dG9uLWdyb3VwJ1xuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xuaW1wb3J0IE1lYXN1cmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL21lYXN1cmFibGUnXG5pbXBvcnQgUHJveHlhYmxlIGZyb20gJy4uLy4uL21peGlucy9wcm94eWFibGUnXG5pbXBvcnQgU2Nyb2xsYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvc2Nyb2xsYWJsZSdcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcbmltcG9ydCB7IGZhY3RvcnkgYXMgVG9nZ2xlYWJsZUZhY3RvcnkgfSBmcm9tICcuLi8uLi9taXhpbnMvdG9nZ2xlYWJsZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuaW1wb3J0IHsgYnJlYWtpbmcgfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXG5pbXBvcnQgeyBnZXRTbG90IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXG5cbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcbiAgQXBwbGljYXRpb25hYmxlKCdib3R0b20nLCBbXG4gICAgJ2hlaWdodCcsXG4gICAgJ21vZGVsVmFsdWUnLFxuICBdKSxcbiAgQ29sb3JhYmxlLFxuICBNZWFzdXJhYmxlLFxuICBUb2dnbGVhYmxlRmFjdG9yeSgpLFxuICBQcm94eWFibGUsXG4gIFNjcm9sbGFibGUsXG4gIFRoZW1lYWJsZVxuICAvKiBAdnVlL2NvbXBvbmVudCAqL1xuKS5leHRlbmQoe1xuICBuYW1lOiAndi1ib3R0b20tbmF2aWdhdGlvbicsXG5cbiAgcHJvcHM6IHtcbiAgICBhY3RpdmVDbGFzczoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ3YtYnRuLS1hY3RpdmUnLFxuICAgIH0sXG4gICAgYmFja2dyb3VuZENvbG9yOiBTdHJpbmcsXG4gICAgZ3JvdzogQm9vbGVhbixcbiAgICBoZWlnaHQ6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiA1NixcbiAgICB9LFxuICAgIGhpZGVPblNjcm9sbDogQm9vbGVhbixcbiAgICBob3Jpem9udGFsOiBCb29sZWFuLFxuICAgIG1vZGVsVmFsdWU6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgIH0sXG4gICAgbWFuZGF0b3J5OiBCb29sZWFuLFxuICAgIHNoaWZ0OiBCb29sZWFuLFxuICAgIHRhZzoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ2RpdicsXG4gICAgfSxcbiAgfSxcblxuICBlbWl0czogWyd1cGRhdGU6bW9kZWxWYWx1ZScsICdjaGFuZ2UnXSxcblxuICBkYXRhICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaXNBY3RpdmU6IHRoaXMubW9kZWxWYWx1ZSxcbiAgICB9XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjYW5TY3JvbGwgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgU2Nyb2xsYWJsZS5jb21wdXRlZC5jYW5TY3JvbGwuY2FsbCh0aGlzKSAmJlxuICAgICAgICAoXG4gICAgICAgICAgdGhpcy5oaWRlT25TY3JvbGwgfHxcbiAgICAgICAgICAhdGhpcy5tb2RlbFZhbHVlXG4gICAgICAgIClcbiAgICAgIClcbiAgICB9LFxuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAndi1ib3R0b20tbmF2aWdhdGlvbi0tYWJzb2x1dGUnOiB0aGlzLmFic29sdXRlLFxuICAgICAgICAndi1ib3R0b20tbmF2aWdhdGlvbi0tZ3Jvdyc6IHRoaXMuZ3JvdyxcbiAgICAgICAgJ3YtYm90dG9tLW5hdmlnYXRpb24tLWZpeGVkJzogIXRoaXMuYWJzb2x1dGUgJiYgKHRoaXMuYXBwIHx8IHRoaXMuZml4ZWQpLFxuICAgICAgICAndi1ib3R0b20tbmF2aWdhdGlvbi0taG9yaXpvbnRhbCc6IHRoaXMuaG9yaXpvbnRhbCxcbiAgICAgICAgJ3YtYm90dG9tLW5hdmlnYXRpb24tLXNoaWZ0JzogdGhpcy5zaGlmdCxcbiAgICAgIH1cbiAgICB9LFxuICAgIHN0eWxlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnRoaXMubWVhc3VyYWJsZVN0eWxlcyxcbiAgICAgICAgdHJhbnNmb3JtOiB0aGlzLmlzQWN0aXZlID8gJ25vbmUnIDogJ3RyYW5zbGF0ZVkoMTAwJSknLFxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBjYW5TY3JvbGw6ICdvblNjcm9sbCcsXG4gIH0sXG5cbiAgY3JlYXRlZCAoKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAodGhpcy4kYXR0cnMuaGFzT3duUHJvcGVydHkoJ2FjdGl2ZScpKSB7XG4gICAgICBicmVha2luZygnYWN0aXZlLnN5bmMnLCAndmFsdWUgb3Igdi1tb2RlbCcsIHRoaXMpXG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICB0aHJlc2hvbGRNZXQgKCkge1xuICAgICAgaWYgKHRoaXMuaGlkZU9uU2Nyb2xsKSB7XG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSAhdGhpcy5pc1Njcm9sbGluZ1VwIHx8XG4gICAgICAgICAgdGhpcy5jdXJyZW50U2Nyb2xsID4gdGhpcy5jb21wdXRlZFNjcm9sbFRocmVzaG9sZFxuXG4gICAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTptb2RlbFZhbHVlJywgdGhpcy5pc0FjdGl2ZSlcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY3VycmVudFRocmVzaG9sZCA8IHRoaXMuY29tcHV0ZWRTY3JvbGxUaHJlc2hvbGQpIHJldHVyblxuXG4gICAgICB0aGlzLnNhdmVkU2Nyb2xsID0gdGhpcy5jdXJyZW50U2Nyb2xsXG4gICAgfSxcbiAgICB1cGRhdGVBcHBsaWNhdGlvbiAoKTogbnVtYmVyIHtcbiAgICAgIHJldHVybiB0aGlzLiRlbFxuICAgICAgICA/IHRoaXMuJGVsLmNsaWVudEhlaWdodFxuICAgICAgICA6IDBcbiAgICB9LFxuICAgIHVwZGF0ZVZhbHVlICh2YWw6IGFueSkge1xuICAgICAgdGhpcy4kZW1pdCgnY2hhbmdlJywgdmFsKVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuc2V0QmFja2dyb3VuZENvbG9yKHRoaXMuYmFja2dyb3VuZENvbG9yLCB7XG4gICAgICBjbGFzczogWyd2LWJvdHRvbS1uYXZpZ2F0aW9uJywgdGhpcy5jbGFzc2VzXSxcbiAgICAgIHN0eWxlOiB0aGlzLnN0eWxlcyxcbiAgICAgIGFjdGl2ZUNsYXNzOiB0aGlzLmFjdGl2ZUNsYXNzLFxuICAgICAgbWFuZGF0b3J5OiBCb29sZWFuKFxuICAgICAgICB0aGlzLm1hbmRhdG9yeSB8fFxuICAgICAgICB0aGlzLm1vZGVsVmFsdWUgIT09IHVuZGVmaW5lZFxuICAgICAgKSxcbiAgICAgIHRhZzogdGhpcy50YWcsXG4gICAgICBtb2RlbFZhbHVlOiB0aGlzLmludGVybmFsVmFsdWUsXG4gICAgICBvbkNoYW5nZTogdGhpcy51cGRhdGVWYWx1ZVxuICAgIH0pXG5cbiAgICBpZiAodGhpcy5jYW5TY3JvbGwpIHtcbiAgICAgIGRhdGEuZGlyZWN0aXZlcyA9IGRhdGEuZGlyZWN0aXZlcyB8fCBbXVxuXG4gICAgICBkYXRhLmRpcmVjdGl2ZXMucHVzaCh7XG4gICAgICAgIGFyZzogdGhpcy5zY3JvbGxUYXJnZXQsXG4gICAgICAgIG5hbWU6ICdzY3JvbGwnLFxuICAgICAgICB2YWx1ZTogdGhpcy5vblNjcm9sbCxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIGgoQnV0dG9uR3JvdXAsIHRoaXMuc2V0VGV4dENvbG9yKHRoaXMuY29sb3IsIGRhdGEpLCBnZXRTbG90KHRoaXMpKVxuICB9LFxufSlcbiJdfQ==