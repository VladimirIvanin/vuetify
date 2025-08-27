// Styles
import './VTextarea.sass'

// Extensions
import VTextField from '../VTextField/VTextField'

// Utilities
import mixins from '../../util/mixins'

// Types
import Vue from 'vue'
import { withDirectives, h } from 'vue'
import resize from '../../directives/resize'

interface options extends Vue {
  $refs: {
    input: HTMLTextAreaElement
  }
}

const baseMixins = mixins<options &
  InstanceType<typeof VTextField>
>(
  VTextField
)

/* @vue/component */
export default baseMixins.extend({
  name: 'v-textarea',

  props: {
    autoGrow: Boolean,
    noResize: Boolean,
    rowHeight: {
      type: [Number, String],
      default: 24,
      validator: (v: any) => !isNaN(parseFloat(v)),
    },
    rows: {
      type: [Number, String],
      default: 5,
      validator: (v: any) => !isNaN(parseInt(v, 10)),
    },
  },

  computed: {
    classes (): object {
      return {
        'v-textarea': true,
        'v-textarea--auto-grow': this.autoGrow,
        'v-textarea--no-resize': this.noResizeHandle,
        ...VTextField.computed.classes.call(this),
      }
    },
    noResizeHandle (): boolean {
      return this.noResize || this.autoGrow
    },
  },

  watch: {
    autoGrow (val: boolean) {
      this.$nextTick(() => {
        val
          ? this.calculateInputHeight()
          : this.$refs.input?.style.removeProperty('height')
      })
    },
    lazyValue () {
      this.autoGrow && this.$nextTick(this.calculateInputHeight)
    },
    rowHeight () {
      this.autoGrow && this.$nextTick(this.calculateInputHeight)
    },
  },

  mounted () {
    setTimeout(() => {
      this.autoGrow && this.calculateInputHeight()
    }, 0)
  },

  methods: {
    calculateInputHeight () {
      const input = this.$refs.input
      if (!input) return

      input.style.height = '0'
      const height = input.scrollHeight
      const minHeight = parseInt(this.rows, 10) * parseFloat(this.rowHeight)
      // This has to be done ASAP, waiting for Vue
      // to update the DOM causes ugly layout jumping
      input.style.height = Math.max(minHeight, height) + 'px'
    },
    getInputProps () {
      const listeners = Object.assign({}, this.listeners$)
      delete listeners.change

      const { class: _, style: __, ...inputAttrs } = this.$attrs

      return {
        ...inputAttrs,
        autofocus: this.autofocus,
        disabled: this.isDisabled,
        id: this.computedId,
        placeholder: this.persistentPlaceholder || this.isFocused || !this.hasLabel ? this.placeholder : undefined,
        readonly: this.isReadonly,
        onBlur: this.onBlur,
        onInput: this.onInput,
        onFocus: this.onFocus,
        onKeydown: this.onKeyDown,
        ...listeners,
        ref: 'input',
      }
    },
    genInput () {
      const props = this.getInputProps()

      const node = h('textarea', {
        ...props,
        rows: this.rows,
      }, this.lazyValue || '')

      return withDirectives(node, [
        [
          resize,
          this.onResize,
          '',
          { quiet: true },
        ],
      ])
    },
    onInput (e: Event) {
      VTextField.methods.onInput.call(this, e)
      this.autoGrow && this.calculateInputHeight()
    },
    onKeyDown (e: KeyboardEvent) {
      // Prevents closing of a
      // dialog when pressing
      // enter
      if (this.isFocused && e.keyCode === 13) {
        e.stopPropagation()
      }

      this.$emit('keydown', e)
    },
  },
})
