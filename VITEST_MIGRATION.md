# Миграция с Jest на Vitest

## Обзор

Этот документ описывает процесс миграции тестового фреймворка с Jest на Vitest для проекта Vuetify 3.

## Почему Vitest?

### Преимущества Vitest:
- ⚡ **В 20-100 раз быстрее** чем Jest
- 🎯 **Нативная поддержка Vue 3** и Composition API
- 🔧 **Совместимость с Jest API** - минимальные изменения в тестах
- 📦 **TypeScript из коробки** - не нужны дополнительные трансформеры
- 🚀 **Hot Module Replacement** для тестов
- 🌐 **Встроенная поддержка ESM**

### Недостатки Jest:
- 🐌 Медленная производительность
- 🔧 Сложная конфигурация для Vue 3
- 📦 Проблемы с ESM модулями
- 🏗️ Устаревшая архитектура

## Конфигурация

### 1. Основной конфигурационный файл: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./packages/vuetify/test/vitest-setup.ts'],
    include: [
      'packages/vuetify/src/**/*.{test,spec}.{js,ts}',
      'packages/vuetify/test/**/*.{test,spec}.{js,ts}'
    ],
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'packages/vuetify/src/**/*.{js,ts}',
        '!packages/vuetify/src/**/*.d.ts'
      ]
    }
  },
  esbuild: {
    tsconfig: './packages/vuetify/tsconfig.test.json'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './packages/vuetify/src'),
      '@test': resolve(__dirname, './packages/vuetify/test')
    }
  },
  define: {
    // Для совместимости с CSS модулями
    'process.env': process.env
  },
  css: {
    modules: {
      // Эмуляция identity-obj-proxy для CSS модулей
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
  }
})
```

### 2. Настройка тестов: `packages/vuetify/test/vitest-setup.ts`

```typescript
import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import Vuetify from '../src'

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
    addListener: vi.fn(),
    removeListener: vi.fn(),
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

// Настройка для тестирования предупреждений
export const toHaveBeenWarnedInit = () => {
  const asserted: string[] = []

  const createCompareFn = (spy: any) => {
    return (msg: string) => {
      const warned = (msg: string) => asserted.some(assertedMsg => msg.toString().includes(assertedMsg))

      for (const args of spy.mock.calls) {
        if (warned(args[0])) {
          return {
            message: () => `Expected message "${msg}" to have been warned`,
            pass: true,
          }
        }
      }

      return {
        message: () => `Expected message "${msg}" to have been warned`,
        pass: false,
      }
    }
  }

  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const error = vi.spyOn(console, 'error').mockImplementation(() => {})

  // Расширение expect для проверки предупреждений
  expect.extend({
    toHaveBeenWarned: createCompareFn(error),
    toHaveBeenTipped: createCompareFn(warn),
  })

  beforeEach(() => {
    asserted.length = 0
    warn.mockClear()
    error.mockClear()
  })

  afterEach(() => {
    for (const type of ['error', 'warn']) {
      const warned = (msg: string) => asserted.some(assertedMsg => msg.toString().includes(assertedMsg))
      for (const args of (console as any)[type].mock.calls) {
        if (!warned(args[0])) {
          throw new Error(`Unexpected console.${type} message: ${args[0]}`)
        }
      }
    }
  })
}

toHaveBeenWarnedInit()
```

## Миграция тестов

### До (Jest):
```typescript
import { mount, Wrapper } from '@vue/test-utils'
import VButton from '../VButton'

describe('VButton.spec.ts', () => {
  let mountFunction: (options?: any) => Wrapper<any>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VButton, {
        localVue,
        vuetify,
        ...options,
      })
    }
  })

  it('should render button', () => {
    const wrapper = mountFunction()
    expect(wrapper.find('.v-btn').exists()).toBe(true)
  })
})
```

### После (Vitest):
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import VButton from '../VButton'

describe('VButton.vitest.spec.ts', () => {
  type Instance = InstanceType<typeof VButton>
  let mountFunction: (options?: any) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VButton, {
        global: {
          stubs: {
            VIcon: {
              template: '<span class="v-icon"></span>',
            },
          },
        },
        ...options,
      })
    }
  })

  it('should render button', () => {
    const wrapper = mountFunction()
    expect(wrapper.find('.v-btn').exists()).toBe(true)
  })
})
```

## Основные изменения

### 1. Импорты
```typescript
// Jest (неявные глобалы)
describe('Test', () => {
  it('should work', () => {
    expect(true).toBe(true)
  })
})

// Vitest (явные импорты)
import { describe, it, expect } from 'vitest'

describe('Test', () => {
  it('should work', () => {
    expect(true).toBe(true)
  })
})
```

### 2. Моки
```typescript
// Jest
jest.fn()
jest.spyOn(console, 'warn')

// Vitest
vi.fn()
vi.spyOn(console, 'warn')
```

### 3. Настройка компонентов
```typescript
// Jest (Vue 2)
mount(Component, {
  localVue,
  vuetify,
  propsData: { prop: 'value' }
})

// Vitest (Vue 3)
mount(Component, {
  global: {
    plugins: [vuetify],
    stubs: { VIcon: true }
  },
  props: { prop: 'value' }
})
```

## Скрипты

### Добавить в package.json:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch"
  }
}
```

## Запуск тестов

```bash
# Запуск всех тестов
yarn test

# Запуск с UI интерфейсом
yarn test:ui

# Запуск с покрытием
yarn test:coverage

# Запуск в режиме наблюдения
yarn test:watch

# Запуск конкретного теста
yarn test VButton.vitest.spec.ts
```

## Полезные команды

```bash
# Установка зависимостей
yarn add -D vitest @vitest/ui @vitejs/plugin-vue jsdom

# Удаление Jest зависимостей (после полной миграции)
yarn remove jest jest-cli jest-css-modules jest-environment-jsdom-fourteen jest-serializer-html babel-jest @types/jest
```

## Советы по миграции

1. **Постепенная миграция**: Переводите тесты по одному компоненту
2. **Параллельное использование**: Можно использовать Jest и Vitest одновременно
3. **Тестирование**: Запускайте тесты после каждого изменения
4. **Документирование**: Обновляйте документацию по мере миграции

## Проблемы и решения

### CSS модули
- **Проблема**: Jest использует `identity-obj-proxy`
- **Решение**: Настроить моки в `vitest-setup.ts`

### Глобальные моки
- **Проблема**: Разные API для моков
- **Решение**: Использовать `vi.fn()` вместо `jest.fn()`

### TypeScript
- **Проблема**: Разные типы
- **Решение**: Использовать `VueWrapper<Instance>` вместо `Wrapper<any>`



