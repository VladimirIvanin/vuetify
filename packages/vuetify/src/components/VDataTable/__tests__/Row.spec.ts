import Row from '../Row'
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import { h } from 'vue'

describe('Table Row', () => {
  let mountFunction: (options?: any) => VueWrapper<any>

  beforeEach(() => {
    mountFunction = (options?: any) => {
      return mount(Row, options)
    }
  })

  enableAutoUnmount(afterEach)

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
          { text: 'String', value: 'string' },
          { text: 'Number', value: 'number' },
          { text: 'Array', value: 'array' },
          { text: 'Boolean', value: 'boolean' },
          { text: 'Object', value: 'object' },
          { text: 'Undefined', value: 'undefined' },
          { text: 'Null', value: 'null' },
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

  it('should render with cellClass', () => {
    const wrapper = mountFunction({
      props: {
        headers: [
          { text: 'Petrol', value: 'petrol', cellClass: 'a' },
          { text: 'Diesel', value: 'diesel', cellClass: ['b', 'c'] },
        ],
        item: {
          petrol: 0.68,
          diesel: 0.65,
        },
      },
    })

    const tds = wrapper.findAll('td')
    expect(tds[0].classes()).toContain('a')
    expect(tds[1].classes()).toContain('b')
    expect(tds[1].classes()).toContain('c')
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
        petrol: ({ header, value }: any) => h('p', { class: `test ${header.value}` }, [value]),
        diesel: ({ header, value }: any) => h('p', { class: `test ${header.value}` }, [value]),
      },
    })

    expect(wrapper.findAll('tr')).toHaveLength(1)
    expect(wrapper.findAll('td')).toHaveLength(2)
    expect(wrapper.findAll('p.test')).toHaveLength(2)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
