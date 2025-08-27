import VApp from '../../../components/VApp'
import Detachable from '../'
import { mount, MountingOptions, VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

const Mock = defineComponent({
  name: 'mock',
  mixins: [Detachable],
  render () {
    const content = h('div', {
      class: 'content',
      ref: 'content',
    })

    return h('div', {
      class: 'mock',
    }, [this.$slots.default?.(), content])
  },
})

describe('detachable.ts', () => {
  it('should detach to app', async () => {
    const localMock = Mock
    const wrapper = mount(VApp, {
      attachTo: document.body,
      slots: {
        default: [{
          render: () => h(localMock),
        }],
      },
      global: {
        mocks: {
          $vuetify: {
            rtl: false,
            theme: {
              dark: false,
            },
          },
        },
      },
    })

    const detach = wrapper.findComponent(localMock)

    expect(detach.vm.hasDetached).toBe(false)

    wrapper.unmount()
  })

  it('should attach and detach', async () => {
    const localMock = Mock
    const elementMock = mount(Mock)
    const wrapper = mount(localMock, {
      attachTo: document.body,
      props: {
        attach: '',
      },
      slots: {
        default: [{
          render: () => h('div', { class: 'foo' }),
        }],
      },
    })

    expect(wrapper.vm.initDetach()).toBeUndefined()

    await wrapper.setProps({ attach: true })

    expect(wrapper.vm.initDetach()).toBeUndefined()

    await wrapper.setProps({ attach: 'attach' })

    expect(wrapper.vm.initDetach()).toBeUndefined()

    await wrapper.setProps({ attach: elementMock.vm.$el })

    wrapper.vm.initDetach()

    expect(wrapper.vm.hasDetached).toBe(true)

    // В Vue 3 используем прямое изменение данных вместо setData
    wrapper.vm.hasDetached = false

    await wrapper.setProps({ attach: '.foo' })

    wrapper.vm.initDetach()

    expect(wrapper.vm.hasDetached).toBe(true)

    wrapper.vm.hasDetached = false

    await wrapper.setProps({ attach: '.bar' })

    wrapper.vm.initDetach()

    expect('[Vuetify] Unable to locate target .bar').toHaveBeenTipped()

    wrapper.unmount()
  })

  it('should validate attach prop', () => {
    const validator = Detachable.props.attach.validator

    expect(validator(true)).toBe(true)
    expect(validator(false)).toBe(true)
    expect(validator('foo')).toBe(true)
    expect(validator({ nodeType: Node.ELEMENT_NODE })).toBe(true)
    expect(validator({})).toBe(false)
  })
})
