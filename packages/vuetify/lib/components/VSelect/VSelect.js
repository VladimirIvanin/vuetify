// Styles
import "../../../src/components/VTextField/VTextField.sass";
import "../../../src/components/VSelect/VSelect.sass"; // Components

import VChip from '../VChip';
import VMenu from '../VMenu';
import VSelectList from './VSelectList'; // Extensions

import VInput from '../VInput';
import VTextField from '../VTextField/VTextField'; // Mixins

import Comparable from '../../mixins/comparable';
import Dependent from '../../mixins/dependent';
import Filterable from '../../mixins/filterable'; // Directives

import ClickOutside from '../../directives/click-outside'; // Utilities

import mergeData from '../../util/mergeData';
import { getPropertyFromItem, getObjectValueByPath, keyCodes, normalizeAttrs } from '../../util/helpers';
import { consoleError, breaking } from '../../util/console'; // Types

import mixins from '../../util/mixins';
import { withDirectives, h } from 'vue';
export const defaultMenuProps = {
  closeOnClick: false,
  closeOnContentClick: false,
  disableKeys: true,
  openOnClick: false,
  maxHeight: 304
}; // Types

const baseMixins = mixins(VTextField, Comparable, Dependent, Filterable);
/* @vue/component */

export default baseMixins.extend({
  name: 'v-select',
  props: {
    appendIcon: {
      type: String,
      default: '$dropdown'
    },
    attach: {
      type: null,
      default: false
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
      default: () => []
    },
    itemColor: {
      type: String,
      default: 'primary'
    },
    itemDisabled: {
      type: [String, Array, Function],
      default: 'disabled'
    },
    itemText: {
      type: [String, Array, Function],
      default: 'text'
    },
    itemValue: {
      type: [String, Array, Function],
      default: 'value'
    },
    menuProps: {
      type: [String, Array, Object],
      default: () => defaultMenuProps
    },
    minWidth: [String, Number],
    multiple: Boolean,
    openOnClear: Boolean,
    returnObject: Boolean,
    smallChips: Boolean
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
      lazyValue: this.modelValue !== undefined ? this.modelValue : this.multiple ? [] : undefined,
      selectedIndex: -1,
      selectedItems: [],
      keyboardLookupPrefix: '',
      keyboardLookupLastTime: 0,
      detectedScopeId: null
    };
  },

  computed: {
    /* All items that the select has */
    allItems() {
      return this.filterDuplicates(this.cachedItems.concat(this.items));
    },

    classes() {
      return { ...VTextField.computed.classes.call(this),
        'v-select': true,
        'v-select--chips': this.hasChips,
        'v-select--chips--small': this.smallChips,
        'v-select--is-menu-active': this.isMenuActive,
        'v-select--is-multi': this.multiple
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

      const value = this.multiple ? this.selectedItems : ((_a = this.getText(this.selectedItems[0])) !== null && _a !== void 0 ? _a : '').toString();

      if (typeof this.counterValue === 'function') {
        return this.counterValue(value);
      }

      return value.length;
    },

    directives() {
      return [[ClickOutside, {
        handler: () => this.isFocused && this.blur(),
        closeConditional: this.closeConditional,
        include: () => this.getOpenDependentElements()
      }]];
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
        onSelect: this.selectItem
      };
    },

    listAttrs() {
      const scopeIdAttrs = {}; // Используем detectedScopeId из mounted hook

      if (this.detectedScopeId) {
        scopeIdAttrs[this.detectedScopeId] = '';
      } // scopeId успешно передается в VSelectList


      return scopeIdAttrs;
    },

    staticList() {
      if (this.$slots['no-data'] || this.$slots['prepend-item'] || this.$slots['append-item']) {
        consoleError('assert: staticList should not be called if slots are used');
      }

      return h(VSelectList, { ...this.listData,
        ...this.listAttrs
      }, {
        item: this.$slots.item
      });
    },

    virtualizedItems() {
      return this.$_menuProps.auto ? this.computedItems : this.computedItems.slice(0, this.lastItem);
    },

    menuCanShow: () => true,

    $_menuProps() {
      let normalisedProps = typeof this.menuProps === 'string' ? this.menuProps.split(',') : this.menuProps;

      if (Array.isArray(normalisedProps)) {
        normalisedProps = normalisedProps.reduce((acc, p) => {
          acc[p.trim()] = true;
          return acc;
        }, {});
      }

      return { ...defaultMenuProps,
        eager: this.eager,
        modelValue: this.menuCanShow && this.isMenuActive,
        nudgeBottom: normalisedProps.offsetY ? 1 : 0,
        auto: this.auto,
        minWidth: this.minWidth,
        ...normalisedProps
      };
    }

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

      deep: true
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
      }

    }
  },

  created() {
    const breakingProps = [['value', 'modelValue'], ['onInput', 'onUpdate:modelValue']];
    /* istanbul ignore next */

    breakingProps.forEach(([original, replacement]) => {
      if (this.$attrs.hasOwnProperty(original)) breaking(original, replacement, this);
    });
  },

  mounted() {
    this.$nextTick(() => {
      if (this.$el && this.$el.attributes) {
        const attrs = this.$el.attributes;

        for (let i = 0; i < attrs.length; i++) {
          const attr = attrs[i];

          if (attr.name.startsWith('data-v-')) {
            this.detectedScopeId = attr.name; // scopeId найден и сохранен для использования в dropdown

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
      if (!this.isInteractive || this.isMenuActive) return;
      this.isMenuActive = true;
    },

    clearableCallback() {
      this.setValue(this.multiple ? [] : null);
      this.setMenuIndex(-1);
      this.$nextTick(() => this.$refs.input && this.$refs.input.focus());
      if (this.openOnClear) this.isMenuActive = true;
    },

    closeConditional(e) {
      if (!this.isMenuActive) return true;
      return !this._isDestroyed && ( // Click originates from outside the menu content
      // Multiple selects don't close when an item is clicked
      !this.getContent() || !this.getContent().contains(e.target)) && // Click originates from outside the element
      this.$el && !this.$el.contains(e.target) && e.target !== this.$el;
    },

    filterDuplicates(arr) {
      const uniqueValues = new Map();

      for (let index = 0; index < arr.length; ++index) {
        const item = arr[index]; // Do not return null values if existant (#14421)

        if (item == null) {
          continue;
        } // Do not deduplicate headers or dividers (#12517)


        if (item.header || item.divider) {
          uniqueValues.set(item, item);
          continue;
        }

        const val = this.getValue(item); // TODO: comparator

        !uniqueValues.has(val) && uniqueValues.set(val, item);
      }

      return Array.from(uniqueValues.values());
    },

    findExistingIndex(item) {
      const itemValue = this.getValue(item);
      return (this.internalValue || []).findIndex(i => this.valueComparator(this.getValue(i), itemValue));
    },

    getContent() {
      return this.$refs.menu && this.$refs.menu.$refs.content;
    },

    genChipSelection(item, index) {
      const isDisabled = this.isDisabled || this.getDisabled(item);
      const isInteractive = !isDisabled && this.isInteractive;
      return h(VChip, {
        class: 'v-chip--select',
        tabindex: -1,
        close: this.deletableChips && isInteractive,
        disabled: isDisabled,
        modelValue: index === this.selectedIndex,
        small: this.smallChips,
        onClick: e => {
          if (!isInteractive) return;
          e.stopPropagation();
          this.selectedIndex = index;
        },
        'onClick:close': () => this.onChipInput(item),
        key: JSON.stringify(this.getValue(item))
      }, () => this.getText(item));
    },

    genCommaSelection(item, index, last) {
      const color = index === this.selectedIndex && this.computedColor;
      const isDisabled = this.isDisabled || this.getDisabled(item);
      return h('div', this.setTextColor(color, {
        class: ['v-select__selection v-select__selection--comma', {
          'v-select__selection--disabled': isDisabled
        }],
        key: JSON.stringify(this.getValue(item))
      }), `${this.getText(item)}${last ? '' : ', '}`);
    },

    genDefaultSlot() {
      const selections = this.genSelections();
      const input = this.genInput(); // If the return is an empty array
      // push the input

      if (Array.isArray(selections)) {
        selections.push(input); // Otherwise push it into children
      } else {
        selections.children = selections.children || [];
        selections.children.push(input);
      }

      return [this.genFieldset(), withDirectives(h('div', {
        class: 'v-select__slot'
      }, [this.genLabel(), this.prefix ? this.genAffix('prefix') : null, selections, this.suffix ? this.genAffix('suffix') : null, this.genClearIcon(), this.genIconSlot(), this.genHiddenInput()]), this.directives), this.genMenu(), this.genProgress()];
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
          'aria-label': undefined
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
        placeholder: !this.isDirty && (this.persistentPlaceholder || this.isFocused || !this.hasLabel) ? this.placeholder : undefined,
        onKeypress: this.onKeyPress
      });
      input.props = { ...input.props,
        value: null
      };
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
      } else if (typeof value === 'object' && value !== null) {
        value = this.getValue(value);
      }

      return h('input', {
        value,
        type: 'hidden',
        name: this.$attrs.name
      });
    },

    genInputSlot() {
      const render = VTextField.methods.genInputSlot.call(this);
      render.props = {
        role: 'button',
        'aria-haspopup': 'listbox',
        'aria-expanded': String(this.isMenuActive),
        'aria-owns': this.computedOwns,
        ...render.props
      };
      return render;
    },

    genList() {
      // If there's no slots, we can use a cached VNode to improve performance
      if (this.$slots['no-data'] || this.$slots['prepend-item'] || this.$slots['append-item']) {
        return this.genListWithSlot();
      } else {
        return this.staticList;
      }
    },

    genListWithSlot() {
      const slots = Object.fromEntries(['prepend-item', 'no-data', 'append-item'].filter(slotName => this.$slots[slotName]).map(slotName => [slotName, this.$slots[slotName]])); // Requires destructuring due to Vue
      // modifying the `on` property when passed
      // as a referenced object

      return h(VSelectList, { ...this.listData,
        ...this.listAttrs
      }, { ...slots,
        item: this.$slots.item
      });
    },

    genMenu() {
      const props = this.$_menuProps;
      props.activator = this.$refs['input-slot'];
      if ('attach' in props) void 0;else if ( // TODO: make this a computed property or helper or something
      this.attach === '' || // If used as a boolean prop (<v-menu attach>)
      this.attach === true || // If bound to a boolean (<v-menu :attach="true">)
      this.attach === 'attach' // If bound as boolean prop in pug (v-menu(attach))
      ) {
        // Attach to root el so that
        // menu covers prepend/append icons
        props.attach = this.$el;
      } else {
        props.attach = this.attach;
      }
      return h(VMenu, {
        role: undefined,
        ...props,
        'onUpdate:modelValue': val => {
          this.isMenuActive = val;
          this.isFocused = val;
        },
        onScroll: this.onScroll,
        ref: 'menu'
      }, () => [this.genList()]);
    },

    genSelections() {
      let length = this.selectedItems.length;
      const children = new Array(length);
      let genSelection;

      if (this.$slots.selection) {
        genSelection = this.genSlotSelection;
      } else if (this.hasChips) {
        genSelection = this.genChipSelection;
      } else {
        genSelection = this.genCommaSelection;
      }

      while (length--) {
        children[length] = genSelection(this.selectedItems[length], length, length === children.length - 1);
      }

      return h('div', {
        class: 'v-select__selections'
      }, children);
    },

    genSlotSelection(item, index) {
      return this.$slots.selection({
        class: 'v-chip--select',
        parent: this,
        item,
        index,
        select: e => {
          e.stopPropagation();
          this.selectedIndex = index;
        },
        selected: index === this.selectedIndex,
        disabled: !this.isInteractive
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
      if (this.multiple) this.selectItem(item);else this.setValue(null); // If all items have been deleted,
      // open `v-menu`

      if (this.selectedItems.length === 0) {
        this.isMenuActive = true;
      } else {
        this.isMenuActive = false;
      }

      this.selectedIndex = -1;
    },

    onClick(e) {
      if (!this.isInteractive) return;

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
      if (this.multiple || !this.isInteractive || this.disableLookup || e.key.length > 1 || e.ctrlKey || e.metaKey || e.altKey) return;
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
      if (this.isReadonly && e.keyCode !== keyCodes.tab) return;
      const keyCode = e.keyCode;
      const menu = this.$refs.menu;
      this.$emit('keydown', e);
      if (!menu) return; // If menu is active, allow default
      // listIndex change from menu

      if (this.isMenuActive && [keyCodes.up, keyCodes.down, keyCodes.home, keyCodes.end, keyCodes.enter].includes(keyCode)) {
        this.$nextTick(() => {
          menu.changeListIndex(e);
          this.$emit('update:list-index', menu.listIndex);
        });
      } // If enter, space, open menu


      if ([keyCodes.enter, keyCodes.space].includes(keyCode)) this.activateMenu(); // If menu is not active, up/down/home/end can do
      // one of 2 things. If multiple, opens the
      // menu, if not, will cycle through all
      // available options

      if (!this.isMenuActive && [keyCodes.up, keyCodes.down, keyCodes.home, keyCodes.end].includes(keyCode)) return this.onUpDown(e); // If escape deactivate the menu

      if (keyCode === keyCodes.esc) return this.onEscDown(e); // If tab - select item or close menu

      if (keyCode === keyCodes.tab) return this.onTabDown(e); // If space preventDefault

      if (keyCode === keyCodes.space) return this.onSpaceDown(e);
    },

    onMenuActiveChange(val) {
      // If menu is closing and mulitple
      // or menuIndex is already set
      // skip menu index recalculation
      if (this.multiple && !val || this.getMenuIndex() > -1) return;
      const menu = this.$refs.menu;
      if (!menu || !this.isDirty) return; // When menu opens, set index of first active item

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
      if (this.hasMouseDown && e.which !== 3 && this.isInteractive) {
        // If append inner is present
        // and the target is itself
        // or inside, toggle menu
        if (this.isAppendInner(e.target)) {
          this.$nextTick(() => this.isMenuActive = !this.isMenuActive);
        }
      }

      VTextField.methods.onMouseUp.call(this, e);
    },

    onScroll() {
      if (!this.isMenuActive) {
        requestAnimationFrame(() => {
          const content = this.getContent();
          if (content) content.scrollTop = 0;
        });
      } else {
        if (this.lastItem > this.computedItems.length) return;
        const showMoreItems = this.getContent().scrollHeight - (this.getContent().scrollTop + this.getContent().clientHeight) < 200;

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
      if (!menu) return;
      const activeTile = menu.activeTile; // An item that is selected by
      // menu-index should toggled

      if (!this.multiple && activeTile && this.isMenuActive) {
        e.preventDefault();
        e.stopPropagation();
        activeTile.click();
      } else {
        // If we make it here,
        // the user has no selected indexes
        // and is probably tabbing out
        this.blur(e);
      }
    },

    onUpDown(e) {
      const menu = this.$refs.menu;
      if (!menu) return;
      e.preventDefault(); // Multiple selects do not cycle their value
      // when pressing up or down, instead activate
      // the menu

      if (this.multiple) return this.activateMenu();
      const keyCode = e.keyCode; // Cycle through available values to achieve
      // select native behavior

      menu.isBooted = true;
      window.requestAnimationFrame(() => {
        menu.getTiles();
        if (!menu.hasClickableTiles) return this.activateMenu();

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
      } else {
        const internalValue = (this.internalValue || []).slice();
        const i = this.findExistingIndex(item);
        i !== -1 ? internalValue.splice(i, 1) : internalValue.push(item);
        this.setValue(internalValue.map(i => {
          return this.returnObject ? i : this.getValue(i);
        })); // There is no item to re-highlight
        // when selections are hidden

        if (this.hideSelected) {
          this.setMenuIndex(-1);
        } else {
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
      const values = !this.multiple || !Array.isArray(this.internalValue) ? [this.internalValue] : this.internalValue;

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
    }

  }
});
//# sourceMappingURL=VSelect.js.map