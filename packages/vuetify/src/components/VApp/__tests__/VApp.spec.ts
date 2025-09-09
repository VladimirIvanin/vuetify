// Components
import VApp from '../VApp'

// Utilities
import {
  mount,
  VueWrapper,
} from '@vue/test-utils'

describe('VApp.ts', () => {
  type Instance = InstanceType<typeof VApp>
  let mountFunction: (options?: object) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VApp, {
        ...options,
      })
    }
  })

  it('should match a snapshot', () => {
    const wrapper = mountFunction({
      global: {
        mocks: {
          $vuetify: {
            rtl: false,
            theme: {
              dark: false,
            },
          },
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should have data-app attribute', () => {
    const wrapper = mountFunction({
      global: {
        mocks: {
          $vuetify: {
            rtl: false,
            theme: {
              dark: false,
            },
          },
        },
      },
    })

    const app = wrapper.find('.v-application')
    expect(app.attributes()['data-app']).toBe('true')
  })

  it('should allow a custom id', () => {
    const wrapper = mountFunction({
      props: {
        id: 'inspire',
      },
      global: {
        mocks: {
          $vuetify: {
            rtl: false,
            theme: {
              dark: false,
            },
          },
        },
      },
    })
    const app = wrapper.find('.v-application')
    expect(app.attributes().id).toBe('inspire')

    expect(wrapper.html()).toMatchSnapshot()
  })
})
