// Styles
import './VChipGroup.sass';
// Extensions
import { BaseSlideGroup } from '../VSlideGroup/VSlideGroup';
// Mixins
import Colorable from '../../mixins/colorable';
// Utilities
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(BaseSlideGroup, Colorable).extend({
    name: 'v-chip-group',
    provide() {
        return {
            chipGroup: this,
        };
    },
    props: {
        column: Boolean,
    },
    computed: {
        classes() {
            return {
                ...BaseSlideGroup.computed.classes.call(this),
                'v-chip-group': true,
                'v-chip-group--column': this.column,
            };
        },
    },
    watch: {
        column(val) {
            if (val)
                this.scrollOffset = 0;
            this.$nextTick(this.onResize);
        },
    },
    methods: {
        genData() {
            return this.setTextColor(this.color, {
                ...BaseSlideGroup.methods.genData.call(this),
            });
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNoaXBHcm91cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZDaGlwR3JvdXAvVkNoaXBHcm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxtQkFBbUIsQ0FBQTtBQUUxQixhQUFhO0FBQ2IsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDRCQUE0QixDQUFBO0FBRTNELFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxZQUFZO0FBQ1osT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFFdEMsb0JBQW9CO0FBQ3BCLGVBQWUsTUFBTSxDQUNuQixjQUFjLEVBQ2QsU0FBUyxDQUNWLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLGNBQWM7SUFFcEIsT0FBTztRQUNMLE9BQU87WUFDTCxTQUFTLEVBQUUsSUFBSTtTQUNoQixDQUFBO0lBQ0gsQ0FBQztJQUVELEtBQUssRUFBRTtRQUNMLE1BQU0sRUFBRSxPQUFPO0tBQ2hCO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUM3QyxjQUFjLEVBQUUsSUFBSTtnQkFDcEIsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLE1BQU07YUFDcEMsQ0FBQTtRQUNILENBQUM7S0FDRjtJQUVELEtBQUssRUFBRTtRQUNMLE1BQU0sQ0FBRSxHQUFHO1lBQ1QsSUFBSSxHQUFHO2dCQUFFLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFBO1lBRTlCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQy9CLENBQUM7S0FDRjtJQUVELE9BQU8sRUFBRTtRQUNQLE9BQU87WUFDTCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDbkMsR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQzdDLENBQUMsQ0FBQTtRQUNKLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZDaGlwR3JvdXAuc2FzcydcblxuLy8gRXh0ZW5zaW9uc1xuaW1wb3J0IHsgQmFzZVNsaWRlR3JvdXAgfSBmcm9tICcuLi9WU2xpZGVHcm91cC9WU2xpZGVHcm91cCdcblxuLy8gTWl4aW5zXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcbiAgQmFzZVNsaWRlR3JvdXAsXG4gIENvbG9yYWJsZVxuKS5leHRlbmQoe1xuICBuYW1lOiAndi1jaGlwLWdyb3VwJyxcblxuICBwcm92aWRlICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY2hpcEdyb3VwOiB0aGlzLFxuICAgIH1cbiAgfSxcblxuICBwcm9wczoge1xuICAgIGNvbHVtbjogQm9vbGVhbixcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uQmFzZVNsaWRlR3JvdXAuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi1jaGlwLWdyb3VwJzogdHJ1ZSxcbiAgICAgICAgJ3YtY2hpcC1ncm91cC0tY29sdW1uJzogdGhpcy5jb2x1bW4sXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIGNvbHVtbiAodmFsKSB7XG4gICAgICBpZiAodmFsKSB0aGlzLnNjcm9sbE9mZnNldCA9IDBcblxuICAgICAgdGhpcy4kbmV4dFRpY2sodGhpcy5vblJlc2l6ZSlcbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5EYXRhICgpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldFRleHRDb2xvcih0aGlzLmNvbG9yLCB7XG4gICAgICAgIC4uLkJhc2VTbGlkZUdyb3VwLm1ldGhvZHMuZ2VuRGF0YS5jYWxsKHRoaXMpLFxuICAgICAgfSlcbiAgICB9LFxuICB9LFxufSlcbiJdfQ==