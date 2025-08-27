// Components
import Selectable from '../index'

// Utilities
import {
  mount,
  VueWrapper,
  MountingOptions,
  enableAutoUnmount,
} from '@vue/test-utils'
import { ComponentPublicInstance, h, defineComponent } from 'vue'

describe('Selectable.ts', () => {
  const Mock = defineComponent({
    mixins: [Selectable],
    render: () => h('div'),
  })

  type Instance = ComponentPublicInstance & InstanceType<typeof Mock>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(Mock, {
        ...options,
      })
    }
  })

  it('should update lazyValue and hasColor data when value changes', async () => {
    const wrapper = mountFunction()

    expect(wrapper.vm.lazyValue).toBeUndefined()
    expect(wrapper.vm.hasColor).toBeUndefined()

    await wrapper.setProps({ modelValue: true })

    expect(wrapper.vm.lazyValue).toBe(true)
    expect(wrapper.vm.hasColor).toBe(true)
  })

  it('should handle disabled state', async () => {
    const wrapper = mountFunction({
      props: {
        disabled: true,
      },
    })

    expect(wrapper.vm.rippleState).toBeUndefined()
  })
})
