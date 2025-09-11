"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _default = function _default(directive) {
  var activeMap = new WeakMap();
  var mounted = directive.mounted,
      unmounted = directive.unmounted,
      updated = directive.updated;

  var wrappedMounted = function wrappedMounted() {
    var binding = arguments.length <= 1 ? undefined : arguments[1];
    activeMap.set(arguments.length <= 0 ? undefined : arguments[0], binding.value.isDirActive);
    if (binding.value.isDirActive === false) return;
    mounted.apply(void 0, arguments);
  };

  var wrappedUnmounted = function wrappedUnmounted() {
    var binding = arguments.length <= 1 ? undefined : arguments[1];
    activeMap.set(arguments.length <= 0 ? undefined : arguments[0], binding.value.isDirActive);
    if (binding.value.isDirActive === false) return;
    unmounted.apply(void 0, arguments);
  };

  var wrappedUpdated = function wrappedUpdated() {
    var isDirActive = activeMap.get(arguments.length <= 0 ? undefined : arguments[0]);
    if (isDirActive === undefined) return updated.apply(void 0, arguments);
    var binding = arguments.length <= 1 ? undefined : arguments[1];

    if (!isDirActive && binding.value.isDirActive) {
      mounted.apply(void 0, arguments);
      activeMap.set(arguments.length <= 0 ? undefined : arguments[0], binding.value.isDirActive);
      return;
    }

    if (isDirActive && !binding.value.isDirActive) {
      unmounted.apply(void 0, arguments);
      activeMap.set(arguments.length <= 0 ? undefined : arguments[0], binding.value.isDirActive);
      return;
    }

    updated.apply(void 0, arguments);
  };

  return Object.fromEntries(Object.entries({
    mounted: wrappedMounted,
    unmounted: wrappedUnmounted,
    updated: wrappedUpdated
  }).filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        name = _ref2[0],
        fn = _ref2[1];

    return directive[name];
  }));
};

exports.default = _default;
//# sourceMappingURL=make-directive-activatable.js.map