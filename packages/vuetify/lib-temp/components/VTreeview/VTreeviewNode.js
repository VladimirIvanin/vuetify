import { h } from 'vue';
// Components
import { VExpandTransition } from '../transitions';
import { VIcon } from '../VIcon';
// Mixins
import { inject as RegistrableInject } from '../../mixins/registrable';
import Colorable from '../../mixins/colorable';
// Utils
import mixins from '../../util/mixins';
import { getObjectValueByPath, createRange } from '../../util/helpers';
const baseMixins = mixins(Colorable, RegistrableInject('treeview'));
export const VTreeviewNodeProps = {
    activatable: Boolean,
    activeClass: {
        type: String,
        default: 'v-treeview-node--active',
    },
    color: {
        type: String,
        default: 'primary',
    },
    disablePerNode: Boolean,
    expandIcon: {
        type: String,
        default: '$subgroup',
    },
    indeterminateIcon: {
        type: String,
        default: '$checkboxIndeterminate',
    },
    itemChildren: {
        type: String,
        default: 'children',
    },
    itemDisabled: {
        type: String,
        default: 'disabled',
    },
    itemKey: {
        type: String,
        default: 'id',
    },
    itemText: {
        type: String,
        default: 'name',
    },
    loadChildren: Function,
    loadingIcon: {
        type: String,
        default: '$loading',
    },
    offIcon: {
        type: String,
        default: '$checkboxOff',
    },
    onIcon: {
        type: String,
        default: '$checkboxOn',
    },
    openOnClick: Boolean,
    rounded: Boolean,
    selectable: Boolean,
    selectedColor: {
        type: String,
        default: 'accent',
    },
    shaped: Boolean,
    transition: Boolean,
    selectionType: {
        type: String,
        default: 'leaf',
        validator: (v) => ['leaf', 'independent'].includes(v),
    },
};
/* @vue/component */
const VTreeviewNode = baseMixins.extend({
    name: 'v-treeview-node',
    inject: {
        treeview: {
            default: null,
        },
    },
    props: {
        level: Number,
        item: {
            type: Object,
            default: () => null,
        },
        parentIsDisabled: Boolean,
        ...VTreeviewNodeProps,
    },
    data: () => ({
        hasLoaded: false,
        isActive: false,
        isIndeterminate: false,
        isLoading: false,
        isOpen: false,
        isSelected: false, // Node is selected (checkbox)
    }),
    computed: {
        disabled() {
            return (getObjectValueByPath(this.item, this.itemDisabled) ||
                (!this.disablePerNode && (this.parentIsDisabled && this.selectionType === 'leaf')));
        },
        key() {
            return getObjectValueByPath(this.item, this.itemKey);
        },
        children() {
            const children = getObjectValueByPath(this.item, this.itemChildren);
            return children && children.filter((child) => !this.treeview.isExcluded(getObjectValueByPath(child, this.itemKey)));
        },
        text() {
            return getObjectValueByPath(this.item, this.itemText);
        },
        scopedProps() {
            return {
                item: this.item,
                leaf: !this.children,
                selected: this.isSelected,
                indeterminate: this.isIndeterminate,
                active: this.isActive,
                open: this.isOpen,
            };
        },
        computedIcon() {
            if (this.isIndeterminate)
                return this.indeterminateIcon;
            else if (this.isSelected)
                return this.onIcon;
            else
                return this.offIcon;
        },
        hasChildren() {
            return !!this.children && (!!this.children.length || !!this.loadChildren);
        },
    },
    created() {
        this.treeview.register(this);
    },
    beforeUnmount() {
        this.treeview.unregister(this);
    },
    methods: {
        checkChildren() {
            return new Promise(resolve => {
                // TODO: Potential issue with always trying
                // to load children if response is empty?
                if (!this.children || this.children.length || !this.loadChildren || this.hasLoaded)
                    return resolve();
                this.isLoading = true;
                resolve(this.loadChildren(this.item));
            }).then(() => {
                this.isLoading = false;
                this.hasLoaded = true;
            });
        },
        open() {
            this.isOpen = !this.isOpen;
            this.treeview.updateOpen(this.key, this.isOpen);
            this.treeview.emitOpen();
        },
        genLabel() {
            const children = [];
            if (this.$slots.label)
                children.push(this.$slots.label(this.scopedProps));
            else
                children.push(this.text);
            return h('div', {
                slot: 'label',
                class: 'v-treeview-node__label',
            }, children);
        },
        genPrependSlot() {
            if (!this.$slots.prepend)
                return null;
            return h('div', {
                class: 'v-treeview-node__prepend',
            }, this.$slots.prepend(this.scopedProps));
        },
        genAppendSlot() {
            if (!this.$slots.append)
                return null;
            return h('div', {
                class: 'v-treeview-node__append',
            }, this.$slots.append(this.scopedProps));
        },
        genContent() {
            const children = [
                this.genPrependSlot(),
                this.genLabel(),
                this.genAppendSlot(),
            ];
            return h('div', {
                class: 'v-treeview-node__content',
            }, children);
        },
        genToggle() {
            return h(VIcon, {
                class: ['v-treeview-node__toggle', {
                        'v-treeview-node__toggle--open': this.isOpen,
                        'v-treeview-node__toggle--loading': this.isLoading,
                    }],
                slot: 'prepend',
                onClick: (e) => {
                    e.stopPropagation();
                    if (this.isLoading)
                        return;
                    this.checkChildren().then(() => this.open());
                }
            }, () => [this.isLoading ? this.loadingIcon : this.expandIcon]);
        },
        genCheckbox() {
            return h(VIcon, {
                class: 'v-treeview-node__checkbox',
                color: this.isSelected || this.isIndeterminate ? this.selectedColor : undefined,
                disabled: this.disabled,
                onClick: (e) => {
                    e.stopPropagation();
                    if (this.isLoading)
                        return;
                    this.checkChildren().then(() => {
                        // We nextTick here so that items watch in VTreeview has a chance to run first
                        this.$nextTick(() => {
                            this.isSelected = !this.isSelected;
                            this.isIndeterminate = false;
                            this.treeview.updateSelected(this.key, this.isSelected);
                            this.treeview.emitSelected();
                        });
                    });
                },
            }, () => [this.computedIcon]);
        },
        genLevel(level) {
            return createRange(level).map(() => h('div', {
                class: 'v-treeview-node__level',
            }));
        },
        genNode() {
            const children = [this.genContent()];
            if (this.selectable)
                children.unshift(this.genCheckbox());
            if (this.hasChildren) {
                children.unshift(this.genToggle());
            }
            else {
                children.unshift(...this.genLevel(1));
            }
            children.unshift(...this.genLevel(this.level));
            return h('div', this.setTextColor(this.isActive && this.color, {
                class: ['v-treeview-node__root', {
                        [this.activeClass]: this.isActive,
                    }],
                onClick: () => {
                    if (this.openOnClick && this.hasChildren) {
                        this.checkChildren().then(this.open);
                    }
                    else if (this.activatable && !this.disabled) {
                        this.isActive = !this.isActive;
                        this.treeview.updateActive(this.key, this.isActive);
                        this.treeview.emitActive();
                    }
                }
            }), children);
        },
        genChild(item, parentIsDisabled) {
            return h(VTreeviewNode, {
                key: getObjectValueByPath(item, this.itemKey),
                activatable: this.activatable,
                activeClass: this.activeClass,
                item,
                selectable: this.selectable,
                selectedColor: this.selectedColor,
                color: this.color,
                disablePerNode: this.disablePerNode,
                expandIcon: this.expandIcon,
                indeterminateIcon: this.indeterminateIcon,
                offIcon: this.offIcon,
                onIcon: this.onIcon,
                loadingIcon: this.loadingIcon,
                itemKey: this.itemKey,
                itemText: this.itemText,
                itemDisabled: this.itemDisabled,
                itemChildren: this.itemChildren,
                loadChildren: this.loadChildren,
                transition: this.transition,
                openOnClick: this.openOnClick,
                rounded: this.rounded,
                shaped: this.shaped,
                level: this.level + 1,
                selectionType: this.selectionType,
                parentIsDisabled,
            }, this.$slots);
        },
        genChildrenWrapper() {
            if (!this.isOpen || !this.children)
                return null;
            const children = [this.children.map(c => this.genChild(c, this.disabled))];
            return h('div', {
                class: 'v-treeview-node__children',
            }, children);
        },
        genTransition() {
            return h(VExpandTransition, {}, () => [this.genChildrenWrapper()]);
        },
    },
    render() {
        const children = [this.genNode()];
        if (this.transition)
            children.push(this.genTransition());
        else
            children.push(this.genChildrenWrapper());
        return h('div', {
            class: ['v-treeview-node', {
                    'v-treeview-node--leaf': !this.hasChildren,
                    'v-treeview-node--click': this.openOnClick,
                    'v-treeview-node--disabled': this.disabled,
                    'v-treeview-node--rounded': this.rounded,
                    'v-treeview-node--shaped': this.shaped,
                    'v-treeview-node--selected': this.isSelected,
                }],
            'aria-expanded': String(this.isOpen),
        }, children);
    },
});
export default VTreeviewNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRyZWV2aWV3Tm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZUcmVldmlldy9WVHJlZXZpZXdOb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxDQUFDLEVBQUMsTUFBTSxLQUFLLENBQUE7QUFDckIsYUFBYTtBQUNiLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBQ2xELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxVQUFVLENBQUE7QUFHaEMsU0FBUztBQUNULE9BQU8sRUFBRSxNQUFNLElBQUksaUJBQWlCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQTtBQUN0RSxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxRQUFRO0FBQ1IsT0FBTyxNQUFzQixNQUFNLG1CQUFtQixDQUFBO0FBQ3RELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxXQUFXLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQVF0RSxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQ3ZCLFNBQVMsRUFDVCxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FDOUIsQ0FBQTtBQU1ELE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHO0lBQ2hDLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLFdBQVcsRUFBRTtRQUNYLElBQUksRUFBRSxNQUFNO1FBQ1osT0FBTyxFQUFFLHlCQUF5QjtLQUNuQztJQUNELEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxNQUFNO1FBQ1osT0FBTyxFQUFFLFNBQVM7S0FDbkI7SUFDRCxjQUFjLEVBQUUsT0FBTztJQUN2QixVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxXQUFXO0tBQ3JCO0lBQ0QsaUJBQWlCLEVBQUU7UUFDakIsSUFBSSxFQUFFLE1BQU07UUFDWixPQUFPLEVBQUUsd0JBQXdCO0tBQ2xDO0lBQ0QsWUFBWSxFQUFFO1FBQ1osSUFB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QUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUE7O1lBQ25ELFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQTtRQUU3QyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDZCxLQUFLLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRTtvQkFDekIsdUJBQXVCLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVztvQkFDMUMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLFdBQVc7b0JBQzFDLDJCQUEyQixFQUFFLElBQUksQ0FBQyxRQUFRO29CQUMxQywwQkFBMEIsRUFBRSxJQUFJLENBQUMsT0FBTztvQkFDeEMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLE1BQU07b0JBQ3RDLDJCQUEyQixFQUFFLElBQUksQ0FBQyxVQUFVO2lCQUM3QyxDQUFDO1lBQ0YsZUFBZSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQ3JDLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDZCxDQUFDO0NBQ0YsQ0FBQyxDQUFBO0FBRUYsZUFBZSxhQUFhLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2h9IGZyb20gJ3Z1ZSdcbi8vIENvbXBvbmVudHNcbmltcG9ydCB7IFZFeHBhbmRUcmFuc2l0aW9uIH0gZnJvbSAnLi4vdHJhbnNpdGlvbnMnXG5pbXBvcnQgeyBWSWNvbiB9IGZyb20gJy4uL1ZJY29uJ1xuaW1wb3J0IFZUcmVldmlldyBmcm9tICcuL1ZUcmVldmlldydcblxuLy8gTWl4aW5zXG5pbXBvcnQgeyBpbmplY3QgYXMgUmVnaXN0cmFibGVJbmplY3QgfSBmcm9tICcuLi8uLi9taXhpbnMvcmVnaXN0cmFibGUnXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXG5cbi8vIFV0aWxzXG5pbXBvcnQgbWl4aW5zLCB7IEV4dHJhY3RWdWUgfSBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IGdldE9iamVjdFZhbHVlQnlQYXRoLCBjcmVhdGVSYW5nZSB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcblxuLy8gVHlwZXNcbmltcG9ydCB7IFZOb2RlLCBWTm9kZUNoaWxkcmVuLCBQcm9wVHlwZSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7IFByb3BWYWxpZGF0b3IgfSBmcm9tICd2dWUvdHlwZXMvb3B0aW9ucydcblxudHlwZSBWVHJlZVZpZXdJbnN0YW5jZSA9IEluc3RhbmNlVHlwZTx0eXBlb2YgVlRyZWV2aWV3PlxuXG5jb25zdCBiYXNlTWl4aW5zID0gbWl4aW5zKFxuICBDb2xvcmFibGUsXG4gIFJlZ2lzdHJhYmxlSW5qZWN0KCd0cmVldmlldycpXG4pXG5cbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgRXh0cmFjdFZ1ZTx0eXBlb2YgYmFzZU1peGlucz4ge1xuICB0cmVldmlldzogVlRyZWVWaWV3SW5zdGFuY2Vcbn1cblxuZXhwb3J0IGNvbnN0IFZUcmVldmlld05vZGVQcm9wcyA9IHtcbiAgYWN0aXZhdGFibGU6IEJvb2xlYW4sXG4gIGFjdGl2ZUNsYXNzOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlZmF1bHQ6ICd2LXRyZWV2aWV3LW5vZGUtLWFjdGl2ZScsXG4gIH0sXG4gIGNvbG9yOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlZmF1bHQ6ICdwcmltYXJ5JyxcbiAgfSxcbiAgZGlzYWJsZVBlck5vZGU6IEJvb2xlYW4sXG4gIGV4cGFuZEljb246IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVmYXVsdDogJyRzdWJncm91cCcsXG4gIH0sXG4gIGluZGV0ZXJtaW5hdGVJY29uOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlZmF1bHQ6ICckY2hlY2tib3hJbmRldGVybWluYXRlJyxcbiAgfSxcbiAgaXRlbUNoaWxkcmVuOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlZmF1bHQ6ICdjaGlsZHJlbicsXG4gIH0sXG4gIGl0ZW1EaXNhYmxlZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBkZWZhdWx0OiAnZGlzYWJsZWQnLFxuICB9LFxuICBpdGVtS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlZmF1bHQ6ICdpZCcsXG4gIH0sXG4gIGl0ZW1UZXh0OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlZmF1bHQ6ICduYW1lJyxcbiAgfSxcbiAgbG9hZENoaWxkcmVuOiBGdW5jdGlvbiBhcyBQcm9wVHlwZTwoaXRlbTogYW55KSA9PiBQcm9taXNlPHZvaWQ+PixcbiAgbG9hZGluZ0ljb246IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVmYXVsdDogJyRsb2FkaW5nJyxcbiAgfSxcbiAgb2ZmSWNvbjoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBkZWZhdWx0OiAnJGNoZWNrYm94T2ZmJyxcbiAgfSxcbiAgb25JY29uOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlZmF1bHQ6ICckY2hlY2tib3hPbicsXG4gIH0sXG4gIG9wZW5PbkNsaWNrOiBCb29sZWFuLFxuICByb3VuZGVkOiBCb29sZWFuLFxuICBzZWxlY3RhYmxlOiBCb29sZWFuLFxuICBzZWxlY3RlZENvbG9yOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlZmF1bHQ6ICdhY2NlbnQnLFxuICB9LFxuICBzaGFwZWQ6IEJvb2xlYW4sXG4gIHRyYW5zaXRpb246IEJvb2xlYW4sXG4gIHNlbGVjdGlvblR5cGU6IHtcbiAgICB0eXBlOiBTdHJpbmcgYXMgUHJvcFR5cGU8J2xlYWYnIHwgJ2luZGVwZW5kZW50Jz4sXG4gICAgZGVmYXVsdDogJ2xlYWYnLFxuICAgIHZhbGlkYXRvcjogKHY6IHN0cmluZykgPT4gWydsZWFmJywgJ2luZGVwZW5kZW50J10uaW5jbHVkZXModiksXG4gIH0sXG59XG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5jb25zdCBWVHJlZXZpZXdOb2RlID0gYmFzZU1peGlucy5leHRlbmQoe1xuICBuYW1lOiAndi10cmVldmlldy1ub2RlJyxcblxuICBpbmplY3Q6IHtcbiAgICB0cmVldmlldzoge1xuICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICB9LFxuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgbGV2ZWw6IE51bWJlcixcbiAgICBpdGVtOiB7XG4gICAgICB0eXBlOiBPYmplY3QsXG4gICAgICBkZWZhdWx0OiAoKSA9PiBudWxsLFxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGw+LFxuICAgIHBhcmVudElzRGlzYWJsZWQ6IEJvb2xlYW4sXG4gICAgLi4uVlRyZWV2aWV3Tm9kZVByb3BzLFxuICB9LFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgaGFzTG9hZGVkOiBmYWxzZSxcbiAgICBpc0FjdGl2ZTogZmFsc2UsIC8vIE5vZGUgaXMgc2VsZWN0ZWQgKHJvdylcbiAgICBpc0luZGV0ZXJtaW5hdGU6IGZhbHNlLCAvLyBOb2RlIGhhcyBhdCBsZWFzdCBvbmUgc2VsZWN0ZWQgY2hpbGRcbiAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgIGlzT3BlbjogZmFsc2UsIC8vIE5vZGUgaXMgb3Blbi9leHBhbmRlZFxuICAgIGlzU2VsZWN0ZWQ6IGZhbHNlLCAvLyBOb2RlIGlzIHNlbGVjdGVkIChjaGVja2JveClcbiAgfSksXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBkaXNhYmxlZCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBnZXRPYmplY3RWYWx1ZUJ5UGF0aCh0aGlzLml0ZW0sIHRoaXMuaXRlbURpc2FibGVkKSB8fFxuICAgICAgICAoIXRoaXMuZGlzYWJsZVBlck5vZGUgJiYgKHRoaXMucGFyZW50SXNEaXNhYmxlZCAmJiB0aGlzLnNlbGVjdGlvblR5cGUgPT09ICdsZWFmJykpXG4gICAgICApXG4gICAgfSxcbiAgICBrZXkgKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gZ2V0T2JqZWN0VmFsdWVCeVBhdGgodGhpcy5pdGVtLCB0aGlzLml0ZW1LZXkpXG4gICAgfSxcbiAgICBjaGlsZHJlbiAoKTogYW55W10gfCBudWxsIHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gZ2V0T2JqZWN0VmFsdWVCeVBhdGgodGhpcy5pdGVtLCB0aGlzLml0ZW1DaGlsZHJlbilcbiAgICAgIHJldHVybiBjaGlsZHJlbiAmJiBjaGlsZHJlbi5maWx0ZXIoKGNoaWxkOiBhbnkpID0+ICF0aGlzLnRyZWV2aWV3LmlzRXhjbHVkZWQoZ2V0T2JqZWN0VmFsdWVCeVBhdGgoY2hpbGQsIHRoaXMuaXRlbUtleSkpKVxuICAgIH0sXG4gICAgdGV4dCAoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiBnZXRPYmplY3RWYWx1ZUJ5UGF0aCh0aGlzLml0ZW0sIHRoaXMuaXRlbVRleHQpXG4gICAgfSxcbiAgICBzY29wZWRQcm9wcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGl0ZW06IHRoaXMuaXRlbSxcbiAgICAgICAgbGVhZjogIXRoaXMuY2hpbGRyZW4sXG4gICAgICAgIHNlbGVjdGVkOiB0aGlzLmlzU2VsZWN0ZWQsXG4gICAgICAgIGluZGV0ZXJtaW5hdGU6IHRoaXMuaXNJbmRldGVybWluYXRlLFxuICAgICAgICBhY3RpdmU6IHRoaXMuaXNBY3RpdmUsXG4gICAgICAgIG9wZW46IHRoaXMuaXNPcGVuLFxuICAgICAgfVxuICAgIH0sXG4gICAgY29tcHV0ZWRJY29uICgpOiBzdHJpbmcge1xuICAgICAgaWYgKHRoaXMuaXNJbmRldGVybWluYXRlKSByZXR1cm4gdGhpcy5pbmRldGVybWluYXRlSWNvblxuICAgICAgZWxzZSBpZiAodGhpcy5pc1NlbGVjdGVkKSByZXR1cm4gdGhpcy5vbkljb25cbiAgICAgIGVsc2UgcmV0dXJuIHRoaXMub2ZmSWNvblxuICAgIH0sXG4gICAgaGFzQ2hpbGRyZW4gKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuICEhdGhpcy5jaGlsZHJlbiAmJiAoISF0aGlzLmNoaWxkcmVuLmxlbmd0aCB8fCAhIXRoaXMubG9hZENoaWxkcmVuKVxuICAgIH0sXG4gIH0sXG5cbiAgY3JlYXRlZCAoKSB7XG4gICAgdGhpcy50cmVldmlldy5yZWdpc3Rlcih0aGlzKVxuICB9LFxuXG4gIGJlZm9yZVVubW91bnQgKCkge1xuICAgIHRoaXMudHJlZXZpZXcudW5yZWdpc3Rlcih0aGlzKVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBjaGVja0NoaWxkcmVuICgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPihyZXNvbHZlID0+IHtcbiAgICAgICAgLy8gVE9ETzogUG90ZW50aWFsIGlzc3VlIHdpdGggYWx3YXlzIHRyeWluZ1xuICAgICAgICAvLyB0byBsb2FkIGNoaWxkcmVuIGlmIHJlc3BvbnNlIGlzIGVtcHR5P1xuICAgICAgICBpZiAoIXRoaXMuY2hpbGRyZW4gfHwgdGhpcy5jaGlsZHJlbi5sZW5ndGggfHwgIXRoaXMubG9hZENoaWxkcmVuIHx8IHRoaXMuaGFzTG9hZGVkKSByZXR1cm4gcmVzb2x2ZSgpXG5cbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlXG4gICAgICAgIHJlc29sdmUodGhpcy5sb2FkQ2hpbGRyZW4odGhpcy5pdGVtKSlcbiAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlXG4gICAgICAgIHRoaXMuaGFzTG9hZGVkID0gdHJ1ZVxuICAgICAgfSlcbiAgICB9LFxuICAgIG9wZW4gKCkge1xuICAgICAgdGhpcy5pc09wZW4gPSAhdGhpcy5pc09wZW5cbiAgICAgIHRoaXMudHJlZXZpZXcudXBkYXRlT3Blbih0aGlzLmtleSwgdGhpcy5pc09wZW4pXG4gICAgICB0aGlzLnRyZWV2aWV3LmVtaXRPcGVuKClcbiAgICB9LFxuICAgIGdlbkxhYmVsICgpIHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gW11cblxuICAgICAgaWYgKHRoaXMuJHNsb3RzLmxhYmVsKSBjaGlsZHJlbi5wdXNoKHRoaXMuJHNsb3RzLmxhYmVsKHRoaXMuc2NvcGVkUHJvcHMpKVxuICAgICAgZWxzZSBjaGlsZHJlbi5wdXNoKHRoaXMudGV4dClcblxuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgc2xvdDogJ2xhYmVsJyxcbiAgICAgICAgY2xhc3M6ICd2LXRyZWV2aWV3LW5vZGVfX2xhYmVsJyxcbiAgICAgIH0sIGNoaWxkcmVuKVxuICAgIH0sXG4gICAgZ2VuUHJlcGVuZFNsb3QgKCkge1xuICAgICAgaWYgKCF0aGlzLiRzbG90cy5wcmVwZW5kKSByZXR1cm4gbnVsbFxuXG4gICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogJ3YtdHJlZXZpZXctbm9kZV9fcHJlcGVuZCcsXG4gICAgICB9LCB0aGlzLiRzbG90cy5wcmVwZW5kKHRoaXMuc2NvcGVkUHJvcHMpKVxuICAgIH0sXG4gICAgZ2VuQXBwZW5kU2xvdCAoKSB7XG4gICAgICBpZiAoIXRoaXMuJHNsb3RzLmFwcGVuZCkgcmV0dXJuIG51bGxcblxuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6ICd2LXRyZWV2aWV3LW5vZGVfX2FwcGVuZCcsXG4gICAgICB9LCB0aGlzLiRzbG90cy5hcHBlbmQodGhpcy5zY29wZWRQcm9wcykpXG4gICAgfSxcbiAgICBnZW5Db250ZW50ICgpIHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gW1xuICAgICAgICB0aGlzLmdlblByZXBlbmRTbG90KCksXG4gICAgICAgIHRoaXMuZ2VuTGFiZWwoKSxcbiAgICAgICAgdGhpcy5nZW5BcHBlbmRTbG90KCksXG4gICAgICBdXG5cbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiAndi10cmVldmlldy1ub2RlX19jb250ZW50JyxcbiAgICAgIH0sIGNoaWxkcmVuKVxuICAgIH0sXG4gICAgZ2VuVG9nZ2xlICgpIHtcbiAgICAgIHJldHVybiBoKFZJY29uLCB7XG4gICAgICAgIGNsYXNzOiBbJ3YtdHJlZXZpZXctbm9kZV9fdG9nZ2xlJywge1xuICAgICAgICAgICd2LXRyZWV2aWV3LW5vZGVfX3RvZ2dsZS0tb3Blbic6IHRoaXMuaXNPcGVuLFxuICAgICAgICAgICd2LXRyZWV2aWV3LW5vZGVfX3RvZ2dsZS0tbG9hZGluZyc6IHRoaXMuaXNMb2FkaW5nLFxuICAgICAgICB9XSxcbiAgICAgICAgc2xvdDogJ3ByZXBlbmQnLFxuICAgICAgICBvbkNsaWNrOiAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgICAgICAgIGlmICh0aGlzLmlzTG9hZGluZykgcmV0dXJuXG5cbiAgICAgICAgICB0aGlzLmNoZWNrQ2hpbGRyZW4oKS50aGVuKCgpID0+IHRoaXMub3BlbigpKVxuICAgICAgICB9XG4gICAgICB9LCAoKSA9PiBbdGhpcy5pc0xvYWRpbmcgPyB0aGlzLmxvYWRpbmdJY29uIDogdGhpcy5leHBhbmRJY29uXSlcbiAgICB9LFxuICAgIGdlbkNoZWNrYm94ICgpIHtcbiAgICAgIHJldHVybiBoKFZJY29uLCB7XG4gICAgICAgIGNsYXNzOiAndi10cmVldmlldy1ub2RlX19jaGVja2JveCcsXG4gICAgICAgIGNvbG9yOiB0aGlzLmlzU2VsZWN0ZWQgfHwgdGhpcy5pc0luZGV0ZXJtaW5hdGUgPyB0aGlzLnNlbGVjdGVkQ29sb3IgOiB1bmRlZmluZWQsXG4gICAgICAgIGRpc2FibGVkOiB0aGlzLmRpc2FibGVkLFxuICAgICAgICBvbkNsaWNrOiAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgICAgICAgIGlmICh0aGlzLmlzTG9hZGluZykgcmV0dXJuXG5cbiAgICAgICAgICB0aGlzLmNoZWNrQ2hpbGRyZW4oKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIFdlIG5leHRUaWNrIGhlcmUgc28gdGhhdCBpdGVtcyB3YXRjaCBpbiBWVHJlZXZpZXcgaGFzIGEgY2hhbmNlIHRvIHJ1biBmaXJzdFxuICAgICAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmlzU2VsZWN0ZWQgPSAhdGhpcy5pc1NlbGVjdGVkXG4gICAgICAgICAgICAgIHRoaXMuaXNJbmRldGVybWluYXRlID0gZmFsc2VcblxuICAgICAgICAgICAgICB0aGlzLnRyZWV2aWV3LnVwZGF0ZVNlbGVjdGVkKHRoaXMua2V5LCB0aGlzLmlzU2VsZWN0ZWQpXG4gICAgICAgICAgICAgIHRoaXMudHJlZXZpZXcuZW1pdFNlbGVjdGVkKClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgIH0sICgpID0+IFt0aGlzLmNvbXB1dGVkSWNvbl0pXG4gICAgfSxcbiAgICBnZW5MZXZlbCAobGV2ZWw6IG51bWJlcikge1xuICAgICAgcmV0dXJuIGNyZWF0ZVJhbmdlKGxldmVsKS5tYXAoKCkgPT4gaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogJ3YtdHJlZXZpZXctbm9kZV9fbGV2ZWwnLFxuICAgICAgfSkpXG4gICAgfSxcbiAgICBnZW5Ob2RlICgpIHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gW3RoaXMuZ2VuQ29udGVudCgpXVxuXG4gICAgICBpZiAodGhpcy5zZWxlY3RhYmxlKSBjaGlsZHJlbi51bnNoaWZ0KHRoaXMuZ2VuQ2hlY2tib3goKSlcblxuICAgICAgaWYgKHRoaXMuaGFzQ2hpbGRyZW4pIHtcbiAgICAgICAgY2hpbGRyZW4udW5zaGlmdCh0aGlzLmdlblRvZ2dsZSgpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hpbGRyZW4udW5zaGlmdCguLi50aGlzLmdlbkxldmVsKDEpKVxuICAgICAgfVxuXG4gICAgICBjaGlsZHJlbi51bnNoaWZ0KC4uLnRoaXMuZ2VuTGV2ZWwodGhpcy5sZXZlbCkpXG5cbiAgICAgIHJldHVybiBoKCdkaXYnLCB0aGlzLnNldFRleHRDb2xvcih0aGlzLmlzQWN0aXZlICYmIHRoaXMuY29sb3IsIHtcbiAgICAgICAgY2xhc3M6IFsndi10cmVldmlldy1ub2RlX19yb290Jywge1xuICAgICAgICAgIFt0aGlzLmFjdGl2ZUNsYXNzXTogdGhpcy5pc0FjdGl2ZSxcbiAgICAgICAgfV0sXG4gICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5vcGVuT25DbGljayAmJiB0aGlzLmhhc0NoaWxkcmVuKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrQ2hpbGRyZW4oKS50aGVuKHRoaXMub3BlbilcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYWN0aXZhdGFibGUgJiYgIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuaXNBY3RpdmUgPSAhdGhpcy5pc0FjdGl2ZVxuICAgICAgICAgICAgdGhpcy50cmVldmlldy51cGRhdGVBY3RpdmUodGhpcy5rZXksIHRoaXMuaXNBY3RpdmUpXG4gICAgICAgICAgICB0aGlzLnRyZWV2aWV3LmVtaXRBY3RpdmUoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSksIGNoaWxkcmVuKVxuICAgIH0sXG4gICAgZ2VuQ2hpbGQgKGl0ZW06IGFueSwgcGFyZW50SXNEaXNhYmxlZDogYm9vbGVhbikge1xuICAgICAgcmV0dXJuIGgoVlRyZWV2aWV3Tm9kZSwge1xuICAgICAgICBrZXk6IGdldE9iamVjdFZhbHVlQnlQYXRoKGl0ZW0sIHRoaXMuaXRlbUtleSksXG4gICAgICAgIGFjdGl2YXRhYmxlOiB0aGlzLmFjdGl2YXRhYmxlLFxuICAgICAgICBhY3RpdmVDbGFzczogdGhpcy5hY3RpdmVDbGFzcyxcbiAgICAgICAgaXRlbSxcbiAgICAgICAgc2VsZWN0YWJsZTogdGhpcy5zZWxlY3RhYmxlLFxuICAgICAgICBzZWxlY3RlZENvbG9yOiB0aGlzLnNlbGVjdGVkQ29sb3IsXG4gICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLFxuICAgICAgICBkaXNhYmxlUGVyTm9kZTogdGhpcy5kaXNhYmxlUGVyTm9kZSxcbiAgICAgICAgZXhwYW5kSWNvbjogdGhpcy5leHBhbmRJY29uLFxuICAgICAgICBpbmRldGVybWluYXRlSWNvbjogdGhpcy5pbmRldGVybWluYXRlSWNvbixcbiAgICAgICAgb2ZmSWNvbjogdGhpcy5vZmZJY29uLFxuICAgICAgICBvbkljb246IHRoaXMub25JY29uLFxuICAgICAgICBsb2FkaW5nSWNvbjogdGhpcy5sb2FkaW5nSWNvbixcbiAgICAgICAgaXRlbUtleTogdGhpcy5pdGVtS2V5LFxuICAgICAgICBpdGVtVGV4dDogdGhpcy5pdGVtVGV4dCxcbiAgICAgICAgaXRlbURpc2FibGVkOiB0aGlzLml0ZW1EaXNhYmxlZCxcbiAgICAgICAgaXRlbUNoaWxkcmVuOiB0aGlzLml0ZW1DaGlsZHJlbixcbiAgICAgICAgbG9hZENoaWxkcmVuOiB0aGlzLmxvYWRDaGlsZHJlbixcbiAgICAgICAgdHJhbnNpdGlvbjogdGhpcy50cmFuc2l0aW9uLFxuICAgICAgICBvcGVuT25DbGljazogdGhpcy5vcGVuT25DbGljayxcbiAgICAgICAgcm91bmRlZDogdGhpcy5yb3VuZGVkLFxuICAgICAgICBzaGFwZWQ6IHRoaXMuc2hhcGVkLFxuICAgICAgICBsZXZlbDogdGhpcy5sZXZlbCArIDEsXG4gICAgICAgIHNlbGVjdGlvblR5cGU6IHRoaXMuc2VsZWN0aW9uVHlwZSxcbiAgICAgICAgcGFyZW50SXNEaXNhYmxlZCxcbiAgICAgIH0sIHRoaXMuJHNsb3RzKVxuICAgIH0sXG4gICAgZ2VuQ2hpbGRyZW5XcmFwcGVyICgpIHtcbiAgICAgIGlmICghdGhpcy5pc09wZW4gfHwgIXRoaXMuY2hpbGRyZW4pIHJldHVybiBudWxsXG5cbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gW3RoaXMuY2hpbGRyZW4ubWFwKGMgPT4gdGhpcy5nZW5DaGlsZChjLCB0aGlzLmRpc2FibGVkKSldXG5cbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiAndi10cmVldmlldy1ub2RlX19jaGlsZHJlbicsXG4gICAgICB9LCBjaGlsZHJlbilcbiAgICB9LFxuICAgIGdlblRyYW5zaXRpb24gKCkge1xuICAgICAgcmV0dXJuIGgoVkV4cGFuZFRyYW5zaXRpb24sIHt9LCAoKSA9PiBbdGhpcy5nZW5DaGlsZHJlbldyYXBwZXIoKV0pXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKCk6IFZOb2RlIHtcbiAgICBjb25zdCBjaGlsZHJlbjogVk5vZGVDaGlsZHJlbiA9IFt0aGlzLmdlbk5vZGUoKV1cblxuICAgIGlmICh0aGlzLnRyYW5zaXRpb24pIGNoaWxkcmVuLnB1c2godGhpcy5nZW5UcmFuc2l0aW9uKCkpXG4gICAgZWxzZSBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuQ2hpbGRyZW5XcmFwcGVyKCkpXG5cbiAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgY2xhc3M6IFsndi10cmVldmlldy1ub2RlJywge1xuICAgICAgICAndi10cmVldmlldy1ub2RlLS1sZWFmJzogIXRoaXMuaGFzQ2hpbGRyZW4sXG4gICAgICAgICd2LXRyZWV2aWV3LW5vZGUtLWNsaWNrJzogdGhpcy5vcGVuT25DbGljayxcbiAgICAgICAgJ3YtdHJlZXZpZXctbm9kZS0tZGlzYWJsZWQnOiB0aGlzLmRpc2FibGVkLFxuICAgICAgICAndi10cmVldmlldy1ub2RlLS1yb3VuZGVkJzogdGhpcy5yb3VuZGVkLFxuICAgICAgICAndi10cmVldmlldy1ub2RlLS1zaGFwZWQnOiB0aGlzLnNoYXBlZCxcbiAgICAgICAgJ3YtdHJlZXZpZXctbm9kZS0tc2VsZWN0ZWQnOiB0aGlzLmlzU2VsZWN0ZWQsXG4gICAgICB9XSxcbiAgICAgICdhcmlhLWV4cGFuZGVkJzogU3RyaW5nKHRoaXMuaXNPcGVuKSxcbiAgICB9LCBjaGlsZHJlbilcbiAgfSxcbn0pXG5cbmV4cG9ydCBkZWZhdWx0IFZUcmVldmlld05vZGVcbiJdfQ==