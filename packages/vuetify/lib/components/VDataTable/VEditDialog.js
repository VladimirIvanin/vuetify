import { h } from 'vue'; // Styles

import "../../../src/components/VDataTable/VEditDialog.sass"; // Mixins

import Returnable from '../../mixins/returnable';
import Themeable from '../../mixins/themeable'; // Utils

import { getSlot, keyCodes } from '../../util/helpers'; // Component

import VBtn from '../VBtn';
import VMenu from '../VMenu';
import mixins from '../../util/mixins';
/* @vue/component */

export default mixins(Returnable, Themeable).extend({
  name: 'v-edit-dialog',
  props: {
    cancelText: {
      default: 'Cancel'
    },
    large: Boolean,
    eager: Boolean,
    persistent: Boolean,
    saveText: {
      default: 'Save'
    },
    transition: {
      type: String,
      default: 'slide-x-reverse-transition'
    }
  },
  emits: ['update:return-value', 'open', 'close', 'cancel', 'save'],

  data() {
    return {// isActive is provided by Returnable mixin
    };
  },

  watch: {
    isActive(val) {
      if (val) {
        this.$emit('open');
        setTimeout(this.focus, 50); // Give DOM time to paint
      } else {
        this.$emit('close');
      }
    }

  },
  methods: {
    cancel() {
      this.isActive = false;
      this.$emit('cancel');
    },

    focus() {
      const input = this.$refs.content.querySelector('input');
      input && input.focus();
    },

    genButton(fn, text) {
      return h(VBtn, {
        text: true,
        color: 'primary',
        light: true,
        onClick: fn
      }, () => text);
    },

    genActions() {
      return h('div', {
        class: 'v-small-dialog__actions'
      }, [this.genButton(this.cancel, this.cancelText), this.genButton(() => {
        this.save(this.returnValue);
        this.$emit('save');
      }, this.saveText)]);
    },

    genContent() {
      return h('div', {
        class: 'v-small-dialog__content',
        onKeydown: e => {
          e.keyCode === keyCodes.esc && this.cancel();

          if (e.keyCode === keyCodes.enter) {
            this.save(this.returnValue);
            this.$emit('save');
          }
        },
        ref: 'content'
      }, getSlot(this, 'input'));
    }

  },

  render() {
    return h(VMenu, {
      class: ['v-small-dialog', this.themeClasses],
      contentClass: 'v-small-dialog__menu-content',
      transition: this.transition,
      origin: 'top right',
      right: true,
      modelValue: this.isActive,
      closeOnClick: !this.persistent,
      closeOnContentClick: false,
      eager: this.eager,
      light: this.light,
      dark: this.dark,
      'onUpdate:modelValue': val => this.isActive = val
    }, {
      activator: ({
        on
      }) => {
        return h('div', {
          class: 'v-small-dialog__activator',
          ...on
        }, [h('span', {
          class: 'v-small-dialog__activator__content'
        }, getSlot(this))]);
      },
      default: () => [this.genContent(), this.large ? this.genActions() : null]
    });
  }

});
//# sourceMappingURL=VEditDialog.js.map