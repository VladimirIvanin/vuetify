import Routable from '../'
import { mount, Wrapper } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { VNode, withDirectives, h } from 'vue'

describe('routable.ts', () => {
  let mountFunction: (options?: object) => Wrapper<any>
  let router: any

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [],
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
        render (h): VNode {
          const { tag, data, directives } = this.generateRouteLink()

          data.attrs = {
            ...data.attrs,
          }
          data.on = {
            ...data.on,
          }

          return withDirectives(
            h(tag, data, this.$slots.default),
            directives
          )
        },
      }, {
        global: {
          plugins: [router],
        },
        ...options,
      })
    }
  })
  it('should generate exact route link with to="/" and undefined exact', async () => {
    const wrapper = mountFunction({
      props: {
        to: '/',
      },
    })

    expect(wrapper.vm.generateRouteLink().data.props.exact).toBe(true)
  })

  it('should reflect the link state to isActive', async () => {
    const wrapper = mountFunction({
      props: {
        to: '/',
      },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isActive).toBe(true)

    // Simulate route changing
    await router.push('/foo')

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isActive).toBe(false)

    await router.push('/')
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isActive).toBe(true)
  })

  it('should reflect the link state to isActive if not exact', async () => {
    const wrapper = mountFunction({
      props: {
        to: '/foo',
      },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isActive).toBe(false)

    // Simulate route changing
    await router.push('/foo')

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isActive).toBe(true)
  })
})
