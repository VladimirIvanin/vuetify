import {
  mount,
  VueWrapper,
  MountingOptions,
} from '@vue/test-utils'
import VCard from '../VCard'

describe('VCard.vue', () => {
  type Instance = InstanceType<typeof VCard>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options?: MountingOptions<Instance>) => {
      const defaultOptions = {
        global: {
          mocks: {
            $vuetify: {
              rtl: false,
              lang: {
                t: (val: string) => val,
              },
              icons: {
                component: 'mdi',
              },
            },
            $activeClass: 'v-card--active',
          },
        },
        slots: {},
      }

      // Объединяем опции правильно
      const mergedOptions = {
        ...defaultOptions,
        ...options,
        slots: {
          ...defaultOptions.slots,
          ...options?.slots,
        },
        global: {
          ...defaultOptions.global,
          ...options?.global,
        },
      }

      return mount(VCard, mergedOptions)
    }
  })

  it('should render component and match snapshot', () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render loading card', () => {
    const wrapper = mountFunction({
      props: {
        loading: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render card, which is link', () => {
    const wrapper = mountFunction({
      attrs: {
        onClick: () => {},
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render card with img', () => {
    const wrapper = mountFunction({
      props: {
        img: 'image.jpg',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render a flat card', () => {
    const wrapper = mountFunction({
      props: {
        flat: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render a raised card', () => {
    const wrapper = mountFunction({
      props: {
        raised: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render a card with custom height', async () => {
    const heightpx = '400px'
    const wrapper = mountFunction({
      props: {
        height: heightpx,
      },
    })

    expect(wrapper.element.style.height).toBe(heightpx)
    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({
      height: 401,
    })
    expect(wrapper.element.style.height).toBe('401px')
  })
})
