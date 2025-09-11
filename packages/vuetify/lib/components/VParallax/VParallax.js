import { h } from 'vue'; // Style

import "../../../src/components/VParallax/VParallax.sass"; // Mixins

import Translatable from '../../mixins/translatable';
import mixins from '../../util/mixins';
import { getSlot } from '../../util/helpers';
const baseMixins = mixins(Translatable);
/* @vue/component */

export default baseMixins.extend({
  name: 'v-parallax',
  props: {
    alt: {
      type: String,
      default: ''
    },
    height: {
      type: [String, Number],
      default: 500
    },
    src: String,
    srcset: String
  },
  data: () => ({
    isBooted: false
  }),
  computed: {
    styles() {
      return {
        display: 'block',
        opacity: this.isBooted ? 1 : 0,
        transform: `translate(-50%, ${this.parallax}px)`
      };
    }

  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      const img = this.$refs.img;
      if (!img) return;

      if (img.complete) {
        this.translate();
        this.listeners();
      } else {
        img.addEventListener('load', () => {
          this.translate();
          this.listeners();
        }, false);
      }

      this.isBooted = true;
    },

    objHeight() {
      return this.$refs.img.naturalHeight;
    }

  },

  render() {
    const imgData = {
      class: 'v-parallax__image',
      style: this.styles,
      src: this.src,
      srcset: this.srcset,
      alt: this.alt,
      ref: 'img'
    };
    const container = h('div', {
      class: 'v-parallax__image-container'
    }, [h('img', imgData)]);
    const content = h('div', {
      class: 'v-parallax__content'
    }, getSlot(this));
    return h('div', {
      class: 'v-parallax',
      style: {
        height: `${this.height}px`
      },
      ...this.$listeners
    }, [container, content]);
  }

});
//# sourceMappingURL=VParallax.js.map