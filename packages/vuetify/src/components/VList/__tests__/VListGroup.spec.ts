// Components
import VListGroup from '../VListGroup'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'

describe('VListGroup.ts', () => {
  type Instance = InstanceType<typeof VListGroup>
  let mountFunction: (options?: object) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VListGroup, {
        ...options,
      })
    }
  })

  it('should render component and match snapshot', () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should open if no value provided and group matches route', async () => {
    const $route = { path: '/foo' }
    const listClick = jest.fn()
    const wrapper = mountFunction({
      global: {
        provide: {
          list: {
            listClick,
            register: jest.fn(),
            unregister: jest.fn(),
          },
        },
        mocks: {
          $route,
        },
      },
      props: {
        group: 'foo',
      },
    })

    await wrapper.vm.$nextTick()
    expect(listClick).toHaveBeenCalledWith(wrapper.vm.$.uid)
  })

  it('should toggle when clicked', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: false,
      },
    })

    wrapper.vm.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.vm.isActive).toBe(true)
  })

  it('should register when mounted', () => {
    const register = jest.fn()
    const wrapper = mountFunction({
      global: {
        provide: {
          list: {
            register,
            unregister: () => {},
          },
        },
      },
    })

    expect(register).toHaveBeenCalledWith(wrapper.vm)
  })

  it('should unregister when destroyed', async () => {
    const unregister = jest.fn()
    const wrapper = mountFunction({
      global: {
        provide: {
          list: {
            register: () => {},
            unregister,
          },
        },
      },
    })

    wrapper.unmount()
    await wrapper.vm.$nextTick()
    expect(unregister).toHaveBeenCalledWith(wrapper.vm)
  })

  it('should render a custom affix icons', async () => {
    const wrapper = mountFunction({
      slots: {
        appendIcon: '<span>foo</span>',
        prependIcon: '<span>bar</span>',
      },
    })

    expect(wrapper.html()).toContain('<span>foo</span>')
    expect(wrapper.html()).toContain('<span>bar</span>')
  })

  it('should respond to keydown.enter on header', async () => {
    const wrapper = mountFunction({
      slots: {
        activator: {
          template: '<span>foo</span>',
        },
      },
    })

    const span = wrapper.find('span')

    await span.trigger('keydown.enter')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('should set active state if route changes and group present', async () => {
    const listClick = jest.fn()
    const $route = { path: '/bar' }
    const wrapper = mountFunction({
      global: {
        provide: {
          list: {
            listClick,
            register: () => {},
            unregister: () => {},
          },
        },
        mocks: { $route },
      },
      props: {
        group: 'foo',
      },
    })

    expect(wrapper.vm.isActive).toBe(false)

    // Simulate route changing
    wrapper.vm.$route.path = '/foo'
    wrapper.vm.onRouteChange(wrapper.vm.$route)

    expect(wrapper.vm.isActive).toBe(true)
    expect(listClick).toHaveBeenCalledWith(wrapper.vm.$.uid)
  })

  it('should not react to clicks when disabled', async () => {
    const wrapper = mountFunction({
      props: {
        disabled: true,
      },
      slots: {
        activator: { template: '<span class="bar">foo</span>' },
      },
    })

    const span = wrapper.find('span.bar')

    expect(wrapper.vm.isActive).toBe(false)
    await span.trigger('click')
    expect(wrapper.vm.isActive).toBe(false)
  })

  it('should toggle is uid matches', async () => {
    const wrapper = mountFunction()

    expect(wrapper.vm.isActive).toBe(false)
    wrapper.vm.toggle(100)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isActive).toBe(false)
    wrapper.vm.toggle(wrapper.vm.$.uid)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isActive).toBe(true)
  })

  it('should have the correct a11y attributes', async () => {
    const wrapper = mountFunction()
    const header = wrapper.find('.v-list-group__header')

    expect(header.element.tabIndex).toBe(-1)
    expect(header.element.getAttribute('aria-expanded')).toBe('false')
    expect(header.element.getAttribute('role')).toBe('button')

    await wrapper.setData({ isActive: true })

    expect(header.element.getAttribute('aria-expanded')).toBe('true')
  })
})
