// Libraries
import { h, nextTick } from 'vue'

// Components
import VToolbar from '../VToolbar'

// Utilities
import {
  mount,
  VueWrapper,
} from '@vue/test-utils'
import { enableAutoUnmount } from '@vue/test-utils'

describe('VToolbar.ts', () => {
  type Instance = InstanceType<typeof VToolbar>
  let mountFunction: (options?: object) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VToolbar, {
        global: {
          mocks: {
            $vuetify: {
              breakpoint: {
                smAndDown: false,
              },
            },
          },
        },
        ...options,
      })
    }
  })

  it('should render an extended toolbar', () => {
    const wrapper = mountFunction({
      props: {
        extended: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render an extended toolbar with specific height', () => {
    const wrapper = mountFunction({
      props: {
        extended: true,
        extensionHeight: 42,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should properly calculate content height', async () => {
    const wrapper = mountFunction()

    await wrapper.setProps({
      height: 999,
    })
    expect(wrapper.vm.computedContentHeight).toBe(999)

    await wrapper.setProps({
      height: undefined,
      dense: true,
    })
    expect(wrapper.vm.computedContentHeight).toBe(48)

    await wrapper.setProps({
      height: undefined,
      dense: false,
      prominent: true,
    })
    expect(wrapper.vm.computedContentHeight).toBe(128)

    await wrapper.setProps({
      height: undefined,
      dense: false,
      prominent: false,
    })

    // Проверяем значение по умолчанию (smAndDown: false)
    expect(wrapper.vm.computedContentHeight).toBe(64)

    // Создаем новый wrapper с smAndDown: true
    const wrapperMobile = mountFunction({
      global: {
        mocks: {
          $vuetify: {
            breakpoint: {
              smAndDown: true,
            },
          },
        },
      },
    })

    await wrapperMobile.setProps({
      height: undefined,
      dense: false,
      prominent: false,
    })

    expect(wrapperMobile.vm.computedContentHeight).toBe(56)
  })

  it('should have a custom extension height', () => {
    const wrapper = mountFunction({
      props: { tabs: true },
    })

    expect(wrapper.vm.extensionHeight).toBe(48)
  })

  it('should set height equal to both height and extensionHeight', () => {
    const wrapper = mountFunction({
      props: {
        height: 112,
        extended: true,
        extensionHeight: 64,
      },
    })

    expect((wrapper.vm.styles as any).height).toBe('176px')
  })
})
