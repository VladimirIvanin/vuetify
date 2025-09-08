// Components
import VListItem from '../VListItem'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import { Vue3RouterLinkStub } from '../../../../test/util/stubs'

describe('VListItem.ts', () => {
  type Instance = InstanceType<typeof VListItem>
  let mountFunction: (options?: any) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VListItem, {
        global: {
          stubs: {
            'router-link': Vue3RouterLinkStub,
          },
          ...options.global,
        },
        ...options,
      })
    }
  })

  it('should render with a div when inactive is true and href is used', () => {
    const wrapper = mountFunction({
      props: {
        href: 'http://www.google.com',
        inactive: true,
      },
    })

    expect(wrapper.element.tagName.toLowerCase()).toBe('div')
    expect(wrapper.classes('v-list-item--link')).toBe(false)
  })

  it('should render with a tag when tag is specified', () => {
    const wrapper = mountFunction({
      props: {
        tag: 'code',
      },
    })

    expect(wrapper.element.tagName.toLowerCase()).toBe('code')
  })

  it('should render with a div when href and to are not used', () => {
    const wrapper = mountFunction()

    expect(wrapper.element.tagName.toLowerCase()).toBe('div')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render with <a> when using href prop', () => {
    const wrapper = mountFunction({
      props: {
        href: 'http://www.google.com',
      },
    })

    const a = wrapper.find('a')

    expect(wrapper.element.tagName.toLowerCase()).toBe('a')
    expect(a.element.getAttribute('href')).toBe('http://www.google.com')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should have --link class when href/to prop present or link prop is used', async () => {
    const wrapper = mountFunction({
      props: {
        href: '/home',
      },
    })

    expect(wrapper.classes('v-list-item--link')).toBe(true)

    await wrapper.setProps({ href: undefined, to: '/foo' })
    expect(wrapper.classes('v-list-item--link')).toBe(true)

    await wrapper.setProps({ to: undefined, link: true })
    expect(wrapper.classes('v-list-item--link')).toBe(true)

    await wrapper.setProps({ link: false })
    expect(wrapper.classes('v-list-item--link')).toBe(false)
  })

  it('should have --link class when click handler present', () => {
    const wrapper = mountFunction({
      props: {
        link: true,
      },
    })

    expect(wrapper.classes('v-list-item--link')).toBe(true)
  })

  it('should have --selectable class if the selectable property is true', () => {
    const wrapper = mountFunction({
      props: {
        selectable: true,
      },
    })

    expect(wrapper.classes('v-list-item--selectable')).toBe(true)
  })

  it('should react to keydown.enter', async () => {
    const click = jest.fn()
    const wrapper = mountFunction({})

    // Мокируем метод click компонента
    wrapper.vm.click = click

    await wrapper.trigger('keydown.enter')

    expect(click).toHaveBeenCalled()
  })

  it('should react to clicks', async () => {
    const blur = jest.fn()
    const toggle = jest.fn()
    const wrapper = mountFunction({})

    wrapper.vm.$el.blur = blur
    wrapper.vm.toggle = toggle

    await wrapper.trigger('click')
    expect(blur).not.toHaveBeenCalled()
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(toggle).toHaveBeenCalled()

    wrapper.vm.click({ detail: 1 })

    expect(blur).toHaveBeenCalled()

    await wrapper.setProps({ to: '/foo' })
    await wrapper.vm.$nextTick()

    expect(toggle).toHaveBeenCalledTimes(2)
    await wrapper.trigger('click')
    expect(toggle).toHaveBeenCalledTimes(2)
  })

  it('should inherit listItemGroup activeClass', () => {
    const wrapper = mountFunction({
      global: {
        provide: {
          listItemGroup: {
            activeClass: 'foobar',
            register: () => {},
            unregister: () => {},
          },
        },
      },
    })

    expect(wrapper.vm.$activeClass).toBe('foobar')
  })

  it('should have the correct aria attributes and tabindex', async () => {
    const wrapper = mountFunction({
      props: { disabled: true },
    })

    expect(wrapper.element.getAttribute('aria-disabled')).toBe('true')
    expect(wrapper.element.tabIndex).toBe(-1)

    await wrapper.setProps({
      disabled: false,
      modelValue: true,
    })

    expect(wrapper.element.getAttribute('aria-disabled')).toBeNull()
    expect(wrapper.element.tabIndex).toBe(-1)

    await wrapper.setProps({ link: true })
    await wrapper.vm.$nextTick()

    expect(wrapper.element.tabIndex).toBe(0)
  })

  it('should have the correct role', async () => {
    // Custom provided
    const wrapper = mountFunction({
      attrs: { role: 'item' },
    })
    expect(wrapper.element.getAttribute('role')).toBe('item')

    // In nav
    const wrapper2 = mountFunction({
      global: {
        provide: { isInNav: true },
      },
    })
    expect(wrapper2.element.getAttribute('role')).toBeNull()

    // In list-item-group
    const wrapper3 = mountFunction({
      global: {
        provide: { isInGroup: true },
      },
    })
    expect(wrapper3.element.getAttribute('role')).toBe('option')
    expect(wrapper3.element.getAttribute('aria-selected')).toBe('false')

    // In menu
    const wrapper4 = mountFunction({
      global: {
        provide: { isInMenu: true },
      },
    })
    expect(wrapper4.element.getAttribute('role')).toBeNull()
    await wrapper4.setProps({ href: '#' }) // could be `to` or `link` as well
    expect(wrapper4.element.getAttribute('role')).toBe('menuitem')
    expect(wrapper4.element.getAttribute('id')).toMatch(/^list-item-\d+$/)

    // In list not a link
    const wrapper5 = mountFunction({
      global: {
        provide: { isInList: true },
      },
    })
    expect(wrapper5.element.getAttribute('role')).toBe('listitem')
  })

  it('should not have an internal state unless its a router-link', async () => {
    const wrapper = mountFunction({})

    expect(wrapper.vm.isActive).toBeFalsy()
    wrapper.vm.toggle()
    expect(wrapper.vm.isActive).toBeFalsy()
    wrapper.vm.toggle()
    expect(wrapper.vm.isActive).toBeFalsy()

    const wrapper2 = mountFunction({
      props: { to: { name: 'test' } },
      global: {
        stubs: {
          'router-link': Vue3RouterLinkStub,
        },
      },
    })

    expect(wrapper2.vm.isActive).toBeFalsy()
    wrapper2.vm.toggle()
    expect(wrapper2.vm.isActive).toBeTruthy()
  })

  it('should not react to keydown.enter when disabled', async () => {
    const click = jest.fn()
    const wrapper = mountFunction({
      global: {
        mocks: { click },
      },
      props: { disabled: true },
    })

    await wrapper.trigger('keydown.enter')

    expect(click).not.toHaveBeenCalled()
  })
})
