import {
  deepEqual,
  getNestedValue,
  getPropertyFromItem,
  convertToUnit,
  arrayDiff,
  getObjectValueByPath,
  humanReadableFileSize,
  sortItems,
  createSimpleFunctional,
  normalizeClasses,
  kebabCase,
  isObject,
  keys,
  camelize,
  upperFirst,
  wrapInArray,
  defaultFilter,
  searchItems,
  debounce,
  throttle,
  clamp,
  padEnd,
  chunk,
  camelizeObjectKeys,
  mergeDeep,
  fillArray,
  normalizeAttrs,
  createRange,
  filterObjectOnKeys,
  groupItems,
  getPrefixedScopedSlots,
  directiveConfig,
  addOnceEventListener,
  addPassiveEventListener,
  getZIndex,
  remapInternalIcon,
  getSlot,
  composedPath,
} from '../helpers'
import { mount } from '@vue/test-utils'
import Vue, { h } from 'vue'

describe('createSimpleFunctional', () => {
  it('should render with a custom tag', () => {
    const component = createSimpleFunctional('v-test', 'pre')
    const wrapper = mount(component)
    expect(wrapper.html()).toMatchSnapshot()
  })
  it('should render with a user-defined tag', () => {
    const component = createSimpleFunctional('v-test', 'pre')
    const wrapper = mount(component, {
      propsData: { tag: 'h1' },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})

describe('helpers', () => {
  it('should return set difference of arrays A and B', () => {
    expect(arrayDiff(['one', 'two'], ['one'])).toEqual([])
    expect(arrayDiff(['one'], ['one', 'two'])).toEqual(['two'])
    expect(arrayDiff([], [])).toEqual([])
    expect(arrayDiff([], ['one'])).toEqual(['one'])
    expect(arrayDiff(['one'], ['two'])).toEqual(['two'])
    expect(arrayDiff(['one', 'two'], ['one', 'three'])).toEqual(['three'])
  })

  it('should pass comparison', () => { // eslint-disable-line max-statements
    // Null
    expect(deepEqual(null, null)).toEqual(true)
    expect(deepEqual(null, undefined)).toEqual(false)
    expect(deepEqual(null, false)).toEqual(false)
    expect(deepEqual(null, 0)).toEqual(false)
    expect(deepEqual(null, '')).toEqual(false)
    expect(deepEqual(null, [])).toEqual(false)
    expect(deepEqual(null, {})).toEqual(false)

    // Undefined
    expect(deepEqual(undefined, undefined)).toEqual(true)
    expect(deepEqual(undefined, null)).toEqual(false)
    expect(deepEqual(undefined, false)).toEqual(false)
    expect(deepEqual(undefined, 0)).toEqual(false)
    expect(deepEqual(undefined, '')).toEqual(false)
    expect(deepEqual(undefined, [])).toEqual(false)
    expect(deepEqual(undefined, {})).toEqual(false)

    // Boolean
    expect(deepEqual(true, true)).toEqual(true)
    expect(deepEqual(true, false)).toEqual(false)
    expect(deepEqual(true, undefined)).toEqual(false)
    expect(deepEqual(true, null)).toEqual(false)
    expect(deepEqual(true, 0)).toEqual(false)
    expect(deepEqual(true, 1)).toEqual(false)
    expect(deepEqual(true, '')).toEqual(false)
    expect(deepEqual(true, 'abc')).toEqual(false)
    expect(deepEqual(true, [1, 2])).toEqual(false)
    expect(deepEqual(true, { x: 1 })).toEqual(false)

    expect(deepEqual(false, false)).toEqual(true)
    expect(deepEqual(false, true)).toEqual(false)
    expect(deepEqual(false, undefined)).toEqual(false)
    expect(deepEqual(false, null)).toEqual(false)
    expect(deepEqual(false, 0)).toEqual(false)
    expect(deepEqual(false, 1)).toEqual(false)
    expect(deepEqual(false, '')).toEqual(false)
    expect(deepEqual(false, 'abc')).toEqual(false)
    expect(deepEqual(false, [1, 2])).toEqual(false)
    expect(deepEqual(false, { x: 1 })).toEqual(false)

    // Number
    expect(deepEqual(5, 5)).toEqual(true)
    expect(deepEqual(8, 8.0)).toEqual(true)
    expect(deepEqual(8, '8')).toEqual(false)
    expect(deepEqual(-10, -10)).toEqual(true)

    expect(deepEqual(0, '')).toEqual(false)
    expect(deepEqual(0, false)).toEqual(false)
    expect(deepEqual(0, null)).toEqual(false)
    expect(deepEqual(0, undefined)).toEqual(false)

    // String
    expect(deepEqual('', '')).toEqual(true)
    expect(deepEqual('a', 'a')).toEqual(true)
    expect(deepEqual('a', 'b')).toEqual(false)
    expect(deepEqual('a', 'A')).toEqual(false)
    expect(deepEqual('abc', 'abc')).toEqual(true)
    expect(deepEqual('Abc', 'abc')).toEqual(false)
    expect(deepEqual(' ', '')).toEqual(false)

    // Array
    expect(deepEqual([], [])).toEqual(true)
    expect(deepEqual([1], [1.0])).toEqual(true)
    expect(deepEqual([1, '2'], [1, '2'])).toEqual(true)
    expect(deepEqual([1, { x: 1, y: 2 }], [1, { x: 1, y: 2 }])).toEqual(true)
    expect(deepEqual([1, { x: 1, y: null }], [1, { x: 1, y: false }])).toEqual(false)
    expect(deepEqual([1, [1, 2]], [1, [1, 2]])).toEqual(true)

    // Object
    expect(deepEqual({}, {})).toEqual(true)
    expect(deepEqual({ x: 1 }, { x: 1 })).toEqual(true)
    expect(deepEqual({ x: 1 }, {})).toEqual(false)
    expect(deepEqual({ x: { a: 1, b: 2 } }, { x: { a: 1, b: 2 } })).toEqual(true)

    // Date
    const currentDate = new Date()
    const futureDate = new Date(1000)

    expect(deepEqual(currentDate, currentDate)).toEqual(true)
    expect(deepEqual({ date: currentDate }, { date: currentDate })).toEqual(true)
    expect(deepEqual(currentDate, futureDate)).toEqual(false)
    expect(deepEqual({ date: currentDate }, { date: futureDate })).toEqual(false)

    const circular = {} // eslint-disable-line sonarjs/prefer-object-literal
    circular.me = circular

    expect(deepEqual({ r: circular }, { r: circular })).toEqual(true)
    expect(deepEqual({ r: circular, x: 1 }, { r: circular, x: 2 })).toEqual(false)
    expect(deepEqual({ r: [circular] }, { r: [circular] })).toEqual(true)
  })

  it('should get value directly on object if not undefined', () => {
    const obj = {
      a: 'foo',
      'b.a': 'foobar',
      b: {
        a: 1,
      },
      'c.d': undefined,
      c: {
        d: 'bar',
      },
    }

    expect(getObjectValueByPath(obj, 'a')).toEqual('foo')
    expect(getObjectValueByPath(obj, 'b.a')).toEqual('foobar')
    expect(getObjectValueByPath(obj, 'c.d')).toEqual('bar')
  })

  it('should get nested value', () => {
    const obj = {
      a: {
        b: {
          c: 1,
          d: 2,
        },
        e: [
          { f: 'f' },
          'e1',
        ],
      },
      g: null,
    }

    expect(getNestedValue(obj, ['a', 'b', 'c'])).toEqual(1)
    expect(getNestedValue(obj, ['a', 'b', 'd'])).toEqual(2)
    expect(getNestedValue(obj, ['a', 'b'])).toEqual({ c: 1, d: 2 })
    expect(getNestedValue(obj, ['a', 'e', '0', 'f'])).toEqual('f')
    expect(getNestedValue(obj, ['a', 'e', 0, 'f'])).toEqual('f')
    expect(getNestedValue(obj, ['a', 'e', '1'])).toEqual('e1')
    expect(getNestedValue(obj, ['g'])).toBeNull()
    expect(getNestedValue(obj, ['missing', 'key'])).toBeUndefined()

    const arr = ['val', obj]

    expect(getNestedValue(arr, ['1', 'a', 'b', 'c'])).toEqual(1)
    expect(getNestedValue(arr, ['1', 'a', 'e', 0, 'f'])).toEqual('f')
    expect(getNestedValue(arr, [0])).toEqual('val')
    expect(getNestedValue(arr, [1])).toEqual(obj)

    expect(getNestedValue('str', [])).toEqual('str')
    expect(getNestedValue(5, [])).toEqual(5)
    expect(getNestedValue(null, [])).toBeNull()

    expect(getNestedValue(null, ['a'])).toBeUndefined()
  })

  it('should get property from items', () => {
    const obj = {
      a: {
        b: 1,
      },
      c: [2, 3, { d: 'd' }],
      'x.y': 'comp',
      x: {
        y: 'nested',
      },
    }
    expect(getPropertyFromItem(obj, 'a.b')).toEqual(1)
    expect(getPropertyFromItem(obj, 'c.0')).toEqual(2)
    expect(getPropertyFromItem(obj, 'c.2.d')).toEqual('d')
    expect(getPropertyFromItem(obj, 'c.2.d.x', 'fallback')).toEqual('fallback')
    expect(getPropertyFromItem(obj, o => o.a.b + o.c[0])).toEqual(3)
    expect(getPropertyFromItem(obj, ['c', 2, 'd'])).toEqual('d')
    expect(getPropertyFromItem(obj, 'x.y')).toEqual('comp')
    expect(getPropertyFromItem(obj, ['x', 'y'])).toEqual('nested')
    expect(getPropertyFromItem(obj, ['x.y'])).toEqual('comp')
  })

  it('should return proper value in convertToUnit', () => {
    expect(convertToUnit(undefined)).toBeUndefined()
    expect(convertToUnit(null)).toBeUndefined()
    expect(convertToUnit('')).toBeUndefined()

    expect(convertToUnit(0)).toBe('0px')
    expect(convertToUnit(3)).toBe('3px')
    expect(convertToUnit(3.14)).toBe('3.14px')

    expect(convertToUnit(0, 'em')).toBe('0em')
    expect(convertToUnit(3, 'em')).toBe('3em')
    expect(convertToUnit(3.14, 'em')).toBe('3.14em')

    expect(convertToUnit('0vw')).toBe('0vw')
    expect(convertToUnit('3vw')).toBe('3vw')
    expect(convertToUnit('3.14vw')).toBe('3.14vw')

    expect(convertToUnit('foo')).toBe('foo')
  })

  it('humanReadableFileSize should format file sizes with base 1024', () => {
    expect(humanReadableFileSize(0, true)).toBe('0 B')
    expect(humanReadableFileSize(512, true)).toBe('512 B')

    expect(humanReadableFileSize(1024, true)).toBe('1.0 KiB')
    expect(humanReadableFileSize(4096, true)).toBe('4.0 KiB')

    expect(humanReadableFileSize(1048576, true)).toBe('1.0 MiB')
    expect(humanReadableFileSize(2097152, true)).toBe('2.0 MiB')

    expect(humanReadableFileSize(1073741824, true)).toBe('1.0 GiB')
    expect(humanReadableFileSize(2147483648, true)).toBe('2.0 GiB')
  })

  it('humanReadableFileSize should format file sizes with base 1000', () => {
    expect(humanReadableFileSize(0)).toBe('0 B')
    expect(humanReadableFileSize(512)).toBe('512 B')

    expect(humanReadableFileSize(1000)).toBe('1.0 kB')
    expect(humanReadableFileSize(4000)).toBe('4.0 kB')

    expect(humanReadableFileSize(1000000)).toBe('1.0 MB')
    expect(humanReadableFileSize(2000000)).toBe('2.0 MB')

    expect(humanReadableFileSize(1000000000)).toBe('1.0 GB')
    expect(humanReadableFileSize(2000000000)).toBe('2.0 GB')
  })

  it('should sort items by single column', () => {
    let items
    const getItems = () => [{ string: 'foo', number: 1 }, { string: 'bar', number: 2 }, { string: 'baz', number: 4 }, { string: 'fizzbuzz', number: 3 }]

    sortItems(items = getItems(), ['string'], [], 'en')
    expect(items).toStrictEqual([{ string: 'bar', number: 2 }, { string: 'baz', number: 4 }, { string: 'fizzbuzz', number: 3 }, { string: 'foo', number: 1 }])

    sortItems(items = getItems(), ['string'], [true], 'en')
    expect(items).toStrictEqual([{ string: 'foo', number: 1 }, { string: 'fizzbuzz', number: 3 }, { string: 'baz', number: 4 }, { string: 'bar', number: 2 }])

    sortItems(items = getItems(), ['number'], [], 'en')
    expect(items).toStrictEqual([{ string: 'foo', number: 1 }, { string: 'bar', number: 2 }, { string: 'fizzbuzz', number: 3 }, { string: 'baz', number: 4 }])

    sortItems(items = getItems(), ['number'], [true], 'en')
    expect(items).toStrictEqual([{ string: 'baz', number: 4 }, { string: 'fizzbuzz', number: 3 }, { string: 'bar', number: 2 }, { string: 'foo', number: 1 }])

    sortItems(items = getItems(), ['number'], [], 'en', { number: (a, b) => b - a })
    expect(items).toStrictEqual([{ string: 'baz', number: 4 }, { string: 'fizzbuzz', number: 3 }, { string: 'bar', number: 2 }, { string: 'foo', number: 1 }])

    sortItems(items = getItems(), ['number'], [true], 'en', { number: (a, b) => b - a })
    expect(items).toStrictEqual([{ string: 'foo', number: 1 }, { string: 'bar', number: 2 }, { string: 'fizzbuzz', number: 3 }, { string: 'baz', number: 4 }])
  })

  it('should sort items with deep structure', () => {
    const items = [{ foo: { bar: { baz: 3 } } }, { foo: { bar: { baz: 1 } } }, { foo: { bar: { baz: 2 } } }]

    sortItems(items, ['foo.bar.baz'], [], 'en')
    expect(items).toStrictEqual([{ foo: { bar: { baz: 1 } } }, { foo: { bar: { baz: 2 } } }, { foo: { bar: { baz: 3 } } }])
  })

  it('should sort items by multiple columns', () => {
    let items
    const getItems = () => [{ string: 'foo', number: 1 }, { string: 'bar', number: 3 }, { string: 'baz', number: 2 }, { string: 'baz', number: 1 }]

    sortItems(items = getItems(), ['string', 'number'], [], 'en')
    expect(items).toStrictEqual([{ string: 'bar', number: 3 }, { string: 'baz', number: 1 }, { string: 'baz', number: 2 }, { string: 'foo', number: 1 }])

    sortItems(items = getItems(), ['string', 'number'], [true, false], 'en')
    expect(items).toStrictEqual([{ string: 'foo', number: 1 }, { string: 'baz', number: 1 }, { string: 'baz', number: 2 }, { string: 'bar', number: 3 }])

    sortItems(items = getItems(), ['string', 'number'], [false, true], 'en')
    expect(items).toStrictEqual([{ string: 'bar', number: 3 }, { string: 'baz', number: 2 }, { string: 'baz', number: 1 }, { string: 'foo', number: 1 }])

    sortItems(items = getItems(), ['string', 'number'], [true, true], 'en')
    expect(items).toStrictEqual([{ string: 'foo', number: 1 }, { string: 'baz', number: 2 }, { string: 'baz', number: 1 }, { string: 'bar', number: 3 }])

    sortItems(items = getItems(), ['number', 'string'], [], 'en')
    expect(items).toStrictEqual([{ string: 'baz', number: 1 }, { string: 'foo', number: 1 }, { string: 'baz', number: 2 }, { string: 'bar', number: 3 }])

    sortItems(items = getItems(), ['number', 'string'], [true, false], 'en')
    expect(items).toStrictEqual([{ string: 'bar', number: 3 }, { string: 'baz', number: 2 }, { string: 'baz', number: 1 }, { string: 'foo', number: 1 }])

    sortItems(items = getItems(), ['number', 'string'], [false, true], 'en')
    expect(items).toStrictEqual([{ string: 'foo', number: 1 }, { string: 'baz', number: 1 }, { string: 'baz', number: 2 }, { string: 'bar', number: 3 }])

    sortItems(items = getItems(), ['number', 'string'], [true, true], 'en')
    expect(items).toStrictEqual([{ string: 'bar', number: 3 }, { string: 'baz', number: 2 }, { string: 'foo', number: 1 }, { string: 'baz', number: 1 }])

    sortItems(items = getItems(), ['string', 'number'], [], 'en', { number: (a, b) => b - a })
    expect(items).toStrictEqual([{ string: 'bar', number: 3 }, { string: 'baz', number: 2 }, { string: 'baz', number: 1 }, { string: 'foo', number: 1 }])

    sortItems(items = getItems(), ['number', 'string'], [], 'en', { number: (a, b) => b - a })
    expect(items).toStrictEqual([{ string: 'bar', number: 3 }, { string: 'baz', number: 2 }, { string: 'baz', number: 1 }, { string: 'foo', number: 1 }])
  })
})

describe('normalizeClasses', () => {
  it('should return empty object for undefined input', () => {
    expect(normalizeClasses(undefined)).toEqual({})
  })

  it('should return empty object for null input', () => {
    expect(normalizeClasses(null as any)).toEqual({})
  })

  it('should normalize string classes', () => {
    expect(normalizeClasses('class1 class2 class3')).toEqual({
      class1: true,
      class2: true,
      class3: true,
    })
  })

  it('should handle string with extra spaces', () => {
    expect(normalizeClasses('  class1   class2  ')).toEqual({
      class1: true,
      class2: true,
    })
  })

  it('should return object as is', () => {
    const classes = { class1: true, class2: false }
    expect(normalizeClasses(classes)).toBe(classes)
  })

  it('should normalize array of strings', () => {
    expect(normalizeClasses(['class1', 'class2', 'class3'])).toEqual({
      class1: true,
      class2: true,
      class3: true,
    })
  })

  it('should normalize array of objects', () => {
    expect(normalizeClasses([{ class1: true }, { class2: false }])).toEqual({
      class1: true,
      class2: false,
    })
  })

  it('should normalize mixed array', () => {
    expect(normalizeClasses(['class1', { class2: true }, 'class3'])).toEqual({
      class1: true,
      class2: true,
      class3: true,
    })
  })

  it('should handle empty string', () => {
    expect(normalizeClasses('')).toEqual({})
  })

  it('should handle string with only spaces', () => {
    expect(normalizeClasses('   ')).toEqual({})
  })
})

describe('kebabCase', () => {
  it('should convert camelCase to kebab-case', () => {
    expect(kebabCase('camelCase')).toBe('camel-case')
    expect(kebabCase('someLongVariableName')).toBe('some-long-variable-name')
    expect(kebabCase('aBC')).toBe('a-bc')
    expect(kebabCase('ABC')).toBe('abc')
  })

  it('should handle empty string', () => {
    expect(kebabCase('')).toBe('')
  })

  it('should handle single word', () => {
    expect(kebabCase('word')).toBe('word')
  })
})

describe('isObject', () => {
  it('should return true for objects', () => {
    expect(isObject({})).toBe(true)
    expect(isObject({ a: 1 })).toBe(true)
    expect(isObject([])).toBe(true)
    expect(isObject(new Date())).toBe(true)
  })

  it('should return false for non-objects', () => {
    expect(isObject(null)).toBe(false)
    expect(isObject(undefined)).toBe(false)
    expect(isObject(42)).toBe(false)
    expect(isObject('string')).toBe(false)
    expect(isObject(true)).toBe(false)
    expect(isObject(false)).toBe(false)
  })
})

describe('keys', () => {
  it('should return object keys', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(keys(obj)).toEqual(['a', 'b', 'c'])
  })

  it('should return empty array for empty object', () => {
    expect(keys({})).toEqual([])
  })
})

describe('camelize', () => {
  it('should convert kebab-case to camelCase', () => {
    expect(camelize('kebab-case')).toBe('kebabCase')
    expect(camelize('some-long-variable-name')).toBe('someLongVariableName')
    expect(camelize('a-b-c')).toBe('aBC')
  })

  it('should handle string without hyphens', () => {
    expect(camelize('word')).toBe('word')
    expect(camelize('')).toBe('')
  })
})

describe('upperFirst', () => {
  it('should capitalize first letter', () => {
    expect(upperFirst('hello')).toBe('Hello')
    expect(upperFirst('world')).toBe('World')
  })

  it('should handle empty string', () => {
    expect(upperFirst('')).toBe('')
  })

  it('should handle single character', () => {
    expect(upperFirst('a')).toBe('A')
  })
})

describe('wrapInArray', () => {
  it('should wrap single value in array', () => {
    expect(wrapInArray('test')).toEqual(['test'])
    expect(wrapInArray(42)).toEqual([42])
    expect(wrapInArray({ a: 1 })).toEqual([{ a: 1 }])
  })

  it('should return array as is', () => {
    const arr = [1, 2, 3]
    expect(wrapInArray(arr)).toBe(arr)
  })

  it('should return empty array for null/undefined', () => {
    expect(wrapInArray(null)).toEqual([])
    expect(wrapInArray(undefined)).toEqual([])
  })
})

describe('defaultFilter', () => {
  it('should filter values correctly', () => {
    expect(defaultFilter('hello world', 'hello', {})).toBe(true)
    expect(defaultFilter('hello world', 'world', {})).toBe(true)
    expect(defaultFilter('hello world', 'xyz', {})).toBe(false)
  })

  it('should handle case insensitive search', () => {
    expect(defaultFilter('Hello World', 'hello', {})).toBe(true)
    expect(defaultFilter('Hello World', 'WORLD', {})).toBe(true)
  })

  it('should return false for boolean values', () => {
    expect(defaultFilter(true, 'true', {})).toBe(false)
    expect(defaultFilter(false, 'false', {})).toBe(false)
  })

  it('should return false for null/undefined search', () => {
    expect(defaultFilter('test', null, {})).toBe(false)
    expect(defaultFilter('test', undefined, {})).toBe(false)
  })
})

describe('searchItems', () => {
  it('should search through object properties', () => {
    const items = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
      { name: 'Bob', age: 35 },
    ]

    expect(searchItems(items, 'john')).toEqual([{ name: 'John', age: 30 }])
    expect(searchItems(items, '25')).toEqual([{ name: 'Jane', age: 25 }])
  })

  it('should return all items for empty search', () => {
    const items = [{ name: 'John' }, { name: 'Jane' }]
    expect(searchItems(items, '')).toEqual(items)
    expect(searchItems(items, '   ')).toEqual(items)
  })

  it('should return empty array when no matches found', () => {
    const items = [{ name: 'John' }, { name: 'Jane' }]
    expect(searchItems(items, 'xyz')).toEqual([])
  })
})

describe('debounce', () => {
  it('should debounce function calls', () => {
    return new Promise(resolve => {
      let callCount = 0
      const debouncedFn = debounce(() => {
        callCount++
      }, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(callCount).toBe(0)

      setTimeout(() => {
        expect(callCount).toBe(1)
        resolve(undefined)
      }, 150)
    })
  })
})

describe('throttle', () => {
  it('should throttle function calls', () => {
    return new Promise(resolve => {
      let callCount = 0
      const throttledFn = throttle(() => {
        callCount++
      }, 100)

      throttledFn()
      throttledFn()
      throttledFn()

      expect(callCount).toBe(1)

      setTimeout(() => {
        throttledFn()
        expect(callCount).toBe(2)
        resolve(undefined)
      }, 150)
    })
  })
})

describe('clamp', () => {
  it('should clamp values within range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-5, 0, 10)).toBe(0)
    expect(clamp(15, 0, 10)).toBe(10)
  })

  it('should use default min/max values', () => {
    expect(clamp(0.5)).toBe(0.5)
    expect(clamp(-1)).toBe(0)
    expect(clamp(2)).toBe(1)
  })
})

describe('padEnd', () => {
  it('should pad string to specified length', () => {
    expect(padEnd('123', 5)).toBe('12300')
    expect(padEnd('abc', 5, 'x')).toBe('abcxx')
  })

  it('should not pad if string is already long enough', () => {
    expect(padEnd('12345', 3)).toBe('12345')
  })

  it('should handle empty string', () => {
    expect(padEnd('', 3)).toBe('000')
  })
})

describe('chunk', () => {
  it('should split string into chunks', () => {
    expect(chunk('hello', 2)).toEqual(['he', 'll', 'o'])
    expect(chunk('123456', 3)).toEqual(['123', '456'])
  })

  it('should use default chunk size of 1', () => {
    expect(chunk('hello')).toEqual(['h', 'e', 'l', 'l', 'o'])
  })

  it('should handle empty string', () => {
    expect(chunk('')).toEqual([])
  })
})

describe('camelizeObjectKeys', () => {
  it('should camelize object keys', () => {
    const obj = { 'kebab-case': 1, 'another-key': 2 }
    expect(camelizeObjectKeys(obj)).toEqual({
      kebabCase: 1,
      anotherKey: 2,
    })
  })

  it('should handle null/undefined', () => {
    expect(camelizeObjectKeys(null)).toEqual({})
    expect(camelizeObjectKeys(undefined)).toEqual({})
  })

  it('should handle empty object', () => {
    expect(camelizeObjectKeys({})).toEqual({})
  })
})

describe('mergeDeep', () => {
  it('should merge objects deeply', () => {
    const source = { a: 1, b: { c: 2 } }
    const target = { b: { d: 3 }, e: 4 }

    expect(mergeDeep(source, target)).toEqual({
      a: 1,
      b: { c: 2, d: 3 },
      e: 4,
    })
  })

  it('should handle empty objects', () => {
    expect(mergeDeep({}, {})).toEqual({})
    expect(mergeDeep({ a: 1 }, {})).toEqual({ a: 1 })
    expect(mergeDeep({}, { a: 1 })).toEqual({ a: 1 })
  })

  it('should override non-object values', () => {
    const source = { a: 1, b: 2 }
    const target = { a: 3, b: { c: 4 } }

    expect(mergeDeep(source, target)).toEqual({
      a: 3,
      b: { c: 4 },
    })
  })
})

describe('fillArray', () => {
  it('should fill array with specified value', () => {
    expect(fillArray(3, 'test')).toEqual(['test', 'test', 'test'])
    expect(fillArray(2, { a: 1 })).toEqual([{ a: 1 }, { a: 1 }])
  })

  it('should return empty array for length 0', () => {
    expect(fillArray(0, 'test')).toEqual([])
  })
})

describe('normalizeAttrs', () => {
  it('should normalize and sort attributes', () => {
    const attrs = { b: 2, a: 1, c: 3 }
    expect(normalizeAttrs(attrs)).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('should handle empty object', () => {
    expect(normalizeAttrs({})).toEqual({})
  })
})

describe('directiveConfig', () => {
  it('should merge binding with defaults', () => {
    const binding = {
      arg: 'test',
      modifiers: { modifier1: true },
      value: { prop: 'value' },
    }
    const defaults = { defaultProp: 'default' }

    const result = directiveConfig(binding, defaults)
    expect(result).toEqual({
      defaultProp: 'default',
      modifier1: true,
      value: 'test',
      prop: 'value',
    })
  })

  it('should work without defaults', () => {
    const binding = {
      arg: 'test',
      modifiers: { modifier1: true },
      value: { prop: 'value' },
    }

    const result = directiveConfig(binding)
    expect(result).toEqual({
      modifier1: true,
      value: 'test',
      prop: 'value',
    })
  })
})

describe('addOnceEventListener', () => {
  it('should add event listener that fires only once', () => {
    const element = document.createElement('div')
    let callCount = 0

    addOnceEventListener(element, 'click', () => {
      callCount++
    })

    element.click()
    element.click()
    element.click()

    expect(callCount).toBe(1)
  })
})

describe('addPassiveEventListener', () => {
  it('should add passive event listener', () => {
    const element = document.createElement('div')
    let callCount = 0

    addPassiveEventListener(element, 'click', () => {
      callCount++
    }, {})

    element.click()
    expect(callCount).toBe(1)
  })
})

describe('getZIndex', () => {
  it('should return 0 for null element', () => {
    expect(getZIndex(null)).toBe(0)
  })

  it('should return 0 for non-element node', () => {
    const textNode = document.createTextNode('test')
    expect(getZIndex(textNode as any)).toBe(0)
  })
})

describe('remapInternalIcon', () => {
  it('should return icon name when no component is configured', () => {
    const vm = {
      $vuetify: {
        icons: {
          component: null,
        },
      },
    } as any

    expect(remapInternalIcon(vm, 'test-icon')).toBe('test-icon')
  })

  it('should return icon object when component is configured', () => {
    const vm = {
      $vuetify: {
        icons: {
          component: 'TestComponent',
        },
      },
    } as any

    const result = remapInternalIcon(vm, 'test-icon')
    expect(result).toEqual({
      component: 'TestComponent',
      props: {
        icon: 'test-icon',
      },
    })
  })
})

describe('getSlot', () => {
  it('should get slot by name', () => {
    const vm = {
      $slots: {
        default: () => 'test content',
      },
    } as any

    expect(getSlot(vm, 'default')).toBe('test content')
  })

  it('should get slot by kebab case name', () => {
    const vm = {
      $slots: {
        'test-slot': () => 'test content',
      },
    } as any

    expect(getSlot(vm, 'testSlot')).toBe('test content')
  })

  it('should return undefined for non-existent slot', () => {
    const vm = {
      $slots: {},
    } as any

    expect(getSlot(vm, 'non-existent')).toBeUndefined()
  })
})

describe('composedPath', () => {
  it('should return composed path when available', () => {
    const mockEvent = {
      composedPath: () => ['element1', 'element2'],
    } as any

    expect(composedPath(mockEvent)).toEqual(['element1', 'element2'])
  })

  it('should build path when composedPath is not available', () => {
    const div = document.createElement('div')
    const span = document.createElement('span')
    div.appendChild(span)

    const mockEvent = {
      target: span,
      composedPath: undefined,
    } as any

    const path = composedPath(mockEvent)
    expect(path).toContain(span)
    expect(path).toContain(div)
  })
})

describe('createRange', () => {
  it('should create array with sequential numbers', () => {
    expect(createRange(3)).toEqual([0, 1, 2])
    expect(createRange(5)).toEqual([0, 1, 2, 3, 4])
  })

  it('should return empty array for length 0', () => {
    expect(createRange(0)).toEqual([])
  })
})

describe('filterObjectOnKeys', () => {
  it('should filter object by specified keys', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 }
    expect(filterObjectOnKeys(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })

  it('should handle keys that do not exist', () => {
    const obj = { a: 1, b: 2 }
    expect(filterObjectOnKeys(obj, ['a', 'c'])).toEqual({ a: 1 })
  })

  it('should return empty object for empty keys array', () => {
    const obj = { a: 1, b: 2 }
    expect(filterObjectOnKeys(obj, [])).toEqual({})
  })
})

describe('groupItems', () => {
  it('should group items by specified key', () => {
    const items = [
      { category: 'A', name: 'Item 1' },
      { category: 'A', name: 'Item 3' },
      { category: 'B', name: 'Item 2' },
    ]

    const result = groupItems(items, ['category'], [false])
    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('A')
    expect(result[0].items).toHaveLength(2)
    expect(result[1].name).toBe('B')
    expect(result[1].items).toHaveLength(1)
  })

  it('should handle null values in group key', () => {
    const items = [
      { category: 'A', name: 'Item 1' },
      { category: null, name: 'Item 2' },
    ]

    const result = groupItems(items, ['category'], [false])
    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('A')
    expect(result[1].name).toBe('')
  })
})

describe('getPrefixedScopedSlots', () => {
  it('should filter and transform scoped slots with prefix', () => {
    const slot1 = () => 'content1'
    const slot2 = () => 'content2'
    const otherSlot = () => 'content3'

    const scopedSlots = {
      'prefix-slot1': slot1,
      'prefix-slot2': slot2,
      'other-slot': otherSlot,
    }

    const result = getPrefixedScopedSlots('prefix-', scopedSlots)
    expect(Object.keys(result)).toEqual(['slot1', 'slot2'])
    expect(result.slot1).toBe(slot1)
    expect(result.slot2).toBe(slot2)
  })

  it('should return empty object when no slots match prefix', () => {
    const scopedSlots = {
      'other-slot1': () => 'content1',
      'other-slot2': () => 'content2',
    }

    const result = getPrefixedScopedSlots('prefix-', scopedSlots)
    expect(result).toEqual({})
  })
})
