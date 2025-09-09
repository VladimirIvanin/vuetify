// Components
import VMessages from '../VMessages'

// Utilities
import {
  mount,
  VueWrapper,
} from '@vue/test-utils'
import { h } from 'vue'

// Types
import type { ComponentPublicInstance } from 'vue'

describe('VMessages.ts', () => {
  type Instance = ComponentPublicInstance
  let mountFunction: (options?: object) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VMessages, {
        ...options,
      })
    }
  })

  it('should have a default array', () => {
    const wrapper = mountFunction()

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.v-messages').exists()).toBe(true)
  })

  it('should show messages', async () => {
    const wrapper = mountFunction({
      props: {
        value: ['foo', 'bar'],
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ value: [] })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should allow HTML', () => {
    const wrapper = mountFunction({
      props: {
        value: ['<a href="#">a link</a>'],
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  // https://github.com/vuetifyjs/vuetify/issues/9491
  it('should not allow HTML', () => {
    const wrapper = mount(VMessages, {
      props: {
        value: ['<a href="#">a link</a>'],
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should accept a scoped slot', () => {
    const wrapper = mount(VMessages, {
      props: { value: ['Foo'] },
      slots: {
        default (props: any) {
          return h('div', props.message)
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
