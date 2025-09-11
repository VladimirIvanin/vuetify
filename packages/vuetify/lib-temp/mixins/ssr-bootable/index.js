import { defineComponent } from 'vue';
/**
 * SSRBootable
 *
 * @mixin
 *
 * Used in layout components (drawer, toolbar, content)
 * to avoid an entry animation when using SSR
 */
export default defineComponent({
    name: 'ssr-bootable',
    data: () => ({
        isBooted: false,
    }),
    mounted() {
        // Use setAttribute instead of dataset
        // because dataset does not work well
        // with unit tests
        window.requestAnimationFrame(() => {
            this.$el.setAttribute('data-booted', 'true');
            this.isBooted = true;
        });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3Nzci1ib290YWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sS0FBSyxDQUFBO0FBRW5DOzs7Ozs7O0dBT0c7QUFDSCxlQUFlLGVBQWUsQ0FBQztJQUM3QixJQUFJLEVBQUUsY0FBYztJQUVwQixJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNYLFFBQVEsRUFBRSxLQUFLO0tBQ2hCLENBQUM7SUFFRixPQUFPO1FBQ0wsc0NBQXNDO1FBQ3RDLHFDQUFxQztRQUNyQyxrQkFBa0I7UUFDbEIsTUFBTSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsRUFBRTtZQUNoQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUE7WUFDNUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7UUFDdEIsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtkZWZpbmVDb21wb25lbnR9IGZyb20gJ3Z1ZSdcblxuLyoqXG4gKiBTU1JCb290YWJsZVxuICpcbiAqIEBtaXhpblxuICpcbiAqIFVzZWQgaW4gbGF5b3V0IGNvbXBvbmVudHMgKGRyYXdlciwgdG9vbGJhciwgY29udGVudClcbiAqIHRvIGF2b2lkIGFuIGVudHJ5IGFuaW1hdGlvbiB3aGVuIHVzaW5nIFNTUlxuICovXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb21wb25lbnQoe1xuICBuYW1lOiAnc3NyLWJvb3RhYmxlJyxcblxuICBkYXRhOiAoKSA9PiAoe1xuICAgIGlzQm9vdGVkOiBmYWxzZSxcbiAgfSksXG5cbiAgbW91bnRlZCAoKSB7XG4gICAgLy8gVXNlIHNldEF0dHJpYnV0ZSBpbnN0ZWFkIG9mIGRhdGFzZXRcbiAgICAvLyBiZWNhdXNlIGRhdGFzZXQgZG9lcyBub3Qgd29yayB3ZWxsXG4gICAgLy8gd2l0aCB1bml0IHRlc3RzXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtYm9vdGVkJywgJ3RydWUnKVxuICAgICAgdGhpcy5pc0Jvb3RlZCA9IHRydWVcbiAgICB9KVxuICB9LFxufSlcbiJdfQ==