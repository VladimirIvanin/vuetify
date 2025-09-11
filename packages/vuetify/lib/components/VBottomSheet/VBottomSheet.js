import "../../../src/components/VBottomSheet/VBottomSheet.sass"; // Extensions

import VDialog from '../VDialog/VDialog';
import { defineComponent } from 'vue';
/* @vue/component */

export default defineComponent({
  name: 'v-bottom-sheet',
  extends: VDialog,
  props: {
    inset: Boolean,
    maxWidth: [String, Number],
    transition: {
      type: String,
      default: 'bottom-sheet-transition'
    }
  },
  computed: {
    classes() {
      return { ...VDialog.computed.classes.call(this),
        'v-bottom-sheet': true,
        'v-bottom-sheet--inset': this.inset
      };
    }

  }
});
//# sourceMappingURL=VBottomSheet.js.map