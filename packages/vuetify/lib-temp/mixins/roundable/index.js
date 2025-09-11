import { defineComponent } from 'vue';
/* @vue/component */
export default defineComponent({
    name: 'roundable',
    props: {
        rounded: [Boolean, String],
        tile: Boolean,
    },
    computed: {
        roundedClasses() {
            const composite = [];
            const rounded = typeof this.rounded === 'string'
                ? String(this.rounded)
                : this.rounded === true;
            if (this.tile) {
                composite.push('rounded-0');
            }
            else if (typeof rounded === 'string') {
                const values = rounded.split(' ');
                for (const value of values) {
                    composite.push(`rounded-${value}`);
                }
            }
            else if (rounded) {
                composite.push('rounded');
            }
            return composite.length > 0 ? {
                [composite.join(' ')]: true,
            } : {};
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3JvdW5kYWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sS0FBSyxDQUFBO0FBRW5DLG9CQUFvQjtBQUNwQixlQUFlLGVBQWUsQ0FBQztJQUM3QixJQUFJLEVBQUUsV0FBVztJQUVqQixLQUFLLEVBQUU7UUFDTCxPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO1FBQzFCLElBQUksRUFBRSxPQUFPO0tBQ2Q7SUFFRCxRQUFRLEVBQUU7UUFDUixjQUFjO1lBQ1osTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFBO1lBQ3BCLE1BQU0sT0FBTyxHQUFHLE9BQU8sSUFBSSxDQUFDLE9BQU8sS0FBSyxRQUFRO2dCQUM5QyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ3RCLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQTtZQUV6QixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ2IsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTthQUM1QjtpQkFBTSxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtnQkFDdEMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFFakMsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLEVBQUU7b0JBQzFCLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxLQUFLLEVBQUUsQ0FBQyxDQUFBO2lCQUNuQzthQUNGO2lCQUFNLElBQUksT0FBTyxFQUFFO2dCQUNsQixTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO2FBQzFCO1lBRUQsT0FBTyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUk7YUFDNUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO1FBQ1IsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtkZWZpbmVDb21wb25lbnR9IGZyb20gJ3Z1ZSdcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XG4gIG5hbWU6ICdyb3VuZGFibGUnLFxuXG4gIHByb3BzOiB7XG4gICAgcm91bmRlZDogW0Jvb2xlYW4sIFN0cmluZ10sXG4gICAgdGlsZTogQm9vbGVhbixcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIHJvdW5kZWRDbGFzc2VzICgpOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiB7XG4gICAgICBjb25zdCBjb21wb3NpdGUgPSBbXVxuICAgICAgY29uc3Qgcm91bmRlZCA9IHR5cGVvZiB0aGlzLnJvdW5kZWQgPT09ICdzdHJpbmcnXG4gICAgICAgID8gU3RyaW5nKHRoaXMucm91bmRlZClcbiAgICAgICAgOiB0aGlzLnJvdW5kZWQgPT09IHRydWVcblxuICAgICAgaWYgKHRoaXMudGlsZSkge1xuICAgICAgICBjb21wb3NpdGUucHVzaCgncm91bmRlZC0wJylcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHJvdW5kZWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IHJvdW5kZWQuc3BsaXQoJyAnKVxuXG4gICAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICAgICAgY29tcG9zaXRlLnB1c2goYHJvdW5kZWQtJHt2YWx1ZX1gKVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHJvdW5kZWQpIHtcbiAgICAgICAgY29tcG9zaXRlLnB1c2goJ3JvdW5kZWQnKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29tcG9zaXRlLmxlbmd0aCA+IDAgPyB7XG4gICAgICAgIFtjb21wb3NpdGUuam9pbignICcpXTogdHJ1ZSxcbiAgICAgIH0gOiB7fVxuICAgIH0sXG4gIH0sXG59KVxuIl19