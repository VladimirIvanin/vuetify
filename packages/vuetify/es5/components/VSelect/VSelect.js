"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.defaultMenuProps = void 0;

require("../../../src/components/VTextField/VTextField.sass");

require("../../../src/components/VSelect/VSelect.sass");

var _VChip = _interopRequireDefault(require("../VChip"));

var _VMenu = _interopRequireDefault(require("../VMenu"));

var _VSelectList = _interopRequireDefault(require("./VSelectList"));

var _VInput = _interopRequireDefault(require("../VInput"));

var _VTextField2 = _interopRequireDefault(require("../VTextField/VTextField"));

var _comparable = _interopRequireDefault(require("../../mixins/comparable"));

var _dependent = _interopRequireDefault(require("../../mixins/dependent"));

var _filterable = _interopRequireDefault(require("../../mixins/filterable"));

var _clickOutside = _interopRequireDefault(require("../../directives/click-outside"));

var _mergeData = _interopRequireDefault(require("../../util/mergeData"));

var _helpers = require("../../util/helpers");

var _console = require("../../util/console");

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _vue = require("vue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultMenuProps = {
  closeOnClick: false,
  closeOnContentClick: false,
  disableKeys: true,
  openOnClick: false,
  maxHeight: 304
}; // Types

exports.defaultMenuProps = defaultMenuProps;
var baseMixins = (0, _mixins.default)(_VTextField2.default, _comparable.default, _dependent.default, _filterable.default);
/* @vue/component */

