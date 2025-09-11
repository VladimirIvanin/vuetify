import { h } from 'vue';
import mixins from '../../util/mixins';
import VSelect from '../VSelect/VSelect';
import VChip from '../VChip';
import header from './mixins/header';
import { wrapInArray } from '../../util/helpers';
export default mixins(header).extend({
  name: 'v-data-table-header-mobile',
  props: {
    sortByText: {
      type: String,
      default: '$vuetify.dataTable.sortBy'
    },
    mobile: Boolean
  },
  emits: ['sort'],
  methods: {
    genSortChip(props) {
      const children = [props.item.text];
      const sortIndex = this.options.sortBy.findIndex(k => k === props.item.value);
      const beingSorted = sortIndex >= 0;
      const isDesc = this.options.sortDesc[sortIndex];
      children.push(h('div', {
        class: {
          'v-chip__close': true,
          sortable: true,
          active: beingSorted,
          asc: beingSorted && !isDesc,
          desc: beingSorted && isDesc
        }
      }, [this.genSortIcon()]));
      return h(VChip, {
        class: 'sortable',
        onClick: e => {
          e.stopPropagation();
          this.$emit('sort', props.item.value);
        }
      }, children);
    },

    genSortSelect(items) {
      return h(VSelect, {
        label: this.$vuetify.lang.t(this.sortByText),
        items,
        hideDetails: true,
        multiple: this.options.multiSort,
        modelValue: this.options.multiSort ? this.options.sortBy : this.options.sortBy[0],
        menuProps: {
          closeOnContentClick: true
        },
        'onUpdate:modelValue': v => this.$emit('sort', v)
      }, {
        selection: props => this.genSortChip(props)
      });
    }

  },

  render() {
    const children = [];
    const header = this.headers.find(h => h.value === 'data-table-select');

    if (header && !this.singleSelect) {
      children.push(h('div', {
        class: ['v-data-table-header-mobile__select', ...wrapInArray(header.class)],
        width: header.width
      }, [this.genSelectAll()]));
    }

    const sortHeaders = this.headers.filter(h => h.sortable !== false && h.value !== 'data-table-select').map(h => ({
      text: h.text,
      value: h.value
    }));

    if (!this.disableSort && sortHeaders.length) {
      children.push(this.genSortSelect(sortHeaders));
    }

    const th = children.length ? h('th', [h('div', {
      class: 'v-data-table-header-mobile__wrapper'
    }, children)]) : undefined;
    const tr = h('tr', [th]);
    return h('thead', {
      class: 'v-data-table-header v-data-table-header-mobile'
    }, [tr]);
  }

});
//# sourceMappingURL=VDataTableHeaderMobile.js.map