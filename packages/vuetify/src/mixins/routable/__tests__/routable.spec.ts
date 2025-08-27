import Routable from '../'
import { mount, Wrapper } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'

describe('routable.ts', () => {
  let mountFunction: (options?: object) => Wrapper<any>
  let router: any

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/foo', component: { template: '<div>Foo</div>' } },
      ],
    })

    mountFunction = (options = {}) => {
      return mount({
        mixins: [Routable],
        props: {
          activeClass: {
            default: 'active',
          },
          exactActiveClass: {
            default: 'exact-active',
          },
        },
        template: '<div ref="link" :class="classes"></div>',
      }, {
        global: {
          plugins: [router],
        },
        ...options,
      })
    }
  })

  it('should have correct computed properties', async () => {
    const wrapper = mountFunction({
      props: {
        to: '/',
      },
    })

    expect(wrapper.vm.isLink).toBeTruthy() // isLink returns the 'to' value, which is truthy
    expect(wrapper.vm.isClickable).toBe(true)
  })

  it('should have correct classes computed property', async () => {
    const wrapper = mountFunction({
      props: {
        to: '/',
        activeClass: 'custom-active',
      },
    })

    expect(wrapper.vm.classes).toBeDefined()
  })

  it('should handle disabled state', async () => {
    const wrapper = mountFunction({
      props: {
        to: '/',
        disabled: true,
      },
    })

    expect(wrapper.vm.isClickable).toBe(false)
  })

  it('should handle notALink prop', async () => {
    const wrapper = mountFunction({
      props: {
        to: '/',
        notALink: true,
      },
    })

    expect(wrapper.vm.isClickable).toBe(false)
  })

  it('should handle href prop', async () => {
    const wrapper = mountFunction({
      props: {
        href: 'https://example.com',
      },
    })

    expect(wrapper.vm.isLink).toBe('https://example.com')
    expect(wrapper.vm.isClickable).toBe(true)
  })

  it('should handle link prop', async () => {
    const wrapper = mountFunction({
      props: {
        link: true,
      },
    })

    expect(wrapper.vm.isLink).toBe(true)
    expect(wrapper.vm.isClickable).toBe(true)
  })
})
