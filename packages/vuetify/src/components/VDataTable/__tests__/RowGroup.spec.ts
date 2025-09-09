import RowGroup from '../RowGroup'
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'

describe('Table RowGroup', () => {
  let mountFunction: (options?: any) => VueWrapper<any>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options?: any) => {
      return mount(RowGroup, options)
    }
  })

  it('should render with "column.summary" slot', () => {
    const wrapper = mountFunction({
      slots: {
        'column.summary': '<div></div>',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render with "row.summary" slot', () => {
    const wrapper = mountFunction({
      slots: {
        'row.summary': '<div></div>',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
