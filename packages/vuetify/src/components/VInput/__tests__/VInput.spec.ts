import VInput from '../VInput'
import {
  mount,
  MountingOptions,
  VueWrapper,
} from '@vue/test-utils'
import { h } from 'vue'

describe('VInput.ts', () => {
  type Instance = InstanceType<typeof VInput>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options?: MountingOptions<Instance>) => {
      const defaultOptions = {
        global: {
          mocks: {
            // Мокаем только необходимые свойства Vuetify
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
      }

      // Объединяем опции правильно
      const mergedOptions = {
        ...defaultOptions,
        ...options,
        global: {
          ...defaultOptions.global,
          ...options?.global,
        },
      }

      return mount(VInput, mergedOptions)
    }
  })

  it('should have hint', async () => {
    const wrapper = mountFunction({
      props: {
        hint: 'foo',
      },
    })

    expect(wrapper.vm.hasHint).toBe(false)
    await wrapper.setProps({ persistentHint: true })
    expect(wrapper.vm.hasHint).toBe(true)
    await wrapper.setProps({ persistentHint: false })
    expect(wrapper.vm.hasHint).toBe(false)
  })

  it('should update lazyValue when value is updated', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: 'foo',
      },
    })

    expect(wrapper.vm.lazyValue).toBe('foo')

    await wrapper.setProps({ modelValue: 'bar' })

    expect(wrapper.vm.lazyValue).toBe('bar')
  })

  it('should generate append and prepend slots', () => {
    const el = (slot: string) => h('div', slot)
    const wrapper = mountFunction({
      slots: {
        append: () => [el('append')]
      },
    })
    const wrapper2 = mountFunction({
      slots: {
        prepend: () => [el('prepend')]
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper2.html()).toMatchSnapshot()
  })

  it('should generate an icon and match snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        prependIcon: 'list',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({
      prependIcon: undefined,
      appendIcon: 'list',
    })

    expect(wrapper.html()).toMatchSnapshot()


  })

  it('should not generate input details', () => {
    const wrapper = mountFunction({
      props: {
        hideDetails: true,
      },
    })

    expect(wrapper.vm.genMessages()).toBeNull()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should accept a custom height', async () => {
    const wrapper = mountFunction()

    const inputWrapper = wrapper.find('.v-input__slot')
    expect(inputWrapper.element?.getAttribute('style')).toBe(null)
    expect(wrapper.vm.height).toBeUndefined()

    await wrapper.setProps({ height: 10 })
    expect(inputWrapper.element?.getAttribute('style')).toContain('height: 10px')
    await wrapper.setProps({ height: '20px' })
    expect(inputWrapper.element?.getAttribute('style')).toContain('height: 20px')
  })

  it('should be in an error state', async () => {
    const wrapper = mountFunction({
      props: { error: true },
    })

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ errorMessages: 'required', error: false })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should hide messages if no messages and hide-details is auto', async () => {
    const wrapper = mountFunction({
      props: {
        hideDetails: 'auto',
      },
    })

    expect(wrapper.vm.genMessages()).toBeNull()

    await wrapper.setProps({ error: true })
    expect(wrapper.vm.genMessages()).toBeNull()

    await wrapper.setProps({ errorMessages: 'required' })
    expect(wrapper.vm.genMessages()).not.toBeNull()
  })

  it('should be disabled', async () => {
    const wrapper = mountFunction()

    expect(wrapper.vm.isInteractive).toBe(true)

    await wrapper.setProps({ disabled: true })

    expect(wrapper.vm.isInteractive).toBe(false)

    await wrapper.setProps({
      disabled: false,
      readonly: true,
    })

    expect(wrapper.vm.isInteractive).toBe(false)

    await wrapper.setProps({ readonly: false })

    expect(wrapper.vm.isInteractive).toBe(true)
  })

  it('should render a label', () => {
    const wrapper = mountFunction({
      props: { label: 'foo' },
    })

    expect(wrapper.vm.hasLabel).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()


  })

  it('should apply theme to label, counter, messages and icons', () => {
    const wrapper = mountFunction({
      props: {
        label: 'foo',
        hint: 'bar',
        persistentHint: true,
        light: true,
        prependIcon: 'prepend',
        appendIcon: 'append',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()


  })

  it('should apply attrs to root element', () => {
    const wrapper = mountFunction({
      props: {
        foo: 'bar',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.attributes()).toHaveProperty('foo', 'bar')
  })
})
