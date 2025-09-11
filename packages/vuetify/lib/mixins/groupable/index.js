// Mixins
import { inject as RegistrableInject } from '../registrable';
export function factory(namespace, child, parent) {
  return {
    name: 'groupable',
    extends: RegistrableInject(namespace, child, parent),
    props: {
      activeClass: {
        type: String
      },
      disabled: Boolean
    },

    data() {
      return {
        isActive: false
      };
    },

    computed: {
      $activeClass() {
        if (this.activeClass) return this.activeClass;
        if (!this[namespace]) return undefined;
        return this[namespace].activeClass;
      },

      groupClasses() {
        if (!this.$activeClass) return {};
        return {
          [this.$activeClass]: this.isActive
        };
      }

    },

    created() {
      this[namespace] && this[namespace].register(this);
    },

    beforeUnmount() {
      this[namespace] && this[namespace].unregister(this);
    },

    methods: {
      toggle(e) {
        if (this.disabled && e) {
          // Prevent keyboard actions
          // from children elements
          // within disabled tabs
          e.preventDefault();
          return;
        }

        this.$emit('change');
        this.$emitLegacy('change');
      }

    }
  };
}
/* eslint-disable-next-line @typescript-eslint/no-redeclare */

const Groupable = factory('itemGroup');
export default Groupable;
//# sourceMappingURL=index.js.map