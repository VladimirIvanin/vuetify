import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import Vuetify from '../src'
import './util/toHaveBeenWarned'

// Мок для CSS модулей (замена identity-obj-proxy)
vi.mock('*.css', () => ({}))
vi.mock('*.scss', () => ({}))
vi.mock('*.sass', () => ({}))
vi.mock('*.styl', () => ({}))
vi.mock('*.stylus', () => ({}))

// Мок для статических ресурсов
vi.mock('*.svg', () => 'svg')
vi.mock('*.png', () => 'png')
vi.mock('*.jpg', () => 'jpg')
vi.mock('*.jpeg', () => 'jpeg')
vi.mock('*.gif', () => 'gif')
vi.mock('*.webp', () => 'webp')

// Глобальная настройка Vuetify для тестов
const vuetify = new Vuetify()

// Настройка глобальных моков
config.global.plugins = [vuetify]

// Мок для IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Мок для ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Мок для matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Мок для getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: vi.fn(),
  }),
})

// Утилиты для тестов
export const wait = (timeout?: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

export const waitAnimationFrame = () => {
  return new Promise(resolve => requestAnimationFrame(resolve))
}

export const resizeWindow = (width = window.innerWidth, height = window.innerHeight) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
  window.dispatchEvent(new Event('resize'))
  return wait(200)
}

export const scrollWindow = (y: number) => {
  Object.defineProperty(window, 'pageYOffset', {
    writable: true,
    configurable: true,
    value: y,
  })
  window.dispatchEvent(new Event('scroll'))
  return wait(200)
}


