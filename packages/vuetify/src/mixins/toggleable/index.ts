import { defineComponent, ComponentPublicInstance } from 'vue'

export type Toggleable<T extends string = 'value'> = ReturnType<
  typeof defineComponent
> & {
  isActive: boolean
} & Record<T, any>;

export function factory<T extends string = 'value'>(
  prop?: T,
  event?: string
): Toggleable<T>;
export function factory (prop = 'modelValue', event = 'update:modelValue') {
  return defineComponent({
    name: 'toggleable',
    props: {
      [prop]: { required: false },
    },

    data () {
      return {
        isActive: !!this[prop],
      }
    },

    watch: {
      [prop] (val) {
        this.isActive = !!val
      },
      isActive (val) {
        !!val !== !!this[prop] && this.$emit(event, val)
      },
    },
  })
}

/* eslint-disable-next-line @typescript-eslint/no-redeclare */
const Toggleable = factory();

// Export factory function as a property
(Toggleable as any).factory = factory

export default Toggleable
