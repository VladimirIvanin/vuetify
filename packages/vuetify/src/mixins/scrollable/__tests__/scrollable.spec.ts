// Components
import Scrollable from '../'

// Utilities
import { mount, VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { scrollWindow } from '../../../../test'

describe('Scrollable.ts', () => {
  type Instance = InstanceType<typeof Scrollable>;
  let mountFunction: (options?: object) => VueWrapper<Instance>

  const createMockComponent = (options = {}) => {
    return defineComponent({
      mixins: [Scrollable],
      ...options,
      render () {
        return h('div', {
          onScroll: this.onScroll,
        })
      },
    })
  }

  beforeEach(() => {
    const Mock = createMockComponent()
    mountFunction = (options = {}) => {
      return mount(Mock, {
        ...options,
      })
    }
  })

  it('should set isScrollingUp', async () => {
    const wrapper = mountFunction()

    // Сначала скроллим вниз
    await scrollWindow(1000)
    wrapper.vm.onScroll()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isScrollingUp).toBe(false)

    // Затем скроллим вверх
    await scrollWindow(0)
    wrapper.vm.onScroll()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isScrollingUp).toBe(true)
  })

  it('should set a custom target', async () => {
    const wrapper = mountFunction({
      props: {
        scrollTarget: 'body',
      },
    })

    wrapper.vm.onScroll()
    expect(wrapper.vm.target).toBe(document.body)
  })

  it('should do nothing if !canScroll', async () => {
    const wrapper = mountFunction({
      data () {
        return {
          currentScroll: 100,
          previousScroll: 0,
        }
      },
      computed: {
        canScroll () {
          return false
        },
      },
    })

    await scrollWindow(1000)
    wrapper.vm.onScroll()

    expect(wrapper.vm.currentScroll).toBe(100)
    expect(wrapper.vm.previousScroll).toBe(0)
  })

  it('should accept a custom scrollThreshold', async () => {
    const thresholdMet = jest.fn()

    // Создаем специальный компонент с методом thresholdMet
    const MockWithThreshold = createMockComponent({
      props: {
        scrollThreshold: {
          type: Number,
          default: 300,
        },
      },
      methods: {
        thresholdMet,
      },
    })

    const wrapper = mount(MockWithThreshold, {
      props: {
        scrollThreshold: 1000,
      },
    })

    // Скроллим меньше порога
    await scrollWindow(900)
    wrapper.vm.onScroll()
    await wrapper.vm.$nextTick()

    expect(thresholdMet).not.toHaveBeenCalled()

    // Скроллим больше порога
    await scrollWindow(1001)
    wrapper.vm.onScroll()
    await wrapper.vm.$nextTick()
    expect(thresholdMet).toHaveBeenCalled()
  })

  it('should reset savedScroll when isActive state changes', async () => {
    const wrapper = mountFunction({
      data () {
        return {
          savedScroll: 100,
        }
      },
    })

    // В Vue 3 используем прямое изменение данных
    wrapper.vm.isActive = true
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.savedScroll).toBe(0)
  })

  it(`should warn if target isn't present`, async () => {
    mountFunction({
      props: {
        scrollTarget: '#test',
      },
    })

    expect('Unable to locate element with identifier #test').toHaveBeenTipped()
  })
})
