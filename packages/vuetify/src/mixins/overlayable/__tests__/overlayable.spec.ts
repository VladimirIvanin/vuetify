// Components
import Overlayable from '../index'

// Utilities
import { mount, MountingOptions, VueWrapper, enableAutoUnmount } from '@vue/test-utils'
import { waitAnimationFrame } from '../../../../test'
import { defineComponent, h, nextTick } from 'vue'

describe('Overlayable.ts', () => {
  enableAutoUnmount(afterEach)

  const Mock = defineComponent({
    mixins: [Overlayable],
    data: () => ({
      isActive: false,
    }),
    render: () => h('div'),
  })

  beforeEach(() => {
    document.body.setAttribute('data-app', 'true')
  })

  type Instance = InstanceType<typeof Mock>;
  let mountFunction: (options?: MountingOptions<any>) => VueWrapper<any>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(Mock, {
        global: {
          mocks: {
            $vuetify: { breakpoint: {} },
          },
        },
        ...options,
      })
    }
  })

  it('should avoid removing overlay', async () => {
    const wrapper = mountFunction()

    wrapper.vm.genOverlay()

    await waitAnimationFrame()

    expect(wrapper.vm.overlay).toBeTruthy()

    wrapper.vm.removeOverlay()
    // Simulate overlay being rapidly opened/closed
    wrapper.vm.overlay.value = true

    const event = new Event('transitionend')

    wrapper.vm.overlay.$el.dispatchEvent(event)
    expect(wrapper.vm.overlay).toBeTruthy()

    wrapper.vm.removeOverlay()

    wrapper.vm.overlay.$el.dispatchEvent(event)
    expect(wrapper.vm.overlay).toBeFalsy()
  })

  it('should be removed', async () => {
    const wrapper = mountFunction()

    wrapper.vm.genOverlay()
    wrapper.vm.removeOverlay()

    await waitAnimationFrame()
    expect(wrapper.vm.overlay.value).toBeFalsy()

    const event = new Event('transitionend')
    wrapper.vm.overlay.$el.dispatchEvent(event)
    expect(wrapper.vm.overlay).toBeFalsy()
  })

  // https://github.com/vuetifyjs/vuetify/issues/8473
  it('should get root element z-index if activeIndex is not available', async () => {
    const wrapper = mountFunction()

    wrapper.vm.$el.style.zIndex = '8'

    wrapper.vm.genOverlay()

    await waitAnimationFrame()

    expect(wrapper.vm.overlay.zIndex).toBe(8)
  })

  // https://github.com/vuetifyjs/vuetify/issues/8142
  it('should not update overlay state if not active', async () => {
    const cb = jest.fn()
    const wrapper = mountFunction({
      global: {
        mocks: {
          $vuetify: { breakpoint: {} },
        },
      },
    })

    // Mock the methods
    wrapper.vm.removeOverlay = cb
    wrapper.vm.genOverlay = cb

    await wrapper.setProps({ hideOverlay: true })
    await wrapper.setProps({ hideOverlay: false })

    expect(cb).not.toHaveBeenCalled()

    wrapper.vm.isActive = true
    await nextTick()

    await wrapper.setProps({ hideOverlay: true })
    await wrapper.setProps({ hideOverlay: false })

    expect(cb).toHaveBeenCalledTimes(2)
  })
})
