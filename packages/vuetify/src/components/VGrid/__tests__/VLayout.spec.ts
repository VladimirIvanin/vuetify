// Components
import VLayout from '../VLayout'

// Utilities
import {
  mount,
  MountingOptions,
  VueWrapper,
} from '@vue/test-utils'

describe('VLayout.ts', () => {
  type Instance = InstanceType<typeof VLayout>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VLayout, {
        ...options,
      })
    }
  })

  it('should work', () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })
})
