import { h, vShow, withDirectives } from 'vue'; // Styles

import "../../../src/components/VAlert/VAlert.sass"; // Extensions

import VSheet from '../VSheet'; // Components

import VBtn from '../VBtn';
import VIcon from '../VIcon'; // Mixins

import Toggleable from '../../mixins/toggleable';
import Themeable from '../../mixins/themeable';
import Transitionable from '../../mixins/transitionable'; // Utilities

import mixins from '../../util/mixins';
import { breaking } from '../../util/console';
import { getSlot } from '../../util/helpers'; // Types

import { Transition } from 'vue';
/* @vue/component */

export default mixins(VSheet, Toggleable, Transitionable).extend({
  name: 'v-alert',
  emits: ['update:modelValue'],
  props: {
    border: {
      type: String,

      validator(val) {
        return ['top', 'right', 'bottom', 'left'].includes(val);
      }

    },
    closeLabel: {
      type: String,
      default: '$vuetify.close'
    },
    coloredBorder: Boolean,
    dense: Boolean,
    dismissible: Boolean,
    closeIcon: {
      type: String,
      default: '$cancel'
    },
    icon: {
      type: [Boolean, String],

      validator(val) {
        return typeof val === 'string' || val === false;
      }

    },
    outlined: Boolean,
    prominent: Boolean,
    text: Boolean,
    type: {
      type: String,

      validator(val) {
        return ['info', 'error', 'success', 'warning'].includes(val);
      }

    },
    modelValue: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    __cachedBorder() {
      if (!this.border) return null;
      let data = {
        class: ['v-alert__border', {
          [`v-alert__border--${this.border}`]: true
        }]
      };

      if (this.coloredBorder) {
        data = this.setBackgroundColor(this.computedColor, data);
        data.class['v-alert__border--has-color'] = true;
      }

      return h('div', data);
    },

    __cachedDismissible() {
      if (!this.dismissible) return null;
      const color = this.iconColor;
      return h(VBtn, {
        class: 'v-alert__dismissible',
        color,
        icon: true,
        small: true,
        'aria-label': this.$vuetify.lang.t(this.closeLabel),
        onClick: () => this.isActive = false
      }, [h(VIcon, {
        color
      }, {
        default: () => this.closeIcon
      })]);
    },

    __cachedIcon() {
      if (!this.computedIcon) return null;
      return h(VIcon, {
        class: 'v-alert__icon',
        color: this.iconColor
      }, {
        default: () => this.computedIcon
      });
    },

    classes() {
      const classes = { ...VSheet.computed.classes.call(this),
        'v-alert--border': Boolean(this.border),
        'v-alert--dense': this.dense,
        'v-alert--outlined': this.outlined,
        'v-alert--prominent': this.prominent,
        'v-alert--text': this.text
      };

      if (this.border) {
        classes[`v-alert--border-${this.border}`] = true;
      }

      return classes;
    },

    computedColor() {
      return this.color || this.type;
    },

    computedIcon() {
      if (this.icon === false) return false;
      if (typeof this.icon === 'string' && this.icon) return this.icon;
      if (!['error', 'info', 'success', 'warning'].includes(this.type)) return false;
      return `$${this.type}`;
    },

    hasColoredIcon() {
      return this.hasText || Boolean(this.border) && this.coloredBorder;
    },

    hasText() {
      return this.text || this.outlined;
    },

    iconColor() {
      return this.hasColoredIcon ? this.computedColor : undefined;
    },

    isDark() {
      if (this.type && !this.coloredBorder && !this.outlined) return true;
      return Themeable.computed.isDark.call(this);
    }

  },

  created() {
    const breakingProps = [['outline', 'outlined'], ['value', 'modelValue'], ['onInput', 'onUpdate:modelValue']];
    /* istanbul ignore next */

    breakingProps.forEach(([original, replacement]) => {
      if (this.$attrs.hasOwnProperty(original)) breaking(original, replacement, this);
    });
  },

  methods: {
    genWrapper() {
      const children = [getSlot(this, 'prepend') || this.__cachedIcon, this.genContent(), this.__cachedBorder, getSlot(this, 'append'), this.$slots.close ? this.$slots.close({
        toggle: this.toggle
      }) : this.__cachedDismissible];
      const data = {
        class: 'v-alert__wrapper'
      };
      return h('div', data, children);
    },

    genContent() {
      return h('div', {
        class: 'v-alert__content'
      }, getSlot(this));
    },

    genAlert() {
      let data = {
        class: ['v-alert', this.classes],
        role: 'alert',
        ...this.listeners$,
        style: this.styles
      };
      const directives = [[vShow, this.isActive]];

      if (!this.coloredBorder) {
        const setColor = this.hasText ? this.setTextColor : this.setBackgroundColor;
        data = setColor(this.computedColor, data);
      }

      return withDirectives(h('div', data, [this.genWrapper()]), directives);
    },

    /** @public */
    toggle() {
      this.isActive = !this.isActive;
    }

  },

  render() {
    const render = this.genAlert();
    if (!this.transition) return render;
    return h(Transition, {
      name: this.transition,
      origin: this.origin,
      mode: this.mode
    }, [render]);
  }

});
//# sourceMappingURL=VAlert.js.map