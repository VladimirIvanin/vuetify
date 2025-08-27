// Libraries
// Components
import VAppBarNavIcon from '../VAppBarNavIcon'

// Utilities
import {
  mount,
  VueWrapper,
} from '@vue/test-utils'

describe('AppBarNavIcon.ts', () => {
  let mountFunction: (options?: object) => VueWrapper<any>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VAppBarNavIcon, {
        ...options,
      })
    }
  })

  it('should render correctly', () => {
    const wrapper = mountFunction()
    expect(wrapper.html()).toMatchSnapshot()
  })
})
