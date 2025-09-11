import { h } from 'vue';
// Styles
import './VToolbar.sass';
// Extensions
import VSheet from '../VSheet/VSheet';
// Components
import VImg from '../VImg/VImg';
// Utilities
import { convertToUnit, getSlot } from '../../util/helpers';
import { breaking } from '../../util/console';
// Types
import { defineComponent } from 'vue';
/* @vue/component */
export default defineComponent({
    name: 'v-toolbar',
    extends: VSheet,
    props: {
        absolute: Boolean,
        bottom: Boolean,
        collapse: Boolean,
        dense: Boolean,
        extended: Boolean,
        extensionHeight: {
            default: 48,
            type: [Number, String],
        },
        flat: Boolean,
        floating: Boolean,
        prominent: Boolean,
        short: Boolean,
        src: {
            type: [String, Object],
            default: '',
        },
        tag: {
            type: String,
            default: 'header',
        },
    },
    data: () => ({
        isExtended: false,
    }),
    computed: {
        computedHeight() {
            const height = this.computedContentHeight;
            if (!this.isExtended)
                return height;
            const extensionHeight = parseInt(this.extensionHeight);
            return this.isCollapsed
                ? height
                : height + (!isNaN(extensionHeight) ? extensionHeight : 0);
        },
        computedContentHeight() {
            if (this.height)
                return parseInt(this.height);
            if (this.isProminent && this.dense)
                return 96;
            if (this.isProminent && this.short)
                return 112;
            if (this.isProminent)
                return 128;
            if (this.dense)
                return 48;
            if (this.short || this.$vuetify.breakpoint.smAndDown)
                return 56;
            return 64;
        },
        classes() {
            return {
                ...VSheet.computed.classes.call(this),
                'v-toolbar': true,
                'v-toolbar--absolute': this.absolute,
                'v-toolbar--bottom': this.bottom,
                'v-toolbar--collapse': this.collapse,
                'v-toolbar--collapsed': this.isCollapsed,
                'v-toolbar--dense': this.dense,
                'v-toolbar--extended': this.isExtended,
                'v-toolbar--flat': this.flat,
                'v-toolbar--floating': this.floating,
                'v-toolbar--prominent': this.isProminent,
            };
        },
        isCollapsed() {
            return this.collapse;
        },
        isProminent() {
            return this.prominent;
        },
        styles() {
            return {
                ...this.measurableStyles,
                height: convertToUnit(this.computedHeight),
            };
        },
    },
    created() {
        const breakingProps = [
            ['app', '<v-app-bar app>'],
            ['manual-scroll', '<v-app-bar :value="false">'],
            ['clipped-left', '<v-app-bar clipped-left>'],
            ['clipped-right', '<v-app-bar clipped-right>'],
            ['inverted-scroll', '<v-app-bar inverted-scroll>'],
            ['scroll-off-screen', '<v-app-bar scroll-off-screen>'],
            ['scroll-target', '<v-app-bar scroll-target>'],
            ['scroll-threshold', '<v-app-bar scroll-threshold>'],
            ['card', '<v-app-bar flat>'],
        ];
        /* istanbul ignore next */
        breakingProps.forEach(([original, replacement]) => {
            if (this.$attrs.hasOwnProperty(original))
                breaking(original, replacement, this);
        });
    },
    methods: {
        genBackground() {
            const props = {
                height: convertToUnit(this.computedHeight),
                src: this.src,
            };
            const image = this.$slots.img
                ? this.$slots.img({ props })
                : h(VImg, props);
            return h('div', {
                class: 'v-toolbar__image',
            }, [image]);
        },
        genContent() {
            return h('div', {
                class: 'v-toolbar__content',
                style: {
                    height: convertToUnit(this.computedContentHeight),
                },
            }, getSlot(this));
        },
        genExtension() {
            return h('div', {
                class: 'v-toolbar__extension',
                style: {
                    height: convertToUnit(this.extensionHeight),
                },
            }, getSlot(this, 'extension'));
        },
    },
    render() {
        this.isExtended = this.extended || !!this.$slots.extension;
        const children = [this.genContent()];
        const data = this.setBackgroundColor(this.color, {
            class: this.classes,
            style: this.styles
        });
        if (this.isExtended)
            children.push(this.genExtension());
        if (this.src || this.$slots.img)
            children.unshift(this.genBackground());
        return h(this.tag, { ...this.attrs$, ...data }, children);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRvb2xiYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WVG9vbGJhci9WVG9vbGJhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsQ0FBQyxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBQ3ZCLFNBQVM7QUFDVCxPQUFPLGlCQUFpQixDQUFBO0FBRXhCLGFBQWE7QUFDYixPQUFPLE1BQU0sTUFBTSxrQkFBa0IsQ0FBQTtBQUVyQyxhQUFhO0FBQ2IsT0FBTyxJQUFtQixNQUFNLGNBQWMsQ0FBQTtBQUU5QyxZQUFZO0FBQ1osT0FBTyxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUMzRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFN0MsUUFBUTtBQUNSLE9BQU8sRUFBbUIsZUFBZSxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBRXRELG9CQUFvQjtBQUNwQixlQUFlLGVBQWUsQ0FBQztJQUM3QixJQUFJLEVBQUUsV0FBVztJQUNqQixPQUFPLEVBQUUsTUFBTTtJQUVmLEtBQUssRUFBRTtRQUNMLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLE1BQU0sRUFBRSxPQUFPO1FBQ2YsUUFBUSxFQUFFLE9BQU87UUFDakIsS0FBSyxFQUFFLE9BQU87UUFDZCxRQUFRLEVBQUUsT0FBTztRQUNqQixlQUFlLEVBQUU7WUFDZixPQUFPLEVBQUUsRUFBRTtZQUNYLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7U0FDdkI7UUFDRCxJQUFJLEVBQUUsT0FBTztRQUNiLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLFNBQVMsRUFBRSxPQUFPO1FBQ2xCLEtBQUssRUFBRSxPQUFPO1FBQ2QsR0FBRyxFQUFFO1lBQ0gsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBaUM7WUFDdEQsT0FBTyxFQUFFLEVBQUU7U0FDWjtRQUNELEdBQUcsRUFB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Q0FBQyxDQUFDLEtBQUssRUFBRTtnQkFDZCxLQUFLLEVBQUUsc0JBQXNCO2dCQUM3QixLQUFLLEVBQUU7b0JBQ0wsTUFBTSxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO2lCQUM1QzthQUNGLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFBO1FBQ2hDLENBQUM7S0FDRjtJQUVELE1BQU07UUFDSixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFBO1FBRTFELE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7UUFDcEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDL0MsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ25CLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTTtTQUNuQixDQUFDLENBQUE7UUFFRixJQUFJLElBQUksQ0FBQyxVQUFVO1lBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQTtRQUN2RCxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHO1lBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQTtRQUV2RSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxFQUFDLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDekQsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICd2dWUnXG4vLyBTdHlsZXNcbmltcG9ydCAnLi9WVG9vbGJhci5zYXNzJ1xuXG4vLyBFeHRlbnNpb25zXG5pbXBvcnQgVlNoZWV0IGZyb20gJy4uL1ZTaGVldC9WU2hlZXQnXG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCBWSW1nLCB7IHNyY09iamVjdCB9IGZyb20gJy4uL1ZJbWcvVkltZydcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBjb252ZXJ0VG9Vbml0LCBnZXRTbG90IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IHsgYnJlYWtpbmcgfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSwgUHJvcFR5cGUsIGRlZmluZUNvbXBvbmVudCB9IGZyb20gJ3Z1ZSdcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XG4gIG5hbWU6ICd2LXRvb2xiYXInLFxuICBleHRlbmRzOiBWU2hlZXQsXG5cbiAgcHJvcHM6IHtcbiAgICBhYnNvbHV0ZTogQm9vbGVhbixcbiAgICBib3R0b206IEJvb2xlYW4sXG4gICAgY29sbGFwc2U6IEJvb2xlYW4sXG4gICAgZGVuc2U6IEJvb2xlYW4sXG4gICAgZXh0ZW5kZWQ6IEJvb2xlYW4sXG4gICAgZXh0ZW5zaW9uSGVpZ2h0OiB7XG4gICAgICBkZWZhdWx0OiA0OCxcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgfSxcbiAgICBmbGF0OiBCb29sZWFuLFxuICAgIGZsb2F0aW5nOiBCb29sZWFuLFxuICAgIHByb21pbmVudDogQm9vbGVhbixcbiAgICBzaG9ydDogQm9vbGVhbixcbiAgICBzcmM6IHtcbiAgICAgIHR5cGU6IFtTdHJpbmcsIE9iamVjdF0gYXMgUHJvcFR5cGU8c3RyaW5nIHwgc3JjT2JqZWN0PixcbiAgICAgIGRlZmF1bHQ6ICcnLFxuICAgIH0sXG4gICAgdGFnOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnaGVhZGVyJyxcbiAgICB9LFxuICB9LFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgaXNFeHRlbmRlZDogZmFsc2UsXG4gIH0pLFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY29tcHV0ZWRIZWlnaHQgKCk6IG51bWJlciB7XG4gICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmNvbXB1dGVkQ29udGVudEhlaWdodFxuXG4gICAgICBpZiAoIXRoaXMuaXNFeHRlbmRlZCkgcmV0dXJuIGhlaWdodFxuXG4gICAgICBjb25zdCBleHRlbnNpb25IZWlnaHQgPSBwYXJzZUludCh0aGlzLmV4dGVuc2lvbkhlaWdodClcblxuICAgICAgcmV0dXJuIHRoaXMuaXNDb2xsYXBzZWRcbiAgICAgICAgPyBoZWlnaHRcbiAgICAgICAgOiBoZWlnaHQgKyAoIWlzTmFOKGV4dGVuc2lvbkhlaWdodCkgPyBleHRlbnNpb25IZWlnaHQgOiAwKVxuICAgIH0sXG4gICAgY29tcHV0ZWRDb250ZW50SGVpZ2h0ICgpOiBudW1iZXIge1xuICAgICAgaWYgKHRoaXMuaGVpZ2h0KSByZXR1cm4gcGFyc2VJbnQodGhpcy5oZWlnaHQpXG4gICAgICBpZiAodGhpcy5pc1Byb21pbmVudCAmJiB0aGlzLmRlbnNlKSByZXR1cm4gOTZcbiAgICAgIGlmICh0aGlzLmlzUHJvbWluZW50ICYmIHRoaXMuc2hvcnQpIHJldHVybiAxMTJcbiAgICAgIGlmICh0aGlzLmlzUHJvbWluZW50KSByZXR1cm4gMTI4XG4gICAgICBpZiAodGhpcy5kZW5zZSkgcmV0dXJuIDQ4XG4gICAgICBpZiAodGhpcy5zaG9ydCB8fCB0aGlzLiR2dWV0aWZ5LmJyZWFrcG9pbnQuc21BbmREb3duKSByZXR1cm4gNTZcbiAgICAgIHJldHVybiA2NFxuICAgIH0sXG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLlZTaGVldC5jb21wdXRlZC5jbGFzc2VzLmNhbGwodGhpcyksXG4gICAgICAgICd2LXRvb2xiYXInOiB0cnVlLFxuICAgICAgICAndi10b29sYmFyLS1hYnNvbHV0ZSc6IHRoaXMuYWJzb2x1dGUsXG4gICAgICAgICd2LXRvb2xiYXItLWJvdHRvbSc6IHRoaXMuYm90dG9tLFxuICAgICAgICAndi10b29sYmFyLS1jb2xsYXBzZSc6IHRoaXMuY29sbGFwc2UsXG4gICAgICAgICd2LXRvb2xiYXItLWNvbGxhcHNlZCc6IHRoaXMuaXNDb2xsYXBzZWQsXG4gICAgICAgICd2LXRvb2xiYXItLWRlbnNlJzogdGhpcy5kZW5zZSxcbiAgICAgICAgJ3YtdG9vbGJhci0tZXh0ZW5kZWQnOiB0aGlzLmlzRXh0ZW5kZWQsXG4gICAgICAgICd2LXRvb2xiYXItLWZsYXQnOiB0aGlzLmZsYXQsXG4gICAgICAgICd2LXRvb2xiYXItLWZsb2F0aW5nJzogdGhpcy5mbG9hdGluZyxcbiAgICAgICAgJ3YtdG9vbGJhci0tcHJvbWluZW50JzogdGhpcy5pc1Byb21pbmVudCxcbiAgICAgIH1cbiAgICB9LFxuICAgIGlzQ29sbGFwc2VkICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbGxhcHNlXG4gICAgfSxcbiAgICBpc1Byb21pbmVudCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9taW5lbnRcbiAgICB9LFxuICAgIHN0eWxlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnRoaXMubWVhc3VyYWJsZVN0eWxlcyxcbiAgICAgICAgaGVpZ2h0OiBjb252ZXJ0VG9Vbml0KHRoaXMuY29tcHV0ZWRIZWlnaHQpLFxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgY3JlYXRlZCAoKSB7XG4gICAgY29uc3QgYnJlYWtpbmdQcm9wcyA9IFtcbiAgICAgIFsnYXBwJywgJzx2LWFwcC1iYXIgYXBwPiddLFxuICAgICAgWydtYW51YWwtc2Nyb2xsJywgJzx2LWFwcC1iYXIgOnZhbHVlPVwiZmFsc2VcIj4nXSxcbiAgICAgIFsnY2xpcHBlZC1sZWZ0JywgJzx2LWFwcC1iYXIgY2xpcHBlZC1sZWZ0PiddLFxuICAgICAgWydjbGlwcGVkLXJpZ2h0JywgJzx2LWFwcC1iYXIgY2xpcHBlZC1yaWdodD4nXSxcbiAgICAgIFsnaW52ZXJ0ZWQtc2Nyb2xsJywgJzx2LWFwcC1iYXIgaW52ZXJ0ZWQtc2Nyb2xsPiddLFxuICAgICAgWydzY3JvbGwtb2ZmLXNjcmVlbicsICc8di1hcHAtYmFyIHNjcm9sbC1vZmYtc2NyZWVuPiddLFxuICAgICAgWydzY3JvbGwtdGFyZ2V0JywgJzx2LWFwcC1iYXIgc2Nyb2xsLXRhcmdldD4nXSxcbiAgICAgIFsnc2Nyb2xsLXRocmVzaG9sZCcsICc8di1hcHAtYmFyIHNjcm9sbC10aHJlc2hvbGQ+J10sXG4gICAgICBbJ2NhcmQnLCAnPHYtYXBwLWJhciBmbGF0PiddLFxuICAgIF1cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgYnJlYWtpbmdQcm9wcy5mb3JFYWNoKChbb3JpZ2luYWwsIHJlcGxhY2VtZW50XSkgPT4ge1xuICAgICAgaWYgKHRoaXMuJGF0dHJzLmhhc093blByb3BlcnR5KG9yaWdpbmFsKSkgYnJlYWtpbmcob3JpZ2luYWwsIHJlcGxhY2VtZW50LCB0aGlzKVxuICAgIH0pXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGdlbkJhY2tncm91bmQgKCkge1xuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIGhlaWdodDogY29udmVydFRvVW5pdCh0aGlzLmNvbXB1dGVkSGVpZ2h0KSxcbiAgICAgICAgc3JjOiB0aGlzLnNyYyxcbiAgICAgIH1cblxuICAgICAgY29uc3QgaW1hZ2UgPSB0aGlzLiRzbG90cy5pbWdcbiAgICAgICAgPyB0aGlzLiRzbG90cy5pbWcoeyBwcm9wcyB9KVxuICAgICAgICA6IGgoVkltZywgcHJvcHMpXG5cbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiAndi10b29sYmFyX19pbWFnZScsXG4gICAgICB9LCBbaW1hZ2VdKVxuICAgIH0sXG4gICAgZ2VuQ29udGVudCAoKSB7XG4gICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogJ3YtdG9vbGJhcl9fY29udGVudCcsXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgaGVpZ2h0OiBjb252ZXJ0VG9Vbml0KHRoaXMuY29tcHV0ZWRDb250ZW50SGVpZ2h0KSxcbiAgICAgICAgfSxcbiAgICAgIH0sIGdldFNsb3QodGhpcykpXG4gICAgfSxcbiAgICBnZW5FeHRlbnNpb24gKCkge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6ICd2LXRvb2xiYXJfX2V4dGVuc2lvbicsXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgaGVpZ2h0OiBjb252ZXJ0VG9Vbml0KHRoaXMuZXh0ZW5zaW9uSGVpZ2h0KSxcbiAgICAgICAgfSxcbiAgICAgIH0sIGdldFNsb3QodGhpcywgJ2V4dGVuc2lvbicpKVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgdGhpcy5pc0V4dGVuZGVkID0gdGhpcy5leHRlbmRlZCB8fCAhIXRoaXMuJHNsb3RzLmV4dGVuc2lvblxuXG4gICAgY29uc3QgY2hpbGRyZW4gPSBbdGhpcy5nZW5Db250ZW50KCldXG4gICAgY29uc3QgZGF0YSA9IHRoaXMuc2V0QmFja2dyb3VuZENvbG9yKHRoaXMuY29sb3IsIHtcbiAgICAgIGNsYXNzOiB0aGlzLmNsYXNzZXMsXG4gICAgICBzdHlsZTogdGhpcy5zdHlsZXNcbiAgICB9KVxuXG4gICAgaWYgKHRoaXMuaXNFeHRlbmRlZCkgY2hpbGRyZW4ucHVzaCh0aGlzLmdlbkV4dGVuc2lvbigpKVxuICAgIGlmICh0aGlzLnNyYyB8fCB0aGlzLiRzbG90cy5pbWcpIGNoaWxkcmVuLnVuc2hpZnQodGhpcy5nZW5CYWNrZ3JvdW5kKCkpXG5cbiAgICByZXR1cm4gaCh0aGlzLnRhZywgey4uLnRoaXMuYXR0cnMkLCAuLi5kYXRhfSwgY2hpbGRyZW4pXG4gIH1cbn0pXG4iXX0=