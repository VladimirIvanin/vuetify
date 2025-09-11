// Styles
import "../../../src/components/VInput/VInput.sass"; // Components

import VIcon from '../VIcon';
import VLabel from '../VLabel';
import VMessages from '../VMessages'; // Mixins

import BindsAttrs from '../../mixins/binds-attrs';
import Validatable from '../../mixins/validatable'; // Utilities

import { convertToUnit, getSlot, kebabCase, normalizeClasses } from '../../util/helpers';
import mergeData from '../../util/mergeData';
import { breaking } from '../../util/console'; // Types

import { h } from 'vue';
import mixins from '../../util/mixins';
const baseMixins = mixins(BindsAttrs, Validatable);
/* @vue/component */

export default baseMixins.extend({
  name: 'v-input',
  inheritAttrs: false,
  props: {
    appendIcon: String,
    backgroundColor: {
      type: String,
      default: ''
    },
    dense: Boolean,
    height: [Number, String],
    hideDetails: [Boolean, String],
    hideSpinButtons: Boolean,
    hint: String,
    id: String,
    label: String,
    loading: Boolean,
    persistentHint: Boolean,
    prependIcon: String,
    modelValue: null
  },
  emits: ['click', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'update:error'],

  data() {
    return {
      lazyValue: this.modelValue,
      hasMouseDown: false
    };
  },

  computed: {
    classes() {
      return {
        'v-input--has-state': this.hasState,
        'v-input--hide-details': !this.showDetails,
        'v-input--is-label-active': this.isLabelActive,
        'v-input--is-dirty': this.isDirty,
        'v-input--is-disabled': this.isDisabled,
        'v-input--is-focused': this.isFocused,
        // <v-switch loading>.loading === '' so we can't just cast to boolean
        'v-input--is-loading': this.loading !== false && this.loading != null,
        'v-input--is-readonly': this.isReadonly,
        'v-input--dense': this.dense,
        'v-input--hide-spin-buttons': this.hideSpinButtons,
        ...this.themeClasses
      };
    },

    computedId() {
      return this.id || `input-${this.$.uid}`;
    },

    hasDetails() {
      return this.messagesToDisplay.length > 0;
    },

    hasHint() {
      return !this.hasMessages && !!this.hint && (this.persistentHint || this.isFocused);
    },

    hasLabel() {
      return !!(this.$slots.label || this.label);
    },

    // Proxy for `lazyValue`
    // This allows an input
    // to function without
    // a provided model
    internalValue: {
      get() {
        return this.lazyValue;
      },

      set(val) {
        this.lazyValue = val;
        this.$emit(this.$_modelEvent, val);

        if ('$_emitChangeEvent' in this) {
          this.$emit('change', val);
        }
      }

    },

    isDirty() {
      return !!this.lazyValue;
    },

    isLabelActive() {
      return this.isDirty;
    },

    messagesToDisplay() {
      if (this.hasHint) return [this.hint];
      if (!this.hasMessages) return [];
      return this.validations.map(validation => {
        if (typeof validation === 'string') return validation;
        const validationResult = validation(this.internalValue);
        return typeof validationResult === 'string' ? validationResult : '';
      }).filter(message => message !== '');
    },

    showDetails() {
      return this.hideDetails === false || this.hideDetails === 'auto' && this.hasDetails;
    }

  },
  watch: {
    modelValue(val) {
      this.lazyValue = val;
    }

  },

  created() {
    const breakingProps = [['value', 'modelValue'], ['onInput', 'onUpdate:modelValue']];
    /* istanbul ignore next */

    breakingProps.forEach(([original, replacement]) => {
      if (this.$attrs.hasOwnProperty(original)) breaking(original, replacement, this);
    });
  },

  beforeCreate() {
    // v-radio-group needs to emit a different event
    // https://github.com/vuetifyjs/vuetify/issues/4752
    this.$_modelEvent =
    /*(this.$options.model && this.$options.model.event) ||*/
    'update:modelValue';
  },

  methods: {
    genContent() {
      return [this.genPrependSlot(), this.genControl(), this.genAppendSlot()];
    },

    genControl() {
      return h('div', {
        class: 'v-input__control',
        title: this.attrs$.title
      }, [this.genInputSlot(), this.genMessages()]);
    },

    genDefaultSlot() {
      return [this.genLabel(), getSlot(this)];
    },

    genIcon(type, cb, extraData = {}) {
      var _a;

      const icon = this[`${type}Icon`];
      const eventName = `click:${kebabCase(type)}`;
      const hasListener = !!(this.listeners$[eventName] || cb);
      const localeKey = {
        prepend: 'prependAction',
        prependInner: 'prependAction',
        append: 'appendAction',
        appendOuter: 'appendAction',
        clear: 'clear'
      }[type];
      const label = hasListener && localeKey ? this.$vuetify.lang.t(`$vuetify.input.${localeKey}`, (_a = this.label) !== null && _a !== void 0 ? _a : '') : undefined;
      const data = mergeData({
        'aria-label': label,
        color: this.validationState,
        dark: this.dark,
        disabled: this.isDisabled,
        light: this.light,
        tabindex: type === 'clear' ? -1 : undefined,
        ...(!hasListener ? {} : {
          onClick: e => {
            e.preventDefault();
            e.stopPropagation();
            this.$emit(eventName, e);
            cb && cb(e);
          },
          // Container has g event that will
          // trigger menu open if enclosed
          onMouseup: e => {
            e.preventDefault();
            e.stopPropagation();
          }
        })
      }, extraData);
      return h('div', {
        class: {
          'v-input__icon': true,
          [`v-input__icon--${kebabCase(type)}`]: type
        }
      }, [h(VIcon, data, () => icon)]);
    },

    genInputSlot() {
      return h('div', this.setBackgroundColor(this.backgroundColor, {
        class: {
          'v-input__slot': true
        },
        style: {
          height: convertToUnit(this.height)
        },
        onClick: this.onClick,
        onMousedown: this.onMouseDown,
        onMouseup: this.onMouseUp,
        ref: 'input-slot'
      }), [this.genDefaultSlot()]);
    },

    genLabel() {
      if (!this.hasLabel) return null;
      return h(VLabel, {
        color: this.validationState,
        dark: this.dark,
        disabled: this.isDisabled,
        focused: this.hasState,
        for: this.computedId,
        light: this.light
      }, () => getSlot(this, 'label') || this.label);
    },

    genMessages() {
      if (!this.showDetails) return null;
      return h(VMessages, {
        color: this.hasHint ? '' : this.validationState,
        dark: this.dark,
        light: this.light,
        modelValue: this.messagesToDisplay,
        role: this.hasMessages ? 'alert' : null
      }, {
        default: getSlot(this, 'message')
      });
    },

    genSlot(type, location, slot) {
      if (!slot.length) return null;
      const ref = `${type}-${location}`;
      slot = slot.map(child => child instanceof Function ? child() : child);
      return h('div', {
        class: `v-input__${ref}`,
        ref
      }, slot);
    },

    genPrependSlot() {
      const slot = [];

      if (this.$slots.prepend) {
        slot.push(this.$slots.prepend);
      } else if (this.prependIcon) {
        slot.push(this.genIcon('prepend'));
      }

      return this.genSlot('prepend', 'outer', slot);
    },

    genAppendSlot() {
      const slot = []; // Append icon for text field was really
      // an appended inner icon, v-text-field
      // will overwrite this method in order to obtain
      // backwards compat

      if (this.$slots.append) {
        slot.push(this.$slots.append);
      } else if (this.appendIcon) {
        slot.push(this.genIcon('append'));
      }

      return this.genSlot('append', 'outer', slot);
    },

    onClick(e) {
      this.$emit('click', e);
    },

    onMouseDown(e) {
      this.hasMouseDown = true;
      this.$emit('mousedown', e);
    },

    onMouseUp(e) {
      this.hasMouseDown = false;
      this.$emit('mouseup', e);
    }

  },

  render() {
    const {
      class: additionalClasses,
      ...restAttrs
    } = this.$attrs;
    return h('div', this.setTextColor(this.validationState, {
      class: {
        'v-input': true,
        ...this.classes,
        ...normalizeClasses(additionalClasses)
      },
      ...restAttrs
    }), {
      default: () => this.genContent()
    });
  }

});
//# sourceMappingURL=VInput.js.map