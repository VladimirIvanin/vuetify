import { h } from 'vue'; // Mixins

import mixins from '../../util/mixins';
import BindsAttrs from '../../mixins/binds-attrs';
import { provide as RegistrableProvide } from '../../mixins/registrable'; // Helpers

import { getSlot } from '../../util/helpers';
/* @vue/component */

export default mixins(BindsAttrs, RegistrableProvide('form')
/* @vue/component */
).extend({
  name: 'v-form',

  provide() {
    return {
      form: this
    };
  },

  inheritAttrs: false,
  props: {
    disabled: Boolean,
    lazyValidation: Boolean,
    readonly: Boolean,
    value: Boolean
  },
  emits: ['input', 'update:modelValue', 'submit'],
  data: () => ({
    inputs: [],
    watchers: [],
    errorBag: {}
  }),
  watch: {
    errorBag: {
      handler(val) {
        const errors = Object.values(val).includes(true);
        this.$emit('input', !errors);
        this.$emit('update:modelValue', !errors);
      },

      deep: true,
      immediate: true
    }
  },
  methods: {
    getInputUid(input) {
      return input.$.uid;
    },

    watchInput(input) {
      const inputId = this.getInputUid(input);

      const createErrorWatcher = inputComponent => {
        if (typeof inputComponent.$watch === 'function') {
          return inputComponent.$watch('hasError', hasError => {
            this.errorBag[inputId] = hasError;
          }, {
            immediate: true
          });
        } else {
          // Fallback для Vue 3
          return () => {};
        }
      };

      const watchers = {
        _uid: inputId,
        valid: () => {},
        shouldValidate: () => {}
      };

      if (this.lazyValidation) {
        if (typeof input.$watch === 'function') {
          watchers.shouldValidate = input.$watch('shouldValidate', shouldValidate => {
            if (!shouldValidate) return;
            if (this.errorBag.hasOwnProperty(inputId)) return;
            watchers.valid = createErrorWatcher(input);
          });
        }
      } else {
        watchers.valid = createErrorWatcher(input);
      }

      return watchers;
    },

    /** @public */
    validate() {
      return this.inputs.filter(input => !input.validate(true)).length === 0;
    },

    /** @public */
    reset() {
      this.inputs.forEach(input => input.reset());
      this.resetErrorBag();
    },

    resetErrorBag() {
      if (this.lazyValidation) {
        // Account for timeout in validatable
        setTimeout(() => {
          this.errorBag = {};
        }, 0);
      }
    },

    /** @public */
    resetValidation() {
      this.inputs.forEach(input => input.resetValidation());
      this.resetErrorBag();
    },

    register(input) {
      this.inputs.push(input);
      this.watchers.push(this.watchInput(input));
    },

    unregister(input) {
      const inputId = this.getInputUid(input);
      const foundInput = this.inputs.find(inputComponent => this.getInputUid(inputComponent) === inputId);
      if (!foundInput) return;
      const inputWatcher = this.watchers.find(watcher => watcher._uid === inputId);

      if (inputWatcher) {
        inputWatcher.valid();
        inputWatcher.shouldValidate();
      }

      this.watchers = this.watchers.filter(watcher => watcher._uid !== inputId);
      this.inputs = this.inputs.filter(inputComponent => this.getInputUid(inputComponent) !== inputId);
      delete this.errorBag[inputId];
    }

  },

  render() {
    return h('form', {
      class: 'v-form',
      novalidate: true,
      ...this.attrs$,
      onSubmit: e => this.$emit('submit', e)
    }, getSlot(this));
  }

});
//# sourceMappingURL=VForm.js.map