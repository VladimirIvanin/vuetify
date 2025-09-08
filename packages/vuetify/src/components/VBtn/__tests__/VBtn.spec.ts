/* eslint-disable max-statements */
// Components
import VBtn from '../VBtn'

// Utilities
import { mount, enableAutoUnmount, VueWrapper } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import { Vue3RouterLinkStub } from '../../../../test/util/stubs'

// Auto cleanup after each test
enableAutoUnmount(afterEach)

describe('VBtn.ts', () => {
  // eslint-disable-line max-statements
  let mountFunction: (options?: object) => VueWrapper<any>
  let router: any

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/foobar', component: { template: '<div>Foobar</div>' } },
        { path: '/fizzbuzz', component: { template: '<div>Fizzbuzz</div>' } },
        { path: '/foo', component: { template: '<div>Foo</div>' } },
      ],
    })

    mountFunction = (options = {}) => {
      return mount(VBtn, {
        global: {
          plugins: [router],
          components: {
            'router-link': Vue3RouterLinkStub,
          },
          ...options.global,
        },
        ...options,
      })
    }
  })

  it('should render component and match snapshot', () => {
    expect(mountFunction().html()).toMatchSnapshot()
  })

  it('should render component with color prop and match snapshot', () => {
    expect(
      mountFunction({
        props: {
          color: 'green darken-1',
        },
      }).html()
    ).toMatchSnapshot()

    expect(
      mountFunction({
        props: {
          color: 'green darken-1',
          text: true,
        },
      }).html()
    ).toMatchSnapshot()
  })

  it('should render component with loader slot and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        loading: true,
      },
      slots: {
        loader: '<span>loader</span>',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should register and unregister', () => {
    const register = jest.fn()
    const unregister = jest.fn()

    const wrapper = mountFunction({
      global: {
        provide: {
          btnToggle: {
            register,
            unregister,
          },
        },
      },
    })

    expect(register).toHaveBeenCalled()
    wrapper.unmount()
    expect(unregister).toHaveBeenCalled()
  })
  it('should use custom active-class', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: true,
        activeClass: 'foo',
      },
    })

    expect(wrapper.classes('foo')).toBe(true)
  })

  it('should have v-btn--plain class when plain prop is set to true', () => {
    const wrapper = mountFunction({
      props: {
        plain: true,
      },
    })

    expect(wrapper.classes('v-btn--plain')).toBe(true)
  })

  it('should have the correct icon classes', async () => {
    const wrapper = mountFunction({
      props: {
        icon: true,
      },
    })
    expect(wrapper.classes('v-btn--icon')).toBe(true)

    await wrapper.setProps({ icon: false })

    expect(wrapper.classes('v-btn--icon')).toBe(false)
  })

  it('should have the correct elevation', async () => {
    // eslint-disable-line max-statements
    const wrapper = mountFunction()

    await wrapper.setProps({ disabled: true })
    expect(wrapper.classes('elevation-2')).toBe(false)
    expect(wrapper.classes('v-btn--disabled')).toBe(true)

    await wrapper.setProps({ disabled: false, elevation: 24 })
    expect(wrapper.classes('elevation-24')).toBe(true)

    await wrapper.setProps({ elevation: 2 })
    expect(wrapper.classes('elevation-2')).toBe(true)
  })

  it('should stringify non string|number values', async () => {
    const wrapper = mountFunction({
      props: {
        value: 'foo',
      },
    })

    expect(wrapper.attributes('value')).toBe('foo')

    await wrapper.setProps({ value: 2 })
    expect(wrapper.attributes('value')).toBe('2')

    await wrapper.setProps({ value: { foo: 'bar' } })
    expect(wrapper.attributes('value')).toBe('{"foo":"bar"}')
  })

  it('should not add color classes if disabled', async () => {
    const wrapper = mountFunction({
      props: {
        color: 'primary darken-2',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({
      disabled: true,
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should retain focus when clicked', async () => {
    const wrapper = mountFunction({
      props: {
        retainFocusOnClick: true,
      },
    })
    const event = new MouseEvent('click', { detail: 1 })
    const blur = jest.fn()

    wrapper.element.blur = blur
    wrapper.element.dispatchEvent(event)

    expect(blur).not.toHaveBeenCalled()

    await wrapper.setProps({ retainFocusOnClick: false })
    wrapper.element.dispatchEvent(event)

    expect(blur).toHaveBeenCalled()
  })

  // Test attributes inheritance and merging
  it('should handle attributes inheritance correctly', () => {
    const wrapper = mount(VBtn, {
      global: {
        plugins: [router],
      },
      attrs: {
        'data-test': 'my-button',
        'aria-label': 'Test button',
        id: 'custom-id',
        class: 'custom-class another-class',
      },
      props: {
        color: 'primary',
      },
    })

    // Check that component receives attrs
    expect(wrapper.vm.$attrs['data-test']).toBe('my-button')
    expect(wrapper.vm.$attrs['aria-label']).toBe('Test button')
    expect(wrapper.vm.$attrs.id).toBe('custom-id')

    // Check class merging
    expect(wrapper.classes()).toContain('custom-class')
    expect(wrapper.classes()).toContain('another-class')
    expect(wrapper.classes()).toContain('v-btn')
  })

  it('should render loader when loading prop is true', () => {
    const wrapper = mountFunction({
      props: {
        loading: true,
      },
    })

    expect(wrapper.classes('v-btn--loading')).toBe(true)
    expect(wrapper.find('.v-btn__loader').exists()).toBe(true)
  })
  it('should compute button states and classes correctly', () => {
    // Test multiple button variants and their classes
    const variants = [
      { props: {}, classes: ['v-btn'], hasBg: true, isElevated: true, isRound: false },
      { props: { text: true }, classes: ['v-btn--text'], hasBg: false, isElevated: false, isRound: false },
      { props: { plain: true }, classes: ['v-btn--plain'], hasBg: false, isElevated: false, isRound: false },
      { props: { outlined: true }, classes: ['v-btn--outlined'], hasBg: false, isElevated: false, isRound: false },
      { props: { icon: true }, classes: ['v-btn--icon'], hasBg: false, isElevated: false, isRound: true },
      { props: { fab: true }, classes: ['v-btn--fab'], hasBg: true, isElevated: true, isRound: true },
      { props: { block: true }, classes: ['v-btn--block'], hasBg: true, isElevated: true, isRound: false },
      { props: { rounded: true }, classes: ['v-btn--rounded'], hasBg: true, isElevated: true, isRound: false },
      { props: { disabled: true }, classes: ['v-btn--disabled'], hasBg: true, isElevated: false, isRound: false },
    ]

    variants.forEach(({ props, classes, hasBg, isElevated, isRound }) => {
      const wrapper = mountFunction({ props })

      // Check classes
      classes.forEach(className => {
        expect(wrapper.classes(className)).toBe(true)
      })

      // Check computed properties
      expect(wrapper.vm.hasBg).toBe(hasBg)
      expect(wrapper.vm.isElevated).toBe(isElevated)
      expect(wrapper.vm.isRound).toBe(isRound)
    })
  })

  it('should compute ripple correctly', () => {
    // Should have ripple by default
    let wrapper = mountFunction()
    expect(wrapper.vm.computedRipple).toBe(true)

    // Should not have ripple when disabled
    wrapper = mountFunction({
      props: { disabled: true },
    })
    expect(wrapper.vm.computedRipple).toBe(false)

    // Should have circle ripple for icon buttons
    wrapper = mountFunction({
      props: { icon: true },
    })
    expect(wrapper.vm.computedRipple).toEqual({ circle: true })

    // Should have circle ripple for fab buttons
    wrapper = mountFunction({
      props: { fab: true },
    })
    expect(wrapper.vm.computedRipple).toEqual({ circle: true })
  })
  it('should add router class when to prop is provided', () => {
    const wrapper = mountFunction({
      props: {
        to: '/test-route',
      },
      slots: {
        default: () => 'Router Button',
      },
    })

    expect(wrapper.classes('v-btn--router')).toBe(true)
  })
})
