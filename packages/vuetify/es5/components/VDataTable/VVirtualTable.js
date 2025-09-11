"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

require("../../../src/components/VDataTable/VVirtualTable.sass");

var _VSimpleTable = _interopRequireDefault(require("./VSimpleTable"));

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _helpers = require("../../util/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Components
// Utiltiies
// Types
var baseMixins = (0, _mixins.default)(_VSimpleTable.default);

var _default2 = baseMixins.extend({
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
      default: function _default() {
        return [];
      }
    },
    rowHeight: {
      type: Number,
      default: 48
    }
  },
  data: function data() {
    return {
      scrollTop: 0,
      oldChunk: 0,
      scrollDebounce: null,
      invalidateCache: false
    };
  },
  computed: {
    itemsLength: function itemsLength() {
      return this.items.length;
    },
    totalHeight: function totalHeight() {
      return this.itemsLength * this.rowHeight + this.headerHeight;
    },
    topIndex: function topIndex() {
      return Math.floor(this.scrollTop / this.rowHeight);
    },
    chunkIndex: function chunkIndex() {
      return Math.floor(this.topIndex / this.chunkSize);
    },
    startIndex: function startIndex() {
      return Math.max(0, this.chunkIndex * this.chunkSize - this.chunkSize);
    },
    offsetTop: function offsetTop() {
      return Math.max(0, this.startIndex * this.rowHeight);
    },
    stopIndex: function stopIndex() {
      return Math.min(this.startIndex + this.chunkSize * 3, this.itemsLength);
    },
    offsetBottom: function offsetBottom() {
      return Math.max(0, (this.itemsLength - this.stopIndex - this.startIndex) * this.rowHeight);
    }
  },
  watch: {
    chunkIndex: function chunkIndex(newValue, oldValue) {
      this.oldChunk = oldValue;
    },
    items: function items() {
      this.cachedItems = null;
      this.$refs.table.scrollTop = 0;
    }
  },
  created: function created() {
    this.cachedItems = null;
  },
  mounted: function mounted() {
    this.scrollDebounce = (0, _helpers.debounce)(this.onScroll, 50);
    this.$refs.table.addEventListener('scroll', this.scrollDebounce, {
      passive: true
    });
  },
  beforeUnmount: function beforeUnmount() {
    this.$refs.table.removeEventListener('scroll', this.scrollDebounce);
  },
  methods: {
    createStyleHeight: function createStyleHeight(height) {
      return {
        height: "".concat(height, "px")
      };
    },
    genBody: function genBody() {
      if (this.cachedItems === null || this.chunkIndex !== this.oldChunk) {
        this.cachedItems = this.genItems();
        this.oldChunk = this.chunkIndex;
      }

      return (0, _vue.h)('tbody', [(0, _vue.h)('tr', {
        style: this.createStyleHeight(this.offsetTop)
      }), this.cachedItems, (0, _vue.h)('tr', {
        style: this.createStyleHeight(this.offsetBottom)
      })]);
    },
    genItems: function genItems() {
      return this.$slots.items({
        items: this.items.slice(this.startIndex, this.stopIndex)
      });
    },
    onScroll: function onScroll(e) {
      var target = e.target;
      this.scrollTop = target.scrollTop;
    },
    genTable: function genTable() {
      return (0, _vue.h)('div', {
        ref: 'table',
        class: 'v-virtual-table__table'
      }, [(0, _vue.h)('table', [this.$slots['body.before'], this.genBody(), this.$slots['body.after']])]);
    },
    genWrapper: function genWrapper() {
      return (0, _vue.h)('div', {
        class: 'v-virtual-table__wrapper',
        style: {
          height: (0, _helpers.convertToUnit)(this.height)
        }
      }, [this.genTable()]);
    }
  },
  render: function render() {
    return (0, _vue.h)('div', {
      class: ['v-data-table', 'v-virtual-table', this.classes]
    }, [(0, _helpers.getSlot)(this, 'top'), this.genWrapper(), (0, _helpers.getSlot)(this, 'bottom')]);
  }
});

exports.default = _default2;
//# sourceMappingURL=VVirtualTable.js.map