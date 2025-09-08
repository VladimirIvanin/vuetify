// Styles
import './VCheckbox.sass'
import '../../styles/components/_selection-controls.sass'

// Components
import VIcon from '../VIcon'
import VInput from '../VInput'

// Mixins
import Selectable from '../../mixins/selectable'
import { defineComponent, h } from 'vue'

/* @vue/component */
export default defineComponent({
  name: 'v-checkbox',
  extends: Selectable,

  props: {
    indeterminate: Boolean,
    indeterminateIcon: {
      type: String,
      default: '$checkboxIndeterminate',
    },
    offIcon: {
      type: String,
      default: '$checkboxOff',
    },
    onIcon: {
      type: String,
      default: '$checkboxOn',
    },
  },

  emits: ['click', 'focus', 'blur', 'update:indeterminate'],

  data () {
    return {
      inputIndeterminate: this.indeterminate,
    }
  },

  computed: {
    classes (): object {
      return {
        ...VInput.computed.classes.call(this),
        'v-input--selection-controls': true,
        'v-input--checkbox': true,
        'v-input--indeterminate': this.inputIndeterminate,
      }
    },
    computedIcon (): string {
      if (this.inputIndeterminate) {
        return this.indeterminateIcon
      } else if (this.isActive) {
        return this.onIcon
      } else {
        return this.offIcon
      }
    },
    // Do not return undefined if disabled,
    // according to spec, should still show
    // a color when disabled and active
    validationState (): string | undefined {
      if (this.isDisabled && !this.inputIndeterminate) return undefined
      if (this.hasError && this.shouldValidate) return 'error'
      if (this.hasSuccess) return 'success'
      if (this.hasColor !== null) return this.computedColor
      return undefined
    },
  },

  watch: {
    indeterminate (val) {
      // https://github.com/vuetifyjs/vuetify/issues/8270
      this.$nextTick(() => (this.inputIndeterminate = val))
    },
    inputIndeterminate (val) {
      this.$emit('update:indeterminate', val)
    },
    isActive () {
      if (!this.indeterminate) return
      this.inputIndeterminate = false
    },
  },

  methods: {
    genCheckbox () {
      const { title, ...checkboxAttrs } = this.attrs$
      return h('div', {
        class: 'v-input--selection-controls__input',
      }, [
        h(VIcon, this.setTextColor(this.validationState, {
          dense: this.dense,
          dark: this.dark,
          light: this.light
        }), () => this.computedIcon),
        this.genInput('checkbox', {
          ...checkboxAttrs,
          'aria-checked': this.inputIndeterminate
            ? 'mixed'
            : this.isActive.toString(),
        }),
        this.genRipple(this.setTextColor(this.rippleState)),
      ])
    },
    genDefaultSlot () {
      return [
        this.genCheckbox(),
        this.genLabel(),
      ]
    },
  },
})
