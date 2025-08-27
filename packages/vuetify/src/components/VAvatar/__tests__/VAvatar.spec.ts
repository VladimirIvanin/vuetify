// Libraries
import { h } from 'vue'

// Components
import VAvatar from '../VAvatar'

// Utilities
import {
  mount,
  MountingOptions,
  VueWrapper,
} from '@vue/test-utils'

describe('VAvatar', () => {
  type Instance = InstanceType<typeof VAvatar>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options?: MountingOptions<Instance>) => {
      const defaultOptions = {
        global: {
          mocks: {
            // Мокаем только необходимые свойства Vuetify
            $vuetify: {
              lang: {
                t: (val: string) => val,
              },
              icons: {
                component: 'mdi',
              },
            },
          },
        },
      }

      // Объединяем опции правильно
      const mergedOptions = {
        ...defaultOptions,
        ...options,
        global: {
          ...defaultOptions.global,
          ...options?.global,
        },
      }

      return mount(VAvatar, mergedOptions)
    }
  })

  it('should have an v-avatar class', () => {
    const wrapper = mountFunction()

    expect(wrapper.classes()).toContain('v-avatar')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render with custom size', () => {
    const wrapper = mountFunction({
      props: {
        size: 64,
      },
    })

    expect(wrapper.attributes('style')).toContain('width: 64px')
    expect(wrapper.attributes('style')).toContain('height: 64px')
  })

  it('should render with left class when left prop is true', () => {
    const wrapper = mountFunction({
      props: {
        left: true,
      },
    })

    expect(wrapper.classes()).toContain('v-avatar--left')
  })

  it('should render with right class when right prop is true', () => {
    const wrapper = mountFunction({
      props: {
        right: true,
      },
    })

    expect(wrapper.classes()).toContain('v-avatar--right')
  })

  it('should render slot content', () => {
    const wrapper = mountFunction({
      slots: {
        default: () => [h('span', 'Avatar Content')],
      },
    })

    expect(wrapper.text()).toContain('Avatar Content')
  })
})
