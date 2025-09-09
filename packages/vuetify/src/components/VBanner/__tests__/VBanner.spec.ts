// Components
import VBanner from '../VBanner'

// Services
import { Breakpoint } from '../../../services/breakpoint'
import { preset } from '../../../presets/default'

// Utilities
import {
  mount,
  Wrapper,
} from '@vue/test-utils'
import { h } from 'vue'

// Types
import { ExtractVue } from '../../../util/mixins'

describe('VBanner.ts', () => {
  type Instance = ExtractVue<typeof VBanner>
  let mountFunction: (options?: object) => Wrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VBanner, {
        ...options,
        global: {
          mocks: {
            $vuetify: {
              application: {
                top: 0,
                bar: 0,
              },
              breakpoint: {
                mobile: true,
                mobileBreakpoint: 1264,
                width: 1000,
              },
              icons: {
                component: null,
              },
            },
          },
        },
      })
    }
  })

  it('should render component with content', () => {
    const wrapper = mountFunction({
      slots: {
        default: 'Hello, World!',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render sinle-line component with content', () => {
    const wrapper = mountFunction({
      props: {
        singleLine: true,
      },
      slots: {
        default: 'Hello, World!',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with icon', () => {
    const wrapper = mountFunction({
      slots: {
        default: 'Hello, World!',
      },
      props: {
        icon: 'mdi-plus',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with icon slot', () => {
    const wrapper = mountFunction({
      slots: {
        default: 'Hello, World!',
        icon: () => h('span', ['icon']),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with actions', () => {
    const wrapper = mountFunction({
      slots: {
        default: 'Hello, World!',
        actions: () => h('div', [h('button', ['OK']), h('button', ['Cancel'])]),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should emit click:icon event', () => {
    const wrapper = mountFunction({
      slots: {
        default: 'Hello, World!',
      },
      props: {
        icon: 'mdi-plus',
      },
    })

    const icon = wrapper.find('.v-banner__icon')

    expect(wrapper.emitted('click:icon')).toBeFalsy()
    icon.trigger('click')
    expect(wrapper.emitted('click:icon')).toBeTruthy()
  })

  it(`should not render icon container if icon property and slot aren't passed`, () => {
    const wrapper = mountFunction({
      slots: {
        default: 'Hello, World!',
      },
    })

    expect(wrapper.findAll('.v-banner__icon')).toHaveLength(0)
  })

  it(`should not render actions container if slot isn't passed`, () => {
    const wrapper = mountFunction({
      slots: {
        default: 'Hello, World!',
      },
    })

    expect(wrapper.findAll('.v-banner__actions')).toHaveLength(0)
  })

  it('should render icon, content and actions containers', () => {
    const wrapper = mountFunction({
      slots: {
        default: 'Hello, World!',
        icon: 'Hello, World!',
        actions: 'Hello, World!',
      },
    })

    expect(wrapper.findAll('.v-banner__content')).toHaveLength(1)
    expect(wrapper.findAll('.v-banner__icon')).toHaveLength(1)
    expect(wrapper.findAll('.v-banner__actions')).toHaveLength(1)
  })

  it('should toggle', () => {
    const wrapper = mountFunction({
      slots: {
        default: 'Hello, World!',
      },
    })

    expect(wrapper.vm.isActive).toBeTruthy()
    wrapper.vm.toggle()
    expect(wrapper.vm.isActive).toBeFalsy()
  })

  it('should be dismissable', () => {
    const wrapper = mountFunction({
      slots: {
        default: 'Hello, World!',
        actions: ({ dismiss }) => h('div', {
          onClick: dismiss,
          class: 'test',
        }),
      },
    })

    const test = wrapper.find('.test')
    expect(wrapper.vm.isActive).toBeTruthy()
    test.trigger('click')
    expect(wrapper.vm.isActive).toBeFalsy()
  })

  it('should be responsive', () => {
    const wrapper = mount(VBanner, {
      slots: {
        default: 'Hello, World!',
      },
      global: {
        mocks: {
          $vuetify: {
            breakpoint: new Breakpoint(preset),
          },
        },
      },
    })

    expect(wrapper.classes('v-banner--is-mobile')).toBeTruthy()
  })

  it('should apply sticky when using the app prop', async () => {
    const wrapper = mountFunction({
      props: { app: true },
    })

    expect(wrapper.vm.isSticky).toBe(true)

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({
      app: false,
      sticky: true,
    })

    expect(wrapper.vm.isSticky).toBe(true)

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ app: false, sticky: false })

    expect(wrapper.vm.isSticky).toBe(false)

    expect(wrapper.html()).toMatchSnapshot()
  })
})
