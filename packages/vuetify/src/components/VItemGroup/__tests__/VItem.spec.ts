// Components
import VItem from '../VItem'

// Utilities
import {
  mount,
  enableAutoUnmount,
} from '@vue/test-utils'
import { h, nextTick } from 'vue'

const itemWarning = '[Vuetify] The v-item component must be used inside a v-item-group'

describe('VItem', () => {
  let mountFunction: (options?: object) => any

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VItem, {
        ...options,
      })
    }
  })

  it('should warn if missing default scopedSlot', () => {
    mountFunction()

    expect('v-item is missing a default scopedSlot').toHaveBeenTipped()
    expect(itemWarning).toHaveBeenTipped()
  })

  it('should warn if multiple elements', () => {
    const wrapper = mount(VItem, {
      slots: {
        default: '<div>foo</div><div>bar</div>',
      },
    })

    expect('v-item should only contain valid VNode elements').toHaveBeenTipped()
    expect(itemWarning).toHaveBeenTipped()
  })

  it('should match snapshot activeClass', async () => {
    const wrapper = mount(VItem, {
      props: {
        activeClass: 'foo',
      },
      slots: {
        default: '<div>test content</div>',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    // Изменяем isActive напрямую в компоненте
    wrapper.vm.isActive = true

    await nextTick()

    expect(wrapper.html()).toMatchSnapshot()
    expect(itemWarning).toHaveBeenTipped()
  })
})
