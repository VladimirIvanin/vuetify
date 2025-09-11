import { Transition, h } from 'vue';
// Styles
import './VSkeletonLoader.sass';
// Mixins
import Elevatable from '../../mixins/elevatable';
import Measurable from '../../mixins/measurable';
import Themeable from '../../mixins/themeable';
// Utilities
import mixins from '../../util/mixins';
import { getSlot } from '../../util/helpers';
/* @vue/component */
export default mixins(Elevatable, Measurable, Themeable).extend({
    name: 'VSkeletonLoader',
    props: {
        boilerplate: Boolean,
        loading: Boolean,
        loadingText: {
            type: String,
            default: '$vuetify.loading',
        },
        tile: Boolean,
        transition: String,
        type: String,
        types: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        attrs() {
            if (!this.isLoading)
                return this.$attrs;
            return {
                'aria-busy': !this.boilerplate ? true : undefined,
                'aria-live': !this.boilerplate ? 'polite' : undefined,
                'aria-label': !this.boilerplate ? this.$vuetify.lang.t(this.loadingText) : undefined,
                role: !this.boilerplate ? 'alert' : undefined
            };
        },
        classes() {
            return {
                'v-skeleton-loader--boilerplate': this.boilerplate,
                'v-skeleton-loader--is-loading': this.isLoading,
                'v-skeleton-loader--tile': this.tile,
                ...this.themeClasses,
                ...this.elevationClasses,
            };
        },
        isLoading() {
            return !('default' in this.$slots) || this.loading;
        },
        rootTypes() {
            return {
                actions: 'button@2',
                article: 'heading, paragraph',
                avatar: 'avatar',
                button: 'button',
                card: 'image, card-heading',
                'card-avatar': 'image, list-item-avatar',
                'card-heading': 'heading',
                chip: 'chip',
                'date-picker': 'list-item, card-heading, divider, date-picker-options, date-picker-days, actions',
                'date-picker-options': 'text, avatar@2',
                'date-picker-days': 'avatar@28',
                heading: 'heading',
                image: 'image',
                'list-item': 'text',
                'list-item-avatar': 'avatar, text',
                'list-item-two-line': 'sentences',
                'list-item-avatar-two-line': 'avatar, sentences',
                'list-item-three-line': 'paragraph',
                'list-item-avatar-three-line': 'avatar, paragraph',
                paragraph: 'text@3',
                sentences: 'text@2',
                table: 'table-heading, table-thead, table-tbody, table-tfoot',
                'table-heading': 'heading, text',
                'table-thead': 'heading@6',
                'table-tbody': 'table-row-divider@6',
                'table-row-divider': 'table-row, divider',
                'table-row': 'table-cell@6',
                'table-cell': 'text',
                'table-tfoot': 'text@2, avatar@2',
                text: 'text',
                ...this.types,
            };
        },
    },
    methods: {
        genBone(text, children) {
            return h('div', {
                class: `v-skeleton-loader__${text} v-skeleton-loader__bone`,
            }, children);
        },
        genBones(bone) {
            // e.g. 'text@3'
            const [type, length] = bone.split('@');
            const generator = () => this.genStructure(type);
            // Generate a length array based upon
            // value after @ in the bone string
            return Array.from({ length }).map(generator);
        },
        // Fix type when this is merged
        // https://github.com/microsoft/TypeScript/pull/33050
        genStructure(type) {
            let children = [];
            type = type || this.type || '';
            const bone = this.rootTypes[type] || '';
            // End of recursion, do nothing
            /* eslint-disable-next-line no-empty, brace-style */
            if (type === bone) { }
            // Array of values - e.g. 'heading, paragraph, text@2'
            else if (type.indexOf(',') > -1)
                return this.mapBones(type);
            // Array of values - e.g. 'paragraph@4'
            else if (type.indexOf('@') > -1)
                return this.genBones(type);
            // Array of values - e.g. 'card@2'
            else if (bone.indexOf(',') > -1)
                children = this.mapBones(bone);
            // Array of values - e.g. 'list-item@2'
            else if (bone.indexOf('@') > -1)
                children = this.genBones(bone);
            // Single value - e.g. 'card-heading'
            else if (bone)
                children.push(this.genStructure(bone));
            return [this.genBone(type, children)];
        },
        genSkeleton() {
            const children = [];
            if (!this.isLoading)
                children.push(getSlot(this));
            else
                children.push(this.genStructure());
            /* istanbul ignore else */
            if (!this.transition)
                return children;
            /* istanbul ignore next */
            return h(Transition, {
                name: this.transition,
                // Only show transition when
                // content has been loaded
                onAfterEnter: this.resetStyles,
                onBeforeEnter: this.onBeforeEnter,
                onBeforeLeave: this.onBeforeLeave,
                onLeaveCancelled: this.resetStyles
            }, children);
        },
        mapBones(bones) {
            // Remove spaces and return array of structures
            return bones.replace(/\s/g, '').split(',').map(this.genStructure);
        },
        onBeforeEnter(el) {
            this.resetStyles(el);
            if (!this.isLoading)
                return;
            el._initialStyle = {
                display: el.style.display,
                transition: el.style.transition,
            };
            el.style.setProperty('transition', 'none', 'important');
        },
        onBeforeLeave(el) {
            el.style.setProperty('display', 'none', 'important');
        },
        resetStyles(el) {
            if (!el._initialStyle)
                return;
            el.style.display = el._initialStyle.display || '';
            el.style.transition = el._initialStyle.transition;
            delete el._initialStyle;
        },
    },
    render() {
        return h('div', {
            class: ['v-skeleton-loader', this.classes],
            ...this.attrs,
            ...this.$listeners,
            style: this.isLoading ? this.measurableStyles : undefined,
        }, [this.genSkeleton()]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNrZWxldG9uTG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlNrZWxldG9uTG9hZGVyL1ZTa2VsZXRvbkxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFFLENBQUMsRUFBQyxNQUFNLEtBQUssQ0FBQTtBQUNqQyxTQUFTO0FBQ1QsT0FBTyx3QkFBd0IsQ0FBQTtBQUUvQixTQUFTO0FBQ1QsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsWUFBWTtBQUNaLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBSXRDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQVU1QyxvQkFBb0I7QUFDcEIsZUFBZSxNQUFNLENBQ25CLFVBQVUsRUFDVixVQUFVLEVBQ1YsU0FBUyxDQUNWLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLGlCQUFpQjtJQUV2QixLQUFLLEVBQUU7UUFDTCxXQUFXLEVBQUUsT0FBTztRQUNwQixPQUFPLEVBQUUsT0FBTztRQUNoQixXQUFXLEVBQUU7WUFDWCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxrQkFBa0I7U0FDNUI7UUFDRCxJQUFJLEVBQUUsT0FBTztRQUNiLFVBQVUsRUFBRSxNQUFNO1FBQ2xCLElBQUksRUFBRSxNQUFNO1FBQ1osS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7U0FDcUI7S0FDM0M7SUFFRCxRQUFRLEVBQUU7UUFDUixLQUFLO1lBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTO2dCQUFFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQTtZQUV2QyxP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bi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZTa2VsZXRvbkxvYWRlci5zYXNzJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBFbGV2YXRhYmxlIGZyb20gJy4uLy4uL21peGlucy9lbGV2YXRhYmxlJ1xuaW1wb3J0IE1lYXN1cmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL21lYXN1cmFibGUnXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcblxuLy8gVHlwZXNcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xuaW1wb3J0IHsgZ2V0U2xvdCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcbmltcG9ydCB7IFByb3BWYWxpZGF0b3IgfSBmcm9tICd2dWUvdHlwZXMvb3B0aW9ucydcblxuZXhwb3J0IGludGVyZmFjZSBIVE1MU2tlbGV0b25Mb2FkZXJFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBfaW5pdGlhbFN0eWxlPzoge1xuICAgIGRpc3BsYXk6IHN0cmluZyB8IG51bGxcbiAgICB0cmFuc2l0aW9uOiBzdHJpbmdcbiAgfVxufVxuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxuICBFbGV2YXRhYmxlLFxuICBNZWFzdXJhYmxlLFxuICBUaGVtZWFibGUsXG4pLmV4dGVuZCh7XG4gIG5hbWU6ICdWU2tlbGV0b25Mb2FkZXInLFxuXG4gIHByb3BzOiB7XG4gICAgYm9pbGVycGxhdGU6IEJvb2xlYW4sXG4gICAgbG9hZGluZzogQm9vbGVhbixcbiAgICBsb2FkaW5nVGV4dDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5LmxvYWRpbmcnLFxuICAgIH0sXG4gICAgdGlsZTogQm9vbGVhbixcbiAgICB0cmFuc2l0aW9uOiBTdHJpbmcsXG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHR5cGVzOiB7XG4gICAgICB0eXBlOiBPYmplY3QsXG4gICAgICBkZWZhdWx0OiAoKSA9PiAoe30pLFxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PixcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGF0dHJzICgpOiBvYmplY3Qge1xuICAgICAgaWYgKCF0aGlzLmlzTG9hZGluZykgcmV0dXJuIHRoaXMuJGF0dHJzXG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgICdhcmlhLWJ1c3knOiAhdGhpcy5ib2lsZXJwbGF0ZSA/IHRydWUgOiB1bmRlZmluZWQsXG4gICAgICAgICdhcmlhLWxpdmUnOiAhdGhpcy5ib2lsZXJwbGF0ZSA/ICdwb2xpdGUnIDogdW5kZWZpbmVkLFxuICAgICAgICAnYXJpYS1sYWJlbCc6ICF0aGlzLmJvaWxlcnBsYXRlID8gdGhpcy4kdnVldGlmeS5sYW5nLnQodGhpcy5sb2FkaW5nVGV4dCkgOiB1bmRlZmluZWQsXG4gICAgICAgIHJvbGU6ICF0aGlzLmJvaWxlcnBsYXRlID8gJ2FsZXJ0JyA6IHVuZGVmaW5lZFxuICAgICAgfVxuICAgIH0sXG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LXNrZWxldG9uLWxvYWRlci0tYm9pbGVycGxhdGUnOiB0aGlzLmJvaWxlcnBsYXRlLFxuICAgICAgICAndi1za2VsZXRvbi1sb2FkZXItLWlzLWxvYWRpbmcnOiB0aGlzLmlzTG9hZGluZyxcbiAgICAgICAgJ3Ytc2tlbGV0b24tbG9hZGVyLS10aWxlJzogdGhpcy50aWxlLFxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3NlcyxcbiAgICAgICAgLi4udGhpcy5lbGV2YXRpb25DbGFzc2VzLFxuICAgICAgfVxuICAgIH0sXG4gICAgaXNMb2FkaW5nICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAhKCdkZWZhdWx0JyBpbiB0aGlzLiRzbG90cykgfHwgdGhpcy5sb2FkaW5nXG4gICAgfSxcbiAgICByb290VHlwZXMgKCk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYWN0aW9uczogJ2J1dHRvbkAyJyxcbiAgICAgICAgYXJ0aWNsZTogJ2hlYWRpbmcsIHBhcmFncmFwaCcsXG4gICAgICAgIGF2YXRhcjogJ2F2YXRhcicsXG4gICAgICAgIGJ1dHRvbjogJ2J1dHRvbicsXG4gICAgICAgIGNhcmQ6ICdpbWFnZSwgY2FyZC1oZWFkaW5nJyxcbiAgICAgICAgJ2NhcmQtYXZhdGFyJzogJ2ltYWdlLCBsaXN0LWl0ZW0tYXZhdGFyJyxcbiAgICAgICAgJ2NhcmQtaGVhZGluZyc6ICdoZWFkaW5nJyxcbiAgICAgICAgY2hpcDogJ2NoaXAnLFxuICAgICAgICAnZGF0ZS1waWNrZXInOiAnbGlzdC1pdGVtLCBjYXJkLWhlYWRpbmcsIGRpdmlkZXIsIGRhdGUtcGlja2VyLW9wdGlvbnMsIGRhdGUtcGlja2VyLWRheXMsIGFjdGlvbnMnLFxuICAgICAgICAnZGF0ZS1waWNrZXItb3B0aW9ucyc6ICd0ZXh0LCBhdmF0YXJAMicsXG4gICAgICAgICdkYXRlLXBpY2tlci1kYXlzJzogJ2F2YXRhckAyOCcsXG4gICAgICAgIGhlYWRpbmc6ICdoZWFkaW5nJyxcbiAgICAgICAgaW1hZ2U6ICdpbWFnZScsXG4gICAgICAgICdsaXN0LWl0ZW0nOiAndGV4dCcsXG4gICAgICAgICdsaXN0LWl0ZW0tYXZhdGFyJzogJ2F2YXRhciwgdGV4dCcsXG4gICAgICAgICdsaXN0LWl0ZW0tdHdvLWxpbmUnOiAnc2VudGVuY2VzJyxcbiAgICAgICAgJ2xpc3QtaXRlbS1hdmF0YXItdHdvLWxpbmUnOiAnYXZhdGFyLCBzZW50ZW5jZXMnLFxuICAgICAgICAnbGlzdC1pdGVtLXRocmVlLWxpbmUnOiAncGFyYWdyYXBoJyxcbiAgICAgICAgJ2xpc3QtaXRlbS1hdmF0YXItdGhyZWUtbGluZSc6ICdhdmF0YXIsIHBhcmFncmFwaCcsXG4gICAgICAgIHBhcmFncmFwaDogJ3RleHRAMycsXG4gICAgICAgIHNlbnRlbmNlczogJ3RleHRAMicsXG4gICAgICAgIHRhYmxlOiAndGFibGUtaGVhZGluZywgdGFibGUtdGhlYWQsIHRhYmxlLXRib2R5LCB0YWJsZS10Zm9vdCcsXG4gICAgICAgICd0YWJsZS1oZWFkaW5nJzogJ2hlYWRpbmcsIHRleHQnLFxuICAgICAgICAndGFibGUtdGhlYWQnOiAnaGVhZGluZ0A2JyxcbiAgICAgICAgJ3RhYmxlLXRib2R5JzogJ3RhYmxlLXJvdy1kaXZpZGVyQDYnLFxuICAgICAgICAndGFibGUtcm93LWRpdmlkZXInOiAndGFibGUtcm93LCBkaXZpZGVyJyxcbiAgICAgICAgJ3RhYmxlLXJvdyc6ICd0YWJsZS1jZWxsQDYnLFxuICAgICAgICAndGFibGUtY2VsbCc6ICd0ZXh0JyxcbiAgICAgICAgJ3RhYmxlLXRmb290JzogJ3RleHRAMiwgYXZhdGFyQDInLFxuICAgICAgICB0ZXh0OiAndGV4dCcsXG4gICAgICAgIC4uLnRoaXMudHlwZXMsXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2VuQm9uZSAodGV4dDogc3RyaW5nLCBjaGlsZHJlbjogVk5vZGVbXSkge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IGB2LXNrZWxldG9uLWxvYWRlcl9fJHt0ZXh0fSB2LXNrZWxldG9uLWxvYWRlcl9fYm9uZWAsXG4gICAgICB9LCBjaGlsZHJlbilcbiAgICB9LFxuICAgIGdlbkJvbmVzIChib25lOiBzdHJpbmcpOiBWTm9kZVtdIHtcbiAgICAgIC8vIGUuZy4gJ3RleHRAMydcbiAgICAgIGNvbnN0IFt0eXBlLCBsZW5ndGhdID0gYm9uZS5zcGxpdCgnQCcpIGFzIFtzdHJpbmcsIG51bWJlcl1cbiAgICAgIGNvbnN0IGdlbmVyYXRvciA9ICgpID0+IHRoaXMuZ2VuU3RydWN0dXJlKHR5cGUpXG5cbiAgICAgIC8vIEdlbmVyYXRlIGEgbGVuZ3RoIGFycmF5IGJhc2VkIHVwb25cbiAgICAgIC8vIHZhbHVlIGFmdGVyIEAgaW4gdGhlIGJvbmUgc3RyaW5nXG4gICAgICByZXR1cm4gQXJyYXkuZnJvbSh7IGxlbmd0aCB9KS5tYXAoZ2VuZXJhdG9yKVxuICAgIH0sXG4gICAgLy8gRml4IHR5cGUgd2hlbiB0aGlzIGlzIG1lcmdlZFxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9wdWxsLzMzMDUwXG4gICAgZ2VuU3RydWN0dXJlICh0eXBlPzogc3RyaW5nKTogYW55IHtcbiAgICAgIGxldCBjaGlsZHJlbiA9IFtdXG4gICAgICB0eXBlID0gdHlwZSB8fCB0aGlzLnR5cGUgfHwgJydcbiAgICAgIGNvbnN0IGJvbmUgPSB0aGlzLnJvb3RUeXBlc1t0eXBlXSB8fCAnJ1xuXG4gICAgICAvLyBFbmQgb2YgcmVjdXJzaW9uLCBkbyBub3RoaW5nXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZW1wdHksIGJyYWNlLXN0eWxlICovXG4gICAgICBpZiAodHlwZSA9PT0gYm9uZSkge31cbiAgICAgIC8vIEFycmF5IG9mIHZhbHVlcyAtIGUuZy4gJ2hlYWRpbmcsIHBhcmFncmFwaCwgdGV4dEAyJ1xuICAgICAgZWxzZSBpZiAodHlwZS5pbmRleE9mKCcsJykgPiAtMSkgcmV0dXJuIHRoaXMubWFwQm9uZXModHlwZSlcbiAgICAgIC8vIEFycmF5IG9mIHZhbHVlcyAtIGUuZy4gJ3BhcmFncmFwaEA0J1xuICAgICAgZWxzZSBpZiAodHlwZS5pbmRleE9mKCdAJykgPiAtMSkgcmV0dXJuIHRoaXMuZ2VuQm9uZXModHlwZSlcbiAgICAgIC8vIEFycmF5IG9mIHZhbHVlcyAtIGUuZy4gJ2NhcmRAMidcbiAgICAgIGVsc2UgaWYgKGJvbmUuaW5kZXhPZignLCcpID4gLTEpIGNoaWxkcmVuID0gdGhpcy5tYXBCb25lcyhib25lKVxuICAgICAgLy8gQXJyYXkgb2YgdmFsdWVzIC0gZS5nLiAnbGlzdC1pdGVtQDInXG4gICAgICBlbHNlIGlmIChib25lLmluZGV4T2YoJ0AnKSA+IC0xKSBjaGlsZHJlbiA9IHRoaXMuZ2VuQm9uZXMoYm9uZSlcbiAgICAgIC8vIFNpbmdsZSB2YWx1ZSAtIGUuZy4gJ2NhcmQtaGVhZGluZydcbiAgICAgIGVsc2UgaWYgKGJvbmUpIGNoaWxkcmVuLnB1c2godGhpcy5nZW5TdHJ1Y3R1cmUoYm9uZSkpXG5cbiAgICAgIHJldHVybiBbdGhpcy5nZW5Cb25lKHR5cGUsIGNoaWxkcmVuKV1cbiAgICB9LFxuICAgIGdlblNrZWxldG9uICgpIHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gW11cblxuICAgICAgaWYgKCF0aGlzLmlzTG9hZGluZykgY2hpbGRyZW4ucHVzaChnZXRTbG90KHRoaXMpKVxuICAgICAgZWxzZSBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuU3RydWN0dXJlKCkpXG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAoIXRoaXMudHJhbnNpdGlvbikgcmV0dXJuIGNoaWxkcmVuXG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICByZXR1cm4gaChUcmFuc2l0aW9uLCB7XG4gICAgICAgIG5hbWU6IHRoaXMudHJhbnNpdGlvbixcbiAgICAgICAgLy8gT25seSBzaG93IHRyYW5zaXRpb24gd2hlblxuICAgICAgICAvLyBjb250ZW50IGhhcyBiZWVuIGxvYWRlZFxuICAgICAgICBvbkFmdGVyRW50ZXI6IHRoaXMucmVzZXRTdHlsZXMsXG4gICAgICAgIG9uQmVmb3JlRW50ZXI6IHRoaXMub25CZWZvcmVFbnRlcixcbiAgICAgICAgb25CZWZvcmVMZWF2ZTogdGhpcy5vbkJlZm9yZUxlYXZlLFxuICAgICAgICBvbkxlYXZlQ2FuY2VsbGVkOiB0aGlzLnJlc2V0U3R5bGVzXG4gICAgICB9LCBjaGlsZHJlbilcbiAgICB9LFxuICAgIG1hcEJvbmVzIChib25lczogc3RyaW5nKSB7XG4gICAgICAvLyBSZW1vdmUgc3BhY2VzIGFuZCByZXR1cm4gYXJyYXkgb2Ygc3RydWN0dXJlc1xuICAgICAgcmV0dXJuIGJvbmVzLnJlcGxhY2UoL1xccy9nLCAnJykuc3BsaXQoJywnKS5tYXAodGhpcy5nZW5TdHJ1Y3R1cmUpXG4gICAgfSxcbiAgICBvbkJlZm9yZUVudGVyIChlbDogSFRNTFNrZWxldG9uTG9hZGVyRWxlbWVudCkge1xuICAgICAgdGhpcy5yZXNldFN0eWxlcyhlbClcblxuICAgICAgaWYgKCF0aGlzLmlzTG9hZGluZykgcmV0dXJuXG5cbiAgICAgIGVsLl9pbml0aWFsU3R5bGUgPSB7XG4gICAgICAgIGRpc3BsYXk6IGVsLnN0eWxlLmRpc3BsYXksXG4gICAgICAgIHRyYW5zaXRpb246IGVsLnN0eWxlLnRyYW5zaXRpb24sXG4gICAgICB9XG5cbiAgICAgIGVsLnN0eWxlLnNldFByb3BlcnR5KCd0cmFuc2l0aW9uJywgJ25vbmUnLCAnaW1wb3J0YW50JylcbiAgICB9LFxuICAgIG9uQmVmb3JlTGVhdmUgKGVsOiBIVE1MU2tlbGV0b25Mb2FkZXJFbGVtZW50KSB7XG4gICAgICBlbC5zdHlsZS5zZXRQcm9wZXJ0eSgnZGlzcGxheScsICdub25lJywgJ2ltcG9ydGFudCcpXG4gICAgfSxcbiAgICByZXNldFN0eWxlcyAoZWw6IEhUTUxTa2VsZXRvbkxvYWRlckVsZW1lbnQpIHtcbiAgICAgIGlmICghZWwuX2luaXRpYWxTdHlsZSkgcmV0dXJuXG5cbiAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBlbC5faW5pdGlhbFN0eWxlLmRpc3BsYXkgfHwgJydcbiAgICAgIGVsLnN0eWxlLnRyYW5zaXRpb24gPSBlbC5faW5pdGlhbFN0eWxlLnRyYW5zaXRpb25cblxuICAgICAgZGVsZXRlIGVsLl9pbml0aWFsU3R5bGVcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoKTogVk5vZGUge1xuICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICBjbGFzczogWyd2LXNrZWxldG9uLWxvYWRlcicsIHRoaXMuY2xhc3Nlc10sXG4gICAgICAuLi50aGlzLmF0dHJzLFxuICAgICAgLi4udGhpcy4kbGlzdGVuZXJzLFxuICAgICAgc3R5bGU6IHRoaXMuaXNMb2FkaW5nID8gdGhpcy5tZWFzdXJhYmxlU3R5bGVzIDogdW5kZWZpbmVkLFxuICAgIH0sIFt0aGlzLmdlblNrZWxldG9uKCldKVxuICB9LFxufSlcbiJdfQ==