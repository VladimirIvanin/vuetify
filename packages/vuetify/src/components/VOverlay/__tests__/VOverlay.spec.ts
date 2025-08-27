// Components
import VOverlay from '../VOverlay'

// Utilities
import {
  mount,
  VueWrapper,
} from '@vue/test-utils'

describe('VOverlay.ts', () => {
  type Instance = InstanceType<typeof VOverlay>
  let mountFunction: (options?: object) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VOverlay, {
        ...options,
      })
    }
  })

  it('should have a conditional opacity', async () => {
    const wrapper = mountFunction({
      props: { modelValue: false },
    })

    expect(wrapper.vm.computedOpacity).toBe(0)

    await wrapper.setProps({ modelValue: true })
    expect(wrapper.vm.computedOpacity).toBe(0.46)

    await wrapper.setProps({ opacity: 0.55 })
    expect(wrapper.vm.computedOpacity).toBe(0.55)

    await wrapper.setProps({ modelValue: false })
    expect(wrapper.vm.computedOpacity).toBe(0)
  })
})
