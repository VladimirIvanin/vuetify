import { FunctionalComponentOptions, VNode, VNodeData, Transition, TransitionGroup } from 'vue'
import mergeData from '../../util/mergeData'
import { getSlot } from '../../util/helpers'
import { h } from 'vue'

function mergeTransitions (
  dest: Function | Function[] = [],
  ...transitions: (Function | Function[])[]
) {
  /* eslint-disable-next-line no-array-constructor */
  return Array<Function>().concat(dest, ...transitions)
}

export function createSimpleTransition (
  name: string,
  origin = 'top center 0',
  mode?: string
): FunctionalComponentOptions {
  return {
    name,

    functional: true,

    props: {
      group: {
        type: Boolean,
        default: false,
      },
      hideOnLeave: {
        type: Boolean,
        default: false,
      },
      leaveAbsolute: {
        type: Boolean,
        default: false,
      },
      mode: {
        type: String,
        default: mode,
      },
      origin: {
        type: String,
        default: origin,
      },
    },

    render (): VNode {
      const tag = this.$props.group ? TransitionGroup : Transition

      const data: VNodeData = {
        name,
        mode: this.$props.mode,
        onBeforeEnter: (el: HTMLElement) => {
          el.style.transformOrigin = this.$props.origin
          el.style.webkitTransformOrigin = this.$props.origin
        }
      }

      if (this.$props.leaveAbsolute) {
        data.onLeave = mergeTransitions(data.onLeave, (el: HTMLElement) => {
          const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = el
          el._transitionInitialStyles = {
            position: el.style.position,
            top: el.style.top,
            left: el.style.left,
            width: el.style.width,
            height: el.style.height,
          }
          el.style.position = 'absolute'
          el.style.top = offsetTop + 'px'
          el.style.left = offsetLeft + 'px'
          el.style.width = offsetWidth + 'px'
          el.style.height = offsetHeight + 'px'
        })
        data.onAfterLeave = mergeTransitions(data.onAfterLeave, (el?: HTMLElement) => {
          if (el && el._transitionInitialStyles) {
            const { position, top, left, width, height } = el._transitionInitialStyles
            delete el._transitionInitialStyles
            el.style.position = position || ''
            el.style.top = top || ''
            el.style.left = left || ''
            el.style.width = width || ''
            el.style.height = height || ''
          }
        })
      }
      if (this.$props.hideOnLeave) {
        data.onLeave = mergeTransitions(data.onLeave, (el: HTMLElement) => {
          el.style.setProperty('display', 'none', 'important')
        })
      }
      return h(tag, mergeData(this.$attrs, data), {
        default: () => getSlot(this) || [],
      })
    },
  }
}

export function createJavascriptTransition (
  name: string,
  functions: Record<string, any>,
  mode = 'in-out'
): FunctionalComponentOptions {
  return {
    name,

    functional: true,

    props: {
      mode: {
        type: String,
        default: mode,
      },
    },

    render (): VNode {
      return h(
        Transition,
        mergeData(this.$attrs, {
          name,
          ...functions,
        }),
        {
          default: () => getSlot(this) || [],
        }
      )
    },
  }
}
