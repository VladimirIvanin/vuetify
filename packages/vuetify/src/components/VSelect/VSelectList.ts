// Components
import VSimpleCheckbox from '../VCheckbox/VSimpleCheckbox'
import VDivider from '../VDivider'
import VSubheader from '../VSubheader'
import {
  VList,
  VListItem,
  VListItemAction,
  VListItemContent,
  VListItemTitle,
} from '../VList'

// Directives
import ripple from '../../directives/ripple'

// Mixins
import Colorable from '../../mixins/colorable'
import Themeable from '../../mixins/themeable'

// Helpers
import { getPropertyFromItem } from '../../util/helpers'

// Types
import mixins from '../../util/mixins'
import { VNode, PropType, VNodeChildren, h } from 'vue'
import { PropValidator } from 'vue/types/options'
import { SelectItemKey } from 'vuetify/types'

type ListTile = { item: any, disabled?: null | boolean, value?: boolean, index: number };

/* @vue/component */
export default mixins(Colorable, Themeable).extend({
  name: 'v-select-list',


  props: {
    action: Boolean,
    dense: Boolean,
    hideSelected: Boolean,
    items: {
      type: Array,
      default: () => [],
    } as PropValidator<any[]>,
    itemDisabled: {
      type: [String, Array, Function] as PropType<SelectItemKey>,
      default: 'disabled',
    },
    itemText: {
      type: [String, Array, Function] as PropType<SelectItemKey>,
      default: 'text',
    },
    itemValue: {
      type: [String, Array, Function] as PropType<SelectItemKey>,
      default: 'value',
    },
    noDataText: String,
    noFilter: Boolean,
    searchInput: null as unknown as PropType<any>,
    selectedItems: {
      type: Array,
      default: () => [],
    } as PropValidator<any[]>,
  },

  computed: {
    parsedItems (): any[] {
      return this.selectedItems.map(item => this.getValue(item))
    },
    tileActiveClass (): string {
      return Object.keys(this.setTextColor(this.color).class || {}).join(' ')
    },
    staticNoDataTile (): VNode {
      const tile = {
        role: undefined,
        onMousedown: (e: Event) => e.preventDefault(), // Prevent onBlur from being called
      }

      return h(VListItem, tile, [
        this.genTileContent(this.noDataText),
      ])
    },
  },

  methods: {
    genAction (item: object, inputValue: any): VNode {
      return h(VListItemAction, {}, () => [
        h(VSimpleCheckbox, {
          color: this.color,
          modelValue: inputValue,
          ripple: false,
          onInput: () => this.$emit('select', item),
        }),
      ])
    },
    genDivider (props: { [key: string]: any }) {
      return h(VDivider, props)
    },
    genFilteredText (text: string) {
      text = text || ''

      if (!this.searchInput || this.noFilter) return text

      const { start, middle, end } = this.getMaskedCharacters(text)

      return [start, this.genHighlight(middle), end]
    },
    genHeader (props: { [key: string]: any }): VNode {
      return h(VSubheader, props, props.header)
    },
    genHighlight (text: string) {
      return h('span', { class: 'v-list-item__mask' }, text)
    },
    getMaskedCharacters (text: string): {
      start: string
      middle: string
      end: string
    } {
      const searchInput = (this.searchInput || '').toString().toLocaleLowerCase()
      const index = text.toLocaleLowerCase().indexOf(searchInput)

      if (index < 0) return { start: text, middle: '', end: '' }

      const start = text.slice(0, index)
      const middle = text.slice(index, index + searchInput.length)
      const end = text.slice(index + searchInput.length)
      return { start, middle, end }
    },
    genTile ({
      item,
      index,
      disabled = null,
      value = false,
    }: ListTile): VNode | VNode[] | undefined {
      if (!value) value = this.hasItem(item)

      if (item === Object(item)) {
        disabled = disabled !== null
          ? disabled
          : this.getDisabled(item)
      }

      const tile = {
        // Default behavior in list does not
        // contain aria-selected by default
        'aria-selected': String(value),
        id: `list-item-${this.$.uid}-${index}`,
        role: 'option',
        onMousedown: (e: Event) => {
          // Prevent onBlur from being called
          e.preventDefault()
        },
        onClick: () => disabled || this.$emit('select', item),
        activeClass: this.tileActiveClass,
        disabled,
        ripple: true,
        modelValue: value,
        // Передаем scopeId атрибуты от родительского компонента
        ...Object.keys(this.$attrs).reduce((acc, key) => {
          if (key.startsWith('data-v-')) {
            acc[key] = this.$attrs[key]
          }
          return acc
        }, {} as Record<string, any>)
      }

      if (!this.$slots.item) {
        return h(VListItem, tile, [
          this.action && !this.hideSelected && this.items.length > 0
            ? this.genAction(item, value)
            : null,
          this.genTileContent(item, index),
        ])
      }

      const parent = this
      const scopedSlot = this.$slots.item({
        parent,
        item,
        attrs: {
          ...tile.attrs,
          ...tile.props,
          ...tile.on,
        },
        on: tile.on,
      })

      return this.needsTile(scopedSlot)
        ? h(VListItem, tile, scopedSlot)
        : scopedSlot
    },
    genTileContent (item: any, index = 0): VNode {
      return h(VListItemContent, {}, () => [
        h(VListItemTitle, {}, () => [
          this.genFilteredText(this.getText(item)),
        ]),
      ])
    },
    hasItem (item: object) {
      return this.parsedItems.indexOf(this.getValue(item)) > -1
    },
    needsTile (slot: VNode[] | undefined) {
      return slot!.length !== 1 ||
        slot![0].componentOptions == null ||
        slot![0].componentOptions.Ctor.name !== 'v-list-item'
    },
    getDisabled (item: object) {
      return Boolean(getPropertyFromItem(item, this.itemDisabled, false))
    },
    getText (item: object) {
      return String(getPropertyFromItem(item, this.itemText, item))
    },
    getValue (item: object) {
      return getPropertyFromItem(item, this.itemValue, this.getText(item))
    },
  },

  render (): VNode {
    const children: VNodeChildren = []
    const itemsLength = this.items.length
    for (let index = 0; index < itemsLength; index++) {
      const item = this.items[index]

      if (this.hideSelected &&
        this.hasItem(item)
      ) continue

      if (item == null) children.push(this.genTile({ item, index }))
      else if (item.header) children.push(this.genHeader(item))
      else if (item.divider) children.push(this.genDivider(item))
      else children.push(this.genTile({ item, index }))
    }

    children.length || children.push(this.$slots['no-data']?.() || this.staticNoDataTile)

    this.$slots['prepend-item'] && children.unshift(this.$slots['prepend-item']())

    this.$slots['append-item'] && children.push(this.$slots['append-item']())

    return h(VList, {
      ...this.$attrs,
      class: ['v-select-list', this.themeClasses],
      role: 'listbox',
      tabindex: -1,
      onMousedown: (e: Event) => {
        e.preventDefault()
      },
      dense: this.dense,
    }, children)
  },
})
