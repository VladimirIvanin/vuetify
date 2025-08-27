import './VIcon.sass'

// Mixins
import BindsAttrs from '../../mixins/binds-attrs'
import Colorable from '../../mixins/colorable'
import Sizeable from '../../mixins/sizeable'
import Themeable from '../../mixins/themeable'

// Util
import { convertToUnit, keys, remapInternalIcon, getSlot } from '../../util/helpers'

// Types
import { defineComponent, VNode, h } from 'vue'
import mixins from '../../util/mixins'
import { VuetifyIcon, VuetifyIconComponent } from 'vuetify/types/services/icons'
import { normalizeAttrs } from '../../util/helpers'

enum SIZE_MAP {
  xSmall = '12px',
  small = '16px',
  default = '24px',
  medium = '28px',
  large = '36px',
  xLarge = '40px'
}

function isFontAwesome5 (iconType: string): boolean {
  return ['fas', 'far', 'fal', 'fab', 'fad', 'fak'].some(val => iconType.includes(val))
}

function isSvgPath (icon: string): boolean {
  return (/^[mzlhvcsqta]\s*[-+.0-9][^mlhvzcsqta]+/i.test(icon) && /[\dz]$/i.test(icon) && icon.length > 4)
}


const VIcon = mixins(
  BindsAttrs,
  Colorable,
  Sizeable,
  Themeable
  /* @vue/component */
).extend({
  name: 'v-icon',

  props: {
    dense: Boolean,
    disabled: Boolean,
    left: Boolean,
    right: Boolean,
    size: [Number, String],
    tag: {
      type: String,
      required: false,
      default: 'i',
    },
  },

  computed: {
    medium () {
      return false
    },
    hasClickListener (): boolean {
      return Boolean(
        this.listeners$.onClick
      )
    },
  },

  methods: {
    getIcon (): VuetifyIcon {
      let iconName = ''
      const slotContent = getSlot(this, 'default')
      if (slotContent && slotContent.length > 0) {
        const firstSlot = slotContent[0]
        if (firstSlot && typeof firstSlot.children === 'string') {
          iconName = firstSlot.children.trim()
        }
      }
      return remapInternalIcon(this, iconName)
    },
    getSize (): string | undefined {
      const sizes = {
        xSmall: this.xSmall,
        small: this.small,
        medium: this.medium,
        large: this.large,
        xLarge: this.xLarge,
      }

      const explicitSize = keys(sizes).find(key => sizes[key])

      return (
        (explicitSize && SIZE_MAP[explicitSize]) || convertToUnit(this.size)
      )
    },
    // Component data for both font icon and SVG wrapper span
    getDefaultData (): Record<string, any> {
      const data: Record<string, any> = {
        class: {
          'v-icon--disabled': this.disabled,
          'v-icon--left': this.left,
          'v-icon--link': this.hasClickListener,
          'v-icon--right': this.right,
          'v-icon--dense': this.dense,
          'v-icon': true,
          'notranslate': true
        },
        'aria-hidden': !this.hasClickListener,
        type: this.hasClickListener ? 'button' : undefined,
        // ...this.attrs$,
        ...this.listeners$,
      }

      if(this.hasClickListener && this.disabled) {
        data.disabled = true
      }
      return data
    },
    getSvgWrapperData () {
      const fontSize = this.getSize()
      const wrapperData = {
        ...this.getDefaultData(),
        style: fontSize ? {
          fontSize,
          height: fontSize,
          width: fontSize,
        } : undefined,
      }
      this.applyColors(wrapperData)

      return wrapperData
    },
    applyColors (data: Record<string, any>): void {
      data.class = { ...data.class, ...this.themeClasses }
      this.setTextColor(this.color, data)
    },
    renderFontIcon (icon: string): VNode {
      const newChildren: any[] = []
      let data = this.getDefaultData()

      let iconType = 'material-icons'
      // Material Icon delimiter is _
      // https://material.io/icons/
      const delimiterIndex = icon.indexOf('-')
      const isMaterialIcon = delimiterIndex <= -1

      if (isMaterialIcon) {
        // Material icon uses ligatures.
        newChildren.push(icon)
      } else {
        iconType = icon.slice(0, delimiterIndex)
        if (isFontAwesome5(iconType)) iconType = ''
      }

      if(typeof data.class === 'string') {
        data.class = data.class.split(' ').reduce((classes: Record<string, any>, className: string) => {
          classes[className] = true
          return classes
        }, {})
      }

      data.class[iconType] = true
      data.class[icon] = !isMaterialIcon

      const fontSize = this.getSize()
      if (fontSize) data.style = { fontSize }

      this.applyColors(data)

      return h(this.hasClickListener ? 'button' : this.tag, normalizeAttrs(data), {default: () => newChildren})
    },
    renderSvgIcon (icon: string): VNode {
      const svgData: Record<string, any> = {
        class: 'v-icon__svg',
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        role: 'img',
        'aria-hidden': true,
      }

      const size = this.getSize()
      if (size) {
        svgData.style = {
          fontSize: size,
          height: size,
          width: size,
        }
      }

      return h(this.hasClickListener ? 'button' : 'span', this.getSvgWrapperData(), [
        h('svg', svgData, [
          h('path', {
            d: icon,
          }),
        ]),
      ])
    },
    renderSvgIconComponent (
      icon: VuetifyIconComponent
    ): VNode {
      const data: Record<string, any> = {
        class: {
          'v-icon__component': true,
        },
      }

      const size = this.getSize()
      if (size) {
        data.style = {
          fontSize: size,
          height: size,
          width: size,
        }
      }

      this.applyColors(data)

      const component = icon.component
      Object.assign(data, icon.props)
      data.nativeOn = data.on

      return h(this.hasClickListener ? 'button' : 'span', this.getSvgWrapperData(), {default: () =>[
        h(component, data),
      ]})
    },
  },

  render (): VNode {
    const icon = this.getIcon()

    if (typeof icon === 'string') {
      if (isSvgPath(icon)) {
        return this.renderSvgIcon(icon)
      }
      return this.renderFontIcon(icon)
    }

    return this.renderSvgIconComponent(icon)
  },
}) as any

export default defineComponent({
  name: 'v-icon',

  $_wrapperFor: VIcon,

  functional: true,

  render (): VNode {
    const data = { ...this.$attrs }


    // console.log(children && children[0]?.children)
    return h(VIcon, data, {
      default: () => {
        let iconName = ''

        // Support usage of v-text and v-html
        // if (data.domProps) {
        if(this.$.vnode.props?.textContent) {
          iconName = this.$.vnode.props.textContent  ||
          this.$.vnode.props.innerHTML ||
            iconName
        }

        const children = this.$slots.default?.()

        return iconName ? [iconName] : children && children[0]?.children
      }
    })
  }
})
