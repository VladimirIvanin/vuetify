import { h, defineComponent, getCurrentInstance } from 'vue'; // Mixins

import Colorable from '../../mixins/colorable'; // Utilities

import { genPoints, genBars } from './helpers/core';
import { genPath } from './helpers/path';
export default defineComponent({
  name: 'v-sparkline',
  mixins: [Colorable],
  inheritAttrs: false,
  props: {
    autoDraw: Boolean,
    autoDrawDuration: {
      type: Number,
      default: 2000
    },
    autoDrawEasing: {
      type: String,
      default: 'ease'
    },
    autoLineWidth: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'primary'
    },
    fill: {
      type: Boolean,
      default: false
    },
    gradient: {
      type: Array,
      default: () => []
    },
    gradientDirection: {
      type: String,
      validator: val => ['top', 'bottom', 'left', 'right'].includes(val),
      default: 'top'
    },
    height: {
      type: [String, Number],
      default: 75
    },
    labels: {
      type: Array,
      default: () => []
    },
    labelSize: {
      type: [Number, String],
      default: 7
    },
    lineWidth: {
      type: [String, Number],
      default: 4
    },
    padding: {
      type: [String, Number],
      default: 8
    },
    showLabels: Boolean,
    smooth: {
      type: [Boolean, Number, String],
      default: false
    },
    type: {
      type: String,
      default: 'trend',
      validator: val => ['trend', 'bar'].includes(val)
    },
    value: {
      type: Array,
      default: () => []
    },
    width: {
      type: [Number, String],
      default: 300
    }
  },
  data: () => ({
    lastLength: 0
  }),
  computed: {
    parsedPadding() {
      return Number(this.padding);
    },

    parsedWidth() {
      return Number(this.width);
    },

    parsedHeight() {
      return parseInt(this.height, 10);
    },

    parsedLabelSize() {
      return parseInt(this.labelSize, 10) || 7;
    },

    totalHeight() {
      let height = this.parsedHeight;
      if (this.hasLabels) height += parseInt(this.labelSize, 10) * 1.5;
      return height;
    },

    totalWidth() {
      let width = this.parsedWidth;
      if (this.type === 'bar') width = Math.max(this.value.length * this._lineWidth, width);
      return width;
    },

    totalValues() {
      return this.value.length;
    },

    _lineWidth() {
      if (this.autoLineWidth && this.type !== 'trend') {
        const totalPadding = this.parsedPadding * (this.totalValues + 1);
        return (this.parsedWidth - totalPadding) / this.totalValues;
      } else {
        return parseFloat(this.lineWidth) || 4;
      }
    },

    boundary() {
      if (this.type === 'bar') return {
        minX: 0,
        maxX: this.totalWidth,
        minY: 0,
        maxY: this.parsedHeight
      };
      const padding = this.parsedPadding;
      return {
        minX: padding,
        maxX: this.totalWidth - padding,
        minY: padding,
        maxY: this.parsedHeight - padding
      };
    },

    hasLabels() {
      return Boolean(this.showLabels || this.labels.length > 0 || this.$slots.label);
    },

    parsedLabels() {
      const labels = [];
      const points = this._values;
      const len = points.length;

      for (let i = 0; labels.length < len; i++) {
        const item = points[i];
        let value = this.labels[i];

        if (!value) {
          value = typeof item === 'object' ? item.value : item;
        }

        labels.push({
          x: item.x,
          value: String(value)
        });
      }

      return labels;
    },

    normalizedValues() {
      return this.value.map(item => typeof item === 'number' ? item : item.value);
    },

    _values() {
      return this.type === 'trend' ? genPoints(this.normalizedValues, this.boundary) : genBars(this.normalizedValues, this.boundary);
    },

    textY() {
      let y = this.parsedHeight;
      if (this.type === 'trend') y -= 4;
      return y;
    },

    _radius() {
      return this.smooth === true ? 8 : Number(this.smooth);
    }

  },
  watch: {
    value: {
      immediate: true,

      handler() {
        this.$nextTick(() => {
          if (!this.autoDraw || this.type === 'bar' || !this.$refs.path) return;
          const path = this.$refs.path;
          const length = path.getTotalLength();

          if (!this.fill) {
            path.style.transition = 'none';
            path.style.strokeDasharray = length + ' ' + length;
            path.style.strokeDashoffset = Math.abs(length - (this.lastLength || 0)).toString();
            path.getBoundingClientRect();
            path.style.transition = `stroke-dashoffset ${this.autoDrawDuration}ms ${this.autoDrawEasing}`;
            path.style.strokeDashoffset = '0';
          } else {
            path.style.transformOrigin = 'bottom center';
            path.style.transition = 'none';
            path.style.transform = `scaleY(0)`;
            path.getBoundingClientRect();
            path.style.transition = `transform ${this.autoDrawDuration}ms ${this.autoDrawEasing}`;
            path.style.transform = `scaleY(1)`;
          }

          this.lastLength = length;
        });
      }

    }
  },
  methods: {
    genGradient() {
      const gradientDirection = this.gradientDirection;
      const gradient = this.gradient.slice(); // Pushes empty string to force
      // a fallback to currentColor

      if (!gradient.length) gradient.push('');
      const len = Math.max(gradient.length - 1, 1);
      const stops = gradient.reverse().map((color, index) => h('stop', {
        offset: index / len,
        'stop-color': color || 'currentColor'
      }));
      const instance = getCurrentInstance();
      return h('defs', [h('linearGradient', {
        id: instance === null || instance === void 0 ? void 0 : instance.uid,
        gradientUnits: 'userSpaceOnUse',
        x1: gradientDirection === 'left' ? '100%' : '0',
        y1: gradientDirection === 'top' ? '100%' : '0',
        x2: gradientDirection === 'right' ? '100%' : '0',
        y2: gradientDirection === 'bottom' ? '100%' : '0'
      }, stops)]);
    },

    genG(children) {
      return h('g', {
        style: {
          fontSize: '8',
          textAnchor: 'middle',
          dominantBaseline: 'mathematical',
          fill: 'currentColor'
        }
      }, children);
    },

    genPath() {
      const points = genPoints(this.normalizedValues, this.boundary);
      const instance = getCurrentInstance();
      return h('path', {
        d: genPath(points, this._radius, this.fill, this.parsedHeight),
        fill: this.fill ? `url(#${instance === null || instance === void 0 ? void 0 : instance.uid})` : 'none',
        stroke: this.fill ? 'none' : `url(#${instance === null || instance === void 0 ? void 0 : instance.uid})`,
        ref: 'path'
      });
    },

    genLabels(offsetX) {
      const children = this.parsedLabels.map((item, i) => h('text', {
        x: item.x + offsetX + this._lineWidth / 2,
        y: this.textY + this.parsedLabelSize * 0.75,
        'font-size': Number(this.labelSize) || 7
      }, [this.genLabel(item, i)]));
      return this.genG(children);
    },

    genLabel(item, index) {
      return this.$slots.label ? this.$slots.label({
        index,
        value: item.value
      }) : item.value;
    },

    genBars() {
      var _a, _b, _c;

      if (!this.value || this.totalValues < 2) return undefined;
      const bars = genBars(this.normalizedValues, this.boundary);
      const offsetX = (Math.abs(bars[0].x - bars[1].x) - this._lineWidth) / 2;
      return h('svg', {
        display: 'block',
        viewBox: `0 0 ${this.totalWidth} ${this.totalHeight}`
      }, [this.genGradient(), this.genClipPath(bars, offsetX, this._lineWidth, 'sparkline-bar-' + ((_a = getCurrentInstance()) === null || _a === void 0 ? void 0 : _a.uid)), this.hasLabels ? this.genLabels(offsetX) : undefined, h('g', {
        'clip-path': `url(#sparkline-bar-${(_b = getCurrentInstance()) === null || _b === void 0 ? void 0 : _b.uid}-clip)`,
        fill: `url(#${(_c = getCurrentInstance()) === null || _c === void 0 ? void 0 : _c.uid})`
      }, [h('rect', {
        x: 0,
        y: 0,
        width: this.totalWidth,
        height: this.height
      })])]);
    },

    genClipPath(bars, offsetX, lineWidth, id) {
      const rounding = typeof this.smooth === 'number' ? this.smooth : this.smooth ? 2 : 0;
      return h('clipPath', {
        id: `${id}-clip`
      }, bars.map(item => {
        return h('rect', {
          x: item.x + offsetX,
          y: item.y,
          width: lineWidth,
          height: item.height,
          rx: rounding,
          ry: rounding
        }, [this.autoDraw ? h('animate', {
          attributeName: 'height',
          from: 0,
          to: item.height,
          dur: `${this.autoDrawDuration}ms`,
          fill: 'freeze'
        }) : undefined]);
      }));
    },

    genTrend() {
      return h('svg', this.setTextColor(this.color, { ...this.$attrs,
        display: 'block',
        'stroke-width': this._lineWidth || 1,
        viewBox: `0 0 ${this.width} ${this.totalHeight}`
      }), [this.genGradient(), this.hasLabels && this.genLabels(-(this._lineWidth / 2)), this.genPath()]);
    }

  },

  render() {
    if (this.totalValues < 2) return undefined;
    return this.type === 'trend' ? this.genTrend() : this.genBars();
  }

});
//# sourceMappingURL=VSparkline.js.map