// Components
import VTab from '../VTab'
import VTabsBar from '../VTabsBar'

// Utilities
import {
  mount,
  RouterLinkStub,
  VueWrapper,
} from '@vue/test-utils'
import { h, nextTick } from 'vue'

describe('VTabsBar.ts', () => {
  let mountFunction: (options?: object) => VueWrapper

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VTabsBar, {
        global: {
          config: {
            warnHandler: () => {}, // Подавляем предупреждения Vue
          },
          stubs: {
            RouterLink: RouterLinkStub,
          },
          mocks: {
            $vuetify: {
              breakpoint: {},
              application: { left: 0, right: 0 },
              theme: { dark: false },
            },
            $route: { path: '/' },
            $router: {
              resolve: () => ({ href: '/' }),
            },
          },
        },
        slots: {
          default: () => [
            h(VTab, { to: '/foo' }, () => 'Tab 1'),
            h(VTab, { to: '/bar' }, () => 'Tab 2'),
          ],
        },
        ...options,
      })
    }
  })

  it('should handle route changes correctly', async () => {
    const wrapper = mountFunction({
      props: { mandatory: false },
    })

    // Ждем инициализации компонента
    await nextTick()

    const route1 = { path: '/foo' }
    const route2 = { path: '/bar' }
    const route3 = { path: '/fizz' }

    // Устанавливаем начальное значение через компонент
    await wrapper.setProps({ modelValue: '/foo' })

    // Получаем доступ к items после инициализации
    const items = (wrapper.vm as any).items
    expect(items).toBeDefined()
    expect(items.length).toBeGreaterThan(0)

    // Проверяем начальное значение
    expect((wrapper.vm as any).internalValue).toBe('/foo')

    // При mandatory=false и переходе между существующими табами значение остается
    ;(wrapper.vm as any).onRouteChange(route2, route1)
    expect((wrapper.vm as any).internalValue).toBe('/foo')

    // Проверяем, что при переходе на несуществующий путь значение становится undefined
    ;(wrapper.vm as any).onRouteChange(route3, route2)
    expect((wrapper.vm as any).internalValue).toBeUndefined()
  })

  it('should not change value when mandatory is true', async () => {
    const wrapper = mountFunction({
      props: { mandatory: true },
    })

    await nextTick()

    // Устанавливаем значение через компонент
    await wrapper.setProps({ modelValue: '/foo' })

    const route1 = { path: '/foo' }
    const route3 = { path: '/fizz' }

    // Получаем начальное значение
    const initialValue = (wrapper.vm as any).internalValue
    expect(initialValue).toBe('/foo')

    // При mandatory=true метод должен завершиться рано и не изменить значение
    ;(wrapper.vm as any).onRouteChange(route3, route1)
    expect((wrapper.vm as any).internalValue).toBe('/foo')
  })
})
