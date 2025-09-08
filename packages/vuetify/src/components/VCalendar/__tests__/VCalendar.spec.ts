import { parseDate } from '../util/timestamp'
import VCalendar from '../VCalendar'
import {
  mount,
  VueWrapper,
  MountingOptions,
} from '@vue/test-utils'

describe('VCalendar', () => {
  type Instance = InstanceType<typeof VCalendar>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>
  beforeEach(() => {
    mountFunction = (options?: MountingOptions<Instance>) => {
      return mount(VCalendar, {
        global: {
          mocks: {
            $vuetify: {
              lang: {
                current: 'en-US',
              },
            },
          },
        },
        ...options,
      })
    }
  })

  it('should render day view', async () => {
    const wrapper = mountFunction({
      props: {
        type: 'day',
        start: '2018-01-29',
        end: '2018-02-04',
        now: '2019-02-17',
      },
    })

    expect(wrapper.classes('v-calendar-daily')).toBeTruthy()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render 4-day view', async () => {
    const wrapper = mountFunction({
      props: {
        type: '4day',
        start: '2018-01-29',
        end: '2018-02-04',
        now: '2019-02-17',
      },
    })

    expect(wrapper.classes('v-calendar-daily')).toBeTruthy()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render week view', async () => {
    const wrapper = mountFunction({
      props: {
        type: 'week',
        start: '2018-01-29',
        end: '2018-02-04',
        now: '2019-02-17',
      },
    })

    expect(wrapper.classes('v-calendar-daily')).toBeTruthy()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render month view', async () => {
    const wrapper = mountFunction({
      props: {
        type: 'month',
        start: '2018-01-29',
        end: '2018-02-04',
        now: '2019-02-17',
      },
    })

    expect(wrapper.classes('v-calendar-monthly')).toBeTruthy()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should parse value', async () => {
    const wrapper = mountFunction({
      props: {
        value: '2019-02-02',
        start: '2019-01-29',
        end: '2019-02-04',
      },
    })

    expect(wrapper.vm.parsedValue.date).toBe('2019-02-02')
  })

  it('should parse start', async () => {
    const wrapper = mountFunction({
      props: {
        start: '2019-01-29',
        end: '2019-02-04',
      },
    })

    expect(wrapper.vm.parsedValue.date).toBe('2019-01-29')
  })

  it('should go to correct day when using next/prev public functions', async () => {
    const wrapper = mountFunction({
      props: {
        value: '2019-01-11',
        type: 'day',
        weekdays: [1, 2, 3, 4, 5],
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    wrapper.vm.next()
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toMatchSnapshot()

    wrapper.vm.prev()
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toMatchSnapshot()
  })
})
