import Proxyable, { factory as Proxy } from '../'
import {
  mount,
  MountOptions,
  Wrapper,
  enableAutoUnmount,
} from '@vue/test-utils'

describe('proxyable.ts', () => {
  enableAutoUnmount(afterEach)

  const Mock = {
    mixins: [Proxyable],
    template: '<div></div>',
  }

  type Instance = InstanceType<typeof Mock>
  let mountFunction: (options?: MountOptions<Instance>) => Wrapper<Instance>

  beforeEach(() => {
    mountFunction = (options?: MountOptions<Instance>) => {
      return mount(Mock, options)
    }
  })

  it('should watch prop and emit event', async () => {
    const wrapper = mountFunction({
      props: { modelValue: 'foo' },
    })

    expect(wrapper.vm.internalValue).toBe('foo')

    // Change by prop
    await wrapper.setProps({ modelValue: 'bar' })

    expect(wrapper.vm.internalValue).toBe('bar')
    expect(wrapper.emitted()).toEqual({})

    // Change internal
    wrapper.vm.internalValue = 'fizzbuzz'

    expect(wrapper.vm.internalValue).toBe('fizzbuzz')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['fizzbuzz'])
  })

  it('should use provided prop and event arguments', async () => {
    const wrapper = mount({
      mixins: [Proxy('input', 'update:input-value')],
      template: '<div></div>',
    }, {
      props: {
        input: 'foo',
      },
    })

    expect(wrapper.vm.input).toBe('foo')

    wrapper.vm.internalValue = 'bar'

    expect(wrapper.emitted('update:input-value')).toBeTruthy()
    expect(wrapper.emitted('update:input-value')?.[0]).toEqual(['bar'])
  })
})
