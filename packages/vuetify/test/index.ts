import { ComponentPublicInstance, ComponentOptions } from 'vue'
import { VueWrapper, config } from '@vue/test-utils'
import { legacyEventsMixin } from '../src/util/legacyEventsMixin'
import toHaveBeenWarnedInit from './util/to-have-been-warned'

// Configure global mixins for all tests
// This provides $on, $off, and $emitLegacy methods to all components in tests
// Also provides $listeners for Vue 3 compatibility
config.global.mixins = [
  legacyEventsMixin,
]

// Configure global stubs for transition components
// This prevents transition-stub elements from appearing in snapshots
config.global.stubs = {
  transition: false,
  'transition-group': false,
}

// Configure global mocks for Vuetify
config.global.mocks = {
  $vuetify: {
    theme: {
      current: 'light',
      dark: false,
      themes: {
        light: {},
        dark: {},
      },
      currentTheme: {
        primary: '#1976d2',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
      },
    },
    rtl: false,
    breakpoint: {
      mobile: false,
      mobileBreakpoint: 600,
      thresholds: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1264,
        xl: 1904,
      },
    },
  },
}

// Initialize custom Jest matchers globally
// This provides toHaveBeenWarned and toHaveBeenTipped matchers for all tests
toHaveBeenWarnedInit()

export function functionalContext (context: ComponentOptions<ComponentPublicInstance> = {}, children = []) {
  if (!Array.isArray(children)) children = [children]
  return {
    context: {
      data: {},
      props: {},
      ...context,
    },
    children,
  }
}

export function touch (element: VueWrapper<any>) {
  const createTrigger = (eventName: string) => (clientX: number, clientY: number) => {
    const touches = [{ clientX, clientY }]
    const event = new Event(eventName)

    ;(event as any).touches = touches
    ;(event as any).changedTouches = touches
    element.element.dispatchEvent(event)

    return touch(element)
  }

  return {
    start: createTrigger('touchstart'),
    move: createTrigger('touchmove'),
    end: createTrigger('touchend'),
  }
}

export const wait = (timeout?: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

export const waitAnimationFrame = (timeout?: number) => {
  return new Promise(resolve => requestAnimationFrame(resolve))
}

export const resizeWindow = (width = window.innerWidth, height = window.innerHeight) => {
  (window as any).innerWidth = width
  ;(window as any).innerHeight = height
  window.dispatchEvent(new Event('resize'))
  return wait(200)
}

export const scrollWindow = (y: number) => {
  (window as any).pageYOffset = y
  window.dispatchEvent(new Event('scroll'))

  return wait(200)
}

// Add a global mockup for IntersectionObserver
(global as any).IntersectionObserver = class IntersectionObserver {
  callback: (entries: any, observer: any) => void

  constructor (callback: (entries: any, observer: any) => void, options?: any) {
    this.callback = callback
  }

  observe () {
    this.callback([], this)
    return null
  }

  unobserve () {
    this.callback = () => {}
    return null
  }
}
