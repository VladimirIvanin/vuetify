import VDataFooter from '../VDataFooter'
import { Lang } from '../../../services/lang'
import {
  mount,
  VueWrapper,
} from '@vue/test-utils'
import { preset } from '../../../presets/default'

describe('VDataFooter.ts', () => {
  type Instance = InstanceType<typeof VDataFooter>
  let mountFunction: (options?: any) => VueWrapper<Instance>

  beforeEach(() => {
    document.body.setAttribute('data-app', '')

    mountFunction = (options?: any) => {
      return mount(VDataFooter, {
        global: {
          mocks: {
            $vuetify: {
              lang: new Lang(preset),
              theme: {
                dark: false,
              },
              icons: {
                values: {
                  prev: 'mdi-chevron-left',
                  next: 'mdi-chevron-right',
                  dropdown: 'mdi-menu-down',
                  first: 'mdi-page-first',
                  last: 'mdi-page-last',
                },
              },
            },
          },
        },
        ...options,
      })
    }
  })

  it('should render with custom itemsPerPage', () => {
    const wrapper = mountFunction({
      props: {
        itemsPerPageOptions: [50, 100],
        options: {
          page: 4,
          itemsPerPage: 100,
          sortBy: [],
          sortDesc: [],
          groupBy: [],
          groupDesc: [],
          multiSort: false,
          mustSort: false,
        },
        pagination: {
          page: 4,
          itemsPerPage: 10,
          pageStart: 1,
          pageStop: 10,
          pageCount: 10,
          itemsLength: 100,
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render in RTL mode', () => {
    const wrapper = mountFunction({
      props: {
        options: {
          page: 4,
          itemsPerPage: 10,
          sortBy: [],
          sortDesc: [],
          groupBy: [],
          groupDesc: [],
          multiSort: false,
          mustSort: false,
        },
        pagination: {
          page: 4,
          itemsPerPage: 10,
          pageStart: 1,
          pageStop: 10,
          pageCount: 10,
          itemsLength: 100,
        },
        showFirstLastPage: true,
      },
      global: {
        mocks: {
          $vuetify: {
            rtl: true,
            lang: new Lang(preset),
            theme: {
              dark: false,
            },
            icons: {
              values: {
                prev: 'mdi-chevron-left',
                next: 'mdi-chevron-right',
                dropdown: 'mdi-menu-down',
                first: 'mdi-page-first',
                last: 'mdi-page-last',
              },
            },
          },
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render first & last icons with showFirstLastPage', () => {
    const wrapper = mountFunction({
      props: {
        options: {
          page: 4,
          itemsPerPage: 10,
          sortBy: [],
          sortDesc: [],
          groupBy: [],
          groupDesc: [],
          multiSort: false,
          mustSort: false,
        },
        pagination: {
          page: 4,
          itemsPerPage: 10,
          pageStart: 1,
          pageStop: 10,
          pageCount: 10,
          itemsLength: 100,
        },
        showFirstLastPage: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should switch between pages', async () => {
    const wrapper = mountFunction({
      props: {
        options: {
          page: 4,
          itemsPerPage: 10,
          sortBy: [],
          sortDesc: [],
          groupBy: [],
          groupDesc: [],
          multiSort: false,
          mustSort: false,
        },
        pagination: {
          page: 4,
          itemsPerPage: 10,
          pageStart: 1,
          pageStop: 10,
          pageCount: 10,
          itemsLength: 100,
        },
      },
    })

    await wrapper.vm.onNextPage()
    expect(wrapper.emitted('update:options')).toBeTruthy()
    expect(wrapper.emitted('update:options')![0]).toEqual([{
      itemsPerPage: 10,
      page: 5,
      sortBy: [],
      sortDesc: [],
      groupBy: [],
      groupDesc: [],
      multiSort: false,
      mustSort: false,
    }])

    await wrapper.vm.onPreviousPage()
    expect(wrapper.emitted('update:options')![1]).toEqual([{
      itemsPerPage: 10,
      page: 3,
      sortBy: [],
      sortDesc: [],
      groupBy: [],
      groupDesc: [],
      multiSort: false,
      mustSort: false,
    }])

    await wrapper.vm.onFirstPage()
    expect(wrapper.emitted('update:options')![2]).toEqual([{
      itemsPerPage: 10,
      page: 1,
      sortBy: [],
      sortDesc: [],
      groupBy: [],
      groupDesc: [],
      multiSort: false,
      mustSort: false,
    }])

    await wrapper.vm.onLastPage()
    expect(wrapper.emitted('update:options')![3]).toEqual([{
      itemsPerPage: 10,
      page: 10,
      sortBy: [],
      sortDesc: [],
      groupBy: [],
      groupDesc: [],
      multiSort: false,
      mustSort: false,
    }])

    await wrapper.vm.onChangeItemsPerPage(5)
    expect(wrapper.emitted('update:options')![4]).toEqual([{
      itemsPerPage: 5,
      page: 1,
      sortBy: [],
      sortDesc: [],
      groupBy: [],
      groupDesc: [],
      multiSort: false,
      mustSort: false,
    }])

    await wrapper.vm.onChangeItemsPerPage(20)
    expect(wrapper.emitted('update:options')![5]).toEqual([{
      itemsPerPage: 20,
      page: 1,
      sortBy: [],
      sortDesc: [],
      groupBy: [],
      groupDesc: [],
      multiSort: false,
      mustSort: false,
    }])
  })

  it('should show current page if has showCurrentPage', () => {
    const wrapper = mountFunction({
      props: {
        options: {
          page: 4,
          itemsPerPage: 10,
          sortBy: [],
          sortDesc: [],
          groupBy: [],
          groupDesc: [],
          multiSort: false,
          mustSort: false,
        },
        pagination: {
          page: 4,
          itemsPerPage: 10,
          pageStart: 1,
          pageStop: 10,
          pageCount: 10,
          itemsLength: 100,
        },
        showCurrentPage: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should disable last page button if no items', () => {
    const wrapper = mountFunction({
      props: {
        options: {
          page: 1,
          itemsPerPage: 10,
          sortBy: [],
          sortDesc: [],
          groupBy: [],
          groupDesc: [],
          multiSort: false,
          mustSort: false,
        },
        pagination: {
          page: 1,
          itemsPerPage: 10,
          pageStart: 0,
          pageStop: 0,
          pageCount: 0,
          itemsLength: 0,
        },
        showFirstLastPage: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
