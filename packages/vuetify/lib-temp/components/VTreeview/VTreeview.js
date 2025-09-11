import { h } from 'vue';
// Styles
import './VTreeview.sass';
// Components
import VTreeviewNode, { VTreeviewNodeProps } from './VTreeviewNode';
// Mixins
import Themeable from '../../mixins/themeable';
import { provide as RegistrableProvide } from '../../mixins/registrable';
// Utils
import { arrayDiff, deepEqual, getObjectValueByPath, } from '../../util/helpers';
import mixins from '../../util/mixins';
import { filterTreeItems, filterTreeItem, } from './util/filterTreeItems';
export default mixins(RegistrableProvide('treeview'), Themeable
/* @vue/component */
).extend({
    name: 'v-treeview',
    provide() {
        return { treeview: this };
    },
    props: {
        active: {
            type: Array,
            default: () => ([]),
        },
        dense: Boolean,
        disabled: Boolean,
        filter: Function,
        hoverable: Boolean,
        items: {
            type: Array,
            default: () => ([]),
        },
        multipleActive: Boolean,
        open: {
            type: Array,
            default: () => ([]),
        },
        openAll: Boolean,
        returnObject: {
            type: Boolean,
            default: false, // TODO: Should be true in next major
        },
        search: String,
        value: {
            type: Array,
            default: () => ([]),
        },
        ...VTreeviewNodeProps,
    },
    data: () => ({
        level: -1,
        activeCache: new Set(),
        nodes: {},
        openCache: new Set(),
        selectedCache: new Set(),
    }),
    computed: {
        excludedItems() {
            const excluded = new Set();
            if (!this.search)
                return excluded;
            for (let i = 0; i < this.items.length; i++) {
                filterTreeItems(this.filter || filterTreeItem, this.items[i], this.search, this.itemKey, this.itemText, this.itemChildren, excluded);
            }
            return excluded;
        },
    },
    watch: {
        items: {
            handler() {
                const oldKeys = Object.keys(this.nodes).map(k => getObjectValueByPath(this.nodes[k].item, this.itemKey));
                const newKeys = this.getKeys(this.items);
                const diff = arrayDiff(newKeys, oldKeys);
                // We only want to do stuff if items have changed
                if (!diff.length && newKeys.length < oldKeys.length)
                    return;
                // If nodes are removed we need to clear them from this.nodes
                diff.forEach(k => delete this.nodes[k]);
                const oldSelectedCache = [...this.selectedCache];
                this.selectedCache = new Set();
                this.activeCache = new Set();
                this.openCache = new Set();
                this.buildTree(this.items);
                // Only emit selected if selection has changed
                // as a result of items changing. This fixes a
                // potential double emit when selecting a node
                // with dynamic children
                if (!deepEqual(oldSelectedCache, [...this.selectedCache]))
                    this.emitSelected();
            },
            deep: true,
        },
        active(value) {
            this.handleNodeCacheWatcher(value, this.activeCache, this.updateActive, this.emitActive);
        },
        value(value) {
            this.handleNodeCacheWatcher(value, this.selectedCache, this.updateSelected, this.emitSelected);
        },
        open(value) {
            this.handleNodeCacheWatcher(value, this.openCache, this.updateOpen, this.emitOpen);
        },
    },
    created() {
        const getValue = (key) => this.returnObject ? getObjectValueByPath(key, this.itemKey) : key;
        this.buildTree(this.items);
        for (const value of this.value.map(getValue)) {
            this.updateSelected(value, true, true);
        }
        for (const active of this.active.map(getValue)) {
            this.updateActive(active, true);
        }
    },
    mounted() {
        if (this.openAll) {
            this.updateAll(true);
        }
        else {
            this.open.forEach(key => this.updateOpen(this.returnObject ? getObjectValueByPath(key, this.itemKey) : key, true));
            this.emitOpen();
        }
    },
    methods: {
        /** @public */
        updateAll(value) {
            Object.keys(this.nodes).forEach(key => this.updateOpen(getObjectValueByPath(this.nodes[key].item, this.itemKey), value));
            this.emitOpen();
        },
        getKeys(items, keys = []) {
            for (let i = 0; i < items.length; i++) {
                const key = getObjectValueByPath(items[i], this.itemKey);
                keys.push(key);
                const children = getObjectValueByPath(items[i], this.itemChildren);
                if (children) {
                    keys.push(...this.getKeys(children));
                }
            }
            return keys;
        },
        buildTree(items, parent = null) {
            var _a;
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const key = getObjectValueByPath(item, this.itemKey);
                const children = (_a = getObjectValueByPath(item, this.itemChildren)) !== null && _a !== void 0 ? _a : [];
                const oldNode = this.nodes.hasOwnProperty(key) ? this.nodes[key] : {
                    isSelected: false, isIndeterminate: false, isActive: false, isOpen: false, vnode: null,
                };
                const node = {
                    vnode: oldNode.vnode,
                    parent,
                    children: children.map((c) => getObjectValueByPath(c, this.itemKey)),
                    item,
                };
                this.buildTree(children, key);
                // This fixed bug with dynamic children resetting selected parent state
                if (this.selectionType !== 'independent' &&
                    parent !== null &&
                    !this.nodes.hasOwnProperty(key) &&
                    this.nodes.hasOwnProperty(parent)) {
                    node.isSelected = this.nodes[parent].isSelected;
                }
                else {
                    node.isSelected = oldNode.isSelected;
                    node.isIndeterminate = oldNode.isIndeterminate;
                }
                node.isActive = oldNode.isActive;
                node.isOpen = oldNode.isOpen;
                this.nodes[key] = node;
                if (children.length && this.selectionType !== 'independent') {
                    const { isSelected, isIndeterminate } = this.calculateState(key, this.nodes);
                    node.isSelected = isSelected;
                    node.isIndeterminate = isIndeterminate;
                }
                // Don't forget to rebuild cache
                if (this.nodes[key].isSelected && (this.selectionType === 'independent' || node.children.length === 0))
                    this.selectedCache.add(key);
                if (this.nodes[key].isActive)
                    this.activeCache.add(key);
                if (this.nodes[key].isOpen)
                    this.openCache.add(key);
                this.updateVnodeState(key);
            }
        },
        calculateState(node, state) {
            const children = state[node].children;
            const counts = children.reduce((counts, child) => {
                counts[0] += +Boolean(state[child].isSelected);
                counts[1] += +Boolean(state[child].isIndeterminate);
                return counts;
            }, [0, 0]);
            const isSelected = !!children.length && counts[0] === children.length;
            const isIndeterminate = !isSelected && (counts[0] > 0 || counts[1] > 0);
            return {
                isSelected,
                isIndeterminate,
            };
        },
        emitOpen() {
            this.emitNodeCache('update:open', this.openCache);
        },
        emitSelected() {
            this.emitNodeCache('input', this.selectedCache);
        },
        emitActive() {
            this.emitNodeCache('update:active', this.activeCache);
        },
        emitNodeCache(event, cache) {
            this.$emit(event, this.returnObject ? [...cache].map(key => this.nodes[key].item) : [...cache]);
        },
        handleNodeCacheWatcher(value, cache, updateFn, emitFn) {
            value = this.returnObject ? value.map(v => getObjectValueByPath(v, this.itemKey)) : value;
            const old = [...cache];
            if (deepEqual(old, value))
                return;
            old.forEach(key => updateFn(key, false));
            value.forEach(key => updateFn(key, true));
            emitFn();
        },
        getDescendants(key, descendants = []) {
            const children = this.nodes[key].children;
            descendants.push(...children);
            for (let i = 0; i < children.length; i++) {
                descendants = this.getDescendants(children[i], descendants);
            }
            return descendants;
        },
        getParents(key) {
            let parent = this.nodes[key].parent;
            const parents = [];
            while (parent !== null) {
                parents.push(parent);
                parent = this.nodes[parent].parent;
            }
            return parents;
        },
        register(node) {
            const key = getObjectValueByPath(node.item, this.itemKey);
            this.nodes[key].vnode = node;
            this.updateVnodeState(key);
        },
        unregister(node) {
            const key = getObjectValueByPath(node.item, this.itemKey);
            if (this.nodes[key])
                this.nodes[key].vnode = null;
        },
        isParent(key) {
            return this.nodes[key].children && this.nodes[key].children.length;
        },
        updateActive(key, isActive) {
            if (!this.nodes.hasOwnProperty(key))
                return;
            if (!this.multipleActive) {
                this.activeCache.forEach(active => {
                    this.nodes[active].isActive = false;
                    this.updateVnodeState(active);
                    this.activeCache.delete(active);
                });
            }
            const node = this.nodes[key];
            if (!node)
                return;
            if (isActive)
                this.activeCache.add(key);
            else
                this.activeCache.delete(key);
            node.isActive = isActive;
            this.updateVnodeState(key);
        },
        updateSelected(key, isSelected, isForced = false) {
            if (!this.nodes.hasOwnProperty(key))
                return;
            const changed = new Map();
            if (this.selectionType !== 'independent') {
                for (const descendant of this.getDescendants(key)) {
                    if (!getObjectValueByPath(this.nodes[descendant].item, this.itemDisabled) || isForced) {
                        this.nodes[descendant].isSelected = isSelected;
                        this.nodes[descendant].isIndeterminate = false;
                        changed.set(descendant, isSelected);
                    }
                }
                const calculated = this.calculateState(key, this.nodes);
                this.nodes[key].isSelected = isSelected;
                this.nodes[key].isIndeterminate = calculated.isIndeterminate;
                changed.set(key, isSelected);
                for (const parent of this.getParents(key)) {
                    const calculated = this.calculateState(parent, this.nodes);
                    this.nodes[parent].isSelected = calculated.isSelected;
                    this.nodes[parent].isIndeterminate = calculated.isIndeterminate;
                    changed.set(parent, calculated.isSelected);
                }
            }
            else {
                this.nodes[key].isSelected = isSelected;
                this.nodes[key].isIndeterminate = false;
                changed.set(key, isSelected);
            }
            for (const [key, value] of changed.entries()) {
                this.updateVnodeState(key);
                if (this.selectionType === 'leaf' && this.isParent(key))
                    continue;
                value === true ? this.selectedCache.add(key) : this.selectedCache.delete(key);
            }
        },
        updateOpen(key, isOpen) {
            if (!this.nodes.hasOwnProperty(key))
                return;
            const node = this.nodes[key];
            const children = getObjectValueByPath(node.item, this.itemChildren);
            if (children && !children.length && node.vnode && !node.vnode.hasLoaded) {
                node.vnode.checkChildren().then(() => this.updateOpen(key, isOpen));
            }
            else if (children && children.length) {
                node.isOpen = isOpen;
                node.isOpen ? this.openCache.add(key) : this.openCache.delete(key);
                this.updateVnodeState(key);
            }
        },
        updateVnodeState(key) {
            const node = this.nodes[key];
            if (node && node.vnode) {
                node.vnode.isSelected = node.isSelected;
                node.vnode.isIndeterminate = node.isIndeterminate;
                node.vnode.isActive = node.isActive;
                node.vnode.isOpen = node.isOpen;
            }
        },
        isExcluded(key) {
            return !!this.search && this.excludedItems.has(key);
        },
    },
    render() {
        const children = this.items.length
            ? this.items.filter(item => {
                return !this.isExcluded(getObjectValueByPath(item, this.itemKey));
            }).map(item => {
                const genChild = VTreeviewNode.methods.genChild.bind(this);
                return genChild(item, this.disabled || getObjectValueByPath(item, this.itemDisabled));
            })
            /* istanbul ignore next */
            : this.$slots.default; // TODO: remove type annotation with TS 3.2
        return h('div', {
            class: ['v-treeview', {
                    'v-treeview--hoverable': this.hoverable,
                    'v-treeview--dense': this.dense,
                    ...this.themeClasses,
                }],
        }, children);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRyZWV2aWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlRyZWV2aWV3L1ZUcmVldmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsQ0FBQyxFQUFDLE1BQU0sS0FBSyxDQUFBO0FBQ3JCLFNBQVM7QUFDVCxPQUFPLGtCQUFrQixDQUFBO0FBT3pCLGFBQWE7QUFDYixPQUFPLGFBQWEsRUFBRSxFQUFFLGtCQUFrQixFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFFbkUsU0FBUztBQUNULE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sRUFBRSxPQUFPLElBQUksa0JBQWtCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQTtBQUV4RSxRQUFRO0FBQ1IsT0FBTyxFQUNMLFNBQVMsRUFDVCxTQUFTLEVBQ1Qsb0JBQW9CLEdBQ3JCLE1BQU0sb0JBQW9CLENBQUE7QUFDM0IsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFFdEMsT0FBTyxFQUNMLGVBQWUsRUFDZixjQUFjLEdBQ2YsTUFBTSx3QkFBd0IsQ0FBQTtBQWtCL0IsZUFBZSxNQUFNLENBQ25CLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxFQUM5QixTQUFTO0FBQ1Qsb0JBQW9CO0NBQ3JCLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLFlBQVk7SUFFbEIsT0FBTztRQUNMLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUE7SUFDM0IsQ0FBQztJQUVELEtBQUssRUFBRTtRQUNMLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxLQUFLO1lBQ1gsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO1NBQ1E7UUFDN0IsS0FBSyxFQUFFLE9BQU87UUFDZCxRQUFRLEVBQUUsT0FBTztRQUNqQixNQUFNLEVBQUUsUUFBMEM7UUFDbEQsU0FBUyxFQUFFLE9BQU87UUFDbEIsS0FBSyxF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QUFFO2dCQUN6QixPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7WUFDbkUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNaLE1BQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFFMUQsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLElBQUksb0JBQW9CLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO1lBQ3ZGLENBQUMsQ0FBQztZQUNGLDBCQUEwQjtZQUMxQixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFRLENBQUEsQ0FBQywyQ0FBMkM7UUFFcEUsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQ2QsS0FBSyxFQUFFLENBQUMsWUFBWSxFQUFFO29CQUNwQix1QkFBdUIsRUFBRSxJQUFJLENBQUMsU0FBUztvQkFDdkMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLEtBQUs7b0JBQy9CLEdBQUcsSUFBSSxDQUFDLFlBQVk7aUJBQ3JCLENBQUM7U0FDSCxFQUFFLFFBQVEsQ0FBQyxDQUFBO0lBQ2QsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aH0gZnJvbSAndnVlJ1xuLy8gU3R5bGVzXG5pbXBvcnQgJy4vVlRyZWV2aWV3LnNhc3MnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSwgVk5vZGVDaGlsZHJlbkFycmF5Q29udGVudHMsIFByb3BUeXBlIH0gZnJvbSAndnVlJ1xuaW1wb3J0IHsgUHJvcFZhbGlkYXRvciB9IGZyb20gJ3Z1ZS90eXBlcy9vcHRpb25zJ1xuaW1wb3J0IHsgVHJlZXZpZXdJdGVtRnVuY3Rpb24gfSBmcm9tICd2dWV0aWZ5L3R5cGVzJ1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgVlRyZWV2aWV3Tm9kZSwgeyBWVHJlZXZpZXdOb2RlUHJvcHMgfSBmcm9tICcuL1ZUcmVldmlld05vZGUnXG5cbi8vIE1peGluc1xuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xuaW1wb3J0IHsgcHJvdmlkZSBhcyBSZWdpc3RyYWJsZVByb3ZpZGUgfSBmcm9tICcuLi8uLi9taXhpbnMvcmVnaXN0cmFibGUnXG5cbi8vIFV0aWxzXG5pbXBvcnQge1xuICBhcnJheURpZmYsXG4gIGRlZXBFcXVhbCxcbiAgZ2V0T2JqZWN0VmFsdWVCeVBhdGgsXG59IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgeyBjb25zb2xlV2FybiB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcbmltcG9ydCB7XG4gIGZpbHRlclRyZWVJdGVtcyxcbiAgZmlsdGVyVHJlZUl0ZW0sXG59IGZyb20gJy4vdXRpbC9maWx0ZXJUcmVlSXRlbXMnXG5cbnR5cGUgVlRyZWV2aWV3Tm9kZUluc3RhbmNlID0gSW5zdGFuY2VUeXBlPHR5cGVvZiBWVHJlZXZpZXdOb2RlPlxuXG50eXBlIE5vZGVDYWNoZSA9IFNldDxzdHJpbmcgfCBudW1iZXI+XG50eXBlIE5vZGVBcnJheSA9IChzdHJpbmcgfCBudW1iZXIpW11cblxudHlwZSBOb2RlU3RhdGUgPSB7XG4gIHBhcmVudDogbnVtYmVyIHwgc3RyaW5nIHwgbnVsbFxuICBjaGlsZHJlbjogKG51bWJlciB8IHN0cmluZylbXVxuICB2bm9kZTogVlRyZWV2aWV3Tm9kZUluc3RhbmNlIHwgbnVsbFxuICBpc0FjdGl2ZTogYm9vbGVhblxuICBpc1NlbGVjdGVkOiBib29sZWFuXG4gIGlzSW5kZXRlcm1pbmF0ZTogYm9vbGVhblxuICBpc09wZW46IGJvb2xlYW5cbiAgaXRlbTogYW55XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcbiAgUmVnaXN0cmFibGVQcm92aWRlKCd0cmVldmlldycpLFxuICBUaGVtZWFibGVcbiAgLyogQHZ1ZS9jb21wb25lbnQgKi9cbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtdHJlZXZpZXcnLFxuXG4gIHByb3ZpZGUgKCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIHsgdHJlZXZpZXc6IHRoaXMgfVxuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgYWN0aXZlOiB7XG4gICAgICB0eXBlOiBBcnJheSxcbiAgICAgIGRlZmF1bHQ6ICgpID0+IChbXSksXG4gICAgfSBhcyBQcm9wVmFsaWRhdG9yPE5vZGVBcnJheT4sXG4gICAgZGVuc2U6IEJvb2xlYW4sXG4gICAgZGlzYWJsZWQ6IEJvb2xlYW4sXG4gICAgZmlsdGVyOiBGdW5jdGlvbiBhcyBQcm9wVHlwZTxUcmVldmlld0l0ZW1GdW5jdGlvbj4sXG4gICAgaG92ZXJhYmxlOiBCb29sZWFuLFxuICAgIGl0ZW1zOiB7XG4gICAgICB0eXBlOiBBcnJheSxcbiAgICAgIGRlZmF1bHQ6ICgpID0+IChbXSksXG4gICAgfSBhcyBQcm9wVmFsaWRhdG9yPGFueVtdPixcbiAgICBtdWx0aXBsZUFjdGl2ZTogQm9vbGVhbixcbiAgICBvcGVuOiB7XG4gICAgICB0eXBlOiBBcnJheSxcbiAgICAgIGRlZmF1bHQ6ICgpID0+IChbXSksXG4gICAgfSBhcyBQcm9wVmFsaWRhdG9yPE5vZGVBcnJheT4sXG4gICAgb3BlbkFsbDogQm9vbGVhbixcbiAgICByZXR1cm5PYmplY3Q6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiBmYWxzZSwgLy8gVE9ETzogU2hvdWxkIGJlIHRydWUgaW4gbmV4dCBtYWpvclxuICAgIH0sXG4gICAgc2VhcmNoOiBTdHJpbmcsXG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6IEFycmF5LFxuICAgICAgZGVmYXVsdDogKCkgPT4gKFtdKSxcbiAgICB9IGFzIFByb3BWYWxpZGF0b3I8Tm9kZUFycmF5PixcbiAgICAuLi5WVHJlZXZpZXdOb2RlUHJvcHMsXG4gIH0sXG5cbiAgZGF0YTogKCkgPT4gKHtcbiAgICBsZXZlbDogLTEsXG4gICAgYWN0aXZlQ2FjaGU6IG5ldyBTZXQoKSBhcyBOb2RlQ2FjaGUsXG4gICAgbm9kZXM6IHt9IGFzIFJlY29yZDxzdHJpbmcgfCBudW1iZXIsIE5vZGVTdGF0ZT4sXG4gICAgb3BlbkNhY2hlOiBuZXcgU2V0KCkgYXMgTm9kZUNhY2hlLFxuICAgIHNlbGVjdGVkQ2FjaGU6IG5ldyBTZXQoKSBhcyBOb2RlQ2FjaGUsXG4gIH0pLFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgZXhjbHVkZWRJdGVtcyAoKTogU2V0PHN0cmluZyB8IG51bWJlcj4ge1xuICAgICAgY29uc3QgZXhjbHVkZWQgPSBuZXcgU2V0PHN0cmluZ3xudW1iZXI+KClcblxuICAgICAgaWYgKCF0aGlzLnNlYXJjaCkgcmV0dXJuIGV4Y2x1ZGVkXG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBmaWx0ZXJUcmVlSXRlbXMoXG4gICAgICAgICAgdGhpcy5maWx0ZXIgfHwgZmlsdGVyVHJlZUl0ZW0sXG4gICAgICAgICAgdGhpcy5pdGVtc1tpXSxcbiAgICAgICAgICB0aGlzLnNlYXJjaCxcbiAgICAgICAgICB0aGlzLml0ZW1LZXksXG4gICAgICAgICAgdGhpcy5pdGVtVGV4dCxcbiAgICAgICAgICB0aGlzLml0ZW1DaGlsZHJlbixcbiAgICAgICAgICBleGNsdWRlZFxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBleGNsdWRlZFxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBpdGVtczoge1xuICAgICAgaGFuZGxlciAoKSB7XG4gICAgICAgIGNvbnN0IG9sZEtleXMgPSBPYmplY3Qua2V5cyh0aGlzLm5vZGVzKS5tYXAoayA9PiBnZXRPYmplY3RWYWx1ZUJ5UGF0aCh0aGlzLm5vZGVzW2tdLml0ZW0sIHRoaXMuaXRlbUtleSkpXG4gICAgICAgIGNvbnN0IG5ld0tleXMgPSB0aGlzLmdldEtleXModGhpcy5pdGVtcylcbiAgICAgICAgY29uc3QgZGlmZiA9IGFycmF5RGlmZihuZXdLZXlzLCBvbGRLZXlzKVxuXG4gICAgICAgIC8vIFdlIG9ubHkgd2FudCB0byBkbyBzdHVmZiBpZiBpdGVtcyBoYXZlIGNoYW5nZWRcbiAgICAgICAgaWYgKCFkaWZmLmxlbmd0aCAmJiBuZXdLZXlzLmxlbmd0aCA8IG9sZEtleXMubGVuZ3RoKSByZXR1cm5cblxuICAgICAgICAvLyBJZiBub2RlcyBhcmUgcmVtb3ZlZCB3ZSBuZWVkIHRvIGNsZWFyIHRoZW0gZnJvbSB0aGlzLm5vZGVzXG4gICAgICAgIGRpZmYuZm9yRWFjaChrID0+IGRlbGV0ZSB0aGlzLm5vZGVzW2tdKVxuXG4gICAgICAgIGNvbnN0IG9sZFNlbGVjdGVkQ2FjaGUgPSBbLi4udGhpcy5zZWxlY3RlZENhY2hlXVxuICAgICAgICB0aGlzLnNlbGVjdGVkQ2FjaGUgPSBuZXcgU2V0KClcbiAgICAgICAgdGhpcy5hY3RpdmVDYWNoZSA9IG5ldyBTZXQoKVxuICAgICAgICB0aGlzLm9wZW5DYWNoZSA9IG5ldyBTZXQoKVxuICAgICAgICB0aGlzLmJ1aWxkVHJlZSh0aGlzLml0ZW1zKVxuXG4gICAgICAgIC8vIE9ubHkgZW1pdCBzZWxlY3RlZCBpZiBzZWxlY3Rpb24gaGFzIGNoYW5nZWRcbiAgICAgICAgLy8gYXMgYSByZXN1bHQgb2YgaXRlbXMgY2hhbmdpbmcuIFRoaXMgZml4ZXMgYVxuICAgICAgICAvLyBwb3RlbnRpYWwgZG91YmxlIGVtaXQgd2hlbiBzZWxlY3RpbmcgYSBub2RlXG4gICAgICAgIC8vIHdpdGggZHluYW1pYyBjaGlsZHJlblxuICAgICAgICBpZiAoIWRlZXBFcXVhbChvbGRTZWxlY3RlZENhY2hlLCBbLi4udGhpcy5zZWxlY3RlZENhY2hlXSkpIHRoaXMuZW1pdFNlbGVjdGVkKClcbiAgICAgIH0sXG4gICAgICBkZWVwOiB0cnVlLFxuICAgIH0sXG4gICAgYWN0aXZlICh2YWx1ZTogKHN0cmluZyB8IG51bWJlciB8IGFueSlbXSkge1xuICAgICAgdGhpcy5oYW5kbGVOb2RlQ2FjaGVXYXRjaGVyKHZhbHVlLCB0aGlzLmFjdGl2ZUNhY2hlLCB0aGlzLnVwZGF0ZUFjdGl2ZSwgdGhpcy5lbWl0QWN0aXZlKVxuICAgIH0sXG4gICAgdmFsdWUgKHZhbHVlOiAoc3RyaW5nIHwgbnVtYmVyIHwgYW55KVtdKSB7XG4gICAgICB0aGlzLmhhbmRsZU5vZGVDYWNoZVdhdGNoZXIodmFsdWUsIHRoaXMuc2VsZWN0ZWRDYWNoZSwgdGhpcy51cGRhdGVTZWxlY3RlZCwgdGhpcy5lbWl0U2VsZWN0ZWQpXG4gICAgfSxcbiAgICBvcGVuICh2YWx1ZTogKHN0cmluZyB8IG51bWJlciB8IGFueSlbXSkge1xuICAgICAgdGhpcy5oYW5kbGVOb2RlQ2FjaGVXYXRjaGVyKHZhbHVlLCB0aGlzLm9wZW5DYWNoZSwgdGhpcy51cGRhdGVPcGVuLCB0aGlzLmVtaXRPcGVuKVxuICAgIH0sXG4gIH0sXG5cbiAgY3JlYXRlZCAoKSB7XG4gICAgY29uc3QgZ2V0VmFsdWUgPSAoa2V5OiBzdHJpbmcgfCBudW1iZXIpID0+IHRoaXMucmV0dXJuT2JqZWN0ID8gZ2V0T2JqZWN0VmFsdWVCeVBhdGgoa2V5LCB0aGlzLml0ZW1LZXkpIDoga2V5XG5cbiAgICB0aGlzLmJ1aWxkVHJlZSh0aGlzLml0ZW1zKVxuXG4gICAgZm9yIChjb25zdCB2YWx1ZSBvZiB0aGlzLnZhbHVlLm1hcChnZXRWYWx1ZSkpIHtcbiAgICAgIHRoaXMudXBkYXRlU2VsZWN0ZWQodmFsdWUsIHRydWUsIHRydWUpXG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBhY3RpdmUgb2YgdGhpcy5hY3RpdmUubWFwKGdldFZhbHVlKSkge1xuICAgICAgdGhpcy51cGRhdGVBY3RpdmUoYWN0aXZlLCB0cnVlKVxuICAgIH1cbiAgfSxcblxuICBtb3VudGVkICgpIHtcbiAgICBpZiAodGhpcy5vcGVuQWxsKSB7XG4gICAgICB0aGlzLnVwZGF0ZUFsbCh0cnVlKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wZW4uZm9yRWFjaChrZXkgPT4gdGhpcy51cGRhdGVPcGVuKHRoaXMucmV0dXJuT2JqZWN0ID8gZ2V0T2JqZWN0VmFsdWVCeVBhdGgoa2V5LCB0aGlzLml0ZW1LZXkpIDoga2V5LCB0cnVlKSlcbiAgICAgIHRoaXMuZW1pdE9wZW4oKVxuICAgIH1cbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgLyoqIEBwdWJsaWMgKi9cbiAgICB1cGRhdGVBbGwgKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLm5vZGVzKS5mb3JFYWNoKGtleSA9PiB0aGlzLnVwZGF0ZU9wZW4oZ2V0T2JqZWN0VmFsdWVCeVBhdGgodGhpcy5ub2Rlc1trZXldLml0ZW0sIHRoaXMuaXRlbUtleSksIHZhbHVlKSlcbiAgICAgIHRoaXMuZW1pdE9wZW4oKVxuICAgIH0sXG4gICAgZ2V0S2V5cyAoaXRlbXM6IGFueVtdLCBrZXlzOiBhbnlbXSA9IFtdKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGdldE9iamVjdFZhbHVlQnlQYXRoKGl0ZW1zW2ldLCB0aGlzLml0ZW1LZXkpXG4gICAgICAgIGtleXMucHVzaChrZXkpXG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gZ2V0T2JqZWN0VmFsdWVCeVBhdGgoaXRlbXNbaV0sIHRoaXMuaXRlbUNoaWxkcmVuKVxuICAgICAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgICBrZXlzLnB1c2goLi4udGhpcy5nZXRLZXlzKGNoaWxkcmVuKSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ga2V5c1xuICAgIH0sXG4gICAgYnVpbGRUcmVlIChpdGVtczogYW55W10sIHBhcmVudDogKHN0cmluZyB8IG51bWJlciB8IG51bGwpID0gbnVsbCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBpdGVtID0gaXRlbXNbaV1cbiAgICAgICAgY29uc3Qga2V5ID0gZ2V0T2JqZWN0VmFsdWVCeVBhdGgoaXRlbSwgdGhpcy5pdGVtS2V5KVxuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IGdldE9iamVjdFZhbHVlQnlQYXRoKGl0ZW0sIHRoaXMuaXRlbUNoaWxkcmVuKSA/PyBbXVxuICAgICAgICBjb25zdCBvbGROb2RlID0gdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eShrZXkpID8gdGhpcy5ub2Rlc1trZXldIDoge1xuICAgICAgICAgIGlzU2VsZWN0ZWQ6IGZhbHNlLCBpc0luZGV0ZXJtaW5hdGU6IGZhbHNlLCBpc0FjdGl2ZTogZmFsc2UsIGlzT3BlbjogZmFsc2UsIHZub2RlOiBudWxsLFxuICAgICAgICB9IGFzIE5vZGVTdGF0ZVxuXG4gICAgICAgIGNvbnN0IG5vZGU6IGFueSA9IHtcbiAgICAgICAgICB2bm9kZTogb2xkTm9kZS52bm9kZSxcbiAgICAgICAgICBwYXJlbnQsXG4gICAgICAgICAgY2hpbGRyZW46IGNoaWxkcmVuLm1hcCgoYzogYW55KSA9PiBnZXRPYmplY3RWYWx1ZUJ5UGF0aChjLCB0aGlzLml0ZW1LZXkpKSxcbiAgICAgICAgICBpdGVtLFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5idWlsZFRyZWUoY2hpbGRyZW4sIGtleSlcblxuICAgICAgICAvLyBUaGlzIGZpeGVkIGJ1ZyB3aXRoIGR5bmFtaWMgY2hpbGRyZW4gcmVzZXR0aW5nIHNlbGVjdGVkIHBhcmVudCBzdGF0ZVxuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25UeXBlICE9PSAnaW5kZXBlbmRlbnQnICYmXG4gICAgICAgICAgcGFyZW50ICE9PSBudWxsICYmXG4gICAgICAgICAgIXRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkoa2V5KSAmJlxuICAgICAgICAgIHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkocGFyZW50KVxuICAgICAgICApIHtcbiAgICAgICAgICBub2RlLmlzU2VsZWN0ZWQgPSB0aGlzLm5vZGVzW3BhcmVudF0uaXNTZWxlY3RlZFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5vZGUuaXNTZWxlY3RlZCA9IG9sZE5vZGUuaXNTZWxlY3RlZFxuICAgICAgICAgIG5vZGUuaXNJbmRldGVybWluYXRlID0gb2xkTm9kZS5pc0luZGV0ZXJtaW5hdGVcbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGUuaXNBY3RpdmUgPSBvbGROb2RlLmlzQWN0aXZlXG4gICAgICAgIG5vZGUuaXNPcGVuID0gb2xkTm9kZS5pc09wZW5cblxuICAgICAgICB0aGlzLm5vZGVzW2tleV0gPSBub2RlXG5cbiAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCAmJiB0aGlzLnNlbGVjdGlvblR5cGUgIT09ICdpbmRlcGVuZGVudCcpIHtcbiAgICAgICAgICBjb25zdCB7IGlzU2VsZWN0ZWQsIGlzSW5kZXRlcm1pbmF0ZSB9ID0gdGhpcy5jYWxjdWxhdGVTdGF0ZShrZXksIHRoaXMubm9kZXMpXG5cbiAgICAgICAgICBub2RlLmlzU2VsZWN0ZWQgPSBpc1NlbGVjdGVkXG4gICAgICAgICAgbm9kZS5pc0luZGV0ZXJtaW5hdGUgPSBpc0luZGV0ZXJtaW5hdGVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERvbid0IGZvcmdldCB0byByZWJ1aWxkIGNhY2hlXG4gICAgICAgIGlmICh0aGlzLm5vZGVzW2tleV0uaXNTZWxlY3RlZCAmJiAodGhpcy5zZWxlY3Rpb25UeXBlID09PSAnaW5kZXBlbmRlbnQnIHx8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoID09PSAwKSkgdGhpcy5zZWxlY3RlZENhY2hlLmFkZChrZXkpXG4gICAgICAgIGlmICh0aGlzLm5vZGVzW2tleV0uaXNBY3RpdmUpIHRoaXMuYWN0aXZlQ2FjaGUuYWRkKGtleSlcbiAgICAgICAgaWYgKHRoaXMubm9kZXNba2V5XS5pc09wZW4pIHRoaXMub3BlbkNhY2hlLmFkZChrZXkpXG5cbiAgICAgICAgdGhpcy51cGRhdGVWbm9kZVN0YXRlKGtleSlcbiAgICAgIH1cbiAgICB9LFxuICAgIGNhbGN1bGF0ZVN0YXRlIChub2RlOiBzdHJpbmcgfCBudW1iZXIsIHN0YXRlOiBSZWNvcmQ8c3RyaW5nIHwgbnVtYmVyLCBOb2RlU3RhdGU+KSB7XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IHN0YXRlW25vZGVdLmNoaWxkcmVuXG4gICAgICBjb25zdCBjb3VudHMgPSBjaGlsZHJlbi5yZWR1Y2UoKGNvdW50czogbnVtYmVyW10sIGNoaWxkOiBzdHJpbmcgfCBudW1iZXIpID0+IHtcbiAgICAgICAgY291bnRzWzBdICs9ICtCb29sZWFuKHN0YXRlW2NoaWxkXS5pc1NlbGVjdGVkKVxuICAgICAgICBjb3VudHNbMV0gKz0gK0Jvb2xlYW4oc3RhdGVbY2hpbGRdLmlzSW5kZXRlcm1pbmF0ZSlcblxuICAgICAgICByZXR1cm4gY291bnRzXG4gICAgICB9LCBbMCwgMF0pXG5cbiAgICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSAhIWNoaWxkcmVuLmxlbmd0aCAmJiBjb3VudHNbMF0gPT09IGNoaWxkcmVuLmxlbmd0aFxuICAgICAgY29uc3QgaXNJbmRldGVybWluYXRlID0gIWlzU2VsZWN0ZWQgJiYgKGNvdW50c1swXSA+IDAgfHwgY291bnRzWzFdID4gMClcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNTZWxlY3RlZCxcbiAgICAgICAgaXNJbmRldGVybWluYXRlLFxuICAgICAgfVxuICAgIH0sXG4gICAgZW1pdE9wZW4gKCkge1xuICAgICAgdGhpcy5lbWl0Tm9kZUNhY2hlKCd1cGRhdGU6b3BlbicsIHRoaXMub3BlbkNhY2hlKVxuICAgIH0sXG4gICAgZW1pdFNlbGVjdGVkICgpIHtcbiAgICAgIHRoaXMuZW1pdE5vZGVDYWNoZSgnaW5wdXQnLCB0aGlzLnNlbGVjdGVkQ2FjaGUpXG4gICAgfSxcbiAgICBlbWl0QWN0aXZlICgpIHtcbiAgICAgIHRoaXMuZW1pdE5vZGVDYWNoZSgndXBkYXRlOmFjdGl2ZScsIHRoaXMuYWN0aXZlQ2FjaGUpXG4gICAgfSxcbiAgICBlbWl0Tm9kZUNhY2hlIChldmVudDogc3RyaW5nLCBjYWNoZTogTm9kZUNhY2hlKSB7XG4gICAgICB0aGlzLiRlbWl0KGV2ZW50LCB0aGlzLnJldHVybk9iamVjdCA/IFsuLi5jYWNoZV0ubWFwKGtleSA9PiB0aGlzLm5vZGVzW2tleV0uaXRlbSkgOiBbLi4uY2FjaGVdKVxuICAgIH0sXG4gICAgaGFuZGxlTm9kZUNhY2hlV2F0Y2hlciAodmFsdWU6IGFueVtdLCBjYWNoZTogTm9kZUNhY2hlLCB1cGRhdGVGbjogRnVuY3Rpb24sIGVtaXRGbjogRnVuY3Rpb24pIHtcbiAgICAgIHZhbHVlID0gdGhpcy5yZXR1cm5PYmplY3QgPyB2YWx1ZS5tYXAodiA9PiBnZXRPYmplY3RWYWx1ZUJ5UGF0aCh2LCB0aGlzLml0ZW1LZXkpKSA6IHZhbHVlXG4gICAgICBjb25zdCBvbGQgPSBbLi4uY2FjaGVdXG4gICAgICBpZiAoZGVlcEVxdWFsKG9sZCwgdmFsdWUpKSByZXR1cm5cblxuICAgICAgb2xkLmZvckVhY2goa2V5ID0+IHVwZGF0ZUZuKGtleSwgZmFsc2UpKVxuICAgICAgdmFsdWUuZm9yRWFjaChrZXkgPT4gdXBkYXRlRm4oa2V5LCB0cnVlKSlcblxuICAgICAgZW1pdEZuKClcbiAgICB9LFxuICAgIGdldERlc2NlbmRhbnRzIChrZXk6IHN0cmluZyB8IG51bWJlciwgZGVzY2VuZGFudHM6IE5vZGVBcnJheSA9IFtdKSB7XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMubm9kZXNba2V5XS5jaGlsZHJlblxuXG4gICAgICBkZXNjZW5kYW50cy5wdXNoKC4uLmNoaWxkcmVuKVxuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRlc2NlbmRhbnRzID0gdGhpcy5nZXREZXNjZW5kYW50cyhjaGlsZHJlbltpXSwgZGVzY2VuZGFudHMpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkZXNjZW5kYW50c1xuICAgIH0sXG4gICAgZ2V0UGFyZW50cyAoa2V5OiBzdHJpbmcgfCBudW1iZXIpIHtcbiAgICAgIGxldCBwYXJlbnQgPSB0aGlzLm5vZGVzW2tleV0ucGFyZW50XG5cbiAgICAgIGNvbnN0IHBhcmVudHMgPSBbXVxuICAgICAgd2hpbGUgKHBhcmVudCAhPT0gbnVsbCkge1xuICAgICAgICBwYXJlbnRzLnB1c2gocGFyZW50KVxuICAgICAgICBwYXJlbnQgPSB0aGlzLm5vZGVzW3BhcmVudF0ucGFyZW50XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwYXJlbnRzXG4gICAgfSxcbiAgICByZWdpc3RlciAobm9kZTogVlRyZWV2aWV3Tm9kZUluc3RhbmNlKSB7XG4gICAgICBjb25zdCBrZXkgPSBnZXRPYmplY3RWYWx1ZUJ5UGF0aChub2RlLml0ZW0sIHRoaXMuaXRlbUtleSlcblxuICAgICAgdGhpcy5ub2Rlc1trZXldLnZub2RlID0gbm9kZVxuXG4gICAgICB0aGlzLnVwZGF0ZVZub2RlU3RhdGUoa2V5KVxuICAgIH0sXG4gICAgdW5yZWdpc3RlciAobm9kZTogVlRyZWV2aWV3Tm9kZUluc3RhbmNlKSB7XG4gICAgICBjb25zdCBrZXkgPSBnZXRPYmplY3RWYWx1ZUJ5UGF0aChub2RlLml0ZW0sIHRoaXMuaXRlbUtleSlcbiAgICAgIGlmICh0aGlzLm5vZGVzW2tleV0pIHRoaXMubm9kZXNba2V5XS52bm9kZSA9IG51bGxcbiAgICB9LFxuICAgIGlzUGFyZW50IChrZXk6IHN0cmluZyB8IG51bWJlcikge1xuICAgICAgcmV0dXJuIHRoaXMubm9kZXNba2V5XS5jaGlsZHJlbiAmJiB0aGlzLm5vZGVzW2tleV0uY2hpbGRyZW4ubGVuZ3RoXG4gICAgfSxcbiAgICB1cGRhdGVBY3RpdmUgKGtleTogc3RyaW5nIHwgbnVtYmVyLCBpc0FjdGl2ZTogYm9vbGVhbikge1xuICAgICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KGtleSkpIHJldHVyblxuXG4gICAgICBpZiAoIXRoaXMubXVsdGlwbGVBY3RpdmUpIHtcbiAgICAgICAgdGhpcy5hY3RpdmVDYWNoZS5mb3JFYWNoKGFjdGl2ZSA9PiB7XG4gICAgICAgICAgdGhpcy5ub2Rlc1thY3RpdmVdLmlzQWN0aXZlID0gZmFsc2VcbiAgICAgICAgICB0aGlzLnVwZGF0ZVZub2RlU3RhdGUoYWN0aXZlKVxuICAgICAgICAgIHRoaXMuYWN0aXZlQ2FjaGUuZGVsZXRlKGFjdGl2ZSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMubm9kZXNba2V5XVxuICAgICAgaWYgKCFub2RlKSByZXR1cm5cblxuICAgICAgaWYgKGlzQWN0aXZlKSB0aGlzLmFjdGl2ZUNhY2hlLmFkZChrZXkpXG4gICAgICBlbHNlIHRoaXMuYWN0aXZlQ2FjaGUuZGVsZXRlKGtleSlcblxuICAgICAgbm9kZS5pc0FjdGl2ZSA9IGlzQWN0aXZlXG5cbiAgICAgIHRoaXMudXBkYXRlVm5vZGVTdGF0ZShrZXkpXG4gICAgfSxcbiAgICB1cGRhdGVTZWxlY3RlZCAoa2V5OiBzdHJpbmcgfCBudW1iZXIsIGlzU2VsZWN0ZWQ6IGJvb2xlYW4sIGlzRm9yY2VkID0gZmFsc2UpIHtcbiAgICAgIGlmICghdGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSByZXR1cm5cblxuICAgICAgY29uc3QgY2hhbmdlZCA9IG5ldyBNYXAoKVxuXG4gICAgICBpZiAodGhpcy5zZWxlY3Rpb25UeXBlICE9PSAnaW5kZXBlbmRlbnQnKSB7XG4gICAgICAgIGZvciAoY29uc3QgZGVzY2VuZGFudCBvZiB0aGlzLmdldERlc2NlbmRhbnRzKGtleSkpIHtcbiAgICAgICAgICBpZiAoIWdldE9iamVjdFZhbHVlQnlQYXRoKHRoaXMubm9kZXNbZGVzY2VuZGFudF0uaXRlbSwgdGhpcy5pdGVtRGlzYWJsZWQpIHx8IGlzRm9yY2VkKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGVzW2Rlc2NlbmRhbnRdLmlzU2VsZWN0ZWQgPSBpc1NlbGVjdGVkXG4gICAgICAgICAgICB0aGlzLm5vZGVzW2Rlc2NlbmRhbnRdLmlzSW5kZXRlcm1pbmF0ZSA9IGZhbHNlXG4gICAgICAgICAgICBjaGFuZ2VkLnNldChkZXNjZW5kYW50LCBpc1NlbGVjdGVkKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNhbGN1bGF0ZWQgPSB0aGlzLmNhbGN1bGF0ZVN0YXRlKGtleSwgdGhpcy5ub2RlcylcbiAgICAgICAgdGhpcy5ub2Rlc1trZXldLmlzU2VsZWN0ZWQgPSBpc1NlbGVjdGVkXG4gICAgICAgIHRoaXMubm9kZXNba2V5XS5pc0luZGV0ZXJtaW5hdGUgPSBjYWxjdWxhdGVkLmlzSW5kZXRlcm1pbmF0ZVxuICAgICAgICBjaGFuZ2VkLnNldChrZXksIGlzU2VsZWN0ZWQpXG5cbiAgICAgICAgZm9yIChjb25zdCBwYXJlbnQgb2YgdGhpcy5nZXRQYXJlbnRzKGtleSkpIHtcbiAgICAgICAgICBjb25zdCBjYWxjdWxhdGVkID0gdGhpcy5jYWxjdWxhdGVTdGF0ZShwYXJlbnQsIHRoaXMubm9kZXMpXG4gICAgICAgICAgdGhpcy5ub2Rlc1twYXJlbnRdLmlzU2VsZWN0ZWQgPSBjYWxjdWxhdGVkLmlzU2VsZWN0ZWRcbiAgICAgICAgICB0aGlzLm5vZGVzW3BhcmVudF0uaXNJbmRldGVybWluYXRlID0gY2FsY3VsYXRlZC5pc0luZGV0ZXJtaW5hdGVcbiAgICAgICAgICBjaGFuZ2VkLnNldChwYXJlbnQsIGNhbGN1bGF0ZWQuaXNTZWxlY3RlZClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5ub2Rlc1trZXldLmlzU2VsZWN0ZWQgPSBpc1NlbGVjdGVkXG4gICAgICAgIHRoaXMubm9kZXNba2V5XS5pc0luZGV0ZXJtaW5hdGUgPSBmYWxzZVxuICAgICAgICBjaGFuZ2VkLnNldChrZXksIGlzU2VsZWN0ZWQpXG4gICAgICB9XG5cbiAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGNoYW5nZWQuZW50cmllcygpKSB7XG4gICAgICAgIHRoaXMudXBkYXRlVm5vZGVTdGF0ZShrZXkpXG5cbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uVHlwZSA9PT0gJ2xlYWYnICYmIHRoaXMuaXNQYXJlbnQoa2V5KSkgY29udGludWVcblxuICAgICAgICB2YWx1ZSA9PT0gdHJ1ZSA/IHRoaXMuc2VsZWN0ZWRDYWNoZS5hZGQoa2V5KSA6IHRoaXMuc2VsZWN0ZWRDYWNoZS5kZWxldGUoa2V5KVxuICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlT3BlbiAoa2V5OiBzdHJpbmcgfCBudW1iZXIsIGlzT3BlbjogYm9vbGVhbikge1xuICAgICAgaWYgKCF0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KGtleSkpIHJldHVyblxuXG4gICAgICBjb25zdCBub2RlID0gdGhpcy5ub2Rlc1trZXldXG4gICAgICBjb25zdCBjaGlsZHJlbiA9IGdldE9iamVjdFZhbHVlQnlQYXRoKG5vZGUuaXRlbSwgdGhpcy5pdGVtQ2hpbGRyZW4pXG5cbiAgICAgIGlmIChjaGlsZHJlbiAmJiAhY2hpbGRyZW4ubGVuZ3RoICYmIG5vZGUudm5vZGUgJiYgIW5vZGUudm5vZGUuaGFzTG9hZGVkKSB7XG4gICAgICAgIG5vZGUudm5vZGUuY2hlY2tDaGlsZHJlbigpLnRoZW4oKCkgPT4gdGhpcy51cGRhdGVPcGVuKGtleSwgaXNPcGVuKSlcbiAgICAgIH0gZWxzZSBpZiAoY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgIG5vZGUuaXNPcGVuID0gaXNPcGVuXG5cbiAgICAgICAgbm9kZS5pc09wZW4gPyB0aGlzLm9wZW5DYWNoZS5hZGQoa2V5KSA6IHRoaXMub3BlbkNhY2hlLmRlbGV0ZShrZXkpXG5cbiAgICAgICAgdGhpcy51cGRhdGVWbm9kZVN0YXRlKGtleSlcbiAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZVZub2RlU3RhdGUgKGtleTogc3RyaW5nIHwgbnVtYmVyKSB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5ub2Rlc1trZXldXG5cbiAgICAgIGlmIChub2RlICYmIG5vZGUudm5vZGUpIHtcbiAgICAgICAgbm9kZS52bm9kZS5pc1NlbGVjdGVkID0gbm9kZS5pc1NlbGVjdGVkXG4gICAgICAgIG5vZGUudm5vZGUuaXNJbmRldGVybWluYXRlID0gbm9kZS5pc0luZGV0ZXJtaW5hdGVcbiAgICAgICAgbm9kZS52bm9kZS5pc0FjdGl2ZSA9IG5vZGUuaXNBY3RpdmVcbiAgICAgICAgbm9kZS52bm9kZS5pc09wZW4gPSBub2RlLmlzT3BlblxuICAgICAgfVxuICAgIH0sXG4gICAgaXNFeGNsdWRlZCAoa2V5OiBzdHJpbmcgfCBudW1iZXIpIHtcbiAgICAgIHJldHVybiAhIXRoaXMuc2VhcmNoICYmIHRoaXMuZXhjbHVkZWRJdGVtcy5oYXMoa2V5KVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgY29uc3QgY2hpbGRyZW46IFZOb2RlQ2hpbGRyZW5BcnJheUNvbnRlbnRzID0gdGhpcy5pdGVtcy5sZW5ndGhcbiAgICAgID8gdGhpcy5pdGVtcy5maWx0ZXIoaXRlbSA9PiB7XG4gICAgICAgIHJldHVybiAhdGhpcy5pc0V4Y2x1ZGVkKGdldE9iamVjdFZhbHVlQnlQYXRoKGl0ZW0sIHRoaXMuaXRlbUtleSkpXG4gICAgICB9KS5tYXAoaXRlbSA9PiB7XG4gICAgICAgIGNvbnN0IGdlbkNoaWxkID0gVlRyZWV2aWV3Tm9kZS5tZXRob2RzLmdlbkNoaWxkLmJpbmQodGhpcylcblxuICAgICAgICByZXR1cm4gZ2VuQ2hpbGQoaXRlbSwgdGhpcy5kaXNhYmxlZCB8fCBnZXRPYmplY3RWYWx1ZUJ5UGF0aChpdGVtLCB0aGlzLml0ZW1EaXNhYmxlZCkpXG4gICAgICB9KVxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgIDogdGhpcy4kc2xvdHMuZGVmYXVsdCEgLy8gVE9ETzogcmVtb3ZlIHR5cGUgYW5ub3RhdGlvbiB3aXRoIFRTIDMuMlxuXG4gICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgIGNsYXNzOiBbJ3YtdHJlZXZpZXcnLCB7XG4gICAgICAgICd2LXRyZWV2aWV3LS1ob3ZlcmFibGUnOiB0aGlzLmhvdmVyYWJsZSxcbiAgICAgICAgJ3YtdHJlZXZpZXctLWRlbnNlJzogdGhpcy5kZW5zZSxcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXMsXG4gICAgICB9XSxcbiAgICB9LCBjaGlsZHJlbilcbiAgfSxcbn0pXG4iXX0=