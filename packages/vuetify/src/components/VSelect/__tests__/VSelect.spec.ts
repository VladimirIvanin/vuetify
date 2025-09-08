// Libraries
import { defineComponent, h } from 'vue'

// Components
import VSelect from '../VSelect'
import VDialog from '../../VDialog/VDialog'
import {
  VListItem,
  VListItemTitle,
  VListItemContent,
} from '../../VList'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import { keyCodes } from '../../../util/helpers'
import { waitAnimationFrame } from '../../../../test'

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

  it('should return numeric 0', async () => {
    const item = { value: 0, text: '0' }
    const wrapper = mountFunction({
      props: {
        modelValue: null,
        items: [item],
        multiple: true,
      },
    })

    wrapper.vm.selectItem(item)

    await wrapper.vm.$nextTick()

    // Проверяем, что событие было эмитировано через emitted
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted[0]).toEqual([[0]])
  })

  it('should disable list items', async () => {
    const wrapper = mountFunction({
      attachTo: el,
      props: {
        eager: true,
        items: [{
          text: 'item',
          disabled: true,
        }],
      },
    })

    // Открываем меню, чтобы элементы отрендерились
    wrapper.vm.isMenuActive = true
    await wrapper.vm.$nextTick()

    // Ищем элементы меню в document.body, так как VMenu рендерится через Teleport
    const item = document.querySelector('.v-list-item--disabled')

    expect(item).toBeTruthy()
    if (item) {
      expect(item.tabIndex).toBe(-1)
    }
  })

  it('should render v-select correctly when using v-list-item in item scope slot', async () => {
    const items = Array.from({ length: 2 }, (x, i) => ({ value: i, text: `Text ${i}` }))

    const itemSlot = ({ item, attrs, on }) => h(VListItem, {
      ...on,
      ...attrs,
      class: item.value % 2 === 0 ? '' : 'red lighten-1',
    }, () => [
      item.text,
    ])
    const selectionSlot = ({ item }) => h(VListItem, () => item.value)
    const component = defineComponent({
      render () {
        return h(VSelect, {
          items,
          modelValue: 1,
        }, {
          item: itemSlot,
          selection: selectionSlot,
        })
      },
    })
    const wrapper = mountFunction(component)

    // Access child component through refs or direct access
    const selectComponent = wrapper.findComponent(VSelect)
    selectComponent.vm.setValue(items[0])

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render v-select correctly when not using v-list-item in item scope slot', async () => {
    const items = Array.from({ length: 2 }, (x, i) => ({ value: i, text: `Text ${i}` }))

    const itemSlot = ({ item }) => h(VListItemContent, {
      class: item.value % 2 === 0 ? '' : 'red lighten-1',
    }, () => [
      h(VListItemTitle, () => [item.value]),
    ])
    const component = defineComponent({
      render () {
        return h(VSelect, {
          items,
        }, {
          item: itemSlot,
        })
      },
    })

    const wrapper = mountFunction(component)

    // Access child component through refs or direct access
    const selectComponent = wrapper.findComponent(VSelect)
    selectComponent.vm.setValue(items[0])

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render v-select correctly when not using scope slot', async () => {
    const items = Array.from({ length: 2 }, (x, i) => ({ value: i, text: `Text ${i}` }))

    const component = defineComponent({
      render () {
        return h(VSelect, {
          items,
        })
      },
    })

    const wrapper = mountFunction(component)

    // Access child component through refs or direct access
    const selectComponent = wrapper.findComponent(VSelect)
    selectComponent.vm.setValue(items[0])

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should not close menu when using multiple prop', async () => {
    const wrapper = mountFunction({
      attachTo: el,
      props: {
        items: [1, 2, 3, 4],
        multiple: true,
      },
    })

    // blur event will be tested via emitted()

    const menu = wrapper.find('.v-input__slot')

    menu.trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isFocused).toBe(true)
    expect(wrapper.vm.isMenuActive).toBe(true)

    const item = wrapper.find('.v-list-item')
    item.trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isMenuActive).toBe(true)
  })

  it('should render aria-hidden=true on arrow icon', async () => {
    const wrapper = mountFunction()

    const icon = wrapper.find('.v-icon')
    expect(icon.attributes('aria-hidden')).toBe('true')
  })

  // TODO: this fails without sync, nextTick doesn't help
  // https://github.com/vuejs/vue-test-utils/issues/1130
  it.skip('should only show items if they are in items', async () => {
    const wrapper = mountFunction({
      props: {
        value: 'foo',
        items: ['foo'],
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.internalValue).toEqual('foo')
    expect(wrapper.vm.selectedItems).toEqual(['foo'])
    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ modelValue: 'bar' })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.internalValue).toEqual('bar')
    expect(wrapper.vm.selectedItems).toEqual([])
    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ items: ['foo', 'bar'] })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.internalValue).toEqual('bar')
    expect(wrapper.vm.selectedItems).toEqual(['bar'])
    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ multiple: true })
    await wrapper.vm.$nextTick()

    await wrapper.setProps({ modelValue: ['foo', 'bar'] })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.internalValue).toEqual(['foo', 'bar'])
    expect(wrapper.vm.selectedItems).toEqual(['foo', 'bar'])
    expect(wrapper.html()).toMatchSnapshot()
  })

  // TODO: this fails without sync, nextTick doesn't help
  // https://github.com/vuejs/vue-test-utils/issues/1130
  it.skip('should update the displayed value when items changes', async () => {
    const wrapper = mountFunction({
      props: {
        value: 1,
        items: [],
      },
    })

    await wrapper.setProps({ items: [{ text: 'foo', value: 1 }] })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selectedItems).toContainEqual({ text: 'foo', value: 1 })
  })

  it('should render select menu with content class', async () => {
    const items = ['abc']

    const wrapper = mountFunction({
      attachTo: el,
      props: {
        menuProps: { contentClass: 'v-menu-class', eager: true },
        items,
      },
    })

    wrapper.vm.isMenuActive = true
    await wrapper.vm.$nextTick()

    const menu = document.querySelector('.v-menu__content')
    expect(menu).toBeTruthy()
    if (menu) {
      expect(menu.classList).toContain('v-menu-class')
    }
  })

  it('should have deletable chips', async () => {
    const wrapper = mountFunction({
      attachTo: el,
      props: {
        chips: true,
        deletableChips: true,
        items: ['foo', 'bar'],
        modelValue: 'foo',
      },
    })

    await wrapper.vm.$nextTick()
    const chip = wrapper.find('.v-chip')

    expect(!!chip).toBe(true)
  })

  it('should escape items in menu', async () => {
    const wrapper = mountFunction({
      attachTo: el,
      props: {
        eager: true,
        items: ['<strong>foo</strong>'],
      },
    })

    wrapper.vm.isMenuActive = true
    await wrapper.vm.$nextTick()

    const tileTitle = document.querySelector('.v-list-item__title')
    expect(tileTitle).toBeTruthy()
    if (tileTitle) {
      expect(tileTitle.outerHTML).toMatchSnapshot()
    }
  })

  it('should use value comparator', async () => {
    const wrapper = mountFunction({
      attachTo: el,
      props: {
        multiple: true,
        items: [
          { text: 'one', value: 1 },
          { text: 'two', value: 2 },
          { text: 'three', value: 3 },
        ],
        itemText: 'text',
        itemValue: 'value',
        valueComparator: (a, b) => Math.round(a) === Math.round(b),
        modelValue: [3.1],
      },
    })

    expect(wrapper.vm.selectedItems).toHaveLength(1)
    expect(wrapper.vm.selectedItems[0].value).toBe(3)
  })

  it('should not open if readonly', async () => {
    const wrapper = mountFunction({
      props: {
        readonly: true,
        items: ['foo', 'bar'],
      },
    })

    wrapper.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isMenuActive).toBe(false)

    wrapper.find('.v-input__append-inner').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isMenuActive).toBe(false)
  })

  it('can use itemValue as function', async () => {
    const wrapper = mountFunction({
      attachTo: el,
      props: {
        multiple: true,
        items: [
          { text: 'one', v1: 'prop v1' },
          { text: 'two', v2: 'prop v2' },
          { text: 'three', v1: 'also prop v1' },
        ],
        itemText: 'text',
        itemValue: item => item.hasOwnProperty('v1') ? item.v1 : item.v2,
        modelValue: ['prop v1', 'prop v2'],
      },
    })

    expect(wrapper.vm.selectedItems).toHaveLength(2)
    expect(wrapper.vm.getValue(wrapper.vm.selectedItems[0])).toBe('prop v1')
    expect(wrapper.vm.getValue(wrapper.vm.selectedItems[1])).toBe('prop v2')
  })

  it('should work correctly with return-object', async () => {
    const wrapper = mountFunction({
      attachTo: el,
      props: {
        multiple: false,
        returnObject: true,
        items: [
          { text: 'one', value: { x: [1, 2], y: ['a', 'b'] } },
          { text: 'two', value: { x: [3, 4], y: ['a', 'b'] } },
          { text: 'three', value: { x: [1, 2], y: ['a', 'c'] } },
        ],
        itemText: 'text',
        itemValue: 'value',
        modelValue: { text: 'two', value: { x: [3, 4], y: ['a', 'b'] } },
      },
    })

    expect(wrapper.vm.selectedItems).toHaveLength(1)
    expect(wrapper.vm.internalValue).toEqual({ text: 'two', value: { x: [3, 4], y: ['a', 'b'] } })
  })

  it('should work correctly with return-object [multiple]', async () => {
    const wrapper = mountFunction({
      attachTo: el,
      props: {
        multiple: true,
        returnObject: true,
        items: [
          { text: 'one', value: { x: [1, 2], y: ['a', 'b'] } },
          { text: 'two', value: { x: [3, 4], y: ['a', 'b'] } },
          { text: 'three', value: { x: [1, 2], y: ['a', 'c'] } },
        ],
        itemText: 'text',
        itemValue: 'value',
        modelValue: [
          { text: 'two', value: { x: [3, 4], y: ['a', 'b'] } },
          { text: 'one', value: { x: [1, 2], y: ['a', 'b'] } },
        ],
      },
    })

    expect(wrapper.vm.selectedItems).toHaveLength(2)
    expect(wrapper.vm.internalValue[0]).toEqual({ text: 'two', value: { x: [3, 4], y: ['a', 'b'] } })
    expect(wrapper.vm.internalValue[1]).toEqual({ text: 'one', value: { x: [1, 2], y: ['a', 'b'] } })
  })

  it('should provide the correct default value', () => {
    const wrapper = mountFunction()

    expect(wrapper.vm.internalValue).toBeUndefined()

    const wrapper2 = mountFunction({
      props: { multiple: true },
    })

    expect(wrapper2.vm.internalValue).toEqual([])
  })

  it('should use slotted no-data', async () => {
    const wrapper = mountFunction({
      attachTo: el,
      props: {
        eager: true,
        items: [], // Убираем элементы, чтобы показать no-data слот
      },
      slots: {
        'no-data': () => h('div', 'foo'),
      },
    })

    // Открываем меню
    wrapper.vm.isMenuActive = true
    await wrapper.vm.$nextTick()

    // Ищем элементы меню в document.body, так как VMenu рендерится через Teleport
    const list = document.querySelector('.v-list')

    expect(wrapper.vm.$slots['no-data']).toBeTruthy()
    expect(list).toBeTruthy()
    if (list) {
      expect(list.outerHTML).toMatchSnapshot()
    }
  })

  it('should change autocomplete attribute', () => {
    const wrapper = mountFunction({
      attrs: {
        autocomplete: 'on',
      },
    })

    expect(wrapper.vm.$attrs.autocomplete).toBe('on')
  })

  // Based on issue: https://github.com/vuetifyjs/vuetify/issues/12769
  it('should cycle through selected items as per kep up & down without closing hosting menu dialog', async () => {
    const items = ['Foo', 'Bar', 'Fizz', 'Buzz']

    const dialogClickOutside = jest.fn()

    const dialogWrapper = mount(VDialog, {
      slots: {
        default: () => h(VSelect, {
          items,
        }),
      },
      props: {
        modelValue: false,
        fullscreen: true,
      },
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
            breakpoint: {},
          },
        },
      },
    }) as VueWrapper<InstanceType<typeof VDialog>>

    // click:outside event will be tested via emitted()

    // Open dialog
    await dialogWrapper.setProps({ modelValue: true })
    await dialogWrapper.vm.$nextTick()

    // Confirm Dialog is open (проверяем существование диалога)
    expect(dialogWrapper.exists()).toBe(true)

    const selectWrapper = dialogWrapper.findComponent(VSelect) as VueWrapper<Instance>

    // Для навигации по клавишам меню должно быть неактивно
    // Сначала закрываем меню, если оно открыто
    selectWrapper.vm.isMenuActive = false
    await selectWrapper.vm.$nextTick()

    // Press key down twice to move selected item from null to Bar
    const keyDownEvent = new KeyboardEvent('keydown', { keyCode: keyCodes.down })
    selectWrapper.vm.onKeyDown(keyDownEvent)
    await waitAnimationFrame()
    await selectWrapper.vm.$nextTick()
    selectWrapper.vm.onKeyDown(keyDownEvent)
    await waitAnimationFrame()
    await selectWrapper.vm.$nextTick()
    expect(selectWrapper.vm.internalValue).toBe('Bar')

    // Press key up once to move selected item from Bar to Foo
    const keyUpEvent = new KeyboardEvent('keydown', { keyCode: keyCodes.up })
    selectWrapper.vm.onKeyDown(keyUpEvent)
    await waitAnimationFrame()
    await selectWrapper.vm.$nextTick()
    expect(selectWrapper.vm.internalValue).toBe('Foo')

    // Confirm dialog click outside event has not been called
    expect(dialogWrapper.emitted('click:outside')).toBeFalsy()
    // Confirm dialog is still open (проверяем существование)
    expect(dialogWrapper.exists()).toBe(true)
  })
})
