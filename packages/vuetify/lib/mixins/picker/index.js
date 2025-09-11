// Components
import VPicker from '../../components/VPicker'; // Mixins

import Colorable from '../colorable';
import Elevatable from '../../mixins/elevatable';
import Themeable from '../themeable'; // Utils

import mixins from '../../util/mixins';
import { getSlot } from '../../util/helpers'; // Types

import { h } from 'vue';
export default mixins(Colorable, Elevatable, Themeable
/* @vue/component */
).extend({
  name: 'picker',
  props: {
    flat: Boolean,
    fullWidth: Boolean,
    headerColor: String,
    landscape: Boolean,
    noTitle: Boolean,
    width: {
      type: [Number, String],
      default: 290
    }
  },
  methods: {
    genPickerTitle() {
      return null;
    },

    genPickerBody() {
      return null;
    },

    genPickerActionsSlot() {
      return this.$slots.default ? this.$slots.default({
        save: this.save,
        cancel: this.cancel
      }) : getSlot(this);
    },

    genPicker(staticClass) {
      const children = {};

      if (!this.noTitle) {
        const title = this.genPickerTitle();
        title && (children.title = () => [title]);
      }

      const body = this.genPickerBody();
      body && (children.default = () => [body]);

      children.actions = () => [this.genPickerActionsSlot()];

      return h(VPicker, {
        class: staticClass,
        color: this.headerColor || this.color,
        dark: this.dark,
        elevation: this.elevation,
        flat: this.flat,
        fullWidth: this.fullWidth,
        landscape: this.landscape,
        light: this.light,
        width: this.width,
        noTitle: this.noTitle
      }, children);
    }

  }
});
//# sourceMappingURL=index.js.map