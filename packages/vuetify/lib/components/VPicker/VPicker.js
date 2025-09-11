import { h, Transition, defineComponent } from 'vue';
import "../../../src/components/VPicker/VPicker.sass";
import "../../../src/components/VCard/VCard.sass"; // Mixins

import Colorable from '../../mixins/colorable';
import Elevatable from '../../mixins/elevatable';
import Themeable from '../../mixins/themeable'; // Helpers

import { convertToUnit, getSlot } from '../../util/helpers';
/* @vue/component */

export default defineComponent({
  name: 'v-picker',
  mixins: [Colorable, Elevatable, Themeable],
  props: {
    flat: Boolean,
    fullWidth: Boolean,
    landscape: Boolean,
    noTitle: Boolean,
    transition: {
      type: String,
      default: 'fade-transition'
    },
    width: {
      type: [Number, String],
      default: 290
    }
  },
  computed: {
    computedTitleColor() {
      const defaultTitleColor = this.isDark ? false : this.color || 'primary';
      return this.color || defaultTitleColor;
    }

  },
  methods: {
    genTitle() {
      return h('div', this.setBackgroundColor(this.computedTitleColor, {
        class: ['v-picker__title', {
          'v-picker__title--landscape': this.landscape
        }]
      }), getSlot(this, 'title'));
    },

    genBodyTransition() {
      return h(Transition, {
        name: this.transition
      }, () => getSlot(this));
    },

    genBody() {
      return h('div', {
        class: ['v-picker__body', {
          'v-picker__body--no-title': this.noTitle,
          ...this.themeClasses
        }],
        style: this.fullWidth ? undefined : {
          width: convertToUnit(this.width)
        }
      }, [this.genBodyTransition()]);
    },

    genActions() {
      return h('div', {
        class: ['v-picker__actions v-card__actions', {
          'v-picker__actions--no-title': this.noTitle
        }]
      }, getSlot(this, 'actions'));
    }

  },

  render() {
    return h('div', {
      class: ['v-picker v-card', {
        'v-picker--flat': this.flat,
        'v-picker--landscape': this.landscape,
        'v-picker--full-width': this.fullWidth,
        ...this.themeClasses,
        ...this.elevationClasses
      }]
    }, [this.$slots.title ? this.genTitle() : null, this.genBody(), this.$slots.actions ? this.genActions() : null]);
  }

});
//# sourceMappingURL=VPicker.js.map