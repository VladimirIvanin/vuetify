"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

require("../../../src/components/VDatePicker/VDatePickerTitle.sass");

var _VIcon = _interopRequireDefault(require("../VIcon"));

var _pickerButton = _interopRequireDefault(require("../../mixins/picker-button"));

var _mixins = _interopRequireDefault(require("../../util/mixins"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Components
// Mixins
// Utils
var _default = (0, _mixins.default)(_pickerButton.default
/* @vue/component */
).extend({
  name: 'v-date-picker-title',
  props: {
    date: {
      type: String,
      default: ''
    },
    disabled: Boolean,
    readonly: Boolean,
    selectingYear: Boolean,
    modelValue: {
      type: String
    },
    year: {
      type: [Number, String],
      default: ''
    },
    yearIcon: {
      type: String
    }
  },
  emits: ['update:selecting-year'],
  data: function data() {
    return {
      isReversing: false
    };
  },
  computed: {
    computedTransition: function computedTransition() {
      return this.isReversing ? 'picker-reverse-transition' : 'picker-transition';
    }
  },
  watch: {
    modelValue: function modelValue(val, prev) {
      this.isReversing = val < prev;
    }
  },
  methods: {
    genYearIcon: function genYearIcon() {
      var _this = this;

      return (0, _vue.h)(_VIcon.default, {
        dark: true
      }, function () {
        return _this.yearIcon;
      });
    },
    getYearBtn: function getYearBtn() {
      return this.genPickerButton('selectingYear', true, [String(this.year), this.yearIcon ? this.genYearIcon() : null], false, 'v-date-picker-title__year');
    },
    genTitleText: function genTitleText() {
      var _this2 = this;

      return (0, _vue.h)(_vue.Transition, {
        name: this.computedTransition
      }, function () {
        return [(0, _vue.h)('div', {
          innerHTML: _this2.date || '&nbsp;',
          key: _this2.modelValue
        })];
      });
    },
    genTitleDate: function genTitleDate() {
      return this.genPickerButton('selectingYear', false, [this.genTitleText()], false, 'v-date-picker-title__date');
    }
  },
  render: function render() {
    return (0, _vue.h)('div', {
      class: ['v-date-picker-title', {
        'v-date-picker-title--disabled': this.disabled
      }]
    }, [this.getYearBtn(), this.genTitleDate()]);
  }
});

exports.default = _default;
//# sourceMappingURL=VDatePickerTitle.js.map