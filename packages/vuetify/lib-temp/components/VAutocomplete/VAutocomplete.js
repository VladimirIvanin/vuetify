// Styles
import './VAutocomplete.sass';
// Extensions
import VSelect, { defaultMenuProps as VSelectMenuProps } from '../VSelect/VSelect';
import VTextField from '../VTextField/VTextField';
// Utilities
import { defineComponent, mergeProps } from 'vue';
import { getObjectValueByPath, getPropertyFromItem, keyCodes, } from '../../util/helpers';
const defaultMenuProps = {
    ...VSelectMenuProps,
    offsetY: true,
    offsetOverflow: true,
    transition: false,
};
/* @vue/component */
export default defineComponent({
    name: 'v-autocomplete',
    extends: VSelect,
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
    ],
    props: {
        autoSelectFirst: {
            type: Boolean,
            default: false,
        },
        filter: {
            type: Function,
            default: (item, queryText, itemText) => {
                return itemText.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1;
            },
        },
        hideNoData: Boolean,
        menuProps: {
            type: VSelect.props.menuProps.type,
            default: () => defaultMenuProps,
        },
        noFilter: Boolean,
        searchInput: {
            type: String,
        },
    },
    data() {
        return {
            lazySearch: this.searchInput,
        };
    },
    computed: {
        classes() {
            return {
                ...VSelect.computed.classes.call(this),
                'v-autocomplete': true,
                'v-autocomplete--is-selecting-index': this.selectedIndex > -1,
            };
        },
        computedItems() {
            return this.filteredItems;
        },
        selectedValues() {
            return this.selectedItems.map(item => this.getValue(item));
        },
        hasDisplayedItems() {
            return this.hideSelected
                ? this.filteredItems.some(item => !this.hasItem(item))
                : this.filteredItems.length > 0;
        },
        currentRange() {
            if (this.selectedItem == null)
                return 0;
            return String(this.getText(this.selectedItem)).length;
        },
        filteredItems() {
            if (!this.isSearching || this.noFilter || this.internalSearch == null)
                return this.allItems;
            return this.allItems.filter(item => {
                const value = getPropertyFromItem(item, this.itemText);
                const text = value != null ? String(value) : '';
                return this.filter(item, String(this.internalSearch), text);
            });
        },
        internalSearch: {
            get() {
                return this.lazySearch;
            },
            set(val) {
                // emit update event only when the new
                // search value is different from previous
                if (this.lazySearch !== val) {
                    this.lazySearch = val;
                    this.$emit('update:search-input', val);
                }
            },
        },
        isAnyValueAllowed() {
            return false;
        },
        isDirty() {
            return this.searchIsDirty || this.selectedItems.length > 0;
        },
        isSearching() {
            return (this.multiple &&
                this.searchIsDirty) || (this.searchIsDirty &&
                this.internalSearch !== this.getText(this.selectedItem));
        },
        menuCanShow() {
            if (!this.isFocused)
                return false;
            return this.hasDisplayedItems || !this.hideNoData;
        },
        $_menuProps() {
            const props = VSelect.computed.$_menuProps.call(this);
            props.contentClass = `v-autocomplete__content ${props.contentClass || ''}`.trim();
            return {
                ...defaultMenuProps,
                ...props,
            };
        },
        searchIsDirty() {
            return this.internalSearch != null &&
                this.internalSearch !== '';
        },
        selectedItem() {
            if (this.multiple)
                return null;
            return this.selectedItems.find(i => {
                return this.valueComparator(this.getValue(i), this.getValue(this.internalValue));
            });
        },
        listData() {
            const data = VSelect.computed.listData.call(this);
            data.props = {
                ...data.props,
                items: this.virtualizedItems,
                noFilter: (this.noFilter ||
                    !this.isSearching ||
                    !this.filteredItems.length),
                searchInput: this.internalSearch,
            };
            return data;
        },
    },
    watch: {
        filteredItems: 'onFilteredItemsChanged',
        internalValue: 'setSearch',
        isFocused(val) {
            if (val) {
                document.addEventListener('copy', this.onCopy);
                this.$refs.input && this.$refs.input.select();
            }
            else {
                document.removeEventListener('copy', this.onCopy);
                this.blur();
                this.updateSelf();
            }
        },
        isMenuActive(val) {
            if (val || !this.hasSlot)
                return;
            this.lazySearch = null;
        },
        items(val, oldVal) {
            // If we are focused, the menu
            // is not active, hide no data is enabled,
            // and items change
            // User is probably async loading
            // items, try to activate the menu
            if (!(oldVal && oldVal.length) &&
                this.hideNoData &&
                this.isFocused &&
                !this.isMenuActive &&
                val.length)
                this.activateMenu();
        },
        searchInput(val) {
            this.lazySearch = val;
        },
        internalSearch: 'onInternalSearchChanged',
        itemText: 'updateSelf',
    },
    created() {
        this.setSearch();
    },
    unmounted() {
        document.removeEventListener('copy', this.onCopy);
    },
    methods: {
        onFilteredItemsChanged(val, oldVal) {
            // TODO: How is the watcher triggered
            // for duplicate items? no idea
            if (val === oldVal)
                return;
            if (!this.autoSelectFirst) {
                const preSelectedItem = oldVal[this.$refs.menu.listIndex];
                if (preSelectedItem) {
                    this.setMenuIndex(val.findIndex(i => i === preSelectedItem));
                }
                else {
                    this.setMenuIndex(-1);
                }
                this.$emit('update:list-index', this.$refs.menu.listIndex);
            }
            this.$nextTick(() => {
                if (!this.internalSearch ||
                    (val.length !== 1 &&
                        !this.autoSelectFirst))
                    return;
                this.$refs.menu.getTiles();
                if (this.autoSelectFirst && val.length) {
                    this.setMenuIndex(0);
                    this.$emit('update:list-index', this.$refs.menu.listIndex);
                }
            });
        },
        onInternalSearchChanged() {
            this.updateMenuDimensions();
        },
        updateMenuDimensions() {
            // Type from menuable is not making it through
            this.isMenuActive && this.$refs.menu && this.$refs.menu.updateDimensions();
        },
        changeSelectedIndex(keyCode) {
            // Do not allow changing of selectedIndex
            // when search is dirty
            if (this.searchIsDirty)
                return;
            if (this.multiple && keyCode === keyCodes.left) {
                if (this.selectedIndex === -1) {
                    this.selectedIndex = this.selectedItems.length - 1;
                }
                else {
                    this.selectedIndex--;
                }
            }
            else if (this.multiple && keyCode === keyCodes.right) {
                if (this.selectedIndex >= this.selectedItems.length - 1) {
                    this.selectedIndex = -1;
                }
                else {
                    this.selectedIndex++;
                }
            }
            else if (keyCode === keyCodes.backspace || keyCode === keyCodes.delete) {
                this.deleteCurrentItem();
            }
        },
        deleteCurrentItem() {
            const curIndex = this.selectedIndex;
            const curItem = this.selectedItems[curIndex];
            // Do nothing if input or item is disabled
            if (!this.isInteractive ||
                this.getDisabled(curItem))
                return;
            const lastIndex = this.selectedItems.length - 1;
            // Select the last item if
            // there is no selection
            if (this.selectedIndex === -1 &&
                lastIndex !== 0) {
                this.selectedIndex = lastIndex;
                return;
            }
            const length = this.selectedItems.length;
            const nextIndex = curIndex !== length - 1
                ? curIndex
                : curIndex - 1;
            const nextItem = this.selectedItems[nextIndex];
            if (!nextItem) {
                this.setValue(this.multiple ? [] : null);
            }
            else {
                this.selectItem(curItem);
            }
            this.selectedIndex = nextIndex;
        },
        clearableCallback() {
            this.internalSearch = null;
            VSelect.methods.clearableCallback.call(this);
        },
        genInput() {
            const input = VTextField.methods.genInput.call(this);
            const ariaActiveDescendant = getObjectValueByPath(this.$refs.menu, 'activeTile.id');
            const autocomplete = getObjectValueByPath(input.props, 'autocomplete', 'off');
            // в оригинале class не пробрасывался в инпут
            input.props = mergeProps({
                ...input.props,
                class: undefined
            }, {
                'aria-activedescendant': ariaActiveDescendant,
                autocomplete,
                value: this.internalSearch,
            });
            return input;
        },
        genInputSlot() {
            const slot = VSelect.methods.genInputSlot.call(this);
            slot.props.role = 'combobox';
            return slot;
        },
        genSelections() {
            return this.hasSlot || this.multiple
                ? VSelect.methods.genSelections.call(this)
                : [];
        },
        onClick(e) {
            if (!this.isInteractive)
                return;
            this.selectedIndex > -1
                ? (this.selectedIndex = -1)
                : this.onFocus();
            if (!this.isAppendInner(e.target))
                this.activateMenu();
        },
        onInput(e) {
            if (this.selectedIndex > -1 ||
                !e.target)
                return;
            const target = e.target;
            const value = target.value;
            // If typing and menu is not currently active
            if (target.value)
                this.activateMenu();
            if (!this.multiple && value === '')
                this.deleteCurrentItem();
            this.internalSearch = value;
            this.badInput = target.validity && target.validity.badInput;
        },
        onKeyDown(e) {
            const keyCode = e.keyCode;
            if (e.ctrlKey ||
                ![keyCodes.home, keyCodes.end].includes(keyCode)) {
                VSelect.methods.onKeyDown.call(this, e);
            }
            // The ordering is important here
            // allows new value to be updated
            // and then moves the index to the
            // proper location
            this.changeSelectedIndex(keyCode);
        },
        onSpaceDown(e) { },
        onTabDown(e) {
            VSelect.methods.onTabDown.call(this, e);
            this.updateSelf();
        },
        onUpDown(e) {
            // Prevent screen from scrolling
            e.preventDefault();
            // For autocomplete / combobox, cycling
            // interfers with native up/down behavior
            // instead activate the menu
            this.activateMenu();
        },
        selectItem(item) {
            VSelect.methods.selectItem.call(this, item);
            this.setSearch();
        },
        setSelectedItems() {
            VSelect.methods.setSelectedItems.call(this);
            // #4273 Don't replace if searching
            // #4403 Don't replace if focused
            if (!this.isFocused)
                this.setSearch();
        },
        setSearch() {
            // Wait for nextTick so selectedItem
            // has had time to update
            this.$nextTick(() => {
                if (!this.multiple ||
                    !this.internalSearch ||
                    !this.isMenuActive) {
                    this.internalSearch = (!this.selectedItems.length ||
                        this.multiple ||
                        this.hasSlot)
                        ? null
                        : this.getText(this.selectedItem);
                }
            });
        },
        updateSelf() {
            if (!this.searchIsDirty &&
                !this.internalValue)
                return;
            if (!this.multiple &&
                !this.valueComparator(this.internalSearch, this.getValue(this.internalValue))) {
                this.setSearch();
            }
        },
        hasItem(item) {
            return this.selectedValues.indexOf(this.getValue(item)) > -1;
        },
        onCopy(event) {
            var _a, _b;
            if (this.selectedIndex === -1)
                return;
            const currentItem = this.selectedItems[this.selectedIndex];
            const currentItemText = this.getText(currentItem);
            (_a = event.clipboardData) === null || _a === void 0 ? void 0 : _a.setData('text/plain', currentItemText);
            (_b = event.clipboardData) === null || _b === void 0 ? void 0 : _b.setData('text/vnd.vuetify.autocomplete.item+plain', currentItemText);
            event.preventDefault();
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkF1dG9jb21wbGV0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZBdXRvY29tcGxldGUvVkF1dG9jb21wbGV0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxzQkFBc0IsQ0FBQTtBQUU3QixhQUFhO0FBQ2IsT0FBTyxPQUFPLEVBQUUsRUFBRSxnQkFBZ0IsSUFBSSxnQkFBZ0IsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2xGLE9BQU8sVUFBVSxNQUFNLDBCQUEwQixDQUFBO0FBRWpELFlBQVk7QUFDWixPQUFPLEVBQUUsZUFBZSxFQUFFLFVBQVUsRUFBRSxNQUFNLEtBQUssQ0FBQTtBQUNqRCxPQUFPLEVBQ0wsb0JBQW9CLEVBQ3BCLG1CQUFtQixFQUNuQixRQUFRLEdBQ1QsTUFBTSxvQkFBb0IsQ0FBQTtBQU0zQixNQUFNLGdCQUFnQixHQUFHO0lBQ3ZCLEdBQUcsZ0JBQWdCO0lBQ25CLE9BQU8sRUFBRSxJQUFJO0lBQ2IsY0FBYyxFQUFFLElBQUk7SUFDcEIsVUFBVSxFQUFFLEtBQUs7Q0FDbEIsQ0FBQTtBQUVELG9CQUFvQjtBQUNwQixlQUFlLGVBQWUsQ0FBQztJQUM3QixJQUFJLEVBQUUsZ0JBQWdCO0lBQ3RCLE9BQU8sRUFBRSxPQUFPO0lBRWhCLEtBQUssRUFBRTtRQUNMLHFCQUFxQjtRQUNyQixtQkFBbUI7UUFDbkIsUUFBUTtRQUNSLE9BQU87UUFDUCxNQUFNO1FBQ04sU0FBUztRQUNULE9BQU87UUFDUCxtQkFBbUI7UUFDbkIsV0FBVztRQUNYLFNBQVM7UUFDVCxZQUFZO1FBQ1osVUFBVTtRQUNWLGVBQWU7UUFDZixjQUFjO1FBQ2Qsb0JBQW9CO1FBQ3BCLHFCQUFxQjtRQUNyQixhQUFhO1FBQ2IsT0FBTztRQUNQLGNBQWM7S0FDZjtJQUVELEtBQUssRUFBRTtRQUNMLGVBQWUsRUFBRTtZQUNmLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFF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InNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZBdXRvY29tcGxldGUuc2FzcydcblxuLy8gRXh0ZW5zaW9uc1xuaW1wb3J0IFZTZWxlY3QsIHsgZGVmYXVsdE1lbnVQcm9wcyBhcyBWU2VsZWN0TWVudVByb3BzIH0gZnJvbSAnLi4vVlNlbGVjdC9WU2VsZWN0J1xuaW1wb3J0IFZUZXh0RmllbGQgZnJvbSAnLi4vVlRleHRGaWVsZC9WVGV4dEZpZWxkJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCB7IGRlZmluZUNvbXBvbmVudCwgbWVyZ2VQcm9wcyB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7XG4gIGdldE9iamVjdFZhbHVlQnlQYXRoLFxuICBnZXRQcm9wZXJ0eUZyb21JdGVtLFxuICBrZXlDb2Rlcyxcbn0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgUHJvcFR5cGUsIFZOb2RlIH0gZnJvbSAndnVlJ1xuaW1wb3J0IHsgUHJvcFZhbGlkYXRvciB9IGZyb20gJ3Z1ZS90eXBlcy9vcHRpb25zJ1xuXG5jb25zdCBkZWZhdWx0TWVudVByb3BzID0ge1xuICAuLi5WU2VsZWN0TWVudVByb3BzLFxuICBvZmZzZXRZOiB0cnVlLFxuICBvZmZzZXRPdmVyZmxvdzogdHJ1ZSxcbiAgdHJhbnNpdGlvbjogZmFsc2UsXG59XG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb21wb25lbnQoe1xuICBuYW1lOiAndi1hdXRvY29tcGxldGUnLFxuICBleHRlbmRzOiBWU2VsZWN0LFxuXG4gIGVtaXRzOiBbXG4gICAgJ3VwZGF0ZTpzZWFyY2gtaW5wdXQnLFxuICAgICd1cGRhdGU6bW9kZWxWYWx1ZScsXG4gICAgJ2NoYW5nZScsXG4gICAgJ2ZvY3VzJyxcbiAgICAnYmx1cicsXG4gICAgJ2tleWRvd24nLFxuICAgICdjbGljaycsXG4gICAgJ3VwZGF0ZTpsaXN0LWluZGV4JyxcbiAgICAnbW91c2Vkb3duJyxcbiAgICAnbW91c2V1cCcsXG4gICAgJ3RvdWNoc3RhcnQnLFxuICAgICd0b3VjaGVuZCcsXG4gICAgJ2NsaWNrOnByZXBlbmQnLFxuICAgICdjbGljazphcHBlbmQnLFxuICAgICdjbGljazphcHBlbmQtb3V0ZXInLFxuICAgICdjbGljazpwcmVwZW5kLWlubmVyJyxcbiAgICAnY2xpY2s6Y2xlYXInLFxuICAgICdpbnB1dCcsXG4gICAgJ3VwZGF0ZTplcnJvcicsXG4gIF0sXG5cbiAgcHJvcHM6IHtcbiAgICBhdXRvU2VsZWN0Rmlyc3Q6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIGZpbHRlcjoge1xuICAgICAgdHlwZTogRnVuY3Rpb24sXG4gICAgICBkZWZhdWx0OiAoaXRlbTogYW55LCBxdWVyeVRleHQ6IHN0cmluZywgaXRlbVRleHQ6IHN0cmluZykgPT4ge1xuICAgICAgICByZXR1cm4gaXRlbVRleHQudG9Mb2NhbGVMb3dlckNhc2UoKS5pbmRleE9mKHF1ZXJ5VGV4dC50b0xvY2FsZUxvd2VyQ2FzZSgpKSA+IC0xXG4gICAgICB9LFxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjwoaXRlbTogYW55LCBxdWVyeVRleHQ6IHN0cmluZywgaXRlbVRleHQ6IHN0cmluZykgPT4gYm9vbGVhbj4sXG4gICAgaGlkZU5vRGF0YTogQm9vbGVhbixcbiAgICBtZW51UHJvcHM6IHtcbiAgICAgIHR5cGU6IFZTZWxlY3QucHJvcHMubWVudVByb3BzLnR5cGUsXG4gICAgICBkZWZhdWx0OiAoKSA9PiBkZWZhdWx0TWVudVByb3BzLFxuICAgIH0sXG4gICAgbm9GaWx0ZXI6IEJvb2xlYW4sXG4gICAgc2VhcmNoSW5wdXQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyBhcyBQcm9wVHlwZTxzdHJpbmcgfCBudWxsPixcbiAgICB9LFxuICB9LFxuXG4gIGRhdGEgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsYXp5U2VhcmNoOiB0aGlzLnNlYXJjaElucHV0LFxuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5WU2VsZWN0LmNvbXB1dGVkLmNsYXNzZXMuY2FsbCh0aGlzKSxcbiAgICAgICAgJ3YtYXV0b2NvbXBsZXRlJzogdHJ1ZSxcbiAgICAgICAgJ3YtYXV0b2NvbXBsZXRlLS1pcy1zZWxlY3RpbmctaW5kZXgnOiB0aGlzLnNlbGVjdGVkSW5kZXggPiAtMSxcbiAgICAgIH1cbiAgICB9LFxuICAgIGNvbXB1dGVkSXRlbXMgKCk6IG9iamVjdFtdIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbHRlcmVkSXRlbXNcbiAgICB9LFxuICAgIHNlbGVjdGVkVmFsdWVzICgpOiBvYmplY3RbXSB7XG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEl0ZW1zLm1hcChpdGVtID0+IHRoaXMuZ2V0VmFsdWUoaXRlbSkpXG4gICAgfSxcbiAgICBoYXNEaXNwbGF5ZWRJdGVtcyAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5oaWRlU2VsZWN0ZWRcbiAgICAgICAgPyB0aGlzLmZpbHRlcmVkSXRlbXMuc29tZShpdGVtID0+ICF0aGlzLmhhc0l0ZW0oaXRlbSkpXG4gICAgICAgIDogdGhpcy5maWx0ZXJlZEl0ZW1zLmxlbmd0aCA+IDBcbiAgICB9LFxuICAgIGN1cnJlbnRSYW5nZSAoKTogbnVtYmVyIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkSXRlbSA9PSBudWxsKSByZXR1cm4gMFxuXG4gICAgICByZXR1cm4gU3RyaW5nKHRoaXMuZ2V0VGV4dCh0aGlzLnNlbGVjdGVkSXRlbSkpLmxlbmd0aFxuICAgIH0sXG4gICAgZmlsdGVyZWRJdGVtcyAoKTogb2JqZWN0W10ge1xuICAgICAgaWYgKCF0aGlzLmlzU2VhcmNoaW5nIHx8IHRoaXMubm9GaWx0ZXIgfHwgdGhpcy5pbnRlcm5hbFNlYXJjaCA9PSBudWxsKSByZXR1cm4gdGhpcy5hbGxJdGVtc1xuXG4gICAgICByZXR1cm4gdGhpcy5hbGxJdGVtcy5maWx0ZXIoaXRlbSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gZ2V0UHJvcGVydHlGcm9tSXRlbShpdGVtLCB0aGlzLml0ZW1UZXh0KVxuICAgICAgICBjb25zdCB0ZXh0ID0gdmFsdWUgIT0gbnVsbCA/IFN0cmluZyh2YWx1ZSkgOiAnJ1xuXG4gICAgICAgIHJldHVybiB0aGlzLmZpbHRlcihpdGVtLCBTdHJpbmcodGhpcy5pbnRlcm5hbFNlYXJjaCksIHRleHQpXG4gICAgICB9KVxuICAgIH0sXG4gICAgaW50ZXJuYWxTZWFyY2g6IHtcbiAgICAgIGdldCAoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgICAgIHJldHVybiB0aGlzLmxhenlTZWFyY2hcbiAgICAgIH0sXG4gICAgICBzZXQgKHZhbDogYW55KSB7IC8vIFRPRE86IHRoaXMgc2hvdWxkIGJlIGBzdHJpbmcgfCBudWxsYCBidXQgaXQgYnJlYWtzIGxvdHMgb2Ygb3RoZXIgdHlwZXNcbiAgICAgICAgLy8gZW1pdCB1cGRhdGUgZXZlbnQgb25seSB3aGVuIHRoZSBuZXdcbiAgICAgICAgLy8gc2VhcmNoIHZhbHVlIGlzIGRpZmZlcmVudCBmcm9tIHByZXZpb3VzXG4gICAgICAgIGlmICh0aGlzLmxhenlTZWFyY2ggIT09IHZhbCkge1xuICAgICAgICAgIHRoaXMubGF6eVNlYXJjaCA9IHZhbFxuICAgICAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTpzZWFyY2gtaW5wdXQnLCB2YWwpXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSxcbiAgICBpc0FueVZhbHVlQWxsb3dlZCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9LFxuICAgIGlzRGlydHkgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoSXNEaXJ0eSB8fCB0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoID4gMFxuICAgIH0sXG4gICAgaXNTZWFyY2hpbmcgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgdGhpcy5tdWx0aXBsZSAmJlxuICAgICAgICB0aGlzLnNlYXJjaElzRGlydHlcbiAgICAgICkgfHwgKFxuICAgICAgICB0aGlzLnNlYXJjaElzRGlydHkgJiZcbiAgICAgICAgdGhpcy5pbnRlcm5hbFNlYXJjaCAhPT0gdGhpcy5nZXRUZXh0KHRoaXMuc2VsZWN0ZWRJdGVtKVxuICAgICAgKVxuICAgIH0sXG4gICAgbWVudUNhblNob3cgKCk6IGJvb2xlYW4ge1xuICAgICAgaWYgKCF0aGlzLmlzRm9jdXNlZCkgcmV0dXJuIGZhbHNlXG5cbiAgICAgIHJldHVybiB0aGlzLmhhc0Rpc3BsYXllZEl0ZW1zIHx8ICF0aGlzLmhpZGVOb0RhdGFcbiAgICB9LFxuICAgICRfbWVudVByb3BzICgpOiBvYmplY3Qge1xuICAgICAgY29uc3QgcHJvcHMgPSBWU2VsZWN0LmNvbXB1dGVkLiRfbWVudVByb3BzLmNhbGwodGhpcyk7XG4gICAgICAocHJvcHMgYXMgYW55KS5jb250ZW50Q2xhc3MgPSBgdi1hdXRvY29tcGxldGVfX2NvbnRlbnQgJHsocHJvcHMgYXMgYW55KS5jb250ZW50Q2xhc3MgfHwgJyd9YC50cmltKClcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmRlZmF1bHRNZW51UHJvcHMsXG4gICAgICAgIC4uLnByb3BzLFxuICAgICAgfVxuICAgIH0sXG4gICAgc2VhcmNoSXNEaXJ0eSAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbFNlYXJjaCAhPSBudWxsICYmXG4gICAgICAgIHRoaXMuaW50ZXJuYWxTZWFyY2ggIT09ICcnXG4gICAgfSxcbiAgICBzZWxlY3RlZEl0ZW0gKCk6IGFueSB7XG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSkgcmV0dXJuIG51bGxcblxuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRJdGVtcy5maW5kKGkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUNvbXBhcmF0b3IodGhpcy5nZXRWYWx1ZShpKSwgdGhpcy5nZXRWYWx1ZSh0aGlzLmludGVybmFsVmFsdWUpKVxuICAgICAgfSlcbiAgICB9LFxuICAgIGxpc3REYXRhICgpIHtcbiAgICAgIGNvbnN0IGRhdGEgPSBWU2VsZWN0LmNvbXB1dGVkLmxpc3REYXRhLmNhbGwodGhpcykgYXMgYW55XG5cbiAgICAgIGRhdGEucHJvcHMgPSB7XG4gICAgICAgIC4uLmRhdGEucHJvcHMsXG4gICAgICAgIGl0ZW1zOiB0aGlzLnZpcnR1YWxpemVkSXRlbXMsXG4gICAgICAgIG5vRmlsdGVyOiAoXG4gICAgICAgICAgdGhpcy5ub0ZpbHRlciB8fFxuICAgICAgICAgICF0aGlzLmlzU2VhcmNoaW5nIHx8XG4gICAgICAgICAgIXRoaXMuZmlsdGVyZWRJdGVtcy5sZW5ndGhcbiAgICAgICAgKSxcbiAgICAgICAgc2VhcmNoSW5wdXQ6IHRoaXMuaW50ZXJuYWxTZWFyY2gsXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkYXRhXG4gICAgfSxcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIGZpbHRlcmVkSXRlbXM6ICdvbkZpbHRlcmVkSXRlbXNDaGFuZ2VkJyxcbiAgICBpbnRlcm5hbFZhbHVlOiAnc2V0U2VhcmNoJyxcbiAgICBpc0ZvY3VzZWQgKHZhbCkge1xuICAgICAgaWYgKHZhbCkge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjb3B5JywgdGhpcy5vbkNvcHkpXG4gICAgICAgIHRoaXMuJHJlZnMuaW5wdXQgJiYgdGhpcy4kcmVmcy5pbnB1dC5zZWxlY3QoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29weScsIHRoaXMub25Db3B5KVxuICAgICAgICB0aGlzLmJsdXIoKVxuICAgICAgICB0aGlzLnVwZGF0ZVNlbGYoKVxuICAgICAgfVxuICAgIH0sXG4gICAgaXNNZW51QWN0aXZlICh2YWwpIHtcbiAgICAgIGlmICh2YWwgfHwgIXRoaXMuaGFzU2xvdCkgcmV0dXJuXG5cbiAgICAgIHRoaXMubGF6eVNlYXJjaCA9IG51bGxcbiAgICB9LFxuICAgIGl0ZW1zICh2YWwsIG9sZFZhbCkge1xuICAgICAgLy8gSWYgd2UgYXJlIGZvY3VzZWQsIHRoZSBtZW51XG4gICAgICAvLyBpcyBub3QgYWN0aXZlLCBoaWRlIG5vIGRhdGEgaXMgZW5hYmxlZCxcbiAgICAgIC8vIGFuZCBpdGVtcyBjaGFuZ2VcbiAgICAgIC8vIFVzZXIgaXMgcHJvYmFibHkgYXN5bmMgbG9hZGluZ1xuICAgICAgLy8gaXRlbXMsIHRyeSB0byBhY3RpdmF0ZSB0aGUgbWVudVxuICAgICAgaWYgKFxuICAgICAgICAhKG9sZFZhbCAmJiBvbGRWYWwubGVuZ3RoKSAmJlxuICAgICAgICB0aGlzLmhpZGVOb0RhdGEgJiZcbiAgICAgICAgdGhpcy5pc0ZvY3VzZWQgJiZcbiAgICAgICAgIXRoaXMuaXNNZW51QWN0aXZlICYmXG4gICAgICAgIHZhbC5sZW5ndGhcbiAgICAgICkgdGhpcy5hY3RpdmF0ZU1lbnUoKVxuICAgIH0sXG4gICAgc2VhcmNoSW5wdXQgKHZhbDogc3RyaW5nKSB7XG4gICAgICB0aGlzLmxhenlTZWFyY2ggPSB2YWxcbiAgICB9LFxuICAgIGludGVybmFsU2VhcmNoOiAnb25JbnRlcm5hbFNlYXJjaENoYW5nZWQnLFxuICAgIGl0ZW1UZXh0OiAndXBkYXRlU2VsZicsXG4gIH0sXG5cbiAgY3JlYXRlZCAoKSB7XG4gICAgdGhpcy5zZXRTZWFyY2goKVxuICB9LFxuXG4gIHVubW91bnRlZCAoKSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29weScsIHRoaXMub25Db3B5KVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBvbkZpbHRlcmVkSXRlbXNDaGFuZ2VkICh2YWw6IG5ldmVyW10sIG9sZFZhbDogbmV2ZXJbXSkge1xuICAgICAgLy8gVE9ETzogSG93IGlzIHRoZSB3YXRjaGVyIHRyaWdnZXJlZFxuICAgICAgLy8gZm9yIGR1cGxpY2F0ZSBpdGVtcz8gbm8gaWRlYVxuICAgICAgaWYgKHZhbCA9PT0gb2xkVmFsKSByZXR1cm5cblxuICAgICAgaWYgKCF0aGlzLmF1dG9TZWxlY3RGaXJzdCkge1xuICAgICAgICBjb25zdCBwcmVTZWxlY3RlZEl0ZW0gPSBvbGRWYWxbdGhpcy4kcmVmcy5tZW51Lmxpc3RJbmRleF1cblxuICAgICAgICBpZiAocHJlU2VsZWN0ZWRJdGVtKSB7XG4gICAgICAgICAgdGhpcy5zZXRNZW51SW5kZXgodmFsLmZpbmRJbmRleChpID0+IGkgPT09IHByZVNlbGVjdGVkSXRlbSkpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRNZW51SW5kZXgoLTEpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOmxpc3QtaW5kZXgnLCB0aGlzLiRyZWZzLm1lbnUubGlzdEluZGV4KVxuICAgICAgfVxuXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhdGhpcy5pbnRlcm5hbFNlYXJjaCB8fFxuICAgICAgICAgICh2YWwubGVuZ3RoICE9PSAxICYmXG4gICAgICAgICAgICAhdGhpcy5hdXRvU2VsZWN0Rmlyc3QpXG4gICAgICAgICkgcmV0dXJuXG5cbiAgICAgICAgdGhpcy4kcmVmcy5tZW51LmdldFRpbGVzKClcblxuICAgICAgICBpZiAodGhpcy5hdXRvU2VsZWN0Rmlyc3QgJiYgdmFsLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuc2V0TWVudUluZGV4KDApXG4gICAgICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOmxpc3QtaW5kZXgnLCB0aGlzLiRyZWZzLm1lbnUubGlzdEluZGV4KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sXG4gICAgb25JbnRlcm5hbFNlYXJjaENoYW5nZWQgKCkge1xuICAgICAgdGhpcy51cGRhdGVNZW51RGltZW5zaW9ucygpXG4gICAgfSxcbiAgICB1cGRhdGVNZW51RGltZW5zaW9ucyAoKSB7XG4gICAgICAvLyBUeXBlIGZyb20gbWVudWFibGUgaXMgbm90IG1ha2luZyBpdCB0aHJvdWdoXG4gICAgICB0aGlzLmlzTWVudUFjdGl2ZSAmJiB0aGlzLiRyZWZzLm1lbnUgJiYgdGhpcy4kcmVmcy5tZW51LnVwZGF0ZURpbWVuc2lvbnMoKVxuICAgIH0sXG4gICAgY2hhbmdlU2VsZWN0ZWRJbmRleCAoa2V5Q29kZTogbnVtYmVyKSB7XG4gICAgICAvLyBEbyBub3QgYWxsb3cgY2hhbmdpbmcgb2Ygc2VsZWN0ZWRJbmRleFxuICAgICAgLy8gd2hlbiBzZWFyY2ggaXMgZGlydHlcbiAgICAgIGlmICh0aGlzLnNlYXJjaElzRGlydHkpIHJldHVyblxuXG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSAmJiBrZXlDb2RlID09PSBrZXlDb2Rlcy5sZWZ0KSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aCAtIDFcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXgtLVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMubXVsdGlwbGUgJiYga2V5Q29kZSA9PT0ga2V5Q29kZXMucmlnaHQpIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJbmRleCA+PSB0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IC0xXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4KytcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChrZXlDb2RlID09PSBrZXlDb2Rlcy5iYWNrc3BhY2UgfHwga2V5Q29kZSA9PT0ga2V5Q29kZXMuZGVsZXRlKSB7XG4gICAgICAgIHRoaXMuZGVsZXRlQ3VycmVudEl0ZW0oKVxuICAgICAgfVxuICAgIH0sXG4gICAgZGVsZXRlQ3VycmVudEl0ZW0gKCkge1xuICAgICAgY29uc3QgY3VySW5kZXggPSB0aGlzLnNlbGVjdGVkSW5kZXhcbiAgICAgIGNvbnN0IGN1ckl0ZW0gPSB0aGlzLnNlbGVjdGVkSXRlbXNbY3VySW5kZXhdXG5cbiAgICAgIC8vIERvIG5vdGhpbmcgaWYgaW5wdXQgb3IgaXRlbSBpcyBkaXNhYmxlZFxuICAgICAgaWYgKFxuICAgICAgICAhdGhpcy5pc0ludGVyYWN0aXZlIHx8XG4gICAgICAgIHRoaXMuZ2V0RGlzYWJsZWQoY3VySXRlbSlcbiAgICAgICkgcmV0dXJuXG5cbiAgICAgIGNvbnN0IGxhc3RJbmRleCA9IHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGggLSAxXG5cbiAgICAgIC8vIFNlbGVjdCB0aGUgbGFzdCBpdGVtIGlmXG4gICAgICAvLyB0aGVyZSBpcyBubyBzZWxlY3Rpb25cbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID09PSAtMSAmJlxuICAgICAgICBsYXN0SW5kZXggIT09IDBcbiAgICAgICkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBsYXN0SW5kZXhcblxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aFxuICAgICAgY29uc3QgbmV4dEluZGV4ID0gY3VySW5kZXggIT09IGxlbmd0aCAtIDFcbiAgICAgICAgPyBjdXJJbmRleFxuICAgICAgICA6IGN1ckluZGV4IC0gMVxuICAgICAgY29uc3QgbmV4dEl0ZW0gPSB0aGlzLnNlbGVjdGVkSXRlbXNbbmV4dEluZGV4XVxuXG4gICAgICBpZiAoIW5leHRJdGVtKSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5tdWx0aXBsZSA/IFtdIDogbnVsbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2VsZWN0SXRlbShjdXJJdGVtKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBuZXh0SW5kZXhcbiAgICB9LFxuICAgIGNsZWFyYWJsZUNhbGxiYWNrICgpIHtcbiAgICAgIHRoaXMuaW50ZXJuYWxTZWFyY2ggPSBudWxsXG5cbiAgICAgIFZTZWxlY3QubWV0aG9kcy5jbGVhcmFibGVDYWxsYmFjay5jYWxsKHRoaXMpXG4gICAgfSxcbiAgICBnZW5JbnB1dCAoKSB7XG4gICAgICBjb25zdCBpbnB1dCA9IFZUZXh0RmllbGQubWV0aG9kcy5nZW5JbnB1dC5jYWxsKHRoaXMpXG5cbiAgICAgIGNvbnN0IGFyaWFBY3RpdmVEZXNjZW5kYW50ID0gZ2V0T2JqZWN0VmFsdWVCeVBhdGgodGhpcy4kcmVmcy5tZW51LCAnYWN0aXZlVGlsZS5pZCcpXG4gICAgICBjb25zdCBhdXRvY29tcGxldGUgPSBnZXRPYmplY3RWYWx1ZUJ5UGF0aChpbnB1dC5wcm9wcywgJ2F1dG9jb21wbGV0ZScsICdvZmYnKVxuXG4gICAgICAvLyDQsiDQvtGA0LjQs9C40L3QsNC70LUgY2xhc3Mg0L3QtSDQv9GA0L7QsdGA0LDRgdGL0LLQsNC70YHRjyDQsiDQuNC90L/Rg9GCXG4gICAgICBpbnB1dC5wcm9wcyA9IG1lcmdlUHJvcHMoe1xuICAgICAgICAuLi5pbnB1dC5wcm9wcyxcbiAgICAgICAgY2xhc3M6IHVuZGVmaW5lZFxuICAgICAgfSwge1xuICAgICAgICAnYXJpYS1hY3RpdmVkZXNjZW5kYW50JzogYXJpYUFjdGl2ZURlc2NlbmRhbnQsXG4gICAgICAgIGF1dG9jb21wbGV0ZSxcbiAgICAgICAgdmFsdWU6IHRoaXMuaW50ZXJuYWxTZWFyY2gsXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gaW5wdXRcbiAgICB9LFxuICAgIGdlbklucHV0U2xvdCAoKSB7XG4gICAgICBjb25zdCBzbG90ID0gVlNlbGVjdC5tZXRob2RzLmdlbklucHV0U2xvdC5jYWxsKHRoaXMpXG5cbiAgICAgIHNsb3QucHJvcHMucm9sZSA9ICdjb21ib2JveCdcblxuICAgICAgcmV0dXJuIHNsb3RcbiAgICB9LFxuICAgIGdlblNlbGVjdGlvbnMgKCk6IFZOb2RlIHwgbmV2ZXJbXSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXNTbG90IHx8IHRoaXMubXVsdGlwbGVcbiAgICAgICAgPyBWU2VsZWN0Lm1ldGhvZHMuZ2VuU2VsZWN0aW9ucy5jYWxsKHRoaXMpXG4gICAgICAgIDogW11cbiAgICB9LFxuICAgIG9uQ2xpY2sgKGU6IE1vdXNlRXZlbnQpIHtcbiAgICAgIGlmICghdGhpcy5pc0ludGVyYWN0aXZlKSByZXR1cm5cblxuICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID4gLTFcbiAgICAgICAgPyAodGhpcy5zZWxlY3RlZEluZGV4ID0gLTEpXG4gICAgICAgIDogdGhpcy5vbkZvY3VzKClcblxuICAgICAgaWYgKCF0aGlzLmlzQXBwZW5kSW5uZXIoZS50YXJnZXQpKSB0aGlzLmFjdGl2YXRlTWVudSgpXG4gICAgfSxcbiAgICBvbklucHV0IChlOiBFdmVudCkge1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPiAtMSB8fFxuICAgICAgICAhZS50YXJnZXRcbiAgICAgICkgcmV0dXJuXG5cbiAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnRcbiAgICAgIGNvbnN0IHZhbHVlID0gdGFyZ2V0LnZhbHVlXG5cbiAgICAgIC8vIElmIHR5cGluZyBhbmQgbWVudSBpcyBub3QgY3VycmVudGx5IGFjdGl2ZVxuICAgICAgaWYgKHRhcmdldC52YWx1ZSkgdGhpcy5hY3RpdmF0ZU1lbnUoKVxuXG4gICAgICBpZiAoIXRoaXMubXVsdGlwbGUgJiYgdmFsdWUgPT09ICcnKSB0aGlzLmRlbGV0ZUN1cnJlbnRJdGVtKClcblxuICAgICAgdGhpcy5pbnRlcm5hbFNlYXJjaCA9IHZhbHVlXG4gICAgICB0aGlzLmJhZElucHV0ID0gdGFyZ2V0LnZhbGlkaXR5ICYmIHRhcmdldC52YWxpZGl0eS5iYWRJbnB1dFxuICAgIH0sXG4gICAgb25LZXlEb3duIChlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICBjb25zdCBrZXlDb2RlID0gZS5rZXlDb2RlXG5cbiAgICAgIGlmIChcbiAgICAgICAgZS5jdHJsS2V5IHx8XG4gICAgICAgICFba2V5Q29kZXMuaG9tZSwga2V5Q29kZXMuZW5kXS5pbmNsdWRlcyhrZXlDb2RlKVxuICAgICAgKSB7XG4gICAgICAgIFZTZWxlY3QubWV0aG9kcy5vbktleURvd24uY2FsbCh0aGlzLCBlKVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgb3JkZXJpbmcgaXMgaW1wb3J0YW50IGhlcmVcbiAgICAgIC8vIGFsbG93cyBuZXcgdmFsdWUgdG8gYmUgdXBkYXRlZFxuICAgICAgLy8gYW5kIHRoZW4gbW92ZXMgdGhlIGluZGV4IHRvIHRoZVxuICAgICAgLy8gcHJvcGVyIGxvY2F0aW9uXG4gICAgICB0aGlzLmNoYW5nZVNlbGVjdGVkSW5kZXgoa2V5Q29kZSlcbiAgICB9LFxuICAgIG9uU3BhY2VEb3duIChlOiBLZXlib2FyZEV2ZW50KSB7IC8qIG5vb3AgKi8gfSxcbiAgICBvblRhYkRvd24gKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgIFZTZWxlY3QubWV0aG9kcy5vblRhYkRvd24uY2FsbCh0aGlzLCBlKVxuICAgICAgdGhpcy51cGRhdGVTZWxmKClcbiAgICB9LFxuICAgIG9uVXBEb3duIChlOiBFdmVudCkge1xuICAgICAgLy8gUHJldmVudCBzY3JlZW4gZnJvbSBzY3JvbGxpbmdcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgICAvLyBGb3IgYXV0b2NvbXBsZXRlIC8gY29tYm9ib3gsIGN5Y2xpbmdcbiAgICAgIC8vIGludGVyZmVycyB3aXRoIG5hdGl2ZSB1cC9kb3duIGJlaGF2aW9yXG4gICAgICAvLyBpbnN0ZWFkIGFjdGl2YXRlIHRoZSBtZW51XG4gICAgICB0aGlzLmFjdGl2YXRlTWVudSgpXG4gICAgfSxcbiAgICBzZWxlY3RJdGVtIChpdGVtOiBvYmplY3QpIHtcbiAgICAgIFZTZWxlY3QubWV0aG9kcy5zZWxlY3RJdGVtLmNhbGwodGhpcywgaXRlbSlcbiAgICAgIHRoaXMuc2V0U2VhcmNoKClcbiAgICB9LFxuICAgIHNldFNlbGVjdGVkSXRlbXMgKCkge1xuICAgICAgVlNlbGVjdC5tZXRob2RzLnNldFNlbGVjdGVkSXRlbXMuY2FsbCh0aGlzKVxuXG4gICAgICAvLyAjNDI3MyBEb24ndCByZXBsYWNlIGlmIHNlYXJjaGluZ1xuICAgICAgLy8gIzQ0MDMgRG9uJ3QgcmVwbGFjZSBpZiBmb2N1c2VkXG4gICAgICBpZiAoIXRoaXMuaXNGb2N1c2VkKSB0aGlzLnNldFNlYXJjaCgpXG4gICAgfSxcbiAgICBzZXRTZWFyY2ggKCkge1xuICAgICAgLy8gV2FpdCBmb3IgbmV4dFRpY2sgc28gc2VsZWN0ZWRJdGVtXG4gICAgICAvLyBoYXMgaGFkIHRpbWUgdG8gdXBkYXRlXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhdGhpcy5tdWx0aXBsZSB8fFxuICAgICAgICAgICF0aGlzLmludGVybmFsU2VhcmNoIHx8XG4gICAgICAgICAgIXRoaXMuaXNNZW51QWN0aXZlXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMuaW50ZXJuYWxTZWFyY2ggPSAoXG4gICAgICAgICAgICAhdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aCB8fFxuICAgICAgICAgICAgdGhpcy5tdWx0aXBsZSB8fFxuICAgICAgICAgICAgdGhpcy5oYXNTbG90XG4gICAgICAgICAgKVxuICAgICAgICAgICAgPyBudWxsXG4gICAgICAgICAgICA6IHRoaXMuZ2V0VGV4dCh0aGlzLnNlbGVjdGVkSXRlbSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LFxuICAgIHVwZGF0ZVNlbGYgKCkge1xuICAgICAgaWYgKFxuICAgICAgICAhdGhpcy5zZWFyY2hJc0RpcnR5ICYmXG4gICAgICAgICF0aGlzLmludGVybmFsVmFsdWVcbiAgICAgICkgcmV0dXJuXG5cbiAgICAgIGlmIChcbiAgICAgICAgIXRoaXMubXVsdGlwbGUgJiZcbiAgICAgICAgIXRoaXMudmFsdWVDb21wYXJhdG9yKFxuICAgICAgICAgIHRoaXMuaW50ZXJuYWxTZWFyY2gsXG4gICAgICAgICAgdGhpcy5nZXRWYWx1ZSh0aGlzLmludGVybmFsVmFsdWUpXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICB0aGlzLnNldFNlYXJjaCgpXG4gICAgICB9XG4gICAgfSxcbiAgICBoYXNJdGVtIChpdGVtOiBhbnkpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkVmFsdWVzLmluZGV4T2YodGhpcy5nZXRWYWx1ZShpdGVtKSkgPiAtMVxuICAgIH0sXG4gICAgb25Db3B5IChldmVudDogQ2xpcGJvYXJkRXZlbnQpIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkSW5kZXggPT09IC0xKSByZXR1cm5cblxuICAgICAgY29uc3QgY3VycmVudEl0ZW0gPSB0aGlzLnNlbGVjdGVkSXRlbXNbdGhpcy5zZWxlY3RlZEluZGV4XVxuICAgICAgY29uc3QgY3VycmVudEl0ZW1UZXh0ID0gdGhpcy5nZXRUZXh0KGN1cnJlbnRJdGVtKVxuICAgICAgZXZlbnQuY2xpcGJvYXJkRGF0YT8uc2V0RGF0YSgndGV4dC9wbGFpbicsIGN1cnJlbnRJdGVtVGV4dClcbiAgICAgIGV2ZW50LmNsaXBib2FyZERhdGE/LnNldERhdGEoJ3RleHQvdm5kLnZ1ZXRpZnkuYXV0b2NvbXBsZXRlLml0ZW0rcGxhaW4nLCBjdXJyZW50SXRlbVRleHQpXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfSxcbiAgfSxcbn0pXG4iXX0=