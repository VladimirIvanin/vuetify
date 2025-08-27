// Components
import Bootable from '../index'

// Utilities
import {
  mount,
  enableAutoUnmount,
} from '@vue/test-utils'
import { h, defineComponent, Comment } from 'vue'

describe('Bootable.ts', () => {
  enableAutoUnmount(afterEach)

  it('should be booted after activation', async () => {
    const wrapper = mount({
      mixins: [Bootable],
      render: () => h('div'),
      data: () => ({
        isActive: false,
      }),
    })

    expect(wrapper.vm.isBooted).toBe(false)
    wrapper.vm.isActive = true
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isBooted).toBe(true)
  })

  it('should return lazy content', async () => {
    const TestComponent = defineComponent({
      mixins: [Bootable],
      props: {
        eager: Boolean,
      },
      render: () => h('div'),
    })

    const wrapper = mount(TestComponent, {
      props: {
        eager: true,
      },
    })

    const content = wrapper.vm.showLazyContent(() => [h('div', 'content')])
    expect(content).toHaveLength(1)
    expect(content[0].type).toBe('div')

    const wrapperLazy = mount({
      mixins: [Bootable],
      render: () => h('div'),
      data: () => ({
        isActive: false,
      }),
    })

    const lazyContent = wrapperLazy.vm.showLazyContent(() => [h('div', 'content')])
    expect(lazyContent).toHaveLength(1)
    expect(lazyContent[0].type).toBe(Comment)

    wrapperLazy.vm.isActive = true
    await wrapper.vm.$nextTick()
    const activeContent = wrapperLazy.vm.showLazyContent(() => [h('div', 'content')])
    expect(activeContent).toHaveLength(1)
    expect(activeContent[0].type).toBe('div')

    wrapperLazy.vm.isActive = false
    await wrapper.vm.$nextTick()
    const inactiveContent = wrapperLazy.vm.showLazyContent(() => [h('div', 'content')])
    expect(inactiveContent).toHaveLength(1)
    expect(inactiveContent[0].type).toBe('div')
  })

  it('should show if lazy and active at boot', async () => {
    const TestComponent = defineComponent({
      mixins: [Bootable],
      props: {
        eager: Boolean,
      },
      render: () => h('div'),
    })

    const wrapper = mount(TestComponent, {
      props: {
        eager: true,
      },
    })

    const content = wrapper.vm.showLazyContent(() => [h('div', 'content')])
    expect(content).toHaveLength(1)
    expect(content[0].type).toBe('div')
  })

  it('should boot', async () => {
    const wrapper = mount({
      mixins: [Bootable],
      render: () => h('div'),
      data: () => ({ isActive: false }),
    })

    expect(wrapper.vm.isActive).toBe(false)
    expect(wrapper.vm.isBooted).toBe(false)

    wrapper.vm.isActive = true
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isBooted).toBe(true)
  })
})
