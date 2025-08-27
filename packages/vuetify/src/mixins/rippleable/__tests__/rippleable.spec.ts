import Rippleable from '../'
import { mount, MountingOptions, VueWrapper } from '@vue/test-utils'
import { defineComponent } from 'vue'

describe('rippleable.ts', () => {
  const Mock = defineComponent({
    extends: Rippleable,
    render () {
      return this.genRipple()
    },
  })

  type Instance = InstanceType<typeof Mock>;
  let mountFunction: (
    options?: MountingOptions<Instance>
  ) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options?: MountingOptions<Instance>) => {
      return mount(Mock, options)
    }
  })

  it('should match snapshot', () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })
})
