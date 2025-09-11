import { defineComponent } from 'vue';
import { deepEqual } from '../../util/helpers';
export default defineComponent({
    name: 'comparable',
    props: {
        valueComparator: {
            type: Function,
            default: deepEqual,
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2NvbXBhcmFibGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLEtBQUssQ0FBQTtBQUVuQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFOUMsZUFBZSxlQUFlLENBQUM7SUFDN0IsSUFBSSxFQUFFLFlBQVk7SUFDbEIsS0FBSyxFQUFFO1FBQ0wsZUFBZSxFQUFFO1lBQ2YsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsU0FBUztTQUNnQjtLQUNyQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZGVmaW5lQ29tcG9uZW50fSBmcm9tICd2dWUnXG5pbXBvcnQgeyBQcm9wVmFsaWRhdG9yIH0gZnJvbSAndnVlL3R5cGVzL29wdGlvbnMnXG5pbXBvcnQgeyBkZWVwRXF1YWwgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XG4gIG5hbWU6ICdjb21wYXJhYmxlJyxcbiAgcHJvcHM6IHtcbiAgICB2YWx1ZUNvbXBhcmF0b3I6IHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uLFxuICAgICAgZGVmYXVsdDogZGVlcEVxdWFsLFxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjx0eXBlb2YgZGVlcEVxdWFsPixcbiAgfSxcbn0pXG4iXX0=