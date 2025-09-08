// Components
import VListItemGroup from '../VListItemGroup'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'

describe('VListItemGroup.ts', () => {
  type Instance = InstanceType<typeof VListItemGroup>
  let mountFunction: (options?: object) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VListItemGroup, {
        ...options,
      })
    }
  })

  it('should have the correct role', () => {
    const wrapper = mountFunction()

    expect(wrapper.element.getAttribute('role')).toBe('listbox')
  })
})
