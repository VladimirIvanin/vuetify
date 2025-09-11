import { defineComponent, h } from 'vue';
import { getObjectValueByPath } from '../../util/helpers';
export default defineComponent({
  name: 'row',
  functional: true,
  props: {
    headers: Array,
    hideDefaultHeader: Boolean,
    index: Number,
    item: Object,
    rtl: Boolean
  },

  render() {
    const props = this.$props;
    const data = this.$attrs;
    const computedSlots = this.$slots;
    const columns = props.headers.map(header => {
      const classes = {
        'v-data-table__mobile-row': true
      };
      const children = [];
      const value = getObjectValueByPath(props.item, header.value);
      const slotName = header.value;
      const regularSlot = computedSlots.hasOwnProperty(slotName) && computedSlots[slotName];

      if (regularSlot) {
        children.push(regularSlot({
          item: props.item,
          isMobile: true,
          header,
          index: props.index,
          value
        }));
      } else {
        children.push(value == null ? value : String(value));
      }

      const mobileRowChildren = [h('div', {
        class: 'v-data-table__mobile-row__cell'
      }, children)];

      if (header.value !== 'dataTableSelect' && !props.hideDefaultHeader) {
        mobileRowChildren.unshift(h('div', {
          class: 'v-data-table__mobile-row__header'
        }, [header.text]));
      }

      return h('td', {
        class: classes
      }, mobileRowChildren);
    });
    return h('tr', { ...data,
      class: 'v-data-table__mobile-table-row'
    }, columns);
  }

});
//# sourceMappingURL=MobileRow.js.map