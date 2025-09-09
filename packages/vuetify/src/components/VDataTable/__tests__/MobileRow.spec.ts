import MobileRow from '../MobileRow'
import {
  mount,
  VueWrapper,
  MountingOptions,
} from '@vue/test-utils'
import { h } from 'vue'

describe('MobileRow', () => {
  type Instance = InstanceType<typeof MobileRow>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>
  beforeEach(() => {
    mountFunction = (options?: MountingOptions<Instance>) => {
      return mount(MobileRow, options)
    }
  })

  it('should render without slots', () => {
    const wrapper = mountFunction({
      props: {
        headers: [
          { text: 'Petrol', value: 'petrol' },
          { text: 'Diesel', value: 'diesel' },
        ],
        item: {
          petrol: 0.68,
          diesel: 0.65,
        },
      },
    })

    expect(wrapper.findAll('tr')).toHaveLength(1)
    expect(wrapper.findAll('td')).toHaveLength(2)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render non-string values', () => {
    const wrapper = mountFunction({
      props: {
        headers: [
          { value: 'string' },
          { value: 'number' },
          { value: 'array' },
          { value: 'boolean' },
          { value: 'object' },
          { value: 'undefined' },
          { value: 'null' },
        ],
        item: {
          string: 'string',
          number: 12.34,
          array: [1, 2],
          boolean: false,
          object: { foo: 'bar' },
          null: null,
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render with regular slots', () => {
    const wrapper = mountFunction({
      props: {
        headers: [
          { text: 'Petrol', value: 'petrol' },
          { text: 'Diesel', value: 'diesel' },
        ],
      },
      slots: {
        petrol: '<p class="test">$0.68</p>',
        diesel: '<p class="test">$0.65</p>',
      },
    })

    expect(wrapper.findAll('tr')).toHaveLength(1)
    expect(wrapper.findAll('td')).toHaveLength(2)
    expect(wrapper.findAll('p.test')).toHaveLength(2)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render with scoped slots', () => {
    const wrapper = mountFunction({
      props: {
        headers: [
          { text: 'Petrol', value: 'petrol' },
          { text: 'Diesel', value: 'diesel' },
        ],
        item: {
          petrol: 0.68,
          diesel: 0.65,
        },
      },
      slots: {
        petrol: (props: any) => h('p', { class: `test ${props.header.value}` }, [props.value]),
        diesel: (props: any) => h('p', { class: `test ${props.header.value}` }, [props.value]),
      },
    })

    expect(wrapper.findAll('tr')).toHaveLength(1)
    expect(wrapper.findAll('td')).toHaveLength(2)
    expect(wrapper.findAll('p.test')).toHaveLength(2)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render without header when hideDefaultHeader: true', () => {
    const wrapper = mountFunction({
      props: {
        headers: [
          { text: 'Petrol', value: 'petrol' },
          { text: 'Diesel', value: 'diesel' },
        ],
        hideDefaultHeader: true,
        item: {
          petrol: 0.68,
          diesel: 0.65,
        },
      },
    })

    expect(wrapper.findAll('tr')).toHaveLength(1)
    expect(wrapper.findAll('td')).toHaveLength(2)
    expect(wrapper.findAll('.v-data-table__mobile-row__header')).toHaveLength(0)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
