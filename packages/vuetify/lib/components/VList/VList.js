import { h } from 'vue'; // Styles

import "../../../src/components/VList/VList.sass"; // Components

import VSheet from '../VSheet/VSheet';
import { getSlot } from '../../util/helpers'; // Types

import { defineComponent } from 'vue';
/* @vue/component */

export default defineComponent({
  name: 'v-list',
  extends: VSheet,

  provide() {
    return {
      isInList: true,
      list: this
    };
  },

  inject: {
    isInMenu: {
      default: false
    },
    isInNav: {
      default: false
    }
  },
  props: {
    dense: Boolean,
    disabled: Boolean,
    expand: Boolean,
    flat: Boolean,
    nav: Boolean,
    rounded: Boolean,
    subheader: Boolean,
    threeLine: Boolean,
    twoLine: Boolean
  },
  data: () => ({
    groups: []
  }),
  computed: {
    classes() {
      return { ...VSheet.computed.classes.call(this),
        'v-list--dense': this.dense,
        'v-list--disabled': this.disabled,
        'v-list--flat': this.flat,
        'v-list--nav': this.nav,
        'v-list--rounded': this.rounded,
        'v-list--subheader': this.subheader,
        'v-list--two-line': this.twoLine,
        'v-list--three-line': this.threeLine
      };
    }

  },
  methods: {
    register(content) {
      this.groups.push(content);
    },

    unregister(content) {
      const index = this.groups.findIndex(g => g.$.uid === content.$.uid);
      if (index > -1) this.groups.splice(index, 1);
    },

    listClick(uid) {
      if (this.expand) return;

      for (const group of this.groups) {
        group.toggle(uid);
      }
    }

  },

  render() {
    const data = {
      class: [this.classes, 'v-list'],
      style: this.styles,
      role: this.isInNav || this.isInMenu ? undefined : 'list',
      // ...this.attrs$,
      ...this.listeners$
    };
    return h(this.tag, this.setBackgroundColor(this.color, data), getSlot(this));
  }

});
//# sourceMappingURL=VList.js.map