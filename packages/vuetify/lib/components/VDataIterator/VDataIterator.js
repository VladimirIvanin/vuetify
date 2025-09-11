// Components
import { VData } from '../VData';
import VDataFooter from './VDataFooter'; // Mixins

import Mobile from '../../mixins/mobile';
import Themeable from '../../mixins/themeable';
import { deepEqual, getObjectValueByPath, getPrefixedScopedSlots, getSlot, camelizeObjectKeys, keyCodes } from '../../util/helpers';
import { breaking, removed } from '../../util/console'; // Types

import { h, defineComponent } from 'vue';
/* @vue/component */

export default defineComponent({
  name: 'v-data-iterator',
  mixins: [Mobile, Themeable],
  props: { ...VData.props,
    itemKey: {
      type: String,
      default: 'id'
    },
    modelValue: {
      type: Array,
      default: () => []
    },
    singleSelect: Boolean,
    expanded: {
      type: Array,
      default: () => []
    },
    mobileBreakpoint: { ...Mobile.props.mobileBreakpoint,
      default: 600
    },
    singleExpand: Boolean,
    loading: [Boolean, String],
    noResultsText: {
      type: String,
      default: '$vuetify.dataIterator.noResultsText'
    },
    noDataText: {
      type: String,
      default: '$vuetify.noDataText'
    },
    loadingText: {
      type: String,
      default: '$vuetify.dataIterator.loadingText'
    },
    hideDefaultFooter: Boolean,
    footerProps: Object,
    selectableKey: {
      type: String,
      default: 'isSelectable'
    }
  },
  emits: ['update:modelValue', 'update:expanded', 'toggle-select-all', 'item-selected', 'item-expanded', 'update:options', 'update:page', 'update:items-per-page', 'update:sort-by', 'update:sort-desc', 'update:group-by', 'update:group-desc', 'pagination', 'current-items', 'page-count'],
  data: () => ({
    selection: {},
    expansion: {},
    internalCurrentItems: [],
    shiftKeyDown: false,
    lastEntry: -1
  }),
  computed: {
    everyItem() {
      return !!this.selectableItems.length && this.selectableItems.every(i => this.isSelected(i));
    },

    someItems() {
      return this.selectableItems.some(i => this.isSelected(i));
    },

    sanitizedFooterProps() {
      return camelizeObjectKeys(this.footerProps);
    },

    selectableItems() {
      return this.internalCurrentItems.filter(item => this.isSelectable(item));
    }

  },
  watch: {
    modelValue: {
      handler(value) {
        if (!value) return;
        this.selection = value.reduce((selection, item) => {
          selection[getObjectValueByPath(item, this.itemKey)] = item;
          return selection;
        }, {});
      },

      immediate: true
    },

    selection(value, old) {
      if (deepEqual(Object.keys(value), Object.keys(old))) return;
      this.$emit('update:modelValue', Object.values(value));
    },

    expanded: {
      handler(value) {
        this.expansion = value.reduce((expansion, item) => {
          expansion[getObjectValueByPath(item, this.itemKey)] = true;
          return expansion;
        }, {});
      },

      immediate: true
    },

    expansion(value, old) {
      if (deepEqual(value, old)) return;
      const keys = Object.keys(value).filter(k => value[k]);
      const expanded = !keys.length ? [] : this.items.filter(i => keys.includes(String(getObjectValueByPath(i, this.itemKey))));
      this.$emit('update:expanded', expanded);
    }

  },

  created() {
    const breakingProps = [['value', 'modelValue'], ['onInput', 'onUpdate:modelValue'], ['disable-initial-sort', 'sort-by'], ['filter', 'custom-filter'], ['pagination', 'options'], ['total-items', 'server-items-length'], ['hide-actions', 'hide-default-footer'], ['rows-per-page-items', 'footer-props.items-per-page-options'], ['rows-per-page-text', 'footer-props.items-per-page-text'], ['prev-icon', 'footer-props.prev-icon'], ['next-icon', 'footer-props.next-icon']];
    /* istanbul ignore next */

    breakingProps.forEach(([original, replacement]) => {
      if (this.$attrs.hasOwnProperty(original)) breaking(original, replacement, this);
    });
    const removedProps = ['expand', 'content-class', 'content-props', 'content-tag'];
    /* istanbul ignore next */

    removedProps.forEach(prop => {
      if (this.$attrs.hasOwnProperty(prop)) removed(prop);
    });
  },

  mounted() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  },

  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  },

  methods: {
    onKeyDown(e) {
      this.shiftKeyDown = e.keyCode === keyCodes.shift || e.shiftKey;
    },

    onKeyUp(e) {
      if (e.keyCode === keyCodes.shift || !e.shiftKey) {
        this.shiftKeyDown = false;
      }
    },

    toggleSelectAll(value) {
      const selection = Object.assign({}, this.selection);

      for (let i = 0; i < this.selectableItems.length; i++) {
        const item = this.selectableItems[i];
        if (!this.isSelectable(item)) continue;
        const key = getObjectValueByPath(item, this.itemKey);
        if (value) selection[key] = item;else delete selection[key];
      }

      this.selection = selection;
      this.$emit('toggle-select-all', {
        items: this.internalCurrentItems,
        value
      });
    },

    isSelectable(item) {
      return getObjectValueByPath(item, this.selectableKey) !== false;
    },

    isSelected(item) {
      return !!this.selection[getObjectValueByPath(item, this.itemKey)] || false;
    },

    select(item, value = true, emit = true) {
      if (!this.isSelectable(item)) return;
      const selection = this.singleSelect ? {} : Object.assign({}, this.selection);
      const key = getObjectValueByPath(item, this.itemKey);
      if (value) selection[key] = item;else delete selection[key];
      const index = this.selectableItems.findIndex(x => getObjectValueByPath(x, this.itemKey) === key);
      if (this.lastEntry === -1) this.lastEntry = index;else if (this.shiftKeyDown && !this.singleSelect && emit) {
        const lastEntryKey = getObjectValueByPath(this.selectableItems[this.lastEntry], this.itemKey);
        const lastEntryKeySelected = Object.keys(this.selection).includes(String(lastEntryKey));
        this.multipleSelect(lastEntryKeySelected, emit, selection, index);
      }
      this.lastEntry = index;

      if (this.singleSelect && emit) {
        const keys = Object.keys(this.selection);
        const old = keys.length && getObjectValueByPath(this.selection[keys[0]], this.itemKey);
        old && old !== key && this.$emit('item-selected', {
          item: this.selection[old],
          value: false
        });
      }

      this.selection = selection;
      emit && this.$emit('item-selected', {
        item,
        value
      });
    },

    multipleSelect(value = true, emit = true, selection, index) {
      const start = index < this.lastEntry ? index : this.lastEntry;
      const end = index < this.lastEntry ? this.lastEntry : index;

      for (let i = start; i <= end; i++) {
        const currentItem = this.selectableItems[i];
        const key = getObjectValueByPath(currentItem, this.itemKey);
        if (value) selection[key] = currentItem;else delete selection[key];
        emit && this.$emit('item-selected', {
          currentItem,
          value
        });
      }
    },

    isExpanded(item) {
      return this.expansion[getObjectValueByPath(item, this.itemKey)] || false;
    },

    expand(item, value = true) {
      const expansion = this.singleExpand ? {} : Object.assign({}, this.expansion);
      const key = getObjectValueByPath(item, this.itemKey);
      if (value) expansion[key] = true;else delete expansion[key];
      this.expansion = expansion;
      this.$emit('item-expanded', {
        item,
        value
      });
    },

    createItemProps(item, index) {
      return {
        item,
        index,
        select: v => this.select(item, v),
        isSelected: this.isSelected(item),
        expand: v => this.expand(item, v),
        isExpanded: this.isExpanded(item),
        isMobile: this.isMobile
      };
    },

    genEmptyWrapper(content) {
      return h('div', content);
    },

    genEmpty(originalItemsLength, filteredItemsLength) {
      if (originalItemsLength === 0 && this.loading) {
        const loading = getSlot(this, 'loading') || this.$vuetify.lang.t(this.loadingText);
        return this.genEmptyWrapper(loading);
      } else if (originalItemsLength === 0) {
        const noData = getSlot(this, 'noData') || this.$vuetify.lang.t(this.noDataText);
        return this.genEmptyWrapper(noData);
      } else if (filteredItemsLength === 0) {
        const noResults = getSlot(this, 'noResults') || this.$vuetify.lang.t(this.noResultsText);
        return this.genEmptyWrapper(noResults);
      }

      return null;
    },

    genItems(props) {
      const empty = this.genEmpty(props.originalItemsLength, props.pagination.itemsLength);
      if (empty) return [empty];

      if (this.$slots.default) {
        return this.$slots.default({ ...props,
          isSelected: this.isSelected,
          select: this.select,
          isExpanded: this.isExpanded,
          isMobile: this.isMobile,
          expand: this.expand
        });
      }

      if (this.$slots.item) {
        return props.items.map((item, index) => this.$slots.item(this.createItemProps(item, index)));
      }

      return [];
    },

    genFooter(props) {
      if (this.hideDefaultFooter) return null;
      const data = { ...this.sanitizedFooterProps,
        options: props.options,
        pagination: props.pagination,
        onUpdateOptions: value => props.updateOptions(value)
      };
      const scopedSlots = getPrefixedScopedSlots('footer.', this.$slots);
      return h(VDataFooter, { ...data
      }, scopedSlots);
    },

    genDefaultScopedSlot(props) {
      const outerProps = { ...props,
        someItems: this.someItems,
        everyItem: this.everyItem,
        toggleSelectAll: this.toggleSelectAll
      };
      return h('div', {
        class: 'v-data-iterator'
      }, [getSlot(this, 'header', outerProps, true), this.genItems(props), this.genFooter(props), getSlot(this, 'footer', outerProps, true)]);
    }

  },

  render() {
    return h(VData, { ...this.$props,
      onUpdateOptions: (v, old) => !deepEqual(v, old) && this.$emit('update:options', v),
      onUpdatePage: v => this.$emit('update:page', v),
      onUpdateItemsPerPage: v => this.$emit('update:items-per-page', v),
      onUpdateSortBy: v => this.$emit('update:sort-by', v),
      onUpdateSortDesc: v => this.$emit('update:sort-desc', v),
      onUpdateGroupBy: v => this.$emit('update:group-by', v),
      onUpdateGroupDesc: v => this.$emit('update:group-desc', v),
      onPagination: (v, old) => !deepEqual(v, old) && this.$emit('pagination', v),
      onCurrentItems: v => {
        this.internalCurrentItems = v;
        this.$emit('current-items', v);
      },
      onPageCount: v => this.$emit('page-count', v)
    }, {
      default: this.genDefaultScopedSlot
    });
  }

});
//# sourceMappingURL=VDataIterator.js.map