import './_grid.sass'
import './VGrid.sass'

import mergeData from '../../util/mergeData'
import { defineComponent, h } from 'vue'

/* @vue/component */
export default defineComponent({
  name: 'v-container',
  props: {
    id: String,
    tag: {
      type: String,
      default: 'div',
    },
    fluid: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    extractUtilityClasses (attrs: Record<string, any>): string[] {
      return Object.keys(attrs).filter(key => {
        // TODO: Remove once resolved
        // https://github.com/vuejs/vue/issues/7841
        if (key === 'slot') return false

        const value = attrs[key]

        // Keep data attributes but don't add them as classes
        if (key.startsWith('data-')) {
          return false
        }

        return value || typeof value === 'string'
      })
    },

    filterDataAttributes (attrs: Record<string, any>): Record<string, any> {
      return Object.keys(attrs).reduce((filtered, key) => {
        if (key.startsWith('data-')) {
          filtered[key] = attrs[key]
        }
        return filtered
      }, {} as Record<string, any>)
    },

    generateClasses (utilityClasses: string[], fluid: boolean): any[] {
      return [
        {
          'container--fluid': fluid,
        },
        ...utilityClasses,
        'container',
      ]
    },

    prepareRenderData (attrs: Record<string, any>, props: any) {
      const utilityClasses = this.extractUtilityClasses(attrs)
      const filteredAttrs = this.filterDataAttributes(attrs)

      // Add id to attrs if provided
      if (props.id) {
        filteredAttrs.id = props.id
      }

      return {
        utilityClasses,
        filteredAttrs,
        classes: this.generateClasses(utilityClasses, props.fluid),
      }
    },
  },
  render () {
    const { utilityClasses, filteredAttrs, classes } = this.prepareRenderData(
      this.$attrs,
      this.$props,
    )

    const data = mergeData(filteredAttrs, {
      class: classes,
    })

    return h(
      this.$props.tag,
      data,
      this.$slots.default?.(),
    )
  },
})
