// Styles
import '../../styles/components/_selection-controls.sass';
import './VSwitch.sass';
// Mixins
import Selectable from '../../mixins/selectable';
import VInput from '../VInput';
// Directives
import Touch from '../../directives/touch';
// Components
import { VFabTransition } from '../transitions';
import VProgressCircular from '../VProgressCircular/VProgressCircular';
// Helpers
import { getSlot, keyCodes } from '../../util/helpers';
// Types
import { defineComponent, h } from 'vue';
import mergeData from '../../util/mergeData';
/* @vue/component */
export default defineComponent({
    name: 'v-switch',
    extends: Selectable,
    props: {
        inset: Boolean,
        loading: {
            type: [Boolean, String],
            default: false,
        },
        flat: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['click', 'focus', 'blur'],
    computed: {
        classes() {
            return {
                ...VInput.computed.classes.call(this),
                'v-input--selection-controls v-input--switch': true,
                'v-input--switch--flat': this.flat,
                'v-input--switch--inset': this.inset,
            };
        },
        attrs() {
            return {
                'aria-checked': String(this.isActive),
                'aria-disabled': String(this.isDisabled),
                role: 'switch',
            };
        },
        // Do not return undefined if disabled,
        // according to spec, should still show
        // a color when disabled and active
        validationState() {
            if (this.hasError && this.shouldValidate)
                return 'error';
            if (this.hasSuccess)
                return 'success';
            if (this.hasColor !== null)
                return this.computedColor;
            return undefined;
        },
        switchData() {
            return this.setTextColor(this.loading ? undefined : this.validationState, {
                class: this.themeClasses,
            });
        },
    },
    methods: {
        genDefaultSlot() {
            return [
                this.genSwitch(),
                this.genLabel(),
            ];
        },
        genSwitch() {
            const { title, ...switchAttrs } = this.attrs$;
            return h('div', {
                class: 'v-input--selection-controls__input',
            }, [
                this.genInput('checkbox', {
                    ...this.attrs,
                    ...switchAttrs,
                }),
                this.genRipple(this.setTextColor(this.validationState, {
                    directives: [[
                            Touch,
                            {
                                left: this.onSwipeLeft,
                                right: this.onSwipeRight,
                            },
                        ]],
                })),
                h('div', mergeData({ class: 'v-input--switch__track' }, this.switchData)),
                h('div', mergeData({ class: 'v-input--switch__thumb' }, this.switchData), [this.genProgress()]),
            ]);
        },
        genProgress() {
            return h(VFabTransition, {}, () => [
                this.loading === false
                    ? null
                    : getSlot(this, 'progress') || h(VProgressCircular, {
                        color: (this.loading === true || this.loading === '')
                            ? (this.color || 'primary')
                            : this.loading,
                        size: 16,
                        width: 2,
                        indeterminate: true,
                    }),
            ]);
        },
        onSwipeLeft() {
            if (this.isActive)
                this.onChange();
        },
        onSwipeRight() {
            if (!this.isActive)
                this.onChange();
        },
        onKeydown(e) {
            if ((e.keyCode === keyCodes.left && this.isActive) ||
                (e.keyCode === keyCodes.right && !this.isActive))
                this.onChange();
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlN3aXRjaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTd2l0Y2gvVlN3aXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxrREFBa0QsQ0FBQTtBQUN6RCxPQUFPLGdCQUFnQixDQUFBO0FBRXZCLFNBQVM7QUFDVCxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLE1BQU0sTUFBTSxXQUFXLENBQUE7QUFFOUIsYUFBYTtBQUNiLE9BQU8sS0FBSyxNQUFNLHdCQUF3QixDQUFBO0FBRTFDLGFBQWE7QUFDYixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUE7QUFDL0MsT0FBTyxpQkFBaUIsTUFBTSx3Q0FBd0MsQ0FBQTtBQUV0RSxVQUFVO0FBQ1YsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUV0RCxRQUFRO0FBQ1IsT0FBTyxFQUFFLGVBQWUsRUFBb0IsQ0FBQyxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBQzFELE9BQU8sU0FBUyxNQUFNLHNCQUFzQixDQUFBO0FBRTVDLG9CQUFvQjtBQUNwQixlQUFlLGVBQWUsQ0FBQztJQUM3QixJQUFJLEVBQUUsVUFBVTtJQUdoQixPQUFPLEVBQUUsVUFBVTtJQUVuQixLQUFLLEVBQUU7UUFDTCxLQUFLLEVBQUUsT0FBTztRQUNkLE9BQU8sRUFBRTtZQUNQLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7WUFDdkIsT0FBTyxFQUFFLEtBQUs7U0FDZjtRQUNELElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLEtBQUs7U0FDZjtLQUNGO0lBRUQsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUM7SUFFakMsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wsR0FB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T0FBTyxLQUFLLEVBQUUsQ0FBQzs0QkFDbkQsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUM7NEJBQzNCLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTzt3QkFDaEIsSUFBSSxFQUFFLEVBQUU7d0JBQ1IsS0FBSyxFQUFFLENBQUM7d0JBQ1IsYUFBYSxFQUFFLElBQUk7cUJBQ3BCLENBQUM7YUFDTCxDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsV0FBVztZQUNULElBQUksSUFBSSxDQUFDLFFBQVE7Z0JBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ3BDLENBQUM7UUFDRCxZQUFZO1lBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO2dCQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUNyQyxDQUFDO1FBQ0QsU0FBUyxDQUFFLENBQWdCO1lBQ3pCLElBQ0UsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDOUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUNoRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDbkIsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXG5pbXBvcnQgJy4uLy4uL3N0eWxlcy9jb21wb25lbnRzL19zZWxlY3Rpb24tY29udHJvbHMuc2FzcydcbmltcG9ydCAnLi9WU3dpdGNoLnNhc3MnXG5cbi8vIE1peGluc1xuaW1wb3J0IFNlbGVjdGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3NlbGVjdGFibGUnXG5pbXBvcnQgVklucHV0IGZyb20gJy4uL1ZJbnB1dCdcblxuLy8gRGlyZWN0aXZlc1xuaW1wb3J0IFRvdWNoIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvdG91Y2gnXG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCB7IFZGYWJUcmFuc2l0aW9uIH0gZnJvbSAnLi4vdHJhbnNpdGlvbnMnXG5pbXBvcnQgVlByb2dyZXNzQ2lyY3VsYXIgZnJvbSAnLi4vVlByb2dyZXNzQ2lyY3VsYXIvVlByb2dyZXNzQ2lyY3VsYXInXG5cbi8vIEhlbHBlcnNcbmltcG9ydCB7IGdldFNsb3QsIGtleUNvZGVzIH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgZGVmaW5lQ29tcG9uZW50LCBWTm9kZSwgVk5vZGVEYXRhLCBoIH0gZnJvbSAndnVlJ1xuaW1wb3J0IG1lcmdlRGF0YSBmcm9tICcuLi8uLi91dGlsL21lcmdlRGF0YSdcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XG4gIG5hbWU6ICd2LXN3aXRjaCcsXG5cblxuICBleHRlbmRzOiBTZWxlY3RhYmxlLFxuXG4gIHByb3BzOiB7XG4gICAgaW5zZXQ6IEJvb2xlYW4sXG4gICAgbG9hZGluZzoge1xuICAgICAgdHlwZTogW0Jvb2xlYW4sIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIGZsYXQ6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICB9LFxuXG4gIGVtaXRzOiBbJ2NsaWNrJywgJ2ZvY3VzJywgJ2JsdXInXSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5WSW5wdXQuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi1pbnB1dC0tc2VsZWN0aW9uLWNvbnRyb2xzIHYtaW5wdXQtLXN3aXRjaCc6IHRydWUsXG4gICAgICAgICd2LWlucHV0LS1zd2l0Y2gtLWZsYXQnOiB0aGlzLmZsYXQsXG4gICAgICAgICd2LWlucHV0LS1zd2l0Y2gtLWluc2V0JzogdGhpcy5pbnNldCxcbiAgICAgIH1cbiAgICB9LFxuICAgIGF0dHJzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ2FyaWEtY2hlY2tlZCc6IFN0cmluZyh0aGlzLmlzQWN0aXZlKSxcbiAgICAgICAgJ2FyaWEtZGlzYWJsZWQnOiBTdHJpbmcodGhpcy5pc0Rpc2FibGVkKSxcbiAgICAgICAgcm9sZTogJ3N3aXRjaCcsXG4gICAgICB9XG4gICAgfSxcbiAgICAvLyBEbyBub3QgcmV0dXJuIHVuZGVmaW5lZCBpZiBkaXNhYmxlZCxcbiAgICAvLyBhY2NvcmRpbmcgdG8gc3BlYywgc2hvdWxkIHN0aWxsIHNob3dcbiAgICAvLyBhIGNvbG9yIHdoZW4gZGlzYWJsZWQgYW5kIGFjdGl2ZVxuICAgIHZhbGlkYXRpb25TdGF0ZSAoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgIGlmICh0aGlzLmhhc0Vycm9yICYmIHRoaXMuc2hvdWxkVmFsaWRhdGUpIHJldHVybiAnZXJyb3InXG4gICAgICBpZiAodGhpcy5oYXNTdWNjZXNzKSByZXR1cm4gJ3N1Y2Nlc3MnXG4gICAgICBpZiAodGhpcy5oYXNDb2xvciAhPT0gbnVsbCkgcmV0dXJuIHRoaXMuY29tcHV0ZWRDb2xvclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH0sXG4gICAgc3dpdGNoRGF0YSAoKTogVk5vZGVEYXRhIHtcbiAgICAgIHJldHVybiB0aGlzLnNldFRleHRDb2xvcih0aGlzLmxvYWRpbmcgPyB1bmRlZmluZWQgOiB0aGlzLnZhbGlkYXRpb25TdGF0ZSwge1xuICAgICAgICBjbGFzczogdGhpcy50aGVtZUNsYXNzZXMsXG4gICAgICB9KVxuICAgIH0sXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGdlbkRlZmF1bHRTbG90ICgpOiAoVk5vZGUgfCBudWxsKVtdIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHRoaXMuZ2VuU3dpdGNoKCksXG4gICAgICAgIHRoaXMuZ2VuTGFiZWwoKSxcbiAgICAgIF1cbiAgICB9LFxuICAgIGdlblN3aXRjaCAoKTogVk5vZGUge1xuICAgICAgY29uc3QgeyB0aXRsZSwgLi4uc3dpdGNoQXR0cnMgfSA9IHRoaXMuYXR0cnMkXG5cbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiAndi1pbnB1dC0tc2VsZWN0aW9uLWNvbnRyb2xzX19pbnB1dCcsXG4gICAgICB9LCBbXG4gICAgICAgIHRoaXMuZ2VuSW5wdXQoJ2NoZWNrYm94Jywge1xuICAgICAgICAgIC4uLnRoaXMuYXR0cnMsXG4gICAgICAgICAgLi4uc3dpdGNoQXR0cnMsXG4gICAgICAgIH0pLFxuICAgICAgICB0aGlzLmdlblJpcHBsZSh0aGlzLnNldFRleHRDb2xvcih0aGlzLnZhbGlkYXRpb25TdGF0ZSwge1xuICAgICAgICAgIGRpcmVjdGl2ZXM6IFtbXG4gICAgICAgICAgICBUb3VjaCxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGVmdDogdGhpcy5vblN3aXBlTGVmdCxcbiAgICAgICAgICAgICAgcmlnaHQ6IHRoaXMub25Td2lwZVJpZ2h0LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdXSxcbiAgICAgICAgfSkpLFxuXG4gICAgICAgIGgoJ2RpdicsIG1lcmdlRGF0YSh7IGNsYXNzOiAndi1pbnB1dC0tc3dpdGNoX190cmFjaycgfSxcbiAgICAgICAgICB0aGlzLnN3aXRjaERhdGEsXG4gICAgICAgICkpLFxuICAgICAgICBoKCdkaXYnLCBtZXJnZURhdGEoeyBjbGFzczogJ3YtaW5wdXQtLXN3aXRjaF9fdGh1bWInIH0sXG4gICAgICAgICAgdGhpcy5zd2l0Y2hEYXRhLFxuICAgICAgICApLCBbdGhpcy5nZW5Qcm9ncmVzcygpXSksXG4gICAgICBdKVxuICAgIH0sXG4gICAgZ2VuUHJvZ3Jlc3MgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiBoKFZGYWJUcmFuc2l0aW9uLCB7fSwgKCkgPT4gW1xuICAgICAgICB0aGlzLmxvYWRpbmcgPT09IGZhbHNlXG4gICAgICAgICAgPyBudWxsXG4gICAgICAgICAgOiBnZXRTbG90KHRoaXMsICdwcm9ncmVzcycpIHx8IGgoVlByb2dyZXNzQ2lyY3VsYXIsIHtcbiAgICAgICAgICAgIGNvbG9yOiAodGhpcy5sb2FkaW5nID09PSB0cnVlIHx8IHRoaXMubG9hZGluZyA9PT0gJycpXG4gICAgICAgICAgICAgID8gKHRoaXMuY29sb3IgfHwgJ3ByaW1hcnknKVxuICAgICAgICAgICAgICA6IHRoaXMubG9hZGluZyxcbiAgICAgICAgICAgIHNpemU6IDE2LFxuICAgICAgICAgICAgd2lkdGg6IDIsXG4gICAgICAgICAgICBpbmRldGVybWluYXRlOiB0cnVlLFxuICAgICAgICAgIH0pLFxuICAgICAgXSlcbiAgICB9LFxuICAgIG9uU3dpcGVMZWZ0ICgpIHtcbiAgICAgIGlmICh0aGlzLmlzQWN0aXZlKSB0aGlzLm9uQ2hhbmdlKClcbiAgICB9LFxuICAgIG9uU3dpcGVSaWdodCAoKSB7XG4gICAgICBpZiAoIXRoaXMuaXNBY3RpdmUpIHRoaXMub25DaGFuZ2UoKVxuICAgIH0sXG4gICAgb25LZXlkb3duIChlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICBpZiAoXG4gICAgICAgIChlLmtleUNvZGUgPT09IGtleUNvZGVzLmxlZnQgJiYgdGhpcy5pc0FjdGl2ZSkgfHxcbiAgICAgICAgKGUua2V5Q29kZSA9PT0ga2V5Q29kZXMucmlnaHQgJiYgIXRoaXMuaXNBY3RpdmUpXG4gICAgICApIHRoaXMub25DaGFuZ2UoKVxuICAgIH0sXG4gIH0sXG59KVxuIl19