import VTimePickerTitle from '../VTimePickerTitle'
import { SelectingTimes } from '../VTimePicker'
import { Lang } from '../../../services/lang'
import { preset } from '../../../presets/default'
import {
  mount,
  VueWrapper,
  MountOptions,
} from '@vue/test-utils'

describe('VTimePickerTitle.ts', () => {
  type Instance = InstanceType<typeof VTimePickerTitle>
  let mountFunction: (options?: MountOptions<Instance>) => VueWrapper<Instance>
  beforeEach(() => {
    mountFunction = (options?: MountOptions<Instance>) => {
      return mount(VTimePickerTitle, {
        global: {
          mocks: {
            $vuetify: {
              lang: {
                t: (key: string) => {
                  if (key === '$vuetify.timePicker.am') return 'AM'
                  if (key === '$vuetify.timePicker.pm') return 'PM'
                  return key
                }
              }
            }
          }
        },
        ...options
      })
    }
  });

  [true, false].forEach(useSecondsValue => {
    const useSecondsDesc = (useSecondsValue ? '. with useSeconds' : '')
    it('should render component in 24hr' + useSecondsDesc, () => {
      const wrapper = mountFunction({
        props: {
          hour: 14,
          minute: 13,
          second: 25,
          period: 'pm',
          ampm: false,
          useSeconds: useSecondsValue,
        },
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should render disabled component' + useSecondsDesc, () => {
      const wrapper = mountFunction({
        props: {
          disabled: true,
          hour: 14,
          minute: 13,
          period: 'pm',
          ampm: true,
          useSeconds: useSecondsValue,
        },
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should render component in 12hr' + useSecondsDesc, () => {
      const wrapper = mountFunction({
        props: {
          hour: 14,
          minute: 13,
          second: 25,
          period: 'pm',
          ampm: true,
          useSeconds: useSecondsValue,
        },
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should render component when selecting hour' + useSecondsDesc, () => {
      const wrapper = mountFunction({
        props: {
          hour: 14,
          minute: 13,
          second: 25,
          period: 'pm',
          selecting: SelectingTimes.Hour,
          useSeconds: useSecondsValue,
        },
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should emit event when clicked on am/pm' + useSecondsDesc, async () => {
      const wrapper = mountFunction({
        props: {
          hour: 14,
          minute: 13,
          second: 25,
          period: 'pm',
          ampm: true,
          useSeconds: useSecondsValue,
        },
      })

      wrapper.find('.v-time-picker-title__ampm .v-picker__title__btn--active').trigger('click')
      expect(wrapper.emitted('update:period')).toBeFalsy()
      wrapper.find('.v-time-picker-title__ampm .v-picker__title__btn:not(.v-picker__title__btn--active)').trigger('click')
      expect(wrapper.emitted('update:period')).toHaveLength(1)
      expect(wrapper.emitted('update:period')[0]).toEqual(['am'])

      wrapper.setProps({
        hour: 2,
        minute: 13,
        second: 35,
        period: 'am',
      })
      await wrapper.vm.$nextTick()
      wrapper.find('.v-time-picker-title__ampm .v-picker__title__btn:not(.v-picker__title__btn--active)').trigger('click')
      expect(wrapper.emitted('update:period')).toHaveLength(2)
      expect(wrapper.emitted('update:period')[1]).toEqual(['pm'])
    })

    it('should not emit event when clicked on readonly am/pm' + useSecondsDesc, async () => {
      const wrapper = mountFunction({
        props: {
          hour: 14,
          minute: 13,
          second: 25,
          period: 'pm',
          ampm: true,
          readonly: true,
          useSeconds: useSecondsValue,
        },
      })

      wrapper.find('.v-time-picker-title__ampm .v-picker__title__btn:not(.v-picker__title__btn--active)').trigger('click')
      expect(wrapper.emitted('update:period')).toBeFalsy()
    })

    it('should emit event when clicked on hours/minutes/seconds' + useSecondsDesc, async () => {
      const wrapper = mountFunction({
        props: {
          hour: 14,
          minute: 13,
          second: 25,
          period: 'pm',
          useSeconds: useSecondsValue,
        },
      })

      wrapper.findAll('.v-time-picker-title__time .v-picker__title__btn')[1].trigger('click')
      expect(wrapper.emitted('update:selecting')).toHaveLength(1)
      expect(wrapper.emitted('update:selecting')[0]).toEqual([SelectingTimes.Minute])
      wrapper.findAll('.v-time-picker-title__time .v-picker__title__btn')[0].trigger('click')
      expect(wrapper.emitted('update:selecting')).toHaveLength(2)
      expect(wrapper.emitted('update:selecting')[1]).toEqual([SelectingTimes.Hour])
      if (useSecondsValue) {
        wrapper.findAll('.v-time-picker-title__time .v-picker__title__btn')[2].trigger('click')
        expect(wrapper.emitted('update:selecting')).toHaveLength(3)
        expect(wrapper.emitted('update:selecting')[2]).toEqual([SelectingTimes.Second])
      }
      wrapper.setProps({ selecting: SelectingTimes.Hour })
      await wrapper.vm.$nextTick()
      wrapper.findAll('.v-time-picker-title__time .v-picker__title__btn')[1].trigger('click')
      expect(wrapper.emitted('update:selecting')).toHaveLength(useSecondsValue ? 4 : 3)
      expect(wrapper.emitted('update:selecting')[useSecondsValue ? 3 : 2]).toEqual([SelectingTimes.Minute])
    })

    it('should emit event when clicked on readonly hours/minutes' + useSecondsDesc, async () => {
      const wrapper = mountFunction({
        props: {
          hour: 14,
          minute: 13,
          period: 'pm',
          readonly: true,
          useSeconds: useSecondsValue,
        },
      })

      wrapper.find('.v-time-picker-title__time .v-picker__title__btn').trigger('click')
      expect(wrapper.emitted('update:selecting')).toHaveLength(1)
      expect(wrapper.emitted('update:selecting')[0]).toEqual([SelectingTimes.Hour])
    })
  })
})
