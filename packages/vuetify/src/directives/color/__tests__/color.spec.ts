import { defineComponent, h, withDirectives } from 'vue'
import { mount, VueWrapper } from '@vue/test-utils'
import Color from '../'

describe('color.ts', () => {
  let mountFunction: (directive?: any) => VueWrapper<any>

  beforeEach(() => {
    mountFunction = (directive = {}) => {
      const TestComponent = defineComponent({
        data () {
          return {
            color: '',
          }
        },
        render () {
          return withDirectives(h('div'), [
            [Color, this.color, directive.arg, directive.modifiers],
          ])
        },
      })

      return mount(TestComponent)
    }
  })

  it('should set background color', async () => {
    const wrapper = mountFunction({
      arg: undefined,
    })

    await wrapper.setData({ color: '#01f' })
    expect(wrapper.element.style.backgroundColor).toEqual('rgb(0, 17, 255)')
    expect(wrapper.element.style.borderColor).toEqual('#01f')

    await wrapper.setData({ color: 'rgb(255, 255, 0)' })
    expect(wrapper.element.style.backgroundColor).toEqual('rgb(255, 255, 0)')
    expect(wrapper.element.style.borderColor).toEqual('rgb(255, 255, 0)')

    await wrapper.setData({ color: 'red' })
    expect(wrapper.element.style.backgroundColor).toEqual('rgb(244, 67, 54)')
    expect(wrapper.element.style.borderColor).toEqual('#f44336')

    await wrapper.setData({ color: 'red lighten-1' })
    expect(wrapper.element.style.backgroundColor).toEqual('rgb(239, 83, 80)')
    expect(wrapper.element.style.borderColor).toEqual('#ef5350')

    await wrapper.setData({ color: 'primary' })
    expect(wrapper.element.style.backgroundColor).toEqual('rgb(25, 118, 210)')
    expect(wrapper.element.style.borderColor).toEqual('#1976d2')
  })

  it('should set text color', async () => {
    const wrapper = mountFunction({
      arg: 'text',
    })

    await wrapper.setData({ color: '#01f' })
    expect(wrapper.element.style.color).toEqual('rgb(0, 17, 255)')
    expect(wrapper.element.style.caretColor).toEqual('#01f')

    await wrapper.setData({ color: 'rgba(0, 1, 2, 0.5)' })
    expect(wrapper.element.style.color).toEqual('rgba(0, 1, 2, 0.5)')
    expect(wrapper.element.style.caretColor).toEqual('rgba(0, 1, 2, 0.5)')

    await wrapper.setData({ color: 'red' })
    expect(wrapper.element.style.color).toEqual('rgb(244, 67, 54)')
    expect(wrapper.element.style.caretColor).toEqual('#f44336')

    await wrapper.setData({ color: 'red lighten-1' })
    expect(wrapper.element.style.color).toEqual('rgb(239, 83, 80)')
    expect(wrapper.element.style.caretColor).toEqual('#ef5350')

    await wrapper.setData({ color: 'primary' })
    expect(wrapper.element.style.color).toEqual('rgb(25, 118, 210)')
    expect(wrapper.element.style.caretColor).toEqual('#1976d2')
  })

  it('should set border color', async () => {
    const wrapper = mountFunction({
      arg: 'border',
    })

    await wrapper.setData({ color: '#01f' })
    expect(wrapper.element.style.borderColor).toEqual('#01f')

    await wrapper.setData({ color: 'rgb(255, 255, 0)' })
    expect(wrapper.element.style.borderColor).toEqual('rgb(255, 255, 0)')

    await wrapper.setData({ color: 'red' })
    expect(wrapper.element.style.borderColor).toEqual('#f44336')

    await wrapper.setData({ color: 'red lighten-1' })
    expect(wrapper.element.style.borderColor).toEqual('#ef5350')

    await wrapper.setData({ color: 'primary' })
    expect(wrapper.element.style.borderColor).toEqual('#1976d2')
  })

  it('should respect border sides modifiers', async () => {
    const wrapper = mountFunction({
      arg: 'border',
      modifiers: { top: true, right: true, left: true },
    })

    await wrapper.setData({ color: '#fff' })
    expect(wrapper.element.style.borderTopColor).toEqual('#fff')
    expect(wrapper.element.style.borderRightColor).toEqual('#fff')
    expect(wrapper.element.style.borderLeftColor).toEqual('#fff')
    expect(wrapper.element.style.borderBottomColor).toEqual('')
    expect(wrapper.element.style.borderColor).toEqual('')
  })

  // Тестируем директиву напрямую
  describe('direct directive testing', () => {
    const mockVnode = { ctx: { $vuetify: { theme: { currentTheme: { primary: '#1976d2' } } } } } as any
    const el = document.createElement('div')

    beforeEach(() => {
      el.style.cssText = ''
    })

    it('should set background color directly', () => {
      Color.mounted(el, { value: '#01f' }, mockVnode)
      expect(el.style.backgroundColor).toEqual('rgb(0, 17, 255)')
      expect(el.style.borderColor).toEqual('#01f')
    })

    it('should set text color directly', () => {
      Color.mounted(el, { value: '#01f', arg: 'text' }, mockVnode)
      expect(el.style.color).toEqual('rgb(0, 17, 255)')
      expect(el.style.caretColor).toEqual('#01f')
    })

    it('should set border color directly', () => {
      Color.mounted(el, { value: '#01f', arg: 'border' }, mockVnode)
      expect(el.style.borderColor).toEqual('#01f')
    })

    it('should handle border modifiers directly', () => {
      Color.mounted(el, {
        value: '#fff',
        arg: 'border',
        modifiers: { top: true, right: true },
      }, mockVnode)
      expect(el.style.borderTopColor).toEqual('#fff')
      expect(el.style.borderRightColor).toEqual('#fff')
      expect(el.style.borderBottomColor).toEqual('')
      expect(el.style.borderLeftColor).toEqual('')
    })

    it('should handle theme colors directly', () => {
      Color.mounted(el, { value: 'primary' }, mockVnode)
      expect(el.style.backgroundColor).toEqual('rgb(25, 118, 210)')
      expect(el.style.borderColor).toEqual('#1976d2')
    })
  })
})
