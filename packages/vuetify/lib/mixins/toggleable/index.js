import { defineComponent } from 'vue';
export function factory(prop = 'modelValue', event = 'update:modelValue') {
  return defineComponent({
    name: 'toggleable',
    props: {
      [prop]: {
        required: false
      }
    },

    data() {
      return {
        isActive: !!this[prop]
      };
    },

    watch: {
      [prop](val) {
        this.isActive = !!val;
      },

      isActive(val) {
        !!val !== this[prop] && this.$emit(event, val);
      }

    }
  });
}
/* eslint-disable-next-line @typescript-eslint/no-redeclare */

const Toggleable = factory();
export default Toggleable;
//# sourceMappingURL=index.js.map