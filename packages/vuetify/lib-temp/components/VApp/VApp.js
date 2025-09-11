// Styles
import './VApp.sass';
// Mixins
import Themeable from '../../mixins/themeable';
import { getSlot } from '../../util/helpers';
import { h } from 'vue';
/* @vue/component */
export default {
    name: 'v-app',
    mixins: [
        Themeable
    ],
    props: {
        dark: {
            type: Boolean,
            default: undefined,
        },
        id: {
            type: String,
            default: 'app',
        },
        light: {
            type: Boolean,
            default: undefined,
        },
    },
    computed: {
        isDark() {
            return this.$vuetify.theme.dark;
        },
    },
    beforeCreate() {
        if (!this.$vuetify || (this.$vuetify === this.$root)) {
            throw new Error('Vuetify is not properly initialized, see https://v2.vuetifyjs.com/getting-started/quick-start#bootstrapping-the-vuetify-object');
        }
    },
    render() {
        const wrapper = h('div', { class: 'v-application--wrap' }, getSlot(this));
        return h('div', {
            class: {
                'v-application': true,
                'v-application--is-rtl': this.$vuetify.rtl,
                'v-application--is-ltr': !this.$vuetify.rtl,
                ...this.themeClasses,
            },
            'data-app': true,
            id: this.id,
        }, [wrapper]);
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZBcHAvVkFwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxhQUFhLENBQUE7QUFFcEIsU0FBUztBQUNULE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBSTlDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUM1QyxPQUFPLEVBQUMsQ0FBQyxFQUFDLE1BQU0sS0FBSyxDQUFBO0FBRXJCLG9CQUFvQjtBQUNwQixlQUFlO0lBQ2IsSUFBSSxFQUFFLE9BQU87SUFDYixNQUFNLEVBQUU7UUFDTixTQUFTO0tBQ1Y7SUFFRCxLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxTQUFTO1NBQ25CO1FBQ0QsRUFBRSxFQUFFO1lBQ0YsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsS0FBSztTQUNmO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsU0FBUztTQUNuQjtLQUNGO0lBRUQsUUFBUSxFQUFFO1FBQ1IsTUFBTTtZQUNKLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFBO1FBQ2pDLENBQUM7S0FDRjtJQUVELFlBQVk7UUFDVixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLEtBQVksQ0FBQyxFQUFFO1lBQzNELE1BQU0sSUFBSSxLQUFLLENBQUMsZ0lBQWdJLENBQUMsQ0FBQTtTQUNsSjtJQUNILENBQUM7SUFFRCxNQUFNO1FBQ0osTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxxQkFBcUIsRUFBRSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBRXpFLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUNkLEtBQUssRUFBRTtnQkFDTCxlQUFlLEVBQUUsSUFBSTtnQkFDckIsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHO2dCQUMxQyx1QkFBdUIsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRztnQkFDM0MsR0FBRyxJQUFJLENBQUMsWUFBWTthQUNyQjtZQUNELFVBQVUsRUFBRSxJQUFJO1lBQ2hCLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTtTQUNaLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBQ2YsQ0FBQztDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcbmltcG9ydCAnLi9WQXBwLnNhc3MnXG5cbi8vIE1peGluc1xuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgeyBnZXRTbG90IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IHtofSBmcm9tICd2dWUnXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICd2LWFwcCcsXG4gIG1peGluczogW1xuICAgIFRoZW1lYWJsZVxuICBdLFxuXG4gIHByb3BzOiB7XG4gICAgZGFyazoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICB9LFxuICAgIGlkOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnYXBwJyxcbiAgICB9LFxuICAgIGxpZ2h0OiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgIH0sXG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBpc0RhcmsgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuJHZ1ZXRpZnkudGhlbWUuZGFya1xuICAgIH0sXG4gIH0sXG5cbiAgYmVmb3JlQ3JlYXRlICgpIHtcbiAgICBpZiAoIXRoaXMuJHZ1ZXRpZnkgfHwgKHRoaXMuJHZ1ZXRpZnkgPT09IHRoaXMuJHJvb3QgYXMgYW55KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdWdWV0aWZ5IGlzIG5vdCBwcm9wZXJseSBpbml0aWFsaXplZCwgc2VlIGh0dHBzOi8vdjIudnVldGlmeWpzLmNvbS9nZXR0aW5nLXN0YXJ0ZWQvcXVpY2stc3RhcnQjYm9vdHN0cmFwcGluZy10aGUtdnVldGlmeS1vYmplY3QnKVxuICAgIH1cbiAgfSxcblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IHdyYXBwZXIgPSBoKCdkaXYnLCB7IGNsYXNzOiAndi1hcHBsaWNhdGlvbi0td3JhcCcgfSwgZ2V0U2xvdCh0aGlzKSlcblxuICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICBjbGFzczoge1xuICAgICAgICAndi1hcHBsaWNhdGlvbic6IHRydWUsXG4gICAgICAgICd2LWFwcGxpY2F0aW9uLS1pcy1ydGwnOiB0aGlzLiR2dWV0aWZ5LnJ0bCxcbiAgICAgICAgJ3YtYXBwbGljYXRpb24tLWlzLWx0cic6ICF0aGlzLiR2dWV0aWZ5LnJ0bCxcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXMsXG4gICAgICB9LFxuICAgICAgJ2RhdGEtYXBwJzogdHJ1ZSxcbiAgICAgIGlkOiB0aGlzLmlkLFxuICAgIH0sIFt3cmFwcGVyXSlcbiAgfSxcbn1cbiJdfQ==