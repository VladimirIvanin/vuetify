// Types
import { defineComponent, VNode, PropType, h } from 'vue'
import { DataTableHeader } from 'vuetify/types'

// Utils
import { getObjectValueByPath, wrapInArray } from '../../util/helpers'

function needsTd (slot: VNode[] | undefined) {
  return !slot || slot.length !== 1 ||
    !['td', 'th'].includes(String(slot[0]?.type))
}

export default defineComponent({
  name: 'row',

  props: {
    headers: Array as PropType<DataTableHeader[]>,
    index: Number,
    item: Object,
    rtl: Boolean,
  },

  render (): VNode {
    const props = this.$props
    const data = this.$attrs

    const columns = props.headers.map((header: DataTableHeader) => {
      const children = []
      const value = getObjectValueByPath(props.item, header.value)

      const slotName = header.value
      const scopedSlot = this.$slots[slotName]

      if (scopedSlot) {
        const slotResult = scopedSlot({
          item: props.item,
          isMobile: false,
          header,
          index: props.index,
          value,
        })
        children.push(...wrapInArray(slotResult))
      }
      else {
        children.push(value == null ? value : String(value))
      }

      const textAlign = `text-${header.align || 'start'}`

      return needsTd(children)
        ? h('td', {
          class: [
            textAlign,
            header.cellClass,
            {
              'v-data-table__divider': header.divider,
            },
          ],
        }, children)
        : children
    })

    return h('tr', data, columns.filter(Boolean))
  },
})
