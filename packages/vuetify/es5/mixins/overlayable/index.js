"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _VOverlay = _interopRequireDefault(require("../../components/VOverlay"));

var _helpers = require("../../util/helpers");

var _vue = require("vue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* @vue/component */
var _default = (0, _vue.defineComponent)({
  name: 'overlayable',
  props: {
    hideOverlay: Boolean,
    overlayColor: String,
    overlayOpacity: [Number, String]
  },
  data: function data() {
    return {
      animationFrame: 0,
      overlay: null
    };
  },
  watch: {
    hideOverlay: function hideOverlay(value) {
      if (!this.isActive) return;
      if (value) this.removeOverlay();else this.genOverlay();
    }
  },
  beforeUnmount: function beforeUnmount() {
    this.removeOverlay();
  },
  methods: {
    createOverlay: function createOverlay() {
      // Create a container element
      var container = document.createElement('div');
      var props = {
        absolute: this.absolute,
        color: this.overlayColor,
        opacity: this.overlayOpacity
      };
      var wrapper = {
        data: function data() {
          return {
            value: false,
            zIndex: undefined
          };
        },
        render: function render() {
          return (0, _vue.h)(_VOverlay.default, _objectSpread({
            modelValue: this.value,
            zIndex: this.zIndex
          }, props));
        }
      }; // // Create the overlay app
      // const overlayApp = createApp(VOverlay, {
      //   absolute: this.absolute,
      //   value: false,
      //   color: this.overlayColor,
      //   opacity: this.overlayOpacity,
      // });

      var overlayApp = (0, _vue.createApp)(wrapper); // Mount the app to the container

      var overlayInstance = overlayApp.mount(container); // Determine the parent element

      var parent = this.absolute ? this.$el.parentNode : document.querySelector('[data-app]');

      if (parent) {
        parent.insertBefore(container, parent.firstChild);
      }

      this.overlay = overlayInstance;
      this.overlayApp = overlayApp;
    },
    genOverlay: function genOverlay() {
      var _this = this;

      this.hideScroll();
      if (this.hideOverlay) return;
      if (!this.overlay) this.createOverlay();
      this.animationFrame = requestAnimationFrame(function () {
        if (!_this.overlay) return;

        if (_this.activeZIndex !== undefined) {
          _this.overlay.zIndex = String(_this.activeZIndex - 1);
        } else if (_this.$el) {
          _this.overlay.zIndex = (0, _helpers.getZIndex)(_this.$el);
        }

        _this.overlay.value = true;
      });
      return true;
    },

    /** removeOverlay(false) will not restore the scollbar afterwards */
    removeOverlay: function removeOverlay() {
      var _this2 = this;

      var showScroll = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (this.overlay) {
        (0, _helpers.addOnceEventListener)(this.overlay.$el, 'transitionend', function () {
          if (!_this2.overlay || !_this2.overlay.$el || !_this2.overlay.$el.parentNode || _this2.overlay.value || _this2.isActive) return;

          _this2.overlay.$el.parentNode.removeChild(_this2.overlay.$el);

          _this2.overlayApp.unmount();

          _this2.overlayApp = null;
          _this2.overlay = null;
        }); // Cancel animation frame in case
        // overlay is removed before it
        // has finished its animation

        cancelAnimationFrame(this.animationFrame);
        this.overlay.value = false;
      }

      showScroll && this.showScroll();
    },
    scrollListener: function scrollListener(e) {
      if ('key' in e) {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || // https://github.com/vuetifyjs/vuetify/issues/4715
        e.target.isContentEditable) return;
        var up = [_helpers.keyCodes.up, _helpers.keyCodes.pageup];
        var down = [_helpers.keyCodes.down, _helpers.keyCodes.pagedown];

        if (up.includes(e.keyCode)) {
          e.deltaY = -1;
        } else if (down.includes(e.keyCode)) {
          e.deltaY = 1;
        } else {
          return;
        }
      }

      if (e.target === this.overlay || e.type !== 'keydown' && e.target === document.body || this.checkPath(e)) e.preventDefault();
    },
    hasScrollbar: function hasScrollbar(el) {
      if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;
      var style = window.getComputedStyle(el);
      return (['auto', 'scroll'].includes(style.overflowY) || el.tagName === 'SELECT') && el.scrollHeight > el.clientHeight || ['auto', 'scroll'].includes(style.overflowX) && el.scrollWidth > el.clientWidth;
    },
    shouldScroll: function shouldScroll(el, e) {
      if (el.hasAttribute('data-app')) return false;
      var dir = e.shiftKey || e.deltaX ? 'x' : 'y';
      var delta = dir === 'y' ? e.deltaY : e.deltaX || e.deltaY;
      var alreadyAtStart;
      var alreadyAtEnd;

      if (dir === 'y') {
        alreadyAtStart = el.scrollTop === 0;
        alreadyAtEnd = el.scrollTop + el.clientHeight === el.scrollHeight;
      } else {
        alreadyAtStart = el.scrollLeft === 0;
        alreadyAtEnd = el.scrollLeft + el.clientWidth === el.scrollWidth;
      }

      var scrollingUp = delta < 0;
      var scrollingDown = delta > 0;
      if (!alreadyAtStart && scrollingUp) return true;
      if (!alreadyAtEnd && scrollingDown) return true;

      if ((alreadyAtStart || alreadyAtEnd) && el.parentNode) {
        return this.shouldScroll(el.parentNode, e);
      }

      return false;
    },
    isInside: function isInside(el, parent) {
      if (el === parent) {
        return true;
      } else if (el === null || el === document.body) {
        return false;
      } else {
        return this.isInside(el.parentNode, parent);
      }
    },
    checkPath: function checkPath(e) {
      var path = (0, _helpers.composedPath)(e);

      if (e.type === 'keydown' && path[0] === document.body) {
        var dialog = this.$refs.dialog; // getSelection returns null in firefox in some edge cases, can be ignored

        var selected = window.getSelection().anchorNode;

        if (dialog && this.hasScrollbar(dialog) && this.isInside(selected, dialog)) {
          return !this.shouldScroll(dialog, e);
        }

        return true;
      }

      for (var index = 0; index < path.length; index++) {
        var el = path[index];
        if (el === document) return true;
        if (el === document.documentElement) return true;
        if (el === this.$refs.content) return true;
        if (this.hasScrollbar(el)) return !this.shouldScroll(el, e);
      }

      return true;
    },
    hideScroll: function hideScroll() {
      if (this.$vuetify.breakpoint.smAndDown) {
        document.documentElement.classList.add('overflow-y-hidden');
      } else {
        (0, _helpers.addPassiveEventListener)(window, 'wheel', this.scrollListener, {
          passive: false
        });
        window.addEventListener('keydown', this.scrollListener);
      }
    },
    showScroll: function showScroll() {
      document.documentElement.classList.remove('overflow-y-hidden');
      window.removeEventListener('wheel', this.scrollListener);
      window.removeEventListener('keydown', this.scrollListener);
    }
  }
});

exports.default = _default;
//# sourceMappingURL=index.js.map