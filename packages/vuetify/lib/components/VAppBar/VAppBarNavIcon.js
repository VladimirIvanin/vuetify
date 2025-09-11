// Components
import VIcon from '../VIcon';
import VBtn from '../VBtn/VBtn'; // Types

import { defineComponent, h } from 'vue';
/* @vue/component */

export default defineComponent({
  name: 'v-app-bar-nav-icon',
  functional: true,

  render() {
    var _a, _b;

    const data = this.$attrs;
    const d = Object.assign({}, data, {
      class: `v-app-bar__nav-icon ${data.class || ''}`.trim(),
      icon: true
    });
    const defaultSlot = (_b = (_a = this.$slots).default) === null || _b === void 0 ? void 0 : _b.call(_a);
    return h(VBtn, d, defaultSlot || (() => [h(VIcon, {}, () => '$menu')]));
  }

});
//# sourceMappingURL=VAppBarNavIcon.js.map