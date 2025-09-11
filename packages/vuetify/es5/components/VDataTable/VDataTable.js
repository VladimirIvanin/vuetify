"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../../../src/components/VDataTable/VDataTable.sass");

var _vue = require("vue");

var _VData = require("../VData");

var _VDataIterator = require("../VDataIterator");

var _VBtn = _interopRequireDefault(require("../VBtn"));

var _VDataTableHeader = _interopRequireDefault(require("./VDataTableHeader"));

var _VIcon = _interopRequireDefault(require("../VIcon"));

var _Row = _interopRequireDefault(require("./Row"));

var _RowGroup = _interopRequireDefault(require("./RowGroup"));

var _VSimpleCheckbox = _interopRequireDefault(require("../VCheckbox/VSimpleCheckbox"));

var _VSimpleTable = _interopRequireDefault(require("./VSimpleTable"));

var _MobileRow = _interopRequireDefault(require("./MobileRow"));

var _loadable = _interopRequireDefault(require("../../mixins/loadable"));

var _mouse = _interopRequireDefault(require("../../mixins/mouse"));

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _helpers = require("../../util/helpers");

var _console = require("../../util/console");

var _mergeData = require("../../util/mergeData");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function filterFn(item, search, filter) {
  return function (header) {
    var value = (0, _helpers.getObjectValueByPath)(item, header.value);
    return header.filter ? header.filter(value, search, item) : filter(value, search, item);
  };
}

function searchTableItems(items, search, headersWithCustomFilters, headersWithoutCustomFilters, customFilter, filterMode) {
  search = typeof search === 'string' ? search.trim() : null;

  if (filterMode === 'union') {
    // If the `search` property is empty and there are no custom filters in use, there is nothing to do.
    if (!(search && headersWithoutCustomFilters.length) && !headersWithCustomFilters.length) return items;
    return items.filter(function (item) {
      // Headers with custom filters are evaluated whether or not a search term has been provided.
      if (headersWithCustomFilters.length && headersWithCustomFilters.every(filterFn(item, search, _helpers.defaultFilter))) {
        return true;
      } // Otherwise, the `search` property is used to filter columns without a custom filter.


      return search && headersWithoutCustomFilters.some(filterFn(item, search, customFilter));
    });
  } else if (filterMode === 'intersection') {
    return items.filter(function (item) {
      // Headers with custom filters are evaluated whether or not a search term has been provided.
      // We need to match every filter to be included in the results.
      var matchesColumnFilters = headersWithCustomFilters.every(filterFn(item, search, _helpers.defaultFilter)); // Headers without custom filters are only filtered by the `search` property if it is defined.
      // We only need a single column to match the search term to be included in the results.

      var matchesSearchTerm = !search || headersWithoutCustomFilters.some(filterFn(item, search, customFilter));
      return matchesColumnFilters && matchesSearchTerm;
    });
  } else {
    return items;
  }
}
/* @vue/component */


