import './VGrid.sass'

import { defineComponent, VNode, PropType } from 'vue'
import mergeData from '../../util/mergeData'
import { upperFirst, getSlot } from '../../util/helpers'
import {h} from 'vue'
// no xs
const breakpoints = ['sm', 'md', 'lg', 'xl']

const breakpointProps = (() => {
  return breakpoints.reduce((props, val) => {
    props[val] = {
      type: [Boolean, String, Number] as PropType<boolean | string | number>,
      default: false,
    }
    return props
  }, {} as Dictionary<PropType<boolean | string | number>>)
})()

const offsetProps = (() => {
  return breakpoints.reduce((props, val) => {
    props['offset' + upperFirst(val)] = {
      type: [String, Number] as PropType<string | number>,
      default: null,
    }
    return props
  }, {} as Dictionary<PropType<string | number>>)
})()

const orderProps = (() => {
  return breakpoints.reduce((props, val) => {
    props['order' + upperFirst(val)] = {
      type: [String, Number] as PropType<string | number>,
      default: null,
    }
    return props
  }, {} as Dictionary<PropType<string | number>>)
})()

const propMap = {
  col: Object.keys(breakpointProps),
  offset: Object.keys(offsetProps),
  order: Object.keys(orderProps),
}

function breakpointClass (type: keyof typeof propMap, prop: string, val: boolean | string | number) {
  let className = type
  if (val == null || val === false) {
    return undefined
  }
  if (prop) {
    const breakpoint = prop.replace(type, '')
    className += `-${breakpoint}`
  }
  // Handling the boolean style prop when accepting [Boolean, String, Number]
  // means Vue will not convert <v-col sm></v-col> to sm: true for us.
  // Since the default is false, an empty string indicates the prop's presence.
  if (type === 'col' && (val === '' || val === true)) {
    // .col-md
    return className.toLowerCase()
  }
  // .order-md-6
  className += `-${val}`
  return className.toLowerCase()
}

const cache = new Map<string, any[]>()

export default defineComponent({
  name: 'v-col',
  inheritAttrs: false,
  props: {
    cols: {
      type: [Boolean, String, Number] as PropType<boolean | string | number>,
      default: false,
    },
    ...breakpointProps,
    offset: {
      type: [String, Number] as PropType<string | number>,
      default: null,
    },
    ...offsetProps,
    order: {
      type: [String, Number] as PropType<string | number>,
      default: null,
    },
    ...orderProps,
    alignSelf: {
      type: String as PropType<string>,
      default: null,
      validator: (str: any) => ['auto', 'start', 'end', 'center', 'baseline', 'stretch'].includes(str),
    },
    tag: {
      type: String as PropType<string>,
      default: 'div',
    },
  },
  render (): VNode {
    const props = this.$props
    const data = this.$attrs
    const children = getSlot(this) || []
    // const {parent} = getCurrentInstance()

    // Super-fast memoization based on props, 5x faster than JSON.stringify
    let cacheKey = ''
    for (const prop in props) {
      cacheKey += String((props as any)[prop])
    }
    let classList = cache.get(cacheKey)

    if (!classList) {
      classList = []
      // Loop through `col`, `offset`, `order` breakpoint props
      let type: keyof typeof propMap
      for (type in propMap) {
        propMap[type].forEach(prop => {
          const value: string | number | boolean = (props as any)[prop]
          const className = breakpointClass(type, prop, value)
          if (className) classList!.push(className)
        })
      }

      const hasColClasses = classList.some(className => className.startsWith('col-'))

      classList.push({
        // Default to .col if no other col-{bp}-* classes generated nor `cols` specified.
        col: !hasColClasses || !props.cols,
        [`col-${props.cols}`]: props.cols,
        [`offset-${props.offset}`]: props.offset,
        [`order-${props.order}`]: props.order,
        [`align-self-${props.alignSelf}`]: props.alignSelf,
      })

      cache.set(cacheKey, classList)
    }

    return h(props.tag, mergeData({ class: classList }, data), children)
  },
})
