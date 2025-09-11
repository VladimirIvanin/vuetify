// Styles
import './VExpansionPanel.sass';
// Components
import { BaseItemGroup } from '../VItemGroup/VItemGroup';
// Utilities
import { breaking } from '../../util/console';
import { defineComponent } from 'vue';
/* @vue/component */
export default defineComponent({
    name: 'v-expansion-panels',
    extends: BaseItemGroup,
    provide() {
        return {
            expansionPanels: this,
        };
    },
    props: {
        accordion: Boolean,
        disabled: Boolean,
        flat: Boolean,
        hover: Boolean,
        focusable: Boolean,
        inset: Boolean,
        popout: Boolean,
        readonly: Boolean,
        tile: Boolean,
    },
    computed: {
        classes() {
            return {
                ...BaseItemGroup.computed.classes.call(this),
                'v-expansion-panels': true,
                'v-expansion-panels--accordion': this.accordion,
                'v-expansion-panels--flat': this.flat,
                'v-expansion-panels--hover': this.hover,
                'v-expansion-panels--focusable': this.focusable,
                'v-expansion-panels--inset': this.inset,
                'v-expansion-panels--popout': this.popout,
                'v-expansion-panels--tile': this.tile,
            };
        },
    },
    created() {
        /* istanbul ignore next */
        if (this.$attrs.hasOwnProperty('expand')) {
            breaking('expand', 'multiple', this);
        }
        /* istanbul ignore next */
        if (Array.isArray(this.value) &&
            this.value.length > 0 &&
            typeof this.value[0] === 'boolean') {
            breaking(':value="[true, false, true]"', ':value="[0, 2]"', this);
        }
    },
    methods: {
        updateItem(item, index) {
            const value = this.getValue(item, index);
            const nextValue = this.getValue(item, index + 1);
            item.isActive = this.toggleMethod(value);
            item.nextIsActive = this.toggleMethod(nextValue);
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkV4cGFuc2lvblBhbmVscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZFeHBhbnNpb25QYW5lbC9WRXhwYW5zaW9uUGFuZWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLHdCQUF3QixDQUFBO0FBRS9CLGFBQWE7QUFDYixPQUFPLEVBQUUsYUFBYSxFQUFxQixNQUFNLDBCQUEwQixDQUFBO0FBRzNFLFlBQVk7QUFDWixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDN0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLEtBQUssQ0FBQTtBQUtyQyxvQkFBb0I7QUFDcEIsZUFBZSxlQUFlLENBQUM7SUFDN0IsSUFBSSxFQUFFLG9CQUFvQjtJQUMxQixPQUFPLEVBQUUsYUFBYTtJQUV0QixPQUFPO1FBQ0wsT0FBTztZQUNMLGVBQWUsRUFBRSxJQUFJO1NBQ3RCLENBQUE7SUFDSCxDQUFDO0lBRUQsS0FBSyxFQUFFO1FBQ0wsU0FBUyxFQUFFLE9BQU87UUFDbEIsUUFBUSxFQUFFLE9BQU87UUFDakIsSUFBSSxFQUFFLE9BQU87UUFDYixLQUFLLEVBQUUsT0FBTztRQUNkLFNBQVMsRUFBRSxPQUFPO1FBQ2xCLEtBQUssRUFBRSxPQUFPO1FBQ2QsTUFBTSxFQUFFLE9BQU87UUFDZixRQUFRLEVBQUUsT0FBTztRQUNqQixJQUFJLEVBQUUsT0FBTztLQUNkO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wsR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUM1QyxvQkFBb0IsRUFBRSxJQUFJO2dCQUMxQiwrQkFBK0IsRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDL0MsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ3JDLDJCQUEyQixFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUN2QywrQkFBK0IsRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDL0MsMkJBQTJCLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ3ZDLDRCQUE0QixFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUN6QywwQkFBMEIsRUFBRSxJQUFJLENBQUMsSUFBSTthQUN0QyxDQUFBO1FBQ0gsQ0FBQztLQUNGO0lBRUQsT0FBTztRQUNMLDBCQUEwQjtRQUMxQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3hDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFBO1NBQ3JDO1FBRUQsMEJBQTBCO1FBQzFCLElBQ0UsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUM7WUFDckIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsRUFDbEM7WUFDQSxRQUFRLENBQUMsOEJBQThCLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUE7U0FDbEU7SUFDSCxDQUFDO0lBRUQsT0FBTyxFQUFFO1FBQ1AsVUFBVSxDQUFFLElBQWlELEVBQUUsS0FBYTtZQUMxRSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUN4QyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUE7WUFFaEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ3hDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUNsRCxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcbmltcG9ydCAnLi9WRXhwYW5zaW9uUGFuZWwuc2FzcydcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IHsgQmFzZUl0ZW1Hcm91cCwgR3JvdXBhYmxlSW5zdGFuY2UgfSBmcm9tICcuLi9WSXRlbUdyb3VwL1ZJdGVtR3JvdXAnXG5pbXBvcnQgVkV4cGFuc2lvblBhbmVsIGZyb20gJy4vVkV4cGFuc2lvblBhbmVsJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCB7IGJyZWFraW5nIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xuaW1wb3J0IHsgZGVmaW5lQ29tcG9uZW50IH0gZnJvbSAndnVlJ1xuXG4vLyBUeXBlc1xuaW50ZXJmYWNlIFZFeHBhbnNpb25QYW5lbEluc3RhbmNlIGV4dGVuZHMgSW5zdGFuY2VUeXBlPHR5cGVvZiBWRXhwYW5zaW9uUGFuZWw+IHt9XG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb21wb25lbnQoe1xuICBuYW1lOiAndi1leHBhbnNpb24tcGFuZWxzJyxcbiAgZXh0ZW5kczogQmFzZUl0ZW1Hcm91cCxcblxuICBwcm92aWRlICgpOiBvYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICBleHBhbnNpb25QYW5lbHM6IHRoaXMsXG4gICAgfVxuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgYWNjb3JkaW9uOiBCb29sZWFuLFxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxuICAgIGZsYXQ6IEJvb2xlYW4sXG4gICAgaG92ZXI6IEJvb2xlYW4sXG4gICAgZm9jdXNhYmxlOiBCb29sZWFuLFxuICAgIGluc2V0OiBCb29sZWFuLFxuICAgIHBvcG91dDogQm9vbGVhbixcbiAgICByZWFkb25seTogQm9vbGVhbixcbiAgICB0aWxlOiBCb29sZWFuLFxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLkJhc2VJdGVtR3JvdXAuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi1leHBhbnNpb24tcGFuZWxzJzogdHJ1ZSxcbiAgICAgICAgJ3YtZXhwYW5zaW9uLXBhbmVscy0tYWNjb3JkaW9uJzogdGhpcy5hY2NvcmRpb24sXG4gICAgICAgICd2LWV4cGFuc2lvbi1wYW5lbHMtLWZsYXQnOiB0aGlzLmZsYXQsXG4gICAgICAgICd2LWV4cGFuc2lvbi1wYW5lbHMtLWhvdmVyJzogdGhpcy5ob3ZlcixcbiAgICAgICAgJ3YtZXhwYW5zaW9uLXBhbmVscy0tZm9jdXNhYmxlJzogdGhpcy5mb2N1c2FibGUsXG4gICAgICAgICd2LWV4cGFuc2lvbi1wYW5lbHMtLWluc2V0JzogdGhpcy5pbnNldCxcbiAgICAgICAgJ3YtZXhwYW5zaW9uLXBhbmVscy0tcG9wb3V0JzogdGhpcy5wb3BvdXQsXG4gICAgICAgICd2LWV4cGFuc2lvbi1wYW5lbHMtLXRpbGUnOiB0aGlzLnRpbGUsXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICBjcmVhdGVkICgpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmICh0aGlzLiRhdHRycy5oYXNPd25Qcm9wZXJ0eSgnZXhwYW5kJykpIHtcbiAgICAgIGJyZWFraW5nKCdleHBhbmQnLCAnbXVsdGlwbGUnLCB0aGlzKVxuICAgIH1cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKFxuICAgICAgQXJyYXkuaXNBcnJheSh0aGlzLnZhbHVlKSAmJlxuICAgICAgdGhpcy52YWx1ZS5sZW5ndGggPiAwICYmXG4gICAgICB0eXBlb2YgdGhpcy52YWx1ZVswXSA9PT0gJ2Jvb2xlYW4nXG4gICAgKSB7XG4gICAgICBicmVha2luZygnOnZhbHVlPVwiW3RydWUsIGZhbHNlLCB0cnVlXVwiJywgJzp2YWx1ZT1cIlswLCAyXVwiJywgdGhpcylcbiAgICB9XG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIHVwZGF0ZUl0ZW0gKGl0ZW06IEdyb3VwYWJsZUluc3RhbmNlICYgVkV4cGFuc2lvblBhbmVsSW5zdGFuY2UsIGluZGV4OiBudW1iZXIpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5nZXRWYWx1ZShpdGVtLCBpbmRleClcbiAgICAgIGNvbnN0IG5leHRWYWx1ZSA9IHRoaXMuZ2V0VmFsdWUoaXRlbSwgaW5kZXggKyAxKVxuXG4gICAgICBpdGVtLmlzQWN0aXZlID0gdGhpcy50b2dnbGVNZXRob2QodmFsdWUpXG4gICAgICBpdGVtLm5leHRJc0FjdGl2ZSA9IHRoaXMudG9nZ2xlTWV0aG9kKG5leHRWYWx1ZSlcbiAgICB9LFxuICB9LFxufSlcbiJdfQ==