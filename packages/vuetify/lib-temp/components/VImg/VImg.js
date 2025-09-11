import { h, Transition, withDirectives, mergeProps } from 'vue';
// Styles
import './VImg.sass';
// Components
import VResponsive from '../VResponsive';
// Mixins
import Themeable from '../../mixins/themeable';
// Utils
import mixins from '../../util/mixins';
import mergeData from '../../util/mergeData';
import { consoleWarn } from '../../util/console';
import { getSlot } from '../../util/helpers';
import Intersect from '../../directives/intersect';
const hasIntersect = typeof window !== 'undefined' && 'IntersectionObserver' in window;
/* @vue/component */
export default mixins(VResponsive, Themeable).extend({
    name: 'v-img',
    props: {
        alt: String,
        contain: Boolean,
        eager: Boolean,
        gradient: String,
        lazySrc: String,
        options: {
            type: Object,
            // For more information on types, navigate to:
            // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
            default: () => ({
                root: undefined,
                rootMargin: undefined,
                threshold: undefined,
            }),
        },
        position: {
            type: String,
            default: 'center center',
        },
        sizes: String,
        src: {
            type: [String, Object],
            default: '',
        },
        srcset: String,
        transition: {
            type: [Boolean, String],
            default: 'fade-transition',
        },
    },
    emits: ['load', 'error', 'loadstart'],
    data() {
        return {
            currentSrc: '',
            image: null,
            isLoading: true,
            calculatedAspectRatio: undefined,
            naturalWidth: undefined,
            hasError: false,
        };
    },
    computed: {
        computedAspectRatio() {
            return Number(this.normalisedSrc.aspect || this.calculatedAspectRatio);
        },
        normalisedSrc() {
            return this.src && typeof this.src === 'object'
                ? {
                    src: this.src.src,
                    srcset: this.srcset || this.src.srcset,
                    lazySrc: this.lazySrc || this.src.lazySrc,
                    aspect: Number(this.aspectRatio || this.src.aspect),
                } : {
                src: this.src,
                srcset: this.srcset,
                lazySrc: this.lazySrc,
                aspect: Number(this.aspectRatio || 0),
            };
        },
        __cachedImage() {
            if (!(this.normalisedSrc.src || this.normalisedSrc.lazySrc || this.gradient))
                return [];
            const backgroundImage = [];
            const src = this.isLoading ? this.normalisedSrc.lazySrc : this.currentSrc;
            if (this.gradient)
                backgroundImage.push(`linear-gradient(${this.gradient})`);
            if (src)
                backgroundImage.push(`url("${src}")`);
            const image = h('div', {
                class: {
                    'v-image__image--preload': this.isLoading,
                    'v-image__image--contain': this.contain,
                    'v-image__image--cover': !this.contain,
                    'v-image__image': true
                },
                style: {
                    backgroundImage: backgroundImage.join(', '),
                    backgroundPosition: this.position,
                },
                key: +this.isLoading,
            });
            /* istanbul ignore if */
            if (!this.transition)
                return image;
            return h(Transition, {
                name: this.transition,
                mode: 'in-out',
            }, () => [image]);
        },
    },
    watch: {
        src() {
            // Force re-init when src changes
            if (!this.isLoading)
                this.init(undefined, undefined, true);
            else
                this.loadImage();
        },
        '$vuetify.breakpoint.width': 'getSrc',
    },
    mounted() {
        this.init();
    },
    methods: {
        init(entries, observer, isIntersecting) {
            // If the current browser supports the intersection
            // observer api, the image is not observable, and
            // the eager prop isn't being used, do not load
            if (hasIntersect &&
                !isIntersecting &&
                !this.eager)
                return;
            if (this.normalisedSrc.lazySrc) {
                const lazyImg = new Image();
                lazyImg.src = this.normalisedSrc.lazySrc;
                this.pollForSize(lazyImg, null);
            }
            /* istanbul ignore else */
            if (this.normalisedSrc.src)
                this.loadImage();
        },
        onLoad() {
            this.getSrc();
            this.isLoading = false;
            this.$emit('load', this.src);
            if (this.image &&
                (this.normalisedSrc.src.endsWith('.svg') || this.normalisedSrc.src.startsWith('data:image/svg+xml'))) {
                if (this.image.naturalHeight && this.image.naturalWidth) {
                    this.naturalWidth = this.image.naturalWidth;
                    this.calculatedAspectRatio = this.image.naturalWidth / this.image.naturalHeight;
                }
                else {
                    this.calculatedAspectRatio = 1;
                }
            }
        },
        onError() {
            this.hasError = true;
            this.$emit('error', this.src);
        },
        getSrc() {
            /* istanbul ignore else */
            if (this.image)
                this.currentSrc = this.image.currentSrc || this.image.src;
        },
        loadImage() {
            const image = new Image();
            this.image = image;
            image.onload = () => {
                /* istanbul ignore if */
                if (image.decode) {
                    image.decode().catch((err) => {
                        consoleWarn(`Failed to decode image, trying to render anyway\n\n` +
                            `src: ${this.normalisedSrc.src}` +
                            (err.message ? `\nOriginal error: ${err.message}` : ''), this);
                    }).then(this.onLoad);
                }
                else {
                    this.onLoad();
                }
            };
            image.onerror = this.onError;
            this.hasError = false;
            this.sizes && (image.sizes = this.sizes);
            this.normalisedSrc.srcset && (image.srcset = this.normalisedSrc.srcset);
            image.src = this.normalisedSrc.src;
            this.$emit('loadstart', this.normalisedSrc.src);
            this.aspectRatio || this.pollForSize(image);
            this.getSrc();
        },
        pollForSize(img, timeout = 100) {
            const poll = () => {
                const { naturalHeight, naturalWidth } = img;
                if (naturalHeight || naturalWidth) {
                    this.naturalWidth = naturalWidth;
                    this.calculatedAspectRatio = naturalWidth / naturalHeight;
                }
                else if (!img.complete && this.isLoading && !this.hasError && timeout != null) {
                    setTimeout(poll, timeout);
                }
            };
            poll();
        },
        genContent() {
            let content = VResponsive.methods.genContent.call(this);
            if (this.naturalWidth) {
                content = h(content.type, mergeProps(content.props, {
                    style: { width: `${this.naturalWidth}px` },
                }), content.children);
            }
            return content;
        },
        __genPlaceholder() {
            const slot = getSlot(this, 'placeholder');
            if (slot) {
                const placeholder = this.isLoading
                    ? [h('div', {
                            class: 'v-image__placeholder',
                        }, slot)]
                    : [];
                if (!this.transition)
                    return placeholder[0];
                return h(Transition, {
                    appear: true,
                    name: this.transition,
                }, () => placeholder);
            }
        },
    },
    render() {
        let node = VResponsive.render.call(this, h);
        const data = mergeData(node.props, {
            'aria-label': this.alt,
            role: this.alt ? 'img' : undefined,
            class: {
                ...this.themeClasses,
                'v-image': true
            }
        });
        node.children = [
            this.__cachedSizer,
            this.__cachedImage,
            this.__genPlaceholder(),
            this.genContent(),
        ];
        node = h(node.type, data, node.children);
        return withDirectives(node, hasIntersect
            ? [
                [
                    Intersect,
                    {
                        handler: this.init,
                        options: this.options,
                    },
                    '',
                    {
                        once: true
                    }
                ]
            ]
            : []);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkltZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZJbWcvVkltZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFDLE1BQU0sS0FBSyxDQUFBO0FBQzdELFNBQVM7QUFDVCxPQUFPLGFBQWEsQ0FBQTtBQVNwQixhQUFhO0FBQ2IsT0FBTyxXQUFXLE1BQU0sZ0JBQWdCLENBQUE7QUFFeEMsU0FBUztBQUNULE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBRTlDLFFBQVE7QUFDUixPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUN0QyxPQUFPLFNBQVMsTUFBTSxzQkFBc0IsQ0FBQTtBQUM1QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDaEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQzVDLE9BQU8sU0FBUyxNQUFNLDRCQUE0QixDQUFBO0FBVWxELE1BQU0sWUFBWSxHQUFHLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxzQkFBc0IsSUFBSSxNQUFNLENBQUE7QUFFdEYsb0JBQW9CO0FBQ3BCLGVBQWUsTUFBTSxDQUNuQixXQUFXLEVBQ1gsU0FBUyxDQUNWLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLE9BQU87SUFHYixLQUFLLEVBQUU7UUFDTCxHQUFHLEVBQUUsTUFBTTtRQUNYLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLEtBQUssRUFBRSxPQUFPO1FBQ2QsUUFBUSxFQUFFLE1BQU07UUFDaEIsT0FBTyxFQUFFLE1BQU07UUFDZixPQUFPLEVBQUU7WUFDUCxJQUFJLEVBQUUsTUFBTTtZQUNaLDhDQUE4QztZQUM5Qyw2RUFBNkU7WUFDN0UsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ2QsSUFBSSxFQUFFLFNBQVM7Z0JBQ2Ys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QUVGLElBQUksQ0FBQyxRQUFRLEdBQUc7WUFDZCxJQUFJLENBQUMsYUFBYTtZQUNsQixJQUFJLENBQUMsYUFBYTtZQUNsQixJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDdkIsSUFBSSxDQUFDLFVBQVUsRUFBRTtTQUNQLENBQUE7UUFFWixJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUV4QyxPQUFPLGNBQWMsQ0FBQyxJQUFJLEVBQUUsWUFBWTtZQUN0QyxDQUFDLENBQUM7Z0JBQ0E7b0JBQ0UsU0FBUztvQkFDVDt3QkFDRSxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUk7d0JBQ2xCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztxQkFDdEI7b0JBQ0QsRUFBRTtvQkFDRjt3QkFDRSxJQUFJLEVBQUUsSUFBSTtxQkFDWDtpQkFDRjthQUNGO1lBRUQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ1QsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aCwgVHJhbnNpdGlvbiwgd2l0aERpcmVjdGl2ZXMsIG1lcmdlUHJvcHN9IGZyb20gJ3Z1ZSdcbi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZJbWcuc2FzcydcblxuLy8gRGlyZWN0aXZlc1xuaW1wb3J0IGludGVyc2VjdCBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL2ludGVyc2VjdCdcblxuLy8gVHlwZXNcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xuaW1wb3J0IHsgUHJvcFZhbGlkYXRvciB9IGZyb20gJ3Z1ZS90eXBlcy9vcHRpb25zJ1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgVlJlc3BvbnNpdmUgZnJvbSAnLi4vVlJlc3BvbnNpdmUnXG5cbi8vIE1peGluc1xuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xuXG4vLyBVdGlsc1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCBtZXJnZURhdGEgZnJvbSAnLi4vLi4vdXRpbC9tZXJnZURhdGEnXG5pbXBvcnQgeyBjb25zb2xlV2FybiB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcbmltcG9ydCB7IGdldFNsb3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5pbXBvcnQgSW50ZXJzZWN0IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvaW50ZXJzZWN0J1xuXG4vLyBub3QgaW50ZW5kZWQgZm9yIHB1YmxpYyB1c2UsIHRoaXMgaXMgcGFzc2VkIGluIGJ5IHZ1ZXRpZnktbG9hZGVyXG5leHBvcnQgaW50ZXJmYWNlIHNyY09iamVjdCB7XG4gIHNyYzogc3RyaW5nXG4gIHNyY3NldD86IHN0cmluZ1xuICBsYXp5U3JjOiBzdHJpbmdcbiAgYXNwZWN0OiBudW1iZXJcbn1cblxuY29uc3QgaGFzSW50ZXJzZWN0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ0ludGVyc2VjdGlvbk9ic2VydmVyJyBpbiB3aW5kb3dcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcbiAgVlJlc3BvbnNpdmUsXG4gIFRoZW1lYWJsZSxcbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtaW1nJyxcblxuXG4gIHByb3BzOiB7XG4gICAgYWx0OiBTdHJpbmcsXG4gICAgY29udGFpbjogQm9vbGVhbixcbiAgICBlYWdlcjogQm9vbGVhbixcbiAgICBncmFkaWVudDogU3RyaW5nLFxuICAgIGxhenlTcmM6IFN0cmluZyxcbiAgICBvcHRpb25zOiB7XG4gICAgICB0eXBlOiBPYmplY3QsXG4gICAgICAvLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiB0eXBlcywgbmF2aWdhdGUgdG86XG4gICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSW50ZXJzZWN0aW9uX09ic2VydmVyX0FQSVxuICAgICAgZGVmYXVsdDogKCkgPT4gKHtcbiAgICAgICAgcm9vdDogdW5kZWZpbmVkLFxuICAgICAgICByb290TWFyZ2luOiB1bmRlZmluZWQsXG4gICAgICAgIHRocmVzaG9sZDogdW5kZWZpbmVkLFxuICAgICAgfSksXG4gICAgfSBhcyBQcm9wVmFsaWRhdG9yPEludGVyc2VjdGlvbk9ic2VydmVySW5pdD4sXG4gICAgcG9zaXRpb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdjZW50ZXIgY2VudGVyJyxcbiAgICB9LFxuICAgIHNpemVzOiBTdHJpbmcsXG4gICAgc3JjOiB7XG4gICAgICB0eXBlOiBbU3RyaW5nLCBPYmplY3RdLFxuICAgICAgZGVmYXVsdDogJycsXG4gICAgfSBhcyBQcm9wVmFsaWRhdG9yPHN0cmluZyB8IHNyY09iamVjdD4sXG4gICAgc3Jjc2V0OiBTdHJpbmcsXG4gICAgdHJhbnNpdGlvbjoge1xuICAgICAgdHlwZTogW0Jvb2xlYW4sIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAnZmFkZS10cmFuc2l0aW9uJyxcbiAgICB9LFxuICB9LFxuXG4gIGVtaXRzOiBbJ2xvYWQnLCAnZXJyb3InLCAnbG9hZHN0YXJ0J10sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnRTcmM6ICcnLCAvLyBTZXQgZnJvbSBzcmNzZXRcbiAgICAgIGltYWdlOiBudWxsIGFzIEhUTUxJbWFnZUVsZW1lbnQgfCBudWxsLFxuICAgICAgaXNMb2FkaW5nOiB0cnVlLFxuICAgICAgY2FsY3VsYXRlZEFzcGVjdFJhdGlvOiB1bmRlZmluZWQgYXMgbnVtYmVyIHwgdW5kZWZpbmVkLFxuICAgICAgbmF0dXJhbFdpZHRoOiB1bmRlZmluZWQgYXMgbnVtYmVyIHwgdW5kZWZpbmVkLFxuICAgICAgaGFzRXJyb3I6IGZhbHNlLFxuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNvbXB1dGVkQXNwZWN0UmF0aW8gKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gTnVtYmVyKHRoaXMubm9ybWFsaXNlZFNyYy5hc3BlY3QgfHwgdGhpcy5jYWxjdWxhdGVkQXNwZWN0UmF0aW8pXG4gICAgfSxcbiAgICBub3JtYWxpc2VkU3JjICgpOiBzcmNPYmplY3Qge1xuICAgICAgcmV0dXJuIHRoaXMuc3JjICYmIHR5cGVvZiB0aGlzLnNyYyA9PT0gJ29iamVjdCdcbiAgICAgICAgPyB7XG4gICAgICAgICAgc3JjOiB0aGlzLnNyYy5zcmMsXG4gICAgICAgICAgc3Jjc2V0OiB0aGlzLnNyY3NldCB8fCB0aGlzLnNyYy5zcmNzZXQsXG4gICAgICAgICAgbGF6eVNyYzogdGhpcy5sYXp5U3JjIHx8IHRoaXMuc3JjLmxhenlTcmMsXG4gICAgICAgICAgYXNwZWN0OiBOdW1iZXIodGhpcy5hc3BlY3RSYXRpbyB8fCB0aGlzLnNyYy5hc3BlY3QpLFxuICAgICAgICB9IDoge1xuICAgICAgICAgIHNyYzogdGhpcy5zcmMsXG4gICAgICAgICAgc3Jjc2V0OiB0aGlzLnNyY3NldCxcbiAgICAgICAgICBsYXp5U3JjOiB0aGlzLmxhenlTcmMsXG4gICAgICAgICAgYXNwZWN0OiBOdW1iZXIodGhpcy5hc3BlY3RSYXRpbyB8fCAwKSxcbiAgICAgICAgfVxuICAgIH0sXG4gICAgX19jYWNoZWRJbWFnZSAoKTogVk5vZGUgfCBbXSB7XG4gICAgICBpZiAoISh0aGlzLm5vcm1hbGlzZWRTcmMuc3JjIHx8IHRoaXMubm9ybWFsaXNlZFNyYy5sYXp5U3JjIHx8IHRoaXMuZ3JhZGllbnQpKSByZXR1cm4gW11cblxuICAgICAgY29uc3QgYmFja2dyb3VuZEltYWdlOiBzdHJpbmdbXSA9IFtdXG4gICAgICBjb25zdCBzcmMgPSB0aGlzLmlzTG9hZGluZyA/IHRoaXMubm9ybWFsaXNlZFNyYy5sYXp5U3JjIDogdGhpcy5jdXJyZW50U3JjXG5cbiAgICAgIGlmICh0aGlzLmdyYWRpZW50KSBiYWNrZ3JvdW5kSW1hZ2UucHVzaChgbGluZWFyLWdyYWRpZW50KCR7dGhpcy5ncmFkaWVudH0pYClcbiAgICAgIGlmIChzcmMpIGJhY2tncm91bmRJbWFnZS5wdXNoKGB1cmwoXCIke3NyY31cIilgKVxuXG4gICAgICBjb25zdCBpbWFnZSA9IGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IHtcbiAgICAgICAgICAndi1pbWFnZV9faW1hZ2UtLXByZWxvYWQnOiB0aGlzLmlzTG9hZGluZyxcbiAgICAgICAgICAndi1pbWFnZV9faW1hZ2UtLWNvbnRhaW4nOiB0aGlzLmNvbnRhaW4sXG4gICAgICAgICAgJ3YtaW1hZ2VfX2ltYWdlLS1jb3Zlcic6ICF0aGlzLmNvbnRhaW4sXG4gICAgICAgICAgJ3YtaW1hZ2VfX2ltYWdlJzogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIGJhY2tncm91bmRJbWFnZTogYmFja2dyb3VuZEltYWdlLmpvaW4oJywgJyksXG4gICAgICAgICAgYmFja2dyb3VuZFBvc2l0aW9uOiB0aGlzLnBvc2l0aW9uLFxuICAgICAgICB9LFxuICAgICAgICBrZXk6ICt0aGlzLmlzTG9hZGluZyxcbiAgICAgIH0pXG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKCF0aGlzLnRyYW5zaXRpb24pIHJldHVybiBpbWFnZVxuXG4gICAgICByZXR1cm4gaChUcmFuc2l0aW9uLCB7XG4gICAgICAgIG5hbWU6IHRoaXMudHJhbnNpdGlvbixcbiAgICAgICAgbW9kZTogJ2luLW91dCcsXG4gICAgICB9LCAoKSA9PiBbaW1hZ2VdKVxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBzcmMgKCkge1xuICAgICAgLy8gRm9yY2UgcmUtaW5pdCB3aGVuIHNyYyBjaGFuZ2VzXG4gICAgICBpZiAoIXRoaXMuaXNMb2FkaW5nKSB0aGlzLmluaXQodW5kZWZpbmVkLCB1bmRlZmluZWQsIHRydWUpXG4gICAgICBlbHNlIHRoaXMubG9hZEltYWdlKClcbiAgICB9LFxuICAgICckdnVldGlmeS5icmVha3BvaW50LndpZHRoJzogJ2dldFNyYycsXG4gIH0sXG5cbiAgbW91bnRlZCAoKSB7XG4gICAgdGhpcy5pbml0KClcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgaW5pdCAoXG4gICAgICBlbnRyaWVzPzogSW50ZXJzZWN0aW9uT2JzZXJ2ZXJFbnRyeVtdLFxuICAgICAgb2JzZXJ2ZXI/OiBJbnRlcnNlY3Rpb25PYnNlcnZlcixcbiAgICAgIGlzSW50ZXJzZWN0aW5nPzogYm9vbGVhblxuICAgICkge1xuICAgICAgLy8gSWYgdGhlIGN1cnJlbnQgYnJvd3NlciBzdXBwb3J0cyB0aGUgaW50ZXJzZWN0aW9uXG4gICAgICAvLyBvYnNlcnZlciBhcGksIHRoZSBpbWFnZSBpcyBub3Qgb2JzZXJ2YWJsZSwgYW5kXG4gICAgICAvLyB0aGUgZWFnZXIgcHJvcCBpc24ndCBiZWluZyB1c2VkLCBkbyBub3QgbG9hZFxuICAgICAgaWYgKFxuICAgICAgICBoYXNJbnRlcnNlY3QgJiZcbiAgICAgICAgIWlzSW50ZXJzZWN0aW5nICYmXG4gICAgICAgICF0aGlzLmVhZ2VyXG4gICAgICApIHJldHVyblxuXG4gICAgICBpZiAodGhpcy5ub3JtYWxpc2VkU3JjLmxhenlTcmMpIHtcbiAgICAgICAgY29uc3QgbGF6eUltZyA9IG5ldyBJbWFnZSgpXG4gICAgICAgIGxhenlJbWcuc3JjID0gdGhpcy5ub3JtYWxpc2VkU3JjLmxhenlTcmNcbiAgICAgICAgdGhpcy5wb2xsRm9yU2l6ZShsYXp5SW1nLCBudWxsKVxuICAgICAgfVxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmICh0aGlzLm5vcm1hbGlzZWRTcmMuc3JjKSB0aGlzLmxvYWRJbWFnZSgpXG4gICAgfSxcbiAgICBvbkxvYWQgKCkge1xuICAgICAgdGhpcy5nZXRTcmMoKVxuICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxuICAgICAgdGhpcy4kZW1pdCgnbG9hZCcsIHRoaXMuc3JjKVxuXG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuaW1hZ2UgJiZcbiAgICAgICAgKHRoaXMubm9ybWFsaXNlZFNyYy5zcmMuZW5kc1dpdGgoJy5zdmcnKSB8fCB0aGlzLm5vcm1hbGlzZWRTcmMuc3JjLnN0YXJ0c1dpdGgoJ2RhdGE6aW1hZ2Uvc3ZnK3htbCcpKVxuICAgICAgKSB7XG4gICAgICAgIGlmICh0aGlzLmltYWdlLm5hdHVyYWxIZWlnaHQgJiYgdGhpcy5pbWFnZS5uYXR1cmFsV2lkdGgpIHtcbiAgICAgICAgICB0aGlzLm5hdHVyYWxXaWR0aCA9IHRoaXMuaW1hZ2UubmF0dXJhbFdpZHRoXG4gICAgICAgICAgdGhpcy5jYWxjdWxhdGVkQXNwZWN0UmF0aW8gPSB0aGlzLmltYWdlLm5hdHVyYWxXaWR0aCAvIHRoaXMuaW1hZ2UubmF0dXJhbEhlaWdodFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY2FsY3VsYXRlZEFzcGVjdFJhdGlvID0gMVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBvbkVycm9yICgpIHtcbiAgICAgIHRoaXMuaGFzRXJyb3IgPSB0cnVlXG4gICAgICB0aGlzLiRlbWl0KCdlcnJvcicsIHRoaXMuc3JjKVxuICAgIH0sXG4gICAgZ2V0U3JjICgpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAodGhpcy5pbWFnZSkgdGhpcy5jdXJyZW50U3JjID0gdGhpcy5pbWFnZS5jdXJyZW50U3JjIHx8IHRoaXMuaW1hZ2Uuc3JjXG4gICAgfSxcbiAgICBsb2FkSW1hZ2UgKCkge1xuICAgICAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICAgICAgdGhpcy5pbWFnZSA9IGltYWdlXG5cbiAgICAgIGltYWdlLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmIChpbWFnZS5kZWNvZGUpIHtcbiAgICAgICAgICBpbWFnZS5kZWNvZGUoKS5jYXRjaCgoZXJyOiBET01FeGNlcHRpb24pID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGVXYXJuKFxuICAgICAgICAgICAgICBgRmFpbGVkIHRvIGRlY29kZSBpbWFnZSwgdHJ5aW5nIHRvIHJlbmRlciBhbnl3YXlcXG5cXG5gICtcbiAgICAgICAgICAgICAgYHNyYzogJHt0aGlzLm5vcm1hbGlzZWRTcmMuc3JjfWAgK1xuICAgICAgICAgICAgICAoZXJyLm1lc3NhZ2UgPyBgXFxuT3JpZ2luYWwgZXJyb3I6ICR7ZXJyLm1lc3NhZ2V9YCA6ICcnKSxcbiAgICAgICAgICAgICAgdGhpc1xuICAgICAgICAgICAgKVxuICAgICAgICAgIH0pLnRoZW4odGhpcy5vbkxvYWQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vbkxvYWQoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpbWFnZS5vbmVycm9yID0gdGhpcy5vbkVycm9yXG5cbiAgICAgIHRoaXMuaGFzRXJyb3IgPSBmYWxzZVxuICAgICAgdGhpcy5zaXplcyAmJiAoaW1hZ2Uuc2l6ZXMgPSB0aGlzLnNpemVzKVxuICAgICAgdGhpcy5ub3JtYWxpc2VkU3JjLnNyY3NldCAmJiAoaW1hZ2Uuc3Jjc2V0ID0gdGhpcy5ub3JtYWxpc2VkU3JjLnNyY3NldClcbiAgICAgIGltYWdlLnNyYyA9IHRoaXMubm9ybWFsaXNlZFNyYy5zcmNcbiAgICAgIHRoaXMuJGVtaXQoJ2xvYWRzdGFydCcsIHRoaXMubm9ybWFsaXNlZFNyYy5zcmMpXG5cbiAgICAgIHRoaXMuYXNwZWN0UmF0aW8gfHwgdGhpcy5wb2xsRm9yU2l6ZShpbWFnZSlcbiAgICAgIHRoaXMuZ2V0U3JjKClcbiAgICB9LFxuICAgIHBvbGxGb3JTaXplIChpbWc6IEhUTUxJbWFnZUVsZW1lbnQsIHRpbWVvdXQ6IG51bWJlciB8IG51bGwgPSAxMDApIHtcbiAgICAgIGNvbnN0IHBvbGwgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgbmF0dXJhbEhlaWdodCwgbmF0dXJhbFdpZHRoIH0gPSBpbWdcblxuICAgICAgICBpZiAobmF0dXJhbEhlaWdodCB8fCBuYXR1cmFsV2lkdGgpIHtcbiAgICAgICAgICB0aGlzLm5hdHVyYWxXaWR0aCA9IG5hdHVyYWxXaWR0aFxuICAgICAgICAgIHRoaXMuY2FsY3VsYXRlZEFzcGVjdFJhdGlvID0gbmF0dXJhbFdpZHRoIC8gbmF0dXJhbEhlaWdodFxuICAgICAgICB9IGVsc2UgaWYgKCFpbWcuY29tcGxldGUgJiYgdGhpcy5pc0xvYWRpbmcgJiYgIXRoaXMuaGFzRXJyb3IgJiYgdGltZW91dCAhPSBudWxsKSB7XG4gICAgICAgICAgc2V0VGltZW91dChwb2xsLCB0aW1lb3V0KVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHBvbGwoKVxuICAgIH0sXG4gICAgZ2VuQ29udGVudCAoKSB7XG4gICAgICBsZXQgY29udGVudDogVk5vZGUgPSBWUmVzcG9uc2l2ZS5tZXRob2RzLmdlbkNvbnRlbnQuY2FsbCh0aGlzKVxuXG4gICAgICBpZiAodGhpcy5uYXR1cmFsV2lkdGgpIHtcbiAgICAgICAgY29udGVudCA9IGgoY29udGVudC50eXBlLCBtZXJnZVByb3BzKGNvbnRlbnQucHJvcHMsIHtcbiAgICAgICAgICBzdHlsZTogeyB3aWR0aDogYCR7dGhpcy5uYXR1cmFsV2lkdGh9cHhgIH0sXG4gICAgICAgIH0pLCBjb250ZW50LmNoaWxkcmVuKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29udGVudFxuICAgIH0sXG4gICAgX19nZW5QbGFjZWhvbGRlciAoKTogVk5vZGUgfCB2b2lkIHtcbiAgICAgIGNvbnN0IHNsb3QgPSBnZXRTbG90KHRoaXMsICdwbGFjZWhvbGRlcicpXG4gICAgICBpZiAoc2xvdCkge1xuICAgICAgICBjb25zdCBwbGFjZWhvbGRlciA9IHRoaXMuaXNMb2FkaW5nXG4gICAgICAgICAgPyBbaCgnZGl2Jywge1xuICAgICAgICAgICAgY2xhc3M6ICd2LWltYWdlX19wbGFjZWhvbGRlcicsXG4gICAgICAgICAgfSwgc2xvdCldXG4gICAgICAgICAgOiBbXVxuXG4gICAgICAgIGlmICghdGhpcy50cmFuc2l0aW9uKSByZXR1cm4gcGxhY2Vob2xkZXJbMF1cblxuICAgICAgICByZXR1cm4gaChUcmFuc2l0aW9uLCB7XG4gICAgICAgICAgYXBwZWFyOiB0cnVlLFxuICAgICAgICAgIG5hbWU6IHRoaXMudHJhbnNpdGlvbixcbiAgICAgICAgfSwgKCkgPT4gcGxhY2Vob2xkZXIpXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKCk6IFZOb2RlIHtcbiAgICBsZXQgbm9kZSA9IFZSZXNwb25zaXZlLnJlbmRlci5jYWxsKHRoaXMsIGgpXG5cbiAgICBjb25zdCBkYXRhID0gbWVyZ2VEYXRhKG5vZGUucHJvcHMsIHtcbiAgICAgICdhcmlhLWxhYmVsJzogdGhpcy5hbHQsXG4gICAgICByb2xlOiB0aGlzLmFsdCA/ICdpbWcnIDogdW5kZWZpbmVkLFxuICAgICAgY2xhc3M6ICB7XG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzLFxuICAgICAgICAndi1pbWFnZSc6IHRydWVcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgbm9kZS5jaGlsZHJlbiA9IFtcbiAgICAgIHRoaXMuX19jYWNoZWRTaXplcixcbiAgICAgIHRoaXMuX19jYWNoZWRJbWFnZSxcbiAgICAgIHRoaXMuX19nZW5QbGFjZWhvbGRlcigpLFxuICAgICAgdGhpcy5nZW5Db250ZW50KCksXG4gICAgXSBhcyBWTm9kZVtdXG5cbiAgICBub2RlID0gaChub2RlLnR5cGUsIGRhdGEsIG5vZGUuY2hpbGRyZW4pXG5cbiAgICByZXR1cm4gd2l0aERpcmVjdGl2ZXMobm9kZSwgaGFzSW50ZXJzZWN0XG4gICAgICA/IFtcbiAgICAgICAgW1xuICAgICAgICAgIEludGVyc2VjdCxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBoYW5kbGVyOiB0aGlzLmluaXQsXG4gICAgICAgICAgICBvcHRpb25zOiB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnJyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBvbmNlOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICBdXG5cbiAgICAgIDogW10pXG4gIH0sXG59KVxuIl19