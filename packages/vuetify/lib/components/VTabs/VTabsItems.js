// Extensions
import { defineComponent } from 'vue';
import VWindow from '../VWindow/VWindow'; // Types & Components

import { BaseItemGroup } from './../VItemGroup/VItemGroup';
/* @vue/component */

export default defineComponent({
  name: 'v-tabs-items',
  extends: VWindow,
  props: {
    mandatory: {
      type: Boolean,
      default: false
    }
  },
  emits: ['change'],
  computed: {
    classes() {
      return { ...VWindow.computed.classes.call(this),
        'v-tabs-items': true
      };
    },

    isDark() {
      return this.rootIsDark;
    }

  },
  methods: {
    getValue(item, i) {
      return item.id || BaseItemGroup.methods.getValue.call(this, item, i);
    }

  }
});
//# sourceMappingURL=VTabsItems.js.map