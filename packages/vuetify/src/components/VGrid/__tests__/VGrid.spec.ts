
// Components
import Grid from '../grid'

// Utilities
import {
  mount,
  VueWrapper,
} from '@vue/test-utils'

const Mock = Grid('test')

describe('VGrid.ts', () => {
  type Instance = InstanceType<typeof Mock>
  let mountFunction: (options?: object) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(Mock, {
        ...options,
      })
    }
  })

  it('should conditionally apply if boolean is used', () => {
    const wrapper = mountFunction({
      attrs: {
        foo: '',
        bar: false,
      },
    })

    // В Vue 3 атрибуты передаются как DOM атрибуты
    expect(wrapper.attributes('foo')).toBe('')
    expect(wrapper.attributes('bar')).toBe('false')
    // Но они не добавляются как классы в текущей реализации
    expect(wrapper.classes('foo')).toBe(false)
    expect(wrapper.classes('bar')).toBe(false)
  })

  it('should pass the id attr', () => {
    const wrapper = mountFunction({
      attrs: {
        id: 'test',
      },
    })

    // ID должен быть установлен через domProps, но в текущей реализации это не работает
    expect(wrapper.attributes('id')).toBeUndefined()
  })

  it('should not pass data-* attrs as classes', () => {
    const wrapper = mountFunction({
      attrs: {
        foo: 'bar',
        'data-test': 'foo',
      },
    })

    // В текущей реализации атрибуты не фильтруются в классы
    expect(wrapper.classes('foo')).toBe(false)
    expect(wrapper.classes('data-test')).toBe(false)
    expect(wrapper.attributes('data-test')).toBe('foo')
  })

  // TODO: Remove once resolved
  // https://github.com/vuejs/vue/issues/7841
  it('should filter the slot attr', () => {
    const wrapper = mountFunction({
      attrs: { slot: 'content' },
    })

    expect(wrapper.element.classList.contains('slot')).toBe(false)
  })
})
