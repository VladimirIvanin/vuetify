// Utilities
import { removed } from '../../util/console';
import { defineComponent, h, Comment } from 'vue';
/**
 * Bootable
 * @mixin
 *
 * Used to add lazy content functionality to components
 * Looks for change in "isActive" to automatically boot
 * Otherwise can be set manually
 */
/* @vue/component */
export default defineComponent({
    name: 'bootable',
    props: {
        eager: Boolean,
    },
    data: () => ({
        isBooted: false,
    }),
    computed: {
        hasContent() {
            return this.isBooted || this.eager || this.isActive;
        },
    },
    watch: {
        isActive() {
            this.isBooted = true;
        },
    },
    created() {
        /* istanbul ignore next */
        if ('lazy' in this.$attrs) {
            removed('lazy', this);
        }
    },
    methods: {
        showLazyContent(content) {
            return (this.hasContent && content) ? content() : [h(Comment)];
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2Jvb3RhYmxlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVk7QUFDWixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFLNUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBS2pEOzs7Ozs7O0dBT0c7QUFDSCxvQkFBb0I7QUFDcEIsZUFBZSxlQUFlLENBQUM7SUFDN0IsSUFBSSxFQUFFLFVBQVU7SUFFaEIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFLE9BQU87S0FDZjtJQUVELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsUUFBUSxFQUFFLEtBQUs7S0FDaEIsQ0FBQztJQUVGLFFBQVEsRUFBRTtRQUNSLFVBQVU7WUFDUixPQUFPLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFBO1FBQ3JELENBQUM7S0FDRjtJQUVELEtBQUssRUFBRTtRQUNMLFFBQVE7WUFDTixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtRQUN0QixDQUFDO0tBQ0Y7SUFFRCxPQUFPO1FBQ0wsMEJBQTBCO1FBQzFCLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDekIsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQTtTQUN0QjtJQUNILENBQUM7SUFFRCxPQUFPLEVBQUU7UUFDUCxlQUFlLENBQUUsT0FBdUI7WUFDdEMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBQ2hFLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFV0aWxpdGllc1xuaW1wb3J0IHsgcmVtb3ZlZCB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcblxuLy8gVHlwZXNcbmltcG9ydCB0eXBlIHsgVk5vZGUsIEFwcCB9IGZyb20gJ3Z1ZSdcblxuaW1wb3J0IHsgZGVmaW5lQ29tcG9uZW50LCBoLCBDb21tZW50IH0gZnJvbSAndnVlJ1xuaW50ZXJmYWNlIFRvZ2dsZWFibGUgZXh0ZW5kcyBBcHAge1xuICBpc0FjdGl2ZT86IGJvb2xlYW5cbn1cblxuLyoqXG4gKiBCb290YWJsZVxuICogQG1peGluXG4gKlxuICogVXNlZCB0byBhZGQgbGF6eSBjb250ZW50IGZ1bmN0aW9uYWxpdHkgdG8gY29tcG9uZW50c1xuICogTG9va3MgZm9yIGNoYW5nZSBpbiBcImlzQWN0aXZlXCIgdG8gYXV0b21hdGljYWxseSBib290XG4gKiBPdGhlcndpc2UgY2FuIGJlIHNldCBtYW51YWxseVxuICovXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29tcG9uZW50KHtcbiAgbmFtZTogJ2Jvb3RhYmxlJyxcblxuICBwcm9wczoge1xuICAgIGVhZ2VyOiBCb29sZWFuLFxuICB9LFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgaXNCb290ZWQ6IGZhbHNlLFxuICB9KSxcblxuICBjb21wdXRlZDoge1xuICAgIGhhc0NvbnRlbnQgKCk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgICAgcmV0dXJuIHRoaXMuaXNCb290ZWQgfHwgdGhpcy5lYWdlciB8fCB0aGlzLmlzQWN0aXZlXG4gICAgfSxcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIGlzQWN0aXZlICgpIHtcbiAgICAgIHRoaXMuaXNCb290ZWQgPSB0cnVlXG4gICAgfSxcbiAgfSxcblxuICBjcmVhdGVkICgpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmICgnbGF6eScgaW4gdGhpcy4kYXR0cnMpIHtcbiAgICAgIHJlbW92ZWQoJ2xhenknLCB0aGlzKVxuICAgIH1cbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgc2hvd0xhenlDb250ZW50IChjb250ZW50PzogKCkgPT4gVk5vZGVbXSk6IFZOb2RlW10ge1xuICAgICAgcmV0dXJuICh0aGlzLmhhc0NvbnRlbnQgJiYgY29udGVudCkgPyBjb250ZW50KCkgOiBbaChDb21tZW50KV1cbiAgICB9LFxuICB9LFxufSlcbiJdfQ==