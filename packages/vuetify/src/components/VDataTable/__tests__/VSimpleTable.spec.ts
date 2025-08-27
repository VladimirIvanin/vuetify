import VSimpleTable from '../VSimpleTable'
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import { h } from 'vue'

describe('VSimpleTable.ts', () => {
  type Instance = InstanceType<typeof VSimpleTable>
  let mountFunction: (options?: any) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VSimpleTable, {
        global: {
          config: {
            warnHandler: () => {}, // Подавляем предупреждения Vue
          },
        },
        ...options,
      })
    }
  })

  it('should render', () => {
    const wrapper = mountFunction({
      slots: {
        default: () => [
          h('tr', [h('th', 'Foo'), h('th', 'Bar')]),
          h('tr', [h('td', 'baz'), h('td', 'qux')]),
        ],
      },
    })

    expect(wrapper.findAll('.v-data-table')).toHaveLength(1)
    expect(wrapper.findAll('.v-data-table .v-data-table__wrapper')).toHaveLength(1)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render with custom wrapper', () => {
    const wrapper = mountFunction({
      slots: {
        default: () => [
          h('tr', [h('th', 'Foo'), h('th', 'Bar')]),
          h('tr', [h('td', 'baz'), h('td', 'qux')]),
        ],
        wrapper: () => h('div', {
          class: 'custom-wrapper',
          'data-test': 'custom-wrapper'
        }, [
          h('table', { class: 'custom-table' }, [
            h('tr', [h('th', 'Custom Header 1'), h('th', 'Custom Header 2')]),
            h('tr', [h('td', 'Custom Data 1'), h('td', 'Custom Data 2')]),
          ])
        ])
      },
    })


    // Проверяем, что дефолтный wrapper не используется
    expect(wrapper.findAll('.v-data-table__wrapper')).toHaveLength(0)

    // Проверяем, что кастомный wrapper присутствует
    expect(wrapper.findAll('[data-test="custom-wrapper"]')).toHaveLength(1)
    expect(wrapper.findAll('.custom-wrapper')).toHaveLength(1)
    expect(wrapper.findAll('.custom-table')).toHaveLength(1)

    // Проверяем содержимое кастомного wrapper
    expect(wrapper.find('.custom-wrapper').text()).toContain('Custom Header 1')
    expect(wrapper.find('.custom-wrapper').text()).toContain('Custom Data 1')

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render with top & bottom slots', () => {
    const wrapper = mountFunction({
      slots: {
        top: () => h('div', { class: 'top' }, 'Header'),
        bottom: () => h('div', { class: 'bottom' }, 'Footer'),
      },
    })

    expect(wrapper.findAll('.top')).toHaveLength(1)
    expect(wrapper.findAll('.bottom')).toHaveLength(1)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render with custom height', () => {
    const wrapper = mountFunction({
      slots: {
        default: () => [
          h('tr', [h('th', 'Foo'), h('th', 'Bar')]),
          h('tr', [h('td', 'baz'), h('td', 'qux')]),
        ],
      },
      props: {
        height: 1000,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should compute classes', async () => {
    const wrapper = mountFunction()

    await wrapper.setProps({
      dense: true,
    })
    expect(wrapper.vm.classes).toMatchObject({
      'v-data-table--dense': true,
    })
    await wrapper.setProps({
      dark: true,
    })
    expect(wrapper.vm.classes).toMatchObject({
      'theme--dark': true,
      'theme--light': false,
    })
    await wrapper.setProps({
      fixedHeader: true,
    })
    expect(wrapper.vm.classes).toMatchObject({
      'v-data-table--fixed-header': true,
    })
    await wrapper.setProps({
      fixedHeader: false,
      height: 1000,
    })
    expect(wrapper.vm.classes).toMatchObject({
      'v-data-table--fixed-height': true,
    })
  })

  it('should compute classes with top & bottom slots', () => {
    const wrapper = mountFunction({
      slots: {
        top: () => h('div', { class: 'top' }, 'Header'),
        bottom: () => h('div', { class: 'bottom' }, 'Footer'),
      },
    })

    expect(wrapper.vm.classes).toMatchObject({
      'v-data-table--has-top': true,
      'v-data-table--has-bottom': true,
    })
  })
})
