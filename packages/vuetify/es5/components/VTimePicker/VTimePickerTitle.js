"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

require("../../../src/components/VTimePicker/VTimePickerTitle.sass");

var _pickerButton = _interopRequireDefault(require("../../mixins/picker-button"));

var _pad = _interopRequireDefault(require("../VDatePicker/util/pad"));

var _mixins = _interopRequireDefault(require("../../util/mixins"));

var _SelectingTimes = require("./SelectingTimes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Mixins
// Utils
var _default = (0, _mixins.default)(_pickerButton.default
/* @vue/component */
).extend({
  name: 'v-time-picker-title',
  props: {
    ampm: Boolean,
    ampmReadonly: Boolean,
    disabled: Boolean,
    hour: Number,
    minute: Number,
    second: Number,
    period: {
      type: String,
      validator: function validator(period) {
        return period === 'am' || period === 'pm';
      }
    },
    readonly: Boolean,
    useSeconds: Boolean,
    selecting: Number
  },
  emits: ['update:selecting', 'update:period'],
  methods: {
    genTime: function genTime() {
      var hour = this.hour;

      if (this.ampm) {
        hour = hour ? (hour - 1) % 12 + 1 : 12;
      }

      var displayedHour = this.hour == null ? '--' : this.ampm ? String(hour) : (0, _pad.default)(hour);
      var displayedMinute = this.minute == null ? '--' : (0, _pad.default)(this.minute);
      var titleContent = [this.genPickerButton('selecting', _SelectingTimes.SelectingTimes.Hour, displayedHour, this.disabled), (0, _vue.h)('span', ':'), this.genPickerButton('selecting', _SelectingTimes.SelectingTimes.Minute, displayedMinute, this.disabled)];

      if (this.useSeconds) {
        var displayedSecond = this.second == null ? '--' : (0, _pad.default)(this.second);
        titleContent.push((0, _vue.h)('span', ':'));
        titleContent.push(this.genPickerButton('selecting', _SelectingTimes.SelectingTimes.Second, displayedSecond, this.disabled));
      }

      return (0, _vue.h)('div', {
        class: 'v-time-picker-title__time'
      }, titleContent);
    },
    genAmPm: function genAmPm() {
      return (0, _vue.h)('div', {
        class: {
          'v-time-picker-title__ampm': true,
          'v-time-picker-title__ampm--readonly': this.ampmReadonly
        }
      }, [!this.ampmReadonly || this.period === 'am' ? this.genPickerButton('period', 'am', this.$vuetify.lang.t('$vuetify.timePicker.am'), this.disabled || this.readonly) : null, !this.ampmReadonly || this.period === 'pm' ? this.genPickerButton('period', 'pm', this.$vuetify.lang.t('$vuetify.timePicker.pm'), this.disabled || this.readonly) : null]);
    }
  },
  render: function render() {
    var children = [this.genTime()];
    this.ampm && children.push(this.genAmPm());
    return (0, _vue.h)('div', {
      class: 'v-time-picker-title'
    }, children);
  }
});

exports.default = _default;
//# sourceMappingURL=VTimePickerTitle.js.map