// Directives
import Resize from '../'

describe('resize.ts', () => {
  let mockAddEventListener: jest.SpyInstance
  let mockRemoveEventListener: jest.SpyInstance

  beforeEach(() => {
    mockAddEventListener = jest.spyOn(window, 'addEventListener')
    mockRemoveEventListener = jest.spyOn(window, 'removeEventListener')
  })

  afterEach(() => {
    mockAddEventListener.mockRestore()
    mockRemoveEventListener.mockRestore()
    jest.clearAllMocks()
  })

  it('should bind event on mounted', () => {
    const callback = jest.fn()
    const el = document.createElement('div')
    const vnode = { ctx: { uid: 1 } } as any

    Resize.mounted(el, { value: callback }, vnode)

    expect(callback).toHaveBeenCalled()
    expect(window.addEventListener).toHaveBeenCalledWith(
      'resize',
      callback,
      { passive: true }
    )

    // Vue 3 использует unmounted вместо unbind
    Resize.unmounted(el, { value: callback }, vnode)
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'resize',
      callback,
      { passive: true }
    )
  })

  it('should not run the callback in quiet mode', () => {
    const callback = jest.fn()
    const el = document.createElement('div')
    const vnode = { ctx: { uid: 2 } } as any

    Resize.mounted(el, { value: callback, modifiers: { quiet: true } }, vnode)

    expect(callback).not.toHaveBeenCalled()
    expect(window.addEventListener).toHaveBeenCalledWith(
      'resize',
      callback,
      { passive: true }
    )

    // Vue 3 использует unmounted вместо unbind
    Resize.unmounted(el, { value: callback, modifiers: { quiet: true } }, vnode)
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'resize',
      callback,
      { passive: true }
    )
  })

  it('should handle custom options', () => {
    const callback = jest.fn()
    const el = document.createElement('div')
    const vnode = { ctx: { uid: 3 } } as any
    const customOptions = { passive: false }

    Resize.mounted(el, { value: callback, options: customOptions }, vnode)

    expect(callback).toHaveBeenCalled()
    expect(window.addEventListener).toHaveBeenCalledWith(
      'resize',
      callback,
      customOptions
    )

    Resize.unmounted(el, { value: callback, options: customOptions }, vnode)
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'resize',
      callback,
      customOptions
    )
  })

  it('should not work with vnode without ctx.uid', () => {
    const callback = jest.fn()
    const el = document.createElement('div')
    const vnode = {} as any

    Resize.mounted(el, { value: callback }, vnode)

    expect(callback).not.toHaveBeenCalled()
    expect(window.addEventListener).not.toHaveBeenCalled()

    Resize.unmounted(el, { value: callback }, vnode)
    expect(window.removeEventListener).not.toHaveBeenCalled()
  })
})
