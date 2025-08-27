// Components
import VBtnToggle from '../VBtnToggle'

// Utilities
import {
  mount,
  VueWrapper,
  MountingOptions,
} from '@vue/test-utils'

describe('VBtnToggle.ts', () => {
  type Instance = InstanceType<typeof VBtnToggle>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VBtnToggle, {
        global: {
          mocks: {
            $vuetify: {
              theme: {
                current: 'light',
                dark: false,
              },
            },
          },
        },
        ...options,
      })
    }
  })

  it('should not apply background color with group', async () => {
    const wrapper = mountFunction({
      props: { backgroundColor: 'primary' },
    })

    expect(wrapper.element.classList.contains('primary')).toBeTruthy()

    await wrapper.setProps({ group: true })

    expect(wrapper.element.classList.contains('primary')).toBeFalsy()
  })

  it('should apply proper classes based on props', () => {
    const wrapper = mountFunction({
      props: {
        borderless: true,
        dense: true,
        rounded: true,
        shaped: true,
        tile: true,
      },
    })

    expect(wrapper.classes()).toContain('v-btn-toggle--borderless')
    expect(wrapper.classes()).toContain('v-btn-toggle--dense')
    expect(wrapper.classes()).toContain('v-btn-toggle--rounded')
    expect(wrapper.classes()).toContain('v-btn-toggle--shaped')
    expect(wrapper.classes()).toContain('v-btn-toggle--tile')
  })

  it('should apply group class when group prop is true', () => {
    const wrapper = mountFunction({
      props: { group: true },
    })

    expect(wrapper.classes()).toContain('v-btn-toggle--group')
  })

  it('should apply background color when not in group mode', () => {
    const wrapper = mountFunction({
      props: { backgroundColor: 'success' },
    })

    expect(wrapper.element.classList.contains('success')).toBeTruthy()
  })

  it('should have v-btn-toggle class by default', () => {
    const wrapper = mountFunction()

    expect(wrapper.classes()).toContain('v-btn-toggle')
  })
})
