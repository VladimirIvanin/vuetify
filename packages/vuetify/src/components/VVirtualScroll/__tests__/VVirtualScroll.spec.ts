// Component
import VVirtualScroll from '../VVirtualScroll'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import { h } from 'vue'

describe('VVirtualScroll.ts', () => {
  type Instance = InstanceType<typeof VVirtualScroll>
  let mountFunction: (options?: object) => VueWrapper<Instance>
  let propsData: Object
  let mock: jest.SpyInstance
  const elementHeight = 100

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VVirtualScroll, {
        ...options,
        slots: {
          default: ({ item }: { item: any }) => h('div', { class: 'item' }, item),
        },
      })
    }
    propsData = {
      height: elementHeight,
      items: [1, 2, 3],
      itemHeight: 50,
    }

    // mock clientHeight
    mock = jest.spyOn(window.HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(elementHeight)
  })

  afterEach(() => {
    mock.mockRestore()
  })

  it('should render component with scopedSlot and match snapshot', async () => {
    const wrapper = mountFunction({
      props: propsData,
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should set height of scrollable element', () => {
    const wrapper = mountFunction({
      props: propsData,
    })

    const scrollable = wrapper.find('.v-virtual-scroll__container')
    expect((scrollable.element as HTMLElement).style.height).toEqual('150px')
  })

  it('should render not more than 5 hidden items and match snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        height: elementHeight,
        items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
        itemHeight: 50,
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render right items on scroll and match snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        height: elementHeight,
        items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        itemHeight: 50,
      },
    })

    wrapper.vm.scrollTop = 500
    await wrapper.trigger('scroll')

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should provide the correct item index', () => {
    const helpers = require('../../../util/helpers')
    const spy = jest.spyOn(helpers, 'getSlot')
    const wrapper = mountFunction({
      props: propsData,
      global: {
        mocks: {
          firstToRender: 2,
        },
      },
    })

    wrapper.vm.first = 2

    wrapper.vm.genChild(0, 1)

    expect(spy.mock.calls[0][2]).toEqual({
      item: 0,
      index: 3,
    })
  })
})
