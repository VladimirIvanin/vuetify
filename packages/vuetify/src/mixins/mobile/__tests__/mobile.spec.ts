// Mixins
import Mobile from '../'

// Utilities
import { mount, Wrapper } from '@vue/test-utils'
import { preset } from '../../../presets/default'
import { resizeWindow } from '../../../../test'
import { defineComponent, h } from 'vue'

// Types
import { Breakpoint } from '../../../services/breakpoint'

describe('mobile.ts', () => {
  type Instance = InstanceType<typeof Mobile>
  let mountFunction: (options?: object) => Wrapper<Instance>

  beforeEach(() => {
    const Mock = defineComponent({
      mixins: [Mobile],
      render: () => h('div'),
    })

    mountFunction = (options = {}) => {
      return mount(Mock, {
        ...options,
        global: {
          mocks: {
            $vuetify: { breakpoint: new Breakpoint(preset) },
          },
        },
      })
    }
  })

  it.each([
    [1263, undefined, true],
    [1263, 1264, true],
    [1263, 'xl', false],
    [1920, 'md', false],
    [1263, 1400, true],
  ])('should conditionally be mobile using a breakpoint of %s', async (...item) => {
    const [
      resizeTo,
      mobileBreakpoint,
      isMobile,
    ] = item

    await resizeWindow(resizeTo as number)

    const wrapper = mountFunction({
      props: { mobileBreakpoint },
    })

    expect(wrapper.vm.isMobile).toBe(isMobile)
  })
})
