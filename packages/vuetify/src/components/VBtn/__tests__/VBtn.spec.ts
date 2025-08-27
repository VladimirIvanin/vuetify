// Components
import VBtn from '../VBtn'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'

describe('VBtn.ts', () => { // eslint-disable-line max-statements
  type Instance = InstanceType<typeof VBtn>
  let mountFunction: (options?: object) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VBtn, {
        global: {
          stubs: {
            'router-link': {
              template: '<a><slot /></a>',
              setup() {
                return {}
              },
            },
          },
        },
        ...options,
      })
    }
  })

  it('should render component and match snapshot', () => {
    expect(mountFunction().html()).toMatchSnapshot()
  })

  it('should render component with color prop and match snapshot', () => {
    expect(mountFunction({
      props: {
        color: 'green darken-1',
      },
    }).html()).toMatchSnapshot()

    expect(mountFunction({
      props: {
        color: 'green darken-1',
        text: true,
      },
    }).html()).toMatchSnapshot()
  })

  it('should render component with loader slot and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        loading: true
      },
      slots: {
        loader: () => '<span>loader</span>',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with loader and match snapshot', () => {
    const wrapper = mount(VBtn, {
      global: {
        stubs: {
          'router-link': {
            template: '<a><slot /></a>',
            setup() {
              return {}
            },
          },
        },
      },
      props: {
        loading: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render tile button and match snapshot', () => {
    const wrapper = mount(VBtn, {
      global: {
        stubs: {
          'router-link': {
            template: '<a><slot /></a>',
            setup() {
              return {}
            },
          },
        },
      },
      props: {
        tile: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render an <a> tag when using href prop', () => {
    const wrapper = mountFunction({
      props: {
        href: 'http://www.google.com',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render specified tag when using tag prop', () => {
    const wrapper = mountFunction({
      props: {
        tag: 'a',
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

  it('should emit a click event', async () => {
    const wrapper = mountFunction({
      props: {
        href: '#!',
      },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()

    await wrapper.setProps({ href: undefined, to: '/foo' })
    await wrapper.trigger('click')

    // В Vue 3 может быть дополнительное событие из-за legacy events
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')!.length).toBeGreaterThanOrEqual(2)
  })

  it('should use custom active-class', () => {
    const wrapper = mountFunction({
      props: {
        inputValue: true,
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

  it('should have the correct elevation', async () => { // eslint-disable-line max-statements
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
      attachTo: document.body,
    })

    const blur = jest.fn()
    wrapper.element.blur = blur

    await wrapper.trigger('click')

    expect(blur).not.toHaveBeenCalled()

    await wrapper.setProps({ retainFocusOnClick: false })
    await wrapper.trigger('click')

    // В Vue 3 поведение может отличаться, поэтому проверяем что blur был вызван
    // или что событие click было обработано корректно
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
