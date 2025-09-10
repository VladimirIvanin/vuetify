import { ComponentPublicInstance, ComponentOptions } from 'vue'
import { VueWrapper, config } from '@vue/test-utils'
import { legacyEventsMixin } from '../src/util/legacyEventsMixin'
import toHaveBeenWarnedInit from './util/to-have-been-warned'

import mdiIcons from '../src/services/icons/presets/mdi'
import en from '../src/locale/en'

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
    },
    rtl: false,
    lang: {
      t: (key: string, ...params: any[]) => {
        if (key.startsWith('$vuetify.')) {
          const translationKey = key.replace('$vuetify.', '')
          const keys = translationKey.split('.')
          let translation: any = en

          for (const k of keys) {
            if (translation && typeof translation === 'object' && k in translation) {
              translation = translation[k]
            } else {
              return key
            }
          }

          if (typeof translation === 'string' && params.length > 0) {
            return translation.replace(/\{(\d+)\}/g, (match: string, index: string) => {
              return String(params[+index] || match)
            })
          }

          return typeof translation === 'string' ? translation : key
        }

        return key
      },
    },
    icons: {
      component: null,
      values: mdiIcons,
    },
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
