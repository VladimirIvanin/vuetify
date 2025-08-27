/// <reference path="../../../../test/types/jest.d.ts" />

// Libraries
import { h, nextTick } from 'vue'

// Components
import VItem from '../VItem'
import VItemGroup from '../VItemGroup'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'

// Types
type VItemGroupInstance = InstanceType<typeof VItemGroup> & {
  getValue: (item: any, index: number) => any
  toggleMethod: (value: any) => boolean
  updateItemsState: () => void
  updateSingle: (value: any) => void
  updateMultiple: (value: any) => void
  internalValue: any
  items: any[]
  selectedIndex: number
  selectedItem: any
  selectedItems: any[]
}

type VItemGroupProps = {
  modelValue?: any
  multiple?: boolean
  mandatory?: boolean
  max?: number | string
  valueComparator?: (a: any, b: any) => boolean
  activeClass?: string
  tag?: string
}

const defaultSlot = ({ toggle }: { toggle: () => void }) => h('div', { onClick: toggle }, 'foobar')

const Mock = {
  name: 'test',
  render: () => h(VItem, {}, {
    default: defaultSlot,
  }),
}

describe('VItemGroup', () => {
  let mountFunction: (options?: object) => VueWrapper<VItemGroupInstance>

  // Включаем автоматическое размонтирование после каждого теста
  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VItemGroup, {
        ...options,
      }) as VueWrapper<VItemGroupInstance>
    }
  })

  it('should warn if using multiple prop without an array value', () => {
    mountFunction({
      props: {
        multiple: true,
        modelValue: '',
      },
    })

    // @ts-ignore: Jest custom matcher
    expect('Model must be bound to an array if the multiple property is true').toHaveBeenTipped()
  })

  it('should return the correct value', () => {
    const wrapper = mountFunction()

    const getValue = wrapper.vm.getValue

    expect(getValue({ value: null }, 0)).toBeNull()
    expect(getValue({ value: undefined }, 1)).toBe(1)
    expect(getValue({ value: '' }, 2)).toBe('')
    expect(getValue({ value: 'foo' }, 3)).toBe('foo')
  })

    it('should register elements', async () => {
    const wrapper = mountFunction({
      slots: {
        default: [Mock],
      },
    })

    await nextTick()

    expect(wrapper.vm.items).toHaveLength(1)

    const item = wrapper.findComponent(VItem)

    // Проверяем, что элемент найден и зарегистрирован
    expect(item.exists()).toBe(true)

    // Тестируем регистрацию элементов в пустом состоянии
    const emptyWrapper = mountFunction({
      slots: {
        default: []
      }
    })

    await nextTick()

    expect(emptyWrapper.vm.items).toHaveLength(0)
  })

  it('should register and activate elements', async () => {
    const wrapper = mountFunction({
      props: { modelValue: 0 },
      slots: { default: [Mock] },
    })

    await nextTick()

    expect(wrapper.vm.items).toHaveLength(1)

    const item = wrapper.findComponent(VItem)

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

    await nextTick()

    expect(wrapper.vm.items).toHaveLength(2)

    const [child1, child2] = wrapper.vm.$el.children

    // Тест в режиме single selection
    await child1.click()
    let emittedEvents = wrapper.emitted()['update:modelValue'] as Array<any[]>
    expect(emittedEvents).toBeTruthy()
    expect(emittedEvents[emittedEvents.length - 1]).toEqual([0])
    expect(wrapper.vm.internalValue).toBe(0)

    await child2.click()
    emittedEvents = wrapper.emitted()['update:modelValue'] as Array<any[]>
    expect(emittedEvents[emittedEvents.length - 1]).toEqual([1])
    expect(wrapper.vm.internalValue).toBe(1)

    await child2.click()
    expect(wrapper.vm.internalValue).toBeUndefined()

    // Переключаем в режим multiple selection
    await wrapper.setProps({
      modelValue: [],
      multiple: true,
    } as any)

    await child1.click()
    emittedEvents = wrapper.emitted()['update:modelValue'] as Array<any[]>
    expect(emittedEvents[emittedEvents.length - 1]).toEqual([[0]])

    await child2.click()
    emittedEvents = wrapper.emitted()['update:modelValue'] as Array<any[]>
    expect(emittedEvents[emittedEvents.length - 1]).toEqual([[0, 1]])

    await child1.click()
    emittedEvents = wrapper.emitted()['update:modelValue'] as Array<any[]>
    expect(emittedEvents[emittedEvents.length - 1]).toEqual([[1]])
  })

  it('should have a conditional method for toggling items', async () => {
    const wrapper = mountFunction()

    expect(wrapper.vm.toggleMethod(0)).toBe(false)

    await wrapper.setProps({ modelValue: 0 } as any)

    expect(wrapper.vm.toggleMethod(0)).toBe(true)

    await wrapper.setProps({
      multiple: true,
      modelValue: [],
    } as any)

    expect(wrapper.vm.toggleMethod(0)).toBe(false)

    await wrapper.setProps({ modelValue: [0] } as any)

    expect(wrapper.vm.toggleMethod(0)).toBe(true)

    await wrapper.setProps({ modelValue: 0 } as any)

    expect(wrapper.vm.toggleMethod(0)).toBe(false)
  })

  it('should correctly be active with objects having different references', async () => {
    const wrapper = mountFunction()

    await wrapper.setProps({ modelValue: { a: 1 } } as any)
    expect(wrapper.vm.toggleMethod({ a: 1 })).toBe(true)
    expect(wrapper.vm.toggleMethod({ a: 2 })).toBe(false)
  })

  it('should have a customizable comparator function', async () => {
    const wrapper = mountFunction()

    await wrapper.setProps({ valueComparator: (a: any, b: any) => a === b + 1, modelValue: 0 } as any)

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

    await nextTick()

    expect(wrapper.vm.selectedItems).toHaveLength(1)
    expect(wrapper.vm.internalValue).toBe(0)

    await wrapper.setProps({ multiple: true } as any)

    // Manually update selected items
    wrapper.vm.updateItemsState()

    await nextTick()

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
    await wrapper.setProps({ valueComparator: (a: any, b: any) => a?.startsWith(b?.[0]), modelValue: 'foo' } as any)
    expect(wrapper.vm.internalValue).toBe('foo')
    wrapper.vm.updateSingle('foobar')
    expect(wrapper.vm.internalValue).toBeUndefined()

    await wrapper.setProps({ mandatory: true } as any)

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

    await wrapper.setProps({ mandatory: true } as any)

    // Toggling off single mandatory
    wrapper.vm.updateMultiple('foo')
    expect(wrapper.vm.internalValue).toEqual(['foo'])
    wrapper.vm.updateMultiple('foo')
    expect(wrapper.vm.internalValue).toEqual(['foo'])

    await wrapper.setProps({ max: 3 } as any)

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

    await wrapper.setProps({ valueComparator: (a: any, b: any) => a?.startsWith(b?.[0]), modelValue: ['foo'] } as any)
    expect(wrapper.vm.internalValue).toEqual(['foo'])
    wrapper.vm.updateMultiple('foobar')
    expect(wrapper.vm.internalValue).toEqual([])
  })

  it('should update value if mandatory and dynamic items', async () => {
    // Тестируем поведение mandatory через ручные манипуляции с items
    const wrapper = mountFunction({
      props: {
        multiple: true,
        modelValue: [3],
      },
      slots: {
        default: [Mock, Mock, Mock, Mock],
      },
    })

    await nextTick()

    // Изначально 4 элемента, выбран элемент с индексом 3
    expect(wrapper.vm.items).toHaveLength(4)
    expect(wrapper.vm.internalValue).toEqual([3])

    // Ручно удаляем последний элемент (с индексом 3)
    const lastItem = wrapper.vm.items[3]
    ;(wrapper.vm as any).unregister(lastItem)

    await nextTick()

    // Проверяем, что выбранное значение очистилось
    expect(wrapper.vm.items).toHaveLength(3)
    expect(wrapper.vm.internalValue).toEqual([])

    // Тестируем с mandatory: true и выбранным элементом с индексом 2
    await wrapper.setProps({
      mandatory: true,
      modelValue: [2]
    } as any)
    await nextTick()

    // Ручно удаляем элемент с индексом 2
    const item2 = wrapper.vm.items[2]
    ;(wrapper.vm as any).unregister(item2)

    await nextTick()

    // С mandatory должен быть выбран последний доступный элемент
    expect(wrapper.vm.items).toHaveLength(2)
    expect(wrapper.vm.internalValue).toEqual([1])

    // Переключаемся на single selection
    await wrapper.setProps({
      multiple: false,
      modelValue: 1
    } as any)
    await nextTick()

    // Удаляем выбранный элемент
    const item1 = wrapper.vm.items[1]
    ;(wrapper.vm as any).unregister(item1)

    await nextTick()

    // Должен быть выбран элемент с индексом 0
    expect(wrapper.vm.items).toHaveLength(1)
    expect(wrapper.vm.internalValue).toBe(0)

    // Удаляем последний элемент
    const item0 = wrapper.vm.items[0]
    ;(wrapper.vm as any).unregister(item0)

    await nextTick()

    // Без элементов значение должно быть undefined
    expect(wrapper.vm.items).toHaveLength(0)
    expect(wrapper.vm.internalValue).toBeUndefined()
  })

  // https://github.com/vuetifyjs/vuetify/issues/5384
  it('should handle unregister correctly', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: 0,
      },
      slots: {
        default: [Mock],
      },
    })

    await nextTick()

    expect(wrapper.vm.items).toHaveLength(1)
    expect(wrapper.vm.internalValue).toBe(0)

    // Проверяем, что событие update:modelValue не эмитится при нормальной работе
    const emittedBefore = wrapper.emitted()['update:modelValue'] || []

    // Ручно вызываем unregister для симуляции удаления элемента
    const item = wrapper.vm.items[0]
    ;(wrapper.vm as any).unregister(item)

    // После unregister элемент должен быть удален из списка
    expect(wrapper.vm.items).toHaveLength(0)

    // При unregister должно эмитироваться событие с обновленным значением
    const emittedAfter = wrapper.emitted()['update:modelValue'] || []
    expect(emittedAfter.length).toBeGreaterThan(emittedBefore.length)
    expect(emittedAfter[emittedAfter.length - 1]).toEqual([undefined])
  })

  it('should handle manual item registration and unregistration', async () => {
    const wrapper = mountFunction({
      props: {
        multiple: true,
        modelValue: [0, 1],
      },
      slots: {
        default: [Mock, Mock],
      },
    })

    await nextTick()

    expect(wrapper.vm.items).toHaveLength(2)
    expect(wrapper.vm.internalValue).toEqual([0, 1])

    // Ручно удаляем первый элемент
    const firstItem = wrapper.vm.items[0]
    ;(wrapper.vm as any).unregister(firstItem)

    expect(wrapper.vm.items).toHaveLength(1)

    // После удаления первого элемента (индекс 0), значение [0] должно исчезнуть
    // и остаться только [1], но так как первый элемент был удален,
    // то значение [1] больше не существует в новой структуре
    const emittedEvents = wrapper.emitted()['update:modelValue'] as Array<any[]>
    expect(emittedEvents).toBeTruthy()
    // После удаления элемента с индексом 0, значение [1] остается, так как
    // оно относится к элементу, который теперь имеет индекс 0
    expect(wrapper.vm.internalValue).toEqual([1])
  })

  // https://github.com/vuetifyjs/vuetify/issues/5000
  it('should update mandatory to first non-disabled item', async () => {
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

    await nextTick()

    expect(wrapper.vm.internalValue).toBe(1)
  })

  // https://github.com/vuetifyjs/vuetify/issues/6278
  it('should infer index dynamically', async () => {
    // Упрощенный тест динамических индексов
    const wrapper = mountFunction({
      props: { modelValue: 2 },
      slots: {
        default: [Mock, Mock, Mock],
      },
    })

    await nextTick()

    // Изначально 3 элемента, выбран третий (индекс 2)
    expect(wrapper.vm.items).toHaveLength(3)
    expect(wrapper.vm.internalValue).toBe(2)

    // Удаляем средний элемент (индекс 1)
    const secondItem = wrapper.vm.items[1]
    ;(wrapper.vm as any).unregister(secondItem)

    await nextTick()

    // После удаления элемента остается 2 элемента
    expect(wrapper.vm.items).toHaveLength(2)

    // Значение 2 сохраняется в internalValue, даже если соответствующий элемент
    // больше не существует в массиве items
    expect(wrapper.vm.internalValue).toBe(2)

    // selectedItems должен быть пустым, так как элемент с таким значением больше не найден
    const activeItems = wrapper.vm.selectedItems
    expect(activeItems).toHaveLength(0)
  })

  it('should have the correct selected index, item and items', async () => {
    const wrapper = mountFunction({
      slots: {
        default: [Mock, Mock, Mock],
      },
    })

    await nextTick()

    expect(wrapper.vm.items).toHaveLength(3)

    await wrapper.setProps({ modelValue: 1 } as any)

    expect(wrapper.vm.selectedIndex).toBe(1)
    expect(wrapper.vm.selectedItem).toEqual(wrapper.vm.items[1])

    await wrapper.setProps({ modelValue: 2 } as any)

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
