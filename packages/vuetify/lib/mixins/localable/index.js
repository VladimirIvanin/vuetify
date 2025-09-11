import { defineComponent } from 'vue';
export default defineComponent({
  name: 'localable',
  props: {
    locale: String
  },
  computed: {
    currentLocale() {
      return this.locale || this.$vuetify.lang.current;
    }

  }
});
//# sourceMappingURL=index.js.map