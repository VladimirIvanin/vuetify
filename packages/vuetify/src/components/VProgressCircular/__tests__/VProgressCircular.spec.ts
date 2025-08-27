// Components
import VProgressCircular from '../VProgressCircular'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'

describe('VProgressCircular.ts', () => {
  type Instance = InstanceType<typeof VProgressCircular>
  let mountFunction: (options?: Record<string, any>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VProgressCircular, options)
    }
  })

  it('should render component and match snapshot', async () => {
    const wrapper = mountFunction({
      data: () => ({
        isVisible: false,
      }),
      props: {
        value: 33,
      },
      slots: {
        default: '<span>content</span>',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ value: -1 })
    const htmlMinus1 = wrapper.html()

    await wrapper.setProps({ value: 0 })
    const html0 = wrapper.html()

    await wrapper.setProps({ value: 100 })
    const html100 = wrapper.html()

    await wrapper.setProps({ value: 101 })
    const html101 = wrapper.html()

    expect(htmlMinus1).toBe(html0)
    expect(html100).toBe(html101)
    expect(html0).not.toBe(html100)

    await wrapper.setProps({ value: '-1' })
    const htmlMinus1String = wrapper.html()

    await wrapper.setProps({ value: '0' })
    const html0String = wrapper.html()

    await wrapper.setProps({ value: '100' })
    const html100String = wrapper.html()

    await wrapper.setProps({ value: '101' })
    const html101String = wrapper.html()

    expect(htmlMinus1String).toBe(html0String)
    expect(html100String).toBe(html101String)
    expect(html0String).not.toBe(html100String)
  })

  it('should render component with color prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        value: 33,
        color: 'orange lighten-1',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with button prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        value: 33,
        button: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with rotate prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        value: 33,
        rotate: 29,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with size prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        value: 33,
        size: 17,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with indeterminate prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        indeterminate: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with width prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        value: 33,
        width: 13,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with fill prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        value: 33,
        fill: 'green lighten-1',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should set isVisible with onObserve', () => {
    const wrapper = mountFunction()
    expect(wrapper.vm.isVisible).toEqual(false)
    
    // Создаем мок-объекты для IntersectionObserverEntry
    const mockEntries = [] as IntersectionObserverEntry[]
    const mockObserver = {} as IntersectionObserver
    
    wrapper.vm.onObserve(mockEntries, mockObserver, true)
    expect(wrapper.vm.isVisible).toEqual(true)
  })
})
