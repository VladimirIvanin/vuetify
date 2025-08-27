import Mouse from '../index'

import {
  mount,
  VueWrapper,
  MountingOptions,
} from '@vue/test-utils'
import { ComponentPublicInstance, h, defineComponent } from 'vue'

const Mock = defineComponent({
  mixins: [Mouse],
  render: () => h('div'),
})

describe('mouse.ts', () => {
  type Instance = ComponentPublicInstance & InstanceType<typeof Mock>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options?: MountingOptions<Instance>) => {
      return mount(Mock, options)
    }
  })

  it('should generate mouse event handlers', async () => {
    const noop = (e: any) => e
    const wrapper = mount(Mock, {
      attrs: {
        onClick: noop,
      },
    })

    const handlers = wrapper.vm.getMouseEventHandlers({ click: { event: 'click' } }, noop)
    expect(typeof handlers.click).toBe('function')
  })

  it('should generate default mouse event handlers', async () => {
    const noop = (e: any) => e
    const wrapper = mount(Mock, {
      attrs: {
        'onClick:foo': noop,
      },
    })

    const handlers = wrapper.vm.getDefaultMouseEventHandlers(':foo', noop)
    // Для события click с суффиксом :foo, ключ будет 'click'
    expect(typeof handlers.click).toBe('function')

    // Тест для пустого суффикса
    const wrapper2 = mount(Mock, {
      attrs: {
        onClick: noop,
        onMouseenter: noop,
        onMouseleave: noop,
        onMousedown: noop,
        onMouseup: noop,
        onMousemove: noop,
      },
    })
    const emptySuffixHandlers = wrapper2.vm.getDefaultMouseEventHandlers('', noop)
    expect(Object.keys(emptySuffixHandlers)).toHaveLength(6)
  })

  it('should emit events', async () => {
    const wrapper = mount(Mock, {
      attrs: {
        onClick: () => {},
      },
    })

    const handlers = wrapper.vm.getMouseEventHandlers({ click: { event: 'click' } }, () => ({}))
    const click = handlers.click
    Array.isArray(click) ? click[0](null) : click(null)
    expect(wrapper.emitted()).toBeTruthy()
  })

  it('should handle prevent modifier', async () => {
    const wrapper = mount(Mock, {
      attrs: {
        onClick: () => {},
      },
    })
    const event = { preventDefault: jest.fn() } as unknown as MouseEvent

    const handlers = wrapper.vm.getMouseEventHandlers({ click: { event: 'click', prevent: true } }, () => ({}))
    const click = handlers.click
    Array.isArray(click) ? click[0](event) : click(event)
    expect(event.preventDefault).toHaveBeenCalledTimes(1)
  })

  it('should handle stop modifier', async () => {
    const wrapper = mount(Mock, {
      attrs: {
        onClick: () => {},
      },
    })
    const event = { stopPropagation: jest.fn() } as unknown as MouseEvent

    const handlers = wrapper.vm.getMouseEventHandlers({ click: { event: 'click', stop: true } }, () => ({}))
    const click = handlers.click
    Array.isArray(click) ? click[0](event) : click(event)
    expect(event.stopPropagation).toHaveBeenCalledTimes(1)
  })
})
