import { h, withDirectives } from 'vue'; // Styles

import "../../../src/components/VVirtualScroll/VVirtualScroll.sass"; // Mixins

import Measurable from '../../mixins/measurable'; // Directives

import Scroll from '../../directives/scroll'; // Utilities

import { convertToUnit, getSlot } from '../../util/helpers'; // Types

import { defineComponent } from 'vue';
export default defineComponent({
  name: 'v-virtual-scroll',
  extends: Measurable,
  props: {
    bench: {
      type: [Number, String],
      default: 0
    },
    itemHeight: {
      type: [Number, String],
      required: true
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    first: 0,
    last: 0,
    scrollTop: 0
  }),
  computed: {
    __bench() {
      return parseInt(this.bench, 10);
    },

    __itemHeight() {
      return parseInt(this.itemHeight, 10);
    },

    firstToRender() {
      return Math.max(0, this.first - this.__bench);
    },

    lastToRender() {
      return Math.min(this.items.length, this.last + this.__bench);
    }

  },
  watch: {
    height: 'onScroll',
    itemHeight: 'onScroll'
  },

  mounted() {
    this.last = this.getLast(0);
  },

  methods: {
    getChildren() {
      return this.items.slice(this.firstToRender, this.lastToRender).map(this.genChild);
    },

    genChild(item, index) {
      index += this.firstToRender;
      const top = convertToUnit(index * this.__itemHeight);
      return h('div', {
        class: 'v-virtual-scroll__item',
        style: {
          top
        },
        key: index
      }, getSlot(this, 'default', {
        index,
        item
      }));
    },

    getFirst() {
      return Math.floor(this.scrollTop / this.__itemHeight);
    },

    getLast(first) {
      const height = parseInt(this.height || 0, 10) || this.$el.clientHeight;
      return first + Math.ceil(height / this.__itemHeight);
    },

    onScroll() {
      this.scrollTop = this.$el.scrollTop;
      this.first = this.getFirst();
      this.last = this.getLast(this.first);
    }

  },

  render() {
    const content = h('div', {
      class: 'v-virtual-scroll__container',
      style: {
        height: convertToUnit(this.items.length * this.__itemHeight)
      }
    }, this.getChildren());
    return withDirectives(h('div', {
      class: 'v-virtual-scroll',
      style: this.measurableStyles,
      ...this.$listeners
    }, {
      default: () => [content]
    }), [[Scroll, this.onScroll, '', {
      self: true
    }]]);
  }

});
//# sourceMappingURL=VVirtualScroll.js.map