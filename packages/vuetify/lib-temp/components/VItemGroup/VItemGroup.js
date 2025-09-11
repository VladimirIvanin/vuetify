import { h } from 'vue';
// Styles
import './VItemGroup.sass';
// Mixins
import Comparable from '../../mixins/comparable';
import Proxyable from '../../mixins/proxyable';
import Themeable from '../../mixins/themeable';
// Utilities
import mixins from '../../util/mixins';
import { consoleWarn } from '../../util/console';
import { getSlot } from '../../util/helpers';
import { defineComponent } from 'vue';
export const BaseItemGroup = mixins(Comparable, Proxyable, Themeable).extend({
    name: 'base-item-group',
    emits: ['update:modelValue'],
    props: {
        activeClass: {
            type: String,
            default: 'v-item--active',
        },
        mandatory: Boolean,
        max: {
            type: [Number, String],
            default: null,
        },
        multiple: Boolean,
        tag: {
            type: String,
            default: 'div',
        },
    },
    data() {
        return {
            // As long as a value is defined, show it
            // Otherwise, check if multiple
            // to determine which default to provide
            internalLazyValue: this.modelValue !== undefined
                ? this.modelValue
                : this.multiple ? [] : undefined,
            items: [],
        };
    },
    computed: {
        classes() {
            return {
                'v-item-group': true,
                ...this.themeClasses,
            };
        },
        selectedIndex() {
            return (this.selectedItem && this.items.indexOf(this.selectedItem)) || -1;
        },
        selectedItem() {
            if (this.multiple)
                return undefined;
            return this.selectedItems[0];
        },
        selectedItems() {
            return this.items.filter((item, index) => {
                return this.toggleMethod(this.getValue(item, index));
            });
        },
        selectedValues() {
            if (this.internalValue == null)
                return [];
            return Array.isArray(this.internalValue)
                ? this.internalValue
                : [this.internalValue];
        },
        toggleMethod() {
            if (!this.multiple) {
                return (v) => this.valueComparator(this.internalValue, v);
            }
            const internalValue = this.internalValue;
            if (Array.isArray(internalValue)) {
                return (v) => internalValue.some(intern => this.valueComparator(intern, v));
            }
            return () => false;
        },
    },
    watch: {
        internalValue: 'updateItemsState',
        items: 'updateItemsState'
    },
    created() {
        if (this.multiple && !Array.isArray(this.internalValue)) {
            consoleWarn('Model must be bound to an array if the multiple property is true.', this);
        }
    },
    methods: {
        genData() {
            return {
                class: this.classes,
            };
        },
        getValue(item, i) {
            return item.value === undefined
                ? i
                : item.value;
        },
        onClick(item) {
            this.updateInternalValue(this.getValue(item, this.items.indexOf(item)));
        },
        register(item) {
            const index = this.items.push(item) - 1;
            // TODO!!!
            item.$on('change', () => this.onClick(item));
            // If no value provided and mandatory,
            // assign first registered item
            if (this.mandatory && !this.selectedValues.length) {
                this.updateMandatory();
            }
            this.updateItem(item, index);
        },
        unregister(item) {
            if (this._isDestroyed)
                return;
            const index = this.items.indexOf(item);
            const value = this.getValue(item, index);
            this.items.splice(index, 1);
            const valueIndex = this.selectedValues.indexOf(value);
            // Items is not selected, do nothing
            if (valueIndex < 0)
                return;
            // If not mandatory, use regular update process
            if (!this.mandatory) {
                return this.updateInternalValue(value);
            }
            // Remove the value
            if (this.multiple && Array.isArray(this.internalValue)) {
                this.internalValue = this.internalValue.filter(v => v !== value);
            }
            else {
                this.internalValue = undefined;
            }
            // If mandatory and we have no selection
            // add the last item as value
            /* istanbul ignore else */
            if (!this.selectedItems.length) {
                this.updateMandatory(true);
            }
        },
        updateItem(item, index) {
            const value = this.getValue(item, index);
            item.isActive = this.toggleMethod(value);
        },
        // https://github.com/vuetifyjs/vuetify/issues/5352
        updateItemsState() {
            this.$nextTick(() => {
                if (this.mandatory &&
                    !this.selectedItems.length) {
                    return this.updateMandatory();
                }
                // TODO: Make this smarter so it
                // doesn't have to iterate every
                // child in an update
                this.items.forEach(this.updateItem);
            });
        },
        updateInternalValue(value) {
            this.multiple
                ? this.updateMultiple(value)
                : this.updateSingle(value);
        },
        updateMandatory(last) {
            if (!this.items.length)
                return;
            const items = this.items.slice();
            if (last)
                items.reverse();
            const item = items.find(item => !item.disabled);
            // If no tabs are available
            // aborts mandatory value
            if (!item)
                return;
            const index = this.items.indexOf(item);
            this.updateInternalValue(this.getValue(item, index));
        },
        updateMultiple(value) {
            const defaultValue = Array.isArray(this.internalValue)
                ? this.internalValue
                : [];
            const internalValue = defaultValue.slice();
            const index = internalValue.findIndex(val => this.valueComparator(val, value));
            if (this.mandatory &&
                // Item already exists
                index > -1 &&
                // value would be reduced below min
                internalValue.length - 1 < 1)
                return;
            if (
            // Max is set
            this.max != null &&
                // Item doesn't exist
                index < 0 &&
                // value would be increased above max
                internalValue.length + 1 > this.max)
                return;
            index > -1
                ? internalValue.splice(index, 1)
                : internalValue.push(value);
            this.internalValue = internalValue;
        },
        updateSingle(value) {
            const isSame = this.valueComparator(this.internalValue, value);
            if (this.mandatory && isSame)
                return;
            this.internalValue = isSame ? undefined : value;
        },
    },
    render() {
        const data = this.genData();
        return h(this.tag, {
            class: data.class,
            ...data.attrs,
        }, getSlot(this));
    },
});
export default defineComponent({
    name: 'v-item-group',
    extends: BaseItemGroup,
    provide() {
        return {
            itemGroup: this,
        };
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkl0ZW1Hcm91cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZJdGVtR3JvdXAvVkl0ZW1Hcm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsQ0FBQyxFQUFDLE1BQU0sS0FBSyxDQUFBO0FBQ3JCLFNBQVM7QUFDVCxPQUFPLG1CQUFtQixDQUFBO0FBRTFCLFNBQVM7QUFDVCxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUVoRCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxZQUFZO0FBQ1osT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFDdEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2hELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUk1QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBUXJDLE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQ2pDLFVBQVUsRUFDVixTQUFTLEVBQ1QsU0FBUyxDQUNWLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLGlCQUFpQjtJQUV2QixLQUFLLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztJQUU1QixLQUFLLEVBQUU7UUFDTCxXQUFXLEVBQUU7WUFDWCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxnQkFBZ0I7U0FDMUI7UUFDRCxTQUFTLEVBQUUsT0FBTztRQUNsQixHQUFHLEVBQUU7WUFDSCxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxJQUFJO1NBQ2Q7UUFDRCxRQUFRLEVBQUUsT0FBTztRQUNqQixHQUFHLEVBQUU7WUFDSCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxLQUFLO1NBQ2Y7S0FDRjtJ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QUE7UUFDM0IsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNqQixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsR0FBRyxJQUFJLENBQUMsS0FBSztTQUNkLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7SUFDbkIsQ0FBQztDQUNGLENBQUMsQ0FBQTtBQUVGLGVBQWUsZUFBZSxDQUFDO0lBQzdCLElBQUksRUFBRSxjQUFjO0lBQ3BCLE9BQU8sRUFBRSxhQUFhO0lBRXRCLE9BQU87UUFDTCxPQUFPO1lBQ0wsU0FBUyxFQUFFLElBQUk7U0FDaEIsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2h9IGZyb20gJ3Z1ZSdcbi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZJdGVtR3JvdXAuc2FzcydcblxuLy8gTWl4aW5zXG5pbXBvcnQgQ29tcGFyYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29tcGFyYWJsZSdcbmltcG9ydCBHcm91cGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2dyb3VwYWJsZSdcbmltcG9ydCBQcm94eWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3Byb3h5YWJsZSdcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuaW1wb3J0IHsgY29uc29sZVdhcm4gfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXG5pbXBvcnQgeyBnZXRTbG90IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUvdHlwZXMnXG5pbXBvcnQgeyBkZWZpbmVDb21wb25lbnQgfSBmcm9tICd2dWUnXG5cbmV4cG9ydCB0eXBlIEdyb3VwYWJsZUluc3RhbmNlID0gSW5zdGFuY2VUeXBlPHR5cGVvZiBHcm91cGFibGU+ICYge1xuICBpZD86IHN0cmluZ1xuICB0bz86IGFueVxuICB2YWx1ZT86IGFueVxuIH1cblxuZXhwb3J0IGNvbnN0IEJhc2VJdGVtR3JvdXAgPSBtaXhpbnMoXG4gIENvbXBhcmFibGUsXG4gIFByb3h5YWJsZSxcbiAgVGhlbWVhYmxlXG4pLmV4dGVuZCh7XG4gIG5hbWU6ICdiYXNlLWl0ZW0tZ3JvdXAnLFxuXG4gIGVtaXRzOiBbJ3VwZGF0ZTptb2RlbFZhbHVlJ10sXG5cbiAgcHJvcHM6IHtcbiAgICBhY3RpdmVDbGFzczoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ3YtaXRlbS0tYWN0aXZlJyxcbiAgICB9LFxuICAgIG1hbmRhdG9yeTogQm9vbGVhbixcbiAgICBtYXg6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiBudWxsLFxuICAgIH0sXG4gICAgbXVsdGlwbGU6IEJvb2xlYW4sXG4gICAgdGFnOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnZGl2JyxcbiAgICB9LFxuICB9LFxuXG4gIGRhdGEgKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvLyBBcyBsb25nIGFzIGEgdmFsdWUgaXMgZGVmaW5lZCwgc2hvdyBpdFxuICAgICAgLy8gT3RoZXJ3aXNlLCBjaGVjayBpZiBtdWx0aXBsZVxuICAgICAgLy8gdG8gZGV0ZXJtaW5lIHdoaWNoIGRlZmF1bHQgdG8gcHJvdmlkZVxuICAgICAgaW50ZXJuYWxMYXp5VmFsdWU6IHRoaXMubW9kZWxWYWx1ZSAhPT0gdW5kZWZpbmVkXG4gICAgICAgID8gdGhpcy5tb2RlbFZhbHVlXG4gICAgICAgIDogdGhpcy5tdWx0aXBsZSA/IFtdIDogdW5kZWZpbmVkLFxuICAgICAgaXRlbXM6IFtdIGFzIEdyb3VwYWJsZUluc3RhbmNlW10sXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ3YtaXRlbS1ncm91cCc6IHRydWUsXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzLFxuICAgICAgfVxuICAgIH0sXG4gICAgc2VsZWN0ZWRJbmRleCAoKTogbnVtYmVyIHtcbiAgICAgIHJldHVybiAodGhpcy5zZWxlY3RlZEl0ZW0gJiYgdGhpcy5pdGVtcy5pbmRleE9mKHRoaXMuc2VsZWN0ZWRJdGVtKSkgfHwgLTFcbiAgICB9LFxuICAgIHNlbGVjdGVkSXRlbSAoKTogR3JvdXBhYmxlSW5zdGFuY2UgfCB1bmRlZmluZWQge1xuICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHJldHVybiB1bmRlZmluZWRcblxuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRJdGVtc1swXVxuICAgIH0sXG4gICAgc2VsZWN0ZWRJdGVtcyAoKTogR3JvdXBhYmxlSW5zdGFuY2VbXSB7XG4gICAgICByZXR1cm4gdGhpcy5pdGVtcy5maWx0ZXIoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvZ2dsZU1ldGhvZCh0aGlzLmdldFZhbHVlKGl0ZW0sIGluZGV4KSlcbiAgICAgIH0pXG4gICAgfSxcbiAgICBzZWxlY3RlZFZhbHVlcyAoKTogYW55W10ge1xuICAgICAgaWYgKHRoaXMuaW50ZXJuYWxWYWx1ZSA9PSBudWxsKSByZXR1cm4gW11cblxuICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodGhpcy5pbnRlcm5hbFZhbHVlKVxuICAgICAgICA/IHRoaXMuaW50ZXJuYWxWYWx1ZVxuICAgICAgICA6IFt0aGlzLmludGVybmFsVmFsdWVdXG4gICAgfSxcbiAgICB0b2dnbGVNZXRob2QgKCk6ICh2OiBhbnkpID0+IGJvb2xlYW4ge1xuICAgICAgaWYgKCF0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgIHJldHVybiAodjogYW55KSA9PiB0aGlzLnZhbHVlQ29tcGFyYXRvcih0aGlzLmludGVybmFsVmFsdWUsIHYpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGludGVybmFsVmFsdWUgPSB0aGlzLmludGVybmFsVmFsdWVcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVybmFsVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiAodjogYW55KSA9PiBpbnRlcm5hbFZhbHVlLnNvbWUoaW50ZXJuID0+IHRoaXMudmFsdWVDb21wYXJhdG9yKGludGVybiwgdikpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoKSA9PiBmYWxzZVxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBpbnRlcm5hbFZhbHVlOiAndXBkYXRlSXRlbXNTdGF0ZScsXG4gICAgaXRlbXM6ICd1cGRhdGVJdGVtc1N0YXRlJ1xuICB9LFxuXG4gIGNyZWF0ZWQgKCkge1xuICAgIGlmICh0aGlzLm11bHRpcGxlICYmICFBcnJheS5pc0FycmF5KHRoaXMuaW50ZXJuYWxWYWx1ZSkpIHtcbiAgICAgIGNvbnNvbGVXYXJuKCdNb2RlbCBtdXN0IGJlIGJvdW5kIHRvIGFuIGFycmF5IGlmIHRoZSBtdWx0aXBsZSBwcm9wZXJ0eSBpcyB0cnVlLicsIHRoaXMpXG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcblxuICAgIGdlbkRhdGEgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjbGFzczogdGhpcy5jbGFzc2VzLFxuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0VmFsdWUgKGl0ZW06IEdyb3VwYWJsZUluc3RhbmNlLCBpOiBudW1iZXIpOiB1bmtub3duIHtcbiAgICAgIHJldHVybiBpdGVtLnZhbHVlID09PSB1bmRlZmluZWRcbiAgICAgICAgPyBpXG4gICAgICAgIDogaXRlbS52YWx1ZVxuICAgIH0sXG4gICAgb25DbGljayAoaXRlbTogR3JvdXBhYmxlSW5zdGFuY2UpIHtcbiAgICAgIHRoaXMudXBkYXRlSW50ZXJuYWxWYWx1ZShcbiAgICAgICAgdGhpcy5nZXRWYWx1ZShpdGVtLCB0aGlzLml0ZW1zLmluZGV4T2YoaXRlbSkpXG4gICAgICApXG4gICAgfSxcbiAgICByZWdpc3RlciAoaXRlbTogR3JvdXBhYmxlSW5zdGFuY2UpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5pdGVtcy5wdXNoKGl0ZW0pIC0gMVxuXG4gICAgICAvLyBUT0RPISEhXG4gICAgICBpdGVtLiRvbignY2hhbmdlJywgKCkgPT4gdGhpcy5vbkNsaWNrKGl0ZW0pKVxuXG4gICAgICAvLyBJZiBubyB2YWx1ZSBwcm92aWRlZCBhbmQgbWFuZGF0b3J5LFxuICAgICAgLy8gYXNzaWduIGZpcnN0IHJlZ2lzdGVyZWQgaXRlbVxuICAgICAgaWYgKHRoaXMubWFuZGF0b3J5ICYmICF0aGlzLnNlbGVjdGVkVmFsdWVzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLnVwZGF0ZU1hbmRhdG9yeSgpXG4gICAgICB9XG5cbiAgICAgIHRoaXMudXBkYXRlSXRlbShpdGVtLCBpbmRleClcbiAgICB9LFxuICAgIHVucmVnaXN0ZXIgKGl0ZW06IEdyb3VwYWJsZUluc3RhbmNlKSB7XG4gICAgICBpZiAodGhpcy5faXNEZXN0cm95ZWQpIHJldHVyblxuXG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuaXRlbXMuaW5kZXhPZihpdGVtKVxuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldFZhbHVlKGl0ZW0sIGluZGV4KVxuXG4gICAgICB0aGlzLml0ZW1zLnNwbGljZShpbmRleCwgMSlcblxuICAgICAgY29uc3QgdmFsdWVJbmRleCA9IHRoaXMuc2VsZWN0ZWRWYWx1ZXMuaW5kZXhPZih2YWx1ZSlcblxuICAgICAgLy8gSXRlbXMgaXMgbm90IHNlbGVjdGVkLCBkbyBub3RoaW5nXG4gICAgICBpZiAodmFsdWVJbmRleCA8IDApIHJldHVyblxuXG4gICAgICAvLyBJZiBub3QgbWFuZGF0b3J5LCB1c2UgcmVndWxhciB1cGRhdGUgcHJvY2Vzc1xuICAgICAgaWYgKCF0aGlzLm1hbmRhdG9yeSkge1xuICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVJbnRlcm5hbFZhbHVlKHZhbHVlKVxuICAgICAgfVxuXG4gICAgICAvLyBSZW1vdmUgdGhlIHZhbHVlXG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSAmJiBBcnJheS5pc0FycmF5KHRoaXMuaW50ZXJuYWxWYWx1ZSkpIHtcbiAgICAgICAgdGhpcy5pbnRlcm5hbFZhbHVlID0gdGhpcy5pbnRlcm5hbFZhbHVlLmZpbHRlcih2ID0+IHYgIT09IHZhbHVlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pbnRlcm5hbFZhbHVlID0gdW5kZWZpbmVkXG4gICAgICB9XG5cbiAgICAgIC8vIElmIG1hbmRhdG9yeSBhbmQgd2UgaGF2ZSBubyBzZWxlY3Rpb25cbiAgICAgIC8vIGFkZCB0aGUgbGFzdCBpdGVtIGFzIHZhbHVlXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKCF0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlTWFuZGF0b3J5KHRydWUpXG4gICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVJdGVtIChpdGVtOiBHcm91cGFibGVJbnN0YW5jZSwgaW5kZXg6IG51bWJlcikge1xuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldFZhbHVlKGl0ZW0sIGluZGV4KVxuXG4gICAgICBpdGVtLmlzQWN0aXZlID0gdGhpcy50b2dnbGVNZXRob2QodmFsdWUpXG4gICAgfSxcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdnVldGlmeWpzL3Z1ZXRpZnkvaXNzdWVzLzUzNTJcbiAgICB1cGRhdGVJdGVtc1N0YXRlICgpIHtcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMubWFuZGF0b3J5ICYmXG4gICAgICAgICAgIXRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGhcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlTWFuZGF0b3J5KClcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE86IE1ha2UgdGhpcyBzbWFydGVyIHNvIGl0XG4gICAgICAgIC8vIGRvZXNuJ3QgaGF2ZSB0byBpdGVyYXRlIGV2ZXJ5XG4gICAgICAgIC8vIGNoaWxkIGluIGFuIHVwZGF0ZVxuICAgICAgICB0aGlzLml0ZW1zLmZvckVhY2godGhpcy51cGRhdGVJdGVtKVxuICAgICAgfSlcbiAgICB9LFxuICAgIHVwZGF0ZUludGVybmFsVmFsdWUgKHZhbHVlOiBhbnkpIHtcbiAgICAgIHRoaXMubXVsdGlwbGVcbiAgICAgICAgPyB0aGlzLnVwZGF0ZU11bHRpcGxlKHZhbHVlKVxuICAgICAgICA6IHRoaXMudXBkYXRlU2luZ2xlKHZhbHVlKVxuICAgIH0sXG4gICAgdXBkYXRlTWFuZGF0b3J5IChsYXN0PzogYm9vbGVhbikge1xuICAgICAgaWYgKCF0aGlzLml0ZW1zLmxlbmd0aCkgcmV0dXJuXG5cbiAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5pdGVtcy5zbGljZSgpXG5cbiAgICAgIGlmIChsYXN0KSBpdGVtcy5yZXZlcnNlKClcblxuICAgICAgY29uc3QgaXRlbSA9IGl0ZW1zLmZpbmQoaXRlbSA9PiAhaXRlbS5kaXNhYmxlZClcblxuICAgICAgLy8gSWYgbm8gdGFicyBhcmUgYXZhaWxhYmxlXG4gICAgICAvLyBhYm9ydHMgbWFuZGF0b3J5IHZhbHVlXG4gICAgICBpZiAoIWl0ZW0pIHJldHVyblxuXG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuaXRlbXMuaW5kZXhPZihpdGVtKVxuXG4gICAgICB0aGlzLnVwZGF0ZUludGVybmFsVmFsdWUoXG4gICAgICAgIHRoaXMuZ2V0VmFsdWUoaXRlbSwgaW5kZXgpXG4gICAgICApXG4gICAgfSxcbiAgICB1cGRhdGVNdWx0aXBsZSAodmFsdWU6IGFueSkge1xuICAgICAgY29uc3QgZGVmYXVsdFZhbHVlID0gQXJyYXkuaXNBcnJheSh0aGlzLmludGVybmFsVmFsdWUpXG4gICAgICAgID8gdGhpcy5pbnRlcm5hbFZhbHVlXG4gICAgICAgIDogW11cbiAgICAgIGNvbnN0IGludGVybmFsVmFsdWUgPSBkZWZhdWx0VmFsdWUuc2xpY2UoKVxuICAgICAgY29uc3QgaW5kZXggPSBpbnRlcm5hbFZhbHVlLmZpbmRJbmRleCh2YWwgPT4gdGhpcy52YWx1ZUNvbXBhcmF0b3IodmFsLCB2YWx1ZSkpXG5cbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5tYW5kYXRvcnkgJiZcbiAgICAgICAgLy8gSXRlbSBhbHJlYWR5IGV4aXN0c1xuICAgICAgICBpbmRleCA+IC0xICYmXG4gICAgICAgIC8vIHZhbHVlIHdvdWxkIGJlIHJlZHVjZWQgYmVsb3cgbWluXG4gICAgICAgIGludGVybmFsVmFsdWUubGVuZ3RoIC0gMSA8IDFcbiAgICAgICkgcmV0dXJuXG5cbiAgICAgIGlmIChcbiAgICAgICAgLy8gTWF4IGlzIHNldFxuICAgICAgICB0aGlzLm1heCAhPSBudWxsICYmXG4gICAgICAgIC8vIEl0ZW0gZG9lc24ndCBleGlzdFxuICAgICAgICBpbmRleCA8IDAgJiZcbiAgICAgICAgLy8gdmFsdWUgd291bGQgYmUgaW5jcmVhc2VkIGFib3ZlIG1heFxuICAgICAgICBpbnRlcm5hbFZhbHVlLmxlbmd0aCArIDEgPiB0aGlzLm1heFxuICAgICAgKSByZXR1cm5cblxuICAgICAgaW5kZXggPiAtMVxuICAgICAgICA/IGludGVybmFsVmFsdWUuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICA6IGludGVybmFsVmFsdWUucHVzaCh2YWx1ZSlcblxuICAgICAgdGhpcy5pbnRlcm5hbFZhbHVlID0gaW50ZXJuYWxWYWx1ZVxuICAgIH0sXG4gICAgdXBkYXRlU2luZ2xlICh2YWx1ZTogYW55KSB7XG4gICAgICBjb25zdCBpc1NhbWUgPSB0aGlzLnZhbHVlQ29tcGFyYXRvcih0aGlzLmludGVybmFsVmFsdWUsIHZhbHVlKVxuXG4gICAgICBpZiAodGhpcy5tYW5kYXRvcnkgJiYgaXNTYW1lKSByZXR1cm5cblxuICAgICAgdGhpcy5pbnRlcm5hbFZhbHVlID0gaXNTYW1lID8gdW5kZWZpbmVkIDogdmFsdWVcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoKTogVk5vZGUge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmdlbkRhdGEoKVxuICAgIHJldHVybiBoKHRoaXMudGFnLCB7XG4gICAgICBjbGFzczogZGF0YS5jbGFzcyxcbiAgICAgIC4uLmRhdGEuYXR0cnMsXG4gICAgfSwgZ2V0U2xvdCh0aGlzKSlcbiAgfSxcbn0pXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XG4gIG5hbWU6ICd2LWl0ZW0tZ3JvdXAnLFxuICBleHRlbmRzOiBCYXNlSXRlbUdyb3VwLFxuXG4gIHByb3ZpZGUgKCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGl0ZW1Hcm91cDogdGhpcyxcbiAgICB9XG4gIH0sXG59KVxuIl19