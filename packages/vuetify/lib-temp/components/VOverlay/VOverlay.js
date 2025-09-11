import { h } from 'vue';
// Styles
import './VOverlay.sass';
// Mixins
import Colorable from './../../mixins/colorable';
import Themeable from '../../mixins/themeable';
import Toggleable from './../../mixins/toggleable';
// Utilities
import mixins from '../../util/mixins';
import { getSlot } from '../../util/helpers';
/* @vue/component */
export default mixins(Colorable, Themeable, Toggleable).extend({
    name: 'v-overlay',
    emits: ['update:modelValue'],
    props: {
        absolute: Boolean,
        color: {
            type: String,
            default: '#212121',
        },
        dark: {
            type: Boolean,
            default: true,
        },
        opacity: {
            type: [Number, String],
            default: 0.46,
        },
        modelValue: {
            default: true,
        },
        zIndex: {
            type: [Number, String],
            default: 5,
        },
    },
    computed: {
        __scrim() {
            const data = this.setBackgroundColor(this.color, {
                class: { 'v-overlay__scrim': true },
                style: {
                    opacity: this.computedOpacity,
                },
            });
            return h('div', data);
        },
        classes() {
            return {
                'v-overlay--absolute': this.absolute,
                'v-overlay--active': this.isActive,
                ...this.themeClasses,
            };
        },
        computedOpacity() {
            return Number(this.isActive ? this.opacity : 0);
        },
        styles() {
            return {
                zIndex: this.zIndex,
            };
        },
    },
    methods: {
        genContent() {
            return h('div', {
                class: 'v-overlay__content',
            }, getSlot(this));
        }
    },
    render() {
        const children = [this.__scrim];
        if (this.isActive)
            children.push(this.genContent());
        return h('div', {
            ...this.$attrs,
            class: ['v-overlay', this.classes],
            style: this.styles,
        }, children);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVk92ZXJsYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WT3ZlcmxheS9WT3ZlcmxheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsQ0FBQyxFQUFDLE1BQU0sS0FBSyxDQUFBO0FBQ3JCLFNBQVM7QUFDVCxPQUFPLGlCQUFpQixDQUFBO0FBRXhCLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSwwQkFBMEIsQ0FBQTtBQUNoRCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSwyQkFBMkIsQ0FBQTtBQUVsRCxZQUFZO0FBQ1osT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFDdEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBSzVDLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FDbkIsU0FBUyxFQUNULFNBQVMsRUFDVCxVQUFVLENBQ1gsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsV0FBVztJQUVqQixLQUFLLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztJQUU1QixLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsT0FBTztRQUNqQixLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxTQUFTO1NBQ25CO1FBQ0QsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsVUFBVSxFQUFFO1lBQ1YsT0FBTyxFQUFFLElBQUk7U0FDZDtRQUNELE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLENBQUM7U0FDWDtLQUNGO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUMvQyxLQUFLLEVBQUUsRUFBQyxrQkFBa0IsRUFBRSxJQUFJLEVBQUM7Z0JBQ2pDLEtBQUssRUFBRTtvQkFDTCxPQUFPLEVBQUUsSUFBSSxDQUFDLGVBQWU7aUJBQzlCO2FBQ0YsQ0FBQyxDQUFBO1lBRUYsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQ3ZCLENBQUM7UUFDRCxPQUFPO1lBQ0wsT0FBTztnQkFDTCxxQkFBcUIsRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDcEMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ2xDLEdBQUcsSUFBSSxDQUFDLFlBQVk7YUFDckIsQ0FBQTtRQUNILENBQUM7UUFDRCxlQUFlO1lBQ2IsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDakQsQ0FBQztRQUNELE1BQU07WUFDSixPQUFPO2dCQUNMLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTthQUNwQixDQUFBO1FBQ0gsQ0FBQztLQUNGO0lBRUQsT0FBTyxFQUFFO1FBQ1AsVUFBVTtZQUNSLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTtnQkFDZCxLQUFLLEVBQUUsb0JBQW9CO2FBQzVCLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7UUFDbkIsQ0FBQztLQUNGO0lBRUQsTUFBTTtRQUNKLE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRS9CLElBQUksSUFBSSxDQUFDLFFBQVE7WUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFBO1FBRW5ELE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUNkLEdBQUcsSUFBSSxDQUFDLE1BQU07WUFDZCxLQUFLLEVBQUUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUNsQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07U0FDbkIsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUNkLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2h9IGZyb20gJ3Z1ZSdcbi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZPdmVybGF5LnNhc3MnXG5cbi8vIE1peGluc1xuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLy4uLy4uL21peGlucy9jb2xvcmFibGUnXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXG5pbXBvcnQgVG9nZ2xlYWJsZSBmcm9tICcuLy4uLy4uL21peGlucy90b2dnbGVhYmxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgeyBnZXRTbG90IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXG4gIENvbG9yYWJsZSxcbiAgVGhlbWVhYmxlLFxuICBUb2dnbGVhYmxlXG4pLmV4dGVuZCh7XG4gIG5hbWU6ICd2LW92ZXJsYXknLFxuXG4gIGVtaXRzOiBbJ3VwZGF0ZTptb2RlbFZhbHVlJ10sXG5cbiAgcHJvcHM6IHtcbiAgICBhYnNvbHV0ZTogQm9vbGVhbixcbiAgICBjb2xvcjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyMyMTIxMjEnLFxuICAgIH0sXG4gICAgZGFyazoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgICBvcGFjaXR5OiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogMC40NixcbiAgICB9LFxuICAgIG1vZGVsVmFsdWU6IHtcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgICB6SW5kZXg6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiA1LFxuICAgIH0sXG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBfX3NjcmltICgpOiBWTm9kZSB7XG4gICAgICBjb25zdCBkYXRhID0gdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb2xvciwge1xuICAgICAgICBjbGFzczogeyd2LW92ZXJsYXlfX3NjcmltJzogdHJ1ZX0sXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgb3BhY2l0eTogdGhpcy5jb21wdXRlZE9wYWNpdHksXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gaCgnZGl2JywgZGF0YSlcbiAgICB9LFxuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAndi1vdmVybGF5LS1hYnNvbHV0ZSc6IHRoaXMuYWJzb2x1dGUsXG4gICAgICAgICd2LW92ZXJsYXktLWFjdGl2ZSc6IHRoaXMuaXNBY3RpdmUsXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzLFxuICAgICAgfVxuICAgIH0sXG4gICAgY29tcHV0ZWRPcGFjaXR5ICgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIE51bWJlcih0aGlzLmlzQWN0aXZlID8gdGhpcy5vcGFjaXR5IDogMClcbiAgICB9LFxuICAgIHN0eWxlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHpJbmRleDogdGhpcy56SW5kZXgsXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2VuQ29udGVudCAoKSB7XG4gICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogJ3Ytb3ZlcmxheV9fY29udGVudCcsXG4gICAgICB9LCBnZXRTbG90KHRoaXMpKVxuICAgIH1cbiAgfSxcblxuICByZW5kZXIgKCk6IFZOb2RlIHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IFt0aGlzLl9fc2NyaW1dXG5cbiAgICBpZiAodGhpcy5pc0FjdGl2ZSkgY2hpbGRyZW4ucHVzaCh0aGlzLmdlbkNvbnRlbnQoKSlcblxuICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAuLi50aGlzLiRhdHRycyxcbiAgICAgIGNsYXNzOiBbJ3Ytb3ZlcmxheScsIHRoaXMuY2xhc3Nlc10sXG4gICAgICBzdHlsZTogdGhpcy5zdHlsZXMsXG4gICAgfSwgY2hpbGRyZW4pXG4gIH0sXG59KVxuIl19