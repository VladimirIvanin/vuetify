// Styles
import './VBtnToggle.sass';
// Mixins
import ButtonGroup from '../../mixins/button-group';
import Colorable from '../../mixins/colorable';
// Utilities
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(ButtonGroup, Colorable).extend({
    name: 'v-btn-toggle',
    props: {
        backgroundColor: String,
        borderless: Boolean,
        dense: Boolean,
        group: Boolean,
        rounded: Boolean,
        shaped: Boolean,
        tile: Boolean,
    },
    computed: {
        classes() {
            return {
                ...ButtonGroup.computed.classes.call(this),
                'v-btn-toggle': true,
                'v-btn-toggle--borderless': this.borderless,
                'v-btn-toggle--dense': this.dense,
                'v-btn-toggle--group': this.group,
                'v-btn-toggle--rounded': this.rounded,
                'v-btn-toggle--shaped': this.shaped,
                'v-btn-toggle--tile': this.tile,
                ...this.themeClasses,
            };
        },
    },
    methods: {
        genData() {
            const data = this.setTextColor(this.color, {
                ...ButtonGroup.methods.genData.call(this),
            });
            if (this.group)
                return data;
            return this.setBackgroundColor(this.backgroundColor, data);
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkJ0blRvZ2dsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZCdG5Ub2dnbGUvVkJ0blRvZ2dsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxtQkFBbUIsQ0FBQTtBQUUxQixTQUFTO0FBQ1QsT0FBTyxXQUFXLE1BQU0sMkJBQTJCLENBQUE7QUFDbkQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsWUFBWTtBQUNaLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBRXRDLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FDbkIsV0FBVyxFQUNYLFNBQVMsQ0FDVixDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxjQUFjO0lBRXBCLEtBQUssRUFBRTtRQUNMLGVBQWUsRUFBRSxNQUFNO1FBQ3ZCLFVBQVUsRUFBRSxPQUFPO1FBQ25CLEtBQUssRUFBRSxPQUFPO1FBQ2QsS0FBSyxFQUFFLE9BQU87UUFDZCxPQUFPLEVBQUUsT0FBTztRQUNoQixNQUFNLEVBQUUsT0FBTztRQUNmLElBQUksRUFBRSxPQUFPO0tBQ2Q7SUFFRCxRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTztnQkFDTCxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQzFDLGNBQWMsRUFBRSxJQUFJO2dCQUNwQiwwQkFBMEIsRUFBRSxJQUFJLENBQUMsVUFBVTtnQkFDM0MscUJBQXFCLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2pDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsT0FBTztnQkFDckMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ25DLG9CQUFvQixFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUMvQixHQUFHLElBQUksQ0FBQyxZQUFZO2FBQ3JCLENBQUE7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxPQUFPO1lBQ0wsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUN6QyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDMUMsQ0FBQyxDQUFBO1lBRUYsSUFBSSxJQUFJLENBQUMsS0FBSztnQkFBRSxPQUFPLElBQUksQ0FBQTtZQUUzQixPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQzVELENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZCdG5Ub2dnbGUuc2FzcydcblxuLy8gTWl4aW5zXG5pbXBvcnQgQnV0dG9uR3JvdXAgZnJvbSAnLi4vLi4vbWl4aW5zL2J1dHRvbi1ncm91cCdcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxuICBCdXR0b25Hcm91cCxcbiAgQ29sb3JhYmxlXG4pLmV4dGVuZCh7XG4gIG5hbWU6ICd2LWJ0bi10b2dnbGUnLFxuXG4gIHByb3BzOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBTdHJpbmcsXG4gICAgYm9yZGVybGVzczogQm9vbGVhbixcbiAgICBkZW5zZTogQm9vbGVhbixcbiAgICBncm91cDogQm9vbGVhbixcbiAgICByb3VuZGVkOiBCb29sZWFuLFxuICAgIHNoYXBlZDogQm9vbGVhbixcbiAgICB0aWxlOiBCb29sZWFuLFxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLkJ1dHRvbkdyb3VwLmNvbXB1dGVkLmNsYXNzZXMuY2FsbCh0aGlzKSxcbiAgICAgICAgJ3YtYnRuLXRvZ2dsZSc6IHRydWUsXG4gICAgICAgICd2LWJ0bi10b2dnbGUtLWJvcmRlcmxlc3MnOiB0aGlzLmJvcmRlcmxlc3MsXG4gICAgICAgICd2LWJ0bi10b2dnbGUtLWRlbnNlJzogdGhpcy5kZW5zZSxcbiAgICAgICAgJ3YtYnRuLXRvZ2dsZS0tZ3JvdXAnOiB0aGlzLmdyb3VwLFxuICAgICAgICAndi1idG4tdG9nZ2xlLS1yb3VuZGVkJzogdGhpcy5yb3VuZGVkLFxuICAgICAgICAndi1idG4tdG9nZ2xlLS1zaGFwZWQnOiB0aGlzLnNoYXBlZCxcbiAgICAgICAgJ3YtYnRuLXRvZ2dsZS0tdGlsZSc6IHRoaXMudGlsZSxcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXMsXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2VuRGF0YSAoKSB7XG4gICAgICBjb25zdCBkYXRhID0gdGhpcy5zZXRUZXh0Q29sb3IodGhpcy5jb2xvciwge1xuICAgICAgICAuLi5CdXR0b25Hcm91cC5tZXRob2RzLmdlbkRhdGEuY2FsbCh0aGlzKSxcbiAgICAgIH0pXG5cbiAgICAgIGlmICh0aGlzLmdyb3VwKSByZXR1cm4gZGF0YVxuXG4gICAgICByZXR1cm4gdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5iYWNrZ3JvdW5kQ29sb3IsIGRhdGEpXG4gICAgfSxcbiAgfSxcbn0pXG4iXX0=