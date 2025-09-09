// Components
import VFlex from '../VFlex'

// Utilities
import {
  mount,
  MountingOptions,
  VueWrapper,
} from '@vue/test-utils'

describe('VFlex.ts', () => {
  type Instance = InstanceType<typeof VFlex>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VFlex, {
        ...options,
      })
    }
  })

  it('should work', () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })
})
