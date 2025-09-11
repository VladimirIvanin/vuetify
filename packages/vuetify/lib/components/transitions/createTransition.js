import { Transition, TransitionGroup } from 'vue';
import mergeData from '../../util/mergeData';
import { h } from 'vue';

function mergeTransitions(dest = [], ...transitions) {
  /* eslint-disable-next-line no-array-constructor */
  return Array().concat(dest, ...transitions);
}

export function createSimpleTransition(name, origin = 'top center 0', mode) {
  return {
    name,
    functional: true,
    props: {
      group: {
        type: Boolean,
        default: false
      },
      hideOnLeave: {
        type: Boolean,
        default: false
      },
      leaveAbsolute: {
        type: Boolean,
        default: false
      },
      mode: {
        type: String,
        default: mode
      },
      origin: {
        type: String,
        default: origin
      }
    },

    render() {
      const tag = this.$props.group ? TransitionGroup : Transition;
      const data = {
        name,
        mode: this.$props.mode,
        onBeforeEnter: el => {
          el.style.transformOrigin = this.$props.origin;
          el.style.webkitTransformOrigin = this.$props.origin;
        }
      };

      if (this.$props.leaveAbsolute) {
        data.onLeave = mergeTransitions(data.onLeave, el => {
          const {
            offsetTop,
            offsetLeft,
            offsetWidth,
            offsetHeight
          } = el;
          el._transitionInitialStyles = {
            position: el.style.position,
            top: el.style.top,
            left: el.style.left,
            width: el.style.width,
            height: el.style.height
          };
          el.style.position = 'absolute';
          el.style.top = offsetTop + 'px';
          el.style.left = offsetLeft + 'px';
          el.style.width = offsetWidth + 'px';
          el.style.height = offsetHeight + 'px';
        });
        data.onAfterLeave = mergeTransitions(data.onAfterLeave, el => {
          if (el && el._transitionInitialStyles) {
            const {
              position,
              top,
              left,
              width,
              height
            } = el._transitionInitialStyles;
            delete el._transitionInitialStyles;
            el.style.position = position || '';
            el.style.top = top || '';
            el.style.left = left || '';
            el.style.width = width || '';
            el.style.height = height || '';
          }
        });
      }

      if (this.$props.hideOnLeave) {
        data.onLeave = mergeTransitions(data.onLeave, el => {
          el.style.setProperty('display', 'none', 'important');
        });
      }

      return h(tag, mergeData(this.$attrs, data), () => this.$slots.default());
    }

  };
}
export function createJavascriptTransition(name, functions, mode = 'in-out') {
  return {
    name,
    functional: true,
    props: {
      mode: {
        type: String,
        default: mode
      }
    },

    render() {
      return h(Transition, mergeData(this.$attrs, {
        name,
        ...functions
      }), () => this.$slots.default());
    }

  };
}
//# sourceMappingURL=createTransition.js.map