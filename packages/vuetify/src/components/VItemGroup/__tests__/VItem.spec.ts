// Components
import VItem from '../VItem'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import { h, nextTick } from 'vue'

// Types
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenTipped(): R
      toHaveBeenWarned(): R
    }
  }
}

const itemWarning = '[Vuetify] The v-item component must be used inside a v-item-group'

describe('VItem', () => {
  type Instance = InstanceType<typeof VItem>
  let mountFunction: (options?: any) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    // Мокаем itemGroup для предотвращения предупреждений
    const mockItemGroup = {
      register: jest.fn(),
      unregister: jest.fn(),
      activeClass: 'active'
    }

    mountFunction = (options = {}) => {
      return mount(VItem, {
        global: {
          provide: {
            itemGroup: mockItemGroup
          }
        },
        ...options,
      })
    }
  })

  it('should render correctly with default slot', () => {
    const wrapper = mountFunction({
      slots: {
        default: ({ active, toggle }: any) => h('button', {
          onClick: toggle,
          class: active ? 'active' : ''
        }, 'Click me')
      }
    })

    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Click me')
  })

  it('should emit change event when toggled', async () => {
    const wrapper = mountFunction({
      slots: {
        default: ({ active, toggle }: any) => h('button', {
          onClick: toggle,
          class: active ? 'active' : ''
        }, active ? 'Active' : 'Inactive')
      }
    })

    const button = wrapper.find('button')

    expect(button.text()).toBe('Inactive')
    expect(button.classes()).not.toContain('active')

    // Кликаем по кнопке для переключения состояния
    await button.trigger('click')

    // Проверяем, что эмитилось событие change
    expect(wrapper.emitted()).toHaveProperty('change')
    expect(wrapper.emitted().change).toHaveLength(1)
  })

  it('should toggle active state when isActive is changed directly', async () => {
    const wrapper = mountFunction({
      slots: {
        default: ({ active, toggle }: any) => h('button', {
          onClick: toggle,
          class: active ? 'active' : ''
        }, active ? 'Active' : 'Inactive')
      }
    })

    const button = wrapper.find('button')

    expect(button.text()).toBe('Inactive')
    expect(button.classes()).not.toContain('active')

    // Изменяем isActive напрямую (как это делает ItemGroup)
    await wrapper.setData({ isActive: true })

    expect(button.text()).toBe('Active')
    expect(button.classes()).toContain('active')
  })

  it('should apply activeClass when active', async () => {
    const wrapper = mountFunction({
      props: {
        activeClass: 'foo'
      },
      slots: {
        default: ({ active }: any) => h('div', `State: ${active}`)
      }
    })

    expect(wrapper.html()).toMatchSnapshot()

    // Активируем элемент через изменение данных
    await wrapper.setData({ isActive: true })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should warn when used without itemGroup', () => {
    // Тестируем предупреждение, когда компонент используется без itemGroup
    mount(VItem, {
      slots: {
        default: ({ active, toggle }: any) => h('button', { onClick: toggle }, 'Test')
      }
    })

    expect(itemWarning).toHaveBeenTipped()
  })
})
