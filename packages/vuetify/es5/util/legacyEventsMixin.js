"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legacyEventsMixin = void 0;
// Legacy events mixin for Vue 3 migration
// Provides $on, $off, and $emitLegacy methods to maintain compatibility with Vue 2 code
var legacyEventsMixin = {
  methods: {
    $emitLegacy: function $emitLegacy(eventName, args) {
      if (!this.eventsLegacy || !this.eventsLegacy[eventName]) return;
      this.eventsLegacy[eventName].forEach(function (listener) {
        return listener(args);
      });
    },
    $on: function $on(eventName, listener) {
      var _a;

      this.eventsLegacy || (this.eventsLegacy = {});
      (_a = this.eventsLegacy)[eventName] || (_a[eventName] = []);
      this.eventsLegacy[eventName].push(listener); // console.warn("$on is not available")
    },
    $off: function $off(eventName, listener) {
      if (this.eventsLegacy && this.eventsLegacy[eventName]) {
        this.eventsLegacy[eventName] = this.eventsLegacy[eventName].filter(function (_listener) {
          return _listener !== listener;
        });
      } // console.warn('$off is not available')

    }
  },
  computed: {
    $listeners: function $listeners() {
      var _this = this;

      var names = Object.keys(this.$attrs).filter(function (name) {
        return name.startsWith('on');
      });
      return names.reduce(function (listeners, name) {
        listeners[name] = _this.$attrs[name];
        return listeners;
      }, {});
    }
  }
};
exports.legacyEventsMixin = legacyEventsMixin;
//# sourceMappingURL=legacyEventsMixin.js.map