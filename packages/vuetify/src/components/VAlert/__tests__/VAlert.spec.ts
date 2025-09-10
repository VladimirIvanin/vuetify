// Components
import VAlert from '../VAlert'

// Utilities
import {
  mount,
  enableAutoUnmount,
  VueWrapper,
  config,
} from '@vue/test-utils'

// Types
import { ExtractVue } from '../../../util/mixins'

describe('VAlert.ts', () => {
  type Instance = ExtractVue<typeof VAlert>
  let mountFunction: (options?: object) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      console.log("options", options);
      return mount(VAlert, {
        ...options,
        global: {
          mocks: {
            ...config.global.mocks
          },
          ...options.global,
        },
      })
    }
  })

  it('should be open by default', async () => {
    const wrapper = mountFunction()

    expect(wrapper.element.style.display).toBe('')
    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ modelValue: false })

    // Check that isActive is false
    expect(wrapper.vm.isActive).toBe(false)
    // Check that element is hidden
    expect(wrapper.element.style.display).toBe('none')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should have a close icon', () => {
    const wrapper = mountFunction({
      props: { dismissible: true },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should be dismissible', async () => {
    const wrapper = mountFunction({
      props: {
        dismissible: true,
      },
    })

    const icon = wrapper.find('.v-alert__dismissible')

    await icon.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should have a custom icon', () => {
    const wrapper = mountFunction({
      props: {
        icon: 'mdi-list',
      },
    })

    const icon = wrapper.find('.v-alert__icon')

    expect(icon.exists()).toBe(true)
    // С component: null иконки рендерятся как font-иконки с содержимым
    expect(icon.classes()).toContain('v-icon')
    expect(icon.classes()).toContain('v-alert__icon')
  })

  it('should have no icon', () => {
    const wrapper = mountFunction()

    expect(wrapper.find('.v-icon').exists()).toBe(false)
  })

  it('should display contextual colors by type', async () => {
    const wrapper = mountFunction({
      props: { type: 'error' },
    })

    expect(wrapper.classes('error')).toBe(true)

    await wrapper.setProps({ type: 'success' })
    expect(wrapper.classes('success')).toBe(true)

    await wrapper.setProps({ type: 'warning' })
    expect(wrapper.classes('warning')).toBe(true)

    await wrapper.setProps({ type: 'info' })
    expect(wrapper.classes('info')).toBe(true)
  })

  it('should allow overriding color for contextual alert', () => {
    const wrapper = mountFunction({
      props: {
        type: 'error',
        color: 'primary',
      },
    })

    expect(wrapper.classes('primary')).toBe(true)
  })

  it('should allow overriding icon for contextual alert', () => {
    const wrapper = mountFunction({
      props: {
        type: 'error',
        icon: 'mdi-block',
      },
    })

    const icon = wrapper.find('.v-alert__icon')

    expect(icon.exists()).toBe(true)
    // С component: null иконки рендерятся как font-иконки с содержимым
    expect(icon.classes()).toContain('v-icon')
    expect(icon.classes()).toContain('v-alert__icon')
  })

  it('should render custom dismissible icon', () => {
    const wrapper = mountFunction({
      props: {
        dismissible: true,
        closeIcon: 'mdi-close',
      },
    })

    const icon = wrapper.find('.v-alert__content + .v-btn .v-icon')

    expect(icon.exists()).toBe(true)
    // С component: null иконки рендерятся как font-иконки с содержимым
    expect(icon.classes()).toContain('v-icon')
  })

  it('should show border', async () => {
    const directions = ['top', 'right', 'bottom', 'left']
    const wrapper = mountFunction()

    expect(wrapper.classes('v-alert--border')).toBe(false)

    for (const border of directions) {
      await wrapper.setProps({ border })

      expect(wrapper.classes('v-alert--border')).toBe(true)
      expect(wrapper.classes(`v-alert--border-${border}`)).toBe(true)
    }
  })

  it('should move color classes to border and icon elements', async () => {
    const wrapper = mountFunction({
      props: {
        color: 'pink',
        border: 'left',
      },
    })
    const border = wrapper.find('.v-alert__border')

    expect(wrapper.classes('pink')).toBe(true)
    expect(border.classes('pink')).toBe(false)

    await wrapper.setProps({ coloredBorder: true })
    expect(wrapper.classes('pink')).toBe(false)
    expect(border.classes('pink')).toBe(true)
    expect(border.classes('v-alert__border--has-color')).toBe(true)
  })

  it('should toggle isActive state', () => {
    const wrapper = mountFunction()

    expect(wrapper.vm.isActive).toBe(true)

    wrapper.vm.toggle()

    expect(wrapper.vm.isActive).toBe(false)
  })

  it('should render font icons with proper classes', () => {
    const wrapper = mountFunction({
      props: { 
        type: 'error',
        icon: 'mdi-alert' 
      },
    })

    const icon = wrapper.find('.v-alert__icon')
    
    expect(icon.exists()).toBe(true)
    // С component: null иконки рендерятся как font-иконки с CSS классами
    // В JSDOM текстовое содержимое не отображается, но классы присутствуют
    expect(icon.classes()).toContain('v-icon')
    expect(icon.classes()).toContain('v-alert__icon') 
    expect(icon.classes()).toContain('mdi')
    expect(icon.classes()).toContain('mdi-alert')
  })

  it('should translate aria-label correctly', () => {
    const wrapper = mountFunction({
      props: { dismissible: true },
    })

    const button = wrapper.find('.v-alert__dismissible')
    
    expect(button.exists()).toBe(true)
    // Проверяем что перевод $vuetify.close работает правильно 
    expect(button.element.getAttribute('aria-label')).toBe('Close')
  })
})