var _default2 = (0, _mixins.default)(_VDataIterator.VDataIterator, _loadable.default, _mouse.default).extend({
  name: 'v-data-table',
  emits: ['click:row', 'update:options', 'update:page', 'update:items-per-page', 'update:sort-by', 'update:sort-desc', 'update:group-by', 'update:group-desc', 'pagination', 'current-items', 'page-count', 'click', 'mousedown', 'mouseup', 'touchstart', 'touchend'],
  props: {
    headers: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    showSelect: Boolean,
    checkboxColor: String,
    color: String,
    showExpand: Boolean,
    showGroupBy: Boolean,
    // TODO: Fix
    // virtualRows: Boolean,
    height: [Number, String],
    hideDefaultHeader: Boolean,
    caption: String,
    dense: Boolean,
    headerProps: Object,
    calculateWidths: Boolean,
    fixedHeader: Boolean,
    headersLength: Number,
    expandIcon: {
      type: String,
      default: '$expand'
    },
    customFilter: {
      type: Function,
      default: _helpers.defaultFilter
    },
    filterMode: {
      type: String,
      default: 'intersection'
    },
    itemClass: {
      type: [String, Function],
      default: function _default() {
        return '';
      }
    },
    itemStyle: {
      type: [String, Function],
      default: function _default() {
        return '';
      }
    },
    loaderHeight: {
      type: [Number, String],
      default: 4
    }
  },
  data: function data() {
    return {
      internalGroupBy: [],
      openCache: {},
      widths: []
    };
  },
  computed: {
    computedHeaders: function computedHeaders() {
      var _this = this;

      if (!this.headers) return [];
      var headers = this.headers.filter(function (h) {
        return h.value === undefined || !_this.internalGroupBy.find(function (v) {
          return v === h.value;
        });
      });
      var defaultHeader = {
        text: '',
        sortable: false,
        width: '1px'
      };

      if (this.showSelect) {
        var index = headers.findIndex(function (h) {
          return h.value === 'data-table-select';
        });
        if (index < 0) headers.unshift(_objectSpread(_objectSpread({}, defaultHeader), {}, {
          value: 'data-table-select'
        }));else headers.splice(index, 1, _objectSpread(_objectSpread({}, defaultHeader), headers[index]));
      }

      if (this.showExpand) {
        var _index = headers.findIndex(function (h) {
          return h.value === 'data-table-expand';
        });

        if (_index < 0) headers.unshift(_objectSpread(_objectSpread({}, defaultHeader), {}, {
          value: 'data-table-expand'
        }));else headers.splice(_index, 1, _objectSpread(_objectSpread({}, defaultHeader), headers[_index]));
      }

      return headers;
    },
    colspanAttrs: function colspanAttrs() {
      return this.isMobile ? undefined : {
        colspan: this.headersLength || this.computedHeaders.length
      };
    },
    columnSorters: function columnSorters() {
      return this.computedHeaders.reduce(function (acc, header) {
        if (header.sort) acc[header.value] = header.sort;
        return acc;
      }, {});
    },
    headersWithCustomFilters: function headersWithCustomFilters() {
      return this.headers.filter(function (header) {
        return header.filter && (!header.hasOwnProperty('filterable') || header.filterable === true);
      });
    },
    headersWithoutCustomFilters: function headersWithoutCustomFilters() {
      return this.headers.filter(function (header) {
        return !header.filter && (!header.hasOwnProperty('filterable') || header.filterable === true);
      });
    },
    sanitizedHeaderProps: function sanitizedHeaderProps() {
      return (0, _helpers.camelizeObjectKeys)(this.headerProps);
    },
    computedItemsPerPage: function computedItemsPerPage() {
      var itemsPerPage = this.options && this.options.itemsPerPage ? this.options.itemsPerPage : this.itemsPerPage;
      var itemsPerPageOptions = this.sanitizedFooterProps.itemsPerPageOptions;

      if (itemsPerPageOptions && !itemsPerPageOptions.find(function (item) {
        return typeof item === 'number' ? item === itemsPerPage : item.value === itemsPerPage;
      })) {
        var firstOption = itemsPerPageOptions[0];
        return _typeof(firstOption) === 'object' ? firstOption.value : firstOption;
      }

      return itemsPerPage;
    },
    groupByText: function groupByText() {
      var _this2 = this;

      var _a, _b, _c;

      return (_c = (_b = (_a = this.headers) === null || _a === void 0 ? void 0 : _a.find(function (header) {
        var _a;

        return header.value === ((_a = _this2.internalGroupBy) === null || _a === void 0 ? void 0 : _a[0]);
      })) === null || _b === void 0 ? void 0 : _b.text) !== null && _c !== void 0 ? _c : '';
    }
  },
  created: function created() {
    var _this3 = this;

    var breakingProps = [['sort-icon', 'header-props.sort-icon'], ['hide-headers', 'hide-default-header'], ['select-all', 'show-select']];
    /* istanbul ignore next */

    breakingProps.forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          original = _ref2[0],
          replacement = _ref2[1];

      if (_this3.$attrs.hasOwnProperty(original)) (0, _console.breaking)(original, replacement, _this3);
    });
  },
  mounted: function mounted() {
    // if ((!this.sortBy || !this.sortBy.length) && (!this.options.sortBy || !this.options.sortBy.length)) {
    //   const firstSortable = this.headers.find(h => !('sortable' in h) || !!h.sortable)
    //   if (firstSortable) this.updateOptions({ sortBy: [firstSortable.value], sortDesc: [false] })
    // }
    if (this.calculateWidths) {
      window.addEventListener('resize', this.calcWidths);
      this.calcWidths();
    }
  },
  beforeUnmount: function beforeUnmount() {
    if (this.calculateWidths) {
      window.removeEventListener('resize', this.calcWidths);
    }
  },
  methods: {
    calcWidths: function calcWidths() {
      this.widths = Array.from(this.$el.querySelectorAll('th')).map(function (e) {
        return e.clientWidth;
      });
    },
    customFilterWithColumns: function customFilterWithColumns(items, search) {
      return searchTableItems(items, search, this.headersWithCustomFilters, this.headersWithoutCustomFilters, this.customFilter, this.filterMode);
    },
    customSortWithHeaders: function customSortWithHeaders(items, sortBy, sortDesc, locale) {
      return this.customSort(items, sortBy, sortDesc, locale, this.columnSorters);
    },
    createItemProps: function createItemProps(item, index) {
      var _this4 = this;

      var data = _objectSpread(_objectSpread({}, _VDataIterator.VDataIterator.methods.createItemProps.call(this, item, index)), {}, {
        headers: this.computedHeaders
      });

      return _objectSpread(_objectSpread(_objectSpread({}, data), {}, {
        class: {
          'v-data-table__selected': data.isSelected
        }
      }, this.getDefaultMouseEventHandlers(':row', function () {
        return data;
      }, true)), {}, {
        // TODO: the first argument should be the event, and the second argument should be data,
        // but this is a breaking change so it's for v3
        onClick: function onClick(event) {
          return _this4.$emit('click:row', item, data, event);
        }
      });
    },
    genCaption: function genCaption(props) {
      if (this.caption) return [(0, _vue.h)('caption', [this.caption])];
      return (0, _helpers.getSlot)(this, 'caption', props, true);
    },
    genColgroup: function genColgroup(props) {
      return (0, _vue.h)('colgroup', this.computedHeaders.map(function (header) {
        return (0, _vue.h)('col', {
          class: {
            divider: header.divider
          }
        });
      }));
    },
    genLoading: function genLoading() {
      var th = (0, _vue.h)('th', _objectSpread({
        class: 'column'
      }, this.colspanAttrs), [this.genProgress()]);
      var tr = (0, _vue.h)('tr', {
        class: 'v-data-table__progress'
      }, [th]);
      return (0, _vue.h)('thead', [tr]);
    },
    genHeaders: function genHeaders(props) {
      var data = _objectSpread(_objectSpread({}, this.sanitizedHeaderProps), {}, {
        headers: this.computedHeaders,
        options: props.options,
        mobile: this.isMobile,
        showGroupBy: this.showGroupBy,
        checkboxColor: this.checkboxColor,
        someItems: this.someItems,
        everyItem: this.everyItem,
        singleSelect: this.singleSelect,
        disableSort: this.disableSort,
        onSort: props.sort,
        onGroup: props.group,
        'onToggle-select-all': this.toggleSelectAll
      }); // TODO: rename to 'head'? (thead, tbody, tfoot)


      var children = [(0, _helpers.getSlot)(this, 'header', _objectSpread(_objectSpread({}, data), {}, {
        isMobile: this.isMobile
      }))];

      if (!this.hideDefaultHeader) {
        var scopedSlots = (0, _helpers.getPrefixedScopedSlots)('header.', this.$slots);
        children.push((0, _vue.h)(_VDataTableHeader.default, _objectSpread({}, data), scopedSlots));
      }

      if (this.loading) children.push(this.genLoading());
      return children;
    },
    genEmptyWrapper: function genEmptyWrapper(content) {
      return (0, _vue.h)('tr', {
        class: 'v-data-table__empty-wrapper'
      }, [(0, _vue.h)('td', _objectSpread({}, this.colspanAttrs), content)]);
    },
    genItems: function genItems(items, props) {
      var empty = this.genEmpty(props.originalItemsLength, props.pagination.itemsLength);
      if (empty) return [empty];
      return props.groupedItems ? this.genGroupedRows(props.groupedItems, props) : this.genRows(items, props);
    },
    genGroupedRows: function genGroupedRows(groupedItems, props) {
      var _this5 = this;

      return groupedItems.map(function (group) {
        if (!_this5.openCache.hasOwnProperty(group.name)) _this5.openCache[group.name] = true;

        if (_this5.$slots.group) {
          return _this5.$slots.group({
            group: group.name,
            options: props.options,
            isMobile: _this5.isMobile,
            items: group.items,
            headers: _this5.computedHeaders
          });
        } else {
          return _this5.genDefaultGroupedRow(group.name, group.items, props);
        }
      });
    },
    genDefaultGroupedRow: function genDefaultGroupedRow(group, items, props) {
      var _this6 = this;

      var isOpen = !!this.openCache[group];
      var children = [(0, _vue.h)('template', {
        slot: 'row.content'
      }, this.genRows(items, props))];

      var toggleFn = function toggleFn() {
        return _this6.openCache[group] = !_this6.openCache[group];
      };

      var removeFn = function removeFn() {
        return props.updateOptions({
          groupBy: [],
          groupDesc: []
        });
      };

      if (this.$slots['group.header']) {
        children.unshift((0, _vue.h)('template', {
          slot: 'column.header'
        }, [this.$slots['group.header']({
          group: group,
          groupBy: props.groupBy,
          isMobile: this.isMobile,
          items: items,
          headers: this.computedHeaders,
          isOpen: isOpen,
          toggle: toggleFn,
          remove: removeFn
        })]));
      } else {
        var toggle = (0, _vue.h)(_VBtn.default, {
          class: 'ma-0',
          icon: true,
          small: true,
          onClick: toggleFn
        }, function () {
          return [(0, _vue.h)(_VIcon.default, {}, function () {
            return [isOpen ? '$minus' : '$plus'];
          })];
        });
        var remove = (0, _vue.h)(_VBtn.default, {
          class: 'ma-0',
          icon: true,
          small: true,
          onClick: removeFn
        }, function () {
          return [(0, _vue.h)(_VIcon.default, {}, function () {
            return ['$close'];
          })];
        });
        var column = (0, _vue.h)('td', _objectSpread({
          class: 'text-start'
        }, this.colspanAttrs), [toggle, "".concat(this.groupByText, ": ").concat(group), remove]);
        children.unshift((0, _vue.h)('template', {
          slot: 'column.header'
        }, [column]));
      }

      if (this.$slots['group.summary']) {
        children.push((0, _vue.h)('template', {
          slot: 'column.summary'
        }, [this.$slots['group.summary']({
          group: group,
          groupBy: props.groupBy,
          isMobile: this.isMobile,
          items: items,
          headers: this.computedHeaders,
          isOpen: isOpen,
          toggle: toggleFn
        })]));
      }

      return (0, _vue.h)(_RowGroup.default, {
        key: group,
        modelValue: isOpen
      }, children);
    },
    genRows: function genRows(items, props) {
      return this.$slots.item ? this.genScopedRows(items, props) : this.genDefaultRows(items, props);
    },
    genScopedRows: function genScopedRows(items, props) {
      var rows = [];

      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        rows.push(this.$slots.item(_objectSpread(_objectSpread({}, this.createItemProps(item, i)), {}, {
          isMobile: this.isMobile
        })));

        if (this.isExpanded(item)) {
          rows.push(this.$slots['expanded-item']({
            headers: this.computedHeaders,
            isMobile: this.isMobile,
            index: i,
            item: item
          }));
        }
      }

      return rows;
    },
    genDefaultRows: function genDefaultRows(items, props) {
      var _this7 = this;

      return this.$slots['expanded-item'] ? items.map(function (item, index) {
        return _this7.genDefaultExpandedRow(item, index);
      }) : items.map(function (item, index) {
        return _this7.genDefaultSimpleRow(item, index);
      });
    },
    genDefaultExpandedRow: function genDefaultExpandedRow(item, index) {
      var isExpanded = this.isExpanded(item);
      var classes = {
        'v-data-table__expanded v-data-table__expanded__row': isExpanded
      };
      var headerRow = this.genDefaultSimpleRow(item, index, classes);
      var expandedRow = (0, _vue.h)('tr', {
        class: 'v-data-table__expanded v-data-table__expanded__content'
      }, [this.$slots['expanded-item']({
        headers: this.computedHeaders,
        isMobile: this.isMobile,
        item: item
      })]);
      return (0, _vue.h)(_RowGroup.default, {
        modelValue: isExpanded
      }, [(0, _vue.h)('template', {
        slot: 'row.header'
      }, [headerRow]), (0, _vue.h)('template', {
        slot: 'row.content'
      }, [expandedRow])]);
    },
    genDefaultSimpleRow: function genDefaultSimpleRow(item, index) {
      var _this8 = this;

      var classes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var scopedSlots = (0, _helpers.getPrefixedScopedSlots)('item.', this.$slots);
      var data = this.createItemProps(item, index);

      if (this.showSelect) {
        var slot = scopedSlots['data-table-select'];
        scopedSlots['data-table-select'] = slot ? function () {
          return slot(_objectSpread(_objectSpread({}, data), {}, {
            isMobile: _this8.isMobile
          }));
        } : function () {
          var _a;

          return (0, _vue.h)(_VSimpleCheckbox.default, {
            class: 'v-data-table__checkbox',
            modelValue: data.isSelected,
            disabled: !_this8.isSelectable(item),
            color: (_a = _this8.checkboxColor) !== null && _a !== void 0 ? _a : '',
            'onUpdate:modelValue': function onUpdateModelValue(val) {
              return data.select(val);
            }
          });
        };
      }

      if (this.showExpand) {
        var _slot = scopedSlots['data-table-expand'];
        scopedSlots['data-table-expand'] = _slot ? function () {
          return _slot(data);
        } : function () {
          return (0, _vue.h)(_VIcon.default, {
            class: ['v-data-table__expand-icon', {
              'v-data-table__expand-icon--active': data.isExpanded
            }],
            onClick: function onClick(e) {
              e.stopPropagation();
              data.expand(!data.isExpanded);
            }
          }, function () {
            return [_this8.expandIcon];
          });
        };
      }

      return (0, _vue.h)(this.isMobile ? _MobileRow.default : _Row.default, _objectSpread({
        key: (0, _helpers.getObjectValueByPath)(item, this.itemKey),
        class: (0, _mergeData.mergeClasses)(_objectSpread(_objectSpread({}, classes), {}, {
          'v-data-table__selected': data.isSelected
        }), (0, _helpers.getPropertyFromItem)(item, this.itemClass)),
        style: (0, _mergeData.mergeStyles)({}, (0, _helpers.getPropertyFromItem)(item, this.itemStyle)),
        headers: this.computedHeaders,
        hideDefaultHeader: this.hideDefaultHeader,
        index: index,
        item: item,
        rtl: this.$vuetify.rtl
      }, data.on), scopedSlots);
    },
    genBody: function genBody(props) {
      var data = _objectSpread(_objectSpread({}, props), {}, {
        expand: this.expand,
        headers: this.computedHeaders,
        isExpanded: this.isExpanded,
        isMobile: this.isMobile,
        isSelected: this.isSelected,
        select: this.select
      });

      if (this.$slots.body) {
        return this.$slots.body(data);
      }

      return (0, _vue.h)('tbody', [(0, _helpers.getSlot)(this, 'body.prepend', data, true), this.genItems(props.items, props), (0, _helpers.getSlot)(this, 'body.append', data, true)]);
    },
    genFoot: function genFoot(props) {
      var _a, _b;

      return (_b = (_a = this.$slots).foot) === null || _b === void 0 ? void 0 : _b.call(_a, props);
    },
    genFooters: function genFooters(props) {
      var data = _objectSpread(_objectSpread({
        options: props.options,
        pagination: props.pagination,
        itemsPerPageText: '$vuetify.dataTable.itemsPerPageText'
      }, this.sanitizedFooterProps), {}, {
        'onUpdate:options': function onUpdateOptions(value) {
          return props.updateOptions(value);
        }
      });

      var children = [(0, _helpers.getSlot)(this, 'footer', _objectSpread(_objectSpread({}, data), {}, {
        widths: this.widths,
        headers: this.computedHeaders
      }), true)];

      if (!this.hideDefaultFooter) {
        children.push((0, _vue.h)(_VDataIterator.VDataFooter, _objectSpread({}, data), (0, _helpers.getPrefixedScopedSlots)('footer.', this.$slots)));
      }

      return children;
    },
    genDefaultScopedSlot: function genDefaultScopedSlot(props) {
      var _this9 = this;

      var simpleProps = {
        height: this.height,
        fixedHeader: this.fixedHeader,
        dense: this.dense
      }; // if (this.virtualRows) {
      //   return h(VVirtualTable, {
      //     props: Object.assign(simpleProps, {
      //       items: props.items,
      //       height: this.height,
      //       rowHeight: this.dense ? 24 : 48,
      //       headerHeight: this.dense ? 32 : 48,
      //       // TODO: expose rest of props from virtual table?
      //     }),
      //     scopedSlots: {
      //       items: ({ items }) => this.genItems(items, props) as any,
      //     },
      //   }, [
      //     this.proxySlot('body.before', [this.genCaption(props), this.genHeaders(props)]),
      //     this.proxySlot('bottom', this.genFooters(props)),
      //   ])
      // }

      return (0, _vue.h)(_VSimpleTable.default, _objectSpread(_objectSpread({}, simpleProps), {}, {
        class: {
          'v-data-table--mobile': this.isMobile,
          'v-data-table--selectable': this.showSelect
        }
      }), {
        default: function _default() {
          return [_this9.genCaption(props), _this9.genColgroup(props), _this9.genHeaders(props), _this9.genBody(props), _this9.genFoot(props)];
        },
        top: function top() {
          return (0, _helpers.getSlot)(_this9, 'top', _objectSpread(_objectSpread({}, props), {}, {
            isMobile: _this9.isMobile
          }), true);
        },
        bottom: function bottom() {
          return _this9.genFooters(props);
        }
      });
    }
  },
  render: function render() {
    var _this10 = this;

    return (0, _vue.h)(_VData.VData, _objectSpread(_objectSpread({}, this.$props), {}, {
      customFilter: this.customFilterWithColumns,
      customSort: this.customSortWithHeaders,
      itemsPerPage: this.computedItemsPerPage,
      'onUpdate:options': function onUpdateOptions(v, old) {
        _this10.internalGroupBy = v.groupBy || [];
        !(0, _helpers.deepEqual)(v, old) && _this10.$emit('update:options', v);
      },
      'onUpdate:page': function onUpdatePage(v) {
        return _this10.$emit('update:page', v);
      },
      'onUpdate:items-per-page': function onUpdateItemsPerPage(v) {
        return _this10.$emit('update:items-per-page', v);
      },
      'onUpdate:sort-by': function onUpdateSortBy(v) {
        return _this10.$emit('update:sort-by', v);
      },
      'onUpdate:sort-desc': function onUpdateSortDesc(v) {
        return _this10.$emit('update:sort-desc', v);
      },
      'onUpdate:group-by': function onUpdateGroupBy(v) {
        return _this10.$emit('update:group-by', v);
      },
      'onUpdate:group-desc': function onUpdateGroupDesc(v) {
        return _this10.$emit('update:group-desc', v);
      },
      onPagination: function onPagination(v, old) {
        return !(0, _helpers.deepEqual)(v, old) && _this10.$emit('pagination', v);
      },
      'onCurrent-items': function onCurrentItems(v) {
        _this10.internalCurrentItems = v;

        _this10.$emit('current-items', v);
      },
      'onPage-count': function onPageCount(v) {
        return _this10.$emit('page-count', v);
      }
    }), this.genDefaultScopedSlot);
  }
});

exports.default = _default2;
//# sourceMappingURL=VDataTable.js.map