var _default2 = baseMixins.extend({
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
      default: function _default() {
        return [];
      }
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
      default: function _default() {
        return defaultMenuProps;
      }
    },
    minWidth: [String, Number],
    multiple: Boolean,
    openOnClear: Boolean,
    returnObject: Boolean,
    smallChips: Boolean
  },
  emits: ['update:modelValue', 'change', 'focus', 'blur', 'keydown', 'click', 'update:list-index'],
  data: function data() {
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
    allItems: function allItems() {
      return this.filterDuplicates(this.cachedItems.concat(this.items));
    },
    classes: function classes() {
      return _objectSpread(_objectSpread({}, _VTextField2.default.computed.classes.call(this)), {}, {
        'v-select': true,
        'v-select--chips': this.hasChips,
        'v-select--chips--small': this.smallChips,
        'v-select--is-menu-active': this.isMenuActive,
        'v-select--is-multi': this.multiple
      });
    },

    /* Used by other components to overwrite */
    computedItems: function computedItems() {
      return this.allItems;
    },
    computedOwns: function computedOwns() {
      var _a;

      return "list-".concat((_a = this.$) === null || _a === void 0 ? void 0 : _a.uid);
    },
    computedCounterValue: function computedCounterValue() {
      var _a;

      var value = this.multiple ? this.selectedItems : ((_a = this.getText(this.selectedItems[0])) !== null && _a !== void 0 ? _a : '').toString();

      if (typeof this.counterValue === 'function') {
        return this.counterValue(value);
      }

      return value.length;
    },
    directives: function directives() {
      var _this = this;

      return [[_clickOutside.default, {
        handler: function handler() {
          return _this.isFocused && _this.blur();
        },
        closeConditional: this.closeConditional,
        include: function include() {
          return _this.getOpenDependentElements();
        }
      }]];
    },
    dynamicHeight: function dynamicHeight() {
      return 'auto';
    },
    hasChips: function hasChips() {
      return this.chips || this.smallChips;
    },
    hasSlot: function hasSlot() {
      return Boolean(this.hasChips || this.$slots.selection);
    },
    isDirty: function isDirty() {
      return this.selectedItems.length > 0;
    },
    listData: function listData() {
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
    listAttrs: function listAttrs() {
      var scopeIdAttrs = {}; // Используем detectedScopeId из mounted hook

      if (this.detectedScopeId) {
        scopeIdAttrs[this.detectedScopeId] = '';
      } // scopeId успешно передается в VSelectList


      return scopeIdAttrs;
    },
    staticList: function staticList() {
      if (this.$slots['no-data'] || this.$slots['prepend-item'] || this.$slots['append-item']) {
        (0, _console.consoleError)('assert: staticList should not be called if slots are used');
      }

      return (0, _vue.h)(_VSelectList.default, _objectSpread(_objectSpread({}, this.listData), this.listAttrs), {
        item: this.$slots.item
      });
    },
    virtualizedItems: function virtualizedItems() {
      return this.$_menuProps.auto ? this.computedItems : this.computedItems.slice(0, this.lastItem);
    },
    menuCanShow: function menuCanShow() {
      return true;
    },
    $_menuProps: function $_menuProps() {
      var normalisedProps = typeof this.menuProps === 'string' ? this.menuProps.split(',') : this.menuProps;

      if (Array.isArray(normalisedProps)) {
        normalisedProps = normalisedProps.reduce(function (acc, p) {
          acc[p.trim()] = true;
          return acc;
        }, {});
      }

      return _objectSpread(_objectSpread({}, defaultMenuProps), {}, {
        eager: this.eager,
        modelValue: this.menuCanShow && this.isMenuActive,
        nudgeBottom: normalisedProps.offsetY ? 1 : 0,
        auto: this.auto,
        minWidth: this.minWidth
      }, normalisedProps);
    }
  },
  watch: {
    internalValue: {
      handler: function handler(val) {
        var _this2 = this;

        this.initialValue = val;
        this.setSelectedItems();

        if (this.multiple) {
          this.$nextTick(function () {
            var _a;

            (_a = _this2.$refs.menu) === null || _a === void 0 ? void 0 : _a.updateDimensions();
          });
        }

        if (this.hideSelected) {
          this.$nextTick(function () {
            _this2.onScroll();
          });
        }
      },
      deep: true
    },
    isMenuActive: function isMenuActive(val) {
      var _this3 = this;

      window.setTimeout(function () {
        return _this3.onMenuActiveChange(val);
      });
    },
    items: {
      immediate: true,
      handler: function handler(val) {
        var _this4 = this;

        if (this.cacheItems) {
          // Breaks vue-test-utils if
          // this isn't calculated
          // on the next tick
          this.$nextTick(function () {
            _this4.cachedItems = _this4.filterDuplicates(_this4.cachedItems.concat(val));
          });
        }

        this.setSelectedItems();
      }
    }
  },
  created: function created() {
    var _this5 = this;

    var breakingProps = [['value', 'modelValue'], ['onInput', 'onUpdate:modelValue']];
    /* istanbul ignore next */

    breakingProps.forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          original = _ref2[0],
          replacement = _ref2[1];

      if (_this5.$attrs.hasOwnProperty(original)) (0, _console.breaking)(original, replacement, _this5);
    });
  },
  mounted: function mounted() {
    var _this6 = this;

    this.$nextTick(function () {
      if (_this6.$el && _this6.$el.attributes) {
        var attrs = _this6.$el.attributes;

        for (var i = 0; i < attrs.length; i++) {
          var attr = attrs[i];

          if (attr.name.startsWith('data-v-')) {
            _this6.detectedScopeId = attr.name; // scopeId найден и сохранен для использования в dropdown

            break;
          }
        }
      }
    });
  },
  methods: {
    /** @public */
    blur: function blur(e) {
      _VTextField2.default.methods.blur.call(this, e);

      this.isMenuActive = false;
      this.isFocused = false;
      this.selectedIndex = -1;
      this.setMenuIndex(-1);
    },

    /** @public */
    activateMenu: function activateMenu() {
      if (!this.isInteractive || this.isMenuActive) return;
      this.isMenuActive = true;
    },
    clearableCallback: function clearableCallback() {
      var _this7 = this;

      this.setValue(this.multiple ? [] : null);
      this.setMenuIndex(-1);
      this.$nextTick(function () {
        return _this7.$refs.input && _this7.$refs.input.focus();
      });
      if (this.openOnClear) this.isMenuActive = true;
    },
    closeConditional: function closeConditional(e) {
      if (!this.isMenuActive) return true;
      return !this._isDestroyed && ( // Click originates from outside the menu content
      // Multiple selects don't close when an item is clicked
      !this.getContent() || !this.getContent().contains(e.target)) && // Click originates from outside the element
      this.$el && !this.$el.contains(e.target) && e.target !== this.$el;
    },
    filterDuplicates: function filterDuplicates(arr) {
      var uniqueValues = new Map();

      for (var index = 0; index < arr.length; ++index) {
        var item = arr[index]; // Do not return null values if existant (#14421)

        if (item == null) {
          continue;
        } // Do not deduplicate headers or dividers (#12517)


        if (item.header || item.divider) {
          uniqueValues.set(item, item);
          continue;
        }

        var val = this.getValue(item); // TODO: comparator

        !uniqueValues.has(val) && uniqueValues.set(val, item);
      }

      return Array.from(uniqueValues.values());
    },
    findExistingIndex: function findExistingIndex(item) {
      var _this8 = this;

      var itemValue = this.getValue(item);
      return (this.internalValue || []).findIndex(function (i) {
        return _this8.valueComparator(_this8.getValue(i), itemValue);
      });
    },
    getContent: function getContent() {
      return this.$refs.menu && this.$refs.menu.$refs.content;
    },
    genChipSelection: function genChipSelection(item, index) {
      var _this9 = this;

      var isDisabled = this.isDisabled || this.getDisabled(item);
      var isInteractive = !isDisabled && this.isInteractive;
      return (0, _vue.h)(_VChip.default, {
        class: 'v-chip--select',
        tabindex: -1,
        close: this.deletableChips && isInteractive,
        disabled: isDisabled,
        modelValue: index === this.selectedIndex,
        small: this.smallChips,
        onClick: function onClick(e) {
          if (!isInteractive) return;
          e.stopPropagation();
          _this9.selectedIndex = index;
        },
        'onClick:close': function onClickClose() {
          return _this9.onChipInput(item);
        },
        key: JSON.stringify(this.getValue(item))
      }, function () {
        return _this9.getText(item);
      });
    },
    genCommaSelection: function genCommaSelection(item, index, last) {
      var color = index === this.selectedIndex && this.computedColor;
      var isDisabled = this.isDisabled || this.getDisabled(item);
      return (0, _vue.h)('div', this.setTextColor(color, {
        class: ['v-select__selection v-select__selection--comma', {
          'v-select__selection--disabled': isDisabled
        }],
        key: JSON.stringify(this.getValue(item))
      }), "".concat(this.getText(item)).concat(last ? '' : ', '));
    },
    genDefaultSlot: function genDefaultSlot() {
      var selections = this.genSelections();
      var input = this.genInput(); // If the return is an empty array
      // push the input

      if (Array.isArray(selections)) {
        selections.push(input); // Otherwise push it into children
      } else {
        selections.children = selections.children || [];
        selections.children.push(input);
      }

      return [this.genFieldset(), (0, _vue.withDirectives)((0, _vue.h)('div', {
        class: 'v-select__slot'
      }, [this.genLabel(), this.prefix ? this.genAffix('prefix') : null, selections, this.suffix ? this.genAffix('suffix') : null, this.genClearIcon(), this.genIconSlot(), this.genHiddenInput()]), this.directives), this.genMenu(), this.genProgress()];
    },
    genIcon: function genIcon(type, cb, extraData) {
      var icon = _VInput.default.methods.genIcon.call(this, type, cb, extraData);

      if (type === 'append') {
        // Don't allow the dropdown icon to be focused
        var iconChild = icon.children[0];
        var hasListeners = Object.keys(iconChild.props || {}).some(function (key) {
          return key.startsWith('on');
        });
        iconChild.props = (0, _mergeData.default)(iconChild.props || {}, {
          tabindex: hasListeners ? '-1' : undefined,
          'aria-hidden': 'true',
          'aria-label': undefined
        });
      }

      return icon;
    },
    genInput: function genInput() {
      var input = _VTextField2.default.methods.genInput.call(this);

      delete input.props.name;
      input.props = (0, _mergeData.default)(input.props, {
        readonly: true,
        type: 'text',
        'aria-readonly': String(this.isReadonly),
        'aria-activedescendant': (0, _helpers.getObjectValueByPath)(this.$refs.menu, 'activeTile.id'),
        autocomplete: (0, _helpers.getObjectValueByPath)(input.data, 'attrs.autocomplete', 'off'),
        placeholder: !this.isDirty && (this.persistentPlaceholder || this.isFocused || !this.hasLabel) ? this.placeholder : undefined,
        onKeypress: this.onKeyPress
      });
      input.props = _objectSpread(_objectSpread({}, input.props), {}, {
        value: null
      });
      input.props = (0, _helpers.normalizeAttrs)(input.props);
      return input;
    },
    genHiddenInput: function genHiddenInput() {
      var _this10 = this;

      var value = this.lazyValue;

      if (this.multiple && Array.isArray(value)) {
        value = value.map(function (item) {
          if (_typeof(item) === 'object' && item !== null) {
            return _this10.getValue(item);
          }

          return item;
        }).join(',');
      } else if (_typeof(value) === 'object' && value !== null) {
        value = this.getValue(value);
      }

      return (0, _vue.h)('input', {
        value: value,
        type: 'hidden',
        name: this.$attrs.name
      });
    },
    genInputSlot: function genInputSlot() {
      var render = _VTextField2.default.methods.genInputSlot.call(this);

      render.props = _objectSpread({
        role: 'button',
        'aria-haspopup': 'listbox',
        'aria-expanded': String(this.isMenuActive),
        'aria-owns': this.computedOwns
      }, render.props);
      return render;
    },
    genList: function genList() {
      // If there's no slots, we can use a cached VNode to improve performance
      if (this.$slots['no-data'] || this.$slots['prepend-item'] || this.$slots['append-item']) {
        return this.genListWithSlot();
      } else {
        return this.staticList;
      }
    },
    genListWithSlot: function genListWithSlot() {
      var _this11 = this;

      var slots = Object.fromEntries(['prepend-item', 'no-data', 'append-item'].filter(function (slotName) {
        return _this11.$slots[slotName];
      }).map(function (slotName) {
        return [slotName, _this11.$slots[slotName]];
      })); // Requires destructuring due to Vue
      // modifying the `on` property when passed
      // as a referenced object

      return (0, _vue.h)(_VSelectList.default, _objectSpread(_objectSpread({}, this.listData), this.listAttrs), _objectSpread(_objectSpread({}, slots), {}, {
        item: this.$slots.item
      }));
    },
    genMenu: function genMenu() {
      var _this12 = this;

      var props = this.$_menuProps;
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
      return (0, _vue.h)(_VMenu.default, _objectSpread(_objectSpread({
        role: undefined
      }, props), {}, {
        'onUpdate:modelValue': function onUpdateModelValue(val) {
          _this12.isMenuActive = val;
          _this12.isFocused = val;
        },
        onScroll: this.onScroll,
        ref: 'menu'
      }), function () {
        return [_this12.genList()];
      });
    },
    genSelections: function genSelections() {
      var length = this.selectedItems.length;
      var children = new Array(length);
      var genSelection;

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

      return (0, _vue.h)('div', {
        class: 'v-select__selections'
      }, children);
    },
    genSlotSelection: function genSlotSelection(item, index) {
      var _this13 = this;

      return this.$slots.selection({
        class: 'v-chip--select',
        parent: this,
        item: item,
        index: index,
        select: function select(e) {
          e.stopPropagation();
          _this13.selectedIndex = index;
        },
        selected: index === this.selectedIndex,
        disabled: !this.isInteractive
      });
    },
    getMenuIndex: function getMenuIndex() {
      return this.$refs.menu ? this.$refs.menu.listIndex : -1;
    },
    getDisabled: function getDisabled(item) {
      return (0, _helpers.getPropertyFromItem)(item, this.itemDisabled, false);
    },
    getText: function getText(item) {
      return (0, _helpers.getPropertyFromItem)(item, this.itemText, item);
    },
    getValue: function getValue(item) {
      return (0, _helpers.getPropertyFromItem)(item, this.itemValue, this.getText(item));
    },
    onBlur: function onBlur(e) {
      e && this.$emit('blur', e);
    },
    onChipInput: function onChipInput(item) {
      if (this.multiple) this.selectItem(item);else this.setValue(null); // If all items have been deleted,
      // open `v-menu`

      if (this.selectedItems.length === 0) {
        this.isMenuActive = true;
      } else {
        this.isMenuActive = false;
      }

      this.selectedIndex = -1;
    },
    onClick: function onClick(e) {
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
    onEscDown: function onEscDown(e) {
      e.preventDefault();

      if (this.isMenuActive) {
        e.stopPropagation();
        this.isMenuActive = false;
      }
    },
    onKeyPress: function onKeyPress(e) {
      var _this14 = this;

      if (this.multiple || !this.isInteractive || this.disableLookup || e.key.length > 1 || e.ctrlKey || e.metaKey || e.altKey) return;
      var KEYBOARD_LOOKUP_THRESHOLD = 1000; // milliseconds

      var now = performance.now();

      if (now - this.keyboardLookupLastTime > KEYBOARD_LOOKUP_THRESHOLD) {
        this.keyboardLookupPrefix = '';
      }

      this.keyboardLookupPrefix += e.key.toLowerCase();
      this.keyboardLookupLastTime = now;
      var index = this.allItems.findIndex(function (item) {
        var _a;

        var text = ((_a = _this14.getText(item)) !== null && _a !== void 0 ? _a : '').toString();
        return text.toLowerCase().startsWith(_this14.keyboardLookupPrefix);
      });
      var item = this.allItems[index];

      if (index !== -1) {
        this.lastItem = Math.max(this.lastItem, index + 5);
        this.setValue(this.returnObject ? item : this.getValue(item));
        this.$nextTick(function () {
          return _this14.$refs.menu.getTiles();
        });
        setTimeout(function () {
          return _this14.setMenuIndex(index);
        });
      }
    },
    onKeyDown: function onKeyDown(e) {
      var _this15 = this;

      if (this.isReadonly && e.keyCode !== _helpers.keyCodes.tab) return;
      var keyCode = e.keyCode;
      var menu = this.$refs.menu;
      this.$emit('keydown', e);
      if (!menu) return; // If menu is active, allow default
      // listIndex change from menu

      if (this.isMenuActive && [_helpers.keyCodes.up, _helpers.keyCodes.down, _helpers.keyCodes.home, _helpers.keyCodes.end, _helpers.keyCodes.enter].includes(keyCode)) {
        this.$nextTick(function () {
          menu.changeListIndex(e);

          _this15.$emit('update:list-index', menu.listIndex);
        });
      } // If enter, space, open menu


      if ([_helpers.keyCodes.enter, _helpers.keyCodes.space].includes(keyCode)) this.activateMenu(); // If menu is not active, up/down/home/end can do
      // one of 2 things. If multiple, opens the
      // menu, if not, will cycle through all
      // available options

      if (!this.isMenuActive && [_helpers.keyCodes.up, _helpers.keyCodes.down, _helpers.keyCodes.home, _helpers.keyCodes.end].includes(keyCode)) return this.onUpDown(e); // If escape deactivate the menu

      if (keyCode === _helpers.keyCodes.esc) return this.onEscDown(e); // If tab - select item or close menu

      if (keyCode === _helpers.keyCodes.tab) return this.onTabDown(e); // If space preventDefault

      if (keyCode === _helpers.keyCodes.space) return this.onSpaceDown(e);
    },
    onMenuActiveChange: function onMenuActiveChange(val) {
      // If menu is closing and mulitple
      // or menuIndex is already set
      // skip menu index recalculation
      if (this.multiple && !val || this.getMenuIndex() > -1) return;
      var menu = this.$refs.menu;
      if (!menu || !this.isDirty) return; // When menu opens, set index of first active item

      this.$refs.menu.getTiles();

      for (var i = 0; i < menu.tiles.length; i++) {
        if (menu.tiles[i].getAttribute('aria-selected') === 'true') {
          this.setMenuIndex(i);
          break;
        }
      }
    },
    onMouseUp: function onMouseUp(e) {
      var _this16 = this;

      // eslint-disable-next-line sonarjs/no-collapsible-if
      if (this.hasMouseDown && e.which !== 3 && this.isInteractive) {
        // If append inner is present
        // and the target is itself
        // or inside, toggle menu
        if (this.isAppendInner(e.target)) {
          this.$nextTick(function () {
            return _this16.isMenuActive = !_this16.isMenuActive;
          });
        }
      }

      _VTextField2.default.methods.onMouseUp.call(this, e);
    },
    onScroll: function onScroll() {
      var _this17 = this;

      if (!this.isMenuActive) {
        requestAnimationFrame(function () {
          var content = _this17.getContent();

          if (content) content.scrollTop = 0;
        });
      } else {
        if (this.lastItem > this.computedItems.length) return;
        var showMoreItems = this.getContent().scrollHeight - (this.getContent().scrollTop + this.getContent().clientHeight) < 200;

        if (showMoreItems) {
          this.lastItem += 20;
        }
      }
    },
    onSpaceDown: function onSpaceDown(e) {
      e.preventDefault();
    },
    onTabDown: function onTabDown(e) {
      var menu = this.$refs.menu;
      if (!menu) return;
      var activeTile = menu.activeTile; // An item that is selected by
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
    onUpDown: function onUpDown(e) {
      var _this18 = this;

      var menu = this.$refs.menu;
      if (!menu) return;
      e.preventDefault(); // Multiple selects do not cycle their value
      // when pressing up or down, instead activate
      // the menu

      if (this.multiple) return this.activateMenu();
      var keyCode = e.keyCode; // Cycle through available values to achieve
      // select native behavior

      menu.isBooted = true;
      window.requestAnimationFrame(function () {
        menu.getTiles();
        if (!menu.hasClickableTiles) return _this18.activateMenu();

        switch (keyCode) {
          case _helpers.keyCodes.up:
            menu.prevTile();
            break;

          case _helpers.keyCodes.down:
            menu.nextTile();
            break;

          case _helpers.keyCodes.home:
            menu.firstTile();
            break;

          case _helpers.keyCodes.end:
            menu.lastTile();
            break;
        }

        _this18.selectItem(_this18.allItems[_this18.getMenuIndex()]);
      });
    },
    selectItem: function selectItem(item) {
      var _this19 = this;

      if (!this.multiple) {
        this.setValue(this.returnObject ? item : this.getValue(item));
        this.isMenuActive = false;
      } else {
        var internalValue = (this.internalValue || []).slice();
        var i = this.findExistingIndex(item);
        i !== -1 ? internalValue.splice(i, 1) : internalValue.push(item);
        this.setValue(internalValue.map(function (i) {
          return _this19.returnObject ? i : _this19.getValue(i);
        })); // There is no item to re-highlight
        // when selections are hidden

        if (this.hideSelected) {
          this.setMenuIndex(-1);
        } else {
          var index = this.computedItems.indexOf(item);

          if (~index) {
            this.$nextTick(function () {
              return _this19.$refs.menu.getTiles();
            });
            setTimeout(function () {
              return _this19.setMenuIndex(index);
            });
          }
        }
      }
    },
    setMenuIndex: function setMenuIndex(index) {
      this.$refs.menu && (this.$refs.menu.listIndex = index);
    },
    setSelectedItems: function setSelectedItems() {
      var _this20 = this;

      var selectedItems = [];
      var values = !this.multiple || !Array.isArray(this.internalValue) ? [this.internalValue] : this.internalValue;

      var _iterator = _createForOfIteratorHelper(values),
          _step;

      try {
        var _loop = function _loop() {
          var value = _step.value;

          var index = _this20.allItems.findIndex(function (v) {
            return _this20.valueComparator(_this20.getValue(v), _this20.getValue(value));
          });

          if (index > -1) {
            selectedItems.push(_this20.allItems[index]);
          }
        };

        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.selectedItems = selectedItems;
    },
    setValue: function setValue(value) {
      if (!this.valueComparator(value, this.internalValue)) {
        this.internalValue = value;
      }
    },
    isAppendInner: function isAppendInner(target) {
      // return true if append inner is present
      // and the target is itself or inside
      var appendInner = this.$refs['append-inner'];
      return appendInner && (appendInner === target || appendInner.contains(target));
    }
  }
});

exports.default = _default2;
//# sourceMappingURL=VSelect.js.map