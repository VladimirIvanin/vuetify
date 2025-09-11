import { h, vShow, withDirectives } from 'vue';
import { VExpandTransition } from '../transitions'; // Mixins

import Bootable from '../../mixins/bootable';
import Colorable from '../../mixins/colorable';
import { inject as RegistrableInject } from '../../mixins/registrable'; // Utilities

import { getSlot } from '../../util/helpers';
import mixins from '../../util/mixins';
const baseMixins = mixins(Bootable, Colorable, RegistrableInject('expansionPanel', 'v-expansion-panel-content', 'v-expansion-panel'));
/* @vue/component */

export default baseMixins.extend({
  name: 'v-expansion-panel-content',
  data: () => ({
    isActive: false
  }),
  computed: {
    parentIsActive() {
      return this.expansionPanel.isActive;
    }

  },
  watch: {
    parentIsActive: {
      immediate: true,

      handler(val, oldVal) {
        if (val) this.isBooted = true;
        if (oldVal == null) this.isActive = val;else this.$nextTick(() => this.isActive = val);
      }

    }
  },

  created() {
    this.expansionPanel.registerContent(this);
  },

  beforeUnmount() {
    this.expansionPanel.unregisterContent();
  },

  render() {
    return h(VExpandTransition, {}, () => this.showLazyContent(() => [withDirectives(h('div', this.setBackgroundColor(this.color, {
      class: 'v-expansion-panel-content'
    }), [h('div', {
      class: 'v-expansion-panel-content__wrap'
    }, getSlot(this, 'default', {
      open: this.isActive
    }))]), [[vShow, this.isActive]])]));
  }

});
//# sourceMappingURL=VExpansionPanelContent.js.map