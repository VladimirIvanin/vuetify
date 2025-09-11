// Components
import VSimpleCheckbox from '../VCheckbox/VSimpleCheckbox';
import VDivider from '../VDivider';
import VSubheader from '../VSubheader';
import { VList, VListItem, VListItemAction, VListItemContent, VListItemTitle } from '../VList'; // Mixins

import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable'; // Helpers

import { getPropertyFromItem } from '../../util/helpers';
import { breaking } from '../../util/console'; // Types

import mixins from '../../util/mixins';
import { h } from 'vue';
/* @vue/component */

export default mixins(Colorable, Themeable).extend({
  name: 'v-select-list',
  props: {
    action: Boolean,
    dense: Boolean,
    hideSelected: Boolean,
    items: {
      type: Array,
      default: () => []
    },
    itemDisabled: {
      type: [String, Array, Function],
      default: 'disabled'
    },
    itemText: {
      type: [String, Array, Function],
      default: 'text'
    },
    itemValue: {
      type: [String, Array, Function],
      default: 'value'
    },
    noDataText: String,
    noFilter: Boolean,
    searchInput: null,
    selectedItems: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    parsedItems() {
      return this.selectedItems.map(item => this.getValue(item));
    },

    tileActiveClass() {
      return Object.keys(this.setTextColor(this.color).class || {}).join(' ');
    },

    staticNoDataTile() {
      const tile = {
        role: undefined,
        onMousedown: e => e.preventDefault() // Prevent onBlur from being called

      };
      return h(VListItem, tile, [this.genTileContent(this.noDataText)]);
    }

  },

  created() {
    const breakingProps = [['value', 'modelValue'], ['onInput', 'onUpdate:modelValue']];
    /* istanbul ignore next */

    breakingProps.forEach(([original, replacement]) => {
      if (this.$attrs.hasOwnProperty(original)) breaking(original, replacement, this);
    });
  },

  methods: {
    genAction(item, inputValue) {
      return h(VListItemAction, {}, () => [h(VSimpleCheckbox, {
        color: this.color,
        modelValue: inputValue,
        ripple: false,
        'onUpdate:modelValue': () => this.$emit('select', item)
      })]);
    },

    genDivider(props) {
      return h(VDivider, props);
    },

    genFilteredText(text) {
      text = text || '';
      if (!this.searchInput || this.noFilter) return text;
      const {
        start,
        middle,
        end
      } = this.getMaskedCharacters(text);
      return [start, this.genHighlight(middle), end];
    },

    genHeader(props) {
      return h(VSubheader, props, props.header);
    },

    genHighlight(text) {
      return h('span', {
        class: 'v-list-item__mask'
      }, text);
    },

    getMaskedCharacters(text) {
      const searchInput = (this.searchInput || '').toString().toLocaleLowerCase();
      const index = text.toLocaleLowerCase().indexOf(searchInput);
      if (index < 0) return {
        start: text,
        middle: '',
        end: ''
      };
      const start = text.slice(0, index);
      const middle = text.slice(index, index + searchInput.length);
      const end = text.slice(index + searchInput.length);
      return {
        start,
        middle,
        end
      };
    },

    genTile({
      item,
      index,
      disabled = null,
      value = false
    }) {
      if (!value) value = this.hasItem(item);

      if (item === Object(item)) {
        disabled = disabled !== null ? disabled : this.getDisabled(item);
      }

      const tile = {
        // Default behavior in list does not
        // contain aria-selected by default
        'aria-selected': String(value),
        id: `list-item-${this.$.uid}-${index}`,
        role: 'option',
        onMousedown: e => {
          // Prevent onBlur from being called
          e.preventDefault();
        },
        onClick: () => disabled || this.$emit('select', item),
        activeClass: this.tileActiveClass,
        disabled,
        ripple: true,
        modelValue: value,
        // Передаем scopeId атрибуты от родительского компонента
        ...Object.keys(this.$attrs).reduce((acc, key) => {
          if (key.startsWith('data-v-')) {
            acc[key] = this.$attrs[key];
          }

          return acc;
        }, {})
      };

      if (!this.$slots.item) {
        return h(VListItem, tile, [this.action && !this.hideSelected && this.items.length > 0 ? this.genAction(item, value) : null, this.genTileContent(item, index)]);
      }

      const parent = this;
      const {
        onClick,
        onMousedown,
        ...attrsWithoutEvents
      } = tile;
      const scopedSlot = this.$slots.item({
        parent,
        item,
        active: value,
        attrs: tile,
        on: {
          onMousedown,
          onClick
        }
      });
      return this.needsTile(scopedSlot) ? h(VListItem, tile, scopedSlot) : scopedSlot;
    },

    genTileContent(item, index = 0) {
      return h(VListItemContent, {}, () => [h(VListItemTitle, {}, () => [this.genFilteredText(this.getText(item))])]);
    },

    hasItem(item) {
      return this.parsedItems.indexOf(this.getValue(item)) > -1;
    },

    needsTile(slot) {
      const [vnode] = slot !== null && slot !== void 0 ? slot : [];
      if (!(slot === null || slot === void 0 ? void 0 : slot.length) || slot.length !== 1) return true;
      const {
        type
      } = vnode !== null && vnode !== void 0 ? vnode : {};
      const isComponent = type && typeof type === 'object';
      const isVListItem = isComponent && 'name' in type && type.name === 'v-list-item';
      return !isVListItem;
    },

    getDisabled(item) {
      return Boolean(getPropertyFromItem(item, this.itemDisabled, false));
    },

    getText(item) {
      return String(getPropertyFromItem(item, this.itemText, item));
    },

    getValue(item) {
      return getPropertyFromItem(item, this.itemValue, this.getText(item));
    }

  },

  render() {
    var _a, _b;

    const children = [];
    const itemsLength = this.items.length;

    for (let index = 0; index < itemsLength; index++) {
      const item = this.items[index];
      if (this.hideSelected && this.hasItem(item)) continue;
      if (item == null) children.push(this.genTile({
        item,
        index
      }));else if (item.header) children.push(this.genHeader(item));else if (item.divider) children.push(this.genDivider(item));else children.push(this.genTile({
        item,
        index
      }));
    }

    children.length || children.push(((_b = (_a = this.$slots)['no-data']) === null || _b === void 0 ? void 0 : _b.call(_a)) || this.staticNoDataTile);
    this.$slots['prepend-item'] && children.unshift(this.$slots['prepend-item']());
    this.$slots['append-item'] && children.push(this.$slots['append-item']());
    return h(VList, { ...this.$attrs,
      class: ['v-select-list', this.themeClasses],
      role: 'listbox',
      tabindex: -1,
      onMousedown: e => {
        e.preventDefault();
      },
      dense: this.dense
    }, children);
  }

});
//# sourceMappingURL=VSelectList.js.map