"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.consoleInfo = consoleInfo;
exports.consoleWarn = consoleWarn;
exports.consoleError = consoleError;
exports.deprecate = deprecate;
exports.breaking = breaking;
exports.removed = removed;

var _framework = _interopRequireDefault(require("../framework"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function createMessage(message, vm, parent) {
  if (_framework.default.config.silent) return;

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

  return "[Vuetify] ".concat(message) + (vm ? generateComponentTrace(vm) : '');
}

function consoleInfo(message, vm, parent) {
  var newMessage = createMessage(message, vm, parent);
  newMessage != null && console.info(newMessage);
}

function consoleWarn(message, vm, parent) {
  var newMessage = createMessage(message, vm, parent);
  newMessage != null && console.warn(newMessage);
}

function consoleError(message, vm, parent) {
  var newMessage = createMessage(message, vm, parent);
  newMessage != null && console.error(newMessage);
}

function deprecate(original, replacement, vm, parent) {
  consoleWarn("[UPGRADE] '".concat(original, "' is deprecated, use '").concat(replacement, "' instead."), vm, parent);
}

function breaking(original, replacement, vm, parent) {
  consoleError("[BREAKING] '".concat(original, "' has been removed, use '").concat(replacement, "' instead."), vm, parent);
}

function removed(original, vm, parent) {
  consoleWarn("[REMOVED] '".concat(original, "' has been removed. You can safely omit it."), vm, parent);
}
/**
 * Shamelessly stolen from vuejs/vue/blob/dev/src/core/util/debug.js
 */


var classifyRE = /(?:^|[-_])(\w)/g;

var classify = function classify(str) {
  return str.replace(classifyRE, function (c) {
    return c.toUpperCase();
  }).replace(/[-_]/g, '');
};

function formatComponentName(vm) {
  var _a, _b, _c;

  if (vm === ((_c = (_b = (_a = vm === null || vm === void 0 ? void 0 : vm.appContext) === null || _a === void 0 ? void 0 : _a.app) === null || _b === void 0 ? void 0 : _b._instance) === null || _c === void 0 ? void 0 : _c.proxy)) {
    return '<Root>';
  }

  var _extractComponentInfo = extractComponentInfo(vm),
      name = _extractComponentInfo.name;

  var additionalInfo = getAdditionalVue3Info(vm);
  var componentName = name ? "<".concat(classify(name), ">") : '<Anonymous>';
  var additionalInfoStr = additionalInfo.length > 0 ? " (".concat(additionalInfo.join(', '), ")") : '';
  return componentName + additionalInfoStr;
}

function extractComponentInfo(vm) {
  var _a;

  var options = (vm === null || vm === void 0 ? void 0 : vm.$options) || ((_a = vm === null || vm === void 0 ? void 0 : vm.vnode) === null || _a === void 0 ? void 0 : _a.type) || (vm === null || vm === void 0 ? void 0 : vm.type) || vm || {};
  return {
    name: options.name
  };
}

function getAdditionalVue3Info(vm) {
  var additionalInfo = [];

  if ((vm === null || vm === void 0 ? void 0 : vm.props) && _typeof(vm.props) === 'object') {
    var propKeys = Object.keys(vm.props).slice(0, 3);

    if (propKeys.length > 0) {
      additionalInfo.push("props: ".concat(propKeys.join(', ')).concat(Object.keys(vm.props).length > 3 ? '...' : ''));
    }
  }

  if ((vm === null || vm === void 0 ? void 0 : vm.setupState) && _typeof(vm.setupState) === 'object') {
    var setupKeys = Object.keys(vm.setupState).slice(0, 2);

    if (setupKeys.length > 0) {
      additionalInfo.push("setup: ".concat(setupKeys.join(', ')).concat(Object.keys(vm.setupState).length > 2 ? '...' : ''));
    }
  }

  return additionalInfo;
}

function generateComponentTrace(vm) {
  if ((vm === null || vm === void 0 ? void 0 : vm.parent) || (vm === null || vm === void 0 ? void 0 : vm.$parent)) {
    var tree = [];
    var currentRecursiveSequence = 0;
    var currentVm = vm;

    while (currentVm) {
      if (tree.length > 0) {
        var last = tree[tree.length - 1];

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

    return '\n\nfound in\n\n' + tree.map(function (vm, i) {
      return "".concat(i === 0 ? '---> ' : ' '.repeat(5 + i * 2)).concat(Array.isArray(vm) ? "".concat(formatComponentName(vm[0]), "... (").concat(vm[1], " recursive calls)") : formatComponentName(vm));
    }).join('\n');
  } else {
    return "\n\n(found in ".concat(formatComponentName(vm), ")");
  }
}
//# sourceMappingURL=console.js.map