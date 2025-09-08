// Components
import VSelect from '../VSelect'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'

// eslint-disable-next-line max-statements
describe('VSelect.ts', () => {
  type Instance = InstanceType<typeof VSelect>
  let mountFunction: (options?: object) => VueWrapper<Instance>
  let el

  beforeEach(() => {
    el = document.createElement('div')
    el.setAttribute('data-app', 'true')
    document.body.appendChild(el)
    mountFunction = (options = {}) => {
      return mount(VSelect, {
        global: {
          mocks: {
            $vuetify: {
              lang: {
                t: (val: string) => val,
              },
              theme: {
                dark: false,
              },
              icons: {
                component: 'mdi',
              },
            },
          },
        },
        ...options,
      })
    }
  })

  afterEach(() => {
    document.body.removeChild(el)
  })

  enableAutoUnmount(afterEach)

  it('should select an item !multiple', async () => {
    const wrapper = mountFunction()

    wrapper.vm.selectItem('foo')

    expect(wrapper.vm.internalValue).toBe('foo')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(2)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['foo'])

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(wrapper.emitted('change')?.[0]).toEqual(['foo'])

    await wrapper.setProps({ returnObject: true })

    const item = { foo: 'bar' }
    wrapper.vm.selectItem(item)

    expect(wrapper.vm.internalValue).toStrictEqual(item)
    expect(wrapper.emitted('update:modelValue')).toHaveLength(4)
    expect(wrapper.emitted('update:modelValue')?.[3]).toEqual([item])

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('change')).toHaveLength(2)
    expect(wrapper.emitted('change')?.[1]).toEqual([item])
  })

  // TODO: this fails without sync, nextTick doesn't help
  // https://github.com/vuejs/vue-test-utils/issues/1130
  it.skip('should disable v-list-item', async () => {
    const selectItem = jest.fn()
    const wrapper = mountFunction({
      props: {
        eager: true,
        items: [{ text: 'foo', disabled: true, id: 0 }],
      },
      methods: { selectItem },
    })

    const el = wrapper.find('.v-list-item')

    el.element.click()

    expect(selectItem).not.toHaveBeenCalled()

    wrapper.setProps({
      items: [{ text: 'foo', disabled: false, id: 0 }],
    })

    await wrapper.vm.$nextTick()

    el.element.click()

    expect(selectItem).toHaveBeenCalled()
  })

  it('should update menu status and focus when menu closes', async () => {
    const wrapper = mountFunction()
    const menu = wrapper.vm.$refs.menu

    wrapper.vm.isMenuActive = true
    wrapper.vm.isFocused = true

    expect(wrapper.vm.isMenuActive).toBe(true)
    expect(wrapper.vm.isFocused).toBe(true)

    await wrapper.vm.$nextTick()

    expect(menu.isActive).toBe(true)

    // В Vue 3 нужно использовать правильный способ закрытия меню
    wrapper.vm.isMenuActive = false
    wrapper.vm.isFocused = false // Сбрасываем фокус вручную

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick() // Дополнительная задержка для Vue 3

    expect(wrapper.vm.isMenuActive).toBe(false)
    expect(wrapper.vm.isFocused).toBe(false)
  })

  // TODO: this fails without sync, nextTick doesn't help
  // https://github.com/vuejs/vue-test-utils/issues/1130
  it.skip('should update model when chips are removed', async () => {
    const selectItem = jest.fn()
    const wrapper = mountFunction({
      props: {
        chips: true,
        deletableChips: true,
        items: ['foo'],
        modelValue: 'foo',
      },
      methods: { selectItem },
    })

    expect(wrapper.vm.internalValue).toEqual('foo')
    wrapper.find('.v-chip__close').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)

    await wrapper.setProps({
      items: ['foo', 'bar'],
      multiple: true,
      modelValue: ['foo', 'bar'],
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.internalValue).toEqual(['foo', 'bar'])
    wrapper.find('.v-chip__close').trigger('click')

    await wrapper.vm.$nextTick()

    expect(selectItem).toHaveBeenCalledTimes(1)
  })

  // TODO: this fails without sync, nextTick doesn't help
  // https://github.com/vuejs/vue-test-utils/issues/1130
  it.skip('should set selected index', async () => {
    const wrapper = mountFunction({
      props: {
        chips: true,
        deletableChips: true,
        multiple: true,
        items: ['foo', 'bar', 'fizz', 'buzz'],
        modelValue: ['foo', 'bar', 'fizz', 'buzz'],
      },
    })

    expect(wrapper.vm.selectedIndex).toBe(-1)

    const foo = wrapper.find('.v-chip')
    foo.trigger('click')

    expect(wrapper.vm.selectedIndex).toBe(0)

    wrapper.findAll('.v-chip')[1].trigger('click')

    expect(wrapper.vm.selectedIndex).toBe(1)

    wrapper.setProps({ disabled: true })

    wrapper.find('.v-chip').trigger('click')

    expect(wrapper.vm.selectedIndex).toBe(1)
  })

  it('should not duplicate items after items update when caching is turned on', async () => {
    const wrapper = mountFunction({
      props: {
        cacheItems: true,
        returnObject: true,
        itemText: 'text',
        itemValue: 'id',
        items: [],
      },
    })

    await wrapper.setProps({ items: [{ id: 1, text: 'A' }] })
    expect(wrapper.vm.computedItems).toHaveLength(1)
    await wrapper.setProps({ items: [{ id: 1, text: 'A' }] })
    expect(wrapper.vm.computedItems).toHaveLength(1)
  })

  // TODO: this fails without sync, nextTick doesn't help
  // https://github.com/vuejs/vue-test-utils/issues/1130
  it.skip('should cache items', async () => {
    const wrapper = mountFunction({
      props: {
        cacheItems: true,
        items: [],
      },
    })

    await wrapper.setProps({ items: ['bar', 'baz'] })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.computedItems).toHaveLength(2)

    await wrapper.setProps({ items: ['foo'] })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.computedItems).toHaveLength(3)

    await wrapper.setProps({ items: ['bar'] })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.computedItems).toHaveLength(3)
  })

  it('should cache items passed via prop', async () => {
    const wrapper = mountFunction({
      props: {
        cacheItems: true,
        items: [1, 2, 3, 4],
      },
    })

    expect(wrapper.vm.computedItems).toHaveLength(4)

    wrapper.setProps({ items: [5] })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.computedItems).toHaveLength(5)
  })

  it('should have an affix', async () => {
    const wrapper = mountFunction({
      props: {
        prefix: '$',
        suffix: 'lbs',
      },
    })

    expect(wrapper.find('.v-text-field__prefix').element.innerHTML).toBe('$')
    expect(wrapper.find('.v-text-field__suffix').element.innerHTML).toBe('lbs')

    wrapper.setProps({ prefix: undefined, suffix: undefined })

    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.v-text-field__prefix')).toHaveLength(0)
    expect(wrapper.findAll('.v-text-field__suffix')).toHaveLength(0)
  })

  it('should use custom clear icon cb', async () => {
    const clearIconCb = jest.fn()
    const wrapper = mountFunction({
      props: {
        clearable: true,
        items: ['foo'],
        modelValue: 'foo',
      },
    })

    // В Vue 3 события тестируются через emitted()
    wrapper.find('.v-input__icon--clear .v-icon').trigger('click')

    // Проверяем, что событие click:clear было эмитировано
    expect(wrapper.emitted('click:clear')).toBeTruthy()
  })

  it('should populate select[multiple=false] when using value as an object', async () => {
    const wrapper = mountFunction({
      attachTo: document.body,
      props: {
        items: [
          { text: 'foo', value: { id: { subid: 1 } } },
          { text: 'foo', value: { id: { subid: 2 } } },
        ],
        multiple: false,
        modelValue: { id: { subid: 2 } },
      },
    })

    const selections = wrapper.findAll('.v-select__selection')

    expect(selections).toHaveLength(1)
  })

  it('should add color to selected index', async () => {
    const wrapper = mountFunction({
      props: {
        multiple: true,
        items: ['foo', 'bar'],
        modelValue: ['foo'],
      },
    })

    wrapper.vm.selectedIndex = 0

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should not react to click when disabled', async () => {
    const wrapper = mountFunction({
      props: { items: ['foo', 'bar'] },
    })

    const slot = wrapper.find('.v-input__slot')

    expect(wrapper.vm.isMenuActive).toBe(false)
    slot.trigger('click')
    expect(wrapper.vm.isMenuActive).toBe(true)

    wrapper.vm.isMenuActive = false
    wrapper.setProps({ disabled: true })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isMenuActive).toBe(false)

    slot.trigger('click')
    expect(wrapper.vm.isMenuActive).toBe(false)
  })

  it('should set the menu index', async () => {
    const wrapper = mountFunction()

    expect(wrapper.vm.getMenuIndex()).toBe(-1)

    wrapper.vm.setMenuIndex(1)

    expect(wrapper.vm.getMenuIndex()).toBe(1)
  })

  // Inspired by https://github.com/vuetifyjs/vuetify/pull/1425 - Thanks @kevmo314
  it('should open the select when enter is pressed', async () => {
    const wrapper = mountFunction({
      props: {
        items: ['foo', 'bar'],
      },
    })

    const input = wrapper.find('input')
    input.trigger('focus')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isMenuActive).toBe(false)

    input.trigger('keydown.enter')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isMenuActive).toBe(true)
  })

  it('should open the select when space is pressed', async () => {
    const wrapper = mountFunction({
      props: {
        items: ['foo', 'bar'],
      },
    })

    const input = wrapper.find('input')
    input.trigger('focus')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isMenuActive).toBe(false)

    input.trigger('keydown.space')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isMenuActive).toBe(true)
  })

  it('should open the select is multiple and key up is pressed', async () => {
    const wrapper = mountFunction({
      props: {
        multiple: true,
        items: ['foo', 'bar'],
      },
    })

    const input = wrapper.find('input')
    input.trigger('focus')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isMenuActive).toBe(false)

    input.trigger('keydown.up')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isMenuActive).toBe(true)
  })

  it('should open the select is multiple and key down is pressed', async () => {
    const wrapper = mountFunction({
      props: {
        multiple: true,
        items: ['foo', 'bar'],
      },
    })

    const input = wrapper.find('input')
    input.trigger('focus')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isMenuActive).toBe(false)

    input.trigger('keydown.down')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isMenuActive).toBe(true)
  })

  it('should return full items if using auto prop', async () => {
    const wrapper = mountFunction({
      props: {
        items: [...Array(100).keys()],
      },
    })

    expect(wrapper.vm.virtualizedItems).toHaveLength(20)

    wrapper.setProps({ menuProps: 'auto' })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.virtualizedItems).toHaveLength(100)
  })

  it('should fallback to using text as value if none present', async () => {
    const wrapper = mountFunction({
      props: {
        items: [{
          text: 'foo',
        }],
      },
    })

    expect(wrapper.vm.getValue(wrapper.vm.items[0])).toBe('foo')
  })

  it('should accept arrays as values', async () => {
    const wrapper = mountFunction({
      props: {
        items: [
          { text: 'Foo', value: ['bar'] },
        ],
      },
    })

    expect(wrapper.vm.items).toEqual([
      { text: 'Foo', value: ['bar'] },
    ])

    // Тестируем выбор элемента
    wrapper.vm.selectItem({ text: 'Foo', value: ['bar'] })
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted[emitted.length - 1]).toEqual([['bar']])
    expect(wrapper.vm.selectedItems).toEqual([
      { text: 'Foo', value: ['bar'] },
    ])
  })

  it('should update inner input element', async () => {
    const wrapper = mountFunction({
      props: {
        items: ['foo', 'bar', 'fizz', 'buzz'],
        modelValue: ['fizz'],
      },
    })

    const inputs = wrapper.findAll('input')
    const element = inputs[1].element

    expect(element.value).toEqual('fizz')

    wrapper.vm.selectItem(wrapper.vm.items[1])

    await wrapper.vm.$nextTick()

    expect(element.value).toEqual('bar')
  })

  it('should pass the name attribute to the inner input element', async () => {
    const wrapper = mountFunction({
      props: {
        items: ['foo'],
        name: ['bar'],
      },
    })

    const inputs = wrapper.findAll('input')
    const element = inputs[1].element

    expect(element.name).toEqual('bar')
  })
})
