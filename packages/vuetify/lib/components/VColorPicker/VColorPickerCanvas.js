import { h, defineComponent } from 'vue'; // Styles

import "../../../src/components/VColorPicker/VColorPickerCanvas.sass"; // Helpers

import { clamp, convertToUnit } from '../../util/helpers';
import { fromHSVA, fromRGBA } from './util';
export default defineComponent({
  name: 'v-color-picker-canvas',
  props: {
    color: {
      type: Object,
      default: () => fromRGBA({
        r: 255,
        g: 0,
        b: 0,
        a: 1
      })
    },
    disabled: Boolean,
    dotSize: {
      type: [Number, String],
      default: 10
    },
    height: {
      type: [Number, String],
      default: 150
    },
    width: {
      type: [Number, String],
      default: 300
    }
  },
  emits: ['update:color'],

  data() {
    return {
      boundingRect: {
        width: 0,
        height: 0,
        left: 0,
        top: 0
      }
    };
  },

  computed: {
    dot() {
      if (!this.color) return {
        x: 0,
        y: 0
      };
      return {
        x: this.color.hsva.s * parseInt(String(this.width), 10),
        y: (1 - this.color.hsva.v) * parseInt(String(this.height), 10)
      };
    }

  },
  watch: {
    'color.hue'() {
      this.updateCanvas();
    }

  },

  mounted() {
    this.updateCanvas();
  },

  methods: {
    updateCanvas() {
      if (!this.color) return;
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const saturationGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      saturationGradient.addColorStop(0, 'hsla(0, 0%, 100%, 1)'); // white

      saturationGradient.addColorStop(1, `hsla(${this.color.hue}, 100%, 50%, 1)`);
      ctx.fillStyle = saturationGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const valueGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      valueGradient.addColorStop(0, 'hsla(0, 0%, 100%, 0)'); // transparent

      valueGradient.addColorStop(1, 'hsla(0, 0%, 0%, 1)'); // black

      ctx.fillStyle = valueGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },

    emitColor(x, y) {
      const {
        left,
        top,
        width,
        height
      } = this.boundingRect;
      this.$emit('update:color', fromHSVA({
        h: this.color.hue,
        s: clamp(x - left, 0, width) / width,
        v: 1 - clamp(y - top, 0, height) / height,
        a: this.color.alpha
      }));
    },

    handleClick(e) {
      if (this.disabled) return;
      this.boundingRect = this.$el.getBoundingClientRect();
      this.emitColor(e.clientX, e.clientY);
    },

    handleMouseMove(e) {
      if (this.disabled) return;
      this.emitColor(e.clientX, e.clientY);
    },

    handleMouseUp() {
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('mouseup', this.handleMouseUp);
    },

    handleMouseDown(e) {
      // To prevent selection while moving cursor
      e.preventDefault();
      if (this.disabled) return;
      this.boundingRect = this.$el.getBoundingClientRect();
      window.addEventListener('mousemove', this.handleMouseMove);
      window.addEventListener('mouseup', this.handleMouseUp);
    },

    genCanvas() {
      return h('canvas', {
        ref: 'canvas',
        width: this.width,
        height: this.height
      });
    },

    genDot() {
      const radius = parseInt(String(this.dotSize), 10) / 2;
      const x = convertToUnit(this.dot.x - radius);
      const y = convertToUnit(this.dot.y - radius);
      return h('div', {
        class: ['v-color-picker__canvas-dot', {
          'v-color-picker__canvas-dot--disabled': this.disabled
        }],
        style: {
          width: convertToUnit(this.dotSize),
          height: convertToUnit(this.dotSize),
          transform: `translate(${x}, ${y})`
        }
      });
    }

  },

  render() {
    return h('div', {
      class: 'v-color-picker__canvas',
      style: {
        width: convertToUnit(this.width),
        height: convertToUnit(this.height)
      },
      onClick: this.handleClick,
      onMousedown: this.handleMouseDown
    }, [this.genCanvas(), this.genDot()]);
  }

});
//# sourceMappingURL=VColorPickerCanvas.js.map