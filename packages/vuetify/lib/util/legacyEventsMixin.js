// Legacy events mixin for Vue 3 migration
// Provides $on, $off, and $emitLegacy methods to maintain compatibility with Vue 2 code
export const legacyEventsMixin = {
  methods: {
    $emitLegacy(eventName, args) {
      if (!this.eventsLegacy || !this.eventsLegacy[eventName]) return;
      this.eventsLegacy[eventName].forEach(listener => listener(args));
    },

    $on(eventName, listener) {
      var _a;

      this.eventsLegacy || (this.eventsLegacy = {});
      (_a = this.eventsLegacy)[eventName] || (_a[eventName] = []);
      this.eventsLegacy[eventName].push(listener); // console.warn("$on is not available")
    },

    $off(eventName, listener) {
      if (this.eventsLegacy && this.eventsLegacy[eventName]) {
        this.eventsLegacy[eventName] = this.eventsLegacy[eventName].filter(_listener => _listener !== listener);
      } // console.warn('$off is not available')

    }

  },
  computed: {
    $listeners() {
      const names = Object.keys(this.$attrs).filter(name => name.startsWith('on'));
      return names.reduce((listeners, name) => {
        listeners[name] = this.$attrs[name];
        return listeners;
      }, {});
    }

  }
};
//# sourceMappingURL=legacyEventsMixin.js.map