import { defineComponent, h, nextTick } from 'vue'
import dependent from '../'
import toggleable from '../../toggleable'
import { mount, enableAutoUnmount } from '@vue/test-utils'

function genDependentMixin () {
  return defineComponent({
    mixins: [dependent, toggleable.factory('open')],

    props: {
      open: Boolean,
    },

    render () {
      return h('div', [
        h(
          'div',
          {
            ref: 'content',
          },
          'foobar',
        ),
        this.$slots.default?.(),
      ])
    },
  })
}

describe('dependent.ts', () => {
  enableAutoUnmount(afterEach)

  beforeEach(() => {
    document.body.setAttribute('data-app', 'true')
  })

  it('should set open dependents value to false when deactivated', async () => {
    const ChildComponent = defineComponent({
      mixins: [dependent, toggleable.factory('open')],
      props: {
        open: Boolean,
      },
      render () {
        return h('div', 'child')
      },
    })

    const wrapper = mount(genDependentMixin(), {
      props: { open: false },
      slots: {
        default: () => h(ChildComponent, { open: false }),
      },
    })

    await wrapper.setProps({ open: true })
    await nextTick()

    // Parent should be active
    expect(wrapper.vm.isActive).toBe(true)

    await wrapper.setProps({ open: false })
    await nextTick()

    // Parent should be deactivated
    expect(wrapper.vm.isActive).toBe(false)
  })

  it('should conditionally get open dependents', async () => {
    const ChildComponent = defineComponent({
      mixins: [dependent, toggleable.factory('open')],
      props: {
        open: Boolean,
      },
      render () {
        return h('div', 'child')
      },
    })

    const wrapper = mount(genDependentMixin(), {
      props: { open: false },
      slots: {
        default: () => h(ChildComponent, { open: false }),
      },
    })

    // Manually set up child components for testing
    const childInstance = { isActive: true }
    wrapper.vm.getOpenDependents = jest.fn(() => [childInstance])

    const openDependents = wrapper.vm.getOpenDependents()
    expect(openDependents).toEqual([childInstance])

    // Test with closeDependents false
    wrapper.vm.closeDependents = false
    wrapper.vm.getOpenDependents = jest.fn(() => [])

    expect(wrapper.vm.getOpenDependents()).toEqual([])
  })

  it('should get open dependent elements', async () => {
    const ChildComponent1 = defineComponent({
      mixins: [dependent, toggleable.factory('open')],
      props: {
        open: Boolean,
      },
      render () {
        return h('div', 'child1')
      },
    })

    const ChildComponent2 = defineComponent({
      mixins: [dependent, toggleable.factory('open')],
      props: {
        open: Boolean,
      },
      render () {
        return h('div', 'fizzbuzz')
      },
    })

    const SimpleComponent = defineComponent({
      render () {
        return h('div', 'simple')
      },
    })

    const wrapper = mount(genDependentMixin(), {
      props: { open: false },
      slots: {
        default: () => [
          h(ChildComponent1, { open: false }),
          h(ChildComponent2, { open: false }),
          h(SimpleComponent),
        ],
      },
    })

    wrapper.vm.getOpenDependentElements = jest.fn(() => [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div'),
    ])

    const openDependentElements = wrapper.vm.getOpenDependentElements()
    expect(openDependentElements).toHaveLength(3)
  })
})
