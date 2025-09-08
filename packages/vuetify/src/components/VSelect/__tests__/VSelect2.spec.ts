// Libraries
import { defineComponent, h } from 'vue'

// Components
import VSelect from '../VSelect'

// Utilities
import { keyCodes } from '../../../util/helpers'
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import { waitAnimationFrame } from '../../../../test'

const createMountFunction = () => (options = {}) => mount(VSelect, {
  global: {
    mocks: {
      $vuetify: {
        lang: { t: (val: string) => val },
        theme: { dark: false },
        icons: { component: 'mdi' },
      },
    },
  },
  ...options,
})

// eslint-disable-next-line max-statements
describe('VSelect.ts', () => {
  type Instance = InstanceType<typeof VSelect>
  let mountFunction: (options?: object) => VueWrapper<Instance>
  let el

  beforeEach(() => {
    el = document.createElement('div')
    el.setAttribute('data-app', 'true')
    document.body.appendChild(el)
    mountFunction = createMountFunction()
  })

  afterEach(() => {
    document.body.removeChild(el)
  })

  enableAutoUnmount(afterEach)

  it('should use slotted prepend-item', async () => {
    const wrapper = mountFunction({
      props: {
        eager: true,
        attach: false,
        items: ['foo'],
      },
      slots: {
        'prepend-item': () => h('div', 'foo'),
      },
    })

    // Активируем меню через клик на слот
    const slot = wrapper.find('.v-input__slot')
    slot.trigger('click')
    await wrapper.vm.$nextTick()

    // Список рендерится в document.body через Teleport/Portal
    const bodyList = document.querySelector('.v-list')

    expect(wrapper.vm.$slots['prepend-item']).toBeTruthy()
    expect(bodyList).toBeTruthy()
    expect(bodyList.outerHTML).toMatchSnapshot()
  })

  it('should use slotted append-item', async () => {
    const wrapper = mountFunction({
      props: {
        eager: true,
        items: ['foo'],
      },
      slots: {
        'append-item': () => h('div', 'foo'),
      },
    })

    // Активируем меню через клик на слот
    const slot = wrapper.find('.v-input__slot')
    slot.trigger('click')
    await wrapper.vm.$nextTick()

    const bodyList = document.querySelector('.v-list')

    expect(wrapper.vm.$slots['append-item']).toBeTruthy()
    expect(bodyList).toBeTruthy()
    expect(bodyList.outerHTML).toMatchSnapshot()
  })

  it('should use scoped slot for selection generation', () => {
    const wrapper = mountFunction({
      render () {
        return h(VSelect, {
          props: {
            items: ['foo', 'bar'],
            modelValue: 'foo',
          },
          slots: {
            selection: ({ item }) => {
              return h('div', item + ' - from slot')
            },
          },
        })
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should toggle menu on icon click', async () => {
    const wrapper = mountFunction({
      props: {
        items: ['foo', 'bar'],
        'menu-props': {
          offsetY: true,
        },
      },
    })

    const icon = wrapper.find('.v-icon')
    const slot = wrapper.find('.v-input__slot')

    expect(wrapper.vm.isMenuActive).toBe(false)

    slot.trigger('click')
    expect(wrapper.vm.isMenuActive).toBe(true)

    slot.trigger('click')
    expect(wrapper.vm.isMenuActive).toBe(true)

    // Mock mouseup event with a target of
    // the inner icon element
    const event = new Event('mouseup')
    Object.defineProperty(event, 'target', { writable: false, value: icon.element })

    wrapper.vm.hasMouseDown = true
    slot.element.dispatchEvent(event)

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isMenuActive).toBe(false)
  })

  // TODO: this fails without sync, nextTick doesn't help
  // https://github.com/vuejs/vue-test-utils/issues/1130
  it.skip('should calculate the counter value', async () => {
    const wrapper = mountFunction({
      props: {
        items: ['foo'],
        modelValue: 'foo',
      },
    })

    expect(wrapper.vm.computedCounterValue).toBe(3)

    wrapper.setProps({
      items: [{
        text: 'foobarbaz',
        value: 'foo',
      }],
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.computedCounterValue).toBe(9)

    wrapper.setProps({
      items: ['foo', 'bar', 'baz'],
      multiple: true,
      modelValue: ['foo', 'bar'],
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.computedCounterValue).toBe(2)
  })

  it('should return the correct counter value', async () => {
    const wrapper = mountFunction({
      props: {
        items: ['foo', 'bar'],
        modelValue: 'foo',
      },
    })

    expect(wrapper.vm.computedCounterValue).toBe(3)

    await wrapper.setProps({
      multiple: true,
      modelValue: ['foo'],
    })

    expect(wrapper.vm.computedCounterValue).toBe(1)

    await wrapper.setProps({
      counterValue: (value?: string): number => 2,
      multiple: false,
      modelValue: undefined,
    })

    expect(wrapper.vm.computedCounterValue).toBe(2)
  })

  it('should emit a single change event', async () => {
    const wrapper = mountFunction({
      attachTo: el,
      props: {
        attach: true,
        items: ['foo', 'bar'],
      },
    })

    const menu = wrapper.find('.v-input__slot')

    menu.trigger('click')
    await wrapper.vm.$nextTick()

    wrapper.vm.selectItem('foo')
    await wrapper.vm.$nextTick()

    wrapper.vm.blur()
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('change')
    expect(emitted).toBeTruthy()
    expect(emitted[0]).toEqual(['foo'])
  })

  it('should not emit change event when clicked on the selected item', async () => {
    const wrapper = mountFunction({
      props: {
        items: ['foo', 'bar'],
      },
    })

    wrapper.vm.selectItem('foo')
    await wrapper.vm.$nextTick()

    wrapper.vm.selectItem('foo')
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('change')
    expect(emitted).toHaveLength(1)
  })

  // https://github.com/vuetifyjs/vuetify/issues/13658
  it('should not emit when clicked on the selected item - object values', async () => {
    const onInput = jest.fn()
    const itemA = { text: 'A', value: { foo: null } }
    const itemB = { text: 'B', value: { foo: '' } }
    const wrapper = mountFunction({
      props: {
        items: [itemA, itemB],
        modelValue: { foo: null },
      },
    })
    // События теперь тестируются через emitted

    wrapper.vm.selectItem(itemA)
    await wrapper.vm.$nextTick()
    let emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeFalsy()

    wrapper.vm.selectItem(itemB)
    await wrapper.vm.$nextTick()
    emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toHaveLength(1)
  })

  // Inspired by https://github.com/vuetifyjs/vuetify/pull/1425 - Thanks @kevmo314
  it('should open the select when focused and enter, space are pressed', async () => {
    const wrapper = mountFunction({
      attachTo: el,
      props: {
        items: ['foo', 'bar'],
      },
    })

    const input = wrapper.find('input')

    for (const key of ['space', 'enter']) {
      input.trigger('focus')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.isMenuActive).toBe(false)
      input.trigger(`keydown.${key}`)
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.isMenuActive).toBe(true)
      wrapper.vm.isMenuActive = false // reset for next iteration
      await wrapper.vm.$nextTick()
    }
  })

  it('should not open the select when readonly and focused and enter, space, up or down are pressed', async () => {
    const wrapper = mountFunction({
      attachTo: el,
      props: {
        items: ['foo', 'bar'],
        readonly: true,
        menuProps: 'eager',
      },
    })

    const input = wrapper.find('input')

    for (const key of ['up', 'down', 'space', 'enter']) {
      input.trigger('focus')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.isMenuActive).toBe(false)
      input.trigger(`keydown.${key}`)
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.isMenuActive).toBe(false)
      await wrapper.vm.$nextTick()
    }
  })

  it('should clear input value', async () => {
    const wrapper = mountFunction({
      attachTo: el,
      props: {
        clearable: true,
        items: ['foo', 'bar'],
        modelValue: 'foo',
      },
    })

    const clear = wrapper.find('.v-icon')

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.internalValue).toBe('foo')
    clear.trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.internalValue).toBeNull()
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted[0]).toEqual([null])
  })

  it('should be clearable with prop, dirty and single select', async () => {
    const wrapper = mountFunction({
      attachTo: el,
      props: {
        clearable: true,
        items: [1, 2],
        modelValue: 1,
      },
    })

    const clear = wrapper.find('.v-icon')

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.internalValue).toBe(1)
    expect(wrapper.html()).toMatchSnapshot()

    clear.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.internalValue).toBeNull()
    expect(wrapper.vm.isMenuActive).toBe(false)
  })

  it('should be clearable with prop, dirty and multi select', async () => {
    const wrapper = mountFunction({
      attachTo: el,
      props: {
        clearable: true,
        items: [1, 2],
        multiple: true,
        modelValue: [1],
      },
    })

    const clear = wrapper.find('.v-icon')

    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toMatchSnapshot()

    clear.trigger('click')
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('change')
    expect(emitted).toBeTruthy()
    expect(emitted[0]).toEqual([[]])
    expect(wrapper.vm.isMenuActive).toBe(false)
  })

  it('should prepopulate selectedItems', () => {
    const items = ['foo', 'bar', 'baz']

    const wrapper = mountFunction({
      props: {
        items,
        modelValue: 'foo',
      },
    })

    const wrapper2 = mountFunction({
      props: {
        items,
        multiple: true,
        modelValue: ['foo', 'bar'],
      },
    })

    const wrapper3 = mountFunction({
      props: {
        items,
        modelValue: null,
      },
    })

    expect(wrapper.vm.selectedItems).toHaveLength(1)
    expect(wrapper2.vm.selectedItems).toHaveLength(2)
    expect(wrapper3.vm.selectedItems).toHaveLength(0)
  })

  // #1704
  it('should populate select when using value as an object', async () => {
    const wrapper = mountFunction({
      attachTo: el,
      props: {
        items: [
          { text: 'foo', value: { id: 1 } },
          { text: 'foo', value: { id: 2 } },
        ],
        multiple: true,
        modelValue: [{ id: 1 }],
      },
    })

    await wrapper.vm.$nextTick()

    const selections = wrapper.findAll('.v-select__selection')

    expect(selections.length).toBeGreaterThan(0)
  })

  // Discovered when working on #1704
  it('should remove item when re-selecting it', async () => {
    const wrapper = mountFunction({
      attachTo: el,
      props: {
        eager: true,
        items: [
          { text: 'bar', value: { id: 1 } },
          { text: 'foo', value: { id: 2 } },
        ],
        multiple: true,
        modelValue: [{ id: 1 }],
      },
    })

    expect(wrapper.vm.selectedItems).toHaveLength(1)

    // Активируем меню через клик на слот
    const slot = wrapper.find('.v-input__slot')
    slot.trigger('click')
    await wrapper.vm.$nextTick()

    // Элементы рендерятся в document.body через Teleport/Portal
    // Для multiple select кликаем на первый элемент списка (который уже выбран)
    const listItem = document.querySelector('.v-list-item')
    expect(listItem).toBeTruthy()

    listItem.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.selectedItems).toHaveLength(0)
  })

  it('should open menu when cleared with open-on-clear', async () => {
    const wrapper = mountFunction({
      props: {
        clearable: true,
        openOnClear: true,
        items: [1],
        modelValue: 1,
      },
    })

    const clear = wrapper.find('.v-input__icon--clear .v-icon')

    clear.trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isMenuActive).toBe(true)
  })

  /* eslint-disable-next-line max-statements */
  it('should react to different key down', async () => {
    const wrapper = mountFunction({
      props: {
        items: [1, 2, 3, 4],
      },
    })
    const event = new Event('keydown')
    event.keyCode = keyCodes.tab

    wrapper.vm.$refs.input.focus()
    wrapper.vm.onKeyDown(event)

    await waitAnimationFrame()

    const emitted = wrapper.emitted('blur')
    expect(emitted).toBeTruthy()
    expect(wrapper.vm.isMenuActive).toBe(false)

    // Enter and Space
    for (const keyCode of [keyCodes.enter, keyCodes.space]) {
      event.keyCode = keyCode
      wrapper.vm.onKeyDown(event)
      expect(wrapper.vm.isMenuActive).toBe(true)

      await waitAnimationFrame()

      // Escape
      event.keyCode = keyCodes.esc
      wrapper.vm.onKeyDown(event)
      expect(wrapper.vm.isMenuActive).toBe(false)
    }

    // Down arrow
    event.keyCode = keyCodes.down
    expect(wrapper.vm.internalValue).toBeUndefined()

    wrapper.vm.onKeyDown(event)

    await waitAnimationFrame()

    expect(wrapper.vm.internalValue).toBe(1)

    wrapper.vm.onKeyDown(event)

    await waitAnimationFrame()

    expect(wrapper.vm.internalValue).toBe(2)

    // Up arrow
    event.keyCode = keyCodes.up
    wrapper.vm.onKeyDown(event)

    await waitAnimationFrame()

    expect(wrapper.vm.internalValue).toBe(1)

    // End key
    event.keyCode = keyCodes.end
    wrapper.vm.onKeyDown(event)

    await waitAnimationFrame()

    expect(wrapper.vm.internalValue).toBe(4)

    // Home key
    event.keyCode = keyCodes.home
    wrapper.vm.onKeyDown(event)

    await waitAnimationFrame()

    expect(wrapper.vm.internalValue).toBe(1)
  })
})
