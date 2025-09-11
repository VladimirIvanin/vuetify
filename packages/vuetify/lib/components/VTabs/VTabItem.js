// Extensions
import { defineComponent } from 'vue';
import VWindowItem from '../VWindow/VWindowItem';
/* @vue/component */

export default defineComponent({
  name: 'v-tab-item',
  extends: VWindowItem,
  props: {
    id: String
  },
  methods: {
    genWindowItem() {
      const item = VWindowItem.methods.genWindowItem.call(this);
      item.id = this.id || this.value;
      return item;
    }

  }
});
//# sourceMappingURL=VTabItem.js.map