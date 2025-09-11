import { h, Transition, vShow, withDirectives } from 'vue';
// Styles
import './VMenu.sass';
// Components
import { VThemeProvider } from '../VThemeProvider';
// Mixins
import Activatable from '../../mixins/activatable';
import Delayable from '../../mixins/delayable';
import Dependent from '../../mixins/dependent';
import Menuable from '../../mixins/menuable';
import Returnable from '../../mixins/returnable';
import Roundable from '../../mixins/roundable';
import Themeable from '../../mixins/themeable';
// Directives
import ClickOutside from '../../directives/click-outside';
import Resize from '../../directives/resize';
// Utilities
import mixins from '../../util/mixins';
import { removed, breaking } from '../../util/console';
import { convertToUnit, keyCodes, } from '../../util/helpers';
import goTo from '../../services/goto';
const baseMixins = mixins(Dependent, Delayable, Returnable, Roundable, Themeable, Menuable);
/* @vue/component */
export default baseMixins.extend({
    name: 'v-menu',
    provide() {
        return {
            isInMenu: true,
            // Pass theme through to default slot
            theme: this.theme,
        };
    },
    props: {
        auto: Boolean,
        closeOnClick: {
            type: Boolean,
            default: true,
        },
        closeOnContentClick: {
            type: Boolean,
            default: true,
        },
        disabled: Boolean,
        disableKeys: Boolean,
        maxHeight: {
            type: [Number, String],
            default: 'auto',
        },
        offsetX: Boolean,
        offsetY: Boolean,
        openOnHover: Boolean,
        origin: {
            type: String,
            default: 'top left',
        },
        transition: {
            type: [Boolean, String],
            default: 'v-menu-transition',
        },
        contentProps: {
            type: Object,
            default: () => ({}),
        },
        onScroll: {
            type: Function,
            default: undefined,
        },
    },
    emits: [
        'keydown',
        'update:modelValue',
        'update:return-value',
    ],
    data() {
        return {
            calculatedTopAuto: 0,
            defaultOffset: 8,
            hasJustFocused: false,
            listIndex: -1,
            resizeTimeout: 0,
            selectedIndex: null,
            tiles: [],
        };
    },
    computed: {
        activeTile() {
            return this.tiles[this.listIndex];
        },
        calculatedLeft() {
            const menuWidth = Math.max(this.dimensions.content.width, parseFloat(this.calculatedMinWidth));
            if (!this.auto)
                return this.calcLeft(menuWidth) || '0';
            return convertToUnit(this.calcXOverflow(this.calcLeftAuto(), menuWidth)) || '0';
        },
        calculatedMaxHeight() {
            const height = this.auto
                ? '220px'
                : convertToUnit(this.maxHeight);
            return height || '0';
        },
        calculatedMaxWidth() {
            return convertToUnit(this.maxWidth) || '0';
        },
        calculatedMinWidth() {
            if (this.minWidth) {
                return convertToUnit(this.minWidth) || '0';
            }
            const minWidth = Math.min(this.dimensions.activator.width +
                Number(this.nudgeWidth) +
                (this.auto ? 16 : 0), Math.max(this.pageWidth - 24, 0));
            const calculatedMaxWidth = isNaN(parseInt(this.calculatedMaxWidth))
                ? minWidth
                : parseInt(this.calculatedMaxWidth);
            return convertToUnit(Math.min(calculatedMaxWidth, minWidth)) || '0';
        },
        calculatedTop() {
            const top = !this.auto
                ? this.calcTop()
                : convertToUnit(this.calcYOverflow(this.calculatedTopAuto));
            return top || '0';
        },
        hasClickableTiles() {
            return Boolean(this.tiles.find(tile => tile.tabIndex > -1));
        },
        styles() {
            return {
                maxHeight: this.calculatedMaxHeight,
                minWidth: this.calculatedMinWidth,
                maxWidth: this.calculatedMaxWidth,
                top: this.calculatedTop,
                left: this.calculatedLeft,
                transformOrigin: this.origin,
                zIndex: this.zIndex || this.activeZIndex,
            };
        },
    },
    watch: {
        isActive(val) {
            if (!val)
                this.listIndex = -1;
        },
        isContentActive(val) {
            this.hasJustFocused = val;
        },
        listIndex(next, prev) {
            if (next in this.tiles) {
                const tile = this.tiles[next];
                tile.classList.add('v-list-item--highlighted');
                const scrollTop = this.$refs.content.scrollTop;
                const contentHeight = this.$refs.content.clientHeight;
                if (scrollTop > tile.offsetTop - 8) {
                    goTo(tile.offsetTop - tile.clientHeight, {
                        appOffset: false,
                        duration: 300,
                        container: this.$refs.content,
                    });
                }
                else if (scrollTop + contentHeight < tile.offsetTop + tile.clientHeight + 8) {
                    goTo(tile.offsetTop - contentHeight + tile.clientHeight * 2, {
                        appOffset: false,
                        duration: 300,
                        container: this.$refs.content,
                    });
                }
            }
            prev in this.tiles &&
                this.tiles[prev].classList.remove('v-list-item--highlighted');
        },
    },
    created() {
        const breakingProps = [
            ['value', 'modelValue'],
            ['onInput', 'onUpdate:modelValue'],
        ];
        /* istanbul ignore next */
        breakingProps.forEach(([original, replacement]) => {
            if (this.$attrs.hasOwnProperty(original))
                breaking(original, replacement, this);
        });
        /* istanbul ignore next */
        if (this.$attrs.hasOwnProperty('full-width')) {
            removed('full-width', this);
        }
    },
    mounted() {
        this.isActive && this.callActivate();
    },
    methods: {
        activate() {
            // Update coordinates and dimensions of menu
            // and its activator
            this.updateDimensions();
            // Start the transition
            requestAnimationFrame(() => {
                // Once transitioning, calculate scroll and top position
                this.startTransition().then(() => {
                    if (this.$refs.content) {
                        this.calculatedTopAuto = this.calcTopAuto();
                        this.auto && (this.$refs.content.scrollTop = this.calcScrollPosition());
                    }
                });
            });
        },
        calcScrollPosition() {
            const $el = this.$refs.content;
            const activeTile = $el.querySelector('.v-list-item--active');
            const maxScrollTop = $el.scrollHeight - $el.offsetHeight;
            return activeTile
                ? Math.min(maxScrollTop, Math.max(0, activeTile.offsetTop - $el.offsetHeight / 2 + activeTile.offsetHeight / 2))
                : $el.scrollTop;
        },
        calcLeftAuto() {
            return parseInt(this.dimensions.activator.left - this.defaultOffset * 2);
        },
        calcTopAuto() {
            const $el = this.$refs.content;
            const activeTile = $el.querySelector('.v-list-item--active');
            if (!activeTile) {
                this.selectedIndex = null;
            }
            if (this.offsetY || !activeTile) {
                return this.computedTop;
            }
            this.selectedIndex = Array.from(this.tiles).indexOf(activeTile);
            const tileDistanceFromMenuTop = activeTile.offsetTop - this.calcScrollPosition();
            const firstTileOffsetTop = $el.querySelector('.v-list-item').offsetTop;
            return this.computedTop - tileDistanceFromMenuTop - firstTileOffsetTop - 1;
        },
        changeListIndex(e) {
            // For infinite scroll and autocomplete, re-evaluate children
            this.getTiles();
            if (!this.isActive || !this.hasClickableTiles) {
                return;
            }
            else if (e.keyCode === keyCodes.tab) {
                this.isActive = false;
                return;
            }
            else if (e.keyCode === keyCodes.down) {
                this.nextTile();
            }
            else if (e.keyCode === keyCodes.up) {
                this.prevTile();
            }
            else if (e.keyCode === keyCodes.end) {
                this.lastTile();
            }
            else if (e.keyCode === keyCodes.home) {
                this.firstTile();
            }
            else if (e.keyCode === keyCodes.enter && this.listIndex !== -1) {
                this.tiles[this.listIndex].click();
            }
            else {
                return;
            }
            // One of the conditions was met, prevent default action (#2988)
            e.preventDefault();
        },
        closeConditional(e) {
            const target = e.target;
            return this.isActive &&
                !this._isDestroyed &&
                this.closeOnClick &&
                this.$refs.content &&
                !this.$refs.content.contains(target);
        },
        genActivatorAttributes() {
            const attributes = Activatable.methods.genActivatorAttributes.call(this);
            if (this.activeTile && this.activeTile.id) {
                return {
                    ...attributes,
                    'aria-activedescendant': this.activeTile.id,
                };
            }
            return attributes;
        },
        genActivatorListeners() {
            const listeners = Menuable.methods.genActivatorListeners.call(this);
            if (!this.disableKeys) {
                listeners.onKeydown = this.onKeyDown;
            }
            return listeners;
        },
        genTransition() {
            const content = this.genContent();
            if (!this.transition)
                return content;
            return h(Transition, {
                name: this.transition
            }, [content]);
        },
        genDirectives() {
            const directives = [[
                    vShow,
                    this.isContentActive
                ]];
            // Do not add click outside for hover menu
            if (!this.openOnHover && this.closeOnClick) {
                directives.push([
                    ClickOutside,
                    {
                        handler: () => { this.isActive = false; },
                        closeConditional: this.closeConditional,
                        include: () => [this.$el, ...this.getOpenDependentElements()],
                    },
                ]);
            }
            return directives;
        },
        genContent() {
            const options = {
                ...this.getScopeIdAttrs(),
                ...this.contentProps,
                role: 'role' in this.$attrs ? this.$attrs.role : 'menu',
                class: ['v-menu__content', {
                        ...this.rootThemeClasses,
                        ...this.roundedClasses,
                        'v-menu__content--auto': this.auto,
                        'v-menu__content--fixed': this.activatorFixed,
                        menuable__content__active: this.isActive,
                        [this.contentClass.trim()]: true,
                    }],
                style: this.styles,
                ref: 'content',
                onClick: (e) => {
                    const target = e.target;
                    if (target.getAttribute('disabled'))
                        return;
                    if (this.closeOnContentClick)
                        this.isActive = false;
                },
                onKeydown: this.onKeyDown,
            };
            if (this.onScroll) {
                options.onScroll = this.onScroll;
            }
            if (!this.disabled && this.openOnHover) {
                options.onMouseenter = this.mouseEnterHandler;
            }
            if (this.openOnHover) {
                options.onMouseleave = this.mouseLeaveHandler;
            }
            const directives = this.genDirectives();
            return withDirectives(h('div', options, this.getContentSlot()), directives);
        },
        getTiles() {
            if (!this.$refs.content)
                return;
            this.tiles = Array.from(this.$refs.content.querySelectorAll('.v-list-item, .v-divider, .v-subheader'));
        },
        mouseEnterHandler() {
            this.runDelay('open', () => {
                if (this.hasJustFocused)
                    return;
                this.hasJustFocused = true;
            });
        },
        mouseLeaveHandler(e) {
            // Prevent accidental re-activation
            this.runDelay('close', () => {
                var _a;
                if ((_a = this.$refs.content) === null || _a === void 0 ? void 0 : _a.contains(e.relatedTarget))
                    return;
                requestAnimationFrame(() => {
                    this.isActive = false;
                    this.callDeactivate();
                });
            });
        },
        nextTile() {
            const tile = this.tiles[this.listIndex + 1];
            if (!tile) {
                if (!this.tiles.length)
                    return;
                this.listIndex = -1;
                this.nextTile();
                return;
            }
            this.listIndex++;
            if (tile.tabIndex === -1)
                this.nextTile();
        },
        prevTile() {
            const tile = this.tiles[this.listIndex - 1];
            if (!tile) {
                if (!this.tiles.length)
                    return;
                this.listIndex = this.tiles.length;
                this.prevTile();
                return;
            }
            this.listIndex--;
            if (tile.tabIndex === -1)
                this.prevTile();
        },
        lastTile() {
            const tile = this.tiles[this.tiles.length - 1];
            if (!tile)
                return;
            this.listIndex = this.tiles.length - 1;
            if (tile.tabIndex === -1)
                this.prevTile();
        },
        firstTile() {
            const tile = this.tiles[0];
            if (!tile)
                return;
            this.listIndex = 0;
            if (tile.tabIndex === -1)
                this.nextTile();
        },
        onKeyDown(e) {
            if (this.disableKeys)
                return;
            if (e.keyCode === keyCodes.esc) {
                // Wait for dependent elements to close first
                setTimeout(() => { this.isActive = false; });
                const activator = this.getActivator();
                this.$nextTick(() => activator && activator.focus());
            }
            else if (!this.isActive &&
                [keyCodes.up, keyCodes.down].includes(e.keyCode)) {
                this.isActive = true;
            }
            // Allow for isActive watcher to generate tile list
            this.$nextTick(() => this.changeListIndex(e));
        },
        onResize() {
            if (!this.isActive)
                return;
            // Account for screen resize
            // and orientation change
            // eslint-disable-next-line no-unused-expressions
            this.$refs.content.offsetWidth;
            this.updateDimensions();
            // When resizing to a smaller width
            // content width is evaluated before
            // the new activator width has been
            // set, causing it to not size properly
            // hacky but will revisit in the future
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = window.setTimeout(this.updateDimensions, 100);
        },
    },
    render() {
        const data = {
            class: ['v-menu', {
                    'v-menu--attached': this.attach === '' ||
                        this.attach === true ||
                        this.attach === 'attach',
                }]
        };
        const directives = [[
                Resize,
                this.onResize,
                '500'
            ]];
        // console.log('vmenurender', this, this.activator, this.getActivator())
        return withDirectives(h('div', data, [
            !this.activator && this.genActivator(),
            this.showLazyContent(() => [
                h(VThemeProvider, {
                    root: true,
                    light: this.light,
                    dark: this.dark,
                }, [this.genTransition()]),
            ]),
        ]), directives);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVk1lbnUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WTWVudS9WTWVudS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBQzFELFNBQVM7QUFDVCxPQUFPLGNBQWMsQ0FBQTtBQUVyQixhQUFhO0FBQ2IsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBRWxELFNBQVM7QUFDVCxPQUFPLFdBQVcsTUFBTSwwQkFBMEIsQ0FBQTtBQUNsRCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUM1QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxhQUFhO0FBQ2IsT0FBTyxZQUFZLE1BQU0sZ0NBQWdDLENBQUE7QUFDekQsT0FBTyxNQUFNLE1BQU0seUJBQXlCLENBQUE7QUFFNUMsWUFBWTtBQUNaLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBQ3RDLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDdEQsT0FBTyxFQUNMLGFBQWEsRUFDYixRQUFRLEdBQ1QsTUFBTSxvQkFBb0IsQ0FBQTtBQUMzQixPQUFPLElBQUksTUFBTSxxQkFBcUIsQ0FBQTtBQUt0QyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQ3ZCLFNBQVMsRUFDVCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFNBQVMsRUFDVCxTQUFTLEVBQ1QsUUFBUSxDQUNULENBQUE7QUFFRCxvQkFBb0I7QUFDcEIsZUFBZSxVQUFV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QUFNLFVBQVUsR0FBRyxDQUFDO2dCQUNsQixNQUFNO2dCQUNOLElBQUksQ0FBQyxRQUFRO2dCQUNiLEtBQUs7YUFDTixDQUFDLENBQUE7UUFFRix3RUFBd0U7UUFFeEUsT0FBTyxjQUFjLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7WUFDbkMsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDekIsQ0FBQyxDQUFDLGNBQWMsRUFBRTtvQkFDaEIsSUFBSSxFQUFFLElBQUk7b0JBQ1YsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO29CQUNqQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7aUJBQ2hCLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQzthQUMzQixDQUFDO1NBQ0gsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFBO0lBQ2pCLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoLCBUcmFuc2l0aW9uLCB2U2hvdywgd2l0aERpcmVjdGl2ZXMgfSBmcm9tICd2dWUnXG4vLyBTdHlsZXNcbmltcG9ydCAnLi9WTWVudS5zYXNzJ1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgeyBWVGhlbWVQcm92aWRlciB9IGZyb20gJy4uL1ZUaGVtZVByb3ZpZGVyJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBBY3RpdmF0YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvYWN0aXZhdGFibGUnXG5pbXBvcnQgRGVsYXlhYmxlIGZyb20gJy4uLy4uL21peGlucy9kZWxheWFibGUnXG5pbXBvcnQgRGVwZW5kZW50IGZyb20gJy4uLy4uL21peGlucy9kZXBlbmRlbnQnXG5pbXBvcnQgTWVudWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL21lbnVhYmxlJ1xuaW1wb3J0IFJldHVybmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3JldHVybmFibGUnXG5pbXBvcnQgUm91bmRhYmxlIGZyb20gJy4uLy4uL21peGlucy9yb3VuZGFibGUnXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXG5cbi8vIERpcmVjdGl2ZXNcbmltcG9ydCBDbGlja091dHNpZGUgZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9jbGljay1vdXRzaWRlJ1xuaW1wb3J0IFJlc2l6ZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3Jlc2l6ZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuaW1wb3J0IHsgcmVtb3ZlZCwgYnJlYWtpbmcgfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXG5pbXBvcnQge1xuICBjb252ZXJ0VG9Vbml0LFxuICBrZXlDb2Rlcyxcbn0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IGdvVG8gZnJvbSAnLi4vLi4vc2VydmljZXMvZ290bydcblxuLy8gVHlwZXNcbmltcG9ydCB7IFZOb2RlLCBWTm9kZURpcmVjdGl2ZSwgVk5vZGVEYXRhLCBQcm9wVHlwZSB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgYmFzZU1peGlucyA9IG1peGlucyhcbiAgRGVwZW5kZW50LFxuICBEZWxheWFibGUsXG4gIFJldHVybmFibGUsXG4gIFJvdW5kYWJsZSxcbiAgVGhlbWVhYmxlLFxuICBNZW51YWJsZSxcbilcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGJhc2VNaXhpbnMuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtbWVudScsXG5cbiAgcHJvdmlkZSAoKTogb2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgaXNJbk1lbnU6IHRydWUsXG4gICAgICAvLyBQYXNzIHRoZW1lIHRocm91Z2ggdG8gZGVmYXVsdCBzbG90XG4gICAgICB0aGVtZTogdGhpcy50aGVtZSxcbiAgICB9XG4gIH0sXG5cbiAgcHJvcHM6IHtcbiAgICBhdXRvOiBCb29sZWFuLFxuICAgIGNsb3NlT25DbGljazoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgICBjbG9zZU9uQ29udGVudENsaWNrOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB9LFxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxuICAgIGRpc2FibGVLZXlzOiBCb29sZWFuLFxuICAgIG1heEhlaWdodDoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6ICdhdXRvJyxcbiAgICB9LFxuICAgIG9mZnNldFg6IEJvb2xlYW4sXG4gICAgb2Zmc2V0WTogQm9vbGVhbixcbiAgICBvcGVuT25Ib3ZlcjogQm9vbGVhbixcbiAgICBvcmlnaW46IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICd0b3AgbGVmdCcsXG4gICAgfSxcbiAgICB0cmFuc2l0aW9uOiB7XG4gICAgICB0eXBlOiBbQm9vbGVhbiwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6ICd2LW1lbnUtdHJhbnNpdGlvbicsXG4gICAgfSxcbiAgICBjb250ZW50UHJvcHM6IHtcbiAgICAgIHR5cGU6IE9iamVjdCBhcyBQcm9wVHlwZTxSZWNvcmQ8c3RyaW5nLCBhbnk+PixcbiAgICAgIGRlZmF1bHQ6ICgpID0+ICh7fSksXG4gICAgfSxcbiAgICBvblNjcm9sbDoge1xuICAgICAgdHlwZTogRnVuY3Rpb24gYXMgUHJvcFR5cGU8KGV2ZW50OiBFdmVudCkgPT4gdm9pZD4sXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgfSxcbiAgfSxcblxuICBlbWl0czogW1xuICAgICdrZXlkb3duJyxcbiAgICAndXBkYXRlOm1vZGVsVmFsdWUnLFxuICAgICd1cGRhdGU6cmV0dXJuLXZhbHVlJyxcbiAgXSxcblxuICBkYXRhICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY2FsY3VsYXRlZFRvcEF1dG86IDAsXG4gICAgICBkZWZhdWx0T2Zmc2V0OiA4LFxuICAgICAgaGFzSnVzdEZvY3VzZWQ6IGZhbHNlLFxuICAgICAgbGlzdEluZGV4OiAtMSxcbiAgICAgIHJlc2l6ZVRpbWVvdXQ6IDAsXG4gICAgICBzZWxlY3RlZEluZGV4OiBudWxsIGFzIG51bGwgfCBudW1iZXIsXG4gICAgICB0aWxlczogW10gYXMgSFRNTEVsZW1lbnRbXSxcbiAgICB9XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBhY3RpdmVUaWxlICgpOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZCB7XG4gICAgICByZXR1cm4gdGhpcy50aWxlc1t0aGlzLmxpc3RJbmRleF1cbiAgICB9LFxuICAgIGNhbGN1bGF0ZWRMZWZ0ICgpOiBzdHJpbmcge1xuICAgICAgY29uc3QgbWVudVdpZHRoID0gTWF0aC5tYXgodGhpcy5kaW1lbnNpb25zLmNvbnRlbnQud2lkdGgsIHBhcnNlRmxvYXQodGhpcy5jYWxjdWxhdGVkTWluV2lkdGgpKVxuXG4gICAgICBpZiAoIXRoaXMuYXV0bykgcmV0dXJuIHRoaXMuY2FsY0xlZnQobWVudVdpZHRoKSB8fCAnMCdcblxuICAgICAgcmV0dXJuIGNvbnZlcnRUb1VuaXQodGhpcy5jYWxjWE92ZXJmbG93KHRoaXMuY2FsY0xlZnRBdXRvKCksIG1lbnVXaWR0aCkpIHx8ICcwJ1xuICAgIH0sXG4gICAgY2FsY3VsYXRlZE1heEhlaWdodCAoKTogc3RyaW5nIHtcbiAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuYXV0b1xuICAgICAgICA/ICcyMjBweCdcbiAgICAgICAgOiBjb252ZXJ0VG9Vbml0KHRoaXMubWF4SGVpZ2h0KVxuXG4gICAgICByZXR1cm4gaGVpZ2h0IHx8ICcwJ1xuICAgIH0sXG4gICAgY2FsY3VsYXRlZE1heFdpZHRoICgpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuIGNvbnZlcnRUb1VuaXQodGhpcy5tYXhXaWR0aCkgfHwgJzAnXG4gICAgfSxcbiAgICBjYWxjdWxhdGVkTWluV2lkdGggKCk6IHN0cmluZyB7XG4gICAgICBpZiAodGhpcy5taW5XaWR0aCkge1xuICAgICAgICByZXR1cm4gY29udmVydFRvVW5pdCh0aGlzLm1pbldpZHRoKSB8fCAnMCdcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWluV2lkdGggPSBNYXRoLm1pbihcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zLmFjdGl2YXRvci53aWR0aCArXG4gICAgICAgIE51bWJlcih0aGlzLm51ZGdlV2lkdGgpICtcbiAgICAgICAgKHRoaXMuYXV0byA/IDE2IDogMCksXG4gICAgICAgIE1hdGgubWF4KHRoaXMucGFnZVdpZHRoIC0gMjQsIDApXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGNhbGN1bGF0ZWRNYXhXaWR0aCA9IGlzTmFOKHBhcnNlSW50KHRoaXMuY2FsY3VsYXRlZE1heFdpZHRoKSlcbiAgICAgICAgPyBtaW5XaWR0aFxuICAgICAgICA6IHBhcnNlSW50KHRoaXMuY2FsY3VsYXRlZE1heFdpZHRoKVxuXG4gICAgICByZXR1cm4gY29udmVydFRvVW5pdChNYXRoLm1pbihcbiAgICAgICAgY2FsY3VsYXRlZE1heFdpZHRoLFxuICAgICAgICBtaW5XaWR0aFxuICAgICAgKSkgfHwgJzAnXG4gICAgfSxcbiAgICBjYWxjdWxhdGVkVG9wICgpOiBzdHJpbmcge1xuICAgICAgY29uc3QgdG9wID0gIXRoaXMuYXV0b1xuICAgICAgICA/IHRoaXMuY2FsY1RvcCgpXG4gICAgICAgIDogY29udmVydFRvVW5pdCh0aGlzLmNhbGNZT3ZlcmZsb3codGhpcy5jYWxjdWxhdGVkVG9wQXV0bykpXG5cbiAgICAgIHJldHVybiB0b3AgfHwgJzAnXG4gICAgfSxcbiAgICBoYXNDbGlja2FibGVUaWxlcyAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gQm9vbGVhbih0aGlzLnRpbGVzLmZpbmQodGlsZSA9PiB0aWxlLnRhYkluZGV4ID4gLTEpKVxuICAgIH0sXG4gICAgc3R5bGVzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWF4SGVpZ2h0OiB0aGlzLmNhbGN1bGF0ZWRNYXhIZWlnaHQsXG4gICAgICAgIG1pbldpZHRoOiB0aGlzLmNhbGN1bGF0ZWRNaW5XaWR0aCxcbiAgICAgICAgbWF4V2lkdGg6IHRoaXMuY2FsY3VsYXRlZE1heFdpZHRoLFxuICAgICAgICB0b3A6IHRoaXMuY2FsY3VsYXRlZFRvcCxcbiAgICAgICAgbGVmdDogdGhpcy5jYWxjdWxhdGVkTGVmdCxcbiAgICAgICAgdHJhbnNmb3JtT3JpZ2luOiB0aGlzLm9yaWdpbixcbiAgICAgICAgekluZGV4OiB0aGlzLnpJbmRleCB8fCB0aGlzLmFjdGl2ZVpJbmRleCxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgaXNBY3RpdmUgKHZhbCkge1xuICAgICAgaWYgKCF2YWwpIHRoaXMubGlzdEluZGV4ID0gLTFcbiAgICB9LFxuICAgIGlzQ29udGVudEFjdGl2ZSAodmFsKSB7XG4gICAgICB0aGlzLmhhc0p1c3RGb2N1c2VkID0gdmFsXG4gICAgfSxcbiAgICBsaXN0SW5kZXggKG5leHQsIHByZXYpIHtcbiAgICAgIGlmIChuZXh0IGluIHRoaXMudGlsZXMpIHtcbiAgICAgICAgY29uc3QgdGlsZSA9IHRoaXMudGlsZXNbbmV4dF1cbiAgICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKCd2LWxpc3QtaXRlbS0taGlnaGxpZ2h0ZWQnKVxuICAgICAgICBjb25zdCBzY3JvbGxUb3AgPSB0aGlzLiRyZWZzLmNvbnRlbnQuc2Nyb2xsVG9wXG4gICAgICAgIGNvbnN0IGNvbnRlbnRIZWlnaHQgPSB0aGlzLiRyZWZzLmNvbnRlbnQuY2xpZW50SGVpZ2h0XG5cbiAgICAgICAgaWYgKHNjcm9sbFRvcCA+IHRpbGUub2Zmc2V0VG9wIC0gOCkge1xuICAgICAgICAgIGdvVG8odGlsZS5vZmZzZXRUb3AgLSB0aWxlLmNsaWVudEhlaWdodCwge1xuICAgICAgICAgICAgYXBwT2Zmc2V0OiBmYWxzZSxcbiAgICAgICAgICAgIGR1cmF0aW9uOiAzMDAsXG4gICAgICAgICAgICBjb250YWluZXI6IHRoaXMuJHJlZnMuY29udGVudCxcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFRvcCArIGNvbnRlbnRIZWlnaHQgPCB0aWxlLm9mZnNldFRvcCArIHRpbGUuY2xpZW50SGVpZ2h0ICsgOCkge1xuICAgICAgICAgIGdvVG8odGlsZS5vZmZzZXRUb3AgLSBjb250ZW50SGVpZ2h0ICsgdGlsZS5jbGllbnRIZWlnaHQgKiAyLCB7XG4gICAgICAgICAgICBhcHBPZmZzZXQ6IGZhbHNlLFxuICAgICAgICAgICAgZHVyYXRpb246IDMwMCxcbiAgICAgICAgICAgIGNvbnRhaW5lcjogdGhpcy4kcmVmcy5jb250ZW50LFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcHJldiBpbiB0aGlzLnRpbGVzICYmXG4gICAgICAgIHRoaXMudGlsZXNbcHJldl0uY2xhc3NMaXN0LnJlbW92ZSgndi1saXN0LWl0ZW0tLWhpZ2hsaWdodGVkJylcbiAgICB9LFxuICB9LFxuXG4gIGNyZWF0ZWQgKCkge1xuICAgIGNvbnN0IGJyZWFraW5nUHJvcHMgPSBbXG4gICAgICBbJ3ZhbHVlJywgJ21vZGVsVmFsdWUnXSxcbiAgICAgIFsnb25JbnB1dCcsICdvblVwZGF0ZTptb2RlbFZhbHVlJ10sXG4gICAgXVxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBicmVha2luZ1Byb3BzLmZvckVhY2goKFtvcmlnaW5hbCwgcmVwbGFjZW1lbnRdKSA9PiB7XG4gICAgICBpZiAodGhpcy4kYXR0cnMuaGFzT3duUHJvcGVydHkob3JpZ2luYWwpKSBicmVha2luZyhvcmlnaW5hbCwgcmVwbGFjZW1lbnQsIHRoaXMpXG4gICAgfSlcblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHRoaXMuJGF0dHJzLmhhc093blByb3BlcnR5KCdmdWxsLXdpZHRoJykpIHtcbiAgICAgIHJlbW92ZWQoJ2Z1bGwtd2lkdGgnLCB0aGlzKVxuICAgIH1cbiAgfSxcblxuICBtb3VudGVkICgpIHtcbiAgICB0aGlzLmlzQWN0aXZlICYmIHRoaXMuY2FsbEFjdGl2YXRlKClcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgYWN0aXZhdGUgKCkge1xuICAgICAgLy8gVXBkYXRlIGNvb3JkaW5hdGVzIGFuZCBkaW1lbnNpb25zIG9mIG1lbnVcbiAgICAgIC8vIGFuZCBpdHMgYWN0aXZhdG9yXG4gICAgICB0aGlzLnVwZGF0ZURpbWVuc2lvbnMoKVxuICAgICAgLy8gU3RhcnQgdGhlIHRyYW5zaXRpb25cbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIC8vIE9uY2UgdHJhbnNpdGlvbmluZywgY2FsY3VsYXRlIHNjcm9sbCBhbmQgdG9wIHBvc2l0aW9uXG4gICAgICAgIHRoaXMuc3RhcnRUcmFuc2l0aW9uKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuJHJlZnMuY29udGVudCkge1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVkVG9wQXV0byA9IHRoaXMuY2FsY1RvcEF1dG8oKVxuICAgICAgICAgICAgdGhpcy5hdXRvICYmICh0aGlzLiRyZWZzLmNvbnRlbnQuc2Nyb2xsVG9wID0gdGhpcy5jYWxjU2Nyb2xsUG9zaXRpb24oKSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0sXG4gICAgY2FsY1Njcm9sbFBvc2l0aW9uICgpIHtcbiAgICAgIGNvbnN0ICRlbCA9IHRoaXMuJHJlZnMuY29udGVudFxuICAgICAgY29uc3QgYWN0aXZlVGlsZSA9ICRlbC5xdWVyeVNlbGVjdG9yKCcudi1saXN0LWl0ZW0tLWFjdGl2ZScpIGFzIEhUTUxFbGVtZW50XG4gICAgICBjb25zdCBtYXhTY3JvbGxUb3AgPSAkZWwuc2Nyb2xsSGVpZ2h0IC0gJGVsLm9mZnNldEhlaWdodFxuXG4gICAgICByZXR1cm4gYWN0aXZlVGlsZVxuICAgICAgICA/IE1hdGgubWluKG1heFNjcm9sbFRvcCwgTWF0aC5tYXgoMCwgYWN0aXZlVGlsZS5vZmZzZXRUb3AgLSAkZWwub2Zmc2V0SGVpZ2h0IC8gMiArIGFjdGl2ZVRpbGUub2Zmc2V0SGVpZ2h0IC8gMikpXG4gICAgICAgIDogJGVsLnNjcm9sbFRvcFxuICAgIH0sXG4gICAgY2FsY0xlZnRBdXRvICgpIHtcbiAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLmRpbWVuc2lvbnMuYWN0aXZhdG9yLmxlZnQgLSB0aGlzLmRlZmF1bHRPZmZzZXQgKiAyKVxuICAgIH0sXG4gICAgY2FsY1RvcEF1dG8gKCkge1xuICAgICAgY29uc3QgJGVsID0gdGhpcy4kcmVmcy5jb250ZW50XG4gICAgICBjb25zdCBhY3RpdmVUaWxlID0gJGVsLnF1ZXJ5U2VsZWN0b3IoJy52LWxpc3QtaXRlbS0tYWN0aXZlJykgYXMgSFRNTEVsZW1lbnQgfCBudWxsXG5cbiAgICAgIGlmICghYWN0aXZlVGlsZSkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBudWxsXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9mZnNldFkgfHwgIWFjdGl2ZVRpbGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcHV0ZWRUb3BcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gQXJyYXkuZnJvbSh0aGlzLnRpbGVzKS5pbmRleE9mKGFjdGl2ZVRpbGUpXG5cbiAgICAgIGNvbnN0IHRpbGVEaXN0YW5jZUZyb21NZW51VG9wID0gYWN0aXZlVGlsZS5vZmZzZXRUb3AgLSB0aGlzLmNhbGNTY3JvbGxQb3NpdGlvbigpXG4gICAgICBjb25zdCBmaXJzdFRpbGVPZmZzZXRUb3AgPSAoJGVsLnF1ZXJ5U2VsZWN0b3IoJy52LWxpc3QtaXRlbScpIGFzIEhUTUxFbGVtZW50KS5vZmZzZXRUb3BcblxuICAgICAgcmV0dXJuIHRoaXMuY29tcHV0ZWRUb3AgLSB0aWxlRGlzdGFuY2VGcm9tTWVudVRvcCAtIGZpcnN0VGlsZU9mZnNldFRvcCAtIDFcbiAgICB9LFxuICAgIGNoYW5nZUxpc3RJbmRleCAoZTogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgLy8gRm9yIGluZmluaXRlIHNjcm9sbCBhbmQgYXV0b2NvbXBsZXRlLCByZS1ldmFsdWF0ZSBjaGlsZHJlblxuICAgICAgdGhpcy5nZXRUaWxlcygpXG5cbiAgICAgIGlmICghdGhpcy5pc0FjdGl2ZSB8fCAhdGhpcy5oYXNDbGlja2FibGVUaWxlcykge1xuICAgICAgICByZXR1cm5cbiAgICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09PSBrZXlDb2Rlcy50YWIpIHtcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlXG4gICAgICAgIHJldHVyblxuICAgICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT09IGtleUNvZGVzLmRvd24pIHtcbiAgICAgICAgdGhpcy5uZXh0VGlsZSgpXG4gICAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PT0ga2V5Q29kZXMudXApIHtcbiAgICAgICAgdGhpcy5wcmV2VGlsZSgpXG4gICAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PT0ga2V5Q29kZXMuZW5kKSB7XG4gICAgICAgIHRoaXMubGFzdFRpbGUoKVxuICAgICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT09IGtleUNvZGVzLmhvbWUpIHtcbiAgICAgICAgdGhpcy5maXJzdFRpbGUoKVxuICAgICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT09IGtleUNvZGVzLmVudGVyICYmIHRoaXMubGlzdEluZGV4ICE9PSAtMSkge1xuICAgICAgICB0aGlzLnRpbGVzW3RoaXMubGlzdEluZGV4XS5jbGljaygpXG4gICAgICB9IGVsc2UgeyByZXR1cm4gfVxuICAgICAgLy8gT25lIG9mIHRoZSBjb25kaXRpb25zIHdhcyBtZXQsIHByZXZlbnQgZGVmYXVsdCBhY3Rpb24gKCMyOTg4KVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfSxcbiAgICBjbG9zZUNvbmRpdGlvbmFsIChlOiBFdmVudCkge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnRcblxuICAgICAgcmV0dXJuIHRoaXMuaXNBY3RpdmUgJiZcbiAgICAgICAgIXRoaXMuX2lzRGVzdHJveWVkICYmXG4gICAgICAgIHRoaXMuY2xvc2VPbkNsaWNrICYmXG4gICAgICAgIHRoaXMuJHJlZnMuY29udGVudCAmJlxuICAgICAgICAhdGhpcy4kcmVmcy5jb250ZW50LmNvbnRhaW5zKHRhcmdldClcbiAgICB9LFxuICAgIGdlbkFjdGl2YXRvckF0dHJpYnV0ZXMgKCkge1xuICAgICAgY29uc3QgYXR0cmlidXRlcyA9IEFjdGl2YXRhYmxlLm1ldGhvZHMuZ2VuQWN0aXZhdG9yQXR0cmlidXRlcy5jYWxsKHRoaXMpXG5cbiAgICAgIGlmICh0aGlzLmFjdGl2ZVRpbGUgJiYgdGhpcy5hY3RpdmVUaWxlLmlkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uYXR0cmlidXRlcyxcbiAgICAgICAgICAnYXJpYS1hY3RpdmVkZXNjZW5kYW50JzogdGhpcy5hY3RpdmVUaWxlLmlkLFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhdHRyaWJ1dGVzXG4gICAgfSxcbiAgICBnZW5BY3RpdmF0b3JMaXN0ZW5lcnMgKCkge1xuICAgICAgY29uc3QgbGlzdGVuZXJzID0gTWVudWFibGUubWV0aG9kcy5nZW5BY3RpdmF0b3JMaXN0ZW5lcnMuY2FsbCh0aGlzKVxuXG4gICAgICBpZiAoIXRoaXMuZGlzYWJsZUtleXMpIHtcbiAgICAgICAgbGlzdGVuZXJzLm9uS2V5ZG93biA9IHRoaXMub25LZXlEb3duO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbGlzdGVuZXJzXG4gICAgfSxcbiAgICBnZW5UcmFuc2l0aW9uICgpOiBWTm9kZSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gdGhpcy5nZW5Db250ZW50KClcblxuICAgICAgaWYgKCF0aGlzLnRyYW5zaXRpb24pIHJldHVybiBjb250ZW50XG5cbiAgICAgIHJldHVybiBoKFRyYW5zaXRpb24sIHtcbiAgICAgICAgbmFtZTogdGhpcy50cmFuc2l0aW9uXG4gICAgICB9LCBbY29udGVudF0pXG4gICAgfSxcbiAgICBnZW5EaXJlY3RpdmVzICgpOiBWTm9kZURpcmVjdGl2ZVtdIHtcbiAgICAgIGNvbnN0IGRpcmVjdGl2ZXMgPSBbW1xuICAgICAgICB2U2hvdyxcbiAgICAgICAgdGhpcy5pc0NvbnRlbnRBY3RpdmVcbiAgICAgIF1dXG5cbiAgICAgIC8vIERvIG5vdCBhZGQgY2xpY2sgb3V0c2lkZSBmb3IgaG92ZXIgbWVudVxuICAgICAgaWYgKCF0aGlzLm9wZW5PbkhvdmVyICYmIHRoaXMuY2xvc2VPbkNsaWNrKSB7XG4gICAgICAgIGRpcmVjdGl2ZXMucHVzaChbXG4gICAgICAgICAgQ2xpY2tPdXRzaWRlLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGhhbmRsZXI6ICgpID0+IHsgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlIH0sXG4gICAgICAgICAgICBjbG9zZUNvbmRpdGlvbmFsOiB0aGlzLmNsb3NlQ29uZGl0aW9uYWwsXG4gICAgICAgICAgICBpbmNsdWRlOiAoKSA9PiBbdGhpcy4kZWwsIC4uLnRoaXMuZ2V0T3BlbkRlcGVuZGVudEVsZW1lbnRzKCldLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0pXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkaXJlY3RpdmVzXG4gICAgfSxcbiAgICBnZW5Db250ZW50ICgpOiBWTm9kZSB7XG4gICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAuLi50aGlzLmdldFNjb3BlSWRBdHRycygpLFxuICAgICAgICAuLi50aGlzLmNvbnRlbnRQcm9wcyxcbiAgICAgICAgcm9sZTogJ3JvbGUnIGluIHRoaXMuJGF0dHJzID8gdGhpcy4kYXR0cnMucm9sZSA6ICdtZW51JyxcbiAgICAgICAgY2xhc3M6IFsndi1tZW51X19jb250ZW50Jywge1xuICAgICAgICAgIC4uLnRoaXMucm9vdFRoZW1lQ2xhc3NlcyxcbiAgICAgICAgICAuLi50aGlzLnJvdW5kZWRDbGFzc2VzLFxuICAgICAgICAgICd2LW1lbnVfX2NvbnRlbnQtLWF1dG8nOiB0aGlzLmF1dG8sXG4gICAgICAgICAgJ3YtbWVudV9fY29udGVudC0tZml4ZWQnOiB0aGlzLmFjdGl2YXRvckZpeGVkLFxuICAgICAgICAgIG1lbnVhYmxlX19jb250ZW50X19hY3RpdmU6IHRoaXMuaXNBY3RpdmUsXG4gICAgICAgICAgW3RoaXMuY29udGVudENsYXNzLnRyaW0oKV06IHRydWUsXG4gICAgICAgIH1dLFxuICAgICAgICBzdHlsZTogdGhpcy5zdHlsZXMsXG4gICAgICAgIHJlZjogJ2NvbnRlbnQnLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudFxuXG4gICAgICAgICAgaWYgKHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJykpIHJldHVyblxuICAgICAgICAgIGlmICh0aGlzLmNsb3NlT25Db250ZW50Q2xpY2spIHRoaXMuaXNBY3RpdmUgPSBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBvbktleWRvd246IHRoaXMub25LZXlEb3duLFxuICAgICAgfSBhcyBWTm9kZURhdGFcblxuICAgICAgaWYgKHRoaXMub25TY3JvbGwpIHtcbiAgICAgICAgb3B0aW9ucy5vblNjcm9sbCA9IHRoaXMub25TY3JvbGxcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmRpc2FibGVkICYmIHRoaXMub3Blbk9uSG92ZXIpIHtcbiAgICAgICAgb3B0aW9ucy5vbk1vdXNlZW50ZXIgPSB0aGlzLm1vdXNlRW50ZXJIYW5kbGVyXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wZW5PbkhvdmVyKSB7XG4gICAgICAgIG9wdGlvbnMub25Nb3VzZWxlYXZlID0gdGhpcy5tb3VzZUxlYXZlSGFuZGxlclxuICAgICAgfVxuXG4gICAgICBjb25zdCBkaXJlY3RpdmVzID0gdGhpcy5nZW5EaXJlY3RpdmVzKClcblxuICAgICAgcmV0dXJuIHdpdGhEaXJlY3RpdmVzKGgoJ2RpdicsIG9wdGlvbnMsIHRoaXMuZ2V0Q29udGVudFNsb3QoKSksIGRpcmVjdGl2ZXMpXG4gICAgfSxcbiAgICBnZXRUaWxlcyAoKSB7XG4gICAgICBpZiAoIXRoaXMuJHJlZnMuY29udGVudCkgcmV0dXJuXG5cbiAgICAgIHRoaXMudGlsZXMgPSBBcnJheS5mcm9tKHRoaXMuJHJlZnMuY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCcudi1saXN0LWl0ZW0sIC52LWRpdmlkZXIsIC52LXN1YmhlYWRlcicpKVxuICAgIH0sXG4gICAgbW91c2VFbnRlckhhbmRsZXIgKCkge1xuICAgICAgdGhpcy5ydW5EZWxheSgnb3BlbicsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaGFzSnVzdEZvY3VzZWQpIHJldHVyblxuXG4gICAgICAgIHRoaXMuaGFzSnVzdEZvY3VzZWQgPSB0cnVlXG4gICAgICB9KVxuICAgIH0sXG4gICAgbW91c2VMZWF2ZUhhbmRsZXIgKGU6IE1vdXNlRXZlbnQpIHtcbiAgICAgIC8vIFByZXZlbnQgYWNjaWRlbnRhbCByZS1hY3RpdmF0aW9uXG4gICAgICB0aGlzLnJ1bkRlbGF5KCdjbG9zZScsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuJHJlZnMuY29udGVudD8uY29udGFpbnMoZS5yZWxhdGVkVGFyZ2V0IGFzIEhUTUxFbGVtZW50KSkgcmV0dXJuXG5cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2VcbiAgICAgICAgICB0aGlzLmNhbGxEZWFjdGl2YXRlKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSxcbiAgICBuZXh0VGlsZSAoKSB7XG4gICAgICBjb25zdCB0aWxlID0gdGhpcy50aWxlc1t0aGlzLmxpc3RJbmRleCArIDFdXG5cbiAgICAgIGlmICghdGlsZSkge1xuICAgICAgICBpZiAoIXRoaXMudGlsZXMubGVuZ3RoKSByZXR1cm5cblxuICAgICAgICB0aGlzLmxpc3RJbmRleCA9IC0xXG4gICAgICAgIHRoaXMubmV4dFRpbGUoKVxuXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0aGlzLmxpc3RJbmRleCsrXG4gICAgICBpZiAodGlsZS50YWJJbmRleCA9PT0gLTEpIHRoaXMubmV4dFRpbGUoKVxuICAgIH0sXG4gICAgcHJldlRpbGUgKCkge1xuICAgICAgY29uc3QgdGlsZSA9IHRoaXMudGlsZXNbdGhpcy5saXN0SW5kZXggLSAxXVxuXG4gICAgICBpZiAoIXRpbGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLnRpbGVzLmxlbmd0aCkgcmV0dXJuXG5cbiAgICAgICAgdGhpcy5saXN0SW5kZXggPSB0aGlzLnRpbGVzLmxlbmd0aFxuICAgICAgICB0aGlzLnByZXZUaWxlKClcblxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5saXN0SW5kZXgtLVxuICAgICAgaWYgKHRpbGUudGFiSW5kZXggPT09IC0xKSB0aGlzLnByZXZUaWxlKClcbiAgICB9LFxuICAgIGxhc3RUaWxlICgpIHtcbiAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLnRpbGVzW3RoaXMudGlsZXMubGVuZ3RoIC0gMV1cblxuICAgICAgaWYgKCF0aWxlKSByZXR1cm5cblxuICAgICAgdGhpcy5saXN0SW5kZXggPSB0aGlzLnRpbGVzLmxlbmd0aCAtIDFcblxuICAgICAgaWYgKHRpbGUudGFiSW5kZXggPT09IC0xKSB0aGlzLnByZXZUaWxlKClcbiAgICB9LFxuICAgIGZpcnN0VGlsZSAoKSB7XG4gICAgICBjb25zdCB0aWxlID0gdGhpcy50aWxlc1swXVxuXG4gICAgICBpZiAoIXRpbGUpIHJldHVyblxuXG4gICAgICB0aGlzLmxpc3RJbmRleCA9IDBcblxuICAgICAgaWYgKHRpbGUudGFiSW5kZXggPT09IC0xKSB0aGlzLm5leHRUaWxlKClcbiAgICB9LFxuICAgIG9uS2V5RG93biAoZTogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgaWYgKHRoaXMuZGlzYWJsZUtleXMpIHJldHVyblxuXG4gICAgICBpZiAoZS5rZXlDb2RlID09PSBrZXlDb2Rlcy5lc2MpIHtcbiAgICAgICAgLy8gV2FpdCBmb3IgZGVwZW5kZW50IGVsZW1lbnRzIHRvIGNsb3NlIGZpcnN0XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLmlzQWN0aXZlID0gZmFsc2UgfSlcbiAgICAgICAgY29uc3QgYWN0aXZhdG9yID0gdGhpcy5nZXRBY3RpdmF0b3IoKVxuICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiBhY3RpdmF0b3IgJiYgYWN0aXZhdG9yLmZvY3VzKCkpXG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAhdGhpcy5pc0FjdGl2ZSAmJlxuICAgICAgICBba2V5Q29kZXMudXAsIGtleUNvZGVzLmRvd25dLmluY2x1ZGVzKGUua2V5Q29kZSlcbiAgICAgICkge1xuICAgICAgICB0aGlzLmlzQWN0aXZlID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICAvLyBBbGxvdyBmb3IgaXNBY3RpdmUgd2F0Y2hlciB0byBnZW5lcmF0ZSB0aWxlIGxpc3RcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHRoaXMuY2hhbmdlTGlzdEluZGV4KGUpKVxuICAgIH0sXG4gICAgb25SZXNpemUgKCkge1xuICAgICAgaWYgKCF0aGlzLmlzQWN0aXZlKSByZXR1cm5cblxuICAgICAgLy8gQWNjb3VudCBmb3Igc2NyZWVuIHJlc2l6ZVxuICAgICAgLy8gYW5kIG9yaWVudGF0aW9uIGNoYW5nZVxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xuICAgICAgdGhpcy4kcmVmcy5jb250ZW50Lm9mZnNldFdpZHRoXG4gICAgICB0aGlzLnVwZGF0ZURpbWVuc2lvbnMoKVxuXG4gICAgICAvLyBXaGVuIHJlc2l6aW5nIHRvIGEgc21hbGxlciB3aWR0aFxuICAgICAgLy8gY29udGVudCB3aWR0aCBpcyBldmFsdWF0ZWQgYmVmb3JlXG4gICAgICAvLyB0aGUgbmV3IGFjdGl2YXRvciB3aWR0aCBoYXMgYmVlblxuICAgICAgLy8gc2V0LCBjYXVzaW5nIGl0IHRvIG5vdCBzaXplIHByb3Blcmx5XG4gICAgICAvLyBoYWNreSBidXQgd2lsbCByZXZpc2l0IGluIHRoZSBmdXR1cmVcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnJlc2l6ZVRpbWVvdXQpXG4gICAgICB0aGlzLnJlc2l6ZVRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dCh0aGlzLnVwZGF0ZURpbWVuc2lvbnMsIDEwMClcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoKTogVk5vZGUge1xuICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICBjbGFzczogWyd2LW1lbnUnLCB7XG4gICAgICAgICd2LW1lbnUtLWF0dGFjaGVkJzpcbiAgICAgICAgICB0aGlzLmF0dGFjaCA9PT0gJycgfHxcbiAgICAgICAgICB0aGlzLmF0dGFjaCA9PT0gdHJ1ZSB8fFxuICAgICAgICAgIHRoaXMuYXR0YWNoID09PSAnYXR0YWNoJyxcbiAgICAgIH1dXG4gICAgfVxuXG4gICAgY29uc3QgZGlyZWN0aXZlcyA9IFtbXG4gICAgICBSZXNpemUsXG4gICAgICB0aGlzLm9uUmVzaXplLFxuICAgICAgJzUwMCdcbiAgICBdXVxuXG4gICAgLy8gY29uc29sZS5sb2coJ3ZtZW51cmVuZGVyJywgdGhpcywgdGhpcy5hY3RpdmF0b3IsIHRoaXMuZ2V0QWN0aXZhdG9yKCkpXG5cbiAgICByZXR1cm4gd2l0aERpcmVjdGl2ZXMoaCgnZGl2JywgZGF0YSwgW1xuICAgICAgIXRoaXMuYWN0aXZhdG9yICYmIHRoaXMuZ2VuQWN0aXZhdG9yKCksXG4gICAgICB0aGlzLnNob3dMYXp5Q29udGVudCgoKSA9PiBbXG4gICAgICAgIGgoVlRoZW1lUHJvdmlkZXIsIHtcbiAgICAgICAgICByb290OiB0cnVlLFxuICAgICAgICAgIGxpZ2h0OiB0aGlzLmxpZ2h0LFxuICAgICAgICAgIGRhcms6IHRoaXMuZGFyayxcbiAgICAgICAgfSwgW3RoaXMuZ2VuVHJhbnNpdGlvbigpXSksXG4gICAgICBdKSxcbiAgICBdKSwgZGlyZWN0aXZlcylcbiAgfSxcbn0pXG4iXX0=