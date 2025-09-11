"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

require("../../../src/components/VParallax/VParallax.sass");

var _translatable = _interopRequireDefault(require("../../mixins/translatable"));

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _helpers = require("../../util/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var baseMixins = (0, _mixins.default)(_translatable.default);
/* @vue/component */

var _default = baseMixins.extend({
  name: 'v-parallax',
  props: {
    alt: {
      type: String,
      default: ''
    },
    height: {
      type: [String, Number],
      default: 500
    },
    src: String,
    srcset: String
  },
  data: function data() {
    return {
      isBooted: false
    };
  },
  computed: {
    styles: function styles() {
      return {
        display: 'block',
        opacity: this.isBooted ? 1 : 0,
        transform: "translate(-50%, ".concat(this.parallax, "px)")
      };
    }
  },
  mounted: function mounted() {
    this.init();
  },
  methods: {
    init: function init() {
      var _this = this;

      var img = this.$refs.img;
      if (!img) return;

      if (img.complete) {
        this.translate();
        this.listeners();
      } else {
        img.addEventListener('load', function () {
          _this.translate();

          _this.listeners();
        }, false);
      }

      this.isBooted = true;
    },
    objHeight: function objHeight() {
      return this.$refs.img.naturalHeight;
    }
  },
  render: function render() {
    var imgData = {
      class: 'v-parallax__image',
      style: this.styles,
      src: this.src,
      srcset: this.srcset,
      alt: this.alt,
      ref: 'img'
    };
    var container = (0, _vue.h)('div', {
      class: 'v-parallax__image-container'
    }, [(0, _vue.h)('img', imgData)]);
    var content = (0, _vue.h)('div', {
      class: 'v-parallax__content'
    }, (0, _helpers.getSlot)(this));
    return (0, _vue.h)('div', _objectSpread({
      class: 'v-parallax',
      style: {
        height: "".concat(this.height, "px")
      }
    }, this.$listeners), [container, content]);
  }
});

exports.default = _default;
//# sourceMappingURL=VParallax.js.map