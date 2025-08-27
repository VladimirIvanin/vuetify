import { inject as RegistrableInject, provide as RegistrableProvide } from '../'
import {
  mount,
  MountingOptions,
  VueWrapper,
} from '@vue/test-utils'
import { defineComponent } from 'vue'

describe('registrable.ts', () => {
  it('should inject registrable', () => {
    const Mock = defineComponent({
      extends: RegistrableInject('test'),
      render: () => null,
    })

    const wrapper = mount(Mock)

    expect(wrapper.vm.test).toBeDefined()
  })

  it('should provide registrable', () => {
    const Mock = defineComponent({
      mixins: [RegistrableProvide('test')],
      render: () => null,
    })

    const wrapper = mount(Mock)

    expect(wrapper.vm.$options.provide).toBeDefined()
  })
})
