"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

require("../../../src/components/VVirtualScroll/VVirtualScroll.sass");

var _measurable = _interopRequireDefault(require("../../mixins/measurable"));

var _scroll = _interopRequireDefault(require("../../directives/scroll"));

var _helpers = require("../../util/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default2 = (0, _vue.defineComponent)({
  name: 'v-virtual-scroll',
  extends: _measurable.default,
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
      default: function _default() {
        return [];
      }
    }
  },
  data: function data() {
    return {
      first: 0,
      last: 0,
      scrollTop: 0
    };
  },
  computed: {
    __bench: function __bench() {
      return parseInt(this.bench, 10);
    },
    __itemHeight: function __itemHeight() {
      return parseInt(this.itemHeight, 10);
    },
    firstToRender: function firstToRender() {
      return Math.max(0, this.first - this.__bench);
    },
    lastToRender: function lastToRender() {
      return Math.min(this.items.length, this.last + this.__bench);
    }
  },
  watch: {
    height: 'onScroll',
    itemHeight: 'onScroll'
  },
  mounted: function mounted() {
    this.last = this.getLast(0);
  },
  methods: {
    getChildren: function getChildren() {
      return this.items.slice(this.firstToRender, this.lastToRender).map(this.genChild);
    },
    genChild: function genChild(item, index) {
      index += this.firstToRender;
      var top = (0, _helpers.convertToUnit)(index * this.__itemHeight);
      return (0, _vue.h)('div', {
        class: 'v-virtual-scroll__item',
        style: {
          top: top
        },
        key: index
      }, (0, _helpers.getSlot)(this, 'default', {
        index: index,
        item: item
      }));
    },
    getFirst: function getFirst() {
      return Math.floor(this.scrollTop / this.__itemHeight);
    },
    getLast: function getLast(first) {
      var height = parseInt(this.height || 0, 10) || this.$el.clientHeight;
      return first + Math.ceil(height / this.__itemHeight);
    },
    onScroll: function onScroll() {
      this.scrollTop = this.$el.scrollTop;
      this.first = this.getFirst();
      this.last = this.getLast(this.first);
    }
  },
  render: function render() {
    var content = (0, _vue.h)('div', {
      class: 'v-virtual-scroll__container',
      style: {
        height: (0, _helpers.convertToUnit)(this.items.length * this.__itemHeight)
      }
    }, this.getChildren());
    return (0, _vue.withDirectives)((0, _vue.h)('div', _objectSpread({
      class: 'v-virtual-scroll',
      style: this.measurableStyles
    }, this.$listeners), {
      default: function _default() {
        return [content];
      }
    }), [[_scroll.default, this.onScroll, '', {
      self: true
    }]]);
  }
});

exports.default = _default2;
//# sourceMappingURL=VVirtualScroll.js.map