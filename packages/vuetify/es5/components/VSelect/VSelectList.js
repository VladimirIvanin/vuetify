"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _VSimpleCheckbox = _interopRequireDefault(require("../VCheckbox/VSimpleCheckbox"));

var _VDivider = _interopRequireDefault(require("../VDivider"));

var _VSubheader = _interopRequireDefault(require("../VSubheader"));

var _VList = require("../VList");

var _colorable = _interopRequireDefault(require("../../mixins/colorable"));

var _themeable = _interopRequireDefault(require("../../mixins/themeable"));

var _helpers = require("../../util/helpers");

var _console = require("../../util/console");

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _vue = require("vue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/* @vue/component */
var _default2 = (0, _mixins.default)(_colorable.default, _themeable.default).extend({
  name: 'v-select-list',
  props: {
    action: Boolean,
    dense: Boolean,
    hideSelected: Boolean,
    items: {
      type: Array,
      default: function _default() {
        return [];
      }
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
    noDataText: String,
    noFilter: Boolean,
    searchInput: null,
    selectedItems: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  },
  computed: {
    parsedItems: function parsedItems() {
      var _this = this;

      return this.selectedItems.map(function (item) {
        return _this.getValue(item);
      });
    },
    tileActiveClass: function tileActiveClass() {
      return Object.keys(this.setTextColor(this.color).class || {}).join(' ');
    },
    staticNoDataTile: function staticNoDataTile() {
      var tile = {
        role: undefined,
        onMousedown: function onMousedown(e) {
          return e.preventDefault();
        } // Prevent onBlur from being called

      };
      return (0, _vue.h)(_VList.VListItem, tile, [this.genTileContent(this.noDataText)]);
    }
  },
  created: function created() {
    var _this2 = this;

    var breakingProps = [['value', 'modelValue'], ['onInput', 'onUpdate:modelValue']];
    /* istanbul ignore next */

    breakingProps.forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          original = _ref2[0],
          replacement = _ref2[1];

      if (_this2.$attrs.hasOwnProperty(original)) (0, _console.breaking)(original, replacement, _this2);
    });
  },
  methods: {
    genAction: function genAction(item, inputValue) {
      var _this3 = this;

      return (0, _vue.h)(_VList.VListItemAction, {}, function () {
        return [(0, _vue.h)(_VSimpleCheckbox.default, {
          color: _this3.color,
          modelValue: inputValue,
          ripple: false,
          'onUpdate:modelValue': function onUpdateModelValue() {
            return _this3.$emit('select', item);
          }
        })];
      });
    },
    genDivider: function genDivider(props) {
      return (0, _vue.h)(_VDivider.default, props);
    },
    genFilteredText: function genFilteredText(text) {
      text = text || '';
      if (!this.searchInput || this.noFilter) return text;

      var _this$getMaskedCharac = this.getMaskedCharacters(text),
          start = _this$getMaskedCharac.start,
          middle = _this$getMaskedCharac.middle,
          end = _this$getMaskedCharac.end;

      return [start, this.genHighlight(middle), end];
    },
    genHeader: function genHeader(props) {
      return (0, _vue.h)(_VSubheader.default, props, props.header);
    },
    genHighlight: function genHighlight(text) {
      return (0, _vue.h)('span', {
        class: 'v-list-item__mask'
      }, text);
    },
    getMaskedCharacters: function getMaskedCharacters(text) {
      var searchInput = (this.searchInput || '').toString().toLocaleLowerCase();
      var index = text.toLocaleLowerCase().indexOf(searchInput);
      if (index < 0) return {
        start: text,
        middle: '',
        end: ''
      };
      var start = text.slice(0, index);
      var middle = text.slice(index, index + searchInput.length);
      var end = text.slice(index + searchInput.length);
      return {
        start: start,
        middle: middle,
        end: end
      };
    },
    genTile: function genTile(_ref3) {
      var _this4 = this;

      var item = _ref3.item,
          index = _ref3.index,
          _ref3$disabled = _ref3.disabled,
          disabled = _ref3$disabled === void 0 ? null : _ref3$disabled,
          _ref3$value = _ref3.value,
          value = _ref3$value === void 0 ? false : _ref3$value;
      if (!value) value = this.hasItem(item);

      if (item === Object(item)) {
        disabled = disabled !== null ? disabled : this.getDisabled(item);
      }

      var tile = _objectSpread({
        // Default behavior in list does not
        // contain aria-selected by default
        'aria-selected': String(value),
        id: "list-item-".concat(this.$.uid, "-").concat(index),
        role: 'option',
        onMousedown: function onMousedown(e) {
          // Prevent onBlur from being called
          e.preventDefault();
        },
        onClick: function onClick() {
          return disabled || _this4.$emit('select', item);
        },
        activeClass: this.tileActiveClass,
        disabled: disabled,
        ripple: true,
        modelValue: value
      }, Object.keys(this.$attrs).reduce(function (acc, key) {
        if (key.startsWith('data-v-')) {
          acc[key] = _this4.$attrs[key];
        }

        return acc;
      }, {}));

      if (!this.$slots.item) {
        return (0, _vue.h)(_VList.VListItem, tile, [this.action && !this.hideSelected && this.items.length > 0 ? this.genAction(item, value) : null, this.genTileContent(item, index)]);
      }

      var parent = this;

      var onClick = tile.onClick,
          onMousedown = tile.onMousedown,
          attrsWithoutEvents = _objectWithoutProperties(tile, ["onClick", "onMousedown"]);

      var scopedSlot = this.$slots.item({
        parent: parent,
        item: item,
        active: value,
        attrs: tile,
        on: {
          onMousedown: onMousedown,
          onClick: onClick
        }
      });
      return this.needsTile(scopedSlot) ? (0, _vue.h)(_VList.VListItem, tile, scopedSlot) : scopedSlot;
    },
    genTileContent: function genTileContent(item) {
      var _this5 = this;

      var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      return (0, _vue.h)(_VList.VListItemContent, {}, function () {
        return [(0, _vue.h)(_VList.VListItemTitle, {}, function () {
          return [_this5.genFilteredText(_this5.getText(item))];
        })];
      });
    },
    hasItem: function hasItem(item) {
      return this.parsedItems.indexOf(this.getValue(item)) > -1;
    },
    needsTile: function needsTile(slot) {
      var _ref4 = slot !== null && slot !== void 0 ? slot : [],
          _ref5 = _slicedToArray(_ref4, 1),
          vnode = _ref5[0];

      if (!(slot === null || slot === void 0 ? void 0 : slot.length) || slot.length !== 1) return true;

      var _ref6 = vnode !== null && vnode !== void 0 ? vnode : {},
          type = _ref6.type;

      var isComponent = type && _typeof(type) === 'object';
      var isVListItem = isComponent && 'name' in type && type.name === 'v-list-item';
      return !isVListItem;
    },
    getDisabled: function getDisabled(item) {
      return Boolean((0, _helpers.getPropertyFromItem)(item, this.itemDisabled, false));
    },
    getText: function getText(item) {
      return String((0, _helpers.getPropertyFromItem)(item, this.itemText, item));
    },
    getValue: function getValue(item) {
      return (0, _helpers.getPropertyFromItem)(item, this.itemValue, this.getText(item));
    }
  },
  render: function render() {
    var _a, _b;

    var children = [];
    var itemsLength = this.items.length;

    for (var index = 0; index < itemsLength; index++) {
      var item = this.items[index];
      if (this.hideSelected && this.hasItem(item)) continue;
      if (item == null) children.push(this.genTile({
        item: item,
        index: index
      }));else if (item.header) children.push(this.genHeader(item));else if (item.divider) children.push(this.genDivider(item));else children.push(this.genTile({
        item: item,
        index: index
      }));
    }

    children.length || children.push(((_b = (_a = this.$slots)['no-data']) === null || _b === void 0 ? void 0 : _b.call(_a)) || this.staticNoDataTile);
    this.$slots['prepend-item'] && children.unshift(this.$slots['prepend-item']());
    this.$slots['append-item'] && children.push(this.$slots['append-item']());
    return (0, _vue.h)(_VList.VList, _objectSpread(_objectSpread({}, this.$attrs), {}, {
      class: ['v-select-list', this.themeClasses],
      role: 'listbox',
      tabindex: -1,
      onMousedown: function onMousedown(e) {
        e.preventDefault();
      },
      dense: this.dense
    }), children);
  }
});

exports.default = _default2;
//# sourceMappingURL=VSelectList.js.map