// Libraries
import { defineComponent } from 'vue'

// Components
import VSheet from '../VSheet'

// Utilities
import {
  shallowMount,
  VueWrapper,
} from '@vue/test-utils'

describe('VSheet.ts', () => {
  let mountFunction: (options?: Record<string, any>) => VueWrapper<any>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return shallowMount(VSheet, options)
    }
  })

  it('should render component and match snapshot', () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render a colored paper', () => {
    const wrapper = mountFunction({
      props: {
        color: 'blue lighten-1',
      },
    })

    expect(wrapper.element.classList).toContain('blue')
    expect(wrapper.element.classList).toContain('lighten-1')
  })

  it('should render a tile paper', () => {
    const wrapper = mountFunction({
      props: {
        tile: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
