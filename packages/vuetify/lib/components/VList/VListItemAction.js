// Types
import { defineComponent, h, Comment } from 'vue';
/* @vue/component */

export default defineComponent({
  name: 'v-list-item-action',

  render() {
    var _a, _b;

    const {
      class: attrClass,
      ...otherAttrs
    } = this.$attrs;
    let className = attrClass ? `v-list-item__action ${attrClass}` : 'v-list-item__action';
    const children = ((_b = (_a = this.$slots).default) === null || _b === void 0 ? void 0 : _b.call(_a)) || [];
    const filteredChild = children.filter(vnode => {
      return (vnode === null || vnode === void 0 ? void 0 : vnode.type) !== Comment && (vnode === null || vnode === void 0 ? void 0 : vnode.children) !== ' ';
    });
    if (filteredChild.length > 1) className += ' v-list-item__action--stack';
    return h('div', { ...otherAttrs,
      class: className
    }, children);
  }

});
//# sourceMappingURL=VListItemAction.js.map