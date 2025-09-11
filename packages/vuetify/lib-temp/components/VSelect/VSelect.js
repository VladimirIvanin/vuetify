// Styles
import '../VTextField/VTextField.sass';
import './VSelect.sass';
// Components
import VChip from '../VChip';
import VMenu from '../VMenu';
import VSelectList from './VSelectList';
// Extensions
import VInput from '../VInput';
import VTextField from '../VTextField/VTextField';
// Mixins
import Comparable from '../../mixins/comparable';
import Dependent from '../../mixins/dependent';
import Filterable from '../../mixins/filterable';
// Directives
import ClickOutside from '../../directives/click-outside';
// Utilities
import mergeData from '../../util/mergeData';
import { getPropertyFromItem, getObjectValueByPath, keyCodes, normalizeAttrs } from '../../util/helpers';
import { consoleError, breaking } from '../../util/console';
// Types
import mixins from '../../util/mixins';
import { withDirectives, h } from 'vue';
export const defaultMenuProps = {
    closeOnClick: false,
    closeOnContentClick: false,
    disableKeys: true,
    openOnClick: false,
    maxHeight: 304,
};
// Types
const baseMixins = mixins(VTextField, Comparable, Dependent, Filterable);
/* @vue/component */
export default baseMixins.extend({
    name: 'v-select',
    props: {
        appendIcon: {
            type: String,
            default: '$dropdown',
        },
        attach: {
            type: null,
            default: false,
        },
        auto: Boolean,
        cacheItems: Boolean,
        chips: Boolean,
        clearable: Boolean,
        deletableChips: Boolean,
        disableLookup: Boolean,
        eager: Boolean,
        hideSelected: Boolean,
        items: {
            type: Array,
            default: () => [],
        },
        itemColor: {
            type: String,
            default: 'primary',
        },
        itemDisabled: {
            type: [String, Array, Function],
            default: 'disabled',
        },
        itemText: {
            type: [String, Array, Function],
            default: 'text',
        },
        itemValue: {
            type: [String, Array, Function],
            default: 'value',
        },
        menuProps: {
            type: [String, Array, Object],
            default: () => defaultMenuProps,
        },
        minWidth: [String, Number],
        multiple: Boolean,
        openOnClear: Boolean,
        returnObject: Boolean,
        smallChips: Boolean,
    },
    emits: ['update:modelValue', 'change', 'focus', 'blur', 'keydown', 'click', 'update:list-index'],
    data() {
        return {
            cachedItems: this.cacheItems ? this.items : [],
            menuIsBooted: false,
            isMenuActive: false,
            lastItem: 20,
            // As long as a value is defined, show it
            // Otherwise, check if multiple
            // to determine which default to provide
            lazyValue: this.modelValue !== undefined
                ? this.modelValue
                : this.multiple ? [] : undefined,
            selectedIndex: -1,
            selectedItems: [],
            keyboardLookupPrefix: '',
            keyboardLookupLastTime: 0,
            detectedScopeId: null,
        };
    },
    computed: {
        /* All items that the select has */
        allItems() {
            return this.filterDuplicates(this.cachedItems.concat(this.items));
        },
        classes() {
            return {
                ...VTextField.computed.classes.call(this),
                'v-select': true,
                'v-select--chips': this.hasChips,
                'v-select--chips--small': this.smallChips,
                'v-select--is-menu-active': this.isMenuActive,
                'v-select--is-multi': this.multiple,
            };
        },
        /* Used by other components to overwrite */
        computedItems() {
            return this.allItems;
        },
        computedOwns() {
            var _a;
            return `list-${(_a = this.$) === null || _a === void 0 ? void 0 : _a.uid}`;
        },
        computedCounterValue() {
            var _a;
            const value = this.multiple
                ? this.selectedItems
                : ((_a = this.getText(this.selectedItems[0])) !== null && _a !== void 0 ? _a : '').toString();
            if (typeof this.counterValue === 'function') {
                return this.counterValue(value);
            }
            return value.length;
        },
        directives() {
            return [
                [
                    ClickOutside,
                    {
                        handler: () => this.isFocused && this.blur(),
                        closeConditional: this.closeConditional,
                        include: () => this.getOpenDependentElements(),
                    },
                ],
            ];
        },
        dynamicHeight() {
            return 'auto';
        },
        hasChips() {
            return this.chips || this.smallChips;
        },
        hasSlot() {
            return Boolean(this.hasChips || this.$slots.selection);
        },
        isDirty() {
            return this.selectedItems.length > 0;
        },
        listData() {
            return {
                id: this.computedOwns,
                action: this.multiple,
                color: this.itemColor,
                dense: this.dense,
                hideSelected: this.hideSelected,
                items: this.virtualizedItems,
                itemDisabled: this.itemDisabled,
                itemText: this.itemText,
                itemValue: this.itemValue,
                noDataText: this.$vuetify.lang.t(this.noDataText),
                selectedItems: this.selectedItems,
                onSelect: this.selectItem,
            };
        },
        listAttrs() {
            const scopeIdAttrs = {};
            // Используем detectedScopeId из mounted hook
            if (this.detectedScopeId) {
                scopeIdAttrs[this.detectedScopeId] = '';
            }
            // scopeId успешно передается в VSelectList
            return scopeIdAttrs;
        },
        staticList() {
            if (this.$slots['no-data'] || this.$slots['prepend-item'] || this.$slots['append-item']) {
                consoleError('assert: staticList should not be called if slots are used');
            }
            return h(VSelectList, {
                ...this.listData,
                ...this.listAttrs,
            }, {
                item: this.$slots.item,
            });
        },
        virtualizedItems() {
            return this.$_menuProps.auto
                ? this.computedItems
                : this.computedItems.slice(0, this.lastItem);
        },
        menuCanShow: () => true,
        $_menuProps() {
            let normalisedProps = typeof this.menuProps === 'string'
                ? this.menuProps.split(',')
                : this.menuProps;
            if (Array.isArray(normalisedProps)) {
                normalisedProps = normalisedProps.reduce((acc, p) => {
                    acc[p.trim()] = true;
                    return acc;
                }, {});
            }
            return {
                ...defaultMenuProps,
                eager: this.eager,
                modelValue: this.menuCanShow && this.isMenuActive,
                nudgeBottom: normalisedProps.offsetY ? 1 : 0,
                auto: this.auto,
                minWidth: this.minWidth,
                ...normalisedProps,
            };
        },
    },
    watch: {
        internalValue: {
            handler(val) {
                this.initialValue = val;
                this.setSelectedItems();
                if (this.multiple) {
                    this.$nextTick(() => {
                        var _a;
                        (_a = this.$refs.menu) === null || _a === void 0 ? void 0 : _a.updateDimensions();
                    });
                }
                if (this.hideSelected) {
                    this.$nextTick(() => {
                        this.onScroll();
                    });
                }
            },
            deep: true,
        },
        isMenuActive(val) {
            window.setTimeout(() => this.onMenuActiveChange(val));
        },
        items: {
            immediate: true,
            handler(val) {
                if (this.cacheItems) {
                    // Breaks vue-test-utils if
                    // this isn't calculated
                    // on the next tick
                    this.$nextTick(() => {
                        this.cachedItems = this.filterDuplicates(this.cachedItems.concat(val));
                    });
                }
                this.setSelectedItems();
            },
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
    mounted() {
        this.$nextTick(() => {
            if (this.$el && this.$el.attributes) {
                const attrs = this.$el.attributes;
                for (let i = 0; i < attrs.length; i++) {
                    const attr = attrs[i];
                    if (attr.name.startsWith('data-v-')) {
                        this.detectedScopeId = attr.name;
                        // scopeId найден и сохранен для использования в dropdown
                        break;
                    }
                }
            }
        });
    },
    methods: {
        /** @public */
        blur(e) {
            VTextField.methods.blur.call(this, e);
            this.isMenuActive = false;
            this.isFocused = false;
            this.selectedIndex = -1;
            this.setMenuIndex(-1);
        },
        /** @public */
        activateMenu() {
            if (!this.isInteractive ||
                this.isMenuActive)
                return;
            this.isMenuActive = true;
        },
        clearableCallback() {
            this.setValue(this.multiple ? [] : null);
            this.setMenuIndex(-1);
            this.$nextTick(() => this.$refs.input && this.$refs.input.focus());
            if (this.openOnClear)
                this.isMenuActive = true;
        },
        closeConditional(e) {
            if (!this.isMenuActive)
                return true;
            return (!this._isDestroyed &&
                // Click originates from outside the menu content
                // Multiple selects don't close when an item is clicked
                (!this.getContent() ||
                    !this.getContent().contains(e.target)) &&
                // Click originates from outside the element
                this.$el &&
                !this.$el.contains(e.target) &&
                e.target !== this.$el);
        },
        filterDuplicates(arr) {
            const uniqueValues = new Map();
            for (let index = 0; index < arr.length; ++index) {
                const item = arr[index];
                // Do not return null values if existant (#14421)
                if (item == null) {
                    continue;
                }
                // Do not deduplicate headers or dividers (#12517)
                if (item.header || item.divider) {
                    uniqueValues.set(item, item);
                    continue;
                }
                const val = this.getValue(item);
                // TODO: comparator
                !uniqueValues.has(val) && uniqueValues.set(val, item);
            }
            return Array.from(uniqueValues.values());
        },
        findExistingIndex(item) {
            const itemValue = this.getValue(item);
            return (this.internalValue || []).findIndex((i) => this.valueComparator(this.getValue(i), itemValue));
        },
        getContent() {
            return this.$refs.menu && this.$refs.menu.$refs.content;
        },
        genChipSelection(item, index) {
            const isDisabled = (this.isDisabled ||
                this.getDisabled(item));
            const isInteractive = !isDisabled && this.isInteractive;
            return h(VChip, {
                class: 'v-chip--select',
                tabindex: -1,
                close: this.deletableChips && isInteractive,
                disabled: isDisabled,
                modelValue: index === this.selectedIndex,
                small: this.smallChips,
                onClick: (e) => {
                    if (!isInteractive)
                        return;
                    e.stopPropagation();
                    this.selectedIndex = index;
                },
                'onClick:close': () => this.onChipInput(item),
                key: JSON.stringify(this.getValue(item)),
            }, () => this.getText(item));
        },
        genCommaSelection(item, index, last) {
            const color = index === this.selectedIndex && this.computedColor;
            const isDisabled = (this.isDisabled ||
                this.getDisabled(item));
            return h('div', this.setTextColor(color, {
                class: ['v-select__selection v-select__selection--comma', {
                        'v-select__selection--disabled': isDisabled,
                    }],
                key: JSON.stringify(this.getValue(item)),
            }), `${this.getText(item)}${last ? '' : ', '}`);
        },
        genDefaultSlot() {
            const selections = this.genSelections();
            const input = this.genInput();
            // If the return is an empty array
            // push the input
            if (Array.isArray(selections)) {
                selections.push(input);
                // Otherwise push it into children
            }
            else {
                selections.children = selections.children || [];
                selections.children.push(input);
            }
            return [
                this.genFieldset(),
                withDirectives(h('div', {
                    class: 'v-select__slot',
                }, [
                    this.genLabel(),
                    this.prefix ? this.genAffix('prefix') : null,
                    selections,
                    this.suffix ? this.genAffix('suffix') : null,
                    this.genClearIcon(),
                    this.genIconSlot(),
                    this.genHiddenInput(),
                ]), this.directives),
                this.genMenu(),
                this.genProgress(),
            ];
        },
        genIcon(type, cb, extraData) {
            const icon = VInput.methods.genIcon.call(this, type, cb, extraData);
            if (type === 'append') {
                // Don't allow the dropdown icon to be focused
                const iconChild = icon.children[0];
                const hasListeners = Object.keys(iconChild.props || {}).some(key => key.startsWith('on'));
                iconChild.props = mergeData(iconChild.props || {}, {
                    tabindex: hasListeners ? '-1' : undefined,
                    'aria-hidden': 'true',
                    'aria-label': undefined,
                });
            }
            return icon;
        },
        genInput() {
            const input = VTextField.methods.genInput.call(this);
            delete input.props.name;
            input.props = mergeData(input.props, {
                readonly: true,
                type: 'text',
                'aria-readonly': String(this.isReadonly),
                'aria-activedescendant': getObjectValueByPath(this.$refs.menu, 'activeTile.id'),
                autocomplete: getObjectValueByPath(input.data, 'attrs.autocomplete', 'off'),
                placeholder: (!this.isDirty && (this.persistentPlaceholder || this.isFocused || !this.hasLabel)) ? this.placeholder : undefined,
                onKeypress: this.onKeyPress,
            });
            input.props = { ...input.props, value: null };
            input.props = normalizeAttrs(input.props);
            return input;
        },
        genHiddenInput() {
            let value = this.lazyValue;
            if (this.multiple && Array.isArray(value)) {
                value = value.map(item => {
                    if (typeof item === 'object' && item !== null) {
                        return this.getValue(item);
                    }
                    return item;
                }).join(',');
            }
            else if (typeof value === 'object' && value !== null) {
                value = this.getValue(value);
            }
            return h('input', {
                value,
                type: 'hidden',
                name: this.$attrs.name,
            });
        },
        genInputSlot() {
            const render = VTextField.methods.genInputSlot.call(this);
            render.props = {
                role: 'button',
                'aria-haspopup': 'listbox',
                'aria-expanded': String(this.isMenuActive),
                'aria-owns': this.computedOwns,
                ...render.props,
            };
            return render;
        },
        genList() {
            // If there's no slots, we can use a cached VNode to improve performance
            if (this.$slots['no-data'] || this.$slots['prepend-item'] || this.$slots['append-item']) {
                return this.genListWithSlot();
            }
            else {
                return this.staticList;
            }
        },
        genListWithSlot() {
            const slots = Object.fromEntries(['prepend-item', 'no-data', 'append-item']
                .filter(slotName => this.$slots[slotName])
                .map(slotName => [
                slotName,
                this.$slots[slotName],
            ]));
            // Requires destructuring due to Vue
            // modifying the `on` property when passed
            // as a referenced object
            return h(VSelectList, {
                ...this.listData,
                ...this.listAttrs,
            }, { ...slots, item: this.$slots.item });
        },
        genMenu() {
            const props = this.$_menuProps;
            props.activator = this.$refs['input-slot'];
            if ('attach' in props)
                void 0;
            else if (
            // TODO: make this a computed property or helper or something
            this.attach === '' || // If used as a boolean prop (<v-menu attach>)
                this.attach === true || // If bound to a boolean (<v-menu :attach="true">)
                this.attach === 'attach' // If bound as boolean prop in pug (v-menu(attach))
            ) {
                // Attach to root el so that
                // menu covers prepend/append icons
                props.attach = this.$el;
            }
            else {
                props.attach = this.attach;
            }
            return h(VMenu, {
                role: undefined,
                ...props,
                'onUpdate:modelValue': (val) => {
                    this.isMenuActive = val;
                    this.isFocused = val;
                },
                onScroll: this.onScroll,
                ref: 'menu',
            }, () => [this.genList()]);
        },
        genSelections() {
            let length = this.selectedItems.length;
            const children = new Array(length);
            let genSelection;
            if (this.$slots.selection) {
                genSelection = this.genSlotSelection;
            }
            else if (this.hasChips) {
                genSelection = this.genChipSelection;
            }
            else {
                genSelection = this.genCommaSelection;
            }
            while (length--) {
                children[length] = genSelection(this.selectedItems[length], length, length === children.length - 1);
            }
            return h('div', {
                class: 'v-select__selections',
            }, children);
        },
        genSlotSelection(item, index) {
            return this.$slots.selection({
                class: 'v-chip--select',
                parent: this,
                item,
                index,
                select: (e) => {
                    e.stopPropagation();
                    this.selectedIndex = index;
                },
                selected: index === this.selectedIndex,
                disabled: !this.isInteractive,
            });
        },
        getMenuIndex() {
            return this.$refs.menu ? this.$refs.menu.listIndex : -1;
        },
        getDisabled(item) {
            return getPropertyFromItem(item, this.itemDisabled, false);
        },
        getText(item) {
            return getPropertyFromItem(item, this.itemText, item);
        },
        getValue(item) {
            return getPropertyFromItem(item, this.itemValue, this.getText(item));
        },
        onBlur(e) {
            e && this.$emit('blur', e);
        },
        onChipInput(item) {
            if (this.multiple)
                this.selectItem(item);
            else
                this.setValue(null);
            // If all items have been deleted,
            // open `v-menu`
            if (this.selectedItems.length === 0) {
                this.isMenuActive = true;
            }
            else {
                this.isMenuActive = false;
            }
            this.selectedIndex = -1;
        },
        onClick(e) {
            if (!this.isInteractive)
                return;
            if (!this.isAppendInner(e.target)) {
                this.isMenuActive = true;
            }
            if (!this.isFocused) {
                this.isFocused = true;
                this.$emit('focus');
            }
            this.$emit('click', e);
        },
        onEscDown(e) {
            e.preventDefault();
            if (this.isMenuActive) {
                e.stopPropagation();
                this.isMenuActive = false;
            }
        },
        onKeyPress(e) {
            if (this.multiple ||
                !this.isInteractive ||
                this.disableLookup ||
                e.key.length > 1 ||
                e.ctrlKey || e.metaKey || e.altKey)
                return;
            const KEYBOARD_LOOKUP_THRESHOLD = 1000; // milliseconds
            const now = performance.now();
            if (now - this.keyboardLookupLastTime > KEYBOARD_LOOKUP_THRESHOLD) {
                this.keyboardLookupPrefix = '';
            }
            this.keyboardLookupPrefix += e.key.toLowerCase();
            this.keyboardLookupLastTime = now;
            const index = this.allItems.findIndex(item => {
                var _a;
                const text = ((_a = this.getText(item)) !== null && _a !== void 0 ? _a : '').toString();
                return text.toLowerCase().startsWith(this.keyboardLookupPrefix);
            });
            const item = this.allItems[index];
            if (index !== -1) {
                this.lastItem = Math.max(this.lastItem, index + 5);
                this.setValue(this.returnObject ? item : this.getValue(item));
                this.$nextTick(() => this.$refs.menu.getTiles());
                setTimeout(() => this.setMenuIndex(index));
            }
        },
        onKeyDown(e) {
            if (this.isReadonly && e.keyCode !== keyCodes.tab)
                return;
            const keyCode = e.keyCode;
            const menu = this.$refs.menu;
            this.$emit('keydown', e);
            if (!menu)
                return;
            // If menu is active, allow default
            // listIndex change from menu
            if (this.isMenuActive && [keyCodes.up, keyCodes.down, keyCodes.home, keyCodes.end, keyCodes.enter].includes(keyCode)) {
                this.$nextTick(() => {
                    menu.changeListIndex(e);
                    this.$emit('update:list-index', menu.listIndex);
                });
            }
            // If enter, space, open menu
            if ([
                keyCodes.enter,
                keyCodes.space,
            ].includes(keyCode))
                this.activateMenu();
            // If menu is not active, up/down/home/end can do
            // one of 2 things. If multiple, opens the
            // menu, if not, will cycle through all
            // available options
            if (!this.isMenuActive &&
                [keyCodes.up, keyCodes.down, keyCodes.home, keyCodes.end].includes(keyCode))
                return this.onUpDown(e);
            // If escape deactivate the menu
            if (keyCode === keyCodes.esc)
                return this.onEscDown(e);
            // If tab - select item or close menu
            if (keyCode === keyCodes.tab)
                return this.onTabDown(e);
            // If space preventDefault
            if (keyCode === keyCodes.space)
                return this.onSpaceDown(e);
        },
        onMenuActiveChange(val) {
            // If menu is closing and mulitple
            // or menuIndex is already set
            // skip menu index recalculation
            if ((this.multiple && !val) ||
                this.getMenuIndex() > -1)
                return;
            const menu = this.$refs.menu;
            if (!menu || !this.isDirty)
                return;
            // When menu opens, set index of first active item
            this.$refs.menu.getTiles();
            for (let i = 0; i < menu.tiles.length; i++) {
                if (menu.tiles[i].getAttribute('aria-selected') === 'true') {
                    this.setMenuIndex(i);
                    break;
                }
            }
        },
        onMouseUp(e) {
            // eslint-disable-next-line sonarjs/no-collapsible-if
            if (this.hasMouseDown &&
                e.which !== 3 &&
                this.isInteractive) {
                // If append inner is present
                // and the target is itself
                // or inside, toggle menu
                if (this.isAppendInner(e.target)) {
                    this.$nextTick(() => (this.isMenuActive = !this.isMenuActive));
                }
            }
            VTextField.methods.onMouseUp.call(this, e);
        },
        onScroll() {
            if (!this.isMenuActive) {
                requestAnimationFrame(() => {
                    const content = this.getContent();
                    if (content)
                        content.scrollTop = 0;
                });
            }
            else {
                if (this.lastItem > this.computedItems.length)
                    return;
                const showMoreItems = (this.getContent().scrollHeight -
                    (this.getContent().scrollTop +
                        this.getContent().clientHeight)) < 200;
                if (showMoreItems) {
                    this.lastItem += 20;
                }
            }
        },
        onSpaceDown(e) {
            e.preventDefault();
        },
        onTabDown(e) {
            const menu = this.$refs.menu;
            if (!menu)
                return;
            const activeTile = menu.activeTile;
            // An item that is selected by
            // menu-index should toggled
            if (!this.multiple &&
                activeTile &&
                this.isMenuActive) {
                e.preventDefault();
                e.stopPropagation();
                activeTile.click();
            }
            else {
                // If we make it here,
                // the user has no selected indexes
                // and is probably tabbing out
                this.blur(e);
            }
        },
        onUpDown(e) {
            const menu = this.$refs.menu;
            if (!menu)
                return;
            e.preventDefault();
            // Multiple selects do not cycle their value
            // when pressing up or down, instead activate
            // the menu
            if (this.multiple)
                return this.activateMenu();
            const keyCode = e.keyCode;
            // Cycle through available values to achieve
            // select native behavior
            menu.isBooted = true;
            window.requestAnimationFrame(() => {
                menu.getTiles();
                if (!menu.hasClickableTiles)
                    return this.activateMenu();
                switch (keyCode) {
                    case keyCodes.up:
                        menu.prevTile();
                        break;
                    case keyCodes.down:
                        menu.nextTile();
                        break;
                    case keyCodes.home:
                        menu.firstTile();
                        break;
                    case keyCodes.end:
                        menu.lastTile();
                        break;
                }
                this.selectItem(this.allItems[this.getMenuIndex()]);
            });
        },
        selectItem(item) {
            if (!this.multiple) {
                this.setValue(this.returnObject ? item : this.getValue(item));
                this.isMenuActive = false;
            }
            else {
                const internalValue = (this.internalValue || []).slice();
                const i = this.findExistingIndex(item);
                i !== -1 ? internalValue.splice(i, 1) : internalValue.push(item);
                this.setValue(internalValue.map((i) => {
                    return this.returnObject ? i : this.getValue(i);
                }));
                // There is no item to re-highlight
                // when selections are hidden
                if (this.hideSelected) {
                    this.setMenuIndex(-1);
                }
                else {
                    const index = this.computedItems.indexOf(item);
                    if (~index) {
                        this.$nextTick(() => this.$refs.menu.getTiles());
                        setTimeout(() => this.setMenuIndex(index));
                    }
                }
            }
        },
        setMenuIndex(index) {
            this.$refs.menu && (this.$refs.menu.listIndex = index);
        },
        setSelectedItems() {
            const selectedItems = [];
            const values = !this.multiple || !Array.isArray(this.internalValue)
                ? [this.internalValue]
                : this.internalValue;
            for (const value of values) {
                const index = this.allItems.findIndex(v => this.valueComparator(this.getValue(v), this.getValue(value)));
                if (index > -1) {
                    selectedItems.push(this.allItems[index]);
                }
            }
            this.selectedItems = selectedItems;
        },
        setValue(value) {
            if (!this.valueComparator(value, this.internalValue)) {
                this.internalValue = value;
            }
        },
        isAppendInner(target) {
            // return true if append inner is present
            // and the target is itself or inside
            const appendInner = this.$refs['append-inner'];
            return appendInner && (appendInner === target || appendInner.contains(target));
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNlbGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTZWxlY3QvVlNlbGVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTywrQkFBK0IsQ0FBQTtBQUN0QyxPQUFPLGdCQUFnQixDQUFBO0FBRXZCLGFBQWE7QUFDYixPQUFPLEtBQUssTUFBTSxVQUFVLENBQUE7QUFDNUIsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFBO0FBQzVCLE9BQU8sV0FBVyxNQUFNLGVBQWUsQ0FBQTtBQUV2QyxhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFBO0FBQzlCLE9BQU8sVUFBVSxNQUFNLDBCQUEwQixDQUFBO0FBRWpELFNBQVM7QUFDVCxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUVoRCxhQUFhO0FBQ2IsT0FBTyxZQUFZLE1BQU0sZ0NBQWdDLENBQUE7QUFFekQsWUFBWTtBQUNaLE9BQU8sU0FBUyxNQUFNLHNCQUFzQixDQUFBO0FBQzVDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxvQkFBb0IsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDeEcsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUUzRCxRQUFRO0FBQ1IsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFDdEMsT0FBTyxFQUE4QyxjQUFjLEVBQUUsQ0FBQyxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBSW5GLE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHO0lBQzlCLFlBQVksRUFBRSxLQUFLO0lBQ25CLG1CQUFtQixFQUFFLEtBQUs7SUFDMUIsV0FBVyxFQUFFLElBQUk7SUFDakIsV0FBVyxFQUFFLEtBQUs7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LENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7aUJBQ3pDO2FBQ0Y7WUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQTtRQUNwQyxDQUFDO1FBQ0QsUUFBUSxDQUFFLEtBQVU7WUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRTtnQkFDcEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUE7YUFDM0I7UUFDSCxDQUFDO1FBQ0QsYUFBYSxDQUFFLE1BQVc7WUFDeEIseUNBQXlDO1lBQ3pDLHFDQUFxQztZQUNyQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1lBRTlDLE9BQU8sV0FBVyxJQUFJLENBQUMsV0FBVyxLQUFLLE1BQU0sSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7UUFDaEYsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXG5pbXBvcnQgJy4uL1ZUZXh0RmllbGQvVlRleHRGaWVsZC5zYXNzJ1xuaW1wb3J0ICcuL1ZTZWxlY3Quc2FzcydcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IFZDaGlwIGZyb20gJy4uL1ZDaGlwJ1xuaW1wb3J0IFZNZW51IGZyb20gJy4uL1ZNZW51J1xuaW1wb3J0IFZTZWxlY3RMaXN0IGZyb20gJy4vVlNlbGVjdExpc3QnXG5cbi8vIEV4dGVuc2lvbnNcbmltcG9ydCBWSW5wdXQgZnJvbSAnLi4vVklucHV0J1xuaW1wb3J0IFZUZXh0RmllbGQgZnJvbSAnLi4vVlRleHRGaWVsZC9WVGV4dEZpZWxkJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBDb21wYXJhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb21wYXJhYmxlJ1xuaW1wb3J0IERlcGVuZGVudCBmcm9tICcuLi8uLi9taXhpbnMvZGVwZW5kZW50J1xuaW1wb3J0IEZpbHRlcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2ZpbHRlcmFibGUnXG5cbi8vIERpcmVjdGl2ZXNcbmltcG9ydCBDbGlja091dHNpZGUgZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9jbGljay1vdXRzaWRlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCBtZXJnZURhdGEgZnJvbSAnLi4vLi4vdXRpbC9tZXJnZURhdGEnXG5pbXBvcnQgeyBnZXRQcm9wZXJ0eUZyb21JdGVtLCBnZXRPYmplY3RWYWx1ZUJ5UGF0aCwga2V5Q29kZXMsIG5vcm1hbGl6ZUF0dHJzIH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IHsgY29uc29sZUVycm9yLCBicmVha2luZyB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcblxuLy8gVHlwZXNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgeyBWTm9kZSwgVk5vZGVEaXJlY3RpdmUsIFByb3BUeXBlLCBWTm9kZURhdGEsIHdpdGhEaXJlY3RpdmVzLCBoIH0gZnJvbSAndnVlJ1xuaW1wb3J0IHsgUHJvcFZhbGlkYXRvciB9IGZyb20gJ3Z1ZS90eXBlcy9vcHRpb25zJ1xuaW1wb3J0IHsgU2VsZWN0SXRlbUtleSB9IGZyb20gJ3Z1ZXRpZnkvdHlwZXMnXG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0TWVudVByb3BzID0ge1xuICBjbG9zZU9uQ2xpY2s6IGZhbHNlLFxuICBjbG9zZU9uQ29udGVudENsaWNrOiBmYWxzZSxcbiAgZGlzYWJsZUtleXM6IHRydWUsXG4gIG9wZW5PbkNsaWNrOiBmYWxzZSxcbiAgbWF4SGVpZ2h0OiAzMDQsXG59XG5cbi8vIFR5cGVzXG5jb25zdCBiYXNlTWl4aW5zID0gbWl4aW5zKFxuICBWVGV4dEZpZWxkLFxuICBDb21wYXJhYmxlLFxuICBEZXBlbmRlbnQsXG4gIEZpbHRlcmFibGVcbilcblxuaW50ZXJmYWNlIG9wdGlvbnMgZXh0ZW5kcyBJbnN0YW5jZVR5cGU8dHlwZW9mIGJhc2VNaXhpbnM+IHtcbiAgJHJlZnM6IHtcbiAgICBtZW51OiBJbnN0YW5jZVR5cGU8dHlwZW9mIFZNZW51PlxuICAgIGNvbnRlbnQ6IEhUTUxFbGVtZW50XG4gICAgbGFiZWw6IEhUTUxFbGVtZW50XG4gICAgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnRcbiAgICAncHJlcGVuZC1pbm5lcic6IEhUTUxFbGVtZW50XG4gICAgJ2FwcGVuZC1pbm5lcic6IEhUTUxFbGVtZW50XG4gICAgcHJlZml4OiBIVE1MRWxlbWVudFxuICAgIHN1ZmZpeDogSFRNTEVsZW1lbnRcbiAgfVxufVxuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgYmFzZU1peGlucy5leHRlbmQoe1xuICBuYW1lOiAndi1zZWxlY3QnLFxuXG4gIHByb3BzOiB7XG4gICAgYXBwZW5kSWNvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyRkcm9wZG93bicsXG4gICAgfSxcbiAgICBhdHRhY2g6IHtcbiAgICAgIHR5cGU6IG51bGwgYXMgdW5rbm93biBhcyBQcm9wVHlwZTxzdHJpbmcgfCBib29sZWFuIHwgRWxlbWVudCB8IFZOb2RlPixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gICAgYXV0bzogQm9vbGVhbixcbiAgICBjYWNoZUl0ZW1zOiBCb29sZWFuLFxuICAgIGNoaXBzOiBCb29sZWFuLFxuICAgIGNsZWFyYWJsZTogQm9vbGVhbixcbiAgICBkZWxldGFibGVDaGlwczogQm9vbGVhbixcbiAgICBkaXNhYmxlTG9va3VwOiBCb29sZWFuLFxuICAgIGVhZ2VyOiBCb29sZWFuLFxuICAgIGhpZGVTZWxlY3RlZDogQm9vbGVhbixcbiAgICBpdGVtczoge1xuICAgICAgdHlwZTogQXJyYXksXG4gICAgICBkZWZhdWx0OiAoKSA9PiBbXSxcbiAgICB9IGFzIFByb3BWYWxpZGF0b3I8YW55W10+LFxuICAgIGl0ZW1Db2xvcjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ3ByaW1hcnknLFxuICAgIH0sXG4gICAgaXRlbURpc2FibGVkOiB7XG4gICAgICB0eXBlOiBbU3RyaW5nLCBBcnJheSwgRnVuY3Rpb25dIGFzIFByb3BUeXBlPFNlbGVjdEl0ZW1LZXk+LFxuICAgICAgZGVmYXVsdDogJ2Rpc2FibGVkJyxcbiAgICB9LFxuICAgIGl0ZW1UZXh0OiB7XG4gICAgICB0eXBlOiBbU3RyaW5nLCBBcnJheSwgRnVuY3Rpb25dIGFzIFByb3BUeXBlPFNlbGVjdEl0ZW1LZXk+LFxuICAgICAgZGVmYXVsdDogJ3RleHQnLFxuICAgIH0sXG4gICAgaXRlbVZhbHVlOiB7XG4gICAgICB0eXBlOiBbU3RyaW5nLCBBcnJheSwgRnVuY3Rpb25dIGFzIFByb3BUeXBlPFNlbGVjdEl0ZW1LZXk+LFxuICAgICAgZGVmYXVsdDogJ3ZhbHVlJyxcbiAgICB9LFxuICAgIG1lbnVQcm9wczoge1xuICAgICAgdHlwZTogW1N0cmluZywgQXJyYXksIE9iamVjdF0sXG4gICAgICBkZWZhdWx0OiAoKSA9PiBkZWZhdWx0TWVudVByb3BzLFxuICAgIH0sXG4gICAgbWluV2lkdGg6IFtTdHJpbmcsIE51bWJlcl0sXG4gICAgbXVsdGlwbGU6IEJvb2xlYW4sXG4gICAgb3Blbk9uQ2xlYXI6IEJvb2xlYW4sXG4gICAgcmV0dXJuT2JqZWN0OiBCb29sZWFuLFxuICAgIHNtYWxsQ2hpcHM6IEJvb2xlYW4sXG4gIH0sXG5cbiAgZW1pdHM6IFsndXBkYXRlOm1vZGVsVmFsdWUnLCAnY2hhbmdlJywgJ2ZvY3VzJywgJ2JsdXInLCAna2V5ZG93bicsICdjbGljaycsICd1cGRhdGU6bGlzdC1pbmRleCddLFxuXG4gIGRhdGEgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjYWNoZWRJdGVtczogdGhpcy5jYWNoZUl0ZW1zID8gdGhpcy5pdGVtcyA6IFtdLFxuICAgICAgbWVudUlzQm9vdGVkOiBmYWxzZSxcbiAgICAgIGlzTWVudUFjdGl2ZTogZmFsc2UsXG4gICAgICBsYXN0SXRlbTogMjAsXG4gICAgICAvLyBBcyBsb25nIGFzIGEgdmFsdWUgaXMgZGVmaW5lZCwgc2hvdyBpdFxuICAgICAgLy8gT3RoZXJ3aXNlLCBjaGVjayBpZiBtdWx0aXBsZVxuICAgICAgLy8gdG8gZGV0ZXJtaW5lIHdoaWNoIGRlZmF1bHQgdG8gcHJvdmlkZVxuICAgICAgbGF6eVZhbHVlOiB0aGlzLm1vZGVsVmFsdWUgIT09IHVuZGVmaW5lZFxuICAgICAgICA/IHRoaXMubW9kZWxWYWx1ZVxuICAgICAgICA6IHRoaXMubXVsdGlwbGUgPyBbXSA6IHVuZGVmaW5lZCxcbiAgICAgIHNlbGVjdGVkSW5kZXg6IC0xLFxuICAgICAgc2VsZWN0ZWRJdGVtczogW10gYXMgYW55W10sXG4gICAgICBrZXlib2FyZExvb2t1cFByZWZpeDogJycsXG4gICAgICBrZXlib2FyZExvb2t1cExhc3RUaW1lOiAwLFxuICAgICAgZGV0ZWN0ZWRTY29wZUlkOiBudWxsIGFzIHN0cmluZyB8IG51bGwsXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgLyogQWxsIGl0ZW1zIHRoYXQgdGhlIHNlbGVjdCBoYXMgKi9cbiAgICBhbGxJdGVtcyAoKTogb2JqZWN0W10ge1xuICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyRHVwbGljYXRlcyh0aGlzLmNhY2hlZEl0ZW1zLmNvbmNhdCh0aGlzLml0ZW1zKSlcbiAgICB9LFxuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5WVGV4dEZpZWxkLmNvbXB1dGVkLmNsYXNzZXMuY2FsbCh0aGlzKSxcbiAgICAgICAgJ3Ytc2VsZWN0JzogdHJ1ZSxcbiAgICAgICAgJ3Ytc2VsZWN0LS1jaGlwcyc6IHRoaXMuaGFzQ2hpcHMsXG4gICAgICAgICd2LXNlbGVjdC0tY2hpcHMtLXNtYWxsJzogdGhpcy5zbWFsbENoaXBzLFxuICAgICAgICAndi1zZWxlY3QtLWlzLW1lbnUtYWN0aXZlJzogdGhpcy5pc01lbnVBY3RpdmUsXG4gICAgICAgICd2LXNlbGVjdC0taXMtbXVsdGknOiB0aGlzLm11bHRpcGxlLFxuICAgICAgfVxuICAgIH0sXG4gICAgLyogVXNlZCBieSBvdGhlciBjb21wb25lbnRzIHRvIG92ZXJ3cml0ZSAqL1xuICAgIGNvbXB1dGVkSXRlbXMgKCk6IG9iamVjdFtdIHtcbiAgICAgIHJldHVybiB0aGlzLmFsbEl0ZW1zXG4gICAgfSxcbiAgICBjb21wdXRlZE93bnMgKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gYGxpc3QtJHt0aGlzLiQ/LnVpZH1gXG4gICAgfSxcbiAgICBjb21wdXRlZENvdW50ZXJWYWx1ZSAoKTogbnVtYmVyIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5tdWx0aXBsZVxuICAgICAgICA/IHRoaXMuc2VsZWN0ZWRJdGVtc1xuICAgICAgICA6ICh0aGlzLmdldFRleHQodGhpcy5zZWxlY3RlZEl0ZW1zWzBdKSA/PyAnJykudG9TdHJpbmcoKVxuXG4gICAgICBpZiAodHlwZW9mIHRoaXMuY291bnRlclZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvdW50ZXJWYWx1ZSh2YWx1ZSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aFxuICAgIH0sXG4gICAgZGlyZWN0aXZlcyAoKTogVk5vZGVEaXJlY3RpdmVbXSB8IHVuZGVmaW5lZCB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICBbXG4gICAgICAgICAgQ2xpY2tPdXRzaWRlLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGhhbmRsZXI6ICgpID0+IHRoaXMuaXNGb2N1c2VkICYmIHRoaXMuYmx1cigpLFxuICAgICAgICAgICAgY2xvc2VDb25kaXRpb25hbDogdGhpcy5jbG9zZUNvbmRpdGlvbmFsLFxuICAgICAgICAgICAgaW5jbHVkZTogKCkgPT4gdGhpcy5nZXRPcGVuRGVwZW5kZW50RWxlbWVudHMoKSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgXVxuICAgIH0sXG4gICAgZHluYW1pY0hlaWdodCAoKSB7XG4gICAgICByZXR1cm4gJ2F1dG8nXG4gICAgfSxcbiAgICBoYXNDaGlwcyAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5jaGlwcyB8fCB0aGlzLnNtYWxsQ2hpcHNcbiAgICB9LFxuICAgIGhhc1Nsb3QgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5oYXNDaGlwcyB8fCB0aGlzLiRzbG90cy5zZWxlY3Rpb24pXG4gICAgfSxcbiAgICBpc0RpcnR5ICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoID4gMFxuICAgIH0sXG4gICAgbGlzdERhdGEgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogdGhpcy5jb21wdXRlZE93bnMsXG4gICAgICAgIGFjdGlvbjogdGhpcy5tdWx0aXBsZSxcbiAgICAgICAgY29sb3I6IHRoaXMuaXRlbUNvbG9yLFxuICAgICAgICBkZW5zZTogdGhpcy5kZW5zZSxcbiAgICAgICAgaGlkZVNlbGVjdGVkOiB0aGlzLmhpZGVTZWxlY3RlZCxcbiAgICAgICAgaXRlbXM6IHRoaXMudmlydHVhbGl6ZWRJdGVtcyxcbiAgICAgICAgaXRlbURpc2FibGVkOiB0aGlzLml0ZW1EaXNhYmxlZCxcbiAgICAgICAgaXRlbVRleHQ6IHRoaXMuaXRlbVRleHQsXG4gICAgICAgIGl0ZW1WYWx1ZTogdGhpcy5pdGVtVmFsdWUsXG4gICAgICAgIG5vRGF0YVRleHQ6IHRoaXMuJHZ1ZXRpZnkubGFuZy50KHRoaXMubm9EYXRhVGV4dCksXG4gICAgICAgIHNlbGVjdGVkSXRlbXM6IHRoaXMuc2VsZWN0ZWRJdGVtcyxcbiAgICAgICAgb25TZWxlY3Q6IHRoaXMuc2VsZWN0SXRlbSxcbiAgICAgIH1cbiAgICB9LFxuICAgIGxpc3RBdHRycyAoKTogb2JqZWN0IHtcbiAgICAgIGNvbnN0IHNjb3BlSWRBdHRyczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9XG5cbiAgICAgIC8vINCY0YHQv9C+0LvRjNC30YPQtdC8IGRldGVjdGVkU2NvcGVJZCDQuNC3IG1vdW50ZWQgaG9va1xuICAgICAgaWYgKHRoaXMuZGV0ZWN0ZWRTY29wZUlkKSB7XG4gICAgICAgIHNjb3BlSWRBdHRyc1t0aGlzLmRldGVjdGVkU2NvcGVJZF0gPSAnJ1xuICAgICAgfVxuXG4gICAgICAvLyBzY29wZUlkINGD0YHQv9C10YjQvdC+INC/0LXRgNC10LTQsNC10YLRgdGPINCyIFZTZWxlY3RMaXN0XG5cbiAgICAgIHJldHVybiBzY29wZUlkQXR0cnNcbiAgICB9LFxuICAgIHN0YXRpY0xpc3QgKCk6IFZOb2RlIHtcbiAgICAgIGlmICh0aGlzLiRzbG90c1snbm8tZGF0YSddIHx8IHRoaXMuJHNsb3RzWydwcmVwZW5kLWl0ZW0nXSB8fCB0aGlzLiRzbG90c1snYXBwZW5kLWl0ZW0nXSkge1xuICAgICAgICBjb25zb2xlRXJyb3IoJ2Fzc2VydDogc3RhdGljTGlzdCBzaG91bGQgbm90IGJlIGNhbGxlZCBpZiBzbG90cyBhcmUgdXNlZCcpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoKFZTZWxlY3RMaXN0LCB7XG4gICAgICAgIC4uLnRoaXMubGlzdERhdGEsXG4gICAgICAgIC4uLnRoaXMubGlzdEF0dHJzLFxuICAgICAgfSwge1xuICAgICAgICBpdGVtOiB0aGlzLiRzbG90cy5pdGVtLFxuICAgICAgfSlcbiAgICB9LFxuICAgIHZpcnR1YWxpemVkSXRlbXMgKCk6IG9iamVjdFtdIHtcbiAgICAgIHJldHVybiAodGhpcy4kX21lbnVQcm9wcyBhcyBhbnkpLmF1dG9cbiAgICAgICAgPyB0aGlzLmNvbXB1dGVkSXRlbXNcbiAgICAgICAgOiB0aGlzLmNvbXB1dGVkSXRlbXMuc2xpY2UoMCwgdGhpcy5sYXN0SXRlbSlcbiAgICB9LFxuICAgIG1lbnVDYW5TaG93OiAoKSA9PiB0cnVlLFxuICAgICRfbWVudVByb3BzICgpOiBvYmplY3Qge1xuICAgICAgbGV0IG5vcm1hbGlzZWRQcm9wcyA9IHR5cGVvZiB0aGlzLm1lbnVQcm9wcyA9PT0gJ3N0cmluZydcbiAgICAgICAgPyB0aGlzLm1lbnVQcm9wcy5zcGxpdCgnLCcpXG4gICAgICAgIDogdGhpcy5tZW51UHJvcHNcblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkobm9ybWFsaXNlZFByb3BzKSkge1xuICAgICAgICBub3JtYWxpc2VkUHJvcHMgPSBub3JtYWxpc2VkUHJvcHMucmVkdWNlKChhY2MsIHApID0+IHtcbiAgICAgICAgICBhY2NbcC50cmltKCldID0gdHJ1ZVxuICAgICAgICAgIHJldHVybiBhY2NcbiAgICAgICAgfSwge30pXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmRlZmF1bHRNZW51UHJvcHMsXG4gICAgICAgIGVhZ2VyOiB0aGlzLmVhZ2VyLFxuICAgICAgICBtb2RlbFZhbHVlOiB0aGlzLm1lbnVDYW5TaG93ICYmIHRoaXMuaXNNZW51QWN0aXZlLFxuICAgICAgICBudWRnZUJvdHRvbTogbm9ybWFsaXNlZFByb3BzLm9mZnNldFkgPyAxIDogMCwgLy8gY29udmVydCB0byBpbnRcbiAgICAgICAgYXV0bzogdGhpcy5hdXRvLFxuICAgICAgICBtaW5XaWR0aDogdGhpcy5taW5XaWR0aCxcbiAgICAgICAgLi4ubm9ybWFsaXNlZFByb3BzLFxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBpbnRlcm5hbFZhbHVlOiB7XG4gICAgICBoYW5kbGVyICh2YWwpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsVmFsdWUgPSB2YWxcbiAgICAgICAgdGhpcy5zZXRTZWxlY3RlZEl0ZW1zKClcblxuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuJHJlZnMubWVudT8udXBkYXRlRGltZW5zaW9ucygpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5oaWRlU2VsZWN0ZWQpIHtcbiAgICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uU2Nyb2xsKClcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGVlcDogdHJ1ZSxcbiAgICB9LFxuICAgIGlzTWVudUFjdGl2ZSAodmFsKSB7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB0aGlzLm9uTWVudUFjdGl2ZUNoYW5nZSh2YWwpKVxuICAgIH0sXG4gICAgaXRlbXM6IHtcbiAgICAgIGltbWVkaWF0ZTogdHJ1ZSxcbiAgICAgIGhhbmRsZXIgKHZhbCkge1xuICAgICAgICBpZiAodGhpcy5jYWNoZUl0ZW1zKSB7XG4gICAgICAgICAgLy8gQnJlYWtzIHZ1ZS10ZXN0LXV0aWxzIGlmXG4gICAgICAgICAgLy8gdGhpcyBpc24ndCBjYWxjdWxhdGVkXG4gICAgICAgICAgLy8gb24gdGhlIG5leHQgdGlja1xuICAgICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2FjaGVkSXRlbXMgPSB0aGlzLmZpbHRlckR1cGxpY2F0ZXModGhpcy5jYWNoZWRJdGVtcy5jb25jYXQodmFsKSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRTZWxlY3RlZEl0ZW1zKClcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcblxuICBjcmVhdGVkICgpIHtcbiAgICBjb25zdCBicmVha2luZ1Byb3BzID0gW1xuICAgICAgWyd2YWx1ZScsICdtb2RlbFZhbHVlJ10sXG4gICAgICBbJ29uSW5wdXQnLCAnb25VcGRhdGU6bW9kZWxWYWx1ZSddLFxuICAgIF1cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgYnJlYWtpbmdQcm9wcy5mb3JFYWNoKChbb3JpZ2luYWwsIHJlcGxhY2VtZW50XSkgPT4ge1xuICAgICAgaWYgKHRoaXMuJGF0dHJzLmhhc093blByb3BlcnR5KG9yaWdpbmFsKSkgYnJlYWtpbmcob3JpZ2luYWwsIHJlcGxhY2VtZW50LCB0aGlzKVxuICAgIH0pXG4gIH0sXG5cbiAgbW91bnRlZCAoKSB7XG4gICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuJGVsICYmIHRoaXMuJGVsLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgY29uc3QgYXR0cnMgPSB0aGlzLiRlbC5hdHRyaWJ1dGVzXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBhdHRyID0gYXR0cnNbaV1cbiAgICAgICAgICBpZiAoYXR0ci5uYW1lLnN0YXJ0c1dpdGgoJ2RhdGEtdi0nKSkge1xuICAgICAgICAgICAgdGhpcy5kZXRlY3RlZFNjb3BlSWQgPSBhdHRyLm5hbWVcbiAgICAgICAgICAgIC8vIHNjb3BlSWQg0L3QsNC50LTQtdC9INC4INGB0L7RhdGA0LDQvdC10L0g0LTQu9GPINC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGPINCyIGRyb3Bkb3duXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIC8qKiBAcHVibGljICovXG4gICAgYmx1ciAoZT86IEV2ZW50KSB7XG4gICAgICBWVGV4dEZpZWxkLm1ldGhvZHMuYmx1ci5jYWxsKHRoaXMsIGUpXG4gICAgICB0aGlzLmlzTWVudUFjdGl2ZSA9IGZhbHNlXG4gICAgICB0aGlzLmlzRm9jdXNlZCA9IGZhbHNlXG4gICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAtMVxuICAgICAgdGhpcy5zZXRNZW51SW5kZXgoLTEpXG4gICAgfSxcbiAgICAvKiogQHB1YmxpYyAqL1xuICAgIGFjdGl2YXRlTWVudSAoKSB7XG4gICAgICBpZiAoXG4gICAgICAgICF0aGlzLmlzSW50ZXJhY3RpdmUgfHxcbiAgICAgICAgdGhpcy5pc01lbnVBY3RpdmVcbiAgICAgICkgcmV0dXJuXG5cbiAgICAgIHRoaXMuaXNNZW51QWN0aXZlID0gdHJ1ZVxuICAgIH0sXG4gICAgY2xlYXJhYmxlQ2FsbGJhY2sgKCkge1xuICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLm11bHRpcGxlID8gW10gOiBudWxsKVxuICAgICAgdGhpcy5zZXRNZW51SW5kZXgoLTEpXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB0aGlzLiRyZWZzLmlucHV0ICYmIHRoaXMuJHJlZnMuaW5wdXQuZm9jdXMoKSlcblxuICAgICAgaWYgKHRoaXMub3Blbk9uQ2xlYXIpIHRoaXMuaXNNZW51QWN0aXZlID0gdHJ1ZVxuICAgIH0sXG4gICAgY2xvc2VDb25kaXRpb25hbCAoZTogRXZlbnQpIHtcbiAgICAgIGlmICghdGhpcy5pc01lbnVBY3RpdmUpIHJldHVybiB0cnVlXG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgICF0aGlzLl9pc0Rlc3Ryb3llZCAmJlxuXG4gICAgICAgIC8vIENsaWNrIG9yaWdpbmF0ZXMgZnJvbSBvdXRzaWRlIHRoZSBtZW51IGNvbnRlbnRcbiAgICAgICAgLy8gTXVsdGlwbGUgc2VsZWN0cyBkb24ndCBjbG9zZSB3aGVuIGFuIGl0ZW0gaXMgY2xpY2tlZFxuICAgICAgICAoIXRoaXMuZ2V0Q29udGVudCgpIHx8XG4gICAgICAgICF0aGlzLmdldENvbnRlbnQoKS5jb250YWlucyhlLnRhcmdldCBhcyBOb2RlKSkgJiZcblxuICAgICAgICAvLyBDbGljayBvcmlnaW5hdGVzIGZyb20gb3V0c2lkZSB0aGUgZWxlbWVudFxuICAgICAgICB0aGlzLiRlbCAmJlxuICAgICAgICAhdGhpcy4kZWwuY29udGFpbnMoZS50YXJnZXQgYXMgTm9kZSkgJiZcbiAgICAgICAgZS50YXJnZXQgIT09IHRoaXMuJGVsXG4gICAgICApXG4gICAgfSxcbiAgICBmaWx0ZXJEdXBsaWNhdGVzIChhcnI6IGFueVtdKSB7XG4gICAgICBjb25zdCB1bmlxdWVWYWx1ZXMgPSBuZXcgTWFwKClcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBhcnIubGVuZ3RoOyArK2luZGV4KSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSBhcnJbaW5kZXhdXG5cbiAgICAgICAgLy8gRG8gbm90IHJldHVybiBudWxsIHZhbHVlcyBpZiBleGlzdGFudCAoIzE0NDIxKVxuICAgICAgICBpZiAoaXRlbSA9PSBudWxsKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuICAgICAgICAvLyBEbyBub3QgZGVkdXBsaWNhdGUgaGVhZGVycyBvciBkaXZpZGVycyAoIzEyNTE3KVxuICAgICAgICBpZiAoaXRlbS5oZWFkZXIgfHwgaXRlbS5kaXZpZGVyKSB7XG4gICAgICAgICAgdW5pcXVlVmFsdWVzLnNldChpdGVtLCBpdGVtKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB2YWwgPSB0aGlzLmdldFZhbHVlKGl0ZW0pXG5cbiAgICAgICAgLy8gVE9ETzogY29tcGFyYXRvclxuICAgICAgICAhdW5pcXVlVmFsdWVzLmhhcyh2YWwpICYmIHVuaXF1ZVZhbHVlcy5zZXQodmFsLCBpdGVtKVxuICAgICAgfVxuICAgICAgcmV0dXJuIEFycmF5LmZyb20odW5pcXVlVmFsdWVzLnZhbHVlcygpKVxuICAgIH0sXG4gICAgZmluZEV4aXN0aW5nSW5kZXggKGl0ZW06IG9iamVjdCkge1xuICAgICAgY29uc3QgaXRlbVZhbHVlID0gdGhpcy5nZXRWYWx1ZShpdGVtKVxuXG4gICAgICByZXR1cm4gKHRoaXMuaW50ZXJuYWxWYWx1ZSB8fCBbXSkuZmluZEluZGV4KChpOiBvYmplY3QpID0+IHRoaXMudmFsdWVDb21wYXJhdG9yKHRoaXMuZ2V0VmFsdWUoaSksIGl0ZW1WYWx1ZSkpXG4gICAgfSxcbiAgICBnZXRDb250ZW50ICgpIHtcbiAgICAgIHJldHVybiB0aGlzLiRyZWZzLm1lbnUgJiYgdGhpcy4kcmVmcy5tZW51LiRyZWZzLmNvbnRlbnRcbiAgICB9LFxuICAgIGdlbkNoaXBTZWxlY3Rpb24gKGl0ZW06IG9iamVjdCwgaW5kZXg6IG51bWJlcikge1xuICAgICAgY29uc3QgaXNEaXNhYmxlZCA9IChcbiAgICAgICAgdGhpcy5pc0Rpc2FibGVkIHx8XG4gICAgICAgIHRoaXMuZ2V0RGlzYWJsZWQoaXRlbSlcbiAgICAgIClcbiAgICAgIGNvbnN0IGlzSW50ZXJhY3RpdmUgPSAhaXNEaXNhYmxlZCAmJiB0aGlzLmlzSW50ZXJhY3RpdmVcblxuICAgICAgcmV0dXJuIGgoVkNoaXAsIHtcbiAgICAgICAgY2xhc3M6ICd2LWNoaXAtLXNlbGVjdCcsXG4gICAgICAgIHRhYmluZGV4OiAtMSxcbiAgICAgICAgY2xvc2U6IHRoaXMuZGVsZXRhYmxlQ2hpcHMgJiYgaXNJbnRlcmFjdGl2ZSxcbiAgICAgICAgZGlzYWJsZWQ6IGlzRGlzYWJsZWQsXG4gICAgICAgIG1vZGVsVmFsdWU6IGluZGV4ID09PSB0aGlzLnNlbGVjdGVkSW5kZXgsXG4gICAgICAgIHNtYWxsOiB0aGlzLnNtYWxsQ2hpcHMsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKCFpc0ludGVyYWN0aXZlKSByZXR1cm5cblxuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IGluZGV4XG4gICAgICAgIH0sXG4gICAgICAgICdvbkNsaWNrOmNsb3NlJzogKCkgPT4gdGhpcy5vbkNoaXBJbnB1dChpdGVtKSxcbiAgICAgICAga2V5OiBKU09OLnN0cmluZ2lmeSh0aGlzLmdldFZhbHVlKGl0ZW0pKSxcbiAgICAgIH0sICgpID0+IHRoaXMuZ2V0VGV4dChpdGVtKSlcbiAgICB9LFxuICAgIGdlbkNvbW1hU2VsZWN0aW9uIChpdGVtOiBvYmplY3QsIGluZGV4OiBudW1iZXIsIGxhc3Q6IGJvb2xlYW4pIHtcbiAgICAgIGNvbnN0IGNvbG9yID0gaW5kZXggPT09IHRoaXMuc2VsZWN0ZWRJbmRleCAmJiB0aGlzLmNvbXB1dGVkQ29sb3JcbiAgICAgIGNvbnN0IGlzRGlzYWJsZWQgPSAoXG4gICAgICAgIHRoaXMuaXNEaXNhYmxlZCB8fFxuICAgICAgICB0aGlzLmdldERpc2FibGVkKGl0ZW0pXG4gICAgICApXG5cbiAgICAgIHJldHVybiBoKCdkaXYnLCB0aGlzLnNldFRleHRDb2xvcihjb2xvciwge1xuICAgICAgICBjbGFzczogWyd2LXNlbGVjdF9fc2VsZWN0aW9uIHYtc2VsZWN0X19zZWxlY3Rpb24tLWNvbW1hJywge1xuICAgICAgICAgICd2LXNlbGVjdF9fc2VsZWN0aW9uLS1kaXNhYmxlZCc6IGlzRGlzYWJsZWQsXG4gICAgICAgIH1dLFxuICAgICAgICBrZXk6IEpTT04uc3RyaW5naWZ5KHRoaXMuZ2V0VmFsdWUoaXRlbSkpLFxuICAgICAgfSksIGAke3RoaXMuZ2V0VGV4dChpdGVtKX0ke2xhc3QgPyAnJyA6ICcsICd9YClcbiAgICB9LFxuICAgIGdlbkRlZmF1bHRTbG90ICgpOiAoVk5vZGUgfCBWTm9kZVtdIHwgbnVsbClbXSB7XG4gICAgICBjb25zdCBzZWxlY3Rpb25zID0gdGhpcy5nZW5TZWxlY3Rpb25zKClcbiAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5nZW5JbnB1dCgpXG5cbiAgICAgIC8vIElmIHRoZSByZXR1cm4gaXMgYW4gZW1wdHkgYXJyYXlcbiAgICAgIC8vIHB1c2ggdGhlIGlucHV0XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShzZWxlY3Rpb25zKSkge1xuICAgICAgICBzZWxlY3Rpb25zLnB1c2goaW5wdXQpXG4gICAgICAvLyBPdGhlcndpc2UgcHVzaCBpdCBpbnRvIGNoaWxkcmVuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxlY3Rpb25zLmNoaWxkcmVuID0gc2VsZWN0aW9ucy5jaGlsZHJlbiB8fCBbXVxuICAgICAgICBzZWxlY3Rpb25zLmNoaWxkcmVuLnB1c2goaW5wdXQpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbXG4gICAgICAgIHRoaXMuZ2VuRmllbGRzZXQoKSxcbiAgICAgICAgd2l0aERpcmVjdGl2ZXMoaCgnZGl2Jywge1xuICAgICAgICAgIGNsYXNzOiAndi1zZWxlY3RfX3Nsb3QnLFxuICAgICAgICB9LCBbXG4gICAgICAgICAgdGhpcy5nZW5MYWJlbCgpLFxuICAgICAgICAgIHRoaXMucHJlZml4ID8gdGhpcy5nZW5BZmZpeCgncHJlZml4JykgOiBudWxsLFxuICAgICAgICAgIHNlbGVjdGlvbnMsXG4gICAgICAgICAgdGhpcy5zdWZmaXggPyB0aGlzLmdlbkFmZml4KCdzdWZmaXgnKSA6IG51bGwsXG4gICAgICAgICAgdGhpcy5nZW5DbGVhckljb24oKSxcbiAgICAgICAgICB0aGlzLmdlbkljb25TbG90KCksXG4gICAgICAgICAgdGhpcy5nZW5IaWRkZW5JbnB1dCgpLFxuICAgICAgICBdKSwgdGhpcy5kaXJlY3RpdmVzKSxcbiAgICAgICAgdGhpcy5nZW5NZW51KCksXG4gICAgICAgIHRoaXMuZ2VuUHJvZ3Jlc3MoKSxcbiAgICAgIF1cbiAgICB9LFxuICAgIGdlbkljb24gKFxuICAgICAgdHlwZTogc3RyaW5nLFxuICAgICAgY2I/OiAoZTogRXZlbnQpID0+IHZvaWQsXG4gICAgICBleHRyYURhdGE/OiBWTm9kZURhdGFcbiAgICApIHtcbiAgICAgIGNvbnN0IGljb24gPSBWSW5wdXQubWV0aG9kcy5nZW5JY29uLmNhbGwodGhpcywgdHlwZSwgY2IsIGV4dHJhRGF0YSlcblxuICAgICAgaWYgKHR5cGUgPT09ICdhcHBlbmQnKSB7XG4gICAgICAgIC8vIERvbid0IGFsbG93IHRoZSBkcm9wZG93biBpY29uIHRvIGJlIGZvY3VzZWRcbiAgICAgICAgY29uc3QgaWNvbkNoaWxkID0gaWNvbi5jaGlsZHJlbiFbMF1cbiAgICAgICAgY29uc3QgaGFzTGlzdGVuZXJzID0gT2JqZWN0LmtleXMoaWNvbkNoaWxkLnByb3BzIHx8IHt9KS5zb21lKGtleSA9PiBrZXkuc3RhcnRzV2l0aCgnb24nKSlcbiAgICAgICAgaWNvbkNoaWxkLnByb3BzID0gbWVyZ2VEYXRhKGljb25DaGlsZC5wcm9wcyB8fCB7fSwge1xuICAgICAgICAgIHRhYmluZGV4OiBoYXNMaXN0ZW5lcnMgPyAnLTEnIDogdW5kZWZpbmVkLFxuICAgICAgICAgICdhcmlhLWhpZGRlbic6ICd0cnVlJyxcbiAgICAgICAgICAnYXJpYS1sYWJlbCc6IHVuZGVmaW5lZCxcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGljb25cbiAgICB9LFxuICAgIGdlbklucHV0ICgpOiBWTm9kZSB7XG4gICAgICBjb25zdCBpbnB1dCA9IFZUZXh0RmllbGQubWV0aG9kcy5nZW5JbnB1dC5jYWxsKHRoaXMpXG5cbiAgICAgIGRlbGV0ZSBpbnB1dC5wcm9wcy5uYW1lXG5cbiAgICAgIGlucHV0LnByb3BzID0gbWVyZ2VEYXRhKGlucHV0LnByb3BzLCB7XG4gICAgICAgIHJlYWRvbmx5OiB0cnVlLFxuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICdhcmlhLXJlYWRvbmx5JzogU3RyaW5nKHRoaXMuaXNSZWFkb25seSksXG4gICAgICAgICdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnOiBnZXRPYmplY3RWYWx1ZUJ5UGF0aCh0aGlzLiRyZWZzLm1lbnUsICdhY3RpdmVUaWxlLmlkJyksXG4gICAgICAgIGF1dG9jb21wbGV0ZTogZ2V0T2JqZWN0VmFsdWVCeVBhdGgoaW5wdXQuZGF0YSEsICdhdHRycy5hdXRvY29tcGxldGUnLCAnb2ZmJyksXG4gICAgICAgIHBsYWNlaG9sZGVyOiAoIXRoaXMuaXNEaXJ0eSAmJiAodGhpcy5wZXJzaXN0ZW50UGxhY2Vob2xkZXIgfHwgdGhpcy5pc0ZvY3VzZWQgfHwgIXRoaXMuaGFzTGFiZWwpKSA/IHRoaXMucGxhY2Vob2xkZXIgOiB1bmRlZmluZWQsXG4gICAgICAgIG9uS2V5cHJlc3M6IHRoaXMub25LZXlQcmVzcyxcbiAgICAgIH0pXG5cbiAgICAgIGlucHV0LnByb3BzID0geyAuLi5pbnB1dC5wcm9wcywgdmFsdWU6IG51bGwgfVxuICAgICAgaW5wdXQucHJvcHMgPSBub3JtYWxpemVBdHRycyhpbnB1dC5wcm9wcylcblxuICAgICAgcmV0dXJuIGlucHV0XG4gICAgfSxcbiAgICBnZW5IaWRkZW5JbnB1dCAoKTogVk5vZGUge1xuICAgICAgbGV0IHZhbHVlID0gdGhpcy5sYXp5VmFsdWVcblxuICAgICAgaWYgKHRoaXMubXVsdGlwbGUgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBpdGVtID09PSAnb2JqZWN0JyAmJiBpdGVtICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRWYWx1ZShpdGVtKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gaXRlbVxuICAgICAgICB9KS5qb2luKCcsJylcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUodmFsdWUpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoKCdpbnB1dCcsIHtcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIHR5cGU6ICdoaWRkZW4nLFxuICAgICAgICBuYW1lOiB0aGlzLiRhdHRycy5uYW1lLFxuICAgICAgfSlcbiAgICB9LFxuICAgIGdlbklucHV0U2xvdCAoKTogVk5vZGUge1xuICAgICAgY29uc3QgcmVuZGVyID0gVlRleHRGaWVsZC5tZXRob2RzLmdlbklucHV0U2xvdC5jYWxsKHRoaXMpXG5cbiAgICAgIHJlbmRlci5wcm9wcyA9IHtcbiAgICAgICAgcm9sZTogJ2J1dHRvbicsXG4gICAgICAgICdhcmlhLWhhc3BvcHVwJzogJ2xpc3Rib3gnLFxuICAgICAgICAnYXJpYS1leHBhbmRlZCc6IFN0cmluZyh0aGlzLmlzTWVudUFjdGl2ZSksXG4gICAgICAgICdhcmlhLW93bnMnOiB0aGlzLmNvbXB1dGVkT3ducyxcbiAgICAgICAgLi4ucmVuZGVyLnByb3BzLFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVuZGVyXG4gICAgfSxcbiAgICBnZW5MaXN0ICgpOiBWTm9kZSB7XG4gICAgICAvLyBJZiB0aGVyZSdzIG5vIHNsb3RzLCB3ZSBjYW4gdXNlIGEgY2FjaGVkIFZOb2RlIHRvIGltcHJvdmUgcGVyZm9ybWFuY2VcbiAgICAgIGlmICh0aGlzLiRzbG90c1snbm8tZGF0YSddIHx8IHRoaXMuJHNsb3RzWydwcmVwZW5kLWl0ZW0nXSB8fCB0aGlzLiRzbG90c1snYXBwZW5kLWl0ZW0nXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZW5MaXN0V2l0aFNsb3QoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGljTGlzdFxuICAgICAgfVxuICAgIH0sXG4gICAgZ2VuTGlzdFdpdGhTbG90ICgpOiBWTm9kZSB7XG4gICAgICBjb25zdCBzbG90cyA9IE9iamVjdC5mcm9tRW50cmllcyhbJ3ByZXBlbmQtaXRlbScsICduby1kYXRhJywgJ2FwcGVuZC1pdGVtJ11cbiAgICAgICAgLmZpbHRlcihzbG90TmFtZSA9PiB0aGlzLiRzbG90c1tzbG90TmFtZV0pXG4gICAgICAgIC5tYXAoc2xvdE5hbWUgPT4gW1xuICAgICAgICAgIHNsb3ROYW1lLFxuICAgICAgICAgIHRoaXMuJHNsb3RzW3Nsb3ROYW1lXSxcbiAgICAgICAgXVxuICAgICAgICApKVxuICAgICAgLy8gUmVxdWlyZXMgZGVzdHJ1Y3R1cmluZyBkdWUgdG8gVnVlXG4gICAgICAvLyBtb2RpZnlpbmcgdGhlIGBvbmAgcHJvcGVydHkgd2hlbiBwYXNzZWRcbiAgICAgIC8vIGFzIGEgcmVmZXJlbmNlZCBvYmplY3RcbiAgICAgIHJldHVybiBoKFZTZWxlY3RMaXN0LCB7XG4gICAgICAgIC4uLnRoaXMubGlzdERhdGEsXG4gICAgICAgIC4uLnRoaXMubGlzdEF0dHJzLFxuICAgICAgfSwgeyAuLi5zbG90cywgaXRlbTogdGhpcy4kc2xvdHMuaXRlbSB9KVxuICAgIH0sXG4gICAgZ2VuTWVudSAoKTogVk5vZGUge1xuICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLiRfbWVudVByb3BzIGFzIGFueVxuICAgICAgcHJvcHMuYWN0aXZhdG9yID0gdGhpcy4kcmVmc1snaW5wdXQtc2xvdCddXG5cbiAgICAgIGlmICgnYXR0YWNoJyBpbiBwcm9wcykgdm9pZCAwXG4gICAgICBlbHNlIGlmIChcbiAgICAgICAgLy8gVE9ETzogbWFrZSB0aGlzIGEgY29tcHV0ZWQgcHJvcGVydHkgb3IgaGVscGVyIG9yIHNvbWV0aGluZ1xuICAgICAgICB0aGlzLmF0dGFjaCA9PT0gJycgfHwgLy8gSWYgdXNlZCBhcyBhIGJvb2xlYW4gcHJvcCAoPHYtbWVudSBhdHRhY2g+KVxuICAgICAgICB0aGlzLmF0dGFjaCA9PT0gdHJ1ZSB8fCAvLyBJZiBib3VuZCB0byBhIGJvb2xlYW4gKDx2LW1lbnUgOmF0dGFjaD1cInRydWVcIj4pXG4gICAgICAgIHRoaXMuYXR0YWNoID09PSAnYXR0YWNoJyAvLyBJZiBib3VuZCBhcyBib29sZWFuIHByb3AgaW4gcHVnICh2LW1lbnUoYXR0YWNoKSlcbiAgICAgICkge1xuICAgICAgICAvLyBBdHRhY2ggdG8gcm9vdCBlbCBzbyB0aGF0XG4gICAgICAgIC8vIG1lbnUgY292ZXJzIHByZXBlbmQvYXBwZW5kIGljb25zXG4gICAgICAgIHByb3BzLmF0dGFjaCA9IHRoaXMuJGVsXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcm9wcy5hdHRhY2ggPSB0aGlzLmF0dGFjaFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaChWTWVudSwge1xuICAgICAgICByb2xlOiB1bmRlZmluZWQsXG4gICAgICAgIC4uLnByb3BzLFxuICAgICAgICAnb25VcGRhdGU6bW9kZWxWYWx1ZSc6ICh2YWw6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgICB0aGlzLmlzTWVudUFjdGl2ZSA9IHZhbFxuICAgICAgICAgIHRoaXMuaXNGb2N1c2VkID0gdmFsXG4gICAgICAgIH0sXG4gICAgICAgIG9uU2Nyb2xsOiB0aGlzLm9uU2Nyb2xsLFxuICAgICAgICByZWY6ICdtZW51JyxcbiAgICAgIH0sICgpID0+IFt0aGlzLmdlbkxpc3QoKV0pXG4gICAgfSxcbiAgICBnZW5TZWxlY3Rpb25zICgpOiBWTm9kZSB7XG4gICAgICBsZXQgbGVuZ3RoID0gdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aFxuXG4gICAgICBjb25zdCBjaGlsZHJlbiA9IG5ldyBBcnJheShsZW5ndGgpXG5cbiAgICAgIGxldCBnZW5TZWxlY3Rpb25cbiAgICAgIGlmICh0aGlzLiRzbG90cy5zZWxlY3Rpb24pIHtcbiAgICAgICAgZ2VuU2VsZWN0aW9uID0gdGhpcy5nZW5TbG90U2VsZWN0aW9uXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaGFzQ2hpcHMpIHtcbiAgICAgICAgZ2VuU2VsZWN0aW9uID0gdGhpcy5nZW5DaGlwU2VsZWN0aW9uXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnZW5TZWxlY3Rpb24gPSB0aGlzLmdlbkNvbW1hU2VsZWN0aW9uXG4gICAgICB9XG5cbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICBjaGlsZHJlbltsZW5ndGhdID0gZ2VuU2VsZWN0aW9uKFxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtc1tsZW5ndGhdLFxuICAgICAgICAgIGxlbmd0aCxcbiAgICAgICAgICBsZW5ndGggPT09IGNoaWxkcmVuLmxlbmd0aCAtIDFcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogJ3Ytc2VsZWN0X19zZWxlY3Rpb25zJyxcbiAgICAgIH0sIGNoaWxkcmVuKVxuICAgIH0sXG4gICAgZ2VuU2xvdFNlbGVjdGlvbiAoaXRlbTogb2JqZWN0LCBpbmRleDogbnVtYmVyKTogVk5vZGVbXSB8IHVuZGVmaW5lZCB7XG4gICAgICByZXR1cm4gdGhpcy4kc2xvdHMuc2VsZWN0aW9uISh7XG4gICAgICAgIGNsYXNzOiAndi1jaGlwLS1zZWxlY3QnLFxuICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgIGl0ZW0sXG4gICAgICAgIGluZGV4LFxuICAgICAgICBzZWxlY3Q6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBpbmRleFxuICAgICAgICB9LFxuICAgICAgICBzZWxlY3RlZDogaW5kZXggPT09IHRoaXMuc2VsZWN0ZWRJbmRleCxcbiAgICAgICAgZGlzYWJsZWQ6ICF0aGlzLmlzSW50ZXJhY3RpdmUsXG4gICAgICB9KVxuICAgIH0sXG4gICAgZ2V0TWVudUluZGV4ICgpIHtcbiAgICAgIHJldHVybiB0aGlzLiRyZWZzLm1lbnUgPyAodGhpcy4kcmVmcy5tZW51IGFzIHsgW2tleTogc3RyaW5nXTogYW55IH0pLmxpc3RJbmRleCA6IC0xXG4gICAgfSxcbiAgICBnZXREaXNhYmxlZCAoaXRlbTogb2JqZWN0KSB7XG4gICAgICByZXR1cm4gZ2V0UHJvcGVydHlGcm9tSXRlbShpdGVtLCB0aGlzLml0ZW1EaXNhYmxlZCwgZmFsc2UpXG4gICAgfSxcbiAgICBnZXRUZXh0IChpdGVtOiBvYmplY3QpIHtcbiAgICAgIHJldHVybiBnZXRQcm9wZXJ0eUZyb21JdGVtKGl0ZW0sIHRoaXMuaXRlbVRleHQsIGl0ZW0pXG4gICAgfSxcbiAgICBnZXRWYWx1ZSAoaXRlbTogb2JqZWN0KSB7XG4gICAgICByZXR1cm4gZ2V0UHJvcGVydHlGcm9tSXRlbShpdGVtLCB0aGlzLml0ZW1WYWx1ZSwgdGhpcy5nZXRUZXh0KGl0ZW0pKVxuICAgIH0sXG4gICAgb25CbHVyIChlPzogRXZlbnQpIHtcbiAgICAgIGUgJiYgdGhpcy4kZW1pdCgnYmx1cicsIGUpXG4gICAgfSxcbiAgICBvbkNoaXBJbnB1dCAoaXRlbTogb2JqZWN0KSB7XG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSkgdGhpcy5zZWxlY3RJdGVtKGl0ZW0pXG4gICAgICBlbHNlIHRoaXMuc2V0VmFsdWUobnVsbClcbiAgICAgIC8vIElmIGFsbCBpdGVtcyBoYXZlIGJlZW4gZGVsZXRlZCxcbiAgICAgIC8vIG9wZW4gYHYtbWVudWBcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuaXNNZW51QWN0aXZlID0gdHJ1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pc01lbnVBY3RpdmUgPSBmYWxzZVxuICAgICAgfVxuICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gLTFcbiAgICB9LFxuICAgIG9uQ2xpY2sgKGU6IE1vdXNlRXZlbnQpIHtcbiAgICAgIGlmICghdGhpcy5pc0ludGVyYWN0aXZlKSByZXR1cm5cblxuICAgICAgaWYgKCF0aGlzLmlzQXBwZW5kSW5uZXIoZS50YXJnZXQpKSB7XG4gICAgICAgIHRoaXMuaXNNZW51QWN0aXZlID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuaXNGb2N1c2VkKSB7XG4gICAgICAgIHRoaXMuaXNGb2N1c2VkID0gdHJ1ZVxuICAgICAgICB0aGlzLiRlbWl0KCdmb2N1cycpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuJGVtaXQoJ2NsaWNrJywgZSlcbiAgICB9LFxuICAgIG9uRXNjRG93biAoZTogRXZlbnQpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgaWYgKHRoaXMuaXNNZW51QWN0aXZlKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgdGhpcy5pc01lbnVBY3RpdmUgPSBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gICAgb25LZXlQcmVzcyAoZTogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzLm11bHRpcGxlIHx8XG4gICAgICAgICF0aGlzLmlzSW50ZXJhY3RpdmUgfHxcbiAgICAgICAgdGhpcy5kaXNhYmxlTG9va3VwIHx8XG4gICAgICAgIGUua2V5Lmxlbmd0aCA+IDEgfHxcbiAgICAgICAgZS5jdHJsS2V5IHx8IGUubWV0YUtleSB8fCBlLmFsdEtleVxuICAgICAgKSByZXR1cm5cblxuICAgICAgY29uc3QgS0VZQk9BUkRfTE9PS1VQX1RIUkVTSE9MRCA9IDEwMDAgLy8gbWlsbGlzZWNvbmRzXG4gICAgICBjb25zdCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgICAgaWYgKG5vdyAtIHRoaXMua2V5Ym9hcmRMb29rdXBMYXN0VGltZSA+IEtFWUJPQVJEX0xPT0tVUF9USFJFU0hPTEQpIHtcbiAgICAgICAgdGhpcy5rZXlib2FyZExvb2t1cFByZWZpeCA9ICcnXG4gICAgICB9XG4gICAgICB0aGlzLmtleWJvYXJkTG9va3VwUHJlZml4ICs9IGUua2V5LnRvTG93ZXJDYXNlKClcbiAgICAgIHRoaXMua2V5Ym9hcmRMb29rdXBMYXN0VGltZSA9IG5vd1xuXG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuYWxsSXRlbXMuZmluZEluZGV4KGl0ZW0gPT4ge1xuICAgICAgICBjb25zdCB0ZXh0ID0gKHRoaXMuZ2V0VGV4dChpdGVtKSA/PyAnJykudG9TdHJpbmcoKVxuXG4gICAgICAgIHJldHVybiB0ZXh0LnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aCh0aGlzLmtleWJvYXJkTG9va3VwUHJlZml4KVxuICAgICAgfSlcbiAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmFsbEl0ZW1zW2luZGV4XVxuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICB0aGlzLmxhc3RJdGVtID0gTWF0aC5tYXgodGhpcy5sYXN0SXRlbSwgaW5kZXggKyA1KVxuICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMucmV0dXJuT2JqZWN0ID8gaXRlbSA6IHRoaXMuZ2V0VmFsdWUoaXRlbSkpXG4gICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHRoaXMuJHJlZnMubWVudS5nZXRUaWxlcygpKVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2V0TWVudUluZGV4KGluZGV4KSlcbiAgICAgIH1cbiAgICB9LFxuICAgIG9uS2V5RG93biAoZTogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgaWYgKHRoaXMuaXNSZWFkb25seSAmJiBlLmtleUNvZGUgIT09IGtleUNvZGVzLnRhYikgcmV0dXJuXG5cbiAgICAgIGNvbnN0IGtleUNvZGUgPSBlLmtleUNvZGVcbiAgICAgIGNvbnN0IG1lbnUgPSB0aGlzLiRyZWZzLm1lbnVcblxuICAgICAgdGhpcy4kZW1pdCgna2V5ZG93bicsIGUpXG5cbiAgICAgIGlmICghbWVudSkgcmV0dXJuXG5cbiAgICAgIC8vIElmIG1lbnUgaXMgYWN0aXZlLCBhbGxvdyBkZWZhdWx0XG4gICAgICAvLyBsaXN0SW5kZXggY2hhbmdlIGZyb20gbWVudVxuICAgICAgaWYgKHRoaXMuaXNNZW51QWN0aXZlICYmIFtrZXlDb2Rlcy51cCwga2V5Q29kZXMuZG93biwga2V5Q29kZXMuaG9tZSwga2V5Q29kZXMuZW5kLCBrZXlDb2Rlcy5lbnRlcl0uaW5jbHVkZXMoa2V5Q29kZSkpIHtcbiAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgIG1lbnUuY2hhbmdlTGlzdEluZGV4KGUpXG4gICAgICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOmxpc3QtaW5kZXgnLCBtZW51Lmxpc3RJbmRleClcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgLy8gSWYgZW50ZXIsIHNwYWNlLCBvcGVuIG1lbnVcbiAgICAgIGlmIChbXG4gICAgICAgIGtleUNvZGVzLmVudGVyLFxuICAgICAgICBrZXlDb2Rlcy5zcGFjZSxcbiAgICAgIF0uaW5jbHVkZXMoa2V5Q29kZSkpIHRoaXMuYWN0aXZhdGVNZW51KClcblxuICAgICAgLy8gSWYgbWVudSBpcyBub3QgYWN0aXZlLCB1cC9kb3duL2hvbWUvZW5kIGNhbiBkb1xuICAgICAgLy8gb25lIG9mIDIgdGhpbmdzLiBJZiBtdWx0aXBsZSwgb3BlbnMgdGhlXG4gICAgICAvLyBtZW51LCBpZiBub3QsIHdpbGwgY3ljbGUgdGhyb3VnaCBhbGxcbiAgICAgIC8vIGF2YWlsYWJsZSBvcHRpb25zXG4gICAgICBpZiAoXG4gICAgICAgICF0aGlzLmlzTWVudUFjdGl2ZSAmJlxuICAgICAgICBba2V5Q29kZXMudXAsIGtleUNvZGVzLmRvd24sIGtleUNvZGVzLmhvbWUsIGtleUNvZGVzLmVuZF0uaW5jbHVkZXMoa2V5Q29kZSlcbiAgICAgICkgcmV0dXJuIHRoaXMub25VcERvd24oZSlcblxuICAgICAgLy8gSWYgZXNjYXBlIGRlYWN0aXZhdGUgdGhlIG1lbnVcbiAgICAgIGlmIChrZXlDb2RlID09PSBrZXlDb2Rlcy5lc2MpIHJldHVybiB0aGlzLm9uRXNjRG93bihlKVxuXG4gICAgICAvLyBJZiB0YWIgLSBzZWxlY3QgaXRlbSBvciBjbG9zZSBtZW51XG4gICAgICBpZiAoa2V5Q29kZSA9PT0ga2V5Q29kZXMudGFiKSByZXR1cm4gdGhpcy5vblRhYkRvd24oZSlcblxuICAgICAgLy8gSWYgc3BhY2UgcHJldmVudERlZmF1bHRcbiAgICAgIGlmIChrZXlDb2RlID09PSBrZXlDb2Rlcy5zcGFjZSkgcmV0dXJuIHRoaXMub25TcGFjZURvd24oZSlcbiAgICB9LFxuICAgIG9uTWVudUFjdGl2ZUNoYW5nZSAodmFsOiBib29sZWFuKSB7XG4gICAgICAvLyBJZiBtZW51IGlzIGNsb3NpbmcgYW5kIG11bGl0cGxlXG4gICAgICAvLyBvciBtZW51SW5kZXggaXMgYWxyZWFkeSBzZXRcbiAgICAgIC8vIHNraXAgbWVudSBpbmRleCByZWNhbGN1bGF0aW9uXG4gICAgICBpZiAoXG4gICAgICAgICh0aGlzLm11bHRpcGxlICYmICF2YWwpIHx8XG4gICAgICAgIHRoaXMuZ2V0TWVudUluZGV4KCkgPiAtMVxuICAgICAgKSByZXR1cm5cblxuICAgICAgY29uc3QgbWVudSA9IHRoaXMuJHJlZnMubWVudVxuXG4gICAgICBpZiAoIW1lbnUgfHwgIXRoaXMuaXNEaXJ0eSkgcmV0dXJuXG5cbiAgICAgIC8vIFdoZW4gbWVudSBvcGVucywgc2V0IGluZGV4IG9mIGZpcnN0IGFjdGl2ZSBpdGVtXG4gICAgICB0aGlzLiRyZWZzLm1lbnUuZ2V0VGlsZXMoKVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZW51LnRpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChtZW51LnRpbGVzW2ldLmdldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcpID09PSAndHJ1ZScpIHtcbiAgICAgICAgICB0aGlzLnNldE1lbnVJbmRleChpKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIG9uTW91c2VVcCAoZTogTW91c2VFdmVudCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHNvbmFyanMvbm8tY29sbGFwc2libGUtaWZcbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5oYXNNb3VzZURvd24gJiZcbiAgICAgICAgZS53aGljaCAhPT0gMyAmJlxuICAgICAgICB0aGlzLmlzSW50ZXJhY3RpdmVcbiAgICAgICkge1xuICAgICAgICAvLyBJZiBhcHBlbmQgaW5uZXIgaXMgcHJlc2VudFxuICAgICAgICAvLyBhbmQgdGhlIHRhcmdldCBpcyBpdHNlbGZcbiAgICAgICAgLy8gb3IgaW5zaWRlLCB0b2dnbGUgbWVudVxuICAgICAgICBpZiAodGhpcy5pc0FwcGVuZElubmVyKGUudGFyZ2V0KSkge1xuICAgICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+ICh0aGlzLmlzTWVudUFjdGl2ZSA9ICF0aGlzLmlzTWVudUFjdGl2ZSkpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgVlRleHRGaWVsZC5tZXRob2RzLm9uTW91c2VVcC5jYWxsKHRoaXMsIGUpXG4gICAgfSxcbiAgICBvblNjcm9sbCAoKSB7XG4gICAgICBpZiAoIXRoaXMuaXNNZW51QWN0aXZlKSB7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgY29udGVudCA9IHRoaXMuZ2V0Q29udGVudCgpXG4gICAgICAgICAgaWYgKGNvbnRlbnQpIGNvbnRlbnQuc2Nyb2xsVG9wID0gMFxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMubGFzdEl0ZW0gPiB0aGlzLmNvbXB1dGVkSXRlbXMubGVuZ3RoKSByZXR1cm5cblxuICAgICAgICBjb25zdCBzaG93TW9yZUl0ZW1zID0gKFxuICAgICAgICAgIHRoaXMuZ2V0Q29udGVudCgpLnNjcm9sbEhlaWdodCAtXG4gICAgICAgICAgKHRoaXMuZ2V0Q29udGVudCgpLnNjcm9sbFRvcCArXG4gICAgICAgICAgdGhpcy5nZXRDb250ZW50KCkuY2xpZW50SGVpZ2h0KVxuICAgICAgICApIDwgMjAwXG5cbiAgICAgICAgaWYgKHNob3dNb3JlSXRlbXMpIHtcbiAgICAgICAgICB0aGlzLmxhc3RJdGVtICs9IDIwXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIG9uU3BhY2VEb3duIChlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICB9LFxuICAgIG9uVGFiRG93biAoZTogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgY29uc3QgbWVudSA9IHRoaXMuJHJlZnMubWVudVxuXG4gICAgICBpZiAoIW1lbnUpIHJldHVyblxuXG4gICAgICBjb25zdCBhY3RpdmVUaWxlID0gbWVudS5hY3RpdmVUaWxlXG5cbiAgICAgIC8vIEFuIGl0ZW0gdGhhdCBpcyBzZWxlY3RlZCBieVxuICAgICAgLy8gbWVudS1pbmRleCBzaG91bGQgdG9nZ2xlZFxuICAgICAgaWYgKFxuICAgICAgICAhdGhpcy5tdWx0aXBsZSAmJlxuICAgICAgICBhY3RpdmVUaWxlICYmXG4gICAgICAgIHRoaXMuaXNNZW51QWN0aXZlXG4gICAgICApIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgICAgICBhY3RpdmVUaWxlLmNsaWNrKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIElmIHdlIG1ha2UgaXQgaGVyZSxcbiAgICAgICAgLy8gdGhlIHVzZXIgaGFzIG5vIHNlbGVjdGVkIGluZGV4ZXNcbiAgICAgICAgLy8gYW5kIGlzIHByb2JhYmx5IHRhYmJpbmcgb3V0XG4gICAgICAgIHRoaXMuYmx1cihlKVxuICAgICAgfVxuICAgIH0sXG4gICAgb25VcERvd24gKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgIGNvbnN0IG1lbnUgPSB0aGlzLiRyZWZzLm1lbnVcblxuICAgICAgaWYgKCFtZW51KSByZXR1cm5cblxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAgIC8vIE11bHRpcGxlIHNlbGVjdHMgZG8gbm90IGN5Y2xlIHRoZWlyIHZhbHVlXG4gICAgICAvLyB3aGVuIHByZXNzaW5nIHVwIG9yIGRvd24sIGluc3RlYWQgYWN0aXZhdGVcbiAgICAgIC8vIHRoZSBtZW51XG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSkgcmV0dXJuIHRoaXMuYWN0aXZhdGVNZW51KClcblxuICAgICAgY29uc3Qga2V5Q29kZSA9IGUua2V5Q29kZVxuXG4gICAgICAvLyBDeWNsZSB0aHJvdWdoIGF2YWlsYWJsZSB2YWx1ZXMgdG8gYWNoaWV2ZVxuICAgICAgLy8gc2VsZWN0IG5hdGl2ZSBiZWhhdmlvclxuICAgICAgbWVudS5pc0Jvb3RlZCA9IHRydWVcblxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIG1lbnUuZ2V0VGlsZXMoKVxuXG4gICAgICAgIGlmICghbWVudS5oYXNDbGlja2FibGVUaWxlcykgcmV0dXJuIHRoaXMuYWN0aXZhdGVNZW51KClcblxuICAgICAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgICAgICBjYXNlIGtleUNvZGVzLnVwOlxuICAgICAgICAgICAgbWVudS5wcmV2VGlsZSgpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2Uga2V5Q29kZXMuZG93bjpcbiAgICAgICAgICAgIG1lbnUubmV4dFRpbGUoKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlIGtleUNvZGVzLmhvbWU6XG4gICAgICAgICAgICBtZW51LmZpcnN0VGlsZSgpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2Uga2V5Q29kZXMuZW5kOlxuICAgICAgICAgICAgbWVudS5sYXN0VGlsZSgpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VsZWN0SXRlbSh0aGlzLmFsbEl0ZW1zW3RoaXMuZ2V0TWVudUluZGV4KCldKVxuICAgICAgfSlcbiAgICB9LFxuICAgIHNlbGVjdEl0ZW0gKGl0ZW06IG9iamVjdCkge1xuICAgICAgaWYgKCF0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5yZXR1cm5PYmplY3QgPyBpdGVtIDogdGhpcy5nZXRWYWx1ZShpdGVtKSlcbiAgICAgICAgdGhpcy5pc01lbnVBY3RpdmUgPSBmYWxzZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgaW50ZXJuYWxWYWx1ZSA9ICh0aGlzLmludGVybmFsVmFsdWUgfHwgW10pLnNsaWNlKClcbiAgICAgICAgY29uc3QgaSA9IHRoaXMuZmluZEV4aXN0aW5nSW5kZXgoaXRlbSlcblxuICAgICAgICBpICE9PSAtMSA/IGludGVybmFsVmFsdWUuc3BsaWNlKGksIDEpIDogaW50ZXJuYWxWYWx1ZS5wdXNoKGl0ZW0pXG4gICAgICAgIHRoaXMuc2V0VmFsdWUoaW50ZXJuYWxWYWx1ZS5tYXAoKGk6IG9iamVjdCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJldHVybk9iamVjdCA/IGkgOiB0aGlzLmdldFZhbHVlKGkpXG4gICAgICAgIH0pKVxuXG4gICAgICAgIC8vIFRoZXJlIGlzIG5vIGl0ZW0gdG8gcmUtaGlnaGxpZ2h0XG4gICAgICAgIC8vIHdoZW4gc2VsZWN0aW9ucyBhcmUgaGlkZGVuXG4gICAgICAgIGlmICh0aGlzLmhpZGVTZWxlY3RlZCkge1xuICAgICAgICAgIHRoaXMuc2V0TWVudUluZGV4KC0xKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jb21wdXRlZEl0ZW1zLmluZGV4T2YoaXRlbSlcbiAgICAgICAgICBpZiAofmluZGV4KSB7XG4gICAgICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB0aGlzLiRyZWZzLm1lbnUuZ2V0VGlsZXMoKSlcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZXRNZW51SW5kZXgoaW5kZXgpKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgc2V0TWVudUluZGV4IChpbmRleDogbnVtYmVyKSB7XG4gICAgICB0aGlzLiRyZWZzLm1lbnUgJiYgKCh0aGlzLiRyZWZzLm1lbnUgYXMgeyBba2V5OiBzdHJpbmddOiBhbnkgfSkubGlzdEluZGV4ID0gaW5kZXgpXG4gICAgfSxcbiAgICBzZXRTZWxlY3RlZEl0ZW1zICgpIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSBbXVxuICAgICAgY29uc3QgdmFsdWVzID0gIXRoaXMubXVsdGlwbGUgfHwgIUFycmF5LmlzQXJyYXkodGhpcy5pbnRlcm5hbFZhbHVlKVxuICAgICAgICA/IFt0aGlzLmludGVybmFsVmFsdWVdXG4gICAgICAgIDogdGhpcy5pbnRlcm5hbFZhbHVlXG5cbiAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5hbGxJdGVtcy5maW5kSW5kZXgodiA9PiB0aGlzLnZhbHVlQ29tcGFyYXRvcihcbiAgICAgICAgICB0aGlzLmdldFZhbHVlKHYpLFxuICAgICAgICAgIHRoaXMuZ2V0VmFsdWUodmFsdWUpXG4gICAgICAgICkpXG5cbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICBzZWxlY3RlZEl0ZW1zLnB1c2godGhpcy5hbGxJdGVtc1tpbmRleF0pXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gc2VsZWN0ZWRJdGVtc1xuICAgIH0sXG4gICAgc2V0VmFsdWUgKHZhbHVlOiBhbnkpIHtcbiAgICAgIGlmICghdGhpcy52YWx1ZUNvbXBhcmF0b3IodmFsdWUsIHRoaXMuaW50ZXJuYWxWYWx1ZSkpIHtcbiAgICAgICAgdGhpcy5pbnRlcm5hbFZhbHVlID0gdmFsdWVcbiAgICAgIH1cbiAgICB9LFxuICAgIGlzQXBwZW5kSW5uZXIgKHRhcmdldDogYW55KSB7XG4gICAgICAvLyByZXR1cm4gdHJ1ZSBpZiBhcHBlbmQgaW5uZXIgaXMgcHJlc2VudFxuICAgICAgLy8gYW5kIHRoZSB0YXJnZXQgaXMgaXRzZWxmIG9yIGluc2lkZVxuICAgICAgY29uc3QgYXBwZW5kSW5uZXIgPSB0aGlzLiRyZWZzWydhcHBlbmQtaW5uZXInXVxuXG4gICAgICByZXR1cm4gYXBwZW5kSW5uZXIgJiYgKGFwcGVuZElubmVyID09PSB0YXJnZXQgfHwgYXBwZW5kSW5uZXIuY29udGFpbnModGFyZ2V0KSlcbiAgICB9LFxuICB9LFxufSlcbiJdfQ==