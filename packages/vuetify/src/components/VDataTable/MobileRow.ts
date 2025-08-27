import { defineComponent, VNode, PropType, h } from 'vue'
import { getObjectValueByPath } from '../../util/helpers'
import { DataTableHeader } from 'vuetify/types'

export default defineComponent({
  name: 'row',

  props: {
    headers: Array as PropType<DataTableHeader[]>,
    hideDefaultHeader: Boolean,
    index: Number,
    item: Object,
    rtl: Boolean,
  },

  render (): VNode {
    const props = this.$props
    const data = this.$attrs

    const computedSlots = this.$slots

    const columns: VNode[] = props.headers.map((header: DataTableHeader) => {
      const classes = {
        'v-data-table__mobile-row': true,
      }

      const children = []
      const value = getObjectValueByPath(props.item, header.value)

      const slotName = header.value
      const regularSlot = computedSlots[slotName]

      if (regularSlot) {
        const slotResult = regularSlot({
          item: props.item,
          isMobile: true,
          header,
          index: props.index,
          value,
        })
        children.push(slotResult)
      } else {
        children.push(value == null ? value : String(value))
      }

      const mobileRowChildren = [
        h('div', {
          class: 'v-data-table__mobile-row__cell',
        }, children),
      ]

      if (header.value !== 'dataTableSelect' && !props.hideDefaultHeader) {
        mobileRowChildren.unshift(
          h('div', {
            class: 'v-data-table__mobile-row__header',
          }, [header.text])
        )
      }

      return h('td', { class: classes }, mobileRowChildren)
    })

    return h('tr', { ...data, class: 'v-data-table__mobile-table-row' }, columns)
  },
})
