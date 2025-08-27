// Components
import VTabsSlider from '../VTabsSlider'

// Utilities
import {
  mount,
  VueWrapper,
} from '@vue/test-utils'

describe('VTabsSlider.ts', () => {
  type Instance = InstanceType<typeof VTabsSlider>
  let mountFunction: (options?: object) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VTabsSlider, {
        ...options,
      })
    }
  })

  it('should render a tabs slider', () => {
    const wrapper = mountFunction({
      props: {
        color: 'blue lighten-1',
      },
    })

    expect(wrapper.element.classList).toContain('blue')
    expect(wrapper.element.classList).toContain('lighten-1')
  })
})
