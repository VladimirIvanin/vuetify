import { h, withDirectives } from 'vue';
import "../../../src/components/VProgressLinear/VProgressLinear.sass"; // Components

import { VFadeTransition, VSlideXTransition } from '../transitions'; // Directives

import { Intersect } from '../../directives/intersect'; // Mixins

import Colorable from '../../mixins/colorable';
import { factory as PositionableFactory } from '../../mixins/positionable';
import { factory as ProxyableFactory } from '../../mixins/proxyable';
import Themeable from '../../mixins/themeable'; // Utilities

import { convertToUnit, getSlot } from '../../util/helpers';
import mixins from '../../util/mixins';
const baseMixins = mixins(Colorable, PositionableFactory(['absolute', 'fixed', 'top', 'bottom']), ProxyableFactory('modelValue', 'update:modelValue'), Themeable);
/* @vue/component */

export default baseMixins.extend({
  name: 'v-progress-linear',
  props: {
    active: {
      type: Boolean,
      default: true
    },
    backgroundColor: {
      type: String,
      default: null
    },
    backgroundOpacity: {
      type: [Number, String],
      default: null
    },
    bufferValue: {
      type: [Number, String],
      default: 100
    },
    color: {
      type: String,
      default: 'primary'
    },
    height: {
      type: [Number, String],
      default: 4
    },
    indeterminate: Boolean,
    modelValue: {
      type: [Number, String],
      default: 0
    },
    query: Boolean,
    reverse: Boolean,
    rounded: Boolean,
    stream: Boolean,
    striped: Boolean,
    // Оставляем value для обратной совместимости
    value: {
      type: [Number, String],
      default: 0
    }
  },
  emits: ['update:modelValue', 'click'],

  data() {
    return {
      internalLazyValue: this.modelValue || this.value || 0,
      isVisible: true
    };
  },

  computed: {
    __cachedBackground() {
      return h('div', this.setBackgroundColor(this.backgroundColor || this.color, {
        class: 'v-progress-linear__background',
        style: this.backgroundStyle
      }));
    },

    __cachedBar() {
      return h(this.computedTransition, {}, {
        default: () => [this.__cachedBarType]
      });
    },

    __cachedBarType() {
      return this.indeterminate ? this.__cachedIndeterminate : this.__cachedDeterminate;
    },

    __cachedBuffer() {
      return h('div', {
        class: 'v-progress-linear__buffer',
        style: this.styles
      });
    },

    __cachedDeterminate() {
      return h('div', this.setBackgroundColor(this.color, {
        class: `v-progress-linear__determinate`,
        style: {
          width: convertToUnit(this.normalizedValue, '%')
        }
      }));
    },

    __cachedIndeterminate() {
      return h('div', {
        class: ['v-progress-linear__indeterminate', {
          'v-progress-linear__indeterminate--active': this.active
        }]
      }, [this.genProgressBar('long'), this.genProgressBar('short')]);
    },

    __cachedStream() {
      if (!this.stream) return null;
      return h('div', this.setTextColor(this.color, {
        class: 'v-progress-linear__stream',
        style: {
          width: convertToUnit(100 - this.normalizedBuffer, '%')
        }
      }));
    },

    backgroundStyle() {
      const backgroundOpacity = this.backgroundOpacity == null ? this.backgroundColor ? 1 : 0.3 : parseFloat(this.backgroundOpacity);
      return {
        opacity: backgroundOpacity,
        [this.isReversed ? 'right' : 'left']: convertToUnit(this.normalizedValue, '%'),
        width: convertToUnit(Math.max(0, this.normalizedBuffer - this.normalizedValue), '%')
      };
    },

    classes() {
      return {
        'v-progress-linear--absolute': this.absolute,
        'v-progress-linear--fixed': this.fixed,
        'v-progress-linear--query': this.query,
        'v-progress-linear--reactive': this.reactive,
        'v-progress-linear--reverse': this.isReversed,
        'v-progress-linear--rounded': this.rounded,
        'v-progress-linear--striped': this.striped,
        'v-progress-linear--visible': this.isVisible,
        ...this.themeClasses
      };
    },

    computedTransition() {
      return this.indeterminate ? VFadeTransition : VSlideXTransition;
    },

    isReversed() {
      return this.$vuetify.rtl !== this.reverse;
    },

    normalizedBuffer() {
      return this.normalize(this.bufferValue);
    },

    normalizedValue() {
      return this.normalize(this.internalLazyValue);
    },

    reactive() {
      return Boolean(this.$listeners.onChange) || Boolean(this.$listeners['onUpdate:modelValue']);
    },

    styles() {
      const styles = {};

      if (!this.active) {
        styles.height = 0;
      }

      if (!this.indeterminate && parseFloat(this.normalizedBuffer) !== 100) {
        styles.width = convertToUnit(this.normalizedBuffer, '%');
      }

      return styles;
    }

  },
  watch: {
    modelValue(val) {
      this.internalLazyValue = val;
    },

    value(val) {
      this.internalLazyValue = val;
    }

  },
  methods: {
    genContent() {
      const slot = getSlot(this, 'default', {
        value: this.internalLazyValue
      });
      if (!slot) return null;
      return h('div', {
        class: 'v-progress-linear__content'
      }, {
        default: () => slot
      });
    },

    genListeners() {
      const listeners = this.$listeners;

      if (this.reactive) {
        listeners.onClick = this.onClick;
      }

      return listeners;
    },

    genProgressBar(name) {
      return h('div', this.setBackgroundColor(this.color, {
        class: ['v-progress-linear__indeterminate', {
          [name]: true
        }]
      }));
    },

    onClick(e) {
      if (!this.reactive) return;
      const {
        width
      } = this.$el.getBoundingClientRect();
      this.internalValue = e.offsetX / width * 100;
    },

    onObserve(entries, observer, isIntersecting) {
      this.isVisible = isIntersecting;
    },

    normalize(value) {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      if (numValue < 0) return 0;
      if (numValue > 100) return 100;
      return numValue;
    }

  },

  render() {
    const data = {
      class: ['v-progress-linear', this.classes],
      role: 'progressbar',
      'aria-valuemin': 0,
      'aria-valuemax': this.normalizedBuffer,
      'aria-valuenow': this.indeterminate ? undefined : this.normalizedValue,
      style: {
        bottom: this.bottom ? 0 : undefined,
        height: this.active ? convertToUnit(this.height) : 0,
        top: this.top ? 0 : undefined
      },
      ...this.genListeners()
    };
    return withDirectives(h('div', data, [this.__cachedStream, this.__cachedBackground, this.__cachedBuffer, this.__cachedBar, this.genContent()]), [[Intersect, this.onObserve]]);
  }

});
//# sourceMappingURL=VProgressLinear.js.map