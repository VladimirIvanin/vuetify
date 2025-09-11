"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _VIcon = _interopRequireDefault(require("../../VIcon"));

var _VSimpleCheckbox = _interopRequireDefault(require("../../VCheckbox/VSimpleCheckbox"));

var _vue = require("vue");

var _mixins = _interopRequireDefault(require("../../../util/mixins"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default2 = (0, _mixins.default)().extend({
  props: {
    headers: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    options: {
      type: Object,
      default: function _default() {
        return {
          page: 1,
          itemsPerPage: 10,
          sortBy: [],
          sortDesc: [],
          groupBy: [],
          groupDesc: [],
          multiSort: false,
          mustSort: false
        };
      }
    },
    checkboxColor: String,
    sortIcon: {
      type: String,
      default: '$sort'
    },
    everyItem: Boolean,
    someItems: Boolean,
    showGroupBy: Boolean,
    singleSelect: Boolean,
    disableSort: Boolean
  },
  methods: {
    genSelectAll: function genSelectAll() {
      var _this = this;

      var _a;

      var data = {
        modelValue: this.everyItem,
        indeterminate: !this.everyItem && this.someItems,
        color: (_a = this.checkboxColor) !== null && _a !== void 0 ? _a : '',
        'onUpdate:modelValue': function onUpdateModelValue(v) {
          return _this.$emit('toggle-select-all', v);
        }
      };

      if (this.$slots['data-table-select']) {
        return this.$slots['data-table-select'](data);
      }

      return (0, _vue.h)(_VSimpleCheckbox.default, _objectSpread({
        class: 'v-data-table__checkbox'
      }, data));
    },
    genSortIcon: function genSortIcon() {
      var _this2 = this;

      return (0, _vue.h)(_VIcon.default, {
        class: 'v-data-table-header__icon',
        size: 18
      }, function () {
        return [_this2.sortIcon];
      });
    }
  }
});

exports.default = _default2;
//# sourceMappingURL=header.js.map