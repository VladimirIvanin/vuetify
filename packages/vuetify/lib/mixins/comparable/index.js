import { defineComponent } from 'vue';
import { deepEqual } from '../../util/helpers';
export default defineComponent({
  name: 'comparable',
  props: {
    valueComparator: {
      type: Function,
      default: deepEqual
    }
  }
});
//# sourceMappingURL=index.js.map