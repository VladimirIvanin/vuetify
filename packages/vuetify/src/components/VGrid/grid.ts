// Types
import { defineComponent, VNode, h } from 'vue'
import { getSlot } from '../../util/helpers'

export default function VGrid (name: string) {
  /* @vue/component */
  return defineComponent({
    name: `v-${name}`,

    props: {
      id: String,
      tag: {
        type: String,
        default: 'div',
      },
    },

    methods: {
      processClassesAndAttributes (data: any, baseClassName: string) {
        const classes = [baseClassName]
        const filteredData = { ...data }

        if (data.attrs) {
          const utilityClasses = this.extractUtilityClasses(data.attrs)
          classes.push(...utilityClasses)

          filteredData.attrs = this.filterDataAttributes(data.attrs)
        }

        return { classes, filteredData }
      },

      extractUtilityClasses (attrs: Record<string, any>): string[] {
        return Object.keys(attrs).filter(key => {
          // TODO: Remove once resolved
          // https://github.com/vuejs/vue/issues/7841
          if (key === 'slot') return false

          const value = attrs[key]

          if (key.startsWith('data-')) {
            return false
          }

          return value || typeof value === 'string'
        })
      },

      filterDataAttributes (attrs: Record<string, any>): Record<string, any> {
        const filteredAttrs: Record<string, any> = {}

        Object.keys(attrs).forEach(key => {
          if (key.startsWith('data-')) {
            filteredAttrs[key] = attrs[key]
          }
        })

        return filteredAttrs
      },

      processId (props: any, data: any) {
        if (props.id) {
          if (!data.domProps) {
            data.domProps = {}
          }
          (data.domProps as Record<string, any>).id = props.id
        }
      },
    },

    render (): VNode {
      const data = { ...this.$attrs }
      const children = getSlot(this) || []
      const props = this.$props

      const { classes, filteredData } = this.processClassesAndAttributes(data, name)

      filteredData.class = classes.join(' ')

      this.processId(props, filteredData)

      return h(props.tag, filteredData, children)
    },
  })
}
