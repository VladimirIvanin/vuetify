import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import VButton from '../VButton'

describe('VButton.vitest.spec.ts', () => {
  type Instance = InstanceType<typeof VButton>
  let mountFunction: (options?: any) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VButton, {
        global: {
          stubs: {
            VIcon: {
              template: '<span class="v-icon"></span>',
            },
          },
        },
        ...options,
      })
    }
  })

  it('should render button with default props', () => {
    const wrapper = mountFunction()

    expect(wrapper.find('.v-btn').exists()).toBe(true)
  })

  it('should render button with custom text', () => {
    const wrapper = mountFunction({
      slots: {
        default: 'Click me',
      },
    })

    expect(wrapper.text()).toBe('Click me')
  })

  it('should emit click event', async () => {
    const wrapper = mountFunction()

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('should apply disabled state', () => {
    const wrapper = mountFunction({
      props: { disabled: true },
    })

    expect(wrapper.find('.v-btn--disabled').exists()).toBe(true)
  })

  it('should apply different variants', () => {
    const wrapper = mountFunction({
      props: { variant: 'outlined' },
    })

    expect(wrapper.find('.v-btn--variant-outlined').exists()).toBe(true)
  })
})



