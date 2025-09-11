import { h } from 'vue'; // Styles

import "../../../src/components/VBreadcrumbs/VBreadcrumbs.sass"; // Components

import VBreadcrumbsItem from './VBreadcrumbsItem';
import VBreadcrumbsDivider from './VBreadcrumbsDivider'; // Mixins

import Themeable from '../../mixins/themeable'; // Utils

import mixins from '../../util/mixins';
import { getSlot } from '../../util/helpers';
export default mixins(Themeable
/* @vue/component */
).extend({
  name: 'v-breadcrumbs',
  props: {
    divider: {
      type: String,
      default: '/'
    },
    items: {
      type: Array,
      default: () => []
    },
    large: Boolean
  },
  computed: {
    classes() {
      return {
        'v-breadcrumbs--large': this.large,
        ...this.themeClasses
      };
    }

  },
  methods: {
    genDivider() {
      return h(VBreadcrumbsDivider, {}, () => this.$slots.divider ? this.$slots.divider : this.divider);
    },

    genItems() {
      const items = [];
      const hasSlot = !!this.$slots.item;
      const keys = [];

      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        keys.push(item.text);
        if (hasSlot) items.push(this.$slots.item({
          item
        }));else items.push(h(VBreadcrumbsItem, {
          key: keys.join('.'),
          ...item
        }, () => [item.text]));
        if (i < this.items.length - 1) items.push(this.genDivider());
      }

      return items;
    }

  },

  render() {
    const children = getSlot(this) || this.genItems();
    return h('ul', {
      class: ['v-breadcrumbs', this.classes]
    }, children);
  }

});
//# sourceMappingURL=VBreadcrumbs.js.map