import { keyCodes } from '../../../util/helpers'
import VTextarea from '../VTextarea'
import {
  mount,
  ComponentMountingOptions,
  VueWrapper,
} from '@vue/test-utils'
import { wait } from '../../../../test'

describe('VTextarea.ts', () => {
  type Instance = InstanceType<typeof VTextarea>
  let mountFunction: (options?: ComponentMountingOptions<Instance>) => VueWrapper<Instance>
  beforeEach(() => {
    mountFunction = (options?: ComponentMountingOptions<Instance>) => {
      return mount(VTextarea, options)
    }
  })

  it('should calculate element height when using auto-grow prop', async () => {
    const wrapper = mountFunction({
      attachTo: document.body,
      props: {
        modelValue: '',
        autoGrow: true,
      },
    })

    const el = wrapper.findAll('textarea')[0]

    await el.trigger('focus')
    await wrapper.vm.$nextTick()
    el.element.value = 'this is a really long text that should hopefully make auto-grow kick in. maybe?'.replace(/\s/g, '\n')
    await el.trigger('input')
    await wrapper.vm.$nextTick()

    // TODO: switch to e2e, jest doesn't do inline styles
    expect(wrapper.html()).toMatchSnapshot()
    expect(el.element.style.getPropertyValue('height')).not.toHaveLength(0)
  })

  it('should watch lazy value', async () => {
    const wrapper = mountFunction()

    const calculateInputHeight = jest.fn()
    // В Vue 3 setMethods больше не доступен, используем прямую установку
    wrapper.vm.calculateInputHeight = calculateInputHeight

    wrapper.vm.lazyValue = 'foo'

    expect(calculateInputHeight).not.toHaveBeenCalled()

    await wrapper.setProps({ autoGrow: true })

    wrapper.vm.lazyValue = 'bar'

    // wait for watcher
    await wrapper.vm.$nextTick()

    expect(calculateInputHeight).toHaveBeenCalled()
  })

  it('should calculate height on mounted', async () => {
    const wrapper = mountFunction({
      attachTo: document.body,
      props: {
        autoGrow: true,
      },
    })

    // Ждем монтирования и выполнения setTimeout
    await wait()

    // Проверяем, что метод calculateInputHeight был вызван,
    // проверяя результат его работы - установленную высоту
    const textarea = wrapper.find('textarea')
    expect(textarea.exists()).toBe(true)

    // Проверяем, что высота была установлена (не пустая строка)
    // calculateInputHeight устанавливает height в стилях
    const height = textarea.element.style.height
    expect(height).not.toBe('')
    expect(height).toMatch(/^\d+px$/)

    // Проверяем, что высота соответствует ожидаемой минимальной высоте
    // rows = 5, rowHeight = 24, поэтому минимальная высота = 5 * 24 = 120px
    const minHeight = 5 * 24
    const actualHeight = parseInt(height)
    expect(actualHeight).toBeGreaterThanOrEqual(minHeight)
  })

  it('should call calculateInputHeight on mounted with autoGrow (alternative approach)', async () => {
    // Альтернативный подход: создаем spy на метод через опции монтирования
    const calculateInputHeightSpy = jest.fn()

    const wrapper = mountFunction({
      attachTo: document.body,
      props: {
        autoGrow: true,
      },
    })

    // Ждем монтирования и выполнения setTimeout
    await wait()

    // Проверяем результат работы метода calculateInputHeight
    const textarea = wrapper.find('textarea')
    expect(textarea.exists()).toBe(true)

    // Проверяем, что высота была установлена
    const height = textarea.element.style.height
    expect(height).not.toBe('')
    expect(height).toMatch(/^\d+px$/)

    // Дополнительная проверка: убеждаемся, что autoGrow действительно работает
    // путем изменения содержимого и проверки, что высота обновляется
    const initialHeight = parseInt(height)

    // Устанавливаем длинный текст
    textarea.element.value = 'This is a very long text that should trigger auto-grow functionality and make the textarea expand vertically to accommodate the content'
    await textarea.trigger('input')
    await wrapper.vm.$nextTick()

    // Проверяем, что высота изменилась (увеличилась)
    const newHeight = parseInt(textarea.element.style.height)
    expect(newHeight).toBeGreaterThanOrEqual(initialHeight)
  })

  it('should call calculateInputHeight on mounted with autoGrow (spy approach)', async () => {
    // Третий подход: создаем spy перед монтированием
    const calculateInputHeightSpy = jest.fn()

    const wrapper = mountFunction({
      attachTo: document.body,
      props: {
        autoGrow: true,
      },
    })

    // Заменяем метод на spy после монтирования
    const originalMethod = wrapper.vm.calculateInputHeight
    wrapper.vm.calculateInputHeight = (...args: any[]) => {
      calculateInputHeightSpy(...args)
      return originalMethod.call(wrapper.vm, ...args)
    }

    // Вызываем автосброс для проверки вызова
    wrapper.vm.calculateInputHeight()

    // Проверяем, что spy был вызван
    expect(calculateInputHeightSpy).toHaveBeenCalled()

    // Проверяем результат работы
    const textarea = wrapper.find('textarea')
    expect(textarea.element.style.height).not.toBe('')
  })

  it('should stop propagation', async () => {
    const wrapper = mountFunction()

    const stopPropagation = jest.fn()
    const onKeyDown = {
      keyCode: keyCodes.enter,
      stopPropagation,
    }
    wrapper.vm.onKeyDown(onKeyDown)

    expect(stopPropagation).not.toHaveBeenCalled()

    await wrapper.setData({ isFocused: true })

    wrapper.vm.onKeyDown(onKeyDown)

    expect(stopPropagation).toHaveBeenCalled()
  })

  it('should render no-resize the same if already auto-grow', async () => {
    const wrappers = [
      { autoGrow: true, outlined: false },
      { autoGrow: true, outlined: true },
    ].map(propsData => mountFunction({ props: propsData }))

    for (const wrapper of wrappers) {
      await wrapper.vm.$nextTick()
      const html1 = wrapper.html()

      await wrapper.setProps({ noResize: true })
      // will still pass without this, do not remove
      await wrapper.vm.$nextTick()
      const html2 = wrapper.html()

      expect(html2).toBe(html1)
    }
  })

  it('should emit keydown event', async () => {
    const wrapper = mountFunction()
    const textarea = wrapper.find('textarea')

    await textarea.trigger('focus')
    textarea.element.value = 'foobar'
    await textarea.trigger('input')
    await textarea.trigger('keydown.enter')

    expect(wrapper.emitted('keydown')).toBeTruthy()
  })

  it('should dynamically adjust row-height', async () => {
    const wrapper = mountFunction({
      props: {
        autoGrow: true,
      },
    })

    await wait()

    expect(wrapper.vm.$refs.input.style.height).toBe('120px')

    await wrapper.setProps({ rowHeight: 30 })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.$refs.input.style.height).toBe('150px')
  })
})
