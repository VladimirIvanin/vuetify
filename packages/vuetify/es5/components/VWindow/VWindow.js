"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

require("../../../src/components/VWindow/VWindow.sass");

var _touch = _interopRequireDefault(require("../../directives/touch"));

var _VBtn = _interopRequireDefault(require("../VBtn"));

var _VIcon = _interopRequireDefault(require("../VIcon"));

var _VItemGroup = require("../VItemGroup/VItemGroup");

var _helpers = require("../../util/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* @vue/component */
var _default2 = (0, _vue.defineComponent)({
  name: 'v-window',
  extends: _VItemGroup.BaseItemGroup,
  provide: function provide() {
    return {
      windowGroup: this
    };
  },
  props: {
    activeClass: {
      type: String,
      default: 'v-window-item--active'
    },
    continuous: Boolean,
    mandatory: {
      type: Boolean,
      default: true
    },
    nextIcon: {
      type: [Boolean, String],
      default: '$next'
    },
    prevIcon: {
      type: [Boolean, String],
      default: '$prev'
    },
    reverse: Boolean,
    showArrows: Boolean,
    showArrowsOnHover: Boolean,
    touch: Object,
    touchless: Boolean,
    modelValue: {
      required: false
    },
    vertical: Boolean
  },
  data: function data() {
    return {
      changedByDelimiters: false,
      internalHeight: undefined,
      transitionHeight: undefined,
      transitionCount: 0,
      isBooted: false,
      isReverse: false
    };
  },
  computed: {
    isActive: function isActive() {
      return this.transitionCount > 0;
    },
    classes: function classes() {
      return _objectSpread(_objectSpread({}, _VItemGroup.BaseItemGroup.computed.classes.call(this)), {}, {
        'v-window--show-arrows-on-hover': this.showArrowsOnHover
      });
    },
    computedTransition: function computedTransition() {
      if (!this.isBooted) return '';
      var axis = this.vertical ? 'y' : 'x';
      var reverse = this.internalReverse ? !this.isReverse : this.isReverse;
      var direction = reverse ? '-reverse' : '';
      return "v-window-".concat(axis).concat(direction, "-transition");
    },
    hasActiveItems: function hasActiveItems() {
      return Boolean(this.items.find(function (item) {
        return !item.disabled;
      }));
    },
    hasNext: function hasNext() {
      return this.continuous || this.internalIndex < this.items.length - 1;
    },
    hasPrev: function hasPrev() {
      return this.continuous || this.internalIndex > 0;
    },
    internalIndex: function internalIndex() {
      var _this = this;

      return this.items.findIndex(function (item, i) {
        return _this.internalValue === _this.getValue(item, i);
      });
    },
    internalReverse: function internalReverse() {
      return this.$vuetify.rtl ? !this.reverse : this.reverse;
    }
  },
  watch: {
    internalIndex: function internalIndex(val, oldVal) {
      this.isReverse = this.updateReverse(val, oldVal);
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    window.requestAnimationFrame(function () {
      return _this2.isBooted = true;
    });
  },
  methods: {
    genDefaultSlot: function genDefaultSlot() {
      return (0, _helpers.getSlot)(this);
    },
    genContainer: function genContainer() {
      var children = [this.genDefaultSlot()];

      if (this.showArrows) {
        children.push(this.genControlIcons());
      }

      return (0, _vue.h)('div', {
        class: ['v-window__container', {
          'v-window__container--is-active': this.isActive
        }],
        style: {
          height: this.internalHeight || this.transitionHeight
        }
      }, children);
    },
    genIcon: function genIcon(direction, icon, click) {
      var _this3 = this;

      var _a, _b, _c;

      var attrs = {
        'aria-label': this.$vuetify.lang.t("$vuetify.carousel.".concat(direction)),
        onClick: function onClick(e) {
          e.stopPropagation();
          _this3.changedByDelimiters = true;
          click();
        }
      };
      var children = (_c = (_b = (_a = this.$slots)[direction]) === null || _b === void 0 ? void 0 : _b.call(_a, {
        attrs: attrs
      })) !== null && _c !== void 0 ? _c : [(0, _vue.h)(_VBtn.default, _objectSpread({
        icon: true
      }, attrs), {
        default: function _default() {
          return [(0, _vue.h)(_VIcon.default, {
            large: true
          }, {
            default: function _default() {
              return icon;
            }
          })];
        }
      })];
      return (0, _vue.h)('div', {
        class: "v-window__".concat(direction)
      }, children);
    },
    genControlIcons: function genControlIcons() {
      var icons = [];
      var prevIcon = this.$vuetify.rtl ? this.nextIcon : this.prevIcon;
      /* istanbul ignore else */

      if (this.hasPrev && prevIcon && typeof prevIcon === 'string') {
        var icon = this.genIcon('prev', prevIcon, this.prev);
        icon && icons.push(icon);
      }

      var nextIcon = this.$vuetify.rtl ? this.prevIcon : this.nextIcon;
      /* istanbul ignore else */

      if (this.hasNext && nextIcon && typeof nextIcon === 'string') {
        var _icon = this.genIcon('next', nextIcon, this.next);

        _icon && icons.push(_icon);
      }

      return icons;
    },
    getNextIndex: function getNextIndex(index) {
      var nextIndex = (index + 1) % this.items.length;
      var item = this.items[nextIndex];
      if (item.disabled) return this.getNextIndex(nextIndex);
      return nextIndex;
    },
    getPrevIndex: function getPrevIndex(index) {
      var prevIndex = (index + this.items.length - 1) % this.items.length;
      var item = this.items[prevIndex];
      if (item.disabled) return this.getPrevIndex(prevIndex);
      return prevIndex;
    },
    next: function next() {
      /* istanbul ignore if */
      if (!this.hasActiveItems || !this.hasNext) return;
      var nextIndex = this.getNextIndex(this.internalIndex);
      var item = this.items[nextIndex];
      this.internalValue = this.getValue(item, nextIndex);
    },
    prev: function prev() {
      /* istanbul ignore if */
      if (!this.hasActiveItems || !this.hasPrev) return;
      var lastIndex = this.getPrevIndex(this.internalIndex);
      var item = this.items[lastIndex];
      this.internalValue = this.getValue(item, lastIndex);
    },
    updateReverse: function updateReverse(val, oldVal) {
      var itemsLength = this.items.length;
      var lastIndex = itemsLength - 1;
      if (itemsLength <= 2) return val < oldVal;

      if (val === lastIndex && oldVal === 0) {
        return true;
      } else if (val === 0 && oldVal === lastIndex) {
        return false;
      } else {
        return val < oldVal;
      }
    }
  },
  render: function render() {
    var _this4 = this;

    var directives = [];
    var data = {
      class: ['v-window', this.classes]
    };

    if (!this.touchless) {
      var value = this.touch || {
        left: function left() {
          _this4.$vuetify.rtl ? _this4.prev() : _this4.next();
        },
        right: function right() {
          _this4.$vuetify.rtl ? _this4.next() : _this4.prev();
        },
        end: function end(e) {
          e.stopPropagation();
        },
        start: function start(e) {
          e.stopPropagation();
        }
      };
      directives.push([_touch.default, value]);
    }

    return (0, _vue.withDirectives)((0, _vue.h)('div', data, [this.genContainer()]), directives);
  }
});

exports.default = _default2;
//# sourceMappingURL=VWindow.js.map