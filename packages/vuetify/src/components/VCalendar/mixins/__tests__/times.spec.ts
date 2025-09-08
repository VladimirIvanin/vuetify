import Times from '../times'
import {
  mount,
  VueWrapper,
  MountingOptions,
} from '@vue/test-utils'
import { CalendarTimestamp } from 'vuetify/types'
import { defineComponent, h } from 'vue'

const Mock = defineComponent({
  ...Times,
  render: () => h('div'),
})

describe('times.ts', () => {
  type Instance = InstanceType<typeof Mock>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>
  beforeEach(() => {
    mountFunction = (options?: MountingOptions<Instance>) => {
      return mount(Mock, options)
    }
  })

  it('should parse timestamp', async () => {
    const wrapper = mountFunction({
      props: {
        now: '2019-02-08',
      },
    })

    expect(wrapper.vm.parsedNow).toBeDefined()
    expect(wrapper.vm.parsedNow).toMatchSnapshot()
  })

  it('should update day', async () => {
    const wrapper = mountFunction()

    expect(typeof wrapper.vm.updateDay).toBe('function')
    const target = {}
    const now = {
      date: '2019-02-08',
      year: '2019',
      month: '2',
      day: '8',
      weekday: '4',
    }
    wrapper.vm.updateDay(now as unknown as CalendarTimestamp, target as unknown as CalendarTimestamp)
    expect(target).toEqual(now)
  })

  it('should not update day if dates are equal', async () => {
    const wrapper = mountFunction()

    expect(typeof wrapper.vm.updateDay).toBe('function')
    const target = { date: '2019-02-08' }
    const now = {
      date: '2019-02-08',
      year: '2019',
      month: '2',
      day: '8',
      weekday: '4',
    }
    wrapper.vm.updateDay(now as unknown as CalendarTimestamp, target as unknown as CalendarTimestamp)
    expect(target).not.toEqual(now)
  })

  it('should not update time if times are equal', async () => {
    const wrapper = mountFunction()

    expect(typeof wrapper.vm.updateTime).toBe('function')
    const target = { time: '08:30' }
    const now = {
      time: '08:30',
      hour: '8',
      minute: '30',
    }
    wrapper.vm.updateTime(now as unknown as CalendarTimestamp, target as unknown as CalendarTimestamp)
    expect(target).not.toEqual(now)
  })
})
