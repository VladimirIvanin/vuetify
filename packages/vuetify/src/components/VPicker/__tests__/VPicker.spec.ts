// Components
import VPicker from '../VPicker'

// Utilities
import {
  mount,
  VueWrapper
} from '@vue/test-utils'

describe('VPicker.ts', () => {
  type Instance = InstanceType<typeof VPicker>
  let mountFunction: (options?: object) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VPicker, {
        ...options
      })
    }
  })

  it('should render component without title and match snapshot', () => {
    const wrapper = mountFunction({
      slots: {
        default: '<span>default</span>'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with title and match snapshot', () => {
    const wrapper = mountFunction({
      slots: {
        default: '<span>default</span>',
        title: '<span>title</span>'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render flat component and match snapshot', () => {
    const wrapper = mountFunction({
      slots: {
        default: '<span>default</span>',
        title: '<span>title</span>'
      },
      props: {
        flat: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with elevation and match snapshot', () => {
    const wrapper = mountFunction({
      slots: {
        default: '<span>default</span>',
        title: '<span>title</span>'
      },
      props: {
        elevation: 15
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render dark component and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        dark: true
      },
      slots: {
        default: '<span>default</span>',
        title: '<span>title</span>'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should not render actions when actions slot is empty', () => {
    const wrapper = mountFunction({
      slots: {
        default: '<span>default</span>',
        actions: () => []
      }
    })

    expect(wrapper.find('.v-picker__actions').exists()).toBe(false)
  })

  it('should render actions when actions slot has content', () => {
    const wrapper = mountFunction({
      slots: {
        default: '<span>default</span>',
        actions: '<button type="button">OK</button>'
      }
    })

    expect(wrapper.find('.v-picker__actions button').exists()).toBe(true)
  })

  it('should render colored component', () => {
    const wrapper = mountFunction({
      props: {
        color: 'orange lighten-1'
      },
      slots: {
        title: '<span>title</span>'
      }
    })

    const title = wrapper.find('.v-picker__title')
    expect(title.classes('orange')).toBe(true)
    expect(title.classes('lighten-1')).toBe(true)
  })
})
