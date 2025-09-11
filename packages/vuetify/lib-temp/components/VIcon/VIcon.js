import './VIcon.sass';
// Mixins
import BindsAttrs from '../../mixins/binds-attrs';
import Colorable from '../../mixins/colorable';
import Sizeable from '../../mixins/sizeable';
import Themeable from '../../mixins/themeable';
// Util
import { convertToUnit, keys, remapInternalIcon } from '../../util/helpers';
// Types
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
    return (/^[mzlhvcsqta]\s*[-+.0-9][^mlhvzcsqta]+/i.test(icon) && /[\dz]$/i.test(icon) && icon.length > 4);
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
            default: 'i',
        },
    },
    computed: {
        medium() {
            return false;
        },
        hasClickListener() {
            return Boolean(this.listeners$.onClick);
        },
    },
    methods: {
        getIcon() {
            let iconName = '';
            if (this.$slots.default) {
                const children = this.$slots.default()[0].children;
                if (typeof children === 'string')
                    iconName = this.$slots.default()[0].children.trim();
            }
            return remapInternalIcon(this, iconName);
        },
        getSize() {
            const sizes = {
                xSmall: this.xSmall,
                small: this.small,
                medium: this.medium,
                large: this.large,
                xLarge: this.xLarge,
            };
            const explicitSize = keys(sizes).find(key => sizes[key]);
            return ((explicitSize && SIZE_MAP[explicitSize]) || convertToUnit(this.size));
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
                ...this.listeners$,
            };
            if (this.hasClickListener && this.disabled) {
                data.disabled = true;
            }
            return data;
        },
        getSvgWrapperData() {
            const fontSize = this.getSize();
            const wrapperData = {
                ...this.getDefaultData(),
                style: fontSize ? {
                    fontSize,
                    height: fontSize,
                    width: fontSize,
                } : undefined,
            };
            this.applyColors(wrapperData);
            return wrapperData;
        },
        applyColors(data) {
            data.class = { ...data.class, ...this.themeClasses };
            this.setTextColor(this.color, data);
        },
        renderFontIcon(icon) {
            const newChildren = [];
            let data = this.getDefaultData();
            let iconType = 'material-icons';
            // Material Icon delimiter is _
            // https://material.io/icons/
            const delimiterIndex = icon.indexOf('-');
            const isMaterialIcon = delimiterIndex <= -1;
            if (isMaterialIcon) {
                // Material icon uses ligatures.
                newChildren.push(icon);
            }
            else {
                iconType = icon.slice(0, delimiterIndex);
                if (isFontAwesome5(iconType))
                    iconType = '';
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
            if (fontSize)
                data.style = { fontSize };
            this.applyColors(data);
            return h(this.hasClickListener ? 'button' : this.tag, normalizeAttrs(data), { default: () => newChildren });
        },
        renderSvgIcon(icon) {
            const svgData = {
                class: 'v-icon__svg',
                attrs: {
                    xmlns: 'http://www.w3.org/2000/svg',
                    viewBox: '0 0 24 24',
                    role: 'img',
                    'aria-hidden': true,
                },
            };
            const size = this.getSize();
            if (size) {
                svgData.style = {
                    fontSize: size,
                    height: size,
                    width: size,
                };
            }
            return h(this.hasClickListener ? 'button' : 'span', this.getSvgWrapperData(), [
                h('svg', svgData, [
                    h('path', {
                        attrs: {
                            d: icon,
                        },
                    }),
                ]),
            ]);
        },
        renderSvgIconComponent(icon) {
            const data = {
                class: {
                    'v-icon__component': true,
                },
            };
            const size = this.getSize();
            if (size) {
                data.style = {
                    fontSize: size,
                    height: size,
                    width: size,
                };
            }
            this.applyColors(data);
            const component = icon.component;
            data.props = icon.props;
            data.nativeOn = data.on;
            return h(this.hasClickListener ? 'button' : 'span', this.getSvgWrapperData(), { default: () => [
                    h(component, data),
                ] });
        },
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
    },
});
export default defineComponent({
    name: 'v-icon',
    $_wrapperFor: VIcon,
    functional: true,
    mounted() {
        this.$el.innerHTML = '';
    },
    render() {
        const data = { ...this.$attrs };
        // console.log(children && children[0]?.children)
        return h(VIcon, data, {
            default: () => {
                var _a, _b, _c, _d;
                let iconName = '';
                // Support usage of v-text and v-html
                // if (data.domProps) {
                if ((_a = this.$.vnode.props) === null || _a === void 0 ? void 0 : _a.textContent) {
                    iconName = this.$.vnode.props.textContent ||
                        this.$.vnode.props.innerHTML ||
                        iconName;
                }
                const children = (_c = (_b = this.$slots).default) === null || _c === void 0 ? void 0 : _c.call(_b);
                return iconName ? [iconName] : children && ((_d = children[0]) === null || _d === void 0 ? void 0 : _d.children);
            }
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkljb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WSWNvbi9WSWNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLGNBQWMsQ0FBQTtBQUVyQixTQUFTO0FBQ1QsT0FBTyxVQUFVLE1BQU0sMEJBQTBCLENBQUE7QUFDakQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxRQUFRLE1BQU0sdUJBQXVCLENBQUE7QUFDNUMsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsT0FBTztBQUNQLE9BQU8sRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFM0UsUUFBUTtBQUNSLE9BQU8sRUFBRSxlQUFlLEVBQWtELENBQUMsRUFBRSxNQUFNLEtBQUssQ0FBQTtBQUN4RixPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUV0QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFbkQsSUFBSyxRQU9KO0FBUEQsV0FBSyxRQUFRO0lBQ1gsMkJBQWUsQ0FBQTtJQUNmLDBCQUFjLENBQUE7SUFDZCw0QkFBZ0IsQ0FBQTtJQUNoQiwyQkFBZSxDQUFBO0lBQ2YsMEJBQWMsQ0FBQTtJQUNkLDJCQUFlLENBQUE7QUFDakIsQ0FBQyxFQVBJLFFBQVEsS0FBUixRQUFRLFFBT1o7QUFFRCxTQUFTLGNBQWMsQ0FBRSxRQUFnQjtJQUN2QyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDdkYsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUFFLElBQVk7SUFDOUIsT0FBTyxDQUFDLHlDQUF5QyxD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akQsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtZQUNwQixPQUFPLEVBQUUsR0FBRyxFQUFFOztnQkFDWixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUE7Z0JBRWpCLHFDQUFxQztnQkFDckMsdUJBQXVCO2dCQUN2QixJQUFHLE1BQUEsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSywwQ0FBRSxXQUFXLEVBQUU7b0JBQ2xDLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVzt3QkFDekMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVM7d0JBQzFCLFFBQVEsQ0FBQTtpQkFDWDtnQkFFRCxNQUFNLFFBQVEsR0FBRyxNQUFBLE1BQUEsSUFBSSxDQUFDLE1BQU0sRUFBQyxPQUFPLGtEQUFJLENBQUE7Z0JBRXhDLE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEtBQUksTUFBQSxRQUFRLENBQUMsQ0FBQyxDQUFDLDBDQUFFLFFBQVEsQ0FBQSxDQUFBO1lBQ2xFLENBQUM7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL1ZJY29uLnNhc3MnXG5cbi8vIE1peGluc1xuaW1wb3J0IEJpbmRzQXR0cnMgZnJvbSAnLi4vLi4vbWl4aW5zL2JpbmRzLWF0dHJzJ1xuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xuaW1wb3J0IFNpemVhYmxlIGZyb20gJy4uLy4uL21peGlucy9zaXplYWJsZSdcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcblxuLy8gVXRpbFxuaW1wb3J0IHsgY29udmVydFRvVW5pdCwga2V5cywgcmVtYXBJbnRlcm5hbEljb24gfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBkZWZpbmVDb21wb25lbnQsIENyZWF0ZUVsZW1lbnQsIFZOb2RlLCBWTm9kZUNoaWxkcmVuLCBWTm9kZURhdGEsIGggfSBmcm9tICd2dWUnXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuaW1wb3J0IHsgVnVldGlmeUljb24sIFZ1ZXRpZnlJY29uQ29tcG9uZW50IH0gZnJvbSAndnVldGlmeS90eXBlcy9zZXJ2aWNlcy9pY29ucydcbmltcG9ydCB7IG5vcm1hbGl6ZUF0dHJzIH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuXG5lbnVtIFNJWkVfTUFQIHtcbiAgeFNtYWxsID0gJzEycHgnLFxuICBzbWFsbCA9ICcxNnB4JyxcbiAgZGVmYXVsdCA9ICcyNHB4JyxcbiAgbWVkaXVtID0gJzI4cHgnLFxuICBsYXJnZSA9ICczNnB4JyxcbiAgeExhcmdlID0gJzQwcHgnXG59XG5cbmZ1bmN0aW9uIGlzRm9udEF3ZXNvbWU1IChpY29uVHlwZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBbJ2ZhcycsICdmYXInLCAnZmFsJywgJ2ZhYicsICdmYWQnLCAnZmFrJ10uc29tZSh2YWwgPT4gaWNvblR5cGUuaW5jbHVkZXModmFsKSlcbn1cblxuZnVuY3Rpb24gaXNTdmdQYXRoIChpY29uOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuICgvXlttemxodmNzcXRhXVxccypbLSsuMC05XVtebWxodnpjc3F0YV0rL2kudGVzdChpY29uKSAmJiAvW1xcZHpdJC9pLnRlc3QoaWNvbikgJiYgaWNvbi5sZW5ndGggPiA0KVxufVxuXG5cbmNvbnN0IFZJY29uID0gbWl4aW5zKFxuICBCaW5kc0F0dHJzLFxuICBDb2xvcmFibGUsXG4gIFNpemVhYmxlLFxuICBUaGVtZWFibGVcbiAgLyogQHZ1ZS9jb21wb25lbnQgKi9cbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtaWNvbicsXG5cbiAgcHJvcHM6IHtcbiAgICBkZW5zZTogQm9vbGVhbixcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcbiAgICBsZWZ0OiBCb29sZWFuLFxuICAgIHJpZ2h0OiBCb29sZWFuLFxuICAgIHNpemU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgdGFnOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICBkZWZhdWx0OiAnaScsXG4gICAgfSxcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIG1lZGl1bSAoKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9LFxuICAgIGhhc0NsaWNrTGlzdGVuZXIgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIEJvb2xlYW4oXG4gICAgICAgIHRoaXMubGlzdGVuZXJzJC5vbkNsaWNrXG4gICAgICApXG4gICAgfSxcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2V0SWNvbiAoKTogVnVldGlmeUljb24ge1xuICAgICAgbGV0IGljb25OYW1lID0gJydcbiAgICAgIGlmICh0aGlzLiRzbG90cy5kZWZhdWx0KSB7XG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy4kc2xvdHMuZGVmYXVsdCgpWzBdLmNoaWxkcmVuXG4gICAgICAgIGlmKHR5cGVvZiBjaGlsZHJlbiA9PT0gJ3N0cmluZycpXG4gICAgICAgICAgaWNvbk5hbWUgPSB0aGlzLiRzbG90cy5kZWZhdWx0KClbMF0uY2hpbGRyZW4hLnRyaW0oKVxuXG4gICAgICB9XG4gICAgICByZXR1cm4gcmVtYXBJbnRlcm5hbEljb24odGhpcywgaWNvbk5hbWUpXG4gICAgfSxcbiAgICBnZXRTaXplICgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgY29uc3Qgc2l6ZXMgPSB7XG4gICAgICAgIHhTbWFsbDogdGhpcy54U21hbGwsXG4gICAgICAgIHNtYWxsOiB0aGlzLnNtYWxsLFxuICAgICAgICBtZWRpdW06IHRoaXMubWVkaXVtLFxuICAgICAgICBsYXJnZTogdGhpcy5sYXJnZSxcbiAgICAgICAgeExhcmdlOiB0aGlzLnhMYXJnZSxcbiAgICAgIH1cblxuICAgICAgY29uc3QgZXhwbGljaXRTaXplID0ga2V5cyhzaXplcykuZmluZChrZXkgPT4gc2l6ZXNba2V5XSlcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgKGV4cGxpY2l0U2l6ZSAmJiBTSVpFX01BUFtleHBsaWNpdFNpemVdKSB8fCBjb252ZXJ0VG9Vbml0KHRoaXMuc2l6ZSlcbiAgICAgIClcbiAgICB9LFxuICAgIC8vIENvbXBvbmVudCBkYXRhIGZvciBib3RoIGZvbnQgaWNvbiBhbmQgU1ZHIHdyYXBwZXIgc3BhblxuICAgIGdldERlZmF1bHREYXRhICgpOiBWTm9kZURhdGEge1xuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgY2xhc3M6IHtcbiAgICAgICAgICAndi1pY29uLS1kaXNhYmxlZCc6IHRoaXMuZGlzYWJsZWQsXG4gICAgICAgICAgJ3YtaWNvbi0tbGVmdCc6IHRoaXMubGVmdCxcbiAgICAgICAgICAndi1pY29uLS1saW5rJzogdGhpcy5oYXNDbGlja0xpc3RlbmVyLFxuICAgICAgICAgICd2LWljb24tLXJpZ2h0JzogdGhpcy5yaWdodCxcbiAgICAgICAgICAndi1pY29uLS1kZW5zZSc6IHRoaXMuZGVuc2UsXG4gICAgICAgICAgJ3YtaWNvbic6IHRydWUsXG4gICAgICAgICAgJ25vdHJhbnNsYXRlJzogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnYXJpYS1oaWRkZW4nOiAhdGhpcy5oYXNDbGlja0xpc3RlbmVyLFxuICAgICAgICB0eXBlOiB0aGlzLmhhc0NsaWNrTGlzdGVuZXIgPyAnYnV0dG9uJyA6IHVuZGVmaW5lZCxcbiAgICAgICAgLy8gLi4udGhpcy5hdHRycyQsXG4gICAgICAgIC4uLnRoaXMubGlzdGVuZXJzJCxcbiAgICAgIH1cblxuICAgICAgaWYodGhpcy5oYXNDbGlja0xpc3RlbmVyICYmIHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgZGF0YS5kaXNhYmxlZCA9IHRydWVcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYXRhXG4gICAgfSxcbiAgICBnZXRTdmdXcmFwcGVyRGF0YSAoKSB7XG4gICAgICBjb25zdCBmb250U2l6ZSA9IHRoaXMuZ2V0U2l6ZSgpXG4gICAgICBjb25zdCB3cmFwcGVyRGF0YSA9IHtcbiAgICAgICAgLi4udGhpcy5nZXREZWZhdWx0RGF0YSgpLFxuICAgICAgICBzdHlsZTogZm9udFNpemUgPyB7XG4gICAgICAgICAgZm9udFNpemUsXG4gICAgICAgICAgaGVpZ2h0OiBmb250U2l6ZSxcbiAgICAgICAgICB3aWR0aDogZm9udFNpemUsXG4gICAgICAgIH0gOiB1bmRlZmluZWQsXG4gICAgICB9XG4gICAgICB0aGlzLmFwcGx5Q29sb3JzKHdyYXBwZXJEYXRhKVxuXG4gICAgICByZXR1cm4gd3JhcHBlckRhdGFcbiAgICB9LFxuICAgIGFwcGx5Q29sb3JzIChkYXRhOiBWTm9kZURhdGEpOiB2b2lkIHtcbiAgICAgIGRhdGEuY2xhc3MgPSB7IC4uLmRhdGEuY2xhc3MsIC4uLnRoaXMudGhlbWVDbGFzc2VzIH1cbiAgICAgIHRoaXMuc2V0VGV4dENvbG9yKHRoaXMuY29sb3IsIGRhdGEpXG4gICAgfSxcbiAgICByZW5kZXJGb250SWNvbiAoaWNvbjogc3RyaW5nKTogVk5vZGUge1xuICAgICAgY29uc3QgbmV3Q2hpbGRyZW46IFZOb2RlQ2hpbGRyZW4gPSBbXVxuICAgICAgbGV0IGRhdGEgPSB0aGlzLmdldERlZmF1bHREYXRhKClcblxuICAgICAgbGV0IGljb25UeXBlID0gJ21hdGVyaWFsLWljb25zJ1xuICAgICAgLy8gTWF0ZXJpYWwgSWNvbiBkZWxpbWl0ZXIgaXMgX1xuICAgICAgLy8gaHR0cHM6Ly9tYXRlcmlhbC5pby9pY29ucy9cbiAgICAgIGNvbnN0IGRlbGltaXRlckluZGV4ID0gaWNvbi5pbmRleE9mKCctJylcbiAgICAgIGNvbnN0IGlzTWF0ZXJpYWxJY29uID0gZGVsaW1pdGVySW5kZXggPD0gLTFcblxuICAgICAgaWYgKGlzTWF0ZXJpYWxJY29uKSB7XG4gICAgICAgIC8vIE1hdGVyaWFsIGljb24gdXNlcyBsaWdhdHVyZXMuXG4gICAgICAgIG5ld0NoaWxkcmVuLnB1c2goaWNvbilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGljb25UeXBlID0gaWNvbi5zbGljZSgwLCBkZWxpbWl0ZXJJbmRleClcbiAgICAgICAgaWYgKGlzRm9udEF3ZXNvbWU1KGljb25UeXBlKSkgaWNvblR5cGUgPSAnJ1xuICAgICAgfVxuXG4gICAgICBpZih0eXBlb2YgZGF0YS5jbGFzcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgZGF0YS5jbGFzcyA9IGRhdGEuY2xhc3Muc3BsaXQoJyAnKS5yZWR1Y2UoKGNsYXNzZXMsIGNsYXNzTmFtZSkgPT4ge1xuICAgICAgICAgIGNsYXNzZXNbY2xhc3NOYW1lXSA9IHRydWVcbiAgICAgICAgICByZXR1cm4gY2xhc3Nlc1xuICAgICAgICB9LCB7fSlcbiAgICAgIH1cblxuICAgICAgZGF0YS5jbGFzc1tpY29uVHlwZV0gPSB0cnVlXG4gICAgICBkYXRhLmNsYXNzW2ljb25dID0gIWlzTWF0ZXJpYWxJY29uXG5cbiAgICAgIGNvbnN0IGZvbnRTaXplID0gdGhpcy5nZXRTaXplKClcbiAgICAgIGlmIChmb250U2l6ZSkgZGF0YS5zdHlsZSA9IHsgZm9udFNpemUgfVxuXG4gICAgICB0aGlzLmFwcGx5Q29sb3JzKGRhdGEpXG5cbiAgICAgIHJldHVybiBoKHRoaXMuaGFzQ2xpY2tMaXN0ZW5lciA/ICdidXR0b24nIDogdGhpcy50YWcsIG5vcm1hbGl6ZUF0dHJzKGRhdGEpLCB7ZGVmYXVsdDogKCkgPT4gbmV3Q2hpbGRyZW59KVxuICAgIH0sXG4gICAgcmVuZGVyU3ZnSWNvbiAoaWNvbjogc3RyaW5nKTogVk5vZGUge1xuICAgICAgY29uc3Qgc3ZnRGF0YTogVk5vZGVEYXRhID0ge1xuICAgICAgICBjbGFzczogJ3YtaWNvbl9fc3ZnJyxcbiAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICB4bWxuczogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyxcbiAgICAgICAgICB2aWV3Qm94OiAnMCAwIDI0IDI0JyxcbiAgICAgICAgICByb2xlOiAnaW1nJyxcbiAgICAgICAgICAnYXJpYS1oaWRkZW4nOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICBjb25zdCBzaXplID0gdGhpcy5nZXRTaXplKClcbiAgICAgIGlmIChzaXplKSB7XG4gICAgICAgIHN2Z0RhdGEuc3R5bGUgPSB7XG4gICAgICAgICAgZm9udFNpemU6IHNpemUsXG4gICAgICAgICAgaGVpZ2h0OiBzaXplLFxuICAgICAgICAgIHdpZHRoOiBzaXplLFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoKHRoaXMuaGFzQ2xpY2tMaXN0ZW5lciA/ICdidXR0b24nIDogJ3NwYW4nLCB0aGlzLmdldFN2Z1dyYXBwZXJEYXRhKCksIFtcbiAgICAgICAgaCgnc3ZnJywgc3ZnRGF0YSwgW1xuICAgICAgICAgIGgoJ3BhdGgnLCB7XG4gICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICBkOiBpY29uLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSksXG4gICAgICBdKVxuICAgIH0sXG4gICAgcmVuZGVyU3ZnSWNvbkNvbXBvbmVudCAoXG4gICAgICBpY29uOiBWdWV0aWZ5SWNvbkNvbXBvbmVudFxuICAgICk6IFZOb2RlIHtcbiAgICAgIGNvbnN0IGRhdGE6IFZOb2RlRGF0YSA9IHtcbiAgICAgICAgY2xhc3M6IHtcbiAgICAgICAgICAndi1pY29uX19jb21wb25lbnQnOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICBjb25zdCBzaXplID0gdGhpcy5nZXRTaXplKClcbiAgICAgIGlmIChzaXplKSB7XG4gICAgICAgIGRhdGEuc3R5bGUgPSB7XG4gICAgICAgICAgZm9udFNpemU6IHNpemUsXG4gICAgICAgICAgaGVpZ2h0OiBzaXplLFxuICAgICAgICAgIHdpZHRoOiBzaXplLFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXBwbHlDb2xvcnMoZGF0YSlcblxuICAgICAgY29uc3QgY29tcG9uZW50ID0gaWNvbi5jb21wb25lbnRcbiAgICAgIGRhdGEucHJvcHMgPSBpY29uLnByb3BzXG4gICAgICBkYXRhLm5hdGl2ZU9uID0gZGF0YS5vblxuXG4gICAgICByZXR1cm4gaCh0aGlzLmhhc0NsaWNrTGlzdGVuZXIgPyAnYnV0dG9uJyA6ICdzcGFuJywgdGhpcy5nZXRTdmdXcmFwcGVyRGF0YSgpLCB7ZGVmYXVsdDogKCkgPT5bXG4gICAgICAgIGgoY29tcG9uZW50LCBkYXRhKSxcbiAgICAgIF19KVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgY29uc3QgaWNvbiA9IHRoaXMuZ2V0SWNvbigpXG5cbiAgICBpZiAodHlwZW9mIGljb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoaXNTdmdQYXRoKGljb24pKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlclN2Z0ljb24oaWNvbilcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnJlbmRlckZvbnRJY29uKGljb24pXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucmVuZGVyU3ZnSWNvbkNvbXBvbmVudChpY29uKVxuICB9LFxufSlcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29tcG9uZW50KHtcbiAgbmFtZTogJ3YtaWNvbicsXG5cbiAgJF93cmFwcGVyRm9yOiBWSWNvbixcblxuICBmdW5jdGlvbmFsOiB0cnVlLFxuXG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy4kZWwuaW5uZXJIVE1MID0gJydcbiAgfSxcblxuICByZW5kZXIgKCk6IFZOb2RlIHtcbiAgICBjb25zdCBkYXRhID0geyAuLi50aGlzLiRhdHRycyB9XG5cblxuICAgIC8vIGNvbnNvbGUubG9nKGNoaWxkcmVuICYmIGNoaWxkcmVuWzBdPy5jaGlsZHJlbilcbiAgICByZXR1cm4gaChWSWNvbiwgZGF0YSwge1xuICAgICAgZGVmYXVsdDogKCkgPT4ge1xuICAgICAgICBsZXQgaWNvbk5hbWUgPSAnJ1xuXG4gICAgICAgIC8vIFN1cHBvcnQgdXNhZ2Ugb2Ygdi10ZXh0IGFuZCB2LWh0bWxcbiAgICAgICAgLy8gaWYgKGRhdGEuZG9tUHJvcHMpIHtcbiAgICAgICAgaWYodGhpcy4kLnZub2RlLnByb3BzPy50ZXh0Q29udGVudCkge1xuICAgICAgICAgIGljb25OYW1lID0gdGhpcy4kLnZub2RlLnByb3BzLnRleHRDb250ZW50ICB8fFxuICAgICAgICAgIHRoaXMuJC52bm9kZS5wcm9wcy5pbm5lckhUTUwgfHxcbiAgICAgICAgICAgIGljb25OYW1lXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMuJHNsb3RzLmRlZmF1bHQ/LigpXG5cbiAgICAgICAgcmV0dXJuIGljb25OYW1lID8gW2ljb25OYW1lXSA6IGNoaWxkcmVuICYmIGNoaWxkcmVuWzBdPy5jaGlsZHJlblxuICAgICAgfVxuICAgIH0pXG4gIH1cbn0pXG4iXX0=