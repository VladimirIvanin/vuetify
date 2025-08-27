// Mixins
import Delayable from '../delayable'
import Toggleable from '../toggleable'

// Utilities
import mixins from '../../util/mixins'
import { getSlot } from '../../util/helpers'
import { consoleError } from '../../util/console'

// Types
import { VNode, PropType } from 'vue'

type Listeners = Dictionary<(e: MouseEvent & KeyboardEvent & FocusEvent) => void>

const baseMixins = mixins(
  Delayable,
  Toggleable
)

/* @vue/component */
export default baseMixins.extend({
  name: 'activatable',

  props: {
    activator: {
      default: null as unknown as PropType<string | HTMLElement | VNode | Element | null>,
      validator: (val: string | object) => {
        return ['string', 'object'].includes(typeof val)
      },
    },
    disabled: Boolean,
    internalActivator: Boolean,
    openOnClick: {
      type: Boolean,
      default: true,
    },
    openOnHover: Boolean,
    openOnFocus: Boolean,
  },

  data: () => ({
    // Do not use this directly, call getActivator() instead
    activatorElement: null as HTMLElement | null,
    activatorNode: [] as VNode[],
    events: ['click', 'mouseenter', 'mouseleave', 'focus'],
    listeners: {} as Listeners,
  }),

  watch: {
    activator: 'resetActivator',
    openOnFocus: 'resetActivator',
    openOnHover: 'resetActivator',
  },

  mounted () {
    this.addActivatorEvents()
  },

  beforeUnmount () {
    this.removeActivatorEvents()
  },

  computed: {
    isActivatable() {
      return true
    }
  },

  methods: {
    addActivatorEvents () {
      if (
        !this.activator ||
        this.disabled ||
        !this.getActivator()
      ) return

      this.listeners = this.genActivatorListeners()
      const keys = Object.keys(this.listeners)

      for (const key of keys) {
        let eventName = 'click'
        if (key === 'onClick') eventName = 'click'
        else if (key === 'onMouseenter') eventName = 'mouseenter'
        else if (key === 'onMouseleave') eventName = 'mouseleave'
        else if (key === 'onFocus') eventName = 'focus'

        this.getActivator()!.addEventListener(eventName, this.listeners[key] as any)
      }
    },
    genActivator () {
      let node = getSlot(this, 'activator', Object.assign(this.getValueProxy(), {
        attrs: {
          ...this.genActivatorListeners(),
          ...this.genActivatorAttributes(),
        }
      })) || []

      node = Array.isArray(node) ? node : [node]

      this.activatorNode = node.flatMap(node => {
        return node.type === Symbol.for('v-fgt') ? node.children : node
      })

      return node
    },
    genActivatorAttributes () {
      return {
        role: (this.openOnClick && !this.openOnHover) ? 'button' : undefined,
        'aria-haspopup': true,
        'aria-expanded': String(this.isActive),
      }
    },
    genActivatorListeners () {
      if (this.disabled) return {}

      const listeners: Listeners = {}

      if (this.openOnHover) {
        listeners.onMouseenter = (e: MouseEvent) => {
          this.getActivator(e)
          this.runDelay('open')
        }
        listeners.onMouseleave = (e: MouseEvent) => {
          this.getActivator(e)
          this.runDelay('close')
        }
      } else if (this.openOnClick) {
        listeners.onClick = (e: MouseEvent) => {
          const activator = this.getActivator(e)
          if (activator) activator.focus()

          e.stopPropagation()

          this.isActive = !this.isActive
        }
      }

      if (this.openOnFocus) {
        listeners.onFocus = (e: FocusEvent) => {
          this.getActivator(e)

          e.stopPropagation()

          this.isActive = !this.isActive
        }
      }

      return listeners
    },
    getActivator (e?: Event): HTMLElement | null {
      // If we've already fetched the activator, re-use
      if (this.activatorElement) return this.activatorElement

      let activator = null

      if (this.activator) {
        // In Vue 3, we need to handle $el differently
        const target = this.internalActivator ? (this.$el || document) : document

        if (typeof this.activator === 'string') {
          // Selector
          activator = target.querySelector(this.activator)
        } else if ((this.activator as any).$el) {
          // Component (ref)
          activator = (this.activator as any).$el
        } else {
          // HTMLElement | Element
          activator = this.activator
        }
      } else if (this.activatorNode.length === 1 || (this.activatorNode.length && !e)) {

        // Use the contents of the activator slot
        // There's either only one element in it or we
        // don't have a click event to use as a last resort
        const vm = this.activatorNode[0].component?.ctx
        if (
          vm &&
          (vm.isActivatable !== undefined || vm.isMenuable !== undefined)
        ) {
          // Activator is actually another activatible component, use its activator (#8846)
          activator = (vm as any).getActivator()
        } else {
          activator = this.activatorNode[0].el as HTMLElement
        }
      } else if (e) {
        // Activated by a click or focus event
        activator = (e.currentTarget || e.target) as HTMLElement
      }

      // The activator should only be a valid element (Ignore comments and text nodes)
      this.activatorElement = activator?.nodeType === Node.ELEMENT_NODE ? activator : null

      return this.activatorElement
    },
    getContentSlot () {
      return getSlot(this, 'default', this.getValueProxy(), true)
    },
    getValueProxy (): object {
      const self = this
      return {
        get value () {
          return self.isActive
        },
        set value (isActive: boolean) {
          self.isActive = isActive
        },
      }
    },
    removeActivatorEvents () {
      if (
        !this.activator ||
        !this.activatorElement
      ) return

      const keys = Object.keys(this.listeners)

      for (const key of keys) {
        // Convert 'onClick' to 'click' for removeEventListener
        let eventName = 'click' // default
        if (key === 'onClick') eventName = 'click'
        else if (key === 'onMouseenter') eventName = 'mouseenter'
        else if (key === 'onMouseleave') eventName = 'mouseleave'
        else if (key === 'onFocus') eventName = 'focus'

        (this.activatorElement as any).removeEventListener(eventName, this.listeners[key])
      }

      this.listeners = {}
    },
    resetActivator () {
      this.removeActivatorEvents()
      this.activatorElement = null
      this.getActivator()
      this.addActivatorEvents()
    }
  },
})
