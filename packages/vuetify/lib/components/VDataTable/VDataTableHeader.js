// Styles
import "../../../src/components/VDataTable/VDataTableHeader.sass"; // Components

import VDataTableHeaderMobile from './VDataTableHeaderMobile';
import VDataTableHeaderDesktop from './VDataTableHeaderDesktop'; // Mixins

import header from './mixins/header'; // Types

import { defineComponent, h } from 'vue';
/* @vue/component */

export default defineComponent({
  name: 'v-data-table-header',
  props: { ...header.props,
    mobile: Boolean
  },

  render() {
    const props = this.$props;
    const data = { ...this.$attrs,
      ...props
    }; // dedupeModelListeners(data)

    if (props.mobile) {
      return h(VDataTableHeaderMobile, data, this.$slots);
    } else {
      return h(VDataTableHeaderDesktop, data, this.$slots);
    }
  }

});
//# sourceMappingURL=VDataTableHeader.js.map