// Components
import VMain from '../VMain'

// Utilities
import { mount } from '@vue/test-utils'

describe('VMain.ts', () => {
  let mountFunction: (options?: any) => any

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VMain, {
        ...options,
        global: {
          mocks: {
            $vuetify: {
              application: {
                bar: 24,
                top: 64,
                left: 256,
                right: 256,
                footer: 48,
                insetFooter: 32,
                bottom: 56,
              },
            },
          },
        },
      })
    }
  })

  it('should work', () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render custom tag', () => {
    const wrapper = mountFunction({
      props: {
        tag: 'div'
      }
    })

    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('should apply correct styles based on vuetify application', () => {
    const wrapper = mountFunction()
    const mainElement = wrapper.element

    expect(mainElement.style.paddingTop).toBe('88px') // 64 + 24
    expect(mainElement.style.paddingRight).toBe('256px')
    expect(mainElement.style.paddingBottom).toBe('136px') // 48 + 32 + 56
    expect(mainElement.style.paddingLeft).toBe('256px')
  })

  it('should render with slot content', () => {
    const wrapper = mountFunction({
      slots: {
        default: '<div>Test content</div>'
      }
    })

    expect(wrapper.html()).toContain('Test content')
  })

  it('should render with complex slot content', () => {
    const wrapper = mountFunction({
      slots: {
        default: [
          '<div>First item</div>',
          '<div>Second item</div>'
        ]
      }
    })

    expect(wrapper.html()).toContain('First item')
    expect(wrapper.html()).toContain('Second item')
  })

  it('should have correct CSS classes', () => {
    const wrapper = mountFunction()

    expect(wrapper.classes()).toContain('v-main')
    expect(wrapper.find('.v-main__wrap').exists()).toBe(true)
  })

  it('should render with default tag', () => {
    const wrapper = mountFunction()

    expect(wrapper.element.tagName).toBe('MAIN')
  })
})
