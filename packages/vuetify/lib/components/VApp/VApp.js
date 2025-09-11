// Styles
import "../../../src/components/VApp/VApp.sass"; // Mixins

import Themeable from '../../mixins/themeable';
import { getSlot } from '../../util/helpers';
import { h } from 'vue';
/* @vue/component */

export default {
  name: 'v-app',
  mixins: [Themeable],
  props: {
    dark: {
      type: Boolean,
      default: undefined
    },
    id: {
      type: String,
      default: 'app'
    },
    light: {
      type: Boolean,
      default: undefined
    }
  },
  computed: {
    isDark() {
      return this.$vuetify.theme.dark;
    }

  },

  beforeCreate() {
    if (!this.$vuetify || this.$vuetify === this.$root) {
      throw new Error('Vuetify is not properly initialized, see https://v2.vuetifyjs.com/getting-started/quick-start#bootstrapping-the-vuetify-object');
    }
  },

  render() {
    const wrapper = h('div', {
      class: 'v-application--wrap'
    }, getSlot(this));
    return h('div', {
      class: {
        'v-application': true,
        'v-application--is-rtl': this.$vuetify.rtl,
        'v-application--is-ltr': !this.$vuetify.rtl,
        ...this.themeClasses
      },
      'data-app': true,
      id: this.id
    }, [wrapper]);
  }

};
//# sourceMappingURL=VApp.js.map