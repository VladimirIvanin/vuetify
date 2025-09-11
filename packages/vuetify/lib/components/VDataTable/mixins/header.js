import VIcon from '../../VIcon';
import VSimpleCheckbox from '../../VCheckbox/VSimpleCheckbox';
import { h } from 'vue';
import mixins from '../../../util/mixins';
export default mixins().extend({
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object,
      default: () => ({
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
        groupBy: [],
        groupDesc: [],
        multiSort: false,
        mustSort: false
      })
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
    genSelectAll() {
      var _a;

      const data = {
        modelValue: this.everyItem,
        indeterminate: !this.everyItem && this.someItems,
        color: (_a = this.checkboxColor) !== null && _a !== void 0 ? _a : '',
        'onUpdate:modelValue': v => this.$emit('toggle-select-all', v)
      };

      if (this.$slots['data-table-select']) {
        return this.$slots['data-table-select'](data);
      }

      return h(VSimpleCheckbox, {
        class: 'v-data-table__checkbox',
        ...data
      });
    },

    genSortIcon() {
      return h(VIcon, {
        class: 'v-data-table-header__icon',
        size: 18
      }, () => [this.sortIcon]);
    }

  }
});
//# sourceMappingURL=header.js.map