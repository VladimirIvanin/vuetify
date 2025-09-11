import { factory as PositionableFactory } from '../positionable';
// Util
import mixins from '../../util/mixins';
export default function applicationable(value, events = []) {
    /* @vue/component */
    return mixins(PositionableFactory(['absolute', 'fixed'])).extend({
        name: 'applicationable',
        props: {
            app: Boolean,
        },
        computed: {
            applicationProperty() {
                return value;
            },
        },
        watch: {
            // If previous value was app
            // reset the provided prop
            app(x, prev) {
                prev
                    ? this.removeApplication(true)
                    : this.callUpdate();
            },
            applicationProperty(newVal, oldVal) {
                this.$vuetify.application.unregister(this.$.uid, oldVal);
            },
        },
        activated() {
            this.callUpdate();
        },
        created() {
            for (let i = 0, length = events.length; i < length; i++) {
                this.$watch(events[i], this.callUpdate);
            }
            this.callUpdate();
        },
        mounted() {
            this.callUpdate();
        },
        deactivated() {
            this.removeApplication();
        },
        unmounted() {
            this.removeApplication();
        },
        methods: {
            callUpdate() {
                if (!this.app)
                    return;
                this.$vuetify.application.register(this.$.uid, this.applicationProperty, this.updateApplication());
            },
            removeApplication(force = false) {
                if (!force && !this.app)
                    return;
                this.$vuetify.application.unregister(this.$.uid, this.applicationProperty);
            },
            updateApplication: () => 0,
        },
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2FwcGxpY2F0aW9uYWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsT0FBTyxJQUFJLG1CQUFtQixFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFHaEUsT0FBTztBQUNQLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBRXRDLE1BQU0sQ0FBQyxPQUFPLFVBQVUsZUFBZSxDQUFFLEtBQWlCLEVBQUUsU0FBbUIsRUFBRTtJQUMvRSxvQkFBb0I7SUFDcEIsT0FBTyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUMvRCxJQUFJLEVBQUUsaUJBQWlCO1FBRXZCLEtBQUssRUFBRTtZQUNMLEdBQUcsRUFBRSxPQUFPO1NBQ2I7UUFFRCxRQUFRLEVBQUU7WUFDUixtQkFBbUI7Z0JBQ2pCLE9BQU8sS0FBSyxDQUFBO1lBQ2QsQ0FBQztTQUNGO1FBRUQsS0FBSyxFQUFFO1lBQ0wsNEJBQTRCO1lBQzVCLDBCQUEwQjtZQUMxQixHQUFHLENBQUUsQ0FBVSxFQUFFLElBQWE7Z0JBQzVCLElBQUk7b0JBQ0YsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUM7b0JBQzlCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7WUFDdkIsQ0FBQztZQUNELG1CQUFtQixDQUFFLE1BQU0sRUFBRSxNQUFNO2dCQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUE7WUFDMUQsQ0FBQztTQUNGO1FBRUQsU0FBUztZQUNQLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtRQUNuQixDQUFDO1FBRUQsT0FBTztZQUNMLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3ZELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTthQUN4QztZQUNELElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtRQUNuQixDQUFDO1FBRUQsT0FBTztZQUNMLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtRQUNuQixDQUFDO1FBRUQsV0FBVztZQUNULElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzFCLENBQUM7UUFFRCxTQUFTO1lBQ1AsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDMUIsQ0FBQztRQUVELE9BQU8sRUFBRTtZQUNQLFVBQVU7Z0JBQ1IsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHO29CQUFFLE9BQU07Z0JBRXJCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FDaEMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQ1YsSUFBSSxDQUFDLG1CQUFtQixFQUN4QixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FDekIsQ0FBQTtZQUNILENBQUM7WUFDRCxpQkFBaUIsQ0FBRSxLQUFLLEdBQUcsS0FBSztnQkFDOUIsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHO29CQUFFLE9BQU07Z0JBRS9CLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FDbEMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQ1YsSUFBSSxDQUFDLG1CQUFtQixDQUN6QixDQUFBO1lBQ0gsQ0FBQztZQUNELGlCQUFpQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDM0I7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZmFjdG9yeSBhcyBQb3NpdGlvbmFibGVGYWN0b3J5IH0gZnJvbSAnLi4vcG9zaXRpb25hYmxlJ1xuaW1wb3J0IHsgVGFyZ2V0UHJvcCB9IGZyb20gJ3Z1ZXRpZnkvdHlwZXMvc2VydmljZXMvYXBwbGljYXRpb24nXG5cbi8vIFV0aWxcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFwcGxpY2F0aW9uYWJsZSAodmFsdWU6IFRhcmdldFByb3AsIGV2ZW50czogc3RyaW5nW10gPSBbXSkge1xuICAvKiBAdnVlL2NvbXBvbmVudCAqL1xuICByZXR1cm4gbWl4aW5zKFBvc2l0aW9uYWJsZUZhY3RvcnkoWydhYnNvbHV0ZScsICdmaXhlZCddKSkuZXh0ZW5kKHtcbiAgICBuYW1lOiAnYXBwbGljYXRpb25hYmxlJyxcblxuICAgIHByb3BzOiB7XG4gICAgICBhcHA6IEJvb2xlYW4sXG4gICAgfSxcblxuICAgIGNvbXB1dGVkOiB7XG4gICAgICBhcHBsaWNhdGlvblByb3BlcnR5ICgpOiBUYXJnZXRQcm9wIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICB3YXRjaDoge1xuICAgICAgLy8gSWYgcHJldmlvdXMgdmFsdWUgd2FzIGFwcFxuICAgICAgLy8gcmVzZXQgdGhlIHByb3ZpZGVkIHByb3BcbiAgICAgIGFwcCAoeDogYm9vbGVhbiwgcHJldjogYm9vbGVhbikge1xuICAgICAgICBwcmV2XG4gICAgICAgICAgPyB0aGlzLnJlbW92ZUFwcGxpY2F0aW9uKHRydWUpXG4gICAgICAgICAgOiB0aGlzLmNhbGxVcGRhdGUoKVxuICAgICAgfSxcbiAgICAgIGFwcGxpY2F0aW9uUHJvcGVydHkgKG5ld1ZhbCwgb2xkVmFsKSB7XG4gICAgICAgIHRoaXMuJHZ1ZXRpZnkuYXBwbGljYXRpb24udW5yZWdpc3Rlcih0aGlzLiQudWlkLCBvbGRWYWwpXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICBhY3RpdmF0ZWQgKCkge1xuICAgICAgdGhpcy5jYWxsVXBkYXRlKClcbiAgICB9LFxuXG4gICAgY3JlYXRlZCAoKSB7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gZXZlbnRzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuJHdhdGNoKGV2ZW50c1tpXSwgdGhpcy5jYWxsVXBkYXRlKVxuICAgICAgfVxuICAgICAgdGhpcy5jYWxsVXBkYXRlKClcbiAgICB9LFxuXG4gICAgbW91bnRlZCAoKSB7XG4gICAgICB0aGlzLmNhbGxVcGRhdGUoKVxuICAgIH0sXG5cbiAgICBkZWFjdGl2YXRlZCAoKSB7XG4gICAgICB0aGlzLnJlbW92ZUFwcGxpY2F0aW9uKClcbiAgICB9LFxuXG4gICAgdW5tb3VudGVkICgpIHtcbiAgICAgIHRoaXMucmVtb3ZlQXBwbGljYXRpb24oKVxuICAgIH0sXG5cbiAgICBtZXRob2RzOiB7XG4gICAgICBjYWxsVXBkYXRlICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmFwcCkgcmV0dXJuXG5cbiAgICAgICAgdGhpcy4kdnVldGlmeS5hcHBsaWNhdGlvbi5yZWdpc3RlcihcbiAgICAgICAgICB0aGlzLiQudWlkLFxuICAgICAgICAgIHRoaXMuYXBwbGljYXRpb25Qcm9wZXJ0eSxcbiAgICAgICAgICB0aGlzLnVwZGF0ZUFwcGxpY2F0aW9uKClcbiAgICAgICAgKVxuICAgICAgfSxcbiAgICAgIHJlbW92ZUFwcGxpY2F0aW9uIChmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIGlmICghZm9yY2UgJiYgIXRoaXMuYXBwKSByZXR1cm5cblxuICAgICAgICB0aGlzLiR2dWV0aWZ5LmFwcGxpY2F0aW9uLnVucmVnaXN0ZXIoXG4gICAgICAgICAgdGhpcy4kLnVpZCxcbiAgICAgICAgICB0aGlzLmFwcGxpY2F0aW9uUHJvcGVydHlcbiAgICAgICAgKVxuICAgICAgfSxcbiAgICAgIHVwZGF0ZUFwcGxpY2F0aW9uOiAoKSA9PiAwLFxuICAgIH0sXG4gIH0pXG59XG4iXX0=