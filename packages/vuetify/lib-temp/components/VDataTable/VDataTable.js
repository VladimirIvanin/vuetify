import './VDataTable.sass';
// Types
import { h } from 'vue';
// Components
import { VData } from '../VData';
import { VDataFooter, VDataIterator } from '../VDataIterator';
import VBtn from '../VBtn';
import VDataTableHeader from './VDataTableHeader';
// import VVirtualTable from './VVirtualTable'
import VIcon from '../VIcon';
import Row from './Row';
import RowGroup from './RowGroup';
import VSimpleCheckbox from '../VCheckbox/VSimpleCheckbox';
import VSimpleTable from './VSimpleTable';
import MobileRow from './MobileRow';
// Mixins
import Loadable from '../../mixins/loadable';
import Mouse from '../../mixins/mouse';
// Helpers
import mixins from '../../util/mixins';
import { deepEqual, getObjectValueByPath, getPrefixedScopedSlots, getSlot, defaultFilter, camelizeObjectKeys, getPropertyFromItem } from '../../util/helpers';
import { breaking } from '../../util/console';
import { mergeClasses, mergeStyles } from '../../util/mergeData';
function filterFn(item, search, filter) {
    return (header) => {
        const value = getObjectValueByPath(item, header.value);
        return header.filter ? header.filter(value, search, item) : filter(value, search, item);
    };
}
function searchTableItems(items, search, headersWithCustomFilters, headersWithoutCustomFilters, customFilter, filterMode) {
    search = typeof search === 'string' ? search.trim() : null;
    if (filterMode === 'union') {
        // If the `search` property is empty and there are no custom filters in use, there is nothing to do.
        if (!(search && headersWithoutCustomFilters.length) && !headersWithCustomFilters.length)
            return items;
        return items.filter(item => {
            // Headers with custom filters are evaluated whether or not a search term has been provided.
            if (headersWithCustomFilters.length && headersWithCustomFilters.every(filterFn(item, search, defaultFilter))) {
                return true;
            }
            // Otherwise, the `search` property is used to filter columns without a custom filter.
            return (search && headersWithoutCustomFilters.some(filterFn(item, search, customFilter)));
        });
    }
    else if (filterMode === 'intersection') {
        return items.filter(item => {
            // Headers with custom filters are evaluated whether or not a search term has been provided.
            // We need to match every filter to be included in the results.
            const matchesColumnFilters = headersWithCustomFilters.every(filterFn(item, search, defaultFilter));
            // Headers without custom filters are only filtered by the `search` property if it is defined.
            // We only need a single column to match the search term to be included in the results.
            const matchesSearchTerm = !search || headersWithoutCustomFilters.some(filterFn(item, search, customFilter));
            return matchesColumnFilters && matchesSearchTerm;
        });
    }
    else {
        return items;
    }
}
/* @vue/component */
export default mixins(VDataIterator, Loadable, Mouse).extend({
    name: 'v-data-table',
    emits: ['click:row', 'update:options', 'update:page', 'update:items-per-page', 'update:sort-by', 'update:sort-desc', 'update:group-by', 'update:group-desc', 'pagination', 'current-items', 'page-count', 'click', 'mousedown', 'mouseup', 'touchstart', 'touchend'],
    props: {
        headers: {
            type: Array,
            default: () => [],
        },
        showSelect: Boolean,
        checkboxColor: String,
        color: String,
        showExpand: Boolean,
        showGroupBy: Boolean,
        // TODO: Fix
        // virtualRows: Boolean,
        height: [Number, String],
        hideDefaultHeader: Boolean,
        caption: String,
        dense: Boolean,
        headerProps: Object,
        calculateWidths: Boolean,
        fixedHeader: Boolean,
        headersLength: Number,
        expandIcon: {
            type: String,
            default: '$expand',
        },
        customFilter: {
            type: Function,
            default: defaultFilter,
        },
        filterMode: {
            type: String,
            default: 'intersection',
        },
        itemClass: {
            type: [String, Function],
            default: () => '',
        },
        itemStyle: {
            type: [String, Function],
            default: () => '',
        },
        loaderHeight: {
            type: [Number, String],
            default: 4,
        },
    },
    data() {
        return {
            internalGroupBy: [],
            openCache: {},
            widths: [],
        };
    },
    computed: {
        computedHeaders() {
            if (!this.headers)
                return [];
            const headers = this.headers.filter(h => h.value === undefined || !this.internalGroupBy.find(v => v === h.value));
            const defaultHeader = { text: '', sortable: false, width: '1px' };
            if (this.showSelect) {
                const index = headers.findIndex(h => h.value === 'data-table-select');
                if (index < 0)
                    headers.unshift({ ...defaultHeader, value: 'data-table-select' });
                else
                    headers.splice(index, 1, { ...defaultHeader, ...headers[index] });
            }
            if (this.showExpand) {
                const index = headers.findIndex(h => h.value === 'data-table-expand');
                if (index < 0)
                    headers.unshift({ ...defaultHeader, value: 'data-table-expand' });
                else
                    headers.splice(index, 1, { ...defaultHeader, ...headers[index] });
            }
            return headers;
        },
        colspanAttrs() {
            return this.isMobile ? undefined : {
                colspan: this.headersLength || this.computedHeaders.length,
            };
        },
        columnSorters() {
            return this.computedHeaders.reduce((acc, header) => {
                if (header.sort)
                    acc[header.value] = header.sort;
                return acc;
            }, {});
        },
        headersWithCustomFilters() {
            return this.headers.filter(header => header.filter && (!header.hasOwnProperty('filterable') || header.filterable === true));
        },
        headersWithoutCustomFilters() {
            return this.headers.filter(header => !header.filter && (!header.hasOwnProperty('filterable') || header.filterable === true));
        },
        sanitizedHeaderProps() {
            return camelizeObjectKeys(this.headerProps);
        },
        computedItemsPerPage() {
            const itemsPerPage = this.options && this.options.itemsPerPage ? this.options.itemsPerPage : this.itemsPerPage;
            const itemsPerPageOptions = this.sanitizedFooterProps.itemsPerPageOptions;
            if (itemsPerPageOptions &&
                !itemsPerPageOptions.find(item => typeof item === 'number' ? item === itemsPerPage : item.value === itemsPerPage)) {
                const firstOption = itemsPerPageOptions[0];
                return typeof firstOption === 'object' ? firstOption.value : firstOption;
            }
            return itemsPerPage;
        },
        groupByText() {
            var _a, _b, _c;
            return (_c = (_b = (_a = this.headers) === null || _a === void 0 ? void 0 : _a.find(header => { var _a; return header.value === ((_a = this.internalGroupBy) === null || _a === void 0 ? void 0 : _a[0]); })) === null || _b === void 0 ? void 0 : _b.text) !== null && _c !== void 0 ? _c : '';
        },
    },
    created() {
        const breakingProps = [
            ['sort-icon', 'header-props.sort-icon'],
            ['hide-headers', 'hide-default-header'],
            ['select-all', 'show-select'],
        ];
        /* istanbul ignore next */
        breakingProps.forEach(([original, replacement]) => {
            if (this.$attrs.hasOwnProperty(original))
                breaking(original, replacement, this);
        });
    },
    mounted() {
        // if ((!this.sortBy || !this.sortBy.length) && (!this.options.sortBy || !this.options.sortBy.length)) {
        //   const firstSortable = this.headers.find(h => !('sortable' in h) || !!h.sortable)
        //   if (firstSortable) this.updateOptions({ sortBy: [firstSortable.value], sortDesc: [false] })
        // }
        if (this.calculateWidths) {
            window.addEventListener('resize', this.calcWidths);
            this.calcWidths();
        }
    },
    beforeUnmount() {
        if (this.calculateWidths) {
            window.removeEventListener('resize', this.calcWidths);
        }
    },
    methods: {
        calcWidths() {
            this.widths = Array.from(this.$el.querySelectorAll('th')).map(e => e.clientWidth);
        },
        customFilterWithColumns(items, search) {
            return searchTableItems(items, search, this.headersWithCustomFilters, this.headersWithoutCustomFilters, this.customFilter, this.filterMode);
        },
        customSortWithHeaders(items, sortBy, sortDesc, locale) {
            return this.customSort(items, sortBy, sortDesc, locale, this.columnSorters);
        },
        createItemProps(item, index) {
            const data = {
                ...VDataIterator.methods.createItemProps.call(this, item, index),
                headers: this.computedHeaders,
            };
            return {
                ...data,
                class: {
                    'v-data-table__selected': data.isSelected,
                },
                ...this.getDefaultMouseEventHandlers(':row', () => data, true),
                // TODO: the first argument should be the event, and the second argument should be data,
                // but this is a breaking change so it's for v3
                onClick: (event) => this.$emit('click:row', item, data, event)
            };
        },
        genCaption(props) {
            if (this.caption)
                return [h('caption', [this.caption])];
            return getSlot(this, 'caption', props, true);
        },
        genColgroup(props) {
            return h('colgroup', this.computedHeaders.map(header => {
                return h('col', {
                    class: {
                        divider: header.divider,
                    },
                });
            }));
        },
        genLoading() {
            const th = h('th', {
                class: 'column',
                ...this.colspanAttrs,
            }, [this.genProgress()]);
            const tr = h('tr', {
                class: 'v-data-table__progress',
            }, [th]);
            return h('thead', [tr]);
        },
        genHeaders(props) {
            const data = {
                ...this.sanitizedHeaderProps,
                headers: this.computedHeaders,
                options: props.options,
                mobile: this.isMobile,
                showGroupBy: this.showGroupBy,
                checkboxColor: this.checkboxColor,
                someItems: this.someItems,
                everyItem: this.everyItem,
                singleSelect: this.singleSelect,
                disableSort: this.disableSort,
                onSort: props.sort,
                onGroup: props.group,
                'onToggle-select-all': this.toggleSelectAll
            };
            // TODO: rename to 'head'? (thead, tbody, tfoot)
            const children = [getSlot(this, 'header', {
                    ...data,
                    isMobile: this.isMobile,
                })];
            if (!this.hideDefaultHeader) {
                const scopedSlots = getPrefixedScopedSlots('header.', this.$slots);
                children.push(h(VDataTableHeader, {
                    ...data,
                }, scopedSlots));
            }
            if (this.loading)
                children.push(this.genLoading());
            return children;
        },
        genEmptyWrapper(content) {
            return h('tr', {
                class: 'v-data-table__empty-wrapper',
            }, [
                h('td', {
                    ...this.colspanAttrs,
                }, content),
            ]);
        },
        genItems(items, props) {
            const empty = this.genEmpty(props.originalItemsLength, props.pagination.itemsLength);
            if (empty)
                return [empty];
            return props.groupedItems
                ? this.genGroupedRows(props.groupedItems, props)
                : this.genRows(items, props);
        },
        genGroupedRows(groupedItems, props) {
            return groupedItems.map(group => {
                if (!this.openCache.hasOwnProperty(group.name))
                    this.openCache[group.name] = true;
                if (this.$slots.group) {
                    return this.$slots.group({
                        group: group.name,
                        options: props.options,
                        isMobile: this.isMobile,
                        items: group.items,
                        headers: this.computedHeaders,
                    });
                }
                else {
                    return this.genDefaultGroupedRow(group.name, group.items, props);
                }
            });
        },
        genDefaultGroupedRow(group, items, props) {
            const isOpen = !!this.openCache[group];
            const children = [
                h('template', { slot: 'row.content' }, this.genRows(items, props)),
            ];
            const toggleFn = () => this.openCache[group] = !this.openCache[group];
            const removeFn = () => props.updateOptions({ groupBy: [], groupDesc: [] });
            if (this.$slots['group.header']) {
                children.unshift(h('template', { slot: 'column.header' }, [
                    this.$slots['group.header']({
                        group,
                        groupBy: props.groupBy,
                        isMobile: this.isMobile,
                        items,
                        headers: this.computedHeaders,
                        isOpen,
                        toggle: toggleFn,
                        remove: removeFn,
                    }),
                ]));
            }
            else {
                const toggle = h(VBtn, {
                    class: 'ma-0',
                    icon: true,
                    small: true,
                    onClick: toggleFn
                }, () => [h(VIcon, {}, () => [isOpen ? '$minus' : '$plus'])]);
                const remove = h(VBtn, {
                    class: 'ma-0',
                    icon: true,
                    small: true,
                    onClick: removeFn,
                }, () => [h(VIcon, {}, () => ['$close'])]);
                const column = h('td', {
                    class: 'text-start',
                    ...this.colspanAttrs,
                }, [toggle, `${this.groupByText}: ${group}`, remove]);
                children.unshift(h('template', { slot: 'column.header' }, [column]));
            }
            if (this.$slots['group.summary']) {
                children.push(h('template', { slot: 'column.summary' }, [
                    this.$slots['group.summary']({
                        group,
                        groupBy: props.groupBy,
                        isMobile: this.isMobile,
                        items,
                        headers: this.computedHeaders,
                        isOpen,
                        toggle: toggleFn,
                    }),
                ]));
            }
            return h(RowGroup, {
                key: group,
                modelValue: isOpen,
            }, children);
        },
        genRows(items, props) {
            return this.$slots.item ? this.genScopedRows(items, props) : this.genDefaultRows(items, props);
        },
        genScopedRows(items, props) {
            const rows = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                rows.push(this.$slots.item({
                    ...this.createItemProps(item, i),
                    isMobile: this.isMobile,
                }));
                if (this.isExpanded(item)) {
                    rows.push(this.$slots['expanded-item']({
                        headers: this.computedHeaders,
                        isMobile: this.isMobile,
                        index: i,
                        item,
                    }));
                }
            }
            return rows;
        },
        genDefaultRows(items, props) {
            return this.$slots['expanded-item']
                ? items.map((item, index) => this.genDefaultExpandedRow(item, index))
                : items.map((item, index) => this.genDefaultSimpleRow(item, index));
        },
        genDefaultExpandedRow(item, index) {
            const isExpanded = this.isExpanded(item);
            const classes = {
                'v-data-table__expanded v-data-table__expanded__row': isExpanded,
            };
            const headerRow = this.genDefaultSimpleRow(item, index, classes);
            const expandedRow = h('tr', {
                class: 'v-data-table__expanded v-data-table__expanded__content',
            }, [this.$slots['expanded-item']({
                    headers: this.computedHeaders,
                    isMobile: this.isMobile,
                    item,
                })]);
            return h(RowGroup, {
                modelValue: isExpanded,
            }, [
                h('template', { slot: 'row.header' }, [headerRow]),
                h('template', { slot: 'row.content' }, [expandedRow]),
            ]);
        },
        genDefaultSimpleRow(item, index, classes = {}) {
            const scopedSlots = getPrefixedScopedSlots('item.', this.$slots);
            const data = this.createItemProps(item, index);
            if (this.showSelect) {
                const slot = scopedSlots['data-table-select'];
                scopedSlots['data-table-select'] = slot ? () => slot({
                    ...data,
                    isMobile: this.isMobile,
                }) : () => {
                    var _a;
                    return h(VSimpleCheckbox, {
                        class: 'v-data-table__checkbox',
                        modelValue: data.isSelected,
                        disabled: !this.isSelectable(item),
                        color: (_a = this.checkboxColor) !== null && _a !== void 0 ? _a : '',
                        'onUpdate:modelValue': (val) => data.select(val),
                    });
                };
            }
            if (this.showExpand) {
                const slot = scopedSlots['data-table-expand'];
                scopedSlots['data-table-expand'] = slot ? () => slot(data) : () => h(VIcon, {
                    class: ['v-data-table__expand-icon', {
                            'v-data-table__expand-icon--active': data.isExpanded,
                        }],
                    onClick: (e) => {
                        e.stopPropagation();
                        data.expand(!data.isExpanded);
                    }
                }, () => [this.expandIcon]);
            }
            return h(this.isMobile ? MobileRow : Row, {
                key: getObjectValueByPath(item, this.itemKey),
                class: mergeClasses({ ...classes, 'v-data-table__selected': data.isSelected }, getPropertyFromItem(item, this.itemClass)),
                style: mergeStyles({}, getPropertyFromItem(item, this.itemStyle)),
                headers: this.computedHeaders,
                hideDefaultHeader: this.hideDefaultHeader,
                index,
                item,
                rtl: this.$vuetify.rtl,
                ...data.on,
            }, scopedSlots);
        },
        genBody(props) {
            const data = {
                ...props,
                expand: this.expand,
                headers: this.computedHeaders,
                isExpanded: this.isExpanded,
                isMobile: this.isMobile,
                isSelected: this.isSelected,
                select: this.select,
            };
            if (this.$slots.body) {
                return this.$slots.body(data);
            }
            return h('tbody', [
                getSlot(this, 'body.prepend', data, true),
                this.genItems(props.items, props),
                getSlot(this, 'body.append', data, true),
            ]);
        },
        genFoot(props) {
            var _a, _b;
            return (_b = (_a = this.$slots).foot) === null || _b === void 0 ? void 0 : _b.call(_a, props);
        },
        genFooters(props) {
            const data = {
                options: props.options,
                pagination: props.pagination,
                itemsPerPageText: '$vuetify.dataTable.itemsPerPageText',
                ...this.sanitizedFooterProps,
                'onUpdate:options': (value) => props.updateOptions(value),
            };
            const children = [
                getSlot(this, 'footer', {
                    ...data,
                    widths: this.widths,
                    headers: this.computedHeaders
                }, true),
            ];
            if (!this.hideDefaultFooter) {
                children.push(h(VDataFooter, {
                    ...data
                }, getPrefixedScopedSlots('footer.', this.$slots)));
            }
            return children;
        },
        genDefaultScopedSlot(props) {
            const simpleProps = {
                height: this.height,
                fixedHeader: this.fixedHeader,
                dense: this.dense,
            };
            // if (this.virtualRows) {
            //   return h(VVirtualTable, {
            //     props: Object.assign(simpleProps, {
            //       items: props.items,
            //       height: this.height,
            //       rowHeight: this.dense ? 24 : 48,
            //       headerHeight: this.dense ? 32 : 48,
            //       // TODO: expose rest of props from virtual table?
            //     }),
            //     scopedSlots: {
            //       items: ({ items }) => this.genItems(items, props) as any,
            //     },
            //   }, [
            //     this.proxySlot('body.before', [this.genCaption(props), this.genHeaders(props)]),
            //     this.proxySlot('bottom', this.genFooters(props)),
            //   ])
            // }
            return h(VSimpleTable, {
                ...simpleProps,
                class: {
                    'v-data-table--mobile': this.isMobile,
                    'v-data-table--selectable': this.showSelect,
                },
            }, {
                default: () => [
                    this.genCaption(props),
                    this.genColgroup(props),
                    this.genHeaders(props),
                    this.genBody(props),
                    this.genFoot(props),
                ],
                top: () => getSlot(this, 'top', {
                    ...props,
                    isMobile: this.isMobile,
                }, true),
                bottom: () => this.genFooters(props)
            });
        }
    },
    render() {
        return h(VData, {
            ...this.$props,
            customFilter: this.customFilterWithColumns,
            customSort: this.customSortWithHeaders,
            itemsPerPage: this.computedItemsPerPage,
            'onUpdate:options': (v, old) => {
                this.internalGroupBy = v.groupBy || [];
                !deepEqual(v, old) && this.$emit('update:options', v);
            },
            'onUpdate:page': (v) => this.$emit('update:page', v),
            'onUpdate:items-per-page': (v) => this.$emit('update:items-per-page', v),
            'onUpdate:sort-by': (v) => this.$emit('update:sort-by', v),
            'onUpdate:sort-desc': (v) => this.$emit('update:sort-desc', v),
            'onUpdate:group-by': (v) => this.$emit('update:group-by', v),
            'onUpdate:group-desc': (v) => this.$emit('update:group-desc', v),
            onPagination: (v, old) => !deepEqual(v, old) && this.$emit('pagination', v),
            'onCurrent-items': (v) => {
                this.internalCurrentItems = v;
                this.$emit('current-items', v);
            },
            'onPage-count': (v) => this.$emit('page-count', v),
        }, this.genDefaultScopedSlot);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRhdGFUYWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZEYXRhVGFibGUvVkRhdGFUYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLG1CQUFtQixDQUFBO0FBRTFCLFFBQVE7QUFDUixPQUFPLEVBQW9ELENBQUMsRUFBRSxNQUFNLEtBQUssQ0FBQTtBQWlCekUsYUFBYTtBQUNiLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxVQUFVLENBQUE7QUFDaEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQTtBQUM3RCxPQUFPLElBQUksTUFBTSxTQUFTLENBQUE7QUFDMUIsT0FBTyxnQkFBZ0IsTUFBTSxvQkFBb0IsQ0FBQTtBQUNqRCw4Q0FBOEM7QUFDOUMsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFBO0FBQzVCLE9BQU8sR0FBRyxNQUFNLE9BQU8sQ0FBQTtBQUN2QixPQUFPLFFBQVEsTUFBTSxZQUFZLENBQUE7QUFDakMsT0FBTyxlQUFlLE1BQU0sOEJBQThCLENBQUE7QUFDMUQsT0FBTyxZQUFZLE1BQU0sZ0JBQWdCLENBQUE7QUFDekMsT0FBTyxTQUFTLE1BQU0sYUFBYSxDQUFBO0FBRW5DLFNBQVM7QUFDVCxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUM1QyxPQUFPLEtBQUssTUFBTSxvQkFBb0IsQ0FBQTtBQUt0QyxVQUFVO0FBQ1YsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFDdEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxvQkFBb0IsRUFBRSxzQkFBc0IsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLGtCQUFrQixFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDN0osT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQzdDLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLE1BQU0s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QUFRLEVBQUUsRUFBRTtnQkFDOUIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLENBQUMsQ0FBQTtnQkFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFDaEMsQ0FBQztZQUNELGNBQWMsRUFBRSxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1NBQzNELEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUE7SUFDL0IsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi9WRGF0YVRhYmxlLnNhc3MnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSwgVk5vZGVDaGlsZHJlbkFycmF5Q29udGVudHMsIFZOb2RlQ2hpbGRyZW4sIGggfSBmcm9tICd2dWUnXG5pbXBvcnQgeyBQcm9wVmFsaWRhdG9yIH0gZnJvbSAndnVlL3R5cGVzL29wdGlvbnMnXG5pbXBvcnQge1xuICBEYXRhVGFibGVIZWFkZXIsXG4gIERhdGFUYWJsZUZpbHRlckZ1bmN0aW9uLFxuICBEYXRhU2NvcGVQcm9wcyxcbiAgRGF0YU9wdGlvbnMsXG4gIERhdGFQYWdpbmF0aW9uLFxuICBEYXRhVGFibGVDb21wYXJlRnVuY3Rpb24sXG4gIERhdGFJdGVtc1BlclBhZ2VPcHRpb24sXG4gIEl0ZW1Hcm91cCxcbiAgUm93Q2xhc3NGdW5jdGlvbixcbiAgUm93U3R5bGVGdW5jdGlvbixcbiAgRGF0YVRhYmxlSXRlbVByb3BzLFxuICBEYXRhVGFibGVGaWx0ZXJNb2RlLFxufSBmcm9tICd2dWV0aWZ5L3R5cGVzJ1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgeyBWRGF0YSB9IGZyb20gJy4uL1ZEYXRhJ1xuaW1wb3J0IHsgVkRhdGFGb290ZXIsIFZEYXRhSXRlcmF0b3IgfSBmcm9tICcuLi9WRGF0YUl0ZXJhdG9yJ1xuaW1wb3J0IFZCdG4gZnJvbSAnLi4vVkJ0bidcbmltcG9ydCBWRGF0YVRhYmxlSGVhZGVyIGZyb20gJy4vVkRhdGFUYWJsZUhlYWRlcidcbi8vIGltcG9ydCBWVmlydHVhbFRhYmxlIGZyb20gJy4vVlZpcnR1YWxUYWJsZSdcbmltcG9ydCBWSWNvbiBmcm9tICcuLi9WSWNvbidcbmltcG9ydCBSb3cgZnJvbSAnLi9Sb3cnXG5pbXBvcnQgUm93R3JvdXAgZnJvbSAnLi9Sb3dHcm91cCdcbmltcG9ydCBWU2ltcGxlQ2hlY2tib3ggZnJvbSAnLi4vVkNoZWNrYm94L1ZTaW1wbGVDaGVja2JveCdcbmltcG9ydCBWU2ltcGxlVGFibGUgZnJvbSAnLi9WU2ltcGxlVGFibGUnXG5pbXBvcnQgTW9iaWxlUm93IGZyb20gJy4vTW9iaWxlUm93J1xuXG4vLyBNaXhpbnNcbmltcG9ydCBMb2FkYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvbG9hZGFibGUnXG5pbXBvcnQgTW91c2UgZnJvbSAnLi4vLi4vbWl4aW5zL21vdXNlJ1xuXG4vLyBEaXJlY3RpdmVzXG5pbXBvcnQgcmlwcGxlIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvcmlwcGxlJ1xuXG4vLyBIZWxwZXJzXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuaW1wb3J0IHsgZGVlcEVxdWFsLCBnZXRPYmplY3RWYWx1ZUJ5UGF0aCwgZ2V0UHJlZml4ZWRTY29wZWRTbG90cywgZ2V0U2xvdCwgZGVmYXVsdEZpbHRlciwgY2FtZWxpemVPYmplY3RLZXlzLCBnZXRQcm9wZXJ0eUZyb21JdGVtIH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IHsgYnJlYWtpbmcgfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXG5pbXBvcnQgeyBtZXJnZUNsYXNzZXMsIG1lcmdlU3R5bGVzIH0gZnJvbSAnLi4vLi4vdXRpbC9tZXJnZURhdGEnXG5cbmZ1bmN0aW9uIGZpbHRlckZuIChpdGVtOiBhbnksIHNlYXJjaDogc3RyaW5nIHwgbnVsbCwgZmlsdGVyOiBEYXRhVGFibGVGaWx0ZXJGdW5jdGlvbikge1xuICByZXR1cm4gKGhlYWRlcjogRGF0YVRhYmxlSGVhZGVyKSA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSBnZXRPYmplY3RWYWx1ZUJ5UGF0aChpdGVtLCBoZWFkZXIudmFsdWUpXG4gICAgcmV0dXJuIGhlYWRlci5maWx0ZXIgPyBoZWFkZXIuZmlsdGVyKHZhbHVlLCBzZWFyY2gsIGl0ZW0pIDogZmlsdGVyKHZhbHVlLCBzZWFyY2gsIGl0ZW0pXG4gIH1cbn1cblxuZnVuY3Rpb24gc2VhcmNoVGFibGVJdGVtcyAoXG4gIGl0ZW1zOiBhbnlbXSxcbiAgc2VhcmNoOiBzdHJpbmcgfCBudWxsLFxuICBoZWFkZXJzV2l0aEN1c3RvbUZpbHRlcnM6IERhdGFUYWJsZUhlYWRlcltdLFxuICBoZWFkZXJzV2l0aG91dEN1c3RvbUZpbHRlcnM6IERhdGFUYWJsZUhlYWRlcltdLFxuICBjdXN0b21GaWx0ZXI6IERhdGFUYWJsZUZpbHRlckZ1bmN0aW9uLFxuICBmaWx0ZXJNb2RlOiBEYXRhVGFibGVGaWx0ZXJNb2RlLFxuKSB7XG4gIHNlYXJjaCA9IHR5cGVvZiBzZWFyY2ggPT09ICdzdHJpbmcnID8gc2VhcmNoLnRyaW0oKSA6IG51bGxcblxuICBpZiAoZmlsdGVyTW9kZSA9PT0gJ3VuaW9uJykge1xuICAgIC8vIElmIHRoZSBgc2VhcmNoYCBwcm9wZXJ0eSBpcyBlbXB0eSBhbmQgdGhlcmUgYXJlIG5vIGN1c3RvbSBmaWx0ZXJzIGluIHVzZSwgdGhlcmUgaXMgbm90aGluZyB0byBkby5cbiAgICBpZiAoIShzZWFyY2ggJiYgaGVhZGVyc1dpdGhvdXRDdXN0b21GaWx0ZXJzLmxlbmd0aCkgJiYgIWhlYWRlcnNXaXRoQ3VzdG9tRmlsdGVycy5sZW5ndGgpIHJldHVybiBpdGVtc1xuXG4gICAgcmV0dXJuIGl0ZW1zLmZpbHRlcihpdGVtID0+IHtcbiAgICAgIC8vIEhlYWRlcnMgd2l0aCBjdXN0b20gZmlsdGVycyBhcmUgZXZhbHVhdGVkIHdoZXRoZXIgb3Igbm90IGEgc2VhcmNoIHRlcm0gaGFzIGJlZW4gcHJvdmlkZWQuXG4gICAgICBpZiAoaGVhZGVyc1dpdGhDdXN0b21GaWx0ZXJzLmxlbmd0aCAmJiBoZWFkZXJzV2l0aEN1c3RvbUZpbHRlcnMuZXZlcnkoZmlsdGVyRm4oaXRlbSwgc2VhcmNoLCBkZWZhdWx0RmlsdGVyKSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cblxuICAgICAgLy8gT3RoZXJ3aXNlLCB0aGUgYHNlYXJjaGAgcHJvcGVydHkgaXMgdXNlZCB0byBmaWx0ZXIgY29sdW1ucyB3aXRob3V0IGEgY3VzdG9tIGZpbHRlci5cbiAgICAgIHJldHVybiAoc2VhcmNoICYmIGhlYWRlcnNXaXRob3V0Q3VzdG9tRmlsdGVycy5zb21lKGZpbHRlckZuKGl0ZW0sIHNlYXJjaCwgY3VzdG9tRmlsdGVyKSkpXG4gICAgfSlcbiAgfSBlbHNlIGlmIChmaWx0ZXJNb2RlID09PSAnaW50ZXJzZWN0aW9uJykge1xuICAgIHJldHVybiBpdGVtcy5maWx0ZXIoaXRlbSA9PiB7XG4gICAgICAvLyBIZWFkZXJzIHdpdGggY3VzdG9tIGZpbHRlcnMgYXJlIGV2YWx1YXRlZCB3aGV0aGVyIG9yIG5vdCBhIHNlYXJjaCB0ZXJtIGhhcyBiZWVuIHByb3ZpZGVkLlxuICAgICAgLy8gV2UgbmVlZCB0byBtYXRjaCBldmVyeSBmaWx0ZXIgdG8gYmUgaW5jbHVkZWQgaW4gdGhlIHJlc3VsdHMuXG4gICAgICBjb25zdCBtYXRjaGVzQ29sdW1uRmlsdGVycyA9IGhlYWRlcnNXaXRoQ3VzdG9tRmlsdGVycy5ldmVyeShmaWx0ZXJGbihpdGVtLCBzZWFyY2gsIGRlZmF1bHRGaWx0ZXIpKVxuXG4gICAgICAvLyBIZWFkZXJzIHdpdGhvdXQgY3VzdG9tIGZpbHRlcnMgYXJlIG9ubHkgZmlsdGVyZWQgYnkgdGhlIGBzZWFyY2hgIHByb3BlcnR5IGlmIGl0IGlzIGRlZmluZWQuXG4gICAgICAvLyBXZSBvbmx5IG5lZWQgYSBzaW5nbGUgY29sdW1uIHRvIG1hdGNoIHRoZSBzZWFyY2ggdGVybSB0byBiZSBpbmNsdWRlZCBpbiB0aGUgcmVzdWx0cy5cbiAgICAgIGNvbnN0IG1hdGNoZXNTZWFyY2hUZXJtID0gIXNlYXJjaCB8fCBoZWFkZXJzV2l0aG91dEN1c3RvbUZpbHRlcnMuc29tZShmaWx0ZXJGbihpdGVtLCBzZWFyY2gsIGN1c3RvbUZpbHRlcikpXG5cbiAgICAgIHJldHVybiBtYXRjaGVzQ29sdW1uRmlsdGVycyAmJiBtYXRjaGVzU2VhcmNoVGVybVxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGl0ZW1zXG4gIH1cbn1cblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcbiAgVkRhdGFJdGVyYXRvcixcbiAgTG9hZGFibGUsXG4gIE1vdXNlLFxuKS5leHRlbmQoe1xuICBuYW1lOiAndi1kYXRhLXRhYmxlJyxcblxuICBlbWl0czogWydjbGljazpyb3cnLCAndXBkYXRlOm9wdGlvbnMnLCAndXBkYXRlOnBhZ2UnLCAndXBkYXRlOml0ZW1zLXBlci1wYWdlJywgJ3VwZGF0ZTpzb3J0LWJ5JywgJ3VwZGF0ZTpzb3J0LWRlc2MnLCAndXBkYXRlOmdyb3VwLWJ5JywgJ3VwZGF0ZTpncm91cC1kZXNjJywgJ3BhZ2luYXRpb24nLCAnY3VycmVudC1pdGVtcycsICdwYWdlLWNvdW50JywgJ2NsaWNrJywgJ21vdXNlZG93bicsICdtb3VzZXVwJywgJ3RvdWNoc3RhcnQnLCAndG91Y2hlbmQnXSxcblxuXG4gIHByb3BzOiB7XG4gICAgaGVhZGVyczoge1xuICAgICAgdHlwZTogQXJyYXksXG4gICAgICBkZWZhdWx0OiAoKSA9PiBbXSxcbiAgICB9IGFzIFByb3BWYWxpZGF0b3I8RGF0YVRhYmxlSGVhZGVyW10+LFxuICAgIHNob3dTZWxlY3Q6IEJvb2xlYW4sXG4gICAgY2hlY2tib3hDb2xvcjogU3RyaW5nLFxuICAgIGNvbG9yOiBTdHJpbmcsXG4gICAgc2hvd0V4cGFuZDogQm9vbGVhbixcbiAgICBzaG93R3JvdXBCeTogQm9vbGVhbixcbiAgICAvLyBUT0RPOiBGaXhcbiAgICAvLyB2aXJ0dWFsUm93czogQm9vbGVhbixcbiAgICBoZWlnaHQ6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgaGlkZURlZmF1bHRIZWFkZXI6IEJvb2xlYW4sXG4gICAgY2FwdGlvbjogU3RyaW5nLFxuICAgIGRlbnNlOiBCb29sZWFuLFxuICAgIGhlYWRlclByb3BzOiBPYmplY3QsXG4gICAgY2FsY3VsYXRlV2lkdGhzOiBCb29sZWFuLFxuICAgIGZpeGVkSGVhZGVyOiBCb29sZWFuLFxuICAgIGhlYWRlcnNMZW5ndGg6IE51bWJlcixcbiAgICBleHBhbmRJY29uOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJGV4cGFuZCcsXG4gICAgfSxcbiAgICBjdXN0b21GaWx0ZXI6IHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uLFxuICAgICAgZGVmYXVsdDogZGVmYXVsdEZpbHRlcixcbiAgICB9IGFzIFByb3BWYWxpZGF0b3I8dHlwZW9mIGRlZmF1bHRGaWx0ZXI+LFxuICAgIGZpbHRlck1vZGU6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdpbnRlcnNlY3Rpb24nLFxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjxEYXRhVGFibGVGaWx0ZXJNb2RlPixcbiAgICBpdGVtQ2xhc3M6IHtcbiAgICAgIHR5cGU6IFtTdHJpbmcsIEZ1bmN0aW9uXSxcbiAgICAgIGRlZmF1bHQ6ICgpID0+ICcnLFxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjxSb3dDbGFzc0Z1bmN0aW9uIHwgc3RyaW5nPixcbiAgICBpdGVtU3R5bGU6IHtcbiAgICAgIHR5cGU6IFtTdHJpbmcsIEZ1bmN0aW9uXSxcbiAgICAgIGRlZmF1bHQ6ICgpID0+ICcnLFxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjxSb3dTdHlsZUZ1bmN0aW9uIHwgc3RyaW5nPixcbiAgICBsb2FkZXJIZWlnaHQ6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiA0LFxuICAgIH0sXG4gIH0sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGludGVybmFsR3JvdXBCeTogW10gYXMgc3RyaW5nW10sXG4gICAgICBvcGVuQ2FjaGU6IHt9IGFzIHsgW2tleTogc3RyaW5nXTogYm9vbGVhbiB9LFxuICAgICAgd2lkdGhzOiBbXSBhcyBudW1iZXJbXSxcbiAgICB9XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjb21wdXRlZEhlYWRlcnMgKCk6IERhdGFUYWJsZUhlYWRlcltdIHtcbiAgICAgIGlmICghdGhpcy5oZWFkZXJzKSByZXR1cm4gW11cbiAgICAgIGNvbnN0IGhlYWRlcnMgPSB0aGlzLmhlYWRlcnMuZmlsdGVyKGggPT4gaC52YWx1ZSA9PT0gdW5kZWZpbmVkIHx8ICF0aGlzLmludGVybmFsR3JvdXBCeS5maW5kKHYgPT4gdiA9PT0gaC52YWx1ZSkpXG4gICAgICBjb25zdCBkZWZhdWx0SGVhZGVyID0geyB0ZXh0OiAnJywgc29ydGFibGU6IGZhbHNlLCB3aWR0aDogJzFweCcgfVxuXG4gICAgICBpZiAodGhpcy5zaG93U2VsZWN0KSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gaGVhZGVycy5maW5kSW5kZXgoaCA9PiBoLnZhbHVlID09PSAnZGF0YS10YWJsZS1zZWxlY3QnKVxuICAgICAgICBpZiAoaW5kZXggPCAwKSBoZWFkZXJzLnVuc2hpZnQoeyAuLi5kZWZhdWx0SGVhZGVyLCB2YWx1ZTogJ2RhdGEtdGFibGUtc2VsZWN0JyB9KVxuICAgICAgICBlbHNlIGhlYWRlcnMuc3BsaWNlKGluZGV4LCAxLCB7IC4uLmRlZmF1bHRIZWFkZXIsIC4uLmhlYWRlcnNbaW5kZXhdIH0pXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNob3dFeHBhbmQpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBoZWFkZXJzLmZpbmRJbmRleChoID0+IGgudmFsdWUgPT09ICdkYXRhLXRhYmxlLWV4cGFuZCcpXG4gICAgICAgIGlmIChpbmRleCA8IDApIGhlYWRlcnMudW5zaGlmdCh7IC4uLmRlZmF1bHRIZWFkZXIsIHZhbHVlOiAnZGF0YS10YWJsZS1leHBhbmQnIH0pXG4gICAgICAgIGVsc2UgaGVhZGVycy5zcGxpY2UoaW5kZXgsIDEsIHsgLi4uZGVmYXVsdEhlYWRlciwgLi4uaGVhZGVyc1tpbmRleF0gfSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGhlYWRlcnNcbiAgICB9LFxuICAgIGNvbHNwYW5BdHRycyAoKTogb2JqZWN0IHwgdW5kZWZpbmVkIHtcbiAgICAgIHJldHVybiB0aGlzLmlzTW9iaWxlID8gdW5kZWZpbmVkIDoge1xuICAgICAgICBjb2xzcGFuOiB0aGlzLmhlYWRlcnNMZW5ndGggfHwgdGhpcy5jb21wdXRlZEhlYWRlcnMubGVuZ3RoLFxuICAgICAgfVxuICAgIH0sXG4gICAgY29sdW1uU29ydGVycyAoKTogUmVjb3JkPHN0cmluZywgRGF0YVRhYmxlQ29tcGFyZUZ1bmN0aW9uPiB7XG4gICAgICByZXR1cm4gdGhpcy5jb21wdXRlZEhlYWRlcnMucmVkdWNlPFJlY29yZDxzdHJpbmcsIERhdGFUYWJsZUNvbXBhcmVGdW5jdGlvbj4+KChhY2MsIGhlYWRlcikgPT4ge1xuICAgICAgICBpZiAoaGVhZGVyLnNvcnQpIGFjY1toZWFkZXIudmFsdWVdID0gaGVhZGVyLnNvcnRcbiAgICAgICAgcmV0dXJuIGFjY1xuICAgICAgfSwge30pXG4gICAgfSxcbiAgICBoZWFkZXJzV2l0aEN1c3RvbUZpbHRlcnMgKCk6IERhdGFUYWJsZUhlYWRlcltdIHtcbiAgICAgIHJldHVybiB0aGlzLmhlYWRlcnMuZmlsdGVyKGhlYWRlciA9PiBoZWFkZXIuZmlsdGVyICYmICghaGVhZGVyLmhhc093blByb3BlcnR5KCdmaWx0ZXJhYmxlJykgfHwgaGVhZGVyLmZpbHRlcmFibGUgPT09IHRydWUpKVxuICAgIH0sXG4gICAgaGVhZGVyc1dpdGhvdXRDdXN0b21GaWx0ZXJzICgpOiBEYXRhVGFibGVIZWFkZXJbXSB7XG4gICAgICByZXR1cm4gdGhpcy5oZWFkZXJzLmZpbHRlcihoZWFkZXIgPT4gIWhlYWRlci5maWx0ZXIgJiYgKCFoZWFkZXIuaGFzT3duUHJvcGVydHkoJ2ZpbHRlcmFibGUnKSB8fCBoZWFkZXIuZmlsdGVyYWJsZSA9PT0gdHJ1ZSkpXG4gICAgfSxcbiAgICBzYW5pdGl6ZWRIZWFkZXJQcm9wcyAoKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gICAgICByZXR1cm4gY2FtZWxpemVPYmplY3RLZXlzKHRoaXMuaGVhZGVyUHJvcHMpXG4gICAgfSxcbiAgICBjb21wdXRlZEl0ZW1zUGVyUGFnZSAoKTogbnVtYmVyIHtcbiAgICAgIGNvbnN0IGl0ZW1zUGVyUGFnZSA9IHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuaXRlbXNQZXJQYWdlID8gdGhpcy5vcHRpb25zLml0ZW1zUGVyUGFnZSA6IHRoaXMuaXRlbXNQZXJQYWdlXG4gICAgICBjb25zdCBpdGVtc1BlclBhZ2VPcHRpb25zOiBEYXRhSXRlbXNQZXJQYWdlT3B0aW9uW10gfCB1bmRlZmluZWQgPSB0aGlzLnNhbml0aXplZEZvb3RlclByb3BzLml0ZW1zUGVyUGFnZU9wdGlvbnNcblxuICAgICAgaWYgKFxuICAgICAgICBpdGVtc1BlclBhZ2VPcHRpb25zICYmXG4gICAgICAgICFpdGVtc1BlclBhZ2VPcHRpb25zLmZpbmQoaXRlbSA9PiB0eXBlb2YgaXRlbSA9PT0gJ251bWJlcicgPyBpdGVtID09PSBpdGVtc1BlclBhZ2UgOiBpdGVtLnZhbHVlID09PSBpdGVtc1BlclBhZ2UpXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgZmlyc3RPcHRpb24gPSBpdGVtc1BlclBhZ2VPcHRpb25zWzBdXG4gICAgICAgIHJldHVybiB0eXBlb2YgZmlyc3RPcHRpb24gPT09ICdvYmplY3QnID8gZmlyc3RPcHRpb24udmFsdWUgOiBmaXJzdE9wdGlvblxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaXRlbXNQZXJQYWdlXG4gICAgfSxcbiAgICBncm91cEJ5VGV4dCAoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiB0aGlzLmhlYWRlcnM/LmZpbmQoaGVhZGVyID0+IGhlYWRlci52YWx1ZSA9PT0gdGhpcy5pbnRlcm5hbEdyb3VwQnk/LlswXSk/LnRleHQgPz8gJydcbiAgICB9LFxuICB9LFxuXG4gIGNyZWF0ZWQgKCkge1xuICAgIGNvbnN0IGJyZWFraW5nUHJvcHMgPSBbXG4gICAgICBbJ3NvcnQtaWNvbicsICdoZWFkZXItcHJvcHMuc29ydC1pY29uJ10sXG4gICAgICBbJ2hpZGUtaGVhZGVycycsICdoaWRlLWRlZmF1bHQtaGVhZGVyJ10sXG4gICAgICBbJ3NlbGVjdC1hbGwnLCAnc2hvdy1zZWxlY3QnXSxcbiAgICBdXG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGJyZWFraW5nUHJvcHMuZm9yRWFjaCgoW29yaWdpbmFsLCByZXBsYWNlbWVudF0pID0+IHtcbiAgICAgIGlmICh0aGlzLiRhdHRycy5oYXNPd25Qcm9wZXJ0eShvcmlnaW5hbCkpIGJyZWFraW5nKG9yaWdpbmFsLCByZXBsYWNlbWVudCwgdGhpcylcbiAgICB9KVxuICB9LFxuXG4gIG1vdW50ZWQgKCkge1xuICAgIC8vIGlmICgoIXRoaXMuc29ydEJ5IHx8ICF0aGlzLnNvcnRCeS5sZW5ndGgpICYmICghdGhpcy5vcHRpb25zLnNvcnRCeSB8fCAhdGhpcy5vcHRpb25zLnNvcnRCeS5sZW5ndGgpKSB7XG4gICAgLy8gICBjb25zdCBmaXJzdFNvcnRhYmxlID0gdGhpcy5oZWFkZXJzLmZpbmQoaCA9PiAhKCdzb3J0YWJsZScgaW4gaCkgfHwgISFoLnNvcnRhYmxlKVxuICAgIC8vICAgaWYgKGZpcnN0U29ydGFibGUpIHRoaXMudXBkYXRlT3B0aW9ucyh7IHNvcnRCeTogW2ZpcnN0U29ydGFibGUudmFsdWVdLCBzb3J0RGVzYzogW2ZhbHNlXSB9KVxuICAgIC8vIH1cblxuICAgIGlmICh0aGlzLmNhbGN1bGF0ZVdpZHRocykge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuY2FsY1dpZHRocylcbiAgICAgIHRoaXMuY2FsY1dpZHRocygpXG4gICAgfVxuICB9LFxuXG4gIGJlZm9yZVVubW91bnQgKCkge1xuICAgIGlmICh0aGlzLmNhbGN1bGF0ZVdpZHRocykge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuY2FsY1dpZHRocylcbiAgICB9XG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGNhbGNXaWR0aHMgKCkge1xuICAgICAgdGhpcy53aWR0aHMgPSBBcnJheS5mcm9tKHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RoJykpLm1hcChlID0+IGUuY2xpZW50V2lkdGgpXG4gICAgfSxcbiAgICBjdXN0b21GaWx0ZXJXaXRoQ29sdW1ucyAoaXRlbXM6IGFueVtdLCBzZWFyY2g6IHN0cmluZykge1xuICAgICAgcmV0dXJuIHNlYXJjaFRhYmxlSXRlbXMoXG4gICAgICAgIGl0ZW1zLFxuICAgICAgICBzZWFyY2gsXG4gICAgICAgIHRoaXMuaGVhZGVyc1dpdGhDdXN0b21GaWx0ZXJzLFxuICAgICAgICB0aGlzLmhlYWRlcnNXaXRob3V0Q3VzdG9tRmlsdGVycyxcbiAgICAgICAgdGhpcy5jdXN0b21GaWx0ZXIsXG4gICAgICAgIHRoaXMuZmlsdGVyTW9kZVxuICAgICAgKVxuICAgIH0sXG4gICAgY3VzdG9tU29ydFdpdGhIZWFkZXJzIChpdGVtczogYW55W10sIHNvcnRCeTogc3RyaW5nW10sIHNvcnREZXNjOiBib29sZWFuW10sIGxvY2FsZTogc3RyaW5nKSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXN0b21Tb3J0KGl0ZW1zLCBzb3J0QnksIHNvcnREZXNjLCBsb2NhbGUsIHRoaXMuY29sdW1uU29ydGVycylcbiAgICB9LFxuICAgIGNyZWF0ZUl0ZW1Qcm9wcyAoaXRlbTogYW55LCBpbmRleDogbnVtYmVyKTogRGF0YVRhYmxlSXRlbVByb3BzIHtcbiAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgIC4uLlZEYXRhSXRlcmF0b3IubWV0aG9kcy5jcmVhdGVJdGVtUHJvcHMuY2FsbCh0aGlzLCBpdGVtLCBpbmRleCksXG4gICAgICAgIGhlYWRlcnM6IHRoaXMuY29tcHV0ZWRIZWFkZXJzLFxuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5kYXRhLFxuICAgICAgICBjbGFzczoge1xuICAgICAgICAgICd2LWRhdGEtdGFibGVfX3NlbGVjdGVkJzogZGF0YS5pc1NlbGVjdGVkLFxuICAgICAgICB9LFxuICAgICAgICAuLi50aGlzLmdldERlZmF1bHRNb3VzZUV2ZW50SGFuZGxlcnMoJzpyb3cnLCAoKSA9PiBkYXRhLCB0cnVlKSxcbiAgICAgICAgLy8gVE9ETzogdGhlIGZpcnN0IGFyZ3VtZW50IHNob3VsZCBiZSB0aGUgZXZlbnQsIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IHNob3VsZCBiZSBkYXRhLFxuICAgICAgICAvLyBidXQgdGhpcyBpcyBhIGJyZWFraW5nIGNoYW5nZSBzbyBpdCdzIGZvciB2M1xuICAgICAgICBvbkNsaWNrOiAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHRoaXMuJGVtaXQoJ2NsaWNrOnJvdycsIGl0ZW0sIGRhdGEsIGV2ZW50KVxuICAgICAgfVxuICAgIH0sXG4gICAgZ2VuQ2FwdGlvbiAocHJvcHM6IERhdGFTY29wZVByb3BzKSB7XG4gICAgICBpZiAodGhpcy5jYXB0aW9uKSByZXR1cm4gW2goJ2NhcHRpb24nLCBbdGhpcy5jYXB0aW9uXSldXG5cbiAgICAgIHJldHVybiBnZXRTbG90KHRoaXMsICdjYXB0aW9uJywgcHJvcHMsIHRydWUpXG4gICAgfSxcbiAgICBnZW5Db2xncm91cCAocHJvcHM6IERhdGFTY29wZVByb3BzKSB7XG4gICAgICByZXR1cm4gaCgnY29sZ3JvdXAnLCB0aGlzLmNvbXB1dGVkSGVhZGVycy5tYXAoaGVhZGVyID0+IHtcbiAgICAgICAgcmV0dXJuIGgoJ2NvbCcsIHtcbiAgICAgICAgICBjbGFzczoge1xuICAgICAgICAgICAgZGl2aWRlcjogaGVhZGVyLmRpdmlkZXIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgIH0pKVxuICAgIH0sXG4gICAgZ2VuTG9hZGluZyAoKSB7XG4gICAgICBjb25zdCB0aCA9IGgoJ3RoJywge1xuICAgICAgICBjbGFzczogJ2NvbHVtbicsXG4gICAgICAgIC4uLnRoaXMuY29sc3BhbkF0dHJzLFxuICAgICAgfSwgW3RoaXMuZ2VuUHJvZ3Jlc3MoKV0pXG5cbiAgICAgIGNvbnN0IHRyID0gaCgndHInLCB7XG4gICAgICAgIGNsYXNzOiAndi1kYXRhLXRhYmxlX19wcm9ncmVzcycsXG4gICAgICB9LCBbdGhdKVxuXG4gICAgICByZXR1cm4gaCgndGhlYWQnLCBbdHJdKVxuICAgIH0sXG4gICAgZ2VuSGVhZGVycyAocHJvcHM6IERhdGFTY29wZVByb3BzKSB7XG4gICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAuLi50aGlzLnNhbml0aXplZEhlYWRlclByb3BzLFxuICAgICAgICBoZWFkZXJzOiB0aGlzLmNvbXB1dGVkSGVhZGVycyxcbiAgICAgICAgb3B0aW9uczogcHJvcHMub3B0aW9ucyxcbiAgICAgICAgbW9iaWxlOiB0aGlzLmlzTW9iaWxlLFxuICAgICAgICBzaG93R3JvdXBCeTogdGhpcy5zaG93R3JvdXBCeSxcbiAgICAgICAgY2hlY2tib3hDb2xvcjogdGhpcy5jaGVja2JveENvbG9yLFxuICAgICAgICBzb21lSXRlbXM6IHRoaXMuc29tZUl0ZW1zLFxuICAgICAgICBldmVyeUl0ZW06IHRoaXMuZXZlcnlJdGVtLFxuICAgICAgICBzaW5nbGVTZWxlY3Q6IHRoaXMuc2luZ2xlU2VsZWN0LFxuICAgICAgICBkaXNhYmxlU29ydDogdGhpcy5kaXNhYmxlU29ydCxcbiAgICAgICAgb25Tb3J0OiBwcm9wcy5zb3J0LFxuICAgICAgICBvbkdyb3VwOiBwcm9wcy5ncm91cCxcbiAgICAgICAgJ29uVG9nZ2xlLXNlbGVjdC1hbGwnOiB0aGlzLnRvZ2dsZVNlbGVjdEFsbFxuICAgICAgfVxuXG5cbiAgICAgIC8vIFRPRE86IHJlbmFtZSB0byAnaGVhZCc/ICh0aGVhZCwgdGJvZHksIHRmb290KVxuICAgICAgY29uc3QgY2hpbGRyZW46IFZOb2RlQ2hpbGRyZW5BcnJheUNvbnRlbnRzID0gW2dldFNsb3QodGhpcywgJ2hlYWRlcicsIHtcbiAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgaXNNb2JpbGU6IHRoaXMuaXNNb2JpbGUsXG4gICAgICB9KV1cblxuICAgICAgaWYgKCF0aGlzLmhpZGVEZWZhdWx0SGVhZGVyKSB7XG4gICAgICAgIGNvbnN0IHNjb3BlZFNsb3RzID0gZ2V0UHJlZml4ZWRTY29wZWRTbG90cygnaGVhZGVyLicsIHRoaXMuJHNsb3RzKVxuICAgICAgICBjaGlsZHJlbi5wdXNoKGgoVkRhdGFUYWJsZUhlYWRlciwge1xuICAgICAgICAgIC4uLmRhdGEsXG5cbiAgICAgICAgfSwgc2NvcGVkU2xvdHMpKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5sb2FkaW5nKSBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuTG9hZGluZygpKVxuXG4gICAgICByZXR1cm4gY2hpbGRyZW5cbiAgICB9LFxuICAgIGdlbkVtcHR5V3JhcHBlciAoY29udGVudDogVk5vZGVDaGlsZHJlbkFycmF5Q29udGVudHMpIHtcbiAgICAgIHJldHVybiBoKCd0cicsIHtcbiAgICAgICAgY2xhc3M6ICd2LWRhdGEtdGFibGVfX2VtcHR5LXdyYXBwZXInLFxuICAgICAgfSwgW1xuICAgICAgICBoKCd0ZCcsIHtcbiAgICAgICAgICAuLi50aGlzLmNvbHNwYW5BdHRycyxcbiAgICAgICAgfSwgY29udGVudCksXG4gICAgICBdKVxuICAgIH0sXG4gICAgZ2VuSXRlbXMgKGl0ZW1zOiBhbnlbXSwgcHJvcHM6IERhdGFTY29wZVByb3BzKSB7XG4gICAgICBjb25zdCBlbXB0eSA9IHRoaXMuZ2VuRW1wdHkocHJvcHMub3JpZ2luYWxJdGVtc0xlbmd0aCwgcHJvcHMucGFnaW5hdGlvbi5pdGVtc0xlbmd0aClcbiAgICAgIGlmIChlbXB0eSkgcmV0dXJuIFtlbXB0eV1cblxuICAgICAgcmV0dXJuIHByb3BzLmdyb3VwZWRJdGVtc1xuICAgICAgICA/IHRoaXMuZ2VuR3JvdXBlZFJvd3MocHJvcHMuZ3JvdXBlZEl0ZW1zLCBwcm9wcylcbiAgICAgICAgOiB0aGlzLmdlblJvd3MoaXRlbXMsIHByb3BzKVxuICAgIH0sXG4gICAgZ2VuR3JvdXBlZFJvd3MgKGdyb3VwZWRJdGVtczogSXRlbUdyb3VwPGFueT5bXSwgcHJvcHM6IERhdGFTY29wZVByb3BzKSB7XG4gICAgICByZXR1cm4gZ3JvdXBlZEl0ZW1zLm1hcChncm91cCA9PiB7XG4gICAgICAgIGlmICghdGhpcy5vcGVuQ2FjaGUuaGFzT3duUHJvcGVydHkoZ3JvdXAubmFtZSkpIHRoaXMub3BlbkNhY2hlW2dyb3VwLm5hbWVdID0gdHJ1ZVxuXG4gICAgICAgIGlmICh0aGlzLiRzbG90cy5ncm91cCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLiRzbG90cy5ncm91cCh7XG4gICAgICAgICAgICBncm91cDogZ3JvdXAubmFtZSxcbiAgICAgICAgICAgIG9wdGlvbnM6IHByb3BzLm9wdGlvbnMsXG4gICAgICAgICAgICBpc01vYmlsZTogdGhpcy5pc01vYmlsZSxcbiAgICAgICAgICAgIGl0ZW1zOiBncm91cC5pdGVtcyxcbiAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuY29tcHV0ZWRIZWFkZXJzLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuRGVmYXVsdEdyb3VwZWRSb3coZ3JvdXAubmFtZSwgZ3JvdXAuaXRlbXMsIHByb3BzKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sXG4gICAgZ2VuRGVmYXVsdEdyb3VwZWRSb3cgKGdyb3VwOiBzdHJpbmcsIGl0ZW1zOiBhbnlbXSwgcHJvcHM6IERhdGFTY29wZVByb3BzKSB7XG4gICAgICBjb25zdCBpc09wZW4gPSAhIXRoaXMub3BlbkNhY2hlW2dyb3VwXVxuICAgICAgY29uc3QgY2hpbGRyZW46IFZOb2RlQ2hpbGRyZW4gPSBbXG4gICAgICAgIGgoJ3RlbXBsYXRlJywgeyBzbG90OiAncm93LmNvbnRlbnQnIH0sIHRoaXMuZ2VuUm93cyhpdGVtcywgcHJvcHMpKSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHRvZ2dsZUZuID0gKCkgPT4gdGhpcy5vcGVuQ2FjaGVbZ3JvdXBdID0gIXRoaXMub3BlbkNhY2hlW2dyb3VwXVxuICAgICAgY29uc3QgcmVtb3ZlRm4gPSAoKSA9PiBwcm9wcy51cGRhdGVPcHRpb25zKHsgZ3JvdXBCeTogW10sIGdyb3VwRGVzYzogW10gfSlcblxuICAgICAgaWYgKHRoaXMuJHNsb3RzWydncm91cC5oZWFkZXInXSkge1xuICAgICAgICBjaGlsZHJlbi51bnNoaWZ0KGgoJ3RlbXBsYXRlJywgeyBzbG90OiAnY29sdW1uLmhlYWRlcicgfSwgW1xuICAgICAgICAgIHRoaXMuJHNsb3RzWydncm91cC5oZWFkZXInXSEoe1xuICAgICAgICAgICAgZ3JvdXAsXG4gICAgICAgICAgICBncm91cEJ5OiBwcm9wcy5ncm91cEJ5LFxuICAgICAgICAgICAgaXNNb2JpbGU6IHRoaXMuaXNNb2JpbGUsXG4gICAgICAgICAgICBpdGVtcyxcbiAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuY29tcHV0ZWRIZWFkZXJzLFxuICAgICAgICAgICAgaXNPcGVuLFxuICAgICAgICAgICAgdG9nZ2xlOiB0b2dnbGVGbixcbiAgICAgICAgICAgIHJlbW92ZTogcmVtb3ZlRm4sXG4gICAgICAgICAgfSksXG4gICAgICAgIF0pKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdG9nZ2xlID0gaChWQnRuLCB7XG4gICAgICAgICAgY2xhc3M6ICdtYS0wJyxcbiAgICAgICAgICBpY29uOiB0cnVlLFxuICAgICAgICAgIHNtYWxsOiB0cnVlLFxuICAgICAgICAgIG9uQ2xpY2s6IHRvZ2dsZUZuXG4gICAgICAgIH0sICgpID0+IFtoKFZJY29uLCB7fSwgKCkgPT4gW2lzT3BlbiA/ICckbWludXMnIDogJyRwbHVzJ10pXSlcblxuICAgICAgICBjb25zdCByZW1vdmUgPSBoKFZCdG4sIHtcbiAgICAgICAgICBjbGFzczogJ21hLTAnLFxuICAgICAgICAgIGljb246IHRydWUsXG4gICAgICAgICAgc21hbGw6IHRydWUsXG4gICAgICAgICAgb25DbGljazogcmVtb3ZlRm4sXG4gICAgICAgIH0sICgpID0+IFtoKFZJY29uLCB7fSwgKCkgPT4gWyckY2xvc2UnXSldKVxuXG4gICAgICAgIGNvbnN0IGNvbHVtbiA9IGgoJ3RkJywge1xuICAgICAgICAgIGNsYXNzOiAndGV4dC1zdGFydCcsXG4gICAgICAgICAgLi4udGhpcy5jb2xzcGFuQXR0cnMsXG4gICAgICAgIH0sIFt0b2dnbGUsIGAke3RoaXMuZ3JvdXBCeVRleHR9OiAke2dyb3VwfWAsIHJlbW92ZV0pXG5cbiAgICAgICAgY2hpbGRyZW4udW5zaGlmdChoKCd0ZW1wbGF0ZScsIHsgc2xvdDogJ2NvbHVtbi5oZWFkZXInIH0sIFtjb2x1bW5dKSlcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuJHNsb3RzWydncm91cC5zdW1tYXJ5J10pIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaChoKCd0ZW1wbGF0ZScsIHsgc2xvdDogJ2NvbHVtbi5zdW1tYXJ5JyB9LCBbXG4gICAgICAgICAgdGhpcy4kc2xvdHNbJ2dyb3VwLnN1bW1hcnknXSEoe1xuICAgICAgICAgICAgZ3JvdXAsXG4gICAgICAgICAgICBncm91cEJ5OiBwcm9wcy5ncm91cEJ5LFxuICAgICAgICAgICAgaXNNb2JpbGU6IHRoaXMuaXNNb2JpbGUsXG4gICAgICAgICAgICBpdGVtcyxcbiAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuY29tcHV0ZWRIZWFkZXJzLFxuICAgICAgICAgICAgaXNPcGVuLFxuICAgICAgICAgICAgdG9nZ2xlOiB0b2dnbGVGbixcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoKFJvd0dyb3VwLCB7XG4gICAgICAgIGtleTogZ3JvdXAsXG4gICAgICAgIG1vZGVsVmFsdWU6IGlzT3BlbixcbiAgICAgIH0sIGNoaWxkcmVuKVxuICAgIH0sXG4gICAgZ2VuUm93cyAoaXRlbXM6IGFueVtdLCBwcm9wczogRGF0YVNjb3BlUHJvcHMpIHtcbiAgICAgIHJldHVybiB0aGlzLiRzbG90cy5pdGVtID8gdGhpcy5nZW5TY29wZWRSb3dzKGl0ZW1zLCBwcm9wcykgOiB0aGlzLmdlbkRlZmF1bHRSb3dzKGl0ZW1zLCBwcm9wcylcbiAgICB9LFxuICAgIGdlblNjb3BlZFJvd3MgKGl0ZW1zOiBhbnlbXSwgcHJvcHM6IERhdGFTY29wZVByb3BzKSB7XG4gICAgICBjb25zdCByb3dzID0gW11cblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBpdGVtID0gaXRlbXNbaV1cbiAgICAgICAgcm93cy5wdXNoKHRoaXMuJHNsb3RzLml0ZW0hKHtcbiAgICAgICAgICAuLi50aGlzLmNyZWF0ZUl0ZW1Qcm9wcyhpdGVtLCBpKSxcbiAgICAgICAgICBpc01vYmlsZTogdGhpcy5pc01vYmlsZSxcbiAgICAgICAgfSkpXG5cbiAgICAgICAgaWYgKHRoaXMuaXNFeHBhbmRlZChpdGVtKSkge1xuICAgICAgICAgIHJvd3MucHVzaCh0aGlzLiRzbG90c1snZXhwYW5kZWQtaXRlbSddISh7XG4gICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmNvbXB1dGVkSGVhZGVycyxcbiAgICAgICAgICAgIGlzTW9iaWxlOiB0aGlzLmlzTW9iaWxlLFxuICAgICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgICBpdGVtLFxuICAgICAgICAgIH0pKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByb3dzXG4gICAgfSxcbiAgICBnZW5EZWZhdWx0Um93cyAoaXRlbXM6IGFueVtdLCBwcm9wczogRGF0YVNjb3BlUHJvcHMpIHtcbiAgICAgIHJldHVybiB0aGlzLiRzbG90c1snZXhwYW5kZWQtaXRlbSddXG4gICAgICAgID8gaXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4gdGhpcy5nZW5EZWZhdWx0RXhwYW5kZWRSb3coaXRlbSwgaW5kZXgpKVxuICAgICAgICA6IGl0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpID0+IHRoaXMuZ2VuRGVmYXVsdFNpbXBsZVJvdyhpdGVtLCBpbmRleCkpXG4gICAgfSxcbiAgICBnZW5EZWZhdWx0RXhwYW5kZWRSb3cgKGl0ZW06IGFueSwgaW5kZXg6IG51bWJlcik6IFZOb2RlIHtcbiAgICAgIGNvbnN0IGlzRXhwYW5kZWQgPSB0aGlzLmlzRXhwYW5kZWQoaXRlbSlcbiAgICAgIGNvbnN0IGNsYXNzZXMgPSB7XG4gICAgICAgICd2LWRhdGEtdGFibGVfX2V4cGFuZGVkIHYtZGF0YS10YWJsZV9fZXhwYW5kZWRfX3Jvdyc6IGlzRXhwYW5kZWQsXG4gICAgICB9XG4gICAgICBjb25zdCBoZWFkZXJSb3cgPSB0aGlzLmdlbkRlZmF1bHRTaW1wbGVSb3coaXRlbSwgaW5kZXgsIGNsYXNzZXMpXG4gICAgICBjb25zdCBleHBhbmRlZFJvdyA9IGgoJ3RyJywge1xuICAgICAgICBjbGFzczogJ3YtZGF0YS10YWJsZV9fZXhwYW5kZWQgdi1kYXRhLXRhYmxlX19leHBhbmRlZF9fY29udGVudCcsXG4gICAgICB9LCBbdGhpcy4kc2xvdHNbJ2V4cGFuZGVkLWl0ZW0nXSEoe1xuICAgICAgICBoZWFkZXJzOiB0aGlzLmNvbXB1dGVkSGVhZGVycyxcbiAgICAgICAgaXNNb2JpbGU6IHRoaXMuaXNNb2JpbGUsXG4gICAgICAgIGl0ZW0sXG4gICAgICB9KV0pXG5cbiAgICAgIHJldHVybiBoKFJvd0dyb3VwLCB7XG4gICAgICAgIG1vZGVsVmFsdWU6IGlzRXhwYW5kZWQsXG4gICAgICB9LCBbXG4gICAgICAgIGgoJ3RlbXBsYXRlJywgeyBzbG90OiAncm93LmhlYWRlcicgfSwgW2hlYWRlclJvd10pLFxuICAgICAgICBoKCd0ZW1wbGF0ZScsIHsgc2xvdDogJ3Jvdy5jb250ZW50JyB9LCBbZXhwYW5kZWRSb3ddKSxcbiAgICAgIF0pXG4gICAgfSxcbiAgICBnZW5EZWZhdWx0U2ltcGxlUm93IChpdGVtOiBhbnksIGluZGV4OiBudW1iZXIsIGNsYXNzZXM6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+ID0ge30pOiBWTm9kZSB7XG4gICAgICBjb25zdCBzY29wZWRTbG90cyA9IGdldFByZWZpeGVkU2NvcGVkU2xvdHMoJ2l0ZW0uJywgdGhpcy4kc2xvdHMpXG5cbiAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmNyZWF0ZUl0ZW1Qcm9wcyhpdGVtLCBpbmRleClcblxuICAgICAgaWYgKHRoaXMuc2hvd1NlbGVjdCkge1xuICAgICAgICBjb25zdCBzbG90ID0gc2NvcGVkU2xvdHNbJ2RhdGEtdGFibGUtc2VsZWN0J11cbiAgICAgICAgc2NvcGVkU2xvdHNbJ2RhdGEtdGFibGUtc2VsZWN0J10gPSBzbG90ID8gKCkgPT4gc2xvdCh7XG4gICAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgICBpc01vYmlsZTogdGhpcy5pc01vYmlsZSxcbiAgICAgICAgfSkgOiAoKSA9PiBoKFZTaW1wbGVDaGVja2JveCwge1xuICAgICAgICAgIGNsYXNzOiAndi1kYXRhLXRhYmxlX19jaGVja2JveCcsXG4gICAgICAgICAgbW9kZWxWYWx1ZTogZGF0YS5pc1NlbGVjdGVkLFxuICAgICAgICAgIGRpc2FibGVkOiAhdGhpcy5pc1NlbGVjdGFibGUoaXRlbSksXG4gICAgICAgICAgY29sb3I6IHRoaXMuY2hlY2tib3hDb2xvciA/PyAnJyxcbiAgICAgICAgICAnb25VcGRhdGU6bW9kZWxWYWx1ZSc6ICh2YWw6IGJvb2xlYW4pID0+IGRhdGEuc2VsZWN0KHZhbCksXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNob3dFeHBhbmQpIHtcbiAgICAgICAgY29uc3Qgc2xvdCA9IHNjb3BlZFNsb3RzWydkYXRhLXRhYmxlLWV4cGFuZCddXG4gICAgICAgIHNjb3BlZFNsb3RzWydkYXRhLXRhYmxlLWV4cGFuZCddID0gc2xvdCA/ICgpID0+IHNsb3QoZGF0YSkgOiAoKSA9PiBoKFZJY29uLCB7XG4gICAgICAgICAgY2xhc3M6IFsndi1kYXRhLXRhYmxlX19leHBhbmQtaWNvbicsIHtcbiAgICAgICAgICAgICd2LWRhdGEtdGFibGVfX2V4cGFuZC1pY29uLS1hY3RpdmUnOiBkYXRhLmlzRXhwYW5kZWQsXG4gICAgICAgICAgfV0sXG4gICAgICAgICAgb25DbGljazogKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgIGRhdGEuZXhwYW5kKCFkYXRhLmlzRXhwYW5kZWQpXG4gICAgICAgICAgfVxuICAgICAgICB9LCAoKSA9PiBbdGhpcy5leHBhbmRJY29uXSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGgodGhpcy5pc01vYmlsZSA/IE1vYmlsZVJvdyA6IFJvdywge1xuICAgICAgICBrZXk6IGdldE9iamVjdFZhbHVlQnlQYXRoKGl0ZW0sIHRoaXMuaXRlbUtleSksXG4gICAgICAgIGNsYXNzOiBtZXJnZUNsYXNzZXMoXG4gICAgICAgICAgeyAuLi5jbGFzc2VzLCAndi1kYXRhLXRhYmxlX19zZWxlY3RlZCc6IGRhdGEuaXNTZWxlY3RlZCB9LFxuICAgICAgICAgIGdldFByb3BlcnR5RnJvbUl0ZW0oaXRlbSwgdGhpcy5pdGVtQ2xhc3MpXG4gICAgICAgICksXG4gICAgICAgIHN0eWxlOiBtZXJnZVN0eWxlcyh7fSwgZ2V0UHJvcGVydHlGcm9tSXRlbShpdGVtLCB0aGlzLml0ZW1TdHlsZSkpLFxuICAgICAgICBoZWFkZXJzOiB0aGlzLmNvbXB1dGVkSGVhZGVycyxcbiAgICAgICAgaGlkZURlZmF1bHRIZWFkZXI6IHRoaXMuaGlkZURlZmF1bHRIZWFkZXIsXG4gICAgICAgIGluZGV4LFxuICAgICAgICBpdGVtLFxuICAgICAgICBydGw6IHRoaXMuJHZ1ZXRpZnkucnRsLFxuICAgICAgICAuLi5kYXRhLm9uLFxuICAgICAgfSwgc2NvcGVkU2xvdHMpXG4gICAgfSxcbiAgICBnZW5Cb2R5IChwcm9wczogRGF0YVNjb3BlUHJvcHMpOiBWTm9kZSB8IHN0cmluZyB8IFZOb2RlQ2hpbGRyZW4ge1xuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgLi4ucHJvcHMsXG4gICAgICAgIGV4cGFuZDogdGhpcy5leHBhbmQsXG4gICAgICAgIGhlYWRlcnM6IHRoaXMuY29tcHV0ZWRIZWFkZXJzLFxuICAgICAgICBpc0V4cGFuZGVkOiB0aGlzLmlzRXhwYW5kZWQsXG4gICAgICAgIGlzTW9iaWxlOiB0aGlzLmlzTW9iaWxlLFxuICAgICAgICBpc1NlbGVjdGVkOiB0aGlzLmlzU2VsZWN0ZWQsXG4gICAgICAgIHNlbGVjdDogdGhpcy5zZWxlY3QsXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLiRzbG90cy5ib2R5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRzbG90cy5ib2R5IShkYXRhKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaCgndGJvZHknLCBbXG4gICAgICAgIGdldFNsb3QodGhpcywgJ2JvZHkucHJlcGVuZCcsIGRhdGEsIHRydWUpLFxuICAgICAgICB0aGlzLmdlbkl0ZW1zKHByb3BzLml0ZW1zLCBwcm9wcyksXG4gICAgICAgIGdldFNsb3QodGhpcywgJ2JvZHkuYXBwZW5kJywgZGF0YSwgdHJ1ZSksXG4gICAgICBdKVxuICAgIH0sXG4gICAgZ2VuRm9vdCAocHJvcHM6IERhdGFTY29wZVByb3BzKTogVk5vZGVbXSB8IHVuZGVmaW5lZCB7XG4gICAgICByZXR1cm4gdGhpcy4kc2xvdHMuZm9vdD8uKHByb3BzKVxuICAgIH0sXG4gICAgZ2VuRm9vdGVycyAocHJvcHM6IERhdGFTY29wZVByb3BzKSB7XG4gICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICBvcHRpb25zOiBwcm9wcy5vcHRpb25zLFxuICAgICAgICBwYWdpbmF0aW9uOiBwcm9wcy5wYWdpbmF0aW9uLFxuICAgICAgICBpdGVtc1BlclBhZ2VUZXh0OiAnJHZ1ZXRpZnkuZGF0YVRhYmxlLml0ZW1zUGVyUGFnZVRleHQnLFxuICAgICAgICAuLi50aGlzLnNhbml0aXplZEZvb3RlclByb3BzLFxuICAgICAgICAnb25VcGRhdGU6b3B0aW9ucyc6ICh2YWx1ZTogYW55KSA9PiBwcm9wcy51cGRhdGVPcHRpb25zKHZhbHVlKSxcbiAgICAgIH1cblxuICAgICAgY29uc3QgY2hpbGRyZW46IFZOb2RlQ2hpbGRyZW4gPSBbXG4gICAgICAgIGdldFNsb3QodGhpcywgJ2Zvb3RlcicsIHtcbiAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgIHdpZHRoczogdGhpcy53aWR0aHMsXG4gICAgICAgICAgaGVhZGVyczogdGhpcy5jb21wdXRlZEhlYWRlcnNcbiAgICAgICAgfSwgdHJ1ZSksXG4gICAgICBdXG5cbiAgICAgIGlmICghdGhpcy5oaWRlRGVmYXVsdEZvb3Rlcikge1xuICAgICAgICBjaGlsZHJlbi5wdXNoKGgoVkRhdGFGb290ZXIsIHtcbiAgICAgICAgICAuLi5kYXRhXG4gICAgICAgIH0sIGdldFByZWZpeGVkU2NvcGVkU2xvdHMoJ2Zvb3Rlci4nLCB0aGlzLiRzbG90cykpKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2hpbGRyZW5cbiAgICB9LFxuICAgIGdlbkRlZmF1bHRTY29wZWRTbG90IChwcm9wczogRGF0YVNjb3BlUHJvcHMpOiBWTm9kZSB7XG4gICAgICBjb25zdCBzaW1wbGVQcm9wcyA9IHtcbiAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgICAgZml4ZWRIZWFkZXI6IHRoaXMuZml4ZWRIZWFkZXIsXG4gICAgICAgIGRlbnNlOiB0aGlzLmRlbnNlLFxuICAgICAgfVxuXG4gICAgICAvLyBpZiAodGhpcy52aXJ0dWFsUm93cykge1xuICAgICAgLy8gICByZXR1cm4gaChWVmlydHVhbFRhYmxlLCB7XG4gICAgICAvLyAgICAgcHJvcHM6IE9iamVjdC5hc3NpZ24oc2ltcGxlUHJvcHMsIHtcbiAgICAgIC8vICAgICAgIGl0ZW1zOiBwcm9wcy5pdGVtcyxcbiAgICAgIC8vICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICAvLyAgICAgICByb3dIZWlnaHQ6IHRoaXMuZGVuc2UgPyAyNCA6IDQ4LFxuICAgICAgLy8gICAgICAgaGVhZGVySGVpZ2h0OiB0aGlzLmRlbnNlID8gMzIgOiA0OCxcbiAgICAgIC8vICAgICAgIC8vIFRPRE86IGV4cG9zZSByZXN0IG9mIHByb3BzIGZyb20gdmlydHVhbCB0YWJsZT9cbiAgICAgIC8vICAgICB9KSxcbiAgICAgIC8vICAgICBzY29wZWRTbG90czoge1xuICAgICAgLy8gICAgICAgaXRlbXM6ICh7IGl0ZW1zIH0pID0+IHRoaXMuZ2VuSXRlbXMoaXRlbXMsIHByb3BzKSBhcyBhbnksXG4gICAgICAvLyAgICAgfSxcbiAgICAgIC8vICAgfSwgW1xuICAgICAgLy8gICAgIHRoaXMucHJveHlTbG90KCdib2R5LmJlZm9yZScsIFt0aGlzLmdlbkNhcHRpb24ocHJvcHMpLCB0aGlzLmdlbkhlYWRlcnMocHJvcHMpXSksXG4gICAgICAvLyAgICAgdGhpcy5wcm94eVNsb3QoJ2JvdHRvbScsIHRoaXMuZ2VuRm9vdGVycyhwcm9wcykpLFxuICAgICAgLy8gICBdKVxuICAgICAgLy8gfVxuXG4gICAgICByZXR1cm4gaChWU2ltcGxlVGFibGUsIHtcbiAgICAgICAgLi4uc2ltcGxlUHJvcHMsXG4gICAgICAgIGNsYXNzOiB7XG4gICAgICAgICAgJ3YtZGF0YS10YWJsZS0tbW9iaWxlJzogdGhpcy5pc01vYmlsZSxcbiAgICAgICAgICAndi1kYXRhLXRhYmxlLS1zZWxlY3RhYmxlJzogdGhpcy5zaG93U2VsZWN0LFxuICAgICAgICB9LFxuICAgICAgfSwge1xuICAgICAgICBkZWZhdWx0OiAoKSA9PiBbXG4gICAgICAgICAgdGhpcy5nZW5DYXB0aW9uKHByb3BzKSxcbiAgICAgICAgICB0aGlzLmdlbkNvbGdyb3VwKHByb3BzKSxcbiAgICAgICAgICB0aGlzLmdlbkhlYWRlcnMocHJvcHMpLFxuICAgICAgICAgIHRoaXMuZ2VuQm9keShwcm9wcyksXG4gICAgICAgICAgdGhpcy5nZW5Gb290KHByb3BzKSxcbiAgICAgICAgXSxcbiAgICAgICAgdG9wOiAoKSA9PiBnZXRTbG90KHRoaXMsICd0b3AnLCB7XG4gICAgICAgICAgLi4ucHJvcHMsXG4gICAgICAgICAgaXNNb2JpbGU6IHRoaXMuaXNNb2JpbGUsXG4gICAgICAgIH0sIHRydWUpLFxuICAgICAgICBib3R0b206ICgpID0+IHRoaXMuZ2VuRm9vdGVycyhwcm9wcylcbiAgICAgIH0pXG4gICAgfVxuICB9LFxuXG4gIHJlbmRlciAoKTogVk5vZGUge1xuICAgIHJldHVybiBoKFZEYXRhLCB7XG4gICAgICAuLi50aGlzLiRwcm9wcyxcbiAgICAgIGN1c3RvbUZpbHRlcjogdGhpcy5jdXN0b21GaWx0ZXJXaXRoQ29sdW1ucyxcbiAgICAgIGN1c3RvbVNvcnQ6IHRoaXMuY3VzdG9tU29ydFdpdGhIZWFkZXJzLFxuICAgICAgaXRlbXNQZXJQYWdlOiB0aGlzLmNvbXB1dGVkSXRlbXNQZXJQYWdlLFxuICAgICAgJ29uVXBkYXRlOm9wdGlvbnMnOiAodjogRGF0YU9wdGlvbnMsIG9sZDogRGF0YU9wdGlvbnMpID0+IHtcbiAgICAgICAgdGhpcy5pbnRlcm5hbEdyb3VwQnkgPSB2Lmdyb3VwQnkgfHwgW11cbiAgICAgICAgIWRlZXBFcXVhbCh2LCBvbGQpICYmIHRoaXMuJGVtaXQoJ3VwZGF0ZTpvcHRpb25zJywgdilcbiAgICAgIH0sXG4gICAgICAnb25VcGRhdGU6cGFnZSc6ICh2OiBudW1iZXIpID0+IHRoaXMuJGVtaXQoJ3VwZGF0ZTpwYWdlJywgdiksXG4gICAgICAnb25VcGRhdGU6aXRlbXMtcGVyLXBhZ2UnOiAodjogbnVtYmVyKSA9PiB0aGlzLiRlbWl0KCd1cGRhdGU6aXRlbXMtcGVyLXBhZ2UnLCB2KSxcbiAgICAgICdvblVwZGF0ZTpzb3J0LWJ5JzogKHY6IHN0cmluZyB8IHN0cmluZ1tdKSA9PiB0aGlzLiRlbWl0KCd1cGRhdGU6c29ydC1ieScsIHYpLFxuICAgICAgJ29uVXBkYXRlOnNvcnQtZGVzYyc6ICh2OiBib29sZWFuIHwgYm9vbGVhbltdKSA9PiB0aGlzLiRlbWl0KCd1cGRhdGU6c29ydC1kZXNjJywgdiksXG4gICAgICAnb25VcGRhdGU6Z3JvdXAtYnknOiAodjogc3RyaW5nIHwgc3RyaW5nW10pID0+IHRoaXMuJGVtaXQoJ3VwZGF0ZTpncm91cC1ieScsIHYpLFxuICAgICAgJ29uVXBkYXRlOmdyb3VwLWRlc2MnOiAodjogYm9vbGVhbiB8IGJvb2xlYW5bXSkgPT4gdGhpcy4kZW1pdCgndXBkYXRlOmdyb3VwLWRlc2MnLCB2KSxcbiAgICAgIG9uUGFnaW5hdGlvbjogKHY6IERhdGFQYWdpbmF0aW9uLCBvbGQ6IERhdGFQYWdpbmF0aW9uKSA9PiAhZGVlcEVxdWFsKHYsIG9sZCkgJiYgdGhpcy4kZW1pdCgncGFnaW5hdGlvbicsIHYpLFxuICAgICAgJ29uQ3VycmVudC1pdGVtcyc6ICh2OiBhbnlbXSkgPT4ge1xuICAgICAgICB0aGlzLmludGVybmFsQ3VycmVudEl0ZW1zID0gdlxuICAgICAgICB0aGlzLiRlbWl0KCdjdXJyZW50LWl0ZW1zJywgdilcbiAgICAgIH0sXG4gICAgICAnb25QYWdlLWNvdW50JzogKHY6IG51bWJlcikgPT4gdGhpcy4kZW1pdCgncGFnZS1jb3VudCcsIHYpLFxuICAgIH0sIHRoaXMuZ2VuRGVmYXVsdFNjb3BlZFNsb3QpXG4gIH0sXG59KVxuIl19