import { defineComponent } from 'vue';
export default defineComponent({
    name: 'localable',
    props: {
        locale: String,
    },
    computed: {
        currentLocale() {
            return this.locale || this.$vuetify.lang.current;
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2xvY2FsYWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sS0FBSyxDQUFBO0FBRW5DLGVBQWUsZUFBZSxDQUFDO0lBQzdCLElBQUksRUFBRSxXQUFXO0lBRWpCLEtBQUssRUFBRTtRQUNMLE1BQU0sRUFBRSxNQUFNO0tBQ2Y7SUFFRCxRQUFRLEVBQUU7UUFDUixhQUFhO1lBQ1gsT0FBTyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQTtRQUNsRCxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2RlZmluZUNvbXBvbmVudH0gZnJvbSAndnVlJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb21wb25lbnQoe1xuICBuYW1lOiAnbG9jYWxhYmxlJyxcblxuICBwcm9wczoge1xuICAgIGxvY2FsZTogU3RyaW5nLFxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY3VycmVudExvY2FsZSAoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiB0aGlzLmxvY2FsZSB8fCB0aGlzLiR2dWV0aWZ5LmxhbmcuY3VycmVudFxuICAgIH0sXG4gIH0sXG59KVxuIl19