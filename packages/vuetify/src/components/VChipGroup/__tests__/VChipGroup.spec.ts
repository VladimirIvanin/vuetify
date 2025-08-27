// Libraries
import { h } from 'vue'

// Components
import VChipGroup from '../VChipGroup'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'

describe('VChipGroup.ts', () => {
  let mountFunction: (options?: object) => VueWrapper<any>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VChipGroup, {
        global: {
          mocks: {
            $vuetify: {
              breakpoint: {},
            },
          },
        },
        ...options,
      })
    }
  })

  it('should have a v-chip-group class', () => {
    const wrapper = mountFunction()

    expect(wrapper.classes()).toContain('v-chip-group')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render column', () => {
    const wrapper = mountFunction({
      props: {
        column: true,
      },
    })

    expect(wrapper.classes()).toContain('v-chip-group--column')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should switch to column', async () => {
    const wrapper = mountFunction()

    expect(wrapper.classes()).not.toContain('v-chip-group--column')
    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({
      column: true,
    })

    expect(wrapper.classes()).toContain('v-chip-group--column')
    expect(wrapper.html()).toMatchSnapshot()
  })
})
