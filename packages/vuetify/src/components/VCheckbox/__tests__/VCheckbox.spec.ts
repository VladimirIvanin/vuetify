import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import VCheckbox from '../VCheckbox'

describe('VCheckbox.ts', () => { // eslint-disable-line max-statements
  let mountFunction: (options?: any) => VueWrapper<any>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options?: any) => {
      return mount(VCheckbox, options)
    }
  })

  it('should return true when clicked', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: false,
      } as any,
    })

    const input = wrapper.find('input')

    await input.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
  })

  it('should return a value when toggled on with a specified value', async () => {
    const wrapper = mountFunction({
      props: {
        value: 'John',
        modelValue: null,
      } as any,
    })

    const input = wrapper.find('input')

    await input.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['John'])
  })

  it('should return null when toggled off with a specified value', async () => {
    const wrapper = mountFunction({
      props: {
        value: 'John',
        modelValue: 'John',
      } as any,
    })

    const ripple = wrapper.find('input')

    await ripple.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([null])
  })

  it('should toggle when label is clicked', async () => {
    const wrapper = mountFunction({
      props: {
        label: 'Label',
        value: null,
      } as any,
      attrs: {},
    })

    const label = wrapper.find('label')

    await label.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('should render role and aria-checked attributes on input group', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: false,
      } as any,
    })

    const input = wrapper.find('input')

    expect(input.element.getAttribute('role')).toBe('checkbox')
    expect(input.element.getAttribute('aria-checked')).toBe('false')

    await wrapper.setProps({ modelValue: true } as any)
    expect(input.element.getAttribute('aria-checked')).toBe('true')

    await wrapper.setProps({ indeterminate: true } as any)
    await wrapper.vm.$nextTick()
    expect(input.element.getAttribute('aria-checked')).toBe('mixed')
  })

  it('should toggle on keypress', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: false,
      } as any,
    })

    const input = wrapper.find('input')

    await input.trigger('focus')
    await wrapper.vm.$nextTick()

    await input.trigger('change')
    await wrapper.vm.$nextTick()
    await input.trigger('change')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
    expect(wrapper.emitted('update:modelValue')![1]).toEqual([false])
  })

  it('should enable ripple', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: false,
        disabled: false,
      } as any,
    })

    const ripple = wrapper.find('.v-input--selection-controls__ripple')

    expect((ripple.element as any)._ripple.enabled).toBeTruthy()
    expect((ripple.element as any)._ripple.centered).toBeTruthy()

    await wrapper.setProps({ disabled: true } as any)

    expect(wrapper.find('.v-input--selection-controls__ripple').exists()).toBeTruthy()
  })

  it('should not render ripple when ripple prop is false', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: false,
        ripple: false,
      } as any,
    })

    const ripple = wrapper.findAll('.v-input--selection-controls__ripple')

    expect(ripple).toHaveLength(0)
  })

  it('should render ripple when ripple prop is true', () => {
    const wrapper = mountFunction({
      props: {
        ripple: true,
      } as any,
    })

    const ripple = wrapper.find('.v-input--selection-controls__ripple')

    expect((ripple.element as any)._ripple.enabled).toBeTruthy()
    expect((ripple.element as any)._ripple.centered).toBeTruthy()
  })

  it('should return a value when toggled on with a specified object value', async () => {
    const wrapper = mountFunction({
      props: {
        value: { x: 1, y: 2 },
        modelValue: null,
      } as any,
    })

    const ripple = wrapper.find('.v-input--selection-controls__ripple')

    await ripple.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([{ x: 1, y: 2 }])
  })

  it('should return a value when toggled on with a specified array value', async () => {
    const wrapper = mountFunction({
      props: {
        value: [1, '2', { x: 1, y: 2 }],
        modelValue: null,
      } as any,
    })

    const ripple = wrapper.find('.v-input--selection-controls__ripple')

    await ripple.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([[1, '2', { x: 1, y: 2 }]])
  })

  it('should push value to array when toggled on and is multiple', async () => {
    const wrapper = mountFunction({
      props: {
        value: 'John',
        modelValue: [],
      } as any,
    })

    const ripple = wrapper.find('.v-input--selection-controls__ripple')

    await ripple.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['John']])
  })

  it('should push array value to array when toggled on and is multiple', async () => {
    const wrapper = mountFunction({
      props: {
        value: [1, 2, { x: 1, y: 2 }],
        modelValue: ['Existing'],
      } as any,
    })

    const ripple = wrapper.find('.v-input--selection-controls__ripple')

    await ripple.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['Existing', [1, 2, { x: 1, y: 2 }]]])
  })

  it('should return null when toggled off with a specified array value', async () => {
    const wrapper = mountFunction({
      props: {
        multiple: false, // must use multiple flag for array values
        value: ['John'],
        modelValue: ['John'],
      } as any,
    })

    const ripple = wrapper.find('.v-input--selection-controls__ripple')

    await ripple.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([null])
  })

  it('should remove value(s) from array when toggled off and multiple', async () => {
    const wrapper = mountFunction({
      props: {
        value: 1,
        modelValue: [1, 2, 1, 3],
      } as any,
    })

    const ripple = wrapper.find('.v-input--selection-controls__ripple')

    await ripple.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([[2, 3]])
  })

  it('should remove value(s) from array when toggled off and multiple - with objects', async () => {
    const wrapper = mountFunction({
      props: {
        value: { a: 1 },
        modelValue: [{ a: 1 }, { b: 1 }, { a: 1 }, { c: 1 }],
      } as any,
    })

    const ripple = wrapper.find('.v-input--selection-controls__ripple')

    await ripple.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([[{ b: 1 }, { c: 1 }]])
  })

  it('should work with custom true- and false-value', async () => {
    const wrapper = mountFunction({
      props: {
        trueValue: 'on',
        falseValue: 'off',
        modelValue: null,
      } as any,
    })

    const ripple = wrapper.find('.v-input--selection-controls__ripple')

    await ripple.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['on'])

    await ripple.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![1]).toEqual(['off'])

    expect(wrapper.emitted('update:modelValue')).toHaveLength(2)
  })

  // https://github.com/vuetifyjs/vuetify/issues/2119
  it('should put id on internal input', () => {
    const wrapper = mountFunction({
      props: { id: 'foo' } as any,
    })

    const input = wrapper.find('input')
    expect(input.element.id).toBe('foo')
  })

  it('should use custom icons', async () => {
    const wrapper = mountFunction({
      props: {
        indeterminateIcon: 'fizzbuzz',
        onIcon: 'foo',
        offIcon: 'bar',
        indeterminate: true,
        value: 'fizz',
      } as any,
    })

    expect(wrapper.html()).toMatchSnapshot()
    await wrapper.setProps({ modelValue: true } as any)
    expect(wrapper.html()).toMatchSnapshot()
    await wrapper.setProps({ modelValue: false } as any)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render themed component', () => {
    const wrapper = mountFunction({
      props: {
        light: true,
      } as any,
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should be disabled', () => {
    const wrapper = mountFunction({
      props: { disabled: true } as any,
    })
    const input = wrapper.find('input')

    expect(input.html()).toMatchSnapshot()
  })

  it('should be render colored checkbox', () => {
    const wrapper = mountFunction({
      props: { color: 'yellow' } as any,
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should apply classes to root element', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: true,
        class: 'shrink mr-2 mt-0',
      } as any,
    })

    const rootElement = wrapper.element

    // Проверяем что корневой элемент имеет основные классы VInput
    expect(rootElement.classList.contains('v-input')).toBe(true)
    expect(rootElement.classList.contains('v-input--selection-controls')).toBe(true)
    expect(rootElement.classList.contains('v-input--checkbox')).toBe(true)
    expect(rootElement.classList.contains('v-input--is-dirty')).toBe(true)

    // Проверяем что переданные классы применены к корневому элементу
    expect(rootElement.classList.contains('shrink')).toBe(true)
    expect(rootElement.classList.contains('mr-2')).toBe(true)
    expect(rootElement.classList.contains('mt-0')).toBe(true)

    // Проверяем что HTML input НЕ содержит эти классы
    const input = wrapper.find('input')
    expect(input.element.classList.contains('shrink')).toBe(false)
    expect(input.element.classList.contains('mr-2')).toBe(false)
    expect(input.element.classList.contains('mt-0')).toBe(false)
  })
})
