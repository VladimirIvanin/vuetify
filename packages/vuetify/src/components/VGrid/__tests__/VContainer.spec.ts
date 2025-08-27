// Components
import VContainer from '../VContainer'

// Utilities
import {
  mount,
  MountingOptions,
  VueWrapper,
} from '@vue/test-utils'

describe('VContainer.ts', () => {
  type Instance = InstanceType<typeof VContainer>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VContainer, {
        ...options,
      })
    }
  })

  it('should work', () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render with fluid prop', () => {
    const wrapper = mountFunction({
      props: {
        fluid: true,
      },
    })

    expect(wrapper.classes()).toContain('container--fluid')
    expect(wrapper.classes()).toContain('container')
  })

  it('should render with custom tag', () => {
    const wrapper = mountFunction({
      props: {
        tag: 'section',
      },
    })

    expect(wrapper.element.tagName).toBe('SECTION')
  })

  it('should render with id prop', () => {
    const wrapper = mountFunction({
      props: {
        id: 'test-id',
      },
    })

    expect(wrapper.attributes('id')).toBe('test-id')
  })

  it('should process utility classes from attrs', () => {
    const wrapper = mountFunction({
      attrs: {
        'pa-3': true,
        'ma-2': '',
        'data-test': 'test-value',
      },
    })

    expect(wrapper.classes()).toContain('pa-3')
    expect(wrapper.classes()).toContain('ma-2')
    expect(wrapper.attributes('data-test')).toBe('test-value')
  })

  it('should render default slot content', () => {
    const wrapper = mountFunction({
      slots: {
        default: '<div>Test content</div>',
      },
    })

    expect(wrapper.html()).toContain('<div>Test content</div>')
  })
})
