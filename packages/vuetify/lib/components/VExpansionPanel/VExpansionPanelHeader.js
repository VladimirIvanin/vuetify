import { h, vShow, withDirectives } from 'vue'; // Components

import { VFadeTransition } from '../transitions';
import VIcon from '../VIcon'; // Mixins

import Colorable from '../../mixins/colorable';
import { inject as RegistrableInject } from '../../mixins/registrable'; // Directives

import { Ripple } from '../../directives/ripple'; // Utilities

import { getSlot } from '../../util/helpers';
import mixins from '../../util/mixins';
const baseMixins = mixins(Colorable, RegistrableInject('expansionPanel', 'v-expansion-panel-header', 'v-expansion-panel'));
export default baseMixins.extend({
  name: 'v-expansion-panel-header',
  props: {
    disableIconRotate: Boolean,
    expandIcon: {
      type: String,
      default: '$expand'
    },
    hideActions: Boolean,
    ripple: {
      type: [Boolean, Object],
      default: false
    }
  },
  data: () => ({
    hasMousedown: false
  }),
  computed: {
    classes() {
      return {
        'v-expansion-panel-header--active': this.isActive,
        'v-expansion-panel-header--mousedown': this.hasMousedown
      };
    },

    isActive() {
      return this.expansionPanel.isActive;
    },

    isDisabled() {
      return this.expansionPanel.isDisabled;
    },

    isReadonly() {
      return this.expansionPanel.isReadonly;
    }

  },

  created() {
    this.expansionPanel.registerHeader(this);
  },

  beforeUnmount() {
    this.expansionPanel.unregisterHeader();
  },

  methods: {
    onClick(e) {
      this.$emit('click', e);
      this.$emitLegacy('click', e);
    },

    genIcon() {
      const icon = getSlot(this, 'actions', {
        open: this.isActive
      }) || [h(VIcon, {}, () => this.expandIcon)];
      return h(VFadeTransition, {}, () => [withDirectives(h('div', {
        class: ['v-expansion-panel-header__icon', {
          'v-expansion-panel-header__icon--disable-rotate': this.disableIconRotate
        }]
      }, icon), [[vShow, !this.isDisabled]])]);
    }

  },

  render() {
    const directives = [[Ripple, this.ripple]];
    return withDirectives(h('button', this.setBackgroundColor(this.color, {
      class: ['v-expansion-panel-header', this.classes],
      tabindex: this.isDisabled ? -1 : null,
      type: 'button',
      'aria-expanded': this.isActive,
      ...this.$listeners,
      onClick: this.onClick,
      onMousedown: () => this.hasMousedown = true,
      onMouseup: () => this.hasMousedown = false
    }), [getSlot(this, 'default', {
      open: this.isActive
    }, true), this.hideActions || this.genIcon()]), directives);
  }

});
//# sourceMappingURL=VExpansionPanelHeader.js.map