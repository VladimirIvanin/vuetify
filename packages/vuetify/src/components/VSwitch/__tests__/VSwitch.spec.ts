// Components
import VSwitch from '../VSwitch'

// Utilities
import {
  mount,
  MountOptions,
  Wrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import { touch } from '../../../../test'

// Types
import { ExtractVue } from '../../../util/mixins'

describe('VSwitch.ts', () => {
  type Instance = ExtractVue<typeof VSwitch>
  let mountFunction: (options?: MountOptions<Instance>) => Wrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VSwitch, options)
    }
  })

  it('should set ripple data attribute based on ripple prop state', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: false,
        ripple: false,
      },
    })

    expect(wrapper.findAll('.v-input--selection-controls__ripple')).toHaveLength(0)

    await wrapper.setProps({ ripple: true })

    const ripple = wrapper.find('.v-input--selection-controls__ripple')

    expect((ripple.element as any)._ripple.enabled).toBe(true)
    expect((ripple.element as any)._ripple.centered).toBe(true)
  })

  it('should emit change event on swipe', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: false,
      },
    })

    touch(wrapper.find('.v-input--selection-controls__ripple')).start(0, 0).end(20, 0)
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])

    await wrapper.setProps({ modelValue: true })
    touch(wrapper.find('.v-input--selection-controls__ripple')).start(0, 0).end(-20, 0)
    expect(wrapper.emitted('update:modelValue')![1]).toEqual([false])
  })

  it('should emit change event on key events', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: false,
      },
    })

    const input = wrapper.find('input')

    await input.trigger('keydown.left')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()

    await input.trigger('keydown.right')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])

    await input.trigger('keydown.right')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)

    await input.trigger('keydown.left')
    expect(wrapper.emitted('update:modelValue')![1]).toEqual([false])
  })

  it('should not emit change event on swipe when not active', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: false,
      },
    })

    touch(wrapper.find('.v-input--selection-controls__ripple')).start(0, 0).end(-20, 0)
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()

    await wrapper.setProps({ modelValue: true })
    touch(wrapper.find('.v-input--selection-controls__ripple')).start(0, 0).end(20, 0)
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('should render element with loader and match the snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        loading: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
