import "../../../src/components/VIcon/VIcon.sass"; // Mixins

import BindsAttrs from '../../mixins/binds-attrs';
import Colorable from '../../mixins/colorable';
import Sizeable from '../../mixins/sizeable';
import Themeable from '../../mixins/themeable'; // Util

import { convertToUnit, keys, remapInternalIcon } from '../../util/helpers'; // Types

import { defineComponent, h } from 'vue';
import mixins from '../../util/mixins';
import { normalizeAttrs } from '../../util/helpers';
var SIZE_MAP;

(function (SIZE_MAP) {
  SIZE_MAP["xSmall"] = "12px";
  SIZE_MAP["small"] = "16px";
  SIZE_MAP["default"] = "24px";
  SIZE_MAP["medium"] = "28px";
  SIZE_MAP["large"] = "36px";
  SIZE_MAP["xLarge"] = "40px";
})(SIZE_MAP || (SIZE_MAP = {}));

function isFontAwesome5(iconType) {
  return ['fas', 'far', 'fal', 'fab', 'fad', 'fak'].some(val => iconType.includes(val));
}

function isSvgPath(icon) {
  return /^[mzlhvcsqta]\s*[-+.0-9][^mlhvzcsqta]+/i.test(icon) && /[\dz]$/i.test(icon) && icon.length > 4;
}

const VIcon = mixins(BindsAttrs, Colorable, Sizeable, Themeable
/* @vue/component */
).extend({
  name: 'v-icon',
  props: {
    dense: Boolean,
    disabled: Boolean,
    left: Boolean,
    right: Boolean,
    size: [Number, String],
    tag: {
      type: String,
      required: false,
      default: 'i'
    }
  },
  computed: {
    medium() {
      return false;
    },

    hasClickListener() {
      return Boolean(this.listeners$.onClick);
    }

  },
  methods: {
    getIcon() {
      let iconName = '';

      if (this.$slots.default) {
        const children = this.$slots.default()[0].children;
        if (typeof children === 'string') iconName = this.$slots.default()[0].children.trim();
      }

      return remapInternalIcon(this, iconName);
    },

    getSize() {
      const sizes = {
        xSmall: this.xSmall,
        small: this.small,
        medium: this.medium,
        large: this.large,
        xLarge: this.xLarge
      };
      const explicitSize = keys(sizes).find(key => sizes[key]);
      return explicitSize && SIZE_MAP[explicitSize] || convertToUnit(this.size);
    },

    // Component data for both font icon and SVG wrapper span
    getDefaultData() {
      const data = {
        class: {
          'v-icon--disabled': this.disabled,
          'v-icon--left': this.left,
          'v-icon--link': this.hasClickListener,
          'v-icon--right': this.right,
          'v-icon--dense': this.dense,
          'v-icon': true,
          'notranslate': true
        },
        'aria-hidden': !this.hasClickListener,
        type: this.hasClickListener ? 'button' : undefined,
        // ...this.attrs$,
        ...this.listeners$
      };

      if (this.hasClickListener && this.disabled) {
        data.disabled = true;
      }

      return data;
    },

    getSvgWrapperData() {
      const fontSize = this.getSize();
      const wrapperData = { ...this.getDefaultData(),
        style: fontSize ? {
          fontSize,
          height: fontSize,
          width: fontSize
        } : undefined
      };
      this.applyColors(wrapperData);
      return wrapperData;
    },

    applyColors(data) {
      data.class = { ...data.class,
        ...this.themeClasses
      };
      this.setTextColor(this.color, data);
    },

    renderFontIcon(icon) {
      const newChildren = [];
      let data = this.getDefaultData();
      let iconType = 'material-icons'; // Material Icon delimiter is _
      // https://material.io/icons/

      const delimiterIndex = icon.indexOf('-');
      const isMaterialIcon = delimiterIndex <= -1;

      if (isMaterialIcon) {
        // Material icon uses ligatures.
        newChildren.push(icon);
      } else {
        iconType = icon.slice(0, delimiterIndex);
        if (isFontAwesome5(iconType)) iconType = '';
      }

      if (typeof data.class === 'string') {
        data.class = data.class.split(' ').reduce((classes, className) => {
          classes[className] = true;
          return classes;
        }, {});
      }

      data.class[iconType] = true;
      data.class[icon] = !isMaterialIcon;
      const fontSize = this.getSize();
      if (fontSize) data.style = {
        fontSize
      };
      this.applyColors(data);
      return h(this.hasClickListener ? 'button' : this.tag, normalizeAttrs(data), {
        default: () => newChildren
      });
    },

    renderSvgIcon(icon) {
      const svgData = {
        class: 'v-icon__svg',
        attrs: {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 24 24',
          role: 'img',
          'aria-hidden': true
        }
      };
      const size = this.getSize();

      if (size) {
        svgData.style = {
          fontSize: size,
          height: size,
          width: size
        };
      }

      return h(this.hasClickListener ? 'button' : 'span', this.getSvgWrapperData(), [h('svg', svgData, [h('path', {
        attrs: {
          d: icon
        }
      })])]);
    },

    renderSvgIconComponent(icon) {
      const data = {
        class: {
          'v-icon__component': true
        }
      };
      const size = this.getSize();

      if (size) {
        data.style = {
          fontSize: size,
          height: size,
          width: size
        };
      }

      this.applyColors(data);
      const component = icon.component;
      data.props = icon.props;
      data.nativeOn = data.on;
      return h(this.hasClickListener ? 'button' : 'span', this.getSvgWrapperData(), {
        default: () => [h(component, data)]
      });
    }

  },

  render() {
    const icon = this.getIcon();

    if (typeof icon === 'string') {
      if (isSvgPath(icon)) {
        return this.renderSvgIcon(icon);
      }

      return this.renderFontIcon(icon);
    }

    return this.renderSvgIconComponent(icon);
  }

});
export default defineComponent({
  name: 'v-icon',
  $_wrapperFor: VIcon,
  functional: true,

  mounted() {
    this.$el.innerHTML = '';
  },

  render() {
    const data = { ...this.$attrs
    }; // console.log(children && children[0]?.children)

    return h(VIcon, data, {
      default: () => {
        var _a, _b, _c, _d;

        let iconName = ''; // Support usage of v-text and v-html
        // if (data.domProps) {

        if ((_a = this.$.vnode.props) === null || _a === void 0 ? void 0 : _a.textContent) {
          iconName = this.$.vnode.props.textContent || this.$.vnode.props.innerHTML || iconName;
        }

        const children = (_c = (_b = this.$slots).default) === null || _c === void 0 ? void 0 : _c.call(_b);
        return iconName ? [iconName] : children && ((_d = children[0]) === null || _d === void 0 ? void 0 : _d.children);
      }
    });
  }

});
//# sourceMappingURL=VIcon.js.map