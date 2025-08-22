import { mount, VueWrapper } from '@vue/test-utils'
import VSimpleCheckbox from '../VSimpleCheckbox'

describe('VSimpleCheckbox.ts', () => {
  type Instance = InstanceType<typeof VSimpleCheckbox>
  let mountFunction: (options?: any) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VSimpleCheckbox, {
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

  it('should render simple checkbox', () => {
    const wrapper = mountFunction({
      props: { modelValue: false },
    })

    expect(wrapper.find('.v-simple-checkbox').exists()).toBe(true)
    expect(wrapper.find('.v-input--selection-controls__input').exists()).toBe(true)
  })

  it('should emit update:modelValue event on click', async () => {
    const wrapper = mountFunction({
      props: { modelValue: false },
    })

    const element = wrapper.find('.v-simple-checkbox')
    await element.trigger('click')

    expect(wrapper.emitted()['update:modelValue']).toBeTruthy()
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([true])
  })

  it('should not emit update:modelValue when disabled', async () => {
    const wrapper = mountFunction({
      props: { modelValue: false, disabled: true },
    })

    const element = wrapper.find('.v-simple-checkbox')
    await element.trigger('click')

    expect(wrapper.emitted()['update:modelValue']).toBeFalsy()
  })

  it('should apply disabled class when disabled', () => {
    const wrapper = mountFunction({
      props: { disabled: true },
    })

    expect(wrapper.find('.v-simple-checkbox--disabled').exists()).toBe(true)
  })
})
