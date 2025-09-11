// Helpers
import { h } from 'vue';
import mixins from '../../util/mixins';
import header from './mixins/header';
import { wrapInArray, convertToUnit } from '../../util/helpers';
export default mixins(header).extend({
  name: 'v-data-table-header-desktop',
  props: {
    mobile: Boolean
  },
  emits: ['group', 'sort'],
  methods: {
    genGroupByToggle(header) {
      return h('span', {
        onClick: e => {
          e.stopPropagation();
          this.$emit('group', header.value);
        }
      }, ['group']);
    },

    getAria(beingSorted, isDesc) {
      const $t = key => this.$vuetify.lang.t(`$vuetify.dataTable.ariaLabel.${key}`);

      let ariaSort = 'none';
      let ariaLabel = [$t('sortNone'), $t('activateAscending')];

      if (!beingSorted) {
        return {
          ariaSort,
          ariaLabel: ariaLabel.join(' ')
        };
      }

      if (isDesc) {
        ariaSort = 'descending';
        ariaLabel = [$t('sortDescending'), $t(this.options.mustSort ? 'activateAscending' : 'activateNone')];
      } else {
        ariaSort = 'ascending';
        ariaLabel = [$t('sortAscending'), $t('activateDescending')];
      }

      return {
        ariaSort,
        ariaLabel: ariaLabel.join(' ')
      };
    },

    genHeader(header) {
      const data = {
        role: 'columnheader',
        scope: 'col',
        'aria-label': header.text || '',
        style: {
          width: convertToUnit(header.width),
          minWidth: convertToUnit(header.width)
        },
        class: [`text-${header.align || 'start'}`, ...wrapInArray(header.class), header.divider && 'v-data-table__divider']
      };
      const children = [];

      if (header.value === 'data-table-select' && !this.singleSelect) {
        return h('th', data, [this.genSelectAll()]);
      }

      children.push(this.$slots.hasOwnProperty(header.value) ? this.$slots[header.value]({
        header
      }) : h('span', [header.text]));

      if (!this.disableSort && (header.sortable || !header.hasOwnProperty('sortable'))) {
        data.onClick = () => this.$emit('sort', header.value);

        const sortIndex = this.options.sortBy.findIndex(k => k === header.value);
        const beingSorted = sortIndex >= 0;
        const isDesc = this.options.sortDesc[sortIndex];
        data.class.push('sortable');
        const {
          ariaLabel,
          ariaSort
        } = this.getAria(beingSorted, isDesc);
        data['aria-label'] += `${header.text ? ': ' : ''}${ariaLabel}`;
        data['aria-sort'] = ariaSort;

        if (beingSorted) {
          data.class.push('active');
          data.class.push(isDesc ? 'desc' : 'asc');
        }

        if (header.align === 'end') children.unshift(this.genSortIcon());else children.push(this.genSortIcon());

        if (this.options.multiSort && beingSorted) {
          children.push(h('span', {
            class: 'v-data-table-header__sort-badge'
          }, [String(sortIndex + 1)]));
        }
      }

      if (this.showGroupBy && header.groupable !== false) children.push(this.genGroupByToggle(header));
      return h('th', data, children);
    }

  },

  render() {
    var _a;

    return h('thead', {
      class: 'v-data-table-header'
    }, [h('tr', ((_a = this.headers) === null || _a === void 0 ? void 0 : _a.map(header => this.genHeader(header))) || [])]);
  }

});
//# sourceMappingURL=VDataTableHeaderDesktop.js.map