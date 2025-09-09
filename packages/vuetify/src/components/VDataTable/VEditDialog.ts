import { h } from 'vue'
// Styles
import './VEditDialog.sass'

// Mixins
import Returnable from '../../mixins/returnable'
import Themeable from '../../mixins/themeable'

// Utils
import { getSlot, keyCodes } from '../../util/helpers'

// Component
import VBtn from '../VBtn'
import VMenu from '../VMenu'

// Types
import { VNode, VNodeChildren } from 'vue'
import mixins from '../../util/mixins'

/* @vue/component */
export default mixins(Returnable, Themeable).extend({
  name: 'v-edit-dialog',

  props: {
    cancelText: {
      default: 'Cancel',
    },
    large: Boolean,
    eager: Boolean,
    persistent: Boolean,
    saveText: {
      default: 'Save',
    },
    transition: {
      type: String,
      default: 'slide-x-reverse-transition',
    },
  },

  emits: ['update:return-value', 'open', 'close', 'cancel', 'save'],

  data () {
    return {
      isActive: false,
    }
  },

  watch: {
    isActive (val) {
      if (val) {
        this.$emit('open')
        setTimeout(this.focus, 50) // Give DOM time to paint
      } else {
        this.$emit('close')
      }
    },
  },

  methods: {
    cancel () {
      this.isActive = false
      this.$emit('cancel')
      this.$emit('update:return-value', this.returnValue)
    },
    focus () {
      const input = (this.$refs.content as Element).querySelector('input')
      input && input.focus()
    },
    genButton (fn: Function, text: VNodeChildren): VNode {
      return h(VBtn, {
        text: true,
        color: 'primary',
        light: true,
        onClick: fn,
      }, () => text)
    },
    genActions (): VNode {
      return h('div', {
        class: 'v-small-dialog__actions',
      }, [
        this.genButton(this.cancel, this.cancelText),
        this.genButton(() => {
          this.save(this.returnValue)
          this.$emit('save')
          this.$emit('update:return-value', this.returnValue)
        }, this.saveText),
      ])
    },
    genContent (): VNode {
      return h('div', {
        class: 'v-small-dialog__content',
        onKeydown: (e: KeyboardEvent) => {
          e.keyCode === keyCodes.esc && this.cancel()
          if (e.keyCode === keyCodes.enter) {
            this.save(this.returnValue)
            this.$emit('save')
            this.$emit('update:return-value', this.returnValue)
          }
        },
        ref: 'content',
      }, getSlot(this, 'input'))
    },
  },

  render (): VNode {
    return h(VMenu, {
      class: ['v-small-dialog', this.themeClasses],
      contentClass: 'v-small-dialog__menu-content',
      transition: this.transition,
      origin: 'top right',
      right: true,
      value: this.isActive,
      closeOnClick: !this.persistent,
      closeOnContentClick: false,
      eager: this.eager,
      light: this.light,
      dark: this.dark,
      onInput: (val: boolean) => (this.isActive = val),
    }, {
      activator: ({ on }: { on: any }) => {
        return h('div', {
          class: 'v-small-dialog__activator',
          ...on,
        }, [
          h('span', {
            class: 'v-small-dialog__activator__content',
          }, getSlot(this)),
        ])
      },
      default: () => [
        this.genContent(),
        this.large ? this.genActions() : null,
      ],
    })
  },
})
