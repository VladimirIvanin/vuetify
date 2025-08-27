import { h, VNode } from 'vue'
// Components
import VInput from '../VInput/VInput'

// Mixins
import mixins from '../../util/mixins'
import BindsAttrs from '../../mixins/binds-attrs'
import { provide as RegistrableProvide } from '../../mixins/registrable'

// Helpers
import { getSlot } from '../../util/helpers'

type ErrorBag = Record<number, boolean>
type VInputInstance = InstanceType<typeof VInput>
type Watchers = {
  _uid: number
  valid: () => void
  shouldValidate: () => void
}

interface VFormContext {
  inputs: VInputInstance[]
  watchers: Watchers[]
  errorBag: ErrorBag
  lazyValidation: boolean
  $emit: (event: string, ...args: any[]) => void
  getInputUid: (input: VInputInstance) => number
  watchInput: (input: VInputInstance) => Watchers
  resetErrorBag: () => void
}

/* @vue/component */
export default mixins(
  BindsAttrs,
  RegistrableProvide('form')
  /* @vue/component */
).extend({
  name: 'v-form',

  provide (): object {
    return { form: this }
  },

  inheritAttrs: false,

  props: {
    disabled: Boolean,
    lazyValidation: Boolean,
    readonly: Boolean,
    value: Boolean,
  },

  data: () => ({
    inputs: [] as VInputInstance[],
    watchers: [] as Watchers[],
    errorBag: {} as ErrorBag,
  }),

  watch: {
    errorBag: {
      handler (this: VFormContext, val: ErrorBag) {
        const errors = Object.values(val).includes(true)

        this.$emit('input', !errors)
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    getInputUid (input: VInputInstance): number {
      return input.$.uid
    },

    watchInput (this: VFormContext, input: VInputInstance): Watchers {
      const inputId = this.getInputUid(input)

      const createErrorWatcher = (inputComponent: VInputInstance): (() => void) => {
        if (typeof inputComponent.$watch === 'function') {
          return inputComponent.$watch('hasError', (hasError: boolean) => {
            this.errorBag[inputId] = hasError
          }, { immediate: true })
        } else {
          // Fallback для Vue 3
          return () => {}
        }
      }

      const watchers: Watchers = {
        _uid: inputId,
        valid: () => {},
        shouldValidate: () => {},
      }

      if (this.lazyValidation) {
        if (typeof input.$watch === 'function') {
          watchers.shouldValidate = input.$watch('shouldValidate', (shouldValidate: boolean) => {
            if (!shouldValidate) return

            if (this.errorBag.hasOwnProperty(inputId)) return

            watchers.valid = createErrorWatcher(input)
          })
        }
      } else {
        watchers.valid = createErrorWatcher(input)
      }

      return watchers
    },
    /** @public */
    validate (this: VFormContext): boolean {
      return this.inputs.filter((input: VInputInstance) => !input.validate(true)).length === 0
    },
    /** @public */
    reset (this: VFormContext): void {
      this.inputs.forEach((input: VInputInstance) => input.reset())
      this.resetErrorBag()
    },
    resetErrorBag (this: VFormContext) {
      if (this.lazyValidation) {
        // Account for timeout in validatable
        setTimeout(() => {
          this.errorBag = {}
        }, 0)
      }
    },
    /** @public */
    resetValidation (this: VFormContext) {
      this.inputs.forEach((input: VInputInstance) => input.resetValidation())
      this.resetErrorBag()
    },

    register (this: VFormContext, input: VInputInstance) {
      this.inputs.push(input)
      this.watchers.push(this.watchInput(input))
    },

    unregister (this: VFormContext, input: VInputInstance) {
      const inputId = this.getInputUid(input)
      const foundInput = this.inputs.find((inputComponent: VInputInstance) => this.getInputUid(inputComponent) === inputId)

      if (!foundInput) return

      const inputWatchers = this.watchers.find((watcher: Watchers) => watcher._uid === inputId)
      if (inputWatchers) {
        inputWatchers.valid()
        inputWatchers.shouldValidate()
      }

      this.watchers = this.watchers.filter((watcher: Watchers) => watcher._uid !== inputId)
      this.inputs = this.inputs.filter((inputComponent: VInputInstance) => this.getInputUid(inputComponent) !== inputId)

      delete this.errorBag[inputId]
    },
  },

  render (): VNode {
    return h('form', {
      class: 'v-form',
      novalidate: true,
      ...this.attrs$,
      onSubmit: (e: Event) => this.$emit('submit', e),
    }, getSlot(this))
  },
})
