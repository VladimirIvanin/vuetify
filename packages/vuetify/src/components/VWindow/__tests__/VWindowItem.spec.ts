// Libraries
import { h, nextTick } from "vue";

// Components
import VWindow from "../VWindow";
import VWindowItem from "../VWindowItem";

// Utilities
import {
  mount,
  VueWrapper,
  MountingOptions,
  enableAutoUnmount
} from "@vue/test-utils";
import { waitAnimationFrame } from "../../../../test";

describe("VWindowItem.ts", () => {
  type Instance = InstanceType<typeof VWindowItem>;
  let mountFunction: (
    options?: MountingOptions<Instance>
  ) => VueWrapper<Instance>;

  // Включаем автоматическое размонтирование после каждого теста
  enableAutoUnmount(afterEach);

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VWindowItem, {
        global: {
          config: {
            warnHandler: () => {} // Подавляем предупреждения Vue
          }
        },
        ...options
      });
    };
  });

  // eslint-disable-next-line max-statements
  it("should transition content", async () => {
    const wrapper = mount(VWindow, {
      slots: {
        default: () => [h(VWindowItem)]
      },
      global: {
        config: {
          warnHandler: () => {} // Подавляем предупреждения Vue
        },
        mocks: {
          $vuetify: {
            rtl: false
          }
        }
      }
    });

    await waitAnimationFrame();

    const item = wrapper.findComponent(VWindowItem);
    const windowVm = wrapper.vm as any;
    const itemVm = item.vm as any;

    // Before enter
    expect(windowVm.isActive).toBeFalsy();
    expect(windowVm.transitionHeight).toBeUndefined();
    itemVm.onBeforeTransition();
    expect(windowVm.isActive).toBeTruthy();
    expect(windowVm.transitionHeight).toBe("0px");

    // Enter
    const el = { clientHeight: 50 };
    itemVm.onEnter(el);
    await nextTick();
    expect(windowVm.transitionHeight).toBe("50px");

    // After enter
    itemVm.onAfterTransition();
    expect(windowVm.transitionHeight).toBeUndefined();
    expect(windowVm.isActive).toBeFalsy();

    // Canceling
    itemVm.onBeforeTransition();
    itemVm.onEnter(el);
    itemVm.onTransitionCancelled();

    expect(itemVm.inTransition).toBeFalsy();
    expect(windowVm.isActive).toBeFalsy();

    // Normal path.
    itemVm.onBeforeTransition();
    expect(windowVm.isActive).toBeTruthy();
    itemVm.onAfterTransition();

    expect(windowVm.isActive).toBeFalsy();
  });

  it("should use custom transition", async () => {
    const wrapper = mountFunction({
      props: {
        transition: "foo",
        reverseTransition: "bar"
      },
      data: () => ({
        windowGroup: {
          internalReverse: false,
          register: () => {},
          unregister: () => {}
        }
      })
    });

    const vm = wrapper.vm as any;

    expect(vm.computedTransition).toBe("foo");

    await wrapper.setProps({ transition: false });
    await nextTick();
    // В Vue 3 нужно дождаться обновления computed
    expect(vm.computedTransition).toBe("");

    vm.windowGroup.internalReverse = true;
    await nextTick();
    expect(vm.computedTransition).toBe("bar");

    await wrapper.setProps({ reverseTransition: false });
    await nextTick();
    expect(vm.computedTransition).toBe("");
  });

  it("should not set initial height if no computedTransition", async () => {
    const heightChanged = jest.fn();
    const wrapper = mount(VWindow, {
      props: {
        transition: false,
        reverseTransition: false
      },
      watch: {
        transitionHeight: heightChanged
      },
      slots: {
        default: () => [h(VWindowItem)]
      },
      global: {
        config: {
          warnHandler: () => {} // Подавляем предупреждения Vue
        },
        mocks: {
          $vuetify: {
            rtl: false
          }
        }
      }
    });

    const item = wrapper.findComponent(VWindowItem);
    const windowVm = wrapper.vm as any;
    const itemVm = item.vm as any;

    expect(windowVm.computedTransition).toBeFalsy();

    itemVm.onBeforeTransition();
    expect(windowVm.isActive).toBeTruthy();
    // В Vue 3 watch может не срабатывать сразу, поэтому проверяем после nextTick
    await nextTick();
    expect(heightChanged).toHaveBeenCalledTimes(1);

    itemVm.onEnter(wrapper.element);
    await waitAnimationFrame();
    expect(windowVm.isActive).toBeTruthy();

    expect(heightChanged).toHaveBeenCalledTimes(1);
  });

  it("should increase and decrease transition count correctly", () => {
    const wrapper = mount(VWindow, {
      slots: {
        default: () => [h(VWindowItem), h(VWindowItem), h(VWindowItem)]
      },
      global: {
        config: {
          warnHandler: () => {} // Подавляем предупреждения Vue
        },
        mocks: {
          $vuetify: {
            rtl: false
          }
        }
      }
    });

    const windowVm = wrapper.vm as any;
    const items = windowVm.items as any[];
    expect(items).toHaveLength(3);

    expect(windowVm.transitionCount).toBe(0);
    expect(windowVm.isActive).toBeFalsy();
    items[0].onBeforeTransition();
    expect(windowVm.transitionCount).toBe(1);
    expect(windowVm.isActive).toBeTruthy();
    items[1].onBeforeTransition();
    expect(windowVm.transitionCount).toBe(2);
    expect(windowVm.isActive).toBeTruthy();
    items[0].onTransitionCancelled();
    expect(windowVm.transitionCount).toBe(1);
    expect(windowVm.isActive).toBeTruthy();
    items[2].onBeforeTransition();
    expect(windowVm.transitionCount).toBe(2);
    expect(windowVm.isActive).toBeTruthy();
    items[1].onAfterTransition();
    expect(windowVm.transitionCount).toBe(1);
    expect(windowVm.isActive).toBeTruthy();
    items[2].onAfterTransition();
    expect(windowVm.transitionCount).toBe(0);
    expect(windowVm.isActive).toBeFalsy();
  });
});

