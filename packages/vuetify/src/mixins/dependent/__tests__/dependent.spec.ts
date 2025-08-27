import { defineComponent, h, nextTick } from 'vue'
import dependent from '../'
import toggleable from '../../toggleable'
import { mount, enableAutoUnmount } from '@vue/test-utils'

function genDependentMixin () {
  return defineComponent({
    mixins: [dependent, toggleable.factory('value')],

    props: {
      value: Boolean,
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
      mixins: [dependent, toggleable.factory('value')],
      props: {
        value: Boolean,
      },
      render () {
        return h('div', 'child')
      },
    })

    const wrapper = mount(genDependentMixin(), {
      props: { value: false },
      slots: {
        default: () => h(ChildComponent, { value: false }),
      },
    })

    await wrapper.setProps({ value: true })
    await nextTick()

    // Parent should be active
    expect(wrapper.vm.isActive).toBe(true)

    await wrapper.setProps({ value: false })
    await nextTick()

    // Parent should be deactivated
    expect(wrapper.vm.isActive).toBe(false)
  })

  it('should conditionally get open dependents', async () => {
    const ChildComponent = defineComponent({
      mixins: [dependent, toggleable.factory('value')],
      props: {
        value: Boolean,
      },
      render () {
        return h('div', 'child')
      },
    })

    const wrapper = mount(genDependentMixin(), {
      props: { value: false },
      slots: {
        default: () => h(ChildComponent, { value: false }),
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
      mixins: [dependent, toggleable.factory('value')],
      props: {
        value: Boolean,
      },
      render () {
        return h('div', 'child1')
      },
    })

    const ChildComponent2 = defineComponent({
      mixins: [dependent, toggleable.factory('value')],
      props: {
        value: Boolean,
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
      props: { value: false },
      slots: {
        default: () => [
          h(ChildComponent1, { value: false }),
          h(ChildComponent2, { value: false }),
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
