/**
 * plugins/vuetify.js
 *
 * Vuetify documentation: https://vuetifyjs.com/
 */

// Imports
import { icons } from './icons'
import { createVuetify } from 'vuetify'

// Globals
import { IS_SERVER } from '@/util/globals'

export function createVuetifyInstance (store) {
  const vuetify = createVuetify({
    breakpoint: { mobileBreakpoint: 'md' },
    icons,
    theme: {
      defaultTheme: store?.state?.user?.theme?.dark ? 'dark' : 'light',
      themes: {
        light: {
          colors: {
            primary: '#1867C0',
            secondary: '#5CBBF6',
            tertiary: '#E57373',
            accent: '#005CAF',
          },
        },
        dark: {
          colors: {
            primary: '#1867C0',
            secondary: '#5CBBF6',
            tertiary: '#E57373',
            accent: '#005CAF',
          },
        },
      },
    },
    rtl: store?.state?.user?.rtl || false,
  })

  return vuetify
}
