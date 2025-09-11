import "../../../src/components/VGrid/_grid.sass";
import "../../../src/components/VGrid/VGrid.sass";
import Grid from './grid';
import mergeData from '../../util/mergeData';
import { defineComponent, h } from 'vue';
/* @vue/component */

export default defineComponent({
  name: 'v-container',
  extends: Grid('container'),
  functional: true,
  props: {
    id: String,
    tag: {
      type: String,
      default: 'div'
    },
    fluid: {
      type: Boolean,
      default: false
    }
  },

  render() {
    var _a, _b;

    let classes; // const { attrs } = data

    const attrs = this.$attrs;

    if (attrs) {
      // reset attrs to extract utility clases like pa-3
      classes = Object.keys(attrs).filter(key => {
        // TODO: Remove once resolved
        // https://github.com/vuejs/vue/issues/7841
        if (key === 'slot') return false;
        const value = attrs[key]; // add back data attributes like data-test="foo" but do not
        // add them as classes

        if (key.startsWith('data-')) {
          // data.attrs![key] = value
          return false;
        }

        return value || typeof value === 'string';
      });
    } // if (props.id) {
    //   data.domProps = data.domProps || {}
    //   data.domProps.id = props.id
    // }


    return h(this.tag, mergeData(this.$attrs, {
      class: Array({
        'container--fluid': this.fluid
      }).concat(classes || []).concat('container')
    }), (_b = (_a = this.$slots).default) === null || _b === void 0 ? void 0 : _b.call(_a));
  }

});
//# sourceMappingURL=VContainer.js.map