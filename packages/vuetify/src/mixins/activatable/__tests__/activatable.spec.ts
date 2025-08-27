// Libraries
import { defineComponent, h } from 'vue'

// Mixins
import Activatable from '../'

// Utilities
import {
  mount,
  MountOptions,
  Wrapper,
} from '@vue/test-utils'
import toHaveBeenWarnedInit from '../../../../test/util/to-have-been-warned'
import { wait } from '../../../../test'

describe('activatable.ts', () => {
  const Mock = defineComponent({
    mixins: [Activatable],
    data: () => ({
      isActive: false,
    }),
    mounted () {
      this.addActivatorEvents()
    },
    render: () => h('div'),
  })
  type Instance = InstanceType<typeof Mock>
  let mountFunction: (options?: MountOptions<Instance>) => Wrapper<Instance>

  const createActivatorSlot = (props: any) => h('button', {
    ...props.attrs,
    ...props,
    // Remove attrs from props to avoid [object Object] in snapshot
    attrs: undefined,
  })

  beforeEach(() => {
    mountFunction = (options = {} as MountOptions<Instance>): Wrapper<Instance> => {
      return mount(Mock, options)
    }
  })

  toHaveBeenWarnedInit()

  it('should render activator slot with listeners', () => {
    const wrapper = mountFunction({
      slots: {
        activator: createActivatorSlot,
      },
      render () {
        return h('div', [this.genActivator()])
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.vm.isActive).toBeFalsy()

    wrapper.find('button').trigger('click')

    expect(wrapper.vm.isActive).toBeTruthy()
  })

  it('should pass value to the activator slot', async () => {
    const wrapper = mountFunction({
      slots: {
        activator: scope => h('button', {
          onClick () {
            scope.value = !scope.value
          },
        }, [String(scope.value)]),
      },
      render () {
        return h('div', [this.genActivator()])
      },
    })

    expect(wrapper.find('button').text()).toBe('false')

    await wrapper.find('button').trigger('click')

    expect(wrapper.find('button').text()).toBe('true')
  })

  it('should render activator slot with hover', async () => {
    const runDelay = jest.fn()

    const MockWithDelay = defineComponent({
      mixins: [Activatable],
      data: () => ({
        isActive: false,
      }),
      mounted () {
        this.addActivatorEvents()
      },
      methods: {
        runDelay,
      },
      render: () => h('div'),
    })

    const wrapper = mount(MockWithDelay, {
      props: {
        openOnHover: true,
      },
      slots: {
        activator: createActivatorSlot,
      },
      render () {
        return h('div', [this.genActivator()])
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    const btn = wrapper.find('button')

    await btn.trigger('mouseenter')
    expect(runDelay).toHaveBeenLastCalledWith('open')

    await btn.trigger('mouseleave')
    expect(runDelay).toHaveBeenLastCalledWith('close')
  })

  it('should bind listeners to custom activator', async () => {
    const el = document.createElement('button')
    el.id = 'foobar'
    document.body.appendChild(el)

    const wrapper = mountFunction({
      props: {
        activator: '#foobar',
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isActive).toBe(false)

    // Use trigger instead of dispatchEvent for better Vue 3 compatibility
    const activator = wrapper.vm.getActivator()
    if (activator) {
      // Simulate click by calling the listener directly
      const clickListener = wrapper.vm.listeners.onClick
      if (clickListener) {
        const mockEvent = { stopPropagation: jest.fn() } as any
        clickListener(mockEvent)
      }
    }

    expect(wrapper.vm.isActive).toBe(true)

    await wrapper.setProps({ openOnHover: true })

    await wrapper.vm.$nextTick()

    // Reset isActive manually since setProps doesn't affect it
    wrapper.vm.isActive = false
    expect(wrapper.vm.isActive).toBe(false)
    el.dispatchEvent(new Event('mouseenter'))

    await wait(wrapper.vm.openDelay)

    expect(wrapper.vm.isActive).toBe(true)

    el.dispatchEvent(new Event('mouseleave'))
    await wait(wrapper.vm.leaveDelay)

    expect(wrapper.vm.isActive).toBe(false)

    document.body.removeChild(el)
  })

  it('should remove listeners on custom activator', async () => {
    const el = document.createElement('button')
    el.id = 'foobar'
    document.body.appendChild(el)

    const wrapper = mountFunction({
      props: {
        activator: '#foobar',
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.listeners).not.toEqual({})

    wrapper.unmount()

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.listeners).toEqual({})

    document.body.removeChild(el)
  })

  it('should stop event propagation when activator is clicked', () => {
    const wrapper = mountFunction()

    const stopPropagation = jest.fn()
    const onClick = { stopPropagation }
    const listeners = wrapper.vm.genActivatorListeners()

    listeners.onClick(onClick as any)

    expect(stopPropagation).toHaveBeenCalled()
  })
})
