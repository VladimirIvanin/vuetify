// Mixins
import Elevatable from '../'

// Utilities
import { mount, VueWrapper, MountingOptions } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

const Component = defineComponent({
  mixins: [Elevatable],
  render () {
    return h('div')
  },
})

describe('elevatable.ts', () => {
  type Instance = InstanceType<typeof Component>;
  let mountFunction: (options?: MountingOptions<any>) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(Component, {
        ...options,
      })
    }
  })

  it('generate elevation classes', async () => {
    const wrapper = mountFunction()

    expect(wrapper.vm.computedElevation).toBeUndefined()
    expect(wrapper.vm.elevationClasses).toEqual({})

    await wrapper.setProps({ elevation: 1 })
    expect(wrapper.vm.computedElevation).toBe(1)
    expect(wrapper.vm.elevationClasses).toEqual({
      'elevation-1': true,
    })

    await wrapper.setProps({ elevation: '12' })
    expect(wrapper.vm.computedElevation).toBe('12')
    expect(wrapper.vm.elevationClasses).toEqual({
      'elevation-12': true,
    })

    await wrapper.setProps({ elevation: 0 })
    expect(wrapper.vm.computedElevation).toBe(0)
    expect(wrapper.vm.elevationClasses).toEqual({
      'elevation-0': true,
    })
  })
})
