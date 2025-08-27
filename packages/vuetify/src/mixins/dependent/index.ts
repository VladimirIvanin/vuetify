import { defineComponent, nextTick } from 'vue'
import { VOverlay } from '../../components/VOverlay'

interface DependentOptions {
  $el: HTMLElement
  $refs: {
    content?: HTMLElement
  }
  overlay?: InstanceType<typeof VOverlay>
}

interface DependentInstance {
  isActive?: boolean
  isDependent?: boolean
  getClickableDependentElements?: () => HTMLElement[]
}

function searchChildren (children: any[]): DependentInstance[] {
  const results: DependentInstance[] = []

  for (let index = 0; index < children.length; index++) {
    const child = children[index] as DependentInstance

    if (child.isActive && child.isDependent) {
      results.push(child)
    } else if (
      child.component &&
      child.component.isActive &&
      child.component.isDependent
    ) {
      results.push(child.component)
    }
  }

  return results
}

/* @vue/component */
export default defineComponent({
  name: 'dependent',

  data () {
    return {
      closeDependents: true,
      isActive: false,
      isDependent: true,
    }
  },

  watch: {
    async isActive (val: boolean) {
      if (val) return

      await nextTick()
      const openDependents = this.getOpenDependents()
      for (let index = 0; index < openDependents.length; index++) {
        if (
          openDependents[index] &&
          typeof openDependents[index].isActive !== 'undefined'
        ) {
          openDependents[index].isActive = false
        }
      }
    },
  },

  methods: {
    getOpenDependents (): DependentInstance[] {
      if (!this.closeDependents) return []

      // Get all child components from slots
      const children: any[] = []

      if (this.$slots.default) {
        const slotContent = this.$slots.default()
        if (Array.isArray(slotContent)) {
          slotContent.forEach(item => {
            if (item.component) {
              children.push(item.component)
            }
          })
        }
      }

      return searchChildren(children)
    },

    getOpenDependentElements (): HTMLElement[] {
      const result: HTMLElement[] = []
      const openDependents = this.getOpenDependents()

      for (let index = 0; index < openDependents.length; index++) {
        const dependent = openDependents[index]
        if (dependent.getClickableDependentElements) {
          result.push(...dependent.getClickableDependentElements())
        }
      }

      return result
    },

    getClickableDependentElements (): HTMLElement[] {
      const result: HTMLElement[] = []

      if (this.$el) {
        result.push(this.$el as HTMLElement)
      }

      if (this.$refs?.content) {
        result.push(this.$refs.content as HTMLElement)
      }

      if ((this as any).overlay?.$el) {
        result.push((this as any).overlay.$el as HTMLElement)
      }

      result.push(...this.getOpenDependentElements())

      return result
    },
  },
})
