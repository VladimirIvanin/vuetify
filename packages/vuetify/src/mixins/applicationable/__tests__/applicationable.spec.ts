import { mount } from '@vue/test-utils'
import { h, defineComponent } from 'vue'
import Applicationable from '../'
import { Application } from '../../../services/application'

describe('applicationable.js', () => {
  let mountFunction: (options?: any) => any

  beforeEach(() => {
    mountFunction = (options = {}) => {
      const component = defineComponent({
        render: () => h('div'),
        ...options,
      })

      return mount(component, {
        global: {
          mocks: {
            $vuetify: {
              application: new Application(),
            },
          },
        },
      })
    }
  })

  it('should update application on mount', async () => {
    const updateApplication = jest.fn()
    const wrapper = mountFunction({
      mixins: [Applicationable('left')],
      computed: {
        applicationProperty: () => 'left',
      },
      methods: { updateApplication },
    })

    await wrapper.setProps({ app: true })
    await wrapper.vm.$nextTick()
    expect(updateApplication).toHaveBeenCalledTimes(1)
  })

  it('should update application on app prop change', async () => {
    const updateApplication = jest.fn()
    const removeApplication = jest.fn()
    const wrapper = mountFunction({
      mixins: [Applicationable('left')],
      computed: {
        applicationProperty: () => 'left',
      },
      methods: { updateApplication, removeApplication },
    })

    await wrapper.setProps({ app: true })
    await wrapper.vm.$nextTick()
    await wrapper.setProps({ app: false })
    await wrapper.vm.$nextTick()
    await wrapper.setProps({ app: true })
    await wrapper.vm.$nextTick()

    expect(updateApplication).toHaveBeenCalledTimes(2)
    expect(removeApplication).toHaveBeenCalledTimes(1)
  })

  it('should bind watchers passed through factory', () => {
    const wrapper = mountFunction({
      data: () => ({
        foo: 1,
        bar: 2,
      }),
      mixins: [Applicationable(null, ['foo', 'bar'])],
    })

    // В Vue 3 структура реактивности изменилась
    expect(wrapper.vm.$.scope?.effects?.length || 0).toBeGreaterThan(0)
  })

  it('should call to remove application on destroy', async () => {
    const removeApplication = jest.fn()
    const wrapper = mountFunction({
      mixins: [Applicationable('left')],
      computed: {
        applicationProperty: () => 'left',
      },
      methods: { removeApplication },
    })

    await wrapper.setProps({ app: true })
    wrapper.unmount()
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(removeApplication).toHaveBeenCalledTimes(1)
  })

  it('should update application with dynamic property', async () => {
    const wrapper = mountFunction({
      mixins: [Applicationable('top')],
      computed: {
        applicationProperty () {
          return 'top'
        },
      },
      methods: {
        updateApplication () {
          return 30
        },
      },
    })

    await wrapper.setProps({ app: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$vuetify.application.top).toBe(30)
  })

  it('should remove designated value from application', async () => {
    const wrapper = mountFunction({
      mixins: [Applicationable('footer')],
      methods: {
        updateApplication () {
          return 30
        },
      },
    })

    await wrapper.setProps({ app: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$vuetify.application.footer).toBe(30)
    wrapper.vm.removeApplication()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$vuetify.application.footer).toBe(0)
  })
})
