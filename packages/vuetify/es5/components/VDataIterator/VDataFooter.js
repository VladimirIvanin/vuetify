"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../../../src/components/VDataIterator/VDataFooter.sass");

var _VSelect = _interopRequireDefault(require("../VSelect/VSelect"));

var _VIcon = _interopRequireDefault(require("../VIcon"));

var _VBtn = _interopRequireDefault(require("../VBtn"));

var _vue = require("vue");

var _helpers = require("../../util/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _default2 = (0, _vue.defineComponent)({
  name: 'v-data-footer',
  props: {
    options: {
      type: Object,
      required: true
    },
    pagination: {
      type: Object,
      required: true
    },
    itemsPerPageOptions: {
      type: Array,
      default: function _default() {
        return [5, 10, 15, -1];
      }
    },
    prevIcon: {
      type: String,
      default: '$prev'
    },
    nextIcon: {
      type: String,
      default: '$next'
    },
    firstIcon: {
      type: String,
      default: '$first'
    },
    lastIcon: {
      type: String,
      default: '$last'
    },
    itemsPerPageText: {
      type: String,
      default: '$vuetify.dataFooter.itemsPerPageText'
    },
    itemsPerPageAllText: {
      type: String,
      default: '$vuetify.dataFooter.itemsPerPageAll'
    },
    showFirstLastPage: Boolean,
    showCurrentPage: Boolean,
    disablePagination: Boolean,
    disableItemsPerPage: Boolean,
    pageText: {
      type: String,
      default: '$vuetify.dataFooter.pageText'
    }
  },
  emits: {
    'update:options': function updateOptions(options) {
      return true;
    }
  },
  computed: {
    disableNextPageIcon: function disableNextPageIcon() {
      return this.options.itemsPerPage <= 0 || this.options.page * this.options.itemsPerPage >= this.pagination.itemsLength || this.pagination.pageStop < 0;
    },
    computedDataItemsPerPageOptions: function computedDataItemsPerPageOptions() {
      var _this = this;

      return this.itemsPerPageOptions.map(function (option) {
        if (_typeof(option) === 'object') return option;else return _this.genDataItemsPerPageOption(option);
      });
    }
  },
  methods: {
    updateOptions: function updateOptions(obj) {
      this.$emit('update:options', Object.assign({}, this.options, obj));
    },
    onFirstPage: function onFirstPage() {
      this.updateOptions({
        page: 1
      });
    },
    onPreviousPage: function onPreviousPage() {
      this.updateOptions({
        page: this.options.page - 1
      });
    },
    onNextPage: function onNextPage() {
      this.updateOptions({
        page: this.options.page + 1
      });
    },
    onLastPage: function onLastPage() {
      this.updateOptions({
        page: this.pagination.pageCount
      });
    },
    onChangeItemsPerPage: function onChangeItemsPerPage(itemsPerPage) {
      this.updateOptions({
        itemsPerPage: itemsPerPage,
        page: 1
      });
    },
    genDataItemsPerPageOption: function genDataItemsPerPageOption(option) {
      return {
        text: option === -1 ? this.$vuetify.lang.t(this.itemsPerPageAllText) : String(option),
        value: option
      };
    },
    genItemsPerPageSelect: function genItemsPerPageSelect() {
      var value = this.options.itemsPerPage;
      var computedIPPO = this.computedDataItemsPerPageOptions;
      if (computedIPPO.length <= 1) return null;
      if (!computedIPPO.find(function (ippo) {
        return ippo.value === value;
      })) value = computedIPPO[0];
      return (0, _vue.h)('div', {
        class: 'v-data-footer__select'
      }, [this.$vuetify.lang.t(this.itemsPerPageText), (0, _vue.h)(_VSelect.default, (0, _helpers.normalizeAttrs)({
        'aria-label': this.$vuetify.lang.t(this.itemsPerPageText),
        disabled: this.disableItemsPerPage,
        items: computedIPPO,
        modelValue: value,
        hideDetails: true,
        auto: true,
        minWidth: '75px',
        'onUpdate:modelValue': this.onChangeItemsPerPage
      }))]);
    },
    genPaginationInfo: function genPaginationInfo() {
      var children = ['–'];
      var itemsLength = this.pagination.itemsLength;
      var pageStart = this.pagination.pageStart;
      var pageStop = this.pagination.pageStop;

      if (this.pagination.itemsLength && this.pagination.itemsPerPage) {
        pageStart = this.pagination.pageStart + 1;
        pageStop = itemsLength < this.pagination.pageStop || this.pagination.pageStop < 0 ? itemsLength : this.pagination.pageStop;
        var pageTextSlot = (0, _helpers.getSlot)(this, 'page-text', {
          pageStart: pageStart,
          pageStop: pageStop,
          itemsLength: itemsLength
        });
        children = pageTextSlot ? [pageTextSlot] : [this.$vuetify.lang.t(this.pageText, pageStart, pageStop, itemsLength)];
      } else {
        var _pageTextSlot = (0, _helpers.getSlot)(this, 'page-text', {
          pageStart: pageStart,
          pageStop: pageStop,
          itemsLength: itemsLength
        });

        if (_pageTextSlot) {
          children = [_pageTextSlot];
        }
      }

      return (0, _vue.h)('div', {
        class: 'v-data-footer__pagination'
      }, children);
    },
    genIcon: function genIcon(click, disabled, label, icon) {
      return (0, _vue.h)(_VBtn.default, {
        disabled: disabled || this.disablePagination,
        icon: true,
        text: true,
        // dark: this.dark, // TODO: add mixin
        // light: this.light // TODO: add mixin
        onClick: click,
        'aria-label': label // TODO: Localization

      }, function () {
        return [(0, _vue.h)(_VIcon.default, {}, function () {
          return icon;
        })];
      });
    },
    genIcons: function genIcons() {
      var before = [];
      var after = [];
      before.push(this.genIcon(this.onPreviousPage, this.options.page === 1, this.$vuetify.lang.t('$vuetify.dataFooter.prevPage'), this.$vuetify.rtl ? this.nextIcon : this.prevIcon));
      after.push(this.genIcon(this.onNextPage, this.disableNextPageIcon, this.$vuetify.lang.t('$vuetify.dataFooter.nextPage'), this.$vuetify.rtl ? this.prevIcon : this.nextIcon));

      if (this.showFirstLastPage) {
        before.unshift(this.genIcon(this.onFirstPage, this.options.page === 1, this.$vuetify.lang.t('$vuetify.dataFooter.firstPage'), this.$vuetify.rtl ? this.lastIcon : this.firstIcon));
        after.push(this.genIcon(this.onLastPage, this.options.page >= this.pagination.pageCount || this.options.itemsPerPage === -1, this.$vuetify.lang.t('$vuetify.dataFooter.lastPage'), this.$vuetify.rtl ? this.firstIcon : this.lastIcon));
      }

      return [(0, _vue.h)('div', {
        class: 'v-data-footer__icons-before'
      }, before), this.showCurrentPage && (0, _vue.h)('span', [this.options.page.toString()]), (0, _vue.h)('div', {
        class: 'v-data-footer__icons-after'
      }, after)];
    }
  },
  render: function render() {
    return (0, _vue.h)('div', {
      class: 'v-data-footer'
    }, [(0, _helpers.getSlot)(this, 'prepend'), this.genItemsPerPageSelect(), this.genPaginationInfo(), this.genIcons()]);
  }
});

exports.default = _default2;
//# sourceMappingURL=VDataFooter.js.map