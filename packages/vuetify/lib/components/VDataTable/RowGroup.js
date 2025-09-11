import { defineComponent, h, Fragment } from 'vue';
import { getSlot } from '../../util/helpers';
import { breaking } from '../../util/console';
export default defineComponent({
  name: 'row-group',
  props: {
    modelValue: {
      type: Boolean,
      default: true
    },
    headerClass: {
      type: String,
      default: 'v-row-group__header'
    },
    contentClass: String,
    summaryClass: {
      type: String,
      default: 'v-row-group__summary'
    }
  },

  created() {
    const breakingProps = [['value', 'modelValue']];
    /* istanbul ignore next */

    breakingProps.forEach(([original, replacement]) => {
      if (this.$attrs.hasOwnProperty(original)) breaking(original, replacement, this);
    });
  },

  render() {
    const props = this.$props;
    const children = [];
    const columnHeaderSlot = getSlot(this, 'column.header');
    const rowHeaderSlot = getSlot(this, 'row.header');
    const rowContentSlot = getSlot(this, 'row.content');
    const columnSummarySlot = getSlot(this, 'column.summary');
    const rowSummarySlot = getSlot(this, 'row.summary');

    if (columnHeaderSlot) {
      children.push(h('tr', {
        class: props.headerClass
      }, columnHeaderSlot));
    } else if (rowHeaderSlot) {
      children.push(...(Array.isArray(rowHeaderSlot) ? rowHeaderSlot : [rowHeaderSlot]));
    }

    if (rowContentSlot && props.modelValue) {
      children.push(...(Array.isArray(rowContentSlot) ? rowContentSlot : [rowContentSlot]));
    }

    if (columnSummarySlot) {
      children.push(h('tr', {
        class: props.summaryClass
      }, columnSummarySlot));
    } else if (rowSummarySlot) {
      children.push(...(Array.isArray(rowSummarySlot) ? rowSummarySlot : [rowSummarySlot]));
    }

    return h(Fragment, children);
  }

});
//# sourceMappingURL=RowGroup.js.map