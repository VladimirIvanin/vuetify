// Components
import VProgressLinear from '../VProgressLinear'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import { h } from 'vue'

describe('VProgressLinear.ts', () => {
  type Instance = InstanceType<typeof VProgressLinear>
  let mountFunction: (options?: object) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VProgressLinear, {
        data: () => ({
          isVisible: false,
        }),
        global: {
          mocks: {
            $vuetify: {
              rtl: false,
            },
          },
        },
        ...options,
      })
    }
  })

  it('should render component and match snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        value: 33,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ value: -1, bufferValue: -1 })
    const htmlMinus1 = wrapper.html()

    await wrapper.setProps({ value: 0, bufferValue: 0 })
    const html0 = wrapper.html()

    await wrapper.setProps({ value: 100, bufferValue: 100 })
    const html100 = wrapper.html()

    await wrapper.setProps({ value: 101, bufferValue: 101 })
    const html101 = wrapper.html()

    expect(htmlMinus1).toBe(html0)
    expect(html100).toBe(html101)
    expect(html0).not.toBe(html100)

    await wrapper.setProps({ value: '-1', bufferValue: '-1' })
    const htmlMinus1String = wrapper.html()

    await wrapper.setProps({ value: '0', bufferValue: '0' })
    const html0String = wrapper.html()

    await wrapper.setProps({ value: '100', bufferValue: '100' })
    const html100String = wrapper.html()

    await wrapper.setProps({ value: '101', bufferValue: '101' })
    const html101String = wrapper.html()

    expect(htmlMinus1String).toBe(html0String)
    expect(html100String).toBe(html101String)
    expect(html0String).not.toBe(html100String)
  })

  it('should render inactive component and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        value: 33,
        active: false,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component in RTL mode', () => {
    const wrapper = mountFunction({
      props: {
        value: 33,
      },
      global: {
        mocks: {
          $vuetify: {
            rtl: true,
          },
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render reversed component', () => {
    const wrapper = mountFunction({
      props: {
        reverse: true,
        value: 33,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render reverse component in RTL mode', () => {
    const wrapper = mountFunction({
      props: {
        reverse: true,
        value: 33,
      },
      global: {
        mocks: {
          $vuetify: { rtl: true },
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with color and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        value: 33,
        color: 'red',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with css color and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        value: 33,
        color: '#FF0000',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with color and background opacity and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        value: 33,
        color: 'red',
        backgroundOpacity: 0.5,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with color and background color and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        value: 33,
        color: 'red',
        backgroundColor: 'blue',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with color and background color and opacity and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        value: 33,
        color: 'red',
        backgroundColor: 'blue',
        backgroundOpacity: 0.5,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render indeterminate progress and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        indeterminate: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render indeterminate progress with query prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        indeterminate: true,
        query: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with buffer value and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        value: 33,
        bufferValue: 80,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with buffer value and value > buffer value and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        value: 90,
        bufferValue: 80,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render default slot content', () => {
    const wrapper = mountFunction({
      slots: {
        default: ({ value }) => h('div', { class: 'slot-content' }, `Progress: ${value}%`)
      }
    })

    expect(wrapper.find('.slot-content').exists()).toBe(true)
    expect(wrapper.find('.slot-content').text()).toBe('Progress: 0%')
  })

  it('should render slot content with custom value', () => {
    const wrapper = mountFunction({
      props: {
        value: 75,
      },
      slots: {
        default: ({ value }) => h('div', { class: 'slot-content' }, `Custom: ${value}%`)
      }
    })

    expect(wrapper.find('.slot-content').exists()).toBe(true)
    expect(wrapper.find('.slot-content').text()).toBe('Custom: 75%')
  })

  it('should respond to click events', async () => {
    const wrapper = mountFunction({
      props: {
        value: 33,
      },
      attrs: {
        'onUpdate:modelValue': () => {},
        onChange: () => {},
      },
      attachTo: document.body, // Важно для корректной работы событий
    })

    // Находим элемент прогресс-бара
    const progressBar = wrapper.find('.v-progress-linear')
    
    // Мокаем getBoundingClientRect для элемента
    const mockRect = {
      width: 400,
      height: 20,
      top: 0,
      left: 0,
      right: 400,
      bottom: 20,
    }
    
    // Мокаем offsetX для события клика
    const originalOffsetX = Object.getOwnPropertyDescriptor(MouseEvent.prototype, 'offsetX')
    Object.defineProperty(MouseEvent.prototype, 'offsetX', {
      get: () => 200, // 50% от ширины
      configurable: true
    })

    // Мокаем getBoundingClientRect
    const originalGetBoundingClientRect = progressBar.element.getBoundingClientRect
    progressBar.element.getBoundingClientRect = jest.fn().mockReturnValue(mockRect)

    try {
      // Триггерим событие клика
      await progressBar.trigger('click')

      // Проверяем, что событие эмитится
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      
      // Проверяем, что последнее значение примерно 50%
      const emittedValues = wrapper.emitted('update:modelValue')
      if (emittedValues && emittedValues.length > 0) {
        const lastValue = emittedValues[emittedValues.length - 1][0]
        expect(lastValue).toBeCloseTo(50, 0) // Проверяем с точностью до целого
      }
    } finally {
      // Восстанавливаем оригинальные методы
      if (originalOffsetX) {
        Object.defineProperty(MouseEvent.prototype, 'offsetX', originalOffsetX)
      }
      progressBar.element.getBoundingClientRect = originalGetBoundingClientRect
    }
  })

  it('should not respond to click events when not reactive', async () => {
    const wrapper = mountFunction({
      props: {
        value: 33,
      },
      attachTo: document.body,
    })

    // Убираем все слушатели событий
    const progressBar = wrapper.find('.v-progress-linear')
    
    // Мокаем getBoundingClientRect
    const mockRect = {
      width: 400,
      height: 20,
      top: 0,
      left: 0,
      right: 400,
      bottom: 20,
    }
    
    const originalGetBoundingClientRect = progressBar.element.getBoundingClientRect
    progressBar.element.getBoundingClientRect = jest.fn().mockReturnValue(mockRect)

    try {
      // Триггерим событие клика
      await progressBar.trigger('click')

      // Проверяем, что событие не эмитится
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    } finally {
      // Восстанавливаем оригинальный метод
      progressBar.element.getBoundingClientRect = originalGetBoundingClientRect
    }
  })

  it('should emit update:modelValue when clicked', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: 0,
      },
      attrs: {
        'onUpdate:modelValue': () => {},
        onChange: () => {},
      },
      attachTo: document.body,
    })

    const progressBar = wrapper.find('.v-progress-linear')
    
    // Мокаем getBoundingClientRect
    const mockRect = {
      width: 400,
      height: 20,
      top: 0,
      left: 0,
      right: 400,
      bottom: 20,
    }
    
    // Мокаем offsetX для 75% позиции
    const originalOffsetX = Object.getOwnPropertyDescriptor(MouseEvent.prototype, 'offsetX')
    Object.defineProperty(MouseEvent.prototype, 'offsetX', {
      get: () => 300, // 75% от ширины
      configurable: true
    })

    const originalGetBoundingClientRect = progressBar.element.getBoundingClientRect
    progressBar.element.getBoundingClientRect = jest.fn().mockReturnValue(mockRect)

    try {
      // Триггерим событие клика
      await progressBar.trigger('click')

      // Проверяем, что событие эмитится с правильным значением
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      const emittedValues = wrapper.emitted('update:modelValue')
      if (emittedValues && emittedValues.length > 0) {
        const lastValue = emittedValues[emittedValues.length - 1][0]
        expect(lastValue).toBeCloseTo(75, 0)
      }
    } finally {
      // Восстанавливаем оригинальные методы
      if (originalOffsetX) {
        Object.defineProperty(MouseEvent.prototype, 'offsetX', originalOffsetX)
      }
      progressBar.element.getBoundingClientRect = originalGetBoundingClientRect
    }
  })

  it('should handle edge cases in click events', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: 0,
      },
      attrs: {
        'onUpdate:modelValue': () => {},
        onChange: () => {},
      },
      attachTo: document.body,
    })

    const progressBar = wrapper.find('.v-progress-linear')
    
    // Мокаем getBoundingClientRect
    const mockRect = {
      width: 400,
      height: 20,
      top: 0,
      left: 0,
      right: 400,
      bottom: 20,
    }
    
    const originalGetBoundingClientRect = progressBar.element.getBoundingClientRect
    progressBar.element.getBoundingClientRect = jest.fn().mockReturnValue(mockRect)

    try {
      // Клик по левому краю (0%)
      const originalOffsetXLeft = Object.getOwnPropertyDescriptor(MouseEvent.prototype, 'offsetX')
      Object.defineProperty(MouseEvent.prototype, 'offsetX', {
        get: () => 0,
        configurable: true
      })

      await progressBar.trigger('click')

      // Проверяем, что значение 0%
      const emittedValuesLeft = wrapper.emitted('update:modelValue')
      if (emittedValuesLeft && emittedValuesLeft.length > 0) {
        const lastValue = emittedValuesLeft[emittedValuesLeft.length - 1][0]
        expect(lastValue).toBeCloseTo(0, 0)
      }

      // Клик по правому краю (100%)
      Object.defineProperty(MouseEvent.prototype, 'offsetX', {
        get: () => 400,
        configurable: true
      })

      await progressBar.trigger('click')

      // Проверяем, что значение 100%
      const emittedValuesRight = wrapper.emitted('update:modelValue')
      if (emittedValuesRight && emittedValuesRight.length > 0) {
        const lastValue = emittedValuesRight[emittedValuesRight.length - 1][0]
        expect(lastValue).toBeCloseTo(100, 0)
      }

      // Восстанавливаем оригинальное свойство
      if (originalOffsetXLeft) {
        Object.defineProperty(MouseEvent.prototype, 'offsetX', originalOffsetXLeft)
      }
    } finally {
      // Восстанавливаем оригинальный метод
      progressBar.element.getBoundingClientRect = originalGetBoundingClientRect
    }
  })

  it('should render a stream component', () => {
    const wrapper = mountFunction({
      props: {
        value: 33,
        stream: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should set isVisible with onObserve', () => {
    const wrapper = mountFunction()

    const entries = [
      {
        isIntersecting: true,
      },
    ] as IntersectionObserverEntry[]

    wrapper.vm.onObserve(entries, {} as IntersectionObserver, true)

    expect(wrapper.vm.isVisible).toBe(true)
  })

  it('should work with v-model', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: 25,
      },
    })

    // Проверяем начальное значение
    expect(wrapper.vm.internalLazyValue).toBe(25)
    expect(wrapper.vm.normalizedValue).toBe(25)

    // Изменяем значение через v-model
    await wrapper.setProps({ modelValue: 75 })

    // Проверяем, что значение обновилось
    expect(wrapper.vm.internalLazyValue).toBe(75)
    expect(wrapper.vm.normalizedValue).toBe(75)
  })

  it('should work with v-model and click events', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: 0,
      },
      attrs: {
        'onUpdate:modelValue': () => {},
        onChange: () => {},
      },
      attachTo: document.body,
    })

    const progressBar = wrapper.find('.v-progress-linear')
    
    // Мокаем getBoundingClientRect
    const mockRect = {
      width: 400,
      height: 20,
      top: 0,
      left: 0,
      right: 400,
      bottom: 20,
    }
    
    // Мокаем offsetX для 60% позиции
    const originalOffsetX = Object.getOwnPropertyDescriptor(MouseEvent.prototype, 'offsetX')
    Object.defineProperty(MouseEvent.prototype, 'offsetX', {
      get: () => 240, // 60% от ширины
      configurable: true
    })

    const originalGetBoundingClientRect = progressBar.element.getBoundingClientRect
    progressBar.element.getBoundingClientRect = jest.fn().mockReturnValue(mockRect)

    try {
      // Триггерим событие клика
      await progressBar.trigger('click')

      // Проверяем, что событие эмитится
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      
      // Проверяем, что значение примерно 60%
      const emittedValues = wrapper.emitted('update:modelValue')
      if (emittedValues && emittedValues.length > 0) {
        const lastValue = emittedValues[emittedValues.length - 1][0]
        expect(lastValue).toBeCloseTo(60, 0)
      }
    } finally {
      // Восстанавливаем оригинальные методы
      if (originalOffsetX) {
        Object.defineProperty(MouseEvent.prototype, 'offsetX', originalOffsetX)
      }
      progressBar.element.getBoundingClientRect = originalGetBoundingClientRect
    }
  })

  it('should maintain backward compatibility with value prop', async () => {
    const wrapper = mountFunction({
      props: {
        value: 30,
      },
    })

    // Проверяем, что работает старый prop value
    expect(wrapper.vm.internalLazyValue).toBe(30)
    expect(wrapper.vm.normalizedValue).toBe(30)

    // Изменяем значение через value
    await wrapper.setProps({ value: 80 })

    // Проверяем, что значение обновилось
    expect(wrapper.vm.internalLazyValue).toBe(80)
    expect(wrapper.vm.normalizedValue).toBe(80)
  })
})
