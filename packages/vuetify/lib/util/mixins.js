/* eslint-disable max-len, import/export, no-use-before-define */
export default function mixins(...args) {
  return {
    extend(options) {
      return {
        mixins: args,
        ...options
      };
    }

  };
}
//# sourceMappingURL=mixins.js.map