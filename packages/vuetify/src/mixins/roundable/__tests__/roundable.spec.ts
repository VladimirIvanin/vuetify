import { defineComponent, h } from 'vue'
import Roundable from '../'
import {
  mount,
  MountOptions,
  Wrapper,
} from '@vue/test-utils'

describe('roundable.ts', () => {
  const Mock = defineComponent({
    mixins: [Roundable],
    render () {
      return h('div', {
        class: this.roundedClasses,
      })
    },
  })

  type Instance = InstanceType<typeof Mock>
  let mountFunction: (options?: MountOptions<Instance>) => Wrapper<Instance>
  beforeEach(() => {
    mountFunction = (options?: MountOptions<Instance>) => {
      return mount(Mock, options)
    }
  })

  it.each([
    [undefined, {}],
    [{ tile: true }, { 'rounded-0': true }],
    [{ rounded: true, tile: true }, { 'rounded-0': true }],
    [{ rounded: '0' }, { 'rounded-0': true }],
    [{ rounded: true }, { rounded: true }],
    [{ rounded: false }, {}],
    [{ rounded: 'tr-xl br-lg' }, { 'rounded-tr-xl rounded-br-lg': true }],
  ])('should return correct rounded classes', (propsData, expected: any) => {
    const wrapper = mountFunction({ props: propsData })

    expect(wrapper.vm.roundedClasses).toEqual(expected)
  })
})
