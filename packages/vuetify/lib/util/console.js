/* eslint-disable no-console */
import Vuetify from '../framework';

function createMessage(message, vm, parent) {
  if (Vuetify.config.silent) return;

  if (parent) {
    vm = {
      _isVue: true,
      $parent: parent,
      $options: vm
    };
  }

  if (vm) {
    vm.$_alreadyWarned = vm.$_alreadyWarned || [];
    if (vm.$_alreadyWarned.includes(message)) return;
    vm.$_alreadyWarned.push(message);
  }

  return `[Vuetify] ${message}` + (vm ? generateComponentTrace(vm) : '');
}

export function consoleInfo(message, vm, parent) {
  const newMessage = createMessage(message, vm, parent);
  newMessage != null && console.info(newMessage);
}
export function consoleWarn(message, vm, parent) {
  const newMessage = createMessage(message, vm, parent);
  newMessage != null && console.warn(newMessage);
}
export function consoleError(message, vm, parent) {
  const newMessage = createMessage(message, vm, parent);
  newMessage != null && console.error(newMessage);
}
export function deprecate(original, replacement, vm, parent) {
  consoleWarn(`[UPGRADE] '${original}' is deprecated, use '${replacement}' instead.`, vm, parent);
}
export function breaking(original, replacement, vm, parent) {
  consoleError(`[BREAKING] '${original}' has been removed, use '${replacement}' instead.`, vm, parent);
}
export function removed(original, vm, parent) {
  consoleWarn(`[REMOVED] '${original}' has been removed. You can safely omit it.`, vm, parent);
}
/**
 * Shamelessly stolen from vuejs/vue/blob/dev/src/core/util/debug.js
 */

const classifyRE = /(?:^|[-_])(\w)/g;

const classify = str => str.replace(classifyRE, c => c.toUpperCase()).replace(/[-_]/g, '');

function formatComponentName(vm) {
  var _a, _b, _c;

  if (vm === ((_c = (_b = (_a = vm === null || vm === void 0 ? void 0 : vm.appContext) === null || _a === void 0 ? void 0 : _a.app) === null || _b === void 0 ? void 0 : _b._instance) === null || _c === void 0 ? void 0 : _c.proxy)) {
    return '<Root>';
  }

  const {
    name
  } = extractComponentInfo(vm);
  const additionalInfo = getAdditionalVue3Info(vm);
  const componentName = name ? `<${classify(name)}>` : '<Anonymous>';
  const additionalInfoStr = additionalInfo.length > 0 ? ` (${additionalInfo.join(', ')})` : '';
  return componentName + additionalInfoStr;
}

function extractComponentInfo(vm) {
  var _a;

  const options = (vm === null || vm === void 0 ? void 0 : vm.$options) || ((_a = vm === null || vm === void 0 ? void 0 : vm.vnode) === null || _a === void 0 ? void 0 : _a.type) || (vm === null || vm === void 0 ? void 0 : vm.type) || vm || {};
  return {
    name: options.name
  };
}

function getAdditionalVue3Info(vm) {
  const additionalInfo = [];

  if ((vm === null || vm === void 0 ? void 0 : vm.props) && typeof vm.props === 'object') {
    const propKeys = Object.keys(vm.props).slice(0, 3);

    if (propKeys.length > 0) {
      additionalInfo.push(`props: ${propKeys.join(', ')}${Object.keys(vm.props).length > 3 ? '...' : ''}`);
    }
  }

  if ((vm === null || vm === void 0 ? void 0 : vm.setupState) && typeof vm.setupState === 'object') {
    const setupKeys = Object.keys(vm.setupState).slice(0, 2);

    if (setupKeys.length > 0) {
      additionalInfo.push(`setup: ${setupKeys.join(', ')}${Object.keys(vm.setupState).length > 2 ? '...' : ''}`);
    }
  }

  return additionalInfo;
}

function generateComponentTrace(vm) {
  if ((vm === null || vm === void 0 ? void 0 : vm.parent) || (vm === null || vm === void 0 ? void 0 : vm.$parent)) {
    const tree = [];
    let currentRecursiveSequence = 0;
    let currentVm = vm;

    while (currentVm) {
      if (tree.length > 0) {
        const last = tree[tree.length - 1];

        if (last.constructor === currentVm.constructor) {
          currentRecursiveSequence++;
          currentVm = currentVm.parent || currentVm.$parent;
          continue;
        } else if (currentRecursiveSequence > 0) {
          tree[tree.length - 1] = [last, currentRecursiveSequence];
          currentRecursiveSequence = 0;
        }
      }

      tree.push(currentVm);
      currentVm = currentVm.parent || currentVm.$parent;
    }

    return '\n\nfound in\n\n' + tree.map((vm, i) => `${i === 0 ? '---> ' : ' '.repeat(5 + i * 2)}${Array.isArray(vm) ? `${formatComponentName(vm[0])}... (${vm[1]} recursive calls)` : formatComponentName(vm)}`).join('\n');
  } else {
    return `\n\n(found in ${formatComponentName(vm)})`;
  }
}
//# sourceMappingURL=console.js.map