import mixins from '../../util/mixins';
function searchChildren(children) {
    var _a, _b;
    const results = [];
    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        if (child.isActive && child.isDependent) {
            results.push(child);
        }
        else {
            results.push(...searchChildren(((_b = (_a = child.children) === null || _a === void 0 ? void 0 : _a.default) === null || _b === void 0 ? void 0 : _b.call(_a)) || []));
        }
    }
    return results;
}
/* @vue/component */
export default mixins().extend({
    name: 'dependent',
    data() {
        return {
            closeDependents: true,
            isActive: false,
            isDependent: true,
        };
    },
    watch: {
        isActive(val) {
            if (val)
                return;
            const openDependents = this.getOpenDependents();
            for (let index = 0; index < openDependents.length; index++) {
                openDependents[index].isActive = false;
            }
        },
    },
    methods: {
        getOpenDependents() {
            var _a, _b;
            const node = (_b = (_a = this.$slots).default) === null || _b === void 0 ? void 0 : _b.call(_a);
            if (!node)
                return [];
            if (this.closeDependents)
                return searchChildren(node);
            return [];
        },
        getOpenDependentElements() {
            const result = [];
            const openDependents = this.getOpenDependents();
            for (let index = 0; index < openDependents.length; index++) {
                result.push(...openDependents[index].getClickableDependentElements());
            }
            return result;
        },
        getClickableDependentElements() {
            const result = [this.$el];
            if (this.$refs.content)
                result.push(this.$refs.content);
            if (this.overlay)
                result.push(this.overlay.$el);
            result.push(...this.getOpenDependentElements());
            return result;
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2RlcGVuZGVudC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQWdCdEMsU0FBUyxjQUFjLENBQUUsUUFBZTs7SUFHdEMsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFBO0lBQ2xCLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ3BELE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQXNCLENBQUE7UUFFbEQsSUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUU7WUFDdkMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtTQUNwQjthQUFNO1lBQ0wsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLGNBQWMsQ0FBQyxDQUFBLE1BQUEsTUFBQSxLQUFLLENBQUMsUUFBUSwwQ0FBRSxPQUFPLGtEQUFJLEtBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtTQUNuRTtLQUNGO0lBRUQsT0FBTyxPQUFPLENBQUE7QUFDaEIsQ0FBQztBQUVELG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sRUFBaUIsQ0FBQyxNQUFNLENBQUM7SUFDNUMsSUFBSSxFQUFFLFdBQVc7SUFFakIsSUFBSTtRQUNGLE9BQU87WUFDTCxlQUFlLEVBQUUsSUFBSTtZQUNyQixRQUFRLEVBQUUsS0FBSztZQUNmLFdBQVcsRUFBRSxJQUFJO1NBQ2xCLENBQUE7SUFDSCxDQUFDO0lBRUQsS0FBSyxFQUFFO1FBQ0wsUUFBUSxDQUFFLEdBQUc7WUFDWCxJQUFJLEdBQUc7Z0JBQUUsT0FBTTtZQUVmLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQy9DLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxjQUFjLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUMxRCxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQTthQUN2QztRQUNILENBQUM7S0FDRjtJQUVELE9BQU8sRUFBRTtRQUNQLGlCQUFpQjs7WUFDZixNQUFNLElBQUksR0FBRyxNQUFBLE1BQUEsSUFBSSxDQUFDLE1BQU0sRUFBQyxPQUFPLGtEQUFJLENBQUE7WUFFcEMsSUFBRyxDQUFDLElBQUk7Z0JBQUUsT0FBTyxFQUFFLENBQUE7WUFFbkIsSUFBSSxJQUFJLENBQUMsZUFBZTtnQkFBRSxPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUdyRCxPQUFPLEVBQUUsQ0FBQTtRQUNYLENBQUM7UUFDRCx3QkFBd0I7WUFDdEIsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFBO1lBQ2pCLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBRS9DLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxjQUFjLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUMxRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLDZCQUE2QixFQUFFLENBQUMsQ0FBQTthQUN0RTtZQUVELE9BQU8sTUFBTSxDQUFBO1FBQ2YsQ0FBQztRQUNELDZCQUE2QjtZQUMzQixNQUFNLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUN6QixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTztnQkFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDdkQsSUFBSSxJQUFJLENBQUMsT0FBTztnQkFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBa0IsQ0FBQyxDQUFBO1lBQzlELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxDQUFBO1lBRS9DLE9BQU8sTUFBTSxDQUFBO1FBQ2YsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtkZWZpbmVDb21wb25lbnR9IGZyb20gJ3Z1ZSdcblxuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IFZPdmVybGF5IH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9WT3ZlcmxheSdcblxuaW50ZXJmYWNlIG9wdGlvbnMge1xuICAkZWw6IEhUTUxFbGVtZW50XG4gICRyZWZzOiB7XG4gICAgY29udGVudD86IEhUTUxFbGVtZW50XG4gIH1cbiAgb3ZlcmxheT86IEluc3RhbmNlVHlwZTx0eXBlb2YgVk92ZXJsYXk+XG59XG5cbmludGVyZmFjZSBEZXBlbmRlbnRJbnN0YW5jZSBleHRlbmRzIFZ1ZSB7XG4gIGlzQWN0aXZlPzogYm9vbGVhblxuICBpc0RlcGVuZGVudD86IGJvb2xlYW5cbn1cblxuZnVuY3Rpb24gc2VhcmNoQ2hpbGRyZW4gKGNoaWxkcmVuOiBWdWVbXSk6IERlcGVuZGVudEluc3RhbmNlW10ge1xuXG5cbiAgY29uc3QgcmVzdWx0cyA9IFtdXG4gIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjaGlsZHJlbi5sZW5ndGg7IGluZGV4KyspIHtcbiAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2luZGV4XSBhcyBEZXBlbmRlbnRJbnN0YW5jZVxuXG4gICAgaWYgKGNoaWxkLmlzQWN0aXZlICYmIGNoaWxkLmlzRGVwZW5kZW50KSB7XG4gICAgICByZXN1bHRzLnB1c2goY2hpbGQpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdHMucHVzaCguLi5zZWFyY2hDaGlsZHJlbihjaGlsZC5jaGlsZHJlbj8uZGVmYXVsdD8uKCkgfHwgW10pKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHRzXG59XG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBtaXhpbnM8VnVlICYgb3B0aW9ucz4oKS5leHRlbmQoe1xuICBuYW1lOiAnZGVwZW5kZW50JyxcblxuICBkYXRhICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY2xvc2VEZXBlbmRlbnRzOiB0cnVlLFxuICAgICAgaXNBY3RpdmU6IGZhbHNlLFxuICAgICAgaXNEZXBlbmRlbnQ6IHRydWUsXG4gICAgfVxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgaXNBY3RpdmUgKHZhbCkge1xuICAgICAgaWYgKHZhbCkgcmV0dXJuXG5cbiAgICAgIGNvbnN0IG9wZW5EZXBlbmRlbnRzID0gdGhpcy5nZXRPcGVuRGVwZW5kZW50cygpXG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgb3BlbkRlcGVuZGVudHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIG9wZW5EZXBlbmRlbnRzW2luZGV4XS5pc0FjdGl2ZSA9IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2V0T3BlbkRlcGVuZGVudHMgKCk6IGFueVtdIHtcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLiRzbG90cy5kZWZhdWx0Py4oKVxuXG4gICAgICBpZighbm9kZSkgcmV0dXJuIFtdXG5cbiAgICAgIGlmICh0aGlzLmNsb3NlRGVwZW5kZW50cykgcmV0dXJuIHNlYXJjaENoaWxkcmVuKG5vZGUpXG5cblxuICAgICAgcmV0dXJuIFtdXG4gICAgfSxcbiAgICBnZXRPcGVuRGVwZW5kZW50RWxlbWVudHMgKCk6IEhUTUxFbGVtZW50W10ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gW11cbiAgICAgIGNvbnN0IG9wZW5EZXBlbmRlbnRzID0gdGhpcy5nZXRPcGVuRGVwZW5kZW50cygpXG5cbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBvcGVuRGVwZW5kZW50cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgcmVzdWx0LnB1c2goLi4ub3BlbkRlcGVuZGVudHNbaW5kZXhdLmdldENsaWNrYWJsZURlcGVuZGVudEVsZW1lbnRzKCkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9LFxuICAgIGdldENsaWNrYWJsZURlcGVuZGVudEVsZW1lbnRzICgpOiBIVE1MRWxlbWVudFtdIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IFt0aGlzLiRlbF1cbiAgICAgIGlmICh0aGlzLiRyZWZzLmNvbnRlbnQpIHJlc3VsdC5wdXNoKHRoaXMuJHJlZnMuY29udGVudClcbiAgICAgIGlmICh0aGlzLm92ZXJsYXkpIHJlc3VsdC5wdXNoKHRoaXMub3ZlcmxheS4kZWwgYXMgSFRNTEVsZW1lbnQpXG4gICAgICByZXN1bHQucHVzaCguLi50aGlzLmdldE9wZW5EZXBlbmRlbnRFbGVtZW50cygpKVxuXG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfSxcbiAgfSxcbn0pXG4iXX0=