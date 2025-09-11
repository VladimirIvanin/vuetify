import { h } from 'vue'; // Mixins

import Colorable from '../../mixins/colorable'; // Utilities

import mixins from '../../util/mixins';
/* @vue/component */

export default mixins(Colorable).extend({
  name: 'v-tabs-slider',

  render() {
    return h('div', this.setBackgroundColor(this.color, {
      class: 'v-tabs-slider'
    }));
  }

});
//# sourceMappingURL=VTabsSlider.js.map