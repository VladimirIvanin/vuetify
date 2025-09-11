// Extensions
import { defineComponent } from 'vue';
import { BaseItemGroup } from '../../components/VItemGroup/VItemGroup';
/* @vue/component */

export default defineComponent({
  name: 'button-group',
  extends: BaseItemGroup,

  provide() {
    return {
      btnToggle: this
    };
  },

  computed: {
    classes() {
      return BaseItemGroup.computed.classes.call(this);
    }

  },
  methods: {
    // Isn't being passed down through types
    genData: BaseItemGroup.methods.genData
  }
});
//# sourceMappingURL=index.js.map