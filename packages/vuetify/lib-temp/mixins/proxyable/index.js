import { defineComponent } from 'vue';
export function factory(prop = 'modelValue', event = 'update:modelValue') {
    return defineComponent({
        name: 'proxyable',
        props: {
            [prop]: {
                required: false,
            },
        },
        data() {
            return {
                internalLazyValue: this[prop],
            };
        },
        computed: {
            internalValue: {
                get() {
                    return this.internalLazyValue;
                },
                set(val) {
                    if (val === this.internalLazyValue)
                        return;
                    this.internalLazyValue = val;
                    this.$emit(event, val);
                },
            },
        },
        watch: {
            [prop](val) {
                this.internalLazyValue = val;
            },
        },
    });
}
/* eslint-disable-next-line @typescript-eslint/no-redeclare */
const Proxyable = factory();
export default Proxyable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3Byb3h5YWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZUFBZSxFQUF1QixNQUFNLEtBQUssQ0FBQTtBQVExRCxNQUFNLFVBQVUsT0FBTyxDQUNyQixJQUFJLEdBQUcsWUFBWSxFQUNuQixLQUFLLEdBQUcsbUJBQW1CO0lBRTNCLE9BQU8sZUFBZSxDQUFDO1FBQ3JCLElBQUksRUFBRSxXQUFXO1FBRWpCLEtBQUssRUFBRTtZQUNMLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLEtBQUs7YUFDaEI7U0FDRjtRQUVELElBQUk7WUFDRixPQUFPO2dCQUNMLGlCQUFpQixFQUFFLElBQUksQ0FBQyxJQUFJLENBQVk7YUFDekMsQ0FBQTtRQUNILENBQUM7UUFFRCxRQUFRLEVBQUU7WUFDUixhQUFhLEVBQUU7Z0JBQ2IsR0FBRztvQkFDRCxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQTtnQkFDL0IsQ0FBQztnQkFDRCxHQUFHLENBQUUsR0FBUTtvQkFDWCxJQUFJLEdBQUcsS0FBSyxJQUFJLENBQUMsaUJBQWlCO3dCQUFFLE9BQU07b0JBRTFDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxHQUFHLENBQUE7b0JBRTVCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFBO2dCQUN4QixDQUFDO2FBQ0Y7U0FDRjtRQUVELEtBQUssRUFBRTtZQUNMLENBQUMsSUFBSSxDQUFDLENBQUUsR0FBRztnQkFDVCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsR0FBRyxDQUFBO1lBQzlCLENBQUM7U0FDRjtLQUNGLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFFRCw4REFBOEQ7QUFDOUQsTUFBTSxTQUFTLEdBQUcsT0FBTyxFQUFFLENBQUE7QUFFM0IsZUFBZSxTQUFTLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWZpbmVDb21wb25lbnQsIFZ1ZUNvbnN0cnVjdG9yLCBBcHAgfSBmcm9tICd2dWUnXG5cbmV4cG9ydCB0eXBlIFByb3h5YWJsZTxUIGV4dGVuZHMgc3RyaW5nID0gJ3ZhbHVlJz4gPSBWdWVDb25zdHJ1Y3RvcjxBcHAgJiB7XG4gIGludGVybmFsTGF6eVZhbHVlOiB1bmtub3duXG4gIGludGVybmFsVmFsdWU6IHVua25vd25cbn0gJiBSZWNvcmQ8VCwgYW55Pj5cblxuZXhwb3J0IGZ1bmN0aW9uIGZhY3Rvcnk8VCBleHRlbmRzIHN0cmluZyA9ICd2YWx1ZSc+IChwcm9wPzogVCwgZXZlbnQ/OiBzdHJpbmcpOiBQcm94eWFibGU8VD5cbmV4cG9ydCBmdW5jdGlvbiBmYWN0b3J5IChcbiAgcHJvcCA9ICdtb2RlbFZhbHVlJyxcbiAgZXZlbnQgPSAndXBkYXRlOm1vZGVsVmFsdWUnXG4pIHtcbiAgcmV0dXJuIGRlZmluZUNvbXBvbmVudCh7XG4gICAgbmFtZTogJ3Byb3h5YWJsZScsXG5cbiAgICBwcm9wczoge1xuICAgICAgW3Byb3BdOiB7XG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSxcblxuICAgIGRhdGEgKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaW50ZXJuYWxMYXp5VmFsdWU6IHRoaXNbcHJvcF0gYXMgdW5rbm93bixcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY29tcHV0ZWQ6IHtcbiAgICAgIGludGVybmFsVmFsdWU6IHtcbiAgICAgICAgZ2V0ICgpOiB1bmtub3duIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbExhenlWYWx1ZVxuICAgICAgICB9LFxuICAgICAgICBzZXQgKHZhbDogYW55KSB7XG4gICAgICAgICAgaWYgKHZhbCA9PT0gdGhpcy5pbnRlcm5hbExhenlWYWx1ZSkgcmV0dXJuXG5cbiAgICAgICAgICB0aGlzLmludGVybmFsTGF6eVZhbHVlID0gdmFsXG5cbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50LCB2YWwpXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICB3YXRjaDoge1xuICAgICAgW3Byb3BdICh2YWwpIHtcbiAgICAgICAgdGhpcy5pbnRlcm5hbExhenlWYWx1ZSA9IHZhbFxuICAgICAgfSxcbiAgICB9LFxuICB9KVxufVxuXG4vKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlZGVjbGFyZSAqL1xuY29uc3QgUHJveHlhYmxlID0gZmFjdG9yeSgpXG5cbmV4cG9ydCBkZWZhdWx0IFByb3h5YWJsZVxuIl19