import { h, withDirectives, vShow } from 'vue'; // Styles

import "../../../src/components/VList/VListGroup.sass"; // Components

import VIcon from '../VIcon';
import VListItem from './VListItem';
import VListItemIcon from './VListItemIcon'; // Mixins

import BindsAttrs from '../../mixins/binds-attrs';
import Bootable from '../../mixins/bootable';
import Colorable from '../../mixins/colorable';
import Toggleable from '../../mixins/toggleable';
import { inject as RegistrableInject } from '../../mixins/registrable'; // Directives

import { Ripple } from '../../directives/ripple'; // Transitions

import { VExpandTransition } from '../transitions'; // Utils

import mixins from '../../util/mixins';
import { getSlot } from '../../util/helpers';
import { breaking } from '../../util/console';
const baseMixins = mixins(BindsAttrs, Bootable, Colorable, RegistrableInject('list'), Toggleable);
export default baseMixins.extend({
  name: 'v-list-group',
  props: {
    activeClass: {
      type: String,
      default: ''
    },
    appendIcon: {
      type: String,
      default: '$expand'
    },
    color: {
      type: String,
      default: 'primary'
    },
    disabled: Boolean,
    group: [String, RegExp],
    noAction: Boolean,
    prependIcon: String,
    ripple: {
      type: [Boolean, Object],
      default: true
    },
    subGroup: Boolean
  },
  computed: {
    classes() {
      return {
        'v-list-group--active': this.isActive,
        'v-list-group--disabled': this.disabled,
        'v-list-group--no-action': this.noAction,
        'v-list-group--sub-group': this.subGroup
      };
    }

  },

  created() {
    const breakingProps = [['value', 'modelValue'], ['inputValue', 'modelValue'], ['onInput', 'onUpdate:modelValue']];
    /* istanbul ignore next */

    breakingProps.forEach(([original, replacement]) => {
      if (this.$attrs.hasOwnProperty(original)) breaking(original, replacement, this);
    });
    this.list && this.list.register(this);

    if (this.group && this.$route && this.modelValue == null) {
      this.isActive = this.matchRoute(this.$route.path);
    }
  },

  watch: {
    isActive(val) {
      /* istanbul ignore else */
      if (!this.subGroup && val) {
        this.list && this.list.listClick(this.$.uid);
      }
    },

    $route: 'onRouteChange'
  },

  beforeUnmount() {
    this.list && this.list.unregister(this);
  },

  methods: {
    click(e) {
      if (this.disabled) return;
      this.isBooted = true;
      this.$emit('click', e);
      this.$nextTick(() => this.isActive = !this.isActive);
    },

    genIcon(icon) {
      return h(VIcon, {}, () => icon);
    },

    genAppendIcon() {
      const icon = !this.subGroup ? this.appendIcon : false;
      const slot = getSlot(this, 'appendIcon');
      if (!icon && !slot) return null;
      return h(VListItemIcon, {
        class: 'v-list-group__header__append-icon'
      }, () => [slot || this.genIcon(icon)]);
    },

    genHeader() {
      return withDirectives(h(VListItem, {
        'aria-expanded': String(this.isActive),
        role: 'button',
        class: {
          'v-list-group__header': true,
          [this.activeClass]: this.isActive
        },
        link: true,
        modelValue: this.isActive,
        ...this.listeners$,
        onClick: this.click
      }, () => [this.genPrependIcon(), getSlot(this, 'activator'), this.genAppendIcon()]), [[Ripple, this.ripple]]);
    },

    genItems() {
      const directives = [[vShow, this.isActive]];
      return this.showLazyContent(() => [withDirectives(h('div', {
        class: 'v-list-group__items'
      }, getSlot(this)), directives)]);
    },

    genPrependIcon() {
      const icon = this.subGroup && this.prependIcon == null ? '$subgroup' : this.prependIcon;
      const slot = getSlot(this, 'prependIcon');
      if (!icon && !slot) return null;
      return h(VListItemIcon, {
        class: 'v-list-group__header__prepend-icon'
      }, () => [slot || this.genIcon(icon)]);
    },

    onRouteChange(to) {
      /* istanbul ignore if */
      if (!this.group) return;
      const isActive = this.matchRoute(to.path);
      /* istanbul ignore else */

      if (isActive && this.isActive !== isActive) {
        this.list && this.list.listClick(this.$.uid);
      }

      this.isActive = isActive;
    },

    toggle(uid) {
      const isActive = this.$.uid === uid;
      if (isActive) this.isBooted = true;
      this.$nextTick(() => this.isActive = isActive);
    },

    matchRoute(to) {
      return to.match(this.group) !== null;
    }

  },

  render() {
    return h('div', this.setTextColor(this.isActive && this.color, {
      class: ['v-list-group', this.classes]
    }), [this.genHeader(), h(VExpandTransition, {}, () => this.genItems())]);
  }

});
//# sourceMappingURL=VListGroup.js.map