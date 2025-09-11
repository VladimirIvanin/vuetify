// Helpers
import { wrapInArray, sortItems, deepEqual, groupItems, searchItems, fillArray } from '../../util/helpers';
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'v-data',
    inheritAttrs: false,
    props: {
        items: {
            type: Array,
            default: () => [],
        },
        options: {
            type: Object,
            default: () => ({}),
        },
        sortBy: {
            type: [String, Array],
        },
        sortDesc: {
            type: [Boolean, Array],
        },
        customSort: {
            type: Function,
            default: sortItems,
        },
        mustSort: Boolean,
        multiSort: Boolean,
        page: {
            type: Number,
            default: 1,
        },
        itemsPerPage: {
            type: Number,
            default: 10,
        },
        groupBy: {
            type: [String, Array],
            default: () => [],
        },
        groupDesc: {
            type: [Boolean, Array],
            default: () => [],
        },
        customGroup: {
            type: Function,
            default: groupItems,
        },
        locale: {
            type: String,
            default: 'en-US',
        },
        disableSort: Boolean,
        disablePagination: Boolean,
        disableFiltering: Boolean,
        search: String,
        customFilter: {
            type: Function,
            default: searchItems,
        },
        serverItemsLength: {
            type: Number,
            default: -1,
        },
    },
    emits: ['update:options', 'update:page', 'update:items-per-page', 'update:sort-by', 'update:sort-desc', 'update:group-by', 'update:group-desc', 'update:multi-sort', 'update:must-sort', 'page-count', 'current-items', 'pagination'],
    data() {
        let internalOptions = {
            page: this.page,
            itemsPerPage: this.itemsPerPage,
            sortBy: wrapInArray(this.sortBy),
            sortDesc: wrapInArray(this.sortDesc),
            groupBy: wrapInArray(this.groupBy),
            groupDesc: wrapInArray(this.groupDesc),
            mustSort: this.mustSort,
            multiSort: this.multiSort,
        };
        if (this.options) {
            internalOptions = Object.assign(internalOptions, this.options);
        }
        const { sortBy, sortDesc, groupBy, groupDesc } = internalOptions;
        const sortDiff = sortBy.length - sortDesc.length;
        const groupDiff = groupBy.length - groupDesc.length;
        if (sortDiff > 0) {
            internalOptions.sortDesc.push(...fillArray(sortDiff, false));
        }
        if (groupDiff > 0) {
            internalOptions.groupDesc.push(...fillArray(groupDiff, false));
        }
        return {
            internalOptions,
        };
    },
    computed: {
        itemsLength() {
            return this.serverItemsLength >= 0 ? this.serverItemsLength : this.filteredItems.length;
        },
        pageCount() {
            return this.internalOptions.itemsPerPage <= 0
                ? 1
                : Math.ceil(this.itemsLength / this.internalOptions.itemsPerPage);
        },
        pageStart() {
            if (this.internalOptions.itemsPerPage === -1 || !this.items.length)
                return 0;
            return (this.internalOptions.page - 1) * this.internalOptions.itemsPerPage;
        },
        pageStop() {
            if (this.internalOptions.itemsPerPage === -1)
                return this.itemsLength;
            if (!this.items.length)
                return 0;
            return Math.min(this.itemsLength, this.internalOptions.page * this.internalOptions.itemsPerPage);
        },
        isGrouped() {
            return !!this.internalOptions.groupBy.length;
        },
        pagination() {
            return {
                page: this.internalOptions.page,
                itemsPerPage: this.internalOptions.itemsPerPage,
                pageStart: this.pageStart,
                pageStop: this.pageStop,
                pageCount: this.pageCount,
                itemsLength: this.itemsLength,
            };
        },
        filteredItems() {
            let items = this.items.slice();
            if (!this.disableFiltering && this.serverItemsLength <= 0) {
                items = this.customFilter(items, this.search);
            }
            return items;
        },
        computedItems() {
            let items = this.filteredItems.slice();
            if ((!this.disableSort || this.internalOptions.groupBy.length) && this.serverItemsLength <= 0) {
                items = this.sortItems(items);
            }
            if (!this.disablePagination && this.serverItemsLength <= 0) {
                items = this.paginateItems(items);
            }
            return items;
        },
        groupedItems() {
            return this.isGrouped ? this.groupItems(this.computedItems) : null;
        },
        scopedProps() {
            return {
                sort: this.sort,
                sortArray: this.sortArray,
                group: this.group,
                items: this.computedItems,
                options: this.internalOptions,
                updateOptions: this.updateOptions,
                pagination: this.pagination,
                groupedItems: this.groupedItems,
                originalItemsLength: this.items.length,
            };
        },
        computedOptions() {
            return { ...this.options };
        },
    },
    watch: {
        computedOptions: {
            handler(options, old) {
                if (deepEqual(options, old))
                    return;
                this.updateOptions(options);
            },
            deep: true,
            immediate: true,
        },
        internalOptions: {
            handler(options, old) {
                if (deepEqual(options, old))
                    return;
                this.$emit('update:options', options);
            },
            deep: true,
            /*
              In Vue 3 this watcher fires even before created hook and
              if mounting fails and the consumer code relies on update:options event to fetch data
              it causes infinite loop because each data update triggers an attempt to render a table,
              but because mounting constantly fails(for example, due to error in slot) it never happens.
              Previously, in Vue 2 slot errors didn't cause mounting failure, we had partially rendered component.
              This immediate prop is compensated by firing event in mounted hook.
            */
            // immediate: true,
        },
        page(page) {
            this.updateOptions({ page });
        },
        'internalOptions.page'(page) {
            this.$emit('update:page', page);
        },
        itemsPerPage(itemsPerPage) {
            this.updateOptions({ itemsPerPage });
        },
        'internalOptions.itemsPerPage'(itemsPerPage) {
            this.$emit('update:items-per-page', itemsPerPage);
        },
        sortBy(sortBy) {
            this.updateOptions({ sortBy: wrapInArray(sortBy) });
        },
        'internalOptions.sortBy'(sortBy, old) {
            !deepEqual(sortBy, old) && this.$emit('update:sort-by', Array.isArray(this.sortBy) ? sortBy : sortBy[0]);
        },
        sortDesc(sortDesc) {
            this.updateOptions({ sortDesc: wrapInArray(sortDesc) });
        },
        'internalOptions.sortDesc'(sortDesc, old) {
            !deepEqual(sortDesc, old) && this.$emit('update:sort-desc', Array.isArray(this.sortDesc) ? sortDesc : sortDesc[0]);
        },
        groupBy(groupBy) {
            this.updateOptions({ groupBy: wrapInArray(groupBy) });
        },
        'internalOptions.groupBy'(groupBy, old) {
            !deepEqual(groupBy, old) && this.$emit('update:group-by', Array.isArray(this.groupBy) ? groupBy : groupBy[0]);
        },
        groupDesc(groupDesc) {
            this.updateOptions({ groupDesc: wrapInArray(groupDesc) });
        },
        'internalOptions.groupDesc'(groupDesc, old) {
            !deepEqual(groupDesc, old) && this.$emit('update:group-desc', Array.isArray(this.groupDesc) ? groupDesc : groupDesc[0]);
        },
        multiSort(multiSort) {
            this.updateOptions({ multiSort });
        },
        'internalOptions.multiSort'(multiSort) {
            this.$emit('update:multi-sort', multiSort);
        },
        mustSort(mustSort) {
            this.updateOptions({ mustSort });
        },
        'internalOptions.mustSort'(mustSort) {
            this.$emit('update:must-sort', mustSort);
        },
        pageCount: {
            handler(pageCount) {
                this.$emit('page-count', pageCount);
            },
            immediate: true,
        },
        computedItems: {
            handler(computedItems) {
                this.$emit('current-items', computedItems);
            },
            immediate: true,
        },
        pagination: {
            handler(pagination, old) {
                if (deepEqual(pagination, old))
                    return;
                this.$emit('pagination', this.pagination);
            },
            immediate: true,
        },
    },
    methods: {
        toggle(key, oldBy, oldDesc, page, mustSort, multiSort) {
            let by = oldBy.slice();
            let desc = oldDesc.slice();
            const byIndex = by.findIndex((k) => k === key);
            if (byIndex < 0) {
                if (!multiSort) {
                    by = [];
                    desc = [];
                }
                by.push(key);
                desc.push(false);
            }
            else if (byIndex >= 0 && !desc[byIndex]) {
                desc[byIndex] = true;
            }
            else if (!mustSort) {
                by.splice(byIndex, 1);
                desc.splice(byIndex, 1);
            }
            else {
                desc[byIndex] = false;
            }
            // Reset page to 1 if sortBy or sortDesc have changed
            if (!deepEqual(by, oldBy) || !deepEqual(desc, oldDesc)) {
                page = 1;
            }
            return { by, desc, page };
        },
        group(key) {
            const { by: groupBy, desc: groupDesc, page } = this.toggle(key, this.internalOptions.groupBy, this.internalOptions.groupDesc, this.internalOptions.page, true, false);
            this.updateOptions({ groupBy, groupDesc, page });
        },
        sort(key) {
            if (Array.isArray(key))
                return this.sortArray(key);
            const { by: sortBy, desc: sortDesc, page } = this.toggle(key, this.internalOptions.sortBy, this.internalOptions.sortDesc, this.internalOptions.page, this.internalOptions.mustSort, this.internalOptions.multiSort);
            this.updateOptions({ sortBy, sortDesc, page });
        },
        sortArray(sortBy) {
            const sortDesc = sortBy.map(s => {
                const i = this.internalOptions.sortBy.findIndex((k) => k === s);
                return i > -1 ? this.internalOptions.sortDesc[i] : false;
            });
            this.updateOptions({ sortBy, sortDesc });
        },
        updateOptions(options) {
            this.internalOptions = {
                ...this.internalOptions,
                ...options,
                page: this.serverItemsLength < 0
                    ? Math.max(1, Math.min(options.page || this.internalOptions.page, this.pageCount))
                    : options.page || this.internalOptions.page,
            };
        },
        sortItems(items) {
            let sortBy = [];
            let sortDesc = [];
            if (!this.disableSort) {
                sortBy = this.internalOptions.sortBy;
                sortDesc = this.internalOptions.sortDesc;
            }
            if (this.internalOptions.groupBy.length) {
                sortBy = [...this.internalOptions.groupBy, ...sortBy];
                sortDesc = [...this.internalOptions.groupDesc, ...sortDesc];
            }
            return this.customSort(items, sortBy, sortDesc, this.locale);
        },
        groupItems(items) {
            return this.customGroup(items, this.internalOptions.groupBy, this.internalOptions.groupDesc);
        },
        paginateItems(items) {
            // Make sure we don't try to display non-existant page if items suddenly change
            // TODO: Could possibly move this to pageStart/pageStop?
            if (this.serverItemsLength === -1 && items.length <= this.pageStart) {
                this.internalOptions.page = Math.max(1, Math.ceil(items.length / this.internalOptions.itemsPerPage)) || 1; // Prevent NaN
            }
            return items.slice(this.pageStart, this.pageStop);
        },
    },
    render() {
        return this.$slots.default && this.$slots.default(this.scopedProps)[0];
    },
    mounted() {
        this.$emit('update:options', this.internalOptions);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WRGF0YS9WRGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxVQUFVO0FBQ1YsT0FBTyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDMUcsT0FBTyxFQUFFLGVBQWUsRUFBUyxNQUFNLEtBQUssQ0FBQTtBQWM1QyxlQUFlLGVBQWUsQ0FBQztJQUM3QixJQUFJLEVBQUUsUUFBUTtJQUVkLFlBQVksRUFBRSxLQUFLO0lBRW5CLEtBQUssRUFBRTtRQUNMLEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxLQUFLO1lBQ1gsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7U0FDTTtRQUN6QixPQUFPLEVBQUU7WUFDUCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUNtQjtRQUN4QyxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDO1NBQzBCO1FBQ2pELFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUM7U0FDMkI7UUFDbkQsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsU0FBUztTQUNnQjtRQUNwQyxRQUFRLEVBQUUsT0FBTztRQUNqQixTQUFTLEVBQUUsT0FBTztRQUNsQixJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFDRCxZQUFZLEVBQUU7WUFDWixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxFQUFFO1NBQ1o7UUFDRCxPQUFPLEVBQUU7WUFDUCxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUs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QUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUM5RixDQUFDO1FBQ0QsYUFBYSxDQUFFLEtBQVk7WUFDekIsK0VBQStFO1lBQy9FLHdEQUF3RDtZQUN4RCxJQUFJLElBQUksQ0FBQyxpQkFBaUIsS0FBSyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ25FLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBLENBQUMsY0FBYzthQUN6SDtZQUVELE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNuRCxDQUFDO0tBQ0Y7SUFFRCxNQUFNO1FBQ0osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFRLENBQUE7SUFDL0UsQ0FBQztJQUNELE9BQU87UUFDTCxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtJQUNwRCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gSGVscGVyc1xuaW1wb3J0IHsgd3JhcEluQXJyYXksIHNvcnRJdGVtcywgZGVlcEVxdWFsLCBncm91cEl0ZW1zLCBzZWFyY2hJdGVtcywgZmlsbEFycmF5IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IHsgZGVmaW5lQ29tcG9uZW50LCBWTm9kZSB9IGZyb20gJ3Z1ZSdcblxuLy8gVHlwZXNcbmltcG9ydCB7XG4gIERhdGFPcHRpb25zLFxuICBEYXRhUGFnaW5hdGlvbixcbiAgRGF0YVNjb3BlUHJvcHMsXG4gIERhdGFTb3J0RnVuY3Rpb24sXG4gIERhdGFHcm91cEZ1bmN0aW9uLFxuICBEYXRhU2VhcmNoRnVuY3Rpb24sXG4gIEl0ZW1Hcm91cCxcbn0gZnJvbSAndnVldGlmeS90eXBlcydcbmltcG9ydCB7IFByb3BWYWxpZGF0b3IgfSBmcm9tICd2dWUvdHlwZXMvb3B0aW9ucydcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29tcG9uZW50KHtcbiAgbmFtZTogJ3YtZGF0YScsXG5cbiAgaW5oZXJpdEF0dHJzOiBmYWxzZSxcblxuICBwcm9wczoge1xuICAgIGl0ZW1zOiB7XG4gICAgICB0eXBlOiBBcnJheSxcbiAgICAgIGRlZmF1bHQ6ICgpID0+IFtdLFxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjxhbnlbXT4sXG4gICAgb3B0aW9uczoge1xuICAgICAgdHlwZTogT2JqZWN0LFxuICAgICAgZGVmYXVsdDogKCkgPT4gKHt9KSxcbiAgICB9IGFzIFByb3BWYWxpZGF0b3I8UGFydGlhbDxEYXRhT3B0aW9ucz4+LFxuICAgIHNvcnRCeToge1xuICAgICAgdHlwZTogW1N0cmluZywgQXJyYXldLFxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjxzdHJpbmcgfCBzdHJpbmdbXSB8IHVuZGVmaW5lZD4sXG4gICAgc29ydERlc2M6IHtcbiAgICAgIHR5cGU6IFtCb29sZWFuLCBBcnJheV0sXG4gICAgfSBhcyBQcm9wVmFsaWRhdG9yPGJvb2xlYW4gfCBib29sZWFuW10gfCB1bmRlZmluZWQ+LFxuICAgIGN1c3RvbVNvcnQ6IHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uLFxuICAgICAgZGVmYXVsdDogc29ydEl0ZW1zLFxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjxEYXRhU29ydEZ1bmN0aW9uPixcbiAgICBtdXN0U29ydDogQm9vbGVhbixcbiAgICBtdWx0aVNvcnQ6IEJvb2xlYW4sXG4gICAgcGFnZToge1xuICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgZGVmYXVsdDogMSxcbiAgICB9LFxuICAgIGl0ZW1zUGVyUGFnZToge1xuICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgZGVmYXVsdDogMTAsXG4gICAgfSxcbiAgICBncm91cEJ5OiB7XG4gICAgICB0eXBlOiBbU3RyaW5nLCBBcnJheV0sXG4gICAgICBkZWZhdWx0OiAoKSA9PiBbXSxcbiAgICB9IGFzIFByb3BWYWxpZGF0b3I8c3RyaW5nIHwgc3RyaW5nW10+LFxuICAgIGdyb3VwRGVzYzoge1xuICAgICAgdHlwZTogW0Jvb2xlYW4sIEFycmF5XSxcbiAgICAgIGRlZmF1bHQ6ICgpID0+IFtdLFxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjxib29sZWFuIHwgYm9vbGVhbltdPixcbiAgICBjdXN0b21Hcm91cDoge1xuICAgICAgdHlwZTogRnVuY3Rpb24sXG4gICAgICBkZWZhdWx0OiBncm91cEl0ZW1zLFxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjxEYXRhR3JvdXBGdW5jdGlvbj4sXG4gICAgbG9jYWxlOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnZW4tVVMnLFxuICAgIH0sXG4gICAgZGlzYWJsZVNvcnQ6IEJvb2xlYW4sXG4gICAgZGlzYWJsZVBhZ2luYXRpb246IEJvb2xlYW4sXG4gICAgZGlzYWJsZUZpbHRlcmluZzogQm9vbGVhbixcbiAgICBzZWFyY2g6IFN0cmluZyxcbiAgICBjdXN0b21GaWx0ZXI6IHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uLFxuICAgICAgZGVmYXVsdDogc2VhcmNoSXRlbXMsXG4gICAgfSBhcyBQcm9wVmFsaWRhdG9yPERhdGFTZWFyY2hGdW5jdGlvbj4sXG4gICAgc2VydmVySXRlbXNMZW5ndGg6IHtcbiAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgIGRlZmF1bHQ6IC0xLFxuICAgIH0sXG4gIH0sXG5cbiAgZW1pdHM6IFsndXBkYXRlOm9wdGlvbnMnLCAndXBkYXRlOnBhZ2UnLCAndXBkYXRlOml0ZW1zLXBlci1wYWdlJywgJ3VwZGF0ZTpzb3J0LWJ5JywgJ3VwZGF0ZTpzb3J0LWRlc2MnLCAndXBkYXRlOmdyb3VwLWJ5JywgJ3VwZGF0ZTpncm91cC1kZXNjJywgJ3VwZGF0ZTptdWx0aS1zb3J0JywgJ3VwZGF0ZTptdXN0LXNvcnQnLCAncGFnZS1jb3VudCcsICdjdXJyZW50LWl0ZW1zJywgJ3BhZ2luYXRpb24nXSxcblxuICBkYXRhICgpIHtcbiAgICBsZXQgaW50ZXJuYWxPcHRpb25zOiBEYXRhT3B0aW9ucyA9IHtcbiAgICAgIHBhZ2U6IHRoaXMucGFnZSxcbiAgICAgIGl0ZW1zUGVyUGFnZTogdGhpcy5pdGVtc1BlclBhZ2UsXG4gICAgICBzb3J0Qnk6IHdyYXBJbkFycmF5KHRoaXMuc29ydEJ5KSxcbiAgICAgIHNvcnREZXNjOiB3cmFwSW5BcnJheSh0aGlzLnNvcnREZXNjKSxcbiAgICAgIGdyb3VwQnk6IHdyYXBJbkFycmF5KHRoaXMuZ3JvdXBCeSksXG4gICAgICBncm91cERlc2M6IHdyYXBJbkFycmF5KHRoaXMuZ3JvdXBEZXNjKSxcbiAgICAgIG11c3RTb3J0OiB0aGlzLm11c3RTb3J0LFxuICAgICAgbXVsdGlTb3J0OiB0aGlzLm11bHRpU29ydCxcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zKSB7XG4gICAgICBpbnRlcm5hbE9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGludGVybmFsT3B0aW9ucywgdGhpcy5vcHRpb25zKVxuICAgIH1cblxuICAgIGNvbnN0IHsgc29ydEJ5LCBzb3J0RGVzYywgZ3JvdXBCeSwgZ3JvdXBEZXNjIH0gPSBpbnRlcm5hbE9wdGlvbnNcbiAgICBjb25zdCBzb3J0RGlmZiA9IHNvcnRCeS5sZW5ndGggLSBzb3J0RGVzYy5sZW5ndGhcbiAgICBjb25zdCBncm91cERpZmYgPSBncm91cEJ5Lmxlbmd0aCAtIGdyb3VwRGVzYy5sZW5ndGhcblxuICAgIGlmIChzb3J0RGlmZiA+IDApIHtcbiAgICAgIGludGVybmFsT3B0aW9ucy5zb3J0RGVzYy5wdXNoKC4uLmZpbGxBcnJheShzb3J0RGlmZiwgZmFsc2UpKVxuICAgIH1cblxuICAgIGlmIChncm91cERpZmYgPiAwKSB7XG4gICAgICBpbnRlcm5hbE9wdGlvbnMuZ3JvdXBEZXNjLnB1c2goLi4uZmlsbEFycmF5KGdyb3VwRGlmZiwgZmFsc2UpKVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBpbnRlcm5hbE9wdGlvbnMsXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgaXRlbXNMZW5ndGggKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gdGhpcy5zZXJ2ZXJJdGVtc0xlbmd0aCA+PSAwID8gdGhpcy5zZXJ2ZXJJdGVtc0xlbmd0aCA6IHRoaXMuZmlsdGVyZWRJdGVtcy5sZW5ndGhcbiAgICB9LFxuICAgIHBhZ2VDb3VudCAoKTogbnVtYmVyIHtcbiAgICAgIHJldHVybiB0aGlzLmludGVybmFsT3B0aW9ucy5pdGVtc1BlclBhZ2UgPD0gMFxuICAgICAgICA/IDFcbiAgICAgICAgOiBNYXRoLmNlaWwodGhpcy5pdGVtc0xlbmd0aCAvIHRoaXMuaW50ZXJuYWxPcHRpb25zLml0ZW1zUGVyUGFnZSlcbiAgICB9LFxuICAgIHBhZ2VTdGFydCAoKTogbnVtYmVyIHtcbiAgICAgIGlmICh0aGlzLmludGVybmFsT3B0aW9ucy5pdGVtc1BlclBhZ2UgPT09IC0xIHx8ICF0aGlzLml0ZW1zLmxlbmd0aCkgcmV0dXJuIDBcblxuICAgICAgcmV0dXJuICh0aGlzLmludGVybmFsT3B0aW9ucy5wYWdlIC0gMSkgKiB0aGlzLmludGVybmFsT3B0aW9ucy5pdGVtc1BlclBhZ2VcbiAgICB9LFxuICAgIHBhZ2VTdG9wICgpOiBudW1iZXIge1xuICAgICAgaWYgKHRoaXMuaW50ZXJuYWxPcHRpb25zLml0ZW1zUGVyUGFnZSA9PT0gLTEpIHJldHVybiB0aGlzLml0ZW1zTGVuZ3RoXG4gICAgICBpZiAoIXRoaXMuaXRlbXMubGVuZ3RoKSByZXR1cm4gMFxuXG4gICAgICByZXR1cm4gTWF0aC5taW4odGhpcy5pdGVtc0xlbmd0aCwgdGhpcy5pbnRlcm5hbE9wdGlvbnMucGFnZSAqIHRoaXMuaW50ZXJuYWxPcHRpb25zLml0ZW1zUGVyUGFnZSlcbiAgICB9LFxuICAgIGlzR3JvdXBlZCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gISF0aGlzLmludGVybmFsT3B0aW9ucy5ncm91cEJ5Lmxlbmd0aFxuICAgIH0sXG4gICAgcGFnaW5hdGlvbiAoKTogRGF0YVBhZ2luYXRpb24ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcGFnZTogdGhpcy5pbnRlcm5hbE9wdGlvbnMucGFnZSxcbiAgICAgICAgaXRlbXNQZXJQYWdlOiB0aGlzLmludGVybmFsT3B0aW9ucy5pdGVtc1BlclBhZ2UsXG4gICAgICAgIHBhZ2VTdGFydDogdGhpcy5wYWdlU3RhcnQsXG4gICAgICAgIHBhZ2VTdG9wOiB0aGlzLnBhZ2VTdG9wLFxuICAgICAgICBwYWdlQ291bnQ6IHRoaXMucGFnZUNvdW50LFxuICAgICAgICBpdGVtc0xlbmd0aDogdGhpcy5pdGVtc0xlbmd0aCxcbiAgICAgIH1cbiAgICB9LFxuICAgIGZpbHRlcmVkSXRlbXMgKCk6IGFueVtdIHtcbiAgICAgIGxldCBpdGVtcyA9IHRoaXMuaXRlbXMuc2xpY2UoKVxuXG4gICAgICBpZiAoIXRoaXMuZGlzYWJsZUZpbHRlcmluZyAmJiB0aGlzLnNlcnZlckl0ZW1zTGVuZ3RoIDw9IDApIHtcbiAgICAgICAgaXRlbXMgPSB0aGlzLmN1c3RvbUZpbHRlcihpdGVtcywgdGhpcy5zZWFyY2gpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpdGVtc1xuICAgIH0sXG4gICAgY29tcHV0ZWRJdGVtcyAoKTogYW55W10ge1xuICAgICAgbGV0IGl0ZW1zID0gdGhpcy5maWx0ZXJlZEl0ZW1zLnNsaWNlKClcblxuICAgICAgaWYgKCghdGhpcy5kaXNhYmxlU29ydCB8fCB0aGlzLmludGVybmFsT3B0aW9ucy5ncm91cEJ5Lmxlbmd0aCkgJiYgdGhpcy5zZXJ2ZXJJdGVtc0xlbmd0aCA8PSAwKSB7XG4gICAgICAgIGl0ZW1zID0gdGhpcy5zb3J0SXRlbXMoaXRlbXMpXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5kaXNhYmxlUGFnaW5hdGlvbiAmJiB0aGlzLnNlcnZlckl0ZW1zTGVuZ3RoIDw9IDApIHtcbiAgICAgICAgaXRlbXMgPSB0aGlzLnBhZ2luYXRlSXRlbXMoaXRlbXMpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpdGVtc1xuICAgIH0sXG4gICAgZ3JvdXBlZEl0ZW1zICgpOiBJdGVtR3JvdXA8YW55PltdIHwgbnVsbCB7XG4gICAgICByZXR1cm4gdGhpcy5pc0dyb3VwZWQgPyB0aGlzLmdyb3VwSXRlbXModGhpcy5jb21wdXRlZEl0ZW1zKSA6IG51bGxcbiAgICB9LFxuICAgIHNjb3BlZFByb3BzICgpOiBEYXRhU2NvcGVQcm9wcyB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzb3J0OiB0aGlzLnNvcnQsXG4gICAgICAgIHNvcnRBcnJheTogdGhpcy5zb3J0QXJyYXksXG4gICAgICAgIGdyb3VwOiB0aGlzLmdyb3VwLFxuICAgICAgICBpdGVtczogdGhpcy5jb21wdXRlZEl0ZW1zLFxuICAgICAgICBvcHRpb25zOiB0aGlzLmludGVybmFsT3B0aW9ucyxcbiAgICAgICAgdXBkYXRlT3B0aW9uczogdGhpcy51cGRhdGVPcHRpb25zLFxuICAgICAgICBwYWdpbmF0aW9uOiB0aGlzLnBhZ2luYXRpb24sXG4gICAgICAgIGdyb3VwZWRJdGVtczogdGhpcy5ncm91cGVkSXRlbXMsXG4gICAgICAgIG9yaWdpbmFsSXRlbXNMZW5ndGg6IHRoaXMuaXRlbXMubGVuZ3RoLFxuICAgICAgfVxuICAgIH0sXG4gICAgY29tcHV0ZWRPcHRpb25zICgpOiBEYXRhT3B0aW9ucyB7XG4gICAgICByZXR1cm4geyAuLi50aGlzLm9wdGlvbnMgfSBhcyBEYXRhT3B0aW9uc1xuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBjb21wdXRlZE9wdGlvbnM6IHtcbiAgICAgIGhhbmRsZXIgKG9wdGlvbnM6IERhdGFPcHRpb25zLCBvbGQ6IERhdGFPcHRpb25zKSB7XG4gICAgICAgIGlmIChkZWVwRXF1YWwob3B0aW9ucywgb2xkKSkgcmV0dXJuXG5cbiAgICAgICAgdGhpcy51cGRhdGVPcHRpb25zKG9wdGlvbnMpXG4gICAgICB9LFxuICAgICAgZGVlcDogdHJ1ZSxcbiAgICAgIGltbWVkaWF0ZTogdHJ1ZSxcbiAgICB9LFxuICAgIGludGVybmFsT3B0aW9uczoge1xuICAgICAgaGFuZGxlciAob3B0aW9uczogRGF0YU9wdGlvbnMsIG9sZDogRGF0YU9wdGlvbnMpIHtcbiAgICAgICAgaWYgKGRlZXBFcXVhbChvcHRpb25zLCBvbGQpKSByZXR1cm5cbiAgICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOm9wdGlvbnMnLCBvcHRpb25zKVxuICAgICAgfSxcbiAgICAgIGRlZXA6IHRydWUsXG4gICAgICAvKlxuICAgICAgICBJbiBWdWUgMyB0aGlzIHdhdGNoZXIgZmlyZXMgZXZlbiBiZWZvcmUgY3JlYXRlZCBob29rIGFuZFxuICAgICAgICBpZiBtb3VudGluZyBmYWlscyBhbmQgdGhlIGNvbnN1bWVyIGNvZGUgcmVsaWVzIG9uIHVwZGF0ZTpvcHRpb25zIGV2ZW50IHRvIGZldGNoIGRhdGFcbiAgICAgICAgaXQgY2F1c2VzIGluZmluaXRlIGxvb3AgYmVjYXVzZSBlYWNoIGRhdGEgdXBkYXRlIHRyaWdnZXJzIGFuIGF0dGVtcHQgdG8gcmVuZGVyIGEgdGFibGUsXG4gICAgICAgIGJ1dCBiZWNhdXNlIG1vdW50aW5nIGNvbnN0YW50bHkgZmFpbHMoZm9yIGV4YW1wbGUsIGR1ZSB0byBlcnJvciBpbiBzbG90KSBpdCBuZXZlciBoYXBwZW5zLlxuICAgICAgICBQcmV2aW91c2x5LCBpbiBWdWUgMiBzbG90IGVycm9ycyBkaWRuJ3QgY2F1c2UgbW91bnRpbmcgZmFpbHVyZSwgd2UgaGFkIHBhcnRpYWxseSByZW5kZXJlZCBjb21wb25lbnQuXG4gICAgICAgIFRoaXMgaW1tZWRpYXRlIHByb3AgaXMgY29tcGVuc2F0ZWQgYnkgZmlyaW5nIGV2ZW50IGluIG1vdW50ZWQgaG9vay5cbiAgICAgICovXG4gICAgICAvLyBpbW1lZGlhdGU6IHRydWUsXG4gICAgfSxcbiAgICBwYWdlIChwYWdlOiBudW1iZXIpIHtcbiAgICAgIHRoaXMudXBkYXRlT3B0aW9ucyh7IHBhZ2UgfSlcbiAgICB9LFxuICAgICdpbnRlcm5hbE9wdGlvbnMucGFnZScgKHBhZ2U6IG51bWJlcikge1xuICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOnBhZ2UnLCBwYWdlKVxuICAgIH0sXG4gICAgaXRlbXNQZXJQYWdlIChpdGVtc1BlclBhZ2U6IG51bWJlcikge1xuICAgICAgdGhpcy51cGRhdGVPcHRpb25zKHsgaXRlbXNQZXJQYWdlIH0pXG4gICAgfSxcbiAgICAnaW50ZXJuYWxPcHRpb25zLml0ZW1zUGVyUGFnZScgKGl0ZW1zUGVyUGFnZTogbnVtYmVyKSB7XG4gICAgICB0aGlzLiRlbWl0KCd1cGRhdGU6aXRlbXMtcGVyLXBhZ2UnLCBpdGVtc1BlclBhZ2UpXG4gICAgfSxcbiAgICBzb3J0QnkgKHNvcnRCeTogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICAgIHRoaXMudXBkYXRlT3B0aW9ucyh7IHNvcnRCeTogd3JhcEluQXJyYXkoc29ydEJ5KSB9KVxuICAgIH0sXG4gICAgJ2ludGVybmFsT3B0aW9ucy5zb3J0QnknIChzb3J0Qnk6IHN0cmluZ1tdLCBvbGQ6IHN0cmluZ1tdKSB7XG4gICAgICAhZGVlcEVxdWFsKHNvcnRCeSwgb2xkKSAmJiB0aGlzLiRlbWl0KCd1cGRhdGU6c29ydC1ieScsIEFycmF5LmlzQXJyYXkodGhpcy5zb3J0QnkpID8gc29ydEJ5IDogc29ydEJ5WzBdKVxuICAgIH0sXG4gICAgc29ydERlc2MgKHNvcnREZXNjOiBib29sZWFuIHwgYm9vbGVhbltdKSB7XG4gICAgICB0aGlzLnVwZGF0ZU9wdGlvbnMoeyBzb3J0RGVzYzogd3JhcEluQXJyYXkoc29ydERlc2MpIH0pXG4gICAgfSxcbiAgICAnaW50ZXJuYWxPcHRpb25zLnNvcnREZXNjJyAoc29ydERlc2M6IGJvb2xlYW5bXSwgb2xkOiBib29sZWFuW10pIHtcbiAgICAgICFkZWVwRXF1YWwoc29ydERlc2MsIG9sZCkgJiYgdGhpcy4kZW1pdCgndXBkYXRlOnNvcnQtZGVzYycsIEFycmF5LmlzQXJyYXkodGhpcy5zb3J0RGVzYykgPyBzb3J0RGVzYyA6IHNvcnREZXNjWzBdKVxuICAgIH0sXG4gICAgZ3JvdXBCeSAoZ3JvdXBCeTogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICAgIHRoaXMudXBkYXRlT3B0aW9ucyh7IGdyb3VwQnk6IHdyYXBJbkFycmF5KGdyb3VwQnkpIH0pXG4gICAgfSxcbiAgICAnaW50ZXJuYWxPcHRpb25zLmdyb3VwQnknIChncm91cEJ5OiBzdHJpbmdbXSwgb2xkOiBzdHJpbmdbXSkge1xuICAgICAgIWRlZXBFcXVhbChncm91cEJ5LCBvbGQpICYmIHRoaXMuJGVtaXQoJ3VwZGF0ZTpncm91cC1ieScsIEFycmF5LmlzQXJyYXkodGhpcy5ncm91cEJ5KSA/IGdyb3VwQnkgOiBncm91cEJ5WzBdKVxuICAgIH0sXG4gICAgZ3JvdXBEZXNjIChncm91cERlc2M6IGJvb2xlYW4gfCBib29sZWFuW10pIHtcbiAgICAgIHRoaXMudXBkYXRlT3B0aW9ucyh7IGdyb3VwRGVzYzogd3JhcEluQXJyYXkoZ3JvdXBEZXNjKSB9KVxuICAgIH0sXG4gICAgJ2ludGVybmFsT3B0aW9ucy5ncm91cERlc2MnIChncm91cERlc2M6IGJvb2xlYW5bXSwgb2xkOiBib29sZWFuW10pIHtcbiAgICAgICFkZWVwRXF1YWwoZ3JvdXBEZXNjLCBvbGQpICYmIHRoaXMuJGVtaXQoJ3VwZGF0ZTpncm91cC1kZXNjJywgQXJyYXkuaXNBcnJheSh0aGlzLmdyb3VwRGVzYykgPyBncm91cERlc2MgOiBncm91cERlc2NbMF0pXG4gICAgfSxcbiAgICBtdWx0aVNvcnQgKG11bHRpU29ydDogYm9vbGVhbikge1xuICAgICAgdGhpcy51cGRhdGVPcHRpb25zKHsgbXVsdGlTb3J0IH0pXG4gICAgfSxcbiAgICAnaW50ZXJuYWxPcHRpb25zLm11bHRpU29ydCcgKG11bHRpU29ydDogYm9vbGVhbikge1xuICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOm11bHRpLXNvcnQnLCBtdWx0aVNvcnQpXG4gICAgfSxcbiAgICBtdXN0U29ydCAobXVzdFNvcnQ6IGJvb2xlYW4pIHtcbiAgICAgIHRoaXMudXBkYXRlT3B0aW9ucyh7IG11c3RTb3J0IH0pXG4gICAgfSxcbiAgICAnaW50ZXJuYWxPcHRpb25zLm11c3RTb3J0JyAobXVzdFNvcnQ6IGJvb2xlYW4pIHtcbiAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTptdXN0LXNvcnQnLCBtdXN0U29ydClcbiAgICB9LFxuICAgIHBhZ2VDb3VudDoge1xuICAgICAgaGFuZGxlciAocGFnZUNvdW50OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy4kZW1pdCgncGFnZS1jb3VudCcsIHBhZ2VDb3VudClcbiAgICAgIH0sXG4gICAgICBpbW1lZGlhdGU6IHRydWUsXG4gICAgfSxcbiAgICBjb21wdXRlZEl0ZW1zOiB7XG4gICAgICBoYW5kbGVyIChjb21wdXRlZEl0ZW1zOiBhbnlbXSkge1xuICAgICAgICB0aGlzLiRlbWl0KCdjdXJyZW50LWl0ZW1zJywgY29tcHV0ZWRJdGVtcylcbiAgICAgIH0sXG4gICAgICBpbW1lZGlhdGU6IHRydWUsXG4gICAgfSxcbiAgICBwYWdpbmF0aW9uOiB7XG4gICAgICBoYW5kbGVyIChwYWdpbmF0aW9uOiBEYXRhUGFnaW5hdGlvbiwgb2xkOiBEYXRhUGFnaW5hdGlvbikge1xuICAgICAgICBpZiAoZGVlcEVxdWFsKHBhZ2luYXRpb24sIG9sZCkpIHJldHVyblxuICAgICAgICB0aGlzLiRlbWl0KCdwYWdpbmF0aW9uJywgdGhpcy5wYWdpbmF0aW9uKVxuICAgICAgfSxcbiAgICAgIGltbWVkaWF0ZTogdHJ1ZSxcbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICB0b2dnbGUgKGtleTogc3RyaW5nLCBvbGRCeTogc3RyaW5nW10sIG9sZERlc2M6IGJvb2xlYW5bXSwgcGFnZTogbnVtYmVyLCBtdXN0U29ydDogYm9vbGVhbiwgbXVsdGlTb3J0OiBib29sZWFuKSB7XG4gICAgICBsZXQgYnkgPSBvbGRCeS5zbGljZSgpXG4gICAgICBsZXQgZGVzYyA9IG9sZERlc2Muc2xpY2UoKVxuICAgICAgY29uc3QgYnlJbmRleCA9IGJ5LmZpbmRJbmRleCgoazogc3RyaW5nKSA9PiBrID09PSBrZXkpXG5cbiAgICAgIGlmIChieUluZGV4IDwgMCkge1xuICAgICAgICBpZiAoIW11bHRpU29ydCkge1xuICAgICAgICAgIGJ5ID0gW11cbiAgICAgICAgICBkZXNjID0gW11cbiAgICAgICAgfVxuXG4gICAgICAgIGJ5LnB1c2goa2V5KVxuICAgICAgICBkZXNjLnB1c2goZmFsc2UpXG4gICAgICB9IGVsc2UgaWYgKGJ5SW5kZXggPj0gMCAmJiAhZGVzY1tieUluZGV4XSkge1xuICAgICAgICBkZXNjW2J5SW5kZXhdID0gdHJ1ZVxuICAgICAgfSBlbHNlIGlmICghbXVzdFNvcnQpIHtcbiAgICAgICAgYnkuc3BsaWNlKGJ5SW5kZXgsIDEpXG4gICAgICAgIGRlc2Muc3BsaWNlKGJ5SW5kZXgsIDEpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZXNjW2J5SW5kZXhdID0gZmFsc2VcbiAgICAgIH1cblxuICAgICAgLy8gUmVzZXQgcGFnZSB0byAxIGlmIHNvcnRCeSBvciBzb3J0RGVzYyBoYXZlIGNoYW5nZWRcbiAgICAgIGlmICghZGVlcEVxdWFsKGJ5LCBvbGRCeSkgfHwgIWRlZXBFcXVhbChkZXNjLCBvbGREZXNjKSkge1xuICAgICAgICBwYWdlID0gMVxuICAgICAgfVxuXG4gICAgICByZXR1cm4geyBieSwgZGVzYywgcGFnZSB9XG4gICAgfSxcbiAgICBncm91cCAoa2V5OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgIGNvbnN0IHsgYnk6IGdyb3VwQnksIGRlc2M6IGdyb3VwRGVzYywgcGFnZSB9ID0gdGhpcy50b2dnbGUoXG4gICAgICAgIGtleSxcbiAgICAgICAgdGhpcy5pbnRlcm5hbE9wdGlvbnMuZ3JvdXBCeSxcbiAgICAgICAgdGhpcy5pbnRlcm5hbE9wdGlvbnMuZ3JvdXBEZXNjLFxuICAgICAgICB0aGlzLmludGVybmFsT3B0aW9ucy5wYWdlLFxuICAgICAgICB0cnVlLFxuICAgICAgICBmYWxzZVxuICAgICAgKVxuICAgICAgdGhpcy51cGRhdGVPcHRpb25zKHsgZ3JvdXBCeSwgZ3JvdXBEZXNjLCBwYWdlIH0pXG4gICAgfSxcbiAgICBzb3J0IChrZXk6IHN0cmluZyB8IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShrZXkpKSByZXR1cm4gdGhpcy5zb3J0QXJyYXkoa2V5KVxuXG4gICAgICBjb25zdCB7IGJ5OiBzb3J0QnksIGRlc2M6IHNvcnREZXNjLCBwYWdlIH0gPSB0aGlzLnRvZ2dsZShcbiAgICAgICAga2V5LFxuICAgICAgICB0aGlzLmludGVybmFsT3B0aW9ucy5zb3J0QnksXG4gICAgICAgIHRoaXMuaW50ZXJuYWxPcHRpb25zLnNvcnREZXNjLFxuICAgICAgICB0aGlzLmludGVybmFsT3B0aW9ucy5wYWdlLFxuICAgICAgICB0aGlzLmludGVybmFsT3B0aW9ucy5tdXN0U29ydCxcbiAgICAgICAgdGhpcy5pbnRlcm5hbE9wdGlvbnMubXVsdGlTb3J0XG4gICAgICApXG4gICAgICB0aGlzLnVwZGF0ZU9wdGlvbnMoeyBzb3J0QnksIHNvcnREZXNjLCBwYWdlIH0pXG4gICAgfSxcbiAgICBzb3J0QXJyYXkgKHNvcnRCeTogc3RyaW5nW10pIHtcbiAgICAgIGNvbnN0IHNvcnREZXNjID0gc29ydEJ5Lm1hcChzID0+IHtcbiAgICAgICAgY29uc3QgaSA9IHRoaXMuaW50ZXJuYWxPcHRpb25zLnNvcnRCeS5maW5kSW5kZXgoKGs6IHN0cmluZykgPT4gayA9PT0gcylcbiAgICAgICAgcmV0dXJuIGkgPiAtMSA/IHRoaXMuaW50ZXJuYWxPcHRpb25zLnNvcnREZXNjW2ldIDogZmFsc2VcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMudXBkYXRlT3B0aW9ucyh7IHNvcnRCeSwgc29ydERlc2MgfSlcbiAgICB9LFxuICAgIHVwZGF0ZU9wdGlvbnMgKG9wdGlvbnM6IGFueSkge1xuICAgICAgdGhpcy5pbnRlcm5hbE9wdGlvbnMgPSB7XG4gICAgICAgIC4uLnRoaXMuaW50ZXJuYWxPcHRpb25zLFxuICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICBwYWdlOiB0aGlzLnNlcnZlckl0ZW1zTGVuZ3RoIDwgMFxuICAgICAgICAgID8gTWF0aC5tYXgoMSwgTWF0aC5taW4ob3B0aW9ucy5wYWdlIHx8IHRoaXMuaW50ZXJuYWxPcHRpb25zLnBhZ2UsIHRoaXMucGFnZUNvdW50KSlcbiAgICAgICAgICA6IG9wdGlvbnMucGFnZSB8fCB0aGlzLmludGVybmFsT3B0aW9ucy5wYWdlLFxuICAgICAgfVxuICAgIH0sXG4gICAgc29ydEl0ZW1zIChpdGVtczogYW55W10pOiBhbnlbXSB7XG4gICAgICBsZXQgc29ydEJ5OiBzdHJpbmdbXSA9IFtdXG4gICAgICBsZXQgc29ydERlc2M6IGJvb2xlYW5bXSA9IFtdXG5cbiAgICAgIGlmICghdGhpcy5kaXNhYmxlU29ydCkge1xuICAgICAgICBzb3J0QnkgPSB0aGlzLmludGVybmFsT3B0aW9ucy5zb3J0QnlcbiAgICAgICAgc29ydERlc2MgPSB0aGlzLmludGVybmFsT3B0aW9ucy5zb3J0RGVzY1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5pbnRlcm5hbE9wdGlvbnMuZ3JvdXBCeS5sZW5ndGgpIHtcbiAgICAgICAgc29ydEJ5ID0gWy4uLnRoaXMuaW50ZXJuYWxPcHRpb25zLmdyb3VwQnksIC4uLnNvcnRCeV1cbiAgICAgICAgc29ydERlc2MgPSBbLi4udGhpcy5pbnRlcm5hbE9wdGlvbnMuZ3JvdXBEZXNjLCAuLi5zb3J0RGVzY11cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY3VzdG9tU29ydChpdGVtcywgc29ydEJ5LCBzb3J0RGVzYywgdGhpcy5sb2NhbGUpXG4gICAgfSxcbiAgICBncm91cEl0ZW1zIChpdGVtczogYW55W10pOiBJdGVtR3JvdXA8YW55PltdIHtcbiAgICAgIHJldHVybiB0aGlzLmN1c3RvbUdyb3VwKGl0ZW1zLCB0aGlzLmludGVybmFsT3B0aW9ucy5ncm91cEJ5LCB0aGlzLmludGVybmFsT3B0aW9ucy5ncm91cERlc2MpXG4gICAgfSxcbiAgICBwYWdpbmF0ZUl0ZW1zIChpdGVtczogYW55W10pOiBhbnlbXSB7XG4gICAgICAvLyBNYWtlIHN1cmUgd2UgZG9uJ3QgdHJ5IHRvIGRpc3BsYXkgbm9uLWV4aXN0YW50IHBhZ2UgaWYgaXRlbXMgc3VkZGVubHkgY2hhbmdlXG4gICAgICAvLyBUT0RPOiBDb3VsZCBwb3NzaWJseSBtb3ZlIHRoaXMgdG8gcGFnZVN0YXJ0L3BhZ2VTdG9wP1xuICAgICAgaWYgKHRoaXMuc2VydmVySXRlbXNMZW5ndGggPT09IC0xICYmIGl0ZW1zLmxlbmd0aCA8PSB0aGlzLnBhZ2VTdGFydCkge1xuICAgICAgICB0aGlzLmludGVybmFsT3B0aW9ucy5wYWdlID0gTWF0aC5tYXgoMSwgTWF0aC5jZWlsKGl0ZW1zLmxlbmd0aCAvIHRoaXMuaW50ZXJuYWxPcHRpb25zLml0ZW1zUGVyUGFnZSkpIHx8IDEgLy8gUHJldmVudCBOYU5cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGl0ZW1zLnNsaWNlKHRoaXMucGFnZVN0YXJ0LCB0aGlzLnBhZ2VTdG9wKVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgcmV0dXJuIHRoaXMuJHNsb3RzLmRlZmF1bHQgJiYgdGhpcy4kc2xvdHMuZGVmYXVsdCh0aGlzLnNjb3BlZFByb3BzKVswXSBhcyBhbnlcbiAgfSxcbiAgbW91bnRlZCgpIHtcbiAgICB0aGlzLiRlbWl0KCd1cGRhdGU6b3B0aW9ucycsIHRoaXMuaW50ZXJuYWxPcHRpb25zKVxuICB9LFxufSlcbiJdfQ==