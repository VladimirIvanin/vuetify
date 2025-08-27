import { defineComponent, h } from 'vue'
import { mount, enableAutoUnmount } from '@vue/test-utils'
import toggleable from '../'

describe('toggleable.ts', () => {
  enableAutoUnmount(afterEach)

  beforeEach(() => {
    document.body.setAttribute('data-app', 'true')
  })

  it('should create component with default props', () => {
    const TestComponent = defineComponent({
      mixins: [toggleable],
      render: () => h('div', 'test'),
    })

    const wrapper = mount(TestComponent)

    expect(wrapper.vm.isActive).toBe(false)
    expect(wrapper.vm.modelValue).toBeUndefined()
  })

  it('should initialize isActive based on prop value', () => {
    const TestComponent = defineComponent({
      mixins: [toggleable],
      props: {
        modelValue: Boolean,
      },
      render: () => h('div', 'test'),
    })

    const wrapper = mount(TestComponent, {
      props: {
        modelValue: true,
      },
    })

    expect(wrapper.vm.isActive).toBe(true)
  })

  it('should update isActive when prop changes', async () => {
    const TestComponent = defineComponent({
      mixins: [toggleable],
      props: {
        modelValue: Boolean,
      },
      render: () => h('div', 'test'),
    })

    const wrapper = mount(TestComponent, {
      props: {
        modelValue: false,
      },
    })

    expect(wrapper.vm.isActive).toBe(false)

    await wrapper.setProps({ modelValue: true })
    expect(wrapper.vm.isActive).toBe(true)

    await wrapper.setProps({ modelValue: false })
    expect(wrapper.vm.isActive).toBe(false)
  })

  it('should emit update:modelValue when isActive changes', async () => {
    const TestComponent = defineComponent({
      mixins: [toggleable],
      props: {
        modelValue: Boolean,
      },
      render: () => h('div', 'test'),
    })

    const wrapper = mount(TestComponent, {
      props: {
        modelValue: false,
      },
    })

    // Manually change isActive
    wrapper.vm.isActive = true
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
  })

  it('should not emit when isActive matches prop value', async () => {
    const TestComponent = defineComponent({
      mixins: [toggleable],
      props: {
        modelValue: Boolean,
      },
      render: () => h('div', 'test'),
    })

    const wrapper = mount(TestComponent, {
      props: {
        modelValue: true,
      },
    })

    // Set isActive to same value as prop
    wrapper.vm.isActive = true
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('should work with custom prop and event names', () => {
    const TestComponent = defineComponent({
      mixins: [(toggleable as any).factory('value', 'change')],
      props: {
        value: Boolean,
      },
      render: () => h('div', 'test'),
    })

    const wrapper = mount(TestComponent, {
      props: {
        value: true,
      },
    })

    expect(wrapper.vm.isActive).toBe(true)
    expect(wrapper.vm.value).toBe(true)
  })

  it('should handle falsy values correctly', async () => {
    const TestComponent = defineComponent({
      mixins: [toggleable],
      render: () => h('div', 'test'),
    })

    const wrapper = mount(TestComponent, {
      props: {
        modelValue: '',
      },
    })

    // Empty string is falsy, so isActive should be false
    expect(wrapper.vm.isActive).toBe(false)

    await wrapper.setProps({ modelValue: 'hello' })
    expect(wrapper.vm.isActive).toBe(true)

    await wrapper.setProps({ modelValue: 0 })
    expect(wrapper.vm.isActive).toBe(false)

    await wrapper.setProps({ modelValue: 1 })
    expect(wrapper.vm.isActive).toBe(true)
  })

  it('should handle undefined and null values', () => {
    const TestComponent = defineComponent({
      mixins: [toggleable],
      props: {
        modelValue: Boolean,
      },
      render: () => h('div', 'test'),
    })

    const wrapper = mount(TestComponent, {
      props: {
        modelValue: undefined,
      },
    })

    expect(wrapper.vm.isActive).toBe(false)

    wrapper.setProps({ modelValue: null })
    expect(wrapper.vm.isActive).toBe(false)
  })

  it('should work with factory function for multiple instances', () => {
    const Toggleable1 = (toggleable as any).factory('value1', 'change1')
    const Toggleable2 = (toggleable as any).factory('value2', 'change2')

    const TestComponent = defineComponent({
      mixins: [Toggleable1, Toggleable2],
      props: {
        value1: Boolean,
        value2: Boolean,
      },
      render: () => h('div', 'test'),
    })

    const wrapper = mount(TestComponent, {
      props: {
        value1: true,
        value2: false,
      },
    })

    // When multiple mixins are used, the last one's isActive value is used
    // Since value2 is false, isActive should be false
    expect(wrapper.vm.isActive).toBe(false)
    expect(wrapper.vm.value1).toBe(true)
    expect(wrapper.vm.value2).toBe(false)
  })
})
