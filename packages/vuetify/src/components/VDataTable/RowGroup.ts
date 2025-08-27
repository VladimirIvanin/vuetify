import { defineComponent, VNode, h } from 'vue'
import { getSlot } from '@/util/helpers'

export default defineComponent({
  name: 'row-group',

  props: {
    value: {
      type: Boolean,
      default: true,
    },
    headerClass: {
      type: String,
      default: 'v-row-group__header',
    },
    contentClass: String,
    summaryClass: {
      type: String,
      default: 'v-row-group__summary',
    },
  },

  methods: {
    createHeaderElements (): VNode[] {
      const { headerClass } = this.$props

      const columnHeader = getSlot(this, 'column.header')
      if (columnHeader) {
        return [h('tr', { class: headerClass }, columnHeader)]
      }

      const rowHeader = getSlot(this, 'row.header')
      if (rowHeader) {
        return Array.isArray(rowHeader) ? rowHeader : [rowHeader]
      }

      return []
    },

    createContentElements (): VNode[] {
      const { value } = this.$props

      if (!value) {
        return []
      }

      const content = getSlot(this, 'row.content')
      if (!content) {
        return []
      }

      return Array.isArray(content) ? content : [content]
    },

    createSummaryElements (): VNode[] {
      const { summaryClass } = this.$props

      const columnSummary = getSlot(this, 'column.summary')
      if (columnSummary) {
        return [h('tr', { class: summaryClass }, columnSummary)]
      }

      const rowSummary = getSlot(this, 'row.summary')
      if (rowSummary) {
        return Array.isArray(rowSummary) ? rowSummary : [rowSummary]
      }

      return []
    },
  },

  render (): VNode[] {
    const headerElements = this.createHeaderElements()
    const contentElements = this.createContentElements()
    const summaryElements = this.createSummaryElements()

    return [...headerElements, ...contentElements, ...summaryElements].filter(Boolean)
  },
})
