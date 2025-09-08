// Components
import VListItemAvatar from '../VListItemAvatar'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'

// Types
import { ExtractVue } from '../../../util/mixins'

describe('VListItemAvatar.ts', () => {
  type Instance = ExtractVue<typeof VListItemAvatar>
  let mountFunction: (options?: object) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VListItemAvatar, {
        ...options,
      })
    }
  })

  it('should render component and match snapshot', () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })
})
