// Components
import VSelectList from '../VSelectList'

// Utilities
import {
  mount,
  Wrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import { h } from 'vue'

describe('VSelectList.ts', () => {
  type Instance = InstanceType<typeof VSelectList>
  let mountFunction: (options?: object) => Wrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VSelectList, {
        ...options,
      })
    }
  })

  it('should generate a divider', () => {
    const wrapper = mountFunction()

    const divider = wrapper.vm.genDivider({
      inset: true,
    })

    expect(divider.props.inset).toBe(true)
  })

  // TODO: wat
  it.skip('should generate a header', () => {
    const wrapper = mountFunction()

    const header = wrapper.vm.genHeader({
      light: true,
      header: 'foobar',
    })

    expect(header.props.light).toBe(true)

    // Check that header exists
    expect(header.children).toHaveLength(1)
    expect(header.children[0].children).toBe('foobar')
  })

  it('should use no-data slot', () => {
    const wrapper = mountFunction({
      slots: {
        'no-data': () => h('div', 'foo'),
      },
    })
    expect(wrapper.vm.$slots['no-data']).toBeDefined()
  })

  it('should display no-data-text when item slot is provided', async () => {
    const wrapper = mountFunction()
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should generate children', () => {
    const wrapper = mountFunction({
      props: {
        items: [
          { header: true },
          { divider: true },
          'foo',
        ],
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should return defined item value', async () => {
    const wrapper = mountFunction({
      props: {
        itemValue: 'foo',
      },
    })

    const getValue = wrapper.vm.getValue
    const getText = wrapper.vm.getText

    expect(getValue({ fizz: 'buzz' })).toEqual(getText({ fizz: 'buzz' }))

    await wrapper.setProps({ itemValue: 'fizz' })

    expect(getValue({ fizz: 'buzz' })).toEqual('buzz')
  })

  it('should hide selected items', async () => {
    const wrapper = mountFunction({
      props: {
        selectedItems: ['foo'],
        hideSelected: true,
        items: ['foo', 'bar', 'fizz'],
      },
    })

    expect(wrapper.findAll('.v-list-item')).toHaveLength(2)

    await wrapper.setProps({ selectedItems: ['foo', 'bar'] })

    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.v-list-item')).toHaveLength(1)
  })

  // https://github.com/vuetifyjs/vuetify/issues/4431
  it('should display falsy items', () => {
    const wrapper = mountFunction({
      props: {
        items: [0, null, false, undefined, ''],
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  // https://github.com/vuetifyjs/vuetify/issues/7692
  it('should select an item when checkbox is clicked', async () => {
    const wrapper = mountFunction({
      props: {
        action: true,
        items: ['Foo', 'Bar', 'Fizz', 'Buzz'],
        multiple: true,
      },
    })

    const checkbox = wrapper.find('.v-simple-checkbox')

    await checkbox.trigger('click')

    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0]).toEqual(['Foo'])
  })
})
