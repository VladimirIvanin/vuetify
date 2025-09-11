// Types
import { defineComponent, h } from 'vue';
/* @vue/component */

export default defineComponent({
  name: 'v-list-item-icon',
  functional: true,

  render() {
    const data = { ...this.$attrs
    };
    data.class = `v-list-item__icon ${data.class || ''}`.trim();
    return h('div', data, this.$slots.default());
  }

});
//# sourceMappingURL=VListItemIcon.js.map