export default (directive => {
  const activeMap = new WeakMap();
  const {
    mounted,
    unmounted,
    updated
  } = directive;

  const wrappedMounted = (...args) => {
    const binding = args[1];
    activeMap.set(args[0], binding.value.isDirActive);
    if (binding.value.isDirActive === false) return;
    mounted(...args);
  };

  const wrappedUnmounted = (...args) => {
    const binding = args[1];
    activeMap.set(args[0], binding.value.isDirActive);
    if (binding.value.isDirActive === false) return;
    unmounted(...args);
  };

  const wrappedUpdated = (...args) => {
    const isDirActive = activeMap.get(args[0]);
    if (isDirActive === undefined) return updated(...args);
    const binding = args[1];

    if (!isDirActive && binding.value.isDirActive) {
      mounted(...args);
      activeMap.set(args[0], binding.value.isDirActive);
      return;
    }

    if (isDirActive && !binding.value.isDirActive) {
      unmounted(...args);
      activeMap.set(args[0], binding.value.isDirActive);
      return;
    }

    updated(...args);
  };

  return Object.fromEntries(Object.entries({
    mounted: wrappedMounted,
    unmounted: wrappedUnmounted,
    updated: wrappedUpdated
  }).filter(([name, fn]) => directive[name]));
});
//# sourceMappingURL=make-directive-activatable.js.map