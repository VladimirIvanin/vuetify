// Utilities
import { removed } from '../../util/console'
import { h, defineComponent, VNode, App, Comment } from 'vue'

interface Toggleable extends App {
  isActive?: boolean
}

/**
 * Bootable
 * @mixin
 *
 * Used to add lazy content functionality to components
 * Looks for change in "isActive" to automatically boot
 * Otherwise can be set manually
 */
/* @vue/component */
export default defineComponent({
  name: 'bootable',

  props: {
    eager: Boolean,
  },

  data: () => ({
    isBooted: false,
  }),

  computed: {
    hasContent (): boolean | undefined {
      return this.isBooted || this.eager || this.isActive
    },
  },

  watch: {
    isActive () {
      this.isBooted = true
    },
  },

  created () {
    /* istanbul ignore next */
    if ('lazy' in this.$attrs) {
      removed('lazy', this)
    }
  },

  methods: {
    showLazyContent (content?: () => VNode[]): VNode[] {
      return (this.hasContent && content) ? content() : [h(Comment)]
    },
  },
})
