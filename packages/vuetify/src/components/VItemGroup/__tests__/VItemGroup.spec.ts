// Libraries
import { h } from 'vue'

// Components
import VItem from '../VItem'
import VItemGroup from '../VItemGroup'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import { ExtractVue } from './../../../util/mixins'

enableAutoUnmount(afterEach)

const defaultSlot = ({ toggle }) => h('div', { onClick: toggle }, 'foobar')

const Mock = {
  name: 'test',

  render: () => h(VItem, {}, {
    default: defaultSlot,
  }),
}

describe('VItemGroup', () => {
  type Instance = ExtractVue<typeof VItemGroup>
  let mountFunction: (options?: object) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VItemGroup, {
        ...options,
      })
    }
  })

  it('should return the correct value', () => {
    const wrapper = mountFunction()

    const getValue = wrapper.vm.getValue

    expect(getValue({ value: null }, 0)).toBeNull()
    expect(getValue({ value: undefined }, 1)).toBe(1)
    expect(getValue({ value: '' }, 2)).toBe('')
    expect(getValue({ value: 'foo' }, 'foo')).toBe('foo')
  })

  it('should register elements', () => {
    const wrapper = mountFunction({
      slots: {
        default: [Mock],
      },
    })

    expect(wrapper.vm.items).toHaveLength(1)

    // Тестируем регистрацию элементов
    const item = wrapper.findComponent({ name: 'v-item' })
    expect(item.exists()).toBe(true)
  })

  it('should register and activate elements', () => {
    const wrapper = mountFunction({
      props: { modelValue: 0 },
      slots: { default: [Mock] },
    })

    expect(wrapper.vm.items).toHaveLength(1)

    // Find the v-item component
    const item = wrapper.findComponent({ name: 'v-item' })

    expect(item.vm.isActive).toBe(true)
  })

  it('should update state from child clicks', async () => {
    const wrapper = mountFunction({
      slots: {
        default: [
          Mock,
          Mock,
        ],
      },
    })

    expect(wrapper.vm.items).toHaveLength(2)

    const [child1, child2] = wrapper.element.children

    child1.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.internalValue).toBe(0)

    child2.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.internalValue).toBe(1)

    child2.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.internalValue).toBeUndefined()

    await wrapper.setProps({
      modelValue: [],
      multiple: true,
    })
    await wrapper.vm.$nextTick()

    child1.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.internalValue).toEqual([0])

    child2.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.internalValue).toEqual([0, 1])

    child1.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.internalValue).toEqual([1])
  })

  it('should have a conditional method for toggling items', async () => {
    const wrapper = mountFunction()

    expect(wrapper.vm.toggleMethod(0)).toBe(false)

    await wrapper.setProps({ modelValue: 0 })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.toggleMethod(0)).toBe(true)

    await wrapper.setProps({
      multiple: true,
      modelValue: [],
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.toggleMethod(0)).toBe(false)

    await wrapper.setProps({ modelValue: [0] })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.toggleMethod(0)).toBe(true)

    await wrapper.setProps({ modelValue: 0 })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.toggleMethod(0)).toBe(false)
  })

  it('should correctly be active with objects having different references', async () => {
    const wrapper = mountFunction()

    await wrapper.setProps({ modelValue: { a: 1 } })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.toggleMethod({ a: 1 })).toBe(true)
    expect(wrapper.vm.toggleMethod({ a: 2 })).toBe(false)
  })

  it('should have a customizable comparator function', async () => {
    const wrapper = mountFunction()

    await wrapper.setProps({ valueComparator: (a: any, b: any) => a === b + 1, modelValue: 0 })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.toggleMethod(0)).toBe(false)
    expect(wrapper.vm.toggleMethod(-1)).toBe(true)
  })

  it('should select the first item if mandatory and no value', async () => {
    const wrapper = mountFunction({
      props: { mandatory: true },
      slots: {
        default: [Mock],
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selectedItems).toHaveLength(1)
    expect(wrapper.vm.internalValue).toBe(0)

    wrapper.setProps({ multiple: true })

    // Manually update selected items
    wrapper.vm.updateItemsState()

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selectedItems).toHaveLength(1)
    expect(wrapper.vm.internalValue).toEqual([0])
  })

  it('should update a single item group', async () => {
    const wrapper = mountFunction()

    // Toggling on and off
    wrapper.vm.updateSingle('foo')
    expect(wrapper.vm.internalValue).toBe('foo')
    wrapper.vm.updateSingle('foo')
    expect(wrapper.vm.internalValue).toBeUndefined()

    // Toggling on and off object references
    wrapper.vm.updateSingle({ foo: 'foo' })
    expect(wrapper.vm.internalValue).toEqual({ foo: 'foo' })
    wrapper.vm.updateSingle({ foo: 'foo' })
    expect(wrapper.vm.internalValue).toBeUndefined()

    // Toggling on and off with custom comparator
    await wrapper.setProps({ valueComparator: (a: any, b: any) => a?.startsWith(b?.[0]), modelValue: 'foo' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.internalValue).toBe('foo')
    wrapper.vm.updateSingle('foobar')
    expect(wrapper.vm.internalValue).toBeUndefined()

    await wrapper.setProps({ mandatory: true })
    await wrapper.vm.$nextTick()

    // Toggling off single mandatory
    wrapper.vm.updateSingle('foo')
    expect(wrapper.vm.internalValue).toBe('foo')
    wrapper.vm.updateSingle('foo')
    expect(wrapper.vm.internalValue).toBe('foo')
  })

  it('should update a multiple item group', async () => {
    const wrapper = mountFunction({
      props: { multiple: true },
    })

    // Toggling on and off
    wrapper.vm.updateMultiple('foo')
    expect(wrapper.vm.internalValue).toEqual(['foo'])
    wrapper.vm.updateMultiple('foo')
    expect(wrapper.vm.internalValue).toEqual([])

    // Toggling on and off object references
    wrapper.vm.updateMultiple({ foo: 'foo' })
    expect(wrapper.vm.internalValue).toEqual([{ foo: 'foo' }])
    wrapper.vm.updateMultiple({ foo: 'foo' })
    expect(wrapper.vm.internalValue).toEqual([])

    await wrapper.setProps({ mandatory: true })
    await wrapper.vm.$nextTick()

    // Toggling off single mandatory - должно добавить элемент перед попыткой его удалить
    wrapper.vm.updateMultiple('foo')
    expect(wrapper.vm.internalValue).toEqual(['foo'])
    wrapper.vm.updateMultiple('foo')
    expect(wrapper.vm.internalValue).toEqual(['foo']) // mandatory не позволяет удалить последний

    await wrapper.setProps({ max: 3 })
    await wrapper.vm.$nextTick()

    // Should enforce maximum selection
    wrapper.vm.updateMultiple('bar')
    expect(wrapper.vm.internalValue).toEqual(['foo', 'bar'])
    wrapper.vm.updateMultiple('fizz')
    expect(wrapper.vm.internalValue).toEqual(['foo', 'bar', 'fizz'])
    wrapper.vm.updateMultiple('buzz')
    expect(wrapper.vm.internalValue).toEqual(['foo', 'bar', 'fizz'])
  })

  it('should update a multiple item group with a custom comparator', async () => {
    const wrapper = mountFunction({
      props: { multiple: true },
    })

    await wrapper.setProps({ valueComparator: (a: any, b: any) => a?.startsWith(b?.[0]), modelValue: ['foo'] })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.internalValue).toEqual(['foo'])
    wrapper.vm.updateMultiple('foobar')
    expect(wrapper.vm.internalValue).toEqual([])
  })

  it('should update value if mandatory and dynamic items', async () => {
    // Тест для динамического изменения элементов
    const wrapper = mountFunction({
      props: {
        multiple: true,
        modelValue: [2],
      },
      slots: {
        default: [
          Mock,
          Mock,
          Mock,
        ],
      },
    })

    expect(wrapper.vm.items).toHaveLength(3)
    expect(wrapper.vm.internalValue).toEqual([2])

    // Тестируем обязательный выбор
    wrapper.setProps({ mandatory: true, modelValue: [1] })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.internalValue).toEqual([1])
  })

  // https://github.com/vuetifyjs/vuetify/issues/5384
  it('should not unregister children when is destroyed', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: 0,
      },
      slots: {
        default: [Mock],
      },
    })

    const eventsBefore = wrapper.emitted('update:modelValue')?.length || 0

    wrapper.unmount()

    const eventsAfter = wrapper.emitted('update:modelValue')?.length || 0

    expect(eventsAfter - eventsBefore).toBeLessThanOrEqual(1)
  })

  // https://github.com/vuetifyjs/vuetify/issues/5000
  it('should update mandatory to first non-disabled item', () => {
    const Mock2 = {
      name: 'mock2',

      render () {
        return h(VItem, {
          disabled: true,
        }, {
          default: defaultSlot,
        })
      },
    }

    const wrapper = mountFunction({
      props: {
        mandatory: true,
      },
      slots: {
        default: [
          Mock2,
          Mock,
          Mock,
        ],
      },
    })

    expect(wrapper.vm.internalValue).toBe(1)
  })

  // https://github.com/vuetifyjs/vuetify/issues/6278
  it('should infer index dynamically', () => {
    const wrapper = mount(VItemGroup, {
      props: { modelValue: 0 },
      slots: {
        default: [
          Mock,
          Mock,
          Mock,
        ],
      },
    })

    const items = wrapper.findAllComponents({ name: 'v-item' })
    expect(items).toHaveLength(3)

    // Тестируем клик по третьему элементу
    const item3 = items[2]
    item3.trigger('click')

    expect(wrapper.vm.internalValue).toBe(2)
  })

  it('should have the correct selected index, item and items', async () => {
    const wrapper = mountFunction({
      slots: {
        default: [Mock, Mock, Mock],
      },
    })

    expect(wrapper.vm.items).toHaveLength(3)

    await wrapper.setProps({ modelValue: 1 })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selectedIndex).toBe(1)
    expect(wrapper.vm.selectedItem).toEqual(wrapper.vm.items[1])

    await wrapper.setProps({ modelValue: 2 })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selectedIndex).toBe(2)
    expect(wrapper.vm.selectedItem).toEqual(wrapper.vm.items[2])
  })

  it('should render with a specified tag when the tag prop is provided with a value', () => {
    const wrapper = mountFunction({
      props: {
        tag: 'button',
      },
    })

    expect(wrapper.element.tagName.toLowerCase()).toBe('button')
  })
})
