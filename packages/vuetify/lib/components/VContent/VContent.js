import { h } from 'vue'; // Types

import { defineComponent } from 'vue'; // Extensions

import VMain from '../VMain/VMain';
import { deprecate } from '../../util/console';
/* @vue/component */

export default defineComponent({
  name: 'v-main',
  extends: VMain,

  created() {
    deprecate('v-content', 'v-main', this);
  },

  render() {
    // Add the legacy class names
    const node = VMain.render.call(this, h);
    node.data.staticClass += ' v-content';
    node.children[0].data.staticClass += ' v-content__wrap';
    return h(node.tag, node.data, node.children);
  }

});
//# sourceMappingURL=VContent.js.map