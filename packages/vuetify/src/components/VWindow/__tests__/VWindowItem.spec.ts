// Libraries
import { h, nextTick } from 'vue'

// Components
import VWindow from '../VWindow'
import VWindowItem from '../VWindowItem'

// Utilities
import {
  mount,
  VueWrapper,
  MountingOptions,
  enableAutoUnmount,
} from '@vue/test-utils'
import { waitAnimationFrame } from '../../../../test'

describe('VWindowItem.ts', () => {
  type Instance = InstanceType<typeof VWindowItem>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  // Включаем автоматическое размонтирование после каждого теста
  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VWindowItem, {
        global: {
          config: {
            warnHandler: () => {}, // Подавляем предупреждения Vue
          },
        },
        ...options,
      })
    }
  })

  // eslint-disable-next-line max-statements
  it('should transition content', async () => {
    const wrapper = mount(VWindow, {
      slots: {
        default: () => [h(VWindowItem)],
      },
      global: {
        config: {
          warnHandler: () => {}, // Подавляем предупреждения Vue
        },
        mocks: {
          $vuetify: {
            rtl: false,
          },
        },
      },
    })

    await waitAnimationFrame()

    const item = wrapper.findComponent(VWindowItem)
    // Before enter
    expect(wrapper.vm.isActive).toBeFalsy()
    expect(wrapper.vm.transitionHeight).toBeUndefined()
    item.vm.onBeforeTransition()
    expect(wrapper.vm.isActive).toBeTruthy()
    expect(wrapper.vm.transitionHeight).toBe('0px')

    // Enter
    const el = { clientHeight: 50 }
    item.vm.onEnter(el)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.transitionHeight).toBe('50px')

    // After enter
    item.vm.onAfterTransition()
    expect(wrapper.vm.transitionHeight).toBeUndefined()
    expect(wrapper.vm.isActive).toBeFalsy()

    // Canceling
    item.vm.onBeforeTransition()
    item.vm.onEnter(el)
    item.vm.onTransitionCancelled()

    expect(item.vm.inTransition).toBeFalsy()
    expect(wrapper.vm.isActive).toBeFalsy()

    // Normal path.
    item.vm.onBeforeTransition()
    expect(wrapper.vm.isActive).toBeTruthy()
    item.vm.onAfterTransition()

    expect(wrapper.vm.isActive).toBeFalsy()
  })

  it('should use custom transition', async () => {
    const wrapper = mountFunction({
      props: {
        transition: 'foo',
        reverseTransition: 'bar',
      },
      data: () => ({
        windowGroup: {
          internalReverse: false,
          register: () => {},
          unregister: () => {},
        },
      }),
    })

    expect(wrapper.vm.computedTransition).toBe('foo')

    await wrapper.setProps({ transition: false })
    await nextTick()
    // В Vue 3 нужно дождаться обновления computed
    expect(wrapper.vm.computedTransition).toBe('')

    wrapper.vm.windowGroup.internalReverse = true
    await nextTick()
    expect(wrapper.vm.computedTransition).toBe('bar')

    await wrapper.setProps({ reverseTransition: false })
    await nextTick()
    expect(wrapper.vm.computedTransition).toBe('')
  })

  it('should not set initial height if no computedTransition', async () => {
    const heightChanged = jest.fn()
    const wrapper = mount(VWindow, {
      props: {
        transition: false,
        reverseTransition: false,
      },
      watch: {
        transitionHeight: heightChanged,
      },
      slots: {
        default: () => [h(VWindowItem)],
      },
      global: {
        config: {
          warnHandler: () => {}, // Подавляем предупреждения Vue
        },
        mocks: {
          $vuetify: {
            rtl: false,
          },
        },
      },
    })

    const item = wrapper.findComponent(VWindowItem)
    expect(wrapper.vm.computedTransition).toBeFalsy()

    item.vm.onBeforeTransition()
    expect(wrapper.vm.isActive).toBeTruthy()
    // В Vue 3 watch может не срабатывать сразу, поэтому проверяем после nextTick
    await nextTick()
    expect(heightChanged).toHaveBeenCalledTimes(1)

    item.vm.onEnter(wrapper.element)
    await waitAnimationFrame()
    expect(wrapper.vm.isActive).toBeTruthy()

    expect(heightChanged).toHaveBeenCalledTimes(1)
  })

  it('should increase and decrease transition count correctly', () => {
    const wrapper = mount(VWindow, {
      slots: {
        default: () => [h(VWindowItem), h(VWindowItem), h(VWindowItem)],
      },
      global: {
        config: {
          warnHandler: () => {}, // Подавляем предупреждения Vue
        },
        mocks: {
          $vuetify: {
            rtl: false,
          },
        },
      },
    })

    const items = wrapper.vm.items as any[]
    expect(items).toHaveLength(3)

    expect(wrapper.vm.transitionCount).toBe(0)
    expect(wrapper.vm.isActive).toBeFalsy()
    items[0].onBeforeTransition()
    expect(wrapper.vm.transitionCount).toBe(1)
    expect(wrapper.vm.isActive).toBeTruthy()
    items[1].onBeforeTransition()
    expect(wrapper.vm.transitionCount).toBe(2)
    expect(wrapper.vm.isActive).toBeTruthy()
    items[0].onTransitionCancelled()
    expect(wrapper.vm.transitionCount).toBe(1)
    expect(wrapper.vm.isActive).toBeTruthy()
    items[2].onBeforeTransition()
    expect(wrapper.vm.transitionCount).toBe(2)
    expect(wrapper.vm.isActive).toBeTruthy()
    items[1].onAfterTransition()
    expect(wrapper.vm.transitionCount).toBe(1)
    expect(wrapper.vm.isActive).toBeTruthy()
    items[2].onAfterTransition()
    expect(wrapper.vm.transitionCount).toBe(0)
    expect(wrapper.vm.isActive).toBeFalsy()
  })
})
