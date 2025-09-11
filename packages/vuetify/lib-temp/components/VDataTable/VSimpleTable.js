import { h } from 'vue';
import './VSimpleTable.sass';
import { convertToUnit, getSlot } from '../../util/helpers';
import Themeable from '../../mixins/themeable';
import mixins from '../../util/mixins';
export default mixins(Themeable).extend({
    name: 'v-simple-table',
    props: {
        dense: Boolean,
        fixedHeader: Boolean,
        height: [Number, String],
    },
    computed: {
        classes() {
            return {
                'v-data-table--dense': this.dense,
                'v-data-table--fixed-height': !!this.height && !this.fixedHeader,
                'v-data-table--fixed-header': this.fixedHeader,
                'v-data-table--has-top': !!this.$slots.top,
                'v-data-table--has-bottom': !!this.$slots.bottom,
                ...this.themeClasses,
            };
        },
    },
    methods: {
        genWrapper() {
            return getSlot(this, 'wrapper') || h('div', {
                class: 'v-data-table__wrapper',
                style: {
                    height: convertToUnit(this.height),
                },
            }, [
                h('table', getSlot(this)),
            ]);
        },
    },
    render() {
        return h('div', {
            class: ['v-data-table', this.classes],
        }, [
            getSlot(this, 'top'),
            this.genWrapper(),
            getSlot(this, 'bottom'),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNpbXBsZVRhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkRhdGFUYWJsZS9WU2ltcGxlVGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLENBQUMsRUFBUyxNQUFNLEtBQUssQ0FBQTtBQUM5QixPQUFPLHFCQUFxQixDQUFBO0FBRTVCLE9BQU8sRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDM0QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFFdEMsZUFBZSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ3RDLElBQUksRUFBRSxnQkFBZ0I7SUFFdEIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFLE9BQU87UUFDZCxXQUFXLEVBQUUsT0FBTztRQUNwQixNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO0tBQ3pCO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wscUJBQXFCLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2pDLDRCQUE0QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVc7Z0JBQ2hFLDRCQUE0QixFQUFFLElBQUksQ0FBQyxXQUFXO2dCQUM5Qyx1QkFBdUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHO2dCQUMxQywwQkFBMEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNO2dCQUNoRCxHQUFHLElBQUksQ0FBQyxZQUFZO2FBQ3JCLENBQUE7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxVQUFVO1lBQ1IsT0FBTyxPQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUU7Z0JBQzFDLEtBQUssRUFBRSx1QkFBdUI7Z0JBQzlCLEtBQUssRUFBRTtvQkFDTCxNQUFNLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7aUJBQ25DO2FBQ0YsRUFBRTtnQkFDRCxDQUFDLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMxQixDQUFDLENBQUE7UUFDSixDQUFDO0tBQ0Y7SUFFRCxNQUFNO1FBQ0osT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQ2QsS0FBSyxFQUFFLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDdEMsRUFBRTtZQUNELE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDakIsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUM7U0FDeEIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGgsIFZOb2RlIH0gZnJvbSAndnVlJ1xuaW1wb3J0ICcuL1ZTaW1wbGVUYWJsZS5zYXNzJ1xuXG5pbXBvcnQgeyBjb252ZXJ0VG9Vbml0LCBnZXRTbG90IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcblxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFRoZW1lYWJsZSkuZXh0ZW5kKHtcbiAgbmFtZTogJ3Ytc2ltcGxlLXRhYmxlJyxcblxuICBwcm9wczoge1xuICAgIGRlbnNlOiBCb29sZWFuLFxuICAgIGZpeGVkSGVhZGVyOiBCb29sZWFuLFxuICAgIGhlaWdodDogW051bWJlciwgU3RyaW5nXSxcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LWRhdGEtdGFibGUtLWRlbnNlJzogdGhpcy5kZW5zZSxcbiAgICAgICAgJ3YtZGF0YS10YWJsZS0tZml4ZWQtaGVpZ2h0JzogISF0aGlzLmhlaWdodCAmJiAhdGhpcy5maXhlZEhlYWRlcixcbiAgICAgICAgJ3YtZGF0YS10YWJsZS0tZml4ZWQtaGVhZGVyJzogdGhpcy5maXhlZEhlYWRlcixcbiAgICAgICAgJ3YtZGF0YS10YWJsZS0taGFzLXRvcCc6ICEhdGhpcy4kc2xvdHMudG9wLFxuICAgICAgICAndi1kYXRhLXRhYmxlLS1oYXMtYm90dG9tJzogISF0aGlzLiRzbG90cy5ib3R0b20sXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzLFxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGdlbldyYXBwZXIgKCkge1xuICAgICAgcmV0dXJuIGdldFNsb3QodGhpcywgJ3dyYXBwZXInKSB8fCBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiAndi1kYXRhLXRhYmxlX193cmFwcGVyJyxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBoZWlnaHQ6IGNvbnZlcnRUb1VuaXQodGhpcy5oZWlnaHQpLFxuICAgICAgICB9LFxuICAgICAgfSwgW1xuICAgICAgICBoKCd0YWJsZScsIGdldFNsb3QodGhpcykpLFxuICAgICAgXSlcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoKTogVk5vZGUge1xuICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICBjbGFzczogWyd2LWRhdGEtdGFibGUnLCB0aGlzLmNsYXNzZXNdLFxuICAgIH0sIFtcbiAgICAgIGdldFNsb3QodGhpcywgJ3RvcCcpLFxuICAgICAgdGhpcy5nZW5XcmFwcGVyKCksXG4gICAgICBnZXRTbG90KHRoaXMsICdib3R0b20nKSxcbiAgICBdKVxuICB9LFxufSlcbiJdfQ==