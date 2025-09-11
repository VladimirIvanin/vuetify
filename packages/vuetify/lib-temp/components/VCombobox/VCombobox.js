// Styles
import '../VAutocomplete/VAutocomplete.sass';
// Extensions
import VSelect from '../VSelect/VSelect';
import VAutocomplete from '../VAutocomplete/VAutocomplete';
// Utils
import { keyCodes } from '../../util/helpers';
import { defineComponent } from 'vue';
/* @vue/component */
export default defineComponent({
    name: 'v-combobox',
    extends: VAutocomplete,
    props: {
        delimiters: {
            type: Array,
            default: () => ([]),
        },
        returnObject: {
            type: Boolean,
            default: true,
        },
    },
    emits: [
        'update:search-input',
        'update:modelValue',
        'change',
        'focus',
        'blur',
        'keydown',
        'click',
        'update:list-index',
        'mousedown',
        'mouseup',
        'touchstart',
        'touchend',
        'click:prepend',
        'click:append',
        'click:append-outer',
        'click:prepend-inner',
        'click:clear',
        'input',
        'update:error',
        'paste',
    ],
    data: () => ({
        editingIndex: -1,
    }),
    computed: {
        computedCounterValue() {
            return this.multiple
                ? this.selectedItems.length
                : (this.internalSearch || '').toString().length;
        },
        hasSlot() {
            return VSelect.computed.hasSlot.call(this) || this.multiple;
        },
        isAnyValueAllowed() {
            return true;
        },
        menuCanShow() {
            if (!this.isFocused)
                return false;
            return this.hasDisplayedItems ||
                (!!this.$slots['no-data'] && !this.hideNoData);
        },
        searchIsDirty() {
            return this.internalSearch != null;
        },
    },
    methods: {
        onInternalSearchChanged(val) {
            if (val &&
                this.multiple &&
                this.delimiters.length) {
                const delimiter = this.delimiters.find(d => val.endsWith(d));
                if (delimiter != null) {
                    this.internalSearch = val.slice(0, val.length - delimiter.length);
                    this.updateTags();
                }
            }
            this.updateMenuDimensions();
        },
        genInput() {
            const input = VAutocomplete.methods.genInput.call(this);
            delete input.props.name;
            input.onPaste = this.onPaste;
            return input;
        },
        genChipSelection(item, index) {
            const chip = VSelect.methods.genChipSelection.call(this, item, index);
            // Allow user to update an existing value
            if (this.multiple) {
                chip.props.onDblclick = () => {
                    this.editingIndex = index;
                    this.internalSearch = this.getText(item);
                    this.selectedIndex = -1;
                };
            }
            return chip;
        },
        onChipInput(item) {
            VSelect.methods.onChipInput.call(this, item);
            this.editingIndex = -1;
        },
        // Requires a manual definition
        // to overwrite removal in v-autocomplete
        onEnterDown(e) {
            e.preventDefault();
            // If has menu index, let v-select-list handle
            if (this.getMenuIndex() > -1)
                return;
            this.$nextTick(this.updateSelf);
        },
        onKeyDown(e) {
            const keyCode = e.keyCode;
            if (e.ctrlKey ||
                ![keyCodes.home, keyCodes.end].includes(keyCode)) {
                VSelect.methods.onKeyDown.call(this, e);
            }
            // If user is at selection index of 0
            // create a new tag
            if (this.multiple &&
                keyCode === keyCodes.left &&
                this.$refs.input.selectionStart === 0) {
                this.updateSelf();
            }
            else if (keyCode === keyCodes.enter) {
                this.onEnterDown(e);
            }
            // The ordering is important here
            // allows new value to be updated
            // and then moves the index to the
            // proper location
            this.changeSelectedIndex(keyCode);
        },
        onTabDown(e) {
            // When adding tags, if searching and
            // there is not a filtered options,
            // add the value to the tags list
            if (this.multiple &&
                this.internalSearch &&
                this.getMenuIndex() === -1) {
                e.preventDefault();
                e.stopPropagation();
                return this.updateTags();
            }
            VAutocomplete.methods.onTabDown.call(this, e);
        },
        selectItem(item) {
            // Currently only supports items:<string[]>
            if (this.editingIndex > -1) {
                this.updateEditing();
            }
            else {
                VAutocomplete.methods.selectItem.call(this, item);
                // if selected item contains search value,
                // remove the search string
                if (this.internalSearch &&
                    this.multiple &&
                    this.getText(item).toLocaleLowerCase().includes(this.internalSearch.toLocaleLowerCase())) {
                    this.internalSearch = null;
                }
            }
        },
        setSelectedItems() {
            if (this.internalValue == null ||
                this.internalValue === '') {
                this.selectedItems = [];
            }
            else {
                this.selectedItems = this.multiple ? this.internalValue : [this.internalValue];
            }
        },
        setValue(value) {
            VSelect.methods.setValue.call(this, value === undefined ? this.internalSearch : value);
        },
        updateEditing() {
            const value = this.internalValue.slice();
            const index = this.selectedItems.findIndex(item => this.getText(item) === this.internalSearch);
            // If user enters a duplicate text on chip edit,
            // don't add it, move it to the end of the list
            if (index > -1) {
                const item = typeof value[index] === 'object'
                    ? Object.assign({}, value[index])
                    : value[index];
                value.splice(index, 1);
                value.push(item);
            }
            else {
                value[this.editingIndex] = this.internalSearch;
            }
            this.setValue(value);
            this.editingIndex = -1;
            this.internalSearch = null;
        },
        updateCombobox() {
            // If search is not dirty, do nothing
            if (!this.searchIsDirty)
                return;
            // The internal search is not matching
            // the internal value, update the input
            if (this.internalSearch !== this.getText(this.internalValue))
                this.setValue();
            // Reset search if using slot to avoid a double input
            const isUsingSlot = Boolean(this.$slots.selection) || this.hasChips;
            if (isUsingSlot)
                this.internalSearch = null;
        },
        updateSelf() {
            this.multiple ? this.updateTags() : this.updateCombobox();
        },
        updateTags() {
            const menuIndex = this.getMenuIndex();
            // If the user is not searching
            // and no menu item is selected
            // or if the search is empty
            // do nothing
            if ((menuIndex < 0 && !this.searchIsDirty) ||
                !this.internalSearch)
                return;
            if (this.editingIndex > -1) {
                return this.updateEditing();
            }
            const index = this.selectedItems.findIndex(item => this.internalSearch === this.getText(item));
            // If the duplicate item is an object,
            // copy it, so that it can be added again later
            const itemToSelect = index > -1 && typeof this.selectedItems[index] === 'object'
                ? Object.assign({}, this.selectedItems[index])
                : this.internalSearch;
            // If it already exists, do nothing
            // this might need to change to bring
            // the duplicated item to the last entered
            if (index > -1) {
                const internalValue = this.internalValue.slice();
                internalValue.splice(index, 1);
                this.setValue(internalValue);
            }
            // If menu index is greater than 1
            // the selection is handled elsewhere
            // TODO: find out where
            if (menuIndex > -1)
                return (this.internalSearch = null);
            this.selectItem(itemToSelect);
            this.internalSearch = null;
        },
        onPaste(event) {
            var _a;
            this.$emit('paste', event);
            if (!this.multiple || this.searchIsDirty)
                return;
            const pastedItemText = (_a = event.clipboardData) === null || _a === void 0 ? void 0 : _a.getData('text/vnd.vuetify.autocomplete.item+plain');
            if (pastedItemText && this.findExistingIndex(pastedItemText) === -1) {
                event.preventDefault();
                VSelect.methods.selectItem.call(this, pastedItemText);
            }
        },
        clearableCallback() {
            this.editingIndex = -1;
            VAutocomplete.methods.clearableCallback.call(this);
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNvbWJvYm94LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkNvbWJvYm94L1ZDb21ib2JveC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxxQ0FBcUMsQ0FBQTtBQUU1QyxhQUFhO0FBQ2IsT0FBTyxPQUFPLE1BQU0sb0JBQW9CLENBQUE7QUFDeEMsT0FBTyxhQUFhLE1BQU0sZ0NBQWdDLENBQUE7QUFFMUQsUUFBUTtBQUNSLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUk3QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBRXJDLG9CQUFvQjtBQUNwQixlQUFlLGVBQWUsQ0FBQztJQUM3QixJQUFJLEVBQUUsWUFBWTtJQUVsQixPQUFPLEVBQUUsYUFBYTtJQUV0QixLQUFLLEVBQUU7UUFDTCxVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsS0FBSztZQUNYLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUNPO1FBQzVCLFlBQVksRUFBRTtZQUNaLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLElBQUk7U0FDZDtLQUNGO0lBRUQsS0FBSyxFQUFFO1FBQ0wscUJBQXFCO1FBQ3JCLG1CQUFtQjtRQUNuQixRQUFRO1FBQ1IsT0FBTztRQUNQLE1BQU07UUFDTixTQUFTO1FBQ1QsT0FBTztRQUNQLG1CQUFtQjtRQUNuQixXQUFXO1FBQ1gsU0FBUztRQUNULFlBQVk7UUFDWixVQUFVO1FBQ1YsZUFBZTtRQUNmLGNBQWM7UUFDZCxvQkFBb0I7UUFDcEIscUJBQXFCO1FBQ3JCLGFBQWE7UUFDYixPQUFPO1FBQ1AsY0FBYztRQUNkLE9BQU87S0FDUjtJQUVELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsWUFBWSxFQUFFLENBQUMsQ0FBQztLQUNqQixDQUFDO0lBRUYsUUFBUSxFQUFF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QUFPLENBQUMsMENBQTBDLENBQUMsQ0FBQTtZQUMvRixJQUFJLGNBQWMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsY0FBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUMxRSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUE7Z0JBQ3RCLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsY0FBcUIsQ0FBQyxDQUFBO2FBQzdEO1FBQ0gsQ0FBQztRQUNELGlCQUFpQjtZQUNmLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUE7WUFFdEIsYUFBYSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDcEQsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXG5pbXBvcnQgJy4uL1ZBdXRvY29tcGxldGUvVkF1dG9jb21wbGV0ZS5zYXNzJ1xuXG4vLyBFeHRlbnNpb25zXG5pbXBvcnQgVlNlbGVjdCBmcm9tICcuLi9WU2VsZWN0L1ZTZWxlY3QnXG5pbXBvcnQgVkF1dG9jb21wbGV0ZSBmcm9tICcuLi9WQXV0b2NvbXBsZXRlL1ZBdXRvY29tcGxldGUnXG5cbi8vIFV0aWxzXG5pbXBvcnQgeyBrZXlDb2RlcyB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcblxuLy8gVHlwZXNcbmltcG9ydCB7IFByb3BWYWxpZGF0b3IgfSBmcm9tICd2dWUvdHlwZXMvb3B0aW9ucydcbmltcG9ydCB7IGRlZmluZUNvbXBvbmVudCB9IGZyb20gJ3Z1ZSdcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XG4gIG5hbWU6ICd2LWNvbWJvYm94JyxcblxuICBleHRlbmRzOiBWQXV0b2NvbXBsZXRlLFxuXG4gIHByb3BzOiB7XG4gICAgZGVsaW1pdGVyczoge1xuICAgICAgdHlwZTogQXJyYXksXG4gICAgICBkZWZhdWx0OiAoKSA9PiAoW10pLFxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjxzdHJpbmdbXT4sXG4gICAgcmV0dXJuT2JqZWN0OiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB9LFxuICB9LFxuXG4gIGVtaXRzOiBbXG4gICAgJ3VwZGF0ZTpzZWFyY2gtaW5wdXQnLFxuICAgICd1cGRhdGU6bW9kZWxWYWx1ZScsXG4gICAgJ2NoYW5nZScsXG4gICAgJ2ZvY3VzJyxcbiAgICAnYmx1cicsXG4gICAgJ2tleWRvd24nLFxuICAgICdjbGljaycsXG4gICAgJ3VwZGF0ZTpsaXN0LWluZGV4JyxcbiAgICAnbW91c2Vkb3duJyxcbiAgICAnbW91c2V1cCcsXG4gICAgJ3RvdWNoc3RhcnQnLFxuICAgICd0b3VjaGVuZCcsXG4gICAgJ2NsaWNrOnByZXBlbmQnLFxuICAgICdjbGljazphcHBlbmQnLFxuICAgICdjbGljazphcHBlbmQtb3V0ZXInLFxuICAgICdjbGljazpwcmVwZW5kLWlubmVyJyxcbiAgICAnY2xpY2s6Y2xlYXInLFxuICAgICdpbnB1dCcsXG4gICAgJ3VwZGF0ZTplcnJvcicsXG4gICAgJ3Bhc3RlJyxcbiAgXSxcblxuICBkYXRhOiAoKSA9PiAoe1xuICAgIGVkaXRpbmdJbmRleDogLTEsXG4gIH0pLFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY29tcHV0ZWRDb3VudGVyVmFsdWUgKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gdGhpcy5tdWx0aXBsZVxuICAgICAgICA/IHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGhcbiAgICAgICAgOiAodGhpcy5pbnRlcm5hbFNlYXJjaCB8fCAnJykudG9TdHJpbmcoKS5sZW5ndGhcbiAgICB9LFxuICAgIGhhc1Nsb3QgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIFZTZWxlY3QuY29tcHV0ZWQuaGFzU2xvdC5jYWxsKHRoaXMpIHx8IHRoaXMubXVsdGlwbGVcbiAgICB9LFxuICAgIGlzQW55VmFsdWVBbGxvd2VkICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSxcbiAgICBtZW51Q2FuU2hvdyAoKTogYm9vbGVhbiB7XG4gICAgICBpZiAoIXRoaXMuaXNGb2N1c2VkKSByZXR1cm4gZmFsc2VcblxuICAgICAgcmV0dXJuIHRoaXMuaGFzRGlzcGxheWVkSXRlbXMgfHxcbiAgICAgICAgKCEhdGhpcy4kc2xvdHNbJ25vLWRhdGEnXSAmJiAhdGhpcy5oaWRlTm9EYXRhKVxuICAgIH0sXG4gICAgc2VhcmNoSXNEaXJ0eSAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbFNlYXJjaCAhPSBudWxsXG4gICAgfSxcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgb25JbnRlcm5hbFNlYXJjaENoYW5nZWQgKHZhbDogYW55KSB7XG4gICAgICBpZiAoXG4gICAgICAgIHZhbCAmJlxuICAgICAgICB0aGlzLm11bHRpcGxlICYmXG4gICAgICAgIHRoaXMuZGVsaW1pdGVycy5sZW5ndGhcbiAgICAgICkge1xuICAgICAgICBjb25zdCBkZWxpbWl0ZXIgPSB0aGlzLmRlbGltaXRlcnMuZmluZChkID0+IHZhbC5lbmRzV2l0aChkKSlcbiAgICAgICAgaWYgKGRlbGltaXRlciAhPSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5pbnRlcm5hbFNlYXJjaCA9IHZhbC5zbGljZSgwLCB2YWwubGVuZ3RoIC0gZGVsaW1pdGVyLmxlbmd0aClcbiAgICAgICAgICB0aGlzLnVwZGF0ZVRhZ3MoKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMudXBkYXRlTWVudURpbWVuc2lvbnMoKVxuICAgIH0sXG4gICAgZ2VuSW5wdXQgKCkge1xuICAgICAgY29uc3QgaW5wdXQgPSBWQXV0b2NvbXBsZXRlLm1ldGhvZHMuZ2VuSW5wdXQuY2FsbCh0aGlzKVxuXG4gICAgICBkZWxldGUgaW5wdXQucHJvcHMubmFtZVxuICAgICAgaW5wdXQub25QYXN0ZSA9IHRoaXMub25QYXN0ZVxuXG4gICAgICByZXR1cm4gaW5wdXRcbiAgICB9LFxuICAgIGdlbkNoaXBTZWxlY3Rpb24gKGl0ZW06IG9iamVjdCwgaW5kZXg6IG51bWJlcikge1xuICAgICAgY29uc3QgY2hpcCA9IFZTZWxlY3QubWV0aG9kcy5nZW5DaGlwU2VsZWN0aW9uLmNhbGwodGhpcywgaXRlbSwgaW5kZXgpXG5cbiAgICAgIC8vIEFsbG93IHVzZXIgdG8gdXBkYXRlIGFuIGV4aXN0aW5nIHZhbHVlXG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgICBjaGlwLnByb3BzLm9uRGJsY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5lZGl0aW5nSW5kZXggPSBpbmRleFxuICAgICAgICAgIHRoaXMuaW50ZXJuYWxTZWFyY2ggPSB0aGlzLmdldFRleHQoaXRlbSlcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAtMVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjaGlwXG4gICAgfSxcbiAgICBvbkNoaXBJbnB1dCAoaXRlbTogb2JqZWN0KSB7XG4gICAgICBWU2VsZWN0Lm1ldGhvZHMub25DaGlwSW5wdXQuY2FsbCh0aGlzLCBpdGVtKVxuXG4gICAgICB0aGlzLmVkaXRpbmdJbmRleCA9IC0xXG4gICAgfSxcbiAgICAvLyBSZXF1aXJlcyBhIG1hbnVhbCBkZWZpbml0aW9uXG4gICAgLy8gdG8gb3ZlcndyaXRlIHJlbW92YWwgaW4gdi1hdXRvY29tcGxldGVcbiAgICBvbkVudGVyRG93biAoZTogRXZlbnQpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgLy8gSWYgaGFzIG1lbnUgaW5kZXgsIGxldCB2LXNlbGVjdC1saXN0IGhhbmRsZVxuICAgICAgaWYgKHRoaXMuZ2V0TWVudUluZGV4KCkgPiAtMSkgcmV0dXJuXG5cbiAgICAgIHRoaXMuJG5leHRUaWNrKHRoaXMudXBkYXRlU2VsZilcbiAgICB9LFxuICAgIG9uS2V5RG93biAoZTogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgY29uc3Qga2V5Q29kZSA9IGUua2V5Q29kZVxuXG4gICAgICBpZiAoXG4gICAgICAgIGUuY3RybEtleSB8fFxuICAgICAgICAhW2tleUNvZGVzLmhvbWUsIGtleUNvZGVzLmVuZF0uaW5jbHVkZXMoa2V5Q29kZSlcbiAgICAgICkge1xuICAgICAgICBWU2VsZWN0Lm1ldGhvZHMub25LZXlEb3duLmNhbGwodGhpcywgZSlcbiAgICAgIH1cblxuICAgICAgLy8gSWYgdXNlciBpcyBhdCBzZWxlY3Rpb24gaW5kZXggb2YgMFxuICAgICAgLy8gY3JlYXRlIGEgbmV3IHRhZ1xuICAgICAgaWYgKHRoaXMubXVsdGlwbGUgJiZcbiAgICAgICAga2V5Q29kZSA9PT0ga2V5Q29kZXMubGVmdCAmJlxuICAgICAgICB0aGlzLiRyZWZzLmlucHV0LnNlbGVjdGlvblN0YXJ0ID09PSAwXG4gICAgICApIHtcbiAgICAgICAgdGhpcy51cGRhdGVTZWxmKClcbiAgICAgIH0gZWxzZSBpZiAoa2V5Q29kZSA9PT0ga2V5Q29kZXMuZW50ZXIpIHtcbiAgICAgICAgdGhpcy5vbkVudGVyRG93bihlKVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgb3JkZXJpbmcgaXMgaW1wb3J0YW50IGhlcmVcbiAgICAgIC8vIGFsbG93cyBuZXcgdmFsdWUgdG8gYmUgdXBkYXRlZFxuICAgICAgLy8gYW5kIHRoZW4gbW92ZXMgdGhlIGluZGV4IHRvIHRoZVxuICAgICAgLy8gcHJvcGVyIGxvY2F0aW9uXG4gICAgICB0aGlzLmNoYW5nZVNlbGVjdGVkSW5kZXgoa2V5Q29kZSlcbiAgICB9LFxuICAgIG9uVGFiRG93biAoZTogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgLy8gV2hlbiBhZGRpbmcgdGFncywgaWYgc2VhcmNoaW5nIGFuZFxuICAgICAgLy8gdGhlcmUgaXMgbm90IGEgZmlsdGVyZWQgb3B0aW9ucyxcbiAgICAgIC8vIGFkZCB0aGUgdmFsdWUgdG8gdGhlIHRhZ3MgbGlzdFxuICAgICAgaWYgKHRoaXMubXVsdGlwbGUgJiZcbiAgICAgICAgdGhpcy5pbnRlcm5hbFNlYXJjaCAmJlxuICAgICAgICB0aGlzLmdldE1lbnVJbmRleCgpID09PSAtMVxuICAgICAgKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlVGFncygpXG4gICAgICB9XG5cbiAgICAgIFZBdXRvY29tcGxldGUubWV0aG9kcy5vblRhYkRvd24uY2FsbCh0aGlzLCBlKVxuICAgIH0sXG4gICAgc2VsZWN0SXRlbSAoaXRlbTogb2JqZWN0KSB7XG4gICAgICAvLyBDdXJyZW50bHkgb25seSBzdXBwb3J0cyBpdGVtczo8c3RyaW5nW10+XG4gICAgICBpZiAodGhpcy5lZGl0aW5nSW5kZXggPiAtMSkge1xuICAgICAgICB0aGlzLnVwZGF0ZUVkaXRpbmcoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgVkF1dG9jb21wbGV0ZS5tZXRob2RzLnNlbGVjdEl0ZW0uY2FsbCh0aGlzLCBpdGVtKVxuXG4gICAgICAgIC8vIGlmIHNlbGVjdGVkIGl0ZW0gY29udGFpbnMgc2VhcmNoIHZhbHVlLFxuICAgICAgICAvLyByZW1vdmUgdGhlIHNlYXJjaCBzdHJpbmdcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMuaW50ZXJuYWxTZWFyY2ggJiZcbiAgICAgICAgICB0aGlzLm11bHRpcGxlICYmXG4gICAgICAgICAgdGhpcy5nZXRUZXh0KGl0ZW0pLnRvTG9jYWxlTG93ZXJDYXNlKCkuaW5jbHVkZXModGhpcy5pbnRlcm5hbFNlYXJjaC50b0xvY2FsZUxvd2VyQ2FzZSgpKVxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLmludGVybmFsU2VhcmNoID0gbnVsbFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBzZXRTZWxlY3RlZEl0ZW1zICgpIHtcbiAgICAgIGlmICh0aGlzLmludGVybmFsVmFsdWUgPT0gbnVsbCB8fFxuICAgICAgICB0aGlzLmludGVybmFsVmFsdWUgPT09ICcnXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gW11cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IHRoaXMubXVsdGlwbGUgPyB0aGlzLmludGVybmFsVmFsdWUgOiBbdGhpcy5pbnRlcm5hbFZhbHVlXVxuICAgICAgfVxuICAgIH0sXG4gICAgc2V0VmFsdWUgKHZhbHVlPzogYW55KSB7XG4gICAgICBWU2VsZWN0Lm1ldGhvZHMuc2V0VmFsdWUuY2FsbCh0aGlzLCB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdGhpcy5pbnRlcm5hbFNlYXJjaCA6IHZhbHVlKVxuICAgIH0sXG4gICAgdXBkYXRlRWRpdGluZyAoKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuaW50ZXJuYWxWYWx1ZS5zbGljZSgpXG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuc2VsZWN0ZWRJdGVtcy5maW5kSW5kZXgoaXRlbSA9PlxuICAgICAgICB0aGlzLmdldFRleHQoaXRlbSkgPT09IHRoaXMuaW50ZXJuYWxTZWFyY2gpXG5cbiAgICAgIC8vIElmIHVzZXIgZW50ZXJzIGEgZHVwbGljYXRlIHRleHQgb24gY2hpcCBlZGl0LFxuICAgICAgLy8gZG9uJ3QgYWRkIGl0LCBtb3ZlIGl0IHRvIHRoZSBlbmQgb2YgdGhlIGxpc3RcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0eXBlb2YgdmFsdWVbaW5kZXhdID09PSAnb2JqZWN0J1xuICAgICAgICAgID8gT2JqZWN0LmFzc2lnbih7fSwgdmFsdWVbaW5kZXhdKVxuICAgICAgICAgIDogdmFsdWVbaW5kZXhdXG5cbiAgICAgICAgdmFsdWUuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICB2YWx1ZS5wdXNoKGl0ZW0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZVt0aGlzLmVkaXRpbmdJbmRleF0gPSB0aGlzLmludGVybmFsU2VhcmNoXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0VmFsdWUodmFsdWUpXG4gICAgICB0aGlzLmVkaXRpbmdJbmRleCA9IC0xXG4gICAgICB0aGlzLmludGVybmFsU2VhcmNoID0gbnVsbFxuICAgIH0sXG4gICAgdXBkYXRlQ29tYm9ib3ggKCkge1xuICAgICAgLy8gSWYgc2VhcmNoIGlzIG5vdCBkaXJ0eSwgZG8gbm90aGluZ1xuICAgICAgaWYgKCF0aGlzLnNlYXJjaElzRGlydHkpIHJldHVyblxuXG4gICAgICAvLyBUaGUgaW50ZXJuYWwgc2VhcmNoIGlzIG5vdCBtYXRjaGluZ1xuICAgICAgLy8gdGhlIGludGVybmFsIHZhbHVlLCB1cGRhdGUgdGhlIGlucHV0XG4gICAgICBpZiAodGhpcy5pbnRlcm5hbFNlYXJjaCAhPT0gdGhpcy5nZXRUZXh0KHRoaXMuaW50ZXJuYWxWYWx1ZSkpIHRoaXMuc2V0VmFsdWUoKVxuXG4gICAgICAvLyBSZXNldCBzZWFyY2ggaWYgdXNpbmcgc2xvdCB0byBhdm9pZCBhIGRvdWJsZSBpbnB1dFxuICAgICAgY29uc3QgaXNVc2luZ1Nsb3QgPSBCb29sZWFuKHRoaXMuJHNsb3RzLnNlbGVjdGlvbikgfHwgdGhpcy5oYXNDaGlwc1xuICAgICAgaWYgKGlzVXNpbmdTbG90KSB0aGlzLmludGVybmFsU2VhcmNoID0gbnVsbFxuICAgIH0sXG4gICAgdXBkYXRlU2VsZiAoKSB7XG4gICAgICB0aGlzLm11bHRpcGxlID8gdGhpcy51cGRhdGVUYWdzKCkgOiB0aGlzLnVwZGF0ZUNvbWJvYm94KClcbiAgICB9LFxuICAgIHVwZGF0ZVRhZ3MgKCkge1xuICAgICAgY29uc3QgbWVudUluZGV4ID0gdGhpcy5nZXRNZW51SW5kZXgoKVxuXG4gICAgICAvLyBJZiB0aGUgdXNlciBpcyBub3Qgc2VhcmNoaW5nXG4gICAgICAvLyBhbmQgbm8gbWVudSBpdGVtIGlzIHNlbGVjdGVkXG4gICAgICAvLyBvciBpZiB0aGUgc2VhcmNoIGlzIGVtcHR5XG4gICAgICAvLyBkbyBub3RoaW5nXG4gICAgICBpZiAoKG1lbnVJbmRleCA8IDAgJiYgIXRoaXMuc2VhcmNoSXNEaXJ0eSkgfHxcbiAgICAgICAgICAhdGhpcy5pbnRlcm5hbFNlYXJjaCkgcmV0dXJuXG5cbiAgICAgIGlmICh0aGlzLmVkaXRpbmdJbmRleCA+IC0xKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZUVkaXRpbmcoKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuc2VsZWN0ZWRJdGVtcy5maW5kSW5kZXgoaXRlbSA9PlxuICAgICAgICB0aGlzLmludGVybmFsU2VhcmNoID09PSB0aGlzLmdldFRleHQoaXRlbSkpXG5cbiAgICAgIC8vIElmIHRoZSBkdXBsaWNhdGUgaXRlbSBpcyBhbiBvYmplY3QsXG4gICAgICAvLyBjb3B5IGl0LCBzbyB0aGF0IGl0IGNhbiBiZSBhZGRlZCBhZ2FpbiBsYXRlclxuICAgICAgY29uc3QgaXRlbVRvU2VsZWN0ID0gaW5kZXggPiAtMSAmJiB0eXBlb2YgdGhpcy5zZWxlY3RlZEl0ZW1zW2luZGV4XSA9PT0gJ29iamVjdCdcbiAgICAgICAgPyBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnNlbGVjdGVkSXRlbXNbaW5kZXhdKVxuICAgICAgICA6IHRoaXMuaW50ZXJuYWxTZWFyY2hcblxuICAgICAgLy8gSWYgaXQgYWxyZWFkeSBleGlzdHMsIGRvIG5vdGhpbmdcbiAgICAgIC8vIHRoaXMgbWlnaHQgbmVlZCB0byBjaGFuZ2UgdG8gYnJpbmdcbiAgICAgIC8vIHRoZSBkdXBsaWNhdGVkIGl0ZW0gdG8gdGhlIGxhc3QgZW50ZXJlZFxuICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgY29uc3QgaW50ZXJuYWxWYWx1ZSA9IHRoaXMuaW50ZXJuYWxWYWx1ZS5zbGljZSgpXG4gICAgICAgIGludGVybmFsVmFsdWUuc3BsaWNlKGluZGV4LCAxKVxuXG4gICAgICAgIHRoaXMuc2V0VmFsdWUoaW50ZXJuYWxWYWx1ZSlcbiAgICAgIH1cblxuICAgICAgLy8gSWYgbWVudSBpbmRleCBpcyBncmVhdGVyIHRoYW4gMVxuICAgICAgLy8gdGhlIHNlbGVjdGlvbiBpcyBoYW5kbGVkIGVsc2V3aGVyZVxuICAgICAgLy8gVE9ETzogZmluZCBvdXQgd2hlcmVcbiAgICAgIGlmIChtZW51SW5kZXggPiAtMSkgcmV0dXJuICh0aGlzLmludGVybmFsU2VhcmNoID0gbnVsbClcblxuICAgICAgdGhpcy5zZWxlY3RJdGVtKGl0ZW1Ub1NlbGVjdClcblxuICAgICAgdGhpcy5pbnRlcm5hbFNlYXJjaCA9IG51bGxcbiAgICB9LFxuICAgIG9uUGFzdGUgKGV2ZW50OiBDbGlwYm9hcmRFdmVudCkge1xuICAgICAgdGhpcy4kZW1pdCgncGFzdGUnLCBldmVudClcbiAgICAgIGlmICghdGhpcy5tdWx0aXBsZSB8fCB0aGlzLnNlYXJjaElzRGlydHkpIHJldHVyblxuXG4gICAgICBjb25zdCBwYXN0ZWRJdGVtVGV4dCA9IGV2ZW50LmNsaXBib2FyZERhdGE/LmdldERhdGEoJ3RleHQvdm5kLnZ1ZXRpZnkuYXV0b2NvbXBsZXRlLml0ZW0rcGxhaW4nKVxuICAgICAgaWYgKHBhc3RlZEl0ZW1UZXh0ICYmIHRoaXMuZmluZEV4aXN0aW5nSW5kZXgocGFzdGVkSXRlbVRleHQgYXMgYW55KSA9PT0gLTEpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICBWU2VsZWN0Lm1ldGhvZHMuc2VsZWN0SXRlbS5jYWxsKHRoaXMsIHBhc3RlZEl0ZW1UZXh0IGFzIGFueSlcbiAgICAgIH1cbiAgICB9LFxuICAgIGNsZWFyYWJsZUNhbGxiYWNrICgpIHtcbiAgICAgIHRoaXMuZWRpdGluZ0luZGV4ID0gLTFcblxuICAgICAgVkF1dG9jb21wbGV0ZS5tZXRob2RzLmNsZWFyYWJsZUNhbGxiYWNrLmNhbGwodGhpcylcbiAgICB9LFxuICB9LFxufSlcbiJdfQ==