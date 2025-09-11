import { h } from 'vue';
import "../../../src/components/VDataTable/VVirtualTable.sass"; // Components

import VSimpleTable from './VSimpleTable';
import mixins from '../../util/mixins'; // Utiltiies

import { convertToUnit, debounce, getSlot } from '../../util/helpers'; // Types

const baseMixins = mixins(VSimpleTable);
export default baseMixins.extend({
  name: 'v-virtual-table',
  props: {
    chunkSize: {
      type: Number,
      default: 25
    },
    headerHeight: {
      type: Number,
      default: 48
    },
    items: {
      type: Array,
      default: () => []
    },
    rowHeight: {
      type: Number,
      default: 48
    }
  },
  data: () => ({
    scrollTop: 0,
    oldChunk: 0,
    scrollDebounce: null,
    invalidateCache: false
  }),
  computed: {
    itemsLength() {
      return this.items.length;
    },

    totalHeight() {
      return this.itemsLength * this.rowHeight + this.headerHeight;
    },

    topIndex() {
      return Math.floor(this.scrollTop / this.rowHeight);
    },

    chunkIndex() {
      return Math.floor(this.topIndex / this.chunkSize);
    },

    startIndex() {
      return Math.max(0, this.chunkIndex * this.chunkSize - this.chunkSize);
    },

    offsetTop() {
      return Math.max(0, this.startIndex * this.rowHeight);
    },

    stopIndex() {
      return Math.min(this.startIndex + this.chunkSize * 3, this.itemsLength);
    },

    offsetBottom() {
      return Math.max(0, (this.itemsLength - this.stopIndex - this.startIndex) * this.rowHeight);
    }

  },
  watch: {
    chunkIndex(newValue, oldValue) {
      this.oldChunk = oldValue;
    },

    items() {
      this.cachedItems = null;
      this.$refs.table.scrollTop = 0;
    }

  },

  created() {
    this.cachedItems = null;
  },

  mounted() {
    this.scrollDebounce = debounce(this.onScroll, 50);
    this.$refs.table.addEventListener('scroll', this.scrollDebounce, {
      passive: true
    });
  },

  beforeUnmount() {
    this.$refs.table.removeEventListener('scroll', this.scrollDebounce);
  },

  methods: {
    createStyleHeight(height) {
      return {
        height: `${height}px`
      };
    },

    genBody() {
      if (this.cachedItems === null || this.chunkIndex !== this.oldChunk) {
        this.cachedItems = this.genItems();
        this.oldChunk = this.chunkIndex;
      }

      return h('tbody', [h('tr', {
        style: this.createStyleHeight(this.offsetTop)
      }), this.cachedItems, h('tr', {
        style: this.createStyleHeight(this.offsetBottom)
      })]);
    },

    genItems() {
      return this.$slots.items({
        items: this.items.slice(this.startIndex, this.stopIndex)
      });
    },

    onScroll(e) {
      const target = e.target;
      this.scrollTop = target.scrollTop;
    },

    genTable() {
      return h('div', {
        ref: 'table',
        class: 'v-virtual-table__table'
      }, [h('table', [this.$slots['body.before'], this.genBody(), this.$slots['body.after']])]);
    },

    genWrapper() {
      return h('div', {
        class: 'v-virtual-table__wrapper',
        style: {
          height: convertToUnit(this.height)
        }
      }, [this.genTable()]);
    }

  },

  render() {
    return h('div', {
      class: ['v-data-table', 'v-virtual-table', this.classes]
    }, [getSlot(this, 'top'), this.genWrapper(), getSlot(this, 'bottom')]);
  }

});
//# sourceMappingURL=VVirtualTable.js.map