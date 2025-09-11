// Directives
import Intersect from '../../directives/intersect'; // Utilities

import { consoleWarn } from '../../util/console'; // Types

import { defineComponent, getCurrentInstance } from 'vue';
export default function intersectable(options) {
  return defineComponent({
    name: 'intersectable',
    data: () => ({
      isIntersecting: false
    }),

    mounted() {
      const {
        vnode
      } = getCurrentInstance();
      Intersect.mounted(this.$el, {
        name: 'intersect',
        value: this.onObserve
      }, vnode);
    },

    unmounted() {
      const {
        vnode
      } = getCurrentInstance();
      Intersect.unmounted(this.$el, {
        name: 'intersect',
        value: this.onObserve
      }, vnode);
    },

    methods: {
      onObserve(entries, observer, isIntersecting) {
        this.isIntersecting = isIntersecting;
        if (!isIntersecting) return;

        for (let i = 0, length = options.onVisible.length; i < length; i++) {
          const callback = this[options.onVisible[i]];

          if (typeof callback === 'function') {
            callback();
            continue;
          }

          consoleWarn(options.onVisible[i] + ' method is not available on the instance but referenced in intersectable mixin options');
        }
      }

    }
  });
}
//# sourceMappingURL=index.js.map