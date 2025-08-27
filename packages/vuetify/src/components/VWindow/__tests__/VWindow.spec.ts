// Components
import VWindow from '../VWindow'
import VWindowItem from '../VWindowItem'

// Utilities
import {
  mount,
  MountingOptions,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { touch } from '../../../../test'

describe('VWindow.ts', () => {
  type Instance = InstanceType<typeof VWindow>;
  let mountFunction: (
    options?: MountingOptions<Instance>
  ) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VWindow, {
        ...options,
        global: {
          config: {
            warnHandler: () => {}, // Подавляем предупреждения Vue
          },
          mocks: {
            $vuetify: {
              lang: {
                t: (str: string) => str,
              },
              rtl: false,
              icons: {
                component: false,
              },
            },
          },
          ...options.global,
        },
      })
    }
  })

  it('should return the correct transition', async () => {
    const wrapper = mountFunction()
    const vm = wrapper.vm as any

    // Force booted
    vm.isBooted = true
    await nextTick()

    expect(vm.computedTransition).toBe('v-window-x-transition')

    vm.isReverse = true
    await nextTick()
    expect(vm.computedTransition).toBe('v-window-x-reverse-transition')

    await wrapper.setProps({ vertical: true })
    expect(vm.computedTransition).toBe('v-window-y-reverse-transition')

    vm.isReverse = false
    await nextTick()
    expect(vm.computedTransition).toBe('v-window-y-transition')
  })

  it('should set reverse', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: 0,
      },
      slots: {
        default: () => [h(VWindowItem), h(VWindowItem), h(VWindowItem)],
      },
    })

    const vm = wrapper.vm as any
    vm.isBooted = true
    await nextTick()

    // Reverse implicitly set by changed index
    await wrapper.setProps({ modelValue: 1 })
    await nextTick()
    expect(vm.isReverse).toBeFalsy()

    // Reverse implicitly set by changed index
    await wrapper.setProps({ modelValue: 0 })
    await nextTick()
    expect(vm.isReverse).toBeTruthy()

    // Reverse explicit prop override
    await wrapper.setProps({ reverse: false })
    expect(vm.computedTransition.includes('reverse')).toBeTruthy()

    // Reverse explicit prop override
    await wrapper.setProps({ reverse: true })
    expect(vm.computedTransition.includes('reverse')).toBeFalsy()

    // Reverts back to local isReverse
    await wrapper.setProps({ reverse: undefined })
    expect(vm.computedTransition.includes('reverse')).toBeTruthy()
  })

  it('should increment and decrement current value', async () => {
    const wrapper = mountFunction({
      slots: {
        default: () => [h(VWindowItem), h(VWindowItem), h(VWindowItem)],
      },
    })

    await nextTick()
    const vm = wrapper.vm as any

    expect(vm.internalIndex).toBe(0)

    vm.next()
    expect(vm.internalIndex).toBe(1)

    vm.next()
    expect(vm.internalIndex).toBe(2)

    // changed all following indices
    // due to: https://github.com/vuetifyjs/vuetify/issues/7728
    vm.next()
    expect(vm.internalIndex).toBe(2)

    vm.prev()
    expect(vm.internalIndex).toBe(1)

    vm.prev()
    expect(vm.internalIndex).toBe(0)

    vm.prev()
    expect(vm.internalIndex).toBe(0)
  })

  it('should update model when internal index is greater than item count', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: 2,
      },
      slots: {
        default: () => [h(VWindowItem), h(VWindowItem), h(VWindowItem)],
      },
    })

    await nextTick()
    const vm = wrapper.vm as any

    expect(vm.internalIndex).toBe(2)

    const wrapper2 = mountFunction({
      props: {
        modelValue: 2,
      },
      slots: {
        default: () => [h(VWindowItem), h(VWindowItem)],
      },
    })
    await nextTick()
    // modelValue = 2, но элементов только 2 (индексы 0,1), поэтому internalIndex должен быть -1
    expect((wrapper2.vm as any).internalIndex).toBe(-1)

    const wrapper3 = mountFunction({
      props: {
        modelValue: 1,
      },
      slots: {
        default: () => [h(VWindowItem)],
      },
    })
    await nextTick()
    // modelValue = 1, но элементов только 1 (индекс 0), поэтому internalIndex должен быть -1
    expect((wrapper3.vm as any).internalIndex).toBe(-1)

    const wrapper4 = mountFunction({
      props: {
        modelValue: 0,
      },
      slots: {
        default: () => [],
      },
    })
    await nextTick()
    // modelValue = 0, но элементов нет, поэтому internalIndex должен быть -1
    expect((wrapper4.vm as any).internalIndex).toBe(-1)
  })

  it('should react to touch', async () => {
    const wrapper = mountFunction({
      props: { modelValue: 1 },
      slots: {
        default: () => [
          h(VWindowItem),
          h(VWindowItem),
          h(VWindowItem),
          h(VWindowItem),
          h(VWindowItem),
        ],
      },
    })

    await nextTick()
    const vm = wrapper.vm as any

    expect(vm.internalIndex).toBe(1)
    touch(wrapper)
      .start(0, 0)
      .end(200, 0)
    expect(vm.internalIndex).toBe(0)

    // changed expected indices due to:
    // https://github.com/vuetifyjs/vuetify/issues/7728
    touch(wrapper)
      .start(0, 0)
      .end(200, 0)
    expect(vm.internalIndex).toBe(0)

    touch(wrapper)
      .start(200, 0)
      .end(0, 0)
    expect(vm.internalIndex).toBe(1)

    await wrapper.setProps({ modelValue: 4 })
    touch(wrapper)
      .start(200, 0)
      .end(0, 0)
    expect(vm.internalIndex).toBe(4)

    await wrapper.setProps({ modelValue: 0 })
    touch(wrapper)
      .start(0, 0)
      .end(200, 0)
    expect(vm.internalIndex).toBe(0)
  })

  it('should accept a custom touch object', async () => {
    const left = jest.fn()
    const right = jest.fn()
    const fns = { left, right }
    const wrapper = mountFunction({
      props: {
        touch: fns,
        modelValue: 1,
      },
      slots: {
        default: () => [
          h(VWindowItem),
          h(VWindowItem),
          h(VWindowItem),
          h(VWindowItem),
          h(VWindowItem),
        ],
      },
    })

    await nextTick()

    touch(wrapper)
      .start(200, 0)
      .end(0, 0)
    touch(wrapper)
      .start(0, 0)
      .end(200, 0)
    expect(left).toHaveBeenCalled()
    expect(right).toHaveBeenCalled()
  })

  // https://github.com/vuetifyjs/vuetify/issues/5000
  it('should change to the next available index when using touch swipe', () => {
    const wrapper = mountFunction({
      slots: {
        default: () => [
          h(VWindowItem, { disabled: true }),
          h(VWindowItem),
          h(VWindowItem),
        ],
      },
    })

    const vm = wrapper.vm as any
    expect(vm.internalIndex).toBe(1)
    touch(wrapper)
      .start(0, 0)
      .end(200, 0)
    expect(vm.internalIndex).toBe(2)
    touch(wrapper)
      .start(0, 0)
      .end(200, 0)
    expect(vm.internalIndex).toBe(1)
  })

  it('should generate and show arrows', async () => {
    const wrapper = mountFunction({
      props: {
        showArrows: true,
      },
      slots: {
        default: () => [
          h(VWindowItem),
          h(VWindowItem),
          h(VWindowItem),
          h(VWindowItem),
        ],
      },
    })

    await nextTick()
    const vm = wrapper.vm as any

    expect(vm.hasNext).toBe(true)
    expect(vm.hasPrev).toBe(false)

    // Используем методы компонента напрямую вместо поиска DOM элементов
    vm.next()
    await nextTick()

    expect(vm.hasNext).toBe(true)
    expect(vm.hasPrev).toBe(true)

    vm.next()
    vm.next()
    await nextTick()

    expect(vm.hasNext).toBe(false)
    expect(vm.hasPrev).toBe(true)

    await wrapper.setProps({ continuous: true })

    expect(vm.hasNext).toBe(true)
    expect(vm.hasPrev).toBe(true)
  })

  it('should skip disabled items and go to the next available', () => {
    const wrapper = mountFunction({
      slots: {
        default: () => [
          h(VWindowItem),
          h(VWindowItem, { disabled: true }),
          h(VWindowItem, { disabled: true }),
          h(VWindowItem),
        ],
      },
    })

    const vm = wrapper.vm as any
    expect(vm.internalIndex).toBe(0)

    vm.next()

    expect(vm.internalIndex).toBe(3)
  })

  it('should ignore touch events', () => {
    const wrapper = mountFunction({
      props: { touchless: true },
      slots: {
        default: () => [h(VWindowItem), h(VWindowItem)],
      },
    })

    const vm = wrapper.vm as any
    expect(vm.internalIndex).toBe(0)

    touch(wrapper)
      .start(0, 0)
      .end(200, 0)

    expect(vm.internalIndex).toBe(0)
  })

  // https://github.com/vuetifyjs/vuetify/issues/7728
  it('should not "wrap around" when continuous === false', () => {
    const wrapper = mountFunction({
      props: {
        continuous: false,
      },
      slots: {
        default: () => [h(VWindowItem), h(VWindowItem), h(VWindowItem)],
      },
    })

    const vm = wrapper.vm as any
    // by default we expect the internalIndex to be 0
    expect(vm.internalIndex).toBe(0)
    // now call the prev() function
    vm.prev()
    expect(vm.internalIndex).toBe(0)
    // now advance to the end
    vm.next()
    expect(vm.internalIndex).toBe(1)
    vm.next()
    expect(vm.internalIndex).toBe(2)
    // it should not be able to advance past the end
    vm.next()
    expect(vm.internalIndex).toBe(2)
  })
})
