// Components
import VTab from '../VTab'

// Utilities
import {
  mount,
  RouterLinkStub,
  VueWrapper,
} from '@vue/test-utils'

describe('VTab.ts', () => {
  type Instance = InstanceType<typeof VTab>
  let mountFunction: (options?: object) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VTab, {
        ...options,
      })
    }
  })

  it('should have the correct value', async () => {
    const wrapper = mountFunction({
      props: {
        href: '#foo',
      },
      global: {
        mocks: {
          $route: { path: '/' },
          $router: {
            resolve: (to: any) => {
              let href
              if (to.path) href = to.path

              return { href }
            },
          },
        },
        stubs: {
          'router-link': RouterLinkStub,
        },
      },
    })

    expect(wrapper.vm.value).toBe('foo')
    await wrapper.setProps({ href: null, to: '/foo' })
    expect(wrapper.vm.value).toBe('/foo')
    await wrapper.setProps({ to: { path: 'bar' } })
    expect(wrapper.vm.value).toBe('bar')
  })

  // Still unsure how to test actual implementation
  it('should react to route change', async () => {
    const toggle = jest.fn()
    const wrapper = mountFunction({
      props: {
        activeClass: 'bar',
        to: 'foo',
      },
      global: {
        mocks: {
          $route: { path: '/' },
        },
        stubs: {
          'router-link': RouterLinkStub,
        },
      },
    })

    // Mock the toggle method
    wrapper.vm.toggle = toggle

    // Mock route change being called
    wrapper.vm.onRouteChange()
    await wrapper.vm.$nextTick()

    expect(toggle).not.toHaveBeenCalled()

    // explicitly mock class added
    // by vue router
    if (wrapper.vm.$refs.link) {
      ;(wrapper.vm.$refs.link as any)._vnode = {
        data: {
          class: { 'bar v-tab--active': true },
        }
      }
    }
    ;(wrapper.vm as any).$route.path = '/foo'

    wrapper.vm.onRouteChange()
    await wrapper.vm.$nextTick()

    await wrapper.setProps({ to: undefined })

    wrapper.vm.onRouteChange()
    await wrapper.vm.$nextTick()

    expect(toggle).toHaveBeenCalledTimes(1)
  })

  it('should respond to clicks and mousedown.enter', async () => {
    const event = { preventDefault: jest.fn() }
    const toggle = jest.fn()
    const wrapper = mountFunction()

    // Mock the toggle method
    wrapper.vm.toggle = toggle

    await wrapper.trigger('click', event)

    expect(event.preventDefault).not.toHaveBeenCalled()
    expect(toggle).toHaveBeenCalled()

    await wrapper.setProps({ href: '#foo' })

    await wrapper.trigger('click', event)

    expect(event.preventDefault).toHaveBeenCalled()

    await wrapper.trigger('keydown.enter', event)
    await wrapper.trigger('keydown.space', event)

    expect(event.preventDefault).toHaveBeenCalledTimes(2)
    expect(toggle).toHaveBeenCalledTimes(3)
  })
})
