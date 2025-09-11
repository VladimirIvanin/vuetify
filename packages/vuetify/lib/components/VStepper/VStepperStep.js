import { h, withDirectives } from 'vue'; // Components

import VIcon from '../VIcon'; // Mixins

import Colorable from '../../mixins/colorable';
import { inject as RegistrableInject } from '../../mixins/registrable'; // Directives

import ripple from '../../directives/ripple'; // Utilities

import mixins from '../../util/mixins';
import { getSlot, keyCodes } from '../../util/helpers';
const baseMixins = mixins(Colorable, RegistrableInject('stepper', 'v-stepper-step', 'v-stepper'));
/* @vue/component */

export default baseMixins.extend({
  name: 'v-stepper-step',
  inject: ['stepClick'],
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    complete: Boolean,
    completeIcon: {
      type: String,
      default: '$complete'
    },
    editable: Boolean,
    editIcon: {
      type: String,
      default: '$edit'
    },
    errorIcon: {
      type: String,
      default: '$error'
    },
    rules: {
      type: Array,
      default: () => []
    },
    step: [Number, String]
  },

  data() {
    return {
      isActive: false,
      isInactive: true
    };
  },

  computed: {
    classes() {
      return {
        'v-stepper__step': true,
        'v-stepper__step--active': this.isActive,
        'v-stepper__step--editable': this.editable,
        'v-stepper__step--inactive': this.isInactive,
        'v-stepper__step--error error--text': this.hasError,
        'v-stepper__step--complete': this.complete
      };
    },

    hasError() {
      return this.rules.some(validate => validate() !== true);
    }

  },

  mounted() {
    this.stepper && this.stepper.register(this);
  },

  beforeUnmount() {
    this.stepper && this.stepper.unregister(this);
  },

  methods: {
    click(e) {
      e.stopPropagation();
      this.$emit('click', e);

      if (this.editable) {
        this.stepClick(this.step);
      }
    },

    genIcon(icon) {
      return h(VIcon, icon);
    },

    genLabel() {
      return h('div', {
        class: 'v-stepper__label'
      }, getSlot(this));
    },

    genStep() {
      const color = !this.hasError && (this.complete || this.isActive) ? this.color : false;
      return h('span', this.setBackgroundColor(color, {
        class: 'v-stepper__step__step'
      }), this.genStepContent());
    },

    genStepContent() {
      const children = [];

      if (this.hasError) {
        children.push(this.genIcon(this.errorIcon));
      } else if (this.complete) {
        if (this.editable) {
          children.push(this.genIcon(this.editIcon));
        } else {
          children.push(this.genIcon(this.completeIcon));
        }
      } else {
        children.push(String(this.step));
      }

      return children;
    },

    keyboardClick(e) {
      if (e.keyCode === keyCodes.space) {
        this.click(e);
      }
    },

    toggle(step) {
      this.isActive = step.toString() === this.step.toString();
      this.isInactive = Number(step) < Number(this.step);
    }

  },

  render() {
    return withDirectives(h('div', {
      tabindex: this.editable ? 0 : -1,
      class: this.classes,
      onClick: this.click,
      onKeydown: this.keyboardClick
    }, [this.genStep(), this.genLabel()]), [[ripple, this.editable]]);
  }

});
//# sourceMappingURL=VStepperStep.js.map