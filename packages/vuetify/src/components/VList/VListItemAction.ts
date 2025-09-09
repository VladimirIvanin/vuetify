// Types
import { defineComponent, VNode, h } from 'vue'

/* @vue/component */
export default defineComponent({
  name: 'v-list-item-action',

  functional: true,

  render (): VNode {
    const data = this.$attrs
    data.class = data.class ? `v-list-item__action ${data.class}` : 'v-list-item__action'
    const children = this.$slots.default || []

    const filteredChild = children.filter(VNode => {
      return VNode.isComment === false && VNode.text !== ' '
    })
    if (filteredChild.length > 1) data.class += ' v-list-item__action--stack'

    return h('div', data, children)
  },
})
