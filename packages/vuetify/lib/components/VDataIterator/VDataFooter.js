import "../../../src/components/VDataIterator/VDataFooter.sass"; // Components

import VSelect from '../VSelect/VSelect';
import VIcon from '../VIcon';
import VBtn from '../VBtn'; // Types

import { defineComponent, h } from 'vue';
import { getSlot, normalizeAttrs } from '../../util/helpers';
export default defineComponent({
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
      default: () => [5, 10, 15, -1]
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
    'update:options': options => true
  },
  computed: {
    disableNextPageIcon() {
      return this.options.itemsPerPage <= 0 || this.options.page * this.options.itemsPerPage >= this.pagination.itemsLength || this.pagination.pageStop < 0;
    },

    computedDataItemsPerPageOptions() {
      return this.itemsPerPageOptions.map(option => {
        if (typeof option === 'object') return option;else return this.genDataItemsPerPageOption(option);
      });
    }

  },
  methods: {
    updateOptions(obj) {
      this.$emit('update:options', Object.assign({}, this.options, obj));
    },

    onFirstPage() {
      this.updateOptions({
        page: 1
      });
    },

    onPreviousPage() {
      this.updateOptions({
        page: this.options.page - 1
      });
    },

    onNextPage() {
      this.updateOptions({
        page: this.options.page + 1
      });
    },

    onLastPage() {
      this.updateOptions({
        page: this.pagination.pageCount
      });
    },

    onChangeItemsPerPage(itemsPerPage) {
      this.updateOptions({
        itemsPerPage,
        page: 1
      });
    },

    genDataItemsPerPageOption(option) {
      return {
        text: option === -1 ? this.$vuetify.lang.t(this.itemsPerPageAllText) : String(option),
        value: option
      };
    },

    genItemsPerPageSelect() {
      let value = this.options.itemsPerPage;
      const computedIPPO = this.computedDataItemsPerPageOptions;
      if (computedIPPO.length <= 1) return null;
      if (!computedIPPO.find(ippo => ippo.value === value)) value = computedIPPO[0];
      return h('div', {
        class: 'v-data-footer__select'
      }, [this.$vuetify.lang.t(this.itemsPerPageText), h(VSelect, normalizeAttrs({
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

    genPaginationInfo() {
      let children = ['–'];
      const itemsLength = this.pagination.itemsLength;
      let pageStart = this.pagination.pageStart;
      let pageStop = this.pagination.pageStop;

      if (this.pagination.itemsLength && this.pagination.itemsPerPage) {
        pageStart = this.pagination.pageStart + 1;
        pageStop = itemsLength < this.pagination.pageStop || this.pagination.pageStop < 0 ? itemsLength : this.pagination.pageStop;
        const pageTextSlot = getSlot(this, 'page-text', {
          pageStart,
          pageStop,
          itemsLength
        });
        children = pageTextSlot ? [pageTextSlot] : [this.$vuetify.lang.t(this.pageText, pageStart, pageStop, itemsLength)];
      } else {
        const pageTextSlot = getSlot(this, 'page-text', {
          pageStart,
          pageStop,
          itemsLength
        });

        if (pageTextSlot) {
          children = [pageTextSlot];
        }
      }

      return h('div', {
        class: 'v-data-footer__pagination'
      }, children);
    },

    genIcon(click, disabled, label, icon) {
      return h(VBtn, {
        disabled: disabled || this.disablePagination,
        icon: true,
        text: true,
        // dark: this.dark, // TODO: add mixin
        // light: this.light // TODO: add mixin
        onClick: click,
        'aria-label': label // TODO: Localization

      }, () => [h(VIcon, {}, () => icon)]);
    },

    genIcons() {
      const before = [];
      const after = [];
      before.push(this.genIcon(this.onPreviousPage, this.options.page === 1, this.$vuetify.lang.t('$vuetify.dataFooter.prevPage'), this.$vuetify.rtl ? this.nextIcon : this.prevIcon));
      after.push(this.genIcon(this.onNextPage, this.disableNextPageIcon, this.$vuetify.lang.t('$vuetify.dataFooter.nextPage'), this.$vuetify.rtl ? this.prevIcon : this.nextIcon));

      if (this.showFirstLastPage) {
        before.unshift(this.genIcon(this.onFirstPage, this.options.page === 1, this.$vuetify.lang.t('$vuetify.dataFooter.firstPage'), this.$vuetify.rtl ? this.lastIcon : this.firstIcon));
        after.push(this.genIcon(this.onLastPage, this.options.page >= this.pagination.pageCount || this.options.itemsPerPage === -1, this.$vuetify.lang.t('$vuetify.dataFooter.lastPage'), this.$vuetify.rtl ? this.firstIcon : this.lastIcon));
      }

      return [h('div', {
        class: 'v-data-footer__icons-before'
      }, before), this.showCurrentPage && h('span', [this.options.page.toString()]), h('div', {
        class: 'v-data-footer__icons-after'
      }, after)];
    }

  },

  render() {
    return h('div', {
      class: 'v-data-footer'
    }, [getSlot(this, 'prepend'), this.genItemsPerPageSelect(), this.genPaginationInfo(), this.genIcons()]);
  }

});
//# sourceMappingURL=VDataFooter.js.map