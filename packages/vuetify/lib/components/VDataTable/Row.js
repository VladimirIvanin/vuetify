// Types
import { defineComponent, h } from 'vue'; // Utils

import { getObjectValueByPath, wrapInArray } from '../../util/helpers';

function needsTd(slot) {
  var _a;

  return slot.length !== 1 || !['td', 'th'].includes((_a = slot[0]) === null || _a === void 0 ? void 0 : _a.tag);
}

export default defineComponent({
  name: 'row',
  functional: true,
  props: {
    headers: Array,
    index: Number,
    item: Object,
    rtl: Boolean
  },

  render() {
    const props = this.$props;
    const data = this.$attrs;
    const columns = props.headers.map(header => {
      const children = [];
      const value = getObjectValueByPath(props.item, header.value);
      const slotName = header.value;
      const scopedSlot = this.$slots.hasOwnProperty(slotName) && this.$slots[slotName];

      if (scopedSlot) {
        children.push(...wrapInArray(scopedSlot({
          item: props.item,
          isMobile: false,
          header,
          index: props.index,
          value
        })));
      } else {
        children.push(value == null ? value : String(value));
      }

      const textAlign = `text-${header.align || 'start'}`;
      return needsTd(children) ? h('td', {
        class: [textAlign, header.cellClass, {
          'v-data-table__divider': header.divider
        }]
      }, children) : children;
    });
    return h('tr', data, columns);
  }

});
//# sourceMappingURL=Row.js.map