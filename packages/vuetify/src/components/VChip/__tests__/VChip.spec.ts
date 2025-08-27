// Libraries
import { h } from 'vue'

// Components
import VChip from '../VChip'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'

describe('VChip.ts', () => {
  let mountFunction: (options?: object) => VueWrapper<any>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VChip, {
        slots: {
          default: 'Chip Content'
        },
        global: {
          mocks: {
            $vuetify: {
              lang: {
                t: (val: string) => val,
              },
              icons: {
                component: 'VIcon',
              },
            },
          },
        },
        ...options,
      })
    }
  })

  it('should have a v-chip class', () => {
    const wrapper = mountFunction()

    expect(wrapper.classes()).toContain('v-chip')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should be removable', async () => {
    const wrapper = mountFunction({
      props: { close: true },
    })

    const close = wrapper.find('.v-chip__close')

    expect(wrapper.html()).toMatchSnapshot()

    await close.trigger('click')
    expect(wrapper.emitted('click:close')).toBeTruthy()
  })

  it('should render a colored chip', () => {
    const wrapper = mountFunction({
      props: {
        color: 'blue',
        textColor: 'green',
      },
    })

    expect(wrapper.element.classList).toContain('blue')
    expect(wrapper.element.classList).toContain('green--text')
  })

  it('should render a disabled chip', async () => {
    const wrapper = mountFunction({
      props: {
        disabled: true,
      },
    })

    expect(wrapper.element.classList).toContain('v-chip--disabled')

    await wrapper.setProps({
      close: true,
    })
    expect(wrapper.findAll('.v-chip__close')).toHaveLength(1)
  })

  it('should render a colored outline chip', () => {
    const wrapper = mountFunction({
      props: {
        outlined: true,
        color: 'blue',
      },
    })

    expect(wrapper.element.classList).toContain('blue')
    expect(wrapper.element.classList).toContain('blue--text')
  })

  it('should render a colored outline chip with text color', () => {
    const wrapper = mountFunction({
      props: {
        outlined: true,
        color: 'blue',
        textColor: 'green',
      },
    })

    expect(wrapper.element.classList).toContain('blue')
    expect(wrapper.element.classList).toContain('green--text')
  })

  it('should render a chip with filter', () => {
    const wrapper = mountFunction({
      props: {
        filter: true,
        inputValue: true,
      },
    })

    expect(wrapper.findAll('.v-chip__filter')).toHaveLength(1)
  })

  it('should call toggle event when used in the group', async () => {
    const register = jest.fn()
    const unregister = jest.fn()
    const toggle = jest.fn()
    
    const wrapper = mountFunction({
      global: {
        provide: {
          chipGroup: { register, unregister },
        },
      },
    })

    // Добавляем метод toggle к компоненту
    wrapper.vm.toggle = toggle

    await wrapper.trigger('click')
    expect(toggle).toHaveBeenCalled()
  })

  it('should conditionally show based on active prop', async () => {
    const wrapper = mountFunction({
      props: { close: true },
      attachTo: document.body,
    })
    const close = wrapper.find('.v-chip__close')

    expect(wrapper.isVisible()).toBe(true)

    await close.trigger('click')

    expect(wrapper.emitted('update:active')).toBeTruthy()

    // Simulate active.sync behavior
    await wrapper.setProps({ active: false })

    expect(wrapper.isVisible()).toBe(false)
  })
})
