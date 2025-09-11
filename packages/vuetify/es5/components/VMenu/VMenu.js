"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

require("../../../src/components/VMenu/VMenu.sass");

var _VThemeProvider = require("../VThemeProvider");

var _activatable = _interopRequireDefault(require("../../mixins/activatable"));

var _delayable = _interopRequireDefault(require("../../mixins/delayable"));

var _dependent = _interopRequireDefault(require("../../mixins/dependent"));

var _menuable = _interopRequireDefault(require("../../mixins/menuable"));

var _returnable = _interopRequireDefault(require("../../mixins/returnable"));

var _roundable = _interopRequireDefault(require("../../mixins/roundable"));

var _themeable = _interopRequireDefault(require("../../mixins/themeable"));

var _clickOutside = _interopRequireDefault(require("../../directives/click-outside"));

var _resize = _interopRequireDefault(require("../../directives/resize"));

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _console = require("../../util/console");

var _helpers = require("../../util/helpers");

var _goto = _interopRequireDefault(require("../../services/goto"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var baseMixins = (0, _mixins.default)(_dependent.default, _delayable.default, _returnable.default, _roundable.default, _themeable.default, _menuable.default);
/* @vue/component */

var _default2 = baseMixins.extend({
  name: 'v-menu',
  provide: function provide() {
    return {
      isInMenu: true,
      // Pass theme through to default slot
      theme: this.theme
    };
  },
  props: {
    auto: Boolean,
    closeOnClick: {
      type: Boolean,
      default: true
    },
    closeOnContentClick: {
      type: Boolean,
      default: true
    },
    disabled: Boolean,
    disableKeys: Boolean,
    maxHeight: {
      type: [Number, String],
      default: 'auto'
    },
    offsetX: Boolean,
    offsetY: Boolean,
    openOnHover: Boolean,
    origin: {
      type: String,
      default: 'top left'
    },
    transition: {
      type: [Boolean, String],
      default: 'v-menu-transition'
    },
    contentProps: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    onScroll: {
      type: Function,
      default: undefined
    }
  },
  emits: ['keydown', 'update:modelValue', 'update:return-value'],
  data: function data() {
    return {
      calculatedTopAuto: 0,
      defaultOffset: 8,
      hasJustFocused: false,
      listIndex: -1,
      resizeTimeout: 0,
      selectedIndex: null,
      tiles: []
    };
  },
  computed: {
    activeTile: function activeTile() {
      return this.tiles[this.listIndex];
    },
    calculatedLeft: function calculatedLeft() {
      var menuWidth = Math.max(this.dimensions.content.width, parseFloat(this.calculatedMinWidth));
      if (!this.auto) return this.calcLeft(menuWidth) || '0';
      return (0, _helpers.convertToUnit)(this.calcXOverflow(this.calcLeftAuto(), menuWidth)) || '0';
    },
    calculatedMaxHeight: function calculatedMaxHeight() {
      var height = this.auto ? '220px' : (0, _helpers.convertToUnit)(this.maxHeight);
      return height || '0';
    },
    calculatedMaxWidth: function calculatedMaxWidth() {
      return (0, _helpers.convertToUnit)(this.maxWidth) || '0';
    },
    calculatedMinWidth: function calculatedMinWidth() {
      if (this.minWidth) {
        return (0, _helpers.convertToUnit)(this.minWidth) || '0';
      }

      var minWidth = Math.min(this.dimensions.activator.width + Number(this.nudgeWidth) + (this.auto ? 16 : 0), Math.max(this.pageWidth - 24, 0));
      var calculatedMaxWidth = isNaN(parseInt(this.calculatedMaxWidth)) ? minWidth : parseInt(this.calculatedMaxWidth);
      return (0, _helpers.convertToUnit)(Math.min(calculatedMaxWidth, minWidth)) || '0';
    },
    calculatedTop: function calculatedTop() {
      var top = !this.auto ? this.calcTop() : (0, _helpers.convertToUnit)(this.calcYOverflow(this.calculatedTopAuto));
      return top || '0';
    },
    hasClickableTiles: function hasClickableTiles() {
      return Boolean(this.tiles.find(function (tile) {
        return tile.tabIndex > -1;
      }));
    },
    styles: function styles() {
      return {
        maxHeight: this.calculatedMaxHeight,
        minWidth: this.calculatedMinWidth,
        maxWidth: this.calculatedMaxWidth,
        top: this.calculatedTop,
        left: this.calculatedLeft,
        transformOrigin: this.origin,
        zIndex: this.zIndex || this.activeZIndex
      };
    }
  },
  watch: {
    isActive: function isActive(val) {
      if (!val) this.listIndex = -1;
    },
    isContentActive: function isContentActive(val) {
      this.hasJustFocused = val;
    },
    listIndex: function listIndex(next, prev) {
      if (next in this.tiles) {
        var tile = this.tiles[next];
        tile.classList.add('v-list-item--highlighted');
        var scrollTop = this.$refs.content.scrollTop;
        var contentHeight = this.$refs.content.clientHeight;

        if (scrollTop > tile.offsetTop - 8) {
          (0, _goto.default)(tile.offsetTop - tile.clientHeight, {
            appOffset: false,
            duration: 300,
            container: this.$refs.content
          });
        } else if (scrollTop + contentHeight < tile.offsetTop + tile.clientHeight + 8) {
          (0, _goto.default)(tile.offsetTop - contentHeight + tile.clientHeight * 2, {
            appOffset: false,
            duration: 300,
            container: this.$refs.content
          });
        }
      }

      prev in this.tiles && this.tiles[prev].classList.remove('v-list-item--highlighted');
    }
  },
  created: function created() {
    var _this = this;

    var breakingProps = [['value', 'modelValue'], ['onInput', 'onUpdate:modelValue']];
    /* istanbul ignore next */

    breakingProps.forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          original = _ref2[0],
          replacement = _ref2[1];

      if (_this.$attrs.hasOwnProperty(original)) (0, _console.breaking)(original, replacement, _this);
    });
    /* istanbul ignore next */

    if (this.$attrs.hasOwnProperty('full-width')) {
      (0, _console.removed)('full-width', this);
    }
  },
  mounted: function mounted() {
    this.isActive && this.callActivate();
  },
  methods: {
    activate: function activate() {
      var _this2 = this;

      // Update coordinates and dimensions of menu
      // and its activator
      this.updateDimensions(); // Start the transition

      requestAnimationFrame(function () {
        // Once transitioning, calculate scroll and top position
        _this2.startTransition().then(function () {
          if (_this2.$refs.content) {
            _this2.calculatedTopAuto = _this2.calcTopAuto();
            _this2.auto && (_this2.$refs.content.scrollTop = _this2.calcScrollPosition());
          }
        });
      });
    },
    calcScrollPosition: function calcScrollPosition() {
      var $el = this.$refs.content;
      var activeTile = $el.querySelector('.v-list-item--active');
      var maxScrollTop = $el.scrollHeight - $el.offsetHeight;
      return activeTile ? Math.min(maxScrollTop, Math.max(0, activeTile.offsetTop - $el.offsetHeight / 2 + activeTile.offsetHeight / 2)) : $el.scrollTop;
    },
    calcLeftAuto: function calcLeftAuto() {
      return parseInt(this.dimensions.activator.left - this.defaultOffset * 2);
    },
    calcTopAuto: function calcTopAuto() {
      var $el = this.$refs.content;
      var activeTile = $el.querySelector('.v-list-item--active');

      if (!activeTile) {
        this.selectedIndex = null;
      }

      if (this.offsetY || !activeTile) {
        return this.computedTop;
      }

      this.selectedIndex = Array.from(this.tiles).indexOf(activeTile);
      var tileDistanceFromMenuTop = activeTile.offsetTop - this.calcScrollPosition();
      var firstTileOffsetTop = $el.querySelector('.v-list-item').offsetTop;
      return this.computedTop - tileDistanceFromMenuTop - firstTileOffsetTop - 1;
    },
    changeListIndex: function changeListIndex(e) {
      // For infinite scroll and autocomplete, re-evaluate children
      this.getTiles();

      if (!this.isActive || !this.hasClickableTiles) {
        return;
      } else if (e.keyCode === _helpers.keyCodes.tab) {
        this.isActive = false;
        return;
      } else if (e.keyCode === _helpers.keyCodes.down) {
        this.nextTile();
      } else if (e.keyCode === _helpers.keyCodes.up) {
        this.prevTile();
      } else if (e.keyCode === _helpers.keyCodes.end) {
        this.lastTile();
      } else if (e.keyCode === _helpers.keyCodes.home) {
        this.firstTile();
      } else if (e.keyCode === _helpers.keyCodes.enter && this.listIndex !== -1) {
        this.tiles[this.listIndex].click();
      } else {
        return;
      } // One of the conditions was met, prevent default action (#2988)


      e.preventDefault();
    },
    closeConditional: function closeConditional(e) {
      var target = e.target;
      return this.isActive && !this._isDestroyed && this.closeOnClick && this.$refs.content && !this.$refs.content.contains(target);
    },
    genActivatorAttributes: function genActivatorAttributes() {
      var attributes = _activatable.default.methods.genActivatorAttributes.call(this);

      if (this.activeTile && this.activeTile.id) {
        return _objectSpread(_objectSpread({}, attributes), {}, {
          'aria-activedescendant': this.activeTile.id
        });
      }

      return attributes;
    },
    genActivatorListeners: function genActivatorListeners() {
      var listeners = _menuable.default.methods.genActivatorListeners.call(this);

      if (!this.disableKeys) {
        listeners.onKeydown = this.onKeyDown;
      }

      return listeners;
    },
    genTransition: function genTransition() {
      var content = this.genContent();
      if (!this.transition) return content;
      return (0, _vue.h)(_vue.Transition, {
        name: this.transition
      }, [content]);
    },
    genDirectives: function genDirectives() {
      var _this3 = this;

      var directives = [[_vue.vShow, this.isContentActive]]; // Do not add click outside for hover menu

      if (!this.openOnHover && this.closeOnClick) {
        directives.push([_clickOutside.default, {
          handler: function handler() {
            _this3.isActive = false;
          },
          closeConditional: this.closeConditional,
          include: function include() {
            return [_this3.$el].concat(_toConsumableArray(_this3.getOpenDependentElements()));
          }
        }]);
      }

      return directives;
    },
    genContent: function genContent() {
      var _this4 = this;

      var options = _objectSpread(_objectSpread(_objectSpread({}, this.getScopeIdAttrs()), this.contentProps), {}, {
        role: 'role' in this.$attrs ? this.$attrs.role : 'menu',
        class: ['v-menu__content', _objectSpread(_objectSpread(_objectSpread({}, this.rootThemeClasses), this.roundedClasses), {}, _defineProperty({
          'v-menu__content--auto': this.auto,
          'v-menu__content--fixed': this.activatorFixed,
          menuable__content__active: this.isActive
        }, this.contentClass.trim(), true))],
        style: this.styles,
        ref: 'content',
        onClick: function onClick(e) {
          var target = e.target;
          if (target.getAttribute('disabled')) return;
          if (_this4.closeOnContentClick) _this4.isActive = false;
        },
        onKeydown: this.onKeyDown
      });

      if (this.onScroll) {
        options.onScroll = this.onScroll;
      }

      if (!this.disabled && this.openOnHover) {
        options.onMouseenter = this.mouseEnterHandler;
      }

      if (this.openOnHover) {
        options.onMouseleave = this.mouseLeaveHandler;
      }

      var directives = this.genDirectives();
      return (0, _vue.withDirectives)((0, _vue.h)('div', options, this.getContentSlot()), directives);
    },
    getTiles: function getTiles() {
      if (!this.$refs.content) return;
      this.tiles = Array.from(this.$refs.content.querySelectorAll('.v-list-item, .v-divider, .v-subheader'));
    },
    mouseEnterHandler: function mouseEnterHandler() {
      var _this5 = this;

      this.runDelay('open', function () {
        if (_this5.hasJustFocused) return;
        _this5.hasJustFocused = true;
      });
    },
    mouseLeaveHandler: function mouseLeaveHandler(e) {
      var _this6 = this;

      // Prevent accidental re-activation
      this.runDelay('close', function () {
        var _a;

        if ((_a = _this6.$refs.content) === null || _a === void 0 ? void 0 : _a.contains(e.relatedTarget)) return;
        requestAnimationFrame(function () {
          _this6.isActive = false;

          _this6.callDeactivate();
        });
      });
    },
    nextTile: function nextTile() {
      var tile = this.tiles[this.listIndex + 1];

      if (!tile) {
        if (!this.tiles.length) return;
        this.listIndex = -1;
        this.nextTile();
        return;
      }

      this.listIndex++;
      if (tile.tabIndex === -1) this.nextTile();
    },
    prevTile: function prevTile() {
      var tile = this.tiles[this.listIndex - 1];

      if (!tile) {
        if (!this.tiles.length) return;
        this.listIndex = this.tiles.length;
        this.prevTile();
        return;
      }

      this.listIndex--;
      if (tile.tabIndex === -1) this.prevTile();
    },
    lastTile: function lastTile() {
      var tile = this.tiles[this.tiles.length - 1];
      if (!tile) return;
      this.listIndex = this.tiles.length - 1;
      if (tile.tabIndex === -1) this.prevTile();
    },
    firstTile: function firstTile() {
      var tile = this.tiles[0];
      if (!tile) return;
      this.listIndex = 0;
      if (tile.tabIndex === -1) this.nextTile();
    },
    onKeyDown: function onKeyDown(e) {
      var _this7 = this;

      if (this.disableKeys) return;

      if (e.keyCode === _helpers.keyCodes.esc) {
        // Wait for dependent elements to close first
        setTimeout(function () {
          _this7.isActive = false;
        });
        var activator = this.getActivator();
        this.$nextTick(function () {
          return activator && activator.focus();
        });
      } else if (!this.isActive && [_helpers.keyCodes.up, _helpers.keyCodes.down].includes(e.keyCode)) {
        this.isActive = true;
      } // Allow for isActive watcher to generate tile list


      this.$nextTick(function () {
        return _this7.changeListIndex(e);
      });
    },
    onResize: function onResize() {
      if (!this.isActive) return; // Account for screen resize
      // and orientation change
      // eslint-disable-next-line no-unused-expressions

      this.$refs.content.offsetWidth;
      this.updateDimensions(); // When resizing to a smaller width
      // content width is evaluated before
      // the new activator width has been
      // set, causing it to not size properly
      // hacky but will revisit in the future

      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = window.setTimeout(this.updateDimensions, 100);
    }
  },
  render: function render() {
    var _this8 = this;

    var data = {
      class: ['v-menu', {
        'v-menu--attached': this.attach === '' || this.attach === true || this.attach === 'attach'
      }]
    };
    var directives = [[_resize.default, this.onResize, '500']]; // console.log('vmenurender', this, this.activator, this.getActivator())

    return (0, _vue.withDirectives)((0, _vue.h)('div', data, [!this.activator && this.genActivator(), this.showLazyContent(function () {
      return [(0, _vue.h)(_VThemeProvider.VThemeProvider, {
        root: true,
        light: _this8.light,
        dark: _this8.dark
      }, [_this8.genTransition()])];
    })]), directives);
  }
});

exports.default = _default2;
//# sourceMappingURL=VMenu.js.map