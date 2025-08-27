import VVirtualTable from '../VVirtualTable'
import {
  mount,
  VueWrapper,
  MountingOptions,
} from '@vue/test-utils'
import { h } from 'vue'

describe('VVirtualTable.ts', () => {
  type Instance = InstanceType<typeof VVirtualTable>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>
  beforeEach(() => {
    mountFunction = (options?: MountingOptions<Instance>) => {
      return mount(VVirtualTable, options)
    }
  })

  it('should render', () => {
    const wrapper = mountFunction({
      props: {
        items: ['a', 'b', 'c'],
      },
      slots: {
        items: (props: any) => h('div', { class: 'test' }, [JSON.stringify(props)]),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should re-render when items change', async () => {
    const wrapper = mountFunction({
      props: {
        items: ['a', 'b', 'c'],
      },
      slots: {
        items (props: any) {
          return h('div', props.items.map((i: any) => h('div', [i])))
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({
      items: ['d', 'e', 'f'],
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
