// Utilities
import {
  classToHex,
  isCssColor,
  parseGradient,
} from '../../util/colorUtils'
import colors from '../../util/colors'

// Types
import { VuetifyThemeVariant } from 'types/services/theme'
import { VNode, VNodeDirective, ObjectDirective } from 'vue'

interface BorderModifiers {
  top?: Boolean
  right?: Boolean
  bottom?: Boolean
  left?: Boolean
}

function setTextColor (
  el: HTMLElement,
  color: string,
  currentTheme: Partial<VuetifyThemeVariant>,
) {
  const cssColor = !isCssColor(color) ? classToHex(color, colors, currentTheme) : color

  el.style.color = cssColor
  el.style.caretColor = cssColor
}

function setBackgroundColor (
  el: HTMLElement,
  color: string,
  currentTheme: Partial<VuetifyThemeVariant>,
) {
  const cssColor = !isCssColor(color) ? classToHex(color, colors, currentTheme) : color

  el.style.backgroundColor = cssColor
  el.style.borderColor = cssColor
}

function setBorderColor (
  el: HTMLElement,
  color: string,
  currentTheme: Partial<VuetifyThemeVariant>,
  modifiers?: BorderModifiers,
) {
  const cssColor = !isCssColor(color) ? classToHex(color, colors, currentTheme) : color

  if (!modifiers || !Object.keys(modifiers).length) {
    el.style.borderColor = cssColor
    return
  }

  if (modifiers.top) el.style.borderTopColor = cssColor
  if (modifiers.right) el.style.borderRightColor = cssColor
  if (modifiers.bottom) el.style.borderBottomColor = cssColor
  if (modifiers.left) el.style.borderLeftColor = cssColor
}

function setGradientColor (
  el: HTMLElement,
  gradient: string,
  currentTheme: Partial<VuetifyThemeVariant>,
) {
  el.style.backgroundImage = `linear-gradient(${
    parseGradient(gradient, colors, currentTheme)
  })`
}

function updateColor (
  el: HTMLElement,
  binding: VNodeDirective,
  vnode: VNode
) {
  let currentTheme = vnode.ctx?.$vuetify?.theme?.currentTheme

  if (!currentTheme && binding.instance) {
    currentTheme = (binding.instance as any).$vuetify?.theme?.currentTheme
  }

  if (!currentTheme) return

  if (binding.arg === undefined) {
    setBackgroundColor(el, binding.value, currentTheme)
  } else if (binding.arg === 'text') {
    setTextColor(el, binding.value, currentTheme)
  } else if (binding.arg === 'border') {
    setBorderColor(el, binding.value, currentTheme, binding.modifiers)
  } else if (binding.arg === 'gradient') {
    setGradientColor(el, binding.value, currentTheme)
  }
}

function updated (
  el: HTMLElement,
  binding: VNodeDirective,
  vnode: VNode
) {
  if (binding.value === binding.oldValue) return

  updateColor(el, binding, vnode)
}

export const Color: ObjectDirective = {
  mounted: updateColor,
  updated,
}

export default Color
