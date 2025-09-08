// Libraries
import { nextTick } from 'vue'

// Plugins
import { createRouter, createWebHistory } from 'vue-router'

// Components
import VChip from '../VChip'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'

describe('VChip.ts', () => {
  let mountFunction: (options?: object) => VueWrapper<any>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VChip, {
        global: {
          config: {
            warnHandler: () => {}, // Подавляем предупреждения Vue
          },
          mocks: {
            $vuetify: {
              lang: {
                t: (val: string) => val,
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

  enableAutoUnmount(afterEach)

  it('should have a v-chip class', () => {
    const wrapper = mountFunction()

    expect(wrapper.classes()).toContain('v-chip')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should be removable', async () => {
    const wrapper = mountFunction({
      props: { close: true },
    })

    const close = wrapper.find('.v-chip__close')

    expect(wrapper.html()).toMatchSnapshot()

    await close.trigger('click')
    expect(wrapper.emitted('click:close')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('should render a colored chip', () => {
    const wrapper = mountFunction({
      props: {
        color: 'blue',
        textColor: 'green',
      },
    })

    expect(wrapper.element.classList).toContain('blue')
    expect(wrapper.element.classList).toContain('green--text')
  })

  it('should render a disabled chip', async () => {
    const wrapper = mountFunction({
      props: {
        disabled: true,
      },
    })

    expect(wrapper.element.classList).toContain('v-chip--disabled')

    wrapper.setProps({
      close: true,
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.v-chip__close')).toHaveLength(1)
  })

  it('should render a colored outline chip', () => {
    const wrapper = mountFunction({
      props: {
        outlined: true,
        color: 'blue',
      },
    })

    expect(wrapper.element.classList).toContain('blue')
    expect(wrapper.element.classList).toContain('blue--text')
  })

  it('should render a colored outline chip with text color', () => {
    const wrapper = mountFunction({
      props: {
        outlined: true,
        color: 'blue',
        textColor: 'green',
      },
    })

    expect(wrapper.element.classList).toContain('blue')
    expect(wrapper.element.classList).toContain('green--text')
  })

  it('should render a chip with filter', () => {
    const wrapper = mountFunction({
      props: {
        filter: true,
        modelValue: true, // ToggleableFactory использует modelValue для isActive
      },
    })

    expect(wrapper.findAll('.v-chip__filter')).toHaveLength(1)
  })

  it('should call toggle event when used in the group', async () => {
    const register = jest.fn()
    const unregister = jest.fn()
    const wrapper = mountFunction({
      global: {
        provide: {
          chipGroup: { register, unregister },
        },
      },
    })

    // Проверяем, что toggle вызывается при клике
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('should conditionally show based on active prop', async () => {
    const wrapper = mountFunction({
      props: { close: true },
    })
    const close = wrapper.find('.v-chip__close')

    // Initially visible
    expect(wrapper.element.style.display).not.toBe('none')

    await close.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])

    // Simulate active.sync behavior
    await wrapper.setProps({ active: false })
    await nextTick()

    // Element should be hidden via v-show directive
    expect(wrapper.element.style.display).toBe('none')
  })
})
