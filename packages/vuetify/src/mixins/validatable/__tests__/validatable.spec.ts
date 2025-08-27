import Validatable from '../'
import {
  mount,
  MountingOptions,
  VueWrapper,
} from '@vue/test-utils'
import { wait } from '../../../../test'
import { defineComponent, h } from 'vue'

describe('validatable.ts', () => {
  const Mock = defineComponent({
    mixins: [Validatable],
    render: () => h('div'),
  })

  type Instance = InstanceType<typeof Mock>;
  let mountFunction: (
    options?: MountingOptions<Instance>
  ) => VueWrapper<Instance>
  beforeEach(() => {
    mountFunction = (options?: MountingOptions<Instance>) => {
      return mount(Mock, {
        global: {
          mocks: {
            $vuetify: {
              theme: { dark: false },
            },
          },
        },
        ...options,
      })
    }
  })

  it('should register/unregister with injected form is available', () => {
    const form = {
      register: jest.fn(),
      unregister: jest.fn(),
    }

    const wrapper = mountFunction({
      global: { provide: { form } },
    })

    expect(form.register).toHaveBeenCalled()

    wrapper.unmount()

    expect(form.unregister).toHaveBeenCalled()
  })

  it('should manually set isResetting', () => {
    const wrapper = mountFunction()

    expect(wrapper.vm.isResetting).toBe(false)

    wrapper.vm.resetValidation()

    expect(wrapper.vm.isResetting).toBe(true)
  });
  [true, false].forEach(returns => {
    it(
      'should reset valid flag on resetValidation - ' + String(returns),
      async () => {
        jest.useFakeTimers()
        const wrapper = mountFunction({
          props: {
            rules: [() => returns || String(returns)],
          },
        })

        expect(wrapper.vm.valid).toBe(returns)

        wrapper.vm.valid = !returns

        wrapper.vm.resetValidation()
        await wrapper.vm.$nextTick()
        jest.runAllTimers()
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.valid).toBe(returns)
        jest.useRealTimers()
      }
    )
  })

  /* eslint-disable-next-line max-statements */
  it('should manually validate', async () => {
    const wrapper = mountFunction()

    expect(wrapper.vm.errorBucket).toEqual([])

    // Function failing
    await wrapper.setProps({ rules: [() => 'fizzbuzz'] })
    wrapper.vm.validate()

    expect(wrapper.vm.errorBucket).toEqual(['fizzbuzz'])

    // Function passing with proper value handling
    await wrapper.setProps({
      rules: [val => (val && val.length > 3) || 'fizzbuzz'],
    })
    wrapper.vm.validate(false, 'foo')

    expect(wrapper.vm.errorBucket).toEqual(['fizzbuzz'])

    wrapper.vm.validate(false, 'foobar')

    expect(wrapper.vm.errorBucket).toEqual([])

    // Boolean
    await wrapper.setProps({ rules: [false] })
    wrapper.vm.validate()

    // https://github.com/vuetifyjs/vuetify/issues/9976
    expect(wrapper.vm.errorBucket).toEqual([''])

    // Boolean true sets no messages
    await wrapper.setProps({ rules: [true] })
    wrapper.vm.validate()

    expect(wrapper.vm.errorBucket).toEqual([])

    // String
    await wrapper.setProps({ rules: ['foobar'] })
    wrapper.vm.validate()

    expect(wrapper.vm.errorBucket).toEqual(['foobar'])

    // Warning
    await wrapper.setProps({ rules: [undefined] })
    wrapper.vm.validate()

    expect(
      `Rules should return a string or boolean, received 'undefined' instead`
    ).toHaveBeenWarned()

    // Force validation state
    await wrapper.setProps({ rules: [false] })

    expect(wrapper.vm.hasInput).toBe(false)
    expect(wrapper.vm.hasFocused).toBe(false)

    wrapper.vm.validate(true)

    expect(wrapper.vm.hasInput).toBe(true)
    expect(wrapper.vm.hasFocused).toBe(true)
  })

  // https://github.com/vuetifyjs/vuetify/issues/5362
  it('should not validate on blur readonly or disabled when blurring', async () => {
    const focusBlur = async wrapper => {
      wrapper.vm.isFocused = true
      await wrapper.vm.$nextTick()
      wrapper.vm.isFocused = false
      await wrapper.vm.$nextTick()
    }

    const wrapper = mountFunction({
      props: {
        validateOnBlur: true,
      },
    })

    // Create a mock function and replace the validate method
    const validateSpy = jest.fn()
    const originalValidate = wrapper.vm.validate
    wrapper.vm.validate = validateSpy

    // Normal validation
    await focusBlur(wrapper)
    expect(validateSpy).toHaveBeenCalledTimes(1)

    // Disabled - no validation
    await wrapper.setProps({ disabled: true })
    validateSpy.mockClear()

    await focusBlur(wrapper)
    expect(validateSpy).toHaveBeenCalledTimes(0)

    // Re-enable validation
    await wrapper.setProps({ disabled: false })
    validateSpy.mockClear()

    await focusBlur(wrapper)
    expect(validateSpy).toHaveBeenCalledTimes(1)

    // Restore original method
    wrapper.vm.validate = originalValidate
  })

  it('should have success', async () => {
    const wrapper = mountFunction()

    expect(wrapper.vm.hasSuccess).toBe(false)

    await wrapper.setProps({ success: true })
    expect(wrapper.vm.hasSuccess).toBe(true)

    await wrapper.setProps({ success: false, successMessages: ['foobar'] })
    expect(wrapper.vm.hasSuccess).toBe(true)

    await wrapper.setProps({ successMessages: [] })
    expect(wrapper.vm.hasSuccess).toBe(false)

    await wrapper.setProps({ successMessages: null })
    expect(wrapper.vm.hasSuccess).toBe(false)
  })

  /* eslint-disable-next-line max-statements */
  it('should have messages', async () => {
    const wrapper = mountFunction()

    expect(wrapper.vm.hasMessages).toBe(false)

    // Null message
    await wrapper.setProps({ messages: null })
    expect(wrapper.vm.hasMessages).toBe(false)

    // String message
    await wrapper.setProps({ messages: 'foo' })
    expect(wrapper.vm.hasMessages).toBe(true)

    // Array message
    await wrapper.setProps({ messages: ['foo'] })
    expect(wrapper.vm.hasMessages).toBe(true)
    await wrapper.setProps({ messages: [] }) // Reset

    // Null error
    await wrapper.setProps({ errorMessages: null })
    expect(wrapper.vm.hasMessages).toBe(false)

    // String error
    await wrapper.setProps({ errorMessages: 'bar' })
    expect(wrapper.vm.hasMessages).toBe(true)

    // Array error
    await wrapper.setProps({ errorMessages: ['bar'] })
    expect(wrapper.vm.hasMessages).toBe(true)
    await wrapper.setProps({ errorMessages: [] }) // Reset

    // Null success
    await wrapper.setProps({ successMessages: null })
    expect(wrapper.vm.hasMessages).toBe(false)

    // String success
    await wrapper.setProps({ successMessages: 'fizz' })
    expect(wrapper.vm.hasMessages).toBe(true)

    // Array success
    await wrapper.setProps({ successMessages: ['fizz'] })
    expect(wrapper.vm.hasMessages).toBe(true)
    await wrapper.setProps({ successMessages: [] }) // Reset

    // Error bucket
    await wrapper.setProps({ rules: [() => 'fizzbuzz'] })
    expect(wrapper.vm.shouldValidate).toBe(false)

    wrapper.vm.hasInput = true
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.shouldValidate).toBe(true)
    expect(wrapper.vm.hasMessages).toBe(true)

    wrapper.vm.hasInput = false
    wrapper.vm.hasFocused = true
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.shouldValidate).toBe(true)
    expect(wrapper.vm.hasMessages).toBe(true)

    wrapper.vm.isResetting = true
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.shouldValidate).toBe(false)

    wrapper.vm.isResetting = false
    await wrapper.setProps({ validateOnBlur: true })

    expect(wrapper.vm.shouldValidate).toBe(true)
  })

  it('should have state', async () => {
    const wrapper = mountFunction()

    expect(wrapper.vm.hasState).toBe(false)

    await wrapper.setProps({ success: true })
    expect(wrapper.vm.hasState).toBe(true)

    await wrapper.setProps({ success: false, error: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.hasState).toBe(true)

    await wrapper.setProps({ error: false })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.hasState).toBe(false)
  })

  it('should return validation state', async () => {
    const wrapper = mountFunction()

    expect(wrapper.vm.validationState).toBeUndefined()

    await wrapper.setProps({ error: true })
    expect(wrapper.vm.validationState).toBe('error')

    await wrapper.setProps({ error: false, success: true })
    expect(wrapper.vm.validationState).toBe('success')

    await wrapper.setProps({ success: false })
    await wrapper.vm.$nextTick()
    await wrapper.setProps({ color: 'blue' })
    wrapper.vm.hasColor = true
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.validationState).toBe('blue')
  })

  it('should return a sliced amount based on error count', async () => {
    const wrapper = mountFunction({
      props: {
        errorMessages: ['foobar', 'fizzbuzz'],
      },
    })

    expect(wrapper.vm.validations).toHaveLength(1)

    await wrapper.setProps({ errorCount: 2 })
    expect(wrapper.vm.validations).toHaveLength(2)
  })

  it('should validate when internalValue changes', async () => {
    const wrapper = mountFunction()

    // Create a mock function and replace the validate method
    const validateSpy = jest.fn()
    const originalValidate = wrapper.vm.validate
    wrapper.vm.validate = validateSpy

    expect(wrapper.vm.hasInput).toBe(false)

    // Simulate internal value change
    wrapper.vm.internalValue = 'foo'
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.hasInput).toBe(true)
    expect(validateSpy).toHaveBeenCalled()

    // Restore original method
    wrapper.vm.validate = originalValidate
  })

  it('should update values when resetting after timeout', async () => {
    const wrapper = mountFunction()

    wrapper.vm.hasInput = true
    wrapper.vm.hasFocused = true
    wrapper.vm.isResetting = true

    expect(wrapper.vm.hasInput).toBe(true)
    expect(wrapper.vm.hasFocused).toBe(true)
    expect(wrapper.vm.isResetting).toBe(true)

    // Wait for watcher
    await wrapper.vm.$nextTick()

    // Wait for watcher's timeout
    await wait()

    expect(wrapper.vm.hasInput).toBe(false)
    expect(wrapper.vm.hasFocused).toBe(false)
    expect(wrapper.vm.isResetting).toBe(false)
  })

  it('should emit error update when value changes and shouldValidate', async () => {
    const wrapper = mountFunction()

    // Set up conditions for shouldValidate to be true
    wrapper.vm.hasInput = true
    await wrapper.vm.$nextTick()

    await wrapper.setProps({ error: true })
    await wrapper.vm.$nextTick()

    await wrapper.setProps({ error: false })
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:error')).toBeTruthy()
  })

  it('should reset validation and internalValue', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: 'foobar',
      },
    })

    wrapper.vm.reset()

    expect(wrapper.vm.isResetting).toBe(true)
    expect(wrapper.vm.internalValue).toBeNull()

    await wrapper.setProps({ modelValue: ['foobar'] })
    await wrapper.vm.$nextTick()

    wrapper.vm.reset()
    expect(wrapper.vm.isResetting).toBe(true)

    // Wait for the reset watcher to process
    await wrapper.vm.$nextTick()
    await wait()
    expect(wrapper.vm.internalValue).toEqual([])
  })

  // https://github.com/vuetifyjs/vuetify/issues/6025
  it('should accept null for external messages', async () => {
    const wrapper = mountFunction({
      props: {
        errorMessages: ['Foobar'],
      },
    })

    expect(wrapper.vm.externalError).toBe(true)

    await wrapper.setProps({ errorMessages: [] })
    expect(wrapper.vm.externalError).toBe(false)

    await wrapper.setProps({ errorMessages: 'Fizzbuzz' })
    expect(wrapper.vm.externalError).toBe(true)

    await wrapper.setProps({ errorMessages: null })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.externalError).toBe(false)
  })

  it('should return white when no color and isDark', async () => {
    const wrapper = mountFunction({
      global: {
        mocks: {
          $vuetify: {
            theme: { dark: false },
          },
        },
        computed: {
          appIsDark: () => false,
        },
      },
      props: { dark: true },
    })

    expect(wrapper.vm.computedColor).toBe('white')

    await wrapper.setProps({ color: 'blue' })
    expect(wrapper.vm.computedColor).toBe('blue')

    await wrapper.setProps({ color: undefined, dark: undefined })
    expect(wrapper.vm.computedColor).toBe('primary')

    const wrapper2 = mountFunction({
      global: {
        mocks: {
          $vuetify: {
            theme: { dark: true },
          },
        },
        computed: {
          appIsDark: () => true,
        },
      },
    })

    expect(wrapper2.vm.computedColor).toBe('primary')

    await wrapper2.setProps({ color: 'blue' })
    expect(wrapper2.vm.computedColor).toBe('blue')

    await wrapper2.setProps({ color: undefined, light: true })
    expect(wrapper2.vm.computedColor).toBe('primary')
  })

  it('should return undefined for color and validation state if disabled', () => {
    const wrapper = mountFunction({
      props: {
        color: 'blue',
        dark: true,
        disabled: true,
      },
    })

    expect(wrapper.vm.computedColor).toBeUndefined()
    expect(wrapper.vm.validationState).toBeUndefined()
    expect(wrapper.vm.hasState).toBe(false)
  })

  // https://github.com/vuetifyjs/vuetify/issues/10174
  it('should validate correct value when blurring', async () => {
    const wrapper = mountFunction({
      props: {
        rules: [v => !!v || 'Mandatory Field'],
        validateOnBlur: true,
        modelValue: 'Foo',
      },
    })

    wrapper.vm.isFocused = true
    await wrapper.vm.$nextTick()

    await wrapper.setProps({ modelValue: '' })
    await wrapper.vm.$nextTick()

    wrapper.vm.isFocused = false
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.hasError).toBe(true)

    wrapper.vm.isFocused = true
    await wrapper.vm.$nextTick()

    await wrapper.setProps({ modelValue: 'Bar' })
    await wrapper.vm.$nextTick()

    wrapper.vm.isFocused = false
    await wrapper.vm.$nextTick()

    // Wait for validation to complete
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.hasError).toBe(false)
  })
})
