// Components
import VLabel from '../VLabel'

// Utilities
import {
  mount,
  VueWrapper,
} from '@vue/test-utils'

describe('VLabel', () => {
  type Instance = InstanceType<typeof VLabel>
  let mountFunction: (options?: any) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VLabel, {
        ...options,
      })
    }
  })

  it('should have custom color', () => {
    const wrapper = mountFunction({
      props: {
        color: 'pink',
        focused: true,
      },
    })

    expect(wrapper.classes('pink--text')).toBe(true)
  })

  it('should position itself absolutely', () => {
    const wrapper = mountFunction({
      props: {
        absolute: true,
      },
    })

    expect(wrapper.element.style.position).toBe('absolute')
  })

  it('should render default slot content', () => {
    const wrapper = mountFunction({
      slots: {
        default: 'Custom Label Text',
      },
    })

    expect(wrapper.text()).toBe('Custom Label Text')
  })

  it('should render complex slot content with HTML', () => {
    const wrapper = mountFunction({
      slots: {
        default: '<span class="custom-class">Label with <strong>bold</strong> text</span>',
      },
    })

    expect(wrapper.find('.custom-class').exists()).toBe(true)
    expect(wrapper.find('strong').exists()).toBe(true)
    expect(wrapper.find('strong').text()).toBe('bold')
  })

  it('should render slot content with components', () => {
    const TestComponent = {
      template: '<span class="test-component">Test Component</span>',
    }

    const wrapper = mountFunction({
      slots: {
        default: TestComponent,
      },
    })

    expect(wrapper.find('.test-component').exists()).toBe(true)
    expect(wrapper.find('.test-component').text()).toBe('Test Component')
  })

  it('should render slot content with multiple elements', () => {
    const wrapper = mountFunction({
      slots: {
        default: [
          '<span class="first">First</span>',
          '<span class="second">Second</span>',
        ],
      },
    })

    expect(wrapper.find('.first').exists()).toBe(true)
    expect(wrapper.find('.second').exists()).toBe(true)
    expect(wrapper.find('.first').text()).toBe('First')
    expect(wrapper.find('.second').text()).toBe('Second')
  })

  it('should render empty content when no slot provided', () => {
    const wrapper = mountFunction()

    expect(wrapper.text()).toBe('')
  })

  it('should apply proper classes when slot content is present', () => {
    const wrapper = mountFunction({
      slots: {
        default: 'Test Label',
      },
      props: {
        value: true,
        disabled: true,
      },
    })

    expect(wrapper.classes('v-label--active')).toBe(true)
    expect(wrapper.classes('v-label--is-disabled')).toBe(true)
  })

  it('should render slot content with proper for attribute', () => {
    const wrapper = mountFunction({
      props: {
        for: 'test-input',
      },
      slots: {
        default: 'Label for input',
      },
    })

    expect(wrapper.attributes('for')).toBe('test-input')
    expect(wrapper.attributes('aria-hidden')).toBe('false')
  })

  it('should set aria-hidden when no for attribute provided', () => {
    const wrapper = mountFunction({
      slots: {
        default: 'Label without for',
      },
    })

    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('should render slot content with proper positioning', () => {
    const wrapper = mountFunction({
      props: {
        left: 10,
        right: 20,
      },
      slots: {
        default: 'Positioned label',
      },
    })

    expect(wrapper.element.style.left).toBe('10px')
    expect(wrapper.element.style.right).toBe('20px')
  })

  it('should render slot content with theme classes', () => {
    const wrapper = mountFunction({
      props: {
        dark: true,
      },
      slots: {
        default: 'Dark theme label',
      },
    })

    expect(wrapper.classes('theme--dark')).toBe(true)
  })

  it('should handle focused state with color', () => {
    const wrapper = mountFunction({
      props: {
        focused: true,
        color: 'error',
      },
      slots: {
        default: 'Focused error label',
      },
    })

    expect(wrapper.classes('error--text')).toBe(true)
  })

  it('should handle disabled state', () => {
    const wrapper = mountFunction({
      props: {
        disabled: true,
      },
      slots: {
        default: 'Disabled label',
      },
    })

    expect(wrapper.classes('v-label--is-disabled')).toBe(true)
  })

  it('should handle active state', () => {
    const wrapper = mountFunction({
      props: {
        value: true,
      },
      slots: {
        default: 'Active label',
      },
    })

    expect(wrapper.classes('v-label--active')).toBe(true)
  })

  it('should handle custom positioning with string values', () => {
    const wrapper = mountFunction({
      props: {
        left: '20%',
        right: '30px',
      },
      slots: {
        default: 'Positioned label',
      },
    })

    expect(wrapper.element.style.left).toBe('20%')
    expect(wrapper.element.style.right).toBe('30px')
  })

  it('should handle light theme', () => {
    const wrapper = mountFunction({
      props: {
        light: true,
      },
      slots: {
        default: 'Light theme label',
      },
    })

    expect(wrapper.classes('theme--light')).toBe(true)
  })

  it('should handle multiple theme classes', () => {
    const wrapper = mountFunction({
      props: {
        dark: true,
        light: false,
      },
      slots: {
        default: 'Theme label',
      },
    })

    expect(wrapper.classes('theme--dark')).toBe(true)
    expect(wrapper.classes('theme--light')).toBe(false)
  })

  it('should render slot content with proper element tag', () => {
    const wrapper = mountFunction({
      slots: {
        default: 'Label content',
      },
    })

    expect(wrapper.element.tagName.toLowerCase()).toBe('label')
  })

  it('should handle slot content with event listeners', () => {
    const onClick = jest.fn()

    const wrapper = mountFunction({
      attrs: {
        onClick,
      },
      slots: {
        default: 'Clickable label',
      },
    })

    wrapper.trigger('click')
    expect(onClick).toHaveBeenCalled()
  })
})
