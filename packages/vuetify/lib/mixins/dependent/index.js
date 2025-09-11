import mixins from '../../util/mixins';

function searchChildren(children) {
  var _a, _b;

  const results = [];

  for (let index = 0; index < children.length; index++) {
    const child = children[index];

    if (child.isActive && child.isDependent) {
      results.push(child);
    } else {
      results.push(...searchChildren(((_b = (_a = child.children) === null || _a === void 0 ? void 0 : _a.default) === null || _b === void 0 ? void 0 : _b.call(_a)) || []));
    }
  }

  return results;
}
/* @vue/component */


export default mixins().extend({
  name: 'dependent',

  data() {
    return {
      closeDependents: true,
      isActive: false,
      isDependent: true
    };
  },

  watch: {
    isActive(val) {
      if (val) return;
      const openDependents = this.getOpenDependents();

      for (let index = 0; index < openDependents.length; index++) {
        openDependents[index].isActive = false;
      }
    }

  },
  methods: {
    getOpenDependents() {
      var _a, _b;

      const node = (_b = (_a = this.$slots).default) === null || _b === void 0 ? void 0 : _b.call(_a);
      if (!node) return [];
      if (this.closeDependents) return searchChildren(node);
      return [];
    },

    getOpenDependentElements() {
      const result = [];
      const openDependents = this.getOpenDependents();

      for (let index = 0; index < openDependents.length; index++) {
        result.push(...openDependents[index].getClickableDependentElements());
      }

      return result;
    },

    getClickableDependentElements() {
      const result = [this.$el];
      if (this.$refs.content) result.push(this.$refs.content);
      if (this.overlay) result.push(this.overlay.$el);
      result.push(...this.getOpenDependentElements());
      return result;
    }

  }
});
//# sourceMappingURL=index.js.map