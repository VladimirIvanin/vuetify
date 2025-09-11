// Styles
import './VAppBar.sass';
// Extensions
import VToolbar from '../VToolbar/VToolbar';
// Directives
import Scroll from '../../directives/scroll';
// Mixins
import Applicationable from '../../mixins/applicationable';
import Scrollable from '../../mixins/scrollable';
import SSRBootable from '../../mixins/ssr-bootable';
import Toggleable from '../../mixins/toggleable';
// Utilities
import { convertToUnit } from '../../util/helpers';
import { mergeProps, withDirectives } from 'vue';
import mixins from '../../util/mixins';
const baseMixins = mixins(VToolbar, Scrollable, SSRBootable, Toggleable, Applicationable('top', [
    'clippedLeft',
    'clippedRight',
    'computedHeight',
    'invertedScroll',
    'isExtended',
    'isProminent',
    'value',
]));
/* @vue/component */
export default baseMixins.extend({
    name: 'v-app-bar',
    directives: { Scroll },
    provide() {
        return { VAppBar: this };
    },
    props: {
        clippedLeft: Boolean,
        clippedRight: Boolean,
        collapseOnScroll: Boolean,
        elevateOnScroll: Boolean,
        fadeImgOnScroll: Boolean,
        hideOnScroll: Boolean,
        invertedScroll: Boolean,
        scrollOffScreen: Boolean,
        shrinkOnScroll: Boolean,
        value: {
            type: Boolean,
            default: true,
        },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            isActive: this.value,
        };
    },
    computed: {
        applicationProperty() {
            return !this.bottom ? 'top' : 'bottom';
        },
        canScroll() {
            return (Scrollable.computed.canScroll.call(this) &&
                (this.invertedScroll ||
                    this.elevateOnScroll ||
                    this.hideOnScroll ||
                    this.collapseOnScroll ||
                    this.isBooted ||
                    // If falsy, user has provided an
                    // explicit value which should
                    // overwrite anything we do
                    !this.value));
        },
        classes() {
            return {
                ...VToolbar.computed.classes.call(this),
                'v-toolbar--collapse': this.collapse || this.collapseOnScroll,
                'v-app-bar': true,
                'v-app-bar--clipped': this.clippedLeft || this.clippedRight,
                'v-app-bar--fade-img-on-scroll': this.fadeImgOnScroll,
                'v-app-bar--elevate-on-scroll': this.elevateOnScroll,
                'v-app-bar--fixed': !this.absolute && (this.app || this.fixed),
                'v-app-bar--hide-shadow': this.hideShadow,
                'v-app-bar--is-scrolled': this.currentScroll > 0,
                'v-app-bar--shrink-on-scroll': this.shrinkOnScroll,
            };
        },
        scrollRatio() {
            const threshold = this.computedScrollThreshold;
            return Math.max((threshold - this.currentScroll) / threshold, 0);
        },
        computedContentHeight() {
            if (!this.shrinkOnScroll)
                return VToolbar.computed.computedContentHeight.call(this);
            const min = this.dense ? 48 : 56;
            const max = this.computedOriginalHeight;
            return min + (max - min) * this.scrollRatio;
        },
        computedFontSize() {
            if (!this.isProminent)
                return undefined;
            const min = 1.25;
            const max = 1.5;
            return min + (max - min) * this.scrollRatio;
        },
        computedLeft() {
            if (!this.app || this.clippedLeft)
                return 0;
            return this.$vuetify.application.left;
        },
        computedMarginTop() {
            if (!this.app)
                return 0;
            return this.$vuetify.application.bar;
        },
        computedOpacity() {
            if (!this.fadeImgOnScroll)
                return undefined;
            return this.scrollRatio;
        },
        computedOriginalHeight() {
            let height = VToolbar.computed.computedContentHeight.call(this);
            if (this.isExtended)
                height += parseInt(this.extensionHeight);
            return height;
        },
        computedRight() {
            if (!this.app || this.clippedRight)
                return 0;
            return this.$vuetify.application.right;
        },
        computedScrollThreshold() {
            if (this.scrollThreshold)
                return Number(this.scrollThreshold);
            return this.computedOriginalHeight - (this.dense ? 48 : 56);
        },
        computedTransform() {
            if (!this.canScroll ||
                (this.elevateOnScroll && this.currentScroll === 0 && this.isActive))
                return 0;
            if (this.isActive)
                return 0;
            const scrollOffScreen = this.scrollOffScreen
                ? this.computedHeight
                : this.computedContentHeight;
            return this.bottom ? scrollOffScreen : -scrollOffScreen;
        },
        hideShadow() {
            if (this.elevateOnScroll && this.isExtended) {
                return this.currentScroll < this.computedScrollThreshold;
            }
            if (this.elevateOnScroll) {
                return this.currentScroll === 0 ||
                    this.computedTransform < 0;
            }
            return (!this.isExtended ||
                this.scrollOffScreen) && this.computedTransform !== 0;
        },
        isCollapsed() {
            if (!this.collapseOnScroll) {
                return VToolbar.computed.isCollapsed.call(this);
            }
            return this.currentScroll > 0;
        },
        isProminent() {
            return (VToolbar.computed.isProminent.call(this) ||
                this.shrinkOnScroll);
        },
        styles() {
            return {
                ...VToolbar.computed.styles.call(this),
                fontSize: convertToUnit(this.computedFontSize, 'rem'),
                marginTop: convertToUnit(this.computedMarginTop),
                transform: `translateY(${convertToUnit(this.computedTransform)})`,
                left: convertToUnit(this.computedLeft),
                right: convertToUnit(this.computedRight),
            };
        },
    },
    watch: {
        canScroll: 'onScroll',
        computedTransform() {
            // Normally we do not want the v-app-bar
            // to update the application top value
            // to avoid screen jump. However, in
            // this situation, we must so that
            // the clipped drawer can update
            // its top value when scrolled
            if (!this.canScroll ||
                (!this.clippedLeft && !this.clippedRight))
                return;
            this.callUpdate();
        },
        invertedScroll(val) {
            this.isActive = !val || this.currentScroll !== 0;
        },
        hideOnScroll(val) {
            this.isActive = !val || this.currentScroll < this.computedScrollThreshold;
        },
    },
    created() {
        if (this.invertedScroll)
            this.isActive = false;
    },
    methods: {
        genBackground() {
            const render = VToolbar.methods.genBackground.call(this);
            // Merge opacity style with existing props
            if (render.props) {
                render.props = mergeProps(render.props, {
                    style: { opacity: this.computedOpacity }
                });
            }
            else {
                render.props = {
                    style: { opacity: this.computedOpacity }
                };
            }
            return render;
        },
        updateApplication() {
            return this.invertedScroll
                ? 0
                : this.computedHeight + this.computedTransform;
        },
        thresholdMet() {
            if (this.invertedScroll) {
                this.isActive = this.currentScroll > this.computedScrollThreshold;
                return;
            }
            if (this.hideOnScroll) {
                this.isActive = this.isScrollingUp ||
                    this.currentScroll < this.computedScrollThreshold;
            }
            if (this.currentThreshold < this.computedScrollThreshold)
                return;
            this.savedScroll = this.currentScroll;
        },
    },
    render() {
        const render = VToolbar.render.call(this);
        if (this.canScroll) {
            render.key = 'v-app-bar-scroll';
            return withDirectives(render, [
                [Scroll, this.onScroll, this.scrollTarget],
            ]);
        }
        render.key = 'v-app-bar-no-scroll';
        return render;
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkFwcEJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZBcHBCYXIvVkFwcEJhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxnQkFBZ0IsQ0FBQTtBQUV2QixhQUFhO0FBQ2IsT0FBTyxRQUFRLE1BQU0sc0JBQXNCLENBQUE7QUFFM0MsYUFBYTtBQUNiLE9BQU8sTUFBTSxNQUFNLHlCQUF5QixDQUFBO0FBRTVDLFNBQVM7QUFDVCxPQUFPLGVBQWUsTUFBTSw4QkFBOEIsQ0FBQTtBQUMxRCxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFdBQVcsTUFBTSwyQkFBMkIsQ0FBQTtBQUNuRCxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUVoRCxZQUFZO0FBQ1osT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2xELE9BQU8sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBQ2hELE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBS3RDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FDdkIsUUFBUSxFQUNSLFVBQVUsRUFDVixXQUFXLEVBQ1gsVUFBVSxFQUNWLGVBQWUsQ0FBQyxLQUFLLEVBQUU7SUFDckIsYUFBYTtJQUNiLGNBQWM7SUFDZCxnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLFlBQVk7SUFDWixhQUFhO0lBQ2IsT0FBTztDQUNSLENBQUMsQ0FDSCxDQUFBO0FBRUQsb0JBQW9CO0FBQ3BCLGVBQWUsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUMvQixJQUFJLEVBQUUsV0FBVztJQUVqQixVQUFVLEVBQUUsRUFBRSxNQUFNLEVBQUU7SUFFdEIsT0FBTztRQUNMLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUE7SUFDMUIsQ0FBQztJQUVELEtBQUssRUFBRTtRQUNMLFdBQVcsRUFB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QUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFBO2dCQUNqRSxPQUFNO2FBQ1A7WUFFRCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWE7b0JBQ2hDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFBO2FBQ3BEO1lBRUQsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLHVCQUF1QjtnQkFBRSxPQUFNO1lBRWhFLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQTtRQUN2QyxDQUFDO0tBQ0Y7SUFFRCxNQUFNO1FBQ0osTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFekMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsa0JBQWtCLENBQUE7WUFDL0IsT0FBTyxjQUFjLENBQUMsTUFBTSxFQUFFO2dCQUM1QixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUM7YUFDM0MsQ0FBQyxDQUFBO1NBQ0g7UUFFRCxNQUFNLENBQUMsR0FBRyxHQUFHLHFCQUFxQixDQUFBO1FBRWxDLE9BQU8sTUFBTSxDQUFBO0lBQ2YsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZBcHBCYXIuc2FzcydcblxuLy8gRXh0ZW5zaW9uc1xuaW1wb3J0IFZUb29sYmFyIGZyb20gJy4uL1ZUb29sYmFyL1ZUb29sYmFyJ1xuXG4vLyBEaXJlY3RpdmVzXG5pbXBvcnQgU2Nyb2xsIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvc2Nyb2xsJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBBcHBsaWNhdGlvbmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2FwcGxpY2F0aW9uYWJsZSdcbmltcG9ydCBTY3JvbGxhYmxlIGZyb20gJy4uLy4uL21peGlucy9zY3JvbGxhYmxlJ1xuaW1wb3J0IFNTUkJvb3RhYmxlIGZyb20gJy4uLy4uL21peGlucy9zc3ItYm9vdGFibGUnXG5pbXBvcnQgVG9nZ2xlYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdG9nZ2xlYWJsZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBjb252ZXJ0VG9Vbml0IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IHsgbWVyZ2VQcm9wcywgd2l0aERpcmVjdGl2ZXMgfSBmcm9tICd2dWUnXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHR5cGUgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgYmFzZU1peGlucyA9IG1peGlucyhcbiAgVlRvb2xiYXIsXG4gIFNjcm9sbGFibGUsXG4gIFNTUkJvb3RhYmxlLFxuICBUb2dnbGVhYmxlLFxuICBBcHBsaWNhdGlvbmFibGUoJ3RvcCcsIFtcbiAgICAnY2xpcHBlZExlZnQnLFxuICAgICdjbGlwcGVkUmlnaHQnLFxuICAgICdjb21wdXRlZEhlaWdodCcsXG4gICAgJ2ludmVydGVkU2Nyb2xsJyxcbiAgICAnaXNFeHRlbmRlZCcsXG4gICAgJ2lzUHJvbWluZW50JyxcbiAgICAndmFsdWUnLFxuICBdKVxuKVxuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgYmFzZU1peGlucy5leHRlbmQoe1xuICBuYW1lOiAndi1hcHAtYmFyJyxcblxuICBkaXJlY3RpdmVzOiB7IFNjcm9sbCB9LFxuXG4gIHByb3ZpZGUgKCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIHsgVkFwcEJhcjogdGhpcyB9XG4gIH0sXG5cbiAgcHJvcHM6IHtcbiAgICBjbGlwcGVkTGVmdDogQm9vbGVhbixcbiAgICBjbGlwcGVkUmlnaHQ6IEJvb2xlYW4sXG4gICAgY29sbGFwc2VPblNjcm9sbDogQm9vbGVhbixcbiAgICBlbGV2YXRlT25TY3JvbGw6IEJvb2xlYW4sXG4gICAgZmFkZUltZ09uU2Nyb2xsOiBCb29sZWFuLFxuICAgIGhpZGVPblNjcm9sbDogQm9vbGVhbixcbiAgICBpbnZlcnRlZFNjcm9sbDogQm9vbGVhbixcbiAgICBzY3JvbGxPZmZTY3JlZW46IEJvb2xlYW4sXG4gICAgc2hyaW5rT25TY3JvbGw6IEJvb2xlYW4sXG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgIH0sXG4gIH0sXG5cbiAgZW1pdHM6IFsndXBkYXRlOm1vZGVsVmFsdWUnXSxcblxuICBkYXRhICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaXNBY3RpdmU6IHRoaXMudmFsdWUsXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgYXBwbGljYXRpb25Qcm9wZXJ0eSAoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAhdGhpcy5ib3R0b20gPyAndG9wJyA6ICdib3R0b20nXG4gICAgfSxcbiAgICBjYW5TY3JvbGwgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgU2Nyb2xsYWJsZS5jb21wdXRlZC5jYW5TY3JvbGwuY2FsbCh0aGlzKSAmJlxuICAgICAgICAoXG4gICAgICAgICAgdGhpcy5pbnZlcnRlZFNjcm9sbCB8fFxuICAgICAgICAgIHRoaXMuZWxldmF0ZU9uU2Nyb2xsIHx8XG4gICAgICAgICAgdGhpcy5oaWRlT25TY3JvbGwgfHxcbiAgICAgICAgICB0aGlzLmNvbGxhcHNlT25TY3JvbGwgfHxcbiAgICAgICAgICB0aGlzLmlzQm9vdGVkIHx8XG4gICAgICAgICAgLy8gSWYgZmFsc3ksIHVzZXIgaGFzIHByb3ZpZGVkIGFuXG4gICAgICAgICAgLy8gZXhwbGljaXQgdmFsdWUgd2hpY2ggc2hvdWxkXG4gICAgICAgICAgLy8gb3ZlcndyaXRlIGFueXRoaW5nIHdlIGRvXG4gICAgICAgICAgIXRoaXMudmFsdWVcbiAgICAgICAgKVxuICAgICAgKVxuICAgIH0sXG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLlZUb29sYmFyLmNvbXB1dGVkLmNsYXNzZXMuY2FsbCh0aGlzKSxcbiAgICAgICAgJ3YtdG9vbGJhci0tY29sbGFwc2UnOiB0aGlzLmNvbGxhcHNlIHx8IHRoaXMuY29sbGFwc2VPblNjcm9sbCxcbiAgICAgICAgJ3YtYXBwLWJhcic6IHRydWUsXG4gICAgICAgICd2LWFwcC1iYXItLWNsaXBwZWQnOiB0aGlzLmNsaXBwZWRMZWZ0IHx8IHRoaXMuY2xpcHBlZFJpZ2h0LFxuICAgICAgICAndi1hcHAtYmFyLS1mYWRlLWltZy1vbi1zY3JvbGwnOiB0aGlzLmZhZGVJbWdPblNjcm9sbCxcbiAgICAgICAgJ3YtYXBwLWJhci0tZWxldmF0ZS1vbi1zY3JvbGwnOiB0aGlzLmVsZXZhdGVPblNjcm9sbCxcbiAgICAgICAgJ3YtYXBwLWJhci0tZml4ZWQnOiAhdGhpcy5hYnNvbHV0ZSAmJiAodGhpcy5hcHAgfHwgdGhpcy5maXhlZCksXG4gICAgICAgICd2LWFwcC1iYXItLWhpZGUtc2hhZG93JzogdGhpcy5oaWRlU2hhZG93LFxuICAgICAgICAndi1hcHAtYmFyLS1pcy1zY3JvbGxlZCc6IHRoaXMuY3VycmVudFNjcm9sbCA+IDAsXG4gICAgICAgICd2LWFwcC1iYXItLXNocmluay1vbi1zY3JvbGwnOiB0aGlzLnNocmlua09uU2Nyb2xsLFxuICAgICAgfVxuICAgIH0sXG4gICAgc2Nyb2xsUmF0aW8gKCk6IG51bWJlciB7XG4gICAgICBjb25zdCB0aHJlc2hvbGQgPSB0aGlzLmNvbXB1dGVkU2Nyb2xsVGhyZXNob2xkXG4gICAgICByZXR1cm4gTWF0aC5tYXgoKHRocmVzaG9sZCAtIHRoaXMuY3VycmVudFNjcm9sbCkgLyB0aHJlc2hvbGQsIDApXG4gICAgfSxcbiAgICBjb21wdXRlZENvbnRlbnRIZWlnaHQgKCk6IG51bWJlciB7XG4gICAgICBpZiAoIXRoaXMuc2hyaW5rT25TY3JvbGwpIHJldHVybiBWVG9vbGJhci5jb21wdXRlZC5jb21wdXRlZENvbnRlbnRIZWlnaHQuY2FsbCh0aGlzKVxuXG4gICAgICBjb25zdCBtaW4gPSB0aGlzLmRlbnNlID8gNDggOiA1NlxuICAgICAgY29uc3QgbWF4ID0gdGhpcy5jb21wdXRlZE9yaWdpbmFsSGVpZ2h0XG5cbiAgICAgIHJldHVybiBtaW4gKyAobWF4IC0gbWluKSAqIHRoaXMuc2Nyb2xsUmF0aW9cbiAgICB9LFxuICAgIGNvbXB1dGVkRm9udFNpemUgKCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgICBpZiAoIXRoaXMuaXNQcm9taW5lbnQpIHJldHVybiB1bmRlZmluZWRcblxuICAgICAgY29uc3QgbWluID0gMS4yNVxuICAgICAgY29uc3QgbWF4ID0gMS41XG5cbiAgICAgIHJldHVybiBtaW4gKyAobWF4IC0gbWluKSAqIHRoaXMuc2Nyb2xsUmF0aW9cbiAgICB9LFxuICAgIGNvbXB1dGVkTGVmdCAoKTogbnVtYmVyIHtcbiAgICAgIGlmICghdGhpcy5hcHAgfHwgdGhpcy5jbGlwcGVkTGVmdCkgcmV0dXJuIDBcblxuICAgICAgcmV0dXJuIHRoaXMuJHZ1ZXRpZnkuYXBwbGljYXRpb24ubGVmdFxuICAgIH0sXG4gICAgY29tcHV0ZWRNYXJnaW5Ub3AgKCk6IG51bWJlciB7XG4gICAgICBpZiAoIXRoaXMuYXBwKSByZXR1cm4gMFxuXG4gICAgICByZXR1cm4gdGhpcy4kdnVldGlmeS5hcHBsaWNhdGlvbi5iYXJcbiAgICB9LFxuICAgIGNvbXB1dGVkT3BhY2l0eSAoKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgICAgIGlmICghdGhpcy5mYWRlSW1nT25TY3JvbGwpIHJldHVybiB1bmRlZmluZWRcblxuICAgICAgcmV0dXJuIHRoaXMuc2Nyb2xsUmF0aW9cbiAgICB9LFxuICAgIGNvbXB1dGVkT3JpZ2luYWxIZWlnaHQgKCk6IG51bWJlciB7XG4gICAgICBsZXQgaGVpZ2h0ID0gVlRvb2xiYXIuY29tcHV0ZWQuY29tcHV0ZWRDb250ZW50SGVpZ2h0LmNhbGwodGhpcylcbiAgICAgIGlmICh0aGlzLmlzRXh0ZW5kZWQpIGhlaWdodCArPSBwYXJzZUludCh0aGlzLmV4dGVuc2lvbkhlaWdodClcbiAgICAgIHJldHVybiBoZWlnaHRcbiAgICB9LFxuICAgIGNvbXB1dGVkUmlnaHQgKCk6IG51bWJlciB7XG4gICAgICBpZiAoIXRoaXMuYXBwIHx8IHRoaXMuY2xpcHBlZFJpZ2h0KSByZXR1cm4gMFxuXG4gICAgICByZXR1cm4gdGhpcy4kdnVldGlmeS5hcHBsaWNhdGlvbi5yaWdodFxuICAgIH0sXG4gICAgY29tcHV0ZWRTY3JvbGxUaHJlc2hvbGQgKCk6IG51bWJlciB7XG4gICAgICBpZiAodGhpcy5zY3JvbGxUaHJlc2hvbGQpIHJldHVybiBOdW1iZXIodGhpcy5zY3JvbGxUaHJlc2hvbGQpXG5cbiAgICAgIHJldHVybiB0aGlzLmNvbXB1dGVkT3JpZ2luYWxIZWlnaHQgLSAodGhpcy5kZW5zZSA/IDQ4IDogNTYpXG4gICAgfSxcbiAgICBjb21wdXRlZFRyYW5zZm9ybSAoKTogbnVtYmVyIHtcbiAgICAgIGlmIChcbiAgICAgICAgIXRoaXMuY2FuU2Nyb2xsIHx8XG4gICAgICAgICh0aGlzLmVsZXZhdGVPblNjcm9sbCAmJiB0aGlzLmN1cnJlbnRTY3JvbGwgPT09IDAgJiYgdGhpcy5pc0FjdGl2ZSlcbiAgICAgICkgcmV0dXJuIDBcblxuICAgICAgaWYgKHRoaXMuaXNBY3RpdmUpIHJldHVybiAwXG5cbiAgICAgIGNvbnN0IHNjcm9sbE9mZlNjcmVlbiA9IHRoaXMuc2Nyb2xsT2ZmU2NyZWVuXG4gICAgICAgID8gdGhpcy5jb21wdXRlZEhlaWdodFxuICAgICAgICA6IHRoaXMuY29tcHV0ZWRDb250ZW50SGVpZ2h0XG5cbiAgICAgIHJldHVybiB0aGlzLmJvdHRvbSA/IHNjcm9sbE9mZlNjcmVlbiA6IC1zY3JvbGxPZmZTY3JlZW5cbiAgICB9LFxuICAgIGhpZGVTaGFkb3cgKCk6IGJvb2xlYW4ge1xuICAgICAgaWYgKHRoaXMuZWxldmF0ZU9uU2Nyb2xsICYmIHRoaXMuaXNFeHRlbmRlZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U2Nyb2xsIDwgdGhpcy5jb21wdXRlZFNjcm9sbFRocmVzaG9sZFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5lbGV2YXRlT25TY3JvbGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFNjcm9sbCA9PT0gMCB8fFxuICAgICAgICAgIHRoaXMuY29tcHV0ZWRUcmFuc2Zvcm0gPCAwXG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgICF0aGlzLmlzRXh0ZW5kZWQgfHxcbiAgICAgICAgdGhpcy5zY3JvbGxPZmZTY3JlZW5cbiAgICAgICkgJiYgdGhpcy5jb21wdXRlZFRyYW5zZm9ybSAhPT0gMFxuICAgIH0sXG4gICAgaXNDb2xsYXBzZWQgKCk6IGJvb2xlYW4ge1xuICAgICAgaWYgKCF0aGlzLmNvbGxhcHNlT25TY3JvbGwpIHtcbiAgICAgICAgcmV0dXJuIFZUb29sYmFyLmNvbXB1dGVkLmlzQ29sbGFwc2VkLmNhbGwodGhpcylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFNjcm9sbCA+IDBcbiAgICB9LFxuICAgIGlzUHJvbWluZW50ICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFZUb29sYmFyLmNvbXB1dGVkLmlzUHJvbWluZW50LmNhbGwodGhpcykgfHxcbiAgICAgICAgdGhpcy5zaHJpbmtPblNjcm9sbFxuICAgICAgKVxuICAgIH0sXG4gICAgc3R5bGVzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uVlRvb2xiYXIuY29tcHV0ZWQuc3R5bGVzLmNhbGwodGhpcyksXG4gICAgICAgIGZvbnRTaXplOiBjb252ZXJ0VG9Vbml0KHRoaXMuY29tcHV0ZWRGb250U2l6ZSwgJ3JlbScpLFxuICAgICAgICBtYXJnaW5Ub3A6IGNvbnZlcnRUb1VuaXQodGhpcy5jb21wdXRlZE1hcmdpblRvcCksXG4gICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZVkoJHtjb252ZXJ0VG9Vbml0KHRoaXMuY29tcHV0ZWRUcmFuc2Zvcm0pfSlgLFxuICAgICAgICBsZWZ0OiBjb252ZXJ0VG9Vbml0KHRoaXMuY29tcHV0ZWRMZWZ0KSxcbiAgICAgICAgcmlnaHQ6IGNvbnZlcnRUb1VuaXQodGhpcy5jb21wdXRlZFJpZ2h0KSxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgY2FuU2Nyb2xsOiAnb25TY3JvbGwnLFxuICAgIGNvbXB1dGVkVHJhbnNmb3JtICgpIHtcbiAgICAgIC8vIE5vcm1hbGx5IHdlIGRvIG5vdCB3YW50IHRoZSB2LWFwcC1iYXJcbiAgICAgIC8vIHRvIHVwZGF0ZSB0aGUgYXBwbGljYXRpb24gdG9wIHZhbHVlXG4gICAgICAvLyB0byBhdm9pZCBzY3JlZW4ganVtcC4gSG93ZXZlciwgaW5cbiAgICAgIC8vIHRoaXMgc2l0dWF0aW9uLCB3ZSBtdXN0IHNvIHRoYXRcbiAgICAgIC8vIHRoZSBjbGlwcGVkIGRyYXdlciBjYW4gdXBkYXRlXG4gICAgICAvLyBpdHMgdG9wIHZhbHVlIHdoZW4gc2Nyb2xsZWRcbiAgICAgIGlmIChcbiAgICAgICAgIXRoaXMuY2FuU2Nyb2xsIHx8XG4gICAgICAgICghdGhpcy5jbGlwcGVkTGVmdCAmJiAhdGhpcy5jbGlwcGVkUmlnaHQpXG4gICAgICApIHJldHVyblxuXG4gICAgICB0aGlzLmNhbGxVcGRhdGUoKVxuICAgIH0sXG4gICAgaW52ZXJ0ZWRTY3JvbGwgKHZhbDogYm9vbGVhbikge1xuICAgICAgdGhpcy5pc0FjdGl2ZSA9ICF2YWwgfHwgdGhpcy5jdXJyZW50U2Nyb2xsICE9PSAwXG4gICAgfSxcbiAgICBoaWRlT25TY3JvbGwgKHZhbDogYm9vbGVhbikge1xuICAgICAgdGhpcy5pc0FjdGl2ZSA9ICF2YWwgfHwgdGhpcy5jdXJyZW50U2Nyb2xsIDwgdGhpcy5jb21wdXRlZFNjcm9sbFRocmVzaG9sZFxuICAgIH0sXG4gIH0sXG5cbiAgY3JlYXRlZCAoKSB7XG4gICAgaWYgKHRoaXMuaW52ZXJ0ZWRTY3JvbGwpIHRoaXMuaXNBY3RpdmUgPSBmYWxzZVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5CYWNrZ3JvdW5kICgpIHtcbiAgICAgIGNvbnN0IHJlbmRlciA9IFZUb29sYmFyLm1ldGhvZHMuZ2VuQmFja2dyb3VuZC5jYWxsKHRoaXMpXG5cbiAgICAgIC8vIE1lcmdlIG9wYWNpdHkgc3R5bGUgd2l0aCBleGlzdGluZyBwcm9wc1xuICAgICAgaWYgKHJlbmRlci5wcm9wcykge1xuICAgICAgICByZW5kZXIucHJvcHMgPSBtZXJnZVByb3BzKHJlbmRlci5wcm9wcywge1xuICAgICAgICAgIHN0eWxlOiB7IG9wYWNpdHk6IHRoaXMuY29tcHV0ZWRPcGFjaXR5IH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbmRlci5wcm9wcyA9IHtcbiAgICAgICAgICBzdHlsZTogeyBvcGFjaXR5OiB0aGlzLmNvbXB1dGVkT3BhY2l0eSB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlbmRlclxuICAgIH0sXG4gICAgdXBkYXRlQXBwbGljYXRpb24gKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gdGhpcy5pbnZlcnRlZFNjcm9sbFxuICAgICAgICA/IDBcbiAgICAgICAgOiB0aGlzLmNvbXB1dGVkSGVpZ2h0ICsgdGhpcy5jb21wdXRlZFRyYW5zZm9ybVxuICAgIH0sXG4gICAgdGhyZXNob2xkTWV0ICgpIHtcbiAgICAgIGlmICh0aGlzLmludmVydGVkU2Nyb2xsKSB7XG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSB0aGlzLmN1cnJlbnRTY3JvbGwgPiB0aGlzLmNvbXB1dGVkU2Nyb2xsVGhyZXNob2xkXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5oaWRlT25TY3JvbGwpIHtcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IHRoaXMuaXNTY3JvbGxpbmdVcCB8fFxuICAgICAgICAgIHRoaXMuY3VycmVudFNjcm9sbCA8IHRoaXMuY29tcHV0ZWRTY3JvbGxUaHJlc2hvbGRcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY3VycmVudFRocmVzaG9sZCA8IHRoaXMuY29tcHV0ZWRTY3JvbGxUaHJlc2hvbGQpIHJldHVyblxuXG4gICAgICB0aGlzLnNhdmVkU2Nyb2xsID0gdGhpcy5jdXJyZW50U2Nyb2xsXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKCk6IFZOb2RlIHtcbiAgICBjb25zdCByZW5kZXIgPSBWVG9vbGJhci5yZW5kZXIuY2FsbCh0aGlzKVxuXG4gICAgaWYgKHRoaXMuY2FuU2Nyb2xsKSB7XG4gICAgICByZW5kZXIua2V5ID0gJ3YtYXBwLWJhci1zY3JvbGwnXG4gICAgICByZXR1cm4gd2l0aERpcmVjdGl2ZXMocmVuZGVyLCBbXG4gICAgICAgIFtTY3JvbGwsIHRoaXMub25TY3JvbGwsIHRoaXMuc2Nyb2xsVGFyZ2V0XSxcbiAgICAgIF0pXG4gICAgfVxuXG4gICAgcmVuZGVyLmtleSA9ICd2LWFwcC1iYXItbm8tc2Nyb2xsJ1xuXG4gICAgcmV0dXJuIHJlbmRlclxuICB9LFxufSlcbiJdfQ==